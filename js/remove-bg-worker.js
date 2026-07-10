self.onmessage = function(e) {
    const { imageData, width, height } = e.data;
    const data = imageData.data;
    
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
    
    // Trả về kết quả cho Main thread
    self.postMessage({ imageData }, [imageData.data.buffer]);
};
