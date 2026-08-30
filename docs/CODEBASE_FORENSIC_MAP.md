# CODEBASE FORENSIC MAP — HOC TAP SYSTEM
**Phiên bản:** v13.37 → v13.38  
**Thời gian tạo:** 30/08/2026 16:30  
**Tác giả:** Principal Software Architect & QA/Release Engineer  

---

## 1. SƠ ĐỒ PHỤ THUỘC & KIẾN TRÚC TOÀN HỆ THỐNG

### A. Tầng Trình duyệt & SPA Runtime (Client-Side)
```
[ student.html / parent.html ]
      │
      ├─► [ CSS Resources ]
      │     ├─ css/style.css (Core Style & Themes)
      │     └─ css/lib/ (FontAwesome, KaTeX)
      │
      ├─► [ Core Infrastructure Layer: js/core/ ]
      │     ├─ storage.js (safeStorage with In-Memory fallback)
      │     ├─ state.js (AppState & Student/Subject Isolation)
      │     ├─ event-bus.js (Decoupled Pub/Sub EventBus)
      │     ├─ api-client.js (REST API client with JWT)
      │     ├─ navigation.js (NavigationService & Screen stack)
      │     └─ lazy-loader.js (On-demand loader for Game, Chart, Mermaid, Question banks)
      │
      ├─► [ Question Engine: js/engine/ ]
      │     └─ question-engine.js (QuestionEngine v3.0, collision prevention, cache, math helpers)
      │
      ├─► [ Feature Services: js/features/ ]
      │     ├─ katex-service.js (Math formula renderer)
      │     ├─ audio-service.js (Web Audio synth & sound fx)
      │     ├─ speech-service.js (SpeechRecognition & SpeechSynthesis)
      │     ├─ scratchpad-service.js (Touch/mouse whiteboard for math)
      │     ├─ srs-service.js (Spaced Repetition Leitner 5-box)
      │     ├─ gamification-service.js (XP, Streak, 50 Skill Cards, 30 Badges)
      │     ├─ chibi-controller.js (Chibi avatar animations)
      │     ├─ ui-renderer.js (Shared UI widgets & modals)
      │     └─ quiz-manager.js (Exam state & evaluation)
      │
      ├─► [ Business Modules: js/modules/ ]
      │     ├─ splash.module.js (Greeting, realtime clock, quotes)
      │     ├─ student-select.module.js (Profile switching & initial setup)
      │     ├─ curriculum.module.js (Course tree, theory viewer, YouTube embed)
      │     ├─ quiz-runner.module.js (Practice, IOE arena, exam timer)
      │     ├─ practice.module.js (Practice level controller)
      │     ├─ vocab-monster.module.js (English Monster Slayer vocabulary minigame)
      │     ├─ skill-card.module.js (50 Skill Cards grid, PC/Tablet play rewards)
      │     ├─ leaderboard.module.js (Live leaderboard & presence sidebar)
      │     ├─ chat.module.js (Realtime student-parent chat & emojis)
      │     ├─ settings.module.js (App settings & preferences)
      │     └─ parent-dashboard.module.js (Competency reports & AI evaluations)
      │
      ├─► [ Canonical Educational Data Layer ]
      │     ├─ data/grade_1/math/generator.js (Grade 1 Math generator)
      │     ├─ data/grade_4/math/generator.js (Grade 4 Math generator)
      │     ├─ data/grade_6/math/generator.js (Grade 6 Math generator)
      │     ├─ data/grade_6/math/advanced.js (Grade 6 Advanced Math)
      │     ├─ data/grade_6/math/exam7991.js (Grade 6 Exam 7991)
      │     ├─ data/grade_1/english/lessons.js (Grade 1 English lessons & vocab)
      │     ├─ data/grade_4/english/lessons.js (Grade 4 English lessons & vocab)
      │     ├─ data/grade_6/english/lessons.js (Grade 6 English lessons & vocab)
      │     ├─ data/math/grade6/*.json (JSON question banks Chapter 1-5)
      │     ├─ js/english_data.js (English question generators & grammar questions)
      │     └─ js/lessons.js (Course structure, subtopics generator & video mappings)
      │
      ├─► [ Façade & Bootstrap Layer ]
      │     └─ js/app.js (window.app Façade, wiring, and lifecycle)
      │
      ├─► [ Background Workers ]
      │     ├─ js/question-generator-worker.js (Off-thread math question generator)
      │     ├─ js/remove-bg-worker.js (Off-thread canvas background removal)
      │     └─ sw.js (Service Worker PWA cache & offline strategy)
      │
      └─► [ Lazy-Loaded Heavy Assets ]
            ├─ js/game.js (Canvas 2D Tower Defense Engine)
            ├─ js/lib/chart.min.js (Progress charts)
            └─ js/lib/mermaid.min.js (Mindmap visualizer)
```

---

## 2. BẢN ĐỒ ÁNH XẠ CALLERS & CALLEES (CALL GRAPH)

### 2.1. HTML Event Handlers (`student.html` & `parent.html`)
| HTML Event Handler | Gọi Tới Module / Service | Trạng Thái |
| :--- | :--- | :--- |
| `onclick="app.init()"` | `js/app.js: init()` | LIVE |
| `onclick="app.showScreen(id)"` | `js/core/navigation.js: showScreen(id)` | LIVE |
| `onclick="app.goBack()"` / `goBackHierarchy()` | `js/core/navigation.js: goBack() / goBackHierarchy()` | LIVE |
| `onclick="app.enterApp()"` | `js/core/navigation.js: enterApp()` | LIVE |
| `onclick="app.toggleFullscreen()"` | `js/core/navigation.js: toggleFullscreen()` | LIVE |
| `onclick="app.exitApplicationWithPassword()"` | `js/core/navigation.js: exitApplicationWithPassword()` | LIVE |
| `onclick="app.selectStudent(id)"` | `js/modules/student-select.module.js: selectStudent(id)` | LIVE |
| `onclick="app.submitInitialSetup()"` | `js/modules/student-select.module.js: submitInitialSetup()` | LIVE |
| `onclick="app.openLesson(id, subj)"` | `js/modules/curriculum.module.js: openLesson(id, subj)` | LIVE |
| `onclick="app.switchSemester(sem)"` | `js/modules/curriculum.module.js: switchSemester(sem)` | LIVE |
| `onclick="app.switchLessonTab(tab)"` | `js/modules/curriculum.module.js: switchLessonTab(tab)` | LIVE |
| `onclick="app.completeTheoryAndGoToFirstSubtopic()"` | `js/modules/curriculum.module.js: completeTheoryAndGoToFirstSubtopic()` | LIVE |
| `onclick="app.startPracticeCurrentSubtopic()"` | `js/modules/quiz-runner.module.js: startPractice()` | LIVE |
| `onclick="app.startStudentEnglishExamOnline()"` | `js/modules/quiz-runner.module.js: startPractice(isIoe=true)` | LIVE |
| `onclick="app.retryPractice()"` | `js/modules/quiz-runner.module.js: retryPractice()` | LIVE |
| `onclick="app.exitIoeExam()"` | `js/modules/quiz-runner.module.js: exitExam()` | LIVE |
| `onclick="app.openBadgesModal()"` / `closeBadgesModal()` | `js/modules/skill-card.module.js: openBadgesModal() / closeBadgesModal()` | LIVE |
| `onclick="app.openMathShopModal()"` / `closeMathShopModal()` | `js/modules/skill-card.module.js: openShopModal() / closeShopModal()` | LIVE |
| `onclick="app.exchangeGoldCardForPcPlay(min)"` | `js/modules/skill-card.module.js: exchangePcPlay(min)` | LIVE |
| `onclick="app.exchangeGoldCardForTabletPlay(min)"` | `js/modules/skill-card.module.js: exchangeTabletPlay(min)` | LIVE |
| `onclick="app.openFreePlayGameSelection()"` / `exitFreePlayGame()` | `js/modules/vocab-monster.module.js: openFreePlay() / exitFreePlay()` | LIVE |
| `onclick="app.openLeaderboardModal()"` / `reloadLeaderboardData()` | `js/modules/leaderboard.module.js: openModal() / loadData()` | LIVE |
| `onclick="app.switchLeaderboardSubject(subj)"` | `js/modules/leaderboard.module.js: switchSubject(subj)` | LIVE |
| `onclick="app.toggleOnlinePresenceSidebar()"` | `js/modules/leaderboard.module.js: togglePresenceSidebar()` | LIVE |
| `oninput="app.filterPresenceList()"` | `js/modules/leaderboard.module.js: filterPresenceList()` | LIVE (Façade Bridge) |
| `onclick="app.sendChatMessage()"` | `js/modules/chat.module.js: sendMessage()` | LIVE |
| `onclick="app.toggleChatMinimize()"` / `closeChatCompletely()` | `js/modules/chat.module.js: toggleMinimize() / closeCompletely()` | LIVE |
| `onclick="app.toggleEmojiPicker()"` / `insertEmoji()` | `js/modules/chat.module.js: toggleEmoji() / insertEmoji()` | LIVE |
| `onclick="app.requestEvaluation()"` / `closeEvaluationModal()` | `js/modules/parent-dashboard.module.js: requestEvaluation() / closeModal()` | LIVE |
| `onclick="app.refreshEvaluationAiAnalysis()"` | `js/modules/parent-dashboard.module.js: refreshAiAnalysis()` | LIVE |
| `onclick="app.skipGoogleLogin()"` / `openGoogleLoginModal()` | `js/modules/splash.module.js` / Modal controls | LIVE (Façade Bridge) |
| `onclick="app.toggleAiProgressDetail()"` / `showAiErrors()` | `js/features/ui-renderer.js` / Header AI indicators | LIVE (Façade Bridge) |
| `onclick="app.renderHeroProfile()"` | `js/modules/skill-card.module.js` | LIVE (Façade Bridge) |
| `onclick="app.checkSubjectSelection()"` | `js/modules/student-select.module.js` | LIVE (Façade Bridge) |
| `onclick="app.toggleFocusMode()"` | `js/core/navigation.js` | LIVE (Façade Bridge) |
| `onclick="app.switchEnglishTab(tab)"` | `js/modules/curriculum.module.js` | LIVE (Façade Bridge) |
| `onclick="app.selectEnglishSkill(skill)"` | `js/modules/curriculum.module.js` | LIVE (Façade Bridge) |
| `onchange="app.onStudentEngCategoryChange()"` | `js/modules/curriculum.module.js` | LIVE (Façade Bridge) |
| `onclick="app.toggleAllStudentGrammar()"` | `js/modules/curriculum.module.js` | LIVE (Façade Bridge) |
| `onclick="app.exportStudentEnglishPdf()"` | `js/modules/curriculum.module.js` | LIVE (Façade Bridge) |
| `onclick="app.addStudentCustomVocabulary()"` | `js/modules/curriculum.module.js` | LIVE (Façade Bridge) |
| `onclick="app.closeReviewSessionModal()"` | `js/modules/quiz-runner.module.js` | LIVE (Façade Bridge) |
| `onclick="app.closeQuickStudyModal()"` | `js/modules/quiz-runner.module.js` | LIVE (Façade Bridge) |

---

## 3. PHÂN LOẠI TOÀN DIỆN MÃ NGUỒN (CODE INVENTORY & DISPOSITION)

| Tệp / Thành phần | Phân Loại | Lý Do & Hành Động |
| :--- | :--- | :--- |
| `js/app.js` | **LIVE** | Façade Core và Bootstrap lifecycle của ứng dụng. Bổ sung các facade methods còn thiếu để phục vụ 100% inline HTML handlers. |
| `js/core/*` (6 files) | **LIVE** | Cơ sở hạ tầng trung tâm: State, Storage, EventBus, API Client, Navigation, LazyLoader. |
| `js/engine/question-engine.js` | **LIVE (CANONICAL)** | Bộ sinh đề độc lập QuestionEngine v3.0, Single Source of Truth cho bộ đề toán JSON. |
| `data/engine/question_engine.js` | **DUPLICATE / OBSOLETE** | Bản cũ v2.0 (224 LOC) trùng lặp với `js/engine/question-engine.js` (369 LOC) -> **XÓA**. |
| `data/grade_1/math/generator.js` | **LIVE (CANONICAL)** | Bộ sinh đề Toán Lớp 1 chuẩn hóa -> Giữ nguyên. |
| `js/questions-v1.js` | **DUPLICATE** | Trùng lặp với `data/grade_1/math/generator.js` -> **XÓA**. |
| `data/grade_4/math/generator.js` | **LIVE (CANONICAL)** | Bộ sinh đề Toán Lớp 4 chuẩn hóa -> Giữ nguyên. |
| `js/questions-v4.js` | **DUPLICATE** | Trùng lặp với `data/grade_4/math/generator.js` -> **XÓA**. |
| `data/grade_6/math/generator.js` | **LIVE (CANONICAL)** | Bộ sinh đề Toán Lớp 6 chuẩn hóa 10.294 LOC -> Giữ nguyên làm Single Source of Truth. |
| `js/questions-v3.js` | **DUPLICATE** | Trùng lặp 10.288 LOC với `data/grade_6/math/generator.js` -> **XÓA**. |
| `data/grade_6/math/exam7991.js` | **LIVE (CANONICAL)** | Bộ đề ôn thi 7991 Toán 6 -> Giữ nguyên. |
| `js/questions-7991.js` | **DUPLICATE** | Trùng lặp 100% với `data/grade_6/math/exam7991.js` -> **XÓA**. |
| `data/grade_6/math/advanced.js` | **LIVE (CANONICAL)** | Bộ đề nâng cao Toán 6 -> Giữ nguyên. |
| `js/questions-advanced.js` | **DUPLICATE** | Trùng lặp 100% với `data/grade_6/math/advanced.js` -> **XÓA**. |
| `data/grade_1/english/lessons.js` | **LIVE (CANONICAL)** | Dữ liệu chương trình Tiếng Anh Lớp 1 -> Giữ nguyên. |
| `data/grade_4/english/lessons.js` | **LIVE (CANONICAL)** | Dữ liệu chương trình Tiếng Anh Lớp 4 -> Giữ nguyên. |
| `data/grade_6/english/lessons.js` | **LIVE (CANONICAL)** | Dữ liệu chương trình Tiếng Anh Lớp 6 -> Giữ nguyên. |
| `js/english_data.js` | **LIVE / REFACTOR** | Chứa 8.000 dòng trùng lặp dữ liệu lớp 1, 4, 6 (đã có trong data/grade_*/english/lessons.js) + 1.900 dòng Logic sinh câu hỏi & Ngân hàng bài tập ngữ pháp Tiếng Anh -> Tối ưu hóa, loại bỏ duplicate dữ liệu, chỉ giữ lại Engine sinh đề & Grammar Banks. |
| `js/lessons.js` | **LIVE** | Cấu trúc cây bài học Toán, Video YouTube và kết nối Tiếng Anh. |
| `js/features/*` (9 files) | **LIVE** | Các dịch vụ âm thanh, giọng đọc, bảng nháp, KaTeX, SRS, Gameification, Chibi, UI Renderer, Quiz Manager. |
| `js/modules/*` (11 files) | **LIVE** | Các module giao diện chức năng SPA. |
| `js/game.js` | **LIVE** | Động cơ Tower Defense Canvas 2D, lazy-loaded qua LazyLoader. |
| `js/question-generator-worker.js` | **LIVE** | Web Worker sinh câu hỏi ngầm cho Toán Lớp 6. |
| `js/remove-bg-worker.js` | **LIVE** | Web Worker tách nền ảnh đồ họa game. |
| `sw.js` | **LIVE / REFACTOR** | Service Worker PWA, loại bỏ tài nguyên ảo không tồn tại (`/css/quiz.css`). |
| `scripts/scratch/*` (11 files) | **DEAD / SCRATCH** | Các tệp scratch tạm thời từ các phiên làm việc trước -> **XÓA**. |
| `sync_clean.js` & `scripts/build/sync_clean.js` | **TOOLING / SYNC** | Đồng bộ cấu hình loại trừ các tệp duplicate đã xóa để `sync_clean.js` chạy hoàn hảo 100%. |
