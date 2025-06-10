// routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/RoomController');
const { authenticate, isAdmin } = require('../middlewares/auth');

// Rotas públicas
router.get('/', RoomController.getAll);
router.get('/:id', RoomController.getById);
router.get('/capacity', RoomController.getByCapacity);
router.get('/resources', RoomController.getByResources);

// Rotas protegidas (apenas administradores)
router.post('/', authenticate, isAdmin, RoomController.create);
router.put('/:id', authenticate, isAdmin, RoomController.update);
router.delete('/:id', authenticate, isAdmin, RoomController.delete);

module.exports = router;
