/**
 * SKILL CARD & BADGE MODULE
 * Quản lý thẻ năng lực, hệ thống huy hiệu và quy đổi phần thưởng
 */
(function() {
    'use strict';

    const SkillCardModule = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            const tabBtn = document.getElementById('tab-skill-cards');
            if (tabBtn) {
                tabBtn.addEventListener('click', () => this.renderSkillCards());
            }
        },

        renderSkillCards: function() {
            const container = document.getElementById('skill-cards-container');
            if (!container) return;

            const cards = (window.app && window.app.SKILL_CARDS) ? window.app.SKILL_CARDS : [];
            const userBadges = (window.AppState && window.AppState.state && window.AppState.state.badges) ? window.AppState.state.badges : [];

            let html = '<div class="cards-grid">';
            cards.forEach(card => {
                const isUnlocked = userBadges.includes(card.id);
                html += `
                    <div class="skill-card ${isUnlocked ? 'unlocked' : 'locked'}" style="background: ${card.color || '#334155'}">
                        <div class="card-icon">${card.icon || '🏅'}</div>
                        <div class="card-name">${card.name}</div>
                        <div class="card-desc">${card.desc}</div>
                        <div class="card-status">${isUnlocked ? '✅ Đã mở khóa' : '🔒 Chưa đạt'}</div>
                    </div>
                `;
            });
            html += '</div>';
            container.innerHTML = html;
        },

        showBadgePopup: function(badgeId) {
            const popup = document.getElementById('badge-popup');
            if (!popup) return;

            const cards = (window.app && window.app.SKILL_CARDS) ? window.app.SKILL_CARDS : [];
            const badge = cards.find(b => b.id === badgeId) || { name: "Huy hiệu mới", desc: "Chúc mừng con đã đạt thành tích mới!", icon: "🌟" };

            const iconEl = document.getElementById('popup-badge-icon');
            const nameEl = document.getElementById('popup-badge-name');
            const descEl = document.getElementById('popup-badge-desc');

            if (iconEl) iconEl.textContent = badge.icon || '🌟';
            if (nameEl) nameEl.textContent = badge.name;
            if (descEl) descEl.textContent = badge.desc;

            popup.classList.remove('hidden');
        }
    };

    if (typeof window !== 'undefined') {
        window.SkillCardModule = SkillCardModule;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SkillCardModule;
    }
})();
