const authMiddleware = require('../../../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

jest.mock('jsonwebtoken');

describe('Middleware de autenticação', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('Deve retornar 401 se não enviar token', () => {
    req.headers.authorization = '';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token não fornecido.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 401 se o header não começar com "Bearer "', () => {
    req.headers.authorization = 'TokenErrado abc123';

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token não fornecido.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('Deve retornar 403 se token for inválido ou expirado', () => {
    req.headers.authorization = 'Bearer token_invalido';
    jwt.verify.mockImplementation(() => { throw new Error('Token inválido'); });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('token_invalido', process.env.JWT_SECRET);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token inválido ou expirado.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('Deve passar para o next e setar req.userId se token for válido', () => {
    req.headers.authorization = 'Bearer token_valido';
    jwt.verify.mockReturnValue({ id: 123 });

    authMiddleware(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('token_valido', process.env.JWT_SECRET);
    expect(req.userId).toBe(123);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
