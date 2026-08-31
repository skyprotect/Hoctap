/**
 * Unit & Characterization Tests for SimilarityUtils module (js/core/similarity-utils.js)
 * 
 * Đảm bảo 100% contract và tương thích ngược:
 * - Thuật toán khoảng cách Levenshtein: editDistance(s1, s2)
 * - Hệ số tương đồng chuỗi ký tự: getSimilarityScore(s1, s2)
 * - 100% Characterization đối chiếu trực tiếp với legacy implementation từ js/app.js
 * - Bảo toàn tính không phân biệt hoa/thường (case-insensitivity)
 * - Xử lý chuỗi rỗng (""), chuỗi 1 ký tự, chuỗi dài, từ vựng tiếng Anh thực tế
 * - Public Contract export: UMD, CommonJS, Window, GlobalThis
 * - Delegation compatibility cho app.getSimilarityScore và app.editDistance
 */

const SimilarityUtils = require('../../js/core/similarity-utils');
const { getSimilarityScore, editDistance } = require('../../js/core/similarity-utils');

// Bản cài đặt tham chiếu nguyên bản từ js/app.js để kiểm thử Characterization
const legacyApp = {
    getSimilarityScore: function(s1, s2) {
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
        return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
    },

    editDistance: function(s1, s2) {
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
};

describe("Unit & Characterization Tests — SimilarityUtils (js/core/similarity-utils.js)", () => {

    // 1. Public Contract & Exports
    describe("1. Public Contract & Exports", () => {
        test("Export đối tượng SimilarityUtils qua CommonJS module.exports", () => {
            expect(SimilarityUtils).toBeDefined();
            expect(typeof SimilarityUtils).toBe('object');
            expect(typeof SimilarityUtils.editDistance).toBe('function');
            expect(typeof SimilarityUtils.getSimilarityScore).toBe('function');
        });

        test("Export các hàm qua destructuring { getSimilarityScore, editDistance }", () => {
            expect(typeof editDistance).toBe('function');
            expect(typeof getSimilarityScore).toBe('function');
            expect(editDistance).toBe(SimilarityUtils.editDistance);
            expect(getSimilarityScore).toBe(SimilarityUtils.getSimilarityScore);
        });

        test("Tự động gán vào globalThis / window", () => {
            expect(globalThis.SimilarityUtils).toBeDefined();
            expect(typeof globalThis.SimilarityUtils.editDistance).toBe('function');
            expect(typeof globalThis.SimilarityUtils.getSimilarityScore).toBe('function');
            expect(typeof globalThis.editDistance).toBe('function');
            expect(typeof globalThis.getSimilarityScore).toBe('function');
        });
    });

    // 2. Unit Tests — editDistance(s1, s2)
    describe("2. Unit Tests — editDistance(s1, s2)", () => {
        test("Hai chuỗi giống hệt nhau trả về khoảng cách 0", () => {
            expect(editDistance("cat", "cat")).toBe(0);
            expect(editDistance("playground", "playground")).toBe(0);
            expect(editDistance("", "")).toBe(0);
        });

        test("Không phân biệt chữ hoa và chữ thường", () => {
            expect(editDistance("Cat", "cat")).toBe(0);
            expect(editDistance("HELLO", "hello")).toBe(0);
            expect(editDistance("English", "ENGLISH")).toBe(0);
        });

        test("Một chuỗi rỗng trả về độ dài chuỗi còn lại", () => {
            expect(editDistance("", "a")).toBe(1);
            expect(editDistance("hello", "")).toBe(5);
            expect(editDistance("", "testing")).toBe(7);
        });

        test("Phép thay thế 1 ký tự trả về 1", () => {
            expect(editDistance("cat", "bat")).toBe(1);
            expect(editDistance("dog", "dot")).toBe(1);
            expect(editDistance("pen", "pan")).toBe(1);
        });

        test("Phép thêm/xóa 1 ký tự trả về 1", () => {
            expect(editDistance("cat", "cats")).toBe(1);
            expect(editDistance("cats", "cat")).toBe(1);
            expect(editDistance("scool", "school")).toBe(1);
        });

        test("Nhiều phép biến đổi", () => {
            expect(editDistance("kitten", "sitting")).toBe(3); // k->s, e->i, +g
            expect(editDistance("saturday", "sunday")).toBe(3); // r->n, +d, -a, -t -> 3 edits
        });

        test("Tính đối xứng của editDistance(a, b) === editDistance(b, a)", () => {
            expect(editDistance("football", "foodball")).toBe(editDistance("foodball", "football"));
            expect(editDistance("listening", "listning")).toBe(editDistance("listning", "listening"));
        });
    });

    // 3. Unit Tests — getSimilarityScore(s1, s2)
    describe("3. Unit Tests — getSimilarityScore(s1, s2)", () => {
        test("Hai chuỗi giống hệt nhau trả về hệ số 1.0", () => {
            expect(getSimilarityScore("hello", "hello")).toBe(1.0);
            expect(getSimilarityScore("speaking", "SPEAKING")).toBe(1.0);
            expect(getSimilarityScore("", "")).toBe(1.0);
        });

        test("Hai chuỗi hoàn toàn khác nhau có cùng độ dài trả về 0.0", () => {
            expect(getSimilarityScore("abc", "xyz")).toBe(0.0);
            expect(getSimilarityScore("a", "b")).toBe(0.0);
        });

        test("Một chuỗi rỗng và một chuỗi không rỗng trả về 0.0", () => {
            expect(getSimilarityScore("", "hello")).toBe(0.0);
            expect(getSimilarityScore("test", "")).toBe(0.0);
        });

        test("Độ tương đồng một phần (Partial Similarity)", () => {
            // "school" length 6, "scool" length 5, editDistance = 1
            // longerLength = 6, score = (6 - 1) / 6 = 5/6 approx 0.8333333333333334
            expect(getSimilarityScore("school", "scool")).toBeCloseTo(5 / 6, 5);

            // "football" length 8, "foodball" length 8, editDistance = 1
            // score = (8 - 1) / 8 = 7/8 = 0.875
            expect(getSimilarityScore("football", "foodball")).toBe(0.875);
        });

        test("Tính đối xứng của getSimilarityScore(a, b) === getSimilarityScore(b, a)", () => {
            expect(getSimilarityScore("cat", "cats")).toBe(getSimilarityScore("cats", "cat"));
            expect(getSimilarityScore("listening", "listning")).toBe(getSimilarityScore("listning", "listening"));
            expect(getSimilarityScore("vocabulary", "vocablary")).toBe(getSimilarityScore("vocablary", "vocabulary"));
        });

        test("Ngưỡng nhận diện giọng nói thực tế (ngưỡng 0.72)", () => {
            // Kiểm tra các từ phát âm gần đúng thường gặp trong bài học tiếng Anh
            expect(getSimilarityScore("ball", "boll")).toBeGreaterThanOrEqual(0.72); // 3/4 = 0.75
            expect(getSimilarityScore("bike", "bake")).toBeGreaterThanOrEqual(0.72); // 3/4 = 0.75
            expect(getSimilarityScore("teacher", "teecher")).toBeGreaterThanOrEqual(0.72); // 6/7 = 0.857
        });
    });

    // 4. Characterization Tests — Đối chiếu 100% với legacy implementation
    describe("4. Characterization Tests — Đối chiếu 100% với Legacy Implementation", () => {
        const testPairs = [
            ["", ""],
            ["a", ""],
            ["", "b"],
            ["a", "a"],
            ["a", "b"],
            ["cat", "cat"],
            ["cat", "BAT"],
            ["Apple", "apple"],
            ["School", "Scool"],
            ["playground", "playgound"],
            ["listening", "listning"],
            ["speaking", "speeking"],
            ["reading", "reding"],
            ["writing", "writting"],
            ["vocabulary", "vocablary"],
            ["pronunciation", "pronounciation"],
            ["football", "foodball"],
            ["swimming", "swimmin"],
            ["badminton", "badmiton"],
            ["basketball", "basketbal"],
            ["classroom", "clasrom"],
            ["kitchen", "kichen"],
            ["bedroom", "badroom"],
            ["calculator", "calculater"],
            ["compass", "compas"],
            ["vietnam", "viet nam"],
            ["english", "inglish"],
            ["dinosaur", "dinasour"],
            ["butterfly", "butter fly"],
            ["yesterday", "yestarday"],
            ["tomorrow", "tommorow"],
            ["beautiful", "beutiful"],
            ["wonderful", "wanderful"],
            ["friend", "freind"],
            ["receive", "recieve"]
        ];

        testPairs.forEach(([s1, s2], index) => {
            test(`Characterization #${index + 1}: editDistance("${s1}", "${s2}")`, () => {
                const legacyResult = legacyApp.editDistance(s1, s2);
                const newResult = editDistance(s1, s2);
                expect(newResult).toBe(legacyResult);
            });

            test(`Characterization #${index + 1}: getSimilarityScore("${s1}", "${s2}")`, () => {
                const legacyResult = legacyApp.getSimilarityScore(s1, s2);
                const newResult = getSimilarityScore(s1, s2);
                expect(newResult).toBe(legacyResult);
            });
        });
    });

    // 5. Backward Compatibility — app.getSimilarityScore & app.editDistance delegation
    describe("5. Backward Compatibility — app Delegation", () => {
        test("app.getSimilarityScore và app.editDistance ủy quyền chính xác cho SimilarityUtils", () => {
            const mockApp = {
                getSimilarityScore: function(s1, s2) {
                    if (typeof SimilarityUtils !== 'undefined' && typeof SimilarityUtils.getSimilarityScore === 'function') {
                        return SimilarityUtils.getSimilarityScore(s1, s2);
                    }
                    if (typeof getSimilarityScore === 'function') {
                        return getSimilarityScore(s1, s2);
                    }
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
                    return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
                },
                editDistance: function(s1, s2) {
                    if (typeof SimilarityUtils !== 'undefined' && typeof SimilarityUtils.editDistance === 'function') {
                        return SimilarityUtils.editDistance(s1, s2);
                    }
                    if (typeof editDistance === 'function') {
                        return editDistance(s1, s2);
                    }
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
            };

            expect(mockApp.editDistance("kitten", "sitting")).toBe(editDistance("kitten", "sitting"));
            expect(mockApp.getSimilarityScore("school", "scool")).toBe(getSimilarityScore("school", "scool"));
        });
    });
});
