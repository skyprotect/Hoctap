# BÁO CÁO TOÀN DIỆN: FORENSIC CODEBASE CLEANUP & REFACTOR (v13.38)

**Hệ thống**: HỌCTẬP — Kiosk & Học trực tuyến Toán - Tiếng Anh  
**Phiên bản**: v13.38  
**Thời gian thực hiện**: 30/08/2026 16:30  
**Kiến trúc**: Modular Monolith / Clean Architecture / Event-Driven SPA / Canonical Data Source  

---

## 1. TỔNG QUAN KẾT QUẢ REFACTOR

Qua quá trình rà soát pháp y (Forensic Scan), truy vết đồ thị phụ thuộc (Dependency Graph) và hợp nhất nguồn dữ liệu chuẩn (Single Source of Truth), toàn bộ các tệp mã trùng lặp monolithic khổng lồ và mã rác đã được triệt tiêu hoàn toàn:

| Tiêu chí | Trước Refactor (v13.37) | Sau Refactor (v13.38) | Chênh lệch |
| :--- | :--- | :--- | :--- |
| **Tổng dòng mã JavaScript (`.js`)** | 78.956 dòng | 61.721 dòng | **-17.235 dòng (-21.8%)** |
| **Tệp `js/english_data.js`** | 9.942 dòng | 1.953 dòng | **-7.989 dòng (-80.3%)** |
| **Số tệp JavaScript trùng lặp** | 6 tệp (22.756 dòng) | 0 tệp | **Xóa sạch 100%** |
| **Số tệp scratch/rác** | 11 tệp | 0 tệp (`scripts/scratch` đã xóa) | **Xóa sạch 100%** |
| **Độ phủ Façade API (`js/app.js`)** | 36/52 methods (Thiếu 16) | 52/52 methods (100%) | **+16 methods (100% tương thích)** |
| **Trạng thái Kiểm thử Tự động** | 7 suites / 46 tests | 7 suites / 46 tests | **100% PASS (0 thất bại)** |
| **Kiểm tra cú pháp & câu hỏi Toán** | 121 dạng bài | 121 dạng bài | **100% PASS (0 lỗi)** |
| **TypeScript Type Check** | 0 lỗi | 0 lỗi | **100% PASS** |

---

## 2. CHI TIẾT CÁC TỆP ĐÃ XÓA & NGUỒN CHUẨN THAY THẾ (CANONICAL)

| Tệp đã xóa | Số dòng | Lý do xóa | Nguồn chuẩn thay thế (Canonical Source) |
| :--- | :--- | :--- | :--- |
| `js/questions-v3.js` | 10.288 dòng | Trùng lặp hoàn toàn với generator Lớp 6 | `data/grade_6/math/generator.js` |
| `js/questions-v1.js` | 1.100 dòng | Trùng lặp hoàn toàn với generator Lớp 1 | `data/grade_1/math/generator.js` |
| `js/questions-v4.js` | 1.054 dòng | Trùng lặp hoàn toàn với generator Lớp 4 | `data/grade_4/math/generator.js` |
| `js/questions-7991.js` | 1.217 dòng | Trùng lặp với bộ đề 7991 Lớp 6 | `data/grade_6/math/exam7991.js` |
| `js/questions-advanced.js` | 827 dòng | Trùng lặp với bộ đề HSG nâng cao Lớp 6 | `data/grade_6/math/advanced.js` |
| `data/engine/question_engine.js` | 224 dòng | Bản cũ của Question Engine v1 | `js/engine/question-engine.js` (Engine v3.0) |
| `scripts/scratch/*` (11 tệp) | ~800 dòng | Tệp thử nghiệm tạm thời | Đã dọn dẹp |

---

## 3. TINH GỌN DỮ LIỆU TIẾNG ANH (`js/english_data.js`)

- **Vấn đề trước đây**: `js/english_data.js` sao chép cứng toàn bộ 8.000 dòng dữ liệu bài học của Lớp 1, 4, 6 trong khi dữ liệu này đã được tách thành 3 tệp chuẩn trong `data/grade_*/english/lessons.js`.
- **Giải pháp**:
  - Loại bỏ khối `const ENGLISH_COURSE_DATA = { ... }` tĩnh 8.000 dòng.
  - Thiết lập tham chiếu động: `let ENGLISH_COURSE_DATA = window.ENGLISH_COURSE_DATA || {};` (kèm CommonJS require dự phòng trong môi trường Node.js).
  - Giữ lại 100% logic nghiệp vụ: `getWordEmoji`, `generateEnglishQuestions`, `generateIoeQuestions`, `generateEnglishFullExam` và các ngân hàng câu hỏi ngữ pháp đặc thù.

---

## 4. BỔ SUNG TOÀN DIỆN FAÇADE API TRONG `js/app.js`

Đã tích hợp đủ 16 phương thức Façade còn thiếu, đảm bảo mọi sự kiện `onclick="app.*"` từ giao diện `student.html` và `parent.html` đều được xử lý chuẩn xác:

1. `skipGoogleLogin()`: Đóng màn hình đăng nhập Google, chuyển tiếp vào Splash Screen.
2. `openGoogleLoginModal()`: Mở modal xác thực tài khoản phụ huynh Google.
3. `toggleAiProgressDetail()`: Đóng/mở dropdown tiến trình sinh đề AI.
4. `showAiErrors()`: Hiển thị nhật ký lỗi AI cho phụ huynh.
5. `renderHeroProfile()`: Mở bảng huy hiệu và hồ sơ học sinh.
6. `checkSubjectSelection()`: Điều hướng đến màn hình chọn môn học.
7. `toggleFocusMode()`: Chuyển đổi chế độ tập trung cao độ (Super Focus Mode).
8. `switchEnglishTab(tabName)`: Chuyển tab kỹ năng Tiếng Anh (Map, Practice, Exams, IOE, Custom Vocab, Leaderboard, Shop, Profile).
9. `selectEnglishSkill(skill)`: Chọn chuyên đề kỹ năng Tiếng Anh (Listening, Vocabulary, Reading, Writing).
10. `onStudentEngCategoryChange()`: Lọc danh mục bài học Tiếng Anh.
11. `toggleAllStudentGrammar()`: Thu gọn / mở rộng toàn bộ chủ điểm ngữ pháp.
12. `exportStudentEnglishPdf()`: Kích hoạt in tài liệu / đề thi Tiếng Anh sang PDF.
13. `addStudentCustomVocabulary()`: Thêm từ vựng mới do học sinh tự nhập vào sổ từ vựng cá nhân.
14. `closeReviewSessionModal()`: Đóng modal xem lại lịch sử làm bài.
15. `closeQuickStudyModal()`: Đóng modal học nhanh.
16. `filterPresenceList()`: Lọc danh sách học sinh trực tuyến theo tên tìm kiếm.

---

## 5. DỌN DẸP SERVICE WORKER & ĐỒNG BỘ BẢN SẠCH

- **Service Worker (`sw.js`)**:
  - Nâng cấp `CACHE_VERSION = 'v13.38'`.
  - Xóa bỏ tài nguyên không tồn tại `/css/quiz.css`.
- **Kịch bản đồng bộ (`sync_clean.js` & `scripts/build/sync_clean.js`)**:
  - Cập nhật danh sách tệp đồng bộ sang `HocTap_Clean`.
  - Tự động quét và xóa sạch các tệp cũ đã bị loại bỏ trong `HocTap_Clean`.
- **Nâng cấp Cachebuster**:
  - Cập nhật toàn bộ tham số `?v=13.38` trong `student.html` và `parent.html`.
  - Cập nhật thông số phiên bản `v13.38` và thời gian `30/08/2026 16:30` tại Splash Screen và Badge góc dưới bên phải.
