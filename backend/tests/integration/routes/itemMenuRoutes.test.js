// tests/integration/routes/itemMenuRoutes.test.js
const request = require('supertest');
const express = require('express');
 
jest.mock('../../../controllers/itemMenuController', () => ({
  createItemMenu: jest.fn((req, res) => res.status(201).json({ message: 'Item criado' })),
  updateItemMenu: jest.fn((req, res) => res.status(200).json({ message: 'Item atualizado' })),
  deleteItemMenu: jest.fn((req, res) => res.status(200).json({ message: 'Item deletado' })),
  getAllItensMenu: jest.fn((req, res) => res.status(200).json([{ nome: 'Item 1' }])),
  getItemMenuById: jest.fn((req, res) => res.status(200).json({ id: req.params.id })),
  getItensByRestaurante: jest.fn((req, res) => res.status(200).json([{ restauranteId: req.params.restauranteId }])),
}));
 
// Mock do middleware de autenticação para simplesmente seguir para a próxima função
jest.mock('../../../middleware/authMiddleware', () => (req, res, next) => next());
 
// Mock do multer para ignorar upload real
jest.mock('multer', () => {
  const multer = () => ({
    single: () => (req, res, next) => {
      req.file = { filename: 'fakeimage.jpg' }; // Mock do arquivo enviado
      next();
    },
  });
  multer.diskStorage = () => {}; // mock vazio para diskStorage
  return multer;
});
 
const itemMenuRoutes = require('../../../routes/itemMenuRoutes');
 
describe('Rotas de ItemMenu', () => {
  let app;
 
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/itemmenu', itemMenuRoutes);
  });
 
  test('POST /itemmenu - criar item', async () => {
    const res = await request(app)
      .post('/itemmenu')
      .attach('imagem', Buffer.from('fake image content'), 'image.jpg'); // simula upload
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Item criado');
  });
 
  test('PUT /itemmenu/:id - atualizar item', async () => {
    const res = await request(app)
      .put('/itemmenu/123')
      .attach('imagem', Buffer.from('fake image content'), 'image.jpg');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Item atualizado');
  });
 
  test('DELETE /itemmenu/:id - deletar item', async () => {
    const res = await request(app).delete('/itemmenu/123');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Item deletado');
  });
 
  test('GET /itemmenu - listar todos', async () => {
    const res = await request(app).get('/itemmenu');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
 
  test('GET /itemmenu/:id - buscar por ID', async () => {
    const res = await request(app).get('/itemmenu/123');
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe('123');
  });
 
  test('GET /itemmenu/item/:restauranteId - buscar por restaurante', async () => {
    const res = await request(app).get('/itemmenu/item/999');
    expect(res.statusCode).toBe(200);
    expect(res.body[0].restauranteId).toBe('999');
  });
});