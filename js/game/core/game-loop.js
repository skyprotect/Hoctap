/**
 * GAME LOOP SUBSYSTEM (Fixed 60FPS Timestep)
 */
(function(root) {
    'use strict';
    class GameLoop {
        constructor(updateFn, renderFn) {
            this.updateFn = updateFn;
            this.renderFn = renderFn;
            this.running = false;
            this.lastTime = 0;
            this.fps = 60;
            this.interval = 1000 / this.fps;
        }
        start() {
            if (this.running) return;
            this.running = true;
            this.lastTime = performance.now();
            const step = (now) => {
                if (!this.running) return;
                const delta = now - this.lastTime;
                if (delta >= this.interval) {
                    this.lastTime = now - (delta % this.interval);
                    if (this.updateFn) this.updateFn(delta);
                    if (this.renderFn) this.renderFn();
                }
                requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
        }
        stop() {
            this.running = false;
        }
    }
    if (typeof window !== 'undefined') window.GameLoop = GameLoop;
    if (typeof module !== 'undefined' && module.exports) module.exports = GameLoop;
})(typeof window !== 'undefined' ? window : global);
