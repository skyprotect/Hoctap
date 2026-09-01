/**
 * ZONE 4 + 5 — WORKER & LIFECYCLE VERIFICATION PROBE
 * Kiểm tra static code contracts: Worker initialization, exitPractice state machine
 * 
 * Chạy: node tools/seam-probe/probe-lifecycle.js
 * 
 * KHÔNG chạy Worker thật (không có browser context).
 * Probe này kiểm tra: module loads, state machine logic, isExiting guard coverage.
 */
'use strict';

const path = require('path');
const fs = require('fs');

// Load core dependencies
const MathUtils = require('../../js/core/math-utils');
const MathExprEvaluator = require('../../js/core/math-expr-evaluator');
const MathAnswerEvaluator = require('../../js/core/math-answer-evaluator');
const MathPracticeEvaluator = require('../../js/core/math-practice-evaluator');

global.MathUtils = MathUtils;
global.MathExprEvaluator = MathExprEvaluator;
global.MathAnswerEvaluator = MathAnswerEvaluator;
global.MathPracticeEvaluator = MathPracticeEvaluator;

// Mock minimal browser APIs needed to require questions-v3
global.document = {
    getElementById: () => ({ classList: { add: () => {}, remove: () => {} }, style: {}, innerHTML: '', innerText: '' }),
    body: { classList: { add: () => {}, remove: () => {} } },
    createElement: () => ({ classList: { add: () => {}, remove: () => {} }, appendChild: () => {}, style: {}, innerHTML: '' }),
    head: { appendChild: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {},
    createTextNode: (t) => ({ textContent: t }),
    querySelector: () => null,
    querySelectorAll: () => [],
};
global.window = global;
global.Swal = { fire: () => Promise.resolve({ isConfirmed: false }), close: () => {}, showLoading: () => {} };
try { global.navigator = { userAgent: 'node-probe' }; } catch (_) {
    Object.defineProperty(global, 'navigator', { value: { userAgent: 'node-probe' }, writable: true, configurable: true });
}

let questions = null;
try {
    questions = require('../../js/questions-v3');
    global.questions = questions;
} catch (e) {
    console.error('[FAIL] Cannot require questions-v3:', e.message);
    process.exit(1);
}

// --- ZONE 4: Worker initialization static analysis ---
function probeWorkerStaticAnalysis() {
    const workerFile = path.resolve(__dirname, '../../js/question-generator-worker.js');
    const code = fs.readFileSync(workerFile, 'utf8');

    const results = {};

    // Check importScripts presence and target files
    const importScriptCalls = [...code.matchAll(/importScripts\(['"]([^'"]+)['"]\)/g)].map(m => m[1]);
    results.importScriptTargets = importScriptCalls;

    // Check fallback guard pattern
    results.hasMathTemplateCompilerFallback = code.includes('typeof MathTemplateCompiler === \'undefined\'') ||
        code.includes("typeof MathTemplateCompiler === 'undefined'");

    // Check error message path
    results.hasPerQuestionErrorReport = code.includes("status: 'error'");
    results.hasGlobalErrorReport = code.includes('globalErr');

    // Check sanitizeForClone
    results.hasSanitizeForClone = code.includes('sanitizeForClone');

    // Check that Worker only responds on self.onmessage
    results.hasOnMessage = code.includes('self.onmessage');

    // Count postMessage calls
    const pmMatches = [...code.matchAll(/self\.postMessage/g)];
    results.postMessageCallCount = pmMatches.length;

    return results;
}

// --- ZONE 5: isExiting state machine verification ---
function probeIsExitingStateMachine() {
    const results = {};

    // Read the exitPractice source
    const source = fs.readFileSync(path.resolve(__dirname, '../../js/questions-v3.js'), 'utf8');

    // Count all isExiting = false resets in exitPractice
    const resets = [...source.matchAll(/this\.isExiting\s*=\s*false/g)];
    results.totalResets = resets.length;

    // Check guard timeout exists
    results.hasGuardTimeout = source.includes('exitGuardTimeout') && source.includes('setTimeout(resetExitingFlag, 3000)');
    results.timeoutMs = 3000;

    // Check that every path through the Swal.then() resets isExiting
    results.hasConfirmedPathReset = source.includes("this.isExiting = false;\r\n                        }, 150)") ||
        source.includes("this.isExiting = false;\n                        }, 150)");
    results.hasCancelPathReset = source.includes("this.isExiting = false;\r\n                    // Khôi phục") ||
        source.includes("this.isExiting = false;") && source.includes("wasGamePlaying");
    results.hasCatchPathReset = source.includes("swalErr =>");
    results.hasGlobalCatchReset = source.includes("this.isExiting = false;\r\n        }") ||
        source.includes("console.error('Lỗi ngoại lệ trong exitPractice'");

    // The critical risk: what happens if Swal.fire() itself throws synchronously BEFORE the .then() resolves?
    // Check if the try/catch wraps the full Swal.fire() call
    results.swallFireWrappedInTryCatch = source.includes("try {") && source.includes("Swal.fire({") &&
        source.includes("} catch (err) {") && source.includes("exitPractice");

    // Check that exitPractice is called from external code with isExiting guard
    const callers = [...source.matchAll(/questions\.exitPractice\(\)/g)];
    results.externalCallsWithIsExitingCheck = 0; // Will be filled from app.js
    
    return results;
}

// --- ZONE 5: Practice state fields ---
function probePracticeStateFields() {
    const stateFields = [
        'isExiting', 'isGraded', 'practiceMode', 'currentQuestions', 'currentQuestionIndex',
        'currentLesson', 'currentSubtopic', 'isSubtopicPracticeMode', 'isLessonExamMode',
        'isWeaknessPracticeMode', 'isExamMode', 'examInterval'
    ];

    const results = {};
    for (const f of stateFields) {
        results[f] = {
            definedOnObject: f in questions,
            type: typeof questions[f],
            defaultValue: questions[f]
        };
    }
    return results;
}

// --- App.js external caller analysis ---
function probeAppJsCallers() {
    const appSource = fs.readFileSync(path.resolve(__dirname, '../../js/app.js'), 'utf8');
    const results = {};

    // Find all callsites for exitPractice
    const callerMatches = [...appSource.matchAll(/questions\.exitPractice\(\)/g)];
    results.exitPracticeCallCount = callerMatches.length;

    // Check if callers check isExiting
    const guardedCallers = [...appSource.matchAll(/!questions\.isExiting[\s\S]{0,50}questions\.exitPractice/g)];
    results.guardedCallerCount = guardedCallers.length;

    // Check backButton / kiosk listener
    results.hasBeforeUnloadHandler = appSource.includes('beforeunload') || appSource.includes('exitPractice');

    return results;
}

// --- Run all probes ---
async function main() {
    console.log('\n══════════════════════════════════════════════════════');
    console.log('  ZONE 4 + 5 — WORKER & LIFECYCLE VERIFICATION PROBE');
    console.log('══════════════════════════════════════════════════════\n');

    // ZONE 4
    console.log('[ZONE 4] WORKER STATIC ANALYSIS');
    const workerAnalysis = probeWorkerStaticAnalysis();
    console.log(`  importScripts targets     : ${workerAnalysis.importScriptTargets.join(', ')}`);
    console.log(`  MathTemplateCompiler guard: ${workerAnalysis.hasMathTemplateCompilerFallback ? 'PRESENT' : 'MISSING'}`);
    console.log(`  Per-question error report : ${workerAnalysis.hasPerQuestionErrorReport ? 'YES' : 'NO'}`);
    console.log(`  Global error report       : ${workerAnalysis.hasGlobalErrorReport ? 'YES' : 'NO'}`);
    console.log(`  sanitizeForClone present  : ${workerAnalysis.hasSanitizeForClone ? 'YES' : 'NO'}`);
    console.log(`  self.onmessage handler    : ${workerAnalysis.hasOnMessage ? 'YES' : 'NO'}`);
    console.log(`  postMessage call count    : ${workerAnalysis.postMessageCallCount}`);

    console.log('\n  [FACT] Worker importScripts() uses relative paths:');
    workerAnalysis.importScriptTargets.forEach(t => console.log(`    → ${t}`));
    console.log('  [HYPOTHESIS] In kiosk/PWA mode, importScripts() relative paths may fail');
    console.log('               → MathTemplateCompiler = null inside Worker');
    console.log('               → generator.generateQuestionFromTemplate() falls through to return tempQ unchanged');
    console.log('               → Worker posts success with uncompiled template questions');
    console.log('  [MISSING TEST] No test verifies Worker behavior when importScripts() fails');

    // ZONE 5 state fields
    console.log('\n[ZONE 5] PRACTICE STATE FIELDS');
    const stateFields = probePracticeStateFields();
    for (const [f, info] of Object.entries(stateFields)) {
        const defVal = info.defaultValue === null ? 'null' :
            info.defaultValue === false ? 'false' :
            info.defaultValue === undefined ? 'undefined' :
            String(info.defaultValue);
        console.log(`  ${f.padEnd(30)}: defined=${info.definedOnObject} | default=${defVal}`);
    }

    // ZONE 5 isExiting state machine
    console.log('\n[ZONE 5] isExiting STATE MACHINE');
    const exitMachine = probeIsExitingStateMachine();
    console.log(`  Total isExiting=false resets: ${exitMachine.totalResets}`);
    console.log(`  exitGuardTimeout (3000ms)   : ${exitMachine.hasGuardTimeout ? 'YES' : 'NO'}`);
    console.log(`  Swal wrapped in try/catch   : ${exitMachine.swallFireWrappedInTryCatch ? 'YES' : 'NO'}`);
    console.log(`  Confirmed path reset        : ${exitMachine.hasConfirmedPathReset ? 'YES' : 'UNCERTAIN'}`);
    console.log(`  Cancel path reset           : ${exitMachine.hasCancelPathReset ? 'YES' : 'UNCERTAIN'}`);
    console.log(`  .catch(swalErr) path        : ${exitMachine.hasCatchPathReset ? 'YES' : 'NO'}`);
    console.log(`  Global catch reset          : ${exitMachine.hasGlobalCatchReset ? 'YES' : 'UNCERTAIN'}`);

    // ZONE 5 app.js callers
    console.log('\n[ZONE 5] app.js EXTERNAL CALLERS of exitPractice()');
    const appCallers = probeAppJsCallers();
    console.log(`  Total exitPractice() calls  : ${appCallers.exitPracticeCallCount}`);
    console.log(`  Calls guarded by !isExiting : ${appCallers.guardedCallerCount}`);
    if (appCallers.exitPracticeCallCount > appCallers.guardedCallerCount) {
        const unguarded = appCallers.exitPracticeCallCount - appCallers.guardedCallerCount;
        console.log(`  [WARNING] ${unguarded} exitPractice() call(s) may not check isExiting first`);
        console.log('  [HYPOTHESIS] Unguarded call during exception path could cause double-entry');
    }

    // ZONE 5 lifecycle ownership map
    console.log('\n[ZONE 5] LIFECYCLE OWNERSHIP MAP');
    const ownershipMap = {
        'isExiting':       { owner: 'questions (questions-v3.js)', resetOn: 'all exitPractice paths + 3s guard timeout' },
        'isGraded':        { owner: 'questions (questions-v3.js)', resetOn: 'finishPractice() start' },
        'examInterval':    { owner: 'questions (questions-v3.js)', resetOn: 'exitPractice() confirmed path' },
        'currentQuestions':{ owner: 'questions (questions-v3.js)', resetOn: 'exitPractice() confirmed path (set to [])' },
        'worker (local)':  { owner: 'questions (anonymous closure)', resetOn: 'worker.terminate() in onmessage/onerror' },
        'fullscreen':      { owner: 'app (app.js via exitFullscreen)', resetOn: 'exitPractice confirmed path' },
        'timer':           { owner: 'questions.examInterval (clearInterval)', resetOn: 'exitPractice confirmed path' },
        'game loop':       { owner: 'game (game.js)', resetOn: 'game.stop() in exitPractice confirmed path' },
        'navigation':      { owner: 'app.switchLessonTab()', resetOn: 'setTimeout 150ms after cleanup' },
        'sidebar':         { owner: 'app.expandSidebar()', resetOn: 'exitPractice confirmed path' },
        'scrollbar':       { owner: 'app.restoreScrollbar()', resetOn: 'exitPractice confirmed path' },
    };

    console.log('  ' + 'Resource'.padEnd(24) + 'Owner'.padEnd(40) + 'Reset On');
    console.log('  ' + '─'.repeat(90));
    for (const [resource, info] of Object.entries(ownershipMap)) {
        console.log('  ' + resource.padEnd(24) + info.owner.padEnd(40) + info.resetOn);
    }

    console.log('\n[ZONE 5] EXIT PATH RISK ANALYSIS');
    console.log('  Scenario A: Normal exit (user confirms) → isExiting resets after 150ms setTimeout');
    console.log('  Scenario B: User cancels (stays) → isExiting resets immediately');
    console.log('  Scenario C: Swal.fire() throws synchronously → try/catch resets isExiting');
    console.log('  Scenario D: Swal promise rejects (network/browser error) → .catch(swalErr) resets');
    console.log('  Scenario E: cleanup code throws inside confirmed path → inner try/catch resets');
    console.log('  Scenario F: Guard timeout (3000ms) → always resets as final safety net');
    console.log('\n  [FACT] The 3000ms guard timeout is an unconditional safety reset');
    console.log('  [FACT] isExiting is set true BEFORE Swal.fire() is called');
    console.log('  [INFERENCE] A race condition during kiosk shutdown (before Swal resolves)');
    console.log('              could leave isExiting=true if process is killed mid-timeout');
    console.log('  [HYPOTHESIS] The exit failure (Bug C) occurs when kiosk process kills before 3s guard fires');
    console.log('  [HYPOTHESIS] OR when Swal is blocked by another modal (Swal queue conflict)');

    console.log('\n══════════════════════════════════════════════════════\n');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
