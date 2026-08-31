const { evaluateBadgeRules } = require('../../js/core/badge-rules-evaluator');

describe('BadgeRulesEvaluator Unit Test Suite', () => {
    const mockSystemBadges = [
        { id: "nhap-mon", name: "Nhập môn" },
        { id: "khoi-dau-vung-vang", name: "Khởi đầu vững vàng" },
        { id: "streak-3", name: "Chuỗi 3 ngày" },
        { id: "master-of-math", name: "Đại sứ Toán học" }
    ];

    describe('1. Cơ bản & Ngăn ngừa trùng lặp', () => {
        test('Không có điều kiện nào đạt -> trả về mảng rỗng []', () => {
            const state = { xp: 0, streak: 0, badges: [] };
            const context = { lessonId: "bai-1", score: 50, timeSpent: 100 };
            const result = evaluateBadgeRules(state, context, mockSystemBadges);
            expect(result).toEqual([]);
        });

        test('Đạt điều kiện nhưng huy hiệu đã có trong state.badges -> không trả về lại', () => {
            const state = { xp: 0, streak: 0, badges: ["nhap-mon"] };
            const context = { lessonId: "bai-1", score: 80 };
            const result = evaluateBadgeRules(state, context, mockSystemBadges);
            expect(result).not.toContain("nhap-mon");
        });

        test('Xử lý an toàn khi state hoặc context là null/undefined', () => {
            expect(evaluateBadgeRules(null, null, null)).toEqual([]);
            expect(evaluateBadgeRules(undefined, undefined, undefined)).toEqual([]);
        });
    });

    describe('2. Ngưỡng Điểm số & Tốc độ', () => {
        test('score = 79 không đạt nhap-mon, score = 80 đạt nhap-mon', () => {
            expect(evaluateBadgeRules({}, { score: 79 })).not.toContain("nhap-mon");
            expect(evaluateBadgeRules({}, { score: 80 })).toContain("nhap-mon");
        });

        test('score = 100 đạt đồng thời nhap-mon và khoi-dau-vung-vang', () => {
            const result = evaluateBadgeRules({}, { score: 100 });
            expect(result).toContain("nhap-mon");
            expect(result).toContain("khoi-dau-vung-vang");
        });

        test('score = 100 và timeSpent <= 45s cho bài thường -> đạt tia-chop', () => {
            const fast = evaluateBadgeRules({}, { lessonId: "bai-1", score: 100, timeSpent: 45 });
            expect(fast).toContain("tia-chop");

            const slow = evaluateBadgeRules({}, { lessonId: "bai-1", score: 100, timeSpent: 46 });
            expect(slow).not.toContain("tia-chop");

            const examFast = evaluateBadgeRules({}, { lessonId: "kt-c1", score: 100, timeSpent: 30 });
            expect(examFast).not.toContain("tia-chop"); // Không áp dụng cho bài kiểm tra kt-
        });
    });

    describe('3. Cải thiện điểm & Kỷ luật thép', () => {
        test('oldScore < 70 và score >= 80 -> đạt kien-tri', () => {
            expect(evaluateBadgeRules({}, { oldScore: 60, score: 80 })).toContain("kien-tri");
            expect(evaluateBadgeRules({}, { oldScore: 70, score: 80 })).not.toContain("kien-tri");
            expect(evaluateBadgeRules({}, { oldScore: 0, score: 80 })).not.toContain("kien-tri");
        });

        test('kt-* đạt score >= 80 và distractions = 0 -> đạt ky-luat-thep', () => {
            expect(evaluateBadgeRules({}, { lessonId: "kt-c1", score: 80, distractions: 0 })).toContain("ky-luat-thep");
            expect(evaluateBadgeRules({}, { lessonId: "kt-c1", score: 80, distractions: 1 })).not.toContain("ky-luat-thep");
            expect(evaluateBadgeRules({}, { lessonId: "bai-1", score: 80, distractions: 0 })).not.toContain("ky-luat-thep");
        });
    });

    describe('4. Ngưỡng Streak & XP', () => {
        test('Streak milestones (3, 7, 15, 30)', () => {
            expect(evaluateBadgeRules({ streak: 2 }, {})).toEqual([]);
            expect(evaluateBadgeRules({ streak: 3 }, {})).toContain("streak-3");
            expect(evaluateBadgeRules({ streak: 7 }, {})).toContain("streak-3");
            expect(evaluateBadgeRules({ streak: 7 }, {})).toContain("streak-7");
            expect(evaluateBadgeRules({ streak: 15 }, {})).toContain("streak-15");
            expect(evaluateBadgeRules({ streak: 30 }, {})).toContain("streak-math-30");
        });

        test('XP milestones (200, 500, 1000, 2500, 5000)', () => {
            expect(evaluateBadgeRules({ xp: 199 }, {})).not.toContain("sieu-tri-tue");
            expect(evaluateBadgeRules({ xp: 200 }, {})).toContain("sieu-tri-tue");
            expect(evaluateBadgeRules({ xp: 500 }, {})).toContain("huyen-thoai-toan-hoc");
            expect(evaluateBadgeRules({ xp: 1000 }, {})).toContain("than-dong-toan-hoc");
            expect(evaluateBadgeRules({ xp: 2500 }, {})).toContain("chien-binh-math-pro");
            expect(evaluateBadgeRules({ xp: 5000 }, {})).toContain("huyen-thoai-math-legend");
        });

        test('Completed theory >= 10 -> lam-chu-ly-thuyet-math', () => {
            const list9 = Array(9).fill("lesson");
            const list10 = Array(10).fill("lesson");
            expect(evaluateBadgeRules({ completedLessonTheory: list9 }, {})).not.toContain("lam-chu-ly-thuyet-math");
            expect(evaluateBadgeRules({ completedLessonTheory: list10 }, {})).toContain("lam-chu-ly-thuyet-math");
        });
    });

    describe('5. Bài học theo khối Lớp (Grade-specific)', () => {
        test('Lớp 1 badges', () => {
            expect(evaluateBadgeRules({}, { lessonId: "l1-bai-1", score: 90 })).toContain("dem-so-lop-1");
            expect(evaluateBadgeRules({}, { lessonId: "l1-bai-10", score: 90 })).toContain("phep-cong-pham-vi-10");
            expect(evaluateBadgeRules({}, { lessonId: "l1-bai-14", score: 90 })).toContain("hinh-khoi-lop-1");
            expect(evaluateBadgeRules({}, { lessonId: "l1-bai-34", score: 90 })).toContain("do-luong-lop-1");
            expect(evaluateBadgeRules({}, { lessonId: "l1-bai-39", score: 90 })).toContain("phep-cong-pham-vi-100");
            expect(evaluateBadgeRules({}, { lessonId: "l1-bai-41", score: 90 })).toContain("on-tap-lop-1");
        });

        test('Lớp 4 badges', () => {
            expect(evaluateBadgeRules({}, { lessonId: "l4-bai-3", score: 90 })).toContain("trieu-lop-trieu");
            expect(evaluateBadgeRules({}, { lessonId: "l4-bai-10", score: 90 })).toContain("trung-binh-cong");
            expect(evaluateBadgeRules({}, { lessonId: "l4-bai-11", score: 90 })).toContain("tim-hai-so-tong-hieu");
            expect(evaluateBadgeRules({}, { lessonId: "l4-bai-14", score: 90 })).toContain("tinh-chat-chia-het-4");
            expect(evaluateBadgeRules({}, { lessonId: "l4-bai-21", score: 90 })).toContain("tinh-dien-tich-lop-4");
            expect(evaluateBadgeRules({}, { lessonId: "l4-bai-24", score: 90 })).toContain("phan-so-lop-4");
            expect(evaluateBadgeRules({}, { lessonId: "l4-bai-38", score: 90 })).toContain("ti-so-lop-4");
            expect(evaluateBadgeRules({}, { lessonId: "l4-bai-33", score: 90 })).toContain("do-luong-y-en-ta-tan");
            expect(evaluateBadgeRules({}, { lessonId: "l4-bai-18", score: 90 })).toContain("hinh-hoc-goc-nhon-tu");
            expect(evaluateBadgeRules({}, { lessonId: "l4-bai-43", score: 90 })).toContain("on-tap-lop-4");
        });

        test('Lớp 6 Chapter Exams (kt-c1 -> kt-c9)', () => {
            expect(evaluateBadgeRules({}, { lessonId: "kt-c1", score: 80 })).toContain("bac-thay-so-tu-nhien");
            expect(evaluateBadgeRules({}, { lessonId: "kt-c2", score: 80 })).toContain("chien-binh-chia-het");
            expect(evaluateBadgeRules({}, { lessonId: "kt-c3", score: 80 })).toContain("ky-si-so-nguyen");
            expect(evaluateBadgeRules({}, { lessonId: "kt-c4", score: 80 })).toContain("phu-thuy-hinh-hoc");
            expect(evaluateBadgeRules({}, { lessonId: "kt-c5", score: 80 })).toContain("bac-thay-doi-xung");
            expect(evaluateBadgeRules({}, { lessonId: "kt-c6", score: 80 })).toContain("bac-thay-phan-so");
            expect(evaluateBadgeRules({}, { lessonId: "kt-c7", score: 80 })).toContain("chien-binh-thap-phan");
            expect(evaluateBadgeRules({}, { lessonId: "kt-c8", score: 80 })).toContain("phu-thuy-hinh-co-ban");
            expect(evaluateBadgeRules({}, { lessonId: "kt-c9", score: 80 })).toContain("bac-thay-xac-suat");
        });

        test('Lớp 6 Regular Lessons (score >= 95)', () => {
            expect(evaluateBadgeRules({}, { lessonId: "bai-6", score: 95 })).toContain("luy-thua-than-sau");
            expect(evaluateBadgeRules({}, { lessonId: "bai-12", score: 95 })).toContain("uoc-va-boi");
            expect(evaluateBadgeRules({}, { lessonId: "bai-15", score: 95 })).toContain("phep-tinh-so-nguyen");
            expect(evaluateBadgeRules({}, { lessonId: "bai-18", score: 95 })).toContain("hinh-hoc-truc-quan-6");
            expect(evaluateBadgeRules({}, { lessonId: "bai-21", score: 95 })).toContain("hinh-doi-xung-master");
            expect(evaluateBadgeRules({}, { lessonId: "bai-26", score: 95 })).toContain("phan-so-tieu-chuan-6");
            expect(evaluateBadgeRules({}, { lessonId: "bai-29", score: 95 })).toContain("thap-phan-chuyen-nghiep");
            expect(evaluateBadgeRules({}, { lessonId: "bai-32", score: 95 })).toContain("hinh-hoc-phang-chuan-6");
            expect(evaluateBadgeRules({}, { lessonId: "bai-37", score: 95 })).toContain("xac-suat-thuc-te");
        });
    });

    describe('6. Huy hiệu tối thượng master-of-math', () => {
        test('Đủ tất cả huy hiệu khác trong systemBadges -> mở master-of-math', () => {
            const fullSystemBadges = [
                { id: "b1" },
                { id: "b2" },
                { id: "b3" },
                { id: "master-of-math" }
            ];
            const state = { badges: ["b1", "b2"] };
            // Lần làm bài này mở nốt "b3"
            const context = { score: 80 }; // giả sử trigger b3
            // Mocking context triggers b3:
            const result = evaluateBadgeRules({ badges: ["b1", "b2", "b3"] }, {}, fullSystemBadges);
            expect(result).toContain("master-of-math");
        });
    });
});
