const express = require('express');
const router = express.Router();
const transactionsController = require('../controllers/transactions.controller');

/**
 * @swagger
 * tags:
 *   - name: Transactions
 *     description: Operacje złożone (transakcyjne)
 */

/**
 * @swagger
 * /transactions/meal_plan:
 *   post:
 *     summary: T1 - Utwórz plan posiłków wraz z listą zakupów
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               date:
 *                 type: string
 *                 format: date
 *               recipes:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Transakcja zakończona sukcesem
 */
router.post('/meal_plan', transactionsController.createMealPlan);

/**
 * @swagger
 * /transactions/recipe/{recipe_id}:
 *   delete:
 *     summary: T2 - Usuń przepis i posprzątaj powiązania
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: recipe_id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Przepis usunięty bezpiecznie
 */
router.delete('/recipe/:recipe_id', transactionsController.deleteRecipe);

/**
 * @swagger
 * /transactions/recipe/{recipe_id}/ingredients:
 *   put:
 *     summary: T3 - Zaktualizuj składniki przepisu (transakcja)
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: recipe_id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ingredients:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     ingredient_id:
 *                       type: integer
 *                     amount:
 *                       type: number
 *     responses:
 *       200:
 *         description: Składniki zaktualizowane
 */
router.put('/recipe/:recipe_id/ingredients', transactionsController.updateRecipeIngredients);

/**
 * @swagger
 * /transactions/fridge/update-after-meal:
 *   put:
 *     summary: T4 - Zaktualizuj stan lodówki po ugotowaniu posiłku
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               recipe_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Stan lodówki zaktualizowany
 */
router.put('/fridge/update-after-meal', transactionsController.updateFridge);

module.exports = router;
