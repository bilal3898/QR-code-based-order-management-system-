// src/services/CustomerService.js

import api from './api';

const CustomerService = {
  /**
   * Get all customers.
   * @returns {Promise}
   */
  getCustomers: () => {
    return api.get('/customers');
  },

  /**
   * Get a single customer by ID.
   * @param {string|number} id
   * @returns {Promise}
   */
  getCustomerById: (id) => {
    return api.get(`/customers/${id}`);
  },

  /**
   * Create a new customer.
   * @param {Object} customerData
   * @returns {Promise}
   */
  createCustomer: (customerData) => {
    return api.post('/customers', customerData);
  },

  /**
   * Update an existing customer.
   * @param {string|number} id
   * @param {Object} updatedData
   * @returns {Promise}
   */
  updateCustomer: (id, updatedData) => {
    return api.put(`/customers/${id}`, updatedData);
  },

  /**
   * Delete a customer.
   * @param {string|number} id
   * @returns {Promise}
   */
  deleteCustomer: (id) => {
    return api.delete(`/customers/${id}`);
  },
};

export default CustomerService;
