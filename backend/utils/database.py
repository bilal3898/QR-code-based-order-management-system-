from flask_migrate import Migrate
from extensions import db  # Import db from extensions (same instance used by app)

# Base should be db.Model for models to work with Flask-SQLAlchemy
# This will work because extensions.db is initialized before models are used
Base = db.Model
migrate = Migrate()

# Re-export db so other modules can import it from utils.database
__all__ = ['db', 'Base', 'migrate']