require('dotenv').config();
const pool = require('./config/database');

// Função para criar dados iniciais no banco
async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    // Iniciar transação
    await client.query('BEGIN');
    
    console.log('Criando dados iniciais no banco de dados...');
    
    // Criar usuários de teste
    const usersResult = await client.query(`
      INSERT INTO users (nome_completo, email_institucional, senha)
      VALUES 
        ('João Silva', 'joao.silva@exemplo.com', 'senha123'),
        ('Maria Oliveira', 'maria.oliveira@exemplo.com', 'senha456')
      ON CONFLICT (email_institucional) DO NOTHING
      RETURNING id, nome_completo;
    `);
    
    console.log('✅ Usuários criados:');
    usersResult.rows.forEach(user => {
      console.log(`- ID: ${user.id}, Nome: ${user.nome_completo}`);
    });
    
    // Criar salas de teste
    const roomsResult = await client.query(`
      INSERT INTO rooms (nome_sala, capacidade, has_tv, has_whiteboard, descricao)
      VALUES 
        ('Sala de Reuniões 1', 10, true, true, 'Sala principal para reuniões'),
        ('Sala de Treinamento', 20, true, false, 'Sala para treinamentos e workshops'),
        ('Sala de Conferência', 30, true, true, 'Sala para conferências e eventos')
      ON CONFLICT (nome_sala) DO NOTHING
      RETURNING id, nome_sala;
    `);
    
    console.log('✅ Salas criadas:');
    roomsResult.rows.forEach(room => {
      console.log(`- ID: ${room.id}, Nome: ${room.nome_sala}`);
    });
    
    // Confirmar transação
    await client.query('COMMIT');
    console.log('✅ Dados iniciais criados com sucesso!');
    
  } catch (error) {
    // Reverter em caso de erro
    await client.query('ROLLBACK');
    console.error('❌ Erro ao criar dados iniciais:', error);
    throw error;
  } finally {
    // Liberar cliente
    client.release();
  }
}

// Executar seed
seedDatabase()
  .then(() => {
    console.log('Processo de seed concluído.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Erro durante o processo de seed:', err);
    process.exit(1);
  });