from services.notification_service import send_notification
from datetime import datetime
import logging

def run_notification_job():
    try:
        # Example notification logic: Send a daily reminder or summary
        current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        message = f"Scheduled Notification Triggered at {current_time}"
        
        # You can define recipient dynamically
        recipient = "admin@restaurant.com"
        
        # Send the notification
        send_notification(recipient, message)

        logging.info("Notification job executed successfully.")
    except Exception as e:
        logging.error(f"Error in notification job: {e}")
