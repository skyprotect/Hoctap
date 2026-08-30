/**
 * GAME ENGINE - INPUT HANDLER
 * Lắng nghe click, touch, kéo thả đặt tháp (Drag & Drop)
 */
(function(root) {
    'use strict';
    class InputHandler {
        constructor(canvas, onPlaceTower, onSelectObject) {
            this.canvas = canvas;
            this.onPlaceTower = onPlaceTower;
            this.onSelectObject = onSelectObject;
            this.selectedTowerType = null;
            this.bindEvents();
        }
        bindEvents() {
            if (!this.canvas) return;
            this.canvas.addEventListener('click', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                if (this.selectedTowerType && this.onPlaceTower) {
                    this.onPlaceTower(x, y, this.selectedTowerType);
                    this.selectedTowerType = null;
                } else if (this.onSelectObject) {
                    this.onSelectObject(x, y);
                }
            });
        }
        selectTowerType(type) {
            this.selectedTowerType = type;
        }
    }
    if (typeof window !== 'undefined') window.InputHandler = InputHandler;
    if (typeof module !== 'undefined' && module.exports) module.exports = InputHandler;
})(typeof window !== 'undefined' ? window : global);
