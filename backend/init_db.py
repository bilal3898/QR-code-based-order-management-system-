#!/usr/bin/env python3
"""
Database initialization script for Restaurant Management System
Run this script to create all database tables.
"""

from app import create_app
from extensions import db
# Import all models to ensure they're registered with SQLAlchemy
from models import (
    Customer, Table, MenuItem, OrderItem, Order, Bill,
    Reservation, InventoryItem, User, Feedback, QRCode, Payment
)

def init_database():
    """Initialize the database by creating all tables."""
    app = create_app()
    
    with app.app_context():
        # Drop all tables (use with caution in production!)
        # db.drop_all()
        
        # Create all tables
        db.create_all()
        print("[SUCCESS] Database tables created successfully!")
        
        # Create a default admin user if it doesn't exist
        from models.user import User
        admin = User.query.filter_by(username='admin').first()
        if not admin:
            admin = User(username='admin', email='admin@restaurant.com', role='admin')
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print("[SUCCESS] Default admin user created!")
            print("   Username: admin")
            print("   Password: admin123")
        else:
            print("[INFO] Admin user already exists.")

if __name__ == '__main__':
    init_database()

