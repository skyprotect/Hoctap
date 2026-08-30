# KIẾN TRÚC FRONTEND MODULAR VANILLA JAVASCRIPT (M07 ARCHITECTURE)

Tài liệu này mô tả chi tiết kiến trúc sau khi tái cấu trúc tệp `js/app.js` (từ Monolith 13.971 dòng thành Modular Architecture).

---

## 1. Sơ đồ Kiến trúc Tổng thể (Overall Architecture)

```
[ HTML / DOM Event Handlers: onclick="app.*" ]
                     │
                     ▼
       ┌─────────────────────────────┐
       │   js/app.js (Façade Core)   │
       │   window.app === AppState   │
       └──────────────┬──────────────┘
                      │
       ┌──────────────┴──────────────┐
       │                             │
       ▼                             ▼
┌─────────────────────────┐   ┌─────────────────────────┐
│       js/modules/       │   │       js/features/      │
│  - splash.module.js     │   │  - audio-service.js     │
│  - student-select.module│   │  - speech-service.js    │
│  - curriculum.module.js │   │  - katex-service.js     │
│  - quiz-runner.module.js│   │  - scratchpad-service.js│
│  - vocab-monster.module │   │  - srs-service.js       │
│  - skill-card.module.js │   │  - gamification-service │
│  - leaderboard.module.js│   │  - chibi-controller.js  │
│  - chat.module.js       │   │  - ui-renderer.js       │
│  - parent-dashboard.js  │   │  - quiz-manager.js      │
└──────────────┬──────────┘   └────────────┬────────────┘
               │                           │
               └──────────────┬────────────┘
                              │
                              ▼
               ┌─────────────────────────────┐
               │          js/core/           │
               │  - storage.js               │
               │  - event-bus.js             │
               │  - state.js                 │
               │  - api-client.js            │
               │  - navigation.js            │
               │  - lazy-loader.js           │
               └─────────────────────────────┘
```

---

## 2. Phân định Trách nhiệm (Separation of Concerns)

### A. Tầng Cốt lõi (Core Infrastructure - `js/core/`)
- `storage.js`: Cung cấp `safeStorage` truy cập `localStorage` với bộ nhớ dự phòng trong RAM (In-Memory Fallback), ngăn ngừa crash khi chạy trong WebView/Iframe bị chặn storage.
- `state.js`: Quản lý `AppState` tập trung, đảm bảo cách ly dữ liệu học sinh (Trần Bình Minh, Trần Đức Phúc, Trần Bảo Ngọc) và môn học (Toán vs Tiếng Anh).
- `event-bus.js`: Đóng vai trò Custom Event Emitter (`on`, `off`, `emit`) giúp các module giao tiếp phi đồng bộ không tạo chu trình phụ thuộc (No Circular Dependency).
- `api-client.js`: Lớp HTTP Client duy nhất gọi Backend REST API, tự động gắn JWT Admin token và xử lý lỗi mạng.
- `navigation.js`: Quản lý ngăn xếp điều hướng (`navHistory`), chuyển màn hình SPA (`showScreen`), phím tắt toàn cục và chế độ toàn màn hình.

### B. Tầng Dịch vụ Chuyên biệt (Feature Services - `js/features/`)
- `audio-service.js`: Bộ phát âm thanh Web Audio API Synthesizer (tần số sóng) + File nhạc `.mp3`, hiệu ứng mờ dần âm lượng (Fade Volume).
- `speech-service.js`: Nhận diện giọng nói (SpeechRecognition) & Đọc văn bản (SpeechSynthesis) cho môn Tiếng Anh.
- `katex-service.js`: Render công thức toán học KaTeX, kiểm soát an toàn dấu `$`.
- `scratchpad-service.js`: Bảng vẽ nháp viết tay cảm ứng trong phòng thi Toán.
- `srs-service.js`: Thuật toán lặp lại ngắt quãng Leitner 5 hộp cho từ vựng.
- `gamification-service.js`: Quản lý điểm thưởng (XP), Chuỗi học tập (Streak), 50 Thẻ Năng Lực & 30 Huy Hiệu.

### C. Tầng Nghiệp vụ Chức năng (Feature Modules - `js/modules/`)
- `splash.module.js`: Màn hình Chào mừng, đồng hồ số thời gian thực, câu châm ngôn ngẫu nhiên.
- `student-select.module.js`: Chuyển đổi học sinh và màn hình thiết lập ban đầu.
- `curriculum.module.js`: Cây danh mục bài học Toán/Tiếng Anh theo học kỳ, trình xem lý thuyết và nhúng video.
- `quiz-runner.module.js`: Trình làm bài trắc nghiệm Toán & Tiếng Anh 4 kỹ năng, phòng thi tập trung IOE, đồng hồ đếm ngược.
- `vocab-monster.module.js`: Game chiến đấu quái vật từ vựng tiếng Anh.
- `skill-card.module.js`: Lưới 50 thẻ năng lực, đổi thưởng giờ chơi PC/Tablet.
- `leaderboard.module.js`: Bảng xếp hạng và thanh trạng thái trực tuyến.
- `chat.module.js`: Nhắn tin thời gian thực giữa Phụ huynh và Học sinh.
- `parent-dashboard.module.js`: Báo cáo đánh giá năng lực học sinh và phân tích AI.

### D. Tầng Façade (Compatibility Bridge - `js/app.js`)
- Đóng vai trò **Adapter / Façade**:
  - Gán `window.app` và đồng bộ `window.AppState`.
  - Giữ nguyên toàn bộ 251 legacy methods/properties để đảm bảo 100% các thẻ HTML `onclick="app.*"` hoạt động ổn định.
  - Điều phối vòng đời ứng dụng (`init()`, `DOMContentLoaded`, đồng bộ mạng).

---

## 3. Vòng đời & Dọn dẹp Tài nguyên (Lifecycle & Resource Cleanup)
- Khi chuyển đổi màn hình (`NavigationService.showScreen`), các timer thi (`examTimer`), nhận diện giọng nói (`SpeechRecognition`), âm thanh BGM fade và animation frames đều được dọn dẹp sạch sẽ để tránh rò rỉ bộ nhớ (Memory Leak).
