/**
 * PRODUCTION TEMPLATE COMPILER TEST
 * Tests MathTemplateCompiler against REAL production templates from exams/ directory.
 * Không dùng synthetic templates.
 * 
 * Chạy: node tools/seam-probe/test-compiler-production.js [lessonId]
 */
'use strict';

const path = require('path');
const fs = require('fs');

const LESSON_ID = process.argv[2] || 'bai-1';
const EXAMS_DIR = path.resolve(__dirname, '../../exams');

// Load dependencies
const MathUtils = require('../../js/core/math-utils');
const MathExprEvaluator = require('../../js/core/math-expr-evaluator');
let ArrayUtils;
try { ArrayUtils = require('../../js/core/array-utils'); } catch(e) { ArrayUtils = null; }

global.MathUtils = MathUtils;
global.MathExprEvaluator = MathExprEvaluator;
if (ArrayUtils) global.ArrayUtils = ArrayUtils;

const MathTemplateCompiler = require('../../js/core/math-template-compiler');

function findCacheFile(lessonId) {
    const candidates = [
        `pregen-std_htsj4gbmo-${lessonId}.json`,
        `pregen-${lessonId}.json`,
        `pregen-default-${lessonId}.json`,
    ];
    for (const name of candidates) {
        const p = path.join(EXAMS_DIR, name);
        if (fs.existsSync(p)) return p;
    }
    return null;
}

function testAllTemplates(lessonId) {
    const cachePath = findCacheFile(lessonId);
    if (!cachePath) {
        console.log(`[FAIL] No cache file found for lessonId="${lessonId}"`);
        console.log(`  Looked in: ${EXAMS_DIR}`);
        return false;
    }

    const raw = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
    const questions = Array.isArray(raw) ? raw : (raw.questions || []);

    console.log(`\n[FILE] ${path.basename(cachePath)}`);
    console.log(`[QUESTIONS] Total: ${questions.length}`);
    console.log();

    const results = [];

    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const idx = i + 1;

        if (!q.isTemplate) {
            console.log(`  Q${idx}: [STATIC — not a template, skipping compiler]`);
            results.push({ idx, type: 'static', status: 'skip' });
            continue;
        }

        // Inspect template structure
        const hasVariables = q.variables && Object.keys(q.variables).length > 0;
        const hasFormulas = q.formulas && Object.keys(q.formulas).length > 0;
        const hasConstraints = Array.isArray(q.constraints) && q.constraints.length > 0;
        const hasOptions = Array.isArray(q.options) && q.options.length > 0;
        const hasCorrectIndex = typeof q.correctIndex !== 'undefined';
        const hasQuestionText = typeof q.questionText === 'string';
        const hasAnswerFormula = typeof q.answerFormula !== 'undefined';
        const hasWrongAnswers = Array.isArray(q.wrongAnswers);

        // Attempt compilation 5 times (RNG sampling)
        let passCount = 0;
        let failCount = 0;
        let nullCount = 0;
        const sample = [];

        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                const result = MathTemplateCompiler.generateQuestionFromTemplate(q, 500);
                if (result === null || result === undefined) {
                    nullCount++;
                } else if (result === q) {
                    // Identity return = compiler silently returned input unchanged
                    failCount++;
                    if (sample.length === 0) sample.push({ type: 'identity-return' });
                } else if (!result.question && !result.questionText) {
                    failCount++;
                    if (sample.length === 0) sample.push({ type: 'no-question-text', keys: Object.keys(result) });
                } else {
                    passCount++;
                    if (sample.length === 0) sample.push({
                        type: 'pass',
                        question: (result.question || result.questionText || '').slice(0, 80),
                        answer: result.answer,
                        optionCount: Array.isArray(result.options) ? result.options.length : 'N/A'
                    });
                }
            } catch (e) {
                failCount++;
                if (sample.length === 0) sample.push({ type: 'exception', msg: e.message });
            }
        }

        const status = passCount === 5 ? 'PASS' :
                       passCount > 0 ? 'PARTIAL' :
                       nullCount === 5 ? 'NULL' : 'FAIL';

        console.log(`  Q${idx}: [TEMPLATE] status=${status} pass=${passCount}/5 null=${nullCount}/5 fail=${failCount}/5`);
        console.log(`         vars=${Object.keys(q.variables||{}).join(',')} formulas=${Object.keys(q.formulas||{}).join(',')}`);
        if (hasConstraints) console.log(`         constraints(${q.constraints.length}): ${q.constraints.slice(0,2).join('; ')}`);
        if (sample.length > 0) {
            const s = sample[0];
            if (s.type === 'pass') console.log(`         sample: "${s.question}" | ans="${s.answer}"`);
            else console.log(`         sample: ${JSON.stringify(s)}`);
        }
        console.log();

        results.push({ idx, type: 'template', status, passCount, nullCount, failCount });
    }

    // Summary
    const templateResults = results.filter(r => r.type === 'template');
    const passed = templateResults.filter(r => r.status === 'PASS' || r.status === 'PARTIAL').length;
    const failed = templateResults.filter(r => r.status === 'FAIL' || r.status === 'NULL').length;

    console.log(`\n${'═'.repeat(56)}`);
    console.log(`SUMMARY: ${passed}/${templateResults.length} templates compiled successfully`);
    if (failed > 0) {
        console.log(`  FAIL/NULL: ${failed} templates — COMPILER NOT SAFE FOR THESE`);
    }
    console.log(`${'═'.repeat(56)}\n`);

    return failed === 0;
}

async function main() {
    console.log('\n══════════════════════════════════════════════════════');
    console.log('  PRODUCTION TEMPLATE COMPILER VERIFICATION');
    console.log(`  Lesson: ${LESSON_ID}`);
    console.log('══════════════════════════════════════════════════════');

    console.log('\n[MODULE STATUS]');
    console.log(`  MathTemplateCompiler loaded: ${!!MathTemplateCompiler}`);
    console.log(`  generateQuestionFromTemplate: ${typeof MathTemplateCompiler.generateQuestionFromTemplate}`);
    console.log(`  MathExprEvaluator loaded    : ${!!MathExprEvaluator}`);
    console.log(`  ArrayUtils loaded           : ${!!ArrayUtils}`);

    // Test specified lesson
    const ok = testAllTemplates(LESSON_ID);

    // If bai-1, also test a few more for coverage
    if (LESSON_ID === 'bai-1') {
        console.log('\n[ADDITIONAL COVERAGE — bai-4, bai-11, bai-13]');
        for (const lid of ['bai-4', 'bai-11', 'bai-13']) {
            const f = findCacheFile(lid);
            if (f) {
                const raw = JSON.parse(fs.readFileSync(f, 'utf8'));
                const qs = Array.isArray(raw) ? raw : (raw.questions || []);
                const templates = qs.filter(q => q.isTemplate);
                let passed = 0;
                for (const q of templates) {
                    try {
                        const r = MathTemplateCompiler.generateQuestionFromTemplate(q, 500);
                        if (r && r !== q && (r.question || r.questionText)) passed++;
                    } catch (_) {}
                }
                console.log(`  ${lid}: ${passed}/${templates.length} templates PASS`);
            } else {
                console.log(`  ${lid}: cache not found`);
            }
        }
    }
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
