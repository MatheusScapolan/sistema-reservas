// models/Booking.js
const pool = require('../config/database');

class Booking {
  // Criar uma nova reserva
  static async create(user_id, room_id, data_reserva, horario_inicio, horario_fim, motivo_reserva, status_reserva = 'confirmada') {
    const query = `
      INSERT INTO bookings (user_id, room_id, data_reserva, horario_inicio, horario_fim, motivo_reserva, status_reserva)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [
        user_id, room_id, data_reserva, horario_inicio, horario_fim, motivo_reserva, status_reserva
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      throw error;
    }
  }

  // Buscar todas as reservas
  static async findAll() {
    const query = `
      SELECT b.*, u.nome_completo as nome_usuario, r.nome_sala 
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN rooms r ON b.room_id = r.id
      ORDER BY b.data_reserva DESC, b.horario_inicio
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      throw error;
    }
  }

  // Buscar reserva por ID
  static async findById(id) {
    const query = `
      SELECT b.*, u.nome_completo as nome_usuario, r.nome_sala 
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN rooms r ON b.room_id = r.id
      WHERE b.id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar reserva por ID:', error);
      throw error;
    }
  }

  // Buscar reservas por usuário
  static async findByUser(user_id) {
    const query = `
      SELECT b.*, r.nome_sala 
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      WHERE b.user_id = $1
      ORDER BY b.data_reserva DESC, b.horario_inicio
    `;
    
    try {
      const result = await pool.query(query, [user_id]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar reservas por usuário:', error);
      throw error;
    }
  }

  // Buscar reservas por sala
  static async findByRoom(room_id) {
    const query = `
      SELECT b.*, u.nome_completo as nome_usuario
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      WHERE b.room_id = $1
      ORDER BY b.data_reserva DESC, b.horario_inicio
    `;
    
    try {
      const result = await pool.query(query, [room_id]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar reservas por sala:', error);
      throw error;
    }
  }

  // Buscar reservas por data
  static async findByDate(data_reserva) {
    const query = `
      SELECT b.*, u.nome_completo as nome_usuario, r.nome_sala
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN rooms r ON b.room_id = r.id
      WHERE b.data_reserva = $1
      ORDER BY b.horario_inicio
    `;
    
    try {
      const result = await pool.query(query, [data_reserva]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar reservas por data:', error);
      throw error;
    }
  }

  // Verificar disponibilidade da sala
  static async checkAvailability(room_id, data_reserva, horario_inicio, horario_fim) {
    const query = `
      SELECT * FROM bookings
      WHERE room_id = $1
      AND data_reserva = $2
      AND status_reserva IN ('confirmada', 'pendente')
      AND (
        (horario_inicio <= $3 AND horario_fim > $3) OR
        (horario_inicio < $4 AND horario_fim >= $4) OR
        (horario_inicio >= $3 AND horario_fim <= $4)
      )
    `;

    try {
      const result = await pool.query(query, [room_id, data_reserva, horario_inicio, horario_fim]);
      return result.rows.length === 0; // Retorna true se estiver disponível
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error);
      throw error;
    }
  }

  // Verificar se o usuário já tem uma reserva ativa na data especificada
  static async hasActiveBookingOnDate(user_id, data_reserva) {
    const query = `
      SELECT * FROM bookings
      WHERE user_id = $1
      AND data_reserva = $2
      AND status_reserva IN ('confirmada', 'pendente')
    `;

    try {
      const result = await pool.query(query, [user_id, data_reserva]);
      return result.rows.length > 0; // Retorna true se já tem reserva ativa
    } catch (error) {
      console.error('Erro ao verificar reserva ativa do usuário:', error);
      throw error;
    }
  }

  // Atualizar reserva
  static async update(id, room_id, data_reserva, horario_inicio, horario_fim, motivo_reserva, status_reserva) {
    const query = `
      UPDATE bookings 
      SET room_id = $2, 
          data_reserva = $3, 
          horario_inicio = $4, 
          horario_fim = $5, 
          motivo_reserva = $6,
          status_reserva = $7
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [
        id, room_id, data_reserva, horario_inicio, horario_fim, motivo_reserva, status_reserva
      ]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao atualizar reserva:', error);
      throw error;
    }
  }

  // Atualizar status da reserva
  static async updateStatus(id, status_reserva) {
    const query = `
      UPDATE bookings 
      SET status_reserva = $2
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [id, status_reserva]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao atualizar status da reserva:', error);
      throw error;
    }
  }

  // Excluir reserva
  static async delete(id) {
    const query = 'DELETE FROM bookings WHERE id = $1 RETURNING *';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao excluir reserva:', error);
      throw error;
    }
  }
}

module.exports = Booking;