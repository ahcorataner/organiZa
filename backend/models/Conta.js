// backend/models/Conta.js
const { all, get, run } = require('../config/db');

const Conta = {
  getAll() {
    return all('SELECT * FROM contas ORDER BY id DESC');
  },

  getById(id) {
    return get('SELECT * FROM contas WHERE id = ?', [id]);
  },

  async create({ usuario_id, nome, banco, tipo, saldo }) {
    const result = await run(
      `INSERT INTO contas (usuario_id, nome, banco, tipo, saldo)
       VALUES (?, ?, ?, ?, ?)`,
      [usuario_id, nome, banco || null, tipo || null, saldo || 0]
    );

    return this.getById(result.id);
  },

  async update(id, { usuario_id, nome, banco, tipo, saldo }) {
    await run(
      `UPDATE contas
       SET usuario_id = ?, nome = ?, banco = ?, tipo = ?, saldo = ?
       WHERE id = ?`,
      [usuario_id, nome, banco || null, tipo || null, saldo || 0, id]
    );

    return this.getById(id);
  },

  async remove(id) {
    const result = await run('DELETE FROM contas WHERE id = ?', [id]);
    return result.changes > 0;
  },
};

module.exports = Conta;
