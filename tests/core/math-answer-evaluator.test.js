/**
 * @file math-answer-evaluator.test.js
 * Test suite kiểm thử toàn diện module MathAnswerEvaluator (js/core/math-answer-evaluator.js).
 * Đóng băng và kiểm chứng chuẩn hóa (normalization) và so sánh câu trả lời ngắn (short answer evaluation)
 * theo chuẩn ngữ nghĩa mới: KHÔNG False Positive Substring, Bảo tồn văn bản tiếng Việt & Bóc tách đơn vị có cấu trúc.
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

            test("Gán biến 'A = { 1 ; 2 }' không bị coi là prefix phương án trắc nghiệm", () => {
                expect(cleanAnswer("A = { 1 ; 2 }")).toBe("a={1;2}");
            });

            test("Không loại bỏ chữ cái A-D ở giữa chuỗi và bảo tồn ký tự tiếng Việt", () => {
                // Sửa lỗi cũ: chữ 'g' trong 'thẳng' không bị xóa nhầm bởi đơn vị 'g'
                expect(cleanAnswer("Đoạn thẳng AB")).toBe("đoạnthẳngab");
                // Sửa lỗi cũ: chữ 'm' trong 'Điểm' không bị xóa nhầm bởi đơn vị 'm'
                expect(cleanAnswer("Điểm E và F")).toBe("điểmevàf");
            });
        });

        describe("2.2 Loại bỏ ký tự đặc biệt LaTeX ($)", () => {
            test("Loại bỏ dấu $ bao quanh công thức", () => {
                expect(cleanAnswer("$12$")).toBe("12");
                expect(cleanAnswer("$\\{1; 2; 3\\}$")).toBe("{1;2;3}");
                expect(cleanAnswer("$X = \\{1; 2\\}$")).toBe("x={1;2}");
            });

            test("Phân số LaTeX \\frac{1}{2} được chuyển đổi thành phân số 1/2 và không bị xóa chữ 'c'", () => {
                // Sửa lỗi cũ: 'c' trong \frac không bị xóa nhầm bởi đơn vị 'c'
                expect(cleanAnswer("$\\frac{1}{2}$")).toBe("1/2");
                expect(cleanAnswer("\\dfrac{3}{4}")).toBe("3/4");
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

        describe("2.4 Bóc tách đơn vị đo lường có cấu trúc ở đuôi số", () => {
            test("Bóc tách các đơn vị chuẩn xác sau số: chiếc kẹo, kẹo, hộp sữa, sữa, hộp, quả, bông hoa, hoa, quyển sách, sách, vở, bút, học sinh, bạn, khối rubik, khối, rubik, phần tử, ước, bội, dm, cm, m, kg, g, phút, lít, l, độ c, độ", () => {
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

            test("Sửa lỗi cũ: 'giờ' và 'giây' được bóc tách nguyên vẹn sau số, không bị nuốt chữ 'g' thành '15iờ' hay '15iây'", () => {
                expect(cleanAnswer("15 giờ")).toBe("15");
                expect(cleanAnswer("15 giây")).toBe("15");
                expect(cleanAnswer("20 kg")).toBe("20");
                expect(cleanAnswer("50 gam")).toBe("50");
            });
        });

        describe("2.5 Xóa khoảng trắng và chuyển thành chữ thường", () => {
            test("Xóa tất cả khoảng trắng giữa các ký tự", () => {
                expect(cleanAnswer("  1 5  ")).toBe("15");
                expect(cleanAnswer("X = { 1 ; 2 ; 3 }")).toBe("x={1;2;3}");
                expect(cleanAnswer("x + 5 = 10")).toBe("x+5=10");
            });

            test("Chuyển toàn bộ ký tự hoa thành chữ thường", () => {
                expect(cleanAnswer("ABC")).toBe("abc");
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

            test("Số và các kiểu nguyên thủy khác trả về '' theo contract", () => {
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
                expect(evaluateShortAnswer("25cm", "25")).toBe(true);
                expect(evaluateShortAnswer("20 cm²", "20")).toBe(true);
                expect(evaluateShortAnswer("30 độ c", "30")).toBe(true);
                expect(evaluateShortAnswer("30°C", "30")).toBe(true);
                expect(evaluateShortAnswer("15 giờ", "15")).toBe(true);
                expect(evaluateShortAnswer("15 giây", "15")).toBe(true);
            });

            test("Trùng khớp khi có tiền tố phương án hoặc ký hiệu LaTeX", () => {
                expect(evaluateShortAnswer("15", "A. 15")).toBe(true);
                expect(evaluateShortAnswer("A. 15", "15")).toBe(true);
                expect(evaluateShortAnswer("$15$", "15")).toBe(true);
                expect(evaluateShortAnswer("15", "$15$")).toBe(true);
                expect(evaluateShortAnswer("B) $15$", "15")).toBe(true);
            });

            test("Trùng khớp biểu thức tập hợp đầy đủ và linh hoạt thứ tự", () => {
                expect(evaluateShortAnswer("B = {1; 2; 3}", "B = {1; 2; 3}")).toBe(true);
                expect(evaluateShortAnswer("b={1, 2, 3}", "B={1; 2; 3}")).toBe(true);
                expect(evaluateShortAnswer("{1; 2; 3}", "A = {1; 2; 3}")).toBe(true);
                expect(evaluateShortAnswer("1; 2; 3", "A = {1; 2; 3}")).toBe(true);
                expect(evaluateShortAnswer("1, 2, 3", "A = {1; 2; 3}")).toBe(true);
                expect(evaluateShortAnswer("{3; 2; 1}", "A = {1; 2; 3}")).toBe(true);
            });

            test("Trùng khớp phương trình gán biến", () => {
                expect(evaluateShortAnswer("x = 5", "5")).toBe(true);
                expect(evaluateShortAnswer("5", "x = 5")).toBe(true);
                expect(evaluateShortAnswer("x = 5", "x = 5")).toBe(true);
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

            test("Học sinh nhập rỗng luôn trả về false", () => {
                expect(evaluateShortAnswer("", "150")).toBe(false);
                expect(evaluateShortAnswer("   ", "150")).toBe(false);
                expect(evaluateShortAnswer(null, "150")).toBe(false);
                expect(evaluateShortAnswer(undefined, "150")).toBe(false);
                expect(evaluateShortAnswer("", "20")).toBe(false);
            });
        });

        describe("3.3 LOẠI BỎ TRIỆT ĐỂ LỖI SUBSTRING FALSE-POSITIVE (Critical Semantic Hardening)", () => {
            test("Số 20 không được chấp nhận số 2 hoặc 0 (Sửa lỗi Critical Defect)", () => {
                expect(evaluateShortAnswer("2", "20")).toBe(false);
                expect(evaluateShortAnswer("0", "20")).toBe(false);
                expect(evaluateShortAnswer("20", "20")).toBe(true);
                expect(evaluateShortAnswer("200", "20")).toBe(false);
                expect(evaluateShortAnswer("12", "20")).toBe(false);
            });

            test("Số 100 không được chấp nhận số 1 hoặc 10 (Sửa lỗi Critical Defect)", () => {
                expect(evaluateShortAnswer("1", "100")).toBe(false);
                expect(evaluateShortAnswer("10", "100")).toBe(false);
                expect(evaluateShortAnswer("0", "100")).toBe(false);
                expect(evaluateShortAnswer("100", "100")).toBe(true);
            });

            test("Chuỗi dài '1234567890' không được chấp nhận chuỗi con '1234'", () => {
                expect(evaluateShortAnswer("1234", "1234567890")).toBe(false);
                expect(evaluateShortAnswer("123", "1234567890")).toBe(false);
                expect(evaluateShortAnswer("1234567890", "1234567890")).toBe(true);
            });

            test("Tập hợp thiếu phần tử '1; 2' cho đáp án 'A = {1; 2; 3}' phải bị chấm SAI", () => {
                expect(evaluateShortAnswer("1; 2", "A = {1; 2; 3}")).toBe(false);
                expect(evaluateShortAnswer("1;", "A = {1; 2; 3}")).toBe(false);
                expect(evaluateShortAnswer("1", "A = {1; 2; 3}")).toBe(false);
                expect(evaluateShortAnswer("{1; 2}", "A = {1; 2; 3}")).toBe(false);
            });
        });

        describe("3.4 Bảo tồn văn bản Tiếng Việt và Khái niệm Hình học", () => {
            test("Từ vựng hình học không bị phá hủy bởi bộ bóc tách đơn vị", () => {
                expect(evaluateShortAnswer("tam giác", "tam giác")).toBe(true);
                expect(evaluateShortAnswer("Tam giác", "tam giác")).toBe(true);
                expect(evaluateShortAnswer("Tam giác đều", "tam giác đều")).toBe(true);
                expect(evaluateShortAnswer("đoạn thẳng", "đoạn thẳng")).toBe(true);
                expect(evaluateShortAnswer("Đoạn thẳng AB", "đoạn thẳng AB")).toBe(true);
                expect(evaluateShortAnswer("góc vuông", "góc vuông")).toBe(true);
                expect(evaluateShortAnswer("đường thẳng", "đường thẳng")).toBe(true);
                expect(evaluateShortAnswer("trung điểm", "trung điểm")).toBe(true);
                expect(evaluateShortAnswer("hình vuông", "hình vuông")).toBe(true);
                expect(evaluateShortAnswer("hình vuông", "hình chữ nhật")).toBe(false);
            });

            test("Số trục đối xứng", () => {
                expect(evaluateShortAnswer("1 trục đối xứng", "1 trục đối xứng")).toBe(true);
                expect(evaluateShortAnswer("1", "1 trục đối xứng")).toBe(true);
                expect(evaluateShortAnswer("2 trục đối xứng", "1 trục đối xứng")).toBe(false);
                expect(evaluateShortAnswer("vô số trục đối xứng", "vô số trục đối xứng")).toBe(true);
                expect(evaluateShortAnswer("không có trục đối xứng", "không có trục đối xứng")).toBe(true);
            });
        });

        describe("3.5 Số âm, số thập phân và phân số", () => {
            test("Số âm", () => {
                expect(evaluateShortAnswer("-20", "-20")).toBe(true);
                expect(evaluateShortAnswer("20", "-20")).toBe(false);
                expect(evaluateShortAnswer("-2", "-20")).toBe(false);
            });

            test("Số thập phân với dấu chấm và dấu phẩy", () => {
                expect(evaluateShortAnswer("20.5", "20.5")).toBe(true);
                expect(evaluateShortAnswer("20,5", "20.5")).toBe(true);
                expect(evaluateShortAnswer("20.5", "20,5")).toBe(true);
                expect(evaluateShortAnswer("20", "20.5")).toBe(false);
            });

            test("Phân số thường và phân số LaTeX", () => {
                expect(evaluateShortAnswer("1/2", "1/2")).toBe(true);
                expect(evaluateShortAnswer("$\\frac{1}{2}$", "1/2")).toBe(true);
                expect(evaluateShortAnswer("1/2", "$\\frac{1}{2}$")).toBe(true);
                expect(evaluateShortAnswer("1/3", "1/2")).toBe(false);
            });
        });

        describe("3.6 Trường hợp không khớp (Incorrect / Disjoint)", () => {
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

        describe("3.7 Bất biến toán học (Property-Style Invariants)", () => {
            test("Tính phản xạ (Reflexivity): compare(x, x) === true", () => {
                const sampleValues = [
                    "20", "-15", "0", "3.14", "1/2", "20 cm", "30 độ c",
                    "tam giác đều", "đoạn thẳng AB", "A = {1; 2; 3}", "x = 7"
                ];
                sampleValues.forEach(val => {
                    expect(evaluateShortAnswer(val, val)).toBe(true);
                });
            });

            test("Tính phân biệt số học (Distinct numeric values): x != y => compare(x, y) === false", () => {
                for (let i = 1; i <= 30; i++) {
                    const x = String(i);
                    const y = String(i + 1);
                    expect(evaluateShortAnswer(x, y)).toBe(false);
                    expect(evaluateShortAnswer(y, x)).toBe(false);
                }
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
            expect(QuestionEngine.checkShortAnswer("2", "20")).toBe(false);
            expect(QuestionEngine.checkShortAnswer("0", "20")).toBe(false);
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
                ["5 kg", "5 quả"],
                ["2", "20"],
                ["0", "20"],
                ["1", "100"],
                ["tam giác", "tam giác"],
                ["đoạn thẳng", "đoạn thẳng"]
            ];

            testInputs.forEach(([user, correct]) => {
                const pureRes = evaluateShortAnswer(user, correct);
                const engineRes = QuestionEngine.checkShortAnswer(user, correct);
                expect(pureRes).toBe(engineRes);
            });
        });
    });
});
