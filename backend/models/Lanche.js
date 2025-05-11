const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Caminho correto para o seu arquivo de configuração

const Lanche = sequelize.define('Lanche', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  preco: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  restauranteId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Restaurantes',
      key: 'id',
    },
  },
}, {
  timestamps: true,  // Se você quiser adicionar data de criação e atualização automaticamente
});

module.exports = Lanche;
