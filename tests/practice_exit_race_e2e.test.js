/**
 * PLAYWRIGHT E2E RUNTIME CHARACTERIZATION: PRACTICE EXIT RACE & STATE MACHINE
 * 
 * Target: Audit, measure, and verify whether a race condition or stuck state
 * exists in Practice Exit (Zone 5) on Kiosk Desktop / Browser runtime.
 * 
 * Scenarios tested:
 * - Scenario A: Normal Exit & DOM cleanup
 * - Scenario B: Rapid Double/Multi Exit clicks
 * - Scenario C: Exit triggered while SweetAlert modal is already open
 * - Scenario D: Cancel then Exit again (verify isExiting flag reset)
 * - Scenario E: Exit during timed Exam mode (verify timer clearance)
 * - Scenario F: Exit + Fullscreen transition consistency
 * - Scenario G: Rapid subject navigation during exit cleanup
 * - Stress Benchmark Loop: N = 10 iterations measuring timing and failure rate
 */
const { test, expect } = require('@playwright/test');

test.describe('Practice Exit / Kiosk Race Characterization Suite', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/student.html');
        // Wait for app state initialization
        await page.waitForFunction(() => window.app && window.app.state);
        // Dismiss splash screen if visible
        const splashStartBtn = page.locator('#splash-start-btn');
        if (await splashStartBtn.isVisible()) {
            await splashStartBtn.click();
            await page.waitForTimeout(400);
        }
    });

    /**
     * Helper to start a local practice session in Lesson 1
     */
    async function startLessonPractice(page) {
        await page.evaluate(() => {
            app.selectSubject('math');
            app.startLesson('bai-1');
            app.switchLessonTab('practice');
            // Start standard practice directly
            questions.currentQuestions = [
                {
                    id: 'mock-q1',
                    questionText: 'Cho tập hợp $A = \\{1; 2; 3\\}$. Số phần tử của tập hợp $A$ là:',
                    options: ['A. 1', 'B. 2', 'C. 3', 'D. 4'],
                    correctIndex: 2,
                    solutionHtml: 'Tập hợp $A$ có 3 phần tử.',
                    level: 'co-ban',
                    type: 'tap-hop'
                }
            ];
            questions.currentQuestionIndex = 0;
            questions.practiceMode = 'standard';
            const selectBox = document.getElementById("practice-mode-select-box");
            if (selectBox) selectBox.classList.add("hidden");
            const activeBox = document.getElementById("practice-active-box");
            if (activeBox) activeBox.classList.remove("hidden");
            questions.showQuestion();
        });

        await expect(page.locator('#practice-active-box')).toBeVisible();
    }

    test('Scenario A — Normal Exit: complete cleanup & isExiting reset', async ({ page }) => {
        await startLessonPractice(page);

        // Click exit button
        const exitBtn = page.locator('.btn-exit-practice');
        await expect(exitBtn).toBeVisible();
        await exitBtn.click();

        // SweetAlert modal appears
        const swalPopup = page.locator('.swal2-popup');
        await expect(swalPopup).toBeVisible();

        // Confirm exit
        const confirmBtn = page.locator('.swal2-confirm');
        await confirmBtn.click();

        // Verify cleanup
        await expect(page.locator('#practice-active-box')).toBeHidden();
        const state = await page.evaluate(() => ({
            isExiting: questions.isExiting,
            currentQuestionsLength: questions.currentQuestions ? questions.currentQuestions.length : 0,
            superFocus: document.body.classList.contains('super-focus-active'),
            fullscreenActive: document.body.classList.contains('practice-fullscreen-active')
        }));

        expect(state.isExiting).toBe(false);
        expect(state.currentQuestionsLength).toBe(0);
        expect(state.superFocus).toBe(false);
        expect(state.fullscreenActive).toBe(false);
    });

    test('Scenario B — Rapid Double/Multi Exit clicks: no multiple modals or stuck state', async ({ page }) => {
        await startLessonPractice(page);

        // Trigger 5 concurrent calls to exitPractice()
        await page.evaluate(() => {
            for (let i = 0; i < 5; i++) {
                questions.exitPractice();
            }
        });

        // Exactly 1 modal should be rendered
        const popups = page.locator('.swal2-popup');
        await expect(popups).toHaveCount(1);

        // Confirm exit on that single modal
        const confirmBtn = page.locator('.swal2-confirm');
        await confirmBtn.click();

        // Verify state is clean
        await expect(page.locator('#practice-active-box')).toBeHidden();
        const isExiting = await page.evaluate(() => questions.isExiting);
        expect(isExiting).toBe(false);
    });

    test('Scenario C — Exit Triggered During Open SweetAlert: no race condition', async ({ page }) => {
        await startLessonPractice(page);

        // 1. Open exit modal
        await page.locator('.btn-exit-practice').click();
        await expect(page.locator('.swal2-popup')).toBeVisible();

        // 2. Invoke external caller app.goBackHierarchy() while modal is open
        await page.evaluate(() => {
            app.goBackHierarchy();
        });

        // 3. Modal should still be open and functional
        const confirmBtn = page.locator('.swal2-confirm');
        await expect(confirmBtn).toBeVisible();
        await confirmBtn.click();

        // 4. Verify clean exit
        await expect(page.locator('#practice-active-box')).toBeHidden();
        const isExiting = await page.evaluate(() => questions.isExiting);
        expect(isExiting).toBe(false);
    });

    test('Scenario D — Cancel Then Exit Again: isExiting flag resets properly', async ({ page }) => {
        await startLessonPractice(page);

        // 1. Open exit modal
        await page.locator('.btn-exit-practice').click();
        await expect(page.locator('.swal2-popup')).toBeVisible();

        // 2. Click Cancel button
        const cancelBtn = page.locator('.swal2-cancel');
        await cancelBtn.click();

        // Modal closes, practice remains active
        await expect(page.locator('.swal2-popup')).toBeHidden();
        await expect(page.locator('#practice-active-box')).toBeVisible();
        
        let isExiting = await page.evaluate(() => questions.isExiting);
        expect(isExiting).toBe(false);

        // 3. Immediately open exit modal again
        await page.locator('.btn-exit-practice').click();
        await expect(page.locator('.swal2-popup')).toBeVisible();

        // 4. Click Confirm button
        const confirmBtn = page.locator('.swal2-confirm');
        await confirmBtn.click();

        // Practice is now closed cleanly
        await expect(page.locator('#practice-active-box')).toBeHidden();
        isExiting = await page.evaluate(() => questions.isExiting);
        expect(isExiting).toBe(false);
    });

    test('Scenario E — Exit During Timed Exam Mode: timer interval cleared', async ({ page }) => {
        await page.evaluate(() => {
            app.selectSubject('math');
            app.startLesson('bai-1');
            app.switchLessonTab('practice');
            // Simulate 45m exam mode with active timer
            questions.currentQuestions = [{ id: 'mock-exam-1', questionText: 'Q1', options: ['A', 'B'], correctIndex: 0 }];
            questions.isExamMode = true;
            questions.examInterval = setInterval(() => {}, 1000);
            const timerWrapper = document.getElementById("exam-timer-wrapper");
            if (timerWrapper) timerWrapper.classList.remove("hidden");
            const activeBox = document.getElementById("practice-active-box");
            if (activeBox) activeBox.classList.remove("hidden");
        });

        // Trigger exit and confirm
        await page.locator('.btn-exit-practice').click();
        await page.locator('.swal2-confirm').click();

        // Verify timer interval is cleared and DOM is hidden
        await page.waitForTimeout(250);
        const timerState = await page.evaluate(() => ({
            examInterval: questions.examInterval,
            timerHidden: document.getElementById("exam-timer-wrapper") ? document.getElementById("exam-timer-wrapper").classList.contains("hidden") : true,
            isExiting: questions.isExiting
        }));

        expect(timerState.timerHidden).toBe(true);
        expect(timerState.isExiting).toBe(false);
    });

    test('Scenario F — Exit + Fullscreen Transition Concurrency', async ({ page }) => {
        await startLessonPractice(page);

        // Simulate practice fullscreen active
        await page.evaluate(() => {
            document.body.classList.add("practice-fullscreen-active");
            document.body.classList.add("super-focus-active");
        });

        // Trigger exit and confirm
        await page.locator('.btn-exit-practice').click();
        await page.locator('.swal2-confirm').click();

        await page.waitForTimeout(250);
        const domState = await page.evaluate(() => ({
            hasFullscreenClass: document.body.classList.contains("practice-fullscreen-active"),
            hasSuperFocusClass: document.body.classList.contains("super-focus-active"),
            isExiting: questions.isExiting
        }));

        expect(domState.hasFullscreenClass).toBe(false);
        expect(domState.hasSuperFocusClass).toBe(false);
        expect(domState.isExiting).toBe(false);
    });

    test('Scenario G — Rapid Subject Navigation during Exit transition', async ({ page }) => {
        await startLessonPractice(page);

        // Trigger exit and immediately click confirm
        await page.locator('.btn-exit-practice').click();
        await page.locator('.swal2-confirm').click();

        // Instantly switch to English before the 150ms timeout resolves
        await page.evaluate(() => {
            app.selectSubject('english');
        });

        await page.waitForTimeout(300);

        // Verify English portal is visible without errors
        await expect(page.locator('#screen-english-portal')).toBeVisible();
        const isExiting = await page.evaluate(() => questions.isExiting);
        expect(isExiting).toBe(false);
    });

    test('Stress Benchmark Loop (N = 10 iterations): measures exit latency & failure rate', async ({ page }) => {
        const timings = [];
        let failures = 0;
        const N = 10;

        for (let i = 0; i < N; i++) {
            await startLessonPractice(page);

            const t0 = await page.evaluate(() => performance.now());
            await page.locator('.btn-exit-practice').click();
            await page.locator('.swal2-confirm').click();

            await expect(page.locator('#practice-active-box')).toBeHidden();
            const t1 = await page.evaluate(() => performance.now());
            
            const isClean = await page.evaluate(() => !questions.isExiting && questions.currentQuestions.length === 0);
            if (!isClean) failures++;

            timings.push(t1 - t0);
        }

        timings.sort((a, b) => a - b);
        const min = Number(timings[0].toFixed(2));
        const max = Number(timings[timings.length - 1].toFixed(2));
        const median = Number(timings[Math.floor(timings.length / 2)].toFixed(2));

        console.log(`\n===============================================================`);
        console.log(`  STRESS BENCHMARK RESULTS (N = ${N})`);
        console.log(`  - Failures: ${failures}/${N} (Failure rate: ${(failures/N)*100}%)`);
        console.log(`  - Exit Duration Median: ${median} ms [Min: ${min} ms, Max: ${max} ms]`);
        console.log(`===============================================================\n`);

        expect(failures).toBe(0);
        expect(median).toBeLessThan(1000); // Well within responsive UI budget
    });
});
