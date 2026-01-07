import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ErrorBoundary from "./components/ErrorBoundary";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import CustomerList from "./components/Customer/CustomerList";
import CustomerForm from "./components/Customer/CustomerForm";
import TableList from "./components/Table/TableList";
import TableForm from "./components/Table/TableForm";
import TableStatus from "./components/Table/TableStatus";
import QRCodeGenerator from "./components/Table/QRCodeGenerator";
import QRCodeScanner from "./components/Table/QRCodeScanner";
import MenuList from "./components/Menu/MenuList";
import MenuItem from "./components/Menu/MenuItem";
import MenuItemForm from "./components/Menu/MenuItemForm";
import MenuCategory from "./components/Menu/MenuCategory";
import OrderList from "./components/Orders/OrderList";
import OrderTracking from "./components/Orders/OrderTracking";
import OrderDetails from "./components/Orders/OrderDetails";
import OrderForm from "./components/Orders/OrderForm";
import FeedbackList from "./components/Feedback/FeedbackList";
import FeedbackForm from "./components/Feedback/FeedbackForm";
import ReportDashboard from "./components/Reports/ReportDashboard";
import ExportReports from "./components/Reports/ExportReports";
import ReportList from "./components/Reports/ReportList";
import InventoryList from "./components/Inventory/InventoryList";
import InventoryForm from "./components/Inventory/InventoryForm";
import InventoryDetails from "./components/Inventory/InventoryDetails";
import ReservationList from "./components/Reservation/ReservationList";
import ReservationForm from "./components/Reservation/ReservationForm";
import ReservationDetails from "./components/Reservation/ReservationDetails";
import BillList from "./components/Bill/BillList";
import BillDetails from "./components/Bill/BillDetails";
import TextCode from "./components/Bill/TextCode";
import Notifications from "./components/Notifications/Notifications";
import KitchenDashboard from "./components/Kitchen/KitchenDashboard";
import PaymentForm from "./components/Payment/PaymentForm";
import "./services/styles/main.css";
import "./services/styles/styles.css";
import "./services/styles/responsive.css";

const App = () => {
  // Create Material-UI theme inside component
  const theme = React.useMemo(() => createTheme(), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />

        {/* Customers */}
        <Route path="/customers" element={<ProtectedRoute><Layout><CustomerList /></Layout></ProtectedRoute>} />
        <Route path="/customers/new" element={<ProtectedRoute><Layout><CustomerForm /></Layout></ProtectedRoute>} />
        <Route path="/customers/:id/edit" element={<ProtectedRoute><Layout><CustomerForm /></Layout></ProtectedRoute>} />

        {/* Tables */}
        <Route path="/tables" element={<ProtectedRoute><Layout><TableList /></Layout></ProtectedRoute>} />
        <Route path="/tables/new" element={<ProtectedRoute><Layout><TableForm /></Layout></ProtectedRoute>} />
        <Route path="/tables/:id/edit" element={<ProtectedRoute><Layout><TableForm /></Layout></ProtectedRoute>} />
        <Route path="/tables/status" element={<ProtectedRoute><Layout><TableStatus /></Layout></ProtectedRoute>} />
        <Route path="/tables/qr-generator" element={<ProtectedRoute><Layout><QRCodeGenerator /></Layout></ProtectedRoute>} />
        <Route path="/tables/qr-scanner" element={<ProtectedRoute><Layout><QRCodeScanner /></Layout></ProtectedRoute>} />

        {/* Menu */}
        <Route path="/menu" element={<ProtectedRoute><Layout><MenuList /></Layout></ProtectedRoute>} />
        <Route path="/menu/items/:id" element={<ProtectedRoute><Layout><MenuItem /></Layout></ProtectedRoute>} />
        <Route path="/menu/items/new" element={<ProtectedRoute><Layout><MenuItemForm /></Layout></ProtectedRoute>} />
        <Route path="/menu/items/:id/edit" element={<ProtectedRoute><Layout><MenuItemForm /></Layout></ProtectedRoute>} />
        <Route path="/menu/categories" element={<ProtectedRoute><Layout><MenuCategory /></Layout></ProtectedRoute>} />

        {/* Orders */}
        <Route path="/orders" element={<ProtectedRoute><Layout><OrderList /></Layout></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><Layout><OrderDetails /></Layout></ProtectedRoute>} />
        <Route path="/orders/new" element={<ProtectedRoute><Layout><OrderForm /></Layout></ProtectedRoute>} />
        <Route path="/orders/tracking" element={<ProtectedRoute><Layout><OrderTracking /></Layout></ProtectedRoute>} />

        {/* Feedback */}
        <Route path="/feedbacks" element={<ProtectedRoute><Layout><FeedbackList /></Layout></ProtectedRoute>} />
        <Route path="/feedbacks/new" element={<ProtectedRoute><Layout><FeedbackForm /></Layout></ProtectedRoute>} />

        {/* Reports */}
        <Route path="/reports" element={<ProtectedRoute><Layout><ReportDashboard /></Layout></ProtectedRoute>} />
        <Route path="/reports/export" element={<ProtectedRoute><Layout><ExportReports /></Layout></ProtectedRoute>} />
        <Route path="/reports/list" element={<ProtectedRoute><Layout><ReportList /></Layout></ProtectedRoute>} />

        {/* Inventory */}
        <Route path="/inventory" element={<ProtectedRoute><Layout><InventoryList /></Layout></ProtectedRoute>} />
        <Route path="/inventory/new" element={<ProtectedRoute><Layout><InventoryForm /></Layout></ProtectedRoute>} />
        <Route path="/inventory/:id" element={<ProtectedRoute><Layout><InventoryDetails /></Layout></ProtectedRoute>} />

        {/* Reservation */}
        <Route path="/reservations" element={<ProtectedRoute><Layout><ReservationList /></Layout></ProtectedRoute>} />
        <Route path="/reservations/new" element={<ProtectedRoute><Layout><ReservationForm /></Layout></ProtectedRoute>} />
        <Route path="/reservations/:id" element={<ProtectedRoute><Layout><ReservationDetails /></Layout></ProtectedRoute>} />

        {/* Bills */}
        <Route path="/bills" element={<ProtectedRoute><Layout><BillList /></Layout></ProtectedRoute>} />
        <Route path="/bills/:id" element={<ProtectedRoute><Layout><BillDetails /></Layout></ProtectedRoute>} />
        <Route path="/bills/text-code" element={<ProtectedRoute><Layout><TextCode /></Layout></ProtectedRoute>} />

        {/* Notifications */}
        <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />

        {/* Kitchen Dashboard */}
        <Route path="/kitchen" element={<ProtectedRoute><Layout><KitchenDashboard /></Layout></ProtectedRoute>} />

        {/* Payment */}
        <Route path="/payment/:billId" element={<ProtectedRoute><Layout><PaymentForm /></Layout></ProtectedRoute>} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
