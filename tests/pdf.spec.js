const { test, expect } = require('@playwright/test');

test.describe('E2E Test for PDF Exam Exporter in Parent Dashboard', () => {
  
  test.beforeEach(async ({ page }) => {
    // Mở trang parent.html
    await page.goto('http://localhost:3000/parent.html');
  });

  test('Xác thực đăng nhập và kiểm tra giao diện in đề thi', async ({ page }) => {
    // 1. Nhập mã PIN và đăng nhập
    const pinInput = page.locator('#parent-pin');
    await expect(pinInput).toBeVisible();
    await pinInput.fill('haidangppk');
    await page.locator('button:has-text("Xác nhận")').click();

    // 2. Chờ Dashboard mở khóa và kiểm tra Card in đề thi hiển thị
    const pdfExporterCard = page.locator('.parent-pdf-exporter');
    await expect(pdfExporterCard).toBeVisible();

    // 3. Kiểm tra các dropdown chọn lớp học
    const classSelect = page.locator('#pdf-class-select');
    await expect(classSelect).toBeVisible();
    await expect(classSelect).toHaveValue('4'); // Mặc định lớp học sinh được nạp ban đầu (Lớp 4)

    // 4. Kiểm tra dropdown chương và bài học có chứa các lựa chọn
    const chapterSelect = page.locator('#pdf-chapter-select');
    await expect(chapterSelect).toBeVisible();
    
    // Đảm bảo các dropdown có ít nhất 1 option
    const chapterOptions = chapterSelect.locator('option');
    await expect(chapterOptions).not.toHaveCount(0);

    const lessonSelect = page.locator('#pdf-lesson-select');
    await expect(lessonSelect).toBeVisible();
    const lessonOptions = lessonSelect.locator('option');
    await expect(lessonOptions).not.toHaveCount(0);

    // 5. Thử điền thông tin trường học & học sinh tùy chỉnh
    await page.locator('#pdf-school-name').fill('Trường THCS Amsterdam');
    await page.locator('#pdf-student-name-input').fill('Phạm Minh Đức');

    // 6. Nhấn nút tạo đề thi
    const generateBtn = page.locator('button:has-text("Tạo & Xem trước Đề thi")');
    await expect(generateBtn).toBeVisible();
    await generateBtn.click();

    // 7. Chờ quá trình sinh đề hoàn thành (nạp đề từ server + Worker sinh số)
    // Đề xuất hiện khi #pdf-exam-preview-container được hiển thị và không còn class hidden
    const previewContainer = page.locator('#pdf-exam-preview-container');
    await expect(previewContainer).toBeVisible({ timeout: 15000 });

    // 8. Đảm bảo tờ đề thi được render có chứa đúng thông tin cấu hình
    const paper = page.locator('#pdf-exam-paper');
    await expect(paper).toBeVisible();
    await expect(paper).toContainText('Trường THCS Amsterdam');
    await expect(paper).toContainText('Phạm Minh Đức');
    await expect(paper).toContainText('ĐỀ THI KIỂM TRA CHUYÊN ĐỀ');
    
    // Kiểm tra có đủ 10 câu hỏi
    await expect(paper).toContainText('Câu 1:');
    await expect(paper).toContainText('Câu 10:');
    
    // Kiểm tra có bảng đáp án nhanh trắc nghiệm
    await expect(paper).toContainText('BẢNG ĐIỀN ĐÁP ÁN TRẮC NGHIỆM');

    // Kiểm tra có hướng dẫn giải chi tiết
    await expect(paper).toContainText('HƯỚNG DẪN GIẢI CHI TIẾT & ĐÁP ÁN ĐỀ THI');
  });
});
