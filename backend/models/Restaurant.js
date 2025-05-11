const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const { v4: uuidv4 } = require('uuid');

const Restaurant = sequelize.define('Restaurant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT, // Para mais informações sobre o restaurante
  },
  image: {
    type: DataTypes.STRING,  // URL da imagem (pode ser o caminho para a imagem armazenada)
  },
}, {
  tableName: 'restaurants',
  timestamps: true,
});

module.exports = Restaurant;
