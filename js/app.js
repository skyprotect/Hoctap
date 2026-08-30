/**
 * HỌCTẬP SYSTEM — MASTER APPLICATION FAÇADE & BOOTSTRAP
 * Phiên bản: v13.52 (Cập nhật: 30/08/2026 20:15)
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
        aiErrors: [],
        aiTrackerInterval: null,

        // ====================================================================
        // 1. BOOTSTRAP & KHỞI TẠO HỆ THỐNG
        // ====================================================================
        init: async function() {
            console.log("🚀 [HocTap] Khởi động ứng dụng v13.52...");

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

            // 1.4 Khởi tạo theo dõi tiến trình AI & kích hoạt sinh đề ngầm
            this.initAiProgressTracker();
            this.triggerAiPregen();

            // 1.5 Cập nhật Header stats
            this.updateHeaderStats();

            // 1.6 Hiển thị màn hình chào mừng
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
                        if (window.SplashModule) window.SplashModule.displayGreeting();
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
                        
                        if (window.SplashModule) window.SplashModule.updateStats();
                        if (window.CurriculumModule) window.CurriculumModule.renderCurriculum();
                        this.updateHeaderStats();

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
                    if (window.EventBus) window.EventBus.emit('progress:saved', this.state);
                }
            } catch (e) {
                console.warn("[App] Save progress error:", e);
            }
        },

        updateHeaderStats: function() {
            const state = this.state || (window.AppState && window.AppState.state) || {};

            const streakEl = document.getElementById('streak-val');
            if (streakEl) streakEl.textContent = state.streak || 0;

            const xpEl = document.getElementById('xp-val');
            if (xpEl) xpEl.textContent = state.xp || 0;

            const badgeEl = document.getElementById('badge-count');
            if (badgeEl) {
                const total = (state.badges ? state.badges.length : 0) + (state.goldBadges ? state.goldBadges.length : 0);
                badgeEl.textContent = total;
            }
        },

        // ====================================================================
        // 5. HỌC SINH & XÁC THỰC (STUDENT SELECT BRIDGES)
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

        switchSubject: function(subject) {
            if (window.CurriculumModule) {
                window.CurriculumModule.switchSubject(subject);
            }
        },

        checkSubjectSelection: function() {
            if (window.NavigationService) {
                window.NavigationService.showScreen('screen-subject-select');
            }
            if (window.CurriculumModule) {
                window.CurriculumModule.renderSubjectSelection();
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
        startPracticeCurrentSubtopic: function(subtopicId) {
            if (window.PracticeModule && typeof window.PracticeModule.selectLevel === 'function') {
                window.PracticeModule.selectLevel('co-ban');
            } else if (window.QuizRunnerModule) {
                const lessonId = this.currentLesson ? this.currentLesson.id : 'default';
                const stId = subtopicId || (window.CurriculumModule && window.CurriculumModule.currentSubtopic ? window.CurriculumModule.currentSubtopic.id : null);
                
                let fetchUrl = `/api/get-questions?lessonId=${encodeURIComponent(lessonId)}`;
                if (stId) fetchUrl += `&subtopicId=${encodeURIComponent(stId)}`;

                fetch(fetchUrl)
                    .then(res => res.json())
                    .then(data => {
                        const questions = data.questions || [];
                        window.QuizRunnerModule.startQuiz(questions);
                    })
                    .catch(err => {
                        console.error("[Quiz] Load questions error:", err);
                        if (typeof Swal !== 'undefined') {
                            Swal.fire('Thông báo', 'Đang tải bộ câu hỏi luyện tập...', 'info');
                        }
                    });
            }
        },

        selectQuizOption: function(index) {
            if (window.QuizRunnerModule) window.QuizRunnerModule.selectOption(index);
        },

        checkQuizAnswer: function() {
            if (window.QuizRunnerModule) window.QuizRunnerModule.checkAnswer();
        },

        nextQuizQuestion: function() {
            if (window.QuizRunnerModule) window.QuizRunnerModule.nextQuestion();
        },

        finishQuiz: function() {
            if (window.QuizRunnerModule) window.QuizRunnerModule.finishQuiz();
        },

        // ====================================================================
        // 8. TIẾN TRÌNH TỰ ĐỘNG SINH ĐỀ AI NGẦM (AI PRE-GENERATION)
        // ====================================================================
        triggerAiPregen: function() {
            const studentId = (this.config && this.config.defaultStudentId) || 'std_htsj4gbmo';
            const classLevel = (this.config && this.config.currentClass) || '6';
            const subject = 'math';

            fetch('/api/start-student-pregen', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, classLevel, subject })
            })
            .then(res => res.json())
            .then(data => {
                console.log('[AI Pre-gen Activation]', data.message || 'Started');
            })
            .catch(err => console.warn('[AI Pre-gen Activation Error]', err));
        },

        initAiProgressTracker: function() {
            const banner = document.getElementById("ai-progress-banner");
            const bar = document.getElementById("ai-progress-bar");
            const text = document.getElementById("ai-progress-text");
            const percent = document.getElementById("ai-progress-percent");
            const errBtn = document.getElementById("ai-progress-error-btn");
            const errCount = document.getElementById("ai-error-count");

            if (!banner) return;

            const fetchAiStatus = () => {
                const studentId = (this.config && this.config.defaultStudentId) || 'std_htsj4gbmo';
                const classLevel = (this.config && this.config.currentClass) || '6';
                const subject = 'math';

                fetch(`/api/ai-status?studentId=${encodeURIComponent(studentId)}&classLevel=${encodeURIComponent(classLevel)}&subject=${encodeURIComponent(subject)}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data && data.active) {
                            banner.classList.remove("hidden");
                            const p = Math.min(100, Math.max(0, Math.round(data.percent || 0)));
                            if (bar) bar.style.width = `${p}%`;
                            if (percent) percent.innerText = `${p}%`;
                            if (text) text.innerText = data.statusText || `AI đang chuẩn bị ngân hàng đề (${p}%)...`;

                            if (data.errors && data.errors.length > 0) {
                                this.aiErrors = data.errors;
                                if (errBtn) errBtn.classList.remove("hidden");
                                if (errCount) errCount.innerText = data.errors.length;
                            } else {
                                if (errBtn) errBtn.classList.add("hidden");
                            }

                            if (p >= 100) {
                                setTimeout(() => {
                                    banner.classList.add("hidden");
                                }, 3000);
                            }
                        } else {
                            banner.classList.add("hidden");
                        }
                    })
                    .catch(() => {});
            };

            fetchAiStatus();
            if (this.aiTrackerInterval) clearInterval(this.aiTrackerInterval);
            this.aiTrackerInterval = setInterval(fetchAiStatus, 5000);
        },

        toggleAiProgressDetail: function() {
            const detail = document.getElementById("ai-progress-detail");
            const icon = document.getElementById("ai-toggle-icon");
            if (detail) {
                const isHidden = detail.classList.toggle("hidden");
                if (icon) icon.style.transform = isHidden ? "rotate(0deg)" : "rotate(180deg)";
            }
        },

        showAiErrors: function() {
            if (this.aiErrors && this.aiErrors.length > 0) {
                const errorHtml = this.aiErrors.map((e, idx) => `<div style="text-align:left; margin-bottom:0.5rem; font-size:0.85rem;"><b>${idx+1}.</b> ${e.message || JSON.stringify(e)}</div>`).join('');
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Nhật ký lỗi sinh đề AI',
                        html: `<div style="max-height:300px; overflow-y:auto;">${errorHtml}</div>`,
                        icon: 'warning'
                    });
                }
            } else {
                if (typeof Swal !== 'undefined') {
                    Swal.fire('Thông báo', 'Hệ thống đang hoạt động bình thường, không phát hiện lỗi sinh đề nghiêm trọng.', 'success');
                }
            }
        },

        // ====================================================================
        // 9. MODALS & KHẢO THÍ (EVALUATION, LEADERBOARD, HERO, SHOP)
        // ====================================================================
        renderHeroProfile: function() {
            if (window.SkillCardModule) window.SkillCardModule.openBadgesModal();
        },

        openBadgesModal: function() {
            if (window.SkillCardModule) window.SkillCardModule.openBadgesModal();
        },

        openMathShopModal: function() {
            if (window.SkillCardModule) window.SkillCardModule.openShopModal();
        },

        openLeaderboardModal: function(subject = 'math') {
            if (window.LeaderboardModule) window.LeaderboardModule.openModal(subject);
        },

        requestEvaluation: function() {
            if (window.ParentDashboardModule && typeof window.ParentDashboardModule.openModal === 'function') {
                window.ParentDashboardModule.openModal();
            } else {
                const modal = document.getElementById('evaluation-modal');
                if (modal) modal.classList.remove('hidden');
            }
        },

        openFreePlayGameSelection: function() {
            const overlay = document.getElementById('free-play-overlay');
            if (overlay) overlay.classList.remove('hidden');
        },

        exitFreePlayGame: function() {
            const overlay = document.getElementById('free-play-overlay');
            if (overlay) overlay.classList.add('hidden');
        },

        toggleFocusMode: function() {
            document.body.classList.toggle('super-focus-mode');
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
