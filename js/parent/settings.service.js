/**
 * PARENT PORTAL - SETTINGS SERVICE
 * Quản lý API Keys AI Gemini, Cấu hình thời gian học, Video bài giảng
 */
(function(root) {
    'use strict';
    const ParentSettingsService = {
        loadApiKeys: async function() {
            try {
                const res = await fetch('/api/settings/gemini-keys');
                if (res.ok) return await res.json();
            } catch (e) {}
            return [];
        },
        saveApiKeys: async function(keys) {
            try {
                const res = await fetch('/api/settings/gemini-keys', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ keys })
                });
                return res.ok;
            } catch (e) { return false; }
        }
    };
    if (typeof window !== 'undefined') window.ParentSettingsService = ParentSettingsService;
    if (typeof module !== 'undefined' && module.exports) module.exports = ParentSettingsService;
})(typeof window !== 'undefined' ? window : global);
