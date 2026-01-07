# models/reservation.py

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from utils.database import Base

class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False)
    table_id = Column(Integer, ForeignKey("tables.id", ondelete="SET NULL"))
    reservation_time = Column(DateTime, nullable=False)
    guests = Column(Integer, nullable=False)
    status = Column(String(20), default="pending")  # pending, confirmed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("Customer", back_populates="reservations")
    table = relationship("Table", back_populates="reservations")

    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'table_id': self.table_id,
            'reservation_time': self.reservation_time.isoformat() if self.reservation_time else None,
            'guests': self.guests,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return (
            f"<Reservation(customer_id={self.customer_id}, table_id={self.table_id}, "
            f"time={self.reservation_time}, guests={self.guests}, status={self.status})>"
        )
