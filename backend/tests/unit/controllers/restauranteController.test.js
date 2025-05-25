const path = require('path');

// Mock dos models antes de importar o controller
const mockCreate = jest.fn();
const mockFindAll = jest.fn();
const mockFindByPk = jest.fn();
const mockSetCategoria = jest.fn();
const mockDestroy = jest.fn();
const mockSave = jest.fn();

jest.mock('../../../models', () => ({
  Restaurante: {
    create: mockCreate,
    findAll: mockFindAll,
    findByPk: mockFindByPk,
  },
  Categoria: {
    findAll: jest.fn(),
  },
}));

// Como o setCategoria e save são métodos da instância, precisamos mockar a instância:
function createMockRestauranteInstance() {
  return {
    id: 'fake-id',
    nome: 'Fake Restaurante',
    slug: 'fake-restaurante',
    setCategoria: mockSetCategoria,
    destroy: mockDestroy,
    save: mockSave,
    toJSON: () => ({ id: 'fake-id', nome: 'Fake Restaurante' }),
  };
}

// Agora importa o controller
const {
  createRestaurante,
  getAllRestaurantes,
  getRestauranteById,
  updateRestaurante,
  deleteRestaurante,
} = require('../../../controllers/restaurantController');

describe('Restaurante Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      file: null,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('createRestaurante', () => {
    it('deve criar restaurante com sucesso', async () => {
      req.body = {
        nome: 'Meu Restaurante',
        telefone: '12345678',
        endereco: 'Rua A',
        horario: '10h-22h',
        sobreNos: 'Descrição',
        categoriaIds: ['cat1', 'cat2'],
      };
      req.file = { filename: 'imagem.jpg' };

      const fakeRestaurante = createMockRestauranteInstance();

      // Mock Restaurante.create para retornar a instância mockada
      mockCreate.mockResolvedValue(fakeRestaurante);

      // Mock Categoria.findAll para retornar array de categorias simuladas
      const mockCategorias = [{ id: 'cat1', nome: 'Categoria 1' }, { id: 'cat2', nome: 'Categoria 2' }];
      const { Categoria } = require('../../../models');
      Categoria.findAll.mockResolvedValue(mockCategorias);

      // Mock setCategoria
      mockSetCategoria.mockResolvedValue();

      // Mock findOne para retornar restaurante com categorias (simulando findOne depois de criação)
      const { Restaurante } = require('../../../modelsodels');
      Restaurante.findOne = jest.fn().mockResolvedValue({
        ...fakeRestaurante,
        toJSON: () => ({
          id: 'fake-id',
          nome: 'Meu Restaurante',
          categorias: mockCategorias,
        }),
      });

      await createRestaurante(req, res);

      expect(mockCreate).toHaveBeenCalled();
      expect(mockSetCategoria).toHaveBeenCalledWith(mockCategorias);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Restaurante criado com sucesso',
        restaurante: expect.objectContaining({
          nome: 'Meu Restaurante',
        }),
      }));
    });

    it('deve retornar 400 se nome ou imagem não forem enviados', async () => {
      req.body = { nome: '' };
      req.file = null;

      await createRestaurante(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nome e imagem são obrigatórios.' });
    });
  });

  describe('getAllRestaurantes', () => {
    it('deve retornar lista de restaurantes', async () => {
      const fakeRestaurantes = [{ id: '1', nome: 'Rest1' }, { id: '2', nome: 'Rest2' }];
      mockFindAll.mockResolvedValue(fakeRestaurantes);

      await getAllRestaurantes(req, res);

      expect(mockFindAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ success: true, restaurantes: fakeRestaurantes });
    });

    it('deve retornar erro 500 em caso de exceção', async () => {
      mockFindAll.mockRejectedValue(new Error('Erro interno'));

      await getAllRestaurantes(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });

  describe('getRestauranteById', () => {
    it('deve retornar restaurante se encontrado', async () => {
      req.params.id = 'id123';
      const fakeRestaurante = createMockRestauranteInstance();
      mockFindByPk.mockResolvedValue(fakeRestaurante);

      await getRestauranteById(req, res);

      expect(mockFindByPk).toHaveBeenCalledWith('id123', expect.any(Object));
      expect(res.json).toHaveBeenCalledWith({ success: true, restaurante: fakeRestaurante });
    });

    it('deve retornar 404 se restaurante não encontrado', async () => {
      req.params.id = 'idInexistente';
      mockFindByPk.mockResolvedValue(null);

      await getRestauranteById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Restaurante não encontrado' });
    });
  });

  describe('updateRestaurante', () => {
    it('deve atualizar restaurante com sucesso', async () => {
      req.params.id = 'id123';
      req.body = {
        nome: 'Novo Nome',
        categoriaIds: ['cat1', 'cat2'],
      };
      req.file = { filename: 'novaimagem.jpg' };

      const mockCategorias = [{ id: 'cat1' }, { id: 'cat2' }];

      const fakeRestaurante = createMockRestauranteInstance();

      mockFindByPk.mockResolvedValue(fakeRestaurante);

      // Para atualizar categorias, precisamos mockar Categoria.findAll
      const { Categoria } = require('../../../models');
      Categoria.findAll.mockResolvedValue(mockCategorias);

      mockSetCategoria.mockResolvedValue();

      mockSave.mockResolvedValue();

      // Mock para buscar o restaurante atualizado
      const { Restaurante } = require('../../../models');
      Restaurante.findByPk = jest.fn().mockResolvedValue({
        ...fakeRestaurante,
        toJSON: () => ({ id: 'id123', nome: 'Novo Nome' }),
      });

      await updateRestaurante(req, res);

      expect(mockFindByPk).toHaveBeenCalledWith('id123');
      expect(mockSave).toHaveBeenCalled();
      expect(mockSetCategoria).toHaveBeenCalledWith(mockCategorias);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 'id123', nome: 'Novo Nome' }));
    });

    it('deve retornar 404 se restaurante não encontrado para atualização', async () => {
      req.params.id = 'idInexistente';
      mockFindByPk.mockResolvedValue(null);

      await updateRestaurante(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Restaurante não encontrado' });
    });
  });

  describe('deleteRestaurante', () => {
    it('deve deletar restaurante com sucesso', async () => {
      req.params.id = 'id123';
      const fakeRestaurante = createMockRestauranteInstance();
      mockFindByPk.mockResolvedValue(fakeRestaurante);
      mockDestroy.mockResolvedValue();

      await deleteRestaurante(req, res);

      expect(mockFindByPk).toHaveBeenCalledWith('id123');
      expect(mockDestroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Restaurante deletado com sucesso' });
    });

    it('deve retornar 404 se restaurante não encontrado para deletar', async () => {
      req.params.id = 'idInexistente';
      mockFindByPk.mockResolvedValue(null);

      await deleteRestaurante(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Restaurante não encontrado' });
    });
  });
});
