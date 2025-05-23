const authMiddleware = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

describe('authMiddleware', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV, JWT_SECRET: 'segredo' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('deve retornar 401 se não tiver token', () => {
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token não fornecido.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 401 se token não começar com Bearer', () => {
    const req = { headers: { authorization: 'Token abc123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token não fornecido.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next se token for válido e colocar userId na requisição', () => {
    const token = jwt.sign({ id: 123 }, process.env.JWT_SECRET);

    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = {};
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(req.userId).toBe(123);
    expect(next).toHaveBeenCalled();
  });

  it('deve retornar 403 se token for inválido', () => {
    const req = { headers: { authorization: 'Bearer tokeninvalido' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido ou expirado.' });
    expect(next).not.toHaveBeenCalled();
  });
});
