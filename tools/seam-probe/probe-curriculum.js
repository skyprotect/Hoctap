/**
 * ZONE 2 — CURRICULUM VERIFICATION PROBE
 * Trình điều tra lộ trình học (tĩnh, không sửa dữ liệu)
 * 
 * Chạy: node tools/seam-probe/probe-curriculum.js [studentId]
 * Mặc định: std_htsj4gbmo (Trần Bình Minh, lớp 6)
 */
'use strict';

const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.resolve(__dirname, '../../database.db');
const STUDENT_ID = process.argv[2] || 'std_htsj4gbmo';

// --- Load lessons.js using Function() constructor (const-safe) ---
const fs = require('fs');
const lessonsCode = fs.readFileSync(path.resolve(__dirname, '../../js/lessons.js'), 'utf8');
let COURSE_DATA = null;
try {
    // lessons.js depends on ENGLISH_COURSE_DATA being defined and uses const, so we use Function wrapper
    const fn = new Function('ENGLISH_COURSE_DATA', 'require', lessonsCode + '; return COURSE_DATA;');
    COURSE_DATA = fn({}, require);
} catch (e) {
    console.error('[FAIL] Cannot load lessons.js:', e.message);
    process.exit(1);
}

if (!COURSE_DATA || !Array.isArray(COURSE_DATA)) {
    console.error('[FAIL] Không thể nạp COURSE_DATA từ lessons.js');
    process.exit(1);
}

// --- Lấy dữ liệu progress từ SQLite ---
function getStudentProgress(studentId) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY, err => {
            if (err) return reject(err);
        });
        db.get(
            'SELECT state_json, revision FROM student_progress WHERE student_id = ?',
            [studentId],
            (err, row) => {
                db.close();
                if (err) return reject(err);
                if (!row || !row.state_json) return resolve({ state: null, revision: null });
                try {
                    const state = JSON.parse(row.state_json);
                    resolve({ state, revision: row.revision });
                } catch (e) {
                    resolve({ state: null, revision: null, parseError: e.message });
                }
            }
        );
    });
}

/**
 * Mô phỏng getLessonStatus() từ app.js (không chạm production code)
 * Logic: Tuyến tính từ đầu lộ trình; bài trước phải >= 80 thì bài sau mới unlocked
 */
function simulateLessonStatus(lessonId, classLevel, subject, scores) {
    const s = scores || {};
    const flatLessons = [];
    COURSE_DATA
        .filter(ch => (ch.class || '6') === classLevel && (ch.subject || 'math') === subject)
        .forEach(ch => { ch.lessons.forEach(l => flatLessons.push(l.id)); });

    const idx = flatLessons.indexOf(lessonId);
    if (idx === -1) return 'locked';
    if (idx === 0) return (s[lessonId] || 0) >= 80 ? 'completed' : 'active';

    let currentStatus = 'completed';
    for (let i = 0; i <= idx; i++) {
        const lid = flatLessons[i];
        const score = s[lid] || 0;
        if (i === 0) {
            currentStatus = score >= 80 ? 'completed' : 'active';
        } else {
            if (currentStatus === 'completed') {
                currentStatus = score >= 80 ? 'completed' : 'active';
            } else {
                currentStatus = 'locked';
            }
        }
        if (i === idx) return currentStatus;
    }
    return 'locked';
}

async function main() {
    console.log('\n══════════════════════════════════════════════════════');
    console.log('  ZONE 2 — CURRICULUM VERIFICATION PROBE');
    console.log(`  Student: ${STUDENT_ID}`);
    console.log('══════════════════════════════════════════════════════\n');

    // ZONE 1 output first (raw data probe)
    let state = null;
    let revision = null;
    try {
        const result = await getStudentProgress(STUDENT_ID);
        state = result.state;
        revision = result.revision;
        console.log('[DATABASE VALUE]');
        if (!state) {
            console.log('  STATUS: NO ROW FOUND for', STUDENT_ID);
        } else {
            console.log(`  revision         : ${revision}`);
            console.log(`  xp               : ${state.xp}`);
            console.log(`  streak           : ${state.streak}`);
            const mathScores = (state.subjects && state.subjects.math && state.subjects.math.scores) || state.scores || {};
            const mathScoreKeys = Object.keys(mathScores);
            console.log(`  Math scores (${mathScoreKeys.length} entries):`);
            mathScoreKeys.sort().forEach(k => console.log(`    ${k}: ${mathScores[k]}`));
            const topLevelScoreKeys = Object.keys(state.scores || {});
            if (topLevelScoreKeys.length > 0 && topLevelScoreKeys.length !== mathScoreKeys.length) {
                console.log(`  Top-level scores (${topLevelScoreKeys.length} entries, may overlap or differ):`);
                topLevelScoreKeys.sort().forEach(k => console.log(`    ${k}: ${state.scores[k]}`));
            }
        }
    } catch (err) {
        console.error('[FAIL] Database read error:', err.message);
        process.exit(1);
    }

    console.log('\n══════════════════════════════════════════════════════');
    console.log('  CLASS 6 MATH CURRICULUM STATUS TABLE');
    console.log('══════════════════════════════════════════════════════');

    // Determine which score source to use
    const mathScores = (state && state.subjects && state.subjects.math && state.subjects.math.scores)
        || (state && state.scores)
        || {};

    const class6MathChapters = COURSE_DATA.filter(
        ch => (ch.class || '6') === '6' && (ch.subject || 'math') === 'math'
    );

    if (class6MathChapters.length === 0) {
        console.log('[UNKNOWN] No class-6 math chapters found in COURSE_DATA');
    }

    let prevCompleted = true;
    let semesterBreakSeen = false;

    console.log('\n' +
        'No'.padEnd(4) +
        'Semester'.padEnd(10) +
        'Lesson ID'.padEnd(20) +
        'Score'.padEnd(8) +
        'DB Status'.padEnd(15) +
        'Logic Status'.padEnd(15) +
        'Reason'
    );
    console.log('─'.repeat(95));

    let idx = 0;
    for (const chapter of class6MathChapters) {
        for (const lesson of chapter.lessons) {
            idx++;
            const score = mathScores[lesson.id] || 0;
            const logicStatus = simulateLessonStatus(lesson.id, '6', 'math', mathScores);

            // Determine reason
            let reason = '';
            if (logicStatus === 'completed') {
                reason = `score ${score} >= 80`;
            } else if (logicStatus === 'active') {
                reason = idx === 1 ? 'first lesson, always active' : `prev lesson completed AND score ${score} < 80`;
            } else {
                reason = 'prev lesson not completed';
            }

            const semStr = `HK${chapter.semester}`;
            if (chapter.semester === 2 && !semesterBreakSeen) {
                console.log('──── Học Kỳ 2 ────');
                semesterBreakSeen = true;
            }

            console.log(
                String(idx).padEnd(4) +
                semStr.padEnd(10) +
                lesson.id.padEnd(20) +
                String(score).padEnd(8) +
                '–'.padEnd(15) +
                logicStatus.padEnd(15) +
                reason
            );
        }
    }

    console.log('\n══════════════════════════════════════════════════════');

    // Find the "active" lesson that would be shown in UI
    const activeLessons = [];
    for (const chapter of class6MathChapters) {
        for (const lesson of chapter.lessons) {
            const status = simulateLessonStatus(lesson.id, '6', 'math', mathScores);
            if (status === 'active') {
                activeLessons.push({ lesson, semester: chapter.semester });
            }
        }
    }

    if (activeLessons.length === 0) {
        console.log('\n[INFERENCE] No active lesson found — all completed or all locked');
    } else {
        const first = activeLessons[0];
        console.log(`\n[FACT] First active (UI would show): ${first.lesson.id} (HK${first.semester})`);
        console.log(`[FACT] Total active lessons: ${activeLessons.length}`);
    }

    // Diagnose the Lesson14 / Semester2 discrepancy
    console.log('\n══════════════════════════════════════════════════════');
    console.log('  LESSON 14 / SEMESTER 2 DISCREPANCY DIAGNOSIS');
    console.log('══════════════════════════════════════════════════════');

    const lesson14 = class6MathChapters
        .flatMap(ch => ch.lessons.map(l => ({ ...l, semester: ch.semester })))
        .find(l => l.id === 'bai-14' || l.title.includes('14') || l.id.includes('-14'));

    const sem2Lessons = class6MathChapters
        .filter(ch => ch.semester === 2)
        .flatMap(ch => ch.lessons);

    console.log(`\n[FACT] Class-6 math lessons in Semester 2: ${sem2Lessons.length}`);
    sem2Lessons.forEach((l, i) => {
        const score = mathScores[l.id] || 0;
        const status = simulateLessonStatus(l.id, '6', 'math', mathScores);
        console.log(`  [S2-${i+1}] ${l.id} | score=${score} | status=${status}`);
    });

    if (!lesson14) {
        console.log('\n[FACT] No lesson with id containing "14" found in class-6 math COURSE_DATA');
    } else {
        const score14 = mathScores[lesson14.id] || 0;
        const status14 = simulateLessonStatus(lesson14.id, '6', 'math', mathScores);
        console.log(`\n[FACT] Lesson "bai-14": semester=${lesson14.semester}, score=${score14}, status=${status14}`);
    }

    // Key diagnostic: is the last score-bearing lesson the max boundary?
    const scoredLessons = class6MathChapters
        .flatMap(ch => ch.lessons.map(l => ({ ...l, semester: ch.semester })))
        .filter(l => (mathScores[l.id] || 0) > 0);

    if (scoredLessons.length > 0) {
        const last = scoredLessons[scoredLessons.length - 1];
        console.log(`\n[FACT] Last lesson with score > 0: ${last.id} (HK${last.semester}), score=${mathScores[last.id]}`);
        if (last.semester === 1) {
            console.log('[HYPOTHESIS] No Semester 2 scores exist in DB — UI is correctly showing only Semester 1');
            console.log('[HYPOTHESIS] The discrepancy may be between what DB contains vs what student remembers doing');
        }
    } else {
        console.log('[FACT] No lessons have score > 0 for this student in class-6 math');
    }

    console.log('\n══════════════════════════════════════════════════════');
    console.log('  SCORE SOURCE ANALYSIS');
    console.log('══════════════════════════════════════════════════════');
    if (state) {
        const hasSubjectsMath = state.subjects && state.subjects.math && state.subjects.math.scores;
        const hasTopLevelScores = state.scores && Object.keys(state.scores).length > 0;
        console.log(`  state.subjects.math.scores exists: ${!!hasSubjectsMath}`);
        console.log(`  state.scores (top-level) exists:   ${!!hasTopLevelScores}`);
        if (hasSubjectsMath && hasTopLevelScores) {
            const mathKeys = new Set(Object.keys(state.subjects.math.scores));
            const topKeys = new Set(Object.keys(state.scores));
            const inMathNotTop = [...mathKeys].filter(k => !topKeys.has(k));
            const inTopNotMath = [...topKeys].filter(k => !mathKeys.has(k));
            console.log(`  Keys in math.scores but not top-level: ${inMathNotTop.join(', ') || 'none'}`);
            console.log(`  Keys in top-level but not math.scores: ${inTopNotMath.join(', ') || 'none'}`);
        }
        console.log('\n[NOTE] getLessonStatus() in app.js reads from state.scores (top-level), NOT state.subjects.math.scores');
        console.log('       If they diverge, curriculum display may not reflect actual Math progress.');
    }

    console.log('\n══════════════════════════════════════════════════════\n');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
