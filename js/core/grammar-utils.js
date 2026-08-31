/**
 * grammar-utils — Bộ ánh xạ định danh bài học Tiếng Anh sang chủ điểm ngữ pháp trọng tâm.
 * Độc lập hoàn toàn, hỗ trợ UMD (Node.js CommonJS, Web Workers, Browser Global).
 * 
 * Public Contract:
 * - getGrammarTopicByUnitId(unitId: string): string
 * - GRAMMAR_UNIT_TOPIC_MAP: Record<string, string>
 * - DEFAULT_GRAMMAR_TOPIC: string ("present_simple_verbs")
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.GrammarUtils = api;
    root.getGrammarTopicByUnitId = api.getGrammarTopicByUnitId;
    root.GRAMMAR_UNIT_TOPIC_MAP = api.GRAMMAR_UNIT_TOPIC_MAP;
    root.DEFAULT_GRAMMAR_TOPIC = api.DEFAULT_GRAMMAR_TOPIC;
    if (typeof window !== 'undefined') {
        window.GrammarUtils = api;
        window.getGrammarTopicByUnitId = api.getGrammarTopicByUnitId;
        window.GRAMMAR_UNIT_TOPIC_MAP = api.GRAMMAR_UNIT_TOPIC_MAP;
        window.DEFAULT_GRAMMAR_TOPIC = api.DEFAULT_GRAMMAR_TOPIC;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.GrammarUtils = api;
        globalThis.getGrammarTopicByUnitId = api.getGrammarTopicByUnitId;
        globalThis.GRAMMAR_UNIT_TOPIC_MAP = api.GRAMMAR_UNIT_TOPIC_MAP;
        globalThis.DEFAULT_GRAMMAR_TOPIC = api.DEFAULT_GRAMMAR_TOPIC;
    }
    if (typeof self !== 'undefined') {
        self.GrammarUtils = api;
        self.getGrammarTopicByUnitId = api.getGrammarTopicByUnitId;
        self.GRAMMAR_UNIT_TOPIC_MAP = api.GRAMMAR_UNIT_TOPIC_MAP;
        self.DEFAULT_GRAMMAR_TOPIC = api.DEFAULT_GRAMMAR_TOPIC;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const DEFAULT_GRAMMAR_TOPIC = "present_simple_verbs";

    const GRAMMAR_UNIT_TOPIC_MAP = {
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

    /**
     * Lấy chủ điểm ngữ pháp tương ứng với Unit ID
     * @param {string} unitId - Mã Unit (ví dụ: 'eng1-t1', 'eng4-t14', 'eng6-t16')
     * @returns {string} - Tên chủ điểm ngữ pháp (fallback: 'present_simple_verbs')
     */
    function getGrammarTopicByUnitId(unitId) {
        if (!unitId || typeof unitId !== 'string') return DEFAULT_GRAMMAR_TOPIC;
        return GRAMMAR_UNIT_TOPIC_MAP[unitId] || DEFAULT_GRAMMAR_TOPIC;
    }

    const GrammarUtils = {
        getGrammarTopicByUnitId: getGrammarTopicByUnitId,
        GRAMMAR_UNIT_TOPIC_MAP: GRAMMAR_UNIT_TOPIC_MAP,
        DEFAULT_GRAMMAR_TOPIC: DEFAULT_GRAMMAR_TOPIC
    };

    return GrammarUtils;
});
