/**
 * @file math-practice-evaluator.test.js
 * Test suite kiểm thử toàn diện module MathPracticeEvaluator (js/core/math-practice-evaluator.js)
 * và xác thực quy tắc chặn dưới Safe XP Floor (XP >= 0).
 */

const evaluatorModule = require('../../js/core/math-practice-evaluator.js');
const { evaluatePracticeResult, applyXpPenalty } = evaluatorModule;

describe("MathPracticeEvaluator — Pure Math Practice Grader & Safe XP Floor Suite", () => {

    // 1. Module Loading & Existence
    describe("1. Module Loading & Existence", () => {
        test("Module export các hàm thuần túy cần thiết", () => {
            expect(evaluatorModule).toBeDefined();
            expect(typeof evaluatePracticeResult).toBe('function');
            expect(typeof applyXpPenalty).toBe('function');
        });

        test("Global binding MathPracticeEvaluator tồn tại trên globalThis", () => {
            expect(globalThis.MathPracticeEvaluator).toBeDefined();
            expect(typeof globalThis.MathPracticeEvaluator.evaluatePracticeResult).toBe('function');
        });
    });

    // 2. Score Percentage & Rank Boundaries
    describe("2. Score Percentage & Rank Boundaries (6 Cognitive Tiers)", () => {
        test("10/10 câu (100%) -> Xuất sắc (👑), Đỗ (isPassed = true), 100% baseXp", () => {
            const res = evaluatePracticeResult({ correctCount: 10, totalQuestions: 10, currentLevel: 'co-ban' });
            expect(res.scorePercent).toBe(100);
            expect(res.rank).toBe("Xuất sắc");
            expect(res.emoji).toBe("👑");
            expect(res.isPassed).toBe(true);
            expect(res.xpEarned).toBe(50); // 100% của 50
        });

        test("19/20 câu (95%) -> Xuất sắc (👑), Đỗ (isPassed = true)", () => {
            const res = evaluatePracticeResult({ correctCount: 19, totalQuestions: 20, currentLevel: 'nang-cao' });
            expect(res.scorePercent).toBe(95);
            expect(res.rank).toBe("Xuất sắc");
            expect(res.isPassed).toBe(true);
            expect(res.xpEarned).toBe(70); // 100% của 70
        });

        test("8/10 câu (80%) -> Giỏi (🎉), Đỗ (isPassed = true), 80% baseXp", () => {
            const res = evaluatePracticeResult({ correctCount: 8, totalQuestions: 10, currentLevel: 'co-ban' });
            expect(res.scorePercent).toBe(80);
            expect(res.rank).toBe("Giỏi");
            expect(res.emoji).toBe("🎉");
            expect(res.isPassed).toBe(true);
            expect(res.xpEarned).toBe(40); // 80% của 50 = 40
        });

        test("7/10 câu (70%) -> Khá (👍), Chưa đỗ (isPassed = false), 50% baseXp", () => {
            const res = evaluatePracticeResult({ correctCount: 7, totalQuestions: 10, currentLevel: 'co-ban' });
            expect(res.scorePercent).toBe(70);
            expect(res.rank).toBe("Khá");
            expect(res.emoji).toBe("👍");
            expect(res.isPassed).toBe(false);
            expect(res.xpEarned).toBe(25); // 50% của 50 = 25
        });

        test("5/10 câu (50%) -> Đạt (✍️), Chưa đỗ (isPassed = false), 30% baseXp", () => {
            const res = evaluatePracticeResult({ correctCount: 5, totalQuestions: 10, currentLevel: 'co-ban' });
            expect(res.scorePercent).toBe(50);
            expect(res.rank).toBe("Đạt");
            expect(res.emoji).toBe("✍️");
            expect(res.isPassed).toBe(false);
            expect(res.xpEarned).toBe(15); // 30% của 50 = 15
        });

        test("4/10 câu (40%) và 35% -> Yếu (📚), Chưa đỗ (isPassed = false), 10% baseXp", () => {
            const res = evaluatePracticeResult({ correctCount: 4, totalQuestions: 10, currentLevel: 'co-ban' });
            expect(res.scorePercent).toBe(40);
            expect(res.rank).toBe("Yếu");
            expect(res.emoji).toBe("📚");
            expect(res.isPassed).toBe(false);
            expect(res.xpEarned).toBe(5); // 10% của 50 = 5
        });

        test("3/10 câu (30%) (< 35%) -> Không đạt (❌), Chưa đỗ (isPassed = false), 0 XP", () => {
            const res = evaluatePracticeResult({ correctCount: 3, totalQuestions: 10, currentLevel: 'co-ban' });
            expect(res.scorePercent).toBe(30);
            expect(res.rank).toBe("Không đạt");
            expect(res.emoji).toBe("❌");
            expect(res.isPassed).toBe(false);
            expect(res.xpEarned).toBe(0);
        });

        test("0/10 câu (0%) -> Không đạt (❌), 0 XP", () => {
            const res = evaluatePracticeResult({ correctCount: 0, totalQuestions: 10, currentLevel: 'co-ban' });
            expect(res.scorePercent).toBe(0);
            expect(res.rank).toBe("Không đạt");
            expect(res.isPassed).toBe(false);
            expect(res.xpEarned).toBe(0);
        });
    });

    // 3. Difficulty Levels & Exam Mode Base XP
    describe("3. Difficulty Levels & Exam Mode Base XP", () => {
        test("Level 'co-ban' -> baseXp = 50", () => {
            const res = evaluatePracticeResult({ correctCount: 10, totalQuestions: 10, currentLevel: 'co-ban' });
            expect(res.baseXp).toBe(50);
            expect(res.xpEarned).toBe(50);
        });

        test("Level 'nang-cao' -> baseXp = 70", () => {
            const res = evaluatePracticeResult({ correctCount: 10, totalQuestions: 10, currentLevel: 'nang-cao' });
            expect(res.baseXp).toBe(70);
            expect(res.xpEarned).toBe(70);
        });

        test("Level 'kho' -> baseXp = 100", () => {
            const res = evaluatePracticeResult({ correctCount: 10, totalQuestions: 10, currentLevel: 'kho' });
            expect(res.baseXp).toBe(100);
            expect(res.xpEarned).toBe(100);
        });

        test("Level 'chat-luong-cao' -> baseXp = 150", () => {
            const res = evaluatePracticeResult({ correctCount: 10, totalQuestions: 10, currentLevel: 'chat-luong-cao' });
            expect(res.baseXp).toBe(150);
            expect(res.xpEarned).toBe(150);
        });

        test("Exam Mode (isExamMode: true) -> baseXp = 100 bất kể level", () => {
            const res = evaluatePracticeResult({ correctCount: 10, totalQuestions: 10, currentLevel: 'co-ban', isExamMode: true });
            expect(res.baseXp).toBe(100);
            expect(res.xpEarned).toBe(100);
        });

        test("Lesson Exam Mode (isLessonExamMode: true) -> baseXp = 100 bất kể level", () => {
            const res = evaluatePracticeResult({ correctCount: 10, totalQuestions: 10, currentLevel: 'chat-luong-cao', isLessonExamMode: true });
            expect(res.baseXp).toBe(100);
            expect(res.xpEarned).toBe(100);
        });
    });

    // 4. Safe XP Penalty & Floor Invariant (P1 Fix Verification)
    describe("4. Safe XP Penalty & Floor Invariant (XP >= 0)", () => {
        test("initial XP = 0, 1 câu sai -> final XP = 0 (không âm)", () => {
            const finalXp = applyXpPenalty(0, 1, 10);
            expect(finalXp).toBe(0);
        });

        test("initial XP = 5, 1 câu sai -> final XP = 0 (không âm)", () => {
            const finalXp = applyXpPenalty(5, 1, 10);
            expect(finalXp).toBe(0);
        });

        test("initial XP = 9, 1 câu sai -> final XP = 0 (không âm)", () => {
            const finalXp = applyXpPenalty(9, 1, 10);
            expect(finalXp).toBe(0);
        });

        test("initial XP = 10, 1 câu sai -> final XP = 0", () => {
            const finalXp = applyXpPenalty(10, 1, 10);
            expect(finalXp).toBe(0);
        });

        test("initial XP = 11, 1 câu sai -> final XP = 1", () => {
            const finalXp = applyXpPenalty(11, 1, 10);
            expect(finalXp).toBe(1);
        });

        test("initial XP = 0, 10 câu sai -> final XP = 0", () => {
            const finalXp = applyXpPenalty(0, 10, 10);
            expect(finalXp).toBe(0);
        });

        test("initial XP = 50, 3 câu sai -> final XP = 20", () => {
            const finalXp = applyXpPenalty(50, 3, 10);
            expect(finalXp).toBe(20);
        });

        test("initial XP = 100, 10 câu sai -> final XP = 0", () => {
            const finalXp = applyXpPenalty(100, 10, 10);
            expect(finalXp).toBe(0);
        });

        test("Tất cả các bộ số ngẫu nhiên đều đảm bảo invariant: finalXp >= 0", () => {
            for (let i = 0; i < 100; i++) {
                const randomInitialXp = Math.floor(Math.random() * 200);
                const randomWrongCount = Math.floor(Math.random() * 25);
                const finalXp = applyXpPenalty(randomInitialXp, randomWrongCount, 10);
                expect(finalXp).toBeGreaterThanOrEqual(0);
                expect(finalXp).toBe(Math.max(0, randomInitialXp - randomWrongCount * 10));
            }
        });
    });

    // 5. Text Customization & Descriptions
    describe("5. Text Customization & Descriptions", () => {
        test("Sử dụng đúng studentName và parentName trong lời nhận xét", () => {
            const res = evaluatePracticeResult({
                correctCount: 10,
                totalQuestions: 10,
                studentName: 'Minh',
                parentName: 'Bố Tuấn'
            });
            expect(res.desc).toContain('Tuyệt vời Minh!');
            expect(res.desc).toContain('Bố Tuấn thưởng cho con nhé!');
        });
    });
});
