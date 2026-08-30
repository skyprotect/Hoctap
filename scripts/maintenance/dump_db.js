const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(path.resolve(__dirname, '../../database.db'));

db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
  if (err) return console.error(err);
  tables.forEach(t => {
    db.all(`SELECT * FROM ${t.name}`, [], (err, rows) => {
      console.log(`=== TABLE: ${t.name} (${rows ? rows.length : 0} rows) ===`);
      if (rows && rows.length > 0) {
        rows.forEach((r, idx) => {
          console.log(`--- Row ${idx + 1} ---`);
          console.log(JSON.stringify(r, null, 2));
        });
      }
    });
  });
});
