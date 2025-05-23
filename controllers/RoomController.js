// controllers/RoomController.js
const Database = require('../models/Database');

class RoomController {
  // Obter todas as salas
  static async getAll(req, res) {
    try {
      const rooms = Database.rooms.getAll();
      res.json(rooms);
    } catch (error) {
      console.error('Erro ao listar salas:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao listar salas.' });
    }
  }
  
  // Obter sala por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const room = Database.rooms.getById(id);
      
      if (!room) {
        return res.status(404).json({ message: 'Sala não encontrada' });
      }
      
      res.json(room);
    } catch (error) {
      console.error('Erro ao buscar sala por ID:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao buscar sala.' });
    }
  }
  
  // Obter salas por capacidade
  static async getByCapacity(req, res) {
    try {
      const { min, max } = req.query;
      
      const filteredRooms = Database.rooms.filter({
        capacity: { min, max }
      });
      
      res.json(filteredRooms);
    } catch (error) {
      console.error('Erro ao buscar salas por capacidade:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao buscar salas por capacidade.' });
    }
  }
  
  // Obter salas por recursos
  static async getByResources(req, res) {
    try {
      const { resources } = req.query;
      
      if (!resources) {
        return res.status(400).json({ message: 'Parâmetro resources é obrigatório' });
      }
      
      const filteredRooms = Database.rooms.filter({ resources });
      
      res.json(filteredRooms);
    } catch (error) {
      console.error('Erro ao buscar salas por recursos:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao buscar salas por recursos.' });
    }
  }
  
  // Criar uma nova sala (apenas para administradores)
  static async create(req, res) {
    try {
      // Verificar se o usuário é administrador
      if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem criar salas.' });
      }
      
      const { name, capacity, location, resources, description } = req.body;
      
      if (!name || !capacity) {
        return res.status(400).json({ message: 'Nome e capacidade são obrigatórios' });
      }
      
      const newRoom = Database.rooms.create({
        name,
        capacity: parseInt(capacity),
        location: location || '',
        resources: resources || '',
        description: description || ''
      });
      
      res.status(201).json(newRoom);
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao criar sala.' });
    }
  }
  
  // Atualizar sala (apenas para administradores)
  static async update(req, res) {
    try {
      // Verificar se o usuário é administrador
      if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem atualizar salas.' });
      }
      
      const { id } = req.params;
      const { name, capacity, location, resources, description } = req.body;
      
      if (!name || !capacity) {
        return res.status(400).json({ message: 'Nome e capacidade são obrigatórios' });
      }
      
      const updatedRoom = Database.rooms.update(id, {
        name,
        capacity: parseInt(capacity),
        location: location || '',
        resources: resources || '',
        description: description || ''
      });
      
      if (!updatedRoom) {
        return res.status(404).json({ message: 'Sala não encontrada' });
      }
      
      res.json(updatedRoom);
    } catch (error) {
      console.error('Erro ao atualizar sala:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao atualizar sala.' });
    }
  }
  
  // Excluir sala (apenas para administradores)
  static async delete(req, res) {
    try {
      // Verificar se o usuário é administrador
      if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem excluir salas.' });
      }
      
      const { id } = req.params;
      
      const success = Database.rooms.delete(id);
      
      if (!success) {
        return res.status(404).json({ message: 'Sala não encontrada' });
      }
      
      res.json({ message: 'Sala excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir sala:', error);
      res.status(500).json({ error: 'Erro interno do servidor ao excluir sala.' });
    }
  }
}

module.exports = RoomController;