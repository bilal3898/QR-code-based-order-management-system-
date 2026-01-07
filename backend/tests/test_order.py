import pytest
from app import create_app
from utils.database import db
from models.order import Order
from models.customer import Customer
from utils.tax_calculator import calculate_tax

@pytest.fixture
def client():
    app = create_app("testing")  # Assuming testing config disables auth & uses SQLite
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['TESTING'] = True

    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.session.remove()
        db.drop_all()

def create_sample_customer():
    customer = Customer(name="Test User", email="test@example.com")
    db.session.add(customer)
    db.session.commit()
    return customer

def test_create_order(client):
    customer = create_sample_customer()

    order_data = {
        "customer_id": customer.id,
        "items": [
            {"name": "Pizza", "price": 200},
            {"name": "Burger", "price": 100}
        ]
    }

    response = client.post("/api/orders/", json=order_data)
    assert response.status_code == 201
    data = response.get_json()
    assert data["total_price"] == 300
    assert "order_id" in data

def test_get_order_by_id(client):
    customer = create_sample_customer()
    order = Order(customer_id=customer.id, items=[{"name": "Coffee", "price": 80}], total_price=80)
    db.session.add(order)
    db.session.commit()

    response = client.get(f"/api/orders/{order.id}")
    assert response.status_code == 200
    assert response.get_json()["total_price"] == 80

def test_update_order(client):
    customer = create_sample_customer()
    order = Order(customer_id=customer.id, items=[{"name": "Samosa", "price": 30}], total_price=30)
    db.session.add(order)
    db.session.commit()

    update_data = {
        "items": [{"name": "Samosa", "price": 30}, {"name": "Tea", "price": 20}]
    }

    response = client.put(f"/api/orders/{order.id}", json=update_data)
    assert response.status_code == 200
    assert response.get_json()["total_price"] == 50

def test_delete_order(client):
    customer = create_sample_customer()
    order = Order(customer_id=customer.id, items=[{"name": "Dosa", "price": 70}], total_price=70)
    db.session.add(order)
    db.session.commit()

    response = client.delete(f"/api/orders/{order.id}")
    assert response.status_code == 200
    assert response.get_json()["message"] == "Order deleted successfully"

def test_tax_calculation():
    total = 1000
    tax_rate = 18  # assuming 18%
    tax = calculate_tax(total, tax_rate)
    assert tax == 180.0
