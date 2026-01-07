from flask import Blueprint, request, jsonify
from models.inventory import InventoryItem
from utils.database import db
from sqlalchemy.exc import SQLAlchemyError

inventory_bp = Blueprint('inventory', __name__, url_prefix='/api/inventory')
from flask import Blueprint, request, jsonify


bp = Blueprint('inventory', __name__)

@inventory_bp.route('/', methods=['GET'])
def get_all_inventory():
    try:
        items = InventoryItem.query.all()
        return jsonify([item.to_dict() for item in items]), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500


@inventory_bp.route('/<int:item_id>', methods=['GET'])  # ✅ fixed 'amethods'
def get_inventory_item(item_id):
    item = InventoryItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Item not found'}), 404
    return jsonify(item.to_dict()), 200


@inventory_bp.route('/', methods=['POST'])
def create_inventory_item():
    try:
        data = request.get_json()
        name = data['name']
        quantity = data['quantity']
        unit = data.get('unit', '')
        reorder_level = data.get('threshold', 0)  # ✅ renamed to reorder_level

        item = InventoryItem(
            name=name,
            quantity=quantity,
            unit=unit,
            reorder_level=reorder_level
        )

        db.session.add(item)
        db.session.commit()

        return jsonify(item.to_dict()), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    except Exception as ex:
        return jsonify({'error': str(ex)}), 400


@inventory_bp.route('/<int:item_id>', methods=['PUT'])
def update_inventory_item(item_id):
    item = InventoryItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Item not found'}), 404

    try:
        data = request.get_json()
        item.name = data.get('name', item.name)
        item.quantity = data.get('quantity', item.quantity)
        item.unit = data.get('unit', item.unit)
        item.reorder_level = data.get('threshold', item.reorder_level)  # ✅ fixed

        db.session.commit()
        return jsonify(item.to_dict()), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@inventory_bp.route('/<int:item_id>', methods=['DELETE'])
def delete_inventory_item(item_id):
    item = InventoryItem.query.get(item_id)
    if not item:
        return jsonify({'error': 'Item not found'}), 404

    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Item deleted successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
