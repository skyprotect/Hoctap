/**
 * @file math-question-mode.test.js
 * Test suite kiểm thử toàn diện cơ chế phân định ranh giới chế độ câu hỏi Toán (MCQ vs Short Answer)
 * bao phủ Lớp 1, Lớp 4, AI Templates, Lớp 6 và bộ phân loại cốt lõi MathQuestionClassifier.
 */

const MathQuestionClassifier = require('../../js/core/math-question-classifier');
const MathTemplateCompiler = require('../../js/core/math-template-compiler');
const workerGenerator = require('../../js/question-generator-worker');
const questions = require('../../js/questions-v3');
const questionsL1 = require('../../js/questions-v1');
const questionsL4 = require('../../js/questions-v4');

describe("CYCLE-MATH-QUESTION-MODE-BOUNDARY Test Suite", () => {

    // -------------------------------------------------------------------------
    // 1. CANONICAL OWNER (MathQuestionClassifier) CONTRACT
    // -------------------------------------------------------------------------
    describe("1. MathQuestionClassifier API & Contract", () => {
        test("shouldForceMCQ preserves characterization behavior", () => {
            expect(MathQuestionClassifier.shouldForceMCQ("Trong các khẳng định sau, khẳng định nào đúng?", "A")).toBe(true);
            expect(MathQuestionClassifier.shouldForceMCQ("Tính 10 + 20:", "30")).toBe(false);
        });

        test("isForceMCQ respects explicit boolean forceMCQ when present", () => {
            expect(MathQuestionClassifier.isForceMCQ({ forceMCQ: true })).toBe(true);
            expect(MathQuestionClassifier.isForceMCQ({ forceMCQ: false })).toBe(false);
            expect(MathQuestionClassifier.isForceMCQ({ questionText: "Tính 10 + 20:", options: ["30"], correctIndex: 0, forceMCQ: true })).toBe(true);
            expect(MathQuestionClassifier.isForceMCQ({ questionText: "Khẳng định nào đúng?", options: ["A"], correctIndex: 0, forceMCQ: false })).toBe(false);
        });

        test("isForceMCQ extracts and classifies dynamically when forceMCQ is undefined", () => {
            const mcqQ = {
                questionText: "Số nào dưới đây lớn nhất?",
                options: ["$3$", "$7$", "$5$"],
                correctIndex: 1
            };
            expect(MathQuestionClassifier.isForceMCQ(mcqQ)).toBe(true);

            const saQ = {
                questionText: "Tính giá trị của 12 + 18:",
                options: ["30", "32", "28"],
                correctIndex: 0
            };
            expect(MathQuestionClassifier.isForceMCQ(saQ)).toBe(false);
        });

        test("isForceMCQ handles boundary / non-object inputs safely", () => {
            expect(MathQuestionClassifier.isForceMCQ(null)).toBe(false);
            expect(MathQuestionClassifier.isForceMCQ(undefined)).toBe(false);
            expect(MathQuestionClassifier.isForceMCQ("not an object")).toBe(false);
            expect(MathQuestionClassifier.isForceMCQ(123)).toBe(false);
        });

        test("normalizeQuestionMode assigns explicit boolean forceMCQ", () => {
            const q = {
                questionText: "Khẳng định nào đúng?",
                options: ["A", "B"],
                correctIndex: 0
            };
            const normalized = MathQuestionClassifier.normalizeQuestionMode(q);
            expect(normalized).toBe(q);
            expect(normalized.forceMCQ).toBe(true);

            const q2 = {
                questionText: "Tính: 5 + 5",
                options: ["10"],
                correctIndex: 0
            };
            MathQuestionClassifier.normalizeQuestionMode(q2);
            expect(q2.forceMCQ).toBe(false);
        });

        test("questions-v3 delegates isForceMCQ and normalizeQuestionMode accurately", () => {
            expect(typeof questions.isForceMCQ).toBe('function');
            expect(typeof questions.normalizeQuestionMode).toBe('function');

            const testQ1 = { questionText: "Số nào dưới đây bé nhất?", options: ["1", "2"], correctIndex: 0 };
            expect(questions.isForceMCQ(testQ1)).toBe(true);

            const testQ2 = { questionText: "Tính 25 + 25:", options: ["50"], correctIndex: 0 };
            expect(questions.isForceMCQ(testQ2)).toBe(false);
        });
    });

    // -------------------------------------------------------------------------
    // 2. GRADE 1 (L1) PRODUCER & MODE RESOLUTION
    // -------------------------------------------------------------------------
    describe("2. Grade 1 (L1) Question Mode Resolution", () => {
        test("Direct questionsL1.generateQuestion produces explicit boolean forceMCQ", () => {
            // Dạng có từ khóa MCQ "dưới đây"
            const qDefault = questionsL1.generateQuestion("invalid-type");
            expect(typeof qDefault.forceMCQ).toBe('boolean');
            expect(qDefault.forceMCQ).toBe(true);

            // Dạng tính toán cộng trừ phạm vi 10
            const qMath = questionsL1.generateQuestion("l1-cac-so-0-5-d1");
            expect(typeof qMath.forceMCQ).toBe('boolean');
        });

        test("questions.generateQuestion for L1 ensures deterministic forceMCQ", () => {
            const q = questions.generateQuestion("l1-cac-so-0-5-d1", "co-ban");
            expect(typeof q.forceMCQ).toBe('boolean');
        });
    });

    // -------------------------------------------------------------------------
    // 3. GRADE 4 (L4) PRODUCER & MODE RESOLUTION
    // -------------------------------------------------------------------------
    describe("3. Grade 4 (L4) Question Mode Resolution", () => {
        test("Direct questionsL4.generateQuestion produces explicit boolean forceMCQ", () => {
            // Câu cấu tạo số có từ khóa "dưới đây" và biểu thức cộng hàng
            const qOnTap = questionsL4.generateQuestion("l4-on-tap-100k");
            expect(typeof qOnTap.forceMCQ).toBe('boolean');
        });

        test("questions.generateQuestion for L4 ensures deterministic forceMCQ", () => {
            const q = questions.generateQuestion("l4-on-tap-100k", "co-ban");
            expect(typeof q.forceMCQ).toBe('boolean');
        });
    });

    // -------------------------------------------------------------------------
    // 4. AI TEMPLATES PRODUCER & COMPILER
    // -------------------------------------------------------------------------
    describe("4. AI Template Question Mode Compilation", () => {
        test("MathTemplateCompiler assigns forceMCQ based on questionText and options", () => {
            // Template câu hỏi lý thuyết MCQ
            const mcqTemplate = {
                isTemplate: true,
                questionText: "Trong các khẳng định sau, khẳng định nào đúng?",
                options: ["A. Số 0 là số tự nhiên", "B. Số nguyên tố luôn là số lẻ", "C. Không có đáp án"],
                correctIndex: 0,
                solutionHtml: "Đáp án đúng là A."
            };
            const compiledMCQ = MathTemplateCompiler.generateQuestionFromTemplate(mcqTemplate);
            expect(compiledMCQ.forceMCQ).toBe(true);

            // Template câu hỏi số học đơn giản
            const mathTemplate = {
                isTemplate: true,
                variables: {
                    a: { min: 10, max: 20 },
                    b: { min: 5, max: 15 }
                },
                formulas: {
                    ans: "a + b",
                    w1: "ans + 2",
                    w2: "ans - 2",
                    w3: "ans + 5"
                },
                questionText: "Tính giá trị của biểu thức: {a} + {b} = ?",
                options: ["{ans}", "{w1}", "{w2}", "{w3}"],
                correctIndex: 0,
                solutionHtml: "Ta có: {a} + {b} = {ans}."
            };
            const compiledMath = MathTemplateCompiler.generateQuestionFromTemplate(mathTemplate);
            expect(compiledMath.forceMCQ).toBe(false);
        });

        test("MathTemplateCompiler preserves explicit template forceMCQ override", () => {
            const explicitMCQ = {
                isTemplate: true,
                forceMCQ: true,
                questionText: "Tính: 5 + 5",
                options: ["10", "12", "8"],
                correctIndex: 0
            };
            const res1 = MathTemplateCompiler.generateQuestionFromTemplate(explicitMCQ);
            expect(res1.forceMCQ).toBe(true);

            const explicitSA = {
                isTemplate: true,
                forceMCQ: false,
                questionText: "Khẳng định nào đúng?",
                options: ["Đúng", "Sai"],
                correctIndex: 0
            };
            const res2 = MathTemplateCompiler.generateQuestionFromTemplate(explicitSA);
            expect(res2.forceMCQ).toBe(false);
        });

        test("Web Worker compiler generator produces forceMCQ on compiled questions", () => {
            const template = {
                isTemplate: true,
                questionText: "Khẳng định nào sau đây là sai?",
                options: ["A", "B", "C"],
                correctIndex: 0
            };
            const compiled = workerGenerator.generateQuestionFromTemplate(template);
            expect(compiled.forceMCQ).toBe(true);
        });
    });

    // -------------------------------------------------------------------------
    // 5. SHORT ANSWER ASSIGNMENT SAFETY IN EXAM WORKFLOWS
    // -------------------------------------------------------------------------
    describe("5. Short Answer Assignment Safety", () => {
        test("Questions with forceMCQ === true are never converted to isShortAnswer", () => {
            // Giả lập danh sách câu hỏi kiểm tra
            const currentQuestions = [
                { id: "q1", questionText: "Số nào dưới đây lớn nhất?", options: ["1", "2"], correctIndex: 0, forceMCQ: true, isShortAnswer: false },
                { id: "q2", questionText: "Tính 10 + 20:", options: ["30", "40"], correctIndex: 0, forceMCQ: false, isShortAnswer: false },
                { id: "q3", questionText: "Khẳng định nào đúng?", options: ["A", "B"], correctIndex: 0, forceMCQ: true, isShortAnswer: false },
                { id: "q4", questionText: "Tính 5 x 4:", options: ["20", "25"], correctIndex: 0, forceMCQ: false, isShortAnswer: false }
            ];

            // Mô phỏng thuật toán phân bổ short answer của questions-v3
            let shortAnswerAssigned = 0;
            const targetShortAnswerCount = 2;
            for (let i = currentQuestions.length - 1; i >= 0; i--) {
                const q = currentQuestions[i];
                const forceMCQ = questions.isForceMCQ(q);
                q.forceMCQ = forceMCQ;
                if (shortAnswerAssigned < targetShortAnswerCount && !forceMCQ) {
                    q.isShortAnswer = true;
                    shortAnswerAssigned++;
                } else {
                    q.isShortAnswer = false;
                }
            }

            // q4 (5x4) -> Short Answer
            expect(currentQuestions[3].isShortAnswer).toBe(true);
            // q3 (Khẳng định nào đúng) -> BẮT BUỘC MCQ, không được thành Short Answer!
            expect(currentQuestions[2].isShortAnswer).toBe(false);
            // q2 (10+20) -> Short Answer
            expect(currentQuestions[1].isShortAnswer).toBe(true);
            // q1 (Số nào dưới đây lớn nhất) -> BẮT BUỘC MCQ!
            expect(currentQuestions[0].isShortAnswer).toBe(false);
        });

        test("Undefined forceMCQ in raw question is safely evaluated instead of falsely converting", () => {
            const rawQWithoutForceMCQ = {
                questionText: "Trong các phát biểu dưới đây, phát biểu nào sai?",
                options: ["A", "B", "C", "D"],
                correctIndex: 0
                // forceMCQ is undefined
            };

            // Phải nhận diện là forceMCQ = true
            expect(questions.isForceMCQ(rawQWithoutForceMCQ)).toBe(true);

            // Khi chạy qua vòng lặp phân bổ
            const forceMCQ = questions.isForceMCQ(rawQWithoutForceMCQ);
            rawQWithoutForceMCQ.forceMCQ = forceMCQ;
            if (!forceMCQ) {
                rawQWithoutForceMCQ.isShortAnswer = true;
            } else {
                rawQWithoutForceMCQ.isShortAnswer = false;
            }

            expect(rawQWithoutForceMCQ.isShortAnswer).toBe(false);
            expect(rawQWithoutForceMCQ.forceMCQ).toBe(true);
        });
    });
});
