/**
 * ON-DEMAND LAZY LOADER MODULE (v3.0)
 * Tối ưu hiệu năng Web Vitals (LCP, INP), giảm dung lượng tải ban đầu
 */

(function(root) {
    'use strict';

    const _loadedScripts = new Set();
    const _pendingPromises = new Map();
    const _jsonCache = new Map();

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
                // Kiểm tra xem thẻ script đã có trong DOM chưa
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
        },

        /**
         * Nạp ngân hàng câu hỏi JSON theo khối lớp và chương học
         * @param {number|string} grade Lớp (ví dụ: 6)
         * @param {string} chapterName Tên chương (ví dụ: "chapter1_integers")
         */
        loadQuestionBank: async function(grade, chapterName) {
            const path = `data/math/grade${grade}/${chapterName}.json`;
            if (_jsonCache.has(path)) {
                return _jsonCache.get(path);
            }

            try {
                const res = await fetch(path);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                _jsonCache.set(path, data);
                
                // Tự động đăng ký vào QuestionEngine nếu có
                if (typeof window.QuestionEngine !== 'undefined') {
                    window.QuestionEngine.registerChapter(chapterName, data);
                }
                return data;
            } catch (err) {
                console.warn(`[LazyLoader] Lỗi tải ngân hàng câu hỏi ${path}:`, err);
                return null;
            }
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = LazyLoader;
    }
    if (typeof root !== 'undefined') {
        root.LazyLoader = LazyLoader;
    }
})(typeof window !== 'undefined' ? window : global);
