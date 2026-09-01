/**
 * math-answer-evaluator — Bộ đánh giá câu trả lời ngắn môn Toán thuần túy (Pure Math Short Answer Evaluator).
 * Tách biệt hoàn toàn khỏi logic điều khiển giao diện DOM, state mutation, audio, persistence và window.app.
 * Hỗ trợ UMD (Node.js CommonJS, Web Workers, Browser Global).
 *
 * Public Contract:
 * - cleanAnswer(ans: any): string
 * - evaluateShortAnswer(userInput: any, correctText: any): boolean
 * - cleanAnswerForComparison(ans: any): string (alias)
 * - checkShortAnswer(userInput: any, correctText: any): boolean (alias)
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.MathAnswerEvaluator = api;
    if (typeof window !== 'undefined') {
        window.MathAnswerEvaluator = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.MathAnswerEvaluator = api;
    }
    if (typeof self !== 'undefined') {
        self.MathAnswerEvaluator = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // Danh sách các token đơn vị có cấu trúc, sắp xếp theo độ dài giảm dần để tránh nuốt tiền tố
    const UNIT_TOKENS = [
        // Đơn vị nhiều từ (Multi-word units)
        'trục đối xứng', 'tâm đối xứng', 'chiếc kẹo', 'gói kẹo', 'cái kẹo',
        'hộp sữa', 'bông hoa', 'quyển sách', 'cuốn sách', 'quyển vở', 'cuốn vở',
        'cây bút', 'chiếc bút', 'khối rubik', 'học sinh', 'phần tử',
        'quả táo', 'quả cam',
        // Đơn vị từ đơn / thông dụng
        'độ c', 'độ', 'bạn', 'em', 'kẹo', 'hộp', 'sữa', 'quả', 'trái', 'bông', 'hoa',
        'sách', 'vở', 'bút', 'rubik', 'khối', 'ước', 'bội', 'trục',
        // Đơn vị thời gian
        'thế kỷ', 'thế kỉ', 'tháng', 'tuần', 'ngày', 'năm',
        'giờ', 'gio', 'phút', 'phut', 'giây', 'giay',
        // Đơn vị diện tích & thể tích (ký hiệu số mũ và dạng thường)
        'km2', 'hm2', 'dam2', 'm2', 'dm2', 'cm2', 'mm2', 'ha',
        'km3', 'm3', 'dm3', 'cm3', 'mm3',
        // Đơn vị đo độ dài & khối lượng & dung tích
        'km', 'hm', 'dam', 'dm', 'cm', 'mm',
        'tấn', 'tan', 'tạ', 'ta', 'yến', 'yen', 'kg', 'gam', 'mg',
        'lít', 'lit', 'ml',
        // Ký tự đơn vị viết tắt đơn lẻ (chỉ bóc tách sau số hoặc sau khoảng trắng)
        'm', 'g', 'l', 'h', 'p', 's'
    ];

    /**
     * Chuẩn hóa bước 1: Xử lý LaTeX, tiền tố phương án trắc nghiệm, dấu câu và ký tự Unicode.
     *
     * @param {any} str - Chuỗi đầu vào
     * @returns {string} Chuỗi sau chuẩn hóa cơ sở
     */
    function normalizeBase(str) {
        if (typeof str !== 'string') return '';
        let s = str.trim();
        if (!s) return '';

        // 1. Loại bỏ ký tự đặc biệt LaTeX $
        s = s.replace(/\$/g, '').trim();

        // 2. Loại bỏ các lệnh định dạng LaTeX phổ biến
        s = s.replace(/\\(?:text|mathrm|mathbf|mathit)\{([^}]+)\}/g, '$1');
        s = s.replace(/\\(?:left|right)/g, '');
        s = s.replace(/\\\{/g, '{').replace(/\\\}/g, '}');
        s = s.replace(/\\cdot/g, '*').replace(/\\times/g, '*');

        // Chuyển phân số LaTeX \frac{a}{b} hoặc \dfrac{a}{b} -> a/b
        s = s.replace(/\\d?frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2');

        // 3. Loại bỏ tiền tố phương án trắc nghiệm (A. B) C: D - hoặc a.)
        // Chỉ loại bỏ khi theo sau là dấu phân cách hoặc khoảng trắng không chứa phép toán
        s = s.replace(/^[A-Da-d]\s*[\.\)\:\-]\s*/, '');
        s = s.replace(/^[A-Da-d]\s+(?![=<>+\-*/])/, '');
        s = s.replace(/^(?:đáp án|câu)\s+[A-Da-d]\s*[\.\:\-]\s*/i, '');

        // 4. Loại bỏ các tiền tố tiêu đề như "đáp số:", "kết quả =", "kết quả:", "đáp án:"
        s = s.replace(/^(?:đáp số|kết quả)\s*[:=]?\s*/i, '');
        s = s.replace(/^đáp án\s*[:=]\s*/i, '');

        // 5. Chuẩn hóa dấu trừ và dấu nháy Unicode
        s = s.replace(/[\u2212\u2013\u2014]/g, '-');
        s = s.replace(/[\u201C\u201D\u201E\u201F\u2018\u2019]/g, '');

        // 6. Chuẩn hóa ký hiệu độ: 30°C -> 30 độ c, 30° -> 30 độ
        s = s.replace(/°\s*c\b/gi, ' độ c');
        s = s.replace(/°/g, ' độ');

        // 7. Chuẩn hóa số mũ diện tích/thể tích: cm² -> cm2, m³ -> m3
        s = s.replace(/²/g, '2').replace(/³/g, '3');

        // 8. Loại bỏ dấu chấm/phẩy/hỏi/than ở cuối câu nhập
        s = s.replace(/[\.\,\?\!]+$/, '');

        return s.trim();
    }

    /**
     * Bóc tách đơn vị có cấu trúc ở đuôi chuỗi số/phân số.
     *
     * @param {string} str - Chuỗi cần tách đơn vị
     * @returns {{ value: string, unit: string }} Kết quả gồm giá trị cốt lõi và đơn vị
     */
    function stripTrailingUnit(str) {
        const s = str.trim();
        for (let i = 0; i < UNIT_TOKENS.length; i++) {
            const u = UNIT_TOKENS[i];
            const escaped = u.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(?:^|\\s+|(?<=[0-9\\/]))${escaped}\\s*$`, 'i');
            if (regex.test(s)) {
                const stripped = s.replace(regex, '').trim();
                if (stripped.length > 0) {
                    return { value: stripped, unit: u.toLowerCase() };
                }
            }
        }
        return { value: s, unit: '' };
    }

    /**
     * Phân tích và trích xuất tập hợp các phần tử toán học từ chuỗi.
     *
     * @param {string} str - Chuỗi biểu diễn tập hợp (ví dụ: "A = {1; 2; 3}", "{1, 2, 3}", "1; 2; 3")
     * @returns {Set<string>|null} Tập các phần tử hoặc null nếu không phải dạng tập hợp
     */
    function parseSetElements(str) {
        let s = normalizeBase(str);
        // Loại bỏ tên tập hợp dạng "A = " hoặc "X = "
        s = s.replace(/^[a-zA-Z]\s*=\s*/, '').trim();

        // Kiểm tra nếu nằm trong ngoặc nhọn { ... }
        const setMatch = s.match(/^\{([\s\S]*)\}$/);
        if (setMatch) {
            const inner = setMatch[1].trim();
            if (!inner) return new Set();
            const parts = inner.split(/[,;\s]+/).map(x => x.trim()).filter(Boolean);
            return new Set(parts.map(x => x.toLowerCase()));
        }

        // Kiểm tra danh sách phần tử cách nhau bởi dấu chấm phẩy hoặc dấu phẩy
        if (s.includes(';') || /,\s*/.test(s)) {
            const parts = s.split(/[,;]+/).map(x => x.trim()).filter(Boolean);
            if (parts.length >= 2) {
                return new Set(parts.map(x => x.toLowerCase()));
            }
        }
        return null;
    }

    /**
     * Chuyển đổi an toàn chuỗi sang số thực.
     *
     * @param {string} str - Chuỗi số (hỗ trợ cả dấu phẩy thập phân kiểu Việt Nam "3,5")
     * @returns {number|null} Giá trị số thực hoặc null nếu không phải số hợp lệ
     */
    function parseNumeric(str) {
        if (!str) return null;
        let s = str.trim().replace(/,/g, '.');
        if (s.startsWith('+')) s = s.slice(1);
        if (/^-?\d+(?:\.\d+)?$/.test(s)) {
            const num = Number(s);
            if (!isNaN(num) && isFinite(num)) {
                return num;
            }
        }
        return null;
    }

    /**
     * Chuẩn hóa chuỗi câu trả lời để phục vụ việc so sánh chính xác và linh hoạt.
     *
     * @param {any} ans - Chuỗi câu trả lời của học sinh hoặc đáp án chuẩn
     * @returns {string} Chuỗi đã được làm sạch và chuẩn hóa
     */
    function cleanAnswer(ans) {
        if (typeof ans !== 'string') return '';
        let s = normalizeBase(ans);
        if (!s) return '';

        // Thay thế dấu phẩy phân cách phần tử tập hợp thành dấu chấm phẩy
        s = s.replace(/,\s+/g, ';');
        s = s.replace(/([a-zA-Z=])\s*,\s*/g, '$1;');
        s = s.replace(/\s*,\s*([a-zA-Z=])/g, ';$1');

        // Bóc tách đơn vị nếu nằm ở đuôi sau số/phân số
        const unitParsed = stripTrailingUnit(s);
        const val = unitParsed.value;

        // Viết thường và xóa khoảng trắng nội bộ để so sánh canonical
        return val.replace(/\s+/g, '').toLowerCase();
    }

    /**
     * So sánh và đánh giá câu trả lời ngắn của học sinh với đáp án chuẩn theo mô hình ngữ nghĩa chuẩn xác.
     *
     * @param {any} userInput - Câu trả lời do học sinh nhập
     * @param {any} correctText - Đáp án chuẩn của câu hỏi
     * @returns {boolean} true nếu đúng, false nếu sai hoặc không có đáp án đúng
     */
    function evaluateShortAnswer(userInput, correctText) {
        if (typeof userInput !== 'string' || typeof correctText !== 'string') return false;
        const rawUser = userInput.trim();
        const rawCorrect = correctText.trim();
        if (!rawCorrect || !rawUser) return false;

        // 1. So sánh chuẩn hóa trực tiếp
        const cleanUser = cleanAnswer(rawUser);
        const cleanCorrect = cleanAnswer(rawCorrect);
        if (!cleanCorrect) return false;
        if (cleanUser === cleanCorrect) return true;

        // 2. Đánh giá tập hợp toán học (Set Equivalence)
        const userSet = parseSetElements(rawUser);
        const correctSet = parseSetElements(rawCorrect);
        if (correctSet && correctSet.size > 0 && userSet && userSet.size > 0) {
            if (userSet.size === correctSet.size) {
                let allMatch = true;
                for (const elem of userSet) {
                    if (!correctSet.has(elem)) {
                        allMatch = false;
                        break;
                    }
                }
                if (allMatch) return true;
            }
        }

        // 3. Đánh giá số học (Numeric Equivalence: "020" == "20", "20,5" == "20.5", "20 cm" == "20")
        const normUserBase = normalizeBase(rawUser);
        const normCorrectBase = normalizeBase(rawCorrect);

        const userStripped = stripTrailingUnit(normUserBase).value;
        const correctStripped = stripTrailingUnit(normCorrectBase).value;

        const userNum = parseNumeric(userStripped.replace(/^[a-zA-Z]\s*=\s*/, ''));
        const correctNum = parseNumeric(correctStripped.replace(/^[a-zA-Z]\s*=\s*/, ''));

        if (userNum !== null && correctNum !== null) {
            if (userNum === correctNum) {
                return true;
            }
        }

        // 4. So sánh cụm từ văn bản tiếng Việt (Vietnamese Text Matching)
        const userTextClean = normUserBase.replace(/\s+/g, '').toLowerCase();
        const correctTextClean = normCorrectBase.replace(/\s+/g, '').toLowerCase();
        if (userTextClean && userTextClean === correctTextClean) {
            return true;
        }

        // 5. So sánh phương trình gán biến (ví dụ: "x = 5" và "5")
        const userWithoutVar = normUserBase.replace(/^[a-zA-Z]\s*=\s*/, '').trim();
        const correctWithoutVar = normCorrectBase.replace(/^[a-zA-Z]\s*=\s*/, '').trim();
        if (userWithoutVar && correctWithoutVar) {
            const cleanU = cleanAnswer(userWithoutVar);
            const cleanC = cleanAnswer(correctWithoutVar);
            if (cleanU && cleanU === cleanC) {
                return true;
            }
        }

        return false;
    }

    return {
        cleanAnswer: cleanAnswer,
        evaluateShortAnswer: evaluateShortAnswer,
        cleanAnswerForComparison: cleanAnswer,
        checkShortAnswer: evaluateShortAnswer
    };
});
