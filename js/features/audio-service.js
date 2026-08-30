/**
 * AUDIO SERVICE
 * Quản lý Web Audio API, hiệu ứng âm thanh (SFX), nhạc nền (BGM) và Text-To-Speech (TTS)
 */
(function() {
    'use strict';

    const AudioService = {
        ctx: null,
        bgAudio: null,
        soundEnabled: true,

        init: function() {
            if (!this.ctx && typeof window !== 'undefined') {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.ctx = new AudioContext();
                }
            }
        },

        playCorrect: function() {
            if (!this.soundEnabled) return;
            this.init();
            if (!this.ctx) return;

            try {
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now); // C5
                osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
                osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5

                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.35);
            } catch (e) {
                console.warn('[AudioService] Play correct sound error:', e);
            }
        },

        playIncorrect: function() {
            if (!this.soundEnabled) return;
            this.init();
            if (!this.ctx) return;

            try {
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.linearRampToValueAtTime(150, now + 0.25);

                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + 0.25);
            } catch (e) {
                console.warn('[AudioService] Play incorrect sound error:', e);
            }
        },

        speak: function(text, lang = 'vi-VN') {
            if (typeof window === 'undefined' || !window.speechSynthesis) return;
            try {
                if (window.speechSynthesis.paused) window.speechSynthesis.resume();
                window.speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = lang;
                utterance.rate = 0.95;
                window.speechSynthesis.speak(utterance);
            } catch (e) {
                console.warn('[AudioService] TTS error:', e);
            }
        }
    };

    if (typeof window !== 'undefined') {
        window.AudioService = AudioService;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = AudioService;
    }
})();
