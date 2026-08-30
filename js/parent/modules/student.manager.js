/**
 * PARENT PORTAL - STUDENT MANAGER
 * Quản lý danh sách 3 học sinh chuẩn (Bình Minh, Đức Phúc, Bảo Ngọc) theo Rule 14
 */
(function(root) {
    'use strict';
    const StudentManager = {
        students: [
            { id: "std_htsj4gbmo", name: "Trần Bình Minh", classLevel: "6", parentEmail: "skyprotect@gmail.com" },
            { id: "std_baongoc", name: "Trần Bảo Ngọc", classLevel: "1", parentEmail: "skyprotect@gmail.com" },
            { id: "std_tyc0gfnkz", name: "Trần Đức Phúc", classLevel: "4", parentEmail: "nhematseo@gmail.com" }
        ],
        getActiveStudent: function() {
            const id = localStorage.getItem('parent_active_student_id') || 'std_htsj4gbmo';
            return this.students.find(s => s.id === id) || this.students[0];
        },
        setActiveStudent: function(studentId) {
            localStorage.setItem('parent_active_student_id', studentId);
            if (typeof window !== 'undefined' && window.parentDashboard) {
                window.parentDashboard.refresh();
            }
        }
    };
    if (typeof window !== 'undefined') window.ParentStudentManager = StudentManager;
    if (typeof module !== 'undefined' && module.exports) module.exports = StudentManager;
})(typeof window !== 'undefined' ? window : global);
