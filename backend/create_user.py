"""Script to create a user with a specific email."""
from app import create_app
from extensions import db
from models.user import User

app = create_app()

with app.app_context():
    email = '2023513602.bilal@ug.sharda.ac.in'
    username = 'bilal'  # You can change this
    password = 'bilal123'  # You can change this
    
    # Check if user already exists
    existing_user = User.query.filter_by(email=email).first()
    
    if existing_user:
        print(f"[INFO] User with email '{email}' already exists!")
        print(f"   Username: {existing_user.username}")
        print(f"   Role: {existing_user.role}")
    else:
        # Create new user
        new_user = User(
            username=username,
            email=email,
            role='admin'  # Set to 'admin' or 'customer' as needed
        )
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        print(f"[SUCCESS] User created successfully!")
        print(f"   Email: {email}")
        print(f"   Username: {username}")
        print(f"   Password: {password}")
        print(f"   Role: {new_user.role}")

