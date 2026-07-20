# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\kiosk.spec.js >> E2E Integration Test for Student App and Offline Sync Fallback >> Ứng dụng tải thành công và hiển thị giao diện học tập
- Location: tests\kiosk.spec.js:10:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/student.html
Call log:
  - navigating to "http://localhost:3000/student.html", waiting until "load"

```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | test.describe('E2E Integration Test for Student App and Offline Sync Fallback', () => {
  4   |   
  5   |   test.beforeEach(async ({ page }) => {
  6   |     // Mở trang học sinh student.html từ local server
> 7   |     await page.goto('http://localhost:3000/student.html');
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/student.html
  8   |   });
  9   | 
  10  |   test('Ứng dụng tải thành công và hiển thị giao diện học tập', async ({ page }) => {
  11  |     // Kiểm tra title trang
  12  |     await expect(page).toHaveTitle(/Toán (Lớp )?6/i);
  13  | 
  14  |     // Kiểm tra nút bắt đầu học hoặc màn hình splash screen biến mất
  15  |     const splashStartBtn = page.locator('#splash-start-btn');
  16  |     if (await splashStartBtn.isVisible()) {
  17  |       await splashStartBtn.click();
  18  |     }
  19  | 
  20  |     // Đảm bảo timeline bài học được hiển thị
  21  |     const timelineContainer = page.locator('#screen-timeline');
  22  |     await expect(timelineContainer).toBeVisible();
  23  |   });
  24  | 
  25  |   test('Offline Fallback: Tự lưu LocalStorage khi mất kết nối mạng và tự đồng bộ khi online lại', async ({ page, context }) => {
  26  |     // Bỏ qua màn hình splash screen nếu có
  27  |     const splashStartBtn = page.locator('#splash-start-btn');
  28  |     if (await splashStartBtn.isVisible()) {
  29  |       await splashStartBtn.click();
  30  |     }
  31  | 
  32  |     // 1. Giả lập học sinh làm bài tập và hoàn thành
  33  |     // Giả lập trực tiếp tác động thay đổi XP của học sinh trong app state để test tính năng save
  34  |     await page.evaluate(async () => {
  35  |       if (window.app) {
  36  |         window.app.state.xp += 50; // Cộng thêm 50 XP
  37  |         window.app.state.streak += 1;
  38  |         // Kích hoạt lưu tiến độ
  39  |         await window.app.saveProgress();
  40  |       }
  41  |     });
  42  | 
  43  |     // 2. Chuyển browser sang chế độ Offline (ngắt kết nối mạng)
  44  |     console.log('[Test] Ngắt mạng browser sang Offline mode...');
  45  |     await context.setOffline(true);
  46  | 
  47  |     // 3. Học sinh tiếp tục hoàn thành thêm bài học (XP tăng tiếp) và kích hoạt lưu
  48  |     await page.evaluate(async () => {
  49  |       if (window.app) {
  50  |         window.app.state.xp += 100;
  51  |         await window.app.saveProgress(); // Gọi lưu lúc không có mạng
  52  |       }
  53  |     });
  54  | 
  55  |     // 4. Kiểm tra LocalStorage xem có lưu dữ liệu offline bẩn (dirty) hay không
  56  |     const isDirty = await page.evaluate(() => {
  57  |       const key = window.app.getLocalStorageKey();
  58  |       return localStorage.getItem(key + '_offline_dirty');
  59  |     });
  60  |     expect(isDirty).toBe('true');
  61  | 
  62  |     const offlineDataRaw = await page.evaluate(() => {
  63  |       const key = window.app.getLocalStorageKey();
  64  |       return localStorage.getItem(key + '_offline_data');
  65  |     });
  66  |     expect(offlineDataRaw).toBeDefined();
  67  |     const offlineData = JSON.parse(offlineDataRaw);
  68  |     expect(offlineData.xp).toBeGreaterThan(0);
  69  | 
  70  |     // 5. Lắng nghe API request POST /api/save-progress để xác nhận khi online lại có gửi đồng bộ không
  71  |     const saveRequestPromise = page.waitForRequest(request => 
  72  |       request.url().includes('/api/save-progress') && request.method() === 'POST'
  73  |     );
  74  | 
  75  |     // 6. Bật mạng online trở lại
  76  |     console.log('[Test] Phục hồi kết nối mạng sang Online mode...');
  77  |     await context.setOffline(false);
  78  | 
  79  |     // Trình duyệt tự động kích hoạt sự kiện 'online'
  80  |     await page.evaluate(() => {
  81  |         window.dispatchEvent(new Event('online'));
  82  |     });
  83  | 
  84  |     // Chờ request đồng bộ được gửi thành công
  85  |     const request = await saveRequestPromise;
  86  |     console.log('[Test] Phát hiện request đồng bộ offline tự động gửi lên SQLite.');
  87  |     expect(request).toBeDefined();
  88  | 
  89  |     // 7. Xác minh LocalStorage đã dọn dẹp cờ dirty sau khi đồng bộ thành công
  90  |     await page.waitForFunction(() => {
  91  |       const key = window.app.getLocalStorageKey();
  92  |       return localStorage.getItem(key + '_offline_dirty') === null;
  93  |     });
  94  | 
  95  |     const isDirtyPostSync = await page.evaluate(() => {
  96  |       const key = window.app.getLocalStorageKey();
  97  |       return localStorage.getItem(key + '_offline_dirty');
  98  |     });
  99  |     expect(isDirtyPostSync).toBeNull();
  100 |   });
  101 | });
  102 | 
```