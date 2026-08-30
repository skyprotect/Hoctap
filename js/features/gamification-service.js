/**
 * GAMIFICATION SERVICE
 * Quản lý điểm thưởng (XP), Chuỗi học tập (Streak), Trái tim (Hearts), 50 Thẻ Năng Lực & 30 Huy Hiệu
 */
(function() {
    'use strict';

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

    const DEFAULT_BADGES = [
        { id: "streak_3", name: "Chăm Chỉ 3 Ngày", desc: "Học liên tục trong 3 ngày", icon: "🔥" },
        { id: "streak_7", name: "Kỷ Luật Thép 7 Ngày", desc: "Học liên tục trong 7 ngày", icon: "⚡" },
        { id: "streak_30", name: "Học Bá 30 Ngày", desc: "Học liên tục trong 30 ngày", icon: "👑" },
        { id: "perfect_100", name: "Điểm 10 Tuyệt Đối", desc: "Đạt điểm 100% trong bài tập bất kỳ", icon: "🏆" },
        { id: "xp_1000", name: "Chiến Thần Tích Lũy", desc: "Đạt mốc 1000 XP", icon: "⭐" },
        { id: "xp_5000", name: "Huyền Thoại Trí Tuệ", desc: "Đạt mốc 5000 XP", icon: "🌟" }
    ];

    const GamificationService = {
        getSkillCards: function() {
            return SKILL_CARDS;
        },

        getBadges: function() {
            return DEFAULT_BADGES;
        },

        addXp: function(amount) {
            if (!window.AppState || !window.AppState.state) return 0;
            const currentXp = window.AppState.state.xp || 0;
            const newXp = currentXp + amount;
            window.AppState.state.xp = newXp;

            if (window.EventBus) {
                window.EventBus.emit('xp:updated', { xp: newXp, added: amount });
            }
            this.checkCardAndBadgeUnlocks();
            return newXp;
        },

        updateStreak: function() {
            if (!window.AppState || !window.AppState.state) return;
            const state = window.AppState.state;
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];
            const lastDate = state.lastActiveDate ? state.lastActiveDate.split('T')[0] : null;

            if (!lastDate) {
                state.streak = 1;
                state.lastActiveDate = now.toISOString();
            } else if (lastDate !== todayStr) {
                const diffTime = Math.abs(new Date(todayStr) - new Date(lastDate));
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays === 1) {
                    state.streak = (state.streak || 0) + 1;
                } else if (diffDays > 1) {
                    state.streak = 1;
                }
                state.lastActiveDate = now.toISOString();
            }

            if (window.EventBus) {
                window.EventBus.emit('streak:updated', state.streak);
            }
            this.checkCardAndBadgeUnlocks();
        },

        checkCardAndBadgeUnlocks: function() {
            if (!window.AppState || !window.AppState.state) return [];
            const state = window.AppState.state;
            state.badges = state.badges || [];
            state.goldBadges = state.goldBadges || [];

            const newlyUnlocked = [];

            // Kiểm tra các cột mốc XP
            if (state.xp >= 1000 && !state.badges.includes('xp_1000')) {
                state.badges.push('xp_1000');
                newlyUnlocked.push('xp_1000');
            }
            if (state.xp >= 5000 && !state.badges.includes('xp_5000')) {
                state.badges.push('xp_5000');
                newlyUnlocked.push('xp_5000');
            }

            // Kiểm tra chuỗi Streak
            if (state.streak >= 3 && !state.badges.includes('streak_3')) {
                state.badges.push('streak_3');
                newlyUnlocked.push('streak_3');
            }
            if (state.streak >= 7 && !state.badges.includes('streak_7')) {
                state.badges.push('streak_7');
                newlyUnlocked.push('streak_7');
            }
            if (state.streak >= 30 && !state.badges.includes('streak_30')) {
                state.badges.push('streak_30');
                newlyUnlocked.push('streak_30');
            }

            if (newlyUnlocked.length > 0 && window.EventBus) {
                window.EventBus.emit('badges:unlocked', newlyUnlocked);
            }

            return newlyUnlocked;
        }
    };

    if (typeof window !== 'undefined') {
        window.SKILL_CARDS = SKILL_CARDS;
        window.DEFAULT_BADGES = DEFAULT_BADGES;
        window.GamificationService = GamificationService;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { SKILL_CARDS, DEFAULT_BADGES, GamificationService };
    }
})();
