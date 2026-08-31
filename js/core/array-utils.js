/**
 * array-utils — Bộ tiện ích mảng và xử lý ngẫu nhiên thuần túy (Pure Array & Random Utilities).
 * Cung cấp thuật toán sinh số ngẫu nhiên, tráo mảng Fisher-Yates và trích xuất phần tử.
 * 
 * Public Contract:
 * - randomInt(min: number, max: number, excludeZero?: boolean): number
 * - shuffle<T>(array: T[]): T[] (Tráo đổi Fisher-Yates tại chỗ và trả về mảng)
 * - shuffleArray<T>(array: T[]): T[] (Bí danh tương thích ngược của shuffle)
 * - sample<T>(array: T[]): T | undefined (Lấy ngẫu nhiên 1 phần tử)
 * - sampleSize<T>(array: T[], count: number): T[] (Lấy ngẫu nhiên k phần tử không trùng lặp)
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.ArrayUtils = api;
    root.RandomUtils = api;
    if (typeof window !== 'undefined') {
        window.ArrayUtils = api;
        window.RandomUtils = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.ArrayUtils = api;
        globalThis.RandomUtils = api;
    }
    if (typeof self !== 'undefined') {
        self.ArrayUtils = api;
        self.RandomUtils = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    /**
     * Sinh số nguyên ngẫu nhiên trong đoạn [min, max].
     * @param {number} min - Cận dưới (bao gồm)
     * @param {number} max - Cận trên (bao gồm)
     * @param {boolean} [excludeZero=false] - Loại trừ số 0 nếu true
     * @returns {number}
     */
    function randomInt(min, max, excludeZero) {
        const floorMin = Math.ceil(min);
        const floorMax = Math.floor(max);
        if (floorMin > floorMax) {
            return floorMin;
        }
        let val = Math.floor(Math.random() * (floorMax - floorMin + 1)) + floorMin;
        if (excludeZero && val === 0) {
            if (floorMin === 0 && floorMax === 0) return 1;
            return randomInt(min, max, excludeZero);
        }
        return val;
    }

    /**
     * Tráo đổi ngẫu nhiên các phần tử trong mảng bằng thuật toán Fisher-Yates (Knuth Shuffle).
     * Tráo đổi tại chỗ (in-place) và trả về chính mảng đó để hỗ trợ nối chuỗi.
     * @template T
     * @param {T[]} array - Mảng đầu vào
     * @returns {T[]} Mảng đã được tráo ngẫu nhiên
     */
    function shuffle(array) {
        if (!Array.isArray(array)) return [];
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    /**
     * Lấy ngẫu nhiên 1 phần tử từ mảng (không đột biến mảng).
     * @template T
     * @param {T[]} array
     * @returns {T|undefined}
     */
    function sample(array) {
        if (!Array.isArray(array) || array.length === 0) return undefined;
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Lấy ngẫu nhiên k phần tử không trùng vị trí từ mảng (không đột biến mảng gốc).
     * @template T
     * @param {T[]} array
     * @param {number} count
     * @returns {T[]}
     */
    function sampleSize(array, count) {
        if (!Array.isArray(array) || array.length === 0 || count <= 0) return [];
        const k = Math.min(Math.floor(count), array.length);
        const copy = array.slice();
        shuffle(copy);
        return copy.slice(0, k);
    }

    const ArrayUtils = {
        randomInt: randomInt,
        shuffle: shuffle,
        shuffleArray: shuffle,
        sample: sample,
        sampleSize: sampleSize
    };

    return ArrayUtils;
});
