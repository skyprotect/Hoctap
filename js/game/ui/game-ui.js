/**
 * GAME ENGINE - USER INTERFACE & INPUT EVENT BINDINGS
 */
(function(root) {
    'use strict';

    const GameUI = {
        renderTowerButtons: function() {
        const container = document.querySelector(".tower-buttons-vertical");
        if (!container) return;
        
        container.innerHTML = "";
        const heroLevel = (this.hero && this.hero.level) ? this.hero.level : 1;
        const mult = this.getHeroMultipliers();
        
        const towerKeys = Object.keys(this.towerConfig);
        towerKeys.forEach(type => {
            const config = this.towerConfig[type];
            const isLocked = config.unlockLevel && heroLevel < config.unlockLevel;
            const cost = Math.round(config.cost * mult.cost);
            
            const btn = document.createElement("button");
            btn.className = `btn-game-tower btn-tower-${type}`;
            if (type === this.selectedTowerType) {
                btn.classList.add("active");
            }
            
            if (isLocked) {
                btn.classList.add("locked");
                btn.disabled = true;
                btn.style.opacity = "0.65";
                btn.style.cursor = "not-allowed";
                btn.style.position = "relative";
                btn.setAttribute("title", `${config.name} - Mở khóa khi Anh Hùng đạt Cấp ${config.unlockLevel}`);
                
                // Trích xuất emoji
                const displayName = config.name.replace(/[\uD800-\uDFFF\u2600-\u27BF\uFE0F]/gu, "").trim();
                
                btn.innerHTML = `
                    <span style="font-size: 1.4rem;">🔒</span>
                    <span>Cấp ${config.unlockLevel}</span>
                    <span class="tower-cost" style="color:var(--text-muted); font-size:0.75rem;">${displayName}</span>
                `;
            } else {
                btn.onclick = () => this.selectTowerType(type);
                btn.setAttribute("title", `${config.name}: ${config.description || 'Tháp phòng thủ'} (Tầm bắn: ${config.range}, Sát thương: ${config.damage})`);
                
                // Trích xuất emoji và tên
                const emoji = config.name.match(/[\uD800-\uDFFF\u2600-\u27BF\uFE0F]/gu)?.[0] || "🗼";
                const displayName = config.name.replace(/[\uD800-\uDFFF\u2600-\u27BF\uFE0F]/gu, "").trim();
                
                btn.innerHTML = `
                    <span style="font-size: 1.4rem;">${emoji}</span>
                    <span>${displayName}</span>
                    <span class="tower-cost">${cost}G</span>
                `;
            }
            
            container.appendChild(btn);
        });
    },

    // Cập nhật giao diện điều khiển (HUD) ngoài canvas
    updateHUD: function() {
        const hpEl = document.getElementById("game-hp");
        const goldEl = document.getElementById("game-gold");
        const goldShopEl = document.getElementById("game-gold-shop");
        const waveEl = document.getElementById("game-wave");
        
        if (hpEl) hpEl.innerText = this.hp;
        if (goldEl) goldEl.innerText = this.gold;
        if (goldShopEl) goldShopEl.innerText = this.gold;
        if (waveEl) waveEl.innerText = `${this.currentWave}/${this.totalWaves}`;
        
        // Đánh dấu nút tháp khả dụng dựa trên số vàng (Áp dụng giảm giá tháp từ Hero)
        const heroLevel = (this.hero && this.hero.level) ? this.hero.level : 1;
        const mult = this.getHeroMultipliers();
        
        Object.keys(this.towerConfig).forEach(type => {
            const config = this.towerConfig[type];
            const btn = document.querySelector(`.btn-tower-${type}`);
            if (btn) {
                const isLocked = config.unlockLevel && heroLevel < config.unlockLevel;
                if (isLocked) {
                    btn.disabled = true;
                } else {
                    btn.disabled = this.gold < Math.round(config.cost * mult.cost);
                }
            }
        });
        
        // Cập nhật panel nâng cấp nếu có tháp đang được chọn
        this.updateUpgradePanel();
    },
    
    // Cập nhật giao diện panel nâng cấp tháp
    updateUpgradePanel: function() {
        const panel = document.getElementById("tower-upgrade-panel");
        if (!panel) return;
        
        if (this.selectedTowerInstance) {
            const tower = this.selectedTowerInstance;
            const upgradeCost = Math.round(tower.cost * 0.8);
            const sellCost = Math.round(tower.cost * 0.5);
            
            panel.innerHTML = `
                <div class="upgrade-info">
                    <strong>${tower.name} (Cấp ${tower.level})</strong>
                    <span style="font-size:0.8rem; color:#cbd5e1; display:block;">
                        Sát thương: ${tower.damage} | Tầm bắn/gác: ${tower.range}px
                    </span>
                </div>
                <div class="upgrade-actions" style="display:flex; gap:0.5rem;">
                    <button class="btn-game-action btn-upgrade" ${this.gold < upgradeCost ? 'disabled' : ''} onclick="game.upgradeSelectedTower()">
                        ⚡ Nâng cấp (${upgradeCost}G)
                    </button>
                    <button class="btn-game-action btn-sell" onclick="game.sellSelectedTower()">
                        🪙 Bán (${sellCost}G)
                    </button>
                    <button class="btn-game-action btn-cancel" onclick="game.deselectTower()">
                        Hủy
                    </button>
                </div>
            `;
            panel.classList.remove("hidden");
        } else {
            panel.classList.add("hidden");
        }
    },
    
    // Đăng ký các sự kiện click chuột trên Canvas để xây tháp
    bindEvents: function() {
        // 1. Sự kiện Mouse Move để cập nhật preview tháp theo ô lưới (sửa đổi tính tỉ lệ scale thực tế)
        this.canvasMouseMoveHandler = (e) => {
            if (!this.canvas) return;
            const rect = this.canvas.getBoundingClientRect();
            // Scale tọa độ chuột theo tỉ lệ thực tế của canvas pixel
            this.mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
            this.mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
            
            // Tính toán ô lưới 40x40 gần nhất
            const gridX = Math.floor(this.mouseX / 40) * 40 + 20;
            const gridY = Math.floor(this.mouseY / 40) * 40 + 20;
            
            if (gridX > 0 && gridX < this.canvas.width && gridY > 0 && gridY < this.canvas.height) {
                this.previewX = gridX;
                this.previewY = gridY;
                this.isPreviewValid = this.isValidGrid(gridX, gridY);
            } else {
                this.previewX = null;
                this.previewY = null;
                this.isPreviewValid = false;
            }
        };

        // 2. Sự kiện Click để chọn tháp, hoặc xác nhận/hủy xây tháp (sửa đổi tính tỉ lệ scale thực tế)
        this.canvasClickHandler = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            // Scale tọa độ chuột theo tỉ lệ thực tế của canvas pixel
            const x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
            const y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
            
            // 2.0.1. Kiểm tra click trúng vật phẩm rơi (drops) trước tiên
            if (this.drops && this.drops.length > 0) {
                for (let i = this.drops.length - 1; i >= 0; i--) {
                    const drop = this.drops[i];
                    if (Math.hypot(drop.x - x, drop.y - y) < 30) {
                        this.collectDrop(drop, i);
                        return; // Nhặt xong thoát ngay, không thực hiện hành động nào khác
                    }
                }
            }
            
            // 2.1. Nếu đang có hộp thoại xác nhận xây tháp, kiểm tra click trúng nút V hoặc X trước
            if (this.confirmBuildPos) {
                const buildX = this.confirmBuildPos.x;
                const buildY = this.confirmBuildPos.y;
                
                // Tọa độ nút Đồng ý (V): buildX - 22, buildY + 25. Bán kính click 15px
                const distYes = Math.hypot((buildX - 22) - x, (buildY + 25) - y);
                // Tọa độ nút Hủy (X): buildX + 22, buildY + 25. Bán kính click 15px
                const distNo = Math.hypot((buildX + 22) - x, (buildY + 25) - y);
                
                if (distYes < 15) {
                    // Click nút Đồng ý (✔) -> Tiến hành xây tháp
                    const config = this.towerConfig[this.confirmBuildPos.type];
                    const mult = this.getHeroMultipliers();
                    const actualCost = Math.round(config.cost * mult.cost);
                    const actualDamage = Math.round(config.damage * mult.damage);
                    const actualRange = Math.round(config.range * mult.range);
                    const actualSlowDuration = Math.round((config.slowDuration || 0) * mult.slowDuration);
                    
                    if (this.gold >= actualCost) {
                        this.gold -= actualCost;
                        const newTower = {
                            x: buildX,
                            y: buildY,
                            type: this.confirmBuildPos.type,
                            name: config.name,
                            level: 1,
                            range: actualRange,
                            damage: actualDamage,
                            cooldown: config.cooldown,
                            color: config.color,
                            cost: actualCost,
                            timer: 0,
                            angle: -Math.PI / 2,
                            slowPower: config.slowPower,
                            slowDuration: actualSlowDuration,
                            splashRadius: config.splashRadius
                        };
                        this.towers.push(newTower);

                        // NẾU XÂY THÁP LÍNH -> TỰ ĐỘNG SINH 4 CHIẾN BINH ĐỨNG GÁC
                        if (this.confirmBuildPos.type === 'soldier') {
                            for (let s = 0; s < 4; s++) {
                                const angle = (Math.PI / 2) * s;
                                const homeX = buildX + Math.cos(angle) * 38;
                                const homeY = buildY + Math.sin(angle) * 38;
                                this.soldiers.push({
                                    tower: newTower,
                                    x: homeX,
                                    y: homeY,
                                    homeX: homeX,
                                    homeY: homeY,
                                    targetEnemy: null,
                                    attackTimer: 0,
                                    animFrame: 0,
                                    animTimer: 0
                                });
                            }
                            this.spawnPopup(buildX, buildY - 25, `+4 Chiến binh! 🛡️`, "#22c55e", 15);
                        }

                        this.spawnPopup(buildX, buildY - 10, `-${actualCost}G`, "#f59e0b");
                        if (window.app && app.audio) app.audio.playClick();
                        
                        // BỎ CHỌN THÁP SAU KHỊ XÂY ĐỂ TRÁNH DÍNH CHUỘT
                        this.selectedTowerType = null;
                        document.querySelectorAll(".btn-game-tower").forEach(btn => btn.classList.remove("active"));
                        this.updateHUD();
                    } else {
                        this.spawnPopup(buildX, buildY, "Không đủ vàng!", "#ef4444");
                    }
                    this.confirmBuildPos = null;
                    return;
                } else if (distNo < 15) {
                    // Click nút Hủy (✖) -> Hủy xây
                    this.confirmBuildPos = null;
                    if (window.app && app.audio) app.audio.playClick();
                    return;
                }
                
                // Bấm ra ngoài nút V và X khi đang hiện xác nhận: hủy xác nhận cũ
                this.confirmBuildPos = null;
            }
            
            // 2.2. Kiểm tra bấm trúng tháp đã xây để xem nâng cấp/bán HOẶC Kích Tốc (Click Boost)
            let clickedTower = null;
            for (let t of this.towers) {
                const dist = Math.hypot(t.x - x, t.y - y);
                if (dist < 22) {
                    clickedTower = t;
                    break;
                }
            }
            
            if (clickedTower) {
                this.selectedTowerInstance = clickedTower;
                
                // Logic Kích tốc Tháp (Click Boost) - Mới lạ hấp dẫn
                if (!clickedTower.boostTimer && !clickedTower.boostCooldown) {
                    clickedTower.boostClicks = (clickedTower.boostClicks || 0) + 1;
                    clickedTower.lastClickTime = performance.now();
                    
                    if (clickedTower.boostClicks >= 3) {
                        clickedTower.boostTimer = 4 * 60; // 4 giây (240 frames)
                        clickedTower.boostCooldown = 8 * 60; // 8 giây hồi chiêu (480 frames)
                        clickedTower.boostClicks = 0;
                        this.spawnPopup(clickedTower.x, clickedTower.y - 30, "⚡ KÍCH TỐC (x2 Tốc Bắn)!", "#06b6d4", 16);
                        
                        // Phát tiếng sét uy lực
                        if (window.app && app.audio) {
                            app.audio.playTdSound('thunder');
                        }
                    } else {
                        const needed = 3 - clickedTower.boostClicks;
                        this.spawnPopup(clickedTower.x, clickedTower.y - 25, `Nhấp ${needed} lần nữa để Kích tốc!`, "#a7f3d0", 12);
                    }
                } else if (clickedTower.boostTimer > 0) {
                    this.spawnPopup(clickedTower.x, clickedTower.y - 25, "Đang Kích Tốc!", "#06b6d4", 13);
                } else if (clickedTower.boostCooldown > 0) {
                    const secs = Math.ceil(clickedTower.boostCooldown / 60);
                    this.spawnPopup(clickedTower.x, clickedTower.y - 25, `Đang hồi chiêu: ${secs}s`, "#94a3b8", 12);
                }

                this.updateHUD();
                return;
            }
            
            // Kiểm tra bấm trúng lâu đài (thành chính) để chọn/đổi siêu anh hùng
            const castlePos = { x: 880, y: 300 };
            if (Math.hypot(castlePos.x - x, castlePos.y - y) < 55) {
                this.openHeroSelectorInGame();
                if (window.app && app.audio) app.audio.playClick();
                return;
            }
            
            // Hủy chọn tháp nâng cấp nếu bấm ra ngoài tháp
            if (this.selectedTowerInstance) {
                this.selectedTowerInstance = null;
                this.updateHUD();
                return;
            }
            
            // 2.3. Click vào ô lưới để bắt đầu quy trình xác nhận xây tháp mới
            if (this.selectedTowerType) {
                const gridX = Math.floor(x / 40) * 40 + 20;
                const gridY = Math.floor(y / 40) * 40 + 20;
                
                if (this.isValidGrid(gridX, gridY)) {
                    const config = this.towerConfig[this.selectedTowerType];
                    const mult = this.getHeroMultipliers();
                    const actualCost = Math.round(config.cost * mult.cost);
                    
                    if (this.gold < actualCost) {
                        this.spawnPopup(x, y, "Không đủ vàng!", "#ef4444");
                        return;
                    }
                    
                    // Kích hoạt trạng thái chờ xác nhận
                    this.confirmBuildPos = { x: gridX, y: gridY, type: this.selectedTowerType };
                    if (window.app && app.audio) app.audio.playClick();
                } else {
                    this.spawnPopup(x, y, "Không thể xây ở đây!", "#ef4444");
                }
            }
        };

        // 3. Sự kiện Chuột Phải (Right-click) để bỏ chọn tháp tức thì
        this.canvasContextMenuHandler = (e) => {
            e.preventDefault();
            this.selectedTowerType = null;
            this.selectedTowerInstance = null;
            this.confirmBuildPos = null;
            this.updateHUD();
            document.querySelectorAll(".btn-game-tower").forEach(btn => btn.classList.remove("active"));
        };
        
        this.canvas.addEventListener('mousemove', this.canvasMouseMoveHandler);
        this.canvas.addEventListener('click', this.canvasClickHandler);
        this.canvas.addEventListener('contextmenu', this.canvasContextMenuHandler);
    },
    
    // Hủy đăng ký sự kiện
    unbindEvents: function() {
        if (this.canvas) {
            if (this.canvasClickHandler) {
                this.canvas.removeEventListener('click', this.canvasClickHandler);
            }
            if (this.canvasMouseMoveHandler) {
                this.canvas.removeEventListener('mousemove', this.canvasMouseMoveHandler);
            }
            if (this.canvasContextMenuHandler) {
                this.canvas.removeEventListener('contextmenu', this.canvasContextMenuHandler);
            }
        }
    },
    
    // Hủy chọn tháp
    deselectTower: function() {
        this.selectedTowerInstance = null;
        this.updateHUD();
    },
    
    // Chọn loại tháp để chuẩn bị xây
    selectTowerType: function(type) {
        const heroLevel = (this.hero && this.hero.level) ? this.hero.level : 1;
        const config = this.towerConfig[type];
        if (config && config.unlockLevel && heroLevel < config.unlockLevel) {
            return; // Locked!
        }
        
        this.selectedTowerType = type;
        // Đổi trạng thái active class của các nút ngoài HTML
        document.querySelectorAll(".btn-game-tower").forEach(btn => {
            btn.classList.remove("active");
        });
        const activeBtn = document.querySelector(`.btn-tower-${type}`);
        if (activeBtn) activeBtn.classList.add("active");
    },
    
    // Nâng cấp tháp đang chọn
    upgradeSelectedTower: function() {
        if (!this.selectedTowerInstance) return;
        const tower = this.selectedTowerInstance;
        const cost = Math.round(tower.cost * 0.8);
        
        if (this.gold < cost) return;
        
        this.gold -= cost;
        tower.level += 1;
        tower.cost += cost;
        tower.damage = Math.round(tower.damage * 1.5);
        tower.range = Math.round(tower.range * 1.15);
        tower.cooldown = Math.max(15, Math.round(tower.cooldown * 0.9)); // Bắn nhanh hơn
        
        // Cập nhật các thuộc tính tùy chỉnh của tháp cao cấp
        if (tower.poisonDamage !== undefined) {
            tower.poisonDamage = Math.round(tower.poisonDamage * 1.4);
        }
        if (tower.burnDamage !== undefined) {
            tower.burnDamage = Math.round(tower.burnDamage * 1.4);
        }
        if (tower.pullStrength !== undefined) {
            tower.pullStrength = Math.min(2.5, tower.pullStrength + 0.2);
        }
        
        // Nếu tháp được nâng cấp là tháp lính, tăng HP tối đa và hồi đầy HP cho chiến binh thuộc tháp này
        if (tower.type === 'soldier') {
            const newMaxHp = 100 + (tower.level - 1) * 60;
            this.soldiers.forEach(s => {
                if (s.tower === tower) {
                    s.maxHp = newMaxHp;
                    s.hp = newMaxHp;
                }
            });
        }
        
        this.spawnPopup(tower.x, tower.y - 15, `⚡ Nâng cấp! -${cost}G`, "#fbbf24");
        
        // Hiệu ứng hạt lấp lánh màu vàng xung quanh tháp được nâng cấp
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x: tower.x,
                y: tower.y,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3 - 1,
                color: "#fbbf24",
                alpha: 1,
                life: 30 + Math.random() * 20,
                maxLife: 50,
                size: 2 + Math.random() * 2
            });
        }
        
        if (window.app && app.audio) app.audio.playClick();
        this.deselectTower();
    },
    
    // Bán tháp đang chọn
    sellSelectedTower: function() {
        if (!this.selectedTowerInstance) return;
        const tower = this.selectedTowerInstance;
        const refund = Math.round(tower.cost * 0.5);
        
        this.gold += refund;
        this.towers = this.towers.filter(t => t !== tower);
        
        this.spawnPopup(tower.x, tower.y, `+${refund}G`, "#22c55e");
        
        if (window.app && app.audio) app.audio.playClick();
        this.deselectTower();
    },
    
    // Mở hộp thoại chọn Siêu Anh Hùng trong game khi nhấn vào thành chính,
        updateEscapedMonstersHUD: function() {
        const container = document.getElementById("escaped-monsters-list");
        if (!container) return;
        
        const keys = Object.keys(this.escapedMonsters || {});
        if (keys.length === 0) {
            container.innerHTML = `<div style="font-size: 0.72rem; color: #cbd5e1; text-align: center; font-style: italic; margin-top: 1rem;">Chưa có quái nào vượt qua</div>`;
            return;
        }
        
        const monsterAssets = {
            'normal': { imgKey: 'monster_slime', filter: 'none', name: 'Slime' },
            'fire_slime': { imgKey: 'monster_slime', filter: 'hue-rotate(-130deg) saturate(2.5)', name: 'Slime Lửa' },
            'poison_slime': { imgKey: 'monster_slime', filter: 'hue-rotate(90deg) saturate(1.8) brightness(0.9)', name: 'Slime Độc' },
            'titan': { imgKey: 'monster_slime', filter: 'brightness(0.7) hue-rotate(160deg) saturate(1.5)', name: 'Titan Slime' },
            'fast': { imgKey: 'monster_bat', filter: 'none', name: 'Dơi Nhanh' },
            'shadow': { imgKey: 'monster_bat', filter: 'brightness(0.2) hue-rotate(240deg) saturate(2)', name: 'Dơi Tối' },
            'ice_bat': { imgKey: 'monster_bat', filter: 'hue-rotate(120deg) brightness(1.2)', name: 'Dơi Băng' },
            'speedy_goblin': { imgKey: 'monster_bat', filter: 'hue-rotate(280deg) saturate(2) brightness(1.1)', name: 'Yêu Tinh' },
            'boss': { imgKey: 'monster_boss', filter: 'none', name: 'Boss Slime' },
'vampire': { imgKey: 'monster_boss', filter: 'hue-rotate(-90deg) brightness(0.5) saturate(2)', name: 'Vampire' },
            'healer': { imgKey: 'monster_healer', filter: 'none', name: 'Healer' },
            'gold_goblin': { imgKey: 'monster_healer', filter: 'hue-rotate(40deg) brightness(1.4) saturate(2)', name: 'Yêu Tinh Vàng' },
            'ghost': { imgKey: 'monster_healer', filter: 'opacity(0.55) brightness(1.3)', name: 'Ghost' },
            'armored': { imgKey: 'monster_armored', filter: 'none', name: 'Giáp Sắt' },
            'lava_golem': { imgKey: 'monster_armored', filter: 'hue-rotate(-160deg) brightness(0.8) saturate(1.8)', name: 'Lava Golem' }
        };
        
        const imgPaths = {
            'monster_slime': 'images/monster_slime.png',
            'monster_bat': 'images/monster_bat.png',
            'monster_boss': 'images/monster_boss.png',
            'monster_healer': 'images/monster_healer.png',
            'monster_armored': 'images/monster_armored.png'
        };
        
        let html = `<div style="display: flex; flex-direction: column; gap: 0.5rem; width: 100%;">`;
        keys.forEach(type => {
            const count = this.escapedMonsters[type];
            if (count <= 0) return;
            const info = monsterAssets[type] || { imgKey: 'monster_slime', filter: 'none', name: type };
            const imgPath = imgPaths[info.imgKey] || 'images/monster_slime.png';
            
            // Lấy canvas đã tách nền chuyển thành dataURL để hiển thị trong suốt hoàn toàn
            const canvasEl = this.images[info.imgKey];
            const imgSrc = (canvasEl && typeof canvasEl.toDataURL === 'function') ? canvasEl.toDataURL() : imgPath;
            
            html += `
                <div class="escaped-monster-item" style="display: flex; align-items: center; gap: 0.5rem; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 8px; padding: 0.3rem 0.5rem; width: 100%; box-sizing: border-box; overflow: hidden;">
                    <img src="${imgSrc}" style="width: 24px; height: 24px; object-fit: contain; filter: ${info.filter}; flex-shrink: 0;" title="${info.name}">
                    <div style="display: flex; flex-direction: column; min-width: 0; flex: 1;">
                        <span style="font-size: 0.72rem; font-weight: 700; color: #f87171; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;" title="${info.name}">${info.name}</span>
                        <span style="font-size: 0.62rem; color: #cbd5e1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Số lượng: <b>${count}</b></span>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
        container.innerHTML = html;
    },

    // Cấu hình siêu kỹ năng chi tiết cho 3 siêu anh hùng
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = GameUI;
    if (typeof root !== 'undefined') root.GameUI = GameUI;
})(typeof window !== 'undefined' ? window : global);
