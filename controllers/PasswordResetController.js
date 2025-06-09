// controllers/PasswordResetController.js
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Database = require('../models/Database');
const PasswordResetToken = require('../models/PasswordResetToken');
const EmailService = require('../services/emailService');

class PasswordResetController {
  // Solicitar recuperação de senha
  static async requestReset(req, res) {
    try {
      const { email } = req.body;
      
      // Validar email
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email é obrigatório'
        });
      }
      
      // Validar domínio do email
      if (!email.endsWith('@sou.inteli.edu.br')) {
        return res.status(400).json({
          success: false,
          message: 'Apenas emails do domínio @sou.inteli.edu.br são permitidos'
        });
      }
      
      // Buscar usuário pelo email
      const user = Database.users.getByEmail(email);
      if (!user) {
        // Por segurança, não revelar se o email existe ou não
        return res.status(200).json({
          success: true,
          message: 'Se o email estiver cadastrado, você receberá as instruções de recuperação'
        });
      }
      
      // Gerar token único
      const token = crypto.randomBytes(32).toString('hex');
      
      // Definir expiração (1 hora)
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);
      
      // Salvar token no banco
      PasswordResetToken.create(user.id, token, expiresAt.toISOString());
      
      // Enviar email
      const emailResult = await EmailService.sendPasswordResetEmail(email, token);
      
      if (emailResult.success) {
        res.status(200).json({
          success: true,
          message: 'Se o email estiver cadastrado, você receberá as instruções de recuperação',
          previewUrl: emailResult.previewUrl // Apenas para desenvolvimento
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Erro ao enviar email de recuperação'
        });
      }
    } catch (error) {
      console.error('Erro ao solicitar recuperação de senha:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
  
  // Validar token de recuperação
  static async validateToken(req, res) {
    try {
      const { token } = req.params;
      
      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Token é obrigatório'
        });
      }
      
      // Buscar token válido
      const resetToken = PasswordResetToken.findValidToken(token);
      
      if (!resetToken) {
        return res.status(400).json({
          success: false,
          message: 'Token inválido ou expirado'
        });
      }
      
      res.status(200).json({
        success: true,
        message: 'Token válido'
      });
    } catch (error) {
      console.error('Erro ao validar token:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
  
  // Redefinir senha
  static async resetPassword(req, res) {
    try {
      const { token, password, confirmPassword } = req.body;
      
      // Validar campos
      if (!token || !password || !confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'Todos os campos são obrigatórios'
        });
      }
      
      // Verificar se as senhas coincidem
      if (password !== confirmPassword) {
        return res.status(400).json({
          success: false,
          message: 'As senhas não coincidem'
        });
      }
      
      // Validar força da senha
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'A senha deve ter pelo menos 6 caracteres'
        });
      }
      
      // Buscar token válido
      const resetToken = PasswordResetToken.findValidToken(token);
      
      if (!resetToken) {
        return res.status(400).json({
          success: false,
          message: 'Token inválido ou expirado'
        });
      }
      
      // Buscar usuário
      const user = Database.users.getById(resetToken.userId);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }
      
      // Criptografar nova senha
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Atualizar senha do usuário
      const updatedUser = Database.users.update(user.id, {
        password: hashedPassword
      });
      
      if (!updatedUser) {
        return res.status(500).json({
          success: false,
          message: 'Erro ao atualizar senha'
        });
      }
      
      // Marcar token como usado
      PasswordResetToken.markAsUsed(token);
      
      res.status(200).json({
        success: true,
        message: 'Senha redefinida com sucesso'
      });
    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}

module.exports = PasswordResetController;
