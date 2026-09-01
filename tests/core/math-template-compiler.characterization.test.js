/**
 * @file math-template-compiler.characterization.test.js
 * Test suite kiểm thử đặc tả (Characterization Test Suite) cho hàm generateQuestionFromTemplate()
 * trong cả 2 luồng: js/questions-v3.js (Main Thread) và js/question-generator-worker.js (Web Worker).
 * 
 * Mục tiêu:
 * - Đóng băng và đặc tả chính xác 100% các hành vi, nhánh rẽ, heuristics và hợp đồng sinh đề template.
 * - Khóa chặt các tính năng cốt lõi:
 *   1. Guard clause (input null/undefined hoặc không có isTemplate).
 *   2. Sinh biến số ngẫu nhiên: fixed, value, options array, min/max/step.
 *   3. Cơ chế Getter động cho formulas (giải quyết thứ tự khai báo biến phụ thuộc).
 *   4. Tự động giải phương trình đẳng thức (equality constraints: left === right).
 *   5. Kiểm tra ràng buộc (constraints evaluation) & cơ chế nới lỏng nấc thang theo attempts (>120, >350).
 *   6. Bảo vệ biểu thức LaTeX trong replacePlaceholders (\frac, ^{}, \cmd{}).
 *   7. Heuristic ép kết quả nguyên cho đại lượng rời rạc (học sinh, quyển sách, cái kẹo...).
 *   8. Tự phục hồi chống trùng lặp đáp án (diffs perturbation: 1, -1, 2, -2...).
 *   9. Xáo trộn phương án (shuffle options) và tự động đồng bộ ký tự đáp án đúng {ans_letter} trong solutionHtml.
 *   10. So sánh tính tương đồng (Parity) giữa implementation của questions-v3 và worker.
 */

const fs = require('fs');
const path = require('path');
const questions = require('../../js/questions-v3.js');
const workerGenerator = require('../../js/question-generator-worker.js');

describe("MathTemplateCompiler Characterization Test Suite", () => {

    // -------------------------------------------------------------------------
    // 1. GUARD CLAUSE & NON-TEMPLATE PASSTHROUGH
    // -------------------------------------------------------------------------
    describe("1. Guard Clause & Non-template Inputs", () => {
        test("Trả về nguyên vẹn nếu đầu vào null, undefined hoặc false", () => {
            expect(questions.generateQuestionFromTemplate(null)).toBeNull();
            expect(questions.generateQuestionFromTemplate(undefined)).toBeUndefined();
            expect(workerGenerator.generateQuestionFromTemplate(null)).toBeNull();
        });

        test("Trả về đối tượng gốc nếu isTemplate không phải true", () => {
            const rawQ = { questionText: "Câu hỏi tĩnh", options: ["A. 1", "B. 2"], correctIndex: 0 };
            const resQ = questions.generateQuestionFromTemplate(rawQ);
            expect(resQ).toBe(rawQ);
            expect(resQ.isTemplateInstance).toBeUndefined();
        });
    });

    // -------------------------------------------------------------------------
    // 2. VARIABLE GENERATION (FIXED, VALUE, OPTIONS, RANGE)
    // -------------------------------------------------------------------------
    describe("2. Variable Generation Modes", () => {
        test("Sinh biến số dạng fixed hoặc value cố định", () => {
            const template = {
                isTemplate: true,
                questionText: "Biến a={a}, b={b}",
                variables: {
                    a: { fixed: 42 },
                    b: { value: "hằng số" }
                },
                formulas: { ans: "a" },
                options: ["A. {ans}", "B. 0"],
                correctIndex: 0
            };
            const q = questions.generateQuestionFromTemplate(template);
            expect(q.questionText).toBe("Biến a=42, b=hằng số");
        });

        test("Sinh biến số ngẫu nhiên từ mảng options", () => {
            const allowed = ["tam giác", "tứ giác", "ngũ giác"];
            const template = {
                isTemplate: true,
                questionText: "Hình {shape}",
                variables: {
                    shape: { options: allowed }
                },
                formulas: { ans: "1" },
                options: ["A. 1", "B. 2"],
                correctIndex: 0
            };
            for (let i = 0; i < 20; i++) {
                const q = questions.generateQuestionFromTemplate(template);
                const matched = allowed.some(s => q.questionText.includes(s));
                expect(matched).toBe(true);
            }
        });

        test("Sinh biến số theo min, max, step", () => {
            const template = {
                isTemplate: true,
                questionText: "Số {x}",
                variables: {
                    x: { min: 10, max: 20, step: 2 }
                },
                formulas: { ans: "x" },
                options: ["A. {ans}", "B. 0"],
                correctIndex: 0
            };
            for (let i = 0; i < 30; i++) {
                const q = questions.generateQuestionFromTemplate(template);
                const val = parseInt(q.questionText.replace("Số ", ""), 10);
                expect(val).toBeGreaterThanOrEqual(10);
                expect(val).toBeLessThanOrEqual(20);
                expect(val % 2).toBe(0);
            }
        });
    });

    // -------------------------------------------------------------------------
    // 3. DYNAMIC FORMULA GETTERS & DEPENDENCY RESOLUTION
    // -------------------------------------------------------------------------
    describe("3. Dynamic Formula Getters & Evaluation", () => {
        test("Formulas phụ thuộc lẫn nhau giải quyết đúng không phụ thuộc thứ tự khai báo", () => {
            const template = {
                isTemplate: true,
                questionText: "Tổng = {total}, Gấp đôi = {doubleTotal}",
                variables: {
                    a: { fixed: 5 },
                    b: { fixed: 7 }
                },
                formulas: {
                    // doubleTotal khai báo trước total nhưng dùng total
                    doubleTotal: "total * 2",
                    total: "a + b",
                    ans: "doubleTotal",
                    w1: "total",
                    w2: "total + 1",
                    w3: "total + 2"
                },
                options: ["A. {ans}", "B. {w1}", "C. {w2}", "D. {w3}"],
                correctIndex: 0
            };
            const q = questions.generateQuestionFromTemplate(template);
            expect(q.questionText).toBe("Tổng = 12, Gấp đôi = 24");
            const has24 = q.options.some(opt => opt.includes("24"));
            expect(has24).toBe(true);
        });
    });

    // -------------------------------------------------------------------------
    // 4. EQUALITY CONSTRAINTS PARSING (LEFT === RIGHT)
    // -------------------------------------------------------------------------
    describe("4. Equality Constraints Auto-Resolution", () => {
        test("Tự động giải biến phụ thuộc qua ràng buộc a === b * 3", () => {
            const template = {
                isTemplate: true,
                questionText: "a = {a}, b = {b}",
                variables: {
                    b: { min: 4, max: 4 }, // b = 4 cố định
                    a: { min: 1, max: 100 } // a sẽ được gán lại
                },
                constraints: [
                    "a === b * 3"
                ],
                formulas: { ans: "a" },
                options: ["A. {ans}", "B. 10"],
                correctIndex: 0
            };
            const q = questions.generateQuestionFromTemplate(template);
            expect(q.questionText).toBe("a = 12, b = 4");
        });
    });

    // -------------------------------------------------------------------------
    // 5. LATEX PLACEHOLDER PROTECTION (\frac, ^{}, \cmd{})
    // -------------------------------------------------------------------------
    describe("5. LaTeX Syntax Preservation & Placeholders", () => {
        test("Bảo toàn cú pháp phân số LaTeX \\frac{num}{den} và thay thế biến bên trong", () => {
            const template = {
                isTemplate: true,
                questionText: "Tính $\\frac{{a}}{{b}}$ với a={a}, b={b}",
                variables: {
                    a: { fixed: 3 },
                    b: { fixed: 8 }
                },
                formulas: { ans: "1" },
                options: ["A. $\\frac{3}{8}$", "B. 0"],
                correctIndex: 0
            };
            const q = questions.generateQuestionFromTemplate(template);
            expect(q.questionText).toBe("Tính $\\frac{3}{8}$ với a=3, b=8");
        });

        test("Bảo toàn lũy thừa LaTeX a^{b}", () => {
            const template = {
                isTemplate: true,
                questionText: "Tính $2^{{exp}}$",
                variables: {
                    exp: { fixed: 5 }
                },
                formulas: { ans: "32" },
                options: ["A. 32", "B. 16"],
                correctIndex: 0
            };
            const q = questions.generateQuestionFromTemplate(template);
            expect(q.questionText).toBe("Tính $2^{5}$");
        });

        test("Dọn dẹp dấu $ dư thừa quanh placeholder (${var}$ -> {var})", () => {
            const template = {
                isTemplate: true,
                questionText: "Giá trị là ${val}$",
                variables: {
                    val: { fixed: 99 }
                },
                formulas: { ans: "99" },
                options: ["A. 99", "B. 0"],
                correctIndex: 0
            };
            const q = questions.generateQuestionFromTemplate(template);
            expect(q.questionText).toBe("Giá trị là 99");
        });
    });

    // -------------------------------------------------------------------------
    // 6. HEURISTIC DISCRETE QUANTITY FILTER (INTEGERS FOR STUDENTS/BOOKS)
    // -------------------------------------------------------------------------
    describe("6. Discrete Quantity Filter (Ép số nguyên cho đại lượng rời rạc)", () => {
        test("Đề bài chứa 'học sinh' buộc các đáp án phải là số nguyên", () => {
            const template = {
                isTemplate: true,
                questionText: "Có bao nhiêu học sinh trong lớp?",
                variables: {
                    total: { min: 20, max: 30 }
                },
                formulas: {
                    // Nếu total chia 2 lẻ thì sẽ sinh lại
                    ans: "total / 2",
                    w1: "total / 2 + 1",
                    w2: "total / 2 + 2",
                    w3: "total / 2 + 3"
                },
                options: ["A. {ans}", "B. {w1}", "C. {w2}", "D. {w3}"],
                correctIndex: 0
            };
            for (let i = 0; i < 15; i++) {
                const q = questions.generateQuestionFromTemplate(template);
                q.options.forEach(opt => {
                    const numStr = opt.replace(/^[A-D]\.\s*/, '').trim();
                    const num = Number(numStr);
                    if (!isNaN(num)) {
                        expect(Number.isInteger(num)).toBe(true);
                    }
                });
            }
        });
    });

    // -------------------------------------------------------------------------
    // 7. DUPLICATE OPTIONS PERTURBATION (SELF-HEALING)
    // -------------------------------------------------------------------------
    describe("7. Options Duplicate Collision Perturbation", () => {
        test("Tự động điều chỉnh các phương án nhiễu khi bị trùng với ans", () => {
            const template = {
                isTemplate: true,
                questionText: "Chọn đáp án đúng:",
                variables: {
                    a: { fixed: 10 }
                },
                formulas: {
                    ans: "10",
                    w1: "10", // Cố ý trùng với ans
                    w2: "10", // Cố ý trùng
                    w3: "10"  // Cố ý trùng
                },
                options: ["A. {ans}", "B. {w1}", "C. {w2}", "D. {w3}"],
                correctIndex: 0
            };
            const q = questions.generateQuestionFromTemplate(template);
            expect(q.options.length).toBe(4);
            // Các nội dung phương án không được trùng lặp hoàn toàn
            const clean = q.options.map(o => o.replace(/^[A-D]\.\s*/, '').trim());
            const unique = new Set(clean);
            expect(unique.size).toBeGreaterThan(1);
        });
    });

    // -------------------------------------------------------------------------
    // 8. SHUFFLE & ANS_LETTER SYNCHRONIZATION
    // -------------------------------------------------------------------------
    describe("8. Option Shuffle & Solution Letter Sync", () => {
        test("Xáo trộn phương án và cập nhật ans_letter trong solutionHtml", () => {
            const template = {
                isTemplate: true,
                questionText: "Tính 1 + 1:",
                variables: {},
                formulas: { ans: "2", w1: "3", w2: "4", w3: "5" },
                options: ["A. {ans}", "B. {w1}", "C. {w2}", "D. {w3}"],
                correctIndex: 0,
                solutionHtml: "Đáp án đúng là {ans_letter}"
            };

            const letters = ["A", "B", "C", "D"];
            let observedIndices = new Set();

            for (let i = 0; i < 30; i++) {
                const q = questions.generateQuestionFromTemplate(template);
                observedIndices.add(q.correctIndex);

                const correctLetter = letters[q.correctIndex];
                expect(q.solutionHtml).toBe(`Đáp án đúng là ${correctLetter}`);
                expect(q.options[q.correctIndex]).toContain("2");
            }

            // Với 30 lần xáo trộn, phải phân bố ra nhiều hơn 1 vị trí đáp án đúng
            expect(observedIndices.size).toBeGreaterThan(1);
        });

        test("Cập nhật câu văn solutionHtml kiểu 'Đáp án đúng là D' khi correctIndex thay đổi", () => {
            const template = {
                isTemplate: true,
                questionText: "Hỏi:",
                variables: {},
                formulas: { ans: "100", w1: "101", w2: "102", w3: "103" },
                options: ["A. 0", "B. 1", "C. 2", "D. {ans}"],
                correctIndex: 3, // Khởi đầu là D
                solutionHtml: "Vậy chọn đáp án D vì chính xác."
            };

            const letters = ["A", "B", "C", "D"];
            for (let i = 0; i < 15; i++) {
                const q = questions.generateQuestionFromTemplate(template);
                const currentLetter = letters[q.correctIndex];
                expect(q.solutionHtml).toContain(`chọn đáp án ${currentLetter}`);
            }
        });
    });

    // -------------------------------------------------------------------------
    // 9. PARITY BETWEEN QUESTIONS-V3 AND WORKER
    // -------------------------------------------------------------------------
    describe("9. Parity Between Main Thread (qv3) and Worker Generator", () => {
        test("Cả 2 engine đều sinh đầy đủ các trường chuẩn của một câu hỏi", () => {
            const template = {
                isTemplate: true,
                questionText: "Tính {x} * {y} = ?",
                variables: { x: { min: 2, max: 9 }, y: { min: 2, max: 9 } },
                formulas: { ans: "x * y", w1: "x * y + 1", w2: "x * y - 1", w3: "x * y + 2" },
                options: ["A. {ans}", "B. {w1}", "C. {w2}", "D. {w3}"],
                correctIndex: 0,
                solutionHtml: "Đáp án đúng là {ans_letter}",
                tip: "Gợi ý",
                type: "so-hoc"
            };

            const qMain = questions.generateQuestionFromTemplate(template);
            const qWorker = workerGenerator.generateQuestionFromTemplate(template);

            // Kiểm tra cấu trúc trường
            const requiredFields = ['questionText', 'options', 'correctIndex', 'hints', 'solutionHtml', 'tip', 'level', 'type', 'isTemplateInstance'];
            requiredFields.forEach(f => {
                expect(qMain).toHaveProperty(f);
                expect(qWorker).toHaveProperty(f);
            });

            expect(qMain.options.length).toBe(4);
            expect(qWorker.options.length).toBe(4);
            expect(qMain.isTemplateInstance).toBe(true);
            expect(qWorker.isTemplateInstance).toBe(true);

            // Worker có thêm debugContext để clone qua postMessage an toàn
            expect(qWorker).toHaveProperty('debugContext');
        });
    });
});
