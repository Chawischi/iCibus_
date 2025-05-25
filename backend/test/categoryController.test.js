const categoryController = require('../controllers/categoryController');
const sequelize = require('../config/db');
const fs = require('fs');
const path = require('path');

jest.mock('../models/Categoria', () => ({
  create: jest.fn(),
  findByPk: jest.fn(),
  findAll: jest.fn(),
}));

jest.mock('fs');

const Categoria = require('../models/Categoria'); // Agora pega o mock criado pelo jest.mock

describe('Category Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, params: {}, file: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe('createCategory', () => {
    it('deve retornar 400 se nome ou imagem faltar', async () => {
      req.body = { nome: '' };
      req.file = null;

      await categoryController.createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nome e imagem são obrigatórios.' });
    });

    it('deve criar categoria e retornar 201', async () => {
      req.body = { nome: 'Teste' };
      req.file = { filename: 'imagem.jpg' };

      Categoria.create.mockResolvedValue({
        id: 'uuid-teste',
        nome: 'Teste',
        slug: 'teste',
        imagem: 'imagem.jpg',
      });

      await categoryController.createCategory(req, res);

      expect(Categoria.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        nome: 'Teste',
        slug: 'teste',
        imagem: 'imagem.jpg',
      }));
    });
  });
  
  describe('updateCategory', () => {
    it('deve retornar 404 se categoria não encontrada', async () => {
      req.params.id = '123';
      Categoria.findByPk.mockResolvedValue(null);

      await categoryController.updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Categoria não encontrada' });
    });

    it('deve atualizar nome, slug e imagem se fornecidos', async () => {
      req.params.id = '123';
      req.body.nome = 'Novo Nome';
      req.file = { filename: 'nova.jpg' };

      const categoriaMock = {
        nome: 'Antigo',
        slug: 'antigo',
        imagem: 'antiga.jpg',
        save: jest.fn().mockResolvedValue(true),
      };

      Categoria.findByPk.mockResolvedValue(categoriaMock);

      await categoryController.updateCategory(req, res);

      expect(categoriaMock.nome).toBe('Novo Nome');
      expect(categoriaMock.slug).toBe('novo-nome');
      expect(categoriaMock.imagem).toBe('nova.jpg');
      expect(categoriaMock.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(categoriaMock);
    });
  });

  describe('getAllCategories', () => {
    it('deve retornar lista de categorias', async () => {
      const mockCats = [{ id: 1, nome: 'Cat1' }, { id: 2, nome: 'Cat2' }];
      Categoria.findAll.mockResolvedValue(mockCats);

      await categoryController.getAllCategories(req, res);

      expect(res.json).toHaveBeenCalledWith(mockCats);
    });
  });

  describe('getCategoryById', () => {
    it('deve retornar 404 se não achar categoria', async () => {
      req.params.id = '1';
      Categoria.findByPk.mockResolvedValue(null);

      await categoryController.getCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Categoria não encontrada' });
    });

    it('deve retornar categoria encontrada', async () => {
      req.params.id = '1';
      const cat = { id: '1', nome: 'Cat1' };
      Categoria.findByPk.mockResolvedValue(cat);

      await categoryController.getCategoryById(req, res);

      expect(res.json).toHaveBeenCalledWith(cat);
    });
  });

  describe('deleteCategory', () => {
    it('deve retornar 404 se categoria não encontrada', async () => {
      req.params.id = '1';
      Categoria.findByPk.mockResolvedValue(null);

      await categoryController.deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Categoria não encontrada' });
    });

    it('deve deletar categoria e arquivo de imagem', async () => {
      req.params.id = '1';
      const cat = { id: '1', imagem: 'img.jpg', destroy: jest.fn().mockResolvedValue(true) };
      Categoria.findByPk.mockResolvedValue(cat);
      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockImplementation(() => { });

      await categoryController.deleteCategory(req, res);

      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.unlinkSync).toHaveBeenCalled();
      expect(cat.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Categoria deletada com sucesso' });
    });

    it('deve deletar categoria sem arquivo se imagem não existir', async () => {
      req.params.id = '1';
      const cat = { id: '1', imagem: null, destroy: jest.fn().mockResolvedValue(true) };
      Categoria.findByPk.mockResolvedValue(cat);

      await categoryController.deleteCategory(req, res);

      expect(fs.existsSync).not.toHaveBeenCalled();
      expect(fs.unlinkSync).not.toHaveBeenCalled();
      expect(cat.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Categoria deletada com sucesso' });
    });
  });
});
