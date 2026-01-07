# controllers/order_controller.py

from flask import Blueprint, request, jsonify
from models.order import Order, OrderStatus
from models.menu_item import MenuItem
from extensions import db
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from events.socket_events import emit_order_update

order_bp = Blueprint('order', __name__, url_prefix='/api/orders')
bp = Blueprint('order', __name__)

@order_bp.route('/', methods=['GET'])
def get_all_orders():
    try:
        orders = Order.query.all()
        return jsonify([order.to_dict() for order in orders]), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500


@order_bp.route('/<int:order_id>', methods=['GET'])
def get_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404
    return jsonify(order.to_dict()), 200


@order_bp.route('/', methods=['POST'])
def create_order():
    data = request.get_json()

    if not data.get('table_id') or not data.get('items'):
        return jsonify({'error': 'Missing required fields: table_id and items'}), 400

    try:
        from models.order_item import OrderItem
        
        # Calculate total price
        total_price = 0.0
        order_items = []
        
        for item_data in data['items']:
            menu_item = MenuItem.query.get(item_data.get('menu_item_id') or item_data.get('item_id'))
            if not menu_item:
                return jsonify({'error': f"Menu item {item_data.get('menu_item_id') or item_data.get('item_id')} not found"}), 404
            
            quantity = item_data.get('quantity', 1)
            price = menu_item.price * quantity
            total_price += price
            
            order_items.append({
                'menu_item': menu_item,
                'quantity': quantity,
                'price': menu_item.price
            })
        
        # Create order
        status_str = data.get('status', 'PENDING').upper()
        try:
            status = OrderStatus[status_str]
        except KeyError:
            status = OrderStatus.PENDING
        
        order = Order(
            customer_id=data.get('customer_id'),
            table_id=data['table_id'],
            status=status,
            total_price=total_price
        )
        db.session.add(order)
        db.session.flush()  # Get order ID
        
        # Create order items
        for item_data in order_items:
            order_item = OrderItem(
                order_id=order.id,
                menu_item_id=item_data['menu_item'].id,
                quantity=item_data['quantity'],
                price=item_data['price']
            )
            db.session.add(order_item)
        
        db.session.commit()
        
        # Emit socket event for new order
        order_dict = order.to_dict()
        emit_order_update(order.id, order_dict)
        
        return jsonify(order_dict), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@order_bp.route('/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    try:
        from models.order_item import OrderItem
        data = request.get_json()

        if 'status' in data:
            status_str = data['status'].upper()
            try:
                order.status = OrderStatus[status_str]
            except KeyError:
                return jsonify({'error': f'Invalid status: {data["status"]}'}), 400
        
        if 'table_id' in data:
            order.table_id = data['table_id']
        
        if 'items' in data:
            # Delete existing items
            OrderItem.query.filter_by(order_id=order.id).delete()
            
            # Calculate new total
            total_price = 0.0
            for item_data in data['items']:
                menu_item = MenuItem.query.get(item_data.get('menu_item_id') or item_data.get('item_id'))
                if not menu_item:
                    db.session.rollback()
                    return jsonify({'error': f"Menu item {item_data.get('menu_item_id') or item_data.get('item_id')} not found"}), 404
                
                quantity = item_data.get('quantity', 1)
                price = menu_item.price * quantity
                total_price += price
                
                order_item = OrderItem(
                    order_id=order.id,
                    menu_item_id=menu_item.id,
                    quantity=quantity,
                    price=menu_item.price
                )
                db.session.add(order_item)
            
            order.total_price = total_price

        db.session.commit()
        
        # Emit socket event for order update
        order_dict = order.to_dict()
        emit_order_update(order.id, order_dict)
        
        return jsonify(order_dict), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@order_bp.route('/<int:order_id>', methods=['DELETE'])
def delete_order(order_id):
    order = Order.query.get(order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    try:
        db.session.delete(order)
        db.session.commit()
        return jsonify({'message': 'Order deleted successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
