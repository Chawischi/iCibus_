const express = require('express');
const cors = require('cors');
const path = require('path'); // ✅ importação necessária
require('dotenv').config();
const sequelize = require('./config/db.js');
const User = require('./models/User.js');
const authRoutes = require('./routes/authRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes');
const restauranteRoutes = require('./routes/restauranteRoutes');
const itemMenuRoutes = require('./routes/itemMenuRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Deixa a pasta uploads acessível publicamente
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// Rotas
app.use('/auth', authRoutes);
app.use('/categorias', categoryRoutes);
app.use('/restaurantes', restauranteRoutes);
app.use('/itemmenu', itemMenuRoutes);

// Conexão com banco
sequelize.sync({ force: false }) 
  .then(() => {
    console.log('Banco sincronizado');
  })
  .catch(err => console.error('Erro ao sincronizar o banco:', err));

// Inicia o servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


