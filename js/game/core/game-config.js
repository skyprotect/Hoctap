/**
 * GAME ENGINE - CONFIGURATION
 * Định nghĩa Themes, cấu hình Tháp và Kỹ năng đặc biệt
 */
(function(root) {
    'use strict';

    const GameConfig = {
        mapThemes: {
        plains: {
            name: "Đồng bằng Cỏ xanh 🌲",
            bg: "#0a2e10", path: "#1a3d10", grid: "rgba(34, 197, 94, 0.07)", border: "rgba(52, 211, 153, 0.25)",
            bgGrad1: "#0d3b14", bgGrad2: "#061a09",
            pathEdge: "rgba(74, 222, 128, 0.35)", pathCenter: "#1c4a12"
        },
        volcano: {
            name: "Đồi núi Dung nham 🌋",
            bg: "#150a0a", path: "#6b1c1c", grid: "rgba(239, 68, 68, 0.07)", border: "rgba(251, 100, 60, 0.3)",
            bgGrad1: "#1f0a0a", bgGrad2: "#0a0505",
            pathEdge: "rgba(249, 115, 22, 0.5)", pathCenter: "#7c2020"
        },
        cyberpunk: {
            name: "Thành phố Cyberpunk 🏙️",
            bg: "#050b14", path: "#182030", grid: "rgba(56, 189, 248, 0.1)", border: "rgba(99, 214, 255, 0.3)",
            bgGrad1: "#080f1c", bgGrad2: "#020508",
            pathEdge: "rgba(56, 189, 248, 0.5)", pathCenter: "#1e3248"
        },
        tundra: {
            name: "Băng tuyết Tundra ❄️",
            bg: "#0d1a2e", path: "#1e3a5a", grid: "rgba(147, 210, 240, 0.09)", border: "rgba(186, 230, 253, 0.3)",
            bgGrad1: "#0f2040", bgGrad2: "#050d1a",
            pathEdge: "rgba(186, 230, 253, 0.45)", pathCenter: "#1e3a5a"
        }
    },
    
    // Các biến phục vụ kéo thả xây tháp và xác nhận
    mouseX: 0,
    mouseY: 0,
    previewX: null,
    previewY: null,
    isPreviewValid: false,
    confirmBuildPos: null,       // { x, y, type }
    
    // Các đường đi của quái vật (Multi-paths từ 3 hướng hội tụ về Lâu đài 880, 300) - cập nhật cho canvas 960x600
        towerConfig: {
        archer: {
            name: "Tháp Cung 🏹",
            cost: 100,
            range: 135,
            damage: 26,
            cooldown: 35, // Số frame giữa mỗi phát bắn (~0.6s)
            color: "#eab308", // Vàng ấm
            description: "Tháp cung bắn tên gỗ tầm xa nhanh lên cả loài bay và đi bộ"
        },
        ice: {
            name: "Tháp Băng ❄️",
            cost: 100,
            range: 115,
            damage: 12,
            cooldown: 50,
            color: "#38bdf8", // Xanh băng
            slowPower: 0.5, // Giảm 50% tốc độ
            slowDuration: 90, // Giảm trong 1.5s (90 frames)
            description: "Làm chậm quái bay và đi bộ trong tầm bắn diện rộng"
        },
        bomb: {
            name: "Tháp Pháo 💣",
            cost: 150,
            range: 145,
            damage: 55,
            cooldown: 80, // Tốc bắn chậm (~1.3s)
            color: "#ef4444", // Đỏ lửa
            splashRadius: 65, // Bán kính nổ lan
            description: "Sát thương nổ lan cực mạnh, CHỈ tác dụng lên loài đi bộ"
        },
        soldier: {
            name: "Tháp Lính 🛡️",
            cost: 120,
            range: 120,
            damage: 18,
            cooldown: 40,
            color: "#22c55e",
            soldierCount: 4,
            description: "Sinh ra 4 chiến binh chặn đường và cản quái đi bộ"
        },
        thunder: {
            name: "Tháp Sấm Sét ⚡",
            cost: 200,
            range: 140,
            damage: 35,
            cooldown: 60,
            color: "#06b6d4",
            unlockLevel: 10,
            description: "Mở khóa cấp 10. Phóng sấm sét giật lan 3 mục tiêu (bay & đi bộ)"
        },
        laser: {
            name: "Tháp Laser 📡",
            cost: 250,
            range: 160,
            damage: 8,
            cooldown: 6,
            color: "#ec4899",
            unlockLevel: 15,
            description: "Mở khóa cấp 15. Bắn tia laser liên tục cực nhanh lên 2 loài"
        },
        poison: {
            name: "Tháp Độc Học 🧪",
            cost: 180,
            range: 130,
            damage: 15,
            cooldown: 45,
            color: "#a855f7",
            unlockLevel: 20,
            poisonDamage: 8,
            poisonDuration: 180,
            description: "Mở khóa cấp 20. Bắn chất độc gây sát thương duy trì theo thời gian"
        },
        fire: {
            name: "Tháp Hỏa Long 🌋",
            cost: 300,
            range: 125,
            damage: 48,
            cooldown: 75,
            color: "#f97316",
            unlockLevel: 25,
            burnDamage: 12,
            burnDuration: 120,
            description: "Mở khóa cấp 25. Bắn dung nham nổ diện rộng đốt cháy quái"
        },
        void: {
            name: "Tháp Vô Cực 🌀",
            cost: 350,
            range: 150,
            damage: 80,
            cooldown: 90,
            color: "#6366f1",
            unlockLevel: 30,
            pullStrength: 1.5,
            description: "Mở khóa cấp 30. Tạo lỗ đen lực hút kéo gom quái và làm chậm cực độ"
        }
    },
    
    // Biến quản lý quái vật nổi giận khi làm sai câu hỏi
    rageTimer: 0,
    isRaged: false,
    
    // Kiểm tra xem vị trí ô lưới (x, y) có hợp lệ để xây tháp không
        skillsConfig: {
        light_warrior: [
            {
                id: 'skill1',
                name: 'Kiếm Khí',
                emoji: '⚔️',
                cost: 35,
                title: 'Kiếm Khí Càn Khôn (Mana: 35) - Phóng kiếm khí gây 250 sát thương lên tất cả quái vật'
            },
            {
                id: 'skill2',
                name: 'Chiến Thần',
                emoji: '🛡️',
                cost: 40,
                title: 'Chiến Thần Hộ Thể (Mana: 40) - Tăng 50% sát thương cho tất cả tháp trong 6 giây'
            },
            {
                id: 'skill3',
                name: 'Quang Minh',
                emoji: '☀️',
                cost: 50,
                title: 'Quang Minh Phán Quyết (Mana: 50) - Cột sáng quang năng tiêu diệt quái dưới 40% HP hoặc gây 500 sát thương'
            }
        ],
        frost_mage: [
            {
                id: 'skill1',
                name: 'Băng Châm',
                emoji: '🌨️',
                cost: 35,
                title: 'Băng Châm Vũ (Mana: 35) - Mưa gai băng làm chậm 50% quái trong 6 giây, gây 120 sát thương'
            },
            {
                id: 'skill2',
                name: 'Băng Phong',
                emoji: '❄️',
                cost: 40,
                title: 'Băng Phong Vạn Lý (Mana: 40) - Đóng băng (choáng) toàn bộ quái trong 5 giây, gây 100 sát thương'
            },
            {
                id: 'skill3',
                name: 'Tuyết Loạn',
                emoji: '🌪️',
                cost: 50,
                title: 'Tuyết Loạn Cuồng Phong (Mana: 50) - Bão tuyết đẩy lùi quái về sau một đoạn, gây 250 sát thương'
            }
        ],
        gold_knight: [
            {
                id: 'skill1',
                name: 'Kim Tiền',
                emoji: '🪙',
                cost: 30,
                title: 'Kim Tiền Nhãn (Mana: 30) - Lập tức nhận 80G vàng để cứu nguy xây tháp'
            },
            {
                id: 'skill2',
                name: 'Hoàng Kim',
                emoji: '🔱',
                cost: 40,
                title: 'Hoàng Kim Giáp (Mana: 40) - Hồi phục 2 máu cho lâu đài chính ngay lập tức'
            },
            {
                id: 'skill3',
                name: 'Tài Lộc',
                emoji: '🎁',
                cost: 50,
                title: 'Tài Lộc Gõ Cửa (Mana: 50) - Nhân đôi lượng vàng rơi ra từ quái vật bị tiêu diệt trong 10 giây'
            }
        ]
    },

    // Vẽ động các nút kỹ năng trong HTML dựa trên Hero được chọn
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = GameConfig;
    if (typeof root !== 'undefined') root.GameConfig = GameConfig;
})(typeof window !== 'undefined' ? window : global);
