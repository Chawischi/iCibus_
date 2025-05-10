const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const { v4: uuidv4 } = require('uuid');  // Importando o gerador de UUIDv4

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,  // Tipo UUID
    defaultValue: uuidv4,  // Valor padrão será um UUIDv4 gerado
    primaryKey: true,      // A chave primária
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users', // nome da tabela no banco
  timestamps: true,   // cria createdAt e updatedAt
});

module.exports = User;