/**
 * SCRATCHPAD SERVICE
 * Quản lý bảng nháp cảm ứng (Canvas Drawing) trong phòng thi: vẽ tay, đổi màu bút, xóa bảng và phóng to/thu nhỏ
 */
(function() {
    'use strict';

    let canvas = null;
    let ctx = null;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let strokeColor = '#3b82f6';
    let lineWidth = 3;

    const ScratchpadService = {
        init: function(canvasId = 'scratchpad-canvas') {
            canvas = document.getElementById(canvasId);
            if (!canvas) return;
            ctx = canvas.getContext('2d');
            this.resizeCanvas();
            this.bindEvents();
        },

        resizeCanvas: function() {
            if (!canvas) return;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            if (ctx) {
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = lineWidth;
            }
        },

        bindEvents: function() {
            if (!canvas) return;

            const startDraw = (e) => {
                isDrawing = true;
                const pos = this.getPointerPos(e);
                lastX = pos.x;
                lastY = pos.y;
            };

            const draw = (e) => {
                if (!isDrawing || !ctx) return;
                const pos = this.getPointerPos(e);
                ctx.beginPath();
                ctx.moveTo(lastX, lastY);
                ctx.lineTo(pos.x, pos.y);
                ctx.strokeStyle = strokeColor;
                ctx.lineWidth = lineWidth;
                ctx.stroke();
                lastX = pos.x;
                lastY = pos.y;
                e.preventDefault();
            };

            const stopDraw = () => {
                isDrawing = false;
            };

            // Mouse events
            canvas.addEventListener('mousedown', startDraw);
            canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDraw);
            canvas.addEventListener('mouseleave', stopDraw);

            // Touch events
            canvas.addEventListener('touchstart', startDraw, { passive: false });
            canvas.addEventListener('touchmove', draw, { passive: false });
            canvas.addEventListener('touchend', stopDraw);

            window.addEventListener('resize', () => this.resizeCanvas());
        },

        getPointerPos: function(e) {
            if (!canvas) return { x: 0, y: 0 };
            const rect = canvas.getBoundingClientRect();
            if (e.touches && e.touches.length > 0) {
                return {
                    x: e.touches[0].clientX - rect.left,
                    y: e.touches[0].clientY - rect.top
                };
            }
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        },

        setColor: function(color) {
            strokeColor = color;
        },

        setLineWidth: function(width) {
            lineWidth = width;
        },

        clear: function() {
            if (ctx && canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        },

        toggle: function(show) {
            const container = document.getElementById('scratchpad-container');
            if (!container) return;
            if (show !== undefined) {
                if (show) container.classList.remove('hidden');
                else container.classList.add('hidden');
            } else {
                container.classList.toggle('hidden');
            }
            if (!container.classList.contains('hidden')) {
                this.resizeCanvas();
            }
        }
    };

    if (typeof window !== 'undefined') {
        window.ScratchpadService = ScratchpadService;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ScratchpadService;
    }
})();
