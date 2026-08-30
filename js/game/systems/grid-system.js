/**
 * GAME ENGINE - GRID & PATHFINDING SYSTEM
 */
(function(root) {
    'use strict';

    const GridSystem = {
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

    // Khởi tạo trò chơi,
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
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = GridSystem;
    if (typeof root !== 'undefined') root.GridSystem = GridSystem;
})(typeof window !== 'undefined' ? window : global);
