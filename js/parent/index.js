/**
 * PARENT PORTAL - MASTER ORCHESTRATOR
 * Điều phối các module quản lý phụ huynh
 */
(function(root) {
    'use strict';
    class ParentDashboard {
        constructor() {
            this.auth = root.ParentAuthController;
            this.chart = root.ParentChartRenderer;
            this.students = root.ParentStudentManager;
            this.history = root.ParentHistoryViewer;
            this.sync = root.ParentRemoteSync;
        }
        init() {
            console.log('[ParentDashboard] Đã khởi tạo hệ thống quản lý phụ huynh.');
            this.refresh();
        }
        refresh() {
            const student = this.students ? this.students.getActiveStudent() : null;
            if (student) {
                const nameEl = document.getElementById('parent-active-student-name');
                if (nameEl) nameEl.innerText = student.name;
            }
        }
    }
    const dashboard = new ParentDashboard();
    if (typeof window !== 'undefined') {
        window.parentDashboard = dashboard;
        document.addEventListener('DOMContentLoaded', () => dashboard.init());
    }
    if (typeof module !== 'undefined' && module.exports) module.exports = dashboard;
})(typeof window !== 'undefined' ? window : global);
