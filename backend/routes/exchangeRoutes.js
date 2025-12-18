const express = require("express");
const axios = require("axios");

const router = express.Router();

// API oficial do Banco Central
const BCB_API = "https://api.bcb.gov.br/dados/serie/bcdata.sgs";

router.get("/", async (req, res) => {
  try {
    // Busca último valor do dólar
    const usd = await axios.get(
      `${BCB_API}.1/dados/ultimos/1?formato=json`
    );

    // Busca último valor do euro
    const eur = await axios.get(
      `${BCB_API}.21619/dados/ultimos/1?formato=json`
    );

    res.json({
      USD_BRL: Number(usd.data[0].valor),
      EUR_BRL: Number(eur.data[0].valor),
      date: usd.data[0].data
    });
  } catch (error) {
    console.error("Erro câmbio:", error.message);
    res.status(500).json({ error: "Erro ao buscar câmbio" });
  }
});

module.exports = router;
