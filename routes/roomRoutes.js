// routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/RoomController');

// Rotas para salas
router.post('/', RoomController.create);
router.get('/', RoomController.getAll);
router.get('/capacity', RoomController.getByCapacity);
router.get('/resources', RoomController.getByResources);
router.get('/:id', RoomController.getById);
router.put('/:id', RoomController.update);
router.delete('/:id', RoomController.delete);

module.exports = router;