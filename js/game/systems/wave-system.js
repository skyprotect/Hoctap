/**
 * GAME ENGINE - WAVE SPAWN SYSTEM
 */
(function(root) {
    'use strict';

    const WaveSystem = {
        startWaveByPlayer: function() {
        const startWaveBtn = document.getElementById("btn-start-wave");
        if (startWaveBtn) {
            startWaveBtn.classList.add("hidden"); // ẩn nút đi khi đang chạy
        }
        this.startNextWave();
    },

    // Hàm cập nhật bảng xem trước đợt quái (Wave Preview) - Đã bỏ theo yêu cầu
    updateWavePreview: function() {
    },

    // Thực sự bắt đầu sinh quái vật
    actuallyStartSpawning: function(waveMonsters) {
        this.isSpawning = true;
        this.hasStartedSpawning = true;
        let spawned = 0;
        const count = waveMonsters.length;
        
        this.spawnInterval = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(this.spawnInterval);
                this.isSpawning = false;
                return;
            }
            
            const monster = waveMonsters[spawned];
            if (monster) {
                // Ngẫu nhiên chọn 1 trong 3 hướng xuất phát đường đi
                const assignedPath = this.paths[Math.floor(Math.random() * this.paths.length)];
                this.enemies.push({
                    x: assignedPath[0].x,
                    y: assignedPath[0].y,
                    pathIndex: 0,
                    currentPath: assignedPath,
                    type: monster.type,
                    maxHp: monster.hp,
                    hp: monster.hp,
                    speed: monster.speed,
                    speedMultiplier: this.isRaged ? 2.0 : 1.0,
                    radius: monster.radius,
                    color: monster.color,
                    slowTimer: 0,
                    soldierSlowTimer: 0,
                    animFrame: 0,
                    animTimer: 0
                });
            }
            
            spawned++;
            if (spawned >= count) {
                clearInterval(this.spawnInterval);
                this.isSpawning = false;
            }
        }, 950); // Rút ngắn spawn delay từ 1100ms -> 950ms để quái ra dồn dập hơn
    },

    // Bắt đầu đợt quái mới
    startNextWave: function() {
        this.currentWave = Math.min(this.totalWaves, this.currentWave + 1);
        this.updateHUD();
        this.isWaveActive = true;
        this.isSpawning = false; // Bắt đầu ở dạng đếm ngược trước
        this.hasStartedSpawning = false;
        
        // Ẩn nút bắt đầu phòng thủ ngay lập tức
        const startWaveBtn = document.getElementById("btn-start-wave");
        if (startWaveBtn) startWaveBtn.classList.add("hidden");

        // Phát âm thanh báo hiệu quái vật xuất hiện
        if (window.app && app.audio) {
            app.audio.playMonter();
        }

        // Bắt đầu đếm ngược 3, 2, 1
        this.countdown = 3;
        
        // Định nghĩa chi tiết danh sách quái cho từng wave từ 15 loại quái
        const waveMonsters = [];
        const heroLevel = this.hero ? this.hero.level : 1;
        const heroId = this.hero ? this.hero.selectedId : null;
        
        // Thiết lập hệ số HP quái vật tăng tiến cân đối dựa trên loại Hero và Cấp độ Hero
        // Bảo đảm tính cân đối: Hero tăng sức mạnh tháp thì quái cũng tăng HP tương ứng
        let baseHpGrowRate = 0.06; // Mặc định tăng 6% HP quái mỗi cấp Hero
        if (heroId === 'light_warrior') {
            baseHpGrowRate = 0.08; // Light Warrior tăng sát thương tháp trực tiếp nên quái tăng 8% HP
        } else if (heroId === 'gold_knight') {
            baseHpGrowRate = 0.07; // Gold Knight tăng vàng & giảm giá xây tháp giúp xây nhiều tháp hơn
        }
        
        const hpMult = 1 + (heroLevel - 1) * baseHpGrowRate;
        const spdMult = 1 + (heroLevel - 1) * 0.02; // Tăng 2% tốc độ mỗi cấp Hero để giữ nhịp độ game
        
        if (this.currentWave === 1) {
            // Wave 1: Quái chạy theo bầy đàn cùng chủng loại
            const types = ["normal", "normal", "fire_slime", "fire_slime", "poison_slime", "poison_slime", "ice_bat", "ice_bat", "speedy_goblin", "speedy_goblin"];
            types.forEach((t, i) => {
                let hp = 85 + i * 10;
                let speed = 1.1 + i * 0.04;
                let radius = 15;
                let color = "#06b6d4";
                
                if (t === "fire_slime") {
                    hp = Math.round(hp * 1.15 * hpMult);
                    speed = speed * 1.25 * spdMult;
                    color = "#ef4444";
                } else if (t === "poison_slime") {
                    hp = Math.round(hp * 1.35 * hpMult);
                    speed = speed * 0.95 * spdMult;
                    color = "#84cc16";
                } else if (t === "ice_bat") {
                    hp = Math.round(hp * 1.05 * hpMult);
                    speed = speed * 1.65 * spdMult;
                    color = "#38bdf8";
                    radius = 13;
                } else if (t === "speedy_goblin") {
                    hp = Math.round(hp * 0.65 * hpMult);
                    speed = speed * 2.2 * spdMult;
                    color = "#ec4899";
                    radius = 12;
                } else {
                    hp = Math.round(hp * hpMult);
                    speed = speed * spdMult;
                }
                
                waveMonsters.push({ type: t, hp, speed, radius, color });
            });
        } else if (this.currentWave === 2) {
            // Wave 2: Quái chạy theo bầy đàn cùng chủng loại
            const types = ["normal", "normal", "armored", "armored", "fast", "fast", "shadow", "shadow", "gold_goblin", "gold_goblin", "ghost", "ghost", "poison_slime", "poison_slime", "ice_bat", "ice_bat"];
            types.forEach((t, i) => {
                let hp = 115 + i * 12;
                let speed = 1.2 + i * 0.04;
                let radius = 15;
                let color = "#06b6d4";
                
                if (t === "armored") {
                    hp = Math.round(hp * 2.2 * hpMult);
                    speed = speed * 0.75 * spdMult;
                    color = "#94a3b8";
                    radius = 16;
                } else if (t === "fast") {
                    hp = Math.round(hp * 0.8 * hpMult);
                    speed = speed * 1.95 * spdMult;
                    color = "#d946ef";
                    radius = 13;
                } else if (t === "shadow") {
                    hp = Math.round(hp * 1.25 * hpMult);
                    speed = speed * 1.5 * spdMult;
                    color = "#6366f1";
                    radius = 14;
                } else if (t === "gold_goblin") {
                    hp = Math.round(hp * 1.2 * hpMult);
                    speed = speed * 1.35 * spdMult;
                    color = "#eab308";
                    radius = 14;
                } else if (t === "ghost") {
                    hp = Math.round(hp * 0.9 * hpMult);
                    speed = speed * 1.1 * spdMult;
                    color = "#a855f7";
                    radius = 14;
                } else if (t === "poison_slime") {
                    hp = Math.round(hp * 1.35 * hpMult);
                    speed = speed * 0.95 * spdMult;
                    color = "#84cc16";
                } else if (t === "ice_bat") {
                    hp = Math.round(hp * 1.05 * hpMult);
                    speed = speed * 1.65 * spdMult;
                    color = "#38bdf8";
                    radius = 13;
                } else {
                    hp = Math.round(hp * hpMult);
                    speed = speed * spdMult;
                }
                
                waveMonsters.push({ type: t, hp, speed, radius, color });
            });
        } else if (this.currentWave === 3) {
            // Wave 3: Quái chạy theo bầy đàn cùng chủng loại
            const types = ["fire_slime", "fire_slime", "gold_goblin", "gold_goblin", "lava_golem", "lava_golem", "healer", "healer", "ghost", "ghost", "titan", "titan", "vampire", "vampire", "shadow", "shadow", "boss"];
            types.forEach((t, i) => {
                let hp = 145 + i * 15;
                let speed = 1.2 + i * 0.04;
                let radius = 15;
                let color = "#06b6d4";
                
                if (t === "boss") {
                    hp = Math.round(hp * 6.0 * hpMult);
                    speed = speed * 0.65 * spdMult;
                    color = "#fbbf24";
                    radius = 24;
                } else if (t === "titan") {
                    hp = Math.round(hp * 4.2 * hpMult);
                    speed = speed * 0.6 * spdMult;
                    color = "#1d4ed8";
                    radius = 20;
                } else if (t === "vampire") {
                    hp = Math.round(hp * 3.2 * hpMult);
                    speed = speed * 0.95 * spdMult;
                    color = "#b91c1c";
                    radius = 17;
                } else if (t === "lava_golem") {
                    hp = Math.round(hp * 2.8 * hpMult);
                    speed = speed * 0.7 * spdMult;
                    color = "#f97316";
                    radius = 17;
                } else if (t === "healer") {
                    hp = Math.round(hp * 1.7 * hpMult);
                    speed = speed * 1.2 * spdMult;
                    color = "#22c55e";
                    radius = 14;
                } else if (t === "shadow") {
                    hp = Math.round(hp * 1.25 * hpMult);
                    speed = speed * 1.5 * spdMult;
                    color = "#6366f1";
                    radius = 14;
                } else if (t === "ghost") {
                    hp = Math.round(hp * 0.9 * hpMult);
                    speed = speed * 1.1 * spdMult;
                    color = "#a855f7";
                    radius = 14;
                } else if (t === "fire_slime") {
                    hp = Math.round(hp * 1.15 * hpMult);
                    speed = speed * 1.25 * spdMult;
                    color = "#ef4444";
                } else if (t === "gold_goblin") {
                    hp = Math.round(hp * 1.2 * hpMult);
                    speed = speed * 1.35 * spdMult;
                    color = "#eab308";
                    radius = 14;
                } else {
                    hp = Math.round(hp * hpMult);
                    speed = speed * spdMult;
                }
                
                waveMonsters.push({ type: t, hp, speed, radius, color });
            });
        } else if (this.currentWave === 4) {
            // Wave 4: Quái chạy theo bầy đàn cùng chủng loại
            const types = ["fast", "fast", "fast", "shadow", "shadow", "shadow", "ice_bat", "ice_bat", "ice_bat", "gold_goblin", "gold_goblin", "ghost", "ghost", "lava_golem", "lava_golem", "poison_slime", "poison_slime", "speedy_goblin", "speedy_goblin", "vampire", "vampire"];
            types.forEach((t, i) => {
                let hp = 165 + i * 15;
                let speed = 1.25 + i * 0.04;
                let radius = 15;
                let color = "#06b6d4";
                
                if (t === "fast") {
                    hp = Math.round(hp * 0.8 * hpMult);
                    speed = speed * 1.95 * spdMult;
                    color = "#d946ef";
                    radius = 13;
                } else if (t === "shadow") {
                    hp = Math.round(hp * 1.25 * hpMult);
                    speed = speed * 1.5 * spdMult;
                    color = "#6366f1";
                    radius = 14;
                } else if (t === "ice_bat") {
                    hp = Math.round(hp * 1.05 * hpMult);
                    speed = speed * 1.65 * spdMult;
                    color = "#38bdf8";
                    radius = 13;
                } else if (t === "gold_goblin") {
                    hp = Math.round(hp * 1.2 * hpMult);
                    speed = speed * 1.35 * spdMult;
                    color = "#eab308";
                    radius = 14;
                } else if (t === "ghost") {
                    hp = Math.round(hp * 0.9 * hpMult);
                    speed = speed * 1.1 * spdMult;
                    color = "#a855f7";
                    radius = 14;
                } else if (t === "lava_golem") {
                    hp = Math.round(hp * 2.8 * hpMult);
                    speed = speed * 0.7 * spdMult;
                    color = "#f97316";
                    radius = 17;
                } else if (t === "poison_slime") {
                    hp = Math.round(hp * 1.35 * hpMult);
                    speed = speed * 0.95 * spdMult;
                    color = "#84cc16";
                } else if (t === "speedy_goblin") {
                    hp = Math.round(hp * 0.65 * hpMult);
                    speed = speed * 2.2 * spdMult;
                    color = "#ec4899";
                    radius = 12;
                } else if (t === "vampire") {
                    hp = Math.round(hp * 3.2 * hpMult);
                    speed = speed * 0.95 * spdMult;
                    color = "#b91c1c";
                    radius = 17;
                }
                
                waveMonsters.push({ type: t, hp, speed, radius, color });
            });
        } else {
            // Wave 5: Quái chạy theo bầy đàn cùng chủng loại (Đại chiến cuối cùng)
            const types = ["titan", "titan", "titan", "lava_golem", "lava_golem", "ghost", "ghost", "ghost", "fire_slime", "fire_slime", "poison_slime", "poison_slime", "gold_goblin", "gold_goblin", "ice_bat", "ice_bat", "speedy_goblin", "speedy_goblin", "healer", "healer", "vampire", "vampire", "shadow", "shadow", "boss", "boss"];
            types.forEach((t, i) => {
                let hp = 195 + i * 18;
                let speed = 1.3 + i * 0.04;
                let radius = 15;
                let color = "#06b6d4";
                
                if (t === "boss") {
                    hp = Math.round(hp * 6.5 * hpMult);
                    speed = speed * 0.65 * spdMult;
                    color = "#fbbf24";
                    radius = 24;
                } else if (t === "titan") {
                    hp = Math.round(hp * 4.5 * hpMult);
                    speed = speed * 0.6 * spdMult;
                    color = "#1d4ed8";
                    radius = 20;
                } else if (t === "vampire") {
                    hp = Math.round(hp * 3.5 * hpMult);
                    speed = speed * 0.95 * spdMult;
                    color = "#b91c1c";
                    radius = 17;
                } else if (t === "healer") {
                    hp = Math.round(hp * 1.8 * hpMult);
                    speed = speed * 1.2 * spdMult;
                    color = "#22c55e";
                    radius = 14;
                } else if (t === "shadow") {
                    hp = Math.round(hp * 1.3 * hpMult);
                    speed = speed * 1.5 * spdMult;
                    color = "#6366f1";
                    radius = 14;
                } else if (t === "ghost") {
                    hp = Math.round(hp * 0.95 * hpMult);
                    speed = speed * 1.1 * spdMult;
                    color = "#a855f7";
                    radius = 14;
                } else if (t === "fire_slime") {
                    hp = Math.round(hp * 1.2 * hpMult);
                    speed = speed * 1.25 * spdMult;
                    color = "#ef4444";
                } else if (t === "poison_slime") {
                    hp = Math.round(hp * 1.4 * hpMult);
                    speed = speed * 0.95 * spdMult;
                    color = "#84cc16";
                } else if (t === "gold_goblin") {
                    hp = Math.round(hp * 1.25 * hpMult);
                    speed = speed * 1.35 * spdMult;
                    color = "#eab308";
                    radius = 14;
                } else if (t === "ice_bat") {
                    hp = Math.round(hp * 1.1 * hpMult);
                    speed = speed * 1.65 * spdMult;
                    color = "#38bdf8";
                    radius = 13;
                } else if (t === "speedy_goblin") {
                    hp = Math.round(hp * 0.7 * hpMult);
                    speed = speed * 2.2 * spdMult;
                    color = "#ec4899";
                    radius = 12;
                } else if (t === "lava_golem") {
                    hp = Math.round(hp * 3.0 * hpMult);
                    speed = speed * 0.7 * spdMult;
                    color = "#f97316";
                    radius = 17;
                }
                
                waveMonsters.push({ type: t, hp, speed, radius, color });
            });
        }
        
        // Bắt đầu bộ đếm đếm ngược 3, 2, 1
        const countdownInterval = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
                clearInterval(countdownInterval);
                this.countdown = null;
                // Thực sự kích hoạt sinh quái sau khi đếm ngược kết thúc
                this.actuallyStartSpawning(waveMonsters);
            }
        }, 1000);
    },
    
    // Vòng lặp vẽ và cập nhật trạng thái game
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = WaveSystem;
    if (typeof root !== 'undefined') root.WaveSystem = WaveSystem;
})(typeof window !== 'undefined' ? window : global);
