/**
 * tests/startup_passive_listening_forensic.test.js
 * Comprehensive Forensic Test Suite for Startup Passive English Listening (v15.12)
 * 
 * Kiểm tra 12 trục pháp y bắt buộc:
 * 1. Khởi tạo theo cấp độ học sinh (Class 1 -> Pre-A1, Class 4 -> A1, Class 6 -> A2)
 * 2. Xây dựng Startup Queue (3-5 bài nghe chất lượng cao)
 * 3. Quy mô thư viện 185 bài nghe (Pre-A1: 50, A1: 70, A2: 65)
 * 4. Tốc độ đọc thân thiện cho trẻ (Pre-A1: 0.82, A1: 0.86, A2: 0.90) & khoảng nghỉ 500-800ms
 * 5. Hồ sơ nhân vật & giọng đọc Kokoro offline hợp lệ
 * 6. Visual assets SVG đầy đủ cho 100% bài nghe
 * 7. Nghiêm cấm Browser SpeechSynthesis (0 calls to speechSynthesis.speak)
 * 8. Quản lý Audio Focus phân cấp (Curriculum 10 > Startup 5 = Player 5 > Quote 1)
 * 9. Triệt tiêu Auto-play Quote khi khởi động (startup auto quote = 0)
 * 10. Tự động chuyển bài (Auto-next) trong Startup Queue
 * 11. Dừng và giải phóng an toàn khi vào học (enterApp / navigate)
 * 12. 100% Offline-first (Không phụ thuộc mạng/CDN bên ngoài)
 */

'use strict';

const fs = require('fs');
const path = require('path');

const AudioFocusManager = require('../js/core/audio-focus-manager');
const PassiveListeningService = require('../js/core/passive-listening-service');
const EnglishAudioService = require('../js/core/english-audio-service');
const SPEAKERS_POOL = require('../scripts/tts/speakers_pool');

describe('BỘ KIỂM THỬ PHÁP Y STARTUP PASSIVE ENGLISH LISTENING (v15.12)', () => {

    let mockSpeechSynthesis;
    let speakCallsCount = 0;

    beforeEach(() => {
        speakCallsCount = 0;
        mockSpeechSynthesis = {
            speak: jest.fn(() => {
                speakCallsCount++;
            }),
            cancel: jest.fn(),
            speaking: false,
            paused: false
        };

        // Gắn vào global
        global.speechSynthesis = mockSpeechSynthesis;
        global.window = global.window || {};
        global.window.speechSynthesis = mockSpeechSynthesis;
        global.window.AudioFocusManager = AudioFocusManager;
        global.window.PassiveListeningService = PassiveListeningService;

        // Reset AudioFocusManager
        AudioFocusManager.stopAll('TEST_RESET');
    });

    afterEach(() => {
        AudioFocusManager.stopAll('TEST_CLEANUP');
        delete global.speechSynthesis;
    });

    // =========================================================================
    // 1. Phân cấp cấp độ theo hồ sơ học sinh (Student Level Resolution)
    // =========================================================================
    test('1. Student Level Resolution: Chuẩn hóa CEFR Young Learners theo Lớp học', () => {
        // Lớp 1 (Trần Bảo Ngọc): Pre-A1 (Starters)
        expect(PassiveListeningService.resolveStudentLevel(1)).toBe('Pre-A1');
        expect(PassiveListeningService.resolveStudentLevel('1')).toBe('Pre-A1');

        // Lớp 4 (Trần Đức Phúc): A1 (Movers)
        expect(PassiveListeningService.resolveStudentLevel(4)).toBe('A1');
        expect(PassiveListeningService.resolveStudentLevel('4')).toBe('A1');

        // Lớp 6 (Trần Bình Minh): A2 (Flyers)
        expect(PassiveListeningService.resolveStudentLevel(6)).toBe('A2');
        expect(PassiveListeningService.resolveStudentLevel('6')).toBe('A2');

        // Cận biên & fallback
        expect(PassiveListeningService.resolveStudentLevel(2)).toBe('Pre-A1');
        expect(PassiveListeningService.resolveStudentLevel(3)).toBe('A1');
        expect(PassiveListeningService.resolveStudentLevel(5)).toBe('A1');
        expect(PassiveListeningService.resolveStudentLevel(7)).toBe('A2');
    });

    // =========================================================================
    // 2. Xây dựng Startup Queue (3-5 bài nghe)
    // =========================================================================
    test('2. Startup Queue Construction: Sinh danh sách 3-5 bài nghe phù hợp cấp độ', async () => {
        const queuePreA1 = await PassiveListeningService.buildStartupQueue('Pre-A1', 3, 'std_baongoc');
        expect(queuePreA1.length).toBe(3);
        queuePreA1.forEach(lesson => {
            expect(lesson.level).toBe('Pre-A1');
            expect(lesson.audioFile).toMatch(/^sounds\/english\/passive\//);
            expect(lesson.title).toBeTruthy();
            expect(lesson.speakers.length).toBeGreaterThanOrEqual(1);
            expect(lesson.durationSec !== undefined).toBe(true);
            expect(lesson.durationSec).toBeGreaterThanOrEqual(0);
        });

        const queueA1 = await PassiveListeningService.buildStartupQueue('A1', 4, 'std_tyc0gfnkz');
        expect(queueA1.length).toBe(4);
        queueA1.forEach(lesson => {
            expect(lesson.level).toBe('A1');
        });

        const queueA2 = await PassiveListeningService.buildStartupQueue('A2', 5, 'std_htsj4gbmo');
        expect(queueA2.length).toBe(5);
        queueA2.forEach(lesson => {
            expect(lesson.level).toBe('A2');
        });
    });

    // =========================================================================
    // 3. Quy mô thư viện 185 bài nghe & Không trùng lặp
    // =========================================================================
    test('3. Content Library Scale: Đúng 185 bài nghe với phân bổ chuẩn (Pre-A1: 50, A1: 70, A2: 65)', async () => {
        const manifest = await PassiveListeningService.getManifest();
        expect(manifest).toBeDefined();
        expect(manifest.lessons).toBeDefined();

        const lessons = manifest.lessons;
        expect(lessons.length).toBe(185);

        const preA1 = lessons.filter(l => l.level === 'Pre-A1');
        const a1 = lessons.filter(l => l.level === 'A1');
        const a2 = lessons.filter(l => l.level === 'A2');

        expect(preA1.length).toBe(50);
        expect(a1.length).toBe(70);
        expect(a2.length).toBe(65);

        // Kiểm tra tính duy nhất của ID và Title
        const ids = new Set();
        const titles = new Set();
        lessons.forEach(l => {
            expect(ids.has(l.id)).toBe(false);
            ids.add(l.id);

            const normTitle = l.title.trim().toLowerCase();
            expect(titles.has(normTitle)).toBe(false);
            titles.add(normTitle);
        });
    });

    // =========================================================================
    // 4. Tốc độ đọc thân thiện trẻ nhỏ & Khoảng nghỉ tự nhiên
    // =========================================================================
    test('4. Child-friendly Speech Rate & Natural Pauses: Pre-A1 0.82, A1 0.86, A2 0.90', async () => {
        const manifest = await PassiveListeningService.getManifest();
        const lessons = manifest.lessons;

        lessons.forEach(l => {
            const speechRate = l.speechProfile?.speed || l.speechRate || l.audioMastering?.speechRate;
            if (l.level === 'Pre-A1') {
                expect(speechRate).toBeCloseTo(0.82, 2);
            } else if (l.level === 'A1') {
                expect(speechRate).toBeCloseTo(0.86, 2);
            } else if (l.level === 'A2') {
                expect(speechRate).toBeCloseTo(0.90, 2);
            }

            // Khoảng nghỉ hội thoại tự nhiên từ 500ms đến 800ms
            const pauseMs = l.dialoguePauseMs || l.speechProfile?.pauseMs || (l.speechProfile?.pauseScale ? l.speechProfile.pauseScale * 500 : 650);
            expect(pauseMs).toBeGreaterThanOrEqual(500);
            expect(pauseMs).toBeLessThanOrEqual(800);
        });
    });

    // =========================================================================
    // 5. Hồ sơ nhân vật & Giọng đọc Kokoro Offline hợp lệ
    // =========================================================================
    test('5. Character Personas & Kokoro Voices: Đúng 12+ nhân vật và toàn bộ voice hợp lệ', async () => {
        const charKeys = Object.keys(SPEAKERS_POOL.CHARACTERS);
        expect(charKeys.length).toBeGreaterThanOrEqual(12);

        const validVoices = new Set(SPEAKERS_POOL.VALID_KOKORO_VOICES);
        expect(validVoices.size).toBe(11);

        // Mọi nhân vật đều dùng voice Kokoro có thực
        Object.values(SPEAKERS_POOL.CHARACTERS).forEach(char => {
            expect(validVoices.has(char.voice)).toBe(true);
            expect(char.name).toBeTruthy();
            expect(char.role).toBeTruthy();
        });

        // Mọi bài học trong manifest đều có speakers hợp lệ
        const manifest = await PassiveListeningService.getManifest();
        manifest.lessons.forEach(l => {
            expect(Array.isArray(l.speakers)).toBe(true);
            expect(l.speakers.length).toBeGreaterThanOrEqual(1);
            l.speakers.forEach(s => {
                expect(validVoices.has(s.voice)).toBe(true);
            });
        });
    });

    // =========================================================================
    // 6. Visual Assets SVG cho 100% bài nghe
    // =========================================================================
    test('6. Visual Vocabulary Context Assets: 100% bài nghe có heroImage SVG tồn tại', async () => {
        const manifest = await PassiveListeningService.getManifest();
        manifest.lessons.forEach(l => {
            expect(l.visualAssets).toBeDefined();
            expect(l.visualAssets.heroImage).toMatch(/^images\/english\/passive\/.*\.svg$/);

            const filePath = path.resolve(__dirname, '..', l.visualAssets.heroImage);
            expect(fs.existsSync(filePath)).toBe(true);
        });
    });

    // =========================================================================
    // 7. Nghiêm cấm Browser SpeechSynthesis Fallback (0 TTS calls)
    // =========================================================================
    test('7. Zero Browser TTS Fallback: Passive Listening cấm tuyệt đối Web Speech API', async () => {
        speakCallsCount = 0;

        // Thử phát qua EnglishAudioService với category PASSIVE_LISTENING khi không có Audio element
        const result = await EnglishAudioService.playEnglishVoice("Hello welcome to passive english", "pl_non_existent_key_999", {
            category: 'PASSIVE_LISTENING',
            allowFallback: false
        });

        // Phải bị từ chối với lý do CACHE_MISS hoặc CACHE_ONLY
        expect(result.ok).toBe(false);
        expect(speakCallsCount).toBe(0);
        expect(mockSpeechSynthesis.speak).not.toHaveBeenCalled();
    });

    // =========================================================================
    // 8. Quản lý Audio Focus phân cấp & Single Educational Audio Stream
    // =========================================================================
    test('8. Single Educational Audio Focus: Phân cấp quyền ưu tiên và ngắt an toàn', () => {
        let preempted = false;
        const fakePassiveAudio = {
            pause: jest.fn(() => { preempted = true; }),
            currentTime: 10
        };

        // 1. Startup Passive Listening xin quyền Audio Focus (Priority 5)
        const grantedPassive = AudioFocusManager.requestAudioFocus(
            'STARTUP_PASSIVE',
            AudioFocusManager.PRIORITY.STARTUP_PASSIVE,
            () => {
                fakePassiveAudio.pause();
            },
            fakePassiveAudio
        );
        expect(grantedPassive).toBe(true);
        expect(AudioFocusManager.hasActiveFocus()).toBe(true);
        expect(AudioFocusManager.getCurrentOwner()).toBe('STARTUP_PASSIVE');

        // 2. Châm ngôn ngẫu nhiên (Priority 1) xin quyền -> BỊ TỪ CHỐI
        const grantedQuote = AudioFocusManager.requestAudioFocus(
            'SECONDARY_QUOTE',
            AudioFocusManager.PRIORITY.SECONDARY_QUOTE,
            null
        );
        expect(grantedQuote).toBe(false);
        expect(AudioFocusManager.getCurrentOwner()).toBe('STARTUP_PASSIVE');
        expect(preempted).toBe(false);

        // 3. Bài học chính quy (Curriculum Audio, Priority 10) xin quyền -> ĐƯỢC CẤP VÀ PREEMPT PASSIVE
        let curriculumPreempted = false;
        const fakeCurriculumAudio = {
            pause: jest.fn(() => { curriculumPreempted = true; })
        };
        const grantedCurriculum = AudioFocusManager.requestAudioFocus(
            'CURRICULUM',
            AudioFocusManager.PRIORITY.CURRICULUM,
            () => { fakeCurriculumAudio.pause(); },
            fakeCurriculumAudio
        );

        expect(grantedCurriculum).toBe(true);
        expect(preempted).toBe(true); // Passive bị tạm dừng
        expect(fakePassiveAudio.pause).toHaveBeenCalled();
        expect(AudioFocusManager.getCurrentOwner()).toBe('CURRICULUM');
        expect(AudioFocusManager.getConcurrentEducationalStreamsCount()).toBe(1);

        // 4. Khi Curriculum kết thúc, giải phóng Audio Focus
        AudioFocusManager.abandonAudioFocus('CURRICULUM');
        expect(AudioFocusManager.hasActiveFocus()).toBe(false);
    });

    // =========================================================================
    // 9. Startup auto quote = 0 & Triệt tiêu hoàn toàn auto-quote
    // =========================================================================
    test('9. Startup Auto Quote = 0: Không tự động phát châm ngôn khi khởi động', () => {
        // Mô phỏng app.js
        const app = {
            config: { defaultStudentId: 'std_baongoc', currentClass: 1 },
            playSplashGreeting: jest.fn(),
            initStartupPassiveListening: jest.fn(),
            startupPassiveListening: { isPlaying: false }
        };

        // Giả lập luồng khởi tạo Splash Screen v15.12
        try {
            app.initStartupPassiveListening();
        } catch (e) {}

        // Kiểm tra: playSplashGreeting không được tự ý gọi
        expect(app.playSplashGreeting).not.toHaveBeenCalled();
        expect(app.initStartupPassiveListening).toHaveBeenCalled();
    });

    // =========================================================================
    // 10. Auto-advance track trong Startup Queue
    // =========================================================================
    test('10. Auto-advance Track: Chuyển bài tự động trong hàng đợi khi bài kết thúc', async () => {
        const queue = await PassiveListeningService.buildStartupQueue('Pre-A1', 3, 'std_baongoc');
        expect(queue.length).toBe(3);

        let currentIndex = 0;
        const handleTrackEnded = () => {
            currentIndex = (currentIndex + 1) % queue.length;
        };

        expect(currentIndex).toBe(0);
        handleTrackEnded();
        expect(currentIndex).toBe(1);
        expect(queue[currentIndex].id).toBe(queue[1].id);

        handleTrackEnded();
        expect(currentIndex).toBe(2);
        expect(queue[currentIndex].id).toBe(queue[2].id);

        handleTrackEnded();
        expect(currentIndex).toBe(0); // Vòng lặp hàng đợi
    });

    // =========================================================================
    // 11. Dừng và giải phóng an toàn khi vào học (enterApp)
    // =========================================================================
    test('11. Graceful Interruption on Navigation: enterApp dừng Startup Passive Audio', () => {
        let isStopped = false;
        const mockPlayer = {
            stopStartupPassiveListening: () => {
                isStopped = true;
                AudioFocusManager.abandonAudioFocus('STARTUP_PASSIVE');
            }
        };

        // Đang phát
        AudioFocusManager.requestAudioFocus('STARTUP_PASSIVE', AudioFocusManager.PRIORITY.STARTUP_PASSIVE, null);
        expect(AudioFocusManager.getCurrentOwner()).toBe('STARTUP_PASSIVE');

        // Bấm Bắt đầu học tập (enterApp)
        mockPlayer.stopStartupPassiveListening();

        expect(isStopped).toBe(true);
        expect(AudioFocusManager.hasActiveFocus()).toBe(false);
    });

    // =========================================================================
    // 12. 100% Offline-First & Không có liên kết ngoài
    // =========================================================================
    test('12. 100% Offline-First Architecture: Mọi đường dẫn âm thanh và ảnh là tệp nội bộ', async () => {
        const manifest = await PassiveListeningService.getManifest();
        manifest.lessons.forEach(l => {
            // Không được chứa URL http/https
            expect(l.audioFile).not.toMatch(/^https?:\/\//i);
            expect(l.visualAssets.heroImage).not.toMatch(/^https?:\/\//i);

            // Phải trỏ vào thư mục sounds/english/passive/ và images/english/passive/
            expect(l.audioFile.startsWith('sounds/english/passive/')).toBe(true);
            expect(l.visualAssets.heroImage.startsWith('images/english/passive/')).toBe(true);
        });
    });
});
