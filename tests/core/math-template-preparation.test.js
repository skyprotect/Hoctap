/**
 * Preparation baseline for the compiler extraction.  These tests deliberately
 * execute the browser/worker script-loading paths instead of relying on CommonJS
 * (where require() would mask an incorrect browser load order).
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '../..');
const core = (name) => fs.readFileSync(path.join(ROOT, 'js/core', name), 'utf8');
const workerSource = fs.readFileSync(path.join(ROOT, 'js/question-generator-worker.js'), 'utf8');
const sampleTemplate = {
    isTemplate: true,
    questionText: 'Tính {a} + {b}',
    variables: { a: { fixed: 2 }, b: { fixed: 3 } },
    formulas: { ans: 'a + b', w1: 'a + b + 1', w2: 'a + b + 2', w3: 'a + b + 3' },
    options: ['A. {ans}', 'B. {w1}', 'C. {w2}', 'D. {w3}'],
    correctIndex: 0,
    solutionHtml: 'Đáp án đúng là {ans_letter}'
};

function makeContext(extra) {
    const context = { console, Math: Object.create(Math), ...extra };
    context.globalThis = context;
    context.window = context;
    context.self = context;
    return vm.createContext(context);
}

function run(context, source, filename) {
    vm.runInContext(source, context, { filename });
}

function compileInBrowser(order, withArrayUtils = true) {
    const context = makeContext();
    run(context, core('math-expr-evaluator.js'), 'math-expr-evaluator.js');
    for (const item of order) {
        if (item === 'array-utils' && withArrayUtils) run(context, core('array-utils.js'), 'array-utils.js');
        if (item === 'compiler') run(context, core('math-template-compiler.js'), 'math-template-compiler.js');
    }
    return { context, result: context.MathTemplateCompiler.generateQuestionFromTemplate(sampleTemplate) };
}

function runWorker(withArrayUtils) {
    const posted = [];
    const sources = {
        'core/math-utils.js': core('math-utils.js'),
        'core/math-expr-evaluator.js': core('math-expr-evaluator.js'),
        'core/math-template-compiler.js': core('math-template-compiler.js')
    };
    if (withArrayUtils) sources['core/array-utils.js'] = core('array-utils.js');
    const context = makeContext({ postMessage: (message) => posted.push(message) });
    context.importScripts = (...names) => names.forEach((name) => {
        if (!sources[name]) throw new Error(`Unable to load ${name}`);
        run(context, sources[name], name);
    });
    run(context, workerSource, 'question-generator-worker.js');
    context.onmessage({ data: { questions: [sampleTemplate], maxAttempts: 20 } });
    return posted[0];
}

function assertCompiled(question, template = sampleTemplate) {
    // Curly braces are valid LaTex syntax (for example \overline{abcd}); only
    // source placeholder names are evidence of a failed substitution.
    const placeholderNames = [
        ...Object.keys(template.variables || {}),
        ...Object.keys(template.formulas || {}),
        'ans_letter'
    ];
    const unresolved = new RegExp(`\\{(?:${placeholderNames.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\}`);
    expect(question.isTemplateInstance).toBe(true);
    expect(question.questionText).not.toMatch(unresolved);
    expect(question.questionText).not.toContain('NaN');
    expect(question.options).toHaveLength(4);
    question.options.forEach((option) => {
        expect(option).not.toMatch(unresolved);
        expect(option).not.toContain('NaN');
    });
    expect(question.correctIndex).toBeGreaterThanOrEqual(0);
    expect(question.correctIndex).toBeLessThan(question.options.length);
}

describe('ArrayUtils loading characterization', () => {
    test('browser: ArrayUtils before compiler is captured and used for shuffle', () => {
        const context = makeContext();
        run(context, core('math-expr-evaluator.js'), 'math-expr-evaluator.js');
        run(context, core('array-utils.js'), 'array-utils.js');
        const originalShuffle = context.ArrayUtils.shuffle;
        const shuffleSpy = jest.fn((items) => originalShuffle(items));
        context.ArrayUtils.shuffle = shuffleSpy;
        run(context, core('math-template-compiler.js'), 'math-template-compiler.js');
        const result = context.MathTemplateCompiler.generateQuestionFromTemplate(sampleTemplate);
        assertCompiled(result);
        expect(shuffleSpy).toHaveBeenCalled();
    });

    test('browser: ArrayUtils after compiler remains a captured empty dependency but preserves the output contract', () => {
        const { context, result } = compileInBrowser(['compiler', 'array-utils']);
        assertCompiled(result);
        const replacementShuffle = jest.fn();
        context.ArrayUtils.shuffle = replacementShuffle;
        context.MathTemplateCompiler.generateQuestionFromTemplate(sampleTemplate);
        expect(replacementShuffle).not.toHaveBeenCalled();
    });

    test('browser: unavailable ArrayUtils uses the compiler fallback without a runtime exception', () => {
        const { result } = compileInBrowser(['compiler'], false);
        assertCompiled(result);
    });

    test('worker: available ArrayUtils compiles a template and posts a safe success result', () => {
        const response = runWorker(true);
        expect(response.status).toBe('success');
        assertCompiled(response.questions[0]);
        expect(() => structuredClone(response)).not.toThrow();
    });

    test('worker: ArrayUtils is not a harness dependency because the compiler owns its fallback', () => {
        const response = runWorker(false);
        expect(response.status).toBe('success');
        assertCompiled(response.questions[0]);
    });
});

describe('production-template fixture baseline', () => {
    const loadFixture = () => fs.readdirSync(path.join(ROOT, 'exams'))
        .filter((file) => /^pregen-bai-\d+\.json$/.test(file))
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        .flatMap((file) => {
            const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'exams', file), 'utf8'));
            return (data.questions || []).filter((question) => question && question.isTemplate)
                .map((question) => ({ file, question }));
        }).slice(0, 46);

    test('the first deterministic 46 production math templates compile with no unresolved placeholders or NaN', () => {
        const templates = loadFixture();

        expect(templates).toHaveLength(46);
        const compiler = require('../../js/core/math-template-compiler');
        templates.forEach(({ file, question }, index) => {
            let compiled;
            try {
                compiled = compiler.generateQuestionFromTemplate(question, 500);
            } catch (error) {
                throw new Error(`${file} template #${index + 1}: ${error.message}`);
            }
            assertCompiled(compiled, question);
        });
    });

    test('main and worker exports have exact deterministic parity for the 46-template fixture', () => {
        const main = require('../../js/questions-v3');
        const worker = require('../../js/question-generator-worker');
        const fields = ['questionText', 'options', 'correctIndex', 'solutionHtml', 'hints', 'tip', 'type', 'level', 'isTemplateInstance'];
        const originalRandom = Math.random;
        const seededRandom = () => {
            let state = 0x12345678;
            return () => {
                state = (state * 1664525 + 1013904223) >>> 0;
                return state / 0x100000000;
            };
        };
        try {
            loadFixture().forEach(({ file, question }, index) => {
                Math.random = seededRandom();
                const mainResult = main.generateQuestionFromTemplate(JSON.parse(JSON.stringify(question)), 500);
                Math.random = seededRandom();
                const workerResult = worker.generateQuestionFromTemplate(JSON.parse(JSON.stringify(question)), 500);
                const projection = (result) => Object.fromEntries(fields.map((field) => [field, result[field]]));
                expect(projection(workerResult)).toEqual(projection(mainResult));
                assertCompiled(mainResult, question);
            });
        } finally {
            Math.random = originalRandom;
        }
    });
});
