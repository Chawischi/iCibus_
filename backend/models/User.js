const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js');
const { v4: uuidv4 } = require('uuid');  // Importando o gerador de UUIDv4

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
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
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user', // Padrão para novos usuários
  },
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;
