/**
 * url-utils — Bộ tiện ích chuẩn hóa URL API Client và phân tích link Video YouTube.
 * Tự động nhận diện giao thức file:// và định tuyến tới cổng máy chủ Express cục bộ.
 * Hỗ trợ trích xuất Youtube ID từ mọi định dạng đường dẫn.
 * 
 * Public Contract:
 * - getApiUrl(path: any): string
 * - extractYoutubeId(input: any): string
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.UrlUtils = api;
    root.getApiUrl = api.getApiUrl;
    root.extractYoutubeId = api.extractYoutubeId;
    if (typeof window !== 'undefined') {
        window.UrlUtils = api;
        window.getApiUrl = api.getApiUrl;
        window.extractYoutubeId = api.extractYoutubeId;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.UrlUtils = api;
        globalThis.getApiUrl = api.getApiUrl;
        globalThis.extractYoutubeId = api.extractYoutubeId;
    }
    if (typeof self !== 'undefined') {
        self.UrlUtils = api;
        self.getApiUrl = api.getApiUrl;
        self.extractYoutubeId = api.extractYoutubeId;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    function getStorage() {
        if (typeof safeStorage !== 'undefined' && safeStorage && typeof safeStorage.getItem === 'function') {
            return safeStorage;
        }
        if (typeof window !== 'undefined' && window.safeStorage && typeof window.safeStorage.getItem === 'function') {
            return window.safeStorage;
        }
        if (typeof globalThis !== 'undefined' && globalThis.safeStorage && typeof globalThis.safeStorage.getItem === 'function') {
            return globalThis.safeStorage;
        }
        if (typeof require === 'function') {
            try {
                return require('./safe-storage');
            } catch (e) {
                return null;
            }
        }
        return null;
    }

    /**
     * Chuẩn hóa và sinh URL API Client
     * @param {string|any} path - Đường dẫn API tương đối (ví dụ: '/api/load-config' hoặc 'api/load-config')
     * @returns {string} - Đường dẫn API đã được chuẩn hóa hoặc URL đầy đủ
     */
    function getApiUrl(path) {
        const rawPath = typeof path === 'string' ? path : (path != null ? String(path) : '');
        const cleanPath = rawPath.startsWith('/') ? rawPath : '/' + rawPath;

        if (typeof window !== 'undefined' && window.location) {
            if (window.location.protocol === 'file:') {
                const storage = getStorage();
                const savedPort = (storage && typeof storage.getItem === 'function' ? storage.getItem('server_port') : null) || '3000';
                return `http://localhost:${savedPort}${cleanPath}`;
            }
            return cleanPath;
        }

        return cleanPath;
    }

    /**
     * Regex thông minh tự động trích xuất ID YouTube 11 ký tự từ mọi định dạng link
     * Hỗ trợ: youtu.be, youtube.com/watch?v=, youtube.com/v/, youtube.com/embed/, v.v.
     * @param {string|any} input - URL YouTube hoặc ID YouTube
     * @returns {string} - ID video 11 ký tự hoặc chuỗi rỗng
     */
    function extractYoutubeId(input) {
        if (!input) return "";
        const str = String(input).trim();
        if (!str) return "";
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = str.match(regExp);
        if (match && match[2].length === 11) {
            return match[2];
        }
        return str; // Trả về nguyên bản nếu người dùng đã nhập đúng ID 11 ký tự
    }

    const UrlUtils = {
        getApiUrl: getApiUrl,
        extractYoutubeId: extractYoutubeId
    };

    return UrlUtils;
});
