// services/bookingExpirationService.js
const moment = require('moment-timezone');

class BookingExpirationService {
  constructor(database) {
    this.db = database;
    this.timezone = 'America/Sao_Paulo'; // Fuso horário de Brasília
  }

  /**
   * Verifica e processa reservas expiradas
   * @returns {Object} Resultado do processamento
   */
  processExpiredBookings() {
    try {
      const now = moment().tz(this.timezone);
      const expiredBookings = this.findExpiredBookings(now);
      
      if (expiredBookings.length === 0) {
        return {
          success: true,
          message: 'Nenhuma reserva expirada encontrada',
          processedCount: 0,
          expiredBookings: []
        };
      }

      const processedBookings = [];
      
      for (const booking of expiredBookings) {
        const result = this.moveBookingToHistory(booking);
        if (result.success) {
          processedBookings.push(booking);
        }
      }

      return {
        success: true,
        message: `${processedBookings.length} reserva(s) movida(s) para o histórico`,
        processedCount: processedBookings.length,
        expiredBookings: processedBookings
      };

    } catch (error) {
      console.error('Erro ao processar reservas expiradas:', error);
      return {
        success: false,
        message: 'Erro ao processar reservas expiradas',
        error: error.message
      };
    }
  }

  /**
   * Encontra reservas que já passaram do horário de fim
   * @param {moment} currentTime - Horário atual
   * @returns {Array} Lista de reservas expiradas
   */
  findExpiredBookings(currentTime) {
    const allBookings = this.db.bookings.getAll();
    const expiredBookings = [];

    for (const booking of allBookings) {
      // Só processar reservas confirmadas
      if (booking.status !== 'confirmed') {
        continue;
      }

      // Criar momento da data/hora de fim da reserva
      const bookingEndDateTime = moment.tz(
        `${booking.date} ${booking.endTime}`, 
        'YYYY-MM-DD HH:mm', 
        this.timezone
      );

      // Verificar se a reserva já expirou
      if (currentTime.isAfter(bookingEndDateTime)) {
        expiredBookings.push({
          ...booking,
          expiredAt: currentTime.toISOString(),
          endDateTime: bookingEndDateTime.toISOString()
        });
      }
    }

    return expiredBookings;
  }

  /**
   * Move uma reserva para o histórico
   * @param {Object} booking - Reserva a ser movida
   * @returns {Object} Resultado da operação
   */
  moveBookingToHistory(booking) {
    try {
      // Criar entrada no histórico
      const historyEntry = {
        ...booking,
        originalBookingId: booking.id,
        status: 'completed',
        completedAt: booking.expiredAt,
        movedToHistoryAt: moment().tz(this.timezone).toISOString()
      };

      // Adicionar ao histórico
      const historyResult = this.db.bookingHistory.create(historyEntry);
      
      if (!historyResult) {
        throw new Error('Falha ao criar entrada no histórico');
      }

      // Remover da lista de reservas ativas
      const deleteResult = this.db.bookings.delete(booking.id);
      
      if (!deleteResult) {
        // Se falhou ao deletar, tentar remover do histórico para manter consistência
        this.db.bookingHistory.delete(historyResult.id);
        throw new Error('Falha ao remover reserva ativa');
      }

      console.log(`Reserva ${booking.id} movida para o histórico (ID: ${historyResult.id})`);
      
      return {
        success: true,
        historyId: historyResult.id,
        originalBookingId: booking.id
      };

    } catch (error) {
      console.error(`Erro ao mover reserva ${booking.id} para o histórico:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtém estatísticas sobre reservas expiradas
   * @returns {Object} Estatísticas
   */
  getExpirationStats() {
    try {
      const now = moment().tz(this.timezone);
      const allBookings = this.db.bookings.getAll();
      const allHistory = this.db.bookingHistory.getAll();

      const activeBookings = allBookings.filter(b => b.status === 'confirmed');
      const expiredBookings = this.findExpiredBookings(now);
      
      return {
        totalActiveBookings: activeBookings.length,
        expiredBookings: expiredBookings.length,
        totalHistoryEntries: allHistory.length,
        lastProcessedAt: now.toISOString()
      };

    } catch (error) {
      console.error('Erro ao obter estatísticas de expiração:', error);
      return {
        error: error.message
      };
    }
  }

  /**
   * Verifica se uma reserva específica está expirada
   * @param {number} bookingId - ID da reserva
   * @returns {Object} Status da reserva
   */
  checkBookingExpiration(bookingId) {
    try {
      const booking = this.db.bookings.getById(bookingId);
      
      if (!booking) {
        return {
          found: false,
          message: 'Reserva não encontrada'
        };
      }

      if (booking.status !== 'confirmed') {
        return {
          found: true,
          expired: false,
          message: `Reserva não está ativa (status: ${booking.status})`
        };
      }

      const now = moment().tz(this.timezone);
      const bookingEndDateTime = moment.tz(
        `${booking.date} ${booking.endTime}`, 
        'YYYY-MM-DD HH:mm', 
        this.timezone
      );

      const isExpired = now.isAfter(bookingEndDateTime);
      
      return {
        found: true,
        expired: isExpired,
        booking: booking,
        endDateTime: bookingEndDateTime.toISOString(),
        currentTime: now.toISOString(),
        message: isExpired ? 'Reserva expirada' : 'Reserva ainda ativa'
      };

    } catch (error) {
      console.error('Erro ao verificar expiração da reserva:', error);
      return {
        error: error.message
      };
    }
  }
}

module.exports = BookingExpirationService;
