const { test, expect } = require('@playwright/test');

test.describe("AUDIO FORENSIC RUNTIME VERIFICATION SUITE (v15.7)", () => {

    test.beforeEach(async ({ page }) => {
        // Cài đặt Forensic Spies vào Browser Runtime trước khi load trang
        await page.addInitScript(() => {
            window.__AUDIO_TRACES__ = [];
            window.__SYNTHESIS_CALLS__ = 0;
            window.__AUDIO_PLAY_CALLS__ = 0;
            
            // 1. Spy trên SpeechSynthesis: Theo dõi và đếm mọi cuộc gọi speak()
            const originalSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
            window.speechSynthesis.speak = function(utterance) {
                window.__SYNTHESIS_CALLS__++;
                const trace = {
                    api: 'speechSynthesis.speak',
                    text: utterance ? utterance.text : '',
                    lang: utterance ? utterance.lang : '',
                    stack: new Error().stack
                };
                window.__AUDIO_TRACES__.push(trace);
                console.warn('[SPY_SYNTHESIS_DETECTED]', trace.text);
                return originalSpeak(utterance);
            };

            // 2. Spy trên Audio constructor & play
            const OriginalAudio = window.Audio;
            window.Audio = function(src) {
                const instance = new OriginalAudio(src);
                const originalPlay = instance.play.bind(instance);
                instance.play = function() {
                    window.__AUDIO_PLAY_CALLS__++;
                    const trace = {
                        api: 'Audio.play',
                        src: instance.src || src,
                        stack: new Error().stack
                    };
                    window.__AUDIO_TRACES__.push(trace);
                    console.log('[SPY_AUDIO_PLAY]', trace.src);
                    return originalPlay();
                };
                return instance;
            };
        });

        await page.goto('/student.html');
        await page.waitForLoadState('domcontentloaded');
        await page.evaluate(async () => {
            localStorage.setItem('hasVisitedKiosk', 'true');
            if (window.app) {
                window.app.currentClass = '6';
            }
            window.__ENGLISH_AUDIO_DEBUG__ = true;
            if (window.EnglishAudioService && window.EnglishAudioService.init) {
                await window.EnglishAudioService.init();
            }
        });
    });

    test("1. Forensic Test: Vocabulary Audio -> Kokoro Offline Cache, 0 Browser TTS calls", async ({ page }) => {
        const result = await page.evaluate(async () => {
            window.__AUDIO_TRACES__ = [];
            window.__SYNTHESIS_CALLS__ = 0;

            const res = await window.app.playEnglishVoice("activity", "activity", {
                category: 'CURRICULUM',
                feature: 'VOCABULARY'
            });

            await new Promise(r => setTimeout(r, 600));

            return {
                res,
                synthesisCalls: window.__SYNTHESIS_CALLS__,
                audioPlayCalls: window.__AUDIO_PLAY_CALLS__,
                traces: window.__AUDIO_TRACES__,
                sourceLabel: window.EnglishAudioService ? window.EnglishAudioService.getAudioSourceLabel() : 'UNKNOWN'
            };
        });

        console.log('TEST 1 (Vocabulary):', result);
        expect(result.synthesisCalls).toBe(0);
        expect(result.res.ok).toBe(true);
        expect(result.sourceLabel).toContain("Kokoro TTS");
    });

    test("2. Forensic Test: Listening Audio -> Kokoro Offline Cache, 0 Browser TTS calls", async ({ page }) => {
        const result = await page.evaluate(async () => {
            window.__AUDIO_TRACES__ = [];
            window.__SYNTHESIS_CALLS__ = 0;

            const qs = window.generateEnglishQuestions('6', 'eng6-t1', 'listening');
            const lPassageQ = qs.find(q => q.type === 'listening_passage') || qs[0];

            document.body.classList.add("focus-mode-active");
            const scr = document.getElementById("english-focus-lesson-screen");
            if (scr) scr.classList.remove("hidden");
            window.app.currentEnglishQuestions = [lPassageQ];
            window.app.currentEnglishQuestionIndex = 0;
            window.app.renderEnglishQuestion();

            // Click nút phát âm thanh lớn trên màn hình Listening
            const btn = document.querySelector('.btn-audio-speak-large');
            if (btn) btn.click();

            await new Promise(r => setTimeout(r, 600));

            return {
                questionType: lPassageQ.type,
                audioKey: lPassageQ.audioFileKey,
                synthesisCalls: window.__SYNTHESIS_CALLS__,
                audioPlayCalls: window.__AUDIO_PLAY_CALLS__,
                traces: window.__AUDIO_TRACES__,
                sourceLabel: window.EnglishAudioService ? window.EnglishAudioService.getAudioSourceLabel() : 'UNKNOWN'
            };
        });

        console.log('TEST 2 (Listening):', result);
        expect(result.synthesisCalls).toBe(0);
        expect(result.sourceLabel).toContain("Kokoro TTS");
    });

    test("3. Forensic Test: Speaking Prompt Audio -> Kokoro Offline Cache, 0 Browser TTS calls", async ({ page }) => {
        const result = await page.evaluate(async () => {
            window.__AUDIO_TRACES__ = [];
            window.__SYNTHESIS_CALLS__ = 0;

            const qs = window.generateEnglishQuestions('6', 'eng6-t1', 'speaking');
            const sq = qs[0];

            document.body.classList.add("focus-mode-active");
            const scr = document.getElementById("english-focus-lesson-screen");
            if (scr) scr.classList.remove("hidden");
            window.app.currentEnglishQuestions = [sq];
            window.app.currentEnglishQuestionIndex = 0;
            window.app.renderEnglishQuestion();

            const btn = document.querySelector('.btn-tts-speak');
            if (btn) btn.click();

            await new Promise(r => setTimeout(r, 600));

            return {
                questionType: sq.type,
                speakingText: sq.speakingText,
                synthesisCalls: window.__SYNTHESIS_CALLS__,
                audioPlayCalls: window.__AUDIO_PLAY_CALLS__,
                traces: window.__AUDIO_TRACES__,
                sourceLabel: window.EnglishAudioService ? window.EnglishAudioService.getAudioSourceLabel() : 'UNKNOWN'
            };
        });

        console.log('TEST 3 (Speaking Prompt):', result);
        expect(result.synthesisCalls).toBe(0);
        expect(result.sourceLabel).toContain("Kokoro TTS");
    });

    test("4. Forensic Test: Reading Read-Along -> Real Audio Element, 0 Browser TTS calls", async ({ page }) => {
        const result = await page.evaluate(async () => {
            window.__AUDIO_TRACES__ = [];
            window.__SYNTHESIS_CALLS__ = 0;

            const qs = window.generateEnglishQuestions('6', 'eng6-t1', 'reading');
            const rq = qs.find(q => q.type === 'reading_passage') || qs[0];

            document.body.classList.add("focus-mode-active");
            const scr = document.getElementById("english-focus-lesson-screen");
            if (scr) scr.classList.remove("hidden");
            window.app.currentEnglishQuestions = [rq];
            window.app.currentEnglishQuestionIndex = 0;
            window.app.renderEnglishQuestion();

            const btn = document.querySelector('button[aria-label="Nghe đọc bài văn"]');
            if (btn) {
                btn.click();
            } else {
                // Nếu render dạng khác, gọi trực tiếp playReadAlong
                await window.app.playReadAlong(rq.passageText || "My New School", 'read-along-container', rq.passageTitle || 'my_first_school_day');
            }

            await new Promise(r => setTimeout(r, 600));

            return {
                questionType: rq.type,
                synthesisCalls: window.__SYNTHESIS_CALLS__,
                audioPlayCalls: window.__AUDIO_PLAY_CALLS__,
                traces: window.__AUDIO_TRACES__,
                sourceLabel: window.EnglishAudioService ? window.EnglishAudioService.getAudioSourceLabel() : 'UNKNOWN'
            };
        });

        console.log('TEST 4 (Reading Read-Along):', result);
        expect(result.synthesisCalls).toBe(0);
        expect(result.sourceLabel).toContain("Kokoro TTS");
    });

    test("5. Forensic Test: Grade 1 Audio -> Kokoro Offline Cache, 0 Browser TTS calls", async ({ page }) => {
        const result = await page.evaluate(async () => {
            window.__AUDIO_TRACES__ = [];
            window.__SYNTHESIS_CALLS__ = 0;

            window.app.currentClass = '1';
            const res = await window.app.playEnglishVoice("book", "book", {
                category: 'CURRICULUM',
                feature: 'VOCABULARY',
                grade: 1
            });

            await new Promise(r => setTimeout(r, 600));

            return {
                res,
                synthesisCalls: window.__SYNTHESIS_CALLS__,
                audioPlayCalls: window.__AUDIO_PLAY_CALLS__,
                sourceLabel: window.EnglishAudioService ? window.EnglishAudioService.getAudioSourceLabel() : 'UNKNOWN'
            };
        });

        console.log('TEST 5 (Grade 1):', result);
        expect(result.synthesisCalls).toBe(0);
        expect(result.res.ok).toBe(true);
        expect(result.sourceLabel).toContain("Kokoro TTS");
    });

    test("6. Forensic Test: Grade 4 Audio -> Kokoro Offline Cache, 0 Browser TTS calls", async ({ page }) => {
        const result = await page.evaluate(async () => {
            window.__AUDIO_TRACES__ = [];
            window.__SYNTHESIS_CALLS__ = 0;

            window.app.currentClass = '4';
            const res = await window.app.playEnglishVoice("morning", "morning", {
                category: 'CURRICULUM',
                feature: 'VOCABULARY',
                grade: 4
            });

            await new Promise(r => setTimeout(r, 600));

            return {
                res,
                synthesisCalls: window.__SYNTHESIS_CALLS__,
                audioPlayCalls: window.__AUDIO_PLAY_CALLS__,
                sourceLabel: window.EnglishAudioService ? window.EnglishAudioService.getAudioSourceLabel() : 'UNKNOWN'
            };
        });

        console.log('TEST 6 (Grade 4):', result);
        expect(result.synthesisCalls).toBe(0);
        expect(result.res.ok).toBe(true);
        expect(result.sourceLabel).toContain("Kokoro TTS");
    });

    test("7. Safety Test: Curriculum Cache Miss -> Controlled failure, STRICTLY 0 Browser TTS calls", async ({ page }) => {
        const result = await page.evaluate(async () => {
            window.__AUDIO_TRACES__ = [];
            window.__SYNTHESIS_CALLS__ = 0;

            // Chuỗi chắc chắn không có trong cache giáo trình
            const fakeText = "xyz_non_existent_curriculum_phrase_99999";
            const res = await window.EnglishAudioService.playEnglishVoice(fakeText, null, {
                category: 'CURRICULUM',
                feature: 'TEST_CACHE_MISS'
            });

            await new Promise(r => setTimeout(r, 600));

            return {
                res,
                synthesisCalls: window.__SYNTHESIS_CALLS__,
                traces: window.__AUDIO_TRACES__,
                sourceLabel: window.EnglishAudioService ? window.EnglishAudioService.getAudioSourceLabel() : 'UNKNOWN'
            };
        });

        console.log('TEST 7 (Curriculum Cache Miss Safety):', result);
        // BẮT BUỘC: Không được gọi speechSynthesis.speak!
        expect(result.synthesisCalls).toBe(0);
        // Phải trả về failure có kiểm soát
        expect(result.res.ok).toBe(false);
        expect(result.res.reason).toBe("AUDIO_CACHE_MISSING");
        expect(result.res.category).toBe("CURRICULUM");
    });

    test("8. Safety Test: Dynamic Audio Fallback -> Fallback allowed ONLY when explicit", async ({ page }) => {
        const result = await page.evaluate(async () => {
            window.__AUDIO_TRACES__ = [];
            window.__SYNTHESIS_CALLS__ = 0;

            const dynamicText = "Custom user sentence that is not in curriculum";
            const res = await window.EnglishAudioService.playEnglishVoice(dynamicText, null, {
                category: 'DYNAMIC',
                allowFallback: true,
                feature: 'TEST_DYNAMIC_FALLBACK'
            });

            await new Promise(r => setTimeout(r, 600));

            return {
                res,
                synthesisCalls: window.__SYNTHESIS_CALLS__,
                traces: window.__AUDIO_TRACES__
            };
        });

        console.log('TEST 8 (Dynamic Fallback):', result);
        // Khi DYNAMIC và allowFallback = true, cho phép fallback sang SpeechService
        expect(result.synthesisCalls).toBe(1);
        expect(result.res.ok).toBe(true);
        expect(result.res.source).toBe("SpeechService");
    });
});
