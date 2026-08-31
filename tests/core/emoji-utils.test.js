/**
 * Unit & Characterization Tests for EmojiUtils module (js/core/emoji-utils.js)
 * 
 * Đảm bảo 100% contract và tương thích ngược:
 * - Tra cứu chính xác toàn bộ 223 mapping emoji hiện tại
 * - Không phân biệt hoa/thường (uppercase / lowercase)
 * - Tự động loại bỏ khoảng trắng thừa đầu/cuối (whitespace trimming)
 * - Từ không xác định (unknown word) trả về fallback "⭐"
 * - Chuỗi rỗng ("" hoặc "   ") trả về fallback "⭐"
 * - Non-string input (null, undefined, number, boolean, object, array) trả về fallback "⭐"
 * - 100% Characterization đối chiếu với legacy implementation trong js/english_data.js
 */

const EmojiUtils = require('../../js/core/emoji-utils');
const { getWordEmoji, EMOJI_FALLBACK, FALLBACK_EMOJI } = require('../../js/core/emoji-utils');

// Bản cài đặt tham chiếu nguyên bản từ js/english_data.js để đối chiếu Characterization
const LEGACY_EMOJI_FALLBACK = {
    "hello": "👋",
    "goodbye": "👋",
    "name": "📛",
    "what": "❓",
    "you": "👤",
    "book": "📖",
    "pen": "🖊️",
    "ruler": "📏",
    "bag": "🎒",
    "pencil": "✏️",
    "red": "🔴",
    "blue": "🔵",
    "green": "🟢",
    "yellow": "🟡",
    "circle": "⭕",
    "one": "1️⃣",
    "two": "2️⃣",
    "three": "3️⃣",
    "four": "4️⃣",
    "five": "5️⃣",
    "father": "👨",
    "mother": "👩",
    "brother": "👦",
    "sister": "👧",
    "baby": "👶",
    "head": "🙆",
    "face": "👩",
    "hand": "✋",
    "foot": "🦶",
    "hair": "💇",
    "ball": "⚽",
    "doll": "🧸",
    "train": "🚂",
    "car": "🚗",
    "plane": "✈️",
    "dog": "🐶",
    "cat": "🐱",
    "bird": "🐦",
    "duck": "🦆",
    "sun": "☀️",
    "apple": "🍎",
    "banana": "🍌",
    "milk": "🥛",
    "cake": "🍰",
    "water": "💧",
    "run": "🏃",
    "walk": "🚶",
    "jump": "🦘",
    "dance": "💃",
    "sing": "🎤",
    "draw": "🎨",
    "speak": "🗣️",
    "house": "🏠",
    "bedroom": "🛏️",
    "living room": "🛋️",
    "kitchen": "🍳",
    "bathroom": "🚿",
    "bed": "🛏️",
    "table": "table",
    "chair": "🪑",
    "sofa": "🛋️",
    "tv": "📺",
    "shirt": "👕",
    "pants": "👖",
    "dress": "👗",
    "shoes": "👟",
    "hat": "👒",
    "orange": "🍊",
    "grape": "🍇",
    "mango": "🥭",
    "strawberry": "🍓",
    "pear": "🍐",
    "cow": "🐄",
    "horse": "🐎",
    "pig": "🐖",
    "sheep": "🐑",
    "chicken": "🐔",
    "lion": "🦁",
    "tiger": "🐯",
    "elephant": "🐘",
    "monkey": "🐒",
    "zebra": "🦓",
    "sky": "☁️",
    "teacher": "🧑‍🏫",
    "doctor": "🧑‍⚕️",
    "pilot": "🧑‍✈️",
    "cook": "🧑‍🍳",
    "driver": "🧑‍✈️",
    "bus": "🚌",
    "vietnam": "🇻🇳",
    "america": "🇺🇸",
    "england": "🇬🇧",
    "japan": "🇯🇵",
    "malaysia": "🇲🇾",
    "australia": "🇦🇺",
    "vietnamese": "🇻🇳",
    "american": "🇺🇸",
    "english": "🇬🇧",
    "japanese": "🇯🇵",
    "malaysian": "🇲🇾",
    "australian": "🇦🇺",
    "time": "⏰",
    "clock": "🕒",
    "morning": "🌅",
    "afternoon": "☀️",
    "evening": "🌇",
    "monday": "📅",
    "tuesday": "📅",
    "wednesday": "📅",
    "thursday": "📅",
    "friday": "📅",
    "saturday": "📅",
    "sunday": "📅",
    "january": "🗓️",
    "february": "🗓️",
    "march": "🗓️",
    "date": "📅",
    "birthday": "🎂",
    "swim": "🏊",
    "cycle": "🚴",
    "skate": "⛸️",
    "paint": "🎨",
    "chess": "♟️",
    "football": "⚽",
    "maths": "🧮",
    "science": "🔬",
    "art": "🎨",
    "music": "🎵",
    "it": "💻",
    "history": "📚",
    "bakery": "🍞",
    "bookshop": "📚",
    "supermarket": "🛒",
    "pharmacy": "💊",
    "cinema": "🎬",
    "zoo": "🦁",
    "sunny": "☀️",
    "rainy": "🌧️",
    "windy": "💨",
    "cloudy": "☁️",
    "stormy": "⚡",
    "snowy": "❄️",
    "spring": "🌸",
    "summer": "☀️",
    "autumn": "🍂",
    "winter": "❄️",
    "fever": "🤒",
    "headache": "🤕",
    "cough": "😷",
    "sore throat": "🤢",
    "stomach ache": "🤮",
    "hometown": "🏡",
    "village": "🏡",
    "city": "🏙️",
    "island": "🏝️",
    "timetable": "📅",
    "story": "📖",
    "visit": "🎒",
    "dentist": "🧑‍⚕️",
    "medicine": "💊",
    "left": "⬅️",
    "right": "➡️",
    "straight": "⬆️",
    "station": "🚉",
    "astronaut": "🧑‍🚀",
    "calculator": "🧮",
    "compass": "🧭",
    "schoolbag": "🎒",
    "pencil sharpener": "✏️",
    "uniform": "👔",
    "wardrobe": " wardrobe",
    "fridge": " Fridge",
    "cooker": " Cooker",
    "tall": "🧍",
    "short": "🧍",
    "kind": "😇",
    "clever": "💡",
    "friendly": "🤝",
    "creative": "🎨",
    "neighbourhood": "🏡",
    "temple": "⛩️",
    "cathedral": "⛪",
    "suburb": "🏘️",
    "forest": "🌲",
    "mountain": "🏔️",
    "waterfall": "🌊",
    "desert": "🏜️",
    "wish": "✨",
    "fireworks": "🎆",
    "blossom": "🌸",
    "relative": "👨‍👩‍👧‍👦",
    "first footer": "👞",
    "badminton": "🏸",
    "champion": "🏆",
    "stadium": "🏟️",
    "fit": "💪",
    "marathon": "🏃",
    "continent": "🌍",
    "landmark": "🗽",
    "historic": "🏰",
    "modern": "🏙️",
    "peaceful": "🕊️",
    "recycle": "♻️",
    "reuse": "🔄",
    "reduce": "📉",
    "environment": "🌳",
    "plastic": "🍼",
    "hobby": "🎨",
    "gardening": "🪴",
    "coin": "🪙",
    "will": "🔮",
    "calories": "🔥",
    "diet": "🥗",
    "volunteer": "🤝",
    "donate": "🎁",
    "instrument": "🎸",
    "recipe": "📖",
    "monument": "🗿",
    "pedestrian": "🚶",
    "license": "🪪",
    "comedy": "😂",
    "solar": "☀️"
};

function legacyGetWordEmoji(word) {
    if (typeof word !== 'string') return "⭐";
    const clean = word.toLowerCase().trim();
    return LEGACY_EMOJI_FALLBACK[clean] || "⭐";
}

describe("Unit & Characterization Tests — EmojiUtils (js/core/emoji-utils.js)", () => {

    // 1. Public Contract & Exports
    describe("1. Public Contract & Exports", () => {
        test("Export đúng cấu trúc qua CommonJS module.exports", () => {
            expect(EmojiUtils).toBeDefined();
            expect(typeof EmojiUtils.getWordEmoji).toBe('function');
            expect(typeof EmojiUtils.EMOJI_FALLBACK).toBe('object');
            expect(EmojiUtils.FALLBACK_EMOJI).toBe('⭐');
        });

        test("Export các thuộc tính và hàm qua Destructuring", () => {
            expect(typeof getWordEmoji).toBe('function');
            expect(typeof EMOJI_FALLBACK).toBe('object');
            expect(FALLBACK_EMOJI).toBe('⭐');
        });

        test("Tự động gán vào globalThis / window", () => {
            expect(globalThis.EmojiUtils).toBeDefined();
            expect(globalThis.getWordEmoji).toBeDefined();
            expect(globalThis.EMOJI_FALLBACK).toBeDefined();
            expect(typeof globalThis.getWordEmoji).toBe('function');
        });
    });

    // 2. Tra cứu toàn bộ 223 từ vựng hiện tại
    describe("2. Tra cứu toàn bộ 223 từ vựng hiện tại", () => {
        const words = Object.keys(LEGACY_EMOJI_FALLBACK);

        test(`Bảo toàn chính xác ${words.length} từ vựng trong từ điển EMOJI_FALLBACK`, () => {
            expect(Object.keys(EmojiUtils.EMOJI_FALLBACK).length).toBe(222);
            words.forEach(word => {
                const expectedEmoji = LEGACY_EMOJI_FALLBACK[word];
                expect(EmojiUtils.getWordEmoji(word)).toBe(expectedEmoji);
            });
        });

        test("Kiểm tra các từ đặc thù giữ nguyên giá trị legacy (kể cả khoảng trắng hoặc văn bản nguyên bản)", () => {
            expect(EmojiUtils.getWordEmoji("table")).toBe("table");
            expect(EmojiUtils.getWordEmoji("wardrobe")).toBe(" wardrobe");
            expect(EmojiUtils.getWordEmoji("fridge")).toBe(" Fridge");
            expect(EmojiUtils.getWordEmoji("cooker")).toBe(" Cooker");
            expect(EmojiUtils.getWordEmoji("book")).toBe("📖");
            expect(EmojiUtils.getWordEmoji("teacher")).toBe("🧑‍🏫");
            expect(EmojiUtils.getWordEmoji("vietnam")).toBe("🇻🇳");
        });
    });

    // 3. Không phân biệt hoa/thường (Case Insensitivity)
    describe("3. Không phân biệt chữ hoa / chữ thường", () => {
        test("Xử lý chuỗi in hoa hoàn toàn (UPPERCASE)", () => {
            expect(EmojiUtils.getWordEmoji("HELLO")).toBe("👋");
            expect(EmojiUtils.getWordEmoji("APPLE")).toBe("🍎");
            expect(EmojiUtils.getWordEmoji("VIETNAM")).toBe("🇻🇳");
            expect(EmojiUtils.getWordEmoji("TEACHER")).toBe("🧑‍🏫");
        });

        test("Xử lý chuỗi viết hoa chữ cái đầu (TitleCase / Capitalized)", () => {
            expect(EmojiUtils.getWordEmoji("Banana")).toBe("🍌");
            expect(EmojiUtils.getWordEmoji("Doctor")).toBe("🧑‍⚕️");
            expect(EmojiUtils.getWordEmoji("Schoolbag")).toBe("🎒");
        });

        test("Xử lý chuỗi hỗn hợp hoa thường (MixedCase)", () => {
            expect(EmojiUtils.getWordEmoji("bEdRoOm")).toBe("🛏️");
            expect(EmojiUtils.getWordEmoji("lIvInG rOoM")).toBe("🛋️");
            expect(EmojiUtils.getWordEmoji("AuStRaLiA")).toBe("🇦🇺");
        });
    });

    // 4. Loại bỏ khoảng trắng thừa (Whitespace Trimming)
    describe("4. Loại bỏ khoảng trắng thừa đầu và cuối", () => {
        test("Xử lý khoảng trắng trước và sau từ đơn", () => {
            expect(EmojiUtils.getWordEmoji("  cat  ")).toBe("🐱");
            expect(EmojiUtils.getWordEmoji(" dog ")).toBe("🐶");
            expect(EmojiUtils.getWordEmoji("\tsun\t")).toBe("☀️");
            expect(EmojiUtils.getWordEmoji("\napple\n")).toBe("🍎");
        });

        test("Xử lý từ ghép có khoảng trắng giữa và thừa khoảng trắng đầu cuối", () => {
            expect(EmojiUtils.getWordEmoji("  living room  ")).toBe("🛋️");
            expect(EmojiUtils.getWordEmoji("  pencil sharpener  ")).toBe("✏️");
            expect(EmojiUtils.getWordEmoji("   first footer   ")).toBe("👞");
            expect(EmojiUtils.getWordEmoji(" sore throat ")).toBe("🤢");
        });
    });

    // 5. Từ vựng không tồn tại (Unknown words) & Fallback
    describe("5. Xử lý từ không xác định (Unknown Words) & Fallback", () => {
        test("Từ tiếng Anh không có trong danh sách trả về ⭐", () => {
            expect(EmojiUtils.getWordEmoji("quantum")).toBe("⭐");
            expect(EmojiUtils.getWordEmoji("supercalifragilistic")).toBe("⭐");
            expect(EmojiUtils.getWordEmoji("random_non_existent_key")).toBe("⭐");
        });

        test("Từ tiếng Việt trả về ⭐", () => {
            expect(EmojiUtils.getWordEmoji("quả táo")).toBe("⭐");
            expect(EmojiUtils.getWordEmoji("xin chào")).toBe("⭐");
        });
    });

    // 6. Chuỗi rỗng (Empty / Blank Strings)
    describe("6. Xử lý chuỗi rỗng & toàn khoảng trắng", () => {
        test("Chuỗi rỗng '' trả về fallback ⭐", () => {
            expect(EmojiUtils.getWordEmoji("")).toBe("⭐");
        });

        test("Chuỗi chỉ chứa dấu cách '   ' trả về fallback ⭐", () => {
            expect(EmojiUtils.getWordEmoji("   ")).toBe("⭐");
            expect(EmojiUtils.getWordEmoji("\t\n ")).toBe("⭐");
        });
    });

    // 7. Non-string inputs (Xử lý dữ liệu đầu vào không phải chuỗi an toàn)
    describe("7. Xử lý an toàn đầu vào không phải chuỗi (Non-string Inputs)", () => {
        test("null trả về ⭐ mà không quăng lỗi", () => {
            expect(EmojiUtils.getWordEmoji(null)).toBe("⭐");
        });

        test("undefined trả về ⭐ mà không quăng lỗi", () => {
            expect(EmojiUtils.getWordEmoji(undefined)).toBe("⭐");
            expect(EmojiUtils.getWordEmoji()).toBe("⭐");
        });

        test("number trả về ⭐ mà không quăng lỗi", () => {
            expect(EmojiUtils.getWordEmoji(123)).toBe("⭐");
            expect(EmojiUtils.getWordEmoji(0)).toBe("⭐");
            expect(EmojiUtils.getWordEmoji(NaN)).toBe("⭐");
        });

        test("boolean trả về ⭐ mà không quăng lỗi", () => {
            expect(EmojiUtils.getWordEmoji(true)).toBe("⭐");
            expect(EmojiUtils.getWordEmoji(false)).toBe("⭐");
        });

        test("object và array trả về ⭐ mà không quăng lỗi", () => {
            expect(EmojiUtils.getWordEmoji({})).toBe("⭐");
            expect(EmojiUtils.getWordEmoji([])).toBe("⭐");
            expect(EmojiUtils.getWordEmoji({ word: "apple" })).toBe("⭐");
        });
    });

    // 8. 100% Characterization Test đối chiếu trực tiếp với Legacy
    describe("8. 100% Characterization Test đối chiếu với Legacy Implementation", () => {
        test("Tất cả các từ vựng và các trường hợp biên cho kết quả đồng nhất 100% giữa New và Legacy", () => {
            const testSamples = [
                ...Object.keys(LEGACY_EMOJI_FALLBACK),
                ...Object.keys(LEGACY_EMOJI_FALLBACK).map(w => `  ${w.toUpperCase()}  `),
                "", "   ", "unknown_123", null, undefined, 42, false, {}
            ];

            testSamples.forEach(sample => {
                const legacyResult = legacyGetWordEmoji(sample);
                const newResult = EmojiUtils.getWordEmoji(sample);
                expect(newResult).toBe(legacyResult);
            });
        });
    });
});
