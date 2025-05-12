const sequelize = require('../config/db');
const Categoria = require('../models/Categoria')(sequelize);
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const slugify = require('slugify');

// Criar Categoria
const createCategory = async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome || !req.file) {
      return res.status(400).json({ message: 'Nome e imagem são obrigatórios.' });
    }

    const slug = slugify(nome, { lower: true });

    const novaCategoria = await Categoria.create({
      id: uuidv4(),
      nome,
      slug,
      imagem: req.file.filename, // Armazena apenas o nome do arquivo
    });

    return res.status(201).json(novaCategoria);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return res.status(500).json({ message: 'Erro interno ao criar categoria.' });
  }
};

// Editar a categoria
// Atualizar uma categoria existente
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  const imagem = req.file ? req.file.filename : null;

  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });

    // Atualiza nome e slug se o nome foi passado
    if (nome) {
      categoria.nome = nome;
      categoria.slug = slugify(nome, { lower: true });
    }

    // Atualiza imagem se houver nova
    if (imagem) {
      categoria.imagem = imagem;
    }

    await categoria.save();
    res.json(categoria);

  } catch (err) {
    console.error('Erro ao atualizar categoria:', err);
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
};


// Pegar todas as categorias
const getAllCategories = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (err) {
    console.error('Erro ao buscar categorias:', err);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
};

// Pegar categoria por id
const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });
    res.json(categoria);
  } catch (err) {
    console.error('Erro ao buscar categoria:', err);
    res.status(500).json({ error: 'Erro ao buscar categoria' });
  }
};

// Deletar categoria por id
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await Categoria.findByPk(id);
    if (!categoria) return res.status(404).json({ error: 'Categoria não encontrada' });

    // Deletar imagem associada (opcional)
    if (categoria.imagem) {
      const imagePath = path.join(__dirname, '..', 'uploads', categoria.imagem);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await categoria.destroy();
    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar categoria:', err);
    res.status(500).json({ error: 'Erro ao deletar categoria' });
  }
};

module.exports = {
    createCategory,
    updateCategory,
    getAllCategories,
    getCategoryById,
    deleteCategory,
};
