import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// Component that wraps protected pages
// Redirects to login if user is not authenticated
export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}