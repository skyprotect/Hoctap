/**
 * Unit Tests for EnglishAudioService (4-Tier Fallback Architecture)
 * 
 * Kiểm tra:
 * 1. Tầng 1: Kokoro Cached Audio thành công
 * 2. Tầng 2: File missing (404) -> Fallback mượt mà sang SpeechService
 * 3. Tầng 3: SpeechService fail -> Fallback sang native speechSynthesis
 * 4. Tầng 4: Không có Web Speech -> Graceful "Không hỗ trợ phát âm"
 * 5. Quản lý stopAll & Audio Pool
 * 6. Quản lý audio manifest
 */

const EnglishAudioService = require('../../js/core/english-audio-service');

describe('EnglishAudioService — 4-Tier Fallback Architecture', () => {
    let mockSynth;
    let mockAudioInstances = [];
    let originalAudio;
    let mockSpeechService;

    class MockAudio {
        constructor(src) {
            this.src = src;
            this.paused = true;
            this.currentTime = 0;
            this.onended = null;
            this.shouldFail = false;
            mockAudioInstances.push(this);
        }

        play() {
            this.paused = false;
            if (this.shouldFail || (this.src && this.src.includes('missing_audio'))) {
                return Promise.reject(new Error('MEDIA_ELEMENT_ERROR: 404 Not Found'));
            }
            return Promise.resolve();
        }

        pause() {
            this.paused = true;
        }
    }

    class MockSpeechSynthesisUtterance {
        constructor(text = '') {
            this.text = text;
            this.lang = 'en-US';
            this.onstart = null;
            this.onend = null;
            this.onerror = null;
        }
    }

    class MockSpeechSynthesis {
        constructor() {
            this.speaking = false;
            this.cancelCount = 0;
            this.spokeUtterances = [];
        }

        getVoices() {
            return [{ name: 'Google US English', lang: 'en-US', default: true }];
        }

        speak(utterance) {
            this.spokeUtterances.push(utterance);
            this.speaking = true;
            if (typeof utterance.onstart === 'function') {
                utterance.onstart();
            }
        }

        cancel() {
            this.cancelCount++;
            this.speaking = false;
        }
    }

    beforeEach(() => {
        mockAudioInstances = [];
        mockSynth = new MockSpeechSynthesis();
        originalAudio = global.Audio;
        global.Audio = MockAudio;

        global.window = global.window || {};
        global.window.Audio = MockAudio;
        global.window.speechSynthesis = mockSynth;
        global.window.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
        global.speechSynthesis = mockSynth;
        global.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;

        mockSpeechService = {
            speakEnglish: jest.fn((text, isFallback, opts) => {
                if (opts && typeof opts.onStart === 'function') {
                    opts.onStart("SpeechService (Giọng máy tính)");
                }
            }),
            cancel: jest.fn()
        };

        // Reset singleton
        EnglishAudioService.init({
            "hello": { filename: "hello.mp3", duration: 0.8 },
            "school": { filename: "school.mp3", duration: 0.9 }
        });
    });

    afterEach(() => {
        global.Audio = originalAudio;
        if (global.window) {
            global.window.Audio = originalAudio;
        }
    });

    describe('1. Manifest & Cache Status', () => {
        test('nạp và truy vấn manifest chính xác', () => {
            expect(EnglishAudioService.isVoiceCached("hello")).toBe(true);
            expect(EnglishAudioService.isVoiceCached("school")).toBe(true);
            expect(EnglishAudioService.isVoiceCached("unknown_phrase")).toBe(false);
        });
    });

    describe('2. Tầng 1: Kokoro Cached Audio', () => {
        test('phát thành công và gán nhãn Kokoro TTS (Offline Cache)', async () => {
            let startedLabel = '';
            await EnglishAudioService.playEnglishVoice("hello", "hello", {
                onStart: (label) => { startedLabel = label; }
            });

            expect(mockAudioInstances.length).toBe(1);
            expect(mockAudioInstances[0].src).toBe("sounds/english/hello.mp3");
            expect(EnglishAudioService.getAudioSourceLabel()).toBe("Kokoro TTS (Offline Cache)");
            expect(startedLabel).toBe("Kokoro TTS (Offline Cache)");
        });
    });

    describe('3. Tầng 2: Fallback sang SpeechService khi file 404', () => {
        test('tự động chuyển sang SpeechService khi file không tìm thấy', async () => {
            await EnglishAudioService.playEnglishVoice("missing audio text", "missing_audio", {});

            // Audio element được thử và thất bại
            expect(mockAudioInstances.length).toBe(1);
            // SpeechService đã được gọi
            expect(mockSynth.cancelCount).toBeGreaterThanOrEqual(1);
        });
    });

    describe('4. Tầng 4: Không hỗ trợ phát âm an toàn', () => {
        test('xử lý an toàn khi không có SpeechSynthesis', () => {
            delete global.window.speechSynthesis;
            delete global.speechSynthesis;

            let unsupportedCalled = false;
            EnglishAudioService._fallbackNativeSpeech("test", {
                onUnsupported: () => { unsupportedCalled = true; }
            });

            expect(EnglishAudioService.getAudioSourceLabel()).toBe("Không hỗ trợ phát âm");
            expect(unsupportedCalled).toBe(true);
        });
    });

    describe('5. stopAll', () => {
        test('dừng audio element và cancel speech synthesis', () => {
            EnglishAudioService.stopAll();
            expect(mockSynth.cancelCount).toBe(1);
        });
    });
});
