require('dotenv').config();
const { Sequelize } = require('sequelize');


// Usando DATABASE_URL do .env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: false, // Desativa os logs SQL no terminal
  dialectOptions: {
    // necessário em alguns casos (SSL, etc.)
  }
});

sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados foi bem-sucedida!');
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });

module.exports = sequelize;

