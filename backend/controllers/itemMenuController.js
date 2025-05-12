// controllers/itemMenuController.js
const { ItemMenu } = require('../models/ItemMenu');
const slugify = require('slugify');
const path = require('path');
const fs = require('fs');

const createItemMenu = async (req, res) => {
  try {
    const { nome, preco, descricao, restauranteId } = req.body;
    const imagem = req.file ? req.file.filename : null;

    const slug = slugify(nome, { lower: true, strict: true });

    const item = await ItemMenu.create({
      nome,
      slug,
      preco,
      descricao,
      imagem,
      restauranteId,
    });

    res.status(201).json(item);
  } catch (err) {
    console.error('Erro ao criar item do menu:', err);
    res.status(500).json({ error: 'Erro ao criar item do menu' });
  }
};

const updateItemMenu = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await ItemMenu.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Item não encontrado' });

    const { nome, preco, descricao, restauranteId } = req.body;

    if (req.file && item.imagem) {
      const imagePath = path.join(__dirname, '..', 'uploads', item.imagem);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const updatedSlug = nome ? slugify(nome, { lower: true, strict: true }) : item.slug;

    await item.update({
      nome: nome || item.nome,
      slug: updatedSlug,
      preco: preco || item.preco,
      descricao: descricao || item.descricao,
      restauranteId: restauranteId || item.restauranteId,
      imagem: req.file ? req.file.filename : item.imagem,
    });

    res.json(item);
  } catch (err) {
    console.error('Erro ao atualizar item do menu:', err);
    res.status(500).json({ error: 'Erro ao atualizar item do menu' });
  }
};

const getAllItensMenu = async (req, res) => {
  try {
    const itens = await ItemMenu.findAll();
    res.json(itens);
  } catch (err) {
    console.error('Erro ao buscar itens do menu:', err);
    res.status(500).json({ error: 'Erro ao buscar itens do menu' });
  }
};

const getItemMenuById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await ItemMenu.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Item não encontrado' });
    res.json(item);
  } catch (err) {
    console.error('Erro ao buscar item do menu:', err);
    res.status(500).json({ error: 'Erro ao buscar item do menu' });
  }
};

const deleteItemMenu = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await ItemMenu.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Item não encontrado' });

    if (item.imagem) {
      const imagePath = path.join(__dirname, '..', 'uploads', item.imagem);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await item.destroy();
    res.json({ message: 'Item deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar item do menu:', err);
    res.status(500).json({ error: 'Erro ao deletar item do menu' });
  }
};

module.exports = {
  createItemMenu,
  updateItemMenu,
  getAllItensMenu,
  getItemMenuById,
  deleteItemMenu,
};
