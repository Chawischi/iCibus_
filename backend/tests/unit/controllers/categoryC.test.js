const path = require('path');
const fs = require('fs');

let Categoria;
let createCategory, updateCategory, getAllCategories, getCategoryById, deleteCategory;

jest.mock('fs');

beforeAll(() => {
  const db = require(path.resolve(__dirname, '../../../config/db'));
  Categoria = require(path.resolve(__dirname, '../../../models/Categoria'))(db);

  // Mock dos métodos do model Categoria
  Categoria.create = jest.fn();
  Categoria.findByPk = jest.fn();
  Categoria.findAll = jest.fn();
  Categoria.destroy = jest.fn();
  Categoria.update = jest.fn();

  // Importa o controller depois dos mocks
  ({
    createCategory,
    updateCategory,
    getAllCategories,
    getCategoryById,
    deleteCategory,
  } = require(path.resolve(__dirname, '../../../controllers/categoryController')));
});

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

  // CREATE
  describe('createCategory', () => {
    it('retorna 400 se nome ou imagem não forem enviados', async () => {
      req.body = { nome: '' };

      await createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nome e imagem são obrigatórios.' });
    });

    it('cria categoria e retorna 201', async () => {
      req.body = { nome: 'Nova Categoria' };
      req.file = { filename: 'img.jpg' };
      const novaCategoria = { id: 'uuid', nome: 'Nova Categoria', slug: 'nova-categoria', imagem: 'img.jpg' };

      Categoria.create.mockResolvedValue(novaCategoria);

      await createCategory(req, res);

      expect(Categoria.create).toHaveBeenCalledWith(expect.objectContaining({
        nome: 'Nova Categoria',
        imagem: 'img.jpg',
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(novaCategoria);
    });

    it('retorna 500 se ocorrer erro na criação', async () => {
      req.body = { nome: 'Erro' };
      req.file = { filename: 'img.jpg' };
      Categoria.create.mockRejectedValue(new Error('Erro'));

      await createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno ao criar categoria.' });
    });
  });

  // UPDATE
  describe('updateCategory', () => {
    it('retorna 404 se categoria não for encontrada', async () => {
      req.params.id = '123';
      Categoria.findByPk.mockResolvedValue(null);

      await updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Categoria não encontrada' });
    });

    it('atualiza nome e imagem', async () => {
      req.params.id = '123';
      req.body.nome = 'Atualizado';
      req.file = { filename: 'nova.jpg' };

      const categoria = {
        nome: 'Antiga',
        slug: 'antiga',
        imagem: 'velha.jpg',
        save: jest.fn().mockResolvedValue(),
      };
      Categoria.findByPk.mockResolvedValue(categoria);

      await updateCategory(req, res);

      expect(categoria.nome).toBe('Atualizado');
      expect(categoria.slug).toBe('atualizado');
      expect(categoria.imagem).toBe('nova.jpg');
      expect(categoria.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(categoria);
    });

    it('atualiza apenas o nome se imagem não enviada', async () => {
      req.params.id = '123';
      req.body.nome = 'Atualizado';

      const categoria = {
        nome: 'Antiga',
        slug: 'antiga',
        imagem: 'velha.jpg',
        save: jest.fn().mockResolvedValue(),
      };
      Categoria.findByPk.mockResolvedValue(categoria);

      await updateCategory(req, res);

      expect(categoria.nome).toBe('Atualizado');
      expect(categoria.slug).toBe('atualizado');
      expect(categoria.imagem).toBe('velha.jpg');
      expect(categoria.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(categoria);
    });

    it('retorna 500 se erro ocorrer', async () => {
      req.params.id = '123';
      Categoria.findByPk.mockRejectedValue(new Error('Erro'));

      await updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar categoria' });
    });
  });

  // GET ALL
  describe('getAllCategories', () => {
    it('retorna todas as categorias', async () => {
      const categorias = [{ id: 1, nome: 'cat1' }, { id: 2, nome: 'cat2' }];
      Categoria.findAll.mockResolvedValue(categorias);

      await getAllCategories(req, res);

      expect(res.json).toHaveBeenCalledWith(categorias);
    });

    it('retorna 500 em caso de erro', async () => {
      Categoria.findAll.mockRejectedValue(new Error('Erro'));

      await getAllCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar categorias' });
    });
  });

  // GET BY ID
  describe('getCategoryById', () => {
    it('retorna 404 se categoria não existir', async () => {
      req.params.id = '123';
      Categoria.findByPk.mockResolvedValue(null);

      await getCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Categoria não encontrada' });
    });

    it('retorna categoria encontrada', async () => {
      const categoria = { id: '123', nome: 'Encontrada' };
      req.params.id = '123';
      Categoria.findByPk.mockResolvedValue(categoria);

      await getCategoryById(req, res);

      expect(res.json).toHaveBeenCalledWith(categoria);
    });

    it('retorna 500 se erro ocorrer', async () => {
      Categoria.findByPk.mockRejectedValue(new Error('Erro'));

      await getCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar categoria' });
    });
  });

  // DELETE
  describe('deleteCategory', () => {
    beforeEach(() => {
      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockImplementation(() => {});
    });

    it('retorna 404 se categoria não for encontrada', async () => {
      req.params.id = '123';
      Categoria.findByPk.mockResolvedValue(null);

      await deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Categoria não encontrada' });
    });

    it('deleta categoria e imagem', async () => {
      req.params.id = '123';
      const categoria = {
        imagem: 'imagem.jpg',
        destroy: jest.fn().mockResolvedValue(),
      };
      Categoria.findByPk.mockResolvedValue(categoria);

      await deleteCategory(req, res);

      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining('uploads/imagem.jpg'));
      expect(categoria.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Categoria deletada com sucesso' });
    });

    it('deleta categoria sem imagem', async () => {
      req.params.id = '123';
      const categoria = {
        imagem: null,
        destroy: jest.fn().mockResolvedValue(),
      };
      Categoria.findByPk.mockResolvedValue(categoria);

      await deleteCategory(req, res);

      expect(fs.existsSync).not.toHaveBeenCalled();
      expect(fs.unlinkSync).not.toHaveBeenCalled();
      expect(categoria.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Categoria deletada com sucesso' });
    });

    it('retorna 500 se erro ocorrer', async () => {
      req.params.id = '123';
      Categoria.findByPk.mockRejectedValue(new Error('Erro'));

      await deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao deletar categoria' });
    });
  });
});
