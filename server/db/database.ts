/**
 * DATABASE ACCESS LAYER (DAL)
 * Kết nối CSDL SQLite cục bộ duy nhất theo Singleton DatabasePool và cung cấp các hàm DAO
 */
import path from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3';
import { Student, SystemConfig, StudentProgress } from '../types';

const sqlite = sqlite3.verbose();
export const DB_PATH = path.resolve(__dirname, '../../database.db');

export class DatabasePool {
    private static instance: sqlite3.Database | null = null;

    static getInstance(): sqlite3.Database {
        if (!DatabasePool.instance) {
            DatabasePool.instance = new sqlite.Database(DB_PATH, (err: Error | null) => {
                if (err) {
                    console.error('❌ Lỗi kết nối CSDL SQLite:', err.message);
                } else {
                    console.log('📦 Đã kết nối thành công CSDL SQLite tại:', DB_PATH);
                    createTables().catch(e => console.warn('createTables warning:', e.message));
                }
            });
            DatabasePool.instance.configure('busyTimeout', 10000);
        }
        return DatabasePool.instance;
    }

    static close(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!DatabasePool.instance) return resolve();
            DatabasePool.instance.close((err: Error | null) => {
                DatabasePool.instance = null;
                err ? reject(err) : resolve();
            });
        });
    }

    static resetInstance(newDb: sqlite3.Database): void {
        DatabasePool.instance = newDb;
    }
}

export const db: sqlite3.Database = DatabasePool.getInstance();

// Helper xác định cấp lớp chuẩn xác của học sinh từ studentId
export function resolveStudentClassLevel(studentId: string | undefined, reqClassLevel?: string | number): string {
    if (studentId === 'std_tyc0gfnkz') return '4';
    if (studentId === 'std_htsj4gbmo') return '6';
    if (studentId === 'std_baongoc') return '1';
    if (reqClassLevel && ['1', '4', '6'].includes(String(reqClassLevel))) {
        return String(reqClassLevel);
    }
    return '6';
}

// Danh sách 3 học sinh chuẩn hóa cố định toàn hệ thống theo Quy tắc 14
export const SYSTEM_STUDENTS: Student[] = [
    { id: "std_htsj4gbmo", name: "Trần Bình Minh", classLevel: "6" },
    { id: "std_baongoc", name: "Trần Bảo Ngọc", classLevel: "1" },
    { id: "std_tyc0gfnkz", name: "Trần Đức Phúc", classLevel: "4" }
];

// Helper chạy query Promise
export function dbRun(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
    return new Promise((resolve, reject) => {
        DatabasePool.getInstance().run(sql, params, function (this: sqlite3.RunResult, err: Error | null) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

export function dbAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
        DatabasePool.getInstance().all(sql, params, (err: Error | null, rows: T[]) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

export function dbGet<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
        DatabasePool.getInstance().get(sql, params, (err: Error | null, row: T) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

export const runQuery = dbRun;
export const getQuery = dbGet;
export const allQuery = dbAll;

export function dbGetConfig(): Promise<SystemConfig | null> {
    return new Promise((resolve, reject) => {
        DatabasePool.getInstance().get("SELECT value FROM settings WHERE key = 'config'", (err: Error | null, row: any) => {
            if (err) return reject(err);
            if (row && row.value) {
                try {
                    resolve(JSON.parse(row.value));
                } catch (e) {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    });
}

export function dbSaveConfig(configObj: SystemConfig): Promise<number> {
    return new Promise((resolve, reject) => {
        DatabasePool.getInstance().run(
            "INSERT OR REPLACE INTO settings (key, value) VALUES ('config', ?)",
            [JSON.stringify(configObj)],
            function (this: sqlite3.RunResult, err: Error | null) {
                if (err) return reject(err);
                resolve(this.changes);
            }
        );
    });
}

export function dbGetSetting(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
        DatabasePool.getInstance().get("SELECT value FROM settings WHERE key = ?", [key], (err: Error | null, row: any) => {
            if (err) return reject(err);
            if (row && row.value) {
                try {
                    resolve(JSON.parse(row.value));
                } catch (e) {
                    resolve(row.value);
                }
            } else {
                resolve(null);
            }
        });
    });
}

export function dbSaveSetting(key: string, valueObj: any): Promise<number> {
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
        DatabasePool.getInstance().run(
            "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
            [key, val],
            function (this: sqlite3.RunResult, err: Error | null) {
                if (err) return reject(err);
                resolve(this.changes);
            }
        );
    });
}

export function dbGetProgress(classLevel: string): Promise<any> {
    return new Promise((resolve, reject) => {
        DatabasePool.getInstance().get("SELECT state_json FROM progress WHERE class_level = ?", [classLevel], (err: Error | null, row: any) => {
            if (err) return reject(err);
            if (row && row.state_json) {
                try {
                    resolve(JSON.parse(row.state_json));
                } catch (e) {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    });
}

export function dbSaveProgress(classLevel: string, stateObj: any): Promise<number> {
    return new Promise((resolve, reject) => {
        DatabasePool.getInstance().run(
            "INSERT OR REPLACE INTO progress (class_level, state_json) VALUES (?, ?)",
            [classLevel, JSON.stringify(stateObj)],
            function (this: sqlite3.RunResult, err: Error | null) {
                if (err) return reject(err);
                resolve(this.changes);
            }
        );
    });
}

export function dbGetStudentProgress(studentId: string): Promise<StudentProgress | null> {
    return new Promise((resolve, reject) => {
        DatabasePool.getInstance().get("SELECT state_json FROM student_progress WHERE student_id = ?", [studentId], (err: Error | null, row: any) => {
            if (err) return reject(err);
            if (row && row.state_json) {
                try {
                    resolve(JSON.parse(row.state_json));
                } catch (e) {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    });
}

export async function dbSaveStudentProgress(studentId: string, stateObj: any, studentName: string | null = null): Promise<sqlite3.RunResult> {
    const jsonStr = JSON.stringify(stateObj);
    const changes = await runQuery(
        "INSERT INTO student_progress (student_id, state_json) VALUES (?, ?) " +
        "ON CONFLICT(student_id) DO UPDATE SET state_json = excluded.state_json",
        [studentId, jsonStr]
    );
    return changes;
}

export function dbDeleteStudentProgress(studentId: string): Promise<number> {
    return new Promise((resolve, reject) => {
        DatabasePool.getInstance().run(
            "DELETE FROM student_progress WHERE student_id = ?",
            [studentId],
            function (this: sqlite3.RunResult, err: Error | null) {
                if (err) return reject(err);
                resolve(this.changes);
            }
        );
    });
}

export async function dbSaveExamSessionRecord(studentId: string, subject: string, session: any): Promise<sqlite3.RunResult> {
    const answersJson = JSON.stringify(session.questions || []);
    return runQuery(
        "INSERT INTO exam_sessions (student_id, lesson_id, subject, score_percent, total_questions, is_audited, answers_json, created_at) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
            studentId,
            session.lessonId || 'unknown',
            subject || 'math',
            session.scorePercent || session.score || 0,
            (session.questions ? session.questions.length : 0),
            session.isAudited ? 1 : 0,
            answersJson,
            session.completedAt || new Date().toISOString()
        ]
    );
}

export async function dbGetExamSessionRecords(studentId: string, subject?: string): Promise<any[]> {
    if (subject) {
        return allQuery("SELECT * FROM exam_sessions WHERE student_id = ? AND subject = ? ORDER BY created_at DESC", [studentId, subject]);
    }
    return allQuery("SELECT * FROM exam_sessions WHERE student_id = ? ORDER BY created_at DESC", [studentId]);
}

export async function addToSyncQueue(tableName: string, recordId: string, action: string, payload: any): Promise<void> {
    try {
        await runQuery(
            "INSERT INTO sync_queue (table_name, record_id, action, payload) VALUES (?, ?, ?, ?)",
            [tableName, recordId, action, payload ? JSON.stringify(payload) : null]
        );
        console.log(`📥 Đã thêm tác vụ sync [${action} -> ${tableName}:${recordId}] vào hàng đợi offline`);
    } catch (err: any) {
        console.error("❌ Lỗi thêm vào sync_queue:", err);
    }
}

export function createTables(): Promise<void> {
    return new Promise((resolve, reject) => {
        const poolDb = DatabasePool.getInstance();
        poolDb.serialize(() => {
            poolDb.run("PRAGMA journal_mode=WAL;");
            
            // Bảng settings lưu cấu hình chung
            poolDb.run(`
                CREATE TABLE IF NOT EXISTS settings (
                    key TEXT PRIMARY KEY,
                    value TEXT
                )
            `);
            
            // Bảng progress lưu tiến trình học tập của từng lớp
            poolDb.run(`
                CREATE TABLE IF NOT EXISTS progress (
                    class_level TEXT PRIMARY KEY,
                    state_json TEXT
                )
            `);

            // Bảng student_progress lưu tiến trình học tập của từng học sinh độc lập
            poolDb.run(`
                CREATE TABLE IF NOT EXISTS student_progress (
                    student_id TEXT PRIMARY KEY,
                    state_json TEXT
                )
            `);
            poolDb.run(`CREATE INDEX IF NOT EXISTS idx_student_progress_id ON student_progress(student_id);`);

            // Bảng custom_vocabulary lưu từ vựng tự nạp để ôn tập
            poolDb.run(`
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
            poolDb.run(`
                CREATE TABLE IF NOT EXISTS custom_topics (
                    id TEXT PRIMARY KEY,
                    student_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);

            // Bảng sync_queue lưu hàng đợi đồng bộ khi offline
            poolDb.run(`
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
            poolDb.run(`
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

            // Bảng exam_sessions lưu trữ lịch sử làm bài thi độc lập (M03)
            poolDb.run(`
                CREATE TABLE IF NOT EXISTS exam_sessions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    student_id TEXT NOT NULL,
                    lesson_id TEXT NOT NULL,
                    subject TEXT NOT NULL DEFAULT 'math',
                    score_percent REAL,
                    total_questions INTEGER,
                    time_spent INTEGER,
                    is_audited INTEGER DEFAULT 0,
                    answers_json TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (student_id) REFERENCES student_progress(student_id)
                )
            `);
            poolDb.run(`CREATE INDEX IF NOT EXISTS idx_exam_sessions_student ON exam_sessions(student_id);`, async (err: Error | null) => {
                if (err) {
                    console.error("Lỗi khi tạo các bảng DB:", err);
                    return reject(err);
                }

                // Tự động nạp sẵn và chuẩn hóa cấu hình mặc định 3 học sinh trong CSDL SQLite
                try {
                    const row: any = await getQuery("SELECT value FROM settings WHERE key = 'config'").catch(() => null);
                    let currentConfig: any = null;
                    if (row && row.value) {
                        try { currentConfig = JSON.parse(row.value); } catch (e) {}
                    }

                    const defaultStudents: Student[] = [
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
                            const initialState: StudentProgress = {
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

export function initIntegrityCheck(): Promise<void> {
    return new Promise((resolve) => {
        const poolDb = DatabasePool.getInstance();
        poolDb.serialize(() => {
            poolDb.get("PRAGMA integrity_check;", (err: Error | null, row: any) => {
                if (err) {
                    console.error("Lỗi truy vấn PRAGMA integrity_check:", err);
                    return resolve();
                }
                if (row && row.integrity_check !== 'ok') {
                    console.error(`❌ PHÁT HIỆN CƠ SỞ DỮ LIỆU BỊ HỎNG (Integrity Check: ${row.integrity_check})!`);
                    poolDb.close((closeErr: Error | null) => {
                        if (closeErr) {
                            console.error("Không thể đóng database hỏng:", closeErr);
                            return resolve();
                        }
                        try {
                            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                            const backupPath = path.join(path.dirname(DB_PATH), `database_corrupted_${timestamp}.db`);
                            fs.renameSync(DB_PATH, backupPath);
                            console.log(`Đã đổi tên CSDL hỏng thành: ${backupPath}`);
                            
                            const newDb = new sqlite.Database(DB_PATH);
                            newDb.configure("busyTimeout", 10000);
                            DatabasePool.resetInstance(newDb);
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
