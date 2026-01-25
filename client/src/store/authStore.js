import { create } from 'zustand';
import { authService } from '../services/authService';

// Zustand store for managing auth state across app
// Makes user/auth status available to any component without prop drilling
export const useAuthStore = create((set) => ({
  // State: current user object (null if not logged in)
  user: authService.getCurrentUser(),
  // State: Boolean indicating if user is authenticated
  isAuthenticated: authService.isAuthenticated(),

  // Action: Log in a user with email/password
  // Updates state with user data and sets isAuthenticated to true
  login: async (credentials) => {
    const data = await authService.login(credentials);
    set({ user: data.user, isAuthenticated: true });
    return data;
  },

  // Action: Register a new user
  // Updates state with user data and sets isAuthenticated to true
  register: async (userData) => {
    const data = await authService.register(userData);
    set({ user: data.user, isAuthenticated: true });
    return data;
  },

  // Action: Log out user
  // Clears user data and sets isAuthenticated to false
  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));