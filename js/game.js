// Đối tượng quản lý trò chơi Đấu Trường Thủ Thành Toán Học
const game = {
    canvas: null,
    ctx: null,
    animationFrame: null,
    lastTime: 0,
    accumulator: 0,
    timestep: 1000 / 60,
    
    // Các biến quản lý PixiJS (WebGPU/WebGL 2.0 Engine)
    pixiApp: null,
    gameTicker: null,
    legacyCanvas: null,
    legacyTexture: null,
    legacySprite: null,
    
    // Hệ thống Container z-index phân lớp
    mapContainer: null,
    pathContainer: null,
    towerContainer: null,
    enemyContainer: null,
    vfxContainer: null,
    uiContainer: null,
    bgGraphics: null,
    
    // Bộ nhớ đệm và trình nạp tài nguyên hình ảnh game
    images: {},
    imagesLoaded: false,
    loadGameAssets: function(callback) {
        const assetPaths = {
            tower_archer: '/images/tower_archer.png',
            tower_ice: '/images/tower_ice.png',
            tower_bomb: '/images/tower_bomb.png',
            monster_slime: '/images/monster_slime.png',
            monster_armored: '/images/monster_armored.png',
            monster_bat: '/images/monster_bat.png',
            monster_boss: '/images/monster_boss.png',
            monster_healer: '/images/monster_healer.png',
            castle: '/images/castle.png',
            portal: '/images/portal.png',
            hero_light: '/images/hero_light.png',
            hero_frost: '/images/hero_frost.png',
            hero_gold: '/images/hero_gold.png',
            soldier_unit: '/images/soldier_unit.png'
        };
        
        let loadedCount = 0;
        const keys = Object.keys(assetPaths);
        const totalAssets = keys.length;
        
        keys.forEach(key => {
            const img = new Image();
            img.src = assetPaths[key];
            img.onload = async () => {
                try {
                    this.images[key] = await this.removeWhiteBackgroundAsync(img);
                } catch (e) {
                    console.warn("Lỗi tách nền qua Web Worker cho " + key + ", dùng fallback đồng bộ:", e);
                    this.images[key] = this.removeWhiteBackground(img);
                }
                loadedCount++;
                if (loadedCount === totalAssets) {
                    this.imagesLoaded = true;
                    if (callback) callback();
                }
            };
            img.onerror = () => {
                console.warn("Không thể nạp tài nguyên ảnh: " + key + ", sẽ dùng fallback vẽ vector hình học.");
                loadedCount++;
                if (loadedCount === totalAssets) {
                    this.imagesLoaded = true;
                    if (callback) callback();
                }
            };
        });
    },

    removeWhiteBackgroundAsync: function(img) {
        return new Promise((resolve) => {
            let isResolved = false;
            let timeoutId = null;
            let worker = null;
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const safeResolve = (resultCanvas) => {
                if (isResolved) return;
                isResolved = true;
                if (timeoutId) clearTimeout(timeoutId);
                if (worker) {
                    worker.terminate();
                }
                resolve(resultCanvas);
            };

            try {
                worker = new Worker('js/remove-bg-worker.js');
                const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                
                // Thiết lập timeout 3000ms phòng ngừa Worker bị treo
                timeoutId = setTimeout(() => {
                    console.warn("Worker tách nền ảnh bị quá thời gian (Timeout 3s). Đang dùng fallback canvas.");
                    safeResolve(canvas);
                }, 3000);

                worker.onmessage = (e) => {
                    const cleanData = e.data.imageData;
                    ctx.putImageData(cleanData, 0, 0);
                    safeResolve(canvas);
                };
                
                worker.onerror = (err) => {
                    console.error("Lỗi Worker tách nền cho ảnh:", err);
                    safeResolve(canvas); // Fallback: Trả về canvas chưa xử lý xong
                };
                
                worker.postMessage({
                    imageData: imgData,
                    width: canvas.width,
                    height: canvas.height
                }, [imgData.data.buffer]);
            } catch (e) {
                console.error("Lỗi khi tạo Web Worker tách nền:", e);
                // Fallback chạy đồng bộ ở main thread
                try {
                    const fallbackCanvas = this.removeWhiteBackground(img);
                    safeResolve(fallbackCanvas);
                } catch (err) {
                    safeResolve(canvas);
                }
            }
        });
    },
    
    // Tách nền trắng/xám của ảnh bằng thuật toán loang Flood Fill từ biên (xóa sạch nền checkerboard giả lập)
    removeWhiteBackground: function(img) {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;
            const width = canvas.width;
            const height = canvas.height;
            
            const visited = new Uint8Array(width * height);
            const queue = [];
            
            // Nhận diện pixel nền: màu trắng tinh hoặc xám trung tính (ít bão hòa màu)
            const isBackgroundPixel = (idx) => {
                const r = data[idx];
                const g = data[idx+1];
                const b = data[idx+2];
                const a = data[idx+3];
                if (a === 0) return true;
                
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const diff = max - min;
                const lum = 0.299 * r + 0.587 * g + 0.114 * b;
                
                // Nền trắng hoặc xám trung tính (chênh lệch màu r-g-b cực thấp)
                if (lum > 215) return true;
                if (lum > 135 && diff < 15) return true;
                return false;
            };
            
            // Nạp các pixel biên vào hàng đợi
            for (let x = 0; x < width; x++) {
                const idxTop = (0 * width + x) * 4;
                const idxBottom = ((height - 1) * width + x) * 4;
                if (isBackgroundPixel(idxTop)) {
                    queue.push(x, 0);
                    visited[0 * width + x] = 1;
                }
                if (isBackgroundPixel(idxBottom)) {
                    queue.push(x, height - 1);
                    visited[(height - 1) * width + x] = 1;
                }
            }
            for (let y = 0; y < height; y++) {
                const idxLeft = (y * width + 0) * 4;
                const idxRight = (y * width + (width - 1)) * 4;
                if (isBackgroundPixel(idxLeft) && !visited[y * width + 0]) {
                    queue.push(0, y);
                    visited[y * width + 0] = 1;
                }
                if (isBackgroundPixel(idxRight) && !visited[y * width + (width - 1)]) {
                    queue.push(width - 1, y);
                    visited[y * width + (width - 1)] = 1;
                }
            }
            
            // Loang BFS từ biên
            let head = 0;
            const dx = [0, 0, 1, -1];
            const dy = [1, -1, 0, 0];
            
            while (head < queue.length) {
                const cx = queue[head++];
                const cy = queue[head++];
                
                const idx = (cy * width + cx) * 4;
                data[idx + 3] = 0; // Đặt pixel này thành trong suốt
                
                for (let i = 0; i < 4; i++) {
                    const nx = cx + dx[i];
                    const ny = cy + dy[i];
                    
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                        const pos = ny * width + nx;
                        if (!visited[pos]) {
                            const nIdx = pos * 4;
                            if (isBackgroundPixel(nIdx)) {
                                queue.push(nx, ny);
                                visited[pos] = 1;
                            }
                        }
                    }
                }
            }
            
            // Quét thêm một lượt để dọn nốt các pixel xám/trắng cô lập nằm sâu trong ảnh
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i+1];
                const b = data[i+2];
                const a = data[i+3];
                if (a === 0) continue;
                
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const diff = max - min;
                
                // Nếu là màu gần trắng tinh cô lập
                if (r > 225 && g > 225 && b > 225 && diff < 8) {
                    data[i+3] = 0;
                }
            }
            
            ctx.putImageData(imgData, 0, 0);
            return canvas;
        } catch (e) {
            console.error("Lỗi khi xử lý tách nền hình ảnh:", e);
            return img;
        }
    },
    
    // Các biến trạng thái của trò chơi
    hp: 10,
    maxHp: 10,
    gold: 250,
    currentWave: 1,
    totalWaves: 10,
    isPlaying: false,
    selectedTowerType: 'archer', // Loại tháp đang chọn để xây
    selectedTowerInstance: null, // Tháp đang chọn để nâng cấp/bán
    isWaveActive: false,         // Đợt quái đang chạy
    isSpawning: false,           // Quái đang được sinh ra
    
    // Quản lý chủ đề bản đồ ngẫu nhiên (Random Map Themes)
    mapTheme: 'plains',
    mapThemes: {
        plains: {
            name: "Đồng bằng Cỏ xanh 🌲",
            bg: "#0a2e10", path: "#1a3d10", grid: "rgba(34, 197, 94, 0.07)", border: "rgba(52, 211, 153, 0.25)",
            bgGrad1: "#0d3b14", bgGrad2: "#061a09",
            pathEdge: "rgba(74, 222, 128, 0.35)", pathCenter: "#1c4a12"
        },
        volcano: {
            name: "Đồi núi Dung nham 🌋",
            bg: "#150a0a", path: "#6b1c1c", grid: "rgba(239, 68, 68, 0.07)", border: "rgba(251, 100, 60, 0.3)",
            bgGrad1: "#1f0a0a", bgGrad2: "#0a0505",
            pathEdge: "rgba(249, 115, 22, 0.5)", pathCenter: "#7c2020"
        },
        cyberpunk: {
            name: "Thành phố Cyberpunk 🏙️",
            bg: "#050b14", path: "#182030", grid: "rgba(56, 189, 248, 0.1)", border: "rgba(99, 214, 255, 0.3)",
            bgGrad1: "#080f1c", bgGrad2: "#020508",
            pathEdge: "rgba(56, 189, 248, 0.5)", pathCenter: "#1e3248"
        },
        tundra: {
            name: "Băng tuyết Tundra ❄️",
            bg: "#0d1a2e", path: "#1e3a5a", grid: "rgba(147, 210, 240, 0.09)", border: "rgba(186, 230, 253, 0.3)",
            bgGrad1: "#0f2040", bgGrad2: "#050d1a",
            pathEdge: "rgba(186, 230, 253, 0.45)", pathCenter: "#1e3a5a"
        }
    },
    
    // Các biến phục vụ kéo thả xây tháp và xác nhận
    mouseX: 0,
    mouseY: 0,
    previewX: null,
    previewY: null,
    isPreviewValid: false,
    confirmBuildPos: null,       // { x, y, type }
    
    // Các đường đi của quái vật (Multi-paths từ 3 hướng hội tụ về Lâu đài 880, 300) - cập nhật cho canvas 960x600
    paths: [
        // Hướng 1: Từ phía bên trái trên lượn S
        [
            { x: 0, y: 140 },
            { x: 280, y: 140 },
            { x: 280, y: 440 },
            { x: 600, y: 440 },
            { x: 600, y: 300 },
            { x: 880, y: 300 }
        ],
        // Hướng 2: Từ phía bên trái dưới đi chéo
        [
            { x: 0, y: 500 },
            { x: 240, y: 500 },
            { x: 240, y: 260 },
            { x: 500, y: 260 },
            { x: 700, y: 300 },
            { x: 880, y: 300 }
        ],
        // Hướng 3: Từ mép trên xuống
        [
            { x: 440, y: 0 },
            { x: 440, y: 160 },
            { x: 720, y: 160 },
            { x: 720, y: 300 },
            { x: 880, y: 300 }
        ]
    ],
    path: [ // Giữ path mặc định cho tương thích
        { x: 0, y: 140 },
        { x: 280, y: 140 },
        { x: 280, y: 440 },
        { x: 600, y: 440 },
        { x: 600, y: 300 },
        { x: 880, y: 300 }
    ],
    
    // Thực thể trong game
    enemies: [],
    towers: [],
    soldiers: [], // Danh sách chiến binh sinh ra từ Tháp Lính
    projectiles: [],
    particles: [],
    popups: [], // Dùng để hiển thị các số vàng bay bay (+150G, -100G)
    activeEffects: [], // Quản lý hiệu ứng hình ảnh siêu kỹ năng toàn màn hình
    
    // Cấu hình các loại tháp
    towerConfig: {
        archer: {
            name: "Quantum Laser Bow 🏹",
            cost: 100,
            range: 135,
            damage: 26,
            cooldown: 35, // Số frame giữa mỗi phát bắn (~0.6s)
            color: "#eab308", // Vàng ấm
            description: "Tháp cung bắn tên gỗ tầm xa nhanh lên cả loài bay và đi bộ"
        },
        ice: {
            name: "Chrono Frost Nova ❄️",
            cost: 100,
            range: 115,
            damage: 12,
            cooldown: 50,
            color: "#38bdf8", // Xanh băng
            slowPower: 0.5, // Giảm 50% tốc độ
            slowDuration: 90, // Giảm trong 1.5s (90 frames)
            description: "Làm chậm quái bay và đi bộ trong tầm bắn diện rộng"
        },
        bomb: {
            name: "Plasma Artillery 💣",
            cost: 150,
            range: 145,
            damage: 55,
            cooldown: 80, // Tốc bắn chậm (~1.3s)
            color: "#ef4444", // Đỏ lửa
            splashRadius: 65, // Bán kính nổ lan
            description: "Sát thương nổ lan cực mạnh, CHỈ tác dụng lên loài đi bộ"
        },
        soldier: {
            name: "Hyperion Guardian 🛡️",
            cost: 120,
            range: 120,
            damage: 18,
            cooldown: 40,
            color: "#22c55e",
            soldierCount: 4,
            description: "Sinh ra 4 chiến binh chặn đường và cản quái đi bộ"
        },
        thunder: {
            name: "Tesla Storm Overlord ⚡",
            cost: 200,
            range: 140,
            damage: 35,
            cooldown: 60,
            color: "#06b6d4",
            unlockLevel: 10,
            description: "Mở khóa cấp 10. Phóng sấm sét giật lan 3 mục tiêu (bay & đi bộ)"
        },
        laser: {
            name: "Gatling Laser 📡",
            cost: 250,
            range: 160,
            damage: 8,
            cooldown: 6,
            color: "#ec4899",
            unlockLevel: 15,
            description: "Mở khóa cấp 15. Bắn tia laser liên tục cực nhanh lên 2 loài"
        },
        poison: {
            name: "Bio-Chemical Toxins 🧪",
            cost: 180,
            range: 130,
            damage: 15,
            cooldown: 45,
            color: "#a855f7",
            unlockLevel: 20,
            poisonDamage: 8,
            poisonDuration: 180,
            description: "Mở khóa cấp 20. Bắn chất độc gây sát thương duy trì theo thời gian"
        },
        fire: {
            name: "Singularity Core 🌋",
            cost: 300,
            range: 125,
            damage: 48,
            cooldown: 75,
            color: "#f97316",
            unlockLevel: 25,
            burnDamage: 12,
            burnDuration: 120,
            description: "Mở khóa cấp 25. Bắn dung nham nổ diện rộng đốt cháy quái"
        },
        void: {
            name: "Quantum Void Gate 🌀",
            cost: 350,
            range: 150,
            damage: 80,
            cooldown: 90,
            color: "#6366f1",
            unlockLevel: 30,
            pullStrength: 1.5,
            description: "Mở khóa cấp 30. Tạo lỗ đen lực hút kéo gom quái và làm chậm cực độ"
        }
    },
    
    // Biến quản lý quái vật nổi giận khi làm sai câu hỏi
    rageTimer: 0,
    isRaged: false,
    
    // Kiểm tra xem vị trí ô lưới (x, y) có hợp lệ để xây tháp không
    isValidGrid: function(x, y) {
        // 1. Tránh xây đè lên tháp khác
        for (let t of this.towers) {
            if (Math.hypot(t.x - x, t.y - y) < 36) {
                return false;
            }
        }
        
        // 2. Tránh xây đè lên bất kỳ đường đi nào của quái vật trong 3 paths
        for (let p of this.paths) {
            for (let i = 0; i < p.length - 1; i++) {
                const start = p[i];
                const end = p[i+1];
                const dist = this.distToSegment({x, y}, start, end);
                if (dist < 28) {
                    return false;
                }
            }
        }
        
        // 3. Tránh xây đè lên lâu đài (ở đích 880, 300)
        const castlePos = { x: 880, y: 300 };
        if (Math.hypot(castlePos.x - x, castlePos.y - y) < 55) {
            return false;
        }

        // 4. Tránh xây quá sát các cổng quái vật xuất phát ở điểm đầu các path
        for (let p of this.paths) {
            const startPos = p[0];
            if (Math.hypot(startPos.x - x, startPos.y - y) < 35) {
                return false;
            }
        }

        return true;
    },

    // Tạo đường đi quái vật ngẫu nhiên với các góc cua 90 độ
    generateRandomPaths: function() {
        const numPaths = Math.random() < 0.5 ? 2 : 3;
        
        // Định nghĩa 3 kịch bản sinh đường đi vuông góc 90 độ
        const creators = [
            // Kịch bản 1: Xuất phát Trái Trên lượn ngang-dọc xuống dưới rồi lượn lên lâu đài
            () => {
                const yStart = Math.floor(80 + Math.random() * 80);
                const x1 = Math.floor(160 + Math.random() * 80);
                const y1 = Math.floor(380 + Math.random() * 80);
                const x2 = Math.floor(480 + Math.random() * 80);
                return [
                    { x: 0, y: yStart },
                    { x: x1, y: yStart },
                    { x: x1, y: y1 },
                    { x: x2, y: y1 },
                    { x: x2, y: 300 },
                    { x: 880, y: 300 }
                ];
            },
            // Kịch bản 2: Xuất phát Trái Dưới lượn ngang-dọc lên trên rồi lượn xuống lâu đài
            () => {
                const yStart = Math.floor(440 + Math.random() * 80);
                const x1 = Math.floor(160 + Math.random() * 80);
                const y1 = Math.floor(100 + Math.random() * 80);
                const x2 = Math.floor(540 + Math.random() * 80);
                return [
                    { x: 0, y: yStart },
                    { x: x1, y: yStart },
                    { x: x1, y: y1 },
                    { x: x2, y: y1 },
                    { x: x2, y: 300 },
                    { x: 880, y: 300 }
                ];
            },
            // Kịch bản 3: Xuất phát từ Mép Trên hoặc Mép Dưới đi thẳng rồi rẽ ngang vào lâu đài
            () => {
                const fromTop = Math.random() < 0.5;
                const xStart = Math.floor(220 + Math.random() * 260);
                if (fromTop) {
                    const y1 = Math.floor(140 + Math.random() * 60);
                    const x1 = Math.floor(620 + Math.random() * 80);
                    return [
                        { x: xStart, y: 0 },
                        { x: xStart, y: y1 },
                        { x: x1, y: y1 },
                        { x: x1, y: 300 },
                        { x: 880, y: 300 }
                    ];
                } else {
                    const y1 = Math.floor(400 + Math.random() * 60);
                    const x1 = Math.floor(620 + Math.random() * 80);
                    return [
                        { x: xStart, y: 600 },
                        { x: xStart, y: y1 },
                        { x: x1, y: y1 },
                        { x: x1, y: 300 },
                        { x: 880, y: 300 }
                    ];
                }
            }
        ];

        // Trộn ngẫu nhiên các kịch bản và chọn numPaths con đường
        const shuffled = creators.sort(() => 0.5 - Math.random());
        this.paths = shuffled.slice(0, numPaths).map(create => create());
        
        // Giữ path mặc định cho tương thích hệ thống
        this.path = this.paths[0];
    },

    freezeFrames: 0,
    initObjectPools: function() {
        // Khởi tạo Object Pool cho particles với 3000 phần tử tĩnh
        const particleArray = Array.from({length: 3000}, () => ({ active: false }));
        particleArray.push = function(obj) {
            const p = particleArray.find(item => !item.active);
            if (p) {
                p.active = true;
                p.x = obj.x; p.y = obj.y; p.vx = obj.vx; p.vy = obj.vy;
                p.color = obj.color; p.alpha = obj.alpha !== undefined ? obj.alpha : 1.0;
                p.life = obj.life; p.maxLife = obj.maxLife || obj.life;
                p.size = obj.size;
                p.isSnowflake = obj.isSnowflake || false;
                p.isSmoke = obj.isSmoke || false;
                p.scaleSpeed = obj.scaleSpeed || 0;
                p.alphaSpeed = obj.alphaSpeed || 0;
                p.angle = obj.angle || 0;
                p.spin = obj.spin || 0;
                p.rotSpeed = obj.rotSpeed || 0;
                p.vx_wind = obj.vx_wind || 0;
                return p;
            }
            return null;
        };
        this.particles = particleArray;

        // Khởi tạo Object Pool cho projectiles với 150 phần tử tĩnh
        const projectileArray = Array.from({length: 150}, () => ({ active: false }));
        projectileArray.push = function(obj) {
            const p = projectileArray.find(item => !item.active);
            if (p) {
                p.active = true;
                p.type = obj.type;
                p.x = obj.x; p.y = obj.y;
                p.target = obj.target;
                p.lastTargetX = obj.lastTargetX || 0;
                p.lastTargetY = obj.lastTargetY || 0;
                p.speed = obj.speed || 0;
                p.damage = obj.damage || 0;
                p.splashRadius = obj.splashRadius || 0;
                p.color = obj.color || "#ffffff";
                p.life = obj.life || 0;
                p.maxLife = obj.maxLife || obj.life || 0;
                p.points = obj.points || null;
                p.startX = obj.startX || 0;
                p.startY = obj.startY || 0;
                p.endX = obj.endX || 0;
                p.endY = obj.endY || 0;
                p.burnDamage = obj.burnDamage || 0;
                p.burnDuration = obj.burnDuration || 0;
                p.poisonDamage = obj.poisonDamage || 0;
                p.poisonDuration = obj.poisonDuration || 0;
                p.pullStrength = obj.pullStrength || 0;
                p.isRing = obj.isRing || false;
                p.maxRadius = obj.maxRadius || 0;
                p.recoil = obj.recoil || 0;
                return p;
            }
            return null;
        };
        this.projectiles = projectileArray;
    },
    triggerHitStop: function(frames) {
        this.freezeFrames = frames;
    },

    // Khởi tạo PixiJS v8 bất đồng bộ (WebGPU ưu tiên, fallback WebGL 2.0)
    initPixi: async function(canvasId) {
        // Dọn dẹp Pixi cũ nếu có để tránh rò rỉ bộ nhớ (Memory Leak)
        if (this.pixiApp) {
            try {
                if (this.gameTicker) {
                    this.pixiApp.ticker.remove(this.gameTicker);
                    this.gameTicker = null;
                }
                this.pixiApp.destroy(true, { children: true, texture: true, sourceTexture: true });
            } catch (e) {
                console.warn("Lỗi khi dọn dẹp PixiApp cũ:", e);
            }
            this.pixiApp = null;
        }

        const oldCanvas = document.getElementById(canvasId);
        if (!oldCanvas) return;

        // 1. Khởi tạo Application Pixi v8 mới
        this.pixiApp = new PIXI.Application();
        await this.pixiApp.init({
            width: 960,
            height: 600,
            preference: 'webgpu', // Ưu tiên sức mạnh WebGPU, tự động lùi về WebGL 2.0 nếu không hỗ trợ
            backgroundAlpha: 0
        });

        // 2. Thay thế canvas cũ trong DOM
        const parent = oldCanvas.parentNode;
        this.canvas = this.pixiApp.canvas;
        this.canvas.id = canvasId;
        this.canvas.className = oldCanvas.className;
        this.canvas.style.cssText = oldCanvas.style.cssText;
        parent.replaceChild(this.canvas, oldCanvas);

        // 3. Khởi tạo cấu trúc z-index Container phân lớp
        this.mapContainer = new PIXI.Container();
        this.mapContainer.label = 'mapContainer';
        this.pathContainer = new PIXI.Container();
        this.pathContainer.label = 'pathContainer';
        this.towerContainer = new PIXI.Container();
        this.towerContainer.label = 'towerContainer';
        this.enemyContainer = new PIXI.Container();
        this.enemyContainer.label = 'enemyContainer';
        this.vfxContainer = new PIXI.Container();
        this.vfxContainer.label = 'vfxContainer';
        this.uiContainer = new PIXI.Container();
        this.uiContainer.label = 'uiContainer';

        this.pixiApp.stage.addChild(this.mapContainer);
        this.pixiApp.stage.addChild(this.pathContainer);
        this.pixiApp.stage.addChild(this.towerContainer);
        this.pixiApp.stage.addChild(this.enemyContainer);
        this.pixiApp.stage.addChild(this.vfxContainer);
        this.pixiApp.stage.addChild(this.uiContainer);

        // 4. Khởi tạo Canvas 2D phụ (Bridge) hỗ trợ các hàm vẽ cũ chưa refactor
        this.legacyCanvas = document.createElement('canvas');
        this.legacyCanvas.width = 960;
        this.legacyCanvas.height = 600;
        this.ctx = this.legacyCanvas.getContext('2d');

        // Tạo Texture từ canvas phụ và hiển thị lên Stage thông qua legacySprite
        this.legacyTexture = PIXI.Texture.from(this.legacyCanvas);
        this.legacySprite = new PIXI.Sprite(this.legacyTexture);
        this.vfxContainer.addChild(this.legacySprite); // Chèn lên trên mapContainer

        // 5. Khởi tạo Graphics vẽ nền và lưới bản đồ tĩnh bằng WebGPU
        this.bgGraphics = new PIXI.Graphics();
        this.mapContainer.addChild(this.bgGraphics);
    },

    // Vẽ nền bản đồ và lưới ô vuông neon bằng PIXI.Graphics
    drawBackground: function() {
        if (!this.bgGraphics) return;
        this.bgGraphics.clear();

        // Lấy thông tin chủ đề bản đồ ngẫu nhiên hiện tại
        const theme = this.mapThemes[this.mapTheme] || this.mapThemes.plains;

        // Định nghĩa màu nền tối giản Cyber/Quantum
        const bgColor = 0x090f1d; // Deep Space Black-Blue
        this.bgGraphics.rect(0, 0, 960, 600);
        this.bgGraphics.fill({ color: bgColor, alpha: 1 });

        // Vẽ lưới ô vuông neon cyan chìm mờ nhẹ
        const gridSize = 40;
        const gridColor = 0x00f0ff; // Neon Cyan
        const gridAlpha = 0.08;     // Mờ tinh tế
        
        for (let x = 0; x <= 960; x += gridSize) {
            this.bgGraphics.moveTo(x, 0);
            this.bgGraphics.lineTo(x, 600);
        }
        for (let y = 0; y <= 600; y += gridSize) {
            this.bgGraphics.moveTo(0, y);
            this.bgGraphics.lineTo(960, y);
        }
        this.bgGraphics.stroke({ width: 1, color: gridColor, alpha: gridAlpha });

        // Thêm đường viền neon trang trí màu tím Quantum ở cạnh biên
        const borderNeonColor = 0xbd53f9; // Neon Purple
        this.bgGraphics.moveTo(0, 0);
        this.bgGraphics.lineTo(960, 0);
        this.bgGraphics.moveTo(0, 600);
        this.bgGraphics.lineTo(960, 600);
        this.bgGraphics.stroke({ width: 2, color: borderNeonColor, alpha: 0.15 });
    },

    // Khởi tạo trò chơi
    init: function(canvasId, totalQuestions, heroData) {
        this.initObjectPools();
        this.freezeFrames = 0;
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        // Hủy ticker cũ nếu có
        if (this.pixiApp && this.pixiApp.ticker && this.gameTicker) {
            this.pixiApp.ticker.remove(this.gameTicker);
            this.gameTicker = null;
        }
        
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
        
        // Khởi động quá trình bất đồng bộ để tránh chặn luồng chính
        this.initGameAsync(canvasId, totalQuestions, heroData);
    },

    initGameAsync: async function(canvasId, totalQuestions, heroData) {
        // 1. Khởi tạo PixiJS và thay thế canvas (đảm bảo hoàn thành trước khi làm các việc khác)
        await this.initPixi(canvasId);

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
        this.totalWaves = 5;
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
        this.spawnInterval = null;
        this.countdown = null;
        
        // Biến mới theo dõi quái vượt qua và trạng thái wave
        this.escapedMonsters = {};
        this.hasStartedSpawning = false;
        this.updateEscapedMonstersHUD();
        
        this.renderTowerButtons();
        this.updateHUD();
        
        // Ràng buộc lại toàn bộ event listeners vào canvas mới của PixiJS
        this.unbindEvents();
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
        
        // Nạp trước tài nguyên hình ảnh game nếu chưa nạp
        if (!this.imagesLoaded) {
            this.loadGameAssets();
        }

        // Vẽ background tĩnh bằng WebGPU Graphics
        this.drawBackground();
        
        // Bắt đầu game loop sử dụng PIXI.Ticker
        this.lastTime = performance.now();
        this.accumulator = 0;
        
        this.gameTicker = (ticker) => {
            this.loop(ticker);
        };
        this.pixiApp.ticker.add(this.gameTicker);
    },
    
    // Dừng game
    stop: function() {
        this.isPlaying = false;
        
        // Tạm dừng ticker an toàn
        if (this.pixiApp && this.pixiApp.ticker && this.gameTicker) {
            this.pixiApp.ticker.remove(this.gameTicker);
            this.gameTicker = null;
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
    
    // Tính toán các hệ số nhân dựa trên Siêu Anh Hùng hiện tại
    getHeroMultipliers: function() {
        return this.getHeroMultipliersForId(this.hero ? this.hero.selectedId : null, this.hero ? this.hero.level : 1);
    },

    // Lấy hệ số nhân của một anh hùng cụ thể dựa trên ID và cấp độ
    getHeroMultipliersForId: function(heroId, level = 1) {
        const mult = {
            damage: 1.0,
            range: 1.0,
            cost: 1.0,
            gold: 1.0,
            slowDuration: 1.0
        };
        
        if (heroId) {
            if (heroId === 'light_warrior') {
                mult.damage = 1.15 + (level - 1) * 0.05; // +15% sát thương + 5% mỗi cấp
            } else if (heroId === 'frost_mage') {
                mult.range = 1.15 + (level - 1) * 0.03; // +15% tầm bắn + 3% mỗi cấp
                mult.slowDuration = 1.20; // Tăng 20% làm chậm
            } else if (heroId === 'gold_knight') {
                mult.cost = Math.max(0.7, 0.9 - (level - 1) * 0.01); // giảm 10% giá + 1% mỗi cấp, max giảm 30%
                mult.gold = 1.20 + (level - 1) * 0.04; // tăng 20% vàng + 4% mỗi cấp
            }
        }
        return mult;
    },

    // Cập nhật lại chỉ số (sát thương, tầm bắn, làm chậm) của các tháp hiện có khi đổi anh hùng
    updateExistingTowersStats: function(oldHeroId, newHeroId) {
        const level = this.hero ? this.hero.level : 1;
        const oldMult = this.getHeroMultipliersForId(oldHeroId, level);
        const newMult = this.getHeroMultipliersForId(newHeroId, level);
        
        const damageRatio = newMult.damage / oldMult.damage;
        const rangeRatio = newMult.range / oldMult.range;
        const slowRatio = newMult.slowDuration / oldMult.slowDuration;
        
        this.towers.forEach(t => {
            t.damage = Math.round(t.damage * damageRatio);
            t.range = Math.round(t.range * rangeRatio);
            if (t.slowDuration) {
                t.slowDuration = Math.round(t.slowDuration * slowRatio);
            }
        });
    },

    // Vẽ động các nút tháp canh phòng thủ dựa theo cấp độ của Siêu Anh Hùng
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
                        // Tạo hiệu ứng vòng bụi xây dựng (shockwave)
                        for (let k = 0; k < 24; k++) {
                            const angle = (k / 24) * Math.PI * 2;
                            const speed = 1.8 + Math.random() * 0.8;
                            this.particles.push({
                                x: buildX,
                                y: buildY,
                                vx: Math.cos(angle) * speed,
                                vy: Math.sin(angle) * speed,
                                color: "#e2e8f0",
                                alpha: 0.75,
                                life: 16 + Math.random() * 8,
                                maxLife: 24,
                                size: 2.2 + Math.random() * 1.5
                            });
                        }

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
            
            // 2.2. Kiểm tra bấm trúng tháp đã xây để xem nâng cấp/bán
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
        
        // Cột sáng nâng cấp bay thẳng lên trời
        for (let i = 0; i < 40; i++) {
            this.particles.push({
                x: tower.x + (Math.random() - 0.5) * 16,
                y: tower.y - Math.random() * 30,
                vx: (Math.random() - 0.5) * 0.4,
                vy: -2.0 - Math.random() * 2.5,
                color: "#fbbf24",
                alpha: 1.0,
                life: 25 + Math.random() * 15,
                maxLife: 40,
                size: 1.8 + Math.random() * 2.2
            });
        }
        
        if (window.app && app.audio && typeof app.audio.playTdSound === 'function') {
            app.audio.playTdSound('upgrade');
        } else if (window.app && app.audio) {
            app.audio.playClick();
        }
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
    
    // Mở hộp thoại chọn Siêu Anh Hùng trong game khi nhấn vào thành chính
    openHeroSelectorInGame: function() {
        const wasPlaying = this.isPlaying;
        
        // Tạm dừng game để bé chọn anh hùng không bị quái đánh mất máu
        this.isPlaying = false;
        
        // Đăng ký hàm toàn cục xử lý sự kiện chọn hero
        window.selectTdHeroInGame = (heroId) => {
            const oldHeroId = this.hero ? this.hero.selectedId : null;
            if (this.hero) {
                this.hero.load();
                this.hero.selectedId = heroId;
                this.hero.save();
            }
            
            // Cập nhật chỉ số tháp canh hiện có tương ứng với hero mới
            this.updateExistingTowersStats(oldHeroId, heroId);
            
            Swal.close();
            
            // Hiện chữ nổi thông báo siêu anh hùng xuất trận
            const heroName = this.hero.registry[heroId].name;
            const heroEmoji = this.hero.registry[heroId].emoji;
            this.spawnPopup(880, 240, `✨ ${heroEmoji} ${heroName} xuất trận!`, "#fbbf24", 16);
            
            // Tiếp tục game
            this.isPlaying = wasPlaying;
            if (this.isPlaying) {
                if (this.animationFrame) {
                    cancelAnimationFrame(this.animationFrame);
                }
                this.lastTime = performance.now();
                this.accumulator = 0;
                this.loop();
            }
        };

        const currentSelectedId = this.hero ? this.hero.selectedId : null;

        Swal.fire({
            title: 'Chọn Siêu Anh Hùng Hộ Vệ 🏰',
            html: `<p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1.2rem;">Hãy chọn một siêu anh hùng làm hộ vệ cho Lâu đài Hoàng gia nhé!</p>
                   <div class="hero-selector-container" style="display:flex; justify-content:space-around; gap:10px; margin-top:0.5rem;">
                     <div class="hero-card" id="btn-select-in-light-warrior" style="border: 2px solid ${currentSelectedId === 'light_warrior' ? '#fbbf24' : 'var(--border-color)'}; border-radius: 12px; padding: 15px; cursor: pointer; width: 31%; transition: all 0.3s; background: ${currentSelectedId === 'light_warrior' ? 'rgba(251, 191, 36, 0.08)' : 'rgba(255,255,255,0.02)'}; display:flex; flex-direction:column; align-items:center;">
                         <div style="font-size: 2.5rem; margin-bottom: 8px;">⚔️</div>
                         <div style="font-weight: bold; color: var(--text-main); margin-bottom: 5px; font-size:0.95rem; text-align:center;">Chiến Binh Ánh Sáng</div>
                         <div style="font-size: 0.72rem; color: var(--text-muted); text-align:center; line-height:1.4;">Tăng +15% sát thương tháp (+5%/cấp)</div>
                     </div>
                     <div class="hero-card" id="btn-select-in-frost-mage" style="border: 2px solid ${currentSelectedId === 'frost_mage' ? '#fbbf24' : 'var(--border-color)'}; border-radius: 12px; padding: 15px; cursor: pointer; width: 31%; transition: all 0.3s; background: ${currentSelectedId === 'frost_mage' ? 'rgba(251, 191, 36, 0.08)' : 'rgba(255,255,255,0.02)'}; display:flex; flex-direction:column; align-items:center;">
                         <div style="font-size: 2.5rem; margin-bottom: 8px;">❄️</div>
                         <div style="font-weight: bold; color: var(--text-main); margin-bottom: 5px; font-size:0.95rem; text-align:center;">Pháp Sư Băng Giá</div>
                         <div style="font-size: 0.72rem; color: var(--text-muted); text-align:center; line-height:1.4;">Tăng +15% tầm bắn tháp (+3%/cấp) và làm chậm</div>
                     </div>
                     <div class="hero-card" id="btn-select-in-gold-knight" style="border: 2px solid ${currentSelectedId === 'gold_knight' ? '#fbbf24' : 'var(--border-color)'}; border-radius: 12px; padding: 15px; cursor: pointer; width: 31%; transition: all 0.3s; background: ${currentSelectedId === 'gold_knight' ? 'rgba(251, 191, 36, 0.08)' : 'rgba(255,255,255,0.02)'}; display:flex; flex-direction:column; align-items:center;">
                         <div style="font-size: 2.5rem; margin-bottom: 8px;">🪙</div>
                         <div style="font-weight: bold; color: var(--text-main); margin-bottom: 5px; font-size:0.95rem; text-align:center;">Thần Tài Chiêu Lộc</div>
                         <div style="font-size: 0.72rem; color: var(--text-muted); text-align:center; line-height:1.4;">Giảm -10% giá xây tháp và nhận +20% vàng (+4%/cấp)</div>
                     </div>
                   </div>`,
            showConfirmButton: false,
            showCancelButton: true,
            cancelButtonText: 'Đóng',
            target: document.getElementById('tab-practice') || 'body',
            customClass: {
                popup: 'hero-select-popup'
            },
            didOpen: () => {
                const container = typeof Swal.getHtmlContainer === 'function' ? Swal.getHtmlContainer() : document;
                const cardLight = container.querySelector("#btn-select-in-light-warrior");
                const cardFrost = container.querySelector("#btn-select-in-frost-mage");
                const cardGold = container.querySelector("#btn-select-in-gold-knight");

                if (cardLight) cardLight.onclick = () => window.selectTdHeroInGame("light_warrior");
                if (cardFrost) cardFrost.onclick = () => window.selectTdHeroInGame("frost_mage");
                if (cardGold) cardGold.onclick = () => window.selectTdHeroInGame("gold_knight");
            },
            willClose: () => {
                // Đảm bảo game chạy tiếp nếu bé đóng popup mà không chọn
                if (!this.isPlaying) {
                    this.isPlaying = wasPlaying;
                    if (this.isPlaying) {
                        if (this.animationFrame) {
                            cancelAnimationFrame(this.animationFrame);
                        }
                        this.lastTime = performance.now();
                        this.accumulator = 0;
                        this.loop();
                    }
                }
            }
        });
    },
    
    // Bắt đầu đợt quái do người chơi nhấn nút
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
    
    // Vòng lặp vẽ và cập nhật trạng thái game, được kích hoạt bởi PIXI.Ticker
    loop: function(ticker) {
        if (!this.isPlaying) return;
        
        // Sử dụng ticker.elapsedMS để tính thời gian trôi qua, mượt mà và chính xác
        let elapsed = ticker.elapsedMS;
        if (elapsed > 100) elapsed = 100;
        
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
        
        // 1. Vẽ các thực thể cũ lên canvas 2D ẩn (Bridge)
        this.draw();
        
        // 2. Cập nhật Texture nguồn của PixiJS để đẩy dữ liệu pixel lên GPU (WebGPU/WebGL)
        if (this.legacyTexture && this.legacyTexture.source) {
            this.legacyTexture.source.update();
        }
    },
    
    // Cập nhật vật lý và trạng thái
    update: function() {
        if (this.freezeFrames > 0) {
            this.freezeFrames--;
            return;
        }

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

            if (tower.recoil > 0) {
                tower.recoil -= 0.08; // Phục hồi recoil dần
                if (tower.recoil < 0) tower.recoil = 0;
            }
            tower.timer++;
            if (tower.timer >= tower.cooldown) {
                if (target) {
                    this.fireProjectile(tower, target);
                    tower.timer = 0;
                }
            }
        });
        
        // 4. Cập nhật đạn bay (Object Pool)
        for (let i = 0; i < this.projectiles.length; i++) {
            const p = this.projectiles[i];
            if (!p.active) continue;
            
            // Đạn dạng tia hoặc sét biến mất nhanh
            if (p.type === 'laser' || p.type === 'lightning' || p.type === 'laser_beam') {
                p.life--;
                if (p.life <= 0) {
                    p.active = false;
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
                    p.active = false;
                } else {
                    p.x += (dx / dist) * p.speed;
                }
            }
        }
        
        // 5. Cập nhật các vụ nổ hạt
        for (let i = 0; i < this.particles.length; i++) {
            const part = this.particles[i];
            if (!part.active) continue;
            part.x += part.vx;
            part.y += part.vy;
            part.life--;
            part.alpha = Math.max(0, part.life / part.maxLife);
            if (part.life <= 0) {
                part.active = false;
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

        // 7. Kiểm tra đợt quái hoàn thành (khi quái chết hết và không sinh thêm nữa)
        if (this.isWaveActive && this.hasStartedSpawning && !this.isSpawning && this.enemies.length === 0) {
            this.isWaveActive = false;
            
            // Gọi callback thông báo đợt quái hoàn thành để questions.js mở khóa nút Tiếp tục làm bài
            if (window.questions && typeof window.questions.onWaveComplete === 'function') {
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
                    
                    Swal.fire({
                        title: 'CHIẾN THẮNG RỰC RỠ! 🏆',
                        html: `<div style="font-size: 3.5rem; margin-bottom: 1rem;">🏰✨</div>
                               <p>Chúc mừng con! Con đã phòng thủ thành công lâu đài qua cả <b>${this.totalWaves} đợt quái vật nguy hiểm</b>!</p>
                               <p style="color:var(--success); font-weight:bold;">Tri thức Toán học của con chính là vũ khí mạnh mẽ nhất!</p>`,
                        confirmButtonText: 'Xem kết quả bài học',
                        confirmButtonColor: 'var(--success)',
                        target: document.getElementById('tab-practice') || 'body',
                        allowOutsideClick: false
                    }).then(() => {
                        if (window.questions && typeof window.questions.finishPractice === 'function') {
                            window.questions.finishPractice();
                        }
                    });
                }, 1000);
            }
        }
    },
    
    // Kiểm tra quái vật chết và xử lý cộng vàng cùng hiệu ứng nổ tan rã
    checkEnemyDead: function(enemy, x, y) {
        if (enemy.hp <= 0) {
            const idx = this.enemies.indexOf(enemy);
            if (idx !== -1) {
                this.enemies.splice(idx, 1);
                
                // Rung màn hình và hit stop khi quái lớn/Boss bị tiêu diệt
                if (enemy.type === 'boss') {
                    this.screenShake = Math.max(this.screenShake || 0, 18);
                    this.triggerHitStop(4); // Tạm dừng 4 frame
                } else if (enemy.type === 'titan' || enemy.type === 'lava_golem') {
                    this.screenShake = Math.max(this.screenShake || 0, 8);
                    this.triggerHitStop(2);
                } else {
                    if (Math.random() < 0.15) {
                        this.triggerHitStop(1);
                    }
                }
                
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
            tower.recoil = 1.0; // Bắt đầu lực giật lùi
            this.screenShake = Math.max(this.screenShake || 0, 7); // Rung nhẹ khi pháo bắn
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
            tower.recoil = 1.0; // Rung nhẹ nòng Gatling
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

    // Hàm vẽ quái vật 3D Chibi với hoạt họa bước chân, vỗ cánh, bay lơ lửng sống động
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
    drawSingleTower: function(t) {
        // Vẽ vòng đệm Neon phát sáng quanh chân tháp nâng cấp
        this.ctx.save();
        const baseGlowColor = t.level >= 3 ? "#fbbf24" : (t.type === 'ice' ? "#38bdf8" : (t.type === 'laser' ? "#ec4899" : "#6366f1"));
        this.ctx.strokeStyle = baseGlowColor;
        this.ctx.lineWidth = 2.5;
        this.ctx.shadowColor = baseGlowColor;
        this.ctx.shadowBlur = 10;
        this.ctx.beginPath();
        this.ctx.arc(t.x, t.y + 6, 22, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();

        // 100% Vector Canvas Renderer phong cách Sci-Fi Cyberpunk/Quantum
        this.ctx.save();
        this.ctx.shadowBlur = 8;
        
        if (t.type === 'archer') {
            // Quantum Laser Bow Tower
            // Bệ tháp đá Quantum đen xám
            this.ctx.fillStyle = "#1e293b";
            this.ctx.strokeStyle = "#38bdf8";
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();
            this.ctx.moveTo(t.x - 10, t.y + 10);
            this.ctx.lineTo(t.x - 7, t.y - 15);
            this.ctx.lineTo(t.x + 7, t.y - 15);
            this.ctx.lineTo(t.x + 10, t.y + 10);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();

            // Mái vòm năng lượng
            this.ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
            this.ctx.beginPath();
            this.ctx.arc(t.x, t.y - 15, 11, Math.PI, 0);
            this.ctx.fill();

            // Viên ngọc lượng tử lơ lửng
            const bob = Math.sin(Date.now() * 0.007) * 4;
            const gemY = t.y - 25 + bob;
            
            // Hào quang vàng rực
            const gemGrad = this.ctx.createRadialGradient(t.x, gemY, 1, t.x, gemY, 12);
            gemGrad.addColorStop(0, "#ffffff");
            gemGrad.addColorStop(0.4, "#eab308");
            gemGrad.addColorStop(1, "rgba(234, 179, 8, 0)");
            this.ctx.fillStyle = gemGrad;
            this.ctx.beginPath();
            this.ctx.arc(t.x, gemY, 10, 0, Math.PI * 2);
            this.ctx.fill();

            // Vòng elip lượng tử xoay chéo bao quanh
            this.ctx.strokeStyle = "#38bdf8";
            this.ctx.lineWidth = 1.2;
            this.ctx.save();
            this.ctx.translate(t.x, gemY);
            this.ctx.rotate(Date.now() * 0.004);
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, 14, 5, Math.PI / 6, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.restore();

            // Vẽ emoji đại diện
            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "bold 11px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("🏹", t.x, t.y - 2);

        } else if (t.type === 'ice') {
            // Chrono Frost Tower
            // Bệ tháp băng pha lê xanh chàm
            this.ctx.fillStyle = "#0f172a";
            this.ctx.strokeStyle = "#06b6d4";
            this.ctx.lineWidth = 1.8;
            this.ctx.beginPath();
            this.ctx.moveTo(t.x - 12, t.y + 10);
            this.ctx.lineTo(t.x - 6, t.y - 18);
            this.ctx.lineTo(t.x + 6, t.y - 18);
            this.ctx.lineTo(t.x + 12, t.y + 10);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();

            // Tinh thể băng lớn ở đỉnh phát hào quang
            const pulse = 8 + Math.sin(Date.now() * 0.01) * 2;
            const crystalGrad = this.ctx.createRadialGradient(t.x, t.y - 25, 1, t.x, t.y - 25, pulse);
            crystalGrad.addColorStop(0, "#ffffff");
            crystalGrad.addColorStop(0.5, "#38bdf8");
            crystalGrad.addColorStop(1, "rgba(56, 189, 248, 0)");
            this.ctx.fillStyle = crystalGrad;
            this.ctx.beginPath();
            this.ctx.arc(t.x, t.y - 25, pulse, 0, Math.PI * 2);
            this.ctx.fill();

            // Tinh thể băng thoi nhỏ xoay động xung quanh
            const crystalCount = t.level >= 3 ? 3 : 2;
            const rotAngle = Date.now() * 0.003;
            for (let i = 0; i < crystalCount; i++) {
                const angle = rotAngle + i * (Math.PI * 2 / crystalCount);
                const cx = t.x + Math.cos(angle) * 16;
                const cy = t.y - 20 + Math.sin(angle) * 6; // Xoay elip nghiêng elip dẹt
                
                this.ctx.save();
                this.ctx.translate(cx, cy);
                this.ctx.rotate(angle + Math.PI / 4);
                this.ctx.fillStyle = "#38bdf8";
                this.ctx.strokeStyle = "#ffffff";
                this.ctx.lineWidth = 0.8;
                this.ctx.beginPath();
                this.ctx.moveTo(0, -5);
                this.ctx.lineTo(3, 0);
                this.ctx.lineTo(0, 5);
                this.ctx.lineTo(-3, 0);
                this.ctx.closePath();
                this.ctx.fill();
                this.ctx.stroke();
                this.ctx.restore();
            }

            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "bold 11px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("❄️", t.x, t.y - 2);

        } else if (t.type === 'bomb') {
            // Plasma Artillery Tower
            // Bệ sắt cơ khí nặng nề
            this.ctx.fillStyle = "#334155";
            this.ctx.strokeStyle = "#ea580c";
            this.ctx.lineWidth = 1.5;
            this.ctx.fillRect(t.x - 11, t.y - 8, 22, 18);
            this.ctx.strokeRect(t.x - 11, t.y - 8, 22, 18);

            // Đầu súng tròn bọc giáp
            this.ctx.fillStyle = "#1e293b";
            this.ctx.beginPath();
            this.ctx.arc(t.x, t.y - 8, 12, 0, Math.PI * 2);
            this.ctx.fill();

            // Tính toán Recoil Easing (easeOutQuad)
            const recoilVal = t.recoil || 0;
            const easeRecoil = recoilVal * (2 - recoilVal);
            const recoilOffset = -8 * easeRecoil; // Đẩy lùi nòng 8px

            // Vẽ nòng pháo kép giật lùi theo góc bắn
            this.ctx.save();
            this.ctx.translate(t.x, t.y - 8);
            this.ctx.rotate(t.angle || -Math.PI / 2);
            this.ctx.translate(recoilOffset, 0); // Giật lùi nòng súng
            
            this.ctx.fillStyle = "#475569";
            this.ctx.strokeStyle = "#ea580c";
            this.ctx.lineWidth = 1.0;
            // 2 nòng súng song song
            this.ctx.fillRect(0, -6, 22, 4);
            this.ctx.strokeRect(0, -6, 22, 4);
            this.ctx.fillRect(0, 2, 22, 4);
            this.ctx.strokeRect(0, 2, 22, 4);
            
            // Lõi magma nạp năng lượng rực sáng đầu nòng
            if (recoilVal > 0.3) {
                this.ctx.fillStyle = "#fbbf24";
                this.ctx.fillRect(20, -5, 4, 10);
            }
            this.ctx.restore();

            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "bold 11px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("💣", t.x, t.y + 6);

        } else if (t.type === 'soldier') {
            // Hyperion Guardian Base
            // Pháo đài thép
            this.ctx.fillStyle = "#1e293b";
            this.ctx.strokeStyle = "#22c55e";
            this.ctx.lineWidth = 2.0;
            this.ctx.fillRect(t.x - 14, t.y - 12, 28, 22);
            this.ctx.strokeRect(t.x - 14, t.y - 12, 28, 22);

            // Cổng kịch phát năng lượng xanh lá (Vòng tròn cổng dịch chuyển)
            const portalPulse = 14 + Math.sin(Date.now() * 0.015) * 2.5;
            this.ctx.strokeStyle = "rgba(34, 197, 94, 0.85)";
            this.ctx.lineWidth = 2.0;
            this.ctx.beginPath();
            this.ctx.arc(t.x, t.y - 12, portalPulse, 0, Math.PI * 2);
            this.ctx.stroke();

            // Hiệu ứng hạt bụi năng lượng bay lên nhẹ
            if (Math.random() < 0.15) {
                this.particles.push({
                    x: t.x + (Math.random() - 0.5) * 20,
                    y: t.y - 5,
                    vx: 0,
                    vy: -0.6 - Math.random() * 0.6,
                    color: "#22c55e",
                    alpha: 0.8,
                    life: 20,
                    maxLife: 20,
                    size: 1.2
                });
            }

            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "bold 11px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("🛡️", t.x, t.y + 2);

        } else if (t.type === 'thunder') {
            // Tesla Storm Overlord
            // Cột phóng điện Tesla cao áp
            this.ctx.fillStyle = "#1e1b4b";
            this.ctx.strokeStyle = "#06b6d4";
            this.ctx.lineWidth = 1.5;
            this.ctx.fillRect(t.x - 6, t.y - 20, 12, 28);
            this.ctx.strokeRect(t.x - 6, t.y - 20, 12, 28);

            // Các vòng kim loại tích điện
            this.ctx.fillStyle = "#475569";
            this.ctx.fillRect(t.x - 10, t.y - 12, 20, 3);
            this.ctx.fillRect(t.x - 8, t.y - 4, 16, 3);

            // Quả cầu năng lượng sấm sét Tesla
            const bob = Math.sin(Date.now() * 0.008) * 3;
            const ballY = t.y - 28 + bob;
            const glow = 10 + Math.sin(Date.now() * 0.035) * 3;

            const grad = this.ctx.createRadialGradient(t.x, ballY, 1, t.x, ballY, glow);
            grad.addColorStop(0, "#ffffff");
            grad.addColorStop(0.3, "#22d3ee");
            grad.addColorStop(0.7, "#0891b2");
            grad.addColorStop(1, "rgba(6, 182, 212, 0)");
            this.ctx.fillStyle = grad;
            this.ctx.beginPath();
            this.ctx.arc(t.x, ballY, glow, 0, Math.PI * 2);
            this.ctx.fill();

            // Tia sét trang trí nhảy liên tục từ đỉnh xuống chân tháp
            if (Math.random() < 0.28) {
                this.ctx.strokeStyle = "#e0f2fe";
                this.ctx.lineWidth = 1.0;
                this.ctx.shadowBlur = 6;
                this.ctx.shadowColor = "#22d3ee";
                this.ctx.beginPath();
                this.ctx.moveTo(t.x, ballY);
                let cx = t.x;
                let cy = ballY;
                for (let s = 0; s < 4; s++) {
                    cx += (Math.random() - 0.5) * 10;
                    cy += 7;
                    this.ctx.lineTo(cx, cy);
                }
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
            }

            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "bold 11px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("⚡", t.x, t.y - 2);

        } else if (t.type === 'laser') {
            // Gatling Laser Turret
            // Bệ súng nòng xoay hiện đại
            this.ctx.fillStyle = "#0f172a";
            this.ctx.strokeStyle = "#ec4899";
            this.ctx.lineWidth = 1.5;
            this.ctx.fillRect(t.x - 12, t.y - 6, 24, 16);
            this.ctx.strokeRect(t.x - 12, t.y - 6, 24, 16);

            // Bệ xoay tròn nòng súng
            this.ctx.fillStyle = "#334155";
            this.ctx.beginPath();
            this.ctx.arc(t.x, t.y - 6, 10, 0, Math.PI * 2);
            this.ctx.fill();

            // Nếu đang bắn, xoay nòng súng Gatling liên tục
            const recoilVal = t.recoil || 0;
            if (recoilVal > 0) {
                t.spinAngle = (t.spinAngle || 0) + 0.35;
            }

            const spin = t.spinAngle || 0;

            // Vẽ cụm nòng xoay 3 ống của Gatling theo góc bắn
            this.ctx.save();
            this.ctx.translate(t.x, t.y - 6);
            this.ctx.rotate(t.angle || -Math.PI / 2);
            
            // Vẽ 3 nòng Gatling xoay quanh tâm
            this.ctx.fillStyle = "#1e293b";
            this.ctx.strokeStyle = "#ec4899";
            this.ctx.lineWidth = 0.8;
            for (let i = 0; i < 3; i++) {
                const pipeOffset = Math.sin(spin + i * (Math.PI * 2 / 3)) * 4;
                this.ctx.fillRect(0, -2 + pipeOffset, 24, 4);
                this.ctx.strokeRect(0, -2 + pipeOffset, 24, 4);
            }

            // Hiệu ứng lửa nòng (muzzle flash) đỏ cam khi bắn
            if (recoilVal > 0.6) {
                this.ctx.fillStyle = "#f97316";
                this.ctx.beginPath();
                this.ctx.moveTo(24, -5);
                this.ctx.lineTo(34, 0);
                this.ctx.lineTo(24, 5);
                this.ctx.closePath();
                this.ctx.fill();
                
                this.ctx.fillStyle = "#fbbf24";
                this.ctx.beginPath();
                this.ctx.moveTo(24, -2.5);
                this.ctx.lineTo(29, 0);
                this.ctx.lineTo(24, 2.5);
                this.ctx.closePath();
                this.ctx.fill();
            }
            this.ctx.restore();

            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "bold 11px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("📡", t.x, t.y + 6);

        } else if (t.type === 'poison') {
            // Bio-Chemical Toxins Tower
            // Bình hóa học phát sáng neon tím sậm
            this.ctx.fillStyle = "#3b0764";
            this.ctx.strokeStyle = "#c084fc";
            this.ctx.lineWidth = 1.5;
            this.ctx.fillRect(t.x - 11, t.y - 12, 22, 22);
            this.ctx.strokeRect(t.x - 11, t.y - 12, 22, 22);

            // Nước độc tím sủi bọt bên trong
            const timeAngle = Date.now() * 0.005;
            const bubbleHeight = Math.sin(timeAngle) * 2;
            this.ctx.fillStyle = "#a855f7";
            this.ctx.fillRect(t.x - 9, t.y - 4 + bubbleHeight, 18, 12 - bubbleHeight);

            // Bong bóng bay lên
            const pulse = 7 + Math.sin(Date.now() * 0.006) * 1.5;
            const glowGrad = this.ctx.createRadialGradient(t.x, t.y - 24, 1, t.x, t.y - 24, pulse);
            glowGrad.addColorStop(0, "#ffffff");
            glowGrad.addColorStop(0.5, "#a855f7");
            glowGrad.addColorStop(1, "rgba(168, 85, 247, 0)");
            this.ctx.fillStyle = glowGrad;
            this.ctx.beginPath();
            this.ctx.arc(t.x, t.y - 24, pulse, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "bold 11px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("🧪", t.x, t.y - 2);

        } else if (t.type === 'fire') {
            // Singularity Core (Tháp Hỏa Long)
            // Lõi magma cơ khí
            this.ctx.fillStyle = "#1c1917";
            this.ctx.strokeStyle = "#ea580c";
            this.ctx.lineWidth = 1.5;
            this.ctx.fillRect(t.x - 12, t.y - 12, 24, 22);
            this.ctx.strokeRect(t.x - 12, t.y - 12, 24, 22);

            // Hào quang nhiệt hạch rực đỏ cam
            const lavaPulse = 8 + Math.sin(Date.now() * 0.012) * 2.8;
            const lavaGrad = this.ctx.createRadialGradient(t.x, t.y - 24, 1, t.x, t.y - 24, lavaPulse);
            lavaGrad.addColorStop(0, "#facc15");
            lavaGrad.addColorStop(0.4, "#ea580c");
            lavaGrad.addColorStop(1, "rgba(234, 88, 12, 0)");
            this.ctx.fillStyle = lavaGrad;
            this.ctx.beginPath();
            this.ctx.arc(t.x, t.y - 24, lavaPulse, 0, Math.PI * 2);
            this.ctx.fill();

            // Vòng plasma cam đỏ nghiêng xoay tròn xung quanh lõi
            this.ctx.strokeStyle = "#f97316";
            this.ctx.lineWidth = 1.6;
            this.ctx.save();
            this.ctx.translate(t.x, t.y - 24);
            this.ctx.rotate(-Date.now() * 0.003);
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, 16, 6, Math.PI / 4, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.restore();

            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "bold 11px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("🌋", t.x, t.y - 2);

        } else if (t.type === 'void') {
            // Quantum Void Gate (Tháp Vô Cực)
            // Khung cổng vũ trụ cổ xưa màu xanh đen sâu thẳm
            this.ctx.fillStyle = "#030712";
            this.ctx.strokeStyle = "#6366f1";
            this.ctx.lineWidth = 2.0;
            this.ctx.beginPath();
            this.ctx.moveTo(t.x - 14, t.y + 10);
            this.ctx.lineTo(t.x - 14, t.y - 12);
            this.ctx.lineTo(t.x + 14, t.y - 12);
            this.ctx.lineTo(t.x + 14, t.y + 10);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();

            // Lỗ đen hút bụi xoay tròn ở tâm
            this.ctx.save();
            this.ctx.translate(t.x, t.y - 16);
            this.ctx.rotate(Date.now() * 0.006);
            this.ctx.fillStyle = "#020617";
            this.ctx.strokeStyle = "#4f46e5";
            this.ctx.lineWidth = 2.5;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 10, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
            
            // Hào quang lỗ đen
            const voidGrad = this.ctx.createRadialGradient(0, 0, 3, 0, 0, 14);
            voidGrad.addColorStop(0, "#000000");
            voidGrad.addColorStop(0.5, "#6366f1");
            voidGrad.addColorStop(1, "rgba(99, 102, 241, 0)");
            this.ctx.fillStyle = voidGrad;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 14, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();

            this.ctx.fillStyle = "#ffffff";
            this.ctx.font = "bold 11px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("🌀", t.x, t.y + 6);
        }

        this.ctx.restore();

        // Nếu tháp cấp cao (Cấp 3+), vẽ thêm hào quang ngôi sao rực rỡ
        if (t.level >= 3) {
            this.ctx.save();
            this.ctx.fillStyle = "#fbbf24";
            this.ctx.shadowColor = "#fbbf24";
            this.ctx.shadowBlur = 6;
            this.ctx.font = "bold 9px sans-serif";
            this.ctx.textAlign = "center";
            this.ctx.fillText("✨MAX", t.x, t.y - 36);
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
    _generateTerrainObjects: function() {
        this.terrainObjects = [];
        const count = 30; // Số lượng vật trang trí
        for (let i = 0; i < count; i++) {
            let x = Math.random() * (this.canvas.width - 60) + 30;
            let y = Math.random() * (this.canvas.height - 60) + 30;
            
            // Tránh sinh đè lên đường đi quái vật (paths)
            let tooClose = false;
            for (let p of this.paths) {
                for (let j = 0; j < p.length - 1; j++) {
                    const dist = this.distToSegment({x, y}, p[j], p[j+1]);
                    if (dist < 45) { tooClose = true; break; }
                }
                if (tooClose) break;
            }
            // Tránh lâu đài
            if (Math.hypot(880 - x, 300 - y) < 85) tooClose = true;
            // Tránh cổng quái vật
            for (let p of this.paths) {
                if (Math.hypot(p[0].x - x, p[0].y - y) < 55) tooClose = true;
            }
            
            if (!tooClose) {
                this.terrainObjects.push({
                    x: x,
                    y: y,
                    type: Math.floor(Math.random() * 3), // 3 kiểu vật thể cho mỗi theme
                    scale: 0.7 + Math.random() * 0.6,
                    seed: Math.random() // dùng để tạo chuyển động nhẹ riêng biệt
                });
            }
        }
    },

    // Vẽ các chi tiết terrain trang trí 3D Chibi theo chủ đề bản đồ
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
    draw: function() {
        if (!this.ctx) return;
        this.ctx.save();
        this.ctx.clearRect(0, 0, 960, 600); // Xóa canvas phụ 2D
        
        if (this.screenShake > 0) {
            const dx = (Math.random() - 0.5) * this.screenShake * 2.5;
            const dy = (Math.random() - 0.5) * this.screenShake * 2.5;
            this.ctx.translate(dx, dy);
        }
        
        // Lấy thông tin màu sắc của Bản đồ ngẫu nhiên hiện tại (Random Map Theme)
        const theme = this.mapThemes[this.mapTheme] || this.mapThemes.plains;
        
        // CHÚ Ý: Vẽ nền bản đồ và Grid đã được chuyển sang PixiJS Graphics tĩnh (drawBackground)
        // ở mapContainer để tối ưu hóa hiệu năng VRAM.

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

            // Vẽ tháp
            this.drawSingleTower(t);
        });
        
        // 6. Vẽ đạn bay
        this.projectiles.forEach(p => {
            if (!p.active) return;
            if (!p.active) return;
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
            if (!part.active) return;
            if (!part.active) return;
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
        this.ctx.restore();
    },
    
    // Phép tính khoảng cách từ điểm p đến đoạn thẳng v-w
    distToSegmentSquared: function(p, v, w) {
        const l2 = (v.x - w.x) * (v.x - w.x) + (v.y - w.y) * (v.y - w.y);
        if (l2 === 0) return (p.x - v.x) * (p.x - v.x) + (p.y - v.y) * (p.y - v.y);
        let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        return (p.x - (v.x + t * (w.x - v.x))) * (p.x - (v.x + t * (w.x - v.x))) +
               (p.y - (v.y + t * (w.y - v.y))) * (p.y - (v.y + t * (w.y - v.y)));
    },
    
    distToSegment: function(p, v, w) {
        return Math.sqrt(this.distToSegmentSquared(p, v, w));
    },
    
    // Khởi tạo chữ bay
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
        
        // Kích hoạt tiếng nổ / sai nhẹ của hệ thống
        if (window.app && app.audio) app.audio.playWrong();
    },
    
    // Cập nhật giao diện quái vượt qua
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
    skillsConfig: {
        light_warrior: [
            {
                id: 'skill1',
                name: 'Kiếm Khí',
                emoji: '⚔️',
                cost: 35,
                title: 'Kiếm Khí Càn Khôn (Mana: 35) - Phóng kiếm khí gây 250 sát thương lên tất cả quái vật'
            },
            {
                id: 'skill2',
                name: 'Chiến Thần',
                emoji: '🛡️',
                cost: 40,
                title: 'Chiến Thần Hộ Thể (Mana: 40) - Tăng 50% sát thương cho tất cả tháp trong 6 giây'
            },
            {
                id: 'skill3',
                name: 'Quang Minh',
                emoji: '☀️',
                cost: 50,
                title: 'Quang Minh Phán Quyết (Mana: 50) - Cột sáng quang năng tiêu diệt quái dưới 40% HP hoặc gây 500 sát thương'
            }
        ],
        frost_mage: [
            {
                id: 'skill1',
                name: 'Băng Châm',
                emoji: '🌨️',
                cost: 35,
                title: 'Băng Châm Vũ (Mana: 35) - Mưa gai băng làm chậm 50% quái trong 6 giây, gây 120 sát thương'
            },
            {
                id: 'skill2',
                name: 'Băng Phong',
                emoji: '❄️',
                cost: 40,
                title: 'Băng Phong Vạn Lý (Mana: 40) - Đóng băng (choáng) toàn bộ quái trong 5 giây, gây 100 sát thương'
            },
            {
                id: 'skill3',
                name: 'Tuyết Loạn',
                emoji: '🌪️',
                cost: 50,
                title: 'Tuyết Loạn Cuồng Phong (Mana: 50) - Bão tuyết đẩy lùi quái về sau một đoạn, gây 250 sát thương'
            }
        ],
        gold_knight: [
            {
                id: 'skill1',
                name: 'Kim Tiền',
                emoji: '🪙',
                cost: 30,
                title: 'Kim Tiền Nhãn (Mana: 30) - Lập tức nhận 80G vàng để cứu nguy xây tháp'
            },
            {
                id: 'skill2',
                name: 'Hoàng Kim',
                emoji: '🔱',
                cost: 40,
                title: 'Hoàng Kim Giáp (Mana: 40) - Hồi phục 2 máu cho lâu đài chính ngay lập tức'
            },
            {
                id: 'skill3',
                name: 'Tài Lộc',
                emoji: '🎁',
                cost: 50,
                title: 'Tài Lộc Gõ Cửa (Mana: 50) - Nhân đôi lượng vàng rơi ra từ quái vật bị tiêu diệt trong 10 giây'
            }
        ]
    },

    // Vẽ động các nút kỹ năng trong HTML dựa trên Hero được chọn
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
    onDefeat: function() {
        this.stop();
        
        // Kích hoạt tiếng Defeat
        if (window.app && app.audio) app.audio.playDefeat();
        
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
    }
};

window.game = game;
