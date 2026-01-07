import React from 'react';
import { Navigate } from 'react-router-dom';

// Function to check authentication status (you can customize this)
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
