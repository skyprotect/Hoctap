/**
 * PARENT PORTAL - REMOTE SYNC
 * Đồng bộ đám mây Firestore & Cập nhật Gemini API Keys
 */
(function(root) {
    'use strict';
    const RemoteSync = {
        async loadApiKeys() {
            try {
                const res = await fetch('/api/settings/gemini-keys');
                if (res.ok) return await res.json();
            } catch (e) {}
            return [];
        },
        async saveApiKeys(keys) {
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
    if (typeof window !== 'undefined') window.ParentRemoteSync = RemoteSync;
    if (typeof module !== 'undefined' && module.exports) module.exports = RemoteSync;
})(typeof window !== 'undefined' ? window : global);
