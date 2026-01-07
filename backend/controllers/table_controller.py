# controllers/table_controller.py

from flask import Blueprint, request, jsonify
from models.table import Table
from utils.database import db
from utils.validators import validate_table_data

table_bp = Blueprint('table', __name__, url_prefix='/api/tables')
bp = Blueprint('table', __name__)


@table_bp.route('/', methods=['GET'])
def get_all_tables():
    try:
        tables = Table.query.all()
        return jsonify([table.to_dict() for table in tables]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@table_bp.route('/<int:table_id>', methods=['GET'])
def get_table_by_id(table_id):
    table = Table.query.get(table_id)
    if table:
        return jsonify(table.to_dict()), 200
    return jsonify({'error': 'Table not found'}), 404


@table_bp.route('/', methods=['POST'])
def create_table():
    data = request.get_json()
    errors = validate_table_data(data)
    if errors:
        return jsonify({'errors': errors}), 400

    try:
        new_table = Table(
            number=data['number'],
            capacity=data['capacity'],
            status=data.get('status', 'available')
        )
        db.session.add(new_table)
        db.session.commit()
        return jsonify(new_table.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@table_bp.route('/<int:table_id>', methods=['PUT'])
def update_table(table_id):
    table = Table.query.get(table_id)
    if not table:
        return jsonify({'error': 'Table not found'}), 404

    try:
        data = request.get_json()
        if 'number' in data:
            table.number = data['number']
        if 'capacity' in data:
            table.capacity = data['capacity']
        if 'status' in data:
            table.status = data['status']

        db.session.commit()
        return jsonify(table.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@table_bp.route('/<int:table_id>', methods=['DELETE'])
def delete_table(table_id):
    table = Table.query.get(table_id)
    if not table:
        return jsonify({'error': 'Table not found'}), 404

    try:
        db.session.delete(table)
        db.session.commit()
        return jsonify({'message': 'Table deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
