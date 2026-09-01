const { test, expect } = require('@playwright/test');

test.describe('E2E Test for PDF Exam Exporter in Parent Dashboard', () => {
  
  test.beforeEach(async ({ page }) => {
    // Mở trang parent.html
    await page.goto('/parent.html');
  });

  test('Xác thực đăng nhập và kiểm tra giao diện in đề thi', async ({ page }) => {
    // 1. Nhập mã PIN và đăng nhập
    const pinInput = page.locator('#parent-pin');
    await expect(pinInput).toBeVisible();
    await pinInput.fill('123456');
    await page.locator('button:has-text("Xác nhận")').click();

    // 2. Chờ Dashboard mở khóa và kiểm tra Card in đề thi hiển thị
    const pdfExporterCard = page.locator('.parent-pdf-exporter');
    await expect(pdfExporterCard).toBeVisible({ timeout: 10000 });

    // 3. Kiểm tra các dropdown cấu hình đề thi và chọn danh mục Chủ đề
    const categorySelect = page.locator('#pdf-exam-category-select');
    await expect(categorySelect).toBeVisible();
    await categorySelect.selectOption('topic');
    await page.evaluate(() => parentDashboard.onPdfCategoryChange());

    // 4. Kiểm tra dropdown chủ đề có chứa các lựa chọn hợp lệ
    const chapterSelect = page.locator('#pdf-chapter-select');
    await expect(chapterSelect).toBeVisible();
    const chapterOptions = chapterSelect.locator('option');
    await expect(chapterOptions).not.toHaveCount(0);

    // 5. Thử điền thông tin trường học & học sinh tùy chỉnh
    await page.locator('#pdf-school-name').fill('Trường THCS Amsterdam');
    await page.locator('#pdf-student-name-input').fill('Phạm Minh Đức');

    // 6. Nhấn nút tạo đề thi
    const generateBtn = page.locator('button:has-text("Tạo & Xem trước Đề thi")');
    await expect(generateBtn).toBeVisible();
    await generateBtn.click();

    // 7. Chờ quá trình sinh đề hoàn thành (nạp đề từ server)
    // Đề xuất hiện khi #pdf-exam-preview-container được hiển thị và không còn class hidden
    const previewContainer = page.locator('#pdf-exam-preview-container');
    await expect(previewContainer).toBeVisible({ timeout: 20000 });

    // 8. Đảm bảo tờ đề thi được render có chứa đúng thông tin cấu hình
    const paper = page.locator('#pdf-exam-paper');
    await expect(paper).toBeVisible();
    await expect(paper).toContainText('Trường THCS Amsterdam');
    await expect(paper).toContainText('Phạm Minh Đức');
    await expect(paper).toContainText('ĐỀ KIỂM TRA ĐÁNH GIÁ NĂNG LỰC HỌC SINH');
    
    // Kiểm tra có đủ câu hỏi
    await expect(paper).toContainText('Câu 1:');
    
    // Kiểm tra có bảng đáp án nhanh trắc nghiệm
    await expect(paper).toContainText('BẢNG ĐIỀN ĐÁP ÁN TRẮC NGHIỆM TIẾNG ANH');

    // Kiểm tra có hướng dẫn giải chi tiết
    await expect(paper).toContainText('HƯỚNG DẪN GIẢI CHI TIẾT & AUDIO TRANSCRIPT');
  });
});
