// src/services/orderService.js

import api from './api';

const orderService = {
  getAllOrders: async () => {
    try {
      const response = await api.get('/orders');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch orders' };
    }
  },

  getOrderById: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch order details' };
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await api.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create order' };
    }
  },

  updateOrder: async (orderId, updatedData) => {
    try {
      const response = await api.put(`/orders/${orderId}`, updatedData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update order' };
    }
  },

  deleteOrder: async (orderId) => {
    try {
      const response = await api.delete(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete order' };
    }
  },

  trackOrderStatus: async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to track order status' };
    }
  },
};

export default orderService;
