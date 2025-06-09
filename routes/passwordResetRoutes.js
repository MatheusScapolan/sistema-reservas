// routes/passwordResetRoutes.js
const express = require('express');
const router = express.Router();
const PasswordResetController = require('../controllers/PasswordResetController');

// Solicitar recuperação de senha
router.post('/request', PasswordResetController.requestReset);

// Validar token de recuperação
router.get('/validate/:token', PasswordResetController.validateToken);

// Redefinir senha
router.post('/reset', PasswordResetController.resetPassword);

module.exports = router;
