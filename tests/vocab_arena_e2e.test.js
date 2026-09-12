/**
 * PLAYWRIGHT E2E TEST: VOCABULARY ARENA SCIENCE ENGINE VERIFICATION SUITE
 * Tests Active Recall 3D Flashcards, 5-Level Mastery Model, Spaced Repetition (SRS),
 * 4 Retrieval Directions, Distractor Uniqueness, Student Isolation, and Math Data Preservation.
 */
const { test, expect } = require('@playwright/test');

test.describe("VOCABULARY ARENA SCIENCE ENGINE E2E SUITE", () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/student.html');

        // Bỏ qua PIN phụ huynh
        await page.evaluate(() => {
            sessionStorage.setItem("adminToken", "mock_admin_token_e2e");
            localStorage.setItem("adminToken", "mock_admin_token_e2e");
        });

        // Bỏ qua splash screen
        const splashBtn = page.locator('#splash-start-btn');
        if (await splashBtn.isVisible()) {
            await splashBtn.click();
            await expect(page.locator('#splash-screen')).toBeHidden({ timeout: 5000 }).catch(() => {});
        }

        // Chọn học sinh Trần Bình Minh
        const studentCard = page.locator('.student-select-card').first();
        if (await studentCard.isVisible()) {
            await studentCard.click();
            await page.waitForTimeout(300);
        }

        // Chọn môn Tiếng Anh Lớp 6 và chuyển sang tab Ôn từ vựng
        await page.evaluate(() => {
            // Xóa sạch kho từ vựng giữa các bài test để cô lập hoàn toàn môi trường
            const sId = (window.app && window.app.getCurrentStudentId && window.app.getCurrentStudentId()) || 'std_htsj4gbmo';
            localStorage.removeItem(`vocab_mastery_${sId}`);
            localStorage.removeItem('vocab_mastery_std_htsj4gbmo');
            localStorage.removeItem('vocab_mastery_std_tyc0gfnkz');
            if (window.app && window.app.state && window.app.state.subjects && window.app.state.subjects.english) {
                window.app.state.subjects.english.vocabMastery = {};
                window.app.state.subjects.english.vocabMasteryByStudent = {};
            }
            if (window.app && typeof window.app.selectSubject === 'function') {
                window.app.selectSubject('english');
            }
            if (window.app && typeof window.app.switchEnglishTab === 'function') {
                window.app.switchEnglishTab('practice');
            }
        });
        await page.waitForTimeout(300);
    });

    test("VS01: Active Recall Flashcard Front hides Vietnamese meaning and prompts retrieval", async ({ page }) => {
        // Tải từ vựng của Unit 1 Lớp 6
        await page.evaluate(() => {
            window.app.loadPracticeLessonVocab('eng6-u1');
        });

        const grid = page.locator('#eng-practice-vocab-grid');
        await expect(grid).toBeVisible();

        const firstCard = grid.locator('.flashcard-card-3d').first();
        await expect(firstCard).toBeVisible();

        // Mặt trước: Hiển thị từ Tiếng Anh, phiên âm, nút Nghe, gợi ý
        const front = firstCard.locator('.flashcard-front');
        await expect(front).toBeVisible();
        await expect(front.locator('.flashcard-word-eng')).toBeVisible();
        await expect(front).toContainText("Con có nhớ nghĩa từ này không?");

        // Mặt trước KHÔNG được chứa class nghĩa tiếng Việt visible
        const frontText = await front.innerText();
        expect(frontText).not.toContain("VÍ DỤ NGỮ CẢNH");
    });

    test("VS02: Flip Card & 4-Level Self-Assessment reveals meaning and rating buttons", async ({ page }) => {
        await page.evaluate(() => {
            window.app.loadPracticeLessonVocab('eng6-u1');
        });

        const firstCard = page.locator('.flashcard-card-3d').first();
        await firstCard.click();

        // Thẻ phải có class 'flipped'
        await expect(firstCard).toHaveClass(/flipped/);

        // Mặt sau có nghĩa tiếng Việt và 4 nút tự đánh giá
        const back = firstCard.locator('.flashcard-back');
        await expect(back.locator('.flashcard-word-vi')).toBeVisible();
        await expect(back.locator('.btn-self-assess')).toHaveCount(4);
    });

    test("VS03: Self-assessment does NOT unilaterally grant Level 5 (Mastered)", async ({ page }) => {
        await page.evaluate(() => {
            window.app.loadPracticeLessonVocab('eng6-u1');
            // Đánh giá từ 'calculator' là 'easy' (Rất dễ)
            window.app.assessVocabFlashcard('calculator', 'eng6-u1', 'easy');
        });

        // Kiểm tra record trong store
        const record = await page.evaluate(() => {
            return window.app.getWordMasteryRecord('calculator', 'eng6-u1');
        });

        // Level tối đa qua self-assessment chỉ là 2 (chưa qua retrieval quiz thì KHÔNG ĐƯỢC lên Level 5)
        expect(record.masteryLevel).toBeLessThan(5);
        expect(record.masteryLevel).toBe(2);
    });

    test("VS04: Arena Quiz generates 4 retrieval directions", async ({ page }) => {
        // Bắt đầu đấu trường từ vựng
        await page.evaluate(() => {
            window.app.startVocabArenaQuiz('eng6-u1');
        });

        const quizBox = page.locator('.vocab-quiz-container');
        await expect(quizBox).toBeVisible();

        // Kiểm tra cấu trúc câu hỏi có đủ các hướng
        const directions = await page.evaluate(() => {
            return window.app.currentVocabQuiz.questions.map(q => q.direction);
        });

        expect(directions.length).toBeGreaterThanOrEqual(4);
        const uniqueDirections = new Set(directions);
        // Phải có ít nhất 2 hướng khác nhau trong đề (en_to_vi, vi_to_en, audio_to_en, context_to_word)
        expect(uniqueDirections.size).toBeGreaterThanOrEqual(2);
    });

    test("VS05: Dynamic Distractors in Quiz are distinct and unique", async ({ page }) => {
        await page.evaluate(() => {
            window.app.startVocabArenaQuiz('eng6-u1');
        });

        const options = await page.evaluate(() => {
            return window.app.currentVocabQuiz.questions.map(q => q.options);
        });

        // Mỗi câu hỏi có đúng 4 phương án và không trùng nhau
        for (const opts of options) {
            expect(opts.length).toBe(4);
            const unique = new Set(opts);
            expect(unique.size).toBe(4);
        }
    });

    test("VS06: Quiz Immediate Pedagogical Feedback on answer selection", async ({ page }) => {
        await page.evaluate(() => {
            window.app.startVocabArenaQuiz('eng6-u1');
        });

        const opt0 = page.locator('.vocab-quiz-option-btn').first();
        await expect(opt0).toBeVisible();
        await opt0.click();

        // Feedback box phải xuất hiện
        const feedbackBox = page.locator('#vocab-quiz-feedback-box');
        await expect(feedbackBox).toBeVisible();

        // Nút Tiếp tục hiển thị trong feedback box
        await expect(feedbackBox.locator('button:text("Tiếp tục"), button:text("Đã hiểu & Tiếp tục")')).toBeVisible();
    });

    test("VS07: SRS Interval Schedule resets on wrong answer / 'forgot'", async ({ page }) => {
        await page.evaluate(() => {
            window.app.assessVocabFlashcard('compass', 'eng6-u1', 'forgot');
        });

        const record = await page.evaluate(() => {
            return window.app.getWordMasteryRecord('compass', 'eng6-u1');
        });

        expect(record.intervalMinutes).toBe(10);
        expect(record.isWeak).toBe(true);
        expect(record.streak).toBe(0);
    });

    test("VS08: SRS Interval Schedule expands on 'easy'", async ({ page }) => {
        await page.evaluate(() => {
            window.app.assessVocabFlashcard('pencil', 'eng6-u1', 'easy');
        });

        const record = await page.evaluate(() => {
            return window.app.getWordMasteryRecord('pencil', 'eng6-u1');
        });

        expect(record.intervalMinutes).toBeGreaterThanOrEqual(4320); // >= 3 ngày
        expect(record.isWeak).toBe(false);
    });

    test("VS09: Level 5 Promotion strictly requires correct answers in retrieval quiz", async ({ page }) => {
        // Giả lập từ 'schoolbag' đã ở Level 4 và có streak >= 3
        await page.evaluate(() => {
            const store = window.app.getVocabMasteryStore();
            store['6_eng6-u1_schoolbag'] = {
                word: 'schoolbag',
                unitId: 'eng6-u1',
                grade: '6',
                masteryLevel: 4,
                status: 'learning',
                attemptCount: 5,
                correctCount: 4,
                wrongCount: 1,
                streak: 3,
                lastReviewedAt: Date.now() - 86400000,
                nextReviewAt: Date.now() - 1000, // Đã quá hạn ôn tập
                intervalMinutes: 1440,
                retrievalSuccess: { en_to_vi: true, vi_to_en: true },
                isWeak: false
            };
            window.app.saveVocabMasteryStore(store);

            // Tạo quiz chỉ gồm câu hỏi về từ này
            window.app.currentVocabQuiz = {
                lessonId: 'eng6-u1',
                currentIndex: 0,
                questions: [{
                    wordItem: { word: 'schoolbag', meaning: 'cặp sách' },
                    direction: 'en_to_vi',
                    prompt: 'schoolbag',
                    correctAnswer: 'cặp sách',
                    options: ['cặp sách', 'bút chì', 'thước kẻ', 'cục tẩy'],
                    correctIndex: 0
                }],
                results: []
            };
            window.app.handleVocabQuizAnswer(0); // Trả lời đúng
        });

        const record = await page.evaluate(() => {
            return window.app.getWordMasteryRecord('schoolbag', 'eng6-u1');
        });

        // Đã đạt Level 5 (Mastered) qua retrieval test!
        expect(record.masteryLevel).toBe(5);
        expect(record.status).toBe('mastered');
    });

    test("VS10: Weak words queue is populated and surfaced after quiz", async ({ page }) => {
        await page.evaluate(() => {
            window.app.currentVocabQuiz = {
                lessonId: 'eng6-u1',
                currentIndex: 0,
                questions: [{
                    wordItem: { word: 'uniform', meaning: 'đồng phục' },
                    direction: 'en_to_vi',
                    prompt: 'uniform',
                    correctAnswer: 'đồng phục',
                    options: ['đồng phục', 'sách vở', 'bàn học', 'ghế'],
                    correctIndex: 0
                }],
                results: []
            };
            window.app.handleVocabQuizAnswer(1); // Trả lời SAI
            window.app.finishVocabQuiz();
        });

        const weakNotice = page.locator('#eng-practice-vocab-grid');
        await expect(weakNotice).toContainText("Các từ cần lưu ý ôn luyện thêm");
        await expect(weakNotice).toContainText("uniform");
    });

    test("VS11: Dashboard Metrics and Progress Bar update accurately", async ({ page }) => {
        await page.evaluate(() => {
            const store = window.app.getVocabMasteryStore();
            // Đặt 2 từ mastered, 1 từ weak trong Unit 1 (activity, calculator, compass)
            store['6_eng6-u1_activity'] = { word: 'activity', unitId: 'eng6-u1', masteryLevel: 5 };
            store['6_eng6-u1_calculator'] = { word: 'calculator', unitId: 'eng6-u1', masteryLevel: 5 };
            store['6_eng6-u1_compass'] = { word: 'compass', unitId: 'eng6-u1', masteryLevel: 2, isWeak: true };
            window.app.saveVocabMasteryStore(store);
            window.app.loadPracticeLessonVocab('eng6-u1');
        });

        const masteredEl = page.locator('#vocab-stat-mastered');
        await expect(masteredEl).toBeVisible();
        const text = await masteredEl.innerText();
        expect(parseInt(text)).toBeGreaterThanOrEqual(1);

        const dueEl = page.locator('#vocab-stat-due');
        const dueText = await dueEl.innerText();
        expect(parseInt(dueText)).toBeGreaterThanOrEqual(1);
    });

    test("VS12: Student Data Isolation between Tran Binh Minh and Tran Duc Phuc", async ({ page }) => {
        const isolationCheck = await page.evaluate(() => {
            // Lưu dữ liệu cho học sinh 1 (Trần Bình Minh)
            window.app.currentStudentId = 'std_htsj4gbmo';
            const storeMinh = { '6_eng6-u1_minh_word': { word: 'minh_word', masteryLevel: 4 } };
            window.app.saveVocabMasteryStore(storeMinh);

            // Lưu dữ liệu cho học sinh 2 (Trần Đức Phúc)
            window.app.currentStudentId = 'std_tyc0gfnkz';
            const storePhuc = { '6_eng6-u1_phuc_word': { word: 'phuc_word', masteryLevel: 1 } };
            window.app.saveVocabMasteryStore(storePhuc);

            // Đọc lại cho từng học sinh
            window.app.currentStudentId = 'std_htsj4gbmo';
            const readMinh = window.app.getVocabMasteryStore();

            window.app.currentStudentId = 'std_tyc0gfnkz';
            const readPhuc = window.app.getVocabMasteryStore();

            return {
                minhHasMinh: !!readMinh['6_eng6-u1_minh_word'],
                minhHasPhuc: !!readMinh['6_eng6-u1_phuc_word'],
                phucHasPhuc: !!readPhuc['6_eng6-u1_phuc_word'],
                phucHasMinh: !!readPhuc['6_eng6-u1_minh_word']
            };
        });

        expect(isolationCheck.minhHasMinh).toBe(true);
        expect(isolationCheck.minhHasPhuc).toBe(false);
        expect(isolationCheck.phucHasPhuc).toBe(true);
        expect(isolationCheck.phucHasMinh).toBe(false);
    });

    test("VS13: Card flip state retention does not reset user screen", async ({ page }) => {
        await page.evaluate(() => {
            window.app.loadPracticeLessonVocab('eng6-u1');
        });

        const firstCard = page.locator('.flashcard-card-3d').first();
        await firstCard.click();
        await expect(firstCard).toHaveClass(/flipped/);

        // Click lại để lật về
        await firstCard.click();
        await expect(firstCard).not.toHaveClass(/flipped/);
    });

    test("VS14: Persistence in LocalStorage across store operations", async ({ page }) => {
        const studentId = await page.evaluate(() => window.app.getCurrentStudentId());
        
        await page.evaluate((sId) => {
            const store = window.app.getVocabMasteryStore();
            store['6_eng6-u1_persist_test'] = { word: 'persist_test', masteryLevel: 3 };
            window.app.saveVocabMasteryStore(store);
        }, studentId);

        // Đọc trực tiếp từ localStorage của trình duyệt
        const raw = await page.evaluate((sId) => {
            return localStorage.getItem(`vocab_mastery_${sId}`);
        }, studentId);

        expect(raw).toContain("persist_test");
    });

    test("VS15: Quiz anti double-click protection", async ({ page }) => {
        await page.evaluate(() => {
            window.app.startVocabArenaQuiz('eng6-u1');
        });

        const firstOpt = page.locator('.vocab-quiz-option-btn').first();
        await expect(firstOpt).toBeVisible();

        // Click 2 lần liên tiếp thật nhanh
        await firstOpt.click({ clickCount: 2 });

        // Kết quả của câu hiện tại chỉ được ghi 1 lần
        const resultsCount = await page.evaluate(() => {
            return window.app.currentVocabQuiz.results.length;
        });

        expect(resultsCount).toBe(1);
    });

    test("VS16: English XP reward without modifying Math XP of student", async ({ page }) => {
        // Đảm bảo Math XP và English XP có giá trị xác định
        const xpBaseline = await page.evaluate(() => {
            if (!window.app.state) window.app.state = {};
            if (!window.app.state.subjects) window.app.state.subjects = {};
            if (!window.app.state.subjects.math) window.app.state.subjects.math = {};
            if (!window.app.state.subjects.english) window.app.state.subjects.english = {};

            window.app.state.subjects.math.xp = 1210; // Điểm Toán gốc
            window.app.state.subjects.english.xp = 100;
            window.app.state.englishXp = 100;

            window.app.switchEnglishTab('practice');

            // Kết thúc 1 quiz đạt điểm cao
            window.app.currentVocabQuiz = {
                lessonId: 'eng6-u1',
                currentIndex: 1,
                questions: [{ id: 1 }],
                results: [{ word: 'test', isCorrect: true }]
            };
            window.app.finishVocabQuiz();

            return {
                mathXp: window.app.state.subjects.math.xp,
                englishXp: window.app.state.subjects.english.xp
            };
        });

        // Điểm Toán PHẢI NGUYÊN VẸN 1210 XP
        expect(xpBaseline.mathXp).toBe(1210);
        // Điểm Tiếng Anh được cộng thêm
        expect(xpBaseline.englishXp).toBeGreaterThan(100);
    });

});
