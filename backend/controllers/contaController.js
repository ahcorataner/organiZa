// backend/controllers/contaController.js
const Conta = require('../models/Conta');

exports.listar = async (req, res) => {
  try {
    const contas = await Conta.getAll();
    res.json(contas);
  } catch (err) {
    console.error("❌ Erro ao listar contas:", err);
    res.status(500).json({ error: "Erro ao listar contas." });
  }
};

exports.obterPorId = async (req, res) => {
  try {
    const conta = await Conta.getById(req.params.id);

    if (!conta) {
      return res.status(404).json({ error: "Conta não encontrada." });
    }

    res.json(conta);

  } catch (err) {
    console.error("❌ Erro ao obter conta:", err);
    res.status(500).json({ error: "Erro ao obter conta." });
  }
};

exports.criar = async (req, res) => {
  console.log("📥 Recebido no POST /contas:", req.body);

  try {
    const { usuario_id, nome, banco, tipo, saldo } = req.body;

    if (!usuario_id) {
      return res.status(400).json({ error: "usuario_id é obrigatório!" });
    }
    if (!nome) {
      return res.status(400).json({ error: "nome é obrigatório!" });
    }

    const novaConta = await Conta.create({
      usuario_id,
      nome,
      banco,
      tipo,
      saldo
    });

    res.status(201).json(novaConta);

  } catch (err) {
    console.error("❌ Erro ao criar conta:", err);
    res.status(500).json({ error: "Erro ao criar conta." });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const id = req.params.id;
    const existente = await Conta.getById(id);

    if (!existente) {
      return res.status(404).json({ error: "Conta não encontrada." });
    }

    const { usuario_id, nome, banco, tipo, saldo } = req.body;

    if (!usuario_id || !nome) {
      return res.status(400).json({
        error: "Campos obrigatórios: usuario_id e nome."
      });
    }

    const atualizada = await Conta.update(id, {
      usuario_id,
      nome,
      banco,
      tipo,
      saldo
    });

    res.json(atualizada);

  } catch (err) {
    console.error("❌ Erro ao atualizar conta:", err);
    res.status(500).json({ error: "Erro ao atualizar conta." });
  }
};

exports.remover = async (req, res) => {
  try {
    const ok = await Conta.remove(req.params.id);

    if (!ok) {
      return res.status(404).json({ error: "Conta não encontrada." });
    }

    res.status(204).send();

  } catch (err) {
    console.error("❌ Erro ao remover conta:", err);
    res.status(500).json({ error: "Erro ao remover conta." });
  }
};
