/**
 * EnglishAudioService — Dịch vụ phát âm thanh Tiếng Anh thống nhất với kiến trúc Fallback 4 tầng
 * 
 * Kiến trúc Fallback 4 tầng:
 * Tầng 1: Kokoro TTS Cached Audio (sounds/english/${key}.mp3 - Offline-first, chất lượng phòng thu)
 * Tầng 2: Local SpeechService (js/core/speech-service.js - Tối ưu hóa chọn voice và rate)
 * Tầng 3: Browser Web Speech API (window.speechSynthesis trực tiếp)
 * Tầng 4: Graceful Degradation (Báo lỗi thân thiện, không crash giao diện, không unhandled rejection)
 * 
 * Public Contract:
 * - init(): Promise<boolean>
 * - playEnglishVoice(text: string, audioFileKey?: string, options?: Object): Promise<void>
 * - speakEnglish(text: string, isFallback?: boolean, options?: Object): void
 * - stopAll(): void
 * - getAudioSourceLabel(): string
 * - updateAudioSourceLabel(label: string): void
 * - isVoiceCached(text: string, audioFileKey?: string): boolean
 * - getManifest(): Object
 * - setManifest(manifest: Object): void
 */
(function (root, factory) {
    const speechServiceDep = root.SpeechService || (typeof require === 'function' ? (function () { try { return require('./speech-service'); } catch (e) { return null; } })() : null);
    const api = factory(speechServiceDep);

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.EnglishAudioService = api;
    if (typeof window !== 'undefined') {
        window.EnglishAudioService = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.EnglishAudioService = api;
    }
    if (typeof self !== 'undefined') {
        self.EnglishAudioService = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function (SpeechService) {
    'use strict';

    let manifest = {};
    let manifestLoaded = false;
    let currentSourceLabel = 'Khởi tạo';
    let currentActiveAudio = null;

    // Cache các Audio elements để tái sử dụng, tránh leak memory
    const audioPool = new Map();
    const MAX_POOL_SIZE = 50;

    /**
     * Chuẩn hóa audio key an toàn từ text hoặc key tùy chỉnh
     */
    function sanitizeAudioKey(textOrKey) {
        if (!textOrKey || typeof textOrKey !== 'string') return '';
        return textOrKey
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '_')
            .replace(/[^a-z0-9_]/g, '');
    }

    const EnglishAudioService = {
        /**
         * Nạp audio-manifest.json
         */
        init: async function (manifestData) {
            if (manifestData && typeof manifestData === 'object') {
                manifest = manifestData;
                manifestLoaded = true;
                return true;
            }

            if (typeof fetch === 'function') {
                try {
                    const response = await fetch('sounds/english/audio-manifest.json', { cache: 'no-cache' });
                    if (response.ok) {
                        manifest = await response.json();
                        manifestLoaded = true;
                        return true;
                    }
                } catch (e) {
                    // Chạy offline hoặc manifest chưa tạo
                }
            }
            manifestLoaded = true;
            return false;
        },

        getManifest: function () {
            return manifest;
        },

        setManifest: function (newManifest) {
            if (newManifest && typeof newManifest === 'object') {
                manifest = newManifest;
                manifestLoaded = true;
            }
        },

        isVoiceCached: function (text, audioFileKey) {
            const key = sanitizeAudioKey(audioFileKey || text);
            if (!key) return false;
            if (manifest && manifest[key]) return true;
            return false;
        },

        getAudioSourceLabel: function () {
            return currentSourceLabel;
        },

        /**
         * Cập nhật nhãn nguồn âm thanh trên UI (Duolingo & IOE)
         */
        updateAudioSourceLabel: function (sourceName) {
            currentSourceLabel = sourceName;
            const displayText = `🔊 Nguồn âm thanh: ${sourceName}`;

            if (typeof document !== 'undefined') {
                const labelDuolingo = document.getElementById("english-audio-source-label");
                const labelIoe = document.getElementById("ioe-audio-source-label");
                if (labelDuolingo) labelDuolingo.innerText = displayText;
                if (labelIoe) labelIoe.innerText = displayText;
            }
        },

        /**
         * Dừng toàn bộ âm thanh đang phát
         */
        stopAll: function () {
            if (currentActiveAudio) {
                try {
                    currentActiveAudio.pause();
                    currentActiveAudio.currentTime = 0;
                } catch (e) {}
                currentActiveAudio = null;
            }

            if (SpeechService && typeof SpeechService.cancel === 'function') {
                SpeechService.cancel();
            } else if (typeof window !== 'undefined' && window.speechSynthesis) {
                try { window.speechSynthesis.cancel(); } catch (e) {}
            }
        },

        /**
         * Tầng 2-4: Phát qua SpeechService hoặc Web Speech Fallback
         */
        speakEnglish: function (text, isFallback = false, options = {}) {
            if (!text || typeof text !== 'string') return;

            const opts = options || {};

            // Tầng 2: Sử dụng SpeechService chuyên biệt
            if (SpeechService && typeof SpeechService.speakEnglish === 'function') {
                SpeechService.speakEnglish(text, isFallback, {
                    onStart: (sourceLabel) => {
                        this.updateAudioSourceLabel(sourceLabel || "SpeechService (Giọng máy tính)");
                        if (typeof opts.onStart === 'function') opts.onStart(sourceLabel);
                    },
                    onEnd: () => {
                        if (typeof opts.onEnd === 'function') opts.onEnd();
                    },
                    onError: (err) => {
                        // Tầng 3: Web Speech API cơ bản trực tiếp
                        this._fallbackNativeSpeech(text, opts);
                    },
                    onUnsupported: () => {
                        this._fallbackNativeSpeech(text, opts);
                    }
                });
                return;
            }

            // Tầng 3: Fallback native nếu không có SpeechService module
            this._fallbackNativeSpeech(text, opts);
        },

        /**
         * Tầng 3 & 4: Native SpeechSynthesis & Graceful Degradation
         */
        _fallbackNativeSpeech: function (text, options = {}) {
            const opts = options || {};
            const synth = (typeof window !== 'undefined' && window.speechSynthesis) ||
                          (typeof globalThis !== 'undefined' && globalThis.speechSynthesis);

            if (!synth) {
                // Tầng 4: Không hỗ trợ
                this.updateAudioSourceLabel("Không hỗ trợ phát âm");
                if (typeof opts.onUnsupported === 'function') opts.onUnsupported();
                return;
            }

            try {
                synth.cancel();
                const UtteranceClass = (typeof window !== 'undefined' && window.SpeechSynthesisUtterance) ||
                                       (typeof globalThis !== 'undefined' && globalThis.SpeechSynthesisUtterance);
                if (!UtteranceClass) {
                    this.updateAudioSourceLabel("Không hỗ trợ phát âm");
                    return;
                }

                const utterance = new UtteranceClass(text);
                utterance.lang = 'en-US';
                utterance.rate = 0.9;

                utterance.onstart = () => {
                    this.updateAudioSourceLabel("Trình duyệt dự phòng");
                    if (typeof opts.onStart === 'function') opts.onStart("Trình duyệt dự phòng");
                };
                utterance.onend = () => {
                    if (typeof opts.onEnd === 'function') opts.onEnd();
                };
                utterance.onerror = (e) => {
                    // Tầng 4: Báo lỗi an toàn
                    this.updateAudioSourceLabel("Lỗi phát âm thanh");
                    if (typeof opts.onError === 'function') opts.onError(e);
                };

                synth.speak(utterance);
            } catch (e) {
                this.updateAudioSourceLabel("Lỗi phát âm thanh");
                if (typeof opts.onError === 'function') opts.onError(e);
            }
        },

        /**
         * Phương thức phát âm chính với 4-Tier Fallback
         * Tầng 1: Kokoro Cached Audio
         * Tầng 2: SpeechService
         * Tầng 3: Browser SpeechSynthesis
         * Tầng 4: Graceful Degradation
         */
        playEnglishVoice: function (text, audioFileKey, options = {}) {
            return new Promise((resolve) => {
                if (!text || typeof text !== 'string') {
                    resolve();
                    return;
                }

                const opts = options || {};
                const cleanKey = sanitizeAudioKey(audioFileKey || text);
                const audioUrl = `sounds/english/${cleanKey}.mp3`;

                // Dừng âm thanh trước đó
                this.stopAll();

                // Kiểm tra xem Audio constructor có tồn tại không
                const AudioClass = (typeof window !== 'undefined' && window.Audio) ||
                                   (typeof globalThis !== 'undefined' && globalThis.Audio) ||
                                   (typeof Audio !== 'undefined' && Audio);

                if (!AudioClass) {
                    // Môi trường không có Audio element -> sang Tầng 2
                    this.speakEnglish(text, true, opts);
                    resolve();
                    return;
                }

                try {
                    let audio = audioPool.get(audioUrl);
                    if (!audio) {
                        audio = new AudioClass(audioUrl);
                        if (audioPool.size < MAX_POOL_SIZE) {
                            audioPool.set(audioUrl, audio);
                        }
                    } else {
                        audio.currentTime = 0;
                    }

                    currentActiveAudio = audio;

                    const playPromise = audio.play();

                    if (playPromise !== undefined && typeof playPromise.then === 'function') {
                        playPromise
                            .then(() => {
                                // Tầng 1 thành công
                                this.updateAudioSourceLabel("Kokoro TTS (Offline Cache)");
                                if (typeof opts.onStart === 'function') opts.onStart("Kokoro TTS (Offline Cache)");
                                audio.onended = () => {
                                    currentActiveAudio = null;
                                    if (typeof opts.onEnd === 'function') opts.onEnd();
                                };
                                resolve({ status: 'playing', source: 'Kokoro TTS (Offline Cache)' });
                            })
                            .catch((playErr) => {
                                // Tầng 1 thất bại (file 404, giải mã lỗi, autoplay chặn) -> chuyển ngay sang Tầng 2
                                currentActiveAudio = null;
                                this.speakEnglish(text, true, {
                                    ...opts,
                                    onEnd: () => {
                                        if (typeof opts.onEnd === 'function') opts.onEnd();
                                    }
                                });
                                resolve({ status: 'fallback', source: 'SpeechService' });
                            });
                    } else {
                        // Trình duyệt cũ trả về undefined
                        this.updateAudioSourceLabel("Kokoro TTS (Offline Cache)");
                        resolve({ status: 'playing', source: 'Kokoro TTS (Offline Cache)' });
                    }
                } catch (e) {
                    // Lỗi khởi tạo Audio -> chuyển ngay sang Tầng 2
                    currentActiveAudio = null;
                    this.speakEnglish(text, true, opts);
                    resolve({ status: 'fallback', source: 'SpeechService' });
                }
            });
        }
    };

    return EnglishAudioService;
});
