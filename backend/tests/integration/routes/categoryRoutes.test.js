// tests/integration/routes/categoryRoutes.test.js
const request = require('supertest');
const express = require('express');

const categoryRoutes = require('../../../routes/categoryRoutes');

const {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
} = require('../../../controllers/categoryController');

// Mock do middleware de autenticação para teste normal (passa)
jest.mock('../../../middleware/authMiddleware', () => (req, res, next) => next());

// Mock do multer para ignorar upload real
jest.mock('multer', () => {
  const multerMock = () => {
    return {
      single: () => (req, res, next) => next(),
    };
  };
  multerMock.diskStorage = jest.fn(() => ({}));
  return multerMock;
});

jest.mock('../../../controllers/categoryController', () => ({
  createCategory: jest.fn((req, res) => res.status(201).json({ message: 'Categoria criada' })),
  updateCategory: jest.fn((req, res) => res.status(200).json({ message: 'Categoria atualizada' })),
  getAllCategories: jest.fn((req, res) => res.status(200).json([{ id: 1, name: 'Teste' }])),
  getCategoryById: jest.fn((req, res) => res.status(200).json({ id: req.params.id, name: 'Teste' })),
  deleteCategory: jest.fn((req, res) => res.status(200).json({ message: 'Categoria deletada' })),
}));

describe('Rotas de Categoria', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/categories', categoryRoutes);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /categories - listar todas as categorias', async () => {
    const res = await request(app).get('/categories');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: 'Teste' }]);
    expect(getAllCategories).toHaveBeenCalled();
  });

  test('GET /categories/:id - buscar categoria por ID', async () => {
    const res = await request(app).get('/categories/123');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ id: '123', name: 'Teste' });
    expect(getCategoryById).toHaveBeenCalled();
  });

  test('POST /categories - criar categoria (com autenticação e upload)', async () => {
    const res = await request(app).post('/categories').attach('imagem', Buffer.from(''), 'teste.jpg');
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({ message: 'Categoria criada' });
    expect(createCategory).toHaveBeenCalled();
  });

  test('PUT /categories/:id - atualizar categoria (com autenticação e upload)', async () => {
    const res = await request(app).put('/categories/123').attach('imagem', Buffer.from(''), 'teste.jpg');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Categoria atualizada' });
    expect(updateCategory).toHaveBeenCalled();
  });

  test('DELETE /categories/:id - deletar categoria (com autenticação)', async () => {
    const res = await request(app).delete('/categories/123');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Categoria deletada' });
    expect(deleteCategory).toHaveBeenCalled();
  });

  // Testes de erro simulados para branch coverage

  test('GET /categories - erro do controller retorna 500', async () => {
    getAllCategories.mockImplementationOnce((req, res) => {
      res.status(500).json({ error: 'Erro interno' });
    });
    const res = await request(app).get('/categories');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Erro interno' });
  });

  test('GET /categories/:id - erro do controller retorna 500', async () => {
    getCategoryById.mockImplementationOnce((req, res) => {
      res.status(500).json({ error: 'Erro interno' });
    });
    const res = await request(app).get('/categories/123');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Erro interno' });
  });

  test('POST /categories - erro do controller retorna 500', async () => {
    createCategory.mockImplementationOnce((req, res) => {
      res.status(500).json({ error: 'Erro interno' });
    });
    const res = await request(app).post('/categories').attach('imagem', Buffer.from(''), 'teste.jpg');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Erro interno' });
  });

  test('PUT /categories/:id - erro do controller retorna 500', async () => {
    updateCategory.mockImplementationOnce((req, res) => {
      res.status(500).json({ error: 'Erro interno' });
    });
    const res = await request(app).put('/categories/123').attach('imagem', Buffer.from(''), 'teste.jpg');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Erro interno' });
  });

  test('DELETE /categories/:id - erro do controller retorna 500', async () => {
    deleteCategory.mockImplementationOnce((req, res) => {
      res.status(500).json({ error: 'Erro interno' });
    });
    const res = await request(app).delete('/categories/123');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Erro interno' });
  });
});

// Teste extra: simular middleware de autenticação que bloqueia acesso
describe('Middleware de autenticação bloqueando acesso', () => {
  let app;

  beforeAll(() => {
    // Mock que bloqueia, retornando 401
    jest.resetModules();
    jest.doMock('../../../middleware/authMiddleware', () => (req, res, next) => {
      res.status(401).json({ error: 'Não autorizado' });
    });
    const categoryRoutesBlocked = require('../../../routes/categoryRoutes');

    app = express();
    app.use(express.json());
    app.use('/categories', categoryRoutesBlocked);
  });

  test('POST /categories retorna 401 se não autorizado', async () => {
    const res = await request(app).post('/categories').attach('imagem', Buffer.from(''), 'teste.jpg');
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'Não autorizado' });
  });

  test('PUT /categories/:id retorna 401 se não autorizado', async () => {
    const res = await request(app).put('/categories/123').attach('imagem', Buffer.from(''), 'teste.jpg');
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'Não autorizado' });
  });

  test('DELETE /categories/:id retorna 401 se não autorizado', async () => {
    const res = await request(app).delete('/categories/123');
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: 'Não autorizado' });
  });
});
