/**
 * PARENT PORTAL - STUDENT MANAGER SERVICE
 * Quản lý 3 học sinh chuẩn (Bình Minh, Đức Phúc, Bảo Ngọc) theo Rule 14
 */
(function(root) {
    'use strict';
    const ParentStudentManager = {
        students: [
            { id: "std_htsj4gbmo", name: "Trần Bình Minh", classLevel: "6" },
            { id: "std_baongoc", name: "Trần Bảo Ngọc", classLevel: "1" },
            { id: "std_tyc0gfnkz", name: "Trần Đức Phúc", classLevel: "4" }
        ],
        getCurrentStudent: function() {
            const id = localStorage.getItem('parent_active_student_id') || 'std_htsj4gbmo';
            return this.students.find(s => s.id === id) || this.students[0];
        },
        setCurrentStudent: function(studentId) {
            localStorage.setItem('parent_active_student_id', studentId);
        }
    };
    if (typeof window !== 'undefined') window.ParentStudentManager = ParentStudentManager;
    if (typeof module !== 'undefined' && module.exports) module.exports = ParentStudentManager;
})(typeof window !== 'undefined' ? window : global);
