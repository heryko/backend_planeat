const express = require('express');
const router = express.Router();
const fridgeController = require('../controllers/fridge.controller');

/**
 * @swagger
 * tags:
 *   - name: Fridge
 *     description: Zarządzanie lodówką
 */

/**
 * @swagger
 * /fridge:
 *   post:
 *     summary: Dodaj składnik do lodówki
 *     tags: [Fridge]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               ingredient_id:
 *                 type: integer
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Dodano składnik
 */
router.post('/', fridgeController.addItem);

/**
 * @swagger
 * /fridge/{user_id}:
 *   get:
 *     summary: Lista składników użytkownika
 *     tags: [Fridge]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID użytkownika
 *     responses:
 *       200:
 *         description: Zawartość lodówki
 */
router.get('/:user_id', fridgeController.getItems);

/**
 * @swagger
 * /fridge:
 *   put:
 *     summary: Aktualizacja ilości składnika
 *     tags: [Fridge]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               ingredient_id:
 *                 type: integer
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Zaktualizowano ilość
 */
router.put('/', fridgeController.updateQuantity);

/**
 * @swagger
 * /fridge:
 *   delete:
 *     summary: Usuń składnik z lodówki
 *     tags: [Fridge]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: integer
 *               ingredient_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Usunięto składnik
 */
router.delete('/', fridgeController.removeItem);

module.exports = router;
