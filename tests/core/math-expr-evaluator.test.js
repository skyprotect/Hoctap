/**
 * Unit & Characterization Tests for MathExprEvaluator (js/core/math-expr-evaluator.js)
 * 
 * Khóa chặt và bảo vệ 100% các hành vi đánh giá biểu thức toán học của hệ thống HocTap:
 * - Tier 1: new Function with sandbox context
 * - Tier 2: safeEval fallback & safeEvalTokens AST evaluator
 * - Operator Precedence & IIFE
 * - Advanced Constructs: Set, Map, Array.from, spread, .filter()
 * - Defensive & Self-Healing: Plain words, AI prefixes, recursive gcd replacement, roundFloat
 * - Zero Global Math Mutation: global Math is never polluted
 * - Parity verification with QuestionEngine (js/questions-v3.js)
 */

const MathExprEvaluator = require('../../js/core/math-expr-evaluator');
const MathUtils = require('../../js/core/math-utils');
const QuestionEngine = require('../../js/questions-v3');

describe("MathExprEvaluator Module (js/core/math-expr-evaluator.js)", () => {

    test("1. Module được khởi tạo và cung cấp đầy đủ 3 API công khai", () => {
        expect(MathExprEvaluator).toBeDefined();
        expect(typeof MathExprEvaluator.evalExpression).toBe('function');
        expect(typeof MathExprEvaluator.safeEval).toBe('function');
        expect(typeof MathExprEvaluator.safeEvalTokens).toBe('function');
    });

    // =========================================================================
    // Tier 1: new Function sandbox evaluation
    // =========================================================================
    describe("2. Tier 1 Evaluation (new Function with Sandbox Context)", () => {
        test("Tính đúng các phép toán số học cơ bản", () => {
            expect(MathExprEvaluator.evalExpression("1 + 2 * 3")).toBe(7);
            expect(MathExprEvaluator.evalExpression("(10 + 20) / 5")).toBe(6);
            expect(MathExprEvaluator.evalExpression("17 % 5")).toBe(2);
            expect(MathExprEvaluator.evalExpression("2 ** 3")).toBe(8);
        });

        test("Tính đúng với các biến truyền vào qua context", () => {
            const context = { a: 15, b: 25, name: "Alpha" };
            expect(MathExprEvaluator.evalExpression("a + b", context)).toBe(40);
            expect(MathExprEvaluator.evalExpression("b - a * 2", context)).toBe(-5);
            expect(MathExprEvaluator.evalExpression("a > 10 && b < 30", context)).toBe(true);
        });

        test("Hỗ trợ đầy đủ các hàm toán học Math và MathUtils trong biểu thức", () => {
            const context = { a: 12, b: 18, c: 24, p: 13 };
            expect(MathExprEvaluator.evalExpression("gcd(a, b)", context)).toBe(6);
            expect(MathExprEvaluator.evalExpression("lcm(a, b)", context)).toBe(36);
            expect(MathExprEvaluator.evalExpression("ƯCLN(a, b)", context)).toBe(6);
            expect(MathExprEvaluator.evalExpression("BCNN(a, b)", context)).toBe(36);
            expect(MathExprEvaluator.evalExpression("isPrime(p)", context)).toBe(true);
            expect(MathExprEvaluator.evalExpression("isPrime(a)", context)).toBe(false);
            expect(MathExprEvaluator.evalExpression("sumDigits(1234)", context)).toBe(10);
            expect(MathExprEvaluator.evalExpression("lcm3(a, b, c)", context)).toBe(72);
            expect(MathExprEvaluator.evalExpression("getDivisors(12)", context)).toEqual([1, 2, 3, 4, 6, 12]);
        });

        test("Hỗ trợ gọi Math.gcd, Math.lcm, Math.isPrime thông qua Sandbox Math", () => {
            const context = { num: 12, den: 18 };
            expect(MathExprEvaluator.evalExpression("Math.gcd(num, den)", context)).toBe(6);
            expect(MathExprEvaluator.evalExpression("Math.lcm(4, 6)", context)).toBe(12);
            expect(MathExprEvaluator.evalExpression("Math.isPrime(17)", context)).toBe(true);
            expect(MathExprEvaluator.evalExpression("Math.sumDigits(99)", context)).toBe(18);
            expect(MathExprEvaluator.evalExpression("Math.max(10, 20, 5)", context)).toBe(20);
            expect(MathExprEvaluator.evalExpression("Math.abs(-50)", context)).toBe(50);
        });
    });

    // =========================================================================
    // Tier 2: safeEval AST Evaluation & Fallback
    // =========================================================================
    describe("3. Tier 2 Evaluation (safeEval & safeEvalTokens)", () => {
        test("safeEval tính đúng các biểu thức số học và biến", () => {
            const ctx = { a: 10, b: 20 };
            expect(MathExprEvaluator.safeEval("a + b * 2", ctx)).toBe(50);
            expect(MathExprEvaluator.safeEval("(a + b) * 2", ctx)).toBe(60);
            expect(MathExprEvaluator.safeEval("b / a", ctx)).toBe(2);
            expect(MathExprEvaluator.safeEval("b % 3", ctx)).toBe(2);
        });

        test("safeEval xử lý toán tử 3 ngôi (ternary) và toán tử logic", () => {
            const ctx = { a: 10, b: 20 };
            expect(MathExprEvaluator.safeEval("a > 5 ? 100 : 200", ctx)).toBe(100);
            expect(MathExprEvaluator.safeEval("a < 5 ? 100 : 200", ctx)).toBe(200);
            expect(MathExprEvaluator.safeEval("a === 10 && b === 20 ? 'yes' : 'no'", ctx)).toBe('yes');
            expect(MathExprEvaluator.safeEval("a === 5 || b === 20 ? 'yes' : 'no'", ctx)).toBe('yes');
        });

        test("safeEval xử lý toán tử so sánh quan hệ (<, >, <=, >=, ===, !==)", () => {
            expect(MathExprEvaluator.safeEval("5 < 10")).toBe(true);
            expect(MathExprEvaluator.safeEval("10 > 5")).toBe(true);
            expect(MathExprEvaluator.safeEval("5 <= 5")).toBe(true);
            expect(MathExprEvaluator.safeEval("6 >= 5")).toBe(true);
            expect(MathExprEvaluator.safeEval("5 === 5")).toBe(true);
            expect(MathExprEvaluator.safeEval("5 !== 6")).toBe(true);
        });

        test("safeEval xử lý toán tử đơn phân tử (unary -, !)", () => {
            expect(MathExprEvaluator.safeEval("-5 + 10")).toBe(5);
            expect(MathExprEvaluator.safeEval("!false")).toBe(true);
            expect(MathExprEvaluator.safeEval("!true")).toBe(false);
        });

        test("safeEval xử lý cấu trúc IIFE (() => { ... })()", () => {
            const expr = "(() => { const x = 10; const y = 20; return x + y; })()";
            expect(MathExprEvaluator.safeEval(expr)).toBe(30);

            const exprWithCtx = "(() => { const doubled = a * 2; return doubled + 5; })()";
            expect(MathExprEvaluator.safeEval(exprWithCtx, { a: 15 })).toBe(35);
        });

        test("safeEval xử lý Array.from, Set, Map, và spread operator", () => {
            const exprSet = "new Set([1, 2, 3, 2, 1])";
            const resSet = MathExprEvaluator.safeEval(exprSet);
            expect(resSet instanceof Set).toBe(true);
            expect(resSet.size).toBe(3);

            const exprSpread = "Math.max(...[5, 12, 8])";
            expect(MathExprEvaluator.safeEval(exprSpread)).toBe(12);

            const exprArrayFrom = "Array.from(new Set([4, 5, 6]))";
            expect(MathExprEvaluator.safeEval(exprArrayFrom)).toEqual([4, 5, 6]);
        });

        test("safeEval xử lý chaining .filter(x => ...)", () => {
            const ctx = { list: [1, 2, 3, 4, 5, 6] };
            const expr = "list.filter(x => x > 3).length";
            expect(MathExprEvaluator.safeEval(expr, ctx)).toBe(3);
        });

        test("safeEval ném lỗi Division by zero và Modulo by zero", () => {
            expect(() => MathExprEvaluator.safeEval("10 / 0")).toThrow("Division by zero");
            expect(() => MathExprEvaluator.safeEval("10 % 0")).toThrow("Modulo by zero");
        });
    });

    // =========================================================================
    // Defensive & Self-Healing Behaviors
    // =========================================================================
    describe("4. Defensive & Self-Healing Behaviors", () => {
        test("Loại bỏ dấu $ trước ngoặc nhọn ${var} -> {var}", () => {
            expect(MathExprEvaluator.evalExpression("${a} + ${b}", { a: 10, b: 20 })).toBe(30);
        });

        test("Loại bỏ tiền tố variables., formulas., this.", () => {
            const ctx = { a: 5, b: 15 };
            expect(MathExprEvaluator.evalExpression("variables.a + formulas.b", ctx)).toBe(20);
            expect(MathExprEvaluator.evalExpression("this.a * 3", ctx)).toBe(15);
        });

        test("Loại bỏ dấu ngoặc nhọn quanh tên biến {a} -> a", () => {
            expect(MathExprEvaluator.evalExpression("{a} * {b}", { a: 4, b: 5 })).toBe(20);
        });

        test("Tự sửa hàm gcd đệ quy của AI thành hàm gcd an toàn", () => {
            const aiRecursiveGcdExpr = "(function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); })(12, 18)";
            expect(MathExprEvaluator.evalExpression(aiRecursiveGcdExpr)).toBe(6);
        });

        test("Tự sửa vòng lặp tìm ước thành getDivisors", () => {
            const aiDivisorLoop = "(() => { let divs = []; for (let i = 1; i <= 12; i++) { if (12 % i === 0) divs.push(i); } return divs; })()";
            expect(MathExprEvaluator.evalExpression(aiDivisorLoop)).toEqual([1, 2, 3, 4, 6, 12]);
        });

        test("Tự sửa .values().join(...) thành Array.from(...).join(...)", () => {
            const expr = "set.values().join(',')";
            const ctx = { set: new Set(['A', 'B', 'C']) };
            expect(MathExprEvaluator.evalExpression(expr, ctx)).toBe("A,B,C");
        });

        test("Phòng thủ chuỗi tiếng Việt thuần túy (Plain Word Defense)", () => {
            expect(MathExprEvaluator.evalExpression("15 học sinh")).toBe("15 học sinh");
            expect(MathExprEvaluator.evalExpression("chiếc kẹo")).toBe("chiếc kẹo");
            expect(MathExprEvaluator.evalExpression("quyển sách")).toBe("quyển sách");
            expect(MathExprEvaluator.evalExpression("tập hợp A")).toBe("tập hợp A");
        });

        test("Bọc ngoặc IIFE ẩn danh thiếu ngoặc ngoài", () => {
            const expr = "function() { return 42; }()";
            expect(MathExprEvaluator.evalExpression(expr)).toBe(42);
        });

        test("Cắt bỏ dấu chấm phẩy ở cuối biểu thức", () => {
            expect(MathExprEvaluator.evalExpression("10 + 20;")).toBe(30);
            expect(MathExprEvaluator.evalExpression(" a * 2 ; ", { a: 7 })).toBe(14);
        });

        test("Làm tròn số thực phòng sai số floating-point IEEE-754 (roundFloat)", () => {
            expect(MathExprEvaluator.evalExpression("0.1 + 0.2")).toBe(0.3);
            expect(MathExprEvaluator.evalExpression("1.0000000000000002")).toBe(1);
        });

        test("Trả về nguyên bản nếu đầu vào không phải chuỗi", () => {
            expect(MathExprEvaluator.evalExpression(123)).toBe(123);
            expect(MathExprEvaluator.evalExpression(null)).toBe(null);
            expect(MathExprEvaluator.evalExpression(undefined)).toBe(undefined);
            expect(MathExprEvaluator.evalExpression([1, 2])).toEqual([1, 2]);
        });

        test("Bắt lỗi cú pháp không hợp lệ và trả về null an toàn", () => {
            expect(MathExprEvaluator.evalExpression("a +++ +++ b invalid", {})).toBe(null);
        });
    });

    // =========================================================================
    // Critical Global Math Purity Verification
    // =========================================================================
    describe("5. Critical Global Math Purity Verification", () => {
        test("Đảm bảo quá trình evalExpression KHÔNG làm ô nhiễm đối tượng Math toàn cục", () => {
            // Kiểm tra trước khi gọi
            const originalGlobalGcd = global.Math.gcd;
            const originalGlobalLcm = global.Math.lcm;
            const originalGlobalIsPrime = global.Math.isPrime;
            const originalGlobalSumDigits = global.Math.sumDigits;

            // Chạy 100 biểu thức toán học
            for (let i = 0; i < 100; i++) {
                MathExprEvaluator.evalExpression("Math.gcd(12, 18) + Math.lcm(4, 6) + gcd(20, 30)");
                MathExprEvaluator.safeEval("Math.gcd(12, 18) + Math.lcm(4, 6)");
            }

            // Đối tượng Math toàn cục không được phép bị gán thêm
            expect(global.Math.gcd).toBe(originalGlobalGcd);
            expect(global.Math.lcm).toBe(originalGlobalLcm);
            expect(global.Math.isPrime).toBe(originalGlobalIsPrime);
            expect(global.Math.sumDigits).toBe(originalGlobalSumDigits);
        });
    });

    // =========================================================================
    // Behavioral Parity between Old QuestionEngine & MathExprEvaluator
    // =========================================================================
    describe("6. Parity Verification with QuestionEngine", () => {
        const parityTestCases = [
            { expr: "a + b", ctx: { a: 10, b: 20 } },
            { expr: "(a + b + 1 === a + b) ? a + b + 5 : a + b + 1", ctx: { a: 5, b: 12 } },
            { expr: "(a + b - 1 === a + b || a + b - 1 === w1) ? a + b + 2 : a + b - 1", ctx: { a: 8, b: 14, w1: 21 } },
            { expr: "gcd(a, b)", ctx: { a: 24, b: 36 } },
            { expr: "lcm(a, b)", ctx: { a: 15, b: 20 } },
            { expr: "isPrime(n)", ctx: { n: 29 } },
            { expr: "isPrime(n)", ctx: { n: 30 } },
            { expr: "sumDigits(n)", ctx: { n: 9876 } },
            { expr: "getDivisors(n)", ctx: { n: 18 } },
            { expr: "simplify(12, 18)", ctx: {} },
            { expr: "${a} + ${b} * 2", ctx: { a: 3, b: 7 } },
            { expr: "variables.a + formulas.b", ctx: { a: 100, b: 200 } },
            { expr: "15 học sinh", ctx: {} },
            { expr: "0.1 + 0.2", ctx: {} },
            { expr: "Math.gcd(a, b) === 1", ctx: { a: 7, b: 11 } }
        ];

        parityTestCases.forEach((tc, idx) => {
            test(`Parity Case #${idx + 1}: '${tc.expr}'`, () => {
                const oldResult = QuestionEngine.evalExpression(tc.expr, tc.ctx);
                const newResult = MathExprEvaluator.evalExpression(tc.expr, tc.ctx);
                expect(newResult).toEqual(oldResult);
            });
        });
    });

    // =========================================================================
    // 7. Parity Verification with Question Generator Worker
    // =========================================================================
    describe("7. Parity Verification with Question Generator Worker", () => {
        let workerGenerator;
        beforeAll(() => {
            workerGenerator = require('../../js/question-generator-worker');
        });

        test("Worker generator được khởi tạo và ủy quyền chính xác sang MathExprEvaluator", () => {
            expect(workerGenerator).toBeDefined();
            expect(typeof workerGenerator.evalExpression).toBe('function');
            expect(typeof workerGenerator.safeEval).toBe('function');
            expect(typeof workerGenerator.safeEvalTokens).toBe('function');
        });

        test("Worker evalExpression cho kết quả tương đồng 100% với MathExprEvaluator", () => {
            const cases = [
                { expr: "a * 2 + b", ctx: { a: 10, b: 5 } },
                { expr: "Math.gcd(a, b)", ctx: { a: 18, b: 24 } },
                { expr: "isPrime(n)", ctx: { n: 17 } },
                { expr: "variables.x + 5", ctx: { x: 15 } }
            ];

            cases.forEach(c => {
                const workerRes = workerGenerator.evalExpression(c.expr, c.ctx);
                const canonicalRes = MathExprEvaluator.evalExpression(c.expr, c.ctx);
                expect(workerRes).toEqual(canonicalRes);
            });
        });
    });
});

