# REFACTOR RULES (Bộ Quy Tắc Tái Cấu Trúc Bắt Buộc)
HocTap Autonomous Engineering System — v14.01

## 1. VÙNG NGUY HIỂM ĐƯỢC BẢO VỆ (PROTECTED DANGER ZONES)

Các thành phần sau đây **TUYỆT ĐỐI KHÔNG ĐƯỢC TỰ ĐỘNG TÁI CẤU TRÚC (NOT ELIGIBLE FOR AUTONOMOUS DECOMPOSITION)** khi không có chỉ thị và phê duyệt tường minh bằng văn bản từ con người:

1. **`AppState` & `window.app` Architecture**:
   - Cấu trúc state tập trung trong `js/app.js`.
   - Vòng đời nạp và lưu trữ `app.state`.
2. **`js/questions-v3.js` Architecture Broadly**:
   - Kiến trúc điều phối tổng thể của controller câu hỏi.
3. **Question Generation Core (`generateQuestion()` & switch-case 51 bài)**:
   - Toàn bộ khối code ~5,800 dòng chứa logic sinh số học của 22 dạng bài. Đây là cohesive domain generation logic, cấm xé lẻ bừa bãi.
4. **GameEngine & `game.js`**:
   - Vòng lặp game (game loop), canvas rendering, hệ thống tháp canh và quái vật trong mini-game thủ thành Tower Defense.
5. **Persistence & Storage Subsystem**:
   - `SafeStorage`, SQLite CSDL backend, SQLite tables schema.
6. **Sync, Concurrency & OCC Protocol**:
   - Mã nguồn HTTP OCC 409 conflict detection (`server.js`, `app.syncOfflineProgress()`, `attemptConflictReconciliation()`).
   - Mọi cơ chế merge tự động và bảo vệ dữ liệu offline recovery.
7. **EventBus & Communication Topology**:
   - Giao thức truyền thông điệp giữa các module hoặc worker.

---

## 2. 12 NGUYÊN TẮC BẮT BUỘC (MANDATORY RULES)

1. **Không tái cấu trúc theo LOC (Do not refactor by LOC)**:
   Số lượng dòng code lớn không phải là bằng chứng cho thấy cần phải tách.
2. **Không tái thiết kế kiến trúc đang ổn định mà không có bằng chứng mới (Do not redesign stable architecture without new evidence)**:
   Không viết lại các hàm đang chạy tốt chỉ vì phong cách lập trình.
3. **Không gộp các đợt refactor không liên quan (Do not combine unrelated refactors)**:
   Mỗi đợt refactor chỉ giải quyết đúng 1 seam logic duy nhất.
4. **Bảo toàn hành vi hiện có (Preserve existing behavior)**:
   Mọi luồng nghiệp vụ hiện tại phải giữ nguyên kết quả đầu ra.
5. **Bảo toàn các quirks đã biết (Preserve known quirks)**:
   Các đặc thù hiện hữu (ví dụ: heuristic substring 40%, regex Unicode `\b`, cơ chế trừ XP an toàn) không được tự ý "sửa sạch" trong quá trình tái cấu trúc. Sửa bug phải là một quy trình tách biệt có phê duyệt.
6. **Ưu tiên bóc tách Pure Domain trước Stateful logic (Prefer pure/domain extraction over stateful extraction)**:
   Chỉ trích xuất các hàm thuần túy không có side effect trước; hạn chế tối đa việc động vào state mutation.
7. **Ưu tiên 1 Nguồn Chân Lý duy nhất (Prefer one source of truth over duplicated logic)**:
   Loại bỏ sự nhân bản code giữa Main Thread và Web Worker khi có điều kiện kiểm thử cho phép.
8. **Giữ lớp tương thích ngược mỏng và nhẹ (Keep compatibility wrappers thin)**:
   Khi bóc tách một hàm sang module mới, hàm cũ tại file gốc đóng vai trò proxy chuyển tiếp (forwarding shim) để không làm gãy các caller cũ.
9. **Không duy trì duplicate code không cần thiết (Do not retain duplicate implementations unnecessarily)**:
   Sau khi module mới được xác minh hoàn chỉnh, mã cũ phải ủy quyền hoàn toàn cho module mới thay vì chạy song song 2 logic khác nhau.
10. **Tối thiểu hóa bề mặt thay đổi (Minimize change surface)**:
    Mỗi micro-refactor chỉ chạm vào tối đa 1–4 file liên quan mật thiết.
11. **Mọi thay đổi sản xuất phải có đường lui rõ ràng (Every production refactor must have a rollback path)**:
    Phải có checkpoint git sạch và khả năng hoàn tác bằng 1 lệnh `git restore`.
12. **Không bao giờ tin tưởng tóm tắt chủ quan (Never trust an AI summary without inspecting actual diff and test output)**:
    Luôn chạy `git diff` và toàn bộ test suites thực tế trước khi coi là hoàn thành.

---

## 3. RANH GIỚI PHÂN QUYỀN (HUMAN APPROVAL BOUNDARY)

### Nhóm A: Tự Trị Thực Thi (AUTO-ELIGIBLE)
AI được phép đề xuất và triển khai khi thỏa mãn **TẤT CẢ** các điều kiện sau:
- [x] Logic thuần túy (Pure or mostly pure domain logic).
- [x] Trách nhiệm ngữ nghĩa đơn nhất, rõ ràng (Single responsibility).
- [x] Không phụ thuộc hoặc có phụ thuộc cực thấp (Low dependency count, 0 DOM, 0 global state).
- [x] Nằm ngoài Vùng nguy hiểm được bảo vệ (No protected danger zone).
- [x] Đã được đóng băng bằng test characterization hoàn chỉnh.
- [x] Bề mặt thay đổi nhỏ (1–3 file).
- [x] Khả năng rollback đơn giản, tức thì.

### Nhóm B: Bắt Buộc Phê Duyệt Của Con Người (HUMAN-APPROVAL REQUIRED)
Bắt buộc dừng lại và xin phê duyệt tường minh khi chạm vào bất kỳ điểm nào sau:
- Bất kỳ thay đổi nào liên quan đến `app.state`, cấu trúc dữ liệu học sinh.
- Giao thức truyền tin giữa Main Thread và Web Worker.
- Logic mini-game `game.js`, `CombatSystem`.
- Cơ chế lưu trữ SQLite, API Server, OCC Concurrency 409.
- Vòng đời làm bài tổng thể (`initPractice`, `finishPractice`).
- Khi hợp đồng dữ liệu đầu vào/đầu ra chưa được xác định chắc chắn.
- Khi có nguy cơ gây hồi quy trên nhiều màn hình UI khác nhau.
