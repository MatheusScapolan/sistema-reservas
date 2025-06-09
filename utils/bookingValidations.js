// utils/bookingValidations.js

class BookingValidations {
  
  /**
   * Valida se a data da reserva está dentro das regras permitidas
   * - Reservas podem ser feitas com até 30 dias de antecedência
   * - Só será possível o usuário realizar uma reserva para o mesmo dia
   */
  static validateReservationDate(reservationDate) {
    // Usar Date nativo para evitar problemas com moment
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reservation = new Date(reservationDate);
    reservation.setHours(0, 0, 0, 0);

    // Verificar se a data é hoje (regra: só reservas para o mesmo dia)
    if (reservation.getTime() !== today.getTime()) {
      return {
        valid: false,
        message: 'Reservas só podem ser feitas para o mesmo dia'
      };
    }
    
    // Verificar se não está no passado
    if (reservation.getTime() < today.getTime()) {
      return {
        valid: false,
        message: 'Não é possível fazer reservas para datas passadas'
      };
    }

    // Verificar se não excede 30 dias de antecedência
    const maxAdvanceDate = new Date(today);
    maxAdvanceDate.setDate(maxAdvanceDate.getDate() + 30);

    if (reservation.getTime() > maxAdvanceDate.getTime()) {
      return {
        valid: false,
        message: `Reservas podem ser feitas com até 30 dias de antecedência`
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Valida a duração da reserva
   * - Duração mínima: 30 minutos
   * - Duração máxima: 2 horas
   */
  static validateReservationDuration(startTime, endTime) {
    // Converter horários para minutos para facilitar cálculos
    const startMinutes = this.timeToMinutes(startTime);
    const endMinutes = this.timeToMinutes(endTime);

    // Verificar se o horário de fim é posterior ao de início
    if (endMinutes <= startMinutes) {
      return {
        valid: false,
        message: 'O horário de término deve ser posterior ao horário de início'
      };
    }

    const durationMinutes = endMinutes - startMinutes;
    const minDuration = 30; // 30 minutos
    const maxDuration = 120; // 2 horas
    
    // Verificar duração mínima
    if (durationMinutes < minDuration) {
      return {
        valid: false,
        message: `A duração mínima da reserva é de ${minDuration} minutos`
      };
    }
    
    // Verificar duração máxima
    if (durationMinutes > maxDuration) {
      return {
        valid: false,
        message: `A duração máxima da reserva é de ${maxDuration} minutos (2 horas)`
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Valida se o cancelamento pode ser feito
   * - Cancelamentos devem ser feitos com pelo menos 1 hora de antecedência
   */
  static validateCancellation(reservationDate, startTime) {
    const now = new Date();
    const reservationDateTime = new Date(`${reservationDate}T${startTime}:00`);
    const minCancellationTime = 60; // 1 hora em minutos

    const timeDifference = Math.floor((reservationDateTime.getTime() - now.getTime()) / (1000 * 60));
    
    if (timeDifference < minCancellationTime) {
      return {
        valid: false,
        message: `Cancelamentos devem ser feitos com pelo menos ${minCancellationTime} minutos (1 hora) de antecedência`
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Valida o número de participantes
   * - É obrigatório informar o número real de participantes
   * - Deve ser um número positivo
   */
  static validateAttendees(attendees, roomCapacity) {
    const numAttendees = parseInt(attendees);
    
    // Verificar se é um número válido
    if (isNaN(numAttendees) || numAttendees <= 0) {
      return {
        valid: false,
        message: 'É obrigatório informar um número válido de participantes'
      };
    }
    
    // Verificar se não excede a capacidade da sala
    if (numAttendees > roomCapacity) {
      return {
        valid: false,
        message: `O número de participantes (${numAttendees}) excede a capacidade da sala (${roomCapacity})`
      };
    }
    
    return { valid: true };
  }
  
  /**
   * Valida se o usuário já tem uma reserva ativa na data
   * - Usuários podem ter apenas uma reserva ativa por dia
   */
  static validateOneBookingPerDay(userId, date, Database) {
    const hasActiveBooking = Database.bookings.hasActiveBookingOnDate(userId, date);

    if (hasActiveBooking) {
      return {
        valid: false,
        message: 'Você já possui uma reserva ativa para esta data. Cancele a reserva existente para fazer uma nova.'
      };
    }

    return { valid: true };
  }

  /**
   * Valida todas as regras de uma reserva
   */
  static validateBooking(bookingData, roomCapacity, userId = null, Database = null) {
    const { date, startTime, endTime, attendees } = bookingData;

    // Validar data
    const dateValidation = this.validateReservationDate(date);
    if (!dateValidation.valid) {
      return dateValidation;
    }

    // Validar duração
    const durationValidation = this.validateReservationDuration(startTime, endTime);
    if (!durationValidation.valid) {
      return durationValidation;
    }

    // Validar participantes
    const attendeesValidation = this.validateAttendees(attendees, roomCapacity);
    if (!attendeesValidation.valid) {
      return attendeesValidation;
    }

    // Validar uma reserva por dia (se userId e Database forem fornecidos)
    if (userId && Database) {
      const oneBookingValidation = this.validateOneBookingPerDay(userId, date, Database);
      if (!oneBookingValidation.valid) {
        return oneBookingValidation;
      }
    }

    return { valid: true };
  }

  /**
   * Converte horário (HH:MM) para minutos
   */
  static timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
}

module.exports = BookingValidations;
