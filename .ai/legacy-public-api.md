# LEGACY PUBLIC API & DOM/EVENT COMPATIBILITY FREEZE

> **DỰ ÁN:** HocTap - Hệ thống Học tập & Thi trắc nghiệm AI (Toán & Tiếng Anh)  
> **PHIÊN BẢN ĐÓNG BĂNG:** v13.56  
> **NGÀY LẬP:** 31/08/2026  
> **TRẠNG THÁI:** COMPATIBILITY FREEZE (KHÓA TOÀN BỘ DANH MỤC BIẾN / HÀM / DOM / SỰ KIỆN CŨ)

---

## 1. NGUYÊN TẮC BẢO VỆ TƯƠNG THÍCH NGƯỢC (GUARDRAILS)

Nhằm đảm bảo hệ thống không bị đổ vỡ giao diện hoặc mất dữ liệu học tập:
1. **KHÔNG ĐỔI TÊN BIẾN TOÀN CỤC:** Tuyệt đối không đổi tên `window.app`, `window.game`, `window.questions`, `window.parentDashboard`, `COURSE_DATA`, `ENGLISH_COURSE_DATA`.
2. **KHÔNG ĐỔI ID PHẦN TỬ DOM:** Mọi ID trong `student.html` và `parent.html` là hợp đồng giao diện cố định.
3. **KHÔNG THAY ĐỔI CHỮ KÝ HÀM (FUNCTION SIGNATURES):** Các hàm được gọi từ inline HTML handlers (`onclick`, `onchange`, ...) phải giữ nguyên số lượng và thứ tự tham số.
4. **KHÔNG XÓA ENDPOINTS CŨ:** Tất cả 44 API endpoints phải tiếp tục hỗ trợ định dạng request/response như đã cam kết.

---

## 2. DANH MỤC GLOBAL OBJECTS & METHODS BẮT BUỘC BẢO TỒN

### A. Đối tượng `window.app` (`js/app.js`) - Danh mục các hàm trọng yếu được gọi từ HTML

| Tên phương thức | Tham số | Hành vi / Trách nhiệm | Nơi gọi trong HTML |
| :--- | :--- | :--- | :--- |
| `app.selectStudent(studentId)` | `studentId: string` | Chọn học sinh (Trần Bình Minh, Trần Đức Phúc, Trần Bảo Ngọc) và nạp dữ liệu cá nhân. | `student.html` (Thẻ chọn học sinh) |
| `app.switchStudent()` | Không | Quay lại màn hình chọn học sinh. | `student.html` (Nút đổi học sinh) |
| `app.selectSubject(subject)` | `subject: 'math' | 'english'` | Chuyển đổi giữa môn Toán và môn Tiếng Anh. | `student.html` (Tabs môn học) |
| `app.selectGrade(grade)` | `grade: 1 | 4 | 6` | Chọn khối lớp học tập. | `student.html` (Menu chọn lớp) |
| `app.startPractice(lessonId, level)` | `lessonId: string, level?: string` | Bắt đầu làm bài tập theo bài học cụ thể. | `student.html` (Thẻ bài học) |
| `app.startExam(examType, options)` | `examType: string, options?: object` | Bắt đầu bài thi trắc nghiệm (15 phút, 1 tiết, học kỳ, nâng cao). | `student.html` (Thẻ bài thi) |
| `app.submitAnswer(choiceIndex)` | `choiceIndex: number (0-3)` | Chọn đáp án A, B, C hoặc D. | `student.html` (Các nút phương án) |
| `app.nextQuestion()` | Không | Chuyển sang câu hỏi kế tiếp sau khi đã trả lời. | `student.html` (Nút Câu tiếp theo) |
| `app.finishQuiz()` | Không | Nộp bài sớm và tính điểm tổng kết. | `student.html` (Nút Nộp bài) |
| `app.goBackHierarchy()` | Không | Quay lại cấp độ trước trong cây điều hướng (Bài tập -> Danh mục -> Dashboard). | `student.html` (Nút Quay lại cố định) |
| `app.exitApplicationWithPassword()` | Không | Yêu cầu mã PIN phụ huynh để thoát ứng dụng Kiosk. | `student.html` (Nút Thoát cố định) |
| `app.launchFreePlayGame()` | Không | Mở overlay chơi game Tower Defense tự do (15 phút). | `student.html` (Nút Chơi game) |
| `app.exitFreePlayGame()` | Không | Đóng màn hình chơi game Tower Defense và quay lại học tập. | `student.html` (Nút Thoát game) |
| `app.toggleFloatingChat()` | Không | Mở/đóng khung trò chuyện Cố vấn AI nổi. | `student.html` (Nút bong bóng chat) |
| `app.sendChatMessage()` | Không | Gửi tin nhắn câu hỏi cho Cố vấn AI. | `student.html` (Form chat AI) |
| `app.openEvaluationModal()` | Không | Mở modal báo cáo đánh giá chất lượng học sinh. | `student.html` (Nút Báo cáo phụ huynh) |
| `app.closeEvaluationModal()` | Không | Đóng modal báo cáo đánh giá. | `student.html` (Nút Đóng modal) |
| `app.openParentSettings()` | Không | Mở cài đặt phụ huynh tại Splash Screen. | `student.html` (Icon Cài đặt) |
| `app.closeParentSettings()` | Không | Đóng cài đặt phụ huynh. | `student.html` (Nút Hủy cài đặt) |
| `app.saveParentSettings()` | Không | Lưu cấu hình học sinh từ modal cài đặt. | `student.html` (Nút Lưu cài đặt) |
| `app.forceSuperRefresh()` | Không | Xóa sạch cache và tải lại toàn bộ ứng dụng từ disk. | `student.html` (Nút Làm mới cực mạnh) |

---

### B. Đối tượng `window.parentDashboard` (`js/parent.js`)

| Tên phương thức | Tham số | Hành vi / Trách nhiệm | Nơi gọi trong HTML |
| :--- | :--- | :--- | :--- |
| `parentDashboard.init()` | Không | Khởi tạo bảng điều khiển phụ huynh khi trang được tải. | `parent.html` (Tự động nạp) |
| `parentDashboard.loginWithPin()` | Không | Đăng nhập bằng mã PIN phụ huynh 4-6 số. | `parent.html` (Form đăng nhập PIN) |
| `parentDashboard.logout()` | Không | Đăng xuất phiên làm việc của phụ huynh. | `parent.html` (Nút Đăng xuất) |
| `parentDashboard.switchTab(tabId)` | `tabId: string` | Chuyển đổi giữa các tab: Thống kê, Lịch sử, Cấu hình, API Keys, Từ vựng. | `parent.html` (Tabs điều hướng) |
| `parentDashboard.selectStudent(id)` | `id: string` | Chọn học sinh để xem báo cáo tiến độ chi tiết. | `parent.html` (Dropdown chọn học sinh) |
| `parentDashboard.saveApiKeys()` | Không | Lưu API key Gemini / Groq / OpenAI vào file cấu hình máy chủ. | `parent.html` (Nút Lưu API Key) |
| `parentDashboard.testApiKeys()` | Không | Kiểm tra tính hợp lệ của các API key đã nhập. | `parent.html` (Nút Kiểm tra API Key) |
| `parentDashboard.exitKiosk()` | Không | Yêu cầu máy chủ tắt chế độ Kiosk Mode. | `parent.html` (Nút Tắt Kiosk) |

---

### C. Đối tượng `window.questions` (`js/questions-v3.js`)

| Tên phương thức | Tham số | Hành vi / Trách nhiệm |
| :--- | :--- | :--- |
| `questions.generateQuestionFromTemplate(template, maxAttempts)` | `template: object, maxAttempts?: number` | Sinh một câu hỏi trắc nghiệm ngẫu nhiên từ template chứa formulas và constraints. |
| `questions.gcd(a, b)` | `a: number, b: number` | Tính Ước chung lớn nhất. |
| `questions.lcm(a, b)` | `a: number, b: number` | Tính Bội chung nhỏ nhất. |
| `questions.factorize(n)` | `n: number` | Phân tích một số nguyên ra thừa số nguyên tố chuẩn KaTeX. |
| `questions.isPrime(num)` | `num: number` | Kiểm tra số nguyên tố. |
| `questions.evalExpression(expr, vars)` | `expr: string, vars: object` | Đánh giá an toàn biểu thức toán học có chứa biến ngẫu nhiên. |
| `questions.printExamToPdf(examData)` | `examData: object` | Xuất đề thi và đáp án ra file PDF chuẩn để in ấn. |

---

## 3. BẢNG KHÓA 187 INLINE EVENT HANDLERS TRONG HTML (MẪU ĐẠI DIỆN TRỌNG YẾU)

| File HTML | Sự kiện DOM | Mã Handler thực thi | Hàm đích được gọi |
| :--- | :--- | :--- | :--- |
| `student.html` | `onclick` | `app.goBackHierarchy()` | `app.goBackHierarchy` |
| `student.html` | `onclick` | `app.exitApplicationWithPassword()` | `app.exitApplicationWithPassword` |
| `student.html` | `onclick` | `app.exitFreePlayGame()` | `app.exitFreePlayGame` |
| `student.html` | `onclick` | `app.toggleFloatingChat()` | `app.toggleFloatingChat` |
| `student.html` | `onsubmit` | `event.preventDefault(); app.sendChatMessage()` | `app.sendChatMessage` |
| `student.html` | `onclick` | `app.closeEvaluationModal()` | `app.closeEvaluationModal` |
| `student.html` | `onclick` | `app.openParentSettings()` | `app.openParentSettings` |
| `student.html` | `onclick` | `app.closeParentSettings()` | `app.closeParentSettings` |
| `student.html` | `onclick` | `app.saveParentSettings()` | `app.saveParentSettings` |
| `student.html` | `onclick` | `app.switchStudent()` | `app.switchStudent` |
| `student.html` | `onclick` | `app.toggleChatMinimize(true)` | `app.toggleChatMinimize` |
| `student.html` | `onclick` | `app.closeChatCompletely()` | `app.closeChatCompletely` |
| `student.html` | `onclick` | `app.toggleEmojiPicker()` | `app.toggleEmojiPicker` |
| `student.html` | `onclick` | `app.insertEmoji('😀')` | `app.insertEmoji` |
| `parent.html` | `onsubmit` | `event.preventDefault(); parentDashboard.loginWithPin()` | `parentDashboard.loginWithPin` |
| `parent.html` | `onclick` | `parentDashboard.logout()` | `parentDashboard.logout` |
| `parent.html` | `onclick` | `parentDashboard.saveApiKeys()` | `parentDashboard.saveApiKeys` |
| `parent.html` | `onclick` | `parentDashboard.testApiKeys()` | `parentDashboard.testApiKeys` |
| `parent.html` | `onclick` | `parentDashboard.exitKiosk()` | `parentDashboard.exitKiosk` |

---

## 4. HỢP ĐỒNG GIAO TIẾP LIÊN MÔ-ĐUN (CROSS-MODULE CONTRACTS)

### A. Giao tiếp giữa `js/questions-v3.js` và `js/app.js`
- `questions-v3.js` **BẮT BUỘC** gọi `app.playSound('correct')` khi học sinh chọn đúng và `app.playSound('wrong')` khi chọn sai.
- `questions-v3.js` **BẮT BUỘC** gọi `app.addGameEnergy(points)` để cộng năng lượng thưởng khi hoàn thành bài tập.
- `questions-v3.js` **BẮT BUỘC** gọi `app.saveProgress()` để lưu điểm số vào SQLite Database.

### B. Giao tiếp giữa `js/game.js` và `js/app.js`
- `game.js` **BẮT BUỘC** đọc năng lượng khởi tạo từ `app.state.gameEnergy`.
- `game.js` **BẮT BUỘC** kích hoạt hiệu ứng âm thanh qua `app.playSound('sword hit')`, `app.playSound('monter')`, `app.playSound('magic spell')`.
- `game.js` **BẮT BUỘC** kết thúc màn và trả quyền điều khiển về ứng dụng qua `app.exitFreePlayGame()`.

### C. Giao tiếp giữa `js/parent.js` và `js/lessons.js`
- `parent.js` **BẮT BUỘC** gọi `getLessonById(lessonId)` để lấy tiêu đề tiếng Việt của bài học khi vẽ báo cáo năng lực.

---

## 5. BẢO TỒN DỮ LIỆU ĐỘC LẬP THEO QUY TẮC DỰ ÁN

| Học sinh | ID Cố định | Khối Lớp | Tài khoản Phụ huynh Quản lý | Nguyên tắc bảo tồn dữ liệu |
| :--- | :--- | :---: | :--- | :--- |
| **Trần Bình Minh** | `std_htsj4gbmo` | Lớp 6 | `skyprotect@gmail.com` | Bảo toàn 100% lịch sử học tập môn Toán & Tiếng Anh Lớp 6. |
| **Trần Bảo Ngọc** | `std_baongoc` | Lớp 1 | `skyprotect@gmail.com` | Quản lý độc lập nội dung môn Toán & Tiếng Anh Lớp 1. |
| **Trần Đức Phúc** | `std_tyc0gfnkz` | Lớp 4 | `nhematseo@gmail.com` | Bảo toàn 100% lịch sử học tập môn Toán & Tiếng Anh Lớp 4. |
