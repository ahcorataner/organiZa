// backend/controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");
const crypto = require("crypto");
const { sendResetEmail } = require("../services/mailer");


const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES = "1d"; // token válido por 1 dia

// =======================
// REGISTER
// =======================
async function register(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ error: "Dados obrigatórios ausentes" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await Usuario.criarUsuario({
      nome,
      email,
      senha: senhaHash
    });

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso"
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: "Usuário já existe ou erro ao cadastrar"
    });
  }
}

// =======================
// LOGIN
// =======================
async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const senhaOk = await bcrypt.compare(senha, usuario.senha);
    if (!senhaOk) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    // 🔐 GERA TOKEN JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES }
    );

    // 🚀 RETORNA TOKEN + USUÁRIO (SEM SENHA)
    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil_financeiro: usuario.perfil_financeiro,
        idioma: usuario.idioma,
        tema: usuario.tema
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
}
// =======================
// FORGOT PASSWORD
// =======================
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email é obrigatório" });
    }

    const usuario = await Usuario.buscarPorEmail(email);

    // 🔒 Segurança: resposta genérica
    if (!usuario) {
      return res.json({
        message: "Se o email existir, enviaremos instruções."
      });
    }

    // 🔑 Gera token seguro
    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 1000 * 60 * 30; // 30 minutos

    // 💾 Salva token e expiração no banco
    await Usuario.salvarResetToken(usuario.email, token, expires);

    // 🔗 Link de recuperação (front)
    const resetLink = `http://127.0.0.1:5500/frontend/reset.html?token=${token}`;


    // 📧 ENVIA EMAIL
    await sendResetEmail(usuario.email, resetLink);

    return res.json({
      message: "Se o email existir, enviaremos instruções."
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao processar recuperação" });
  }
}
// =======================
// RESET PASSWORD (via token)
// =======================
async function resetPassword(req, res) {
  try {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha) {
      return res.status(400).json({ error: "Dados obrigatórios ausentes" });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({ error: "Senha muito curta" });
    }

    const usuario = await Usuario.buscarPorResetToken(token);

    if (!usuario) {
      return res.status(400).json({ error: "Token inválido" });
    }

    if (Date.now() > usuario.reset_expires) {
      return res.status(400).json({ error: "Token expirado" });
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    await Usuario.atualizarSenha(usuario.id, novaSenhaHash);

    return res.json({ message: "Senha redefinida com sucesso" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao redefinir senha" });
  }
}

// =======================
// CHANGE PASSWORD
// =======================
async function changePassword(req, res) {
  try {
    const { senhaAtual, novaSenha } = req.body;
    const usuarioId = req.usuarioId; // vem do authMiddleware

    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ error: "Dados obrigatórios ausentes" });
    }

    const usuario = await Usuario.buscarPorId(usuarioId);
    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const senhaOk = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaOk) {
      return res.status(401).json({ error: "Senha atual incorreta" });
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    await Usuario.atualizarSenha(usuarioId, novaSenhaHash);

    return res.json({ message: "Senha alterada com sucesso" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao alterar senha" });
  }
}


module.exports = {
  register,
  login,
  changePassword,
  forgotPassword,
  resetPassword
};


