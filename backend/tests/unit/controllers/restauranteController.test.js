const path = require('path');

// Mocks
const mockCreate = jest.fn();
const mockFindAll = jest.fn();
const mockFindByPk = jest.fn();
const mockFindOne = jest.fn();
const mockSetCategoria = jest.fn();
const mockDestroy = jest.fn();
const mockSave = jest.fn();

jest.mock('../../../models', () => ({
  Restaurante: {
    create: mockCreate,
    findAll: mockFindAll,
    findByPk: mockFindByPk,
    findOne: mockFindOne,
  },
  Categoria: {
    findAll: jest.fn(),
  },
}));

function createMockRestauranteInstance() {
  return {
    id: 'fake-id',
    nome: 'Fake Restaurante',
    slug: 'fake-restaurante',
    telefone: '12345678',
    endereco: 'Rua A',
    horario: '10h-22h',
    sobreNos: 'Fake Sobre',
    imagem: 'imagem.jpg',
    setCategoria: mockSetCategoria,
    destroy: mockDestroy,
    save: mockSave,
    toJSON: () => ({
      id: 'fake-id',
      nome: 'Fake Restaurante',
      slug: 'fake-restaurante',
      telefone: '12345678',
      endereco: 'Rua A',
      horario: '10h-22h',
      sobreNos: 'Fake Sobre',
      imagem: 'imagem.jpg',
    }),
  };
}

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
      mockCreate.mockResolvedValue(fakeRestaurante);

      const { Categoria } = require('../../../models');
      const mockCategorias = [
        { id: 'cat1', nome: 'Categoria 1' },
        { id: 'cat2', nome: 'Categoria 2' },
      ];

      Categoria.findAll.mockResolvedValue(mockCategorias);
      mockSetCategoria.mockResolvedValue();

      const { Restaurante } = require('../../../models');
      Restaurante.findOne = jest.fn().mockResolvedValue({
        ...fakeRestaurante,
        toJSON: () => ({
          id: 'fake-id',
          nome: 'Meu Restaurante',
          categorias: mockCategorias,
        }),
      });

      await createRestaurante(req, res);

      expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({
        nome: 'Meu Restaurante',
        telefone: '12345678',
        endereco: 'Rua A',
        horario: '10h-22h',
        sobreNos: 'Descrição',
        imagem: 'imagem.jpg',
      }));

      expect(Categoria.findAll).toHaveBeenCalledWith({
        where: { id: req.body.categoriaIds },
      });

      expect(mockSetCategoria).toHaveBeenCalledWith(mockCategorias);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Restaurante criado com sucesso',
        restaurante: expect.objectContaining({
          nome: 'Meu Restaurante',
          categorias: expect.arrayContaining([
            expect.objectContaining({ id: expect.any(String), nome: expect.any(String) }),
            expect.objectContaining({ id: expect.any(String), nome: expect.any(String) }),
          ]),
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

    it('deve retornar 400 se categoriaIds não for array', async () => {
      req.body = {
        nome: 'Rest',
        categoriaIds: 'nao-array',
      };
      req.file = { filename: 'imagem.jpg' };

      await createRestaurante(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Categorias inválidas.' });
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      req.body = {
        nome: 'Rest',
        categoriaIds: ['cat1'],
      };
      req.file = { filename: 'imagem.jpg' };

      mockCreate.mockRejectedValue(new Error('Erro interno'));

      await createRestaurante(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Erro ao criar restaurante',
      }));
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

    it('deve retornar 500 em caso de erro', async () => {
      mockFindByPk.mockRejectedValue(new Error('Erro'));

      await getRestauranteById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Erro interno' }));
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

      const { Categoria } = require('../../../models');
      const mockCategorias = [{ id: 'cat1' }, { id: 'cat2' }];
      Categoria.findAll.mockResolvedValue(mockCategorias);

      const fakeRestaurante = createMockRestauranteInstance();
      mockFindByPk.mockResolvedValue(fakeRestaurante);
      mockSave.mockResolvedValue();
      mockSetCategoria.mockResolvedValue();

      await updateRestaurante(req, res);

      expect(mockFindByPk).toHaveBeenCalledWith('id123');
      expect(fakeRestaurante.nome).toBe('Novo Nome');
      expect(fakeRestaurante.imagem).toBe('novaimagem.jpg');
      expect(mockSave).toHaveBeenCalled();
      expect(Categoria.findAll).toHaveBeenCalledWith({ where: { id: req.body.categoriaIds } });
      expect(mockSetCategoria).toHaveBeenCalledWith(mockCategorias);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        id: 'fake-id',
        nome: 'Novo Nome',
      }));
    });

    it('deve retornar 404 se restaurante não encontrado para atualização', async () => {
      req.params.id = 'idInexistente';
      mockFindByPk.mockResolvedValue(null);

      await updateRestaurante(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Restaurante não encontrado' });
    });

    it('deve retornar 500 em caso de erro interno', async () => {
      req.params.id = 'id123';
      mockFindByPk.mockRejectedValue(new Error('Erro interno'));

      await updateRestaurante(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Erro ao atualizar restaurante' }));
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

    it('deve retornar 500 em caso de erro interno', async () => {
      req.params.id = 'id123';
      mockFindByPk.mockResolvedValue(createMockRestauranteInstance());
      mockDestroy.mockRejectedValue(new Error('Erro interno'));

      await deleteRestaurante(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Erro ao deletar restaurante' }));
    });
  });
});
