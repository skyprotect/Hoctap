/**
 * string-utils — Bộ tiện ích xử lý và chuẩn hóa chuỗi ký tự, token đáp án.
 * 
 * Public Contract:
 * - normalizeAnswerToken(str: string | any): string
 * - escapeJsString(str: string | any): string
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.StringUtils = api;
    root.normalizeAnswerToken = api.normalizeAnswerToken;
    root.escapeJsString = api.escapeJsString;
    if (typeof window !== 'undefined') {
        window.StringUtils = api;
        window.normalizeAnswerToken = api.normalizeAnswerToken;
        window.escapeJsString = api.escapeJsString;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.StringUtils = api;
        globalThis.normalizeAnswerToken = api.normalizeAnswerToken;
        globalThis.escapeJsString = api.escapeJsString;
    }
    if (typeof self !== 'undefined') {
        self.StringUtils = api;
        self.normalizeAnswerToken = api.normalizeAnswerToken;
        self.escapeJsString = api.escapeJsString;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    /**
     * Escape các ký tự đặc biệt trong chuỗi để chèn an toàn vào inline JavaScript / HTML attributes
     * @param {string|any} str - Chuỗi cần escape
     * @returns {string} - Chuỗi đã được escape an toàn
     */
    function escapeJsString(str) {
        if (!str) return "";
        return String(str)
            .replace(/\\/g, "\\\\")
            .replace(/'/g, "\\'")
            .replace(/"/g, "&quot;")
            .replace(/\r?\n/g, " ");
    }

    /**
     * Chuẩn hóa token đáp án trắc nghiệm và câu trả lời Tiếng Anh/Toán (bóc tách tiền tố A-D, thẻ HTML, ký tự đặc biệt, Unicode apostrophe/quotes, NBSP, chữ thường)
     * @param {string|any} str - Chuỗi đáp án thô
     * @returns {string} - Chuỗi token đã được chuẩn hóa để so khớp
     */
    function normalizeAnswerToken(str) {
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

    normalizeAnswerToken.normalizeAnswerToken = normalizeAnswerToken;
    normalizeAnswerToken.escapeJsString = escapeJsString;

    const StringUtils = {
        normalizeAnswerToken: normalizeAnswerToken,
        escapeJsString: escapeJsString
    };

    return StringUtils;
});
