/**
 * @file math-answer-evaluator.test.js
 * Test suite kiểm thử toàn diện module MathAnswerEvaluator (js/core/math-answer-evaluator.js).
 * Đóng băng và đặc tả chính xác 100% hành vi chuẩn hóa (normalization) và so sánh câu trả lời ngắn (short answer evaluation) hiện tại của production.
 */

const evaluatorModule = require('../../js/core/math-answer-evaluator.js');
const {
    cleanAnswer,
    evaluateShortAnswer,
    cleanAnswerForComparison,
    checkShortAnswer
} = evaluatorModule;

describe("MathAnswerEvaluator — Pure Math Short Answer Evaluator Suite", () => {

    // 1. Module Loading & UMD Existence
    describe("1. Module Loading & UMD Existence", () => {
        test("Module export các hàm thuần túy cần thiết", () => {
            expect(evaluatorModule).toBeDefined();
            expect(typeof cleanAnswer).toBe('function');
            expect(typeof evaluateShortAnswer).toBe('function');
            expect(typeof cleanAnswerForComparison).toBe('function');
            expect(typeof checkShortAnswer).toBe('function');
        });

        test("Global binding MathAnswerEvaluator tồn tại trên globalThis", () => {
            expect(globalThis.MathAnswerEvaluator).toBeDefined();
            expect(typeof globalThis.MathAnswerEvaluator.cleanAnswer).toBe('function');
            expect(typeof globalThis.MathAnswerEvaluator.evaluateShortAnswer).toBe('function');
        });

        test("Aliases ánh xạ chính xác tới các hàm cốt lõi", () => {
            expect(cleanAnswerForComparison).toBe(cleanAnswer);
            expect(checkShortAnswer).toBe(evaluateShortAnswer);
        });
    });

    // 2. Normalization Characterization (cleanAnswer)
    describe("2. Normalization Characterization (cleanAnswer)", () => {

        describe("2.1 Loại bỏ tiền tố phương án (A.-D. prefixes)", () => {
            test("Loại bỏ tiền tố 'A. ', 'B) ', 'C: ', 'D - ' ở đầu chuỗi", () => {
                expect(cleanAnswer("A. 12")).toBe("12");
                expect(cleanAnswer("B) {1; 2}")).toBe("{1;2}");
                expect(cleanAnswer("C: 15")).toBe("15");
                expect(cleanAnswer("D - 40")).toBe("40");
                expect(cleanAnswer("a. 25")).toBe("25");
                expect(cleanAnswer("b) 30")).toBe("30");
            });

            test("Tiền tố 'A ' có khoảng trắng theo sau bị loại bỏ do regex /^[A-D][\\.\\)\\:\\-\\s]+/i", () => {
                expect(cleanAnswer("A = { 1 ; 2 }")).toBe("={1;2}");
                expect(cleanAnswer("A. 12 và B. 15")).toBe("12vàb.15");
            });

            test("Không loại bỏ chữ cái A-D ở giữa chuỗi", () => {
                expect(cleanAnswer("Đoạn thẳng AB")).toBe("đoạnthẳnab"); // 'g' trong 'thẳng' bị loại bởi unit 'g'
                expect(cleanAnswer("Điểm E và F")).toBe("điểevàf"); // 'm' trong 'Điểm' bị loại bởi unit 'm'
            });
        });

        describe("2.2 Loại bỏ ký tự đặc biệt LaTeX ($)", () => {
            test("Loại bỏ dấu $ bao quanh công thức", () => {
                expect(cleanAnswer("$12$")).toBe("12");
                expect(cleanAnswer("$\\{1; 2; 3\\}$")).toBe("\\{1;2;3\\}");
                expect(cleanAnswer("$X = \\{1; 2\\}$")).toBe("x=\\{1;2\\}");
            });

            test("Ký tự 'c' trong \\frac bị ảnh hưởng bởi danh sách unit 'c' (Đặc tả behavior hiện tại)", () => {
                expect(cleanAnswer("$\\frac{1}{2}$")).toBe("\\fra{1}{2}");
            });
        });

        describe("2.3 Chuẩn hóa dấu phẩy và dấu chấm phẩy (, -> ;)", () => {
            test("Thay thế dấu phẩy có khoảng trắng sau thành dấu chấm phẩy", () => {
                expect(cleanAnswer("1, 2, 3")).toBe("1;2;3");
                expect(cleanAnswer("{1, 2, 3}")).toBe("{1;2;3}");
            });

            test("Thay thế dấu phẩy gắn liền với chữ cái hoặc dấu =", () => {
                expect(cleanAnswer("a, b")).toBe("a;b");
                expect(cleanAnswer("x=1, y=2")).toBe("x=1;y=2");
            });
        });

        describe("2.4 Loại bỏ các từ đơn vị đo lường tiếng Việt theo danh sách production", () => {
            test("Loại bỏ các từ đơn vị chuẩn: chiếc kẹo, kẹo, hộp sữa, sữa, hộp, quả, bông hoa, hoa, quyển sách, sách, vở, bút, học sinh, bạn, khối rubik, khối, rubik, phần tử, ước, bội, dm, cm, m, kg, g, phút, lít, l, độ c, độ, c", () => {
                expect(cleanAnswer("15 chiếc kẹo")).toBe("15");
                expect(cleanAnswer("20 hộp sữa")).toBe("20");
                expect(cleanAnswer("5 quả")).toBe("5");
                expect(cleanAnswer("10 bông hoa")).toBe("10");
                expect(cleanAnswer("3 quyển sách")).toBe("3");
                expect(cleanAnswer("12 học sinh")).toBe("12");
                expect(cleanAnswer("8 bạn")).toBe("8");
                expect(cleanAnswer("1 khối rubik")).toBe("1");
                expect(cleanAnswer("5 phần tử")).toBe("5");
                expect(cleanAnswer("4 ước")).toBe("4");
                expect(cleanAnswer("6 bội")).toBe("6");
                expect(cleanAnswer("10 dm")).toBe("10");
                expect(cleanAnswer("25 cm")).toBe("25");
                expect(cleanAnswer("5 kg")).toBe("5");
                expect(cleanAnswer("30 phút")).toBe("30");
                expect(cleanAnswer("2 lít")).toBe("2");
                expect(cleanAnswer("30 độ c")).toBe("30");
            });

            test("Đặc tả hiện tại: 'giờ' bị chữ 'g' loại bỏ còn 'iờ', 'giây' bị 'g' loại bỏ còn 'iây'", () => {
                expect(cleanAnswer("15 giờ")).toBe("15iờ");
                expect(cleanAnswer("15 giây")).toBe("15iây");
            });
        });

        describe("2.5 Xóa khoảng trắng và chuyển thành chữ thường", () => {
            test("Xóa tất cả khoảng trắng giữa các ký tự", () => {
                expect(cleanAnswer("  1 5  ")).toBe("15");
                expect(cleanAnswer("X = { 1 ; 2 ; 3 }")).toBe("x={1;2;3}");
                expect(cleanAnswer("x + 5 = 10")).toBe("x+5=10");
            });

            test("Chuyển toàn bộ ký tự hoa thành chữ thường", () => {
                expect(cleanAnswer("ABC")).toBe("abc"); // Regex unit không có /i nên C hoa không bị xóa trước khi toLowerCase
                expect(cleanAnswer("ĐÁP ÁN A")).toBe("đápána");
            });
        });

        describe("2.6 Xử lý các giá trị biên và kiểu dữ liệu không phải chuỗi", () => {
            test("null và undefined trả về chuỗi rỗng ''", () => {
                expect(cleanAnswer(null)).toBe("");
                expect(cleanAnswer(undefined)).toBe("");
            });

            test("Chuỗi rỗng hoặc chỉ chứa khoảng trắng trả về ''", () => {
                expect(cleanAnswer("")).toBe("");
                expect(cleanAnswer("   ")).toBe("");
                expect(cleanAnswer("\t\n")).toBe("");
            });

            test("Số và các kiểu nguyên thủy khác trả về '' (Đặc tả behavior hiện tại)", () => {
                expect(cleanAnswer(0)).toBe("");
                expect(cleanAnswer(123)).toBe("");
                expect(cleanAnswer(true)).toBe("");
                expect(cleanAnswer(false)).toBe("");
                expect(cleanAnswer({})).toBe("");
                expect(cleanAnswer([])).toBe("");
                expect(cleanAnswer(NaN)).toBe("");
            });
        });
    });

    // 3. Short Answer Evaluation Characterization (evaluateShortAnswer)
    describe("3. Short Answer Evaluation Characterization (evaluateShortAnswer)", () => {

        describe("3.1 So khớp bằng nhau tuyệt đối sau khi chuẩn hóa", () => {
            test("Trùng khớp số nguyên đơn giản", () => {
                expect(evaluateShortAnswer("15", "15")).toBe(true);
                expect(evaluateShortAnswer("  15  ", "15")).toBe(true);
                expect(evaluateShortAnswer("15", "  15  ")).toBe(true);
            });

            test("Trùng khớp khi có/không có đơn vị đo", () => {
                expect(evaluateShortAnswer("15 học sinh", "15")).toBe(true);
                expect(evaluateShortAnswer("15", "15 học sinh")).toBe(true);
                expect(evaluateShortAnswer("15 bạn", "15 học sinh")).toBe(true);
                expect(evaluateShortAnswer("25 cm", "25")).toBe(true);
                expect(evaluateShortAnswer("30 độ c", "30")).toBe(true);
            });

            test("Trùng khớp khi có tiền tố phương án hoặc ký hiệu LaTeX", () => {
                expect(evaluateShortAnswer("15", "A. 15")).toBe(true);
                expect(evaluateShortAnswer("A. 15", "15")).toBe(true);
                expect(evaluateShortAnswer("$15$", "15")).toBe(true);
                expect(evaluateShortAnswer("15", "$15$")).toBe(true);
                expect(evaluateShortAnswer("B) $15$", "15")).toBe(true);
            });

            test("Trùng khớp biểu thức tập hợp đầy đủ", () => {
                expect(evaluateShortAnswer("B = {1; 2; 3}", "B = {1; 2; 3}")).toBe(true);
                expect(evaluateShortAnswer("b={1, 2, 3}", "B={1; 2; 3}")).toBe(true);
            });
        });

        describe("3.2 Guard đáp án đúng rỗng / không hợp lệ (Empty-correct guard)", () => {
            test("Đáp án đúng rỗng hoặc không hợp lệ luôn trả về false", () => {
                expect(evaluateShortAnswer("15", "")).toBe(false);
                expect(evaluateShortAnswer("15", "   ")).toBe(false);
                expect(evaluateShortAnswer("15", null)).toBe(false);
                expect(evaluateShortAnswer("15", undefined)).toBe(false);
                expect(evaluateShortAnswer("", "")).toBe(false);
                expect(evaluateShortAnswer(null, null)).toBe(false);
            });

            test("Học sinh nhập rỗng với đáp án dài (>=3 ký tự) trả về false", () => {
                expect(evaluateShortAnswer("", "150")).toBe(false);
                expect(evaluateShortAnswer("   ", "150")).toBe(false);
                expect(evaluateShortAnswer(null, "150")).toBe(false);
                expect(evaluateShortAnswer(undefined, "150")).toBe(false);
            });
        });

        describe("3.3 Quy tắc thông cảm tập hợp và chuỗi con (40% Substring Heuristic)", () => {
            // cleanCorrect = "={1;2;3}" (length = 8)
            // 40% threshold = Math.floor(8 * 0.4) = Math.floor(3.2) = 3
            
            test("Học sinh gõ chỉ phần tử {1; 2; 3} (len 7 >= 3) cho câu hỏi A = {1; 2; 3}", () => {
                expect(evaluateShortAnswer("{1; 2; 3}", "A = {1; 2; 3}")).toBe(true);
            });

            test("Học sinh gõ 1; 2; 3 (len 5 >= 3) cho câu hỏi A = {1; 2; 3}", () => {
                expect(evaluateShortAnswer("1; 2; 3", "A = {1; 2; 3}")).toBe(true);
            });

            test("Học sinh gõ 1;2 (len 3 >= 3, ngưỡng biên threshold) -> true", () => {
                expect(evaluateShortAnswer("1;2", "A = {1; 2; 3}")).toBe(true);
            });

            test("Học sinh gõ 1; (len 2 < 3, dưới ngưỡng threshold - 1) -> false", () => {
                expect(evaluateShortAnswer("1;", "A = {1; 2; 3}")).toBe(false);
            });

            test("Chiều ngược lại: cleanUser dài hơn và chứa cleanCorrect với tỷ lệ >= 40%", () => {
                expect(evaluateShortAnswer("A = {1; 2; 3}", "{1; 2; 3}")).toBe(true);
            });

            test("Trường hợp chuỗi độ dài 10: ngưỡng 40% là 4", () => {
                // correct = "1234567890" (len 10), 40% = 4
                expect(evaluateShortAnswer("1234", "1234567890")).toBe(true); // len 4 >= 4 -> true
                expect(evaluateShortAnswer("123", "1234567890")).toBe(false); // len 3 < 4 -> false
            });
        });

        describe("3.4 Trường hợp không khớp (Incorrect / Disjoint)", () => {
            test("Số khác nhau trả về false", () => {
                expect(evaluateShortAnswer("15", "25")).toBe(false);
                expect(evaluateShortAnswer("123", "124")).toBe(false);
                expect(evaluateShortAnswer("100", "200")).toBe(false);
            });

            test("Chuỗi không liên quan trả về false", () => {
                expect(evaluateShortAnswer("abc", "xyz")).toBe(false);
                expect(evaluateShortAnswer("hình vuông", "hình chữ nhật")).toBe(false);
            });
        });
    });

    // 4. Parity & Compatibility with questions-v3.js
    describe("4. Parity & Compatibility with questions-v3.js", () => {
        let QuestionEngine;

        beforeAll(() => {
            try {
                QuestionEngine = require('../../js/questions-v3.js');
            } catch (e) {
                console.error("Lỗi khi load questions-v3 trong test compatibility:", e);
                throw e;
            }
        });

        test("QuestionEngine.cleanAnswerForComparison tương thích 100%", () => {
            expect(typeof QuestionEngine.cleanAnswerForComparison).toBe('function');
            expect(QuestionEngine.cleanAnswerForComparison("A. 15 học sinh")).toBe("15");
            expect(QuestionEngine.cleanAnswerForComparison("$25$ cm")).toBe("25");
            expect(QuestionEngine.cleanAnswerForComparison(null)).toBe("");
            expect(QuestionEngine.cleanAnswerForComparison(123)).toBe("");
        });

        test("QuestionEngine.checkShortAnswer tương thích 100%", () => {
            expect(typeof QuestionEngine.checkShortAnswer).toBe('function');
            expect(QuestionEngine.checkShortAnswer("15", "15")).toBe(true);
            expect(QuestionEngine.checkShortAnswer("15 học sinh", "15")).toBe(true);
            expect(QuestionEngine.checkShortAnswer("15", "25")).toBe(false);
            expect(QuestionEngine.checkShortAnswer("{1; 2; 3}", "A = {1; 2; 3}")).toBe(true);
        });

        test("Parity kiểm tra chéo giữa MathAnswerEvaluator và QuestionEngine", () => {
            const testInputs = [
                ["15", "15"],
                ["15 học sinh", "15"],
                ["A. 20 bạn", "20"],
                ["B) $30$ độ c", "30"],
                ["{1; 2; 3}", "A = {1; 2; 3}"],
                ["123", "456"],
                ["", "15"],
                [null, "15"],
                ["15", ""],
                ["25 cm", "25"],
                ["5 kg", "5 quả"]
            ];

            testInputs.forEach(([user, correct]) => {
                const pureRes = evaluateShortAnswer(user, correct);
                const engineRes = QuestionEngine.checkShortAnswer(user, correct);
                expect(pureRes).toBe(engineRes);
            });
        });
    });
});
