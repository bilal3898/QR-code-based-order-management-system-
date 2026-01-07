// src/utils/constants.js

// User roles
export const USER_ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    STAFF: 'staff',
    CUSTOMER: 'customer',
  };
  
  // API Endpoints (base paths)
  export const API_ENDPOINTS = {
    CUSTOMERS: '/customers',
    TABLES: '/tables',
    MENUS: '/menus',
    ORDERS: '/orders',
    BILLS: '/bills',
    RESERVATIONS: '/reservations',
    INVENTORY: '/inventory',
    FEEDBACK: '/feedback',
    REPORTS: '/reports',
    AUTH: '/auth',
    NOTIFICATIONS: '/notifications',
    QRCODE: '/qrcode',
  };
  
  // Status constants
  export const ORDER_STATUS = {
    PENDING: 'Pending',
    PREPARING: 'Preparing',
    SERVED: 'Served',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };
  
  export const TABLE_STATUS = {
    AVAILABLE: 'Available',
    OCCUPIED: 'Occupied',
    RESERVED: 'Reserved',
  };
  
  export const RESERVATION_STATUS = {
    CONFIRMED: 'Confirmed',
    CANCELLED: 'Cancelled',
    WAITING: 'Waiting',
  };
  
  export const INVENTORY_STATUS = {
    IN_STOCK: 'In Stock',
    LOW_STOCK: 'Low Stock',
    OUT_OF_STOCK: 'Out of Stock',
  };
  
  // Common error messages
  export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please try again later.',
    UNAUTHORIZED: 'Unauthorized access. Please login again.',
    NOT_FOUND: 'Requested resource not found.',
    UNKNOWN_ERROR: 'Something went wrong. Please contact support.',
  };
  
  // LocalStorage keys
  export const STORAGE_KEYS = {
    TOKEN: 'authToken',
    USER: 'authUser',
  };
  
  