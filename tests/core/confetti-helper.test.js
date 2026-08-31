/**
 * tests/core/confetti-helper.test.js
 * Unit and Characterization tests for ConfettiHelper.
 */

const ConfettiHelper = require('../../js/core/confetti-helper');

describe('ConfettiHelper — Tiện ích hiệu ứng pháo hoa giấy Canvas', () => {
    let mockCanvas;
    let mockCtx;

    beforeEach(() => {
        // Reset timers và animation frame mocks
        jest.useFakeTimers();

        mockCtx = {
            clearRect: jest.fn(),
            beginPath: jest.fn(),
            lineWidth: 0,
            strokeStyle: '',
            moveTo: jest.fn(),
            lineTo: jest.fn(),
            stroke: jest.fn()
        };

        mockCanvas = {
            getContext: jest.fn(() => mockCtx),
            width: 800,
            height: 600
        };

        // Mock document and window
        global.document = {
            getElementById: jest.fn(id => (id === 'confetti-canvas' ? mockCanvas : null))
        };

        global.window = {
            innerWidth: 1024,
            innerHeight: 768,
            addEventListener: jest.fn()
        };

        global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
        global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));
    });

    afterEach(() => {
        jest.useRealTimers();
        if (ConfettiHelper && typeof ConfettiHelper.stop === 'function') {
            ConfettiHelper.stop();
        }
    });

    test('Xuất khẩu đầy đủ API và UMD module', () => {
        expect(ConfettiHelper).toBeDefined();
        expect(typeof ConfettiHelper.init).toBe('function');
        expect(typeof ConfettiHelper.resize).toBe('function');
        expect(typeof ConfettiHelper.start).toBe('function');
        expect(typeof ConfettiHelper.loop).toBe('function');
        expect(typeof ConfettiHelper.stop).toBe('function');
        expect(Array.isArray(ConfettiHelper.colors)).toBe(true);
        expect(ConfettiHelper.colors.length).toBeGreaterThan(0);
    });

    test('Khởi tạo canvas và lắng nghe sự kiện resize', () => {
        ConfettiHelper.hasResizeHandler = false;
        ConfettiHelper.init();

        expect(global.document.getElementById).toHaveBeenCalledWith('confetti-canvas');
        expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
        expect(mockCanvas.width).toBe(1024);
        expect(mockCanvas.height).toBe(768);
        expect(global.window.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    });

    test('Xử lý an toàn khi không tìm thấy phần tử canvas', () => {
        global.document.getElementById.mockReturnValue(null);
        expect(() => {
            ConfettiHelper.init();
            ConfettiHelper.start();
            ConfettiHelper.loop();
            ConfettiHelper.stop();
        }).not.toThrow();
    });

    test('Bắt đầu hiệu ứng start() sinh đúng 150 hạt confetti và kích hoạt vòng lặp animation', () => {
        ConfettiHelper.start();

        expect(ConfettiHelper.active).toBe(true);
        expect(ConfettiHelper.particles.length).toBe(150);

        const particle = ConfettiHelper.particles[0];
        expect(particle).toHaveProperty('x');
        expect(particle).toHaveProperty('y');
        expect(particle).toHaveProperty('r');
        expect(particle).toHaveProperty('color');
        expect(ConfettiHelper.colors).toContain(particle.color);
    });

    test('Dừng hiệu ứng sau 4 giây tự động', () => {
        ConfettiHelper.start();
        expect(ConfettiHelper.active).toBe(true);

        jest.advanceTimersByTime(4000);
        expect(ConfettiHelper.active).toBe(false);
        expect(mockCtx.clearRect).toHaveBeenCalled();
    });

    test('Dừng thủ công bằng stop() xóa trạng thái active và canvas', () => {
        ConfettiHelper.start();
        expect(ConfettiHelper.active).toBe(true);

        ConfettiHelper.stop();
        expect(ConfettiHelper.active).toBe(false);
        expect(mockCtx.clearRect).toHaveBeenCalled();
    });

    test('Gọi start() nhiều lần liên tiếp hủy bỏ frame trước và reset lại bộ hạt', () => {
        ConfettiHelper.start();
        const firstFrame = ConfettiHelper.animationFrame;

        ConfettiHelper.start();
        expect(global.cancelAnimationFrame).toHaveBeenCalled();
        expect(ConfettiHelper.active).toBe(true);
        expect(ConfettiHelper.particles.length).toBe(150);
    });
});
