// backend/config/db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/organisa.db');


// Promisifica funções do SQLite
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

// Carrega schema.sql automaticamente
const fs = require('fs');
const path = require('path');
const schemaPath = path.join(__dirname, '../database/schema.sql');


const schema = fs.readFileSync(schemaPath, 'utf8');

db.exec(schema, (err) => {
  if (err) {
    console.error('Erro ao aplicar schema:', err);
  } else {
    console.log('📦 Banco de dados pronto!');
  }
});

module.exports = { db, run, get, all };

