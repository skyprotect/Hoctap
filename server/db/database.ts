/**
 * DATABASE ACCESS LAYER (DAL)
 * Kết nối CSDL SQLite cục bộ duy nhất theo Singleton DatabasePool và cung cấp các hàm DAO
 */
import path from 'path';
import sqlite3 from 'sqlite3';
import { Student, SystemConfig, StudentProgress } from '../types';
import { initializeSchema } from './schema';
import { seedDefaultData, SYSTEM_STUDENTS } from './seed';

export { SYSTEM_STUDENTS };

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

export function dbGetSetting(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
        DatabasePool.getInstance().get("SELECT value FROM settings WHERE key = ?", [key], (err: Error | null, row: any) => {
            if (err) return reject(err);
            resolve(row ? row.value : null);
        });
    });
}

export function dbSaveSetting(key: string, valueObj: any): Promise<number> {
    let val: string;
    if (typeof valueObj === 'string') {
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

export interface StudentProgressWithRevision {
    state: StudentProgress | null;
    revision: number;
}

export function dbGetStudentProgressWithRevision(studentId: string): Promise<StudentProgressWithRevision | null> {
    return new Promise((resolve, reject) => {
        DatabasePool.getInstance().get(
            "SELECT state_json, revision FROM student_progress WHERE student_id = ?",
            [studentId],
            (err: Error | null, row: any) => {
                if (err) return reject(err);
                if (!row) return resolve(null);
                let state: any = null;
                if (row.state_json) {
                    try {
                        state = JSON.parse(row.state_json);
                    } catch (e) {
                        state = null;
                    }
                }
                const rev = typeof row.revision === 'number' ? row.revision : 1;
                resolve({ state, revision: rev });
            }
        );
    });
}

export function dbGetStudentProgress(studentId: string): Promise<StudentProgress | null> {
    return new Promise((resolve, reject) => {
        DatabasePool.getInstance().get("SELECT state_json, revision FROM student_progress WHERE student_id = ?", [studentId], (err: Error | null, row: any) => {
            if (err) return reject(err);
            if (row && row.state_json) {
                try {
                    const parsed = JSON.parse(row.state_json);
                    if (parsed && typeof parsed === 'object') {
                        parsed._revision = typeof row.revision === 'number' ? row.revision : 1;
                    }
                    resolve(parsed);
                } catch (e) {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    });
}

export interface OCCSaveResult {
    success: boolean;
    conflict?: boolean;
    newRevision?: number;
    currentRevision?: number;
}

export async function dbSaveStudentProgressOCC(
    studentId: string,
    stateObj: any,
    baseRevision?: number | null
): Promise<OCCSaveResult> {
    const jsonStr = JSON.stringify(stateObj);
    const existing: any = await getQuery("SELECT revision FROM student_progress WHERE student_id = ?", [studentId]);

    // Trường hợp 1: Hàng chưa tồn tại (First save / Insert ban đầu)
    if (!existing) {
        await runQuery(
            "INSERT INTO student_progress (student_id, state_json, revision) VALUES (?, ?, 1)",
            [studentId, jsonStr]
        );
        return { success: true, newRevision: 1 };
    }

    const currentRevision = typeof existing.revision === 'number' ? existing.revision : 1;

    // Trường hợp 2: Hàng đã tồn tại nhưng client không gửi baseRevision (Legacy row / Legacy client)
    if (baseRevision === undefined || baseRevision === null) {
        const updateRes = await runQuery(
            "UPDATE student_progress SET state_json = ?, revision = revision + 1 WHERE student_id = ? AND revision = ?",
            [jsonStr, studentId, currentRevision]
        );
        if (updateRes.changes === 1) {
            return { success: true, newRevision: currentRevision + 1 };
        } else {
            const recheck: any = await getQuery("SELECT revision FROM student_progress WHERE student_id = ?", [studentId]);
            return { success: false, conflict: true, currentRevision: recheck ? recheck.revision : currentRevision };
        }
    }

    // Trường hợp 3: Client gửi baseRevision
    // Nếu baseRevision khác currentRevision -> Xung đột ngay, KHÔNG sửa DB
    if (baseRevision !== currentRevision) {
        return { success: false, conflict: true, currentRevision };
    }

    // Thực hiện CONDITIONAL WRITE tại CSDL
    const updateRes = await runQuery(
        "UPDATE student_progress SET state_json = ?, revision = revision + 1 WHERE student_id = ? AND revision = ?",
        [jsonStr, studentId, baseRevision]
    );

    if (updateRes.changes === 1) {
        return { success: true, newRevision: baseRevision + 1 };
    } else {
        // affected rows === 0 -> Có một transaction khác đã tăng revision trước đó
        const recheck: any = await getQuery("SELECT revision FROM student_progress WHERE student_id = ?", [studentId]);
        const latestRev = recheck && typeof recheck.revision === 'number' ? recheck.revision : currentRevision;
        return { success: false, conflict: true, currentRevision: latestRev };
    }
}

export async function dbSaveStudentProgress(studentId: string, stateObj: any, studentName: string | null = null): Promise<sqlite3.RunResult> {
    const jsonStr = JSON.stringify(stateObj);
    const changes = await runQuery(
        "INSERT INTO student_progress (student_id, state_json, revision) VALUES (?, ?, 1) " +
        "ON CONFLICT(student_id) DO UPDATE SET state_json = excluded.state_json, revision = student_progress.revision + 1",
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

export async function createTables(): Promise<void> {
    const poolDb = DatabasePool.getInstance();
    await initializeSchema(poolDb);
    await seedDefaultData(dbGet, dbRun);
}

export const initIntegrityCheck = createTables;

