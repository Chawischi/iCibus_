const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
  const Restaurante = sequelize.define('Restaurante', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoria: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      allowNull: false,
      defaultValue: []
    }
  });

  return Restaurante;
};
