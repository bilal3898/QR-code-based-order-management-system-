# models/menu_item.py

from sqlalchemy import Column, Integer, String, Float, Boolean
from utils.database import Base

class MenuItem(Base):
    __tablename__ = "menu_items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(String(255))
    price = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)
    is_available = Column(Boolean, default=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'category': self.category,
            'is_available': self.is_available
        }

    def __repr__(self):
        return (
            f"<MenuItem(id={self.id}, name='{self.name}', price={self.price}, "
            f"category='{self.category}', available={self.is_available})>"
        )
