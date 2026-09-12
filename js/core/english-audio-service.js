/**
 * EnglishAudioService — Dịch vụ phát âm thanh Tiếng Anh thống nhất với Chính sách Âm thanh Phân cấp
 * 
 * CHÍNH SÁCH ÂM THANH (AUDIO POLICY):
 * 1. CURRICULUM = CACHE_ONLY (Vocabulary, Sentences, Listening, Speaking Prompts, Reading, Exam)
 *    - Bắt buộc phát bằng Kokoro TTS Offline Cache (sounds/english/*.mp3).
 *    - NẾU Cache Miss: TUYỆT ĐỐI KHÔNG FALLBACK SANG SpeechSynthesis / Trình duyệt.
 *    - Trả về trạng thái lỗi có kiểm soát { ok: false, source: "NONE", reason: "AUDIO_CACHE_MISSING" }.
 *    - Cập nhật nhãn UI thân thiện, không crash giao diện.
 * 
 * 2. DYNAMIC = FALLBACK_ALLOWED (AI conversation, Random Praise Quotes, Dynamic Practice)
 *    - Ưu tiên Kokoro TTS Cache nếu có sẵn.
 *    - NẾU Cache Miss và allowFallback = true: Cho phép chuyển sang SpeechService / Web Speech API.
 * 
 * Hỗ trợ Chế độ Gỡ lỗi (Debug Mode):
 * - window.__ENGLISH_AUDIO_DEBUG__ = true
 *   Log chuẩn hóa: [AUDIO] feature=... text="..." source=... fallback=... reason=...
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
    let initPromise = null;
    let currentSourceLabel = 'Khởi tạo';
    let currentActiveAudio = null;

    // Cache các Audio elements để tái sử dụng, tránh memory leak
    const audioPool = new Map();
    const MAX_POOL_SIZE = 100;

    const AUDIO_POLICY = {
        CURRICULUM: 'CACHE_ONLY',
        DYNAMIC: 'FALLBACK_ALLOWED'
    };

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

    /**
     * Ghi log gỡ lỗi có kiểm soát
     */
    function logDebug(feature, source, fallback, reason, text, file) {
        const isDebug = (typeof window !== 'undefined' && window.__ENGLISH_AUDIO_DEBUG__) ||
                        (typeof globalThis !== 'undefined' && globalThis.__ENGLISH_AUDIO_DEBUG__);
        if (!isDebug) return;

        const shortText = (text || '').length > 60 ? (text.substring(0, 57) + '...') : (text || '');
        let msg = `[AUDIO] feature=${feature || 'UNKNOWN'} source=${source} fallback=${fallback}`;
        if (reason) msg += ` reason=${reason}`;
        if (file) msg += ` file=${file}`;
        msg += ` text="${shortText}"`;
        console.log(msg);
    }

    const EnglishAudioService = {
        AUDIO_POLICY: AUDIO_POLICY,

        /**
         * Nạp audio-manifest.json
         */
        init: function (manifestData) {
            if (manifestData && typeof manifestData === 'object') {
                manifest = manifestData;
                manifestLoaded = true;
                return Promise.resolve(true);
            }
            if (manifestLoaded && manifest && Object.keys(manifest).length > 0) {
                return Promise.resolve(true);
            }
            if (initPromise) return initPromise;

            initPromise = (async () => {
                if (typeof fetch === 'function') {
                    const candidateUrls = ['sounds/english/audio-manifest.json', '/sounds/english/audio-manifest.json'];
                    for (const u of candidateUrls) {
                        try {
                            const response = await fetch(u, { cache: 'no-cache' });
                            if (response.ok) {
                                manifest = await response.json();
                                manifestLoaded = true;
                                logDebug('INIT', 'KOKORO_MANIFEST', false, null, `Loaded ${Object.keys(manifest).length} items from ${u}`);
                                return true;
                            }
                        } catch (e) {}
                    }
                } else if (typeof require === 'function') {
                    try {
                        const fs = require('fs');
                        const path = require('path');
                        const p = path.resolve(__dirname, '../../sounds/english/audio-manifest.json');
                        if (fs.existsSync(p)) {
                            manifest = JSON.parse(fs.readFileSync(p, 'utf8'));
                            manifestLoaded = true;
                            return true;
                        }
                    } catch(e) {}
                }
                manifestLoaded = true;
                return false;
            })();

            return initPromise;
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

        /**
         * Tra cứu đa chiều Canonical ID & Aliases từ Manifest
         * @returns {{ found: boolean, canonicalId: string|null, entry: Object|null, filename: string|null, url: string|null }}
         */
        resolveAudio: function (text, audioFileKey) {
            if (!manifest) return { found: false, canonicalId: null, entry: null, filename: null, url: null };

            const cleanKey = sanitizeAudioKey(audioFileKey || '');
            const cleanText = sanitizeAudioKey(text || '');
            const rawKey = (audioFileKey || '').trim();

            let entry = null;
            let canonicalId = null;

            // 1. Kiểm tra trong _items theo canonical ID trực tiếp
            if (manifest._items) {
                if (rawKey && manifest._items[rawKey]) {
                    canonicalId = rawKey;
                    entry = manifest._items[rawKey];
                } else if (cleanKey && manifest._items[cleanKey.toUpperCase()]) {
                    canonicalId = cleanKey.toUpperCase();
                    entry = manifest._items[canonicalId];
                }
            }

            // 2. Kiểm tra trong _aliases
            if (!entry && manifest._aliases) {
                const targetCid = (cleanKey && manifest._aliases[cleanKey]) || (cleanText && manifest._aliases[cleanText]);
                if (targetCid && manifest._items && manifest._items[targetCid]) {
                    canonicalId = targetCid;
                    entry = manifest._items[targetCid];
                }
            }

            // 3. Kiểm tra root level (backward compatibility)
            if (!entry) {
                if (rawKey && manifest[rawKey]) {
                    entry = manifest[rawKey];
                    canonicalId = entry.id || rawKey;
                } else if (cleanKey && manifest[cleanKey]) {
                    entry = manifest[cleanKey];
                    canonicalId = entry.id || cleanKey;
                } else if (cleanText && manifest[cleanText]) {
                    entry = manifest[cleanText];
                    canonicalId = entry.id || cleanText;
                }
            }

            if (entry) {
                const fn = entry.filename || entry.file || (entry.id ? `${entry.id.toLowerCase()}.mp3` : `${cleanKey || cleanText}.mp3`);
                return {
                    found: true,
                    canonicalId: canonicalId || (entry.id || null),
                    entry: entry,
                    filename: fn,
                    url: `sounds/english/${fn}`
                };
            }

            // Fallback giả định đường dẫn nếu không có manifest
            const fallbackFn = cleanKey ? `${cleanKey}.mp3` : (cleanText ? `${cleanText}.mp3` : '');
            return {
                found: false,
                canonicalId: null,
                entry: null,
                filename: fallbackFn || null,
                url: fallbackFn ? `sounds/english/${fallbackFn}` : null
            };
        },

        isVoiceCached: function (text, audioFileKey) {
            const res = this.resolveAudio(text, audioFileKey);
            return res.found;
        },

        getAudioSourceLabel: function () {
            return currentSourceLabel;
        },

        /**
         * Cập nhật nhãn nguồn âm thanh trên UI
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
         * Phát giọng đọc tổng hợp Web Speech (CHỈ DÀNH RIÊNG CHO DYNAMIC AUDIO KHI allowFallback=true)
         */
        speakEnglish: function (text, isFallback = false, options = {}) {
            if (!text || typeof text !== 'string') return;
            const opts = options || {};
            const feature = opts.feature || 'DYNAMIC';

            // Bảo vệ nghiêm ngặt: Nếu là CURRICULUM hoặc allowFallback !== true -> CẤM gọi
            if (opts.category === 'CURRICULUM' || (!isFallback && opts.allowFallback !== true)) {
                logDebug(feature, 'NONE', false, 'CURRICULUM_BLOCKED_FROM_TTS', text);
                this.updateAudioSourceLabel("Thiếu bộ nhớ đệm (CACHE_ONLY)");
                if (typeof opts.onError === 'function') {
                    opts.onError({
                        ok: false,
                        source: "NONE",
                        reason: "CURRICULUM_BLOCKED_FROM_TTS",
                        message: "Curriculum Audio bị cấm phát qua Browser TTS"
                    });
                }
                return;
            }

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
                        this._fallbackNativeSpeech(text, opts);
                    },
                    onUnsupported: () => {
                        this._fallbackNativeSpeech(text, opts);
                    }
                });
                return;
            }

            this._fallbackNativeSpeech(text, opts);
        },

        _fallbackNativeSpeech: function (text, options = {}) {
            const opts = options || {};
            const synth = (typeof window !== 'undefined' && window.speechSynthesis) ||
                          (typeof globalThis !== 'undefined' && globalThis.speechSynthesis);

            if (!synth) {
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
         * Phương thức phát âm thanh chính tuân thủ AUDIO POLICY nghiêm ngặt
         * 
         * @param {string} text - Nội dung câu/từ
         * @param {string} [audioFileKey] - Khóa âm thanh hoặc Canonical ID
         * @param {Object} [options] - Cấu hình phát âm
         * @param {string} [options.category='CURRICULUM'] - 'CURRICULUM' hoặc 'DYNAMIC'
         * @param {string} [options.feature='UNKNOWN'] - 'VOCABULARY', 'LISTENING', 'READING', 'SPEAKING', 'EXAM'
         * @param {boolean} [options.allowFallback=false] - Chỉ cho phép fallback sang TTS nếu true VÀ category là DYNAMIC
         * @returns {Promise<Object>} Kết quả phát âm
         */
        playEnglishVoice: async function (text, audioFileKey, options = {}) {
            if (!text || typeof text !== 'string') {
                return { ok: false, source: "NONE", reason: "EMPTY_TEXT" };
            }

            // Đảm bảo manifest đã nạp xong trước khi tra cứu
            if (!manifestLoaded || !manifest || Object.keys(manifest).length === 0) {
                await this.init();
            }

            return new Promise((resolve) => {

                const opts = options || {};
                const feature = opts.feature || 'CURRICULUM_AUDIO';
                // Mặc định là CURRICULUM trừ khi khai báo rõ DYNAMIC
                const isDynamic = opts.category === 'DYNAMIC' && opts.allowFallback === true;
                const policy = isDynamic ? AUDIO_POLICY.DYNAMIC : AUDIO_POLICY.CURRICULUM;

                this.stopAll();

                // Tra cứu Manifest
                const resolved = this.resolveAudio(text, audioFileKey);
                const audioUrl = resolved.url;

                const AudioClass = (typeof window !== 'undefined' && window.Audio) ||
                                   (typeof globalThis !== 'undefined' && globalThis.Audio) ||
                                   (typeof Audio !== 'undefined' && Audio);

                // NẾU CACHE MISS TRONG MANIFEST (và không phải môi trường có thể có file)
                // và policy là CACHE_ONLY
                if (!resolved.found && policy === AUDIO_POLICY.CURRICULUM) {
                    logDebug(feature, 'NONE', false, 'CACHE_MISS', text);
                    this.updateAudioSourceLabel("Chưa có bộ nhớ đệm (CACHE_ONLY)");
                    const result = {
                        ok: false,
                        source: "NONE",
                        reason: "AUDIO_CACHE_MISSING",
                        category: "CURRICULUM",
                        feature: feature,
                        audioKey: audioFileKey || sanitizeAudioKey(text),
                        canonicalId: null,
                        message: "Tệp âm thanh giáo trình chưa được lưu trong bộ nhớ đệm"
                    };
                    if (typeof opts.onError === 'function') opts.onError(result);
                    resolve(result);
                    return;
                }

                if (!AudioClass) {
                    // Môi trường không hỗ trợ Audio element
                    if (policy === AUDIO_POLICY.CURRICULUM) {
                        logDebug(feature, 'NONE', false, 'NO_AUDIO_ELEMENT', text);
                        resolve({ ok: false, source: "NONE", reason: "NO_AUDIO_ELEMENT", category: "CURRICULUM" });
                        return;
                    }
                    this.speakEnglish(text, true, opts);
                    resolve({ ok: true, source: 'SpeechService', fallback: true });
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
                                // Tầng 1: Kokoro TTS thành công
                                logDebug(feature, 'KOKORO_CACHE', false, null, text, audioUrl);
                                this.updateAudioSourceLabel("Kokoro TTS (Offline Cache)");
                                if (typeof opts.onStart === 'function') opts.onStart("Kokoro TTS (Offline Cache)", audio);

                                audio.onended = () => {
                                    currentActiveAudio = null;
                                    if (typeof opts.onEnd === 'function') opts.onEnd();
                                };

                                resolve({
                                    ok: true,
                                    status: 'playing',
                                    source: 'Kokoro TTS (Offline Cache)',
                                    canonicalId: resolved.canonicalId,
                                    audio: audio
                                });
                            })
                            .catch((playErr) => {
                                currentActiveAudio = null;

                                // NẾU LÀ CURRICULUM: TUYỆT ĐỐI KHÔNG FALLBACK SANG TTS
                                if (policy === AUDIO_POLICY.CURRICULUM) {
                                    logDebug(feature, 'NONE', false, 'PLAYBACK_REJECTED', text, audioUrl);
                                    this.updateAudioSourceLabel("Lỗi phát tệp đệm (CACHE_ONLY)");
                                    const failure = {
                                        ok: false,
                                        source: "NONE",
                                        reason: "AUDIO_PLAYBACK_ERROR",
                                        category: "CURRICULUM",
                                        feature: feature,
                                        audioUrl: audioUrl,
                                        error: playErr.message
                                    };
                                    if (typeof opts.onError === 'function') opts.onError(failure);
                                    resolve(failure);
                                    return;
                                }

                                // DYNAMIC: Cho phép fallback
                                logDebug(feature, 'SpeechService', true, 'PLAYBACK_REJECTED', text, audioUrl);
                                this.speakEnglish(text, true, {
                                    ...opts,
                                    onEnd: () => {
                                        if (typeof opts.onEnd === 'function') opts.onEnd();
                                    }
                                });
                                resolve({ ok: true, status: 'fallback', source: 'SpeechService', fallback: true });
                            });
                    } else {
                        logDebug(feature, 'KOKORO_CACHE', false, null, text, audioUrl);
                        this.updateAudioSourceLabel("Kokoro TTS (Offline Cache)");
                        resolve({ ok: true, status: 'playing', source: 'Kokoro TTS (Offline Cache)', canonicalId: resolved.canonicalId });
                    }
                } catch (e) {
                    currentActiveAudio = null;
                    if (policy === AUDIO_POLICY.CURRICULUM) {
                        logDebug(feature, 'NONE', false, 'AUDIO_EXCEPTION', text, audioUrl);
                        resolve({ ok: false, source: "NONE", reason: "AUDIO_EXCEPTION", category: "CURRICULUM", error: e.message });
                        return;
                    }
                    this.speakEnglish(text, true, opts);
                    resolve({ ok: true, status: 'fallback', source: 'SpeechService', fallback: true });
                }
            });
        },
        enableDebug: function (enabled) {
            if (typeof window !== 'undefined') window.__ENGLISH_AUDIO_DEBUG__ = !!enabled;
            if (typeof globalThis !== 'undefined') globalThis.__ENGLISH_AUDIO_DEBUG__ = !!enabled;
        }
    };

    // Tự động khởi tạo nạp manifest ngầm ngay khi script sẵn sàng
    if (typeof window !== 'undefined' || typeof globalThis !== 'undefined') {
        try {
            EnglishAudioService.init();
        } catch (e) {}
    }

    return EnglishAudioService;
});
