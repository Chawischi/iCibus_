const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Restaurante = sequelize.define('Restaurante', {
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
    sobreNos: {
      type: DataTypes.TEXT
    },
    horario: {
      type: DataTypes.STRING
    },
    imagem: {
      type: DataTypes.STRING
    }
  });

  Restaurante.associate = (models) => {
    Restaurante.belongsTo(models.Categoria, { foreignKey: 'categoriaId' });
    Restaurante.hasMany(models.ItemMenu, { foreignKey: 'restauranteId' });
  };

  return Restaurante;
};
