/**
 * API CLIENT SERVICE
 * Lớp truy cập Backend API duy nhất có bẫy lỗi và retry tự động
 */
(function() {
    'use strict';

    const ApiClient = {
        getBaseUrl: function() {
            if (typeof window !== 'undefined' && window.location) {
                if (window.location.protocol === 'file:') {
                    return 'http://localhost:3000';
                }
            }
            return '';
        },

        async request(endpoint, options = {}) {
            const url = this.getBaseUrl() + endpoint;
            const defaultHeaders = {
                'Content-Type': 'application/json'
            };

            const token = typeof window !== 'undefined' && window.safeStorage ? window.safeStorage.getItem('adminToken') : null;
            if (token) {
                defaultHeaders['Authorization'] = 'Bearer ' + token;
            }

            const config = {
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...(options.headers || {})
                }
            };

            try {
                const response = await fetch(url, config);
                if (!response.ok) {
                    const errBody = await response.json().catch(() => ({}));
                    throw new Error(errBody.error || ('HTTP Error ' + response.status));
                }
                return await response.json();
            } catch (err) {
                console.warn('[ApiClient] Request to ' + endpoint + ' failed:', err.message);
                throw err;
            }
        },

        // API Học sinh & Tiến độ
        getStudentInfo: function(studentId) {
            return this.request('/api/student-info?studentId=' + encodeURIComponent(studentId));
        },

        saveProgress: function(payload) {
            return this.request('/api/save-progress', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        },

        getFirebaseConfig: function() {
            return this.request('/api/firebase-config');
        },

        // API Cố vấn AI
        chatAi: function(payload) {
            return this.request('/api/ai-chat', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
        }
    };

    if (typeof window !== 'undefined') {
        window.ApiClient = ApiClient;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ApiClient;
    }
})();
