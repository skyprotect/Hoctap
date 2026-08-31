/**
 * ThemeService — Quản lý giao diện Sáng/Tối/Lá (Themes) cho Học sinh và Phụ huynh.
 * 
 * Public Contract:
 * - STUDENT_THEME_KEY: string ('toan6_theme')
 * - PARENT_THEME_KEY: string ('parent_theme')
 * - isDarkMode: boolean (dành cho Student Theme)
 * 
 * - initStudentTheme(): boolean
 * - getStudentTheme(): string ('green' | 'light')
 * - setStudentTheme(theme: string): boolean
 * - toggleStudentTheme(onChangedCallback?: Function): boolean
 * - updateStudentThemeIcon(isDarkMode?: boolean): void
 * 
 * - initParentTheme(): string ('dark' | 'light')
 * - getParentTheme(): string ('dark' | 'light')
 * - setParentTheme(theme: string): string
 * - toggleParentTheme(): string
 * - updateParentThemeUI(theme?: string): void
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.ThemeService = api;
    if (typeof window !== 'undefined') {
        window.ThemeService = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.ThemeService = api;
    }
    if (typeof self !== 'undefined') {
        self.ThemeService = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const ThemeService = {
        STUDENT_THEME_KEY: 'toan6_theme',
        PARENT_THEME_KEY: 'parent_theme',
        isDarkMode: true,

        // Helper an toàn truy xuất Storage
        _getStorageItem: function(key) {
            try {
                if (typeof safeStorage !== 'undefined' && safeStorage && typeof safeStorage.getItem === 'function') {
                    return safeStorage.getItem(key);
                }
                if (typeof localStorage !== 'undefined' && localStorage) {
                    return localStorage.getItem(key);
                }
            } catch (e) {}
            return null;
        },

        _setStorageItem: function(key, value) {
            try {
                if (typeof safeStorage !== 'undefined' && safeStorage && typeof safeStorage.setItem === 'function') {
                    safeStorage.setItem(key, value);
                    return;
                }
                if (typeof localStorage !== 'undefined' && localStorage) {
                    localStorage.setItem(key, value);
                }
            } catch (e) {}
        },

        // ==========================================
        // 1. STUDENT THEME MANAGEMENT
        // ==========================================
        getStudentTheme: function() {
            const saved = this._getStorageItem(this.STUDENT_THEME_KEY);
            return saved === 'light' ? 'light' : 'green';
        },

        initStudentTheme: function() {
            const savedTheme = this.getStudentTheme();
            if (savedTheme === 'light') {
                this.isDarkMode = false;
                if (typeof document !== 'undefined' && document.body) {
                    document.body.classList.add('light-mode');
                    document.body.classList.remove('green-mode');
                }
            } else {
                this.isDarkMode = true;
                if (typeof document !== 'undefined' && document.body) {
                    document.body.classList.add('green-mode');
                    document.body.classList.remove('light-mode');
                }
            }
            this.updateStudentThemeIcon(this.isDarkMode);
            return this.isDarkMode;
        },

        setStudentTheme: function(theme) {
            const normalized = theme === 'light' ? 'light' : 'green';
            this.isDarkMode = (normalized !== 'light');
            this._setStorageItem(this.STUDENT_THEME_KEY, normalized);

            if (typeof document !== 'undefined' && document.body) {
                if (normalized === 'light') {
                    document.body.classList.add('light-mode');
                    document.body.classList.remove('green-mode');
                } else {
                    document.body.classList.add('green-mode');
                    document.body.classList.remove('light-mode');
                }
            }
            this.updateStudentThemeIcon(this.isDarkMode);
            return this.isDarkMode;
        },

        toggleStudentTheme: function(onChangedCallback) {
            this.isDarkMode = !this.isDarkMode;
            const newTheme = this.isDarkMode ? 'green' : 'light';
            this.setStudentTheme(newTheme);

            // Xử lý callback tùy chọn
            if (typeof onChangedCallback === 'function') {
                try { onChangedCallback(this.isDarkMode, newTheme); } catch(e) {}
            }

            // Tự động re-render biểu đồ nếu Parent Dashboard đang mở
            if (typeof document !== 'undefined') {
                const screenParent = document.getElementById('screen-parent');
                const parentDashboardContent = document.getElementById('parent-dashboard-content');
                if (screenParent && !screenParent.classList.contains('hidden') &&
                    parentDashboardContent && !parentDashboardContent.classList.contains('hidden')) {
                    if (typeof parentDashboard !== 'undefined' && typeof parentDashboard.renderCharts === 'function') {
                        try { parentDashboard.renderCharts(); } catch(e) {}
                    }
                }
            }

            return this.isDarkMode;
        },

        updateStudentThemeIcon: function(isDarkMode) {
            const dark = typeof isDarkMode === 'boolean' ? isDarkMode : this.isDarkMode;
            if (typeof document === 'undefined') return;
            const toggleBtn = document.getElementById('theme-toggle');
            if (!toggleBtn) return;

            if (dark) {
                // Khi đang ở Green Mode (Lá): hiển thị icon Mặt trăng để bấm chuyển sang Đêm Dạ Lục
                toggleBtn.innerHTML = '<i class="fa-solid fa-moon" style="color:#FFD700; filter: drop-shadow(0 0 4px rgba(255,215,0,0.5));" title="Chuyển sang Giao diện Đêm Dạ Lục"></i>';
            } else {
                // Khi đang ở Đêm Dạ Lục: hiển thị icon chiếc lá để bấm chuyển sang Green Mode
                toggleBtn.innerHTML = '<i class="fa-solid fa-leaf" style="color:#2E7D32; filter: drop-shadow(0 0 4px rgba(46,125,50,0.4));" title="Chuyển sang Giao diện Lá Dịu Mắt"></i>';
            }
        },

        // ==========================================
        // 2. PARENT THEME MANAGEMENT
        // ==========================================
        getParentTheme: function() {
            const saved = this._getStorageItem(this.PARENT_THEME_KEY);
            return saved === 'light' ? 'light' : 'dark';
        },

        initParentTheme: function() {
            const savedTheme = this.getParentTheme();
            this.setParentTheme(savedTheme);
            return savedTheme;
        },

        setParentTheme: function(theme) {
            const normalized = theme === 'light' ? 'light' : 'dark';
            this._setStorageItem(this.PARENT_THEME_KEY, normalized);

            if (typeof document !== 'undefined' && document.body) {
                if (normalized === 'light') {
                    document.body.classList.add('light-mode');
                } else {
                    document.body.classList.remove('light-mode');
                }
            }
            this.updateParentThemeUI(normalized);
            return normalized;
        },

        toggleParentTheme: function() {
            let isCurrentlyLight = false;
            if (typeof document !== 'undefined' && document.body) {
                isCurrentlyLight = document.body.classList.contains('light-mode');
            } else {
                isCurrentlyLight = (this.getParentTheme() === 'light');
            }

            const targetTheme = isCurrentlyLight ? 'dark' : 'light';
            this.setParentTheme(targetTheme);
            return targetTheme;
        },

        updateParentThemeUI: function(theme) {
            const currentTheme = theme || this.getParentTheme();
            if (typeof document === 'undefined') return;

            const icon = document.getElementById('parent-theme-icon');
            const text = document.getElementById('parent-theme-text');

            if (currentTheme === 'light') {
                if (icon) icon.className = 'fa-solid fa-moon text-slate-600';
                if (text) text.textContent = 'Giao diện Tối';
            } else {
                if (icon) icon.className = 'fa-solid fa-sun text-amber-400';
                if (text) text.textContent = 'Giao diện Sáng';
            }
        }
    };

    return ThemeService;
});
