/**
 * MATH PRACTICE LIFECYCLE CHARACTERIZATION TEST SUITE
 * HocTap System (v13.92)
 * 
 * Mục tiêu: Khóa chặt (freeze) toàn bộ behavior hiện tại của questions.finishPractice():
 * - A: Standard Practice — First Attempt (Điểm, Rank, XP, scores, levelScores, history)
 * - B: Standard Practice — Repeat Attempt & XP Penalty / Safe Floor (prevScore > 0, xpEarned = 0, penalty)
 * - C: Subtopic Practice Mode (completedSubtopics, subtopicScores, xp accumulation)
 * - D: 100% Completion Reward & Idempotency (checkAndReward100PercentLesson)
 * - E: Chapter / Lesson Exam Modes (isExamMode, isLessonExamMode, badge unlock, levelScores skip)
 * - F: Session Record Shape & Integrity (examSessions detail)
 * - G: Session Retention Limit (150 sessions FIFO eviction)
 * - H: saveProgress Invocations Characterization (Call count tracking)
 * - I: UI, Audio & Guard Side Effects (isGraded, button lock, confetti, victory/defeat sound)
 */

const path = require('path');

// Nạp các mô-đun toán học thuần túy
const MathUtils = require('../js/core/math-utils');
const MathExprEvaluator = require('../js/core/math-expr-evaluator');
const MathAnswerEvaluator = require('../js/core/math-answer-evaluator');
const MathPracticeEvaluator = require('../js/core/math-practice-evaluator');

// Đăng ký toàn cục để questions-v3 và các module nhận diện
globalThis.MathUtils = MathUtils;
globalThis.MathExprEvaluator = MathExprEvaluator;
globalThis.MathAnswerEvaluator = MathAnswerEvaluator;
globalThis.MathPracticeEvaluator = MathPracticeEvaluator;

const questions = require('../js/questions-v3');

describe("Math Practice Lifecycle Characterization Suite (questions.finishPractice)", () => {
    let mockApp;
    let mockDom;
    let saveProgressCalls;
    let unlockedBadges;

    // Thiết lập DOM & Mock App giả lập sát thực tế trước mỗi bài test
    beforeEach(() => {
        saveProgressCalls = [];
        unlockedBadges = [];

        // 1. Mock DOM Elements tối thiểu mà finishPractice() tương tác
        mockDom = {
            nextBtn: { disabled: false, innerHTML: '', classList: { add: jest.fn(), remove: jest.fn() } },
            examTimerWrapper: { classList: { add: jest.fn(), remove: jest.fn() } },
            practiceProgress: { style: { width: '0%' } },
            resultIconEmoji: { innerText: '' },
            resultScoreTitle: { innerText: '' },
            resultScoreDesc: { innerText: '' },
            xpEarnedVal: { innerText: '' },
            resultCorrectCount: { innerText: '' },
            resultRankBadge: { innerText: '', style: { backgroundColor: '', color: '' } },
            examReviewBox: { classList: { add: jest.fn(), remove: jest.fn() } },
            retryPracticeBtn: { innerHTML: '' },
            practiceActiveBox: { classList: { add: jest.fn(), remove: jest.fn() } },
            practiceResultBox: { classList: { add: jest.fn(), remove: jest.fn() } },
            body: { classList: { add: jest.fn(), remove: jest.fn() } }
        };

        globalThis.document = {
            body: mockDom.body,
            getElementById: jest.fn((id) => {
                switch (id) {
                    case 'next-question-btn': return mockDom.nextBtn;
                    case 'exam-timer-wrapper': return mockDom.examTimerWrapper;
                    case 'practice-progress': return mockDom.practiceProgress;
                    case 'result-icon-emoji': return mockDom.resultIconEmoji;
                    case 'result-score-title': return mockDom.resultScoreTitle;
                    case 'result-score-desc': return mockDom.resultScoreDesc;
                    case 'xp-earned-val': return mockDom.xpEarnedVal;
                    case 'result-correct-count': return mockDom.resultCorrectCount;
                    case 'result-rank-badge': return mockDom.resultRankBadge;
                    case 'exam-review-box': return mockDom.examReviewBox;
                    case 'retry-practice-btn': return mockDom.retryPracticeBtn;
                    case 'practice-active-box': return mockDom.practiceActiveBox;
                    case 'practice-result-box': return mockDom.practiceResultBox;
                    default: return { classList: { add: jest.fn(), remove: jest.fn() }, style: {} };
                }
            })
        };

        // 2. Mock COURSE_DATA cho bài toán kiểm tra 100%
        globalThis.COURSE_DATA = [
            {
                id: "chuong-1",
                lessons: [
                    {
                        id: "bai-1",
                        title: "Tập hợp phần tử",
                        subtopics: [
                            { id: "bai-1-d1", title: "Dạng 1", questionType: "tap-hop-d1" },
                            { id: "bai-1-d2", title: "Dạng 2", questionType: "tap-hop-d2" }
                        ]
                    },
                    {
                        id: "bai-simple",
                        title: "Bài học đơn",
                        subtopics: []
                    },
                    {
                        id: "kt-c1",
                        title: "Kiểm tra Chương 1",
                        subtopics: []
                    },
                    {
                        id: "kt-c2",
                        title: "Kiểm tra Chương 2",
                        subtopics: []
                    }
                ]
            }
        ];

        // 3. Mock App với production methods logic
        mockApp = {
            config: {
                studentName: 'Trần Bình Minh',
                parentName: 'Bố'
            },
            state: {
                xp: 100,
                scores: {},
                levelScores: {},
                subtopicScores: {},
                completedSubtopics: [],
                examSessions: [],
                history: [],
                rewarded100PercentLessons: []
            },
            audio: {
                playVictory: jest.fn(),
                playDefeat: jest.fn(),
                playBadge: jest.fn()
            },
            confetti: {
                start: jest.fn()
            },
            expandSidebar: jest.fn(),
            exitFullscreen: jest.fn(),
            restoreScrollbar: jest.fn(),
            updateHeaderStats: jest.fn(),
            updateLessonEvaluation: jest.fn(),
            renderLessonHistory: jest.fn(),
            logLearningTime: jest.fn(),

            // Production logic của saveProgress
            saveProgress: jest.fn(function() {
                saveProgressCalls.push({
                    xp: this.state.xp,
                    scores: { ...this.state.scores },
                    levelScores: { ...this.state.levelScores },
                    subtopicScores: { ...this.state.subtopicScores },
                    sessionsCount: (this.state.examSessions || []).length
                });
            }),

            // Production logic của unlockBadge
            unlockBadge: jest.fn(function(badgeName) {
                unlockedBadges.push(badgeName);
                this.saveProgress();
            }),

            // Production logic của checkAndUnlockBadges
            checkAndUnlockBadges: jest.fn(function(lessonId, score, timeSpent, prevScore, distractions) {
                // Mock ghi nhận mở khóa huy hiệu
            }),

            // Production logic của saveLessonScore (js/app.js:6377)
            saveLessonScore: function(lessonId, score, xpEarned, isPassed, timeSpent = 9999, distractions = 0) {
                const prevScore = this.state.scores[lessonId] || 0;
                if (score > prevScore) {
                    this.state.scores[lessonId] = score;
                }

                // Không cộng XP nếu đã từng làm bài này rồi (prevScore > 0)
                if (prevScore > 0) {
                    xpEarned = 0;
                }
                this.state.xp += xpEarned;

                this.logLearningTime(10);
                this.checkAndUnlockBadges(lessonId, score, timeSpent, prevScore, distractions);
                this.saveProgress();
                this.updateHeaderStats();
            },

            // Production logic của checkAndReward100PercentLesson (js/app.js:6414)
            checkAndReward100PercentLesson: function(lessonId, subject = 'math') {
                this.state.rewarded100PercentLessons = this.state.rewarded100PercentLessons || [];
                if (this.state.rewarded100PercentLessons.includes(lessonId)) return;

                if (subject === 'math') {
                    let lesson = null;
                    if (typeof globalThis.COURSE_DATA !== 'undefined') {
                        for (const chapter of globalThis.COURSE_DATA) {
                            const found = chapter.lessons.find(l => l.id === lessonId);
                            if (found) {
                                lesson = found;
                                break;
                            }
                        }
                    }
                    if (!lesson) return;

                    const subtopics = lesson.subtopics || [];
                    if (subtopics.length > 0) {
                        const all100Percent = subtopics.every(sub => (this.state.subtopicScores && this.state.subtopicScores[sub.id]) === 100);
                        if (all100Percent) {
                            this.state.rewarded100PercentLessons.push(lessonId);
                            this.state.xp = (this.state.xp || 0) + 100;
                            this.saveProgress();
                        }
                    } else {
                        const has100Percent = (this.state.scores && this.state.scores[lessonId]) === 100;
                        if (has100Percent) {
                            this.state.rewarded100PercentLessons.push(lessonId);
                            this.state.xp = (this.state.xp || 0) + 100;
                            this.saveProgress();
                        }
                    }
                }
            },

            // Production logic của saveQuestionResult (js/app.js:6631)
            saveQuestionResult: function(lessonId, questionType, isCorrect, skipSave = false) {
                if (!this.state.history) {
                    this.state.history = [];
                }
                this.state.history.push({
                    date: new Date().toISOString(),
                    lessonId: lessonId,
                    questionType: questionType,
                    isCorrect: isCorrect
                });
                if (this.state.history.length > 200) {
                    this.state.history.shift();
                }
                if (!skipSave) {
                    this.saveProgress();
                }
            }
        };

        globalThis.app = mockApp;
        globalThis.window = {
            app: mockApp,
            questions: questions
        };

        // Reset trạng thái questions-v3
        questions.isGraded = false;
        questions.correctCount = 0;
        questions.practiceStartTime = Date.now() - 30000; // 30s
        questions.practiceDistractions = 0;
        questions.practiceMode = 'standard';
        questions.isExamMode = false;
        questions.isLessonExamMode = false;
        questions.isSubtopicPracticeMode = false;
        questions.isWeaknessPracticeMode = false;
        questions.currentLesson = { id: 'bai-1', title: 'Tập hợp phần tử' };
        questions.currentSubtopic = null;
        questions.currentLevel = 'co-ban';
        questions.currentQuestions = [];
    });

    // =========================================================================
    // A. STANDARD PRACTICE — FIRST ATTEMPT
    // =========================================================================
    describe("A. Standard Practice — First Attempt Characterization", () => {
        test("Hoàn thành bài tập 5/5 câu đúng: Cập nhật đúng điểm số, rank, XP, levelScores, history và session", () => {
            mockApp.state.xp = 50;
            mockApp.state.scores = {};
            mockApp.state.levelScores = {};

            questions.currentLesson = { id: 'bai-1', title: 'Tập hợp phần tử' };
            questions.currentLevel = 'co-ban';
            questions.currentQuestions = [
                { questionText: "Câu 1", options: ["A", "B", "C", "D"], correctIndex: 0, userSelectedIndex: 0, type: "tap-hop-d1", level: "co-ban" },
                { questionText: "Câu 2", options: ["1", "2", "3", "4"], correctIndex: 1, userSelectedIndex: 1, type: "tap-hop-d1", level: "co-ban" },
                { questionText: "Câu 3", options: ["X", "Y", "Z", "W"], correctIndex: 2, userSelectedIndex: 2, type: "tap-hop-d1", level: "co-ban" },
                { questionText: "Câu 4", options: ["M", "N", "P", "Q"], correctIndex: 3, userSelectedIndex: 3, type: "tap-hop-d1", level: "co-ban" },
                { questionText: "Câu 5 (Short)", options: ["15"], correctIndex: 0, isShortAnswer: true, userShortAnswer: "15", type: "tap-hop-d1", level: "co-ban" }
            ];

            // Action
            questions.finishPractice();

            // Assertions
            expect(questions.isGraded).toBe(true);
            expect(questions.correctCount).toBe(5);

            // Giao diện DOM
            expect(mockDom.resultScoreTitle.innerText).toContain("100%");
            expect(mockDom.resultRankBadge.innerText).toBe("Xuất sắc");
            expect(mockDom.xpEarnedVal.innerText).toBe(50);
            expect(mockDom.resultCorrectCount.innerText).toBe("5/5");

            // State mutations
            expect(mockApp.state.scores['bai-1']).toBe(100);
            expect(mockApp.state.levelScores['bai-1_co-ban']).toBe(100);
            expect(mockApp.state.xp).toBe(100); // 50 ban đầu + 50 xpEarned

            // History
            expect(mockApp.state.history.length).toBe(5);
            expect(mockApp.state.history.every(h => h.isCorrect === true)).toBe(true);

            // Audio & Confetti
            expect(mockApp.audio.playVictory).toHaveBeenCalledTimes(1);
            expect(mockApp.audio.playDefeat).not.toHaveBeenCalled();
            expect(mockApp.confetti.start).toHaveBeenCalledTimes(1);
            expect(mockApp.audio.playBadge).toHaveBeenCalledTimes(1);
        });

        test("Hoàn thành bài tập không đạt (< 80%): Phát âm thanh thất bại và đổi màu badge Danger", () => {
            mockApp.state.xp = 100;
            questions.currentLesson = { id: 'bai-1', title: 'Tập hợp phần tử' };
            questions.currentLevel = 'co-ban';
            questions.currentQuestions = [
                { questionText: "Câu 1", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 0, type: "tap-hop-d1" },
                { questionText: "Câu 2", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 1, type: "tap-hop-d1" }, // Sai (-10 XP)
                { questionText: "Câu 3", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 1, type: "tap-hop-d1" }, // Sai (-10 XP)
                { questionText: "Câu 4", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 1, type: "tap-hop-d1" }, // Sai (-10 XP)
                { questionText: "Câu 5", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 1, type: "tap-hop-d1" }  // Sai (-10 XP)
            ];

            questions.finishPractice();

            expect(questions.correctCount).toBe(1);
            expect(mockDom.resultScoreTitle.innerText).toContain("20%");
            expect(mockDom.resultRankBadge.innerText).toBe("Không đạt");
            expect(mockDom.resultRankBadge.style.backgroundColor).toBe("var(--danger-bg)");
            expect(mockDom.resultRankBadge.style.color).toBe("var(--danger)");

            expect(mockApp.audio.playDefeat).toHaveBeenCalledTimes(1);
            expect(mockApp.audio.playVictory).not.toHaveBeenCalled();
            expect(mockApp.confetti.start).not.toHaveBeenCalled();

            // 100 - (4 * 10) = 60 + 0 (xpEarned vì không pass) = 60
            expect(mockApp.state.xp).toBe(60);
        });
    });

    // =========================================================================
    // B. STANDARD PRACTICE — REPEAT ATTEMPT & XP PENALTY / FLOOR
    // =========================================================================
    describe("B. Standard Practice — Repeat Attempt & XP Invariants", () => {
        test("Khi đã có prevScore > 0, xpEarned trở thành 0 và bị trừ XP nếu làm sai câu", () => {
            mockApp.state.scores['bai-1'] = 80;
            mockApp.state.xp = 200;

            questions.currentLesson = { id: 'bai-1', title: 'Tập hợp phần tử' };
            questions.currentLevel = 'co-ban';
            questions.currentQuestions = [
                { questionText: "Câu 1", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 0, type: "tap-hop-d1" },
                { questionText: "Câu 2", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 0, type: "tap-hop-d1" },
                { questionText: "Câu 3", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 0, type: "tap-hop-d1" },
                { questionText: "Câu 4", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 0, type: "tap-hop-d1" },
                { questionText: "Câu 5", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 1, type: "tap-hop-d1" } // 1 câu sai (-10 XP)
            ];

            questions.finishPractice();

            // correctCount = 4/5 (80%)
            expect(questions.correctCount).toBe(4);
            // Điểm không tăng vì 80 không lớn hơn 80
            expect(mockApp.state.scores['bai-1']).toBe(80);
            // 200 ban đầu - 10 (phạt câu 5) + 0 (xpEarned bị gán 0 vì prevScore > 0) = 190
            expect(mockApp.state.xp).toBe(190);
        });

        test("Safe XP Floor Invariant (XP >= 0): XP ban đầu = 0 làm sai nhiều câu không bao giờ âm", () => {
            mockApp.state.xp = 0;
            questions.currentLesson = { id: 'bai-1', title: 'Tập hợp phần tử' };
            questions.currentQuestions = [
                { questionText: "Câu 1", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 1, type: "t1" },
                { questionText: "Câu 2", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 1, type: "t1" },
                { questionText: "Câu 3", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 1, type: "t1" },
                { questionText: "Câu 4", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 1, type: "t1" },
                { questionText: "Câu 5", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 1, type: "t1" }
            ];

            questions.finishPractice();

            expect(mockApp.state.xp).toBe(0);
            expect(mockApp.state.xp).toBeGreaterThanOrEqual(0);
        });

        test("Safe XP Floor Invariant: XP = 5 làm sai 1 câu (-10 XP) -> Về đúng sàn 0", () => {
            mockApp.state.xp = 5;
            questions.currentLesson = { id: 'bai-1', title: 'Tập hợp phần tử' };
            questions.currentQuestions = [
                { questionText: "Câu 1", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 1, type: "t1" }
            ];

            questions.finishPractice();

            expect(mockApp.state.xp).toBe(0);
        });

        test("Safe XP Floor Invariant: XP = 11 làm sai 1 câu (-10 XP) -> Còn đúng 1 XP", () => {
            mockApp.state.xp = 11;
            questions.currentLesson = { id: 'bai-1', title: 'Tập hợp phần tử' };
            questions.currentQuestions = [
                { questionText: "Câu 1", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 1, type: "t1" }
            ];

            questions.finishPractice();

            expect(mockApp.state.xp).toBe(1);
        });
    });

    // =========================================================================
    // C. SUBTOPIC PRACTICE MODE
    // =========================================================================
    describe("C. Subtopic Practice Mode Characterization", () => {
        test("Luyện tập dạng bài (isSubtopicPracticeMode = true): Ghi nhận completedSubtopics, subtopicScores và XP theo tỷ lệ bậc Giỏi", () => {
            mockApp.state.xp = 100;
            mockApp.state.completedSubtopics = [];
            mockApp.state.subtopicScores = {};

            questions.isSubtopicPracticeMode = true;
            questions.currentLesson = { id: 'bai-1', title: 'Tập hợp phần tử' };
            questions.currentSubtopic = { id: 'bai-1-d1', title: 'Dạng 1' };
            questions.currentLevel = 'co-ban';

            // 10 câu: 8 đúng, 2 sai (80% -> Đạt loại Giỏi, xpEarned = Math.round(50 * 0.8) = 40)
            const qs = [];
            for (let i = 0; i < 8; i++) {
                qs.push({ questionText: `Q${i}`, options: ["A", "B"], correctIndex: 0, userSelectedIndex: 0, type: "d1" });
            }
            for (let i = 8; i < 10; i++) {
                qs.push({ questionText: `Q${i}`, options: ["A", "B"], correctIndex: 0, userSelectedIndex: 1, type: "d1" }); // 2 câu sai (-20 XP)
            }
            questions.currentQuestions = qs;

            questions.finishPractice();

            expect(questions.correctCount).toBe(8);
            expect(mockApp.state.completedSubtopics).toContain('bai-1-d1');
            expect(mockApp.state.subtopicScores['bai-1-d1']).toBe(80);

            // 100 - 20 (penalty 2 câu) + 40 (xpEarned bậc Giỏi 80%) = 120
            expect(mockApp.state.xp).toBe(120);

            // Subtopic mode không ghi nhận vào state.scores của bài học cha
            expect(mockApp.state.scores['bai-1']).toBeUndefined();
        });

        test("Luyện tập dạng bài lần 2: Tích lũy điểm cao hơn và không bị duplicate completedSubtopics", () => {
            mockApp.state.completedSubtopics = ['bai-1-d1'];
            mockApp.state.subtopicScores = { 'bai-1-d1': 80 };
            mockApp.state.xp = 150;

            questions.isSubtopicPracticeMode = true;
            questions.currentLesson = { id: 'bai-1', title: 'Tập hợp phần tử' };
            questions.currentSubtopic = { id: 'bai-1-d1', title: 'Dạng 1' };

            // 10 câu 10 đúng (100% -> Xuất sắc, xpEarned = 50)
            const qs = [];
            for (let i = 0; i < 10; i++) {
                qs.push({ questionText: `Q${i}`, options: ["A", "B"], correctIndex: 0, userSelectedIndex: 0, type: "d1" });
            }
            questions.currentQuestions = qs;

            questions.finishPractice();

            expect(mockApp.state.completedSubtopics.filter(id => id === 'bai-1-d1').length).toBe(1);
            expect(mockApp.state.subtopicScores['bai-1-d1']).toBe(100);
            // 150 + 50 (xpEarned) = 200
            expect(mockApp.state.xp).toBe(200);
        });
    });

    // =========================================================================
    // D. 100% COMPLETION REWARD & IDEMPOTENCY
    // =========================================================================
    describe("D. 100% Completion Reward & Idempotency Characterization", () => {
        test("Bài học có subtopics: Chỉ thưởng +100 XP khi TẤT CẢ các subtopic đạt 100%", () => {
            mockApp.state.xp = 100;
            mockApp.state.subtopicScores = { 'bai-1-d1': 100 }; // Chỉ d1 đạt 100%, d2 chưa đạt

            mockApp.checkAndReward100PercentLesson('bai-1', 'math');
            expect(mockApp.state.rewarded100PercentLessons).not.toContain('bai-1');
            expect(mockApp.state.xp).toBe(100);

            // Hoàn thành nốt d2 đạt 100%
            mockApp.state.subtopicScores['bai-1-d2'] = 100;
            mockApp.checkAndReward100PercentLesson('bai-1', 'math');

            expect(mockApp.state.rewarded100PercentLessons).toContain('bai-1');
            expect(mockApp.state.xp).toBe(200); // 100 + 100

            // Gọi lại lần nữa -> Idempotent, không thưởng kép
            mockApp.checkAndReward100PercentLesson('bai-1', 'math');
            expect(mockApp.state.xp).toBe(200);
        });

        test("Bài học không có subtopics: Thưởng +100 XP khi state.scores[lessonId] = 100", () => {
            mockApp.state.xp = 50;
            mockApp.state.scores['bai-simple'] = 100;

            mockApp.checkAndReward100PercentLesson('bai-simple', 'math');

            expect(mockApp.state.rewarded100PercentLessons).toContain('bai-simple');
            expect(mockApp.state.xp).toBe(150);

            // Kiểm tra Idempotency
            mockApp.checkAndReward100PercentLesson('bai-simple', 'math');
            expect(mockApp.state.xp).toBe(150);
        });
    });

    // =========================================================================
    // E. CHAPTER & LESSON EXAM MODES
    // =========================================================================
    describe("E. Chapter & Lesson Exam Modes Characterization", () => {
        test("Thi kết thúc chương (isExamMode = true): Mở khóa huy hiệu chương tương ứng và bỏ qua levelScores", () => {
            mockApp.state.xp = 300;
            mockApp.state.levelScores = {};

            questions.isExamMode = true;
            questions.currentLesson = { id: 'kt-c1', title: 'Kiểm tra Chương 1' };
            questions.currentLevel = 'nang-cao';

            // 10 câu đúng 10
            questions.currentQuestions = Array(10).fill(null).map((_, i) => ({
                questionText: `Exam Q${i}`,
                options: ["A", "B", "C", "D"],
                correctIndex: 0,
                userSelectedIndex: 0,
                type: "tap-hop"
            }));

            questions.finishPractice();

            expect(questions.correctCount).toBe(10);
            expect(mockApp.state.scores['kt-c1']).toBe(100);

            // levelScores BẮT BUỘC không bị ghi nhận trong chế độ thi chương
            expect(mockApp.state.levelScores['kt-c1_nang-cao']).toBeUndefined();

            // Mở khóa huy hiệu chương 1
            expect(unlockedBadges).toContain('bac-thay-so-tu-nhien');

            // Exam session có isExam = true
            const lastSession = mockApp.state.examSessions[mockApp.state.examSessions.length - 1];
            expect(lastSession.isExam).toBe(true);
            expect(lastSession.isLessonExam).toBe(false);
        });

        test("Thi kết thúc chương 2 (kt-c2): Mở khóa huy hiệu 'chien-binh-chia-het'", () => {
            questions.isExamMode = true;
            questions.currentLesson = { id: 'kt-c2', title: 'Kiểm tra Chương 2' };
            questions.currentQuestions = Array(10).fill(null).map(() => ({
                questionText: "Q", options: ["A"], correctIndex: 0, userSelectedIndex: 0, type: "chia-het"
            }));

            questions.finishPractice();

            expect(unlockedBadges).toContain('chien-binh-chia-het');
        });

        test("Kiểm tra tổng thể bài học (isLessonExamMode = true): Bỏ qua levelScores và đánh dấu isLessonExam = true", () => {
            mockApp.state.levelScores = {};
            questions.isLessonExamMode = true;
            questions.currentLesson = { id: 'bai-1', title: 'Tập hợp phần tử' };

            questions.currentQuestions = Array(10).fill(null).map(() => ({
                questionText: "Q", options: ["A"], correctIndex: 0, userSelectedIndex: 0, type: "tap-hop-d1"
            }));

            questions.finishPractice();

            expect(mockApp.state.levelScores['bai-1_co-ban']).toBeUndefined();

            const lastSession = mockApp.state.examSessions[mockApp.state.examSessions.length - 1];
            expect(lastSession.isLessonExam).toBe(true);
            expect(lastSession.isExam).toBe(false);
        });
    });

    // =========================================================================
    // F. SESSION RECORD SCHEMA & INTEGRITY
    // =========================================================================
    describe("F. Session Record Schema & Integrity Characterization", () => {
        test("examSessions lưu trữ đầy đủ các thuộc tính chi tiết theo đúng schema thực tế", () => {
            questions.currentLesson = { id: 'bai-1', title: 'Tập hợp phần tử' };
            questions.currentLevel = 'nang-cao';
            questions.practiceDistractions = 2;
            questions.currentQuestions = [
                {
                    questionText: "Tìm x trong $x + 5 = 10$",
                    options: ["$x = 5$", "$x = 10$", "$x = 15$", "$x = 0$"],
                    correctIndex: 0,
                    userSelectedIndex: 0,
                    isShortAnswer: false,
                    solutionHtml: "Giải chi tiết: $x = 10 - 5 = 5$",
                    tip: "Chuyển vế đổi dấu",
                    level: "nang-cao",
                    type: "tap-hop-d2"
                },
                {
                    questionText: "Điền số phần tử của tập hợp A = {1; 2; 3}",
                    options: ["3"],
                    correctIndex: 0,
                    userSelectedIndex: null,
                    isShortAnswer: true,
                    userShortAnswer: "3",
                    solutionHtml: "Tập hợp A có 3 phần tử",
                    tip: "Đếm số phần tử",
                    level: "nang-cao",
                    type: "tap-hop-d1"
                }
            ];

            questions.finishPractice();

            expect(mockApp.state.examSessions.length).toBe(1);
            const session = mockApp.state.examSessions[0];

            // 1. Session Metadata
            expect(session.id).toMatch(/^sess-\d+/);
            expect(session.lessonId).toBe('bai-1');
            expect(session.lessonTitle).toBe('Tập hợp phần tử');
            expect(session.level).toBe('nang-cao');
            expect(session.isExam).toBe(false);
            expect(session.isLessonExam).toBe(false);
            expect(session.isSubtopicPractice).toBe(false);
            expect(session.isWeaknessPractice).toBe(false);
            expect(typeof session.date).toBe('string');
            expect(session.correctCount).toBe(2);
            expect(session.totalQuestions).toBe(2);
            expect(session.scorePercent).toBe(100);
            expect(session.distractions).toBe(2);
            expect(typeof session.timeSpent).toBe('number');

            // 2. Question Details mapping
            expect(session.questions.length).toBe(2);

            const q0 = session.questions[0];
            expect(q0.questionText).toBe("Tìm x trong $x + 5 = 10$");
            expect(q0.options).toEqual(["$x = 5$", "$x = 10$", "$x = 15$", "$x = 0$"]);
            expect(q0.correctIndex).toBe(0);
            expect(q0.userSelectedIndex).toBe(0);
            expect(q0.isShortAnswer).toBe(false);
            expect(q0.isCorrect).toBe(true);
            expect(q0.solutionHtml).toBe("Giải chi tiết: $x = 10 - 5 = 5$");
            expect(q0.tip).toBe("Chuyển vế đổi dấu");
            expect(q0.level).toBe("nang-cao");
            expect(q0.type).toBe("tap-hop-d2");

            const q1 = session.questions[1];
            expect(q1.isShortAnswer).toBe(true);
            expect(q1.userShortAnswer).toBe("3");
            expect(q1.isCorrect).toBe(true);
        });
    });

    // =========================================================================
    // G. SESSION RETENTION LIMIT (150 SESSIONS)
    // =========================================================================
    describe("G. Session Retention Limit Characterization", () => {
        test("Giữ tối đa 150 session gần nhất và đẩy bỏ session cũ nhất (FIFO)", () => {
            // Khởi tạo sẵn 150 sessions
            mockApp.state.examSessions = [];
            for (let i = 0; i < 150; i++) {
                mockApp.state.examSessions.push({ id: `sess-old-${i}`, lessonId: 'bai-old' });
            }
            expect(mockApp.state.examSessions.length).toBe(150);

            questions.currentLesson = { id: 'bai-1', title: 'Tập hợp' };
            questions.currentQuestions = [
                { questionText: "Q", options: ["A"], correctIndex: 0, userSelectedIndex: 0, type: "t1" }
            ];

            // Action: Thêm session thứ 151
            questions.finishPractice();

            // Tổng số sessions sau khi finish vẫn phải đúng 150
            expect(mockApp.state.examSessions.length).toBe(150);
            // Session cũ nhất `sess-old-0` đã bị xóa
            expect(mockApp.state.examSessions[0].id).toBe('sess-old-1');
            // Session mới nhất nằm ở cuối danh sách
            expect(mockApp.state.examSessions[149].lessonId).toBe('bai-1');
        });
    });

    // =========================================================================
    // H. SAVE PROGRESS INVOCATIONS CHARACTERIZATION
    // =========================================================================
    describe("H. saveProgress Invocations Characterization", () => {
        test("Standard Practice (First attempt, < 100%): Thực hiện đúng 3 lần gọi saveProgress", () => {
            // Lần 1: saveLessonScore
            // Lần 2: levelScores
            // Lần 3: examSessions.push
            questions.currentLesson = { id: 'bai-1', title: 'Tập hợp' };
            questions.currentLevel = 'co-ban';
            questions.currentQuestions = [
                { questionText: "Q1", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 0, type: "t1" },
                { questionText: "Q2", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 0, type: "t1" },
                { questionText: "Q3", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 0, type: "t1" },
                { questionText: "Q4", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 0, type: "t1" },
                { questionText: "Q5", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 1, type: "t1" } // 80% (không kích hoạt thưởng 100%)
            ];

            questions.finishPractice();

            expect(mockApp.saveProgress).toHaveBeenCalledTimes(3);
        });

        test("Subtopic Practice: Thực hiện đúng 2 lần gọi saveProgress", () => {
            // Lần 1: subtopic branch
            // Lần 2: examSessions.push
            questions.isSubtopicPracticeMode = true;
            questions.currentLesson = { id: 'bai-1', title: 'Tập hợp' };
            questions.currentSubtopic = { id: 'bai-1-d1', title: 'Dạng 1' };
            questions.currentQuestions = [
                { questionText: "Q", options: ["A"], correctIndex: 0, userSelectedIndex: 0, type: "t1" }
            ];

            questions.finishPractice();

            expect(mockApp.saveProgress).toHaveBeenCalledTimes(2);
        });

        test("Chapter Exam Passed (100%): Thực hiện đúng 4 lần gọi saveProgress (saveLessonScore + checkAndReward + examSessions + unlockBadge)", () => {
            questions.isExamMode = true;
            questions.currentLesson = { id: 'kt-c1', title: 'Kiểm tra Chương 1' };
            questions.currentQuestions = [
                { questionText: "Q", options: ["A"], correctIndex: 0, userSelectedIndex: 0, type: "t1" }
            ];

            questions.finishPractice();

            expect(mockApp.saveProgress).toHaveBeenCalledTimes(4);
        });

        test("Chapter Exam Passed (< 100%): Thực hiện đúng 3 lần gọi saveProgress (saveLessonScore + examSessions + unlockBadge)", () => {
            questions.isExamMode = true;
            questions.currentLesson = { id: 'kt-c1', title: 'Kiểm tra Chương 1' };
            // 8/10 câu đúng (80% -> Đạt nhưng không đạt 100%)
            const qs = [];
            for (let i = 0; i < 8; i++) qs.push({ questionText: "Q", options: ["A"], correctIndex: 0, userSelectedIndex: 0, type: "t1" });
            for (let i = 8; i < 10; i++) qs.push({ questionText: "Q", options: ["A", "B"], correctIndex: 0, userSelectedIndex: 1, type: "t1" });
            questions.currentQuestions = qs;

            questions.finishPractice();

            expect(mockApp.saveProgress).toHaveBeenCalledTimes(3);
        });
    });

    // =========================================================================
    // I. UI, AUDIO & GUARD SIDE EFFECTS
    // =========================================================================
    describe("I. UI, Audio & Guard Side Effects Characterization", () => {
        test("Nút nộp bài bị disable kèm spinner để chống spam click", () => {
            questions.currentLesson = { id: 'bai-1', title: 'Tập hợp' };
            questions.currentQuestions = [
                { questionText: "Q", options: ["A"], correctIndex: 0, userSelectedIndex: 0, type: "t1" }
            ];

            questions.finishPractice();

            expect(mockDom.nextBtn.disabled).toBe(true);
            expect(mockDom.nextBtn.innerHTML).toContain("fa-spinner");
        });

        test("Ẩn hộp câu hỏi đang làm và hiển thị hộp kết quả bài tập", () => {
            questions.currentLesson = { id: 'bai-1', title: 'Tập hợp' };
            questions.currentQuestions = [
                { questionText: "Q", options: ["A"], correctIndex: 0, userSelectedIndex: 0, type: "t1" }
            ];

            questions.finishPractice();

            expect(mockDom.practiceActiveBox.classList.add).toHaveBeenCalledWith("hidden");
            expect(mockDom.practiceResultBox.classList.remove).toHaveBeenCalledWith("hidden");
        });

        test("Hero trong chế độ Game nhận +80 XP khi hoàn thành bài tập", () => {
            questions.practiceMode = 'game';
            questions.hero = {
                addXp: jest.fn()
            };
            questions.currentLesson = { id: 'bai-1', title: 'Tập hợp' };
            questions.currentQuestions = [
                { questionText: "Q", options: ["A"], correctIndex: 0, userSelectedIndex: 0, type: "t1" }
            ];

            questions.finishPractice();

            expect(questions.hero.addXp).toHaveBeenCalledWith(80);
        });
    });
});
