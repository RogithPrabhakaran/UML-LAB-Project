// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateJWT = require('../middleware/auth');

// Public Routes
router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Protected Routes
router.get('/:id', authenticateJWT, userController.getUser);
router.put('/:id', authenticateJWT, userController.updateUser);
router.delete('/:id', authenticateJWT, userController.deleteUser);

module.exports = router;