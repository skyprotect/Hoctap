const path = require('path');
const sqlite3 = require(path.join(__dirname, 'node_modules', 'sqlite3')).verbose();
const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

db.all("SELECT student_id, updated_at FROM student_progress", [], (err, rows) => {
  console.log("student_progress IDs:", rows);
});

db.all("SELECT * FROM settings", [], (err, rows) => {
  console.log("settings:", rows);
});

db.all("SELECT * FROM tablet_tokens", [], (err, rows) => {
  console.log("tablet_tokens:", rows);
});
