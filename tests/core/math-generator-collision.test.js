const fs = require('fs');
const path = require('path');
const QuestionEngineV3 = require('../../js/questions-v3');
const MathTemplateCompiler = require('../../js/core/math-template-compiler');
const MathAnswerEvaluator = require('../../js/core/math-answer-evaluator');

describe('CYCLE-MATH-GENERATOR-COLLISION-HARDENING: MCQ Option Uniqueness and Invariant Tests', () => {

    function checkPairwiseCollision(optA, optB) {
        if (optA === optB) return true;
        const cleanA = typeof optA === 'string' ? optA.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim() : String(optA);
        const cleanB = typeof optB === 'string' ? optB.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim() : String(optB);
        if (cleanA === cleanB) return true;

        const normA = cleanA.replace(/[\$\s\{\}\\_\'\"]/g, '').toLowerCase();
        const normB = cleanB.replace(/[\$\s\{\}\\_\'\"]/g, '').toLowerCase();
        if (normA === normB) return true;

        const numA = parseFloat(cleanA.replace(/[^0-9\.\,\-]/g, '').replace(',', '.'));
        const numB = parseFloat(cleanB.replace(/[^0-9\.\,\-]/g, '').replace(',', '.'));
        if (!isNaN(numA) && !isNaN(numB) && numA === numB) {
            const unitA = cleanA.replace(/[\$\-\d\.\,\s\{\}\\]/g, '').trim();
            const unitB = cleanB.replace(/[\$\-\d\.\,\s\{\}\\]/g, '').trim();
            if (unitA === unitB) return true;
        }

        return false;
    }

    test('ensureUniqueOptions invariant: all 51 generator types produce 4 distinct options across all levels', () => {
        const codeV3 = fs.readFileSync(path.join(__dirname, '../../js/questions-v3.js'), 'utf8');
        const caseRegex = /case\s+\"([^\"]+)\":/g;
        const v3Types = [];
        let match;
        while ((match = caseRegex.exec(codeV3)) !== null) {
            if (!v3Types.includes(match[1])) v3Types.push(match[1]);
        }

        expect(v3Types.length).toBeGreaterThanOrEqual(45);

        for (const type of v3Types) {
            for (const level of ['co-ban', 'nang-cao', 'kho']) {
                for (let iter = 0; iter < 10; iter++) {
                    const q = QuestionEngineV3.generateQuestion(type, level);
                    expect(q).toBeDefined();
                    expect(Array.isArray(q.options)).toBe(true);
                    expect(q.options.length).toBe(4);
                    expect(q.correctIndex).toBeGreaterThanOrEqual(0);
                    expect(q.correctIndex).toBeLessThan(4);

                    const correctVal = q.options[q.correctIndex];
                    expect(correctVal).toBeDefined();
                    expect(correctVal.trim().length).toBeGreaterThan(0);

                    for (let i = 0; i < q.options.length; i++) {
                        for (let j = i + 1; j < q.options.length; j++) {
                            const collides = checkPairwiseCollision(q.options[i], q.options[j]);
                            if (collides) {
                                throw new Error(`Collision in [${type}] level [${level}]: "${q.options[i]}" === "${q.options[j]}" in [${q.options.join(', ')}]`);
                            }
                            expect(collides).toBe(false);
                        }
                    }
                }
            }
        }
    });

    test('Edge case regression: goc nang-cao (n=5 boundary collision)', () => {
        for (let iter = 0; iter < 20; iter++) {
            const q = QuestionEngineV3.generateQuestion('goc', 'nang-cao');
            expect(q.options.length).toBe(4);
            const set = new Set(q.options);
            expect(set.size).toBe(4);
        }
    });

    test('Edge case regression: doan-thang nang-cao (n=5 and ob = 2*oa)', () => {
        for (let iter = 0; iter < 20; iter++) {
            const q = QuestionEngineV3.generateQuestion('doan-thang', 'nang-cao');
            expect(q.options.length).toBe(4);
            const set = new Set(q.options);
            expect(set.size).toBe(4);
        }
    });

    test('Edge case regression: nhan-so-nguyen nang-cao (correctVal = 0)', () => {
        for (let iter = 0; iter < 20; iter++) {
            const q = QuestionEngineV3.generateQuestion('nhan-so-nguyen', 'nang-cao');
            expect(q.options.length).toBe(4);
            const set = new Set(q.options);
            expect(set.size).toBe(4);
        }
    });

    test('Edge case regression: chu-vi-dien-tich nang-cao (d1*d2 and 2*S)', () => {
        for (let iter = 0; iter < 20; iter++) {
            const q = QuestionEngineV3.generateQuestion('chu-vi-dien-tich', 'nang-cao');
            expect(q.options.length).toBe(4);
            const set = new Set(q.options);
            expect(set.size).toBe(4);
        }
    });

    test('Edge case regression: hinh-hoc-chuong-4 and hinh-hoc-2-chuong-4', () => {
        for (let iter = 0; iter < 20; iter++) {
            const q1 = QuestionEngineV3.generateQuestion('hinh-hoc-chuong-4', 'nang-cao');
            const q2 = QuestionEngineV3.generateQuestion('hinh-hoc-2-chuong-4', 'nang-cao');
            expect(q1.options.length).toBe(4);
            expect(q2.options.length).toBe(4);
            expect(new Set(q1.options).size).toBe(4);
            expect(new Set(q2.options).size).toBe(4);
        }
    });

    test('MathTemplateCompiler ensures unique options and valid correctIndex for templates', () => {
        const sampleTemplate = {
            isTemplate: true,
            variables: {
                a: { min: 5, max: 10, step: 1 }
            },
            formulas: {
                ans: 'a * 2',
                w1: 'a * 2',
                w2: 'a * 2',
                w3: 'a * 2'
            },
            questionText: 'Tính 2 lần của {a}:',
            options: ['A. {ans}', 'B. {w1}', 'C. {w2}', 'D. {w3}'],
            solutionHtml: 'Đáp án là {ans}.'
        };

        const compiled = MathTemplateCompiler.generateQuestionFromTemplate(sampleTemplate);
        expect(compiled).toBeDefined();
        expect(compiled.options.length).toBe(4);
        const cleanOpts = compiled.options.map(opt => opt.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim());
        const set = new Set(cleanOpts);
        expect(set.size).toBe(4);
        expect(compiled.correctIndex).toBeGreaterThanOrEqual(0);
        expect(compiled.correctIndex).toBeLessThan(4);
    });
});
