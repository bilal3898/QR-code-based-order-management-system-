# controllers/bill_controller.py

from flask import Blueprint, request, jsonify
from models.bill import Bill
from models.order import Order
from utils.database import db
from utils.tax_calculator import calculate_tax
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

bill_bp = Blueprint('bill', __name__, url_prefix='/api/bills')
bp = Blueprint('bill', __name__)

@bill_bp.route('/', methods=['GET'])
def get_all_bills():
    try:
        bills = Bill.query.all()
        return jsonify([bill.to_dict() for bill in bills]), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500


@bill_bp.route('/<int:bill_id>', methods=['GET'])
def get_bill(bill_id):
    bill = Bill.query.get(bill_id)
    if not bill:
        return jsonify({'error': 'Bill not found'}), 404
    return jsonify(bill.to_dict()), 200


@bill_bp.route('/generate/<int:order_id>', methods=['POST'])
def generate_bill(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    try:
        subtotal = sum(item.price * item.quantity for item in order.items)
        tax = calculate_tax(subtotal)
        total = subtotal + tax

        bill = Bill(
            order_id=order_id,
            subtotal=subtotal,
            tax=tax,
            total=total,
            issued_at=datetime.utcnow()
        )
        db.session.add(bill)
        db.session.commit()

        return jsonify(bill.to_dict()), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@bill_bp.route('/<int:bill_id>', methods=['DELETE'])
def delete_bill(bill_id):
    bill = Bill.query.get(bill_id)
    if not bill:
        return jsonify({'error': 'Bill not found'}), 404

    try:
        db.session.delete(bill)
        db.session.commit()
        return jsonify({'message': 'Bill deleted'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
