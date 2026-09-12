/**
 * PLAYWRIGHT E2E TEST: ENGLISH UI RUNTIME COMPREHENSIVE VERIFICATION
 * Tests real browser pointer clicks, DOM transformations, state machine synchronization,
 * and eliminates all Jest mocking blindspots on Chromium.
 */
const { test, expect } = require('@playwright/test');

test.describe("ENGLISH PRO GRADE 6 - RUNTIME E2E VERIFICATION SUITE", () => {

    async function loadInteractiveQuestion(page, q) {
        await page.evaluate((question) => {
            document.body.classList.add("focus-mode-active");
            const scr = document.getElementById("english-focus-lesson-screen");
            if (scr) scr.classList.remove("hidden");
            window.app.currentEnglishQuestions = [question];
            window.app.currentEnglishQuestionIndex = 0;
            window.app.renderEnglishQuestion();
        }, q);
    }

    test.beforeEach(async ({ page }) => {
        await page.goto('/student.html');

        // Bỏ qua PIN bảo vệ phụ huynh cho test E2E
        await page.evaluate(() => {
            sessionStorage.setItem("adminToken", "mock_admin_token_e2e");
            localStorage.setItem("adminToken", "mock_admin_token_e2e");
        });

        // Vượt qua splash screen nếu có
        const splashBtn = page.locator('#splash-start-btn');
        if (await splashBtn.isVisible()) {
            await splashBtn.click();
            await expect(page.locator('#splash-screen')).toBeHidden({ timeout: 5000 }).catch(() => {});
        }

        // Chọn học sinh Trần Bình Minh nếu màn hình chọn học sinh xuất hiện
        const studentCard = page.locator('.student-select-card').first();
        if (await studentCard.isVisible()) {
            await studentCard.click();
            await page.waitForTimeout(300);
        }

        // Đảm bảo chọn môn Tiếng Anh Lớp 6
        await page.evaluate(() => {
            if (window.app && typeof window.app.selectSubject === 'function') {
                window.app.selectSubject('english');
            }
        });
        await page.waitForTimeout(300);
    });

    test("1. LISTENING: Option selection enables Check button, clicking Check verifies answer and shows feedback", async ({ page }) => {
        // Khởi tạo trực tiếp một câu hỏi Listening trắc nghiệm chuẩn
        await loadInteractiveQuestion(page, {
            id: 'test_listening_1',
            type: 'listening',
            questionType: 'listening',
            questionText: 'Listen and choose the correct answer:',
            listeningText: 'apple',
            options: ['apple', 'banana', 'orange', 'grape'],
            correctAnswer: 'apple',
            correctIndex: 0
        });

        const checkBtn = page.locator('#btn-eng-check-answer');
        await expect(checkBtn).toBeVisible({ timeout: 5000 });
        
        // Ban đầu nút Kiểm Tra phải bị disabled
        await expect(checkBtn).toBeDisabled();

        // Click chọn option 0 ("apple")
        const opt0 = page.locator('#opt-0');
        await expect(opt0).toBeVisible();
        await opt0.click();

        // Kiểm tra option 0 đã được chọn
        await expect(opt0).toHaveClass(/selected/);
        await expect(opt0).toHaveAttribute('aria-checked', 'true');

        // Nút Kiểm Tra PHẢI ĐƯỢC ENABLED
        await expect(checkBtn).toBeEnabled();

        // Click nút Kiểm Tra
        await checkBtn.click();

        // Banner phản hồi Duolingo phải hiển thị trạng thái chính xác
        const banner = page.locator('#bottom-feedback-banner');
        await expect(banner).toBeVisible({ timeout: 3000 });
        await expect(banner).toHaveClass(/feedback-correct/);

        // Nút Tiếp Tục xuất hiện và click được
        const nextBtn = page.locator('#btn-english-next-action');
        await expect(nextBtn).toBeVisible();
        await nextBtn.click();

        // Banner đóng lại sau khi Next
        await expect(banner).not.toHaveClass(/active/);
    });

    test("2. SPEAKING: Skip button and Speech Recognition enable Check button, answer evaluates cleanly", async ({ page }) => {
        // Khởi tạo câu hỏi Speaking
        await loadInteractiveQuestion(page, {
            id: 'test_speaking_1',
            type: 'speaking',
            questionType: 'speaking',
            questionText: 'Pronounce this sentence clearly:',
            speakingText: 'Hello world',
            correctAnswer: 'Hello world'
        });

        const checkBtn = page.locator('#btn-eng-check-answer');
        await expect(checkBtn).toBeVisible({ timeout: 5000 });
        await expect(checkBtn).toBeDisabled();

        // Test Bỏ qua phát âm
        const skipBtn = page.locator('.btn-skip-speaking');
        await expect(skipBtn).toBeVisible();
        await skipBtn.click();

        // Nút Kiểm Tra phải được ENABLED sau khi bỏ qua
        await expect(checkBtn).toBeEnabled();

        // Click Kiểm Tra
        await checkBtn.click();

        // Banner phản hồi hiển thị
        const banner = page.locator('#bottom-feedback-banner');
        await expect(banner).toBeVisible({ timeout: 3000 });
        
        // Reset và thử nghiệm với nhận diện giọng nói mô phỏng đạt 100%
        await page.evaluate(() => {
            window.app.currentEnglishQuestionIndex = 0;
            window.app.renderEnglishQuestion();
            // Mô phỏng kết quả nhận diện thành công
            window.app.currentEnglishStudentAnswer = {
                spokenText: "Hello world",
                accuracy: 95,
                correct: true
            };
            window.app.setEnglishCheckButtonEnabled(true);
        });

        await expect(checkBtn).toBeEnabled();
        await checkBtn.click();
        await expect(banner).toHaveClass(/feedback-correct/);
    });

    test("3. READING: Option click enables Check button, evaluates passage reading cleanly", async ({ page }) => {
        await loadInteractiveQuestion(page, {
            id: 'test_reading_1',
            type: 'reading_passage',
            questionType: 'reading_passage',
            questionText: 'What is the main idea of the passage?',
            passageText: 'Solar energy is a clean and renewable source of power.',
            options: ['Solar energy is renewable', 'Coal is cheap', 'Wind is unpredictable', 'None of above'],
            correctAnswer: 'Solar energy is renewable',
            correctIndex: 0
        });

        const checkBtn = page.locator('#btn-eng-check-answer');
        await expect(checkBtn).toBeVisible({ timeout: 5000 });
        await expect(checkBtn).toBeDisabled();

        // Chọn option 0
        const opt0 = page.locator('#opt-0');
        await expect(opt0).toBeVisible();
        await opt0.click();

        // Nút Kiểm Tra phải enabled
        await expect(checkBtn).toBeEnabled();

        // Click Kiểm Tra
        await checkBtn.click();

        const banner = page.locator('#bottom-feedback-banner');
        await expect(banner).toBeVisible({ timeout: 3000 });
        await expect(banner).toHaveClass(/feedback-correct/);
    });

    test("4. WRITING: Word pool blocks click into answer slots, support duplicate words, undo, and enable Check button", async ({ page }) => {
        // Sentence with duplicate words "the" to test instance identity
        await loadInteractiveQuestion(page, {
            id: 'test_writing_1',
            type: 'writing_unscramble',
            questionType: 'writing_unscramble',
            questionText: 'Put the words in correct order:',
            wordPool: ['The', 'dog', 'sees', 'the', 'cat.'],
            correctAnswer: 'The dog sees the cat.'
        });

        const checkBtn = page.locator('#btn-eng-check-answer');
        await expect(checkBtn).toBeVisible({ timeout: 5000 });
        await expect(checkBtn).toBeDisabled();

        const slotsPool = page.locator('#english-slots-pool');
        const dragPool = page.locator('#english-drag-pool');
        await expect(slotsPool).toBeVisible();
        await expect(dragPool).toBeVisible();

        // Slots pool ban đầu rỗng
        await expect(slotsPool.locator('.drag-word-block')).toHaveCount(0);
        // Drag pool có 5 từ
        await expect(dragPool.locator('.drag-word-block')).toHaveCount(5);

        // Click từ đầu tiên "The" (#drag-block-0)
        const block0 = page.locator('#drag-block-0');
        await block0.click();

        // KHÔNG ĐƯỢC BIẾN MẤT: Từ phải xuất hiện trong slotsPool!
        await expect(slotsPool.locator('#drag-block-0')).toBeVisible();
        await expect(slotsPool.locator('.drag-word-block')).toHaveCount(1);
        await expect(dragPool.locator('.drag-word-block')).toHaveCount(4);

        // Nút Kiểm Tra phải được ENABLED
        await expect(checkBtn).toBeEnabled();

        // Click từ "dog" (#drag-block-1)
        const block1 = page.locator('#drag-block-1');
        await block1.click();
        await expect(slotsPool.locator('.drag-word-block')).toHaveCount(2);

        // Test UNDO: Click từ "dog" trong slotsPool để trả lại dragPool
        await block1.click();
        await expect(slotsPool.locator('.drag-word-block')).toHaveCount(1);
        await expect(dragPool.locator('#drag-block-1')).toBeVisible();
        await expect(checkBtn).toBeEnabled(); // Vẫn còn 1 từ "The"

        // Click trả nốt "The" về dragPool -> slotsPool rỗng -> nút Kiểm Tra phải bị disabled lại
        await block0.click();
        await expect(slotsPool.locator('.drag-word-block')).toHaveCount(0);
        await expect(checkBtn).toBeDisabled();

        // Xếp toàn bộ câu hoàn chỉnh
        await page.locator('#drag-block-0').click(); // The
        await page.locator('#drag-block-1').click(); // dog
        await page.locator('#drag-block-2').click(); // sees
        await page.locator('#drag-block-3').click(); // the
        await page.locator('#drag-block-4').click(); // cat.

        await expect(slotsPool.locator('.drag-word-block')).toHaveCount(5);
        await expect(dragPool.locator('.drag-word-block')).toHaveCount(0);
        await expect(checkBtn).toBeEnabled();

        // Click Kiểm Tra
        await checkBtn.click();

        const banner = page.locator('#bottom-feedback-banner');
        await expect(banner).toBeVisible({ timeout: 3000 });
        await expect(banner).toHaveClass(/feedback-correct/);
    });

    test("5. READING CLOZE: Words fill passage slots, undo works, and Check button enables", async ({ page }) => {
        await loadInteractiveQuestion(page, {
            id: 'test_cloze_1',
            type: 'reading_cloze',
            questionType: 'reading_cloze',
            questionText: 'Fill in the blanks with correct words:',
            passageTemplate: 'I like to {0} football and {1} books.',
            wordPool: ['play', 'read', 'eat', 'sleep'],
            correctAnswer: 'play, read'
        });

        const checkBtn = page.locator('#btn-eng-check-answer');
        await expect(checkBtn).toBeDisabled();

        // Click từ "play" (#drag-block-0)
        await page.locator('#drag-block-0').click();
        
        // Slot 0 phải hiển thị "play"
        const clozeSlot0 = page.locator('.cloze-slot').first();
        await expect(clozeSlot0).toHaveText('play');
        await expect(checkBtn).toBeEnabled();

        // Click slot 0 để gỡ từ ra
        await clozeSlot0.click();
        await expect(clozeSlot0).not.toHaveText('play');
        await expect(checkBtn).toBeDisabled();
    });

    test("6. AI EXAM MODAL: startStudentEnglishExamOnline does NOT hang indefinitely", async ({ page }) => {
        // Mở màn hình trung tâm thi thử
        await page.evaluate(() => {
            window.app.switchEnglishTab('exams');
        });
        await page.waitForTimeout(400);

        // Bắt đầu thi thử trực tuyến
        await page.evaluate(() => {
            window.app.startStudentEnglishExamOnline();
        });

        // Kiểm tra modal loading xuất hiện
        const swalPopup = page.locator('.swal2-popup');
        
        // Đợi trong tối đa 8 giây: Swal PHẢI ĐÓNG hoặc chuyển sang màn hình thi
        await expect(async () => {
            const isSwalVisible = await swalPopup.isVisible();
            const isExamVisible = await page.locator('#english-ioe-exam-screen').isVisible();
            // Điều kiện vượt qua: hoặc Swal đã đóng, hoặc màn hình thi đã hiển thị
            expect(!isSwalVisible || isExamVisible).toBe(true);
        }).toPass({ timeout: 10000 });

        // Màn hình thi IOE/AI phải xuất hiện và có câu hỏi
        const examScreen = page.locator('#english-ioe-exam-screen');
        await expect(examScreen).toBeVisible({ timeout: 5000 });
        await expect(examScreen).not.toHaveClass(/hidden/);
    });

    test("7. LEADERBOARD: English leaderboard displays actual sync time and non-empty student rows", async ({ page }) => {
        await page.evaluate(() => {
            window.app.switchEnglishTab('leaderboard');
        });
        await page.waitForTimeout(500);

        const syncTime = page.locator('#leaderboard-sync-time');
        await expect(syncTime).toBeVisible({ timeout: 5000 });
        
        // Thời gian đồng bộ KHÔNG ĐƯỢC KẸT tại "--:--:--"
        await expect(syncTime).not.toHaveText(/--:--:--/);
        await expect(syncTime).toHaveText(/Đồng bộ:\s*\d{1,2}:\d{2}:\d{2}/);

        // Danh sách xếp hạng phải hiển thị các dòng học sinh (tối thiểu Trần Bình Minh)
        const rows = page.locator('#global-leaderboard-tbody tr');
        await expect(rows.first()).toBeVisible({ timeout: 5000 });
        const count = await rows.count();
        expect(count).toBeGreaterThan(0);
    });

    test("8. HERO PROFILE: Strongest/Weakest skills are differentiated and completed lesson counts are non-zero when scores exist", async ({ page }) => {
        // Cung cấp state có scores thật
        await page.evaluate(() => {
            if (!window.app.state.scores) {
                window.app.state.scores = {
                    'ch1-lesson1': 90,
                    'ch1-lesson2': 85,
                    'eng6-u1': 95,
                    'eng6-u2': 80
                };
            }
            window.app.renderHeroProfile();
        });

        const profileModal = page.locator('#hero-profile-modal');
        await expect(profileModal).toBeVisible({ timeout: 5000 });
        await expect(profileModal).not.toHaveClass(/hidden/);

        const bestSkill = page.locator('#hero-best-skill');
        const worstSkill = page.locator('#hero-worst-skill');
        await expect(bestSkill).toBeVisible();
        await expect(worstSkill).toBeVisible();

        const bestText = await bestSkill.innerText();
        const worstText = await worstSkill.innerText();

        // KHÔNG ĐƯỢC xảy ra trường hợp cả 2 cùng ghi "Nghe (70%)"
        const bothAreListening70 = (bestText.includes("Nghe (70%)") && worstText.includes("Nghe (70%)"));
        expect(bothAreListening70).toBe(false);

        // Số bài hoàn thành Toán và Tiếng Anh không bị 0 khi có điểm số >= 50
        const mathCompleted = page.locator('#math-completed-count');
        const engCompleted = page.locator('#english-completed-count');
        const mathCount = parseInt(await mathCompleted.innerText(), 10);
        const engCount = parseInt(await engCompleted.innerText(), 10);
        
        expect(mathCount).toBeGreaterThan(0);
        expect(engCount).toBeGreaterThan(0);
    });

});
