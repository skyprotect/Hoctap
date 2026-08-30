const fs = require('fs');
const path = require('path');
const QuestionEngine = require('../js/engine/question-engine');

describe("Unit & Integration Tests for QuestionEngine (v3.0)", () => {
    test("QuestionEngine phải được khởi tạo thành công", () => {
        expect(QuestionEngine).toBeDefined();
        expect(typeof QuestionEngine.generateQuestion).toBe('function');
        expect(typeof QuestionEngine.generateExam).toBe('function');
        expect(typeof QuestionEngine.shuffle).toBe('function');
        expect(typeof QuestionEngine.randomInt).toBe('function');
        expect(typeof QuestionEngine.getPrimeFactors).toBe('function');
    });

    test("randomInt sinh số trong khoảng hợp lệ và hỗ trợ excludeZero", () => {
        for (let i = 0; i < 50; i++) {
            const v = QuestionEngine.randomInt(10, 20);
            expect(v).toBeGreaterThanOrEqual(10);
            expect(v).toBeLessThanOrEqual(20);
        }
        for (let i = 0; i < 50; i++) {
            const v = QuestionEngine.randomInt(-5, 5, true);
            expect(v).not.toBe(0);
        }
    });

    test("Các hàm số học gcd, lcm, isPrime, getDivisors tính đúng", () => {
        expect(QuestionEngine.gcd(12, 18)).toBe(6);
        expect(QuestionEngine.lcm(4, 6)).toBe(12);
        expect(QuestionEngine.isPrime(7)).toBe(true);
        expect(QuestionEngine.isPrime(9)).toBe(false);
        expect(QuestionEngine.getDivisors(12)).toEqual([1, 2, 3, 4, 6, 12]);
        expect(QuestionEngine.getPrimeFactors(12)).toEqual(["2^2", "3"]);
    });

    describe("Kiểm tra nạp và sinh đề cho 5 file JSON Chương Toán Lớp 6", () => {
        const grade6Dir = path.join(__dirname, '../data/math/grade6');
        const chapterFiles = [
            'chapter1_integers.json',
            'chapter2_fractions.json',
            'chapter3_geometry.json',
            'chapter4_statistics.json',
            'chapter5_ratios.json'
        ];

        chapterFiles.forEach(file => {
            test(`Nạp và sinh đề thành công từ ${file}`, () => {
                const filePath = path.join(grade6Dir, file);
                expect(fs.existsSync(filePath)).toBe(true);

                const raw = fs.readFileSync(filePath, 'utf8');
                const json = JSON.parse(raw);

                expect(json.metadata).toBeDefined();
                expect(Array.isArray(json.templates)).toBe(true);
                expect(json.templates.length).toBeGreaterThanOrEqual(20);

                // Đăng ký và sinh thử 10 câu
                QuestionEngine.registerChapter(file.replace('.json', ''), json);
                const exam = QuestionEngine.generateExam(json, 10, 'co-ban');
                expect(exam.length).toBe(10);

                // Kiểm tra thuộc tính từng câu hỏi
                exam.forEach(q => {
                    expect(q.questionText).toBeTruthy();
                    expect(Array.isArray(q.options)).toBe(true);
                    expect(q.options.length).toBe(4);
                    expect(q.correctIndex).toBeGreaterThanOrEqual(0);
                    expect(q.correctIndex).toBeLessThan(4);
                    expect(q.solutionHtml).toBeTruthy();

                    // Kiểm tra không có NaN hoặc undefined
                    expect(q.questionText).not.toContain('NaN');
                    expect(q.questionText).not.toContain('undefined');
                    q.options.forEach(opt => {
                        expect(opt).not.toContain('NaN');
                        expect(opt).not.toContain('undefined');
                    });
                });
            });
        });
    });
});
