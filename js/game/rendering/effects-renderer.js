/**
 * GAME ENGINE - PARTICLES, WEATHER & VISUAL EFFECTS RENDERER
 */
(function(root) {
    'use strict';

    const EffectsRenderer = {
        spawnPopup: function(x, y, text, color = "#ffffff", size = 14) {
        this.popups.push({
            x: x,
            y: y,
            text: text,
            color: color,
            size: size,
            life: 45 // hiển thị trong 45 frames
        });
    },
    
    // Tạo pháo hoa ăn mừng khi làm đúng
    createVictoryConfetti: function(x, y) {
        const colors = ["#FFD700", "#FF4500", "#38bdf8", "#22c55e", "#ff007f"];
        for (let i = 0; i < 30; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 5;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 1.5, // bay hướng lên nhẹ
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                life: 40 + Math.random() * 20,
                maxLife: 60,
                size: 2.5 + Math.random() * 2.5
            });
        }
    },
    
    // Rung màn hình khi lâu đài mất máu
    triggerHurtFeedback: function() {
        const canvasContainer = document.getElementById("td-game-container");
        if (!canvasContainer) return;
        
        canvasContainer.classList.add("shake-red-effect");
        setTimeout(() => {
            canvasContainer.classList.remove("shake-red-effect");
        }, 300);
        
        // Rung lắc màn hình canvas thực tế
        this.screenShake = Math.max(this.screenShake || 0, 15);
        
        // Kích hoạt tiếng nổ / sai nhẹ của hệ thống
        if (window.app && app.audio) app.audio.playWrong();
    },
    
    // Cập nhật giao diện quái vượt qua,
        updateWeather: function() {
        if (!this.weatherParticles) this.weatherParticles = [];
        const width = this.canvas ? this.canvas.width : 880;
        const height = this.canvas ? this.canvas.height : 600;
        
        this.weatherParticles.forEach(p => {
            if (this.weatherType === 'snow') {
                p.y += p.speed * 0.8;
                p.x += Math.sin(p.angle) * 0.3;
                p.angle += p.spin;
            } else if (this.weatherType === 'leaves') {
                p.y += p.speed * 1.2;
                p.x += Math.sin(p.angle) * 0.7;
                p.angle += p.spin * 1.5;
            } else if (this.weatherType === 'magic_dust') {
                p.y += p.speed * 0.5;
                p.x += Math.sin(p.angle) * 0.4;
                p.angle += p.spin;
            }
            
            // Nếu bay quá mép dưới hoặc 2 bên thì reset lại lên trên
            if (p.y > height) {
                p.y = -10;
                p.x = Math.random() * width;
            }
            if (p.x < -10) p.x = width + 5;
            if (p.x > width + 10) p.x = -5;
        });
    },

    // Vẽ thời tiết động lên canvas
    drawWeather: function() {
        if (!this.weatherParticles || this.weatherParticles.length === 0) return;
        
        this.ctx.save();
        this.weatherParticles.forEach(p => {
            if (this.weatherType === 'snow') {
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (this.weatherType === 'leaves') {
                // Vẽ chiếc lá phong đơn giản
                this.ctx.fillStyle = p.size > 2.5 ? 'rgba(239, 68, 68, 0.65)' : 'rgba(245, 158, 11, 0.65)';
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.angle);
                this.ctx.beginPath();
                this.ctx.ellipse(0, 0, p.size * 2, p.size, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            } else if (this.weatherType === 'magic_dust') {
                // Vẽ bụi sáng ma thuật nhấp nháy tinh tế
                this.ctx.fillStyle = `rgba(168, 85, 247, ${0.4 + Math.sin(p.angle) * 0.3})`;
                this.ctx.shadowColor = '#c084fc';
                this.ctx.shadowBlur = 4;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });
        this.ctx.restore();
    },

    // Cập nhật các vật phẩm rơi (drops)
    updateDrops: function() {
        if (!this.drops) this.drops = [];
        for (let i = this.drops.length - 1; i >= 0; i--) {
            const drop = this.drops[i];
            drop.life--;
            
            // Hiệu ứng bập bùng nhẹ (floating) theo hàm sin
            drop.yOffset = Math.sin(performance.now() / 200) * 4;
            
            if (drop.life <= 0) {
                this.drops.splice(i, 1);
            }
        }
    },

    // Vẽ vật phẩm rơi lên Canvas
    drawDrops: function() {
        if (!this.drops || this.drops.length === 0) return;
        
        this.ctx.save();
        this.drops.forEach(drop => {
            const drawY = drop.y + (drop.yOffset || 0);
            
            // Vẽ bóng mờ chói sáng xung quanh vật phẩm rơi (Glow)
            this.ctx.beginPath();
            const glowGrad = this.ctx.createRadialGradient(drop.x, drawY, 2, drop.x, drawY, 25);
            
            let emoji = '🪙';
            let glowColor = 'rgba(251, 191, 36, 0.45)';
            if (drop.type === 'castle_heart') {
                emoji = '❤️';
                glowColor = 'rgba(239, 68, 68, 0.45)';
            } else if (drop.type === 'mana_potion') {
                emoji = '🧪';
                glowColor = 'rgba(59, 130, 246, 0.45)';
            }
            
            glowGrad.addColorStop(0, glowColor);
            glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            this.ctx.fillStyle = glowGrad;
            this.ctx.arc(drop.x, drawY, 25, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Vẽ emoji ở chính giữa
            this.ctx.font = '24px sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            
            // Tạo hiệu ứng nhấp nháy mờ ảo khi sắp biến mất (dưới 2 giây)
            if (drop.life < 120) {
                this.ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(drop.life / 8));
            }
            
            this.ctx.fillText(emoji, drop.x, drawY);
        });
        this.ctx.restore();
    }
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = EffectsRenderer;
    if (typeof root !== 'undefined') root.EffectsRenderer = EffectsRenderer;
})(typeof window !== 'undefined' ? window : global);
