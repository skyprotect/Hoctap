/**
 * Unit & Characterization Tests for AudioService (js/core/audio-service.js)
 * 
 * Đảm bảo 100% contract và behavior:
 * - Public API & Shape (isUnlocked, tempMuteClick, sounds, ctx, methods)
 * - HTML5 Audio initialization, asset preloading, volumes & .load()
 * - playSound(name), promise rejection error handling & convenience methods
 * - Background music lifecycle (playBackground, stopBackground)
 * - Web Audio API initialization (AudioContext / webkitAudioContext fallback)
 * - playMessageNotification dual-tone synthesis & fallback to click
 * - Procedural TD Sound synthesis (archer, bomb, ice, sword_slash, coin, thunder)
 * - isUnlocked guard and suspended context auto-resume
 */

const AudioService = require('../../js/core/audio-service');

describe("Unit & Characterization Tests — AudioService (js/core/audio-service.js)", () => {
    let mockAudioInstances = [];
    let originalAudio;
    let originalAudioContext;
    let originalWebkitAudioContext;

    // Helper tạo Mock HTMLAudioElement
    class MockAudio {
        constructor(src) {
            this.src = src;
            this.volume = 1.0;
            this.currentTime = 0;
            this.loop = false;
            this.load = jest.fn();
            this.play = jest.fn().mockResolvedValue(undefined);
            this.pause = jest.fn();
            mockAudioInstances.push(this);
        }
    }

    // Helper tạo Mock Web Audio Context & Nodes
    function createMockAudioContext(initialState = 'running') {
        const destination = {};
        return class MockAudioContext {
            constructor() {
                this.state = initialState;
                this.currentTime = 0;
                this.sampleRate = 44100;
                this.destination = destination;
                this.resume = jest.fn().mockImplementation(() => {
                    this.state = 'running';
                    return Promise.resolve();
                });
            }

            createOscillator() {
                return {
                    type: 'sine',
                    frequency: {
                        setValueAtTime: jest.fn(),
                        exponentialRampToValueAtTime: jest.fn(),
                        linearRampToValueAtTime: jest.fn()
                    },
                    connect: jest.fn(),
                    start: jest.fn(),
                    stop: jest.fn()
                };
            }

            createGain() {
                return {
                    gain: {
                        setValueAtTime: jest.fn(),
                        exponentialRampToValueAtTime: jest.fn(),
                        linearRampToValueAtTime: jest.fn()
                    },
                    connect: jest.fn()
                };
            }

            createBuffer(channels, length, sampleRate) {
                const channelData = new Float32Array(length);
                return {
                    numberOfChannels: channels,
                    length: length,
                    sampleRate: sampleRate,
                    getChannelData: jest.fn().mockReturnValue(channelData)
                };
            }

            createBufferSource() {
                return {
                    buffer: null,
                    connect: jest.fn(),
                    start: jest.fn(),
                    stop: jest.fn()
                };
            }

            createBiquadFilter() {
                return {
                    type: 'lowpass',
                    frequency: {
                        setValueAtTime: jest.fn(),
                        exponentialRampToValueAtTime: jest.fn(),
                        linearRampToValueAtTime: jest.fn()
                    },
                    connect: jest.fn()
                };
            }
        };
    }

    beforeEach(() => {
        mockAudioInstances = [];
        originalAudio = global.Audio;
        originalAudioContext = global.AudioContext;
        originalWebkitAudioContext = global.webkitAudioContext;

        global.Audio = MockAudio;
        global.AudioContext = createMockAudioContext();

        // Reset trạng thái AudioService
        AudioService.isUnlocked = false;
        AudioService.tempMuteClick = false;
        AudioService.sounds = {};
        AudioService.ctx = null;
    });

    afterEach(() => {
        global.Audio = originalAudio;
        global.AudioContext = originalAudioContext;
        global.webkitAudioContext = originalWebkitAudioContext;
    });

    // =========================================================================
    // 1. PUBLIC CONTRACT & STRUCTURE
    // =========================================================================
    describe("1. Public Contract & Structure", () => {
        test("AudioService phải xuất đầy đủ các thuộc tính và phương thức trong contract", () => {
            expect(AudioService).toBeDefined();
            expect(typeof AudioService.isUnlocked).toBe('boolean');
            expect(typeof AudioService.tempMuteClick).toBe('boolean');
            expect(typeof AudioService.sounds).toBe('object');
            expect(AudioService.ctx).toBeNull();

            expect(typeof AudioService.initContext).toBe('function');
            expect(typeof AudioService.init).toBe('function');
            expect(typeof AudioService.playSound).toBe('function');
            expect(typeof AudioService.playStartup).toBe('function');
            expect(typeof AudioService.playClick).toBe('function');
            expect(typeof AudioService.playTick).toBe('function');
            expect(typeof AudioService.playCorrect).toBe('function');
            expect(typeof AudioService.playWrong).toBe('function');
            expect(typeof AudioService.playVictory).toBe('function');
            expect(typeof AudioService.playDefeat).toBe('function');
            expect(typeof AudioService.playLose).toBe('function');
            expect(typeof AudioService.playBadge).toBe('function');
            expect(typeof AudioService.playSwordHit).toBe('function');
            expect(typeof AudioService.playMagicSpell).toBe('function');
            expect(typeof AudioService.playMessageNotification).toBe('function');
            expect(typeof AudioService.playMonter).toBe('function');
            expect(typeof AudioService.playBackground).toBe('function');
            expect(typeof AudioService.stopBackground).toBe('function');
            expect(typeof AudioService.playTdSound).toBe('function');
        });
    });

    // =========================================================================
    // 2. HTML5 AUDIO ASSET INITIALIZATION & PRELOADING (init)
    // =========================================================================
    describe("2. HTML5 Audio Initialization & Asset Preloading (init)", () => {
        test("init() phải nạp đủ 12 file MP3 với đúng đường dẫn và gọi .load()", () => {
            AudioService.init();

            const expectedAssets = {
                startup: '/sounds/startup.mp3',
                click: '/sounds/click.mp3',
                tick: '/sounds/click.mp3',
                correct: '/sounds/correct.mp3',
                wrong: '/sounds/wrong.mp3',
                victory: '/sounds/clapping.mp3',
                defeat: '/sounds/failed.mp3',
                lose: '/sounds/lose.mp3',
                sword_hit: '/sounds/sword hit.mp3',
                magic_spell: '/sounds/magic spell.mp3',
                background: '/sounds/background.mp3',
                monter: '/sounds/monter.mp3'
            };

            for (const [key, path] of Object.entries(expectedAssets)) {
                expect(AudioService.sounds[key]).toBeDefined();
                expect(AudioService.sounds[key].src).toBe(path);
                expect(AudioService.sounds[key].load).toHaveBeenCalled();
            }

            expect(mockAudioInstances.length).toBe(12);
        });

        test("init() phải thiết lập chính xác các mức âm lượng cố định (volume)", () => {
            AudioService.init();

            expect(AudioService.sounds.startup.volume).toBeCloseTo(0.95);
            expect(AudioService.sounds.click.volume).toBeCloseTo(0.9);
            expect(AudioService.sounds.tick.volume).toBeCloseTo(0.8);
            expect(AudioService.sounds.correct.volume).toBeCloseTo(1.0);
            expect(AudioService.sounds.wrong.volume).toBeCloseTo(1.0);
            expect(AudioService.sounds.victory.volume).toBeCloseTo(0.95);
            expect(AudioService.sounds.defeat.volume).toBeCloseTo(0.95);
            expect(AudioService.sounds.lose.volume).toBeCloseTo(0.95);
            expect(AudioService.sounds.sword_hit.volume).toBeCloseTo(0.85);
            expect(AudioService.sounds.magic_spell.volume).toBeCloseTo(0.85);
            expect(AudioService.sounds.monter.volume).toBeCloseTo(0.85);
            expect(AudioService.sounds.background.volume).toBeCloseTo(0.22);
        });

        test("init() phải có tính idempotent — gọi nhiều lần không tạo mới đè lên sounds đã có", () => {
            AudioService.init();
            expect(mockAudioInstances.length).toBe(12);

            AudioService.init();
            expect(mockAudioInstances.length).toBe(12);
        });
    });

    // =========================================================================
    // 3. SOUND PLAYBACK & ERROR REJECTION HANDLING (playSound)
    // =========================================================================
    describe("3. Sound Playback & Convenience Methods", () => {
        beforeEach(() => {
            AudioService.init();
        });

        test("playSound(name) đặt currentTime = 0 và gọi .play()", () => {
            const clickSound = AudioService.sounds.click;
            clickSound.currentTime = 1.5;

            AudioService.playSound('click');

            expect(clickSound.currentTime).toBe(0);
            expect(clickSound.play).toHaveBeenCalled();
        });

        test("playSound(name) với tên âm thanh không tồn tại thì an toàn bỏ qua", () => {
            expect(() => AudioService.playSound('non_existent_sound')).not.toThrow();
        });

        test("playSound(name) bắt lỗi promise rejection từ trình duyệt chặn autoplay mà không throw", async () => {
            const wrongSound = AudioService.sounds.wrong;
            wrongSound.play = jest.fn().mockReturnValue(Promise.reject(new Error("Autoplay blocked")));

            expect(() => AudioService.playSound('wrong')).not.toThrow();
        });

        test("Tất cả 12 convenience shortcut methods gọi đúng sound mapping tương ứng", () => {
            const spyPlaySound = jest.spyOn(AudioService, 'playSound');

            AudioService.playStartup();
            expect(spyPlaySound).toHaveBeenLastCalledWith('startup');

            AudioService.playClick();
            expect(spyPlaySound).toHaveBeenLastCalledWith('click');

            AudioService.playTick();
            expect(spyPlaySound).toHaveBeenLastCalledWith('tick');

            AudioService.playCorrect();
            expect(spyPlaySound).toHaveBeenLastCalledWith('correct');

            AudioService.playWrong();
            expect(spyPlaySound).toHaveBeenLastCalledWith('wrong');

            AudioService.playVictory();
            expect(spyPlaySound).toHaveBeenLastCalledWith('victory');

            AudioService.playDefeat();
            expect(spyPlaySound).toHaveBeenLastCalledWith('defeat');

            AudioService.playLose();
            expect(spyPlaySound).toHaveBeenLastCalledWith('lose');

            AudioService.playBadge();
            expect(spyPlaySound).toHaveBeenLastCalledWith('victory');

            AudioService.playSwordHit();
            expect(spyPlaySound).toHaveBeenLastCalledWith('sword_hit');

            AudioService.playMagicSpell();
            expect(spyPlaySound).toHaveBeenLastCalledWith('magic_spell');

            AudioService.playMonter();
            expect(spyPlaySound).toHaveBeenLastCalledWith('monter');

            spyPlaySound.mockRestore();
        });
    });

    // =========================================================================
    // 4. BACKGROUND MUSIC LIFECYCLE (playBackground / stopBackground)
    // =========================================================================
    describe("4. Background Music Lifecycle", () => {
        beforeEach(() => {
            AudioService.init();
        });

        test("playBackground() kích hoạt loop = true, volume = 0.22 và gọi .play()", () => {
            const bgSound = AudioService.sounds.background;
            AudioService.playBackground();

            expect(bgSound.loop).toBe(true);
            expect(bgSound.volume).toBeCloseTo(0.22);
            expect(bgSound.play).toHaveBeenCalled();
        });

        test("stopBackground() gọi .pause() và reset currentTime = 0", () => {
            const bgSound = AudioService.sounds.background;
            bgSound.currentTime = 10;

            AudioService.stopBackground();

            expect(bgSound.pause).toHaveBeenCalled();
            expect(bgSound.currentTime).toBe(0);
        });

        test("stopBackground() an toàn khi sounds.background chưa được khởi tạo", () => {
            AudioService.sounds = {};
            expect(() => AudioService.stopBackground()).not.toThrow();
        });
    });

    // =========================================================================
    // 5. WEB AUDIO CONTEXT & BROWSER COMPATIBILITY (initContext)
    // =========================================================================
    describe("5. Web Audio Context Initialization", () => {
        test("initContext() tạo instance AudioContext chuẩn", () => {
            AudioService.initContext();
            expect(AudioService.ctx).not.toBeNull();
            expect(AudioService.ctx.state).toBe('running');
        });

        test("initContext() hỗ trợ fallback webkitAudioContext khi AudioContext chuẩn không có", () => {
            delete global.AudioContext;
            global.webkitAudioContext = createMockAudioContext();

            AudioService.initContext();
            expect(AudioService.ctx).not.toBeNull();
        });

        test("initContext() không ném lỗi nếu trình duyệt không hỗ trợ Web Audio API", () => {
            delete global.AudioContext;
            delete global.webkitAudioContext;

            expect(() => AudioService.initContext()).not.toThrow();
            expect(AudioService.ctx).toBeNull();
        });
    });

    // =========================================================================
    // 6. MESSAGE NOTIFICATION SYNTHESIS (playMessageNotification)
    // =========================================================================
    describe("6. Message Notification Synthesis", () => {
        test("playMessageNotification() tạo 2 oscillator nốt kép D5 -> D6", () => {
            AudioService.initContext();
            const spyCreateOsc = jest.spyOn(AudioService.ctx, 'createOscillator');
            const spyCreateGain = jest.spyOn(AudioService.ctx, 'createGain');

            AudioService.playMessageNotification();

            expect(spyCreateOsc).toHaveBeenCalledTimes(2);
            expect(spyCreateGain).toHaveBeenCalledTimes(2);
        });

        test("playMessageNotification() tự động fallback sang playSound('click') nếu ctx = null", () => {
            delete global.AudioContext;
            delete global.webkitAudioContext;
            const spyPlaySound = jest.spyOn(AudioService, 'playSound').mockImplementation(() => {});

            AudioService.playMessageNotification();

            expect(spyPlaySound).toHaveBeenCalledWith('click');
            spyPlaySound.mockRestore();
        });
    });

    // =========================================================================
    // 7. PROCEDURAL TD SOUND SYNTHESIS (playTdSound)
    // =========================================================================
    describe("7. Procedural Tower Defense Sound Effects (playTdSound)", () => {
        test("playTdSound() bị chặn an toàn khi isUnlocked === false", () => {
            AudioService.isUnlocked = false;
            AudioService.initContext();
            const spyCreateOsc = jest.spyOn(AudioService.ctx, 'createOscillator');

            AudioService.playTdSound('archer');

            expect(spyCreateOsc).not.toHaveBeenCalled();
        });

        test("playTdSound() tự động resume AudioContext nếu đang ở trạng thái 'suspended'", () => {
            global.AudioContext = createMockAudioContext('suspended');
            AudioService.isUnlocked = true;
            AudioService.initContext();

            AudioService.playTdSound('archer');

            expect(AudioService.ctx.resume).toHaveBeenCalled();
        });

        test("playTdSound('archer') tổng hợp âm thanh cung tên vút bay", () => {
            AudioService.isUnlocked = true;
            AudioService.initContext();
            const spyCreateOsc = jest.spyOn(AudioService.ctx, 'createOscillator');

            AudioService.playTdSound('archer');

            expect(spyCreateOsc).toHaveBeenCalled();
        });

        test("playTdSound('bomb') tổng hợp âm thanh tiếng nổ pháo với Noise Buffer & Filter", () => {
            AudioService.isUnlocked = true;
            AudioService.initContext();
            const spyCreateBuffer = jest.spyOn(AudioService.ctx, 'createBuffer');
            const spyCreateFilter = jest.spyOn(AudioService.ctx, 'createBiquadFilter');

            AudioService.playTdSound('bomb');

            expect(spyCreateBuffer).toHaveBeenCalled();
            expect(spyCreateFilter).toHaveBeenCalled();
        });

        test("playTdSound('ice') tổng hợp âm thanh đóng băng lạnh sắc bén", () => {
            AudioService.isUnlocked = true;
            AudioService.initContext();
            const spyCreateOsc = jest.spyOn(AudioService.ctx, 'createOscillator');

            AudioService.playTdSound('ice');

            expect(spyCreateOsc).toHaveBeenCalledTimes(2);
        });

        test("playTdSound('sword_slash') tổng hợp âm thanh va chạm kiếm kim loại", () => {
            AudioService.isUnlocked = true;
            AudioService.initContext();
            const spyCreateOsc = jest.spyOn(AudioService.ctx, 'createOscillator');

            AudioService.playTdSound('sword_slash');

            expect(spyCreateOsc).toHaveBeenCalledTimes(2);
        });

        test("playTdSound('coin') tổng hợp âm thanh đồng xu vàng nốt B5/E6", () => {
            AudioService.isUnlocked = true;
            AudioService.initContext();
            const spyCreateOsc = jest.spyOn(AudioService.ctx, 'createOscillator');

            AudioService.playTdSound('coin');

            expect(spyCreateOsc).toHaveBeenCalled();
        });

        test("playTdSound('thunder') tổng hợp âm thanh sét đánh", () => {
            AudioService.isUnlocked = true;
            AudioService.initContext();
            const spyCreateBuffer = jest.spyOn(AudioService.ctx, 'createBuffer');
            const spyCreateOsc = jest.spyOn(AudioService.ctx, 'createOscillator');
            const spyCreateFilter = jest.spyOn(AudioService.ctx, 'createBiquadFilter');

            AudioService.playTdSound('thunder');

            expect(spyCreateBuffer).toHaveBeenCalled();
            expect(spyCreateOsc).toHaveBeenCalled();
            expect(spyCreateFilter).toHaveBeenCalled();
        });

        test("playTdSound(unknown) an toàn không throw lỗi", () => {
            AudioService.isUnlocked = true;
            expect(() => AudioService.playTdSound('unknown_effect')).not.toThrow();
        });
    });

    // =========================================================================
    // 8. STATE MANAGEMENT (isUnlocked / tempMuteClick)
    // =========================================================================
    describe("8. State Flags Management", () => {
        test("isUnlocked và tempMuteClick có thể đọc và ghi độc lập", () => {
            expect(AudioService.isUnlocked).toBe(false);
            expect(AudioService.tempMuteClick).toBe(false);

            AudioService.isUnlocked = true;
            AudioService.tempMuteClick = true;

            expect(AudioService.isUnlocked).toBe(true);
            expect(AudioService.tempMuteClick).toBe(true);
        });
    });
});
