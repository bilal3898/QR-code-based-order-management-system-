import re
from flask import abort

# 📧 Email Validation
def validate_email(email):
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not re.match(email_regex, email):
        abort(400, description="Invalid email format.")

# 📱 Phone Validation
def validate_phone(phone):
    phone_regex = r'^\d{10}$'
    if not re.match(phone_regex, phone):
        abort(400, description="Invalid phone number format.")

# ➕ Positive Number Validation
def validate_positive_number(value, field_name="value"):
    if value < 0:
        abort(400, description=f"{field_name} must be a positive number.")

# ✅ Required Fields Validation
def validate_required_fields(data, required_fields):
    missing = [field for field in required_fields if field not in data]
    if missing:
        abort(400, description=f"Missing required fields: {', '.join(missing)}")

# 🍽️ Menu Item Validation
def validate_menu_item_data(data):
    required_fields = ['name', 'description', 'price', 'category']
    validate_required_fields(data, required_fields)

    if not isinstance(data['name'], str) or not data['name'].strip():
        abort(400, description="Menu item name must be a non-empty string.")

    if not isinstance(data['description'], str):
        abort(400, description="Description must be a string.")

    if not isinstance(data['price'], (int, float)) or data['price'] <= 0:
        abort(400, description="Price must be a positive number.")

    if not isinstance(data['category'], str) or not data['category'].strip():
        abort(400, description="Category must be a non-empty string.")

# 🪑 Table Validation
def validate_table_data(data):
    required_fields = ['number', 'seats']
    validate_required_fields(data, required_fields)

    if not isinstance(data['number'], int) or data['number'] <= 0:
        abort(400, description="Table number must be a positive integer.")

    if not isinstance(data['seats'], int) or data['seats'] <= 0:
        abort(400, description="Number of seats must be a positive integer.")

# 📦 Inventory Item Validation
def validate_inventory_data(data):
    required_fields = ['name', 'quantity', 'unit', 'reorder_level']
    validate_required_fields(data, required_fields)

    if not isinstance(data['name'], str) or not data['name'].strip():
        abort(400, description="Inventory item name must be a non-empty string.")

    if not isinstance(data['quantity'], (int, float)) or data['quantity'] < 0:
        abort(400, description="Quantity must be a non-negative number.")

    if not isinstance(data['unit'], str) or not data['unit'].strip():
        abort(400, description="Unit must be a non-empty string.")

    if not isinstance(data['reorder_level'], (int, float)) or data['reorder_level'] < 0:
        abort(400, description="Reorder level must be a non-negative number.")

# 🧑 Customer Validation
def validate_customer_data(data):
    required_fields = ['name', 'email', 'phone']
    validate_required_fields(data, required_fields)
    validate_email(data['email'])
    validate_phone(data['phone'])

# 📆 Reservation Validation
def validate_reservation_data(data):
    required_fields = ['customer_id', 'table_id', 'reservation_time']
    validate_required_fields(data, required_fields)

# 🧾 Feedback Validation
def validate_feedback_data(data):
    required_fields = ['customer_id', 'message']
    validate_required_fields(data, required_fields)

# 🔐 User Validation
def validate_user_data(data):
    required_fields = ['username', 'email', 'password']
    validate_required_fields(data, required_fields)
    validate_email(data['email'])

# 🧾 Bill Validation
def validate_bill_data(data):
    required_fields = ['order_id', 'total_amount']
    validate_required_fields(data, required_fields)

    if not isinstance(data['total_amount'], (int, float)) or data['total_amount'] < 0:
        abort(400, description="Total amount must be a non-negative number.")
