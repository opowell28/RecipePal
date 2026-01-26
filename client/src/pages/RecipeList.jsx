import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import { useAuthStore } from '../store/authStore';

export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  // Fetch recipes when component mounts
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getRecipes();
      setRecipes(data);
    } catch (err) {
      setError('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      await recipeService.deleteRecipe(id);
      setRecipes(recipes.filter((recipe) => recipe.id !== id));
    } catch (err) {
      alert('Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading recipes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Recipes</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Hello, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Create button */}
        <div className="mb-6">
          <Link
            to="/recipes/new"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            + Create New Recipe
          </Link>
        </div>

        {/* Recipes grid */}
        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No recipes yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {recipe.description || 'No description'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>🍽️ {recipe.servings} servings</span>
                    {recipe.prepTime && <span>⏱️ {recipe.prepTime} min</span>}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/recipes/${recipe.id}`}
                      className="flex-1 text-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      View
                    </Link>
                    <Link
                      to={`/recipes/${recipe.id}/edit`}
                      className="flex-1 text-center px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(recipe.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}