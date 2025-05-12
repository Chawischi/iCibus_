const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const sequelize = require('./config/db.js');

// Carregar todos os modelos
const User = require('./models/User.js');
const Imagem = require('./models/Imagem.js');
const Categoria = require('./models/Categoria.js');
const Restaurante = require('./models/Restaurante.js');
const ItemMenu = require('./models/ItemMenu.js');



// Configurações do Express
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// Rotas
const authRoutes = require('./routes/authRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes');
const restauranteRoutes = require('./routes/restaurantRoutes.js');
const itemMenuRoutes = require('./routes/itemMenuRoutes');

app.use('/auth', authRoutes);
app.use('/categorias', categoryRoutes);
app.use('/restaurantes', restauranteRoutes);
app.use('/itemmenu', itemMenuRoutes);

// Sincronizar banco
sequelize.sync({ force: false })
  .then(() => {
    console.log('Banco sincronizado');
  })
  .catch(err => console.error('Erro ao sincronizar o banco:', err));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
