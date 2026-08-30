/**
 * GAME ENGINE - MONSTER VECTOR RENDERER
 */
(function(root) {
    'use strict';

    const MonsterRenderer = {
        drawMonsterVector: function(e, pulse) {
        const ctx = this.ctx;
        const time = Date.now();
        const r = e.radius;
        const x = e.x, y = e.y;
        const rageColor = this.isRaged;

        ctx.save();
        
        // Thêm shadow phát sáng màu đỏ nếu quái đang nổi giận (Raged)
        if (rageColor) {
            ctx.shadowColor = "#ef4444";
            ctx.shadowBlur = 15;
        }

        // Xác định hướng quay mặt của quái vật (Trái/Phải)
        const activePath = e.currentPath || this.paths[0];
        const targetPoint = activePath[e.pathIndex + 1] || activePath[activePath.length - 1];
        const facingLeft = targetPoint ? targetPoint.x < e.x : false;

        let imgKey = 'monster_slime';
        let filterStr = "none";
        
        if (e.type === 'normal' || e.type === 'fire_slime' || e.type === 'poison_slime' || e.type === 'titan') {
            imgKey = 'monster_slime';
            if (e.type === 'fire_slime') filterStr = "hue-rotate(-130deg) saturate(2.5)";
            else if (e.type === 'poison_slime') filterStr = "hue-rotate(90deg) saturate(1.8) brightness(0.9)";
            else if (e.type === 'titan') filterStr = "brightness(0.7) hue-rotate(160deg) saturate(1.5)";
        } else if (e.type === 'fast' || e.type === 'shadow' || e.type === 'ice_bat' || e.type === 'speedy_goblin') {
            imgKey = 'monster_bat';
            if (e.type === 'shadow') filterStr = "brightness(0.2) hue-rotate(240deg) saturate(2)";
            else if (e.type === 'ice_bat') filterStr = "hue-rotate(120deg) brightness(1.2)";
            else if (e.type === 'speedy_goblin') filterStr = "hue-rotate(280deg) saturate(2) brightness(1.1)";
        } else if (e.type === 'boss' || e.type === 'vampire') {
            imgKey = 'monster_boss';
            if (e.type === 'vampire') filterStr = "hue-rotate(-90deg) brightness(0.5) saturate(2)";
        } else if (e.type === 'healer' || e.type === 'gold_goblin' || e.type === 'ghost') {
            imgKey = 'monster_healer';
            if (e.type === 'gold_goblin') filterStr = "hue-rotate(40deg) brightness(1.4) saturate(2)";
            else if (e.type === 'ghost') filterStr = "opacity(0.55) brightness(1.3)";
        } else if (e.type === 'armored' || e.type === 'lava_golem') {
            imgKey = 'monster_armored';
            if (e.type === 'lava_golem') filterStr = "hue-rotate(-160deg) brightness(0.8) saturate(1.8)";
        }

        const img = this.images[imgKey];

        // --- TÍNH TOÁN HOẠT HỌA THEO TỪNG LOẠI QUÁI ---
        let drawX = x;
        let drawY = y;
        let scaleX = 1;
        let scaleY = 1;
        let rotation = 0;

        // Lật mặt trái/phải
        let flipX = facingLeft ? -1 : 1;

        if (e.type === 'normal') {
            // ===== SLIME XANH LỤC: Hoạt họa nhảy lò cò =====
            const jumpCycle = time * 0.012 + (e.x * 0.01);
            const jumpHeight = Math.max(0, Math.sin(jumpCycle) * 14);
            
            let squashStretchY = 1.0;
            let squashStretchX = 1.0;
            if (jumpHeight > 0.1) {
                squashStretchY = 1.15; // bay lên dài ra
                squashStretchX = 0.88;
            } else {
                const landSquash = Math.abs(Math.sin(jumpCycle)) > 0.8 ? 0.82 : 1.0;
                squashStretchY = landSquash; // chạm đất xẹp xuống
                squashStretchX = 1.9 - landSquash;
            }
            
            drawY -= jumpHeight;
            scaleX = squashStretchX;
            scaleY = squashStretchY;
            
            // Vẽ các hạt chất nhầy nhỏ bay sau khi slime nhảy
            if (jumpHeight > 6 && Math.random() < 0.15) {
                this.particles.push({
                    x: x + (Math.random() - 0.5) * r,
                    y: y + r * 0.5,
                    vx: (Math.random() - 0.5) * 1,
                    vy: 0.5 + Math.random() * 1.2,
                    color: rageColor ? "#ef4444" : "#22c55e",
                    alpha: 0.8,
                    life: 15 + Math.random() * 10,
                    maxLife: 25,
                    size: 1.5 + Math.random() * 2
                });
            }

        } else if (e.type === 'fast') {
            // ===== DƠI ÁM: Hoạt họa vỗ cánh bay nhanh =====
            const flapCycle = time * 0.032 + (e.x * 0.05);
            const hoverY = Math.sin(time * 0.009 + e.x * 0.02) * 7;
            
            // Co giãn ngang mô phỏng đôi cánh đập liên tục cực sinh động
            const wingFlap = 1 + Math.sin(flapCycle) * 0.3;
            
            drawY += hoverY;
            scaleX = wingFlap;
            scaleY = 1 - Math.sin(flapCycle) * 0.1; // co nhẹ chiều đứng khi cánh đập lên
            rotation = Math.sin(time * 0.005) * 0.08; // lắc lư nhẹ góc nghiêng

            // Thêm vệt sáng hạt neon phía sau dơi
            if (Math.random() < 0.25) {
                this.particles.push({
                    x: x - flipX * r * 0.5,
                    y: y + hoverY + (Math.random() - 0.5) * r * 0.6,
                    vx: -flipX * (1 + Math.random() * 1.5),
                    vy: (Math.random() - 0.5) * 0.8,
                    color: rageColor ? "#f87171" : "#c084fc",
                    alpha: 0.85,
                    life: 18 + Math.random() * 12,
                    maxLife: 30,
                    size: 1.5 + Math.random() * 2
                });
            }

        } else if (e.type === 'boss') {
            // ===== GOLEM ĐÁ NÚI LỬA: Đi bộ 3D nặng nề =====
            const walkCycle = time * 0.008 * e.speed + (e.x * 0.03);
            const legOffset1 = Math.sin(walkCycle) * 11;
            const legOffset2 = -Math.sin(walkCycle) * 11;
            const legYOffset1 = Math.max(0, Math.cos(walkCycle)) * 5;
            const legYOffset2 = Math.max(0, -Math.cos(walkCycle)) * 5;
            
            const bodyBob = Math.abs(Math.sin(walkCycle * 2)) * 3;
            drawY -= bodyBob;
            rotation = Math.sin(walkCycle) * 0.06; // vai lắc lư nhẹ theo bước chân
            
            // 1. Vẽ 2 chân đá khổng lồ 3D dưới gầm (vẽ trước thân để bị che đi một phần)
            ctx.save();
            ctx.fillStyle = rageColor ? "#7f1d1d" : "#334155";
            ctx.strokeStyle = rageColor ? "#ef4444" : "#1e293b";
            ctx.lineWidth = 2.5;
            
            // Chân trái
            ctx.beginPath();
            ctx.ellipse(x - r * 0.35 + legOffset1, y + r * 0.6 - legYOffset1, 10, 6, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            
            // Chân phải
            ctx.beginPath();
            ctx.ellipse(x + r * 0.35 + legOffset2, y + r * 0.6 - legYOffset2, 10, 6, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.restore();

            // Hiệu ứng khói bụi bốc lên mỗi khi chân golem dậm xuống đất
            if (Math.abs(Math.sin(walkCycle)) > 0.95 && Math.random() < 0.3) {
                const footX = Math.sin(walkCycle) > 0 ? x + r * 0.35 + legOffset2 : x - r * 0.35 + legOffset1;
                for (let k = 0; k < 3; k++) {
                    this.particles.push({
                        x: footX,
                        y: y + r * 0.6,
                        vx: (Math.random() - 0.5) * 1.5,
                        vy: -0.5 - Math.random() * 0.8,
                        color: rageColor ? "rgba(239, 68, 68, 0.45)" : "rgba(226, 232, 240, 0.45)",
                        alpha: 0.8,
                        life: 20 + Math.random() * 12,
                        maxLife: 32,
                        size: 2 + Math.random() * 2.5
                    });
                }
            }

        } else if (e.type === 'armored') {
            // ===== SLIME BỌC THÉP: Đi bộ cơ khí lon ton =====
            const walkCycle = time * 0.01 * e.speed + (e.x * 0.04);
            const legOffset1 = Math.sin(walkCycle) * 8;
            const legOffset2 = -Math.sin(walkCycle) * 8;
            const legYOffset1 = Math.max(0, Math.cos(walkCycle)) * 4;
            const legYOffset2 = Math.max(0, -Math.cos(walkCycle)) * 4;
            
            const bodyBob = Math.abs(Math.sin(walkCycle * 2)) * 2;
            drawY -= bodyBob;
            scaleY = 1.0 - bodyBob * 0.003;
            rotation = Math.sin(walkCycle) * 0.08;
            
            // 1. Vẽ 2 chân giáp sắt chibi dưới gầm
            ctx.save();
            ctx.fillStyle = rageColor ? "#991b1b" : "#475569";
            ctx.strokeStyle = rageColor ? "#f87171" : "#94a3b8";
            ctx.lineWidth = 2;
            
            // Chân trái
            ctx.beginPath();
            ctx.ellipse(x - r * 0.3 + legOffset1, y + r * 0.6 - legYOffset1, 8, 4, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            
            // Chân phải
            ctx.beginPath();
            ctx.ellipse(x + r * 0.3 + legOffset2, y + r * 0.6 - legYOffset2, 8, 4, 0, 0, Math.PI * 2);
            ctx.fill(); ctx.stroke();
            ctx.restore();

        } else if (e.type === 'healer') {
            // ===== PHÁP SƯ HỒI PHỤC: Bay lơ lửng lấp lánh phép thuật =====
            const hoverY = Math.sin(time * 0.008 + e.x * 0.02) * 8;
            drawY += hoverY;
            rotation = Math.sin(time * 0.004) * 0.07; // xoay nhẹ nhàng
            
            // Vẽ vòng sáng rune elip 3D dưới chân
            ctx.save();
            ctx.strokeStyle = rageColor ? "rgba(239, 68, 68, 0.5)" : "rgba(52, 211, 153, 0.5)";
            ctx.lineWidth = 1.8;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.ellipse(x, y + r * 0.6 + hoverY, r * 1.25, r * 0.42, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();

            // Phép thuật phát sáng bốc lên
            if (Math.random() < 0.22) {
                this.particles.push({
                    x: x + (Math.random() - 0.5) * r * 1.2,
                    y: y + r * 0.4 + hoverY,
                    vx: (Math.random() - 0.5) * 0.6,
                    vy: -1.2 - Math.random() * 1.5,
                    color: rageColor ? "#f87171" : "#34d399",
                    alpha: 0.9,
                    life: 22 + Math.random() * 15,
                    maxLife: 37,
                    size: 1.5 + Math.random() * 2
                });
            }
        }

        // --- VẼ HÌNH ẢNH QUÁI VẬT 3D CHIBI ---
        if (this.imagesLoaded && img) {
            ctx.save();
            ctx.translate(drawX, drawY);
            ctx.rotate(rotation);
            ctx.scale(flipX * scaleX, scaleY);
            
            if (filterStr !== "none") {
                ctx.filter = filterStr;
            }
            
            const dWidth = r * 2.2;
            const dHeight = r * 2.2;
            ctx.drawImage(img, -dWidth / 2, -dHeight / 2, dWidth, dHeight);
            
            ctx.restore();
        } else {
            // Fallback vẽ vector đơn giản nếu ảnh bị lỗi tải
            ctx.save();
            ctx.fillStyle = e.color || "#cccccc";
            ctx.beginPath();
            ctx.arc(x, drawY, r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        ctx.restore();
    },

    // Hàm vẽ một tháp cụ thể lên Canvas (dùng chung cho tháp thực tế, preview và tháp xác nhận)
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = MonsterRenderer;
    if (typeof root !== 'undefined') root.MonsterRenderer = MonsterRenderer;
})(typeof window !== 'undefined' ? window : global);
