/**
 * PLAYWRIGHT E2E TEST: EVALUATION MODAL REAL USER INTERACTIONS
 * Verifies physical pointer clicks on X, Đóng, Backdrop, and ESC key on real Chrome
 */
const { chromium } = require('playwright-core');
const http = require('http');
const path = require('path');
const fs = require('fs');

describe("PLAYWRIGHT E2E: Evaluation Modal Physical Click & Exit Tests", () => {
    let server;
    let browser;
    let page;
    const PORT = 3105;
    const chromePath = 'C:\\Users\\skypr\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe';

    beforeAll(async () => {
        require('ts-node').register({ transpileOnly: true });
        const express = require('express');
        const cors = require('cors');
        const app = express();
        app.use(cors());
        app.use(express.json({ limit: '10mb' }));
        app.use(express.static(path.resolve(__dirname, '..')));

        app.use('/api/auth', require('../server/routes/auth.routes'));
        app.use('/api', require('../server/routes/auth.routes'));
        app.use('/api', require('../server/routes/student.routes'));
        app.use('/api', require('../server/routes/quiz.routes'));
        app.use('/api', require('../server/routes/admin.routes'));
        app.use('/api', require('../server/routes/system.routes'));

        server = http.createServer(app);
        await new Promise((resolve) => server.listen(PORT, resolve));

        if (fs.existsSync(chromePath)) {
            browser = await chromium.launch({
                executablePath: chromePath,
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
            page = await context.newPage();
            await page.goto(`http://localhost:${PORT}/student.html`, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(1000);

            // Handle Splash & Student select
            const splashBtn = page.locator('#splash-start-btn');
            if (await splashBtn.isVisible()) {
                await splashBtn.click();
                await page.waitForTimeout(300);
            }
            const studentCard = page.locator('.student-select-card').first();
            if (await studentCard.isVisible()) {
                await studentCard.click();
                await page.waitForTimeout(300);
            }
        }
    }, 30000);

    afterAll(async () => {
        if (browser) await browser.close();
        if (server) server.close();
    });

    test("1. Nút Đánh Giá ở Header mở được Evaluation Modal", async () => {
        if (!browser) return;
        const evalBtn = page.locator('#btn-evaluation');
        await evalBtn.waitFor({ state: 'visible', timeout: 5000 });
        await evalBtn.click();
        await page.waitForTimeout(500);

        const isVisible = await page.evaluate(() => {
            const m = document.getElementById('evaluation-modal');
            return m && !m.classList.contains('hidden') && window.getComputedStyle(m).display !== 'none';
        });
        expect(isVisible).toBe(true);
    });

    test("2. Click vật lý nút X (#btn-eval-close-x) đóng hoàn toàn Modal", async () => {
        if (!browser) return;
        const closeX = page.locator('#btn-eval-close-x');
        await closeX.click();
        await page.waitForTimeout(300);

        const isHidden = await page.evaluate(() => {
            const m = document.getElementById('evaluation-modal');
            return m && (m.classList.contains('hidden') || window.getComputedStyle(m).display === 'none');
        });
        expect(isHidden).toBe(true);
    });

    test("3. Click vật lý nút 'Đóng' (#btn-eval-close) đóng hoàn toàn Modal", async () => {
        if (!browser) return;
        // Reopen
        await page.locator('#btn-evaluation').click();
        await page.waitForTimeout(300);

        const closeBtn = page.locator('#btn-eval-close');
        await closeBtn.click();
        await page.waitForTimeout(300);

        const isHidden = await page.evaluate(() => {
            const m = document.getElementById('evaluation-modal');
            return m && (m.classList.contains('hidden') || window.getComputedStyle(m).display === 'none');
        });
        expect(isHidden).toBe(true);
    });

    test("4. Nhấn phím Escape (ESC) đóng hoàn toàn Modal", async () => {
        if (!browser) return;
        // Reopen
        await page.locator('#btn-evaluation').click();
        await page.waitForTimeout(300);

        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);

        const isHidden = await page.evaluate(() => {
            const m = document.getElementById('evaluation-modal');
            return m && (m.classList.contains('hidden') || window.getComputedStyle(m).display === 'none');
        });
        expect(isHidden).toBe(true);
    });

    test("5. Click Backdrop đóng hoàn toàn Modal", async () => {
        if (!browser) return;
        // Reopen
        await page.locator('#btn-evaluation').click();
        await page.waitForTimeout(300);

        // Click on left backdrop area (outside modal card)
        await page.mouse.click(100, 400);
        await page.waitForTimeout(300);

        const isHidden = await page.evaluate(() => {
            const m = document.getElementById('evaluation-modal');
            return m && (m.classList.contains('hidden') || window.getComputedStyle(m).display === 'none');
        });
        expect(isHidden).toBe(true);
    });
});
