// models/ItemMenu.js
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const ItemMenu = sequelize.define('ItemMenu', {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    preco: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    descricao: {
      type: DataTypes.TEXT
    },
    imagem: {
      type: DataTypes.STRING
    }
  });

  ItemMenu.associate = (models) => {
    ItemMenu.belongsTo(models.Restaurante, { foreignKey: 'restauranteId' });
  };

  return ItemMenu;
};
