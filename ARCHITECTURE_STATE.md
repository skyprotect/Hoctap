# ARCHITECTURE STATE (Bản Đồ Kiến Trúc Động Của Dự Án)
HocTap Autonomous Engineering System — v14.01

## 1. MÔ HÌNH PHÂN TẦNG HIỆN TẠI (CURRENT SYSTEM TOPOLOGY)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        TẦNG TRÌNH DIỄN (PRESENTATION / UI)             │
│      student.html  |  #tab-practice  |  KaTeX  |  SweetAlert2          │
└───────────────────────────────────▲────────────────────────────────────┘
                                    │
┌───────────────────────────────────┴────────────────────────────────────┐
│         TẦNG ĐIỀU PHỐI BÀI HỌC (QUESTIONS & PRACTICE ORCHESTRATION)     │
│                          js/questions-v3.js (≈ 9.7K LOC)               │
│  - initPractice(), showQuestion(), selectOption(), finishPractice()     │
│  - generateQuestion() (≈ 5.8K LOC, 51 switch-case) [PROTECTED]         │
│  - finishPractice() [Orchestrator, đã ủy quyền evaluation & session]   │
└──────────────┬───────────────────┬──────────────────────┬──────────────┘
               │                   │                      │
               ▼                   ▼                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│             TẦNG NGHIỆP VỤ TOÁN THUẦN TÚY (PURE MATH DOMAIN MODULES)    │
│  - MathPracticeEvaluator (js/core/math-practice-evaluator.js) [ACTIVE] │
│  - MathAnswerEvaluator   (js/core/math-answer-evaluator.js)   [ACTIVE] │
│  - MathExprEvaluator     (js/core/math-expr-evaluator.js)     [ACTIVE] │
│  - MathSessionBuilder    (js/core/math-session-builder.js)    [ACTIVE] │
│  - MathUtils             (js/core/math-utils.js)              [ACTIVE] │
│  - ArrayUtils            (js/core/array-utils.js)             [ACTIVE] │
│  --------------------------------------------------------------------- │
│  - MathQuestionClassifier (js/core/math-question-classifier.js)        [ACTIVE] │
└──────────────┬───────────────────┬──────────────────────┬──────────────┘
               │                   │                      │
               └───────────────────┼──────────────────────┘
                                   │
┌──────────────────────────────────┴────────────────────────────────────┐
│             TẦNG TRẠNG THÁI & LƯU TRỮ (STATE & PERSISTENCE)            │
│  - js/app.js: Quản lý app.state (xp, scores, history, examSessions)    │
│  - Client-side OCC 409 Conflict Handling (v13.99/v13.100)              │
│  - Conflict Reconciliation & Merge an toàn                             │
│  - Offline Recovery Protection (_offline_dirty, _offline_data)         │
│  - Backend: server.js, SQLite database.db (OCC revision validation)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. CHI TIẾT CÁC MÔ-ĐUN TOÁN HỌC (MATH SUBSYSTEM BREAKDOWN)

| Mô-đun | Tệp tin | Trách nhiệm | Trạng thái | Độ bao phủ kiểm thử |
| :--- | :--- | :--- | :---: | :--- |
| **MathPracticeEvaluator** | `js/core/math-practice-evaluator.js` | Tính % điểm, xếp loại (Xuất sắc/Giỏi/Khá/Đạt/Yếu), tính thưởng XP, trừ phạt XP an toàn (sàn 0). | **ĐÃ HOÀN THÀNH (ACTIVE)** | 100% unit tests (`tests/core/math-practice-evaluator.test.js`) |
| **MathAnswerEvaluator** | `js/core/math-answer-evaluator.js` | Chuẩn hóa đáp án `cleanAnswer`, so khớp đáp án ngắn chính xác `evaluateShortAnswer` (bóc tách đơn vị có cấu trúc, so khớp tập hợp/số học/biến số, bảo tồn nguyên vẹn 100% tiếng Việt, KHÔNG false-positive substring). | **ĐÃ HOÀN THÀNH (ACTIVE)** | 100% unit & characterization tests (`tests/core/math-answer-evaluator.test.js`, `tests/math_short_answer_e2e.spec.js`) |
| **MathExprEvaluator** | `js/core/math-expr-evaluator.js` | Tokenize và tính toán biểu thức an toàn, thay thế placeholder, kiểm tra constraints đề thi template AI. | **ĐÃ HOÀN THÀNH (ACTIVE)** | 100% unit tests (`tests/core/math-expr-evaluator.test.js`) |
| **MathSessionBuilder** | `js/core/math-session-builder.js` | Đóng gói bản ghi lịch sử bài thi (session record 12 trường), cắt tỉa FIFO 150 sessions gần nhất. | **ĐÃ HOÀN THÀNH (ACTIVE)** | 100% unit tests (`tests/core/math-session-builder.test.js`) |
| **MathQuestionClassifier** | `js/core/math-question-classifier.js` | Đơn vị sở hữu chuẩn (Canonical Owner) phân loại câu hỏi trắc nghiệm bắt buộc vs tự luận ngắn (`shouldForceMCQ`, `isForceMCQ`, `normalizeQuestionMode`). | **ĐÃ HOÀN THÀNH (ACTIVE)** | 100% unit & integration tests (`tests/core/should-force-mcq.characterization.test.js`, `tests/core/math-question-mode.test.js`, `tests/math_short_answer_e2e.spec.js`) |
| **MathTemplateCompiler** | `js/core/math-template-compiler.js` | Biên dịch template câu hỏi AI (`generateQuestionFromTemplate`), tính toán `forceMCQ`, xáo trộn phương án và đồng bộ `{ans_letter}`. | **ĐÃ HOÀN THÀNH (ACTIVE)** | 100% characterization & template tests (`tests/core/math-template-compiler.characterization.test.js`, `tests/core/math-template-preparation.test.js`) |

---

## 3. CÁC ĐẶC TÍNH KIẾN TRÚC ĐANG ĐƯỢC BẢO VỆ (PROTECTED ANCHORS)

1. **`js/questions-v3.js` (≈ 9,757 lines)**:
   - File có kích thước lớn nhưng đóng vai trò bộ điều phối (orchestrator) trung tâm cho toàn bộ trải nghiệm làm bài trắc nghiệm Toán.
   - **`generateQuestion()`**: Chiếm ~5,800 dòng, gồm 51 switch-case sinh số học cho 22 dạng bài. Đây là logic tạo đề nội tại có tính gắn kết (cohesive) rất cao. **ĐƯỢC BẢO VỆ TUYỆT ĐỐI (PROTECTED)**, không tái cấu trúc theo LOC.
   - **`finishPractice()`**: Đóng vai trò orchestrator điều phối giao diện, âm thanh, huy hiệu và lưu trữ; toàn bộ nghiệp vụ tính điểm và tạo bản ghi session đã được ủy nhiệm cho các module con thuần túy.

2. **Kiến trúc Lưu trữ & Đồng bộ (Persistence & Concurrency)**:
   - **Server-side OCC**: `server.js` kiểm tra revision và phản hồi `409 Conflict` nếu client gửi dữ liệu cũ hơn server.
   - **Client 409 Conflict Handling**: Tự động phát hiện 409 và kích hoạt luồng hòa giải xung đột.
   - **Conflict Reconciliation**: Lấy trạng thái mới nhất từ server, merge an toàn các mảng và điểm số, giữ nguyên XP và history của server để chống gian lận.
   - **Offline Recovery Protection**: Các marker `_offline_dirty` và `_offline_data` chỉ được xóa khi và chỉ khi server phản hồi `200 OK`.
   - **Cam kết**: Tuyệt đối không đề xuất tái thiết kế hệ thống persistence/OCC nếu không có bằng chứng mới.
