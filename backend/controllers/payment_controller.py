# controllers/payment_controller.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from services.payment_service import PaymentService
from models.payment import Payment, PaymentStatus, PaymentMethod
from models.user import User
from extensions import db
from utils.rbac import require_role

payment_bp = Blueprint('payment', __name__, url_prefix='/api/payments')
payment_service = PaymentService()

@payment_bp.route('/', methods=['GET'])
@jwt_required()
@require_role(['admin', 'manager', 'cashier'])
def get_payments():
    """Get all payments (admin/manager/cashier only)"""
    try:
        payments = Payment.query.order_by(Payment.created_at.desc()).all()
        return jsonify([p.to_dict() for p in payments]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/<int:payment_id>', methods=['GET'])
@jwt_required()
def get_payment(payment_id):
    """Get a specific payment"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        payment = Payment.query.get(payment_id)
        
        if not payment:
            return jsonify({'error': 'Payment not found'}), 404
        
        # Users can only view their own payments unless admin/manager/cashier
        if user.role not in ['admin', 'manager', 'cashier']:
            if payment.bill and payment.bill.customer_id:
                # Check if payment belongs to user's order
                pass  # Add customer check if needed
        
        return jsonify(payment.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/create-razorpay-order', methods=['POST'])
@jwt_required()
def create_razorpay_order():
    """Create a Razorpay order for payment"""
    try:
        data = request.get_json()
        amount = float(data.get('amount', 0))
        currency = data.get('currency', 'INR')
        receipt = data.get('receipt')
        
        if amount <= 0:
            return jsonify({'error': 'Invalid amount'}), 400
        
        order_data = payment_service.create_razorpay_order(amount, currency, receipt)
        return jsonify(order_data), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/verify-razorpay', methods=['POST'])
@jwt_required()
def verify_razorpay_payment():
    """Verify Razorpay payment and save to database"""
    try:
        data = request.get_json()
        payment_id = data.get('payment_id')
        order_id = data.get('order_id')
        signature = data.get('signature')
        bill_id = data.get('bill_id')
        amount = float(data.get('amount', 0))
        
        if not all([payment_id, order_id, signature, bill_id]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Verify payment signature
        is_valid = payment_service.verify_razorpay_payment(payment_id, order_id, signature)
        
        if not is_valid:
            return jsonify({'error': 'Invalid payment signature'}), 400
        
        # Save payment to database
        payment = payment_service.process_payment(
            bill_id=bill_id,
            order_id=data.get('order_id'),
            amount=amount,
            payment_method='razorpay',
            transaction_id=payment_id,
            gateway_response=data
        )
        
        # Update payment status to completed
        payment_service.update_payment_status(payment.id, 'completed', payment_id)
        
        return jsonify({
            'message': 'Payment verified and processed successfully',
            'payment': payment.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/create-stripe-intent', methods=['POST'])
@jwt_required()
def create_stripe_intent():
    """Create a Stripe payment intent"""
    try:
        data = request.get_json()
        amount = float(data.get('amount', 0))
        currency = data.get('currency', 'usd')
        metadata = data.get('metadata', {})
        
        if amount <= 0:
            return jsonify({'error': 'Invalid amount'}), 400
        
        intent = payment_service.create_stripe_payment_intent(amount, currency, metadata)
        return jsonify(intent), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/process', methods=['POST'])
@jwt_required()
def process_payment():
    """Process a payment (cash, card, UPI)"""
    try:
        data = request.get_json()
        bill_id = data.get('bill_id')
        order_id = data.get('order_id')
        amount = float(data.get('amount', 0))
        payment_method = data.get('payment_method', 'cash')
        
        if not bill_id or amount <= 0:
            return jsonify({'error': 'Invalid payment data'}), 400
        
        payment = payment_service.process_payment(
            bill_id=bill_id,
            order_id=order_id,
            amount=amount,
            payment_method=payment_method,
            transaction_id=data.get('transaction_id')
        )
        
        # For cash/card/UPI, mark as completed immediately
        if payment_method.lower() in ['cash', 'card', 'upi']:
            payment_service.update_payment_status(payment.id, 'completed')
        
        return jsonify({
            'message': 'Payment processed successfully',
            'payment': payment.to_dict()
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payment_bp.route('/<int:payment_id>/status', methods=['PUT'])
@jwt_required()
@require_role(['admin', 'manager', 'cashier'])
def update_payment_status(payment_id):
    """Update payment status (admin/manager/cashier only)"""
    try:
        data = request.get_json()
        status = data.get('status')
        
        if not status:
            return jsonify({'error': 'Status required'}), 400
        
        payment = payment_service.update_payment_status(payment_id, status)
        return jsonify({
            'message': 'Payment status updated',
            'payment': payment.to_dict()
        }), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

