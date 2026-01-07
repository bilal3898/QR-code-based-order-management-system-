// src/services/reservationService.js

import api from './api';

const ReservationService = {
  /**
   * Get all reservations
   * @returns {Promise}
   */
  getAllReservations: () => {
    return api.get('/reservations');
  },

  /**
   * Get reservation by ID
   * @param {string} id
   * @returns {Promise}
   */
  getReservationById: (id) => {
    return api.get(`/reservations/${id}`);
  },

  /**
   * Create a new reservation
   * @param {Object} reservationData
   * @returns {Promise}
   */
  createReservation: (reservationData) => {
    return api.post('/reservations', reservationData);
  },

  /**
   * Update an existing reservation
   * @param {string} id
   * @param {Object} reservationData
   * @returns {Promise}
   */
  updateReservation: (id, reservationData) => {
    return api.put(`/reservations/${id}`, reservationData);
  },

  /**
   * Delete a reservation
   * @param {string} id
   * @returns {Promise}
   */
  deleteReservation: (id) => {
    return api.delete(`/reservations/${id}`);
  }
};

export default ReservationService;
