const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Zarządzanie użytkownikami
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Utwórz nowego użytkownika
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Użytkownik utworzony
 */
router.post('/', usersController.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Pobierz wszystkich użytkowników
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista użytkowników
 */
router.get('/', usersController.getAllUsers);

/**
 * @swagger
 * /users/{user_id}:
 *   put:
 *     summary: Zaktualizuj dane użytkownika
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID użytkownika
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Dane zaktualizowane
 */
router.put('/:user_id', usersController.updateUser);

module.exports = router;
