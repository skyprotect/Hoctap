/**
 * AudioFocusManager — Quản lý quyền phát âm thanh độc quyền và phân cấp ưu tiên (v15.12).
 * 
 * NGUYÊN TẮC CỐT LÕI:
 * "Chỉ có duy nhất một educational audio source được phát tại một thời điểm."
 * Concurrent educational audio streams = 0
 * 
 * PHÂN CẤP ƯU TIÊN (AUDIO PRIORITY):
 * 1. CURRICULUM_TASK (10) : Vocabulary, Listening exercise, Speaking, Exam, Math.
 * 2. STARTUP_PASSIVE (5)  : Nghe thụ động khi khởi động ứng dụng.
 * 3. PASSIVE_PLAYER (5)   : Trình phát nghe thụ động độc lập.
 * 4. SECONDARY_QUOTE (1)  : Châm ngôn phát thủ công bởi người dùng.
 * 
 * Hỗ trợ UMD (Node.js CommonJS, Web Workers, Browser Global).
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.AudioFocusManager = api;
    if (typeof window !== 'undefined') {
        window.AudioFocusManager = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.AudioFocusManager = api;
    }
    if (typeof self !== 'undefined') {
        self.AudioFocusManager = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const PRIORITY = {
        CURRICULUM_TASK: 10,
        STARTUP_PASSIVE: 5,
        PASSIVE_PLAYER: 5,
        SECONDARY_QUOTE: 1
    };

    let currentFocus = null; // { sourceId, priority, onInterrupt, audioElement }
    const listeners = new Set();

    /**
     * Yêu cầu cấp quyền phát âm thanh (Audio Focus)
     * @param {string} sourceId - Định danh nguồn phát (vd: 'STARTUP_PASSIVE', 'VOCAB_CARD')
     * @param {number} priority - Mức độ ưu tiên (PRIORITY.CURRICULUM_TASK, ...)
     * @param {Function} [onInterrupt] - Hàm callback khi bị nguồn ưu tiên cao hơn chiếm quyền
     * @returns {boolean} true nếu được cấp quyền, false nếu bị từ chối do nguồn hiện tại ưu tiên cao hơn
     */
    function requestAudioFocus(sourceId, priority = PRIORITY.CURRICULUM_TASK, onInterrupt = null, audioElement = null) {
        if (!sourceId) {
            console.warn('[AudioFocusManager] requestAudioFocus yêu cầu sourceId hợp lệ.');
            return false;
        }

        const numPriority = typeof priority === 'number' ? priority : (PRIORITY[priority] || 5);

        // Nếu cùng nguồn đang giữ focus, cho phép gia hạn/cập nhật callback
        if (currentFocus && currentFocus.sourceId === sourceId) {
            currentFocus.priority = numPriority;
            if (onInterrupt) currentFocus.onInterrupt = onInterrupt;
            if (audioElement) currentFocus.audioElement = audioElement;
            return true;
        }

        // Nếu đang có nguồn khác giữ focus
        if (currentFocus) {
            if (numPriority >= currentFocus.priority) {
                // Chiếm quyền nguồn cũ (Preempt previous source)
                const oldFocus = currentFocus;
                currentFocus = {
                    sourceId: sourceId,
                    priority: numPriority,
                    onInterrupt: onInterrupt,
                    audioElement: audioElement,
                    grantedAt: Date.now()
                };

                // Tự động pause audio element của nguồn cũ nếu có
                if (oldFocus.audioElement && typeof oldFocus.audioElement.pause === 'function') {
                    try {
                        oldFocus.audioElement.pause();
                    } catch (e) {
                        console.warn('[AudioFocusManager] Lỗi pause audio cũ:', e);
                    }
                }

                // Kích hoạt callback ngắt của nguồn cũ
                if (typeof oldFocus.onInterrupt === 'function') {
                    try {
                        oldFocus.onInterrupt({
                            preemptedBy: sourceId,
                            newPriority: numPriority
                        });
                    } catch (err) {
                        console.warn('[AudioFocusManager] Lỗi trong onInterrupt của ' + oldFocus.sourceId, err);
                    }
                }

                notifyChange('FOCUS_ACQUIRED', currentFocus);
                return true;
            } else {
                // Nguồn mới có ưu tiên thấp hơn nguồn đang chạy -> Từ chối cấp quyền
                console.warn(`[AudioFocusManager] Từ chối cấp focus cho "${sourceId}" (P:${numPriority}) vì "${currentFocus.sourceId}" (P:${currentFocus.priority}) đang phát.`);
                return false;
            }
        }

        // Chưa có nguồn nào giữ focus
        currentFocus = {
            sourceId: sourceId,
            priority: numPriority,
            onInterrupt: onInterrupt,
            audioElement: audioElement,
            grantedAt: Date.now()
        };

        notifyChange('FOCUS_ACQUIRED', currentFocus);
        return true;
    }

    /**
     * Tự nguyện giải phóng quyền phát âm thanh khi đọc xong hoặc dừng
     * @param {string} sourceId - Định danh nguồn muốn giải phóng
     */
    function abandonAudioFocus(sourceId) {
        if (!currentFocus) return;
        if (currentFocus.sourceId === sourceId) {
            const releasedFocus = currentFocus;
            currentFocus = null;
            notifyChange('FOCUS_ABANDONED', releasedFocus);
        }
    }

    /**
     * Ép buộc dừng và giải phóng toàn bộ audio đang hoạt động
     * @param {string} [reason] - Lý do dừng toàn diện
     */
    function stopAll(reason = 'SYSTEM_FORCE_STOP') {
        if (currentFocus) {
            const oldFocus = currentFocus;
            currentFocus = null;
            if (oldFocus.audioElement && typeof oldFocus.audioElement.pause === 'function') {
                try {
                    oldFocus.audioElement.pause();
                    oldFocus.audioElement.currentTime = 0;
                } catch (e) {}
            }
            if (typeof oldFocus.onInterrupt === 'function') {
                try {
                    oldFocus.onInterrupt({ preemptedBy: 'FORCE_STOP', reason: reason });
                } catch (e) {}
            }
            notifyChange('FORCE_STOP', { reason: reason });
        }
    }

    /**
     * Lấy thông tin nguồn đang giữ focus
     */
    function getCurrentFocus() {
        return currentFocus ? { ...currentFocus } : null;
    }

    /**
     * Kiểm tra xem một nguồn cụ thể có đang giữ focus không
     */
    function hasFocus(sourceId) {
        return currentFocus !== null && currentFocus.sourceId === sourceId;
    }

    /**
     * Kiểm tra xem hiện tại có nguồn nào đang giữ focus không
     */
    function hasActiveFocus() {
        return currentFocus !== null;
    }

    /**
     * Lấy ID nguồn hiện tại đang giữ focus
     */
    function getCurrentOwner() {
        return currentFocus ? currentFocus.sourceId : null;
    }

    /**
     * Đếm số luồng âm thanh giáo dục đồng thời đang hoạt động (yêu cầu = 1 hoặc 0)
     */
    function getConcurrentEducationalStreamsCount() {
        return currentFocus ? 1 : 0;
    }

    function notifyChange(event, details) {
        listeners.forEach(cb => {
            try { cb(event, details); } catch (e) {}
        });
    }

    function onFocusChange(callback) {
        if (typeof callback === 'function') {
            listeners.add(callback);
            return () => listeners.delete(callback);
        }
        return () => {};
    }

    return {
        PRIORITY: PRIORITY,
        requestAudioFocus: requestAudioFocus,
        abandonAudioFocus: abandonAudioFocus,
        stopAll: stopAll,
        getCurrentFocus: getCurrentFocus,
        hasFocus: hasFocus,
        hasActiveFocus: hasActiveFocus,
        getCurrentOwner: getCurrentOwner,
        getConcurrentEducationalStreamsCount: getConcurrentEducationalStreamsCount,
        onFocusChange: onFocusChange
    };
});
