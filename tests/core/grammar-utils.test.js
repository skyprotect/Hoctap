/**
 * Unit & Characterization Tests for GrammarUtils module (js/core/grammar-utils.js)
 * 
 * Đảm bảo 100% contract và tương thích ngược:
 * - Ánh xạ chính xác toàn bộ 60 Unit IDs (Lớp 1: 20 units, Lớp 4: 24 units, Lớp 6: 16 units)
 * - Trả về fallback mặc định "present_simple_verbs" cho mọi trường hợp unit không hợp lệ
 * - Xử lý an toàn chuỗi rỗng, null, undefined, non-string input
 * - 100% Characterization đối chiếu với legacy implementation trong js/english_data.js
 */

const GrammarUtils = require('../../js/core/grammar-utils');
const { getGrammarTopicByUnitId, GRAMMAR_UNIT_TOPIC_MAP, DEFAULT_GRAMMAR_TOPIC } = require('../../js/core/grammar-utils');

// Bản mapping tham chiếu nguyên bản từ js/english_data.js để đối chiếu Characterization
const LEGACY_MAP = {
    // Lớp 1 (eng1-...)
    "eng1-t1": "to_be",
    "eng1-t2": "articles",
    "eng1-t3": "to_be",
    "eng1-t4": "plural_nouns",
    "eng1-t5": "possessive",
    "eng1-t6": "to_be",
    "eng1-t7": "to_be",
    "eng1-t8": "modal_can",
    "eng1-t9": "like_ving",
    "eng1-t10": "modal_can",
    "eng1-t11": "present_continuous",
    "eng1-t12": "prepositions_place",
    "eng1-t13": "prepositions_place",
    "eng1-t14": "present_continuous",
    "eng1-t15": "like_ving",
    "eng1-t16": "plural_nouns",
    "eng1-t17": "to_be",
    "eng1-t18": "to_be",
    "eng1-t19": "like_ving",
    "eng1-t20": "modal_can",

    // Lớp 4 (eng4-...)
    "eng4-t1": "to_be",
    "eng4-t2": "present_simple_verbs",
    "eng4-t3": "like_ving",
    "eng4-t4": "adverbs_frequency",
    "eng4-t5": "present_simple_verbs",
    "eng4-t6": "present_simple_verbs",
    "eng4-t7": "present_continuous",
    "eng4-t8": "present_simple_verbs",
    "eng4-t9": "like_ving",
    "eng4-t10": "prepositions_time",
    "eng4-t11": "prepositions_time",
    "eng4-t12": "prepositions_time",
    "eng4-t13": "should_shouldn't",
    "eng4-t14": "past_simple",
    "eng4-t15": "comparatives",
    "eng4-t16": "should_shouldn't",
    "eng4-t17": "past_simple",
    "eng4-t18": "past_simple",
    "eng4-t19": "past_simple",
    "eng4-t20": "future_plans",
    "eng4-t21": "past_simple",
    "eng4-t22": "prepositions_place",
    "eng4-t23": "past_simple",
    "eng4-t24": "future_plans",

    // Lớp 6 (eng6-...)
    "eng6-t1": "present_simple_verbs",
    "eng6-t2": "prepositions_place",
    "eng6-t3": "present_simple_verbs",
    "eng6-t4": "comparatives",
    "eng6-t5": "must_mustn't",
    "eng6-t6": "present_simple_verbs",
    "eng6-t7": "present_simple_verbs",
    "eng6-t8": "present_simple_verbs",
    "eng6-t9": "present_simple_verbs",
    "eng6-t10": "plural_nouns",
    "eng6-t11": "present_simple_verbs",
    "eng6-t12": "future_plans",
    "eng6-t13": "like_ving",
    "eng6-t14": "future_plans",
    "eng6-t15": "prepositions_place",
    "eng6-t16": "first_conditional"
};

function legacyGetGrammarTopicByUnitId(unitId) {
    return LEGACY_MAP[unitId] || "present_simple_verbs";
}

describe("Unit & Characterization Tests — GrammarUtils (js/core/grammar-utils.js)", () => {

    // 1. Public Contract & Exports
    describe("1. Public Contract & Exports", () => {
        test("Export đúng cấu trúc qua CommonJS module.exports", () => {
            expect(GrammarUtils).toBeDefined();
            expect(typeof GrammarUtils.getGrammarTopicByUnitId).toBe('function');
            expect(typeof GrammarUtils.GRAMMAR_UNIT_TOPIC_MAP).toBe('object');
            expect(GrammarUtils.DEFAULT_GRAMMAR_TOPIC).toBe('present_simple_verbs');
        });

        test("Export các thuộc tính và hàm qua Destructuring", () => {
            expect(typeof getGrammarTopicByUnitId).toBe('function');
            expect(typeof GRAMMAR_UNIT_TOPIC_MAP).toBe('object');
            expect(DEFAULT_GRAMMAR_TOPIC).toBe('present_simple_verbs');
        });

        test("Tự động gán vào globalThis / window", () => {
            expect(globalThis.GrammarUtils).toBeDefined();
            expect(globalThis.getGrammarTopicByUnitId).toBeDefined();
            expect(globalThis.GRAMMAR_UNIT_TOPIC_MAP).toBeDefined();
            expect(globalThis.DEFAULT_GRAMMAR_TOPIC).toBe('present_simple_verbs');
            expect(typeof globalThis.getGrammarTopicByUnitId).toBe('function');
        });
    });

    // 2. Bảo toàn toàn bộ 60 mapping Units
    describe("2. Bảo toàn toàn bộ 60 mapping Units", () => {
        test("Số lượng mapping đúng 60 Units (20 Lớp 1 + 24 Lớp 4 + 16 Lớp 6)", () => {
            expect(Object.keys(GrammarUtils.GRAMMAR_UNIT_TOPIC_MAP).length).toBe(60);
        });

        test("Kiểm tra 20 Units Lớp 1 (eng1-t1 -> eng1-t20)", () => {
            for (let i = 1; i <= 20; i++) {
                const unitId = `eng1-t${i}`;
                expect(GrammarUtils.getGrammarTopicByUnitId(unitId)).toBe(LEGACY_MAP[unitId]);
            }
        });

        test("Kiểm tra 24 Units Lớp 4 (eng4-t1 -> eng4-t24)", () => {
            for (let i = 1; i <= 24; i++) {
                const unitId = `eng4-t${i}`;
                expect(GrammarUtils.getGrammarTopicByUnitId(unitId)).toBe(LEGACY_MAP[unitId]);
            }
        });

        test("Kiểm tra 16 Units Lớp 6 (eng6-t1 -> eng6-t16)", () => {
            for (let i = 1; i <= 16; i++) {
                const unitId = `eng6-t${i}`;
                expect(GrammarUtils.getGrammarTopicByUnitId(unitId)).toBe(LEGACY_MAP[unitId]);
            }
        });
    });

    // 3. Fallback & Edge Cases
    describe("3. Fallback & Edge Cases", () => {
        test("Unit ID không tồn tại trả về fallback 'present_simple_verbs'", () => {
            expect(GrammarUtils.getGrammarTopicByUnitId("eng1-t99")).toBe("present_simple_verbs");
            expect(GrammarUtils.getGrammarTopicByUnitId("eng7-t1")).toBe("present_simple_verbs");
            expect(GrammarUtils.getGrammarTopicByUnitId("random_string")).toBe("present_simple_verbs");
        });

        test("Chuỗi rỗng '' trả về fallback 'present_simple_verbs'", () => {
            expect(GrammarUtils.getGrammarTopicByUnitId("")).toBe("present_simple_verbs");
        });

        test("null và undefined trả về fallback 'present_simple_verbs' mà không ném ngoại lệ", () => {
            expect(GrammarUtils.getGrammarTopicByUnitId(null)).toBe("present_simple_verbs");
            expect(GrammarUtils.getGrammarTopicByUnitId(undefined)).toBe("present_simple_verbs");
            expect(GrammarUtils.getGrammarTopicByUnitId()).toBe("present_simple_verbs");
        });

        test("Non-string inputs trả về fallback 'present_simple_verbs' mà không ném ngoại lệ", () => {
            expect(GrammarUtils.getGrammarTopicByUnitId(123)).toBe("present_simple_verbs");
            expect(GrammarUtils.getGrammarTopicByUnitId(true)).toBe("present_simple_verbs");
            expect(GrammarUtils.getGrammarTopicByUnitId({})).toBe("present_simple_verbs");
            expect(GrammarUtils.getGrammarTopicByUnitId([])).toBe("present_simple_verbs");
        });
    });

    // 4. 100% Characterization Test đối chiếu trực tiếp với Legacy
    describe("4. 100% Characterization Test đối chiếu với Legacy Implementation", () => {
        test("Tất cả các Units và edge cases cho kết quả đồng nhất 100% giữa New và Legacy", () => {
            const allTestCases = [
                ...Object.keys(LEGACY_MAP),
                "eng1-t99", "eng4-t100", "eng6-t0", "unknown_unit",
                "", "   ", null, undefined, 42, false, {}, []
            ];

            allTestCases.forEach(testCase => {
                const legacyRes = legacyGetGrammarTopicByUnitId(testCase);
                const newRes = GrammarUtils.getGrammarTopicByUnitId(testCase);
                expect(newRes).toBe(legacyRes);
            });
        });
    });
});
