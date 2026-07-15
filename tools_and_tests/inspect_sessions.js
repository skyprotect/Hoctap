const sqlite3 = require('sqlite3').verbose();
const dbPath = 'f:/KHQS/AntiGravity/HocTap/database.db';
const db = new sqlite3.Database(dbPath);

db.get("SELECT state_json FROM student_progress WHERE student_id = 'std_htsj4gbmo'", [], (err, row) => {
    if (row) {
        const parsed = JSON.parse(row.state_json);
        console.log('examSessions type:', typeof parsed.examSessions);
        console.log('examSessions isArray:', Array.isArray(parsed.examSessions));
        if (parsed.examSessions) {
            console.log('examSessions length:', parsed.examSessions.length);
            parsed.examSessions.forEach((sess, idx) => {
                console.log(`Session ${idx}:`, sess === null ? 'NULL' : typeof sess);
                if (sess) {
                    console.log(`  lessonId:`, sess.lessonId);
                    console.log(`  questions count:`, sess.questions ? sess.questions.length : 'none');
                }
            });
        }
    }
    db.close();
});
