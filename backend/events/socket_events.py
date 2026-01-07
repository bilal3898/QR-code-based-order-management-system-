# events/socket_events.py

from flask_socketio import emit, join_room, leave_room
from models.order import Order, OrderStatus
from models.user import User
from extensions import db, socketio

# Store connected users by role
connected_users = {
    'admin': set(),
    'manager': set(),
    'waiter': set(),
    'kitchen': set(),
    'cashier': set(),
    'customer': set()
}

@socketio.on('connect')
def handle_connect(auth):
    """Handle client connection"""
    try:
        from flask import request
        from flask_jwt_extended import decode_token
        from flask import current_app
        
        # Extract token from auth or query string
        token = None
        if auth:
            token = auth.get('token')
        if not token:
            # Try to get from query string
            token = request.args.get('token')
        if not token:
            # Try to get from Authorization header in handshake
            auth_header = request.headers.get('Authorization', '')
            if auth_header.startswith('Bearer '):
                token = auth_header[7:]
        
        if not token:
            emit('error', {'message': 'Authentication required'})
            return False
        
        # Decode token manually
        import jwt
        from config import Config
        try:
            decoded = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=['HS256'])
            user_id = decoded.get('sub')
        except jwt.InvalidTokenError:
            emit('error', {'message': 'Invalid token'})
            return False
        
        if not user_id:
            emit('error', {'message': 'Invalid token'})
            return False
        
        user = User.query.get(user_id)
        if not user:
            emit('error', {'message': 'User not found'})
            return False
        
        # Join role-based room
        role_room = f"role_{user.role}"
        join_room(role_room)
        if user.role in connected_users:
            connected_users[user.role].add(user_id)
        
        emit('connected', {
            'message': f'Connected as {user.role}',
            'user_id': user_id,
            'role': user.role
        })
        
        print(f"[SocketIO] User {user_id} ({user.role}) connected")
        
    except Exception as e:
        print(f"[SocketIO] Connection error: {str(e)}")
        emit('error', {'message': 'Connection failed'})
        return False

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print("[SocketIO] Client disconnected")

@socketio.on('join_order_room')
def handle_join_order_room(data):
    """Join a specific order room for real-time updates"""
    order_id = data.get('order_id')
    if order_id:
        room = f"order_{order_id}"
        join_room(room)
        emit('joined_room', {'room': room, 'order_id': order_id})

@socketio.on('leave_order_room')
def handle_leave_order_room(data):
    """Leave a specific order room"""
    order_id = data.get('order_id')
    if order_id:
        room = f"order_{order_id}"
        leave_room(room)
        emit('left_room', {'room': room, 'order_id': order_id})

def emit_order_update(order_id, order_data):
    """Emit order update to all relevant rooms"""
    # Emit to order-specific room
    socketio.emit('order_update', {
        'order_id': order_id,
        'data': order_data
    }, room=f"order_{order_id}")
    
    # Emit to kitchen room if order status changed
    if order_data.get('status') in ['Pending', 'Preparing']:
        socketio.emit('kitchen_order_update', {
            'order_id': order_id,
            'data': order_data
        }, room='role_kitchen')
    
    # Emit to waiter room if order is ready
    if order_data.get('status') == 'Served':
        socketio.emit('waiter_order_update', {
            'order_id': order_id,
            'data': order_data
        }, room='role_waiter')

def emit_notification(role, notification_data):
    """Emit notification to specific role"""
    socketio.emit('notification', notification_data, room=f"role_{role}")

def emit_broadcast(event_name, data):
    """Broadcast event to all connected clients"""
    socketio.emit(event_name, data, broadcast=True)

