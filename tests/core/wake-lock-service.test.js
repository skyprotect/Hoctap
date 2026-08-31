/**
 * Unit & Characterization Tests cho WakeLockService
 */
const WakeLockService = require('../../js/core/wake-lock-service');

describe("WakeLockService Unit Tests", () => {
    let originalNavigator;
    let originalDocument;
    let mockListeners = {};

    beforeEach(() => {
        mockListeners = {};
        WakeLockService.cleanup();

        // Setup mock document
        global.document = {
            visibilityState: 'visible',
            addEventListener: jest.fn((event, handler, options) => {
                if (!mockListeners[event]) mockListeners[event] = [];
                mockListeners[event].push(handler);
            }),
            removeEventListener: jest.fn((event, handler, options) => {
                if (mockListeners[event]) {
                    mockListeners[event] = mockListeners[event].filter(h => h !== handler);
                }
            })
        };

        // Setup mock console
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        WakeLockService.cleanup();
        jest.restoreAllMocks();
    });

    test("1. isSupported() trả về false khi navigator không có wakeLock", () => {
        global.navigator = {};
        expect(WakeLockService.isSupported()).toBe(false);
    });

    test("2. isSupported() trả về true khi navigator.wakeLock tồn tại", () => {
        global.navigator = {
            wakeLock: { request: jest.fn() }
        };
        expect(WakeLockService.isSupported()).toBe(true);
    });

    test("3. requestWakeLock() cảnh báo khi trình duyệt không hỗ trợ", async () => {
        global.navigator = {};
        const sentinel = await WakeLockService.requestWakeLock();
        expect(sentinel).toBeNull();
        expect(console.warn).toHaveBeenCalledWith('Trình duyệt không hỗ trợ Screen Wake Lock API.');
    });

    test("4. requestWakeLock() xin quyền thành công và ghi log", async () => {
        const mockSentinel = { released: false, type: 'screen' };
        global.navigator = {
            wakeLock: {
                request: jest.fn().mockResolvedValue(mockSentinel)
            }
        };

        const result = await WakeLockService.requestWakeLock();
        expect(result).toBe(mockSentinel);
        expect(WakeLockService.getSentinel()).toBe(mockSentinel);
        expect(global.navigator.wakeLock.request).toHaveBeenCalledWith('screen');
        expect(console.log).toHaveBeenCalledWith('Screen Wake Lock đã được kích hoạt thành công!');
    });

    test("5. requestWakeLock() bắt lỗi an toàn khi request bị reject (không ném unhandled error)", async () => {
        const err = new Error("NotAllowedError: Permission denied");
        err.name = "NotAllowedError";
        global.navigator = {
            wakeLock: {
                request: jest.fn().mockRejectedValue(err)
            }
        };

        const result = await WakeLockService.requestWakeLock();
        expect(result).toBeNull();
        expect(console.warn).toHaveBeenCalledWith('Lỗi kích hoạt Screen Wake Lock: NotAllowedError, NotAllowedError: Permission denied');
    });

    test("6. init() đăng ký one-shot click/touchstart và visibilitychange", async () => {
        const mockSentinel = { released: false, type: 'screen' };
        global.navigator = {
            wakeLock: {
                request: jest.fn().mockResolvedValue(mockSentinel)
            }
        };

        WakeLockService.init();

        expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
        expect(document.addEventListener).toHaveBeenCalledWith('touchstart', expect.any(Function));
        expect(document.addEventListener).toHaveBeenCalledWith('visibilitychange', expect.any(Function));

        // Giả lập tương tác click của người dùng
        const clickHandler = mockListeners['click'][0];
        expect(clickHandler).toBeDefined();
        await clickHandler();

        // Kiểm tra sau click, đã gọi request và gỡ listener
        expect(global.navigator.wakeLock.request).toHaveBeenCalledWith('screen');
        expect(document.removeEventListener).toHaveBeenCalledWith('click', clickHandler);
        expect(document.removeEventListener).toHaveBeenCalledWith('touchstart', clickHandler);
    });

    test("7. Tự động xin lại wakeLock khi tab visible trở lại sau khi đã từng có wakeLock", async () => {
        const mockSentinel = { released: false, type: 'screen' };
        global.navigator = {
            wakeLock: {
                request: jest.fn().mockResolvedValue(mockSentinel)
            }
        };

        WakeLockService.init();

        // Kích hoạt tương tác đầu tiên
        const clickHandler = mockListeners['click'][0];
        await clickHandler();
        expect(WakeLockService.getSentinel()).toBe(mockSentinel);

        // Reset spy count
        global.navigator.wakeLock.request.mockClear();

        // Tab chuyển sang hidden rồi visible lại
        document.visibilityState = 'visible';
        const visHandler = mockListeners['visibilitychange'][0];
        expect(visHandler).toBeDefined();

        await visHandler();
        expect(global.navigator.wakeLock.request).toHaveBeenCalledWith('screen');
    });

    test("8. Không xin lại wakeLock khi tab visible nếu trước đó chưa từng có wakeLock", async () => {
        global.navigator = {
            wakeLock: { request: jest.fn() }
        };

        WakeLockService.init();
        document.visibilityState = 'visible';

        const visHandler = mockListeners['visibilitychange'][0];
        await visHandler();

        expect(global.navigator.wakeLock.request).not.toHaveBeenCalled();
    });
});
