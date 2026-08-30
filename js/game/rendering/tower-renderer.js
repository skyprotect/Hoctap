/**
 * GAME ENGINE - TOWER RENDERER
 */
(function(root) {
    'use strict';

    const TowerRenderer = {
        drawSingleTower: function(t) {
        // Xác định bộ lọc hình ảnh theo cấp độ nâng cấp tháp
        let filterStr = "none";
        if (t.level === 2) {
            // Cấp 2: Ánh sáng xanh băng / Lam ngọc
            filterStr = "hue-rotate(120deg) saturate(1.5) brightness(1.05)";
        } else if (t.level === 3) {
            // Cấp 3: Vàng hoàng kim / Hỏa tinh
            filterStr = "hue-rotate(-50deg) saturate(2) brightness(1.2)";
        } else if (t.level >= 4) {
            // Cấp 4+: Tím vũ trụ / Siêu cấp
            filterStr = "hue-rotate(240deg) saturate(2.2) brightness(1.3)";
        }

        // Vẽ hiệu ứng Tháp Nâng Cấp Hiện Đại (Cấp 2, Cấp 3+)
        if (t.level >= 2) {
            this.ctx.save();
            // Vòng đệm Neon phát sáng quanh chân tháp nâng cấp
            this.ctx.strokeStyle = t.level >= 3 ? "#fbbf24" : "#38bdf8";
            this.ctx.lineWidth = 2.5;
            this.ctx.shadowColor = t.level >= 3 ? "#fbbf24" : "#38bdf8";
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.arc(t.x, t.y + 6, 22, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.restore();
        }

        if (this.imagesLoaded && ['archer', 'ice', 'bomb', 'soldier'].includes(t.type) && this.images['tower_' + t.type]) {
            // Vẽ bóng đổ dưới chân tháp
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            this.ctx.beginPath();
            this.ctx.ellipse(t.x, t.y + 8, 16, 5, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Vẽ tháp bằng hình ảnh Pixel Art đã lọc nền kèm bộ lọc theo cấp độ
            const img = this.images['tower_' + t.type];
            this.ctx.save();
            if (filterStr !== "none") {
                this.ctx.filter = filterStr;
            }
            this.ctx.drawImage(img, t.x - 22, t.y - 34, 44, 46);
            this.ctx.restore();
            
            // Trang trí thêm các chi tiết thực tế tùy theo Cấp độ (để hình ảnh khác biệt hoàn toàn)
            if (t.level === 2) {
                // Vẽ 1 viên ngọc xanh phát sáng trên nóc tháp
                this.ctx.save();
                this.ctx.fillStyle = "#38bdf8";
                this.ctx.shadowColor = "#38bdf8";
                this.ctx.shadowBlur = 8;
                this.ctx.beginPath();
                this.ctx.arc(t.x, t.y - 32, 4, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            } else if (t.level === 3) {
                // Vẽ 2 cờ đuôi nheo màu đỏ/vàng hai bên tháp
                this.ctx.save();
                this.ctx.fillStyle = "#fbbf24";
                this.ctx.beginPath();
                // Cờ bên trái
                this.ctx.moveTo(t.x - 18, t.y - 20);
                this.ctx.lineTo(t.x - 26, t.y - 25);
                this.ctx.lineTo(t.x - 18, t.y - 30);
                this.ctx.fill();
                // Cờ bên phải
                this.ctx.beginPath();
                this.ctx.moveTo(t.x + 18, t.y - 20);
                this.ctx.lineTo(t.x + 26, t.y - 25);
                this.ctx.lineTo(t.x + 18, t.y - 30);
                this.ctx.fill();
                
                // Ngọc vàng trung tâm
                this.ctx.fillStyle = "#f59e0b";
                this.ctx.shadowColor = "#fbbf24";
                this.ctx.shadowBlur = 12;
                this.ctx.beginPath();
                this.ctx.arc(t.x, t.y - 32, 6, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            } else if (t.level >= 4) {
                // Cấp 4+: Hào quang và vòng xoay ma thuật tím trên đỉnh
                this.ctx.save();
                this.ctx.strokeStyle = "rgba(168, 85, 247, 0.7)";
                this.ctx.lineWidth = 1.5;
                this.ctx.beginPath();
                this.ctx.ellipse(t.x, t.y - 36, 12, 4, 0, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // Viên ngọc hắc ám lơ lửng
                const bob = Math.sin(Date.now() * 0.006) * 3;
                this.ctx.fillStyle = "#c084fc";
                this.ctx.shadowColor = "#a855f7";
                this.ctx.shadowBlur = 15;
                this.ctx.beginPath();
                this.ctx.arc(t.x, t.y - 38 + bob, 7, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            }
        } else {
            // Fallback vẽ hình học vector nâng cấp theo cấp độ & loại tháp
            if (t.type === 'archer') {
                if (t.level === 1) {
                    // Tháp cung gỗ cấp 1
                    this.ctx.fillStyle = "#78350f";
                    this.ctx.fillRect(t.x - 9, t.y - 18, 18, 26);
                    this.ctx.fillStyle = "#ea580c";
                    this.ctx.beginPath();
                    this.ctx.moveTo(t.x - 14, t.y - 18);
                    this.ctx.lineTo(t.x, t.y - 34);
                    this.ctx.lineTo(t.x + 14, t.y - 18);
                    this.ctx.closePath();
                    this.ctx.fill();
                    this.ctx.fillStyle = "#fbbf24";
                    this.ctx.font = "bold 11px sans-serif";
                    this.ctx.textAlign = "center";
                    this.ctx.textBaseline = "middle";
                    this.ctx.fillText("🏹", t.x, t.y - 3);
                } else if (t.level === 2) {
                    // Tháp đá cường hóa cấp 2
                    this.ctx.fillStyle = "#475569";
                    this.ctx.fillRect(t.x - 11, t.y - 20, 22, 28);
                    this.ctx.fillStyle = "#0284c7"; // Mái xanh lam
                    this.ctx.beginPath();
                    this.ctx.moveTo(t.x - 16, t.y - 20);
                    this.ctx.lineTo(t.x, t.y - 38);
                    this.ctx.lineTo(t.x + 16, t.y - 20);
                    this.ctx.closePath();
                    this.ctx.fill();
                    // Ngọc xanh lam ở đỉnh
                    this.ctx.fillStyle = "#38bdf8";
                    this.ctx.beginPath();
                    this.ctx.arc(t.x, t.y - 38, 4, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.fillStyle = "#ffffff";
                    this.ctx.font = "bold 12px sans-serif";
                    this.ctx.textAlign = "center";
                    this.ctx.fillText("🏹🏹", t.x, t.y - 5);
                } else if (t.level === 3) {
                    // Pháo đài cổ hoàng kim cấp 3
                    this.ctx.fillStyle = "#1e293b";
                    this.ctx.fillRect(t.x - 13, t.y - 24, 26, 32);
                    this.ctx.fillStyle = "#eab308"; // Mái vàng
                    this.ctx.beginPath();
                    this.ctx.moveTo(t.x - 18, t.y - 24);
                    this.ctx.lineTo(t.x, t.y - 42);
                    this.ctx.lineTo(t.x + 18, t.y - 24);
                    this.ctx.closePath();
                    this.ctx.fill();
                    // Lá cờ vàng
                    this.ctx.fillStyle = "#eab308";
                    this.ctx.fillRect(t.x - 1, t.y - 52, 2, 10);
                    this.ctx.beginPath();
                    this.ctx.moveTo(t.x + 1, t.y - 52);
                    this.ctx.lineTo(t.x + 12, t.y - 47);
                    this.ctx.lineTo(t.x + 1, t.y - 42);
                    this.ctx.fill();
                    this.ctx.fillStyle = "#ffffff";
                    this.ctx.font = "bold 13px sans-serif";
                    this.ctx.textAlign = "center";
                    this.ctx.fillText("🔱", t.x, t.y - 8);
                } else {
                    // Đền thờ thần tiễn siêu cấp (Lv4+)
                    this.ctx.fillStyle = "#3b0764"; // Đá tím
                    this.ctx.fillRect(t.x - 14, t.y - 26, 28, 34);
                    this.ctx.fillStyle = "#a855f7"; // Mái tím neon
                    this.ctx.beginPath();
                    this.ctx.moveTo(t.x - 20, t.y - 26);
                    this.ctx.lineTo(t.x, t.y - 46);
                    this.ctx.lineTo(t.x + 20, t.y - 26);
                    this.ctx.closePath();
                    this.ctx.fill();
                    // Quả cầu năng lượng tím bay lơ lửng
                    const bob = Math.sin(Date.now() * 0.007) * 3;
                    this.ctx.fillStyle = "#c084fc";
                    this.ctx.shadowColor = "#c084fc";
                    this.ctx.shadowBlur = 12;
                    this.ctx.beginPath();
                    this.ctx.arc(t.x, t.y - 52 + bob, 5, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;
                    this.ctx.fillStyle = "#ffffff";
                    this.ctx.font = "bold 14px sans-serif";
                    this.ctx.textAlign = "center";
                    this.ctx.fillText("⚡", t.x, t.y - 8);
                }
            } else if (t.type === 'ice') {
                if (t.level === 1) {
                    this.ctx.fillStyle = "#5b21b6";
                    this.ctx.beginPath();
                    this.ctx.ellipse(t.x, t.y + 8, 18, 7, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                    const crystalGrad = this.ctx.createLinearGradient(t.x - 10, t.y - 28, t.x + 10, t.y + 6);
                    crystalGrad.addColorStop(0, "#e0f2fe");
                    crystalGrad.addColorStop(0.5, "#38bdf8");
                    crystalGrad.addColorStop(1, "#0369a1");
                    this.ctx.fillStyle = crystalGrad;
                    this.ctx.beginPath();
                    this.ctx.moveTo(t.x, t.y - 32);
                    this.ctx.lineTo(t.x + 10, t.y - 6);
                    this.ctx.lineTo(t.x + 6, t.y + 6);
                    this.ctx.lineTo(t.x - 6, t.y + 6);
                    this.ctx.lineTo(t.x - 10, t.y - 6);
                    this.ctx.closePath();
                    this.ctx.fill();
                } else if (t.level === 2) {
                    // Cấp 2: 2 tinh thể băng song sinh
                    this.ctx.fillStyle = "#1e1b4b";
                    this.ctx.beginPath();
                    this.ctx.ellipse(t.x, t.y + 8, 20, 7, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.fillStyle = "#38bdf8";
                    this.ctx.beginPath();
                    // Tinh thể trái
                    this.ctx.moveTo(t.x - 6, t.y - 35);
                    this.ctx.lineTo(t.x, t.y - 4);
                    this.ctx.lineTo(t.x - 12, t.y - 4);
                    this.ctx.fill();
                    // Tinh thể phải
                    this.ctx.fillStyle = "#7dd3fc";
                    this.ctx.beginPath();
                    this.ctx.moveTo(t.x + 6, t.y - 35);
                    this.ctx.lineTo(t.x + 12, t.y - 4);
                    this.ctx.lineTo(t.x, t.y - 4);
                    this.ctx.fill();
                } else if (t.level === 3) {
                    // Cấp 3: Đại pháp đài băng tinh thể tam giác
                    this.ctx.fillStyle = "#0f172a";
                    this.ctx.beginPath();
                    this.ctx.ellipse(t.x, t.y + 8, 22, 8, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.fillStyle = "#0284c7";
                    this.ctx.beginPath();
                    this.ctx.moveTo(t.x, t.y - 42);
                    this.ctx.lineTo(t.x + 14, t.y);
                    this.ctx.lineTo(t.x - 14, t.y);
                    this.ctx.fill();
                    this.ctx.fillStyle = "#e0f2fe";
                    this.ctx.beginPath();
                    this.ctx.arc(t.x, t.y - 42, 5, 0, Math.PI * 2);
                    this.ctx.fill();
                } else {
                    // Cấp 4+: Hố đen băng giá bay lơ lửng
                    this.ctx.fillStyle = "#090d16";
                    this.ctx.beginPath();
                    this.ctx.ellipse(t.x, t.y + 8, 24, 8, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                    const timeAngle = Date.now() * 0.005;
                    this.ctx.save();
                    this.ctx.translate(t.x, t.y - 20);
                    this.ctx.rotate(timeAngle);
                    this.ctx.fillStyle = "#38bdf8";
                    this.ctx.fillRect(-12, -12, 24, 24);
                    this.ctx.rotate(Math.PI / 4);
                    this.ctx.fillStyle = "#e0f2fe";
                    this.ctx.fillRect(-8, -8, 16, 16);
                    this.ctx.restore();
                }
            } else if (t.type === 'bomb') {
                if (t.level === 1) {
                    this.ctx.fillStyle = "#1e293b";
                    this.ctx.beginPath();
                    this.ctx.ellipse(t.x, t.y + 8, 18, 7, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.fillStyle = "#475569";
                    this.ctx.beginPath();
                    this.ctx.arc(t.x, t.y, 13, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.save();
                    this.ctx.translate(t.x, t.y);
                    this.ctx.rotate(t.angle || -Math.PI / 2);
                    this.ctx.fillStyle = "#0f172a";
                    this.ctx.fillRect(0, -5, 24, 10);
                    this.ctx.restore();
                } else if (t.level === 2) {
                    // Cấp 2: Tháp pháo kép cản quái
                    this.ctx.fillStyle = "#334155";
                    this.ctx.beginPath();
                    this.ctx.ellipse(t.x, t.y + 8, 20, 8, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.fillStyle = "#64748b";
                    this.ctx.beginPath();
                    this.ctx.arc(t.x, t.y, 15, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.save();
                    this.ctx.translate(t.x, t.y);
                    this.ctx.rotate(t.angle || -Math.PI / 2);
                    this.ctx.fillStyle = "#0f172a";
                    // 2 nòng súng kép
                    this.ctx.fillRect(0, -7, 26, 5);
                    this.ctx.fillRect(0, 2, 26, 5);
                    this.ctx.restore();
                } else if (t.level === 3) {
                    // Cấp 3: Đại pháo đài rồng phun lửa
                    this.ctx.fillStyle = "#1e293b";
                    this.ctx.beginPath();
                    this.ctx.ellipse(t.x, t.y + 8, 22, 8, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.fillStyle = "#b91c1c";
                    this.ctx.beginPath();
                    this.ctx.arc(t.x, t.y, 16, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.save();
                    this.ctx.translate(t.x, t.y);
                    this.ctx.rotate(t.angle || -Math.PI / 2);
                    this.ctx.fillStyle = "#7f1d1d";
                    this.ctx.fillRect(0, -6, 28, 12);
                    this.ctx.fillStyle = "#fbbf24";
                    this.ctx.fillRect(24, -4, 6, 8); // đầu nòng vàng phát sáng
                    this.ctx.restore();
                } else {
                    // Cấp 4+: Tháp pháo plasma siêu cấp
                    this.ctx.fillStyle = "#0f051d";
                    this.ctx.beginPath();
                    this.ctx.ellipse(t.x, t.y + 8, 24, 8, 0, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.fillStyle = "#7c3aed";
                    this.ctx.beginPath();
                    this.ctx.arc(t.x, t.y, 17, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.save();
                    this.ctx.translate(t.x, t.y);
                    this.ctx.rotate(t.angle || -Math.PI / 2);
                    this.ctx.fillStyle = "#4c1d95";
                    this.ctx.fillRect(0, -5, 30, 10);
                    // Lõi phát sáng xanh plasma
                    this.ctx.fillStyle = "#22d3ee";
                    this.ctx.fillRect(10, -2, 22, 4);
                    this.ctx.restore();
                }
            } else if (t.type === 'soldier') {
                if (t.level === 1) {
                    this.ctx.fillStyle = "#15803d";
                    this.ctx.fillRect(t.x - 12, t.y - 14, 24, 22);
                    this.ctx.fillStyle = "#fbbf24";
                    this.ctx.font = "bold 13px sans-serif";
                    this.ctx.textAlign = "center";
                    this.ctx.fillText("🛡️", t.x, t.y - 2);
                } else if (t.level === 2) {
                    // Binh doanh cấp 2: Nhà gạch có mái thép che chắn
                    this.ctx.fillStyle = "#b45309";
                    this.ctx.fillRect(t.x - 14, t.y - 16, 28, 24);
                    this.ctx.fillStyle = "#64748b";
                    this.ctx.fillRect(t.x - 16, t.y - 20, 32, 5);
                    this.ctx.fillStyle = "#ffffff";
                    this.ctx.font = "bold 12px sans-serif";
                    this.ctx.textAlign = "center";
                    this.ctx.fillText("⚔️", t.x, t.y - 4);
                } else if (t.level === 3) {
                    // Pháo đài quân sự cấp 3
                    this.ctx.fillStyle = "#334155";
                    this.ctx.fillRect(t.x - 16, t.y - 20, 32, 28);
                    this.ctx.fillStyle = "#ea580c"; // Mái đỏ
                    this.ctx.fillRect(t.x - 18, t.y - 24, 36, 5);
                    this.ctx.fillStyle = "#ffffff";
                    this.ctx.font = "bold 13px sans-serif";
                    this.ctx.textAlign = "center";
                    this.ctx.fillText("🏰", t.x, t.y - 6);
                } else {
                    // Thánh điện Kỵ sĩ siêu cấp (Lv4+)
                    this.ctx.fillStyle = "#1e293b";
                    this.ctx.fillRect(t.x - 18, t.y - 22, 36, 30);
                    // Cột thánh điện hai bên
                    this.ctx.fillStyle = "#fbbf24";
                    this.ctx.fillRect(t.x - 18, t.y - 26, 4, 34);
                    this.ctx.fillRect(t.x + 14, t.y - 26, 4, 34);
                    this.ctx.fillStyle = "#f59e0b";
                    this.ctx.fillRect(t.x - 20, t.y - 28, 8, 4);
                    this.ctx.fillRect(t.x + 12, t.y - 28, 8, 4);
                    this.ctx.fillStyle = "#ffffff";
                    this.ctx.font = "bold 14px sans-serif";
                    this.ctx.textAlign = "center";
                    this.ctx.fillText("👼", t.x, t.y - 6);
                }
            } else if (t.type === 'thunder') {
                // Tháp Sấm Sét vector
                this.ctx.fillStyle = "#312e81";
                this.ctx.fillRect(t.x - 10, t.y - 20, 20, 28);
                this.ctx.fillStyle = "#fbbf24";
                this.ctx.fillRect(t.x - 12, t.y - 22, 4, 6);
                this.ctx.fillRect(t.x + 8, t.y - 22, 4, 6);
                const bob = Math.sin(Date.now() * 0.008) * 3;
                const glowGrad = this.ctx.createRadialGradient(t.x, t.y - 34 + bob, 1, t.x, t.y - 34 + bob, 10);
                glowGrad.addColorStop(0, "#ffffff");
                glowGrad.addColorStop(0.4, "#06b6d4");
                glowGrad.addColorStop(1, "rgba(6, 182, 212, 0)");
                this.ctx.fillStyle = glowGrad;
                this.ctx.beginPath();
                this.ctx.arc(t.x, t.y - 34 + bob, 10, 0, Math.PI * 2);
                this.ctx.fill();
                
                if (t.level >= 2) {
                    this.ctx.strokeStyle = "#22d3ee";
                    this.ctx.lineWidth = 1.5;
                    this.ctx.beginPath();
                    this.ctx.arc(t.x, t.y - 34 + bob, 14, 0, Math.PI * 2);
                    this.ctx.stroke();
                }
                this.ctx.fillStyle = "#ffffff";
                this.ctx.font = "bold 11px sans-serif";
                this.ctx.textAlign = "center";
                this.ctx.fillText("⚡", t.x, t.y - 3);
            } else if (t.type === 'laser') {
                // Tháp Laser vector
                this.ctx.fillStyle = "#7f1d1d";
                this.ctx.fillRect(t.x - 12, t.y - 18, 24, 26);
                this.ctx.fillStyle = "#ef4444";
                this.ctx.fillRect(t.x - 8, t.y - 25, 16, 7);
                const pulse = 6 + Math.sin(Date.now() * 0.015) * 2;
                const crystalGrad = this.ctx.createRadialGradient(t.x, t.y - 35, 1, t.x, t.y - 35, pulse);
                crystalGrad.addColorStop(0, "#ffffff");
                crystalGrad.addColorStop(0.6, "#ec4899");
                crystalGrad.addColorStop(1, "rgba(236, 72, 153, 0)");
                this.ctx.fillStyle = crystalGrad;
                this.ctx.beginPath();
                this.ctx.arc(t.x, t.y - 35, pulse, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.fillStyle = "#ffffff";
                this.ctx.font = "bold 11px sans-serif";
                this.ctx.textAlign = "center";
                this.ctx.fillText("📡", t.x, t.y - 3);
            } else if (t.type === 'poison') {
                // Tháp Độc Học vector
                this.ctx.fillStyle = "#4a044e";
                this.ctx.fillRect(t.x - 12, t.y - 20, 24, 28);
                this.ctx.fillStyle = "#c084fc";
                this.ctx.fillRect(t.x - 8, t.y - 14, 16, 18);
                const bubbleY = t.y - 24 + Math.sin(Date.now() * 0.005) * 2;
                this.ctx.fillStyle = "#d8b4fe";
                this.ctx.beginPath();
                this.ctx.arc(t.x - 4, bubbleY, 3, 0, Math.PI * 2);
                this.ctx.arc(t.x + 5, bubbleY - 2, 2.5, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.fillStyle = "#ffffff";
                this.ctx.font = "bold 11px sans-serif";
                this.ctx.textAlign = "center";
                this.ctx.fillText("🧪", t.x, t.y - 2);
            } else if (t.type === 'fire') {
                // Tháp Hỏa Long vector
                this.ctx.fillStyle = "#1c1917";
                this.ctx.fillRect(t.x - 13, t.y - 22, 26, 30);
                this.ctx.fillStyle = "#f97316";
                this.ctx.fillRect(t.x - 8, t.y - 14, 3, 14);
                this.ctx.fillRect(t.x + 5, t.y - 14, 3, 14);
                const pulseSize = 8 + Math.sin(Date.now() * 0.01) * 2.5;
                const lavaGrad = this.ctx.createRadialGradient(t.x, t.y - 35, 1, t.x, t.y - 35, pulseSize);
                lavaGrad.addColorStop(0, "#facc15");
                lavaGrad.addColorStop(0.5, "#f97316");
                lavaGrad.addColorStop(1, "rgba(249, 115, 22, 0)");
                this.ctx.fillStyle = lavaGrad;
                this.ctx.beginPath();
                this.ctx.arc(t.x, t.y - 35, pulseSize, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.fillStyle = "#ffffff";
                this.ctx.font = "bold 11px sans-serif";
                this.ctx.textAlign = "center";
                this.ctx.fillText("🌋", t.x, t.y - 3);
            } else if (t.type === 'void') {
                // Tháp Vô Cực vector
                this.ctx.fillStyle = "#0f172a";
                this.ctx.fillRect(t.x - 14, t.y - 24, 28, 32);
                this.ctx.save();
                this.ctx.translate(t.x, t.y - 38);
                this.ctx.rotate(Date.now() * 0.005);
                this.ctx.strokeStyle = "#6366f1";
                this.ctx.lineWidth = 2.5;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 11, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.fillStyle = "#020617";
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 7, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
                this.ctx.fillStyle = "#ffffff";
                this.ctx.font = "bold 11px sans-serif";
                this.ctx.textAlign = "center";
                this.ctx.fillText("🌀", t.x, t.y - 3);
            }
        }

        // Nếu tháp cấp cao (Cấp 3+), vẽ thêm nòng kép/hào quang năng lượng cực hiện đại
        if (t.level >= 3) {
            this.ctx.save();
            this.ctx.fillStyle = "#fbbf24";
            this.ctx.font = "bold 10px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("✨MAX", t.x, t.y - 38);
            this.ctx.restore();
        }
        
        // Vẽ chữ Level tháp
        this.ctx.fillStyle = "#ffffff";
        this.ctx.font = "bold 9px sans-serif";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("Lv" + t.level, t.x, t.y + 11);
    },

    // Sinh các vị trí trang trí bản đồ cố định
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = TowerRenderer;
    if (typeof root !== 'undefined') root.TowerRenderer = TowerRenderer;
})(typeof window !== 'undefined' ? window : global);
