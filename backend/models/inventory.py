# models/inventory.py

from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from utils.database import Base
from extensions import db

class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    quantity = Column(Float, nullable=False)
    unit = Column(String(20), nullable=False)  # e.g., kg, liter, piece
    reorder_level = Column(Float, nullable=False)  # Threshold for reordering
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'quantity': self.quantity,
            'unit': self.unit,
            'reorder_level': self.reorder_level,
            'last_updated': self.last_updated.isoformat() if self.last_updated else None
        }

    def __repr__(self):
        return (
            f"<InventoryItem(name='{self.name}', quantity={self.quantity}, "
            f"unit='{self.unit}', reorder_level={self.reorder_level})>"
        )
