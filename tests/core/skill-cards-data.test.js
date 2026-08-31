const SkillCardsData = require('../../js/core/skill-cards-data');

describe("Core SkillCardsData Module (js/core/skill-cards-data.js)", () => {

    test("SkillCardsData được định nghĩa với đầy đủ 50 thẻ và các hàm tra cứu", () => {
        expect(SkillCardsData).toBeDefined();
        expect(Array.isArray(SkillCardsData.SKILL_CARDS)).toBe(true);
        expect(SkillCardsData.SKILL_CARDS.length).toBe(50);
        expect(typeof SkillCardsData.getSkillCards).toBe('function');
        expect(typeof SkillCardsData.getSkillCardById).toBe('function');
        expect(typeof SkillCardsData.getSkillCardsByClass).toBe('function');
    });

    test("Mỗi thẻ kỹ năng có đầy đủ các thuộc tính bắt buộc (id, name, desc, icon, color)", () => {
        SkillCardsData.SKILL_CARDS.forEach(card => {
            expect(typeof card.id).toBe('string');
            expect(card.id.length).toBeGreaterThan(0);
            expect(typeof card.name).toBe('string');
            expect(typeof card.desc).toBe('string');
            expect(typeof card.icon).toBe('string');
            expect(typeof card.color).toBe('string');
        });
    });

    test("Không có ID thẻ nào bị trùng lặp trong toàn bộ 50 thẻ", () => {
        const ids = SkillCardsData.SKILL_CARDS.map(c => c.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(50);
    });

    test("getSkillCardById trả về đúng thẻ theo id hoặc undefined nếu không tồn tại", () => {
        const listeningMaster = SkillCardsData.getSkillCardById("listening_master");
        expect(listeningMaster).toBeDefined();
        expect(listeningMaster.name).toBe("Listening Wizard");

        const unknown = SkillCardsData.getSkillCardById("non_existent_card_id");
        expect(unknown).toBeUndefined();

        expect(SkillCardsData.getSkillCardById(null)).toBeUndefined();
    });

    test("getSkillCardsByClass lọc chính xác theo khối lớp", () => {
        // Toàn bộ 50 thẻ khi không truyền classLevel
        expect(SkillCardsData.getSkillCardsByClass().length).toBe(50);

        // Lớp 1 (thẻ chung + thẻ riêng lớp 1)
        const class1Cards = SkillCardsData.getSkillCardsByClass("1");
        expect(class1Cards.length).toBeGreaterThan(8);
        class1Cards.forEach(c => {
            expect(!c.classLevel || c.classLevel === "1").toBe(true);
        });

        // Lớp 4
        const class4Cards = SkillCardsData.getSkillCardsByClass("4");
        class4Cards.forEach(c => {
            expect(!c.classLevel || c.classLevel === "4").toBe(true);
        });

        // Lớp 6
        const class6Cards = SkillCardsData.getSkillCardsByClass("6");
        class6Cards.forEach(c => {
            expect(!c.classLevel || c.classLevel === "6").toBe(true);
        });
    });
});
