# models/table.py

from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from utils.database import Base

class Table(Base):
    __tablename__ = "tables"

    id = Column(Integer, primary_key=True, index=True)
    table_number = Column(String, nullable=False, unique=True)
    capacity = Column(Integer, nullable=False)
    is_occupied = Column(Boolean, default=False)
    location = Column(String, nullable=True)  # Optional: e.g., "Indoor", "Outdoor", etc.

    # Relationships
    reservations = relationship("Reservation", back_populates="table", cascade="all, delete-orphan")
    orders = relationship("Order", back_populates="table", cascade="all, delete-orphan")
    qr_code = relationship("QRCode", back_populates="table", uselist=False, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'table_number': self.table_number,
            'capacity': self.capacity,
            'is_occupied': self.is_occupied,
            'location': self.location
        }

    def __repr__(self):
        return f"<Table(id={self.id}, number={self.table_number}, capacity={self.capacity}, occupied={self.is_occupied})>"
