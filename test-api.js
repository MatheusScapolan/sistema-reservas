// Arquivo de teste para validar os endpoints da API
const axios = require('axios');

// URL base da API
const API_URL = 'http://localhost:3000/api';

// Token de autenticação (será preenchido após login)
let token = '';

// Dados para teste
const testUser = {
  email: 'admin@inteli.edu.br',
  password: 'admin123'
};

// Função para fazer login e obter token
async function login() {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, testUser);
    token = response.data.token;
    console.log('Login realizado com sucesso!');
    console.log('Token:', token);
    return token;
  } catch (error) {
    console.error('Erro ao fazer login:', error.response?.data || error.message);
    throw error;
  }
}

// Função para testar o endpoint de listar salas
async function testGetRooms() {
  try {
    const response = await axios.get(`${API_URL}/rooms`);
    console.log('Salas disponíveis:', response.data.length);
    console.log('Primeira sala:', response.data[0]);
    return response.data;
  } catch (error) {
    console.error('Erro ao listar salas:', error.response?.data || error.message);
    throw error;
  }
}

// Função para testar o endpoint de obter sala por ID
async function testGetRoomById(roomId) {
  try {
    const response = await axios.get(`${API_URL}/rooms/${roomId}`);
    console.log('Detalhes da sala:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter sala por ID:', error.response?.data || error.message);
    throw error;
  }
}

// Função para testar o endpoint de listar reservas
async function testGetBookings() {
  try {
    const response = await axios.get(`${API_URL}/bookings`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Reservas disponíveis:', response.data.length);
    if (response.data.length > 0) {
      console.log('Primeira reserva:', response.data[0]);
    }
    return response.data;
  } catch (error) {
    console.error('Erro ao listar reservas:', error.response?.data || error.message);
    throw error;
  }
}

// Função para testar o endpoint de criar reserva
async function testCreateBooking(roomId) {
  try {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const bookingData = {
      roomId,
      date: tomorrow.toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '11:00',
      purpose: 'Teste de API',
      attendees: 2
    };
    
    const response = await axios.post(`${API_URL}/bookings`, bookingData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Reserva criada com sucesso:', response.data);
    return response.data.booking;
  } catch (error) {
    console.error('Erro ao criar reserva:', error.response?.data || error.message);
    throw error;
  }
}

// Função para testar o endpoint de obter reserva por ID
async function testGetBookingById(bookingId) {
  try {
    const response = await axios.get(`${API_URL}/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Detalhes da reserva:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter reserva por ID:', error.response?.data || error.message);
    throw error;
  }
}

// Função para testar o endpoint de obter reservas por sala
async function testGetBookingsByRoom(roomId) {
  try {
    const response = await axios.get(`${API_URL}/bookings/room/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`Reservas da sala ${roomId}:`, response.data.length);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter reservas por sala:', error.response?.data || error.message);
    throw error;
  }
}

// Função para testar o endpoint de cancelar reserva
async function testCancelBooking(bookingId) {
  try {
    const response = await axios.delete(`${API_URL}/bookings/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Reserva cancelada com sucesso:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error.response?.data || error.message);
    throw error;
  }
}

// Função principal para executar todos os testes
async function runTests() {
  try {
    console.log('Iniciando testes de API...');
    
    // Fazer login
    await login();
    
    // Testar endpoint de listar salas
    const rooms = await testGetRooms();
    
    if (rooms.length === 0) {
      throw new Error('Nenhuma sala encontrada. Verifique se as salas foram carregadas corretamente.');
    }
    
    // Testar endpoint de obter sala por ID
    const roomId = rooms[0].id;
    await testGetRoomById(roomId);
    
    // Testar endpoint de listar reservas
    const bookings = await testGetBookings();
    
    // Testar endpoint de criar reserva
    const newBooking = await testCreateBooking(roomId);
    
    // Testar endpoint de obter reserva por ID
    await testGetBookingById(newBooking.id);
    
    // Testar endpoint de obter reservas por sala
    await testGetBookingsByRoom(roomId);
    
    // Testar endpoint de cancelar reserva
    await testCancelBooking(newBooking.id);
    
    console.log('Todos os testes foram concluídos com sucesso!');
  } catch (error) {
    console.error('Erro durante os testes:', error);
  }
}

// Executar os testes
runTests();