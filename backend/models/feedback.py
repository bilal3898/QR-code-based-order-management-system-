from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from utils.database import Base

class Feedback(Base):
    """Stores feedback messages and optional ratings from customers."""

    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    message = Column(Text, nullable=False)
    rating = Column(Integer, nullable=True)  # Optional: 1 to 5 stars
    submitted_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="feedbacks")

    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'message': self.message,
            'rating': self.rating,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None
        }

    def __repr__(self):
        return f"<Feedback(id={self.id}, customer_id={self.customer_id}, rating={self.rating})>"

    def __str__(self):
        return f"Feedback from Customer ID {self.customer_id} - Rating: {self.rating or 'N/A'}"
