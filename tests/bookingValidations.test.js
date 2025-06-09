// tests/bookingValidations.test.js
const BookingValidations = require('../utils/bookingValidations');

describe('BookingValidations', () => {
  
  describe('validateReservationDate', () => {
    test('deve aceitar reserva para o mesmo dia', () => {
      const today = new Date().toISOString().split('T')[0];
      const result = BookingValidations.validateReservationDate(today);
      expect(result.valid).toBe(true);
    });

    test('deve rejeitar reserva para data passada', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const result = BookingValidations.validateReservationDate(yesterdayStr);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Reservas só podem ser feitas para o mesmo dia');
    });

    test('deve rejeitar reserva para data futura', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      const result = BookingValidations.validateReservationDate(tomorrowStr);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Reservas só podem ser feitas para o mesmo dia');
    });
  });
  
  describe('validateReservationDuration', () => {
    test('deve aceitar duração de 30 minutos', () => {
      const result = BookingValidations.validateReservationDuration('09:00', '09:30');
      expect(result.valid).toBe(true);
    });
    
    test('deve aceitar duração de 2 horas', () => {
      const result = BookingValidations.validateReservationDuration('09:00', '11:00');
      expect(result.valid).toBe(true);
    });
    
    test('deve rejeitar duração menor que 30 minutos', () => {
      const result = BookingValidations.validateReservationDuration('09:00', '09:15');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('duração mínima');
    });
    
    test('deve rejeitar duração maior que 2 horas', () => {
      const result = BookingValidations.validateReservationDuration('09:00', '12:00');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('duração máxima');
    });
    
    test('deve rejeitar horário de fim anterior ao início', () => {
      const result = BookingValidations.validateReservationDuration('10:00', '09:00');
      expect(result.valid).toBe(false);
      expect(result.message).toContain('posterior ao horário de início');
    });
  });
  
  describe('validateCancellation', () => {
    test('deve permitir cancelamento com mais de 1 hora de antecedência', () => {
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 2);
      const futureDateStr = futureDate.toISOString().split('T')[0];
      const futureTimeStr = futureDate.toTimeString().substring(0, 5);
      const result = BookingValidations.validateCancellation(futureDateStr, futureTimeStr);
      expect(result.valid).toBe(true);
    });

    test('deve rejeitar cancelamento com menos de 1 hora de antecedência', () => {
      const nearDate = new Date();
      nearDate.setMinutes(nearDate.getMinutes() + 30);
      const nearDateStr = nearDate.toISOString().split('T')[0];
      const nearTimeStr = nearDate.toTimeString().substring(0, 5);
      const result = BookingValidations.validateCancellation(nearDateStr, nearTimeStr);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('1 hora');
    });
  });
  
  describe('validateAttendees', () => {
    test('deve aceitar número válido de participantes', () => {
      const result = BookingValidations.validateAttendees('5', 10);
      expect(result.valid).toBe(true);
    });
    
    test('deve rejeitar número zero de participantes', () => {
      const result = BookingValidations.validateAttendees('0', 10);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('número válido de participantes');
    });
    
    test('deve rejeitar número negativo de participantes', () => {
      const result = BookingValidations.validateAttendees('-1', 10);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('número válido de participantes');
    });
    
    test('deve rejeitar número que excede capacidade da sala', () => {
      const result = BookingValidations.validateAttendees('15', 10);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('excede a capacidade da sala');
    });
  });
  
  describe('validateBooking', () => {
    test('deve validar reserva completa válida', () => {
      const today = new Date().toISOString().split('T')[0];
      const bookingData = {
        date: today,
        startTime: '09:00',
        endTime: '10:00',
        attendees: '5'
      };
      const result = BookingValidations.validateBooking(bookingData, 10);
      expect(result.valid).toBe(true);
    });

    test('deve rejeitar reserva com data inválida', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      const bookingData = {
        date: tomorrowStr,
        startTime: '09:00',
        endTime: '10:00',
        attendees: '5'
      };
      const result = BookingValidations.validateBooking(bookingData, 10);
      expect(result.valid).toBe(false);
    });
  });
});
