/**
 * GAME ENGINE - MAP TERRAIN RENDERER
 */
(function(root) {
    'use strict';

    const MapRenderer = {
        _drawMapTerrain: function(theme) {
        if (!this.terrainObjects) {
            this._generateTerrainObjects();
        }
        
        const ctx = this.ctx;
        const time = Date.now();
        
        this.terrainObjects.forEach(obj => {
            ctx.save();
            ctx.translate(obj.x, obj.y);
            const scale = obj.scale;
            ctx.scale(scale, scale);
            
            // Vẽ bóng đổ chung cho vật thể
            ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
            ctx.beginPath();
            ctx.ellipse(0, 8, 14, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            
            if (this.mapTheme === 'plains') {
                // ĐỒNG BẰNG CỎ XANH
                if (obj.type === 0) {
                    // Cây thông 3D Chibi
                    ctx.fillStyle = "#5c3a21";
                    ctx.fillRect(-3, 0, 6, 12);
                    
                    const drawPineTier = (baseY, width, height) => {
                        ctx.fillStyle = "#15803d"; // Mặt sáng trái
                        ctx.beginPath();
                        ctx.moveTo(0, baseY - height);
                        ctx.lineTo(-width / 2, baseY);
                        ctx.lineTo(0, baseY - height * 0.15);
                        ctx.closePath();
                        ctx.fill();
                        
                        ctx.fillStyle = "#166534"; // Mặt tối phải
                        ctx.beginPath();
                        ctx.moveTo(0, baseY - height);
                        ctx.lineTo(width / 2, baseY);
                        ctx.lineTo(0, baseY - height * 0.15);
                        ctx.closePath();
                        ctx.fill();
                    };
                    drawPineTier(2, 28, 16);
                    drawPineTier(-8, 22, 14);
                    drawPineTier(-17, 16, 12);
                } else if (obj.type === 1) {
                    // Đá rêu 3D
                    ctx.fillStyle = "#64748b"; // mặt sáng
                    ctx.beginPath();
                    ctx.moveTo(-10, 5);
                    ctx.lineTo(0, -10);
                    ctx.lineTo(-12, -2);
                    ctx.closePath();
                    ctx.fill();
                    
                    ctx.fillStyle = "#475569"; // mặt tối
                    ctx.beginPath();
                    ctx.moveTo(-10, 5);
                    ctx.lineTo(10, 5);
                    ctx.lineTo(0, -10);
                    ctx.closePath();
                    ctx.fill();
                    
                    ctx.fillStyle = "#22c55e"; // rêu xanh
                    ctx.beginPath();
                    ctx.arc(0, -8, 3, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    // Hoa cỏ nhỏ lắc lư nhè nhẹ
                    const wave = Math.sin(time * 0.003 + obj.seed * 10) * 0.15;
                    ctx.rotate(wave);
                    ctx.strokeStyle = "#4ade80";
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.moveTo(0, 8);
                    ctx.quadraticCurveTo(-4, 0, -6, -8);
                    ctx.moveTo(0, 8);
                    ctx.quadraticCurveTo(4, 2, 6, -6);
                    ctx.stroke();
                    
                    ctx.fillStyle = obj.seed < 0.5 ? "#f43f5e" : "#fbbf24";
                    ctx.beginPath();
                    ctx.arc(-6, -8, 2.5, 0, Math.PI * 2);
                    ctx.arc(6, -6, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (this.mapTheme === 'volcano') {
                // NÚI LỬA DUNG NHAM
                if (obj.type === 0) {
                    // Hồ dung nham nhỏ phát sáng
                    ctx.fillStyle = "rgba(0,0,0,0.3)";
                    ctx.beginPath();
                    ctx.ellipse(0, 2, 22, 8, 0, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.save();
                    ctx.shadowColor = "#f97316";
                    ctx.shadowBlur = 10;
                    const lavaGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 16);
                    lavaGrad.addColorStop(0, "#fde68a");
                    lavaGrad.addColorStop(0.6, "#ea580c");
                    lavaGrad.addColorStop(1, "#7c2d12");
                    ctx.fillStyle = lavaGrad;
                    ctx.beginPath();
                    ctx.ellipse(0, 0, 18, 6, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                    
                    // Tàn lửa nhỏ bay lên
                    if (Math.random() < 0.04) {
                        this.particles.push({
                            x: obj.x + (Math.random() - 0.5) * 16,
                            y: obj.y + (Math.random() - 0.5) * 4,
                            vx: (Math.random() - 0.5) * 0.4,
                            vy: -0.6 - Math.random() * 0.8,
                            color: "#f97316",
                            alpha: 0.9,
                            life: 25 + Math.random() * 20,
                            maxLife: 45,
                            size: 1 + Math.random() * 1.5
                        });
                    }
                } else if (obj.type === 1) {
                    // Đá lửa cháy nứt nẻ
                    ctx.fillStyle = "#1e1b4b"; // đá đen tối
                    ctx.beginPath();
                    ctx.moveTo(-12, 6);
                    ctx.lineTo(-4, -10);
                    ctx.lineTo(8, -8);
                    ctx.lineTo(12, 6);
                    ctx.closePath();
                    ctx.fill();
                    
                    ctx.strokeStyle = "#ef4444";
                    ctx.lineWidth = 1.5;
                    ctx.shadowColor = "#ef4444";
                    ctx.shadowBlur = 4;
                    ctx.beginPath();
                    ctx.moveTo(-4, -10);
                    ctx.lineTo(0, 0);
                    ctx.lineTo(12, 6);
                    ctx.moveTo(-12, 6);
                    ctx.lineTo(0, 0);
                    ctx.stroke();
                } else {
                    // Đống xương khô
                    ctx.strokeStyle = "#cbd5e1";
                    ctx.lineWidth = 2.5;
                    ctx.lineCap = "round";
                    ctx.beginPath();
                    ctx.moveTo(-8, -4);
                    ctx.quadraticCurveTo(0, -10, 8, -4);
                    ctx.moveTo(-9, 0);
                    ctx.quadraticCurveTo(0, -6, 9, 0);
                    ctx.moveTo(0, -12);
                    ctx.lineTo(0, 6);
                    ctx.stroke();
                }
            } else if (this.mapTheme === 'cyberpunk') {
                // THÀNH PHỐ CYBERPUNK
                if (obj.type === 0) {
                    // Tòa nhà hologram wireframe phát sáng
                    ctx.globalAlpha = 0.22;
                    ctx.strokeStyle = "#22d3ee";
                    ctx.lineWidth = 1.5;
                    ctx.shadowColor = "#22d3ee";
                    ctx.shadowBlur = 8;
                    
                    ctx.strokeRect(-12, -26, 24, 30);
                    ctx.beginPath();
                    ctx.moveTo(-12, -26); ctx.lineTo(-6, -32);
                    ctx.moveTo(12, -26); ctx.lineTo(18, -32);
                    ctx.moveTo(12, 4); ctx.lineTo(18, -2);
                    ctx.stroke();
                    ctx.strokeRect(-6, -32, 24, 30);
                } else if (obj.type === 1) {
                    // Cột radar neon phát sóng elip mờ
                    ctx.fillStyle = "#1e293b";
                    ctx.fillRect(-4, -18, 8, 24);
                    
                    ctx.save();
                    ctx.fillStyle = "#f43f5e";
                    ctx.shadowColor = "#f43f5e";
                    ctx.shadowBlur = 12;
                    ctx.beginPath();
                    ctx.arc(0, -20, 5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    const waveR = (time * 0.02 + obj.seed * 30) % 24;
                    ctx.strokeStyle = `rgba(244, 63, 94, ${1 - waveR / 24})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(0, -20, waveR, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.restore();
                } else {
                    // Mạch điện neon phát sáng dưới nền
                    ctx.strokeStyle = "#4ade80";
                    ctx.lineWidth = 1.5;
                    ctx.shadowColor = "#4ade80";
                    ctx.shadowBlur = 6;
                    ctx.beginPath();
                    ctx.moveTo(-15, 0);
                    ctx.lineTo(-2, 0);
                    ctx.lineTo(8, -10);
                    ctx.lineTo(18, -10);
                    ctx.stroke();
                    ctx.fillStyle = "#ffffff";
                    ctx.beginPath();
                    ctx.arc(-15, 0, 2, 0, Math.PI * 2);
                    ctx.arc(18, -10, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (this.mapTheme === 'tundra') {
                // BĂNG TUYẾT TUNDRA
                if (obj.type === 0) {
                    // Tinh thể băng 3D lấp lánh
                    ctx.shadowColor = "#38bdf8";
                    ctx.shadowBlur = 6;
                    ctx.fillStyle = "#e0f2fe"; // Mặt sáng trái
                    ctx.beginPath();
                    ctx.moveTo(0, -16);
                    ctx.lineTo(-8, -4);
                    ctx.lineTo(0, 4);
                    ctx.lineTo(0, -16);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = "#7dd3fc"; // Mặt tối phải
                    ctx.beginPath();
                    ctx.moveTo(0, -16);
                    ctx.lineTo(8, -4);
                    ctx.lineTo(0, 4);
                    ctx.lineTo(0, -16);
                    ctx.closePath();
                    ctx.fill();
                } else if (obj.type === 1) {
                    // Cây thông phủ tuyết trắng
                    ctx.fillStyle = "#4c3829";
                    ctx.fillRect(-3, 0, 6, 12);
                    
                    const drawSnowPineTier = (baseY, width, height) => {
                        ctx.fillStyle = "#0f766e"; // Lá xanh thẫm
                        ctx.beginPath();
                        ctx.moveTo(0, baseY - height);
                        ctx.lineTo(-width / 2, baseY);
                        ctx.lineTo(width / 2, baseY);
                        ctx.closePath();
                        ctx.fill();
                        
                        ctx.fillStyle = "#ffffff"; // Tuyết trắng phủ
                        ctx.beginPath();
                        ctx.moveTo(0, baseY - height);
                        ctx.lineTo(-width / 4, baseY - height / 2);
                        ctx.lineTo(width / 4, baseY - height / 2);
                        ctx.closePath();
                        ctx.fill();
                    };
                    drawSnowPineTier(2, 26, 15);
                    drawSnowPineTier(-7, 20, 13);
                    drawSnowPineTier(-15, 14, 11);
                } else {
                    // Đống tuyết tròn xinh bo góc
                    ctx.fillStyle = "#ffffff";
                    ctx.strokeStyle = "#cbd5e1";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(-4, 4, 10, 0, Math.PI * 2);
                    ctx.arc(4, 4, 8, 0, Math.PI * 2);
                    ctx.arc(0, -1, 9, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.stroke();
                }
            }
            ctx.restore();
        });
    },

    // Vẽ giao diện game lên Canvas
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = MapRenderer;
    if (typeof root !== 'undefined') root.MapRenderer = MapRenderer;
})(typeof window !== 'undefined' ? window : global);
