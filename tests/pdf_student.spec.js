const { test, expect } = require('@playwright/test');

test.describe('E2E Test for PDF Exam Exporter in Student App', () => {
  
  test.beforeEach(async ({ page }) => {
    // Mở trang student.html
    await page.goto('http://localhost:3000/student.html');
  });

  test('Kiểm tra nút in đề thi giấy và xác thực PIN phụ huynh trên giao diện học sinh', async ({ page }) => {
    // Lắng nghe lỗi console từ trình duyệt để debug
    page.on('console', msg => {
      console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
    });
    page.on('pageerror', err => {
      console.error(`[Browser PageError] Exception: ${err.message}\nStack: ${err.stack}`);
    });

    // 1. Vượt qua màn hình splash screen nếu có
    const splashStartBtn = page.locator('#splash-start-btn');
    if (await splashStartBtn.isVisible()) {
      await splashStartBtn.click();
    }

    await page.evaluate(() => {
      // Thiết lập trạng thái giả lập đã hoàn thành lý thuyết bài học 'l4-bai-1' để mở khóa luyện tập
      app.state.scores['l4-bai-1'] = 85;
      app.state.completedLessonTheory = ['l4-bai-1'];
      app.startLesson('l4-bai-1');
      app.switchLessonTab('practice', true);
    });

    // 3. Đảm bảo nút "In đề thi giấy" hiển thị và đang active trong màn hình luyện tập
    const printBtn = page.locator('button:has-text("In đề thi giấy")').filter({ visible: true }).first();
    await expect(printBtn).toBeVisible({ timeout: 5000 });

    // 4. Mock hàm window.print() của browser để tránh bị treo khi chạy headless test
    await page.evaluate(() => {
      window.printCalled = false;
      window.print = () => {
        window.printCalled = true;
      };
    });

    // 5. Click nút in đề thi giấy
    await printBtn.click();

    // 6. Kiểm tra hiển thị popup nhập mã PIN phụ huynh (SweetAlert2)
    const pinInput = page.locator('.swal2-input');
    await expect(pinInput).toBeVisible();

    // Thử nhập sai mã PIN
    await pinInput.fill('wrong_pin');
    await page.locator('button:has-text("Xác nhận")').click();

    // Đảm bảo có thông báo lỗi
    await expect(page.locator('text=Mật mã phụ huynh nhập vào không chính xác!')).toBeVisible();
    await page.locator('button:has-text("OK")').click();

    // Bấm lại nút in và nhập đúng mã PIN '123456'
    await printBtn.click();
    await expect(pinInput).toBeVisible();
    await pinInput.fill('123456');
    await page.locator('button:has-text("Xác nhận")').click();

    // 7. Kiểm tra hộp thoại chọn chế độ in đề thi
    const printSolutionBtn = page.locator('button:has-text("In Đề + Đáp án")');
    await expect(printSolutionBtn).toBeVisible();
    const printOnlyExamBtn = page.locator('button:has-text("Chỉ in Đề thi")');
    await expect(printOnlyExamBtn).toBeVisible();

    // 8. Chọn chế độ "In Đề + Đáp án"
    await printSolutionBtn.click();

    // Chờ và click nút "Tiến hành In / Xuất PDF" trong modal Preview
    const confirmPrintBtn = page.locator('button:has-text("Tiến hành In / Xuất PDF")');
    await expect(confirmPrintBtn).toBeVisible({ timeout: 8000 });
    await confirmPrintBtn.click();

    // 9. Xác minh quá trình sinh đề và in ấn được kích hoạt
    // Đợi cho window.print() được gọi và container in chứa câu hỏi
    await page.waitForFunction(() => window.printCalled === true, null, { timeout: 15000 });

    // 10. Xác minh nội dung tờ đề thi in được render chính xác trong DOM
    const paper = page.locator('#print-preview-paper');
    await expect(paper).toBeAttached();
    await expect(paper).toContainText('ĐỀ THI KIỂM TRA CHUYÊN ĐỀ');
    await expect(paper).toContainText('Chuyên đề:');
    
    // Kiểm tra có đủ 10 câu hỏi trắc nghiệm được sinh ra
    await expect(paper).toContainText('Câu 1:');
    await expect(paper).toContainText('Câu 10:');
    
    // Kiểm tra có bảng đáp án nhanh trắc nghiệm
    await expect(paper).toContainText('BẢNG ĐIỀN ĐÁP ÁN TRẮC NGHIỆM');

    // Kiểm tra có lời giải chi tiết (vì đã chọn in kèm đáp án)
    await expect(paper).toContainText('HƯỚNG DẪN GIẢI CHI TIẾT & ĐÁP ÁN ĐỀ THI');
  });

  test('Kiểm tra in đề thi theo cấp độ Cơ bản trong Dashboard', async ({ page }) => {
    // 1. Vượt qua màn hình splash screen nếu có
    const splashStartBtn = page.locator('#splash-start-btn');
    if (await splashStartBtn.isVisible()) {
      await splashStartBtn.click();
    }

    // 2. Sử dụng evaluate để chọn bài học đầu tiên và chuyển sang tab luyện tập
    await page.evaluate(() => {
      app.state.scores['l4-bai-1'] = 85;
      app.state.completedLessonTheory = ['l4-bai-1'];
      app.startLesson('l4-bai-1');
      app.switchLessonTab('practice', true);
    });

    // 3. Đảm bảo nút in đề của cấp độ Cơ bản hiển thị
    // Nút in Cơ bản có onclick chứa "showStudentPrintPromptWithLevel('co-ban')"
    const coBanPrintBtn = page.locator('button[onclick*="co-ban"]').filter({ visible: true }).first();
    await expect(coBanPrintBtn).toBeVisible({ timeout: 5000 });

    // 4. Mock hàm window.print()
    await page.evaluate(() => {
      window.printCalled = false;
      window.print = () => {
        window.printCalled = true;
      };
    });

    // 5. Click in đề Cơ bản
    await coBanPrintBtn.click();

    // 6. Nhập đúng mã PIN '123456'
    const pinInput = page.locator('.swal2-input');
    await expect(pinInput).toBeVisible();
    await pinInput.fill('123456');
    await page.locator('button:has-text("Xác nhận")').click();

    // 7. Chọn chế độ "Chỉ in Đề thi" (không kèm lời giải)
    const printOnlyExamBtn = page.locator('button:has-text("Chỉ in Đề thi")');
    await expect(printOnlyExamBtn).toBeVisible();
    await printOnlyExamBtn.click();

    // Chờ và click nút "Tiến hành In / Xuất PDF" trong modal Preview
    const confirmPrintBtn = page.locator('button:has-text("Tiến hành In / Xuất PDF")');
    await expect(confirmPrintBtn).toBeVisible({ timeout: 8000 });
    await confirmPrintBtn.click();

    // 8. Xác minh quá trình sinh đề và in ấn được kích hoạt
    await page.waitForFunction(() => window.printCalled === true, null, { timeout: 15000 });

    // 9. Xác minh nội dung tờ đề thi in được render chính xác trong DOM
    const paper = page.locator('#print-preview-paper');
    await expect(paper).toBeAttached();
    await expect(paper).toContainText('ĐỀ THI KIỂM TRA CHUYÊN ĐỀ');
    
    // Kiểm tra có đủ 10 câu hỏi trắc nghiệm được sinh ra
    await expect(paper).toContainText('Câu 1:');
    await expect(paper).toContainText('Câu 10:');
    
    // Đảm bảo KHÔNG có phần đáp án giải chi tiết vì đã chọn "Chỉ in Đề thi"
    await expect(paper).not.toContainText('HƯỚNG DẪN GIẢI CHI TIẾT & ĐÁP ÁN ĐỀ THI');
  });
});
