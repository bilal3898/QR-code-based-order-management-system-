# services/notification_service.py

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from decouple import config

class NotificationService:
    def __init__(self):
        self.smtp_server = config('SMTP_SERVER', default='smtp.gmail.com')
        self.smtp_port = config('SMTP_PORT', cast=int, default=587)
        self.sender_email = config('SENDER_EMAIL')
        self.sender_password = config('SENDER_PASSWORD')

    def send_email(self, recipient_email, subject, message):
        try:
            msg = MIMEMultipart()
            msg['From'] = self.sender_email
            msg['To'] = recipient_email
            msg['Subject'] = subject

            msg.attach(MIMEText(message, 'plain'))

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(msg)

            logging.info(f"Email sent to {recipient_email} successfully.")
            return {'status': 'success', 'message': 'Email sent successfully.'}
        except Exception as e:
            logging.error(f"Failed to send email: {str(e)}")
            return {'status': 'error', 'message': str(e)}

    def send_bulk_email(self, recipients, subject, message):
        results = []
        for email in recipients:
            result = self.send_email(email, subject, message)
            results.append({email: result})
        return results

    def send_reservation_confirmation(self, customer_email, reservation_details):
        subject = "Reservation Confirmation"
        message = f"""Dear Customer,

Your reservation is confirmed with the following details:

Table ID: {reservation_details['table_id']}
Date & Time: {reservation_details['date_time']}
Guests: {reservation_details['guest_count']}

Thank you for choosing us!

- The Restaurant Team
"""
        return self.send_email(customer_email, subject, message)

    def send_order_notification(self, customer_email, order_id, total_amount):
        subject = "Order Placed Successfully"
        message = f"""Dear Customer,

Your order (ID: {order_id}) has been placed successfully.
Total Bill: ₹{total_amount}

We’ll notify you when it’s ready. Thank you for your order!

- The Restaurant Team
"""
        return self.send_email(customer_email, subject, message)
