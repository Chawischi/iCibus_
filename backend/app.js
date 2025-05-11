const express = require('express');
const cors = require('cors');  // Para permitir requisições do front-end
require('dotenv').config(); // Carrega variáveis do .env ou .env.local
const sequelize = require('./config/db.js');
const User = require('./models/User.js')
const authRoutes = require('./routes/authRoutes.js');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());  // Para interpretar o corpo das requisições como JSON

// Rotas
app.use('/auth', authRoutes);


sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Banco sincronizado');
  })
  .catch(err => console.error('Erro ao sincronizar o banco:', err));

// Inicia o servidor
const PORT = process.env.PORT 
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


