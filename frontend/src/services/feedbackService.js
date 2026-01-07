// src/services/FeedbackService.js

import api from './api';

const FeedbackService = {
  /**
   * Get all feedback entries.
   * @returns {Promise}
   */
  getFeedbacks: () => {
    return api.get('/feedback');
  },

  /**
   * Get feedback by ID.
   * @param {string|number} id
   * @returns {Promise}
   */
  getFeedbackById: (id) => {
    return api.get(`/feedback/${id}`);
  },

  /**
   * Submit new feedback.
   * @param {Object} feedbackData
   * @returns {Promise}
   */
  createFeedback: (feedbackData) => {
    return api.post('/feedback', feedbackData);
  },

  /**
   * Update feedback.
   * @param {string|number} id
   * @param {Object} updatedData
   * @returns {Promise}
   */
  updateFeedback: (id, updatedData) => {
    return api.put(`/feedbacks/${id}`, updatedData);
  },

  /**
   * Delete feedback.
   * @param {string|number} id
   * @returns {Promise}
   */
  deleteFeedback: (id) => {
    return api.delete(`/feedbacks/${id}`);
  }
};

export default FeedbackService;
