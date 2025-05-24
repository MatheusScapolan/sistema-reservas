// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { authenticate } = require('../middlewares/auth');

// Rotas de autenticação
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/verify', authenticate, AuthController.verifyToken);
router.get('/profile', authenticate, AuthController.getProfile);
router.put('/profile', authenticate, AuthController.updateProfile);

module.exports = router;