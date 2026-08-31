/**
 * sanitize-html — Bộ làm sạch chuỗi HTML chống tấn công XSS.
 * 
 * Public Contract:
 * - sanitizeHtml(html: string): string
 */
(function (root, factory) {
    const fn = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = fn;
    }
    root.sanitizeHtml = fn;
    if (typeof window !== 'undefined') {
        window.sanitizeHtml = fn;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.sanitizeHtml = fn;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
    function sanitizeHtml(html) {
        if (typeof html !== 'string') return html;
        return html
            .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
            .replace(/\son[a-z]+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, '')
            .replace(/href\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, '');
    }

    sanitizeHtml.sanitizeHtml = sanitizeHtml;
    return sanitizeHtml;
});
