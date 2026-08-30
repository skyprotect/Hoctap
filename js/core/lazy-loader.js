/**
 * ON-DEMAND LAZY LOADER MODULE (v13.40)
 * Tối ưu hiệu năng Web Vitals (LCP, INP), hỗ trợ nạp Template HTML & JSON on-demand
 */

(function(root) {
    'use strict';

    const _loadedScripts = new Set();
    const _pendingPromises = new Map();
    const _jsonCache = new Map();
    const _templateCache = new Map();

    const LazyLoader = {
        /**
         * Nạp động một tệp JavaScript từ đường dẫn
         * @param {string} src Đường dẫn file .js
         * @returns {Promise<void>}
         */
        loadScript: function(src) {
            if (_loadedScripts.has(src)) {
                return Promise.resolve();
            }

            if (_pendingPromises.has(src)) {
                return _pendingPromises.get(src);
            }

            const promise = new Promise((resolve, reject) => {
                const existing = document.querySelector(`script[src="${src}"]`);
                if (existing) {
                    _loadedScripts.add(src);
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = src;
                script.async = true;

                script.onload = () => {
                    _loadedScripts.add(src);
                    _pendingPromises.delete(src);
                    resolve();
                };

                script.onerror = (err) => {
                    _pendingPromises.delete(src);
                    console.error(`[LazyLoader] Không thể nạp script: ${src}`, err);
                    reject(new Error(`Không thể nạp: ${src}`));
                };

                document.head.appendChild(script);
            });

            _pendingPromises.set(src, promise);
            return promise;
        },

        /**
         * Nạp tệp JSON với bộ nhớ đệm in-memory
         * @param {string} path Đường dẫn JSON
         * @returns {Promise<any>}
         */
        loadJSON: async function(path) {
            if (_jsonCache.has(path)) {
                return _jsonCache.get(path);
            }
            try {
                const res = await fetch(path);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                _jsonCache.set(path, data);
                return data;
            } catch (err) {
                console.warn(`[LazyLoader] Không thể nạp JSON từ ${path}:`, err.message);
                return null;
            }
        },

        /**
         * Nạp Template HTML On-Demand và chèn vào DOM
         * @param {string} templatePath Đường dẫn tệp HTML template (ví dụ: 'templates/student/modals/hero-profile.html')
         * @param {string|HTMLElement} target Selector hoặc HTMLElement đích để chèn HTML
         * @returns {Promise<HTMLElement|null>}
         */
        loadTemplate: async function(templatePath, target = document.body) {
            let html = _templateCache.get(templatePath);
            if (!html) {
                try {
                    const res = await fetch(templatePath);
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    html = await res.text();
                    _templateCache.set(templatePath, html);
                } catch (err) {
                    console.warn(`[LazyLoader] Lỗi nạp template ${templatePath}:`, err.message);
                    return null;
                }
            }

            const targetEl = typeof target === 'string' ? document.querySelector(target) : target;
            if (!targetEl) return null;

            const temp = document.createElement('div');
            temp.innerHTML = html;
            const element = temp.firstElementChild;
            if (element) {
                targetEl.appendChild(element);
                return element;
            }
            return null;
        },

        /**
         * Đăng ký sẵn Template HTML vào Cache (Phục vụ Fallback Offline)
         */
        registerTemplate: function(templatePath, htmlContent) {
            _templateCache.set(templatePath, htmlContent);
        },

        /**
         * Nạp thư viện vẽ biểu đồ tư duy sơ đồ Mermaid
         */
        loadMermaid: async function() {
            if (typeof window.mermaid !== 'undefined') return window.mermaid;
            await this.loadScript('js/lib/mermaid.min.js');
            if (window.mermaid) {
                window.mermaid.initialize({
                    startOnLoad: false,
                    theme: 'default',
                    securityLevel: 'loose'
                });
            }
            return window.mermaid;
        },

        /**
         * Nạp Game Engine (game.js) khi học sinh kích hoạt chế độ Trò chơi Toán/Tiếng Anh
         */
        loadGameEngine: async function() {
            if (typeof window.game !== 'undefined') return window.game;
            await this.loadScript('js/game.js');
            return window.game;
        },

        /**
         * Nạp thư viện biểu đồ Chart.js khi mở màn hình Báo cáo & Thống kê
         */
        loadChart: async function() {
            if (typeof window.Chart !== 'undefined') return window.Chart;
            await this.loadScript('js/lib/chart.min.js');
            return window.Chart;
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = LazyLoader;
    }
    if (typeof root !== 'undefined') {
        root.LazyLoader = LazyLoader;
    }
})(typeof window !== 'undefined' ? window : global);
