const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Categoria = sequelize.define('Categoria', {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      unique: true
    },
    imagem: {
      type: DataTypes.STRING 
    }
  });

  Categoria.associate = (models) => {
    Categoria.belongsToMany(models.Restaurante, {
      through: 'RestauranteCategoria',
      foreignKey: 'categoriaId',
      otherKey: 'restauranteId'
    });
  };

  return Categoria;
};
