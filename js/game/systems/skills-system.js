/**
 * GAME ENGINE - ACTIVE SKILLS SYSTEM
 */
(function(root) {
    'use strict';

    const SkillsSystem = {
        renderSkillsHUD: function() {
        const wrapper = document.getElementById("skills-buttons-wrapper");
        if (!wrapper) return;
        
        const heroId = (this.hero && this.hero.selectedId) ? this.hero.selectedId : 'light_warrior';
        const skills = this.skillsConfig[heroId] || this.skillsConfig['light_warrior'];
        
        let html = "";
        skills.forEach(skill => {
            html += `
                <button class="btn-skill" id="btn-skill-${skill.id}" onclick="game.castSkill('${skill.id}')" title="${skill.title}">
                    <div class="btn-skill-inner">
                        <span class="skill-emoji">${skill.emoji}</span>
                    </div>
                    <span class="skill-cost-badge">${skill.cost}</span>
                </button>
            `;
        });
        wrapper.innerHTML = html;
        this.renderedHeroSkillsId = heroId;
    },

    // Cập nhật giao diện thanh Mana và trạng thái các nút kỹ năng
    updateSkillsHUD: function() {
        const heroId = (this.hero && this.hero.selectedId) ? this.hero.selectedId : 'light_warrior';
        if (this.renderedHeroSkillsId !== heroId) {
            this.renderSkillsHUD();
        }

        const manaFill = document.getElementById("hero-mana-fill");
        const manaText = document.getElementById("hero-mana-text");
        if (manaText) manaText.innerText = `Mana: ${Math.floor(this.mana)}/${this.maxMana}`;
        if (manaFill) manaFill.style.width = `${(this.mana / this.maxMana) * 100}%`;
        
        const skills = this.skillsConfig[heroId] || this.skillsConfig['light_warrior'];
        const canUse = this.isPlaying && this.isWaveActive;
        
        skills.forEach(skill => {
            const btn = document.getElementById(`btn-skill-${skill.id}`);
            if (btn) {
                const hasEnoughMana = this.mana >= skill.cost && canUse;
                btn.disabled = !hasEnoughMana;
                if (hasEnoughMana) {
                    btn.classList.add("ready");
                } else {
                    btn.classList.remove("ready");
                }
            }
        });
    },

    // Thực hiện từng bước của Siêu Kỹ Năng (Chia làm 3 lần với 1/3 hiệu lực mỗi lần)
    executeSkillStep: function(heroId, skillId, step) {
        if (!this.isPlaying || !this.isWaveActive) return;
        
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        if (heroId === 'light_warrior') {
            if (skillId === 'skill1') {
                if (window.app && app.audio) {
                    app.audio.playTdSound('sword_slash');
                    app.audio.playSwordHit();
                }
                const dmg = (step === 3) ? 84 : 83;
                this.screenShake = Math.max(this.screenShake || 0, 18);
                this.spawnPopup(480, 200, `⚔️ KIẾM KHÍ CÀN KHÔN (Lần ${step})`, "#fbbf24", 20);
                
                this.enemies.forEach(e => {
                    e.hp -= dmg;
                    this.checkEnemyDead(e, e.x, e.y);
                    
                    for (let k = 0; k < 6; k++) {
                        this.particles.push({
                            x: e.x + (Math.random() - 0.5) * 16,
                            y: e.y + (Math.random() - 0.5) * 36,
                            vx: (Math.random() - 0.5) * 4,
                            vy: (Math.random() - 0.5) * 4,
                            color: "#fbbf24", alpha: 1, life: 15, maxLife: 15, size: 2.5
                        });
                    }
                });

                // Hiệu ứng chém X khổng lồ chói lọi - phát sáng neon, vệt cắt trắng
                this.activeEffects.push({
                    timer: 18,
                    maxTimer: 18,
                    step: step,
                    draw: function(ctx, w, h) {
                        const progress = (this.maxTimer - this.timer) / this.maxTimer;
                        const alpha = 1 - progress;
                        ctx.save();
                        ctx.shadowBlur = 25;
                        ctx.shadowColor = "#fbbf24";
                        ctx.lineCap = "round";
                        
                        // Đường chém chính 1
                        if (this.step === 1 || this.step === 3) {
                            ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`;
                            ctx.lineWidth = 22;
                            ctx.beginPath();
                            ctx.moveTo(80, 80);
                            ctx.lineTo(80 + (w - 160) * progress, 80 + (h - 160) * progress);
                            ctx.stroke();

                            // Lõi trắng chói lọi
                            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                            ctx.lineWidth = 6;
                            ctx.beginPath();
                            ctx.moveTo(80, 80);
                            ctx.lineTo(80 + (w - 160) * progress, 80 + (h - 160) * progress);
                            ctx.stroke();
                        }
                        // Đường chém chính 2
                        if (this.step === 2 || this.step === 3) {
                            ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`;
                            ctx.lineWidth = 22;
                            ctx.beginPath();
                            ctx.moveTo(w - 80, 80);
                            ctx.lineTo(w - 80 - (w - 160) * progress, 80 + (h - 160) * progress);
                            ctx.stroke();

                            // Lõi trắng chói lọi
                            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                            ctx.lineWidth = 6;
                            ctx.beginPath();
                            ctx.moveTo(w - 80, 80);
                            ctx.lineTo(w - 80 - (w - 160) * progress, 80 + (h - 160) * progress);
                            ctx.stroke();
                        }
                        
                        // Vẽ vệt gió chém phụ xung quanh
                        ctx.strokeStyle = `rgba(254, 240, 138, ${alpha * 0.6})`;
                        ctx.lineWidth = 3;
                        ctx.beginPath();
                        ctx.moveTo(100, 150 * progress);
                        ctx.lineTo(w - 100, h - 150 * progress);
                        ctx.stroke();
                        ctx.restore();
                    }
                });
                
            } else if (skillId === 'skill2') {
                if (window.app && app.audio) app.audio.playMagicSpell();
                this.spawnPopup(480, 200, `🛡️ CHIẾN THẦN HỘ THỂ (Lần ${step})`, "#ef4444", 20);
                this.towerDmgBuffTimer = (this.towerDmgBuffTimer || 0) + 120; // cộng dồn 2 giây mỗi bước
                
                this.towers.forEach(t => {
                    for (let k = 0; k < 8; k++) {
                        this.particles.push({
                            x: t.x + (Math.random() - 0.5) * 35,
                            y: t.y + (Math.random() - 0.5) * 35,
                            vx: (Math.random() - 0.5) * 2,
                            vy: -1.2 - Math.random() * 2.5,
                            color: "#ef4444", alpha: 1, life: 30, maxLife: 30, size: 2.5
                        });
                    }
                });

                // Vòng ma pháp trận xoay và khiên bảo vệ tháp
                this.activeEffects.push({
                    timer: 45,
                    maxTimer: 45,
                    step: step,
                    draw: function(ctx, w, h) {
                        const progress = (this.maxTimer - this.timer) / this.maxTimer;
                        const alpha = Math.sin(progress * Math.PI);
                        ctx.save();
                        
                        // Vignette đỏ viền màn hình
                        ctx.fillStyle = `rgba(239, 68, 68, ${alpha * 0.22})`;
                        ctx.fillRect(0, 0, w, h);
                        
                        // Vẽ vòng ma pháp trận ở tâm màn hình
                        ctx.translate(w / 2, h / 2);
                        ctx.rotate(this.timer * 0.02 * (this.step % 2 === 0 ? 1 : -1));
                        
                        ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.8})`;
                        ctx.shadowBlur = 15;
                        ctx.shadowColor = "#ef4444";
                        
                        // Vòng ngoài
                        ctx.lineWidth = 3.5;
                        ctx.beginPath();
                        ctx.arc(0, 0, 160, 0, Math.PI * 2);
                        ctx.stroke();
                        
                        // Vòng trong
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.arc(0, 0, 130, 0, Math.PI * 2);
                        ctx.stroke();
                        
                        // Ngôi sao tam giác ma pháp
                        ctx.beginPath();
                        for (let j = 0; j < 3; j++) {
                            const angle = (j * Math.PI * 2) / 3;
                            const tx = Math.cos(angle) * 130;
                            const ty = Math.sin(angle) * 130;
                            if (j === 0) ctx.moveTo(tx, ty);
                            else ctx.lineTo(tx, ty);
                        }
                        ctx.closePath();
                        ctx.stroke();
                        
                        ctx.restore();
                        
                        // Vẽ khiên bọc quanh các tháp
                        game.towers.forEach(t => {
                            ctx.save();
                            ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.9})`;
                            ctx.fillStyle = `rgba(239, 68, 68, ${alpha * 0.12})`;
                            ctx.lineWidth = 2;
                            ctx.shadowBlur = 10;
                            ctx.shadowColor = "#ef4444";
                            ctx.beginPath();
                            ctx.arc(t.x, t.y - 12, 32, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.stroke();
                            ctx.restore();
                        });
                    }
                });
                
            } else if (skillId === 'skill3') {
                if (window.app && app.audio) {
                    app.audio.playTdSound('thunder');
                    app.audio.playMagicSpell();
                }
                const dmg = (step === 3) ? 166 : 167;
                const threshold = step * 0.133; // 13.3%, 26.6%, 40%
                this.screenShake = Math.max(this.screenShake || 0, 30); // Rung lắc cực mạnh
                this.spawnPopup(480, 200, `☀️ QUANG MINH PHÁN QUYẾT (Lần ${step})`, "#ffd700", 20);
                
                this.enemies.forEach(e => {
                    const ratio = e.hp / e.maxHp;
                    if (ratio < threshold && e.type !== 'boss') {
                        e.hp = 0;
                        this.spawnPopup(e.x, e.y - 20, "TIÊU DIỆT! 💀", "#ffffff", 14);
                    } else {
                        e.hp -= dmg;
                    }
                    this.checkEnemyDead(e, e.x, e.y);
                    
                    for (let k = 0; k < 12; k++) {
                        this.particles.push({
                            x: e.x + (Math.random() - 0.5) * 20,
                            y: e.y - Math.random() * 80,
                            vx: (Math.random() - 0.5) * 1.5,
                            vy: 3 + Math.random() * 4,
                            color: "#ffffff", alpha: 1, life: 25, maxLife: 25, size: 2.2
                        });
                    }
                });

                // Cột ánh sáng thiên giới cực lớn nổ shockwave dưới chân
                this.activeEffects.push({
                    timer: 45,
                    maxTimer: 45,
                    step: step,
                    draw: function(ctx, w, h) {
                        const progress = (this.maxTimer - this.timer) / this.maxTimer;
                        const alpha = Math.sin(progress * Math.PI);
                        ctx.save();
                        
                        const cols = [];
                        if (this.step === 1 || this.step === 3) cols.push(w * 0.25);
                        if (this.step === 2 || this.step === 3) cols.push(w * 0.5);
                        if (this.step === 3) cols.push(w * 0.75);
                        
                        cols.forEach(x => {
                            // Hào quang tỏa sáng của cột sáng
                            ctx.shadowBlur = 40;
                            ctx.shadowColor = "#f59e0b";
                            
                            const grad = ctx.createLinearGradient(x - 55, 0, x + 55, 0);
                            grad.addColorStop(0, "rgba(251, 191, 36, 0)");
                            grad.addColorStop(0.3, `rgba(255, 255, 255, ${alpha * 0.95})`);
                            grad.addColorStop(0.5, `rgba(255, 255, 255, ${alpha})`);
                            grad.addColorStop(0.7, `rgba(255, 255, 255, ${alpha * 0.95})`);
                            grad.addColorStop(1, "rgba(251, 191, 36, 0)");
                            
                            ctx.fillStyle = grad;
                            ctx.fillRect(x - 70, 0, 140, h);
                            
                            // Sóng xung kích lan tỏa tỏa tròn dưới chân cột sáng
                            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.85})`;
                            ctx.lineWidth = 4;
                            ctx.beginPath();
                            ctx.ellipse(x, h - 80, 80 * progress, 30 * progress, 0, 0, Math.PI * 2);
                            ctx.stroke();
                        });
                        ctx.restore();
                    }
                });
            }
        } else if (heroId === 'frost_mage') {
            if (skillId === 'skill1') {
                if (window.app && app.audio) app.audio.playTdSound('ice');
                const dmg = 40;
                this.screenShake = Math.max(this.screenShake || 0, 8);
                this.spawnPopup(480, 200, `🌨️ BĂNG CHÂM VŨ (Lần ${step})`, "#38bdf8", 20);
                
                this.enemies.forEach(e => {
                    e.hp -= dmg;
                    e.slowTimer = (e.slowTimer || 0) + 120;
                    this.checkEnemyDead(e, e.x, e.y);
                    
                    // Tóe mảnh băng
                    for (let k = 0; k < 4; k++) {
                        this.particles.push({
                            x: e.x, y: e.y,
                            vx: (Math.random() - 0.5) * 3,
                            vy: (Math.random() - 0.5) * 3,
                            color: "#e0f2fe", alpha: 1, life: 15, maxLife: 15, size: 2
                        });
                    }
                });

                // Cơn mưa gai băng cắm thẳng xuống nổ tung mảnh vỡ
                this.activeEffects.push({
                    timer: 40,
                    maxTimer: 40,
                    step: step,
                    flakes: Array.from({length: 16}, () => ({
                        x: (step - 1) * (w / 3) + Math.random() * (w / 3),
                        y: -50 - Math.random() * 150,
                        vy: 9 + Math.random() * 5,
                        vx: -3 - Math.random() * 2,
                        size: 7 + Math.random() * 7,
                        length: 22 + Math.random() * 15
                    })),
                    update: function() {
                        this.flakes.forEach(f => {
                            f.x += f.vx;
                            f.y += f.vy;
                        });
                    },
                    draw: function(ctx, w, h) {
                        ctx.save();
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = "#38bdf8";
                        
                        this.flakes.forEach(f => {
                            // Vẽ gai băng nhọn sắc
                            const angle = Math.atan2(f.vy, f.vx);
                            ctx.save();
                            ctx.translate(f.x, f.y);
                            ctx.rotate(angle);
                            ctx.fillStyle = "rgba(56, 189, 248, 0.85)";
                            ctx.beginPath();
                            ctx.moveTo(0, 0);
                            ctx.lineTo(-f.length, -f.size / 2);
                            ctx.lineTo(-f.length, f.size / 2);
                            ctx.closePath();
                            ctx.fill();
                            ctx.restore();
                        });
                        ctx.restore();
                    }
                });
                
            } else if (skillId === 'skill2') {
                if (window.app && app.audio) {
                    app.audio.playTdSound('ice');
                    app.audio.playMagicSpell();
                }
                const dmg = (step === 3) ? 34 : 33;
                this.screenShake = Math.max(this.screenShake || 0, 12);
                this.spawnPopup(480, 200, `❄️ BĂNG PHONG VẠN LÝ (Lần ${step})`, "#e0f2fe", 20);
                
                this.enemies.forEach(e => {
                    e.hp -= dmg;
                    e.stunTimer = (e.stunTimer || 0) + 100;
                    this.checkEnemyDead(e, e.x, e.y);
                    
                    for (let k = 0; k < 6; k++) {
                        const a = Math.random() * Math.PI * 2;
                        this.particles.push({
                            x: e.x, y: e.y,
                            vx: Math.cos(a) * 3, vy: Math.sin(a) * 3,
                            color: "#ffffff", alpha: 1, life: 20, maxLife: 20, size: 2.2
                        });
                    }
                });

                // Vết nứt băng giá lan rộng từ tâm ra viền
                this.activeEffects.push({
                    timer: 45,
                    maxTimer: 45,
                    step: step,
                    cracks: Array.from({length: 8}, () => {
                        const angle = Math.random() * Math.PI * 2;
                        const points = [{x: w/2, y: h/2}];
                        let curX = w/2;
                        let curY = h/2;
                        for (let j = 0; j < 5; j++) {
                            curX += Math.cos(angle + (Math.random() - 0.5) * 0.4) * 80;
                            curY += Math.sin(angle + (Math.random() - 0.5) * 0.4) * 80;
                            points.push({x: curX, y: curY});
                        }
                        return points;
                    }),
                    draw: function(ctx, w, h) {
                        const progress = (this.maxTimer - this.timer) / this.maxTimer;
                        const alpha = 0.45 * Math.sin(progress * Math.PI);
                        ctx.save();
                        
                        // Viền màn hình sương phủ
                        const borderGrad = ctx.createRadialGradient(w/2, h/2, w/3, w/2, h/2, w/2);
                        borderGrad.addColorStop(0, "rgba(224, 242, 254, 0)");
                        borderGrad.addColorStop(1, `rgba(56, 189, 248, ${alpha * 0.8})`);
                        ctx.fillStyle = borderGrad;
                        ctx.fillRect(0, 0, w, h);
                        
                        // Vẽ các đường nứt băng
                        ctx.strokeStyle = `rgba(224, 242, 254, ${alpha * 2.2})`;
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = "#e0f2fe";
                        ctx.lineWidth = 2.5;
                        
                        this.cracks.forEach(pts => {
                            ctx.beginPath();
                            ctx.moveTo(pts[0].x, pts[0].y);
                            const activeCount = Math.min(pts.length, Math.floor(pts.length * progress * 1.5));
                            for (let j = 1; j < activeCount; j++) {
                                ctx.lineTo(pts[j].x, pts[j].y);
                            }
                            ctx.stroke();
                        });
                        
                        // Vòng sương đóng băng quanh quái vật
                        ctx.fillStyle = `rgba(186, 230, 253, ${alpha * 0.45})`;
                        game.enemies.forEach(e => {
                            ctx.beginPath();
                            ctx.arc(e.x, e.y, 22, 0, Math.PI * 2);
                            ctx.fill();
                            
                            ctx.beginPath();
                            ctx.arc(e.x, e.y, 22, 0, Math.PI * 2);
                            ctx.stroke();
                        });
                        
                        ctx.restore();
                    }
                });
                
            } else if (skillId === 'skill3') {
                if (window.app && app.audio) {
                    app.audio.playTdSound('ice');
                    app.audio.playMagicSpell();
                }
                const dmg = (step === 3) ? 84 : 83;
                this.screenShake = Math.max(this.screenShake || 0, 14);
                this.spawnPopup(480, 200, `🌪️ TUYẾT LOẠN CUỒNG PHONG (Lần ${step})`, "#0284c7", 20);
                
                this.enemies.forEach(e => {
                    e.hp -= dmg;
                    this.checkEnemyDead(e, e.x, e.y);
                    
                    if (step === 3 && e.pathIndex !== undefined && e.pathIndex > 0) {
                        e.pathIndex = Math.max(0, e.pathIndex - 1);
                        const path = e.currentPath || this.paths[0];
                        if (path && path[e.pathIndex]) {
                            const targetPoint = path[e.pathIndex];
                            e.x = targetPoint.x;
                            e.y = targetPoint.y;
                        }
                    }
                    
                    for (let k = 0; k < 6; k++) {
                        const a = Math.random() * Math.PI * 2;
                        this.particles.push({
                            x: e.x + Math.cos(a) * 15,
                            y: e.y + Math.sin(a) * 15,
                            vx: -Math.sin(a) * 4,
                            vy: Math.cos(a) * 4,
                            color: "#bae6fd", alpha: 0.9, life: 18, maxLife: 18, size: 2
                        });
                    }
                });

                this.activeEffects.push({
                    timer: 35,
                    maxTimer: 35,
                    step: step,
                    draw: function(ctx, w, h) {
                        const progress = (this.maxTimer - this.timer) / this.maxTimer;
                        const sweepWidth = w / 3;
                        const startX = (this.step - 1) * sweepWidth;
                        
                        const grad = ctx.createLinearGradient(startX, 0, startX + sweepWidth, 0);
                        grad.addColorStop(0, "rgba(2, 132, 199, 0)");
                        grad.addColorStop(0.5, `rgba(186, 230, 253, ${0.45 * Math.sin(progress * Math.PI)})`);
                        grad.addColorStop(1, "rgba(2, 132, 199, 0)");
                        
                        ctx.fillStyle = grad;
                        ctx.fillRect(startX, 0, sweepWidth, h);
                    }
                });
            }
        } else if (heroId === 'gold_knight') {
            if (skillId === 'skill1') {
                if (window.app && app.audio) app.audio.playTdSound('coin');
                const goldEarned = (step === 3) ? 26 : 27;
                this.gold += goldEarned;
                this.updateHUD();
                this.screenShake = Math.max(this.screenShake || 0, 6);
                this.spawnPopup(480, 200, `🪙 KIM TIỀN NHÃN (Lần ${step}): +${goldEarned}G`, "#eab308", 20);
                
                for (let k = 0; k < 12; k++) {
                    this.particles.push({
                        x: (step - 1) * (w / 3) + Math.random() * (w / 3),
                        y: -20 - Math.random() * 50,
                        vx: (Math.random() - 0.5) * 1,
                        vy: 4 + Math.random() * 5,
                        color: "#fbbf24", alpha: 1, life: 100, maxLife: 100, size: 4
                    });
                }

                // Cơn mưa tiền vàng 3D rơi cùng ngôi sao ✨ lấp lánh
                this.activeEffects.push({
                    timer: 50,
                    maxTimer: 50,
                    step: step,
                    coins: Array.from({length: 12}, () => ({
                        x: (step - 1) * (w / 3) + Math.random() * (w / 3),
                        y: -30 - Math.random() * 120,
                        vy: 5 + Math.random() * 5,
                        angle: Math.random() * Math.PI * 2,
                        spin: 0.06 + Math.random() * 0.08,
                        size: 13 + Math.random() * 6
                    })),
                    sparkles: Array.from({length: 8}, () => ({
                        x: (step - 1) * (w / 3) + Math.random() * (w / 3),
                        y: -20 - Math.random() * 80,
                        vy: 2 + Math.random() * 3,
                        scale: 0.8 + Math.random() * 0.7
                    })),
                    update: function() {
                        this.coins.forEach(c => {
                            c.y += c.vy;
                            c.angle += c.spin;
                        });
                        this.sparkles.forEach(s => {
                            s.y += s.vy;
                        });
                    },
                    draw: function(ctx, w, h) {
                        ctx.save();
                        // Vẽ xu vàng chi tiết
                        this.coins.forEach(c => {
                            ctx.save();
                            ctx.translate(c.x, c.y);
                            ctx.rotate(c.angle);
                            
                            // Xu vàng
                            ctx.fillStyle = "#fbbf24";
                            ctx.strokeStyle = "#ca8a04";
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.arc(0, 0, c.size, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.stroke();
                            
                            // Viền trong xu
                            ctx.strokeStyle = "#eab308";
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.arc(0, 0, c.size * 0.65, 0, Math.PI * 2);
                            ctx.stroke();
                            
                            // Lỗ vuông ở tâm
                            ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
                            ctx.fillRect(-c.size / 3.2, -c.size / 3.2, (c.size / 3.2) * 2, (c.size / 3.2) * 2);
                            ctx.restore();
                        });
                        
                        // Vẽ ngôi sao ✨ lấp lánh (sparkle ✦)
                        ctx.fillStyle = "#ffffff";
                        ctx.shadowBlur = 10;
                        ctx.shadowColor = "#fbbf24";
                        this.sparkles.forEach(s => {
                            ctx.save();
                            ctx.translate(s.x, s.y);
                            ctx.beginPath();
                            for (let j = 0; j < 4; j++) {
                                const angle = (j * Math.PI) / 2;
                                ctx.lineTo(Math.cos(angle) * 14 * s.scale, Math.sin(angle) * 14 * s.scale);
                                ctx.lineTo(Math.cos(angle + Math.PI / 4) * 4 * s.scale, Math.sin(angle + Math.PI / 4) * 4 * s.scale);
                            }
                            ctx.closePath();
                            ctx.fill();
                            ctx.restore();
                        });
                        ctx.restore();
                    }
                });
                
            } else if (skillId === 'skill2') {
                if (window.app && app.audio) app.audio.playMagicSpell();
                const heal = (step === 2 || step === 3) ? 1 : 0;
                if (heal > 0) {
                    this.hp = Math.min(this.maxHp, this.hp + heal);
                    this.updateHUD();
                }
                this.screenShake = Math.max(this.screenShake || 0, 10);
                this.spawnPopup(480, 200, `🔱 HOÀNG KIM GIÁP (Lần ${step})`, "#fbbf24", 20);
                
                const castleX = 880, castleY = 300;
                for (let k = 0; k < 15; k++) {
                    const a = Math.random() * Math.PI * 2;
                    this.particles.push({
                        x: castleX + Math.cos(a) * 45,
                        y: castleY + Math.sin(a) * 45,
                        vx: -Math.cos(a) * 2,
                        vy: -Math.sin(a) * 2,
                        color: "#fbbf24", alpha: 1, life: 30, maxLife: 30, size: 2.5
                    });
                }

                // Khiên chắn năng lượng liên kết lục giác quanh lâu đài
                this.activeEffects.push({
                    timer: 45,
                    maxTimer: 45,
                    step: step,
                    draw: function(ctx, w, h) {
                        const progress = (this.maxTimer - this.timer) / this.maxTimer;
                        const alpha = Math.sin(progress * Math.PI);
                        const castleX = 880, castleY = 300;
                        const radius = 60 + this.step * 18 + Math.sin(this.timer * 0.12) * 5;
                        
                        ctx.save();
                        ctx.strokeStyle = `rgba(251, 191, 36, ${alpha * 0.95})`;
                        ctx.fillStyle = `rgba(251, 191, 36, ${alpha * 0.15})`;
                        ctx.shadowBlur = 15;
                        ctx.shadowColor = "#fbbf24";
                        ctx.lineWidth = 3.5;
                        
                        // Vẽ khiên bọc ngoài
                        ctx.beginPath();
                        ctx.arc(castleX, castleY, radius, 0.5 * Math.PI, 1.5 * Math.PI);
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                        
                        // Vẽ lưới lục giác liên kết (Hexagonal Grid) chỉ bên trong khiên
                        ctx.strokeStyle = `rgba(251, 191, 36, ${alpha * 0.35})`;
                        ctx.lineWidth = 1.2;
                        const hexSize = 14;
                        for (let dx = -radius; dx <= 0; dx += hexSize * 1.5) {
                            for (let dy = -radius; dy <= radius; dy += hexSize * Math.sqrt(3)) {
                                const hx = castleX + dx;
                                const hy = castleY + dy;
                                if (Math.hypot(hx - castleX, hy - castleY) < radius - 5) {
                                    ctx.beginPath();
                                    for (let side = 0; side < 6; side++) {
                                        const sideAngle = (side * Math.PI) / 3;
                                        const px = hx + Math.cos(sideAngle) * hexSize;
                                        const py = hy + Math.sin(sideAngle) * hexSize;
                                        if (px <= castleX) { // chỉ bên trái lâu đài
                                            if (side === 0) ctx.moveTo(px, py);
                                            else ctx.lineTo(px, py);
                                        }
                                    }
                                    ctx.closePath();
                                    ctx.stroke();
                                }
                            }
                        }
                        
                        ctx.restore();
                    }
                });
            } else if (skillId === 'skill3') {
                if (window.app && app.audio) app.audio.playMagicSpell();
                this.screenShake = Math.max(this.screenShake || 0, 12);
                this.spawnPopup(480, 200, `🎁 TÀI LỘC GÕ CỬA (Lần ${step})`, "#f59e0b", 20);
                this.doubleGoldTimer = (this.doubleGoldTimer || 0) + 200;
                
                for (let k = 0; k < 20; k++) {
                    this.particles.push({
                        x: 480 + (Math.random() - 0.5) * 80,
                        y: 180 + (Math.random() - 0.5) * 50,
                        vx: (Math.random() - 0.5) * 4,
                        vy: -2 + Math.random() * 4,
                        color: "#f59e0b", alpha: 1, life: 40, maxLife: 40, size: 2
                    });
                }

                // Chiếc rương báu khổng lồ nổ tung, tóe tiền vàng làm pháo hoa
                this.activeEffects.push({
                    timer: 50,
                    maxTimer: 50,
                    step: step,
                    draw: function(ctx, w, h) {
                        const progress = (this.maxTimer - this.timer) / this.maxTimer;
                        const alpha = Math.sin(progress * Math.PI);
                        
                        ctx.save();
                        
                        // Tia sáng phát quang hướng tâm rương
                        const shineGrad = ctx.createRadialGradient(w/2, h/2 - 20, 10, w/2, h/2 - 20, (120 + this.step * 70) * progress);
                        shineGrad.addColorStop(0, `rgba(251, 191, 36, ${alpha * 0.85})`);
                        shineGrad.addColorStop(0.5, `rgba(245, 158, 11, ${alpha * 0.45})`);
                        shineGrad.addColorStop(1, "rgba(251, 191, 36, 0)");
                        ctx.fillStyle = shineGrad;
                        ctx.fillRect(0, 0, w, h);
                        
                        // Vẽ chiếc rương báu vector nổ tung
                        ctx.translate(w/2, h/2 - 20);
                        ctx.scale(1 + progress * 0.5, 1 + progress * 0.5);
                        
                        // Hào quang tỏa ra
                        ctx.shadowBlur = 20;
                        ctx.shadowColor = "#f59e0b";
                        
                        // Nắp rương bay lên trên nếu rương mở dần
                        const openOffset = progress * 32;
                        
                        // Nắp rương
                        ctx.fillStyle = "#854d0e";
                        ctx.fillRect(-22, -18 - openOffset, 44, 12);
                        ctx.fillStyle = "#fbbf24"; // Khóa vàng
                        ctx.fillRect(-6, -8 - openOffset, 12, 6);
                        
                        // Thân rương dưới
                        ctx.fillStyle = "#a16207";
                        ctx.fillRect(-22, -6, 44, 20);
                        // Đai thép viền
                        ctx.fillStyle = "#451a03";
                        ctx.fillRect(-22, -6, 4, 20);
                        ctx.fillRect(18, -6, 4, 20);
                        
                        ctx.restore();
                        
                        // Vẽ chữ nhân vàng khổng lồ
                        ctx.save();
                        ctx.font = "bold 32px Outfit, sans-serif";
                        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.strokeStyle = "#451a03";
                        ctx.lineWidth = 4;
                        ctx.textAlign = "center";
                        ctx.strokeText(`X2 VÀNG RƠI! (Lần ${this.step})`, w/2, h/2 + 55);
                        ctx.fillText(`X2 VÀNG RƠI! (Lần ${this.step})`, w/2, h/2 + 55);
                        ctx.restore();
                    }
                });
            }
        }
    },

    // Sử dụng Siêu Kỹ Năng của siêu anh hùng
    castSkill: function(skillId) {
        if (!this.isPlaying || !this.isWaveActive) return;
        
        const heroId = (this.hero && this.hero.selectedId) ? this.hero.selectedId : 'light_warrior';
        const skills = this.skillsConfig[heroId] || this.skillsConfig['light_warrior'];
        const skill = skills.find(s => s.id === skillId);
        if (!skill || this.mana < skill.cost) return;
        
        this.mana -= skill.cost;
        this.updateSkillsHUD();
        
        // Kích hoạt chuỗi hiệu ứng và hiệu lực lặp lại 3 lần (0ms, 500ms, 1000ms)
        this.executeSkillStep(heroId, skillId, 1);
        
        setTimeout(() => {
            this.executeSkillStep(heroId, skillId, 2);
        }, 500);
        
        setTimeout(() => {
            this.executeSkillStep(heroId, skillId, 3);
        }, 1000);
    },

    // Sự kiện Thua trận
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = SkillsSystem;
    if (typeof root !== 'undefined') root.SkillsSystem = SkillsSystem;
})(typeof window !== 'undefined' ? window : global);
