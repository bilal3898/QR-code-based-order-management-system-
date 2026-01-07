import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from jinja2 import Environment, FileSystemLoader

# Setup Jinja2 environment
TEMPLATE_DIR = os.path.join(os.path.dirname(__file__), 'templates')
env = Environment(loader=FileSystemLoader(TEMPLATE_DIR))

# Email configuration (replace with environment variables in production)
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
EMAIL_ADDRESS = os.getenv('EMAIL_USER', 'your_email@gmail.com')
EMAIL_PASSWORD = os.getenv('EMAIL_PASS', 'your_email_password')


def render_template(template_name, **context):
    """Render HTML email template with dynamic context."""
    template = env.get_template(template_name)
    return template.render(**context)


def send_email(subject, to_email, html_content):
    """Send HTML email via SMTP."""
    msg = MIMEMultipart('alternative')
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = to_email
    msg['Subject'] = subject

    msg.attach(MIMEText(html_content, 'html'))

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(msg)
        print(f"Email sent to {to_email}")
    except Exception as e:
        print(f"Failed to send email: {e}")


def send_reservation_confirmation_email(to_email, user_name, reservation_details):
    """Send reservation confirmation email."""
    html = render_template('reservation_confirmation.html',
                           user_name=user_name,
                           reservation=reservation_details)
    send_email("Your Reservation at The Spice Garden", to_email, html)


def send_feedback_response_email(to_email, user_name):
    """Send feedback response email."""
    html = render_template('feedback_response.html',
                           user_name=user_name,
                           restaurant_name='The Spice Garden')
    send_email("Thanks for Your Feedback!", to_email, html)
