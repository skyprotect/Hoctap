# BÁO CÁO PHÂN TÍCH & XÁC ĐỊNH REFACTOR SEAMS FRONTEND HOCTAP

> **DỰ ÁN:** HocTap - Hệ thống Học tập & Thi trắc nghiệm AI (Toán & Tiếng Anh)  
> **PHIÊN BẢN ĐÓNG BĂNG:** v13.56  
> **NGÀY LẬP:** 31/08/2026  
> **TÀI LIỆU CĂN CỨ:** `.ai/frontend-contract.md`, `.ai/frontend-dependency-map.md`, `.ai/legacy-public-api.md`, `.ai/frontend-runtime-map.md`  
> **TRẠNG THÁI:** REFACTOR SEAMS AUDIT (ĐÃ PHÊ DUYỆT ĐIỂM TÁCH GHÉP AN TOÀN)

---

## 1. TỔNG HỢP TIÊU CHÍ ĐÁNH GIÁ SEAMS

Để đảm bảo an toàn tuyệt đối cho hệ thống, các Seam được lựa chọn và xếp hạng dựa trên 7 tiêu chí:
1. **Zero UI / DOM Coupling:** Không ràng buộc phần tử DOM hay bố cục giao diện.
2. **Zero Global State Coupling:** Không can thiệp hoặc thay đổi `app.state`, `window.app`, `AppState`.
3. **No Side Effects:** Không chạy ngầm timers, network calls ngoài ý muốn hoặc lắng nghe sự kiện DOM phức tạp.
4. **Deterministic Testing:** 100% kiểm thử tự động độc lập qua Unit / Characterization Test.
5. **Zero Public Contract Breach:** Giữ nguyên 100% chữ ký hàm và khả năng tương thích ngược trên `window.*`.
6. **Zero Circular Dependency:** Không gây vòng lặp phụ thuộc khi import/export.
7. **Trivial Rollback:** Có thể hoàn tác ngay lập tức mà không ảnh hưởng cơ sở dữ liệu hay tiến độ học tập.

---

## 2. BẢNG XẾP HẠNG 8 CANDIDATE REFACTOR SEAMS (TỪ LOW → HIGH RISK)

| Hạng Risk | Tên Seam / Responsibility | File & Vị trí hiện tại | Functions / Methods liên quan | Consumers (Nơi tiêu dùng) | Phụ thuộc Globals / DOM / Events | Mức độ Rủi ro | Kế hoạch Test cần có | Độ khó thực thi |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: | :--- | :---: |
| **1** | **`safeStorage`**<br>(Bộ lưu trữ an toàn Client chống lỗi Quota / Private Browsing) | `js/app.js`<br>(Dòng 10–24) | `safeStorage.getItem`<br>`safeStorage.setItem`<br>`safeStorage.removeItem` | `js/app.js` (`theme`, `port`, `auth`...)<br>`js/parent.js` (`adminToken`...)<br>`js/questions-v3.js` (`td_hero_data`) | **DOM:** Không<br>**Events:** Không<br>**Globals:** `localStorage` | **VERY LOW**<br>(1/10) | Unit test: Đọc/ghi key-value, xử lý ngoại lệ Storage QuotaExceeded bằng bộ nhớ RAM dự phòng. | Cực dễ |
| **2** | **`removeVietnameseTones`**<br>(Chuẩn hóa chuỗi, khử dấu tiếng Việt) | `js/questions-v3.js`<br>(Dòng 15–25) | `removeVietnameseTones(str)` | `js/questions-v3.js`<br>(Bộ lọc tìm kiếm & chuẩn hóa đáp án) | **DOM:** Không<br>**Events:** Không<br>**Globals:** Không (Pure Function) | **VERY LOW**<br>(1/10) | Unit test: Khử dấu toàn bộ nguyên âm tiếng Việt, hoa/thường, ký tự đặc biệt. | Cực dễ |
| **3** | **`sanitizeHtml`**<br>(Làm sạch chuỗi HTML chống tấn công XSS) | `js/app.js`<br>(Dòng 2–8)<br>`parent.html` | `sanitizeHtml(html)` | `js/app.js`<br>`js/parent.js`<br>`parent.html` | **DOM:** Không<br>**Events:** Không<br>**Globals:** Không (Regex Parser) | **LOW**<br>(1.5/10) | Unit test: Bóc tách thẻ `<script>`, thuộc tính `onerror=`, `onclick=`, liên kết `javascript:`. | Cực dễ |
| **4** | **`MathUtilities` (Core Arithmetic)**<br>(Số học thuần túy: ƯCLN, BCNN, số nguyên tố, ước số, thừa số) | `js/questions-v3.js`<br>`js/question-generator-worker.js` | `gcd(a, b)`<br>`lcm(a, b)`<br>`factorize(n)`<br>`isPrime(n)`<br>`getDivisors(n)`<br>`sumDigits(n)`<br>`simplify(n, d)` | `window.questions`<br>`question-generator-worker`<br>`js/app.js` | **DOM:** Không<br>**Events:** Không<br>**Globals:** Không (100% Pure Math) | **LOW**<br>(2/10) | Characterization test: 50+ bộ số học mẫu (số 0, số 1, số âm, số nguyên tố lớn). | Dễ |
| **5** | **`EmojiHelper`**<br>(Tra cứu Emoji từ vựng tiếng Anh) | `js/english_data.js`<br>(Dòng 10–40) | `getWordEmoji(word)` | `js/english_data.js`<br>`js/app.js` (Vocab Monster, Flashcards) | **DOM:** Không<br>**Events:** Không<br>**Globals:** Bảng tra `EMOJI_FALLBACK` | **LOW**<br>(2/10) | Unit test: Khớp từ chính xác, không phân biệt hoa thường, fallback icon mặc định. | Dễ |
| **6** | **`UrlHelper` (`getApiUrl`)**<br>(Xác định cổng và đường dẫn API máy chủ) | `parent.html`<br>`js/parent.js`<br>`js/questions-v3.js` | `getApiUrl(path)` | `parent.html`<br>`js/app.js`<br>`js/parent.js`<br>`js/questions-v3.js` | **DOM:** Không<br>**Events:** Không<br>**Globals:** `window.location`, `localStorage['server_port']` | **LOW**<br>(3/10) | Unit test: Kiểm tra giao thức `file:`, `http:`, `https:`, cổng tùy chỉnh từ localStorage. | Dễ |
| **7** | **`AudioService`**<br>(Bộ phát & quản lý cache 12 âm thanh hiệu ứng) | `js/app.js` | `app.playSound(name)`<br>`app.toggleSoundMute()` | `js/app.js`<br>`js/questions-v3.js`<br>`js/game.js` | **DOM:** Không ràng buộc layout<br>**Events:** Không<br>**Globals:** `HTMLAudioElement` | **MEDIUM**<br>(4/10) | Mock Audio test: Phát âm thanh đúng tên, xử lý khi Autoplay bị chặn, toggle mute. | Trung bình |
| **8** | **`SpeechService`**<br>(Tổng hợp giọng đọc Text-To-Speech tiếng Anh/Việt) | `js/app.js` | `app.speakText(text, lang)`<br>`app.stopSpeech()` | `js/app.js` (Luyện đọc, phát âm tiếng Anh) | **DOM:** Không<br>**Events:** `voiceschanged`<br>**Globals:** `window.speechSynthesis` | **MEDIUM**<br>(4/10) | Mock Web Speech API test: Chọn voice đúng locale `vi-VN` / `en-US`, ngắt giọng khi chuyển câu. | Trung bình |

---

## 3. SEAM ĐƯỢC CHỌN DUY NHẤT ĐỂ REFACTOR ĐẦU TIÊN

### 🎯 LỰA CHỌN: **`safeStorage`** (Bộ lưu trữ an toàn Client)

```
┌─────────────────────────────────────────────────────────────┐
│                       safeStorage                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  getItem(key)  │  setItem(key, val)  │ removeItem(k)  │  │
│  └───────────────────────────────────────────────────────┘  │
│         │                         │                         │
│         ▼                         ▼                         │
│  localStorage (Primary)    fallback RAM (Safety Net)        │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. CHI TIẾT LÝ DO LỰA CHỌN `safeStorage`

1. **Khắc phục điểm nghẽn kiến trúc (Single Point of Fragility):**
   - Hiện nay `safeStorage` được định nghĩa bằng `const safeStorage = { ... }` ở dòng 10 của tệp `js/app.js`.
   - Tuy nhiên, `js/app.js` lại là tệp được nạp **cuối cùng** trong danh sách các thẻ `<script>` tại `student.html` (sau `questions-v3.js`, `game.js`, `lessons.js`).
   - Nếu bất kỳ tệp nào nạp trước truy cập `safeStorage` trước khi `app.js` chạy, trình duyệt sẽ quăng lỗi `ReferenceError: safeStorage is not defined`.
   - Việc tách `safeStorage` thành một mô-đun độc lập và nạp đầu tiên sẽ giải quyết triệt để rủi ro phụ thuộc tải script này.

2. **Hoàn toàn không có phụ thuộc DOM & Events:**
   - Đối tượng không thao tác với bất kỳ phần tử DOM nào.
   - Không chứa bất kỳ bộ lắng nghe sự kiện (`addEventListener`) hay bộ phát sự kiện nào.

3. **Tính độc lập nghiệp vụ tuyệt đối:**
   - Không chứa logic tính toán điểm số, sinh đề thi hay trạng thái trò chơi.
   - Hành vi hoàn toàn cô lập: Nhận key/value và lưu trữ an toàn.

4. **100% Khả năng kiểm thử & Rollback tức thì:**
   - Có thể chạy Characterization Test hoàn chỉnh trong Node.js (với mock `localStorage`) trong < 5ms.
   - Nếu xảy ra bất kỳ sự cố nào, việc hoàn tác chỉ tác động đúng 1 file duy nhất mà không gây hiệu ứng domino lên phần còn lại của hệ thống.

5. **Bảo tồn 100% Public Contract:**
   - Giữ nguyên `window.safeStorage = safeStorage;` đảm bảo mọi lời gọi cũ từ `js/app.js`, `js/parent.js`, `js/questions-v3.js` tiếp tục hoạt động trong suốt và liền mạch.

---

## 5. ĐẶC TẢ CHI TIẾT TỆP TIN & PHƯƠNG THỨC LIÊN QUAN

* **Tệp nguồn gốc hiện tại:** [`js/app.js`](file:///f:/KHQS/AntiGravity/HocTap/js/app.js#L10-L24) (Dòng 10–24).
* **Chữ ký giao diện công khai cần bảo tồn:**
  ```typescript
  interface SafeStorageContract {
      fallback: Record<string, string>;
      getItem(key: string): string | null;
      setItem(key: string, value: string): void;
      removeItem(key: string): void;
  }
  ```
* **Danh sách Consumers đang sử dụng `safeStorage`:**
  1. `js/app.js`: Quản lý lưu trữ theme học sinh (`toan6_theme`), cấu hình bỏ qua Google Login (`skipGoogleLogin`), tắt/bật âm thanh chào mừng (`splash_greeting_muted`), ngày học gần nhất (`english_last_study_date`).
  2. `js/parent.js`: Quản lý token phụ huynh (`adminToken`), theme bảng điều khiển (`parent_theme`).
  3. `js/questions-v3.js`: Quản lý dữ liệu nhân vật game (`td_hero_data`).

---

## 6. KẾ HOẠCH CHARACTERIZATION TEST CẦN THỰC THI

Trước khi tiến hành tách seam, bắt buộc phải hoàn thành bộ kiểm thử đặc tính (Characterization Test) tại `tests/core/safe-storage.test.js` với các ca kiểm thử:

1. **Test Case 1 (Standard Operations):**
   - `setItem("test_key", "value_123")` → `getItem("test_key")` trả về chính xác `"value_123"`.
   - `removeItem("test_key")` → `getItem("test_key")` trả về `null`.

2. **Test Case 2 (Exception & Fallback Handling):**
   - Giả lập `localStorage.setItem` ném ngoại lệ `DOMException: QuotaExceededError` hoặc `SecurityError` (chế độ ẩn danh).
   - Kiểm tra `safeStorage.setItem` không làm sập ứng dụng (không throw uncaught error), tự động lưu dữ liệu vào `fallback` RAM.
   - Kiểm tra `safeStorage.getItem` lấy được dữ liệu từ `fallback`.

3. **Test Case 3 (Edge Cases & Value Types):**
   - Đọc key không tồn tại → Trả về `null`.
   - Lưu chuỗi JSON lớn (> 100KB) → Lưu trữ và truy xuất toàn vẹn.
   - Lưu chuỗi rỗng `""` → Trả về `""` (không bị nhầm thành `null`).

---

## 7. KẾT LUẬN & TRẠNG THÁI HIỆN TẠI

* Toàn bộ 4 tài liệu hợp đồng và báo cáo seam đã được đồng bộ và lưu trữ tại thư mục [`.ai/`](file:///f:/KHQS/AntiGravity/HocTap/.ai).
* Không có bất kỳ dòng mã nguồn nào bị chỉnh sửa.
* Hệ thống đã sẵn sàng cho bước refactor đầu tiên khi có yêu cầu tiếp theo từ người dùng.
