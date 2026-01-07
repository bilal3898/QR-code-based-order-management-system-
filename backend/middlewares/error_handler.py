from flask import jsonify
from werkzeug.exceptions import HTTPException

def handle_http_exception(e):
    response = e.get_response()
    return jsonify({
        "error": {
            "code": e.code,
            "name": e.name,
            "description": e.description
        }
    }), e.code

def handle_general_exception(e):
    import traceback
    error_trace = traceback.format_exc()
    print(f"[ERROR] Unhandled exception: {str(e)}")
    print(f"[ERROR] Traceback:\n{error_trace}")
    return jsonify({
        "code": 500,
        "name": "Internal Server Error",
        "description": str(e)
    }), 500
