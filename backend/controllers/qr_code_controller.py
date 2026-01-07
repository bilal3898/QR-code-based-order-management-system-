# controllers/qr_code_controller.py

from flask import Blueprint, request, jsonify
from utils.qr_code_generator import generate_qr_code

qr_bp = Blueprint('qr', __name__, url_prefix='/api/qr')
bp = Blueprint('qr_code', __name__)


@qr_bp.route('/generate', methods=['POST'])
def generate_qr():
    data = request.get_json()
    content = data.get('content')

    if not content:
        return jsonify({'error': 'Content is required to generate QR code'}), 400

    try:
        qr_base64 = generate_qr_code(content)
        return jsonify({'qr_code_base64': qr_base64}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
