from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from utils.database import Base

class Customer(Base):
    """Represents a customer who can give feedback and place orders."""

    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=True)
    phone_number = Column(String(15), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    feedbacks = relationship("Feedback", back_populates="customer", cascade="all, delete-orphan")
    reservations = relationship("Reservation", back_populates="customer", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone_number': self.phone_number,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<Customer(id={self.id}, name='{self.name}', phone='{self.phone_number}')>"

    def __str__(self):
        return f"{self.name} ({self.phone_number})"
