const express = require('express');
const router = express.Router();

const despesaController = require('../controllers/despesaController');
const authMiddleware = require('../middleware/authMiddleware'); // 👈 AQUI

// 🔐 PROTEGE TODAS AS ROTAS
router.use(authMiddleware);

// /api/despesas
router.get('/', despesaController.listar);
router.get('/:id', despesaController.obterPorId);
router.post('/', despesaController.criar);
router.put('/:id', despesaController.atualizar);
router.delete('/:id', despesaController.remover);

module.exports = router;
