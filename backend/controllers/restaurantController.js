const db = require('../models');
const { Restaurante, Categoria } = db;
const slugify = require('slugify');
const { v4: uuidv4 } = require('uuid');


const createRestaurante = async (req, res) => {
  try {
    const { nome, telefone, endereco, horario, sobreNos, categoriaIds } = req.body;

    if (!nome || !req.file) {
      return res.status(400).json({ message: 'Nome e imagem são obrigatórios.' });
    }

    const slug = slugify(nome, { lower: true });

    const restaurante = await Restaurante.create({
      id: uuidv4(),
      nome,
      telefone,
      endereco,
      horario,
      sobreNos,
      imagem: req.file.filename, // salva o nome do arquivo
      slug
    });

    // Associações com categorias
    if (categoriaIds && categoriaIds.length > 0) {
      const categorias = await Categoria.findAll({
        where: {
          id: categoriaIds
        }
      });



      await restaurante.setCategoria(categorias);
      console.log('Categorias associadas com sucesso:', categorias.map(c => c.nome));
    }

    // Retorno com categorias incluídas
    const restauranteComCategorias = await Restaurante.findOne({
      where: { id: restaurante.id },
      include: Categoria
    });

    return res.status(201).json({
      message: 'Restaurante criado com sucesso',
      restaurante: restauranteComCategorias
    });

  } catch (err) {
    console.error('Erro ao criar restaurante:', err);
    return res.status(500).json({ message: 'Erro ao criar restaurante' });
  }
};

// Buscar todos os restaurantes
const getAllRestaurantes = async (req, res) => {
  try {
    const restaurantes = await Restaurante.findAll({
      include: {
        model: Categoria,
        through: { attributes: [] },
        attributes: ['id', 'nome'],
      },
    });

    const restaurantesJSON = restaurantes.map(r =>
      typeof r.toJSON === 'function' ? r.toJSON() : r
    );

    console.log('Restaurantes buscados:', restaurantesJSON);

    res.json({ success: true, restaurantes: restaurantesJSON });
  } catch (err) {
    console.error('Erro ao buscar restaurantes:', err);
    res.status(500).json({ success: false, message: 'Erro ao buscar restaurantes', detalhes: err.message });
  }
};


// Buscar restaurante por ID
const getRestauranteById = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurante = await Restaurante.findByPk(id, {
      include: [{
        model: Categoria,
        through: { attributes: [] }  // Se for N:N
      }]
    });

    if (!restaurante) {
      console.warn('Restaurante não encontrado:', id);
      return res.status(404).json({ error: 'Restaurante não encontrado' });
    }

    console.log('Restaurante encontrado:', restaurante.toJSON());
    return res.json({
      success: true,
      restaurante
    });

  } catch (err) {
    console.error('Erro ao buscar restaurante:', err);
    res.status(500).json({ error: 'Erro ao buscar restaurante', detalhes: err.message });
  }
};
// Atualizar restaurante
const updateRestaurante = async (req, res) => {
  const { id } = req.params;
  const { nome, sobreNos, horario, telefone, endereco } = req.body;
  let categoriaIds = req.body['categoriaIds[]'];
  if (!categoriaIds) categoriaIds = [];
  if (!Array.isArray(categoriaIds)) categoriaIds = [categoriaIds];

  const imagem = req.file ? req.file.filename : null;

  try {
    const restaurante = await Restaurante.findByPk(id);
    if (!restaurante) {
      console.warn('Restaurante não encontrado para atualização:', id);
      return res.status(404).json({ error: 'Restaurante não encontrado' });
    }

    console.log('Atualizando restaurante:', restaurante.toJSON());

    if (nome) {
      restaurante.nome = nome;
      restaurante.slug = slugify(nome, { lower: true });
    }
    if (sobreNos) restaurante.sobreNos = sobreNos;
    if (horario) restaurante.horario = horario;
    if (telefone) restaurante.telefone = telefone;
    if (endereco) restaurante.endereco = endereco;
    if (imagem) restaurante.imagem = imagem;

    await restaurante.save();
    console.log('Restaurante atualizado:', restaurante.toJSON());

    // Atualizar categorias associadas
    if (categoriaIds.length > 0) {
      const categorias = await Categoria.findAll({
        where: {
          id: categoriaIds
        }
      });
      await restaurante.setCategorias(categorias); // ou setCategoria conforme seu modelo
      console.log('Categorias atualizadas:', categoriaIds);
    }

    const atualizado = await Restaurante.findByPk(id, {
      include: {
        model: Categoria,
        through: { attributes: [] },
      },
    });

    console.log('Restaurante final após atualização:', atualizado.toJSON());

    res.json(atualizado);
  } catch (err) {
    console.error('Erro ao atualizar restaurante:', err);
    res.status(500).json({ error: 'Erro ao atualizar restaurante', detalhes: err.message });
  }
};

// Deletar restaurante
const deleteRestaurante = async (req, res) => {
  const { id } = req.params;
  try {
    const restaurante = await Restaurante.findByPk(id);
    if (!restaurante) {
      console.warn('Restaurante não encontrado para deleção:', id);
      return res.status(404).json({ error: 'Restaurante não encontrado' });
    }

    await restaurante.destroy();
    console.log('Restaurante deletado:', id);

    res.json({ message: 'Restaurante deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar restaurante:', err);
    res.status(500).json({ error: 'Erro ao deletar restaurante', detalhes: err.message });
  }
};

// Buscar restaurantes pela categoria (id)
const getRestaurantsByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const restaurantes = await Restaurante.findAll({
      include: [{
        model: Categoria,
        where: { id: categoryId },
        through: { attributes: [] }
      }],
    });

    return res.json({ success: true, restaurantes });
  } catch (err) {
    console.error('Erro ao buscar restaurantes por categoria:', err);
    return res.status(500).json({ success: false, message: 'Erro ao buscar restaurantes por categoria.' });
  }
};


module.exports = {
  createRestaurante,
  getAllRestaurantes,
  getRestauranteById,
  updateRestaurante,
  deleteRestaurante,
  getRestaurantsByCategory,
};
