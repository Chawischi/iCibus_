const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/db.js');
const User = require('./models/User.js');
const authRoutes = require('./routes/authRoutes.js');
const restaurantRoutes = require('./routes/restaurantRoutes.js'); // <-- ADICIONADO

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads'))); // Serve imagens

// Rotas
app.use('/auth', authRoutes);
app.use('/restaurants', restaurantRoutes); // <-- ADICIONADO

// Sincronização com o banco
sequelize.sync({ force: false })
  .then(() => {
    console.log('Banco sincronizado');
  })
  .catch(err => console.error('Erro ao sincronizar o banco:', err));

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
