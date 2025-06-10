// routes/webRoutes.js
const express = require('express');
const router = express.Router();
const Database = require('../models/Database');
const { authenticateWeb } = require('../middlewares/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PasswordResetController = require('../controllers/PasswordResetController');
const PasswordResetToken = require('../models/PasswordResetToken');

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

    // Validar domínio do email (@sou.inteli.edu.br)
    if (!email.endsWith('@sou.inteli.edu.br')) {
      req.flash('error', 'Apenas emails do domínio @sou.inteli.edu.br são permitidos');
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

    // Validar domínio do email (@sou.inteli.edu.br)
    if (!email.endsWith('@sou.inteli.edu.br')) {
      req.flash('error', 'Apenas emails do domínio @sou.inteli.edu.br são permitidos');
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
  // Renderizar a tela de logout primeiro
  res.render('logout', {
    title: 'Saindo do Sistema - Sistema de Reservas INTELI'
  });

  // Destruir a sessão após renderizar
  setTimeout(() => {
    if (req.session) {
      req.session.destroy();
    }
  }, 100);
});

// Página de esqueci minha senha
router.get('/forgot-password', (req, res) => {
  // Se já estiver autenticado, redirecionar para a página inicial
  if (res.locals.isAuthenticated) {
    return res.redirect('/');
  }

  res.render('forgot-password', {
    title: 'Esqueci minha senha - Sistema de Reservas INTELI',
    error: req.flash('error'),
    message: req.flash('message')
  });
});

// Processar solicitação de recuperação de senha
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Validar email
    if (!email) {
      req.flash('error', 'Email é obrigatório');
      return res.redirect('/forgot-password');
    }

    // Validar domínio do email
    if (!email.endsWith('@sou.inteli.edu.br')) {
      req.flash('error', 'Apenas emails do domínio @sou.inteli.edu.br são permitidos');
      return res.redirect('/forgot-password');
    }

    // Buscar usuário pelo email
    const user = Database.users.getByEmail(email);
    if (!user) {
      // Por segurança, não revelar se o email existe ou não
      req.flash('message', 'Se o email estiver cadastrado, você receberá as instruções de recuperação');
      return res.redirect('/forgot-password');
    }

    // Gerar token único
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');

    // Definir expiração (1 hora)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Salvar token no banco
    PasswordResetToken.create(user.id, token, expiresAt.toISOString());

    // Para desenvolvimento, simular envio de email
    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;
    console.log('=== EMAIL DE RECUPERAÇÃO ===');
    console.log('Para:', email);
    console.log('Link de recuperação:', resetUrl);
    console.log('Token expira em 1 hora');
    console.log('============================');

    req.flash('message', `Instruções enviadas! Para desenvolvimento, use: ${resetUrl}`);
    res.redirect('/forgot-password');
  } catch (error) {
    console.error('Erro ao processar recuperação de senha:', error);
    req.flash('error', 'Erro interno do servidor');
    res.redirect('/forgot-password');
  }
});

// Página de redefinir senha
router.get('/reset-password', (req, res) => {
  const { token } = req.query;

  if (!token) {
    req.flash('error', 'Token de recuperação não fornecido');
    return res.redirect('/forgot-password');
  }

  // Validar token
  const resetToken = PasswordResetToken.findValidToken(token);
  const tokenValid = !!resetToken;

  res.render('reset-password', {
    title: 'Redefinir senha - Sistema de Reservas INTELI',
    error: req.flash('error'),
    message: req.flash('message'),
    token,
    tokenValid
  });
});

// Processar redefinição de senha
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    // Validar campos
    if (!token || !password || !confirmPassword) {
      req.flash('error', 'Todos os campos são obrigatórios');
      return res.redirect(`/reset-password?token=${token}`);
    }

    // Verificar se as senhas coincidem
    if (password !== confirmPassword) {
      req.flash('error', 'As senhas não coincidem');
      return res.redirect(`/reset-password?token=${token}`);
    }

    // Validar força da senha
    if (password.length < 6) {
      req.flash('error', 'A senha deve ter pelo menos 6 caracteres');
      return res.redirect(`/reset-password?token=${token}`);
    }

    // Buscar token válido
    const resetToken = PasswordResetToken.findValidToken(token);

    if (!resetToken) {
      req.flash('error', 'Token inválido ou expirado');
      return res.redirect('/forgot-password');
    }

    // Buscar usuário
    const user = Database.users.getById(resetToken.userId);
    if (!user) {
      req.flash('error', 'Usuário não encontrado');
      return res.redirect('/forgot-password');
    }

    // Criptografar nova senha
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Atualizar senha do usuário
    const updatedUser = Database.users.update(user.id, {
      password: hashedPassword
    });

    if (!updatedUser) {
      req.flash('error', 'Erro ao atualizar senha');
      return res.redirect(`/reset-password?token=${token}`);
    }

    // Marcar token como usado
    PasswordResetToken.markAsUsed(token);

    req.flash('message', 'Senha redefinida com sucesso! Faça login com sua nova senha.');
    res.redirect('/login');
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    req.flash('error', 'Erro interno do servidor');
    res.redirect('/forgot-password');
  }
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
  const history = Database.bookingHistory.getByUser(userId);

  // Separar reservas ativas e passadas
  const today = new Date().toISOString().split('T')[0];
  const activeBookings = bookings.filter(b =>
    (b.date > today || (b.date === today)) && b.status !== 'cancelled'
  );
  const pastBookings = bookings.filter(b =>
    b.date < today || b.status === 'cancelled'
  );

  // Adicionar informações da sala ao histórico
  const enrichedHistory = history.map(entry => {
    const room = Database.rooms.getById(entry.roomId);
    return {
      ...entry,
      room: room ? {
        id: room.id,
        name: room.name,
        capacity: room.capacity,
        location: room.location
      } : null
    };
  });

  res.render('bookings', {
    title: 'Minhas Reservas - Sistema de Reservas INTELI',
    activeBookings,
    pastBookings,
    history: enrichedHistory,
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

    // Validar data (só permite reservas para hoje)
    const today = new Date().toISOString().split('T')[0];
    if (date !== today) {
      req.flash('error', 'Reservas só podem ser feitas para o mesmo dia');
      return res.redirect('/bookings/create');
    }

    // Validar duração (30 min a 2 horas)
    const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
    const duration = endMinutes - startMinutes;

    if (duration < 30) {
      req.flash('error', 'A duração mínima da reserva é de 30 minutos');
      return res.redirect('/bookings/create');
    }

    if (duration > 120) {
      req.flash('error', 'A duração máxima da reserva é de 2 horas');
      return res.redirect('/bookings/create');
    }

    // Validar participantes
    const numAttendees = parseInt(attendees);
    if (isNaN(numAttendees) || numAttendees <= 0) {
      req.flash('error', 'É obrigatório informar um número válido de participantes');
      return res.redirect('/bookings/create');
    }

    if (numAttendees > room.capacity) {
      req.flash('error', `O número de participantes (${numAttendees}) excede a capacidade da sala (${room.capacity})`);
      return res.redirect('/bookings/create');
    }

    // Verificar se o usuário já tem uma reserva ativa na data
    const hasActiveBooking = Database.bookings.hasActiveBookingOnDate(userId, date);
    if (hasActiveBooking) {
      req.flash('error', 'Você já possui uma reserva ativa para esta data. Cancele a reserva existente para fazer uma nova.');
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

    // Validar se o cancelamento pode ser feito (1 hora de antecedência)
    const now = new Date();
    const reservationDateTime = new Date(`${booking.date}T${booking.startTime}:00`);
    const timeDifference = Math.floor((reservationDateTime.getTime() - now.getTime()) / (1000 * 60));

    if (timeDifference < 60) {
      req.flash('error', 'Cancelamentos devem ser feitos com pelo menos 60 minutos (1 hora) de antecedência');
      return res.redirect(`/bookings/${id}`);
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

// Apagar histórico de reservas
router.post('/bookings/clear-history', authenticateWeb, (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar todas as reservas do usuário
    const userBookings = Database.bookings.getByUser(userId);

    // Filtrar apenas reservas passadas ou canceladas (histórico)
    const today = new Date().toISOString().split('T')[0];
    const historyBookings = userBookings.filter(b =>
      b.date < today || b.status === 'cancelled'
    );

    // Remover as reservas do histórico
    let deletedCount = 0;
    historyBookings.forEach(booking => {
      const deleted = Database.bookings.delete(booking.id);
      if (deleted) {
        deletedCount++;
      }
    });

    if (deletedCount > 0) {
      req.flash('message', `Histórico apagado com sucesso! ${deletedCount} reserva(s) removida(s).`);
    } else {
      req.flash('message', 'Nenhuma reserva no histórico para apagar.');
    }

    res.redirect('/bookings');
  } catch (error) {
    console.error('Erro ao apagar histórico:', error);
    req.flash('error', 'Erro interno do servidor ao apagar histórico');
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
