/**
 * SETTINGS MODULE
 * Quản lý cài đặt phụ huynh, xác thực mã PIN, đổi học sinh và quản trị hệ thống
 */
(function() {
    'use strict';

    const SettingsModule = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            const openBtn = document.getElementById('btn-open-parent-settings');
            const closeBtn = document.getElementById('btn-close-parent-settings');

            if (openBtn) {
                openBtn.addEventListener('click', () => this.openParentModal());
            }
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.closeParentModal());
            }
        },

        openParentModal: function() {
            const modal = document.getElementById('parent-settings-modal');
            if (modal) {
                modal.classList.remove('hidden');
            }
        },

        closeParentModal: function() {
            const modal = document.getElementById('parent-settings-modal');
            if (modal) {
                modal.classList.add('hidden');
            }
        },

        verifyPin: async function(inputPin) {
            try {
                const res = await fetch('/api/verify-pin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pin: inputPin })
                });
                const data = await res.json();
                return data.success === true;
            } catch (err) {
                console.error("Lỗi xác thực PIN:", err);
                return false;
            }
        },

        switchStudent: async function(studentId) {
            if (!window.AppState || !window.AppState.config || !window.AppState.config.students) return;
            const targetStudent = window.AppState.config.students.find(s => s.id === studentId);
            if (!targetStudent) return;

            window.AppState.config.defaultStudentId = targetStudent.id;
            window.AppState.config.studentName = targetStudent.name;
            window.AppState.config.currentClass = targetStudent.classLevel;

            // Reset state sạch sẽ tránh rò rỉ dữ liệu (Task 1.3)
            window.AppState.state = window.AppState.getDefaultState();

            if (window.app && typeof window.app.loadProgress === 'function') {
                await window.app.loadProgress();
            }
            if (window.app && typeof window.app.renderAll === 'function') {
                window.app.renderAll();
            }
        }
    };

    if (typeof window !== 'undefined') {
        window.SettingsModule = SettingsModule;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SettingsModule;
    }
})();
