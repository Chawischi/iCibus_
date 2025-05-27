const request = require('supertest');
const express = require('express');
const restauranteRoutes = require('../../../routes/restaurantRoutes');
 
jest.mock('../../../middleware/authMiddleware', () => (req, res, next) => next());
jest.mock('../../../config/uploadConfig', () => ({
  single: () => (req, res, next) => {
    req.file = { filename: 'fakeimage.jpg' };
    next();
  },
}));
 
 
const restauranteController = require('../../../controllers/restaurantController');
 
jest.mock('../../../controllers/restaurantController', () => ({
  createRestaurante: jest.fn((req, res) => res.status(201).json({ message: 'Restaurante criado' })),
  updateRestaurante: jest.fn((req, res) => res.status(200).json({ message: 'Restaurante atualizado' })),
  deleteRestaurante: jest.fn((req, res) => res.status(200).json({ message: 'Restaurante deletado' })),
  getAllRestaurantes: jest.fn((req, res) => res.status(200).json([{ nome: 'Restaurante A' }])),
  getRestauranteById: jest.fn((req, res) => res.status(200).json({ id: req.params.id })),
  getRestaurantsByCategory: jest.fn((req, res) => res.status(200).json([{ categoria: req.params.categoryId }])),
}));
 
const app = express();
app.use(express.json());
app.use('/restaurantes', restauranteRoutes);
 
describe('Rotas de Restaurante', () => {
  it('POST /restaurantes - criar restaurante', async () => {
    const res = await request(app).post('/restaurantes').send({ nome: 'Novo Restaurante' });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Restaurante criado');
  });
 
  it('PUT /restaurantes/:id - editar restaurante', async () => {
    const res = await request(app).put('/restaurantes/1').send({ nome: 'Editado' });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Restaurante atualizado');
  });
 
  it('DELETE /restaurantes/:id - deletar restaurante', async () => {
    const res = await request(app).delete('/restaurantes/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Restaurante deletado');
  });
 
  it('GET /restaurantes - buscar todos os restaurantes', async () => {
    const res = await request(app).get('/restaurantes');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
 
  it('GET /restaurantes/:id - buscar por ID', async () => {
    const res = await request(app).get('/restaurantes/123');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe('123');
  });
 
  it('GET /restaurantes/categoria/:categoryId - buscar por categoria', async () => {
    const res = await request(app).get('/restaurantes/categoria/456');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].categoria).toBe('456');
  });
});