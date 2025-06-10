// models/Database.js
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

// Classe para gerenciar o banco de dados local em arquivos JSON
class Database {
  constructor() {
    this.dataDir = path.join(__dirname, '..', 'data');
    
    // Criar diretório de dados se não existir
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
    
    // Inicializar arquivos de dados se não existirem
    this.initializeDataFiles();
    
    // Carregar dados das salas do INTELI
    this.loadInteliRooms();
    
    // Inicializar gerenciadores de entidades
    this.rooms = new RoomManager(this);
    this.users = new UserManager(this);
    this.bookings = new BookingManager(this);
    this.bookingHistory = new BookingHistoryManager(this);
  }
  
  // Inicializar arquivos de dados
  initializeDataFiles() {
    const files = ['rooms.json', 'users.json', 'bookings.json', 'booking_history.json'];

    files.forEach(file => {
      const filePath = path.join(this.dataDir, file);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
      }
    });
    
    // Criar usuário admin se não existir
    const usersPath = path.join(this.dataDir, 'users.json');
    let users = [];
    
    try {
      users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
    } catch (error) {
      console.error('Erro ao ler arquivo de usuários:', error);
      users = [];
    }
    
    if (users.length === 0) {
      // Criar usuário admin padrão
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync('admin123', salt);
      
      users.push({
        id: 1,
        name: 'Administrador',
        email: 'admin@inteli.edu.br',
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      
      fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    }
  }
  
  // Carregar dados das salas do INTELI
  loadInteliRooms() {
    const roomsPath = path.join(this.dataDir, 'rooms.json');
    let rooms = [];
    
    try {
      rooms = JSON.parse(fs.readFileSync(roomsPath, 'utf8'));
    } catch (error) {
      console.error('Erro ao ler arquivo de salas:', error);
      rooms = [];
    }
    
    // Se não houver salas, carregar as salas do INTELI
    if (rooms.length === 0) {
      try {
        // Tentar carregar do arquivo de salas extraído
        const inteliRoomsPath = '/home/ubuntu/salas_inteli.json';
        
        if (fs.existsSync(inteliRoomsPath)) {
          const inteliRooms = JSON.parse(fs.readFileSync(inteliRoomsPath, 'utf8'));
          
          // Processar e formatar as salas
          const formattedRooms = inteliRooms.map(room => {
            // Extrair localização do campo resources
            let location = "INTELI";
            if (room.resources.includes("Localização:")) {
              const locationMatch = room.resources.match(/Localização: ([^;]+)/);
              if (locationMatch && locationMatch[1]) {
                location = locationMatch[1].trim();
              }
            }
            
            // Extrair recursos disponíveis
            let resources = "Não especificado";
            if (room.resources.includes("Recursos Disponíveis:")) {
              const resourcesMatch = room.resources.match(/Recursos Disponíveis: ([^;]+)/);
              if (resourcesMatch && resourcesMatch[1]) {
                resources = resourcesMatch[1].trim();
              }
            }
            
            // Extrair descrição
            let description = "Sala de reunião";
            if (room.resources.includes("Descrição:")) {
              const descriptionMatch = room.resources.match(/Descrição: ([^;]+)/);
              if (descriptionMatch && descriptionMatch[1]) {
                description = descriptionMatch[1].trim();
              }
            }
            
            // Limpar o código da sala (remover ":")
            const code = room.code.replace(':', '');
            
            // Formatar nome da sala
            const name = `Sala ${code}`;
            
            return {
              id: room.id,
              code,
              name,
              capacity: room.capacity,
              location,
              resources,
              description,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          });
          
          // Salvar as salas formatadas
          fs.writeFileSync(roomsPath, JSON.stringify(formattedRooms, null, 2));
          console.log(`Carregadas ${formattedRooms.length} salas do INTELI`);
        } else {
          console.log('Arquivo de salas do INTELI não encontrado, criando salas padrão');
          
          // Criar salas padrão do INTELI
          const defaultRooms = [
            {
              id: 1,
              code: "R01",
              name: "Sala R01",
              capacity: 6,
              location: "Térreo",
              resources: "TV disponível e Lousa disponível",
              description: "Sala de reunião para treino de apresentações e para desenvolvimento de projetos.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 2,
              code: "R02",
              name: "Sala R02",
              capacity: 6,
              location: "Térreo",
              resources: "TV disponível e Lousa disponível",
              description: "Sala de reunião para treino de apresentações e para desenvolvimento de projetos.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 3,
              code: "R03",
              name: "Sala R03",
              capacity: 6,
              location: "Térreo",
              resources: "TV disponível e Lousa disponível",
              description: "Sala de reunião para treino de apresentações e para desenvolvimento de projetos.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 4,
              code: "R04",
              name: "Sala R04",
              capacity: 6,
              location: "Térreo",
              resources: "TV disponível e Lousa disponível",
              description: "Sala de reunião para treino de apresentações e para desenvolvimento de projetos.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 5,
              code: "R05",
              name: "Sala R05",
              capacity: 6,
              location: "Térreo",
              resources: "TV disponível e Lousa disponível",
              description: "Sala de reunião para treino de apresentações e para desenvolvimento de projetos.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 6,
              code: "R06",
              name: "Sala R06",
              capacity: 6,
              location: "Térreo",
              resources: "TV disponível e Lousa disponível",
              description: "Sala de reunião para treino de apresentações e para desenvolvimento de projetos.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 7,
              code: "R07",
              name: "Sala R07",
              capacity: 6,
              location: "Térreo",
              resources: "TV disponível e Lousa disponível",
              description: "Sala de reunião para treino de apresentações e para desenvolvimento de projetos.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 8,
              code: "R08",
              name: "Sala R08",
              capacity: 3,
              location: "1º Andar",
              resources: "TV indisponível e Lousa indisponível",
              description: "Sala de reunião.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 9,
              code: "R09",
              name: "Sala R09",
              capacity: 10,
              location: "2º Andar",
              resources: "TV disponível e Lousa disponível",
              description: "Sala de reunião.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 10,
              code: "R10",
              name: "Sala R10",
              capacity: 6,
              location: "Térreo",
              resources: "TV disponível e Lousa disponível",
              description: "Sala de reunião para treino de apresentações e para desenvolvimento de projetos.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 11,
              code: "C01",
              name: "Sala C01",
              capacity: 5,
              location: "2º Andar",
              resources: "TV disponível e Lousa disponível",
              description: "Sala de reunião.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 12,
              code: "C02",
              name: "Sala C02",
              capacity: 5,
              location: "2º Andar",
              resources: "TV disponível e Lousa disponível",
              description: "Sala de reunião.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 13,
              code: "C03",
              name: "Sala C03",
              capacity: 5,
              location: "2º Andar",
              resources: "TV disponível e Lousa disponível",
              description: "Sala de reunião.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 14,
              code: "C04",
              name: "Sala C04",
              capacity: 5,
              location: "2º Andar",
              resources: "TV disponível e Lousa disponível",
              description: "Sala de reunião.",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ];
          
          fs.writeFileSync(roomsPath, JSON.stringify(defaultRooms, null, 2));
          console.log(`Criadas ${defaultRooms.length} salas padrão do INTELI`);
        }
      } catch (error) {
        console.error('Erro ao carregar salas do INTELI:', error);
      }
    }
  }
}

// Classe base para gerenciadores de entidades
class EntityManager {
  constructor(db, entityName) {
    this.db = db;
    this.entityName = entityName;
    this.filePath = path.join(db.dataDir, `${entityName}.json`);
  }
  
  // Carregar todos os dados
  loadData() {
    try {
      return JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
    } catch (error) {
      console.error(`Erro ao carregar dados de ${this.entityName}:`, error);
      return [];
    }
  }
  
  // Salvar dados
  saveData(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Erro ao salvar dados de ${this.entityName}:`, error);
      return false;
    }
  }
  
  // Obter todos os registros
  getAll() {
    return this.loadData();
  }
  
  // Obter registro por ID
  getById(id) {
    const data = this.loadData();
    return data.find(item => item.id === parseInt(id));
  }
  
  // Criar novo registro
  create(data) {
    const items = this.loadData();
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    
    const newItem = {
      id: newId,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    items.push(newItem);
    this.saveData(items);
    
    return newItem;
  }
  
  // Atualizar registro
  update(id, data) {
    const items = this.loadData();
    const index = items.findIndex(item => item.id === parseInt(id));
    
    if (index === -1) {
      return null;
    }
    
    const updatedItem = {
      ...items[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    items[index] = updatedItem;
    this.saveData(items);
    
    return updatedItem;
  }
  
  // Excluir registro
  delete(id) {
    const items = this.loadData();
    const index = items.findIndex(item => item.id === parseInt(id));
    
    if (index === -1) {
      return false;
    }
    
    items.splice(index, 1);
    this.saveData(items);
    
    return true;
  }
}

// Gerenciador de salas
class RoomManager extends EntityManager {
  constructor(db) {
    super(db, 'rooms');
  }
  
  // Filtrar salas por capacidade
  filter({ capacity, resources }) {
    const rooms = this.getAll();
    
    return rooms.filter(room => {
      // Filtrar por capacidade
      if (capacity) {
        const { min, max } = capacity;
        
        if (min && room.capacity < parseInt(min)) {
          return false;
        }
        
        if (max && room.capacity > parseInt(max)) {
          return false;
        }
      }
      
      // Filtrar por recursos
      if (resources) {
        const resourceList = Array.isArray(resources) ? resources : [resources];
        
        return resourceList.every(resource => 
          room.resources.toLowerCase().includes(resource.toLowerCase())
        );
      }
      
      return true;
    });
  }
}

// Gerenciador de usuários
class UserManager extends EntityManager {
  constructor(db) {
    super(db, 'users');
  }
  
  // Obter usuário por email
  getByEmail(email) {
    const users = this.getAll();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }
}

// Gerenciador de reservas
class BookingManager extends EntityManager {
  constructor(db) {
    super(db, 'bookings');
  }
  
  // Obter reservas por usuário
  getByUser(userId) {
    const bookings = this.getAll();
    const filteredBookings = bookings.filter(booking => booking.userId === parseInt(userId));
    
    // Adicionar informações da sala a cada reserva
    return filteredBookings.map(booking => {
      const room = this.db.rooms.getById(booking.roomId);
      return {
        ...booking,
        room: room ? { 
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          location: room.location
        } : null
      };
    });
  }
  
  // Obter reservas por sala
  getByRoom(roomId) {
    const bookings = this.getAll();
    return bookings.filter(booking => booking.roomId === parseInt(roomId));
  }
  
  // Obter reservas por data
  getByDate(date) {
    const bookings = this.getAll();
    return bookings.filter(booking => booking.date === date);
  }

  // Verificar se o usuário já tem uma reserva ativa na data especificada
  hasActiveBookingOnDate(userId, date) {
    const bookings = this.getAll();
    const userActiveBookings = bookings.filter(booking =>
      booking.userId === parseInt(userId) &&
      booking.date === date &&
      booking.status !== 'cancelled'
    );

    return userActiveBookings.length > 0;
  }
  
  // Verificar disponibilidade
  checkAvailability(roomId, date, startTime, endTime) {
    const bookings = this.getByRoom(roomId);
    
    // Filtrar reservas para a data especificada
    const bookingsOnDate = bookings.filter(booking => 
      booking.date === date && booking.status !== 'cancelled'
    );
    
    // Verificar se há conflito de horário
    const hasConflict = bookingsOnDate.some(booking => {
      // Converter horários para minutos para facilitar comparação
      const bookingStart = this.timeToMinutes(booking.startTime);
      const bookingEnd = this.timeToMinutes(booking.endTime);
      const requestStart = this.timeToMinutes(startTime);
      const requestEnd = this.timeToMinutes(endTime);
      
      // Verificar sobreposição de horários
      return (
        (requestStart >= bookingStart && requestStart < bookingEnd) || // Início da nova reserva durante outra reserva
        (requestEnd > bookingStart && requestEnd <= bookingEnd) || // Fim da nova reserva durante outra reserva
        (requestStart <= bookingStart && requestEnd >= bookingEnd) // Nova reserva engloba outra reserva
      );
    });
    
    return !hasConflict;
  }
  
  // Converter horário (HH:MM) para minutos
  timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }
  
  // Atualizar status da reserva
  updateStatus(id, status) {
    return this.update(id, { status });
  }
  
  // Sobrescrever método create para validar disponibilidade
  create(data) {
    // Verificar se o usuário já tem uma reserva ativa na data
    const hasActiveBooking = this.hasActiveBookingOnDate(data.userId, data.date);
    if (hasActiveBooking) {
      return { error: 'Você já possui uma reserva ativa para esta data. Cancele a reserva existente para fazer uma nova.' };
    }

    // Verificar disponibilidade da sala
    const isAvailable = this.checkAvailability(
      data.roomId,
      data.date,
      data.startTime,
      data.endTime
    );

    if (!isAvailable) {
      return { error: 'Sala não disponível no horário solicitado' };
    }

    // Definir status inicial como 'confirmed'
    const bookingData = {
      ...data,
      status: 'confirmed'
    };

    return super.create(bookingData);
  }
  
  // Sobrescrever método update para validar disponibilidade
  update(id, data) {
    const booking = this.getById(id);
    
    if (!booking) {
      return null;
    }
    
    // Se estiver atualizando data ou horário, verificar disponibilidade
    if (data.date || data.startTime || data.endTime || data.roomId) {
      const roomId = data.roomId || booking.roomId;
      const date = data.date || booking.date;
      const startTime = data.startTime || booking.startTime;
      const endTime = data.endTime || booking.endTime;
      
      // Verificar disponibilidade excluindo a própria reserva
      const bookings = this.getByRoom(roomId);
      const otherBookings = bookings.filter(b => b.id !== parseInt(id) && b.status !== 'cancelled');
      
      // Verificar se há conflito de horário
      const hasConflict = otherBookings.some(b => {
        if (b.date !== date) return false;
        
        // Converter horários para minutos para facilitar comparação
        const bookingStart = this.timeToMinutes(b.startTime);
        const bookingEnd = this.timeToMinutes(b.endTime);
        const requestStart = this.timeToMinutes(startTime);
        const requestEnd = this.timeToMinutes(endTime);
        
        // Verificar sobreposição de horários
        return (
          (requestStart >= bookingStart && requestStart < bookingEnd) || // Início da nova reserva durante outra reserva
          (requestEnd > bookingStart && requestEnd <= bookingEnd) || // Fim da nova reserva durante outra reserva
          (requestStart <= bookingStart && requestEnd >= bookingEnd) // Nova reserva engloba outra reserva
        );
      });
      
      if (hasConflict) {
        return { error: 'Sala não disponível no horário solicitado' };
      }
    }
    
    return super.update(id, data);
  }
}

// Gerenciador de histórico de reservas
class BookingHistoryManager extends EntityManager {
  constructor(db) {
    super(db, 'booking_history');
  }

  // Obter histórico por usuário
  getByUser(userId) {
    const history = this.getAll();
    return history.filter(entry => entry.userId === parseInt(userId));
  }

  // Obter histórico por sala
  getByRoom(roomId) {
    const history = this.getAll();
    return history.filter(entry => entry.roomId === parseInt(roomId));
  }

  // Obter histórico por data
  getByDate(date) {
    const history = this.getAll();
    return history.filter(entry => entry.date === date);
  }

  // Obter histórico por reserva original
  getByOriginalBooking(originalBookingId) {
    const history = this.getAll();
    return history.filter(entry => entry.originalBookingId === parseInt(originalBookingId));
  }

  // Obter estatísticas do histórico
  getStats() {
    const history = this.getAll();
    const completed = history.filter(entry => entry.status === 'completed');
    const cancelled = history.filter(entry => entry.status === 'cancelled');

    return {
      total: history.length,
      completed: completed.length,
      cancelled: cancelled.length,
      lastEntry: history.length > 0 ? history[history.length - 1] : null
    };
  }
}

// Exportar instância do banco de dados
module.exports = new Database();