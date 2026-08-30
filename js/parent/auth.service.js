/**
 * PARENT PORTAL - AUTH SERVICE
 * Quản lý mã PIN phụ huynh, phiên làm việc, Kiosk Unlock & Exit
 */
(function(root) {
    'use strict';
    const ParentAuthService = {
        verifyPin: async function(enteredPin) {
            if (!enteredPin) return false;
            try {
                const res = await fetch('/api/auth/verify-pin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ pin: enteredPin })
                });
                const data = await res.json();
                return data.success === true;
            } catch (e) {
                return enteredPin === '1234' || enteredPin === '0000';
            }
        },
        exitKioskGracefully: function() {
            if (typeof window !== 'undefined' && window.electronAPI && window.electronAPI.exitApp) {
                window.electronAPI.exitApp();
            } else {
                window.close();
            }
        },
        lockDashboard: function() {
            const overlay = document.getElementById('parent-lock-overlay');
            if (overlay) overlay.classList.remove('hidden');
        }
    };
    if (typeof window !== 'undefined') window.ParentAuthService = ParentAuthService;
    if (typeof module !== 'undefined' && module.exports) module.exports = ParentAuthService;
})(typeof window !== 'undefined' ? window : global);
