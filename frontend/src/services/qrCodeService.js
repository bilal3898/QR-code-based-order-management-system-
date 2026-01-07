// src/services/qrCodeService.js

import api from './api';

const qrCodeService = {
  /**
   * Generate QR code for a specific table.
   * @param {string} tableId
   * @returns {Promise<Object>} - Returns the QR code image or data.
   */
  generateQRCode: async (content) => {
    try {
      const response = await api.post('/qr/generate', { content });
      return response.data;
    } catch (error) {
      console.error('Error generating QR Code:', error);
      throw error;
    }
  },

  /**
   * Scan/Decode QR code from a file or string (if supported by backend).
   * @param {File|String} qrData
   * @returns {Promise<Object>} - Decoded information (e.g., tableId).
   */
  decodeQRCode: async (qrData) => {
    try {
      const formData = new FormData();
      formData.append('qrImage', qrData); // assuming image file

      const response = await api.post('/tables/scan-qr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error decoding QR Code:', error);
      throw error;
    }
  },
};

export default qrCodeService;
