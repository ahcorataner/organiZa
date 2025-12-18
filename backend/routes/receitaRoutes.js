// backend/routes/receitaRoutes.js

const express = require('express');
const router = express.Router();

const receitaController = require('../controllers/receitaController');
const authMiddleware = require('../middleware/authMiddleware');

// 🔐 Protege todas as rotas de receitas
router.use(authMiddleware);

// /api/receitas
router.get('/', receitaController.listar);
router.get('/:id', receitaController.obterPorId);
router.post('/', receitaController.criar);
router.put('/:id', receitaController.atualizar);
router.delete('/:id', receitaController.remover);

module.exports = router;

