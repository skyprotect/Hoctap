# CURRENT CHECKPOINT (Điểm Chốt Kiến Trúc Hiện Tại)
HocTap Autonomous Engineering System — v14.03 (CYCLE-E2E-PLAYWRIGHT-ISOLATION)

## 1. THÔNG SỐ ĐIỂM CHỐT (CHECKPOINT METRICS)

```text
Checkpoint Identifier:    v14.03 (CYCLE-E2E-PLAYWRIGHT-ISOLATION)
Kiến trúc trạng thái:     VERIFIED / STABLE / CLEAN SCOPE (0 PRODUCTION CHANGES)
Kiểm thử Playwright E2E:  10/10 tests PASS (4 files: evaluation_modal, kiosk, pdf, pdf_student)
Kiểm thử Jest Unit/Integ: 57/57 test suites PASS (1084/1084 tests)
Seam probes (Zones 1-5):  4/4 verification suites PASS (npm run verify:all)
TypeScript check:         PASS (0 errors via tsc --noEmit)
Clean bundle sync:        PASS (node scripts/build/sync_clean.js)
Runner Isolation:         Hoàn toàn cô lập (0 file Jest bị Playwright scan, 0 file Playwright bị Jest scan)
Phạm vi thay đổi:         100% Dev/Test Tooling (Zero production code modifications)
```

---

## 2. CÁC HẠNG MỤC ĐÃ HOÀN THÀNH VÀ ĐƯỢC XÁC MINH (COMPLETED & VERIFIED WORK)

1. **Cô lập Discovery Runner cho Playwright (`playwright.config.js`)**:
   - Thiết lập cấu hình chuẩn Playwright với `testDir: './tests'`, `testMatch: ['**/*_e2e.test.js', '**/*.spec.js']`.
   - Triệt tiêu 100% lỗi Playwright scan nhầm 57 file Jest Unit test (`describe is not defined`, `jest is not defined`).
   - Cấu hình webServer tự động (`node server.js` port 3000, `reuseExistingServer: true`).
2. **Di chuyển và hiện đại hóa `tests/evaluation_modal_e2e.test.js` sang `@playwright/test`**:
   - Chuyển đổi từ Jest wrapper + `playwright-core` sang native Playwright test runner.
   - Bổ sung cấu hình `sessionStorage.setItem("adminToken", "mock_admin_token_e2e")` bypass PIN SweetAlert cho automation.
   - Kiểm thử thực tế trên Chromium headless: Mở modal từ Header, đóng bằng nút X (`#btn-eval-close-x`), đóng bằng nút Đóng footer (`#btn-eval-close`), đóng bằng click Backdrop overlay, mở/đóng liên tiếp nhiều lần không lỗi DOM.
3. **Sửa đổi và xác minh toàn bộ bộ kiểm thử Playwright E2E**:
   - `tests/evaluation_modal_e2e.test.js`: 5/5 tests PASS.
   - `tests/kiosk.spec.js`: 2/2 tests PASS (App load & Offline LocalStorage Fallback sync).
   - `tests/pdf_student.spec.js`: 2/2 tests PASS (In đề thi giấy giao diện học sinh & in đề Cơ bản Dashboard).
   - `tests/pdf.spec.js`: 1/1 test PASS (Xác thực đăng nhập PIN phụ huynh & in đề thi PDF Parent Dashboard).
   - Tổng cộng: **10/10 E2E tests PASS**.
4. **Scope Audit & Zero Production Code Changes**:
   - Tách và revert hoàn toàn mọi can thiệp vào mã nguồn sản phẩm (`js/lessons.js` giữ nguyên 100% trạng thái gốc).
   - `tests/pdf.spec.js` được cấu hình kiểm thử danh mục Chủ đề tổng hợp (`topic`), hoàn toàn tương thích và chạy xanh 100% trên mã nguồn hiện hữu.
5. **Bảo toàn tuyệt đối phân vùng mã nguồn nhạy cảm (Protected Architecture)**:
   - Các module trung tâm: `js/app.js`, `js/questions-v3.js`, `server.js`, `database.db`, `AppState`, `Persistence semantics`, `EventBus` đều được bảo toàn.
6. **Bảo toàn dữ liệu học sinh môn Toán**:
   - Dữ liệu học tập môn Toán của Trần Bình Minh (`std_htsj4gbmo`) và Trần Đức Phúc (`std_tyc0gfnkz`) được bảo vệ an toàn 100%.

---

## 3. NỢ KỸ THUẬT VÀ CÁC QUIRKS ĐƯỢC BẢO LƯU (TECHNICAL DEBT & KNOWN QUIRKS)

Các đặc thù sau đã được ghi nhận và **chủ ý giữ nguyên (FROZEN QUIRKS)**:

1. **Escape key behavior trên Evaluation Modal**:
   - `#evaluation-modal` là một custom HTML modal overlay, đóng qua X, nút Đóng và Backdrop click; không đăng ký lắng nghe sự kiện phím Escape toàn cục (khác với SweetAlert2).
2. **Measurement-unit regex boundary quirk trong `shouldForceMCQ`**:
   - Regex `\b'phần tử'\b` trong JavaScript không nhận diện ký tự tiếng Việt có dấu `"ử"` ở cuối từ là ranh giới từ. Do đó `"4 phần tử"` không bị strip và trả về `true`.
3. **Dung sai 40% substring trong `MathAnswerEvaluator`**:
   - Chuỗi con hợp lệ nếu chiều dài đạt tối thiểu 40% chuỗi đối chiếu (phục vụ nhập tập hợp `{1; 2}` thay vì `A = {1; 2}`).

---

## 4. DANH SÁCH TẬP TIN THAY ĐỔI TRONG CYCLE E2E HARNESS

```text
Tập tin cấu hình mới:
- playwright.config.js

Tập tin kiểm thử được di chuyển/cập nhật:
- tests/evaluation_modal_e2e.test.js (5 tests PASS)
- tests/pdf.spec.js (1 test PASS)

Tài liệu kiểm soát kiến trúc:
- CURRENT_CHECKPOINT.md
```
