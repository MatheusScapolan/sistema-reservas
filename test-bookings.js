const axios = require('axios');

async function testCreateBooking() {
  try {
    const response = await axios.post('http://localhost:3000/api/bookings', {
      user_id: 1,
      room_id: 2,
      data_reserva: '2025-05-23',
      horario_inicio: '10:00',
      horario_fim: '12:00',
      motivo_reserva: 'Reunião de projeto',
      status_reserva: 'confirmada'
    });

    console.log('Reserva criada com sucesso:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Erro na resposta da API:', error.response.status, error.response.data);
    } else {
      console.error('Erro ao fazer a requisição:', error.message);
    }
  }
}

testCreateBooking();




