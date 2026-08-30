# HỌCTẬP SYSTEM — TÀI LIỆU KIẾN TRÚC TOÀN DIỆN (v13.39)

> **Ngày cập nhật:** 30/08/2026 16:47  
> **Trạng thái:** Hoàn tất Refactor, 100% Modularity, Quality Gate Đạt Chuẩn Tuyệt Đối.

---

## I. TỔNG QUAN HỆ THỐNG

Hệ thống **HọcTập** là nền tảng luyện thi & trợ lý sư phạm thông minh phục vụ học sinh phổ thông (Lớp 1, Lớp 4, Lớp 6) theo định dạng Kiosk / Desktop App và Web Application. Hệ thống bao gồm 3 phân hệ cốt lõi:

1. **Client Frontend (Web & Offline Kiosk)**: Giao diện học tập đa phương thức, hỗ trợ Math KaTeX, Vẽ nháp Canvas, Nhận dạng giọng nói Web Speech API, Game Tower Defense RPG và Monster Arena Tiếng Anh.
2. **Server Backend (Node.js/Express + SQLite DAL)**: Hệ thống API cục bộ phục vụ xác thực phụ huynh/học sinh, lưu trữ tiến trình cá nhân độc lập theo UUID, chấm điểm bài thi, đồng bộ ngoại tuyến (Offline Queue) và tích hợp AI Sư phạm đa khoá (Multi-Key Failover).
3. **Question & Game Engines**: Bộ sinh câu hỏi Toán động 121 dạng bài (Lớp 1: 42 dạng, Lớp 4: 36 dạng, Lớp 6: 43 dạng) triệt tiêu 100% trùng lặp đáp án và Game Engine Tower Defense 60FPS cấu trúc module hóa.

---

## II. SƠ ĐỒ PHÂN RÃ MODULE KIẾN TRÚC (HIGH-LEVEL COMPONENT ARCHITECTURE)

```mermaid
graph TD
    Client["Client Web / Desktop Kiosk (student.html, parent.html)"] --> APILayer["Façade & API Router (js/app.js, server/routes)"]
    
    subgraph "Frontend Subsystems"
        GameEngine["Game Engine (js/game/)"]
        MathGenerators["Math Generators (data/grade_6/math/generators/)"]
        CSSArchitecture["CSS System (css/*.css)"]
        EnglishArena["English Arena (data/grade_*/english/)"]
    end
    
    subgraph "Backend Services"
        ExpressServer["Express App (server/app.ts)"]
        DatabaseDAL["Database DAL (server/db/database.ts)"]
        DBSchema["DB Schema (server/db/schema.ts)"]
        DBSeed["DB Seed (server/db/seed.ts)"]
        AIService["Gemini AI Client (server/services/ai/)"]
        AuthService["Parent/Student Auth (server/services/auth/)"]
    end

    Client --> Frontend Subsystems
    APILayer --> Backend Services
    DatabaseDAL --> DBSchema
    DatabaseDAL --> DBSeed
```

---

## III. CHI TIẾT TỪNG PHÂN HỆ ĐÃ REFACTOR

### 1. Game Engine (`js/game/`)
Đã phân rã từ monolithic 6.420 dòng thành 14 domain submodules sạch sẽ:
- `core/math-utils.js`: Tính khoảng cách đoạn thẳng, vector va chạm, bounding box.
- `core/game-config.js`: Cấu hình 4 themes, 4 loại tháp phòng thủ, bảng nâng cấp, kỹ năng chủ động.
- `core/game-assets.js`: Loader tài nguyên ảnh/âm thanh và Worker tách nền sprite.
- `core/game-engine.js`: Vòng lặp GameLoop 60FPS với Fixed Timestep, Update & Draw logic.
- `systems/grid-system.js`: Kiểm tra ô đặt tháp, thuật toán sinh đa đường đi và địa hình ngẫu nhiên.
- `entities/hero.js`: Quản lý chỉ số Hero RPG, hệ số nhân sức mạnh, bộ chọn tướng.
- `systems/wave-system.js`: Bộ sinh quái theo đợt liên kết trực tiếp kết quả trả lời câu hỏi.
- `systems/combat-system.js`: Đạn đạo, va chạm, tính sát thương, hiệu ứng đóng băng/cháy, phần thưởng.
- `systems/skills-system.js`: Kỹ năng chủ động (Mưa sao băng, Bão tuyết tuyết đối, Khiên thần thánh).
- `rendering/monster-renderer.js`: Vẽ Vector Chibi monsters đa tầng động lực học.
- `rendering/tower-renderer.js`: Vẽ tháp phòng thủ 3D đa hướng và cấp độ tiến hóa.
- `rendering/map-renderer.js`: Vẽ bản đồ 3D, đường đá lát, lâu đài phòng thủ và cổng ma thuật.
- `rendering/effects-renderer.js`: Hệ thống hạt hiệu ứng hạt (Particles), hiệu ứng thời tiết, rơi vàng/kim cương.
- `ui/game-ui.js`: Bảng điều khiển HUD, nút đặt/nâng cấp/bán tháp, thanh máu lâu đài, bind sự kiện.
- `index.js`: Façade tích hợp nạp an toàn cả trình duyệt lẫn Node.js tests.
- `scripts/build/bundle_game.js`: Tự động đóng gói thành canonical bundle `js/game.js`.

### 2. Math Generator Lớp 6 (`data/grade_6/math/`)
Đã phân rã từ monolithic 10.294 dòng thành 11 submodules chuyên biệt:
- `generators/chapter1_naturals.js`: 14 dạng bài Số tự nhiên, Ước, Bội, BCNN, ƯCLN, Thừa số nguyên tố.
- `generators/chapter2_integers.js`: 5 dạng bài Số nguyên âm/dương, quy tắc dấu ngoặc, phép tính số nguyên.
- `generators/chapter3_geometry.js`: 5 dạng bài Hình học trực quan (Tam giác đều, Hình vuông, Lục giác đều, Hình thoi, Hình bình hành).
- `generators/chapter4_statistics.js`: 6 dạng bài Thống kê, Bảng số liệu, Biểu đồ tranh, Biểu đồ cột kép, Xác suất thực nghiệm.
- `generators/chapter5_fractions.js`: 9 dạng bài Phân số, Số thập phân, Tỉ số phần trăm, Bài toán phân số.
- `generators/chapter6_geometry_plane.js`: 6 dạng bài Điểm, Đoạn thẳng, Trung điểm, Tia, Góc, Số đo góc.
- `generators/template_engine.js`: Trình thông dịch template trắc nghiệm động.
- `generators/registry.js`: Bộ điều phối GeneratorRegistry tự động chuyển giao câu hỏi cho từng chương.
- `runner/practice_ui.js`: Trình quản lý giao diện làm bài, nạp câu hỏi, đếm thời gian, chấm điểm tức thì.
- `runner/print_exam.js`: Trình xuất bản đề thi in ấn và phiếu đáp án PDF chuẩn sư phạm.
- `hero.js`: Quản lý cấp độ Chiến binh Toán học (Warrior, Wizard, Archer, Paladin).
- `scripts/build/bundle_math_g6.js`: Tự động đóng gói thành canonical bundle `data/grade_6/math/generator.js`.

### 3. CSS Architecture (`css/`)
Đã phân tách stylesheet 7.124 dòng thành 6 domain stylesheets chuẩn mực:
- `css/tokens.css`: Thiết lập toàn bộ CSS Custom Properties, bảng màu chủ đề, shadows, border-radii.
- `css/base.css`: Reset CSS, typography chuẩn quốc tế, scrollbars tùy biến, keyframes chuyển động.
- `css/layout.css`: Hệ thống Grid phân chia vùng làm việc, sidebar navigation, header status bar.
- `css/game.css`: Giao diện chia đôi màn hình Split-layout của Game Canvas và Tower Defense HUD.
- `css/english.css`: Đấu trường từ vựng tiếng Anh Monster Arena và Flashcard tương tác.
- `css/components.css`: Hệ sinh thái UI components (Buttons, Modals, Badges, Tabs, Form inputs).
- `scripts/build/bundle_css.js`: Tự động đóng gói thành `css/style.css`.

### 4. Database Access Layer (`server/db/`)
- `server/db/schema.ts`: Khởi tạo DDL bảng, index và kích hoạt chế độ `PRAGMA journal_mode=WAL;`.
- `server/db/seed.ts`: Tự động đồng bộ và bảo toàn 3 tài khoản học sinh chuẩn hóa:
  - **Trần Bình Minh** (`std_htsj4gbmo` - Lớp 6)
  - **Trần Bảo Ngọc** (`std_baongoc` - Lớp 1)
  - **Trần Đức Phúc** (`std_tyc0gfnkz` - Lớp 4)
- `server/db/database.ts`: Singleton Connection Pool với timeout 10.000ms, DAO functions Promise-based.

---

## IV. QUALITY GATE VÀ BẢO TOÀN DỮ LIỆU

- **Quality Gate Script**: `scripts/maintenance/check_integrity.js` tự động thẩm định tính toàn vẹn mã nguồn, phân rã module, kiểm tra cú pháp 121 dạng bài Toán và chạy toàn bộ Jest Test Suites.
- **Quy tắc bảo toàn dữ liệu (Rule 10 & 14)**: Dữ liệu môn Toán của Trần Bình Minh và Trần Đức Phúc luôn được lưu trữ riêng rẽ theo `student_id` và tách biệt hoàn toàn với Clean Bundle phát hành.
