require('dotenv').config();
const { Client } = require('pg');

// DEBUG
console.log('Conectando ao banco com:');
console.log({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE, // ← use o mesmo nome do seu .env
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

client.connect()
  .then(() => {
    console.log('✅ Conectado ao banco de dados!');
    // Pode-se criar tabelas ou rodar outras queries
  })
  .catch((err) => {
    console.error('❌ Erro ao inicializar o banco de dados:', err);
  });

