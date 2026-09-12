const { test, expect } = require('@playwright/test');

test.describe("PASSIVE ENGLISH LISTENING AND VISUAL VOCABULARY RUNTIME E2E (v15.9)", () => {

    test.beforeEach(async ({ page }) => {
        // Cai dat Forensic Spies vao Browser Runtime truoc khi load trang
        await page.addInitScript(() => {
            window.__AUDIO_TRACES__ = [];
            window.__SYNTHESIS_CALLS__ = 0;
            window.__AUDIO_PLAY_CALLS__ = 0;

            // 1. Spy tren SpeechSynthesis: Theo doi va bat qua tang moi cuoc goi speak()
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
                console.warn('[SPY_SYNTHESIS_DETECTED_FORBIDDEN]', trace.text);
                return originalSpeak(utterance);
            };

            // 2. Spy tren Audio constructor & play
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
            if (window.EnglishAudioService && window.EnglishAudioService.init) {
                await window.EnglishAudioService.init();
            }
        });
    });

    test("1. Forensic Test: Passive Listening -> Kokoro Offline Cache, 0 Browser TTS calls", async ({ page }) => {
        const result = await page.evaluate(async () => {
            window.__AUDIO_TRACES__ = [];
            window.__SYNTHESIS_CALLS__ = 0;

            // Chuyen sang tab passive
            if (window.app && window.app.switchEnglishTab) {
                window.app.switchEnglishTab('passive');
            }

            await new Promise(r => setTimeout(r, 600));

            // Phat bai nghe dau tien
            if (window.PassiveListeningPlayer) {
                await window.PassiveListeningPlayer.playLesson('pas_pre_a1_01');
            }

            await new Promise(r => setTimeout(r, 800));

            return {
                synthesisCalls: window.__SYNTHESIS_CALLS__,
                audioPlayCalls: window.__AUDIO_PLAY_CALLS__,
                traces: window.__AUDIO_TRACES__,
                playerContainerExists: !!document.getElementById('passive-listening-player-container'),
                activeLessonTitle: document.getElementById('passive-lesson-title') ? document.getElementById('passive-lesson-title').innerText : ''
            };
        });

        console.log('TEST 1 (Passive Audio Forensic):', result);
        expect(result.playerContainerExists).toBe(true);
        expect(result.synthesisCalls).toBe(0);
        expect(result.audioPlayCalls).toBeGreaterThanOrEqual(1);
    });

    test("2. Forensic Test: 18/18 Passive tracks resolve valid offline audio with duration > 0", async ({ page }) => {
        const result = await page.evaluate(async () => {
            const manifestRes = await fetch('sounds/english/passive-listening-manifest.json');
            const manifest = await manifestRes.json();
            const tracks = Array.isArray(manifest) ? manifest : (manifest.lessons || Object.values(manifest));

            const verifiedTracks = [];
            for (const track of tracks) {
                try {
                    const audioRes = await fetch(track.audioFile, { method: 'HEAD' });
                    verifiedTracks.push({
                        id: track.id,
                        audioFile: track.audioFile,
                        status: audioRes.status,
                        ok: audioRes.ok,
                        durationSec: track.durationSec,
                        level: track.level
                    });
                } catch (err) {
                    verifiedTracks.push({
                        id: track.id,
                        audioFile: track.audioFile,
                        error: err.message,
                        ok: false
                    });
                }
            }

            return {
                totalExpected: tracks.length,
                verifiedCount: verifiedTracks.filter(t => t.ok).length,
                allValid: verifiedTracks.every(t => t.ok && t.durationSec > 0),
                tracks: verifiedTracks
            };
        });

        console.log(`TEST 2: Verified ${result.verifiedCount}/${result.totalExpected} passive audio files.`);
        expect(result.totalExpected).toBe(18);
        expect(result.verifiedCount).toBe(18);
        expect(result.allValid).toBe(true);
    });

    test("3. Functional Test: Player controls (Mode, Speed, Repeat, Transcript, Visual)", async ({ page }) => {
        const result = await page.evaluate(async () => {
            if (window.app && window.app.switchEnglishTab) {
                window.app.switchEnglishTab('passive');
            }
            await new Promise(r => setTimeout(r, 600));

            const player = window.PassiveListeningPlayer;
            if (!player) return { error: 'Player not found' };

            // 1. Chuyen sang PASSIVE (showTranscript = false)
            player.setInteractionMode('PASSIVE');
            const statePassive = player.getState();

            // 2. Bat Transcript bang toggleTranscript
            player.toggleTranscript();
            const transcriptBody = document.getElementById('passive-transcript-body');

            // 3. Chuyen sang LIGHT (showVisual = true, showTranscript = true)
            player.setInteractionMode('LIGHT');
            const stateLight = player.getState();

            // 4. Chinh toc do 1.2x
            player.setSpeed(1.2);
            const stateSpeed = player.getState();

            // 5. Chinh lap lai 3x
            player.setRepeatMode(3);
            const stateRepeat = player.getState();

            return {
                passiveTranscriptOff: statePassive.showTranscript === false,
                transcriptVisibleAfterToggle: !!transcriptBody,
                isLight: stateLight.interactionMode === 'LIGHT',
                isSpeed12: stateSpeed.playbackSpeed === 1.2,
                isRepeat3: stateRepeat.repeatMode === 3,
                synthesisCalls: window.__SYNTHESIS_CALLS__
            };
        });

        console.log('TEST 3 (Player Controls):', result);
        expect(result.passiveTranscriptOff).toBe(true);
        expect(result.transcriptVisibleAfterToggle).toBe(true);
        expect(result.isLight).toBe(true);
        expect(result.isSpeed12).toBe(true);
        expect(result.isRepeat3).toBe(true);
        expect(result.synthesisCalls).toBe(0);
    });

    test("4. Visual Vocabulary Test: Flashcard displays valid local SVG vector asset", async ({ page }) => {
        const result = await page.evaluate(async () => {
            // Mo tab practice
            if (window.app && window.app.switchEnglishTab) {
                window.app.switchEnglishTab('practice');
            }
            await new Promise(r => setTimeout(r, 600));

            const flashcards = document.querySelectorAll('.flashcard-card-3d');
            const imgElements = document.querySelectorAll('.flashcard-img-wrapper img');

            const sampledImages = [];
            for (let i = 0; i < Math.min(5, imgElements.length); i++) {
                const img = imgElements[i];
                sampledImages.push({
                    src: img.getAttribute('src'),
                    alt: img.getAttribute('alt')
                });
            }

            return {
                cardCount: flashcards.length,
                imgCount: imgElements.length,
                sampledImages
            };
        });

        console.log('TEST 4 (Visual Vocab in Flashcards):', result);
        expect(result.cardCount).toBeGreaterThan(0);
        expect(result.imgCount).toBeGreaterThan(0);
        expect(result.sampledImages[0].src).toContain('.svg');
    });

    test("5. Zero-Fallback Forensic: Strict CACHE_ONLY enforcement with 0 browser TTS", async ({ page }) => {
        const result = await page.evaluate(async () => {
            window.__AUDIO_TRACES__ = [];
            window.__SYNTHESIS_CALLS__ = 0;

            // Thu goi playPassiveAudio truc tiep
            if (window.EnglishAudioService && window.EnglishAudioService.playPassiveAudio) {
                await window.EnglishAudioService.playPassiveAudio('pas_a1_01');
            }

            return {
                synthesisCalls: window.__SYNTHESIS_CALLS__,
                traces: window.__AUDIO_TRACES__
            };
        });

        console.log('TEST 5 (Zero-Fallback Forensic):', result);
        expect(result.synthesisCalls).toBe(0);
    });
});
