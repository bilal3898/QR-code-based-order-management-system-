# services/payment_service.py

import os
import requests
import logging
from datetime import datetime
from models.payment import Payment, PaymentStatus, PaymentMethod
from extensions import db

logger = logging.getLogger(__name__)

class PaymentService:
    """Service for handling payment processing with Razorpay/Stripe integration"""
    
    def __init__(self):
        # Razorpay credentials
        self.razorpay_key_id = os.getenv("RAZORPAY_KEY_ID")
        self.razorpay_key_secret = os.getenv("RAZORPAY_KEY_SECRET")
        self.razorpay_base_url = "https://api.razorpay.com/v1"
        
        # Stripe credentials
        self.stripe_secret_key = os.getenv("STRIPE_SECRET_KEY")
        self.stripe_publishable_key = os.getenv("STRIPE_PUBLISHABLE_KEY")
        self.stripe_base_url = "https://api.stripe.com/v1"
    
    def create_razorpay_order(self, amount, currency="INR", receipt=None):
        """Create a Razorpay order"""
        if not self.razorpay_key_id or not self.razorpay_key_secret:
            raise ValueError("Razorpay credentials not configured")
        
        url = f"{self.razorpay_base_url}/orders"
        headers = {
            "Authorization": f"Basic {self._get_razorpay_auth()}",
            "Content-Type": "application/json"
        }
        data = {
            "amount": int(amount * 100),  # Convert to paise
            "currency": currency,
            "receipt": receipt or f"receipt_{int(datetime.now().timestamp())}"
        }
        
        try:
            response = requests.post(url, json=data, headers=headers, auth=(self.razorpay_key_id, self.razorpay_key_secret))
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Razorpay order creation failed: {str(e)}")
            raise
    
    def verify_razorpay_payment(self, payment_id, order_id, signature):
        """Verify Razorpay payment signature"""
        import hmac
        import hashlib
        
        message = f"{order_id}|{payment_id}"
        generated_signature = hmac.new(
            self.razorpay_key_secret.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(generated_signature, signature)
    
    def create_stripe_payment_intent(self, amount, currency="usd", metadata=None):
        """Create a Stripe payment intent"""
        if not self.stripe_secret_key:
            raise ValueError("Stripe credentials not configured")
        
        url = f"{self.stripe_base_url}/payment_intents"
        headers = {
            "Authorization": f"Bearer {self.stripe_secret_key}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {
            "amount": int(amount * 100),  # Convert to cents
            "currency": currency,
            "metadata": metadata or {}
        }
        
        try:
            response = requests.post(url, data=data, headers=headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"Stripe payment intent creation failed: {str(e)}")
            raise
    
    def process_payment(self, bill_id, order_id, amount, payment_method, transaction_id=None, gateway_response=None):
        """Process a payment and save to database"""
        try:
            payment = Payment(
                bill_id=bill_id,
                order_id=order_id,
                amount=amount,
                payment_method=PaymentMethod[payment_method.upper()] if isinstance(payment_method, str) else payment_method,
                status=PaymentStatus.PROCESSING,
                transaction_id=transaction_id,
                payment_gateway_response=str(gateway_response) if gateway_response else None
            )
            
            db.session.add(payment)
            db.session.commit()
            
            return payment
        except Exception as e:
            db.session.rollback()
            logger.error(f"Payment processing failed: {str(e)}")
            raise
    
    def update_payment_status(self, payment_id, status, transaction_id=None):
        """Update payment status"""
        try:
            payment = Payment.query.get(payment_id)
            if not payment:
                raise ValueError(f"Payment {payment_id} not found")
            
            payment.status = PaymentStatus[status.upper()] if isinstance(status, str) else status
            if transaction_id:
                payment.transaction_id = transaction_id
            
            db.session.commit()
            return payment
        except Exception as e:
            db.session.rollback()
            logger.error(f"Payment status update failed: {str(e)}")
            raise
    
    def _get_razorpay_auth(self):
        """Get Razorpay basic auth string"""
        import base64
        credentials = f"{self.razorpay_key_id}:{self.razorpay_key_secret}"
        return base64.b64encode(credentials.encode()).decode()

