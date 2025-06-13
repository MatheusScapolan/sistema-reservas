// models/BookingHistory.js
const pool = require('../config/database');

class BookingHistory {
  // Registrar uma nova entrada no histórico
  static async create(booking_id, usuario_modificador_id, acao_realizada, detalhes_alteracao) {
    const query = `
      INSERT INTO booking_history (booking_id, usuario_modificador_id, acao_realizada, detalhes_alteracao)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [
        booking_id, usuario_modificador_id, acao_realizada, detalhes_alteracao
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao registrar histórico:', error);
      throw error;
    }
  }

  // Buscar todo o histórico
  static async findAll() {
    const query = `
      SELECT bh.*, b.data_reserva, u.nome_completo as nome_modificador
      FROM booking_history bh
      JOIN bookings b ON bh.booking_id = b.id
      LEFT JOIN users u ON bh.usuario_modificador_id = u.id
      ORDER BY bh.timestamp_alteracao DESC
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw error;
    }
  }

  // Buscar histórico por ID
  static async findById(id) {
    const query = `
      SELECT bh.*, b.data_reserva, u.nome_completo as nome_modificador
      FROM booking_history bh
      JOIN bookings b ON bh.booking_id = b.id
      LEFT JOIN users u ON bh.usuario_modificador_id = u.id
      WHERE bh.id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar histórico por ID:', error);
      throw error;
    }
  }

  // Buscar histórico por reserva
  static async findByBooking(booking_id) {
    const query = `
      SELECT bh.*, u.nome_completo as nome_modificador
      FROM booking_history bh
      LEFT JOIN users u ON bh.usuario_modificador_id = u.id
      WHERE bh.booking_id = $1
      ORDER BY bh.timestamp_alteracao DESC
    `;
    
    try {
      const result = await pool.query(query, [booking_id]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar histórico por reserva:', error);
      throw error;
    }
  }

  // Buscar histórico por usuário modificador
  static async findByUser(usuario_modificador_id) {
    const query = `
      SELECT bh.*, b.data_reserva, r.nome_sala
      FROM booking_history bh
      JOIN bookings b ON bh.booking_id = b.id
      JOIN rooms r ON b.room_id = r.id
      WHERE bh.usuario_modificador_id = $1
      ORDER BY bh.timestamp_alteracao DESC
    `;
    
    try {
      const result = await pool.query(query, [usuario_modificador_id]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar histórico por usuário:', error);
      throw error;
    }
  }
}

module.exports = BookingHistory;