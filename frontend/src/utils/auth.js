// src/utils/auth.js

const TOKEN_KEY = 'authToken';
const USER_KEY = 'authUser';

/**
 * Save token to localStorage
 * @param {string} token
 */
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get token from localStorage
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Save user info to localStorage
 * @param {object} user
 */
export const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Get user info from localStorage
 * @returns {object|null}
 */
export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

/**
 * Remove user info from localStorage
 */
export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

/**
 * Clear all auth-related storage
 */
export const clearAuth = () => {
  removeToken();
  removeUser();
};

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export const isLoggedIn = () => {
  return !!getToken();
};

/**
 * Check if the user has a specific role
 * @param {string} role
 * @returns {boolean}
 */
export const hasRole = (role) => {
  const user = getUser();
  return user?.role === role;
};
