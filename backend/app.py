from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Extensions
from extensions import db, jwt, socketio
from utils.database import migrate

# Middleware
from middlewares.rate_limiter import limiter

# Controllers
from controllers import (
    customer_controller,
    table_controller,
    menu_controller,
    order_controller,
    bill_controller,
    reservation_controller,
    inventory_controller,
    feedback_controller,
    report_controller,
    auth_controller,
    qr_code_controller,
    payment_controller,
    notification_controller
)

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')
    
    # Disable strict slashes to prevent 308 redirects on API routes
    app.url_map.strict_slashes = False

    # Debug: Print database URI (mask password for security)
    db_uri = app.config.get('SQLALCHEMY_DATABASE_URI', '')
    if db_uri:
        # Mask password in URI for logging
        import re
        masked_uri = re.sub(r':([^:@]+)@', r':****@', db_uri)
        print(f"[DEBUG] Database URI: {masked_uri}")
    else:
        print("[WARNING] SQLALCHEMY_DATABASE_URI is not set!")

    # CORS setup - use specific origins when credentials are enabled
    # Cannot use "*" with credentials, so we specify allowed origins
    allowed_origins = app.config.get("CORS_ORIGINS", ["http://localhost:3000"])
    if isinstance(allowed_origins, str):
        allowed_origins = [origin.strip() for origin in allowed_origins.split(",")]
    
    CORS(app, 
         resources={r"/api/*": {
             "origins": allowed_origins,  # Specific origins required when credentials enabled
             "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
             "allow_headers": ["Content-Type", "Authorization"],
             "supports_credentials": True,
             "expose_headers": ["Content-Type", "Authorization"]
         }},
         supports_credentials=True,
         automatic_options=True)

    # Init Extensions
    db.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app, cors_allowed_origins=allowed_origins)
    
    # Import migrate after db is initialized
    from utils.database import migrate
    migrate.init_app(app, db)
    
    # Import ALL models BEFORE any relationships are resolved
    # Critical import order:
    # 1. OrderItem must be imported before Order (Order references OrderItem)
    # 2. Bill must be imported before Payment (Payment references Bill)
    from models.customer import Customer
    from models.inventory import InventoryItem
    from models.menu_item import MenuItem
    from models.reservation import Reservation
    from models.table import Table
    from models.feedback import Feedback
    from models.user import User
    from models.qr_code import QRCode
    from models.order_item import OrderItem  # Must be imported before Order
    from models.order import Order  # Order references OrderItem
    from models.bill import Bill  # Must be imported before Payment
    from models.payment import Payment  # Payment references Bill

    limiter.init_app(app)


    # Register Blueprints
    app.register_blueprint(customer_controller.customer_bp)
    app.register_blueprint(table_controller.table_bp)
    app.register_blueprint(menu_controller.menu_bp)
    app.register_blueprint(order_controller.order_bp)
    app.register_blueprint(bill_controller.bill_bp)
    app.register_blueprint(reservation_controller.reservation_bp)
    app.register_blueprint(inventory_controller.inventory_bp)
    app.register_blueprint(feedback_controller.feedback_bp)
    app.register_blueprint(report_controller.report_bp)
    app.register_blueprint(auth_controller.auth_bp)
    app.register_blueprint(qr_code_controller.qr_bp)
    app.register_blueprint(payment_controller.payment_bp)
    app.register_blueprint(notification_controller.notification_bp)
    
    # Import and register SocketIO events
    from events import socket_events

    # Store allowed origins in app config for access in handlers
    app.config['ALLOWED_ORIGINS'] = allowed_origins
    
    # Handle OPTIONS requests explicitly to prevent 308 redirects
    @app.before_request
    def handle_preflight():
        from flask import request
        if request.method == "OPTIONS":
            response = jsonify({})
            # Use specific origin instead of wildcard when credentials are enabled
            origin = request.headers.get('Origin')
            allowed = app.config.get('ALLOWED_ORIGINS', allowed_origins)
            if origin and origin in allowed:
                response.headers.add("Access-Control-Allow-Origin", origin)
            else:
                response.headers.add("Access-Control-Allow-Origin", allowed[0] if allowed else "*")
            response.headers.add('Access-Control-Allow-Headers', "Content-Type,Authorization")
            response.headers.add('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE,OPTIONS,PATCH")
            response.headers.add('Access-Control-Allow-Credentials', "true")
            response.headers.add('Access-Control-Max-Age', "3600")
            return response
        
        # Log all requests for debugging
        print(f"[REQUEST] {request.method} {request.path}")

    # Register error handlers
    from middlewares.error_handler import handle_http_exception, handle_general_exception
    from werkzeug.exceptions import HTTPException
    app.register_error_handler(HTTPException, handle_http_exception)
    app.register_error_handler(Exception, handle_general_exception)

    @app.route('/')
    def index():
        return jsonify({"message": "Restaurant Management System API Running..."}), 200

    return app

if __name__ == '__main__':
    app = create_app()
    socketio.run(app, debug=True, port=5000, allow_unsafe_werkzeug=True)
