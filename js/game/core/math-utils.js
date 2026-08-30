/**
 * GAME ENGINE - MATH UTILITIES
 * Tính toán hình học & khoảng cách va chạm
 */
(function(root) {
    'use strict';

    function distToSegmentSquared(p, v, w) {
        const l2 = (v.x - w.x) * (v.x - w.x) + (v.y - w.y) * (v.y - w.y);
        if (l2 === 0) return (p.x - v.x) * (p.x - v.x) + (p.y - v.y) * (p.y - v.y);
        let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        const projX = v.x + t * (w.x - v.x);
        const projY = v.y + t * (w.y - v.y);
        return (p.x - projX) * (p.x - projX) + (p.y - projY) * (p.y - projY);
    }

    function distToSegment(p, v, w) {
        return Math.sqrt(distToSegmentSquared(p, v, w));
    }

    const GameMath = {
        distToSegmentSquared,
        distToSegment
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = GameMath;
    if (typeof root !== 'undefined') root.GameMath = GameMath;
})(typeof window !== 'undefined' ? window : global);
