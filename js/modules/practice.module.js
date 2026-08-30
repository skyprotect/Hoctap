/**
 * PRACTICE MODULE
 * Quản lý chế độ luyện tập, chọn cấp độ bài làm và điều phối phiên làm bài
 */
(function() {
    'use strict';

    const PracticeModule = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            // Lắng nghe các sự kiện bắt đầu luyện tập nếu có
        },

        selectLevel: function(levelKey) {
            if (window.app && typeof window.app.startPracticeWithLevel === 'function') {
                window.app.startPracticeWithLevel(levelKey);
            }
        },

        renderLevelDashboard: function(lessonId) {
            const dashboardBox = document.getElementById('practice-levels-dashboard-box');
            if (!dashboardBox) return;

            const state = window.AppState ? window.AppState.state : {};
            const scores = (state && state.scores) ? state.scores : {};
            const lessonScore = scores[lessonId] || 0;

            dashboardBox.innerHTML = `
                <div class="practice-header">
                    <h3>🎯 Luyện tập theo cấp độ</h3>
                    <p>Điểm cao nhất hiện tại: <strong>${lessonScore}%</strong></p>
                </div>
                <div class="levels-grid">
                    <button class="level-card level-easy" onclick="PracticeModule.selectLevel('co-ban')">
                        <div class="level-icon">🟢</div>
                        <div class="level-title">Cơ bản</div>
                        <div class="level-desc">Nhận biết & Thông hiểu</div>
                    </button>
                    <button class="level-card level-medium" onclick="PracticeModule.selectLevel('nang-cao')">
                        <div class="level-icon">🟡</div>
                        <div class="level-title">Nâng cao</div>
                        <div class="level-desc">Vận dụng logic</div>
                    </button>
                    <button class="level-card level-hard" onclick="PracticeModule.selectLevel('kho')">
                        <div class="level-icon">🔴</div>
                        <div class="level-title">Thử thách</div>
                        <div class="level-desc">Vận dụng cao & Điểm 10</div>
                    </button>
                </div>
            `;
        }
    };

    if (typeof window !== 'undefined') {
        window.PracticeModule = PracticeModule;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = PracticeModule;
    }
})();
