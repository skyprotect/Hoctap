const path = require('path');
const sqlite3 = require(path.join(__dirname, 'node_modules', 'sqlite3')).verbose();
const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

db.get("SELECT state_json FROM student_progress WHERE student_id = 'std_htsj4gbmo'", [], (err, row) => {
    if (err) return console.error(err);
    if (!row) return console.log("No data found for std_htsj4gbmo");
    
    try {
        const state = JSON.parse(row.state_json);
        
        if (state.examSessions && Array.isArray(state.examSessions)) {
            console.log("\n--- Recent Exam Sessions Summary ---");
            const recent = state.examSessions.slice(-20);
            recent.forEach((s, i) => {
                const date = new Date(s.date).toLocaleString();
                console.log(`[${i+1}] Date: ${date}, Lesson: ${s.lessonId}, Level: ${s.level}, Questions: ${s.totalQuestions}, Correct: ${s.correctCount}, Score: ${s.scorePercent}%, Time Spent: ${s.timeSpent}s`);
            });
        }

    } catch (e) {
        console.error("Parse error", e);
    }
});
