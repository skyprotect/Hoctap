/**
 * SAFE STORAGE SERVICE
 * Lớp trừu tượng hóa LocalStorage an toàn với cơ chế bộ nhớ dự phòng (In-Memory Fallback)
 */
(function() {
    'use strict';

    const safeStorage = {
        fallback: {},
        getItem: function(key) {
            try { 
                return localStorage.getItem(key); 
            } catch(e) { 
                console.warn("[SafeStorage] getItem failed, using fallback:", e); 
                return this.fallback[key] || null; 
            }
        },
        setItem: function(key, value) {
            try { 
                localStorage.setItem(key, value); 
            } catch(e) { 
                console.warn("[SafeStorage] setItem failed, using fallback:", e); 
                this.fallback[key] = value; 
            }
        },
        removeItem: function(key) {
            try { 
                localStorage.removeItem(key); 
            } catch(e) { 
                console.warn("[SafeStorage] removeItem failed, using fallback:", e); 
                delete this.fallback[key]; 
            }
        },
        getJSON: function(key, defaultValue = null) {
            const raw = this.getItem(key);
            if (!raw) return defaultValue;
            try {
                return JSON.parse(raw);
            } catch(e) {
                console.warn("[SafeStorage] getJSON parse error for key " + key + ":", e);
                return defaultValue;
            }
        },
        setJSON: function(key, value) {
            try {
                this.setItem(key, JSON.stringify(value));
            } catch(e) {
                console.warn("[SafeStorage] setJSON error for key " + key + ":", e);
            }
        }
    };

    if (typeof window !== 'undefined') {
        window.safeStorage = safeStorage;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = safeStorage;
    }
})();
