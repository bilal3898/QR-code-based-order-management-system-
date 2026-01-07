from services.report_service import generate_daily_report
from services.email_service import send_email
from datetime import datetime
import logging

def run_daily_report_job():
    try:
        # Generate the report data
        report_data = generate_daily_report()

        # Format the report (you can format as HTML or plain text)
        report_content = f"""
        Daily Report - {datetime.now().strftime("%Y-%m-%d")}
        =======================================
        Total Orders: {report_data.get('total_orders')}
        Total Revenue: ₹{report_data.get('total_revenue')}
        New Customers: {report_data.get('new_customers')}
        Feedback Summary: {report_data.get('feedback_summary')}
        """

        # Email configuration
        subject = "📊 Daily Restaurant Report"
        recipient = "admin@restaurant.com"

        # Send the report via email
        send_email(to=recipient, subject=subject, body=report_content)

        logging.info("✅ Daily report job executed successfully.")
    except Exception as e:
        logging.error(f"❌ Error in daily report job: {e}")
