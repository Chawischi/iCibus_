const express = require('express');
const multer = require('multer');
const path = require('path');
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');

// Configuração do Multer para upload de imagem
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Diretório onde as imagens serão armazenadas
  },
  filename: (req, file, cb) => {
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage });

const router = express.Router();

// Rota para criar um novo restaurante (após o login do usuário)
router.post('/create', authMiddleware, upload.single('image'), restaurantController.createRestaurant);

module.exports = router;
