/**
 * tests/core/word-image-utils.test.js
 * Unit and Characterization tests for WordImageUtils (v15.9 Semantic Visual Vocabulary).
 */

const WordImageUtils = require('../../js/core/word-image-utils');

describe('WordImageUtils — Bộ từ điển ánh xạ từ vựng sang hình ảnh (v15.9)', () => {
    test('Xuất khẩu đầy đủ API và UMD module', () => {
        expect(WordImageUtils).toBeDefined();
        expect(typeof WordImageUtils.getWordImagePath).toBe('function');
        expect(typeof WordImageUtils.getVisualMetadata).toBe('function');
        expect(typeof WordImageUtils.wordImageMap).toBe('object');
        expect(typeof WordImageUtils.visualVocabularyManifest).toBe('object');
    });

    test('Chứa đầy đủ các từ vựng cốt lõi Lớp 1-2, Lớp 4-5, Lớp 6-7 (Legacy Map)', () => {
        const map = WordImageUtils.wordImageMap;
        expect(map['hello']).toBe('hello');
        expect(map['goodbye']).toBe('goodbye');
        expect(map['apple']).toBe('apple');
        expect(map['calculator']).toBe('calculator');
        expect(Object.keys(map).length).toBeGreaterThanOrEqual(120);
    });

    test('Hỗ trợ tra cứu theo Canonical Vocabulary ID v15.9', () => {
        const path1 = WordImageUtils.getWordImagePath('VOC_L1_U01_BALL');
        expect(path1).toBe('images/english/vocab/voc_l1_u01_ball.svg');

        const path2 = WordImageUtils.getWordImagePath('VOC_L6_U01_COMPASS');
        expect(path2).toBe('images/english/vocab/voc_l6_u01_compass.svg');
    });

    test('Hỗ trợ lấy Semantic Visual Metadata và loại trừ nghĩa sai (Disambiguation)', () => {
        const metaCompass = WordImageUtils.getVisualMetadata('VOC_L6_U01_COMPASS');
        expect(metaCompass).toBeDefined();
        expect(metaCompass.word).toBe('compass');
        expect(metaCompass.visualConcept).toContain('compass');
        expect(metaCompass.excludeConcepts).toContain('navigation magnetic compass');

        const metaLeft = WordImageUtils.getVisualMetadata('left');
        expect(metaLeft).toBeDefined();
        expect(metaLeft.excludeConcepts).toContain('abandoned');
    });

    test('Hỗ trợ Context-aware Lookup với cờ preferOffline', () => {
        const localPath = WordImageUtils.getWordImagePath('apple', { grade: '1', preferOffline: true });
        expect(localPath).toContain('images/english/vocab/');
        expect(localPath.endsWith('.svg')).toBe(true);
    });

    test('getWordImagePath trả về đúng URL Icons8 cho từ vựng đã biết khi không có context offline', () => {
        expect(WordImageUtils.getWordImagePath('hello')).toBe('https://img.icons8.com/color/180/hello.png');
        expect(WordImageUtils.getWordImagePath('what')).toBe('https://img.icons8.com/color/180/question-mark.png');
        expect(WordImageUtils.getWordImagePath('living room')).toBe('https://img.icons8.com/color/180/sofa.png');
        expect(WordImageUtils.getWordImagePath('driverless')).toBe('https://img.icons8.com/color/180/car.png');
    });

    test('getWordImagePath xử lý chuẩn hóa chữ hoa/chữ thường và khoảng trắng', () => {
        expect(WordImageUtils.getWordImagePath(' HELLO ')).toBe('https://img.icons8.com/color/180/hello.png');
        expect(WordImageUtils.getWordImagePath('Living Room')).toBe('https://img.icons8.com/color/180/sofa.png');
        expect(WordImageUtils.getWordImagePath('  VIETNAM   ')).toBe('https://img.icons8.com/color/180/flag-of-vietnam.png');
    });

    test('getWordImagePath fallback an toàn cho từ vựng chưa có trong từ điển', () => {
        expect(WordImageUtils.getWordImagePath('space rocket')).toBe('https://img.icons8.com/color/180/space-rocket.png');
        expect(WordImageUtils.getWordImagePath('unknownword')).toBe('https://img.icons8.com/color/180/unknownword.png');
    });

    test('getWordImagePath xử lý an toàn các giá trị biên null, undefined, chuỗi rỗng', () => {
        expect(WordImageUtils.getWordImagePath('')).toBe('https://img.icons8.com/color/180/.png');
        expect(WordImageUtils.getWordImagePath(null)).toBe('https://img.icons8.com/color/180/.png');
        expect(WordImageUtils.getWordImagePath(undefined)).toBe('https://img.icons8.com/color/180/.png');
    });
});
