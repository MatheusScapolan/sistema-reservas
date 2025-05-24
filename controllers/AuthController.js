// controllers/AuthController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('../models/Database');

// Chave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'inteli-reservas-secret-key';

class AuthController {
  // Registrar um novo usuário
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;
      
      // Validar campos obrigatórios
      if (!name || !email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Nome, email e senha são obrigatórios' 
        });
      }
      
      // Verificar se o email já está em uso
      const existingUser = Database.users.getByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Este email já está em uso' 
        });
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
      
      // Remover a senha do objeto de resposta
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Gerar token JWT
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erro interno do servidor ao registrar usuário' 
      });
    }
  }
  
  // Login de usuário
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validar campos obrigatórios
      if (!email || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email e senha são obrigatórios' 
        });
      }
      
      // Buscar usuário pelo email
      const user = Database.users.getByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Credenciais inválidas' 
        });
      }
      
      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: 'Credenciais inválidas' 
        });
      }
      
      // Remover a senha do objeto de resposta
      const { password: _, ...userWithoutPassword } = user;
      
      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erro interno do servidor ao fazer login' 
      });
    }
  }
  
  // Verificar token JWT
  static async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: 'Token não fornecido' 
        });
      }
      
      // Verificar token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Buscar usuário pelo ID
      const user = Database.users.getById(decoded.id);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Usuário não encontrado' 
        });
      }
      
      // Remover a senha do objeto de resposta
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({
        success: true,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      res.status(401).json({ 
        success: false, 
        message: 'Token inválido ou expirado' 
      });
    }
  }
  
  // Obter perfil do usuário
  static async getProfile(req, res) {
    try {
      // O middleware de autenticação já deve ter verificado o token
      // e adicionado o usuário ao objeto de requisição
      const userId = req.user.id;
      
      // Buscar usuário pelo ID
      const user = Database.users.getById(userId);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'Usuário não encontrado' 
        });
      }
      
      // Remover a senha do objeto de resposta
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json({
        success: true,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Erro ao obter perfil do usuário:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erro interno do servidor ao obter perfil do usuário' 
      });
    }
  }
  
  // Atualizar perfil do usuário
  static async updateProfile(req, res) {
    try {
      // O middleware de autenticação já deve ter verificado o token
      // e adicionado o usuário ao objeto de requisição
      const userId = req.user.id;
      const { name, email, currentPassword, newPassword } = req.body;
      
      // Buscar usuário pelo ID
      const user = Database.users.getById(userId);
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'Usuário não encontrado' 
        });
      }
      
      // Preparar dados para atualização
      const updateData = {};
      
      // Atualizar nome se fornecido
      if (name) {
        updateData.name = name;
      }
      
      // Atualizar email se fornecido e não estiver em uso
      if (email && email !== user.email) {
        const existingUser = Database.users.getByEmail(email);
        if (existingUser) {
          return res.status(400).json({ 
            success: false, 
            message: 'Este email já está em uso' 
          });
        }
        updateData.email = email;
      }
      
      // Atualizar senha se fornecida
      if (currentPassword && newPassword) {
        // Verificar senha atual
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ 
            success: false, 
            message: 'Senha atual incorreta' 
          });
        }
        
        // Criptografar nova senha
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(newPassword, salt);
      }
      
      // Atualizar usuário
      const updatedUser = Database.users.update(userId, updateData);
      
      // Remover a senha do objeto de resposta
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      res.status(200).json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erro interno do servidor ao atualizar perfil do usuário' 
      });
    }
  }
}

module.exports = AuthController;
