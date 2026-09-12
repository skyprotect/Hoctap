/**
 * tests/core/passive-listening-service.test.js
 * Unit tests cho PassiveListeningService & Audio Policy CACHE_ONLY (v15.9).
 */

const PassiveListeningService = require('../../js/core/passive-listening-service');
const EnglishAudioService = require('../../js/core/english-audio-service');

describe('PassiveListeningService — Hệ thống Nghe Thụ Động Chuẩn CEFR (v15.9)', () => {
    beforeAll(async () => {
        await EnglishAudioService.init();
    });

    test('1. Nạp danh mục bài nghe đầy đủ 18 bài', async () => {
        const manifest = await PassiveListeningService.loadManifest();
        expect(manifest).toBeDefined();
        const keys = Object.keys(manifest);
        expect(keys.length).toBe(18);
    });

    test('2. Phân loại theo 3 cấp độ CEFR: Pre-A1, A1, A2', async () => {
        const preA1 = await PassiveListeningService.getLessons({ level: 'Pre-A1' });
        const a1 = await PassiveListeningService.getLessons({ level: 'A1' });
        const a2 = await PassiveListeningService.getLessons({ level: 'A2' });

        expect(preA1.length).toBe(6);
        expect(a1.length).toBe(6);
        expect(a2.length).toBe(6);
    });

    test('3. Mỗi bài nghe có thông tin speakers và transcript phân đoạn', async () => {
        const lesson = await PassiveListeningService.getLessonById('PL_PREA1_ANIMALS_001');
        expect(lesson).not.toBeNull();
        expect(lesson.title).toBe('Look at the Cute Cat');
        expect(lesson.speakers.length).toBe(2);
        expect(lesson.transcript.length).toBeGreaterThanOrEqual(4);
        expect(lesson.durationSec).toBeGreaterThan(10);
        expect(lesson.audioFile).toContain('sounds/english/passive/');
    });

    test('4. Spaced Review nhẹ (NEW -> FAMILIAR -> REVIEW -> MASTERED)', () => {
        const mockStorage = {};
        global.localStorage = {
            getItem: (k) => mockStorage[k] || null,
            setItem: (k, v) => { mockStorage[k] = v; }
        };

        PassiveListeningService.saveProgress('PL_TEST_01', 30, false);
        let store = PassiveListeningService.getProgressStore();
        expect(store['PL_TEST_01'].status).toBe('FAMILIAR');

        PassiveListeningService.saveProgress('PL_TEST_01', 30, true);
        PassiveListeningService.saveProgress('PL_TEST_01', 30, true);
        store = PassiveListeningService.getProgressStore();
        expect(store['PL_TEST_01'].status).toBe('REVIEW');
    });

    test('5. Chính sách PASSIVE_LISTENING = CACHE_ONLY: Cache Miss trả về controlled error, KHÔNG gọi Browser TTS', async () => {
        let synthCalled = false;
        global.window = global.window || {};
        global.window.speechSynthesis = {
            speak: () => { synthCalled = true; },
            cancel: () => {}
        };

        const res = await EnglishAudioService.playEnglishVoice(
            "Test text",
            "pl_non_existent_audio_key_12345",
            { category: 'PASSIVE_LISTENING', feature: 'EXTENSIVE_LISTENING' }
        );

        expect(res.ok).toBe(false);
        expect(res.category).toBe('PASSIVE_LISTENING');
        expect(res.reason).toBe('AUDIO_CACHE_MISSING');
        expect(synthCalled).toBe(false);
    });
});
