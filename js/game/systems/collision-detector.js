/**
 * COLLISION DETECTOR SUBSYSTEM
 */
(function(root) {
    'use strict';
    const CollisionDetector = {
        checkCircleOverlap(x1, y1, r1, x2, y2, r2) {
            const dx = x1 - x2;
            const dy = y1 - y2;
            const distSq = dx * dx + dy * dy;
            const radiusSum = r1 + r2;
            return distSq <= radiusSum * radiusSum;
        },
        checkPointInCircle(px, py, cx, cy, radius) {
            const dx = px - cx;
            const dy = py - cy;
            return (dx * dx + dy * dy) <= (radius * radius);
        },
        getDistance(x1, y1, x2, y2) {
            const dx = x1 - x2;
            const dy = y1 - y2;
            return Math.sqrt(dx * dx + dy * dy);
        }
    };
    if (typeof window !== 'undefined') window.CollisionDetector = CollisionDetector;
    if (typeof module !== 'undefined' && module.exports) module.exports = CollisionDetector;
})(typeof window !== 'undefined' ? window : global);
