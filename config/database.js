// config/database.js
require('dotenv').config();

const { Pool } = require('pg');

// Criando a pool de conexões com o PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // Necessário para conexão com Supabase
  }
});

// Teste de conexão
pool.on('connect', () => {
  console.log('Conexão com o banco de dados PostgreSQL estabelecida com sucesso');
});

pool.on('error', (err) => {
  console.error('Erro na conexão com o banco de dados:', err);
});

module.exports = pool;