# services/order_tracking_service.py

from sqlalchemy.orm import Session
from models.order import Order
from datetime import datetime
import logging

class OrderTrackingService:
    def __init__(self, db: Session):
        self.db = db

    def get_order_status(self, order_id: int):
        try:
            order = self.db.query(Order).filter(Order.id == order_id).first()
            if not order:
                return {"error": "Order not found"}
            return {
                "order_id": order.id,
                "status": order.status,
                "placed_at": order.placed_at.strftime("%Y-%m-%d %H:%M"),
                "updated_at": order.updated_at.strftime("%Y-%m-%d %H:%M") if order.updated_at else None
            }
        except Exception as e:
            logging.error(f"Error fetching order status: {str(e)}")
            return {"error": str(e)}

    def update_order_status(self, order_id: int, new_status: str):
        try:
            order = self.db.query(Order).filter(Order.id == order_id).first()
            if not order:
                return {"error": "Order not found"}
            order.status = new_status
            order.updated_at = datetime.utcnow()
            self.db.commit()
            return {
                "message": "Order status updated successfully",
                "order_id": order.id,
                "new_status": order.status
            }
        except Exception as e:
            logging.error(f"Error updating order status: {str(e)}")
            return {"error": str(e)}

    def list_all_active_orders(self):
        try:
            active_orders = self.db.query(Order).filter(Order.status != "Delivered").all()
            return [
                {
                    "order_id": order.id,
                    "status": order.status,
                    "table_id": order.table_id,
                    "placed_at": order.placed_at.strftime("%Y-%m-%d %H:%M")
                } for order in active_orders
            ]
        except Exception as e:
            logging.error(f"Error listing active orders: {str(e)}")
            return {"error": str(e)}
