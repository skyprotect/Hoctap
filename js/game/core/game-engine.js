/**
 * GAME ENGINE - CORE ENGINE RUNTIME
 * Vòng lặp trò chơi (Fixed Timestep 60FPS GameLoop), vòng đời Init/Stop, Update và Draw
 */
(function(root) {
    'use strict';

    const GameCore = {
        init: function(canvasId, totalQuestions, heroData) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        // Tạo đường đi ngẫu nhiên cho quái
        this.generateRandomPaths();
        
        // Reset danh sách vật thể trang trí để sinh mới ngẫu nhiên không đè lên đường đi
        this.terrainObjects = null;
        
        // Chọn chủ đề bản đồ ngẫu nhiên mỗi lần bắt đầu game
        const themeKeys = Object.keys(this.mapThemes);
        this.mapTheme = themeKeys[Math.floor(Math.random() * themeKeys.length)];
        
        this.hp = 10;
        this.maxHp = 10;
        this.gold = 250;
        this.currentWave = 0;
        this.totalWaves = 5; // Tăng lên 5 đợt phòng thủ theo yêu cầu người dùng
        this.enemies = [];
        this.towers = [];
        this.soldiers = [];
        this.projectiles = [];
        this.particles = [];
        this.popups = [];
        this.activeEffects = [];
        this.isPlaying = true;
        this.selectedTowerType = 'archer';
        this.selectedTowerInstance = null;
        this.rageTimer = 0;
        this.isRaged = false;
        this.isWaveActive = false;
        this.isSpawning = false;
        this.spawnInterval = null; // Quản lý interval sinh quái
        this.countdown = null; // Quản lý bộ đếm ngược 3, 2, 1
        
        // Biến mới theo dõi quái vượt qua và trạng thái wave
        this.escapedMonsters = {};
        this.hasStartedSpawning = false;
        this.updateEscapedMonstersHUD();
        
        // Nhận dữ liệu Anh Hùng
        this.hero = heroData || null;
        
        // Ẩn nút bắt đầu phòng thủ và bảng preview lúc bắt đầu làm bài
        const startWaveBtn = document.getElementById("btn-start-wave");
        const previewPanel = document.getElementById("wave-preview-panel");
        if (startWaveBtn) startWaveBtn.classList.add("hidden");
        if (previewPanel) previewPanel.classList.add("hidden");
        
        // Reset các biến phục vụ di chuột xây dựng và xác nhận
        this.mouseX = 0;
        this.mouseY = 0;
        this.previewX = null;
        this.previewY = null;
        this.isPreviewValid = false;
        this.confirmBuildPos = null;
        
        // Hủy frame cũ nếu có
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        this.renderTowerButtons();
        this.updateHUD();
        this.bindEvents();
        
        // Thông báo bản đồ ngẫu nhiên được chọn
        const themeInfo = this.mapThemes[this.mapTheme];
        this.spawnPopup(480, 50, `🗺️ Bản đồ: ${themeInfo.name}`, "#fbbf24", 18);
        
        // Reset timer hero ultimate và trạng thái chiến đấu
        this.heroUltimateTimer = 0;
        this.heroAttackTimer = 0;
        this.heroIsAttacking = false;
        this.heroAttackAngle = 0;
        this.heroUltimateActive = false;
        this.heroUltimateFX = null;
        this.screenShake = 0;
        
        // Khởi tạo Mana cho Siêu Anh Hùng
        this.mana = 100;
        this.maxMana = 100;
        this.lightningEffects = [];
        this.towerDmgBuffTimer = 0;
        this.doubleGoldTimer = 0;
        this.renderedHeroSkillsId = null;
        this.updateSkillsHUD();
        
        // Khởi tạo biến cho cơ chế mới: Vật phẩm rơi & Thời tiết ngẫu nhiên bớt đồng điệu
        this.drops = [];
        this.weatherParticles = [];
        const weatherTypes = ['snow', 'leaves', 'magic_dust'];
        this.weatherType = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        
        // Tạo các hạt thời tiết ban đầu rải rác
        for (let i = 0; i < 40; i++) {
            this.weatherParticles.push({
                x: Math.random() * 880,
                y: Math.random() * 600,
                size: 1.2 + Math.random() * 2.5,
                speed: 0.4 + Math.random() * 0.8,
                angle: Math.random() * Math.PI * 2,
                spin: 0.01 + Math.random() * 0.02
            });
        }
        
        // Nạp trước tài nguyên hình ảnh game nếu chưa nạp
        if (!this.imagesLoaded) {
            this.loadGameAssets();
        }
        
        // Bắt đầu game loop
        this.lastTime = performance.now();
        this.accumulator = 0;
        this.loop();
    },
    
    // Dừng game
    stop: function() {
        this.isPlaying = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        this.unbindEvents();
        
        // Dọn dẹp bộ đếm sinh quái vật
        if (this.spawnInterval) {
            clearInterval(this.spawnInterval);
            this.spawnInterval = null;
        }
        this.isSpawning = false;
        
        // Dừng nhạc nền game
        if (window.app && app.audio) {
            app.audio.stopBackground();
        }
        
        // Ẩn nút bắt đầu phòng thủ khi dừng game
        const startWaveBtn = document.getElementById("btn-start-wave");
        if (startWaveBtn) startWaveBtn.classList.add("hidden");
    },
    
    // Tính toán các hệ số nhân dựa trên Siêu Anh Hùng hiện tại,
        loop: function() {
        if (!this.isPlaying) return;
        
        const now = performance.now();
        let elapsed = now - this.lastTime;
        // Giới hạn trễ tích lũy tối đa 100ms mỗi frame để tránh xoắn ốc tử thần
        if (elapsed > 100) elapsed = 100;
        this.lastTime = now;
        
        this.accumulator += elapsed;
        
        // Chạy update với fixed timestep 60 FPS, giới hạn tối đa 5 bước update mỗi frame
        let updates = 0;
        while (this.accumulator >= this.timestep && updates < 5) {
            this.update();
            this.accumulator -= this.timestep;
            updates++;
        }
        // Nếu tích lũy còn dư nhưng đã quá số lần update tối đa, xóa phần dư để tránh tích tụ trễ gây lag liên hoàn
        if (this.accumulator >= this.timestep) {
            this.accumulator = 0;
        }
        
        this.draw();
        
        this.animationFrame = requestAnimationFrame(() => this.loop());
    },
    
    // Cập nhật vật lý và trạng thái
    update: function() {
        if (this.screenShake > 0) this.screenShake--;
        
        // 1. Cập nhật đếm ngược nổi giận (quái tăng tốc khi làm sai)
        if (this.isRaged) {
            this.rageTimer--;
            if (this.rageTimer <= 0) {
                this.isRaged = false;
                this.enemies.forEach(e => {
                    e.speedMultiplier = 1.0;
                });
            }
        }
        
        // 2. Di chuyển và cập nhật animation quái vật
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // Cập nhật bộ đếm animation chuyển động (Walk/Fly Cycle)
            enemy.animTimer++;
            if (enemy.animTimer > 5) {
                enemy.animFrame = (enemy.animFrame + 1) % 8;
                enemy.animTimer = 0;
            }
            
            // Xử lý hiệu ứng làm chậm và choáng (của tháp băng, tháp lính, hero)
            let currentSpeed = enemy.speed * enemy.speedMultiplier;
            // Dơi băng (ice_bat) miễn dịch hoàn toàn làm chậm/đóng băng
            if (enemy.stunTimer > 0 && enemy.type !== 'ice_bat') {
                enemy.stunTimer--;
                currentSpeed = 0; // Đóng băng cứng / choáng không thể di chuyển
            } else {
                if (enemy.slowTimer > 0 && enemy.type !== 'ice_bat') {
                    enemy.slowTimer--;
                    currentSpeed *= 0.5; // Chậm 50% bởi băng
                }
                // Bóng ma (ghost) đi xuyên lính, không bị lính cản đường
                if (enemy.soldierSlowTimer > 0 && enemy.type !== 'ghost') {
                    enemy.soldierSlowTimer--;
                    currentSpeed *= 0.6; // Chậm 40% bởi chiến binh cản đường
                }
            }
            
            // Xử lý Ma cà rồng tự hồi máu
            if (enemy.type === 'vampire' && enemy.hp > 0 && enemy.hp < enemy.maxHp) {
                // Hồi 1% máu mỗi frame (khoảng 60% mỗi giây)
                enemy.hp = Math.min(enemy.maxHp, enemy.hp + (enemy.maxHp * 0.01));
                if (Math.random() < 0.1) {
                    this.particles.push({
                        x: enemy.x + (Math.random() - 0.5) * 10,
                        y: enemy.y + (Math.random() - 0.5) * 10,
                        vx: 0, vy: -0.8,
                        color: "#ef4444", alpha: 0.8,
                        life: 15, maxLife: 15, size: 2
                    });
                }
            }

            // Xử lý Slime lửa phun vệt lửa phía sau
            if (enemy.type === 'fire_slime' && Math.random() < 0.15) {
                this.particles.push({
                    x: enemy.x, y: enemy.y,
                    vx: (Math.random() - 0.5) * 0.4,
                    vy: (Math.random() - 0.5) * 0.4,
                    color: "#f97316", alpha: 0.8,
                    life: 15 + Math.random() * 10, maxLife: 25, size: 1.5 + Math.random() * 2
                });
            }

            // Xử lý Sát thương Độc (DOT)
            if (enemy.poisonTimer && enemy.poisonTimer > 0) {
                enemy.poisonTimer--;
                if (enemy.poisonTimer % 15 === 0) {
                    const poisonDmg = enemy.poisonDmg || 8;
                    enemy.hp -= poisonDmg;
                    this.checkEnemyDead(enemy, enemy.x, enemy.y);
                    if (enemy.hp > 0) {
                        this.particles.push({
                            x: enemy.x + (Math.random() - 0.5) * 16,
                            y: enemy.y + (Math.random() - 0.5) * 16,
                            vx: (Math.random() - 0.5) * 0.5,
                            vy: -0.6 - Math.random() * 0.4,
                            color: "#a855f7", alpha: 0.8,
                            life: 20, maxLife: 20, size: 1.5 + Math.random() * 1.5
                        });
                    }
                }
            }

            // Xử lý Sát thương Đốt cháy (DOT)
            if (enemy.burnTimer && enemy.burnTimer > 0) {
                enemy.burnTimer--;
                if (enemy.burnTimer % 10 === 0) {
                    const burnDmg = enemy.burnDmg || 12;
                    enemy.hp -= burnDmg;
                    this.checkEnemyDead(enemy, enemy.x, enemy.y);
                    if (enemy.hp > 0) {
                        this.particles.push({
                            x: enemy.x + (Math.random() - 0.5) * 16,
                            y: enemy.y + (Math.random() - 0.5) * 10,
                            vx: (Math.random() - 0.5) * 0.5,
                            vy: -1 - Math.random() * 1.5,
                            color: Math.random() < 0.5 ? "#f97316" : "#ef4444", alpha: 0.8,
                            life: 15, maxLife: 15, size: 2 + Math.random() * 2
                        });
                    }
                }
            }
            
            // Xử lý quái Chữa Trị (Healer) hồi máu
            if (enemy.type === 'healer') {
                const healRate = 0.12; // Hồi 12% máu mỗi giây (tăng độ khó)
                const healRadius = 90;
                
                // Hồi máu cho bản thân Healer
                enemy.hp = Math.min(enemy.maxHp, enemy.hp + (enemy.maxHp * healRate / 60));
                
                // Hồi máu cho các quái lân cận
                this.enemies.forEach(other => {
                    if (other !== enemy) {
                        const dist = Math.hypot(other.x - enemy.x, other.y - enemy.y);
                        if (dist <= healRadius) {
                            const oldHp = other.hp;
                            other.hp = Math.min(other.maxHp, other.hp + (other.maxHp * healRate / 60));
                            
                            if (other.hp > oldHp && other.hp < other.maxHp && Math.random() < 0.12) {
                                this.particles.push({
                                    x: other.x + (Math.random() - 0.5) * 14,
                                    y: other.y + (Math.random() - 0.5) * 14,
                                    vx: (Math.random() - 0.5) * 0.4,
                                    vy: -0.5 - Math.random() * 0.5,
                                    color: "#22c55e",
                                    alpha: 1.0,
                                    life: 18 + Math.random() * 12,
                                    maxLife: 30,
                                    size: 1.2 + Math.random() * 1.5
                                });
                            }
                        }
                    }
                });
            }
            
            // Lấy waypoint từ đường đi assignedPath của quái
            const activePath = enemy.currentPath || this.paths[0];
            const targetPoint = activePath[enemy.pathIndex + 1];
            if (!targetPoint) {
                // Quái đã chạm đích lâu đài
                let dmg = 1;
                // Nếu đang có khiên Hoàng Kim Bảo Khiên của Gold Knight
                if (this.heroUltimateFX && this.heroUltimateFX.type === 'gold_shield') {
                    if (Math.random() < 0.5) {
                        dmg = 0;
                        this.spawnPopup(880, 260, "🛡️ CẢN ĐÒN!", "#fbbf24", 15);
                        // Phát tiếng chém nhẹ cản khiên
                        if (window.app && app.audio) app.audio.playTdSound('sword_slash');
                    }
                }
                
                this.hp = Math.max(0, this.hp - dmg);
                
                // Ghi nhận quái vượt qua thành công
                const escapedType = enemy.type || 'normal';
                if (!this.escapedMonsters) this.escapedMonsters = {};
                this.escapedMonsters[escapedType] = (this.escapedMonsters[escapedType] || 0) + 1;
                this.updateEscapedMonstersHUD();

                this.enemies.splice(i, 1);
                this.updateHUD();
                
                // Hiệu ứng màn hình rung đỏ nhẹ khi mất máu thực tế
                if (dmg > 0) {
                    this.triggerHurtFeedback();
                }
                
                // Kiểm tra thua cuộc
                if (this.hp <= 0) {
                    this.onDefeat();
                }
                continue;
            }
            
            // Tính khoảng cách tới waypoint tiếp theo
            const dx = targetPoint.x - enemy.x;
            const dy = targetPoint.y - enemy.y;
            const dist = Math.hypot(dx, dy);
            
            if (dist < currentSpeed) {
                enemy.x = targetPoint.x;
                enemy.y = targetPoint.y;
                enemy.pathIndex++;
            } else {
                enemy.x += (dx / dist) * currentSpeed;
                enemy.y += (dy / dist) * currentSpeed;
            }
        }

        // 2.5. Cập nhật Chiến Binh di chuyển & cản đường quái vật (Soldiers AI) - Đại cải tổ cử động chiến đấu
        for (let idx = this.soldiers.length - 1; idx >= 0; idx--) {
            const s = this.soldiers[idx];
            // Cập nhật animation timer
            s.animTimer++;
            if (s.animTimer > 5) {
                s.animFrame = (s.animFrame + 1) % 8;
                s.animTimer = 0;
            }
            
            // Cập nhật trạng thái tấn công (sword slash)
            if (s.slashTimer === undefined) s.slashTimer = 0;
            if (s.slashTimer > 0) s.slashTimer--;
            if (s.faceAngle === undefined) s.faceAngle = 0;

            // Tìm quái vật trong tầm gác của tháp, ưu tiên quái gần lâu đài (880, 300) nhất
            let closestEnemy = null;
            let minDistToCastle = Infinity;
            
            for (let e of this.enemies) {
                // Tháp lính chỉ cản đường quái đi bộ, không thể tấn công hay chặn quái bay
                const isAir = ['fast', 'shadow', 'ice_bat'].includes(e.type);
                if (isAir) continue;

                const distToTower = Math.hypot(e.x - s.tower.x, e.y - s.tower.y);
                if (distToTower <= s.tower.range) {
                    const distToCastle = Math.hypot(e.x - 880, e.y - 300);
                    if (distToCastle < minDistToCastle) {
                        minDistToCastle = distToCastle;
                        closestEnemy = e;
                    }
                }
            }

            if (closestEnemy) {
                // Quay mặt về phía quái vật
                s.faceAngle = Math.atan2(closestEnemy.y - s.y, closestEnemy.x - s.x);
                
                const dx = closestEnemy.x - s.x;
                const dy = closestEnemy.y - s.y;
                const dist = Math.hypot(dx, dy);

                if (dist > 22) {
                    // Lao về phía quái - cử động xông tới
                    s.x += (dx / dist) * 2.8;
                    s.y += (dy / dist) * 2.8;
                    s.isCharging = true;
                } else {
                    s.isCharging = false;
                    // Đứng sát cản đường quái vật và tấn công!
                    // Bóng ma (ghost) không bị lính cản đường
                    if (closestEnemy.type !== 'ghost') {
                        closestEnemy.soldierSlowTimer = 30;
                        
                        // Quái vật tấn công lại chiến binh
                        let monsterDmg = 0.35; // sát thương cơ bản mỗi frame
                        if (closestEnemy.type === 'boss' || closestEnemy.type === 'titan') {
                            monsterDmg = 1.35;
                        } else if (['armored', 'healer', 'vampire', 'lava_golem'].includes(closestEnemy.type)) {
                            monsterDmg = 0.65;
                        }
                        s.hp = (s.hp || 100) - monsterDmg;
                    }
                    
                    // Lính chết khi hết HP
                    if (s.hp <= 0) {
                        this.spawnPopup(s.x, s.y - 15, "Lính tử trận! 💀", "#ef4444", 14);
                        if (window.app && app.audio) {
                            if (typeof app.audio.playLose === 'function') {
                                app.audio.playLose();
                            } else {
                                app.audio.playSound('lose');
                            }
                        }
                        
                        // Hiệu ứng hạt lính tan biến
                        for (let k = 0; k < 10; k++) {
                            const a = Math.random() * Math.PI * 2;
                            this.particles.push({
                                x: s.x, y: s.y,
                                vx: Math.cos(a) * 1.5, vy: Math.sin(a) * 1.5,
                                color: "#cbd5e1", alpha: 1,
                                life: 25, maxLife: 25, size: 2
                            });
                        }
                        
                        this.soldiers.splice(idx, 1);
                        continue;
                    }
                    
                    s.attackTimer++;
                    if (s.attackTimer >= s.tower.cooldown) {
                        s.attackTimer = 0;
                        s.slashTimer = 12; // kích hoạt animation chém 12 frames
                        closestEnemy.hp -= s.tower.damage;
                        this.checkEnemyDead(closestEnemy, closestEnemy.x, closestEnemy.y);
                        
                        // Phát âm thanh sword hit cho các chiến binh
                        if (window.app && app.audio) {
                            if (typeof app.audio.playSwordHit === 'function') {
                                app.audio.playSwordHit();
                            } else {
                                app.audio.playTdSound('sword_slash');
                            }
                        }

                        // Hiệu ứng tia lửa kiếm mạnh hơn - Sword Slash FX
                        for (let k = 0; k < 10; k++) {
                            const slashAngle = s.faceAngle + (Math.random() - 0.5) * 1.2;
                            const slashSpd = 2 + Math.random() * 4;
                            this.particles.push({
                                x: closestEnemy.x,
                                y: closestEnemy.y,
                                vx: Math.cos(slashAngle) * slashSpd,
                                vy: Math.sin(slashAngle) * slashSpd,
                                color: k % 2 === 0 ? "#fbbf24" : "#ffffff",
                                alpha: 1.0,
                                life: 8 + Math.random() * 10,
                                maxLife: 18,
                                size: 1.5 + Math.random() * 2
                            });
                        }
                        // Số sát thương bay lên
                        this.spawnPopup(closestEnemy.x, closestEnemy.y - 15, `-${s.tower.damage}`, "#fbbf24", 13);
                    }
                }
            } else {
                s.isCharging = false;
                // Không có quái: di chuyển từ từ trở lại vị trí gác ban đầu
                const dx = s.homeX - s.x;
                const dy = s.homeY - s.y;
                const dist = Math.hypot(dx, dy);
                if (dist > 2) {
                    s.x += (dx / dist) * 1.8;
                    s.y += (dy / dist) * 1.8;
                    s.faceAngle = Math.atan2(dy, dx);
                }
            }
        }

        // 2.6. Siêu Anh Hùng Chốt Chặn trước Cổng Lâu Đài - ĐÁNH THẬT + Tuyệt chiêu hoành tráng
        if (this.hero && this.hero.selectedId && this.isWaveActive) {
            const heroX = 800, heroY = 300; // vị trí hero trên canvas 960x600
            if (this.heroUltimateTimer === undefined) this.heroUltimateTimer = 0;
            if (this.heroAttackTimer === undefined) this.heroAttackTimer = 0;
            if (this.heroIsAttacking === undefined) this.heroIsAttacking = false;
            if (this.heroAttackAngle === undefined) this.heroAttackAngle = -Math.PI;
            if (this.heroUltimateActive === undefined) this.heroUltimateActive = false;
            if (this.heroUltimateFX === undefined) this.heroUltimateFX = null;
            
            this.heroUltimateTimer++;
            this.heroAttackTimer++;

            // Tìm kẻ địch gần lâu đài (880, 300) nhất trong tầm đánh của Hero
            let nearestEnemy = null;
            let minDistToCastle = Infinity;
            for (let e of this.enemies) {
                const d = Math.hypot(e.x - heroX, e.y - heroY);
                if (d < 220) {
                    const distToCastle = Math.hypot(e.x - 880, e.y - 300);
                    if (distToCastle < minDistToCastle) {
                        minDistToCastle = distToCastle;
                        nearestEnemy = e;
                    }
                }
            }
            
            const level = this.hero.level || 1;
            // Tốc độ tấn công của Hero (cooldown theo frame): Light (20 frames), Frost (22 frames), Gold (24 frames)
            const attackCooldown = this.hero.selectedId === 'light_warrior' ? 20 :
                                  this.hero.selectedId === 'frost_mage' ? 22 : 24;

            // Hero tấn công thường liên tục vào kẻ địch gần nhất
            if (nearestEnemy && this.heroAttackTimer >= attackCooldown) {
                this.heroAttackTimer = 0;
                this.heroIsAttacking = true;
                this.heroAttackAngle = Math.atan2(nearestEnemy.y - heroY, nearestEnemy.x - heroX);
                
                // Sức mạnh cơ bản tăng tiến khoa học theo Cấp độ Hero (tăng 15% sát thương mỗi cấp)
                let baseHeroDmg = this.hero.selectedId === 'light_warrior' ? 140 :
                                  this.hero.selectedId === 'frost_mage' ? 110 : 90;
                let heroDmg = Math.round(baseHeroDmg * (1 + (level - 1) * 0.15));
                
                // Light Warrior: 30% cơ hội chí mạng x2 sát thương
                let isCrit = false;
                if (this.hero.selectedId === 'light_warrior' && Math.random() < 0.3) {
                    heroDmg = Math.round(heroDmg * 2.0);
                    isCrit = true;
                }
                
                nearestEnemy.hp -= heroDmg;
                
                // Hiệu ứng đòn đánh thường của từng hero
                if (this.hero.selectedId === 'frost_mage') {
                    nearestEnemy.stunTimer = 120; // Đóng băng cứng 2 giây
                    if (window.app && app.audio) app.audio.playMagicSpell();
                } else {
                    if (window.app && app.audio) app.audio.playMagicSpell();
                    
                    if (this.hero.selectedId === 'gold_knight') {
                        // Gold Knight: Gây sát thương lan
                        this.enemies.forEach(e => {
                            if (e !== nearestEnemy) {
                                const distToTarget = Math.hypot(e.x - nearestEnemy.x, e.y - nearestEnemy.y);
                                if (distToTarget < 80) {
                                    e.hp -= Math.round(heroDmg * 0.5); // Sát thương lan bằng 50% sát thương chính
                                    this.checkEnemyDead(e, e.x, e.y);
                                }
                            }
                        });
                    }
                }
                
                this.checkEnemyDead(nearestEnemy, nearestEnemy.x, nearestEnemy.y);
                
                // Hiệu ứng hạt đòn tấn công thường
                const atkColor = this.hero.selectedId === 'light_warrior' ? '#ffd700' :
                                 this.hero.selectedId === 'frost_mage' ? '#38bdf8' : '#fbbf24';
                for (let k = 0; k < 12; k++) {
                    const aAngle = this.heroAttackAngle + (Math.random() - 0.5) * 1.0;
                    const aSpd = 3 + Math.random() * 5;
                    this.particles.push({
                        x: nearestEnemy.x, y: nearestEnemy.y,
                        vx: Math.cos(aAngle) * aSpd, vy: Math.sin(aAngle) * aSpd,
                        color: isCrit ? '#ffffff' : atkColor, alpha: 1.0,
                        life: 10 + Math.random() * 12, maxLife: 22, size: (isCrit ? 3 : 2) + Math.random() * 2.5
                    });
                }
                
                // Số sát thương của hero bay lên
                const popupText = isCrit ? `💥-${heroDmg} CHÍ MẠNG!` : `-${heroDmg}`;
                this.spawnPopup(nearestEnemy.x, nearestEnemy.y - 20, popupText, isCrit ? '#ff3b30' : atkColor, isCrit ? 16 : 14);
                
                // Reset trạng thái đang đánh sau 8 frames
                setTimeout(() => { this.heroIsAttacking = false; }, 135);
            }

            // Kiểm tra điều kiện kích hoạt tuyệt chiêu
            let enemyNearCastle = false;
            for (let e of this.enemies) {
                if (Math.hypot(e.x - heroX, e.y - heroY) < 160) {
                    enemyNearCastle = true; break;
                }
            }

            // Tối ưu thời gian hồi tuyệt chiêu khoa học hơn (Tránh hồi liên tục dẫn đến bất tử)
            if (this.heroUltimateTimer >= 720 || (enemyNearCastle && this.heroUltimateTimer >= 360)) {
                this.heroUltimateTimer = 0;
                this.heroUltimateActive = true;
                
                if (this.hero.selectedId === 'light_warrior') {
                    // TUYỆT CHIÊU: THÁNH QUANG TRẢM - Sát thương lan mạnh, tăng tiến theo level
                    const ultDmg = Math.round(500 * (1 + (level - 1) * 0.15));
                    this.spawnPopup(heroX, heroY - 80, "⚡ THÁNH QUANG TRẢM! ⚡", "#ffd700", 22);
                    this.heroUltimateFX = { type: 'light_blast', timer: 40, x: heroX, y: heroY };
                    
                    if (window.app && app.audio) app.audio.playMagicSpell();
                    
                    this.enemies.forEach(e => {
                        const d = Math.hypot(e.x - heroX, e.y - heroY);
                        if (d < 250) {
                            e.hp -= ultDmg * (1 - d / 300);
                            e.stunTimer = 120; // Choáng 2 giây
                            this.checkEnemyDead(e, e.x, e.y);
                        }
                    });
                    
                    // Vô số hạt ánh sáng kiếm chém
                    for (let i = 0; i < 60; i++) {
                        const a = Math.random() * Math.PI * 2;
                        const spd = 3 + Math.random() * 8;
                        this.particles.push({
                            x: heroX, y: heroY,
                            vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
                            color: i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#ffd700' : '#fffacd',
                            alpha: 1, life: 30 + Math.random() * 20, maxLife: 50, size: 2 + Math.random() * 4
                        });
                    }
                    
                } else if (this.hero.selectedId === 'frost_mage') {
                    // TUYỆT CHIÊU: BĂNG PHONG BÃO TUYẾT - Đóng băng toàn bản đồ, sát thương tăng tiến theo level
                    const ultDmg = Math.round(300 * (1 + (level - 1) * 0.15));
                    this.spawnPopup(heroX, heroY - 80, "❄️ BĂNG PHONG BÃO TUYẾT! ❄️", "#38bdf8", 22);
                    this.heroUltimateFX = { type: 'frost_nova', timer: 50, x: heroX, y: heroY, radius: 0 };
                    
                    if (window.app && app.audio) app.audio.playMagicSpell();
                    
                    this.enemies.forEach(e => {
                        e.stunTimer = 300; // Đóng băng cứng 5 giây
                        e.hp -= ultDmg;
                        this.checkEnemyDead(e, e.x, e.y);
                    });
                    
                    // Sóng băng
                    for (let i = 0; i < 70; i++) {
                        const a = Math.random() * Math.PI * 2;
                        const spd = 1.5 + Math.random() * 7;
                        this.particles.push({
                            x: heroX, y: heroY,
                            vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
                            color: i % 4 === 0 ? '#e0f2fe' : i % 4 === 1 ? '#38bdf8' : i % 4 === 2 ? '#7dd3fc' : '#ffffff',
                            alpha: 1, life: 35 + Math.random() * 25, maxLife: 60, size: 1.5 + Math.random() * 4
                        });
                    }
                    
                    // Thêm 40 hạt tuyết rơi 3D từ trên trời xuống
                    for (let i = 0; i < 40; i++) {
                        this.particles.push({
                            x: Math.random() * this.canvas.width,
                            y: -20 - Math.random() * 100,
                            vx: (Math.random() - 0.5) * 1.5,
                            vy: 2 + Math.random() * 4.5,
                            color: "#ffffff",
                            alpha: 0.9,
                            life: 120 + Math.random() * 60,
                            maxLife: 180,
                            size: 3 + Math.random() * 4,
                            isSnowflake: true,
                            angle: Math.random() * Math.PI,
                            rotSpeed: (Math.random() - 0.5) * 0.05
                        });
                    }
                    
                } else if (this.hero.selectedId === 'gold_knight') {
                    // TUYỆT CHIÊU: HOÀNG KIM BẢO KHIÊN - Khiên bao quanh Lâu đài, hồi 1 HP (Tính toán khoa học cân bằng)
                    this.spawnPopup(heroX, heroY - 80, "🛡️ HOÀNG KIM BẢO KHIÊN! 🛡️", "#fbbf24", 22);
                    this.heroUltimateFX = { type: 'gold_shield', timer: 360, x: heroX, y: heroY };
                    
                    if (window.app && app.audio) app.audio.playMagicSpell();
                    
                    this.hp = Math.min(this.maxHp, this.hp + 1);
                    this.updateHUD();
                    
                    // Hạt năng lượng hoàng kim bùng nổ
                    for (let i = 0; i < 50; i++) {
                        const a = Math.random() * Math.PI * 2;
                        const spd = 2 + Math.random() * 6;
                        this.particles.push({
                            x: heroX, y: heroY,
                            vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
                            color: i % 2 === 0 ? '#fbbf24' : '#ffd700',
                            alpha: 1, life: 28 + Math.random() * 20, maxLife: 48, size: 2 + Math.random() * 3
                        });
                    }
                }
                
                // Rung màn hình khi tung tuyệt chiêu
                const container = document.getElementById("td-game-container");
                if (container) {
                    container.classList.add("shake-red-effect");
                    setTimeout(() => container.classList.remove("shake-red-effect"), 250);
                }
            }
            
            // Đếm ngược hiệu ứng tuyệt chiêu
            if (this.heroUltimateFX && this.heroUltimateFX.timer > 0) {
                this.heroUltimateFX.timer--;
                if (this.heroUltimateFX.timer <= 0) {
                    this.heroUltimateFX = null;
                    this.heroUltimateActive = false;
                }
            }
        }
        
        // 3. Cập nhật Tháp phát đạn bắn quái
        this.towers.forEach(tower => {
            // Tìm quái trong tầm bắn gần lâu đài (880, 300) nhất
            let target = null;
            let minDistToCastle = Infinity;
            
            this.enemies.forEach(e => {
                // Tháp Pháo (bomb) và Tháp Lính (soldier) CHỈ tác dụng lên loài đi bộ (không nhắm quái bay)
                const isAir = ['fast', 'shadow', 'ice_bat'].includes(e.type);
                if ((tower.type === 'bomb' || tower.type === 'soldier') && isAir) return;

                const dist = Math.hypot(e.x - tower.x, e.y - tower.y);
                if (dist <= tower.range) {
                    const distToCastle = Math.hypot(e.x - 880, e.y - 300);
                    if (distToCastle < minDistToCastle) {
                        minDistToCastle = distToCastle;
                        target = e;
                    }
                }
            });

            // Tính góc xoay nòng súng/chốt canh hướng về quái vật mục tiêu
            if (target) {
                tower.angle = Math.atan2(target.y - tower.y, target.x - tower.x);
            } else {
                if (tower.angle === undefined) tower.angle = -Math.PI / 2; // Hướng lên mặc định
            }

            // Cập nhật thời gian Boost
            if (tower.boostTimer && tower.boostTimer > 0) {
                tower.boostTimer--;
            }
            if (tower.boostCooldown && tower.boostCooldown > 0) {
                tower.boostCooldown--;
            }

            // Tốc độ bắn x2 khi ở trạng thái Overdrive (Boost)
            tower.timer += (tower.boostTimer && tower.boostTimer > 0) ? 2 : 1;
            if (tower.timer >= tower.cooldown) {
                if (target) {
                    this.fireProjectile(tower, target);
                    tower.timer = 0;
                }
            }
        });
        
        // 4. Cập nhật đạn bay
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            
            // Đạn dạng tia hoặc sét biến mất nhanh
            if (p.type === 'laser' || p.type === 'lightning' || p.type === 'laser_beam') {
                p.life--;
                if (p.life <= 0) {
                    this.projectiles.splice(i, 1);
                }
                continue;
            }
            
            // Đạn bay có vật lý (Bomb, Arrow, Poison Flask, Fire Boulder, Void Orb)
            if (p.type === 'arrow' || p.type === 'bomb' || p.type === 'poison_flask' || p.type === 'fire_boulder' || p.type === 'void_orb') {
                const target = p.target;
                // Nếu quái đã bị diệt bởi đạn khác, bay tới vị trí cuối cùng của nó
                const targetX = this.enemies.includes(target) ? target.x : p.lastTargetX;
                const targetY = this.enemies.includes(target) ? target.y : p.lastTargetY;
                p.lastTargetX = targetX;
                p.lastTargetY = targetY;
                
                const dx = targetX - p.x;
                const dy = targetY - p.y;
                const dist = Math.hypot(dx, dy);
                
                if (dist < p.speed) {
                    // Đạn chạm quái
                    if (p.type === 'arrow') {
                        if (this.enemies.includes(target)) {
                            // Quái bọc thép giảm 40% sát thương từ cung (nhận 0.6x)
                            const finalDmg = target.type === 'armored' ? Math.round(p.damage * 0.6) : p.damage;
                            target.hp -= finalDmg;
                            this.checkEnemyDead(target, targetX, targetY);
                            
                            // Hiệu ứng bắn trúng: tóe hạt máu đỏ
                            for (let k = 0; k < 5; k++) {
                                this.particles.push({
                                    x: targetX,
                                    y: targetY,
                                    vx: (Math.random() - 0.5) * 2.5,
                                    vy: (Math.random() - 0.5) * 2.5,
                                    color: "#ef4444",
                                    alpha: 1.0,
                                    life: 12 + Math.random() * 8,
                                    maxLife: 20,
                                    size: 1.0 + Math.random() * 1.2
                                });
                            }
                        }
                    } else if (p.type === 'bomb') {
                        this.hitEnemy(p, target, targetX, targetY);
                    } else if (p.type === 'poison_flask') {
                        // Nổ độc lan tỏa
                        this.enemies.forEach(e => {
                            if (Math.hypot(e.x - targetX, e.y - targetY) < 50) {
                                e.hp -= p.damage;
                                e.poisonTimer = p.poisonDuration;
                                e.poisonDmg = p.poisonDamage;
                                this.checkEnemyDead(e, e.x, e.y);
                            }
                        });
                        // Hạt độc bắn ra
                        for (let k = 0; k < 10; k++) {
                            const angle = Math.random() * Math.PI * 2;
                            const speed = 1 + Math.random() * 2.5;
                            this.particles.push({
                                x: targetX, y: targetY,
                                vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                                color: "#a855f7", alpha: 1.0,
                                life: 15 + Math.random() * 10, maxLife: 25,
                                size: 2 + Math.random() * 2
                            });
                        }
                    } else if (p.type === 'fire_boulder') {
                        // Nổ lửa đốt cháy
                        this.enemies.forEach(e => {
                            if (Math.hypot(e.x - targetX, e.y - targetY) < 60) {
                                e.hp -= p.damage;
                                e.burnTimer = p.burnDuration;
                                e.burnDmg = p.burnDamage;
                                this.checkEnemyDead(e, e.x, e.y);
                            }
                        });
                        // Hạt lửa bùng nổ
                        for (let k = 0; k < 12; k++) {
                            const angle = Math.random() * Math.PI * 2;
                            const speed = 1.5 + Math.random() * 3;
                            this.particles.push({
                                x: targetX, y: targetY,
                                vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
                                color: Math.random() < 0.6 ? "#ef4444" : "#f97316", alpha: 1.0,
                                life: 18 + Math.random() * 10, maxLife: 28,
                                size: 2.5 + Math.random() * 2.5
                            });
                        }
                    } else if (p.type === 'void_orb') {
                        // Tạo hố đen lực hút kéo gom quái
                        const pullStr = p.pullStrength;
                        const finalDmg = p.damage;
                        this.activeEffects.push({
                            timer: 40,
                            maxTimer: 40,
                            x: targetX,
                            y: targetY,
                            pullStrength: pullStr,
                            damage: finalDmg / 40,
                            draw: function(ctx, w, h) {
                                const progress = (this.maxTimer - this.timer) / this.maxTimer;
                                const alpha = Math.sin(progress * Math.PI) * 0.7;
                                ctx.save();
                                ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`;
                                ctx.beginPath();
                                ctx.arc(this.x, this.y, 45, 0, Math.PI * 2);
                                ctx.fill();
                                
                                ctx.fillStyle = `rgba(15, 23, 42, ${alpha * 1.3})`;
                                ctx.beginPath();
                                ctx.arc(this.x, this.y, 18, 0, Math.PI * 2);
                                ctx.fill();
                                
                                ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.arc(this.x, this.y, 30 + Math.sin(this.timer * 0.2) * 5, 0, Math.PI * 2);
                                ctx.stroke();
                                ctx.restore();
                            },
                            update: function() {
                                game.enemies.forEach(e => {
                                    const edx = this.x - e.x;
                                    const edy = this.y - e.y;
                                    const edist = Math.hypot(edx, edy);
                                    if (edist < 80) {
                                        if (edist > 5) {
                                            e.x += (edx / edist) * this.pullStrength;
                                            e.y += (edy / edist) * this.pullStrength;
                                        }
                                        e.hp -= this.damage;
                                        game.checkEnemyDead(e, e.x, e.y);
                                        e.slowTimer = Math.max(e.slowTimer || 0, 10);
                                    }
                                });
                            }
                        });
                        
                        // Hạt hố đen
                        for (let k = 0; k < 8; k++) {
                            const angle = Math.random() * Math.PI * 2;
                            this.particles.push({
                                x: targetX + Math.cos(angle) * 35,
                                y: targetY + Math.sin(angle) * 35,
                                vx: -Math.sin(angle) * 1.5,
                                vy: Math.cos(angle) * 1.5,
                                color: "#6366f1", alpha: 0.9, life: 30, maxLife: 30, size: 2
                            });
                        }
                    }
                    this.projectiles.splice(i, 1);
                } else {
                    p.x += (dx / dist) * p.speed;
                    p.y += (dy / dist) * p.speed;
                    
                    // Tàn bụi kéo theo sau đạn
                    if ((p.type === 'arrow' || p.type === 'poison_flask') && Math.random() < 0.35) {
                        this.particles.push({
                            x: p.x, y: p.y,
                            vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
                            color: p.type === 'poison_flask' ? "rgba(168, 85, 247, 0.4)" : "rgba(226, 232, 240, 0.4)",
                            alpha: 0.7, life: 10 + Math.random() * 8, maxLife: 18,
                            size: 1 + Math.random() * 1.2
                        });
                    } else if ((p.type === 'bomb' || p.type === 'fire_boulder' || p.type === 'void_orb') && Math.random() < 0.55) {
                        this.particles.push({
                            x: p.x, y: p.y,
                            vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6,
                            color: p.type === 'void_orb' ? "#6366f1" : (Math.random() < 0.5 ? "#ea580c" : "#fbbf24"),
                            alpha: 0.8, life: 12 + Math.random() * 6, maxLife: 18,
                            size: 1.2 + Math.random() * 1.5
                        });
                    }
                }
            }
        }
        
        // 5. Cập nhật các vụ nổ hạt
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const part = this.particles[i];
            part.x += part.vx;
            part.y += part.vy;
            part.life--;
            part.alpha = part.life / part.maxLife;
            if (part.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
        
        // Cập nhật hiệu ứng đặc biệt của siêu kỹ năng siêu anh hùng
        if (this.activeEffects) {
            for (let i = this.activeEffects.length - 1; i >= 0; i--) {
                const eff = this.activeEffects[i];
                eff.timer--;
                if (eff.update) {
                    eff.update();
                }
                if (eff.timer <= 0) {
                    this.activeEffects.splice(i, 1);
                }
            }
        }
        
        // 6. Cập nhật popup text bay
        for (let i = this.popups.length - 1; i >= 0; i--) {
            const pop = this.popups[i];
            pop.y -= 0.8;
            pop.life--;
            if (pop.life <= 0) {
                this.popups.splice(i, 1);
            }
        }

        // Cập nhật tái sinh lính cho các Tháp Lính
        this.towers.forEach(tower => {
            if (tower.type === 'soldier') {
                // Đếm số lính hiện có liên kết với tháp này
                const aliveSoldiers = this.soldiers.filter(s => s.tower === tower);
                if (aliveSoldiers.length < 4) {
                    if (tower.respawnTimer === undefined) tower.respawnTimer = 0;
                    tower.respawnTimer++;
                    if (tower.respawnTimer >= 240) { // 4 giây
                        tower.respawnTimer = 0;
                        // Sinh ra lính mới chạy từ tháp
                        const angle = (Math.PI / 2) * aliveSoldiers.length; // góc phân bổ vị trí gác
                        const homeX = tower.x + Math.cos(angle) * 38;
                        const homeY = tower.y + Math.sin(angle) * 38;
                        const baseHp = 100 + (tower.level - 1) * 60; // máu tăng theo level tháp
                        
                        this.soldiers.push({
                            tower: tower,
                            x: tower.x, // bắt đầu chạy ra từ tháp
                            y: tower.y,
                            homeX: homeX,
                            homeY: homeY,
                            maxHp: baseHp,
                            hp: baseHp,
                            targetEnemy: null,
                            attackTimer: 0,
                            animFrame: 0,
                            animTimer: 0
                        });
                        this.spawnPopup(tower.x, tower.y - 25, "Lính xuất chinh! 🛡️", "#22c55e", 13);
                    }
                }
            }
        });

        // Hồi Mana cho Siêu Anh Hùng
        if (this.mana !== undefined && this.maxMana !== undefined) {
            // Hồi 0.025 Mana mỗi frame (~1.5 Mana/s)
            this.mana = Math.min(this.maxMana, this.mana + 0.025);
            this.updateSkillsHUD();
        }

        // Cập nhật đếm ngược của các hiệu ứng kỹ năng đặc biệt
        if (this.towerDmgBuffTimer && this.towerDmgBuffTimer > 0) {
            this.towerDmgBuffTimer--;
        }
        if (this.doubleGoldTimer && this.doubleGoldTimer > 0) {
            this.doubleGoldTimer--;
        }

        // Cập nhật các cơ chế thời tiết và vật phẩm rơi mới
        this.updateWeather();
        this.updateDrops();

        // 7. Kiểm tra đợt quái hoàn thành (khi quái chết hết và không sinh thêm nữa)
        if (this.isWaveActive && this.hasStartedSpawning && !this.isSpawning && this.enemies.length === 0) {
            this.isWaveActive = false;
            
            // Gọi callback thông báo đợt quái hoàn thành để questions.js mở khóa nút Tiếp tục làm bài
            if (!this.isFreePlay && window.questions && typeof window.questions.onWaveComplete === 'function') {
                window.questions.onWaveComplete();
            }
            
            if (this.currentWave < this.totalWaves) {
                // Cho phép chuẩn bị đợt tiếp theo
                const startWaveBtn = document.getElementById("btn-start-wave");
                if (startWaveBtn) {
                    startWaveBtn.innerHTML = `🚀 BẮT ĐẦU PHÒNG THỦ (ĐỢT ${this.currentWave + 1})`;
                    startWaveBtn.classList.remove("hidden");
                }
                this.updateWavePreview();
                
                // Hiển thị thông báo nhỏ
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: `Đợt ${this.currentWave} hoàn thành! 🎉`,
                    html: `Hãy dùng số vàng kiếm thêm để xây hoặc nâng cấp tháp!`,
                    showConfirmButton: false,
                    target: document.getElementById('tab-practice') || 'body',
                    timer: 3000
                });
            } else {
                // Đã thủ thành thành công cả các đợt
                setTimeout(() => {
                    // Tạo hiệu ứng pháo hoa ăn mừng lớn
                    this.createVictoryConfetti(270, 100);
                    
                    if (this.isFreePlay) {
                        Swal.fire({
                            title: 'CHIẾN THẮNG RỰC RỠ! 🏆',
                            html: `<div style="font-size: 3.5rem; margin-bottom: 1rem;">🏰✨</div>
                                   <p>Chúc mừng con! Con đã phòng thủ thành công lâu đài qua cả <b>${this.totalWaves} đợt quái vật nguy hiểm</b>!</p>`,
                            showCancelButton: true,
                            confirmButtonText: 'Chơi lại 🎮',
                            cancelButtonText: 'Thoát game 🚪',
                            confirmButtonColor: 'var(--success)',
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
                    
                    Swal.fire({
                        title: 'CHIẾN THẮNG RỰC RỠ! 🏆',
                        html: `<div style="font-size: 3.5rem; margin-bottom: 1rem;">🏰✨</div>
                               <p>Chúc mừng con! Con đã phòng thủ thành công lâu đài qua cả <b>${this.totalWaves} đợt quái vật nguy hiểm</b>!</p>
                               <p style="color:var(--success); font-weight:bold;">Tri thức Toán học của con chính là vũ khí mạnh mẽ nhất!</p>`,
                        confirmButtonText: 'Xem kết quả bài học',
                        confirmButtonColor: 'var(--success)',
                        target: document.getElementById('tab-practice') || 'body',
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result && window.questions && typeof window.questions.finishPractice === 'function') {
                            window.questions.finishPractice();
                        }
                    });
                }, 1000);
            }
        }
    },
    
    // Kiểm tra quái vật chết và xử lý cộng vàng cùng hiệu ứng nổ tan rã,
        draw: function() {
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.screenShake > 0) {
            const dx = (Math.random() - 0.5) * this.screenShake * 2.5;
            const dy = (Math.random() - 0.5) * this.screenShake * 2.5;
            this.ctx.translate(dx, dy);
        }
        
        // Lấy thông tin màu sắc của Bản đồ ngẫu nhiên hiện tại (Random Map Theme)
        const theme = this.mapThemes[this.mapTheme] || this.mapThemes.plains;
        
        // 1. Vẽ nền bản đồ - gradient theo chủ đề
        const bgGrad = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        bgGrad.addColorStop(0, theme.bgGrad1 || theme.bg);
        bgGrad.addColorStop(1, theme.bgGrad2 || theme.bg);
        this.ctx.fillStyle = bgGrad;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Vẽ các chi tiết terrain trang trí theo chủ đề bản đồ
        this._drawMapTerrain(theme);
        
        // Vẽ lưới ô vuông neon chìm nhẹ theo chủ đề bản đồ
        this.ctx.strokeStyle = theme.grid;
        this.ctx.lineWidth = 1;
        const gridSize = 40;
        for (let gx2 = 0; gx2 < this.canvas.width; gx2 += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(gx2, 0);
            this.ctx.lineTo(gx2, this.canvas.height);
            this.ctx.stroke();
        }
        for (let gy2 = 0; gy2 < this.canvas.height; gy2 += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, gy2);
            this.ctx.lineTo(this.canvas.width, gy2);
            this.ctx.stroke();
        }

        // 2. Vẽ tất cả 3 đường đi của quái vật (Multi-paths) - Bóng đổ 3D & Họa tiết gạch đá lát đường Chibi
        this.paths.forEach(p => {
            // 2.1. Lớp bóng đổ 3D bên dưới con đường (offset nhẹ)
            this.ctx.strokeStyle = "rgba(0, 0, 0, 0.18)";
            this.ctx.lineWidth = 38;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.beginPath();
            this.ctx.moveTo(p[0].x + 3, p[0].y + 5);
            for (let i = 1; i < p.length; i++) this.ctx.lineTo(p[i].x + 3, p[i].y + 5);
            this.ctx.stroke();

            // 2.2. Lớp ngoài: glow phát sáng theo chủ đề
            this.ctx.strokeStyle = theme.border;
            this.ctx.lineWidth = 50;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.shadowColor = theme.border;
            this.ctx.shadowBlur = 5;
            this.ctx.beginPath();
            this.ctx.moveTo(p[0].x, p[0].y);
            for (let i = 1; i < p.length; i++) this.ctx.lineTo(p[i].x, p[i].y);
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;

            // 2.3. Lớp giữa: đường đi chính
            this.ctx.strokeStyle = theme.pathCenter || theme.path;
            this.ctx.lineWidth = 32;
            this.ctx.beginPath();
            this.ctx.moveTo(p[0].x, p[0].y);
            for (let i = 1; i < p.length; i++) this.ctx.lineTo(p[i].x, p[i].y);
            this.ctx.stroke();

            // 2.4. Các vệt nét đứt mờ giả lập các viên đá lát đường Chibi
            this.ctx.save();
            this.ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
            this.ctx.lineWidth = 24;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
            this.ctx.setLineDash([6, 26]); // các viên gạch lát đường mờ nhạt
            this.ctx.beginPath();
            this.ctx.moveTo(p[0].x, p[0].y);
            for (let i = 1; i < p.length; i++) this.ctx.lineTo(p[i].x, p[i].y);
            this.ctx.stroke();
            this.ctx.restore();

            // 2.5. Lớp trong: viền cạnh sáng mỏng để tạo khối nổi 3D
            this.ctx.strokeStyle = theme.pathEdge || 'rgba(255,255,255,0.15)';
            this.ctx.lineWidth = 1.2;
            this.ctx.beginPath();
            this.ctx.moveTo(p[0].x, p[0].y);
            for (let i = 1; i < p.length; i++) this.ctx.lineTo(p[i].x, p[i].y);
            this.ctx.stroke();
        });

        // 2.5. Vẽ các ô lưới hợp lệ có thể xây tháp (mờ mờ nét đứt)
        if (this.selectedTowerType && !this.confirmBuildPos) {
            this.ctx.save();
            this.ctx.strokeStyle = "rgba(34, 197, 94, 0.2)";
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([3, 5]);
            for (let gx = 20; gx < this.canvas.width; gx += 40) {
                for (let gy = 20; gy < this.canvas.height; gy += 40) {
                    if (this.isValidGrid(gx, gy)) {
                        this.ctx.strokeRect(gx - 16, gy - 16, 32, 32);
                    }
                }
            }
            this.ctx.restore();
        }

        // 2.6. Vẽ preview tháp ảo đi theo chuột
        if (this.selectedTowerType && this.previewX !== null && !this.confirmBuildPos) {
            this.ctx.save();
            // Vẽ mờ tầm bắn của TẤT CẢ các tháp đã xây để trực quan hóa tầm phủ hỏa lực
            this.towers.forEach(t => {
                this.ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
                this.ctx.lineWidth = 1;
                this.ctx.setLineDash([3, 6]);
                this.ctx.beginPath();
                this.ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
                this.ctx.stroke();
            });
            this.ctx.restore();

            this.ctx.save();
            this.ctx.fillStyle = this.isPreviewValid ? "rgba(34, 197, 94, 0.18)" : "rgba(239, 68, 68, 0.18)";
            this.ctx.fillRect(this.previewX - 20, this.previewY - 20, 40, 40);
            this.ctx.strokeStyle = this.isPreviewValid ? "rgba(34, 197, 94, 0.45)" : "rgba(239, 68, 68, 0.45)";
            this.ctx.strokeRect(this.previewX - 20, this.previewY - 20, 40, 40);
            
            const range = this.towerConfig[this.selectedTowerType].range;
            this.ctx.fillStyle = this.isPreviewValid ? "rgba(34, 197, 94, 0.05)" : "rgba(239, 68, 68, 0.05)";
            this.ctx.strokeStyle = this.isPreviewValid ? "rgba(34, 197, 94, 0.25)" : "rgba(239, 68, 68, 0.25)";
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.arc(this.previewX, this.previewY, range, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            
            this.ctx.globalAlpha = 0.55;
            this.drawSingleTower({
                x: this.previewX,
                y: this.previewY,
                type: this.selectedTowerType,
                level: 1,
                angle: -Math.PI / 2
            });
            this.ctx.restore();
        }

        // 2.7. Vẽ tháp đang chờ xác nhận kèm hai nút ✔ / ✖ dưới chân tháp
        if (this.confirmBuildPos) {
            const buildX = this.confirmBuildPos.x;
            const buildY = this.confirmBuildPos.y;
            
            this.ctx.save();
            this.ctx.globalAlpha = 0.8;
            this.drawSingleTower({
                x: buildX,
                y: buildY,
                type: this.confirmBuildPos.type,
                level: 1,
                angle: -Math.PI / 2
            });
            this.ctx.restore();
            
            const range = this.towerConfig[this.confirmBuildPos.type].range;
            this.ctx.strokeStyle = "rgba(245, 158, 11, 0.45)";
            this.ctx.lineWidth = 1.5;
            this.ctx.setLineDash([4, 4]);
            this.ctx.beginPath();
            this.ctx.arc(buildX, buildY, range, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            const yesX = buildX - 22;
            const yesY = buildY + 25;
            const noX = buildX + 22;
            const noY = buildY + 25;
            
            this.ctx.fillStyle = "#22c55e";
            this.ctx.strokeStyle = "#ffffff";
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            this.ctx.arc(yesX, yesY, 13, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "bold 13px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText("✔", yesX, yesY);
            
            this.ctx.fillStyle = "#ef4444";
            this.ctx.beginPath();
            this.ctx.arc(noX, noY, 13, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "bold 13px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText("✖", noX, noY);
        }

        // 3. Vẽ 3 Cổng quái vật xuất phát ở điểm đầu của 3 paths
        this.paths.forEach((p, idx) => {
            const startPos = p[0];
            if (this.imagesLoaded && this.images['portal']) {
                this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
                this.ctx.beginPath();
                this.ctx.ellipse(startPos.x, startPos.y + 12, 18, 5, 0, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.drawImage(this.images['portal'], startPos.x - 24, startPos.y - 32, 48, 48);
            } else {
                this.ctx.fillStyle = "rgba(168, 85, 247, 0.5)";
                this.ctx.beginPath();
                this.ctx.arc(startPos.x, startPos.y, 18, 0, Math.PI * 2);
                this.ctx.fill();
            }
        });

        // 4. Vẽ Lâu đài Hoàng Gia hoành tráng ở đích (880, 300) - canvas 960x600
        const castlePos = { x: 880, y: 300 };
        if (this.imagesLoaded && this.images['castle']) {
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
            this.ctx.beginPath();
            this.ctx.ellipse(castlePos.x, castlePos.y + 14, 52, 14, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.drawImage(this.images['castle'], castlePos.x - 56, castlePos.y - 70, 110, 90);
        } else {
            this.ctx.fillStyle = "#334155";
            this.ctx.fillRect(castlePos.x - 32, castlePos.y - 40, 64, 54);
        }

        // 4.5. VẼ SIÊU ANH HÙNG CHỐT CHẶN TRƯỚC CỔNG LÂU ĐÀI - Đại cải tổ đồ họa chiến đấu thật
        if (this.hero && this.hero.selectedId) {
            const heroX = 800;
            const heroY = 300;
            const heroLevel = this.hero.level || 1;
            const heroImgKey = 'hero_' + (this.hero.selectedId === 'light_warrior' ? 'light' : (this.hero.selectedId === 'frost_mage' ? 'frost' : 'gold'));
            const heroColor = this.hero.selectedId === 'light_warrior' ? '#ffd700' :
                              this.hero.selectedId === 'frost_mage' ? '#38bdf8' : '#fbbf24';

            this.ctx.save();
            
            // Hiệu ứng tuyệt chiêu Visual FX (vẽ TRƯỚC hero)
            if (this.heroUltimateFX) {
                const fx = this.heroUltimateFX;
                const fxProgress = 1 - fx.timer / 50;
                
                if (fx.type === 'light_blast') {
                    // Cột ánh sáng vàng bùng nổ từ hero
                    const blastRadius = fxProgress * 200;
                    const blastAlpha = Math.max(0, 1 - fxProgress);
                    // Vòng sóng chấn động
                    this.ctx.strokeStyle = `rgba(255, 215, 0, ${blastAlpha})`;
                    this.ctx.lineWidth = 8 * (1 - fxProgress);
                    this.ctx.beginPath();
                    this.ctx.arc(fx.x, fx.y, blastRadius, 0, Math.PI * 2);
                    this.ctx.stroke();
                    // Cột sáng thẳng đứng
                    const grad = this.ctx.createLinearGradient(fx.x, fx.y - 150 * fxProgress, fx.x, fx.y + 150 * fxProgress);
                    grad.addColorStop(0, 'rgba(255,255,255,0)');
                    grad.addColorStop(0.5, `rgba(255,215,0,${blastAlpha * 0.8})`);
                    grad.addColorStop(1, 'rgba(255,255,255,0)');
                    this.ctx.fillStyle = grad;
                    this.ctx.fillRect(fx.x - 18, fx.y - 150 * fxProgress, 36, 300 * fxProgress);
                    
                } else if (fx.type === 'frost_nova') {
                    // Sóng băng lan tỏa
                    const novaRadius = fxProgress * 280;
                    const novaAlpha = Math.max(0, 1.2 - fxProgress * 1.5);
                    this.ctx.strokeStyle = `rgba(56, 189, 248, ${novaAlpha})`;
                    this.ctx.lineWidth = 6 * (1 - fxProgress * 0.5);
                    this.ctx.beginPath();
                    this.ctx.arc(fx.x, fx.y, novaRadius, 0, Math.PI * 2);
                    this.ctx.stroke();
                    // Vòng trong
                    this.ctx.strokeStyle = `rgba(224, 242, 254, ${novaAlpha * 0.7})`;
                    this.ctx.lineWidth = 3;
                    this.ctx.beginPath();
                    this.ctx.arc(fx.x, fx.y, novaRadius * 0.6, 0, Math.PI * 2);
                    this.ctx.stroke();
                    
                } else if (fx.type === 'gold_shield') {
                    // Khiên hoàng kim elip 3D xoay tròn bao quanh Lâu đài ở đích (880, 300)
                    const castleX = 880, castleY = 300;
                    const shieldAlpha = Math.max(0, 1 - fxProgress * 0.8);
                    const shieldRadius = 75;
                    
                    this.ctx.save();
                    this.ctx.strokeStyle = `rgba(251, 191, 36, ${shieldAlpha * 0.85})`;
                    this.ctx.lineWidth = 3;
                    this.ctx.shadowColor = "#fbbf24";
                    this.ctx.shadowBlur = 15;
                    
                    // Vòng tròn phát sáng ngoài
                    this.ctx.beginPath();
                    this.ctx.arc(castleX, castleY, shieldRadius + 6, 0, Math.PI * 2);
                    this.ctx.stroke();
                    
                    // Lục giác năng lượng 3D xoay tròn elip
                    this.ctx.fillStyle = `rgba(251, 191, 36, ${shieldAlpha * 0.12})`;
                    this.ctx.beginPath();
                    for (let si = 0; si < 6; si++) {
                        const sa = (Math.PI / 3) * si + Date.now() * 0.002;
                        const sx = castleX + Math.cos(sa) * (shieldRadius * 1.15);
                        const sy = castleY + Math.sin(sa) * (shieldRadius * 0.7);
                        si === 0 ? this.ctx.moveTo(sx, sy) : this.ctx.lineTo(sx, sy);
                    }
                    this.ctx.closePath();
                    this.ctx.fill();
                    this.ctx.stroke();
                    
                    // Các hạt năng lượng vàng bảo vệ bốc lên
                    if (Math.random() < 0.35) {
                        const pa = Math.random() * Math.PI * 2;
                        this.particles.push({
                            x: castleX + Math.cos(pa) * (shieldRadius * 0.8),
                            y: castleY + Math.sin(pa) * (shieldRadius * 0.5),
                            vx: (Math.random() - 0.5) * 0.5,
                            vy: -1 - Math.random() * 1.5,
                            color: "#fbbf24",
                            alpha: 1,
                            life: 25 + Math.random() * 15,
                            maxLife: 40,
                            size: 1.5 + Math.random() * 1.5
                        });
                    }
                    this.ctx.restore();
                }
            }
            
            // Hào quang năng lượng dưới chân Hero (xoay theo thời gian)
            const auraTime = Date.now() * 0.002;
            const auraAlpha = this.heroUltimateActive ? 0.5 : 0.2;
            this.ctx.fillStyle = `rgba(${heroColor === '#38bdf8' ? '56,189,248' : heroColor === '#ffd700' ? '255,215,0' : '251,191,36'}, ${auraAlpha})`;
            this.ctx.beginPath();
            this.ctx.ellipse(heroX, heroY + 18, 30 + Math.sin(auraTime) * 4, 10, 0, 0, Math.PI * 2);
            this.ctx.fill();
            // Vòng hào quang neon phát sáng
            this.ctx.strokeStyle = heroColor;
            this.ctx.lineWidth = 1.5;
            this.ctx.globalAlpha = 0.5 + Math.sin(auraTime * 2) * 0.2;
            this.ctx.beginPath();
            this.ctx.ellipse(heroX, heroY + 18, 32, 11, 0, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.globalAlpha = 1.0;

            // Vẽ hình ảnh Siêu Anh Hùng - kích thước lớn hơn, có cử động chiến đấu thật
            if (this.imagesLoaded && this.images[heroImgKey]) {
                let drawX = heroX, drawY = heroY;
                let scaleX = 1, scaleY = 1;
                let heroW = 72, heroH = 80;
                
                // Animation chiến đấu thật
                if (this.heroIsAttacking) {
                    // Cử động lao tới khi tấn công
                    drawX += Math.cos(this.heroAttackAngle) * 8;
                    drawY += Math.sin(this.heroAttackAngle) * 8;
                    scaleX = this.heroAttackAngle < -Math.PI / 2 || this.heroAttackAngle > Math.PI / 2 ? -1.05 : 1.05;
                    scaleY = 0.92; // nén nhẹ khi đánh
                } else {
                    // Hiệu ứng lơ lửng nhẹ khi không đánh
                    const hover = Math.sin(Date.now() * 0.006) * 5;
                    drawY += hover;
                    // Nhịp thở nhẹ
                    scaleY = 1 + Math.sin(Date.now() * 0.004) * 0.03;
                }
                
                // Vẽ hero với transform scale
                this.ctx.save();
                this.ctx.translate(drawX, drawY - heroH / 2);
                this.ctx.scale(scaleX, scaleY);
                this.ctx.drawImage(this.images[heroImgKey], -heroW / 2, 0, heroW, heroH);
                this.ctx.restore();
                
                // Vẽ kiếm khí / hiệu ứng đòn tấn công (sword arc)
                if (this.heroIsAttacking && this.heroAttackAngle !== undefined) {
                    this.ctx.save();
                    this.ctx.translate(heroX, heroY);
                    this.ctx.rotate(this.heroAttackAngle);
                    
                    // Vẽ vệt chém kiếm hình elip/nêm gradient phát sáng neon cực đẹp
                    const grad = this.ctx.createRadialGradient(0, 0, 30, 0, 0, 65);
                    grad.addColorStop(0, "rgba(255, 255, 255, 0)");
                    grad.addColorStop(0.8, heroColor);
                    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
                    
                    this.ctx.fillStyle = grad;
                    this.ctx.shadowColor = heroColor;
                    this.ctx.shadowBlur = 20;
                    this.ctx.beginPath();
                    this.ctx.moveTo(30, -12);
                    this.ctx.quadraticCurveTo(65, 0, 30, 12);
                    this.ctx.lineTo(60, 25);
                    this.ctx.quadraticCurveTo(80, 0, 60, -25);
                    this.ctx.closePath();
                    this.ctx.fill();
                    
                    // Đường kiếm khí mảnh màu trắng sắc nét ở giữa
                    this.ctx.strokeStyle = "#ffffff";
                    this.ctx.lineWidth = 2.5;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, 58, -0.4, 0.4);
                    this.ctx.stroke();
                    
                    this.ctx.restore();
                }
            } else {
                // Fallback emoji lớn hơn
                const hRegistry = this.hero.registry ? (this.hero.registry[this.hero.selectedId] || { emoji: "🛡️" }) : { emoji: "🛡️" };
                this.ctx.font = "44px sans-serif";
                this.ctx.textAlign = "center";
                const hover = Math.sin(Date.now() * 0.006) * 5;
                this.ctx.fillText(hRegistry.emoji, heroX, heroY + hover);
            }

            // Vẽ Tên và Cấp Độ nổi bật trên đầu Siêu Anh Hùng
            this.ctx.fillStyle = "#ffffff";
            this.ctx.strokeStyle = "#000000";
            this.ctx.lineWidth = 3.5;
            this.ctx.font = "bold 12px sans-serif";
            this.ctx.textAlign = "center";
            const heroTitle = `⭐ Cấp ${heroLevel} Anh Hùng`;
            this.ctx.strokeText(heroTitle, heroX, heroY - 52);
            this.ctx.fillStyle = heroColor;
            this.ctx.fillText(heroTitle, heroX, heroY - 52);
            this.ctx.restore();
        } else {
            // Vẽ hiệu ứng nhắc nhở chọn anh hùng ở Lâu đài khi chưa chọn
            this.ctx.save();
            const pulse = 1 + Math.sin(Date.now() * 0.005) * 0.12;
            this.ctx.strokeStyle = "rgba(251, 191, 36, 0.85)";
            this.ctx.lineWidth = 2.5;
            this.ctx.shadowColor = "#fbbf24";
            this.ctx.shadowBlur = 10;
            this.ctx.beginPath();
            this.ctx.ellipse(castlePos.x, castlePos.y, 60 * pulse, 30 * pulse, 0, 0, Math.PI * 2);
            this.ctx.stroke();
            
            // Vẽ mũi tên chỉ xuống nhấp nháy phía trên lâu đài
            const arrowY = castlePos.y - 85 + Math.sin(Date.now() * 0.007) * 8;
            this.ctx.fillStyle = "#fbbf24";
            this.ctx.shadowBlur = 8;
            this.ctx.beginPath();
            this.ctx.moveTo(castlePos.x, arrowY);
            this.ctx.lineTo(castlePos.x - 10, arrowY - 12);
            this.ctx.lineTo(castlePos.x - 4, arrowY - 12);
            this.ctx.lineTo(castlePos.x - 4, arrowY - 24);
            this.ctx.lineTo(castlePos.x + 4, arrowY - 24);
            this.ctx.lineTo(castlePos.x + 4, arrowY - 12);
            this.ctx.lineTo(castlePos.x + 10, arrowY - 12);
            this.ctx.closePath();
            this.ctx.fill();

            // Vẽ chữ hướng dẫn bé
            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "bold 13px 'Outfit', sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.shadowBlur = 4;
            this.ctx.shadowColor = "rgba(0,0,0,0.5)";
            this.ctx.fillText("Bấm Castle chọn Hộ Vệ!", castlePos.x, arrowY - 30);
            this.ctx.restore();
        }

        // 4.6. VẼ CÁC CHIẾN BINH THÁP LÍNH - Đại cải tổ cử động chiến đấu thật
        this.soldiers.forEach(s => {
            this.ctx.save();
            
            // Bóng đổ chiến binh to hơn và rõ hơn
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
            this.ctx.beginPath();
            this.ctx.ellipse(s.x, s.y + 12, 16, 5, 0, 0, Math.PI * 2);
            this.ctx.fill();

            const tLevel = s.tower ? s.tower.level : 1;

            if (this.imagesLoaded && this.images['soldier_unit']) {
                const faceAngle = s.faceAngle || 0;
                const isCharge = s.isCharging;
                const isSlashing = (s.slashTimer || 0) > 0;
                const soldierW = 44, soldierH = 44;
                
                // Hiệu ứng chiến binh đang chém - sword slash arc
                if (isSlashing) {
                    this.ctx.save();
                    this.ctx.translate(s.x, s.y);
                    this.ctx.rotate(faceAngle);
                    // Cung kiếm chém hình cung
                    this.ctx.strokeStyle = '#fbbf24';
                    this.ctx.lineWidth = 3.5;
                    this.ctx.globalAlpha = (s.slashTimer || 1) / 12;
                    this.ctx.shadowColor = '#fbbf24';
                    this.ctx.shadowBlur = 10;
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, 32, -0.7, 0.7);
                    this.ctx.stroke();
                    // Đầu kiếm sáng
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.beginPath();
                    this.ctx.arc(32 * Math.cos(0), 32 * Math.sin(0), 4, 0, Math.PI * 2);
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;
                    this.ctx.globalAlpha = 1.0;
                    this.ctx.restore();
                }
                
                // Vẽ chiến binh với cử động thật
                this.ctx.save();
                this.ctx.translate(s.x, s.y);
                
                let scaleX = 1, scaleY = 1;
                let offsetX = 0, offsetY = 0;
                
                if (isSlashing) {
                    // Cử động chém: nghiêng về phía trước + nén dọc
                    const lunge = Math.cos(s.faceAngle) * 6;
                    const lungeY = Math.sin(s.faceAngle) * 6;
                    offsetX = lunge;
                    offsetY = lungeY;
                    scaleY = 0.88;
                    scaleX = Math.cos(faceAngle) < 0 ? -1.12 : 1.12;
                } else if (isCharge) {
                    // Cử động xông tới: nghiêng người về phía trước
                    const t = Date.now() * 0.02;
                    offsetY = Math.sin(t) * 3; // chạy bộ nảy
                    scaleX = Math.cos(faceAngle) < 0 ? -1 : 1;
                } else {
                    // Đứng gác: nhúng nhẩy nhẹ
                    const bobPhase = Date.now() * 0.008 + s.homeX * 0.1;
                    offsetY = Math.sin(bobPhase) * 2.5;
                }
                
                // Áp dụng bộ lọc màu trang phục lính theo level tháp
                let filterStr = "none";
                if (tLevel === 2) {
                    filterStr = "hue-rotate(90deg) saturate(1.5)";
                } else if (tLevel === 3) {
                    filterStr = "hue-rotate(180deg) saturate(1.8) brightness(1.1)";
                } else if (tLevel >= 4) {
                    filterStr = "hue-rotate(270deg) saturate(2) brightness(1.2)";
                }
                
                if (filterStr !== "none") {
                    this.ctx.filter = filterStr;
                }
                
                this.ctx.scale(scaleX, scaleY);
                this.ctx.drawImage(this.images['soldier_unit'],
                    offsetX / scaleX - soldierW / 2,
                    offsetY / scaleY - soldierH / 2,
                    soldierW, soldierH);
                this.ctx.restore();
                
            } else {
                // Fallback chiến binh vector cải tiến
                let fillCol = '#22c55e';
                if (tLevel === 2) fillCol = '#38bdf8';
                else if (tLevel === 3) fillCol = '#ef4444';
                else if (tLevel >= 4) fillCol = '#fbbf24';
                
                this.ctx.fillStyle = (s.slashTimer || 0) > 0 ? '#fbbf24' : fillCol;
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(s.x, s.y, 12, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
                // Mũi kiếm hướng về phía quái
                if (s.faceAngle !== undefined) {
                    this.ctx.strokeStyle = '#fbbf24';
                    this.ctx.lineWidth = 3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(s.x, s.y);
                    this.ctx.lineTo(s.x + Math.cos(s.faceAngle) * 18, s.y + Math.sin(s.faceAngle) * 18);
                    this.ctx.stroke();
                }
            }
            
            // Vẽ thanh HP của lính khi bị mất máu
            if (s.hp !== undefined && s.maxHp !== undefined && s.hp < s.maxHp) {
                const barW = 22;
                const barH = 4;
                const hpRatio = Math.max(0, s.hp / s.maxHp);
                this.ctx.fillStyle = "rgba(0,0,0,0.65)";
                this.ctx.fillRect(s.x - barW / 2, s.y - 20, barW, barH);
                this.ctx.fillStyle = hpRatio > 0.5 ? "#22c55e" : hpRatio > 0.2 ? "#eab308" : "#ef4444";
                this.ctx.fillRect(s.x - barW / 2, s.y - 20, barW * hpRatio, barH);
            }
            
            this.ctx.restore();
        });

        // 5. Vẽ tháp phòng thủ đã xây dựng
        this.towers.forEach(t => {
            // Kiểm tra chuột đang hover qua tháp (khoảng cách chuột < 24px)
            const isHovered = Math.hypot(t.x - this.mouseX, t.y - this.mouseY) < 24;
            
            // Vẽ vòng tròn hiển thị tầm bắn nếu tháp được chọn hoặc được hover chuột qua
            if (t === this.selectedTowerInstance || isHovered) {
                this.ctx.save();
                this.ctx.fillStyle = t === this.selectedTowerInstance ? "rgba(255, 215, 0, 0.04)" : "rgba(255, 255, 255, 0.02)";
                this.ctx.strokeStyle = t === this.selectedTowerInstance ? "rgba(255, 215, 0, 0.35)" : "rgba(255, 255, 255, 0.22)";
                this.ctx.lineWidth = 1.2;
                if (isHovered && t !== this.selectedTowerInstance) {
                    this.ctx.setLineDash([4, 4]); // nét đứt khi hover
                }
                this.ctx.beginPath();
                this.ctx.arc(t.x, t.y, t.range, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.restore();
                
                // Vẽ vòng tròn năng lượng quanh chân tháp chọn
                if (t === this.selectedTowerInstance) {
                    this.ctx.save();
                    this.ctx.strokeStyle = "#fbbf24";
                    this.ctx.lineWidth = 2;
                    this.ctx.beginPath();
                    this.ctx.arc(t.x, t.y, 22, 0, Math.PI * 2);
                    this.ctx.stroke();
                    this.ctx.restore();
                }
            }
            
            // Vẽ bóng đổ dưới đất cho tháp
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            this.ctx.beginPath();
            this.ctx.ellipse(t.x, t.y + 11, 19, 6, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Vẽ hiệu ứng kích tốc (Boost/Overdrive) xung quanh tháp
            if (t.boostTimer && t.boostTimer > 0) {
                this.ctx.save();
                this.ctx.strokeStyle = `rgba(6, 182, 212, ${0.4 + 0.6 * Math.abs(Math.sin(performance.now() / 100))})`;
                this.ctx.lineWidth = 2.5;
                this.ctx.shadowColor = '#06b6d4';
                this.ctx.shadowBlur = 12;
                this.ctx.beginPath();
                this.ctx.arc(t.x, t.y, 22, 0, Math.PI * 2);
                this.ctx.stroke();
                
                // Vẽ các tia điện nhỏ phát ra từ tháp
                if (Math.random() < 0.35) {
                    this.ctx.strokeStyle = '#ffffff';
                    this.ctx.lineWidth = 1.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(t.x, t.y - 12);
                    let ex = t.x + (Math.random() - 0.5) * 36;
                    let ey = t.y - 12 + (Math.random() - 0.5) * 36;
                    this.ctx.lineTo((t.x + ex) / 2 + (Math.random() - 0.5) * 8, (t.y - 12 + ey) / 2 + (Math.random() - 0.5) * 8);
                    this.ctx.lineTo(ex, ey);
                    this.ctx.stroke();
                }
                this.ctx.restore();
            }

            // Vẽ tháp
            this.drawSingleTower(t);
        });
        
        // 6. Vẽ đạn bay
        this.projectiles.forEach(p => {
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = p.color;
            
            if (p.type === 'laser') {
                if (p.isRing) {
                    // Sóng băng lan tỏa từ tâm
                    const ringRadius = p.maxRadius * (1 - p.life / 15);
                    this.ctx.strokeStyle = `rgba(56, 189, 248, ${p.life / 15})`;
                    this.ctx.lineWidth = 3.5;
                    this.ctx.beginPath();
                    this.ctx.arc(p.x, p.y, ringRadius, 0, Math.PI * 2);
                    this.ctx.stroke();
                }
            } else if (p.type === 'arrow') {
                // Vẽ mũi tên gỗ bay chỉ hướng bay thực tế
                const arrowAngle = Math.atan2(p.lastTargetY - p.y, p.lastTargetX - p.x);
                
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(arrowAngle);
                
                // Nét thân mũi tên màu gỗ
                this.ctx.strokeStyle = "#854d0e";
                this.ctx.lineWidth = 1.8;
                this.ctx.beginPath();
                this.ctx.moveTo(-10, 0);
                this.ctx.lineTo(2, 0);
                this.ctx.stroke();
                
                // Đầu mũi tên tam giác xám sắt
                this.ctx.fillStyle = "#94a3b8";
                this.ctx.beginPath();
                this.ctx.moveTo(2, -3);
                this.ctx.lineTo(8, 0);
                this.ctx.lineTo(2, 3);
                this.ctx.closePath();
                this.ctx.fill();
                
                // Đuôi lông vũ trắng chỉ hướng
                this.ctx.fillStyle = "#ffffff";
                this.ctx.beginPath();
                this.ctx.moveTo(-10, -2.5);
                this.ctx.lineTo(-7, 0);
                this.ctx.lineTo(-10, 2.5);
                this.ctx.lineTo(-13, 0);
                this.ctx.closePath();
                this.ctx.fill();
                
                this.ctx.restore();
                
            } else if (p.type === 'bomb') {
                // Quả bom sắt đen tròn bay có tàn lửa rực đỏ
                this.ctx.fillStyle = "#1e293b";
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
                this.ctx.fill();

                // Hiệu ứng tàn lửa bay sau quả bom
                this.ctx.fillStyle = "#ea580c";
                this.ctx.beginPath();
                this.ctx.arc(p.x - 4, p.y, 3, 0, Math.PI * 2);
                this.ctx.fill();
            } else if (p.type === 'lightning') {
                // Sấm sét giật zigzag
                this.ctx.strokeStyle = `rgba(6, 182, 212, ${p.life / 8})`;
                this.ctx.lineWidth = 3;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = "#06b6d4";
                this.ctx.beginPath();
                for (let j = 0; j < p.points.length - 1; j++) {
                    const start = p.points[j];
                    const end = p.points[j+1];
                    const dx = end.x - start.x;
                    const dy = end.y - start.y;
                    const dist = Math.hypot(dx, dy);
                    const segments = Math.max(3, Math.floor(dist / 20));
                    
                    this.ctx.moveTo(start.x, start.y);
                    for (let s = 1; s < segments; s++) {
                        const fraction = s / segments;
                        const midX = start.x + dx * fraction;
                        const midY = start.y + dy * fraction;
                        const perpX = -dy / dist;
                        const perpY = dx / dist;
                        const offset = (Math.random() - 0.5) * 12;
                        this.ctx.lineTo(midX + perpX * offset, midY + perpY * offset);
                    }
                    this.ctx.lineTo(end.x, end.y);
                }
                this.ctx.stroke();
                
            } else if (p.type === 'laser_beam') {
                // Tia laser liên tục
                this.ctx.strokeStyle = `rgba(236, 72, 153, ${p.life / 4})`;
                this.ctx.lineWidth = 4;
                this.ctx.shadowBlur = 12;
                this.ctx.shadowColor = "#ec4899";
                this.ctx.beginPath();
                this.ctx.moveTo(p.startX, p.startY - 25);
                this.ctx.lineTo(p.endX, p.endY);
                this.ctx.stroke();
                
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${p.life / 4})`;
                this.ctx.lineWidth = 1.5;
                this.ctx.beginPath();
                this.ctx.moveTo(p.startX, p.startY - 25);
                this.ctx.lineTo(p.endX, p.endY);
                this.ctx.stroke();
                
            } else if (p.type === 'poison_flask') {
                // Bình độc màu tím bay xoay
                const angle = (Date.now() * 0.015) % (Math.PI * 2);
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(angle);
                
                // Bình thủy tinh tròn
                this.ctx.fillStyle = "#e2e8f0";
                this.ctx.strokeStyle = "#94a3b8";
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 5, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
                
                // Chất độc tím bên trong
                this.ctx.fillStyle = "#a855f7";
                this.ctx.beginPath();
                this.ctx.arc(0, 1, 3.5, 0, Math.PI);
                this.ctx.fill();
                
                // Cổ bình
                this.ctx.fillStyle = "#e2e8f0";
                this.ctx.fillRect(-1.5, -7, 3, 3);
                this.ctx.restore();
                
            } else if (p.type === 'fire_boulder') {
                // Viên dung nham rực đỏ bay bốc khói
                this.ctx.fillStyle = "#ea580c";
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Vết nứt vàng
                this.ctx.fillStyle = "#facc15";
                this.ctx.beginPath();
                this.ctx.arc(p.x + 1, p.y - 1, 2, 0, Math.PI * 2);
                this.ctx.fill();
                
            } else if (p.type === 'void_orb') {
                // Quả cầu lỗ đen nhỏ màu xanh chàm
                this.ctx.fillStyle = "#0f172a";
                this.ctx.strokeStyle = "#6366f1";
                this.ctx.lineWidth = 1.5;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.stroke();
            }
            this.ctx.shadowBlur = 0; // Reset
        });
        
        // 7. Vẽ các hạt bụi nổ lấp lánh và bông tuyết 3D rơi
        this.particles.forEach(part => {
            this.ctx.save();
            this.ctx.globalAlpha = part.alpha;
            if (part.isSnowflake) {
                // Vẽ bông tuyết 6 cánh xoay tròn 3D
                this.ctx.translate(part.x, part.y);
                this.ctx.rotate(part.angle || 0);
                this.ctx.strokeStyle = "#ffffff";
                this.ctx.lineWidth = 1.2;
                this.ctx.beginPath();
                for (let j = 0; j < 6; j++) {
                    this.ctx.moveTo(0, 0);
                    this.ctx.lineTo(0, -part.size);
                    this.ctx.moveTo(-part.size * 0.3, -part.size * 0.6);
                    this.ctx.lineTo(0, -part.size * 0.4);
                    this.ctx.lineTo(part.size * 0.3, -part.size * 0.6);
                    this.ctx.rotate(Math.PI / 3);
                }
                this.ctx.stroke();
                
                // Cập nhật xoay và lắc lư rơi tuyết
                part.angle += part.rotSpeed || 0.02;
                part.x += Math.sin(Date.now() * 0.005 + part.size) * 0.2;
            } else {
                this.ctx.fillStyle = part.color;
                this.ctx.beginPath();
                this.ctx.arc(part.x, part.y, part.size || 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
        });
        this.ctx.globalAlpha = 1.0; // Reset
        
        // 7.5. Vẽ quái vật di chuyển - Đại cải tổ vector renderer
        this.enemies.forEach(e => {
            // Hiệu ứng nhịp co giãn phập phồng Squash & Stretch theo thời gian
            const pulse = 1 + Math.sin(Date.now() * 0.012) * 0.08;
            
            // Vẽ bóng đổ dưới đất cho quái vật
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
            this.ctx.beginPath();
            this.ctx.ellipse(e.x, e.y + e.radius - 2, e.radius * pulse, 4, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Vẽ bóng đổ dưới chân quái trước khi render vector
            this.ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
            this.ctx.beginPath();
            this.ctx.ellipse(e.x, e.y + e.radius - 2, e.radius * pulse * 0.85, 4, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Gọi hàm vẽ vector cao cấp theo loại quái (THAY THẾ HOÀN TOÀN ảnh PNG)
            this.drawMonsterVector(e, pulse);

            // Hiệu ứng làm chậm (màu xanh dương băng bao quanh)
            if (e.slowTimer > 0) {
                this.ctx.save();
                this.ctx.strokeStyle = "rgba(56, 189, 248, 0.7)";
                this.ctx.lineWidth = 2.5;
                this.ctx.shadowColor = '#38bdf8';
                this.ctx.shadowBlur = 8;
                this.ctx.beginPath();
                this.ctx.arc(e.x, e.y, e.radius + 4, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
                this.ctx.restore();
            }

            // Thanh máu nhỏ trên đầu quái - thiết kế đẹp hơn
            const barW = e.radius * 2.2;
            const barH = 5;
            const hpRatio = Math.max(0, e.hp / e.maxHp);
            const barX = e.x - barW / 2;
            const barTopY = e.y - e.radius - (e.type === 'boss' ? 26 : e.type === 'healer' ? 22 : 12);
            // Nền thanh máu bo tròn
            this.ctx.fillStyle = "rgba(0,0,0,0.65)";
            this.ctx.beginPath();
            this.ctx.roundRect(barX - 1, barTopY - 1, barW + 2, barH + 2, 3);
            this.ctx.fill();
            // Thanh máu màu gradient
            const hpGrad = this.ctx.createLinearGradient(barX, barTopY, barX + barW, barTopY);
            if (hpRatio > 0.5) { hpGrad.addColorStop(0, '#22c55e'); hpGrad.addColorStop(1, '#4ade80'); }
            else if (hpRatio > 0.2) { hpGrad.addColorStop(0, '#d97706'); hpGrad.addColorStop(1, '#fbbf24'); }
            else { hpGrad.addColorStop(0, '#b91c1c'); hpGrad.addColorStop(1, '#ef4444'); }
            this.ctx.fillStyle = hpGrad;
            this.ctx.beginPath();
            this.ctx.roundRect(barX, barTopY, barW * hpRatio, barH, 2);
            this.ctx.fill();
        });

        // Vẽ hiệu ứng đặc biệt của siêu kỹ năng siêu anh hùng
        if (this.activeEffects) {
            this.activeEffects.forEach(eff => {
                if (eff.draw) {
                    eff.draw(this.ctx, this.canvas.width, this.canvas.height);
                }
            });
        }

        // 8. Vẽ popup chữ bay bay (+10G, +150G...) có viền đen nổi bật
        this.popups.forEach(pop => {
            this.ctx.save();
            this.ctx.font = `bold ${pop.size + 4 || 18}px sans-serif`;
            this.ctx.textAlign = "center";
            
            // Vẽ viền đen dày 3.5px để chữ nổi bần bật trên nền Canvas tối
            this.ctx.strokeStyle = "#000000";
            this.ctx.lineWidth = 3.5;
            this.ctx.strokeText(pop.text, pop.x, pop.y);
            
            // Vẽ chữ chính rực rỡ đè lên
            this.ctx.fillStyle = pop.color;
            this.ctx.fillText(pop.text, pop.x, pop.y);
            this.ctx.restore();
        });

        // 9. Vẽ Thẻ thông tin Hero RPG ở góc trên bên phải Canvas
        if (this.hero && this.hero.selectedId) {
            const h = this.hero.registry[this.hero.selectedId] || { name: "Anh Hùng", emoji: "🛡️" };
            const cardX = this.canvas.width - 180;
            const cardY = 12;
            const cardW = 158;
            const cardH = 50;
            
            this.ctx.save();
            
            // Vẽ nền đen mờ bo góc
            this.ctx.fillStyle = "rgba(15, 23, 42, 0.78)";
            this.ctx.strokeStyle = "rgba(251, 191, 36, 0.4)";
            this.ctx.lineWidth = 1.5;
            
            this.ctx.beginPath();
            if (typeof this.ctx.roundRect === 'function') {
                this.ctx.roundRect(cardX, cardY, cardW, cardH, 8);
            } else {
                this.ctx.rect(cardX, cardY, cardW, cardH);
            }
            this.ctx.fill();
            this.ctx.stroke();
            
            // Vẽ Emoji Anh Hùng
            this.ctx.font = "24px sans-serif";
            this.ctx.textAlign = "left";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(h.emoji, cardX + 8, cardY + cardH / 2);
            
            // Vẽ Tên Anh Hùng & Level
            this.ctx.font = "bold 10px sans-serif";
            this.ctx.fillStyle = "#ffffff";
            const shortName = h.name.split(' ').slice(0, 2).join(' ');
            this.ctx.fillText(`Cấp ${this.hero.level} ${shortName}`, cardX + 36, cardY + 16);
            
            // Vẽ Thanh XP màu tím neon
            const barX = cardX + 36;
            const barY = cardY + 28;
            const barW = 112;
            const barH = 5;
            const xpRatio = Math.min(1.0, this.hero.xp / this.hero.nextLevelXp);
            
            // Nền thanh XP
            this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            this.ctx.beginPath();
            if (typeof this.ctx.roundRect === 'function') {
                this.ctx.roundRect(barX, barY, barW, barH, 2.5);
            } else {
                this.ctx.rect(barX, barY, barW, barH);
            }
            this.ctx.fill();
            
            // Phần XP hiện tại (màu tím/magenta neon phát sáng)
            this.ctx.fillStyle = "#d946ef";
            this.ctx.beginPath();
            if (typeof this.ctx.roundRect === 'function') {
                this.ctx.roundRect(barX, barY, barW * xpRatio, barH, 2.5);
            } else {
                this.ctx.rect(barX, barY, barW * xpRatio, barH);
            }
            this.ctx.fill();
            
            // Vẽ chữ số XP nhỏ dưới thanh
            this.ctx.font = "8px sans-serif";
            this.ctx.fillStyle = "#cbd5e1";
            this.ctx.fillText(`XP: ${this.hero.xp}/${this.hero.nextLevelXp}`, cardX + 36, cardY + 41);
            
            this.ctx.restore();
        }

        // Vẽ hiệu ứng tia sét của kỹ năng Lôi Đình Vạn Quân
        if (this.lightningEffects && this.lightningEffects.length > 0) {
            this.ctx.save();
            for (let i = this.lightningEffects.length - 1; i >= 0; i--) {
                const effect = this.lightningEffects[i];
                this.ctx.strokeStyle = "#ffffff";
                this.ctx.lineWidth = 3;
                this.ctx.shadowColor = "#fbbf24";
                this.ctx.shadowBlur = 15;
                
                // Vẽ đường sét gấp khúc zigzag
                this.ctx.beginPath();
                this.ctx.moveTo(effect.startX, effect.startY);
                
                let curX = effect.startX;
                let curY = effect.startY;
                const segments = 5;
                const dy = (effect.endY - effect.startY) / segments;
                for (let j = 1; j < segments; j++) {
                    curX += (Math.random() - 0.5) * 30;
                    curY += dy;
                    this.ctx.lineTo(curX, curY);
                }
                this.ctx.lineTo(effect.endX, effect.endY);
                this.ctx.stroke();
                
                effect.life--;
                if (effect.life <= 0) {
                    this.lightningEffects.splice(i, 1);
                }
            }
            this.ctx.restore();
        }

        // Vẽ đếm ngược 3, 2, 1 trước khi quái vật xuất phát
        if (this.countdown !== null && this.countdown > 0) {
            this.ctx.save();
            this.ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Vẽ chữ đếm ngược số 3, 2, 1 phát sáng neon
            this.ctx.shadowColor = "#f43f5e";
            this.ctx.shadowBlur = 25;
            this.ctx.fillStyle = "#f43f5e";
            this.ctx.font = "bold 120px Outfit, sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(this.countdown, this.canvas.width / 2, this.canvas.height / 2 - 40);
            
            // Vẽ dòng chữ thông báo
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = "#ffffff";
            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "bold 26px Outfit, sans-serif";
            this.ctx.fillText("QUÁI VẬT SẮP XUẤT HIỆN!", this.canvas.width / 2, this.canvas.height / 2 + 60);
            this.ctx.restore();
        }

        // Vẽ các vật phẩm rơi (drops) & thời tiết động mới bổ sung
        this.drawDrops();
        this.drawWeather();

        this.ctx.restore();
    },
    
    // Phép tính khoảng cách từ điểm p đến đoạn thẳng v-w
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = GameCore;
    if (typeof root !== 'undefined') root.GameCore = GameCore;
})(typeof window !== 'undefined' ? window : global);
