// controllers/UserController.js
const User = require('../models/User.js');
const bcrypt = require('bcryptjs');

// Controller para operações relacionadas a usuários
class UserController {
  // Criar um novo usuário
  static async create(req, res) {
    try {
      const { nome_completo, email_institucional, senha } = req.body;

      // Validações básicas
      if (!nome_completo || !email_institucional || !senha) {
        return res.status(400).json({ 
          error: 'Dados incompletos. Nome completo, email institucional e senha são obrigatórios.' 
        });
      }

      // Verificar se o email já está em uso
      const existingUser = await User.findByEmail(email_institucional);
      if (existingUser) {
        return res.status(400).json({ 
          error: 'Email institucional já está em uso.' 
        });
      }

      // Hash da senha antes de salvar
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(senha, salt);

      // Criar o usuário com a senha criptografada
      const newUser = await User.create(nome_completo, email_institucional, hashedPassword);

      // Retornar o usuário criado (sem a senha)
      const { senha: _, ...userWithoutPassword } = newUser;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao criar usuário.' 
      });
    }
  }

  // Listar todos os usuários
  static async getAll(req, res) {
    try {
      const users = await User.findAll();
      
      // Remover senhas da resposta
      const usersWithoutPasswords = users.map(user => {
        const { senha, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.status(200).json(usersWithoutPasswords);
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao listar usuários.' 
      });
    }
  }

  // Buscar usuário por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({ 
          error: 'Usuário não encontrado.' 
        });
      }
      
      // Remover senha da resposta
      const { senha, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao buscar usuário.' 
      });
    }
  }

  // Atualizar usuário
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { nome_completo, email_institucional, senha } = req.body;
      
      // Verificar se o usuário existe
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ 
          error: 'Usuário não encontrado.' 
        });
      }
      
      // Verificar se o novo email já está em uso por outro usuário
      if (email_institucional && email_institucional !== existingUser.email_institucional) {
        const emailInUse = await User.findByEmail(email_institucional);
        if (emailInUse && emailInUse.id !== parseInt(id)) {
          return res.status(400).json({ 
            error: 'Email institucional já está em uso por outro usuário.' 
          });
        }
      }
      
      // Preparar dados para atualização
      const updatedNome = nome_completo || existingUser.nome_completo;
      const updatedEmail = email_institucional || existingUser.email_institucional;
      
      // Hash da senha se fornecida, ou manter a existente
      let updatedSenha = existingUser.senha;
      if (senha) {
        const salt = await bcrypt.genSalt(10);
        updatedSenha = await bcrypt.hash(senha, salt);
      }
      
      // Atualizar o usuário
      const updatedUser = await User.update(id, updatedNome, updatedEmail, updatedSenha);
      
      // Remover senha da resposta
      const { senha: _, ...userWithoutPassword } = updatedUser;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao atualizar usuário.' 
      });
    }
  }

  // Excluir usuário
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar se o usuário existe
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ 
          error: 'Usuário não encontrado.' 
        });
      }
      
      // Excluir o usuário
      await User.delete(id);
      
      res.status(200).json({ 
        message: 'Usuário excluído com sucesso.' 
      });
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao excluir usuário.' 
      });
    }
  }

  // Autenticar usuário (login)
  static async login(req, res) {
    try {
      const { email_institucional, senha } = req.body;
      
      // Validações básicas
      if (!email_institucional || !senha) {
        return res.status(400).json({ 
          error: 'Email institucional e senha são obrigatórios.' 
        });
      }
      
      // Buscar usuário pelo email
      const user = await User.findByEmail(email_institucional);
      if (!user) {
        return res.status(401).json({ 
          error: 'Credenciais inválidas.' 
        });
      }
      
      // Verificar senha
      const isPasswordValid = await bcrypt.compare(senha, user.senha);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          error: 'Credenciais inválidas.' 
        });
      }
      
      // Remover senha da resposta
      const { senha: _, ...userWithoutPassword } = user;
      
      // Aqui seria o lugar para gerar um token JWT, se implementado
      
      res.status(200).json({
        message: 'Login realizado com sucesso.',
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('Erro ao autenticar usuário:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao autenticar usuário.' 
      });
    }
  }
}

module.exports = UserController;
