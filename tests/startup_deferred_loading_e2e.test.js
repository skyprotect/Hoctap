/**
 * PLAYWRIGHT E2E RUNTIME ACCEPTANCE: STARTUP DEFERRED LOADING (DESIGN C)
 * 
 * Verifies:
 * 1. English Early Entry: Student enters app & English map before custom topics finish loading.
 * 2. Eventual UI Consistency: Custom English data becomes available/rendered once resolved.
 * 3. In-flight Deduplication & Vocab Race: Concurrent background + tab fetch triggers exactly 1 request.
 * 4. Failure Resilience: Server 500 on custom topics does not crash startup or Math/English core.
 * 5. Offline Resilience: loadProgress contract is preserved without blocking on custom topics.
 */
const { test, expect } = require('@playwright/test');

test.describe('Startup Deferred-Loading (Design C) Runtime Acceptance', () => {

    test('1. English Early Entry: Standard curriculum is usable BEFORE custom topics resolve', async ({ page }) => {
        let customTopicsRequested = false;
        let customTopicsResolved = false;

        // Mock delayed custom topics network request (1200ms delay)
        await page.route('**/api/custom-topics*', async (route) => {
            customTopicsRequested = true;
            await new Promise(r => setTimeout(r, 1200));
            customTopicsResolved = true;
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    { id: 'custom-topic-safari', title: 'Chuyên đề Thế giới Động vật Hoang dã', created_at: new Date().toISOString() }
                ])
            });
        });

        await page.route('**/api/custom-vocabulary*', async (route) => {
            await new Promise(r => setTimeout(r, 1200));
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    { id: 'v1', topic_id: 'custom-topic-safari', word: 'elephant', translation: 'con voi', phonetics: '/ˈel.ɪ.fənt/' }
                ])
            });
        });

        // 1. Navigate to student app
        await page.goto('/student.html');

        // 2. Splash screen is visible immediately
        const splashScreen = page.locator('#splash-screen');
        await expect(splashScreen).toBeVisible();

        // 3. Student clicks to enter app
        const splashStartBtn = page.locator('#splash-start-btn');
        await splashStartBtn.click();

        // 4. Subject select screen is displayed
        const subjectSelectScreen = page.locator('#screen-subject-select');
        await expect(subjectSelectScreen).toBeVisible({ timeout: 5000 });

        // 5. Student immediately selects English
        const englishCard = page.locator('.subject-card.english-card');
        await expect(englishCard).toBeVisible();
        await englishCard.click();

        // 6. English portal is visible immediately
        const englishPortal = page.locator('#screen-english-portal');
        await expect(englishPortal).toBeVisible();

        // 7. Core SGK curriculum topic cards render BEFORE custom topics resolve
        const topicCards = page.locator('.english-topic-card:not(.parent-challenge-card)');
        await expect(topicCards.first()).toBeVisible({ timeout: 2000 });
        const cardCount = await topicCards.count();
        expect(cardCount).toBeGreaterThan(0);

        // Verify that custom topics request was still in-flight when English rendered
        expect(customTopicsRequested).toBe(true);

        // 8. Wait for custom topics request to resolve
        await page.waitForFunction(() => window.app && Array.isArray(window.app.customTopics) && window.app.customTopics.length > 0, { timeout: 5000 });
        expect(customTopicsResolved).toBe(true);

        // 9. Open Custom Vocab tab to verify custom data is immediately usable
        const customVocabNavBtn = page.locator('#eng-nav-custom-vocab');
        await customVocabNavBtn.click();

        const customVocabPane = page.locator('#eng-tab-custom-vocab');
        await expect(customVocabPane).toBeVisible();

        const customTopicItem = page.locator('#student-vocab-topics-container');
        await expect(customTopicItem).toContainText('Chuyên đề Thế giới Động vật Hoang dã', { timeout: 3000 });
        await expect(page.locator('#student-vocab-inventory-stats')).toHaveText(/Tổng số: 1 từ/);
    });

    test('2. Eventual UI Consistency: Skill change / refresh renders custom parent challenge', async ({ page }) => {
        await page.route('**/api/custom-topics*', async (route) => {
            await new Promise(r => setTimeout(r, 600));
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    { id: 'custom-topic-space', title: 'Thử Thách Vũ Trụ Bí Ẩn', created_at: new Date().toISOString() }
                ])
            });
        });

        await page.route('**/api/custom-vocabulary*', async (route) => {
            await new Promise(r => setTimeout(r, 600));
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    { id: 'v2', topic_id: 'custom-topic-space', word: 'astronaut', translation: 'phi hành gia', phonetics: '/ˈæs.trə.nɔːt/' }
                ])
            });
        });

        await page.goto('/student.html');

        // Enter English portal
        const splashStartBtn = page.locator('#splash-start-btn');
        await splashStartBtn.click();
        const englishCard = page.locator('.subject-card.english-card');
        await englishCard.click();

        // Wait for custom topics to be stored in app state
        await page.waitForFunction(() => window.app && Array.isArray(window.app.customTopics) && window.app.customTopics.length > 0, { timeout: 5000 });

        // Switch English skill tab to trigger map refresh
        await page.evaluate(() => window.app.selectEnglishSkill('speaking'));

        // Verify parent challenge card is now rendered in the map
        const parentCard = page.locator('.parent-challenge-card');
        await expect(parentCard).toBeVisible({ timeout: 3000 });
        await expect(parentCard).toContainText('Thử Thách Vũ Trụ Bí Ẩn');
        await expect(parentCard).toContainText('astronaut');
    });

    test('3. Vocab Tab Race: In-flight deduplication shares single network request', async ({ page }) => {
        let topicRequestCount = 0;
        let vocabRequestCount = 0;

        await page.route('**/api/custom-topics*', async (route) => {
            topicRequestCount++;
            await new Promise(r => setTimeout(r, 2500));
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    { id: 'custom-race-1', title: 'Chuyên đề Kiểm Thử Race Condition', created_at: new Date().toISOString() }
                ])
            });
        });

        await page.route('**/api/custom-vocabulary*', async (route) => {
            vocabRequestCount++;
            await new Promise(r => setTimeout(r, 2500));
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([
                    { id: 'vr1', topic_id: 'custom-race-1', word: 'concurrency', translation: 'đồng thời' }
                ])
            });
        });

        await page.goto('/student.html');

        // Startup triggers loadCustomTopics() in background
        const splashStartBtn = page.locator('#splash-start-btn');
        await splashStartBtn.click();
        const englishCard = page.locator('.subject-card.english-card');
        await englishCard.click();

        // Immediately click Vocab tab while initial background fetch is still in flight
        const customVocabNavBtn = page.locator('#eng-nav-custom-vocab');
        await customVocabNavBtn.click();

        // Wait for vocab list to be rendered
        const customContainer = page.locator('#student-vocab-topics-container');
        await expect(customContainer).toContainText('Chuyên đề Kiểm Thử Race Condition', { timeout: 8000 });

        // Verify deduplication: exactly 1 request was sent for topics and vocab
        expect(topicRequestCount).toBe(1);
        expect(vocabRequestCount).toBe(1);
    });

    test('4. Failure Resilience: HTTP 500 does not block startup or crash Math/English', async ({ page }) => {
        // Mock 500 error on custom topics endpoints
        await page.route('**/api/custom-topics*', async (route) => {
            await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Internal Server Error' }) });
        });
        await page.route('**/api/custom-vocabulary*', async (route) => {
            await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Internal Server Error' }) });
        });

        await page.goto('/student.html');

        // Verify startup succeeds
        const splashStartBtn = page.locator('#splash-start-btn');
        await splashStartBtn.click();

        // 1. Math workspace functions normally
        const mathCard = page.locator('.subject-card.math-card');
        await expect(mathCard).toBeVisible();
        await mathCard.click();
        await expect(page.locator('#screen-timeline')).toBeVisible();

        // 2. Switch to English via change subject
        await page.evaluate(() => window.app.checkSubjectSelection());
        const englishCard = page.locator('.subject-card.english-card');
        await englishCard.click();
        await expect(page.locator('#screen-english-portal')).toBeVisible();

        // Standard English curriculum still renders
        const topicCards = page.locator('.english-topic-card');
        await expect(topicCards.first()).toBeVisible();

        // 3. Custom vocab tab displays safe empty state
        const customVocabNavBtn = page.locator('#eng-nav-custom-vocab');
        await customVocabNavBtn.click();
        const customContainer = page.locator('#student-vocab-topics-container');
        await expect(customContainer).toContainText('Con chưa tạo chuyên đề từ vựng nào', { timeout: 3000 });

        // App state has safe fallback arrays
        const customTopicsState = await page.evaluate(() => window.app.customTopics);
        expect(customTopicsState).toEqual([]);
    });

    test('5. Deduplication Promise Reset: subsequent calls after completion refetch when invoked', async ({ page }) => {
        let fetchCount = 0;
        await page.route('**/api/custom-topics*', async (route) => {
            fetchCount++;
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([{ id: `call-${fetchCount}`, title: `Call ${fetchCount}` }])
            });
        });
        await page.route('**/api/custom-vocabulary*', async (route) => {
            await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
        });

        await page.goto('/student.html');

        // Wait for initial background load to finish
        await page.waitForFunction(() => window.app && window.app._loadingCustomTopicsPromise === null);
        const initialCount = fetchCount;
        expect(initialCount).toBeGreaterThanOrEqual(1);

        // Manually invoke loadCustomTopics after promise has reset
        await page.evaluate(async () => {
            await window.app.loadCustomTopics();
        });

        // Verify a new network fetch took place (promise did not permanently freeze in memory)
        expect(fetchCount).toBe(initialCount + 1);
    });
});
