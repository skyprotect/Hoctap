/**
 * KIOSK WORKER BOTTLENECK MEASUREMENT PROBE
 * Runs scenarios (A through G) in real Chromium against localhost:3000.
 */
'use strict';

const { chromium } = require('@playwright/test');
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const SAMPLE_SIZE = 10;

const SAMPLE_TEMPLATES = [
    {
        isTemplate: true,
        id: 'test-q1',
        type: 'tap-hop',
        questionText: 'Cho tập hợp $A = \\{x \\in \\mathbb{N} \\mid {a} \\le x < {b}\\}$. Số phần tử của tập hợp $A$ là:',
        variables: { a: { min: 2, max: 15 }, b: { min: 20, max: 45 } },
        formulas: { ans: 'b - a', w1: 'b - a + 1', w2: 'b - a - 1', w3: 'b + a' },
        options: ['A. {ans}', 'B. {w1}', 'C. {w2}', 'D. {w3}'],
        correctIndex: 0,
        solutionHtml: 'Số phần tử của tập hợp $A$ là: ${b} - {a} = {ans}$.'
    },
    {
        isTemplate: true,
        id: 'test-q2',
        type: 'ucln',
        questionText: 'Tìm ƯCLN của ${a}$ và ${b}$:',
        variables: { a: { min: 12, max: 60 }, b: { min: 18, max: 90 } },
        formulas: { ans: 'MathUtils.gcd(a, b)', w1: 'MathUtils.gcd(a, b) + 2', w2: 'Math.max(1, MathUtils.gcd(a, b) - 2)', w3: 'MathUtils.lcm(a, b)' },
        options: ['A. {ans}', 'B. {w1}', 'C. {w2}', 'D. {w3}'],
        correctIndex: 0,
        solutionHtml: 'ƯCLN(${a}, ${b}) = {ans}.'
    },
    {
        isTemplate: true,
        id: 'test-q3',
        type: 'phep-tinh',
        questionText: 'Kết quả của phép tính $({a} + {b}) \\times {c}$ là:',
        variables: { a: { min: 5, max: 20 }, b: { min: 3, max: 15 }, c: { min: 2, max: 9 } },
        formulas: { ans: '(a + b) * c', w1: 'a + b * c', w2: '(a + b) * c + 10', w3: '(a + b) * c - 5' },
        options: ['A. {ans}', 'B. {w1}', 'C. {w2}', 'D. {w3}'],
        correctIndex: 0,
        solutionHtml: 'Ta có: $({a} + {b}) \\times {c} = {a + b} \\times {c} = {ans}$.'
    }
];

function calculateStats(samples) {
    if (!samples || samples.length === 0) return { median: 0, min: 0, max: 0, avg: 0, variance: 0 };
    const sorted = [...samples].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const avg = sorted.reduce((sum, v) => sum + v, 0) / sorted.length;
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
    const variance = sorted.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / sorted.length;
    return {
        n: samples.length,
        median: Number(median.toFixed(3)),
        min: Number(min.toFixed(3)),
        max: Number(max.toFixed(3)),
        avg: Number(avg.toFixed(3)),
        variance: Number(variance.toFixed(4))
    };
}

async function isServerRunning(port = 3000) {
    return new Promise((resolve) => {
        const req = http.get(`http://localhost:${port}/api/health`, () => resolve(true));
        req.on('error', () => resolve(false));
        req.setTimeout(1000, () => { req.destroy(); resolve(false); });
    });
}

async function ensureServer() {
    if (await isServerRunning(3000)) return null;
    const serverProc = spawn('node', ['server.js'], { cwd: path.resolve(__dirname, '../../'), stdio: 'ignore' });
    for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 500));
        if (await isServerRunning(3000)) return serverProc;
    }
    throw new Error('Could not start local server on port 3000');
}

async function runProbe() {
    const serverProc = await ensureServer();
    const browser = await chromium.launch({
        headless: true,
        args: ['--disable-cache', '--disk-cache-size=1', '--media-cache-size=1']
    });
    const context = await browser.newContext({ baseURL: 'http://localhost:3000', viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    await page.goto('/student.html');
    await page.waitForFunction(() => window.app && window.app.state);

    const report = {};
    const tenTemplates = Array(10).fill(null).map((_, idx) => SAMPLE_TEMPLATES[idx % SAMPLE_TEMPLATES.length]);

    // Scenario A: Cold Worker Creation & Bootstrap
    const coldWorkerSamples = [];
    for (let i = 0; i < SAMPLE_SIZE; i++) {
        const result = await page.evaluate(async (templates) => {
            const t0 = performance.now();
            return new Promise((resolve, reject) => {
                const worker = new Worker('js/question-generator-worker.js');
                worker.postMessage({ questions: templates.slice(0, 1), maxAttempts: 500 });
                worker.onmessage = (e) => {
                    const tResolved = performance.now();
                    worker.terminate();
                    if (e.data.status === 'success') resolve(tResolved - t0);
                    else reject(new Error(e.data.message));
                };
                worker.onerror = (err) => { worker.terminate(); reject(err); };
            });
        }, SAMPLE_TEMPLATES);
        coldWorkerSamples.push(result);
    }
    report.scenarioA = calculateStats(coldWorkerSamples);

    // Scenario B: First Question Batch Generation (10 templates)
    const firstGenSamples = [];
    for (let i = 0; i < SAMPLE_SIZE; i++) {
        const latency = await page.evaluate(async (templates) => {
            return new Promise((resolve, reject) => {
                const worker = new Worker('js/question-generator-worker.js');
                const t0 = performance.now();
                worker.postMessage({ questions: templates, maxAttempts: 500 });
                worker.onmessage = (e) => {
                    const elapsed = performance.now() - t0;
                    worker.terminate();
                    if (e.data.status === 'success') resolve(elapsed);
                    else reject(new Error(e.data.message));
                };
                worker.onerror = (err) => { worker.terminate(); reject(err); };
            });
        }, tenTemplates);
        firstGenSamples.push(latency);
    }
    report.scenarioB = calculateStats(firstGenSamples);

    // Scenario C: Repeated Generation on Warm Worker
    const warmRuns = await page.evaluate(async (templates) => {
        return new Promise((resolve, reject) => {
            const worker = new Worker('js/question-generator-worker.js');
            const runTimes = [];
            let currentRun = 0;
            function runNext() {
                if (currentRun >= 10) { worker.terminate(); resolve(runTimes); return; }
                const t0 = performance.now();
                worker.postMessage({ questions: templates, maxAttempts: 500 });
                worker.onmessage = (e) => {
                    if (e.data.status === 'success') {
                        runTimes.push(performance.now() - t0);
                        currentRun++;
                        runNext();
                    } else { worker.terminate(); reject(new Error(e.data.message)); }
                };
                worker.onerror = (err) => { worker.terminate(); reject(err); };
            }
            runNext();
        });
    }, tenTemplates);
    report.scenarioC = { allRuns: warmRuns.map(r => Number(r.toFixed(3))), stats: calculateStats(warmRuns) };

    // Scenario D: Ephemeral Worker vs Reused Worker
    const recreationCompare = await page.evaluate(async (templates) => {
        const ephemeralTimes = [];
        for (let i = 0; i < 5; i++) {
            const t0 = performance.now();
            await new Promise((res, rej) => {
                const w = new Worker('js/question-generator-worker.js');
                w.postMessage({ questions: templates, maxAttempts: 500 });
                w.onmessage = (e) => { w.terminate(); if (e.data.status === 'success') res(); else rej(new Error(e.data.message)); };
                w.onerror = rej;
            });
            ephemeralTimes.push(performance.now() - t0);
        }
        const reusedTimes = [];
        const singleWorker = new Worker('js/question-generator-worker.js');
        for (let i = 0; i < 5; i++) {
            const t0 = performance.now();
            await new Promise((res, rej) => {
                singleWorker.postMessage({ questions: templates, maxAttempts: 500 });
                singleWorker.onmessage = (e) => { if (e.data.status === 'success') res(); else rej(new Error(e.data.message)); };
                singleWorker.onerror = rej;
            });
            reusedTimes.push(performance.now() - t0);
        }
        singleWorker.terminate();
        return { ephemeralTimes, reusedTimes };
    }, tenTemplates);
    report.scenarioD = {
        ephemeral: calculateStats(recreationCompare.ephemeralTimes),
        reused: calculateStats(recreationCompare.reusedTimes),
        deltaMedian: Number((calculateStats(recreationCompare.ephemeralTimes).median - calculateStats(recreationCompare.reusedTimes).median).toFixed(3))
    };

    // Scenario E: Main-Thread Direct Compilation (Fallback)
    const mainThreadSamples = [];
    for (let i = 0; i < SAMPLE_SIZE; i++) {
        const latency = await page.evaluate((templates) => {
            const t0 = performance.now();
            templates.map(q => {
                const genQ = window.MathTemplateCompiler.generateQuestionFromTemplate(q, 500);
                genQ.isSpacedRepetition = false;
                genQ.level = 'chat-luong-cao';
                return window.MathTemplateCompiler.sanitizeForClone(genQ);
            });
            return performance.now() - t0;
        }, tenTemplates);
        mainThreadSamples.push(latency);
    }
    report.scenarioE_mainThread = calculateStats(mainThreadSamples);

    // Scenario F: Local Loopback
    const loopbackSamples = [];
    for (let i = 0; i < SAMPLE_SIZE; i++) {
        const latency = await page.evaluate(async (templates) => {
            const t0 = performance.now();
            return new Promise((resolve, reject) => {
                const worker = new Worker('js/question-generator-worker.js');
                worker.postMessage({ questions: templates, maxAttempts: 500 });
                worker.onmessage = (e) => {
                    const elapsed = performance.now() - t0;
                    worker.terminate();
                    if (e.data.status === 'success') resolve(elapsed);
                    else resolve({ failed: true, elapsed, error: e.data.message });
                };
                worker.onerror = (err) => { worker.terminate(); resolve({ failed: true, elapsed: performance.now() - t0, error: err.message }); };
            });
        }, tenTemplates);
        loopbackSamples.push(typeof latency === 'number' ? latency : latency.elapsed);
    }
    report.scenarioF_loopback = calculateStats(loopbackSamples);

    // Scenario G: Semantic Parity Verification
    const parityResult = await page.evaluate(async (template) => {
        const mainResult = window.MathTemplateCompiler.generateQuestionFromTemplate(template, 500);
        const workerResult = await new Promise((resolve, reject) => {
            const worker = new Worker('js/question-generator-worker.js');
            worker.postMessage({ questions: [template], maxAttempts: 500 });
            worker.onmessage = (e) => {
                worker.terminate();
                if (e.data.status === 'success') resolve(e.data.questions[0]);
                else reject(new Error(e.data.message));
            };
            worker.onerror = (err) => { worker.terminate(); reject(err); };
        });
        return {
            hasQuestionText: typeof workerResult.questionText === 'string' && workerResult.questionText.length > 0,
            hasOptions: Array.isArray(workerResult.options) && workerResult.options.length === 4,
            hasSolutionHtml: typeof workerResult.solutionHtml === 'string' && workerResult.solutionHtml.length > 0,
            validCorrectIndex: typeof workerResult.correctIndex === 'number' && workerResult.correctIndex >= 0 && workerResult.correctIndex < 4,
            shapeMatch: mainResult.options.length === workerResult.options.length
        };
    }, SAMPLE_TEMPLATES[0]);
    report.scenarioG_parity = parityResult;

    await browser.close();
    if (serverProc) serverProc.kill();
    return report;
}

if (require.main === module) {
    runProbe().then(r => console.log(JSON.stringify(r, null, 2))).catch(e => { console.error(e); process.exit(1); });
}

module.exports = { runProbe };
