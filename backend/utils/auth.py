import jwt
import datetime
from flask import current_app
from werkzeug.security import generate_password_hash, check_password_hash

# ✔️ Hash password
def hash_password(password):
    return generate_password_hash(password)

# ✔️ Verify password
def verify_password(password, hashed_password):
    return check_password_hash(hashed_password, password)

# ✔️ Generate JWT token
def generate_token(user_id, expires_in=3600):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(seconds=expires_in),
        'iat': datetime.datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(
        payload,
        current_app.config['JWT_SECRET_KEY'],
        algorithm='HS256'
    )

# ✔️ Decode JWT token
def decode_token(token):
    try:
        payload = jwt.decode(
            token,
            current_app.config['JWT_SECRET_KEY'],
            algorithms=['HS256']
        )
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token
