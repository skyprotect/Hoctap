/**
 * SpeechService — Quản lý tổng hợp giọng đọc Text-to-Speech (Web Speech API).
 * Hỗ trợ chọn giọng đọc chuẩn theo locale (en-US, vi-VN), nạp trước danh sách voices,
 * tự động khôi phục trạng thái paused, đồng bộ chế độ đọc nối từ Read-Along và ngắt âm an toàn.
 * 
 * Public Contract:
 * - voices: SpeechSynthesisVoice[]
 * - isInitialized: boolean
 * - init(): void
 * - isSupported(): boolean
 * - getVoices(): SpeechSynthesisVoice[]
 * - getPreferredVoice(lang: string): SpeechSynthesisVoice | null
 * - speakEnglish(text: string, isFallback?: boolean, options?: object): void
 * - speakText(text: string, lang?: string, options?: object): void
 * - stopSpeech(): void
 * - cancel(): void
 * - playReadAlong(passageText: string, containerId: string, options?: object): void
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.SpeechService = api;
    if (typeof window !== 'undefined') {
        window.SpeechService = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.SpeechService = api;
    }
    if (typeof self !== 'undefined') {
        self.SpeechService = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const SpeechService = {
        voices: [],
        isInitialized: false,

        /**
         * Kiểm tra trình duyệt có hỗ trợ Web Speech Synthesis hay không
         */
        isSupported: function() {
            const win = typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : null);
            return !!(win && win.speechSynthesis && (win.SpeechSynthesisUtterance || typeof win.SpeechSynthesisUtterance !== 'undefined'));
        },

        /**
         * Lấy instance speechSynthesis hiện tại
         */
        getSynth: function() {
            if (typeof window !== 'undefined' && window.speechSynthesis) return window.speechSynthesis;
            if (typeof globalThis !== 'undefined' && globalThis.speechSynthesis) return globalThis.speechSynthesis;
            return null;
        },

        /**
         * Khởi tạo và đăng ký lắng nghe sự kiện nạp giọng đọc
         */
        init: function() {
            const synth = this.getSynth();
            if (!synth) return;

            const updateVoices = () => {
                try {
                    const loadedVoices = synth.getVoices() || [];
                    this.voices = loadedVoices;
                    if (typeof window !== 'undefined') {
                        window._speechVoices = loadedVoices;
                    }
                } catch (e) {}
            };

            updateVoices();
            if (typeof synth.onvoiceschanged !== 'undefined' || 'onvoiceschanged' in synth) {
                synth.onvoiceschanged = updateVoices;
            }
            this.isInitialized = true;
        },

        /**
         * Trả về danh sách giọng đọc hiện có trong hệ thống
         */
        getVoices: function() {
            const synth = this.getSynth();
            if (!synth) return [];
            const loaded = synth.getVoices() || [];
            if (loaded.length > 0) {
                this.voices = loaded;
                if (typeof window !== 'undefined') {
                    window._speechVoices = loaded;
                }
            }
            return this.voices;
        },

        /**
         * Tìm kiếm giọng đọc tốt nhất theo ngôn ngữ/locale chỉ định
         */
        getPreferredVoice: function(lang) {
            const voices = this.getVoices();
            if (!voices || voices.length === 0) return null;

            const targetLang = (lang || 'en-US').toLowerCase();

            if (targetLang.startsWith('en')) {
                // Ưu tiên giọng tiếng Anh chất lượng cao
                const preferredVoice = voices.find(v => (v.lang || '').toLowerCase().startsWith('en') && (
                    (v.name || '').includes('Google') ||
                    (v.name || '').includes('US') ||
                    (v.name || '').includes('Natural') ||
                    (v.name || '').includes('Samantha') ||
                    (v.name || '').includes('Zira')
                )) || voices.find(v => (v.lang || '').toLowerCase().startsWith('en'));

                return preferredVoice || voices[0] || null;
            }

            if (targetLang.startsWith('vi')) {
                // Ưu tiên giọng tiếng Việt
                const preferredVoice = voices.find(v => (v.lang || '').toLowerCase().startsWith('vi') && (
                    (v.name || '').includes('Google') ||
                    (v.name || '').includes('Natural') ||
                    (v.name || '').includes('Northern') ||
                    (v.name || '').includes('Southern') ||
                    (v.name || '').includes('Mai') ||
                    (v.name || '').includes('Nam')
                )) || voices.find(v => (v.lang || '').toLowerCase().startsWith('vi'));

                return preferredVoice || voices[0] || null;
            }

            // Mặc định tìm theo tiền tố mã ngôn ngữ
            const matched = voices.find(v => (v.lang || '').toLowerCase().startsWith(targetLang.split('-')[0]));
            return matched || voices[0] || null;
        },

        /**
         * Phát âm Tiếng Anh chuẩn (en-US) offline sử dụng SpeechSynthesis
         * @param {string} text - Nội dung câu/từ cần phát âm
         * @param {boolean} isFallback - Cờ báo chế độ dự phòng
         * @param {object} options - Cấu hình mở rộng: { onStart, onError, onEnd, onUnsupported, rate, pitch, volume }
         */
        speakEnglish: function(text, isFallback = false, options = {}) {
            if (!text) return;

            const synth = this.getSynth();
            const UtteranceClass = (typeof window !== 'undefined' && window.SpeechSynthesisUtterance) ||
                                   (typeof globalThis !== 'undefined' && globalThis.SpeechSynthesisUtterance) || null;

            if (!synth || !UtteranceClass) {
                if (typeof options.onUnsupported === 'function') {
                    options.onUnsupported();
                }
                return;
            }

            try {
                if (synth.paused) synth.resume();
                synth.cancel();

                const utterance = new UtteranceClass(text.toString());
                utterance.lang = 'en-US';
                utterance.rate = options.rate !== undefined ? options.rate : 0.90;
                if (options.pitch !== undefined) utterance.pitch = options.pitch;
                if (options.volume !== undefined) utterance.volume = options.volume;

                const selectVoice = () => {
                    const preferredVoice = this.getPreferredVoice('en-US');
                    if (preferredVoice) utterance.voice = preferredVoice;
                };

                selectVoice();
                if (synth.onvoiceschanged === undefined) {
                    synth.onvoiceschanged = selectVoice;
                }

                utterance.onstart = (e) => {
                    if (typeof options.onStart === 'function') {
                        options.onStart(isFallback ? "Trình duyệt máy tính (Dự phòng)" : "Google Translate API (Chuẩn Mỹ)", e);
                    }
                };

                utterance.onerror = (e) => {
                    console.warn("[Web Speech Error]", e);
                    if (typeof options.onError === 'function') {
                        options.onError(e);
                    }
                };

                if (typeof options.onEnd === 'function') {
                    utterance.onend = options.onEnd;
                }

                synth.speak(utterance);
            } catch (e) {
                console.warn("Lỗi Web Speech API:", e);
                if (typeof options.onError === 'function') {
                    options.onError(e);
                }
            }
        },

        /**
         * Phát âm văn bản tùy chọn ngôn ngữ
         * @param {string} text - Nội dung phát âm
         * @param {string} lang - Mã ngôn ngữ ('vi-VN', 'en-US', etc.)
         * @param {object} options - Cấu hình mở rộng
         */
        speakText: function(text, lang = 'vi-VN', options = {}) {
            if (!text) return;

            const synth = this.getSynth();
            const UtteranceClass = (typeof window !== 'undefined' && window.SpeechSynthesisUtterance) ||
                                   (typeof globalThis !== 'undefined' && globalThis.SpeechSynthesisUtterance) || null;

            if (!synth || !UtteranceClass) {
                if (typeof options.onUnsupported === 'function') {
                    options.onUnsupported();
                }
                return;
            }

            try {
                if (synth.paused) synth.resume();
                synth.cancel();

                const utterance = new UtteranceClass(text.toString());
                utterance.lang = lang || 'vi-VN';
                utterance.rate = options.rate !== undefined ? options.rate : 0.90;
                if (options.pitch !== undefined) utterance.pitch = options.pitch;
                if (options.volume !== undefined) utterance.volume = options.volume;

                const preferredVoice = this.getPreferredVoice(utterance.lang);
                if (preferredVoice) utterance.voice = preferredVoice;

                if (typeof options.onStart === 'function') utterance.onstart = options.onStart;
                if (typeof options.onEnd === 'function') utterance.onend = options.onEnd;
                if (typeof options.onBoundary === 'function') utterance.onboundary = options.onBoundary;

                utterance.onerror = (e) => {
                    console.warn("[Web Speech Error]", e);
                    if (typeof options.onError === 'function') {
                        options.onError(e);
                    }
                };

                synth.speak(utterance);
            } catch (e) {
                console.warn("Lỗi Web Speech API:", e);
                if (typeof options.onError === 'function') {
                    options.onError(e);
                }
            }
        },

        /**
         * Dừng mọi giọng đọc đang phát
         */
        stopSpeech: function() {
            try {
                const synth = this.getSynth();
                if (synth) {
                    synth.cancel();
                }
            } catch (e) {}
        },

        /**
         * Alias của stopSpeech()
         */
        cancel: function() {
            this.stopSpeech();
        },

        /**
         * Chạy đồng bộ Read-Along cho Đọc hiểu
         * @param {string} passageText - Đoạn văn bản cần đọc
         * @param {string} containerId - ID phần tử HTML chứa đoạn văn
         * @param {object} options - Tùy chọn cấu hình
         */
        playReadAlong: function(passageText, containerId, options = {}) {
            if (typeof document === 'undefined') return;
            const container = document.getElementById(containerId);
            if (!container || !passageText) return;

            const words = passageText.split(/\s+/);
            container.innerHTML = words.map((w, idx) => `<span id="read-word-${idx}" class="read-along-word" style="font-size:1.4rem; transition: background 0.2s; border-radius: 4px; padding: 2px; margin-right: 4px; display:inline-block; color:var(--text-main); font-weight:600;">${w}</span>`).join("");

            const synth = this.getSynth();
            const UtteranceClass = (typeof window !== 'undefined' && window.SpeechSynthesisUtterance) ||
                                   (typeof globalThis !== 'undefined' && globalThis.SpeechSynthesisUtterance) || null;

            if (synth && UtteranceClass) {
                try {
                    if (synth.paused) synth.resume();
                    synth.cancel();

                    // Clear any existing yellow highlights
                    container.querySelectorAll('.read-along-word').forEach(el => {
                        el.style.backgroundColor = 'transparent';
                        el.style.color = 'var(--text-main)';
                    });

                    const utterance = new UtteranceClass(passageText);
                    utterance.lang = options.lang || 'en-US';
                    utterance.rate = options.rate !== undefined ? options.rate : 0.8;

                    const preferredVoice = this.getPreferredVoice(utterance.lang);
                    if (preferredVoice) utterance.voice = preferredVoice;

                    utterance.onboundary = (event) => {
                        if (event.name === 'word' || typeof event.charIndex === 'number') {
                            const charIdx = event.charIndex || 0;
                            let runningLength = 0;
                            let matchedIdx = 0;
                            for (let i = 0; i < words.length; i++) {
                                runningLength += words[i].length + 1;
                                if (runningLength > charIdx) {
                                    matchedIdx = i;
                                    break;
                                }
                            }

                            container.querySelectorAll('.read-along-word').forEach((el, idx) => {
                                if (idx === matchedIdx) {
                                    el.style.backgroundColor = '#fef08a';
                                    el.style.color = '#000000';
                                } else {
                                    el.style.backgroundColor = 'transparent';
                                    el.style.color = 'var(--text-main)';
                                }
                            });
                        }
                    };

                    utterance.onend = () => {
                        container.querySelectorAll('.read-along-word').forEach(el => {
                            el.style.backgroundColor = 'transparent';
                            el.style.color = 'var(--text-main)';
                        });
                        if (typeof options.onEnd === 'function') {
                            options.onEnd();
                        }
                    };

                    synth.speak(utterance);
                } catch (e) {
                    console.warn("Lỗi Read-Along:", e);
                }
            } else {
                let idx = 0;
                const timer = setInterval(() => {
                    if (idx > 0) {
                        const prev = document.getElementById(`read-word-${idx - 1}`);
                        if (prev) {
                            prev.style.backgroundColor = 'transparent';
                            prev.style.color = 'var(--text-main)';
                        }
                    }
                    const curr = document.getElementById(`read-word-${idx}`);
                    if (curr) {
                        curr.style.backgroundColor = '#fef08a';
                        curr.style.color = '#000000';
                        idx++;
                    } else {
                        clearInterval(timer);
                    }
                }, 400);
            }
        }
    };

    // Tự động khởi tạo khi load trong môi trường trình duyệt
    if (typeof window !== 'undefined' && window.speechSynthesis) {
        SpeechService.init();
    }

    return SpeechService;
});
