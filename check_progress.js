const path = require('path');
const sqlite3 = require(path.join(__dirname, 'node_modules', 'sqlite3')).verbose();
const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

db.all("SELECT * FROM student_progress", [], (err, rows) => {
  if (err) return console.error(err);
  console.log("student_progress rows count:", rows.length);
  rows.forEach(r => {
    console.log("ID:", r.id || r.student_id);
    const jsonStr = r.state_json || r.data || "";
    if (jsonStr.includes("293003")) {
      console.log("FOUND 293003 in student_progress for ID:", r.id || r.student_id);
    }
  });
});
