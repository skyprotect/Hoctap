/**
 * VOCAB MONSTER MODULE
 * Game diệt quái vật từ vựng Tiếng Anh: Chiến thuật thủ tháp, Nhập từ vựng chính xác để tung đòn tấn công và nhận thưởng
 */
(function() {
    'use strict';

    const VocabMonsterModule = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            // Lắng nghe sự kiện
        },

        openFreePlay: function() {
            const overlay = document.getElementById('free-play-overlay');
            if (overlay) {
                overlay.classList.remove('hidden');
                if (window.game && typeof window.game.startFreePlay === 'function') {
                    window.game.startFreePlay();
                }
            }
        },

        exitFreePlay: function() {
            const overlay = document.getElementById('free-play-overlay');
            if (overlay) {
                overlay.classList.add('hidden');
                if (window.game && typeof window.game.stopFreePlay === 'function') {
                    window.game.stopFreePlay();
                }
            }
        }
    };

    if (typeof window !== 'undefined') {
        window.VocabMonsterModule = VocabMonsterModule;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = VocabMonsterModule;
    }
})();
