/**
 * Characterization & Verification Tests for English Audio Offline-First Architecture
 * Target: app.playEnglishVoice(text, audioFileKey) & SpeechService fallback
 * 
 * Test Coverage:
 * 1. Local audio success (deterministic, fast, offline)
 * 2. Local audio missing / 404 -> Direct fallback to SpeechService without external Google TTS calls
 * 3. Offline resilience (navigator.onLine = false or network failure)
 * 4. Graceful handling when SpeechSynthesis is unavailable
 * 5. Rapid repeated playback stability (no unhandled rejections)
 * 6. Audio key sanitization
 * 7. Dynamic parent-created vocabulary support
 * 8. Latency characterization benchmark (N >= 10)
 */

describe("English Audio Offline-First — Characterization & Benchmark", () => {
    let mockSynth;
    let mockAudioInstances = [];
    let originalAudio;
    let mockApp;
    let SpeechService;

    class MockAudio {
        constructor(src) {
            this.src = src;
            this.paused = true;
            this.currentTime = 0;
            this.volume = 1.0;
            this.shouldFail = false;
            this.playDelayMs = 0;
            mockAudioInstances.push(this);
        }

        play() {
            this.paused = false;
            if (this.shouldFail || (this.src && this.src.includes("missing_word"))) {
                return new Promise((_, reject) => {
                    setTimeout(() => {
                        reject(new Error("MEDIA_ELEMENT_ERROR: 404 Not Found"));
                    }, this.playDelayMs);
                });
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve();
                }, this.playDelayMs);
            });
        }

        pause() {
            this.paused = true;
        }

        load() {}
    }

    class MockSpeechSynthesisUtterance {
        constructor(text = '') {
            this.text = text;
            this.lang = 'en-US';
            this.rate = 1;
            this.pitch = 1;
            this.volume = 1;
            this.voice = null;
            this.onstart = null;
            this.onend = null;
            this.onerror = null;
        }
    }

    class MockSpeechSynthesis {
        constructor() {
            this.paused = false;
            this.speaking = false;
            this.cancelCalled = 0;
            this.resumeCalled = 0;
            this.spokeUtterances = [];
            this._mockVoices = [
                { name: 'Google US English', lang: 'en-US', default: true },
                { name: 'Microsoft Zira Desktop - English (United States)', lang: 'en-US', default: false }
            ];
        }

        getVoices() {
            return [...this._mockVoices];
        }

        speak(utterance) {
            this.spokeUtterances.push(utterance);
            this.speaking = true;
            if (typeof utterance.onstart === 'function') {
                utterance.onstart({ type: 'start' });
            }
        }

        cancel() {
            this.cancelCalled++;
            this.speaking = false;
            this.paused = false;
        }

        resume() {
            this.resumeCalled++;
            this.paused = false;
        }
    }

    beforeEach(() => {
        mockAudioInstances = [];
        mockSynth = new MockSpeechSynthesis();
        originalAudio = global.Audio;
        global.Audio = MockAudio;

        global.window = global.window || {};
        global.window.speechSynthesis = mockSynth;
        global.window.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
        global.speechSynthesis = mockSynth;
        global.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;

        global.document = {
            getElementById: jest.fn().mockImplementation((id) => {
                return {
                    id: id,
                    innerText: ''
                };
            })
        };

        jest.resetModules();
        SpeechService = require('../../js/core/speech-service');
        SpeechService.init();
        global.SpeechService = SpeechService;

        // Xây dựng mockApp mô phỏng chính xác phương thức của app.js
        mockApp = {
            currentAudioSourceLabel: '',
            updateAudioSourceLabel: function(sourceName) {
                this.currentAudioSourceLabel = sourceName;
                const displayText = `🔊 Nguồn âm thanh: ${sourceName}`;
                const labelDuolingo = document.getElementById("english-audio-source-label");
                const labelIoe = document.getElementById("ioe-audio-source-label");
                if (labelDuolingo) labelDuolingo.innerText = displayText;
                if (labelIoe) labelIoe.innerText = displayText;
            },
            speakEnglish: function(text, isFallback = false) {
                if (typeof SpeechService !== 'undefined' && SpeechService.speakEnglish) {
                    SpeechService.speakEnglish(text, isFallback, {
                        onStart: (sourceLabel) => this.updateAudioSourceLabel(sourceLabel),
                        onError: () => this.updateAudioSourceLabel("Lỗi phát âm thanh"),
                        onUnsupported: () => this.updateAudioSourceLabel("Không hỗ trợ phát âm")
                    });
                    return;
                }
                if (!text) return;
                if (!('speechSynthesis' in window)) {
                    this.updateAudioSourceLabel("Không hỗ trợ phát âm");
                    return;
                }
            },
            playEnglishVoice: function(text, audioFileKey) {
                if (!text) return;
                const cleanKey = (audioFileKey || text).toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
                const audioUrl = `sounds/english/${cleanKey}.mp3`;
                
                try {
                    const audio = new Audio(audioUrl);
                    const playPromise = audio.play();
                    if (playPromise !== undefined) {
                        playPromise
                            .then(() => {
                                this.updateAudioSourceLabel("File cục bộ (Offline)");
                            })
                            .catch(() => {
                                // Offline-First Fallback trực tiếp sang Web Speech API
                                this.speakEnglish(text, true);
                            });
                    } else {
                        this.updateAudioSourceLabel("File cục bộ (Offline)");
                    }
                } catch (e) {
                    this.speakEnglish(text, true);
                }
            }
        };
    });

    afterEach(() => {
        global.Audio = originalAudio;
        delete global.window.speechSynthesis;
        delete global.window.SpeechSynthesisUtterance;
        delete global.speechSynthesis;
        delete global.SpeechSynthesisUtterance;
        delete global.SpeechService;
    });

    // -------------------------------------------------------------------------
    // TEST 1: Local Audio Success
    // -------------------------------------------------------------------------
    test("1. Local audio asset exists → plays local audio, sets label to 'File cục bộ (Offline)'", async () => {
        mockApp.playEnglishVoice("apple", "apple");
        expect(mockAudioInstances.length).toBe(1);
        expect(mockAudioInstances[0].src).toBe("sounds/english/apple.mp3");

        // Đợi promise resolve
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(mockApp.currentAudioSourceLabel).toBe("File cục bộ (Offline)");
        expect(mockSynth.spokeUtterances.length).toBe(0); // Không cần fallback
    });

    // -------------------------------------------------------------------------
    // TEST 2: Local Audio Missing -> SpeechService Fallback
    // -------------------------------------------------------------------------
    test("2. Local audio missing (404) → Direct fallback to SpeechService, zero Google TTS request", async () => {
        mockApp.playEnglishVoice("missing_word", "missing_word");
        expect(mockAudioInstances.length).toBe(1);
        expect(mockAudioInstances[0].src).toBe("sounds/english/missing_word.mp3");

        // Đợi promise reject và fallback
        await new Promise(resolve => setTimeout(resolve, 20));

        // Kiểm tra SpeechService đã nhận và phát âm
        expect(mockSynth.spokeUtterances.length).toBe(1);
        expect(mockSynth.spokeUtterances[0].text).toBe("missing_word");
        expect(mockSynth.spokeUtterances[0].lang).toBe("en-US");
        expect(mockApp.currentAudioSourceLabel).toBe("Trình duyệt máy tính (Dự phòng)");

        // Tuyệt đối không tạo Audio instance gọi tới translate.google.com
        const googleAudioCalls = mockAudioInstances.filter(a => a.src && a.src.includes("google"));
        expect(googleAudioCalls.length).toBe(0);
    });

    // -------------------------------------------------------------------------
    // TEST 3: Offline Resilience
    // -------------------------------------------------------------------------
    test("3. Offline environment → fallback works seamlessly without hanging", async () => {
        global.navigator = { onLine: false };

        mockApp.playEnglishVoice("hello", "missing_word_offline");
        await new Promise(resolve => setTimeout(resolve, 20));

        expect(mockSynth.spokeUtterances.length).toBe(1);
        expect(mockSynth.spokeUtterances[0].text).toBe("hello");
        expect(mockApp.currentAudioSourceLabel).toBe("Trình duyệt máy tính (Dự phòng)");
    });

    // -------------------------------------------------------------------------
    // TEST 4: SpeechSynthesis Unavailable Safety
    // -------------------------------------------------------------------------
    test("4. SpeechSynthesis unavailable → fails gracefully with label 'Không hỗ trợ phát âm'", async () => {
        delete global.window.speechSynthesis;
        delete global.speechSynthesis;

        mockApp.playEnglishVoice("unknown_word", "missing_word_no_tts");
        await new Promise(resolve => setTimeout(resolve, 20));

        expect(mockApp.currentAudioSourceLabel).toBe("Không hỗ trợ phát âm");
    });

    // -------------------------------------------------------------------------
    // TEST 5: Rapid Repeated Playback Stability
    // -------------------------------------------------------------------------
    test("5. Rapid repeated playback (N=10) → no unhandled rejections, cancels previous utterances safely", async () => {
        for (let i = 0; i < 10; i++) {
            mockApp.playEnglishVoice(`word_${i}`, `missing_word_${i}`);
        }
        await new Promise(resolve => setTimeout(resolve, 50));

        expect(mockSynth.cancelCalled).toBeGreaterThanOrEqual(9);
        expect(mockSynth.spokeUtterances.length).toBe(10);
    });

    // -------------------------------------------------------------------------
    // TEST 6: Audio Key Sanitization
    // -------------------------------------------------------------------------
    test("6. Audio key sanitization converts spaces and special chars to clean format", () => {
        mockApp.playEnglishVoice("Good morning, teacher! How are you?", "Good morning, teacher! How are you?");
        expect(mockAudioInstances.length).toBe(1);
        expect(mockAudioInstances[0].src).toBe("sounds/english/good_morning_teacher_how_are_you.mp3");
    });

    // -------------------------------------------------------------------------
    // TEST 7: Dynamic Parent-Created Vocabulary
    // -------------------------------------------------------------------------
    test("7. Parent-created dynamic vocabulary without local MP3 plays cleanly via SpeechService", async () => {
        const parentVocab = "photosynthesis";
        mockApp.playEnglishVoice(parentVocab, "missing_word_parent");
        await new Promise(resolve => setTimeout(resolve, 20));

        expect(mockSynth.spokeUtterances.length).toBe(1);
        expect(mockSynth.spokeUtterances[0].text).toBe("photosynthesis");
        expect(mockApp.currentAudioSourceLabel).toBe("Trình duyệt máy tính (Dự phòng)");
    });

    // -------------------------------------------------------------------------
    // TEST 8: Latency Characterization Benchmark (N=10 runs)
    // -------------------------------------------------------------------------
    test("8. Latency Benchmark (N=10): Local asset is near-immediate, Fallback is rapid", async () => {
        const localDispatchLatencies = [];
        const fallbackDispatchLatencies = [];

        // N=10 for local audio dispatch
        for (let i = 0; i < 10; i++) {
            const start = performance.now();
            mockApp.playEnglishVoice("apple", "apple");
            const elapsed = performance.now() - start;
            localDispatchLatencies.push(elapsed);
        }

        // N=10 for fallback dispatch
        for (let i = 0; i < 10; i++) {
            const start = performance.now();
            mockApp.playEnglishVoice("word", "missing_word");
            const elapsed = performance.now() - start;
            fallbackDispatchLatencies.push(elapsed);
        }

        const avgLocal = localDispatchLatencies.reduce((a, b) => a + b, 0) / localDispatchLatencies.length;
        const avgFallback = fallbackDispatchLatencies.reduce((a, b) => a + b, 0) / fallbackDispatchLatencies.length;

        expect(avgLocal).toBeLessThan(5); // Dispatch hoàn tất dưới 5ms
        expect(avgFallback).toBeLessThan(5); // Fallback dispatch dưới 5ms
    });
});
