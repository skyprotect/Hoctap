# BẢNG DANH MỤC API FAÇADE TƯƠNG THÍCH TOÀN CỤC (v13.38)

**Tệp điều phối**: `js/app.js`  
**Tổng số phương thức**: 52 phương thức  
**Mục tiêu**: Đảm bảo 100% các lệnh gọi `onclick="app.*"` hoặc `AppState.*` từ `student.html` và `parent.html` hoạt động trơn tru không lỗi.

---

| STT | Tên phương thức (`app.*`) | Nguồn gọi từ HTML / UI | Module / Dịch vụ đích xử lý | Trạng thái |
| :--- | :--- | :--- | :--- | :--- |
| 1 | `skipGoogleLogin()` | `student.html` (Google Login Screen) | `SplashModule.show()` | ✅ Hoàn thiện |
| 2 | `submitInitialSetup()` | `student.html` (Setup Screen) | `StudentSelectModule.submitSetup()` | ✅ Hoàn thiện |
| 3 | `openGoogleLoginModal()` | `student.html` (Header Login) | Hiển thị modal Google Auth | ✅ Hoàn thiện |
| 4 | `goBack()` | `student.html` (Back buttons) | `NavigationService.goBack()` | ✅ Hoàn thiện |
| 5 | `showScreenByHistoryName(name)` | `student.html` (Breadcrumb) | `NavigationService.showScreen(name)` | ✅ Hoàn thiện |
| 6 | `enterApp()` | `student.html` (Splash Start Button) | `SplashModule.enterApp()` | ✅ Hoàn thiện |
| 7 | `toggleAiProgressDetail()` | `student.html` (AI Loading) | Toggle UI Dropdown tiến trình AI | ✅ Hoàn thiện |
| 8 | `showAiErrors()` | `student.html` (AI Status bar) | `ParentDashboardModule.showAiErrors()` | ✅ Hoàn thiện |
| 9 | `showScreen(screenId)` | `student.html` / `parent.html` | `NavigationService.showScreen(id)` | ✅ Hoàn thiện |
| 10 | `openBadgesModal()` | `student.html` (Badge Bar) | `SkillCardModule.openBadgesModal()` | ✅ Hoàn thiện |
| 11 | `openLeaderboardModal()` | `student.html` (Rank button) | `LeaderboardModule.openModal()` | ✅ Hoàn thiện |
| 12 | `renderHeroProfile()` | `student.html` (Avatar click) | `SkillCardModule.openBadgesModal()` | ✅ Hoàn thiện |
| 13 | `openMathShopModal()` | `student.html` (Shop button) | `SkillCardModule.openShopModal()` | ✅ Hoàn thiện |
| 14 | `checkSubjectSelection()` | `student.html` (Subject Icon) | `NavigationService.showScreen(...)` | ✅ Hoàn thiện |
| 15 | `requestEvaluation()` | `parent.html` (Evaluate tab) | `ParentDashboardModule.requestEvaluation()` | ✅ Hoàn thiện |
| 16 | `openFreePlayGameSelection()` | `student.html` (Game button) | Mở màn hình chọn game tự do | ✅ Hoàn thiện |
| 17 | `expandSidebar()` | `student.html` (Menu expand) | Mở rộng thanh điều hướng bên | ✅ Hoàn thiện |
| 18 | `collapseSidebar()` | `student.html` (Menu collapse) | Thu gọn thanh điều hướng bên | ✅ Hoàn thiện |
| 19 | `switchSemester(sem)` | `student.html` (Semester tab) | `CurriculumModule.switchSemester(sem)` | ✅ Hoàn thiện |
| 20 | `switchLessonTab(tab)` | `student.html` (Lesson tabs) | `CurriculumModule.switchTab(tab)` | ✅ Hoàn thiện |
| 21 | `toggleFocusMode()` | `student.html` (Focus mode btn) | Toggle CSS class `super-focus-mode` | ✅ Hoàn thiện |
| 22 | `startPracticeCurrentSubtopic()` | `student.html` (Practice btn) | `CurriculumModule.startPractice()` | ✅ Hoàn thiện |
| 23 | `completeTheoryAndGoToFirstSubtopic()` | `student.html` (Theory next) | `CurriculumModule.completeTheory()` | ✅ Hoàn thiện |
| 24 | `toggleFullscreen()` | `student.html` (Fullscreen btn) | HTML5 Fullscreen API | ✅ Hoàn thiện |
| 25 | `retryPractice()` | `student.html` (Practice retry) | `QuizRunnerModule.retry()` | ✅ Hoàn thiện |
| 26 | `switchEnglishTab(tab)` | `student.html` (English nav) | Điều hướng 8 tab Tiếng Anh | ✅ Hoàn thiện |
| 27 | `selectEnglishSkill(skill)` | `student.html` (Skill tabs) | `CurriculumModule.selectEnglishSkill()` | ✅ Hoàn thiện |
| 28 | `onStudentEngCategoryChange()` | `student.html` (Eng select) | `CurriculumModule.filterEnglishCategory()` | ✅ Hoàn thiện |
| 29 | `toggleAllStudentGrammar()` | `student.html` (Grammar list) | Mở rộng/thu gọn danh mục ngữ pháp | ✅ Hoàn thiện |
| 30 | `startStudentEnglishExamOnline(id)`| `student.html` (Exam start) | `CurriculumModule.startEnglishExam(id)` | ✅ Hoàn thiện |
| 31 | `exportStudentEnglishPdf()` | `student.html` (Export PDF) | In tài liệu đề thi Tiếng Anh sang PDF | ✅ Hoàn thiện |
| 32 | `addStudentCustomVocabulary()` | `student.html` (Add Vocab) | Lưu từ vựng tự nhập vào AppState | ✅ Hoàn thiện |
| 33 | `exitEnglishLesson()` | `student.html` (Exit Eng) | `CurriculumModule.exitEnglishLesson()` | ✅ Hoàn thiện |
| 34 | `exitIoeExam()` | `student.html` (Exit IOE) | `CurriculumModule.exitIoeExam()` | ✅ Hoàn thiện |
| 35 | `closeBadgesModal()` | `student.html` (Close badge) | Đóng modal huy hiệu | ✅ Hoàn thiện |
| 36 | `closeMathShopModal()` | `student.html` (Close shop) | Đóng modal cửa hàng | ✅ Hoàn thiện |
| 37 | `closeReviewSessionModal()` | `student.html` (Close review) | Đóng modal xem lại bài làm | ✅ Hoàn thiện |
| 38 | `closeQuickStudyModal()` | `student.html` (Close quick) | Đóng modal học nhanh | ✅ Hoàn thiện |
| 39 | `closeEvaluationModal()` | `parent.html` (Close eval) | `ParentDashboardModule.closeModal()` | ✅ Hoàn thiện |
| 40 | `refreshEvaluationAiAnalysis()` | `parent.html` (Refresh AI) | `ParentDashboardModule.refreshAiAnalysis()`| ✅ Hoàn thiện |
| 41 | `switchLeaderboardSubject(sub)` | `student.html` (Rank tab) | `LeaderboardModule.switchSubject(sub)` | ✅ Hoàn thiện |
| 42 | `reloadLeaderboardData()` | `student.html` (Rank reload) | `LeaderboardModule.loadData()` | ✅ Hoàn thiện |
| 43 | `toggleOnlinePresenceSidebar()` | `student.html` (Presence) | `LeaderboardModule.togglePresence()` | ✅ Hoàn thiện |
| 44 | `filterPresenceList()` | `student.html` (Presence filter)| Lọc danh sách bạn học trực tuyến | ✅ Hoàn thiện |
| 45 | `toggleChatMinimize(show)` | `student.html` (Chat bar) | `ChatModule.toggleMinimize(show)` | ✅ Hoàn thiện |
| 46 | `closeChatCompletely()` | `student.html` (Chat close) | `ChatModule.closeCompletely()` | ✅ Hoàn thiện |
| 47 | `insertEmoji(emoji)` | `student.html` (Emoji pick) | `ChatModule.insertEmoji(emoji)` | ✅ Hoàn thiện |
| 48 | `sendChatMessage()` | `student.html` (Chat send) | `ChatModule.sendMessage()` | ✅ Hoàn thiện |
| 49 | `toggleEmojiPicker()` | `student.html` (Emoji btn) | `ChatModule.toggleEmoji()` | ✅ Hoàn thiện |
| 50 | `goBackHierarchy()` | `student.html` (Breadcrumb) | `NavigationService.goBackHierarchy()` | ✅ Hoàn thiện |
| 51 | `exitApplicationWithPassword()` | `student.html` (Exit App) | Kích hoạt xác thực mã PIN thoát Kiosk | ✅ Hoàn thiện |
| 52 | `exitFreePlayGame()` | `student.html` (Exit Game) | Đóng overlay trò chơi tự do | ✅ Hoàn thiện |
