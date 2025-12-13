const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("organisa.db");

db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
  console.log("Tabelas:", rows);

  db.all("SELECT * FROM contas", [], (err2, rows2) => {
    console.log("Conteúdo da tabela contas:", err2 || rows2);
    db.close();
  });
});
