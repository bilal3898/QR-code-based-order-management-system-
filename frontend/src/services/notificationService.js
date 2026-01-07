// src/services/notificationService.js

import api from './api';

const notificationService = {
  /**
   * Fetch all notifications.
   * @returns {Promise}
   */
  getNotifications: () => {
    return api.get('/notifications');
  },

  /**
   * Mark a notification as read.
   * @param {string} notificationId
   * @returns {Promise}
   */
  markAsRead: (notificationId) => {
    return api.patch(`/notifications/${notificationId}/read`);
  },

  /**
   * Create a new notification (for admin or event alerts).
   * @param {Object} data
   * @returns {Promise}
   */
  createNotification: (data) => {
    return api.post('/notifications', data);
  }
};

export default notificationService;
