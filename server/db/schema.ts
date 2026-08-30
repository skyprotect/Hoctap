/**
 * DATABASE SCHEMA & DDL MIGRATIONS
 * Định nghĩa bảng, chỉ mục và chế độ WAL cho CSDL SQLite
 */
import sqlite3 from 'sqlite3';

export function initializeSchema(db: sqlite3.Database): Promise<void> {
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
            `);

            // Bảng exam_sessions lưu trữ lịch sử làm bài thi độc lập (M03)
            db.run(`
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
            db.run(`CREATE INDEX IF NOT EXISTS idx_exam_sessions_student ON exam_sessions(student_id);`, (err: Error | null) => {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}
