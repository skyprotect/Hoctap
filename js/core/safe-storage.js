/**
 * safeStorage — Bộ lưu trữ an toàn Client chống lỗi QuotaExceededError / Private Browsing.
 * Hỗ trợ In-Memory RAM Fallback khi localStorage bị vô hiệu hóa hoặc đầy bộ nhớ.
 * 
 * Public Contract:
 * - fallback: Record<string, string>
 * - getItem(key: string): string | null
 * - setItem(key: string, value: any): void
 * - removeItem(key: string): void
 */
(function (root, factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else {
        const instance = factory();
        root.safeStorage = instance;
        if (typeof window !== 'undefined') {
            window.safeStorage = instance;
        }
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
    const safeStorage = {
        fallback: {},
        getItem: function(key) {
            try {
                if (typeof localStorage === 'undefined' || !localStorage) {
                    return this.fallback[key] !== undefined ? this.fallback[key] : null;
                }
                const val = localStorage.getItem(key);
                return val !== null ? val : (this.fallback[key] !== undefined ? this.fallback[key] : null);
            } catch(e) {
                console.warn("Storage.getItem failed:", e);
                return this.fallback[key] !== undefined ? this.fallback[key] : null;
            }
        },
        setItem: function(key, value) {
            const strVal = String(value);
            try {
                if (typeof localStorage === 'undefined' || !localStorage) {
                    this.fallback[key] = strVal;
                    return;
                }
                localStorage.setItem(key, strVal);
            } catch(e) {
                console.warn("Storage.setItem failed:", e);
                this.fallback[key] = strVal;
            }
        },
        removeItem: function(key) {
            try {
                if (typeof localStorage === 'undefined' || !localStorage) {
                    delete this.fallback[key];
                    return;
                }
                localStorage.removeItem(key);
                delete this.fallback[key];
            } catch(e) {
                console.warn("Storage.removeItem failed:", e);
                delete this.fallback[key];
            }
        }
    };

    if (typeof window !== 'undefined') {
        window.safeStorage = safeStorage;
    }

    return safeStorage;
});
