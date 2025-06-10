// routes/bookingHistoryRoutes.js
const express = require('express');
const router = express.Router();
const BookingHistoryController = require('../controllers/BookingHistoryController');
const { authenticate, isAdmin } = require('../middlewares/auth');

// Todas as rotas de histórico requerem autenticação
router.use(authenticate);

// Rotas para histórico de reservas
router.post('/', isAdmin, BookingHistoryController.create);
router.get('/', isAdmin, BookingHistoryController.getAll);
router.get('/:id', BookingHistoryController.getById);
router.get('/booking/:booking_id', BookingHistoryController.getByBooking);
router.get('/user/:user_id', BookingHistoryController.getByUser);

module.exports = router;