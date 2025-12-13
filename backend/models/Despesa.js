const { all, get, run } = require('../config/db');

const Despesa = {
  getAll() {
    return all('SELECT * FROM despesas ORDER BY data DESC, id DESC');
  },

  getById(id) {
    return get('SELECT * FROM despesas WHERE id = ?', [id]);
  },

  async create({ usuario_id, valor, data, categoria, descricao }) {
    const result = await run(
      `INSERT INTO despesas (usuario_id, valor, data, categoria, descricao)
       VALUES (?, ?, ?, ?, ?)`,
      [usuario_id, valor, data, categoria, descricao]
    );

    return this.getById(result.id);
  },

  async update(id, { usuario_id, valor, data, categoria, descricao }) {
    await run(
      `UPDATE despesas
       SET usuario_id = ?, valor = ?, data = ?, categoria = ?, descricao = ?
       WHERE id = ?`,
      [usuario_id, valor, data, categoria, descricao, id]
    );
    return this.getById(id);
  },

  async remove(id) {
    const result = await run('DELETE FROM despesas WHERE id = ?', [id]);
    return result.changes > 0;
  },
};

module.exports = Despesa;
