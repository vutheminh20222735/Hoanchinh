const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../todo.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Loi ket noi database:', err.message);
  } else {
    console.log('Ket noi SQLite thanh cong');
  }
});

db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    priority TEXT DEFAULT 'medium',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`, (err) => {
  if (err) {
    console.error('Loi tao bang:', err.message);
  } else {
    console.log('Bang todos da san sang');
  }
});

module.exports = db;