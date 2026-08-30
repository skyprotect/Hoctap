/**
 * GRADE 6 MATH - HERO RPG PROGRESS SYSTEM
 */
(function(root) {
    'use strict';

    const MathHero = {
        hero: {
        selectedId: null, // null | 'light_warrior' | 'frost_mage' | 'gold_knight'
        level: 1,
        xp: 0,
        nextLevelXp: 100,
        
        // Cấu hình các hero
        registry: {
            'light_warrior': {
                name: 'Chiến Binh Ánh Sáng',
                emoji: '⚔️',
                description: 'Tăng sức tấn công tháp canh (+15% sát thương + 5% mỗi cấp Hero)'
            },
            'frost_mage': {
                name: 'Pháp Sư Băng Giá',
                emoji: '❄️',
                description: 'Tăng tầm bắn tháp (+15% tầm bắn + 3% mỗi cấp) và làm chậm lâu hơn 20%'
            },
            'gold_knight': {
                name: 'Thần Tài Chiêu Lộc',
                emoji: '🪙',
                description: 'Giảm giá xây tháp 10% (+1% mỗi cấp) và nhận thêm 20% vàng (+4% mỗi cấp)'
            }
        },

        load: function() {
            try {
                const data = localStorage.getItem('td_hero_data');
                if (data) {
                    const parsed = JSON.parse(data);
                    if (parsed.selectedId && this.registry && this.registry[parsed.selectedId]) {
                        this.selectedId = parsed.selectedId;
                    } else {
                        this.selectedId = null;
                    }
                    this.level = parsed.level || 1;
                    this.xp = parsed.xp || 0;
                    this.nextLevelXp = parsed.nextLevelXp || 100;
                } else {
                    this.selectedId = null;
                }
            } catch (e) {
                console.error("Lỗi nạp dữ liệu Hero:", e);
                this.selectedId = null;
            }
        },

        save: function() {
            try {
                const data = {
                    selectedId: this.selectedId,
                    level: this.level,
                    xp: this.xp,
                    nextLevelXp: this.nextLevelXp
                };
                localStorage.setItem('td_hero_data', JSON.stringify(data));
            } catch (e) {
                console.error("Lỗi lưu dữ liệu Hero:", e);
            }
        },

        addXp: function(amount) {
            if (!this.selectedId) return;
            this.xp = Math.max(0, this.xp + amount);
            
            // Xử lý lên cấp
            let leveledUp = false;
            while (this.xp >= this.nextLevelXp) {
                this.xp -= this.nextLevelXp;
                this.level++;
                this.nextLevelXp = this.level * 100;
                leveledUp = true;
            }
            
            this.save();
            
            if (leveledUp) {
                // Hiển thị hiệu ứng chúc mừng lên cấp hoành tráng
                setTimeout(() => {
                    if (window.app && app.audio) app.audio.playVictory();
                    Swal.fire({
                        title: 'TĂNG CẤP ANH HÙNG! 🎉',
                        html: `<div style="font-size: 3.5rem; margin-bottom: 1rem;">${this.registry[this.selectedId].emoji}</div>
                               <p>Chúc mừng con! Siêu Anh Hùng <b>${this.registry[this.selectedId].name}</b> đã tăng lên <b>Cấp ${this.level}</b>!</p>
                               <p style="color:var(--success); font-weight:bold; margin-top:0.5rem;">Sức mạnh phòng thủ và khả năng của các tháp canh đã được nâng cấp vĩnh viễn!</p>`,
                        confirmButtonText: 'Tuyệt quá, tiếp tục thôi!',
                        confirmButtonColor: 'var(--success)',
                        target: document.getElementById('tab-practice') || 'body',
                        allowOutsideClick: false
                    });
                }, 800);
            }
        },

        downgrade: function() {
            if (!this.selectedId) return false;
            if (this.level > 1) {
                this.level--;
                this.xp = 0;
                this.nextLevelXp = this.level * 100;
                this.save();
                return true;
            }
            return false;
        }
    },
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = MathHero;
    if (typeof root !== 'undefined') root.MathHero = MathHero;
})(typeof window !== 'undefined' ? window : global);
