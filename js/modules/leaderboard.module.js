/**
 * LEADERBOARD MODULE
 * Quản lý bảng xếp hạng học sinh, đồng bộ realtime và hiển thị thứ hạng theo môn học
 */
(function() {
    'use strict';

    const LeaderboardModule = {
        currentSubject: 'english',

        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            const mathTab = document.getElementById('tab-leaderboard-math');
            const engTab = document.getElementById('tab-leaderboard-eng');

            if (mathTab) {
                mathTab.addEventListener('click', () => {
                    this.currentSubject = 'math';
                    this.loadLeaderboard('math');
                });
            }
            if (engTab) {
                engTab.addEventListener('click', () => {
                    this.currentSubject = 'english';
                    this.loadLeaderboard('english');
                });
            }
        },

        loadLeaderboard: async function(subject = 'english') {
            const container = document.getElementById('leaderboard-list-container');
            if (!container) return;

            container.innerHTML = '<div class="loading-spinner">Đang tải bảng xếp hạng...</div>';

            try {
                const res = await fetch(`/api/leaderboard?subject=${subject}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                this.render(data.leaderboard || [], subject);
            } catch (err) {
                console.error("Lỗi nạp bảng xếp hạng:", err);
                container.innerHTML = '<div class="error-msg">Không thể tải bảng xếp hạng lúc này. Vui lòng thử lại sau!</div>';
            }
        },

        render: function(list, subject) {
            const container = document.getElementById('leaderboard-list-container');
            if (!container) return;

            if (!list || list.length === 0) {
                container.innerHTML = '<div class="empty-msg">Chưa có dữ liệu xếp hạng. Hãy là người đầu tiên ghi điểm!</div>';
                return;
            }

            let html = '<div class="leaderboard-table">';
            list.forEach((item, index) => {
                const rank = index + 1;
                let rankBadge = `${rank}`;
                if (rank === 1) rankBadge = '🥇';
                else if (rank === 2) rankBadge = '🥈';
                else if (rank === 3) rankBadge = '🥉';

                const xp = subject === 'math' ? (item.mathXp || 0) : (item.englishXp || 0);
                const streak = subject === 'math' ? (item.mathStreak || 0) : (item.englishStreak || 0);

                html += `
                    <div class="leaderboard-row ${rank <= 3 ? 'top-' + rank : ''}">
                        <div class="rank-badge">${rankBadge}</div>
                        <div class="student-info">
                            <span class="student-name">${item.studentName || 'Học sinh'}</span>
                            <span class="class-badge">Lớp ${item.classLevel || '6'}</span>
                        </div>
                        <div class="stats">
                            <span class="xp-val">⚡ ${xp} XP</span>
                            <span class="streak-val">🔥 ${streak} ngày</span>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            container.innerHTML = html;
        }
    };

    if (typeof window !== 'undefined') {
        window.LeaderboardModule = LeaderboardModule;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = LeaderboardModule;
    }
})();
