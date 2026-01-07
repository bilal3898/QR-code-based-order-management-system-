# controllers/reservation_controller.py

from flask import Blueprint, request, jsonify
from models.reservation import Reservation
from models.table import Table
from utils.database import db
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime

reservation_bp = Blueprint('reservation', __name__, url_prefix='/api/reservations')
from flask import Blueprint, request, jsonify

bp = Blueprint('reservation', __name__)

@bp.route('/bills', methods=['GET'])
def get_bills():
    return jsonify({'message': 'List of all bills'})



@reservation_bp.route('/', methods=['GET'])
def get_all_reservations():
    try:
        reservations = Reservation.query.all()
        return jsonify([res.to_dict() for res in reservations]), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500


@reservation_bp.route('/<int:reservation_id>', methods=['GET'])
def get_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({'error': 'Reservation not found'}), 404
    return jsonify(reservation.to_dict()), 200


@reservation_bp.route('/', methods=['POST'])
def create_reservation():
    try:
        data = request.get_json()
        table_id = data['table_id']
        customer_name = data['customer_name']
        reservation_time = datetime.fromisoformat(data['reservation_time'])

        # Check if the table is already reserved for the time slot
        existing = Reservation.query.filter_by(table_id=table_id, reservation_time=reservation_time).first()
        if existing:
            return jsonify({'error': 'Table already reserved for this time'}), 409

        reservation = Reservation(
            table_id=table_id,
            customer_name=customer_name,
            reservation_time=reservation_time,
            status="Reserved"
        )
        db.session.add(reservation)

        # Optional: Update table status
        table = Table.query.get(table_id)
        if table:
            table.status = "Reserved"

        db.session.commit()
        return jsonify(reservation.to_dict()), 201

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
    except Exception as ex:
        return jsonify({'error': str(ex)}), 400


@reservation_bp.route('/<int:reservation_id>', methods=['PUT'])
def update_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({'error': 'Reservation not found'}), 404

    try:
        data = request.get_json()
        reservation.customer_name = data.get('customer_name', reservation.customer_name)
        if 'reservation_time' in data:
            reservation.reservation_time = datetime.fromisoformat(data['reservation_time'])
        reservation.status = data.get('status', reservation.status)

        db.session.commit()
        return jsonify(reservation.to_dict()), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@reservation_bp.route('/<int:reservation_id>', methods=['DELETE'])
def delete_reservation(reservation_id):
    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({'error': 'Reservation not found'}), 404

    try:
        db.session.delete(reservation)
        db.session.commit()
        return jsonify({'message': 'Reservation deleted'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
