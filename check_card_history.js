const path = require('path');
const sqlite3 = require(path.join(__dirname, 'node_modules', 'sqlite3')).verbose();
const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

db.all("SELECT * FROM student_progress", [], (err, rows) => {
  if (err) return console.error(err);
  rows.forEach(r => {
    const studentId = r.student_id;
    try {
      const data = JSON.parse(r.state_json);
      console.log(`\n========================================`);
      console.log(`STUDENT ID: ${studentId}`);
      if (data.cardExchangeHistory) {
        console.log(`cardExchangeHistory for ${studentId}:`);
        console.log(JSON.stringify(data.cardExchangeHistory, null, 2));
      } else {
        console.log(`No cardExchangeHistory for ${studentId}`);
      }
    } catch (e) {
      console.error(e);
    }
  });
});
