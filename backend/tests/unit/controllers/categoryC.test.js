const path = require('path');

const Categoria = require(path.resolve(__dirname, '../../../models/Categoria'))(require(path.resolve(__dirname, '../../../config/db')));

jest.spyOn(Categoria, 'create').mockImplementation(jest.fn());
jest.spyOn(Categoria, 'findByPk').mockImplementation(jest.fn());
jest.spyOn(Categoria, 'findAll').mockImplementation(jest.fn());
jest.spyOn(Categoria, 'destroy').mockImplementation(jest.fn());
jest.spyOn(Categoria, 'update').mockImplementation(jest.fn());

// importar controllers normalmente
const {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory
} = require(path.resolve(__dirname, '../../../controllers/categoryController'));

describe('Category Controller', () => {
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

  describe('createCategory', () => {
    it('deve retornar 400 se nome ou imagem não forem enviados', async () => {
      req.body = { nome: '' };
      req.file = null;

      await createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nome e imagem são obrigatórios.' });
    });

    it('deve criar categoria e retornar 201', async () => {
      req.body = { nome: 'Teste Categoria' };
      req.file = { filename: 'imagem.jpg' };

      const fakeCategory = {
        id: 'uuid',
        nome: 'Teste Categoria',
        slug: 'teste-categoria',
        imagem: 'imagem.jpg',
      };

      Categoria.create.mockResolvedValue(fakeCategory);

      await createCategory(req, res);

      expect(Categoria.create).toHaveBeenCalledWith(expect.objectContaining({
        nome: 'Teste Categoria',
        imagem: 'imagem.jpg',
      }));
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeCategory);
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.body = { nome: 'Teste' };
      req.file = { filename: 'imagem.jpg' };
      Categoria.create.mockRejectedValue(new Error('Erro'));

      await createCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno ao criar categoria.' });
    });
  });

  describe('updateCategory', () => {
    it('deve retornar 404 se categoria não existir', async () => {
      req.params = { id: '1' };
      Categoria.findByPk.mockResolvedValue(null);

      await updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Categoria não encontrada' });
    });

    it('deve atualizar nome e imagem e retornar a categoria', async () => {
      req.params = { id: '1' };
      req.body = { nome: 'Categoria Atualizada' };
      req.file = { filename: 'nova-imagem.jpg' };

      const categoriaMock = {
        nome: 'Categoria Antiga',
        slug: 'categoria-antiga',
        imagem: 'imagem-antiga.jpg',
        save: jest.fn().mockResolvedValue(),
      };

      Categoria.findByPk.mockResolvedValue(categoriaMock);

      await updateCategory(req, res);

      expect(categoriaMock.nome).toBe('Categoria Atualizada');
      expect(categoriaMock.slug).toBe('categoria-atualizada');
      expect(categoriaMock.imagem).toBe('nova-imagem.jpg');
      expect(categoriaMock.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(categoriaMock);
    });

    it('deve atualizar somente nome se imagem não for enviada', async () => {
      req.params = { id: '1' };
      req.body = { nome: 'Categoria Atualizada' };
      req.file = null;

      const categoriaMock = {
        nome: 'Categoria Antiga',
        slug: 'categoria-antiga',
        imagem: 'imagem-antiga.jpg',
        save: jest.fn().mockResolvedValue(),
      };

      Categoria.findByPk.mockResolvedValue(categoriaMock);

      await updateCategory(req, res);

      expect(categoriaMock.nome).toBe('Categoria Atualizada');
      expect(categoriaMock.slug).toBe('categoria-atualizada');
      expect(categoriaMock.imagem).toBe('imagem-antiga.jpg');
      expect(categoriaMock.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(categoriaMock);
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.params = { id: '1' };
      Categoria.findByPk.mockRejectedValue(new Error('Erro'));

      await updateCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar categoria' });
    });
  });

  describe('getAllCategories', () => {
    it('deve retornar lista de categorias', async () => {
      const listaFake = [{ id: 1, nome: 'cat1' }, { id: 2, nome: 'cat2' }];
      Categoria.findAll.mockResolvedValue(listaFake);

      await getAllCategories(req, res);

      expect(res.json).toHaveBeenCalledWith(listaFake);
    });

    it('deve retornar 500 em caso de erro', async () => {
      Categoria.findAll.mockRejectedValue(new Error('Erro'));

      await getAllCategories(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar categorias' });
    });
  });

  describe('getCategoryById', () => {
    it('deve retornar 404 se categoria não existir', async () => {
      req.params = { id: '1' };
      Categoria.findByPk.mockResolvedValue(null);

      await getCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Categoria não encontrada' });
    });

    it('deve retornar categoria pelo id', async () => {
      req.params = { id: '1' };
      const categoriaFake = { id: '1', nome: 'Teste' };
      Categoria.findByPk.mockResolvedValue(categoriaFake);

      await getCategoryById(req, res);

      expect(res.json).toHaveBeenCalledWith(categoriaFake);
    });

    it('deve retornar 500 em caso de erro', async () => {
      Categoria.findByPk.mockRejectedValue(new Error('Erro'));

      await getCategoryById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar categoria' });
    });
  });

  describe('deleteCategory', () => {
    beforeEach(() => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
      jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('deve retornar 404 se categoria não existir', async () => {
      req.params = { id: '1' };
      Categoria.findByPk.mockResolvedValue(null);

      await deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Categoria não encontrada' });
    });

    it('deve deletar categoria e imagem e retornar sucesso', async () => {
      req.params = { id: '1' };
      const categoriaMock = {
        imagem: 'imagem.jpg',
        destroy: jest.fn().mockResolvedValue(),
      };
      Categoria.findByPk.mockResolvedValue(categoriaMock);

      await deleteCategory(req, res);

      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.unlinkSync).toHaveBeenCalledWith(expect.stringContaining('uploads/imagem.jpg'));
      expect(categoriaMock.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Categoria deletada com sucesso' });
    });

    it('deve deletar categoria sem imagem', async () => {
      req.params = { id: '1' };
      const categoriaMock = {
        imagem: null,
        destroy: jest.fn().mockResolvedValue(),
      };
      Categoria.findByPk.mockResolvedValue(categoriaMock);

      await deleteCategory(req, res);

      expect(fs.existsSync).not.toHaveBeenCalled();
      expect(fs.unlinkSync).not.toHaveBeenCalled();
      expect(categoriaMock.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Categoria deletada com sucesso' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      req.params = { id: '1' };
      Categoria.findByPk.mockRejectedValue(new Error('Erro'));

      await deleteCategory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao deletar categoria' });
    });
  });
});
