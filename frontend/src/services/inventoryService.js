// src/services/InventoryService.js

import api from './api';

const InventoryService = {
  /**
   * Fetch all inventory items.
   * @returns {Promise}
   */
  getAll: () => {
    return api.get('/inventory');
  },

  /**
   * Get a single inventory item by ID.
   * @param {string|number} id
   * @returns {Promise}
   */
  getById: (id) => {
    return api.get(`/inventory/${id}`);
  },

  /**
   * Create a new inventory item.
   * @param {Object} data
   * @returns {Promise}
   */
  create: (data) => {
    return api.post('/inventory', data);
  },

  /**
   * Update an existing inventory item.
   * @param {string|number} id
   * @param {Object} data
   * @returns {Promise}
   */
  update: (id, data) => {
    return api.put(`/inventory/${id}`, data);
  },

  /**
   * Delete an inventory item.
   * @param {string|number} id
   * @returns {Promise}
   */
  remove: (id) => {
    return api.delete(`/inventory/${id}`);
  }
};

export default InventoryService;
