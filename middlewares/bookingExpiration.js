// middlewares/bookingExpiration.js
const Database = require('../models/Database');
const BookingExpirationService = require('../services/bookingExpirationService');

// Instância do serviço de expiração
const expirationService = new BookingExpirationService(Database);

// Cache para evitar verificações muito frequentes
let lastCheck = null;
const CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutos em millisegundos

/**
 * Middleware para verificar e processar reservas expiradas automaticamente
 * Executa a verificação a cada 5 minutos para evitar sobrecarga
 */
const checkExpiredBookings = (req, res, next) => {
  try {
    const now = Date.now();
    
    // Verificar se já passou o intervalo mínimo desde a última verificação
    if (lastCheck && (now - lastCheck) < CHECK_INTERVAL) {
      return next();
    }
    
    // Atualizar timestamp da última verificação
    lastCheck = now;
    
    // Processar reservas expiradas em background (não bloquear a requisição)
    setImmediate(() => {
      try {
        const result = expirationService.processExpiredBookings();
        
        if (result.success && result.processedCount > 0) {
          console.log(`[BookingExpiration] ${result.message}`);
          
          // Log detalhado das reservas processadas
          result.expiredBookings.forEach(booking => {
            console.log(`[BookingExpiration] Reserva ${booking.id} (Sala ${booking.roomId}, ${booking.date} ${booking.startTime}-${booking.endTime}) movida para o histórico`);
          });
        }
        
      } catch (error) {
        console.error('[BookingExpiration] Erro ao processar reservas expiradas:', error);
      }
    });
    
    next();
    
  } catch (error) {
    console.error('[BookingExpiration] Erro no middleware de expiração:', error);
    next(); // Continuar mesmo com erro para não quebrar a aplicação
  }
};

/**
 * Middleware para verificação manual (para rotas administrativas)
 * Força a verificação imediata independente do intervalo
 */
const forceCheckExpiredBookings = (req, res, next) => {
  try {
    const result = expirationService.processExpiredBookings();
    
    // Adicionar resultado à requisição para uso no controller
    req.expirationResult = result;
    
    if (result.success && result.processedCount > 0) {
      console.log(`[BookingExpiration] Verificação manual: ${result.message}`);
    }
    
    next();
    
  } catch (error) {
    console.error('[BookingExpiration] Erro na verificação manual:', error);
    req.expirationResult = {
      success: false,
      message: 'Erro ao verificar reservas expiradas',
      error: error.message
    };
    next();
  }
};

/**
 * Middleware para adicionar estatísticas de expiração à resposta
 */
const addExpirationStats = (req, res, next) => {
  try {
    const stats = expirationService.getExpirationStats();
    req.expirationStats = stats;
    next();
  } catch (error) {
    console.error('[BookingExpiration] Erro ao obter estatísticas:', error);
    req.expirationStats = { error: error.message };
    next();
  }
};

/**
 * Função utilitária para verificação manual
 */
const manualCheck = () => {
  try {
    return expirationService.processExpiredBookings();
  } catch (error) {
    console.error('[BookingExpiration] Erro na verificação manual:', error);
    return {
      success: false,
      message: 'Erro ao verificar reservas expiradas',
      error: error.message
    };
  }
};

/**
 * Função para obter estatísticas
 */
const getStats = () => {
  try {
    return expirationService.getExpirationStats();
  } catch (error) {
    console.error('[BookingExpiration] Erro ao obter estatísticas:', error);
    return { error: error.message };
  }
};

module.exports = {
  checkExpiredBookings,
  forceCheckExpiredBookings,
  addExpirationStats,
  manualCheck,
  getStats,
  expirationService
};
