const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes.controller');

/**
 * @swagger
 * tags:
 *   - name: Recipes
 *     description: Zarządzanie przepisami
 */

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Utwórz nowy przepis
 *     tags: [Recipes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               user_id:
 *                 type: integer
 *               category:
 *                 type: enum
 *     responses:
 *       201:
 *         description: Przepis utworzony
 */
router.post('/', recipesController.createRecipe);

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Pobierz wszystkie przepisy
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Lista przepisów
 */
router.get('/', recipesController.getAllRecipes);

module.exports = router;
