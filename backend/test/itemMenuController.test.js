const itemMenuController = require('../controllers/itemMenuController');
const { ItemMenu } = require('../models');
const path = require('path');
const fs = require('fs');

jest.mock('../models');
jest.mock('fs');

describe('itemMenuController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createItemMenu', () => {
    it('deve criar um item do menu com sucesso', async () => {
      const req = {
        body: {
          nome: 'Pizza',
          preco: 25,
          descricao: 'Deliciosa pizza',
          restauranteId: 'rest1',
        },
        file: { filename: 'pizza.jpg' }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      ItemMenu.create.mockResolvedValue({
        id: '123',
        nome: 'Pizza',
        slug: 'pizza',
        preco: 25,
        descricao: 'Deliciosa pizza',
        imagem: 'pizza.jpg',
        restauranteId: 'rest1',
      });

      await itemMenuController.createItemMenu(req, res);

      expect(ItemMenu.create).toHaveBeenCalledWith(expect.objectContaining({
        nome: 'Pizza',
        slug: 'pizza',
        preco: 25,
        descricao: 'Deliciosa pizza',
        imagem: 'pizza.jpg',
        restauranteId: 'rest1',
      }));

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        nome: 'Pizza',
      }));
    });

    it('deve retornar erro se falhar na criação', async () => {
      const req = { body: { nome: 'Pizza' }, file: null };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      ItemMenu.create.mockRejectedValue(new Error('Erro ao criar'));

      await itemMenuController.createItemMenu(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar item do menu' });
    });
  });

  describe('updateItemMenu', () => {
    it('deve atualizar um item do menu com nova imagem', async () => {
      const req = {
        params: { id: '123' },
        body: {
          nome: 'Pizza Atualizada',
          preco: 30,
          descricao: 'Pizza muito boa',
          restauranteId: 'rest2',
        },
        file: { filename: 'pizza-new.jpg' }
      };
      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };

      const itemMock = {
        id: '123',
        nome: 'Pizza',
        slug: 'pizza',
        preco: 25,
        descricao: 'Deliciosa pizza',
        imagem: 'pizza-old.jpg',
        restauranteId: 'rest1',
        save: jest.fn(),
        update: jest.fn(),
      };

      ItemMenu.findByPk.mockResolvedValue(itemMock);
      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockImplementation(() => {});

      await itemMenuController.updateItemMenu(req, res);

      expect(fs.unlinkSync).toHaveBeenCalledWith(
        path.join(__dirname, '..', 'uploads', 'pizza-old.jpg')
      );

      expect(itemMock.update).toHaveBeenCalledWith(expect.objectContaining({
        nome: 'Pizza Atualizada',
        slug: 'pizza-atualizada',
        preco: 30,
        descricao: 'Pizza muito boa',
        restauranteId: 'rest2',
        imagem: 'pizza-new.jpg',
      }));

      expect(res.json).toHaveBeenCalledWith(itemMock);
    });

    it('deve retornar 404 se item não existir', async () => {
      const req = { params: { id: '123' }, body: {}, file: null };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      ItemMenu.findByPk.mockResolvedValue(null);

      await itemMenuController.updateItemMenu(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Item não encontrado' });
    });
  });

  describe('getAllItensMenu', () => {
    it('deve retornar lista de itens', async () => {
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const req = {};

      ItemMenu.findAll.mockResolvedValue([
        { nome: 'Pizza' },
        { nome: 'Hamburguer' }
      ]);

      await itemMenuController.getAllItensMenu(req, res);

      expect(res.json).toHaveBeenCalledWith([
        { nome: 'Pizza' },
        { nome: 'Hamburguer' }
      ]);
    });

    it('deve tratar erro', async () => {
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
      const req = {};

      ItemMenu.findAll.mockRejectedValue(new Error('Erro no DB'));

      await itemMenuController.getAllItensMenu(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar itens do menu' });
    });
  });

  describe('getItemMenuById', () => {
    it('deve retornar item pelo id', async () => {
      const req = { params: { id: '123' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      ItemMenu.findByPk.mockResolvedValue({ nome: 'Pizza' });

      await itemMenuController.getItemMenuById(req, res);

      expect(res.json).toHaveBeenCalledWith({ nome: 'Pizza' });
    });

    it('deve retornar 404 se não achar item', async () => {
      const req = { params: { id: '123' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      ItemMenu.findByPk.mockResolvedValue(null);

      await itemMenuController.getItemMenuById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Item não encontrado' });
    });
  });

  describe('deleteItemMenu', () => {
    it('deve deletar item e imagem', async () => {
      const req = { params: { id: '123' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      const itemMock = {
        imagem: 'pizza.jpg',
        destroy: jest.fn(),
      };

      ItemMenu.findByPk.mockResolvedValue(itemMock);
      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockImplementation(() => {});

      await itemMenuController.deleteItemMenu(req, res);

      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(itemMock.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Item deletado com sucesso' });
    });

    it('deve retornar 404 se não achar item', async () => {
      const req = { params: { id: '123' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      ItemMenu.findByPk.mockResolvedValue(null);

      await itemMenuController.deleteItemMenu(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Item não encontrado' });
    });
  });

  describe('getItensByRestaurante', () => {
    it('deve retornar itens pelo restaurante', async () => {
      const req = { params: { restauranteId: 'rest1' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      ItemMenu.findAll.mockResolvedValue([
        { nome: 'Pizza' },
        { nome: 'Hamburguer' }
      ]);

      await itemMenuController.getItensByRestaurante(req, res);

      expect(ItemMenu.findAll).toHaveBeenCalledWith({ where: { restauranteId: 'rest1' } });
      expect(res.json).toHaveBeenCalledWith([
        { nome: 'Pizza' },
        { nome: 'Hamburguer' }
      ]);
    });

    it('deve tratar erro na busca por restaurante', async () => {
      const req = { params: { restauranteId: 'rest1' } };
      const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

      ItemMenu.findAll.mockRejectedValue(new Error('Erro'));

      await itemMenuController.getItensByRestaurante(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar itens por restaurante' });
    });
  });

});
