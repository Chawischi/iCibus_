const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Imagem = sequelize.define('Imagem', {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4,
      primaryKey: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('categoria', 'restaurante', 'itemMenu'),
      allowNull: false
    },
    referenciaId: {
      type: DataTypes.UUID, // ID da categoria/restaurante/itemMenu relacionado
      allowNull: false
    }
  });

  return Imagem;
};
