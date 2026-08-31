const fs = require('fs');
const path = require('path');
const vm = require('vm');

const questionsV3Path = path.join(__dirname, '../js/questions-v3.js');

describe("Unit Tests for Grade 6 Math Generator (js/questions-v3.js)", () => {
    let questions;

    beforeAll(() => {
        try {
            questions = require('../js/questions-v3.js');
        } catch (e) {
            console.error("Lỗi khi load questions trong test:", e);
            throw e;
        }
    });

    test("Đối tượng questions phải được khởi tạo thành công", () => {
        expect(questions).toBeDefined();
        expect(typeof questions.shuffle).toBe('function');
        expect(typeof questions.randomInt).toBe('function');
    });

    describe("Kiểm tra hàm randomInt", () => {
        test("randomInt sinh số trong khoảng [min, max]", () => {
            for (let i = 0; i < 100; i++) {
                const val = questions.randomInt(5, 15);
                expect(val).toBeGreaterThanOrEqual(5);
                expect(val).toBeLessThanOrEqual(15);
            }
        });

        test("randomInt loại trừ số 0 khi excludeZero = true", () => {
            for (let i = 0; i < 100; i++) {
                const val = questions.randomInt(-5, 5, true);
                expect(val).not.toBe(0);
                expect(val).toBeGreaterThanOrEqual(-5);
                expect(val).toBeLessThanOrEqual(5);
            }
        });
    });

    describe("Kiểm tra phân phối đồng đều của thuật toán Shuffle (Fisher-Yates)", () => {
        test("Shuffle phân phối xác suất đồng đều (Không bị Answer Bias)", () => {
            const iterations = 10000;
            // Mảng 4 phần tử đại diện cho A, B, C, D
            // Ta đếm số lần mỗi phần tử ban đầu (0, 1, 2, 3) kết thúc ở mỗi vị trí sau khi shuffle
            const counts = [
                [0, 0, 0, 0], // counts[i][j]: số lần phần tử i kết thúc ở vị trí j
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];

            for (let k = 0; k < iterations; k++) {
                const arr = [0, 1, 2, 3];
                questions.shuffle(arr);
                
                // Ghi nhận vị trí mới
                for (let j = 0; j < 4; j++) {
                    const originalVal = arr[j];
                    counts[originalVal][j]++;
                }
            }

            // Tỷ lệ mong muốn cho mỗi vị trí là 25% (0.25)
            // Sai số cho phép (tolerance) là 3% (0.03) cho 10,000 lần lặp
            const expectedRatio = 0.25;
            const tolerance = 0.03;

            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    const ratio = counts[i][j] / iterations;
                    expect(ratio).toBeGreaterThan(expectedRatio - tolerance);
                    expect(ratio).toBeLessThan(expectedRatio + tolerance);
                }
            }
        });
    });

    describe("Kiểm tra các hàm toán học phụ trợ & Short Answer Evaluator Compatibility", () => {
        test("getPrimeFactors phân tích đúng thừa số nguyên tố", () => {
            // ƯCLN/BCNN phụ trợ
            expect(questions.getPrimeFactors(12)).toEqual(["2^2", "3"]);
            expect(questions.getPrimeFactors(7)).toEqual(["7"]);
            expect(questions.getPrimeFactors(1)).toEqual(["1"]);
        });

        test("cleanAnswerForComparison chuẩn hóa chuỗi chính xác", () => {
            expect(typeof questions.cleanAnswerForComparison).toBe('function');
            expect(questions.cleanAnswerForComparison("A. 15 chiếc kẹo")).toBe("15");
            expect(questions.cleanAnswerForComparison("$30$ cm")).toBe("30");
            expect(questions.cleanAnswerForComparison("$30$ độ c")).toBe("30");
            expect(questions.cleanAnswerForComparison(null)).toBe("");
            expect(questions.cleanAnswerForComparison(123)).toBe("");
        });

        test("checkShortAnswer so khớp chính xác các trường hợp đúng và sai", () => {
            expect(typeof questions.checkShortAnswer).toBe('function');
            expect(questions.checkShortAnswer("15", "15")).toBe(true);
            expect(questions.checkShortAnswer("15 học sinh", "15")).toBe(true);
            expect(questions.checkShortAnswer("15", "25")).toBe(false);
            expect(questions.checkShortAnswer("{1; 2; 3}", "A = {1; 2; 3}")).toBe(true);
            expect(questions.checkShortAnswer("", "")).toBe(false);
            expect(questions.checkShortAnswer("15", "")).toBe(false);
        });
    });

    describe("Integration Tests — questions.finishPractice() Production Path & Safe XP Floor", () => {
        let mockElements = {};

        function createMockElement(id) {
            return {
                id,
                innerText: '',
                innerHTML: '',
                disabled: false,
                style: {},
                classList: {
                    add: jest.fn(),
                    remove: jest.fn(),
                    contains: jest.fn().mockReturnValue(false)
                }
            };
        }

        beforeEach(() => {
            mockElements = {
                "next-question-btn": createMockElement("next-question-btn"),
                "exam-timer-wrapper": createMockElement("exam-timer-wrapper"),
                "practice-progress": createMockElement("practice-progress"),
                "result-icon-emoji": createMockElement("result-icon-emoji"),
                "result-score-title": createMockElement("result-score-title"),
                "result-score-desc": createMockElement("result-score-desc"),
                "xp-earned-val": createMockElement("xp-earned-val"),
                "result-correct-count": createMockElement("result-correct-count"),
                "result-rank-badge": createMockElement("result-rank-badge"),
                "exam-review-box": createMockElement("exam-review-box"),
                "retry-practice-btn": createMockElement("retry-practice-btn")
            };

            global.window = global;
            global.document = {
                getElementById: (id) => mockElements[id] || createMockElement(id),
                body: {
                    classList: {
                        add: jest.fn(),
                        remove: jest.fn(),
                        contains: jest.fn().mockReturnValue(false)
                    }
                }
            };

            global.app = {
                state: {
                    xp: 0,
                    scores: {},
                    subtopicScores: {},
                    completedSubtopics: [],
                    examSessions: []
                },
                config: { studentName: 'Minh', parentName: 'Bố' },
                expandSidebar: jest.fn(),
                exitFullscreen: jest.fn(),
                restoreScrollbar: jest.fn(),
                saveQuestionResult: jest.fn(),
                saveLessonScore: jest.fn((lessonId, score, xpEarned) => {
                    global.app.state.xp += xpEarned;
                }),
                saveProgress: jest.fn(),
                checkAndReward100PercentLesson: jest.fn(),
                checkAndUnlockBadges: jest.fn(),
                updateHeaderStats: jest.fn(),
                logLearningTime: jest.fn(),
                updateLessonEvaluation: jest.fn(),
                renderLessonHistory: jest.fn(),
                confetti: { start: jest.fn() },
                audio: { playVictory: jest.fn(), playDefeat: jest.fn(), playBadge: jest.fn() }
            };
        });

        test("Production Path: initial XP = 0, 1 câu sai -> final XP = 0 (Không bị âm XP)", () => {
            global.app.state.xp = 0;
            questions.currentLesson = { id: 'bai-1', title: 'Bài 1' };
            questions.currentLevel = 'co-ban';
            questions.isExamMode = false;
            questions.isLessonExamMode = false;
            questions.isSubtopicPracticeMode = false;
            questions.practiceStartTime = Date.now();
            questions.currentQuestions = [
                { isShortAnswer: false, userSelectedIndex: 1, correctIndex: 0, type: 'mcq' } // 1 sai
            ];

            questions.finishPractice();

            // 1 sai trừ 10 XP nhưng có sàn chặn dưới -> xp = 0
            // Score = 0% (< 35%) -> xpEarned = 0 -> final XP = 0
            expect(global.app.state.xp).toBe(0);
        });

        test("Production Path: initial XP = 5, 1 câu sai -> final XP = 0 (Không bị âm XP)", () => {
            global.app.state.xp = 5;
            questions.currentLesson = { id: 'bai-1', title: 'Bài 1' };
            questions.currentLevel = 'co-ban';
            questions.isExamMode = false;
            questions.isLessonExamMode = false;
            questions.isSubtopicPracticeMode = false;
            questions.practiceStartTime = Date.now();
            questions.currentQuestions = [
                { isShortAnswer: false, userSelectedIndex: 1, correctIndex: 0, type: 'mcq' } // 1 sai
            ];

            questions.finishPractice();

            expect(global.app.state.xp).toBe(0);
        });

        test("Production Path: initial XP = 11, 1 câu sai -> final XP = 1", () => {
            global.app.state.xp = 11;
            questions.currentLesson = { id: 'bai-1', title: 'Bài 1' };
            questions.currentLevel = 'co-ban';
            questions.isExamMode = false;
            questions.isLessonExamMode = false;
            questions.isSubtopicPracticeMode = false;
            questions.practiceStartTime = Date.now();
            questions.currentQuestions = [
                { isShortAnswer: false, userSelectedIndex: 1, correctIndex: 0, type: 'mcq' } // 1 sai (0%)
            ];

            questions.finishPractice();

            expect(global.app.state.xp).toBe(1);
        });

        test("Production Path: initial XP = 50, 3 câu sai (và 0 câu đúng) -> final XP = 20", () => {
            global.app.state.xp = 50;
            questions.currentLesson = { id: 'bai-1', title: 'Bài 1' };
            questions.currentLevel = 'co-ban';
            questions.isExamMode = false;
            questions.isLessonExamMode = false;
            questions.isSubtopicPracticeMode = false;
            questions.practiceStartTime = Date.now();
            questions.currentQuestions = [
                { isShortAnswer: false, userSelectedIndex: 1, correctIndex: 0, type: 'mcq' },
                { isShortAnswer: false, userSelectedIndex: 2, correctIndex: 0, type: 'mcq' },
                { isShortAnswer: false, userSelectedIndex: 3, correctIndex: 0, type: 'mcq' }
            ];

            questions.finishPractice();

            // 50 - 3*10 = 20. Score = 0/3 (0%) -> xpEarned = 0 -> final XP = 20
            expect(global.app.state.xp).toBe(20);
        });

        test("Production Path: Tách biệt rõ ràng giữa Penalty và Reward", () => {
            // initial XP = 100
            // Làm bài 10 câu: 8 câu đúng, 2 câu sai
            // Penalty: 100 - 2*10 = 80 XP
            // Reward (Giỏi 80% level 'co-ban'): baseXp = 50 -> xpEarned = Math.round(50 * 0.8) = 40 XP
            // Final XP = 80 + 40 = 120 XP
            global.app.state.xp = 100;
            questions.currentLesson = { id: 'bai-1', title: 'Bài 1' };
            questions.currentLevel = 'co-ban';
            questions.isExamMode = false;
            questions.isLessonExamMode = false;
            questions.isSubtopicPracticeMode = false;
            questions.practiceStartTime = Date.now();
            questions.currentQuestions = [
                { isShortAnswer: false, userSelectedIndex: 0, correctIndex: 0, type: 'mcq' },
                { isShortAnswer: false, userSelectedIndex: 0, correctIndex: 0, type: 'mcq' },
                { isShortAnswer: false, userSelectedIndex: 0, correctIndex: 0, type: 'mcq' },
                { isShortAnswer: false, userSelectedIndex: 0, correctIndex: 0, type: 'mcq' },
                { isShortAnswer: false, userSelectedIndex: 0, correctIndex: 0, type: 'mcq' },
                { isShortAnswer: false, userSelectedIndex: 0, correctIndex: 0, type: 'mcq' },
                { isShortAnswer: false, userSelectedIndex: 0, correctIndex: 0, type: 'mcq' },
                { isShortAnswer: false, userSelectedIndex: 0, correctIndex: 0, type: 'mcq' },
                { isShortAnswer: false, userSelectedIndex: 1, correctIndex: 0, type: 'mcq' }, // sai 1
                { isShortAnswer: false, userSelectedIndex: 1, correctIndex: 0, type: 'mcq' }  // sai 2
            ];

            questions.finishPractice();

            expect(questions.correctCount).toBe(8);
            expect(mockElements["result-score-title"].innerText).toBe("Giỏi (80%)");
            expect(mockElements["result-icon-emoji"].innerText).toBe("🎉");
            expect(global.app.saveLessonScore).toHaveBeenCalledWith('bai-1', 80, 40, true, expect.any(Number), expect.any(Number));
            expect(global.app.state.xp).toBe(120);
        });
    });
});

