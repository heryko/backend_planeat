const express = require('express');
const router = express.Router();
const ingredientsController = require('../controllers/ingredients.controller');

/**
 * @swagger
 * tags:
 *   - name: Ingredients
 *     description: Baza składników
 */

/**
 * @swagger
 * /ingredients:
 *   post:
 *     summary: Utwórz nowy składnik
 *     tags: [Ingredients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               calories:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Utworzono składnik
 */
router.post('/', ingredientsController.createIngredient);

/**
 * @swagger
 * /ingredients:
 *   get:
 *     summary: Pobierz wszystkie składniki
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: Lista składników
 */
router.get('/', ingredientsController.getAllIngredients);

module.exports = router;
