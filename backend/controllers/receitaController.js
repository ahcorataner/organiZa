// backend/controllers/receitaController.js
const Receita = require('../models/Receita');

// =============================
// LISTAR TODAS AS RECEITAS
// =============================
exports.listar = async (req, res) => {
  try {
    const receitas = await Receita.getAll();
    res.json(receitas);
  } catch (err) {
    console.error('❌ ERRO AO LISTAR RECEITAS:', err);
    res.status(500).json({ error: 'Erro ao listar receitas.' });
  }
};

// =============================
// OBTER RECEITA POR ID
// =============================
exports.obterPorId = async (req, res) => {
  try {
    const receita = await Receita.getById(req.params.id);

    if (!receita) {
      return res.status(404).json({ error: 'Receita não encontrada.' });
    }

    res.json(receita);
  } catch (err) {
    console.error('❌ ERRO AO OBTER RECEITA:', err);
    res.status(500).json({ error: 'Erro ao obter receita.' });
  }
};

// =============================
// CRIAR RECEITA
// =============================
exports.criar = async (req, res) => {
  try {
    const { descricao, valor, data, categoria } = req.body;

    // 🔎 VALIDAÇÃO
    if (!descricao || !valor || !data || !categoria) {
      return res.status(400).json({
        error: 'Campos obrigatórios: descricao, valor, data, categoria.'
      });
    }

    const nova = await Receita.create({
      descricao,
      valor,
      data,
      categoria
    });

    res.status(201).json(nova);
  } catch (err) {
    console.error('❌ ERRO AO CRIAR RECEITA:', err);
    res.status(500).json({ error: 'Erro ao criar receita.' });
  }
};

// =============================
// ATUALIZAR RECEITA  ✅
// =============================
exports.atualizar = async (req, res) => {
  try {
    const id = req.params.id;
    const existente = await Receita.getById(id);

    if (!existente) {
      return res.status(404).json({ error: 'Receita não encontrada.' });
    }

    const { descricao, valor, data, categoria } = req.body;

    // 🔎 VALIDAÇÃO
    if (!descricao || !valor || !data || !categoria) {
      return res.status(400).json({
        error: 'Campos obrigatórios: descricao, valor, data, categoria.'
      });
    }

    const atualizada = await Receita.update(id, {
      descricao,
      valor,
      data,
      categoria
    });

    res.json(atualizada);
  } catch (err) {
    console.error('❌ ERRO AO ATUALIZAR RECEITA:', err);
    res.status(500).json({ error: 'Erro ao atualizar receita.' });
  }
};

// =============================
// REMOVER RECEITA
// =============================
exports.remover = async (req, res) => {
  try {
    const ok = await Receita.remove(req.params.id);

    if (!ok) {
      return res.status(404).json({ error: 'Receita não encontrada.' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('❌ ERRO AO REMOVER RECEITA:', err);
    res.status(500).json({ error: 'Erro ao remover receita.' });
  }
};
