# services/email_service.py

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging
from typing import List
from config import Config  # Adjust import path if needed

class EmailService:
    def __init__(
        self,
        smtp_server: str = Config.EMAIL_SMTP_SERVER,
        smtp_port: int = Config.EMAIL_SMTP_PORT,
        sender_email: str = Config.EMAIL_SENDER,
        sender_password: str = Config.EMAIL_PASSWORD
    ):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.sender_email = sender_email
        self.sender_password = sender_password

    def send_email(self, recipient_email: str, subject: str, body: str, html: bool = False):
        try:
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = self.sender_email
            message["To"] = recipient_email

            mime_body = MIMEText(body, "html" if html else "plain")
            message.attach(mime_body)

            with smtplib.SMTP_SSL(self.smtp_server, self.smtp_port) as server:
                server.login(self.sender_email, self.sender_password)
                server.sendmail(self.sender_email, recipient_email, message.as_string())

            logging.info(f"Email sent successfully to {recipient_email}")
            return {"message": f"Email sent successfully to {recipient_email}"}

        except smtplib.SMTPAuthenticationError:
            logging.error("Authentication failed. Check your email credentials.")
            return {"error": "Authentication failed."}
        except Exception as e:
            logging.error(f"Failed to send email: {e}")
            return {"error": str(e)}

    def send_bulk_email(self, recipient_emails: List[str], subject: str, body: str, html: bool = False):
        results = []
        for email in recipient_emails:
            results.append(self.send_email(email, subject, body, html))
        return results
