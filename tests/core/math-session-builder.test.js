/**
 * MATH SESSION BUILDER UNIT TEST SUITE
 * Tests for js/core/math-session-builder.js
 */

const MathSessionBuilder = require('../../js/core/math-session-builder');

describe("MathSessionBuilder Unit Tests", () => {
    // 1. Module Export & Global Presence
    describe("Module Exports & UMD Interface", () => {
        test("Exposes buildSessionRecord and retainSessions functions", () => {
            expect(MathSessionBuilder).toBeDefined();
            expect(typeof MathSessionBuilder.buildSessionRecord).toBe('function');
            expect(typeof MathSessionBuilder.retainSessions).toBe('function');
        });
    });

    // 2. buildSessionRecord Tests
    describe("buildSessionRecord", () => {
        test("1. Standard session metadata is correctly constructed", () => {
            const result = MathSessionBuilder.buildSessionRecord({
                lesson: { id: "bai-1", title: "Tập hợp phần tử" },
                level: "co-ban",
                correctCount: 5,
                totalQuestions: 5,
                scorePercent: 100,
                timeSpent: 45,
                distractions: 0,
                questions: []
            });

            expect(result.id).toMatch(/^sess-\d+/);
            expect(result.lessonId).toBe("bai-1");
            expect(result.lessonTitle).toBe("Tập hợp phần tử");
            expect(result.level).toBe("co-ban");
            expect(result.isExam).toBe(false);
            expect(result.isLessonExam).toBe(false);
            expect(result.isSubtopicPractice).toBe(false);
            expect(result.isWeaknessPractice).toBe(false);
            expect(result.subtopicId).toBeNull();
            expect(result.subtopicTitle).toBeNull();
            expect(typeof result.date).toBe('string');
            expect(result.correctCount).toBe(5);
            expect(result.totalQuestions).toBe(5);
            expect(result.scorePercent).toBe(100);
            expect(result.timeSpent).toBe(45);
            expect(result.distractions).toBe(0);
            expect(result.questions).toEqual([]);
        });

        test("2. Exam flags (isExam, isLessonExam, isWeaknessPractice) are accurately preserved", () => {
            const examSession = MathSessionBuilder.buildSessionRecord({
                lesson: { id: "kt-c1", title: "Kiểm tra Chương 1" },
                isExam: true,
                isLessonExam: false,
                isSubtopicPractice: false
            });
            expect(examSession.isExam).toBe(true);
            expect(examSession.isLessonExam).toBe(false);

            const lessonExamSession = MathSessionBuilder.buildSessionRecord({
                lesson: { id: "bai-1", title: "Tập hợp phần tử" },
                isExam: false,
                isLessonExam: true
            });
            expect(lessonExamSession.isExam).toBe(false);
            expect(lessonExamSession.isLessonExam).toBe(true);

            const weaknessSession = MathSessionBuilder.buildSessionRecord({
                lesson: { id: "bai-1", title: "Tập hợp phần tử" },
                isWeaknessPractice: true
            });
            expect(weaknessSession.isWeaknessPractice).toBe(true);
        });

        test("3. Subtopic metadata is populated only when isSubtopicPractice is true", () => {
            const subtopicSession = MathSessionBuilder.buildSessionRecord({
                lesson: { id: "bai-1", title: "Tập hợp phần tử" },
                isSubtopicPractice: true,
                subtopic: { id: "bai-1-d1", title: "Dạng 1: Viết tập hợp" }
            });
            expect(subtopicSession.isSubtopicPractice).toBe(true);
            expect(subtopicSession.subtopicId).toBe("bai-1-d1");
            expect(subtopicSession.subtopicTitle).toBe("Dạng 1: Viết tập hợp");

            // Khi isSubtopicPractice = false thì subtopicId và subtopicTitle luôn là null
            const standardSession = MathSessionBuilder.buildSessionRecord({
                lesson: { id: "bai-1", title: "Tập hợp phần tử" },
                isSubtopicPractice: false,
                subtopic: { id: "bai-1-d1", title: "Dạng 1: Viết tập hợp" }
            });
            expect(standardSession.isSubtopicPractice).toBe(false);
            expect(standardSession.subtopicId).toBeNull();
            expect(standardSession.subtopicTitle).toBeNull();
        });

        test("4. MCQ question mapping preserves all 11 question properties", () => {
            const questions = [
                {
                    questionText: "Tính $2 + 3$",
                    options: ["4", "5", "6", "7"],
                    correctIndex: 1,
                    userSelectedIndex: 1,
                    isShortAnswer: false,
                    solutionHtml: "<p>Giải chi tiết: 2 + 3 = 5</p>",
                    tip: "Cộng hai số tự nhiên",
                    level: "co-ban",
                    type: "phep-cong-co-ban"
                }
            ];

            const result = MathSessionBuilder.buildSessionRecord({
                lesson: { id: "bai-1", title: "Bài 1" },
                questions: questions
            });

            expect(result.questions.length).toBe(1);
            const q = result.questions[0];
            expect(q.questionText).toBe("Tính $2 + 3$");
            expect(q.options).toEqual(["4", "5", "6", "7"]);
            expect(q.correctIndex).toBe(1);
            expect(q.userSelectedIndex).toBe(1);
            expect(q.isShortAnswer).toBe(false);
            expect(q.userShortAnswer).toBe("");
            expect(q.isCorrect).toBe(true);
            expect(q.solutionHtml).toBe("<p>Giải chi tiết: 2 + 3 = 5</p>");
            expect(q.tip).toBe("Cộng hai số tự nhiên");
            expect(q.level).toBe("co-ban");
            expect(q.type).toBe("phep-cong-co-ban");
        });

        test("5. MCQ answer mapping with incorrect answer sets isCorrect to false", () => {
            const questions = [
                {
                    questionText: "Tính $2 + 3$",
                    options: ["4", "5", "6", "7"],
                    correctIndex: 1,
                    userSelectedIndex: 0,
                    type: "t1"
                }
            ];

            const result = MathSessionBuilder.buildSessionRecord({
                lesson: { id: "bai-1", title: "Bài 1" },
                questions: questions
            });

            expect(result.questions[0].isCorrect).toBe(false);
        });

        test("6. Short-answer mapping evaluates correctness using custom checkShortAnswer function", () => {
            const mockCheckShortAnswer = jest.fn((userAns, correctAns) => userAns.trim() === correctAns.trim());

            const questions = [
                {
                    questionText: "Điền số phần tử của tập hợp A = {1; 2; 3}",
                    options: ["3"],
                    correctIndex: 0,
                    userSelectedIndex: null,
                    isShortAnswer: true,
                    userShortAnswer: "  3  ",
                    solutionHtml: "3 phần tử",
                    tip: "Đếm số",
                    level: "co-ban",
                    type: "tap-hop-d1"
                },
                {
                    questionText: "Điền số phần tử của B = {a, b}",
                    options: ["2"],
                    correctIndex: 0,
                    isShortAnswer: true,
                    userShortAnswer: "4",
                    type: "tap-hop-d1"
                }
            ];

            const result = MathSessionBuilder.buildSessionRecord({
                lesson: { id: "bai-1", title: "Bài 1" },
                questions: questions,
                checkShortAnswer: mockCheckShortAnswer
            });

            expect(mockCheckShortAnswer).toHaveBeenCalledTimes(2);
            expect(result.questions[0].isShortAnswer).toBe(true);
            expect(result.questions[0].userShortAnswer).toBe("  3  ");
            expect(result.questions[0].isCorrect).toBe(true);

            expect(result.questions[1].isShortAnswer).toBe(true);
            expect(result.questions[1].userShortAnswer).toBe("4");
            expect(result.questions[1].isCorrect).toBe(false);
        });

        test("7. Determinism: Custom timestamp, id, and date override dynamic generation", () => {
            const customId = "sess-custom-12345";
            const customDate = "2026-08-31T12:00:00.000Z";
            const customTimestamp = 1788177600000;

            const result = MathSessionBuilder.buildSessionRecord({
                id: customId,
                date: customDate,
                timestamp: customTimestamp,
                lesson: { id: "bai-1", title: "Bài 1" }
            });

            expect(result.id).toBe(customId);
            expect(result.date).toBe(customDate);
        });

        test("8. Distraction count and timeSpent fields are accurately stored", () => {
            const result = MathSessionBuilder.buildSessionRecord({
                lesson: { id: "bai-1", title: "Bài 1" },
                distractions: 4,
                timeSpent: 120
            });

            expect(result.distractions).toBe(4);
            expect(result.timeSpent).toBe(120);
        });

        test("9. Empty question list produces an empty questions array and default counts", () => {
            const result = MathSessionBuilder.buildSessionRecord({
                lesson: { id: "bai-empty", title: "Bài rỗng" },
                questions: []
            });

            expect(result.totalQuestions).toBe(0);
            expect(result.correctCount).toBe(0);
            expect(result.questions).toEqual([]);
        });

        test("10. Mixed MCQ and Short-Answer session maps all questions in original order", () => {
            const questions = [
                { questionText: "Q1 MCQ", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 0, isShortAnswer: false },
                { questionText: "Q2 Short", options: ["10"], correctIndex: 0, isShortAnswer: true, userShortAnswer: "10" },
                { questionText: "Q3 MCQ", options: ["X", "Y"], correctIndex: 1, userSelectedIndex: 0, isShortAnswer: false }
            ];

            const result = MathSessionBuilder.buildSessionRecord({
                lesson: { id: "bai-mix", title: "Bài hỗn hợp" },
                questions: questions
            });

            expect(result.questions.length).toBe(3);
            expect(result.questions[0].questionText).toBe("Q1 MCQ");
            expect(result.questions[0].isCorrect).toBe(true);
            expect(result.questions[1].questionText).toBe("Q2 Short");
            expect(result.questions[1].isCorrect).toBe(true);
            expect(result.questions[2].questionText).toBe("Q3 MCQ");
            expect(result.questions[2].isCorrect).toBe(false);
        });
    });

    // 3. retainSessions Tests
    describe("retainSessions", () => {
        test("11. Retention below limit (e.g. 5 < 150) retains all sessions", () => {
            const sessions = [
                { id: "s1" },
                { id: "s2" },
                { id: "s3" },
                { id: "s4" },
                { id: "s5" }
            ];

            const retained = MathSessionBuilder.retainSessions(sessions, 150);
            expect(retained.length).toBe(5);
            expect(retained.map(s => s.id)).toEqual(["s1", "s2", "s3", "s4", "s5"]);
        });

        test("12. Retention at exact limit (150 == 150) retains all 150 sessions", () => {
            const sessions = Array.from({ length: 150 }, (_, i) => ({ id: `s${i + 1}` }));

            const retained = MathSessionBuilder.retainSessions(sessions, 150);
            expect(retained.length).toBe(150);
            expect(retained[0].id).toBe("s1");
            expect(retained[149].id).toBe("s150");
        });

        test("13. Retention above limit (e.g. 152 > 150) evicts oldest sessions (FIFO)", () => {
            const sessions = Array.from({ length: 152 }, (_, i) => ({ id: `s${i + 1}` }));

            const retained = MathSessionBuilder.retainSessions(sessions, 150);
            expect(retained.length).toBe(150);
            // s1 và s2 bị đẩy bỏ
            expect(retained[0].id).toBe("s3");
            expect(retained[149].id).toBe("s152");
        });

        test("14. Custom retention limit works as expected", () => {
            const sessions = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }];

            const retained = MathSessionBuilder.retainSessions(sessions, 2);
            expect(retained.length).toBe(2);
            expect(retained.map(s => s.id)).toEqual(["c", "d"]);
        });

        test("15. Input immutability: retainSessions does not mutate original array", () => {
            const sessions = [{ id: "1" }, { id: "2" }, { id: "3" }];
            const originalLength = sessions.length;

            const retained = MathSessionBuilder.retainSessions(sessions, 2);
            expect(sessions.length).toBe(originalLength);
            expect(retained).not.toBe(sessions);
        });

        test("16. Edge cases: null, undefined, or non-array inputs return empty array", () => {
            expect(MathSessionBuilder.retainSessions(null)).toEqual([]);
            expect(MathSessionBuilder.retainSessions(undefined)).toEqual([]);
            expect(MathSessionBuilder.retainSessions("invalid")).toEqual([]);
            expect(MathSessionBuilder.retainSessions({})).toEqual([]);
        });
    });
});
