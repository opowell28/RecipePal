import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/protectedRoute';
import { useAuthStore } from './store/authStore';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login or recipes based on auth status */}
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/recipes" : "/login"} replace />} 
        />
        
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected routes - will add recipes pages here next */}
        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <div className="p-8">
                <h1 className="text-2xl font-bold">Recipes Page (Coming Soon)</h1>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;