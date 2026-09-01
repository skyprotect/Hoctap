/**
 * PLAYWRIGHT E2E TEST: EVALUATION MODAL REAL USER INTERACTIONS
 * Verifies physical pointer clicks on X, Đóng, Backdrop, and multi-open stability on real Chrome
 */
const { test, expect } = require('@playwright/test');

test.describe("PLAYWRIGHT E2E: Evaluation Modal Physical Click & Exit Tests", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/student.html');

        // Bỏ qua PIN bảo vệ phụ huynh cho test E2E
        await page.evaluate(() => {
            sessionStorage.setItem("adminToken", "mock_admin_token_e2e");
        });

        // Vượt qua màn hình splash screen nếu có
        const splashBtn = page.locator('#splash-start-btn');
        if (await splashBtn.isVisible()) {
            await splashBtn.click();
            await expect(page.locator('#splash-screen')).toBeHidden({ timeout: 5000 }).catch(() => {});
        }

        const studentCard = page.locator('.student-select-card').first();
        if (await studentCard.isVisible()) {
            await studentCard.click();
            await page.waitForTimeout(300);
        }
    });

    test("1. Nút Đánh Giá ở Header mở được Evaluation Modal", async ({ page }) => {
        const evalBtn = page.locator('#btn-evaluation');
        await expect(evalBtn).toBeVisible({ timeout: 5000 });
        await evalBtn.click();

        const modal = page.locator('#evaluation-modal');
        await expect(modal).toBeVisible({ timeout: 5000 });
        await expect(modal).not.toHaveClass(/hidden/);
    });

    test("2. Click vật lý nút X (#btn-eval-close-x) đóng hoàn toàn Modal", async ({ page }) => {
        const evalBtn = page.locator('#btn-evaluation');
        await expect(evalBtn).toBeVisible({ timeout: 5000 });
        await evalBtn.click();

        const modal = page.locator('#evaluation-modal');
        await expect(modal).toBeVisible({ timeout: 5000 });

        const closeX = page.locator('#btn-eval-close-x');
        await closeX.click();

        await expect(modal).toHaveClass(/hidden/);
    });

    test("3. Click vật lý nút 'Đóng' (#btn-eval-close) đóng hoàn toàn Modal", async ({ page }) => {
        const evalBtn = page.locator('#btn-evaluation');
        await expect(evalBtn).toBeVisible({ timeout: 5000 });
        await evalBtn.click();

        const modal = page.locator('#evaluation-modal');
        await expect(modal).toBeVisible({ timeout: 5000 });

        const closeBtn = page.locator('#btn-eval-close');
        await closeBtn.click();

        await expect(modal).toHaveClass(/hidden/);
    });

    test("4. Click Backdrop đóng hoàn toàn Modal", async ({ page }) => {
        const evalBtn = page.locator('#btn-evaluation');
        await expect(evalBtn).toBeVisible({ timeout: 5000 });
        await evalBtn.click();

        const modal = page.locator('#evaluation-modal');
        await expect(modal).toBeVisible({ timeout: 5000 });

        // Click outside modal card on the backdrop overlay
        await page.mouse.click(50, 50);

        await expect(modal).toHaveClass(/hidden/);
    });

    test("5. Mở lại Modal nhiều lần liên tiếp không bị xung đột DOM", async ({ page }) => {
        const evalBtn = page.locator('#btn-evaluation');
        const modal = page.locator('#evaluation-modal');
        const closeBtn = page.locator('#btn-eval-close');

        for (let i = 0; i < 3; i++) {
            await expect(evalBtn).toBeVisible({ timeout: 5000 });
            await evalBtn.click();
            await expect(modal).toBeVisible({ timeout: 5000 });
            await expect(modal).not.toHaveClass(/hidden/);

            await closeBtn.click();
            await expect(modal).toHaveClass(/hidden/);
        }
    });
});
