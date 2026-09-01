/**
 * ZONE 3 — QUESTION GENERATION VERIFICATION PROBE
 * Truy vết pipeline: API → Worker/Main Thread → MathTemplateCompiler
 * 
 * Chạy: node tools/seam-probe/probe-questions.js [lessonId] [studentId]
 * Mặc định: bai-1 / std_htsj4gbmo
 * 
 * QUAN TRỌNG: Probe này CHỈ đọc cache và kiểm tra modules. Không gọi Gemini AI.
 */
'use strict';

const path = require('path');
const fs = require('fs');

const LESSON_ID = process.argv[2] || 'bai-1';
const STUDENT_ID = process.argv[3] || 'std_htsj4gbmo';

// --- Load core modules ---
const vm = require('vm');

function loadModule(filePath, globalName) {
    try {
        const code = fs.readFileSync(filePath, 'utf8');
        const ctx = { module: { exports: {} }, exports: {}, require, globalThis: global };
        vm.createContext(ctx);
        vm.runInContext(code, ctx);
        return ctx[globalName] || ctx.module.exports || null;
    } catch (e) {
        return { _loadError: e.message };
    }
}

// Load MathUtils, MathExprEvaluator, MathTemplateCompiler
const MathUtils = require('../../js/core/math-utils');
const MathExprEvaluator = require('../../js/core/math-expr-evaluator');
global.MathUtils = MathUtils;
global.MathExprEvaluator = MathExprEvaluator;

let MathTemplateCompiler = null;
try {
    MathTemplateCompiler = require('../../js/core/math-template-compiler');
    global.MathTemplateCompiler = MathTemplateCompiler;
} catch (e) {
    MathTemplateCompiler = { _loadError: e.message };
}

let workerGenerator = null;
try {
    workerGenerator = require('../../js/question-generator-worker');
} catch (e) {
    workerGenerator = { _loadError: e.message };
}

// --- Check pregen cache ---
function findPregenCache(studentId, lessonId) {
    const BASE = path.resolve(__dirname, '../../logs/pregen');
    const candidates = [
        path.join(BASE, studentId, `${lessonId}.json`),
        path.join(BASE, 'default', `${lessonId}.json`),
        path.join(path.resolve(__dirname, '../../'), 'pregen', studentId, `${lessonId}.json`),
    ];
    for (const p of candidates) {
        if (fs.existsSync(p)) return { found: true, path: p };
    }
    // Try to scan logs dir
    try {
        const logDir = path.resolve(__dirname, '../../logs');
        if (fs.existsSync(logDir)) {
            const entries = fs.readdirSync(logDir, { withFileTypes: true });
            for (const e of entries) {
                if (e.isDirectory()) {
                    const candidate = path.join(logDir, e.name, `${lessonId}.json`);
                    if (fs.existsSync(candidate)) return { found: true, path: candidate };
                }
            }
        }
    } catch (_) {}
    return { found: false, candidates };
}

// --- Test MathTemplateCompiler with a minimal synthetic template ---
function testTemplateCompiler() {
    if (!MathTemplateCompiler || MathTemplateCompiler._loadError) {
        return { status: 'FAIL', reason: MathTemplateCompiler ? MathTemplateCompiler._loadError : 'Not loaded' };
    }
    if (typeof MathTemplateCompiler.generateQuestionFromTemplate !== 'function') {
        return { status: 'FAIL', reason: 'generateQuestionFromTemplate not a function' };
    }
    try {
        const syntheticTemplate = {
            isTemplate: true,
            questionTemplate: 'Tính $a + b$ = ?',
            variables: { a: { min: 1, max: 10 }, b: { min: 1, max: 10 } },
            answerFormula: 'a + b',
            wrongAnswers: [
                { formula: 'a + b + 1' },
                { formula: 'a + b - 1' },
                { formula: 'a * b' }
            ]
        };
        const result = MathTemplateCompiler.generateQuestionFromTemplate(syntheticTemplate, 100);
        if (!result || !result.question) {
            return { status: 'FAIL', reason: 'generateQuestionFromTemplate returned null/no question' };
        }
        return { status: 'PASS', result: { question: result.question, answer: result.answer } };
    } catch (e) {
        return { status: 'FAIL', reason: e.message, stack: e.stack };
    }
}

// --- Test Worker module (require path) ---
function testWorkerModule() {
    if (!workerGenerator || workerGenerator._loadError) {
        return { status: 'FAIL', reason: workerGenerator ? workerGenerator._loadError : 'Not loaded' };
    }
    if (typeof workerGenerator.generateQuestionFromTemplate !== 'function') {
        return { status: 'FAIL', reason: 'generator.generateQuestionFromTemplate not a function' };
    }
    try {
        const syntheticTemplate = {
            isTemplate: true,
            questionTemplate: 'Tính $x + y$ = ?',
            variables: { x: { min: 2, max: 8 }, y: { min: 2, max: 8 } },
            answerFormula: 'x + y',
            wrongAnswers: [{ formula: 'x + y + 2' }, { formula: 'x + y - 2' }, { formula: 'x * y' }]
        };
        const result = workerGenerator.generateQuestionFromTemplate(syntheticTemplate, 100);
        if (!result || !result.question) {
            return { status: 'FAIL', reason: 'Worker generator returned null/no question' };
        }
        return { status: 'PASS', result: { question: result.question, answer: result.answer } };
    } catch (e) {
        return { status: 'FAIL', reason: e.message };
    }
}

async function main() {
    console.log('\n══════════════════════════════════════════════════════');
    console.log('  ZONE 3 — QUESTION GENERATION VERIFICATION PROBE');
    console.log(`  Lesson: ${LESSON_ID} | Student: ${STUDENT_ID}`);
    console.log('══════════════════════════════════════════════════════\n');

    // --- Module availability ---
    console.log('[MODULE AVAILABILITY]');
    console.log(`  MathUtils                    : ${MathUtils && !MathUtils._loadError ? 'LOADED' : 'FAIL: ' + (MathUtils && MathUtils._loadError)}`);
    console.log(`  MathExprEvaluator            : ${MathExprEvaluator && !MathExprEvaluator._loadError ? 'LOADED' : 'FAIL'}`);
    if (MathTemplateCompiler && MathTemplateCompiler._loadError) {
        console.log(`  MathTemplateCompiler         : FAIL — ${MathTemplateCompiler._loadError}`);
    } else {
        console.log(`  MathTemplateCompiler         : ${MathTemplateCompiler ? 'LOADED' : 'NOT LOADED'}`);
        if (MathTemplateCompiler) {
            console.log(`    generateQuestionFromTemplate: ${typeof MathTemplateCompiler.generateQuestionFromTemplate === 'function' ? 'PRESENT' : 'MISSING'}`);
        }
    }
    if (workerGenerator && workerGenerator._loadError) {
        console.log(`  question-generator-worker    : FAIL — ${workerGenerator._loadError}`);
    } else {
        console.log(`  question-generator-worker    : ${workerGenerator ? 'LOADED (as module)' : 'NOT LOADED'}`);
    }

    // --- Compiler test ---
    console.log('\n[MATHTEMPLATE COMPILER TEST] (synthetic template)');
    const compilerResult = testTemplateCompiler();
    console.log(`  STATUS: ${compilerResult.status}`);
    if (compilerResult.status === 'PASS') {
        console.log(`  Generated: "${compilerResult.result.question}" | answer="${compilerResult.result.answer}"`);
    } else {
        console.log(`  Reason: ${compilerResult.reason}`);
    }

    // --- Worker module test ---
    console.log('\n[WORKER MODULE TEST] (synthetic template via require)');
    const workerResult = testWorkerModule();
    console.log(`  STATUS: ${workerResult.status}`);
    if (workerResult.status === 'PASS') {
        console.log(`  Generated: "${workerResult.result.question}" | answer="${workerResult.result.answer}"`);
    } else {
        console.log(`  Reason: ${workerResult.reason}`);
    }

    // --- Cache probe ---
    console.log(`\n[PREGEN CACHE PROBE] lessonId=${LESSON_ID}, studentId=${STUDENT_ID}`);
    const cacheResult = findPregenCache(STUDENT_ID, LESSON_ID);
    if (cacheResult.found) {
        console.log(`  STATUS: FOUND at ${cacheResult.path}`);
        try {
            const raw = fs.readFileSync(cacheResult.path, 'utf8');
            const data = JSON.parse(raw);
            const questions = Array.isArray(data) ? data : (data.questions || []);
            console.log(`  Question count: ${questions.length}`);
            if (questions.length > 0) {
                const q = questions[0];
                console.log(`  First question type: ${q.isTemplate ? 'TEMPLATE' : 'STATIC'}`);
                if (q.isTemplate) {
                    console.log(`  Template fields: ${Object.keys(q).join(', ')}`);
                }
            }
        } catch (e) {
            console.log(`  Parse error: ${e.message}`);
        }
    } else {
        console.log('  STATUS: NOT FOUND — no pregen cache for this lesson/student');
        console.log('  Looked in:', cacheResult.candidates ? cacheResult.candidates.join(', ') : 'unknown');
        console.log('  INFERENCE: This lesson would require live Gemini API call on first use');
    }

    // --- Question path summary ---
    console.log('\n══════════════════════════════════════════════════════');
    console.log('  QUESTION PATH DECISION TREE (from code audit)');
    console.log('══════════════════════════════════════════════════════');
    console.log('  1. UI selects lesson → questionType determines generator');
    console.log('  2. If lesson uses local generator (questions-v3.js built-ins) → no API call');
    console.log('  3. If lesson uses "chat-luong-cao" (high quality):');
    console.log('     a. Client calls GET /api/get-questions?lessonId=...');
    console.log('     b. Server: check pregen cache → if hit: return cached template questions');
    console.log('     c. Server: if miss → call Gemini AI → auditMathQuestions → write cache');
    console.log('     d. Client receives template questions (isTemplate: true)');
    console.log('     e. Client tries new Worker("js/question-generator-worker.js")');
    console.log('     f. Worker: importScripts(math-utils, math-template-compiler) → compile');
    console.log('     g. If Worker fails: fallback to main-thread MathTemplateCompiler.generateQuestionFromTemplate()');
    console.log('     h. If main-thread also fails: fallbackToLocalGenerators()');
    console.log('\n  [UNRESOLVED] Bug B: "chat-luong-cao" zero-question scenario');
    console.log('  Most likely point: Worker importScripts() fails in kiosk/offline environment');
    console.log('  → Worker gets MathTemplateCompiler = null → generateQuestionFromTemplate returns raw template');
    console.log('  → Worker posts success but with uncompiled templates');
    console.log('  → UI shows garbage or zero renderable questions');
    console.log('\n  [HYPOTHESIS] importScripts() path is relative to worker origin,');
    console.log('               not the HTML page. In kiosk mode, origin may resolve incorrectly.');
    console.log('\n══════════════════════════════════════════════════════\n');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
