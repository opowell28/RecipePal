const prisma = require('../lib/prisma');

const createRecipe = async (req, res) => {
  try {
    const { title, description, servings, prepTime, cookTime, instructions, ingredients } = req.body;
    const userId = req.userId; // From auth middleware

    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        servings,
        prepTime,
        cookTime,
        instructions,
        userId,
        ingredients: {
          create: ingredients, // Array of {name, amount, unit, notes}
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

    const recipes = await prisma.recipe.findMany({
      where: { userId },
      include: {
        ingredients: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
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

    await prisma.recipe.delete({
      where: { id, userId },
    });

    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
};

module.exports = { createRecipe, getRecipes, getRecipe, updateRecipe, deleteRecipe };