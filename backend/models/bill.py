# models/bill.py

from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from utils.database import Base
from extensions import db

class Bill(Base):
    __tablename__ = "bills"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    total_amount = Column(Float, nullable=False)
    tax_amount = Column(Float, nullable=False)
    discount = Column(Float, default=0.0)
    final_amount = Column(Float, nullable=False)
    issued_at = Column(DateTime, default=datetime.utcnow)

    # Relationship with order
    order = relationship("Order", back_populates="bill")

    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'total_amount': self.total_amount,
            'tax_amount': self.tax_amount,
            'discount': self.discount,
            'final_amount': self.final_amount,
            'issued_at': self.issued_at.isoformat() if self.issued_at else None
        }

    def __repr__(self):
        return (
            f"<Bill(order_id={self.order_id}, total={self.total_amount}, "
            f"tax={self.tax_amount}, discount={self.discount}, final={self.final_amount})>"
        )
