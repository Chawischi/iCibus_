// authController.test.js

jest.mock('../models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
  },
}));

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = require('../controllers/authController');

describe('authController', () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('register', () => {
    it('deve retornar erro se email for inválido', async () => {
      req.body.email = 'emailinvalido';
      req.body.password = '123456';

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email inválido.' });
    });

    it('deve retornar erro se email já estiver cadastrado', async () => {
      req.body.email = 'teste@teste.com';
      req.body.password = '123456';
      User.findOne.mockResolvedValue({ id: 'some-uuid', email: 'teste@teste.com' });

      await authController.register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'teste@teste.com' } });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email já cadastrado.' });
    });

    it('deve criar usuário com role admin se for o primeiro', async () => {
      req.body.email = 'novo@usuario.com';
      req.body.password = 'senha123';

      User.findOne.mockResolvedValue(null);
      User.count.mockResolvedValue(0);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.create.mockImplementation(async (userData) => ({
        id: 'uuid-admin',
        email: userData.email,
        role: userData.role,
      }));

      await authController.register(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith('senha123', 10);
      expect(User.create).toHaveBeenCalledWith({
        email: 'novo@usuario.com',
        password: 'hashedPassword',
        role: 'admin',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuário cadastrado com sucesso!',
        user: {
          id: 'uuid-admin',
          email: 'novo@usuario.com',
          role: 'admin',
        },
      });
    });

    it('deve criar usuário com role user se já houver usuários', async () => {
      req.body.email = 'outro@usuario.com';
      req.body.password = 'senha123';

      User.findOne.mockResolvedValue(null);
      User.count.mockResolvedValue(2);
      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.create.mockImplementation(async (userData) => ({
        id: 'uuid-user',
        email: userData.email,
        role: userData.role,
      }));

      await authController.register(req, res);

      expect(User.create).toHaveBeenCalledWith({
        email: 'outro@usuario.com',
        password: 'hashedPassword',
        role: 'user',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuário cadastrado com sucesso!',
        user: {
          id: 'uuid-user',
          email: 'outro@usuario.com',
          role: 'user',
        },
      });
    });
  });

  describe('login', () => {
    it('deve retornar erro se usuário não existir', async () => {
      req.body.email = 'naoexiste@teste.com';
      req.body.password = 'senha123';
      User.findOne.mockResolvedValue(null);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Credenciais inválidas.' });
    });

    it('deve retornar erro se senha estiver errada', async () => {
      req.body.email = 'existe@teste.com';
      req.body.password = 'senhaErrada';

      User.findOne.mockResolvedValue({ id: 'uuid-1', password: 'hash' });
      bcrypt.compare.mockResolvedValue(false);

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Credenciais inválidas.' });
    });

    it('deve fazer login e retornar token', async () => {
      req.body.email = 'existe@teste.com';
      req.body.password = 'senhaCerta';

      User.findOne.mockResolvedValue({
        id: 'uuid-1',
        email: 'existe@teste.com',
        password: 'hash',
        role: 'user',
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('tokenFake123');

      await authController.login(req, res);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 'uuid-1' },
        process.env.JWT_SECRET,
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login bem-sucedido!',
        user: {
          id: 'uuid-1',
          email: 'existe@teste.com',
          role: 'user',
        },
        token: 'tokenFake123',
      });
    });
  });
});
