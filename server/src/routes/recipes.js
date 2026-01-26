// Defines recipe API endpoints and connects them to their controller functions

const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
  createRecipe,
  getRecipes,
  getRecipe,
  updateRecipe,
  deleteRecipe,
  getTags,
} = require('../controllers/recipeController');

const router = express.Router();

router.use(authMiddleware);

router.get('/tags', getTags);
router.post('/', createRecipe);
router.get('/', getRecipes);
router.get('/:id', getRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

module.exports = router;