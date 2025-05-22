// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/BookingController');

// Rotas para reservas
router.post('/', BookingController.create);
router.get('/', BookingController.getAll);
router.get('/availability', BookingController.checkAvailability);
router.get('/user/:user_id', BookingController.getByUser);
router.get('/room/:room_id', BookingController.getByRoom);
router.get('/date/:data', BookingController.getByDate);
router.get('/:id', BookingController.getById);
router.put('/:id', BookingController.update);
router.patch('/:id/status', BookingController.updateStatus);
router.delete('/:id', BookingController.delete);

module.exports = router;