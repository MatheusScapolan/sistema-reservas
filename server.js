const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

// Inicializar o app Express
const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(express.json());

<<<<<<< Updated upstream
// Rotas
const routes = require('./routes/index');
app.use('/', routes);

// Inicializa o servidor
=======
// Configuração da sessão
app.use(session({
  secret: process.env.SESSION_SECRET || 'inteli-reservas-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Configuração do flash messages
app.use(flash());

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para adicionar variáveis globais às views
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session && req.session.token ? true : false;
  res.locals.user = req.user || null;
  next();
});

// Importar e usar rotas web
const webRoutes = require('./routes/webRoutes');
app.use('/', webRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});

// Iniciar o servidor
>>>>>>> Stashed changes
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});