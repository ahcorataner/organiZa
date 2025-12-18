// backend/controllers/despesaController.js
const Despesa = require('../models/Despesa');

// =========================
// LISTAR DESPESAS DO USUÁRIO
// =========================
exports.listar = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;

    const despesas = await Despesa.getAll(usuarioId);

    res.json(
      despesas.map(d => ({
        ...d,
        destaque: d.valor >= 1000
      }))
    );
  } catch (err) {
    console.error('❌ ERRO AO LISTAR DESPESAS:', err);
    res.status(500).json({ error: 'Erro ao listar despesas.' });
  }
};

// =========================
// BUSCAR DESPESA POR ID (DO USUÁRIO)
// =========================
exports.obterPorId = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const id = req.params.id;

    const despesa = await Despesa.getByIdAndUser(id, usuarioId);

    if (!despesa) {
      return res.status(404).json({ error: 'Despesa não encontrada.' });
    }

    res.json({
      ...despesa,
      destaque: despesa.valor >= 1000
    });
  } catch (err) {
    console.error('❌ ERRO AO OBTER DESPESA:', err);
    res.status(500).json({ error: 'Erro ao obter despesa.' });
  }
};

// =========================
// CRIAR DESPESA (VINCULADA AO USUÁRIO)
// =========================
exports.criar = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const { descricao, valor, data, categoria } = req.body;

    if (!valor || !data || !categoria) {
      return res.status(400).json({
        error: 'Campos obrigatórios: valor, data, categoria.'
      });
    }

    const novaDespesa = await Despesa.create({
      usuario_id: usuarioId,
      valor,
      data,
      categoria,
      descricao
    });

    res.status(201).json({
      ...novaDespesa,
      destaque: novaDespesa.valor >= 1000
    });
  } catch (err) {
    console.error('❌ ERRO AO CRIAR DESPESA:', err);
    res.status(500).json({ error: 'Erro ao criar despesa.' });
  }
};

// =========================
// ATUALIZAR DESPESA (SOMENTE DONO)
// =========================
exports.atualizar = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const id = req.params.id;
    const { descricao, valor, data, categoria } = req.body;

    if (!valor || !data || !categoria) {
      return res.status(400).json({
        error: 'Campos obrigatórios: valor, data, categoria.'
      });
    }

    const despesaAtualizada = await Despesa.updateByUser(id, usuarioId, {
      valor,
      data,
      categoria,
      descricao
    });

    if (!despesaAtualizada) {
      return res.status(404).json({ error: 'Despesa não encontrada.' });
    }

    res.json({
      ...despesaAtualizada,
      destaque: despesaAtualizada.valor >= 1000
    });
  } catch (err) {
    console.error('❌ ERRO AO ATUALIZAR DESPESA:', err);
    res.status(500).json({ error: 'Erro ao atualizar despesa.' });
  }
};

// =========================
// REMOVER DESPESA (SOMENTE DONO)
// =========================
exports.remover = async (req, res) => {
  try {
    const usuarioId = req.usuarioId;
    const id = req.params.id;

    const ok = await Despesa.removeByUser(id, usuarioId);

    if (!ok) {
      return res.status(404).json({ error: 'Despesa não encontrada.' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('❌ ERRO AO REMOVER DESPESA:', err);
    res.status(500).json({ error: 'Erro ao remover despesa.' });
  }
};
