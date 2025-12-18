// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// =======================
// AUTH
// =======================

// 🆕 Registro de novo usuário
router.post("/register", authController.register);

// 🔑 Login
router.post("/login", authController.login);

// 📧 Esqueci minha senha (gera token e envia email)
router.post("/forgot-password", authController.forgotPassword);

// 🔁 Reset de senha (via token do email)
router.post("/reset-password", authController.resetPassword);

// 🔐 Trocar senha (usuário logado, JWT)
router.put(
  "/change-password",
  authMiddleware,
  authController.changePassword
);

module.exports = router;
