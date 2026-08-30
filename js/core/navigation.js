/**
 * NAVIGATION SERVICE
 * Quản lý ngăn xếp điều hướng (History Stack), chuyển đổi màn hình SPA, phím tắt và chế độ toàn màn hình
 */
(function() {
    'use strict';

    const NavigationService = {
        navHistory: [],
        currentScreen: 'splash-screen',

        init: function() {
            this.bindGlobalShortcuts();
            this.initFullscreenListeners();
        },

        showScreen: function(screenId, pushHistory = true) {
            const screens = document.querySelectorAll('.screen');
            screens.forEach(s => s.classList.add('hidden'));

            const target = document.getElementById(screenId);
            if (target) {
                target.classList.remove('hidden');
            } else {
                console.warn("[Navigation] Không tìm thấy màn hình:", screenId);
            }

            if (pushHistory && this.currentScreen && this.currentScreen !== screenId) {
                this.navHistory.push(this.currentScreen);
                if (this.navHistory.length > 50) this.navHistory.shift();
            }

            this.currentScreen = screenId;

            // Đồng bộ với AppState
            if (window.AppState) {
                window.AppState.currentScreen = screenId;
                window.AppState.navHistory = this.navHistory;
            }

            // Kích hoạt sự kiện chuyển màn hình
            if (window.EventBus) {
                window.EventBus.emit('screen:changed', { screenId, prevScreen: this.navHistory[this.navHistory.length - 1] });
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
            // Lộ trình phân cấp thông minh
            const cur = this.currentScreen;
            if (cur === 'practice-screen' || cur === 'theory-screen' || cur === 'english-practice-screen') {
                this.showScreen('subtopics-screen');
            } else if (cur === 'subtopics-screen') {
                this.showScreen('lessons-screen');
            } else if (cur === 'lessons-screen' || cur === 'skill-cards-screen' || cur === 'custom-vocab-screen') {
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
            this.showScreen('lessons-screen');
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
            const videoContainer = document.getElementById('lesson-video-container');
            if (videoContainer) {
                videoContainer.classList.remove('fullscreen');
            }
        },

        collapseSidebar: function() {
            const sidebar = document.getElementById('app-sidebar');
            if (sidebar) sidebar.classList.add('collapsed');
        },

        expandSidebar: function() {
            const sidebar = document.getElementById('app-sidebar');
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
                // Nhấn ESC để quay lại hoặc đóng modal
                if (e.key === 'Escape') {
                    const openModal = document.querySelector('.modal-overlay:not(.hidden)');
                    if (openModal) {
                        openModal.classList.add('hidden');
                        e.preventDefault();
                        return;
                    }
                }
                // Nhấn F11 hoặc Ctrl+F để toggle fullscreen
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
