/**
 * @file should-force-mcq.characterization.test.js
 * Test suite kiểm thử đặc tả (Characterization Test Suite) cho hàm shouldForceMCQ() trong js/questions-v3.js.
 * 
 * Mục tiêu:
 * - Đóng băng và đặc tả chính xác 100% hành vi hiện tại của shouldForceMCQ() trên production.
 * - Không chỉnh sửa logic hay "sửa lỗi" bất kỳ heuristic nào (kể cả quirk \b với Unicode tiếng Việt).
 * - Bao phủ toàn bộ các nhánh rẽ:
 *   1. Type check (input không phải string)
 *   2. 16 từ khóa tiếng Việt bắt buộc MCQ trong questionText
 *   3. 17 ký hiệu / lệnh LaTeX phức tạp trong correctOption
 *   4. Ngoặc nhọn tập hợp ({ và }) trong correctOption
 *   5. Chuẩn hóa textOnly: loại bỏ số, dấu phép tính, và danh sách đơn vị tiếng Việt
 *   6. Ngưỡng độ dài văn bản còn lại (> 5 ký tự)
 *   7. Đặc tả quirk hiện tại của production (\b không khớp Unicode ở "phần tử")
 *   8. Các trường hợp phủ định (trả về false) cho phép làm câu điền đáp án ngắn
 */

const MathQuestionClassifier = require('../../js/core/math-question-classifier.js');
const questions = require('../../js/questions-v3.js');

describe("MathQuestionClassifier & shouldForceMCQ() Characterization Test Suite", () => {
    // Kiểm tra trực tiếp trên module thuần túy MathQuestionClassifier
    const shouldForceMCQ = MathQuestionClassifier.shouldForceMCQ.bind(MathQuestionClassifier);

    // -------------------------------------------------------------------------
    // 1. TYPE CHECK & BOUNDARY CONDITIONS
    // -------------------------------------------------------------------------
    describe("1. Type Check & Boundary Inputs", () => {
        test("Trả về false khi questionText không phải string", () => {
            expect(shouldForceMCQ(null, "15")).toBe(false);
            expect(shouldForceMCQ(undefined, "15")).toBe(false);
            expect(shouldForceMCQ(123, "15")).toBe(false);
            expect(shouldForceMCQ({}, "15")).toBe(false);
            expect(shouldForceMCQ([], "15")).toBe(false);
            expect(shouldForceMCQ(true, "15")).toBe(false);
        });

        test("Trả về false khi correctOption không phải string", () => {
            expect(shouldForceMCQ("Tính tổng 5 + 7", null)).toBe(false);
            expect(shouldForceMCQ("Tính tổng 5 + 7", undefined)).toBe(false);
            expect(shouldForceMCQ("Tính tổng 5 + 7", 12)).toBe(false);
            expect(shouldForceMCQ("Tính tổng 5 + 7", {})).toBe(false);
            expect(shouldForceMCQ("Tính tổng 5 + 7", [])).toBe(false);
            expect(shouldForceMCQ("Tính tổng 5 + 7", false)).toBe(false);
        });

        test("Trả về false khi cả 2 tham số đều rỗng hoặc không phải string", () => {
            expect(shouldForceMCQ("", "")).toBe(false);
            expect(shouldForceMCQ(null, null)).toBe(false);
        });
    });

    // -------------------------------------------------------------------------
    // 2. VIETNAMESE FORCE-MCQ KEYWORDS IN QUESTION TEXT (16 KEYWORDS)
    // -------------------------------------------------------------------------
    describe("2. Vietnamese Force-MCQ Keywords in questionText", () => {
        const keywords = [
            "dưới đây",
            "sau đây",
            "khẳng định nào",
            "phát biểu nào",
            "cách viết nào",
            "nhận xét nào",
            "đáp án nào",
            "công thức nào",
            "hình nào",
            "trong các phát biểu",
            "khẳng định nào đúng",
            "khẳng định nào sai",
            "phát biểu nào đúng",
            "phát biểu nào sai",
            "phương án nào",
            "lựa chọn nào"
        ];

        keywords.forEach(kw => {
            test(`Nhận diện từ khóa [${kw}] -> trả về true`, () => {
                const qText = `Trong các trường hợp ${kw}, đâu là kết quả chính xác?`;
                expect(shouldForceMCQ(qText, "12")).toBe(true);
            });

            test(`Nhận diện từ khóa [${kw}] không phân biệt hoa thường -> trả về true`, () => {
                const qText = `HÃY CHO BIẾT ${kw.toUpperCase()}?`;
                expect(shouldForceMCQ(qText, "15")).toBe(true);
            });
        });

        test("Câu hỏi bình thường không chứa từ khóa MCQ -> không kích hoạt nhánh này", () => {
            expect(shouldForceMCQ("Tính giá trị của biểu thức 12 + 18:", "30")).toBe(false);
            expect(shouldForceMCQ("Tìm số tự nhiên x biết x + 5 = 10:", "5")).toBe(false);
        });
    });

    // -------------------------------------------------------------------------
    // 3. COMPLEX LATEX IN CORRECT OPTION (17 TOKENS)
    // -------------------------------------------------------------------------
    describe("3. Complex LaTeX Tokens in correctOption", () => {
        const latexTokens = [
            { token: "\\frac", example: "$\\frac{3}{4}$" },
            { token: "\\sqrt", example: "$\\sqrt{16}$" },
            { token: "\\parallel", example: "$AB \\parallel CD$" },
            { token: "\\perp", example: "$a \\perp b$" },
            { token: "\\angle", example: "$\\angle ABC$" },
            { token: "\\triangle", example: "$\\triangle ABC$" },
            { token: "\\cup", example: "$A \\cup B$" },
            { token: "\\cap", example: "$A \\cap B$" },
            { token: "\\subset", example: "$A \\subset B$" },
            { token: "\\in", example: "$x \\in N$" },
            { token: "\\notin", example: "$x \\notin N^*$" },
            { token: "\\bar", example: "$\\bar{a}$" },
            { token: "\\overline", example: "$\\overline{ab}$" },
            { token: "\\times", example: "$2 \\times 3$" },
            { token: "\\cdot", example: "$2 \\cdot 3$" },
            { token: "\\degree", example: "$90^{\\degree}$" },
            { token: "^", example: "$2^3$" }
        ];

        latexTokens.forEach(({ token, example }) => {
            test(`Nhận diện ký hiệu LaTeX [${token}] trong đáp án -> trả về true`, () => {
                expect(shouldForceMCQ("Tính kết quả:", example)).toBe(true);
            });
        });
    });

    // -------------------------------------------------------------------------
    // 4. BRACES / SET NOTATION ({ AND })
    // -------------------------------------------------------------------------
    describe("4. Braces & Set Notation in correctOption", () => {
        test("Đáp án chứa dấu ngoặc nhọn mở '{' -> trả về true", () => {
            expect(shouldForceMCQ("Viết tập hợp:", "{1; 2; 3}")).toBe(true);
            expect(shouldForceMCQ("Viết tập hợp:", "A = {1, 2}")).toBe(true);
        });

        test("Đáp án chứa dấu ngoặc nhọn đóng '}' -> trả về true", () => {
            expect(shouldForceMCQ("Viết tập hợp:", "1; 2; 3}")).toBe(true);
        });
    });

    // -------------------------------------------------------------------------
    // 5. TEXT-ONLY STRIPPING & VIETNAMESE MEASUREMENT UNITS
    // -------------------------------------------------------------------------
    describe("5. Text Stripping, Numbers, Punctuation & Measurement Units", () => {
        test("Loại bỏ chữ số và ký tự phép tính/dấu câu (+ - * / = < > ( ) ; , . %)", () => {
            // "12 + 34 = 46" -> textOnly rỗng (length 0 <= 5) -> false
            expect(shouldForceMCQ("Tính giá trị:", "12 + 34 = 46")).toBe(false);
            expect(shouldForceMCQ("So sánh:", "x < 100")).toBe(false);
            expect(shouldForceMCQ("Tỉ số:", "50%")).toBe(false);
            expect(shouldForceMCQ("Tọa độ:", "(1; 2)")).toBe(false);
        });

        test("Loại bỏ 40 đơn vị thông dụng đi kèm số lượng (ngoại trừ quirk 'phần tử')", () => {
            const unitsReturningFalse = [
                "chiếc kẹo", "kẹo", "hộp sữa", "sữa", "hộp", "quả", "bông hoa", "hoa",
                "quyển sách", "sách", "vở", "bút", "học sinh", "bạn", "khối rubik",
                "khối", "rubik", "ước", "bội", "dm", "cm", "m", "kg", "g",
                "giờ", "phút", "giây", "lít", "l", "độ c", "độ", "c",
                "trang", "tuổi", "con", "cái", "ngày", "tháng", "năm",
                "đồng", "đ", "lần"
            ];

            unitsReturningFalse.forEach(unit => {
                const ans = `10 ${unit}`;
                expect(shouldForceMCQ("Tính toán:", ans)).toBe(false);
            });
        });

        test("Đặc tả Quirk: Đơn vị 'phần tử' kết thúc bằng Unicode 'ử' nên \\b không khớp -> giữ nguyên chuỗi 6 ký tự -> trả về true", () => {
            // 'phần tử' sau khi bỏ dấu cách là 'phầntử' có 6 ký tự > 5, và do \b'phần tử'\b không khớp Unicode nên không bị strip
            expect(shouldForceMCQ("Tính toán:", "4 phần tử")).toBe(true);
        });

        test("Đơn vị bọc trong ký hiệu $ cũng được xử lý sạch", () => {
            expect(shouldForceMCQ("Tính độ dài:", "$25$ cm")).toBe(false);
            expect(shouldForceMCQ("Tính khối lượng:", "$50$ kg")).toBe(false);
        });
    });

    // -------------------------------------------------------------------------
    // 6. REMAINING TEXT LENGTH THRESHOLD (> 5 CHARS)
    // -------------------------------------------------------------------------
    describe("6. Remaining Text Length Threshold (> 5 characters)", () => {
        test("Phần chữ còn lại <= 5 ký tự (sau khi bỏ dấu trắng) -> trả về false", () => {
            expect(shouldForceMCQ("Xác định điểm:", "Điểm A")).toBe(false);
            expect(shouldForceMCQ("Kết quả:", "abcde")).toBe(false); // 5 ký tự
            expect(shouldForceMCQ("Kết quả:", "a b c d e")).toBe(false); // 5 ký tự (bỏ whitespace)
        });

        test("Phần chữ còn lại > 5 ký tự -> trả về true (Bắt buộc trắc nghiệm vì chữ dài)", () => {
            expect(shouldForceMCQ("Kết luận:", "Hình chữ nhật")).toBe(true);
            expect(shouldForceMCQ("Kết luận:", "Số nguyên tố")).toBe(true);
            expect(shouldForceMCQ("Tính chất:", "Chia hết cho 2 và 5")).toBe(true);
            expect(shouldForceMCQ("Đáp án:", "abcdef")).toBe(true); // 6 ký tự > 5
        });

        test("Ngưỡng biên: 5 ký tự vs 6 ký tự", () => {
            expect(shouldForceMCQ("Hỏi:", "12345 abcde")).toBe(false); // digits stripped, "abcde" has length 5 <= 5 -> false
            expect(shouldForceMCQ("Hỏi:", "12345 abcdef")).toBe(true);  // digits stripped, "abcdef" has length 6 > 5 -> true
        });
    });

    // -------------------------------------------------------------------------
    // 7. REALISTIC MATH QUESTIONS INTEGRATION (NEGATIVE & POSITIVE CASES)
    // -------------------------------------------------------------------------
    describe("7. Realistic Math Question Fixtures", () => {
        test("Câu hỏi số học cơ bản (Short Answer hợp lệ -> false)", () => {
            expect(shouldForceMCQ("Tính 15 + 27:", "42")).toBe(false);
            expect(shouldForceMCQ("Tìm số đối của số -12:", "12")).toBe(false);
            expect(shouldForceMCQ("Tính chu vi hình vuông có cạnh 5 cm:", "20 cm")).toBe(false);
            expect(shouldForceMCQ("Số học sinh của lớp 6A là bao nhiêu?", "40 học sinh")).toBe(false);
            expect(shouldForceMCQ("Tìm x biết 2x = 10:", "5")).toBe(false);
        });

        test("Câu hỏi lý thuyết hoặc biểu thức phức tạp (Bắt buộc MCQ -> true)", () => {
            expect(shouldForceMCQ("Trong các khẳng định sau, khẳng định nào đúng?", "Số 0 là số tự nhiên")).toBe(true);
            expect(shouldForceMCQ("Cách viết nào sau đây đúng?", "A = {1; 2; 3}")).toBe(true);
            expect(shouldForceMCQ("Rút gọn phân số 4/8:", "$\\frac{1}{2}$")).toBe(true);
            expect(shouldForceMCQ("Tìm tập hợp các ước của 6:", "{1; 2; 3; 6}")).toBe(true);
            expect(shouldForceMCQ("Số nào dưới đây chia hết cho 3?", "123")).toBe(true);
        });
    });

    // -------------------------------------------------------------------------
    // 8. DELEGATION & PARITY VERIFICATION (questions.shouldForceMCQ === MathQuestionClassifier)
    // -------------------------------------------------------------------------
    describe("8. Delegation & Parity Verification", () => {
        test("questions.shouldForceMCQ tồn tại và ủy thác chính xác tới MathQuestionClassifier", () => {
            expect(typeof questions.shouldForceMCQ).toBe('function');
            
            const fixtures = [
                ["Tính 15 + 27:", "42"],
                ["Trong các khẳng định sau, khẳng định nào đúng?", "Số 0 là số tự nhiên"],
                ["Tính diện tích:", "15 cm"],
                ["Viết tập hợp:", "{1; 2}"],
                ["Đặc tả quirk:", "4 phần tử"],
                ["Lý thuyết:", "Hình chữ nhật"],
                ["Boundary:", null]
            ];

            fixtures.forEach(([qText, opt]) => {
                const pureResult = MathQuestionClassifier.shouldForceMCQ(qText, opt);
                const delegatedResult = questions.shouldForceMCQ(qText, opt);
                expect(delegatedResult).toBe(pureResult);
            });
        });
    });
});
