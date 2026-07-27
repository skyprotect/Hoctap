const path = require('path');
const sqlite3 = require(path.join(__dirname, 'node_modules', 'sqlite3')).verbose();
const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

const students = ['std_htsj4gbmo', 'std_tyc0gfnkz'];

db.serialize(() => {
    students.forEach(studentId => {
        db.get("SELECT state_json FROM student_progress WHERE student_id = ?", [studentId], (err, row) => {
            if (err) return console.error(err);
            if (!row) {
                console.log("Not found student:", studentId);
                return;
            }
            try {
                const state = JSON.parse(row.state_json);
                const goldBadges = state.goldBadges || [];
                const goldSkills = state.goldSkills || [];
                
                if (goldBadges.length > 0 || goldSkills.length > 0) {
                    if (!state.cardExchangeHistory) state.cardExchangeHistory = [];
                    
                    if (goldBadges.length > 0) {
                        state.cardExchangeHistory.push({
                            type: "gold_badge",
                            count: goldBadges.length,
                            device: "pc",
                            timestamp: Date.now(),
                            cardIds: [...goldBadges]
                        });
                        console.log(`Student ${studentId}: Exchanged ${goldBadges.length} gold badges`);
                        state.goldBadges = [];
                    }
                    
                    if (goldSkills.length > 0) {
                        state.cardExchangeHistory.push({
                            type: "gold_card", // or whatever the name is
                            count: goldSkills.length,
                            device: "pc",
                            timestamp: Date.now(),
                            cardIds: [...goldSkills]
                        });
                        console.log(`Student ${studentId}: Exchanged ${goldSkills.length} gold skills`);
                        state.goldSkills = [];
                    }
                    
                    const newJson = JSON.stringify(state);
                    db.run("UPDATE student_progress SET state_json = ? WHERE student_id = ?", [newJson, studentId], (err2) => {
                        if (err2) console.error("Error updating:", err2);
                        else console.log(`Successfully updated gold cards for ${studentId}`);
                    });
                } else {
                    console.log(`Student ${studentId} has no gold cards to exchange.`);
                }
            } catch (e) {
                console.error("Parse error for", studentId, e);
            }
        });
    });
});
