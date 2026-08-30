/**
 * PARENT PORTAL - CHART RENDERER
 * Vẽ biểu đồ năng lực học tập, thời gian học, điểm yếu (Chart.js)
 */
(function(root) {
    'use strict';
    const ChartRenderer = {
        charts: {},
        renderProgressChart: function(canvasId, labels, data) {
            if (typeof Chart === 'undefined') return null;
            const ctx = document.getElementById(canvasId);
            if (!ctx) return null;
            if (this.charts[canvasId]) this.charts[canvasId].destroy();
            this.charts[canvasId] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels || ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                    datasets: [{
                        label: 'Số câu đúng',
                        data: data || [15, 20, 25, 18, 30, 40, 35],
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
            return this.charts[canvasId];
        }
    };
    if (typeof window !== 'undefined') window.ParentChartRenderer = ChartRenderer;
    if (typeof module !== 'undefined' && module.exports) module.exports = ChartRenderer;
})(typeof window !== 'undefined' ? window : global);
