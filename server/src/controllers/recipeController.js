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
    const { title, description, servings, prepTime, cookTime, instructions, ingredients, tags } = req.body;
    const userId = req.userId;

    // Get or create tags
    const tagIds = [];
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName.toLowerCase() },
          update: {},
          create: { name: tagName.toLowerCase() },
        });
        tagIds.push(tag.id);
      }
    }

    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        servings,
        prepTime,
        cookTime,
        instructions,
        user: {
          connect: { id: userId }
        },
        ingredients: {
          create: ingredients,
        },
        tags: {
          create: tagIds.map(tagId => ({ tagId })),
        },
      },
      include: {
        ingredients: true,
        tags: {
          include: {
            tag: true,
          },
        },
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
    const { tag } = req.query; // Get tag filter from query params

    const whereClause = { userId };
    
    // Add tag filter if provided
    if (tag) {
      whereClause.tags = {
        some: {
          tag: {
            name: tag.toLowerCase(),
          },
        },
      };
    }

    const recipes = await prisma.recipe.findMany({
      where: whereClause,
      include: {
        ingredients: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
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
        tags: {
          include: {
            tag: true,
          },
        },
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
    const { title, description, servings, prepTime, cookTime, instructions, ingredients, tags } = req.body;
    const userId = req.userId;

    // Delete old ingredients and tags
    await prisma.ingredient.deleteMany({ where: { recipeId: id } });
    await prisma.recipeTag.deleteMany({ where: { recipeId: id } });

    // Get or create tags
    const tagIds = [];
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
          where: { name: tagName.toLowerCase() },
          update: {},
          create: { name: tagName.toLowerCase() },
        });
        tagIds.push(tag.id);
      }
    }

    // Clean ingredients - remove id and recipeId fields
    const cleanIngredients = ingredients.map(({ name, amount, unit, notes }) => ({
      name,
      amount,
      unit,
      notes: notes || null,
    }));

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
          create: cleanIngredients,
        },
        tags: {
          create: tagIds.map(tagId => ({ tagId })),
        },
      },
      include: {
        ingredients: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    res.json(recipe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

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

// New endpoint to get all tags
const getTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

module.exports = { createRecipe, getRecipes, getRecipe, updateRecipe, deleteRecipe, getTags };