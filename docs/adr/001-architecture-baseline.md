# ADR-001: Architecture & Quality Baseline — HocTap System

**Status:** Accepted  
**Date:** 2026-08-30  
**Version:** v13.49  
**Scope:** Toàn bộ hệ thống HocTap (Backend TypeScript/Express, Frontend Vanilla JS SPA, SQLite WAL, Mobile/Desktop Kiosk, AI Orchestration & Gamification Engine)  
**Governance:** Tuân thủ Hiến pháp Kỹ thuật AI (`AGENT.md`) và Quy trình `/bootstrap-engineering`

---

## 1. Project Purpose and Scope

- **[FACT]** Dự án **HỌCTẬP (HocTap System)** là nền tảng giáo dục thông minh đa môn học (Toán học & Tiếng Anh chuẩn Quốc tế Cambridge/CEFR), tích hợp trí tuệ nhân tạo Google Gemini AI, trò chơi hóa (Gamification Tower Defense Canvas 2D) và bảo mật Kiosk kép.
- **[FACT]** Phạm vi phục vụ 3 khối lớp trọng điểm:
  - **Lớp 1**: Nền tảng Toán & Tiếng Anh Pre-A1 Starters.
  - **Lớp 4**: Toán nâng cao & Tiếng Anh A1 Movers.
  - **Lớp 6**: Toán tư duy đại số - hình học THCS & Tiếng Anh A2 Flyers / KET.
- **[FACT]** Hệ thống vận hành theo triết lý **Local-First & 100% Offline-Capable**, đồng thời hỗ trợ đồng bộ đám mây đa tầng (Multi-tier Cloud Sync) với Firebase Firestore khi có kết nối mạng.

---

## 2. Tech Stack

- **[FACT] Backend Runtime**: Node.js (v18+ / v20+ / v22+), TypeScript `~5.6.3` thực thi runtime qua `ts-node` (transpile-only mode trong `server.js`).
- **[FACT] Web Server**: Express.js `^5.2.1`, CORS `^2.8.6`, JWT (`jsonwebtoken ^9.0.3`), `dotenv ^17.4.2`.
- **[FACT] Database & Storage**:
  - SQLite 3 (`sqlite3 ^6.0.1`) với chế độ WAL (`PRAGMA journal_mode = WAL`) quản lý qua Singleton `DatabasePool.ts`.
  - Firebase Admin SDK `^14.1.0` / Google Auth Library `^9.15.0` cho đồng bộ đám mây và xác thực phụ huynh từ xa.
- **[FACT] Frontend Runtime**:
  - Vanilla JS ES2020+ theo cấu trúc Modular Single Page Application (SPA).
  - Không sử dụng các framework nặng (React/Vue/Angular) ở client nhằm tối ưu hiệu năng Kiosk và tương thích thiết bị nhúng/máy tính bảng cũ.
  - Thư viện bên thứ ba: KaTeX (kèm extension mhchem/copy-tex), SweetAlert2, FontAwesome, Chart.js, Mermaid.js.
  - HTML5 Canvas 2D Engine cho đồ họa Game Thủ Thành (Tower Defense) và bảng vẽ nháp (Scratchpad).
- **[FACT] Native Kiosk Subsystems**:
  - Windows: C# Win32 Low-Level Keyboard/Mouse Hook Native Application (`kiosk_lock.exe` / `kiosk_lock.cs`).
  - Android: Ứng dụng Android Kiosk Mode chuyên dụng (`android_kiosk/`) với hệ thống cấp phát Tablet Tokens.
- **[FACT] Test & Tooling Framework**:
  - Jest `^29.7.0`, Supertest `^7.2.2`, Playwright `^1.42.1`, TypeScript `tsc`.

---

## 3. Runtime / Build / Package Model

- **[FACT] Runtime Model**:
  - Điểm vào máy chủ: `server.js` (kích hoạt `ts-node/register` chuyển tiếp vào `server/**/*.ts`).
  - Điểm vào học sinh: `student.html` và Service Worker `sw.js` (PWA Cache-First cho tài nguyên tĩnh, Network-First cho API).
  - Điểm vào phụ huynh: `parent.html` (mạng nội bộ) và `parent_remote.html` (qua Cloudflare Tunnel / Firebase Hosting).
- **[FACT] Build & Bundling**:
  - Bộ công cụ đóng gói trong `scripts/build/`:
    - `bundle_html.js`, `bundle_css.js`, `bundle_game.js`, `bundle_math_g6.js`, `bundle_parent.js`: Gom cụm và tối ưu hóa tài nguyên.
    - `generate_math_json.js`: Sinh dữ liệu đề thi tĩnh JSON từ các generator thuật toán.
- **[FACT] Release & Packaging**:
  - Đóng gói cài đặt Windows: Inno Setup Script (`installer.iss`) sinh file `ToanHocKiosk_Setup_v*.exe`.
  - Tự động hóa phát hành: `npm run release` (`scripts/build/release.js`) tự động đóng gói, tạo thẻ Git tag và đẩy lên GitHub Releases.
  - Đồng bộ bản sạch: `npm run sync` (`scripts/build/sync_clean.js`) sao chép mã nguồn sang thư mục `HocTap_Clean`, loại bỏ 100% dữ liệu cá nhân (`database.db`, `.port.tmp`, logs).

---

## 4. Architecture and Layers

Hệ thống được thiết kế theo mô hình 4 phân tầng nghiêm ngặt:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. PRESENTATION LAYER (Client SPA & Kiosk)                  │
│    student.html, parent.html, css/style.css, sw.js          │
│    Façade: window.app (js/app.js)                           │
├─────────────────────────────────────────────────────────────┤
│ 2. APPLICATION / FEATURE LAYER (Client & Server)            │
│    Client: js/core/, js/engine/, js/features/, js/modules/  │
│    Server: server/controllers/, server/middleware/          │
├─────────────────────────────────────────────────────────────┤
│ 3. DOMAIN LAYER (Pedagogical & Game Engines)                │
│    QuestionEngine v3.0 (js/engine/question-engine.js)       │
│    AI Auditor & Gemini Pipeline (server/services/ai/)       │
│    Tower Defense Engine (js/game/)                          │
│    Curriculum Data (data/grade_{1,4,6}/)                    │
├─────────────────────────────────────────────────────────────┤
│ 4. INFRASTRUCTURE & DATA LAYER                              │
│    SQLite WAL Pool (server/db/database.ts, schema.ts)       │
│    Firebase Sync (server/services/firebase.service.ts)      │
│    Native Hook (kiosk_lock.exe, Android Kiosk)              │
└─────────────────────────────────────────────────────────────┘
```

- **[FACT] Dependency Flow**: Luôn theo một chiều từ Presentation → Application → Domain → Infrastructure. Domain logic không phụ thuộc trực tiếp vào các chi tiết hạ tầng HTTP hay Win32 Hook.

---

## 5. Module & Domain Ownership

| Phân vùng Module | Vị trí Mã nguồn | Chủ thể Sở hữu & Trách nhiệm Duy nhất (Single Responsibility) |
| :--- | :--- | :--- |
| **Server Routing & API** | `server/routes/`, `server/controllers/` | Xử lý yêu cầu HTTP REST, điều phối xác thực JWT, phân luồng nghiệp vụ. |
| **Database & Migrations** | `server/db/`, `server/services/migration.service.ts` | Quản lý kết nối SQLite, chạy di trú lược đồ (schema migration), bảo toàn toàn vẹn dữ liệu. |
| **AI Orchestration** | `server/services/ai/` | Quản lý xoay vòng API Keys Gemini, xây dựng prompt, thẩm định sư phạm 4 bước (AI Auditor). |
| **Client Core Infra** | `js/core/` (`state.js`, `storage.js`, `event-bus.js`, `api-client.js`, `navigation.js`, `lazy-loader.js`) | Quản trị vòng đời SPA, lưu trữ an toàn, chuyển màn hình, nạp module lười. |
| **Question Engine v3.0** | `js/engine/question-engine.js` | Sinh câu hỏi trắc nghiệm/tự luận động, giải thuật tam phân chống trùng đáp án, cache câu hỏi. |
| **Gamification & Cards** | `js/features/gamification-service.js`, `js/modules/skill-card.module.js` | Hệ thống 50 thẻ năng lực, 30 danh hiệu (Badges), tính toán XP/Gold/Streak. |
| **Canvas 2D Game Engine**| `js/game/` | Vòng lặp trò chơi (Game Loop Delta Time), hệ thống chiến đấu, kỹ năng và tháp thủ thành. |
| **Curriculum Datasets** | `data/grade_1/`, `data/grade_4/`, `data/grade_6/`, `js/lessons.js` | Nguồn chân lý duy nhất (Single Source of Truth) về cây bài học, lý thuyết và bộ bài tập. |
| **Global Client Façade** | `js/app.js` | Đối tượng `window.app` cung cấp 52 API công khai kết nối toàn bộ sự kiện HTML DOM. |

---

## 6. Dependency Direction & Circular Checks

- **[FACT] Client-Side**:
  - `js/core/` là tầng cơ sở, không phụ thuộc vào `js/modules/` hay `js/features/`.
  - `js/modules/` giao tiếp với nhau qua `EventBus` (`js/core/event-bus.js`) hoặc thông qua `AppState` (`js/core/state.js`), loại bỏ hoàn toàn các phụ thuộc vòng (Circular Dependencies).
  - `js/app.js` đóng vai trò Façade tổng hợp kết nối các module vào biến toàn cục `window.app`.
- **[FACT] Server-Side**:
  - `server/routes/` → `server/controllers/` → `server/services/` → `server/db/database.ts`.
  - Không có chu trình phụ thuộc vòng giữa các service.

---

## 7. State Ownership

- **[FACT] Phân lập Dữ liệu Học sinh (Student Isolation)**:
  - Mọi trạng thái người dùng tại Client được lưu trong `AppState` với khóa theo từng `studentId` riêng biệt.
  - Phân quyền tài khoản phụ huynh:
    - Tài khoản `skyprotect@gmail.com`: Quản lý 2 học sinh riêng biệt: **Trần Bình Minh** (`std_htsj4gbmo`, Lớp 6) và **Trần Bảo Ngọc** (`std_baongoc`, Lớp 1).
    - Tài khoản `nhematseo@gmail.com`: Quản lý 1 học sinh: **Trần Đức Phúc** (`std_tyc0gfnkz`, Lớp 4).
- **[FACT] Phân lập Môn học (Subject Isolation - Rule 10)**:
  - Dữ liệu môn Toán (`gold`, `mathStreak`, ma trận tiến độ chuyên đề) và môn Tiếng Anh (`englishXp`, `englishHearts`, `englishStreak`, điểm 4 kỹ năng) được lưu độc lập, tuyệt đối không ghi đè lẫn nhau.
- **[FACT] Tính Bất biến & Ghi Nguyên khối (Atomic Persistence)**:
  - Mọi thao tác lưu tiến trình xuống SQLite được bao bọc trong transaction hoặc câu lệnh UPDATE có điều kiện phiên bản nhằm triệt tiêu lỗi Lost Update do ghi đồng thời.

---

## 8. Data Sources & Canonical Sources

- **[FACT] Canonical Sources**:
  - **Giáo trình Toán**: `data/grade_1/math/generator.js`, `data/grade_4/math/generator.js`, `data/grade_6/math/generator.js`, `data/grade_6/math/advanced.js`, `data/grade_6/math/exam7991.js`.
  - **Giáo trình Tiếng Anh**: `data/grade_1/english/lessons.js`, `data/grade_4/english/lessons.js`, `data/grade_6/english/lessons.js`, `js/english_data.js`.
  - **Cơ cấu Bài học & Video**: `js/lessons.js`.
- **[FACT] Deprecated/Duplicated Sources**:
  - Đã triệt tiêu 100% các tệp duplicate cũ (`js/questions-v1.js`, `js/questions-v4.js`, `js/questions-v3.js`, `js/questions-7991.js`). Mọi tham chiếu đều trỏ trực tiếp về thư mục chuẩn `data/`.

---

## 9. Test Strategy

- **[FACT] Test Pyramid**:
  1. **Unit Tests (Jest)**: Kiểm thử logic sinh câu hỏi toán học (`tests/questions.test.js`, `tests/question-engine.test.js`), kiểm thử API controllers (`tests/api/*.test.js`).
  2. **Characterization Tests**: Bảo vệ các hành vi nghiệp vụ đặc thù, trạng thái đồng thời và cơ chế xoay vòng Gemini API Key (`tests/characterization.test.js`).
  3. **E2E & Lifecycle Tests**: Kiểm thử vòng đời nạp modal, hợp đồng khởi động và tích hợp AI (`tests/evaluation_modal_lifecycle.test.js`, `tests/evaluation_modal_e2e.test.js`, `tests/startup_contract.test.js`).
  4. **Pedagogical Integrity Tests**: Kịch bản kiểm toán chống trùng lặp đáp án và kiểm tra cú pháp LaTeX cho 121 dạng bài Toán (`scripts/maintenance/exams_auditor.js`).
- **[EVIDENCE]** Thực thi kiểm thử: 10 test suites, 64 tests, 100% PASS.

---

## 10. Quality Gates

| Quality Gate | Lệnh Kiểm tra | Tiêu chí Đạt (Pass Criteria) | Trạng thái Thực tế |
| :--- | :--- | :--- | :--- |
| **Type Check** | `npm run typecheck` (`tsc --noEmit`) | 0 lỗi biên dịch kiểu dữ liệu TypeScript trong `server/` | **PASS (Code 0)** |
| **File Growth Gate** | `npm run check:growth` (`node scripts/quality/check-file-growth.js`) | 205/205 tệp mã nguồn tuân thủ giới hạn LOC hoặc ngoại lệ kiến trúc có kiểm soát | **PASS (Code 0)** |
| **Unit & Regression Suite** | `npm run test` (`jest --runInBand --forceExit`) | 10/10 test suites PASS, 64/64 tests PASS | **PASS (Code 0)** |
| **Test Coverage** | `npm run test:coverage` | Đo lường đầy đủ độ phủ câu lệnh, nhánh và hàm | **PASS (Code 0)** |
| **Consolidated Quality Gate**| `npm run quality` | Chạy tuần tự Typecheck + File Growth + Jest Suite | **PASS (Code 0)** |
| **Clean Bundle Sync** | `npm run sync` (`node scripts/build/sync_clean.js`) | Đồng bộ 100% tài nguyên sang `HocTap_Clean`, loại bỏ sạch dữ liệu cá nhân | **PASS (Code 0)** |

---

## 11. Release Pipeline

- **[FACT] Quy trình Phát hành Chuẩn (Rule 8, 9, 11)**:
  1. **Bước 1 - Pre-flight**: Kiểm tra đồng bộ Git (`git pull origin main`).
  2. **Bước 2 - Quality Verification**: Thực thi toàn bộ Quality Gates (`npm run quality`).
  3. **Bước 3 - Clean Sync**: Chạy đồng bộ bản sạch (`npm run sync`).
  4. **Bước 4 - Packaging**: Đóng gói bộ cài Windows Inno Setup (`ISCC.exe installer.iss`) hoặc APK Android (`npm run release:apk`).
  5. **Bước 5 - Automated Release**: Thực thi `npm run release` để tạo GitHub Release trực tuyến với mã kiểm tra SHA256 và ghi chú phát hành tự động.

---

## 12. Known Constraints & Justified Exceptions

- **[FACT] Constraints**:
  - **Zero-Config Distribution (Rule 14)**: Toàn bộ thông số Firebase Config, Google Client ID, và Fallback API Key phải được nhúng cố định trong mã nguồn. Ứng dụng không được phép phụ thuộc vào việc cấu hình biến môi trường thủ công của phụ huynh.
  - **Single Process / SQLite WAL**: SQLite cục bộ sử dụng cơ chế Write-Ahead Logging để hỗ trợ đa tiến trình đọc cùng lúc và một tiến trình ghi nguyên khối.
- **[FACT] Justified Exceptions for File Growth**:
  - Các tệp dữ liệu đề thi toán học lớn (`data/grade_6/math/generator.js`, `data/grade_6/math/exam7991.js`), động cơ game (`js/game/*`), và giao diện SPA học sinh (`student.html`) được cấu hình giới hạn dòng riêng biệt (trần kiểm soát từ 600 đến 3500 LOC) do đặc thù tích hợp tài nguyên đồ họa SVG nội tuyến và hàng trăm bộ công thức toán học chuyên biệt.

---

## 13. Evidence & Verification Commands

Toàn bộ các khẳng định kiến trúc và chất lượng được thẩm định qua các lệnh thực thi có thể tái lập:

1. **Kiểm tra Kiểu dữ liệu (Typecheck)**:
   ```bash
   npm run typecheck
   # Kết quả: Exit Code 0, 0 lỗi
   ```
2. **Kiểm tra Độ phình Tệp (File Growth Gate)**:
   ```bash
   npm run check:growth
   # Kết quả: Checked 205 files. Passed: 205/205. Exit Code 0.
   ```
3. **Thực thi Kiểm thử Đơn vị & Hợp đồng (Jest)**:
   ```bash
   npm test
   # Kết quả: Test Suites: 10 passed, 10 total. Tests: 64 passed, 64 total.
   ```
4. **Đo lường Độ phủ Mã nguồn (Coverage)**:
   ```bash
   npm run test:coverage
   # Kết quả: Statements: 36.85%, Branches: 29.92%, Functions: 36.9%, Lines: 38.4%.
   ```
5. **Kiểm tra Đồng bộ Bản sạch (Sync Clean)**:
   ```bash
   npm run sync
   # Kết quả: SYNC COMPLETED SUCCESSFULLY, Clean bundle verified.
   ```

