/**
 * Unit & Characterization Tests for SpeechService (js/core/speech-service.js)
 * Covers:
 * - Module exports (CommonJS, Browser global, globalThis)
 * - Initial state & Voice caching
 * - Voice selection logic for 'en-US' and 'vi-VN'
 * - speakEnglish method (rate, lang, callbacks, error handling)
 * - speakText method (custom lang, custom options)
 * - stopSpeech / cancel method
 * - Paused state recovery (calling resume before speak)
 * - Read-along playback & boundary highlights
 * - Graceful fallback when Web Speech API is not supported
 */

// Mock SpeechSynthesisUtterance
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
        this.onboundary = null;
    }
}

// Mock SpeechSynthesis
class MockSpeechSynthesis {
    constructor() {
        this.paused = false;
        this.speaking = false;
        this.pending = false;
        this.onvoiceschanged = null;
        this._mockVoices = [
            { name: 'Google US English', lang: 'en-US', default: true },
            { name: 'Microsoft Zira Desktop - English (United States)', lang: 'en-US', default: false },
            { name: 'Google Tiếng Việt', lang: 'vi-VN', default: false },
            { name: 'Mai (Vietnamese)', lang: 'vi-VN', default: false },
            { name: 'Alex', lang: 'en-GB', default: false }
        ];
        this.spokeUtterances = [];
        this.cancelCalled = 0;
        this.resumeCalled = 0;
        this.pauseCalled = 0;
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

    pause() {
        this.pauseCalled++;
        this.paused = true;
    }

    resume() {
        this.resumeCalled++;
        this.paused = false;
    }
}

describe("Unit & Characterization Tests — SpeechService (js/core/speech-service.js)", () => {
    let mockSynth;
    let SpeechService;

    beforeEach(() => {
        // Setup global browser mock
        mockSynth = new MockSpeechSynthesis();
        global.window = global.window || {};
        global.window.speechSynthesis = mockSynth;
        global.window.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
        global.speechSynthesis = mockSynth;
        global.SpeechSynthesisUtterance = MockSpeechSynthesisUtterance;
        global.document = {
            getElementById: jest.fn().mockReturnValue(null),
            querySelectorAll: jest.fn().mockReturnValue([])
        };

        // Clear require cache to get a fresh instance
        jest.resetModules();
        SpeechService = require('../../js/core/speech-service');
        SpeechService.init();
    });

    afterEach(() => {
        delete global.window.speechSynthesis;
        delete global.window.SpeechSynthesisUtterance;
        delete global.window._speechVoices;
        delete global.speechSynthesis;
        delete global.SpeechSynthesisUtterance;
    });

    test("1. Module exports correctly as object and attaches to global", () => {
        expect(typeof SpeechService).toBe('object');
        expect(typeof SpeechService.speakEnglish).toBe('function');
        expect(typeof SpeechService.speakText).toBe('function');
        expect(typeof SpeechService.stopSpeech).toBe('function');
        expect(typeof SpeechService.getVoices).toBe('function');
        expect(typeof SpeechService.getPreferredVoice).toBe('function');
    });

    test("2. init() caches voices and sets window._speechVoices", () => {
        SpeechService.init();
        expect(Array.isArray(SpeechService.voices)).toBe(true);
        expect(SpeechService.voices.length).toBe(5);
        expect(global.window._speechVoices).toEqual(SpeechService.voices);
    });

    test("3. getPreferredVoice selects best matching voice for en-US", () => {
        const enVoice = SpeechService.getPreferredVoice('en-US');
        expect(enVoice).toBeDefined();
        expect(enVoice.lang).toBe('en-US');
        expect(enVoice.name).toContain('Google');
    });

    test("4. getPreferredVoice selects best matching voice for vi-VN", () => {
        const viVoice = SpeechService.getPreferredVoice('vi-VN');
        expect(viVoice).toBeDefined();
        expect(viVoice.lang).toBe('vi-VN');
        expect(viVoice.name).toContain('Google');
    });

    test("5. speakEnglish speaks text with rate 0.90 and en-US language", () => {
        SpeechService.speakEnglish("Hello world");
        expect(mockSynth.spokeUtterances.length).toBe(1);
        const utt = mockSynth.spokeUtterances[0];
        expect(utt.text).toBe("Hello world");
        expect(utt.lang).toBe("en-US");
        expect(utt.rate).toBe(0.90);
        expect(utt.voice.lang).toBe("en-US");
    });

    test("6. speakEnglish resumes if speech synthesis is paused", () => {
        mockSynth.paused = true;
        SpeechService.speakEnglish("Testing resume");
        expect(mockSynth.resumeCalled).toBe(1);
        expect(mockSynth.cancelCalled).toBe(1);
        expect(mockSynth.spokeUtterances.length).toBe(1);
    });

    test("7. speakEnglish triggers onStart callback with correct source string", () => {
        let label = "";
        SpeechService.speakEnglish("Apple", false, {
            onStart: (sourceName) => { label = sourceName; }
        });
        expect(label).toBe("Google Translate API (Chuẩn Mỹ)");

        SpeechService.speakEnglish("Apple", true, {
            onStart: (sourceName) => { label = sourceName; }
        });
        expect(label).toBe("Trình duyệt máy tính (Dự phòng)");
    });

    test("8. speakEnglish triggers onError callback when utterance errors", () => {
        let errorReported = false;
        SpeechService.speakEnglish("Faulty word", false, {
            onError: () => { errorReported = true; }
        });
        const utt = mockSynth.spokeUtterances[mockSynth.spokeUtterances.length - 1];
        expect(typeof utt.onerror).toBe('function');
        utt.onerror({ error: 'canceled' });
        expect(errorReported).toBe(true);
    });

    test("9. speakText speaks text with custom Vietnamese locale and options", () => {
        SpeechService.speakText("Xin chào các bạn", "vi-VN", { rate: 0.85 });
        expect(mockSynth.spokeUtterances.length).toBe(1);
        const utt = mockSynth.spokeUtterances[0];
        expect(utt.text).toBe("Xin chào các bạn");
        expect(utt.lang).toBe("vi-VN");
        expect(utt.rate).toBe(0.85);
        expect(utt.voice.name).toContain("Google Tiếng Việt");
    });

    test("10. stopSpeech and cancel call window.speechSynthesis.cancel", () => {
        SpeechService.stopSpeech();
        expect(mockSynth.cancelCalled).toBe(1);
        SpeechService.cancel();
        expect(mockSynth.cancelCalled).toBe(2);
    });

    test("11. Handles empty or null text safely without crashing", () => {
        SpeechService.speakEnglish(null);
        SpeechService.speakEnglish("");
        SpeechService.speakText(undefined);
        expect(mockSynth.spokeUtterances.length).toBe(0);
    });

    test("12. Gracefully handles absence of window.speechSynthesis", () => {
        delete global.window.speechSynthesis;
        delete global.speechSynthesis;

        let unsupportedCalled = false;
        SpeechService.speakEnglish("Hello", false, {
            onUnsupported: () => { unsupportedCalled = true; }
        });
        expect(unsupportedCalled).toBe(true);
        expect(SpeechService.isSupported()).toBe(false);
    });

    test("13. voiceschanged event updates internal voice list", () => {
        SpeechService.init();
        expect(typeof mockSynth.onvoiceschanged).toBe('function');

        // Add a new voice to mockSynth
        mockSynth._mockVoices.push({ name: 'Vietnamese Natural', lang: 'vi-VN' });
        mockSynth.onvoiceschanged();

        expect(SpeechService.voices.length).toBe(6);
        expect(global.window._speechVoices.length).toBe(6);
    });

    test("14. playReadAlong splits passage into words and invokes utterance boundary", () => {
        const mockElements = [
            { style: { backgroundColor: '', color: '' } },
            { style: { backgroundColor: '', color: '' } }
        ];
        const mockContainer = {
            innerHTML: '',
            querySelectorAll: jest.fn().mockReturnValue(mockElements)
        };
        global.document.getElementById = jest.fn().mockReturnValue(mockContainer);

        SpeechService.playReadAlong("Hello world", "container-test");
        expect(mockContainer.innerHTML).toContain('read-word-0');
        expect(mockContainer.innerHTML).toContain('read-word-1');
        expect(mockSynth.spokeUtterances.length).toBe(1);

        const utt = mockSynth.spokeUtterances[0];
        expect(typeof utt.onboundary).toBe('function');
        expect(typeof utt.onend).toBe('function');

        // Trigger boundary event
        utt.onboundary({ name: 'word', charIndex: 0 });
        expect(mockElements[0].style.backgroundColor).toBe('#fef08a');

        // Trigger onend event
        utt.onend();
        expect(mockElements[0].style.backgroundColor).toBe('transparent');
    });
});
