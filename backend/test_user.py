"""Test script to verify user creation and password checking."""
from app import create_app
from extensions import db
from models.user import User

app = create_app()

with app.app_context():
    # Check if admin user exists
    admin = User.query.filter_by(email='admin@restaurant.com').first()
    
    if admin:
        print(f"[SUCCESS] Admin user found:")
        print(f"   ID: {admin.id}")
        print(f"   Username: {admin.username}")
        print(f"   Email: {admin.email}")
        print(f"   Role: {admin.role}")
        print(f"   Password hash: {admin.password[:50]}...")
        
        # Test password checking
        test_password = 'admin123'
        password_match = admin.check_password(test_password)
        print(f"\n[TEST] Password check for 'admin123': {password_match}")
        
        if not password_match:
            print("[WARNING] Password check failed! Re-setting password...")
            admin.set_password('admin123')
            db.session.commit()
            print("[SUCCESS] Password re-set. Testing again...")
            password_match = admin.check_password('admin123')
            print(f"[TEST] Password check after re-set: {password_match}")
    else:
        print("[ERROR] Admin user not found!")
        print("Creating admin user...")
        admin = User(username='admin', email='admin@restaurant.com', role='admin')
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
        print("[SUCCESS] Admin user created!")

