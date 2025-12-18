const express = require("express");
const axios = require("axios");
const router = express.Router();

// ============================
// CONFIG
// ============================
const API_KEY = process.env.ALPHA_VANTAGE_KEY;

// 🔍 debug (pode deixar)
console.log("API KEY:", API_KEY);

// ============================
// Função utilitária para esperar
// ============================
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================
// 📈 MERCADO DE AÇÕES (7 DIAS)
// ============================
router.get("/stocks", async (req, res) => {
  try {
    const symbols = [
      "AAPL",
      "PETR4.SA",
      "VALE3.SA",
      "ITUB4.SA"
    ];

    const results = {};

    for (const symbol of symbols) {
      // respeita limite de 1 requisição/segundo
      await delay(1000);

      const { data } = await axios.get(
        "https://www.alphavantage.co/query",
        {
          params: {
            function: "TIME_SERIES_DAILY",
            symbol,
            apikey: API_KEY
          }
        }
      );

      const series = data["Time Series (Daily)"];
      if (!series) {
        console.error("Erro série ações:", data);
        continue;
      }

      results[symbol] = Object.entries(series)
        .slice(0, 7)
        .reverse()
        .map(([date, v]) => ({
          date,
          close: Number(v["4. close"])
        }));
    }

    res.json(results);

  } catch (e) {
    console.error("Erro mercado:", e.message);
    res.status(500).json({ error: "Erro ao buscar mercado" });
  }
});

// ============================
// 💱 CÂMBIO SEMANAL (USD / EUR)
// ============================
router.get("/exchange/week", async (req, res) => {
  try {
    // ===== USD -> BRL =====
    const usdRes = await axios.get(
      "https://www.alphavantage.co/query",
      {
        params: {
          function: "FX_DAILY",
          from_symbol: "USD",
          to_symbol: "BRL",
          apikey: API_KEY
        }
      }
    );

    const usdSeries = usdRes.data["Time Series FX (Daily)"];
    if (!usdSeries) {
      console.error("Erro USD:", usdRes.data);
      throw new Error("Erro FX USD");
    }

    const USD = Object.entries(usdSeries)
      .slice(0, 7)
      .reverse()
      .map(([date, v]) => ({
        date,
        value: Number(v["4. close"])
      }));

    // espera 1 segundo antes da próxima chamada
    await delay(1000);

    // ===== EUR -> BRL =====
    const eurRes = await axios.get(
      "https://www.alphavantage.co/query",
      {
        params: {
          function: "FX_DAILY",
          from_symbol: "EUR",
          to_symbol: "BRL",
          apikey: API_KEY
        }
      }
    );

    const eurSeries = eurRes.data["Time Series FX (Daily)"];
    if (!eurSeries) {
      console.error("Erro EUR:", eurRes.data);
      throw new Error("Erro FX EUR");
    }

    const EUR = Object.entries(eurSeries)
      .slice(0, 7)
      .reverse()
      .map(([date, v]) => ({
        date,
        value: Number(v["4. close"])
      }));

    res.json({ USD, EUR });

  } catch (e) {
    console.error("Erro câmbio semanal:", e.message);
    res.status(500).json({ error: "Erro ao buscar câmbio semanal" });
  }
});

module.exports = router;
