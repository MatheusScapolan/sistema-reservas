// services/emailService.js
const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Configuração do transportador de email

    this.transporter = null;
    // Não inicializar automaticamente para evitar problemas
    // this.initializeTransporter();
  }

  async initializeTransporter() {
    try {
      // Para desenvolvimento, criar uma conta de teste
      if (process.env.NODE_ENV !== 'production') {
        const testAccount = await nodemailer.createTestAccount();
        
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        
        console.log('Email service initialized with test account:', testAccount.user);
      } else {
        // Para produção, usar configurações reais
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: process.env.SMTP_PORT || 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });
      }
    } catch (error) {
      console.error('Erro ao inicializar serviço de email:', error);
    }
  }

  async sendPasswordResetEmail(email, token) {
    try {
      if (!this.transporter) {
        await this.initializeTransporter();
      }

      const resetUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@inteli.edu.br',
        to: email,
        subject: 'Recuperação de Senha - Sistema de Reservas INTELI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #007bff;">Recuperação de Senha</h2>
            <p>Olá,</p>
            <p>Você solicitou a recuperação de senha para sua conta no Sistema de Reservas INTELI.</p>
            <p>Clique no link abaixo para redefinir sua senha:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background-color: #007bff; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 4px; display: inline-block;">
                Redefinir Senha
              </a>
            </div>
            <p><strong>Este link expira em 1 hora.</strong></p>
            <p>Se você não solicitou esta recuperação, ignore este email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              Sistema de Reservas INTELI<br>
              Este é um email automático, não responda.
            </p>
          </div>
        `,
        text: `
          Recuperação de Senha - Sistema de Reservas INTELI
          
          Você solicitou a recuperação de senha para sua conta.
          
          Acesse o link abaixo para redefinir sua senha:
          ${resetUrl}
          
          Este link expira em 1 hora.
          
          Se você não solicitou esta recuperação, ignore este email.
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      // Para desenvolvimento, mostrar o link de preview
      if (process.env.NODE_ENV !== 'production') {
        console.log('Email enviado:', info.messageId);
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      }
      
      return {
        success: true,
        messageId: info.messageId,
        previewUrl: process.env.NODE_ENV !== 'production' ? nodemailer.getTestMessageUrl(info) : null
      };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendEmail(to, subject, html, text) {
    try {
      if (!this.transporter) {
        await this.initializeTransporter();
      }

      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@inteli.edu.br',
        to,
        subject,
        html,
        text
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: info.messageId,
        previewUrl: process.env.NODE_ENV !== 'production' ? nodemailer.getTestMessageUrl(info) : null
      };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new EmailService();
