import pytest
from utils import auth
from datetime import datetime, timedelta
import jwt
import os

# Set a test secret key
os.environ['JWT_SECRET'] = 'test-secret'

def test_hash_and_verify_password():
    password = "securepassword123"
    hashed = auth.hash_password(password)

    assert hashed != password  # Hash should not be the same as original
    assert auth.verify_password(password, hashed)  # Should return True
    assert not auth.verify_password("wrongpassword", hashed)  # Should return False

def test_create_token_and_verify():
    data = {"user_id": 1}
    token = auth.create_token(data, expires_in_minutes=1)

    assert isinstance(token, str)

    decoded = auth.verify_token(token)
    assert decoded["user_id"] == 1

def test_expired_token():
    # Token with very short expiration
    data = {"user_id": 2}
    token = auth.create_token(data, expires_in_minutes=-1)  # Already expired

    with pytest.raises(jwt.ExpiredSignatureError):
        auth.verify_token(token)

def test_invalid_token():
    invalid_token = "abc.def.ghi"  # Fake structure

    with pytest.raises(jwt.DecodeError):
        auth.verify_token(invalid_token)
