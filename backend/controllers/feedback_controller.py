# controllers/feedback_controller.py

from flask import Blueprint, request, jsonify
from models.feedback import Feedback
from utils.database import db
from sqlalchemy.exc import SQLAlchemyError

feedback_bp = Blueprint('feedback', __name__, url_prefix='/api/feedback')
bp = Blueprint('feedback', __name__)


@feedback_bp.route('/', methods=['GET'])
def get_all_feedback():
    try:
        feedbacks = Feedback.query.all()
        return jsonify([f.to_dict() for f in feedbacks]), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500


@feedback_bp.route('/<int:feedback_id>', methods=['GET'])
def get_feedback(feedback_id):
    feedback = Feedback.query.get(feedback_id)
    if not feedback:
        return jsonify({'error': 'Feedback not found'}), 404
    return jsonify(feedback.to_dict()), 200


@feedback_bp.route('/', methods=['POST'])
def create_feedback():
    try:
        data = request.get_json()
        customer_name = data.get('customer_name')
        message = data.get('message')
        rating = data.get('rating', None)

        if not customer_name or not message:
            return jsonify({'error': 'Name and message are required'}), 400

        feedback = Feedback(customer_name=customer_name, message=message, rating=rating)
        db.session.add(feedback)
        db.session.commit()

        return jsonify(feedback.to_dict()), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
