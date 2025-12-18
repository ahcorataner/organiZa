const express = require("express");
const axios = require("axios");
const router = express.Router();
const marketController = require("../controllers/marketController");

// ============================
// CONFIG
// ============================
const API_KEY = process.env.ALPHA_VANTAGE_KEY;

// ============================
// 💱 CÂMBIO (USD / EUR) – FALLBACK ESTÁVEL
// ============================
router.get("/exchange", async (req, res) => {
  try {
    // 👉 valores simulados realistas (podem ser explicados)
    const USD_BRL = 5.52;
    const EUR_BRL = 6.48;

    res.json({
      USD_BRL,
      EUR_BRL,
      date: new Date().toLocaleDateString("pt-BR"),
      source: "fallback"
    });

  } catch (err) {
    console.error("Erro câmbio:", err.message);
    res.status(500).json({ error: "Erro ao buscar câmbio" });
  }
});


// ============================
// 📈 MERCADO DE AÇÕES (FALLBACK ESTÁVEL)
// ============================
// 👉 NÃO usa API externa para evitar rate limit
router.get("/stocks", marketController.getStocks);

module.exports = router;
