const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const {
  createCategory,
  updateCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
} = require('../controllers/categoryController');

const authenticateToken = require('../middleware/authMiddleware.js'); // Seu middleware JWT

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

// Rotas públicas
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Rotas protegidas
router.post('/', authenticateToken, upload.single('imagem'), createCategory);
router.put('/:id', authenticateToken, upload.single('imagem'), updateCategory);
router.delete('/:id', authenticateToken, deleteCategory);

module.exports = router;
