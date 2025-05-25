const { register, login } = require('../../../controllers/authController');
const db = require('../../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../../models');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('authController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('register', () => {
    it('deve retornar erro para email inválido', async () => {
      req.body = { email: 'email_invalido', password: '123456' };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email inválido.' });
    });

    it('deve retornar erro se o email já existir', async () => {
      req.body = { email: 'teste@email.com', password: '123456' };

      db.User.findOne.mockResolvedValue({ id: 1 });

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email já cadastrado.' });
    });

    it('deve cadastrar o primeiro usuário como admin', async () => {
      req.body = { email: 'novo@email.com', password: 'senha123' };

      db.User.findOne.mockResolvedValue(null);
      db.User.count.mockResolvedValue(0);
      bcrypt.hash.mockResolvedValue('senha_criptografada');
      db.User.create.mockResolvedValue({
        id: 1,
        email: 'novo@email.com',
        role: 'admin',
      });

      await register(req, res);

      expect(db.User.create).toHaveBeenCalledWith({
        email: 'novo@email.com',
        password: 'senha_criptografada',
        role: 'admin',
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuário cadastrado com sucesso!',
        user: {
          id: 1,
          email: 'novo@email.com',
          role: 'admin',
        },
      });
    });
  });

  describe('login', () => {
    it('deve retornar erro se usuário não existir', async () => {
      req.body = { email: 'inexistente@email.com', password: 'senha123' };
      db.User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Credenciais inválidas.' });
    });

    it('deve retornar erro se a senha estiver incorreta', async () => {
      req.body = { email: 'user@email.com', password: 'senhaErrada' };

      db.User.findOne.mockResolvedValue({ id: 1, password: 'senha_hash' });
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Credenciais inválidas.' });
    });

    it('deve fazer login e retornar token', async () => {
      req.body = { email: 'user@email.com', password: 'senhaCerta' };

      db.User.findOne.mockResolvedValue({ id: 1, email: 'user@email.com', password: 'senha_hash', role: 'user' });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-jwt-token');

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login bem-sucedido!',
        user: {
          id: 1,
          email: 'user@email.com',
          role: 'user',
        },
        token: 'fake-jwt-token',
      });
    });
  });
});
