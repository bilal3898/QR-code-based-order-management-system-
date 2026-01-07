# Restaurant Management System - Setup Guide

## Prerequisites

- Python 3.8+
- Node.js 14+
- MySQL or PostgreSQL database
- npm or yarn

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Linux/Mac:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure database:**
   - Update `backend/config.py` with your database credentials
   - Or set environment variables:
     - `DB_USER`
     - `DB_PASSWORD`
     - `DB_HOST`
     - `DB_PORT`
     - `DB_NAME`
     - `DATABASE_URL` (full connection string)

5. **Initialize database:**
   ```bash
   python init_db.py
   ```

6. **Run migrations (optional):**
   ```bash
   flask db init  # First time only
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

7. **Start the backend server:**
   ```bash
   python app.py
   ```
   The API will be available at `http://localhost:5000`

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API URL (optional):**
   - Create a `.env` file in the frontend directory:
     ```
     REACT_APP_API_BASE_URL=http://localhost:5000/api
     REACT_APP_API_URL=http://localhost:5000
     ```

4. **Start the development server:**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`

## Features

- **Authentication**: User registration and login
- **Customer Management**: Create, read, update, delete customers
- **Table Management**: Manage restaurant tables with status tracking
- **Menu Management**: Add, edit, and manage menu items
- **Order Management**: Create and track orders
- **Reservation System**: Manage table reservations
- **Inventory Management**: Track inventory items
- **Billing**: Generate bills for orders
- **Feedback**: Collect customer feedback
- **Reports**: Generate sales, inventory, and feedback reports
- **QR Codes**: Generate QR codes for tables

## API Endpoints

- `/api/auth/login` - User login
- `/api/auth/register` - User registration
- `/api/auth/profile` - Get user profile
- `/api/customers` - Customer CRUD operations
- `/api/tables` - Table CRUD operations
- `/api/menu` - Menu item CRUD operations
- `/api/orders` - Order CRUD operations
- `/api/reservations` - Reservation CRUD operations
- `/api/inventory` - Inventory CRUD operations
- `/api/bills` - Bill operations
- `/api/feedback` - Feedback operations
- `/api/reports` - Report generation
- `/api/qr/generate` - QR code generation

## Database Schema

The system uses the following main models:
- Users
- Customers
- Tables
- Menu Items
- Orders
- Order Items
- Reservations
- Inventory Items
- Bills
- Feedback
- QR Codes

## Troubleshooting

1. **Database connection errors:**
   - Check database credentials in `config.py`
   - Ensure database server is running
   - Verify database exists

2. **CORS errors:**
   - Check CORS_ORIGINS in `config.py`
   - Ensure frontend URL is included

3. **Import errors:**
   - Ensure all dependencies are installed
   - Check Python path and virtual environment

4. **Frontend not connecting to backend:**
   - Verify backend is running on port 5000
   - Check `.env` file configuration
   - Verify API base URL in `api.js`

## Production Deployment

1. Set `DEBUG = False` in `config.py`
2. Use environment variables for sensitive data
3. Configure proper CORS origins
4. Use a production WSGI server (e.g., Gunicorn)
5. Set up proper database backups
6. Configure HTTPS
7. Set up logging and monitoring

