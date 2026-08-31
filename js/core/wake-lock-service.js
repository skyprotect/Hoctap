/**
 * WakeLockService — Quản lý Screen Wake Lock API để giữ màn hình luôn sáng.
 * 
 * Public Contract:
 * - isSupported(): boolean
 * - getSentinel(): WakeLockSentinel | null
 * - requestWakeLock(): Promise<WakeLockSentinel | null>
 * - init(): void
 * - cleanup(): void
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.WakeLockService = api;
    if (typeof window !== 'undefined') {
        window.WakeLockService = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.WakeLockService = api;
    }
    if (typeof self !== 'undefined') {
        self.WakeLockService = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    let wakeLock = null;
    let interactionHandler = null;
    let visibilityHandler = null;

    const WakeLockService = {
        isSupported: function() {
            return typeof navigator !== 'undefined' && ('wakeLock' in navigator);
        },

        getSentinel: function() {
            return wakeLock;
        },

        requestWakeLock: async function() {
            if (this.isSupported()) {
                try {
                    wakeLock = await navigator.wakeLock.request('screen');
                    console.log('Screen Wake Lock đã được kích hoạt thành công!');
                    return wakeLock;
                } catch (err) {
                    console.warn(`Lỗi kích hoạt Screen Wake Lock: ${err.name}, ${err.message}`);
                    return null;
                }
            } else {
                console.warn('Trình duyệt không hỗ trợ Screen Wake Lock API.');
                return null;
            }
        },

        init: function() {
            if (typeof document === 'undefined') return;

            this.cleanup();

            // Kích hoạt sau tương tác đầu tiên của người dùng
            interactionHandler = () => {
                this.requestWakeLock();
                if (interactionHandler) {
                    document.removeEventListener('click', interactionHandler);
                    document.removeEventListener('touchstart', interactionHandler);
                    interactionHandler = null;
                }
            };
            document.addEventListener('click', interactionHandler);
            document.addEventListener('touchstart', interactionHandler);

            // Kích hoạt lại khi tab hoạt động trở lại
            visibilityHandler = async () => {
                if (wakeLock !== null && document.visibilityState === 'visible') {
                    await this.requestWakeLock();
                }
            };
            document.addEventListener('visibilitychange', visibilityHandler);
        },

        cleanup: function() {
            if (typeof document !== 'undefined') {
                if (interactionHandler) {
                    document.removeEventListener('click', interactionHandler);
                    document.removeEventListener('touchstart', interactionHandler);
                    interactionHandler = null;
                }
                if (visibilityHandler) {
                    document.removeEventListener('visibilitychange', visibilityHandler);
                    visibilityHandler = null;
                }
            }
            wakeLock = null;
        }
    };

    return WakeLockService;
});
