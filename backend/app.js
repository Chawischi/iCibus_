const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const db = require('./models');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

const authRoutes = require('./routes/authRoutes.js');
const categoryRoutes = require('./routes/categoryRoutes');
const restauranteRoutes = require('./routes/restaurantRoutes.js');
const itemMenuRoutes = require('./routes/itemMenuRoutes');

app.use('/auth', authRoutes);
app.use('/categorias', categoryRoutes);
app.use('/restaurantes', restauranteRoutes);
app.use('/itemMenu', itemMenuRoutes);

module.exports = app;  // exporta app só
