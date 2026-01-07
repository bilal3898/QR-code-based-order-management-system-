# models/order.py

from sqlalchemy import Column, Integer, ForeignKey, Float, String, Enum, DateTime
from sqlalchemy.orm import relationship
from utils.database import Base
from extensions import db
from datetime import datetime
import enum

class OrderStatus(enum.Enum):
    PENDING = "Pending"
    PREPARING = "Preparing"
    SERVED = "Served"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    table_id = Column(Integer, ForeignKey("tables.id"), nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    total_price = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    customer = relationship("Customer", backref="orders")
    table = relationship("Table", back_populates="orders")  # Use back_populates since Table already defines orders
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    bill = relationship("Bill", back_populates="order", uselist=False)  # One order can have one bill

    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'table_id': self.table_id,
            'status': self.status.value if self.status else None,
            'total_price': self.total_price,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'items': [{
                'id': item.id,
                'menu_item_id': item.menu_item_id,
                'quantity': item.quantity,
                'price': item.price
            } for item in self.items] if self.items else []
        }

    def __repr__(self):
        return f"<Order(id={self.id}, table_id={self.table_id}, status={self.status.name}, total={self.total_price})>"
