# utils/rbac.py

from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt, get_jwt_identity
from models.user import User
from extensions import db

def require_role(allowed_roles):
    """
    Decorator to require specific roles for a route.
    
    Usage:
        @app.route('/admin-only')
        @jwt_required()
        @require_role(['admin', 'manager'])
        def admin_route():
            ...
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                user_id = get_jwt_identity()
                user = User.query.get(user_id)
                
                if not user:
                    return jsonify({'error': 'User not found'}), 404
                
                if user.role not in allowed_roles:
                    return jsonify({
                        'error': 'Insufficient permissions',
                        'required_roles': allowed_roles,
                        'user_role': user.role
                    }), 403
                
                return f(*args, **kwargs)
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        
        return decorated_function
    return decorator

def require_any_role(*allowed_roles):
    """
    Decorator to require any of the specified roles.
    Similar to require_role but accepts multiple role lists.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                user_id = get_jwt_identity()
                user = User.query.get(user_id)
                
                if not user:
                    return jsonify({'error': 'User not found'}), 404
                
                # Flatten all allowed roles
                all_allowed = []
                for roles in allowed_roles:
                    if isinstance(roles, list):
                        all_allowed.extend(roles)
                    else:
                        all_allowed.append(roles)
                
                if user.role not in all_allowed:
                    return jsonify({
                        'error': 'Insufficient permissions',
                        'required_roles': all_allowed,
                        'user_role': user.role
                    }), 403
                
                return f(*args, **kwargs)
            except Exception as e:
                return jsonify({'error': str(e)}), 500
        
        return decorated_function
    return decorator

# Role hierarchy for permission checking
ROLE_HIERARCHY = {
    'admin': 5,
    'manager': 4,
    'cashier': 3,
    'waiter': 2,
    'kitchen': 2,
    'customer': 1
}

def has_permission(user_role, required_role):
    """Check if user role has permission based on hierarchy"""
    user_level = ROLE_HIERARCHY.get(user_role, 0)
    required_level = ROLE_HIERARCHY.get(required_role, 0)
    return user_level >= required_level

