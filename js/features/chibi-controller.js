/**
 * CHIBI CONTROLLER
 * Điều khiển biểu cảm, lời động viên và hoạt ảnh của bạn đồng hành Chibi
 */
(function() {
    'use strict';

    const ChibiController = {
        expressions: {
            happy: 'chibi/happy.png',
            thinking: 'chibi/thinking.png',
            encourage: 'chibi/encourage.png',
            celebrate: 'chibi/celebrate.png'
        },

        setExpression: function(expr = 'happy') {
            const chibiImg = document.getElementById('chibi-avatar-img');
            if (chibiImg && this.expressions[expr]) {
                chibiImg.src = this.expressions[expr];
            }
        },

        speakMessage: function(message, duration = 4000) {
            const bubble = document.getElementById('chibi-speech-bubble');
            const textEl = document.getElementById('chibi-speech-text');
            if (bubble && textEl) {
                textEl.innerText = message;
                bubble.classList.remove('hidden');
                bubble.classList.add('animate-pop-in');

                if (this._timeout) clearTimeout(this._timeout);
                this._timeout = setTimeout(() => {
                    bubble.classList.add('hidden');
                }, duration);
            }
        }
    };

    if (typeof window !== 'undefined') {
        window.ChibiController = ChibiController;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ChibiController;
    }
})();
