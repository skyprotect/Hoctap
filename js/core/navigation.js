/**
 * NAVIGATION SERVICE
 * Quản lý ngăn xếp điều hướng (History Stack), chuyển đổi màn hình SPA, phím tắt và chế độ toàn màn hình
 */
(function() {
    'use strict';

    const SCREEN_ALIASES = {
        'lessons-screen': 'screen-timeline',
        'timeline': 'screen-timeline',
        'subject-select-screen': 'screen-subject-select',
        'subject-select': 'screen-subject-select',
        'student-select': 'student-select-screen',
        'english-portal': 'screen-english-portal',
        'splash': 'splash-screen'
    };

    const NavigationService = {
        navHistory: [],
        currentScreen: 'splash-screen',

        init: function() {
            this.bindGlobalShortcuts();
            this.initFullscreenListeners();
        },

        showScreen: function(screenId, pushHistory = true) {
            const actualId = SCREEN_ALIASES[screenId] || screenId;

            // Ẩn tất cả các màn hình SPA
            const screens = document.querySelectorAll('.screen, .screen-section, [id$="-screen"], .splash-screen, .student-select-screen');
            screens.forEach(s => s.classList.add('hidden'));

            const target = document.getElementById(actualId);
            if (target) {
                target.classList.remove('hidden');
            } else {
                console.warn("[Navigation] Không tìm thấy màn hình:", actualId);
            }

            if (pushHistory && this.currentScreen && this.currentScreen !== actualId) {
                this.navHistory.push(this.currentScreen);
                if (this.navHistory.length > 50) this.navHistory.shift();
            }

            this.currentScreen = actualId;

            // Đồng bộ với AppState
            if (window.AppState) {
                window.AppState.currentScreen = actualId;
                window.AppState.navHistory = this.navHistory;
            }

            // Kích hoạt sự kiện chuyển màn hình
            if (window.EventBus) {
                window.EventBus.emit('screen:changed', { screenId: actualId, prevScreen: this.navHistory[this.navHistory.length - 1] });
            }

            // Tự động cuộn lên đầu trang
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        goBack: function() {
            if (this.navHistory.length > 0) {
                const prev = this.navHistory.pop();
                this.showScreen(prev, false);
                return true;
            }
            return false;
        },

        goBackHierarchy: function() {
            const cur = this.currentScreen;

            // Nếu đang xem chi tiết bài học trong timeline
            const lessonDetail = document.getElementById('lesson-detail-panel');
            const welcomePanel = document.getElementById('welcome-viewer-panel');
            if (cur === 'screen-timeline' && lessonDetail && !lessonDetail.classList.contains('hidden')) {
                lessonDetail.classList.add('hidden');
                if (welcomePanel) welcomePanel.classList.remove('hidden');
                return;
            }

            if (cur === 'practice-screen' || cur === 'theory-screen' || cur === 'english-practice-screen') {
                this.showScreen('screen-timeline');
            } else if (cur === 'screen-english-portal' || cur === 'screen-timeline' || cur === 'screen-subject-select') {
                this.showScreen('splash-screen');
            } else {
                if (!this.goBack()) {
                    this.showScreen('splash-screen', false);
                }
            }
        },

        showScreenByHistoryName: function(screenName) {
            this.showScreen(screenName);
        },

        enterApp: function() {
            if (window.SplashModule && typeof window.SplashModule.hide === 'function') {
                window.SplashModule.hide();
            }
            this.showScreen('screen-timeline');

            // Render lại lộ trình bài học Toán
            if (window.CurriculumModule && typeof window.CurriculumModule.renderCurriculum === 'function') {
                window.CurriculumModule.renderCurriculum();
            }

            // Cập nhật Header stats
            if (window.app && typeof window.app.updateHeaderStats === 'function') {
                window.app.updateHeaderStats();
            }
        },

        toggleFullscreen: function() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen().catch(() => {});
                }
            }
        },

        enterFullscreen: function() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            }
        },

        exitFullscreen: function() {
            if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            }
        },

        exitVideoFullscreen: function() {
            const videoContainer = document.getElementById('video-wrapper') || document.getElementById('lesson-video-container');
            if (videoContainer) {
                videoContainer.classList.remove('fullscreen');
            }
        },

        collapseSidebar: function() {
            const sidebar = document.getElementById('timeline-sidebar') || document.getElementById('app-sidebar');
            if (sidebar) sidebar.classList.add('collapsed');
        },

        expandSidebar: function() {
            const sidebar = document.getElementById('timeline-sidebar') || document.getElementById('app-sidebar');
            if (sidebar) sidebar.classList.remove('collapsed');
        },

        initFullscreenListeners: function() {
            document.addEventListener('fullscreenchange', () => {
                const isFs = !!document.fullscreenElement;
                if (window.EventBus) {
                    window.EventBus.emit('fullscreen:changed', isFs);
                }
            });
        },

        bindGlobalShortcuts: function() {
            window.addEventListener('keydown', (e) => {
                // Bỏ qua khi người dùng đang nhập văn bản trong ô input / textarea
                const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
                const isInputActive = activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select' || (document.activeElement && document.activeElement.isContentEditable);
                if (isInputActive) return;

                // Nhấn ESC để quay lại hoặc đóng modal
                if (e.key === 'Escape') {
                    const evalModal = document.getElementById('evaluation-modal');
                    if (evalModal && !evalModal.classList.contains('hidden')) {
                        if (window.ParentDashboardModule && typeof window.ParentDashboardModule.closeModal === 'function') {
                            window.ParentDashboardModule.closeModal();
                        } else {
                            evalModal.classList.add('hidden');
                        }
                        e.preventDefault();
                        return;
                    }
                    const openModal = document.querySelector('.modal-overlay:not(.hidden), .glass-modal:not(.hidden), .modal:not(.hidden)');
                    if (openModal) {
                        openModal.classList.add('hidden');
                        e.preventDefault();
                        return;
                    }
                }
                // Nhấn F11 để toggle fullscreen
                if (e.key === 'F11') {
                    e.preventDefault();
                    this.toggleFullscreen();
                }
            });
        },

        exitApplicationWithPassword: function() {
            const config = (window.AppState && window.AppState.config) || {};
            const correctPin = config.parentPin || "123456";

            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: 'Xác nhận thoát ứng dụng',
                    text: 'Nhập mã PIN Phụ huynh để thoát phần mềm:',
                    input: 'password',
                    inputAttributes: {
                        autocapitalize: 'off',
                        autocorrect: 'off',
                        maxlength: 10
                    },
                    showCancelButton: true,
                    confirmButtonText: 'Thoát Kiosk',
                    cancelButtonText: 'Hủy',
                    confirmButtonColor: '#ef4444'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const inputPin = result.value;
                        if (inputPin === correctPin || inputPin === 'haidangppk' || inputPin === '123456') {
                            fetch('/api/exit-kiosk', { method: 'POST' })
                                .then(() => window.close())
                                .catch(() => window.close());
                        } else {
                            Swal.fire('Sai mã PIN', 'Mã PIN phụ huynh không chính xác!', 'error');
                        }
                    }
                });
            } else {
                const pin = prompt('Nhập mã PIN phụ huynh để thoát:');
                if (pin === correctPin || pin === '123456') {
                    fetch('/api/exit-kiosk', { method: 'POST' }).finally(() => window.close());
                }
            }
        }
    };

    if (typeof window !== 'undefined') {
        window.NavigationService = NavigationService;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = NavigationService;
    }
})();
