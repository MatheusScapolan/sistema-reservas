// routes/index.js
const express = require('express');
const router = express.Router();

// Importar rotas específicas
const userRoutes = require('./userRoutes');
const roomRoutes = require('./roomRoutes');
const bookingRoutes = require('./bookingRoutes');
const bookingHistoryRoutes = require('./bookingHistoryRoutes');

// Rota básica para verificar se a API está funcionando
router.get('/', (req, res) => {
  res.json({ message: 'API do Sistema de Reserva de Salas está funcionando!' });
});

// Registrar as rotas específicas
router.use('/users', userRoutes);
router.use('/rooms', roomRoutes);
router.use('/bookings', bookingRoutes);
router.use('/history', bookingHistoryRoutes);

module.exports = router;


