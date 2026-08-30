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
            const modal = document.getElementById('evaluation-modal');
            if (!modal) return;

            // Nút X đóng modal
            const closeX = modal.querySelector('.btn-close-modal') || document.getElementById('btn-eval-close-x');
            if (closeX) {
                closeX.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeModal();
                });
            }

            // Nút Đóng trong footer
            const closeBtn = document.getElementById('btn-eval-close') || Array.from(modal.querySelectorAll('button')).find(b => b.textContent.trim() === 'Đóng');
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.closeModal();
                });
            }

            // Nút Cập nhật nhận xét AI
            const refreshBtn = document.getElementById('btn-eval-refresh-ai');
            if (refreshBtn) {
                refreshBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.refreshAiAnalysis();
                });
            }

            // Click vùng Backdrop
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        },

        activeRequestId: 0,
        currentAbortController: null,

        requestEvaluation: function() {
            const modal = document.getElementById('evaluation-modal');
            if (modal) {
                modal.style.removeProperty('display');
                modal.classList.remove('hidden');
                this.renderStats();
                this.loadAiAnalysis();
            }
        },

        closeModal: function() {
            const modal = document.getElementById('evaluation-modal');
            if (modal) {
                modal.classList.add('hidden');
                modal.style.setProperty('display', 'none', 'important');
            }
            if (this.currentAbortController) {
                this.currentAbortController.abort();
                this.currentAbortController = null;
            }
            const refreshBtn = document.getElementById('btn-eval-refresh-ai');
            if (refreshBtn) refreshBtn.disabled = false;
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

            // Hủy request trước đó nếu đang chạy (Chống race condition)
            if (this.currentAbortController) {
                this.currentAbortController.abort();
            }
            const currentReqId = ++this.activeRequestId;
            const controller = new AbortController();
            this.currentAbortController = controller;

            const refreshBtn = document.getElementById('btn-eval-refresh-ai');
            if (refreshBtn) refreshBtn.disabled = true;

            contentBox.innerHTML = '<div style="text-align: center; padding: 1.5rem; color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin" style="margin-right: 0.5rem; color: var(--primary);"></i> AI đang phân tích dữ liệu học tập...</div>';

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

            const timeoutId = setTimeout(() => controller.abort(), 20000);

            fetch('/api/ai-analysis', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload),
                signal: controller.signal
            })
            .then(async res => {
                clearTimeout(timeoutId);
                const data = await res.json().catch(() => ({ error: 'Không thể đọc phản hồi từ máy chủ' }));
                if (currentReqId !== this.activeRequestId) return; // Bỏ qua response cũ

                if (refreshBtn) refreshBtn.disabled = false;

                if (res.ok && data.success && data.analysis) {
                    contentBox.innerHTML = `<div class="ai-analysis-text" style="white-space: pre-line; line-height: 1.6;">${data.analysis}</div>`;
                } else if (data && data.error) {
                    contentBox.innerHTML = `<div style="color: #ef4444; padding: 0.8rem; background: rgba(239, 68, 68, 0.08); border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.2);"><i class="fa-solid fa-triangle-exclamation" style="margin-right: 0.4rem;"></i> ${data.error}</div>`;
                } else {
                    contentBox.innerHTML = '<div style="color: #ef4444; padding: 0.8rem; background: rgba(239, 68, 68, 0.08); border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.2);"><i class="fa-solid fa-triangle-exclamation" style="margin-right: 0.4rem;"></i> Không thể lấy phân tích từ AI. Vui lòng thử lại sau.</div>';
                }
            })
            .catch(err => {
                clearTimeout(timeoutId);
                if (currentReqId !== this.activeRequestId) return; // Bỏ qua nếu đã có request mới

                if (refreshBtn) refreshBtn.disabled = false;

                if (err.name === 'AbortError') {
                    // Do người dùng đóng modal hoặc timeout
                    if (document.getElementById('evaluation-modal')?.classList.contains('hidden')) return;
                    contentBox.innerHTML = '<div style="color: #ef4444; padding: 0.8rem; background: rgba(239, 68, 68, 0.08); border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.2);"><i class="fa-solid fa-clock" style="margin-right: 0.4rem;"></i> Quá thời gian chờ máy chủ phản hồi (Timeout). Vui lòng thử lại.</div>';
                } else {
                    console.warn("[ParentDashboard] AI analysis error:", err);
                    contentBox.innerHTML = '<div style="color: #ef4444; padding: 0.8rem; background: rgba(239, 68, 68, 0.08); border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.2);"><i class="fa-solid fa-triangle-exclamation" style="margin-right: 0.4rem;"></i> Lỗi kết nối tới máy chủ phân tích AI.</div>';
                }
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
