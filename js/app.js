function sanitizeHtml(html) {
    if (typeof html !== 'string') return html;
    return html
        .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
        .replace(/\son[a-z]+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, '')
        .replace(/href\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, '');
}

const SKILL_CARDS = [
    { id: "listening_master", name: "Listening Wizard", desc: "Đạt điểm Nghe từ 90% trở lên ở một bài bất kỳ", icon: "🎧", color: "linear-gradient(135deg, #3b82f6, #1d4ed8)" },
    { id: "speaking_pro", name: "Speaking Hero", desc: "Đạt điểm Nói từ 90% trở lên ở một bài bất kỳ", icon: "🗣️", color: "linear-gradient(135deg, #ec4899, #be185d)" },
    { id: "reading_wizard", name: "Reading Sage", desc: "Đạt điểm Đọc từ 90% trở lên ở một bài bất kỳ", icon: "📖", color: "linear-gradient(135deg, #f97316, #c2410c)" },
    { id: "writing_champion", name: "Writing Master", desc: "Đạt điểm Viết/Spelling từ 90% trở lên ở một bài bất kỳ", icon: "✍️", color: "linear-gradient(135deg, #10b981, #047857)" },
    { id: "streak_legend", name: "Streak Legend", desc: "Đạt chuỗi học tập liên tục từ 5 ngày trở lên", icon: "🔥", color: "linear-gradient(135deg, #ef4444, #b91c1c)" },
    { id: "streak_hero", name: "Streak Emperor", desc: "Đạt chuỗi học tập liên tục từ 10 ngày trở lên", icon: "⚡", color: "linear-gradient(135deg, #f59e0b, #d97706)" },
    { id: "xp_conqueror", name: "XP Champion", desc: "Tích lũy đạt mốc 1,000 XP tổng cộng", icon: "⭐", color: "linear-gradient(135deg, #eab308, #a16207)" },
    { id: "perfect_score", name: "Perfect Solver", desc: "Đạt điểm tuyệt đối 100% trong một bài học bất kỳ", icon: "🏆", color: "linear-gradient(135deg, #8b5cf6, #5b21b6)" },
    { id: "theory_explorer", name: "Theory Explorer", desc: "Hoàn thành phần lý thuyết của từ 3 bài học trở lên", icon: "📜", color: "linear-gradient(135deg, #a855f7, #6b21a8)" },
    { id: "gold_collector", name: "Gold Collector", desc: "Nâng cấp mạ vàng thành công từ 3 thẻ năng lực trở lên", icon: "👑", color: "linear-gradient(135deg, #10b981, #065f46)" },
    { id: "subtopic_expert", name: "Subtopic Expert", desc: "Hoàn thành xuất sắc từ 5 dạng bài luyện tập trở lên (đạt >= 80%)", icon: "🎯", color: "linear-gradient(135deg, #0ea5e9, #0369a1)" },
    { id: "speed_runner", name: "Speed Runner", desc: "Hoàn thành 1 bài đạt điểm 100% dưới 60 giây", icon: "🏃", color: "linear-gradient(135deg, #e11d48, #9f1239)" },
    { id: "monster_slayer", name: "Monster Slayer", desc: "Tiêu diệt thành công từ 3 quái vật từ vựng", icon: "⚔️", color: "linear-gradient(135deg, #64748b, #334155)" },
    { id: "vocab_slayer", name: "Vocabulary Slayer", desc: "Tiêu diệt thành công từ 10 quái vật từ vựng", icon: "🐉", color: "linear-gradient(135deg, #475569, #1e293b)" },
    // Thẻ Tiếng Anh Lớp 1 (8 thẻ)
    { id: "listening_rookie_1", name: "Listening Star Lớp 1", desc: "Đạt điểm Nghe từ 80% trở lên ở một bài Lớp 1", icon: "👶", color: "linear-gradient(135deg, #60a5fa, #2563eb)", classLevel: "1" },
    { id: "speaking_rookie_1", name: "Speaking Star Lớp 1", desc: "Đạt điểm Nói từ 80% trở lên ở một bài Lớp 1", icon: "💬", color: "linear-gradient(135deg, #f472b6, #db2777)", classLevel: "1" },
    { id: "reading_rookie_1", name: "Reading Star Lớp 1", desc: "Đạt điểm Đọc từ 80% trở lên ở một bài Lớp 1", icon: "📖", color: "linear-gradient(135deg, #fb923c, #ea580c)", classLevel: "1" },
    { id: "writing_rookie_1", name: "Writing Star Lớp 1", desc: "Đạt điểm Viết/Spelling từ 80% trở lên ở một bài Lớp 1", icon: "✏️", color: "linear-gradient(135deg, #34d399, #059669)", classLevel: "1" },
    { id: "vocabulary_explorer_1", name: "Vocab Rookie Lớp 1", desc: "Tiêu diệt thành công từ 2 quái vật từ vựng Lớp 1", icon: "👾", color: "linear-gradient(135deg, #a78bfa, #7c3aed)", classLevel: "1" },
    { id: "perfect_star_1", name: "Perfect Solver Lớp 1", desc: "Đạt điểm tuyệt đối 100% trong bài học bất kỳ của Lớp 1", icon: "👑", color: "linear-gradient(135deg, #f59e0b, #d97706)", classLevel: "1" },
    { id: "bilingual_kid", name: "Bilingual Star", desc: "Hoàn thành xuất sắc 5 bài học của Lớp 1 (đạt >= 90%)", icon: "🎒", color: "linear-gradient(135deg, #4ade80, #16a34a)", classLevel: "1" },
    { id: "class1_master", name: "Starters Master", desc: "Hoàn thành xuất sắc 10 bài học của Lớp 1 (đạt >= 90%)", icon: "🎓", color: "linear-gradient(135deg, #22c55e, #15803d)", classLevel: "1" },
    // Thẻ Tiếng Anh Lớp 4 (8 thẻ)
    { id: "listening_apprentice_4", name: "Listening Hero Lớp 4", desc: "Đạt điểm Nghe từ 85% trở lên ở một bài Lớp 4", icon: "🎧", color: "linear-gradient(135deg, #3b82f6, #1d4ed8)", classLevel: "4" },
    { id: "speaking_apprentice_4", name: "Speaking Hero Lớp 4", desc: "Đạt điểm Nói từ 85% trở lên ở một bài Lớp 4", icon: "🗣️", color: "linear-gradient(135deg, #ec4899, #be185d)", classLevel: "4" },
    { id: "reading_apprentice_4", name: "Reading Hero Lớp 4", desc: "Đạt điểm Đọc từ 85% trở lên ở một bài Lớp 4", icon: "📚", color: "linear-gradient(135deg, #f97316, #c2410c)", classLevel: "4" },
    { id: "writing_apprentice_4", name: "Writing Hero Lớp 4", desc: "Đạt điểm Viết/Spelling từ 85% trở lên ở một bài Lớp 4", icon: "✍️", color: "linear-gradient(135deg, #10b981, #047857)", classLevel: "4" },
    { id: "vocabulary_explorer_4", name: "Vocab Hero Lớp 4", desc: "Tiêu diệt thành công từ 5 quái vật từ vựng Lớp 4", icon: "👹", color: "linear-gradient(135deg, #8b5cf6, #5b21b6)", classLevel: "4" },
    { id: "grammar_rookie", name: "Grammar Rookie", desc: "Đạt từ 80% trở lên ở 3 bài ngữ pháp/hoàn thành câu bất kỳ", icon: "📝", color: "linear-gradient(135deg, #2dd4bf, #0d9488)", classLevel: "4" },
    { id: "global_citizen_junior", name: "Global Citizen Jr.", desc: "Hoàn thành xuất sắc 10 bài học của Lớp 4 (đạt >= 90%)", icon: "🌍", color: "linear-gradient(135deg, #22c55e, #15803d)", classLevel: "4" },
    { id: "class4_master", name: "Movers Master", desc: "Hoàn thành xuất sắc 15 bài học của Lớp 4 (đạt >= 90%)", icon: "🎓", color: "linear-gradient(135deg, #166534, #14532d)", classLevel: "4" },
    // Thẻ Tiếng Anh Lớp 6 (8 thẻ)
    { id: "listening_expert_6", name: "Listening Sage Lớp 6", desc: "Đạt điểm Nghe từ 90% trở lên ở một bài Lớp 6", icon: "🦻", color: "linear-gradient(135deg, #1e3a8a, #172554)", classLevel: "6" },
    { id: "speaking_expert_6", name: "Speaking Sage Lớp 6", desc: "Đạt điểm Nói từ 90% trở lên ở một bài Lớp 6", icon: "📢", color: "linear-gradient(135deg, #9d174d, #4c0519)", classLevel: "6" },
    { id: "reading_expert_6", name: "Reading Sage Lớp 6", desc: "Đạt điểm Đọc từ 90% trở lên ở một bài Lớp 6", icon: "🧐", color: "linear-gradient(135deg, #7c2d12, #431407)", classLevel: "6" },
    { id: "writing_expert_6", name: "Writing Sage Lớp 6", desc: "Đạt điểm Viết/Spelling từ 90% trở lên ở một bài Lớp 6", icon: "✒️", color: "linear-gradient(135deg, #064e3b, #022c22)", classLevel: "6" },
    { id: "vocabulary_explorer_6", name: "Vocab Sage Lớp 6", desc: "Tiêu diệt thành công từ 8 quái vật từ vựng Lớp 6", icon: "👺", color: "linear-gradient(135deg, #4c1d95, #2e1065)", classLevel: "6" },
    { id: "grammar_expert", name: "Grammar Specialist", desc: "Đạt từ 90% trở lên ở 5 bài ngữ pháp/hoàn thành câu bất kỳ", icon: "🧠", color: "linear-gradient(135deg, #14b8a6, #0f766e)", classLevel: "6" },
    { id: "global_citizen_senior", name: "Global Citizen Sr.", desc: "Hoàn thành xuất sắc 15 bài học của Lớp 6 (đạt >= 90%)", icon: "🚀", color: "linear-gradient(135deg, #166534, #14532d)", classLevel: "6" },
    { id: "class6_master", name: "Flyers Master", desc: "Hoàn thành xuất sắc 18 bài học của Lớp 6 (đạt >= 90%)", icon: "🎓", color: "linear-gradient(135deg, #14532d, #052e16)", classLevel: "6" },
    // Huy hiệu Thống Kê & Cột mốc (12 thẻ)
    { id: "streak_bronze", name: "Streak Bronze", desc: "Đạt chuỗi học tập liên tục từ 3 ngày trở lên", icon: "🔥", color: "linear-gradient(135deg, #fca5a5, #ef4444)" },
    { id: "streak_gold", name: "Streak Gold", desc: "Đạt chuỗi học tập liên tục từ 20 ngày trở lên", icon: "👑", color: "linear-gradient(135deg, #f59e0b, #b45309)" },
    { id: "xp_novice", name: "XP Rookie", desc: "Tích lũy đạt mốc 100 XP Tiếng Anh", icon: "✨", color: "linear-gradient(135deg, #c084fc, #8b5cf6)" },
    { id: "xp_apprentice", name: "XP Apprentice", desc: "Tích lũy đạt mốc 500 XP Tiếng Anh", icon: "🌟", color: "linear-gradient(135deg, #a855f7, #6b21a8)" },
    { id: "xp_master", name: "XP Specialist", desc: "Tích lũy đạt mốc 2,000 XP Tiếng Anh", icon: "🔮", color: "linear-gradient(135deg, #7c3aed, #4c1d95)" },
    { id: "xp_legend", name: "XP Deity", desc: "Tích lũy đạt mốc 5,000 XP Tiếng Anh", icon: "🌌", color: "linear-gradient(135deg, #6366f1, #312e81)" },
    { id: "theory_scholar", name: "Theory Scholar", desc: "Hoàn thành lý thuyết của từ 8 bài học tiếng Anh trở lên", icon: "📜", color: "linear-gradient(135deg, #e2e8f0, #94a3b8)" },
    { id: "vocabulary_monarch", name: "Vocabulary Monarch", desc: "Tiêu diệt thành công từ 20 quái vật từ vựng", icon: "🐉", color: "linear-gradient(135deg, #1e293b, #0f172a)" },
    { id: "speedy_writer", name: "Speedy Writer", desc: "Hoàn thành phần Spelling đạt 100% dưới 40 giây", icon: "⚡", color: "linear-gradient(135deg, #fb923c, #c2410c)" },
    { id: "double_perfect", name: "Double Perfect", desc: "Đạt 100% ở cả bài Nghe và Nói của cùng 1 Unit", icon: "☯️", color: "linear-gradient(135deg, #22d3ee, #0891b2)" },
    { id: "all_rounder", name: "All Rounder", desc: "Đạt từ 90% trở lên ở cả 4 kỹ năng Nghe, Nói, Đọc, Viết của cùng 1 Unit", icon: "🎪", color: "linear-gradient(135deg, #ec4899, #701a75)" },
    { id: "unlocked_all_english", name: "English Overlord", desc: "Mở khóa thành công tất cả 49 thẻ năng lực Tiếng Anh khác", icon: "⚜️", color: "linear-gradient(135deg, #eab308, #854d0e)" }
];

// Đối tượng quản lý ứng dụng chính
const app = {
    // Trạng thái mặc định của người dùng
    config: {
        studentName: "",
        parentName: "",
        currentClass: "4",
        parentPin: "123456"
    },
    state: {
        xp: 0,
        streak: 0,
        lastActiveDate: null,
        scores: {},          // Lưu điểm cao nhất của mỗi bài { lessonId: score }
        badges: [],          // Danh sách huy hiệu đã đạt được
        history: [],         // Lịch sử trả lời câu hỏi phục vụ Dashboard phụ huynh
        distractions: 0,     // Số lần xao nhãng rời tab
        customVideos: {},     // Lưu trữ ID video tùy chỉnh do phụ huynh gán { lessonId: youtubeId }
        parentPin: "123456", // Mã PIN mặc định
        examSessions: [],    // Lưu trữ lịch sử các lượt làm bài chi tiết
        completedSubtopics: [], // Các dạng bài đã hoàn thành (score >= 80)
        subtopicScores: {},   // Lưu điểm cao nhất của mỗi dạng bài { subtopicId: score }
        completedLessonTheory: [] // Lưu các bài học đã hoàn thành lý thuyết giáo khoa
    },

    currentLesson: null,
    currentSubject: "math",  // Môn học hiện tại ("math" hoặc "english")
    currentSemester: 1,      // Học kỳ hiện tại (mặc định là 1)
    isDarkMode: true,
    pendingBadges: [],       // Hàng đợi huy hiệu chưa hiển thị khi đang ở màn hình Splash
    navHistory: [],          // Ngăn xếp lịch sử điều hướng
    justSentMessage: false,  // Cờ hiệu ứng trừ XP nhắn tin

    // Huy hiệu có sẵn trong hệ thống (15 huy hiệu chuẩn tâm lý học & gamification)
    systemBadges: [
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
        { id: "dem-so-lop-1", name: "Bậc Thầy Đếm Số Lớp 1", desc: "Đạt >= 90% ở bài đếm số trong phạm vi 10 hoặc 100 Lớp 1", icon: "🔢" },
        { id: "phep-cong-pham-vi-10", name: "Thần Đồng Cộng Trừ Lớp 1", desc: "Đạt >= 90% ở bài phép cộng hoặc phép trừ phạm vi 10 Lớp 1", icon: "➕" },
        { id: "hinh-khoi-lop-1", name: "Khối Hình Trực Quan Lớp 1", desc: "Đạt >= 90% ở bài nhận biết khối lập phương, khối hộp chữ nhật Lớp 1", icon: "📦" },
        { id: "do-luong-lop-1", name: "Nhà Đo Lường Nhí Lớp 1", desc: "Đạt >= 90% ở bài toán về thời gian, đồng hồ, lịch Lớp 1", icon: "⏰" },
        { id: "phep-cong-pham-vi-100", name: "Chuyên Gia Tính Phạm Vi 100", desc: "Đạt >= 90% ở bài phép tính không nhớ phạm vi 100 Lớp 1", icon: "💯" },
        { id: "on-tap-lop-1", name: "Vô Địch Toán Lớp 1", desc: "Hoàn thành xuất sắc bài ôn tập chung cuối năm Lớp 1 đạt >= 90%", icon: "🎓" },
        
        // Huy hiệu Lớp 4 (10 huy hiệu)
        { id: "trieu-lop-trieu", name: "Chinh Phục Triệu Số Lớp 4", desc: "Đạt >= 90% ở bài học hàng triệu và lớp triệu Lớp 4", icon: "💰" },
        { id: "trung-binh-cong", name: "Vua Trung Bình Cộng Lớp 4", desc: "Đạt >= 90% ở bài số trung bình cộng Lớp 4", icon: "📊" },
        { id: "tim-hai-so-tong-hieu", name: "Bậc Thầy Tổng Hiệu Lớp 4", desc: "Đạt >= 90% ở bài toán tìm hai số khi biết tổng và hiệu Lớp 4", icon: "⚖️" },
        { id: "tinh-chat-chia-het-4", name: "Nhà Thông Thái Chia Hết Lớp 4", desc: "Đạt >= 90% ở bài dấu hiệu chia hết (2, 5, 9, 3) Lớp 4", icon: "🛡️" },
        { id: "tinh-dien-tich-lop-4", name: "Kỹ Sư Diện Tích Lớp 4", desc: "Đạt >= 90% ở bài tính diện tích hình bình hành hoặc hình thoi Lớp 4", icon: "📐" },
        { id: "phan-so-lop-4", name: "Chuyên Gia Phân Số Lớp 4", desc: "Đạt >= 90% ở bài phân số và các phép tính phân số Lớp 4", icon: "🍰" },
        { id: "ti-so-lop-4", name: "Nhà Phân Tích Tỉ Số Lớp 4", desc: "Đạt >= 90% ở bài toán tỉ số và tìm hai số Lớp 4", icon: "📈" },
        { id: "do-luong-y-en-ta-tan", name: "Nhà Cân Đo Lớp 4", desc: "Đạt >= 90% ở bài đơn vị đo khối lượng yến, tạ, tấn Lớp 4", icon: "⚖️" },
        { id: "hinh-hoc-goc-nhon-tu", name: "Chuyên Gia Góc Học Lớp 4", desc: "Đạt >= 90% ở bài nhận biết góc nhọn, góc tù, góc bẹt Lớp 4", icon: "📐" },
        { id: "on-tap-lop-4", name: "Vô Địch Toán Lớp 4", desc: "Hoàn thành xuất sắc bài ôn tập chung cuối năm Lớp 4 đạt >= 90%", icon: "🎓" },
        
        // Huy hiệu Lớp 6 bổ sung chuyên sâu (9 huy hiệu)
        { id: "luy-thua-than-sau", name: "Chúa Tể Lũy Thừa Lớp 6", desc: "Đạt >= 95% ở bài lũy thừa với số mũ tự nhiên Lớp 6", icon: "⚡" },
        { id: "uoc-va-boi", name: "Chiến Thần Ước Bội Lớp 6", desc: "Đạt >= 95% ở bài ước chung lớn nhất hoặc bội chung nhỏ nhất Lớp 6", icon: "🛡️" },
        { id: "phep-tinh-so-nguyen", name: "Đại Sứ Số Nguyên Lớp 6", desc: "Đạt >= 95% ở các phép tính số nguyên Lớp 6", icon: "❄️" },
        { id: "hinh-hoc-truc-quan-6", name: "Nhà Thiết Kế Hình Lớp 6", desc: "Đạt >= 95% ở bài hình tam giác đều, hình vuông, hình lục giác đều Lớp 6", icon: "📐" },
        { id: "hinh-doi-xung-master", name: "Bậc Thầy Đối Xứng Lớp 6", desc: "Đạt >= 95% ở bài hình có trục hoặc tâm đối xứng Lớp 6", icon: "🌀" },
        { id: "phan-so-tieu-chuan-6", name: "Cao Thủ Phân Số Lớp 6", desc: "Đạt >= 95% ở các bài toán phân số nâng cao Lớp 6", icon: "🍰" },
        { id: "thap-phan-chuyen-nghiep", name: "Chuyên Gia Số Thập Phân Lớp 6", desc: "Đạt >= 95% ở các bài toán số thập phân Lớp 6", icon: "🎯" },
        { id: "hinh-hoc-phang-chuan-6", name: "Hình Học Phẳng Lớp 6", desc: "Đạt >= 95% ở các dạng bài hình học phẳng cơ bản Lớp 6", icon: "📐" },
        { id: "xac-suat-thuc-te", name: "Nhà Tiên Tri Xác Suất Lớp 6", desc: "Đạt >= 95% ở bài học xác suất thực nghiệm Lớp 6", icon: "🎲" },
        
        // Cột mốc và phép cộng dồn (6 huy hiệu)
        { id: "than-dong-toan-hoc", name: "Thần Đồng Toán Học", desc: "Tích lũy đạt mốc 1,000 XP môn Toán", icon: "🧠" },
        { id: "chien-binh-math-pro", name: "Chiến Binh Toán Học Pro", desc: "Tích lũy đạt mốc 2,500 XP môn Toán", icon: "🛡️" },
        { id: "huyen-thoai-math-legend", name: "Huyền Thoại Toán Học", desc: "Tích lũy đạt mốc 5,000 XP môn Toán", icon: "👑" },
        { id: "streak-math-30", name: "Kỷ Luật Thép 30 Ngày", desc: "Đạt chuỗi học tập liên tục môn Toán từ 30 ngày trở lên", icon: "🔥" },
        { id: "lam-chu-ly-thuyet-math", name: "Học Giả Lý Thuyết Toán", desc: "Hoàn thành phần lý thuyết của từ 10 bài học Toán trở lên", icon: "📜" },
        { id: "master-of-math", name: "Đại Sứ Toán Học Toàn Năng", desc: "Mở khóa thành công tất cả 49 huy hiệu Toán học khác", icon: "🏆" }
    ],

    // Bộ âm thanh tương tác sử dụng các file âm thanh chuyên nghiệp (.mp3)
    audio: {
        isUnlocked: false,
        tempMuteClick: false,
        sounds: {},
        ctx: null,
        initContext: function() {
            if (this.ctx) return;
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.ctx = new AudioContext();
                }
            } catch (e) {
                console.warn("Không khởi tạo được AudioContext:", e);
            }
        },
        init: function() {
            this.initContext();
            if (Object.keys(this.sounds).length > 0) return;
            try {
                this.sounds = {
                    startup: new Audio('/sounds/startup.mp3'),
                    click: new Audio('/sounds/click.mp3'),
                    tick: new Audio('/sounds/click.mp3'),
                    correct: new Audio('/sounds/correct.mp3'),
                    wrong: new Audio('/sounds/wrong.mp3'),
                    victory: new Audio('/sounds/clapping.mp3'),
                    defeat: new Audio('/sounds/failed.mp3'),
                    lose: new Audio('/sounds/lose.mp3'),
                    sword_hit: new Audio('/sounds/sword hit.mp3'),
                    magic_spell: new Audio('/sounds/magic spell.mp3'),
                    background: new Audio('/sounds/background.mp3'),
                    monter: new Audio('/sounds/monter.mp3')
                };

                // Thiết lập âm lượng lớn, rõ nét và chuyên nghiệp
                this.sounds.startup.volume = 0.95;
                this.sounds.click.volume = 0.9;
                this.sounds.tick.volume = 0.8;
                this.sounds.correct.volume = 1.0;
                this.sounds.wrong.volume = 1.0;
                this.sounds.victory.volume = 0.95;
                this.sounds.defeat.volume = 0.95;
                this.sounds.lose.volume = 0.95;
                this.sounds.sword_hit.volume = 0.85;
                this.sounds.magic_spell.volume = 0.85;
                this.sounds.monter.volume = 0.85;
                this.sounds.background.volume = 0.22; // Âm lượng nhạc nền vừa phải để nghe rõ âm thanh khác

                // Nạp trước dữ liệu âm thanh
                for (let key in this.sounds) {
                    this.sounds[key].load();
                }
            } catch (e) {
                console.error("Lỗi khởi tạo âm thanh:", e);
            }
        },
        playSound: function(name) {
            this.init();
            const soundFile = this.sounds[name];
            if (!soundFile) return;
            try {
                // Đặt lại thời gian phát về 0 để âm thanh có thể kích hoạt lại lập tức (không bị trễ do cloneNode)
                soundFile.currentTime = 0;
                const playPromise = soundFile.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log(`Không thể phát âm thanh ${name}:`, error);
                    });
                }
            } catch (e) {
                console.log(`Lỗi khi phát âm thanh ${name}:`, e);
            }
        },
        playStartup: function() {
            this.playSound('startup');
        },
        playClick: function() {
            this.playSound('click');
        },
        playTick: function() {
            this.playSound('tick');
        },
        playCorrect: function() {
            this.playSound('correct');
        },
        playWrong: function() {
            this.playSound('wrong');
        },
        playVictory: function() {
            this.playSound('victory');
        },
        playDefeat: function() {
            this.playSound('defeat');
        },
        playLose: function() {
            this.playSound('lose');
        },
        playBadge: function() {
            this.playSound('victory');
        },
        playSwordHit: function() {
            this.playSound('sword_hit');
        },
        playMagicSpell: function() {
            this.playSound('magic_spell');
        },
        playMessageNotification: function() {
            this.initContext();
            if (!this.ctx) {
                this.playSound('click');
                return;
            }
            try {
                const now = this.ctx.currentTime;
                // Nốt thứ nhất (tần số D5)
                const osc1 = this.ctx.createOscillator();
                const gain1 = this.ctx.createGain();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(587.33, now); 
                osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); 
                gain1.gain.setValueAtTime(0.12, now);
                gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
                osc1.connect(gain1);
                gain1.connect(this.ctx.destination);
                osc1.start(now);
                osc1.stop(now + 0.22);

                // Nốt thứ hai (tần số D6)
                const osc2 = this.ctx.createOscillator();
                const gain2 = this.ctx.createGain();
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(880, now + 0.08); 
                osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.22); 
                gain2.gain.setValueAtTime(0.12, now + 0.08);
                gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
                osc2.connect(gain2);
                gain2.connect(this.ctx.destination);
                osc2.start(now + 0.08);
                osc2.stop(now + 0.35);
            } catch (e) {
                console.warn("Lỗi phát âm thanh Web Audio API:", e);
                this.playSound('click');
            }
        },
        playMonter: function() {
            this.playSound('monter');
        },
        playBackground: function() {
            this.init();
            if (this.sounds.background) {
                this.sounds.background.loop = true;
                this.sounds.background.volume = 0.22; // Đảm bảo âm lượng nhạc nền vừa phải
                const playPromise = this.sounds.background.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        console.log("Không thể phát nhạc nền:", error);
                    });
                }
            }
        },
        stopBackground: function() {
            if (this.sounds.background) {
                try {
                    this.sounds.background.pause();
                    this.sounds.background.currentTime = 0;
                } catch (e) {
                    console.log("Lỗi dừng nhạc nền:", e);
                }
            }
        },
        playTdSound: function(type) {
            if (!this.isUnlocked) return;
            try {
                this.initContext();
                const ctx = this.ctx;
                if (!ctx) return;
                
                if (ctx.state === 'suspended') {
                    ctx.resume();
                }
                
                if (type === 'archer') {
                    // Tiếng vút tên bay nhẹ nhàng
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(600, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.12);
                    
                    gain.gain.setValueAtTime(0.2, ctx.currentTime);
                    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.12);
                    
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.12);
                    
                } else if (type === 'bomb') {
                    // Tiếng nổ pháo trầm (bùm bùm) khi đạn pháo nổ
                    const bufferSize = ctx.sampleRate * 0.35;
                    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < bufferSize; i++) {
                        data[i] = Math.random() * 2 - 1;
                    }
                    
                    const noiseNode = ctx.createBufferSource();
                    noiseNode.buffer = buffer;
                    
                    const filter = ctx.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(300, ctx.currentTime);
                    filter.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.35);
                    
                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(0.5, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
                    
                    noiseNode.connect(filter);
                    filter.connect(gain);
                    gain.connect(ctx.destination);
                    
                    noiseNode.start();
                    noiseNode.stop(ctx.currentTime + 0.35);
                    
                } else if (type === 'ice') {
                    // Tiếng xì xì đóng băng lạnh giá sắc sảo
                    const osc1 = ctx.createOscillator();
                    const osc2 = ctx.createOscillator();
                    const gain = ctx.createGain();
                    
                    osc1.type = 'sine';
                    osc1.frequency.setValueAtTime(1000, ctx.currentTime);
                    osc1.frequency.linearRampToValueAtTime(250, ctx.currentTime + 0.18);
                    
                    osc2.type = 'triangle';
                    osc2.frequency.setValueAtTime(1300, ctx.currentTime);
                    osc2.frequency.linearRampToValueAtTime(350, ctx.currentTime + 0.18);
                    
                    gain.gain.setValueAtTime(0.12, ctx.currentTime);
                    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.18);
                    
                    osc1.connect(gain);
                    osc2.connect(gain);
                    gain.connect(ctx.destination);
                    
                    osc1.start();
                    osc2.start();
                    osc1.stop(ctx.currentTime + 0.18);
                    osc2.stop(ctx.currentTime + 0.18);
                    
                } else if (type === 'sword_slash') {
                    // Tiếng kiếm chém leng keng (kim loại va chạm sắc sảo)
                    const osc1 = ctx.createOscillator();
                    const osc2 = ctx.createOscillator();
                    const gain = ctx.createGain();
                    
                    osc1.type = 'sine';
                    osc1.frequency.setValueAtTime(1800, ctx.currentTime);
                    osc1.frequency.exponentialRampToValueAtTime(3500, ctx.currentTime + 0.03);
                    osc1.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.12);
                    
                    osc2.type = 'triangle';
                    osc2.frequency.setValueAtTime(1400, ctx.currentTime);
                    osc2.frequency.exponentialRampToValueAtTime(2200, ctx.currentTime + 0.04);
                    osc2.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
                    
                    gain.gain.setValueAtTime(0.25, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);
                    
                    osc1.connect(gain);
                    osc2.connect(gain);
                    gain.connect(ctx.destination);
                    
                    osc1.start();
                    osc2.start();
                    osc1.stop(ctx.currentTime + 0.16);
                    osc2.stop(ctx.currentTime + 0.16);
                } else if (type === 'coin') {
                    // Tiếng keng keng đồng xu vàng lảnh lót
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(988, ctx.currentTime); // Nốt B5
                    osc.frequency.setValueAtTime(1318, ctx.currentTime + 0.08); // Nốt E6
                    
                    gain.gain.setValueAtTime(0.18, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
                    
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.35);
                    
                } else if (type === 'thunder') {
                    // Tiếng sét đánh vang dội đầy uy lực (nhiễu trắng + sóng sawtooth trầm)
                    const bufferSize = ctx.sampleRate * 0.45;
                    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < bufferSize; i++) {
                        data[i] = Math.random() * 2 - 1;
                    }
                    const noiseNode = ctx.createBufferSource();
                    noiseNode.buffer = buffer;

                    const osc = ctx.createOscillator();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(160, ctx.currentTime);
                    osc.frequency.linearRampToValueAtTime(30, ctx.currentTime + 0.45);

                    const filter = ctx.createBiquadFilter();
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(400, ctx.currentTime);

                    const gain = ctx.createGain();
                    gain.gain.setValueAtTime(0.35, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

                    noiseNode.connect(filter);
                    osc.connect(filter);
                    filter.connect(gain);
                    gain.connect(ctx.destination);

                    noiseNode.start();
                    osc.start();
                    noiseNode.stop(ctx.currentTime + 0.45);
                    osc.stop(ctx.currentTime + 0.45);
                }
            } catch (e) {
                console.warn("Lỗi phát âm thanh TD:", e);
            }
        }
    },

    // Tạo hiệu ứng pháo hoa giấy Confetti chúc mừng
    confetti: {
        canvas: null,
        ctx: null,
        particles: [],
        colors: ["#FF7F50", "#3E8EED", "#2ECC71", "#F1C40F", "#FF4D4D", "#9B59B6", "#1ABC9C"],
        animationFrame: null,
        active: false,

        init: function() {
            this.canvas = document.getElementById("confetti-canvas");
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext("2d");
            this.resize();
            // Lắng nghe sự kiện để cập nhật size canvas
            if (!this.hasResizeHandler) {
                window.addEventListener("resize", () => this.resize());
                this.hasResizeHandler = true;
            }
        },

        resize: function() {
            if (this.canvas) {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }
        },

        start: function() {
            this.init();
            if (!this.canvas || !this.ctx) return;
            this.particles = [];
            for (let i = 0; i < 150; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height - this.canvas.height,
                    r: Math.random() * 6 + 4,
                    d: Math.random() * this.canvas.height,
                    color: this.colors[Math.floor(Math.random() * this.colors.length)],
                    tilt: Math.random() * 10 - 5,
                    tiltAngleIncremental: Math.random() * 0.07 + 0.02,
                    tiltAngle: 0
                });
            }
            this.active = true;
            if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
            this.loop();
            
            // Tự động dừng sau 4 giây
            setTimeout(() => {
                this.stop();
            }, 4000);
        },

        loop: function() {
            if (!this.active) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let finished = true;
            this.particles.forEach(p => {
                p.tiltAngle += p.tiltAngleIncremental;
                p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
                p.x += Math.sin(p.tiltAngle);
                p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 15;

                this.ctx.beginPath();
                this.ctx.lineWidth = p.r;
                this.ctx.strokeStyle = p.color;
                this.ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
                this.ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
                this.ctx.stroke();

                if (p.y < this.canvas.height) {
                    finished = false;
                }
            });

            if (!finished) {
                this.animationFrame = requestAnimationFrame(() => this.loop());
            } else {
                this.stop();
            }
        },

        stop: function() {
            this.active = false;
            if (this.ctx && this.canvas) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        }
    },

    // Khởi tạo và cập nhật đồng hồ kỹ thuật số lớn trên màn hình chào mừng
    initSplashClock: function() {
        const timeEl = document.getElementById("splash-clock-time");
        const dateEl = document.getElementById("splash-clock-date");
        if (!timeEl || !dateEl) return;

        const updateClock = () => {
            const now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();

            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            timeEl.innerText = `${hours}:${minutes}:${seconds}`;

            const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
            const dayName = days[now.getDay()];
            const day = now.getDate();
            const month = now.getMonth() + 1;
            const year = now.getFullYear();

            dateEl.innerText = `${dayName}, ngày ${day} tháng ${month} năm ${year}`;
        };

        updateClock();
        setInterval(updateClock, 1000);
    },

    currentSplashQuoteIndex: 0,

    // Quản lý phát âm thanh nhắc nhở tiếng Việt ngẫu nhiên khi ở màn hình chào mừng
    initSplashGreeting: function() {
        // Dọn dẹp triệt để bất kỳ phiên chào mừng cũ nào đang chạy ngầm
        if (typeof this.stopSplashGreeting === 'function') {
            try { this.stopSplashGreeting(); } catch(e) {}
        }

        const sentencesCount = 14;
        let isMuted = localStorage.getItem("splash_greeting_muted") === "true";
        let greetingInterval = null;
        let greetingAudios = [];
        let currentlyPlaying = null;
        let hasPlayedOnce = false; // Theo dõi xem âm thanh đã được phát thành công hoặc đăng ký phát chưa

        // Tải nhạc nền dạo đầu /sounds/nen.mp3
        const bgNen = new Audio('/sounds/nen.mp3');
        bgNen.volume = 0;
        bgNen.onerror = (err) => {
            console.warn(`Nhạc nền /sounds/nen.mp3 chưa được ${this.config.parentName || 'phụ huynh'} bỏ vào thư mục sounds. Hệ thống sẽ phát trực tiếp châm ngôn.`, err.message);
        };

        // Tải trước các file âm thanh châm ngôn
        for (let i = 1; i <= sentencesCount; i++) {
            const audio = new Audio(`/sounds/quotes/quote_${i}.mp3`);
            audio.volume = 0.95;
            audio.onerror = (err) => {
                console.error(`Lỗi tải file âm thanh /sounds/quotes/quote_${i}.mp3. File có thể bị thiếu hoặc lỗi format.`, err);
            };
            greetingAudios.push(audio);
        }

        const muteBtn = document.getElementById("splash-mute-btn");
        const autoplayHint = document.getElementById("splash-autoplay-hint");

        // Quản lý hiệu ứng Fade âm lượng mượt mà sử dụng requestAnimationFrame
        let fadeRequestFrame = null;
        const fadeAudio = (audio, targetVolume, duration, onComplete) => {
            if (!audio) return;
            if (fadeRequestFrame) cancelAnimationFrame(fadeRequestFrame);
            
            const startVolume = audio.volume;
            const volumeDiff = targetVolume - startVolume;
            const startTime = performance.now();

            const updateVolume = (now) => {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                try {
                    audio.volume = startVolume + volumeDiff * progress;
                } catch (e) {}

                if (progress < 1) {
                    fadeRequestFrame = requestAnimationFrame(updateVolume);
                } else {
                    try {
                        audio.volume = targetVolume;
                    } catch (e) {}
                    if (onComplete) onComplete();
                }
            };
            
            fadeRequestFrame = requestAnimationFrame(updateVolume);
        };

        // Quản lý danh sách timeout để xóa sạch an toàn khi chuyển trang hoặc tắt tiếng
        let activeTimeouts = [];
        const clearActiveTimeouts = () => {
            activeTimeouts.forEach(t => clearTimeout(t));
            activeTimeouts = [];
        };
        const safeTimeout = (fn, delay) => {
            const t = setTimeout(fn, delay);
            activeTimeouts.push(t);
            return t;
        };

        const updateMuteUi = () => {
            if (!muteBtn) return;
            if (isMuted) {
                muteBtn.classList.add("muted");
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            } else {
                muteBtn.classList.remove("muted");
                muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            }
        };
        updateMuteUi();

        const toggleMute = (e) => {
            if (e) e.stopPropagation();
            isMuted = !isMuted;
            localStorage.setItem("splash_greeting_muted", isMuted ? "true" : "false");
            updateMuteUi();
            
            if (isMuted) {
                clearActiveTimeouts();
                if (fadeRequestFrame) cancelAnimationFrame(fadeRequestFrame);
                greetingAudios.forEach(a => {
                    try { a.pause(); a.currentTime = 0; } catch (err) {}
                });
                if (currentlyPlaying) {
                    try {
                        currentlyPlaying.pause();
                        currentlyPlaying.currentTime = 0;
                    } catch (err) {
                        console.warn("Không thể dừng hoặc reset currentlyPlaying khi tắt tiếng:", err);
                    }
                }
                try {
                    bgNen.pause();
                    bgNen.currentTime = 0;
                } catch (err) {}
            } else if (document.getElementById("splash-screen").style.display !== "none") {
                playCurrentSplashQuote();
            }
        };

        if (muteBtn) {
            muteBtn.onclick = toggleMute;
        }

        const playCurrentSplashQuote = () => {
            const splashScreen = document.getElementById("splash-screen");
            if (!splashScreen || splashScreen.style.display === "none") return;
            if (isMuted) return;

            // Đặt cờ ngay lập tức để ngăn chặn lượt phát trùng từ unlockAndPlay hoặc listener khác trong thời gian chờ 2.5s
            hasPlayedOnce = true;

            // Dừng triệt để tất cả các file âm thanh châm ngôn cũ
            greetingAudios.forEach(a => {
                try { a.pause(); a.currentTime = 0; } catch (e) {}
            });
            if (currentlyPlaying) {
                try {
                    currentlyPlaying.pause();
                    currentlyPlaying.currentTime = 0;
                } catch (err) {
                    console.warn("Không thể dừng hoặc reset currentlyPlaying khi chuyển câu châm ngôn:", err);
                }
            }
            try {
                bgNen.pause();
                bgNen.currentTime = 0;
            } catch (err) {}
            if (fadeRequestFrame) cancelAnimationFrame(fadeRequestFrame);
            clearActiveTimeouts();

            // Phát câu thoại khớp với chỉ số câu châm ngôn đang hiển thị
            const audioIdx = this.currentSplashQuoteIndex;
            currentlyPlaying = greetingAudios[audioIdx];
            
            if (!currentlyPlaying) return;

            // Bước 1: Khởi động phát nhạc nền dạo đầu (nen.mp3) từ volume 0 lên 0.22 trong 2.5 giây
            let hasBgMusic = true;
            try {
                bgNen.volume = 0;
                bgNen.currentTime = 0;
                const playNenPromise = bgNen.play();
                if (playNenPromise !== undefined) {
                    playNenPromise.catch(err => {
                        hasBgMusic = false;
                        console.log("Autoplay nhạc nền bị trình duyệt chặn hoặc file nen.mp3 chưa sẵn sàng:", err.message);
                    });
                }
                if (hasBgMusic) {
                    fadeAudio(bgNen, 0.22, 2500);
                }
            } catch (err) {
                hasBgMusic = false;
                console.warn("Lỗi khởi phát nhạc nền:", err);
            }

            // Bước 2: Chờ kết thúc 2.5 giây nhạc dạo, bắt đầu phát câu châm ngôn AI & giảm nhỏ nhạc đệm xuống 0.11
            const delayBeforeQuote = hasBgMusic ? 2500 : 0;
            safeTimeout(() => {
                try {
                    currentlyPlaying.currentTime = 0;
                    const playPromise = currentlyPlaying.play();
                    if (playPromise !== undefined) {
                        playPromise.then(() => {
                            if (autoplayHint) autoplayHint.classList.add("hidden");
                            
                            // Giảm nhỏ nhạc nền xuống 0.11 làm nhạc đệm ngầm lúc phát tiếng nói
                            if (hasBgMusic) {
                                fadeAudio(bgNen, 0.11, 1000);
                            }
                        }).catch(err => {
                            console.log("Autoplay châm ngôn bị trình duyệt chặn, hiển thị gợi ý click:", err.message);
                            if (autoplayHint) autoplayHint.classList.remove("hidden");
                            
                            // Nếu châm ngôn bị chặn phát, cho phép thử lại khi chạm
                            hasPlayedOnce = false;

                            // Nếu châm ngôn bị chặn phát, tắt nhạc nền đi ngay
                            if (hasBgMusic) {
                                fadeAudio(bgNen, 0, 1000, () => {
                                    bgNen.pause();
                                    bgNen.currentTime = 0;
                                });
                            }
                        });
                    }
                } catch (err) {
                    console.warn("Không thể phát âm thanh châm ngôn:", err);
                }

                // Bước 3 & 4: Khi tiếng nói châm ngôn đọc xong, giữ nhạc đệm chạy thêm 3 giây rồi giảm dần (fade-out) về 0 trong 2.5 giây và dừng
                currentlyPlaying.onended = () => {
                    // Xác định file âm thanh bổ sung tương ứng với câu châm ngôn
                    let audioFile = null;
                    if (audioIdx === 0) {
                        audioFile = Math.random() < 0.5 ? '/sounds/quotes/audio_1.mp3' : '/sounds/quotes/audio_2.mp3';
                    } else if (audioIdx === 1) {
                        audioFile = '/sounds/quotes/audio_3.mp3';
                    }

                    if (audioFile) {
                        const audio1 = new Audio(audioFile);
                        audio1.volume = 0.95;
                        
                        audio1.onerror = (err) => {
                            console.warn("Lỗi load file bổ sung " + audioFile + " (chưa được cấu hình). Fallback tắt nhạc nền.", err.message);
                            // Fallback tắt nhạc nền thông thường
                            safeTimeout(() => {
                                if (hasBgMusic) {
                                    fadeAudio(bgNen, 0, 2500, () => {
                                        bgNen.pause();
                                        bgNen.currentTime = 0;
                                    });
                                }
                            }, 3000);
                        };

                        // Lưu tham chiếu để có thể stop khẩn cấp (nếu click mute/start)
                        currentlyPlaying = audio1;

                        try {
                            const playAudio1Promise = audio1.play();
                            if (playAudio1Promise !== undefined) {
                                playAudio1Promise.then(() => {
                                    // Nhạc nền vẫn duy trì ở mức đệm nhỏ
                                    if (hasBgMusic) {
                                        fadeAudio(bgNen, 0.11, 500);
                                    }
                                }).catch(err => {
                                    console.warn("Autoplay " + audioFile + " bị chặn:", err.message);
                                    // Fallback tắt nhạc nền
                                    safeTimeout(() => {
                                        if (hasBgMusic) {
                                            fadeAudio(bgNen, 0, 2500, () => {
                                                bgNen.pause();
                                                bgNen.currentTime = 0;
                                            });
                                        }
                                    }, 3000);
                                });
                            }
                        } catch (err) {
                            console.warn("Lỗi phát " + audioFile + ":", err);
                        }

                        audio1.onended = () => {
                            safeTimeout(() => {
                                if (hasBgMusic) {
                                    fadeAudio(bgNen, 0, 2500, () => {
                                        bgNen.pause();
                                        bgNen.currentTime = 0;
                                    });
                                }
                            }, 3000);
                        };
                    } else {
                        // Các câu châm ngôn khác: tắt nhạc nền bình thường
                        safeTimeout(() => {
                            if (hasBgMusic) {
                                fadeAudio(bgNen, 0, 2500, () => {
                                    bgNen.pause();
                                    bgNen.currentTime = 0;
                                });
                            }
                        }, 3000);
                    }
                };

                currentlyPlaying.onerror = () => {
                    // Nếu lỗi file châm ngôn, tắt nhạc nền ngay lập tức
                    if (hasBgMusic) {
                        fadeAudio(bgNen, 0, 1000, () => {
                            bgNen.pause();
                            bgNen.currentTime = 0;
                        });
                    }
                };

            }, delayBeforeQuote);
        };

        // Bắt đầu phát khi có tương tác đầu tiên để vượt qua chính sách autoplay
        const unlockAndPlay = () => {
            const splashScreen = document.getElementById("splash-screen");
            if (!splashScreen || splashScreen.style.display === "none") return;

            // Ẩn gợi ý autoplay khi bé đã tương tác
            if (autoplayHint) autoplayHint.classList.add("hidden");

            this.audio.initContext();
            if (this.audio.ctx && this.audio.ctx.state === 'suspended') {
                this.audio.ctx.resume();
            }

            // Chỉ phát nếu chưa tự động phát thành công trước đó (nếu đã autoplay thành công thì bỏ qua không phát trùng)
            if (!hasPlayedOnce) {
                playCurrentSplashQuote();
            }

            document.removeEventListener("click", unlockAndPlay);
            document.removeEventListener("touchstart", unlockAndPlay);
            document.removeEventListener("keydown", unlockAndPlay);
        };

        document.addEventListener("click", unlockAndPlay);
        document.addEventListener("touchstart", unlockAndPlay);
        document.addEventListener("keydown", unlockAndPlay);

        // Thiết lập phát định kỳ sau mỗi 2 - 3 phút ngẫu nhiên (120 - 180 giây)
        const startInterval = () => {
            if (this.splashGreetingTimeout) clearTimeout(this.splashGreetingTimeout);
            const nextTime = 120000 + Math.random() * 60000;
            greetingInterval = setTimeout(() => {
                const splashScreen = document.getElementById("splash-screen");
                if (splashScreen && splashScreen.style.display !== "none") {
                    this.nextSplashQuote();
                }
            }, nextTime);
        };
        
        // Lưu tham chiếu để có thể reset từ bên ngoài (ví dụ khi nhấn phím Space)
        this.resetSplashGreetingInterval = startInterval;
        startInterval();

        this.splashGreetingTimeout = greetingInterval;
        
        // Bộ lắng nghe sự kiện nhấn phím Space để đổi nhanh châm ngôn
        const handleSpaceKey = (e) => {
            if (e.code === 'Space' || e.key === ' ' || e.keyCode === 32) {
                const splashScreen = document.getElementById("splash-screen");
                const isSplashVisible = splashScreen && splashScreen.style.display !== "none" && !splashScreen.classList.contains("fade-out");
                if (isSplashVisible) {
                    e.preventDefault(); // Ngăn hành vi cuộn trang mặc định
                    this.nextSplashQuote();
                }
            }
        };
        document.addEventListener("keydown", handleSpaceKey);
        
        // Expose hàm phát ra ngoài để gọi từ app.init()
        this.playSplashGreeting = playCurrentSplashQuote;
        
        this.stopSplashGreeting = () => {
            if (this.splashGreetingTimeout) clearTimeout(this.splashGreetingTimeout);
            clearActiveTimeouts();
            if (fadeRequestFrame) cancelAnimationFrame(fadeRequestFrame);
            
            document.removeEventListener("click", unlockAndPlay);
            document.removeEventListener("touchstart", unlockAndPlay);
            document.removeEventListener("keydown", unlockAndPlay);
            document.removeEventListener("keydown", handleSpaceKey); // Gỡ bỏ phím Space khi vào học
            
            if (currentlyPlaying) {
                try {
                    currentlyPlaying.pause();
                    currentlyPlaying.currentTime = 0;
                } catch (err) {
                    console.warn("Không thể dừng hoặc reset currentlyPlaying khi vào học tập:", err);
                }
            }
            try {
                bgNen.pause();
                bgNen.currentTime = 0;
            } catch (e) {}
        };
    },

    // Hàm chuyển đổi nhanh sang câu châm ngôn tiếp theo (sử dụng khi nhấn phím Space)
    nextSplashQuote: function() {
        const splashScreen = document.getElementById("splash-screen");
        if (!splashScreen || splashScreen.style.display === "none") return;

        console.log("Phím Space được nhấn: Chuyển sang châm ngôn tiếp theo.");

        // Chọn câu châm ngôn ngẫu nhiên mới hiển thị lên màn hình
        this.displayRandomSplashQuote();
        
        // Phát âm thanh châm ngôn mới đó kèm theo nhạc đệm
        if (typeof this.playSplashGreeting === 'function') {
            this.playSplashGreeting();
        }

        // Reset lại chu kỳ hẹn giờ phát tự động (đếm lại từ đầu 2-3 phút)
        if (typeof this.resetSplashGreetingInterval === 'function') {
            this.resetSplashGreetingInterval();
        }
    },

    // Giữ màn hình luôn sáng bằng Screen Wake Lock API
    initWakeLock: function() {
        let wakeLock = null;

        const requestWakeLock = async () => {
            if ('wakeLock' in navigator) {
                try {
                    wakeLock = await navigator.wakeLock.request('screen');
                    console.log('Screen Wake Lock đã được kích hoạt thành công!');
                } catch (err) {
                    console.warn(`Lỗi kích hoạt Screen Wake Lock: ${err.name}, ${err.message}`);
                }
            } else {
                console.warn('Trình duyệt không hỗ trợ Screen Wake Lock API.');
            }
        };

        // Kích hoạt sau tương tác đầu tiên của người dùng
        const handleInteraction = () => {
            requestWakeLock();
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };
        document.addEventListener('click', handleInteraction);
        document.addEventListener('touchstart', handleInteraction);

        // Kích hoạt lại khi tab hoạt động trở lại
        document.addEventListener('visibilitychange', async () => {
            if (wakeLock !== null && document.visibilityState === 'visible') {
                await requestWakeLock();
            }
        });
    },

    // Khởi tạo bộ đếm thời gian không hoạt động (Idle Timer 10 phút)
    initIdleTimer: function() {
        let idleTime = 0;
        const maxIdleTime = 10 * 60; // 10 phút = 600 giây

        // Hàm reset thời gian chờ
        const resetTimer = () => {
            idleTime = 0;
        };

        // Lắng nghe các tương tác của người dùng
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(name => {
            document.addEventListener(name, resetTimer, true);
        });

        // Chạy kiểm tra mỗi giây
        setInterval(() => {
            const splashScreen = document.getElementById("splash-screen");
            // Chỉ đếm nếu màn hình khởi động đang ẩn (bé đang trong ứng dụng)
            const isAppActive = splashScreen && splashScreen.style.display === "none";
            
            if (isAppActive) {
                // Kiểm tra xem bé có đang xem video YouTube không
                const isWatchingVideo = document.body.classList.contains("video-fullscreen-active") || 
                                       document.querySelector(".btn-exit-video-fullscreen") !== null;
                
                // Kiểm tra xem bé có đang làm bài tập trắc nghiệm không
                const practiceActiveBox = document.getElementById("practice-active-box");
                const isPracticing = practiceActiveBox && !practiceActiveBox.classList.contains("hidden");

                if (!isWatchingVideo && !isPracticing) {
                    idleTime++;
                    if (idleTime >= maxIdleTime) {
                        resetTimer();
                        // Quay lại màn hình khởi động
                        this.returnToSplashScreen();
                    }
                } else {
                    // Nếu đang xem video hoặc làm bài tập, liên tục reset bộ đếm
                    resetTimer();
                }
            } else {
                resetTimer();
            }
        }, 1000);
    },

    // Chuyển cảnh quay lại màn hình khởi động
    returnToSplashScreen: function() {
        const splashScreen = document.getElementById("splash-screen");
        if (!splashScreen) return;

        console.log("Ứng dụng tự động quay về màn hình khởi động do quá 10 phút không tương tác.");

        // Tối ưu hiệu năng: dừng heartbeat và notification polling khi quay về Splash Screen
        this.stopHeartbeat();

        // Dừng video đang phát
        if (typeof this.exitVideoFullscreen === 'function') {
            this.exitVideoFullscreen();
        }

        // Thoát khỏi bài luyện tập trắc nghiệm nếu đang làm dở
        const practiceActiveBox = document.getElementById("practice-active-box");
        if (practiceActiveBox && !practiceActiveBox.classList.contains("hidden")) {
            if (window.questions && typeof questions.exitPractice === 'function' && !questions.isExiting) {
                questions.exitPractice();
            }
        }

        // Hiển thị lại màn hình khởi động
        splashScreen.style.display = "flex";
        splashScreen.classList.remove("fade-out");

        // Khởi động lại âm thanh chào mừng và cập nhật châm ngôn
        this.initSplashGreeting();
        this.displayRandomSplashQuote();
        if (typeof this.playSplashGreeting === 'function') {
            this.playSplashGreeting();
        }
    },

    // Chọn ngẫu nhiên một câu châm ngôn học tập và hiển thị lên Màn hình chào mừng
    displayRandomSplashQuote: function() {
        const textEl = document.getElementById("splash-quote-text");
        const authorEl = document.getElementById("splash-quote-author");
        if (!textEl || !authorEl) return;
        
        const quotes = [
            { text: "Biển học vô bờ, chuyên cần là bến bờ.", author: "Tục ngữ Việt Nam" },
            { text: "Đi một ngày đàng, học một sàng khôn.", author: "Tục ngữ Việt Nam" },
            { text: "Có công mài sắt, có ngày nên kim.", author: "Tục ngữ Việt Nam" },
            { text: "Muốn biết phải hỏi, muốn giỏi phải học.", author: "Tục ngữ Việt Nam" },
            { text: "Rễ của học tập thì đắng cay, nhưng quả của nó thì ngọt ngào.", author: "Aristotle" },
            { text: "Học tập là cuốn sổ thông hành cho tương lai, vì ngày mai thuộc về những người chuẩn bị cho nó từ hôm nay.", author: "Malcolm X" },
            { text: "Kiến thức là sức mạnh. Sự chăm chỉ là chìa khóa mở cánh cửa tương lai.", author: "Khuyết danh" },
            { text: "Thiên tài chỉ có 1% là năng khiếu bẩm sinh, 99% còn lại là sự mồ hôi và cần cù.", author: "Thomas Edison" },
            { text: "Đường tuy ngắn, không đi không đến. Việc tuy nhỏ, không làm không nên.", author: "Tuân Tử" },
            { text: "Đầu tư vào kiến thức luôn mang lại lợi nhuận cao nhất.", author: "Benjamin Franklin" },
            { text: "Học tập không bao giờ làm trí tuệ kiệt sức.", author: "Leonardo da Vinci" },
            { text: "Đừng xấu hổ khi không biết, chỉ xấu hổ khi không học.", author: "Khuyết danh" },
            { text: "Học tập giống như chèo thuyền ngược nước, không tiến lên nghĩa là thối lui.", author: "Châm ngôn phương Đông" },
            { text: "Học không biết chán, dạy người không biết mệt.", author: "Khổng Tử" }
        ];
        
        const randIndex = Math.floor(Math.random() * quotes.length);
        const selected = quotes[randIndex];
        
        textEl.innerText = selected.text;
        authorEl.innerText = `— ${selected.author}`;
        
        // Lưu trữ lại chỉ số câu châm ngôn hiện tại để phát file âm thanh tương ứng
        this.currentSplashQuoteIndex = randIndex;
    },

    getLocalStorageKey: function() {
        const studentId = this.config && this.config.defaultStudentId ? this.config.defaultStudentId : "default";
        const classLevel = this.config && ["1", "4"].includes(this.config.currentClass) ? this.config.currentClass : "6";
        return `toan${classLevel}_edtech_progress_${studentId}`;
    },

    getApiUrl: function(path) {
        if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
            return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`;
        }
        return path;
    },

    loadConfig: async function() {
        try {
            const res = await fetch(this.getApiUrl('/api/load-config'));
            if (res.ok) {
                const data = await res.json();
                if (data && Object.keys(data).length > 0) {
                    this.config = { ...this.config, ...data };
                } else {
                    await this.saveConfig();
                }
            }
        } catch(e) {
            console.error("Lỗi đọc config từ SQLite:", e);
        }
    },

    saveConfig: async function(token) {
        try {
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            await fetch(this.getApiUrl('/api/save-config'), {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(this.config)
            });
        } catch(e) {
            console.error("Lỗi lưu config vào SQLite:", e);
        }
    },

    getDefaultState: function() {
        return {
            xp: 0,
            streak: 0,
            lastActiveDate: null,
            scores: {},
            badges: [],
            goldBadges: [],
            history: [],
            distractions: 0,
            customVideos: {},
            parentPin: this.config ? this.config.parentPin : "123456",
            examSessions: [],
            completedSubtopics: [],
            subtopicScores: {},
            completedLessonTheory: [],
            subjects: {
                math: {
                    scores: {},
                    completedSubtopics: [],
                    subtopicScores: {},
                    completedLessonTheory: [],
                    examSessions: []
                },
                english: {
                    scores: {},
                    completedSubtopics: [],
                    subtopicScores: {},
                    completedLessonTheory: [],
                    examSessions: [],
                    skillScores: { listening: 0, speaking: 0, reading: 0, spelling: 0 },
                    weakVocabulary: []
                }
            }
        };
    },

    restoreMathProgress: function() {
        if (!this.state.subjects || !this.state.subjects.math) return;
        
        const math = this.state.subjects.math;
        if (!math.scores) math.scores = {};
        if (!math.completedSubtopics) math.completedSubtopics = [];
        if (!math.subtopicScores) math.subtopicScores = {};

        let hasChange = false;

        // 1. Quét levelScores
        if (this.state.levelScores) {
            for (const key in this.state.levelScores) {
                const parts = key.split('_');
                if (parts.length >= 2) {
                    const lessonId = parts[0];
                    const score = this.state.levelScores[key];
                    const oldScore = math.scores[lessonId] || 0;
                    if (score > oldScore) {
                        math.scores[lessonId] = score;
                        hasChange = true;
                    }
                }
            }
        }

        // 2. Quét history đề phòng
        if (Array.isArray(this.state.history)) {
            this.state.history.forEach(item => {
                if (item.lessonId && !item.lessonId.startsWith('eng')) {
                    if (math.scores[item.lessonId] === undefined) {
                        if (item.action === 'lesson_completed' && item.score !== undefined) {
                            math.scores[item.lessonId] = item.score;
                            hasChange = true;
                        } else if (item.isCorrect !== undefined) {
                            math.scores[item.lessonId] = item.isCorrect ? 100 : 50;
                            hasChange = true;
                        }
                    } else if (item.action === 'lesson_completed' && item.score !== undefined) {
                        if (item.score > math.scores[item.lessonId]) {
                            math.scores[item.lessonId] = item.score;
                            hasChange = true;
                        }
                    }
                }
            });
        }

        // 3. Khôi phục completedSubtopics dựa trên scores >= 80
        if (typeof COURSE_DATA !== 'undefined') {
            COURSE_DATA.forEach(chapter => {
                if (!chapter.subject || chapter.subject === 'math') {
                    chapter.lessons.forEach(lesson => {
                        const score = math.scores[lesson.id] || 0;
                        if (score >= 80) {
                            if (lesson.subtopics && Array.isArray(lesson.subtopics)) {
                                lesson.subtopics.forEach(sub => {
                                    if (!math.completedSubtopics.includes(sub.id)) {
                                        math.completedSubtopics.push(sub.id);
                                        hasChange = true;
                                    }
                                    if ((math.subtopicScores[sub.id] || 0) < score) {
                                        math.subtopicScores[sub.id] = score;
                                        hasChange = true;
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
        if (hasChange) {
            console.log("[Data Restore] Đã đồng bộ khôi phục điểm Toán mới!", math.scores);
        }
    },

    setupSubjectStateProxies: function() {
        if (!this.state.subjects) {
            this.state.subjects = {
                math: {
                    scores: this.state.scores || {},
                    completedSubtopics: this.state.completedSubtopics || [],
                    subtopicScores: this.state.subtopicScores || {},
                    completedLessonTheory: this.state.completedLessonTheory || [],
                    examSessions: this.state.examSessions || []
                },
                english: {
                    scores: {},
                    completedSubtopics: [],
                    subtopicScores: {},
                    completedLessonTheory: [],
                    examSessions: [],
                    skillScores: { listening: 0, speaking: 0, reading: 0, spelling: 0 },
                    weakVocabulary: []
                }
            };
        } else {
            if (!this.state.subjects.math) {
                this.state.subjects.math = {
                    scores: this.state.scores || {},
                    completedSubtopics: this.state.completedSubtopics || [],
                    subtopicScores: this.state.subtopicScores || {},
                    completedLessonTheory: this.state.completedLessonTheory || [],
                    examSessions: this.state.examSessions || []
                };
            }
            if (!this.state.subjects.english) {
                this.state.subjects.english = {
                    scores: {},
                    completedSubtopics: [],
                    subtopicScores: {},
                    completedLessonTheory: [],
                    examSessions: [],
                    skillScores: { listening: 0, speaking: 0, reading: 0, spelling: 0 },
                    weakVocabulary: []
                };
            }
        }

        const fields = ['scores', 'completedSubtopics', 'subtopicScores', 'completedLessonTheory', 'examSessions'];
        fields.forEach(field => {
            Object.defineProperty(this.state, field, {
                get: () => {
                    const subj = this.currentSubject || 'math';
                    if (!this.state.subjects[subj]) {
                        this.state.subjects[subj] = {};
                    }
                    if (!this.state.subjects[subj][field]) {
                        this.state.subjects[subj][field] = (field === 'scores' || field === 'subtopicScores') ? {} : [];
                    }
                    return this.state.subjects[subj][field];
                },
                set: (val) => {
                    const subj = this.currentSubject || 'math';
                    if (!this.state.subjects[subj]) {
                        this.state.subjects[subj] = {};
                    }
                    this.state.subjects[subj][field] = val;
                },
                configurable: true
            });
        });
        this.syncXpGettersSetters();
    },

    syncXpGettersSetters: function() {
        if (!this.state) return;
        if (this._syncingXp) return;
        this._syncingXp = true;

        try {
            if (!this.state.xpMerged) {
                const mathXp = parseInt(this.state.xp) || 0;
                const engXp = parseInt(this.state.englishXp) || 0;
                this.state._sharedXp = mathXp + engXp;
                this.state.xpMerged = true;
            } else if (typeof this.state._sharedXp === 'undefined') {
                this.state._sharedXp = parseInt(this.state.englishXp) || parseInt(this.state.xp) || 0;
            }

            let currentSharedXp = parseInt(this.state._sharedXp) || 0;

            delete this.state.xp;
            delete this.state.englishXp;

            Object.defineProperty(this.state, 'xp', {
                get: () => currentSharedXp,
                set: (val) => {
                    const intVal = parseInt(val) || 0;
                    currentSharedXp = intVal;
                    this.state._sharedXp = intVal;
                    const xpVal = document.getElementById("eng-xp-val");
                    if (xpVal) xpVal.innerText = intVal;
                    const mainXpVal = document.getElementById("xp-val");
                    if (mainXpVal) mainXpVal.innerText = intVal;
                    const heroXp = document.getElementById("hero-xp");
                    if (heroXp) heroXp.innerText = intVal;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(this.state, 'englishXp', {
                get: () => currentSharedXp,
                set: (val) => {
                    const intVal = parseInt(val) || 0;
                    currentSharedXp = intVal;
                    this.state._sharedXp = intVal;
                    const xpVal = document.getElementById("eng-xp-val");
                    if (xpVal) xpVal.innerText = intVal;
                    const mainXpVal = document.getElementById("xp-val");
                    if (mainXpVal) mainXpVal.innerText = intVal;
                    const heroXp = document.getElementById("hero-xp");
                    if (heroXp) heroXp.innerText = intVal;
                },
                enumerable: true,
                configurable: true
            });
        } finally {
            this._syncingXp = false;
        }
    },

    switchClass: async function(newClass) {
        // 1. Lưu tiến trình lớp cũ
        await this.saveProgress();
        
        // 2. Cập nhật cấu hình lớp mới và tên mặc định tương ứng
        this.config.currentClass = newClass;
        if (this.config.students && this.config.students.length > 0) {
            const matchedStudent = this.config.students.find(s => s.classLevel === newClass);
            if (matchedStudent) {
                this.config.defaultStudentId = matchedStudent.id;
                this.config.studentName = matchedStudent.name;
                this.config.parentName = matchedStudent.parentName;
            }
        }
        await this.saveConfig();
        
        // 3. Reset state trong bộ nhớ về mặc định
        this.state = this.getDefaultState();
        
        // 4. Nạp tiến trình lớp mới
        await this.loadProgress();
        
        // 5. Cập nhật giao diện chào mừng và timeline
        this.initSplashGreeting();
        
        // Cập nhật các chỉ số Gamification lên Màn hình chào mừng
        const splashStreak = document.getElementById("splash-streak-val");
        const splashXp = document.getElementById("splash-xp-val");
        const splashBadge = document.getElementById("splash-badge-count");
        if (splashStreak) splashStreak.innerText = this.state.streak;
        if (splashXp) splashXp.innerText = this.state.xp;
        if (splashBadge) splashBadge.innerText = this.state.badges ? this.state.badges.length : 0;
        
        // Cập nhật header
        this.updateHeaderStats();
        
        // Chọn học kỳ mặc định của lớp đó
        this.currentSemester = 1;
        const semTab1 = document.getElementById("sem-tab-1");
        const semTab2 = document.getElementById("sem-tab-2");
        if (semTab1) semTab1.classList.add("active");
        if (semTab2) semTab2.classList.remove("active");
        
        this.renderTimeline();
        
        // Hiển thị welcome panel sạch
        document.getElementById("welcome-viewer-panel").classList.remove("hidden");
        document.getElementById("lesson-detail-panel").classList.add("hidden");
        
        // Đổi text welcome panel
        this.updateWelcomeViewerPanelText();
    },

    updateWelcomeViewerPanelText: function() {
        const studentName = this.config.studentName || "Học sinh";
        const parentName = this.config.parentName || "Phụ huynh";
        const currentClass = this.config.currentClass || "6";

        const welcomeBox = document.querySelector("#welcome-viewer-panel .welcome-box");
        if (welcomeBox) {
            welcomeBox.innerHTML = `
                <h2>Chào mừng ${studentName}! 👋</h2>
                <p>Phần mềm học Toán đặc biệt do <b>${parentName}</b> thiết kế dành riêng cho con. Hãy cùng chinh phục kiến thức Toán lớp ${currentClass}, vượt qua các bài học để nhận Huy hiệu danh giá nhé! Chúc con học thật giỏi!</p>
`;
        }
        
        // Đồng bộ tiêu đề lộ trình trên sidebar
        const sidebarTitle = document.querySelector(".sidebar-title-text");
        if (sidebarTitle) {
            sidebarTitle.innerHTML = `<i class="fa-solid fa-map-signs"></i> Lộ trình học Toán ${currentClass}`;
        }

        // Cập nhật tên chào mừng trên màn hình Splash Screen
        const splashWelcome = document.querySelector(".splash-welcome-user");
        if (splashWelcome) {
            splashWelcome.innerHTML = `Chào mừng học sinh <strong class="user-highlight">${studentName}</strong>! 👋`;
        }

        // Cập nhật tên trong cảnh báo chưa mở khóa bài kiểm tra
        const lockedNameSpan = document.getElementById("locked-warning-student-name");
        if (lockedNameSpan) lockedNameSpan.textContent = studentName;

        // Cập nhật tiêu đề chọn chế độ thực hành
        const practiceModeTitle = document.getElementById("practice-mode-title");
        if (practiceModeTitle) practiceModeTitle.textContent = `${studentName} ơi, con muốn làm bài theo phong cách nào?`;

        // Cập nhật mô tả lịch sử làm bài trong tab lịch sử
        const lessonHistDesc = document.getElementById("lesson-history-student-desc");
        if (lessonHistDesc) lessonHistDesc.textContent = `Danh sách các lần luyện tập và kiểm tra bài học này của ${studentName}.`;

        // Cập nhật tiêu đề màn hình huy hiệu (nếu có)
        const badgeScreenTitle = document.querySelector("#screen-badges h3");
        if (badgeScreenTitle) badgeScreenTitle.innerHTML = `🏅 Bộ sưu tập Huy hiệu của ${studentName}`;
    },

    // Khởi chạy không gian làm việc cho học sinh hiện tại
    initStudentWorkspace: async function() {
        // 1. Tải thông tin học sinh hiện tại từ config và hiển thị tức thì lên Splash Screen
        const student = this.config.students ? this.config.students.find(s => s.id === this.config.defaultStudentId) : null;
        if (student) {
            this.config.studentName = student.name;
            this.config.parentName = student.parentName || "Phụ huynh";
            this.config.currentClass = student.classLevel;
        }

        // Khởi chạy các thành phần Splash Screen tức thì
        try { this.initSplashClock(); } catch(e) { console.error("Lỗi initSplashClock:", e); }
        try { this.displayRandomSplashQuote(); } catch(e) { console.error("Lỗi displayRandomSplashQuote:", e); }
        try { this.updateWelcomeViewerPanelText(); } catch(e) { console.error("Lỗi updateWelcomeViewerPanelText:", e); }
        try { this.initTheme(); } catch(e) { console.error("Lỗi initTheme:", e); }
        try { this.initSplashGreeting(); } catch(e) { console.error("Lỗi initSplashGreeting:", e); }
        
        // Thử phát câu chào châm ngôn đầu tiên
        if (typeof this.playSplashGreeting === 'function') {
            try { this.playSplashGreeting(); } catch(e) { console.error("Lỗi playSplashGreeting:", e); }
        }

        // 2. Chạy ngầm nạp tiến trình học tập từ CSDL SQLite và vẽ lộ trình bài học phía sau
        try {
            await this.loadProgress();
        } catch (e) {
            console.error("Lỗi khi tải tiến trình học tập:", e);
        }

        // Cập nhật các chỉ số Gamification lên Màn hình chào mừng (Splash Screen) sớm nhất có thể
        try {
            const splashStreak = document.getElementById("splash-streak-val");
            const splashXp = document.getElementById("splash-xp-val");
            const splashBadge = document.getElementById("splash-badge-count");
            if (splashStreak) splashStreak.innerText = this.state.streak || 0;
            if (splashXp) splashXp.innerText = this.state.xp || 0;
            if (splashBadge) splashBadge.innerText = this.state.badges ? this.state.badges.length : 0;
        } catch (e) {
            console.error("Lỗi khi cập nhật chỉ số Gamification trên Splash Screen:", e);
        }

        try {
            this.checkStreak();
        } catch (e) {
            console.error("Lỗi checkStreak:", e);
        }

        // Tự động tìm học kỳ của bài đang làm để thiết lập trước khi render timeline
        try {
            const activeInfo = this.getActiveLesson();
            if (activeInfo) {
                this.currentSemester = activeInfo.semester;
            }
        } catch (e) {
            console.error("Lỗi getActiveLesson:", e);
        }

        try {
            this.renderTimeline();
        } catch (e) {
            console.error("Lỗi renderTimeline:", e);
        }

        try {
            this.updateHeaderStats();
        } catch (e) {
            console.error("Lỗi updateHeaderStats:", e);
        }

        try {
            this.initDistractionTracker();
        } catch (e) {
            console.error("Lỗi initDistractionTracker:", e);
        }

        try {
            this.initFullscreenListeners(); // Khởi tạo bộ lắng nghe Fullscreen
        } catch (e) {
            console.error("Lỗi initFullscreenListeners:", e);
        }

        try {
            this.initAiProgressTracker(); // Theo dõi tiến trình sinh đề ngầm của AI
        } catch (e) {
            console.error("Lỗi initAiProgressTracker:", e);
        }
        
        try {
            // Kích hoạt sinh đề ngầm cho học sinh này ở backend (luôn chạy môn Toán)
            const studentId = this.config.defaultStudentId || 'default';
            const classLevel = this.config.currentClass || '6';
            const subject = 'math';
            fetch(this.getApiUrl('/api/start-student-pregen'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, classLevel, subject })
            }).then(res => res.json())
              .then(data => console.log('[AI Pre-gen Activation]', data.message))
              .catch(err => console.error('[AI Pre-gen Activation Error]', err));
        } catch (e) {
            console.error("Lỗi kích hoạt start-student-pregen:", e);
        }

        try {
            this.initWakeLock();
        } catch (e) {
            console.error("Lỗi initWakeLock:", e);
        }

        try {
            this.initIdleTimer();
        } catch (e) {
            console.error("Lỗi initIdleTimer:", e);
        }

        // Tối ưu hiệu năng: không khởi chạy startHeartbeat ở đây, sẽ khởi chạy khi bé nhấn bắt đầu học tập và vào giao diện chính
    },

    // Hiển thị màn hình thiết lập ban đầu
    showSetupInitialScreen: function() {
        const setupScreen = document.getElementById("setup-initial-screen");
        const selectScreen = document.getElementById("student-select-screen");
        const splashScreen = document.getElementById("splash-screen");

        if (setupScreen) setupScreen.classList.remove("hidden");
        if (selectScreen) selectScreen.classList.add("hidden");
        if (splashScreen) splashScreen.classList.add("hidden");
        this.pushHistory('setup-initial');
        this.updateNavigationButtons();
    },

    // Gửi thông tin thiết lập ban đầu lên server
    submitInitialSetup: async function() {
        const parentName = document.getElementById("setup-parent-name")?.value.trim();
        const parentPin = document.getElementById("setup-parent-pin")?.value.trim();
        const studentName = document.getElementById("setup-student-name")?.value.trim();
        const classLevel = document.querySelector('input[name="setup-class-level"]:checked')?.value;

        if (!parentName || !parentPin || !studentName || !classLevel) {
            Swal.fire({
                title: "Lỗi!",
                text: "Vui lòng điền đầy đủ các thông tin yêu cầu.",
                icon: "error",
                confirmButtonColor: "#7c3aed"
            });
            return;
        }

        Swal.fire({
            title: "Đang thiết lập...",
            text: "Vui lòng đợi trong giây lát.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const response = await fetch(this.getApiUrl('/api/setup-initial'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    parentName,
                    parentPin,
                    studentName,
                    classLevel
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                Swal.fire({
                    title: "Thiết lập thành công! 🎉",
                    text: "Bây giờ con có thể bắt đầu hành trình học tập.",
                    icon: "success",
                    confirmButtonColor: "#7c3aed"
                }).then(() => {
                    // Tải lại config và khởi động ứng dụng
                    window.location.reload();
                });
            } else {
                throw new Error(data.error || "Lỗi không xác định khi thiết lập.");
            }
        } catch (error) {
            console.error("Lỗi submit thiết lập:", error);
            Swal.fire({
                title: "Lỗi thiết lập!",
                text: error.message || "Không thể kết nối tới máy chủ.",
                icon: "error",
                confirmButtonColor: "#7c3aed"
            });
        }
    },

    // Hiển thị màn hình lựa chọn học sinh ban đầu
    showStudentSelectionScreen: function() {
        const selectScreen = document.getElementById("student-select-screen");
        const splashScreen = document.getElementById("splash-screen");
        const selectList = document.getElementById("student-select-list");

        // Điều khiển hiển thị nút quay lại (Chỉ cho phép quay lại Splash nếu đã đăng nhập học sinh trước đó)
        const backBtn = document.getElementById("student-select-back-btn");
        if (backBtn) {
            if (this.config && this.config.defaultStudentId && this.config.students && this.config.students.some(s => s.id === this.config.defaultStudentId)) {
                backBtn.classList.remove("hidden");
            } else {
                backBtn.classList.add("hidden");
            }
        }

        if (selectScreen) selectScreen.classList.remove("hidden");
        if (splashScreen) splashScreen.classList.add("hidden");
        this.pushHistory('student-select');
        this.updateNavigationButtons();

        if (!selectList) return;
        selectList.innerHTML = "";

        const students = this.config.students || [];
        if (students.length === 0) {
            selectList.innerHTML = `
                <div class="p-4 text-center text-white/70 bg-white/5 border border-white/10 rounded-2xl" style="grid-column: 1 / -1;">
                    <p class="font-bold text-sm">Chưa có tài khoản học sinh nào!</p>
                    <p class="text-xs mt-1 text-slate-300">Phụ huynh vui lòng nhấp vào nút "Góc Phụ huynh" ở dưới để thêm tài khoản học tập cho con.</p>
                </div>
            `;
            return;
        }

        students.forEach(st => {
            const btn = document.createElement("button");
            btn.className = "flex items-center justify-between p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white/20 hover:border-white/30 transition duration-300 text-left w-full text-white shadow-lg backdrop-blur-md";
            btn.style.cursor = "pointer";
            btn.onclick = () => this.selectStudentWithPin(st.id);
            btn.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-violet-600/30 rounded-full flex items-center justify-center border border-violet-500/20">
                        <i class="fa-solid fa-user text-violet-300"></i>
                    </div>
                    <div>
                        <strong class="block text-base font-bold text-white">${st.name}</strong>
                        <span class="text-xs text-slate-300">Toán lớp ${st.classLevel}</span>
                    </div>
                </div>
                <div class="text-violet-400">
                    <i class="fa-solid fa-chevron-right text-sm"></i>
                </div>
            `;
            selectList.appendChild(btn);
        });
    },

    // Chọn học sinh và xác thực mã PIN phụ huynh
    selectStudentWithPin: function(studentId) {
        const student = this.config.students.find(s => s.id === studentId);
        if (!student) return;

        Swal.fire({
            title: `Đăng nhập cho ${student.name}`,
            text: `Nhập Mã PIN phụ huynh để xác nhận và ghi nhớ tài khoản này cho các lần sau:`,
            input: 'password',
            inputPlaceholder: 'Mã PIN phụ huynh...',
            inputAttributes: {
                maxlength: 15,
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Đăng nhập',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#8b5cf6',
            cancelButtonColor: '#475569',
            preConfirm: async (pin) => {
                if (!pin) {
                    Swal.showValidationMessage('Vui lòng nhập mã PIN!');
                    return false;
                }
                try {
                    const res = await fetch(this.getApiUrl('/api/admin/login'), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ password: pin })
                    });
                    if (!res.ok) {
                        const err = await res.json();
                        Swal.showValidationMessage(err.error || 'Mã PIN phụ huynh không chính xác!');
                        return false;
                    }
                    const data = await res.json();
                    return data.token; // Trả về token thu được từ server để dùng tiếp ở block .then
                } catch (e) {
                    Swal.showValidationMessage('Lỗi kết nối máy chủ khi xác thực PIN!');
                    return false;
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const token = result.value;
                // Đặt làm mặc định và lưu cấu hình
                this.config.defaultStudentId = studentId;
                await this.saveConfig(token);

                // Ẩn màn hình chọn và hiện màn chào mừng
                document.getElementById("student-select-screen").classList.add("hidden");
                document.getElementById("splash-screen").classList.remove("hidden");

                Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công',
                    text: `Chào mừng ${student.name} bắt đầu học tập!`,
                    timer: 2000,
                    showConfirmButton: false
                });

                // Khởi chạy Workspace học sinh
                await this.initStudentWorkspace();
            }
        });
    },

    initFirebaseClient: async function() {
        if (typeof firebase === 'undefined') {
            console.warn("Firebase SDK chưa được load (offline hoặc lỗi mạng).");
            return null;
        }
        try {
            const fbConfigRes = await fetch(this.getApiUrl('/api/auth/firebase-config'));
            if (!fbConfigRes.ok) throw new Error("Không thể lấy cấu hình Firebase từ Server.");
            const fbConfig = await fbConfigRes.json();
            if (!firebase.apps.length) {
                firebase.initializeApp(fbConfig);
            }
            return {
                auth: firebase.auth(),
                db: firebase.firestore()
            };
        } catch (e) {
            console.error("Lỗi khởi tạo Firebase Client:", e);
            return null;
        }
    },

    autoMigrateParentUidByEmail: async function(db, email, newParentUid) {
        if (!db || !email || !newParentUid) return;
        const normalizedEmail = email.toLowerCase().trim();
        console.log(`🔄 [Client Sync] Kiểm tra tự động chuyển đổi parentUid cho email ${normalizedEmail} sang UID mới ${newParentUid}...`);
        try {
            const batch = db.batch();
            let hasChanges = false;

            // 1. Phân quyền và liên kết đích danh theo Email Phụ huynh
            if (normalizedEmail.includes('skyprotect')) {
                // skyprotect@gmail.com quản lý 2 học sinh: Trần Bình Minh & Trần Bảo Ngọc
                const bmRef = db.collection('students').doc('std_htsj4gbmo');
                const bmDoc = await bmRef.get().catch(() => null);
                batch.set(bmRef, {
                    studentId: 'std_htsj4gbmo',
                    parentUid: newParentUid,
                    email: normalizedEmail,
                    name: 'Trần Bình Minh',
                    classLevel: '6',
                    state_json: (bmDoc && bmDoc.exists && bmDoc.data().state_json) || JSON.stringify({ student: 'Trần Bình Minh', classLevel: '6' }),
                    lastUpdated: new Date().toISOString()
                }, { merge: true });

                const bnRef = db.collection('students').doc('std_baongoc');
                const bnDoc = await bnRef.get().catch(() => null);
                batch.set(bnRef, {
                    studentId: 'std_baongoc',
                    parentUid: newParentUid,
                    email: normalizedEmail,
                    name: 'Trần Bảo Ngọc',
                    classLevel: '1',
                    state_json: (bnDoc && bnDoc.exists && bnDoc.data().state_json) || JSON.stringify({ student: 'Trần Bảo Ngọc', classLevel: '1' }),
                    lastUpdated: new Date().toISOString()
                }, { merge: true });

                // Ghi đè config hệ thống cho skyprotect
                const configSky = {
                    parentName: "Phụ huynh",
                    parentPin: "123456",
                    studentName: "Trần Bình Minh",
                    currentClass: "6",
                    defaultStudentId: "std_htsj4gbmo",
                    students: [
                        { id: "std_htsj4gbmo", name: "Trần Bình Minh", classLevel: "6" },
                        { id: "std_baongoc", name: "Trần Bảo Ngọc", classLevel: "1" }
                    ]
                };
                batch.set(db.collection('settings').doc(`config_${newParentUid}`), {
                    parentUid: newParentUid,
                    email: normalizedEmail,
                    value: JSON.stringify(configSky),
                    lastUpdated: new Date().toISOString()
                }, { merge: true });

                hasChanges = true;
                console.log("  - Đã tự động liên kết Trần Bình Minh & Trần Bảo Ngọc cho skyprotect@gmail.com");
            } else if (normalizedEmail.includes('nhematseo')) {
                // nhematseo@gmail.com quản lý 1 học sinh: Trần Đức Phúc
                const dpRef = db.collection('students').doc('std_tyc0gfnkz');
                const dpDoc = await dpRef.get().catch(() => null);
                batch.set(dpRef, {
                    studentId: 'std_tyc0gfnkz',
                    parentUid: newParentUid,
                    email: normalizedEmail,
                    name: 'Trần Đức Phúc',
                    classLevel: '4',
                    state_json: (dpDoc && dpDoc.exists && dpDoc.data().state_json) || JSON.stringify({ student: 'Trần Đức Phúc', classLevel: '4' }),
                    lastUpdated: new Date().toISOString()
                }, { merge: true });

                // Ghi đè config hệ thống cho nhematseo
                const configNhem = {
                    parentName: "Phụ huynh",
                    parentPin: "123456",
                    studentName: "Trần Đức Phúc",
                    currentClass: "4",
                    defaultStudentId: "std_tyc0gfnkz",
                    students: [
                        { id: "std_tyc0gfnkz", name: "Trần Đức Phúc", classLevel: "4" }
                    ]
                };
                batch.set(db.collection('settings').doc(`config_${newParentUid}`), {
                    parentUid: newParentUid,
                    email: normalizedEmail,
                    value: JSON.stringify(configNhem),
                    lastUpdated: new Date().toISOString()
                }, { merge: true });

                hasChanges = true;
                console.log("  - Đã tự động liên kết Trần Đức Phúc cho nhematseo@gmail.com");
            } else {
                // Quét thông thường cho các email khác
                const stdByEmail = await db.collection('students').where('email', '==', normalizedEmail).get().catch(() => null);
                if (stdByEmail && !stdByEmail.empty) {
                    stdByEmail.forEach(doc => {
                        const data = doc.data();
                        if (data.parentUid !== newParentUid) {
                            batch.update(doc.ref, { parentUid: newParentUid, email: normalizedEmail, lastUpdated: new Date().toISOString() });
                            hasChanges = true;
                        }
                    });
                }
            }

            // 2. Quét từ vựng theo email
            const vocabByEmail = await db.collection('custom_vocabulary').where('email', '==', normalizedEmail).get().catch(() => null);
            if (vocabByEmail && !vocabByEmail.empty) {
                vocabByEmail.forEach(doc => {
                    const data = doc.data();
                    if (data.parentUid !== newParentUid) {
                        batch.update(doc.ref, { parentUid: newParentUid, email: normalizedEmail, lastUpdated: new Date().toISOString() });
                        hasChanges = true;
                    }
                });
            }

            // 3. Quét chủ đề theo email
            const topicsByEmail = await db.collection('custom_topics').where('email', '==', normalizedEmail).get().catch(() => null);
            if (topicsByEmail && !topicsByEmail.empty) {
                topicsByEmail.forEach(doc => {
                    const data = doc.data();
                    if (data.parentUid !== newParentUid) {
                        batch.update(doc.ref, { parentUid: newParentUid, email: normalizedEmail, lastUpdated: new Date().toISOString() });
                        hasChanges = true;
                    }
                });
            }

            if (hasChanges) {
                await batch.commit();
                console.log("✅ [Client Sync] Hoàn thành cập nhật tự động parentUid và phân quyền học sinh trên Firestore!");
            }
        } catch (e) {
            console.error("⚠️ Lỗi autoMigrateParentUidByEmail:", e);
        }
    },

    pushLocalDataToFirestoreClient: async function(db, parentUid, email = "") {
        console.log("📤 [Client Sync] Bắt đầu di trú dữ liệu SQLite lên Firestore...");
        const res = await fetch(this.getApiUrl('/api/sync/local-data'));
        if (!res.ok) throw new Error("Không thể lấy dữ liệu SQLite cục bộ để di trú.");
        const json = await res.json();
        const { studentProgress, customVocabulary, customTopics, config } = json.data;

        // 1. Di trú config
        if (config) {
            await db.collection('settings').doc(`config_${parentUid}`).set({
                parentUid: parentUid,
                email: email,
                value: config,
                lastUpdated: new Date().toISOString()
            }, { merge: true });
            console.log("  - Đã đẩy cấu hình config");
        }

        // 2. Di trú student_progress
        if (studentProgress && studentProgress.length > 0) {
            const configObj = config ? JSON.parse(config) : null;
            const studentsList = (configObj && configObj.students) || [];
            
            for (const s of studentProgress) {
                try {
                    const state = JSON.parse(s.state_json);
                    const studentConf = studentsList.find(std => std.id === s.student_id);
                    const name = studentConf ? studentConf.name : (state.student || "Học sinh");
                    const classLevel = studentConf ? studentConf.classLevel : (state.classLevel || "1");

                    await db.collection('students').doc(s.student_id).set({
                        studentId: s.student_id,
                        parentUid: parentUid,
                        email: email,
                        name: name,
                        classLevel: classLevel,
                        state_json: s.state_json,
                        lastUpdated: new Date().toISOString()
                    }, { merge: true });
                    console.log(`  - Đã đẩy tiến trình học sinh: ${name}`);
                } catch (e) {
                    console.error("Lỗi đẩy học sinh:", e);
                }
            }
        }

        // 3. Di trú custom_vocabulary
        if (customVocabulary && customVocabulary.length > 0) {
            for (const v of customVocabulary) {
                await db.collection('custom_vocabulary').doc(`vocab_${v.id}`).set({
                    id: v.id,
                    topic_id: v.topic_id,
                    word: v.word,
                    meaning: v.meaning,
                    type: v.type,
                    pronunciation: v.pronunciation || "",
                    example: v.example || "",
                    image_path: v.image_path || "",
                    audio_path: v.audio_path || "",
                    parentUid: parentUid,
                    email: email,
                    lastUpdated: new Date().toISOString()
                }, { merge: true });
            }
            console.log(`  - Đã đẩy ${customVocabulary.length} từ vựng tự tạo`);
        }

        // 4. Di trú custom_topics
        if (customTopics && customTopics.length > 0) {
            for (const t of customTopics) {
                await db.collection('custom_topics').doc(t.id).set({
                    id: t.id,
                    name: t.name,
                    description: t.description || "",
                    category: t.category || "General",
                    parentUid: parentUid,
                    email: email,
                    cover_image: t.cover_image || "",
                    is_completed: t.is_completed || 0,
                    created_at: t.created_at || new Date().toISOString(),
                    lastUpdated: new Date().toISOString()
                }, { merge: true });
            }
            console.log(`  - Đã đẩy ${customTopics.length} chủ đề tự tạo`);
        }
        console.log("✅ Hoàn thành di trú dữ liệu lên Firestore.");
    },

    mergeStudentState: function(localState, cloudState) {
        if (!localState) return cloudState || {};
        if (!cloudState) return localState || {};

        const merged = { ...cloudState, ...localState };

        const localTime = new Date(localState.lastUpdated || 0).getTime();
        const cloudTime = new Date(cloudState.lastUpdated || 0).getTime();

        // 1. Số dư XP (Shared Currency Balance): Ưu tiên mốc thời gian mới nhất (lastUpdated) để giữ đúng số XP bị trừ khi mua đồ/đổi thẻ/nhắn tin AI
        if (localTime > cloudTime) {
            merged._sharedXp = (localState._sharedXp !== undefined) ? localState._sharedXp : (localState.xp || 0);
            merged.xp = localState.xp !== undefined ? localState.xp : (localState._sharedXp || 0);
            merged.englishXp = localState.englishXp !== undefined ? localState.englishXp : (localState._sharedXp || 0);
        } else if (cloudTime > localTime) {
            merged._sharedXp = (cloudState._sharedXp !== undefined) ? cloudState._sharedXp : (cloudState.xp || 0);
            merged.xp = cloudState.xp !== undefined ? cloudState.xp : (cloudState._sharedXp || 0);
            merged.englishXp = cloudState.englishXp !== undefined ? cloudState.englishXp : (cloudState._sharedXp || 0);
        } else {
            const maxXp = Math.max(localState._sharedXp || localState.xp || 0, cloudState._sharedXp || cloudState.xp || 0);
            merged._sharedXp = maxXp;
            merged.xp = maxXp;
            merged.englishXp = maxXp;
        }

        // 2. Chuỗi học tập (Streak) và số lần xao nhãng: Giữ kỷ lục tối đa
        merged.streak = Math.max(localState.streak || 0, cloudState.streak || 0);
        merged.distractions = Math.max(localState.distractions || 0, cloudState.distractions || 0);

        // 3. Danh hiệu, Thẻ năng lực, Vật phẩm mua & Bài học đã hoàn thành: Hợp nhất (Union Set) bảo toàn 100% tài sản
        const unionArray = (a1, a2) => Array.from(new Set([...(a1 || []), ...(a2 || [])]));
        merged.badges = unionArray(localState.badges, cloudState.badges);
        merged.goldBadges = unionArray(localState.goldBadges, cloudState.goldBadges);
        merged.completedSubtopics = unionArray(localState.completedSubtopics, cloudState.completedSubtopics);
        merged.completedLessonTheory = unionArray(localState.completedLessonTheory, cloudState.completedLessonTheory);
        merged.goldSkills = unionArray(localState.goldSkills, cloudState.goldSkills);
        merged.redeemedSkills = unionArray(localState.redeemedSkills, cloudState.redeemedSkills);
        merged.rewarded100PercentLessons = unionArray(localState.rewarded100PercentLessons, cloudState.rewarded100PercentLessons);

        // Hợp nhất lịch sử quy đổi thẻ / mua đồ
        if (localState.cardExchangeHistory || cloudState.cardExchangeHistory) {
            const combinedHistory = [...(cloudState.cardExchangeHistory || []), ...(localState.cardExchangeHistory || [])];
            const seenHistory = new Set();
            merged.cardExchangeHistory = combinedHistory.filter(item => {
                const key = (item.cardId || '') + '_' + (item.redeemedAt || '');
                if (seenHistory.has(key)) return false;
                seenHistory.add(key);
                return true;
            });
        }

        // 4. Điểm số các dạng bài & bài thi: Lấy điểm cao nhất
        const mergeMaxObject = (o1, o2) => {
            const res = { ...(o1 || {}), ...(o2 || {}) };
            const allKeys = new Set([...Object.keys(o1 || {}), ...Object.keys(o2 || {})]);
            for (const k of allKeys) {
                const v1 = (o1 && o1[k] !== undefined) ? o1[k] : 0;
                const v2 = (o2 && o2[k] !== undefined) ? o2[k] : 0;
                if (typeof v1 === 'number' && typeof v2 === 'number') {
                    res[k] = Math.max(v1, v2);
                }
            }
            return res;
        };

        merged.scores = mergeMaxObject(localState.scores, cloudState.scores);
        merged.subtopicScores = mergeMaxObject(localState.subtopicScores, cloudState.subtopicScores);
        merged.levelScores = mergeMaxObject(localState.levelScores, cloudState.levelScores);

        if (localState.englishState || cloudState.englishState) {
            const eLocal = localState.englishState || {};
            const eCloud = cloudState.englishState || {};
            merged.englishState = {
                ...eCloud,
                ...eLocal,
                skillScores: mergeMaxObject(eLocal.skillScores, eCloud.skillScores)
            };
        }

        merged.lastUpdated = new Date().toISOString();
        return merged;
    },

    pullDataFromFirestoreClient: async function(db, parentUid, email = "") {
        console.log("📥 [Client Sync] Bắt đầu đồng bộ dữ liệu thông minh giữa Firestore và SQLite...");
        
        // Đọc dữ liệu local trước
        let localData = null;
        try {
            const localRes = await fetch(this.getApiUrl('/api/sync/local-data'));
            if (localRes.ok) {
                const json = await localRes.json();
                localData = json.data;
            }
        } catch (e) {
            console.warn("⚠️ Lỗi đọc dữ liệu local:", e);
        }

        // 1. Kéo config
        const configDoc = await db.collection('settings').doc(`config_${parentUid}`).get();
        let config = null;
        if (configDoc.exists) {
            config = configDoc.data().value;
        }

        // 2. Kéo học sinh từ Cloud
        const studentsSnap = await db.collection('students').where('parentUid', '==', parentUid).get();
        const cloudStudentsMap = new Map();
        studentsSnap.forEach(doc => {
            const data = doc.data();
            cloudStudentsMap.set(data.studentId, data);
        });

        const localStudents = (localData && localData.studentProgress) || [];
        const finalStudents = [];

        // Hợp nhất dữ liệu thông minh (Smart Deep Merge) giữa local vs cloud
        for (const localStd of localStudents) {
            const cloudStd = cloudStudentsMap.get(localStd.student_id);
            if (cloudStd) {
                let localState = {};
                let cloudState = {};
                try { localState = JSON.parse(localStd.state_json); } catch(e){}
                try { cloudState = JSON.parse(cloudStd.state_json); } catch(e){}

                const mergedState = this.mergeStudentState(localState, cloudState);
                const mergedJson = JSON.stringify(mergedState);

                const configObj = localData.config ? JSON.parse(localData.config) : null;
                const stdConf = (configObj && configObj.students || []).find(s => s.id === localStd.student_id);
                const name = stdConf ? stdConf.name : (cloudStd.name || "Học sinh");
                const classLevel = stdConf ? stdConf.classLevel : (cloudStd.classLevel || "1");

                // Đẩy tiến trình đã gộp thông minh lên đám mây Firestore
                try {
                    await db.collection('students').doc(localStd.student_id).set({
                        studentId: localStd.student_id,
                        parentUid: parentUid,
                        email: email,
                        name: name,
                        classLevel: classLevel,
                        state_json: mergedJson,
                        lastUpdated: new Date().toISOString()
                    }, { merge: true });
                } catch(e){}

                finalStudents.push({
                    studentId: localStd.student_id,
                    name: name,
                    classLevel: classLevel,
                    state_json: mergedJson
                });
                cloudStudentsMap.delete(localStd.student_id);
                continue;
            }

            if (cloudStd) {
                finalStudents.push(cloudStd);
                cloudStudentsMap.delete(localStd.student_id);
            } else {
                // SQLite có học sinh mà Cloud chưa có -> Đẩy lên Cloud
                try {
                    const configObj = localData.config ? JSON.parse(localData.config) : null;
                    const stdConf = (configObj && configObj.students || []).find(s => s.id === localStd.student_id);
                    const name = stdConf ? stdConf.name : "Học sinh";
                    const classLevel = stdConf ? stdConf.classLevel : "1";

                    await db.collection('students').doc(localStd.student_id).set({
                        studentId: localStd.student_id,
                        parentUid: parentUid,
                        email: email,
                        name: name,
                        classLevel: classLevel,
                        state_json: localStd.state_json,
                        lastUpdated: new Date().toISOString()
                    }, { merge: true });
                } catch(e){}
                finalStudents.push({
                    studentId: localStd.student_id,
                    name: name,
                    classLevel: classLevel,
                    state_json: localStd.state_json
                });
            }
        }

        // Thêm các học sinh chỉ có trên Cloud mà không có ở SQLite local
        for (const [sId, cloudStd] of cloudStudentsMap.entries()) {
            finalStudents.push(cloudStd);
        }

        // 3. Kéo từ vựng
        const vocabSnap = await db.collection('custom_vocabulary').where('parentUid', '==', parentUid).get();
        const vocabularies = [];
        vocabSnap.forEach(doc => vocabularies.push(doc.data()));

        // 4. Kéo chủ đề
        const topicsSnap = await db.collection('custom_topics').where('parentUid', '==', parentUid).get();
        const topics = [];
        topicsSnap.forEach(doc => topics.push(doc.data()));

        // Gửi về Server để ghi đè/cập nhật SQLite cục bộ
        const syncRes = await fetch(this.getApiUrl('/api/sync/save-pulled-data'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ config, students: finalStudents, vocabularies, topics })
        });

        if (!syncRes.ok) {
            throw new Error("Không thể ghi đè dữ liệu kéo về vào SQLite.");
        }
        console.log("✅ Hoàn thành đồng bộ dữ liệu đám mây về SQLite.");
    },

    checkGoogleSession: async function() {
        try {
            // 1. Khởi tạo Firebase Client SDK trước tiên
            const fb = await this.initFirebaseClient();

            // 2. Gọi API kiểm tra session phụ huynh trên Server
            const sessionRes = await fetch(this.getApiUrl('/api/auth/session'));
            if (sessionRes.ok) {
                const sessionData = await sessionRes.json();
                if (sessionData.loggedIn) {
                    console.log("✅ Phụ huynh đã đăng nhập Google:", sessionData.session.email);
                    
                    // Nếu Firebase Auth chưa có currentUser, ta lắng nghe sự kiện khôi phục đăng nhập
                    if (fb && fb.auth) {
                        fb.auth.onAuthStateChanged((user) => {
                            if (user) {
                                console.log("🔥 Đã xác thực Firebase Auth Client (Persistence):", user.email);
                            } else {
                                console.warn("⚠️ Firebase Auth Client chưa được đăng nhập. Yêu cầu đăng nhập lại ở lần sau.");
                            }
                        });
                    }

                    localStorage.removeItem('skipGoogleLogin');
                    const googleLoginScreen = document.getElementById("google-login-screen");
                    if (googleLoginScreen) googleLoginScreen.classList.add("hidden");
                    return true;
                }
            }
            
            // 3. Nếu chưa đăng nhập: Kiểm tra xem đã từng chọn "Học ngoại tuyến (Offline)" chưa
            if (localStorage.getItem('skipGoogleLogin') === 'true') {
                console.log("ℹ️ Người dùng đã chọn chế độ Học ngoại tuyến (Offline) trước đó.");
                const googleLoginScreen = document.getElementById("google-login-screen");
                if (googleLoginScreen) googleLoginScreen.classList.add("hidden");
                return false;
            }

            // 4. Nếu là lần đầu khởi chạy (chưa đăng nhập & chưa chọn Skip): Hiển thị màn hình cho phép lựa chọn Đăng nhập Google hoặc Học Offline
            await this.openGoogleLoginModal();
            return false;
        } catch (e) {
            console.error("Lỗi khi kiểm tra Google Session:", e);
            return false;
        }
    },

    // Mở màn hình đăng nhập Google đồng bộ đám mây khi phụ huynh chủ động yêu cầu
    openGoogleLoginModal: async function() {
        const googleLoginScreen = document.getElementById("google-login-screen");
        if (googleLoginScreen) {
            googleLoginScreen.classList.remove("hidden");
            this.pushHistory('google-login');
        }
        this.updateNavigationButtons();
        
        try {
            const fb = await this.initFirebaseClient();
            const configRes = await fetch(this.getApiUrl('/api/auth/google-client-id'));
            if (configRes.ok) {
                const configData = await configRes.json();
                const clientId = configData.clientId;
                if (!clientId) {
                    const warning = document.getElementById("google-config-warning");
                    const container = document.getElementById("google-signin-btn-container");
                    if (warning) warning.classList.remove("hidden");
                    if (container) container.style.display = "none";
                } else {
                    const warning = document.getElementById("google-config-warning");
                    const container = document.getElementById("google-signin-btn-container");
                    if (warning) warning.classList.add("hidden");
                    if (container) container.style.display = "flex";
                    
                    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
                        google.accounts.id.initialize({
                            client_id: clientId,
                            callback: async (response) => {
                                Swal.fire({
                                    title: 'Đang xử lý đồng bộ...',
                                    text: 'Vui lòng chờ trong giây lát.',
                                    allowOutsideClick: false,
                                    didOpen: () => {
                                        Swal.showLoading();
                                    }
                                });
                                
                                try {
                                    if (!fb || !fb.auth || !fb.db) {
                                        throw new Error("Không thể kết nối Firebase. Máy tính có thể đang offline hoặc cấu hình Firebase bị lỗi.");
                                    }

                                    const credential = firebase.auth.GoogleAuthProvider.credential(response.credential);
                                    const userCredential = await fb.auth.signInWithCredential(credential);
                                    const firebaseUid = userCredential.user.uid;

                                    const loginRes = await fetch(this.getApiUrl('/api/auth/google-login'), {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ idToken: response.credential, firebaseUid: firebaseUid })
                                    });
                                    
                                    if (loginRes.ok) {
                                        const loginData = await loginRes.json();
                                        const userEmail = (loginData.parentSession && loginData.parentSession.email) || userCredential.user.email || "";

                                        // Tự động chuyển đổi và gán parentUid mới cho dữ liệu cũ theo Email
                                        if (userEmail) {
                                            await this.autoMigrateParentUidByEmail(fb.db, userEmail, firebaseUid).catch(e => console.warn("Lỗi autoMigrateParentUidByEmail:", e));
                                        }

                                        localStorage.removeItem('skipGoogleLogin');
                                        
                                        // Nạp lại cấu hình từ SQLite server ngay lập tức
                                        await this.loadConfig();

                                        let syncMessage = "Đăng nhập Google thành công!";
                                        try {
                                            let studentsSnap = await fb.db.collection('students').where('parentUid', '==', firebaseUid).get();
                                            if (studentsSnap.empty) {
                                                await this.pushLocalDataToFirestoreClient(fb.db, firebaseUid);
                                                syncMessage = "Đã di trú dữ liệu thiết bị cục bộ hiện tại lên tài khoản Google của bạn thành công!";
                                            } else {
                                                await this.pullDataFromFirestoreClient(fb.db, firebaseUid);
                                                syncMessage = "Đã tải thành công dữ liệu học tập từ tài khoản Google của bạn về thiết bị!";
                                            }
                                        } catch (fsErr) {
                                            console.warn("⚠️ Lỗi đồng bộ đám mây Firestore (vẫn tiếp tục chế độ cục bộ):", fsErr);
                                        }

                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Thành công',
                                            text: syncMessage,
                                            timer: 2500,
                                            showConfirmButton: false
                                        });
                                        if (googleLoginScreen) googleLoginScreen.classList.add("hidden");
                                        setTimeout(() => {
                                            window.location.reload();
                                        }, 2000);
                                    } else {
                                        const errorData = await loginRes.json();
                                        throw new Error(errorData.error || 'Lỗi không xác định khi đăng nhập');
                                    }
                                } catch (err) {
                                    console.error("Lỗi đăng nhập Google / Firebase:", err);
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Lỗi đăng nhập',
                                        text: err.message,
                                        confirmButtonColor: '#ef4444'
                                    });
                                }
                            }
                        });
                        
                        google.accounts.id.renderButton(
                            document.getElementById("g_id_signin"),
                            { theme: "filled_blue", size: "large", text: "signin_with" }
                        );
                    } else {
                        const container = document.getElementById("google-signin-btn-container");
                        if (container) {
                            container.innerHTML = "<p style='color: #94a3b8; font-size: 13px; font-style: italic;'><i class='fa-solid fa-triangle-exclamation text-amber-500'></i> Không có mạng để hiển thị nút Google. Bạn có thể sử dụng chế độ Offline dưới đây.</p>";
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Lỗi khi mở màn hình đăng nhập Google:", e);
        }
    },

    // Bỏ qua đăng nhập Google để chạy offline
    skipGoogleLogin: function() {
        localStorage.setItem('skipGoogleLogin', 'true');
        const googleLoginScreen = document.getElementById("google-login-screen");
        if (googleLoginScreen) googleLoginScreen.classList.add("hidden");
        this.initAppAfterLogin();
    },

    // Khởi chạy các màn hình sau khi bỏ qua/login
    initAppAfterLogin: async function() {
        await this.loadConfig();
        // Kiểm tra xem hệ thống đã thiết lập cấu hình ban đầu chưa
        if (!this.config.students || this.config.students.length === 0) {
            this.showSetupInitialScreen();
        } else if (this.config.defaultStudentId && this.config.students && this.config.students.some(s => s.id === this.config.defaultStudentId)) {
            const selectScreen = document.getElementById("student-select-screen");
            const setupScreen = document.getElementById("setup-initial-screen");
            const splashScreen = document.getElementById("splash-screen");
            if (selectScreen) selectScreen.classList.add("hidden");
            if (setupScreen) setupScreen.classList.add("hidden");
            if (splashScreen) {
                splashScreen.classList.remove("hidden");
                this.pushHistory('splash');
            }

            await this.initStudentWorkspace();
        } else {
            this.showStudentSelectionScreen();
        }
    },

    // Khởi chạy ứng dụng
    init: async function() {
        // 1. Kiểm tra session Google trước tiên
        const isLoggedIn = await this.checkGoogleSession();
        
        // 2. Nếu đã đăng nhập hoặc đã từng chọn Offline -> Vào ứng dụng ngay
        if (isLoggedIn || localStorage.getItem('skipGoogleLogin') === 'true') {
            await this.initAppAfterLogin();
        }

        this.audio.init(); // Preload tất cả âm thanh
        this.checkUpdateAuto(); // Tự động kiểm tra bản cập nhật

        // Tự động kiểm tra bản cập nhật định kỳ mỗi 15 phút
        setInterval(() => {
            this.checkUpdateAuto();
        }, 15 * 60 * 1000);

        // Lắng nghe phím Enter trong ô nhập PIN của phụ huynh ở Splash Screen
        const pinInput = document.getElementById("parent-pin");
        if (pinInput) {
            pinInput.addEventListener("keypress", (e) => {
                if (e.key === 'Enter') {
                    if (typeof parentDashboard !== 'undefined' && typeof parentDashboard.verifyPin === 'function') {
                        parentDashboard.verifyPin();
                    }
                }
            });
        }

        // Đăng ký sự kiện nút chuyển theme học sinh
        const themeToggleBtn = document.getElementById("theme-toggle");
        if (themeToggleBtn) {
            themeToggleBtn.onclick = () => this.toggleTheme();
        }

        // Lắng nghe sự kiện kết nối mạng online để đồng bộ
        window.addEventListener('online', () => {
            this.syncOfflineProgress();
        });

        // Kiểm tra xem hệ thống đã thiết lập cấu hình ban đầu chưa
        if (!this.config.students || this.config.students.length === 0) {
            // Hiển thị màn hình thiết lập ban đầu
            this.showSetupInitialScreen();
        } else if (this.config.defaultStudentId && this.config.students && this.config.students.some(s => s.id === this.config.defaultStudentId)) {
            // Ẩn màn hình chọn và màn hình thiết lập
            const selectScreen = document.getElementById("student-select-screen");
            const setupScreen = document.getElementById("setup-initial-screen");
            const splashScreen = document.getElementById("splash-screen");
            if (selectScreen) selectScreen.classList.add("hidden");
            if (setupScreen) setupScreen.classList.add("hidden");
            if (splashScreen) {
                splashScreen.classList.remove("hidden");
                this.pushHistory('splash');
            }

            await this.initStudentWorkspace();
        } else {
            // Hiển thị màn hình chọn con ban đầu
            this.showStudentSelectionScreen();
        }
        this.updateNavigationButtons();

        // Sự kiện kích hoạt âm thanh và đóng màn hình chào mừng (Splash Screen)
        let isEntering = false;
        const enterApp = () => {
            if (isEntering) return;
            isEntering = true;

            const splashScreen = document.getElementById("splash-screen");
            
            // Dừng âm thanh nhắc nhở của Splash Screen
            if (typeof this.stopSplashGreeting === 'function') {
                this.stopSplashGreeting();
            }

            this.audio.init();
            this.audio.isUnlocked = true;
            this.audio.playStartup();
            
            // Tạm thời tắt tiếng click trong vòng 150ms để tránh âm click phát chồng lên âm startup
            this.audio.tempMuteClick = true;
            setTimeout(() => {
                this.audio.tempMuteClick = false;
            }, 150);

            if (splashScreen) {
                splashScreen.classList.add("fade-out");
                // Giải phóng bộ nhớ hiển thị sau khi hiệu ứng hoàn thành (0.6 giây)
                setTimeout(() => {
                    splashScreen.style.display = "none";
                    isEntering = false; // Reset cờ trạng thái để bấm được tiếp khi Splash Screen hiển thị lại
                    // Lựa chọn môn học ban đầu
                    this.checkSubjectSelection();

                    // Tối ưu hiệu năng: Khởi chạy heartbeat và notification polling khi bé vào học
                    this.startHeartbeat();

                    // Kích hoạt hiển thị các huy hiệu trong hàng đợi (nếu có)
                    if (this.pendingBadges && this.pendingBadges.length > 0) {
                        const nextBadgeId = this.pendingBadges.shift();
                        this.showBadgePopup(nextBadgeId);
                    }
                }, 600);
            }
        };

        const splashStartBtn = document.getElementById("splash-start-btn");
        if (splashStartBtn) {
            splashStartBtn.addEventListener("click", enterApp);
            splashStartBtn.addEventListener("touchstart", (e) => {
                e.preventDefault();
                enterApp();
            });
        }

        // Lắng nghe sự kiện click toàn cục để phát âm thanh click nhẹ chuyên nghiệp
        document.addEventListener("click", (e) => {
            const target = e.target.closest("button, a, [role='button'], .option-btn, .nav-item, .lesson-card, .btn, .btn-primary, .btn-secondary, .btn-splash-start, .btn-parent, .btn-icon, .sem-tab-btn, .tab-btn, .btn-level-select, .btn-mode-select, .btn-game-tower, .btn-game-action, .btn-exit-practice, .sidebar-toggle-container, .btn-collapse-sidebar, [onclick], input[type='submit'], input[type='button'], .timeline-node");
            if (target) {
                if (this.audio.isUnlocked && !this.audio.tempMuteClick) {
                    this.audio.playClick();
                }
            }
        });

        // Tự động thu gọn Sidebar trực tuyến khi click ra ngoài
        document.addEventListener("click", (e) => {
            const sidebar = document.getElementById("online-presence-sidebar");
            const widget = document.getElementById("online-presence-widget");
            if (sidebar && !sidebar.classList.contains("hidden")) {
                if (!sidebar.contains(e.target) && !widget.contains(e.target)) {
                    this.toggleOnlinePresenceSidebar();
                }
            }
        });

        // Cuộn ngầm ban đầu lúc khởi chạy
        this.scrollToActiveLesson();
    },

    startHeartbeat: function() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
        }
        const sendPing = () => {
            const studentId = this.config.defaultStudentId || '';
            const classLevel = this.config.currentClass || '6';
            if (!studentId) return;

            fetch(this.getApiUrl(`/api/heartbeat`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, classLevel })
            })
            .then(() => {
                this.updateOnlinePresenceCountSilent();
            })
            .catch(err => console.warn("[Heartbeat] Error:", err));
        };

        sendPing();
        this.heartbeatInterval = setInterval(sendPing, 15000);
        
        // Khởi chạy polling thông báo tin nhắn mới
        this.startNotificationPolling();
    },

    stopHeartbeat: function() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
        // Dừng polling thông báo tin nhắn mới
        this.stopNotificationPolling();
    },

    presenceInterval: null,
    presenceDataCache: [],

    toggleOnlinePresenceSidebar: function() {
        const sidebar = document.getElementById("online-presence-sidebar");
        if (!sidebar) return;

        const isHidden = sidebar.classList.contains("hidden");
        if (isHidden) {
            sidebar.classList.remove("hidden");
            this.loadOnlinePresenceData();
            this.presenceInterval = setInterval(() => this.loadOnlinePresenceData(), 10000);
        } else {
            sidebar.classList.add("hidden");
            if (this.presenceInterval) {
                clearInterval(this.presenceInterval);
                this.presenceInterval = null;
            }
        }
    },

    loadOnlinePresenceData: function() {
        const url = `/api/leaderboard?subject=english`;
        fetch(this.getApiUrl(url))
            .then(res => res.json())
            .then(resData => {
                if (resData.success && resData.data) {
                    const students = resData.data.filter(s => s && s.studentId && !s.studentId.startsWith("mock"));
                    this.presenceDataCache = students;
                    this.renderPresenceList();
                    this.updateOnlineCountBadge();
                }
            })
            .catch(err => console.warn("[Presence] Lỗi load danh sách:", err));
    },

    renderPresenceList: function() {
        const listContainer = document.getElementById("online-presence-list");
        if (!listContainer) return;

        const searchInput = document.getElementById("presence-search-input");
        const query = searchInput ? searchInput.value.trim().toLowerCase() : "";

        let filtered = this.presenceDataCache;
        if (query) {
            filtered = filtered.filter(s => s.studentName && s.studentName.toLowerCase().includes(query));
        }

        if (filtered.length === 0) {
            listContainer.innerHTML = `<div class="presence-empty">Không tìm thấy bạn học nào.</div>`;
            return;
        }

        const selfId = this.config && this.config.defaultStudentId ? this.config.defaultStudentId : "default";
        const now = Date.now();
        const sorted = [...filtered].sort((a, b) => {
            const aOnline = a.lastHeartbeat && (now - new Date(a.lastHeartbeat).getTime() < 40000);
            const bOnline = b.lastHeartbeat && (now - new Date(b.lastHeartbeat).getTime() < 40000);
            
            if (aOnline && !bOnline) return -1;
            if (!aOnline && bOnline) return 1;
            
            return (a.studentName || "").localeCompare(b.studentName || "", 'vi');
        });

        const gradients = [
            "linear-gradient(135deg, #f43f5e, #be123c)",
            "linear-gradient(135deg, #a855f7, #6b21a8)",
            "linear-gradient(135deg, #0ea5e9, #0369a1)",
            "linear-gradient(135deg, #10b981, #047857)",
            "linear-gradient(135deg, #f59e0b, #b45309)",
            "linear-gradient(135deg, #ec4899, #be185d)"
        ];

        const getFriendlyTime = (isoStr) => {
            if (!isoStr) return "Ngoại tuyến";
            const diffMs = now - new Date(isoStr).getTime();
            const diffMins = Math.floor(diffMs / 60000);
            if (diffMins < 1) return "Vừa mới xong";
            if (diffMins < 60) return `${diffMins} phút trước`;
            const diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24) return `${diffHours} giờ trước`;
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays} ngày trước`;
        };

        listContainer.innerHTML = sorted.map((s, idx) => {
            const isSelf = s.studentId === selfId;
            const isOnline = s.lastHeartbeat && (now - new Date(s.lastHeartbeat).getTime() < 40000);
            
            let initials = "HS";
            if (s.studentName) {
                const parts = s.studentName.trim().split(/\s+/).filter(Boolean);
                if (parts.length === 1) {
                    initials = parts[0].substring(0, 2).toUpperCase();
                } else if (parts.length > 1) {
                    initials = (parts[parts.length - 2].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
                }
            }

            const charSum = s.studentName ? s.studentName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) : idx;
            const grad = gradients[Math.abs(charSum) % gradients.length];
            const onclickAttr = isSelf ? '' : `onclick="app.openChatWindow('${s.studentId}', '${s.studentName.replace(/'/g, "\\'")}')" style="cursor:pointer;"`;

            return `
                <div class="presence-user-item" ${onclickAttr} style="${isSelf ? 'border-color: rgba(139, 92, 246, 0.4); background: rgba(139, 92, 246, 0.05);' : ''}">
                    <div class="presence-avatar" style="background:${grad};">
                        ${initials}
                        <span class="presence-status-dot ${isOnline ? 'online' : 'offline'}"></span>
                    </div>
                    <div class="presence-info">
                        <div class="presence-name" style="display:flex; align-items:center; gap:5px;">
                            ${s.studentName}
                            ${isSelf ? '<span style="font-size:0.65rem; background:#a855f7; color:white; padding:1px 4px; border-radius:4px; font-weight:800;">Bạn</span>' : ''}
                            <span class="version-tag" style="font-size:0.7rem; background:rgba(99, 102, 241, 0.12); color:#6366f1; border:1px solid rgba(99, 102, 241, 0.3); padding:0px 5px; border-radius:6px; font-weight:700; font-family:monospace;">${s.appVersion || s.version || 'v12.46'}</span>
                        </div>
                        <div class="presence-meta">
                            Lớp ${s.classLevel || '6'} &bull; ${isOnline ? '<span style="color:#10b981; font-weight:700;">Đang hoạt động</span>' : getFriendlyTime(s.lastHeartbeat)}
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    },

    filterPresenceList: function() {
        this.renderPresenceList();
    },

    updateOnlineCountBadge: function() {
        const now = Date.now();
        const onlineCount = this.presenceDataCache.filter(s => s.lastHeartbeat && (now - new Date(s.lastHeartbeat).getTime() < 40000)).length;
        
        const badge = document.getElementById("online-count-badge");
        if (badge) {
            badge.innerText = onlineCount;
            badge.style.display = onlineCount > 0 ? "flex" : "none";
        }
    },

    updateOnlinePresenceCountSilent: function() {
        const url = `/api/leaderboard?subject=english`;
        fetch(this.getApiUrl(url))
            .then(res => res.json())
            .then(resData => {
                if (resData.success && resData.data) {
                    const students = resData.data.filter(s => s && s.studentId && !s.studentId.startsWith("mock"));
                    this.presenceDataCache = students;
                    this.updateOnlineCountBadge();
                    const sidebar = document.getElementById("online-presence-sidebar");
                    if (sidebar && !sidebar.classList.contains("hidden")) {
                        this.renderPresenceList();
                    }
                }
            })
            .catch(err => console.warn("[Presence Count Silent] Error:", err));
    },

    notificationPollingInterval: null,

    startNotificationPolling: function() {
        if (this.notificationPollingInterval) {
            clearInterval(this.notificationPollingInterval);
        }
        this.notificationPollingInterval = setInterval(() => this.checkChatNotifications(), 3000);
    },

    stopNotificationPolling: function() {
        if (this.notificationPollingInterval) {
            clearInterval(this.notificationPollingInterval);
            this.notificationPollingInterval = null;
        }
    },

    checkChatNotifications: function() {
        const studentId = this.config.defaultStudentId || '';
        if (!studentId) return;

        // TỐI ƯU HIỆU NĂNG: Nếu bé đang làm bài tập, xem video hoặc chơi game, tạm thời bỏ qua polling chat để tiết kiệm CPU và tránh lag
        const isWatchingVideo = document.body.classList.contains("video-fullscreen-active") || 
                               document.querySelector(".btn-exit-video-fullscreen") !== null;
        const practiceActiveBox = document.getElementById("practice-active-box");
        const isPracticing = practiceActiveBox && !practiceActiveBox.classList.contains("hidden");
        const tdGameContainer = document.getElementById("td-game-container");
        const isPlayingGame = tdGameContainer && !tdGameContainer.classList.contains("hidden");

        if (isWatchingVideo || isPracticing || isPlayingGame) {
            return;
        }

        const url = `/api/chat/notifications?studentId=${studentId}`;
        fetch(this.getApiUrl(url))
            .then(res => res.json())
            .then(resData => {
                if (resData.success && resData.notifications) {
                    const notifications = resData.notifications;
                    const senderIds = Object.keys(notifications);
                    
                    if (senderIds.length > 0) {
                        senderIds.forEach(senderId => {
                            const notif = notifications[senderId];
                            if (notif) {
                                this.handleNewMessageNotification(senderId, notif.senderName, notif.text);
                            }
                        });
                    }
                }
            })
            .catch(err => console.warn("[Notification Poll] Error:", err));
    },

    handleNewMessageNotification: function(senderId, senderName, text) {
        // Kiểm tra xem bé có đang làm bài/xem video không
        const isWatchingVideo = document.body.classList.contains("video-fullscreen-active") || 
                               document.querySelector(".btn-exit-video-fullscreen") !== null;
        const practiceActiveBox = document.getElementById("practice-active-box");
        const isPracticing = practiceActiveBox && !practiceActiveBox.classList.contains("hidden");
        const tdGameContainer = document.getElementById("td-game-container");
        const isPlayingGame = tdGameContainer && !tdGameContainer.classList.contains("hidden");
        const isBusy = isWatchingVideo || isPracticing || isPlayingGame;

        // Xóa thông báo này trên server ngay lập tức để tránh poll trùng lặp
        const selfId = this.config.defaultStudentId || '';
        fetch(this.getApiUrl('/api/chat/clear-notification'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId: selfId, senderId })
        }).catch(err => console.warn("[Clear Notification] Error:", err));

        if (isBusy) {
            // Đang bận: chỉ phát âm thanh và hiển thị bong bóng chat thu nhỏ
            this.currentChatReceiverId = senderId;
            this.currentChatReceiverName = senderName;
            
            // Chuyển sang trạng thái thu nhỏ
            this.toggleChatMinimize(true);
            
            // Tăng số lượng badge tin nhắn chưa đọc
            const badge = document.getElementById("chat-unread-badge");
            if (badge) {
                let currentVal = parseInt(badge.innerText) || 0;
                currentVal += 1;
                badge.innerText = currentVal;
                badge.style.display = "block";
            }
            
            // Phát âm thanh và hiệu ứng nhấp nháy cho bong bóng
            this.audio.playMessageNotification();
            const minimizedBubble = document.getElementById("chat-minimized-bubble");
            if (minimizedBubble) {
                minimizedBubble.classList.add("glow-bounce");
                setTimeout(() => minimizedBubble.classList.remove("glow-bounce"), 1500);
            }
        } else {
            // Không bận: Tự động mở bung cửa sổ chat
            this.openChatWindow(senderId, senderName);
            
            // Phát âm thanh và tạo hiệu ứng nhấp nháy cho cửa sổ chat
            this.audio.playMessageNotification();
            const chatWindow = document.getElementById("floating-chat-window");
            if (chatWindow) {
                chatWindow.classList.add("glow-bounce");
                setTimeout(() => chatWindow.classList.remove("glow-bounce"), 1500);
            }
        }
    },

    currentChatReceiverId: null,
    currentChatReceiverName: null,
    chatPollingInterval: null,
    isChatMinimized: false,
    lastReadMessageCount: 0,

    openChatWindow: function(receiverId, receiverName) {
        this.currentChatReceiverId = receiverId;
        this.currentChatReceiverName = receiverName;
        this.isChatMinimized = false;

        // Dọn dẹp thông báo tin nhắn chưa đọc của người gửi này trên server
        const selfId = this.config.defaultStudentId || 'default';
        fetch(this.getApiUrl('/api/chat/clear-notification'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId: selfId, senderId: receiverId })
        }).catch(err => console.warn("[Chat Notification Clear] Error:", err));

        const chatWindow = document.getElementById("floating-chat-window");
        const minimizedBubble = document.getElementById("chat-minimized-bubble");
        const chatName = document.getElementById("chat-header-name");
        const chatAvatar = document.getElementById("chat-header-avatar");
        const chatStatusDot = document.querySelector("#chat-header-status .chat-status-dot");
        const chatStatusText = document.querySelector("#chat-header-status .chat-status-text");

        if (minimizedBubble) minimizedBubble.classList.add("hidden");
        const emojiPicker = document.getElementById("chat-emoji-picker");
        if (emojiPicker) emojiPicker.classList.add("hidden");

        if (!chatWindow) return;

        if (chatName) {
            const receiverObj = this.presenceDataCache.find(s => s.studentId === receiverId);
            const receiverVer = receiverObj && (receiverObj.appVersion || receiverObj.version) ? (receiverObj.appVersion || receiverObj.version) : '';
            chatName.innerHTML = `${receiverName} ${receiverVer ? `<span class="chat-header-version-badge" style="font-size:0.75rem; background:rgba(99, 102, 241, 0.15); color:#6366f1; border:1px solid rgba(99, 102, 241, 0.35); padding:1px 6px; border-radius:8px; font-weight:700; font-family:monospace; margin-left:6px;">${receiverVer}</span>` : ''}`;
        }
        
        let initials = "HS";
        if (receiverName) {
            const parts = receiverName.trim().split(/\s+/).filter(Boolean);
            if (parts.length === 1) {
                initials = parts[0].substring(0, 2).toUpperCase();
            } else if (parts.length > 1) {
                initials = (parts[parts.length - 2].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
            }
        }
        if (chatAvatar) {
            chatAvatar.innerText = initials;
            const gradients = [
                "linear-gradient(135deg, #f43f5e, #be123c)",
                "linear-gradient(135deg, #a855f7, #6b21a8)",
                "linear-gradient(135deg, #0ea5e9, #0369a1)",
                "linear-gradient(135deg, #10b981, #047857)",
                "linear-gradient(135deg, #f59e0b, #b45309)",
                "linear-gradient(135deg, #ec4899, #be185d)"
            ];
            const charSum = receiverName ? receiverName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
            chatAvatar.style.background = gradients[Math.abs(charSum) % gradients.length];
        }

        const receiverObj = this.presenceDataCache.find(s => s.studentId === receiverId);
        const now = Date.now();
        const isOnline = receiverObj && receiverObj.lastHeartbeat && (now - new Date(receiverObj.lastHeartbeat).getTime() < 40000);
        
        if (chatStatusDot) {
            if (isOnline) {
                chatStatusDot.className = "chat-status-dot online";
                if (chatStatusText) chatStatusText.innerText = "Đang hoạt động";
            } else {
                chatStatusDot.className = "chat-status-dot";
                if (chatStatusText) {
                    if (receiverObj && receiverObj.lastHeartbeat) {
                        const diffMs = now - new Date(receiverObj.lastHeartbeat).getTime();
                        const diffMins = Math.floor(diffMs / 60000);
                        if (diffMins < 1) chatStatusText.innerText = "Hoạt động vừa xong";
                        else if (diffMins < 60) chatStatusText.innerText = `Hoạt động ${diffMins} phút trước`;
                        else chatStatusText.innerText = "Ngoại tuyến";
                    } else {
                        chatStatusText.innerText = "Ngoại tuyến";
                    }
                }
            }
        }

        chatWindow.classList.remove("hidden");
        
        const input = document.getElementById("chat-message-input");
        if (input) {
            input.value = "";
            input.focus();
        }

        this.loadChatMessages();

        if (this.chatPollingInterval) {
            clearInterval(this.chatPollingInterval);
        }
        this.chatPollingInterval = setInterval(() => this.loadChatMessages(), 3000);
    },

    toggleChatMinimize: function(minimize) {
        const chatWindow = document.getElementById("floating-chat-window");
        const minimizedBubble = document.getElementById("chat-minimized-bubble");
        const bubbleAvatar = document.getElementById("chat-minimized-avatar");
        const bubbleStatus = document.getElementById("chat-minimized-status");

        if (minimize) {
            if (chatWindow) chatWindow.classList.add("hidden");
            if (minimizedBubble) {
                minimizedBubble.classList.remove("hidden");
                let initials = "HS";
                const receiverName = this.currentChatReceiverName;
                if (receiverName) {
                    const parts = receiverName.trim().split(/\s+/).filter(Boolean);
                    if (parts.length === 1) {
                        initials = parts[0].substring(0, 2).toUpperCase();
                    } else if (parts.length > 1) {
                        initials = (parts[parts.length - 2].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
                    }
                }
                if (bubbleAvatar) {
                    bubbleAvatar.innerText = initials;
                    const gradients = [
                        "linear-gradient(135deg, #f43f5e, #be123c)",
                        "linear-gradient(135deg, #a855f7, #6b21a8)",
                        "linear-gradient(135deg, #0ea5e9, #0369a1)",
                        "linear-gradient(135deg, #10b981, #047857)",
                        "linear-gradient(135deg, #f59e0b, #b45309)",
                        "linear-gradient(135deg, #ec4899, #be185d)"
                    ];
                    const charSum = receiverName ? receiverName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
                    bubbleAvatar.style.background = gradients[Math.abs(charSum) % gradients.length];
                }

                const receiverObj = this.presenceDataCache.find(s => s.studentId === this.currentChatReceiverId);
                const now = Date.now();
                const isOnline = receiverObj && receiverObj.lastHeartbeat && (now - new Date(receiverObj.lastHeartbeat).getTime() < 40000);
                if (bubbleStatus) {
                    bubbleStatus.className = isOnline ? "chat-minimized-status-dot online" : "chat-minimized-status-dot";
                }
            }
            this.isChatMinimized = true;
        } else {
            this.isChatMinimized = false;
            if (minimizedBubble) minimizedBubble.classList.add("hidden");
            if (chatWindow) chatWindow.classList.remove("hidden");
            
            const container = document.getElementById("chat-messages-container");
            const bubbles = container ? container.querySelectorAll(".chat-message-bubble-wrapper") : [];
            this.lastReadMessageCount = bubbles.length;
            
            const badge = document.getElementById("chat-unread-badge");
            if (badge) {
                badge.innerText = 0;
                badge.style.display = "none";
            }
            
            const input = document.getElementById("chat-message-input");
            if (input) input.focus();
        }
    },

    closeChatCompletely: function() {
        const chatWindow = document.getElementById("floating-chat-window");
        const minimizedBubble = document.getElementById("chat-minimized-bubble");
        
        if (chatWindow) chatWindow.classList.add("hidden");
        if (minimizedBubble) minimizedBubble.classList.add("hidden");

        this.currentChatReceiverId = null;
        this.currentChatReceiverName = null;
        this.isChatMinimized = false;
        this.lastReadMessageCount = 0;

        if (this.chatPollingInterval) {
            clearInterval(this.chatPollingInterval);
            this.chatPollingInterval = null;
        }
    },

    closeChatWindow: function() {
        this.toggleChatMinimize(true);
    },

    sendChatMessage: function() {
        const input = document.getElementById("chat-message-input");
        if (!input) return;
        const text = input.value.trim();
        if (!text) return;

        // 1. Kiểm tra XP trước khi cho phép gửi tin nhắn
        const currentXp = this.state.englishXp || 0;
        if (currentXp < 50) {
            if (this.audio && typeof this.audio.playSound === 'function') {
                this.audio.playSound('wrong');
            }
            Swal.fire({
                title: "Không đủ XP 💥",
                html: `Mỗi tin nhắn gửi đi tiêu tốn <b>50 XP</b>.<br/>Số dư hiện tại của con là <b>${currentXp} XP</b>.<br/>Con cần học tập thêm để có đủ XP gửi tin nhắn nhé!`,
                icon: "warning",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Đồng ý"
            });
            return;
        }

        const senderId = this.config.defaultStudentId || 'default';
        const senderName = this.config.studentName || 'Học sinh';
        const receiverId = this.currentChatReceiverId;

        if (!receiverId) return;

        input.value = "";
        input.focus();

        const url = `/api/chat/send`;
        fetch(this.getApiUrl(url), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ senderId, senderName, receiverId, text })
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(errData => {
                    throw new Error(errData.error || "Gửi tin nhắn thất bại");
                });
            }
            return res.json();
        })
        .then(resData => {
            if (resData.success) {
                this.lastReadMessageCount++;
                this.loadChatMessages();

                // Cập nhật XP mới từ server
                if (typeof resData.newEnglishXp !== 'undefined') {
                    this.state.englishXp = resData.newEnglishXp;
                    // Lưu tiến trình vào localStorage
                    const localKey = this.getLocalStorageKey();
                    try {
                        localStorage.setItem(localKey, JSON.stringify(this.state));
                    } catch (e) {
                        console.warn("Không thể lưu localStorage:", e);
                    }
                }

                // Thiết lập cờ để hiển thị hiệu ứng trừ XP ngay cạnh tin nhắn vừa gửi
                this.justSentMessage = true;
            }
        })
        .catch(err => {
            console.warn("[Chat] Lỗi gửi tin nhắn:", err);
            if (err.message === "not_enough_xp") {
                Swal.fire({
                    title: "Không đủ XP 💥",
                    html: `Tài khoản của con không đủ 50 XP để thực hiện gửi tin nhắn.<br/>Vui lòng học tập thêm để tích lũy XP!`,
                    icon: "warning",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Đồng ý"
                });
            } else {
                Swal.fire("Lỗi", "Không thể gửi tin nhắn chat. Vui lòng thử lại sau!", "error");
            }
        });
    },

    showXpMinusAnimation: function(targetElement) {
        if (!targetElement) return;
        try {
            const rect = targetElement.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top;

            const popup = document.createElement("div");
            popup.className = "xp-damage-popup";
            popup.innerHTML = "💥 -50 XP";
            popup.style.left = `${x}px`;
            popup.style.top = `${y}px`;

            document.body.appendChild(popup);

            if (this.audio && typeof this.audio.playSwordHit === 'function') {
                this.audio.playSwordHit();
            }

            setTimeout(() => {
                popup.remove();
            }, 1200);
        } catch (e) {
            console.error("Lỗi tạo hiệu ứng trừ XP:", e);
        }
    },

    loadChatMessages: function() {
        const senderId = this.config.defaultStudentId || 'default';
        const receiverId = this.currentChatReceiverId;
        if (!senderId || !receiverId) return;

        const roomId = [senderId, receiverId].sort().join("_");
        const url = `/api/chat/messages?roomId=${roomId}`;

        fetch(this.getApiUrl(url))
            .then(res => res.json())
            .then(resData => {
                if (resData.success && resData.messages) {
                    if (this.isChatMinimized) {
                        const unreadCount = Math.max(0, resData.messages.length - this.lastReadMessageCount);
                        const badge = document.getElementById("chat-unread-badge");
                        if (badge) {
                            badge.innerText = unreadCount;
                            badge.style.display = unreadCount > 0 ? "block" : "none";
                            
                            // Nếu có tin nhắn mới khi đang thu nhỏ, phát âm thanh và hiệu ứng
                            if (resData.messages.length > this.lastReadMessageCount) {
                                const lastMsg = resData.messages[resData.messages.length - 1];
                                if (lastMsg && lastMsg.senderId !== senderId) {
                                    this.audio.playMessageNotification();
                                    const minimizedBubble = document.getElementById("chat-minimized-bubble");
                                    if (minimizedBubble) {
                                        minimizedBubble.classList.add("glow-bounce");
                                        setTimeout(() => minimizedBubble.classList.remove("glow-bounce"), 1500);
                                    }
                                }
                            }
                        }
                        this.lastReadMessageCount = resData.messages.length;
                    } else {
                        // Nếu có tin nhắn mới tăng lên khi đang mở cửa sổ chat chính, phát âm thanh và tạo hiệu ứng nhấp nháy viền
                        if (resData.messages.length > this.lastReadMessageCount) {
                            const lastMsg = resData.messages[resData.messages.length - 1];
                            if (lastMsg && lastMsg.senderId !== senderId) {
                                this.audio.playMessageNotification();
                                const chatWindow = document.getElementById("floating-chat-window");
                                if (chatWindow) {
                                    chatWindow.classList.add("glow-bounce");
                                    setTimeout(() => chatWindow.classList.remove("glow-bounce"), 1500);
                                }
                            }
                        }
                        this.renderChatMessages(resData.messages);
                        this.lastReadMessageCount = resData.messages.length;
                    }
                }
            })
            .catch(err => console.warn("[Chat] Lỗi load tin nhắn:", err));
    },

    renderChatMessages: function(messages) {
        const container = document.getElementById("chat-messages-container");
        if (!container) return;

        const selfId = this.config.defaultStudentId || 'default';
        const isAtBottom = container.scrollHeight - container.clientHeight <= container.scrollTop + 30;

        container.innerHTML = messages.map((msg, index) => {
            const isOutgoing = msg.senderId === selfId;
            const timeStr = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
            const msgVer = msg.appVersion ? msg.appVersion : '';

            // Chỉ hiển thị -50 XP cho tin nhắn outgoing cuối cùng khi vừa gửi thành công
            const showXpBadge = isOutgoing && (index === messages.length - 1) && this.justSentMessage;

            return `
                <div class="chat-message-bubble-wrapper ${isOutgoing ? 'outgoing' : 'incoming'}">
                    <div style="font-size: 0.72rem; opacity: 0.85; margin-bottom: 2px; font-weight: 600; display:flex; align-items:center; gap:5px; ${isOutgoing ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}">
                        <span>${isOutgoing ? 'Con' : msg.senderName || 'Bạn học'}</span>
                        ${msgVer ? `<span style="font-size:0.65rem; background:rgba(99, 102, 241, 0.15); color:#6366f1; border:1px solid rgba(99, 102, 241, 0.3); padding:0px 5px; border-radius:5px; font-family:monospace; font-weight:700;">${msgVer}</span>` : ''}
                    </div>
                    <div class="chat-message-bubble">
                        ${showXpBadge ? '<div class="chat-xp-deduction-fade">-50 XP</div>' : ''}
                        ${msg.text}
                    </div>
                    <div class="chat-message-time">${timeStr}</div>
                </div>
            `;
        }).join("");

        // Reset cờ sau khi render xong
        this.justSentMessage = false;

        if (isAtBottom || container.scrollTop === 0) {
            container.scrollTop = container.scrollHeight;
        }
    },

    toggleEmojiPicker: function() {
        const picker = document.getElementById("chat-emoji-picker");
        if (picker) {
            picker.classList.toggle("hidden");
        }
    },

    insertEmoji: function(emoji) {
        const input = document.getElementById("chat-message-input");
        if (!input) return;
        
        const startPos = input.selectionStart;
        const endPos = input.selectionEnd;
        const text = input.value;
        
        input.value = text.substring(0, startPos) + emoji + text.substring(endPos, text.length);
        
        const newCursorPos = startPos + emoji.length;
        input.selectionStart = newCursorPos;
        input.selectionEnd = newCursorPos;
        
        input.focus();
        
        const picker = document.getElementById("chat-emoji-picker");
        if (picker) {
            picker.classList.add("hidden");
        }
    },

    isUpdateSwalShowing: false,

    checkUpdateAuto: async function() {
        if (this.isUpdateSwalShowing) return;
        try {
            const response = await fetch('/api/check-update');
            if (!response.ok) return;
            const data = await response.json();
            
            if (data.hasUpdate) {
                this.isUpdateSwalShowing = true;
                // Định dạng changelog đẹp mắt (hỗ trợ xuống dòng)
                const changelogHtml = data.changelog
                    ? data.changelog.split('\n').map(line => `<li>${line}</li>`).join('')
                    : '<li>Cải tiến hiệu năng và sửa một số lỗi nhỏ.</li>';

                Swal.fire({
                    title: '🎉 Có Phiên Bản Mới!',
                    html: `
                        <div style="text-align: left; font-size: 0.95rem; line-height: 1.6; color: var(--text-main);">
                            <p style="margin-bottom: 0.8rem;">Hệ thống đã phát hiện phiên bản mới <b>v${data.latestVersion}</b> (Phiên bản hiện tại: v${data.currentVersion}).</p>
                            <div style="background: rgba(255, 255, 255, 0.05); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); max-height: 150px; overflow-y: auto; margin-bottom: 1rem;">
                                <h4 style="margin-top: 0; color: var(--primary); font-weight: 700; margin-bottom: 0.5rem;">Nhật ký thay đổi:</h4>
                                <ul style="padding-left: 1.2rem; margin: 0;">
                                    ${changelogHtml}
                                </ul>
                            </div>
                            <p style="color: var(--warning); font-size: 0.85rem; font-weight: 500;">
                                ⚠️ Quá trình cập nhật sẽ tự động lưu lại toàn bộ tiến trình học tập của con và khởi chạy lại ứng dụng.
                            </p>
                        </div>
                    `,
                    icon: 'info',
                    iconColor: '#3E8EED',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    showCancelButton: true,
                    confirmButtonText: 'Cập nhật ngay 🚀',
                    cancelButtonText: 'Để sau',
                    confirmButtonColor: '#3E8EED',
                    cancelButtonColor: 'var(--text-muted)',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    customClass: {
                        popup: 'custom-swal-dark-popup',
                        title: 'custom-swal-dark-title'
                    },
                    willClose: () => {
                        this.isUpdateSwalShowing = false;
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        // Hiển thị màn hình chờ tải và cài đặt
                        Swal.fire({
                            title: 'Đang tiến hành cập nhật...',
                            html: `
                                <div id="update-status-detail" style="text-align: left; font-size: 0.95rem; line-height: 1.6;">
                                    <p>Hệ thống đang tải bản cập nhật và cài đặt tự động...</p>
                                    <div class="update-progress-container" style="margin-top: 15px; width: 100%;">
                                        <div class="progress-bar-bg" style="width: 100%; background: rgba(255,255,255,0.1); height: 10px; border-radius: 5px; overflow: hidden; margin-bottom: 8px;">
                                            <div id="update-progress-bar" style="width: 0%; background: #3E8EED; height: 100%; transition: width 0.3s ease;"></div>
                                        </div>
                                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted);">
                                            <span id="update-percent">Đang chuẩn bị...</span>
                                            <span id="update-bytes">0.00 MB / 0.00 MB</span>
                                        </div>
                                    </div>
                                    <p style="color: var(--warning); font-size: 0.85rem; font-weight: 500; margin-top: 15px;">
                                        ⚠️ Vui lòng giữ kết nối Internet và không tắt chương trình!
                                    </p>
                                </div>
                            `,
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            showConfirmButton: false,
                            background: 'var(--bg-card)',
                            color: 'var(--text-main)',
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });

                        // Hàm bắt đầu polling
                        const startPollingUpdate = (latestVersion) => {
                            let errorCount = 0;
                            let countdown = 12;
                            let isInstallingStarted = false;

                            const poll = async () => {
                                try {
                                    const res = await fetch('/api/update-status');
                                    if (!res.ok) throw new Error('Lỗi kết nối API trạng thái');
                                    const statusData = await res.json();
                                    errorCount = 0;

                                    if (statusData.status === 'downloading') {
                                        const bar = document.getElementById('update-progress-bar');
                                        const percentText = document.getElementById('update-percent');
                                        const bytesText = document.getElementById('update-bytes');

                                        if (bar) bar.style.width = statusData.progress + '%';
                                        if (percentText) percentText.textContent = `Đang tải: ${statusData.progress}%`;
                                        if (bytesText) {
                                            const downloadedMB = (statusData.downloadedBytes / (1024 * 1024)).toFixed(2);
                                            const totalMB = (statusData.totalBytes / (1024 * 1024)).toFixed(2);
                                            bytesText.textContent = `${downloadedMB} MB / ${totalMB} MB`;
                                        }
                                        setTimeout(poll, 800);
                                    } else if (statusData.status === 'installing') {
                                        if (!isInstallingStarted) {
                                            isInstallingStarted = true;
                                            runInstallerCountdown();
                                        }
                                    } else if (statusData.status === 'error') {
                                        Swal.fire({
                                            title: 'Lỗi cập nhật!',
                                            text: statusData.error || 'Có lỗi xảy ra trong quá trình tải.',
                                            icon: 'error',
                                            background: 'var(--bg-card)',
                                            color: 'var(--text-main)',
                                            confirmButtonText: 'Đóng'
                                        });
                                    } else {
                                        setTimeout(poll, 800);
                                    }
                                } catch (err) {
                                    errorCount++;
                                    
                                    // Cập nhật giao diện Swal để báo cho người dùng biết là đang cài đặt tệp tin mới và chờ server khởi động lại
                                    const statusDetail = document.getElementById('update-status-detail');
                                    if (statusDetail) {
                                        statusDetail.innerHTML = `
                                            <p style="color: var(--success, #2ecc71); font-weight: bold; font-size: 1.1rem; margin-bottom: 10px;">Đang tiến hành cài đặt các tệp tin mới...</p>
                                            <p>Ứng dụng đang được nâng cấp lên phiên bản v${latestVersion}.</p>
                                            <p>Hệ thống sẽ tự động khởi động lại sau khi hoàn tất. Vui lòng không tắt máy tính!</p>
                                            <div style="text-align: center; margin-top: 15px;">
                                                <div class="update-spinner" style="display: inline-block; width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.1); border-radius: 50%; border-top-color: #3E8EED; animation: spin 1s ease-in-out infinite;"></div>
                                                <style>
                                                    @keyframes spin { to { transform: rotate(360deg); } }
                                                </style>
                                            </div>
                                        `;
                                    }
                                    
                                    if (errorCount > 60) { // Quá 90 giây (60 lần * 1.5s) mà server chưa online lại
                                        Swal.fire({
                                            title: 'Lỗi cập nhật!',
                                            text: 'Quá trình cài đặt mất quá nhiều thời gian hoặc máy chủ không thể khởi động lại.',
                                            icon: 'error',
                                            background: 'var(--bg-card)',
                                            color: 'var(--text-main)',
                                            confirmButtonText: 'Đóng'
                                        });
                                    } else {
                                        // Thử kết nối lại (polling) sau 1500ms
                                        setTimeout(poll, 1500);
                                    }
                                }
                            };

                            const runInstallerCountdown = () => {
                                const interval = setInterval(() => {
                                    countdown--;
                                    if (countdown <= 0) {
                                        clearInterval(interval);
                                        window.location.reload();
                                    } else {
                                        Swal.update({
                                            title: '🎉 Tải Hoàn Tất!',
                                            html: `
                                                <div style="text-align: center; font-size: 0.95rem; line-height: 1.6;">
                                                    <p style="color: var(--success, #2ecc71); font-weight: bold; font-size: 1.1rem; margin-bottom: 10px;">Đã tải xong tệp tin cài đặt!</p>
                                                    <p>Đang cài đặt các tệp tin mới và khởi động lại ứng dụng trong <b>${countdown}</b> giây.</p>
                                                    <p style="color: var(--warning); font-size: 0.85rem; font-weight: 500;">
                                                        ⚠️ Vui lòng không tắt chương trình cho đến khi hoàn tất!
                                                    </p>
                                                </div>
                                            `
                                        });
                                    }
                                }, 1000);
                            };

                            setTimeout(poll, 500);
                        };

                        // Gọi API nâng cấp
                        fetch('/api/perform-update', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ downloadUrl: data.downloadUrl })
                        }).then(res => {
                            if (res.ok) {
                                startPollingUpdate(data.latestVersion);
                            } else {
                                Swal.fire({
                                    title: 'Lỗi cập nhật!',
                                    text: 'Không thể kích hoạt tiến trình cài đặt trên máy chủ local.',
                                    icon: 'error',
                                    background: 'var(--bg-card)',
                                    color: 'var(--text-main)',
                                    confirmButtonText: 'Đóng'
                                });
                            }
                        }).catch(err => {
                            // Dự phòng khi server ngắt ngay lập tức
                            let countdown = 10;
                            const interval = setInterval(() => {
                                countdown--;
                                if (countdown <= 0) {
                                    clearInterval(interval);
                                    window.location.reload();
                                } else {
                                    Swal.update({
                                        html: `Đang cài đặt bản cập nhật mới và khởi động lại trong <b>${countdown}</b> giây...`
                                    });
                                }
                            }, 1000);
                        });
                    }
                });
            }
        } catch (e) {
            console.warn('[AutoUpdate] Không thể kiểm tra phiên bản:', e);
        }
    },
    
    isAiProgressDetailExpanded: false,
    fetchAiStatusRef: null,

    // Khởi chạy trình theo dõi tiến trình AI
    initAiProgressTracker: function() {
        const banner = document.getElementById("ai-progress-banner");
        const bar = document.getElementById("ai-progress-bar");
        const text = document.getElementById("ai-progress-text");
        const percent = document.getElementById("ai-progress-percent");
        const errBtn = document.getElementById("ai-progress-error-btn");
        const errCount = document.getElementById("ai-error-count");
        
        if (!banner) return;
        
        this.aiErrors = []; // Lưu trữ danh sách lỗi nhận từ server
        
        const fetchAiStatus = () => {
            const studentId = this.config.defaultStudentId || 'default';
            const classLevel = this.config.currentClass || '6';
            const subject = 'math'; // Cố định theo dõi tiến trình sinh đề ngầm môn Toán
            fetch(this.getApiUrl(`/api/ai-status?studentId=${studentId}&classLevel=${classLevel}&subject=${subject}`))
                .then(res => {
                    if (!res.ok) {
                        throw new Error("Không có quyền truy cập hoặc lỗi máy chủ");
                    }
                    return res.json();
                })
                .then(data => {
                    if (data && data.error) {
                        throw new Error(data.error);
                    }
                    
                    this.aiErrors = data.errors || [];
                    
                    // Cập nhật số lượng lỗi
                    if (this.aiErrors.length > 0) {
                        errBtn.classList.remove("hidden");
                        errCount.textContent = this.aiErrors.length;
                    } else {
                        errBtn.classList.add("hidden");
                    }
                    
                    const total = data.totalExams || 0;
                    const completed = data.completedExams || 0;
                    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
                    
                    bar.style.width = pct + "%";
                    percent.textContent = pct + "%";
                    
                    // Xóa các trạng thái cũ
                    banner.classList.remove("hidden", "ai-completed", "ai-paused");
                    
                    if (data.state === 'generating' || data.state === 'active') {
                        text.innerHTML = `<i class="fa-solid fa-robot ai-robot-icon animate-pulse"></i> AI đang sinh đề ngầm: <b>${data.currentLessonTitle}</b> (${completed}/${total} bài)`;
                    } else if (data.state === 'paused') {
                        banner.classList.add("ai-paused");
                        text.innerHTML = `<i class="fa-solid fa-hourglass-half"></i> ${data.message} (${completed}/${total} bài)`;
                    } else if (data.state === 'quota_exhausted') {
                        banner.classList.add("ai-paused");
                        text.innerHTML = `<i class="fa-solid fa-triangle-exclamation text-danger"></i> <b>Cảnh báo:</b> Toàn bộ API Keys đều hết hạn ngạch ngày hoặc lỗi!`;
                    } else if (data.state === 'completed' || pct === 100) {
                        banner.classList.add("ai-completed");
                        text.innerHTML = `<i class="fa-solid fa-circle-check"></i> Đã hoàn tất 100% dữ liệu đề thi AI!`;
                        bar.style.width = "100%";
                        percent.textContent = "100%";
                        
                        // Tự động ẩn banner sau 8 giây khi hoàn tất để tiết kiệm diện tích
                        setTimeout(() => {
                            banner.classList.add("hidden");
                        }, 8000);
                        
                        clearInterval(this.aiProgressInterval); // Dừng polling
                    } else {
                        if (pct === 100) {
                            banner.classList.add("ai-completed");
                            text.innerHTML = `<i class="fa-solid fa-circle-check"></i> Đã hoàn tất 100% dữ liệu đề thi AI!`;
                            setTimeout(() => {
                                banner.classList.add("hidden");
                            }, 5000);
                            clearInterval(this.aiProgressInterval);
                        } else {
                            text.innerHTML = `<i class="fa-solid fa-robot"></i> AI đang đợi hàng đợi... (${completed}/${total} bài)`;
                        }
                    }

                    // Nếu panel chi tiết đang được mở rộng, vẽ lại UI
                    if (this.isAiProgressDetailExpanded) {
                        this.renderAiProgressDetail(data);
                    }
                })
                .catch(err => {
                    console.error("Lỗi khi kết nối với AI status API:", err.message || err);
                    // Tự động ẩn thanh tiến trình và dừng polling do không có quyền truy cập admin
                    banner.classList.add("hidden");
                    if (this.aiProgressInterval) {
                        clearInterval(this.aiProgressInterval);
                    }
                });
        };
        
        this.fetchAiStatusRef = fetchAiStatus;
        
        // Gọi lần đầu và thiết lập lặp
        fetchAiStatus();
        this.aiProgressInterval = setInterval(fetchAiStatus, 4000);
    },

    // Hàm Toggle mở rộng / co gọn panel tiến trình chi tiết
    toggleAiProgressDetail: function() {
        const detailPanel = document.getElementById("ai-progress-detail");
        const toggleIcon = document.getElementById("ai-toggle-icon");
        if (!detailPanel) return;
        
        this.isAiProgressDetailExpanded = !this.isAiProgressDetailExpanded;
        
        if (this.isAiProgressDetailExpanded) {
            detailPanel.classList.remove("hidden");
            if (toggleIcon) toggleIcon.classList.add("rotated");
            // Fetch status ngay lập tức để render
            if (this.fetchAiStatusRef) this.fetchAiStatusRef();
        } else {
            detailPanel.classList.add("hidden");
            if (toggleIcon) toggleIcon.classList.remove("rotated");
        }
    },

    // Vẽ panel chi tiết tiến trình
    renderAiProgressDetail: function(data) {
        const detailPanel = document.getElementById("ai-progress-detail");
        if (!detailPanel) return;
        
        this.currentLessonsStatus = data.lessonsStatus || [];
        
        const total = data.totalExams || 0;
        const completed = data.completedExams || 0;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        const remaining = Math.max(0, total - completed);
        
        // Tính toán thời gian ước tính còn lại: 1 đề ~ 20 giây (gồm cả thời gian API phản hồi + delay)
        let estTimeHtml = '';
        if (remaining === 0) {
            estTimeHtml = '<span style="color:var(--success); font-weight:700;">Đã hoàn thành</span>';
        } else if (data.state === 'quota_exhausted') {
            estTimeHtml = '<span style="color:var(--danger); font-weight:700;">Đang dừng (Hết Quota)</span>';
        } else {
            const estSeconds = remaining * 20;
            const mins = Math.floor(estSeconds / 60);
            const secs = estSeconds % 60;
            const timeStr = mins > 0 ? `${mins} phút ${secs} giây` : `${secs} giây`;
            estTimeHtml = `<span style="color:var(--warning); font-weight:700;">~ ${timeStr}</span>`;
        }
        
        // Trạng thái đếm ngược rate limit
        let statusMessageDetail = data.message || 'Đang chuẩn bị hàng đợi...';
        if (data.state === 'paused' && data.pausedUntil) {
            const leftMs = Math.max(0, data.pausedUntil - Date.now());
            const leftSecs = Math.ceil(leftMs / 1000);
            if (leftSecs > 0) {
                statusMessageDetail = `<i class="fa-solid fa-hourglass-half"></i> Đang chờ Rate Limit: Tự phục hồi sau <b>${leftSecs} giây</b>...`;
            }
        }
        
        // Trạng thái API Key hiện tại
        let apiKeyInfoHtml = '';
        if (data.state === 'quota_exhausted') {
            apiKeyInfoHtml = `<span style="color:var(--danger); font-weight:700;">Không có Key khả dụng (Tất cả hết quota/lỗi)</span>`;
        } else {
            apiKeyInfoHtml = `
                <span>${data.activeKeyAccount || 'Chưa rõ'}</span> 
                <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-family: monospace; color:#38bdf8;">${data.activeKeyMasked || 'N/A'}</code>
            `;
        }
        
        // Cảnh báo khi hết Quota
        let quotaWarningHtml = '';
        if (data.state === 'quota_exhausted') {
            quotaWarningHtml = `
                <div class="ai-quota-warning-box">
                    <div class="ai-quota-warning-text">
                        <i class="fa-solid fa-triangle-exclamation" style="margin-right:0.4rem; color:#ef4444;"></i>
                        Các khóa API Key đi kèm bản Clean đã hết lượt sử dụng miễn phí trong ngày (Google giới hạn số lượt dùng mỗi ngày). Đừng lo lắng! ${this.config.parentName || 'Phụ huynh'} chỉ cần bấm nút "Đổi API Key ngay" bên dưới, làm theo hướng dẫn để lấy khóa API Key mới hoàn toàn miễn phí của riêng mình và dán vào góc Phụ huynh là xong!
                    </div>
                    <button class="btn-ai-action-sm" onclick="app.showScreen('parent'); app.toggleAiProgressDetail();">
                        <i class="fa-solid fa-key"></i> Đổi API Key ngay
                    </button>
                </div>
            `;
        }
        
        // Vẽ bản đồ các bài học
        let lessonsHtml = '';
        if (data.lessonsStatus && data.lessonsStatus.length > 0) {
            data.lessonsStatus.forEach((lesson, index) => {
                let statusClass = 'pending';
                let statusTitle = 'Đang chờ tạo đề';
                let icon = '<i class="fa-regular fa-clock"></i>';
                
                if (lesson.status === 'completed') {
                    statusClass = 'completed';
                    statusTitle = 'Đề thi đã tạo thành công';
                    icon = '<i class="fa-solid fa-circle-check"></i>';
                } else if (lesson.status === 'generating') {
                    statusClass = 'generating';
                    statusTitle = 'AI đang làm việc trên bài học này';
                    icon = '<i class="fa-solid fa-spinner fa-spin"></i>';
                } else if (lesson.status === 'failed') {
                    statusClass = 'failed';
                    statusTitle = `Bị lỗi: ${lesson.error || 'Lỗi không xác định'}. Nhấn để xem chi tiết`;
                    icon = '<i class="fa-solid fa-circle-xmark"></i>';
                }
                
                const shortTitle = lesson.title.length > 25 ? lesson.title.substring(0, 23) + '...' : lesson.title;
                const clickHandler = lesson.status === 'failed' 
                    ? `onclick="app.showSingleLessonErrorByIndex(${index})"` 
                    : '';
                
                lessonsHtml += `
                    <div class="ai-lesson-node ${statusClass}" title="${lesson.title} - ${statusTitle}" ${clickHandler}>
                        ${icon} Bài ${index + 1}: ${shortTitle}
                    </div>
                `;
            });
        } else {
            lessonsHtml = '<div style="color:var(--text-muted); font-size:0.85rem; padding: 0.5rem;">Không tìm thấy danh sách bài học.</div>';
        }
        
        detailPanel.innerHTML = `
            <div class="ai-detail-summary-grid">
                <div class="ai-detail-info-block">
                    <h4><i class="fa-solid fa-circle-info"></i> THÔNG TIN TIẾN TRÌNH</h4>
                    <div class="ai-detail-info-list">
                        <div class="ai-detail-info-item">
                            <span class="ai-detail-info-label">Trạng thái AI:</span>
                            <span class="ai-detail-info-value active-task">${statusMessageDetail}</span>
                        </div>
                        <div class="ai-detail-info-item">
                            <span class="ai-detail-info-label">API Key đang chạy:</span>
                            <span class="ai-detail-info-value">${apiKeyInfoHtml}</span>
                        </div>
                        <div class="ai-detail-info-item">
                            <span class="ai-detail-info-label">API Keys hoạt động:</span>
                            <span class="ai-detail-info-value">${data.availableKeysCount || 0}/${data.totalKeys || 0} keys khả dụng</span>
                        </div>
                    </div>
                </div>
                <div class="ai-detail-info-block right-block">
                    <h4><i class="fa-solid fa-calculator"></i> TIẾN ĐỘ & ƯỚC TÍNH</h4>
                    <div class="ai-detail-info-list">
                        <div class="ai-detail-info-item">
                            <span class="ai-detail-info-label">Tổng số đề đã hoàn thành:</span>
                            <span class="ai-detail-info-value">${completed}/${total} bài học (${pct}%)</span>
                        </div>
                        <div class="ai-detail-info-item">
                            <span class="ai-detail-info-label">Đề thi còn lại cần tạo:</span>
                            <span class="ai-detail-info-value">${remaining} đề thi</span>
                        </div>
                        <div class="ai-detail-info-item">
                            <span class="ai-detail-info-label">Thời gian hoàn thành dự kiến:</span>
                            <span class="ai-detail-info-value">${estTimeHtml}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            ${quotaWarningHtml}
            
            <div class="ai-detail-map-section">
                <div class="ai-detail-map-header">
                    <h5 class="ai-detail-map-title"><i class="fa-solid fa-map-location-dot"></i> BẢN ĐỒ TIẾN TRÌNH CHI TIẾT</h5>
                    <span style="font-size:0.75rem; color:var(--text-muted);"><i class="fa-solid fa-info-circle"></i> Đề thi lỗi có màu đỏ, nhấn vào để xem chi tiết lỗi</span>
                </div>
                <div class="ai-detail-lessons-map">
                    ${lessonsHtml}
                </div>
            </div>
        `;
    },
    
    // Hiển thị lỗi riêng lẻ của một bài học bằng SweetAlert2
    showSingleLessonError: function(lessonTitle, errorMsg) {
        Swal.fire({
            title: 'Lỗi sinh đề bài học',
            html: `
                <div style="text-align: left;">
                    <strong style="color:var(--danger);">Bài học:</strong> ${lessonTitle}<br/><br/>
                    <strong style="color:var(--danger);">Chi tiết lỗi:</strong>
                    <pre style="background:var(--bg-app); padding: 0.6rem; border-radius: 6px; font-family: monospace; white-space: pre-wrap; font-size: 0.85rem; margin-top: 0.5rem; border: 1px solid var(--border-color); color:var(--text-main);">${errorMsg}</pre>
                    <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 1rem;">
                        <i class="fa-solid fa-circle-info"></i> Lỗi này có thể do hạn ngạch API gặp sự cố hoặc định dạng JSON phản hồi từ Gemini không chuẩn. Hệ thống đã lưu lại lỗi và chuyển qua bài tiếp theo để tránh tắc nghẽn.
                    </p>
                </div>
            `,
            icon: 'error',
            confirmButtonText: 'Đóng',
            customClass: {
                popup: 'card'
            }
        });
    },

    // Hiển thị lỗi bài học thông qua chỉ số mảng đã lưu
    showSingleLessonErrorByIndex: function(index) {
        if (!this.currentLessonsStatus || !this.currentLessonsStatus[index]) return;
        const lesson = this.currentLessonsStatus[index];
        this.showSingleLessonError(lesson.title, lesson.error || 'Lỗi không xác định');
    },

    // Hiển thị danh sách lỗi của AI bằng SweetAlert2
    showAiErrors: function() {
        if (!this.aiErrors || this.aiErrors.length === 0) return;
        
        let errorItemsHtml = '';
        let hasQuotaError = false;
        let hasAuthError = false;
        let hasNetworkError = false;

        this.aiErrors.forEach(err => {
            const time = new Date(err.timestamp).toLocaleTimeString();
            const errMsg = err.error || '';
            
            // Phân loại lỗi
            let errorClass = 'ai-error-general';
            let errorTypeLabel = 'Lỗi không xác định';
            
            if (errMsg.includes('429') || errMsg.includes('Quota') || errMsg.includes('Limit') || errMsg.includes('hạn mức') || errMsg.includes('quá tải') || errMsg.includes('RESOURCE_EXHAUSTED')) {
                errorClass = 'ai-error-quota';
                errorTypeLabel = 'Hết hạn mức / Quá tải (Rate Limit - 429)';
                hasQuotaError = true;
            } else if (errMsg.includes('403') || errMsg.includes('Forbidden') || errMsg.includes('Key không hợp lệ') || errMsg.includes('API key not valid')) {
                errorClass = 'ai-error-auth';
                errorTypeLabel = 'Lỗi API Key không hợp lệ (403)';
                hasAuthError = true;
            } else if (errMsg.includes('fetch failed') || errMsg.includes('timeout') || errMsg.includes('network')) {
                errorClass = 'ai-error-network';
                errorTypeLabel = 'Lỗi kết nối mạng (Network Error)';
                hasNetworkError = true;
            }

            errorItemsHtml += `
                <div class="ai-error-item ${errorClass}" style="margin-bottom: 0.8rem; padding: 0.8rem; border-radius: 8px; border-left: 4px solid var(--warning); background-color: var(--primary-bg);">
                    <div class="ai-error-item-title" style="font-weight: 700; margin-bottom: 0.3rem; color: var(--text-main);">
                        <i class="fa-solid fa-triangle-exclamation" style="color:var(--warning);"></i> 
                        ${err.lessonTitle} (${err.lessonId})
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.3rem;">
                        Loại lỗi: <span style="font-weight: 600; color: var(--danger);">${errorTypeLabel}</span> | Lúc ${time}
                    </div>
                    <div class="ai-error-item-desc" style="font-size: 0.85rem; font-family: monospace; white-space: pre-wrap; background: var(--bg-card); padding: 0.4rem; border-radius: 4px; color: var(--text-main); border: 1px solid var(--border-color);">${errMsg}</div>
                </div>
            `;
        });
        
        // Tạo gợi ý khắc phục khoa học
        let adviceHtml = '';
        if (hasQuotaError) {
            adviceHtml += `
                <div style="text-align: left; background-color: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); padding: 0.8rem; border-radius: 8px; margin-bottom: 1rem;">
                    <strong style="color: var(--danger);"><i class="fa-solid fa-lightbulb"></i> Gợi ý khắc phục Hết hạn mức / Quá tải:</strong>
                    <ul style="margin: 0.4rem 0 0 1.2rem; padding: 0; font-size: 0.85rem; line-height: 1.5; color: var(--text-main);">
                        <li>Tài khoản Gemini API miễn phí đã hết 20 requests/ngày.</li>
                        <li><b>Cách xử lý:</b> Hãy mở tệp <code style="background:var(--primary-bg); padding: 1px 4px; border-radius:3px;">.env</code> ở thư mục gốc của dự án, cập nhật thêm/thay thế các khóa API Key mới vào biến <code style="background:var(--primary-bg); padding:1px 4px; border-radius:3px;">GEMINI_API_KEY</code> (phân tách nhau bởi dấu phẩy).</li>
                        <li>Hoặc chờ sang ngày hôm sau để hạn ngạch miễn phí được reset.</li>
                    </ul>
                </div>
            `;
        }
        if (hasAuthError) {
            adviceHtml += `
                <div style="text-align: left; background-color: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2); padding: 0.8rem; border-radius: 8px; margin-bottom: 1rem;">
                    <strong style="color: var(--warning);"><i class="fa-solid fa-key"></i> Gợi ý khắc phục lỗi API Key:</strong>
                    <ul style="margin: 0.4rem 0 0 1.2rem; padding: 0; font-size: 0.85rem; line-height: 1.5; color: var(--text-main);">
                        <li>Khóa API Key của ${this.config.parentName || 'phụ huynh'} bị Google từ chối (403 Forbidden).</li>
                        <li><b>Cách xử lý:</b> ${this.config.parentName || 'Phụ huynh'} vui lòng kiểm tra xem khóa API Key đã copy đầy đủ chưa, hoặc truy cập <a href="https://aistudio.google.com/" target="_blank" style="color: var(--primary); font-weight:600;">Google AI Studio</a> để tạo lại API Key mới và cập nhật vào tệp <code style="background:var(--primary-bg); padding:1px 4px; border-radius:3px;">.env</code>.</li>
                    </ul>
                </div>
            `;
        }
        if (hasNetworkError) {
            adviceHtml += `
                <div style="text-align: left; background-color: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.2); padding: 0.8rem; border-radius: 8px; margin-bottom: 1rem;">
                    <strong style="color: var(--primary);"><i class="fa-solid fa-wifi"></i> Gợi ý khắc phục lỗi Mạng:</strong>
                    <ul style="margin: 0.4rem 0 0 1.2rem; padding: 0; font-size: 0.85rem; line-height: 1.5; color: var(--text-main);">
                        <li>Mạng kết nối đến Google server bị gián đoạn.</li>
                        <li><b>Cách xử lý:</b> Kiểm tra lại đường truyền Internet của máy chủ chạy ứng dụng hoặc cài đặt proxy nếu mạng bị chặn.</li>
                    </ul>
                </div>
            `;
        }
        if (!hasQuotaError && !hasAuthError && !hasNetworkError) {
            adviceHtml += `
                <div style="text-align: left; background-color: var(--primary-bg); border: 1px solid var(--border-color); padding: 0.8rem; border-radius: 8px; margin-bottom: 1rem;">
                    <strong><i class="fa-solid fa-screwdriver-wrench"></i> Hướng dẫn khắc phục chung:</strong>
                    <p style="margin: 0.4rem 0 0 0; font-size: 0.85rem; color: var(--text-main);">${this.config.parentName || 'Phụ huynh'} vui lòng kiểm tra log hệ thống hoặc thử khởi động lại ứng dụng. Nếu tiếp tục gặp lỗi, vui lòng liên hệ kỹ thuật.</p>
                </div>
            `;
        }

        Swal.fire({
            title: 'Danh sách lỗi sinh đề thi AI',
            html: `
                <p style="font-size:0.9rem; margin-bottom:1rem; color:var(--text-muted); text-align: left;">
                    Hệ thống tự động bỏ qua các bài học này để tránh bị treo luồng khi gọi AI. Dưới đây là phân tích chi tiết lỗi và cách khắc phục:
                </p>
                ${adviceHtml}
                <div class="ai-error-list-modal" style="max-height: 300px; overflow-y: auto; text-align: left;">
                    ${errorItemsHtml}
                </div>
            `,
            icon: 'warning',
            confirmButtonText: 'Đóng',
            customClass: {
                popup: 'card'
            }
        });
    },

    // Quản lý giám sát rời tab
    initDistractionTracker: function() {
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'hidden') {
                const lessonScreen = document.getElementById("lesson-detail-panel");
                const practiceTab = document.getElementById("tab-practice");
                const resultBox = document.getElementById("practice-result-box");
                
                // Nếu đang ở màn hình làm bài và chưa nộp bài/xem kết quả
                if (lessonScreen && !lessonScreen.classList.contains("hidden") && 
                    practiceTab && !practiceTab.classList.contains("hidden") &&
                    resultBox && resultBox.classList.contains("hidden")) {
                    
                    this.state.distractions += 1;
                    this.saveProgress();
                }
            } else if (document.visibilityState === 'visible') {
                const lessonScreen = document.getElementById("lesson-detail-panel");
                const practiceTab = document.getElementById("tab-practice");
                const resultBox = document.getElementById("practice-result-box");
                
                if (lessonScreen && !lessonScreen.classList.contains("hidden") && 
                    practiceTab && !practiceTab.classList.contains("hidden") &&
                    resultBox && resultBox.classList.contains("hidden")) {
                    
                    // Hiển thị hộp cảnh báo cho học sinh khi quay lại bằng SweetAlert2
                    Swal.fire({
                        icon: 'warning',
                        title: 'Chú ý tập trung con nhé!',
                        text: `Việc chuyển tab hoặc ứng dụng khi đang làm bài tập đã được hệ thống ghi nhận lại để báo cáo cho ${this.config.parentName || 'Phụ huynh'}.`,
                        target: document.getElementById('tab-practice') || 'body',
                        confirmButtonText: 'Con đã rõ và sẽ tập trung học',
                        confirmButtonColor: 'var(--primary)'
                    });
                }
            }
        });
    },

    // Bật tắt chế độ Toàn màn hình
    toggleFullscreen: function() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Lỗi khi bật toàn màn hình: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    },

    // Helper phát âm Tiếng Anh chuẩn (en-US) offline sử dụng SpeechSynthesis
    speakEnglish: function(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('US') || v.name.includes('Natural'))) ||
                                  voices.find(v => v.lang.startsWith('en'));
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }
            utterance.rate = 0.85;
            window.speechSynthesis.speak(utterance);
        } else {
            console.warn("SpeechSynthesis không được hỗ trợ!");
        }
    },

    // Lấy ID video YouTube của bài học (ưu tiên ID tùy chỉnh của phụ huynh)
    getLessonVideoId: function(lessonId) {
        if (this.state.customVideos && this.state.customVideos[lessonId]) {
            return this.extractYoutubeId(this.state.customVideos[lessonId]);
        }
        const lesson = getLessonById(lessonId);
        return lesson ? this.extractYoutubeId(lesson.youtubeId) : "";
    },

    // Hàm Regex thông minh tự động trích xuất ID YouTube từ mọi định dạng link phụ huynh dán vào
    extractYoutubeId: function(input) {
        if (!input) return "";
        input = input.trim();
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = input.match(regExp);
        if (match && match[2].length === 11) {
            return match[2];
        }
        return input; // Trả về nguyên bản nếu người dùng đã nhập đúng ID 11 ký tự
    },

    // Lấy ID video YouTube của Dạng bài học (ưu tiên ID tùy chỉnh của phụ huynh)
    getSubtopicVideoId: function(subtopicId, lessonId) {
        if (this.state.customVideos && this.state.customVideos[subtopicId]) {
            return this.extractYoutubeId(this.state.customVideos[subtopicId]);
        }
        const lesson = getLessonById(lessonId);
        if (lesson && lesson.subtopics) {
            const sub = lesson.subtopics.find(s => s.id === subtopicId);
            if (sub && sub.youtubeId) {
                return this.extractYoutubeId(sub.youtubeId);
            }
        }
        // Tự động sử dụng video của bài học chính làm fallback nếu dạng bài không có video riêng
        return this.getLessonVideoId(lessonId);
    },

    // Render trình phát video hoặc khung thông báo dán video
    renderVideoPlayer: function(wrapperId, videoId, idToSave, lessonId) {
        const videoWrapper = document.getElementById(wrapperId);
        if (!videoWrapper) return;

        const lesson = typeof getLessonById === 'function' ? getLessonById(lessonId) : null;
        const hasPlaylist = lesson && lesson.videos && lesson.videos.length > 1;

        if (videoId) {
            let playlistHtml = '';
            if (hasPlaylist) {
                playlistHtml = `
                    <div class="video-playlist-selector" style="margin-top: 1rem; padding: 0.8rem; background: var(--bg-card); border-radius: 8px; border: 1px solid var(--border-color);">
                        <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 0.6rem; color: var(--primary);"><i class="fa-solid fa-list"></i> Các phần bài giảng trong Unit:</div>
                        <div class="playlist-buttons-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.5rem;">
                            ${lesson.videos.map((v, idx) => {
                                const isActive = v.id === videoId;
                                const activeStyle = isActive 
                                    ? 'background-color: var(--primary); color: #fff; border-color: var(--primary); font-weight: 700;' 
                                    : 'background-color: var(--bg-body); color: var(--text-color); border-color: var(--border-color);';
                                return `
                                    <button class="playlist-video-btn" onclick="app.switchPlaylistVideo('${v.id}', '${idToSave}', '${lessonId}')" style="text-align: left; padding: 0.5rem 0.8rem; font-size: 0.8rem; border-radius: 6px; border: 1px solid; cursor: pointer; transition: all 0.2s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ${activeStyle}" title="${v.title}">
                                        ${idx + 1}. ${v.title.replace(/Tiếng Anh 6 Unit \d+:\s*/gi, '')}
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }

            videoWrapper.innerHTML = `
                <div class="video-aspect-ratio-box" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px; background-color: #000; box-shadow: var(--shadow-sm); z-index: 1;">
                    <div class="video-thumbnail-overlay" onclick="app.playVideoFullscreen('${videoId}')" title="Bấm vào để xem bài giảng Fullscreen HD">
                        <img class="video-thumb-img" src="https://img.youtube.com/vi/${videoId}/hqdefault.jpg" alt="Video Thumbnail">
                        <div class="video-play-btn-3d">
                            <i class="fa-solid fa-play"></i>
                        </div>
                        <div class="video-play-text">${app.config.studentName || 'Con'} nhấp vào đây để xem Bài giảng Full HD 📺</div>
                    </div>
                </div>
                ${playlistHtml}
            `;
        } else {
            videoWrapper.innerHTML = `
                <div class="video-no-link-overlay" onclick="app.promptAddVideoId('${idToSave}', '${lessonId}')" title="Nhấp vào đây để thêm video bài giảng">
                    <div style="font-size: 3rem; margin-bottom: 0.8rem; text-shadow: 0 4px 10px rgba(0,0,0,0.15);">📺</div>
                    <div style="font-weight: 700; font-size: 1.05rem; color: var(--primary);">Không có video bài giảng liên kết</div>
                    <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.3rem;">${app.config.parentName || 'Bố'} hoặc ${app.config.studentName || 'Con'} nhấp vào đây để thêm link bài giảng nhé!</div>
                </div>
            `;
        }
    },

    switchPlaylistVideo: function(videoId, idToSave, lessonId) {
        this.renderVideoPlayer("video-wrapper", videoId, idToSave, lessonId);
        // Lưu tiến trình video vừa chọn xem
        this.state.customVideos = this.state.customVideos || {};
        this.state.customVideos[idToSave] = videoId;
        this.saveProgress();
    },

    // Hiển thị hộp thoại SweetAlert2 cho người dùng dán link video và lưu lại
    promptAddVideoId: function(idToSave, lessonId) {
        Swal.fire({
            title: 'Thêm video bài giảng',
            text: 'Dán đường dẫn (link) video YouTube hoặc ID video vào đây:',
            input: 'text',
            inputPlaceholder: 'Ví dụ: https://www.youtube.com/watch?v=...',
            showCancelButton: true,
            confirmButtonText: 'Lưu lại',
            cancelButtonText: 'Hủy',
            confirmButtonColor: 'var(--primary)',
            cancelButtonColor: 'var(--text-muted)',
            inputValidator: (value) => {
                if (!value) {
                    return 'Vui lòng nhập đường dẫn hoặc ID video YouTube!'
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const rawInput = result.value;
                const videoId = this.extractYoutubeId(rawInput);
                if (videoId) {
                    this.state.customVideos = this.state.customVideos || {};
                    this.state.customVideos[idToSave] = videoId;
                    this.saveProgress();
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'Đã lưu video thành công!',
                        text: 'Hệ thống đã cập nhật video bài giảng mới.',
                        confirmButtonColor: 'var(--primary)',
                        timer: 1500,
                        showConfirmButton: false
                    }).then(() => {
                        // Tải lại video hiển thị ngay lập tức
                        const lesson = this.currentLesson;
                        if (lesson) {
                            const hasSub = lesson.subtopics && lesson.subtopics.some(s => s.id === idToSave);
                            if (hasSub) {
                                this.showSubtopicDetail(idToSave);
                            } else {
                                // Đối với bài không chia dạng
                                const curVideoId = this.getLessonVideoId(lesson.id);
                                this.renderVideoPlayer("video-wrapper", curVideoId, lesson.id, lesson.id);
                            }
                        }
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi đường dẫn',
                        text: 'Không thể trích xuất ID YouTube từ liên kết này. Vui lòng kiểm tra lại!',
                        confirmButtonColor: 'var(--primary)'
                    });
                }
            }
        });
    },

    // Đồng bộ dữ liệu offline lên server SQLite khi mạng phục hồi hoặc khi load lại
    syncOfflineProgress: async function() {
        const localKey = this.getLocalStorageKey();
        const isDirty = localStorage.getItem(localKey + "_offline_dirty");
        if (isDirty === "true") {
            const rawData = localStorage.getItem(localKey + "_offline_data");
            if (rawData) {
                try {
                    const offlineState = JSON.parse(rawData);
                    console.log(`[Sync] Phát hiện dữ liệu offline chưa đồng bộ (XP: ${offlineState.xp || 0}). Đang đồng bộ lên SQLite...`);
                    const classLevel = this.config.currentClass || '6';
                    const studentId = this.config.defaultStudentId || '';
                    const res = await fetch(this.getApiUrl('/api/save-progress'), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ classLevel, studentId, state: offlineState })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        localStorage.removeItem(localKey + "_offline_dirty");
                        localStorage.removeItem(localKey + "_offline_data");
                        if (data && data.state) {
                            this.state = { ...this.state, ...data.state };
                        }
                        console.log("[Sync] Đồng bộ tiến trình offline lên SQLite thành công.");
                    } else {
                        console.warn("[Sync] Server trả về lỗi khi đồng bộ offline:", res.status);
                    }
                } catch(e) {
                    console.error("[Sync] Lỗi trong quá trình đồng bộ offline:", e);
                }
            }
        }
    },

    // Đọc tiến trình từ LocalStorage hoặc SQLite
    loadProgress: async function() {
        try {
            // Đồng bộ dữ liệu offline bẩn lên SQLite trước khi tải dữ liệu mới
            await this.syncOfflineProgress();

            // Đảm bảo state luôn có đầy đủ các trường mặc định từ trước khi load dữ liệu
            this.state = { ...this.getDefaultState(), ...this.state };
            const classLevel = this.config.currentClass || '6';
            const studentId = this.config.defaultStudentId || '';
            
            // Cơ chế tải lại tự động (retry) 3 lần nếu có lỗi kết nối máy chủ khi khởi động
            let res = null;
            let attempts = 0;
            const maxAttempts = 3;
            while (attempts < maxAttempts) {
                try {
                    res = await fetch(this.getApiUrl(`/api/load-progress?classLevel=${classLevel}&studentId=${studentId}`));
                    if (res.ok) {
                        break;
                    }
                } catch (err) {
                    console.warn(`[loadProgress] Lần thử ${attempts + 1} nạp dữ liệu thất bại:`, err.message);
                }
                attempts++;
                if (attempts < maxAttempts) {
                    await new Promise(r => setTimeout(r, 800)); // Chờ 800ms rồi thử lại
                }
            }

            let serverData = null;
            if (res && res.ok) {
                serverData = await res.json();
            }

            // Tự động kiểm tra và di chuyển dữ liệu cũ từ LocalStorage nếu có
            const localKey = this.getLocalStorageKey();
            const localRaw = localStorage.getItem(localKey);
            let localData = null;
            if (localRaw) {
                try {
                    localData = JSON.parse(localRaw);
                } catch(e) {}
            }

            let dataToUse = null;
            // Nếu có dữ liệu cục bộ và dữ liệu cục bộ tiến triển hơn (XP cao hơn hoặc có điểm)
            // thì chọn dữ liệu cục bộ để lưu/đồng bộ lên server SQLite
            if (localData && localData.xp > 0 && (!serverData || !serverData.xp || localData.xp > serverData.xp)) {
                console.log(`[Migration] Phát hiện dữ liệu học tập cũ trong trình duyệt (XP: ${localData.xp}). Đang tự động chuyển đổi dữ liệu lên SQLite...`);
                dataToUse = localData;
                this.state = { ...this.state, ...localData };
                
                // Bảo vệ môn học: Giữ lại subjects đầy đủ của server nếu cục bộ bị trống rỗng hoặc rỗng điểm Toán
                if (serverData && serverData.subjects) {
                    if (!this.state.subjects) this.state.subjects = {};
                    if (serverData.subjects.math && Object.keys(serverData.subjects.math.scores || {}).length > 0) {
                        this.state.subjects.math = serverData.subjects.math;
                    }
                    if (serverData.subjects.english && Object.keys(serverData.subjects.english.scores || {}).length > 0) {
                        this.state.subjects.english = serverData.subjects.english;
                    }
                }
                
                await this.saveProgress();
            } else if (serverData && Object.keys(serverData).length > 0) {
                dataToUse = serverData;
                this.state = { ...this.state, ...serverData };
            } else {
                await this.saveProgress();
            }

            if (dataToUse && Object.keys(dataToUse).length > 0) {
                if (!this.state.completedSubtopics || !Array.isArray(this.state.completedSubtopics)) this.state.completedSubtopics = [];
                if (!this.state.subtopicScores || typeof this.state.subtopicScores !== 'object') this.state.subtopicScores = {};
                if (!this.state.completedLessonTheory || !Array.isArray(this.state.completedLessonTheory)) this.state.completedLessonTheory = [];
                if (!this.state.badges || !Array.isArray(this.state.badges)) this.state.badges = [];
                if (!this.state.scores || typeof this.state.scores !== 'object') this.state.scores = {};
                if (!this.state.history || !Array.isArray(this.state.history)) this.state.history = [];

                // Migration: Xóa sạch toàn bộ video cũ ở phần kiến thức chung (chạy 1 lần)
                if (!this.state.cleanedOldTheoryVideos) {
                    if (this.state.customVideos) {
                        COURSE_DATA.forEach(chapter => {
                            chapter.lessons.forEach(lesson => {
                                // Nếu bài học có chia dạng bài
                                if (lesson.subtopics && lesson.subtopics.length > 0) {
                                    // Xóa video bài học chung (kiến thức chung)
                                    if (this.state.customVideos[lesson.id]) {
                                        delete this.state.customVideos[lesson.id];
                                    }
                                }
                            });
                        });
                    }
                    this.state.cleanedOldTheoryVideos = true;
                    await this.saveProgress();
                }

                // Migration: Sửa lỗi chấm sai do đáp án trùng lặp (chạy 1 lần)
                if (!this.state.migratedDuplicateAnswersV5) {
                    this.migrateDuplicateAnswers();
                }

                // Migration V6: Tự động chấm lại toàn bộ các câu trùng đáp án trong lịch sử
                if (!this.state.migratedDuplicateAnswersV6) {
                    this.migrateDuplicateAnswersV6();
                }

                // Migration V7: Tự động sửa lỗi chấm chẵn lẻ và sửa lời giải hiển thị trong lịch sử của bài hoán vị chữ số 3, 8, 0
                if (!this.state.migratedParityBugV7) {
                    this.migrateParityBugV7();
                }

                // Migration V11: Tự động sửa lỗi hiển thị giải thích điền số (Short Answer) bị chấm sai trong lịch sử
                if (!this.state.migratedShortAnswerBugV11) {
                    this.migrateShortAnswerBugV11();
                }

                // Migration V8: Tự động sửa lỗi hiển thị giải thích chi tiết trong lịch sử
                if (!this.state.migratedPregenBugsV8) {
                    this.migratePregenBugsV8();
                }

                // Migration V9: Tự động sửa lỗi hiển thị giải thích chi tiết trong lịch sử (bản sửa đổi regex spacing)
                if (!this.state.migratedPregenBugsV9) {
                    this.migratePregenBugsV9();
                }

                // Migration V10: Reset bài 6 & 7 do thiếu case "thu-tu-phep-tinh" gây sinh câu hỏi sai
                if (!this.state.migratedFixMissingThuTuPhepTinhV10) {
                    this.migrateFixMissingThuTuPhepTinh();
                }
            }
            this.restoreMathProgress();
            await this.saveProgress();
            this.setupSubjectStateProxies();
            try {
                await this.loadCustomTopics();
            } catch (vocabErr) {
                console.error("Lỗi load custom topics:", vocabErr);
            }
        } catch (e) {
            console.error("Lỗi đọc dữ liệu lưu trữ từ SQLite:", e);
            // Đảm bảo phục hồi trạng thái state mặc định để tránh crash toàn bộ ứng dụng
            this.state = { ...this.getDefaultState(), ...this.state };
            this.setupSubjectStateProxies();
        }
    },

    // Tải danh sách chuyên đề tự nạp & từ vựng của học sinh
    loadCustomTopics: async function() {
        const studentId = this.config.defaultStudentId || '';
        try {
            const [topicsRes, vocabRes] = await Promise.all([
                fetch(this.getApiUrl(`/api/custom-topics?studentId=${studentId}`)),
                fetch(this.getApiUrl(`/api/custom-vocabulary?studentId=${studentId}`))
            ]);
            
            if (topicsRes.ok) {
                this.customTopics = await topicsRes.json();
            } else {
                this.customTopics = [];
            }
            
            if (vocabRes.ok) {
                this.customVocabulary = await vocabRes.json();
            } else {
                this.customVocabulary = [];
            }
        } catch (e) {
            console.error("Lỗi khi tải custom topics/vocab cho học sinh:", e);
            this.customTopics = [];
            this.customVocabulary = [];
        }
    },

    // Ghi tiến trình vào SQLite (có Offline Fallback)
    saveProgress: async function() {
        if (this.isSavingProgress) {
            this.hasPendingSave = true;
            return;
        }
        this.isSavingProgress = true;
        this.hasPendingSave = false;
        this.state.lastUpdated = new Date().toISOString();
        
        const localKey = this.getLocalStorageKey();
        const classLevel = this.config.currentClass || '6';
        const studentId = this.config.defaultStudentId || '';

        // Luôn lưu trữ cục bộ trước để làm bản sao lưu an toàn
        try {
            localStorage.setItem(localKey, JSON.stringify(this.state));
        } catch (e) {
            console.warn("Không thể lưu bản sao lưu tiến trình vào localStorage:", e);
        }

        try {
            const res = await fetch(this.getApiUrl('/api/save-progress'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classLevel, studentId, studentName: this.config.studentName, state: this.state })
            });
            if (res.ok) {
                const data = await res.json();
                
                // Đồng bộ thành công -> Xóa cờ dirty offline
                localStorage.removeItem(localKey + "_offline_dirty");
                localStorage.removeItem(localKey + "_offline_data");

                // Đồng bộ lên Firebase Firestore nếu đã đăng nhập
                if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
                    try {
                        const auth = firebase.auth();
                        const db = firebase.firestore();
                        if (auth.currentUser) {
                            const parentUid = auth.currentUser.uid;
                            const name = this.config.studentName || (this.state.student && this.state.student.name) || "Học sinh";
                            db.collection('students').doc(studentId).set({
                                studentId: studentId,
                                parentUid: parentUid,
                                name: name,
                                classLevel: classLevel,
                                state_json: JSON.stringify(this.state),
                                lastUpdated: new Date().toISOString()
                            }).then(() => {
                                console.log(`⚡ [Firestore Client Sync] Đã đồng bộ tiến trình học sinh ${name} (${studentId}) lên đám mây.`);
                            }).catch(err => {
                                console.warn("⚠️ [Firestore Client Sync] Lỗi ghi Firestore:", err.message);
                            });
                        }
                    } catch (fbErr) {
                        console.warn("⚠️ [Firestore Client Sync] Lỗi khởi tạo/gọi Firestore Client:", fbErr.message);
                    }
                }

                if (data && data.state) {
                    if (!this.hasPendingSave) {
                        this.state = data.state;
                        this.setupSubjectStateProxies();
                    } else {
                        // Nếu có yêu cầu lưu mới đang chờ, chỉ cập nhật các thay đổi
                        // do server sinh ra (ví dụ: isAudited và câu hỏi đã làm sạch)
                        // để tránh đè mất các dữ liệu mới khác ở client
                        if (data.state.examSessions && this.state.examSessions) {
                            data.state.examSessions.forEach(serverSess => {
                                const clientSess = this.state.examSessions.find(s => s.id === serverSess.id);
                                if (clientSess) {
                                    clientSess.isAudited = serverSess.isAudited;
                                    clientSess.questions = serverSess.questions;
                                }
                            });
                        }
                    }
                }
            } else {
                // Server trả về lỗi (ví dụ 500 SQLITE_BUSY) -> Lưu offline dirty
                console.warn("[Offline Sync] Server không thể lưu dữ liệu, lưu offline để đồng bộ sau.");
                localStorage.setItem(localKey + "_offline_dirty", "true");
                localStorage.setItem(localKey + "_offline_data", JSON.stringify(this.state));
            }
        } catch (e) {
            console.error("Lỗi lưu progress vào SQLite, chuyển sang chế độ lưu offline:", e);
            localStorage.setItem(localKey + "_offline_dirty", "true");
            localStorage.setItem(localKey + "_offline_data", JSON.stringify(this.state));
        } finally {
            this.isSavingProgress = false;
            if (this.hasPendingSave) {
                this.saveProgress();
            }
        }
    },

    // Tự động sửa điểm và bù XP cho các câu bị chấm sai do lỗi trùng đáp án ở bản cũ
    migrateDuplicateAnswers: function() {
        const affectedTypes = ["tap-hop-d1", "tap-hop-d3", "tap-hop-d4", "ghi-so-tu-nhien", "ghi-so-tu-nhien-d1", "ghi-so-tu-nhien-d4", "luy-thua", "dau-hieu-chia-het"];
        let correctedCount = 0;
        
        // 1. Sửa đổi trong lịch sử làm bài tổng quát (history)
        if (this.state.history && this.state.history.length > 0) {
            this.state.history.forEach(item => {
                if (affectedTypes.includes(item.questionType) && !item.isCorrect) {
                    item.isCorrect = true;
                    correctedCount++;
                }
            });
        }

        // 2. Sửa đổi chi tiết trong lịch sử các lượt làm bài (examSessions)
        if (this.state.examSessions && this.state.examSessions.length > 0) {
            this.state.examSessions.forEach(session => {
                let sessionChanged = false;
                if (session.questions && session.questions.length > 0) {
                    session.questions.forEach(q => {
                        // Nếu câu hỏi thuộc dạng bị ảnh hưởng và học sinh làm sai
                        if (affectedTypes.includes(q.type) && q.userSelectedIndex !== q.correctIndex) {
                            // Kiểm tra xem text lựa chọn của học sinh có trùng khớp với đáp án đúng hay không
                            if (q.options && q.options[q.userSelectedIndex] && q.options[q.correctIndex]) {
                                // Hàm chuẩn hóa chuỗi: loại bỏ khoảng trắng, dấu $, dấu cách, LaTeX, v.v.
                                const clean = (s) => s.toString().replace(/[\$\s\{\}\\\.\,\-\_\'\"]/g, "").toLowerCase();
                                if (clean(q.options[q.userSelectedIndex]) === clean(q.options[q.correctIndex])) {
                                    q.userSelectedIndex = q.correctIndex; // Đặt lại index cho khớp (chuyển thành Đúng)
                                    session.correctCount++;
                                    sessionChanged = true;
                                    correctedCount++;
                                }
                            }
                        }
                    });
                }
                
                if (sessionChanged) {
                    // Tính toán lại điểm số phần trăm của lượt làm bài đó
                    session.scorePercent = Math.round((session.correctCount / session.totalQuestions) * 100);
                    
                    // Cập nhật lại điểm số cao nhất của bài học tương ứng
                    const oldScore = this.state.scores[session.lessonId] || 0;
                    if (session.scorePercent > oldScore) {
                        this.state.scores[session.lessonId] = session.scorePercent;
                    }
                }
            });
        }
        
        // 3. Khôi phục điểm số trên Lộ trình Luyện tập & Khắc phục Điểm yếu
        if (typeof COURSE_DATA !== "undefined") {
            COURSE_DATA.forEach(chapter => {
                chapter.lessons.forEach(lesson => {
                    // Chỉ cập nhật nếu bài học này đã thực sự được làm (có lịch sử trong examSessions)
                    const hasSession = this.state.examSessions && this.state.examSessions.some(s => s.lessonId === lesson.id);
                    if (!hasSession) return;

                    // Nếu bài học chính có questionType bị ảnh hưởng
                    if (affectedTypes.includes(lesson.questionType)) {
                        this.state.scores[lesson.id] = 100;
                    }
                    // Duyệt các dạng bài con (subtopics) để cập nhật subtopicScores
                    if (lesson.subtopics && lesson.subtopics.length > 0) {
                        lesson.subtopics.forEach(sub => {
                            if (affectedTypes.includes(sub.questionType)) {
                                this.state.subtopicScores[sub.id] = 100;
                                if (!this.state.completedSubtopics.includes(sub.id)) {
                                    this.state.completedSubtopics.push(sub.id);
                                }
                                this.state.scores[lesson.id] = 100; // Đặt điểm bài học lên 100%
                            }
                        });
                    }
                });
            });
        }
        
        // 4. Cộng bù điểm XP
        if (correctedCount > 0) {
            this.state.xp += Math.round(correctedCount * 10);
        }
        
        this.state.migratedDuplicateAnswersV5 = true;
        this.saveProgress();
        console.log(`[Migration V5] Đã tự động khôi phục điểm số trên Lộ trình Luyện tập cho các dạng bài bị ảnh hưởng.`);
    },

    migrateDuplicateAnswersV6: function() {
        let correctedCount = 0;
        
        // Hàm chuẩn hóa chuỗi: loại bỏ khoảng trắng, dấu $, dấu cách, LaTeX, v.v.
        const clean = (s) => s.toString().replace(/[\$\s\{\}\\\.\,\-\_\'\"]/g, "").toLowerCase();
        
        // 1. Quét và sửa đổi chi tiết trong lịch sử các lượt làm bài (examSessions)
        if (this.state.examSessions && this.state.examSessions.length > 0) {
            this.state.examSessions.forEach(session => {
                let sessionChanged = false;
                if (session.questions && session.questions.length > 0) {
                    session.questions.forEach((q, qIdx) => {
                        // Nếu học sinh làm sai
                        if (q.userSelectedIndex !== undefined && q.correctIndex !== undefined && q.userSelectedIndex !== q.correctIndex) {
                            if (q.options && q.options[q.userSelectedIndex] && q.options[q.correctIndex]) {
                                // Rút trích nội dung đáp án (loại bỏ A. B. C. D.)
                                const userOptClean = clean(q.options[q.userSelectedIndex].replace(/^[A-D][\.\)\:\-\s]+/i, ''));
                                const correctOptClean = clean(q.options[q.correctIndex].replace(/^[A-D][\.\)\:\-\s]+/i, ''));
                                
                                // Nếu nội dung đáp án học sinh chọn giống hệt đáp án đúng (do lỗi trùng đáp án)
                                if (userOptClean === correctOptClean) {
                                    q.userSelectedIndex = q.correctIndex; // Chuyển đáp án học sinh chọn thành đúng
                                    session.correctCount++;
                                    sessionChanged = true;
                                    correctedCount++;
                                    
                                    // Tìm và sửa trong lịch sử làm bài tổng quát (history) nếu có bản ghi tương ứng
                                    if (this.state.history && this.state.history.length > 0) {
                                        const histItem = this.state.history.find(h => 
                                            h.lessonId === session.lessonId && 
                                            clean(h.questionText || '') === clean(q.questionText || '') &&
                                            !h.isCorrect
                                        );
                                        if (histItem) {
                                            histItem.isCorrect = true;
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
                
                if (sessionChanged) {
                    // Tính toán lại điểm số phần trăm của lượt làm bài đó
                    session.scorePercent = Math.round((session.correctCount / session.totalQuestions) * 100);
                    
                    // Cập nhật lại điểm số cao nhất của bài học tương ứng
                    const oldScore = this.state.scores[session.lessonId] || 0;
                    if (session.scorePercent > oldScore) {
                        this.state.scores[session.lessonId] = session.scorePercent;
                    }
                }
            });
        }
        
        // 2. Cộng bù điểm XP
        if (correctedCount > 0) {
            this.state.xp = (this.state.xp || 0) + Math.round(correctedCount * 10);
        }
        
        this.state.migratedDuplicateAnswersV6 = true;
        this.saveProgress();
        console.log(`[Migration V6] Đã tự động khôi phục và chấm lại ${correctedCount} câu hỏi bị lỗi trùng đáp án trong lịch sử.`);
    },

    migrateShortAnswerBugV11: function() {
        let correctedCount = 0;
        if (this.state.examSessions && this.state.examSessions.length > 0) {
            this.state.examSessions.forEach(session => {
                let sessionChanged = false;
                if (session.questions && session.questions.length > 0) {
                    const is18QuestExam = session.totalQuestions === 18;
                    
                    if (is18QuestExam) {
                        let mcqCorrectCount = 0;
                        session.questions.forEach((q, idx) => {
                            if (idx < 12) {
                                if (q.userSelectedIndex === q.correctIndex) {
                                    mcqCorrectCount++;
                                }
                            }
                        });
                        
                        const saCorrectCountNeeded = session.correctCount - mcqCorrectCount;
                        let saCorrectAllocated = 0;

                        session.questions.forEach((q, idx) => {
                            if (idx >= 12) {
                                if (q.isShortAnswer === undefined || q.isShortAnswer === false) {
                                    q.isShortAnswer = true;
                                    sessionChanged = true;
                                }
                                
                                if (q.isCorrect === undefined) {
                                    if (saCorrectAllocated < saCorrectCountNeeded) {
                                        q.isCorrect = true;
                                        q.userShortAnswer = q.options[q.correctIndex] || "";
                                        saCorrectAllocated++;
                                    } else {
                                        q.isCorrect = false;
                                        q.userShortAnswer = "---";
                                    }
                                    sessionChanged = true;
                                    correctedCount++;
                                }
                            }
                        });
                    } else {
                        session.questions.forEach(q => {
                            if (q.isShortAnswer && q.isCorrect === undefined) {
                                q.isCorrect = (q.userShortAnswer !== undefined && q.userShortAnswer !== "") ? 
                                    (q.userShortAnswer === q.options[q.correctIndex]) : false;
                                sessionChanged = true;
                            }
                        });
                    }
                }
            });
        }
        
        this.state.migratedShortAnswerBugV11 = true;
        this.saveProgress();
        console.log(`[Migration V11] Đã khôi phục hiển thị chính xác kết quả đúng/sai cho ${correctedCount} câu hỏi điền số trong lịch sử.`);
    },

    migrateParityBugV7: function() {
        let correctedCount = 0;
        
        // 1. Duyệt qua các examSessions để tìm câu hỏi bị lỗi
        if (this.state.examSessions && this.state.examSessions.length > 0) {
            this.state.examSessions.forEach(session => {
                let sessionChanged = false;
                if (session.questions && session.questions.length > 0) {
                    session.questions.forEach(q => {
                        // Kiểm tra câu hỏi hoán vị chẵn/lẻ với chữ số 3, 8, 0 cụ thể
                        const isTargetQuestion = q.questionText && 
                            q.questionText.includes("3, 8, 0") && 
                            q.questionText.includes("số chẵn") && 
                            q.questionText.includes("3 chữ số");
                            
                        if (isTargetQuestion) {
                            // Sửa lỗi hiển thị giải thích bằng cách thay thế các chuỗi code thô
                            if (q.solutionHtml) {
                                q.solutionHtml = q.solutionHtml.replace(
                                    /\$\{allPermutations\.map\([\s\S]*?\)\.join\(\', \'\)\}/g,
                                    "$308$, $380$, $803$, $830$"
                                );
                                q.solutionHtml = q.solutionHtml.replace(
                                    /\$\{filteredPerms\.map\([\s\S]*?\)\.join\(\', \'\)\}/g,
                                    "$308$, $380$, $830$"
                                );
                                q.solutionHtml = q.solutionHtml.replace(
                                    /Số nhỏ nhất trong các số chẵn này là 803\./g,
                                    "Số nhỏ nhất trong các số chẵn này là 308."
                                );
                                q.solutionHtml = q.solutionHtml.replace(
                                    /Đáp án đúng là B\./g,
                                    "Đáp án đúng là C."
                                );
                            }

                            // Sửa lại đáp án đúng
                            // Trong options: index 1 là 803 (B), index 2 là 308 (C)
                            // Ta cần đổi correctIndex từ 1 sang 2
                            if (q.correctIndex === 1) {
                                q.correctIndex = 2;
                                
                                // Nếu học sinh đã chọn C (index 2), đổi từ Sai thành Đúng
                                if (q.userSelectedIndex === 2) {
                                    session.correctCount++;
                                    sessionChanged = true;
                                    correctedCount++;
                                    
                                    // Sửa trong lịch sử làm bài tổng quát (history)
                                    if (this.state.history && this.state.history.length > 0) {
                                        const histItem = this.state.history.find(h => 
                                            h.lessonId === session.lessonId && 
                                            !h.isCorrect
                                        );
                                        if (histItem) {
                                            histItem.isCorrect = true;
                                        }
                                    }
                                }
                            }
                        }
                    });
                }
                
                if (sessionChanged) {
                    // Tính lại điểm phần trăm
                    session.scorePercent = Math.round((session.correctCount / session.totalQuestions) * 100);
                    
                    // Cập nhật điểm cao nhất của bài học tương ứng
                    const oldScore = this.state.scores[session.lessonId] || 0;
                    if (session.scorePercent > oldScore) {
                        this.state.scores[session.lessonId] = session.scorePercent;
                    }
                }
            });
        }
        
        // 2. Cộng bù điểm XP
        if (correctedCount > 0) {
            this.state.xp = (this.state.xp || 0) + Math.round(correctedCount * 10);
        }
        
        this.state.migratedParityBugV7 = true;
        this.saveProgress();
        console.log(`[Migration V7] Đã khắc phục lịch sử lời giải và khôi phục điểm cho ${correctedCount} lượt làm bài.`);
    },

    migratePregenBugsV8: function() {
        let correctedCount = 0;
        if (this.state.examSessions && this.state.examSessions.length > 0) {
            this.state.examSessions.forEach(session => {
                let sessionChanged = false;
                if (session.questions && session.questions.length > 0) {
                    session.questions.forEach(q => {
                        let qChanged = false;
                        if (!q.solutionHtml) return;

                        // 1. Sửa lỗi Dạng 1: "Thỏa mãn 3 điều kiện"
                        if (q.solutionHtml.includes("thỏa mãn 3 điều kiện")) {
                            const original = q.solutionHtml;
                            // Sửa $X > 48 và $X < 75 $
                            q.solutionHtml = q.solutionHtml.replace(/\$X\s*>\s*(\d+)\s+và\s+\$X\s*<\s*(\d+)\s*\$?/g, "$X > $1$ và $X < $2$");
                            // Sửa tức là $X \in \{$49, ..., $74\}$.
                            q.solutionHtml = q.solutionHtml.replace(/tức là \$X\s*\\in\s*\\\{\$/g, "tức là $X \\in \\{");
                            q.solutionHtml = q.solutionHtml.replace(/tức là \$X\s*\\in\s*\\\{\\\{\$/g, "tức là $X \\in \\{");
                            q.solutionHtml = q.solutionHtml.replace(/,\s*\.\.\.,\s*\$/g, ", ..., ");
                            // Sửa cận dưới: - Cận dưới chung: $\text{max}($49, 54) = 54.
                            q.solutionHtml = q.solutionHtml.replace(/-\s*Cận dưới chung:\s*\$\\text\{max\}\(\$?(\d+),\s*\$?(\d+)\)\s*=\s*(\d+)\.?/g, "- Cận dưới chung: $\\text{max}($1, $2) = $3$.");
                            // Sửa cận trên: - Cận trên chung: $\text{min}(74, 74) = 74.
                            q.solutionHtml = q.solutionHtml.replace(/-\s*Cận trên chung:\s*\$\\text\{min\}\(\$?(\d+),\s*\$?(\d+)\)\s*=\s*(\d+)\.?/g, "- Cận trên chung: $\\text{min}($1, $2) = $3$.");
                            // Sửa Vậy, X phải thỏa mãn 54 \le X \le 74.
                            q.solutionHtml = q.solutionHtml.replace(/Vậy,\s*X\s*phải\s*thỏa\s*mãn\s*(\d+)\s*(?:\\le|\\\\le)\s*X\s*(?:\\le|\\\\le)\s*(\d+)\.?/g, "Vậy, $X$ phải thỏa mãn $$1 \\le X \\le $2$.");
                            // Sửa Liệt kê và kiểm tra: 54, $55, ..., 74.
                            q.solutionHtml = q.solutionHtml.replace(/Liệt kê\s*và\s*kiểm\s*tra:\s*(\d+),\s*\$(\d+),\s*\.\.\.,\s*(\d+)\.?/g, "Liệt kê và kiểm tra: $$1, $2, ..., $3$.");

                            if (q.solutionHtml !== original) qChanged = true;
                        }

                        // 2. Sửa lỗi Dạng 2: "bội của multipleOf"
                        if (q.solutionHtml.includes("là bội của") && q.solutionHtml.includes("dãy số cách đều")) {
                            const original = q.solutionHtml;
                            // Sửa sao cho 73 \le x \le 158
                            q.solutionHtml = q.solutionHtml.replace(/sao cho\s*(\d+)\s*(?:\\le|\\\\le)\s*x\s*(?:\\le|\\\\le)\s*(\d+)/g, "sao cho $$1 \\le x \\le $2$");
                            // Sửa Bội số đầu tiên... là $x_\text{min} = 75.
                            q.solutionHtml = q.solutionHtml.replace(/là\s*\$x_\\?(?:text)?\{min\}\s*=\s*(\d+)/g, "là $x_\\text{min} = $1$");
                            // Sửa Bội số cuối cùng... là $x_\text{max} = 156.
                            q.solutionHtml = q.solutionHtml.replace(/là\s*\$x_\\?(?:text)?\{max\}\s*=\s*(\d+)/g, "là $x_\\text{max} = $1$");
                            // Sửa $(156 - 75) / 3 + 1 = 28 số.
                            q.solutionHtml = q.solutionHtml.replace(/\$\((\d+)\s*-\s*(\d+)\)\s*\/\s*(\d+)\s*\+\s*1\s*=\s*(\d+)\s*số/g, "$($1 - $2) / $3 + 1 = $4$ số");

                            if (q.solutionHtml !== original) qChanged = true;
                        }

                        // 3. Sửa lỗi Dạng 3 & 5 & Dạng bài hoán vị chữ số (allPermutations / filteredPerms un-evaluated)
                        if (q.solutionHtml.includes("Các số có 3 chữ số có thể tạo thành là") && q.questionText) {
                            const original = q.solutionHtml;
                            const matchDigits = q.questionText.match(/chữ số\s*:?\s*(\d+),\s*(\d+),\s*(\d+)/);
                            if (matchDigits) {
                                const d1 = parseInt(matchDigits[1]);
                                const d2 = parseInt(matchDigits[2]);
                                const d3 = parseInt(matchDigits[3]);
                                const isEven = q.questionText.includes("số chẵn") ? 1 : 0;
                                const parityText = isEven ? "chẵn" : "lẻ";

                                // Tính lại allPermutations
                                const perms = [];
                                if (d1 !== 0) perms.push(d1 * 100 + d2 * 10 + d3, d1 * 100 + d3 * 10 + d2);
                                if (d2 !== 0) perms.push(d2 * 100 + d1 * 10 + d3, d2 * 100 + d3 * 10 + d1);
                                if (d3 !== 0) perms.push(d3 * 100 + d1 * 10 + d2, d3 * 100 + d2 * 10 + d1);
                                const allPerms = Array.from(new Set(perms)).sort((a,b)=>a-b);
                                
                                // Tính lại filteredPerms (lọc chẵn/lẻ)
                                const filtPerms = allPerms.filter(num => (isEven ? (num % 2 === 0) : (num % 2 !== 0)));
                                const ansVal = Math.min(...filtPerms);

                                const allPermsText = allPerms.map(num => '$' + num + '$').join(', ');
                                const filtPermsText = filtPerms.map(num => '$' + num + '$').join(', ');

                                // Thay thế template thô
                                q.solutionHtml = q.solutionHtml.replace(/\$\{allPermutations\.map\([\s\S]*?\)\.join\(\', \'\)\}/g, allPermsText);
                                q.solutionHtml = q.solutionHtml.replace(/\$\{filteredPerms\.map\([\s\S]*?\)\.join\(\', \'\)\}/g, filtPermsText);
                                q.solutionHtml = q.solutionHtml.replace(/\{allPermutationsText\}/g, allPermsText);
                                q.solutionHtml = q.solutionHtml.replace(/\{filteredPermsText\}/g, filtPermsText);
                                q.solutionHtml = q.solutionHtml.replace(/\{parityText\}/g, parityText);
                                q.solutionHtml = q.solutionHtml.replace(/\{ans\}/g, ansVal);
                                q.solutionHtml = q.solutionHtml.replace(/\{d1\}/g, d1).replace(/\{d2\}/g, d2).replace(/\{d3\}/g, d3);

                                // Sửa lại số nhỏ nhất nếu bị sai số do lỗi chẵn/lẻ
                                const minTextRegex = new RegExp("Số nhỏ nhất trong các số " + parityText + " này là (\\d+)", "g");
                                q.solutionHtml = q.solutionHtml.replace(minTextRegex, "Số nhỏ nhất trong các số " + parityText + " này là " + ansVal);

                                if (q.solutionHtml !== original) qChanged = true;
                            }
                        }

                        // 4. Sửa lỗi Dạng 4: Hộp vật phẩm (allBoxes.filter...)
                        if (q.solutionHtml.includes("Các loại hộp có thể tích lớn hơn") && q.questionText) {
                            const original = q.solutionHtml;
                            // Trích xuất itemSize từ câu hỏi
                            const matchItem = q.questionText.match(/thể tích là (\d+)/);
                            const matchBoxes = q.questionText.match(/thể tích sau:\s*(\d+)\s*cm³,\s*(\d+)\s*cm³,\s*(\d+)\s*cm³,\s*(\d+)\s*cm³/);
                            if (matchItem && matchBoxes) {
                                const itemSize = parseInt(matchItem[1]);
                                const boxes = [
                                    parseInt(matchBoxes[1]),
                                    parseInt(matchBoxes[2]),
                                    parseInt(matchBoxes[3]),
                                    parseInt(matchBoxes[4])
                                ];
                                const sortedAvailable = boxes.filter(b => b > itemSize).sort((a,b)=>a-b);
                                const choicesText = sortedAvailable.map(b => b + ' cm³').join(', ');
                                const ansVal = sortedAvailable[0];

                                // Thay thế template thô
                                q.solutionHtml = q.solutionHtml.replace(/\$\{allBoxes\.filter\([\s\S]*?\)\}/g, choicesText);
                                q.solutionHtml = q.solutionHtml.replace(/\{boxChoicesText\}/g, choicesText);
                                q.solutionHtml = q.solutionHtml.replace(/\{itemSize\}/g, itemSize);
                                q.solutionHtml = q.solutionHtml.replace(/\{ans\}/g, ansVal);

                                if (q.solutionHtml !== original) qChanged = true;
                            }
                        }

                        if (qChanged) {
                            sessionChanged = true;
                            correctedCount++;
                        }
                    });
                }
            });
        }

        this.state.migratedPregenBugsV8 = true;
        this.saveProgress();
        console.log(`[Migration V8] Đã sửa lỗi hiển thị giải thích chi tiết cho ${correctedCount} câu hỏi trong lịch sử.`);
    },

    migratePregenBugsV9: function() {
        let correctedCount = 0;
        if (this.state.examSessions && this.state.examSessions.length > 0) {
            this.state.examSessions.forEach(session => {
                let sessionChanged = false;
                if (session.questions && session.questions.length > 0) {
                    session.questions.forEach(q => {
                        let qChanged = false;
                        if (!q.solutionHtml) return;

                        // 1. Sửa lỗi Dạng 1: "Thỏa mãn 3 điều kiện"
                        if (q.solutionHtml.includes("thỏa mãn 3 điều kiện")) {
                            const original = q.solutionHtml;
                            // Sửa $X > 48 và $X < 75 $
                            q.solutionHtml = q.solutionHtml.replace(/\$X\s*>\s*(\d+)\s+và\s+\$X\s*<\s*(\d+)\s*\$?/g, "$X > $1$ và $X < $2$");
                            // Sửa tức là $X \in \{$49, ..., $74\}$.
                            q.solutionHtml = q.solutionHtml.replace(/tức là \$X\s*\\in\s*\\\{\$/g, "tức là $X \\in \\{");
                            q.solutionHtml = q.solutionHtml.replace(/tức là \$X\s*\\in\s*\\\{\\\{\$/g, "tức là $X \\in \\{");
                            q.solutionHtml = q.solutionHtml.replace(/,\s*\.\.\.,\s*\$/g, ", ..., ");
                            // Sửa cận dưới: - Cận dưới chung: $\text{max}($49, 54) = 54.
                            q.solutionHtml = q.solutionHtml.replace(/-\s*Cận dưới chung:\s*\$\\text\{max\}\(\$?(\d+),\s*\$?(\d+)\)\s*=\s*(\d+)\.?/g, "- Cận dưới chung: $\\text{max}($1, $2) = $3$.");
                            // Sửa cận trên: - Cận trên chung: $\text{min}(74, 74) = 74.
                            q.solutionHtml = q.solutionHtml.replace(/-\s*Cận trên chung:\s*\$\\text\{min\}\(\$?(\d+),\s*\$?(\d+)\)\s*=\s*(\d+)\.?/g, "- Cận trên chung: $\\text{min}($1, $2) = $3$.");
                            // Sửa Vậy, X phải thỏa mãn 54 \le X \le 74.
                            q.solutionHtml = q.solutionHtml.replace(/Vậy,\s*X\s*phải\s*thỏa\s*mãn\s*(\d+)\s*(?:\\le|\\\\le)\s*X\s*(?:\\le|\\\\le)\s*(\d+)\.?/g, "Vậy, $X$ phải thỏa mãn $$1 \\le X \\le $2$.");
                            // Sửa Liệt kê và kiểm tra: 54, $55, ..., 74.
                            q.solutionHtml = q.solutionHtml.replace(/Liệt kê\s*và\s*kiểm\s*tra:\s*(\d+),\s*\$(\d+),\s*\.\.\.,\s*(\d+)\.?/g, "Liệt kê và kiểm tra: $$1, $2, ..., $3$.");

                            if (q.solutionHtml !== original) qChanged = true;
                        }

                        // 2. Sửa lỗi Dạng 2: "bội của multipleOf"
                        if (q.solutionHtml.includes("là bội của") && q.solutionHtml.includes("dãy số cách đều")) {
                            const original = q.solutionHtml;
                            // Sửa sao cho 73 \le x \le 158
                            q.solutionHtml = q.solutionHtml.replace(/sao cho\s*(\d+)\s*(?:\\le|\\\\le)\s*x\s*(?:\\le|\\\\le)\s*(\d+)/g, "sao cho $$1 \\le x \\le $2$");
                            // Sửa Bội số đầu tiên... là $x_\text{min} = 75.
                            q.solutionHtml = q.solutionHtml.replace(/là\s*\$x_\\?(?:text)?\{min\}\s*=\s*(\d+)/g, "là $x_\\text{min} = $1$");
                            // Sửa Bội số cuối cùng... là $x_\text{max} = 156.
                            q.solutionHtml = q.solutionHtml.replace(/là\s*\$x_\\?(?:text)?\{max\}\s*=\s*(\d+)/g, "là $x_\\text{max} = $1$");
                            // Sửa $(156 - 75) / 3 + 1 = 28 số.
                            q.solutionHtml = q.solutionHtml.replace(/\$\((\d+)\s*-\s*(\d+)\)\s*\/\s*(\d+)\s*\+\s*1\s*=\s*(\d+)\s*số/g, "$($1 - $2) / $3 + 1 = $4$ số");

                            if (q.solutionHtml !== original) qChanged = true;
                        }

                        // 3. Sửa lỗi Dạng 3 & 5 & Dạng bài hoán vị chữ số (allPermutations / filteredPerms un-evaluated)
                        if (q.solutionHtml.includes("Các số có 3 chữ số có thể tạo thành là") && q.questionText) {
                            const original = q.solutionHtml;
                            const matchDigits = q.questionText.match(/chữ số\s*:?\s*(\d+),\s*(\d+),\s*(\d+)/);
                            if (matchDigits) {
                                const d1 = parseInt(matchDigits[1]);
                                const d2 = parseInt(matchDigits[2]);
                                const d3 = parseInt(matchDigits[3]);
                                const isEven = q.questionText.includes("số chẵn") ? 1 : 0;
                                const parityText = isEven ? "chẵn" : "lẻ";

                                // Tính lại allPermutations
                                const perms = [];
                                if (d1 !== 0) perms.push(d1 * 100 + d2 * 10 + d3, d1 * 100 + d3 * 10 + d2);
                                if (d2 !== 0) perms.push(d2 * 100 + d1 * 10 + d3, d2 * 100 + d3 * 10 + d1);
                                if (d3 !== 0) perms.push(d3 * 100 + d1 * 10 + d2, d3 * 100 + d2 * 10 + d1);
                                const allPerms = Array.from(new Set(perms)).sort((a,b)=>a-b);
                                
                                // Tính lại filteredPerms (lọc chẵn/lẻ)
                                const filtPerms = allPerms.filter(num => (isEven ? (num % 2 === 0) : (num % 2 !== 0)));
                                const ansVal = Math.min(...filtPerms);

                                const allPermsText = allPerms.map(num => '$' + num + '$').join(', ');
                                const filtPermsText = filtPerms.map(num => '$' + num + '$').join(', ');

                                // Thay thế template thô
                                q.solutionHtml = q.solutionHtml.replace(/\$\{allPermutations\.map\([\s\S]*?\)\.join\([\s\S]*?\)\}/g, allPermsText);
                                q.solutionHtml = q.solutionHtml.replace(/\$\{filteredPerms\.map\([\s\S]*?\)\.join\([\s\S]*?\)\}/g, filtPermsText);
                                q.solutionHtml = q.solutionHtml.replace(/\{allPermutationsText\}/g, allPermsText);
                                q.solutionHtml = q.solutionHtml.replace(/\{filteredPermsText\}/g, filtPermsText);
                                q.solutionHtml = q.solutionHtml.replace(/\{parityText\}/g, parityText);
                                q.solutionHtml = q.solutionHtml.replace(/\{ans\}/g, ansVal);
                                q.solutionHtml = q.solutionHtml.replace(/\{d1\}/g, d1).replace(/\{d2\}/g, d2).replace(/\{d3\}/g, d3);

                                // Sửa lại số nhỏ nhất nếu bị sai số do lỗi chẵn/lẻ
                                const minTextRegex = new RegExp("Số nhỏ nhất trong các số " + parityText + " này là (\\d+)", "g");
                                q.solutionHtml = q.solutionHtml.replace(minTextRegex, "Số nhỏ nhất trong các số " + parityText + " này là " + ansVal);

                                if (q.solutionHtml !== original) qChanged = true;
                            }
                        }

                        // 4. Sửa lỗi Dạng 4: Hộp vật phẩm (allBoxes.filter...)
                        if (q.solutionHtml.includes("Các loại hộp có thể tích lớn hơn") && q.questionText) {
                            const original = q.solutionHtml;
                            // Trích xuất itemSize từ câu hỏi
                            const matchItem = q.questionText.match(/thể tích là (\d+)/);
                            const matchBoxes = q.questionText.match(/thể tích sau:\s*(\d+)\s*cm³,\s*(\d+)\s*cm³,\s*(\d+)\s*cm³,\s*(\d+)\s*cm³/);
                            if (matchItem && matchBoxes) {
                                const itemSize = parseInt(matchItem[1]);
                                const boxes = [
                                    parseInt(matchBoxes[1]),
                                    parseInt(matchBoxes[2]),
                                    parseInt(matchBoxes[3]),
                                    parseInt(matchBoxes[4])
                                ];
                                const sortedAvailable = boxes.filter(b => b > itemSize).sort((a,b)=>a-b);
                                const choicesText = sortedAvailable.map(b => b + ' cm³').join(', ');
                                const ansVal = sortedAvailable[0];

                                // Thay thế template thô
                                q.solutionHtml = q.solutionHtml.replace(/\$\{allBoxes\.filter\([\s\S]*?join\([\s\S]*?\)\}/g, choicesText);
                                q.solutionHtml = q.solutionHtml.replace(/\{boxChoicesText\}/g, choicesText);
                                q.solutionHtml = q.solutionHtml.replace(/\{itemSize\}/g, itemSize);
                                q.solutionHtml = q.solutionHtml.replace(/\{ans\}/g, ansVal);

                                if (q.solutionHtml !== original) qChanged = true;
                            }
                        }

                        if (qChanged) {
                            sessionChanged = true;
                            correctedCount++;
                        }
                    });
                }
            });
        }

        this.state.migratedPregenBugsV9 = true;
        this.saveProgress();
        console.log(`[Migration V9] Đã sửa lỗi hiển thị giải thích chi tiết cho ${correctedCount} câu hỏi trong lịch sử.`);
    },

    // Migration V10: Reset trạng thái bài 6 & 7 do trước đây thiếu case "thu-tu-phep-tinh"
    // khiến Spaced Repetition sinh câu hỏi sai (default "x+5=2"). Xoá session lỗi, reset điểm.
    migrateFixMissingThuTuPhepTinh: function() {
        // Danh sách bài bị ảnh hưởng: bai-6 (luy-thua) bị SR lấy câu sai khi bai-7 đã hoàn thành
        // và bai-7 (thu-tu-phep-tinh) không có câu hỏi đúng chủ đề
        const affectedLessonIds = ["bai-6", "bai-7"];
        const brokenQuestionMarker = "Tìm số nguyên $x$, biết"; // câu hỏi default bị sinh lỗi
        let resetCount = 0;
        let removedSessionCount = 0;

        // 1. Xoá bỏ các examSessions có chứa câu hỏi bị lỗi (default case)
        // Mở rộng: cũng kiểm tra luyện tập chung chương 1 và kiểm tra cuối chương 1
        const affectedSessionLessonIds = [...affectedLessonIds, "lt-c1-1", "lt-c1-2", "kt-c1"];
        if (this.state.examSessions && this.state.examSessions.length > 0) {
            const originalLength = this.state.examSessions.length;
            this.state.examSessions = this.state.examSessions.filter(session => {
                // Giữ lại session không thuộc bài bị ảnh hưởng
                if (!affectedSessionLessonIds.includes(session.lessonId)) return true;
                // Với session thuộc bài bị ảnh hưởng: kiểm tra có câu lỗi không
                const hasBrokenQuestion = session.questions && session.questions.some(q =>
                    q.questionText && q.questionText.includes(brokenQuestionMarker)
                );
                if (hasBrokenQuestion) {
                    removedSessionCount++;
                    return false; // Xoá session lỗi
                }
                return true;
            });
        }

        // 2. Reset điểm, subtopicScores, completedSubtopics cho bài bị ảnh hưởng
        affectedLessonIds.forEach(lessonId => {
            // Reset điểm bài học nếu đang tồn tại
            if (this.state.scores && this.state.scores[lessonId] !== undefined) {
                delete this.state.scores[lessonId];
                resetCount++;
            }
            // Reset điểm các dạng bài (subtopics) của bài bị ảnh hưởng
            if (this.state.subtopicScores) {
                const subtopicKeys = Object.keys(this.state.subtopicScores).filter(k => k.startsWith(lessonId + "-"));
                subtopicKeys.forEach(k => {
                    delete this.state.subtopicScores[k];
                    resetCount++;
                });
            }
            // Xoá khỏi danh sách completedSubtopics
            if (this.state.completedSubtopics) {
                this.state.completedSubtopics = this.state.completedSubtopics.filter(id => !id.startsWith(lessonId + "-"));
            }
        });

        // 3. Xoá history (kết quả câu hỏi) của các câu lỗi thuộc bài bị ảnh hưởng
        if (this.state.history && this.state.history.length > 0) {
            const beforeHistory = this.state.history.length;
            this.state.history = this.state.history.filter(item => {
                if (!affectedLessonIds.includes(item.lessonId)) return true;
                // Giữ lại lịch sử câu hỏi đúng chủ đề (luy-thua, thu-tu-phep-tinh)
                if (item.questionType === "luy-thua" || item.questionType === "thu-tu-phep-tinh") return true;
                // Xoá lịch sử câu hỏi không đúng chủ đề (số nguyên, v.v.)
                return false;
            });
        }

        this.state.migratedFixMissingThuTuPhepTinhV10 = true;
        this.saveProgress();
        if (resetCount > 0 || removedSessionCount > 0) {
            console.log(`[Migration V10] Đã reset ${resetCount} điểm số và xoá ${removedSessionCount} lượt làm bài lỗi của bài 6 & 7. Học sinh có thể làm lại với câu hỏi đúng chủ đề.`);
        } else {
            console.log(`[Migration V10] Kiểm tra hoàn tất. Không tìm thấy dữ liệu lỗi cần reset.`);
        }
    },

    // Kiểm tra và cập nhật Streak (chuỗi ngày học liên tục)
    checkStreak: function() {
        const todayStr = new Date().toDateString();
        
        // Đảm bảo learningTimeWeek luôn được khởi tạo
        if (!this.state.learningTimeWeek) {
            this.state.learningTimeWeek = [0, 0, 0, 0, 0, 0, 0];
        }

        const getMondayOfWeek = (d) => {
            const date = new Date(d);
            const day = date.getDay();
            const diff = date.getDate() - (day === 0 ? 6 : day - 1);
            const monday = new Date(date.setDate(diff));
            monday.setHours(0,0,0,0);
            return monday;
        };

        if (!this.state.lastActiveDate) {
            this.state.streak = 1;
            this.state.lastActiveDate = todayStr;
        } else {
            const lastActive = new Date(this.state.lastActiveDate);
            const today = new Date(todayStr);

            // Tự động kiểm tra và reset thời gian học trong tuần nếu bước sang tuần mới
            const mondayLastActive = getMondayOfWeek(lastActive);
            const mondayToday = getMondayOfWeek(today);
            if (mondayLastActive.toDateString() !== mondayToday.toDateString()) {
                console.log("[Gamification] Phát hiện tuần học mới. Đang tự động reset thời gian học trong tuần...");
                this.state.learningTimeWeek = [0, 0, 0, 0, 0, 0, 0];
            }

            const diffTime = today - lastActive;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Ngày tiếp theo liên tục
                this.state.streak += 1;
                this.state.lastActiveDate = todayStr;
                
                // Kiểm tra huy hiệu Streak 3
                if (this.state.streak >= 3) {
                    this.unlockBadge("streak-3");
                }
            } else if (diffDays > 1) {
                // Đứt streak, reset về 1
                this.state.streak = 1;
                this.state.lastActiveDate = todayStr;
            }
            // Nếu diffDays === 0 thì giữ nguyên streak trong ngày
        }
        this.saveProgress();
    },

    // Lấy danh sách các bài học đã hoàn thành (score >= 80%)
    getCompletedLessons: function() {
        const list = [];
        for (const lessonId in this.state.scores) {
            if (this.state.scores[lessonId] >= 80) {
                list.push(lessonId);
            }
        }
        return list;
    },

    // Lấy trạng thái của một bài học (locked, active, completed)
    getLessonStatus: function(lessonId) {
        const currentClass = this.config.currentClass || "6";
        const flatLessons = [];
        COURSE_DATA
            .filter(chapter => (chapter.class || "6") === currentClass && (chapter.subject || "math") === (this.currentSubject || "math"))
            .forEach(chapter => {
                chapter.lessons.forEach(l => flatLessons.push(l.id));
            });

        const idx = flatLessons.indexOf(lessonId);
        if (idx === -1) return 'locked';

        if (idx === 0) {
            // Bài đầu tiên luôn được mở khóa
            const score = this.state.scores[lessonId] || 0;
            return score >= 80 ? 'completed' : 'active';
        }

        // Duyệt tuyến tính từ đầu lộ trình đến bài học hiện tại để xác định trạng thái mở khóa chính xác
        let currentStatus = 'completed';
        for (let i = 0; i <= idx; i++) {
            const lid = flatLessons[i];
            const score = this.state.scores[lid] || 0;
            if (i === 0) {
                currentStatus = score >= 80 ? 'completed' : 'active';
            } else {
                if (currentStatus === 'completed') {
                    currentStatus = score >= 80 ? 'completed' : 'active';
                } else {
                    currentStatus = 'locked';
                }
            }
            
            // Trả về trạng thái khi duyệt đến bài học cần truy vấn
            if (i === idx) {
                return currentStatus;
            }
        }
        return 'locked';
    },

    // Cập nhật các chỉ số hiển thị trên Header
    updateHeaderStats: function() {
        document.getElementById("streak-val").innerText = this.state.streak;
        document.getElementById("xp-val").innerText = this.state.xp;
        document.getElementById("badge-count").innerText = this.state.badges.length;
    },

    // Dựng giao diện Học kỳ và Timeline dọc (VioEdu style)
    switchSemester: function(semester) {
        this.currentSemester = semester;
        document.getElementById("sem-tab-1").classList.toggle("active", semester === 1);
        document.getElementById("sem-tab-2").classList.toggle("active", semester === 2);
        this.renderTimeline();
    },

    // Tìm bài học đang làm hiện tại (bài active đầu tiên)
    getActiveLesson: function() {
        const currentClass = this.config.currentClass || "6";
        const classChapters = COURSE_DATA.filter(
            chapter => (chapter.class || "6") === currentClass
        );

        let firstUncompleted = null;
        for (const chapter of classChapters) {
            for (const lesson of chapter.lessons) {
                const status = this.getLessonStatus(lesson.id);
                if (status === 'active') {
                    return { lesson, semester: chapter.semester };
                }
                if (status !== 'completed' && !firstUncompleted) {
                    firstUncompleted = { lesson, semester: chapter.semester };
                }
            }
        }

        if (firstUncompleted) {
            return firstUncompleted;
        }

        // Nếu tất cả đã hoàn thành, trả về bài học cuối cùng của lớp hiện tại
        const lastChapter = classChapters[classChapters.length - 1];
        if (lastChapter && lastChapter.lessons && lastChapter.lessons.length > 0) {
            const lastLesson = lastChapter.lessons[lastChapter.lessons.length - 1];
            return { lesson: lastLesson, semester: lastChapter.semester };
        }
        return null;
    },

    // Cuộn mượt mà đến bài học đang làm và tự động chuyển học kỳ nếu cần
    scrollToActiveLesson: function() {
        const activeInfo = this.getActiveLesson();
        if (!activeInfo || !activeInfo.lesson) return;

        const lessonId = activeInfo.lesson.id;
        const targetSemester = activeInfo.semester;

        // Nếu học kỳ của bài học đang làm khác học kỳ hiện tại, tự động chuyển tab
        if (this.currentSemester !== targetSemester) {
            this.switchSemester(targetSemester);
        }

        // Đợi DOM render ổn định rồi cuộn
        setTimeout(() => {
            const activeBtn = document.getElementById(`node-${lessonId}`);
            if (activeBtn) {
                activeBtn.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 150);
    },

    // Dựng giao diện Timeline lộ trình học (Skill Tree)
    renderTimeline: function() {
        const container = document.getElementById("skill-tree-container");
        container.innerHTML = "";

        

        // Lọc các chương thuộc học kỳ hiện tại
        const chapters = COURSE_DATA.filter(chapter => chapter.semester === this.currentSemester && (chapter.class || "6") === this.config.currentClass && (chapter.subject || "math") === (this.currentSubject || "math"));

        chapters.forEach(chapter => {
            const chapterDiv = document.createElement("div");
            chapterDiv.className = "timeline-chapter";

            // Tạo Header cho chương
            const headerDiv = document.createElement("div");
            headerDiv.className = "chapter-header";
            headerDiv.innerHTML = `
                <h3>${chapter.title}</h3>
                <p>${chapter.subtitle}</p>
            `;
            chapterDiv.appendChild(headerDiv);

            // Tạo các node bài học
            const nodesDiv = document.createElement("div");
            nodesDiv.className = "chapter-nodes";

            chapter.lessons.forEach((lesson, index) => {
                const status = this.getLessonStatus(lesson.id); // locked, active, completed
                const score = this.state.scores[lesson.id] || 0;

                const nodeWrapper = document.createElement("div");
                nodeWrapper.className = "lesson-node-wrapper";

                let iconClass = "fa-solid fa-lock";
                let badgeCrown = "";

                if (status === "completed") {
                    iconClass = "fa-solid fa-crown";
                    badgeCrown = `<div class="completed-crown">👑</div>`;
                } else if (status === "active") {
                    iconClass = "fa-solid fa-book-open-reader";
                }

                // Nhãn hiển thị trạng thái VioEdu style
                let statusBadgeHtml = "";
                if (status === 'locked') {
                    statusBadgeHtml = `<span class="lesson-item-status-badge status-unstarted"><i class="fa-solid fa-lock"></i> Chưa mở</span>`;
                } else if (score === 0) {
                    statusBadgeHtml = `<span class="lesson-item-status-badge status-unstarted"><i class="fa-solid fa-circle"></i> Chưa học</span>`;
                } else if (score < 80) {
                    statusBadgeHtml = `<span class="lesson-item-status-badge status-learning"><i class="fa-solid fa-spinner"></i> Đang học (${score}%)</span>`;
                } else {
                    statusBadgeHtml = `<span class="lesson-item-status-badge status-passed"><i class="fa-solid fa-circle-check"></i> Đã đạt (${score}%)</span>`;
                }

                nodeWrapper.innerHTML = `
                    <div class="node-anchor">
                        <button class="node-btn ${status}" id="node-${lesson.id}" onclick="app.handleLessonNodeClick('${lesson.id}', '${status}')">
                           ${badgeCrown}
                           <i class="${iconClass}"></i>
                        </button>
                        <div class="node-label" onclick="app.handleLessonLabelClick('${lesson.id}', '${status}')">
                            <div style="font-weight:800; font-size:0.9rem;">${lesson.title}</div>
                            ${statusBadgeHtml}
                        </div>
                    </div>
                `;
                nodesDiv.appendChild(nodeWrapper);
            });

            chapterDiv.appendChild(nodesDiv);
            container.appendChild(chapterDiv);
        });
    },

    // Điều phối SPA hiển thị màn hình mong muốn
    showScreen: function(screenName) {
        // Tắt mọi chế độ Focus Mode khi đổi trang
        document.body.classList.remove("focus-mode-active");

        // Dừng game nếu rời màn hình học tập
        if (screenName !== 'lesson') {
            if (window.game && game.isPlaying) {
                game.stop();
            }
        }

        // Khôi phục thanh cuộn cho body và html phòng trường hợp bị kẹt
        this.restoreScrollbar();

        // Ẩn/Hiện nút Quay lại ở Header
        const backBtn = document.getElementById("header-back-btn");
        if (backBtn) {
            if (screenName === 'timeline') {
                backBtn.classList.add("hidden");
            } else {
                backBtn.classList.remove("hidden");
            }
        }

        const screens = ['timeline', 'parent'];
        screens.forEach(s => {
            const elem = document.getElementById(`screen-${s}`);
            if (elem) {
                if (s === (screenName === 'lesson' ? 'timeline' : screenName)) {
                    elem.classList.remove("hidden");
                } else {
                    elem.classList.add("hidden");
                }
            }
        });

        // Nếu quay lại timeline thì dựng lại để cập nhật trạng thái mở khóa
        if (screenName === 'timeline') {
            document.getElementById("welcome-viewer-panel").classList.remove("hidden");
            document.getElementById("lesson-detail-panel").classList.add("hidden");

            // Reset tab về Lý thuyết để lần mở bài tiếp theo hiển thị video & dạng bài
            const theoryBtn = document.getElementById("tab-theory-btn");
            const practiceBtn = document.getElementById("tab-practice-btn");
            const historyBtn = document.getElementById("tab-history-btn");
            const theoryPane = document.getElementById("tab-theory");
            const practicePane = document.getElementById("tab-practice");
            const historyPane = document.getElementById("tab-history");
            if (theoryBtn) theoryBtn.classList.add("active");
            if (practiceBtn) practiceBtn.classList.remove("active");
            if (historyBtn) historyBtn.classList.remove("active");
            if (theoryPane) theoryPane.classList.remove("hidden");
            if (practicePane) practicePane.classList.add("hidden");
            if (historyPane) historyPane.classList.add("hidden");
            
            // Tự động tìm học kỳ của bài đang làm và switch sang đó nếu khác học kỳ hiện tại
            const activeInfo = this.getActiveLesson();
            if (activeInfo && this.currentSemester !== activeInfo.semester) {
                this.switchSemester(activeInfo.semester); // Hàm này đã tự gọi renderTimeline()
            } else {
                this.renderTimeline();
            }
            
            this.updateHeaderStats();
            document.getElementById("video-wrapper").innerHTML = "";
            
            // Cuộn tự động đến bài học đang làm
            this.scrollToActiveLesson();
        }

        if (screenName === 'lesson') {
            document.getElementById("welcome-viewer-panel").classList.add("hidden");
            document.getElementById("lesson-detail-panel").classList.remove("hidden");
        }
        
        // Nếu vào màn hình parent và đã xác thực, vẽ lại biểu đồ
        if (screenName === 'parent') {
            if (typeof parentDashboard !== 'undefined' && typeof parentDashboard.onScreenLoad === 'function') {
                parentDashboard.onScreenLoad();
            }
        }
        
        // Ghi nhận lịch sử chuyển trang
        if (screenName === 'timeline') {
            this.pushHistory('timeline');
        } else if (screenName === 'lesson') {
            this.pushHistory('lesson-detail');
        } else if (screenName === 'parent') {
            this.pushHistory('parent');
        }
        this.updateNavigationButtons();
    },

    // Quay lại màn hình trước
    goBack: function() {
        this.goBackHierarchy();
    },

    // Lưu giữ lịch sử điều hướng
    pushHistory: function(screenName) {
        if (!this.navHistory) this.navHistory = [];
        // Không push trùng với màn hình hiện tại ở đỉnh stack
        if (this.navHistory.length > 0 && this.navHistory[this.navHistory.length - 1] === screenName) {
            return;
        }
        this.navHistory.push(screenName);
        console.log("Navigation Stack:", this.navHistory);
    },

    // Hiển thị màn hình theo tên lịch sử
    showScreenByHistoryName: function(screenName) {
        // Ẩn tất cả các màn hình trước
        const screens = {
            'google-login': 'google-login-screen',
            'setup-initial': 'setup-initial-screen',
            'student-select': 'student-select-screen',
            'splash': 'splash-screen',
            'subject-select': 'screen-subject-select',
            'timeline': 'screen-timeline',
            'english-portal': 'screen-english-portal',
            'lesson-detail': 'lesson-detail-panel',
            'english-lesson': 'english-focus-lesson-screen'
        };

        // Ẩn tất cả
        Object.values(screens).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.classList.add("hidden");
        });
        
        const splash = document.getElementById("splash-screen");
        if (splash && screenName !== 'splash') {
            splash.style.display = "none";
        }

        const mainWorkspace = document.getElementById("main-workspace") || document.querySelector(".workspace-container");
        const sidebar = document.getElementById("sidebar") || document.querySelector(".timeline-sidebar");

        // Hiển thị màn hình đích
        if (screenName === 'google-login') {
            this.openGoogleLoginModal();
        } else if (screenName === 'setup-initial') {
            const el = document.getElementById('setup-initial-screen');
            if (el) el.classList.remove("hidden");
        } else if (screenName === 'student-select') {
            const el = document.getElementById('student-select-screen');
            if (el) el.classList.remove("hidden");
            this.showStudentSelectionScreen();
        } else if (screenName === 'splash') {
            if (splash) {
                splash.style.display = "";
                splash.classList.remove("hidden");
                splash.classList.remove("fade-out");
            }
        } else if (screenName === 'subject-select') {
            if (mainWorkspace) mainWorkspace.classList.add("hidden");
            if (sidebar) sidebar.classList.add("hidden");
            const el = document.getElementById('screen-subject-select');
            if (el) el.classList.remove("hidden");
            const classLevel = this.config.currentClass || "6";
            const availableSubjects = Object.values(SYSTEM_SUBJECTS).filter(s => s.supportedClasses.includes(classLevel));
            this.showSubjectSelectionScreen(availableSubjects);
        } else if (screenName === 'timeline') {
            if (mainWorkspace) mainWorkspace.classList.remove("hidden");
            if (sidebar) sidebar.classList.remove("hidden");
            const el = document.getElementById('screen-timeline');
            if (el) el.classList.remove("hidden");
            document.getElementById("welcome-viewer-panel").classList.remove("hidden");
            document.getElementById("lesson-detail-panel").classList.add("hidden");
            this.currentSubject = 'math';
            document.body.className = document.body.className.replace(/\b(math|english)-mode\b/g, "");
            document.body.classList.add("math-mode");
            this.renderTimeline();
            this.updateHeaderStats();
        } else if (screenName === 'english-portal') {
            const el = document.getElementById('screen-english-portal');
            if (el) el.classList.remove("hidden");
            this.currentSubject = 'english';
            document.body.className = document.body.className.replace(/\b(math|english)-mode\b/g, "");
            document.body.classList.add("english-mode");
            this.switchEnglishTab('map');
            this.updateEnglishHeaderStats();
        } else if (screenName === 'lesson-detail') {
            if (mainWorkspace) mainWorkspace.classList.remove("hidden");
            if (sidebar) sidebar.classList.remove("hidden");
            const el = document.getElementById('screen-timeline');
            if (el) el.classList.remove("hidden");
            document.getElementById("welcome-viewer-panel").classList.add("hidden");
            const detail = document.getElementById("lesson-detail-panel");
            if (detail) detail.classList.remove("hidden");
        } else if (screenName === 'english-lesson') {
            const el = document.getElementById('english-focus-lesson-screen');
            if (el) el.classList.remove("hidden");
            document.body.classList.add("focus-mode-active");
        }

        this.updateNavigationButtons();
    },

    // Quay lại màn hình phân cấp trước đó một cách chính xác
    goBackHierarchy: function() {
        // 1. Kiểm tra xem có đang ở chế độ làm bài trắc nghiệm Toán hay không
        const mathPracticeEl = document.getElementById("practice-active-box");
        const mathPracticeActive = mathPracticeEl && !mathPracticeEl.classList.contains("hidden");
        if (mathPracticeActive && window.questions && typeof questions.exitPractice === 'function') {
            questions.exitPractice();
            return;
        }
        
        // 2. Nếu đang học bài Tiếng Anh (trong bài học cụ thể của English Portal)
        const englishLessonEl = document.getElementById("english-focus-lesson-screen");
        const englishLessonActive = englishLessonEl && !englishLessonEl.classList.contains("hidden");
        if (englishLessonActive && typeof this.exitEnglishLesson === 'function') {
            this.exitEnglishLesson();
            return;
        }

        if (this.navHistory && this.navHistory.length > 1) {
            this.navHistory.pop(); // Pop màn hình hiện tại
            const prevScreen = this.navHistory[this.navHistory.length - 1];
            this.showScreenByHistoryName(prevScreen);
        } else {
            this.fallbackGoBackHierarchy();
        }
    },

    fallbackGoBackHierarchy: function() {
        const timelineScreen = document.getElementById("screen-timeline");
        const englishPortal = document.getElementById("screen-english-portal");
        const subjectSelectScreen = document.getElementById("screen-subject-select");
        const splashScreen = document.getElementById("splash-screen");
        const studentSelectScreen = document.getElementById("student-select-screen");
        const googleLoginScreen = document.getElementById("google-login-screen");

        if ((timelineScreen && !timelineScreen.classList.contains("hidden")) || (englishPortal && !englishPortal.classList.contains("hidden"))) {
            if (timelineScreen) timelineScreen.classList.add("hidden");
            if (englishPortal) englishPortal.classList.add("hidden");
            
            const classLevel = this.config.currentClass || "6";
            const availableSubjects = Object.values(SYSTEM_SUBJECTS).filter(s => s.supportedClasses.includes(classLevel));
            if (availableSubjects.length <= 1) {
                if (splashScreen) {
                    splashScreen.style.display = "";
                    splashScreen.classList.remove("hidden");
                    splashScreen.classList.remove("fade-out");
                }
                this.updateNavigationButtons();
            } else {
                if (subjectSelectScreen) {
                    subjectSelectScreen.classList.remove("hidden");
                }
                this.updateNavigationButtons();
            }
            return;
        }

        if (subjectSelectScreen && !subjectSelectScreen.classList.contains("hidden")) {
            subjectSelectScreen.classList.add("hidden");
            if (splashScreen) {
                splashScreen.style.display = "";
                splashScreen.classList.remove("hidden");
                splashScreen.classList.remove("fade-out");
            }
            this.updateNavigationButtons();
            return;
        }

        if (splashScreen && splashScreen.style.display !== "none" && !splashScreen.classList.contains("hidden")) {
            splashScreen.classList.add("hidden");
            if (studentSelectScreen) {
                studentSelectScreen.classList.remove("hidden");
                this.showStudentSelectionScreen();
            }
            this.updateNavigationButtons();
            return;
        }

        if (studentSelectScreen && !studentSelectScreen.classList.contains("hidden")) {
            if (googleLoginScreen) {
                studentSelectScreen.classList.add("hidden");
                googleLoginScreen.classList.remove("hidden");
            }
            this.updateNavigationButtons();
            return;
        }
    },

    // Yêu cầu mật khẩu PIN phụ huynh để thoát Kiosk Mode / đóng ứng dụng an toàn
    exitApplicationWithPassword: function() {
        Swal.fire({
            title: 'Thoát ứng dụng 🔑',
            text: 'Nhập Mật mã/Mã PIN phụ huynh để đóng ứng dụng:',
            input: 'password',
            inputPlaceholder: 'Nhập mật mã phụ huynh...',
            showCancelButton: true,
            confirmButtonColor: '#8b5cf6',
            cancelButtonColor: '#475569',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy bỏ'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const password = result.value;
                if (!password) {
                    Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Vui lòng nhập mật mã phụ huynh!' });
                    return;
                }
                
                Swal.fire({
                    title: 'Đang xác thực và thoát...',
                    text: 'Vui lòng đợi giây lát.',
                    allowOutsideClick: false,
                    didOpen: () => { Swal.showLoading(); }
                });
                
                try {
                    // Đăng nhập để lấy Token JWT quản trị viên
                    const loginRes = await fetch(this.getApiUrl('/api/admin/login'), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ password })
                    });
                    
                    if (!loginRes.ok) {
                        const err = await loginRes.json();
                        Swal.fire({ 
                            icon: 'error', 
                            title: 'Mật mã không đúng', 
                            text: err.error || 'Mật mã phụ huynh nhập vào không chính xác!' 
                        });
                        return;
                    }
                    
                    const data = await loginRes.json();
                    const token = data.token;
                    
                    // Gửi API thoát Kiosk an toàn kèm theo JWT Token và shutdown=true
                    const exitRes = await fetch(this.getApiUrl('/api/exit-kiosk'), {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ shutdown: true })
                    });
                    
                    if (exitRes.ok) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đang đóng ứng dụng',
                            text: 'Chúc con một ngày vui vẻ! Đang tắt chế độ Kiosk...',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    } else {
                        Swal.fire({ 
                            icon: 'error', 
                            title: 'Lỗi khi thoát', 
                            text: 'Không thể thoát ứng dụng. Vui lòng thử lại!' 
                        });
                    }
                } catch (e) {
                    Swal.fire({ 
                        icon: 'error', 
                        title: 'Lỗi kết nối', 
                        text: 'Không thể kết nối đến máy chủ: ' + e.message 
                    });
                }
            }
        });
    },

    // Cập nhật hiển thị/ẩn các nút trên widget điều hướng
    updateNavigationButtons: function() {
        const backBtn = document.getElementById("global-back-btn");
        const exitBtn = document.getElementById("global-exit-btn");
        if (!backBtn) return;
        
        const setupScreen = document.getElementById("setup-initial-screen");
        if (setupScreen && !setupScreen.classList.contains("hidden")) {
            backBtn.style.display = "none";
            if (exitBtn) exitBtn.style.display = "";
            return;
        }
        
        const googleLoginScreen = document.getElementById("google-login-screen");
        const hasStudents = this.config && this.config.students && this.config.students.length > 0;
        if (googleLoginScreen && !googleLoginScreen.classList.contains("hidden") && !hasStudents) {
            backBtn.style.display = "none";
            if (exitBtn) exitBtn.style.display = "";
            return;
        }

        const timelineScreen = document.getElementById("screen-timeline");
        const englishPortal = document.getElementById("screen-english-portal");
        const lessonDetail = document.getElementById("lesson-detail-panel");
        const englishLessonEl = document.getElementById("english-focus-lesson-screen");
        const englishLessonActive = englishLessonEl && !englishLessonEl.classList.contains("hidden");
        const mathPracticeEl = document.getElementById("practice-active-box");
        const mathPracticeActive = mathPracticeEl && !mathPracticeEl.classList.contains("hidden");

        const isInStudyWorkspace = (timelineScreen && !timelineScreen.classList.contains("hidden")) || 
                                   (englishPortal && !englishPortal.classList.contains("hidden")) ||
                                   (lessonDetail && !lessonDetail.classList.contains("hidden"));
        
        if (isInStudyWorkspace && !mathPracticeActive && !englishLessonActive) {
            backBtn.style.display = "none";
            if (exitBtn) exitBtn.style.display = "none";
            return;
        }

        if (mathPracticeActive || englishLessonActive) {
            backBtn.style.display = "";
            if (exitBtn) exitBtn.style.display = "none";
            return;
        }

        backBtn.style.display = "";
        if (exitBtn) exitBtn.style.display = "";
    },

    // Xử lý click nhãn bài học trên timeline (mở bài hoặc hỏi mã PIN nếu bị khóa)
    handleLessonLabelClick: function(lessonId, status) {
        if (status === 'locked') {
            Swal.fire({
                title: 'Bài học chưa mở 🔑',
                text: 'Nhập mật mã phụ huynh để mở khóa tạm thời bài học này (phục vụ in đề hoặc học thử):',
                input: 'password',
                inputPlaceholder: 'Nhập mật mã phụ huynh...',
                showCancelButton: true,
                confirmButtonColor: 'var(--primary)',
                cancelButtonColor: 'var(--danger)',
                confirmButtonText: 'Xác nhận',
                cancelButtonText: 'Hủy bỏ'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const pin = result.value;
                    try {
                        const res = await fetch(app.getApiUrl("/api/verify-pin"), {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ pin })
                        });
                        if (res.ok) {
                            // Mở khóa tạm thời bài này bằng cách startLesson
                            this.startLesson(lessonId);
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Mật mã không đúng',
                                text: 'Mật mã phụ huynh nhập vào không chính xác!'
                            });
                        }
                    } catch (err) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi kết nối',
                            text: 'Không thể kết nối tới máy chủ.'
                        });
                    }
                }
            });
            return;
        }
        this.startLesson(lessonId);
    },

    // Xử lý click nút tròn bài học trên timeline
    handleLessonNodeClick: function(lessonId, status) {
        if (status === 'locked') {
            this.handleLessonLabelClick(lessonId, status);
            return;
        }
        this.startLesson(lessonId);
    },

    // Kích hoạt khi học sinh click vào bài học
    startLesson: function(lessonId) {
        const lesson = getLessonById(lessonId);
        if (!lesson) return;

        this.currentLesson = lesson;
        this.currentSubtopicId = null; // Reset dạng bài đang học của bài cũ
        document.getElementById("current-lesson-title").innerText = `${lesson.chapterTitle} - ${lesson.title}`;
        
        // Gọi API sinh ngầm đề thi Chất lượng cao bằng AI để tránh độ trễ
        fetch(this.getApiUrl('/api/pre-generate-questions'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lessonId: lesson.id,
                lessonTitle: lesson.title,
                classLevel: this.config.currentClass || '6'
            })
        }).then(res => res.json())
          .then(data => {
              console.log('[AI Pre-generate]', data.message);
          })
          .catch(err => {
              console.error('[AI Pre-generate Error]', err);
          });

        // Tự động co gọn lộ trình học khi chọn bài học
        this.collapseSidebar();

        // Luôn mở tab Lý thuyết khi chọn bài từ màn hình chào mừng bên phải
        const openingFromWelcome = document.getElementById("lesson-detail-panel").classList.contains("hidden");

        // Hiển thị panel chi tiết bài học trước khi nạp nội dung tab
        this.showScreen('lesson');

        // Nạp video bài học hoặc dạng bài đầu tiên (Nếu có subtopics thì video của dạng đầu sẽ tự được nạp khi switch sang tab 'theory')
        const hasSubtopics = lesson.subtopics && lesson.subtopics.length > 0;
        if (!hasSubtopics) {
            const videoId = this.getLessonVideoId(lesson.id);
            this.renderVideoPlayer("video-wrapper", videoId, lesson.id, lesson.id);
        }

        // Giữ nguyên tab hiện tại khi đổi bài trong cùng phiên học
        let activeTab = 'theory';
        if (!openingFromWelcome) {
            if (document.getElementById("tab-practice-btn").classList.contains("active")) {
                activeTab = 'practice';
            } else if (document.getElementById("tab-history-btn").classList.contains("active")) {
                activeTab = 'history';
            }
        }
        this.switchLessonTab(activeTab);

        // Phân tích kết quả học và cập nhật box Đánh giá nổi bật ở cột phải
        this.updateLessonEvaluation(lessonId);

        // Hiển thị lịch sử làm bài cho bài học này
        this.renderLessonHistory(lessonId);

        // Ghi nhận thời gian học (Dashboard phụ huynh): giả lập 5 phút cho mỗi lần click học bài lý thuyết
        this.logLearningTime(5);
    },

    // Chuyển đổi qua lại giữa Tab Lý thuyết, Thực hành và Lịch sử
    switchLessonTab: function(tabName, isDirectClick = true) {
        // Khôi phục thanh cuộn khi chuyển tab phòng trường hợp bị kẹt từ chế độ luyện tập
        this.restoreScrollbar();

        const theoryBtn = document.getElementById("tab-theory-btn");
        const practiceBtn = document.getElementById("tab-practice-btn");
        const historyBtn = document.getElementById("tab-history-btn");
        
        const theoryPane = document.getElementById("tab-theory");
        const practicePane = document.getElementById("tab-practice");
        const historyPane = document.getElementById("tab-history");

        theoryBtn.classList.toggle("active", tabName === 'theory');
        practiceBtn.classList.toggle("active", tabName === 'practice');
        historyBtn.classList.toggle("active", tabName === 'history');

        theoryPane.classList.toggle("hidden", tabName !== 'theory');
        practicePane.classList.toggle("hidden", tabName !== 'practice');
        historyPane.classList.toggle("hidden", tabName !== 'history');

        // Dừng phát video bài giảng khi học sinh rời tab lý thuyết
        if (tabName !== 'theory') {
            this.stopVideo();
        }

        // Dừng game khi học sinh rời tab thực hành
        if (tabName !== 'practice') {
            if (window.game && game.isPlaying) {
                game.stop();
            }
        }

        if (tabName === 'theory') {
            this.renderSubtopicsTimeline();
        } else if (tabName === 'practice') {
            if (this.navHistory && this.navHistory.length > 0 && this.navHistory[this.navHistory.length - 1] === 'math-practice') {
                this.navHistory.pop();
            }
            this.updateNavigationButtons();

            // Ẩn tất cả các box trong tab practice trước
            document.getElementById("practice-locked-warning-box").classList.add("hidden");
            document.getElementById("practice-lesson-exam-intro-box").classList.add("hidden");
            document.getElementById("practice-level-select-box").classList.add("hidden");
            document.getElementById("practice-exam-intro-box").classList.add("hidden");
            document.getElementById("practice-active-box").classList.add("hidden");
            document.getElementById("practice-result-box").classList.add("hidden");
            document.getElementById("practice-mode-select-box").classList.add("hidden");
            const dbBox = document.getElementById("practice-levels-dashboard-box");
            if (dbBox) dbBox.classList.add("hidden");

            if (!isDirectClick) {
                // Nếu không phải click trực tiếp (được chuyển hướng từ nút Luyện tập dạng bài)
                // Hiển thị ngay màn hình làm bài đang chuẩn bị nạp
                document.getElementById("practice-active-box").classList.remove("hidden");
            } else {
                const lesson = this.currentLesson;
                const hasSubtopics = lesson.subtopics && lesson.subtopics.length > 0;

                if (hasSubtopics) {
                    // Kiểm tra xem đã học lý thuyết chưa
                    const theoryCompleted = this.state.completedLessonTheory && this.state.completedLessonTheory.includes(lesson.id);
                    const isLessonPassed = (this.state.scores[lesson.id] || 0) >= 80;

                    if (!theoryCompleted && !isLessonPassed) {
                        const lockedWarning = document.getElementById("practice-locked-warning-box");
                        if (lockedWarning) {
                            const p = lockedWarning.querySelector("p");
                            if (p) p.innerHTML = `${this.config.studentName} ơi, con cần học phần <b>Kiến thức giáo khoa (Lý thuyết)</b> ở tab <b>Lý thuyết & Video</b> trước để mở khóa phần Luyện tập của bài học này nhé!`;
                            lockedWarning.classList.remove("hidden");
                        }
                    } else {
                        // Đã học lý thuyết -> Hiển thị Dashboard 3 cấp độ
                        this.renderPracticeDashboard();
                    }
                } else {
                    // Các bài luyện tập chung hoặc kiểm tra chương
                    const isExam = lesson.questionType.startsWith("cuoi-chuong") || lesson.id.startsWith("kt-");
                    if (isExam) {
                        document.getElementById("practice-exam-intro-box").classList.remove("hidden");
                        document.getElementById("exam-intro-title").innerText = `Bài kiểm tra kết thúc: ${lesson.chapterTitle || "Chương"}`;
                        document.getElementById("exam-intro-desc").innerText = `Bài thi kiểm tra tổng hợp kiến thức của ${lesson.chapterTitle || "Chương"} bao gồm các câu hỏi từ cơ bản, nâng cao đến khó.`;
                    } else {
                        // Luyện tập chung không có subtopics: Hiển thị Dashboard 3 cấp độ luôn
                        this.renderPracticeDashboard();
                    }
                }
            }
        } else if (tabName === 'history') {
            this.renderLessonHistory(this.currentLesson.id);
        }
    },

    // Hàm phân tích kết quả học của học sinh đối với bài đang chọn và đưa ra Đánh giá phân tích nổi bật
    updateLessonEvaluation: function(lessonId) {
        const evalBox = document.getElementById("lesson-evaluation-box");
        evalBox.className = "evaluation-box card"; // reset class

        // Tổng hợp điểm cao nhất từ MỌI nguồn lưu trữ để tránh hiển thị "Bài học mới" khi học sinh
        // đã làm dạng bài (subtopicScores) nhưng chưa làm luyện tập chung (scores[lessonId])
        const lessonScore = this.state.scores[lessonId] || 0;

        // Điểm từ subtopicScores (luyện tập dạng bài)
        let subtopicMaxScore = 0;
        const _evalLesson = getLessonById(lessonId);
        if (_evalLesson && _evalLesson.subtopics && _evalLesson.subtopics.length > 0 && this.state.subtopicScores) {
            _evalLesson.subtopics.forEach(sub => {
                subtopicMaxScore = Math.max(subtopicMaxScore, this.state.subtopicScores[sub.id] || 0);
            });
        }

        // Điểm từ levelScores (luyện tập cấp độ chung)
        let levelMaxScore = 0;
        if (this.state.levelScores) {
            ['co-ban', 'nang-cao', 'kho', 'chat-luong-cao'].forEach(lvl => {
                levelMaxScore = Math.max(levelMaxScore, this.state.levelScores[`${lessonId}_${lvl}`] || 0);
            });
        }

        // Điểm từ examSessions (tất cả lượt làm bài đã ghi nhận)
        const sessionMaxScore = (this.state.examSessions || [])
            .filter(s => s.lessonId === lessonId)
            .reduce((max, s) => Math.max(max, s.scorePercent || 0), 0);

        const maxScore = Math.max(lessonScore, subtopicMaxScore, levelMaxScore, sessionMaxScore);

        const history = this.state.history || [];
        const lessonHistory = history.filter(h => h.lessonId === lessonId);

        const _studentName = this.config.studentName || 'Con';
        const _parentName = this.config.parentName || 'Bố';
        let evalHtml = "";

        if (maxScore === 0) {
            evalBox.classList.add("new-lesson");
            evalHtml = `
                <div class="eval-title"><i class="fa-solid fa-star" style="color: var(--blue-app);"></i> Bài học mới dành cho ${_studentName}!</div>
                <div class="eval-desc">${_studentName} chưa làm bài luyện tập nào cho bài học này. Con hãy xem kỹ video bài giảng, ôn tập lý thuyết tóm tắt bên dưới, sau đó bắt đầu làm bài luyện tập cấp độ <b>Cơ bản</b> nhé. ${_parentName} chúc con học tốt và đạt điểm cao!</div>
            `;
        } else if (maxScore < 70) {
            evalBox.classList.add("needs-improvement");
            
            // Tìm dạng lỗi con hay gặp nhất (nếu có)
            let weakText = "";
            if (lessonHistory.length > 0) {
                const incorrectTypes = lessonHistory.filter(h => !h.isCorrect).map(h => h.questionType);
                if (incorrectTypes.length > 0) {
                    const counts = {};
                    incorrectTypes.forEach(t => counts[t] = (counts[t] || 0) + 1);
                    const mostIncorrect = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
                    let skillName = "kỹ năng làm bài";
                    if (typeof parentDashboard !== 'undefined' && parentDashboard.skillNames && parentDashboard.skillNames[mostIncorrect]) {
                        skillName = parentDashboard.skillNames[mostIncorrect];
                    } else if (typeof COURSE_DATA !== 'undefined') {
                        const foundLesson = COURSE_DATA.flatMap(c => c.lessons).find(l => l.questionType === mostIncorrect);
                        if (foundLesson) {
                            skillName = foundLesson.title.split(': ')[1] || foundLesson.title;
                        }
                    }
                    weakText = ` Con còn hay làm nhầm ở phần <b>${skillName}</b>.`;
                }
            }

            evalHtml = `
                <div class="eval-title"><i class="fa-solid fa-circle-exclamation"></i> Cần cải thiện điểm số con nhé! (Điểm cao nhất: ${maxScore}%)</div>
                <div class="eval-desc">${_studentName} đang gặp một chút khó khăn ở bài học này.${weakText} Con hãy dành 10 phút xem lại video bài giảng và đọc lời giải chi tiết của các câu đã làm sai, sau đó luyện tập lại để nâng điểm số nhé. ${_parentName} luôn đồng hành và tin tưởng con!</div>
            `;
        } else if (maxScore < 80) {
            evalBox.classList.add("good");
            evalHtml = `
                <div class="eval-title"><i class="fa-solid fa-thumbs-up"></i> Con làm bài khá tốt! (Điểm cao nhất: ${maxScore}%)</div>
                <div class="eval-desc">${_studentName} làm bài tập đạt kết quả khá rồi. Tuy nhiên, con cần đạt từ <b>80% trở lên</b> để mở khóa bài học tiếp theo. Con hãy ôn lại bài và thử sức lại một lần nữa để đạt điểm Giỏi/Xuất sắc nhé. ${_parentName} tin con chắc chắn sẽ làm được!</div>
            `;
        } else {
            evalBox.classList.add("excellent");
            evalHtml = `
                <div class="eval-title"><i class="fa-solid fa-crown" style="color: #FFD700;"></i> ${_parentName} chúc mừng ${_studentName}! Hoàn thành xuất sắc! (Điểm cao nhất: ${maxScore}%)</div>
                <div class="eval-desc">Tuyệt vời ${_studentName}! Con đã hoàn thành xuất sắc bài học này và mở khóa bài mới. Hãy thử thách thêm bản thân ở các cấp độ khó hơn như <b>Nâng cao</b> hoặc <b>Khó</b> để tích lũy thật nhiều XP và nhận huy hiệu danh giá nhé!</div>
            `;
        }

        evalBox.innerHTML = evalHtml;
    },

    // Hiển thị lịch sử làm bài bài học này
    renderLessonHistory: function(lessonId) {
        const listContainer = document.getElementById("lesson-history-list");
        listContainer.innerHTML = "";

        const sessions = this.state.examSessions || [];
        const lessonSessions = sessions.filter(s => s.lessonId === lessonId).sort((a, b) => new Date(b.date) - new Date(a.date));

        if (lessonSessions.length === 0) {
            listContainer.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:1.5rem;font-size:0.9rem;"><i class="fa-solid fa-folder-open"></i> ${this.config.studentName || 'Con'} chưa làm bài tập/kiểm tra bài này.</p>`;
            return;
        }

        lessonSessions.forEach(sess => {
            const dateObj = new Date(sess.date);
            const dateStr = dateObj.toLocaleDateString("vi-VN") + " " + dateObj.toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'});
            
            const isPassed = sess.scorePercent >= 80;

            // --- Phân loại loại bài và nhãn hiển thị ---
            // Hỗ trợ cả dữ liệu cũ (chỉ có isExam) và dữ liệu mới (có isLessonExam, isSubtopicPractice...)
            let sessionTypeLabel = "";
            let sessionTypeStyle = "";
            let sessionMainTitle = "Luyện tập";

            if (sess.isExam) {
                // Thi cuối chương
                sessionTypeLabel = "Thi cuối chương 📋";
                sessionTypeStyle = `style="background-color: var(--danger-bg); color: var(--danger); border: 1px solid var(--danger); font-weight:700;"`;
                sessionMainTitle = "Bài thi";
            } else if (sess.isLessonExam) {
                // Kiểm tra tổng thể bài học (Thử thách)
                sessionTypeLabel = "⚡ Kiểm tra tổng thể";
                sessionTypeStyle = `style="background-color: rgba(239,68,68,0.12); color: #ef4444; border: 1px solid #ef4444; font-weight:700;"`;
                sessionMainTitle = "Kiểm tra tổng thể";
            } else if (sess.isSubtopicPractice) {
                // Luyện tập theo Dạng bài
                const dTitle = sess.subtopicTitle || "Dạng bài";
                const prefix = sess.isWeaknessPractice ? "🎯 Luyện điểm yếu: " : "📚 Dạng bài: ";
                sessionTypeLabel = prefix + dTitle;
                sessionTypeStyle = sess.isWeaknessPractice
                    ? `style="background-color: rgba(245,158,11,0.15); color: #d97706; border: 1px solid #d97706; font-weight:700;"`
                    : `style="background-color: var(--primary-bg); color: var(--primary); border: 1px solid var(--primary); font-weight:700;"`;
                sessionMainTitle = sess.isWeaknessPractice ? "Luyện điểm yếu AI" : "Luyện tập Dạng bài";
            } else if (sess.isWeaknessPractice) {
                // Luyện điểm yếu không phải subtopic
                sessionTypeLabel = "🎯 Luyện điểm yếu AI";
                sessionTypeStyle = `style="background-color: rgba(245,158,11,0.15); color: #d97706; border: 1px solid #d97706; font-weight:700;"`;
                sessionMainTitle = "Luyện điểm yếu AI";
            } else {
                // Luyện tập cấp độ thường (cũng xử lý dữ liệu cũ chỉ có isExam=false)
                const levelLabel = sess.level === 'co-ban' ? 'Cơ bản 🌱' :
                    (sess.level === 'nang-cao' ? 'Nâng cao 🚀' :
                    (sess.level === 'kho' ? 'Khó 🔥' :
                    (sess.level === 'chat-luong-cao' ? 'Chất lượng cao 💎' : (sess.level || 'Luyện tập'))));
                const levelClass = sess.level === 'co-ban' ? 'success' :
                    (sess.level === 'nang-cao' ? 'warning' :
                    (sess.level === 'kho' ? 'danger' : 'info'));
                sessionTypeLabel = levelLabel;
                sessionTypeStyle = sess.level === 'chat-luong-cao'
                    ? `style="background-color: rgba(139,92,246,0.15); color: #8b5cf6; border: 1px solid #8b5cf6; font-weight:700;"`
                    : `style="background-color: var(--${levelClass}-bg); color: var(--${levelClass}); border: 1px solid var(--${levelClass}); font-weight:700;"`;
                sessionMainTitle = "Luyện tập";
            }

            const itemDiv = document.createElement("div");
            itemDiv.className = "session-history-item";
            itemDiv.innerHTML = `
                <div class="sess-info-left">
                    <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                        <span class="sess-title-main">${sessionMainTitle}</span>
                        <span class="sess-badge-level" ${sessionTypeStyle}>${sessionTypeLabel}</span>
                    </div>
                    <span class="sess-time-meta"><i class="fa-solid fa-calendar-day"></i> ${dateStr} | <i class="fa-solid fa-stopwatch"></i> ${sess.timeSpent}s | <i class="fa-solid fa-triangle-exclamation"></i> ${sess.distractions || 0} lần chuyển tab</span>
                </div>
                <div class="sess-result-right">
                    <span class="sess-score-percent ${isPassed ? 'passed' : 'failed'}">${sess.scorePercent}%</span>
                    <button class="btn-sess-review" onclick="app.openReviewSession('${sess.id}')">
                        Xem bài làm
                    </button>
                </div>
            `;
            listContainer.appendChild(itemDiv);
        });
    },


    // Mở modal xem lại chi tiết bài làm của một lượt thi/luyện tập
    openReviewSession: function(sessionId) {
        const sessions = this.state.examSessions || [];
        const sess = sessions.find(s => s.id === sessionId);
        if (!sess) return;

        const modalTitle = document.getElementById("review-session-title");
        const modalBody = document.getElementById("review-session-body");

        const dateObj = new Date(sess.date);
        const dateStr = dateObj.toLocaleDateString("vi-VN") + " " + dateObj.toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'});

        modalTitle.innerText = `📝 Lịch sử bài làm: ${sess.lessonTitle}`;
        
        // Phân loại loại bài cho header modal (hỗ trợ cả dữ liệu cũ và mới)
        let sessionTypeForModal = "";
        if (sess.isExam) {
            sessionTypeForModal = "Thi cuối chương 📋";
        } else if (sess.isLessonExam) {
            sessionTypeForModal = "⚡ Kiểm tra tổng thể bài học";
        } else if (sess.isSubtopicPractice) {
            const dTitle = sess.subtopicTitle || "Dạng bài";
            sessionTypeForModal = sess.isWeaknessPractice ? `🎯 Luyện điểm yếu AI: ${dTitle}` : `📚 Dạng bài: ${dTitle}`;
        } else if (sess.isWeaknessPractice) {
            sessionTypeForModal = "🎯 Luyện điểm yếu AI";
        } else {
            const lvlMap = { 'co-ban': 'Cơ bản (Nhận biết)', 'nang-cao': 'Nâng cao (Thông hiểu)', 'kho': 'Khó (Vận dụng cao)', 'chat-luong-cao': 'Chất lượng cao 💎 (Tư duy & Logic AI)' };
            sessionTypeForModal = lvlMap[sess.level] || sess.level || "Luyện tập";
        }

        let headerHtml = `
            <div style="background-color: var(--primary-bg); border: 1px solid var(--border-color); padding: 1rem; border-radius: 12px; margin-bottom: 1.5rem; font-size: 0.9rem;">
                <p><b>Thời gian làm bài:</b> ${dateStr}</p>
                <p><b>Loại bài:</b> ${sessionTypeForModal}</p>
                <p><b>Kết quả:</b> <span style="font-weight:900; color: ${sess.scorePercent >= 80 ? 'var(--success)' : 'var(--danger)'};">${sess.correctCount}/${sess.totalQuestions} câu đúng (${sess.scorePercent}%)</span></p>
                <p><b>Thời lượng:</b> ${sess.timeSpent} giây | <b>Số lần chuyển tab:</b> ${sess.distractions || 0} lần</p>
            </div>
            <div style="display:flex; flex-direction:column; gap:1.2rem;">
        `;


        let questionsHtml = sess.questions.map((q, idx) => {
            const isCorrect = q.isCorrect !== undefined ? q.isCorrect : 
                (q.isShortAnswer ? (q.userShortAnswer === q.options[q.correctIndex]) : (q.userSelectedIndex === q.correctIndex));
            
            let optionsHtml = "";
            if (q.isShortAnswer) {
                optionsHtml = `
                    <div style="margin-bottom:0.4rem; color:${isCorrect ? 'var(--success)' : 'var(--danger)'}; font-size: 1rem;">
                        <b>Đáp án của con:</b> ${sanitizeHtml(q.userShortAnswer || "Không có câu trả lời")} ${isCorrect ? '✔️' : '❌'}
                    </div>
                    <div style="margin-bottom:0.4rem; color:var(--success); font-weight:700; font-size: 1rem;">
                        <b>Đáp án đúng:</b> ${sanitizeHtml(q.options[q.correctIndex])}
                    </div>
                `;
            } else {
                optionsHtml = q.options.map((opt, oIdx) => {
                    let colorStyle = "";
                    let icon = "";
                    if (oIdx === q.correctIndex) {
                        colorStyle = "color:var(--success); font-weight:700;";
                        icon = "✔️ ";
                    } else if (oIdx === q.userSelectedIndex) {
                        colorStyle = "color:var(--danger); font-weight:700;";
                        icon = "❌ ";
                    }
                    return `<div style="margin-bottom:0.4rem; ${colorStyle}">${icon}<b>${["A", "B", "C", "D"][oIdx]}.</b> ${sanitizeHtml(opt)}</div>`;
                }).join("");
            }

            const cleanQuestionText = sanitizeHtml(q.questionText);
            const cleanSolutionHtml = sanitizeHtml(q.solutionHtml || "Đang cập nhật...");
            const cleanTip = sanitizeHtml(q.tip || "Hãy đọc kỹ đề bài và loại trừ các phương án bẫy.");

            return `
                <div class="review-item" style="font-family: var(--font-family) !important; border-left: 5px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}; padding: 1.2rem; background-color: var(--bg-card); border-top: 1px solid var(--border-color); border-right: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color);">
                    <div style="font-family: var(--font-family) !important; font-weight:700; margin-bottom:0.8rem; display:flex; justify-content:space-between; font-size:0.9rem;">
                        <span style="font-family: var(--font-family) !important;">Câu hỏi ${idx + 1} <span style="font-family: var(--font-family) !important; font-weight:normal; font-size:0.75rem; margin-left:8px; color:var(--text-muted);">(${q.level === 'co-ban' ? 'Cơ bản' : (q.level === 'nang-cao' ? 'Nâng cao' : 'Khó')})</span></span>
                        <span style="font-family: var(--font-family) !important; color: ${isCorrect ? 'var(--success)' : 'var(--danger)'}; font-weight:700;">
                            ${isCorrect ? 'Đúng' : 'Sai'}
                        </span>
                    </div>
                    <div class="math-render" style="font-family: var(--font-family) !important; font-size:1.05rem; margin-bottom:0.8rem; font-weight:600; line-height:1.5;">${cleanQuestionText}</div>
                    <div class="math-render" style="font-family: var(--font-family) !important; margin-bottom:0.8rem; padding-left:1rem; border-left:3px solid var(--border-color);">${optionsHtml}</div>
                    
                    <div style="font-family: var(--font-family) !important; background-color:var(--primary-bg); padding:0.8rem; border-radius:8px; margin-top:0.8rem; font-size:0.9rem;">
                        <strong style="font-family: var(--font-family) !important; color:var(--primary);"><i class="fa-solid fa-graduation-cap"></i> Lời giải chi tiết của ${this.config.parentName || 'phụ huynh'}:</strong>
                        <div class="math-render" style="font-family: var(--font-family) !important; margin-top:0.3rem; line-height:1.5; color:var(--text-main);">${cleanSolutionHtml}</div>
                    </div>
                    
                    <div style="font-family: var(--font-family) !important; background-color:var(--warning-bg); padding:0.8rem; border-radius:8px; margin-top:0.6rem; font-size:0.9rem;">
                        <strong style="font-family: var(--font-family) !important; color:var(--warning);"><i class="fa-solid fa-lightbulb"></i> Mẹo thi (Exam Tips):</strong>
                        <div class="math-render" style="font-family: var(--font-family) !important; margin-top:0.3rem; line-height:1.5; color:var(--text-main);"><i>${cleanTip}</i></div>
                    </div>
                </div>
            `;
        }).join("");

        modalBody.innerHTML = headerHtml + questionsHtml + `</div>`;

        // Render KaTeX riêng cho các phần tử chứa công thức toán học, tránh làm ảnh hưởng font chữ tiếng Việt tĩnh
        if (window.renderMathInElement) {
            const mathElements = modalBody.querySelectorAll(".math-render");
            mathElements.forEach(el => {
                window.renderMathInElement(el, {
                    delimiters: [
                        {left: "$$", right: "$$", display: true},
                        {left: "$", right: "$", display: false}
                    ]
                });
            });
        }

        document.getElementById("review-session-modal").classList.remove("hidden");
    },

    closeReviewSessionModal: function() {
        document.getElementById("review-session-modal").classList.add("hidden");
    },

    // Bật/Tắt Focus Mode xem video chống xao nhãng
    toggleFocusMode: function() {
        document.body.classList.toggle("focus-mode-active");
        const btn = document.querySelector(".btn-focus");
        if (document.body.classList.contains("focus-mode-active")) {
            btn.innerHTML = `<i class="fa-solid fa-compress"></i> Tắt Focus Mode`;
        } else {
            btn.innerHTML = `<i class="fa-solid fa-expand"></i> Bật Focus Mode (Chống xao nhãng)`;
        }
    },

    // Luyện tập lại bài học hiện tại
    retryPractice: function() {
        document.getElementById("practice-active-box").classList.add("hidden");
        document.getElementById("practice-result-box").classList.add("hidden");

        const lesson = this.currentLesson;
        const hasSubtopics = lesson.subtopics && lesson.subtopics.length > 0;

        if (hasSubtopics) {
            if (questions.isSubtopicPracticeMode) {
                // Tự động bắt đầu lại luyện tập dạng bài
                questions.startSubtopicPractice(questions.currentSubtopic.id);
            } else {
                document.getElementById("practice-lesson-exam-intro-box").classList.remove("hidden");
            }
        } else {
            const isExam = lesson.questionType.startsWith("cuoi-chuong") || lesson.id.startsWith("kt-");
            if (isExam) {
                document.getElementById("practice-exam-intro-box").classList.remove("hidden");
            } else {
                document.getElementById("practice-level-select-box").classList.remove("hidden");
            }
        }
    },

    // Ghi nhận điểm số bài luyện tập của học sinh
    saveLessonScore: function(lessonId, score, xpEarned, isPassed, timeSpent = 9999, distractions = 0) {
        // Cập nhật điểm cao nhất
        const prevScore = this.state.scores[lessonId] || 0;
        if (score > prevScore) {
            this.state.scores[lessonId] = score;
        }

        // Tích lũy XP
        this.state.xp += xpEarned;

        // Lưu thông tin học tập của học sinh để phụ huynh theo dõi
        this.logLearningTime(10); // Giả lập làm bài tập tốn 10 phút

        // Kiểm tra mở khóa huy hiệu
        this.checkAndUnlockBadges(lessonId, score, timeSpent, prevScore, distractions);

        this.saveProgress();
        this.updateHeaderStats();
    },

    checkAndReward100PercentLesson: function(lessonId, subject = 'math') {
        this.state.rewarded100PercentLessons = this.state.rewarded100PercentLessons || [];
        if (this.state.rewarded100PercentLessons.includes(lessonId)) return;

        if (subject === 'math') {
            let lesson = null;
            if (typeof COURSE_DATA !== 'undefined') {
                for (const chapter of COURSE_DATA) {
                    const found = chapter.lessons.find(l => l.id === lessonId);
                    if (found) {
                        lesson = found;
                        break;
                    }
                }
            }
            if (!lesson) return;

            const subtopics = lesson.subtopics || [];
            if (subtopics.length > 0) {
                const all100Percent = subtopics.every(sub => (this.state.subtopicScores && this.state.subtopicScores[sub.id]) === 100);
                if (all100Percent) {
                    this.state.rewarded100PercentLessons.push(lessonId);
                    this.state.xp = (this.state.xp || 0) + 100;
                    this.saveProgress();
                    Swal.fire({
                        title: "Tuyệt Đỉnh Toán Học! 🏆✨",
                        html: `Chúc mừng con đã hoàn thành xuất sắc 100% điểm ở tất cả các dạng bài của bài học <b>"${lesson.title}"</b>!<br/>Con được thưởng thêm <b>+100 XP</b>!`,
                        icon: "success",
                        confirmButtonColor: "#eab308"
                    });
                }
            } else {
                const has100Percent = (this.state.scores && this.state.scores[lessonId]) === 100;
                if (has100Percent) {
                    this.state.rewarded100PercentLessons.push(lessonId);
                    this.state.xp = (this.state.xp || 0) + 100;
                    this.saveProgress();
                    Swal.fire({
                        title: "Tuyệt Đỉnh Toán Học! 🏆✨",
                        html: `Chúc mừng con đã hoàn thành xuất sắc 100% điểm bài học <b>"${lesson.title}"</b>!<br/>Con được thưởng thêm <b>+100 XP</b>!`,
                        icon: "success",
                        confirmButtonColor: "#eab308"
                    });
                }
            }
        } else if (subject === 'english') {
            const skills = ['listening', 'speaking', 'reading', 'writing'];
            const all100Percent = skills.every(skill => (this.state.scores && this.state.scores[`${lessonId}-${skill}`]) === 100);
            if (all100Percent) {
                this.state.rewarded100PercentLessons.push(lessonId);
                this.state.englishXp = (this.state.englishXp || 0) + 100;
                this.saveEnglishState();

                let lessonTitle = "Bài học Tiếng Anh";
                if (typeof ENGLISH_COURSE_DATA !== 'undefined') {
                    for (const grade in ENGLISH_COURSE_DATA) {
                        const gradeData = ENGLISH_COURSE_DATA[grade];
                        if (gradeData && gradeData.chapters) {
                            for (const chapter of gradeData.chapters) {
                                const found = chapter.lessons.find(l => l.id === lessonId);
                                if (found) {
                                    lessonTitle = found.title;
                                    break;
                                }
                            }
                        }
                    }
                }

                Swal.fire({
                    title: "Tuyệt Đỉnh Tiếng Anh! 🏆🇬🇧",
                    html: `Chúc mừng con đã hoàn thành xuất sắc 100% điểm ở tất cả các kỹ năng của bài <b>"${lessonTitle}"</b>!<br/>Con được thưởng thêm <b>+100 XP Tiếng Anh</b>!`,
                    icon: "success",
                    confirmButtonColor: "#2563eb"
                });
            }
        }
    },

    // Kiểm tra điều kiện mở khóa các loại huy hiệu
    checkAndUnlockBadges: function(lessonId, score, timeSpent = 9999, oldScore = 0, distractions = 0) {
        // 1. Nhập môn (hoàn thành bất kỳ bài nào >= 80%)
        if (score >= 80) {
            this.unlockBadge("nhap-mon");
        }

        // 2. Khởi đầu vững vàng (đạt 100% điểm bất kỳ bài nào)
        if (score === 100) {
            this.unlockBadge("khoi-dau-vung-vang");
        }

        // 3. Chuỗi học tập liên tục
        if (this.state.streak >= 3) this.unlockBadge("streak-3");
        if (this.state.streak >= 7) this.unlockBadge("streak-7");
        if (this.state.streak >= 15) this.unlockBadge("streak-15");

        // 4. Siêu trí tuệ & Huyền thoại (tích lũy XP)
        if (this.state.xp >= 200) this.unlockBadge("sieu-tri-tue");
        if (this.state.xp >= 500) this.unlockBadge("huyen-thoai-toan-hoc");

        // 5. Thần tốc: Đúng 100% trong thời gian dưới 45 giây (chỉ cho bài luyện tập bình thường 5 câu)
        if (score === 100 && timeSpent <= 45 && !lessonId.startsWith("kt-")) {
            this.unlockBadge("tia-chop");
        }

        // 6. Kiên trì bứt phá: Cải thiện điểm số từ dưới 70% lên đạt giỏi (>= 80%)
        if (oldScore > 0 && oldScore < 70 && score >= 80) {
            this.unlockBadge("kien-tri");
        }

        // 7. Kỷ luật thép: Vượt qua bài kiểm tra cuối chương 10 câu đạt >= 80% mà không có lần xao nhãng nào
        if (lessonId.startsWith("kt-") && score >= 80 && distractions === 0) {
            this.unlockBadge("ky-luat-thep");
        }

        // 8. Các huy hiệu vượt qua bài kiểm tra chương học Lớp 6
        if (lessonId === "kt-c1" && score >= 80) this.unlockBadge("bac-thay-so-tu-nhien");
        if (lessonId === "kt-c2" && score >= 80) this.unlockBadge("chien-binh-chia-het");
        if (lessonId === "kt-c3" && score >= 80) this.unlockBadge("ky-si-so-nguyen");
        if (lessonId === "kt-c4" && score >= 80) this.unlockBadge("phu-thuy-hinh-hoc");
        if (lessonId === "kt-c5" && score >= 80) this.unlockBadge("bac-thay-doi-xung");
        if (lessonId === "kt-c6" && score >= 80) this.unlockBadge("bac-thay-phan-so");
        if (lessonId === "kt-c7" && score >= 80) this.unlockBadge("chien-binh-thap-phan");
        if (lessonId === "kt-c8" && score >= 80) this.unlockBadge("phu-thuy-hinh-co-ban");
        if (lessonId === "kt-c9" && score >= 80) this.unlockBadge("bac-thay-xac-suat");

        // Huy hiệu Lớp 1 mới
        if ((lessonId === "l1-bai-1" || lessonId === "l1-bai-2") && score >= 90) this.unlockBadge("dem-so-lop-1");
        if (lessonId === "l1-bai-10" && score >= 90) this.unlockBadge("phep-cong-pham-vi-10");
        if (lessonId === "l1-bai-14" && score >= 90) this.unlockBadge("hinh-khoi-lop-1");
        if ((lessonId === "l1-bai-34" || lessonId === "l1-bai-35") && score >= 90) this.unlockBadge("do-luong-lop-1");
        if (lessonId === "l1-bai-39" && score >= 90) this.unlockBadge("phep-cong-pham-vi-100");
        if (lessonId === "l1-bai-41" && score >= 90) this.unlockBadge("on-tap-lop-1");

        // Huy hiệu Lớp 4 mới
        if ((lessonId === "l4-bai-3" || lessonId === "l4-bai-4") && score >= 90) this.unlockBadge("trieu-lop-trieu");
        if (lessonId === "l4-bai-10" && score >= 90) this.unlockBadge("trung-binh-cong");
        if (lessonId === "l4-bai-11" && score >= 90) this.unlockBadge("tim-hai-so-tong-hieu");
        if ((lessonId === "l4-bai-14" || lessonId === "l4-bai-15") && score >= 90) this.unlockBadge("tinh-chat-chia-het-4");
        if ((lessonId === "l4-bai-21" || lessonId === "l4-bai-22") && score >= 90) this.unlockBadge("tinh-dien-tich-lop-4");
        if ((lessonId === "l4-bai-24" || lessonId === "l4-bai-25") && score >= 90) this.unlockBadge("phan-so-lop-4");
        if ((lessonId === "l4-bai-38" || lessonId === "l4-bai-39" || lessonId === "l4-bai-40") && score >= 90) this.unlockBadge("ti-so-lop-4");
        if (lessonId === "l4-bai-33" && score >= 90) this.unlockBadge("do-luong-y-en-ta-tan");
        if (lessonId === "l4-bai-18" && score >= 90) this.unlockBadge("hinh-hoc-goc-nhon-tu");
        if (lessonId === "l4-bai-43" && score >= 90) this.unlockBadge("on-tap-lop-4");

        // Huy hiệu Lớp 6 mới
        if (lessonId === "bai-6" && score >= 95) this.unlockBadge("luy-thua-than-sau");
        if ((lessonId === "bai-12" || lessonId === "bai-13") && score >= 95) this.unlockBadge("uoc-va-boi");
        if ((lessonId === "bai-15" || lessonId === "bai-16") && score >= 95) this.unlockBadge("phep-tinh-so-nguyen");
        if (lessonId === "bai-18" && score >= 95) this.unlockBadge("hinh-hoc-truc-quan-6");
        if ((lessonId === "bai-21" || lessonId === "bai-22") && score >= 95) this.unlockBadge("hinh-doi-xung-master");
        if ((lessonId === "bai-26" || lessonId === "bai-27") && score >= 95) this.unlockBadge("phan-so-tieu-chuan-6");
        if ((lessonId === "bai-29" || lessonId === "bai-30") && score >= 95) this.unlockBadge("thap-phan-chuyen-nghiep");
        if ((lessonId === "bai-32" || lessonId === "bai-33") && score >= 95) this.unlockBadge("hinh-hoc-phang-chuan-6");
        if (lessonId === "bai-37" && score >= 95) this.unlockBadge("xac-suat-thuc-te");

        // Gamification & Tích lũy
        if (this.state.xp >= 1000) this.unlockBadge("than-dong-toan-hoc");
        if (this.state.xp >= 2500) this.unlockBadge("chien-binh-math-pro");
        if (this.state.xp >= 5000) this.unlockBadge("huyen-thoai-math-legend");
        if (this.state.streak >= 30) this.unlockBadge("streak-math-30");
        if ((this.state.completedLessonTheory || []).length >= 10) this.unlockBadge("lam-chu-ly-thuyet-math");
    },

    // Mở khóa một huy hiệu
    unlockBadge: function(badgeId) {
        if (!this.state.badges.includes(badgeId)) {
            this.state.badges.push(badgeId);
            this.saveProgress();
            this.updateHeaderStats();

            // Kích hoạt âm thanh mở huy hiệu
            this.audio.playBadge();

            // Kích hoạt pháo hoa giấy chúc mừng
            this.confetti.start();

            // Kiểm tra xem Splash Screen có đang hiển thị hay không
            const splashScreen = document.getElementById("splash-screen");
            const isSplashVisible = splashScreen && splashScreen.style.display !== "none" && !splashScreen.classList.contains("hidden");

            if (isSplashVisible) {
                // Đưa vào hàng đợi để hiển thị sau khi nhấn "Bắt đầu học tập"
                if (!this.pendingBadges) this.pendingBadges = [];
                if (!this.pendingBadges.includes(badgeId)) {
                    this.pendingBadges.push(badgeId);
                }
            } else {
                // Hiển thị trực tiếp nếu ứng dụng đã khởi chạy xong
                this.showBadgePopup(badgeId);
            }

            // Tự động kiểm tra huy hiệu tối thượng Đại Sứ Toán Học Toàn Năng (master-of-math)
            if (badgeId !== "master-of-math") {
                const allBadgesExceptMaster = this.systemBadges.filter(b => b.id !== "master-of-math");
                const hasAllOthers = allBadgesExceptMaster.every(b => this.state.badges.includes(b.id));
                if (hasAllOthers) {
                    this.unlockBadge("master-of-math");
                }
            }
        }
    },

    // Hiển thị popup thông báo Huy hiệu
    showBadgePopup: function(badgeId) {
        const badge = this.systemBadges.find(b => b.id === badgeId);
        if (badge) {
            const parentName = this.config.parentName || 'Bố';
            const studentName = this.config.studentName || 'Con';
            document.querySelector(".badge-icon-lg").innerText = badge.icon;
            document.querySelector(".badge-title-popup").innerText = `${parentName} chúc mừng ${studentName}! 🎉`;
            document.querySelector(".badge-desc-popup").innerText = `Con đã xuất sắc đạt huy hiệu: "${badge.name}" (${badge.desc}). ${parentName} rất tự hào về con!`;
            document.getElementById("badge-popup").classList.remove("hidden");
        }
    },

    // Ghi nhận thời gian học (Giả lập tăng thời lượng học theo ngày trong tuần)
    logLearningTime: function(minutes) {
        const todayIndex = new Date().getDay(); // 0: Chủ nhật, 1: Thứ hai...
        if (!this.state.learningTimeWeek) {
            this.state.learningTimeWeek = [0, 0, 0, 0, 0, 0, 0]; // 7 ngày trong tuần
        }
        this.state.learningTimeWeek[todayIndex] += minutes;
        this.saveProgress();
    },

    // Ghi nhận kết quả trả lời câu hỏi (phục vụ biểu đồ Đúng/Sai của phụ huynh)
    saveQuestionResult: function(lessonId, questionType, isCorrect, skipSave = false) {
        if (!this.state.history) {
            this.state.history = [];
        }
        
        // Thêm bản ghi mới
        this.state.history.push({
            date: new Date().toISOString(),
            lessonId: lessonId,
            questionType: questionType,
            isCorrect: isCorrect
        });

        // Chỉ giữ lại tối đa 200 bản ghi lịch sử gần nhất để tiết kiệm bộ nhớ LocalStorage
        if (this.state.history.length > 200) {
            this.state.history.shift();
        }

        if (!skipSave) {
            this.saveProgress();
        }
    },

    // Theme (Light/Green mode)
    initTheme: function() {
        const savedTheme = localStorage.getItem("toan6_theme");
        // Mặc định là xanh lá (green) nếu chưa lưu cấu hình, hoặc nếu lưu là green
        if (savedTheme === 'light') {
            document.body.classList.add("light-mode");
            document.body.classList.remove("green-mode");
            this.isDarkMode = false;
        } else {
            document.body.classList.add("green-mode");
            document.body.classList.remove("light-mode");
            this.isDarkMode = true;
        }
        this.updateThemeIcon();
    },

    toggleTheme: function() {
        this.isDarkMode = !this.isDarkMode;
        if (this.isDarkMode) {
            document.body.classList.add("green-mode");
            document.body.classList.remove("light-mode");
            localStorage.setItem("toan6_theme", "green");
        } else {
            document.body.classList.add("light-mode");
            document.body.classList.remove("green-mode");
            localStorage.setItem("toan6_theme", "light");
        }
        this.updateThemeIcon();
        
        // Nếu đang ở màn hình phụ huynh thì cần vẽ lại biểu đồ để khớp màu sắc Green/Light
        const screenParent = document.getElementById("screen-parent");
        const parentDashboardContent = document.getElementById("parent-dashboard-content");
        if (screenParent && !screenParent.classList.contains("hidden") && 
            parentDashboardContent && !parentDashboardContent.classList.contains("hidden")) {
            if (typeof parentDashboard !== 'undefined' && typeof parentDashboard.renderCharts === 'function') {
                parentDashboard.renderCharts();
            }
        }
    },

    updateThemeIcon: function() {
        const toggleBtn = document.getElementById("theme-toggle");
        if (this.isDarkMode) {
            // Khi đang ở Green Mode (Lá): hiển thị icon Mặt trăng để bấm chuyển sang Đêm Dạ Lục
            toggleBtn.innerHTML = `<i class="fa-solid fa-moon" style="color:#FFD700; filter: drop-shadow(0 0 4px rgba(255,215,0,0.5));" title="Chuyển sang Giao diện Đêm Dạ Lục"></i>`;
        } else {
            // Khi đang ở Đêm Dạ Lục: hiển thị icon chiếc lá để bấm chuyển sang Green Mode
            toggleBtn.innerHTML = `<i class="fa-solid fa-leaf" style="color:#2E7D32; filter: drop-shadow(0 0 4px rgba(46,125,50,0.4));" title="Chuyển sang Giao diện Lá Dịu Mắt"></i>`;
        }
    },

    // Modal Huy hiệu học sinh
    openBadgesModal: function() {
        // Cập nhật tiêu đề modal với tên học sinh hiện tại
        const modalTitle = document.getElementById("badges-modal-title");
        if (modalTitle) modalTitle.innerHTML = `🏅 Bộ sưu tập Huy hiệu của ${this.config.studentName || 'Học sinh'}`;

        const container = document.getElementById("badges-grid-container");
        container.innerHTML = "";

        this.systemBadges.forEach(badge => {
            const isUnlocked = this.state.badges.includes(badge.id);
            const badgeDiv = document.createElement("div");
            badgeDiv.className = `badge-item ${isUnlocked ? 'unlocked animate-bounce-in' : 'locked'}`;
            badgeDiv.innerHTML = `
                <div class="badge-item-icon">${badge.icon}</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-desc">${badge.desc}</div>
                ${isUnlocked ? '<small style="color:var(--success);font-weight:700;"><i class="fa-solid fa-check"></i> Đã mở</small>' : '<small style="color:var(--text-muted);"><i class="fa-solid fa-lock"></i> Chưa đạt</small>'}
            `;
            container.appendChild(badgeDiv);
        });

        document.getElementById("badges-modal").classList.remove("hidden");
    },

    closeBadgesModal: function() {
        document.getElementById("badges-modal").classList.add("hidden");
    },

    openMathShopModal: function() {
        document.getElementById("math-shop-modal").classList.remove("hidden");
        this.renderMathShop();
    },

    closeMathShopModal: function() {
        document.getElementById("math-shop-modal").classList.add("hidden");
    },

    renderMathShop: function() {
        const container = document.getElementById("math-shop-modal-body");
        if (!container) return;

        const currentXp = this.state.xp || 0;
        if (!this.state.goldBadges) this.state.goldBadges = [];

        const shopBadgesHtml = this.systemBadges.map(badge => {
            const isUnlocked = this.state.badges.includes(badge.id);
            const isGold = this.state.goldBadges.includes(badge.id);

            let statusText = "";
            let btnHtml = "";

            if (isGold) {
                statusText = `<span style="color:#eab308; font-weight:800; font-size:0.85rem;"><i class="fa-solid fa-star"></i> ĐÃ MẠ VÀNG LẤP LÁNH</span>`;
                btnHtml = `<button class="btn-primary" disabled style="background:rgba(251,191,36,0.15); color:#fbbf24; border:1px solid rgba(251,191,36,0.4); padding:8px 20px; border-radius:10px; font-weight:900; width:100%; cursor:not-allowed; opacity:1;">Tối Đa Cấp Độ</button>`;
            } else if (isUnlocked) {
                statusText = `<span style="color:#10b981; font-weight:800; font-size:0.85rem;"><i class="fa-solid fa-lock-open"></i> Đã mở khóa huy hiệu</span>`;
                btnHtml = `<button class="btn-primary" onclick="app.upgradeGoldBadge('${badge.id}')" style="background:linear-gradient(135deg, #eab308, #d97706); border:none; padding:8px 20px; border-radius:10px; color:white; font-weight:800; cursor:pointer; width:100%; box-shadow:0 4px 6px rgba(234,179,8,0.2);">Mạ vàng (350 XP)</button>`;
            } else {
                statusText = `<span style="color:#ef4444; font-weight:800; font-size:0.85rem;"><i class="fa-solid fa-lock"></i> Chưa mở khóa huy hiệu</span>`;
                btnHtml = `<button class="btn-primary" disabled style="background:#cbd5e1; color:#94a3b8; border:none; padding:8px 20px; border-radius:10px; font-weight:800; width:100%; cursor:not-allowed;">Cần mở khóa trước</button>`;
            }

            return `
                <div class="eng-shop-card ${isGold ? 'gold-card-royal gold-card-royal-shine' : ''}" style="background:var(--bg-card); border: 2px solid ${isGold ? 'transparent' : 'var(--border-color)'}; border-radius:20px; padding:1.5rem; text-align:center; display:flex; flex-direction:column; justify-content:space-between; align-items:center; min-height:240px; height:100%;">
                    <div>
                        <div style="font-size:2.8rem; margin-bottom:0.4rem; filter: ${isUnlocked ? 'none' : 'grayscale(1) opacity(0.5)'};">${badge.icon}</div>
                        <div style="font-weight:900; font-size:1.1rem; color:var(--text-main); margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;" class="${isGold ? 'gold-title-glow' : ''}">${badge.name}</div>
                        <div style="font-size:0.8rem; color:${isGold ? '#a7f3d0' : '#64748b'}; margin-bottom:0.5rem; min-height:36px; display:flex; align-items:center; justify-content:center; line-height:1.3;">${badge.desc}</div>
                    </div>
                    <div style="width:100%;">
                        <div style="margin-bottom:0.6rem;">${statusText}</div>
                        ${btnHtml}
                    </div>
                </div>
            `;
        }).join("");

        container.innerHTML = `
            <div style="background:linear-gradient(135deg, rgba(234,179,8,0.1), rgba(16,185,129,0.1)); border: 1px solid rgba(16,185,129,0.2); padding:1.2rem; border-radius:16px; margin-bottom:1.5rem; text-align:center;">
                <h4 style="margin:0; font-size:1.25rem; font-weight:900; color:#059669; display:flex; align-items:center; justify-content:center; gap:0.5rem;"><i class="fa-solid fa-crown" style="color:#eab308;"></i> Tiệm Mạ Vàng Huy Hiệu Toán Học</h4>
                <p style="margin:6px 0 0 0; font-size:0.88rem; color:#475569; font-weight:600;">Sử dụng điểm tích lũy <b>XP</b> Toán học để mạ vàng các huy hiệu đã đạt được. Huy hiệu mạ vàng dùng để quy đổi sang giờ chơi game!</p>
                <div style="font-size:1.1rem; font-weight:800; color:#ea580c; margin-top:8px;">Số dư hiện có: <span style="background:#ffedd5; padding:2px 12px; border-radius:12px;">⭐ ${currentXp} XP</span></div>
            </div>
            <div class="eng-shop-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1.5rem; padding:0.5rem 0;">
                ${shopBadgesHtml}
            </div>
        `;
    },

    upgradeGoldBadge: function(badgeId) {
        const currentXp = this.state.xp || 0;
        const cost = 350;
        if (currentXp < cost) {
            Swal.fire("Không đủ XP ❌", `Con cần tích lũy thêm ${cost - currentXp} XP để mạ vàng huy hiệu này!`, "error");
            return;
        }

        if (!this.state.goldBadges) this.state.goldBadges = [];
        if (this.state.goldBadges.includes(badgeId)) return;

        this.state.xp = currentXp - cost;
        this.state.goldBadges.push(badgeId);
        this.saveProgress();

        const badge = this.systemBadges.find(b => b.id === badgeId);

        // Kích hoạt pháo hoa giấy chúc mừng
        if (this.confetti && typeof this.confetti.start === 'function') {
            this.confetti.start();
        }

        Swal.fire({
            title: "Mạ Vàng Thành Công! ✨🏆✨",
            html: `Chúc mừng con đã nâng cấp thành công huy hiệu <b>"${badge.name}"</b> sang phiên bản Mạ vàng hoàng gia!<br/>Số dư XP còn lại: <b>${this.state.xp} XP</b>`,
            icon: "success",
            confirmButtonColor: "#eab308",
            backdrop: `
                rgba(234,179,8,0.18)
            `
        });

        this.renderMathShop();
        this.updateHeaderStats();
    },

    requestEvaluation: function() {
        const token = sessionStorage.getItem("adminToken");
        if (token) {
            this.openEvaluationModal();
        } else {
            Swal.fire({
                title: "Xác minh Phụ huynh",
                text: "Vui lòng nhập mã PIN quản lý để xem báo cáo đánh giá chất lượng học sinh:",
                input: "password",
                inputAttributes: {
                    maxlength: "15",
                    autocapitalize: "off",
                    autocorrect: "off",
                    style: "text-align: center; font-size: 1.2rem; letter-spacing: 0.1em;"
                },
                showCancelButton: true,
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy",
                confirmButtonColor: "#8b5cf6",
                preConfirm: async (password) => {
                    if (!password) {
                        Swal.showValidationMessage("Vui lòng nhập mã PIN!");
                        return false;
                    }
                    try {
                        const res = await fetch(app.getApiUrl("/api/admin/login"), {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ password })
                        });
                        if (!res.ok) {
                            const errData = await res.json();
                            throw new Error(errData.error || "Mã PIN không chính xác!");
                        }
                        const data = await res.json();
                        sessionStorage.setItem("adminToken", data.token);
                        return true;
                    } catch (err) {
                        Swal.showValidationMessage(err.message);
                        return false;
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    app.openEvaluationModal();
                }
            });
        }
    },

    openEvaluationModal: function() {
        // 1. Tính toán số liệu thống kê thực tế từ this.state
        const historyList = this.state.history || [];
        const totalSecs = historyList.reduce((acc, h) => acc + (h.duration || 0), 0);
        const totalMins = Math.round(totalSecs / 60);

        const completedCount = this.state.completedSubtopics ? this.state.completedSubtopics.length : 0;

        let totalQuestions = 0;
        let totalCorrect = 0;
        historyList.forEach(h => {
            totalQuestions += (h.totalQuestions || 0);
            totalCorrect += (h.correctCount || 0);
        });
        const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
        const streak = this.state.streak || 0;

        // Cập nhật lên UI
        const timeEl = document.getElementById("eval-time");
        const completedEl = document.getElementById("eval-completed");
        const accuracyEl = document.getElementById("eval-accuracy");
        const streakEl = document.getElementById("eval-streak");

        if (timeEl) timeEl.innerText = `${totalMins} phút`;
        if (completedEl) completedEl.innerText = `${completedCount} bài`;
        if (accuracyEl) accuracyEl.innerText = `${accuracy}%`;
        if (streakEl) streakEl.innerText = `${streak} ngày`;

        // 2. Hiển thị modal
        const modal = document.getElementById("evaluation-modal");
        if (modal) modal.classList.remove("hidden");

        // 3. Tải nhận xét AI
        this.refreshEvaluationAiAnalysis(false);
    },

    closeEvaluationModal: function() {
        const modal = document.getElementById("evaluation-modal");
        if (modal) modal.classList.add("hidden");
    },

    refreshEvaluationAiAnalysis: async function(forceRefresh = true) {
        const adviceEl = document.getElementById("eval-ai-advice");
        const refreshBtn = document.getElementById("btn-eval-refresh-ai");
        if (!adviceEl) return;

        adviceEl.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding:1.5rem 0;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size:2rem; color:var(--primary); margin-bottom:0.8rem;"></i>
                <span style="font-size:0.9rem; color:var(--text-muted);">Trợ lý AI đang đánh giá kết quả làm bài của con...</span>
            </div>
        `;
        if (refreshBtn) refreshBtn.disabled = true;

        try {
            const token = sessionStorage.getItem("adminToken");
            const res = await fetch(this.getApiUrl("/api/ai-analysis"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    history: this.state.history || [],
                    examSessions: this.state.examSessions || [],
                    xp: this.state.xp || 0,
                    scores: this.state.scores || {},
                    studentName: this.config.studentName || 'Con',
                    parentName: this.config.parentName || 'Phụ huynh',
                    classLevel: this.config.currentClass || '6'
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Không thể lấy phân tích từ AI.");
            }

            const data = await res.json();
            let parsedHtml = "";
            if (typeof marked !== "undefined") {
                parsedHtml = marked.parse(data.analysis || "Không có nhận xét nào.");
            } else {
                parsedHtml = data.analysis || "Không có nhận xét nào.";
            }
            
            adviceEl.innerHTML = parsedHtml;

            // Render sơ đồ Mermaid nếu có
            if (typeof mermaid !== "undefined") {
                setTimeout(() => {
                    try {
                        const mermaidBlocks = adviceEl.querySelectorAll(".language-mermaid");
                        mermaidBlocks.forEach((block) => {
                            const graphDefinition = block.textContent;
                            const container = document.createElement("div");
                            container.className = "mermaid";
                            container.textContent = graphDefinition;
                            block.parentNode.replaceChild(container, block);
                        });
                        mermaid.run();
                    } catch(me) {
                        console.warn("Mermaid error in evaluation:", me);
                    }
                }, 100);
            }

        } catch (err) {
            console.error("Lỗi AI Analysis trong Evaluation Modal:", err);
            
            let errMsg = err.message || "Đã xảy ra lỗi không xác định.";
            if (errMsg.includes("API Key") || errMsg.includes("quota") || errMsg.includes("limit")) {
                errMsg = "Các khóa API Key đi kèm bản Clean đã hết lượt sử dụng miễn phí trong ngày (Google giới hạn số lượt dùng mỗi ngày). Phụ huynh vui lòng bấm vào góc 'Phụ Huynh' ở trên bên phải màn hình để cập nhật API Key mới miễn phí của riêng mình nhé!";
            }

            adviceEl.innerHTML = `
                <div style="color:var(--danger); font-weight:700; text-align:center; padding:1.5rem 0;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size:1.8rem; margin-bottom:0.5rem; display:block;"></i>
                    Lỗi Cố vấn AI: ${errMsg}
                </div>
            `;
        } finally {
            if (refreshBtn) refreshBtn.disabled = false;
        }
    },

    collapseSidebar: function() {
        const sidebar = document.getElementById("timeline-sidebar");
        if (sidebar) {
            sidebar.classList.add("collapsed");
        }
    },

    expandSidebar: function() {
        const sidebar = document.getElementById("timeline-sidebar");
        if (sidebar) {
            sidebar.classList.remove("collapsed");
        }
    },

    enterFullscreen: function(element) {
        try {
            let promise;
            if (element.requestFullscreen) {
                promise = element.requestFullscreen();
            } else if (element.mozRequestFullScreen) {
                promise = element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                promise = element.webkitRequestFullscreen();
            } else if (element.msRequestFullscreen) {
                promise = element.msRequestFullscreen();
            }
            if (promise && typeof promise.catch === 'function') {
                promise.catch(err => {
                    console.warn("Fullscreen request rejected:", err);
                });
            }
        } catch (e) {
            console.warn("Failed to enter fullscreen mode:", e);
        }
    },

    exitFullscreen: function() {
        try {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            // Khôi phục thanh cuộn cho body và html phòng trường hợp trình duyệt bị kẹt
            setTimeout(() => {
                this.restoreScrollbar();
            }, 100);
        } catch (e) {
            console.warn("Failed to exit fullscreen mode:", e);
        }
    },

    // Khôi phục thanh cuộn và dọn dẹp các class ngăn cuộn của SweetAlert2
    restoreScrollbar: function() {
        try {
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            document.body.classList.remove("swal2-shown", "swal2-height-auto");
            document.documentElement.classList.remove("swal2-shown", "swal2-height-auto");
            document.body.style.overflowX = "hidden";
        } catch (e) {
            console.warn("Failed to restore scrollbar:", e);
        }
    },

    initFullscreenListeners: function() {
        const handleFullscreenChange = () => {
            const isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
            if (!isFullscreen) {
                if (document.body.classList.contains("video-fullscreen-active")) {
                    this.stopVideo();
                }
                document.body.classList.remove("practice-fullscreen-active");
                
                // Tự động gọi thoát làm trắc nghiệm/game một cách đàng hoàng nếu thoát fullscreen lúc đang làm bài
                const practiceActiveBox = document.getElementById("practice-active-box");
                if (practiceActiveBox && !practiceActiveBox.classList.contains("hidden")) {
                    if (window.questions && typeof questions.exitPractice === 'function' && !questions.isExiting) {
                        questions.exitPractice();
                    }
                }
            }
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
        document.addEventListener("mozfullscreenchange", handleFullscreenChange);
        document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    },

    playVideoFullscreen: function(videoId) {
        const videoWrapper = document.getElementById("global-fullscreen-video-wrapper") || 
                             document.getElementById("english-video-wrapper");
        if (!videoWrapper) return;

        videoWrapper.style.display = "block";

        this.enterFullscreen(videoWrapper);
        document.body.classList.add("video-fullscreen-active");

        videoWrapper.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&vq=hd1080" 
                title="Bài giảng" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
            <button class="btn-exit-video-fullscreen" onclick="app.exitVideoFullscreen()">&times; Thoát rạp chiếu</button>
        `;
    },

    exitVideoFullscreen: function() {
        this.exitFullscreen();
        this.stopVideo();
    },

    stopVideo: function() {
        document.body.classList.remove("video-fullscreen-active");
        
        const videoWrapper = document.getElementById("global-fullscreen-video-wrapper") || 
                             document.getElementById("english-video-wrapper");
        if (videoWrapper) {
            videoWrapper.innerHTML = "";
            videoWrapper.style.display = "none";
        }
        
        const exitBtn = document.querySelector(".btn-exit-video-fullscreen");
        if (exitBtn) {
            exitBtn.remove();
        }
    },

    // Vận hành Dạng bài (Subtopics)
    renderSubtopicsTimeline: function() {
        const container = document.getElementById("subtopics-list-container");
        if (!container) return;
        container.innerHTML = "";

        const lesson = this.currentLesson;
        if (!lesson) return;

        const sidebar = document.querySelector(".subtopics-timeline-sidebar");
        const actionBtn = document.getElementById("btn-practice-subtopic");
        const methodBox = document.getElementById("subtopic-method-html");
        const exampleBox = document.getElementById("subtopic-example-html");

        const subtopics = lesson.subtopics || [];
        if (subtopics.length === 0) {
            if (sidebar) sidebar.style.display = "none";
            if (actionBtn) actionBtn.style.display = "none";
            if (methodBox) methodBox.innerHTML = lesson.theoryHtml || "";
            if (exampleBox) exampleBox.innerHTML = "";
            
            // Nạp video bài học
            const videoId = this.getLessonVideoId(lesson.id);
            this.renderVideoPlayer("video-wrapper", videoId, lesson.id, lesson.id);

            if (window.renderMathInElement) {
                window.renderMathInElement(methodBox, {
                    delimiters: [
                        {left: "$$", right: "$$", display: true},
                        {left: "$", right: "$", display: false}
                    ]
                });
            }
            return;
        }

        // Nếu có subtopics
        if (sidebar) sidebar.style.display = "block";
        if (actionBtn) actionBtn.style.display = "inline-block";

        const isLessonPassed = (this.state.scores[lesson.id] || 0) >= 80;
        const theoryCompleted = this.state.completedLessonTheory && this.state.completedLessonTheory.includes(lesson.id);

        // 1. Render mục Kiến thức giáo khoa (Lý thuyết chung) lên trên đầu
        const theoryDiv = document.createElement("div");
        let theoryStatusClass = theoryCompleted || isLessonPassed ? "completed" : "active";
        let theoryStatusIcon = theoryCompleted || isLessonPassed 
            ? `<i class="fa-solid fa-circle-check" style="color:var(--success);"></i>` 
            : `<i class="fa-solid fa-bolt animate-pulse-soft" style="color:var(--warning);"></i>`;
            
        theoryDiv.className = `subtopic-timeline-item ${theoryStatusClass}`;
        if (this.currentSubtopicId === lesson.id + "-theory") {
            theoryDiv.classList.add("current");
        }
        
        theoryDiv.onclick = () => {
            this.showTheoryDetail(lesson.id);
        };
        
        theoryDiv.innerHTML = `
            <div class="subtopic-item-icon">${theoryStatusIcon}</div>
            <div class="subtopic-item-content">
                <div class="subtopic-item-title" style="font-weight:700; font-size:0.85rem; line-height:1.3; color: var(--primary);">📖 Kiến thức giáo khoa</div>
            </div>
        `;
        
        const theoryPracticeBtn = document.createElement("button");
        if (theoryCompleted || isLessonPassed) {
            theoryPracticeBtn.className = "btn-subtopic-practice good";
            theoryPracticeBtn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Đã học xong lý thuyết`;
        } else {
            theoryPracticeBtn.className = "btn-subtopic-practice not-started";
            theoryPracticeBtn.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Nhấn để học lý thuyết`;
        }
        theoryPracticeBtn.onclick = (e) => {
            e.stopPropagation();
            this.showTheoryDetail(lesson.id);
        };
        
        const theoryWrapper = document.createElement("div");
        theoryWrapper.className = "subtopic-card-wrapper";
        theoryWrapper.style.marginBottom = "1.2rem";
        theoryWrapper.appendChild(theoryDiv);
        theoryWrapper.appendChild(theoryPracticeBtn);
        container.appendChild(theoryWrapper);

        // 2. Render các Dạng bài học tiếp theo
        let firstActiveId = null;

        subtopics.forEach((sub, idx) => {
            const isCompleted = this.state.completedSubtopics.includes(sub.id);
            let isLocked = false;

            if (!isLessonPassed) {
                if (idx === 0) {
                    // Dạng 1 bị khóa nếu chưa học xong lý thuyết chung
                    if (!theoryCompleted) {
                        isLocked = true;
                    }
                } else {
                    // Các dạng tiếp theo bị khóa nếu dạng trước chưa xong
                    const prevSub = subtopics[idx - 1];
                    const prevCompleted = this.state.completedSubtopics.includes(prevSub.id);
                    if (!prevCompleted) {
                        isLocked = true;
                    }
                }
            }

            let statusClass = "locked";
            let statusIcon = `<i class="fa-solid fa-lock" style="color:var(--text-muted);"></i>`;

            if (isCompleted || isLessonPassed) {
                statusClass = "completed";
                statusIcon = `<i class="fa-solid fa-circle-check" style="color:var(--success);"></i>`;
            } else if (!isLocked) {
                statusClass = "active";
                statusIcon = `<i class="fa-solid fa-bolt animate-pulse-soft" style="color:var(--warning);"></i>`;
                if (!firstActiveId) {
                    firstActiveId = sub.id;
                }
            }

            const itemDiv = document.createElement("div");
            itemDiv.className = `subtopic-timeline-item ${statusClass}`;
            if (this.currentSubtopicId === sub.id) {
                itemDiv.classList.add("current");
            }
            
            itemDiv.onclick = () => {
                if (!isLocked) {
                    this.showSubtopicDetail(sub.id);
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Dạng bài này đang bị khóa',
                        text: `${app.config.studentName || 'Con'} cần hoàn thành phần Kiến thức giáo khoa hoặc dạng bài trước đó để mở khóa dạng này nhé!`,
                        target: document.getElementById('tab-theory') || 'body',
                        confirmButtonText: 'Con đã rõ',
                        confirmButtonColor: 'var(--primary)'
                    });
                }
            };

            const score = this.state.subtopicScores ? this.state.subtopicScores[sub.id] : undefined;
            const scoreLabel = score !== undefined && score > 0 ? `<span style="font-size:0.75rem; font-weight:700; color:var(--primary); margin-left: auto;">${score}%</span>` : "";

            itemDiv.innerHTML = `
                <div class="subtopic-item-icon">${statusIcon}</div>
                <div class="subtopic-item-content">
                    <div class="subtopic-item-title" style="font-weight:700; font-size:0.85rem; line-height:1.3;">${sub.title}</div>
                </div>
                ${scoreLabel}
            `;

            // Tạo nút Luyện tập hiển thị ngay dưới Dạng bài
            const practiceBtn = document.createElement("button");
            let btnClass = "";
            let btnText = "";
            let btnIcon = "";

            if (isLocked) {
                btnClass = "locked";
                btnText = "Chưa mở khóa";
                btnIcon = `<i class="fa-solid fa-lock"></i>`;
            } else if (score === undefined || score === null) {
                btnClass = "not-started";
                btnText = "Bắt đầu Luyện tập";
                btnIcon = `<i class="fa-solid fa-play"></i>`;
            } else if (score < 70) {
                btnClass = "failed";
                btnText = `Luyện tập lại (Chưa đạt: ${score}%)`;
                btnIcon = `<i class="fa-solid fa-rotate-left"></i>`;
            } else if (score < 80) {
                btnClass = "average";
                btnText = `Luyện tập lại (Khá: ${score}%)`;
                btnIcon = `<i class="fa-solid fa-rotate-left"></i>`;
            } else if (score < 95) {
                btnClass = "good";
                btnText = `Luyện tập lại (Giỏi: ${score}%)`;
                btnIcon = `<i class="fa-solid fa-circle-check"></i>`;
            } else {
                btnClass = "excellent";
                btnText = `Luyện tập lại (Xuất sắc: ${score}%)`;
                btnIcon = `<i class="fa-solid fa-crown"></i>`;
            }

            practiceBtn.className = `btn-subtopic-practice ${btnClass}`;
            practiceBtn.innerHTML = `${btnIcon} ${btnText}`;
            
            // Click vào nút sẽ chuyển đến luyện tập dạng bài
            practiceBtn.onclick = (e) => {
                e.stopPropagation(); // Ngăn sự kiện click lan truyền lên itemDiv
                if (!isLocked) {
                    this.startPracticeSubtopic(sub.id);
                } else {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Dạng bài này đang bị khóa',
                        text: `${app.config.studentName || 'Con'} cần hoàn thành phần Kiến thức giáo khoa hoặc dạng bài trước đó để mở khóa dạng này nhé!`,
                        target: document.getElementById('tab-theory') || 'body',
                        confirmButtonText: 'Con đã rõ',
                        confirmButtonColor: 'var(--primary)'
                    });
                }
            };

            // Bọc cả item thông tin và nút Luyện tập vào trong Card Wrapper
            const cardWrapper = document.createElement("div");
            cardWrapper.className = "subtopic-card-wrapper";
            cardWrapper.style.marginBottom = "1.2rem";
            cardWrapper.appendChild(itemDiv);
            cardWrapper.appendChild(practiceBtn);

            container.appendChild(cardWrapper);
        });

        // 3. Tự động điều hướng mặc định khi mới vào bài học
        if (!this.currentSubtopicId) {
            this.showTheoryDetail(lesson.id);
        } else {
            if (this.currentSubtopicId === lesson.id + "-theory") {
                this.showTheoryDetail(lesson.id);
            } else {
                const curIdx = subtopics.findIndex(s => s.id === this.currentSubtopicId);
                if (curIdx > 0) {
                    const prevSub = subtopics[curIdx - 1];
                    if (!this.state.completedSubtopics.includes(prevSub.id)) {
                        if (!theoryCompleted) {
                            this.showTheoryDetail(lesson.id);
                        } else if (firstActiveId) {
                            this.showSubtopicDetail(firstActiveId);
                        }
                    } else {
                        this.showSubtopicDetail(this.currentSubtopicId);
                    }
                } else if (curIdx === 0) {
                    if (!theoryCompleted) {
                        this.showTheoryDetail(lesson.id);
                    } else {
                        this.showSubtopicDetail(this.currentSubtopicId);
                    }
                } else {
                    this.showTheoryDetail(lesson.id);
                }
            }
        }
    },

    showSubtopicDetail: function(subtopicId) {
        this.currentSubtopicId = subtopicId;
        const lesson = this.currentLesson;
        if (!lesson) return;

        const subtopic = lesson.subtopics.find(s => s.id === subtopicId);
        if (!subtopic) return;

        // Ẩn nút xác nhận học xong lý thuyết chung
        const theoryActionBar = document.getElementById("theory-action-bar");
        if (theoryActionBar) {
            theoryActionBar.style.display = "none";
        }

        const items = document.querySelectorAll(".subtopic-timeline-item");
        const subtopics = lesson.subtopics || [];
        const idx = subtopics.findIndex(s => s.id === subtopicId);
        items.forEach((item, i) => {
            if (i === idx + 1) { // Cộng 1 vì items[0] là mục Kiến thức giáo khoa
                item.classList.add("current");
            } else {
                item.classList.remove("current");
            }
        });

        const isEnglish = lesson.subject === "english" || this.currentSubject === "english";
        let methodHtml = subtopic.methodology || "";
        let exampleHtml = subtopic.example || "";

        if (isEnglish) {
            methodHtml = `
                <div class="duo-subtopic-box card">
                    <h4 style="color: var(--primary); font-size: 1.1rem; font-weight: 800; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fa-solid fa-star" style="color: var(--success);"></i> ${subtopic.title}
                    </h4>
                    <div style="line-height:1.6; color: var(--text-main);">${subtopic.methodology || ""}</div>
                </div>
            `;
            exampleHtml = `
                <div class="duo-subtopic-box card" style="margin-top: 1.2rem;">
                    <h4 style="color: var(--warning); font-size: 1.1rem; font-weight: 800; margin-bottom: 0.8rem; display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fa-solid fa-lightbulb"></i> Ví dụ thực hành
                    </h4>
                    <div style="line-height:1.6; color: var(--text-main);">${subtopic.example || ""}</div>
                </div>
            `;
            
            const videoId = this.getSubtopicVideoId(subtopicId, lesson.id);
            const videoWrapper = document.getElementById("video-wrapper");
            if (videoWrapper) {
                if (videoId) {
                    videoWrapper.parentNode.style.display = "block";
                    this.renderVideoPlayer("video-wrapper", videoId, subtopicId, lesson.id);
                } else {
                    videoWrapper.parentNode.style.display = "none";
                }
            }
        } else {
            const videoWrapper = document.getElementById("video-wrapper");
            if (videoWrapper) {
                videoWrapper.parentNode.style.display = "block";
            }
            const videoId = this.getSubtopicVideoId(subtopicId, lesson.id);
            this.renderVideoPlayer("video-wrapper", videoId, subtopicId, lesson.id);
        }

        document.getElementById("subtopic-method-html").innerHTML = methodHtml;
        document.getElementById("subtopic-example-html").innerHTML = exampleHtml;

        if (window.renderMathInElement) {
            window.renderMathInElement(document.getElementById("subtopic-method-html"), {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ]
            });
            window.renderMathInElement(document.getElementById("subtopic-example-html"), {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ]
            });
        }
    },

    getWordEmoji: function(word) {
        const mapping = {
            "book": "📚", "ball": "⚽", "bike": "🚲", "bill": "👦", "cat": "🐱", "car": "🚗", "cup": "🥤", "cake": "🍰",
            "vietnam": "🇻🇳", "america": "🇺🇸", "england": "🇬🇧", "japan": "🇯🇵", "malaysia": "🇲🇾", "australia": "🇦🇺",
            "vietnamese": "🇻🇳", "american": "🇺🇸", "english": "🇬🇧", "japanese": "🇯🇵", "malaysian": "🇲🇾", "australian": "🇦🇺",
            "time": "⏰", "clock": "🕒", "fifteen": "1️⃣5️⃣", "thirty": "3️⃣0️⃣", "forty": "4️⃣0️⃣", "fifty": "5️⃣0️⃣",
            "calculator": "🧮", "compass": "🧭", "uniform": "👔", "pencil": "✏️", "sharpener": "🪒", "study": "📖", "sports": "⚽",
            "playing": "🎮", "writing": "✍️", "listening": "🎧", "reading": "📚", "learning": "🧠",
            "bedroom": "🛏️", "kitchen": "🍳", "bathroom": "🛁", "wardrobe": "👔", "cupboard": "🚪", "fridge": "🧊",
            "friend": "👫", "school": "🏫", "classroom": "🏫", "teacher": "👩‍🏫", "student": "🧑‍🎓", "desk": "🪑", "chair": "🪑",
            "pen": "🖊️", "ruler": "📏", "rubber": "🧽", "pencil case": "👝", "notebook": "📓", "sofa": "🛋️", "table": "🫵"
        };
        const w = word.toLowerCase().trim();
        return mapping[w] || "✨";
    },

    getWordTranslation: function(word) {
        const mapping = {
            "book": "cuốn sách", "ball": "quả bóng", "bike": "xe đạp", "bill": "bé Bill (tên riêng)", "cat": "con mèo", "car": "xe ô tô", "cup": "cái cốc", "cake": "bánh ngọt",
            "vietnam": "nước Việt Nam", "america": "nước Mỹ", "england": "nước Anh", "japan": "nước Nhật Bản", "malaysia": "nước Ma-lay-xi-a", "australia": "nước Úc",
            "vietnamese": "người/tiếng Việt Nam", "american": "người/tiếng Mỹ", "english": "người/tiếng Anh", "japanese": "người/tiếng Nhật", "malaysian": "người/tiếng Ma-lay-xi-a", "australian": "người/tiếng Úc",
            "time": "thời gian / giờ", "clock": "đồng hồ", "fifteen": "số mười lăm", "thirty": "số ba mươi", "forty": "số bốn mươi", "fifty": "số năm mươi",
            "calculator": "máy tính cầm tay", "compass": "com-pa", "uniform": "đồng phục", "pencil": "bút chì", "sharpener": "gọt bút chì", "study": "học tập", "sports": "thể thao",
            "playing": "đang chơi", "writing": "đang viết", "listening": "đang nghe", "reading": "đang đọc", "learning": "đang học",
            "bedroom": "phòng ngủ", "kitchen": "nhà bếp", "bathroom": "phòng tắm", "wardrobe": "tủ quần áo", "cupboard": "tủ chén đĩa / tủ ly", "fridge": "tủ lạnh"
        };
        const w = word.toLowerCase().trim();
        return mapping[w] || "từ vựng bài học";
    },

    renderEnglishVocabularyLab: function(lesson) {
        const words = lesson.spellingWords || [];
        const phrases = lesson.audioPhrases || {};
        if (words.length === 0) return "";

        let cardsHtml = "";
        words.forEach((word) => {
            const emoji = this.getWordEmoji(word);
            const translation = this.getWordTranslation(word);
            const phrase = phrases[word] || "";
            
            cardsHtml += `
                <div class="flashcard-card-3d" onclick="this.classList.toggle('flipped')">
                    <div class="flashcard-card-3d-inner">
                        <!-- Mặt trước -->
                        <div class="flashcard-front">
                            <div class="flashcard-emoji">${emoji}</div>
                            <div class="flashcard-word-eng">${word}</div>
                            <button class="btn-tts-speak" onclick="event.stopPropagation(); app.speakEnglish('${word}')">
                                <i class="fa-solid fa-volume-high"></i> Nghe đọc
                            </button>
                            <div class="flashcard-flip-hint"><i class="fa-solid fa-rotate"></i> Nhấn để xem nghĩa</div>
                        </div>
                        <!-- Mặt sau -->
                        <div class="flashcard-back">
                            <div class="flashcard-word-vi">${translation}</div>
                            ${phrase ? `
                                <div class="flashcard-phrase-box">
                                    <div class="vocab-example-label">Mẫu câu ví dụ:</div>
                                    <div class="vocab-example-text">"${phrase}"</div>
                                    <button class="btn-tts-speak-phrase" onclick="event.stopPropagation(); app.speakEnglish('${phrase.replace(/'/g, "\\'")}')">
                                        <i class="fa-solid fa-volume-high"></i> Nghe câu
                                    </button>
                                </div>
                            ` : ''}
                            <div class="flashcard-flip-hint"><i class="fa-solid fa-rotate"></i> Nhấn để quay lại</div>
                        </div>
                    </div>
                </div>
            `;
        });

        return `
            <div class="duolingo-vocab-lab card animate-fade-in" style="margin-top: 1.5rem;">
                <div class="vocab-lab-header" style="display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem; border-bottom:1px solid var(--border-color); padding-bottom:1rem;">
                    <div class="duo-character-mini" style="font-size: 2.5rem; filter: drop-shadow(0 0 10px rgba(88, 167, 0, 0.4));">🦉</div>
                    <div class="vocab-lab-title-box">
                        <h4 class="vocab-lab-title" style="margin:0; font-size:1.2rem; font-weight:800; color:var(--primary);">Duolingo Vocabulary Lab</h4>
                        <p class="vocab-lab-desc" style="margin:4px 0 0 0; font-size:0.88rem; color:var(--text-muted);">Nhấn click để lật Flashcard 3D xem nghĩa và bấm biểu tượng Loa để nghe phát âm chuẩn nhé!</p>
                    </div>
                </div>
                <div class="flashcards-grid">
                    ${cardsHtml}
                </div>
            </div>
        `;
    },

    // Hiển thị chi tiết phần lý thuyết giáo khoa chung
    showTheoryDetail: function(lessonId) {
        this.currentSubtopicId = lessonId + "-theory";
        const lesson = this.currentLesson;
        if (!lesson) return;

        const items = document.querySelectorAll(".subtopic-timeline-item");
        items.forEach((item, i) => {
            if (i === 0) { // Mục Kiến thức giáo khoa luôn là phần tử đầu tiên
                item.classList.add("current");
            } else {
                item.classList.remove("current");
            }
        });

        let theoryHtmlContent = lesson.theoryHtml || "";
        const videoId = this.getLessonVideoId(lessonId);
        const isEnglish = lesson.subject === "english" || this.currentSubject === "english";

        if (isEnglish) {
            const vocabLabHtml = this.renderEnglishVocabularyLab(lesson);
            theoryHtmlContent = `
                <div class="duo-theory-container">
                    <div class="duo-theory-rules card" style="margin-bottom: 1.5rem; padding: 1.5rem; border-left: 5px solid var(--primary); background: rgba(30, 27, 75, 0.45);">
                        <h4 style="color: var(--primary); font-size: 1.15rem; font-weight: 800; margin-top:0; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fa-solid fa-graduation-cap"></i> Ghi nhớ ngữ pháp & Mẫu câu
                        </h4>
                        <div style="line-height:1.6; color: var(--text-main); font-size:0.95rem;">${lesson.theoryHtml || ""}</div>
                    </div>
                    ${vocabLabHtml}
                </div>
            `;
            
            const videoWrapper = document.getElementById("video-wrapper");
            if (videoWrapper) {
                if (videoId) {
                    videoWrapper.parentNode.style.display = "block";
                    this.renderVideoPlayer("video-wrapper", videoId, lessonId, lessonId);
                } else {
                    videoWrapper.parentNode.style.display = "none";
                }
            }
        } else {
            const videoWrapper = document.getElementById("video-wrapper");
            if (videoWrapper) {
                videoWrapper.parentNode.style.display = "block";
            }
            this.renderVideoPlayer("video-wrapper", videoId, lessonId, lessonId);
        }

        document.getElementById("subtopic-method-html").innerHTML = theoryHtmlContent;
        document.getElementById("subtopic-example-html").innerHTML = "";

        // Hiển thị nút bấm xác nhận học xong lý thuyết
        const theoryActionBar = document.getElementById("theory-action-bar");
        if (theoryActionBar) {
            const theoryCompleted = this.state.completedLessonTheory && this.state.completedLessonTheory.includes(lessonId);
            const isLessonPassed = (this.state.scores[lessonId] || 0) >= 80;
            if (theoryCompleted || isLessonPassed) {
                theoryActionBar.style.display = "none";
            } else {
                theoryActionBar.style.display = "block";
                const btn = document.getElementById("btn-complete-theory");
                if (btn) {
                    if (isEnglish) {
                        btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> Con đã ghi nhớ từ vựng & mẫu câu -> Vào Luyện tập thôi! 🚀`;
                    } else {
                        btn.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Con đã học xong lý thuyết chung -> Học Dạng 1 🚀`;
                    }
                    btn.style.backgroundColor = "var(--primary)";
                    btn.style.borderColor = "var(--primary)";
                }
            }
        }

        if (window.renderMathInElement) {
            window.renderMathInElement(document.getElementById("subtopic-method-html"), {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ]
            });
        }
    },

    // Ghi nhận học xong lý thuyết giáo khoa và chuyển sang Dạng 1
    completeTheoryAndGoToFirstSubtopic: function() {
        const lesson = this.currentLesson;
        if (!lesson) return;

        if (!this.state.completedLessonTheory) {
            this.state.completedLessonTheory = [];
        }
        if (!this.state.completedLessonTheory.includes(lesson.id)) {
            this.state.completedLessonTheory.push(lesson.id);
            this.saveProgress();
        }

        Swal.fire({
            icon: 'success',
            title: `Tuyệt vời ${this.config.studentName || 'Con'}!`,
            text: 'Con đã học xong lý thuyết chung. Hãy bắt đầu học Dạng 1 nhé!',
            confirmButtonColor: 'var(--primary)',
            timer: 2000,
            showConfirmButton: false,
            target: document.getElementById('tab-theory') || 'body'
        }).then(() => {
            // Tự động chuyển sang Dạng 1
            if (lesson.subtopics && lesson.subtopics.length > 0) {
                this.showSubtopicDetail(lesson.subtopics[0].id);
            }
            // Vẽ lại timeline để cập nhật tích xanh và mở khóa dạng 1
            this.renderSubtopicsTimeline();
        });
    },

    getLevelData: function(lessonId, level) {
        const lesson = getLessonById(lessonId);
        let score = 0;
        let hasAttempt = false;
        let weakQuestion = null;

        if (level === 'chat-luong-cao') {
            // Cấp độ Chất lượng cao lưu trực tiếp ở levelScores cho cả bài học
            score = (this.state.levelScores && this.state.levelScores[`${lessonId}_${level}`]) || 0;
            hasAttempt = score > 0 || (this.state.examSessions && this.state.examSessions.some(s => s.lessonId === lessonId && s.level === level));
        } else if (lesson && lesson.subtopics && lesson.subtopics.length > 0) {
            // Ánh xạ cấp độ sang subtopic tương ứng
            let subIndex = 0;
            if (level === 'nang-cao') subIndex = 1;
            else if (level === 'kho') subIndex = 2;

            const sub = lesson.subtopics[subIndex];
            if (sub) {
                score = this.state.subtopicScores ? (this.state.subtopicScores[sub.id] || 0) : 0;
                hasAttempt = score > 0 || (this.state.examSessions && this.state.examSessions.some(s => s.lessonId === lessonId && s.level === level));
            } else {
                // Fallback nếu subtopic tương ứng không tồn tại ở cấp độ này (ví dụ bài học chỉ có subtopic Cơ bản)
                score = (this.state.levelScores && this.state.levelScores[`${lessonId}_${level}`]) || 0;
                hasAttempt = score > 0 || (this.state.examSessions && this.state.examSessions.some(s => s.lessonId === lessonId && s.level === level));
            }
        } else {
            // Bài luyện tập chung
            score = (this.state.levelScores && this.state.levelScores[`${lessonId}_${level}`]) || 0;
            hasAttempt = score > 0 || (this.state.examSessions && this.state.examSessions.some(s => s.lessonId === lessonId && s.level === level));
        }

        // Tìm câu hỏi sai gần nhất của cấp độ này trong lịch sử để phân tích điểm yếu
        const sessions = (this.state.examSessions || [])
            .filter(s => s.lessonId === lessonId && s.level === level && !s.isExam)
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        let lastScore = null;
        if (sessions.length > 0) {
            lastScore = sessions[0].scorePercent;
        } else if (hasAttempt) {
            lastScore = score;
        }

        if (sessions.length > 0) {
            for (const s of sessions) {
                const wrongQ = s.questions.find(q => q.userSelectedIndex !== q.correctIndex);
                if (wrongQ) {
                    weakQuestion = wrongQ;
                    break;
                }
            }
        }

        return {
            score: score,
            lastScore: lastScore,
            hasAttempt: hasAttempt,
            weakQuestion: weakQuestion
        };
    },

    renderPracticeDashboard: function() {
        const container = document.getElementById("practice-levels-dashboard-box");
        if (!container) return;
        container.classList.remove("hidden");
        container.innerHTML = "";

        const lesson = this.currentLesson;
        if (!lesson) return;

        // Tạo tiêu đề
        const header = document.createElement("div");
        header.style.textAlign = "center";
        header.style.marginBottom = "2rem";
        header.innerHTML = `
            <h2 style="font-size:1.6rem; color:var(--primary); margin-bottom:0.5rem;"><i class="fa-solid fa-graduation-cap"></i> Lộ trình Luyện tập theo Cấp độ</h2>
            <p style="color:var(--text-muted); font-size:0.95rem;">Luyện tập thường hoặc Khắc phục Điểm yếu để củng cố năng lực cho bài học: <b style="color:var(--text-main);">${lesson.title}</b></p>
        `;
        container.appendChild(header);

        // Grid chứa 3 cấp độ
        const grid = document.createElement("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "repeat(auto-fit, minmax(280px, 1fr))";
        grid.style.gap = "1.5rem";
        grid.style.marginBottom = "2.5rem";

        const levels = [
            { id: "co-ban", name: "Cơ bản (Nhận biết) 🌱", color: "var(--success)" },
            { id: "nang-cao", name: "Nâng cao (Thông hiểu) 🚀", color: "var(--warning)" },
            { id: "kho", name: "Khó (Vận dụng cao) 🔥", color: "var(--danger)" },
            { id: "chat-luong-cao", name: "Chất lượng cao (Tư duy & Logic AI) 💎", color: "#8b5cf6" }
        ];

        const hasSubtopics = lesson.subtopics && lesson.subtopics.length > 0;

        levels.forEach(lvl => {
            const data = this.getLevelData(lesson.id, lvl.id);
            const card = document.createElement("div");
            card.className = "card";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.borderTop = `5px solid ${lvl.color}`;
            card.style.padding = "1.2rem";
            card.style.borderRadius = "12px";
            card.style.position = "relative";
            card.style.transition = "transform 0.2s, box-shadow 0.2s";
            card.style.boxShadow = "var(--shadow-sm)";
            card.onmouseenter = () => {
                card.style.transform = "translateY(-4px)";
                card.style.boxShadow = "var(--shadow-md)";
            };
            card.onmouseleave = () => {
                card.style.transform = "translateY(0)";
                card.style.boxShadow = "var(--shadow-sm)";
            };

            // Trạng thái và Đạt được gì
            let statusBadge = "";
            let scoreBadge = "";
            let rating = "";

            if (data.hasAttempt) {
                statusBadge = `<span style="font-size:0.8rem; background-color:var(--success-bg); color:var(--success); padding:0.2rem 0.6rem; border-radius:20px; font-weight:700; display:inline-flex; align-items:center; gap:0.3rem;"><i class="fa-solid fa-circle-check"></i> Đã làm</span>`;
                if (data.score >= 90) rating = "Xuất sắc 🏆";
                else if (data.score >= 80) rating = "Giỏi 🎯";
                else if (data.score >= 70) rating = "Khá 📈";
                else rating = "Chưa đạt ⚠️";

                let lastAttemptHtml = "";
                if (data.lastScore !== null && data.lastScore !== undefined && data.lastScore !== data.score) {
                    let lastRating = "";
                    if (data.lastScore >= 90) lastRating = "Xuất sắc 🏆";
                    else if (data.lastScore >= 80) lastRating = "Giỏi 🎯";
                    else if (data.lastScore >= 70) lastRating = "Khá 📈";
                    else lastRating = "Chưa đạt ⚠️";
                    lastAttemptHtml = `<div style="margin-top: 0.3rem; font-size:0.85rem; color:var(--text-muted);">
                        Lần gần nhất: <span style="font-weight:700; color: ${data.lastScore >= 80 ? 'var(--success)' : 'var(--danger)'};">${data.lastScore}%</span> (${lastRating})
                    </div>`;
                }

                scoreBadge = `<div style="margin-top: 0.8rem; font-size:0.95rem; color:var(--text-main);">
                    <b>Điểm cao nhất:</b> <span style="font-size:1.1rem; font-weight:800; color:${lvl.color};">${data.score}%</span> (${rating})
                    ${lastAttemptHtml}
                </div>`;
            } else {
                statusBadge = `<span style="font-size:0.8rem; background-color:var(--border-color); color:var(--text-muted); padding:0.2rem 0.6rem; border-radius:20px; font-weight:700;"><i class="fa-regular fa-circle"></i> Chưa làm</span>`;
                scoreBadge = `<div style="margin-top: 0.8rem; font-size:0.95rem; color:var(--text-muted);">
                    <b>Điểm cao nhất:</b> <span style="font-weight:700;">-</span>
                </div>`;
            }

            // Điểm yếu cần khắc phục (AI phân tích) - đánh giá dựa trên điểm lần làm gần nhất (lastScore)
            let weaknessHtml = "";
            const evaluationScore = (data.lastScore !== null && data.lastScore !== undefined) ? data.lastScore : data.score;
            
            if (data.hasAttempt && evaluationScore < 80 && data.weakQuestion) {
                // Điểm yếu từ câu sai
                const weakText = data.weakQuestion.tip || "Cần đọc lại lý thuyết và làm bài cẩn thận hơn.";
                const cleanQuestionText = data.weakQuestion.questionText
                    .replace(/\$/g, '')
                    .replace(/\\text\{([^\}]+)\}/g, '$1')
                    .replace(/<[^>]*>/g, '')
                    .substring(0, 80);
                
                weaknessHtml = `
                    <div style="margin-top: 1rem; padding: 0.8rem; background-color: var(--danger-bg); border-radius: 8px; border-left: 4px solid var(--danger); font-size: 0.85rem; flex-grow: 1;">
                        <span style="font-weight: 700; color: var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> Điểm yếu AI phân tích (Lần gần nhất: ${evaluationScore}%):</span>
                        <p style="margin: 0.3rem 0; color: var(--text-main); font-style: italic;">"${cleanQuestionText}..."</p>
                        <span style="font-weight: 700; color: var(--success);"><i class="fa-solid fa-lightbulb"></i> Khắc phục:</span>
                        <p style="margin: 0.2rem 0 0; color: var(--text-main);">${weakText}</p>
                    </div>
                `;
            } else if (data.hasAttempt && evaluationScore >= 80) {
                weaknessHtml = `
                    <div style="margin-top: 1rem; padding: 0.8rem; background-color: var(--success-bg); border-radius: 8px; border-left: 4px solid var(--success); font-size: 0.85rem; flex-grow: 1; display:flex; align-items:center; gap:0.4rem; color:var(--success);">
                        <i class="fa-solid fa-circle-check"></i> <span>Con đã nắm chắc kiến thức cấp độ này. Rất tốt!</span>
                    </div>
                `;
            } else {
                weaknessHtml = `
                    <div style="margin-top: 1rem; padding: 0.8rem; background-color: var(--bg-app); border-radius: 8px; border-left: 4px solid var(--border-color); font-size: 0.85rem; flex-grow: 1; color: var(--text-muted);">
                        <i class="fa-regular fa-comment-dots"></i> <span>Chưa có dữ liệu làm bài để phân tích. Hãy thực hiện luyện tập!</span>
                    </div>
                `;
            }

            // Nút luyện tập thường và luyện tập điểm yếu
            let buttonsHtml = "";
            
            // Tìm subtopic tương ứng nếu có subtopics
            let subtopicId = null;
            if (hasSubtopics) {
                let subIndex = 0;
                if (lvl.id === 'nang-cao') subIndex = 1;
                else if (lvl.id === 'kho') subIndex = 2;
                if (lesson.subtopics[subIndex]) {
                    subtopicId = lesson.subtopics[subIndex].id;
                }
            }

            if (data.hasAttempt && data.score < 80 && data.weakQuestion) {
                // Có điểm yếu -> hiện 2 nút
                const practiceCall = (subtopicId && lvl.id !== 'chat-luong-cao') 
                    ? `app.startPracticeSubtopic('${subtopicId}')` 
                    : `questions.startPracticeWithLevel('${lvl.id}')`;
                const weaknessCall = (subtopicId && lvl.id !== 'chat-luong-cao') 
                    ? `questions.startWeaknessPracticeSubtopic('${subtopicId}')` 
                    : `questions.startWeaknessPracticeWithLevel('${lvl.id}')`;

                buttonsHtml = `
                    <div style="display:grid; grid-template-columns: 1fr 1fr auto; gap: 0.6rem; margin-top: 1.2rem;">
                        <button class="btn-primary" onclick="${practiceCall}" style="padding:0.6rem; border-radius:8px; font-size:0.85rem; cursor:pointer; font-weight:700; background-color:var(--bg-app); color:var(--text-main); border:1px solid var(--border-color);">
                            Luyện tập lại
                        </button>
                        <button class="btn-primary" onclick="${weaknessCall}" style="padding:0.6rem; border-radius:8px; font-size:0.85rem; cursor:pointer; font-weight:700; background-color:var(--warning); border-color:var(--warning); color:white; font-weight:bold;">
                            🔥 Luyện điểm yếu
                        </button>
                        <button class="btn-secondary" onclick="questions.showStudentPrintPromptWithLevel('${lvl.id}')" style="padding:0.6rem 0.8rem; border-radius:8px; cursor:pointer; background-color:var(--success); border-color:var(--success); color:white; display:flex; align-items:center; justify-content:center;" title="In đề thi cấp độ này">
                            <i class="fa-solid fa-print"></i>
                        </button>
                    </div>
                `;
            } else {
                // Không có điểm yếu hoặc chưa làm
                const practiceCall = (subtopicId && lvl.id !== 'chat-luong-cao') 
                    ? `app.startPracticeSubtopic('${subtopicId}')` 
                    : `questions.startPracticeWithLevel('${lvl.id}')`;
                const btnText = data.hasAttempt ? "Luyện tập lại" : "Bắt đầu Luyện tập";
                buttonsHtml = `
                    <div style="display:grid; grid-template-columns: 1fr auto; gap: 0.6rem; margin-top: 1.2rem;">
                        <button class="btn-primary" onclick="${practiceCall}" style="padding:0.7rem; border-radius:8px; font-size:0.9rem; cursor:pointer; font-weight:700; background-color:${lvl.color}; border-color:${lvl.color};">
                            <i class="fa-solid fa-play"></i> ${btnText}
                        </button>
                        <button class="btn-secondary" onclick="questions.showStudentPrintPromptWithLevel('${lvl.id}')" style="padding:0.7rem 1rem; border-radius:8px; cursor:pointer; background-color:var(--success); border-color:var(--success); color:white; display:flex; align-items:center; justify-content:center;" title="In đề thi cấp độ này">
                            <i class="fa-solid fa-print"></i>
                        </button>
                    </div>
                `;
            }

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 style="font-size:1.05rem; color:var(--text-main); font-weight:700;">${lvl.name}</h3>
                    ${statusBadge}
                </div>
                ${scoreBadge}
                ${weaknessHtml}
                ${buttonsHtml}
            `;
            grid.appendChild(card);
        });
        container.appendChild(grid);

        // Thêm Bài kiểm tra tổng thể bài học ở dưới cùng
        if (hasSubtopics) {
            const isLessonPassed = (this.state.scores[lesson.id] || 0) >= 80;
            
            // Kiểm tra xem cả 3 subtopic đã đạt từ 80% trở lên chưa
            const allSubtopicsPassed = lesson.subtopics.every(sub => {
                const subScore = this.state.subtopicScores ? (this.state.subtopicScores[sub.id] || 0) : 0;
                return subScore >= 80;
            });
            
            const examBox = document.createElement("div");
            examBox.className = "card";
            examBox.style.padding = "1.5rem";
            examBox.style.borderRadius = "12px";
            examBox.style.textAlign = "center";
            examBox.style.border = "1px solid var(--border-color)";
            examBox.style.boxShadow = "var(--shadow-sm)";
            examBox.style.marginTop = "2rem";

            if (!allSubtopicsPassed && !isLessonPassed) {
                // Khóa bài kiểm tra tổng thể
                examBox.style.backgroundColor = "var(--bg-app)";
                examBox.style.opacity = "0.75";
                examBox.innerHTML = `
                    <div style="font-size:2.5rem; margin-bottom:0.6rem;">🔒</div>
                    <h3 style="font-size:1.2rem; font-weight:700; color:var(--text-muted); margin-bottom:0.5rem;">Thử thách: Bài kiểm tra tổng thể bài học</h3>
                    <p style="color:var(--text-muted); font-size:0.9rem; max-width:550px; margin:0 auto 1rem;">
                        Con cần hoàn thành và đạt kết quả từ <b>80% trở lên ở cả 3 Cấp độ bài tập</b> phía trên để mở khóa bài kiểm tra tổng hợp năng lực bài học này nhé!
                    </p>
                    <button class="btn-primary" disabled style="padding:0.7rem 2rem; border-radius:10px; background-color:var(--text-muted); border-color:var(--text-muted); cursor:not-allowed;">
                        Chưa đủ điều kiện mở khóa
                    </button>
                `;
            } else {
                // Mở khóa bài kiểm tra tổng thể
                const scoreLabel = isLessonPassed ? `<span style="color:var(--success); font-weight:800;">Đã hoàn thành (${this.state.scores[lesson.id]}%)</span>` : `<span style="color:var(--warning); font-weight:700;">Chưa hoàn thành</span>`;
                examBox.innerHTML = `
                    <div style="font-size:2.5rem; margin-bottom:0.6rem;">📝</div>
                    <h3 style="font-size:1.2rem; font-weight:700; color:var(--primary); margin-bottom:0.5rem;">Thử thách: Bài kiểm tra tổng thể bài học</h3>
                    <p style="color:var(--text-muted); font-size:0.9rem; max-width:550px; margin:0 auto 0.5rem;">
                        Bài thi gồm 10 câu hỏi nâng cao giới hạn trong 15 phút. Yêu cầu đạt <b>tối thiểu 80%</b> để hoàn thành bài học và mở khóa bài tiếp theo.
                    </p>
                    <p style="font-size:0.9rem; margin-bottom:1rem;"><b>Trạng thái:</b> ${scoreLabel}</p>
                    <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
                        <button class="btn-primary" onclick="questions.startLessonExam()" style="padding:0.7rem 2.2rem; border-radius:10px; font-size:1rem; cursor:pointer;">
                            <i class="fa-solid fa-play"></i> Bắt đầu kiểm tra tổng thể
                        </button>
                        <button class="btn-secondary" onclick="questions.showStudentPrintPrompt()" style="padding:0.7rem 2.2rem; border-radius:10px; font-size:1rem; cursor:pointer; background-color:var(--success); color:white; border:none; display:flex; align-items:center; gap:0.5rem;">
                            <i class="fa-solid fa-print"></i> In đề thi giấy 🖨️
                        </button>
                    </div>
                `;
            }
            container.appendChild(examBox);
        }
    },

    startPracticeCurrentSubtopic: function() {
        if (!this.currentSubtopicId) return;
        this.switchLessonTab('practice', false);
        questions.startSubtopicPractice(this.currentSubtopicId);
    },

    startPracticeSubtopic: function(subtopicId) {
        this.currentSubtopicId = subtopicId;
        this.switchLessonTab('practice', false);
        questions.startSubtopicPractice(subtopicId);
    },

    backToSubtopics: function() {
        this.switchLessonTab('theory');
    },

    checkSubjectSelection: function() {
        const classLevel = this.config.currentClass || "6";
        const availableSubjects = Object.values(SYSTEM_SUBJECTS).filter(s => s.supportedClasses.includes(classLevel));
        
        if (availableSubjects.length <= 1) {
            const subjectId = availableSubjects[0] ? availableSubjects[0].id : "english";
            this.selectSubject(subjectId);
        } else {
            this.showSubjectSelectionScreen(availableSubjects);
        }
    },

    showSubjectSelectionScreen: function(availableSubjects) {
        // Ẩn timeline và sidebar học tập
        const mainWorkspace = document.getElementById("main-workspace") || document.querySelector(".workspace-container");
        if (mainWorkspace) mainWorkspace.classList.add("hidden");
        
        const sidebar = document.getElementById("sidebar") || document.querySelector(".timeline-sidebar");
        if (sidebar) sidebar.classList.add("hidden");

        const screen = document.getElementById("screen-subject-select");
        if (screen) {
            screen.classList.remove("hidden");
            this.pushHistory('subject-select');
            const listContainer = screen.querySelector(".subject-list");
            if (listContainer) {
                listContainer.innerHTML = "";
                availableSubjects.forEach(subj => {
                    const card = document.createElement("div");
                    card.className = `subject-card glass-card ${subj.id}-card`;
                    card.innerHTML = `
                        <div class="subject-icon-wrapper">
                            <i class="fa-solid ${subj.icon} subject-icon"></i>
                        </div>
                        <h3>${subj.name}</h3>
                        <p>${subj.id === 'math' ? 'Rèn luyện tư duy logic toán học' : 'Học tiếng Anh tương tác đa giác quan'}</p>
                        <button class="btn-select-subj">Bắt đầu học 🚀</button>
                    `;
                    card.onclick = () => {
                        this.selectSubject(subj.id);
                    };
                    listContainer.appendChild(card);
                });
            }
        }
    },

    selectSubject: function(subjectId) {
        this.currentSubject = subjectId;
        
        // Cập nhật class theme trên body
        document.body.className = document.body.className.replace(/\b(math|english)-mode\b/g, "");
        const subjConfig = SYSTEM_SUBJECTS[subjectId];
        if (subjConfig && subjConfig.themeClass) {
            document.body.classList.add(subjConfig.themeClass);
        } else {
            document.body.classList.add("math-mode");
        }

        this.setupSubjectStateProxies();

        // Ẩn màn hình chọn môn học
        const screen = document.getElementById("screen-subject-select");
        if (screen) screen.classList.add("hidden");

        const englishPortal = document.getElementById("screen-english-portal");
        const timelineScreen = document.getElementById("screen-timeline");

        if (subjectId === "english") {
            if (englishPortal) englishPortal.classList.remove("hidden");
            if (timelineScreen) timelineScreen.classList.add("hidden");
            this.pushHistory('english-portal');
            
            // Khởi tạo trạng thái Tiếng Anh mặc định nếu chưa có
            if (typeof this.state.englishStreak === 'undefined') this.state.englishStreak = 0;
            if (typeof this.state.englishHearts === 'undefined') this.state.englishHearts = 5;
            if (typeof this.state.englishXp === 'undefined') this.state.englishXp = 0;
            if (typeof this.state.infiniteHearts === 'undefined') this.state.infiniteHearts = false;
            
            this.switchEnglishTab('map');
            this.updateEnglishHeaderStats();
            
            // Khi học tiếng Anh, backend vẫn tiếp tục sinh đề ngầm cho môn Toán
            const studentId = this.config.defaultStudentId || 'default';
            const classLevel = this.config.currentClass || '6';
            fetch(this.getApiUrl('/api/start-student-pregen'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, classLevel, subject: 'math' })
            }).catch(e => console.error(e));
        } else {
            if (englishPortal) englishPortal.classList.add("hidden");
            if (timelineScreen) timelineScreen.classList.remove("hidden");
            this.pushHistory('timeline');

            // Hiển thị lại workspace học tập và timeline môn Toán
            const mainWorkspace = document.getElementById("main-workspace") || document.querySelector(".workspace-container");
            if (mainWorkspace) mainWorkspace.classList.remove("hidden");
            
            const sidebar = document.getElementById("sidebar") || document.querySelector(".timeline-sidebar");
            if (sidebar) sidebar.classList.remove("hidden");

            // Cập nhật tiêu đề sidebar lộ trình
            const sidebarTitle = document.querySelector(".sidebar-title");
            if (sidebarTitle) {
                const currentClass = this.config.currentClass || "6";
                sidebarTitle.innerHTML = `<i class="fa-solid fa-map-signs"></i> Lộ trình học Toán ${currentClass}`;
            }

            this.renderTimeline();
            this.updateHeaderStats();
            
            // Chỉ cuộn đến bài học đang học sau khi render
            setTimeout(() => {
                this.scrollToActiveLesson();
            }, 100);

            // Kích hoạt worker sinh đề ngầm cho Toán
            const studentId = this.config.defaultStudentId || 'default';
            const classLevel = this.config.currentClass || '6';
            fetch(this.getApiUrl('/api/start-student-pregen'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, classLevel, subject: 'math' })
            }).catch(e => console.error(e));
        }
        this.updateNavigationButtons();
    },

    getUnlockedSkillCardsCount: function() {
        let count = 0;
        SKILL_CARDS.forEach(card => {
            if (card.id !== "unlocked_all_english" && this.isSkillCardUnlocked(card.id)) {
                count++;
            }
        });
        return count;
    },

    isSkillCardUnlocked: function(cardId) {
        const state = this.state;
        
        const checkClassSkillScore = (classLevel, skillKey, minScore) => {
            if (!state.scores) return false;
            const prefix = `eng${classLevel}-`;
            return Object.keys(state.scores).some(key => 
                key.startsWith(prefix) && 
                key.endsWith(`-${skillKey}`) && 
                state.scores[key] >= minScore
            );
        };

        const countClassPassedLessons = (classLevel, minScore) => {
            if (!state.scores) return 0;
            const prefix = `eng${classLevel}-`;
            const lessonIds = new Set();
            Object.keys(state.scores).forEach(key => {
                if (key.startsWith(prefix) && state.scores[key] >= minScore) {
                    const parts = key.split('-');
                    if (parts.length >= 3) {
                        const part = parts[0] + '-' + parts[1] + '-' + parts[2];
                        lessonIds.add(part);
                    }
                }
            });
            return lessonIds.size;
        };

        const checkDoublePerfect = () => {
            if (!state.scores) return false;
            const prefixes = new Set(Object.keys(state.scores).map(k => k.substring(0, k.lastIndexOf('-'))));
            return Array.from(prefixes).some(pref => state.scores[`${pref}-listening`] === 100 && state.scores[`${pref}-speaking`] === 100);
        };

        const checkAllRounder = () => {
            if (!state.scores) return false;
            const prefixes = new Set(Object.keys(state.scores).map(k => k.substring(0, k.lastIndexOf('-'))));
            return Array.from(prefixes).some(pref => 
                (state.scores[`${pref}-listening`] || 0) >= 90 && 
                (state.scores[`${pref}-speaking`] || 0) >= 90 && 
                (state.scores[`${pref}-reading`] || 0) >= 90 && 
                (state.scores[`${pref}-writing`] || state.scores[`${pref}-spelling`] || state.scores[`${pref}-writing_champion`] || 0) >= 90
            );
        };

        switch(cardId) {
            case "listening_master":
                return this.checkSkillScore(state, 'listening', 90);
            case "speaking_pro":
                return this.checkSkillScore(state, 'speaking', 90);
            case "reading_wizard":
                return this.checkSkillScore(state, 'reading', 90);
            case "writing_champion":
                return this.checkSkillScore(state, 'spelling', 90) || this.checkSkillScore(state, 'writing', 90);
            case "streak_legend":
                return (state.englishStreak || 0) >= 5;
            case "streak_hero":
                return (state.englishStreak || 0) >= 10;
            case "xp_conqueror":
                return (state.englishXp || 0) >= 1000;
            case "perfect_score":
                return this.checkPerfectScore(state);
            case "theory_explorer":
                return (state.completedLessonTheory || []).length >= 3;
            case "gold_collector":
                return (state.goldSkills || []).length >= 3;
            case "subtopic_expert":
                return (state.completedSubtopics || []).length >= 5;
            case "speed_runner":
                if (!state.examSessions) return false;
                return state.examSessions.some(session => session.score === 100 && (session.duration || 0) > 0 && (session.duration || 0) <= 60);
            case "monster_slayer":
                return (state.slainMonstersCount || 0) >= 3;
            case "vocab_slayer":
                return (state.slainMonstersCount || 0) >= 10;
                
            // Lớp 1
            case "listening_rookie_1":
                return checkClassSkillScore('1', 'listening', 80);
            case "speaking_rookie_1":
                return checkClassSkillScore('1', 'speaking', 80);
            case "reading_rookie_1":
                return checkClassSkillScore('1', 'reading', 80);
            case "writing_rookie_1":
                return checkClassSkillScore('1', 'spelling', 80) || checkClassSkillScore('1', 'writing', 80);
            case "vocabulary_explorer_1":
                return (state.slainMonstersCount || 0) >= 2;
            case "perfect_star_1":
                if (!state.scores) return false;
                return Object.keys(state.scores).some(key => key.startsWith('eng1-') && state.scores[key] === 100);
            case "bilingual_kid":
                return countClassPassedLessons('1', 90) >= 5;
            case "class1_master":
                return countClassPassedLessons('1', 90) >= 10;
                
            // Lớp 4
            case "listening_apprentice_4":
                return checkClassSkillScore('4', 'listening', 85);
            case "speaking_apprentice_4":
                return checkClassSkillScore('4', 'speaking', 85);
            case "reading_apprentice_4":
                return checkClassSkillScore('4', 'reading', 85);
            case "writing_apprentice_4":
                return checkClassSkillScore('4', 'spelling', 85) || checkClassSkillScore('4', 'writing', 85);
            case "vocabulary_explorer_4":
                return (state.slainMonstersCount || 0) >= 5;
            case "grammar_rookie":
                if (!state.scores) return false;
                return Object.keys(state.scores).filter(key => key.includes('grammar') && state.scores[key] >= 80).length >= 3;
            case "global_citizen_junior":
                return countClassPassedLessons('4', 90) >= 10;
            case "class4_master":
                return countClassPassedLessons('4', 90) >= 15;
                
            // Lớp 6
            case "listening_expert_6":
                return checkClassSkillScore('6', 'listening', 90);
            case "speaking_expert_6":
                return checkClassSkillScore('6', 'speaking', 90);
            case "reading_expert_6":
                return checkClassSkillScore('6', 'reading', 90);
            case "writing_expert_6":
                return checkClassSkillScore('6', 'spelling', 90) || checkClassSkillScore('6', 'writing', 90);
            case "vocabulary_explorer_6":
                return (state.slainMonstersCount || 0) >= 8;
            case "grammar_expert":
                if (!state.scores) return false;
                return Object.keys(state.scores).filter(key => key.includes('grammar') && state.scores[key] >= 90).length >= 5;
            case "global_citizen_senior":
                return countClassPassedLessons('6', 90) >= 15;
            case "class6_master":
                return countClassPassedLessons('6', 90) >= 18;
                
            // Cột mốc
            case "streak_bronze":
                return (state.englishStreak || 0) >= 3;
            case "streak_gold":
                return (state.englishStreak || 0) >= 20;
            case "xp_novice":
                return (state.englishXp || 0) >= 100;
            case "xp_apprentice":
                return (state.englishXp || 0) >= 500;
            case "xp_master":
                return (state.englishXp || 0) >= 2000;
            case "xp_legend":
                return (state.englishXp || 0) >= 5000;
            case "theory_scholar":
                return (state.completedLessonTheory || []).length >= 8;
            case "vocabulary_monarch":
                return (state.slainMonstersCount || 0) >= 20;
            case "speedy_writer":
                if (!state.examSessions) return false;
                return state.examSessions.some(session => (session.skill === 'spelling' || session.skill === 'writing') && session.score === 100 && (session.duration || 0) > 0 && (session.duration || 0) <= 40);
            case "double_perfect":
                return checkDoublePerfect();
            case "all_rounder":
                return checkAllRounder();
            case "unlocked_all_english":
                return SKILL_CARDS.every(c => c.id === "unlocked_all_english" || this.isSkillCardUnlocked(c.id));
                
            default:
                return false;
        }
    },

    checkSkillScore: function(state, skillKey, minScore) {
        if (!state.scores) return false;
        return Object.keys(state.scores).some(key => key.endsWith(`-${skillKey}`) && state.scores[key] >= minScore);
    },

    checkPerfectScore: function(state) {
        if (!state.scores) return false;
        return Object.values(state.scores).some(score => score === 100);
    },

    drawEnglishRadarChart: function(canvasId, skillScores = {}, customTextColor = null) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        // Tự động xác định màu chữ dựa vào theme nếu không truyền customTextColor
        let textColor = customTextColor;
        if (!textColor) {
            const isDarkMode = document.body.classList.contains("light-mode"); // light-mode là Tối (Emerald Night)
            textColor = isDarkMode ? "#ffffff" : "#0b3012";
        }
        const isDarkBg = textColor === "#ffffff";

        const skills = [
            { label: "Nghe", key: "listening" },
            { label: "Nói", key: "speaking" },
            { label: "Đọc", key: "reading" },
            { label: "Viết", key: "writing" },
            { label: "Từ vựng", key: "vocabulary" },
            { label: "Ngữ pháp", key: "grammar" }
        ];

        const cx = width / 2;
        const cy = height / 2;
        const maxRadius = Math.min(width, height) * 0.32;
        const numSkills = skills.length;

        // Vẽ các vòng lưới đa giác (polygon web rings)
        const numRings = 5;
        // Sử dụng nét lưới đậm đà và tương phản hơn theo theme
        ctx.strokeStyle = isDarkBg ? "rgba(192, 132, 252, 0.25)" : "rgba(46, 125, 50, 0.25)";
        ctx.lineWidth = 1;
        for (let r = 1; r <= numRings; r++) {
            const radius = (maxRadius / numRings) * r;
            ctx.beginPath();
            for (let i = 0; i < numSkills; i++) {
                const angle = (Math.PI * 2 / numSkills) * i - Math.PI / 2;
                const x = cx + Math.cos(angle) * radius;
                const y = cy + Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.stroke();
        }

        // Vẽ trục lưới (axis lines)
        ctx.beginPath();
        for (let i = 0; i < numSkills; i++) {
            const angle = (Math.PI * 2 / numSkills) * i - Math.PI / 2;
            const x = cx + Math.cos(angle) * maxRadius;
            const y = cy + Math.sin(angle) * maxRadius;
            ctx.moveTo(cx, cy);
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Tính toán các đỉnh dữ liệu vẽ đồ thị
        const points = [];
        skills.forEach((skill, i) => {
            const val = skillScores[skill.key] || 0; // Thang điểm 0 - 100
            const radius = (maxRadius * (val / 100));
            const angle = (Math.PI * 2 / numSkills) * i - Math.PI / 2;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            points.push({ x, y, label: skill.label, value: val, angle });
        });

        // Vẽ vùng diện tích sức mạnh (Neon Area / Emerald Area)
        ctx.beginPath();
        points.forEach((p, i) => {
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        // Nền của đa giác diện tích
        ctx.fillStyle = isDarkBg ? "rgba(192, 132, 252, 0.4)" : "rgba(46, 125, 50, 0.28)";
        ctx.fill();
        ctx.strokeStyle = isDarkBg ? "#c084fc" : "#2e7d32";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Vẽ các chấm đỉnh và nhãn text
        points.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
            ctx.fillStyle = "#f59e0b"; // Vàng Gold
            ctx.fill();
            ctx.strokeStyle = isDarkBg ? "#ffffff" : "#2e7d32";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Nhãn văn bản (tăng kích thước lên 14px và dùng màu chữ truyền vào)
            ctx.fillStyle = textColor;
            ctx.font = "bold 14px 'Outfit', sans-serif";
            const textAngle = p.angle;
            const tx = cx + Math.cos(textAngle) * (maxRadius + 30);
            const ty = cy + Math.sin(textAngle) * (maxRadius + 15);
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${p.label}: ${p.value}%`, tx, ty);
        });
    },

    renderHeroProfile: function() {
        const state = this.state;
        const currentClass = this.config.currentClass || "6";

        let title = "Tân binh";
        let warriorImg = "images/warrior_novice.png";
        let warriorClass = "warrior-sprite-img warrior-slash"; // Level 1: Múa kiếm

        if (state.xp >= 10000) {
            title = "Huyền thoại Học tập 👑";
            warriorImg = "images/warrior_legend.png";
            warriorClass = "warrior-sprite-img warrior-shoot"; // Level 5: Bắn súng laser
        } else if (state.xp >= 5000) {
            title = "Đại sứ Ngôn ngữ 🛡️";
            warriorImg = "images/warrior_mage.png";
            warriorClass = "warrior-sprite-img warrior-spell"; // Level 4: Làm phép thuật
        } else if (state.xp >= 2500) {
            title = "Kỵ sĩ Tri thức 🌟";
            warriorImg = "images/warrior_knight.png";
            warriorClass = "warrior-sprite-img warrior-spin"; // Level 3: Múa kiếm ánh sáng
        } else if (state.xp >= 1000) {
            title = "Chiến binh Chuyên cần 🔥";
            warriorImg = "images/warrior_apprentice.png";
            warriorClass = "warrior-sprite-img warrior-flame"; // Level 2: Kiếm lửa bập bùng
        }

        const spriteEl = document.getElementById("hero-warrior-sprite");
        if (spriteEl) {
            spriteEl.src = warriorImg;
            spriteEl.className = warriorClass;
        }

        document.getElementById("hero-title").innerText = title;
        document.getElementById("hero-xp").innerText = state.xp || 0;
        document.getElementById("hero-streak").innerText = state.streak || 0;
        const studentNameEl = document.getElementById("hero-student-name");
        if (studentNameEl) {
            studentNameEl.innerText = `Học sinh: ${this.config.studentName || 'Chưa xác định'} (Lớp ${currentClass})`;
        }

        // 1. Render dữ liệu Toán
        const mathState = state.subjects ? state.subjects.math : null;
        if (mathState) {
            const completedCount = mathState.completedLessons ? Object.keys(mathState.completedLessons).length : 0;
            const totalMathLessons = COURSE_DATA.filter(chapter => (chapter.class || "6") === currentClass && (chapter.subject || "math") === "math").reduce((acc, chap) => acc + chap.lessons.length, 0);
            const progressPercent = totalMathLessons > 0 ? Math.round((completedCount / totalMathLessons) * 100) : 0;
            
            document.getElementById("math-completed-count").innerText = completedCount;
            document.getElementById("math-total-count").innerText = totalMathLessons;
            document.getElementById("math-progress-percent").innerText = progressPercent + "%";
            document.getElementById("math-progress-fill").style.width = progressPercent + "%";
            document.getElementById("math-towers-count").innerText = state.unlockedTowers ? state.unlockedTowers.length : 1;
        }

        // 2. Render dữ liệu Tiếng Anh
        const engState = state.subjects ? state.subjects.english : null;
        if (engState) {
            const completedCount = engState.completedLessons ? Object.keys(engState.completedLessons).length : 0;
            const totalEngLessons = COURSE_DATA.filter(chapter => (chapter.class || "6") === currentClass && chapter.subject === "english").reduce((acc, chap) => acc + chap.lessons.length, 0);
            const progressPercent = totalEngLessons > 0 ? Math.round((completedCount / totalEngLessons) * 100) : 0;

            document.getElementById("english-completed-count").innerText = completedCount;
            document.getElementById("english-total-count").innerText = totalEngLessons;
            document.getElementById("english-progress-percent").innerText = progressPercent + "%";
            document.getElementById("english-progress-fill").style.width = progressPercent + "%";

            // Cập nhật danh sách Quái vật từ vựng (weakVocabulary)
            const ulTargets = document.getElementById("english-targets");
            if (ulTargets) {
                ulTargets.innerHTML = "";
                const weakWords = engState.weakVocabulary || [];
                if (weakWords.length === 0) {
                    ulTargets.innerHTML = `<li class="no-weak-words">🎉 Tuyệt vời! Bạn không có quái vật từ vựng nào!</li>`;
                } else {
                    weakWords.forEach(word => {
                        ulTargets.innerHTML += `
                            <li class="weak-word-item">
                                <i class="fa-solid fa-ghost weak-word-icon"></i>
                                <span>${word}</span>
                                <button class="btn-slay-word" onclick="app.slayVocabularyMonster('${word}')">Tiêu diệt ⚔️</button>
                            </li>
                        `;
                    });
                }
            }

            const scores = this.calculateEnglishSkillScores(engState);
            engState.skillScores = scores;

            // Tính toán Kỹ năng xuất sắc nhất và Cần rèn luyện
            let bestSkill = "Chưa rõ";
            let worstSkill = "Chưa rõ";
            let maxVal = -1;
            let minVal = 101;
            const skillLabels = {
                listening: "Nghe",
                speaking: "Nói",
                reading: "Đọc",
                writing: "Viết",
                vocabulary: "Từ vựng",
                grammar: "Ngữ pháp"
            };
            for (const key in scores) {
                if (scores[key] > maxVal) {
                    maxVal = scores[key];
                    bestSkill = `${skillLabels[key]} (${maxVal}%)`;
                }
                if (scores[key] < minVal) {
                    minVal = scores[key];
                    worstSkill = `${skillLabels[key]} (${minVal}%)`;
                }
            }
            const bestEl = document.getElementById("hero-best-skill");
            const worstEl = document.getElementById("hero-worst-skill");
            if (bestEl) bestEl.innerText = bestSkill;
            if (worstEl) worstEl.innerText = worstSkill;
            
            const isDarkMode = document.body.classList.contains("light-mode");
            const chartTxtColor = isDarkMode ? "#ffffff" : "#0b3012";
            setTimeout(() => {
                this.drawEnglishRadarChart("english-skills-chart", scores, chartTxtColor);
            }, 150);
        }

        document.getElementById("hero-profile-modal").classList.remove("hidden");
    },

    calculateEnglishSkillScores: function(engState) {
        const stateToUse = engState || this.state || {};
        const sessions = stateToUse.examSessions || [];
        const scores = { listening: 70, speaking: 70, reading: 70, writing: 70, vocabulary: 70, grammar: 70 };
        
        if (sessions.length === 0) {
            return scores;
        }

        const counts = { listening: 0, speaking: 0, reading: 0, writing: 0, vocabulary: 0, grammar: 0 };
        const totals = { listening: 0, speaking: 0, reading: 0, writing: 0, vocabulary: 0, grammar: 0 };

        sessions.forEach(sess => {
            if (sess.answers && Array.isArray(sess.answers)) {
                sess.answers.forEach(ans => {
                    let category = ans.category || (sess.skill === 'listening' ? 'listening' : sess.skill === 'speaking' ? 'speaking' : sess.skill === 'reading' ? 'reading' : 'writing');
                    if (category === 'spelling') category = 'vocabulary';
                    
                    if (counts[category] !== undefined) {
                        counts[category]++;
                        if (ans.correct) {
                            totals[category]++;
                        }
                    }
                });
            }
        });

        for (const key in scores) {
            if (counts[key] > 0) {
                scores[key] = Math.round((totals[key] / counts[key]) * 100);
            }
        }
        return scores;
    },

    slayVocabularyMonster: function(word) {
        Swal.fire({
            title: `Tiêu diệt Quái vật '${word}' ⚔️`,
            text: `Hệ thống sẽ dẫn bạn đến bài luyện tập từ vựng này để rèn luyện lại nhé!`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Luyện tập ngay 🚀',
            cancelButtonText: 'Đóng',
            background: 'var(--bg-card)',
            color: 'var(--text-main)'
        }).then(result => {
            if (result.isConfirmed) {
                document.getElementById("hero-profile-modal").classList.add("hidden");
                const matchedLesson = COURSE_DATA.flatMap(chap => chap.lessons).find(l => l.spellingWords && l.spellingWords.includes(word));
                if (matchedLesson) {
                    this.startLesson(matchedLesson.id);
                } else {
                    Swal.fire('Thông báo', 'Không tìm thấy bài học tương ứng cho từ vựng này!', 'info');
                }
            }
        });
    },

        /* ==========================================================================
       LOGIC VÀ TƯƠNG TÁC TIẾNG ANH ĐỘT PHÁ 4 KỸ NĂNG (DUOLINGO & CAMBRIDGE STYLE)
       ========================================================================== */
    recognition: null,
    isRecording: false,
    currentEnglishQuestions: [],
    currentEnglishQuestionIndex: 0,
    currentEnglishScore: 0,
    currentEnglishStudentAnswer: null,
    currentEnglishLessonId: null,
    currentEnglishSkill: 'listening', // Kỹ năng mặc định đang học

    // Chuyển đổi tab chính Tiếng Anh (Bản đồ, Ôn tập, BXH, Cửa hàng, Hồ sơ)
    switchEnglishTab: function(tabName) {
        const navItems = document.querySelectorAll(".eng-nav-item");
        navItems.forEach(item => {
            if (item.id === `eng-nav-${tabName}`) {
                item.classList.add("active");
            } else {
                item.classList.remove("active");
            }
        });

        const panes = document.querySelectorAll(".eng-tab-pane");
        panes.forEach(pane => {
            if (pane.id === `eng-tab-${tabName}`) {
                pane.classList.remove("hidden");
            } else {
                pane.classList.add("hidden");
            }
        });

        if (tabName === 'map') {
            this.renderEnglishMap();
        } else if (tabName === 'practice') {
            this.renderEnglishPractice();
        } else if (tabName === 'ioe') {
            this.renderEnglishIoe();
        } else if (tabName === 'leaderboard') {
            this.renderEnglishLeaderboard();
        } else if (tabName === 'shop') {
            this.renderEnglishShop();
        } else if (tabName === 'profile') {
            this.renderEnglishProfile();
        } else if (tabName === 'custom-vocab') {
            this.renderCustomVocabTab();
        }
    },

    // Chọn kỹ năng học Tiếng Anh
    selectEnglishSkill: function(skillName) {
        this.currentEnglishSkill = skillName;
        const skillBtns = document.querySelectorAll(".skill-tab-btn");
        skillBtns.forEach(btn => {
            if (btn.classList.contains(skillName)) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
        this.renderEnglishMap();
    },

    // Cập nhật thông số Gamification của Tiếng Anh
    updateEnglishHeaderStats: function() {
        const streakVal = document.getElementById("eng-streak-val");
        const heartsVal = document.getElementById("eng-hearts-val");
        const xpVal = document.getElementById("eng-xp-val");
        const skillsCount = document.getElementById("eng-skills-count");
        const isInfinite = !!this.state.infiniteHearts;
        
        if (streakVal) streakVal.innerText = this.state.englishStreak || 0;
        if (heartsVal) {
            heartsVal.innerText = isInfinite ? "♾️" : (this.state.englishHearts || 5);
        }
        if (xpVal) xpVal.innerText = this.state.englishXp || 0;

        if (skillsCount) {
            const unlockedCount = this.getUnlockedSkillCardsCount();
            skillsCount.innerText = `${unlockedCount}/${SKILL_CARDS.length}`;
        }

        const focusHeartsCount = document.getElementById("english-hearts-count");
        if (focusHeartsCount) {
            focusHeartsCount.innerText = isInfinite ? "♾️" : (this.state.englishHearts || 5);
        }

        const infiniteBadge = document.getElementById("infinite-hearts-badge");
        if (infiniteBadge) {
            infiniteBadge.style.display = isInfinite ? "inline-block" : "none";
        }

        const toggle = document.getElementById("toggle-infinite-hearts");
        if (toggle) {
            toggle.checked = isInfinite;
        }
    },

    // Lưu trữ và đồng bộ trạng thái Tiếng Anh
    saveEnglishState: function() {
        this.saveProgress();
        this.updateEnglishHeaderStats();
    },

    // Xác định trạng thái mở khóa của bài học Tiếng Anh độc lập theo từng kỹ năng
    getEnglishLessonStatus: function(topicId) {
        const currentClass = this.config.currentClass || "6";
        const classData = window.ENGLISH_COURSE_DATA[currentClass];
        if (!classData || !classData.topics) return 'locked';
        
        const topics = classData.topics;
        const index = topics.findIndex(t => t.id === topicId);
        if (index === -1) return 'locked';
        
        const scoreKey = `${topicId}-${this.currentEnglishSkill}`;
        const score = this.state.scores[scoreKey] || 0;

        if (index === 0) {
            // Bài đầu tiên luôn được mở
            return score >= 80 ? 'completed' : 'active';
        }

        // Bài học được mở nếu bài trước đó của kỹ năng đó đã hoàn thành (score >= 80)
        const prevTopic = topics[index - 1];
        const prevScoreKey = `${prevTopic.id}-${this.currentEnglishSkill}`;
        const prevScore = this.state.scores[prevScoreKey] || 0;
        
        if (prevScore >= 80) {
            return score >= 80 ? 'completed' : 'active';
        }
        return 'locked';
    },

    // Vẽ giao diện học Tiếng Anh theo 4 kỹ năng Nghe - Nói - Đọc - Viết
    renderEnglishMap: function() {
        const container = document.getElementById("english-map-path-container");
        if (!container) return;
        container.innerHTML = "";

        const currentClass = this.config.currentClass || "6";
        const classData = window.ENGLISH_COURSE_DATA[currentClass];
        if (!classData) {
            container.innerHTML = `
                <div class="text-center" style="padding:3rem; color:#64748b;">
                    <div style="font-size:4rem; margin-bottom:1rem;">🗺️</div>
                    <h3 style="font-weight:900;">Chưa có dữ liệu bài học Tiếng Anh</h3>
                    <p>Giáo trình Tiếng Anh lớp ${currentClass} đang được cập nhật.</p>
                </div>
            `;
            return;
        }

        const levelLabel = classData.levelLabel || "Pre-A1 Starters";
        document.getElementById("english-map-class-title").innerText = `Học Tiếng Anh Lớp ${currentClass} - Trình độ ${levelLabel} 🗺️`;

        // Định dạng màu sắc pastel theo kỹ năng để tăng tính trực quan
        let skillTheme = {
            bg: "#eff6ff", border: "#bfdbfe", color: "#2563eb", name: "Nghe (Listening)"
        };
        if (this.currentEnglishSkill === 'speaking') {
            skillTheme = { bg: "#ecfdf5", border: "#a7f3d0", color: "#10b981", name: "Nói (Speaking)" };
        } else if (this.currentEnglishSkill === 'reading') {
            skillTheme = { bg: "#fff7ed", border: "#fed7aa", color: "#ea580c", name: "Đọc (Reading)" };
        } else if (this.currentEnglishSkill === 'writing') {
            skillTheme = { bg: "#f5f3ff", border: "#ddd6fe", color: "#7c3aed", name: "Viết (Writing)" };
        }

        // Tạo tiêu đề phân nhóm kỹ năng
        const skillHeader = document.createElement("div");
        skillHeader.style.cssText = `padding: 0.8rem 1.2rem; border-radius: 12px; font-weight:800; font-size:1.1rem; margin-bottom: 1rem; text-align: center; border: 1px solid ${skillTheme.border}; background: ${skillTheme.bg}; color: ${skillTheme.color}; box-shadow: 0 4px 6px rgba(0,0,0,0.02);`;
        skillHeader.innerHTML = `✨ Đang chọn kỹ năng: <b>${skillTheme.name}</b>`;
        container.appendChild(skillHeader);

        // Lặp qua 100% các chủ đề học tập
        classData.topics.forEach((topic, index) => {
            const status = this.getEnglishLessonStatus(topic.id);
            const scoreKey = `${topic.id}-${this.currentEnglishSkill}`;
            const score = this.state.scores[scoreKey] || 0;

            const isAdvanced = index >= (currentClass === "6" ? 12 : currentClass === "4" ? 20 : 16);
            const badgeType = isAdvanced 
                ? `<span style="background:linear-gradient(135deg, #f59e0b, #ef4444); color:white; font-size:0.75rem; padding:3px 10px; border-radius:99px; font-weight:800; display:inline-block; vertical-align:middle; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);">CHƯƠNG TRÌNH NÂNG CAO (LỚP ${parseInt(currentClass)+1}) 🚀</span>`
                : `<span style="background:linear-gradient(135deg, #3b82f6, #10b981); color:white; font-size:0.75rem; padding:3px 10px; border-radius:99px; font-weight:800; display:inline-block; vertical-align:middle; box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);">CHÍNH KHÓA SGK 📖</span>`;

            const card = document.createElement("div");
            card.className = "english-topic-card";
            card.style.cssText = `background: var(--bg-card); border: 2px solid ${status === 'locked' ? 'var(--border-color)' : skillTheme.border}; border-radius: 20px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.03); transition: transform 0.2s; position: relative; opacity: ${status === 'locked' ? 0.6 : 1};`;
            
            // Hover effect
            card.onmouseenter = () => { if (status !== 'locked') card.style.transform = "translateY(-4px)"; };
            card.onmouseleave = () => { card.style.transform = "translateY(0)"; };

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; border-bottom:1px solid var(--border-color); padding-bottom:0.8rem;">
                    <div>
                        <span style="font-weight:900; font-size:0.85rem; color:${skillTheme.color}; text-transform:uppercase;">Topic ${index + 1}</span>
                        <h3 style="margin:4px 0 0 0; font-size:1.25rem; font-weight:900; color:var(--text-main);">${topic.title}</h3>
                    </div>
                    <div>${badgeType}</div>
                </div>

                <!-- HỘP LÝ THUYẾT TRỰC QUAN -->
                <div style="display:flex; flex-direction:column; gap:0.8rem; margin:0.5rem 0;">
                    <!-- 1. Từ vựng đa giác quan -->
                    <div>
                        <span style="font-size:0.85rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; display:block; margin-bottom:0.4rem;">🔊 Từ vựng (Click để nghe phát âm):</span>
                        <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
                            ${topic.vocab.map(v => `
                                <span class="vocab-badge" onclick="app.playEnglishVoice('${v.word.replace(/'/g, "\\'")}')" style="background:var(--bg-app); border:1px solid var(--border-color); padding:5px 12px; border-radius:99px; font-weight:700; font-size:0.85rem; color:var(--text-main); display:flex; align-items:center; gap:0.4rem; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,0.01); transition:all 0.15s;" title="Click để nghe phát âm">
                                    <i class="fa-solid fa-volume-high" style="color:#2563eb; font-size:0.75rem;"></i>
                                    <b>${v.word}</b> 
                                    <span style="color:#ef4444; font-size:0.8rem; font-weight:600;">${v.phonetics || ''}</span>
                                    <span style="font-weight:normal; color:var(--text-muted); font-size:0.8rem;">: ${v.translation}</span>
                                </span>
                            `).join("")}
                        </div>
                    </div>

                    <!-- 2. Mẫu câu giao tiếp -->
                    <div style="background:rgba(0,0,0,0.02); border:1px solid var(--border-color); padding:0.8rem 1rem; border-radius:12px;">
                        <span style="font-size:0.82rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; display:block; margin-bottom:0.4rem;">💬 Mẫu câu giao tiếp:</span>
                        <ul style="margin:0; padding-left:1.2rem; display:flex; flex-direction:column; gap:0.4rem; font-size:0.9rem; font-weight:600; color:var(--text-main);">
                            ${topic.sentencePatterns.map(p => `
                                <li>
                                    <span style="color:#2563eb;">${p.english}</span>
                                    <br/><span style="font-weight:normal; color:var(--text-muted); font-size:0.82rem;">➔ ${p.vietnamese}</span>
                                </li>
                            `).join("")}
                        </ul>
                    </div>

                    <!-- 3. Tóm tắt Ngữ pháp -->
                    <div style="font-size:0.88rem; color:var(--text-muted); line-height:1.5;">
                        💡 <b style="color:var(--text-main);">Ngữ pháp & Bài giảng:</b>
                        ${topic.grammar.includes('<p>') ? `
                            <span style="color:var(--text-muted); display:block; margin-bottom:5px;">Chủ đề ngữ pháp và video bài giảng chi tiết.</span>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.2rem;">
                                <button class="btn-grammar" onclick="app.showEnglishGrammarModal('${topic.id}')" style="background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 1px solid #bfdbfe; color: #1e40af; font-weight: 800; font-size: 0.82rem; padding: 6px 14px; border-radius: 99px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.05); transition: all 0.15s; outline:none; border-style: solid;">
                                    <i class="fa-solid fa-book-open" style="font-size:0.75rem;"></i>
                                    Xem lý thuyết chi tiết
                                </button>
                                ${topic.videos && topic.videos.length > 0 ? `
                                    <button class="btn-grammar" onclick="app.showEnglishVideosModal('${topic.id}')" style="background: linear-gradient(135deg, #fff5f5, #ffe3e3); border: 1px solid #fecaca; color: #c53030; font-weight: 800; font-size: 0.82rem; padding: 6px 14px; border-radius: 99px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.05); transition: all 0.15s; outline:none; border-style: solid;">
                                        <i class="fa-brands fa-youtube" style="font-size:0.85rem; color:#ef4444;"></i>
                                        Xem bài giảng video
                                    </button>
                                ` : ''}
                            </div>
                        ` : `
                            <span style="color:var(--text-muted); display:block; margin-bottom:5px;">${topic.grammar}</span>
                            ${topic.videos && topic.videos.length > 0 ? `
                                <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.2rem;">
                                    <button class="btn-grammar" onclick="app.showEnglishVideosModal('${topic.id}')" style="background: linear-gradient(135deg, #fff5f5, #ffe3e3); border: 1px solid #fecaca; color: #c53030; font-weight: 800; font-size: 0.82rem; padding: 6px 14px; border-radius: 99px; cursor: pointer; display: inline-flex; align-items: center; gap: 0.4rem; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.05); transition: all 0.15s; outline:none; border-style: solid;">
                                        <i class="fa-brands fa-youtube" style="font-size:0.85rem; color:#ef4444;"></i>
                                        Xem bài giảng video
                                    </button>
                                </div>
                            ` : ''}
                        `}
                    </div>
                </div>

                <!-- TIẾN ĐỘ & NÚT HÀNH ĐỘNG -->
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-top:0.5rem; border-top:1px dashed var(--border-color); padding-top:1rem;">
                    <div style="display:flex; align-items:center; gap:0.6rem;">
                        ${status === 'completed' ? `<span style="font-size:1.8rem; text-shadow:0 0 8px gold;">👑</span>` : `<span style="font-size:1.5rem; filter:grayscale(100%); opacity:0.3;">👑</span>`}
                        <div>
                            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">Điểm số cao nhất:</div>
                            <div style="font-size:1.1rem; font-weight:800; color:${score >= 80 ? '#10b981' : '#f59e0b'};">${score}%</div>
                        </div>
                    </div>
                    <button class="btn-primary" onclick="app.startEnglishLesson('${topic.id}')" ${status === 'locked' ? 'disabled style="background:var(--border-color); border-color:var(--border-color); color:var(--text-muted); cursor:not-allowed; box-shadow:none; opacity:0.6;"' : 'style="cursor:pointer;"'}>
                        ${status === 'locked' ? '🔒 Chưa mở khóa' : status === 'completed' ? '👑 Ôn tập lại' : '🚀 Luyện tập ngay'}
                    </button>
                </div>
            `;
            container.appendChild(card);
        });

        // BÀI HỌC THỬ THÁCH TỪ CHA MẸ
        if (this.customTopics && this.customTopics.length > 0) {
            // Tiêu đề phân nhóm
            const parentHeader = document.createElement("div");
            parentHeader.style.cssText = `padding: 0.8rem 1.2rem; border-radius: 12px; font-weight:800; font-size:1.1rem; margin: 2rem 0 1rem 0; text-align: center; border: 1px solid #ddd6fe; background: #f5f3ff; color: #7c3aed; box-shadow: 0 4px 6px rgba(0,0,0,0.02);`;
            parentHeader.innerHTML = `🎯 Thử thách bài học từ Cha Mẹ`;
            container.appendChild(parentHeader);

            this.customTopics.forEach((topic, idx) => {
                // Lọc từ vựng thuộc chuyên đề này
                const topicVocab = (this.customVocabulary || []).filter(v => v.topic_id === topic.id);
                
                const card = document.createElement("div");
                card.className = "english-topic-card parent-challenge-card";
                card.style.cssText = `background: var(--bg-card); border: 2px solid #7c3aed; border-radius: 20px; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; box-shadow: 0 4px 15px rgba(124, 58, 237, 0.1); transition: transform 0.2s; position: relative; margin-bottom: 1rem;`;
                
                // Hover effect
                card.onmouseenter = () => { card.style.transform = "translateY(-4px)"; };
                card.onmouseleave = () => { card.style.transform = "translateY(0)"; };

                // Xây dựng danh sách từ hiển thị
                const vocabHtml = topicVocab.map(v => `
                    <span class="vocab-badge" onclick="app.playEnglishVoice('${v.word.replace(/'/g, "\\'")}')" style="background:var(--bg-app); border:1px solid #ddd6fe; padding:5px 12px; border-radius:99px; font-weight:700; font-size:0.85rem; color:var(--text-main); display:flex; align-items:center; gap:0.4rem; cursor:pointer; box-shadow:0 2px 4px rgba(0,0,0,0.01); transition:all 0.15s;" title="Click để nghe phát âm">
                        <i class="fa-solid fa-volume-high" style="color:#7c3aed; font-size:0.75rem;"></i>
                        <b>${v.word}</b> 
                        <span style="color:#ef4444; font-size:0.8rem; font-weight:600;">${v.phonetics || ''}</span>
                        <span style="font-weight:normal; color:var(--text-muted); font-size:0.8rem;">: ${v.translation}</span>
                    </span>
                `).join("");

                // Điểm số custom topic
                const scoreKey = `${topic.id}-${this.currentEnglishSkill}`;
                const score = this.state.scores[scoreKey] || 0;

                card.innerHTML = `
                    <div style="display:flex; justify-content:between; align-items:center; flex-wrap:wrap; gap:0.5rem; border-bottom:1px solid var(--border-color); padding-bottom:0.8rem;">
                        <div style="flex:1;">
                            <span style="font-weight:900; font-size:0.85rem; color:#7c3aed; text-transform:uppercase;">Thử thách ${idx + 1}</span>
                            <h3 style="margin:4px 0 0 0; font-size:1.25rem; font-weight:900; color:var(--text-main);">${topic.title}</h3>
                        </div>
                        <div>
                            <span style="background:linear-gradient(135deg, #7c3aed, #a78bfa); color:white; font-size:0.75rem; padding:4px 12px; border-radius:99px; font-weight:800; display:inline-block; box-shadow:0 2px 4px rgba(124,58,237,0.2);">TỰ LUYỆN ĐA GIÁC QUAN ⭐</span>
                        </div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:0.8rem; margin:0.5rem 0;">
                        <div>
                            <span style="font-size:0.85rem; font-weight:800; color:var(--text-muted); text-transform:uppercase; display:block; margin-bottom:0.4rem;">🔊 Từ vựng (Nhấn để nghe):</span>
                            <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
                                ${vocabHtml || '<span class="text-slate-400 text-xs italic">Chưa có từ vựng nào trong chuyên đề này</span>'}
                            </div>
                        </div>
                    </div>

                    <!-- TIẾN ĐỘ & NÚT HÀNH ĐỘNG -->
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-top:0.5rem; border-top:1px dashed var(--border-color); padding-top:1rem;">
                        <div style="display:flex; align-items:center; gap:0.6rem;">
                            ${score >= 80 ? `<span style="font-size:1.8rem; text-shadow:0 0 8px gold;">👑</span>` : `<span style="font-size:1.5rem; filter:grayscale(100%); opacity:0.3;">👑</span>`}
                            <div>
                                <div style="font-size:0.75rem; color:var(--text-muted); font-weight:700;">Điểm số cao nhất:</div>
                                <div style="font-size:1.1rem; font-weight:800; color:${score >= 80 ? '#10b981' : '#f59e0b'};">${score}%</div>
                            </div>
                        </div>
                        <button class="btn-primary" onclick="app.startEnglishLesson('${topic.id}')" style="cursor:pointer; background:linear-gradient(135deg, #7c3aed, #6d28d9); border-color:#7c3aed;">
                            ${score >= 80 ? '👑 Luyện tập lại' : '🚀 Luyện tập ngay'}
                        </button>
                    </div>
                `;
                container.appendChild(card);
            });
        }
    },

    // Bắt đầu vào làm bài học Tiếng Anh
    
    // Hiển thị lý thuyết ngữ pháp chi tiết dạng Modal tập trung
    
    // Hiển thị danh sách video bài giảng của bài học Tiếng Anh lớp 6 dưới dạng Modal trực quan
    showEnglishVideosModal: function(topicId) {
        const classLevel = this.config.currentClass || '6';
        const classData = window.ENGLISH_COURSE_DATA[classLevel];
        const topic = classData ? classData.topics.find(t => t.id === topicId) : null;
        if (!topic || !topic.videos || topic.videos.length === 0) {
            Swal.fire({
                title: 'Thông báo',
                text: 'Bài học này chưa được liên kết video bài giảng.',
                icon: 'info',
                confirmButtonColor: '#2563eb'
            });
            return;
        }

        let videosHtml = `<div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 1.2rem; text-align: left; max-height: 60vh; overflow-y: auto; padding: 0.5rem 0.2rem;">`;
        topic.videos.forEach((v, idx) => {
            videosHtml += `
                <div class="english-video-card" onclick="Swal.close(); app.playVideoFullscreen('${v.id}')" style="cursor:pointer; background:var(--bg-app); border:1px solid var(--border-color); border-radius:12px; padding:0.6rem; transition:all 0.25s; display:flex; flex-direction:column; gap:0.6rem; box-shadow: 0 4px 6px rgba(0,0,0,0.01);" onmouseover="this.style.transform='translateY(-3px)'; this.style.borderColor='#ef4444'; this.style.boxShadow='0 10px 15px -3px rgba(239,68,68,0.1)';" onmouseout="this.style.transform='none'; this.style.borderColor='var(--border-color)'; this.style.boxShadow='none';">
                    <div style="position:relative; width:100%; aspect-ratio:16/9; border-radius:8px; overflow:hidden; background:#000;">
                        <img src="https://img.youtube.com/vi/${v.id}/mqdefault.jpg" style="width:100%; height:100%; object-fit:cover; opacity:0.88; transition:all 0.2s;">
                        <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); width:40px; height:40px; background:rgba(239, 68, 68, 0.95); border-radius:50%; display:flex; align-items:center; justify-content:center; color:#fff; box-shadow:0 4px 10px rgba(239,68,68,0.4);">
                            <i class="fa-solid fa-play" style="font-size:1rem; margin-left:3px;"></i>
                        </div>
                        <span style="position:absolute; bottom:6px; right:6px; background:rgba(0,0,0,0.75); color:#fff; font-size:0.7rem; padding:2px 6px; border-radius:4px; font-weight:700;">Phần ${idx + 1}</span>
                    </div>
                    <div style="font-size:0.85rem; font-weight:800; color:var(--text-main); line-height:1.4; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; height:2.4rem;">
                        ${v.title.replace(/Tiếng Anh 6 Unit \d+:\s*/gi, '')}
                    </div>
                </div>
            `;
        });
        videosHtml += `</div>`;

        Swal.fire({
            title: `<div style="font-size:1.35rem; font-weight:900; color:#ef4444; margin-bottom:5px;"><i class="fa-brands fa-youtube"></i> VIDEO BÀI GIẢNG</div><div style="font-size:0.95rem; color:#64748b; font-weight:800;">${topic.title}</div>`,
            html: videosHtml,
            width: '850px',
            confirmButtonText: 'Đóng',
            confirmButtonColor: '#ef4444',
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            allowOutsideClick: true
        });
    },

showEnglishGrammarModal: function(topicId) {
        const classLevel = this.config.currentClass || '6';
        const classData = window.ENGLISH_COURSE_DATA[classLevel];
        const topic = classData ? classData.topics.find(t => t.id === topicId) : null;
        if (!topic || !topic.grammar) return;

        Swal.fire({
            title: `<div style="font-size:1.35rem; font-weight:900; color:#1e3a8a; margin-bottom:5px;">📖 LÝ THUYẾT NGỮ PHÁP</div><div style="font-size:0.95rem; color:#ea580c; font-weight:800;">${topic.title}</div>`,
            html: `
                <div class="grammar-modal-content" style="text-align: left; font-family: inherit; font-size: 0.95rem; line-height: 1.6; color: var(--text-main); max-height: 60vh; overflow-y: auto; padding: 0.8rem 1.2rem; border-top: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); margin: 0.8rem 0; border-radius: 8px; background: var(--bg-app);">
                    ${topic.grammar}
                </div>
                <style>
                    .grammar-modal-content table { width: 100% !important; border-collapse: collapse !important; margin: 10px 0 !important; font-size: 0.88rem !important; }
                    .grammar-modal-content th, .grammar-modal-content td { border: 1px solid var(--border-color) !important; padding: 8px !important; text-align: left !important; }
                    .grammar-modal-content tr:nth-child(even) { background-color: rgba(0,0,0,0.01) !important; }
                    .grammar-modal-content strong { color: #1e3a8a !important; }
                </style>
            `,
            width: '800px',
            confirmButtonText: 'Đóng',
            confirmButtonColor: '#2563eb',
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            allowOutsideClick: true
        });
    },

startEnglishLesson: function(lessonId, skipIntro = false) {
        const classLevel = this.config.currentClass || '6';
        const classData = window.ENGLISH_COURSE_DATA[classLevel];
        const topic = classData ? classData.topics.find(t => t.id === lessonId) : null;

        // Nếu chưa bỏ qua màn hình giới thiệu, hiển thị thông tin bài luyện tập/kiểm tra chi tiết
        if (!skipIntro) {
            let title = "Chủ đề học tập";
            let subtitle = "Luyện tập tiếng Anh";
            let isAdvanced = false;

            if (topic) {
                title = topic.title;
                subtitle = topic.subtitle;
                const index = classData.topics.findIndex(t => t.id === lessonId);
                isAdvanced = index >= (classLevel === "6" ? 12 : classLevel === "4" ? 20 : 16);
            } else {
                // Thử tìm trong COURSE_DATA cho bài học cũ
                const lessons = (window.COURSE_DATA || []).filter(chap => chap.subject === "english" && String(chap.class || "6") === String(classLevel)).flatMap(chap => chap.lessons);
                const fbLesson = lessons.find(l => l.id === lessonId);
                if (fbLesson) {
                    title = fbLesson.title;
                    subtitle = fbLesson.chapterTitle || "Bài ôn tập cũ";
                }
            }

            const skillName = this.currentEnglishSkill === 'listening' ? 'Listening (Kỹ năng Nghe)' :
                              this.currentEnglishSkill === 'speaking' ? 'Speaking (Kỹ năng Nói)' :
                              this.currentEnglishSkill === 'reading' ? 'Reading (Kỹ năng Đọc)' :
                              'Writing (Kỹ năng Viết)';
            const skillIcon = this.currentEnglishSkill === 'listening' ? '🎧' :
                              this.currentEnglishSkill === 'speaking' ? '🗣️' :
                              this.currentEnglishSkill === 'reading' ? '📖' :
                              '✍️';
            const skillColor = this.currentEnglishSkill === 'listening' ? '#2563eb' :
                               this.currentEnglishSkill === 'speaking' ? '#10b981' :
                               this.currentEnglishSkill === 'reading' ? '#ea580c' :
                               '#7c3aed';
            const skillBg = this.currentEnglishSkill === 'listening' ? '#eff6ff' :
                             this.currentEnglishSkill === 'speaking' ? '#ecfdf5' :
                             this.currentEnglishSkill === 'reading' ? '#fff7ed' :
                             '#f5f3ff';
            
            const difficulty = isAdvanced ? 'Nâng cao (Chương trình Lớp ' + (parseInt(classLevel) + 1) + ') 🚀' : 'Cơ bản - Chính khóa SGK 📚';
            
            let tipText = '';
            if (this.currentEnglishSkill === 'listening') {
                tipText = 'Đeo tai nghe và chỉnh âm lượng vừa đủ. Tập trung nghe kỹ từ khóa chính, con có thể nhấn nút loa nhiều lần để nghe lại trước khi chọn nhé!';
            } else if (this.currentEnglishSkill === 'speaking') {
                tipText = 'Hãy bấm vào Mic đỏ và đọc thật to, rõ ràng, dứt khoát. Nhớ tìm góc yên tĩnh để Micro nhận diện chuẩn nhất nhé!';
            } else if (this.currentEnglishSkill === 'reading') {
                tipText = 'Đọc kỹ câu hỏi và các phương án trả lời. Hãy nhớ lại nghĩa của từ vựng trong bảng lý thuyết ở màn hình ngoài!';
            } else if (this.currentEnglishSkill === 'writing') {
                tipText = 'Chú ý chính tả của từng chữ cái khi xếp từ hoặc câu. Kiểm tra kỹ viết hoa chữ đầu tiên và dấu câu ở cuối nhé!';
            }

            Swal.fire({
                title: `<div style="font-size:1.35rem; font-weight:900; color:var(--text-main); margin-bottom:5px;">📋 THÔNG TIN BÀI LUYỆN TẬP</div>`,
                html: `
                    <div style="text-align: left; font-family: inherit; font-size: 0.95rem; line-height: 1.6; color: var(--text-main); padding: 0.2rem;">
                        <div style="background: ${skillBg}; border: 1px solid ${skillColor}40; padding: 0.8rem 1rem; border-radius: 12px; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.8rem;">
                            <div style="font-size: 2.2rem;">${skillIcon}</div>
                            <div>
                                <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 800; letter-spacing: 0.5px;">Kỹ năng kiểm tra</div>
                                <div style="font-size: 1.15rem; font-weight: 900; color: ${skillColor};">${skillName}</div>
                            </div>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 0.8rem; background: var(--bg-app); border: 1px solid var(--border-color); padding: 0.8rem 1rem; border-radius: 12px; margin-bottom: 1rem;">
                            <div>
                                <span style="font-weight: 800; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; display: block;">📍 Chủ đề:</span>
                                <div style="font-weight: 800; color: var(--text-main); font-size: 1.05rem; margin-top: 2px;">${title}</div>
                                <div style="font-size: 0.85rem; color: var(--text-muted); font-style: italic; margin-top: 1px;">${subtitle}</div>
                            </div>
                            <div style="border-top: 1px dashed var(--border-color); padding-top: 0.6rem; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <span style="font-weight: 800; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; display: block;">📝 Số lượng câu:</span>
                                    <div style="font-weight: 800; color: var(--text-main); font-size: 0.95rem;">10 câu hỏi</div>
                                </div>
                                <div style="text-align: right;">
                                    <span style="font-weight: 800; color: var(--text-muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; display: block;">⚡ Độ khó:</span>
                                    <div style="font-weight: 800; color: ${isAdvanced ? '#ef4444' : '#10b981'}; font-size: 0.95rem;">${difficulty}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: rgba(245, 158, 11, 0.08); border-left: 4px solid #f59e0b; padding: 0.8rem 1rem; border-radius: 4px 12px 12px 4px; margin-bottom: 0.2rem;">
                            <div style="font-weight: 800; color: #d97706; font-size: 0.78rem; display: flex; align-items: center; gap: 0.4rem; text-transform: uppercase; margin-bottom: 3px; letter-spacing: 0.5px;">
                                <i class="fa-solid fa-lightbulb"></i> Mẹo làm bài:
                            </div>
                            <div style="font-size: 0.88rem; color: var(--text-main); font-weight: 600; line-height: 1.5;">${tipText}</div>
                        </div>
                    </div>
                `,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: '🚀 Bắt đầu ngay',
                cancelButtonText: 'Quay lại',
                confirmButtonColor: skillColor,
                cancelButtonColor: '#94a3b8',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    this.startEnglishLesson(lessonId, true);
                }
            });
            return;
        }

        this.currentEnglishLessonId = lessonId;

        if (topic) {
            Swal.fire({
                title: 'Đang tải thử thách...',
                html: 'Hệ thống đang chuẩn bị các câu hỏi luyện tập chất lượng cao.',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });

            // Gọi bộ sinh câu hỏi động client-side chạy offline cực nhanh và chính xác
            setTimeout(() => {
                const questions = window.generateEnglishQuestions(classLevel, lessonId, this.currentEnglishSkill);
                Swal.close();
                
                if (questions && questions.length > 0) {
                    this.currentEnglishQuestions = questions;
                    this.prepareEnglishQuestions();
                    this.currentEnglishQuestionIndex = 0;
                    this.currentEnglishScore = 0;
                    this.currentEnglishWrongCount = 0;
                    
                    document.body.classList.add("focus-mode-active");
                    document.getElementById("english-focus-lesson-screen").classList.remove("hidden");
                    this.pushHistory('english-lesson');
                    
                    this.updateEnglishHeaderStats();
                    this.updateEnglishLiveStats();
                    this.renderEnglishQuestion();
                } else {
                    Swal.fire("Lỗi", "Không thể sinh danh sách câu hỏi luyện tập.", "error");
                }
            }, 400);
        } else {
            // Fallback nạp qua API server đối với các bài học cũ
            Swal.fire({
                title: 'Đang tải thử thách...',
                html: 'Đang chuẩn bị các bài luyện tập đa giác quan.',
                allowOutsideClick: false,
                didOpen: () => { Swal.showLoading(); }
            });

            const studentId = this.config.defaultStudentId || 'default';
            fetch(this.getApiUrl(`/api/get-questions?lessonId=${lessonId}&studentId=${studentId}&classLevel=${classLevel}&skill=${this.currentEnglishSkill}`))
                .then(res => res.json())
                .then(data => {
                    Swal.close();
                    if (data && data.questions && data.questions.length > 0) {
                        this.currentEnglishQuestions = data.questions.slice(0, 5);
                        this.prepareEnglishQuestions();
                        this.currentEnglishQuestionIndex = 0;
                        this.currentEnglishScore = 0;
                        this.currentEnglishWrongCount = 0;
                        
                        document.body.classList.add("focus-mode-active");
                        document.getElementById("english-focus-lesson-screen").classList.remove("hidden");
                        this.pushHistory('english-lesson');
                        
                        this.updateEnglishHeaderStats();
                        this.updateEnglishLiveStats();
                        this.renderEnglishQuestion();
                    } else {
                        Swal.fire("Lỗi", "Không tải được danh sách câu hỏi học tập.", "error");
                    }
                })
                .catch(err => {
                    Swal.close();
                    console.error(err);
                    Swal.fire("Lỗi máy chủ", "Không thể kết nối để tải đề.", "error");
                });
        }
    },

    exitEnglishLesson: function() {
        this.stopSpeechRecognition();
        if (typeof window.speechSynthesis !== 'undefined') window.speechSynthesis.cancel();
        Swal.fire({
            title: "Rời khỏi bài học?",
            text: "Tiến trình của bài học hiện tại sẽ không được lưu lại đâu con nhé!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Thoát ngay 🚪",
            cancelButtonText: "Luyện tập tiếp 💪",
            background: 'var(--bg-card)',
            color: 'var(--text-main)'
        }).then(result => {
            if (result.isConfirmed) {
                document.getElementById("english-focus-lesson-screen").classList.add("hidden");
                document.body.classList.remove("focus-mode-active");
                const banner = document.getElementById("bottom-feedback-banner");
                if (banner) banner.classList.remove("active");
                
                if (this.navHistory && this.navHistory.length > 1) {
                    this.navHistory.pop(); // Pop 'english-lesson'
                    const prevScreen = this.navHistory[this.navHistory.length - 1];
                    this.showScreenByHistoryName(prevScreen);
                } else {
                    this.renderEnglishMap();
                }
                this.updateNavigationButtons();
            }
        });
    },

    // Curated exact mappings using high-quality vector illustrations from Icons8 Color style (very stable & professional)
    wordImageMap: {
        // Lớp 1 & Lớp 2 Nâng cao
        "hello": "hello", "goodbye": "goodbye", "name": "name", "what": "question-mark", "you": "user",
        "book": "open-book", "pen": "pen", "ruler": "ruler", "bag": "schoolbag", "pencil": "pencil",
        "red": "red-square", "blue": "blue-square", "green": "green-square", "yellow": "yellow-square", "circle": "circle",
        "one": "one", "two": "two", "three": "three", "four": "four", "five": "five",
        "father": "man", "mother": "woman", "brother": "boy", "sister": "girl", "baby": "baby",
        "head": "head", "face": "face", "hand": "hand", "foot": "foot", "hair": "hair",
        "ball": "soccer-ball", "doll": "doll", "train": "train", "car": "car", "plane": "airplane",
        "dog": "dog", "cat": "cat", "bird": "bird", "duck": "duck", "sun": "sun",
        "apple": "apple", "banana": "banana", "milk": "milk-bottle", "cake": "cake", "water": "water-glass",
        "run": "running", "walk": "running", "jump": "jumping", "dance": "dancing", "sing": "singing", "draw": "drawing",
        "read": "open-book", "write": "pencil", "listen": "hearing", "speak": "chat", "learn": "brain",
        "house": "home", "bedroom": "bedroom", "living room": "sofa", "kitchen": "kitchen", "bathroom": "shower",
        "bed": "bed", "table": "table", "chair": "chair", "sofa": "sofa", "tv": "tv",
        "shirt": "shirt", "pants": "jeans", "dress": "dress", "shoes": "shoes", "hat": "hat",
        "orange": "orange", "grape": "grapes", "mango": "mango", "strawberry": "strawberry", "pear": "pear",
        "cow": "cow", "horse": "horse", "pig": "pig", "sheep": "sheep", "chicken": "chicken",
        "lion": "lion", "tiger": "tiger", "elephant": "elephant", "monkey": "monkey", "zebra": "zebra",
        "sky": "cloud", "teacher": "teacher", "doctor": "doctor", "pilot": "pilot", "cook": "cook", "driver": "driver", "bus": "bus",

        // Lớp 4 & Lớp 5 Nâng cao
        "vietnam": "flag-of-vietnam", "america": "flag-of-usa", "england": "united-kingdom", "japan": "flag-of-japan", "australia": "flag-of-australia",
        "time": "clock", "clock": "clock", "morning": "sunrise", "afternoon": "sun", "evening": "sunset",
        "monday": "calendar", "tuesday": "calendar", "wednesday": "calendar", "thursday": "calendar", "friday": "calendar", "saturday": "calendar", "sunday": "calendar",
        "january": "calendar", "february": "calendar", "march": "calendar", "date": "calendar", "birthday": "birthday-cake",
        "swim": "swimming", "skate": "skating", "chess": "chess-board", "football": "soccer-ball", "hobby": "hobbies",
        "maths": "calculator", "science": "test-tube", "music": "music", "history": "history", "english": "united-kingdom",
        "bakery": "bakery", "bookshop": "book-shelf", "cinema": "cinema", "supermarket": "supermarket", "zoo": "zoo",
        "sunny": "sun", "rainy": "rain", "windy": "wind", "cloudy": "cloud", "snowy": "snow",
        "fever": "thermometer", "headache": "headache", "cough": "coughing", "sore throat": "throat", "cold": "cold",
        "yesterday": "history", "museum": "museum", "beach": "beach", "trip": "suitcase", "stayed": "home",
        "hometown": "home", "village": "home", "city": "city", "island": "island", "crowded": "crowd",
        "timetable": "calendar", "lesson": "book", "always": "checked", "usually": "checked", "sometimes": "checked",
        "tomorrow": "calendar", "next week": "calendar", "holiday": "beach", "visit": "running", "buy": "shopping-cart",
        "toothache": "headache", "earache": "throat", "medicine": "pill", "dentist": "doctor",
        "spring": "spring", "summer": "sun", "autumn": "leaf", "winter": "snow", "season": "globe",
        "left": "left", "right": "right", "straight": "up", "corner": "intersection", "station": "train",
        "story": "open-book", "intelligent": "brain", "like": "like",
        "chef": "cook", "astronaut": "astronaut", "nurse": "doctor",
        "apartment": "city", "cottage": "home", "villa": "home", "noise": "noise", "clean": "sparkles",
        "traffic": "traffic-light", "rule": "checked", "cross": "running", "sign": "attention", "helmet": "helmet",

        // Lớp 6 & Lớp 7 Nâng cao
        "calculator": "calculator", "compass": "compass", "uniform": "school-uniform", "textbook": "book", "canteen": "canteen",
        "drawer": "drawer", "short": "height", "clever": "brain", "creative": "paint-palette", "friendly": "handshake",
        "neighbourhood": "neighborhood", "temple": "temple", "cathedral": "cathedral", "suburb": "suburb", "noisy": "noise",
        "forest": "forest", "mountain": "mountain", "waterfall": "waterfall", "desert": "desert",
        "wish": "star", "fireworks": "fireworks", "blossom": "blossom", "relative": "family", "envelope": "envelope",
        "cartoon": "cartoon", "channel": "television", "programme": "television", "reporter": "reporter", "educational": "graduation-cap",
        "badminton": "badminton", "champion": "trophy", "stadium": "stadium", "fit": "fitness", "marathon": "runner",
        "continent": "globe", "landmark": "landmark", "historic": "castle", "modern": "city", "peaceful": "dove",
        "recycle": "recycle", "reuse": "reuse", "reduce": "reduce", "environment": "nature", "plastic": "plastic-bottle",
        "gardening": "gardening", "stamp": "stamp", "coin": "coin", "health": "heart",
        "calories": "fire", "diet": "salad", "lifestyle": "sports", "disease": "coughing",
        "volunteer": "handshake", "donate": "present", "clean-up": "broom", "shelter": "home", "homeless": "sad",
        "instrument": "guitar", "concert": "music", "artist": "paint-palette", "gallery": "picture",
        "noodle": "noodles", "soup": "soup", "recipe": "book", "ingredient": "ingredients", "turmeric": "ginger",
        "scholar": "graduation-cap", "monument": "statue", "stone": "stone", "imperial": "crown",
        "pedestrian": "running", "passenger": "passenger", "license": "card", "fine": "receipt", "road": "road",
        "comedy": "laughing", "action": "gun", "director": "director", "review": "checked", "boring": "sad",
        "energy": "lightning", "solar": "sun", "wind": "wind", "coal": "coal", "source": "faucet",
        "driverless": "car", "eco-friendly": "leaf", "hyperloop": "train", "flying": "airplane", "crash": "explosion"
    },

    getWordImagePath: function(word) {
        const cleanWord = word.toLowerCase().trim();
        const iconName = this.wordImageMap[cleanWord] || cleanWord.replace(/\s+/g, "-");
        return `https://img.icons8.com/color/180/${iconName}.png`;
    },

    // Hàm lấy emoji tương đương để dự phòng khi thiếu ảnh
    getWordEmoji: function(word) {
        if (window.getWordEmoji) {
            return window.getWordEmoji(word);
        }
        const map = {
            "book": "📖", "ball": "⚽", "bike": "🚲", "bill": "👦",
            "cat": "🐱", "car": "🚗", "cup": "🥛", "cake": "🍰",
            "mother": "👩", "father": "👨", "sister": "👧", "brother": "👦",
            "apple": "🍎", "banana": "🍌", "orange": "🍊", "pear": "🍐",
            "dog": "🐶", "bird": "🐦", "fish": "🐟", "rabbit": "🐰",
            "circle": "🔴", "square": "🟩", "triangle": "🔺",
            "pen": "🖊️", "pencil": "✏️", "ruler": "📏", "rubber": "🧽",
            "uniform": "👕", "calculator": "🧮", "compass": "🧭",
            "fridge": "🧊", "kitchen": "🍳", "bedroom": "🛏️", "wardrobe": "👚"
        };
        return map[word.toLowerCase().trim()] || "⭐️";
    },

    // Hàm cập nhật chú thích nguồn âm thanh trên UI
    updateAudioSourceLabel: function(sourceName) {
        const labelDuolingo = document.getElementById("english-audio-source-label");
        const labelIoe = document.getElementById("ioe-audio-source-label");
        const displayText = `🔊 Nguồn âm thanh: ${sourceName}`;
        if (labelDuolingo) labelDuolingo.innerText = displayText;
        if (labelIoe) labelIoe.innerText = displayText;
    },

    // Cập nhật số liệu Đúng/Sai/Điểm số trực tiếp trên UI
    updateEnglishLiveStats: function() {
        const correctEl = document.getElementById("english-correct-count");
        const wrongEl = document.getElementById("english-wrong-count");
        const scoreEl = document.getElementById("english-current-score");
        if (correctEl) correctEl.innerText = this.currentEnglishScore || 0;
        if (wrongEl) wrongEl.innerText = this.currentEnglishWrongCount || 0;
        if (scoreEl) scoreEl.innerText = (this.currentEnglishScore || 0) * 10;
    },

    playEnglishVoice: function(text, audioFileKey) {
        if (!text) return;
        const cleanKey = (audioFileKey || text).toLowerCase().trim().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
        const audioUrl = `sounds/english/${cleanKey}.mp3`;
        
        const audio = new Audio(audioUrl);
        audio.play()
            .then(() => {
                this.updateAudioSourceLabel("File cục bộ (Offline)");
            })
            .catch(err => {
                // Online Google Translate TTS API
                const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en-US&client=tw-ob&q=${encodeURIComponent(text)}`;
                const onlineAudio = new Audio(googleTtsUrl);
                onlineAudio.play()
                    .then(() => {
                        this.updateAudioSourceLabel("Google Translate API (Chuẩn Mỹ)");
                    })
                    .catch(onlineErr => {
                        console.warn(`[Speech Fallback] Dùng máy đọc TTS trình duyệt phát âm: ${text}`);
                        this.speakEnglish(text, true);
                    });
            });
    },

    speakEnglish: function(text, isFallback = false) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.95;
            utterance.onstart = () => {
                this.updateAudioSourceLabel(isFallback ? "Trình duyệt máy tính (Dự phòng)" : "Google Translate API (Chuẩn Mỹ)");
            };
            window.speechSynthesis.speak(utterance);
        } else {
            this.updateAudioSourceLabel("Không hỗ trợ phát âm");
        }
    },

    startSpeechRecognition: function(targetText) {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            Swal.fire("Lỗi", "Trình duyệt không hỗ trợ Web Speech API. Vui lòng dùng Chrome hoặc Edge!", "error");
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'en-US';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        const micBtn = document.getElementById("eng-mic-btn");
        const statusText = document.getElementById("eng-mic-status");
        const resultBox = document.getElementById("eng-speaking-result");

        this.recognition.onstart = () => {
            this.isRecording = true;
            if (micBtn) micBtn.classList.add("recording");
            if (statusText) statusText.innerText = "🎙️ Đang lắng nghe... Hãy nói to rõ ràng!";
            this.startWaveVisualizer();
        };

        this.recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            this.isRecording = false;
            if (micBtn) micBtn.classList.remove("recording");
            if (statusText) statusText.innerText = "Lỗi nhận diện: " + event.error;
            this.stopWaveVisualizer();
        };

        this.recognition.onend = () => {
            this.isRecording = false;
            if (micBtn) micBtn.classList.remove("recording");
            this.stopWaveVisualizer();
        };

        this.recognition.onresult = (event) => {
            const spokenText = event.results[0][0].transcript;
            console.log("[Speech Results]", spokenText);

            const cleanSpoken = spokenText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim().split(/\s+/);
            const cleanTarget = targetText.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim().split(/\s+/);
            const rawTargetWords = targetText.split(/\s+/);

            let formattedHtml = "";
            let correctCount = 0;

            rawTargetWords.forEach(word => {
                const cleanWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
                
                // Thuật toán so khớp mờ Levenshtein
                let wordFound = false;
                for (let spokenWord of cleanSpoken) {
                    const similarity = app.getSimilarityScore(spokenWord, cleanWord);
                    if (similarity >= 0.72 || spokenWord.includes(cleanWord) || cleanWord.includes(spokenWord)) {
                        wordFound = true;
                        break;
                    }
                }

                if (wordFound) {
                    formattedHtml += `<span style="color:#10b981; font-weight:800;">${word}</span> `;
                    correctCount++;
                } else {
                    formattedHtml += `<span style="color:#ef4444; font-weight:800;">${word}</span> `;
                }
            });

            if (resultBox) {
                resultBox.innerHTML = `
                    <div style="font-size:0.9rem; margin-bottom:0.5rem; color:#64748b; font-weight:700;">Hệ thống nhận diện được:</div>
                    <div style="font-size:1.4rem; line-height:1.4; margin-bottom:1rem; padding:0.5rem; background:var(--bg-app); border-radius:8px; border:1px solid var(--border-color);">${formattedHtml}</div>
                `;
            }

            const accuracy = cleanTarget.length > 0 ? Math.round((correctCount / cleanTarget.length) * 100) : 0;
            if (statusText) statusText.innerText = `Độ chính xác: ${accuracy}%`;

            // Ngưỡng đạt phát âm nhẹ nhàng hơn (>= 50% hoặc đúng >= 1 từ với câu cực ngắn)
            const isPassing = (cleanTarget.length <= 2) ? (correctCount >= 1) : (accuracy >= 50);

            this.currentEnglishStudentAnswer = {
                spokenText,
                accuracy,
                correct: isPassing
            };

            const checkBtn = document.getElementById("btn-eng-check-answer");
            if (checkBtn) {
                checkBtn.removeAttribute("disabled");
                checkBtn.style.opacity = "1";
            }
        };

        this.recognition.start();
    },

    stopSpeechRecognition: function() {
        if (this.recognition && this.isRecording) {
            this.recognition.stop();
        }
        this.stopWaveVisualizer();
    },

    toggleSpeechRecognition: function(targetText) {
        if (this.isRecording) {
            this.stopSpeechRecognition();
        } else {
            this.startSpeechRecognition(targetText);
        }
    },

    // --- Các hàm Sóng âm Visualizer & So khớp mờ ---
    getSimilarityScore: function(s1, s2) {
        let longer = s1;
        let shorter = s2;
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        const longerLength = longer.length;
        if (longerLength === 0) {
            return 1.0;
        }
        return (longerLength - this.editDistance(longer, shorter)) / parseFloat(longerLength);
    },

    editDistance: function(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        const costs = new Array();
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i == 0)
                    costs[j] = j;
                else {
                    if (j > 0) {
                        let newValue = costs[j - 1];
                        if (s1.charAt(i - 1) != s2.charAt(j - 1))
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0)
                costs[s2.length] = lastValue;
        }
        return costs[s2.length];
    },

    startWaveVisualizer: function() {
        const canvas = document.getElementById("speaking-wave-canvas");
        const timerEl = document.getElementById("speaking-timer");
        if (!canvas || !timerEl) return;

        canvas.style.display = "block";
        timerEl.style.display = "block";

        this.recordingSeconds = 0;
        timerEl.innerText = "00:00";
        this.recordingTimer = setInterval(() => {
            this.recordingSeconds++;
            const m = Math.floor(this.recordingSeconds / 60).toString().padStart(2, '0');
            const s = (this.recordingSeconds % 60).toString().padStart(2, '0');
            timerEl.innerText = `${m}:${s}`;
        }, 1000);

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    this.audioStream = stream;
                    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                    const source = audioCtx.createMediaStreamSource(stream);
                    const analyser = audioCtx.createAnalyser();
                    analyser.fftSize = 128;
                    source.connect(analyser);

                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);

                    const ctx = canvas.getContext("2d");
                    
                    const resizeCanvas = () => {
                        canvas.width = canvas.offsetWidth;
                        canvas.height = canvas.offsetHeight;
                    };
                    resizeCanvas();

                    const draw = () => {
                        if (!this.isRecording) {
                            audioCtx.close();
                            return;
                        }
                        requestAnimationFrame(draw);
                        analyser.getByteFrequencyData(dataArray);

                        ctx.fillStyle = '#f8fafc';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);

                        const barWidth = (canvas.width / bufferLength) * 1.5;
                        let barHeight;
                        let x = 0;

                        for (let i = 0; i < bufferLength; i++) {
                            barHeight = dataArray[i] / 4.5;
                            const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
                            gradient.addColorStop(0, '#3b82f6');
                            gradient.addColorStop(1, '#ef4444');

                            ctx.fillStyle = gradient;
                            ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);

                            x += barWidth;
                        }
                    };
                    draw();
                })
                .catch(err => {
                    console.warn("Could not start micro visualizer: ", err);
                    this.startFakeWaveVisualizer(canvas);
                });
        } else {
            this.startFakeWaveVisualizer(canvas);
        }
    },

    startFakeWaveVisualizer: function(canvas) {
        const ctx = canvas.getContext("2d");
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        
        const drawFake = () => {
            if (!this.isRecording) return;
            requestAnimationFrame(drawFake);
            
            ctx.fillStyle = '#f8fafc';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const barWidth = 4;
            const gap = 3;
            const barCount = Math.floor(canvas.width / (barWidth + gap));
            
            for (let i = 0; i < barCount; i++) {
                const barHeight = Math.random() * (canvas.height * 0.7) + 4;
                const x = i * (barWidth + gap);
                
                const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
                gradient.addColorStop(0, '#3b82f6');
                gradient.addColorStop(1, '#ec4899');
                
                ctx.fillStyle = gradient;
                ctx.fillRect(x, (canvas.height - barHeight) / 2, barWidth, barHeight);
            }
        };
        drawFake();
    },

    stopWaveVisualizer: function() {
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => track.stop());
            this.audioStream = null;
        }
        const canvas = document.getElementById("speaking-wave-canvas");
        const timerEl = document.getElementById("speaking-timer");
        if (canvas) canvas.style.display = "none";
        if (timerEl) timerEl.style.display = "none";
    },

    // Chạy đồng bộ Read-Along cho Đọc hiểu
    playReadAlong: function(passageText, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const words = passageText.split(/\s+/);
        container.innerHTML = words.map((w, idx) => `<span id="read-word-${idx}" style="font-size:1.4rem; transition: background 0.2s; border-radius: 4px; padding: 2px; margin-right: 4px; display:inline-block; color:var(--text-main); font-weight:600;">${w}</span>`).join("");

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(passageText);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;

            let currentWordIndex = 0;
            utterance.onboundary = (event) => {
                if (event.name === 'word') {
                    const oldEl = document.getElementById(`read-word-${currentWordIndex - 1}`);
                    if (oldEl) oldEl.style.backgroundColor = 'transparent';
                    
                    const el = document.getElementById(`read-word-${currentWordIndex}`);
                    if (el) {
                        el.style.backgroundColor = '#fef08a';
                        el.style.color = '#000000';
                    }
                    currentWordIndex++;
                }
            };

            utterance.onend = () => {
                const lastEl = document.getElementById(`read-word-${words.length - 1}`);
                if (lastEl) {
                    lastEl.style.backgroundColor = 'transparent';
                    lastEl.style.color = 'var(--text-main)';
                }
            };

            window.speechSynthesis.speak(utterance);
        } else {
            let idx = 0;
            const timer = setInterval(() => {
                if (idx > 0) {
                    const prev = document.getElementById(`read-word-${idx - 1}`);
                    if (prev) {
                        prev.style.backgroundColor = 'transparent';
                        prev.style.color = 'var(--text-main)';
                    }
                }
                const curr = document.getElementById(`read-word-${idx}`);
                if (curr) {
                    curr.style.backgroundColor = '#fef08a';
                    curr.style.color = '#000000';
                    idx++;
                } else {
                    clearInterval(timer);
                }
            }, 380);
        }
    },

    prepareEnglishQuestions: function() {
        if (!this.currentEnglishQuestions) return;
        
        const normalize = w => w.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
        
        this.currentEnglishQuestions.forEach(q => {
            let qType = q.questionType || q.type || "choice";
            if ((qType === "writing" || qType === "writing_unscramble") && !q.scrambledLetters && q.wordPool && q.wordPool.length > 1) {
                const correctAnswer = q.correctAnswer || "";
                const correctWordsNormalized = correctAnswer
                    ? correctAnswer.trim().split(/\s+/).filter(w => w.length > 0).map(normalize)
                    : q.wordPool.map(normalize);
                    
                let shuffled = q.wordPool.slice();
                let attempts = 0;
                const maxAttempts = 100;
                let isShuffledOk = false;
                
                while (attempts < maxAttempts) {
                    for (let i = shuffled.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        const temp = shuffled[i];
                        shuffled[i] = shuffled[j];
                        shuffled[j] = temp;
                    }
                    
                    const shuffledNormalized = shuffled.map(normalize);
                    let matchesCorrect = true;
                    if (shuffledNormalized.length === correctWordsNormalized.length) {
                        for (let i = 0; i < shuffledNormalized.length; i++) {
                            if (shuffledNormalized[i] !== correctWordsNormalized[i]) {
                                matchesCorrect = false;
                                break;
                            }
                        }
                    } else {
                        matchesCorrect = false;
                    }
                    
                    if (!matchesCorrect) {
                        isShuffledOk = true;
                        break;
                    }
                    attempts++;
                }
                
                if (!isShuffledOk) {
                    shuffled.reverse();
                }
                q.wordPool = shuffled;
            }
        });
    },

    // Vẽ giao diện câu hỏi Tiếng Anh
    renderEnglishQuestion: function() {
        this.stopSpeechRecognition();
        if (typeof window.speechSynthesis !== 'undefined') window.speechSynthesis.cancel();
        this.currentEnglishStudentAnswer = null;

        const container = document.getElementById("english-interaction-area");
        if (!container) return;
        container.innerHTML = "";

        const banner = document.getElementById("bottom-feedback-banner");
        if (banner) banner.className = "bottom-feedback-banner";

        const qIndex = this.currentEnglishQuestionIndex;
        const total = this.currentEnglishQuestions.length;
        const q = this.currentEnglishQuestions[qIndex];

        // Tiến trình bài học
        const progressPct = total > 0 ? Math.round((qIndex / total) * 100) : 0;
        const progressBar = document.getElementById("english-lesson-progress");
        if (progressBar) progressBar.style.width = `${progressPct}%`;
        
        const progressText = document.getElementById("english-focus-progress-text");
        if (progressText) {
            progressText.innerText = `Câu ${qIndex + 1}/${total}`;
        }

        let qType = q.questionType || q.type || "choice";
        let headerHtml = `<h2 style="font-size:1.3rem; font-weight:800; color:var(--text-main); text-align:center; margin-bottom:1.5rem; line-height:1.5;">${q.questionText}</h2>`;
        let innerHtml = "";

        if (qType === "listening") {
            const isDictation = !q.options || q.options.length === 0;
            const audioKey = q.listeningText || q.correctAnswer || "";
            
            innerHtml = `
                <div class="listening-challenge-box" style="text-align:center; width:100%;">
                    <div style="margin:2rem 0; display:inline-block;">
                        <button class="btn-audio-speak-large" onclick="app.playEnglishVoice('${q.listeningText.replace(/'/g, "\\'")}', '${audioKey.replace(/'/g, "\\'")}')" style="width:90px; height:90px; border-radius:50%; background:linear-gradient(135deg, #60a5fa, #2563eb); border:none; color:white; font-size:2.5rem; cursor:pointer; box-shadow:0 6px 12px rgba(37,99,235,0.3); transition:all 0.1s ease;">
                            <i class="fa-solid fa-volume-high"></i>
                        </button>
                    </div>
                    <p style="color:#64748b; font-weight:700; font-size:0.9rem; margin-top:0.5rem; margin-bottom:2rem;">Nhấn nút để nghe âm đọc thần chú</p>
                    
                    ${isDictation ? `
                        <input type="text" id="eng-dictation-input" class="form-input" style="text-align:center; font-size:1.3rem; max-width:320px; padding:0.8rem; border-radius:12px; border:2px solid var(--border-color); background:var(--bg-app); color:var(--text-main);" placeholder="Gõ câu/từ bạn nghe được..." autocomplete="off">
                    ` : `
                        <div class="options-grid" style="display:grid; grid-template-columns: repeat(2, 1fr); gap:1.2rem; width:100%; max-width:480px; margin: 0 auto;">
                            ${q.options.map((opt, i) => {
                                const cleanWord = opt.replace(/^[A-D]\.\s*/, "").toLowerCase().trim();
                                const imgPath = this.getWordImagePath(cleanWord);
                                const emoji = this.getWordEmoji(cleanWord);
                                return `
                                    <button class="option-btn duolingo-style" onclick="app.selectEnglishOption(${i})" id="opt-${i}" style="display:flex; flex-direction:column; align-items:center; gap:0.8rem; padding:1.2rem 0.5rem; height:auto; background:var(--bg-card); border: 2px solid var(--border-color); border-radius:16px;">
                                        <div class="flashcard-image-container" style="height:70px; width:70px; display:flex; justify-content:center; align-items:center;">
                                            <img src="${imgPath}" onerror="this.onerror=null; this.parentNode.innerHTML='<span style=\\'font-size:2.5rem;\\'>${emoji}</span>';" style="max-height:100%; max-width:100%; object-fit:contain;" />
                                        </div>
                                        <span style="font-weight:700; color:var(--text-main);">${opt}</span>
                                    </button>
                                `;
                            }).join("")}
                        </div>
                    `}
                </div>
            `;
        } 
        else if (qType === "listening_passage") {
            const audioKey = q.passageTitle || "passage";
            innerHtml = `
                <div class="listening-passage-box" style="text-align:center; width:100%;">
                    <div style="background:var(--bg-app); border:2px solid var(--border-color); border-radius:20px; padding:1.5rem; margin-bottom:1.5rem; display:flex; flex-direction:column; align-items:center; gap:0.8rem;">
                        <button class="btn-audio-speak-large" onclick="app.playEnglishVoice('${q.listeningText.replace(/'/g, "\\'")}', '${audioKey.replace(/'/g, "\\'")}')" style="width:80px; height:80px; border-radius:50%; background:linear-gradient(135deg, #a855f7, #7c3aed); border:none; color:white; font-size:2.2rem; cursor:pointer; box-shadow:0 6px 12px rgba(124,58,237,0.3); transition:all 0.1s ease;">
                            <i class="fa-solid fa-volume-high"></i>
                        </button>
                        <div style="font-weight:800; color:var(--text-main); font-size:1.05rem;">🎧 Bấm để nghe bài nói / cuộc hội thoại</div>
                        <div style="font-size:0.85rem; color:var(--text-muted); font-style:italic;">(Con hãy lắng nghe thật kỹ để trả lời câu hỏi bên dưới)</div>
                    </div>
                    
                    <div class="options-grid" style="display:flex; flex-direction:column; gap:0.8rem; width:100%; max-width:480px; margin:0 auto;">
                        ${q.options.map((opt, i) => `
                            <button class="option-btn duolingo-style" onclick="app.selectEnglishOption(${i})" id="opt-${i}" style="text-align:left; padding:1rem 1.2rem; background:var(--bg-card); border: 2px solid var(--border-color); border-radius:12px; font-weight:700; color:var(--text-main);">
                                ${opt}
                            </button>
                        `).join("")}
                    </div>
                </div>
            `;
        }
        else if (qType === "speaking" || qType === "speaking_roleplay") {
            const speakText = q.speakingText || q.correctAnswer || "";
            const isRoleplay = qType === "speaking_roleplay";
            
            innerHtml = `
                <div class="speaking-challenge-box" style="text-align:center; width:100%;">
                    ${isRoleplay ? `
                        <div style="background:rgba(59,130,246,0.06); border:1px solid rgba(59,130,246,0.15); padding:1rem; border-radius:12px; margin-bottom:1rem; display:flex; align-items:center; gap:0.8rem; justify-content:center;">
                            <button onclick="app.speakEnglish('${q.listeningText.replace(/'/g, "\\'")}')" style="background:#3b82f6; border:none; color:white; width:35px; height:35px; border-radius:50%; cursor:pointer;"><i class="fa-solid fa-volume-high"></i></button>
                            <div style="font-weight:700; color:#2563eb; text-align:left;">AI: "${q.listeningText}"</div>
                        </div>
                        <div style="font-weight:800; font-size:1.1rem; color:var(--text-muted); margin-bottom:1.5rem;">Trả lời của con: (Nói câu chứa từ khóa)</div>
                    ` : `
                        <button class="btn-tts-speak" onclick="app.speakEnglish('${speakText.replace(/'/g, "\\'")}')" style="margin-bottom:1.5rem; background:none; border:2px solid #cbd5e1; padding:6px 16px; border-radius:99px; font-weight:700; color:var(--text-main); cursor:pointer;">
                            <i class="fa-solid fa-volume-high"></i> Nghe giọng mẫu
                        </button>
                    `}
                    
                    <div class="speaking-sentence-text" id="eng-speaking-sentence" style="font-size:1.5rem; font-weight:900; color:#2563eb; margin-bottom:1.5rem;">${speakText}</div>
                    
                    <div id="eng-speaking-result" style="width:100%;"></div>
                    
                    <!-- Canvas Sóng Âm & Đồng Hồ Ghi Âm -->
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; width:100%; max-width:320px; margin:0 auto; gap:0.4rem;">
                        <div id="speaking-timer" style="font-size: 0.85rem; font-weight: 800; color: #ef4444; display: none; background:#fee2e2; padding:3px 12px; border-radius:99px; border:1px solid #fca5a5; font-family:monospace;">00:00</div>
                        <canvas id="speaking-wave-canvas" style="width: 100%; height: 50px; display: none; border-radius: 12px; background: #f8fafc; border:1px solid #e2e8f0; box-shadow:inset 0 1px 3px rgba(0,0,0,0.02);"></canvas>
                    </div>
                    
                    <div style="margin:1.5rem 0;">
                        <button class="micro-btn-neon" id="eng-mic-btn" onclick="app.toggleSpeechRecognition('${speakText.replace(/'/g, "\\'")}')" style="width:70px; height:70px; border-radius:50%; border:none; background:#ef4444; color:white; font-size:1.8rem; cursor:pointer; box-shadow:0 4px 10px rgba(239,68,68,0.3); display:inline-flex; justify-content:center; align-items:center; transition:all 0.2s ease;">
                            <i class="fa-solid fa-microphone"></i>
                        </button>
                        <div class="speech-status-text" id="eng-mic-status" style="margin-top:8px; font-size:0.85rem; color:#64748b; font-weight:700;">Nhấn Mic để bắt đầu nói</div>
                    </div>
                </div>
            `;
        } 
        else if (qType === "reading_passage") {
            innerHtml = `
                <div class="reading-passage-box" style="width:100%;">
                    <div style="background:#fefefe; border: 2px solid #e2e8f0; border-radius:16px; padding:1.2rem; margin-bottom:1.2rem; box-shadow:inset 0 2px 4px rgba(0,0,0,0.02); max-height:220px; overflow-y:auto; font-family:'Georgia', serif;">
                        <div id="read-along-container" style="line-height:1.6; text-align:left;">
                            ${q.passageText}
                        </div>
                    </div>
                    <div style="text-align:center; margin-bottom:1.2rem;">
                        <button class="btn-primary" onclick="app.playReadAlong('${q.passageText.replace(/'/g, "\\'")}', 'read-along-container')" style="background:linear-gradient(135deg,#fb923c,#ea580c); border:none; color:white; padding:6px 18px; border-radius:99px; font-weight:800; font-size:0.85rem; cursor:pointer;">
                            <i class="fa-solid fa-circle-play"></i> Nghe đọc (Read-Along) 📖
                        </button>
                    </div>
                    
                    <!-- Bảng từ vựng quan trọng hỗ trợ đọc hiểu -->
                    ${q.vocabList && q.vocabList.length > 0 ? `
                        <div style="margin-bottom:1.5rem; background:#fffbeb; border:1px solid #fde68a; border-radius:14px; padding:0.8rem 1rem; text-align:left;">
                            <div style="font-weight:800; font-size:0.85rem; color:#b45309; text-transform:uppercase; margin-bottom:0.6rem; display:flex; align-items:center; gap:4px;">
                                💡 Từ vựng bổ trợ & Phát âm:
                            </div>
                            <div style="display:flex; flex-wrap:wrap; gap:0.5rem;">
                                ${q.vocabList.map(v => `
                                    <span class="vocab-badge" onclick="app.playEnglishVoice('${v.word.replace(/'/g, "\\'")}')" style="background:#ffffff; border:1px solid #fde68a; padding:4px 10px; border-radius:8px; font-size:0.82rem; font-weight:700; color:#1e293b; display:inline-flex; align-items:center; gap:0.3rem; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,0.02);" title="Click để nghe phát âm">
                                        <i class="fa-solid fa-volume-high" style="color:#ea580c; font-size:0.7rem;"></i>
                                        <b>${v.word}</b> 
                                        <span style="color:#ef4444; font-weight:600; font-size:0.78rem;">${v.phonetics || ''}</span>
                                        <span style="font-weight:normal; color:#64748b;">: ${v.translation}</span>
                                    </span>
                                `).join("")}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="options-grid" style="display:flex; flex-direction:column; gap:0.8rem; width:100%; max-width:480px; margin:0 auto;">
                        ${q.options.map((opt, i) => `
                            <button class="option-btn duolingo-style" onclick="app.selectEnglishOption(${i})" id="opt-${i}" style="text-align:left; padding:1rem 1.2rem; background:var(--bg-card); border: 2px solid var(--border-color); border-radius:12px; font-weight:700; color:var(--text-main);">
                                ${opt}
                            </button>
                        `).join("")}
                    </div>
                </div>
            `;
        }
        else if (qType === "reading_cloze" || qType === "writing" || qType === "writing_unscramble") {
            const wordsList = q.wordPool || [];
            
            innerHtml = `
                <div class="writing-challenge-box" style="width:100%;">
                    ${qType === "reading_cloze" ? `
                        <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:1.2rem; border-radius:12px; margin-bottom:1.5rem; text-align:left; font-size:1.1rem; line-height:1.8; color:var(--text-main);" id="cloze-passage-display">
                            ${q.passageTemplate.replace(/\{(\d+)\}/g, '<span class="cloze-slot" style="display:inline-block; width:80px; border-bottom:2px solid #94a3b8; margin:0 4px; text-align:center; font-weight:800; color:#2563eb;">&nbsp;</span>')}
                        </div>
                    ` : `
                        ${q.scrambledLetters ? `
                            <div style="display: flex; gap: 0.6rem; justify-content: center; margin-bottom: 1.5rem; flex-wrap: wrap;">
                                ${q.scrambledLetters.split('-').map(letter => `
                                    <span class="scrambled-letter-card">${letter}</span>
                                `).join('')}
                            </div>
                        ` : ''}
                        <div class="english-slots-container" id="english-slots-pool" style="min-height:55px; border:2px dashed #cbd5e1; border-radius:12px; width:100%; display:flex; gap:0.5rem; justify-content:center; align-items:center; padding:0.5rem; margin-bottom:1.5rem; background:var(--bg-app); flex-wrap:wrap;">
                            <!-- Thẻ kéo thả click chuyển vị trí -->
                        </div>
                    `}
                    
                    <div class="english-drag-container" id="english-drag-pool" style="display:flex; gap:0.6rem; flex-wrap:wrap; justify-content:center; width:100%; padding:0.5rem;">
                        ${wordsList.map((word, i) => `
                            <div class="drag-word-block" id="drag-block-${i}" onclick="app.handleDragBlockClick(${i}, '${word.replace(/'/g, "\\'")}', '${qType}')" style="background:var(--bg-card); border:2px solid var(--border-color); border-bottom:4px solid var(--border-color); border-radius:10px; padding:0.5rem 1rem; font-weight:800; cursor:pointer; user-select:none; color:var(--text-main); font-size:0.95rem; transition:transform 0.1s;">${word}</div>
                        `).join("")}
                    </div>
                </div>
            `;
        }
        else if (qType === "writing_completion" || qType === "writing_rewrite" || qType === "reading_qa") {
            innerHtml = `
                <div style="width:100%; text-align:center;">
                    <div style="margin-bottom:1.5rem;">
                        <input type="text" id="eng-free-writing-input" class="form-input" style="text-align:center; font-size:1.2rem; width:100%; max-width:420px; padding:0.8rem; border-radius:12px; border:2px solid var(--border-color); background:var(--bg-app); color:var(--text-main);" placeholder="Gõ câu trả lời của con..." autocomplete="off">
                    </div>
                </div>
            `;
        }
        else {
            // Trắc nghiệm mặc định
            innerHtml = `
                <div class="options-grid" style="display:flex; flex-direction:column; gap:0.8rem; width:100%; max-width:480px; margin:0 auto;">
                    ${q.options.map((opt, i) => `
                        <button class="option-btn duolingo-style" onclick="app.selectEnglishOption(${i})" id="opt-${i}" style="text-align:left; padding:1rem 1.2rem; background:var(--bg-card); border: 2px solid var(--border-color); border-radius:12px; font-weight:700; color:var(--text-main);">
                            ${opt}
                        </button>
                    `).join("")}
                </div>
            `;
        }

        container.innerHTML = `
            ${headerHtml}
            ${innerHtml}
            <div style="margin-top:2.5rem; text-align:center; width:100%;">
                <button class="btn-primary disabled" id="btn-eng-check-answer" onclick="app.checkEnglishAnswer()" disabled style="padding:0.75rem 2.5rem; border-radius:12px; font-weight:800; font-size:1rem; opacity:0.5; cursor:pointer;">
                    <i class="fa-solid fa-circle-check"></i> Kiểm Tra
                </button>
            </div>
        `;

        // Kích hoạt lắng nghe thay đổi input tự động
        const inputFree = document.getElementById("eng-free-writing-input") || document.getElementById("eng-dictation-input");
        if (inputFree) {
            inputFree.focus();
            inputFree.oninput = (e) => {
                const checkBtn = document.getElementById("btn-eng-check-answer");
                if (checkBtn) {
                    if (e.target.value.trim().length > 0) {
                        checkBtn.removeAttribute("disabled");
                        checkBtn.style.opacity = "1";
                    } else {
                        checkBtn.setAttribute("disabled", "true");
                        checkBtn.style.opacity = "0.5";
                    }
                }
            };
        }
    },

    selectEnglishOption: function(optIndex) {
        const q = this.currentEnglishQuestions[this.currentEnglishQuestionIndex];
        const total = q.options.length;
        
        for (let i = 0; i < total; i++) {
            const btn = document.getElementById(`opt-${i}`);
            if (btn) {
                if (i === optIndex) {
                    btn.classList.add("selected");
                } else {
                    btn.classList.remove("selected");
                }
            }
        }

        this.currentEnglishStudentAnswer = optIndex;

        const checkBtn = document.getElementById("btn-eng-check-answer");
        if (checkBtn) {
            checkBtn.removeAttribute("disabled");
            checkBtn.style.opacity = "1";
        }
    },

    handleDragBlockClick: function(blockId, word, qType) {
        const block = document.getElementById(`drag-block-${blockId}`);
        if (!block) return;

        const checkBtn = document.getElementById("btn-eng-check-answer");
        
        if (qType === "reading_cloze") {
            const clozeContainer = document.getElementById("cloze-passage-display");
            const slots = clozeContainer.querySelectorAll(".cloze-slot");
            
            if (block.parentNode.id === "english-drag-pool") {
                // Điền vào slot trống đầu tiên
                let filled = false;
                for (let slot of slots) {
                    if (slot.innerHTML === "&nbsp;" || slot.innerText.trim() === "") {
                        slot.innerHTML = word;
                        slot.setAttribute("data-block-id", blockId);
                        block.style.opacity = "0.3";
                        block.style.pointerEvents = "none";
                        filled = true;
                        break;
                    }
                }
            } else {
                // Nếu click vào một ô trong slot thì sẽ trả lại (đã xử lý bằng click vào cloze slot bên dưới)
            }

            // Gán sự kiện click vào cloze slot để gỡ ra
            slots.forEach(slot => {
                slot.style.cursor = "pointer";
                slot.onclick = () => {
                    const bId = slot.getAttribute("data-block-id");
                    if (bId !== null) {
                        const targetBlock = document.getElementById(`drag-block-${bId}`);
                        if (targetBlock) {
                            targetBlock.style.opacity = "1";
                            targetBlock.style.pointerEvents = "auto";
                        }
                        slot.innerHTML = "&nbsp;";
                        slot.removeAttribute("data-block-id");
                        
                        // Cập nhật nút kiểm tra
                        let filledCount = 0;
                        slots.forEach(s => { if (s.innerText.trim().length > 0) filledCount++; });
                        if (checkBtn) {
                            if (filledCount > 0) {
                                checkBtn.removeAttribute("disabled");
                                checkBtn.style.opacity = "1";
                            } else {
                                checkBtn.setAttribute("disabled", "true");
                                checkBtn.style.opacity = "0.5";
                            }
                        }
                    }
                };
            });

            // Kiểm tra xem đã điền từ nào chưa
            let filledCount = 0;
            slots.forEach(s => { if (s.innerText.trim().length > 0) filledCount++; });
            if (checkBtn) {
                if (filledCount > 0) {
                    checkBtn.removeAttribute("disabled");
                    checkBtn.style.opacity = "1";
                } else {
                    checkBtn.setAttribute("disabled", "true");
                    checkBtn.style.opacity = "0.5";
                }
            }
        } else {
            // Sắp xếp câu xáo trộn
            const slotsPool = document.getElementById("english-slots-pool");
            const dragPool = document.getElementById("english-drag-pool");

            if (block.parentNode.id === "english-drag-pool") {
                slotsPool.appendChild(block);
            } else {
                dragPool.appendChild(block);
            }

            if (checkBtn) {
                const chosenCount = slotsPool.children.length;
                if (chosenCount > 0) {
                    checkBtn.removeAttribute("disabled");
                    checkBtn.style.opacity = "1";
                } else {
                    checkBtn.setAttribute("disabled", "true");
                    checkBtn.style.opacity = "0.5";
                }
            }
        }
    },

    checkEnglishAnswer: function() {
        if (typeof window.speechSynthesis !== 'undefined') window.speechSynthesis.cancel();
        const qIndex = this.currentEnglishQuestionIndex;
        const q = this.currentEnglishQuestions[qIndex];
        const qType = q.questionType || q.type || "choice";

        let isCorrect = false;
        let explanation = "";
        let studentAnsStr = "";

        if (qType === "listening" && (!q.options || q.options.length === 0)) {
            // dictation
            const inputVal = document.getElementById("eng-dictation-input").value.trim().toLowerCase();
            const correctVal = q.correctAnswer.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
            const cleanInput = inputVal.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
            isCorrect = (cleanInput === correctVal);
            studentAnsStr = inputVal;
            explanation = `Đáp án đúng: <b>${q.correctAnswer}</b>`;
        } 
        else if (qType === "speaking" || qType === "speaking_roleplay") {
            if (this.currentEnglishStudentAnswer) {
                isCorrect = this.currentEnglishStudentAnswer.correct;
                studentAnsStr = this.currentEnglishStudentAnswer.spokenText;
                explanation = `Độ chính xác: <b>${this.currentEnglishStudentAnswer.accuracy}%</b>. Cần tối thiểu 60% để đạt.`;
            }
        } 
        else if (qType === "reading_cloze") {
            const clozeContainer = document.getElementById("cloze-passage-display");
            const slots = clozeContainer.querySelectorAll(".cloze-slot");
            const chosenWords = Array.from(slots).map(s => s.innerText.trim().toLowerCase());
            const correctWords = q.correctAnswers.map(w => w.trim().toLowerCase());
            
            isCorrect = true;
            for (let i = 0; i < correctWords.length; i++) {
                if (chosenWords[i] !== correctWords[i]) {
                    isCorrect = false;
                    break;
                }
            }
            studentAnsStr = chosenWords.join(", ");
            explanation = `Đoạn văn đúng: <br/><b>${q.correctAnswer || q.correctAnswers.join(" - ")}</b>`;
        }
        else if (qType === "writing" || qType === "writing_unscramble") {
            const slotsPool = document.getElementById("english-slots-pool");
            const chosenWords = Array.from(slotsPool.children).map(node => node.innerText);
            
            if (q.scrambledLetters) {
                // Sắp xếp chữ cái thành từ (Spelling) - ghép không khoảng trắng
                const studentWord = chosenWords.join("").toLowerCase().replace(/\s+/g, "").replace(/[\u00a0]/g, "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
                const correctWord = q.correctAnswer.toLowerCase().replace(/\s+/g, "").replace(/[\u00a0]/g, "").replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
                isCorrect = (studentWord === correctWord);
                studentAnsStr = chosenWords.join("");
                explanation = `Từ đúng: <b>${q.correctAnswer}</b>`;
            } else {
                // Sắp xếp từ thành câu - ghép có khoảng trắng
                const studentSentence = chosenWords.join(" ").toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
                const correctSentence = q.correctAnswer.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
                isCorrect = (studentSentence === correctSentence);
                studentAnsStr = chosenWords.join(" ");
                explanation = `Câu đúng: <b>${q.correctAnswer}</b>`;
            }
        }
        else if (qType === "writing_completion" || qType === "writing_rewrite" || qType === "reading_qa") {
            const inputVal = document.getElementById("eng-free-writing-input").value.trim();
            studentAnsStr = inputVal;
            
            if (q.correctAnswers && Array.isArray(q.correctAnswers)) {
                isCorrect = q.correctAnswers.map(x => x.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ""))
                                            .includes(inputVal.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ""));
                explanation = `Các đáp án được chấp nhận: <br/><b>${q.correctAnswers.join(" | ")}</b>`;
            } else {
                const correctSentence = q.correctAnswer.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
                const cleanInput = inputVal.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
                isCorrect = (cleanInput === correctSentence);
                explanation = `Đáp án đúng: <b>${q.correctAnswer}</b>`;
            }
            
            // Smart Grammar Assistant phân tích lỗi chi tiết cho Viết nếu làm sai
            if (!isCorrect && (qType === "writing_completion" || qType === "writing_rewrite")) {
                const target = q.correctAnswer || q.correctAnswers[0];
                let analysis = "Lỗi chưa xác định.";
                
                // Thuật toán kiểm tra lỗi sư phạm
                if (inputVal.toLowerCase().includes(target.toLowerCase())) {
                    analysis = "Dấu câu hoặc ký tự thừa.";
                } else if (target.toLowerCase().endsWith("s") && !inputVal.toLowerCase().endsWith("s")) {
                    analysis = "Chia sai động từ ngôi thứ 3 số ít (Thiếu đuôi s/es) hoặc sai danh từ số nhiều.";
                } else if (target.toLowerCase().endsWith("ed") && !inputVal.toLowerCase().endsWith("ed")) {
                    analysis = "Chưa chia động từ về thì Quá khứ đơn (Thiếu đuôi ed).";
                } else if (Math.abs(inputVal.length - target.length) <= 2) {
                    analysis = "Viết sai chính tả một vài ký tự của từ.";
                } else {
                    analysis = "Sai cấu trúc ngữ pháp mẫu câu hoặc dùng sai từ vựng.";
                }
                
                explanation += `<br/><span style="color:#ef4444; font-weight:800;"><i class="fa-solid fa-wand-magic-sparkles"></i> Trợ lý Ngữ pháp:</span> ${analysis}`;
            }
        }
        else {
            // Trắc nghiệm thông thường (so khớp chuỗi thông minh để tương thích cả đề cũ và đề mới)
            const chosenAnswer = q.options[this.currentEnglishStudentAnswer] || "";
            const correctText = q.correctAnswer || (typeof q.correctIndex !== 'undefined' && q.options[q.correctIndex] ? q.options[q.correctIndex] : "");
            
            isCorrect = (chosenAnswer.toLowerCase().trim() === correctText.toLowerCase().trim());
            studentAnsStr = chosenAnswer;
            explanation = `Đáp án đúng: <b>${correctText}</b>`;
        }

        q.isCorrect = isCorrect;
        if (qType === "listening_passage") {
            explanation = `Đoạn văn nghe được:<br/><i style="color:var(--text-main); font-family:Georgia, serif;">"${q.listeningText}"</i><br/><br/>Đáp án đúng: <b>${q.correctAnswer}</b>`;
        }

        // Đẩy kết quả vào banner phản hồi Duolingo
        const banner = document.getElementById("bottom-feedback-banner");
        const duoChar = document.getElementById("bottom-feedback-duo-character");
        const feedbackTitle = document.getElementById("bottom-feedback-title");
        const feedbackSubtitle = document.getElementById("bottom-feedback-subtitle");
        const actionArea = document.getElementById("bottom-feedback-action-area");

        if (banner) {
            banner.className = "bottom-feedback-banner active";
            
            if (isCorrect) {
                this.currentEnglishScore++;
                this.updateEnglishLiveStats();

                banner.classList.add("feedback-correct");
                if (duoChar) duoChar.innerText = "🦉";
                if (feedbackTitle) feedbackTitle.innerText = "Chính xác! Con thật giỏi 🎉";
                if (feedbackSubtitle) feedbackSubtitle.innerHTML = explanation || "Đúng rồi!";
                
                const soundCorrect = new Audio("sounds/correct.mp3");
                soundCorrect.play().catch(e => console.log(e));

                // Phát giọng đọc khen ngợi tiếng Anh tự nhiên (TTS) sau 250ms
                setTimeout(() => {
                    const quotes = ["Fantastic!", "Excellent!", "Well done!", "Awesome!", "Great job!", "Perfect!", "Amazing!", "Superb!", "You did it!", "Good job!"];
                    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                    this.speakEnglish(randomQuote);
                }, 250);

                // Có 25% tỷ lệ phát thêm tiếng vỗ tay clapping làm nền
                if (Math.random() < 0.25) {
                    setTimeout(() => {
                        const clap = new Audio("sounds/clapping.mp3");
                        clap.volume = 0.35;
                        clap.play().catch(e => console.log(e));
                    }, 300);
                }
            } else {
                this.currentEnglishWrongCount = (this.currentEnglishWrongCount || 0) + 1;
                this.updateEnglishLiveStats();

                banner.classList.add("feedback-wrong");
                if (duoChar) duoChar.innerText = "😭";
                if (feedbackTitle) feedbackTitle.innerText = "Chưa chính xác rồi con ơi!";
                let feedbackHtml = explanation;
                if (q.solutionHtml) {
                    feedbackHtml += `<div class="feedback-solution" style="margin-top:0.8rem; padding:0.8rem; background:rgba(255,255,255,0.4); border-radius:12px; font-size:0.95rem; text-align:left; line-height:1.5; color:#7f1d1d; border-left:4px solid #ef4444;">`;
                    feedbackHtml += `<i class="fa-solid fa-lightbulb"></i> <b>Mẹo & Giải thích:</b> ${q.solutionHtml}`;
                    
                    // Nếu là câu hỏi sắp xếp câu, hiển thị gợi ý viết hoa chữ cái đầu và kết thúc bằng dấu chấm
                    if ((qType === "writing" || qType === "writing_unscramble") && !q.scrambledLetters && q.wordPool) {
                        const firstWord = q.wordPool.find(w => /^[A-Z]/.test(w));
                        const lastWord = q.wordPool.find(w => /[.!?]$/.test(w));
                        if (firstWord || lastWord) {
                            feedbackHtml += `<br/><i class="fa-solid fa-pen-to-square"></i> <b>Gợi ý sắp xếp:</b> `;
                            const tipsList = [];
                            if (firstWord) tipsList.push(`Từ bắt đầu câu (viết hoa) là <b>"${firstWord}"</b>`);
                            if (lastWord) tipsList.push(`Từ kết thúc câu (kèm dấu câu) là <b>"${lastWord}"</b>`);
                            feedbackHtml += tipsList.join(", ") + ".";
                        }
                    }
                    feedbackHtml += `</div>`;
                }
                if (feedbackSubtitle) feedbackSubtitle.innerHTML = feedbackHtml;

                const focusScreen = document.getElementById("english-focus-lesson-screen");
                if (focusScreen) {
                    focusScreen.classList.add("shake-effect");
                    setTimeout(() => focusScreen.classList.remove("shake-effect"), 400);
                }

                const soundWrong = new Audio("sounds/wrong.mp3");
                soundWrong.play().catch(e => console.log(e));
            }

            actionArea.innerHTML = `
                <button class="btn-feedback-action" onclick="app.nextEnglishQuestion()">Tiếp Tục <i class="fa-solid fa-chevron-right"></i></button>
            `;
        }
    },

    nextEnglishQuestion: function() {
        this.currentEnglishQuestionIndex++;
        const total = this.currentEnglishQuestions.length;

        if (this.currentEnglishQuestionIndex >= total) {
            // Vượt qua thử thách!
            const finalScorePct = Math.round((this.currentEnglishScore / total) * 100);
            
            document.getElementById("english-focus-lesson-screen").classList.add("hidden");
            document.body.classList.remove("focus-mode-active");
            const banner = document.getElementById("bottom-feedback-banner");
            if (banner) banner.classList.remove("active");

            const lessonId = this.currentEnglishLessonId;
            const xpEarned = 100; // Nhận 100 XP
            
            // Lưu điểm độc lập theo kỹ năng
            const scoreKey = `${lessonId}-${this.currentEnglishSkill}`;
            const currentScore = this.state.scores[scoreKey] || 0;
            
            if (finalScorePct > currentScore) {
                this.state.scores[scoreKey] = finalScorePct;
            }

            // Lưu lịch sử chi tiết
            const session = {
                id: "sess_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
                lessonId: lessonId,
                skill: this.currentEnglishSkill,
                score: finalScorePct,
                timestamp: Date.now(),
                answers: this.currentEnglishQuestions.map((q, idx) => ({
                    questionIndex: idx,
                    questionText: q.questionText,
                    category: q.category || (this.currentEnglishSkill === 'listening' ? 'listening' : this.currentEnglishSkill === 'speaking' ? 'speaking' : this.currentEnglishSkill === 'reading' ? 'reading' : 'writing'),
                    correct: typeof q.isCorrect !== 'undefined' ? q.isCorrect : false
                }))
            };
            this.state.examSessions = this.state.examSessions || [];
            this.state.examSessions.push(session);

            this.state.englishXp = (this.state.englishXp || 0) + xpEarned;
            this.checkAndReward100PercentLesson(lessonId, 'english');
            
            if ((this.currentEnglishSkill === 'spelling' || this.currentEnglishSkill === 'writing') && finalScorePct === 100) {
                this.state.slainMonstersCount = (this.state.slainMonstersCount || 0) + 1;
            }
            
            // Quản lý Streak độc lập
            const lastStudyDateStr = localStorage.getItem("english_last_study_date");
            const todayStr = new Date().toDateString();
            if (lastStudyDateStr !== todayStr) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                if (lastStudyDateStr === yesterday.toDateString()) {
                    this.state.englishStreak = (this.state.englishStreak || 0) + 1;
                } else {
                    this.state.englishStreak = 1;
                }
                localStorage.setItem("english_last_study_date", todayStr);
            }

            this.saveEnglishState();

            Swal.fire({
                title: finalScorePct >= 80 ? "Chúc mừng Chiến binh! 👑" : "Hoàn thành thử thách!",
                html: `Bạn đạt số điểm kỹ năng ${this.currentEnglishSkill === 'listening' ? 'Nghe' : this.currentEnglishSkill === 'speaking' ? 'Nói' : this.currentEnglishSkill === 'reading' ? 'Đọc' : 'Viết'}: <b>${finalScorePct}%</b> (${this.currentEnglishScore}/${total} câu đúng).<br/>XP nhận được: <b style="color:#f59e0b;">+${xpEarned} XP</b>.`,
                icon: finalScorePct >= 80 ? "success" : "info",
                confirmButtonText: "Quay về Bản đồ 🗺️"
            }).then(() => {
                this.renderEnglishMap();
            });
        } else {
            this.renderEnglishQuestion();
        }
    },

    // Ôn tập Từ vựng (Vocabulary Lab)
    renderEnglishPractice: function() {
        const placeholder = document.getElementById("english-vocab-lab-placeholder");
        if (!placeholder) return;
        placeholder.innerHTML = "";

        const currentClass = this.config.currentClass || "6";
        const lessons = COURSE_DATA.filter(chap => chap.subject === "english" && String(chap.class || "6") === String(currentClass)).flatMap(chap => chap.lessons);

        if (lessons.length === 0) {
            placeholder.innerHTML = `<p style="color:#64748b; text-align:center;">Chưa có từ vựng nào được nạp cho lớp ${currentClass}.</p>`;
            return;
        }

        const sessions = this.state.examSessions || [];
        const scores = this.calculateEnglishSkillScores();
        
        let recommendedHtml = "";
        if (sessions.length > 0) {
            // Tìm kỹ năng yếu nhất
            let weakestSkill = null;
            let lowestScore = 101;
            
            const skillKeys = ["listening", "speaking", "reading", "writing", "vocabulary", "grammar"];
            skillKeys.forEach(k => {
                if (scores[k] < lowestScore) {
                    lowestScore = scores[k];
                    weakestSkill = k;
                }
            });
            
            if (weakestSkill && lowestScore < 85) {
                const skillLabelMap = {
                    listening: "Kỹ năng Nghe (Listening)",
                    speaking: "Kỹ năng Nói (Speaking)",
                    reading: "Kỹ năng Đọc (Reading)",
                    writing: "Kỹ năng Viết (Writing)",
                    vocabulary: "Từ vựng (Vocabulary)",
                    grammar: "Ngữ pháp (Grammar)"
                };
                
                // Ánh xạ sang kỹ năng luyện tập thực tế trên bản đồ
                let practiceSkill = "listening";
                if (weakestSkill === "speaking") practiceSkill = "speaking";
                else if (weakestSkill === "reading" || weakestSkill === "vocabulary") practiceSkill = "reading";
                else if (weakestSkill === "writing" || weakestSkill === "grammar") practiceSkill = "writing";
                
                // Tìm 2 bài học có điểm thấp nhất ở kỹ năng này
                const lessonRecs = lessons.map(l => {
                    const key = `${l.id}-${practiceSkill}`;
                    const score = typeof this.state.scores[key] !== 'undefined' ? this.state.scores[key] : -1;
                    return { lesson: l, score: score };
                })
                .filter(item => item.score < 80)
                .sort((a, b) => a.score - b.score)
                .slice(0, 2);
                
                if (lessonRecs.length > 0) {
                    recommendedHtml = `
                        <div style="background:rgba(239,68,68,0.04); border:1px dashed #f87171; border-radius:16px; padding:1.2rem; margin-bottom:1.5rem;">
                            <div style="font-weight:900; color:#ef4444; font-size:1.05rem; display:flex; align-items:center; gap:0.5rem; margin-bottom:0.6rem;">
                                <i class="fa-solid fa-triangle-exclamation"></i> Kế hoạch tăng cường ôn tập (Focus Target Practice)
                            </div>
                            <p style="color:var(--text-main); font-size:0.92rem; margin:0 0 1rem 0; line-height:1.5;">
                                AI phân tích phát hiện con đang gặp khó khăn ở phần <b>${skillLabelMap[weakestSkill]}</b> (độ chính xác trung bình: <span style="color:#ef4444; font-weight:800;">${lowestScore}%</span>). 
                                Hãy tập trung ôn tập 2 bài học sau để nâng cao năng lực nhé:
                            </p>
                            <div style="display:flex; flex-direction:column; gap:0.8rem;">
                                ${lessonRecs.map(rec => {
                                    const currentScoreStr = rec.score === -1 ? "Chưa làm" : `${rec.score}%`;
                                    return `
                                        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-card); border:1px solid var(--border-color); padding:0.8rem 1rem; border-radius:12px; flex-wrap:wrap; gap:0.8rem; width: 100%;">
                                            <div style="flex:1; min-width:200px; text-align:left;">
                                                <div style="font-weight:800; color:var(--text-main); font-size:0.95rem;">${rec.lesson.title}</div>
                                                <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">Điểm hiện tại: <span style="color:#f59e0b; font-weight:700;">${currentScoreStr}</span></div>
                                            </div>
                                            <button class="btn-primary" onclick="app.selectEnglishSkill('${practiceSkill}'); app.startEnglishLesson('${rec.lesson.id}')" style="background:#2563eb; border-color:#2563eb; padding:5px 14px; font-size:0.85rem; border-radius:8px; cursor:pointer;">
                                                Luyện tập ngay 🚀
                                            </button>
                                        </div>
                                    `;
                                }).join("")}
                            </div>
                        </div>
                    `;
                }
            } else {
                recommendedHtml = `
                    <div style="background:rgba(16,185,129,0.04); border:1px dashed #34d399; border-radius:16px; padding:1.2rem; margin-bottom:1.5rem; text-align:center;">
                        <div style="font-weight:900; color:#10b981; font-size:1.1rem; margin-bottom:0.4rem;">
                            🎉 Tuyệt vời, Chiến binh xuất sắc!
                        </div>
                        <p style="color:var(--text-main); font-size:0.92rem; margin:0; line-height:1.5;">
                            Tất cả các kỹ năng Anh ngữ của con đều đang đạt trạng thái rất tốt (từ 85% trở lên). Hãy tiếp tục duy trì phong độ này nhé!
                        </p>
                    </div>
                `;
            }
        } else {
            recommendedHtml = `
                <div style="background:rgba(59,130,246,0.04); border:1px dashed #60a5fa; border-radius:16px; padding:1.2rem; margin-bottom:1.5rem; text-align:center;">
                    <div style="font-weight:900; color:#2563eb; font-size:1.05rem; margin-bottom:0.4rem;">
                        📊 Chưa có dữ liệu phân tích năng lực
                    </div>
                    <p style="color:var(--text-main); font-size:0.92rem; margin:0; line-height:1.5;">
                        Con hãy hoàn thành các bài học trên Bản đồ hoặc thi đấu IOE để AI phân tích điểm mạnh, điểm yếu và đưa ra kế hoạch ôn tập phù hợp nhé!
                    </p>
                </div>
            `;
        }

        const skillLabelMap = {
            listening: { label: "Nghe (Listening)", icon: "🎧", color: "#2563eb", bg: "#eff6ff" },
            speaking: { label: "Nói (Speaking)", icon: "🗣️", color: "#10b981", bg: "#ecfdf5" },
            reading: { label: "Đọc (Reading)", icon: "📖", color: "#ea580c", bg: "#fff7ed" },
            writing: { label: "Viết (Writing)", icon: "✍️", color: "#7c3aed", bg: "#f5f3ff" },
            vocabulary: { label: "Từ vựng (Vocabulary)", icon: "🧸", color: "#06b6d4", bg: "#ecfeff" },
            grammar: { label: "Ngữ pháp (Grammar)", icon: "🧱", color: "#ec4899", bg: "#fdf2f8" }
        };

        const gridHtml = `
            <div style="margin-bottom:2rem;">
                <h4 style="margin:0 0 1rem 0; font-weight:800; font-size:1.1rem; color:var(--text-main); text-align:left;"><i class="fa-solid fa-chart-line"></i> Đánh giá 6 kỹ năng Anh ngữ:</h4>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:1rem; width:100%;">
                    ${Object.keys(skillLabelMap).map(k => {
                        const score = scores[k] || 0;
                        const meta = skillLabelMap[k];
                        let statusText = "Chưa làm";
                        let statusColor = "#64748b";
                        
                        const hasData = sessions.some(sess => {
                            if (sess.answers && Array.isArray(sess.answers)) {
                                return sess.answers.some(ans => {
                                    let cat = ans.category || (sess.skill === 'listening' ? 'listening' : sess.skill === 'speaking' ? 'speaking' : sess.skill === 'reading' ? 'reading' : 'writing');
                                    if (cat === 'spelling') cat = 'vocabulary';
                                    return cat === k;
                                });
                            }
                            return false;
                        });
                        
                        if (hasData) {
                            if (score >= 90) { statusText = "Xuất sắc 👑"; statusColor = "#10b981"; }
                            else if (score >= 80) { statusText = "Khá tốt 🌟"; statusColor = "#3b82f6"; }
                            else { statusText = "Cần cải thiện ⚡"; statusColor = "#ef4444"; }
                        }
                        
                        const displayScore = hasData ? `${score}%` : "N/A";
                        
                        return `
                            <div style="background:var(--bg-card); border:1px solid var(--border-color); padding:1rem; border-radius:16px; display:flex; flex-direction:column; gap:0.5rem; box-shadow:0 4px 6px rgba(0,0,0,0.01);">
                                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:nowrap;">
                                    <div style="display:flex; align-items:center; gap:0.5rem; text-align:left;">
                                        <span style="font-size:1.3rem; background:${meta.bg}; padding:5px 8px; border-radius:10px; color:${meta.color};">${meta.icon}</span>
                                        <span style="font-weight:800; color:var(--text-main); font-size:0.92rem;">${meta.label}</span>
                                    </div>
                                    <span style="font-weight:900; color:${meta.color}; font-size:1.05rem;">${displayScore}</span>
                                </div>
                                <div style="width:100%; background:var(--bg-app); height:8px; border-radius:4px; overflow:hidden; border:1px solid var(--border-color); margin-top:2px;">
                                    <div style="width:${hasData ? score : 0}%; background:${meta.color}; height:100%; border-radius:4px; transition:width 0.3s ease;"></div>
                                </div>
                                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; font-weight:700; margin-top:2px;">
                                    <span style="color:var(--text-muted);">Trạng thái:</span>
                                    <span style="color:${statusColor};">${statusText}</span>
                                </div>
                            </div>
                        `;
                    }).join("")}
                </div>
            </div>
        `;

        let selectHtml = `
            <div id="eng-practice-dashboard-section" style="margin-bottom:2.5rem; border-bottom: 2px dashed var(--border-color); padding-bottom:1.8rem; width:100%;">
                ${recommendedHtml}
                ${gridHtml}
            </div>

            <div id="eng-practice-vocab-section" style="width:100%;">
                <h4 style="margin:0 0 1rem 0; font-weight:800; font-size:1.1rem; color:var(--text-main); text-align:left;"><i class="fa-solid fa-fire"></i> Đấu Trường Từ Vựng (Vocabulary Arena)</h4>
                <div style="margin-bottom:1.5rem; display:flex; align-items:center; gap:0.8rem; flex-wrap:wrap; justify-content:flex-start;">
                    <label style="font-weight:800; color:var(--text-main);">Chọn chủ đề ôn tập:</label>
                    <select class="form-input" id="eng-practice-lesson-select" onchange="app.loadPracticeLessonVocab(this.value)" style="max-width:280px; padding:0.4rem; border-radius:8px; background:var(--bg-card); color:var(--text-main); border:1px solid var(--border-color);">
                        ${lessons.map(l => `<option value="${l.id}">${l.title}</option>`).join("")}
                    </select>
                </div>
                <div id="eng-practice-vocab-grid"></div>
            </div>
        `;
        placeholder.innerHTML = selectHtml;
        this.loadPracticeLessonVocab(lessons[0].id);
    },

    loadPracticeLessonVocab: function(lessonId) {
        const grid = document.getElementById("eng-practice-vocab-grid");
        if (!grid) return;
        
        const lesson = getLessonById(lessonId);
        if (!lesson || !lesson.vocabulary) {
            grid.innerHTML = `<p style="color:#64748b; text-align:center;">Chưa có từ vựng cho bài học này.</p>`;
            return;
        }

        grid.innerHTML = `
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:1.2rem; width:100%;">
                ${lesson.vocabulary.map(v => `
                    <div class="vocab-interactive-card" onclick="app.playEnglishVoice('${v.word.replace(/'/g, "\\'")}', '${v.word.replace(/'/g, "\\'")}')" style="background:var(--bg-card); border: 2px solid var(--border-color); border-radius: 16px; padding:1.2rem; text-align:center; cursor:pointer; box-shadow:0 4px 6px rgba(0,0,0,0.02); transition:transform 0.2s;">
                        <div style="font-weight:800; font-size:1.2rem; color:var(--text-main);">${v.word}</div>
                        <div style="color:#64748b; font-size:0.85rem; margin:4px 0;">${v.ipa || ''}</div>
                        <div style="color:#10b981; font-weight:800; font-size:0.95rem;">${v.meaning}</div>
                        <div style="font-size:0.75rem; color:#94a3b8; font-style:italic; margin-top:8px; border-top:1px solid var(--border-color); padding-top:6px;">"${v.sentence}"</div>
                    </div>
                `).join("")}
            </div>
        `;
    },

    // Bảng xếp hạng trực tuyến liên thông Toán & Tiếng Anh
    currentLeaderboardSubject: 'math',

    openLeaderboardModal: function(defaultSubject = 'math') {
        const modal = document.getElementById("leaderboard-modal");
        if (!modal) return;

        modal.classList.remove("hidden");
        this.switchLeaderboardSubject(defaultSubject);
    },

    switchLeaderboardSubject: function(subject) {
        this.currentLeaderboardSubject = subject;
        
        const tabMath = document.getElementById("leaderboard-tab-math");
        const tabEng = document.getElementById("leaderboard-tab-english");
        
        if (subject === 'math') {
            if (tabMath) {
                tabMath.style.background = "linear-gradient(135deg, #10b981, #059669)";
                tabMath.style.color = "white";
                tabMath.style.boxShadow = "0 4px 10px rgba(16, 185, 129, 0.2)";
            }
            if (tabEng) {
                tabEng.style.background = "none";
                tabEng.style.color = "#6b7280";
                tabEng.style.boxShadow = "none";
            }
        } else {
            if (tabEng) {
                tabEng.style.background = "linear-gradient(135deg, #c084fc, #a855f7)";
                tabEng.style.color = "white";
                tabEng.style.boxShadow = "0 4px 10px rgba(192, 132, 252, 0.2)";
            }
            if (tabMath) {
                tabMath.style.background = "none";
                tabMath.style.color = "#6b7280";
                tabMath.style.boxShadow = "none";
            }
        }

        this.reloadLeaderboardData();
    },

    reloadLeaderboardData: function() {
        const subject = this.currentLeaderboardSubject;
        const filterVal = document.getElementById("leaderboard-class-filter") ? document.getElementById("leaderboard-class-filter").value : "";
        
        this.loadLeaderboardData(subject, "global-leaderboard-tbody", filterVal);
    },

    loadLeaderboardData: function(subject, tbodyId, classFilter = "") {
        const loadingDiv = document.getElementById("leaderboard-loading");
        const tableWrapper = document.getElementById("leaderboard-table-wrapper");
        const emptyDiv = document.getElementById("leaderboard-empty");
        const tbody = document.getElementById(tbodyId);
        const syncTimeSpan = document.getElementById("leaderboard-sync-time");

        if (loadingDiv) loadingDiv.classList.remove("hidden");
        if (tableWrapper) tableWrapper.classList.add("hidden");
        if (emptyDiv) emptyDiv.classList.add("hidden");

        const selfId = this.config && this.config.defaultStudentId ? this.config.defaultStudentId : "default";
        
        let url = `/api/leaderboard?subject=${subject}`;
        if (classFilter) {
            url += `&classLevel=${classFilter}`;
        }

        fetch(this.getApiUrl(url))
            .then(res => res.json())
            .then(resData => {
                if (loadingDiv) loadingDiv.classList.add("hidden");
                
                if (!resData.success || !resData.data || resData.data.length === 0) {
                    if (emptyDiv) emptyDiv.classList.remove("hidden");
                    return;
                }

                if (syncTimeSpan) {
                    const now = new Date();
                    const timeStr = now.toTimeString().split(' ')[0];
                    syncTimeSpan.innerText = `Đồng bộ: ${timeStr} (${resData.source === 'cloud' ? 'Trực tuyến' : 'Ngoại tuyến'})`;
                }

                if (tbody) {
                    tbody.innerHTML = resData.data.map((row, i) => {
                        const isSelf = row.studentId === selfId;
                        const rankClass = isSelf ? 'class="self-rank-row"' : '';
                        
                        let medal = `${i + 1}`;
                        if (i === 0) medal = '<span style="font-size:1.4rem;">🥇</span>';
                        else if (i === 1) medal = '<span style="font-size:1.4rem;">🥈</span>';
                        else if (i === 2) medal = '<span style="font-size:1.4rem;">🥉</span>';
                        else medal = `<span style="font-weight:900; color:var(--text-muted); font-size:1.1rem; display:inline-block; width:28px; height:28px; line-height:28px; text-align:center; background:rgba(255,255,255,0.04); border-radius:50%;">${i + 1}</span>`;

                        const xpVal = subject === 'english' ? (row.englishXp || 0) : (row.mathXp || 0);
                        const streakVal = subject === 'english' ? (row.englishStreak || 0) : (row.mathStreak || 0);

                        // Lấy chữ cái viết tắt
                        let initials = "HS";
                        if (row.studentName) {
                            const parts = row.studentName.trim().split(/\s+/).filter(Boolean);
                            if (parts.length === 1) {
                                initials = parts[0].substring(0, 2).toUpperCase();
                            } else if (parts.length > 1) {
                                initials = (parts[parts.length - 2].substring(0, 1) + parts[parts.length - 1].substring(0, 1)).toUpperCase();
                            }
                        }

                        // Gradient ngẫu nhiên cố định theo tên
                        const gradients = [
                            "linear-gradient(135deg, #f43f5e, #be123c)", // Rose
                            "linear-gradient(135deg, #a855f7, #6b21a8)", // Purple
                            "linear-gradient(135deg, #0ea5e9, #0369a1)", // Sky
                            "linear-gradient(135deg, #10b981, #047857)", // Emerald
                            "linear-gradient(135deg, #f59e0b, #b45309)", // Amber
                            "linear-gradient(135deg, #ec4899, #be185d)"  // Pink
                        ];
                        const charSum = row.studentName ? row.studentName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) : i;
                        const grad = gradients[Math.abs(charSum) % gradients.length];

                        return `
                            <tr ${rankClass}>
                                <td style="padding:14px 10px; text-align:center;">${medal}</td>
                                <td style="padding:14px 10px; display:flex; align-items:center; gap:0.8rem; color:${isSelf ? 'var(--primary)' : 'inherit'}; font-weight:${isSelf ? '800' : '600'};">
                                    <div class="leaderboard-avatar-badge" style="background:${grad}; color: white; font-weight: 800; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">${initials}</div>
                                    <div style="display:flex; flex-direction:column; gap:2px;">
                                        <span style="font-size:0.95rem; color:${isSelf ? 'var(--primary)' : 'var(--text-main)'}; display:flex; align-items:center;">
                                            ${row.lastHeartbeat && (Date.now() - new Date(row.lastHeartbeat).getTime() < 40000) ? '<span class="leaderboard-status-dot-pulse" title="Đang hoạt động 🟢"></span>' : ''}
                                            ${row.studentName}
                                        </span>
                                        ${isSelf ? '<span style="font-size:0.7rem; background:var(--primary); color:white; padding:1px 6px; border-radius:6px; font-weight:800; width:fit-content;">Bạn 👤</span>' : ''}
                                    </div>
                                </td>
                                <td style="padding:14px 10px; text-align:center; color:var(--text-muted); font-weight:700;">Lớp ${row.classLevel || '6'}</td>
                                <td style="padding:14px 10px; text-align:center; color:#ef4444; font-weight:800; font-size:1.05rem;">${streakVal} 🔥</td>
                                <td style="padding:14px 10px; text-align:right; color:#f59e0b; font-weight:900; font-size:1.1rem; letter-spacing:0.5px;">${xpVal} XP</td>
                            </tr>
                        `;
                    }).join("");
                }

                if (tableWrapper) tableWrapper.classList.remove("hidden");
            })
            .catch(err => {
                console.error("Lỗi khi tải bảng xếp hạng:", err);
                if (loadingDiv) loadingDiv.classList.add("hidden");
                if (emptyDiv) emptyDiv.classList.remove("hidden");
            });
    },

    renderEnglishLeaderboard: function() {
        this.openLeaderboardModal('english');
        
        const container = document.getElementById("eng-leaderboard-container");
        if (container) {
            container.innerHTML = `
                <div style="text-align:center; padding:2rem 1rem;">
                    <div style="font-size:3.5rem; margin-bottom:1rem;">🏆</div>
                    <h4 style="color:var(--text-main); font-weight:800; font-size:1.1rem; margin-bottom:0.5rem;">Bảng Xếp Hạng Đang Được Hiển Thị Trong Đấu Trường</h4>
                    <p style="color:#64748b; font-size:0.88rem; max-width:320px; margin:0 auto 1.2rem;">Học sinh có thể theo dõi và so sánh thứ hạng điểm số XP môn Toán và Tiếng Anh cùng các chiến binh khác tại đây.</p>
                    <button class="btn-primary" onclick="app.openLeaderboardModal('english')" style="background:linear-gradient(135deg, #c084fc, #a855f7); border:none; padding:10px 20px; border-radius:12px; color:white; font-weight:800; cursor:pointer; box-shadow:0 4px 6px rgba(168,132,252,0.2);">Xem Bảng Xếp Hạng 📊</button>
                </div>
            `;
        }
    },

    // Cửa hàng Tiệm Mạ Vàng Thẻ Năng Lực
    renderEnglishShop: function() {
        const container = document.getElementById("eng-shop-container");
        if (!container) return;

        const currentXp = this.state.englishXp || 0;
        
        if (!this.state.goldSkills) this.state.goldSkills = [];
        if (!this.state.redeemedSkills) this.state.redeemedSkills = [];

        const currentClass = this.config.currentClass || "6";
        const filteredCards = SKILL_CARDS.filter(card => !card.classLevel || card.classLevel === currentClass);
        const shopCardsHtml = filteredCards.map(card => {
            const isUnlocked = this.isSkillCardUnlocked(card.id);
            const isGold = this.state.goldSkills.includes(card.id);
            const isRedeemed = this.state.redeemedSkills.includes(card.id);
            
            let statusText = "";
            let btnHtml = "";
            
            if (isGold && isRedeemed) {
                statusText = `<span style="color:#ef4444; font-weight:800; font-size:0.85rem;"><i class="fa-solid fa-check-double"></i> ĐÃ QUY ĐỔI GIỜ CHƠI</span>`;
                btnHtml = `<button class="btn-primary" disabled style="background:rgba(239,68,68,0.15); color:#ef4444; border:1px solid rgba(239,68,68,0.4); padding:8px 20px; border-radius:10px; font-weight:900; width:100%; cursor:not-allowed; opacity:1;">Đã Quy Đổi</button>`;
            } else if (isGold) {
                statusText = `<span style="color:#eab308; font-weight:800; font-size:0.85rem;"><i class="fa-solid fa-star"></i> ĐÃ MẠ VÀNG LẤP LÁNH</span>`;
                btnHtml = `<button class="btn-primary" disabled style="background:rgba(251,191,36,0.15); color:#fbbf24; border:1px solid rgba(251,191,36,0.4); padding:8px 20px; border-radius:10px; font-weight:900; width:100%; cursor:not-allowed; opacity:1;">Tối Đa Cấp Độ</button>`;
            } else if (isUnlocked) {
                statusText = `<span style="color:#10b981; font-weight:800; font-size:0.85rem;"><i class="fa-solid fa-lock-open"></i> Đã mở khóa thẻ gốc</span>`;
                btnHtml = `<button class="btn-primary" onclick="app.upgradeGoldSkill('${card.id}')" style="background:linear-gradient(135deg, #eab308, #d97706); border:none; padding:8px 20px; border-radius:10px; color:white; font-weight:800; cursor:pointer; width:100%; box-shadow:0 4px 6px rgba(234,179,8,0.2);">Mạ vàng (350 XP)</button>`;
            } else {
                statusText = `<span style="color:#ef4444; font-weight:800; font-size:0.85rem;"><i class="fa-solid fa-lock"></i> Chưa mở khóa thẻ</span>`;
                btnHtml = `<button class="btn-primary" disabled style="background:#cbd5e1; color:#94a3b8; border:none; padding:8px 20px; border-radius:10px; font-weight:800; width:100%; cursor:not-allowed;">Cần mở khóa trước</button>`;
            }

            return `
                <div class="eng-shop-card ${isGold ? 'gold-card-royal gold-card-royal-shine' : ''}" style="position: relative; overflow: hidden; background:var(--bg-card); border: 2px solid ${isGold ? 'transparent' : 'var(--border-color)'}; border-radius:20px; padding:1.5rem; text-align:center; display:flex; flex-direction:column; justify-content:space-between; align-items:center; min-height:240px; height:100%; ${isRedeemed ? 'opacity: 0.85;' : ''}">
                    ${isGold && isRedeemed ? `
                    <div style="position: absolute; top: 15px; right: 15px; border: 3px double #ef4444; color: #ef4444; background: rgba(254,226,226,0.9); font-size: 0.7rem; font-weight: 900; padding: 4px 8px; border-radius: 6px; transform: rotate(15deg); z-index: 10; letter-spacing: 1px; box-shadow: 0 0 6px rgba(239,68,68,0.2);">
                        ĐÃ QUY ĐỔI
                    </div>
                    ` : ''}
                    <div>
                        <div style="font-size:2.8rem; margin-bottom:0.4rem; filter: ${isUnlocked ? 'none' : 'grayscale(1) opacity(0.5)'};">${card.icon}</div>
                        <div style="font-weight:900; font-size:1.1rem; color:var(--text-main); margin-bottom:4px; text-transform:uppercase; letter-spacing:0.5px;" class="${isGold ? 'gold-title-glow' : ''}">${card.name}</div>
                        <div style="font-size:0.8rem; color:${isGold ? (isRedeemed ? '#fca5a5' : '#a7f3d0') : '#64748b'}; margin-bottom:0.5rem; min-height:36px; display:flex; align-items:center; justify-content:center; line-height:1.3;">${card.desc}</div>
                    </div>
                    <div style="width:100%;">
                        <div style="margin-bottom:0.6rem;">${statusText}</div>
                        ${btnHtml}
                    </div>
                </div>
            `;
        }).join("");

        container.innerHTML = `
            <div style="background:linear-gradient(135deg, rgba(234,179,8,0.1), rgba(139,92,246,0.1)); border: 1px solid rgba(234,179,8,0.2); padding:1.2rem; border-radius:16px; margin-bottom:1.5rem; text-align:center;">
                <h4 style="margin:0; font-size:1.25rem; font-weight:900; color:#d97706; display:flex; align-items:center; justify-content:center; gap:0.5rem;"><i class="fa-solid fa-crown" style="color:#eab308;"></i> Tiệm Mạ Vàng Thẻ Năng Lực</h4>
                <p style="margin:6px 0 0 0; font-size:0.88rem; color:#475569; font-weight:600;">Sử dụng điểm tích lũy <b>XP</b> để mạ vàng các thẻ năng lực đã đạt được. Thẻ mạ vàng sẽ có viền vàng lướt sáng lấp lánh cực đẹp!</p>
                <div style="font-size:1.1rem; font-weight:800; color:#ea580c; margin-top:8px;">Số dư hiện có: <span style="background:#ffedd5; padding:2px 12px; border-radius:12px;">⭐ ${currentXp} XP</span></div>
            </div>
            <div class="eng-shop-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1.5rem; padding:0.5rem 0;">
                ${shopCardsHtml}
            </div>
        `;
    },

    upgradeGoldSkill: function(cardId) {
        const currentXp = this.state.englishXp || 0;
        const cost = 350;
        if (currentXp < cost) {
            Swal.fire("Không đủ XP ❌", `Con cần tích lũy thêm ${cost - currentXp} XP để mạ vàng thẻ này!`, "error");
            return;
        }

        if (!this.state.goldSkills) this.state.goldSkills = [];
        if (this.state.goldSkills.includes(cardId)) return;

        this.state.englishXp = currentXp - cost;
        this.state.goldSkills.push(cardId);
        this.saveEnglishState();

        const card = SKILL_CARDS.find(c => c.id === cardId);
        
        // Kích hoạt pháo hoa giấy chúc mừng
        if (this.confetti && typeof this.confetti.start === 'function') {
            this.confetti.start();
        }

        Swal.fire({
            title: "Mạ Vàng Thành Công! ✨🏆✨",
            html: `Chúc mừng con đã nâng cấp thành công thẻ <b>"${card.name}"</b> sang phiên bản Mạ vàng hoàng gia!<br/>Số dư XP còn lại: <b>${this.state.englishXp} XP</b>`,
            icon: "success",
            confirmButtonColor: "#eab308",
            backdrop: `
                rgba(234,179,8,0.18)
            `
        });

        this.renderEnglishShop();
        this.updateEnglishHeaderStats();
    },

    // Giữ hàm để tương thích ngược
    toggleInfiniteHearts: function(enabled) {
        this.state.infiniteHearts = enabled;
        this.saveEnglishState();
    },

    isStudentStudying: function() {
        const engLesson = document.getElementById('english-focus-lesson-screen');
        const lessonDetail = document.getElementById('lesson-detail-panel');
        const practiceTab = document.getElementById('tab-practice');
        
        const isEngStudying = engLesson && !engLesson.classList.contains('hidden');
        const isMathStudying = lessonDetail && !lessonDetail.classList.contains('hidden') && practiceTab && !practiceTab.classList.contains('hidden');
        
        return isEngStudying || isMathStudying;
    },

    openFreePlayGameSelection: function() {
        if (this.isStudentStudying()) {
            Swal.fire({
                icon: 'warning',
                title: 'Học tập là ưu tiên! 📚',
                text: 'Con đang trong chế độ học tập tích cực. Hãy hoàn thành bài học hiện tại trước khi tham gia chơi game giải trí tự do nhé!',
                confirmButtonText: 'Đã hiểu và tiếp tục học',
                confirmButtonColor: '#7c3aed'
            });
            return;
        }

        Swal.fire({
            title: 'Chọn chế độ chơi game 🎮',
            text: 'Vui lòng chọn vai trò của con:',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Học sinh 🎒',
            cancelButtonText: 'Phụ huynh 🔑',
            confirmButtonColor: '#06b6d4',
            cancelButtonColor: '#7c3aed',
            allowOutsideClick: true
        }).then((result) => {
            if (result.isConfirmed) {
                // Chế độ Học sinh
                this.openStudentGameExchange();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Chế độ Phụ huynh
                this.openParentGameVerification();
            }
        });
    },

    openStudentGameExchange: function() {
        const studentId = this.config.defaultStudentId || '';
        if (studentId === 'std_baongoc') {
            Swal.fire({
                icon: 'error',
                title: 'Quy đổi thẻ tạm khóa! 🔒',
                html: 'Phụ huynh đã tạm khóa tính năng quy đổi thẻ lấy giờ chơi game đối với tài khoản của con.<br/>Con hãy tập trung học tập thật tốt nhé!',
                confirmButtonText: 'Đã hiểu và tiếp tục học',
                confirmButtonColor: '#7c3aed'
            });
            return;
        }
        if (!this.state.redeemedSkills) this.state.redeemedSkills = [];
        const unredeemedGoldSkills = (this.state.goldSkills || []).filter(id => !this.state.redeemedSkills.includes(id));
        
        const hasEnglishGold = unredeemedGoldSkills.length > 0;
        const hasMathGold = this.state.goldBadges && this.state.goldBadges.length > 0;

        if (!hasEnglishGold && !hasMathGold) {
            Swal.fire({
                icon: 'warning',
                title: 'Chưa có thẻ mạ vàng chưa quy đổi! 🌟',
                html: `Con cần có ít nhất 1 thẻ năng lực Tiếng Anh hoặc 1 huy hiệu Toán học <b>Mạ Vàng (chưa dùng)</b> để đổi lấy 15 phút chơi game.<br/><br/>Hãy tích lũy điểm <b>XP</b> và vào mục <b>Cửa Hàng (Shop)</b> của môn học để mạ vàng các thẻ/huy hiệu đã đạt được nhé!`,
                confirmButtonText: 'Đã hiểu',
                confirmButtonColor: '#eab308'
            });
            return;
        }

        Swal.fire({
            title: 'Chọn thiết bị chơi game 🎮',
            html: `
                <p style="font-size:0.95rem; margin-bottom:1.5rem; font-weight:600; color:#475569;">Con muốn đổi thẻ mạ vàng lấy giờ chơi trên thiết bị nào?</p>
                <div style="margin-top: 15px; font-size: 0.88rem; display: flex; flex-direction: column; gap: 10px; align-items: center;">
                    <a href="#" onclick="Swal.close(); app.showTabletTokensList(); return false;" style="color: #0ea5e9; font-weight: 800; text-decoration: none; border-bottom: 2px dashed #0ea5e9; padding-bottom: 2px;">
                        📋 Xem lịch sử các mã bảo mật đã đổi
                    </a>
                    <a href="#" onclick="Swal.close(); app.showCardExchangeHistory(); return false;" style="color: #a855f7; font-weight: 800; text-decoration: none; border-bottom: 2px dashed #a855f7; padding-bottom: 2px;">
                        📜 Xem lịch sử quy đổi thẻ năng lực
                    </a>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Máy tính này 💻',
            cancelButtonText: 'Máy tính bảng 📱',
            confirmButtonColor: '#0ea5e9',
            cancelButtonColor: '#10b981',
            allowOutsideClick: true
        }).then((result) => {
            let device = 'pc';
            if (result.isConfirmed) {
                device = 'pc';
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                device = 'tablet';
            } else {
                return;
            }

            if (hasEnglishGold && !hasMathGold) {
                if (device === 'pc') this.exchangeGoldCardForPcPlay();
                else this.exchangeGoldCardForTabletPlay();
            } else if (!hasEnglishGold && hasMathGold) {
                if (device === 'pc') this.exchangeGoldBadgeForPcPlay();
                else this.exchangeGoldBadgeForTabletPlay();
            } else {
                Swal.fire({
                    title: 'Chọn môn học quy đổi 🏫',
                    text: 'Con muốn sử dụng thẻ/huy hiệu mạ vàng của môn học nào?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Toán học 🇻🇳',
                    cancelButtonText: 'Tiếng Anh 🇬🇧',
                    confirmButtonColor: '#10b981',
                    cancelButtonColor: '#7c3aed',
                    allowOutsideClick: false
                }).then((subjResult) => {
                    if (subjResult.isConfirmed) {
                        if (device === 'pc') this.exchangeGoldBadgeForPcPlay();
                        else this.exchangeGoldBadgeForTabletPlay();
                    } else if (subjResult.dismiss === Swal.DismissReason.cancel) {
                        if (device === 'pc') this.exchangeGoldCardForPcPlay();
                        else this.exchangeGoldCardForTabletPlay();
                    }
                });
            }
        });
    },

    exchangeGoldCardForPcPlay: function() {
        app.selectedExchangeCardIds = [];
        let optionsHtml = '<div style="max-height: 300px; overflow-y: auto; padding: 5px;">';
        
        if (!this.state.redeemedSkills) this.state.redeemedSkills = [];
        const unredeemedGoldSkills = (this.state.goldSkills || []).filter(id => !this.state.redeemedSkills.includes(id));

        unredeemedGoldSkills.forEach(cardId => {
            const card = SKILL_CARDS.find(c => c.id === cardId);
            if (card) {
                optionsHtml += `
                    <div class="gold-card-option royal-exchange gold-card-royal gold-card-royal-shine" onclick="app.selectGoldCardToExchange('${card.id}')" id="opt-${card.id}" style="display:flex; align-items:center; gap:12px; padding:12px; margin-bottom:8px; cursor:pointer;">
                        <span style="font-size:2rem; filter: drop-shadow(0 0 4px gold);">${card.icon}</span>
                        <div style="text-align:left; flex:1;">
                            <div style="font-weight:900;" class="gold-title-glow">${card.name} (Mạ Vàng)</div>
                            <div style="font-size:0.8rem; color:#a7f3d0; font-weight:600;">${card.desc}</div>
                        </div>
                        <div class="checkbox-indicator" style="width:20px; height:20px; border-radius:50%; border:2px solid rgba(255,215,0,0.4); display:flex; align-items:center; justify-content:center; z-index: 10;"></div>
                    </div>
                `;
            }
        });
        optionsHtml += '</div>';

        Swal.fire({
            title: 'Đổi thẻ chơi trên PC 💻🔄',
            html: `
                <p style="font-size:0.95rem; margin-bottom:1rem; font-weight:600; color: #e2e8f0;">Chọn một hoặc nhiều thẻ mạ vàng của con để đổi lấy giờ chơi (mỗi thẻ đổi được 15 phút):</p>
                ${optionsHtml}
            `,
            showCancelButton: true,
            confirmButtonText: 'Xác nhận đổi',
            cancelButtonText: 'Quay lại',
            confirmButtonColor: '#0ea5e9',
            cancelButtonColor: '#475569',
            allowOutsideClick: false,
            didOpen: () => {
                const confirmBtn = Swal.getConfirmButton();
                if (confirmBtn) confirmBtn.setAttribute('disabled', 'true');
            }
        }).then((result) => {
            if (result.isConfirmed && app.selectedExchangeCardIds && app.selectedExchangeCardIds.length > 0) {
                const count = app.selectedExchangeCardIds.length;
                const minutes = count * 15;
                
                if (!this.state.redeemedSkills) this.state.redeemedSkills = [];
                if (!this.state.cardExchangeHistory) this.state.cardExchangeHistory = [];

                app.selectedExchangeCardIds.forEach(cardId => {
                    if (!this.state.redeemedSkills.includes(cardId)) {
                        this.state.redeemedSkills.push(cardId);
                    }
                    const card = SKILL_CARDS.find(c => c.id === cardId);
                    const cardName = card ? card.name : "Thẻ năng lực";
                    this.state.cardExchangeHistory.push({
                        cardId: cardId,
                        cardName: cardName,
                        device: "Máy tính này (PC)",
                        redeemedAt: new Date().toISOString()
                    });
                });

                this.saveEnglishState();

                Swal.fire({
                    title: 'Đổi thẻ thành công! 🎉',
                    html: `Đã đổi thành công <b>${count} thẻ năng lực</b> lấy <b>${minutes} phút</b> chơi game giải trí tự do. Chúc con chơi game thật vui vẻ!`,
                    icon: 'success',
                    confirmButtonText: 'Vào chơi ngay 🚀',
                    confirmButtonColor: '#10b981'
                }).then(() => {
                    this.startFreePlayGame(minutes * 60);
                });
            } else {
                this.openStudentGameExchange();
            }
        });
    },

    exchangeGoldCardForTabletPlay: function() {
        app.selectedExchangeCardIds = [];
        let optionsHtml = '<div style="max-height: 300px; overflow-y: auto; padding: 5px;">';
        
        if (!this.state.redeemedSkills) this.state.redeemedSkills = [];
        const unredeemedGoldSkills = (this.state.goldSkills || []).filter(id => !this.state.redeemedSkills.includes(id));

        unredeemedGoldSkills.forEach(cardId => {
            const card = SKILL_CARDS.find(c => c.id === cardId);
            if (card) {
                optionsHtml += `
                    <div class="gold-card-option royal-exchange gold-card-royal gold-card-royal-shine" onclick="app.selectGoldCardToExchange('${card.id}')" id="opt-${card.id}" style="display:flex; align-items:center; gap:12px; padding:12px; margin-bottom:8px; cursor:pointer;">
                        <span style="font-size:2rem; filter: drop-shadow(0 0 4px gold);">${card.icon}</span>
                        <div style="text-align:left; flex:1;">
                            <div style="font-weight:900;" class="gold-title-glow">${card.name} (Mạ Vàng)</div>
                            <div style="font-size:0.8rem; color:#a7f3d0; font-weight:600;">${card.desc}</div>
                        </div>
                        <div class="checkbox-indicator" style="width:20px; height:20px; border-radius:50%; border:2px solid rgba(255,215,0,0.4); display:flex; align-items:center; justify-content:center; z-index: 10;"></div>
                    </div>
                `;
            }
        });
        optionsHtml += '</div>';

        Swal.fire({
            title: 'Đổi thẻ chơi trên Tablet 📱🔄',
            html: `
                <p style="font-size:0.95rem; margin-bottom:1rem; font-weight:600; color: #e2e8f0;">Chọn một hoặc nhiều thẻ mạ vàng để đổi lấy mã số bảo mật sử dụng Tablet (mỗi thẻ được 15 phút):</p>
                ${optionsHtml}
            `,
            showCancelButton: true,
            confirmButtonText: 'Xác nhận đổi',
            cancelButtonText: 'Quay lại',
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#475569',
            allowOutsideClick: false,
            didOpen: () => {
                const confirmBtn = Swal.getConfirmButton();
                if (confirmBtn) confirmBtn.setAttribute('disabled', 'true');
            }
        }).then(async (result) => {
            if (result.isConfirmed && app.selectedExchangeCardIds && app.selectedExchangeCardIds.length > 0) {
                const count = app.selectedExchangeCardIds.length;
                const minutes = count * 15;
                const studentId = this.config.defaultStudentId || '';
                
                Swal.fire({
                    title: 'Đang xử lý quy đổi...',
                    html: 'Vui lòng chờ trong giây lát...',
                    allowOutsideClick: false,
                    didOpen: () => { Swal.showLoading(); }
                });

                try {
                    const response = await fetch(this.getApiUrl('/api/tablet/generate-token'), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ studentId, minutes: minutes })
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        
                        if (!this.state.redeemedSkills) this.state.redeemedSkills = [];
                        if (!this.state.cardExchangeHistory) this.state.cardExchangeHistory = [];

                        app.selectedExchangeCardIds.forEach(cardId => {
                            if (!this.state.redeemedSkills.includes(cardId)) {
                                this.state.redeemedSkills.push(cardId);
                            }
                            const card = SKILL_CARDS.find(c => c.id === cardId);
                            const cardName = card ? card.name : "Thẻ năng lực";
                            this.state.cardExchangeHistory.push({
                                cardId: cardId,
                                cardName: cardName,
                                device: "Máy tính bảng (Tablet)",
                                redeemedAt: new Date().toISOString()
                            });
                        });

                        this.saveEnglishState();

                        Swal.fire({
                            title: 'Mã số bảo mật Tablet 🏆✨',
                            html: `
                                <div style="margin: 1rem 0; padding: 1.5rem; background: #f0fdf4; border-radius: 12px; border: 2px dashed #10b981;">
                                    <div style="font-size: 2.5rem; font-weight: 900; letter-spacing: 5px; color: #047857;">${data.token}</div>
                                    <div style="font-size: 0.9rem; color: #065f46; font-weight: 700; margin-top: 8px;">Hiệu lực: ${data.minutes} phút sử dụng Tablet</div>
                                </div>
                                <p style="font-size: 0.9rem; color: #475569; font-weight: 600;">Con hãy nhập mã này trên ứng dụng máy tính bảng để mở khóa nhé. Hết giờ máy sẽ tự động khóa lại!</p>
                            `,
                            icon: 'success',
                            confirmButtonText: 'Đã ghi lại mã số',
                            confirmButtonColor: '#10b981'
                        });
                    } else {
                        const errData = await response.json();
                        throw new Error(errData.error || 'Lỗi hệ thống');
                    }
                } catch (err) {
                    console.error("Lỗi quy đổi thẻ lấy mã tablet:", err);
                    Swal.fire("Lỗi quy đổi ❌", "Có lỗi xảy ra: " + err.message, "error");
                }
            } else {
                this.openStudentGameExchange();
            }
        });
    },

    exchangeGoldBadgeForPcPlay: function() {
        app.selectedExchangeCardIds = [];
        let optionsHtml = '<div style="max-height: 300px; overflow-y: auto; padding: 5px;">';
        this.state.goldBadges.forEach(badgeId => {
            const badge = this.systemBadges.find(b => b.id === badgeId);
            if (badge) {
                optionsHtml += `
                    <div class="gold-card-option royal-exchange gold-card-royal gold-card-royal-shine" onclick="app.selectGoldCardToExchange('${badge.id}')" id="opt-${badge.id}" style="display:flex; align-items:center; gap:12px; padding:12px; margin-bottom:8px; cursor:pointer;">
                        <span style="font-size:2rem; filter: drop-shadow(0 0 4px gold);">${badge.icon}</span>
                        <div style="text-align:left; flex:1;">
                            <div style="font-weight:900;" class="gold-title-glow">${badge.name} (Mạ Vàng)</div>
                            <div style="font-size:0.8rem; color:#a7f3d0; font-weight:600;">${badge.desc}</div>
                        </div>
                        <div class="checkbox-indicator" style="width:20px; height:20px; border-radius:50%; border:2px solid rgba(255,215,0,0.4); display:flex; align-items:center; justify-content:center; z-index: 10;"></div>
                    </div>
                `;
            }
        });
        optionsHtml += '</div>';

        Swal.fire({
            title: 'Đổi huy hiệu chơi trên PC 💻🔄',
            html: `
                <p style="font-size:0.95rem; margin-bottom:1rem; font-weight:600; color: #e2e8f0;">Chọn một hoặc nhiều huy hiệu mạ vàng của con để đổi lấy giờ chơi (mỗi huy hiệu đổi được 15 phút):</p>
                ${optionsHtml}
            `,
            showCancelButton: true,
            confirmButtonText: 'Xác nhận đổi',
            cancelButtonText: 'Quay lại',
            confirmButtonColor: '#0ea5e9',
            cancelButtonColor: '#475569',
            allowOutsideClick: false,
            didOpen: () => {
                const confirmBtn = Swal.getConfirmButton();
                if (confirmBtn) confirmBtn.setAttribute('disabled', 'true');
            }
        }).then((result) => {
            if (result.isConfirmed && app.selectedExchangeCardIds && app.selectedExchangeCardIds.length > 0) {
                const count = app.selectedExchangeCardIds.length;
                const minutes = count * 15;

                // Xóa các huy hiệu đã quy đổi khỏi goldBadges
                this.state.goldBadges = this.state.goldBadges.filter(id => !app.selectedExchangeCardIds.includes(id));
                this.saveProgress();

                Swal.fire({
                    title: 'Đổi huy hiệu thành công! 🎉',
                    html: `Đã đổi thành công <b>${count} huy hiệu</b> lấy <b>${minutes} phút</b> chơi game giải trí tự do. Chúc con chơi game thật vui vẻ!`,
                    icon: 'success',
                    confirmButtonText: 'Vào chơi ngay 🚀',
                    confirmButtonColor: '#10b981'
                }).then(() => {
                    this.startFreePlayGame(minutes * 60);
                });
            } else {
                this.openStudentGameExchange();
            }
        });
    },

    exchangeGoldBadgeForTabletPlay: function() {
        app.selectedExchangeCardIds = [];
        let optionsHtml = '<div style="max-height: 300px; overflow-y: auto; padding: 5px;">';
        this.state.goldBadges.forEach(badgeId => {
            const badge = this.systemBadges.find(b => b.id === badgeId);
            if (badge) {
                optionsHtml += `
                    <div class="gold-card-option royal-exchange gold-card-royal gold-card-royal-shine" onclick="app.selectGoldCardToExchange('${badge.id}')" id="opt-${badge.id}" style="display:flex; align-items:center; gap:12px; padding:12px; margin-bottom:8px; cursor:pointer;">
                        <span style="font-size:2rem; filter: drop-shadow(0 0 4px gold);">${badge.icon}</span>
                        <div style="text-align:left; flex:1;">
                            <div style="font-weight:900;" class="gold-title-glow">${badge.name} (Mạ Vàng)</div>
                            <div style="font-size:0.8rem; color:#a7f3d0; font-weight:600;">${badge.desc}</div>
                        </div>
                        <div class="checkbox-indicator" style="width:20px; height:20px; border-radius:50%; border:2px solid rgba(255,215,0,0.4); display:flex; align-items:center; justify-content:center; z-index: 10;"></div>
                    </div>
                `;
            }
        });
        optionsHtml += '</div>';

        Swal.fire({
            title: 'Đổi huy hiệu chơi trên Tablet 📱🔄',
            html: `
                <p style="font-size:0.95rem; margin-bottom:1rem; font-weight:600; color: #e2e8f0;">Chọn một hoặc nhiều huy hiệu mạ vàng để đổi lấy mã số bảo mật sử dụng Tablet (mỗi huy hiệu được 15 phút):</p>
                ${optionsHtml}
            `,
            showCancelButton: true,
            confirmButtonText: 'Xác nhận đổi',
            cancelButtonText: 'Quay lại',
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#475569',
            allowOutsideClick: false,
            didOpen: () => {
                const confirmBtn = Swal.getConfirmButton();
                if (confirmBtn) confirmBtn.setAttribute('disabled', 'true');
            }
        }).then(async (result) => {
            if (result.isConfirmed && app.selectedExchangeCardIds && app.selectedExchangeCardIds.length > 0) {
                const count = app.selectedExchangeCardIds.length;
                const minutes = count * 15;
                const studentId = this.config.defaultStudentId || '';
                
                Swal.fire({
                    title: 'Đang xử lý quy đổi...',
                    html: 'Vui lòng chờ trong giây lát...',
                    allowOutsideClick: false,
                    didOpen: () => { Swal.showLoading(); }
                });

                try {
                    const response = await fetch(this.getApiUrl('/api/tablet/generate-token'), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ studentId, minutes: minutes })
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        this.state.goldBadges = this.state.goldBadges.filter(id => !app.selectedExchangeCardIds.includes(id));
                        this.saveProgress();

                        Swal.fire({
                            title: 'Mã số bảo mật Tablet 🏆✨',
                            html: `
                                <div style="margin: 1rem 0; padding: 1.5rem; background: #f0fdf4; border-radius: 12px; border: 2px dashed #10b981;">
                                    <div style="font-size: 2.5rem; font-weight: 900; letter-spacing: 5px; color: #047857;">${data.token}</div>
                                    <div style="font-size: 0.9rem; color: #065f46; font-weight: 700; margin-top: 8px;">Hiệu lực: ${data.minutes} phút sử dụng Tablet</div>
                                </div>
                                <p style="font-size: 0.9rem; color: #475569; font-weight: 600;">Con hãy nhập mã này trên ứng dụng máy tính bảng để mở khóa nhé. Hết giờ máy sẽ tự động khóa lại!</p>
                            `,
                            icon: 'success',
                            confirmButtonText: 'Đã ghi lại mã số',
                            confirmButtonColor: '#10b981'
                        });
                    } else {
                        const errData = await response.json();
                        throw new Error(errData.error || 'Lỗi hệ thống');
                    }
                } catch (err) {
                    console.error("Lỗi quy đổi huy hiệu lấy mã tablet:", err);
                    Swal.fire("Lỗi quy đổi ❌", "Có lỗi xảy ra: " + err.message, "error");
                }
            } else {
                this.openStudentGameExchange();
            }
        });
    },

    showTabletTokensList: async function() {
        const studentId = this.config.defaultStudentId || '';
        
        Swal.fire({
            title: 'Đang tải danh sách...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            const res = await fetch(this.getApiUrl(`/api/tablet/tokens?studentId=${studentId}`));
            if (res.ok) {
                const tokens = await res.json();
                
                if (tokens.length === 0) {
                    Swal.fire({
                        title: 'Lịch sử mã bảo mật 📋',
                        text: 'Con chưa quy đổi mã bảo mật Tablet nào cả!',
                        icon: 'info',
                        confirmButtonText: 'Đã hiểu',
                        confirmButtonColor: '#0ea5e9'
                    }).then(() => {
                        this.openStudentGameExchange();
                    });
                    return;
                }

                let listHtml = '<div style="max-height: 350px; overflow-y: auto; text-align: left; padding: 5px;">';
                tokens.forEach(t => {
                    let statusBadge = '';
                    let borderCol = '#cbd5e1';
                    let bgCol = '#f8fafc';
                    if (t.status === 'unused') {
                        statusBadge = '<span style="background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:800;">Chưa dùng</span>';
                        borderCol = '#86efac';
                        bgCol = '#f0fdf4';
                    } else if (t.status === 'active') {
                        statusBadge = '<span style="background:#fef9c3; color:#a16207; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:800;">Đang dùng</span>';
                        borderCol = '#fde047';
                        bgCol = '#fefce8';
                    } else {
                        statusBadge = '<span style="background:#f1f5f9; color:#64748b; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:800;">Đã hết giờ</span>';
                    }

                    const dateStr = new Date(t.created_at).toLocaleString('vi-VN');

                    listHtml += `
                        <div style="border: 2px solid ${borderCol}; background: ${bgCol}; padding: 12px; border-radius: 10px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
                            <div>
                                <div style="font-size: 1.3rem; font-weight: 900; letter-spacing: 2px; color: #1e293b;">${t.token}</div>
                                <div style="font-size: 0.75rem; color: #64748b; font-weight: 600; margin-top: 4px;">Tạo: ${dateStr}</div>
                            </div>
                            <div style="text-align: right;">
                                <div style="font-size: 0.85rem; font-weight: 800; color: #334155; margin-bottom: 4px;">Thời lượng: ${t.minutes} phút</div>
                                <div>${statusBadge}</div>
                            </div>
                        </div>
                    `;
                });
                listHtml += '</div>';

                Swal.fire({
                    title: 'Lịch sử mã bảo mật 📋📱',
                    html: listHtml,
                    confirmButtonText: 'Quay lại',
                    confirmButtonColor: '#475569'
                }).then(() => {
                    this.openStudentGameExchange();
                });
            } else {
                throw new Error("Lỗi tải dữ liệu");
            }
        } catch (err) {
            console.error("Lỗi lấy danh sách token:", err);
            Swal.fire("Lỗi tải danh sách ❌", "Không thể lấy thông tin lịch sử: " + err.message, "error").then(() => {
                this.openStudentGameExchange();
            });
        }
    },

    showCardExchangeHistory: function() {
        if (!this.state.cardExchangeHistory) this.state.cardExchangeHistory = [];
        
        if (this.state.cardExchangeHistory.length === 0) {
            Swal.fire({
                title: 'Lịch sử quy đổi thẻ 📜',
                text: 'Con chưa quy đổi thẻ năng lực nào lấy giờ chơi cả!',
                icon: 'info',
                confirmButtonText: 'Đã hiểu',
                confirmButtonColor: '#7c3aed'
            }).then(() => {
                this.openStudentGameExchange();
            });
            return;
        }

        let listHtml = '<div style="max-height: 350px; overflow-y: auto; text-align: left; padding: 5px;">';
        const sortedHistory = [...this.state.cardExchangeHistory].sort((a, b) => new Date(b.redeemedAt) - new Date(a.redeemedAt));
        sortedHistory.forEach(h => {
            const card = SKILL_CARDS.find(c => c.id === h.cardId);
            const cardIcon = card ? card.icon : '🌟';
            const dateStr = new Date(h.redeemedAt).toLocaleString('vi-VN');
            
            listHtml += `
                <div style="border: 2px solid #e2e8f0; background: var(--bg-card); padding: 12px; border-radius: 10px; margin-bottom: 8px; display: flex; align-items: center; gap: 12px;">
                    <div style="font-size: 2rem; filter: drop-shadow(0 0 4px gold);">${cardIcon}</div>
                    <div style="flex: 1;">
                        <div style="font-size: 0.95rem; font-weight: 900; color: var(--text-main);">${h.cardName}</div>
                        <div style="font-size: 0.8rem; color: #64748b; font-weight: 600; margin-top: 2px;">Thiết bị: ${h.device}</div>
                        <div style="font-size: 0.75rem; color: #94a3b8; font-weight: 500; margin-top: 2px;">Thời gian: ${dateStr}</div>
                    </div>
                </div>
            `;
        });
        listHtml += '</div>';

        Swal.fire({
            title: 'Lịch sử dùng thẻ năng lực 📜🥇',
            html: listHtml,
            confirmButtonText: 'Quay lại',
            confirmButtonColor: '#7c3aed'
        }).then(() => {
            this.openStudentGameExchange();
        });
    },

    selectGoldCardToExchange: function(cardId) {
        if (!app.selectedExchangeCardIds) app.selectedExchangeCardIds = [];
        
        const index = app.selectedExchangeCardIds.indexOf(cardId);
        const el = document.getElementById(`opt-${cardId}`);
        
        if (index > -1) {
            // Đã chọn rồi -> Bỏ chọn
            app.selectedExchangeCardIds.splice(index, 1);
            if (el) {
                el.classList.remove('selected');
                const indicator = el.querySelector('.checkbox-indicator');
                if (indicator) {
                    indicator.style.borderColor = 'rgba(255,215,0,0.4)';
                    indicator.style.background = 'none';
                    indicator.innerHTML = '';
                }
            }
        } else {
            // Chưa chọn -> Chọn thêm
            app.selectedExchangeCardIds.push(cardId);
            if (el) {
                el.classList.add('selected');
                const indicator = el.querySelector('.checkbox-indicator');
                if (indicator) {
                    indicator.style.borderColor = '#fbbf24';
                    indicator.style.background = '#fbbf24';
                    indicator.innerHTML = '✓';
                    indicator.style.color = '#111827';
                    indicator.style.fontWeight = 'bold';
                    indicator.style.fontSize = '0.8rem';
                }
            }
        }
        
        const confirmBtn = Swal.getConfirmButton();
        if (confirmBtn) {
            if (app.selectedExchangeCardIds.length > 0) {
                confirmBtn.removeAttribute('disabled');
                confirmBtn.innerHTML = `Xác nhận đổi (${app.selectedExchangeCardIds.length * 15} phút)`;
            } else {
                confirmBtn.setAttribute('disabled', 'true');
                confirmBtn.innerHTML = 'Xác nhận đổi';
            }
        }
    },

    openParentGameVerification: function() {
        Swal.fire({
            title: 'Xác thực phụ huynh 🔑',
            text: 'Nhập Mật mã/Mã PIN phụ huynh để chơi game vô hạn thời gian:',
            input: 'password',
            inputPlaceholder: 'Nhập mã PIN phụ huynh...',
            showCancelButton: true,
            confirmButtonColor: '#7c3aed',
            cancelButtonColor: '#475569',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy bỏ'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const pin = result.value;
                if (!pin) {
                    Swal.fire({ icon: 'error', title: 'Lỗi', text: 'Vui lòng nhập mã PIN phụ huynh!' });
                    return;
                }

                Swal.fire({
                    title: 'Đang xác thực...',
                    allowOutsideClick: false,
                    didOpen: () => { Swal.showLoading(); }
                });

                try {
                    const res = await fetch(this.getApiUrl("/api/verify-pin"), {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ pin })
                    });
                    const data = await res.json();
                    
                    if (data.success) {
                        Swal.fire({
                            title: 'Xác thực thành công! ✨',
                            text: 'Phụ huynh đã mở khóa chế độ chơi game vô hạn thời gian.',
                            icon: 'success',
                            confirmButtonText: 'Bắt đầu chơi 🚀',
                            confirmButtonColor: '#10b981'
                        }).then(() => {
                            this.startFreePlayGame(Infinity);
                        });
                    } else {
                        Swal.fire({ icon: 'error', title: 'Lỗi', text: data.error || 'Mã PIN phụ huynh không chính xác!' });
                    }
                } catch (e) {
                    console.error("Lỗi xác thực PIN chơi game:", e);
                    Swal.fire({ icon: 'error', title: 'Lỗi máy chủ', text: 'Không thể kết nối đến máy chủ để xác thực!' });
                }
            }
        });
    },

    startFreePlayGame: function(duration) {
        const gameContainer = document.getElementById("td-game-container");
        const wrapper = document.getElementById("free-play-game-wrapper");
        const overlay = document.getElementById("free-play-overlay");
        if (!gameContainer || !wrapper || !overlay) return;

        // Lưu vị trí gốc để trả về sau khi chơi xong
        this.gameContainerParent = gameContainer.parentNode;
        this.gameContainerNextSibling = gameContainer.nextSibling;

        // Di chuyển game container sang overlay chơi game tự do
        wrapper.appendChild(gameContainer);
        gameContainer.classList.remove("hidden");
        overlay.classList.remove("hidden");
        document.body.classList.add("game-mode-active");
        document.body.classList.add("free-play-mode-active");

        // Cấu hình game ở chế độ Free Play
        if (window.game) {
            game.isFreePlay = true;
            game.gold = 250;
            game.hp = 10;
            game.currentWave = 0;
            game.totalWaves = 5;
            
            if (window.questions && questions.hero) {
                questions.hero.load();
                game.hero = questions.hero;
            }
            
            game.init('td-canvas', 5, game.hero);
            
            const startWaveBtn = document.getElementById("btn-start-wave");
            if (startWaveBtn) startWaveBtn.classList.remove("hidden");
            
            // Bắt đầu nhạc nền game
            if (this.audio) {
                this.audio.playBackground();
            }
        }

        const timerVal = document.getElementById("free-play-timer");
        const titleVal = document.getElementById("free-play-title");

        if (duration === Infinity) {
            // Chế độ Phụ huynh: Vô hạn thời gian
            if (timerVal) timerVal.style.display = 'none';
            if (titleVal) titleVal.innerHTML = 'CHẾ ĐỘ PHỤ HUYNH (VÔ HẠN THỜI GIAN)';
        } else {
            // Chế độ Học sinh: 15 phút
            if (timerVal) timerVal.style.display = 'inline-block';
            if (titleVal) titleVal.innerHTML = 'CHẾ ĐỘ HỌC SINH (GIỚI HẠN 15 PHÚT)';

            this.freePlayTimeRemaining = duration;
            const updateTimerDisplay = () => {
                const mins = Math.floor(this.freePlayTimeRemaining / 60);
                const secs = this.freePlayTimeRemaining % 60;
                if (timerVal) {
                    timerVal.innerHTML = `⏳ Còn lại: ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                }
            };
            
            updateTimerDisplay();
            
            if (this.freePlayTimerInterval) {
                clearInterval(this.freePlayTimerInterval);
            }
            
            this.freePlayTimerInterval = setInterval(() => {
                this.freePlayTimeRemaining--;
                if (this.freePlayTimeRemaining <= 0) {
                    clearInterval(this.freePlayTimerInterval);
                    this.freePlayTimerInterval = null;
                    this.exitFreePlayGame();
                    Swal.fire({
                        icon: 'info',
                        title: 'Hết giờ chơi game! ⏰',
                        text: 'Thời gian 15 phút chơi game của con đã hết. Hãy tiếp tục học tập để tích lũy thêm thẻ mạ vàng nhé!',
                        confirmButtonColor: '#10b981',
                        confirmButtonText: 'Đồng ý'
                    });
                } else {
                    updateTimerDisplay();
                }
            }, 1000);
        }
    },

    exitFreePlayGame: function() {
        if (this.freePlayTimerInterval) {
            clearInterval(this.freePlayTimerInterval);
            this.freePlayTimerInterval = null;
        }

        if (window.game) {
            game.stop();
            game.isFreePlay = false;
        }

        const overlay = document.getElementById("free-play-overlay");
        if (overlay) overlay.classList.add("hidden");
        document.body.classList.remove("game-mode-active");
        document.body.classList.remove("free-play-mode-active");

        // Di chuyển trả game container về vị trí cũ trong DOM
        const gameContainer = document.getElementById("td-game-container");
        if (gameContainer && this.gameContainerParent) {
            gameContainer.classList.add("hidden");
            if (this.gameContainerNextSibling) {
                this.gameContainerParent.insertBefore(gameContainer, this.gameContainerNextSibling);
            } else {
                this.gameContainerParent.appendChild(gameContainer);
            }
        }
        
        // Dừng nhạc nền game và quay lại nhạc chính nếu cần
        if (this.audio) {
            this.audio.stopBackground();
        }
    },

    // Hồ sơ chiến binh & Radar Năng lực
    renderEnglishProfile: function() {
        const container = document.getElementById("eng-profile-container");
        if (!container) return;

        const currentClass = this.config.currentClass || "6";
        const classData = window.ENGLISH_COURSE_DATA[currentClass];
        const topics = classData ? classData.topics : [];
        let completedCount = 0;
        
        topics.forEach(t => {
            const listeningScore = this.state.scores[`${t.id}-listening`] || 0;
            const speakingScore = this.state.scores[`${t.id}-speaking`] || 0;
            const readingScore = this.state.scores[`${t.id}-reading`] || 0;
            const writingScore = this.state.scores[`${t.id}-writing`] || 0;
            
            if (listeningScore >= 80 && speakingScore >= 80 && readingScore >= 80 && writingScore >= 80) {
                completedCount++;
            }
        });

        const totalCount = topics.length;

        if (!this.state.goldSkills) this.state.goldSkills = [];
        if (!this.state.redeemedSkills) this.state.redeemedSkills = [];

        const filteredCards = SKILL_CARDS.filter(card => {
            return !card.classLevel || card.classLevel === currentClass || this.isSkillCardUnlocked(card.id) || this.state.goldSkills.includes(card.id);
        });

        const skillCardsHtml = filteredCards.map(card => {
            const isUnlocked = this.isSkillCardUnlocked(card.id);
            const isGold = this.state.goldSkills.includes(card.id);
            const isRedeemed = this.state.redeemedSkills.includes(card.id);
            
            let cardStyle = "";
            let cardClass = "skill-card-3d";
            let borderStyle = "1px solid var(--border-color)";
            
            if (isGold) {
                cardClass += " gold-card-royal gold-card-royal-shine";
                borderStyle = "2px solid transparent";
                cardStyle = `transform: translate3d(0,0,0); position: relative; overflow: hidden;`;
            } else if (isUnlocked) {
                cardStyle = `background: ${card.color}; color: white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);`;
            } else {
                const isDarkMode = document.body.classList.contains("light-mode");
                const inactiveBg = isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)";
                cardStyle = `background: ${inactiveBg}; color: var(--text-muted); border-style: dashed; opacity: 0.8;`;
                borderStyle = "2px dashed var(--border-color)";
            }

            const labelText = (isGold && isRedeemed) ? 'ĐÃ QUY ĐỔI' : isGold ? 'CỰC PHẨM' : isUnlocked ? 'ĐÃ ĐẠT' : 'CHƯA ĐẠT';
            const labelBg = (isGold && isRedeemed) ? 'rgba(239,68,68,0.2)' : isGold ? 'rgba(245,158,11,0.2)' : isUnlocked ? 'rgba(255,255,255,0.2)' : 'var(--primary-bg)';
            const labelColor = (isGold && isRedeemed) ? '#ef4444' : isGold ? '#fbbf24' : isUnlocked ? 'white' : 'var(--primary)';
            
            return `
                <div class="${cardClass}" style="border: ${borderStyle}; border-radius: 16px; padding: 1.2rem 1rem; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: space-between; min-height: 215px; height: 100%; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); ${cardStyle} ${isRedeemed ? 'opacity: 0.85;' : ''}">
                    ${isGold && isRedeemed ? `
                    <div style="position: absolute; top: 10px; right: 10px; border: 2px double #ef4444; color: #ef4444; background: rgba(254,226,226,0.9); font-size: 0.65rem; font-weight: 900; padding: 2px 6px; border-radius: 4px; transform: rotate(15deg); z-index: 10; letter-spacing: 0.5px;">
                        ĐÃ QUY ĐỔI
                    </div>
                    ` : ''}
                    <div style="font-size: 3rem; margin-bottom: 0.2rem; filter: ${isUnlocked ? 'none' : 'grayscale(1) contrast(0.5)'};">
                        ${isUnlocked ? card.icon : '🔒'}
                    </div>
                    <div>
                        <div style="font-weight: 900; font-size: 0.95rem; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.3px; color: ${isUnlocked ? 'white' : 'var(--text-main)'};" class="${isGold ? 'gold-title-glow' : ''}">
                            ${card.name}
                        </div>
                        <div style="font-size: 0.72rem; line-height: 1.3; color: ${isGold ? (isRedeemed ? '#fca5a5' : '#a7f3d0') : isUnlocked ? 'rgba(255,255,255,0.85)' : 'var(--text-muted)'};">
                            ${card.desc}
                        </div>
                    </div>
                    <div style="font-size: 0.7rem; font-weight: 800; margin-top: 6px; padding: 2px 8px; border-radius: 99px; background: ${labelBg}; color: ${labelColor};">
                        ${labelText}
                    </div>
                </div>
            `;
        }).join("");

        container.innerHTML = `
            <div style="display:flex; align-items:center; gap:1.5rem; flex-wrap:wrap; border-bottom:1px solid var(--border-color); padding-bottom:1rem;">
                <div style="font-size:4rem; filter:drop-shadow(0 4px 6px rgba(0,0,0,0.15));">🥷</div>
                <div>
                    <h4 style="margin:0; font-size:1.4rem; font-weight:900; color:var(--text-main);">Chiến binh Anh Ngữ</h4>
                    <p style="margin:4px 0 0 0; color:var(--text-muted); font-weight:700;">Học sinh: ${this.config.studentName || 'Chưa xác định'} (Lớp ${currentClass})</p>
                </div>
            </div>
            
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:1rem; margin-top:1rem;">
                <div class="eng-right-card" style="flex-direction:column; align-items:flex-start; gap:0.5rem; background:var(--bg-card); border:2px solid var(--border-color); padding:1rem; border-radius:16px;">
                    <div style="font-size:1.5rem;">🔥</div>
                    <div class="eng-right-card-val" style="font-size:1.3rem; font-weight:900; color:var(--text-main);">${this.state.englishStreak || 0} Ngày</div>
                    <div class="eng-right-card-lbl" style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">Chuỗi học tập liên tục</div>
                </div>
                <div class="eng-right-card" style="flex-direction:column; align-items:flex-start; gap:0.5rem; background:var(--bg-card); border:2px solid var(--border-color); padding:1rem; border-radius:16px;">
                    <div style="font-size:1.5rem;">⭐</div>
                    <div class="eng-right-card-val" style="font-size:1.3rem; font-weight:900; color:var(--text-main);">${this.state.englishXp || 0} XP</div>
                    <div class="eng-right-card-lbl" style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">Kinh nghiệm tích lũy</div>
                </div>
                <div class="eng-right-card" style="flex-direction:column; align-items:flex-start; gap:0.5rem; background:var(--bg-card); border:2px solid var(--border-color); padding:1rem; border-radius:16px;">
                    <div style="font-size:1.5rem;">🏆</div>
                    <div class="eng-right-card-val" style="font-size:1.3rem; font-weight:900; color:var(--text-main);">${completedCount} / ${totalCount}</div>
                    <div class="eng-right-card-lbl" style="font-size:0.8rem; color:var(--text-muted); font-weight:700;">Chủ đề hoàn thành 4 kỹ năng</div>
                </div>
            </div>
 
            <!-- Hệ thống Thẻ Năng Lực 3D -->
            <div style="margin-top:2rem; border-top:1px solid var(--border-color); padding-top:1.5rem;">
                <h5 style="margin:0 0 1.2rem 0; font-weight:800; font-size:1.1rem; color:var(--text-main); display:flex; align-items:center; gap:0.5rem;"><i class="fa-solid fa-address-card" style="color:#a855f7;"></i> Bộ sưu tập Thẻ Năng Lực Anh Ngữ 3D</h5>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap:1.2rem;">
                    ${skillCardsHtml}
                </div>
            </div>

            <!-- Lịch sử quy đổi thẻ lấy giờ chơi game -->
            <div style="margin-top:2rem; border-top:1px solid var(--border-color); padding-top:1.5rem;">
                <h5 style="margin:0 0 1.2rem 0; font-weight:800; font-size:1.1rem; color:var(--text-main); display:flex; align-items:center; gap:0.5rem;">
                    <i class="fa-solid fa-clock-rotate-left" style="color:#10b981;"></i> Lịch sử quy đổi thẻ năng lực
                </h5>
                ${this.renderCardExchangeHistoryHtml()}
            </div>
            
            <div style="margin-top:2rem; text-align:center; border-top:1px solid var(--border-color); padding-top:1.5rem;">
                <h5 style="margin:0 0 1rem 0; font-weight:800; font-size:1.1rem; color:var(--text-main);">Biểu đồ Năng lực Kỹ năng (Radar Chart)</h5>
                <div style="display:flex; justify-content:center;">
                    <canvas id="english-skills-radar-chart" width="450" height="360" style="max-width: 100%; height: auto;"></canvas>
                </div>
            </div>
        `;
    },

    renderCardExchangeHistoryHtml: function() {
        if (!this.state.cardExchangeHistory || this.state.cardExchangeHistory.length === 0) {
            return `
                <div style="text-align:center; padding:1.5rem; background:var(--bg-card); border:1px dashed var(--border-color); border-radius:12px; color:var(--text-muted); font-size:0.88rem; font-weight:700;">
                    Chưa có lịch sử quy đổi thẻ năng lực.
                </div>
            `;
        }

        const sortedHistory = [...this.state.cardExchangeHistory].sort((a, b) => new Date(b.redeemedAt) - new Date(a.redeemedAt));
        let rowsHtml = '';
        sortedHistory.forEach(h => {
            const card = SKILL_CARDS.find(c => c.id === h.cardId);
            const cardIcon = card ? card.icon : '🌟';
            const dateStr = new Date(h.redeemedAt).toLocaleString('vi-VN');
            rowsHtml += `
                <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 12px; border-bottom:1px solid var(--border-color); font-size:0.88rem;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:1.4rem; filter: drop-shadow(0 0 4px gold);">${cardIcon}</span>
                        <div>
                            <div style="font-weight:800; color:var(--text-main);">${h.cardName}</div>
                            <div style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">${dateStr}</div>
                        </div>
                    </div>
                    <div style="text-align:right;">
                        <span style="background:rgba(14,165,233,0.1); color:#0ea5e9; border:1px solid rgba(14,165,233,0.2); padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:800;">
                            ${h.device}
                        </span>
                    </div>
                </div>
            `;
        });

        return `
            <div style="max-height: 250px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 12px; background: var(--bg-card); padding: 5px;">
                ${rowsHtml}
            </div>
        `;

        const scores = this.calculateEnglishSkillScores();
        
        // Tự động lấy màu chữ dựa theo chế độ màu hiện tại (Green Mode nền sáng, Night Mode nền tối)
        const isDarkMode = document.body.classList.contains("light-mode");
        const txtColor = isDarkMode ? "#ffffff" : "#0b3012";
        setTimeout(() => {
            this.drawEnglishRadarChart("english-skills-radar-chart", scores, txtColor);
        }, 150);
    },

    // ==========================================================================
    // LOGIC TỰ TẠO CHỦ ĐỀ HỌC TẬP (CUSTOM VOCABULARY FOR STUDENTS)
    // ==========================================================================
    renderCustomVocabTab: async function() {
        const container = document.getElementById("student-vocab-topics-container");
        const statsEl = document.getElementById("student-vocab-inventory-stats");
        if (!container) return;

        container.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu...</div>`;

        await this.loadCustomTopics();

        const topics = this.customTopics || [];
        const vocabs = this.customVocabulary || [];

        if (statsEl) {
            statsEl.textContent = `Tổng số: ${vocabs.length} từ`;
        }

        if (topics.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-muted); font-style: italic; font-size: 0.9rem;">
                    Con chưa tạo chuyên đề từ vựng nào. Hãy nhập thông tin phía trên để tạo chủ đề đầu tiên nhé!
                </div>
            `;
            return;
        }

        container.innerHTML = "";
        topics.forEach((topic, idx) => {
            const topicVocab = vocabs.filter(v => v.topic_id === topic.id);
            const dateStr = new Date(topic.created_at).toLocaleDateString("vi-VN", {
                day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
            });

            const card = document.createElement("div");
            card.style.cssText = `background: white; border: 2px solid #cbd5e1; border-radius: 16px; padding: 1.2rem; display: flex; flex-direction: column; gap: 0.8rem; box-shadow: 0 4px 6px rgba(0,0,0,0.02); transition: all 0.2s; position: relative; margin-bottom: 1rem;`;

            // Xây dựng badges từ vựng
            const vocabHtml = topicVocab.map(v => `
                <span class="vocab-badge" onclick="app.playEnglishVoice('${v.word.replace(/'/g, "\\'")}')" style="background:#f8fafc; border:1px solid #e2e8f0; padding:4px 10px; border-radius:99px; font-weight:700; font-size:0.8rem; color:#334155; display:inline-flex; align-items:center; gap:0.4rem; cursor:pointer; transition:all 0.15s;" title="Nhấn để nghe">
                    <i class="fa-solid fa-volume-high" style="color:#7c3aed; font-size:0.7rem;"></i>
                    <b>${v.word}</b> 
                    <span style="color:#ef4444; font-size:0.75rem; font-weight:600;">${v.phonetics || ''}</span>
                    <span style="font-weight:normal; color:#64748b; font-size:0.75rem;">: ${v.translation}</span>
                </span>
            `).join(" ");

            // Điểm số cao nhất của chuyên đề này
            const scoreKey = `${topic.id}-${this.currentEnglishSkill}`;
            const score = this.state.scores[scoreKey] || 0;

            card.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; border-bottom:1px solid #f1f5f9; padding-bottom:0.6rem;">
                    <div>
                        <span style="font-weight:900; font-size:0.75rem; color:#7c3aed; text-transform:uppercase;">Chuyên đề ${idx + 1} (${dateStr})</span>
                        <h5 style="margin:2px 0 0 0; font-size:1.1rem; font-weight:800; color:#1e293b;">${topic.title}</h5>
                    </div>
                    <div style="display:flex; gap:0.5rem; align-items:center;">
                        ${score >= 80 ? `<span style="font-size:1.5rem; text-shadow:0 0 8px gold;" title="Đã hoàn thành xuất sắc!">👑</span>` : `<span style="font-size:1.2rem; filter:grayscale(100%); opacity:0.3;">👑</span>`}
                        <span style="font-size:0.9rem; font-weight:800; color:${score >= 80 ? '#10b981' : '#f59e0b'};">${score}%</span>
                        <button onclick="app.deleteStudentCustomTopic('${topic.id}')" style="background:none; border:none; color:#ef4444; cursor:pointer; padding:4px; font-size:0.95rem;" title="Xóa chuyên đề"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>

                <div style="display:flex; flex-direction:column; gap:0.5rem;">
                    <div style="display:flex; flex-wrap:wrap; gap:0.4rem; max-height: 120px; overflow-y: auto;">
                        ${vocabHtml || '<span style="color:#94a3b8; font-size:0.8rem; font-style:italic;">Chưa có từ vựng nào trong chuyên đề này</span>'}
                    </div>
                </div>

                <div style="display:flex; justify-content:flex-end; margin-top:0.3rem;">
                    <button class="btn-primary" onclick="app.startEnglishLesson('${topic.id}')" style="cursor:pointer; background:linear-gradient(135deg, #7c3aed, #6d28d9); border:none; padding:0.5rem 1rem; font-size:0.85rem; border-radius:10px; color:white; font-weight:800; display:flex; align-items:center; gap:0.4rem; box-shadow:0 2px 4px rgba(124,58,237,0.15);">
                        <i class="fa-solid fa-play"></i> Luyện tập ngay
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    addStudentCustomVocabulary: function() {
        const topicTitleInput = document.getElementById("student-vocab-topic-title");
        const wordListInput = document.getElementById("student-vocab-word-list");
        const autoCompleteInput = document.getElementById("student-vocab-auto-complete");

        const topicTitle = topicTitleInput ? topicTitleInput.value.trim() : "";
        const wordListRaw = wordListInput ? wordListInput.value.trim() : "";
        const autoComplete = autoCompleteInput ? autoCompleteInput.checked : true;
        const studentId = this.config.defaultStudentId || "default";

        if (!topicTitle) {
            Swal.fire("Lỗi", "Vui lòng nhập Tiêu đề chuyên đề!", "error");
            return;
        }

        if (!wordListRaw) {
            Swal.fire("Lỗi", "Vui lòng nhập ít nhất một từ vựng!", "error");
            return;
        }

        const rawWords = wordListRaw
            .split(/[\n,]+/)
            .map(w => w.trim())
            .filter(w => w.length > 0);

        if (rawWords.length === 0) {
            Swal.fire("Lỗi", "Danh sách từ vựng không hợp lệ!", "error");
            return;
        }

        const words = rawWords.map(w => ({ word: w }));

        Swal.fire({
            title: 'Đang lưu từ vựng...',
            html: autoComplete ? 'Trí tuệ nhân tạo (Gemini AI) đang dịch nghĩa, tạo phiên âm và đặt câu ví dụ...' : 'Đang xử lý lưu thông tin từ vựng...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        fetch(this.getApiUrl('/api/custom-vocabulary/add'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId,
                topicTitle,
                words,
                autoComplete
            })
        })
        .then(res => res.json())
        .then(async data => {
            Swal.close();
            if (data.error) {
                Swal.fire("Lỗi", data.error, "error");
            } else {
                Swal.fire("Thành công", "Đã tạo chuyên đề và lưu từ vựng thành công!", "success");
                if (topicTitleInput) topicTitleInput.value = "";
                if (wordListInput) wordListInput.value = "";
                await this.renderCustomVocabTab();
            }
        })
        .catch(err => {
            Swal.close();
            console.error("Lỗi thêm từ vựng:", err);
            Swal.fire("Lỗi", "Không thể kết nối đến máy chủ.", "error");
        });
    },

    deleteStudentCustomTopic: function(topicId) {
        const studentId = this.config.defaultStudentId || "default";
        
        Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Chuyên đề này và toàn bộ từ vựng bên trong sẽ bị xóa vĩnh viễn!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Đồng ý xóa',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Đang xóa...',
                    allowOutsideClick: false,
                    didOpen: () => { Swal.showLoading(); }
                });

                fetch(this.getApiUrl('/api/custom-topics/delete'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        studentId,
                        topicId
                    })
                })
                .then(res => res.json())
                .then(async data => {
                    Swal.close();
                    if (data.error) {
                        Swal.fire("Lỗi", data.error, "error");
                    } else {
                        Swal.fire("Đã xóa", "Đã xóa chuyên đề thành công!", "success");
                        await this.renderCustomVocabTab();
                    }
                })
                .catch(err => {
                    Swal.close();
                    console.error("Lỗi xóa chuyên đề:", err);
                    Swal.fire("Lỗi", "Không thể kết nối đến máy chủ.", "error");
                });
            }
        });
    },

    // ==========================================================================
    // LOGIC LUYỆN THI TIẾNG ANH OLYMPIC IOE
    // ==========================================================================
    currentIoeQuestions: [],
    currentIoeQuestionIndex: 0,
    currentIoeScore: 0, // Điểm số thực tế (tối đa 200 điểm)
    currentIoeCorrectCount: 0,
    currentIoeWrongCount: 0,
    currentIoeTimer: null,
    currentIoeTimeRemaining: 1200, // 20 phút
    currentIoeTopicId: null,
    currentIoeSelectedAnswer: null, // Lưu câu trả lời được chọn tạm thời
    currentIoeMatchingSelected: { eng: null, vi: null }, // Lưu ghép cặp tạm thời
    currentIoeMatchingPairsDone: [], // Lưu các cặp đã ghép thành công

    renderEnglishIoe: function() {
        const placeholder = document.getElementById("english-ioe-placeholder");
        if (!placeholder) return;
        placeholder.innerHTML = "";

        const currentClass = this.config.currentClass || "6";
        const classData = window.ENGLISH_COURSE_DATA[currentClass];
        if (!classData) {
            placeholder.innerHTML = `<p style="color:#64748b; text-align:center;">Chưa có dữ liệu bài học cho khối lớp ${currentClass}.</p>`;
            return;
        }

        let roundsHtml = `
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap:1.2rem; width:100%;">
                ${classData.topics.map((topic, i) => {
                    const scoreKey = `ioe-${topic.id}`;
                    const bestScore = this.state.scores[scoreKey] || 0;
                    const status = this.getEnglishLessonStatus(topic.id); // Tận dụng hệ thống mở khóa có sẵn

                    return `
                        <div class="ioe-round-card" style="background:var(--bg-card); border: 2px solid ${status === 'locked' ? 'var(--border-color)' : '#3b82f6'}; border-radius: 16px; padding: 1.2rem; display: flex; flex-direction: column; gap: 0.8rem; opacity: ${status === 'locked' ? 0.6 : 1}; transition: transform 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <span style="font-weight:900; font-size:0.8rem; color:#2563eb; text-transform:uppercase;">Vòng tự luyện ${i + 1}</span>
                                <span style="font-size:0.75rem; background:rgba(59,130,246,0.1); color:#2563eb; font-weight:800; padding:2px 8px; border-radius:99px;">Lớp ${currentClass}</span>
                            </div>
                            <h4 style="margin:2px 0; font-size:1.1rem; font-weight:800; color:var(--text-main); line-height:1.4;">${topic.title.replace(/^Unit \d+:\s*/, "")}</h4>
                            <div style="font-size:0.85rem; color:var(--text-muted); line-height:1.4;">Bao gồm: 5 từ vựng, ngữ pháp và 20 câu hỏi tương tác Olympic IOE.</div>
                            
                            <div style="border-top:1px dashed var(--border-color); padding-top:0.8rem; display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                                <div>
                                    <div style="font-size:0.72rem; color:var(--text-muted); font-weight:700;">Điểm kỷ lục:</div>
                                    <div style="font-size:1rem; font-weight:800; color:${bestScore >= 150 ? '#10b981' : '#f59e0b'};">${bestScore}/200 điểm</div>
                                </div>
                                <button class="btn-primary" onclick="app.startIoeExam('${topic.id}')" ${status === 'locked' ? 'disabled style="background:var(--border-color); border-color:var(--border-color); color:var(--text-muted); cursor:not-allowed; opacity:0.6;"' : 'style="background:#2563eb; border-color:#2563eb; cursor:pointer;"'}>
                                    ${status === 'locked' ? '🔒 Khóa' : '🚀 Vào Thi'}
                                </button>
                            </div>
                        </div>
                    `;
                }).join("")}
            </div>
        `;
        placeholder.innerHTML = roundsHtml;
    },

    startIoeExam: function(topicId) {
        if (this.state.englishHearts <= 0 && !this.state.infiniteHearts) {
            Swal.fire("Hết Trái tim! ❤️", "Con hãy hồi tim hoặc bật Vô hạn tim để bắt đầu thi đấu IOE nhé!", "warning");
            return;
        }

        const currentClass = this.config.currentClass || "6";
        const questions = window.generateIoeQuestions(currentClass, topicId);
        if (!questions || questions.length === 0) {
            Swal.fire("Lỗi", "Không thể sinh câu hỏi cho vòng tự luyện này.", "error");
            return;
        }

        this.currentIoeQuestions = questions;
        this.currentIoeQuestionIndex = 0;
        this.currentIoeScore = 0;
        this.currentIoeCorrectCount = 0;
        this.currentIoeWrongCount = 0;
        this.currentIoeTopicId = topicId;
        this.currentIoeTimeRemaining = 1200; // 20 phút

        // Reset UI counters
        document.getElementById("ioe-correct-count").innerText = 0;
        document.getElementById("ioe-wrong-count").innerText = 0;
        document.getElementById("ioe-current-score").innerText = 0;

        document.body.classList.add("focus-mode-active");
        document.getElementById("english-ioe-exam-screen").classList.remove("hidden");

        // Khởi động Timer
        if (this.currentIoeTimer) clearInterval(this.currentIoeTimer);
        this.currentIoeTimer = setInterval(() => this.updateIoeTimer(), 1000);
        this.updateIoeTimer();

        this.renderIoeQuestion();
    },

    updateIoeTimer: function() {
        if (this.currentIoeTimeRemaining <= 0) {
            clearInterval(this.currentIoeTimer);
            Swal.fire({
                title: "Hết giờ làm bài! ⏱️",
                text: "Đồng hồ đã chỉ về 0. Hệ thống sẽ tự động nộp bài thi IOE của con.",
                icon: "warning",
                confirmButtonText: "Xem kết quả"
            }).then(() => {
                this.finishIoeExam();
            });
            return;
        }

        this.currentIoeTimeRemaining--;
        const mins = Math.floor(this.currentIoeTimeRemaining / 60);
        const secs = this.currentIoeTimeRemaining % 60;
        const display = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        document.getElementById("ioe-timer").innerText = display;
    },

    exitIoeExam: function() {
        Swal.fire({
            title: "Hủy bỏ vòng thi IOE?",
            text: "Nếu thoát giữa chừng, kết quả vòng tự luyện này sẽ không được lưu lại đâu con nhé!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Thoát ngay 🚪",
            cancelButtonText: "Làm bài tiếp 🏆",
            background: 'var(--bg-card)',
            color: 'var(--text-main)'
        }).then(result => {
            if (result.isConfirmed) {
                if (this.currentIoeTimer) clearInterval(this.currentIoeTimer);
                document.getElementById("english-ioe-exam-screen").classList.add("hidden");
                document.body.classList.remove("focus-mode-active");
                this.renderEnglishIoe();
            }
        });
    },

    renderIoeQuestion: function() {
        this.currentIoeSelectedAnswer = null;
        this.currentIoeMatchingSelected = { eng: null, vi: null };
        this.currentIoeMatchingPairsDone = [];

        const container = document.getElementById("ioe-interaction-area");
        if (!container) return;
        container.innerHTML = "";

        const qIndex = this.currentIoeQuestionIndex;
        const total = this.currentIoeQuestions.length;
        const q = this.currentIoeQuestions[qIndex];

        // Cập nhật nhãn tiến trình
        const progressPct = Math.round((qIndex / total) * 100);
        document.getElementById("ioe-exam-progress").style.width = `${progressPct}%`;
        document.getElementById("ioe-progress-text").innerText = `Câu ${qIndex + 1}/${total}`;

        let headerHtml = `<h2 style="font-size:1.35rem; font-weight:900; color:var(--text-main); text-align:center; margin-bottom:1.5rem; line-height:1.5;">${q.questionText}</h2>`;
        let innerHtml = "";

        if (q.type === "ioe_leave_alone") {
            const letters = q.scrambled.toUpperCase().split("");
            innerHtml = `
                <div style="text-align:center; width:100%;">
                    <div style="display:flex; gap:0.8rem; justify-content:center; margin:2.5rem 0; flex-wrap:wrap;">
                        ${letters.map((char, i) => `
                            <button class="ioe-letter-btn" id="ioe-la-char-${i}" onclick="app.handleIoeLeaveAloneClick(${i})" style="width:55px; height:55px; border-radius:12px; border:2px solid #cbd5e1; background:white; font-size:1.5rem; font-weight:900; color:#1e293b; cursor:pointer; box-shadow:0 4px 0 #cbd5e1; transition:all 0.1s ease;">${char}</button>
                        `).join("")}
                    </div>
                </div>
            `;
        }
        else if (q.type === "ioe_fill_blank") {
            innerHtml = `
                <div style="text-align:center; width:100%; margin:2rem 0;">
                    <div style="margin-bottom:1.5rem;">
                        <input type="text" id="ioe-fb-input" class="form-input" maxlength="1" style="text-align:center; font-size:2rem; width:80px; height:80px; padding:0; border-radius:16px; border:3px solid #3b82f6; background:var(--bg-app); color:#2563eb; font-weight:900; text-transform:uppercase;" autocomplete="off">
                    </div>
                    <p style="color:#64748b; font-weight:700; font-size:0.9rem;">Nhập chữ cái còn thiếu vào ô trên</p>
                </div>
            `;
        }
        else if (q.type === "ioe_pair_matching") {
            const shuffleArray = (arr) => arr.slice().sort(() => Math.random() - 0.5);
            const engWords = q.pairs.map(p => p.eng);
            const viMeanings = q.pairs.map(p => p.vi);
            
            const shufEng = shuffleArray(engWords);
            const shufVi = shuffleArray(viMeanings);

            innerHtml = `
                <div style="display:flex; gap:2.5rem; width:100%; justify-content:center; align-items:stretch; margin:1.5rem 0;">
                    <div style="display:flex; flex-direction:column; gap:0.8rem; flex:1; max-width:240px;">
                        <div style="text-align:center; font-weight:900; color:#2563eb; font-size:0.95rem; margin-bottom:4px; text-transform:uppercase;">Tiếng Anh</div>
                        ${shufEng.map((eng, i) => `
                            <button class="ioe-matching-btn eng" id="ioe-match-eng-${eng.replace(/\s+/g, "_")}" onclick="app.handleIoeMatchingClick('eng', '${eng.replace(/\s+/g, "_")}', '${eng.replace(/'/g, "\\'")}')" style="padding:0.9rem 1rem; border-radius:12px; border:2px solid #cbd5e1; background:white; font-weight:700; color:var(--text-main); font-size:0.95rem; cursor:pointer; text-align:left; transition:all 0.15s ease; box-shadow:0 3px 0 #cbd5e1; width:100%;">${eng}</button>
                        `).join("")}
                    </div>
                    <div style="display:flex; flex-direction:column; gap:0.8rem; flex:1; max-width:240px;">
                        <div style="text-align:center; font-weight:900; color:#10b981; font-size:0.95rem; margin-bottom:4px; text-transform:uppercase;">Nghĩa Tiếng Việt</div>
                        ${shufVi.map((vi, i) => `
                            <button class="ioe-matching-btn vi" id="ioe-match-vi-${vi.replace(/\s+/g, "_")}" onclick="app.handleIoeMatchingClick('vi', '${vi.replace(/\s+/g, "_")}', '${vi.replace(/'/g, "\\'")}')" style="padding:0.9rem 1rem; border-radius:12px; border:2px solid #cbd5e1; background:white; font-weight:700; color:var(--text-main); font-size:0.95rem; cursor:pointer; text-align:left; transition:all 0.15s ease; box-shadow:0 3px 0 #cbd5e1; width:100%;">${vi}</button>
                        `).join("")}
                    </div>
                </div>
            `;
        }
        else if (q.type === "ioe_dragon") {
            innerHtml = `
                <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
                    <div style="display:flex; align-items:center; gap:2rem; margin:1rem 0 2rem 0; width:100%; justify-content:center;">
                        <div style="font-size:5.5rem; filter:drop-shadow(0 8px 12px rgba(0,0,0,0.15));" class="ioe-dragon-animate">🐉</div>
                        <div style="background:#fef3c7; border:2px solid #f59e0b; padding:1rem; border-radius:16px; position:relative; max-width:400px; color:#92400e; font-weight:700; font-size:0.95rem; line-height:1.5; box-shadow:0 4px 6px rgba(0,0,0,0.02);">
                            "Grrr! Ngươi có dám trả lời câu hỏi ngữ pháp này để hạ gục ta không?"
                            <div style="position:absolute; left:-10px; top:50%; transform:translateY(-50%) rotate(45deg); width:16px; height:16px; background:#fef3c7; border-left:2px solid #f59e0b; border-bottom:2px solid #f59e0b;"></div>
                        </div>
                    </div>
                    
                    <div class="options-grid" style="display:flex; flex-direction:column; gap:0.8rem; width:100%; max-width:480px;">
                        ${q.options.map((opt, i) => `
                            <button class="option-btn duolingo-style" onclick="app.selectIoeOption(${i})" id="ioe-opt-${i}" style="text-align:left; padding:1rem 1.2rem; background:white; border: 2px solid var(--border-color); border-radius:12px; font-weight:700; color:var(--text-main); font-size:0.95rem; width:100%;">
                                ${opt}
                            </button>
                        `).join("")}
                    </div>
                </div>
            `;
        }
        else {
            innerHtml = `
                <div style="display:flex; flex-direction:column; align-items:center; width:100%;">
                    <div style="display:flex; align-items:center; gap:2rem; margin:1rem 0 2rem 0; width:100%; justify-content:center;">
                        <div style="font-size:5.5rem; filter:drop-shadow(0 8px 12px rgba(0,0,0,0.15));" class="ioe-monkey-animate">🐒</div>
                        <div style="background:#dcfce7; border:2px solid #22c55e; padding:1rem; border-radius:16px; position:relative; max-width:400px; color:#166534; font-weight:700; font-size:0.95rem; line-height:1.5; box-shadow:0 4px 6px rgba(0,0,0,0.02);">
                            "Khẹc khẹc! Hãy giúp khỉ treo tấm bảng đáp án đúng lên nhé chiến binh!"
                            <div style="position:absolute; left:-10px; top:50%; transform:translateY(-50%) rotate(45deg); width:16px; height:16px; background:#dcfce7; border-left:2px solid #22c55e; border-bottom:2px solid #22c55e;"></div>
                        </div>
                    </div>
                    
                    <div class="options-grid" style="display:flex; flex-direction:column; gap:0.8rem; width:100%; max-width:480px;">
                        ${q.options.map((opt, i) => `
                            <button class="option-btn duolingo-style" onclick="app.selectIoeOption(${i})" id="ioe-opt-${i}" style="text-align:left; padding:1rem 1.2rem; background:white; border: 2px solid var(--border-color); border-radius:12px; font-weight:700; color:var(--text-main); font-size:0.95rem; width:100%;">
                                ${opt}
                            </button>
                        `).join("")}
                    </div>
                </div>
            `;
        }

        container.innerHTML = `
            ${headerHtml}
            ${innerHtml}
            <div style="margin-top:2.5rem; text-align:center; width:100%;">
                <button class="btn-primary disabled" id="btn-ioe-check-answer" onclick="app.checkIoeAnswer()" disabled style="padding:0.75rem 2.5rem; border-radius:12px; font-weight:800; font-size:1rem; opacity:0.5; cursor:pointer; background:#2563eb; border-color:#2563eb;">
                    <i class="fa-solid fa-circle-check"></i> Kiểm Tra
                </button>
            </div>
        `;

        const fbInput = document.getElementById("ioe-fb-input");
        if (fbInput) {
            fbInput.focus();
            fbInput.oninput = (e) => {
                const val = e.target.value.trim().toLowerCase();
                const checkBtn = document.getElementById("btn-ioe-check-answer");
                if (checkBtn) {
                    if (val.length > 0) {
                        this.currentIoeSelectedAnswer = val;
                        checkBtn.removeAttribute("disabled");
                        checkBtn.style.opacity = "1";
                    } else {
                        checkBtn.setAttribute("disabled", "true");
                        checkBtn.style.opacity = "0.5";
                    }
                }
            };
        }
    },

    handleIoeLeaveAloneClick: function(letterIndex) {
        const q = this.currentIoeQuestions[this.currentIoeQuestionIndex];
        const lettersCount = q.scrambled.length;

        for (let i = 0; i < lettersCount; i++) {
            const btn = document.getElementById(`ioe-la-char-${i}`);
            if (btn) {
                if (i === letterIndex) {
                    btn.style.background = "#fee2e2";
                    btn.style.borderColor = "#ef4444";
                    btn.style.color = "#ef4444";
                    btn.style.boxShadow = "0 4px 0 #ef4444";
                    btn.style.transform = "translateY(4px)";
                } else {
                    btn.style.background = "white";
                    btn.style.borderColor = "#cbd5e1";
                    btn.style.color = "#1e293b";
                    btn.style.boxShadow = "0 4px 0 #cbd5e1";
                    btn.style.transform = "none";
                }
            }
        }

        this.currentIoeSelectedAnswer = letterIndex;

        const checkBtn = document.getElementById("btn-ioe-check-answer");
        if (checkBtn) {
            checkBtn.removeAttribute("disabled");
            checkBtn.style.opacity = "1";
        }
    },

    handleIoeMatchingClick: function(type, elementId, value) {
        const q = this.currentIoeQuestions[this.currentIoeQuestionIndex];

        if (this.currentIoeMatchingPairsDone.some(pair => pair[type] === value)) return;

        const buttons = document.querySelectorAll(`.ioe-matching-btn.${type}`);
        buttons.forEach(btn => {
            const valAttr = btn.getAttribute("id").replace(`ioe-match-${type}-`, "");
            const cleanVal = valAttr.replace(/_/g, " ");
            if (!this.currentIoeMatchingPairsDone.some(pair => pair[type].replace(/\s+/g, "_").toLowerCase() === valAttr.toLowerCase())) {
                btn.style.background = "white";
                btn.style.borderColor = "#cbd5e1";
                btn.style.color = "var(--text-main)";
            }
        });

        const activeBtn = document.getElementById(`ioe-match-${type}-${elementId}`);
        if (activeBtn) {
            activeBtn.style.background = type === 'eng' ? "#eff6ff" : "#ecfdf5";
            activeBtn.style.borderColor = type === 'eng' ? "#3b82f6" : "#10b981";
            activeBtn.style.color = type === 'eng' ? "#2563eb" : "#059669";
        }

        this.currentIoeMatchingSelected[type] = value;

        if (this.currentIoeMatchingSelected.eng && this.currentIoeMatchingSelected.vi) {
            const correctPair = q.pairs.find(p => p.eng.toLowerCase().trim() === this.currentIoeMatchingSelected.eng.toLowerCase().trim() && p.vi.toLowerCase().trim() === this.currentIoeMatchingSelected.vi.toLowerCase().trim());
            
            const engId = this.currentIoeMatchingSelected.eng.replace(/\s+/g, "_");
            const viId = this.currentIoeMatchingSelected.vi.replace(/\s+/g, "_");
            
            const engBtn = document.getElementById(`ioe-match-eng-${engId}`);
            const viBtn = document.getElementById(`ioe-match-vi-${viId}`);

            if (correctPair) {
                this.currentIoeMatchingPairsDone.push({ eng: this.currentIoeMatchingSelected.eng, vi: this.currentIoeMatchingSelected.vi });
                
                if (engBtn && viBtn) {
                    engBtn.style.background = "#dcfce7";
                    engBtn.style.borderColor = "#22c55e";
                    engBtn.style.color = "#15803d";
                    engBtn.style.boxShadow = "none";
                    engBtn.style.pointerEvents = "none";
                    
                    viBtn.style.background = "#dcfce7";
                    viBtn.style.borderColor = "#22c55e";
                    viBtn.style.color = "#15803d";
                    viBtn.style.boxShadow = "none";
                    viBtn.style.pointerEvents = "none";
                }
                
                const correctSound = new Audio("sounds/correct.mp3");
                correctSound.volume = 0.5;
                correctSound.play().catch(e => {});

                this.currentIoeMatchingSelected = { eng: null, vi: null };

                if (this.currentIoeMatchingPairsDone.length === q.pairs.length) {
                    const checkBtn = document.getElementById("btn-ioe-check-answer");
                    if (checkBtn) {
                        checkBtn.removeAttribute("disabled");
                        checkBtn.style.opacity = "1";
                    }
                }
            } else {
                if (engBtn && viBtn) {
                    engBtn.style.background = "#fee2e2";
                    engBtn.style.borderColor = "#ef4444";
                    engBtn.style.color = "#b91c1c";
                    
                    viBtn.style.background = "#fee2e2";
                    viBtn.style.borderColor = "#ef4444";
                    viBtn.style.color = "#b91c1c";

                    setTimeout(() => {
                        const isEngDone = this.currentIoeMatchingPairsDone.some(p => p.eng === this.currentIoeMatchingSelected.eng);
                        const isViDone = this.currentIoeMatchingPairsDone.some(p => p.vi === this.currentIoeMatchingSelected.vi);
                        if (!isEngDone && engBtn) {
                            engBtn.style.background = "white";
                            engBtn.style.borderColor = "#cbd5e1";
                            engBtn.style.color = "var(--text-main)";
                        }
                        if (!isViDone && viBtn) {
                            viBtn.style.background = "white";
                            viBtn.style.borderColor = "#cbd5e1";
                            viBtn.style.color = "var(--text-main)";
                        }
                    }, 600);
                }

                const wrongSound = new Audio("sounds/wrong.mp3");
                wrongSound.volume = 0.5;
                wrongSound.play().catch(e => {});

                this.currentIoeMatchingSelected = { eng: null, vi: null };
            }
        }
    },

    selectIoeOption: function(optIndex) {
        const q = this.currentIoeQuestions[this.currentIoeQuestionIndex];
        const total = q.options.length;
        
        for (let i = 0; i < total; i++) {
            const btn = document.getElementById(`ioe-opt-${i}`);
            if (btn) {
                if (i === optIndex) {
                    btn.classList.add("selected");
                } else {
                    btn.classList.remove("selected");
                }
            }
        }

        this.currentIoeSelectedAnswer = optIndex;

        const checkBtn = document.getElementById("btn-ioe-check-answer");
        if (checkBtn) {
            checkBtn.removeAttribute("disabled");
            checkBtn.style.opacity = "1";
        }
    },

    checkIoeAnswer: function() {
        const qIndex = this.currentIoeQuestionIndex;
        const q = this.currentIoeQuestions[qIndex];

        let isCorrect = false;
        let explanation = "";

        if (q.type === "ioe_leave_alone") {
            isCorrect = (this.currentIoeSelectedAnswer === q.extraIndex);
            explanation = q.solutionHtml;
        }
        else if (q.type === "ioe_fill_blank") {
            isCorrect = (this.currentIoeSelectedAnswer.toLowerCase() === q.missingChar.toLowerCase());
            explanation = q.solutionHtml;
        }
        else if (q.type === "ioe_pair_matching") {
            isCorrect = (this.currentIoeMatchingPairsDone.length === q.pairs.length);
            explanation = q.solutionHtml;
        }
        else {
            const chosenAnswer = q.options[this.currentIoeSelectedAnswer] || "";
            isCorrect = (chosenAnswer.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim());
            explanation = q.solutionHtml;
        }

        if (isCorrect) {
            this.currentIoeCorrectCount++;
            this.currentIoeScore += 10;
            
            document.getElementById("ioe-correct-count").innerText = this.currentIoeCorrectCount;
            document.getElementById("ioe-current-score").innerText = this.currentIoeScore;

            const correctSound = new Audio("sounds/correct.mp3");
            correctSound.play().catch(e => {});

            setTimeout(() => {
                const quotes = ["Fantastic!", "Excellent!", "Well done!", "Awesome!", "Great job!", "Perfect!", "Amazing!", "Superb!", "You did it!", "Good job!"];
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                this.speakEnglish(randomQuote);
            }, 250);

            if (Math.random() < 0.25) {
                setTimeout(() => {
                    const clapping = new Audio("sounds/clapping.mp3");
                    clapping.volume = 0.35;
                    clapping.play().catch(e => {});
                }, 300);
            }

            Swal.fire({
                title: "Chính xác! 🎉",
                html: explanation,
                icon: "success",
                confirmButtonText: "Tiếp tục"
            }).then(() => {
                this.nextIoeQuestion();
            });
        } else {
            this.currentIoeWrongCount++;
            document.getElementById("ioe-wrong-count").innerText = this.currentIoeWrongCount;

            const wrongSound = new Audio("sounds/wrong.mp3");
            wrongSound.play().catch(e => {});

            const interactionArea = document.getElementById("ioe-interaction-area");
            if (interactionArea) {
                interactionArea.classList.add("shake-effect");
                setTimeout(() => interactionArea.classList.remove("shake-effect"), 400);
            }

            Swal.fire({
                title: "Chưa chính xác rồi con ơi! 😢",
                html: explanation,
                icon: "error",
                confirmButtonText: "Tiếp tục"
            }).then(() => {
                this.nextIoeQuestion();
            });
        }
    },

    nextIoeQuestion: function() {
        this.currentIoeQuestionIndex++;
        const total = this.currentIoeQuestions.length;

        if (this.currentIoeQuestionIndex >= total) {
            this.finishIoeExam();
        } else {
            this.renderIoeQuestion();
        }
    },

    finishIoeExam: function() {
        if (this.currentIoeTimer) clearInterval(this.currentIoeTimer);
        
        document.getElementById("english-ioe-exam-screen").classList.add("hidden");
        document.body.classList.remove("focus-mode-active");

        const finalScore = this.currentIoeScore;
        const topicId = this.currentIoeTopicId;
        const scoreKey = `ioe-${topicId}`;
        const prevBest = this.state.scores[scoreKey] || 0;

        if (finalScore > prevBest) {
            this.state.scores[scoreKey] = finalScore;
        }

        const xpEarned = Math.round(finalScore * 0.5);
        this.state.englishXp = (this.state.englishXp || 0) + xpEarned;
        this.saveEnglishState();

        Swal.fire({
            title: finalScore >= 160 ? "Tuyệt vời, Chiến binh Olympic! 🏆" : "Hoàn thành Vòng tự luyện!",
            html: `Chúc mừng con đã hoàn thành vòng thi tự luyện IOE.<br/>Số điểm đạt được: <b style="color:#2563eb; font-size:1.4rem;">${finalScore}/200 điểm</b>.<br/>Đúng: <b>${this.currentIoeCorrectCount}</b> câu | Sai: <b>${this.currentIoeWrongCount}</b> câu.<br/>XP thưởng: <b style="color:#f59e0b;">+${xpEarned} XP</b>.`,
            icon: finalScore >= 160 ? "success" : "info",
            confirmButtonText: "Quay về Đấu Trường IOE 🗺️"
        }).then(() => {
            this.renderEnglishIoe();
        });
    }
};


// Hàm đóng popup huy hiệu
function closeBadgePopup() {
    document.getElementById("badge-popup").classList.add("hidden");
    if (window.app && window.app.pendingBadges && window.app.pendingBadges.length > 0) {
        const nextBadgeId = window.app.pendingBadges.shift();
        window.app.showBadgePopup(nextBadgeId);
    }
}

window.app = app;

// Khởi chạy khi tài nguyên trang đã sẵn sàng
window.onload = async function() {
    await app.init();
};
