/**
 * EVENT BUS (Custom Event Emitter)
 * Kênh truyền thông điệp nội bộ phân tách giữa các module Frontend
 */
(function() {
    'use strict';

    class EventBus {
        constructor() {
            this.events = {};
        }

        on(event, callback) {
            if (!this.events[event]) {
                this.events[event] = [];
            }
            this.events[event].push(callback);
            return () => this.off(event, callback);
        }

        off(event, callback) {
            if (!this.events[event]) return;
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }

        emit(event, data) {
            if (!this.events[event]) return;
            this.events[event].forEach(callback => {
                try {
                    callback(data);
                } catch (err) {
                    console.error('[EventBus] Lỗi khi xử lý sự kiện ' + event + ':', err);
                }
            });
        }
    }

    const eventBusInstance = new EventBus();

    if (typeof window !== 'undefined') {
        window.EventBus = eventBusInstance;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = eventBusInstance;
    }
})();
