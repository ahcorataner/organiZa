// backend/models/Usuario.js
const { run, get } = require('../config/db');

async function criarUsuario({ nome, email, senha }) {
  return run(
    'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
    [nome, email, senha]
  );
}

async function buscarPorEmail(email) {
  return get(
    'SELECT * FROM usuarios WHERE email = ?',
    [email]
  );
}

module.exports = {
  criarUsuario,
  buscarPorEmail
};
