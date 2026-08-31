/**
 * similarity-utils — Bộ tiện ích tính khoảng cách Levenshtein và độ tương đồng chuỗi ký tự.
 * Độc lập hoàn toàn, hỗ trợ UMD (Node.js CommonJS, Web Workers, Browser Global).
 * 
 * Public Contract:
 * - getSimilarityScore(s1: string, s2: string): number (0.0 -> 1.0)
 * - editDistance(s1: string, s2: string): number (>= 0)
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.SimilarityUtils = api;
    root.getSimilarityScore = api.getSimilarityScore;
    root.editDistance = api.editDistance;
    if (typeof window !== 'undefined') {
        window.SimilarityUtils = api;
        window.getSimilarityScore = api.getSimilarityScore;
        window.editDistance = api.editDistance;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.SimilarityUtils = api;
        globalThis.getSimilarityScore = api.getSimilarityScore;
        globalThis.editDistance = api.editDistance;
    }
    if (typeof self !== 'undefined') {
        self.SimilarityUtils = api;
        self.getSimilarityScore = api.getSimilarityScore;
        self.editDistance = api.editDistance;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    /**
     * Tính khoảng cách chỉnh sửa Levenshtein tối thiểu giữa hai chuỗi ký tự
     * @param {string} s1 - Chuỗi thứ nhất
     * @param {string} s2 - Chuỗi thứ hai
     * @returns {number} - Số thao tác chỉnh sửa tối thiểu
     */
    function editDistance(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        const costs = new Array();
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i == 0)
                    costs[j] = j;
                else {
                    if (j > 0) {
                        let newValue = costs[j - 1];
                        if (s1.charAt(i - 1) != s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0)
                costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    }

    /**
     * Tính tỷ lệ tương đồng chuẩn hóa giữa hai chuỗi ký tự (khoảng giá trị 0.0 -> 1.0)
     * @param {string} s1 - Chuỗi thứ nhất
     * @param {string} s2 - Chuỗi thứ hai
     * @returns {number} - Tỷ lệ tương đồng
     */
    function getSimilarityScore(s1, s2) {
        let longer = s1;
        let shorter = s2;
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        const longerLength = longer.length;
        if (longerLength === 0) {
            return 1.0;
        }
        return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
    }

    getSimilarityScore.getSimilarityScore = getSimilarityScore;
    getSimilarityScore.editDistance = editDistance;

    const SimilarityUtils = {
        getSimilarityScore: getSimilarityScore,
        editDistance: editDistance
    };

    return SimilarityUtils;
});
