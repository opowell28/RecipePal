import api from './api';

// Service for handling all recipe-related API calls
export const recipeService = {
  // Get all recipes, optionally filtered by tag
  getRecipes: async (tag = null) => {
    const url = tag ? `/recipes?tag=${encodeURIComponent(tag)}` : '/recipes';
    const response = await api.get(url);
    return response.data;
  },


  // Get a single recipe by ID
  getRecipe: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  // Create a new recipe
  createRecipe: async (recipeData) => {
    const response = await api.post('/recipes', recipeData);
    return response.data;
  },

  // Update an existing recipe
  updateRecipe: async (id, recipeData) => {
    const response = await api.put(`/recipes/${id}`, recipeData);
    return response.data;
  },

  // Delete a recipe
  deleteRecipe: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },

  // Get all available tags
  getTags: async () => {
    const response = await api.get('/recipes/tags');
    return response.data;
  },
};