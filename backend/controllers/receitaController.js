// backend/controllers/receitaController.js
const Receita = require('../models/Receita');

// =============================
// LISTAR RECEITAS DO USUÁRIO
// =============================
exports.listar = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;

    const receitas = await Receita.getAll(usuarioId);
    res.json(receitas);
  } catch (err) {
    console.error('❌ ERRO AO LISTAR RECEITAS:', err);
    res.status(500).json({ error: 'Erro ao listar receitas.' });
  }
};

// =============================
// OBTER RECEITA POR ID (DO USUÁRIO)
// =============================
exports.obterPorId = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const id = req.params.id;

    const receita = await Receita.getByIdAndUser(id, usuarioId);

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
// CRIAR RECEITA (VINCULA USUÁRIO)
// =============================
exports.criar = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const { descricao, valor, data, categoria } = req.body;

    if (!descricao || !valor || !data || !categoria) {
      return res.status(400).json({
        error: 'Campos obrigatórios: descricao, valor, data, categoria.'
      });
    }

    const nova = await Receita.create({
      usuario_id: usuarioId,
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
// ATUALIZAR RECEITA (SOMENTE DONO)
// =============================
exports.atualizar = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const id = req.params.id;
    const { descricao, valor, data, categoria } = req.body;

    if (!descricao || !valor || !data || !categoria) {
      return res.status(400).json({
        error: 'Campos obrigatórios: descricao, valor, data, categoria.'
      });
    }

    const atualizada = await Receita.updateByUser(id, usuarioId, {
      descricao,
      valor,
      data,
      categoria
    });

    if (!atualizada) {
      return res.status(404).json({ error: 'Receita não encontrada.' });
    }

    res.json(atualizada);
  } catch (err) {
    console.error('❌ ERRO AO ATUALIZAR RECEITA:', err);
    res.status(500).json({ error: 'Erro ao atualizar receita.' });
  }
};

// =============================
// REMOVER RECEITA (SOMENTE DONO)
// =============================
exports.remover = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const id = req.params.id;

    const ok = await Receita.removeByUser(id, usuarioId);

    if (!ok) {
      return res.status(404).json({ error: 'Receita não encontrada.' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('❌ ERRO AO REMOVER RECEITA:', err);
    res.status(500).json({ error: 'Erro ao remover receita.' });
  }
};
