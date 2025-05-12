const express = require('express');
const router = express.Router();
const restauranteController = require('../controllers/restaurantController.js');
const upload = require('../config/uploadConfig');
const authenticate = require('../middleware/authMiddleware.js'); // Middleware JWT

// Criar restaurante (com imagem e autenticação)
router.post('/', authenticate, upload.single('imagem'), restauranteController.createRestaurante);

// Editar restaurante (com imagem e autenticação)
router.put('/:id', authenticate, upload.single('imagem'), restauranteController.updateRestaurante);''

// Deletar restaurante (com autenticação)
router.delete('/:id', authenticate, restauranteController.deleteRestaurante);

// Buscar todos os restaurantes (público)
router.get('/', restauranteController.getAllRestaurantes);

// Buscar restaurante por ID (público)
router.get('/:id', restauranteController.getRestauranteById);

module.exports = router;
