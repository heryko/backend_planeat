const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favorites.controller');

/**
 * @swagger
 * tags:
 *   - name: Favorites
 *     description: Zarządzanie ulubionymi przepisami
 */

/**
 * @swagger
 * /favorites:
 *   post:
 *     summary: Dodaj przepis do ulubionych
 *     tags: [Favorites]
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
 *         description: Dodano do ulubionych
 */
router.post('/', favoritesController.addFavorite);

/**
 * @swagger
 * /favorites/{user_id}:
 *   get:
 *     summary: Pobierz ulubione przepisy użytkownika
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID użytkownika
 *     responses:
 *       200:
 *         description: Lista ulubionych
 */
router.get('/:user_id', favoritesController.getFavorites);

/**
 * @swagger
 * /favorites:
 *   delete:
 *     summary: Usuń przepis z ulubionych
 *     tags: [Favorites]
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
 *         description: Usunięto z ulubionych
 */
router.delete('/', favoritesController.removeFavorite);

router.delete('/:user_id/:recipe_id', favoritesController.removeFavoriteByIds);

module.exports = router;
