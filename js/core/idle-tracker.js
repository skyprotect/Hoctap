/**
 * IdleTracker — Quản lý phát hiện bất hoạt (Inactivity/Idle detection) dựa trên các tương tác DOM.
 * 
 * Public Contract:
 * - init(options?: { timeoutSeconds?: number; maxIdleTime?: number; onIdle?: Function; isAppActive?: Function; isBusy?: Function }): void
 * - reset(): void
 * - getIdleTime(): number
 * - destroy(): void
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.IdleTracker = api;
    if (typeof window !== 'undefined') {
        window.IdleTracker = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.IdleTracker = api;
    }
    if (typeof self !== 'undefined') {
        self.IdleTracker = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    let idleTime = 0;
    let maxIdleTime = 10 * 60; // Mặc định 10 phút = 600 giây
    let intervalId = null;
    let resetHandler = null;
    let currentOptions = {};
    const TRACKED_EVENTS = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    const IdleTracker = {
        reset: function() {
            idleTime = 0;
        },

        getIdleTime: function() {
            return idleTime;
        },

        init: function(options) {
            if (typeof document === 'undefined') return;

            this.destroy();
            currentOptions = options || {};
            maxIdleTime = currentOptions.timeoutSeconds || currentOptions.maxIdleTime || (10 * 60);
            idleTime = 0;

            // Hàm reset thời gian chờ khi người dùng tương tác
            resetHandler = () => {
                this.reset();
            };

            // Lắng nghe các tương tác của người dùng trên toàn bộ document (capture phase = true)
            TRACKED_EVENTS.forEach(name => {
                document.addEventListener(name, resetHandler, true);
            });

            // Chạy kiểm tra mỗi giây
            intervalId = setInterval(() => {
                const isAppActive = typeof currentOptions.isAppActive === 'function'
                    ? currentOptions.isAppActive()
                    : true;

                if (isAppActive) {
                    const isBusy = typeof currentOptions.isBusy === 'function'
                        ? currentOptions.isBusy()
                        : false;

                    if (!isBusy) {
                        idleTime++;
                        if (idleTime >= maxIdleTime) {
                            this.reset();
                            if (typeof currentOptions.onIdle === 'function') {
                                currentOptions.onIdle();
                            }
                        }
                    } else {
                        // Nếu đang bận (ví dụ: xem video hoặc làm bài tập), liên tục reset bộ đếm
                        this.reset();
                    }
                } else {
                    this.reset();
                }
            }, 1000);
        },

        destroy: function() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            if (typeof document !== 'undefined' && resetHandler) {
                TRACKED_EVENTS.forEach(name => {
                    document.removeEventListener(name, resetHandler, true);
                });
                resetHandler = null;
            }
            idleTime = 0;
            currentOptions = {};
        }
    };

    return IdleTracker;
});
