// backend/server.js
const express = require('express');
const cors = require('cors');  // Para permitir requisições do front-end

const app = express();
const port = 5000;

// Middlewares
app.use(cors());
app.use(express.json());  // Para interpretar o corpo das requisições como JSON

// Rota simples para testar
app.get('/', (req, res) => {
  res.send('Servidor Express funcionando!');
});

// Rota de API
app.get('/api', (req, res) => {
  res.json({ message: 'API de exemplo do Express funcionando!' });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
