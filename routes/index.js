// Importa o módulo 'express'
const express = require('express');

// Cria um novo roteador do Express para definir rotas separadamente do app principal
const router = express.Router();

// Define uma rota GET para o caminho raiz ("/")
// Quando alguém acessar http://localhost:3000/, esta função será executada
router.get('/', (req, res) => {
  res.send('API funcionando!'); // Envia uma resposta simples como texto
});

// Exporta o roteador para que possa ser usado em outros arquivos, como no server.js
module.exports = router;

