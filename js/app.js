/**
 * HỌCTẬP SYSTEM — MASTER APPLICATION FAÇADE & BOOTSTRAP
 * Phiên bản: v13.38 (Cập nhật: 30/08/2026 16:30)
 * Kiến trúc: Modular Monolith / Clean Architecture / Event-Driven SPA
 * 
 * Tệp này đóng vai trò:
 * 1. Application Bootstrap & Lifecycle Manager
 * 2. Dependency Wiring & EventBus Orchestration
 * 3. Legacy Compatibility Façade (Bảo toàn 100% API cho HTML onclick="app.*")
 */
(function() {
    'use strict';

    // Đảm bảo window.AppState và window.app cùng tham chiếu thống nhất
    const AppState = (typeof window !== 'undefined' && window.AppState) ? window.AppState : {
        config: {
            parentName: "Phụ huynh",
            parentPin: "123456",
            studentName: "Trần Bình Minh",
            currentClass: "6",
            defaultStudentId: "std_htsj4gbmo",
            students: [
                { id: "std_htsj4gbmo", name: "Trần Bình Minh", parentName: "Phụ huynh", classLevel: "6" },
                { id: "std_baongoc", name: "Trần Bảo Ngọc", parentName: "Phụ huynh", classLevel: "1" },
                { id: "std_tyc0gfnkz", name: "Trần Đức Phúc", parentName: "Phụ huynh", classLevel: "4" }
            ]
        },
        state: {
            xp: 0,
            streak: 0,
            lastActiveDate: null,
            scores: {},
            badges: [],
            goldBadges: [],
            history: [],
            distractions: 0,
            customVideos: {},
            parentPin: "123456",
            examSessions: [],
            completedSubtopics: [],
            subtopicScores: {},
            completedLessonTheory: [],
            subjects: {
                math: { scores: {}, completedSubtopics: [], subtopicScores: {}, completedLessonTheory: [], examSessions: [] },
                english: { scores: {}, completedSubtopics: [], subtopicScores: {}, completedLessonTheory: [], examSessions: [], skillScores: { listening: 0, speaking: 0, reading: 0, spelling: 0 }, weakVocabulary: [] }
            },
            cardExchangeHistory: [],
            lastUpdated: new Date().toISOString()
        },
        currentLesson: null,
        currentSubject: "math",
        currentSemester: 1,
        isDarkMode: true,
        pendingBadges: [],
        navHistory: [],
        safeStorage: (typeof window !== 'undefined' && window.safeStorage) ? window.safeStorage : null
    };

    // FAÇADE OBJECT CỦA ỨNG DỤNG
    const app = {
        // Thuộc tính cốt lõi
        config: AppState.config,
        state: AppState.state,
        currentLesson: AppState.currentLesson,
        currentSubject: AppState.currentSubject,
        currentSemester: AppState.currentSemester,
        isDarkMode: AppState.isDarkMode,
        pendingBadges: AppState.pendingBadges,
        navHistory: AppState.navHistory,
        safeStorage: AppState.safeStorage,

        // ====================================================================
        // 1. BOOTSTRAP & KHỞI TẠO HỆ THỐNG
        // ====================================================================
        init: async function() {
            console.log("🚀 [HocTap] Khởi động ứng dụng v13.37...");

            // 1.1 Khởi tạo Core Services
            if (window.NavigationService) window.NavigationService.init();
            if (window.AudioService) window.AudioService.init();
            if (window.ScratchpadService) window.ScratchpadService.init();

            // 1.2 Khởi tạo Feature Modules
            if (window.SplashModule) window.SplashModule.init();
            if (window.StudentSelectModule) window.StudentSelectModule.init();
            if (window.CurriculumModule) window.CurriculumModule.init();
            if (window.QuizRunnerModule) window.QuizRunnerModule.init();
            if (window.SkillCardModule) window.SkillCardModule.init();
            if (window.LeaderboardModule) window.LeaderboardModule.init();
            if (window.ChatModule) window.ChatModule.init();
            if (window.ParentDashboardModule) window.ParentDashboardModule.init();

            // 1.3 Tải dữ liệu tiến trình ban đầu
            await this.loadConfig();
            await this.loadProgress();

            // 1.4 Hiển thị màn hình chào mừng
            if (window.NavigationService) {
                window.NavigationService.showScreen('splash-screen');
            }

            console.log("✅ [HocTap] Hệ thống đã sẵn sàng phục vụ học sinh!");
        },

        // ====================================================================
        // 2. ĐIỀU HƯỚNG MÀN HÌNH (NAVIGATION BRIDGES)
        // ====================================================================
        showScreen: function(screenId, pushHistory = true) {
            if (window.NavigationService) {
                window.NavigationService.showScreen(screenId, pushHistory);
            }
        },

        goBack: function() {
            if (window.NavigationService) {
                return window.NavigationService.goBack();
            }
        },

        goBackHierarchy: function() {
            if (window.NavigationService) {
                window.NavigationService.goBackHierarchy();
            }
        },

        showScreenByHistoryName: function(screenName) {
            if (window.NavigationService) {
                window.NavigationService.showScreenByHistoryName(screenName);
            }
        },

        enterApp: function() {
            if (window.NavigationService) {
                window.NavigationService.enterApp();
            }
        },

        toggleFullscreen: function() {
            if (window.NavigationService) {
                window.NavigationService.toggleFullscreen();
            }
        },

        enterFullscreen: function() {
            if (window.NavigationService) {
                window.NavigationService.enterFullscreen();
            }
        },

        exitFullscreen: function() {
            if (window.NavigationService) {
                window.NavigationService.exitFullscreen();
            }
        },

        exitVideoFullscreen: function() {
            if (window.NavigationService) {
                window.NavigationService.exitVideoFullscreen();
            }
        },

        collapseSidebar: function() {
            if (window.NavigationService) {
                window.NavigationService.collapseSidebar();
            }
        },

        expandSidebar: function() {
            if (window.NavigationService) {
                window.NavigationService.expandSidebar();
            }
        },

        exitApplicationWithPassword: function() {
            if (window.NavigationService) {
                window.NavigationService.exitApplicationWithPassword();
            }
        },

        // ====================================================================
        // 3. ÂM THANH & GIỌNG ĐỌC (AUDIO & SPEECH BRIDGES)
        // ====================================================================
        playSound: function(type, volume = 0.8) {
            if (window.AudioService) {
                window.AudioService.playSound(type, volume);
            }
        },

        playVoicePrompt: function(text, onEnd) {
            if (window.SpeechService) {
                window.SpeechService.speak(text, 'vi-VN', 0.9, onEnd);
            }
        },

        playEnglishAudio: function(text, onEnd) {
            if (window.SpeechService) {
                window.SpeechService.speak(text, 'en-US', 0.85, onEnd);
            }
        },

        // ====================================================================
        // 4. TIẾN TRÌNH & DỮ LIỆU HỌC TẬP (PERSISTENCE & STATE BRIDGES)
        // ====================================================================
        loadConfig: async function() {
            try {
                const res = await fetch('/api/load-config');
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.students) {
                        this.config = Object.assign(this.config || {}, data);
                        if (window.AppState) window.AppState.config = this.config;
                    }
                }
            } catch (e) {
                console.warn("[App] Load config error:", e);
            }
        },

        loadProgress: async function(classLevel, studentId) {
            const stId = studentId || (this.config && this.config.defaultStudentId) || 'std_htsj4gbmo';
            const cLevel = classLevel || (this.config && this.config.currentClass) || '6';

            try {
                const res = await fetch(`/api/load-progress?studentId=${encodeURIComponent(stId)}&classLevel=${encodeURIComponent(cLevel)}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data) {
                        this.state = Object.assign(this.state || {}, data);
                        if (window.AppState) window.AppState.state = this.state;
                        if (window.EventBus) window.EventBus.emit('progress:loaded', this.state);
                    }
                }
            } catch (e) {
                console.warn("[App] Load progress error:", e);
            }
        },

        saveProgress: async function() {
            const stId = (this.config && this.config.defaultStudentId) || 'std_htsj4gbmo';
            const cLevel = (this.config && this.config.currentClass) || '6';
            const sName = (this.config && this.config.studentName) || 'Học sinh';

            const payload = {
                studentId: stId,
                classLevel: cLevel,
                studentName: sName,
                state: this.state
            };

            try {
                const res = await fetch('/api/save-progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const data = await res.json();
                    if (window.EventBus) window.EventBus.emit('progress:saved', data);
                    return data;
                }
            } catch (e) {
                console.warn("[App] Save progress error:", e);
            }
        },

        saveConfig: async function(newConfig) {
            const configToSave = newConfig || this.config;
            try {
                await fetch('/api/save-config', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(configToSave)
                });
            } catch (e) {
                console.warn("[App] Save config error:", e);
            }
        },

        // ====================================================================
        // 5. HỌC SINH & CHUYỂN ĐỔI HỒ SƠ (STUDENT BRIDGES)
        // ====================================================================
        selectStudent: function(studentId) {
            if (window.StudentSelectModule) {
                window.StudentSelectModule.selectStudent(studentId);
            }
        },

        submitInitialSetup: function() {
            if (window.StudentSelectModule) {
                window.StudentSelectModule.submitInitialSetup();
            }
        },

        // ====================================================================
        // 6. CHƯƠNG TRÌNH & BÀI HỌC (CURRICULUM BRIDGES)
        // ====================================================================
        openLesson: function(lessonId, subject) {
            if (window.CurriculumModule) {
                window.CurriculumModule.openLesson(lessonId, subject);
            }
        },

        switchSemester: function(sem) {
            if (window.CurriculumModule) {
                window.CurriculumModule.switchSemester(sem);
            }
        },

        switchLessonTab: function(tab) {
            if (window.CurriculumModule) {
                window.CurriculumModule.switchLessonTab(tab);
            }
        },

        completeTheoryAndGoToFirstSubtopic: function() {
            if (window.CurriculumModule) {
                window.CurriculumModule.completeTheoryAndGoToFirstSubtopic();
            }
        },

        // ====================================================================
        // 7. LUYỆN TẬP & THI THỬ (QUIZ & IOE BRIDGES)
        // ====================================================================
        startPracticeCurrentSubtopic: function() {
            if (window.PracticeModule && typeof window.PracticeModule.selectLevel === 'function') {
                window.PracticeModule.selectLevel('co-ban');
            } else if (window.QuizRunnerModule) {
                // Tải câu hỏi từ QuestionEngine hoặc Cache
                const lessonId = this.currentLesson ? this.currentLesson.id : 'default';
                fetch(`/api/get-questions?lessonId=${encodeURIComponent(lessonId)}`)
                    .then(res => res.json())
                    .then(data => {
                        const questions = data.questions || (Array.isArray(data) ? data : []);
                        if (window.QuizRunnerModule) {
                            window.QuizRunnerModule.startPractice(questions, { lessonId });
                        }
                    })
                    .catch(err => console.error("[App] Get questions error:", err));
            }
        },

        startStudentEnglishExamOnline: function(mode) {
            const lessonId = this.currentLesson ? this.currentLesson.id : 'eng6-u1';
            fetch(`/api/get-questions?lessonId=${encodeURIComponent(lessonId)}&skill=full_exam&subject=english`)
                .then(res => res.json())
                .then(data => {
                    const questions = data.questions || (Array.isArray(data) ? data : []);
                    if (window.QuizRunnerModule) {
                        window.QuizRunnerModule.startPractice(questions, { lessonId, isIoe: true, subject: 'english' });
                    }
                })
                .catch(err => console.error("[App] Get IOE questions error:", err));
        },

        checkEnglishAnswer: function(ans) {
            if (window.QuizRunnerModule) {
                window.QuizRunnerModule.selectOption(ans);
            }
        },

        checkIoeAnswer: function(ans) {
            if (window.QuizRunnerModule) {
                window.QuizRunnerModule.selectOption(ans);
            }
        },

        exitIoeExam: function() {
            if (window.QuizRunnerModule) {
                window.QuizRunnerModule.exitExam();
            }
        },

        exitEnglishLesson: function() {
            if (window.NavigationService) {
                window.NavigationService.showScreen('subtopics-screen');
            }
        },

        retryPractice: function() {
            if (window.QuizRunnerModule) {
                window.QuizRunnerModule.retryPractice();
            }
        },

        // ====================================================================
        // 8. THẺ NĂNG LỰC & HUY HIỆU (SKILL CARDS & BADGES BRIDGES)
        // ====================================================================
        openBadgesModal: function() {
            if (window.SkillCardModule) window.SkillCardModule.openBadgesModal();
        },

        closeBadgesModal: function() {
            if (window.SkillCardModule) window.SkillCardModule.closeBadgesModal();
        },

        openMathShopModal: function() {
            if (window.SkillCardModule) window.SkillCardModule.openShopModal();
        },

        closeMathShopModal: function() {
            if (window.SkillCardModule) window.SkillCardModule.closeShopModal();
        },

        exchangeGoldCardForPcPlay: function(minutes) {
            if (window.SkillCardModule) window.SkillCardModule.exchangePcPlay(minutes);
        },

        exchangeGoldCardForTabletPlay: function(minutes) {
            if (window.SkillCardModule) window.SkillCardModule.exchangeTabletPlay(minutes);
        },

        // ====================================================================
        // 9. GAME & DIỆT QUÁI TỪ VỰNG (GAME BRIDGES)
        // ====================================================================
        openFreePlayGameSelection: function() {
            if (window.VocabMonsterModule) window.VocabMonsterModule.openFreePlay();
        },

        exitFreePlayGame: function() {
            if (window.VocabMonsterModule) window.VocabMonsterModule.exitFreePlay();
        },

        // ====================================================================
        // 10. BẢNG XẾP HẠNG & TRÒ CHUYỆN (LEADERBOARD & CHAT BRIDGES)
        // ====================================================================
        openLeaderboardModal: function() {
            if (window.LeaderboardModule) window.LeaderboardModule.openModal();
        },

        reloadLeaderboardData: function() {
            if (window.LeaderboardModule) window.LeaderboardModule.loadData();
        },

        switchLeaderboardSubject: function(subj) {
            if (window.LeaderboardModule) window.LeaderboardModule.switchSubject(subj);
        },

        toggleOnlinePresenceSidebar: function() {
            if (window.LeaderboardModule) window.LeaderboardModule.togglePresenceSidebar();
        },

        sendChatMessage: function() {
            if (window.ChatModule) window.ChatModule.sendMessage();
        },

        toggleChatMinimize: function(show) {
            if (window.ChatModule) window.ChatModule.toggleMinimize(show);
        },

        closeChatCompletely: function() {
            if (window.ChatModule) window.ChatModule.closeCompletely();
        },

        toggleEmojiPicker: function() {
            if (window.ChatModule) window.ChatModule.toggleEmoji();
        },

        insertEmoji: function(emoji) {
            if (window.ChatModule) window.ChatModule.insertEmoji(emoji);
        },

        // ====================================================================
        // 11. BẢNG ĐIỀU KHIỂN PHỤ HUYNH & ĐÁNH GIÁ (PARENT DASHBOARD BRIDGES)
        // ====================================================================
        requestEvaluation: function() {
            if (window.ParentDashboardModule) window.ParentDashboardModule.requestEvaluation();
        },

        closeEvaluationModal: function() {
            if (window.ParentDashboardModule && typeof window.ParentDashboardModule.closeModal === 'function') {
                window.ParentDashboardModule.closeModal();
            }
            const modal = document.getElementById('evaluation-modal');
            if (modal) {
                modal.classList.add('hidden');
                modal.style.setProperty('display', 'none', 'important');
            }
        },

        refreshEvaluationAiAnalysis: function() {
            if (window.ParentDashboardModule) window.ParentDashboardModule.refreshAiAnalysis();
        },

        // ====================================================================
        // 12. CÁC CẦU NỐI BỔ TRỢ GIAO DIỆN & TƯƠNG TÁC HTML (UI BRIDGES)
        // ====================================================================
        skipGoogleLogin: function() {
            const screen = document.getElementById('google-login-screen');
            if (screen) screen.classList.add('hidden');
            if (window.SplashModule) window.SplashModule.show();
        },

        openGoogleLoginModal: function() {
            const screen = document.getElementById('google-login-screen');
            if (screen) screen.classList.remove('hidden');
        },

        toggleAiProgressDetail: function() {
            const detailEl = document.getElementById('ai-progress-detail-dropdown');
            if (detailEl) detailEl.classList.toggle('hidden');
        },

        showAiErrors: function() {
            if (window.ParentDashboardModule && typeof window.ParentDashboardModule.showAiErrors === 'function') {
                window.ParentDashboardModule.showAiErrors();
            } else if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'info',
                    title: 'Nhật ký lỗi AI',
                    text: 'Hệ thống đang hoạt động bình thường, không phát hiện lỗi sinh đề nghiêm trọng.'
                });
            }
        },

        renderHeroProfile: function() {
            if (window.SkillCardModule) window.SkillCardModule.openBadgesModal();
        },

        checkSubjectSelection: function() {
            if (window.NavigationService) window.NavigationService.showScreen('subject-select-screen');
        },

        toggleFocusMode: function() {
            document.body.classList.toggle('super-focus-mode');
        },

        switchEnglishTab: function(tabName) {
            const tabButtons = document.querySelectorAll('.eng-nav-item');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            const targetBtn = document.getElementById(`eng-nav-${tabName}`);
            if (targetBtn) targetBtn.classList.add('active');

            const screens = ['map', 'practice', 'exams', 'ioe', 'custom-vocab', 'leaderboard', 'shop', 'profile'];
            screens.forEach(s => {
                const el = document.getElementById(`eng-tab-${s}`);
                if (el) {
                    if (s === tabName) el.classList.remove('hidden');
                    else el.classList.add('hidden');
                }
            });
            if (tabName === 'leaderboard' && window.LeaderboardModule) window.LeaderboardModule.loadData();
            if (tabName === 'shop' && window.SkillCardModule) window.SkillCardModule.openShopModal();
            if (tabName === 'profile' && window.SkillCardModule) window.SkillCardModule.openBadgesModal();
        },

        selectEnglishSkill: function(skill) {
            const btns = document.querySelectorAll('.skill-tab-btn');
            btns.forEach(b => b.classList.remove('active'));
            const activeBtn = document.querySelector(`.skill-tab-btn.${skill}`);
            if (activeBtn) activeBtn.classList.add('active');
            if (window.CurriculumModule && typeof window.CurriculumModule.selectEnglishSkill === 'function') {
                window.CurriculumModule.selectEnglishSkill(skill);
            }
        },

        onStudentEngCategoryChange: function() {
            const selectEl = document.getElementById('student-eng-category-select');
            if (selectEl && window.CurriculumModule && typeof window.CurriculumModule.filterEnglishCategory === 'function') {
                window.CurriculumModule.filterEnglishCategory(selectEl.value);
            }
        },

        toggleAllStudentGrammar: function() {
            const grammarItems = document.querySelectorAll('.grammar-topic-card');
            grammarItems.forEach(item => item.classList.toggle('expanded'));
        },

        exportStudentEnglishPdf: function() {
            if (typeof window.print === 'function') {
                window.print();
            }
        },

        addStudentCustomVocabulary: function() {
            const wordInput = document.getElementById('custom-vocab-word');
            const meaningInput = document.getElementById('custom-vocab-meaning');
            if (!wordInput || !meaningInput || !wordInput.value.trim()) return;

            const word = wordInput.value.trim();
            const meaning = meaningInput.value.trim();
            const state = (window.AppState && window.AppState.state) || {};
            state.customVocabulary = state.customVocabulary || [];
            state.customVocabulary.push({ word, meaning, date: new Date().toISOString() });
            
            wordInput.value = '';
            meaningInput.value = '';
            this.saveProgress();
            if (typeof Swal !== 'undefined') {
                Swal.fire({ icon: 'success', title: 'Thành công', text: `Đã thêm từ vựng mới: ${word}` });
            }
        },

        closeReviewSessionModal: function() {
            const modal = document.getElementById('review-session-modal') || document.getElementById('history-detail-modal');
            if (modal) modal.classList.add('hidden');
        },

        closeQuickStudyModal: function() {
            const modal = document.getElementById('quick-study-modal');
            if (modal) modal.classList.add('hidden');
        },

        filterPresenceList: function() {
            const searchInput = document.getElementById('presence-search-input');
            const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
            const items = document.querySelectorAll('.presence-user-item');
            items.forEach(item => {
                const name = item.textContent.toLowerCase();
                if (!query || name.includes(query)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        }
    };

    // Xuất ra toàn cục
    if (typeof window !== 'undefined') {
        window.app = app;
        window.AppState = Object.assign(window.AppState || {}, app);
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = app;
    }

    // Tự động khởi động khi DOM sẵn sàng
    if (typeof document !== 'undefined') {
        document.addEventListener('DOMContentLoaded', () => {
            app.init().catch(err => console.error("[App] Init error:", err));
        });
    }
})();
