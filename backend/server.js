// backend/server.js
const express = require('express');
const cors = require('cors');

// Inicializa banco e schema
require('./config/db');

const app = express();
const PORT = 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// =======================
// IMPORTAÇÃO DAS ROTAS
// =======================
const receitaRoutes = require('./routes/receitaRoutes');
const despesaRoutes = require('./routes/despesaRoutes');
const contaRoutes = require('./routes/contaRoutes');
const authRoutes = require('./routes/authRoutes'); // 🔐 AUTENTICAÇÃO

// =======================
// REGISTRO DAS ROTAS
// =======================
app.use('/api/receitas', receitaRoutes);
app.use('/api/despesas', despesaRoutes);
app.use('/api/contas', contaRoutes);
app.use('/api/auth', authRoutes); // 🔐 LOGIN / REGISTER

// =======================
// ROTA RAIZ (TESTE)
 // =======================
app.get('/', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API ORGANI$A está rodando 🚀'
  });
});

// =======================
// START DO SERVIDOR
// =======================
app.listen(PORT, () => {
  console.log(`Servidor ORGANI$A rodando em http://localhost:${PORT}`);
});
