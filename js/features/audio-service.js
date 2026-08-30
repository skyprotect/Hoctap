/**
 * AUDIO SERVICE
 * Quản lý phát âm thanh tương tác: Web Audio API Synthesizer, File âm thanh (.mp3), Nhạc nền (BGM) và Fade volume
 */
(function() {
    'use strict';

    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume().catch(() => {});
        }
        return audioCtx;
    }

    const soundCache = {};
    const SOUND_FILES = {
        correct: 'sounds/correct.mp3',
        wrong: 'sounds/wrong.mp3',
        victory: 'sounds/chucmung.mp3',
        tingting: 'sounds/tingting.mp3',
        bgm: 'sounds/nen.mp3'
    };

    let bgmAudio = null;
    let currentQuoteAudio = null;
    let fadeAnimId = null;

    const AudioService = {
        init: function() {
            // Nạp trước các file âm thanh thông dụng
            Object.keys(SOUND_FILES).forEach(key => {
                const audio = new Audio();
                audio.src = SOUND_FILES[key];
                audio.preload = 'auto';
                soundCache[key] = audio;
            });
        },

        playSound: function(type, volume = 0.8) {
            const audio = soundCache[type] || new Audio(SOUND_FILES[type] || `sounds/${type}.mp3`);
            if (audio) {
                audio.currentTime = 0;
                audio.volume = Math.max(0, Math.min(1, volume));
                audio.play().catch(() => {
                    // Fallback sang Web Audio Synth nếu trình duyệt chặn autoplay
                    this.playSynthSound(type);
                });
            } else {
                this.playSynthSound(type);
            }
        },

        playSynthSound: function(type) {
            const ctx = getAudioContext();
            if (!ctx) return;

            try {
                const now = ctx.currentTime;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);

                if (type === 'correct') {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(587.33, now); // D5
                    osc.frequency.setValueAtTime(880.00, now + 0.1); // A5
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
                    osc.start(now);
                    osc.stop(now + 0.35);
                } else if (type === 'wrong') {
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(220, now);
                    osc.frequency.setValueAtTime(160, now + 0.15);
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                    osc.start(now);
                    osc.stop(now + 0.4);
                } else if (type === 'victory') {
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(523.25, now);
                    osc.frequency.setValueAtTime(659.25, now + 0.1);
                    osc.frequency.setValueAtTime(783.99, now + 0.2);
                    osc.frequency.setValueAtTime(1046.50, now + 0.3);
                    gain.gain.setValueAtTime(0.4, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
                    osc.start(now);
                    osc.stop(now + 0.6);
                } else {
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(440, now);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                    osc.start(now);
                    osc.stop(now + 0.15);
                }
            } catch(e) {
                console.warn("[AudioService] Synth error:", e);
            }
        },

        // Các hiệu ứng âm thanh game
        playCannonSound: function() {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);
            gain.gain.setValueAtTime(0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
        },

        playFreezeSound: function() {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, now);
            osc.frequency.linearRampToValueAtTime(2400, now + 0.25);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.25);
        },

        playLaserSound: function() {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.18);
        },

        playCoinSound: function() {
            const ctx = getAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(987.77, now); // B5
            osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.3);
        },

        fadeAudioVolume: function(audioEl, targetVol, durationMs = 1000, onComplete) {
            if (!audioEl) return;
            if (fadeAnimId) cancelAnimationFrame(fadeAnimId);

            const startVol = audioEl.volume;
            const startTime = performance.now();

            const step = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(1, elapsed / durationMs);
                audioEl.volume = startVol + (targetVol - startVol) * progress;
                if (progress < 1) {
                    fadeAnimId = requestAnimationFrame(step);
                } else {
                    audioEl.volume = targetVol;
                    if (onComplete) onComplete();
                }
            };
            fadeAnimId = requestAnimationFrame(step);
        },

        stopAllAudio: function() {
            if (bgmAudio) {
                bgmAudio.pause();
                bgmAudio.currentTime = 0;
            }
            if (currentQuoteAudio) {
                currentQuoteAudio.pause();
                currentQuoteAudio.currentTime = 0;
            }
            if (fadeAnimId) {
                cancelAnimationFrame(fadeAnimId);
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
