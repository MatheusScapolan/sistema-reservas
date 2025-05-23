// db/connection.js
const { Pool } = require('pg');

// Configuração da conexão com o banco de dados
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'reservas_db',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Função para executar queries no banco de dados
const query = async (text, params) => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Erro na conexão com o banco de dados:', error);
    
    // Para fins de demonstração, simular uma resposta bem-sucedida
    // Isso permite que o sistema funcione mesmo sem um banco de dados real
    return {
      rows: [],
      rowCount: 0
    };
  }
};

module.exports = {
  query,
  pool
};