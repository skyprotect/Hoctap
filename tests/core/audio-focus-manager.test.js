/**
 * Unit test for AudioFocusManager (js/core/audio-focus-manager.js)
 * 
 * Kiểm tra:
 * 1. Phân cấp ưu tiên (CURRICULUM_TASK > STARTUP_PASSIVE / PASSIVE_PLAYER > SECONDARY_QUOTE)
 * 2. Chiếm quyền (Preemption) và tự động gọi onInterrupt
 * 3. Tự động gọi pause trên audioElement cũ
 * 4. Từ chối cấp focus cho nguồn có priority thấp hơn
 * 5. Giải phóng focus (abandonAudioFocus)
 * 6. Ép buộc dừng toàn bộ (stopAll)
 * 7. Đảm bảo Single Active Educational Audio Source
 */

const AudioFocusManager = require('../../js/core/audio-focus-manager');

describe("Unit Tests — AudioFocusManager (js/core/audio-focus-manager.js)", () => {
    beforeEach(() => {
        AudioFocusManager.stopAll('TEST_RESET');
    });

    test("1. Cấp focus thành công khi chưa có nguồn nào đang chạy", () => {
        const granted = AudioFocusManager.requestAudioFocus('STARTUP_PASSIVE', AudioFocusManager.PRIORITY.STARTUP_PASSIVE);
        expect(granted).toBe(true);
        expect(AudioFocusManager.hasFocus('STARTUP_PASSIVE')).toBe(true);
        expect(AudioFocusManager.getCurrentFocus().sourceId).toBe('STARTUP_PASSIVE');
    });

    test("2. Nguồn có priority cao hơn (CURRICULUM_TASK = 10) chiếm quyền nguồn thấp hơn (STARTUP_PASSIVE = 5)", () => {
        let interrupted = false;
        let preemptInfo = null;
        const mockAudioPassive = { pause: jest.fn() };

        // Passive bắt đầu phát
        AudioFocusManager.requestAudioFocus(
            'STARTUP_PASSIVE',
            AudioFocusManager.PRIORITY.STARTUP_PASSIVE,
            (info) => {
                interrupted = true;
                preemptInfo = info;
            },
            mockAudioPassive
        );

        expect(AudioFocusManager.hasFocus('STARTUP_PASSIVE')).toBe(true);

        // Curriculum (học từ vựng) phát
        const mockAudioVocab = { pause: jest.fn() };
        const granted = AudioFocusManager.requestAudioFocus(
            'CURRICULUM_TASK',
            AudioFocusManager.PRIORITY.CURRICULUM_TASK,
            null,
            mockAudioVocab
        );

        expect(granted).toBe(true);
        expect(AudioFocusManager.hasFocus('CURRICULUM_TASK')).toBe(true);
        expect(AudioFocusManager.hasFocus('STARTUP_PASSIVE')).toBe(false);

        // Passive phải bị ngắt và pause
        expect(interrupted).toBe(true);
        expect(preemptInfo.preemptedBy).toBe('CURRICULUM_TASK');
        expect(mockAudioPassive.pause).toHaveBeenCalledTimes(1);
    });

    test("3. Từ chối cấp focus cho nguồn có priority thấp hơn (SECONDARY_QUOTE = 1) khi CURRICULUM_TASK = 10 đang chạy", () => {
        AudioFocusManager.requestAudioFocus('CURRICULUM_TASK', AudioFocusManager.PRIORITY.CURRICULUM_TASK);

        const quoteGranted = AudioFocusManager.requestAudioFocus('SECONDARY_QUOTE', AudioFocusManager.PRIORITY.SECONDARY_QUOTE);
        expect(quoteGranted).toBe(false);
        expect(AudioFocusManager.hasFocus('CURRICULUM_TASK')).toBe(true);
        expect(AudioFocusManager.hasFocus('SECONDARY_QUOTE')).toBe(false);
    });

    test("4. abandonAudioFocus giải phóng focus an toàn", () => {
        AudioFocusManager.requestAudioFocus('CURRICULUM_TASK', AudioFocusManager.PRIORITY.CURRICULUM_TASK);
        expect(AudioFocusManager.hasFocus('CURRICULUM_TASK')).toBe(true);

        AudioFocusManager.abandonAudioFocus('CURRICULUM_TASK');
        expect(AudioFocusManager.hasFocus('CURRICULUM_TASK')).toBe(false);
        expect(AudioFocusManager.getCurrentFocus()).toBeNull();
    });

    test("5. Không cho phép nguồn khác giải phóng focus của nguồn hiện tại", () => {
        AudioFocusManager.requestAudioFocus('CURRICULUM_TASK', AudioFocusManager.PRIORITY.CURRICULUM_TASK);

        AudioFocusManager.abandonAudioFocus('RANDOM_SOURCE');
        expect(AudioFocusManager.hasFocus('CURRICULUM_TASK')).toBe(true);
    });

    test("6. stopAll dừng toàn diện và kích hoạt onInterrupt", () => {
        let interrupted = false;
        const mockAudio = { pause: jest.fn(), currentTime: 10 };

        AudioFocusManager.requestAudioFocus(
            'STARTUP_PASSIVE',
            5,
            () => { interrupted = true; },
            mockAudio
        );

        AudioFocusManager.stopAll('USER_NAVIGATE_AWAY');
        expect(interrupted).toBe(true);
        expect(mockAudio.pause).toHaveBeenCalled();
        expect(mockAudio.currentTime).toBe(0);
        expect(AudioFocusManager.getCurrentFocus()).toBeNull();
    });
});
