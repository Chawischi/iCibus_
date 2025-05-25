const { ItemMenu } = require('../../../models');
const itemMenuController = require('../../../controllers/itemMenuController');

jest.mock('../../../models', () => ({
  ItemMenu: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

function mockResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

function mockConsoleError() {
  return jest.spyOn(console, 'error').mockImplementation(() => {});
}

describe('ItemMenu Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createItemMenu', () => {
    it('deve criar um item do menu com sucesso (com imagem)', async () => {
      const req = {
        body: {
          nome: 'Pizza Margherita',
          preco: 25.5,
          descricao: 'Clássica italiana',
          restauranteId: '123',
        },
        file: {
          filename: 'pizza.jpg',
        },
      };

      const res = mockResponse();

      const createdItem = { ...req.body, imagem: 'pizza.jpg' };
      ItemMenu.create.mockResolvedValue(createdItem);

      await itemMenuController.createItemMenu(req, res);

      expect(ItemMenu.create).toHaveBeenCalledWith({
        nome: 'Pizza Margherita',
        slug: 'pizza-margherita',
        preco: 25.5,
        descricao: 'Clássica italiana',
        imagem: 'pizza.jpg',
        restauranteId: '123',
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdItem);
    });

    it('deve criar um item do menu com sucesso (sem imagem)', async () => {
      const req = {
        body: {
          nome: 'Sushi Especial',
          preco: 40,
          descricao: 'Delícia japonesa',
          restauranteId: '456',
        },
        file: null,
      };

      const res = mockResponse();

      const createdItem = { ...req.body, imagem: null };
      ItemMenu.create.mockResolvedValue(createdItem);

      await itemMenuController.createItemMenu(req, res);

      expect(ItemMenu.create).toHaveBeenCalledWith({
        nome: 'Sushi Especial',
        slug: 'sushi-especial',
        preco: 40,
        descricao: 'Delícia japonesa',
        imagem: null,
        restauranteId: '456',
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdItem);
    });

    it('deve retornar erro 500 se ocorrer uma falha', async () => {
      const req = {
        body: {
          nome: 'Falha',
          preco: 10,
          descricao: '',
          restauranteId: '123',
        },
        file: null,
      };

      const res = mockResponse();
      const consoleSpy = mockConsoleError();

      try {
        ItemMenu.create.mockRejectedValue(new Error('Falha ao criar'));

        await itemMenuController.createItemMenu(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar item do menu' });
      } finally {
        consoleSpy.mockRestore();
      }
    });

    it('deve gerar slug corretamente com caracteres especiais e espaços', async () => {
      const req = {
        body: {
          nome: 'Sopa de Cebola & Queijo!',
          preco: 20,
          descricao: 'Saboroso e quente',
          restauranteId: '789',
        },
        file: null,
      };

      const res = mockResponse();

      const createdItem = { ...req.body, imagem: null };
      ItemMenu.create.mockResolvedValue(createdItem);

      await itemMenuController.createItemMenu(req, res);

      expect(ItemMenu.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'sopa-de-cebola-and-queijo',
        })
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdItem);
    });

    it('deve aceitar nome com letras maiúsculas e espaços e gerar slug minúsculo', async () => {
      const req = {
        body: {
          nome: 'Hambúrguer Gourmet Especial',
          preco: 30,
          descricao: 'Delícia premium',
          restauranteId: '321',
        },
        file: null,
      };

      const res = mockResponse();

      const createdItem = { ...req.body, imagem: null };
      ItemMenu.create.mockResolvedValue(createdItem);

      await itemMenuController.createItemMenu(req, res);

      expect(ItemMenu.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: 'hamburguer-gourmet-especial',
        })
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdItem);
    });

    it('deve tratar corretamente se body.nome estiver vazio (gera slug vazio)', async () => {
      const req = {
        body: {
          nome: '',
          preco: 10,
          descricao: 'Teste',
          restauranteId: '111',
        },
        file: null,
      };

      const res = mockResponse();

      const createdItem = { ...req.body, imagem: null };
      ItemMenu.create.mockResolvedValue(createdItem);

      await itemMenuController.createItemMenu(req, res);

      expect(ItemMenu.create).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: '',
        })
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdItem);
    });

    it('deve retornar erro 500 se req.body estiver ausente', async () => {
      const req = {
        body: null,
        file: null,
      };

      const res = mockResponse();
      const consoleSpy = mockConsoleError();

      try {
        ItemMenu.create.mockRejectedValue(new Error('Dados inválidos'));

        await itemMenuController.createItemMenu(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao criar item do menu' });
      } finally {
        consoleSpy.mockRestore();
      }
    });
  });

  describe('getAllItensMenu', () => {
    it('deve retornar todos os itens do menu', async () => {
      const req = {};
      const res = mockResponse();

      const itens = [{ nome: 'Pizza' }, { nome: 'Lasanha' }];
      ItemMenu.findAll.mockResolvedValue(itens);

      await itemMenuController.getAllItensMenu(req, res);

      expect(ItemMenu.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(itens);
    });

    it('deve retornar array vazio se não houver itens', async () => {
      const req = {};
      const res = mockResponse();

      ItemMenu.findAll.mockResolvedValue([]);

      await itemMenuController.getAllItensMenu(req, res);

      expect(ItemMenu.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('deve retornar erro se findAll falhar', async () => {
      const req = {};
      const res = mockResponse();
      const consoleSpy = mockConsoleError();

      try {
        ItemMenu.findAll.mockRejectedValue(new Error('Erro'));

        await itemMenuController.getAllItensMenu(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar itens do menu' });
      } finally {
        consoleSpy.mockRestore();
      }
    });
  });

  describe('getItemMenuById', () => {
    it('deve retornar item do menu pelo ID', async () => {
      const req = { params: { id: 'abc' } };
      const res = mockResponse();

      const item = { nome: 'Hamburguer' };
      ItemMenu.findByPk.mockResolvedValue(item);

      await itemMenuController.getItemMenuById(req, res);

      expect(ItemMenu.findByPk).toHaveBeenCalledWith('abc');
      expect(res.json).toHaveBeenCalledWith(item);
    });

    it('deve retornar 404 se item não for encontrado', async () => {
      const req = { params: { id: 'invalido' } };
      const res = mockResponse();

      ItemMenu.findByPk.mockResolvedValue(null);

      await itemMenuController.getItemMenuById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Item não encontrado' });
    });

    it('deve retornar erro 500 se findByPk falhar', async () => {
      const req = { params: { id: 'abc' } };
      const res = mockResponse();
      const consoleSpy = mockConsoleError();

      try {
        ItemMenu.findByPk.mockRejectedValue(new Error('Erro no banco'));

        await itemMenuController.getItemMenuById(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao buscar item do menu' });
      } finally {
        consoleSpy.mockRestore();
      }
    });
  });

  describe('updateItemMenu', () => {
    it('deve atualizar um item do menu com sucesso (com imagem)', async () => {
      const req = {
        params: { id: '123' },
        body: {
          nome: 'Pizza Atualizada',
          preco: 28,
          descricao: 'Nova descrição',
          restauranteId: '123',
        },
        file: {
          filename: 'pizza_nova.jpg',
        },
      };
      const res = mockResponse();

      ItemMenu.findByPk.mockResolvedValue({
        update: jest.fn().mockResolvedValue({
          ...req.body,
          imagem: 'pizza_nova.jpg',
          slug: 'pizza-atualizada',
        }),
      });

      await itemMenuController.updateItemMenu(req, res);

      expect(ItemMenu.findByPk).toHaveBeenCalledWith('123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: 'Pizza Atualizada',
          slug: 'pizza-atualizada',
          imagem: 'pizza_nova.jpg',
        })
      );
    });

    it('deve atualizar um item do menu com sucesso (sem imagem)', async () => {
      const req = {
        params: { id: '456' },
        body: {
          nome: 'Sushi Atualizado',
          preco: 50,
          descricao: 'Delícia japonesa renovada',
          restauranteId: '456',
        },
        file: null,
      };
      const res = mockResponse();

      ItemMenu.findByPk.mockResolvedValue({
        update: jest.fn().mockResolvedValue({
          ...req.body,
          imagem: null,
          slug: 'sushi-atualizado',
        }),
      });

      await itemMenuController.updateItemMenu(req, res);

      expect(ItemMenu.findByPk).toHaveBeenCalledWith('456');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          nome: 'Sushi Atualizado',
          slug: 'sushi-atualizado',
          imagem: null,
        })
      );
    });

    it('deve retornar 404 se item não encontrado para atualizar', async () => {
      const req = { params: { id: '999' }, body: {}, file: null };
      const res = mockResponse();

      ItemMenu.findByPk.mockResolvedValue(null);

      await itemMenuController.updateItemMenu(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Item não encontrado' });
    });

    it('deve retornar erro 500 se falha na atualização', async () => {
      const req = {
        params: { id: '123' },
        body: {
          nome: 'Erro',
          preco: 10,
          descricao: 'Erro',
          restauranteId: '123',
        },
        file: null,
      };
      const res = mockResponse();
      const consoleSpy = mockConsoleError();

      try {
        ItemMenu.findByPk.mockResolvedValue({
          update: jest.fn().mockRejectedValue(new Error('Falha na atualização')),
        });

        await itemMenuController.updateItemMenu(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao atualizar item do menu' });
      } finally {
        consoleSpy.mockRestore();
      }
    });
  });

  describe('deleteItemMenu', () => {
    it('deve deletar item do menu com sucesso', async () => {
      const req = { params: { id: '123' } };
      const res = mockResponse();

      ItemMenu.destroy.mockResolvedValue(1); 

      await itemMenuController.deleteItemMenu(req, res);

      expect(ItemMenu.destroy).toHaveBeenCalledWith({ where: { id: '123' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item deletado com sucesso' });
    });

    it('deve retornar 404 se item não encontrado para deletar', async () => {
      const req = { params: { id: '999' } };
      const res = mockResponse();

      ItemMenu.destroy.mockResolvedValue(0); 

      await itemMenuController.deleteItemMenu(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Item não encontrado' });
    });

    it('deve retornar erro 500 se falha ao deletar', async () => {
      const req = { params: { id: '123' } };
      const res = mockResponse();
      const consoleSpy = mockConsoleError();

      try {
        ItemMenu.destroy.mockRejectedValue(new Error('Erro ao deletar'));

        await itemMenuController.deleteItemMenu(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao deletar item do menu' });
      } finally {
        consoleSpy.mockRestore();
      }
    });
  });

  describe('Validações adicionais', () => {
    it('deve retornar erro 400 se preco for negativo ao criar', async () => {
      const req = {
        body: {
          nome: 'Item Inválido',
          preco: -5,
          descricao: 'Preço inválido',
          restauranteId: '123',
        },
        file: null,
      };
      const res = mockResponse();

      await itemMenuController.createItemMenu(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Preço deve ser um valor positivo' });
    });

    it('deve retornar erro 400 se restauranteId não for informado ao criar', async () => {
      const req = {
        body: {
          nome: 'Item sem restaurante',
          preco: 10,
          descricao: 'Falta restauranteId',
        },
        file: null,
      };
      const res = mockResponse();

      await itemMenuController.createItemMenu(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'restauranteId é obrigatório' });
    });
  });
});
