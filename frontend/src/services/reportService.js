// src/services/reportService.js

import api from './api';

const ReportService = {
  /**
   * Get sales report.
   * @param {string} startDate - Optional start date
   * @param {string} endDate - Optional end date
   * @returns {Promise}
   */
  getSalesReport: (startDate, endDate) => {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    return api.get('/reports/sales', { params });
  },

  /**
   * Get inventory report.
   * @returns {Promise}
   */
  getInventoryReport: () => {
    return api.get('/reports/inventory');
  },

  /**
   * Get feedback report.
   * @returns {Promise}
   */
  getFeedbackReport: () => {
    return api.get('/reports/feedback');
  },

  /**
   * Export reports as a downloadable file (CSV, PDF, etc.).
   * @param {string} format - Export format (csv, pdf, etc.)
   * @param {string} startDate - Optional start date
   * @param {string} endDate - Optional end date
   * @returns {Promise}
   */
  exportReports: (format = 'csv', startDate, endDate) => {
    const params = { format };
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    return api.get('/reports/export', { params, responseType: 'blob' });
  },
};

export default ReportService;
