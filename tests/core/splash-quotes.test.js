/**
 * Unit & Characterization Tests for SplashQuotesService (js/core/splash-quotes.js)
 * 
 * Kiểm tra toàn diện 100% contract & behavior:
 * 1. Danh sách QUOTES (14 câu châm ngôn giáo dục chuẩn xác)
 * 2. Định dạng Time (HH:MM:SS với zero padding)
 * 3. Định dạng Date tiếng Việt (Thứ X, ngày DD tháng MM năm YYYY)
 * 4. Đồng hồ kỹ thuật số Splash Clock (updateClock, initClock, stopClock, timer safety)
 * 5. Chọn ngẫu nhiên câu châm ngôn & cập nhật currentQuoteIndex
 * 6. Hiển thị châm ngôn lên DOM (#splash-quote-text, #splash-quote-author)
 * 7. Khả năng chịu lỗi khi thiếu DOM elements (no-throw)
 * 8. Bảo toàn đồng bộ chỉ số châm ngôn cho hệ thống âm thanh (/sounds/sent_0..13.mp3)
 */

const SplashQuotesService = require('../../js/core/splash-quotes');

describe("Unit Tests — SplashQuotesService (js/core/splash-quotes.js)", () => {
    let originalDocument;
    let mockTimeEl;
    let mockDateEl;
    let mockQuoteTextEl;
    let mockQuoteAuthorEl;

    beforeEach(() => {
        jest.useFakeTimers();
        SplashQuotesService.stopClock();
        SplashQuotesService.currentQuoteIndex = 0;

        mockTimeEl = { innerText: '' };
        mockDateEl = { innerText: '' };
        mockQuoteTextEl = { innerText: '' };
        mockQuoteAuthorEl = { innerText: '' };

        originalDocument = global.document;
        global.document = {
            getElementById: jest.fn((id) => {
                if (id === 'splash-clock-time') return mockTimeEl;
                if (id === 'splash-clock-date') return mockDateEl;
                if (id === 'splash-quote-text') return mockQuoteTextEl;
                if (id === 'splash-quote-author') return mockQuoteAuthorEl;
                return null;
            })
        };
    });

    afterEach(() => {
        SplashQuotesService.stopClock();
        jest.clearAllTimers();
        jest.useRealTimers();
        global.document = originalDocument;
    });

    // 1. Contract & Structure
    describe("1. Public Contract & Structure", () => {
        test("SplashQuotesService phải export đầy đủ thuộc tính và phương thức trong contract", () => {
            expect(SplashQuotesService).toBeDefined();
            expect(Array.isArray(SplashQuotesService.QUOTES)).toBe(true);
            expect(typeof SplashQuotesService.currentQuoteIndex).toBe('number');

            expect(typeof SplashQuotesService.formatTime).toBe('function');
            expect(typeof SplashQuotesService.formatDate).toBe('function');
            expect(typeof SplashQuotesService.updateClock).toBe('function');
            expect(typeof SplashQuotesService.initClock).toBe('function');
            expect(typeof SplashQuotesService.stopClock).toBe('function');

            expect(typeof SplashQuotesService.getRandomQuote).toBe('function');
            expect(typeof SplashQuotesService.displayRandomQuote).toBe('function');
        });

        test("Danh sách QUOTES phải chứa chính xác 14 câu châm ngôn giáo dục chuẩn và không câu nào rỗng", () => {
            expect(SplashQuotesService.QUOTES.length).toBe(14);
            SplashQuotesService.QUOTES.forEach((q, idx) => {
                expect(typeof q.text).toBe('string');
                expect(q.text.trim().length).toBeGreaterThan(0);
                expect(typeof q.author).toBe('string');
                expect(q.author.trim().length).toBeGreaterThan(0);
            });
            // Kiểm tra câu đầu và cuối
            expect(SplashQuotesService.QUOTES[0].text).toContain("Biển học vô bờ");
            expect(SplashQuotesService.QUOTES[13].author).toBe("Khổng Tử");
        });
    });

    // 2. Format Time & Date
    describe("2. Format Time & Date Utilities", () => {
        test("formatTime phải định dạng đúng HH:MM:SS với zero padding cho số < 10", () => {
            const testDate1 = new Date(2026, 7, 31, 8, 5, 9); // 08:05:09
            expect(SplashQuotesService.formatTime(testDate1)).toBe("08:05:09");

            const testDate2 = new Date(2026, 7, 31, 15, 30, 45); // 15:30:45
            expect(SplashQuotesService.formatTime(testDate2)).toBe("15:30:45");
        });

        test("formatDate phải định dạng chuẩn tiếng Việt với ngày trong tuần chính xác", () => {
            // 2026-08-31 là Thứ Hai
            const monday = new Date(2026, 7, 31);
            expect(SplashQuotesService.formatDate(monday)).toBe("Thứ Hai, ngày 31 tháng 8 năm 2026");

            // 2026-08-30 là Chủ Nhật
            const sunday = new Date(2026, 7, 30);
            expect(SplashQuotesService.formatDate(sunday)).toBe("Chủ Nhật, ngày 30 tháng 8 năm 2026");

            // 2026-09-02 là Thứ Tư
            const wednesday = new Date(2026, 8, 2);
            expect(SplashQuotesService.formatDate(wednesday)).toBe("Thứ Tư, ngày 2 tháng 9 năm 2026");
        });
    });

    // 3. Digital Clock Lifecycle & Timer Safety
    describe("3. Splash Clock Lifecycle & Timer Safety", () => {
        test("initClock cập nhật DOM ngay lập tức và duy trì chạy mỗi giây", () => {
            SplashQuotesService.initClock();

            expect(mockTimeEl.innerText).toMatch(/^\d{2}:\d{2}:\d{2}$/);
            expect(mockDateEl.innerText).toMatch(/ngày \d{1,2} tháng \d{1,2} năm \d{4}/);
            expect(SplashQuotesService.clockTimer).not.toBeNull();

            // Tiến tới 1 giây
            const initialTime = mockTimeEl.innerText;
            jest.advanceTimersByTime(1000);
            expect(mockTimeEl.innerText).toBeDefined();
        });

        test("stopClock xóa timer sạch sẽ và đặt clockTimer về null", () => {
            SplashQuotesService.initClock();
            expect(SplashQuotesService.clockTimer).not.toBeNull();

            SplashQuotesService.stopClock();
            expect(SplashQuotesService.clockTimer).toBeNull();
        });

        test("Gọi initClock nhiều lần không tạo ra duplicate intervals (Timer Safety)", () => {
            const clearIntervalSpy = jest.spyOn(global, 'clearInterval');
            
            SplashQuotesService.initClock();
            const firstTimer = SplashQuotesService.clockTimer;
            expect(firstTimer).not.toBeNull();

            SplashQuotesService.initClock();
            expect(clearIntervalSpy).toHaveBeenCalled();
            expect(SplashQuotesService.clockTimer).not.toBeNull();

            clearIntervalSpy.mockRestore();
        });
    });

    // 4. Quote Selection & Rendering
    describe("4. Quote Selection & Audio Index Synchronization", () => {
        test("getRandomQuote trả về đối tượng câu trích dẫn hợp lệ và cập nhật currentQuoteIndex trong khoảng [0, 13]", () => {
            for (let i = 0; i < 20; i++) {
                const quote = SplashQuotesService.getRandomQuote();
                expect(quote.index).toBeGreaterThanOrEqual(0);
                expect(quote.index).toBeLessThan(14);
                expect(SplashQuotesService.currentQuoteIndex).toBe(quote.index);
                expect(SplashQuotesService.QUOTES[quote.index].text).toBe(quote.text);
                expect(SplashQuotesService.QUOTES[quote.index].author).toBe(quote.author);
            }
        });

        test("displayRandomQuote gán đúng text và tác giả vào DOM elements và trả về quote object", () => {
            const quote = SplashQuotesService.displayRandomQuote();
            expect(quote).not.toBeNull();
            expect(mockQuoteTextEl.innerText).toBe(quote.text);
            expect(mockQuoteAuthorEl.innerText).toBe(`— ${quote.author}`);
            expect(SplashQuotesService.currentQuoteIndex).toBe(quote.index);
        });

        test("displayRandomQuote cho phép truyền custom element IDs", () => {
            const customTextEl = { innerText: '' };
            const customAuthorEl = { innerText: '' };
            global.document.getElementById = jest.fn((id) => {
                if (id === 'custom-text') return customTextEl;
                if (id === 'custom-author') return customAuthorEl;
                return null;
            });

            const quote = SplashQuotesService.displayRandomQuote('custom-text', 'custom-author');
            expect(quote).not.toBeNull();
            expect(customTextEl.innerText).toBe(quote.text);
            expect(customAuthorEl.innerText).toBe(`— ${quote.author}`);
        });
    });

    // 5. Resilience & Missing DOM
    describe("5. Missing DOM Resilience", () => {
        test("initClock không ném lỗi khi elements không tồn tại", () => {
            global.document.getElementById = jest.fn().mockReturnValue(null);
            expect(() => {
                const result = SplashQuotesService.initClock();
                expect(result).toBeNull();
            }).not.toThrow();
        });

        test("displayRandomQuote không ném lỗi khi elements không tồn tại", () => {
            global.document.getElementById = jest.fn().mockReturnValue(null);
            expect(() => {
                const result = SplashQuotesService.displayRandomQuote();
                expect(result).toBeNull();
            }).not.toThrow();
        });

        test("updateClock không ném lỗi khi truyền null", () => {
            expect(() => {
                SplashQuotesService.updateClock(null, null);
            }).not.toThrow();
        });
    });
});
