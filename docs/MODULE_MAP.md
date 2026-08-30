# HỌCTẬP SYSTEM — BẢN ĐỒ MODULE HỆ THỐNG (MODULE MAP)

> **Phiên bản:** v13.39  
> **Cập nhật:** 30/08/2026 16:47

---

## 1. Domain: Game Engine (`js/game/`)

| Đường dẫn Module | Chức năng chính | Quy mô (LOC) |
|---|---|---|
| `core/math-utils.js` | Vector toán học, khoảng cách, va chạm hình tròn & đoạn thẳng | ~45 |
| `core/game-config.js` | Cấu hình 4 chủ đề (Rừng rậm, Băng tuyết, Dung nham, Hư không), tháp & quái | ~120 |
| `core/game-assets.js` | Quản lý nạp Assets & Web Worker xóa phông ảnh quái vật | ~75 |
| `core/game-engine.js` | Vòng lặp GameLoop 60FPS với Fixed Timestep, Engine State | ~150 |
| `systems/grid-system.js` | Ma trận lưới, kiểm tra ô hợp lệ, tạo đa nhánh đường đi | ~130 |
| `entities/hero.js` | Chỉ số RPG Hero, hệ số nhân sức mạnh, bộ chọn tướng | ~90 |
| `systems/wave-system.js` | Bộ sinh quái vật theo đợt liên kết với kết quả trả lời câu hỏi | ~110 |
| `systems/combat-system.js` | Đạn đạo, va chạm, tính sát thương, hiệu ứng cháy/băng, thưởng | ~180 |
| `systems/skills-system.js` | Kỹ năng chủ động: Mưa sao băng, Bão tuyết tuyệt đối, Khiên thần thánh | ~140 |
| `rendering/monster-renderer.js` | Vẽ Vector Chibi monsters đa tầng động lực học | ~220 |
| `rendering/tower-renderer.js` | Vẽ tháp phòng thủ 3D đa hướng và cấp độ tiến hóa | ~260 |
| `rendering/map-renderer.js` | Vẽ bản đồ 3D, đường đá lát, lâu đài phòng thủ và cổng ma thuật | ~210 |
| `rendering/effects-renderer.js` | Hệ thống hạt hiệu ứng hạt (Particles), hiệu ứng thời tiết, rơi kim cương | ~190 |
| `ui/game-ui.js` | Bảng điều khiển HUD, nút đặt/nâng cấp/bán tháp, thanh máu lâu đài | ~280 |
| `index.js` | Façade Master tích hợp nạp an toàn trình duyệt và Node.js | ~160 |
| **`js/game.js` (Canonical)** | **Tập tin đóng gói runtime tự động từ 14 submodules trên** | **~6.400** |

---

## 2. Domain: Math Generator Lớp 6 (`data/grade_6/math/`)

| Đường dẫn Module | Chức năng chính | Quy mô (LOC) |
|---|---|---|
| `generators/chapter1_naturals.js` | 14 dạng bài Số tự nhiên, Tập hợp, Ước & Bội, BCNN, ƯCLN, Thừa số NT | ~1.900 |
| `generators/chapter2_integers.js` | 5 dạng bài Số nguyên, Quy tắc dấu ngoặc, Phép tính số nguyên | ~850 |
| `generators/chapter3_geometry.js` | 5 dạng bài Hình học trực quan (Tam giác đều, Hình vuông, Lục giác đều, Thoi, Bình hành) | ~600 |
| `generators/chapter4_statistics.js` | 6 dạng bài Thống kê, Bảng số liệu, Biểu đồ tranh, Cột kép, Xác suất | ~850 |
| `generators/chapter5_fractions.js` | 9 dạng bài Phân số, Số thập phân, Tỉ số phần trăm, Bài toán phân số | ~1.150 |
| `generators/chapter6_geometry_plane.js` | 6 dạng bài Điểm, Đoạn thẳng, Trung điểm, Tia, Góc, Số đo góc | ~660 |
| `generators/template_engine.js` | Trình thông dịch template trắc nghiệm động | ~390 |
| `generators/registry.js` | Bộ điều phối GeneratorRegistry tự động chuyển giao câu hỏi cho từng chương | ~90 |
| `runner/practice_ui.js` | Trình quản lý giao diện làm bài, nạp câu hỏi, đếm thời gian, chấm điểm tức thì | ~1.800 |
| `runner/print_exam.js` | Trình xuất bản đề thi in ấn và phiếu đáp án PDF chuẩn sư phạm | ~700 |
| `hero.js` | Quản lý cấp độ Chiến binh Toán học (Warrior, Wizard, Archer, Paladin) | ~120 |
| **`data/grade_6/math/generator.js`** | **Tập tin đóng gói runtime tự động từ 11 submodules trên** | **~9.330** |

---

## 3. Domain: CSS Architecture (`css/`)

| Tập tin CSS | Mục đích & Nội dung |
|---|---|
| `css/tokens.css` | Biến CSS Custom Properties, màu sắc, font, shadow, border-radius |
| `css/base.css` | Reset CSS, typography, scrollbars tùy biến, keyframes chuyển động |
| `css/layout.css` | Grid phân chia vùng làm việc, sidebar navigation, header status bar |
| `css/game.css` | Giao diện chia đôi màn hình Split-layout của Game Canvas & HUD |
| `css/english.css` | Đấu trường từ vựng tiếng Anh Monster Arena và Flashcard tương tác |
| `css/components.css` | Hệ sinh thái UI components (Buttons, Modals, Badges, Tabs, Form inputs) |
| **`css/style.css` (Canonical)** | **Tập tin đóng gói stylesheet tổng hợp toàn hệ thống** |

---

## 4. Domain: Server & Database Layer (`server/`)

| Đường dẫn Module | Trách nhiệm |
|---|---|
| `server/db/schema.ts` | Khởi tạo bảng, index, cấu hình SQLite WAL mode |
| `server/db/seed.ts` | Seed 3 học sinh chuẩn (Bình Minh, Bảo Ngọc, Đức Phúc) |
| `server/db/database.ts` | Singleton Connection Pool, query helpers, DAO API |
| `server/services/ai/gemini-client.ts` | Tích hợp AI Gemini đa khóa (Failover Multi-Key) |
| `server/services/auth/` | Xác thực phụ huynh và phân quyền học sinh |
| `server/routes/` | API routes: auth, progress, questions, system |
| `server/app.ts` | Express application & middleware cấu hình |
