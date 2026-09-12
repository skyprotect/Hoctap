/**
 * word-image-utils — Từ điển ánh xạ từ vựng tiếng Anh sang hình ảnh vector Semantic Visual (v15.9).
 * Hỗ trợ tra cứu theo Canonical Vocabulary ID, Context-aware lookup, và fallback tương thích ngược.
 * Độc lập hoàn toàn, hỗ trợ UMD (Node.js CommonJS, Web Workers, Browser Global).
 * 
 * Public Contract:
 * - wordImageMap: Object (Legacy fallback map)
 * - visualVocabularyManifest: Object (Canonical Semantic Manifest)
 * - getWordImagePath(vocabularyIdOrWord: string, context?: Object): string
 * - getVisualMetadata(vocabularyIdOrWord: string, context?: Object): Object|null
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.WordImageUtils = api;
    root.wordImageMap = api.wordImageMap;
    root.visualVocabularyManifest = api.visualVocabularyManifest;
    root.getWordImagePath = api.getWordImagePath;
    root.getVisualMetadata = api.getVisualMetadata;
    if (typeof window !== 'undefined') {
        window.WordImageUtils = api;
        window.wordImageMap = api.wordImageMap;
        window.visualVocabularyManifest = api.visualVocabularyManifest;
        window.getWordImagePath = api.getWordImagePath;
        window.getVisualMetadata = api.getVisualMetadata;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.WordImageUtils = api;
        globalThis.wordImageMap = api.wordImageMap;
        globalThis.visualVocabularyManifest = api.visualVocabularyManifest;
        globalThis.getWordImagePath = api.getWordImagePath;
        globalThis.getVisualMetadata = api.getVisualMetadata;
    }
    if (typeof self !== 'undefined') {
        self.WordImageUtils = api;
        self.wordImageMap = api.wordImageMap;
        self.visualVocabularyManifest = api.visualVocabularyManifest;
        self.getWordImagePath = api.getWordImagePath;
        self.getVisualMetadata = api.getVisualMetadata;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // Nạp manifest cục bộ nếu đang ở môi trường Node.js
    let visualManifest = {};
    if (typeof require === 'function') {
        try {
            const fs = require('fs');
            const path = require('path');
            const manifestPath = path.resolve(__dirname, '../../images/english/visual-vocabulary-manifest.json');
            if (fs.existsSync(manifestPath)) {
                visualManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
            }
        } catch (e) {
            // Browser hoặc runtime không có filesystem
        }
    }

    // Index nhanh theo từ vựng thường để tra cứu context-aware
    const wordLookupIndex = {};
    Object.keys(visualManifest).forEach(id => {
        const item = visualManifest[id];
        const w = (item.word || '').toLowerCase().trim();
        if (!wordLookupIndex[w]) wordLookupIndex[w] = [];
        wordLookupIndex[w].push(item);
    });

    // Legacy exact mappings (Icons8 Color style fallback)
    const wordImageMap = {
        // Lớp 1 & Lớp 2 Nâng cao
        "hello": "hello", "goodbye": "goodbye", "name": "name", "what": "question-mark", "you": "user",
        "book": "open-book", "pen": "pen", "ruler": "ruler", "bag": "schoolbag", "pencil": "pencil",
        "red": "red-square", "blue": "blue-square", "green": "green-square", "yellow": "yellow-square", "circle": "circle",
        "one": "one", "two": "two", "three": "three", "four": "four", "five": "five",
        "father": "man", "mother": "woman", "brother": "boy", "sister": "girl", "baby": "baby",
        "head": "head", "face": "face", "hand": "hand", "foot": "foot", "hair": "hair",
        "ball": "soccer-ball", "doll": "doll", "train": "train", "car": "car", "plane": "airplane",
        "dog": "dog", "cat": "cat", "bird": "bird", "duck": "duck", "sun": "sun",
        "apple": "apple", "banana": "banana", "milk": "milk-bottle", "cake": "cake", "water": "water-glass",
        "run": "running", "walk": "running", "jump": "jumping", "dance": "dancing", "sing": "singing", "draw": "drawing",
        "read": "open-book", "write": "pencil", "listen": "hearing", "speak": "chat", "learn": "brain",
        "house": "home", "bedroom": "bedroom", "living room": "sofa", "kitchen": "kitchen", "bathroom": "shower",
        "bed": "bed", "table": "table", "chair": "chair", "sofa": "sofa", "tv": "tv",
        "shirt": "shirt", "pants": "jeans", "dress": "dress", "shoes": "shoes", "hat": "hat",
        "orange": "orange", "grape": "grapes", "mango": "mango", "strawberry": "strawberry", "pear": "pear",
        "cow": "cow", "horse": "horse", "pig": "pig", "sheep": "sheep", "chicken": "chicken",
        "lion": "lion", "tiger": "tiger", "elephant": "elephant", "monkey": "monkey", "zebra": "zebra",
        "sky": "cloud", "teacher": "teacher", "doctor": "doctor", "pilot": "pilot", "cook": "cook", "driver": "driver", "bus": "bus",

        // Lớp 4 & Lớp 5 Nâng cao
        "vietnam": "flag-of-vietnam", "america": "flag-of-usa", "england": "united-kingdom", "japan": "flag-of-japan", "australia": "flag-of-australia",
        "time": "clock", "clock": "clock", "morning": "sunrise", "afternoon": "sun", "evening": "sunset",
        "monday": "calendar", "tuesday": "calendar", "wednesday": "calendar", "thursday": "calendar", "friday": "calendar", "saturday": "calendar", "sunday": "calendar",
        "january": "calendar", "february": "calendar", "march": "calendar", "date": "calendar", "birthday": "birthday-cake",
        "swim": "swimming", "skate": "skating", "chess": "chess-board", "football": "soccer-ball", "hobby": "hobbies",
        "maths": "calculator", "science": "test-tube", "music": "music", "history": "history", "english": "united-kingdom",
        "bakery": "bakery", "bookshop": "book-shelf", "cinema": "cinema", "supermarket": "supermarket", "zoo": "zoo",
        "sunny": "sun", "rainy": "rain", "windy": "wind", "cloudy": "cloud", "snowy": "snow",
        "fever": "thermometer", "headache": "headache", "cough": "coughing", "sore throat": "throat", "cold": "cold",
        "yesterday": "history", "museum": "museum", "beach": "beach", "trip": "suitcase", "stayed": "home",
        "hometown": "home", "village": "home", "city": "city", "island": "island", "crowded": "crowd",
        "timetable": "calendar", "lesson": "book", "always": "checked", "usually": "checked", "sometimes": "checked",
        "tomorrow": "calendar", "next week": "calendar", "holiday": "beach", "visit": "running", "buy": "shopping-cart",
        "toothache": "headache", "earache": "throat", "medicine": "pill", "dentist": "doctor",
        "spring": "spring", "summer": "sun", "autumn": "leaf", "winter": "snow", "season": "globe",
        "left": "left", "right": "right", "straight": "up", "corner": "intersection", "station": "train",
        "story": "open-book", "intelligent": "brain", "like": "like",
        "chef": "cook", "astronaut": "astronaut", "nurse": "doctor",
        "apartment": "city", "cottage": "home", "villa": "home", "noise": "noise", "clean": "sparkles",
        "traffic": "traffic-light", "rule": "checked", "cross": "running", "sign": "attention", "helmet": "helmet",

        // Lớp 6 & Lớp 7 Nâng cao
        "calculator": "calculator", "compass": "compass", "uniform": "school-uniform", "textbook": "book", "canteen": "canteen",
        "drawer": "drawer", "short": "height", "clever": "brain", "creative": "paint-palette", "friendly": "handshake",
        "neighbourhood": "neighborhood", "temple": "temple", "cathedral": "cathedral", "suburb": "suburb", "noisy": "noise",
        "forest": "forest", "mountain": "mountain", "waterfall": "waterfall", "desert": "desert",
        "wish": "star", "fireworks": "fireworks", "blossom": "blossom", "relative": "family", "envelope": "envelope",
        "cartoon": "cartoon", "channel": "television", "programme": "television", "reporter": "reporter", "educational": "graduation-cap",
        "badminton": "badminton", "champion": "trophy", "stadium": "stadium", "fit": "fitness", "marathon": "runner",
        "continent": "globe", "landmark": "landmark", "historic": "castle", "modern": "city", "peaceful": "dove",
        "recycle": "recycle", "reuse": "reuse", "reduce": "reduce", "environment": "nature", "plastic": "plastic-bottle",
        "gardening": "gardening", "stamp": "stamp", "coin": "coin", "health": "heart",
        "calories": "fire", "diet": "salad", "lifestyle": "sports", "disease": "coughing",
        "volunteer": "handshake", "donate": "present", "clean-up": "broom", "shelter": "home", "homeless": "sad",
        "instrument": "guitar", "concert": "music", "artist": "paint-palette", "gallery": "picture",
        "noodle": "noodles", "soup": "soup", "recipe": "book", "ingredient": "ingredients", "turmeric": "ginger",
        "scholar": "graduation-cap", "monument": "statue", "stone": "stone", "imperial": "crown",
        "pedestrian": "running", "passenger": "passenger", "license": "card", "fine": "receipt", "road": "road",
        "comedy": "laughing", "action": "gun", "director": "director", "review": "checked", "boring": "sad",
        "energy": "lightning", "solar": "sun", "wind": "wind", "coal": "coal", "source": "faucet",
        "driverless": "car", "eco-friendly": "leaf", "hyperloop": "train", "flying": "airplane", "crash": "explosion"
    };

    /**
     * Lấy metadata trực quan của từ vựng
     */
    function getVisualMetadata(vocabularyIdOrWord, context) {
        if (!vocabularyIdOrWord) return null;
        const key = String(vocabularyIdOrWord).trim();

        // 1. Kiểm tra theo Canonical ID
        if (visualManifest[key]) {
            return visualManifest[key];
        }

        // 2. Tra cứu theo word + context
        const cleanWord = key.toLowerCase();
        const candidates = wordLookupIndex[cleanWord] || [];
        if (candidates.length > 0) {
            if (context) {
                if (context.vocabularyId && visualManifest[context.vocabularyId]) {
                    return visualManifest[context.vocabularyId];
                }
                if (context.grade) {
                    const gradeMatch = candidates.find(c => String(c.grade) === String(context.grade));
                    if (gradeMatch) return gradeMatch;
                }
                if (context.unitId) {
                    const unitMatch = candidates.find(c => c.unitId === context.unitId);
                    if (unitMatch) return unitMatch;
                }
            }
            return candidates[0];
        }

        return null;
    }

    /**
     * Lấy đường dẫn hình ảnh từ vựng:
     * Ưu tiên Canonical ID -> Context-aware semantic manifest -> Legacy fallback URL
     * 
     * @param {string} vocabularyIdOrWord - Canonical Vocabulary ID hoặc từ vựng tiếng Anh
     * @param {Object} [context] - Ngữ cảnh bổ trợ ({ grade, unitId, sentence, preferOffline })
     * @returns {string} - Đường dẫn ảnh
     */
    function getWordImagePath(vocabularyIdOrWord, context) {
        if (!vocabularyIdOrWord) return 'https://img.icons8.com/color/180/.png';
        const key = String(vocabularyIdOrWord).trim();

        // 1. Tra cứu Canonical ID trực tiếp
        if (visualManifest[key]) {
            return visualManifest[key].imageFile;
        }

        // 2. Tra cứu Context-aware semantic metadata
        const meta = getVisualMetadata(key, context);
        if (meta && meta.imageFile) {
            // Nếu có cờ preferOffline hoặc gọi từ Canonical context -> trả về local svg
            if (context && (context.preferOffline || context.grade || context.unitId || context.isCurriculum)) {
                return meta.imageFile;
            }
        }

        // 3. Tra cứu theo từ vựng thuần túy (backward-compatibility)
        const cleanWord = key.toLowerCase();
        const iconName = wordImageMap[cleanWord] || cleanWord.replace(/\s+/g, "-");
        return `https://img.icons8.com/color/180/${iconName}.png`;
    }

    const WordImageUtils = {
        wordImageMap: wordImageMap,
        visualVocabularyManifest: visualManifest,
        getVisualMetadata: getVisualMetadata,
        getWordImagePath: getWordImagePath
    };

    return WordImageUtils;
});
