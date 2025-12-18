const { run, get } = require("../config/db");

// =======================
// CRIAR USUÁRIO
// =======================
async function criarUsuario({ nome, email, senha }) {
  return run(
    "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
    [nome, email, senha]
  );
}

// =======================
// BUSCAR POR EMAIL
// =======================
async function buscarPorEmail(email) {
  return get(
    "SELECT * FROM usuarios WHERE email = ?",
    [email]
  );
}

// =======================
// BUSCAR POR ID (JWT / CHANGE PASSWORD)
// =======================
async function buscarPorId(id) {
  return get(
    "SELECT * FROM usuarios WHERE id = ?",
    [id]
  );
}

// =======================
// SALVAR TOKEN DE RESET
// =======================
async function salvarResetToken(email, token, expires) {
  return run(
    "UPDATE usuarios SET reset_token = ?, reset_expires = ? WHERE email = ?",
    [token, expires, email]
  );
}

// =======================
// BUSCAR USUÁRIO PELO TOKEN (RESET)
// =======================
async function buscarPorResetToken(token) {
  return get(
    "SELECT * FROM usuarios WHERE reset_token = ? AND reset_expires > ?",
    [token, Date.now()]
  );
}

// =======================
// ATUALIZAR SENHA
// =======================
async function atualizarSenha(id, senhaHash) {
  return run(
    "UPDATE usuarios SET senha = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
    [senhaHash, id]
  );
}

module.exports = {
  criarUsuario,
  buscarPorEmail,
  buscarPorId,
  salvarResetToken,
  buscarPorResetToken,
  atualizarSenha
};
