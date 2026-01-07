import io
import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app("testing")  # Assumes testing mode disables auth and uses in-memory DB
    app.config['TESTING'] = True
    return app.test_client()

def test_qr_code_generation_success(client):
    data = {"content": "https://example.com/menu/42"}
    response = client.post("/api/qr/generate", json=data)

    assert response.status_code == 200
    assert response.mimetype == "image/png"
    assert "attachment; filename=qr_" in response.headers.get("Content-Disposition", "")

    # Optional: Check that returned file is a valid PNG by reading signature bytes
    png_signature = b"\x89PNG\r\n\x1a\n"
    assert response.data.startswith(png_signature)

def test_qr_code_generation_missing_content(client):
    response = client.post("/api/qr/generate", json={})
    assert response.status_code == 400
    assert response.get_json()["error"] == "Content is required to generate QR code"

def test_qr_code_generation_invalid_json(client):
    response = client.post("/api/qr/generate", data="not-a-json", content_type="application/json")
    assert response.status_code == 400  # Flask will treat this as bad request
