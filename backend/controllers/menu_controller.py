# controllers/menu_controller.py

from flask import Blueprint, request, jsonify
from models.menu_item import MenuItem
from utils.database import db
from utils.validators import validate_menu_item_data

menu_bp = Blueprint('menu', __name__, url_prefix='/api/menu')
bp = Blueprint('menu', __name__)


@menu_bp.route('/', methods=['GET'])
def get_all_menu_items():
    try:
        items = MenuItem.query.all()
        return jsonify([item.to_dict() for item in items]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@menu_bp.route('/<int:item_id>', methods=['GET'])
def get_menu_item(item_id):
    item = MenuItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Menu item not found'}), 404
    return jsonify(item.to_dict()), 200


@menu_bp.route('/', methods=['POST'])
def create_menu_item():
    data = request.get_json()
    errors = validate_menu_item_data(data)
    if errors:
        return jsonify({'errors': errors}), 400

    try:
        new_item = MenuItem(
            name=data['name'],
            description=data.get('description', ''),
            price=data['price'],
            category=data['category'],
            availability=data.get('availability', True)
        )
        db.session.add(new_item)
        db.session.commit()
        return jsonify(new_item.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@menu_bp.route('/<int:item_id>', methods=['PUT'])
def update_menu_item(item_id):
    item = MenuItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Menu item not found'}), 404

    try:
        data = request.get_json()
        if 'name' in data:
            item.name = data['name']
        if 'description' in data:
            item.description = data['description']
        if 'price' in data:
            item.price = data['price']
        if 'category' in data:
            item.category = data['category']
        if 'availability' in data:
            item.availability = data['availability']

        db.session.commit()
        return jsonify(item.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@menu_bp.route('/<int:item_id>', methods=['DELETE'])
def delete_menu_item(item_id):
    item = MenuItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Menu item not found'}), 404

    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Menu item deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
