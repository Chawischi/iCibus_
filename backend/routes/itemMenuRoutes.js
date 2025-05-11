// routes/itemMenuRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  createItemMenu,
  updateItemMenu,
  getAllItensMenu,
  getItemMenuById,
  deleteItemMenu,
} = require('../controllers/itemMenuController');

const authenticateToken = require('../middleware/authenticate'); // Middleware JWT

// Configuração do multer para uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Rotas protegidas por autenticação
router.post('/', authenticateToken, upload.single('imagem'), createItemMenu);
router.put('/:id', authenticateToken, upload.single('imagem'), updateItemMenu);
router.delete('/:id', authenticateToken, deleteItemMenu);

// Rotas públicas
router.get('/', getAllItensMenu);
router.get('/:id', getItemMenuById);

module.exports = router;
