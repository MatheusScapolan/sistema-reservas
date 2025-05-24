// Arquivo para testar os endpoints CRUD do sistema de reservas
require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

// Função para testar a criação de uma reserva (POST)
async function testCreateBooking() {
  try {
    console.log('\n🔍 Testando criação de reserva (POST /api/bookings)');
    
    const novaReserva = {
      user_id: 1,
      room_id: 2,
      data_reserva: '2025-05-23',
      horario_inicio: '10:00',
      horario_fim: '12:00',
      motivo_reserva: 'Reunião com equipe',
      status_reserva: 'confirmada'
    };
    
    const response = await axios.post(`${API_URL}/bookings`, novaReserva);
    
    console.log('✅ Reserva criada com sucesso!');
    console.log('Status:', response.status);
    console.log('Dados da reserva criada:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar reserva:', error.response?.data || error.message);
    return null;
  }
}

// Função para testar a listagem de todas as reservas (GET)
async function testListBookings() {
  try {
    console.log('\n🔍 Testando listagem de reservas (GET /api/bookings)');
    
    const response = await axios.get(`${API_URL}/bookings`);
    
    console.log('✅ Reservas listadas com sucesso!');
    console.log('Status:', response.status);
    console.log('Quantidade de reservas:', response.data.length);
    console.log('Primeira reserva:', response.data[0]);
    
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao listar reservas:', error.response?.data || error.message);
    return [];
  }
}

// Função para testar a busca de uma reserva por ID (GET)
async function testGetBookingById(id) {
  try {
    console.log(`\n🔍 Testando busca de reserva por ID (GET /api/bookings/${id})`);
    
    const response = await axios.get(`${API_URL}/bookings/${id}`);
    
    console.log('✅ Reserva encontrada com sucesso!');
    console.log('Status:', response.status);
    console.log('Dados da reserva:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao buscar reserva por ID:', error.response?.data || error.message);
    return null;
  }
}

// Função para testar a atualização de uma reserva (PUT)
async function testUpdateBooking(id) {
  try {
    console.log(`\n🔍 Testando atualização de reserva (PUT /api/bookings/${id})`);
    
    const dadosAtualizados = {
      user_id: 1,
      room_id: 2,
      data_reserva: '2025-05-24',
      horario_inicio: '14:00',
      horario_fim: '16:00',
      motivo_reserva: 'Apresentação de projeto',
      status_reserva: 'confirmada'
    };
    
    const response = await axios.put(`${API_URL}/bookings/${id}`, dadosAtualizados);
    
    console.log('✅ Reserva atualizada com sucesso!');
    console.log('Status:', response.status);
    console.log('Dados atualizados:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao atualizar reserva:', error.response?.data || error.message);
    return null;
  }
}

// Função para testar a exclusão de uma reserva (DELETE)
async function testDeleteBooking(id) {
  try {
    console.log(`\n🔍 Testando exclusão de reserva (DELETE /api/bookings/${id})`);
    
    const response = await axios.delete(`${API_URL}/bookings/${id}`);
    
    console.log('✅ Reserva excluída com sucesso!');
    console.log('Status:', response.status);
    console.log('Resposta:', response.data);
    
    return true;
  } catch (error) {
    console.error('❌ Erro ao excluir reserva:', error.response?.data || error.message);
    return false;
  }
}

// Função principal para executar todos os testes
async function runAllTests() {
  try {
    console.log('🚀 Iniciando testes dos endpoints CRUD de reservas...');
    
    // Testar criação de reserva
    const novaReserva = await testCreateBooking();
    
    if (novaReserva) {
      const reservaId = novaReserva.id;
      
      // Testar listagem de reservas
      await testListBookings();
      
      // Testar busca por ID
      await testGetBookingById(reservaId);
      
      // Testar atualização
      await testUpdateBooking(reservaId);
      
      // Testar exclusão
      await testDeleteBooking(reservaId);
    }
    
    console.log('\n✅ Testes concluídos!');
  } catch (error) {
    console.error('\n❌ Erro durante a execução dos testes:', error);
  }
}

// Executar os testes
runAllTests();
