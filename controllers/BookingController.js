// controllers/BookingController.js
const Database = require('../models/Database');
const BookingExpirationService = require('../services/bookingExpirationService');

class BookingController {
  // Criar uma nova reserva
  static async create(req, res) {
    try {
      const { roomId, date, startTime, endTime, purpose, attendees } = req.body;

      // Validar campos obrigatórios
      if (!roomId || !date || !startTime || !endTime || !purpose || !attendees) {
        return res.status(400).json({
          success: false,
          message: 'Todos os campos são obrigatórios'
        });
      }

      // Verificar se a sala existe
      const room = Database.rooms.getById(parseInt(roomId));
      if (!room) {
        return res.status(404).json({
          success: false,
          message: 'Sala não encontrada'
        });
      }

      // Validar data (só permite reservas para hoje)
      const today = new Date().toISOString().split('T')[0];
      if (date !== today) {
        return res.status(400).json({
          success: false,
          message: 'Reservas só podem ser feitas para o mesmo dia'
        });
      }

      // Validar duração (30 min a 2 horas)
      const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
      const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
      const duration = endMinutes - startMinutes;

      if (duration < 30) {
        return res.status(400).json({
          success: false,
          message: 'A duração mínima da reserva é de 30 minutos'
        });
      }

      if (duration > 120) {
        return res.status(400).json({
          success: false,
          message: 'A duração máxima da reserva é de 2 horas'
        });
      }

      // Validar participantes
      const numAttendees = parseInt(attendees);
      if (isNaN(numAttendees) || numAttendees <= 0) {
        return res.status(400).json({
          success: false,
          message: 'É obrigatório informar um número válido de participantes'
        });
      }

      if (numAttendees > room.capacity) {
        return res.status(400).json({
          success: false,
          message: `O número de participantes (${numAttendees}) excede a capacidade da sala (${room.capacity})`
        });
      }

      // Verificar se o usuário já tem uma reserva ativa na data
      const hasActiveBooking = Database.bookings.hasActiveBookingOnDate(req.user.id, date);
      if (hasActiveBooking) {
        return res.status(400).json({
          success: false,
          message: 'Você já possui uma reserva ativa para esta data. Cancele a reserva existente para fazer uma nova.'
        });
      }

      // Verificar disponibilidade
      const isAvailable = Database.bookings.checkAvailability(roomId, date, startTime, endTime);
      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'Sala não disponível no horário solicitado'
        });
      }
      
      // Criar a reserva
      const newBooking = Database.bookings.create({
        roomId: parseInt(roomId),
        userId: req.user.id, // ID do usuário autenticado
        date,
        startTime,
        endTime,
        purpose,
        attendees: parseInt(attendees),
        status: 'confirmed'
      });
      
      if (newBooking.error) {
        return res.status(400).json({ 
          success: false, 
          message: newBooking.error 
        });
      }
      
      res.status(201).json({
        success: true,
        message: 'Reserva criada com sucesso',
        booking: newBooking
      });
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erro interno do servidor ao criar reserva' 
      });
    }
  }
  
  // Obter todas as reservas
  static async getAll(req, res) {
    try {
      // Se o usuário for admin, retornar todas as reservas
      // Caso contrário, retornar apenas as reservas do usuário
      let bookings;
      
      if (req.user && req.user.role === 'admin') {
        bookings = Database.bookings.getAll();
        
        // Adicionar informações da sala a cada reserva
        bookings = bookings.map(booking => {
          const room = Database.rooms.getById(booking.roomId);
          return {
            ...booking,
            room: room ? { 
              id: room.id,
              name: room.name,
              capacity: room.capacity,
              location: room.location
            } : null
          };
        });
      } else {
        bookings = Database.bookings.getByUser(req.user.id);
      }
      
      res.json(bookings);
    } catch (error) {
      console.error('Erro ao listar reservas:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao listar reservas.' });
    }
  }
  
  // Obter reserva por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const booking = Database.bookings.getById(parseInt(id));
      
      if (!booking) {
        return res.status(404).json({ message: 'Reserva não encontrada' });
      }
      
      // Verificar se o usuário tem permissão para ver esta reserva
      if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Adicionar informações da sala
      const room = Database.rooms.getById(booking.roomId);
      const bookingWithRoom = {
        ...booking,
        room: room ? { 
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          location: room.location,
          resources: room.resources
        } : null
      };
      
      res.json(bookingWithRoom);
    } catch (error) {
      console.error('Erro ao buscar reserva por ID:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao buscar reserva.' });
    }
  }
  
  // Obter reservas por usuário
  static async getByUser(req, res) {
    try {
      const { user_id } = req.params;
      
      // Verificar se o usuário tem permissão para ver estas reservas
      if (req.user.role !== 'admin' && parseInt(user_id) !== req.user.id) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      const bookings = Database.bookings.getByUser(parseInt(user_id));
      
      res.json(bookings);
    } catch (error) {
      console.error('Erro ao buscar reservas por usuário:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao buscar reservas por usuário.' });
    }
  }
  
  // Obter reservas por sala
  static async getByRoom(req, res) {
    try {
      const { room_id } = req.params;
      
      // Verificar se a sala existe
      const room = Database.rooms.getById(parseInt(room_id));
      if (!room) {
        return res.status(404).json({ message: 'Sala não encontrada' });
      }
      
      const bookings = Database.bookings.getByRoom(parseInt(room_id));
      
      // Adicionar informações do usuário a cada reserva (sem expor dados sensíveis)
      const bookingsWithUser = bookings.map(booking => {
        const user = Database.users.getById(booking.userId);
        return {
          ...booking,
          user: user ? { 
            id: user.id,
            name: user.name
          } : null
        };
      });
      
      res.json(bookingsWithUser);
    } catch (error) {
      console.error('Erro ao buscar reservas por sala:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao buscar reservas por sala.' });
    }
  }
  
  // Obter reservas por data
  static async getByDate(req, res) {
    try {
      const { date } = req.params;
      const bookings = Database.bookings.getByDate(date);
      
      // Adicionar informações da sala e do usuário a cada reserva
      const bookingsWithDetails = bookings.map(booking => {
        const room = Database.rooms.getById(booking.roomId);
        const user = Database.users.getById(booking.userId);
        
        return {
          ...booking,
          room: room ? { 
            id: room.id,
            name: room.name,
            capacity: room.capacity,
            location: room.location
          } : null,
          user: user ? { 
            id: user.id,
            name: user.name
          } : null
        };
      });
      
      res.json(bookingsWithDetails);
    } catch (error) {
      console.error('Erro ao buscar reservas por data:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao buscar reservas por data.' });
    }
  }
  
  // Verificar disponibilidade
  static async checkAvailability(req, res) {
    try {
      const { roomId, date, startTime, endTime } = req.query;
      
      if (!roomId || !date || !startTime || !endTime) {
        return res.status(400).json({ message: 'Todos os parâmetros são obrigatórios' });
      }
      
      const isAvailable = Database.bookings.checkAvailability(
        parseInt(roomId), 
        date, 
        startTime, 
        endTime
      );
      
      res.json({ available: isAvailable });
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao verificar disponibilidade.' });
    }
  }
  
  // Atualizar reserva
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { roomId, date, startTime, endTime, purpose, attendees } = req.body;
      
      // Buscar a reserva
      const booking = Database.bookings.getById(parseInt(id));
      
      if (!booking) {
        return res.status(404).json({ message: 'Reserva não encontrada' });
      }
      
      // Verificar se o usuário tem permissão para atualizar esta reserva
      if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Verificar se a sala existe (se foi alterada)
      if (roomId && parseInt(roomId) !== booking.roomId) {
        const room = Database.rooms.getById(parseInt(roomId));
        if (!room) {
          return res.status(404).json({ message: 'Sala não encontrada' });
        }
        
        // Verificar se a capacidade da sala é suficiente
        if (attendees && parseInt(attendees) > room.capacity) {
          return res.status(400).json({ message: `A sala comporta apenas ${room.capacity} pessoas` });
        }
      }
      
      // Atualizar a reserva
      const updatedBooking = Database.bookings.update(parseInt(id), {
        roomId: roomId ? parseInt(roomId) : undefined,
        date,
        startTime,
        endTime,
        purpose,
        attendees: attendees ? parseInt(attendees) : undefined
      });
      
      if (updatedBooking.error) {
        return res.status(400).json({ message: updatedBooking.error });
      }
      
      res.json({
        success: true,
        message: 'Reserva atualizada com sucesso',
        booking: updatedBooking
      });
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao atualizar reserva.' });
    }
  }
  
  // Atualizar status da reserva
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ message: 'Status é obrigatório' });
      }
      
      // Buscar a reserva
      const booking = Database.bookings.getById(parseInt(id));
      
      if (!booking) {
        return res.status(404).json({ message: 'Reserva não encontrada' });
      }
      
      // Verificar se o usuário tem permissão para atualizar esta reserva
      if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Atualizar o status
      const updatedBooking = Database.bookings.updateStatus(parseInt(id), status);
      
      if (!updatedBooking) {
        return res.status(404).json({ message: 'Reserva não encontrada' });
      }
      
      res.json({
        success: true,
        message: 'Status da reserva atualizado com sucesso',
        booking: updatedBooking
      });
    } catch (error) {
      console.error('Erro ao atualizar status da reserva:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao atualizar status da reserva.' });
    }
  }
  
  // Cancelar reserva
  static async delete(req, res) {
    try {
      const { id } = req.params;

      // Buscar a reserva
      const booking = Database.bookings.getById(parseInt(id));

      if (!booking) {
        return res.status(404).json({ message: 'Reserva não encontrada' });
      }

      // Verificar se o usuário tem permissão para cancelar esta reserva
      if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
        return res.status(403).json({ message: 'Acesso negado' });
      }

      // Validar se o cancelamento pode ser feito (1 hora de antecedência)
      const now = new Date();
      const reservationDateTime = new Date(`${booking.date}T${booking.startTime}:00`);
      const timeDifference = Math.floor((reservationDateTime.getTime() - now.getTime()) / (1000 * 60));

      if (timeDifference < 60) {
        return res.status(400).json({
          success: false,
          message: 'Cancelamentos devem ser feitos com pelo menos 60 minutos (1 hora) de antecedência'
        });
      }

      // Cancelar a reserva (atualizar status para 'cancelled')
      const updatedBooking = Database.bookings.updateStatus(parseInt(id), 'cancelled');

      if (!updatedBooking) {
        return res.status(404).json({ message: 'Reserva não encontrada' });
      }

      res.json({
        success: true,
        message: 'Reserva cancelada com sucesso'
      });
    } catch (error) {
      console.error('Erro ao cancelar reserva:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao cancelar reserva.' });
    }
  }

  // Processar reservas expiradas manualmente (apenas admin)
  static async processExpiredBookings(req, res) {
    try {
      // Verificar se é admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado. Apenas administradores podem executar esta operação.'
        });
      }

      const expirationService = new BookingExpirationService(Database);
      const result = expirationService.processExpiredBookings();

      res.json({
        success: result.success,
        message: result.message,
        data: {
          processedCount: result.processedCount,
          expiredBookings: result.expiredBookings
        }
      });

    } catch (error) {
      console.error('Erro ao processar reservas expiradas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao processar reservas expiradas.',
        error: error.message
      });
    }
  }

  // Obter estatísticas de expiração (apenas admin)
  static async getExpirationStats(req, res) {
    try {
      // Verificar se é admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado. Apenas administradores podem acessar estas estatísticas.'
        });
      }

      const expirationService = new BookingExpirationService(Database);
      const stats = expirationService.getExpirationStats();

      res.json({
        success: true,
        data: stats
      });

    } catch (error) {
      console.error('Erro ao obter estatísticas de expiração:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao obter estatísticas.',
        error: error.message
      });
    }
  }

  // Verificar se uma reserva específica está expirada
  static async checkBookingExpiration(req, res) {
    try {
      const { id } = req.params;

      // Verificar se o usuário tem permissão para ver esta reserva
      const booking = Database.bookings.getById(parseInt(id));
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Reserva não encontrada'
        });
      }

      if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Acesso negado'
        });
      }

      const expirationService = new BookingExpirationService(Database);
      const result = expirationService.checkBookingExpiration(parseInt(id));

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('Erro ao verificar expiração da reserva:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor ao verificar expiração.',
        error: error.message
      });
    }
  }
}

module.exports = BookingController;