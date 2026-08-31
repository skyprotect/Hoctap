/**
 * system-badges — Cấu hình danh mục 50 huy hiệu gamification môn Toán & Cột mốc học tập.
 * Hỗ trợ tra cứu theo ID, phân loại theo khối lớp (Lớp 1, Lớp 4, Lớp 6 và Cột mốc).
 * 
 * Public Contract:
 * - SYSTEM_BADGES: Array<SystemBadge>
 * - getSystemBadges(): Array<SystemBadge>
 * - getBadgeById(id: string): SystemBadge | undefined
 * - getBadgesByClass(classLevel?: string): Array<SystemBadge>
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.SystemBadgesData = api;
    root.SYSTEM_BADGES = api.SYSTEM_BADGES;
    if (typeof window !== 'undefined') {
        window.SystemBadgesData = api;
        window.SYSTEM_BADGES = api.SYSTEM_BADGES;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.SystemBadgesData = api;
        globalThis.SYSTEM_BADGES = api.SYSTEM_BADGES;
    }
    if (typeof self !== 'undefined') {
        self.SystemBadgesData = api;
        self.SYSTEM_BADGES = api.SYSTEM_BADGES;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const SYSTEM_BADGES = [
        { id: "nhap-mon", name: "Nhập Môn Toán 6", desc: "Hoàn thành bài học đầu tiên đạt từ 80%", icon: "🚀" },
        { id: "khoi-dau-vung-vang", name: "Khởi Đầu Vững Vàng", desc: "Đạt điểm tối đa (100%) một bài học bất kỳ", icon: "🌟" },
        { id: "streak-3", name: "Bền Bỉ 3 Ngày", desc: "Đạt chuỗi học tập liên tục 3 ngày", icon: "🔥" },
        { id: "streak-7", name: "Siêu Sao Chuyên Cần", desc: "Đạt chuỗi học tập liên tục 7 ngày", icon: "⚡" },
        { id: "streak-15", name: "Kỷ Lục Gia Học Tập", desc: "Đạt chuỗi học tập liên tục 15 ngày", icon: "👑" },
        
        { id: "bac-thay-so-tu-nhien", name: "Bậc Thầy Số Tự Nhiên", desc: "Vượt qua bài kiểm tra cuối Chương I (>= 80%)", icon: "🔢" },
        { id: "chien-binh-chia-het", name: "Chiến Binh Chia Hết", desc: "Vượt qua bài kiểm tra cuối Chương II (>= 80%)", icon: "🛡️" },
        { id: "ky-si-so-nguyen", name: "Kỵ Sĩ Số Nguyên", desc: "Vượt qua bài kiểm tra cuối Chương III (>= 80%)", icon: "❄️" },
        { id: "phu-thuy-hinh-hoc", name: "Phù Thủy Hình Học", desc: "Vượt qua bài kiểm tra cuối Chương IV (>= 80%)", icon: "📐" },
        { id: "bac-thay-doi-xung", name: "Bậc Thầy Đối Xứng", desc: "Vượt qua bài kiểm tra cuối Chương V (>= 80%)", icon: "🌀" },
        
        { id: "bac-thay-phan-so", name: "Bậc Thầy Phân Số", desc: "Vượt qua bài kiểm tra cuối Chương VI (>= 80%)", icon: "🍰" },
        { id: "chien-binh-thap-phan", name: "Chiến Binh Thập Phân", desc: "Vượt qua bài kiểm tra cuối Chương VII (>= 80%)", icon: "🎯" },
        { id: "phu-thuy-hinh-co-ban", name: "Phù Thủy Hình Học Cơ Bản", desc: "Vượt qua bài kiểm tra cuối Chương VIII (>= 80%)", icon: "📐" },
        { id: "bac-thay-xac-suat", name: "Bậc Thầy Xác Suất", desc: "Vượt qua bài kiểm tra cuối Chương IX (>= 80%)", icon: "🎲" },
        
        { id: "tia-chop", name: "Thần Tốc", desc: "Đạt điểm 100% bài luyện tập dưới 45 giây", icon: "⚡" },
        { id: "kien-tri", name: "Kiên Trì Bứt Phá", desc: "Cải thiện bài tập đạt dưới 70% lên giỏi (>= 80%)", icon: "🌱" },
        { id: "ky-luat-thep", name: "Kỷ Luật Thép", desc: "Hoàn thành bài kiểm tra chương mà không rời tab lần nào", icon: "🎯" },
        { id: "sieu-tri-tue", name: "Siêu Trí Tuệ", desc: "Tích lũy đạt mốc 200 XP", icon: "🧠" },
        { id: "huyen-thoai-toan-hoc", name: "Huyền Thoại Toán Học", desc: "Tích lũy đạt mốc 500 XP", icon: "🏆" },
        
        // Huy hiệu Lớp 1 (6 huy hiệu)
        { id: "dem-so-lop-1", name: "Bậc Thầy Đếm Số Lớp 1", desc: "Đạt >= 90% ở bài đếm số trong phạm vi 10 hoặc 100 Lớp 1", icon: "🔢", classLevel: "1" },
        { id: "phep-cong-pham-vi-10", name: "Thần Đồng Cộng Trừ Lớp 1", desc: "Đạt >= 90% ở bài phép cộng hoặc phép trừ phạm vi 10 Lớp 1", icon: "➕", classLevel: "1" },
        { id: "hinh-khoi-lop-1", name: "Khối Hình Trực Quan Lớp 1", desc: "Đạt >= 90% ở bài nhận biết khối lập phương, khối hộp chữ nhật Lớp 1", icon: "📦", classLevel: "1" },
        { id: "do-luong-lop-1", name: "Nhà Đo Lường Nhí Lớp 1", desc: "Đạt >= 90% ở bài toán về thời gian, đồng hồ, lịch Lớp 1", icon: "⏰", classLevel: "1" },
        { id: "phep-cong-pham-vi-100", name: "Chuyên Gia Tính Phạm Vi 100", desc: "Đạt >= 90% ở bài phép tính không nhớ phạm vi 100 Lớp 1", icon: "💯", classLevel: "1" },
        { id: "on-tap-lop-1", name: "Vô Địch Toán Lớp 1", desc: "Hoàn thành xuất sắc bài ôn tập chung cuối năm Lớp 1 đạt >= 90%", icon: "🎓", classLevel: "1" },
        
        // Huy hiệu Lớp 4 (10 huy hiệu)
        { id: "trieu-lop-trieu", name: "Chinh Phục Triệu Số Lớp 4", desc: "Đạt >= 90% ở bài học hàng triệu và lớp triệu Lớp 4", icon: "💰", classLevel: "4" },
        { id: "trung-binh-cong", name: "Vua Trung Bình Cộng Lớp 4", desc: "Đạt >= 90% ở bài số trung bình cộng Lớp 4", icon: "📊", classLevel: "4" },
        { id: "tim-hai-so-tong-hieu", name: "Bậc Thầy Tổng Hiệu Lớp 4", desc: "Đạt >= 90% ở bài toán tìm hai số khi biết tổng và hiệu Lớp 4", icon: "⚖️", classLevel: "4" },
        { id: "tinh-chat-chia-het-4", name: "Nhà Thông Thái Chia Hết Lớp 4", desc: "Đạt >= 90% ở bài dấu hiệu chia hết (2, 5, 9, 3) Lớp 4", icon: "🛡️", classLevel: "4" },
        { id: "tinh-dien-tich-lop-4", name: "Kỹ Sư Diện Tích Lớp 4", desc: "Đạt >= 90% ở bài tính diện tích hình bình hành hoặc hình thoi Lớp 4", icon: "📐", classLevel: "4" },
        { id: "phan-so-lop-4", name: "Chuyên Gia Phân Số Lớp 4", desc: "Đạt >= 90% ở bài phân số và các phép tính phân số Lớp 4", icon: "🍰", classLevel: "4" },
        { id: "ti-so-lop-4", name: "Nhà Phân Tích Tỉ Số Lớp 4", desc: "Đạt >= 90% ở bài toán tỉ số và tìm hai số Lớp 4", icon: "📈", classLevel: "4" },
        { id: "do-luong-y-en-ta-tan", name: "Nhà Cân Đo Lớp 4", desc: "Đạt >= 90% ở bài đơn vị đo khối lượng yến, tạ, tấn Lớp 4", icon: "⚖️", classLevel: "4" },
        { id: "hinh-hoc-goc-nhon-tu", name: "Chuyên Gia Góc Học Lớp 4", desc: "Đạt >= 90% ở bài nhận biết góc nhọn, góc tù, góc bẹt Lớp 4", icon: "📐", classLevel: "4" },
        { id: "on-tap-lop-4", name: "Vô Địch Toán Lớp 4", desc: "Hoàn thành xuất sắc bài ôn tập chung cuối năm Lớp 4 đạt >= 90%", icon: "🎓", classLevel: "4" },
        
        // Huy hiệu Lớp 6 bổ sung chuyên sâu (9 huy hiệu)
        { id: "luy-thua-than-sau", name: "Chúa Tể Lũy Thừa Lớp 6", desc: "Đạt >= 95% ở bài lũy thừa với số mũ tự nhiên Lớp 6", icon: "⚡", classLevel: "6" },
        { id: "uoc-va-boi", name: "Chiến Thần Ước Bội Lớp 6", desc: "Đạt >= 95% ở bài ước chung lớn nhất hoặc bội chung nhỏ nhất Lớp 6", icon: "🛡️", classLevel: "6" },
        { id: "phep-tinh-so-nguyen", name: "Đại Sứ Số Nguyên Lớp 6", desc: "Đạt >= 95% ở các phép tính số nguyên Lớp 6", icon: "❄️", classLevel: "6" },
        { id: "hinh-hoc-truc-quan-6", name: "Nhà Thiết Kế Hình Lớp 6", desc: "Đạt >= 95% ở bài hình tam giác đều, hình vuông, hình lục giác đều Lớp 6", icon: "📐", classLevel: "6" },
        { id: "hinh-doi-xung-master", name: "Bậc Thầy Đối Xứng Lớp 6", desc: "Đạt >= 95% ở bài hình có trục hoặc tâm đối xứng Lớp 6", icon: "🌀", classLevel: "6" },
        { id: "phan-so-tieu-chuan-6", name: "Cao Thủ Phân Số Lớp 6", desc: "Đạt >= 95% ở các bài toán phân số nâng cao Lớp 6", icon: "🍰", classLevel: "6" },
        { id: "thap-phan-chuyen-nghiep", name: "Chuyên Gia Số Thập Phân Lớp 6", desc: "Đạt >= 95% ở các bài toán số thập phân Lớp 6", icon: "🎯", classLevel: "6" },
        { id: "hinh-hoc-phang-chuan-6", name: "Hình Học Phẳng Lớp 6", desc: "Đạt >= 95% ở các dạng bài hình học phẳng cơ bản Lớp 6", icon: "📐", classLevel: "6" },
        { id: "xac-suat-thuc-te", name: "Nhà Tiên Tri Xác Suất Lớp 6", desc: "Đạt >= 95% ở bài học xác suất thực nghiệm Lớp 6", icon: "🎲", classLevel: "6" },
        
        // Cột mốc và phép cộng dồn (6 huy hiệu)
        { id: "than-dong-toan-hoc", name: "Thần Đồng Toán Học", desc: "Tích lũy đạt mốc 1,000 XP môn Toán", icon: "🧠" },
        { id: "chien-binh-math-pro", name: "Chiến Binh Toán Học Pro", desc: "Tích lũy đạt mốc 2,500 XP môn Toán", icon: "🛡️" },
        { id: "huyen-thoai-math-legend", name: "Huyền Thoại Toán Học", desc: "Tích lũy đạt mốc 5,000 XP môn Toán", icon: "👑" },
        { id: "streak-math-30", name: "Kỷ Luật Thép 30 Ngày", desc: "Đạt chuỗi học tập liên tục môn Toán từ 30 ngày trở lên", icon: "🔥" },
        { id: "lam-chu-ly-thuyet-math", name: "Học Giả Lý Thuyết Toán", desc: "Hoàn thành phần lý thuyết của từ 10 bài học Toán trở lên", icon: "📜" },
        { id: "master-of-math", name: "Đại Sứ Toán Học Toàn Năng", desc: "Mở khóa thành công tất cả 49 huy hiệu Toán học khác", icon: "🏆" }
    ];

    function getSystemBadges() {
        return SYSTEM_BADGES;
    }

    function getBadgeById(id) {
        if (!id) return undefined;
        return SYSTEM_BADGES.find(b => b.id === id);
    }

    function getBadgesByClass(classLevel) {
        if (!classLevel) {
            return SYSTEM_BADGES;
        }
        const strLevel = String(classLevel);
        return SYSTEM_BADGES.filter(b => !b.classLevel || b.classLevel === strLevel);
    }

    const SystemBadgesData = {
        SYSTEM_BADGES: SYSTEM_BADGES,
        getSystemBadges: getSystemBadges,
        getBadgeById: getBadgeById,
        getBadgesByClass: getBadgesByClass
    };

    return SystemBadgesData;
});
