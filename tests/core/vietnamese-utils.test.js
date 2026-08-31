/**
 * Unit & Characterization Tests for vietnamese-utils module (js/core/vietnamese-utils.js)
 * 
 * Đảm bảo 100% contract và tương thích ngược:
 * - Tiếng Việt thường
 * - Tiếng Việt HOA
 * - Chuỗi không dấu
 * - Chuỗi rỗng & non-string
 * - Ký tự đặc biệt, số, dấu câu
 * - Unicode edge cases
 * - Giữ nguyên 100% behavior của implementation cũ
 */

const removeVietnameseTones = require('../../js/core/vietnamese-utils');
const { removeVietnameseTones: destructuredFn } = require('../../js/core/vietnamese-utils');

// Bản cài đặt tham chiếu nguyên bản để kiểm thử Characterization
function legacyRemoveVietnameseTones(str) {
    if (typeof str !== 'string') return '';
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|U|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

describe("Unit Tests — vietnameseUtils (js/core/vietnamese-utils.js)", () => {

    describe("1. Public Contract & Exports", () => {
        test("Export hàm trực tiếp qua module.exports", () => {
            expect(typeof removeVietnameseTones).toBe('function');
        });

        test("Export hàm qua destructuring { removeVietnameseTones }", () => {
            expect(typeof destructuredFn).toBe('function');
            expect(destructuredFn).toBe(removeVietnameseTones);
        });

        test("Tự động gán vào globalThis / window", () => {
            expect(globalThis.removeVietnameseTones).toBeDefined();
            expect(typeof globalThis.removeVietnameseTones).toBe('function');
        });
    });

    describe("2. Chuỗi tiếng Việt chữ thường", () => {
        test("Khử dấu nguyên âm a (à, á, ạ, ả, ã, â, ầ, ấ, ậ, ẩ, ẫ, ă, ằ, ắ, ặ, ẳ, ẵ)", () => {
            const input = "à á ạ ả ã â ầ ấ ậ ẩ ẫ ă ằ ắ ặ ẳ ẵ";
            const expected = "a a a a a a a a a a a a a a a a a";
            expect(removeVietnameseTones(input)).toBe(expected);
        });

        test("Khử dấu nguyên âm e (è, é, ẹ, rẻ, ẽ, ê, ề, ế, ệ, ể, ễ)", () => {
            const input = "è é ẹ ẻ ẽ ê ề ế ệ ể ễ";
            const expected = "e e e e e e e e e e e";
            expect(removeVietnameseTones(input)).toBe(expected);
        });

        test("Khử dấu nguyên âm i (ì, í, ị, ỉ, ĩ)", () => {
            const input = "ì í ị ỉ ĩ";
            const expected = "i i i i i";
            expect(removeVietnameseTones(input)).toBe(expected);
        });

        test("Khử dấu nguyên âm o (ò, ó, ọ, ỏ, õ, ô, ồ, ố, ộ, ổ, ỗ, ơ, ờ, ớ, ợ, ở, ỡ)", () => {
            const input = "ò ó ọ ỏ õ ô ồ ố ộ ổ ỗ ơ ờ ớ ợ ở ỡ";
            const expected = "o o o o o o o o o o o o o o o o o";
            expect(removeVietnameseTones(input)).toBe(expected);
        });

        test("Khử dấu nguyên âm u (ù, ú, ụ, ủ, ũ, ư, ừ, ứ, ự, cử, ữ)", () => {
            const input = "ù ú ụ ủ ũ ư ừ ứ ự ử ữ";
            const expected = "u u u u u u u u u u u";
            expect(removeVietnameseTones(input)).toBe(expected);
        });

        test("Khử dấu nguyên âm y (ỳ, ý, ỵ, ỷ, ỹ)", () => {
            const input = "ỳ ý ỵ ỷ ỹ";
            const expected = "y y y y y";
            expect(removeVietnameseTones(input)).toBe(expected);
        });

        test("Khử dấu phụ âm đ -> d", () => {
            const input = "đường đi đến đích";
            const expected = "duong di den dich";
            expect(removeVietnameseTones(input)).toBe(expected);
        });

        test("Từ ghép và câu tiếng Việt thường đầy đủ", () => {
            const input = "học sinh làm bài kiểm tra môn toán và tiếng anh";
            const expected = "hoc sinh lam bai kiem tra mon toan va tieng anh";
            expect(removeVietnameseTones(input)).toBe(expected);
        });
    });

    describe("3. Chuỗi tiếng Việt chữ HOA", () => {
        test("Khử dấu nguyên âm HOA A", () => {
            const input = "À Á Ạ Ả Ã Â Ầ Ấ Ậ Ẩ Ẫ Ă Ằ Ắ Ặ Ẳ Ẵ";
            const expected = "A A A A A A A A A A A A A A A A A";
            expect(removeVietnameseTones(input)).toBe(expected);
        });

        test("Khử dấu nguyên âm HOA E", () => {
            const input = "È É Ẹ Ẻ Ẽ Ê Ề Ế Ệ Ể Ễ";
            const expected = "E E E E E E E E E E E";
            expect(removeVietnameseTones(input)).toBe(expected);
        });

        test("Khử dấu nguyên âm HOA I", () => {
            const input = "Ì Í Ị Ỉ Ĩ";
            const expected = "I I I I I";
            expect(removeVietnameseTones(input)).toBe(expected);
        });

        test("Khử dấu nguyên âm HOA O", () => {
            const input = "Ò Ó Ọ Ỏ Õ Ô Ồ Ố Ộ Ổ Ỗ Ơ family Ờ Ớ Ợ Ở Ỡ";
            const expected = "O O O O O O O O O O O O family O O O O O";
            expect(removeVietnameseTones(input)).toBe(expected);
        });

        test("Khử dấu nguyên âm HOA U", () => {
            const input = "Ù Ú Ụ Ủ U Ư Ừ Ứ Ự Ử Ữ";
            const expected = "U U U U U U U U U U U";
            expect(removeVietnameseTones(input)).toBe(expected);
        });

        test("Khử dấu nguyên âm HOA Y", () => {
            const input = "Ỳ Ý Ỵ Ỷ Ỹ";
            const expected = "Y Y Y Y Y";
            expect(removeVietnameseTones(input)).toBe(expected);
        });

        test("Khử dấu phụ âm HOA Đ -> D", () => {
            const input = "ĐỒNG NAI VÀ ĐÀ NẴNG";
            const expected = "DONG NAI VA DA NANG";
            expect(removeVietnameseTones(input)).toBe(expected);
        });
    });

    describe("4. Chuỗi không dấu & Chuỗi rỗng", () => {
        test("Chuỗi không dấu không bị thay đổi", () => {
            const input = "Hello World! This is an English string 12345.";
            expect(removeVietnameseTones(input)).toBe(input);
        });

        test("Chuỗi rỗng trả về chuỗi rỗng", () => {
            expect(removeVietnameseTones("")).toBe("");
        });
    });

    describe("5. Đầu vào không hợp lệ (Non-string inputs)", () => {
        test("null trả về chuỗi rỗng", () => {
            expect(removeVietnameseTones(null)).toBe("");
        });

        test("undefined trả về chuỗi rỗng", () => {
            expect(removeVietnameseTones(undefined)).toBe("");
        });

        test("number trả về chuỗi rỗng", () => {
            expect(removeVietnameseTones(12345)).toBe("");
            expect(removeVietnameseTones(0)).toBe("");
            expect(removeVietnameseTones(NaN)).toBe("");
        });

        test("boolean trả về chuỗi rỗng", () => {
            expect(removeVietnameseTones(true)).toBe("");
            expect(removeVietnameseTones(false)).toBe("");
        });

        test("object và array trả về chuỗi rỗng", () => {
            expect(removeVietnameseTones({})).toBe("");
            expect(removeVietnameseTones([])).toBe("");
            expect(removeVietnameseTones({ title: "Bài 1" })).toBe("");
        });

        test("function trả về chuỗi rỗng", () => {
            expect(removeVietnameseTones(() => {})).toBe("");
        });
    });

    describe("6. Ký tự đặc biệt, số và dấu câu", () => {
        test("Bảo toàn dấu câu và ký tự đặc biệt", () => {
            const input = "Toán 6: Bài tập 1.1 — Ước & Bội! (Trang 10-15); [100%]";
            const expected = "Toan 6: Bai tap 1.1 — Uoc & Boi! (Trang 10-15); [100%]";
            expect(removeVietnameseTones(input)).toBe(expected);
        });

        test("Bảo toàn ký tự xuống dòng và tab", () => {
            const input = "Dòng 1: Tiêu đề\n\tDòng 2: Nội dung chi tiết";
            const expected = "Dong 1: Tieu de\n\tDong 2: Noi dung chi tiet";
            expect(removeVietnameseTones(input)).toBe(expected);
        });
    });

    describe("7. Tiêu đề bài học và Tên tệp PDF thực tế (Domain Use Case)", () => {
        test("Xử lý đúng tiêu đề bài thi thực tế", () => {
            const lessonTitle = "Bài 15. Quy tắc dấu ngoặc và phép nhân số nguyên";
            const sanitizedTitle = removeVietnameseTones(lessonTitle)
                .replace(/[^a-zA-Z0-9\-_]/g, '_')
                .replace(/_+/g, '_');
            expect(sanitizedTitle).toBe("Bai_15_Quy_tac_dau_ngoac_va_phep_nhan_so_nguyen");
        });

        test("Xử lý tiêu đề chứa tên học sinh có dấu", () => {
            const studentName = "Trần Bình Minh - Lớp 6A";
            const sanitized = removeVietnameseTones(studentName);
            expect(sanitized).toBe("Tran Binh Minh - Lop 6A");
        });

        test("Xử lý tên học sinh Trần Đức Phúc và Trần Bảo Ngọc", () => {
            expect(removeVietnameseTones("Trần Đức Phúc")).toBe("Tran Duc Phuc");
            expect(removeVietnameseTones("Trần Bảo Ngọc")).toBe("Tran Bao Ngoc");
        });
    });

    describe("8. Characterization Test — Đối chiếu 100% với hàm gốc", () => {
        const testCases = [
            "Hà Nội mùa thu lá vàng rơi",
            "Đà Nẵng thành phố đáng sống",
            "TP. Hồ Chí Minh rực rỡ cờ hoa",
            "Cần Thơ gạo trắng nước trong",
            "Huế mộng mơ bên dòng sông Hương",
            "Ước chung lớn nhất và bội chung nhỏ nhất",
            "Số thập phân vô hạn tuần hoàn",
            "Định lý Pytago trong tam giác vuông",
            "",
            "1234567890",
            "!@#$%^&*()_+~`|}{[]:;?><,./-=",
            "A Ă Â B C D Đ E Ê G H I K L M N O Ô Ơ P Q R S T U Ư V X Y",
            "a ă â b c d đ e ê g h i k l m n o ô ơ p q r s t u ư v x y",
            "á à ả ã ạ ắ ằ ẳ ẵ ặ ấ ầ ổ ẫ ậ",
            "é è ẻ ẽ ẹ ế ề ể ễ ệ",
            "í ì ỉ ĩ ị",
            "ó ò ỏ õ ọ ố ồ ổ ỗ ộ ớ ờ ở ỡ ợ",
            "ú ù ủ ũ ụ ứng ừ tử ữ ự",
            "ý ỳ ỷ ỹ ỵ"
        ];

        testCases.forEach((tc, idx) => {
            test(`Test case #${idx + 1}: "${tc.substring(0, 30)}..." phải khớp 100% với legacy`, () => {
                expect(removeVietnameseTones(tc)).toBe(legacyRemoveVietnameseTones(tc));
            });
        });
    });
});
