# BẢNG KIỂM KÊ VÀ ÁNH XẠ LEGACY API (M07 LEGACY API INVENTORY)

Tài liệu này ghi nhận toàn bộ các phương thức, biến trạng thái và sự kiện DOM từ tệp `js/app.js` (13.971 dòng) được ánh xạ sang các module và service chuyên biệt.

| Legacy API (window.app.*) | Module / Service Đảm nhiệm | Cầu nối Façade (app.js) | Đối tượng Gọi (Used By) | Mức độ Rủi ro | Trạng thái Kiểm thử |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `app.init()` | `app.js` (Bootstrap) | `app.init` | `DOMContentLoaded`, `student.html` | HIGH | VERIFIED |
| `app.showScreen(screenId)` | `navigation.js` | `navigation.showScreen` | `student.html`, Tất cả modules | CRITICAL | VERIFIED |
| `app.goBack()` / `app.goBackHierarchy()` | `navigation.js` | `navigation.goBackHierarchy` | `student.html` (Nút Quay lại) | CRITICAL | VERIFIED |
| `app.showScreenByHistoryName(name)` | `navigation.js` | `navigation.showScreenByHistoryName` | `student.html` | HIGH | VERIFIED |
| `app.enterApp()` | `navigation.js` | `navigation.enterApp` | `student.html` (Nút Vào học) | CRITICAL | VERIFIED |
| `app.toggleFullscreen()` | `navigation.js` | `navigation.toggleFullscreen` | `student.html` | MEDIUM | VERIFIED |
| `app.exitApplicationWithPassword()` | `navigation.js` | `navigation.exitApplication` | `student.html` (Nút Thoát) | HIGH | VERIFIED |
| `app.playSound(name, ...)` | `audio-service.js` | `audioService.playSound` | Toàn bộ ứng dụng | HIGH | VERIFIED |
| `app.playVoicePrompt(text, ...)` | `speech-service.js` | `speechService.speak` | `quiz-runner`, `splash` | HIGH | VERIFIED |
| `app.loadProgress()` / `app.saveProgress()` | `state.js` & `api-client.js` | `state.load` / `save` | Toàn bộ ứng dụng | CRITICAL | VERIFIED |
| `app.selectStudent(studentId)` | `student-select.module.js` | `studentSelect.selectStudent` | `student.html` (Đổi học sinh) | CRITICAL | VERIFIED |
| `app.submitInitialSetup()` | `student-select.module.js` | `studentSelect.submitSetup` | `student.html` (Setup ban đầu) | HIGH | VERIFIED |
| `app.openLesson(lessonId, ...)` | `curriculum.module.js` | `curriculum.openLesson` | `student.html` | CRITICAL | VERIFIED |
| `app.switchSemester(sem)` | `curriculum.module.js` | `curriculum.switchSemester` | `student.html` (Học kỳ 1/2) | HIGH | VERIFIED |
| `app.switchLessonTab(tab)` | `curriculum.module.js` | `curriculum.switchTab` | `student.html` (Lý thuyết/Luyện tập) | HIGH | VERIFIED |
| `app.completeTheoryAndGoToFirstSubtopic()` | `curriculum.module.js` | `curriculum.completeTheory` | `student.html` | HIGH | VERIFIED |
| `app.startPracticeCurrentSubtopic()` | `quiz-runner.module.js` | `quizRunner.startPractice` | `student.html` | CRITICAL | VERIFIED |
| `app.startStudentEnglishExamOnline()` | `quiz-runner.module.js` | `quizRunner.startEnglishExam` | `student.html` (Thi IOE) | CRITICAL | VERIFIED |
| `app.checkEnglishAnswer(...)` | `quiz-runner.module.js` | `quizRunner.checkAnswer` | `student.html` | CRITICAL | VERIFIED |
| `app.checkIoeAnswer(...)` | `quiz-runner.module.js` | `quizRunner.checkIoeAnswer` | `student.html` | CRITICAL | VERIFIED |
| `app.exitIoeExam()` / `app.finishIoeExam()` | `quiz-runner.module.js` | `quizRunner.exitExam` | `student.html` | HIGH | VERIFIED |
| `app.retryPractice()` | `quiz-runner.module.js` | `quizRunner.retry` | `student.html` | HIGH | VERIFIED |
| `app.openBadgesModal()` / `closeBadgesModal()` | `skill-card.module.js` | `skillCard.openBadges` | `student.html` | MEDIUM | VERIFIED |
| `app.openMathShopModal()` / `closeMathShopModal()` | `skill-card.module.js` | `skillCard.openShop` | `student.html` | MEDIUM | VERIFIED |
| `app.exchangeGoldCardForPcPlay(...)` | `skill-card.module.js` | `skillCard.exchangePc` | `student.html` | HIGH | VERIFIED |
| `app.exchangeGoldCardForTabletPlay(...)` | `skill-card.module.js` | `skillCard.exchangeTablet` | `student.html` | HIGH | VERIFIED |
| `app.openFreePlayGameSelection()` | `vocab-monster.module.js` | `vocabMonster.openFreePlay` | `student.html` | MEDIUM | VERIFIED |
| `app.exitFreePlayGame()` | `vocab-monster.module.js` | `vocabMonster.exitFreePlay` | `student.html` | MEDIUM | VERIFIED |
| `app.openLeaderboardModal()` | `leaderboard.module.js` | `leaderboard.openModal` | `student.html` | MEDIUM | VERIFIED |
| `app.switchLeaderboardSubject(subj)` | `leaderboard.module.js` | `leaderboard.switchSubject` | `student.html` | MEDIUM | VERIFIED |
| `app.sendChatMessage()` | `chat.module.js` | `chat.sendMessage` | `student.html` | HIGH | VERIFIED |
| `app.toggleChatMinimize(show)` | `chat.module.js` | `chat.toggleMinimize` | `student.html` | MEDIUM | VERIFIED |
| `app.closeChatCompletely()` | `chat.module.js` | `chat.closeCompletely` | `student.html` | MEDIUM | VERIFIED |
| `app.insertEmoji(emoji)` | `chat.module.js` | `chat.insertEmoji` | `student.html` | LOW | VERIFIED |
| `app.toggleEmojiPicker()` | `chat.module.js` | `chat.toggleEmoji` | `student.html` | LOW | VERIFIED |
| `app.requestEvaluation()` | `parent-dashboard.module.js` | `parentDashboard.request` | `student.html` | HIGH | VERIFIED |
| `app.closeEvaluationModal()` | `parent-dashboard.module.js` | `parentDashboard.close` | `student.html` | MEDIUM | VERIFIED |
| `app.refreshEvaluationAiAnalysis()` | `parent-dashboard.module.js` | `parentDashboard.refreshAi` | `student.html` | HIGH | VERIFIED |
| `app.addStudentCustomVocabulary()` | `curriculum.module.js` | `curriculum.addVocab` | `student.html` | MEDIUM | VERIFIED |
| `app.exportStudentEnglishPdf()` | `curriculum.module.js` | `curriculum.exportPdf` | `student.html` | LOW | VERIFIED |
