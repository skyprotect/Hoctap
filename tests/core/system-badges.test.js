const SystemBadgesData = require('../../js/core/system-badges');

describe("Core SystemBadgesData Module (js/core/system-badges.js)", () => {

    test("SystemBadgesData được định nghĩa với đầy đủ 50 huy hiệu và các hàm tra cứu", () => {
        expect(SystemBadgesData).toBeDefined();
        expect(Array.isArray(SystemBadgesData.SYSTEM_BADGES)).toBe(true);
        expect(SystemBadgesData.SYSTEM_BADGES.length).toBe(50);
        expect(typeof SystemBadgesData.getSystemBadges).toBe('function');
        expect(typeof SystemBadgesData.getBadgeById).toBe('function');
        expect(typeof SystemBadgesData.getBadgesByClass).toBe('function');
    });

    test("Mỗi huy hiệu có đầy đủ các trường thông tin bắt buộc (id, name, desc, icon)", () => {
        SystemBadgesData.SYSTEM_BADGES.forEach(badge => {
            expect(typeof badge.id).toBe('string');
            expect(badge.id.length).toBeGreaterThan(0);
            expect(typeof badge.name).toBe('string');
            expect(typeof badge.desc).toBe('string');
            expect(typeof badge.icon).toBe('string');
        });
    });

    test("Không có ID huy hiệu nào bị trùng lặp trong toàn bộ 50 huy hiệu", () => {
        const ids = SystemBadgesData.SYSTEM_BADGES.map(b => b.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(50);
    });

    test("getBadgeById trả về đúng huy hiệu theo id hoặc undefined", () => {
        const nhapMon = SystemBadgesData.getBadgeById("nhap-mon");
        expect(nhapMon).toBeDefined();
        expect(nhapMon.name).toBe("Nhập Môn Toán 6");

        const unknown = SystemBadgesData.getBadgeById("unknown_badge_id");
        expect(unknown).toBeUndefined();

        expect(SystemBadgesData.getBadgeById(null)).toBeUndefined();
    });

    test("getBadgesByClass lọc chính xác theo khối lớp", () => {
        // Toàn bộ khi không truyền tham số
        expect(SystemBadgesData.getBadgesByClass().length).toBe(50);

        // Lớp 1 (huy hiệu chung + huy hiệu riêng lớp 1)
        const l1 = SystemBadgesData.getBadgesByClass("1");
        expect(l1.length).toBeGreaterThan(6);
        l1.forEach(b => {
            expect(!b.classLevel || b.classLevel === "1").toBe(true);
        });

        // Lớp 4
        const l4 = SystemBadgesData.getBadgesByClass("4");
        l4.forEach(b => {
            expect(!b.classLevel || b.classLevel === "4").toBe(true);
        });

        // Lớp 6
        const l6 = SystemBadgesData.getBadgesByClass("6");
        l6.forEach(b => {
            expect(!b.classLevel || b.classLevel === "6").toBe(true);
        });
    });
});
