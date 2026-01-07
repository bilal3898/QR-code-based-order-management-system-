// src/services/tableService.js

import api from './api';

const TableService = {
  /**
   * Fetch all tables
   * @returns {Promise}
   */
  getAllTables: () => {
    return api.get('/tables');
  },

  /**
   * Fetch a single table by ID
   * @param {string} id
   * @returns {Promise}
   */
  getTableById: (id) => {
    return api.get(`/tables/${id}`);
  },

  /**
   * Create a new table
   * @param {Object} tableData
   * @returns {Promise}
   */
  createTable: (tableData) => {
    return api.post('/tables', tableData);
  },

  /**
   * Update an existing table
   * @param {string} id
   * @param {Object} tableData
   * @returns {Promise}
   */
  updateTable: (id, tableData) => {
    return api.put(`/tables/${id}`, tableData);
  },

  /**
   * Delete a table
   * @param {string} id
   * @returns {Promise}
   */
  deleteTable: (id) => {
    return api.delete(`/tables/${id}`);
  },

  /**
   * Update table status (e.g., occupied, available)
   * @param {string} id
   * @param {string} status
   * @returns {Promise}
   */
  updateTableStatus: (id, status) => {
    return api.patch(`/tables/${id}/status`, { status });
  }
};

export default TableService;
