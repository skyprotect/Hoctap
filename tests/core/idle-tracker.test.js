/**
 * Unit & Characterization Tests cho IdleTracker
 */
const IdleTracker = require('../../js/core/idle-tracker');

describe("IdleTracker Unit Tests", () => {
    let mockListeners = {};

    beforeEach(() => {
        jest.useFakeTimers();
        mockListeners = {};
        IdleTracker.destroy();

        global.document = {
            addEventListener: jest.fn((event, handler, useCapture) => {
                if (!mockListeners[event]) mockListeners[event] = [];
                mockListeners[event].push({ handler, useCapture });
            }),
            removeEventListener: jest.fn((event, handler, useCapture) => {
                if (mockListeners[event]) {
                    mockListeners[event] = mockListeners[event].filter(item => item.handler !== handler);
                }
            })
        };
    });

    afterEach(() => {
        IdleTracker.destroy();
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    test("1. init() đăng ký đúng 5 sự kiện tương tác với capture phase = true", () => {
        IdleTracker.init();

        const expectedEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        expectedEvents.forEach(evt => {
            expect(document.addEventListener).toHaveBeenCalledWith(evt, expect.any(Function), true);
        });
    });

    test("2. Tương tác người dùng reset bộ đếm idleTime về 0", () => {
        IdleTracker.init({
            timeoutSeconds: 10,
            isAppActive: () => true,
            isBusy: () => false
        });

        // Chạy 5 giây
        jest.advanceTimersByTime(5000);
        expect(IdleTracker.getIdleTime()).toBe(5);

        // Giả lập tương tác mousemove
        const mousemoveHandler = mockListeners['mousemove'][0].handler;
        mousemoveHandler();

        expect(IdleTracker.getIdleTime()).toBe(0);
    });

    test("3. Không tăng idleTime khi isAppActive() === false (đang ở Splash Screen)", () => {
        IdleTracker.init({
            timeoutSeconds: 10,
            isAppActive: () => false,
            isBusy: () => false
        });

        jest.advanceTimersByTime(5000);
        expect(IdleTracker.getIdleTime()).toBe(0);
    });

    test("4. Không tăng idleTime khi isBusy() === true (đang xem video hoặc làm bài)", () => {
        IdleTracker.init({
            timeoutSeconds: 10,
            isAppActive: () => true,
            isBusy: () => true
        });

        jest.advanceTimersByTime(5000);
        expect(IdleTracker.getIdleTime()).toBe(0);
    });

    test("5. Tăng idleTime mỗi giây khi isAppActive() === true và isBusy() === false", () => {
        IdleTracker.init({
            timeoutSeconds: 600,
            isAppActive: () => true,
            isBusy: () => false
        });

        jest.advanceTimersByTime(10000);
        expect(IdleTracker.getIdleTime()).toBe(10);
    });

    test("6. Kích hoạt onIdle() và reset idleTime khi đạt ngưỡng timeout", () => {
        const onIdleMock = jest.fn();

        IdleTracker.init({
            timeoutSeconds: 600,
            onIdle: onIdleMock,
            isAppActive: () => true,
            isBusy: () => false
        });

        // Tiến tới 599s -> chưa gọi onIdle
        jest.advanceTimersByTime(599000);
        expect(onIdleMock).not.toHaveBeenCalled();
        expect(IdleTracker.getIdleTime()).toBe(599);

        // Tiến thêm 1s -> chạm 600s -> gọi onIdle và reset về 0
        jest.advanceTimersByTime(1000);
        expect(onIdleMock).toHaveBeenCalledTimes(1);
        expect(IdleTracker.getIdleTime()).toBe(0);
    });

    test("7. destroy() dọn dẹp sạch interval và gỡ bỏ toàn bộ event listeners", () => {
        IdleTracker.init({
            timeoutSeconds: 10,
            isAppActive: () => true,
            isBusy: () => false
        });

        IdleTracker.destroy();

        const expectedEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        expectedEvents.forEach(evt => {
            expect(document.removeEventListener).toHaveBeenCalledWith(evt, expect.any(Function), true);
        });

        // Sau destroy, timer không còn chạy
        jest.advanceTimersByTime(5000);
        expect(IdleTracker.getIdleTime()).toBe(0);
    });
});
