// backend/controllers/marketController.js

exports.getStocks = async (req, res) => {
  try {
    // Dados simulados POR ENQUANTO (já já serão reais)
    res.json({
      updatedAt: new Date(),
      stocks: [
        { symbol: "PETR4", price: 34.2 },
        { symbol: "VALE3", price: 64.1 },
        { symbol: "ITUB4", price: 29.3 },
        { symbol: "AAPL", price: 181.4 },
        { symbol: "TSLA", price: 265.8 }
      ]
    });
  } catch (err) {
    console.error("Erro mercado:", err);
    res.status(500).json({ error: "Erro ao buscar dados do mercado" });
  }
};
