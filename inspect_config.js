const sqlite3 = require('sqlite3').verbose();
const dbPath = 'f:/KHQS/AntiGravity/HocTap/database.db';
const db = new sqlite3.Database(dbPath);

db.get("SELECT value FROM settings WHERE key = 'config'", [], (err, row) => {
  if (err) {
    console.error(err);
    db.close();
    return;
  }
  if (row) {
    const config = JSON.parse(row.value);
    console.log("Full Config:", JSON.stringify(config, null, 2));
  } else {
    console.log("No config found in settings table");
  }
  db.close();
});
