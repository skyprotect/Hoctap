const TimeUtils = require('../../js/core/time-utils');

describe("Core TimeUtils Module (js/core/time-utils.js)", () => {

    test("TimeUtils được định nghĩa với đầy đủ 6 hàm công khai", () => {
        expect(TimeUtils).toBeDefined();
        expect(typeof TimeUtils.padZero).toBe('function');
        expect(typeof TimeUtils.formatDuration).toBe('function');
        expect(typeof TimeUtils.formatCountdown).toBe('function');
        expect(typeof TimeUtils.formatDateTimeVN).toBe('function');
        expect(typeof TimeUtils.formatDateVN).toBe('function');
        expect(typeof TimeUtils.getTodayDateString).toBe('function');
    });

    describe("1. padZero", () => {
        test("Thêm số 0 chính xác", () => {
            expect(TimeUtils.padZero(5)).toBe("05");
            expect(TimeUtils.padZero(15)).toBe("15");
            expect(TimeUtils.padZero(0)).toBe("00");
            expect(TimeUtils.padZero(7, 3)).toBe("007");
            expect(TimeUtils.padZero(null)).toBe("00");
        });
    });

    describe("2. formatDuration & formatCountdown", () => {
        test("Định dạng mm:ss khi dưới 1 giờ", () => {
            expect(TimeUtils.formatDuration(0)).toBe("00:00");
            expect(TimeUtils.formatDuration(59)).toBe("00:59");
            expect(TimeUtils.formatDuration(65)).toBe("01:05");
            expect(TimeUtils.formatDuration(125)).toBe("02:05");
            expect(TimeUtils.formatCountdown(65)).toBe("01:05");
        });

        test("Định dạng hh:mm:ss khi từ 1 giờ trở lên đối với formatDuration", () => {
            expect(TimeUtils.formatDuration(3600)).toBe("01:00:00");
            expect(TimeUtils.formatDuration(3665)).toBe("01:01:05");
            expect(TimeUtils.formatDuration(7322)).toBe("02:02:02");
        });

        test("Xử lý an toàn khi đầu vào âm hoặc không phải số", () => {
            expect(TimeUtils.formatDuration(-10)).toBe("00:00");
            expect(TimeUtils.formatDuration(null)).toBe("00:00");
            expect(TimeUtils.formatDuration(undefined)).toBe("00:00");
            expect(TimeUtils.formatDuration("invalid")).toBe("00:00");
        });
    });

    describe("3. formatDateTimeVN & formatDateVN", () => {
        test("Định dạng đúng ngày giờ chuẩn Việt Nam", () => {
            const date = new Date(2026, 7, 31, 14, 5); // 31/08/2026 14:05
            expect(TimeUtils.formatDateVN(date)).toBe("31/08/2026");
            expect(TimeUtils.formatDateTimeVN(date)).toBe("31/08/2026 14:05");
        });

        test("Xử lý chuỗi ngày hoặc timestamp", () => {
            const dateStr = "2026-08-31T07:05:00Z";
            expect(TimeUtils.formatDateVN(dateStr).length).toBe(10);
            expect(TimeUtils.formatDateTimeVN(dateStr).length).toBe(16);
        });

        test("Xử lý an toàn khi ngày không hợp lệ hoặc rỗng", () => {
            expect(TimeUtils.formatDateVN("")).toBe("");
            expect(TimeUtils.formatDateVN(null)).toBe("");
            expect(TimeUtils.formatDateVN("invalid_date")).toBe("");
            expect(TimeUtils.formatDateTimeVN("")).toBe("");
        });
    });

    describe("4. getTodayDateString", () => {
        test("Trả về chuỗi YYYY-MM-DD", () => {
            const date = new Date(2026, 7, 31);
            expect(TimeUtils.getTodayDateString(date)).toBe("2026-08-31");
            expect(TimeUtils.getTodayDateString().length).toBe(10);
        });
    });
});
