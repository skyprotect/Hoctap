const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');
db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) console.error(err);
    else {
        rows.forEach(r => console.log(r.id, r.name, r.class, r.current_subject));
    }
});
