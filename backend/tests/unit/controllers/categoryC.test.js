// tests/unit/controllers/categoryC.test.js

// MOCK do model Categoria
const mockCreate = jest.fn();
const mockFindByPk = jest.fn();
const mockFindAll = jest.fn();
const mockDestroy = jest.fn();
const mockSave = jest.fn();

jest.mock('../../../models/Categoria', () => {
  return jest.fn(() => ({
    create: mockCreate,
    findByPk: mockFindByPk,
    findAll: mockFindAll,
    destroy: mockDestroy,
    save: mockSave,
  }));
});

// Mock da conexão Sequelize para não dar erro
jest.mock('../../../config/db', () => {
  return {}; // objeto vazio, sem conexão real
});

const Categoria = require('../../../models/Categoria'); // mockado
const {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
} = require('../../../controllers/categoryController');

describe('categoryController', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // limpa mocks antes de cada teste
  });

  // Teste para createCategory
  test('createCategory cria uma nova categoria com sucesso', async () => {
    const req = {
      body: { nome: 'Bebidas' },
      file: { filename: 'imagem.jpg' },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Simula o retorno do create
    mockCreate.mockResolvedValue({
      id: 'uuid-fake',
      nome: 'Bebidas',
      slug: 'bebidas',
      imagem: 'imagem.jpg',
    });

    await createCategory(req, res);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        nome: 'Bebidas',
        slug: 'bebidas',
        imagem: 'imagem.jpg',
      })
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ nome: 'Bebidas' })
    );
  });

  // Teste para updateCategory (exemplo)
  test('updateCategory atualiza a categoria com sucesso', async () => {
    const req = {
      params: { id: '123' },
      body: { nome: 'Bebidas Atualizada' },
      file: { filename: 'novaimagem.jpg' },
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    // Simula encontrar a categoria
    mockFindByPk.mockResolvedValue({
      id: '123',
      nome: 'Bebidas Antiga',
      slug: 'bebidas-antiga',
      imagem: 'velha.jpg',
      save: mockSave.mockResolvedValue(),
    });

    await updateCategory(req, res);

    expect(mockFindByPk).toHaveBeenCalledWith('123');
    expect(mockSave).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ nome: 'Bebidas Atualizada' })
    );
  });

  // Teste para getAllCategories
  test('getAllCategories retorna todas as categorias', async () => {
    const req = {};
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    mockFindAll.mockResolvedValue([{ id: '1', nome: 'Bebidas' }]);

    await getAllCategories(req, res);

    expect(mockFindAll).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith([{ id: '1', nome: 'Bebidas' }]);
  });

  // Teste para getCategoryById
  test('getCategoryById retorna categoria pelo id', async () => {
    const req = { params: { id: '123' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    mockFindByPk.mockResolvedValue({ id: '123', nome: 'Bebidas' });

    await getCategoryById(req, res);

    expect(mockFindByPk).toHaveBeenCalledWith('123');
    expect(res.json).toHaveBeenCalledWith({ id: '123', nome: 'Bebidas' });
  });

  // Teste para deleteCategory
  test('deleteCategory deleta categoria com sucesso', async () => {
    const req = { params: { id: '123' } };
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    // Mock categoria com imagem
    mockFindByPk.mockResolvedValue({
      id: '123',
      nome: 'Bebidas',
      imagem: 'imagem.jpg',
      destroy: mockDestroy.mockResolvedValue(),
    });

    // Como fs.unlinkSync é síncrono, mockamos ele para não deletar arquivo de verdade
    jest.mock('fs', () => ({
      existsSync: jest.fn(() => true),
      unlinkSync: jest.fn(),
    }));

    await deleteCategory(req, res);

    expect(mockFindByPk).toHaveBeenCalledWith('123');
    expect(mockDestroy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: 'Categoria deletada com sucesso',
    });
  });
});
