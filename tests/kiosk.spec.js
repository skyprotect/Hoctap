const { test, expect } = require('@playwright/test');

test.describe('E2E Integration Test for Student App and Offline Sync Fallback', () => {
  
  test.beforeEach(async ({ page }) => {
    // Mở trang học sinh student.html từ local server
    await page.goto('http://localhost:3000/student.html');
  });

  test('Ứng dụng tải thành công và hiển thị giao diện học tập', async ({ page }) => {
    // Kiểm tra title trang
    await expect(page).toHaveTitle(/Toán (Lớp )?6/i);

    // Kiểm tra nút bắt đầu học hoặc màn hình splash screen biến mất
    const splashStartBtn = page.locator('#splash-start-btn');
    if (await splashStartBtn.isVisible()) {
      await splashStartBtn.click();
    }

    // Đảm bảo timeline bài học được hiển thị
    const timelineContainer = page.locator('#screen-timeline');
    await expect(timelineContainer).toBeVisible();
  });

  test('Offline Fallback: Tự lưu LocalStorage khi mất kết nối mạng và tự đồng bộ khi online lại', async ({ page, context }) => {
    // Bỏ qua màn hình splash screen nếu có
    const splashStartBtn = page.locator('#splash-start-btn');
    if (await splashStartBtn.isVisible()) {
      await splashStartBtn.click();
    }

    // 1. Giả lập học sinh làm bài tập và hoàn thành
    // Giả lập trực tiếp tác động thay đổi XP của học sinh trong app state để test tính năng save
    await page.evaluate(async () => {
      if (window.app) {
        window.app.state.xp += 50; // Cộng thêm 50 XP
        window.app.state.streak += 1;
        // Kích hoạt lưu tiến độ
        await window.app.saveProgress();
      }
    });

    // 2. Chuyển browser sang chế độ Offline (ngắt kết nối mạng)
    console.log('[Test] Ngắt mạng browser sang Offline mode...');
    await context.setOffline(true);

    // 3. Học sinh tiếp tục hoàn thành thêm bài học (XP tăng tiếp) và kích hoạt lưu
    await page.evaluate(async () => {
      if (window.app) {
        window.app.state.xp += 100;
        await window.app.saveProgress(); // Gọi lưu lúc không có mạng
      }
    });

    // 4. Kiểm tra LocalStorage xem có lưu dữ liệu offline bẩn (dirty) hay không
    const isDirty = await page.evaluate(() => {
      const key = window.app.getLocalStorageKey();
      return localStorage.getItem(key + '_offline_dirty');
    });
    expect(isDirty).toBe('true');

    const offlineDataRaw = await page.evaluate(() => {
      const key = window.app.getLocalStorageKey();
      return localStorage.getItem(key + '_offline_data');
    });
    expect(offlineDataRaw).toBeDefined();
    const offlineData = JSON.parse(offlineDataRaw);
    expect(offlineData.xp).toBeGreaterThan(0);

    // 5. Lắng nghe API request POST /api/save-progress để xác nhận khi online lại có gửi đồng bộ không
    const saveRequestPromise = page.waitForRequest(request => 
      request.url().includes('/api/save-progress') && request.method() === 'POST'
    );

    // 6. Bật mạng online trở lại
    console.log('[Test] Phục hồi kết nối mạng sang Online mode...');
    await context.setOffline(false);

    // Trình duyệt tự động kích hoạt sự kiện 'online'
    await page.evaluate(() => {
        window.dispatchEvent(new Event('online'));
    });

    // Chờ request đồng bộ được gửi thành công
    const request = await saveRequestPromise;
    console.log('[Test] Phát hiện request đồng bộ offline tự động gửi lên SQLite.');
    expect(request).toBeDefined();

    // 7. Xác minh LocalStorage đã dọn dẹp cờ dirty sau khi đồng bộ thành công
    await page.waitForFunction(() => {
      const key = window.app.getLocalStorageKey();
      return localStorage.getItem(key + '_offline_dirty') === null;
    });

    const isDirtyPostSync = await page.evaluate(() => {
      const key = window.app.getLocalStorageKey();
      return localStorage.getItem(key + '_offline_dirty');
    });
    expect(isDirtyPostSync).toBeNull();
  });
});
