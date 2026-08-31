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

    /**
     * Chuẩn hóa chuỗi câu trả lời để phục vụ việc so sánh chính xác và linh hoạt.
     * 
     * @param {any} ans - Chuỗi câu trả lời của học sinh hoặc đáp án chuẩn
     * @returns {string} Chuỗi đã được làm sạch và chuẩn hóa
     */
    function cleanAnswer(ans) {
        if (typeof ans !== 'string') return '';
        // Loại bỏ thứ tự phương án ở đầu (A. B. C. D. hoặc A) B) C) D))
        let s = ans.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim();
        // Loại bỏ ký tự đặc biệt LaTeX $
        s = s.replace(/\$/g, '').trim();
        // Thay thế dấu phẩy phân cách thành dấu chấm phẩy để đồng bộ (tránh số thập phân dạng d,d)
        s = s.replace(/,\s+/g, ';');
        s = s.replace(/([a-zA-Z=])\s*,\s*/g, '$1;');
        s = s.replace(/\s*,\s*([a-zA-Z=])/g, ';$1');
        // Loại bỏ các chữ cái đơn vị phổ biến trong tiếng Việt của lớp 6
        s = s.replace(/(chiếc kẹo|kẹo|hộp sữa|sữa|hộp|quả|bông hoa|hoa|quyển sách|sách|vở|bút|học sinh|bạn|khối rubik|khối|rubik|phần tử|ước|bội|dm|cm|m|kg|g|giờ|phút|giây|lít|l|độ c|độ|c)/g, '').trim();
        // Loại bỏ khoảng trắng và viết thường
        s = s.replace(/\s+/g, '').toLowerCase();
        return s;
    }

    /**
     * So sánh và đánh giá câu trả lời ngắn của học sinh với đáp án chuẩn.
     * 
     * @param {any} userInput - Câu trả lời do học sinh nhập
     * @param {any} correctText - Đáp án chuẩn của câu hỏi
     * @returns {boolean} true nếu đúng, false nếu sai hoặc không có đáp án đúng
     */
    function evaluateShortAnswer(userInput, correctText) {
        const cleanUser = cleanAnswer(userInput);
        const cleanCorrect = cleanAnswer(correctText);
        if (!cleanCorrect) return false;
        
        // So sánh bằng nhau tuyệt đối sau khi làm sạch
        if (cleanUser === cleanCorrect) return true;
        
        // Kiểm tra thông cảm sai lệch nhỏ nếu là dạng tập hợp, ví dụ người dùng gõ chỉ các phần tử {1; 2; 3} thay vì A={1; 2; 3}
        if (cleanCorrect.includes(cleanUser) && cleanUser.length >= Math.floor(cleanCorrect.length * 0.4)) return true;
        if (cleanUser.includes(cleanCorrect) && cleanCorrect.length >= Math.floor(cleanUser.length * 0.4)) return true;
        
        return false;
    }

    return {
        cleanAnswer: cleanAnswer,
        evaluateShortAnswer: evaluateShortAnswer,
        cleanAnswerForComparison: cleanAnswer,
        checkShortAnswer: evaluateShortAnswer
    };
});
