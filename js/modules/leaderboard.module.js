/**
 * LEADERBOARD MODULE
 * Quản lý Bảng Xếp Hạng Tuần/Tháng, Lọc theo môn học (Toán/Tiếng Anh) và Danh sách học sinh trực tuyến
 */
(function() {
    'use strict';

    let currentSubject = 'english';

    const LeaderboardModule = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            // Lắng nghe sự kiện
        },

        openModal: function() {
            const modal = document.getElementById('leaderboard-modal');
            if (modal) {
                modal.classList.remove('hidden');
                this.loadData();
            }
        },

        closeModal: function() {
            const modal = document.getElementById('leaderboard-modal');
            if (modal) modal.classList.add('hidden');
        },

        switchSubject: function(subject) {
            currentSubject = subject || 'english';
            const btns = document.querySelectorAll('.leaderboard-tab-btn');
            btns.forEach(btn => {
                if (btn.getAttribute('data-subject') === currentSubject) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            this.loadData();
        },

        loadData: function() {
            const container = document.getElementById('leaderboard-list-container');
            if (!container) return;

            container.innerHTML = '<div style="text-align: center; padding: 2rem;">Đang tải bảng xếp hạng...</div>';

            fetch(`/api/leaderboard?subject=${encodeURIComponent(currentSubject)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && Array.isArray(data.leaderboard)) {
                        this.renderList(data.leaderboard);
                    } else {
                        container.innerHTML = '<div style="text-align: center; padding: 2rem;">Chưa có dữ liệu xếp hạng</div>';
                    }
                })
                .catch(err => {
                    console.warn("[Leaderboard] Fetch error:", err);
                    container.innerHTML = '<div style="text-align: center; padding: 2rem;">Lỗi tải dữ liệu bảng xếp hạng</div>';
                });
        },

        renderList: function(list) {
            const container = document.getElementById('leaderboard-list-container');
            if (!container) return;

            if (list.length === 0) {
                container.innerHTML = '<div style="text-align: center; padding: 2rem;">Chưa có lượt xếp hạng nào</div>';
                return;
            }

            container.innerHTML = list.map((item, index) => {
                const rank = index + 1;
                let medal = rank;
                if (rank === 1) medal = '🥇';
                else if (rank === 2) medal = '🥈';
                else if (rank === 3) medal = '🥉';

                const xpVal = currentSubject === 'math' ? (item.mathXp || 0) : (item.englishXp || item.xp || 0);

                return `
                    <div class="leaderboard-item rank-${rank}">
                        <div class="leaderboard-rank">${medal}</div>
                        <div class="leaderboard-avatar">${(item.studentName || 'HS').substring(0, 2).toUpperCase()}</div>
                        <div class="leaderboard-info">
                            <div class="leaderboard-name">${item.studentName || 'Học sinh'}</div>
                            <div class="leaderboard-class">Lớp ${item.classLevel || '6'}</div>
                        </div>
                        <div class="leaderboard-xp">${xpVal} XP</div>
                    </div>
                `;
            }).join('');
        },

        togglePresenceSidebar: function() {
            const sidebar = document.getElementById('online-presence-sidebar');
            if (sidebar) sidebar.classList.toggle('hidden');
        }
    };

    if (typeof window !== 'undefined') {
        window.LeaderboardModule = LeaderboardModule;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = LeaderboardModule;
    }
})();
