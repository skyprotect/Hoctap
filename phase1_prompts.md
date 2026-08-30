# 📋 BỘ PROMPT CHUYÊN NGHIỆP — GIAI ĐOẠN 1: TÁI KIẾN TRÚC NỀN TẢNG
## Dự án: HocTap v13.29 (Build 1343) | Thư mục: `f:\KHQS\AntiGravity\HocTap`

> **Hướng dẫn sử dụng:** Copy từng khối `TASK 1.X` riêng biệt vào một cuộc hội thoại AI Agent mới.
> Hoàn thành và xác nhận kết quả TASK 1.1 → 1.2 → 1.3 → 1.4 theo thứ tự này.
> Mỗi Task phải được chạy `npm run release` và `node sync_clean.js` sau khi hoàn thành theo Rule 8, 9, 11.

---

## ═══════════════════════════════════════════════════════════
## TASK 1.1 — TÁCH SERVER.JS THÀNH KIẾN TRÚC MVC CHUẨN
## ═══════════════════════════════════════════════════════════

```
COPY PROMPT NÀY VÀO AI AGENT:
```

---

Bạn là **Principal Backend Architect** với chuyên môn sâu về Node.js/Express MVC, SQLite và kiến trúc microservice. Nhiệm vụ của bạn là **tái cấu trúc an toàn** (safe refactor) backend của dự án HocTap mà **KHÔNG được làm gián đoạn bất kỳ tính năng nào đang hoạt động**.

### 📁 Bối cảnh Dự án
- **Thư mục gốc:** `f:\KHQS\AntiGravity\HocTap`
- **File mục tiêu:** `f:\KHQS\AntiGravity\HocTap\server.js` (4,867 dòng / 223KB — monolithic)
- **Cấu trúc skeleton đã có** tại `f:\KHQS\AntiGravity\HocTap\server\` nhưng chưa được tích hợp vào `server.js` chính
- **Phiên bản hiện tại:** 13.29 | **Phiên bản sau khi hoàn thành:** 13.30

### 🎯 Mục tiêu
Tách `server.js` thành cấu trúc MVC chuẩn **mà không thay đổi bất kỳ API endpoint nào** (URL, request body, response format đều phải giữ nguyên 100%):

```
server/
├── middleware/
│   ├── auth.middleware.js        ← authenticateAdminToken(), getAdminUserFromRequest()
│   └── error.middleware.js       ← Global error handler
├── db/
│   └── database.js              ← ĐÃ CÓ — 1 connection duy nhất, KHÔNG tạo thêm
├── services/
│   ├── firebase.service.js      ← syncStudentProgressToFirebase(), hydrateStudentProgressFromFirebase()
│   ├── gemini.service.js        ← Tất cả Gemini API calls
│   └── migration.service.js     ← migrateFixMathBugsV12() và các migration khác
├── routes/
│   ├── auth.routes.js           ← /api/auth/* endpoints
│   ├── student.routes.js        ← /api/student-info, /api/save-progress, /api/load-progress
│   ├── quiz.routes.js           ← /api/get-questions, /api/generate-exam
│   ├── admin.routes.js          ← /api/admin/* endpoints (yêu cầu authenticateAdminToken)
│   └── system.routes.js         ← /api/firebase-config, /api/version, /api/report-client-error
└── controllers/
    ├── auth.controller.js
    ├── student.controller.js
    ├── quiz.controller.js
    ├── admin.controller.js
    └── system.controller.js
```

### ⚠️ QUY TẮC BẮT BUỘC TUYỆT ĐỐI (Không được vi phạm)

1. **KHÔNG ĐƯỢC** xóa hoặc đổi tên bất kỳ API endpoint URL nào. Client `student.html` và `parent.html` gọi các endpoint này trực tiếp.
2. **KHÔNG ĐƯỢC** tạo thêm kết nối SQLite mới. Toàn bộ hệ thống phải dùng đúng 1 instance `db` được khởi tạo ở `server/db/database.js`.
3. **KHÔNG ĐƯỢC** xóa `server.js` gốc — chỉ biến nó thành file entry-point gọn (< 100 dòng) dùng `require()` để nạp các module mới.
4. **PHẢI BẢO TOÀN** toàn bộ logic `SYSTEM_STUDENTS`, `resolveStudentClassLevel()`, và hardcoded fallback Firebase config.
5. **PHẢI BẢO TOÀN** cơ chế tự sinh `.env` từ `.env.example` khi khởi động.
6. **PHẢI BẢO TOÀN** cơ chế kiểm tra `PRAGMA integrity_check` và tự phục hồi database khi hỏng.
7. **PHẢI BẢO TOÀN** `EMBEDDED_API_KEYS` và hàm `getActiveGeminiApiKeys()`.
8. **KHÔNG ĐƯỢC** chỉnh sửa bất kỳ dòng nào trong `student.html`, `parent.html`, `js/app.js`.

### 📋 Quy trình Thực hiện (Bắt buộc theo thứ tự)

**Bước 1 — Đọc hiểu (Research Only, không chỉnh sửa):**
- Đọc toàn bộ `server.js` để lập danh sách đầy đủ tất cả các `app.get()`, `app.post()`, `app.delete()` endpoints
- Đọc `server/db/database.js`, `server/services/auth.service.js`, `server/services/gemini.service.js` hiện có
- Đọc `server/routes/api.routes.js` và `server/controllers/` hiện có
- Lập bảng tồn kho: Tên endpoint → File nguồn hiện tại → File đích sau refactor

**Bước 2 — Tạo Middleware Layer:**
- Tạo `server/middleware/auth.middleware.js`: chứa `authenticateAdminToken` + `getAdminUserFromRequest`
- Tạo `server/middleware/error.middleware.js`: chứa global error handler 404 + 500

**Bước 3 — Tạo Service Layer:**
- Tạo `server/services/firebase.service.js`: migrate `syncStudentProgressToFirebase()`, `syncAllStudentsToFirebase()`, `hydrateStudentProgressFromFirebaseRTDB()`
- Cập nhật `server/services/gemini.service.js`: migrate tất cả Gemini API calls
- Tạo `server/services/migration.service.js`: migrate `migrateFixMathBugsV12()` và các hàm migration khác

**Bước 4 — Tạo Route + Controller Layer:**
- Tạo từng cặp `routes/*.routes.js` + `controllers/*.controller.js` theo danh sách ở trên
- Mỗi controller chỉ được `require` từ `server/db/database.js` và `server/services/`

**Bước 5 — Viết lại server.js thành Entry Point:**
```javascript
// server.js sau refactor (< 120 dòng)
// Phần 1: Setup môi trường (giữ nguyên: tự sinh .env, dotenv.config, SYSTEM_STUDENTS, EMBEDDED_API_KEYS...)
// Phần 2: Khởi tạo DB + PRAGMA + createTables() (giữ nguyên hoàn toàn)
// Phần 3: Express app + middleware
// Phần 4: require và mount các router
app.use('/api/auth', require('./server/routes/auth.routes'));
app.use('/api', require('./server/routes/student.routes'));
// ...
// Phần 5: app.listen()
```

**Bước 6 — Kiểm tra:**
- Chạy `node server.js` và xác nhận không có lỗi khởi động
- Dùng curl hoặc browser test 5 endpoints quan trọng nhất: `/api/firebase-config`, `/api/student-info`, `/api/version`, `/api/save-progress` (POST), `/api/get-questions`

**Bước 7 — Cập nhật phiên bản:**
- Nâng version từ `13.29` → `13.30` trong `version.json`, `student.html`, `installer.iss`, `css/style.css?v=`
- Cập nhật `lastUpdated` thành thời gian hiện tại
- Chạy `node sync_clean.js` để đồng bộ sang `HocTap_Clean`
- Chạy `npm run release` để đóng gói và phát hành

### ✅ Tiêu chí Hoàn thành
- [ ] `server.js` gốc còn < 150 dòng (chỉ là entry point)
- [ ] Tất cả API endpoints trả về response giống hệt trước refactor (không thay đổi format)
- [ ] `node server.js` khởi động thành công, không có lỗi hoặc warning mới
- [ ] Không có duplicate SQLite connection (chỉ 1 `db` instance toàn hệ thống)
- [ ] Version đã được nâng lên 13.30

---

## ═══════════════════════════════════════════════════════════
## TASK 1.2 — VIẾT INTEGRATION TESTS CHO API BACKEND
## ═══════════════════════════════════════════════════════════

```
COPY PROMPT NÀY VÀO AI AGENT (SAU KHI TASK 1.1 HOÀN THÀNH):
```

---

Bạn là **Senior QA Engineer & Test Architect** với chuyên môn về Integration Testing cho Node.js/Express API và SQLite. Nhiệm vụ của bạn là xây dựng bộ integration test đầy đủ cho backend dự án HocTap **đảm bảo mọi thay đổi code trong tương lai không thể âm thầm phá vỡ chức năng**.

### 📁 Bối cảnh Dự án
- **Thư mục gốc:** `f:\KHQS\AntiGravity\HocTap`
- **Framework test hiện có:** Jest (`package.json` đã có `"test": "jest"`)
- **Test files hiện có:** `tests/questions.test.js` (unit test cho 3 hàm — quá ít)
- **Phiên bản hiện tại:** 13.30 (sau Task 1.1) | **Phiên bản sau Task này:** 13.31

### 🎯 Mục tiêu
Viết bộ integration test hoàn chỉnh bao phủ **10 API endpoints quan trọng nhất**, sử dụng **in-memory SQLite** để test không ảnh hưởng đến `database.db` thật.

### 📋 Danh sách Test Cần Viết

**File: `tests/api/system.test.js`**
```
✅ GET /api/version → trả về JSON có field 'version', 'build', 'lastUpdated'
✅ GET /api/firebase-config → trả về JSON có field 'apiKey', 'projectId', 'appId'
✅ POST /api/report-client-error → trả về { success: true } và không crash server
```

**File: `tests/api/auth.test.js`**
```
✅ POST /api/auth/google-login với invalid token → trả về 401 hoặc 400
✅ POST /api/auth/google-login với missing body → trả về 400
✅ GET /api/student-info?studentId=std_htsj4gbmo → trả về data học sinh hợp lệ
✅ GET /api/student-info?studentId=INVALID_ID → trả về 404 hoặc data rỗng hợp lý
```

**File: `tests/api/progress.test.js`**
```
✅ POST /api/save-progress với payload hợp lệ → trả về { success: true }
✅ POST /api/save-progress với studentId không tồn tại → trả về lỗi có message rõ ràng
✅ POST /api/save-progress → xác nhận dữ liệu đã được ghi vào DB (đọc lại để kiểm tra)
✅ POST /api/save-progress nhiều lần liên tiếp → chỉ lưu state mới nhất, không duplicate
```

**File: `tests/api/questions.test.js`**
```
✅ GET /api/get-questions?classLevel=6&lessonId=... → trả về array câu hỏi
✅ GET /api/get-questions với params thiếu → trả về lỗi rõ ràng (400)
```

### ⚠️ QUY TẮC BẮT BUỘC

1. **PHẢI dùng in-memory SQLite** (`:memory:`) hoặc tạo `database_test.db` riêng trong `beforeAll()` và xóa trong `afterAll()`. **TUYỆT ĐỐI KHÔNG** test trên `database.db` thật.
2. **PHẢI mock** các external calls: Google OAuth verification, Gemini API calls, Firebase RTDB calls. Dùng `jest.mock()`.
3. **PHẢI dùng `supertest`** để test HTTP endpoints — thêm `supertest` vào `devDependencies` nếu chưa có.
4. **Mỗi test phải độc lập** — không phụ thuộc vào kết quả test trước (dùng `beforeEach` để reset state).
5. **PHẢI cover cả Happy Path và Error Path** cho mỗi endpoint.
6. **KHÔNG ĐƯỢC** chỉnh sửa source code chính để test pass. Nếu test fail do bug, báo cáo bug — không sửa test để bypass.

### 📋 Quy trình Thực hiện

**Bước 1:** Cài đặt dependencies cần thiết: `npm install --save-dev supertest`

**Bước 2:** Tạo `tests/helpers/test-db.js` — helper khởi tạo in-memory DB với schema đầy đủ

**Bước 3:** Tạo `tests/helpers/mock-server.js` — tạo Express app test với in-memory DB và mocked externals

**Bước 4:** Viết lần lượt 4 file test theo danh sách trên

**Bước 5:** Chạy `npm test` — xác nhận **tất cả tests PASS**

**Bước 6:** Thêm vào `package.json`:
```json
"scripts": {
    "test:coverage": "jest --coverage --coverageReporters=text-summary"
}
```
Chạy `npm run test:coverage` và báo cáo % coverage đạt được.

**Bước 7:** Cập nhật version 13.30 → 13.31, chạy `node sync_clean.js` và `npm run release`.

### ✅ Tiêu chí Hoàn thành
- [ ] `npm test` chạy thành công, **không có test nào FAIL**
- [ ] Tổng số test cases: **≥ 15 test cases**
- [ ] Không có test nào động đến `database.db` thật
- [ ] `npm run test:coverage` chạy được và hiển thị report
- [ ] Version nâng lên 13.31

---

## ═══════════════════════════════════════════════════════════
## TASK 1.3 — THỐNG NHẤT STATE MANAGEMENT
## ═══════════════════════════════════════════════════════════

```
COPY PROMPT NÀY VÀO AI AGENT (SAU KHI TASK 1.2 HOÀN THÀNH):
```

---

Bạn là **Senior Frontend Architect** chuyên về State Management trong Vanilla JavaScript SPA (Single Page Application). Nhiệm vụ của bạn là loại bỏ **dual state object** đang gây ra bug rò rỉ dữ liệu trong dự án HocTap, bằng cách **thống nhất về 1 nguồn sự thật duy nhất**.

### 📁 Bối cảnh Dự án
- **Thư mục gốc:** `f:\KHQS\AntiGravity\HocTap`
- **Phiên bản hiện tại:** 13.31 | **Phiên bản sau Task này:** 13.32
- **Vấn đề cần giải quyết:** Hiện tồn tại 2 state object song song:
  - `window.AppState` — định nghĩa trong `js/core/state.js` (chuẩn, có cấu trúc)
  - `window.app` — định nghĩa trong `js/app.js` (~ dòng 80-200, tự xây)
- Hai object này không đồng bộ với nhau, gây ra bug: khi chuyển học sinh, state cũ từ `window.app` không được reset sạch, rò rỉ điểm số và lịch sử sai.

### 🎯 Mục tiêu
Đảm bảo `window.app` và `window.AppState` **hoàn toàn thống nhất** — cùng tham chiếu đến 1 object, hoặc `window.app` được loại bỏ hoàn toàn và các chỗ dùng `window.app.xxx` được thay bằng `window.AppState.xxx`.

### 📋 Quy trình Thực hiện

**Bước 1 — Phân tích (Research Only):**
- Đọc `js/core/state.js` — ghi nhận toàn bộ cấu trúc `AppState`
- Trong `js/app.js`, tìm tất cả nơi `window.app` hoặc `this` (khi `this` là `window.app`) được đọc/ghi — liệt kê thành bảng so sánh:
  ```
  | Property          | AppState path          | window.app path       | Khác nhau? |
  |---|---|---|---|
  | studentName       | AppState.config.studentName | app.config.studentName | Không |
  | xp                | AppState.state.xp      | app.state.xp          | Không |
  | currentSubject    | AppState.currentSubject | app.currentSubject    | Không |
  ```
- Phân tích kỹ các property **CHỈ tồn tại trong `window.app`** mà chưa có trong `AppState` — đây là những property cần migrate sang `state.js` trước.

**Bước 2 — Bổ sung AppState:**
- Cập nhật `js/core/state.js`: thêm các property còn thiếu từ `window.app` vào `AppState`
- **Bảo toàn 100%** các property hiện tại của `AppState` — chỉ được thêm, không xóa

**Bước 3 — Bridge Pattern (An toàn nhất):**
Thêm vào cuối `js/core/state.js` đoạn bridge sau để `window.app` trỏ vào đúng `AppState`:
```javascript
// Bridge: window.app → window.AppState để tương thích ngược
if (typeof window !== 'undefined') {
    window.app = window.AppState; // Alias, cùng tham chiếu
}
```
Sau bước này, mọi code gọi `window.app.state.xp` hay `window.AppState.state.xp` đều trỏ về cùng 1 object.

**Bước 4 — Xóa định nghĩa `window.app` trong app.js:**
- Tìm đoạn `window.app = { ... }` trong `js/app.js`
- Xóa dòng khởi tạo đó
- Xác nhận rằng tất cả các property đã có trong `AppState` (sau Bước 2)

**Bước 5 — Kiểm tra hàm reset state:**
Tìm và cập nhật hàm `loadProgress()` / `switchStudent()` trong `js/app.js` để đảm bảo:
```javascript
// Khi reset state học sinh, PHẢI reset AppState.state (không còn window.app.state riêng)
AppState.state = { ...AppState.getDefaultState(), ...(serverData || {}) };
```

**Bước 6 — Test thủ công:**
Mở `student.html` trên trình duyệt, thực hiện:
1. Vào học với học sinh Trần Bình Minh → kiểm tra XP hiển thị đúng
2. Chuyển sang học sinh Trần Bảo Ngọc → kiểm tra XP mới (không bị rò rỉ từ Minh)
3. Chuyển lại Trần Bình Minh → XP của Minh vẫn đúng

**Bước 7:** Nâng version 13.31 → 13.32, chạy `node sync_clean.js` và `npm run release`.

### ⚠️ QUY TẮC BẮT BUỘC
1. **KHÔNG ĐƯỢC** chỉnh sửa `student.html` trong bước này (chỉ sửa JS files)
2. **KHÔNG ĐƯỢC** thay đổi tên hoặc cấu trúc của `AppState` — chỉ bổ sung
3. **PHẢI** kiểm tra `window.safeStorage` vẫn hoạt động sau thay đổi (nó được define trong `state.js`)
4. **Tuân thủ Rule 10 tuyệt đối:** Dữ liệu môn Toán của Trần Bình Minh và Trần Đức Phúc phải được bảo toàn

### ✅ Tiêu chí Hoàn thành
- [ ] `window.app === window.AppState` trả về `true` trong console trình duyệt
- [ ] Không còn 2 chỗ khởi tạo state object riêng biệt
- [ ] Chuyển học sinh không còn rò rỉ state
- [ ] `npm test` vẫn PASS tất cả (không regression)
- [ ] Version nâng lên 13.32

---

## ═══════════════════════════════════════════════════════════
## TASK 1.4 — TÁCH APP.JS THÀNH FEATURE MODULES
## ═══════════════════════════════════════════════════════════

```
COPY PROMPT NÀY VÀO AI AGENT (SAU KHI TASK 1.3 HOÀN THÀNH):
```

---

Bạn là **Principal Frontend Architect** với hơn 10 năm kinh nghiệm tách monolithic Vanilla JavaScript thành module-based architecture **mà không dùng bundler** (không Webpack, không Vite — vì dự án cần hoạt động zero-config). Nhiệm vụ là tách `js/app.js` (12,735 dòng / 734KB) thành các Feature Module độc lập.

### 📁 Bối cảnh Dự án
- **Thư mục gốc:** `f:\KHQS\AntiGravity\HocTap`
- **Phiên bản hiện tại:** 13.32 | **Phiên bản sau Task này:** 13.33
- **Ràng buộc kỹ thuật:** Không được dùng ES Modules `import/export` vì file được serve qua Express static và cần hoạt động với `file://` protocol (Kiosk Mode). Dùng IIFE pattern như `event-bus.js`, `state.js`, `api-client.js` hiện có.
- **Test coverage:** Tasks 1.2 đã có integration tests bảo vệ backend. Task này tập trung frontend.

### 🎯 Mục tiêu
Tách `js/app.js` thành tối thiểu **6 Feature Modules** theo nguyên tắc Single Responsibility:

```
js/
├── core/                     ← ĐÃ CÓ (giữ nguyên)
│   ├── state.js
│   ├── event-bus.js
│   └── api-client.js
├── features/                 ← ĐÃ CÓ SKELETON (mở rộng)
│   ├── katex-service.js      ← ĐÃ CÓ
│   ├── quiz-manager.js       ← ĐÃ CÓ (mở rộng)
│   ├── audio-service.js      ← ĐÃ CÓ
│   ├── ui-renderer.js        ← ĐÃ CÓ (mở rộng)
│   └── chibi-controller.js   ← ĐÃ CÓ
├── modules/                  ← TẠO MỚI
│   ├── splash.module.js      ← Màn hình chào / Splash Screen logic
│   ├── practice.module.js    ← Màn hình luyện tập (practice-mode)
│   ├── leaderboard.module.js ← Bảng xếp hạng & đồng bộ Firebase
│   ├── settings.module.js    ← Cài đặt phụ huynh, đổi PIN, quản lý học sinh
│   ├── vocab-monster.module.js ← Quái vật từ vựng (Vocab Monster feature)
│   └── skill-card.module.js  ← Thẻ năng lực (Skill Cards & Badge system)
└── app.js                    ← CHỈ CÒN: DOMContentLoaded entry point + require modules
```

### 📋 Quy trình Thực hiện (QUAN TRỌNG — Làm từng module một)

**Bước 0 — Phân tích Trước Khi Viết Code:**
Đọc `js/app.js` và lập bản đồ function:
```
| Hàm / Block code              | Dòng bắt đầu | Dòng kết thúc | Module đích          |
|---|---|---|---|
| initSplashClock()             | ???           | ???           | splash.module.js     |
| displayRandomSplashQuote()    | ???           | ???           | splash.module.js     |
| renderLeaderboard()           | ???           | ???           | leaderboard.module.js|
| openParentSettings()          | ???           | ???           | settings.module.js   |
| ...                           | ...           | ...           | ...                  |
```
Trình bày bản đồ này cho người dùng xem và xác nhận trước khi viết code.

**Bước 1 — Tách từng module (theo thứ tự từ ít phụ thuộc → nhiều phụ thuộc):**

Với MỖI module, thực hiện 3 bước nhỏ:
1. **Tạo file module** với IIFE pattern:
```javascript
// js/modules/splash.module.js
(function() {
    'use strict';
    
    const SplashModule = {
        init: function() { /* ... */ },
        initClock: function() { /* ... */ },
        displayQuote: function() { /* ... */ }
    };
    
    if (typeof window !== 'undefined') {
        window.SplashModule = SplashModule;
    }
})();
```
2. **Thêm `<script>` tag** vào `student.html` ở đúng vị trí (sau `core/`, trước `app.js`)
3. **Xóa code tương ứng** khỏi `app.js` và thay bằng lời gọi: `SplashModule.init()`
4. **Test ngay** sau mỗi module: mở trình duyệt, kiểm tra tính năng vừa tách vẫn hoạt động

**Bước 2 — Sau khi tách xong tất cả:**
Kiểm tra `app.js` còn lại chỉ nên là entry point:
```javascript
// js/app.js sau refactor (mục tiêu < 500 dòng)
// Chứa: SKILL_CARDS data, DOMContentLoaded handler, và gọi init() của từng module
document.addEventListener('DOMContentLoaded', function() {
    SplashModule.init();
    PracticeModule.init();
    LeaderboardModule.init();
    SettingsModule.init();
    // ...
});
```

**Bước 3 — Cập nhật `student.html`:**
Thêm `<script>` tags cho các module mới, ĐẢM BẢO thứ tự load đúng:
```html
<!-- Core modules (giữ nguyên) -->
<script src="js/core/state.js?v=13.33"></script>
<script src="js/core/event-bus.js?v=13.33"></script>
<script src="js/core/api-client.js?v=13.33"></script>

<!-- Feature services (giữ nguyên) -->
<script src="js/features/audio-service.js?v=13.33"></script>
<!-- ... -->

<!-- NEW: Feature Modules -->
<script src="js/modules/splash.module.js?v=13.33"></script>
<script src="js/modules/practice.module.js?v=13.33"></script>
<!-- ... -->

<!-- Entry point (giảm từ 734KB xuống còn nhỏ hơn nhiều) -->
<script src="js/app.js?v=13.33"></script>
```

**Bước 4 — Kiểm tra toàn diện:**
Test thủ công toàn bộ luồng người dùng:
1. Màn hình Splash → chào hỏi, đồng hồ, châm ngôn hoạt động
2. Chọn bài học → hiển thị danh sách bài
3. Làm bài trắc nghiệm → câu hỏi load, chọn đáp án, tính điểm
4. Bảng xếp hạng → load và hiển thị
5. Cài đặt phụ huynh (PIN: 123456) → mở/đóng bình thường

**Bước 5:** Nâng version 13.32 → 13.33, cập nhật tất cả `?v=` cachebuster, chạy `node sync_clean.js` và `npm run release`.

### ⚠️ QUY TẮC BẮT BUỘC
1. **Tách từng module một** — không tách nhiều module cùng lúc. Test sau mỗi module.
2. **IIFE pattern bắt buộc** — không được dùng `import/export`
3. **Cachebuster `?v=13.33`** trên tất cả `<script>` và `<link>` tags trong `student.html`
4. **Tuân thủ Rule 10** — dữ liệu Toán học của Trần Bình Minh và Trần Đức Phúc không được mất
5. **`npm test` phải PASS** sau mỗi module được tách
6. **Báo cáo tiến độ** sau mỗi module: "Đã tách `splash.module.js`, app.js giảm từ 12,735 dòng còn X dòng"

### ✅ Tiêu chí Hoàn thành
- [ ] `js/app.js` còn < 800 dòng (giảm ít nhất 90% so với ban đầu)
- [ ] Tối thiểu 6 module files được tạo trong `js/modules/`
- [ ] Toàn bộ tính năng hiện tại vẫn hoạt động (test thủ công đầy đủ 5 luồng)
- [ ] `npm test` PASS tất cả
- [ ] Version nâng lên 13.33
- [ ] Cachebuster đã cập nhật trên tất cả assets

---

## 📌 BẢNG THEO DÕI TIẾN ĐỘ GIAI ĐOẠN 1

| Task | Mô tả | Phiên bản | Trạng thái |
|---|---|---|---|
| 1.1 | Tách server.js → MVC | 13.29 → 13.30 | ⏳ Chưa bắt đầu |
| 1.2 | Viết Integration Tests | 13.30 → 13.31 | ⏳ Chờ 1.1 |
| 1.3 | Thống nhất State Management | 13.31 → 13.32 | ⏳ Chờ 1.2 |
| 1.4 | Tách app.js → Feature Modules | 13.32 → 13.33 | ⏳ Chờ 1.3 |

> **Kết thúc Giai đoạn 1:** HocTap v13.33 với kiến trúc MVC backend + modular frontend + integration tests.
> Sau khi hoàn thành, tiến hành đánh giá lại điểm kiến trúc (dự kiến từ 67/100 → 82/100).
