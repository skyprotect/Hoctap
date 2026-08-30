/**
 * GAME ENGINE - COMBAT & REWARD SYSTEM
 */
(function(root) {
    'use strict';

    const CombatSystem = {
        checkEnemyDead: function(enemy, x, y) {
        if (enemy.hp <= 0) {
            const idx = this.enemies.indexOf(enemy);
            if (idx !== -1) {
                this.enemies.splice(idx, 1);
                
                // Tính toán vàng nhận được (Áp dụng bộ nhân vàng của Hero)
                const mult = this.getHeroMultipliers();
                let baseGold = 10;
                if (enemy.type === 'boss') baseGold = 40;
                else if (enemy.type === 'armored') baseGold = 15;
                else if (enemy.type === 'healer') baseGold = 20;
                else if (enemy.type === 'gold_goblin') baseGold = 20;
                else if (enemy.type === 'titan') baseGold = 30;
                else if (enemy.type === 'vampire') baseGold = 25;
                else if (enemy.type === 'lava_golem') baseGold = 20;
                
                let goldEarned = Math.round(baseGold * mult.gold);
                if (enemy.type === 'gold_goblin') {
                    goldEarned *= 2; // Rơi gấp đôi vàng!
                }
                
                // Kích hoạt kỹ năng x2 vàng (Tài Lộc Gõ Cửa của Gold Knight)
                if (this.doubleGoldTimer && this.doubleGoldTimer > 0) {
                    goldEarned *= 2;
                }
                
                this.gold += goldEarned;
                this.updateHUD();
                
                // Hiển thị số vàng bay lên nổi bật
                this.spawnPopup(x, y - 12, `+${goldEarned}G 🪙`, "#fbbf24", 16);
                
                // Sinh hiệu ứng hạt phân rã màu sắc của quái vật bay ra
                for (let k = 0; k < 12; k++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 0.5 + Math.random() * 2;
                    this.particles.push({
                        x: x,
                        y: y,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        color: enemy.color,
                        alpha: 1,
                        life: 20 + Math.random() * 15,
                        maxLife: 35,
                        size: 2 + Math.random() * 2
                    });
                }
                
                // Sinh vật phẩm rơi ngẫu nhiên (Power-up drops) với tỷ lệ 15%
                if (Math.random() < 0.15) {
                    if (!this.drops) this.drops = [];
                    const rand = Math.random();
                    let dropType = 'gold_chest';
                    if (rand < 0.5) {
                        dropType = 'gold_chest';
                    } else if (rand < 0.75) {
                        dropType = 'castle_heart';
                    } else {
                        dropType = 'mana_potion';
                    }
                    
                    this.drops.push({
                        x: x,
                        y: y,
                        type: dropType,
                        life: 360, // 6 giây biến mất
                        yOffset: 0
                    });
                }
                
                // Titan Slime tách đôi thành 2 slime thường nhỏ hơn khi chết
                if (enemy.type === 'titan') {
                    const assignedPath = enemy.currentPath || this.paths[0];
                    const pIdx = enemy.pathIndex;
                    for (let sIdx = 0; sIdx < 2; sIdx++) {
                        const offset = (sIdx === 0 ? -12 : 12);
                        this.enemies.push({
                            x: enemy.x + offset,
                            y: enemy.y + offset,
                            pathIndex: pIdx,
                            currentPath: assignedPath,
                            type: 'normal',
                            maxHp: 100,
                            hp: 100,
                            speed: 1.4,
                            speedMultiplier: this.isRaged ? 2.0 : 1.0,
                            radius: 10,
                            color: "#06b6d4",
                            slowTimer: 0,
                            soldierSlowTimer: 0,
                            animFrame: 0,
                            animTimer: 0
                        });
                    }
                    this.spawnPopup(x, y - 35, "TÁCH ĐÔI! 👾👾", "#06b6d4", 13);
                }
                
                // Phát âm thanh nhẹ khi diệt quái
                if (window.app && app.audio) app.audio.playClick();
            }
        }
    },

    // Bắn đạn
    fireProjectile: function(tower, target) {
        // Tính sát thương sau khi áp dụng buff tháp (Chiến Thần Hộ Thể của Light Warrior)
        let finalDamage = tower.damage;
        if (this.towerDmgBuffTimer && this.towerDmgBuffTimer > 0) {
            finalDamage = Math.round(tower.damage * 1.5);
        }

        if (tower.type === 'archer') {
            // Tháp cung bắn mũi tên gỗ bay vật lý cực ngầu
            this.projectiles.push({
                type: 'arrow',
                x: tower.x,
                y: tower.y,
                target: target,
                lastTargetX: target.x,
                lastTargetY: target.y,
                speed: 8.5,
                damage: finalDamage,
                color: tower.color
            });
            // Phát âm thanh vút tên bay Web Audio API
            if (window.app && app.audio) app.audio.playTdSound('archer');
            
        } else if (tower.type === 'ice') {
            // Tháp băng bắn vòng sóng tròn làm chậm diện rộng ngay tâm tháp
            this.projectiles.push({
                type: 'laser', // vẽ dạng hiệu ứng sóng nở
                x: tower.x,
                y: tower.y,
                tx: tower.x,
                ty: tower.y,
                isRing: true,
                maxRadius: tower.range,
                life: 15,
                color: tower.color
            });
            // Phát âm thanh băng giá Web Audio API
            if (window.app && app.audio) app.audio.playTdSound('ice');
            
            // Tạo các hạt tuyết lấp lánh tỏa ra từ tháp băng
            for (let i = 0; i < 15; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1.2 + Math.random() * 2.8;
                this.particles.push({
                    x: tower.x,
                    y: tower.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color: Math.random() < 0.65 ? "#e0f2fe" : "#38bdf8", // hạt tuyết trắng hoặc xanh dương băng
                    alpha: 1.0,
                    life: 20 + Math.random() * 12,
                    maxLife: 32,
                    size: 1.5 + Math.random() * 2
                });
            }
            
            // Làm chậm toàn bộ quái trong tầm tháp
            this.enemies.forEach(e => {
                const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
                if (dist <= tower.range) {
                    e.slowTimer = tower.slowDuration;
                    e.hp -= finalDamage;
                    this.checkEnemyDead(e, e.x, e.y);
                    
                    // Tạo hiệu ứng hạt tuyết nhỏ lấp lánh bùng nổ quanh mỗi quái vật bị đóng băng
                    for (let k = 0; k < 6; k++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = 0.5 + Math.random() * 1.5;
                        this.particles.push({
                            x: e.x,
                            y: e.y,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            color: "#e0f2fe",
                            alpha: 1.0,
                            life: 15 + Math.random() * 10,
                            maxLife: 25,
                            size: 1.2 + Math.random() * 1.2
                        });
                    }
                }
            });
            
        } else if (tower.type === 'bomb') {
            // Tháp pháo bắn đạn cầu bay chậm
            this.projectiles.push({
                type: 'bomb',
                x: tower.x,
                y: tower.y,
                target: target,
                lastTargetX: target.x,
                lastTargetY: target.y,
                speed: 4.5,
                damage: finalDamage,
                splashRadius: tower.splashRadius,
                color: tower.color
            });
            // Tiếng pháo khai hỏa nhẹ
            if (window.app && app.audio) app.audio.playTdSound('archer');
            
        } else if (tower.type === 'thunder') {
            // Tháp Sấm Sét giật lan 3 mục tiêu lân cận (cả loài bay và đi bộ)
            const chainTargets = [target];
            const maxBounces = 2; // tối đa 3 mục tiêu tổng cộng
            let currentSource = target;
            
            for (let b = 0; b < maxBounces; b++) {
                let closestNext = null;
                let minDist = 80;
                
                this.enemies.forEach(e => {
                    if (!chainTargets.includes(e)) {
                        const d = Math.hypot(e.x - currentSource.x, e.y - currentSource.y);
                        if (d < minDist) {
                            minDist = d;
                            closestNext = e;
                        }
                    }
                });
                
                if (closestNext) {
                    chainTargets.push(closestNext);
                    currentSource = closestNext;
                } else {
                    break;
                }
            }
            
            // Phóng tia sét sét giật
            this.projectiles.push({
                type: 'lightning',
                color: tower.color,
                life: 8,
                points: [
                    {x: tower.x, y: tower.y},
                    ...chainTargets.map(t => ({x: t.x, y: t.y}))
                ]
            });
            
            if (window.app && app.audio && typeof app.audio.playTdSound === 'function') {
                app.audio.playTdSound('thunder');
            }
            
            // Gây sát thương và hiệu ứng
            chainTargets.forEach(e => {
                e.hp -= finalDamage;
                this.checkEnemyDead(e, e.x, e.y);
                
                for (let k = 0; k < 4; k++) {
                    this.particles.push({
                        x: e.x, y: e.y,
                        vx: (Math.random() - 0.5) * 2,
                        vy: (Math.random() - 0.5) * 2,
                        color: "#06b6d4",
                        alpha: 1.0,
                        life: 10 + Math.random() * 8,
                        maxLife: 18,
                        size: 1.5 + Math.random()
                    });
                }
            });
            
        } else if (tower.type === 'laser') {
            // Tháp Laser bắn liên tục
            this.projectiles.push({
                type: 'laser_beam',
                color: tower.color,
                life: 4,
                startX: tower.x,
                startY: tower.y,
                endX: target.x,
                endY: target.y
            });
            
            target.hp -= finalDamage;
            this.checkEnemyDead(target, target.x, target.y);
            
            if (window.app && app.audio && Math.random() < 0.15) app.audio.playTdSound('archer');
            
        } else if (tower.type === 'poison') {
            // Tháp Độc Học ném bình độc
            this.projectiles.push({
                type: 'poison_flask',
                x: tower.x,
                y: tower.y,
                target: target,
                lastTargetX: target.x,
                lastTargetY: target.y,
                speed: 6,
                damage: finalDamage,
                poisonDamage: tower.poisonDamage || 8,
                poisonDuration: tower.poisonDuration || 180,
                color: tower.color
            });
            if (window.app && app.audio) app.audio.playTdSound('archer');
            
        } else if (tower.type === 'fire') {
            // Tháp Hỏa Long bắn dung nham
            this.projectiles.push({
                type: 'fire_boulder',
                x: tower.x,
                y: tower.y,
                target: target,
                lastTargetX: target.x,
                lastTargetY: target.y,
                speed: 5,
                damage: finalDamage,
                burnDamage: tower.burnDamage || 12,
                burnDuration: tower.burnDuration || 120,
                color: tower.color
            });
            if (window.app && app.audio) app.audio.playTdSound('archer');
            
        } else if (tower.type === 'void') {
            // Tháp Vô Cực tạo hố đen hút quái
            this.projectiles.push({
                type: 'void_orb',
                x: tower.x,
                y: tower.y,
                target: target,
                lastTargetX: target.x,
                lastTargetY: target.y,
                speed: 6,
                damage: finalDamage,
                pullStrength: tower.pullStrength || 1.5,
                color: tower.color
            });
            if (window.app && app.audio) app.audio.playTdSound('ice');
        }
    },
    
    // Đạn bomb trúng mục tiêu
    hitEnemy: function(projectile, target, x, y) {
        // Hiệu ứng nổ pháo lan AoE
        this.enemies.forEach(e => {
            // Tháp pháo chỉ tiêu diệt được loài đi bộ, không nổ trúng loài bay
            const isAir = ['fast', 'shadow', 'ice_bat'].includes(e.type);
            if (isAir) return;
            
            const dist = Math.hypot(e.x - x, e.y - y);
            if (dist <= projectile.splashRadius) {
                // Quái bọc thép giảm 40% sát thương từ pháo nổ lan (nhận 0.6x)
                const finalDmg = e.type === 'armored' ? Math.round(projectile.damage * 0.6) : projectile.damage;
                e.hp -= finalDmg;
                this.checkEnemyDead(e, e.x, e.y);
                
                // Hiệu ứng hạt máu bắn ra từ quái vật khi trúng sát thương lan
                for (let k = 0; k < 6; k++) {
                    this.particles.push({
                        x: e.x,
                        y: e.y,
                        vx: (Math.random() - 0.5) * 3,
                        vy: (Math.random() - 0.5) * 3,
                        color: "#ef4444",
                        alpha: 1.0,
                        life: 15 + Math.random() * 10,
                        maxLife: 25,
                        size: 1.5 + Math.random() * 1.5
                    });
                }
            }
        });
        
        // Phát âm thanh nổ pháo trầm (bùm bùm) Web Audio API đồng bộ đúng thời điểm va chạm nổ
        if (window.app && app.audio) app.audio.playTdSound('bomb');
        
        // Hiệu ứng sóng kích nổ (shockwave ring) màu cam phát ra từ tâm
        for (let r = 0; r < 360; r += 15) {
            const rad = r * Math.PI / 180;
            const speed = 1.8 + Math.random() * 1.2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(rad) * speed,
                vy: Math.sin(rad) * speed,
                color: "rgba(249, 115, 22, 0.7)",
                alpha: 1.0,
                life: 12 + Math.random() * 8,
                maxLife: 20,
                size: 2.0 + Math.random() * 1.5
            });
        }
        
        // Spawn 25 hạt lửa nổ rực rỡ tại điểm nổ
        for (let i = 0; i < 25; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 4;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: i % 2 === 0 ? "#ea580c" : "#fbbf24", // Đan xen hạt lửa màu cam và vàng phát sáng
                alpha: 1,
                life: 25 + Math.random() * 15,
                maxLife: 40,
                size: 2.5 + Math.random() * 2.5
            });
        }
    },

    // Hàm vẽ quái vật 3D Chibi với hoạt họa bước chân, vỗ cánh, bay lơ lửng sống động,
        onDefeat: function() {
        this.stop();
        
        // Kích hoạt tiếng Defeat
        if (window.app && app.audio) app.audio.playDefeat();
        
        if (this.isFreePlay) {
            Swal.fire({
                icon: 'error',
                title: 'Lâu đài bị thất thủ! 🏰',
                text: 'Máu lâu đài đã về 0. Con muốn chơi lại hay thoát game?',
                showCancelButton: true,
                confirmButtonText: 'Chơi lại 🎮',
                cancelButtonText: 'Thoát game 🚪',
                confirmButtonColor: 'var(--primary)',
                cancelButtonColor: 'var(--danger)',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    game.init('td-canvas', 5, game.hero);
                } else {
                    if (window.app && typeof app.exitFreePlayGame === 'function') {
                        app.exitFreePlayGame();
                    }
                }
            });
            return;
        }
        
        // Thực hiện hạ cấp anh hùng
        let downgradeMsg = "";
        if (this.hero && this.hero.selectedId && window.questions && window.questions.hero) {
            const oldLevel = window.questions.hero.level;
            const downgraded = window.questions.hero.downgrade();
            if (downgraded) {
                const hName = window.questions.hero.registry[this.hero.selectedId].name;
                const hEmoji = window.questions.hero.registry[this.hero.selectedId].emoji;
                downgradeMsg = `<br><span style="color:var(--danger); font-weight:bold; margin-top: 8px; display: inline-block;">${hEmoji} Siêu Anh Hùng ${hName} đã bị hạ cấp xuống Cấp ${window.questions.hero.level} do lâu đài thất thủ!</span>`;
            }
        }
        
        // Sử dụng SweetAlert2 thông báo thua cuộc
        Swal.fire({
            icon: 'error',
            title: 'Lâu đài bị thất thủ!',
            html: `Máu lâu đài đã về 0. Hãy đọc kỹ lại lời giải kiến thức và ôn luyện lại để nâng cao chiến lược phòng thủ nhé con!${downgradeMsg}`,
            confirmButtonText: 'Xem kết quả bài học',
            confirmButtonColor: 'var(--danger)',
            target: document.getElementById('tab-practice') || 'body',
            allowOutsideClick: false
        }).then(() => {
            // Xem kết quả bài học và lưu lịch sử làm bài
            if (window.questions && typeof window.questions.finishPractice === 'function') {
                window.questions.finishPractice();
            }
        });
    },

    // Hồi máu lâu đài
    healCastle: function(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
        this.updateHUD();
    },

    // Kích hoạt nhặt vật phẩm rơi (drops)
    collectDrop: function(drop, index) {
        this.drops.splice(index, 1);
        
        if (drop.type === 'gold_chest') {
            const goldAmount = Math.round(50 + Math.random() * 30);
            this.gold += goldAmount;
            this.updateHUD();
            this.spawnPopup(drop.x, drop.y, `+${goldAmount}G 🪙`, "#fbbf24", 18);
            if (window.app && app.audio) app.audio.playTdSound('coin');
            
        } else if (drop.type === 'castle_heart') {
            this.healCastle(1);
            this.spawnPopup(drop.x, drop.y, `+1 HP ❤️`, "#ef4444", 18);
            if (window.app && app.audio) app.audio.playTdSound('sword_slash');
            
        } else if (drop.type === 'mana_potion') {
            this.mana = Math.min(this.maxMana, this.mana + 30);
            this.updateSkillsHUD();
            this.spawnPopup(drop.x, drop.y, `+30 Mana 🧪`, "#3b82f6", 18);
            if (window.app && app.audio) app.audio.playTdSound('ice');
        }
    },

    // Cập nhật các hạt thời tiết động
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = CombatSystem;
    if (typeof root !== 'undefined') root.CombatSystem = CombatSystem;
})(typeof window !== 'undefined' ? window : global);
