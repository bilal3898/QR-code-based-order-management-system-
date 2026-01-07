# controllers/notification_controller.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.notification_service import NotificationService
from models.user import User
from extensions import db
from utils.rbac import require_role

notification_bp = Blueprint('notification', __name__, url_prefix='/api/notifications')
notification_service = NotificationService()

@notification_bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get notifications for the current user"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Return notifications based on user role
        # In a real system, you'd have a Notification model
        notifications = []
        
        # Admin/Manager get all notifications
        if user.role in ['admin', 'manager']:
            notifications = [
                {
                    'id': 1,
                    'type': 'system',
                    'message': 'System notifications',
                    'timestamp': '2024-01-01T00:00:00'
                }
            ]
        # Kitchen staff get order notifications
        elif user.role == 'kitchen':
            notifications = [
                {
                    'id': 2,
                    'type': 'order',
                    'message': 'New orders for kitchen',
                    'timestamp': '2024-01-01T00:00:00'
                }
            ]
        # Waiters get order status notifications
        elif user.role == 'waiter':
            notifications = [
                {
                    'id': 3,
                    'type': 'order_status',
                    'message': 'Order status updates',
                    'timestamp': '2024-01-01T00:00:00'
                }
            ]
        
        return jsonify(notifications), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@notification_bp.route('/send', methods=['POST'])
@jwt_required()
@require_role(['admin', 'manager'])
def send_notification():
    """Send a notification (admin/manager only)"""
    try:
        data = request.get_json()
        recipient_email = data.get('recipient_email')
        subject = data.get('subject')
        message = data.get('message')
        
        if not all([recipient_email, subject, message]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        result = notification_service.send_email(recipient_email, subject, message)
        
        if result['status'] == 'success':
            return jsonify({'message': 'Notification sent successfully'}), 200
        else:
            return jsonify({'error': result['message']}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@notification_bp.route('/send-bulk', methods=['POST'])
@jwt_required()
@require_role(['admin', 'manager'])
def send_bulk_notification():
    """Send bulk notifications (admin/manager only)"""
    try:
        data = request.get_json()
        recipients = data.get('recipients', [])
        subject = data.get('subject')
        message = data.get('message')
        
        if not all([recipients, subject, message]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        results = notification_service.send_bulk_email(recipients, subject, message)
        return jsonify({'results': results}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

