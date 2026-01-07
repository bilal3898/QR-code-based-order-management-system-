from models.order import Order
from models.bill import Bill
from models.inventory import InventoryItem
from models.reservation import Reservation
from models.feedback import Feedback
from sqlalchemy.orm import Session
from datetime import datetime
import logging

class ReportService:
    def __init__(self, db: Session):
        self.db = db

    def get_sales_report(self, start_date: str = None, end_date: str = None):
        try:
            query = self.db.query(Bill)
            
            # Filter by date range if provided
            if start_date:
                start = datetime.strptime(start_date, '%Y-%m-%d')
                query = query.filter(Bill.issued_at >= start)
            if end_date:
                end = datetime.strptime(end_date, '%Y-%m-%d')
                # Add one day to include the entire end_date
                from datetime import timedelta
                end = end + timedelta(days=1)
                query = query.filter(Bill.issued_at < end)
            
            bills = query.all()
            total_revenue = sum(bill.total_amount for bill in bills)
            report = {
                "start_date": start_date,
                "end_date": end_date,
                "total_orders": len(bills),
                "total_revenue": float(total_revenue)
            }
            return report
        except Exception as e:
            logging.error(f"Error generating sales report: {str(e)}")
            return {"error": str(e)}

    def get_inventory_report(self):
        try:
            items = self.db.query(InventoryItem).all()
            report = [
                {
                    "item_name": item.name,
                    "quantity": item.quantity,
                    "unit": item.unit,
                    "reorder_level": item.reorder_level,
                    "last_updated": item.last_updated.strftime("%Y-%m-%d %H:%M") if item.last_updated else None
                }
                for item in items
            ]
            return report
        except Exception as e:
            logging.error(f"Error generating inventory report: {str(e)}")
            return {"error": str(e)}

    def get_reservation_report(self, date: str = None):
        try:
            if date:
                date_obj = datetime.strptime(date, '%Y-%m-%d')
                reservations = self.db.query(Reservation).filter(Reservation.reservation_time >= date_obj).all()
            else:
                reservations = self.db.query(Reservation).all()
            report = [
                {
                    "reservation_id": r.id,
                    "customer_id": r.customer_id,
                    "table_id": r.table_id,
                    "reservation_time": r.reservation_time.strftime("%Y-%m-%d %H:%M") if r.reservation_time else None,
                    "guests": r.guests,
                    "status": r.status
                }
                for r in reservations
            ]
            return report
        except Exception as e:
            logging.error(f"Error generating reservation report: {str(e)}")
            return {"error": str(e)}

    def get_order_summary(self):
        try:
            orders = self.db.query(Order).all()
            summary = {
                "total_orders": len(orders),
                "total_items_ordered": sum(len(order.items) for order in orders),
                "average_order_value": round(sum(order.total_amount for order in orders) / len(orders), 2) if orders else 0
            }
            return summary
        except Exception as e:
            logging.error(f"Error generating order summary: {str(e)}")
            return {"error": str(e)}

    def get_feedback_report(self):
        try:
            feedbacks = self.db.query(Feedback).all()
            
            # Calculate statistics
            total_feedbacks = len(feedbacks)
            ratings = [f.rating for f in feedbacks if f.rating is not None]
            average_rating = sum(ratings) / len(ratings) if ratings else None
            
            # Group by rating
            rating_counts = {}
            for rating in ratings:
                rating_counts[rating] = rating_counts.get(rating, 0) + 1
            
            report = {
                "total_feedbacks": total_feedbacks,
                "feedbacks_with_rating": len(ratings),
                "average_rating": round(average_rating, 2) if average_rating else None,
                "rating_distribution": rating_counts,
                "feedbacks": [
                    {
                        "id": f.id,
                        "customer_id": f.customer_id,
                        "message": f.message,
                        "rating": f.rating,
                        "submitted_at": f.submitted_at.strftime("%Y-%m-%d %H:%M") if f.submitted_at else None
                    }
                    for f in feedbacks
                ]
            }
            return report
        except Exception as e:
            logging.error(f"Error generating feedback report: {str(e)}")
            return {"error": str(e)}


# ✅ Add utility functions here
from extensions import db

def generate_sales_report(start_date, end_date, export=False, export_format="pdf"):
    service = ReportService(db.session)
    return service.get_sales_report(start_date, end_date)

def generate_inventory_report():
    service = ReportService(db.session)
    return service.get_inventory_report()

def generate_feedback_report():
    service = ReportService(db.session)
    return service.get_feedback_report()
