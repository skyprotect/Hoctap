/**
 * STUDENT SELECT MODULE
 * Quản lý chuyển đổi hồ sơ học sinh (Bình Minh, Bảo Ngọc, Đức Phúc), Màn hình thiết lập ban đầu và Xác thực PIN
 */
(function() {
    'use strict';

    const SYSTEM_STUDENTS = [
        { id: "std_htsj4gbmo", name: "Trần Bình Minh", parentName: "Phụ huynh", classLevel: "6" },
        { id: "std_baongoc", name: "Trần Bảo Ngọc", parentName: "Phụ huynh", classLevel: "1" },
        { id: "std_tyc0gfnkz", name: "Trần Đức Phúc", parentName: "Phụ huynh", classLevel: "4" }
    ];

    const StudentSelectModule = {
        init: function() {
            this.renderStudentList();
        },

        getSystemStudents: function() {
            return SYSTEM_STUDENTS;
        },

        selectStudent: function(studentId) {
            const config = (window.AppState && window.AppState.config) || {};
            const students = config.students || SYSTEM_STUDENTS;
            const target = students.find(s => s.id === studentId) || SYSTEM_STUDENTS.find(s => s.id === studentId);

            if (target) {
                config.defaultStudentId = target.id;
                config.studentName = target.name;
                config.currentClass = target.classLevel;

                if (window.AppState) {
                    window.AppState.config = config;
                }

                // Tải lại tiến trình học tập của học sinh mới
                if (window.app && typeof window.app.loadProgress === 'function') {
                    window.app.loadProgress(target.classLevel, target.id);
                }

                // Cập nhật giao diện Splash
                if (window.SplashModule && typeof window.SplashModule.displayGreeting === 'function') {
                    window.SplashModule.displayGreeting();
                }

                if (window.NavigationService) {
                    window.NavigationService.showScreen('splash-screen');
                }

                if (window.EventBus) {
                    window.EventBus.emit('student:changed', target);
                }
            }
        },

        renderStudentList: function() {
            const container = document.getElementById('student-select-grid') || document.getElementById('student-select-list');
            if (!container) return;

            const config = (window.AppState && window.AppState.config) || {};
            const students = config.students || SYSTEM_STUDENTS;
            const currentId = config.defaultStudentId || 'std_htsj4gbmo';

            container.innerHTML = students.map(s => `
                <div class="student-card ${s.id === currentId ? 'active' : ''}" onclick="StudentSelectModule.selectStudent('${s.id}')">
                    <div class="student-avatar">${s.name.substring(0, 2).toUpperCase()}</div>
                    <div class="student-info">
                        <div class="student-name">${s.name}</div>
                        <div class="student-class">Lớp ${s.classLevel}</div>
                    </div>
                </div>
            `).join('');
        },

        submitInitialSetup: function() {
            const parentNameEl = document.getElementById('setup-parent-name');
            const parentPinEl = document.getElementById('setup-parent-pin');
            const studentNameEl = document.getElementById('setup-student-name');
            const classLevelEl = document.getElementById('setup-class-level');

            if (!parentNameEl || !parentPinEl || !studentNameEl || !classLevelEl) return;

            const payload = {
                parentName: parentNameEl.value.trim() || 'Phụ huynh',
                parentPin: parentPinEl.value.trim() || '123456',
                studentName: studentNameEl.value.trim() || 'Học sinh',
                classLevel: classLevelEl.value || '6'
            };

            fetch('/api/setup-initial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    if (typeof Swal !== 'undefined') {
                        Swal.fire('Thành công', 'Đã khởi tạo thông tin học tập!', 'success').then(() => {
                            window.location.reload();
                        });
                    } else {
                        alert('Đã khởi tạo thông tin học tập!');
                        window.location.reload();
                    }
                }
            })
            .catch(err => {
                console.error("[StudentSelect] Setup error:", err);
            });
        }
    };

    if (typeof window !== 'undefined') {
        window.StudentSelectModule = StudentSelectModule;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = StudentSelectModule;
    }
})();
