/**
 * @file english-course-data.test.js
 * Test suite kiểm thử tính toàn vẹn 100% của English Course Data Boundary (js/core/english-course-data.js)
 * 
 * Phạm vi kiểm thử:
 * 1. Existence & Module Loading: Load CommonJS và Browser Globals
 * 2. Canonical Hash Verification: Bảo toàn 100% SHA-256 baseline
 * 3. Grade Integrity: Kiểm tra các khối lớp "1", "4", "6"
 * 4. Schema & Structure Integrity: levelLabel, topics, vocab, sentencePatterns, readingPassages
 * 5. Cardinality & Statistics: Đếm chính xác số lượng topics và từ vựng
 * 6. Representative Content: Mẫu dữ liệu đại diện cho từng khối lớp
 * 7. Public Contract & Backward Compatibility: Tương thích với js/english_data.js và global bindings
 * 8. Integration with Question Generators: Tích hợp mượt mà với generateEnglishQuestions, generateIoeQuestions, generateEnglishFullExam
 */

const crypto = require('crypto');
const englishCourseDataModule = require('../../js/core/english-course-data.js');
const englishDataModule = require('../../js/english_data.js');

const CANONICAL_BASELINE_HASH = '6685330955f6ad92c022d0ff8bf3061d21fd93b4e7f4b4732e8215fc6bf7e645';

describe('English Course Data Boundary (js/core/english-course-data.js)', () => {
    
    // 1. Existence & Module Loading
    describe('1. Existence & Module Loading', () => {
        test('module export object hợp lệ chứa ENGLISH_COURSE_DATA', () => {
            expect(englishCourseDataModule).toBeDefined();
            expect(englishCourseDataModule.ENGLISH_COURSE_DATA).toBeDefined();
            expect(typeof englishCourseDataModule.ENGLISH_COURSE_DATA).toBe('object');
        });

        test('global bindings tồn tại trên globalThis/window', () => {
            expect(globalThis.ENGLISH_COURSE_DATA).toBeDefined();
            expect(globalThis.EnglishCourseData).toBeDefined();
        });
    });

    // 2. Canonical Hash Verification
    describe('2. Canonical Hash Verification', () => {
        test('SHA-256 hash của ENGLISH_COURSE_DATA khớp 100% với baseline characterization snapshot', () => {
            const json = JSON.stringify(englishCourseDataModule.ENGLISH_COURSE_DATA);
            const hash = crypto.createHash('sha256').update(json).digest('hex');
            expect(hash).toBe(CANONICAL_BASELINE_HASH);
        });

        test('Dữ liệu nạp từ js/english_data.js khớp 100% với js/core/english-course-data.js', () => {
            const json1 = JSON.stringify(englishCourseDataModule.ENGLISH_COURSE_DATA);
            const json2 = JSON.stringify(englishDataModule.ENGLISH_COURSE_DATA);
            expect(json1).toBe(json2);
        });
    });

    // 3. Grade Integrity
    describe('3. Grade Integrity', () => {
        test('Chứa chính xác 3 khối lớp chuẩn: "1", "4", "6"', () => {
            const data = englishCourseDataModule.ENGLISH_COURSE_DATA;
            const grades = Object.keys(data);
            expect(grades).toContain('1');
            expect(grades).toContain('4');
            expect(grades).toContain('6');
            expect(grades.length).toBe(3);
        });

        test('Mỗi khối lớp đều có levelLabel mô tả rõ ràng', () => {
            const data = englishCourseDataModule.ENGLISH_COURSE_DATA;
            expect(data['1'].levelLabel).toBe('Starters & Lớp 2 Nâng cao');
            expect(data['4'].levelLabel).toBe('Movers & Lớp 5 Nâng cao');
            expect(data['6'].levelLabel).toBe('KET / PET & Lớp 7 Nâng cao');
        });
    });

    // 4. Schema & Structure Integrity
    describe('4. Schema & Structure Integrity', () => {
        test('Tất cả các topics đều có id, title và danh sách vocab hợp lệ', () => {
            const data = englishCourseDataModule.ENGLISH_COURSE_DATA;
            for (const grade of ['1', '4', '6']) {
                const gradeData = data[grade];
                expect(Array.isArray(gradeData.topics)).toBe(true);
                expect(gradeData.topics.length).toBeGreaterThan(0);

                gradeData.topics.forEach((topic, idx) => {
                    expect(topic.id).toBeDefined();
                    expect(typeof topic.id).toBe('string');
                    expect(topic.title).toBeDefined();
                    expect(typeof topic.title).toBe('string');
                    expect(Array.isArray(topic.vocab)).toBe(true);
                    expect(topic.vocab.length).toBeGreaterThan(0);

                    // Kiểm tra từng từ vựng
                    topic.vocab.forEach(v => {
                        expect(v.word).toBeDefined();
                        expect(v.translation).toBeDefined();
                        expect(typeof v.word).toBe('string');
                        expect(typeof v.translation).toBe('string');
                    });

                    // Kiểm tra mẫu câu nếu có
                    if (topic.sentencePatterns) {
                        expect(Array.isArray(topic.sentencePatterns)).toBe(true);
                        topic.sentencePatterns.forEach(sp => {
                            expect(sp.pattern || sp.english).toBeDefined();
                            expect(sp.vietnamese).toBeDefined();
                        });
                    }
                });
            }
        });
    });

    // 5. Cardinality & Statistics
    describe('5. Cardinality & Statistics', () => {
        test('Số lượng Units/Topics và Tổng số Từ vựng đạt chuẩn kiểm định', () => {
            const data = englishCourseDataModule.ENGLISH_COURSE_DATA;
            
            // Lớp 1 (20 units)
            expect(data['1'].topics.length).toBe(20);
            const vocabCount1 = data['1'].topics.reduce((acc, t) => acc + t.vocab.length, 0);
            expect(vocabCount1).toBeGreaterThanOrEqual(60);

            // Lớp 4 (20 units)
            expect(data['4'].topics.length).toBe(20);
            const vocabCount4 = data['4'].topics.reduce((acc, t) => acc + t.vocab.length, 0);
            expect(vocabCount4).toBeGreaterThanOrEqual(100);

            // Lớp 6 (22 units)
            expect(data['6'].topics.length).toBe(22);
            const vocabCount6 = data['6'].topics.reduce((acc, t) => acc + t.vocab.length, 0);
            expect(vocabCount6).toBeGreaterThanOrEqual(140);
        });
    });

    // 6. Representative Content Samples
    describe('6. Representative Content Samples', () => {
        test('Lớp 1 Topic 1 (eng1-t1): In the school playground', () => {
            const t1 = englishCourseDataModule.ENGLISH_COURSE_DATA['1'].topics[0];
            expect(t1.id).toBe('eng1-t1');
            expect(t1.title).toBe('Unit 1: In the school playground');
            expect(t1.vocab.map(v => v.word.toLowerCase())).toContain('ball');
            expect(t1.vocab.map(v => v.word.toLowerCase())).toContain('book');
            expect(t1.vocab.map(v => v.word.toLowerCase())).toContain('bike');
        });

        test('Lớp 4 Topic 1 (eng4-t1): My friends', () => {
            const t1 = englishCourseDataModule.ENGLISH_COURSE_DATA['4'].topics[0];
            expect(t1.id).toBe('eng4-t1');
            expect(t1.title).toBe('Unit 1: My friends');
            expect(t1.vocab.map(v => v.word.toLowerCase())).toContain('america');
            expect(t1.vocab.map(v => v.word.toLowerCase())).toContain('australia');
        });

        test('Lớp 6 Topic 1 (eng6-t1): My New School', () => {
            const t1 = englishCourseDataModule.ENGLISH_COURSE_DATA['6'].topics[0];
            expect(t1.id).toBe('eng6-t1');
            expect(t1.title).toBe('Unit 1: My New School');
            expect(t1.vocab.map(v => v.word.toLowerCase())).toContain('calculator');
            expect(t1.vocab.map(v => v.word.toLowerCase())).toContain('compass');
            expect(t1.readingPassage).toBeDefined();
            expect(t1.questions.reading.length).toBeGreaterThanOrEqual(3);
        });
    });

    // 7. Integration with Question Generators
    describe('7. Integration with Question Generators', () => {
        test('generateEnglishQuestions() sinh đúng 15 câu hỏi đa kỹ năng', () => {
            const readingQs = englishDataModule.generateEnglishQuestions('6', 'eng6-t1', 'reading');
            expect(Array.isArray(readingQs)).toBe(true);
            expect(readingQs.length).toBe(15);

            const listeningQs = englishDataModule.generateEnglishQuestions('6', 'eng6-t1', 'listening');
            expect(Array.isArray(listeningQs)).toBe(true);
            expect(listeningQs.length).toBe(15);

            const writingQs = englishDataModule.generateEnglishQuestions('6', 'eng6-t1', 'writing');
            expect(Array.isArray(writingQs)).toBe(true);
            expect(writingQs.length).toBe(15);
        });

        test('generateIoeQuestions() sinh đúng 20 câu hỏi Olympic IOE', () => {
            const ioeQs = englishDataModule.generateIoeQuestions('6', 'eng6-t1');
            expect(Array.isArray(ioeQs)).toBe(true);
            expect(ioeQs.length).toBe(20);
        });

        test('generateEnglishFullExam() sinh đúng 10 câu hỏi đề thi tổng hợp', () => {
            const examQs = englishDataModule.generateEnglishFullExam({ classLevel: '6', detail: 'eng6-t1' });
            expect(Array.isArray(examQs)).toBe(true);
            expect(examQs.length).toBe(10);
        });
    });
});
