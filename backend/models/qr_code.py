# models/qr_code.py

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from utils.database import Base

class QRCode(Base):
    __tablename__ = "qr_codes"

    id = Column(Integer, primary_key=True, index=True)
    table_id = Column(Integer, ForeignKey("tables.id"), nullable=False, unique=True)
    qr_code_url = Column(String, nullable=False)  # Path or URL to the generated QR code image
    created_at = Column(DateTime, default=datetime.utcnow)

    table = relationship("Table", back_populates="qr_code")

    def __repr__(self):
        return f"<QRCode(id={self.id}, table_id={self.table_id})>"
