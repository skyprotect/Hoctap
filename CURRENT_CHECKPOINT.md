# CURRENT CHECKPOINT (Điểm Chốt Kiến Trúc Hiện Tại)
HocTap Autonomous Engineering System — v14.02

## 1. THÔNG SỐ ĐIỂM CHỐT (CHECKPOINT METRICS)

```text
Checkpoint Identifier:  v14.02A
Kiến trúc trạng thái:   VERIFIED / STABLE
Kiểm thử tự động:       49/49 test suites PASS
Tổng số test cases:     970/970 tests PASS
TypeScript check:       PASS (0 errors)
Clean bundle sync:      PASS (node scripts/build/sync_clean.js)
```

---

## 2. CÁC HẠNG MỤC ĐÃ HOÀN THÀNH VÀ ĐƯỢC XÁC MINH (COMPLETED & VERIFIED WORK)

1. **MathPracticeEvaluator (`js/core/math-practice-evaluator.js`)**:
   - Tách rời tính toán điểm số phần trăm, xếp loại (Xuất sắc, Giỏi, Khá, Đạt, Yếu), phần thưởng XP và xử lý phạt trừ XP an toàn (không bao giờ âm XP).
2. **MathAnswerEvaluator (`js/core/math-answer-evaluator.js`)**:
   - Chuẩn hóa chuỗi câu trả lời `cleanAnswer` (loại bỏ nhãn phương án A-D, ký hiệu LaTeX `$`, chuẩn hóa dấu phẩy/chấm phẩy, bóc tách 41 đơn vị đo lường tiếng Việt).
   - So sánh thông minh câu trả lời ngắn `evaluateShortAnswer` (bao gồm dung sai 40% cho dạng biểu diễn tập hợp).
3. **MathExprEvaluator (`js/core/math-expr-evaluator.js`)**:
   - Parser toán học an toàn, đánh giá biểu thức, thay thế placeholder cho template sinh đề AI.
4. **MathSessionBuilder (`js/core/math-session-builder.js`)**:
   - Đóng gói bản ghi chi tiết lượt làm bài (`buildSessionRecord`), cắt tỉa bộ nhớ giữ lại tối đa 150 sessions gần nhất (`retainSessions`).
5. **MathQuestionClassifier (`js/core/math-question-classifier.js`)**:
   - Tách biệt thuần túy trách nhiệm phân loại câu hỏi `shouldForceMCQ` khỏi controller giao diện `questions-v3.js`.
   - Hỗ trợ UMD (Window, Web Worker, Node.js).
   - Giữ nguyên 100% heuristics và bảo tồn quirk regex boundary `\b` với Unicode tiếng Việt.
   - `questions.shouldForceMCQ` trong `questions-v3.js` trở thành wrapper mỏng ủy thác sang `MathQuestionClassifier`.
   - Xác minh parity hoàn hảo qua 65 tests trong `tests/core/should-force-mcq.characterization.test.js`.
6. **MathTemplateCompiler Characterization (v14.01C)** [MỚI HOÀN THÀNH]:
   - Hoàn thành bộ test đặc tả độc lập `tests/core/math-template-compiler.characterization.test.js` (15 tests PASS).
   - Đóng băng toàn bộ 10 nhóm hành vi của `generateQuestionFromTemplate`: guard clause, sinh biến ngẫu nhiên, getter formulas động, tự giải equality constraints, bảo vệ cú pháp LaTeX, nới lỏng constraints nấc thang, ép số nguyên đại lượng rời rạc, tự phục hồi chống trùng đáp án, xáo trộn phương án & đồng bộ `{ans_letter}`, và kiểm tra tính tương đồng giữa Main Thread và Web Worker.
7. **EnglishAnswerEvaluator (`js/core/english-answer-evaluator.js`)**:
   - Bộ đánh giá 6 dạng bài tập Tiếng Anh và chẩn đoán lỗi sai thông minh Smart Grammar Assistant.
8. **OCC Server-Side Protection & Client Conflict Handling (v13.99/v13.100)**:
   - Cơ chế kiểm soát tranh chấp đồng thời Optimistic Concurrency Control (HTTP 409).
   - Client tự động hòa giải xung đột và merge dữ liệu an toàn (`reconcileOccConflict`, `attemptConflictReconciliation`).
   - Bảo toàn dữ liệu ngoại tuyến (`_offline_dirty`, `_offline_data`) chống mất dữ liệu khi mạng chập chờn.
9. **Khôi phục hoàn toàn chuẩn mã hóa UTF-8 trong `student.html` (v14.02A)** [MỚI HOÀN THÀNH]:
   - Triệt tiêu 1.144 chuỗi mojibake bị lỗi kép từ commit `baeb556`, phục hồi từ commit sạch gốc `baeb556~1`.
   - Giữ nguyên 100% các script mới nạp (`math-session-builder.js`, `math-question-classifier.js`, `english-answer-evaluator.js`).
   - Khóa chặn chất lượng với test đặc tả `tests/core/sync-runtime-characterization.test.js`.
10. **Làm tươi cây kỹ năng / Timeline tức thì sau khi hoàn thành bài học (v14.02A)** [MỚI HOÀN THÀNH]:
    - `finishPractice()` trong `js/questions-v3.js` kích hoạt gọi `app.renderTimeline()` ngay khi hoàn thành tính điểm và cập nhật lịch sử.
    - Triệt tiêu hiện tượng stale DOM ở cây bài học, mở khóa bài học kế tiếp ngay trên màn hình mà không cần đổi tab hoặc khởi động lại ứng dụng.
    - Kiểm thử đặc tả cả lệnh gọi và đột biến trạng thái DOM thực tế (`tests/core/sync-runtime-characterization.test.js`).

---

## 3. NỢ KỸ THUẬT VÀ CÁC QUIRKS ĐƯỢC BẢO LƯU (TECHNICAL DEBT & KNOWN QUIRKS)

Các đặc thù sau đã được ghi nhận và **chủ ý giữ nguyên (FROZEN QUIRKS)**, không được tự tiện sửa đổi khi chưa có yêu cầu riêng:

1. **Measurement-unit regex boundary quirk trong `shouldForceMCQ`**:
   - Regex `\b'phần tử'\b` trong JavaScript không nhận diện ký tự tiếng Việt có dấu `"ử"` ở cuối từ là ranh giới từ. Do đó `"4 phần tử"` không bị strip và trả về `true`.
2. **Dung sai 40% substring trong `MathAnswerEvaluator`**:
   - Chuỗi con hợp lệ nếu chiều dài đạt tối thiểu 40% chuỗi đối chiếu (phục vụ nhập tập hợp `{1; 2}` thay vì `A = {1; 2}`).
3. **Bất đối xứng XP khi làm lại bài (Repeat-attempt XP asymmetry)**:
   - Bài làm lại không được cộng thêm XP bài học nhưng vẫn bị trừ XP nếu trả lời sai từng câu.
4. **Trùng lặp logic biên dịch Template (`generateQuestionFromTemplate`)**:
   - Nhân bản ~377 dòng code giữa `js/questions-v3.js` và `js/question-generator-worker.js`. Đã được đặc tả 100% bằng bộ test characterization mới, sẵn sàng cho việc hợp nhất an toàn.

---

## 4. DANH SÁCH TẬP TIN THAY ĐỔI TRONG PHIÊN V14.01C

```text
Test files created:
- tests/core/math-template-compiler.characterization.test.js (15 tests PASS)

Control documentation files:
- CURRENT_CHECKPOINT.md
- ARCHITECTURE_STATE.md
- REFACTOR_BACKLOG.md
```
