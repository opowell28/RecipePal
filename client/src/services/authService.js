import api from './api';

// Handles all auth-related API calls and local storage
export const authService = {
   // Register a new user
   // Sends user data to backend, saves token and user info to localStorage
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Log in existing user
  // Sends credentials to backend, saves token and user info to localStorage
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Logout user by removing info from localStorage
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get currently logged in user from localStorage
  // Returns user object or null if not logged in
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated by checking if token exists
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};