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

const authenticateToken = require('../middlewares/authMiddleware'); // Seu middleware JWT

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
router.get('/categorias', getAllCategories);
router.get('/categorias/:id', getCategoryById);

// Rotas protegidas
router.post('/categorias', authenticateToken, upload.single('imagem'), createCategory);
router.put('/categorias/:id', authenticateToken, upload.single('imagem'), updateCategory);
router.delete('/categorias/:id', authenticateToken, deleteCategory);

module.exports = router;
