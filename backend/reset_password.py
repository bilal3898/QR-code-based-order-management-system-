"""Script to reset a user's password."""
from app import create_app
from extensions import db
from models.user import User

app = create_app()

with app.app_context():
    email = '2023513602.bilal@ug.sharda.ac.in'
    new_password = 'bilal123'  # Change this to your desired password
    
    user = User.query.filter_by(email=email).first()
    
    if not user:
        print(f"[ERROR] User with email '{email}' not found!")
    else:
        # Reset password
        user.set_password(new_password)
        db.session.commit()
        
        # Verify the password was set correctly
        if user.check_password(new_password):
            print(f"[SUCCESS] Password reset successfully for '{email}'!")
            print(f"   New password: {new_password}")
            print(f"   Password verification: OK")
        else:
            print(f"[ERROR] Password was set but verification failed!")

