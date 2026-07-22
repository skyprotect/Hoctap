const path = require('path');
const sqlite3 = require(path.join(__dirname, 'node_modules', 'sqlite3')).verbose();
const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

db.all("SELECT * FROM student_progress", [], (err, rows) => {
  if (err) return console.error(err);
  rows.forEach(r => {
    console.log("Row keys:", Object.keys(r));
    const studentId = r.student_id || r.studentId || r.id;
    console.log(`=== STUDENT ID: ${studentId} ===`);
    try {
      const data = JSON.parse(r.state_json);
      console.log("Keys in state_json:", Object.keys(data));
      const jsonStr = JSON.stringify(data);
      if (jsonStr.includes("293003")) {
        console.log(`FOUND 293003 for student: ${studentId}`);
      }
      for (const k of Object.keys(data)) {
        if (typeof data[k] === 'object' && data[k] !== null) {
          const subStr = JSON.stringify(data[k]);
          if (subStr.includes("293003") || subStr.includes("token") || subStr.includes("card") || subStr.includes("code")) {
            console.log(`Key ${k} contains token/card/code info`);
          }
        }
      }
    } catch (e) {
      console.error("JSON parse error:", e);
    }
  });
});
