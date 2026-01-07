// src/services/menuService.js

import api from './api';

const MenuService = {
  /**
   * Fetch all menu items.
   * @returns {Promise}
   */
  getAll: () => {
    return api.get('/menu');
  },

  /**
   * Fetch a specific menu item by ID.
   * @param {string} id
   * @returns {Promise}
   */
  getById: (id) => {
    return api.get(`/menu/${id}`);
  },

  /**
   * Create a new menu item.
   * @param {Object} data
   * @returns {Promise}
   */
  create: (data) => {
    return api.post('/menu', data);
  },

  /**
   * Update an existing menu item by ID.
   * @param {string} id
   * @param {Object} data
   * @returns {Promise}
   */
  update: (id, data) => {
    return api.put(`/menu/${id}`, data);
  },

  /**
   * Delete a menu item by ID.
   * @param {string} id
   * @returns {Promise}
   */
  remove: (id) => {
    return api.delete(`/menu/${id}`);
  }
};

export default MenuService;
