# 📋 BỘ PROMPT — GIAI ĐOẠN 3: MỞ RỘNG & TỐI ƯU
## Mục tiêu: Dễ thêm nội dung mới, khởi động nhanh hơn, trải nghiệm tốt hơn
## Tiền đề: Giai đoạn 2 hoàn thành (v13.37)

---

## ═══════════════════════════════════════════════════════════
## TASK 3.1 — TÁCH NGÂN HÀNG ĐỀ THÀNH JSON + PARSER ENGINE
## ═══════════════════════════════════════════════════════════

Bạn là **Data Architect & EdTech Engineer**. Nhiệm vụ: tách `questions-v3.js` (713KB / 9,958 dòng monolithic) thành **JSON data files thuần + 1 parser engine nhỏ gọn**. Sau khi hoàn thành, thêm chuyên đề mới chỉ cần tạo 1 file JSON, không cần chạm vào code.

### Bối cảnh
- **Thư mục:** `f:\KHQS\AntiGravity\HocTap`
- **Phiên bản:** 13.37 → 13.38
- **Vấn đề:** `questions-v3.js` chứa cả **data** (hàng nghìn template câu hỏi) lẫn **logic** (hàm sinh số ngẫu nhiên, shuffle, render KaTeX) trong cùng 1 file

### Kiến trúc Đích

```
data/
├── math/
│   ├── grade6/
│   │   ├── chapter1_integers.json        ← Chương 1: Số nguyên
│   │   ├── chapter2_fractions.json       ← Chương 2: Phân số
│   │   ├── chapter3_geometry.json        ← Chương 3: Hình học
│   │   ├── chapter4_statistics.json      ← Chương 4: Thống kê
│   │   └── chapter5_ratios.json          ← Chương 5: Tỉ số
│   └── grade4/
│       ├── chapter1_numbers.json
│       └── ...
└── english/                              ← Giữ nguyên dataEnglish/ hiện có

js/
├── engine/
│   └── question-engine.js               ← Parser + Generator duy nhất (~300 dòng)
└── questions-v3.js                      ← Giữ lại nhưng chỉ là loader:
                                            require('./engine/question-engine')
                                            + load JSON files tương ứng
```

### Cấu trúc JSON Chuẩn (1 file = 1 chương)

```json
{
  "metadata": {
    "subject": "math",
    "grade": 6,
    "chapter": 1,
    "title": "Số nguyên",
    "totalTemplates": 25
  },
  "templates": [
    {
      "id": "int_001",
      "level": "co-ban",
      "type": "multiple-choice",
      "variables": {
        "a": { "type": "int", "min": -20, "max": -1 },
        "b": { "type": "int", "min": 1, "max": 20 }
      },
      "constraints": ["a !== b"],
      "formulas": {
        "ans": "a + b",
        "w1": "(ans + 3 === a) ? ans + 7 : ans + 3",
        "w2": "(ans - 4 === a || ans - 4 === w1) ? ans - 8 : ans - 4",
        "w3": "Math.abs(a) + b"
      },
      "question": "Tính: $({a}) + {b} = ?$",
      "hint": "Cộng số nguyên âm và số nguyên dương",
      "solution": "$({a}) + {b} = {ans}$",
      "options": ["{ans}", "{w1}", "{w2}", "{w3}"],
      "correctIndex": 0,
      "tags": ["cộng số nguyên", "số nguyên âm"]
    }
  ]
}
```

### Quy trình Thực hiện

**Bước 1 — Viết Question Engine (`js/engine/question-engine.js`):**
Engine có trách nhiệm:
```javascript
const QuestionEngine = {
    // Nạp JSON template
    loadTemplate: function(jsonData) { ... },

    // Sinh 1 câu hỏi từ template (resolve variables, formulas, constraints)
    generateQuestion: function(template) {
        // 1. Sinh random variables theo range
        // 2. Kiểm tra constraints — retry nếu không thỏa
        // 3. Tính formulas (eval an toàn bằng Function constructor)
        // 4. Render question string với variables
        // 5. Shuffle options, track correctIndex mới
        return { questionText, options, correctIndex, hint, solution };
    },

    // Sinh N câu hỏi từ 1 chapter JSON, không trùng template
    generateExam: function(chapterJson, count, level) { ... },

    // Đánh giá answer (dùng lại từ question-generator-worker.js)
    evaluate: function(question, selectedIndex) { ... }
};
```

**Bước 2 — Migrate data từ questions-v3.js sang JSON:**
Đây là bước tốn thời gian nhất. Thực hiện từng chương:
1. Đọc các template trong `questions-v3.js` cho Chương 1
2. Chuyển sang format JSON chuẩn ở trên
3. Lưu vào `data/math/grade6/chapter1_integers.json`
4. Test: `QuestionEngine.generateExam(chapter1Json, 10, 'co-ban')` → trả về 10 câu hỏi hợp lệ
5. Tiếp tục Chương 2, 3, 4, 5

**Bước 3 — Cập nhật `questions-v3.js` thành thin loader:**
```javascript
// questions-v3.js sau refactor (~50 dòng)
(function() {
    'use strict';
    
    // Nạp Question Engine
    // Engine đã được load qua <script src="js/engine/question-engine.js">
    
    // Expose API tương thích ngược (giữ nguyên interface cũ)
    window.questions = {
        getQuestionsForLesson: function(lessonId, level, count) {
            const chapterJson = window.QuestionEngine.getChapter(lessonId);
            return window.QuestionEngine.generateExam(chapterJson, count, level);
        },
        shuffle: window.QuestionEngine.shuffle,
        randomInt: window.QuestionEngine.randomInt
    };
})();
```

**Bước 4 — Cập nhật server.js:**
Serve thư mục `data/` dưới `/data` route:
```javascript
app.use('/data', express.static(path.join(__dirname, 'data')));
```
Client load JSON qua fetch khi cần, không cần load tất cả lên front-end khi khởi động.

**Bước 5 — Thêm vào `student.html`:**
```html
<script src="js/engine/question-engine.js?v=13.38"></script>
<!-- questions-v3.js vẫn giữ để tương thích ngược -->
<script src="js/questions-v3.js?v=13.38"></script>
```

**Bước 6:** `npm test` PASS. Nâng version 13.37 → 13.38, `npm run release`.

### Tiêu chí Hoàn thành
- [ ] `data/math/grade6/` có đủ 5 file JSON cho 5 chương
- [ ] `js/engine/question-engine.js` tồn tại và hoạt động
- [ ] `questions-v3.js` còn < 100 dòng (chỉ là thin loader)
- [ ] Làm thử 1 bài thi Toán lớp 6 trên trình duyệt → câu hỏi hiển thị đúng
- [ ] **Thêm chuyên đề mới** chỉ cần tạo 1 file JSON (không sửa code)
- [ ] Version nâng lên 13.38

---

## ═══════════════════════════════════════════════════════════
## TASK 3.2 — SERVICE WORKER: KHỞI ĐỘNG NHANH HƠN & OFFLINE THỰC SỰ
## ═══════════════════════════════════════════════════════════

Bạn là **Progressive Web App (PWA) Engineer**. Nhiệm vụ: thêm Service Worker để cache toàn bộ assets khi cài lần đầu, từ lần thứ 2 trở đi app khởi động gần như ngay lập tức — không cần chờ Express serve files.

### Bối cảnh
- **Thư mục:** `f:\KHQS\AntiGravity\HocTap`
- **Phiên bản:** 13.38 → 13.39
- **Mục tiêu:** Giảm thời gian tải trang từ ~2-3 giây xuống < 500ms cho lần thứ 2 trở đi

### Quy trình Thực hiện

**Bước 1 — Tạo `sw.js` (Service Worker):**
```javascript
// sw.js — đặt ở root thư mục
const CACHE_NAME = 'hoctap-v13.39';

// Danh sách assets cần cache khi install
const PRECACHE_ASSETS = [
    '/',
    '/student.html',
    '/css/style.css',
    '/js/lib/katex.min.js',
    '/js/lib/sweetalert2.all.min.js',
    '/js/lib/chart.min.js',
    '/js/core/state.js',
    '/js/core/event-bus.js',
    '/js/core/api-client.js',
    '/js/engine/question-engine.js',
    '/js/app.js',
    '/js/game.js',
    '/js/lessons.js',
    '/css/lib/katex.min.css',
    // Fonts, images...
];

// Install: cache tất cả assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate: xóa cache cũ
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys
                .filter(key => key !== CACHE_NAME)
                .map(key => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

// Fetch: Cache First cho static assets, Network First cho API
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // API calls → Network First (luôn lấy dữ liệu mới nhất)
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(event.request)
                .catch(() => new Response(
                    JSON.stringify({ error: 'Offline', offline: true }),
                    { headers: { 'Content-Type': 'application/json' } }
                ))
        );
        return;
    }
    
    // Static assets → Cache First
    event.respondWith(
        caches.match(event.request)
            .then(cached => cached || fetch(event.request))
    );
});
```

**Bước 2 — Đăng ký Service Worker trong `student.html`:**
```html
<!-- Thêm vào <head>, trước các script khác -->
<script>
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('[SW] Registered:', reg.scope))
            .catch(err => console.warn('[SW] Registration failed:', err));
    }
</script>
```

**Bước 3 — Thêm route phục vụ `sw.js` trong `server.js`:**
```javascript
// Service Worker phải được serve từ root với đúng Content-Type
app.get('/sw.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'no-cache'); // SW tự quản lý cache
    res.sendFile(path.join(__dirname, 'sw.js'));
});
```

**Bước 4 — Cơ chế Auto-Update:**
Khi có phiên bản mới (CACHE_NAME thay đổi), Service Worker sẽ tự động xóa cache cũ và tải assets mới. Thêm notification cho user:
```javascript
// Trong student.html, sau đăng ký SW
navigator.serviceWorker.addEventListener('controllerchange', () => {
    console.log('[SW] Đã cập nhật phiên bản mới — tải lại trang...');
    window.location.reload();
});
```

**Bước 5 — Test:**
1. Lần đầu load: mở DevTools → Application → Service Workers → trạng thái "activated"
2. Tắt server Node.js (`Ctrl+C`)
3. Reload trang → app vẫn hiển thị (từ cache)
4. Bật lại server → app hoạt động bình thường với dữ liệu mới

**Bước 6:** `npm test` PASS. Nâng version 13.38 → 13.39, cập nhật `CACHE_NAME`, `npm run release`.

### Tiêu chí Hoàn thành
- [ ] `sw.js` tồn tại ở root và được đăng ký thành công
- [ ] DevTools → Application → Service Workers hiển thị "activated and running"
- [ ] Tắt server → reload trang → UI vẫn hiển thị (static assets từ cache)
- [ ] API calls vẫn hoạt động bình thường khi server online
- [ ] Version nâng lên 13.39

---

## ═══════════════════════════════════════════════════════════
## TASK 3.3 — LAZY LOADING: GIẢM THỜI GIAN KHỞI ĐỘNG BAN ĐẦU
## ═══════════════════════════════════════════════════════════

Bạn là **Frontend Performance Engineer**. Nhiệm vụ: tối ưu thời gian khởi động bằng cách chỉ load những gì cần thiết ngay lúc đầu, các module nặng (game engine, mermaid) load khi người dùng thực sự cần.

### Bối cảnh
- **Thư mục:** `f:\KHQS\AntiGravity\HocTap`
- **Phiên bản:** 13.39 → 13.40
- **Vấn đề:** `student.html` hiện load tất cả script cùng lúc — bao gồm cả `mermaid.min.js` (3.5MB!) dù người dùng có thể không bao giờ dùng AI Advisor

### Assets Cần Lazy Load

| File | Kích thước | Khi nào cần |
|---|---|---|
| `js/lib/mermaid.min.js` | **3.5 MB** | Chỉ khi mở AI Advisor |
| `js/game.js` | 297 KB | Chỉ khi vào Tower Defense game |
| `js/questions-v3.js` | 713 KB | Chỉ khi bắt đầu làm bài |
| `js/english_data.js` | 705 KB | Chỉ khi học Tiếng Anh |
| `js/lib/chart.min.js` | 208 KB | Chỉ khi xem biểu đồ thống kê |

### Quy trình Thực hiện

**Bước 1 — Tạo `js/core/lazy-loader.js`:**
```javascript
// js/core/lazy-loader.js
(function() {
    'use strict';

    const LazyLoader = {
        _loaded: new Set(),

        // Load script động, không block UI
        loadScript: function(src, onLoad) {
            if (this._loaded.has(src)) {
                if (onLoad) onLoad();
                return Promise.resolve();
            }

            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => {
                    this._loaded.add(src);
                    if (onLoad) onLoad();
                    resolve();
                };
                script.onerror = reject;
                document.head.appendChild(script);
            });
        },

        // Load game engine khi cần
        loadGameEngine: function() {
            return this.loadScript('js/game.js?v=13.40');
        },

        // Load mermaid chỉ khi mở AI Advisor
        loadMermaid: function() {
            return this.loadScript('js/lib/mermaid.min.js', () => {
                if (typeof mermaid !== 'undefined') {
                    mermaid.initialize({ startOnLoad: false, theme: 'dark' });
                }
            });
        },

        // Load question bank khi bắt đầu bài thi
        loadQuestionBank: function(subject) {
            const src = subject === 'english'
                ? 'js/english_data.js?v=13.40'
                : 'js/questions-v3.js?v=13.40';
            return this.loadScript(src);
        },

        // Load chart khi xem thống kê
        loadChart: function() {
            return this.loadScript('js/lib/chart.min.js?v=13.40');
        }
    };

    window.LazyLoader = LazyLoader;
})();
```

**Bước 2 — Xóa các `<script>` nặng khỏi `student.html`:**
```html
<!-- XÓA các dòng này khỏi <head>: -->
<!-- <script src="js/lib/mermaid.min.js"></script>  ← 3.5MB -->
<!-- <script src="js/game.js?v=..."></script>        ← 297KB -->
<!-- <script src="js/questions-v3.js?v=..."></script> ← 713KB -->
<!-- <script src="js/english_data.js?v=..."></script> ← 705KB -->
<!-- <script src="js/lib/chart.min.js"></script>     ← 208KB -->

<!-- THÊM lazy loader vào head: -->
<script src="js/core/lazy-loader.js?v=13.40"></script>
```

**Bước 3 — Cập nhật các điểm gọi trong `app.js`:**
```javascript
// Thay vì gọi hàm game trực tiếp:
// startGame() → lỗi vì game.js chưa load

// Đúng cách:
async function enterGameMode() {
    await LazyLoader.loadGameEngine();
    startGame(); // Bây giờ mới gọi
}

// Khi mở AI Advisor:
async function openAIAdvisor() {
    await LazyLoader.loadMermaid();
    renderAIResponse();
}

// Khi bắt đầu làm bài Toán:
async function startMathExam(lessonId) {
    await LazyLoader.loadQuestionBank('math');
    loadQuestions(lessonId);
}
```

**Bước 4 — Thêm Loading Indicator:**
```javascript
// Hiển thị spinner trong lúc lazy load
async function loadWithIndicator(loadFn, onComplete) {
    const spinner = document.getElementById('global-loading-spinner');
    if (spinner) spinner.style.display = 'flex';
    try {
        await loadFn();
        onComplete();
    } finally {
        if (spinner) spinner.style.display = 'none';
    }
}
```

**Bước 5 — Đo hiệu năng trước/sau:**
Dùng DevTools → Network → Disable cache → đo thời gian DOMContentLoaded:
- **Trước:** ~X ms (tải ~5MB scripts)
- **Sau:** ~Y ms (chỉ tải ~1-2MB scripts thiết yếu)

Báo cáo số liệu này trong commit message.

**Bước 6:** `npm test` PASS. Nâng version 13.39 → 13.40, `npm run release`.

### Tiêu chí Hoàn thành
- [ ] `mermaid.min.js` KHÔNG còn trong `<head>` của `student.html`
- [ ] Mở AI Advisor → mermaid load đúng lúc, diagrams hiển thị bình thường
- [ ] Vào game → `game.js` load đúng lúc, game chạy bình thường
- [ ] Thời gian khởi động ban đầu giảm ít nhất **40%** so với trước
- [ ] `npm test` PASS
- [ ] Version nâng lên 13.40

---

## ═══════════════════════════════════════════════════════════
## TASK 3.4 — ACCESSIBILITY: CHUẨN HÓA CHO HỌC SINH TIỂU HỌC
## ═══════════════════════════════════════════════════════════

Bạn là **Accessibility Engineer** chuyên về EdTech cho trẻ em. Nhiệm vụ: đảm bảo ứng dụng HocTap đạt chuẩn WCAG 2.1 AA cơ bản — đặc biệt quan trọng vì người dùng là **học sinh từ Lớp 1 đến Lớp 6**.

### Bối cảnh
- **Thư mục:** `f:\KHQS\AntiGravity\HocTap`
- **Phiên bản:** 13.40 → 13.41
- **Người dùng:** Trẻ em 6-12 tuổi → cần font lớn, tương phản cao, bắt phím dễ

### Checklist A11y Cần Thực Hiện

**Bước 1 — Kiểm tra và sửa tương phản màu (Color Contrast):**
Dùng DevTools → Accessibility → Color Contrast để kiểm tra:
- Text chính trên nền tối: tỷ lệ tương phản ≥ 4.5:1
- Text lớn (heading): tỷ lệ tương phản ≥ 3:1
- Các nút bấm: text trên nền ≥ 4.5:1
Sửa các màu không đạt trong `css/style.css`.

**Bước 2 — Thêm `aria-label` cho các nút icon:**
```html
<!-- Trước: -->
<button class="close-btn"><i class="fa fa-times"></i></button>

<!-- Sau: -->
<button class="close-btn" aria-label="Đóng">
    <i class="fa fa-times" aria-hidden="true"></i>
</button>
```
Grep toàn bộ `student.html` tìm các `<button>` và `<a>` không có text rõ ràng → thêm `aria-label`.

**Bước 3 — Đảm bảo keyboard navigation:**
Tất cả interactive elements phải focus được bằng Tab:
```css
/* css/style.css — thêm focus styles rõ ràng */
:focus-visible {
    outline: 3px solid #fbbf24;
    outline-offset: 2px;
    border-radius: 4px;
}
```

**Bước 4 — Font size tối thiểu:**
```css
/* Đảm bảo không có text nhỏ hơn 14px trên toàn app */
body { font-size: 16px; } /* Base */
.small-text { font-size: 0.875rem; } /* = 14px */
/* Kiểm tra không có px < 14 trong style.css */
```

**Bước 5 — Alt text cho ảnh:**
Grep `student.html` tìm `<img>` không có `alt` attribute → thêm đầy đủ:
```html
<img src="images/chibi.png" alt="Nhân vật chibi học sinh">
```

**Bước 6 — ARIA roles cho các màn hình:**
```html
<!-- Màn hình quiz -->
<div id="quiz-container" role="main" aria-label="Màn hình làm bài thi">
    <div role="radiogroup" aria-label="Chọn đáp án">
        <button role="radio" aria-checked="false">A. ...</button>
    </div>
</div>
```

**Bước 7 — Kiểm tra cuối:**
Dùng Chrome DevTools → Lighthouse → Accessibility → Chạy audit
Mục tiêu: điểm Accessibility ≥ **85/100**

**Bước 8:** `npm test` PASS. Nâng version 13.40 → 13.41, `npm run release`.

### Tiêu chí Hoàn thành
- [ ] Lighthouse Accessibility score ≥ 85/100
- [ ] Tất cả `<button>` icon có `aria-label`
- [ ] `:focus-visible` styles hiển thị rõ ràng
- [ ] Không có text < 14px
- [ ] Tất cả `<img>` có `alt` attribute
- [ ] Version nâng lên 13.41

---

## 📌 BẢNG THEO DÕI GIAI ĐOẠN 3

| Task | Mô tả | Phiên bản | Lợi ích chính |
|---|---|---|---|
| **3.1** | JSON Question Bank + Parser Engine | 13.37 → 13.38 | Thêm câu hỏi mới = tạo 1 file JSON |
| **3.2** | Service Worker / Offline Cache | 13.38 → 13.39 | Load lần 2 < 500ms, offline thực sự |
| **3.3** | Lazy Loading scripts nặng | 13.39 → 13.40 | Khởi động nhanh hơn 40% |
| **3.4** | Accessibility (WCAG 2.1 AA cơ bản) | 13.40 → 13.41 | Chuẩn giáo dục, trẻ em dùng dễ hơn |

> **Sau Giai đoạn 3:** HocTap v13.41 — kiến trúc hoàn chỉnh, hiệu năng cao, dễ mở rộng nội dung.
> Điểm kiến trúc dự kiến: **91/100 → 96/100** — đạt chuẩn EdTech quốc tế thực sự.
