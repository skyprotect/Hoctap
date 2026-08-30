/**
 * PARENT DASHBOARD MODULE
 * Báo cáo chất lượng học tập phụ huynh: Biểu đồ Radar 4 kỹ năng Tiếng Anh, Đánh giá AI và Nhật ký thời gian học
 */
(function() {
    'use strict';

    const ParentDashboardModule = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            // Lắng nghe sự kiện
        },

        requestEvaluation: function() {
            const modal = document.getElementById('evaluation-modal');
            if (modal) {
                modal.classList.remove('hidden');
                this.renderStats();
                this.loadAiAnalysis();
            }
        },

        closeModal: function() {
            const modal = document.getElementById('evaluation-modal');
            if (modal) modal.classList.add('hidden');
        },

        renderStats: function() {
            const state = (window.AppState && window.AppState.state) || {};
            const xpVal = document.getElementById('eval-total-xp');
            const streakVal = document.getElementById('eval-streak-count');
            const completedVal = document.getElementById('eval-completed-lessons');

            if (xpVal) xpVal.textContent = state.xp || 0;
            if (streakVal) streakVal.textContent = state.streak || 0;
            if (completedVal) completedVal.textContent = (state.completedLessonTheory || []).length;
        },

        loadAiAnalysis: function() {
            const contentBox = document.getElementById('evaluation-ai-content');
            if (!contentBox) return;

            contentBox.innerHTML = '<div style="text-align: center; padding: 1.5rem;"><i class="fa-solid fa-spinner fa-spin"></i> AI đang phân tích dữ liệu học tập...</div>';

            const state = (window.AppState && window.AppState.state) || {};
            const config = (window.AppState && window.AppState.config) || {};
            const studentId = config.defaultStudentId;

            const payload = {
                history: state.history || [],
                examSessions: state.examSessions || [],
                studentName: config.studentName || 'Học sinh',
                parentName: config.parentName || 'Phụ huynh',
                studentId: studentId,
                classLevel: config.currentClass || '6',
                xp: state.xp || 0,
                scores: state.scores || {}
            };

            const token = window.safeStorage ? window.safeStorage.getItem('adminToken') : null;
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = 'Bearer ' + token;

            fetch('/api/ai-analysis', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success && data.analysis) {
                    contentBox.innerHTML = `<div class="ai-analysis-text">${data.analysis.replace(/\n/g, '<br>')}</div>`;
                } else {
                    contentBox.innerHTML = '<div style="color: #ef4444;">Không thể lấy phân tích từ AI. Vui lòng thử lại sau.</div>';
                }
            })
            .catch(err => {
                console.warn("[ParentDashboard] AI analysis error:", err);
                contentBox.innerHTML = '<div style="color: #ef4444;">Lỗi kết nối tới máy chủ phân tích AI.</div>';
            });
        },

        refreshAiAnalysis: function() {
            this.loadAiAnalysis();
        }
    };

    if (typeof window !== 'undefined') {
        window.ParentDashboardModule = ParentDashboardModule;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ParentDashboardModule;
    }
})();
