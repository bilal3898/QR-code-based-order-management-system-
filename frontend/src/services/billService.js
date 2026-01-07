// src/services/billService.js

import api from './api';

const billService = {
  /**
   * Fetch all bills.
   * @returns {Promise}
   */
  getBills: () => {
    return api.get('/bills');
  },

  /**
   * Fetch a bill by its ID.
   * @param {string} id - Bill ID.
   * @returns {Promise}
   */
  getBillById: (id) => {
    return api.get(`/bills/${id}`);
  },

  /**
   * Generate a bill for an order.
   * @param {number} orderId - Order ID to generate bill for.
   * @returns {Promise}
   */
  generateBill: (orderId) => {
    return api.post(`/bills/generate/${orderId}`);
  },

  /**
   * Update an existing bill.
   * @param {string} id - Bill ID.
   * @param {Object} updatedData - Updated bill data.
   * @returns {Promise}
   */
  updateBill: (id, updatedData) => {
    return api.put(`/bills/${id}`, updatedData);
  },

  /**
   * Delete a bill by ID.
   * @param {string} id - Bill ID.
   * @returns {Promise}
   */
  deleteBill: (id) => {
    return api.delete(`/bills/${id}`);
  },

  /**
   * Export bill as PDF or another format.
   * @param {string} id - Bill ID.
   * @returns {Promise}
   */
  exportBill: (id) => {
    return api.get(`/bills/${id}/export`, { responseType: 'blob' });
  }
};

export default billService;
