// models/Room.js
const pool = require('../config/database');

class Room {
  // Criar uma nova sala
  static async create(nome_sala, capacidade, has_tv, has_whiteboard, descricao) {
    const query = `
      INSERT INTO rooms (nome_sala, capacidade, has_tv, has_whiteboard, descricao)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [nome_sala, capacidade, has_tv, has_whiteboard, descricao]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      throw error;
    }
  }

  // Buscar todas as salas
  static async findAll() {
    const query = 'SELECT * FROM rooms ORDER BY id';
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar salas:', error);
      throw error;
    }
  }

  // Buscar sala por ID
  static async findById(id) {
    const query = 'SELECT * FROM rooms WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar sala por ID:', error);
      throw error;
    }
  }

  // Buscar salas por capacidade mínima
  static async findByCapacity(minCapacity) {
    const query = 'SELECT * FROM rooms WHERE capacidade >= $1 ORDER BY capacidade';
    
    try {
      const result = await pool.query(query, [minCapacity]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar salas por capacidade:', error);
      throw error;
    }
  }

  // Buscar salas por recursos
  static async findByResources(has_tv, has_whiteboard) {
    const query = 'SELECT * FROM rooms WHERE has_tv = $1 AND has_whiteboard = $2';
    
    try {
      const result = await pool.query(query, [has_tv, has_whiteboard]);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar salas por recursos:', error);
      throw error;
    }
  }

  // Atualizar sala
  static async update(id, nome_sala, capacidade, has_tv, has_whiteboard, descricao) {
    const query = `
      UPDATE rooms 
      SET nome_sala = $2, 
          capacidade = $3, 
          has_tv = $4, 
          has_whiteboard = $5, 
          descricao = $6
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [id, nome_sala, capacidade, has_tv, has_whiteboard, descricao]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao atualizar sala:', error);
      throw error;
    }
  }

  // Excluir sala
  static async delete(id) {
    const query = 'DELETE FROM rooms WHERE id = $1 RETURNING *';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao excluir sala:', error);
      throw error;
    }
  }
}

module.exports = Room;
