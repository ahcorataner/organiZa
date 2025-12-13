// backend/routes/contaRoutes.js
const express = require('express');
const router = express.Router();
const contaController = require('../controllers/contaController');

// /api/contas
router.get('/', contaController.listar);
router.get('/:id', contaController.obterPorId);
router.post('/', contaController.criar);
router.put('/:id', contaController.atualizar);
router.delete('/:id', contaController.remover);

module.exports = router;
