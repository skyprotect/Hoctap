/**
 * ZONE 1 — DATA / HYDRATION VERIFICATION PROBE
 * Truy vết đường đi: SQLite → API → AppState (đọc thụ động, không sửa dữ liệu)
 * 
 * Chạy: node tools/seam-probe/probe-data.js [studentId]
 * Mặc định: std_htsj4gbmo (Trần Bình Minh)
 */
'use strict';

const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');

const DB_PATH = path.resolve(__dirname, '../../database.db');
const STUDENT_ID = process.argv[2] || 'std_htsj4gbmo';
const PORT_FILE = path.resolve(__dirname, '../../.port.tmp');
const fs = require('fs');

function getServerPort() {
    try {
        const raw = fs.readFileSync(PORT_FILE, 'utf8').trim();
        const port = parseInt(raw, 10);
        return isNaN(port) ? null : port;
    } catch { return null; }
}

// --- Level 1: Raw DB row ---
function probeDatabase(studentId) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, err => {
            if (err) return reject(err);
        });
        db.get(
            'SELECT student_id, revision, length(state_json) as json_bytes, state_json FROM student_progress WHERE student_id = ?',
            [studentId],
            (err, row) => {
                db.close();
                if (err) return reject(err);
                if (!row) return resolve({ found: false });
                let parsed = null;
                let parseError = null;
                try { parsed = JSON.parse(row.state_json); } catch (e) { parseError = e.message; }
                resolve({
                    found: true,
                    student_id: row.student_id,
                    revision: row.revision,
                    json_bytes: row.json_bytes,
                    parsed,
                    parseError
                });
            }
        );
    });
}

// --- Level 2: API response ---
function probeApi(studentId, port) {
    return new Promise((resolve) => {
        if (!port) return resolve({ available: false, reason: 'Server port not found in .port.tmp' });
        const url = `http://localhost:${port}/api/load-progress?studentId=${studentId}`;
        http.get(url, { timeout: 3000 }, res => {
            let data = '';
            res.on('data', d => { data += d; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ available: true, statusCode: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ available: true, statusCode: res.statusCode, parseError: e.message, raw: data.slice(0, 200) });
                }
            });
        }).on('error', err => {
            resolve({ available: false, reason: err.message });
        });
    });
}

// --- Level 3: examSessions table ---
function probeExamSessions(studentId) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, err => {
            if (err) return reject(err);
        });
        db.all(
            'SELECT student_id, lesson_id, subject, score_percent, total_questions, is_audited, created_at FROM exam_sessions WHERE student_id = ? ORDER BY created_at DESC LIMIT 20',
            [studentId],
            (err, rows) => {
                db.close();
                if (err) return reject(err);
                resolve(rows || []);
            }
        );
    });
}

// --- Helpers ---
function classifyValue(v) {
    if (v === null || v === undefined) return 'NULL';
    if (typeof v === 'string' && v.length === 0) return 'EMPTY_STRING';
    if (Array.isArray(v) && v.length === 0) return 'EMPTY_ARRAY';
    if (typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 0) return 'EMPTY_OBJECT';
    return 'PRESENT';
}

function printFieldMap(label, obj) {
    const fields = [
        'xp', '_sharedXp', 'englishXp', 'streak', 'gold', 'hearts',
        'scores', 'subjects', 'history', 'examSessions',
        'completedSubtopics', 'subtopicScores', 'completedLessonTheory',
        'badges', 'goldBadges', 'levelScores',
        '_revision', 'lastActiveDate'
    ];
    console.log(`\n  [${label}] Key field classification:`);
    fields.forEach(f => {
        const v = obj ? obj[f] : undefined;
        const c = classifyValue(v);
        const display = c === 'PRESENT' ? (typeof v === 'object' ? `${c} (${Array.isArray(v) ? v.length + ' items' : Object.keys(v).length + ' keys'})` : `${c} = ${v}`) : c;
        console.log(`    ${f.padEnd(28)}: ${display}`);
    });
}

async function main() {
    console.log('\n══════════════════════════════════════════════════════');
    console.log('  ZONE 1 — DATA / HYDRATION VERIFICATION PROBE');
    console.log(`  Student: ${STUDENT_ID}`);
    console.log('══════════════════════════════════════════════════════\n');

    // --- DATABASE VALUE ---
    console.log('[LEVEL 1] DATABASE VALUE (SQLite direct read)');
    let dbResult;
    try {
        dbResult = await probeDatabase(STUDENT_ID);
    } catch (e) {
        console.log('  STATUS: FAIL —', e.message);
        dbResult = { found: false };
    }

    if (!dbResult.found) {
        console.log('  STATUS: NO ROW — student_progress table has no row for', STUDENT_ID);
        console.log('  CLASSIFICATION: no data');
    } else if (dbResult.parseError) {
        console.log('  STATUS: ROW EXISTS but state_json is corrupt —', dbResult.parseError);
        console.log('  CLASSIFICATION: corrupt data');
    } else {
        console.log(`  STATUS: FOUND`);
        console.log(`  student_id  : ${dbResult.student_id}`);
        console.log(`  revision    : ${dbResult.revision}`);
        console.log(`  json_bytes  : ${dbResult.json_bytes}`);
        printFieldMap('DB', dbResult.parsed);
    }

    // --- API VALUE ---
    const port = getServerPort();
    console.log(`\n[LEVEL 2] API VALUE (GET /api/load-progress?studentId=${STUDENT_ID})`);
    if (!port) {
        console.log('  STATUS: BLOCKED — Server not running (.port.tmp missing or invalid)');
        console.log('  CLASSIFICATION: server offline');
    } else {
        const apiResult = await probeApi(STUDENT_ID, port);
        if (!apiResult.available) {
            console.log(`  STATUS: BLOCKED — ${apiResult.reason}`);
        } else if (apiResult.parseError) {
            console.log(`  STATUS: FAIL — HTTP ${apiResult.statusCode}, parse error: ${apiResult.parseError}`);
        } else {
            console.log(`  STATUS: OK — HTTP ${apiResult.statusCode}`);
            printFieldMap('API', apiResult.data);
        }
    }

    // --- FIELD DIFF: DB vs API ---
    if (dbResult.found && !dbResult.parseError && port) {
        console.log('\n[LEVEL 3] DB vs API DELTA (fields that differ)');
        // Will run only when both available; basic scalar comparison
        const apiResult = await probeApi(STUDENT_ID, port);
        if (apiResult.available && !apiResult.parseError) {
            const scalarFields = ['xp', 'streak', 'gold', 'hearts', '_revision'];
            scalarFields.forEach(f => {
                const dbVal = dbResult.parsed[f];
                const apiVal = apiResult.data[f];
                if (dbVal !== apiVal) {
                    console.log(`  DIVERGE: ${f} | DB=${dbVal} | API=${apiVal}`);
                }
            });
            console.log('  (Only scalar fields checked; array/object comparison skipped)');
        }
    }

    // --- EXAM SESSIONS TABLE ---
    console.log('\n[LEVEL 4] EXAM SESSIONS TABLE (last 20 records)');
    try {
        const sessions = await probeExamSessions(STUDENT_ID);
        if (sessions.length === 0) {
            console.log('  STATUS: EMPTY — No exam_sessions records for this student');
        } else {
            console.log(`  Count: ${sessions.length} (showing most recent 20)`);
            console.log('  ' + 'Lesson ID'.padEnd(20) + 'Subject'.padEnd(10) + 'Score'.padEnd(8) + 'Q Count'.padEnd(10) + 'Audited'.padEnd(10) + 'Date');
            console.log('  ' + '─'.repeat(72));
            sessions.forEach(s => {
                console.log('  ' +
                    (s.lesson_id || '?').padEnd(20) +
                    (s.subject || '?').padEnd(10) +
                    String(s.score_percent || 0).padEnd(8) +
                    String(s.total_questions || 0).padEnd(10) +
                    (s.is_audited ? 'YES' : 'NO').padEnd(10) +
                    (s.created_at || '?')
                );
            });
        }
    } catch (e) {
        console.log('  STATUS: FAIL —', e.message);
    }

    // --- HYDRATION RULES SUMMARY ---
    console.log('\n══════════════════════════════════════════════════════');
    console.log('  HYDRATION LOGIC SUMMARY (from app.js loadProgress)');
    console.log('══════════════════════════════════════════════════════');
    console.log('  Rule 1: If localData.xp > 0 AND localData.xp > serverData.xp → use LocalStorage, save to server');
    console.log('  Rule 2: Else if serverData has xp>0 or scores → use serverData');
    console.log('  Rule 3: Else → try Firebase RTDB fallback, then saveProgress() with empty/default');
    console.log('  Rule 4: If LocalStorage migration used, preserve serverData.subjects if server has math/english scores');
    console.log('\n  Authority: SQLite (server) wins UNLESS LocalStorage has higher XP');
    console.log('  Risk: LocalStorage with stale/higher XP can override valid server state');
    console.log('  Risk: Firebase RTDB hydrates ONLY xp/streak/lastActiveDate — no scores\n');

    console.log('══════════════════════════════════════════════════════\n');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
