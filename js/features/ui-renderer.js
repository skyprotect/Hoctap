/**
 * UI RENDERER SERVICE
 * Quản lý vẽ và cập nhật các thành phần giao diện DOM chính
 */
(function() {
    'use strict';

    const UiRenderer = {
        updateStatsDisplay: function(state) {
            if (!state) return;
            const xpEl = document.getElementById('user-xp');
            if (xpEl) xpEl.innerText = (state.xp || 0) + ' XP';

            const streakEl = document.getElementById('user-streak');
            if (streakEl) streakEl.innerText = (state.streak || 0) + ' ngày';
        },

        renderAlert: function(title, text, icon = 'info') {
            if (typeof Swal !== 'undefined' && typeof Swal.fire === 'function') {
                return Swal.fire({
                    title: title,
                    text: text,
                    icon: icon,
                    confirmButtonColor: 'var(--primary)'
                });
            } else {
                alert(title + '\n' + text);
                return Promise.resolve();
            }
        }
    };

    if (typeof window !== 'undefined') {
        window.UiRenderer = UiRenderer;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = UiRenderer;
    }
})();
