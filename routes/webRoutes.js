// routes/webRoutes.js
const express = require('express');
const router = express.Router();
const Database = require('../models/Database');
const { authenticateWeb } = require('../middlewares/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Chave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'inteli-reservas-secret-key';

// Middleware para adicionar variáveis globais às views
router.use((req, res, next) => {
  res.locals.isAuthenticated = req.session && req.session.token ? true : false;
  res.locals.user = req.user || null;
  next();
});

// Página inicial
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Sistema de Reservas INTELI',
    message: req.flash('message')
  });
});

// Página de login
router.get('/login', (req, res) => {
  // Se já estiver autenticado, redirecionar para a página inicial
  if (res.locals.isAuthenticated) {
    return res.redirect('/');
  }
  
  res.render('login', { 
    title: 'Login - Sistema de Reservas INTELI',
    error: req.flash('error'),
    message: req.flash('message')
  });
});

// Processar login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validar campos obrigatórios
    if (!email || !password) {
      req.flash('error', 'Email e senha são obrigatórios');
      return res.redirect('/login');
    }
    
    // Buscar usuário pelo email
    const user = Database.users.getByEmail(email);
    if (!user) {
      req.flash('error', 'Credenciais inválidas');
      return res.redirect('/login');
    }
    
    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      req.flash('error', 'Credenciais inválidas');
      return res.redirect('/login');
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Salvar token na sessão
    req.session.token = token;
    req.session.userId = user.id;
    
    req.flash('message', 'Login realizado com sucesso');
    res.redirect('/');
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    req.flash('error', 'Erro interno do servidor ao fazer login');
    res.redirect('/login');
  }
});

// Página de cadastro
router.get('/register', (req, res) => {
  // Se já estiver autenticado, redirecionar para a página inicial
  if (res.locals.isAuthenticated) {
    return res.redirect('/');
  }
  
  res.render('register', { 
    title: 'Cadastro - Sistema de Reservas INTELI',
    error: req.flash('error')
  });
});

// Processar cadastro
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;
    
    // Validar campos obrigatórios
    if (!name || !email || !password || !confirmPassword) {
      req.flash('error', 'Todos os campos são obrigatórios');
      return res.redirect('/register');
    }
    
    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      req.flash('error', 'As senhas não coincidem');
      return res.redirect('/register');
    }
    
    // Verificar se o email já está em uso
    const existingUser = Database.users.getByEmail(email);
    if (existingUser) {
      req.flash('error', 'Este email já está em uso');
      return res.redirect('/register');
    }
    
    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Criar o novo usuário
    const newUser = Database.users.create({
      name,
      email,
      password: hashedPassword,
      role: 'user' // Papel padrão para novos usuários
    });
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Salvar token na sessão
    req.session.token = token;
    req.session.userId = newUser.id;
    
    req.flash('message', 'Cadastro realizado com sucesso');
    res.redirect('/');
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    req.flash('error', 'Erro interno do servidor ao registrar usuário');
    res.redirect('/register');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Rotas protegidas (requerem autenticação)
// Página de salas
router.get('/rooms', authenticateWeb, (req, res) => {
  const rooms = Database.rooms.getAll();
  
  res.render('rooms', { 
    title: 'Salas - Sistema de Reservas INTELI',
    rooms,
    message: req.flash('message'),
    error: req.flash('error')
  });
});

// Página de detalhes da sala
router.get('/rooms/:id', authenticateWeb, (req, res) => {
  const { id } = req.params;
  const room = Database.rooms.getById(parseInt(id));
  
  if (!room) {
    req.flash('error', 'Sala não encontrada');
    return res.redirect('/rooms');
  }
  
  // Buscar reservas futuras para esta sala
  const today = new Date().toISOString().split('T')[0];
  const bookings = Database.bookings.getByRoom(parseInt(id)).filter(b => b.date >= today && b.status !== 'cancelled');
  
  res.render('room-details', { 
    title: `${room.name} - Sistema de Reservas INTELI`,
    room,
    bookings,
    message: req.flash('message'),
    error: req.flash('error')
  });
});

// Página de reservas do usuário
router.get('/bookings', authenticateWeb, (req, res) => {
  const userId = req.user.id;
  const bookings = Database.bookings.getByUser(userId);
  
  // Separar reservas ativas e passadas
  const today = new Date().toISOString().split('T')[0];
  const activeBookings = bookings.filter(b => 
    (b.date > today || (b.date === today)) && b.status !== 'cancelled'
  );
  const pastBookings = bookings.filter(b => 
    b.date < today || b.status === 'cancelled'
  );
  
  res.render('bookings', { 
    title: 'Minhas Reservas - Sistema de Reservas INTELI',
    activeBookings,
    pastBookings,
    message: req.flash('message'),
    error: req.flash('error')
  });
});

// Página de criação de reserva
router.get('/bookings/create', authenticateWeb, (req, res) => {
  const rooms = Database.rooms.getAll();
  const selectedRoomId = req.query.roomId ? parseInt(req.query.roomId) : null;
  
  res.render('booking-create', { 
    title: 'Nova Reserva - Sistema de Reservas INTELI',
    rooms,
    selectedRoomId,
    message: req.flash('message'),
    error: req.flash('error')
  });
});

// Processar criação de reserva
router.post('/bookings/create', authenticateWeb, (req, res) => {
  try {
    const { roomId, date, startTime, endTime, purpose, attendees } = req.body;
    const userId = req.user.id;
    
    // Validar campos obrigatórios
    if (!roomId || !date || !startTime || !endTime || !purpose || !attendees) {
      req.flash('error', 'Todos os campos são obrigatórios');
      return res.redirect('/bookings/create');
    }
    
    // Verificar se a sala existe
    const room = Database.rooms.getById(parseInt(roomId));
    if (!room) {
      req.flash('error', 'Sala não encontrada');
      return res.redirect('/bookings/create');
    }
    
    // Verificar se a capacidade da sala é suficiente
    if (parseInt(attendees) > room.capacity) {
      req.flash('error', `A sala comporta apenas ${room.capacity} pessoas`);
      return res.redirect('/bookings/create');
    }
    
    // Verificar disponibilidade
    const isAvailable = Database.bookings.checkAvailability(parseInt(roomId), date, startTime, endTime);
    if (!isAvailable) {
      req.flash('error', 'Sala não disponível no horário solicitado');
      return res.redirect('/bookings/create');
    }
    
    // Criar a reserva
    const newBooking = Database.bookings.create({
      roomId: parseInt(roomId),
      userId,
      date,
      startTime,
      endTime,
      purpose,
      attendees: parseInt(attendees),
      status: 'confirmed'
    });
    
    if (newBooking.error) {
      req.flash('error', newBooking.error);
      return res.redirect('/bookings/create');
    }
    
    req.flash('message', 'Reserva criada com sucesso');
    res.redirect('/bookings');
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    req.flash('error', 'Erro interno do servidor ao criar reserva');
    res.redirect('/bookings/create');
  }
});

// Página de detalhes da reserva
router.get('/bookings/:id', authenticateWeb, (req, res) => {
  const { id } = req.params;
  const booking = Database.bookings.getById(parseInt(id));
  
  if (!booking) {
    req.flash('error', 'Reserva não encontrada');
    return res.redirect('/bookings');
  }
  
  // Verificar se o usuário tem permissão para ver esta reserva
  if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
    req.flash('error', 'Acesso negado');
    return res.redirect('/bookings');
  }
  
  // Buscar informações da sala
  const room = Database.rooms.getById(booking.roomId);
  
  res.render('booking-details', { 
    title: 'Detalhes da Reserva - Sistema de Reservas INTELI',
    booking,
    room,
    message: req.flash('message'),
    error: req.flash('error')
  });
});

// Cancelar reserva
router.post('/bookings/:id/cancel', authenticateWeb, (req, res) => {
  try {
    const { id } = req.params;
    const booking = Database.bookings.getById(parseInt(id));
    
    if (!booking) {
      req.flash('error', 'Reserva não encontrada');
      return res.redirect('/bookings');
    }
    
    // Verificar se o usuário tem permissão para cancelar esta reserva
    if (req.user.role !== 'admin' && booking.userId !== req.user.id) {
      req.flash('error', 'Acesso negado');
      return res.redirect('/bookings');
    }
    
    // Cancelar a reserva (atualizar status para 'cancelled')
    const updatedBooking = Database.bookings.updateStatus(parseInt(id), 'cancelled');
    
    if (!updatedBooking) {
      req.flash('error', 'Erro ao cancelar reserva');
      return res.redirect(`/bookings/${id}`);
    }
    
    req.flash('message', 'Reserva cancelada com sucesso');
    res.redirect('/bookings');
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    req.flash('error', 'Erro interno do servidor ao cancelar reserva');
    res.redirect('/bookings');
  }
});

// Página de perfil do usuário
router.get('/profile', authenticateWeb, (req, res) => {
  const userId = req.user.id;
  const user = Database.users.getById(userId);
  
  res.render('profile', { 
    title: 'Meu Perfil - Sistema de Reservas INTELI',
    user,
    message: req.flash('message'),
    error: req.flash('error')
  });
});

// Atualizar perfil do usuário
router.post('/profile', authenticateWeb, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, currentPassword, newPassword, confirmPassword } = req.body;
    
    // Buscar usuário pelo ID
    const user = Database.users.getById(userId);
    
    // Preparar dados para atualização
    const updateData = {};
    
    // Atualizar nome se fornecido
    if (name) {
      updateData.name = name;
    }
    
    // Atualizar email se fornecido e não estiver em uso
    if (email && email !== user.email) {
      const existingUser = Database.users.getByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        req.flash('error', 'Este email já está em uso');
        return res.redirect('/profile');
      }
      updateData.email = email;
    }
    
    // Atualizar senha se fornecida
    if (currentPassword && newPassword && confirmPassword) {
      // Verificar se as senhas coincidem
      if (newPassword !== confirmPassword) {
        req.flash('error', 'As novas senhas não coincidem');
        return res.redirect('/profile');
      }
      
      // Verificar senha atual
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        req.flash('error', 'Senha atual incorreta');
        return res.redirect('/profile');
      }
      
      // Criptografar nova senha
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }
    
    // Atualizar usuário
    const updatedUser = Database.users.update(userId, updateData);
    
    req.flash('message', 'Perfil atualizado com sucesso');
    res.redirect('/profile');
  } catch (error) {
    console.error('Erro ao atualizar perfil do usuário:', error);
    req.flash('error', 'Erro interno do servidor ao atualizar perfil do usuário');
    res.redirect('/profile');
  }
});

module.exports = router;


// Página de histórico de reservas do usuário (NOVA ROTA)
router.get('/history', authenticateWeb, (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = Database.bookings.getByUser(userId);

    // Ordenar reservas por data (mais recentes primeiro)
    bookings.sort((a, b) => new Date(b.date + 'T' + b.startTime) - new Date(a.date + 'T' + a.startTime));

    res.render('history', {
      title: 'Histórico de Reservas - Sistema de Reservas INTELI',
      bookings: bookings, // Passar todas as reservas para a view
      message: req.flash('message'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error('Erro ao buscar histórico de reservas:', error);
    req.flash('error', 'Erro interno do servidor ao buscar histórico de reservas');
    res.redirect('/'); // Redirecionar para a página inicial em caso de erro
  }
});
