const path = require('path');
const sqlite3 = require(path.join(__dirname, 'node_modules', 'sqlite3')).verbose();

const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

console.log("Checking SQLite database at:", dbPath);

db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
  if (err) {
    console.error("Error listing tables:", err);
    return;
  }
  console.log("Tables found:", tables.map(t => t.name));

  tables.forEach(t => {
    db.all(`SELECT * FROM ${t.name}`, [], (err, rows) => {
      if (err) {
        console.error(`Error querying ${t.name}:`, err.message);
        return;
      }
      const str = JSON.stringify(rows);
      if (str.includes('293003')) {
        console.log(`\n!!! MATCH FOUND IN TABLE: ${t.name} !!!`);
        rows.forEach(r => {
          if (JSON.stringify(r).includes('293003')) {
            console.log(r);
          }
        });
      }
    });
  });
});
