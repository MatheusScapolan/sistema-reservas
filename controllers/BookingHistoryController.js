// controllers/BookingHistoryController.js
const BookingHistory = require('../models/BookingHistory.js');
const Booking = require('../models/Booking.js');
const User = require('../models/User.js');

// Controller para operações relacionadas ao histórico de reservas
class BookingHistoryController {
  // Registrar uma nova entrada no histórico
  static async create(req, res) {
    try {
      const { booking_id, usuario_modificador_id, acao_realizada, detalhes_alteracao } = req.body;

      // Validações básicas
      if (!booking_id || !usuario_modificador_id || !acao_realizada) {
        return res.status(400).json({ 
          error: 'Dados incompletos. ID da reserva, usuário modificador e ação realizada são obrigatórios.' 
        });
      }

      // Verificar se a reserva existe
      const booking = await Booking.findById(booking_id);
      if (!booking) {
        return res.status(404).json({ 
          error: 'Reserva não encontrada.' 
        });
      }

      // Verificar se o usuário modificador existe
      const user = await User.findById(usuario_modificador_id);
      if (!user) {
        return res.status(404).json({ 
          error: 'Usuário modificador não encontrado.' 
        });
      }

      // Criar o registro no histórico
      const newHistoryEntry = await BookingHistory.create(
        booking_id,
        usuario_modificador_id,
        acao_realizada,
        detalhes_alteracao || ''
      );

      res.status(201).json(newHistoryEntry);
    } catch (error) {
      console.error('Erro ao registrar histórico:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao registrar histórico.' 
      });
    }
  }

  // Listar todo o histórico
  static async getAll(req, res) {
    try {
      const history = await BookingHistory.findAll();
      res.status(200).json(history);
    } catch (error) {
      console.error('Erro ao listar histórico:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao listar histórico.' 
      });
    }
  }

  // Buscar histórico por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const historyEntry = await BookingHistory.findById(id);
      
      if (!historyEntry) {
        return res.status(404).json({ 
          error: 'Registro de histórico não encontrado.' 
        });
      }
      
      res.status(200).json(historyEntry);
    } catch (error) {
      console.error('Erro ao buscar histórico por ID:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao buscar histórico por ID.' 
      });
    }
  }

  // Buscar histórico por reserva
  static async getByBooking(req, res) {
    try {
      const { booking_id } = req.params;
      
      // Verificar se a reserva existe
      const booking = await Booking.findById(booking_id);
      if (!booking) {
        return res.status(404).json({ 
          error: 'Reserva não encontrada.' 
        });
      }
      
      const history = await BookingHistory.findByBooking(booking_id);
      res.status(200).json(history);
    } catch (error) {
      console.error('Erro ao buscar histórico por reserva:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao buscar histórico por reserva.' 
      });
    }
  }

  // Buscar histórico por usuário modificador
  static async getByUser(req, res) {
    try {
      const { user_id } = req.params;
      
      // Verificar se o usuário existe
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({ 
          error: 'Usuário não encontrado.' 
        });
      }
      
      const history = await BookingHistory.findByUser(user_id);
      res.status(200).json(history);
    } catch (error) {
      console.error('Erro ao buscar histórico por usuário:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao buscar histórico por usuário.' 
      });
    }
  }
}

module.exports = BookingHistoryController;