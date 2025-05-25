const request = require('supertest');
const express = require('express');
const bodyParser = require('express').json;
const authRoutes = require('../../../routes/authRoutes');
const db = require('../../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../../models');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const app = express();
app.use(bodyParser());
app.use('/auth', authRoutes);

describe('Testes de integração - Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('Deve retornar 400 para email inválido', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'email_invalido', password: '123456' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Email inválido.' });
    });

    it('Deve retornar 400 se email já existir', async () => {
      db.User.findOne.mockResolvedValue({ id: 1 });

      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'teste@email.com', password: '123456' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Email já cadastrado.' });
    });

    it('Deve cadastrar novo usuário como admin se for o primeiro', async () => {
      db.User.findOne.mockResolvedValue(null);
      db.User.count.mockResolvedValue(0);
      bcrypt.hash.mockResolvedValue('senha_hash');
      db.User.create.mockResolvedValue({
        id: 1,
        email: 'novo@email.com',
        role: 'admin',
      });

      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'novo@email.com', password: 'senha123' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({
        message: 'Usuário cadastrado com sucesso!',
        user: {
          id: 1,
          email: 'novo@email.com',
          role: 'admin',
        },
      });
    });
  });

  describe('POST /auth/login', () => {
    it('Deve retornar 400 se usuário não existir', async () => {
      db.User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'naoexiste@email.com', password: 'senha123' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Credenciais inválidas.' });
    });

    it('Deve retornar 401 se senha incorreta', async () => {
      db.User.findOne.mockResolvedValue({ id: 1, password: 'senha_hash' });
      bcrypt.compare.mockResolvedValue(false);

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'user@email.com', password: 'senha_errada' });

      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Credenciais inválidas.' });
    });

    it('Deve retornar token e dados do usuário ao logar', async () => {
      db.User.findOne.mockResolvedValue({
        id: 1,
        email: 'user@email.com',
        password: 'senha_hash',
        role: 'user',
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token_falso');

      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'user@email.com', password: 'senha_certa' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        message: 'Login bem-sucedido!',
        user: {
          id: 1,
          email: 'user@email.com',
          role: 'user',
        },
        token: 'token_falso',
      });
    });
  });
});
