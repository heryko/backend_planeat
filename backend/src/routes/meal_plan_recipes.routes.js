const express = require('express');
const router = express.Router();
const mealPlanRecipeController = require('../controllers/meal_plan_recipes.controller');

/**
 * @swagger
 * tags:
 *   - name: MealPlanRecipes
 *     description: Przepisy w planach posiłków
 */

/**
 * @swagger
 * /meal_plan_recipes:
 *   post:
 *     summary: Dodaj przepis do planu
 *     tags: [MealPlanRecipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plan_id:
 *                 type: integer
 *               recipe_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Dodano przepis do planu
 */
router.post('/', mealPlanRecipeController.addRecipeToPlan);

/**
 * @swagger
 * /meal_plan_recipes/{plan_id}:
 *   get:
 *     summary: Pobierz przepisy dla danego planu
 *     tags: [MealPlanRecipes]
 *     parameters:
 *       - in: path
 *         name: plan_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID planu posiłków
 *     responses:
 *       200:
 *         description: Lista przepisów w planie
 */
router.get('/:plan_id', mealPlanRecipeController.getRecipesByPlan);

module.exports = router;
