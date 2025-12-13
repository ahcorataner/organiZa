// backend/controllers/despesaController.js
const Despesa = require('../models/Despesa');

// =========================
// LISTAR TODAS
// =========================
exports.listar = async (req, res) => {
  try {
    const despesas = await Despesa.getAll();

    res.json(
      despesas.map(d => ({
        ...d,
        destaque: d.valor >= 1000
      }))
    );
  } catch (err) {
    console.error('Erro ao listar despesas:', err);
    res.status(500).json({ error: 'Erro ao listar despesas.' });
  }
};

// =========================
// BUSCAR POR ID
// =========================
exports.obterPorId = async (req, res) => {
  try {
    const despesa = await Despesa.getById(req.params.id);

    if (!despesa) {
      return res.status(404).json({ error: 'Despesa não encontrada.' });
    }

    res.json(despesa);
  } catch (err) {
    console.error('Erro ao obter despesa:', err);
    res.status(500).json({ error: 'Erro ao obter despesa.' });
  }
};

// =========================
// CREATE
// =========================
exports.criar = async (req, res) => {
  try {
    const { descricao, valor, data, categoria } = req.body;

    if (!valor || !data || !categoria) {
      return res.status(400).json({
        error: 'Campos obrigatórios: valor, data, categoria.'
      });
    }

    const novaDespesa = await Despesa.create({
      descricao,
      valor,
      data,
      categoria
    });

    res.status(201).json({
      ...novaDespesa,
      destaque: valor >= 1000
    });
  } catch (err) {
    console.error('Erro ao criar despesa:', err);
    res.status(500).json({ error: 'Erro ao criar despesa.' });
  }
};

// =========================
// UPDATE ✅
//=========================
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { descricao, valor, data, categoria } = req.body;

    const existente = await Despesa.getById(id);
    if (!existente) {
      return res.status(404).json({ error: 'Despesa não encontrada.' });
    }

    if (!valor || !data || !categoria) {
      return res.status(400).json({
        error: 'Campos obrigatórios: valor, data, categoria.'
      });
    }

    const despesaAtualizada = await Despesa.update(id, {
      descricao,
      valor,
      data,
      categoria
    });

    res.json({
      ...despesaAtualizada,
      destaque: despesaAtualizada.valor >= 1000
    });
  } catch (err) {
    console.error('Erro ao atualizar despesa:', err);
    res.status(500).json({ error: 'Erro ao atualizar despesa.' });
  }
};

// =========================
// DELETE
// =========================
exports.remover = async (req, res) => {
  try {
    const ok = await Despesa.remove(req.params.id);

    if (!ok) {
      return res.status(404).json({ error: 'Despesa não encontrada.' });
    }

    res.status(204).send();
  } catch (err) {
    console.error('Erro ao remover despesa:', err);
    res.status(500).json({ error: 'Erro ao remover despesa.' });
  }
};
