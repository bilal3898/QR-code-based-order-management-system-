# models/payment.py

from sqlalchemy import Column, Integer, Float, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from utils.database import Base
from extensions import db
from datetime import datetime
import enum

class PaymentStatus(enum.Enum):
    PENDING = "Pending"
    PROCESSING = "Processing"
    COMPLETED = "Completed"
    FAILED = "Failed"
    REFUNDED = "Refunded"

class PaymentMethod(enum.Enum):
    CASH = "Cash"
    CARD = "Card"
    UPI = "UPI"
    RAZORPAY = "Razorpay"
    STRIPE = "Stripe"
    ONLINE = "Online"

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    bill_id = Column(Integer, ForeignKey("bills.id"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=True)
    amount = Column(Float, nullable=False)
    payment_method = Column(Enum(PaymentMethod), nullable=False)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    transaction_id = Column(String(255), unique=True, nullable=True)  # External payment gateway ID
    payment_gateway_response = Column(Text, nullable=True)  # Store gateway response JSON
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships - using string references for lazy loading
    # These will be resolved when all models are imported
    bill = relationship("Bill", backref="payments")
    order = relationship("Order", backref="payments")

    def to_dict(self):
        return {
            'id': self.id,
            'bill_id': self.bill_id,
            'order_id': self.order_id,
            'amount': self.amount,
            'payment_method': self.payment_method.value if self.payment_method else None,
            'status': self.status.value if self.status else None,
            'transaction_id': self.transaction_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<Payment(id={self.id}, bill_id={self.bill_id}, amount={self.amount}, status={self.status.name})>"

