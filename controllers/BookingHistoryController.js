// controllers/BookingHistoryController.js
// Versão completamente independente sem dependências externas

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

// Controlador de Histórico de Reservas sem dependências externas
const BookingHistoryController = {
  // Obter todo o histórico
  getAll: (req, res) => {
    try {
      res.json(mockHistory);
    } catch (error) {
      console.error('Erro ao listar histórico de reservas:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao listar histórico de reservas.' });
    }
  },
  
  // Obter histórico por ID
  getById: (req, res) => {
    try {
      const { id } = req.params;
      
      const history = mockHistory.find(h => h.id === parseInt(id));
      
      if (!history) {
        return res.status(404).json({ message: 'Histórico não encontrado' });
      }
      
      res.json(history);
    } catch (error) {
      console.error('Erro ao buscar histórico por ID:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao buscar histórico.' });
    }
  },
  
  // Obter histórico por reserva
  getByBooking: (req, res) => {
    try {
      const { booking_id } = req.params;
      
      const bookingHistory = mockHistory.filter(h => h.bookingId === parseInt(booking_id));
      
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
      
      const userHistory = mockHistory.filter(h => h.userId === parseInt(user_id));
      
      res.json(userHistory);
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