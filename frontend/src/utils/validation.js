// src/utils/validators.js

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  
  /**
   * Validate password strength (min 8 chars, 1 number, 1 special char)
   * @param {string} password
   * @returns {boolean}
   */
  export const isValidPassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };
  
  /**
   * Check if a value is not empty
   * @param {string} value
   * @returns {boolean}
   */
  export const isNotEmpty = (value) => {
    return value.trim() !== '';
  };
  
  /**
   * Validate phone number (basic 10 digit)
   * @param {string} phone
   * @returns {boolean}
   */
  export const isValidPhone = (phone) => {
    const regex = /^\d{10}$/;
    return regex.test(phone);
  };
  
  /**
   * Validate name (alphabetic with space, min 2 chars)
   * @param {string} name
   * @returns {boolean}
   */
  export const isValidName = (name) => {
    const regex = /^[A-Za-z ]{2,}$/;
    return regex.test(name);
  };
  
  /**
   * Validate positive number
   * @param {number} num
   * @returns {boolean}
   */
  export const isPositiveNumber = (num) => {
    return !isNaN(num) && Number(num) > 0;
  };
  