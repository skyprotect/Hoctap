/**
 * DATABASE ACCESS LAYER (DAL)
 * Kết nối CSDL SQLite cục bộ duy nhất và cung cấp các hàm DAO
 */
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.resolve(__dirname, '../../database.db');

// Helper xác định cấp lớp chuẩn xác của học sinh từ studentId
function resolveStudentClassLevel(studentId, reqClassLevel) {
    if (studentId === 'std_tyc0gfnkz') return '4';
    if (studentId === 'std_htsj4gbmo') return '6';
    if (studentId === 'std_baongoc') return '1';
    if (reqClassLevel && ['1', '4', '6'].includes(String(reqClassLevel))) {
        return String(reqClassLevel);
    }
    return '6';
}

// Danh sách 3 học sinh chuẩn hóa cố định toàn hệ thống theo Quy tắc 14
const SYSTEM_STUDENTS = [
    { id: "std_htsj4gbmo", name: "Trần Bình Minh", classLevel: "6" },
    { id: "std_baongoc", name: "Trần Bảo Ngọc", classLevel: "1" },
    { id: "std_tyc0gfnkz", name: "Trần Đức Phúc", classLevel: "4" }
];

let db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Lỗi kết nối CSDL SQLite:', err.message);
    } else {
        console.log('📦 Đã kết nối thành công CSDL SQLite tại:', DB_PATH);
    }
});
db.configure("busyTimeout", 10000);

// Helper chạy query Promise
function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

const runQuery = dbRun;
const getQuery = dbGet;
const allQuery = dbAll;

function dbGetConfig() {
    return new Promise((resolve, reject) => {
        db.get("SELECT value FROM settings WHERE key = 'config'", (err, row) => {
            if (err) return reject(err);
            if (row && row.value) {
                try {
                    resolve(JSON.parse(row.value));
                } catch(e) {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    });
}

function dbSaveConfig(configObj) {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT OR REPLACE INTO settings (key, value) VALUES ('config', ?)",
            [JSON.stringify(configObj)],
            function(err) {
                if (err) return reject(err);
                resolve(this.changes);
            }
        );
    });
}

function dbGetSetting(key) {
    return new Promise((resolve, reject) => {
        db.get("SELECT value FROM settings WHERE key = ?", [key], (err, row) => {
            if (err) return reject(err);
            if (row && row.value) {
                try {
                    resolve(JSON.parse(row.value));
                } catch(e) {
                    resolve(row.value);
                }
            } else {
                resolve(null);
            }
        });
    });
}

function dbSaveSetting(key, valueObj) {
    let val = valueObj;
    if (typeof valueObj === 'object' && valueObj !== null) {
        val = JSON.stringify(valueObj);
    } else if (typeof valueObj === 'string') {
        try {
            JSON.parse(valueObj);
            val = valueObj;
        } catch (e) {
            val = JSON.stringify(valueObj);
        }
    } else {
        val = JSON.stringify(valueObj);
    }

    return new Promise((resolve, reject) => {
        db.run(
            "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
            [key, val],
            function(err) {
                if (err) return reject(err);
                resolve(this.changes);
            }
        );
    });
}

function dbGetProgress(classLevel) {
    return new Promise((resolve, reject) => {
        db.get("SELECT state_json FROM progress WHERE class_level = ?", [classLevel], (err, row) => {
            if (err) return reject(err);
            if (row && row.state_json) {
                try {
                    resolve(JSON.parse(row.state_json));
                } catch(e) {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    });
}

function dbSaveProgress(classLevel, stateObj) {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT OR REPLACE INTO progress (class_level, state_json) VALUES (?, ?)",
            [classLevel, JSON.stringify(stateObj)],
            function(err) {
                if (err) return reject(err);
                resolve(this.changes);
            }
        );
    });
}

function dbGetStudentProgress(studentId) {
    return new Promise((resolve, reject) => {
        db.get("SELECT state_json FROM student_progress WHERE student_id = ?", [studentId], (err, row) => {
            if (err) return reject(err);
            if (row && row.state_json) {
                try {
                    resolve(JSON.parse(row.state_json));
                } catch(e) {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    });
}

async function dbSaveStudentProgress(studentId, stateObj, studentName = null) {
    const jsonStr = JSON.stringify(stateObj);
    const changes = await runQuery(
        "INSERT INTO student_progress (student_id, state_json) VALUES (?, ?) " +
        "ON CONFLICT(student_id) DO UPDATE SET state_json = excluded.state_json",
        [studentId, jsonStr]
    );
    return changes;
}

function dbDeleteStudentProgress(studentId) {
    return new Promise((resolve, reject) => {
        db.run(
            "DELETE FROM student_progress WHERE student_id = ?",
            [studentId],
            function(err) {
                if (err) return reject(err);
                resolve(this.changes);
            }
        );
    });
}

async function addToSyncQueue(tableName, recordId, action, payload) {
    try {
        await runQuery(
            "INSERT INTO sync_queue (table_name, record_id, action, payload) VALUES (?, ?, ?, ?)",
            [tableName, recordId, action, payload ? JSON.stringify(payload) : null]
        );
        console.log(`📥 Đã thêm tác vụ sync [${action} -> ${tableName}:${recordId}] vào hàng đợi offline`);
    } catch (err) {
        console.error("❌ Lỗi thêm vào sync_queue:", err);
    }
}

function createTables() {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run("PRAGMA journal_mode=WAL;");
            
            // Bảng settings lưu cấu hình chung
            db.run(`
                CREATE TABLE IF NOT EXISTS settings (
                    key TEXT PRIMARY KEY,
                    value TEXT
                )
            `);
            
            // Bảng progress lưu tiến trình học tập của từng lớp
            db.run(`
                CREATE TABLE IF NOT EXISTS progress (
                    class_level TEXT PRIMARY KEY,
                    state_json TEXT
                )
            `);

            // Bảng student_progress lưu tiến trình học tập của từng học sinh độc lập
            db.run(`
                CREATE TABLE IF NOT EXISTS student_progress (
                    student_id TEXT PRIMARY KEY,
                    state_json TEXT
                )
            `);
            db.run(`CREATE INDEX IF NOT EXISTS idx_student_progress_id ON student_progress(student_id);`);

            // Bảng custom_vocabulary lưu từ vựng tự nạp để ôn tập
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

            // Bảng custom_topics lưu thông tin nhóm bài học tự chọn
            db.run(`
                CREATE TABLE IF NOT EXISTS custom_topics (
                    id TEXT PRIMARY KEY,
                    student_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Bảng sync_queue lưu hàng đợi đồng bộ khi offline
            db.run(`
                CREATE TABLE IF NOT EXISTS sync_queue (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    table_name TEXT NOT NULL,
                    record_id TEXT NOT NULL,
                    action TEXT NOT NULL,
                    payload TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Bảng tablet_tokens lưu trữ mã bảo mật để chơi tablet
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
            `, async (err) => {
                if (err) {
                    console.error("Lỗi khi tạo các bảng DB:", err);
                    return reject(err);
                }

                // Tự động nạp sẵn và chuẩn hóa cấu hình mặc định 3 học sinh trong CSDL SQLite
                try {
                    const row = await getQuery("SELECT value FROM settings WHERE key = 'config'").catch(() => null);
                    let currentConfig = null;
                    if (row && row.value) {
                        try { currentConfig = JSON.parse(row.value); } catch (e) {}
                    }

                    const defaultStudents = [
                        { id: "std_htsj4gbmo", name: "Trần Bình Minh", parentName: "Phụ huynh", classLevel: "6" },
                        { id: "std_baongoc", name: "Trần Bảo Ngọc", parentName: "Phụ huynh", classLevel: "1" },
                        { id: "std_tyc0gfnkz", name: "Trần Đức Phúc", parentName: "Phụ huynh", classLevel: "4" }
                    ];

                    if (!currentConfig || !Array.isArray(currentConfig.students) || currentConfig.students.length === 0 || !currentConfig.studentName) {
                        currentConfig = {
                            parentName: (currentConfig && currentConfig.parentName) || "Phụ huynh",
                            parentPin: (currentConfig && currentConfig.parentPin) || "123456",
                            studentName: "Trần Bình Minh",
                            currentClass: "6",
                            defaultStudentId: "std_htsj4gbmo",
                            students: defaultStudents
                        };
                        await dbSaveConfig(currentConfig);
                        console.log("✅ [createTables] Đã nạp sẵn/chuẩn hóa cấu hình 3 học sinh chuẩn hóa trong CSDL SQLite.");
                    }

                    // Đảm bảo cả 3 học sinh đều có bản ghi trong bảng student_progress
                    for (const std of defaultStudents) {
                        const existing = await getQuery("SELECT student_id FROM student_progress WHERE student_id = ?", [std.id]).catch(() => null);
                        if (!existing) {
                            const initialState = {
                                student: std.name,
                                classLevel: std.classLevel,
                                xp: 0,
                                streak: 0,
                                lastActiveDate: null,
                                scores: {},
                                badges: [],
                                goldBadges: [],
                                history: [],
                                distractions: 0,
                                customVideos: {},
                                parentPin: "123456",
                                examSessions: [],
                                completedSubtopics: [],
                                subtopicScores: {},
                                completedLessonTheory: [],
                                subjects: {
                                    math: { scores: {}, completedSubtopics: [], subtopicScores: {}, completedLessonTheory: [], examSessions: [] },
                                    english: { scores: {}, completedSubtopics: [], subtopicScores: {}, completedLessonTheory: [], examSessions: [], skillScores: { listening: 0, speaking: 0, reading: 0, spelling: 0 }, weakVocabulary: [] }
                                },
                                lastUpdated: new Date().toISOString()
                            };
                            await dbSaveStudentProgress(std.id, initialState).catch(() => {});
                            console.log(`✅ [createTables] Đã khởi tạo bản ghi tiến trình rỗng cho học sinh: ${std.name} (${std.id})`);
                        }
                    }
                    resolve();
                } catch (configErr) {
                    console.error("Lỗi khởi tạo config/progress mặc định:", configErr);
                    resolve();
                }
            });
        });
    });
}

function initIntegrityCheck() {
    return new Promise((resolve) => {
        db.serialize(() => {
            db.get("PRAGMA integrity_check;", (err, row) => {
                if (err) {
                    console.error("Lỗi truy vấn PRAGMA integrity_check:", err);
                    return resolve();
                }
                if (row && row.integrity_check !== 'ok') {
                    console.error(`❌ PHÁT HIỆN CƠ SỞ DỮ LIỆU BỊ HỎNG (Integrity Check: ${row.integrity_check})!`);
                    db.close((closeErr) => {
                        if (closeErr) {
                            console.error("Không thể đóng database hỏng:", closeErr);
                            return resolve();
                        }
                        try {
                            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                            const backupPath = path.join(path.dirname(DB_PATH), `database_corrupted_${timestamp}.db`);
                            fs.renameSync(DB_PATH, backupPath);
                            console.log(`Đã đổi tên CSDL hỏng thành: ${backupPath}`);
                            
                            db = new sqlite3.Database(DB_PATH);
                            db.configure("busyTimeout", 10000);
                            createTables().then(() => {
                                console.log("Đã khởi tạo lại CSDL mới sạch sẽ thành công.");
                                resolve();
                            });
                        } catch (e) {
                            console.error("Lỗi nghiêm trọng khi cố gắng khôi phục CSDL hỏng:", e);
                            resolve();
                        }
                    });
                } else {
                    createTables().then(resolve);
                }
            });
        });
    });
}

module.exports = {
    db,
    dbRun,
    dbAll,
    dbGet,
    runQuery,
    getQuery,
    allQuery,
    dbGetConfig,
    dbSaveConfig,
    dbGetSetting,
    dbSaveSetting,
    dbGetProgress,
    dbSaveProgress,
    dbGetStudentProgress,
    dbSaveStudentProgress,
    dbDeleteStudentProgress,
    addToSyncQueue,
    createTables,
    initIntegrityCheck,
    resolveStudentClassLevel,
    SYSTEM_STUDENTS,
    DB_PATH
};
