const ArrayUtils = require('../../js/core/array-utils');

describe("Core Array & Random Utilities Module (js/core/array-utils.js)", () => {

    test("ArrayUtils / RandomUtils được định nghĩa với đầy đủ 5 hàm public contract", () => {
        expect(ArrayUtils).toBeDefined();
        expect(typeof ArrayUtils.randomInt).toBe('function');
        expect(typeof ArrayUtils.shuffle).toBe('function');
        expect(typeof ArrayUtils.shuffleArray).toBe('function');
        expect(typeof ArrayUtils.sample).toBe('function');
        expect(typeof ArrayUtils.sampleSize).toBe('function');
    });

    describe("1. randomInt", () => {
        test("Sinh số nguyên trong khoảng [min, max]", () => {
            for (let i = 0; i < 100; i++) {
                const val = ArrayUtils.randomInt(1, 10);
                expect(Number.isInteger(val)).toBe(true);
                expect(val).toBeGreaterThanOrEqual(1);
                expect(val).toBeLessThanOrEqual(10);
            }
        });

        test("Sinh số nguyên với số âm", () => {
            for (let i = 0; i < 50; i++) {
                const val = ArrayUtils.randomInt(-10, -5);
                expect(Number.isInteger(val)).toBe(true);
                expect(val).toBeGreaterThanOrEqual(-10);
                expect(val).toBeLessThanOrEqual(-5);
            }
        });

        test("Khi min === max, trả về đúng giá trị đó", () => {
            expect(ArrayUtils.randomInt(5, 5)).toBe(5);
            expect(ArrayUtils.randomInt(-3, -3)).toBe(-3);
            expect(ArrayUtils.randomInt(0, 0)).toBe(0);
        });

        test("Khi excludeZero = true, không bao giờ trả về số 0", () => {
            for (let i = 0; i < 100; i++) {
                const val = ArrayUtils.randomInt(-5, 5, true);
                expect(val).not.toBe(0);
                expect(val).toBeGreaterThanOrEqual(-5);
                expect(val).toBeLessThanOrEqual(5);
            }
        });

        test("Khi min > max, tự động trả về min", () => {
            expect(ArrayUtils.randomInt(10, 5)).toBe(10);
        });
    });

    describe("2. shuffle & shuffleArray", () => {
        test("Tráo đổi mảng in-place và trả về chính mảng đó", () => {
            const original = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const originalCopy = [...original];
            const result = ArrayUtils.shuffle(original);

            // Trả về cùng tham chiếu
            expect(result).toBe(original);
            // Có cùng độ dài và tập phần tử
            expect(original.length).toBe(10);
            expect(original.slice().sort((a, b) => a - b)).toEqual(originalCopy);
        });

        test("shuffleArray là bí danh tương thích 100% của shuffle", () => {
            const arr = ["A", "B", "C", "D"];
            const res = ArrayUtils.shuffleArray(arr);
            expect(res).toBe(arr);
            expect(res.length).toBe(4);
        });

        test("Xử lý an toàn với mảng rỗng hoặc đầu vào không phải mảng", () => {
            expect(ArrayUtils.shuffle([])).toEqual([]);
            expect(ArrayUtils.shuffle(null)).toEqual([]);
            expect(ArrayUtils.shuffle(undefined)).toEqual([]);
            expect(ArrayUtils.shuffle("string")).toEqual([]);
        });
    });

    describe("3. sample", () => {
        test("Lấy ngẫu nhiên 1 phần tử nằm trong mảng", () => {
            const items = ["apple", "banana", "cherry", "dragonfruit"];
            for (let i = 0; i < 20; i++) {
                const picked = ArrayUtils.sample(items);
                expect(items.includes(picked)).toBe(true);
            }
        });

        test("Trả về undefined cho mảng rỗng hoặc đầu vào không hợp lệ", () => {
            expect(ArrayUtils.sample([])).toBeUndefined();
            expect(ArrayUtils.sample(null)).toBeUndefined();
            expect(ArrayUtils.sample(undefined)).toBeUndefined();
        });
    });

    describe("4. sampleSize", () => {
        test("Lấy đúng số lượng k phần tử không trùng lặp và không làm đổi mảng gốc", () => {
            const list = [10, 20, 30, 40, 50, 60, 70, 80];
            const listCopy = [...list];
            const sampled = ArrayUtils.sampleSize(list, 3);
            expect(sampled.length).toBe(3);
            // Mảng gốc không bị thay đổi
            expect(list).toEqual(listCopy);
            // Đảm bảo không trùng lặp phần tử
            const unique = new Set(sampled);
            expect(unique.size).toBe(3);
            sampled.forEach(item => expect(list.includes(item)).toBe(true));
        });

        test("Khi count >= length, trả về toàn bộ các phần tử được tráo", () => {
            const list = [1, 2, 3];
            const sampled = ArrayUtils.sampleSize(list, 10);
            expect(sampled.length).toBe(3);
            expect(sampled.slice().sort()).toEqual([1, 2, 3]);
        });

        test("Khi count <= 0 hoặc mảng rỗng, trả về mảng rỗng []", () => {
            expect(ArrayUtils.sampleSize([1, 2, 3], 0)).toEqual([]);
            expect(ArrayUtils.sampleSize([1, 2, 3], -2)).toEqual([]);
            expect(ArrayUtils.sampleSize([], 5)).toEqual([]);
            expect(ArrayUtils.sampleSize(null, 3)).toEqual([]);
        });
    });
});
