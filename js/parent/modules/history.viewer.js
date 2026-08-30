/**
 * PARENT PORTAL - HISTORY VIEWER
 * Xem lại lịch sử làm bài thi, phân tích sai sót từng câu hỏi
 */
(function(root) {
    'use strict';
    const HistoryViewer = {
        async loadHistory(studentId) {
            try {
                const res = await fetch(`/api/progress/history?student_id=${studentId}`);
                if (res.ok) return await res.json();
            } catch (e) {}
            return [];
        },
        renderHistoryList(containerId, historyItems) {
            const container = document.getElementById(containerId);
            if (!container) return;
            if (!historyItems || historyItems.length === 0) {
                container.innerHTML = '<p class="text-slate-400 text-center py-6">Chưa có bài thi nào được ghi nhận.</p>';
                return;
            }
            container.innerHTML = historyItems.map(item => `
                <div class="p-3 mb-2 rounded-lg bg-slate-800 border border-slate-700 flex justify-between items-center">
                    <div>
                        <div class="font-bold text-white">${item.lessonTitle || 'Bài luyện tập'}</div>
                        <div class="text-xs text-slate-400">${item.date || 'Hôm nay'} • ${item.score}/10 điểm</div>
                    </div>
                    <span class="px-2.5 py-1 text-xs font-bold rounded-full ${item.score >= 8 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}">
                        ${item.score >= 8 ? 'Đạt' : 'Cần cố gắng'}
                    </span>
                </div>
            `).join('');
        }
    };
    if (typeof window !== 'undefined') window.ParentHistoryViewer = HistoryViewer;
    if (typeof module !== 'undefined' && module.exports) module.exports = HistoryViewer;
})(typeof window !== 'undefined' ? window : global);
