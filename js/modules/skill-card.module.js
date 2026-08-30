/**
 * SKILL CARD MODULE
 * Quản lý bộ sưu tập 50 Thẻ Năng Lực, 30 Huy Hiệu, Mạ vàng thẻ và Cửa hàng đổi thưởng giờ chơi PC/Tablet
 */
(function() {
    'use strict';

    const SkillCardModule = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            if (window.EventBus) {
                window.EventBus.on('badges:unlocked', () => this.renderCards());
            }
        },

        openBadgesModal: function() {
            const modal = document.getElementById('badges-modal');
            if (modal) {
                modal.classList.remove('hidden');
                this.renderBadges();
            }
        },

        closeBadgesModal: function() {
            const modal = document.getElementById('badges-modal');
            if (modal) modal.classList.add('hidden');
        },

        openShopModal: function() {
            const modal = document.getElementById('math-shop-modal') || document.getElementById('shop-modal');
            if (modal) modal.classList.remove('hidden');
        },

        closeShopModal: function() {
            const modal = document.getElementById('math-shop-modal') || document.getElementById('shop-modal');
            if (modal) modal.classList.add('hidden');
        },

        renderBadges: function() {
            const container = document.getElementById('badges-grid-container');
            if (!container) return;

            const allBadges = (window.GamificationService && window.GamificationService.getBadges()) || [];
            const state = (window.AppState && window.AppState.state) || {};
            const unlocked = state.badges || [];

            container.innerHTML = allBadges.map(b => `
                <div class="badge-card ${unlocked.includes(b.id) ? 'unlocked' : 'locked'}">
                    <div class="badge-icon">${b.icon}</div>
                    <div class="badge-name">${b.name}</div>
                    <div class="badge-desc">${b.desc}</div>
                </div>
            `).join('');
        },

        renderCards: function() {
            const container = document.getElementById('skill-cards-grid');
            if (!container) return;

            const allCards = (window.GamificationService && window.GamificationService.getSkillCards()) || [];
            const state = (window.AppState && window.AppState.state) || {};
            const unlocked = state.badges || [];

            container.innerHTML = allCards.map(c => `
                <div class="skill-card-item ${unlocked.includes(c.id) ? 'unlocked' : 'locked'}" style="background: ${c.color}">
                    <div class="skill-card-icon">${c.icon}</div>
                    <div class="skill-card-title">${c.name}</div>
                    <div class="skill-card-desc">${c.desc}</div>
                </div>
            `).join('');
        },

        exchangePcPlay: function(minutes) {
            const state = (window.AppState && window.AppState.state) || {};
            const cost = minutes * 50; // 50 XP mỗi phút
            if ((state.xp || 0) < cost) {
                if (typeof Swal !== 'undefined') {
                    Swal.fire('Chưa đủ XP', `Bạn cần tối thiểu ${cost} XP để đổi ${minutes} phút chơi PC!`, 'warning');
                } else {
                    alert(`Bạn cần tối thiểu ${cost} XP để đổi ${minutes} phút chơi PC!`);
                }
                return;
            }

            state.xp -= cost;
            if (window.app && typeof window.app.saveProgress === 'function') {
                window.app.saveProgress();
            }

            if (typeof Swal !== 'undefined') {
                Swal.fire('Đổi thưởng thành công', `Đã đổi thành công ${minutes} phút chơi PC!`, 'success');
            } else {
                alert(`Đã đổi thành công ${minutes} phút chơi PC!`);
            }
        },

        exchangeTabletPlay: function(minutes) {
            const config = (window.AppState && window.AppState.config) || {};
            const studentId = config.defaultStudentId || 'std_htsj4gbmo';

            fetch('/api/tablet/generate-token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentId, minutes })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    if (typeof Swal !== 'undefined') {
                        Swal.fire('Mã Token Tablet', `Mã mở khóa Tablet của bạn: <strong style="font-size: 1.5rem; color: #10b981;">${data.token}</strong> (${minutes} phút)`, 'success');
                    } else {
                        alert(`Mã Token Tablet của bạn: ${data.token} (${minutes} phút)`);
                    }
                }
            })
            .catch(err => {
                console.error("[SkillCard] Token generate error:", err);
            });
        }
    };

    if (typeof window !== 'undefined') {
        window.SkillCardModule = SkillCardModule;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SkillCardModule;
    }
})();
