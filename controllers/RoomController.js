// controllers/RoomController.js
const Room = require('../models/Room.js');

// Controller para operações relacionadas a salas
class RoomController {
  // Criar uma nova sala
  static async create(req, res) {
    try {
      const { nome_sala, capacidade, has_tv, has_whiteboard, descricao } = req.body;

      // Validações básicas
      if (!nome_sala || !capacidade) {
        return res.status(400).json({ 
          error: 'Dados incompletos. Nome da sala e capacidade são obrigatórios.' 
        });
      }

      // Verificar se a capacidade é um número positivo
      if (isNaN(capacidade) || parseInt(capacidade) <= 0) {
        return res.status(400).json({ 
          error: 'A capacidade deve ser um número positivo.' 
        });
      }

      // Verificar se o nome da sala já está em uso
      const rooms = await Room.findAll();
      const roomExists = rooms.some(room => room.nome_sala.toLowerCase() === nome_sala.toLowerCase());
      if (roomExists) {
        return res.status(400).json({ 
          error: 'Nome da sala já está em uso.' 
        });
      }

      // Criar a sala
      const newRoom = await Room.create(
        nome_sala, 
        parseInt(capacidade), 
        has_tv === true || has_tv === 'true', 
        has_whiteboard === true || has_whiteboard === 'true', 
        descricao || ''
      );

      res.status(201).json(newRoom);
    } catch (error) {
      console.error('Erro ao criar sala:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao criar sala.' 
      });
    }
  }

  // Listar todas as salas
  static async getAll(req, res) {
    try {
      const rooms = await Room.findAll();
      res.status(200).json(rooms);
    } catch (error) {
      console.error('Erro ao listar salas:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao listar salas.' 
      });
    }
  }

  // Buscar sala por ID
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const room = await Room.findById(id);
      
      if (!room) {
        return res.status(404).json({ 
          error: 'Sala não encontrada.' 
        });
      }
      
      res.status(200).json(room);
    } catch (error) {
      console.error('Erro ao buscar sala:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao buscar sala.' 
      });
    }
  }

  // Buscar salas por capacidade
  static async getByCapacity(req, res) {
    try {
      const { minCapacity } = req.query;
      
      if (!minCapacity || isNaN(minCapacity) || parseInt(minCapacity) <= 0) {
        return res.status(400).json({ 
          error: 'Capacidade mínima deve ser um número positivo.' 
        });
      }
      
      const rooms = await Room.findByCapacity(parseInt(minCapacity));
      res.status(200).json(rooms);
    } catch (error) {
      console.error('Erro ao buscar salas por capacidade:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao buscar salas por capacidade.' 
      });
    }
  }

  // Buscar salas por recursos
  static async getByResources(req, res) {
    try {
      const { has_tv, has_whiteboard } = req.query;
      
      const rooms = await Room.findByResources(
        has_tv === 'true', 
        has_whiteboard === 'true'
      );
      
      res.status(200).json(rooms);
    } catch (error) {
      console.error('Erro ao buscar salas por recursos:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao buscar salas por recursos.' 
      });
    }
  }

  // Atualizar sala
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { nome_sala, capacidade, has_tv, has_whiteboard, descricao } = req.body;
      
      // Verificar se a sala existe
      const existingRoom = await Room.findById(id);
      if (!existingRoom) {
        return res.status(404).json({ 
          error: 'Sala não encontrada.' 
        });
      }
      
      // Verificar se o novo nome já está em uso por outra sala
      if (nome_sala && nome_sala !== existingRoom.nome_sala) {
        const rooms = await Room.findAll();
        const roomExists = rooms.some(room => 
          room.nome_sala.toLowerCase() === nome_sala.toLowerCase() && room.id !== parseInt(id)
        );
        
        if (roomExists) {
          return res.status(400).json({ 
            error: 'Nome da sala já está em uso por outra sala.' 
          });
        }
      }
      
      // Verificar se a capacidade é um número positivo
      if (capacidade && (isNaN(capacidade) || parseInt(capacidade) <= 0)) {
        return res.status(400).json({ 
          error: 'A capacidade deve ser um número positivo.' 
        });
      }
      
      // Preparar dados para atualização
      const updatedNome = nome_sala || existingRoom.nome_sala;
      const updatedCapacidade = capacidade ? parseInt(capacidade) : existingRoom.capacidade;
      const updatedHasTv = has_tv !== undefined ? (has_tv === true || has_tv === 'true') : existingRoom.has_tv;
      const updatedHasWhiteboard = has_whiteboard !== undefined ? (has_whiteboard === true || has_whiteboard === 'true') : existingRoom.has_whiteboard;
      const updatedDescricao = descricao !== undefined ? descricao : existingRoom.descricao;
      
      // Atualizar a sala
      const updatedRoom = await Room.update(
        id, 
        updatedNome, 
        updatedCapacidade, 
        updatedHasTv, 
        updatedHasWhiteboard, 
        updatedDescricao
      );
      
      res.status(200).json(updatedRoom);
    } catch (error) {
      console.error('Erro ao atualizar sala:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao atualizar sala.' 
      });
    }
  }

  // Excluir sala
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar se a sala existe
      const existingRoom = await Room.findById(id);
      if (!existingRoom) {
        return res.status(404).json({ 
          error: 'Sala não encontrada.' 
        });
      }
      
      // Excluir a sala
      await Room.delete(id);
      
      res.status(200).json({ 
        message: 'Sala excluída com sucesso.' 
      });
    } catch (error) {
      console.error('Erro ao excluir sala:', error);
      res.status(500).json({ 
        error: 'Erro interno do servidor ao excluir sala.' 
      });
    }
  }
}

module.exports = RoomController;