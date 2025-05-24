// models/User.js
const pool = require('../config/database');

class User {
  // Criar um novo usuário
  static async create(nome_completo, email_institucional, senha) {
    const query = `
      INSERT INTO users (nome_completo, email_institucional, senha)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [nome_completo, email_institucional, senha]);
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  // Buscar todos os usuários
  static async findAll() {
    const query = 'SELECT * FROM users ORDER BY id';
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  // Buscar usuário por ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar usuário por ID:', error);
      throw error;
    }
  }

  // Buscar usuário por email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email_institucional = $1';
    
    try {
      const result = await pool.query(query, [email]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao buscar usuário por email:', error);
      throw error;
    }
  }

  // Atualizar usuário
  static async update(id, nome_completo, email_institucional, senha) {
    const query = `
      UPDATE users 
      SET nome_completo = $2, 
          email_institucional = $3, 
          senha = $4
      WHERE id = $1
      RETURNING *
    `;
    
    try {
      const result = await pool.query(query, [id, nome_completo, email_institucional, senha]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  // Excluir usuário
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      throw error;
    }
  }
}

module.exports = User;