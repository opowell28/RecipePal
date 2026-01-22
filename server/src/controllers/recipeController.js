/*
 * Recipe Controller
 * Handles CRUD operations for recipes and their ingredients
 * 
 * Example flow:
 * 1. User creates a recipe with POST /recipes
 *    - Auth middleware extracts userId from token
 *    - createRecipe validates input and saves to database
 *    - Returns created recipe with all ingredients
 * 
 * 2. User fetches all recipes with GET /recipes
 *    - getRecipes queries all recipes for authenticated user
 *    - Returns array sorted by newest first
 * 
 * 3. User views single recipe with GET /recipes/:id
 *    - getRecipe verifies user owns the recipe
 *    - Returns 404 if not found or unauthorized
 * 
 * 4. User updates recipe with PUT /recipes/:id
 *    - Replaces all ingredients with new ones
 *    - Returns updated recipe
 * 
 * 5. User deletes recipe with DELETE /recipes/:id
 *    - Removes recipe and cascades ingredient deletion
 *    - Returns success message
 */

const prisma = require('../lib/prisma');

const createRecipe = async (req, res) => {
  try {
    const { title, description, servings, prepTime, cookTime, instructions, ingredients } = req.body;
    const userId = req.userId;

    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        servings,
        prepTime,
        cookTime,
        instructions,
        user: {
          connect: { id: userId }  // Changed from userId to user: { connect: ... }
        },
        ingredients: {
          create: ingredients,
        },
      },
      include: {
        ingredients: true,
      },
    });

    res.status(201).json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
};

const getRecipes = async (req, res) => {
  try {
    const userId = req.userId;
    
    console.log('Fetching recipes for userId:', userId); // Debug log

    const recipes = await prisma.recipe.findMany({
      where: { userId },
      include: {
        ingredients: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log('Found recipes:', recipes.length); // Debug log
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error); // Better error logging
    res.status(500).json({ error: 'Failed to fetch recipes', details: error.message });
  }
};

const getRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const recipe = await prisma.recipe.findFirst({
      where: { id, userId },
      include: {
        ingredients: true,
      },
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, servings, prepTime, cookTime, instructions, ingredients } = req.body;
    const userId = req.userId;

    // Delete old ingredients and create new ones
    await prisma.ingredient.deleteMany({ where: { recipeId: id } });

    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        title,
        description,
        servings,
        prepTime,
        cookTime,
        instructions,
        ingredients: {
          create: ingredients,
        },
      },
      include: {
        ingredients: true,
      },
    });

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update recipe' });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    // First verify the recipe belongs to the user
    const recipe = await prisma.recipe.findFirst({
      where: { id, userId },
    });

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    await prisma.recipe.delete({
      where: { id },
    });

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
};

module.exports = { createRecipe, getRecipes, getRecipe, updateRecipe, deleteRecipe };