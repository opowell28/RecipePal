import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { recipeService } from '../services/recipeService';

export default function RecipeForm() {
  const { id } = useParams(); // Get recipe ID from URL (for editing)
  const navigate = useNavigate();
  const isEditing = !!id; // True if editing, false if creating

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    servings: 4,
    prepTime: '',
    cookTime: '',
    instructions: '',
  });

  // Ingredients state - array of ingredient objects
  const [ingredients, setIngredients] = useState([
    { name: '', amount: '', unit: '' },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If editing, fetch the recipe data
  useEffect(() => {
    if (isEditing) {
      fetchRecipe();
    }
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const recipe = await recipeService.getRecipe(id);
      setFormData({
        title: recipe.title,
        description: recipe.description || '',
        servings: recipe.servings,
        prepTime: recipe.prepTime || '',
        cookTime: recipe.cookTime || '',
        instructions: recipe.instructions,
      });
      setIngredients(recipe.ingredients.length > 0 ? recipe.ingredients : [{ name: '', amount: '', unit: '' }]);
    } catch (err) {
      setError('Failed to load recipe');
    }
  };

  // Update form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'servings' || name === 'prepTime' || name === 'cookTime' 
        ? parseInt(value) || '' 
        : value,
    });
  };

  // Update ingredient at specific index
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = field === 'amount' ? parseFloat(value) || '' : value;
    setIngredients(newIngredients);
  };

  // Add new ingredient row
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  // Remove ingredient row
  const removeIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Filter out empty ingredients
    const validIngredients = ingredients.filter(
      (ing) => ing.name && ing.amount && ing.unit
    );

    if (validIngredients.length === 0) {
      setError('Please add at least one ingredient');
      setLoading(false);
      return;
    }

    const recipeData = {
      ...formData,
      prepTime: formData.prepTime || null,
      cookTime: formData.cookTime || null,
      ingredients: validIngredients,
    };

    try {
      if (isEditing) {
        await recipeService.updateRecipe(id, recipeData);
      } else {
        await recipeService.createRecipe(recipeData);
      }
      navigate('/recipes');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Recipe' : 'Create New Recipe'}
          </h1>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Recipe Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Chocolate Chip Cookies"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of your recipe"
            />
          </div>

          {/* Servings, Prep Time, Cook Time */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-1">
                Servings *
              </label>
              <input
                type="number"
                id="servings"
                name="servings"
                required
                min="1"
                value={formData.servings}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="prepTime" className="block text-sm font-medium text-gray-700 mb-1">
                Prep Time (min)
              </label>
              <input
                type="number"
                id="prepTime"
                name="prepTime"
                min="0"
                value={formData.prepTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="cookTime" className="block text-sm font-medium text-gray-700 mb-1">
                Cook Time (min)
              </label>
              <input
                type="number"
                id="cookTime"
                name="cookTime"
                min="0"
                value={formData.cookTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Ingredients *
              </label>
              <button
                type="button"
                onClick={addIngredient}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Ingredient
              </button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ingredient name"
                    value={ingredient.name}
                    onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Amount"
                    value={ingredient.amount}
                    onChange={(e) => handleIngredientChange(index, 'amount', e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Unit"
                    value={ingredient.unit}
                    onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    disabled={ingredients.length === 1}
                    className="px-3 py-2 text-red-600 hover:text-red-700 disabled:text-gray-400"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-1">
              Instructions *
            </label>
            <textarea
              id="instructions"
              name="instructions"
              required
              value={formData.instructions}
              onChange={handleChange}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Step-by-step instructions..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Recipe' : 'Create Recipe'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/recipes')}
              className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}