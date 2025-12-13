const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("organisa.db");

const sql = `
CREATE TABLE IF NOT EXISTS contas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  usuario_id INTEGER NOT NULL,
  nome TEXT NOT NULL,
  banco TEXT,
  tipo TEXT,
  saldo REAL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
`;

db.exec(sql, (err) => {
  if (err) {
    console.error("Erro ao criar tabela contas:", err);
  } else {
    console.log("Tabela 'contas' criada com sucesso!");
  }
  db.close();
});
