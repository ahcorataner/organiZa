// backend/routes/despesaRoutes.js
const express = require('express');
const router = express.Router();
const despesaController = require('../controllers/despesaController');

// /api/despesas
router.get('/', despesaController.listar);
router.get('/:id', despesaController.obterPorId);
router.post('/', despesaController.criar);
router.put('/:id', despesaController.atualizar);
router.delete('/:id', despesaController.remover);

module.exports = router;
