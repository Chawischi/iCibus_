const sequelize = require('../config/db');
const Restaurante = require('../models/Restaurante')(sequelize);
const slugify = require('slugify');

// Criar restaurante
const createRestaurante = async (req, res) => {
  try {
    const { nome, telefone, endereco, horario, sobreNos } = req.body;

    let categorias = [];
    if (req.body['categoriaIds[]']) {
      // Se o 'categoriaIds[]' for um array de categorias
      categorias = Array.isArray(req.body['categoriaIds[]']) 
        ? req.body['categoriaIds[]']
        : [req.body['categoriaIds[]']]; // Caso contrário, converte em array
    }

    // Validar e garantir que as categorias sejam válidas
    categorias = categorias.filter(id => typeof id === 'string' && id.trim().length > 0);

    // Salvar imagem, se houver
    let imagemPath = '';
    if (req.file) {
      imagemPath = req.file.filename;
    }

    // Criar restaurante
    const restaurante = await Restaurante.create({
      nome,
      telefone,
      endereco,
      horario,
      sobreNos,
      imagem: imagemPath,
      slug: slugify(nome, { lower: true, strict: true }),
      categoriaId: categorias, // Passar o array de categorias aqui
    });

    // Retornar o restaurante criado
    res.status(201).json({ message: 'Restaurante criado com sucesso', restaurante: restaurante.toJSON() });
  } catch (err) {
    console.error('Erro ao criar restaurante:', err);
    res.status(500).json({ error: 'Erro ao criar restaurante' });
  }
};


// Buscar todos os restaurantes
const getAllRestaurantes = async (req, res) => {
  try {
    const restaurantes = await Restaurante.findAll();
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
    const restaurante = await Restaurante.findByPk(id);
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
  const { nome, sobreNos, horario, telefone, categoria } = req.body;
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
    if (telefone) restaurante.telefone = telefone;
    if (imagem) restaurante.imagem = imagem;
    if (categoria && Array.isArray(categoria)) restaurante.categoria = categoria;

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
  deleteRestaurante,
};
