/**
 * tests/core/word-image-utils.test.js
 * Unit and Characterization tests for WordImageUtils (wordImageMap & getWordImagePath).
 */

const WordImageUtils = require('../../js/core/word-image-utils');

describe('WordImageUtils — Bộ từ điển ánh xạ từ vựng sang hình ảnh', () => {
    test('Xuất khẩu đầy đủ API và UMD module', () => {
        expect(WordImageUtils).toBeDefined();
        expect(typeof WordImageUtils.getWordImagePath).toBe('function');
        expect(typeof WordImageUtils.wordImageMap).toBe('object');
        expect(WordImageUtils.wordImageMap).not.toBeNull();
    });

    test('Chứa đầy đủ các từ vựng cốt lõi Lớp 1-2, Lớp 4-5, Lớp 6-7', () => {
        const map = WordImageUtils.wordImageMap;
        
        // Lớp 1 & 2
        expect(map['hello']).toBe('hello');
        expect(map['goodbye']).toBe('goodbye');
        expect(map['what']).toBe('question-mark');
        expect(map['father']).toBe('man');
        expect(map['mother']).toBe('woman');
        expect(map['apple']).toBe('apple');
        expect(map['living room']).toBe('sofa');

        // Lớp 4 & 5
        expect(map['vietnam']).toBe('flag-of-vietnam');
        expect(map['birthday']).toBe('birthday-cake');
        expect(map['supermarket']).toBe('supermarket');
        expect(map['autumn']).toBe('leaf');
        expect(map['traffic']).toBe('traffic-light');

        // Lớp 6 & 7
        expect(map['calculator']).toBe('calculator');
        expect(map['neighbourhood']).toBe('neighborhood');
        expect(map['waterfall']).toBe('waterfall');
        expect(map['driverless']).toBe('car');
        expect(map['eco-friendly']).toBe('leaf');

        // Tổng số từ vựng trong từ điển
        expect(Object.keys(map).length).toBeGreaterThanOrEqual(120);
    });

    test('getWordImagePath trả về đúng URL Icons8 cho từ vựng đã biết', () => {
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
        // Thay thế dấu cách bằng dấu gạch ngang
        expect(WordImageUtils.getWordImagePath('space rocket')).toBe('https://img.icons8.com/color/180/space-rocket.png');
        expect(WordImageUtils.getWordImagePath('unknownword')).toBe('https://img.icons8.com/color/180/unknownword.png');
    });

    test('getWordImagePath xử lý an toàn các giá trị biên null, undefined, chuỗi rỗng', () => {
        expect(WordImageUtils.getWordImagePath('')).toBe('https://img.icons8.com/color/180/.png');
        expect(WordImageUtils.getWordImagePath(null)).toBe('https://img.icons8.com/color/180/.png');
        expect(WordImageUtils.getWordImagePath(undefined)).toBe('https://img.icons8.com/color/180/.png');
    });
});
