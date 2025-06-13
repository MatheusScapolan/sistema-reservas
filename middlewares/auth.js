// middlewares/auth.js
const jwt = require('jsonwebtoken');
const Database = require('../models/Database');

// Chave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'inteli-reservas-secret-key';

// Middleware para verificar autenticação
const authenticate = (req, res, next) => {
  try {
    // Verificar se há token no header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Extrair o token do header (formato: "Bearer TOKEN")
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Buscar usuário pelo ID
    const user = Database.users.getById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    // Adicionar informações do usuário à requisição
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Erro de autenticação:', error);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};

// Middleware para verificar se o usuário é administrador
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
  }
};

// Middleware para verificar autenticação em rotas web
const authenticateWeb = (req, res, next) => {
  try {
    // Verificar se há token na sessão
    if (!req.session || !req.session.token) {
      return res.redirect('/login');
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(req.session.token, JWT_SECRET);
    
    // Buscar usuário pelo ID
    const user = Database.users.getById(decoded.id);
    if (!user) {
      req.session.destroy();
      return res.redirect('/login');
    }

    // Adicionar informações do usuário à requisição
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    // Adicionar usuário às variáveis locais para uso nas views
    res.locals.user = req.user;
    res.locals.isAuthenticated = true;
    res.locals.isAdmin = user.role === 'admin';

    next();
  } catch (error) {
    console.error('Erro de autenticação web:', error);
    req.session.destroy();
    return res.redirect('/login');
  }
};

module.exports = {
  authenticate,
  isAdmin,
  authenticateWeb
};
