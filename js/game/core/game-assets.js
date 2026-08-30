/**
 * GAME ENGINE - ASSET LOADER & BACKGROUND REMOVER
 */
(function(root) {
    'use strict';

    const GameAssets = {
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
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = GameAssets;
    if (typeof root !== 'undefined') root.GameAssets = GameAssets;
})(typeof window !== 'undefined' ? window : global);
