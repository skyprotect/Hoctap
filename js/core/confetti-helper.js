/**
 * confetti-helper — Tiện ích tạo hiệu ứng pháo hoa giấy Canvas chúc mừng.
 * Độc lập hoàn toàn, hỗ trợ UMD (Node.js CommonJS, Web Workers, Browser Global).
 * 
 * Public Contract:
 * - init(): void
 * - resize(): void
 * - start(): void
 * - loop(): void
 * - stop(): void
 * - active: boolean
 * - particles: Array
 * - colors: Array
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.ConfettiHelper = api;
    if (typeof window !== 'undefined') {
        window.ConfettiHelper = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.ConfettiHelper = api;
    }
    if (typeof self !== 'undefined') {
        self.ConfettiHelper = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const ConfettiHelper = {
        canvas: null,
        ctx: null,
        particles: [],
        colors: ["#FF7F50", "#3E8EED", "#2ECC71", "#F1C40F", "#FF4D4D", "#9B59B6", "#1ABC9C"],
        animationFrame: null,
        active: false,
        hasResizeHandler: false,

        init: function() {
            if (typeof document === 'undefined') return;
            this.canvas = document.getElementById("confetti-canvas");
            if (!this.canvas) return;
            this.ctx = this.canvas.getContext("2d");
            this.resize();
            // Lắng nghe sự kiện để cập nhật size canvas
            if (!this.hasResizeHandler && typeof window !== 'undefined') {
                window.addEventListener("resize", () => this.resize());
                this.hasResizeHandler = true;
            }
        },

        resize: function() {
            if (this.canvas && typeof window !== 'undefined') {
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }
        },

        start: function() {
            this.init();
            if (!this.canvas || !this.ctx) return;
            this.particles = [];
            for (let i = 0; i < 150; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height - this.canvas.height,
                    r: Math.random() * 6 + 4,
                    d: Math.random() * this.canvas.height,
                    color: this.colors[Math.floor(Math.random() * this.colors.length)],
                    tilt: Math.random() * 10 - 5,
                    tiltAngleIncremental: Math.random() * 0.07 + 0.02,
                    tiltAngle: 0
                });
            }
            this.active = true;
            if (this.animationFrame && typeof cancelAnimationFrame === 'function') {
                cancelAnimationFrame(this.animationFrame);
            }
            this.loop();
            
            // Tự động dừng sau 4 giây
            setTimeout(() => {
                this.stop();
            }, 4000);
        },

        loop: function() {
            if (!this.active || !this.ctx || !this.canvas) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            let finished = true;
            this.particles.forEach(p => {
                p.tiltAngle += p.tiltAngleIncremental;
                p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
                p.x += Math.sin(p.tiltAngle);
                p.tilt = Math.sin(p.tiltAngle - p.r / 2) * 15;

                this.ctx.beginPath();
                this.ctx.lineWidth = p.r;
                this.ctx.strokeStyle = p.color;
                this.ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
                this.ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
                this.ctx.stroke();

                if (p.y < this.canvas.height) {
                    finished = false;
                }
            });

            if (!finished) {
                if (typeof requestAnimationFrame === 'function') {
                    this.animationFrame = requestAnimationFrame(() => this.loop());
                }
            } else {
                this.stop();
            }
        },

        stop: function() {
            this.active = false;
            if (this.ctx && this.canvas) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            if (this.animationFrame && typeof cancelAnimationFrame === 'function') {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }
        }
    };

    return ConfettiHelper;
});
