from flask import Blueprint, request, jsonify
from models.customer import Customer
from utils.database import db
from utils.validators import validate_email, validate_required_fields

customer_bp = Blueprint('customer', __name__, url_prefix='/api/customers')
bp = Blueprint('customer', __name__)


@customer_bp.route('/', methods=['GET'])
def get_all_customers():
    try:
        customers = Customer.query.all()
        return jsonify([customer.to_dict() for customer in customers]), 200
    except Exception as e:
        import traceback
        error_msg = f"{str(e)}\n{traceback.format_exc()}"
        print(f"[ERROR] Customer query failed: {error_msg}")
        return jsonify({'error': str(e), 'details': error_msg}), 500


@customer_bp.route('/<int:customer_id>', methods=['GET'])
def get_customer_by_id(customer_id):
    customer = Customer.query.get(customer_id)
    if customer:
        return jsonify(customer.to_dict()), 200
    return jsonify({'error': 'Customer not found'}), 404


@customer_bp.route('/', methods=['POST'])
def create_customer():
    data = request.get_json()

    # Validate required fields
    missing_fields = validate_required_fields(data, ['name', 'email'])
    if missing_fields:
        return jsonify({'errors': f"Missing fields: {', '.join(missing_fields)}"}), 400

    # Validate email
    if not validate_email(data['email']):
        return jsonify({'errors': 'Invalid email format'}), 400

    try:
        customer = Customer(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone')
        )
        db.session.add(customer)
        db.session.commit()
        return jsonify(customer.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@customer_bp.route('/<int:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    data = request.get_json()
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404

    try:
        if 'email' in data and not validate_email(data['email']):
            return jsonify({'errors': 'Invalid email format'}), 400

        customer.name = data.get('name', customer.name)
        customer.email = data.get('email', customer.email)
        customer.phone = data.get('phone', customer.phone)
        db.session.commit()
        return jsonify(customer.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@customer_bp.route('/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    customer = Customer.query.get(customer_id)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404

    try:
        db.session.delete(customer)
        db.session.commit()
        return jsonify({'message': 'Customer deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
