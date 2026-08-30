/**
 * KATEX SERVICE
 * Quản lý render công thức toán học KaTeX, chuẩn hóa ký tự $ và phòng chống lỗi
 */
(function() {
    'use strict';

    const KatexService = {
        render: function(element) {
            if (!element) return;
            if (typeof window.renderMathInElement === 'function') {
                try {
                    window.renderMathInElement(element, {
                        delimiters: [
                            { left: '$$', right: '$$', display: true },
                            { left: '$', right: '$', display: false },
                            { left: '\(', right: '\)', display: false },
                            { left: '\[', right: '\]', display: true }
                        ],
                        throwOnError: false,
                        errorColor: '#cc0000'
                    });
                } catch (err) {
                    console.warn('[KatexService] Render error caught gracefully:', err.message);
                }
            }
        },

        renderAll: function() {
            if (typeof document !== 'undefined') {
                this.render(document.body);
            }
        }
    };

    if (typeof window !== 'undefined') {
        window.KatexService = KatexService;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = KatexService;
    }
})();
