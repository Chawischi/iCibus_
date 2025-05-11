const Restaurant = require('../models/Restaurant');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Gera token JWT para o restaurante (já feito na etapa anterior)
const generateToken = (restaurantId) => {
  return jwt.sign({ id: restaurantId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

// Controlador para criar restaurante
const createRestaurant = async (req, res) => {
  const { name, address, description } = req.body;
  const userId = req.userId;  // Aqui assume-se que o id do usuário está no token (verificado no middleware)

  try {
    // Verifica se a imagem foi enviada
    if (!req.file) {
      return res.status(400).json({ message: 'Imagem do restaurante é obrigatória.' });
    }

    // Caminho da imagem (armazenada no servidor ou cloud, dependendo da configuração)
    const imagePath = path.join('uploads', req.file.filename);

    // Criação do restaurante
    const newRestaurant = await Restaurant.create({
      name,
      address,
      description,
      image: imagePath,
      userId,  // Associa o restaurante ao usuário
    });

    res.status(201).json({
      message: 'Restaurante criado com sucesso!',
      restaurant: {
        id: newRestaurant.id,
        name: newRestaurant.name,
        address: newRestaurant.address,
        description: newRestaurant.description,
        image: imagePath,  // Envia o caminho da imagem
      },
    });
  } catch (error) {
    console.error('Erro ao criar restaurante:', error);
    res.status(500).json({ message: 'Erro ao criar restaurante.' });
  }
};

module.exports = {
  createRestaurant,
};
