// models/PasswordResetToken.js
const fs = require('fs');
const path = require('path');

class PasswordResetToken {
  constructor() {
    this.dataFile = path.join(__dirname, '../data/password_reset_tokens.json');
    this.ensureDataFile();
  }

  // Garantir que o arquivo de dados existe
  ensureDataFile() {
    if (!fs.existsSync(this.dataFile)) {
      fs.writeFileSync(this.dataFile, JSON.stringify([], null, 2));
    }
  }

  // Carregar tokens do arquivo
  loadTokens() {
    try {
      const data = fs.readFileSync(this.dataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Erro ao carregar tokens:', error);
      return [];
    }
  }

  // Salvar tokens no arquivo
  saveTokens(tokens) {
    try {
      fs.writeFileSync(this.dataFile, JSON.stringify(tokens, null, 2));
    } catch (error) {
      console.error('Erro ao salvar tokens:', error);
    }
  }

  // Criar um novo token de recuperação
  create(userId, token, expiresAt) {
    const tokens = this.loadTokens();
    const newToken = {
      id: tokens.length > 0 ? Math.max(...tokens.map(t => t.id)) + 1 : 1,
      userId,
      token,
      expiresAt,
      used: false,
      createdAt: new Date().toISOString()
    };

    tokens.push(newToken);
    this.saveTokens(tokens);
    return newToken;
  }

  // Buscar token válido
  findValidToken(token) {
    const tokens = this.loadTokens();
    const now = new Date();

    return tokens.find(t =>
      t.token === token &&
      new Date(t.expiresAt) > now &&
      !t.used
    ) || null;
  }

  // Marcar token como usado
  markAsUsed(token) {
    const tokens = this.loadTokens();
    const tokenIndex = tokens.findIndex(t => t.token === token);

    if (tokenIndex !== -1) {
      tokens[tokenIndex].used = true;
      this.saveTokens(tokens);
      return tokens[tokenIndex];
    }

    return null;
  }

  // Limpar tokens expirados
  cleanExpiredTokens() {
    const tokens = this.loadTokens();
    const now = new Date();
    const validTokens = tokens.filter(t => new Date(t.expiresAt) > now);

    this.saveTokens(validTokens);
    return tokens.length - validTokens.length;
  }
}

module.exports = new PasswordResetToken();

