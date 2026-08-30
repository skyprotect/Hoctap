/**
 * GAME ENGINE - HERO SUBSYSTEM
 */
(function(root) {
    'use strict';

    const HeroSystem = {
        getHeroMultipliers: function() {
        return this.getHeroMultipliersForId(this.hero ? this.hero.selectedId : null, this.hero ? this.hero.level : 1);
    },

    // Lấy hệ số nhân của một anh hùng cụ thể dựa trên ID và cấp độ
    getHeroMultipliersForId: function(heroId, level = 1) {
        const mult = {
            damage: 1.0,
            range: 1.0,
            cost: 1.0,
            gold: 1.0,
            slowDuration: 1.0
        };
        
        if (heroId) {
            if (heroId === 'light_warrior') {
                mult.damage = 1.15 + (level - 1) * 0.05; // +15% sát thương + 5% mỗi cấp
            } else if (heroId === 'frost_mage') {
                mult.range = 1.15 + (level - 1) * 0.03; // +15% tầm bắn + 3% mỗi cấp
                mult.slowDuration = 1.20; // Tăng 20% làm chậm
            } else if (heroId === 'gold_knight') {
                mult.cost = Math.max(0.7, 0.9 - (level - 1) * 0.01); // giảm 10% giá + 1% mỗi cấp, max giảm 30%
                mult.gold = 1.20 + (level - 1) * 0.04; // tăng 20% vàng + 4% mỗi cấp
            }
        }
        return mult;
    },

    // Cập nhật lại chỉ số (sát thương, tầm bắn, làm chậm) của các tháp hiện có khi đổi anh hùng
    updateExistingTowersStats: function(oldHeroId, newHeroId) {
        const level = this.hero ? this.hero.level : 1;
        const oldMult = this.getHeroMultipliersForId(oldHeroId, level);
        const newMult = this.getHeroMultipliersForId(newHeroId, level);
        
        const damageRatio = newMult.damage / oldMult.damage;
        const rangeRatio = newMult.range / oldMult.range;
        const slowRatio = newMult.slowDuration / oldMult.slowDuration;
        
        this.towers.forEach(t => {
            t.damage = Math.round(t.damage * damageRatio);
            t.range = Math.round(t.range * rangeRatio);
            if (t.slowDuration) {
                t.slowDuration = Math.round(t.slowDuration * slowRatio);
            }
        });
    },

    // Vẽ động các nút tháp canh phòng thủ dựa theo cấp độ của Siêu Anh Hùng,
        openHeroSelectorInGame: function() {
        const wasPlaying = this.isPlaying;
        
        // Tạm dừng game để bé chọn anh hùng không bị quái đánh mất máu
        this.isPlaying = false;
        
        // Đăng ký hàm toàn cục xử lý sự kiện chọn hero
        window.selectTdHeroInGame = (heroId) => {
            const oldHeroId = this.hero ? this.hero.selectedId : null;
            if (this.hero) {
                this.hero.load();
                this.hero.selectedId = heroId;
                this.hero.save();
            }
            
            // Cập nhật chỉ số tháp canh hiện có tương ứng với hero mới
            this.updateExistingTowersStats(oldHeroId, heroId);
            
            Swal.close();
            
            // Hiện chữ nổi thông báo siêu anh hùng xuất trận
            const heroName = this.hero.registry[heroId].name;
            const heroEmoji = this.hero.registry[heroId].emoji;
            this.spawnPopup(880, 240, `✨ ${heroEmoji} ${heroName} xuất trận!`, "#fbbf24", 16);
            
            // Tiếp tục game
            this.isPlaying = wasPlaying;
            if (this.isPlaying) {
                if (this.animationFrame) {
                    cancelAnimationFrame(this.animationFrame);
                }
                this.lastTime = performance.now();
                this.accumulator = 0;
                this.loop();
            }
        };

        const currentSelectedId = this.hero ? this.hero.selectedId : null;

        Swal.fire({
            title: 'Chọn Siêu Anh Hùng Hộ Vệ 🏰',
            html: `<p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1.2rem;">Hãy chọn một siêu anh hùng làm hộ vệ cho Lâu đài Hoàng gia nhé!</p>
                   <div class="hero-selector-container" style="display:flex; justify-content:space-around; gap:10px; margin-top:0.5rem;">
                     <div class="hero-card" id="btn-select-in-light-warrior" style="border: 2px solid ${currentSelectedId === 'light_warrior' ? '#fbbf24' : 'var(--border-color)'}; border-radius: 12px; padding: 15px; cursor: pointer; width: 31%; transition: all 0.3s; background: ${currentSelectedId === 'light_warrior' ? 'rgba(251, 191, 36, 0.08)' : 'rgba(255,255,255,0.02)'}; display:flex; flex-direction:column; align-items:center;">
                         <div style="font-size: 2.5rem; margin-bottom: 8px;">⚔️</div>
                         <div style="font-weight: bold; color: var(--text-main); margin-bottom: 5px; font-size:0.95rem; text-align:center;">Chiến Binh Ánh Sáng</div>
                         <div style="font-size: 0.72rem; color: var(--text-muted); text-align:center; line-height:1.4;">Tăng +15% sát thương tháp (+5%/cấp)</div>
                     </div>
                     <div class="hero-card" id="btn-select-in-frost-mage" style="border: 2px solid ${currentSelectedId === 'frost_mage' ? '#fbbf24' : 'var(--border-color)'}; border-radius: 12px; padding: 15px; cursor: pointer; width: 31%; transition: all 0.3s; background: ${currentSelectedId === 'frost_mage' ? 'rgba(251, 191, 36, 0.08)' : 'rgba(255,255,255,0.02)'}; display:flex; flex-direction:column; align-items:center;">
                         <div style="font-size: 2.5rem; margin-bottom: 8px;">❄️</div>
                         <div style="font-weight: bold; color: var(--text-main); margin-bottom: 5px; font-size:0.95rem; text-align:center;">Pháp Sư Băng Giá</div>
                         <div style="font-size: 0.72rem; color: var(--text-muted); text-align:center; line-height:1.4;">Tăng +15% tầm bắn tháp (+3%/cấp) và làm chậm</div>
                     </div>
                     <div class="hero-card" id="btn-select-in-gold-knight" style="border: 2px solid ${currentSelectedId === 'gold_knight' ? '#fbbf24' : 'var(--border-color)'}; border-radius: 12px; padding: 15px; cursor: pointer; width: 31%; transition: all 0.3s; background: ${currentSelectedId === 'gold_knight' ? 'rgba(251, 191, 36, 0.08)' : 'rgba(255,255,255,0.02)'}; display:flex; flex-direction:column; align-items:center;">
                         <div style="font-size: 2.5rem; margin-bottom: 8px;">🪙</div>
                         <div style="font-weight: bold; color: var(--text-main); margin-bottom: 5px; font-size:0.95rem; text-align:center;">Thần Tài Chiêu Lộc</div>
                         <div style="font-size: 0.72rem; color: var(--text-muted); text-align:center; line-height:1.4;">Giảm -10% giá xây tháp và nhận +20% vàng (+4%/cấp)</div>
                     </div>
                   </div>`,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Đóng',
            target: document.getElementById('tab-practice') || 'body',
            customClass: {
                popup: 'hero-select-popup'
            },
            didOpen: () => {
                const container = typeof Swal.getHtmlContainer === 'function' ? Swal.getHtmlContainer() : document;
                const cardLight = container.querySelector("#btn-select-in-light-warrior");
                const cardFrost = container.querySelector("#btn-select-in-frost-mage");
                const cardGold = container.querySelector("#btn-select-in-gold-knight");

                if (cardLight) cardLight.onclick = () => window.selectTdHeroInGame("light_warrior");
                if (cardFrost) cardFrost.onclick = () => window.selectTdHeroInGame("frost_mage");
                if (cardGold) cardGold.onclick = () => window.selectTdHeroInGame("gold_knight");
            },
            willClose: () => {
                // Đảm bảo game chạy tiếp nếu bé đóng popup mà không chọn
                if (!this.isPlaying) {
                    this.isPlaying = wasPlaying;
                    if (this.isPlaying) {
                        if (this.animationFrame) {
                            cancelAnimationFrame(this.animationFrame);
                        }
                        this.lastTime = performance.now();
                        this.accumulator = 0;
                        this.loop();
                    }
                }
            }
        });
    },
    
    // Bắt đầu đợt quái do người chơi nhấn nút
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = HeroSystem;
    if (typeof root !== 'undefined') root.HeroSystem = HeroSystem;
})(typeof window !== 'undefined' ? window : global);
