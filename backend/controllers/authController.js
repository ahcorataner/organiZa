// backend/controllers/authController.js
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

// REGISTER
async function register(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Dados obrigatórios ausentes' });
    }

    const hash = await bcrypt.hash(senha, 10);

    await Usuario.criarUsuario({
      nome,
      email,
      senha: hash
    });

    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Usuário já existe' });
  }
}

// LOGIN
async function login(req, res) {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const ok = await bcrypt.compare(senha, usuario.senha);
    if (!ok) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    res.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      perfil_financeiro: usuario.perfil_financeiro,
      idioma: usuario.idioma,
      tema: usuario.tema
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

module.exports = {
  register,
  login
};
