const { Restaurante, Categoria } = require('../models');
const slugify = require('slugify');

// Criar restaurante
const createRestaurante = async (req, res) => {
  const { nome, sobreNos, horario, categoriaId } = req.body;
  const imagem = req.file ? req.file.filename : null;

  try {
    const slug = slugify(nome, { lower: true });

    const restaurante = await Restaurante.create({
      nome,
      slug,
      sobreNos,
      horario,
      imagem,
      categoriaId
    });

    res.status(201).json(restaurante);
  } catch (err) {
    console.error('Erro ao criar restaurante:', err);
    res.status(500).json({ error: 'Erro ao criar restaurante' });
  }
};

// Buscar todos os restaurantes
const getAllRestaurantes = async (req, res) => {
  try {
    const restaurantes = await Restaurante.findAll({ include: Categoria });
    res.json(restaurantes);
  } catch (err) {
    console.error('Erro ao buscar restaurantes:', err);
    res.status(500).json({ error: 'Erro ao buscar restaurantes' });
  }
};

// Buscar restaurante por ID
const getRestauranteById = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurante = await Restaurante.findByPk(id, { include: Categoria });
    if (!restaurante) return res.status(404).json({ error: 'Restaurante não encontrado' });
    res.json(restaurante);
  } catch (err) {
    console.error('Erro ao buscar restaurante:', err);
    res.status(500).json({ error: 'Erro ao buscar restaurante' });
  }
};

// Atualizar restaurante
const updateRestaurante = async (req, res) => {
  const { id } = req.params;
  const { nome, sobreNos, horario, categoriaId } = req.body;
  const imagem = req.file ? req.file.filename : null;

  try {
    const restaurante = await Restaurante.findByPk(id);
    if (!restaurante) return res.status(404).json({ error: 'Restaurante não encontrado' });

    if (nome) {
      restaurante.nome = nome;
      restaurante.slug = slugify(nome, { lower: true });
    }
    if (sobreNos) restaurante.sobreNos = sobreNos;
    if (horario) restaurante.horario = horario;
    if (categoriaId) restaurante.categoriaId = categoriaId;
    if (imagem) restaurante.imagem = imagem;

    await restaurante.save();
    res.json(restaurante);
  } catch (err) {
    console.error('Erro ao atualizar restaurante:', err);
    res.status(500).json({ error: 'Erro ao atualizar restaurante' });
  }
};

// Deletar restaurante
const deleteRestaurante = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurante = await Restaurante.findByPk(id);
    if (!restaurante) return res.status(404).json({ error: 'Restaurante não encontrado' });

    await restaurante.destroy();
    res.json({ message: 'Restaurante deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar restaurante:', err);
    res.status(500).json({ error: 'Erro ao deletar restaurante' });
  }
};

module.exports = {
  createRestaurante,
  getAllRestaurantes,
  getRestauranteById,
  updateRestaurante,
  deleteRestaurante
};
