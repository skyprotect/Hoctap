/**
 * EnglishAudioService — Dịch vụ phát âm thanh Tiếng Anh thống nhất với Chính sách Âm thanh Phân cấp (v15.9)
 * 
 * CHÍNH SÁCH ÂM THANH (AUDIO POLICY):
 * 1. CURRICULUM = CACHE_ONLY (Vocabulary, Sentences, Listening, Speaking Prompts, Reading, Exam)
 *    - Bắt buộc phát bằng Kokoro TTS Offline Cache (sounds/english/*.mp3).
 *    - NẾU Cache Miss: TUYỆT ĐỐI KHÔNG FALLBACK SANG SpeechSynthesis / Trình duyệt.
 *    - Trả về trạng thái lỗi có kiểm soát { ok: false, source: "NONE", reason: "AUDIO_CACHE_MISSING" }.
 * 
 * 2. PASSIVE_LISTENING = CACHE_ONLY (Extensive Listening Stories & Dialogues)
 *    - Bắt buộc phát bằng Kokoro TTS Offline Cache (sounds/english/passive/*.mp3).
 *    - NẾU Cache Miss: TUYỆT ĐỐI KHÔNG FALLBACK SANG Browser TTS.
 *    - Trả về controlled failure an toàn.
 * 
 * 3. DYNAMIC = FALLBACK_ALLOWED (AI conversation, Random Praise Quotes, Dynamic Practice)
 *    - Ưu tiên Kokoro TTS Cache nếu có sẵn.
 *    - NẾU Cache Miss và allowFallback = true: Cho phép chuyển sang SpeechService / Web Speech API.
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
    let passiveManifest = {};
    let manifestLoaded = false;
    let initPromise = null;
    let currentSourceLabel = 'Khởi tạo';
    let currentActiveAudio = null;

    // Cache các Audio elements để tái sử dụng, tránh memory leak
    const audioPool = new Map();
    const MAX_POOL_SIZE = 100;

    const AUDIO_POLICY = {
        CURRICULUM: 'CACHE_ONLY',
        PASSIVE_LISTENING: 'CACHE_ONLY',
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
         * Nạp audio-manifest.json và passive-listening-manifest.json
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
                // 1. Nạp qua fetch (Browser)
                if (typeof fetch === 'function') {
                    const candidateUrls = ['sounds/english/audio-manifest.json', '/sounds/english/audio-manifest.json'];
                    for (const u of candidateUrls) {
                        try {
                            const response = await fetch(u, { cache: 'no-cache' });
                            if (response.ok) {
                                manifest = await response.json();
                                manifestLoaded = true;
                                logDebug('INIT', 'KOKORO_MANIFEST', false, null, `Loaded ${Object.keys(manifest).length} items from ${u}`);
                                break;
                            }
                        } catch (e) {}
                    }

                    // Nạp thêm passive manifest nếu có
                    try {
                        const pRes = await fetch('sounds/english/passive-listening-manifest.json?v=15.9');
                        if (pRes.ok) {
                            passiveManifest = await pRes.json();
                        }
                    } catch (e) {}
                }

                // 2. Nạp qua require/fs (Node.js)
                if (!manifestLoaded && typeof require === 'function') {
                    try {
                        const fs = require('fs');
                        const path = require('path');
                        const p = path.resolve(__dirname, '../../sounds/english/audio-manifest.json');
                        if (fs.existsSync(p)) {
                            manifest = JSON.parse(fs.readFileSync(p, 'utf8'));
                            manifestLoaded = true;
                            logDebug('INIT', 'KOKORO_MANIFEST', false, null, `Loaded ${Object.keys(manifest).length} items from fs`);
                        }
                        const pPassive = path.resolve(__dirname, '../../sounds/english/passive-listening-manifest.json');
                        if (fs.existsSync(pPassive)) {
                            passiveManifest = JSON.parse(fs.readFileSync(pPassive, 'utf8'));
                        }
                    } catch(e) {}
                }
                manifestLoaded = true;
                return true;
            })();

            return initPromise;
        },

        getManifest: function () {
            return manifest;
        },

        getPassiveManifest: function () {
            return passiveManifest;
        },

        setManifest: function (newManifest) {
            if (newManifest && typeof newManifest === 'object') {
                manifest = newManifest;
                manifestLoaded = true;
            }
        },

        /**
         * Tra cứu đa chiều Canonical ID & Aliases từ Manifest (Curriculum & Passive)
         */
        resolveAudio: function (text, audioFileKey) {
            const rawKey = (audioFileKey || '').trim();
            const rawKeyNoExt = rawKey.replace(/\.mp3$/i, '').trim();
            const cleanKey = sanitizeAudioKey(rawKeyNoExt || audioFileKey || '');
            const cleanText = sanitizeAudioKey(text || '');

            // 0. Tra cứu trong PASSIVE LISTENING MANIFEST trước
            if (passiveManifest) {
                // Kiểm tra theo ID chính xác hoặc lowercase
                const upperKey = rawKey.toUpperCase();
                const lowerKey = rawKey.toLowerCase();
                const passiveItem = passiveManifest[rawKey] || passiveManifest[upperKey] || passiveManifest[lowerKey];
                if (passiveItem) {
                    const audioPath = passiveItem.audioFile || `sounds/english/passive/${passiveItem.id.toLowerCase()}.mp3`;
                    return {
                        found: true,
                        canonicalId: passiveItem.id,
                        entry: passiveItem,
                        filename: pathBasename(audioPath),
                        url: audioPath
                    };
                }
            }

            if (!manifest) return { found: false, canonicalId: null, entry: null, filename: null, url: null };

            let entry = null;
            let canonicalId = null;

            // 1. Kiểm tra trong _items theo canonical ID trực tiếp hoặc filename
            if (manifest._items) {
                if (rawKey && manifest._items[rawKey]) {
                    canonicalId = rawKey;
                    entry = manifest._items[rawKey];
                } else if (rawKeyNoExt && manifest._items[rawKeyNoExt]) {
                    canonicalId = rawKeyNoExt;
                    entry = manifest._items[rawKeyNoExt];
                } else if (cleanKey && manifest._items[cleanKey.toUpperCase()]) {
                    canonicalId = cleanKey.toUpperCase();
                    entry = manifest._items[canonicalId];
                } else if (rawKey) {
                    const foundItem = Object.values(manifest._items).find(it => it.filename === rawKey || it.filename === `${rawKeyNoExt}.mp3`);
                    if (foundItem) {
                        canonicalId = foundItem.id;
                        entry = foundItem;
                    }
                }
            }

            // 2. Kiểm tra trong _aliases
            if (!entry && manifest._aliases) {
                const targetCid = (cleanKey && manifest._aliases[cleanKey]) ||
                                  (rawKeyNoExt && manifest._aliases[rawKeyNoExt]) ||
                                  (cleanText && manifest._aliases[cleanText]);
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
                } else if (rawKeyNoExt && manifest[rawKeyNoExt]) {
                    entry = manifest[rawKeyNoExt];
                    canonicalId = entry.id || rawKeyNoExt;
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

            // Bảo vệ nghiêm ngặt: Nếu là CURRICULUM hoặc PASSIVE_LISTENING hoặc allowFallback !== true -> CẤM gọi
            if (opts.category === 'CURRICULUM' || opts.category === 'PASSIVE_LISTENING' || (!isFallback && opts.allowFallback !== true)) {
                logDebug(feature, 'NONE', false, 'CACHE_ONLY_BLOCKED_FROM_TTS', text);
                this.updateAudioSourceLabel("Thiếu bộ nhớ đệm (CACHE_ONLY)");
                if (typeof opts.onError === 'function') {
                    opts.onError({
                        ok: false,
                        source: "NONE",
                        reason: "CACHE_ONLY_BLOCKED_FROM_TTS",
                        message: "Curriculum & Passive Audio bị cấm phát qua Browser TTS"
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
                    if (typeof opts.onUnsupported === 'function') opts.onUnsupported();
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
                const isDynamic = opts.category === 'DYNAMIC' && opts.allowFallback === true;
                const isPassive = opts.category === 'PASSIVE_LISTENING';

                let policy = AUDIO_POLICY.CURRICULUM;
                if (isDynamic) policy = AUDIO_POLICY.DYNAMIC;
                else if (isPassive) policy = AUDIO_POLICY.PASSIVE_LISTENING;

                this.stopAll();

                // Tra cứu Manifest
                const resolved = this.resolveAudio(text, audioFileKey);
                const audioUrl = resolved.url;

                const AudioClass = (typeof window !== 'undefined' && window.Audio) ||
                                   (typeof globalThis !== 'undefined' && globalThis.Audio) ||
                                   (typeof Audio !== 'undefined' && Audio);

                // NẾU CACHE MISS TRONG MANIFEST và policy là CACHE_ONLY
                if (!resolved.found && (policy === AUDIO_POLICY.CURRICULUM || policy === AUDIO_POLICY.PASSIVE_LISTENING)) {
                    logDebug(feature, 'NONE', false, 'CACHE_MISS', text);
                    this.updateAudioSourceLabel("Chưa có bộ nhớ đệm (CACHE_ONLY)");
                    const result = {
                        ok: false,
                        source: "NONE",
                        reason: "AUDIO_CACHE_MISSING",
                        category: isPassive ? "PASSIVE_LISTENING" : "CURRICULUM",
                        feature: feature,
                        audioKey: audioFileKey || sanitizeAudioKey(text),
                        canonicalId: null,
                        message: "Tệp âm thanh chưa được lưu trong bộ nhớ đệm"
                    };
                    if (typeof opts.onError === 'function') opts.onError(result);
                    resolve(result);
                    return;
                }

                if (!AudioClass) {
                    if (policy === AUDIO_POLICY.CURRICULUM || policy === AUDIO_POLICY.PASSIVE_LISTENING) {
                        logDebug(feature, 'NONE', false, 'NO_AUDIO_ELEMENT', text);
                        resolve({ ok: false, source: "NONE", reason: "NO_AUDIO_ELEMENT", category: opts.category || "CURRICULUM" });
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

                                // NẾU LÀ CACHE_ONLY: TUYỆT ĐỐI KHÔNG FALLBACK SANG TTS
                                if (policy === AUDIO_POLICY.CURRICULUM || policy === AUDIO_POLICY.PASSIVE_LISTENING) {
                                    logDebug(feature, 'NONE', false, 'PLAYBACK_REJECTED', text, audioUrl);
                                    this.updateAudioSourceLabel("Lỗi phát tệp đệm (CACHE_ONLY)");
                                    const failure = {
                                        ok: false,
                                        source: "NONE",
                                        reason: "AUDIO_PLAYBACK_ERROR",
                                        category: isPassive ? "PASSIVE_LISTENING" : "CURRICULUM",
                                        feature: feature,
                                        audioUrl: audioUrl,
                                        error: playErr ? playErr.message : "Play rejected"
                                    };
                                    if (typeof opts.onError === 'function') opts.onError(failure);
                                    resolve(failure);
                                    return;
                                }

                                // Tầng 2: Dynamic fallback sang Web Speech nếu được phép
                                logDebug(feature, 'SpeechService', true, 'AUTOPLAY_OR_AUDIO_FAILED', text, audioUrl);
                                this.speakEnglish(text, true, opts);
                                resolve({ ok: true, source: 'SpeechService', fallback: true });
                            });
                    } else {
                        resolve({ ok: true, source: 'Kokoro TTS (Offline Cache)', audio: audio });
                    }
                } catch (e) {
                    currentActiveAudio = null;
                    if (policy === AUDIO_POLICY.CURRICULUM || policy === AUDIO_POLICY.PASSIVE_LISTENING) {
                        resolve({ ok: false, source: "NONE", reason: "PLAYBACK_EXCEPTION", category: opts.category || "CURRICULUM" });
                        return;
                    }
                    this.speakEnglish(text, true, opts);
                    resolve({ ok: true, source: 'SpeechService', fallback: true });
                }
            });
        }
    };

    function pathBasename(p) {
        if (!p) return '';
        const parts = p.replace(/\\/g, '/').split('/');
        return parts[parts.length - 1];
    }

    return EnglishAudioService;
});
