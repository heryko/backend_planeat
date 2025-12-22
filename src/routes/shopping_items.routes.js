const express = require('express');
const router = express.Router();
const shoppingItemController = require('../controllers/shopping_items.controller');

/**
 * @swagger
 * tags:
 *   - name: ShoppingItems
 *     description: Pozycje na liście zakupów
 */

/**
 * @swagger
 * /shopping_items:
 *   post:
 *     summary: Dodaj pozycję do listy zakupów
 *     tags: [ShoppingItems]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               list_id:
 *                 type: integer
 *               ingredient_id:
 *                 type: integer
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Dodano pozycję
 */
router.post('/', shoppingItemController.addItemToList);

/**
 * @swagger
 * /shopping_items/{list_id}:
 *   get:
 *     summary: Pobierz elementy z konkretnej listy zakupów
 *     tags: [ShoppingItems]
 *     parameters:
 *       - in: path
 *         name: list_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID listy zakupów
 *     responses:
 *       200:
 *         description: Elementy listy
 */
router.get('/:list_id', shoppingItemController.getItemsByList);

module.exports = router;
