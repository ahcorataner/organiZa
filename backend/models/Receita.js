// backend/models/Receita.js
const { all, get, run } = require('../config/db');

const Receita = {

  // =========================
  // LISTAR TODAS AS RECEITAS
  // =========================
  getAll() {
    return all(
      'SELECT * FROM receitas ORDER BY data DESC, id DESC'
    );
  },

  // =========================
  // BUSCAR RECEITA POR ID
  // =========================
  getById(id) {
    return get(
      'SELECT * FROM receitas WHERE id = ?',
      [id]
    );
  },

  // =========================
  // CRIAR RECEITA
  // =========================
  async create({ descricao, valor, data, categoria }) {
    const result = await run(
      `INSERT INTO receitas (usuario_id, valor, data, categoria, descricao)
       VALUES (?, ?, ?, ?, ?)`,
      [
        1,                // usuario_id fixo (Entrega 2)
        valor,
        data,
        categoria,
        descricao || null
      ]
    );

    return this.getById(result.id);
  },

  // =========================
  // ATUALIZAR RECEITA  ✅
  // =========================
  async update(id, { descricao, valor, data, categoria }) {
    await run(
      `UPDATE receitas
         SET valor = ?, data = ?, categoria = ?, descricao = ?
       WHERE id = ?`,
      [
        valor,
        data,
        categoria,
        descricao || null,
        id
      ]
    );

    return this.getById(id);
  },

  // =========================
  // REMOVER RECEITA
  // =========================
  async remove(id) {
    const result = await run(
      'DELETE FROM receitas WHERE id = ?',
      [id]
    );
    return result.changes > 0;
  }
};

module.exports = Receita;
