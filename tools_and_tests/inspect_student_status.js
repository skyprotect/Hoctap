const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// 1. Read course data
let content = fs.readFileSync('f:/KHQS/AntiGravity/HocTap/js/lessons.js', 'utf8');
content += '\nmodule.exports = { COURSE_DATA };';

const tempFilePath = path.join(__dirname, 'temp_lessons_for_node.js');
fs.writeFileSync(tempFilePath, content, 'utf8');

const { COURSE_DATA } = require(tempFilePath);
fs.unlinkSync(tempFilePath);

// 2. Fetch student state from database
const dbPath = 'f:/KHQS/AntiGravity/HocTap/database.db';
const db = new sqlite3.Database(dbPath);

const studentId = 'std_tyc0gfnkz'; // Trần Đức Phúc
db.get("SELECT state_json FROM student_progress WHERE student_id = ?", [studentId], (err, row) => {
    if (err) {
        console.error(err);
        db.close();
        return;
    }
    if (!row) {
        console.log("No student found");
        db.close();
        return;
    }
    const state = JSON.parse(row.state_json);
    console.log("Student state keys:", Object.keys(state));
    console.log("Scores:", state.scores);

    // Let's run getLessonStatus logic
    const currentClass = "4";
    const flatLessons = [];
    COURSE_DATA
        .filter(chapter => (chapter.class || "6") === currentClass)
        .forEach(chapter => {
            chapter.lessons.forEach(l => flatLessons.push(l.id));
        });

    function getLessonStatus(lessonId) {
        const idx = flatLessons.indexOf(lessonId);
        if (idx === -1) return 'locked';

        if (idx === 0) {
            const score = state.scores[lessonId] || 0;
            return score >= 80 ? 'completed' : 'active';
        }

        let currentStatus = 'completed';
        for (let i = 0; i <= idx; i++) {
            const lid = flatLessons[i];
            const score = state.scores[lid] || 0;
            if (i === 0) {
                currentStatus = score >= 80 ? 'completed' : 'active';
            } else {
                if (currentStatus === 'completed') {
                    currentStatus = score >= 80 ? 'completed' : 'active';
                } else {
                    currentStatus = 'locked';
                }
            }
            
            if (i === idx) {
                return currentStatus;
            }
        }
        return 'locked';
    }

    console.log("\nLesson status for all Class 4 lessons:");
    flatLessons.forEach(lid => {
        const status = getLessonStatus(lid);
        const score = state.scores[lid] || 0;
        console.log(`  Lesson: ${lid}, Status: ${status}, Score: ${score}%`);
    });

    db.close();
});
