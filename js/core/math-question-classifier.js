/**
 * math-question-classifier — Bộ phân loại câu hỏi môn Toán thuần túy (Pure Math Question Classifier).
 * Tách biệt hoàn toàn khỏi logic điều khiển giao diện DOM, state mutation, audio, persistence và window.app.
 * Hỗ trợ UMD (Node.js CommonJS, Web Workers, Browser Global).
 * 
 * Public Contract:
 * - shouldForceMCQ(questionText: any, correctOption: any): boolean
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.MathQuestionClassifier = api;
    if (typeof window !== 'undefined') {
        window.MathQuestionClassifier = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.MathQuestionClassifier = api;
    }
    if (typeof self !== 'undefined') {
        self.MathQuestionClassifier = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    /**
     * Xác định xem một câu hỏi có bắt buộc phải hiển thị dưới dạng trắc nghiệm (MCQ) hay không,
     * hay có thể chuyển thành dạng điền số/câu trả lời ngắn (Short Answer).
     * 
     * @param {any} questionText - Nội dung đề bài câu hỏi
     * @param {any} correctOption - Nội dung phương án đúng
     * @returns {boolean} true nếu bắt buộc là trắc nghiệm, false nếu đủ điều kiện làm câu điền đáp án ngắn
     */
    function shouldForceMCQ(questionText, correctOption) {
        if (typeof questionText !== 'string' || typeof correctOption !== 'string') return false;
        
        const textLower = questionText.toLowerCase();
        const mcqKeywords = [
            "dưới đây", "sau đây", "khẳng định nào", "phát biểu nào", 
            "cách viết nào", "nhận xét nào", "đáp án nào", "công thức nào",
            "hình nào", "trong các phát biểu", "khẳng định nào đúng", 
            "khẳng định nào sai", "phát biểu nào đúng", "phát biểu nào sai",
            "phương án nào", "lựa chọn nào"
        ];
        
        for (const kw of mcqKeywords) {
            if (textLower.includes(kw)) {
                return true;
            }
        }
        
        // Kiểm tra đáp án đúng (correctOption)
        // Loại bỏ ký tự $
        let cleanOpt = correctOption.replace(/\$/g, '').trim();
        
        // Nếu đáp án có chứa LaTeX phức tạp như phân số, căn thức, song song, vuông góc, góc, tam giác
        const complexLatex = [
            "\\frac", "\\sqrt", "\\parallel", "\\perp", "\\angle", "\\triangle", 
            "\\cup", "\\cap", "\\subset", "\\in", "\\notin", "\\bar", "\\overline",
            "\\times", "\\cdot", "\\degree", "^"
        ];
        for (const latex of complexLatex) {
            if (correctOption.includes(latex)) {
                return true;
            }
        }
        
        // Nếu là tập hợp phức tạp (có dấu ngoặc nhọn)
        if (correctOption.includes('{') || correctOption.includes('}')) {
            return true;
        }
        
        // Nếu đáp án chứa văn bản dài (ví dụ có chứa các từ tiếng Việt dài, không chỉ là số và đơn vị)
        // Loại bỏ các chữ số, dấu phép tính (+ - * / = < >)
        let textOnly = cleanOpt.replace(/[0-9\+\-\*\/\=\<\>\(\)\;\,\.\%]/g, '').trim();
        // Loại bỏ các đơn vị thông dụng
        const units = [
            "chiếc kẹo", "kẹo", "hộp sữa", "sữa", "hộp", "quả", "bông hoa", "hoa", 
            "quyển sách", "sách", "vở", "bút", "học sinh", "bạn", "khối rubik", 
            "khối", "rubik", "phần tử", "ước", "bội", "dm", "cm", "m", "kg", "g", 
            "giờ", "phút", "giây", "lít", "l", "độ c", "độ", "c", "trang", "tuổi", 
            "con", "cái", "ngày", "tháng", "năm", "đồng", "đ", "lần"
        ];
        for (const unit of units) {
            textOnly = textOnly.replace(new RegExp('\\b' + unit + '\\b', 'gi'), '').trim();
        }
        
        // Nếu sau khi loại bỏ số và đơn vị, phần chữ còn lại vẫn dài (ví dụ > 5 ký tự) hoặc chứa khoảng trắng (nhiều từ)
        if (textOnly.replace(/\s+/g, '').length > 5) {
            return true;
        }
        
        return false;
    }

    return {
        shouldForceMCQ: shouldForceMCQ
    };
});
