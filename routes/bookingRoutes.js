// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/BookingController');
const { authenticate, isAdmin } = require('../middlewares/auth');

// Todas as rotas de reservas requerem autenticação
router.use(authenticate);

// Rotas para reservas
router.post('/', BookingController.create);
router.get('/', BookingController.getAll);
router.get('/check-availability', BookingController.checkAvailability);
router.get('/user/:user_id', BookingController.getByUser);
router.get('/room/:room_id', BookingController.getByRoom);
router.get('/date/:date', BookingController.getByDate);
router.get('/:id', BookingController.getById);
router.put('/:id', BookingController.update);
router.patch('/:id/status', BookingController.updateStatus);
router.delete('/:id', BookingController.delete);

// Rotas para gerenciamento de expiração (apenas admin)
router.post('/process-expired', isAdmin, BookingController.processExpiredBookings);
router.get('/expiration-stats', isAdmin, BookingController.getExpirationStats);
router.get('/:id/check-expiration', BookingController.checkBookingExpiration);

module.exports = router;
