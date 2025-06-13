// controllers/BookingHistoryController.js
const Database = require('../models/Database');

// Dados mock para quando não houver banco de dados
const mockHistory = [
  {
    id: 1,
    bookingId: 1,
    userId: 1,
    roomId: 1,
    date: '2025-04-15',
    startTime: '10:00',
    endTime: '12:00',
    purpose: 'Reunião de planejamento estratégico',
    attendees: 8,
    status: 'completed',
    room: {
      id: 1,
      name: 'Sala de Reunião 1',
      capacity: 10
    },
    user: {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@inteli.edu.br'
    }
  },
  {
    id: 2,
    bookingId: 2,
    userId: 1,
    roomId: 3,
    date: '2025-04-20',
    startTime: '14:00',
    endTime: '16:00',
    purpose: 'Apresentação de projeto final',
    attendees: 50,
    status: 'completed',
    room: {
      id: 3,
      name: 'Auditório Principal',
      capacity: 100
    },
    user: {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@inteli.edu.br'
    }
  },
  {
    id: 3,
    bookingId: 3,
    userId: 1,
    roomId: 2,
    date: '2025-05-01',
    startTime: '09:00',
    endTime: '11:00',
    purpose: 'Workshop de inovação',
    attendees: 15,
    status: 'cancelled',
    room: {
      id: 2,
      name: 'Laboratório de Inovação',
      capacity: 20
    },
    user: {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@inteli.edu.br'
    }
  }
];

// Controlador de Histórico de Reservas
const BookingHistoryController = {
  // Obter todo o histórico
  getAll: (req, res) => {
    try {
      const history = Database.bookingHistory.getAll();

      // Adicionar informações da sala e usuário a cada entrada
      const enrichedHistory = history.map(entry => {
        const room = Database.rooms.getById(entry.roomId);
        const user = Database.users.getById(entry.userId);

        return {
          ...entry,
          room: room ? {
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            location: room.location
          } : null,
          user: user ? {
            id: user.id,
            name: user.name,
            email: user.email
          } : null
        };
      });

      res.json(enrichedHistory);
    } catch (error) {
      console.error('Erro ao listar histórico de reservas:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao listar histórico de reservas.' });
    }
  },
  
  // Obter histórico por ID
  getById: (req, res) => {
    try {
      const { id } = req.params;

      const history = Database.bookingHistory.getById(parseInt(id));

      if (!history) {
        return res.status(404).json({ message: 'Histórico não encontrado' });
      }

      // Adicionar informações da sala e usuário
      const room = Database.rooms.getById(history.roomId);
      const user = Database.users.getById(history.userId);

      const enrichedHistory = {
        ...history,
        room: room ? {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          location: room.location
        } : null,
        user: user ? {
          id: user.id,
          name: user.name,
          email: user.email
        } : null
      };

      res.json(enrichedHistory);
    } catch (error) {
      console.error('Erro ao buscar histórico por ID:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao buscar histórico.' });
    }
  },
  
  // Obter histórico por reserva original
  getByBooking: (req, res) => {
    try {
      const { booking_id } = req.params;

      const bookingHistory = Database.bookingHistory.getByOriginalBooking(parseInt(booking_id));

      res.json(bookingHistory);
    } catch (error) {
      console.error('Erro ao buscar histórico por reserva:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao buscar histórico por reserva.' });
    }
  },
  
  // Obter histórico por usuário
  getByUser: (req, res) => {
    try {
      const { user_id } = req.params;

      // Verificar se o usuário tem permissão para ver este histórico
      if (req.user.role !== 'admin' && parseInt(user_id) !== req.user.id) {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      const userHistory = Database.bookingHistory.getByUser(parseInt(user_id));

      // Adicionar informações da sala a cada entrada
      const enrichedHistory = userHistory.map(entry => {
        const room = Database.rooms.getById(entry.roomId);
        return {
          ...entry,
          room: room ? {
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            location: room.location
          } : null
        };
      });

      res.json(enrichedHistory);
    } catch (error) {
      console.error('Erro ao buscar histórico por usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao buscar histórico por usuário.' });
    }
  },
  
  // Adicionar ao histórico
  create: (req, res) => {
    try {
      const { bookingId, userId, roomId, date, startTime, endTime, purpose, attendees, status } = req.body;
      
      if (!bookingId || !userId || !roomId || !date || !startTime || !endTime || !purpose || !attendees || !status) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
      }
      
      // Criar novo registro de histórico
      const newHistory = {
        id: mockHistory.length + 1,
        bookingId,
        userId,
        roomId,
        date,
        startTime,
        endTime,
        purpose,
        attendees,
        status,
        room: {
          id: roomId,
          name: `Sala ${roomId}`,
          capacity: 20
        },
        user: {
          id: userId,
          name: 'Usuário Teste',
          email: 'usuario@inteli.edu.br'
        }
      };
      
      // Adicionar à lista de histórico mock
      mockHistory.push(newHistory);
      
      res.status(201).json(newHistory);
    } catch (error) {
      console.error('Erro ao adicionar ao histórico:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao adicionar ao histórico.' });
    }
  }
};

module.exports = BookingHistoryController;