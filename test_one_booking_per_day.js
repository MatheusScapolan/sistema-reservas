// Teste para verificar a regra de uma reserva por dia
const Database = require('./models/Database');

console.log('🧪 Testando a regra: Uma reserva ativa por dia\n');

// O Database já é uma instância
const db = Database;

// Dados de teste
const testUserId = 6; // Usuário que não tem reservas ativas hoje
const testDate = new Date().toISOString().split('T')[0]; // Data de hoje
const newBookingData = {
  roomId: 2,
  userId: testUserId,
  date: testDate,
  startTime: '14:00',
  endTime: '15:00',
  purpose: 'Teste da regra de uma reserva por dia',
  attendees: 1,
  status: 'confirmed'
};

console.log('📋 Dados do teste:');
console.log(`- Usuário ID: ${testUserId}`);
console.log(`- Data: ${testDate}`);
console.log(`- Nova reserva: Sala ${newBookingData.roomId}, ${newBookingData.startTime}-${newBookingData.endTime}\n`);

// Verificar reservas existentes do usuário na data
console.log('🔍 Verificando reservas existentes...');
const existingBookings = db.bookings.getByUser(testUserId);
const activeBookingsOnDate = existingBookings.filter(booking => 
  booking.date === testDate && booking.status !== 'cancelled'
);

console.log(`📊 Reservas ativas do usuário na data ${testDate}:`);
activeBookingsOnDate.forEach(booking => {
  console.log(`  - ID: ${booking.id}, Sala: ${booking.roomId}, Horário: ${booking.startTime}-${booking.endTime}, Status: ${booking.status}`);
});

if (activeBookingsOnDate.length === 0) {
  console.log('  ✅ Nenhuma reserva ativa encontrada na data');
} else {
  console.log(`  ⚠️  ${activeBookingsOnDate.length} reserva(s) ativa(s) encontrada(s)`);
}

console.log('\n🧪 Testando a validação...');

// Testar o método hasActiveBookingOnDate
const hasActiveBooking = db.bookings.hasActiveBookingOnDate(testUserId, testDate);
console.log(`📝 hasActiveBookingOnDate(${testUserId}, '${testDate}'): ${hasActiveBooking}`);

// Tentar criar uma nova reserva
console.log('\n🚀 Tentando criar nova reserva...');
const result = db.bookings.create(newBookingData);

if (result.error) {
  console.log('❌ Erro ao criar reserva:');
  console.log(`   ${result.error}`);
  if (hasActiveBooking) {
    console.log('\n✅ TESTE PASSOU: A regra está funcionando corretamente!');
  } else {
    console.log('\n❌ TESTE FALHOU: Erro inesperado!');
  }
} else {
  console.log('✅ Reserva criada com sucesso:');
  console.log(`   ID: ${result.id}`);
  if (!hasActiveBooking) {
    console.log('\n✅ TESTE PASSOU: Usuário sem reserva ativa conseguiu criar nova reserva!');
  } else {
    console.log('\n❌ TESTE FALHOU: Usuário com reserva ativa conseguiu criar outra reserva!');
  }
}

console.log('\n🏁 Teste concluído.');
