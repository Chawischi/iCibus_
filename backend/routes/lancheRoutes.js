const express = require('express');
const router = express.Router();
const Lanche = require('../models/Lanche');

// Endpoint para adicionar um lanche
router.post('/add', async (req, res) => {
  const { nome, descricao, preco, restauranteId } = req.body;

  if (!nome || !preco || !restauranteId) {
    return res.status(400).json({ message: 'Nome, preço e restaurante são obrigatórios.' });
  }

  try {
    const novoLanche = await Lanche.create({
      nome,
      descricao,
      preco,
      restauranteId,
    });
    res.status(201).json(novoLanche);
  } catch (error) {
    console.error('Erro ao adicionar lanche:', error);
    res.status(500).json({ message: 'Erro ao adicionar lanche.' });
  }
});

module.exports = router;
