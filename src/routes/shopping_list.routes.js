const express = require('express');
const router = express.Router();
const shoppingListController = require('../controllers/shopping_list.controller');

/**
 * @swagger
 * tags:
 *   - name: ShoppingLists
 *     description: Zarządzanie listami zakupów
 */

/**
 * @swagger
 * /shopping_lists:
 *   post:
 *     summary: Utwórz nową listę zakupów
 *     tags: [ShoppingLists]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utworzono listę
 */
router.post('/', shoppingListController.createShoppingList);

/**
 * @swagger
 * /shopping_lists/{user_id}:
 *   get:
 *     summary: Pobierz listy zakupów użytkownika
 *     tags: [ShoppingLists]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID użytkownika
 *     responses:
 *       200:
 *         description: Listy zakupów
 */
router.get('/:user_id', shoppingListController.getShoppingListsByUser);

module.exports = router;
