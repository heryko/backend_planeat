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
 * /shopping_list:
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
 * /shopping_list/{user_id}:
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

/**
 * @swagger
 * /shopping_list/{list_id}:
 *   delete:
 *     summary: Usuń listę zakupów (wraz z pozycjami)
 *     tags: [ShoppingLists]
 *     parameters:
 *       - in: path
 *         name: list_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID listy zakupów
 *     responses:
 *       200:
 *         description: Lista usunięta
 *       404:
 *         description: Lista nie istnieje
 */
router.delete('/:list_id', shoppingListController.deleteShoppingList);

module.exports = router;
