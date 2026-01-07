from flask import Blueprint, jsonify, request, send_file
from extensions import db
from services.report_service import ReportService

report_bp = Blueprint('report', __name__, url_prefix='/api/reports')
bp = Blueprint('report', __name__)


@report_bp.route('/sales', methods=['GET'])
def get_sales_report():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    report_service = ReportService(db.session)

    try:
        report = report_service.get_sales_report(start_date, end_date)
        return jsonify(report), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@report_bp.route('/inventory', methods=['GET'])
def get_inventory_report():
    report_service = ReportService(db.session)
    try:
        report = report_service.get_inventory_report()
        return jsonify(report), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@report_bp.route('/feedback', methods=['GET'])
def get_feedback_report():
    report_service = ReportService(db.session)
    try:
        report = report_service.get_feedback_report()
        return jsonify(report), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@report_bp.route('/export', methods=['GET'])
def export_sales_report():
    format = request.args.get('format', 'csv')
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    report_service = ReportService(db.session)

    try:
        file_path = report_service.get_sales_report(start_date, end_date, export=True, export_format=format)
        return send_file(file_path, as_attachment=True)
    except Exception as e:
        return jsonify({'error': str(e)}), 500