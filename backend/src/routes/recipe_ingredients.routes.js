const express = require('express');
const router = express.Router();
const recipeIngredientController = require('../controllers/recipe_ingredients.controller');

/**
 * @swagger
 * tags:
 *   - name: RecipeIngredients
 *     description: Składniki w przepisach
 */

/**
 * @swagger
 * /recipe_ingredients:
 *   post:
 *     summary: Przypisz składnik do przepisu
 *     tags: [RecipeIngredients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipe_id:
 *                 type: integer
 *               ingredient_id:
 *                 type: integer
 *               amount:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dodano składnik do przepisu
 */
router.post('/', recipeIngredientController.addIngredientToRecipe);

/**
 * @swagger
 * /recipe_ingredients/{recipe_id}:
 *   get:
 *     summary: Pobierz składniki danego przepisu
 *     tags: [RecipeIngredients]
 *     parameters:
 *       - in: path
 *         name: recipe_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID przepisu
 *     responses:
 *       200:
 *         description: Lista składników przepisu
 */
router.get('/:recipe_id', recipeIngredientController.getIngredientsByRecipe);

module.exports = router;
