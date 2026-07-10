const sqlite3 = require('sqlite3').verbose();
const dbPath = 'f:/KHQS/AntiGravity/HocTap/database.db';
const db = new sqlite3.Database(dbPath);

db.all("SELECT * FROM student_progress", [], (err, rows) => {
  if (err) {
    console.error(err);
    db.close();
    return;
  }
  rows.forEach(row => {
    try {
      const state = JSON.parse(row.state_json);
      console.log(`Student ID: ${row.student_id}`);
      console.log(`Keys:`, Object.keys(state));
      if (state.student) {
        console.log(`  student:`, state.student);
      }
      if (state.classLevel) {
        console.log(`  classLevel:`, state.classLevel);
      }
      // Check for any lessons progress, unlocked, history, etc.
      console.log(`  state_json details:`);
      for (const k of Object.keys(state)) {
        if (k !== 'examSessions' && k !== 'questions') {
          console.log(`    ${k}:`, typeof state[k] === 'object' ? JSON.stringify(state[k]).substring(0, 300) : state[k]);
        } else {
          console.log(`    ${k}: [Array/Object of length ${state[k] ? state[k].length : 0}]`);
        }
      }
    } catch (e) {
      console.log(`Student ID: ${row.student_id} - Error: ${e.message}`);
    }
    console.log('-----------------------------');
  });
  db.close();
});
