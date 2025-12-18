// backend/models/Receita.js
const { all, get, run } = require('../config/db');

const Receita = {

  // =========================
  // LISTAR RECEITAS DO USUÁRIO
  // =========================
  getAll(usuario_id) {
    return all(
      'SELECT * FROM receitas WHERE usuario_id = ? ORDER BY data DESC, id DESC',
      [usuario_id]
    );
  },

  // =========================
  // BUSCAR RECEITA POR ID (DO USUÁRIO)
  // =========================
  getByIdAndUser(id, usuarioId) {
    return get(
      `SELECT *
         FROM receitas
        WHERE id = ? AND usuario_id = ?`,
      [id, usuarioId]
    );
  },

  // =========================
  // BUSCAR RECEITA POR ID (GENÉRICO - USO INTERNO)
  // =========================
  getById(id) {
    return get(
      'SELECT * FROM receitas WHERE id = ?',
      [id]
    );
  },

  // =========================
  // CRIAR RECEITA (VINCULADA AO USUÁRIO)
  // =========================
  async create({ usuario_id, descricao, valor, data, categoria }) {
    const result = await run(
      `INSERT INTO receitas (usuario_id, valor, data, categoria, descricao)
       VALUES (?, ?, ?, ?, ?)`,
      [
        usuario_id,
        valor,
        data,
        categoria,
        descricao || null
      ]
    );

    return this.getById(result.id);
  },

  // =========================
  // ATUALIZAR RECEITA (SOMENTE DONO)
  // =========================
  async updateByUser(id, usuarioId, { descricao, valor, data, categoria }) {
    const result = await run(
      `UPDATE receitas
          SET valor = ?, data = ?, categoria = ?, descricao = ?
        WHERE id = ? AND usuario_id = ?`,
      [
        valor,
        data,
        categoria,
        descricao || null,
        id,
        usuarioId
      ]
    );

    if (result.changes === 0) return null;

    return this.getByIdAndUser(id, usuarioId);
  },

  // =========================
  // REMOVER RECEITA (SOMENTE DONO)
  // =========================
  async removeByUser(id, usuarioId) {
    const result = await run(
      'DELETE FROM receitas WHERE id = ? AND usuario_id = ?',
      [id, usuarioId]
    );

    return result.changes > 0;
  }
};

module.exports = Receita;
