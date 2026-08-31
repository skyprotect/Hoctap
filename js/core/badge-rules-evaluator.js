(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.BadgeRulesEvaluator = factory();
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    /**
     * BadgeRulesEvaluator
     * Trách nhiệm duy nhất: Đánh giá tập hợp các quy tắc thành tích (Badge Rules)
     * để xác định danh sách các huy hiệu đủ điều kiện mở khóa mà học sinh CHƯA sở hữu.
     * 
     * ĐẶC TÍNH KIẾN TRÚC:
     * - Pure Function 100%: Không truy cập DOM, không gọi API, không mutate state.
     * - Không phụ thuộc window.app, Audio, Confetti, Toast/Swal hay CSDL.
     * 
     * @param {Object} state - Trạng thái học tập hiện tại của học sinh
     * @param {number} [state.xp=0] - Tổng điểm kinh nghiệm tích lũy
     * @param {number} [state.streak=0] - Chuỗi ngày học liên tục
     * @param {Array<string>} [state.badges=[]] - Danh sách ID huy hiệu đã mở khóa
     * @param {Array<string>} [state.completedLessonTheory=[]] - Danh sách bài học đã hoàn thành lý thuyết
     * 
     * @param {Object} context - Ngữ cảnh bài làm vừa hoàn thành
     * @param {string} context.lessonId - Mã định danh bài học vừa nộp (vd: "l1-bai-1", "kt-c1", "bai-6")
     * @param {number} context.score - Điểm số bài thi vừa đạt (0 - 100)
     * @param {number} [context.timeSpent=9999] - Thời gian hoàn thành bài (giây)
     * @param {number} [context.oldScore=0] - Điểm số cao nhất trước đó của bài học này
     * @param {number} [context.distractions=0] - Số lần rời tab/xao nhãng trong quá trình làm bài
     * 
     * @param {Array<Object>} [systemBadges=[]] - Danh mục 50 huy hiệu hệ thống
     * 
     * @returns {Array<string>} Danh sách ID các huy hiệu mới đủ điều kiện mở khóa (theo thứ tự ưu tiên)
     */
    function evaluateBadgeRules(state, context, systemBadges) {
        const safeState = state || {};
        const safeContext = context || {};
        const alreadyBadges = Array.isArray(safeState.badges) ? safeState.badges : [];
        const streak = typeof safeState.streak === 'number' ? safeState.streak : 0;
        const xp = typeof safeState.xp === 'number' ? safeState.xp : 0;
        const completedTheory = Array.isArray(safeState.completedLessonTheory) ? safeState.completedLessonTheory : [];

        const lessonId = typeof safeContext.lessonId === 'string' ? safeContext.lessonId : '';
        const score = typeof safeContext.score === 'number' ? safeContext.score : 0;
        const timeSpent = typeof safeContext.timeSpent === 'number' ? safeContext.timeSpent : 9999;
        const oldScore = typeof safeContext.oldScore === 'number' ? safeContext.oldScore : 0;
        const distractions = typeof safeContext.distractions === 'number' ? safeContext.distractions : 0;

        const qualifiedBadges = [];

        function checkAdd(badgeId) {
            if (!alreadyBadges.includes(badgeId) && !qualifiedBadges.includes(badgeId)) {
                qualifiedBadges.push(badgeId);
            }
        }

        // 1. Nhập môn (hoàn thành bất kỳ bài nào >= 80%)
        if (score >= 80) {
            checkAdd("nhap-mon");
        }

        // 2. Khởi đầu vững vàng (đạt 100% điểm bất kỳ bài nào)
        if (score === 100) {
            checkAdd("khoi-dau-vung-vang");
        }

        // 3. Chuỗi học tập liên tục
        if (streak >= 3) checkAdd("streak-3");
        if (streak >= 7) checkAdd("streak-7");
        if (streak >= 15) checkAdd("streak-15");

        // 4. Siêu trí tuệ & Huyền thoại (tích lũy XP)
        if (xp >= 200) checkAdd("sieu-tri-tue");
        if (xp >= 500) checkAdd("huyen-thoai-toan-hoc");

        // 5. Thần tốc: Đúng 100% trong thời gian dưới 45 giây (chỉ cho bài luyện tập bình thường 5 câu)
        if (score === 100 && timeSpent <= 45 && !lessonId.startsWith("kt-")) {
            checkAdd("tia-chop");
        }

        // 6. Kiên trì bứt phá: Cải thiện điểm số từ dưới 70% lên đạt giỏi (>= 80%)
        if (oldScore > 0 && oldScore < 70 && score >= 80) {
            checkAdd("kien-tri");
        }

        // 7. Kỷ luật thép: Vượt qua bài kiểm tra cuối chương 10 câu đạt >= 80% mà không có lần xao nhãng nào
        if (lessonId.startsWith("kt-") && score >= 80 && distractions === 0) {
            checkAdd("ky-luat-thep");
        }

        // 8. Các huy hiệu vượt qua bài kiểm tra chương học Lớp 6
        if (lessonId === "kt-c1" && score >= 80) checkAdd("bac-thay-so-tu-nhien");
        if (lessonId === "kt-c2" && score >= 80) checkAdd("chien-binh-chia-het");
        if (lessonId === "kt-c3" && score >= 80) checkAdd("ky-si-so-nguyen");
        if (lessonId === "kt-c4" && score >= 80) checkAdd("phu-thuy-hinh-hoc");
        if (lessonId === "kt-c5" && score >= 80) checkAdd("bac-thay-doi-xung");
        if (lessonId === "kt-c6" && score >= 80) checkAdd("bac-thay-phan-so");
        if (lessonId === "kt-c7" && score >= 80) checkAdd("chien-binh-thap-phan");
        if (lessonId === "kt-c8" && score >= 80) checkAdd("phu-thuy-hinh-co-ban");
        if (lessonId === "kt-c9" && score >= 80) checkAdd("bac-thay-xac-suat");

        // Huy hiệu Lớp 1
        if ((lessonId === "l1-bai-1" || lessonId === "l1-bai-2") && score >= 90) checkAdd("dem-so-lop-1");
        if (lessonId === "l1-bai-10" && score >= 90) checkAdd("phep-cong-pham-vi-10");
        if (lessonId === "l1-bai-14" && score >= 90) checkAdd("hinh-khoi-lop-1");
        if ((lessonId === "l1-bai-34" || lessonId === "l1-bai-35") && score >= 90) checkAdd("do-luong-lop-1");
        if (lessonId === "l1-bai-39" && score >= 90) checkAdd("phep-cong-pham-vi-100");
        if (lessonId === "l1-bai-41" && score >= 90) checkAdd("on-tap-lop-1");

        // Huy hiệu Lớp 4
        if ((lessonId === "l4-bai-3" || lessonId === "l4-bai-4") && score >= 90) checkAdd("trieu-lop-trieu");
        if (lessonId === "l4-bai-10" && score >= 90) checkAdd("trung-binh-cong");
        if (lessonId === "l4-bai-11" && score >= 90) checkAdd("tim-hai-so-tong-hieu");
        if ((lessonId === "l4-bai-14" || lessonId === "l4-bai-15") && score >= 90) checkAdd("tinh-chat-chia-het-4");
        if ((lessonId === "l4-bai-21" || lessonId === "l4-bai-22") && score >= 90) checkAdd("tinh-dien-tich-lop-4");
        if ((lessonId === "l4-bai-24" || lessonId === "l4-bai-25") && score >= 90) checkAdd("phan-so-lop-4");
        if ((lessonId === "l4-bai-38" || lessonId === "l4-bai-39" || lessonId === "l4-bai-40") && score >= 90) checkAdd("ti-so-lop-4");
        if (lessonId === "l4-bai-33" && score >= 90) checkAdd("do-luong-y-en-ta-tan");
        if (lessonId === "l4-bai-18" && score >= 90) checkAdd("hinh-hoc-goc-nhon-tu");
        if (lessonId === "l4-bai-43" && score >= 90) checkAdd("on-tap-lop-4");

        // Huy hiệu Lớp 6
        if (lessonId === "bai-6" && score >= 95) checkAdd("luy-thua-than-sau");
        if ((lessonId === "bai-12" || lessonId === "bai-13") && score >= 95) checkAdd("uoc-va-boi");
        if ((lessonId === "bai-15" || lessonId === "bai-16") && score >= 95) checkAdd("phep-tinh-so-nguyen");
        if (lessonId === "bai-18" && score >= 95) checkAdd("hinh-hoc-truc-quan-6");
        if ((lessonId === "bai-21" || lessonId === "bai-22") && score >= 95) checkAdd("hinh-doi-xung-master");
        if ((lessonId === "bai-26" || lessonId === "bai-27") && score >= 95) checkAdd("phan-so-tieu-chuan-6");
        if ((lessonId === "bai-29" || lessonId === "bai-30") && score >= 95) checkAdd("thap-phan-chuyen-nghiep");
        if ((lessonId === "bai-32" || lessonId === "bai-33") && score >= 95) checkAdd("hinh-hoc-phang-chuan-6");
        if (lessonId === "bai-37" && score >= 95) checkAdd("xac-suat-thuc-te");

        // Gamification & Tích lũy
        if (xp >= 1000) checkAdd("than-dong-toan-hoc");
        if (xp >= 2500) checkAdd("chien-binh-math-pro");
        if (xp >= 5000) checkAdd("huyen-thoai-math-legend");
        if (streak >= 30) checkAdd("streak-math-30");
        if (completedTheory.length >= 10) checkAdd("lam-chu-ly-thuyet-math");

        // Huy hiệu tối thượng: Đại sứ Toán học Toàn năng (master-of-math)
        if (Array.isArray(systemBadges) && systemBadges.length > 0 && !alreadyBadges.includes("master-of-math")) {
            const allBadgesExceptMaster = systemBadges.filter(function (b) { return b.id !== "master-of-math"; });
            const currentCombined = alreadyBadges.concat(qualifiedBadges);
            const hasAllOthers = allBadgesExceptMaster.length > 0 && allBadgesExceptMaster.every(function (b) {
                return currentCombined.includes(b.id);
            });
            if (hasAllOthers) {
                checkAdd("master-of-math");
            }
        }

        return qualifiedBadges;
    }

    return {
        evaluateBadgeRules: evaluateBadgeRules
    };
});
