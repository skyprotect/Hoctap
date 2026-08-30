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
            const timeVal = document.getElementById('eval-time');
            const completedVal = document.getElementById('eval-completed');
            const accuracyVal = document.getElementById('eval-accuracy');
            const streakVal = document.getElementById('eval-streak');

            // 1. Tính tổng thời gian học (phút)
            let totalMinutes = 0;
            if (state.totalStudyMinutes) {
                totalMinutes = state.totalStudyMinutes;
            } else if (state.history && state.history.length > 0) {
                const totalSeconds = state.history.reduce((acc, item) => acc + (item.duration || 60), 0);
                totalMinutes = Math.max(1, Math.round(totalSeconds / 60));
            }
            if (timeVal) timeVal.textContent = totalMinutes + ' phút';

            // 2. Tính số bài đã xong
            const completedCount = (state.history ? state.history.length : 0) || (state.completedLessonTheory ? state.completedLessonTheory.length : 0);
            if (completedVal) completedVal.textContent = completedCount + ' bài';

            // 3. Tính tỉ lệ làm đúng trung bình
            let accuracy = 0;
            if (state.history && state.history.length > 0) {
                const totalAcc = state.history.reduce((acc, item) => {
                    if (typeof item.score === 'number') return acc + item.score;
                    if (item.correctCount && item.totalQuestions) return acc + Math.round((item.correctCount / item.totalQuestions) * 100);
                    return acc;
                }, 0);
                accuracy = Math.round(totalAcc / state.history.length);
            }
            if (accuracyVal) accuracyVal.textContent = accuracy + '%';

            // 4. Chuỗi ngày học
            const streakCount = state.streak || state.englishStreak || 0;
            if (streakVal) streakVal.textContent = streakCount + ' ngày';

            // Fallback hỗ trợ các ID cũ nếu có
            const oldXp = document.getElementById('eval-total-xp');
            const oldStreak = document.getElementById('eval-streak-count');
            const oldCompleted = document.getElementById('eval-completed-lessons');
            if (oldXp) oldXp.textContent = state.xp || 0;
            if (oldStreak) oldStreak.textContent = streakCount;
            if (oldCompleted) oldCompleted.textContent = completedCount;
        },

        loadAiAnalysis: function() {
            const contentBox = document.getElementById('eval-ai-advice') || document.getElementById('evaluation-ai-content');
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
                    contentBox.innerHTML = `<div class="ai-analysis-text" style="white-space: pre-line; line-height: 1.6;">${data.analysis}</div>`;
                } else if (data.error) {
                    contentBox.innerHTML = `<div style="color: #ef4444;">${data.error}</div>`;
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
