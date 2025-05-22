// controllers/BookingController.js
const Booking = require('../models/Booking.js');
const Room = require('../models/Room.js');
const User = require('../models/User.js');
const BookingHistory = require('../models/BookingHistory.js');

// Controller para operações relacionadas a reservas
class BookingController {
  // Criar uma nova reserva
  static async create(req, res) {
    try {
      const { user_id, room_id, data_reserva, horario_inicio, horario_fim, motivo_reserva, status_reserva } = req.body;

      // Validações básicas
      if (!user_id || !room_id || !data_reserva || !horario_inicio || !horario_fim) {
        return res.status(400).json({ 
          error: 'Dados incompletos. Usuário, sala, data e horários são obrigatórios.' 
        });
      }

      // Verificar se o usuário existe
      const user = await User.findById(user_id);
      if (!user) {
        return res.status(404).json({ 
          error: 'Usuário não encontrado.' 
        });
      }

      // Verificar se a sala existe
      const room = await Room.findById(room_id);
      if (!room) {
        return res.status(404).json({ 
          error: 'Sala não encontrada.' 
        });
      }

      // Verificar se o horário de fim é posterior ao horário de início
      if (horario_fim <= horario_inicio) {
        return res.status(400).json({ 
          error: 'O horário de término deve ser posterior ao horário de início.' 
        });
      }

      // Verificar disponibilidade da sala
      const isAvailable = await Booking.checkAvailability(room_id, data_reserva, horario_inicio, horario_fim);
      if (!isAvailable) {
        return res.status(409).json({ 
          error: 'A sala já está reservada para o horário solicitado.' 
        });
      }

      // Criar a reserva
      const newBooking = await Booking.create(
        user_id,
        room_id,
        data_reserva,
        horario_inicio,
        horario_fim,
        motivo_reserva || '',
        status_reserva || 'confirmada'
      );

      // Registrar no histórico
      await BookingHistory.create(
        newBooking.id,
        user_id,
        'criação',
        `Reserva criada por ${user.nome_completo}`
      );

      res.status(201).json(newBooking);
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao criar reserva.' 
      });
    }
  }

  // Listar todas as reservas
  static async getAll(req, res) {
    try {
      const bookings = await Booking.findAll();
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Erro ao listar reservas:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao listar reservas.' 
      });
    }
  }

  // Buscar reserva por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const booking = await Booking.findById(id);
      
      if (!booking) {
        return res.status(404).json({ 
          error: 'Reserva não encontrada.' 
        });
      }
      
      res.status(200).json(booking);
    } catch (error) {
      console.error('Erro ao buscar reserva:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao buscar reserva.' 
      });
    }
  }

  // Buscar reservas por usuário
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
      
      const bookings = await Booking.findByUser(user_id);
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Erro ao buscar reservas por usuário:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao buscar reservas por usuário.' 
      });
    }
  }

  // Buscar reservas por sala
  static async getByRoom(req, res) {
    try {
      const { room_id } = req.params;
      
      // Verificar se a sala existe
      const room = await Room.findById(room_id);
      if (!room) {
        return res.status(404).json({ 
          error: 'Sala não encontrada.' 
        });
      }
      
      const bookings = await Booking.findByRoom(room_id);
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Erro ao buscar reservas por sala:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao buscar reservas por sala.' 
      });
    }
  }

  // Buscar reservas por data
  static async getByDate(req, res) {
    try {
      const { data } = req.params;
      
      // Validar formato da data
      if (!data.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return res.status(400).json({ 
          error: 'Formato de data inválido. Use o formato YYYY-MM-DD.' 
        });
      }
      
      const bookings = await Booking.findByDate(data);
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Erro ao buscar reservas por data:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao buscar reservas por data.' 
      });
    }
  }

  // Verificar disponibilidade da sala
  static async checkAvailability(req, res) {
    try {
      const { room_id, data_reserva, horario_inicio, horario_fim } = req.query;
      
      // Validações básicas
      if (!room_id || !data_reserva || !horario_inicio || !horario_fim) {
        return res.status(400).json({ 
          error: 'Dados incompletos. Sala, data e horários são obrigatórios.' 
        });
      }
      
      // Verificar se a sala existe
      const room = await Room.findById(room_id);
      if (!room) {
        return res.status(404).json({ 
          error: 'Sala não encontrada.' 
        });
      }
      
      // Verificar disponibilidade
      const isAvailable = await Booking.checkAvailability(room_id, data_reserva, horario_inicio, horario_fim);
      
      res.status(200).json({ 
        available: isAvailable 
      });
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao verificar disponibilidade.' 
      });
    }
  }

  // Atualizar reserva
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { room_id, data_reserva, horario_inicio, horario_fim, motivo_reserva, status_reserva, usuario_modificador_id } = req.body;
      
      // Verificar se a reserva existe
      const existingBooking = await Booking.findById(id);
      if (!existingBooking) {
        return res.status(404).json({ 
          error: 'Reserva não encontrada.' 
        });
      }
      
      // Verificar se o usuário modificador existe
      if (usuario_modificador_id) {
        const modificador = await User.findById(usuario_modificador_id);
        if (!modificador) {
          return res.status(404).json({ 
            error: 'Usuário modificador não encontrado.' 
          });
        }
      }
      
      // Verificar se a sala existe, se for alterada
      if (room_id && room_id !== existingBooking.room_id) {
        const room = await Room.findById(room_id);
        if (!room) {
          return res.status(404).json({ 
            error: 'Sala não encontrada.' 
          });
        }
      }
      
      // Verificar se o horário de fim é posterior ao horário de início
      if ((horario_inicio && horario_fim) && horario_fim <= horario_inicio) {
        return res.status(400).json({ 
          error: 'O horário de término deve ser posterior ao horário de início.' 
        });
      }
      
      // Verificar disponibilidade da sala se houver mudança de sala, data ou horário
      const updatedRoomId = room_id || existingBooking.room_id;
      const updatedData = data_reserva || existingBooking.data_reserva;
      const updatedInicio = horario_inicio || existingBooking.horario_inicio;
      const updatedFim = horario_fim || existingBooking.horario_fim;
      
      if (updatedRoomId !== existingBooking.room_id || 
          updatedData !== existingBooking.data_reserva || 
          updatedInicio !== existingBooking.horario_inicio || 
          updatedFim !== existingBooking.horario_fim) {
        
        const isAvailable = await Booking.checkAvailability(updatedRoomId, updatedData, updatedInicio, updatedFim);
        if (!isAvailable) {
          return res.status(409).json({ 
            error: 'A sala já está reservada para o horário solicitado.' 
          });
        }
      }
      
      // Atualizar a reserva
      const updatedBooking = await Booking.update(
        id,
        updatedRoomId,
        updatedData,
        updatedInicio,
        updatedFim,
        motivo_reserva !== undefined ? motivo_reserva : existingBooking.motivo_reserva,
        status_reserva || existingBooking.status_reserva
      );
      
      // Registrar no histórico
      if (usuario_modificador_id) {
        const modificador = await User.findById(usuario_modificador_id);
        await BookingHistory.create(
          id,
          usuario_modificador_id,
          'atualização',
          `Reserva atualizada por ${modificador.nome_completo}`
        );
      }
      
      res.status(200).json(updatedBooking);
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao atualizar reserva.' 
      });
    }
  }

  // Atualizar status da reserva
  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status_reserva, usuario_modificador_id } = req.body;
      
      // Validações básicas
      if (!status_reserva) {
        return res.status(400).json({ 
          error: 'Status da reserva é obrigatório.' 
        });
      }
      
      // Verificar se o status é válido
      if (!['confirmada', 'cancelada', 'concluida', 'pendente'].includes(status_reserva)) {
        return res.status(400).json({ 
          error: 'Status inválido. Use: confirmada, cancelada, concluida ou pendente.' 
        });
      }
      
      // Verificar se a reserva existe
      const existingBooking = await Booking.findById(id);
      if (!existingBooking) {
        return res.status(404).json({ 
          error: 'Reserva não encontrada.' 
        });
      }
      
      // Verificar se o usuário modificador existe
      if (usuario_modificador_id) {
        const modificador = await User.findById(usuario_modificador_id);
        if (!modificador) {
          return res.status(404).json({ 
            error: 'Usuário modificador não encontrado.' 
          });
        }
      }
      
      // Atualizar o status da reserva
      const updatedBooking = await Booking.updateStatus(id, status_reserva);
      
      // Registrar no histórico
      if (usuario_modificador_id) {
        const modificador = await User.findById(usuario_modificador_id);
        await BookingHistory.create(
          id,
          usuario_modificador_id,
          'alteração de status',
          `Status alterado para "${status_reserva}" por ${modificador.nome_completo}`
        );
      }
      
      res.status(200).json(updatedBooking);
    } catch (error) {
      console.error('Erro ao atualizar status da reserva:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao atualizar status da reserva.' 
      });
    }
  }

  // Excluir reserva
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const { usuario_modificador_id } = req.body;
      
      // Verificar se a reserva existe
      const existingBooking = await Booking.findById(id);
      if (!existingBooking) {
        return res.status(404).json({ 
          error: 'Reserva não encontrada.' 
        });
      }
      
      // Verificar se o usuário modificador existe
      if (usuario_modificador_id) {
        const modificador = await User.findById(usuario_modificador_id);
        if (!modificador) {
          return res.status(404).json({ 
            error: 'Usuário modificador não encontrado.' 
          });
        }
        
        // Registrar no histórico antes de excluir
        await BookingHistory.create(
          id,
          usuario_modificador_id,
          'exclusão',
          `Reserva excluída por ${modificador.nome_completo}`
        );
      }
      
      // Excluir a reserva
      await Booking.delete(id);
      
      res.status(200).json({ 
        message: 'Reserva excluída com sucesso.' 
      });
    } catch (error) {
      console.error('Erro ao excluir reserva:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao excluir reserva.' 
      });
    }
  }
}

module.exports = BookingController;