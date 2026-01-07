# models/order_item.py

from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from utils.database import Base

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    menu_item_id = Column(Integer, ForeignKey("menu_items.id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)  # price at time of order

    # Relationships
    order = relationship("Order", back_populates="items")
    menu_item = relationship("MenuItem", backref="order_items")

    def __repr__(self):
        return f"<OrderItem(order_id={self.order_id}, menu_item_id={self.menu_item_id}, quantity={self.quantity}, price={self.price})>"
