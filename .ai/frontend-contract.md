# FRONTEND CONTRACT FREEZE: PUBLIC & EXTERNAL CONTRACTS

> **DỰ ÁN:** HocTap - Hệ thống Học tập & Thi trắc nghiệm AI (Toán & Tiếng Anh)  
> **PHIÊN BẢN ĐÓNG BĂNG:** v13.56  
> **NGÀY LẬP:** 31/08/2026  
> **TRẠNG THÁI:** CONTRACT FREEZE (CHỈ ĐỌC / BẢO VỆ NGUYÊN TRẠNG - TUYỆT ĐỐI KHÔNG TỰ Ý PHÁ VỠ)

---

## 1. TỔNG QUAN HỆ THỐNG VÀ ENTRY POINTS

Hệ thống frontend của HocTap hoạt động theo mô hình **Local-First Single Page Application (SPA)** kết hợp **PWA Service Worker** và **Web Workers**. Toàn bộ mã nguồn giao diện tương tác dựa trên JavaScript thuần (Vanilla JS), mô hình đối tượng toàn cục (`window.*`), quản trị sự kiện DOM trực tiếp và hệ thống template câu hỏi chạy ngầm.

### A. Danh mục Entry Points

| Entry Point | Kiểu | Trách nhiệm chính | Service Worker / Worker liên quan |
| :--- | :--- | :--- | :--- |
| `student.html` | HTML SPA | Giao diện chính của học sinh: Splash, Chọn học sinh, Dashboard môn học, Luyện tập, Thi trắc nghiệm, Thẻ kỹ năng, Game Tower Defense, Cố vấn AI | Đăng ký `sw.js`; Khởi tạo `js/question-generator-worker.js` & `js/remove-bg-worker.js` |
| `parent.html` | HTML SPA | Bảng điều khiển phụ huynh tại chỗ: Xác thực mã PIN, Xem tiến độ học tập, Báo cáo AI, Quản lý từ vựng/chủ đề, Cấu hình API key, Kiosk mode | Không đăng ký SW trực tiếp; Gọi các API `/api/*` |
| `parent_remote.html`| HTML SPA | Bảng điều khiển phụ huynh từ xa qua mạng Internet: Đồng bộ trạng thái học tập thời gian thực qua Firebase Realtime Database | Sử dụng Firebase SDK compat v8.10.1 |
| `sw.js` | Service Worker| Quản lý bộ nhớ đệm PWA theo chiến lược **Network-First**, tự động fallback về Cache khi mất kết nối mạng (Offline) | Phục vụ offline cho `student.html`, `parent.html`, `css/style.css`, `js/app.js` |
| `js/question-generator-worker.js` | Web Worker | Sinh câu hỏi trắc nghiệm Toán lớp 6 từ template ngầm đa luồng để giải phóng main thread | Giao tiếp qua `postMessage` với `js/questions-v3.js` |
| `js/remove-bg-worker.js` | Web Worker | Tẩy nền ảnh avatar/chibi học sinh bằng thuật toán BFS Flood Fill trên Canvas | Giao tiếp qua `postMessage` với `js/app.js` |

---

### B. Thứ tự nạp Script (Script Execution Sequence)

#### 1. Tại `student.html` (Thứ tự thực thi nghiêm ngặt):
1. **Inline Pre-check (Lines 5–90):** Kiểm tra tương thích trình duyệt (ES6+, optional chaining), bẫy lỗi toàn cục `window.onerror`, định nghĩa hàm `forceSuperRefresh()`.
2. `https://accounts.google.com/gsi/client` (`async defer`): Google Identity Services SDK.
3. `js/lib/sweetalert2.all.min.js`: Thư viện thông báo Modal & Dialogs.
4. `js/lib/katex.min.js`: Thư viện kết xuất công thức toán học LaTeX.
5. `js/lib/auto-render.min.js` (kèm hook `onload`): Tự động render KaTeX toàn trang (`renderMathInElement`).
6. `js/lib/chart.min.js`: Thư viện vẽ biểu đồ tiến độ & đánh giá học sinh.
7. `js/lib/mermaid.min.js`: Thư viện vẽ sơ đồ tư duy cho Cố vấn AI.
8. `js/lib/marked.min.js`: Thư viện phân giải Markdown cho AI Chat.
9. `https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js`: Firebase App Core.
10. `https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js`: Firebase Auth.
11. `https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js`: Firebase Firestore.
12. `js/english_data.js?v=...`: Dữ liệu bài học, từ vựng, ngữ pháp và hàm sinh đề Tiếng Anh.
13. `js/lessons.js?v=...`: Mục lục chương trình Toán Lớp 6, danh mục video bài giảng, chủ đề con.
14. `js/questions-v1.js?v=...`: Ngân hàng câu hỏi Toán Lớp 1 (`questionsL1`).
15. `js/questions-v4.js?v=...`: Ngân hàng câu hỏi Toán Lớp 4 (`questionsL4`).
16. `js/questions-v3.js?v=...`: Bộ sinh đề Toán Lớp 6 (`questions`), template engine, KaTeX evaluator, UI thi/luyện tập.
17. `js/questions-advanced.js?v=...`: Ngân hàng đề thi nâng cao (`questionsAdvanced`).
18. `js/questions-7991.js?v=...`: Ngân hàng đề thi 7991 (`questions7991`).
19. `js/game.js?v=...`: Động cơ trò chơi Tower Defense (`game`).
20. `js/app.js?v=...`: Bộ điều phối toàn cục (`app`), khởi tạo vòng đời `app.init()` khi `DOMContentLoaded` / `window.onload`.

#### 2. Tại `parent.html`:
1. `js/lib/tailwind.min.js`
2. `js/lib/sweetalert2.all.min.js`
3. `js/lib/katex.min.js` (`defer`)
4. `js/lib/auto-render.min.js` (`defer`)
5. `js/lib/chart.min.js`
6. `js/lib/mermaid.min.js`
7. `js/lib/marked.min.js`
8. `js/lessons.js?v=...`
9. `js/parent.js?v=...` (Chạy `parentDashboard.init()` khi DOM sẵn sàng).

#### 3. Tại `parent_remote.html`:
1. `https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js`
2. `https://www.gstatic.com/firebasejs/8.10.1/firebase-database.js`
3. Script nội tuyến chứa `remoteApp` kết nối Realtime Database.

---

## 2. GLOBAL CONTRACTS (`window.*` & BIẾN TOÀN CỤC)

Bảng phân loại 22 đối tượng toàn cục được đăng ký trên `window` hoặc phạm vi root:

| Tên biến / Thuộc tính | Khai báo tại | Truy cập bởi | Vai trò / Hợp đồng dữ liệu |
| :--- | :--- | :--- | :--- |
| `window.app` (`app`) | `js/app.js` | `student.html`, `js/game.js`, `js/questions-v3.js`, `js/parent.js`, `js/english_data.js` | Trọng tâm điều khiển của toàn bộ Client Học sinh. Chứa `state`, `config`, các hàm UI, audio, quiz runner, sync. |
| `window.game` (`game`) | `js/game.js` | `student.html`, `js/app.js`, `js/questions-v3.js` | Động cơ Game Tower Defense. Quản lý canvas, waves, hero, tower, monster, combat loop. |
| `window.parentDashboard` | `js/parent.js` | `parent.html`, `js/app.js` | Quản trị viên Bảng điều khiển phụ huynh: Auth PIN, nạp tiến độ, vẽ biểu đồ, quản lý học sinh. |
| `window.questions` (`questions`) | `js/questions-v3.js` | `student.html`, `js/app.js`, `js/game.js`, `js/lessons.js`, `js/english_data.js` | Bộ máy sinh câu hỏi Toán 6, giải toán KaTeX, khởi chạy màn hình bài tập/thi thử. |
| `window.COURSE_DATA` | `js/lessons.js` | `js/app.js`, `js/parent.js`, `js/questions-v3.js` | Cấu trúc phân cấp Chương -> Bài -> Chủ đề con của môn Toán Lớp 6. |
| `window.ENGLISH_COURSE_DATA` | `js/english_data.js` | `js/app.js`, `js/lessons.js` | Cấu trúc phân cấp Unit -> Lesson -> Topic môn Tiếng Anh Lớp 1, 4, 6. |
| `window.SYSTEM_SUBJECTS` | `js/lessons.js` | `js/app.js` | Danh mục môn học hệ thống (`math`, `english`). |
| `window.SUBTOPIC_VIDEOS` | `js/lessons.js` | `js/lessons.js`, `js/app.js` | Danh sách link video bài giảng YouTube theo mã bài học. |
| `window.questionsL1` | `js/questions-v1.js` | `js/questions-v3.js` | Danh sách template câu hỏi Toán Lớp 1. |
| `window.questionsL4` | `js/questions-v4.js` | `js/questions-v3.js` | Danh sách template câu hỏi Toán Lớp 4. |
| `window.questionsAdvanced` | `js/questions-advanced.js` | `js/questions-7991.js`, `js/questions-v3.js` | Đề thi Toán nâng cao. |
| `window.questions7991` | `js/questions-7991.js` | `student.html`, `js/questions-v3.js` | Bộ 100 câu hỏi ôn tập 7991. |
| `window.SKILL_CARDS` | `js/app.js` | `js/app.js` | Cấu hình 12 thẻ kỹ năng trò chơi (Chém đôi, Đóng băng, Hồi máu, ...). |
| `window.firebaseApp` | `js/app.js` | `js/app.js` | Instance Firebase đã khởi tạo. |
| `window.getLessonById` | `js/lessons.js` | `parent.html`, `js/app.js`, `js/questions-v3.js` | Hàm tra cứu thông tin bài học theo ID. |
| `window.getWordEmoji` | `js/english_data.js` | `js/app.js` | Tra cứu emoji minh họa từ vựng Tiếng Anh. |
| `window.generateEnglishQuestions` | `js/english_data.js`| `js/app.js` | Sinh danh sách câu hỏi Tiếng Anh theo Unit / Lesson. |
| `window.generateEnglishFullExam` | `js/english_data.js`| `js/app.js` | Sinh đề thi tổng hợp Tiếng Anh. |
| `window.generateIoeQuestions` | `js/english_data.js`| `js/app.js` | Sinh đề thi Olympic Tiếng Anh (IOE). |
| `window.selectTdHeroInGame` | `js/game.js` | `js/game.js`, `student.html` | Chọn tướng Tower Defense. |
| `window.selectTdHero` | `js/questions-v3.js`| `student.html` | Mở modal chọn tướng từ giao diện học sinh. |
| `window.getApiUrl` | `parent.html`, `js/parent.js` | `js/app.js`, `js/parent.js`, `js/questions-v3.js` | Trợ thủ sinh đường dẫn API tự động tương thích cổng máy chủ. |
| `window.sanitizeHtml` | `parent.html`, `js/app.js` | `parent.html`, `js/app.js` | Làm sạch chuỗi HTML chống tấn công XSS. |
| `window.safeStorage` | `js/app.js` | `js/app.js` | Wrapper an toàn truy xuất `localStorage` chống lỗi QuotaExceeded / Private browsing. |

---

## 3. PUBLIC FUNCTIONS & INTERFACES

### A. Đối tượng `window.app` (`js/app.js` - 242 Methods)

```typescript
interface AppContract {
    // 1. Khởi tạo & Vòng đời
    init(): Promise<void>;
    loadConfig(): Promise<void>;
    checkGoogleAuthSession(): Promise<boolean>;
    detectServerPort(): Promise<number>;
    
    // 2. Chuyển đổi màn hình (Navigation & Viewports)
    showScreen(screenId: string): void;
    selectStudent(studentId: string): Promise<void>;
    switchStudent(): void;
    showSubjectSelect(): void;
    selectSubject(subject: 'math' | 'english'): void;
    selectGrade(grade: number): void;
    goBackHierarchy(): void;
    
    // 3. Thi trắc nghiệm & Luyện tập (Quiz Runner)
    startPractice(lessonId: string, level?: string): Promise<void>;
    startExam(examType: string, options?: object): Promise<void>;
    submitAnswer(choiceIndex: number): void;
    nextQuestion(): void;
    finishQuiz(): Promise<void>;
    renderCurrentQuestion(): void;
    
    // 4. Âm thanh & Giọng đọc (Audio & Speech Synthesis)
    playSound(soundName: 'correct' | 'wrong' | 'click' | 'clapping' | 'failed' | 'monter' | 'sword hit' | 'magic spell' | 'startup'): void;
    speakText(text: string, lang?: 'vi-VN' | 'en-US'): void;
    stopSpeech(): void;
    
    // 5. Game Tower Defense Integration
    launchFreePlayGame(): void;
    exitFreePlayGame(): void;
    addGameEnergy(points: number): void;
    
    // 6. Cố vấn AI (Floating Chat & AI Mentor)
    toggleFloatingChat(): void;
    sendChatMessage(): Promise<void>;
    clearChatHistory(): void;
    
    // 7. Đồng bộ & Lưu trữ (Data Sync & Persistence)
    saveProgress(): Promise<boolean>;
    loadProgress(): Promise<boolean>;
    syncWithCloud(): Promise<void>;
    
    // 8. Báo cáo & Phụ huynh
    openParentSettings(): void;
    closeParentSettings(): void;
    openEvaluationModal(): void;
    closeEvaluationModal(): void;
}
```

### B. Đối tượng `window.questions` (`js/questions-v3.js` - 65 Methods)

```typescript
interface QuestionsContract {
    // 1. Công cụ Toán học (Math Helpers)
    gcd(a: number, b: number): number;
    lcm(a: number, b: number): number;
    factorize(n: number): string;
    isPrime(n: number): boolean;
    getPrimeFactors(n: number): number[];
    getDivisors(n: number): number[];
    evalExpression(expr: string, vars: Record<string, any>): any;
    safeEval(expr: string): any;
    
    // 2. Bộ sinh câu hỏi & Template Engine
    generateQuestionFromTemplate(template: QuestionTemplate, maxAttempts?: number): GeneratedQuestion;
    generateExam(topicId: string, count: number): GeneratedQuestion[];
    
    // 3. Khởi chạy giao diện bài tập / bài thi
    startPracticeWithLevel(lessonId: string, level: string): void;
    startSubtopicPractice(subtopicId: string): void;
    startWeaknessPracticeSubtopic(subtopicId: string): void;
    startExamWithLevel(level: string): void;
    initPractice(questionsList: GeneratedQuestion[]): void;
    
    // 4. In ấn & Trợ giúp AI
    printExamToPdf(examData: object): Promise<void>;
    troubleshootQuestionWithAi(questionData: object): Promise<string>;
}
```

### C. Đối tượng `window.game` (`js/game.js` - 51 Methods)

```typescript
interface GameEngineContract {
    init(): void;
    start(): void;
    pause(): void;
    resume(): void;
    restart(): void;
    spawnMonster(type: string): void;
    placeTower(x: number, y: number, towerType: string): boolean;
    upgradeTower(towerId: string): void;
    sellTower(towerId: string): void;
    useSkill(skillId: string): void;
    update(deltaTime: number): void;
    render(ctx: CanvasRenderingContext2D): void;
}
```

### D. Đối tượng `window.parentDashboard` (`js/parent.js` - 59 Methods)

```typescript
interface ParentDashboardContract {
    init(): Promise<void>;
    loginWithPin(pin: string): Promise<boolean>;
    logout(): void;
    loadStudentStats(studentId: string): Promise<void>;
    renderProgressCharts(statsData: object): void;
    saveStudentConfig(config: object): Promise<boolean>;
    manageCustomTopics(): void;
    manageCustomVocabulary(): void;
    testApiKeys(keys: object): Promise<boolean>;
    saveApiKeys(keys: object): Promise<boolean>;
    exitKioskMode(): Promise<void>;
}
```

---

## 4. DOM CONTRACTS (GIAO DIỆN & PHẦN TỬ BẮT BUỘC)

Hệ thống quản lý 374 ID phần tử DOM tĩnh trong các file HTML và 352 ID được truy xuất trực tiếp qua `document.getElementById` hoặc `querySelector`.

### A. Các ID Trọng yếu Bắt buộc Tồn tại (Critical DOM IDs)

| DOM ID | Thuộc file HTML | Truy xuất bởi | Hậu quả nếu thiếu / đổi tên |
| :--- | :--- | :--- | :--- |
| `splash-screen` | `student.html` | `js/app.js` | Giao diện bị kẹt ở Splash, không vào được ứng dụng. |
| `student-select-screen`| `student.html` | `js/app.js` | Không thể chọn học sinh Trần Bình Minh / Trần Đức Phúc / Trần Bảo Ngọc. |
| `main-dashboard-screen`| `student.html` | `js/app.js` | Không thể hiển thị màn hình chính Dashboard môn học. |
| `quiz-practice-screen` | `student.html` | `js/app.js`, `js/questions-v3.js`| Vỡ hoàn toàn chế độ làm bài tập và thi trắc nghiệm. |
| `td-game-container` | `student.html` | `js/game.js`, `js/app.js` | Vỡ Canvas trò chơi Tower Defense. |
| `free-play-overlay` | `student.html` | `js/app.js` | Không thể mở chế độ chơi game tự do. |
| `floating-chat-window` | `student.html` | `js/app.js` | Vỡ giao diện trò chuyện Cố vấn AI. |
| `evaluation-modal` | `student.html` | `js/app.js` | Không mở được Báo cáo đánh giá năng lực học sinh. |
| `setup-initial-screen` | `student.html` | `js/app.js` | Màn hình khởi tạo thông tin lần đầu bị hỏng. |
| `parent-login-modal` | `parent.html` | `js/parent.js` | Phụ huynh không đăng nhập được bằng mã PIN. |
| `progressChart` | `parent.html`, `student.html` | `js/parent.js`, `js/app.js` | Lỗi khởi tạo đối tượng `Chart.js`, crash giao diện thống kê. |

---

## 5. STATE CONTRACTS (CẤU TRÚC DỮ LIỆU & QUẢN TRỊ TRẠNG THÁI)

### A. Trạng thái `window.app.state` (`js/app.js`)

```javascript
app.state = {
    currentStudentId: 'std_htsj4gbmo', // 'std_htsj4gbmo' (Bình Minh) | 'std_tyc0gfnkz' (Đức Phúc) | 'std_baongoc' (Bảo Ngọc)
    currentSubject: 'math',           // 'math' | 'english'
    currentGrade: 6,                  // 1 | 4 | 6
    currentScreen: 'splash-screen',   // Màn hình đang kích hoạt
    navigationHistory: [],            // Ngăn xếp lịch sử điều hướng quay lại
    
    // Quiz State
    currentQuiz: {
        type: 'practice',             // 'practice' | 'exam' | 'weakness' | 'ioe'
        lessonId: null,
        subtopicId: null,
        questions: [],
        currentIndex: 0,
        score: 0,
        correctCount: 0,
        wrongCount: 0,
        userAnswers: [],
        startTime: 0,
        timeLimit: 0,
        timerInterval: null
    },
    
    // Game Reward State
    gameEnergy: 0,
    freePlayTimeRemaining: 900,       // 15 phút chơi tự do
    
    // AI Chat State
    chatMessages: [],
    isChatOpen: false,
    
    // Auth State
    isParentAuthenticated: false,
    googleUser: null,
    firebaseUser: null
};
```

### B. Lưu trữ Cục bộ (`localStorage` Keys)

| Key | Truy cập bởi | Mục đích |
| :--- | :--- | :--- |
| `adminToken` | `parent.html`, `js/app.js`, `js/parent.js` | Token JWT phiên đăng nhập phụ huynh. |
| `server_port` | `js/app.js` | Ghi nhớ cổng Express Server cục bộ khi chuyển đổi mạng. |
| `skipGoogleLogin` | `js/app.js` | Cờ ghi nhớ bỏ qua bước đăng nhập Google cho chế độ Offline Kiosk. |
| `toan6_theme` | `js/app.js` | Lưu giao diện màu sắc học sinh (Dark / Light / Cyberpunk). |
| `parent_theme` | `js/parent.js` | Lưu theme giao diện phụ huynh. |
| `splash_greeting_muted`| `js/app.js` | Tắt/bật âm thanh chào mừng khởi động. |
| `english_last_study_date` | `js/app.js` | Ghi nhớ ngày học Tiếng Anh gần nhất để nhắc nhở Spaced Repetition. |
| `td_hero_data` | `js/questions-v3.js` | Lưu dữ liệu tướng được chọn trong Tower Defense. |

---

## 6. API CONTRACT (44 ENDPOINTS GIAO TIẾP SERVER)

Toàn bộ các yêu cầu HTTP đều sử dụng tiền tố `/api/*` với phương thức `fetch()`:

| Endpoint | Method | Params / Body | Expected Response Shape |
| :--- | :--- | :--- | :--- |
| `/api/load-config` | GET | `studentId` | `{ success: boolean, config: object }` |
| `/api/save-config` | POST | `{ studentId, config }` | `{ success: boolean }` |
| `/api/load-progress` | GET | `studentId` | `{ success: boolean, progress: object }` |
| `/api/save-progress` | POST | `{ studentId, progress }` | `{ success: boolean }` |
| `/api/admin/login` | POST | `{ pin: string }` | `{ success: boolean, token: string }` |
| `/api/is-kiosk-mode` | GET | None | `{ success: boolean, isKiosk: boolean }` |
| `/api/exit-kiosk` | POST | `{ password: string }` | `{ success: boolean }` |
| `/api/verify-pin` | POST | `{ pin: string }` | `{ success: boolean, valid: boolean }` |
| `/api/get-questions` | GET | `lessonId, level, count` | `{ success: boolean, questions: Array }` |
| `/api/ai-troubleshoot-question` | POST | `{ question, studentAnswer }` | `{ success: boolean, explanation: string }` |
| `/api/ai-analysis` | POST | `{ studentId, range }` | `{ success: boolean, report: string }` |
| `/api/save-printed-pdf` | POST | `{ studentId, pdfData, filename }` | `{ success: boolean, url: string }` |
| `/api/chat/send` | POST | `{ studentId, message }` | `{ success: boolean, reply: string }` |
| `/api/chat/messages` | GET | `studentId` | `{ success: boolean, messages: Array }` |
| `/api/chat/notifications` | GET | `studentId` | `{ success: boolean, unread: number }` |
| `/api/chat/clear-notification` | POST | `{ studentId }` | `{ success: boolean }` |
| `/api/leaderboard` | GET | `grade` | `{ success: boolean, leaderboard: Array }` |
| `/api/heartbeat` | POST | `{ studentId, status }` | `{ success: boolean }` |
| `/api/auth/google-login` | POST | `{ idToken: string }` | `{ success: boolean, user: object }` |
| `/api/auth/google-client-id` | GET | None | `{ success: boolean, clientId: string }` |
| `/api/auth/firebase-config` | GET | None | `{ success: boolean, firebaseConfig: object }` |
| `/api/sync/local-data` | GET | `studentId` | `{ success: boolean, data: object }` |
| `/api/sync/save-pulled-data` | POST | `{ studentId, data }` | `{ success: boolean }` |
| `/api/custom-topics` | GET | `grade` | `{ success: boolean, topics: Array }` |
| `/api/custom-topics/delete` | POST | `{ topicId }` | `{ success: boolean }` |
| `/api/custom-vocabulary` | GET | `grade` | `{ success: boolean, vocabulary: Array }` |
| `/api/custom-vocabulary/add` | POST | `{ word, meaning, example }` | `{ success: boolean }` |
| `/api/custom-vocabulary/delete-word` | POST | `{ wordId }` | `{ success: boolean }` |
| `/api/start-student-pregen` | POST | `{ studentId }` | `{ success: boolean }` |
| `/api/pre-generate-questions`| POST | `{ templates }` | `{ success: boolean }` |
| `/api/api-keys` | GET | None | `{ success: boolean, keys: object }` |
| `/api/save-api-keys` | POST | `{ keys: object }` | `{ success: boolean }` |
| `/api/test-api-keys` | POST | `{ keys: object }` | `{ success: boolean, results: object }` |
| `/api/delete-student-progress`| POST | `{ studentId }` | `{ success: boolean }` |
| `/api/check-update` | GET | None | `{ success: boolean, hasUpdate: boolean, version: string }` |
| `/api/perform-update` | POST | None | `{ success: boolean }` |
| `/api/update-status` | GET | None | `{ success: boolean, status: string }` |
| `/api/tablet/generate-token` | POST | `{ studentId }` | `{ success: boolean, token: string }` |
| `/api/tablet/tokens` | GET | `studentId` | `{ success: boolean, tokens: Array }` |
| `/api/report-client-error` | POST | `{ studentId, errorMessage, errorStack }` | `{ success: boolean }` |
