const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/meal_plans.controller');

/**
 * @swagger
 * tags:
 *   - name: MealPlans
 *     description: Zarządzanie planami posiłków
 */

/**
 * @swagger
 * /meal_plans:
 *   post:
 *     summary: Utwórz nowy plan posiłków
 *     tags: [MealPlans]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               plan_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Utworzono plan
 */
router.post('/', mealPlanController.createMealPlan);

/**
 * @swagger
 * /meal_plans/{user_id}:
 *   get:
 *     summary: Pobierz plany posiłków użytkownika
 *     tags: [MealPlans]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID użytkownika
 *     responses:
 *       200:
 *         description: Lista planów
 */
router.get('/:user_id', mealPlanController.getMealPlansByUser);

module.exports = router;
