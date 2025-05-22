// routes/bookingHistoryRoutes.js
const express = require('express');
const router = express.Router();
const BookingHistoryController = require('../controllers/BookingHistoryController');

// Rotas para histórico de reservas
router.post('/', BookingHistoryController.create);
router.get('/', BookingHistoryController.getAll);
router.get('/:id', BookingHistoryController.getById);
router.get('/booking/:booking_id', BookingHistoryController.getByBooking);
router.get('/user/:user_id', BookingHistoryController.getByUser);

module.exports = router;