// backend/models/Despesa.js
const { all, get, run } = require('../config/db');

const Despesa = {

  // =========================
  // LISTAR DESPESAS DO USUÁRIO
  // =========================
  getAll(usuario_id) {
    return all(
      `SELECT *
         FROM despesas
        WHERE usuario_id = ?
        ORDER BY data DESC, id DESC`,
      [usuario_id]
    );
  },

  // =========================
  // BUSCAR DESPESA POR ID (DO USUÁRIO)
  // =========================
  getByIdAndUser(id, usuario_id) {
    return get(
      `SELECT *
         FROM despesas
        WHERE id = ? AND usuario_id = ?`,
      [id, usuario_id]
    );
  },

  // =========================
  // CRIAR DESPESA (VINCULADA AO USUÁRIO)
  // =========================
  async create({ usuario_id, valor, data, categoria, descricao }) {
    const result = await run(
      `INSERT INTO despesas (usuario_id, valor, data, categoria, descricao)
       VALUES (?, ?, ?, ?, ?)`,
      [
        usuario_id,
        valor,
        data,
        categoria,
        descricao || null
      ]
    );

    return this.getByIdAndUser(result.id, usuario_id);
  },

  // =========================
  // ATUALIZAR DESPESA (SOMENTE DONO)
  // =========================
  async updateByUser(id, usuario_id, { valor, data, categoria, descricao }) {
    const result = await run(
      `UPDATE despesas
          SET valor = ?, data = ?, categoria = ?, descricao = ?
        WHERE id = ? AND usuario_id = ?`,
      [
        valor,
        data,
        categoria,
        descricao || null,
        id,
        usuario_id
      ]
    );

    if (result.changes === 0) return null;

    return this.getByIdAndUser(id, usuario_id);
  },

  // =========================
  // REMOVER DESPESA (SOMENTE DONO)
  // =========================
  async removeByUser(id, usuario_id) {
    const result = await run(
      `DELETE FROM despesas
        WHERE id = ? AND usuario_id = ?`,
      [id, usuario_id]
    );

    return result.changes > 0;
  }
};

module.exports = Despesa;
