# services/analytics_service.py

from models.order import Order
from models.menu_item import MenuItem
from models.bill import Bill
from models.reservation import Reservation
from sqlalchemy import func
from utils.database import db
from datetime import datetime, timedelta


class AnalyticsService:
    @staticmethod
    def get_top_selling_items(limit=5):
        try:
            results = (
                db.session.query(
                    MenuItem.name,
                    func.count(Order.id).label('order_count')
                )
                .join(Order, Order.menu_item_id == MenuItem.id)
                .group_by(MenuItem.name)
                .order_by(func.count(Order.id).desc())
                .limit(limit)
                .all()
            )
            return [{'item': name, 'orders': count} for name, count in results]
        except Exception as e:
            return {'error': str(e)}

    @staticmethod
    def get_daily_sales_summary(days=7):
        try:
            summary = []
            today = datetime.utcnow()

            for i in range(days):
                day = today - timedelta(days=i)
                total_sales = (
                    db.session.query(func.sum(Bill.total_amount))
                    .filter(func.date(Bill.created_at) == day.date())
                    .scalar()
                )
                summary.append({
                    'date': day.strftime('%Y-%m-%d'),
                    'sales': float(total_sales or 0)
                })

            return list(reversed(summary))
        except Exception as e:
            return {'error': str(e)}

    @staticmethod
    def get_table_utilization():
        try:
            result = (
                db.session.query(
                    Reservation.table_id,
                    func.count(Reservation.id).label('reservations')
                )
                .group_by(Reservation.table_id)
                .all()
            )
            return [{'table_id': table_id, 'reservations': count} for table_id, count in result]
        except Exception as e:
            return {'error': str(e)}

    @staticmethod
    def get_customer_retention():
        try:
            total_customers = db.session.query(func.count(func.distinct(Order.customer_id))).scalar()
            repeat_customers = (
                db.session.query(Order.customer_id)
                .group_by(Order.customer_id)
                .having(func.count(Order.id) > 1)
                .count()
            )
            retention_rate = (repeat_customers / total_customers * 100) if total_customers else 0
            return {
                'total_customers': total_customers,
                'repeat_customers': repeat_customers,
                'retention_rate_percent': round(retention_rate, 2)
            }
        except Exception as e:
            return {'error': str(e)}
