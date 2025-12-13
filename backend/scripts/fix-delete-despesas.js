const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("organisa.db");

// Remove TODAS as despesas temporariamente para limpar a tabela
db.run("DELETE FROM despesas", [], function(err) {
  if (err) {
    console.error("Erro ao apagar despesas:", err);
  } else {
    console.log("✔ Todas as despesas foram apagadas. Tabela limpa!");
  }
  db.close();
});
