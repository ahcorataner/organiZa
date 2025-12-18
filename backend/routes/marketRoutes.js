const express = require("express");
const axios = require("axios");
const router = express.Router();
const marketController = require("../controllers/marketController");

// ============================
// CONFIG
// ============================
const API_KEY = process.env.ALPHA_VANTAGE_KEY;

// ============================
// 💱 CÂMBIO ATUAL (USD / EUR)
// ============================
router.get("/exchange", async (req, res) => {
  try {
    const usdRes = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: "CURRENCY_EXCHANGE_RATE",
        from_currency: "USD",
        to_currency: "BRL",
        apikey: API_KEY
      }
    });

    const eurRes = await axios.get("https://www.alphavantage.co/query", {
      params: {
        function: "CURRENCY_EXCHANGE_RATE",
        from_currency: "EUR",
        to_currency: "BRL",
        apikey: API_KEY
      }
    });

    const USD_BRL = Number(
      usdRes.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
    );

    const EUR_BRL = Number(
      eurRes.data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
    );

    res.json({
      USD_BRL,
      EUR_BRL,
      date: new Date().toLocaleDateString("pt-BR")
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
