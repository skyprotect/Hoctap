# REFACTOR BACKLOG (Danh Mục Tái Cấu Trúc Ưu Tiên)
HocTap Autonomous Engineering System — v14.01

## 1. DANH MỤC ỨNG VIÊN ĐƯỢC XẾP THEO MỨC ĐỘ ƯU TIÊN (PRIORITIZED BACKLOG)

### [P1] MathTemplateCompiler (Hợp nhất bộ biên dịch Template Đề thi AI)
* **Bằng chứng kiến trúc (Evidence)**:
  Hàm `generateQuestionFromTemplate()` bị trùng lặp nguyên văn (TRUE DUPLICATION) giữa 2 luồng:
  - `js/questions-v3.js` (dòng 538 – 914, ~377 dòng).
  - `js/question-generator-worker.js` (dòng 269 – 646, ~378 dòng).
* **Giá trị kiến trúc**:
  - Xóa bỏ hoàn toàn ~377 dòng code duplicate.
  - Tạo một nguồn sự thật duy nhất (Single Source of Truth) cho cú pháp bảo vệ LaTeX (`\frac`, `^{}`, `\cmd{}`) và thuật toán xáo trộn phương án kèm cập nhật chữ cái đáp án đúng (`ans_letter`) trong lời giải.
* **Thách thức kỹ thuật**:
  - Môi trường chạy kép: Main Thread (`questions-v3.js`) và Web Worker (`question-generator-worker.js` dùng `importScripts`). Cần cơ chế nạp UMD tương thích cả Node.js, Web Worker và Browser Window.
* **Trạng thái hiện tại**:
  `CHARACTERIZATION REQUIRED` ➔ **`CHARACTERIZED / SẴN SÀNG ĐỀ XUẤT (EXTRACTION CANDIDATE)`** (Đã hoàn thành 15 characterization tests tại `tests/core/math-template-compiler.characterization.test.js`, pass 100%).

---

### [P2] MathQuestionClassifier (Bóc tách bộ phân loại câu hỏi trắc nghiệm vs điền số)
* **Mục tiêu (Target)**:
  Hàm `shouldForceMCQ(questionText, correctOption)` được bóc tách sang `js/core/math-question-classifier.js`.
* **Bằng chứng kiến trúc (Evidence)**:
  - Pure domain heuristic 100%, 0 DOM, 0 state dependency, UMD pattern.
  - `questions.shouldForceMCQ` trong `js/questions-v3.js` là wrapper mỏng chuyển tiếp.
  - Được xác minh bởi 65 unit tests bao phủ 100% các nhánh rẽ và quirk Unicode.
* **Trạng thái hiện tại**:
  **`VERIFIED / COMPLETE`** (Hoàn thành trong chu trình v14.01B, 948/948 tests PASS).

---

### [P3] English PDF Export & Generation (Chế độ xuất bản tài liệu Tiếng Anh)
* **Mục tiêu**: Bóc tách logic in ấn, xuất đề thi Tiếng Anh sang dịch vụ chuyên trách tương tự Math Print.
* **Trạng thái hiện tại**: `CANDIDATE BACKLOG` (Tạm hoãn, ưu tiên hoàn thành workstream Toán trước).

---

## 2. DANH MỤC GIỮ NGUYÊN BẢO VỆ (KEEP INTACT / DO NOT REFACTOR)

Các thành phần sau đây **KHÔNG PHẢI LÀ ĐỐI TƯỢNG TÁI CẤU TRÚC** trong mọi kịch bản thông thường, trừ khi có bằng chứng mới mang tính bước ngoặt:

1. **`generateQuestion()` trong `js/questions-v3.js`**:
   - Chứa ~5,800 dòng code với 51 switch-case sinh số học cho 22 dạng bài Toán lớp 6.
   - Tính gắn kết nội tại cực kỳ cao (Cohesive Domain Generation). Không xé nhỏ theo file chỉ vì số dòng.
2. **`finishPractice()` trong `js/questions-v3.js`**:
   - Đóng vai trò orchestrator điều phối giao diện, âm thanh, huy hiệu và lưu trữ.
   - Các phần tính điểm và đóng gói session đã được ủy thác sang các module con chuyên trách.
3. **`AppState` & `window.app` (`js/app.js`)**:
   - Đang vận hành ổn định, là trục xương sống của toàn bộ ứng dụng.
4. **`GameEngine` & `game.js`**:
   - Vòng lặp game thủ thành canvas 60 FPS, không can thiệp.
5. **`Persistence` & Giao thức OCC 409 (`server.js`, SQLite `database.db`)**:
   - Hệ thống kiểm soát tranh chấp đồng thời và hòa giải xung đột đã được hoàn thiện tại v13.99/v13.100 với 100% tests PASS.
