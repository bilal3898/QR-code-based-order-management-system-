# controllers/auth_controller.py

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.user import User
from extensions import db

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'customer')

    if not all([username, email, password]):
        return jsonify({'error': 'Missing required fields'}), 400

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({'error': 'Username or email already exists'}), 409

    new_user = User(username=username, email=email, role=role)
    new_user.set_password(password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({'error': 'Email and password required'}), 400

    user = User.query.filter_by(email=email).first()
    
    # Debug logging (remove in production)
    if not user:
        print(f"[DEBUG] Login attempt failed: User with email '{email}' not found")
    elif not user.check_password(password):
        print(f"[DEBUG] Login attempt failed: Invalid password for user '{email}'")
    else:
        print(f"[DEBUG] Login successful for user '{email}' (ID: {user.id}, Role: {user.role})")

    if user and user.check_password(password):
        token = create_access_token(identity=user.id, additional_claims={"role": user.role})
        return jsonify({'token': token, 'user_id': user.id, 'role': user.role}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
        'created_at': user.created_at.isoformat() if user.created_at else None
    }
    return jsonify(user_data), 200
