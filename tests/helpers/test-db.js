/**
 * TEST DATABASE HELPER
 * Khởi tạo CSDL SQLite in-memory hoặc tạm thời độc lập phục vụ kiểm thử tích hợp (Integration Tests)
 */
const sqlite3 = require('sqlite3').verbose();

function createTestDatabase() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(':memory:', (err) => {
            if (err) return reject(err);
            
            db.serialize(() => {
                db.run("PRAGMA journal_mode=WAL;");
                
                db.run(`
                    CREATE TABLE IF NOT EXISTS settings (
                        key TEXT PRIMARY KEY,
                        value TEXT
                    )
                `);

                db.run(`
                    CREATE TABLE IF NOT EXISTS progress (
                        class_level TEXT PRIMARY KEY,
                        state_json TEXT
                    )
                `);

                db.run(`
                    CREATE TABLE IF NOT EXISTS student_progress (
                        student_id TEXT PRIMARY KEY,
                        state_json TEXT
                    )
                `);

                db.run(`
                    CREATE TABLE IF NOT EXISTS custom_vocabulary (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        student_id TEXT NOT NULL,
                        word TEXT NOT NULL,
                        translation TEXT NOT NULL,
                        phonetics TEXT,
                        type TEXT,
                        example_sentence TEXT,
                        example_translation TEXT,
                        topic_id TEXT,
                        status TEXT DEFAULT 'learning',
                        box_level INTEGER DEFAULT 1,
                        last_reviewed DATETIME,
                        next_review_due DATETIME,
                        review_count INTEGER DEFAULT 0,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `);

                db.run(`
                    CREATE TABLE IF NOT EXISTS custom_topics (
                        id TEXT PRIMARY KEY,
                        student_id TEXT NOT NULL,
                        title TEXT NOT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )
                `);

                db.run(`
                    CREATE TABLE IF NOT EXISTS tablet_tokens (
                        token TEXT PRIMARY KEY,
                        student_id TEXT,
                        minutes INTEGER,
                        status TEXT,
                        created_at TEXT,
                        activated_at TEXT,
                        expires_at TEXT
                    )
                `);

                const sampleConfig = {
                    parentName: "Phụ huynh",
                    parentPin: "123456",
                    studentName: "Trần Bình Minh",
                    currentClass: "6",
                    defaultStudentId: "std_htsj4gbmo",
                    students: [
                        { id: "std_htsj4gbmo", name: "Trần Bình Minh", classLevel: "6" },
                        { id: "std_baongoc", name: "Trần Bảo Ngọc", classLevel: "1" },
                        { id: "std_tyc0gfnkz", name: "Trần Đức Phúc", classLevel: "4" }
                    ]
                };

                db.run("INSERT INTO settings (key, value) VALUES ('config', ?)", [JSON.stringify(sampleConfig)]);

                const sampleState = {
                    student: "Trần Bình Minh",
                    classLevel: "6",
                    xp: 1500,
                    streak: 5,
                    scores: { "bai-1": 100 }
                };
                db.run("INSERT INTO student_progress (student_id, state_json) VALUES ('std_htsj4gbmo', ?)", [JSON.stringify(sampleState)], (seedErr) => {
                    if (seedErr) return reject(seedErr);
                    resolve(db);
                });
            });
        });
    });
}

module.exports = {
    createTestDatabase
};
