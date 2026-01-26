import axios from 'axios';

// Base for all API requests
const API_URL = 'http://localhost:3001/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically add JWT token to all outgoing requests
// Runs before every API call and adds the authorization header if a token exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;