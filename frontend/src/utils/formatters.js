// src/utils/formatter.js

/**
 * Format a number into a currency string
 * @param {number} amount
 * @param {string} locale (default: 'en-IN')
 * @param {string} currency (default: 'INR')
 * @returns {string}
 */
export const formatCurrency = (amount, locale = 'en-IN', currency = 'INR') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  /**
   * Format a date string into a human-readable format
   * @param {string|Date} date
   * @param {object} options - Intl.DateTimeFormat options
   * @returns {string}
   */
  export const formatDate = (date, options = { year: 'numeric', month: 'short', day: 'numeric' }) => {
    return new Intl.DateTimeFormat('en-IN', options).format(new Date(date));
  };
  
  /**
   * Format time from date
   * @param {string|Date} date
   * @returns {string}
   */
  export const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  };
  
  /**
   * Format date and time together
   * @param {string|Date} dateTime
   * @returns {string}
   */
  export const formatDateTime = (dateTime) => {
    const date = formatDate(dateTime);
    const time = formatTime(dateTime);
    return `${date} at ${time}`;
  };
  