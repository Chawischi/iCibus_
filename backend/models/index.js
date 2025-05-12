const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require(path.join(__dirname, '..', 'config', 'db.js')); // pegando a instância pronta do db.js
const db = {};

// Carregamento de todos os models dinamicamente
fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file.slice(-3) === '.js' && file !== path.basename(__filename))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Definindo associações se os models tiverem o método associate
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

console.log("Models carregados:", Object.keys(db));

// Adicionando as associações manualmente (exemplo entre Restaurante e ItemMenu)
db.Restaurante.hasMany(db.ItemMenu, { foreignKey: 'restauranteId' }); // Um Restaurante tem muitos Itens do Menu
db.ItemMenu.belongsTo(db.Restaurante, { foreignKey: 'restauranteId' }); // Um Item do Menu pertence a um Restaurante

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
