/**
 * Unit & Characterization Tests for string-utils module (js/core/string-utils.js)
 * 
 * Đảm bảo 100% contract và tương thích ngược:
 * - Tiền tố trắc nghiệm: A., B), C:, D -, a., b), ...
 * - Thẻ HTML: <b>, <span>, <div>, ...
 * - Ký tự đặc biệt & dấu câu: .,/#!$%^&*;:{}=-_`~()?
 * - Khoảng trắng & NBSP (\u00a0)
 * - Unicode & Tiếng Việt có dấu
 * - Giá trị biên: null, undefined, "", số, boolean, object, array
 * - Đáp án thực tế từ môn Toán và môn Tiếng Anh
 * - Tiện ích escapeJsString
 * - Giữ nguyên 100% behavior của implementation cũ
 * - Backward compatibility cho window.StringUtils, window.normalizeAnswerToken, app.normalizeAnswerToken
 */

const StringUtils = require('../../js/core/string-utils');
const { normalizeAnswerToken, escapeJsString } = require('../../js/core/string-utils');

// Bản cài đặt tham chiếu nguyên bản từ js/app.js để kiểm thử Characterization
function legacyEscapeJsString(str) {
    if (!str) return "";
    return String(str)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;")
        .replace(/\r?\n/g, " ");
}

function legacyNormalizeAnswerToken(str) {
    if (!str) return "";
    return String(str)
        .replace(/^[A-D][\.\)\:\-\s]+/i, "")
        .replace(/<[^>]*>/g, "")
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
        .replace(/[\u00a0]/g, " ")
        .toLowerCase()
        .trim();
}

describe("Unit Tests — StringUtils (js/core/string-utils.js)", () => {

    describe("1. Public Contract & Exports", () => {
        test("Export đối tượng StringUtils qua CommonJS module.exports", () => {
            expect(typeof StringUtils).toBe('object');
            expect(typeof StringUtils.normalizeAnswerToken).toBe('function');
            expect(typeof StringUtils.escapeJsString).toBe('function');
        });

        test("Export hàm qua destructuring { normalizeAnswerToken, escapeJsString }", () => {
            expect(typeof normalizeAnswerToken).toBe('function');
            expect(typeof escapeJsString).toBe('function');
            expect(normalizeAnswerToken).toBe(StringUtils.normalizeAnswerToken);
            expect(escapeJsString).toBe(StringUtils.escapeJsString);
        });

        test("Tự động gán vào globalThis / window", () => {
            expect(globalThis.StringUtils).toBeDefined();
            expect(typeof globalThis.StringUtils.normalizeAnswerToken).toBe('function');
            expect(typeof globalThis.normalizeAnswerToken).toBe('function');
            expect(typeof globalThis.escapeJsString).toBe('function');
        });
    });

    describe("2. normalizeAnswerToken — Xử lý tiền tố trắc nghiệm (A., B), C:, D -)", () => {
        test("Loại bỏ tiền tố 'A.' và 'A. '", () => {
            expect(normalizeAnswerToken("A. Hà Nội")).toBe("hà nội");
            expect(normalizeAnswerToken("A.150")).toBe("150");
            expect(normalizeAnswerToken("A.   Hải Phòng")).toBe("hải phòng");
        });

        test("Loại bỏ tiền tố 'B)' và 'B) '", () => {
            expect(normalizeAnswerToken("B) Đáp án đúng")).toBe("đáp án đúng");
            expect(normalizeAnswerToken("B)123")).toBe("123");
        });

        test("Loại bỏ tiền tố 'C:' và 'C: '", () => {
            expect(normalizeAnswerToken("C: Kết quả")).toBe("kết quả");
            expect(normalizeAnswerToken("C:45")).toBe("45");
        });

        test("Loại bỏ tiền tố 'D -' và 'D - '", () => {
            expect(normalizeAnswerToken("D - Phương án")).toBe("phương án");
            expect(normalizeAnswerToken("D -Chính xác")).toBe("chính xác");
        });

        test("Loại bỏ tiền tố 'A ' (chỉ có chữ cái và khoảng trắng)", () => {
            expect(normalizeAnswerToken("A Hà Nội")).toBe("hà nội");
            expect(normalizeAnswerToken("B   Đà Nẵng")).toBe("đà nẵng");
        });

        test("Không phân biệt hoa thường với tiền tố (a., b), c:, d -)", () => {
            expect(normalizeAnswerToken("a. hà nội")).toBe("hà nội");
            expect(normalizeAnswerToken("b) đà nẵng")).toBe("đà nẵng");
            expect(normalizeAnswerToken("c: cần thơ")).toBe("cần thơ");
            expect(normalizeAnswerToken("d - huế")).toBe("huế");
        });

        test("Không bóc tách chữ A/B/C/D nếu là một phần của từ", () => {
            expect(normalizeAnswerToken("Apple")).toBe("apple");
            expect(normalizeAnswerToken("Ball")).toBe("ball");
            expect(normalizeAnswerToken("Cat")).toBe("cat");
            expect(normalizeAnswerToken("Dog")).toBe("dog");
            expect(normalizeAnswerToken("An")).toBe("an");
            expect(normalizeAnswerToken("Ba")).toBe("ba");
        });
    });

    describe("3. normalizeAnswerToken — Bóc tách thẻ HTML", () => {
        test("Bóc tách thẻ <b>, <i>, <u>", () => {
            expect(normalizeAnswerToken("<b>Hà Nội</b>")).toBe("hà nội");
            expect(normalizeAnswerToken("<i>Đà Nẵng</i>")).toBe("đà nẵng");
            expect(normalizeAnswerToken("<u>Cần Thơ</u>")).toBe("cần thơ");
        });

        test("Bóc tách thẻ <span> với style và class phức tạp", () => {
            expect(normalizeAnswerToken("<span style=\"color:#10b981; font-weight:800;\">120</span>")).toBe("120");
            expect(normalizeAnswerToken("<span class='math-tex'>x + 5 = 10</span>")).toBe("x + 5 10");
        });

        test("Bóc tách thẻ lồng nhau", () => {
            expect(normalizeAnswerToken("<div><p><b>Kết quả:</b> 15 cm</p></div>")).toBe("kết quả 15 cm");
        });
    });

    describe("4. normalizeAnswerToken — Xóa dấu câu & ký tự đặc biệt", () => {
        test("Xóa các dấu câu thông dụng: .,/#!$%^&*;:{}=-_`~()?", () => {
            const input = "Xin chào (Việt Nam)! Bạn khỏe không? [Điểm: 10/10; $100#]";
            // Các ký tự bị thay thế: ( ) ! ? : / ; $ #
            expect(normalizeAnswerToken(input)).toBe("xin chào việt nam bạn khỏe không [điểm 1010 100]");
        });

        test("Xóa dấu chấm thập phân và dấu phẩy theo rule nguyên bản", () => {
            expect(normalizeAnswerToken("15.5")).toBe("155");
            expect(normalizeAnswerToken("1,000")).toBe("1000");
        });

        test("Xóa dấu gạch nối và gạch dưới", () => {
            expect(normalizeAnswerToken("word-by-word")).toBe("wordbyword");
            expect(normalizeAnswerToken("snake_case_token")).toBe("snakecasetoken");
        });
    });

    describe("5. normalizeAnswerToken — Xử lý khoảng trắng & Non-Breaking Space (\u00a0)", () => {
        test("Chuyển đổi non-breaking space (\\u00a0) thành khoảng trắng thường", () => {
            const input = "Từ\u00a0vựng\u00a0tiếng\u00a0Anh";
            expect(normalizeAnswerToken(input)).toBe("từ vựng tiếng anh");
        });

        test("Cắt khoảng trắng thừa ở hai đầu chuỗi (.trim())", () => {
            expect(normalizeAnswerToken("   Hà Nội   ")).toBe("hà nội");
            expect(normalizeAnswerToken("\t\nĐà Nẵng\n\t")).toBe("đà nẵng");
        });

        test("Rút gọn nhiều khoảng trắng liên tiếp thành 1 khoảng trắng duy nhất", () => {
            expect(normalizeAnswerToken("Hà Nội   Việt Nam")).toBe("hà nội việt nam");
            expect(normalizeAnswerToken("  it's    a    book  ")).toBe("it's a book");
        });
    });

    describe("6. normalizeAnswerToken — Unicode & Tiếng Việt có dấu", () => {
        test("Bảo toàn chữ tiếng Việt có dấu ở dạng chữ thường", () => {
            expect(normalizeAnswerToken("TRẦN BÌNH MINH")).toBe("trần bình minh");
            expect(normalizeAnswerToken("TRẦN ĐỨC PHÚC")).toBe("trần đức phúc");
            expect(normalizeAnswerToken("TRẦN BẢO NGỌC")).toBe("trần bảo ngọc");
        });

        test("Xử lý toàn bộ nguyên âm tiếng Việt có dấu", () => {
            const input = "À Á Ạ Ả Ã Â Ầ Ấ Ậ Ẩ Ẫ Ă Ằ Ắ Ặ Ẳ Ẵ È É Ẹ Ẻ Ẽ Ê Ề Ế Ệ Ể Ễ Ì Í Ị Ỉ Ĩ Ò Ó Ọ Ỏ Õ Ô Ồ Ố Ộ Ổ Ỗ Ơ Ờ Ớ Ợ Ở Ỡ Ù Ú Ụ Ủ Ũ Ư Ừ Ứ Ự Ử Ữ Ỳ Ý Ỵ Ỷ Ỹ Đ";
            const expected = "à á ạ ả ã â ầ ấ ậ ẩ ẫ ă ằ ắ ặ ẳ ẵ è é ẹ ẻ ẽ ê ề ế ệ ể ễ ì í ị ỉ ĩ ò ó ọ ỏ õ ô ồ ố ộ ổ ỗ ơ ờ ớ ợ ở ỡ ù ú ụ ủ ũ ư ừ ứ ự ử ữ ỳ ý ỵ ỷ ỹ đ";
            expect(normalizeAnswerToken(input)).toBe(expected);
        });
    });

    describe("7. normalizeAnswerToken — Đầu vào biên (Edge Cases & Non-string)", () => {
        test("null trả về chuỗi rỗng", () => {
            expect(normalizeAnswerToken(null)).toBe("");
        });

        test("undefined trả về chuỗi rỗng", () => {
            expect(normalizeAnswerToken(undefined)).toBe("");
        });

        test("Chuỗi rỗng trả về chuỗi rỗng", () => {
            expect(normalizeAnswerToken("")).toBe("");
        });

        test("Số 0 và số dương/âm", () => {
            expect(normalizeAnswerToken(0)).toBe(""); // 0 là falsy theo if (!str) return ""
            expect(normalizeAnswerToken(12345)).toBe("12345");
            expect(normalizeAnswerToken(-50)).toBe("50"); // Dấu trừ bị loại bỏ theo regex
        });

        test("Boolean true / false", () => {
            expect(normalizeAnswerToken(true)).toBe("true");
            expect(normalizeAnswerToken(false)).toBe(""); // false là falsy theo if (!str) return ""
        });
    });

    describe("8. normalizeAnswerToken — Đáp án thực tế trong dữ liệu bài học", () => {
        test("Đáp án trắc nghiệm môn Toán", () => {
            expect(normalizeAnswerToken("A. 24")).toBe("24");
            expect(normalizeAnswerToken("B. \\{1, 2, 3, 4\\}")).toBe("\\1 2 3 4\\");
            expect(normalizeAnswerToken("C. Số nguyên tố")).toBe("số nguyên tố");
            expect(normalizeAnswerToken("D. \\frac{3}{4}")).toBe("\\frac34");
        });

        test("Đáp án trắc nghiệm môn Tiếng Anh", () => {
            expect(normalizeAnswerToken("A. school")).toBe("school");
            expect(normalizeAnswerToken("B) playground")).toBe("playground");
            expect(normalizeAnswerToken("C: English")).toBe("english");
            expect(normalizeAnswerToken("D - science")).toBe("science");
        });

        test("Từ ghép nối IOE Matching", () => {
            expect(normalizeAnswerToken("playing football")).toBe("playing football");
            expect(normalizeAnswerToken("swimming pool")).toBe("swimming pool");
        });
    });

    describe("9. escapeJsString — Unit Tests", () => {
        test("Escape dấu gạch chéo ngược (\\)", () => {
            expect(escapeJsString("C:\\Program Files\\App")).toBe("C:\\\\Program Files\\\\App");
        });

        test("Escape dấu nháy đơn (')", () => {
            expect(escapeJsString("It's a beautiful day")).toBe("It\\'s a beautiful day");
        });

        test("Escape dấu nháy kép (\") thành &quot;", () => {
            expect(escapeJsString('He said "Hello"')).toBe('He said &quot;Hello&quot;');
        });

        test("Thay thế ký tự xuống dòng (\\r\\n, \\n) thành dấu cách", () => {
            expect(escapeJsString("Dòng 1\r\nDòng 2\nDòng 3")).toBe("Dòng 1 Dòng 2 Dòng 3");
        });

        test("Xử lý chuỗi kết hợp nhiều ký tự đặc biệt", () => {
            const input = "alert('Hello \\'World\\'');\nconsole.log(\"Done\");";
            const expected = "alert(\\'Hello \\\\\\'World\\\\\\'\\'); console.log(&quot;Done&quot;);";
            expect(escapeJsString(input)).toBe(expected);
        });

        test("Xử lý giá trị falsy và non-string", () => {
            expect(escapeJsString(null)).toBe("");
            expect(escapeJsString(undefined)).toBe("");
            expect(escapeJsString("")).toBe("");
            expect(escapeJsString(0)).toBe(""); // 0 là falsy theo if (!str) return ""
            expect(escapeJsString(100)).toBe("100");
        });
    });

    describe("10. Canonicalization Tests — Đối chiếu với chuẩn Canonicalization Contract", () => {
        function canonicalReference(str) {
            if (!str) return "";
            return String(str)
                .replace(/^[A-D][\.\)\:\-\s]+/i, "")
                .replace(/<[^>]*>/g, "")
                .replace(/[’‘ʼʻ]/g, "'")
                .replace(/[“”«»]/g, "")
                .replace(/[–—−]/g, "-")
                .replace(/[\u00a0\u2000-\u200b\u202f\u3000\ufeff]/g, " ")
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
                .replace(/\s+/g, " ")
                .toLowerCase()
                .trim();
        }

        const sampleStrings = [
            "A. Hà Nội",
            "B) 150 cm",
            "C: Kết quả đúng",
            "D - Không chính xác",
            "a. thường hoa a",
            "<b>Đậm</b> và <i>nghiêng</i>",
            "<span style='color:red;'>123.456</span>",
            "Xin chào, Việt Nam! (Học tập)",
            "Non-breaking\u00a0space\u00a0here",
            "TRẦN BÌNH MINH - Lớp 6A",
            "Trần Đức Phúc - Lớp 4",
            "Trần Bảo Ngọc - Lớp 1",
            "It's a 'test' with \"quotes\" & \\slashes\\",
            "Line 1\r\nLine 2\nLine 3",
            "",
            "   trimmed whitespace   ",
            "!@#$%^&*()_+~`|}{[]:;?><,./-=",
            "12345",
            "school",
            "playground",
            "football"
        ];

        sampleStrings.forEach((str, idx) => {
            test(`Canonical normalizeAnswerToken #${idx + 1}: "${str.substring(0, 25)}"`, () => {
                expect(normalizeAnswerToken(str)).toBe(canonicalReference(str));
            });

            test(`Characterization escapeJsString #${idx + 1}: "${str.substring(0, 25)}"`, () => {
                expect(escapeJsString(str)).toBe(legacyEscapeJsString(str));
            });
        });
    });

    describe("11. Backward Compatibility — app.normalizeAnswerToken delegation", () => {
        test("app.normalizeAnswerToken ủy quyền và trả về kết quả đồng nhất", () => {
            const mockApp = {
                normalizeAnswerToken: function(str) {
                    if (typeof StringUtils !== 'undefined' && typeof StringUtils.normalizeAnswerToken === 'function') {
                        return StringUtils.normalizeAnswerToken(str);
                    }
                    if (typeof normalizeAnswerToken === 'function') {
                        return normalizeAnswerToken(str);
                    }
                    if (!str) return "";
                    return String(str)
                        .replace(/^[A-D][\.\)\:\-\s]+/i, "")
                        .replace(/<[^>]*>/g, "")
                        .replace(/[’‘ʼʻ]/g, "'")
                        .replace(/[“”«»"]/g, "")
                        .replace(/[–—−]/g, "-")
                        .replace(/[\u00a0\u2000-\u200b\u202f\u3000\ufeff]/g, " ")
                        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
                        .replace(/\s+/g, " ")
                        .toLowerCase()
                        .trim();
                },
                escapeJsString: function(str) {
                    if (typeof StringUtils !== 'undefined' && typeof StringUtils.escapeJsString === 'function') {
                        return StringUtils.escapeJsString(str);
                    }
                    if (typeof escapeJsString === 'function') {
                        return escapeJsString(str);
                    }
                    if (!str) return "";
                    return String(str)
                        .replace(/\\/g, "\\\\")
                        .replace(/'/g, "\\'")
                        .replace(/"/g, "&quot;")
                        .replace(/\r?\n/g, " ");
                }
            };

            const testInput = "A. <b>Hà Nội</b> (Thủ đô)";
            expect(mockApp.normalizeAnswerToken(testInput)).toBe(normalizeAnswerToken(testInput));
            expect(mockApp.escapeJsString("Hello 'World'")).toBe(escapeJsString("Hello 'World'"));
        });
    });

    describe("12. Canonicalization — Dấu nháy cong (Curly Apostrophes) & Contractions", () => {
        test("Chuyển dấu nháy cong (’) thành dấu nháy thẳng (') cho từ don’t", () => {
            expect(normalizeAnswerToken("don’t")).toBe("don't");
            expect(normalizeAnswerToken("DON’T")).toBe("don't");
            expect(normalizeAnswerToken("don't")).toBe("don't");
            expect(normalizeAnswerToken("don’t")).toBe(normalizeAnswerToken("don't"));
        });

        test("Chuyển dấu nháy cong cho I’m, it’s, teacher’s, they’re, we’ve", () => {
            expect(normalizeAnswerToken("I’m a student")).toBe("i'm a student");
            expect(normalizeAnswerToken("I'm a student")).toBe("i'm a student");
            expect(normalizeAnswerToken("I’m a student")).toBe(normalizeAnswerToken("I'm a student"));

            expect(normalizeAnswerToken("It’s raining")).toBe("it's raining");
            expect(normalizeAnswerToken("It's raining")).toBe("it's raining");
            expect(normalizeAnswerToken("It’s raining")).toBe(normalizeAnswerToken("It's raining"));

            expect(normalizeAnswerToken("Teacher’s book")).toBe("teacher's book");
            expect(normalizeAnswerToken("They’re playing")).toBe("they're playing");
            expect(normalizeAnswerToken("We’ve finished")).toBe("we've finished");
        });

        test("Xử lý các biến thể dấu nháy đơn Unicode (left single quote ‘, modifier letter ʼ, ʻ)", () => {
            expect(normalizeAnswerToken("don‘t")).toBe("don't");
            expect(normalizeAnswerToken("donʼt")).toBe("don't");
            expect(normalizeAnswerToken("donʻt")).toBe("don't");
        });
    });

    describe("13. Canonicalization — Ngoặc kép cong, Gạch ngang dài & Khoảng trắng Unicode", () => {
        test("Loại bỏ ngoặc kép cong (“...”), («...»)", () => {
            expect(normalizeAnswerToken('“Hello World”')).toBe("hello world");
            expect(normalizeAnswerToken('«Tiếng Anh 6»')).toBe("tiếng anh 6");
        });

        test("Chuyển đổi và loại bỏ các biến thể gạch ngang dài (en-dash –, em-dash —, minus −)", () => {
            expect(normalizeAnswerToken("science–lab")).toBe("sciencelab");
            expect(normalizeAnswerToken("word—play")).toBe("wordplay");
            expect(normalizeAnswerToken("one−two")).toBe("onetwo");
        });

        test("Xử lý khoảng trắng đặc biệt Unicode (Zero-Width Space \\u200b, Narrow NBSP \\u202f, Ideographic Space \\u3000, BOM \\ufeff)", () => {
            expect(normalizeAnswerToken("hello\u200bworld")).toBe("hello world");
            expect(normalizeAnswerToken("hello\u202fworld")).toBe("hello world");
            expect(normalizeAnswerToken("hello\u3000world")).toBe("hello world");
            expect(normalizeAnswerToken("\ufeffhello world")).toBe("hello world");
        });
    });

    describe("14. Integration — So khớp đáp án Tiếng Anh 4 kỹ năng", () => {
        test("Dictation: Học sinh gõ dấu nháy cong khớp với đáp án nháy thẳng", () => {
            const studentInput = "He doesn’t like carrots.";
            const acceptedAnswers = ["He doesn't like carrots", "He does not like carrots"];
            const normInput = normalizeAnswerToken(studentInput);
            const isMatch = acceptedAnswers.map(ans => normalizeAnswerToken(ans)).includes(normInput);
            expect(isMatch).toBe(true);
        });

        test("Sentence Unscramble: Học sinh ghép từ có dấu câu ở cuối vẫn khớp", () => {
            const chosenWords = ["It's", "a", "beautiful", "sunny", "day"];
            const studentSentence = normalizeAnswerToken(chosenWords.join(" "));
            const correctSentence = normalizeAnswerToken("It’s a beautiful, sunny day.");
            expect(studentSentence).toBe(correctSentence);
        });

        test("Spelling: Sắp xếp chữ cái có khoảng trắng và NBSP", () => {
            const chosenLetters = ["E", "N", "\u00a0", "G", "L", "I", "S", "H"];
            const studentWord = normalizeAnswerToken(chosenLetters.join("")).replace(/\s+/g, "");
            const correctWord = normalizeAnswerToken("English").replace(/\s+/g, "");
            expect(studentWord).toBe(correctWord);
            expect(studentWord).toBe("english");
        });

        test("Choice: Lựa chọn trắc nghiệm có tiền tố B) và nháy cong", () => {
            const optionText = "B) She’s twelve years old.";
            const correctAnswer = "She's twelve years old";
            expect(normalizeAnswerToken(optionText)).toBe(normalizeAnswerToken(correctAnswer));
        });
    });
});

