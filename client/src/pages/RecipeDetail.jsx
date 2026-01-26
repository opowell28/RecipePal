import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { recipeService } from '../services/recipeService';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch recipe on component mount
  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      const data = await recipeService.getRecipe(id);
      setRecipe(data);
    } catch (err) {
      setError('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) {
      return;
    }

    try {
      await recipeService.deleteRecipe(id);
      navigate('/recipes');
    } catch (err) {
      alert('Failed to delete recipe');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading recipe...</div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl mb-4">{error || 'Recipe not found'}</p>
          <Link to="/recipes" className="text-blue-600 hover:text-blue-700">
            Back to Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/recipes" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Back to Recipes
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Recipe header */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
              <div className="flex gap-2">
                <Link
                  to={`/recipes/${recipe.id}/edit`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            
            {recipe.description && (
              <p className="text-gray-600 mb-4">{recipe.description}</p>
            )}

            {/* Recipe metadata */}
            <div className="flex flex-wrap gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Servings:</span>
                <span>{recipe.servings}</span>
              </div>
              {recipe.prepTime && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Prep Time:</span>
                  <span>{recipe.prepTime} min</span>
                </div>
              )}
              {recipe.cookTime && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Cook Time:</span>
                  <span>{recipe.cookTime} min</span>
                </div>
              )}
              {(recipe.prepTime || recipe.cookTime) && (
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Total Time:</span>
                  <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</span>
                </div>
              )}
            </div>
          </div>

          {/* Ingredients section */}
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ingredients</h2>
            <ul className="space-y-2">
              {recipe.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="flex items-center text-gray-700">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  <span className="font-medium">{ingredient.amount}</span>
                  <span className="mx-1">{ingredient.unit}</span>
                  <span>{ingredient.name}</span>
                  {ingredient.notes && (
                    <span className="ml-2 text-gray-500 text-sm">({ingredient.notes})</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions section */}
          <div className="px-6 py-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Instructions</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{recipe.instructions}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}