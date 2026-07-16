// Bộ quản lý sinh câu hỏi Toán lớp 6 ngẫu nhiên chuẩn 5 Chương Tập 1
// Hỗ trợ 3 cấp độ: Cơ bản (co-ban), Nâng cao (nang-cao), Khó (kho)

// Phòng thủ: Giả lập SweetAlert2 nếu chạy trong môi trường offline không nạp được CDN
if (typeof Swal === 'undefined') {
    window.Swal = {
        fire: function(options) {
            console.warn("SweetAlert2 không khả dụng, sử dụng Fallback Popup.");
            const oldPopup = document.getElementById("fallback-swal-popup");
            if (oldPopup) oldPopup.remove();
            
            const overlay = document.createElement("div");
            overlay.id = "fallback-swal-popup";
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100vw";
            overlay.style.height = "100vh";
            overlay.style.backgroundColor = "rgba(0,0,0,0.65)";
            overlay.style.zIndex = "999999";
            overlay.style.display = "flex";
            overlay.style.alignItems = "center";
            overlay.style.justifyContent = "center";
            overlay.style.backdropFilter = "blur(4px)";
            
            const box = document.createElement("div");
            box.style.backgroundColor = "#1e293b";
            box.style.color = "#ffffff";
            box.style.border = "1px solid #475569";
            box.style.borderRadius = "16px";
            box.style.padding = "2rem";
            box.style.maxWidth = options.customClass && options.customClass.popup === 'hero-select-popup' ? "580px" : "450px";
            box.style.width = "90%";
            box.style.boxShadow = "0 20px 25px -5px rgba(0,0,0,0.4)";
            box.style.textAlign = "center";
            box.style.fontFamily = "sans-serif";
            
            if (options.title) {
                const title = document.createElement("h3");
                title.innerText = options.title;
                title.style.marginTop = "0";
                title.style.marginBottom = "1rem";
                title.style.fontSize = "1.4rem";
                title.style.color = "#fbbf24";
                box.appendChild(title);
            }
            
            const content = document.createElement("div");
            content.innerHTML = options.html || options.text || "";
            box.appendChild(content);
            
            if (options.showConfirmButton !== false) {
                const btn = document.createElement("button");
                btn.innerText = options.confirmButtonText || "Đồng ý";
                btn.style.backgroundColor = options.confirmButtonColor || "#fbbf24";
                btn.style.color = "#000000";
                btn.style.border = "none";
                btn.style.padding = "10px 24px";
                btn.style.borderRadius = "8px";
                btn.style.fontWeight = "700";
                btn.style.marginTop = "1.5rem";
                btn.style.cursor = "pointer";
                btn.addEventListener("click", () => {
                    overlay.remove();
                    if (options.preConfirm) options.preConfirm();
                    if (typeof options.then === 'function') options.then();
                });
                box.appendChild(btn);
            }
            
            overlay.appendChild(box);
            document.body.appendChild(overlay);
            
            if (typeof options.didOpen === 'function') {
                setTimeout(() => { options.didOpen(); }, 50);
            }
            if (typeof options.willOpen === 'function') {
                setTimeout(() => { options.willOpen(); }, 20);
            }
            
            // Giả lập promise then
            const promiseResult = {
                then: function(callback) {
                    if (options.showConfirmButton === false) {
                        // Nếu tự đóng hoặc không hiện nút, không tự callback trừ khi đóng
                    } else {
                        // Gán callback để gọi khi click button
                        const originalClick = box.querySelector("button").onclick;
                        box.querySelector("button").addEventListener("click", () => {
                            callback({ isConfirmed: true });
                        });
                    }
                    return this;
                }
            };
            return promiseResult;
        },
        close: function() {
            const overlay = document.getElementById("fallback-swal-popup");
            if (overlay) overlay.remove();
        },
        getHtmlContainer: function() {
            const overlay = document.getElementById("fallback-swal-popup");
            if (overlay) {
                return overlay.querySelector("div");
            }
            return null;
        }
    };
}

// Hàm chuyển đổi tiếng Việt có dấu thành không dấu để đặt tên tệp an toàn
function removeVietnameseTones(str) {
    if (typeof str !== 'string') return '';
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|U|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}

const questions = {
    getApiUrl: function(path) {
        if (window.app && typeof window.app.getApiUrl === 'function') {
            return window.app.getApiUrl(path);
        }
        if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
            return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`;
        }
        return path;
    },
    currentQuestions: [],      // Danh sách câu hỏi của bài tập hiện tại
    currentQuestionIndex: 0,   // Câu hỏi hiện tại
    correctCount: 0,           // Số câu trả lời đúng
    selectedOption: null,      // Lựa chọn hiện tại
    hintsShown: 0,             // Số gợi ý đã xem ở câu hỏi này
    currentLesson: null,       // Bài học hiện tại đang làm bài tập
    hasChecked: false,         // Đã nhấn nút kiểm tra chưa
    isExamMode: false,         // Có phải đang làm bài thi cuối chương không
    currentLevel: 'co-ban',    // Cấp độ hiện tại của bài luyện tập
    examTimeRemaining: 900,    // 15 phút đếm ngược bài thi cuối chương (giây)
    examInterval: null,        // Bộ đếm thời gian
    practiceStartTime: 0,      // Thời gian bắt đầu làm bài
    practiceDistractions: 0,   // Số lần xao nhãng trong bài học hiện tại

    // Đối tượng quản lý tiến trình Siêu Anh Hùng (RPG)
    hero: {
        selectedId: null, // null | 'light_warrior' | 'frost_mage' | 'gold_knight'
        level: 1,
        xp: 0,
        nextLevelXp: 100,
        
        // Cấu hình các hero
        registry: {
            'light_warrior': {
                name: 'Chiến Binh Ánh Sáng',
                emoji: '⚔️',
                description: 'Tăng sức tấn công tháp canh (+15% sát thương + 5% mỗi cấp Hero)'
            },
            'frost_mage': {
                name: 'Pháp Sư Băng Giá',
                emoji: '❄️',
                description: 'Tăng tầm bắn tháp (+15% tầm bắn + 3% mỗi cấp) và làm chậm lâu hơn 20%'
            },
            'gold_knight': {
                name: 'Thần Tài Chiêu Lộc',
                emoji: '🪙',
                description: 'Giảm giá xây tháp 10% (+1% mỗi cấp) và nhận thêm 20% vàng (+4% mỗi cấp)'
            }
        },

        load: function() {
            try {
                const data = localStorage.getItem('td_hero_data');
                if (data) {
                    const parsed = JSON.parse(data);
                    if (parsed.selectedId && this.registry && this.registry[parsed.selectedId]) {
                        this.selectedId = parsed.selectedId;
                    } else {
                        this.selectedId = null;
                    }
                    this.level = parsed.level || 1;
                    this.xp = parsed.xp || 0;
                    this.nextLevelXp = parsed.nextLevelXp || 100;
                } else {
                    this.selectedId = null;
                }
            } catch (e) {
                console.error("Lỗi nạp dữ liệu Hero:", e);
                this.selectedId = null;
            }
        },

        save: function() {
            try {
                const data = {
                    selectedId: this.selectedId,
                    level: this.level,
                    xp: this.xp,
                    nextLevelXp: this.nextLevelXp
                };
                localStorage.setItem('td_hero_data', JSON.stringify(data));
            } catch (e) {
                console.error("Lỗi lưu dữ liệu Hero:", e);
            }
        },

        addXp: function(amount) {
            if (!this.selectedId) return;
            this.xp = Math.max(0, this.xp + amount);
            
            // Xử lý lên cấp
            let leveledUp = false;
            while (this.xp >= this.nextLevelXp) {
                this.xp -= this.nextLevelXp;
                this.level++;
                this.nextLevelXp = this.level * 100;
                leveledUp = true;
            }
            
            this.save();
            
            if (leveledUp) {
                // Hiển thị hiệu ứng chúc mừng lên cấp hoành tráng
                setTimeout(() => {
                    if (window.app && app.audio) app.audio.playVictory();
                    Swal.fire({
                        title: 'TĂNG CẤP ANH HÙNG! 🎉',
                        html: `<div style="font-size: 3.5rem; margin-bottom: 1rem;">${this.registry[this.selectedId].emoji}</div>
                               <p>Chúc mừng con! Siêu Anh Hùng <b>${this.registry[this.selectedId].name}</b> đã tăng lên <b>Cấp ${this.level}</b>!</p>
                               <p style="color:var(--success); font-weight:bold; margin-top:0.5rem;">Sức mạnh phòng thủ và khả năng của các tháp canh đã được nâng cấp vĩnh viễn!</p>`,
                        confirmButtonText: 'Tuyệt quá, tiếp tục thôi!',
                        confirmButtonColor: 'var(--success)',
                        target: document.getElementById('tab-practice') || 'body',
                        allowOutsideClick: false
                    });
                }, 800);
            }
        },

        downgrade: function() {
            if (!this.selectedId) return false;
            if (this.level > 1) {
                this.level--;
                this.xp = 0;
                this.nextLevelXp = this.level * 100;
                this.save();
                return true;
            }
            return false;
        }
    },

    currentSubtopic: null,         // Dạng bài tập hiện tại đang làm luyện tập
    isSubtopicPracticeMode: false,   // Có phải đang làm luyện tập theo dạng bài không
    isLessonExamMode: false,       // Có phải đang làm bài kiểm tra tổng thể bài học không
    isWeaknessPracticeMode: false, // Có phải đang làm luyện tập khắc phục điểm yếu không
    isExiting: false,              // Trạng thái đang thoát trắc nghiệm/game

    // Tìm ƯCLN
    gcd: function(a, b) {
        a = Math.round(Math.abs(Number(a) || 0));
        b = Math.round(Math.abs(Number(b) || 0));
        while (b) {
            let t = b;
            b = a % b;
            a = t;
        }
        return a || 1;
    },

    // Tìm BCNN
    lcm: function(a, b) {
        return Math.abs(a * b) / this.gcd(a, b);
    },

    // Phân tích ra thừa số nguyên tố
    factorize: function(n) {
        if (n <= 1) return n.toString();
        const factors = [];
        let temp = n;
        for (let i = 2; i <= Math.sqrt(n); i++) {
            let count = 0;
            while (temp % i === 0) {
                count++;
                temp /= i;
            }
            if (count > 0) {
                factors.push(count === 1 ? `${i}` : `${i}^${count}`);
            }
        }
        if (temp > 1) {
            factors.push(`${temp}`);
        }
        return factors.join(' \\cdot ');
    },

    // Kiểm tra số nguyên tố
    isPrime: function(num) {
        if (num <= 1) return false;
        for (let i = 2; i * i <= num; i++) {
            if (num % i === 0) return false;
        }
        return true;
    },

    // Lấy danh sách các ước nguyên tố phân biệt
    getUniquePrimeFactors: function(n) {
        const factors = new Set();
        let temp = n;
        for (let i = 2; i <= temp; i++) {
            if (this.isPrime(i) && temp % i === 0) {
                factors.add(i);
                while (temp % i === 0) {
                    temp /= i;
                }
            }
        }
        return Array.from(factors);
    },

    // Tìm các cặp ước nguyên tố
    findPrimeFactorPairs: function(n) {
        const pairs = new Set();
        for (let p1 = 2; p1 * p1 <= n; p1++) {
            if (this.isPrime(p1) && n % p1 === 0) {
                let p2 = n / p1;
                if (this.isPrime(p2)) {
                    if (p1 <= p2) {
                        pairs.add(`${p1},${p2}`);
                    } else {
                        pairs.add(`${p2},${p1}`);
                    }
                }
            }
        }
        if (this.isPrime(n)) {
            pairs.add(`${n},1`);
        }
        return Array.from(pairs);
    },

    // Bội chung nhỏ nhất của 3 số
    lcm3: function(a, b, c) {
        return this.lcm(this.lcm(a, b), c);
    },

    // Tổng các chữ số của một số
    sumDigits: function(n) {
        let sum = 0;
        let temp = Math.abs(n);
        while (temp) {
            sum += temp % 10;
            temp = Math.floor(temp / 10);
        }
        return sum;
    },

    // Rút gọn phân số
    simplify: function(num, den) {
        const g = this.gcd(num, den);
        let sNum = num / g;
        let sDen = den / g;
        if (sDen < 0) {
            sNum = -sNum;
            sDen = -sDen;
        }
        return { num: sNum, den: sDen };
    },

    // Hàm helper chống va chạm đáp án nhiễu trực tiếp
    SHIFT_IF_COLLIDE: function(val, ans, w1, w2) {
        if (val === undefined || val === null) return val;
        let isString = typeof val === 'string';
        let parsedVal = isString ? Number(val) : val;
        if (typeof parsedVal !== 'number' || isNaN(parsedVal)) {
            return val;
        }
        const toNum = (x) => {
            if (typeof x === 'string') return Number(x);
            return x;
        };
        const numAns = ans !== undefined ? toNum(ans) : undefined;
        const numW1 = w1 !== undefined ? toNum(w1) : undefined;
        const numW2 = w2 !== undefined ? toNum(w2) : undefined;

        const used = new Set();
        if (numAns !== undefined && !isNaN(numAns)) used.add(numAns);
        if (numW1 !== undefined && !isNaN(numW1)) used.add(numW1);
        if (numW2 !== undefined && !isNaN(numW2)) used.add(numW2);

        const diffs = [1, -1, 2, -2, 3, -3, 5, -5, 10, -10];
        let diffIdx = 0;
        let finalVal = parsedVal;
        while (used.has(finalVal) && diffIdx < diffs.length) {
            finalVal = parsedVal + diffs[diffIdx++];
        }

        if (isString) {
            if (val.includes('.')) {
                const decimalPlaces = val.split('.')[1].length;
                return finalVal.toFixed(decimalPlaces);
            }
            return finalVal.toString();
        }
        return finalVal;
    },

    // Sinh số ngẫu nhiên trong khoảng [min, max] trừ số 0
    randomInt: function(min, max, excludeZero = false) {
        let val = Math.floor(Math.random() * (max - min + 1)) + min;
        if (excludeZero && val === 0) {
            return this.randomInt(min, max, excludeZero);
        }
        return val;
    },

    // Tráo đổi ngẫu nhiên mảng
    shuffle: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },

    // Các hàm bổ trợ phân tích số học dùng cho template đề thi AI
    getPrimeFactors: function(n) {
        if (n <= 1) return [n.toString()];
        const factors = [];
        let temp = n;
        for (let i = 2; i <= Math.sqrt(n); i++) {
            let count = 0;
            while (temp % i === 0) {
                count++;
                temp /= i;
            }
            if (count > 0) {
                factors.push(count === 1 ? `${i}` : `${i}^${count}`);
            }
        }
        if (temp > 1) {
            factors.push(`${temp}`);
        }
        return factors;
    },

    getCommonPrimeFactors: function(a, b) {
        const fA = {};
        let temp = a;
        for (let i = 2; i <= temp; i++) {
            let count = 0;
            while (temp % i === 0) {
                count++;
                temp /= i;
            }
            if (count > 0) fA[i] = count;
        }
        const fB = {};
        temp = b;
        for (let i = 2; i <= temp; i++) {
            let count = 0;
            while (temp % i === 0) {
                count++;
                temp /= i;
            }
            if (count > 0) fB[i] = count;
        }
        const common = [];
        for (const prime in fA) {
            if (fB[prime]) {
                const minPower = Math.min(fA[prime], fB[prime]);
                common.push(minPower === 1 ? `${prime}` : `${prime}^${minPower}`);
            }
        }
        return common.length > 0 ? common : ["1"];
    },

    getCommonPrimeFactors3: function(a, b, c) {
        const fA = {};
        let temp = a;
        for (let i = 2; i <= temp; i++) {
            let count = 0;
            while (temp % i === 0) {
                count++;
                temp /= i;
            }
            if (count > 0) fA[i] = count;
        }
        const fB = {};
        temp = b;
        for (let i = 2; i <= temp; i++) {
            let count = 0;
            while (temp % i === 0) {
                count++;
                temp /= i;
            }
            if (count > 0) fB[i] = count;
        }
        const fC = {};
        temp = c;
        for (let i = 2; i <= temp; i++) {
            let count = 0;
            while (temp % i === 0) {
                count++;
                temp /= i;
            }
            if (count > 0) fC[i] = count;
        }
        const common = [];
        for (const prime in fA) {
            if (fB[prime] && fC[prime]) {
                const minPower = Math.min(fA[prime], fB[prime], fC[prime]);
                common.push(minPower === 1 ? `${prime}` : `${prime}^${minPower}`);
            }
        }
        return common.length > 0 ? common : ["1"];
    },

    getDivisors: function(n) {
        const divs = [];
        for (let i = 1; i <= n; i++) {
            if (n % i === 0) {
                divs.push(i);
            }
        }
        return divs;
    },

    evalExpression: function(expr, context) {
        if (typeof expr !== 'string') {
            return expr;
        }

        const self = this;

        // Self-healing: Loại bỏ tiền tố variables. và formulas. và this. thường bị AI sinh nhầm
        let cleanedExpr = expr.replace(/\b(variables|formulas|this)\./g, '');
        // Self-healing: Loại bỏ dấu ngoặc nhọn quanh các tên biến đơn giản trong công thức
        cleanedExpr = cleanedExpr.replace(/\{([a-zA-Z0-9_]+)\}/g, '$1');

        // Self-healing: Thay thế hàm gcd đệ quy cục bộ của AI bằng hàm gcd an toàn của hệ thống
        cleanedExpr = cleanedExpr.replace(/\(function\s+gcd\s*\([^)]*\)\s*\{\s*return\s+[^}]*\}\)/g, 'gcd');

        // Self-healing: thay thế .values().join(...) thành Array.from(...).join(...)
        cleanedExpr = cleanedExpr.replace(/([a-zA-Z0-9_$]+)\.values\(\)\.join\(/g, 'Array.from($1.values()).join(');

        // Self-healing: thay thế vòng lặp tìm ước thành getDivisors
        cleanedExpr = cleanedExpr.replace(/\(\(\)\s*=>\s*\{\s*let\s+(\w+)\s*=\s*\[\]\s*;\s*for\s*\(\s*let\s+(\w+)\s*=\s*1\s*;\s*\2\s*<=\s*([a-zA-Z0-9_$]+)\s*;\s*\2\+\+\s*\)\s*\{\s*if\s*\(\s*\3\s*%\s*\2\s*===\s*0\s*\)\s*\1\.push\(\2\)\s*;\s*\}\s*return\s*\1\s*;\s*\}\)\(\)/g, 'getDivisors($3)');

        let trimmed = cleanedExpr.trim();
        // Phòng thủ: Phát hiện các từ đơn hoặc cụm từ tiếng Việt thuần túy không bọc nháy do AI sinh lỗi
        const isPlainWord = /^[a-zA-Z0-9đàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ\s\.\,\_]+$/i.test(trimmed);
        if (isPlainWord) {
            // Nếu không phải là số và không trùng với bất kỳ tên biến hay helper
            const isNumber = !isNaN(Number(trimmed));
            const hasKey = context ? (trimmed in context) : false;
            const helpersKeys = ['Math', 'parseInt', 'parseFloat', 'isNaN', 'gcd', 'lcm', 'ƯCLN', 'BCNN', 'ucln', 'bcnn', 'isPrime', 'getUniquePrimeFactors', 'findPrimeFactorPairs', 'simplify', 'getDivisors', 'lcm3', 'sumDigits', 'SHIFT_IF_COLLIDE', 'true', 'false', 'null', 'undefined'];
            if (!isNumber && !hasKey && !helpersKeys.includes(trimmed)) {
                return trimmed; // Trả về trực tiếp chuỗi chữ!
            }
        }

        // Nếu biểu thức bắt đầu bằng function và kết thúc bằng ) (IIFE ẩn danh bị thiếu ngoặc)
        if (trimmed.startsWith('function') && trimmed.endsWith(')')) {
            cleanedExpr = '(' + cleanedExpr + ')';
        }

        // Loại bỏ dấu chấm phẩy ở cuối để tránh lỗi cú pháp khi bọc trong biểu thức trả về
        cleanedExpr = cleanedExpr.trim();
        if (cleanedExpr.endsWith(';')) {
            cleanedExpr = cleanedExpr.slice(0, -1).trim();
        }

        // Hàm helper để làm tròn số thực phòng ngừa sai số floating-point
        const roundFloat = (val) => {
            if (typeof val === 'number' && !Number.isInteger(val)) {
                const str = val.toString();
                if (str.includes('000000') || str.includes('999999')) {
                    val = Math.round(val * 100000) / 100000;
                }
                if (Math.abs(val - Math.round(val)) < 1e-9) {
                    val = Math.round(val);
                }
            }
            return val;
        };

        try {
            // Sử dụng Object.create để tránh kích hoạt sớm các Getter trong context
            const ctx = Object.create(context || {});
            // Định nghĩa các helper toán học trực tiếp trên ctx che đi prototype
            const helpers = {
                this: context,
                Math: Math,
                parseInt: parseInt,
                parseFloat: parseFloat,
                isNaN: isNaN,
                gcd: (a, b) => self.gcd(a, b),
                lcm: (a, b) => self.lcm(a, b),
                ƯCLN: (a, b) => self.gcd(a, b),
                BCNN: (a, b) => self.lcm(a, b),
                ucln: (a, b) => self.gcd(a, b),
                bcnn: (a, b) => self.lcm(a, b),
                isPrime: (n) => self.isPrime(n),
                getUniquePrimeFactors: (n) => self.getUniquePrimeFactors(n),
                findPrimeFactorPairs: (n) => self.findPrimeFactorPairs(n),
                simplify: (num, den) => self.simplify(num, den),
                getDivisors: (n) => self.getDivisors(n),
                lcm3: (a, b, c) => self.lcm3(a, b, c),
                sumDigits: (n) => self.sumDigits(n),
                SHIFT_IF_COLLIDE: (val, ans, w1, w2) => self.SHIFT_IF_COLLIDE(val, ans, w1, w2)
            };

            for (const [key, val] of Object.entries(helpers)) {
                Object.defineProperty(ctx, key, {
                    value: val,
                    writable: true,
                    configurable: true,
                    enumerable: true
                });
            }
            
            // Biên dịch và chạy biểu thức trong khối with(ctx)
            const fn = new Function('ctx', `with(ctx) { return (${cleanedExpr}); }`);
            const res = fn(ctx);
            return roundFloat(res);
        } catch (e) {
            // Fallback sang safeEval nếu new Function gặp lỗi cú pháp (ví dụ: bị chặn bởi CSP)
            try {
                const res = this.safeEval(cleanedExpr, context);
                return roundFloat(res);
            } catch (err) {
                console.error("Error evaluating expression:", expr, e);
                return null;
            }
        }
    },

    safeEval: function(expr, context) {
        const self = this;
        // Sử dụng prototypal inheritance thay cho spread để tránh trigger trước các getter
        const ctx = Object.create(context);
        const helpers = {
            Math: Math,
            parseInt: parseInt,
            parseFloat: parseFloat,
            isNaN: isNaN,
            this: ctx
        };

        for (const [key, val] of Object.entries(helpers)) {
            Object.defineProperty(ctx, key, {
                value: val,
                writable: true,
                configurable: true,
                enumerable: true
            });
        }

        // Tokenizer
        const tokens = [];
        // Fixed regex: bổ sung toán tử so sánh '<' và '>' vốn bị thiếu ở bản cũ
        const regex = /\s*(?:(\d+(?:\.\d+)?)|([a-zA-Z_$][a-zA-Z0-9_$]*)|(===|!==|==|!=|<=|>=|<|>|&&|\|\||\.\.\.|=>|[\+\-\*\/%\(\)\,\!\?\:\[\]\{\}\;\=\.])|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"))/g;
        let match;
        while ((match = regex.exec(expr)) !== null) {
            if (match[1] !== undefined) {
                tokens.push({ type: 'NUMBER', value: parseFloat(match[1]) });
            } else if (match[2] !== undefined) {
                tokens.push({ type: 'IDENTIFIER', value: match[2] });
            } else if (match[3] !== undefined) {
                tokens.push({ type: 'OPERATOR', value: match[3] });
            } else if (match[4] !== undefined) {
                tokens.push({ type: 'STRING', value: match[4].slice(1, -1) });
            }
        }

        let tokenIdx = 0;
        function peek() {
            return tokens[tokenIdx];
        }
        function consume(expectedValue) {
            const tok = tokens[tokenIdx];
            if (!tok) {
                throw new Error("Unexpected end of expression");
            }
            if (expectedValue !== undefined && tok.value !== expectedValue) {
                throw new Error("Expected token " + expectedValue + " but got " + tok.value);
            }
            tokenIdx++;
            return tok;
        }

        // Đánh giá danh sách các token con (cho filter hoặc sub-scope)
        function evalSubTokens(subToks, subCtx) {
            const res = self.safeEvalTokens(subToks, subCtx);
            return res;
        }

        // Xử lý IIFE: (() => { statements })()
        const first = tokens[0];
        const second = tokens[1];
        if (first && first.value === '(' && second && second.value === '(') {
            // Kiểm tra xem có phải cấu trúc IIFE: (() => { ... })()
            let isIIFE = false;
            let arrowIdx = -1;
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i].value === '=>') {
                    isIIFE = true;
                    arrowIdx = i;
                    break;
                }
            }

            if (isIIFE) {
                // Parse IIFE
                tokenIdx = arrowIdx + 1; // Nhảy qua '=>'
                consume('{');
                
                const localScope = Object.create(ctx);
                let result = null;
                
                // Đọc các câu lệnh phân tách bằng dấu chấm phẩy
                while (peek() && peek().value !== '}') {
                    const next = peek();
                    if (next.type === 'IDENTIFIER' && (next.value === 'const' || next.value === 'let' || next.value === 'var')) {
                        consume(); // const/let/var
                        const varName = consume().value;
                        consume('=');
                        
                        // Lấy các token biểu thức cho tới khi gặp ';'
                        const exprToks = [];
                        while (peek() && peek().value !== ';') {
                            exprToks.push(consume());
                        }
                        if (peek() && peek().value === ';') consume(';');
                        
                        localScope[varName] = evalSubTokens(exprToks, localScope);
                    } else if (next.type === 'IDENTIFIER' && next.value === 'return') {
                        consume('return');
                        const exprToks = [];
                        // Lấy các token cho tới khi gặp ';' hoặc kết thúc khối '}'
                        while (peek() && peek().value !== ';' && peek().value !== '}') {
                            exprToks.push(consume());
                        }
                        if (peek() && peek().value === ';') consume(';');
                        result = evalSubTokens(exprToks, localScope);
                    } else {
                        // Bỏ qua các token không hợp lệ khác
                        consume();
                    }
                }
                return result;
            }
        }

        return this.safeEvalTokens(tokens, ctx);
    },

    safeEvalTokens: function(tokens, ctx) {
        let tokenIdx = 0;
        const self = this;

        function peek() {
            return tokens[tokenIdx];
        }
        function consume(expectedValue) {
            const tok = tokens[tokenIdx];
            if (!tok) {
                throw new Error("Unexpected end of expression");
            }
            if (expectedValue !== undefined && tok.value !== expectedValue) {
                throw new Error("Expected token " + expectedValue + " but got " + tok.value);
            }
            tokenIdx++;
            return tok;
        }

        function parseTernary(skip) {
            let left = parseLogicalOr(skip);
            const tok = peek();
            if (tok && tok.type === 'OPERATOR' && tok.value === '?') {
                consume('?');
                let middle = parseTernary(skip || !left);
                consume(':');
                let right = parseTernary(skip || !!left);
                return skip ? null : (left ? middle : right);
            }
            return skip ? null : left;
        }

        function parseLogicalOr(skip) {
            let left = parseLogicalAnd(skip);
            let tok = peek();
            while (tok && tok.type === 'OPERATOR' && tok.value === '||') {
                consume('||');
                let right = parseLogicalAnd(skip || !!left);
                if (!skip) left = left || right;
                tok = peek();
            }
            return left;
        }

        function parseLogicalAnd(skip) {
            let left = parseEquality(skip);
            let tok = peek();
            while (tok && tok.type === 'OPERATOR' && tok.value === '&&') {
                consume('&&');
                let right = parseEquality(skip || !left);
                if (!skip) left = left && right;
                tok = peek();
            }
            return left;
        }

        function parseEquality(skip) {
            let left = parseRelational(skip);
            let tok = peek();
            while (tok && tok.type === 'OPERATOR' && (tok.value === '===' || tok.value === '!==' || tok.value === '==' || tok.value === '!=')) {
                const op = consume().value;
                let right = parseRelational(skip);
                if (!skip) {
                    if (op === '===') left = left === right;
                    else if (op === '!==' || op === '!==') left = left !== right;
                    else if (op === '==') left = left == right;
                    else if (op === '!=') left = left != right;
                }
                tok = peek();
            }
            return left;
        }

        function parseRelational(skip) {
            let left = parseAdditive(skip);
            let tok = peek();
            while (tok && tok.type === 'OPERATOR' && (tok.value === '<' || tok.value === '>' || tok.value === '<=' || tok.value === '>=')) {
                const op = consume().value;
                let right = parseAdditive(skip);
                if (!skip) {
                    if (op === '<') left = left < right;
                    else if (op === '>') left = left > right;
                    else if (op === '<=') left = left <= right;
                    else if (op === '>=') left = left >= right;
                }
                tok = peek();
            }
            return left;
        }

        function parseAdditive(skip) {
            let left = parseMultiplicative(skip);
            let tok = peek();
            while (tok && tok.type === 'OPERATOR' && (tok.value === '+' || tok.value === '-')) {
                const op = consume().value;
                let right = parseMultiplicative(skip);
                if (!skip) {
                    if (op === '+') left = left + right;
                    else if (op === '-') left = left - right;
                }
                tok = peek();
            }
            return left;
        }

        function parseMultiplicative(skip) {
            let left = parseUnary(skip);
            let tok = peek();
            while (tok && tok.type === 'OPERATOR' && (tok.value === '*' || tok.value === '/' || tok.value === '%')) {
                const op = consume().value;
                let right = parseUnary(skip);
                if (!skip) {
                    if (op === '*') left = left * Math.round(right * 1000000) / 1000000;
                    else if (op === '/') {
                        if (right === 0) {
                            throw new Error("Division by zero");
                        }
                        left = left / right;
                    }
                    else if (op === '%') {
                        if (right === 0) {
                            throw new Error("Modulo by zero");
                        }
                        left = left % right;
                    }
                }
                tok = peek();
            }
            return left;
        }

        function parseUnary(skip) {
            let tok = peek();
            if (tok && tok.type === 'OPERATOR' && (tok.value === '-' || tok.value === '!')) {
                const op = consume().value;
                let right = parseUnary(skip);
                if (skip) return 0;
                if (op === '-') return -right;
                if (op === '!') return !right;
            }
            return parsePrimary(skip);
        }

        function parsePrimary(skip) {
            let tok = consume();
            if (tok.type === 'NUMBER' || tok.type === 'STRING') {
                return skip ? 0 : tok.value;
            }

            if (tok.type === 'IDENTIFIER') {
                const name = tok.value;
                let val;
                let hasResolved = false;

                // Xử lý từ khóa new
                if (name === 'new') {
                    const className = consume().value;
                    consume('(');
                    const args = [];
                    if (peek().value !== ')') {
                        args.push(parseTernary(skip));
                        while (peek() && peek().value === ',') {
                            consume(',');
                            args.push(parseTernary(skip));
                        }
                    }
                    consume(')');
                    hasResolved = true;
                    if (!skip) {
                        if (className === 'Set') {
                            val = new Set(...args);
                        } else if (className === 'Map') {
                            val = new Map(...args);
                        } else {
                            throw new Error("Unsupported class for new operator: " + className);
                        }
                    }
                } else if (name === 'Array') {
                    // Hỗ trợ Array.from(...)
                    consume('.');
                    const methodName = consume().value;
                    consume('(');
                    const args = [];
                    if (peek().value !== ')') {
                        args.push(parseTernary(skip));
                        while (peek() && peek().value === ',') {
                            consume(',');
                            args.push(parseTernary(skip));
                        }
                    }
                    consume(')');
                    hasResolved = true;
                    if (!skip) {
                        if (methodName === 'from') {
                            val = Array.from(...args);
                        } else {
                            throw new Error("Unsupported Array method: " + methodName);
                        }
                    }
                } else if (name === 'Math') {
                    consume('.');
                    const methodName = consume().value;
                    consume('(');
                    const args = [];
                    if (peek().value !== ')') {
                        let isSpread = false;
                        if (peek().value === '...') {
                            consume('...');
                            isSpread = true;
                        }
                        const argVal = parseTernary(skip);
                        if (!skip) {
                            if (isSpread && Array.isArray(argVal)) {
                                args.push(...argVal);
                            } else {
                                args.push(argVal);
                            }
                        }

                        while (peek() && peek().value === ',') {
                            consume(',');
                            let isInnerSpread = false;
                            if (peek().value === '...') {
                                consume('...');
                                isInnerSpread = true;
                            }
                            const innerArgVal = parseTernary(skip);
                            if (!skip) {
                                if (isInnerSpread && Array.isArray(innerArgVal)) {
                                    args.push(...innerArgVal);
                                } else {
                                    args.push(innerArgVal);
                                }
                            }
                        }
                    }
                    consume(')');
                    hasResolved = true;
                    if (!skip) {
                        if (typeof Math[methodName] !== 'function') {
                            throw new Error("Math method " + methodName + " is not a function");
                        }
                        val = Math[methodName].apply(null, args);
                    }
                } else if (peek() && peek().value === '(') {
                    // Gọi hàm helper trực tiếp
                    consume('(');
                    const args = [];
                    if (peek().value !== ')') {
                        args.push(parseTernary(skip));
                        while (peek() && peek().value === ',') {
                            consume(',');
                            args.push(parseTernary(skip));
                        }
                    }
                    consume(')');
                    hasResolved = true;
                    if (!skip) {
                        if (typeof ctx[name] === 'function') {
                            val = ctx[name].apply(ctx, args);
                        } else if (typeof self[name] === 'function') {
                            val = self[name].apply(self, args);
                        } else {
                            throw new Error("Function " + name + " is not defined");
                        }
                    }
                }

                if (!hasResolved) {
                    val = ctx[name];
                }

                // Vòng lặp phân tích chuỗi thuộc tính hoặc phương thức liên tiếp (ví dụ: a.b.c hoặc a.filter(...).length)
                while (peek() && (peek().value === '.' || peek().value === '[')) {
                    if (peek().value === '.') {
                        consume('.');
                        const prop = consume().value;
                        if (skip) continue;

                        if (prop === 'filter' && peek() && peek().value === '(') {
                            consume('(');
                            const paramTok = consume(); // x
                            consume('=>');
                            
                            const filterTokens = [];
                            let parenCount = 1;
                            while (parenCount > 0) {
                                const t = consume();
                                if (t.value === '(') parenCount++;
                                if (t.value === ')') parenCount--;
                                if (parenCount > 0) filterTokens.push(t);
                            }

                            if (Array.isArray(val)) {
                                val = val.filter(item => {
                                    const subCtx = Object.create(ctx);
                                    subCtx[paramTok.value] = item;
                                    return self.safeEvalTokens(filterTokens, subCtx);
                                });
                            }
                        } else if (val !== undefined && val !== null && typeof val === 'object' && prop in val) {
                            if (peek() && peek().value === '(') {
                                consume('(');
                                const args = [];
                                if (peek().value !== ')') {
                                    args.push(parseTernary(skip));
                                    while (peek() && peek().value === ',') {
                                        consume(',');
                                        args.push(parseTernary(skip));
                                    }
                                }
                                consume(')');
                                if (!skip) {
                                    if (typeof val[prop] === 'function') {
                                        val = val[prop].apply(val, args);
                                    } else {
                                        throw new Error(prop + " is not a function on object");
                                    }
                                }
                            } else {
                                if (!skip) {
                                    val = val[prop];
                                }
                            }
                        } else if (val && prop === 'length' && Array.isArray(val)) {
                            val = val.length;
                        } else {
                            val = undefined;
                        }
                    } else if (peek().value === '[') {
                        consume('[');
                        const indexVal = parseTernary(skip);
                        consume(']');
                        if (!skip && val !== undefined && val !== null) {
                            val = val[indexVal];
                        }
                    }
                }

                return skip ? 0 : val;
            }

            if (tok.type === 'OPERATOR' && tok.value === '(') {
                let val = parseTernary(skip);
                consume(')');
                return val;
            }

            if (tok.type === 'OPERATOR' && tok.value === '[') {
                const arr = [];
                if (peek().value !== ']') {
                    arr.push(parseTernary(skip));
                    while (peek() && peek().value === ',') {
                        consume(',');
                        arr.push(parseTernary(skip));
                    }
                }
                consume(']');
                return skip ? [] : arr;
            }

            throw new Error("Unexpected token: " + tok.value);
        }

        return parseTernary(false);
    },

    generateQuestionFromTemplate: function(tempQ) {
        if (!tempQ || !tempQ.isTemplate) return tempQ;
        
        let context = {};
        let attempts = 0;
        const maxAttempts = 200;
        let constraintsPassed = false;
        
        const self = this;
        // Hàm helper để thay thế các placeholder {varName} hoặc {formulaName} hoặc biểu thức dynamic
        function replacePlaceholders(str, localContext) {
            if (typeof str !== 'string') return str;
            let prev;
            let limit = 5;
            do {
                prev = str;
                
                // Bảo vệ LaTeX trước khi xử lý placeholder
                // 1. Phân số \frac{a}{b}
                str = str.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, (match, num, den) => {
                    const trimNum = num.trim();
                    const trimDen = den.trim();
                    const numVal = localContext.hasOwnProperty(trimNum) ? localContext[trimNum] : trimNum;
                    const denVal = localContext.hasOwnProperty(trimDen) ? localContext[trimDen] : trimDen;
                    return `\\frac__LTX_OPEN__${numVal}__LTX_CLOSE____LTX_OPEN__${denVal}__LTX_CLOSE__`;
                });
                
                // 2. Lũy thừa a^{b}
                str = str.replace(/([a-zA-Z0-9_\$]+)\^\{([^{}]+)\}/g, (match, base, exp) => {
                    const trimmed = exp.trim();
                    const expVal = localContext.hasOwnProperty(trimmed) ? localContext[trimmed] : trimmed;
                    return `${base}^__LTX_OPEN__${expVal}__LTX_CLOSE__`;
                });
                
                // 3. Các lệnh LaTeX khác dạng \cmd{args} (như \widehat, \vec, \overline, \text...)
                str = str.replace(/(\\[a-zA-Z]+)\{([^{}]+)\}/g, (match, cmd, content) => {
                    const trimmed = content.trim();
                    const contentVal = localContext.hasOwnProperty(trimmed) ? localContext[trimmed] : trimmed;
                    return `${cmd}__LTX_OPEN__${contentVal}__LTX_CLOSE__`;
                });

                // Self-healing: loại bỏ dấu $ dư thừa trước và sau các placeholder dạng ${varName}$ hoặc ${varName}
                str = str.replace(/\$\{([^{}]+)\}\$/g, '{$1}');
                str = str.replace(/\$\{([^{}]+)\}/g, '{$1}');

                // Xử lý các placeholder thực sự
                str = str.replace(/\{([^{}]+)\}/g, (match, p1) => {
                    const trimmed = p1.trim();
                    if (localContext.hasOwnProperty(trimmed)) {
                        const val = localContext[trimmed];
                        if (typeof val !== 'function') {
                            return val;
                        }
                    }
                    
                    // Lọc bỏ LaTeX và văn bản tiếng Việt để tránh eval lỗi
                    if (/[$\\#^[\]~]/.test(trimmed) || trimmed.includes('\\') || (/[a-zA-Z]/.test(trimmed) && /[đàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/i.test(trimmed) && !trimmed.includes('ƯCLN') && !trimmed.includes('BCNN') && !trimmed.includes('ucln') && !trimmed.includes('bcnn'))) {
                        return match;
                    }

                    // Chỉ eval nếu biểu thức có tham chiếu đến ít nhất một biến trong context
                    const words = trimmed.match(/[a-zA-Z_][a-zA-Z0-9_]*/g);
                    const hasVar = words && words.some(w => localContext.hasOwnProperty(w));
                    if (!hasVar) {
                        return match;
                    }

                    // Thử eval biểu thức động
                    try {
                        const evalResult = self.evalExpression(trimmed, localContext);
                        if (evalResult !== null && evalResult !== undefined && typeof evalResult !== 'function') {
                            return evalResult;
                        }
                    } catch (e) {}
                    return match;
                });

                // Khôi phục lại ngoặc nhọn của LaTeX
                str = str.replace(/__LTX_OPEN__/g, '{').replace(/__LTX_CLOSE__/g, '}');
                // Dọn dẹp dấu ngoặc nhọn thừa bao quanh các chữ cái in hoa (tên điểm, đoạn thẳng, góc hình học)
                str = str.replace(/\{([A-Z]+)\}/g, '$1');
                
                limit--;
            } while (str !== prev && limit > 0);
            return str;
        }

        while (!constraintsPassed && attempts < maxAttempts) {
            attempts++;
            context = {};
            
            // 1. Sinh ngẫu nhiên các biến
            if (tempQ.variables) {
                for (const [varName, varDef] of Object.entries(tempQ.variables)) {
                    if (varDef && varDef.hasOwnProperty('fixed')) {
                        context[varName] = varDef.fixed;
                        continue;
                    }
                    if (varDef && varDef.hasOwnProperty('value')) {
                        context[varName] = varDef.value;
                        continue;
                    }
                    if (varDef && varDef.hasOwnProperty('options') && Array.isArray(varDef.options)) {
                        const idx = Math.floor(Math.random() * varDef.options.length);
                        context[varName] = varDef.options[idx];
                        continue;
                    }
                    const min = varDef.min !== undefined ? varDef.min : 0;
                    const max = varDef.max !== undefined ? varDef.max : 0;
                    const step = varDef.step || 1;
                    
                    const stepsCount = Math.floor((max - min) / step);
                    const randomStep = Math.floor(Math.random() * (stepsCount + 1));
                    const val = min + randomStep * step;
                    context[varName] = val;
                }
            }
            
            // 2. Định nghĩa các công thức dưới dạng Getter động để giải quyết triệt để lỗi thứ tự khai báo
            if (tempQ.formulas) {
                for (const [formName, formExpr] of Object.entries(tempQ.formulas)) {
                    Object.defineProperty(context, formName, {
                        get: function() {
                            if (('_cache_' + formName) in this) {
                                return this['_cache_' + formName];
                            }
                            this['_cache_' + formName] = null;
                            const res = self.evalExpression(formExpr, this);
                            this['_cache_' + formName] = res;
                            return res;
                        },
                        configurable: true,
                        enumerable: true
                    });
                }
            }

            // Tự động phân tích các constraints dạng đẳng thức để tính toán biến phụ thuộc
            if (tempQ.constraints) {
                for (const constraint of tempQ.constraints) {
                    if (typeof constraint === 'string') {
                        const parts = constraint.split('===');
                        if (parts.length === 2) {
                            const left = parts[0].trim();
                            const right = parts[1].trim();
                            
                            if (tempQ.variables.hasOwnProperty(left)) {
                                const val = self.evalExpression(right, context);
                                if (val !== null && val !== undefined) {
                                    context[left] = val;
                                }
                            } else if (tempQ.variables.hasOwnProperty(right)) {
                                const val = self.evalExpression(left, context);
                                if (val !== null && val !== undefined) {
                                    context[right] = val;
                                }
                            }
                        }
                    }
                }
            }

            // 3. Kiểm tra các ràng buộc (lúc này context đã có đầy đủ variables và formulas)
            constraintsPassed = true;
            if (tempQ.constraints && tempQ.constraints.length > 0) {
                // Nếu số lần thử vượt quá 120, ta bỏ qua các constraints chia hết phức tạp để tránh sập luồng
                let activeConstraints = tempQ.constraints;
                if (attempts > 120) {
                    activeConstraints = tempQ.constraints.filter(c => !c.includes('%') && !c.includes('/') && !c.includes('*'));
                }
                for (const constraint of activeConstraints) {
                    if (!this.evalExpression(constraint, context)) {
                        constraintsPassed = false;
                        break;
                    }
                }
            }

            // 3.4. Bộ lọc Heuristic: Ép kết quả nguyên cho đại lượng rời rạc
            if (constraintsPassed) {
                const isDiscrete = /học sinh|người|bạn|quyển sách|trang|gói|hộp|sản phẩm|xe|đồ chơi|lon|chiếc|đồng|tờ|vé|cái bánh|quả/i.test(tempQ.questionText);
                const isFractionOrStats = /phan-so|fraction|c10|c11|c12|c13|lt-c6|lt-c8|lt-c9|bai-31|bai-39|bai-40|bai-41|bai-42|bai-43|kt-c9/i.test(tempQ.type || '');
                if (isDiscrete && !isFractionOrStats) {
                    // Kiểm tra các giá trị đáp án chính và đáp án nhiễu có bị lẻ không
                    const ansVal = context.ans;
                    const w1Val = context.w1;
                    const w2Val = context.w2;
                    const w3Val = context.w3;
                    
                    let hasFraction = false;
                    if (typeof ansVal === 'number' && !Number.isInteger(ansVal)) hasFraction = true;
                    if (typeof w1Val === 'number' && !Number.isInteger(w1Val)) hasFraction = true;
                    if (typeof w2Val === 'number' && !Number.isInteger(w2Val)) hasFraction = true;
                    if (typeof w3Val === 'number' && !Number.isInteger(w3Val)) hasFraction = true;
                    
                    // Kiểm tra một số biến phụ quan trọng trong formulas
                    for (const [key, val] of Object.entries(context)) {
                        if (typeof val === 'number' && !Number.isInteger(val)) {
                            const lkey = key.toLowerCase();
                            if (lkey.includes('page') || lkey.includes('prod') || lkey.includes('people') || lkey.includes('student') || lkey.includes('remaining') || lkey.includes('count') || lkey.includes('cost') || lkey.includes('amount')) {
                                hasFraction = true;
                                break;
                            }
                        }
                    }
                    
                    if (hasFraction && attempts < 100) {
                        constraintsPassed = false; // Ưu tiên sinh lại bộ số nguyên trong 100 lần đầu để tránh sập luồng
                    }
                }
            }

            // 3.5. Kiểm tra trùng lặp đáp án trong options
            if (constraintsPassed && tempQ.options) {
                let renderedOpts = tempQ.options.map(opt => replacePlaceholders(opt, context));
                let optContents = renderedOpts.map(opt => {
                    // Loại bỏ thứ tự đáp án ở đầu (ví dụ: A. B. C. D. hoặc A) B) C) D))
                    const content = opt.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim();
                    // Loại bỏ khoảng trắng, ký hiệu $, LaTeX, dấu câu để so sánh chính xác nội dung
                    return content.replace(/[\$\s\{\}\\\,\_\'\"]/g, "").toLowerCase();
                });

                let uniqueOpts = new Set(optContents);
                if (uniqueOpts.size < optContents.length) {
                    if (attempts > 120) {
                        // Tự phục hồi: phát hiện trùng lặp, chỉnh nhẹ giá trị các phương án nhiễu
                        const diffs = [1, -1, 2, -2, 3, -3, 5, -5, 10, -10];
                        let diffIdx = 0;
                        const usedVals = new Set();
                        
                        const ansVal = context.ans;
                        if (ansVal !== undefined) {
                            usedVals.add(ansVal);
                        }

                        // Tìm các key nhiễu trong formulas bắt đầu bằng 'w' hoặc 'dist' hoặc 'opt'
                        const distractorKeys = Object.keys(tempQ.formulas || {}).filter(k => 
                            k !== 'ans' && 
                            (k.startsWith('w') || k.includes('dist') || k.startsWith('opt'))
                        );

                        const currentVals = {};
                        distractorKeys.forEach(k => {
                            currentVals[k] = context[k];
                        });

                        distractorKeys.forEach(wKey => {
                            let val = currentVals[wKey];
                            let isString = typeof val === 'string';
                            let parsedVal = isString ? Number(val) : val;

                            if (typeof parsedVal === 'number' && !isNaN(parsedVal)) {
                                while ((usedVals.has(parsedVal) || (ansVal !== undefined && parsedVal === ansVal)) && diffIdx < diffs.length) {
                                    parsedVal = parsedVal + diffs[diffIdx++];
                                }

                                let finalVal = parsedVal;
                                if (isString) {
                                    if (typeof val === 'string' && val.includes('.')) {
                                        const decimalPlaces = val.split('.')[1].length;
                                        finalVal = parsedVal.toFixed(decimalPlaces);
                                    } else {
                                        finalVal = parsedVal.toString();
                                    }
                                }

                                delete context[wKey];
                                context[wKey] = finalVal;
                                usedVals.add(parsedVal);
                            }
                        });

                        renderedOpts = tempQ.options.map(opt => replacePlaceholders(opt, context));
                        optContents = renderedOpts.map(opt => {
                            const content = opt.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim();
                            return content.replace(/[\$\s\{\}\\\,\_\'\"]/g, "").toLowerCase();
                        });
                        uniqueOpts = new Set(optContents);

                        if (uniqueOpts.size === optContents.length) {
                            constraintsPassed = true; // Phục hồi thành công!
                        } else {
                            constraintsPassed = false;
                        }
                    } else {
                        constraintsPassed = false; // Phát hiện trùng lặp, ép sinh lại bộ số mới
                    }
                }
            }
        }
        
        if (!constraintsPassed) {
            throw new Error("Không thể sinh câu hỏi thỏa mãn các ràng buộc hoặc loại bỏ trùng lặp đáp án sau " + maxAttempts + " lần thử.");
        }
        
        // Đóng băng (evaluate) tất cả các công thức trong context thành giá trị tĩnh trước khi sử dụng
        if (tempQ.formulas) {
            for (const formName of Object.keys(tempQ.formulas)) {
                const val = context[formName];
                delete context[formName];
                context[formName] = val;
            }
        }
        
        // 4. Tạo câu hỏi thực tế và tự động xáo trộn các phương án lựa chọn để tránh lỗi đáp án luôn là B
        let renderedOptions = tempQ.options ? tempQ.options.map(opt => replacePlaceholders(opt, context)) : [];
        let finalCorrectIndex = tempQ.correctIndex !== undefined ? parseInt(tempQ.correctIndex, 10) : 0;
        if (isNaN(finalCorrectIndex)) finalCorrectIndex = 0;

        if (renderedOptions.length > 0) {
            const oldCorrectIndex = finalCorrectIndex;
            const cleanOptions = renderedOptions.map(opt => opt.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim());

            // Tạo danh sách đối tượng để xáo trộn
            const optionObjects = cleanOptions.map((text, index) => ({ text, isCorrect: index === oldCorrectIndex }));
            this.shuffle(optionObjects);

            // Tìm vị trí đáp án đúng mới
            finalCorrectIndex = optionObjects.findIndex(obj => obj.isCorrect);
            if (finalCorrectIndex === -1) finalCorrectIndex = 0;

            // Bọc lại tiền tố A, B, C, D, E, F
            const letterMap = ["A", "B", "C", "D", "E", "F"];
            renderedOptions = optionObjects.map((obj, i) => `${letterMap[i]}. ${obj.text}`);
            
            // Đưa chữ cái đáp án đúng mới vào context để tự động replace trong solutionHtml nếu có {ans_letter}
            context.ans_letter = letterMap[finalCorrectIndex];
        } else {
            context.ans_letter = "A";
        }

        // Thay thế placeholders trong solutionHtml sau khi đã xác định được ans_letter
        let finalSolutionHtml = replacePlaceholders(tempQ.solutionHtml, context);

        // Fallback: Nếu solutionHtml ghi cứng chữ cái đáp án đúng ban đầu kiểu "Đáp án đúng là D" thì cập nhật lại
        if (renderedOptions.length > 0 && finalSolutionHtml) {
            const oldCorrectIndex = tempQ.correctIndex !== undefined ? parseInt(tempQ.correctIndex, 10) : 0;
            if (oldCorrectIndex !== finalCorrectIndex) {
                const letterMap = ["A", "B", "C", "D", "E", "F"];
                const oldLetter = letterMap[oldCorrectIndex];
                const newLetter = letterMap[finalCorrectIndex];
                const regexStr = `(đáp án đúng là|dap an dung la|đáp án đúng:|dap an dung:|chọn đáp án|chon dap an|chọn|chon)\\s+${oldLetter}\\b`;
                finalSolutionHtml = finalSolutionHtml.replace(
                    new RegExp(regexStr, 'gi'),
                    (match, p1) => {
                        return `${p1} ${newLetter}`;
                    }
                );
            }
        }

        const finalQ = {
            questionText: replacePlaceholders(tempQ.questionText, context),
            options: renderedOptions,
            correctIndex: finalCorrectIndex,
            hints: tempQ.hints ? tempQ.hints.map(h => replacePlaceholders(h, context)) : [],
            solutionHtml: finalSolutionHtml,
            tip: replacePlaceholders(tempQ.tip, context),
            level: tempQ.level || 'chat-luong-cao',
            type: tempQ.type,
            isTemplateInstance: true
        };
        
        return finalQ;
    },

    // Điểm xuất phát của việc chọn cấp độ bài luyện tập
    startPracticeWithLevel: function(level) {
        this.currentSubtopic = null;
        this.isSubtopicPracticeMode = false;
        this.isLessonExamMode = false;
        this.isWeaknessPracticeMode = false;
        
        const selectBox = document.getElementById("practice-level-select-box");
        if (selectBox) selectBox.classList.add("hidden");
        const dbBox = document.getElementById("practice-levels-dashboard-box");
        if (dbBox) dbBox.classList.add("hidden");
        
        document.getElementById("practice-active-box").classList.remove("hidden");
        this.initPractice(app.currentLesson, level, false);
    },

    // Luyện tập theo Dạng bài cụ thể
    startSubtopicPractice: function(subtopicId) {
        const lesson = app.currentLesson;
        const subtopic = lesson.subtopics.find(s => s.id === subtopicId);
        if (!subtopic) return;

        this.currentSubtopic = subtopic;
        this.isSubtopicPracticeMode = true;
        this.isLessonExamMode = false;
        this.isWeaknessPracticeMode = false;

        const selectBox = document.getElementById("practice-level-select-box");
        if (selectBox) selectBox.classList.add("hidden");
        const dbBox = document.getElementById("practice-levels-dashboard-box");
        if (dbBox) dbBox.classList.add("hidden");

        document.getElementById("practice-active-box").classList.remove("hidden");
        this.initPractice(lesson, subtopic.level || 'co-ban', false);
    },

    // Luyện tập khắc phục điểm yếu của Dạng bài cụ thể (do AI tính toán)
    startWeaknessPracticeSubtopic: function(subtopicId) {
        const lesson = app.currentLesson;
        const subtopic = lesson.subtopics.find(s => s.id === subtopicId);
        if (!subtopic) return;

        this.currentSubtopic = subtopic;
        this.isSubtopicPracticeMode = true;
        this.isLessonExamMode = false;
        this.isWeaknessPracticeMode = true;

        const selectBox = document.getElementById("practice-level-select-box");
        if (selectBox) selectBox.classList.add("hidden");
        const dbBox = document.getElementById("practice-levels-dashboard-box");
        if (dbBox) dbBox.classList.add("hidden");

        document.getElementById("practice-active-box").classList.remove("hidden");
        this.initPractice(lesson, subtopic.level || 'co-ban', false);
    },

    // Luyện tập khắc phục điểm yếu của cấp độ (bài luyện tập chung)
    startWeaknessPracticeWithLevel: function(level) {
        this.currentSubtopic = null;
        this.isSubtopicPracticeMode = false;
        this.isLessonExamMode = false;
        this.isWeaknessPracticeMode = true;

        const selectBox = document.getElementById("practice-level-select-box");
        if (selectBox) selectBox.classList.add("hidden");
        const dbBox = document.getElementById("practice-levels-dashboard-box");
        if (dbBox) dbBox.classList.add("hidden");

        document.getElementById("practice-active-box").classList.remove("hidden");
        this.initPractice(app.currentLesson, level, false);
    },

    // Kiểm tra tổng thể bài học (10 câu nâng cao)
    startLessonExam: function() {
        this.currentSubtopic = null;
        this.isSubtopicPracticeMode = false;
        this.isLessonExamMode = true;
        this.isWeaknessPracticeMode = false;

        const introBox = document.getElementById("practice-lesson-exam-intro-box");
        if (introBox) introBox.classList.add("hidden");
        const dbBox = document.getElementById("practice-levels-dashboard-box");
        if (dbBox) dbBox.classList.add("hidden");

        document.getElementById("practice-active-box").classList.remove("hidden");
        this.initPractice(app.currentLesson, 'nang-cao', true);
    },

    // Điểm xuất phát của bài thi cuối chương
    startExam: function() {
        this.startExamWithLevel('co-ban');
    },

    startExamWithLevel: function(level) {
        this.currentSubtopic = null;
        this.isSubtopicPracticeMode = false;
        this.isLessonExamMode = false;
        this.isWeaknessPracticeMode = false;
        
        document.getElementById("practice-exam-intro-box").classList.add("hidden");
        const dbBox = document.getElementById("practice-levels-dashboard-box");
        if (dbBox) dbBox.classList.add("hidden");
        
        document.getElementById("practice-active-box").classList.remove("hidden");
        this.initPractice(app.currentLesson, level, true);
    },

    // Khởi tạo bài luyện tập (5 câu) hoặc bài thi cuối chương (10 câu)
    initPractice: function(lesson, level = 'co-ban', isExam = false) {
        this.currentLesson = lesson;
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.correctCount = 0;
        this.selectedOption = null;
        this.hintsShown = 0;
        this.hasChecked = false;
        this.isExamMode = isExam;
        this.currentLevel = level || 'co-ban';
        this.practiceStartTime = Date.now();
        this.practiceDistractions = 0;
        this.accumulatedGold = 0;
        this.accumulatedXp = 0;
        this.isGraded = false; // Trạng thái đã chấm điểm bài tập/thi

        // Hiển thị cảnh báo luyện điểm yếu AI nếu có
        const alertBox = document.getElementById("weakness-practice-alert");
        if (alertBox) {
            if (this.isWeaknessPracticeMode) {
                const lvlData = app.getLevelData(lesson.id, this.currentLevel);
                if (lvlData && lvlData.weakQuestion) {
                    const cleanTip = lvlData.weakQuestion.tip || "Cố gắng làm bài cẩn thận hơn con nhé!";
                    alertBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:var(--warning); font-size:1.2rem;"></i> 
                    <div>
                        <span style="color:var(--warning); font-weight:700;">Chế độ Luyện điểm yếu AI:</span> Tập trung khắc phục lỗi: <span style="font-style:italic; color:var(--text-main); font-weight:normal;">"${cleanTip}"</span>
                    </div>`;
                    alertBox.classList.remove("hidden");
                } else {
                    alertBox.classList.add("hidden");
                }
            } else {
                alertBox.classList.add("hidden");
            }
        }

        // Bật toàn màn hình cho khu vực làm bài tập/kiểm tra
        app.enterFullscreen(document.getElementById("tab-practice"));
        document.body.classList.add("practice-fullscreen-active");

        // Bật Super Focus Mode chống xao nhãng
        document.body.classList.add("super-focus-active");
        
        // Đảm bảo tắt chế độ hiển thị phóng to game khi mới bắt đầu làm bài tập
        document.body.classList.remove("game-mode-active");

        // Đảm bảo dừng nhạc nền game khi đang làm bài tập
        if (window.app && app.audio) {
            app.audio.stopBackground();
        }

        // Dừng đếm thời gian cũ nếu có
        if (this.examInterval) clearInterval(this.examInterval);
        document.getElementById("exam-timer-wrapper").classList.add("hidden");
        document.getElementById("exam-review-box").classList.add("hidden");

        const chapterTypes = {
            "chuong-1": ["tap-hop", "ghi-so-tu-nhien", "tap-hop-thu-tu", "cong-tru-so-tu-nhien", "nhan-chia-so-tu-nhien", "luy-thua", "thu-tu-phep-tinh"],
            "chuong-2": ["quan-he-chia-het", "dau-hieu-chia-het", "so-nguyen-to", "ucln", "bcnn"],
            "chuong-3": ["tap-hop-so-nguyen", "cong-tru-so-nguyen", "dau-ngoac", "nhan-so-nguyen", "chia-het-uoc-boi-so-nguyen"],
            "chuong-4": ["hinh-hoc-chuong-4", "hinh-hoc-2-chuong-4", "chu-vi-dien-tich"],
            "chuong-5": ["truc-doi-xung", "tam-doi-xung"],
            "chuong-6": ["phan-so-bang-nhau", "so-sanh-phan-so", "cong-tru-phan-so", "nhan-chia-phan-so", "hai-bai-toan-phan-so"],
            "chuong-7": ["so-thap-phan", "tinh-so-thap-phan", "lam-tron-uoc-luong", "ti-so-phan-tram"],
            "chuong-8": ["diem-duong-thang", "tia-hinh-hoc", "doan-thang", "trung-diem", "goc", "so-do-goc"],
            "chuong-9": ["thu-thap-du-lieu", "bang-thong-ke-bieu-do-tranh", "bieu-do-cot", "bieu-do-cot-kep", "ket-qua-co-the", "xac-suat-thuc-nghiem"],
            // Lớp 4
            "l4-chuong-1": ["l4-on-tap-100k", "l4-phep-tinh-100k", "l4-so-chan-le", "l4-bieu-thuc-chu", "l4-toan-ba-buoc-tinh"],
            "l4-chuong-2": ["l4-do-goc", "l4-phan-loai-goc"],
            "l4-chuong-3": ["l4-so-sau-chu-so", "l4-hang-va-lop", "l4-lop-trieu", "l4-lam-tron-tram-nghin", "l4-so-sanh-nhieu-chu-so", "l4-day-so-tu-nhien"],
            "l4-chuong-4": ["l4-yen-ta-tan", "l4-don-vi-dien-tich", "l4-giay-the-ki"],
            "l4-chuong-5": ["l4-cong-nhieu-chu-so", "l4-tru-nhieu-chu-so", "l4-tinh-chat-cong", "l4-tong-hieu"],
            "l4-chuong-6": ["l4-duong-vuong-goc", "l4-duong-song-song", "l4-binh-hanh-thoi"],
            "l4-chuong-7": ["luyen-tap-chung-l4-c7-1", "luyen-tap-chung-l4-c7-2", "luyen-tap-chung-l4-c7-3", "luyen-tap-chung-l4-c7-4"],
            "l4-chuong-8": ["l4-nhan-mot-chu-so", "l4-chia-mot-chu-so", "l4-nhan-chia-10-100", "l4-trung-binh-cong", "l4-rut-ve-don-vi"],
            "l4-chuong-9": ["l4-thong-ke", "l4-bieu-do-cot", "l4-su-kien"],
            "l4-chuong-10": ["l4-khai-niem-phan-so", "l4-phan-so-chia-so-tu-nhien", "l4-rut-gon-phan-so", "l4-so-sanh-phan-so"],
            "l4-chuong-11": ["l4-cong-phan-so", "l4-tru-phan-so"],
            "l4-chuong-12": ["l4-nhan-phan-so", "l4-tim-phan-so-cua-so"],
            "l4-chuong-13": ["luyen-tap-chung-l4-c13-1", "luyen-tap-chung-l4-c13-2", "luyen-tap-chung-l4-c13-3", "luyen-tap-chung-l4-c13-4", "luyen-tap-chung-l4-c13-5", "luyen-tap-chung-l4-c13-6"]
        };

        // Xác định chương của bài học hiện tại
        let chapterId = "chuong-1";
        for (const chapter of COURSE_DATA) {
            if (chapter.lessons.some(l => l.id === lesson.id)) {
                chapterId = chapter.id;
                break;
            }
        }

        let numQuestions = isExam ? 10 : 5;
        if (this.isSubtopicPracticeMode || this.isLessonExamMode) {
            numQuestions = 10;
        }

        if (this.isLessonExamMode) {
            // Bài kiểm tra tổng thể bài học: 10 câu, tính giờ 15 phút, mức độ Nâng cao
            this.startExamTimer();
            const subtopics = lesson.subtopics && lesson.subtopics.length > 0 ? lesson.subtopics : [];
            
            for (let i = 0; i < numQuestions; i++) {
                const sub = subtopics.length > 0 ? subtopics[Math.floor(Math.random() * subtopics.length)] : null;
                const type = sub ? sub.questionType : lesson.questionType;
                const q = this.generateQuestion(type, 'nang-cao');
                q.isSpacedRepetition = false;
                q.level = 'nang-cao';
                q.type = type;
                this.currentQuestions.push(q);
            }
        } else if (this.isSubtopicPracticeMode) {
            // Luyện tập theo dạng bài: 10 câu, theo độ khó của dạng bài
            for (let i = 0; i < numQuestions; i++) {
                const type = this.currentSubtopic.questionType;
                const level = this.currentSubtopic.level || 'co-ban';
                const q = this.generateQuestion(type, level);
                q.isSpacedRepetition = false;
                q.level = level;
                q.type = type;
                this.currentQuestions.push(q);
            }
        } else if (isExam) {
            // Chế độ Thi chương: 45 phút, số câu tùy thuộc mức độ
            this.startExamTimer();
            const types = chapterTypes[chapterId] || ["tap-hop"];
            
            let examQuestionsCount = 18; // mặc định nâng cao
            let mcqCount = 12;
            let saCount = 6;
            let diffDistribution = [];

            if (this.currentLevel === 'co-ban') {
                examQuestionsCount = 20;
                mcqCount = 16;
                saCount = 4;
                // Phân bố độ khó: 16 Cơ bản, 4 Nâng cao
                for (let i = 0; i < 16; i++) diffDistribution.push('co-ban');
                for (let i = 0; i < 4; i++) diffDistribution.push('nang-cao');
            } else if (this.currentLevel === 'kho') {
                examQuestionsCount = 16;
                mcqCount = 10;
                saCount = 6;
                // Phân bố độ khó: 2 Cơ bản, 6 Nâng cao, 8 Khó
                for (let i = 0; i < 2; i++) diffDistribution.push('co-ban');
                for (let i = 0; i < 6; i++) diffDistribution.push('nang-cao');
                for (let i = 0; i < 8; i++) diffDistribution.push('kho');
            } else if (this.currentLevel === 'chat-luong-cao') {
                // Tải từ file pre-gen và bổ sung câu hỏi
                this.loadChatLuongCaoExam(lesson, types);
                return;
            } else {
                // Nâng cao (mặc định)
                examQuestionsCount = 18;
                mcqCount = 12;
                saCount = 6;
                // Phân bố độ khó: 4 Cơ bản, 10 Nâng cao, 4 Khó
                for (let i = 0; i < 4; i++) diffDistribution.push('co-ban');
                for (let i = 0; i < 10; i++) diffDistribution.push('nang-cao');
                for (let i = 0; i < 4; i++) diffDistribution.push('kho');
            }

            this.shuffle(diffDistribution);

            for (let i = 0; i < examQuestionsCount; i++) {
                const randomType = types[Math.floor(Math.random() * types.length)];
                const randomLevel = diffDistribution[i];
                const q = this.generateQuestion(randomType, randomLevel);
                q.isSpacedRepetition = false;
                q.level = randomLevel;
                q.type = randomType;
                q.isShortAnswer = false;
                this.currentQuestions.push(q);
            }

            // Đánh dấu một số câu hỏi phù hợp là điền số (Short Answer)
            let shortAnswerAssigned = 0;
            const targetShortAnswerCount = examQuestionsCount - mcqCount;
            for (let i = examQuestionsCount - 1; i >= 0; i--) {
                const q = this.currentQuestions[i];
                if (shortAnswerAssigned < targetShortAnswerCount && !q.forceMCQ) {
                    q.isShortAnswer = true;
                    shortAnswerAssigned++;
                } else {
                    q.isShortAnswer = false;
                }
            }
        } else if (this.currentLevel === 'chat-luong-cao') {
            // Chế độ Chất lượng cao do AI sinh
            Swal.fire({
                title: 'Đang tải đề thi AI...',
                text: 'Hệ thống đang nạp bộ câu hỏi Chất lượng cao do AI biên soạn và kiểm định ngầm. Vui lòng chờ trong giây lát...',
                target: document.getElementById('tab-practice') || 'body',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const studentId = app.config.defaultStudentId || 'default';
            fetch(this.getApiUrl(`/api/get-questions?lessonId=${lesson.id}&lessonTitle=${encodeURIComponent(lesson.title)}&classLevel=${app.config.currentClass || '6'}&studentId=${studentId}`))
                .then(res => {
                    if (!res.ok) throw new Error('Không thể kết nối với server.');
                    return res.json();
                })
                .then(data => {
                    Swal.close();
                    let questions = null;
                    if (data) {
                        if (Array.isArray(data)) {
                            questions = data;
                        } else if (Array.isArray(data.questions)) {
                            questions = data.questions;
                        }
                    }
                    if (questions && questions.length > 0) {
                        Swal.fire({
                            title: 'Đang sinh đề thi AI...',
                            text: 'Trình biên dịch ngầm đang chuyển đổi template và kiểm tra ràng buộc...',
                            target: document.getElementById('tab-practice') || 'body',
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });

                        // Khởi động Web Worker để chạy ngầm sinh số
                        const worker = new Worker('js/question-generator-worker.js');
                        worker.postMessage({ questions: questions, maxAttempts: 500 });

                        worker.onmessage = (e) => {
                            Swal.close();
                            worker.terminate();
                            const response = e.data;
                            if (response.status === 'success') {
                                this.currentQuestions = response.questions;
                                // Thay thế showQuestion() để chuyển sang giao diện lựa chọn chế độ thực hành trước
                                document.getElementById("practice-active-box").classList.add("hidden");
                                document.getElementById("practice-mode-select-box").classList.remove("hidden");
                            } else {
                                const errorMsg = response.message || 'Lỗi không xác định khi sinh đề ngầm.';
                                console.error('Worker sinh đề lỗi:', response);

                                // Gửi Telemetry lỗi về Server
                                fetch(this.getApiUrl('/api/report-client-error'), {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        studentId: studentId,
                                        lessonId: lesson.id,
                                        lessonTitle: lesson.title,
                                        errorMessage: errorMsg,
                                        errorStack: response.stack,
                                        failedQuestion: response.failedQuestion,
                                        failedIndex: response.failedIndex
                                    })
                                }).catch(telemetryErr => console.error('Lỗi gửi telemetry:', telemetryErr));

                                Swal.fire({
                                    icon: 'error',
                                    title: 'Lỗi biên dịch đề AI',
                                    text: 'Không thể nạp đề thi Chất lượng cao lúc này. Chi tiết: ' + errorMsg,
                                    target: document.getElementById('tab-practice') || 'body',
                                    confirmButtonText: 'Quay lại'
                                }).then(() => {
                                    this.exitPractice();
                                });
                            }
                        };

                        worker.onerror = (err) => {
                            Swal.close();
                            worker.terminate();
                            console.error('Lỗi runtime Web Worker:', err);

                            // Gửi Telemetry lỗi Web Worker
                            fetch(this.getApiUrl('/api/report-client-error'), {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    studentId: studentId,
                                    lessonId: lesson.id,
                                    lessonTitle: lesson.title,
                                    errorMessage: err.message || 'Lỗi runtime Web Worker',
                                    errorStack: err.stack
                                })
                            }).catch(telemetryErr => console.error('Lỗi gửi telemetry:', telemetryErr));

                            Swal.fire({
                                icon: 'error',
                                title: 'Lỗi luồng chạy Web Worker',
                                text: 'Không thể khởi động Web Worker sinh đề AI: ' + err.message,
                                target: document.getElementById('tab-practice') || 'body',
                                confirmButtonText: 'Quay lại'
                            }).then(() => {
                                this.exitPractice();
                            });
                        };
                    } else {
                        throw new Error('Dữ liệu đề thi AI không hợp lệ.');
                    }
                })
                .catch(err => {
                    console.error('Lỗi tải đề thi chất lượng cao:', err);

                    // Gửi Telemetry khi lỗi fetch API
                    fetch(this.getApiUrl('/api/report-client-error'), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            studentId: studentId,
                            lessonId: lesson.id,
                            lessonTitle: lesson.title,
                            errorMessage: 'Lỗi tải đề thi từ API: ' + err.message,
                            errorStack: err.stack
                        })
                    }).catch(telemetryErr => console.error('Lỗi gửi telemetry:', telemetryErr));

                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi tải đề thi AI',
                        text: 'Không thể nạp đề thi Chất lượng cao lúc này. Chi tiết: ' + err.message,
                        target: document.getElementById('tab-practice') || 'body',
                        confirmButtonText: 'Quay lại'
                    }).then(() => {
                        this.exitPractice();
                    });
                });
            return; // Dừng luồng xử lý đồng bộ
        } else {
            // Chế độ Luyện tập thường: 5 câu, độ khó tự chọn
            for (let i = 0; i < numQuestions; i++) {
                let type = lesson.questionType;
                let isSpacedRepetition = false;

                // Nếu là bài luyện tập chung, lấy ngẫu nhiên các dạng đã học của chương
                if (type.startsWith("luyen-tap-chung")) {
                    const allChapterTypes = chapterTypes[chapterId] || ["tap-hop"];
                    // Lấy các questionType của bài đã học (score >= 50%) trong cùng chương
                    const completedLessons = app.getCompletedLessons ? app.getCompletedLessons() : [];
                    // Lọc bài học trong chương hiện tại đã có điểm >= 50%
                    const chapterLessons = COURSE_DATA.find(c => c.id === chapterId)?.lessons || [];
                    const learnedTypes = chapterLessons
                        .filter(l => l.questionType && !l.questionType.startsWith("luyen-tap-chung") && !l.questionType.startsWith("cuoi-chuong"))
                        .filter(l => (app.state.scores && (app.state.scores[l.id] || 0) >= 50) || completedLessons.includes(l.id))
                        .map(l => l.questionType);
                    // Dùng danh sách đã học nếu có, ngược lại fallback toàn chương
                    const availableTypes = learnedTypes.length > 0 ? learnedTypes : allChapterTypes;
                    type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
                } else {
                    // Spaced Repetition ở câu 4 (i = 3): ôn tập bài cũ
                    if (i === 3) {
                        const completed = app.getCompletedLessons();
                        const eligible = completed.filter(id => id !== lesson.id);
                        if (eligible.length > 0) {
                            const randPrevId = eligible[Math.floor(Math.random() * eligible.length)];
                            const prevLesson = getLessonById(randPrevId);
                            if (prevLesson) {
                                type = prevLesson.questionType;
                                isSpacedRepetition = true;
                            }
                        }
                    }
                }

                const q = this.generateQuestion(type, this.currentLevel);
                q.isSpacedRepetition = isSpacedRepetition;
                q.level = this.currentLevel;
                q.type = type;
                this.currentQuestions.push(q);
            }
        }

        // Hiển thị màn hình chọn chế độ cho tất cả các bài luyện tập tự do
        const isPracticeMode = !this.isExamMode && !this.isLessonExamMode;
        
        if (isPracticeMode) {
            // Ẩn bảng làm bài tích cực, hiện bảng chọn chế độ thực hành
            document.getElementById("practice-active-box").classList.add("hidden");
            document.getElementById("practice-mode-select-box").classList.remove("hidden");
            
            // Nạp và cập nhật mini status của Hero lên giao diện chuẩn bị
            this.updateHeroMiniStatus();
        } else {
            // Chế độ thi/kiểm tra: Tự động chạy trắc nghiệm tiêu chuẩn, vào thẳng làm bài
            this.practiceMode = 'standard';
            document.getElementById("practice-mode-select-box").classList.add("hidden");
            document.getElementById("practice-active-box").classList.remove("hidden");
            this.showQuestion();
        }
    },

    loadChatLuongCaoExam: function(lesson, types) {
        Swal.fire({
            title: 'Đang tải đề thi AI...',
            text: 'Hệ thống đang nạp bộ câu hỏi Chất lượng cao do AI biên soạn và kiểm định ngầm. Vui lòng chờ trong giây lát...',
            target: document.getElementById('tab-practice') || 'body',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const studentId = app.config.defaultStudentId || 'default';
        fetch(this.getApiUrl(`/api/get-questions?lessonId=${lesson.id}&lessonTitle=${encodeURIComponent(lesson.title)}&classLevel=${app.config.currentClass || '6'}&studentId=${studentId}`))
            .then(res => {
                if (!res.ok) throw new Error('Không thể kết nối với server.');
                return res.json();
            })
            .then(data => {
                Swal.close();
                let loadedQuestions = null;
                if (data) {
                    if (Array.isArray(data)) {
                        loadedQuestions = data;
                    } else if (Array.isArray(data.questions)) {
                        loadedQuestions = data.questions;
                    }
                }
                if (loadedQuestions && loadedQuestions.length > 0) {
                    // 1. Chuyển đổi các câu hỏi template từ file thành câu hỏi thực tế
                    const aiQuestions = loadedQuestions.map(q => {
                        const generatedQ = this.generateQuestionFromTemplate(q);
                        generatedQ.isSpacedRepetition = false;
                        generatedQ.level = 'chat-luong-cao';
                        return generatedQ;
                    });

                    // Trộn các câu hỏi AI sinh
                    this.shuffle(aiQuestions);

                    // 2. Bổ sung thêm 6 câu hỏi từ bộ sinh câu hỏi cục bộ (để đủ 16 câu cho 45 phút)
                    const extraQuestionsCount = 6;
                    const diffDistribution = ['nang-cao', 'nang-cao', 'kho', 'kho', 'nang-cao', 'kho'];
                    
                    for (let i = 0; i < extraQuestionsCount; i++) {
                        const randomType = types[Math.floor(Math.random() * types.length)];
                        const randomLevel = diffDistribution[i];
                        const q = this.generateQuestion(randomType, randomLevel);
                        q.isSpacedRepetition = false;
                        q.level = randomLevel;
                        q.type = randomType;
                        aiQuestions.push(q);
                    }

                    // 3. Đánh dấu các câu điền đáp án ngắn phù hợp (tối đa 6 câu)
                    const totalQs = aiQuestions.length; // 16 câu
                    const mcqCount = 10;
                    let shortAnswerAssigned = 0;
                    const targetShortAnswerCount = totalQs - mcqCount;
                    for (let i = totalQs - 1; i >= 0; i--) {
                        const q = aiQuestions[i];
                        if (shortAnswerAssigned < targetShortAnswerCount && !q.forceMCQ) {
                            q.isShortAnswer = true;
                            shortAnswerAssigned++;
                        } else {
                            q.isShortAnswer = false;
                        }
                    }

                    this.currentQuestions = aiQuestions;
                    this.currentQuestionIndex = 0;
                    
                    // Vào thẳng làm bài
                    this.practiceMode = 'standard';
                    document.getElementById("practice-mode-select-box").classList.add("hidden");
                    document.getElementById("practice-active-box").classList.remove("hidden");
                    this.showQuestion();
                } else {
                    throw new Error('Dữ liệu đề thi AI trống hoặc không hợp lệ.');
                }
            })
            .catch(err => {
                console.error('Lỗi tải đề thi chất lượng cao:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi tải đề thi AI',
                    text: 'Không thể nạp đề thi Chất lượng cao lúc này. Hệ thống sẽ tự động dùng bộ sinh đề dự phòng mức độ Nâng cao.',
                    target: document.getElementById('tab-practice') || 'body',
                    confirmButtonText: 'Đồng ý'
                }).then(() => {
                    // Dự phòng: Sinh đề Nâng cao thường
                    this.currentLevel = 'nang-cao';
                    this.initPractice(lesson, 'nang-cao', true);
                });
            });
    },

    // Hàm cập nhật trạng thái hiển thị của Hero lên giao diện chuẩn bị
    updateHeroMiniStatus: function() {
        const miniBox = document.getElementById("hero-mini-status-box");
        if (miniBox) {
            miniBox.classList.add("hidden");
            miniBox.style.display = "none";
        }
    },

    // Mở hộp thoại chọn Siêu Anh Hùng bằng SweetAlert2 (Hỗ trợ đa cơ chế click và tự động phòng thủ offline)
    openHeroSelector: function() {
        // Đăng ký trước hàm toàn cục để onclick inline trong HTML luôn tìm thấy kể cả khi Swal nạp bất đồng bộ
        window.selectTdHero = (heroId) => {
            questions.hero.load();
            questions.hero.selectedId = heroId;
            questions.hero.save();
            Swal.close();
            questions.updateHeroMiniStatus();
            
            if (questions.pendingPracticeMode) {
                const mode = questions.pendingPracticeMode;
                questions.pendingPracticeMode = null;
                questions.selectPracticeMode(mode);
            }
        };

        if (!document.getElementById("hero-select-styles")) {
            const style = document.createElement("style");
            style.id = "hero-select-styles";
            style.innerHTML = `
                .hero-card:hover {
                    border-color: #fbbf24 !important;
                    transform: translateY(-5px);
                    box-shadow: 0 10px 15px -3px rgba(251, 191, 36, 0.2);
                    background: rgba(251, 191, 36, 0.05) !important;
                }
                .hero-select-popup {
                    width: 580px !important;
                    background: var(--bg-card) !important;
                    color: var(--text-main) !important;
                    border: 1px solid var(--border-color) !important;
                }
            `;
            document.head.appendChild(style);
        }

        Swal.fire({
            title: 'Chọn Siêu Anh Hùng Hộ Vệ',
            html: `<p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1.2rem;">Hãy chọn một siêu anh hùng đồng hành cùng con hộ vệ thành trì nhé con!</p>
                   <div class="hero-selector-container" style="display:flex; justify-content:space-around; gap:10px; margin-top:0.5rem;">
                     <div class="hero-card" id="btn-select-light-warrior" style="border: 2px solid var(--border-color); border-radius: 12px; padding: 15px; cursor: pointer; width: 31%; transition: all 0.3s; background: rgba(255,255,255,0.02); display:flex; flex-direction:column; align-items:center;">
                         <div style="font-size: 2.5rem; margin-bottom: 8px;">⚔️</div>
                         <div style="font-weight: bold; color: var(--text-main); margin-bottom: 5px; font-size:0.95rem; text-align:center;">Chiến Binh Ánh Sáng</div>
                         <div style="font-size: 0.72rem; color: var(--text-muted); text-align:center; line-height:1.4;">Tăng +15% sát thương tháp (+5%/cấp)</div>
                     </div>
                     <div class="hero-card" id="btn-select-frost-mage" style="border: 2px solid var(--border-color); border-radius: 12px; padding: 15px; cursor: pointer; width: 31%; transition: all 0.3s; background: rgba(255,255,255,0.02); display:flex; flex-direction:column; align-items:center;">
                         <div style="font-size: 2.5rem; margin-bottom: 8px;">❄️</div>
                         <div style="font-weight: bold; color: var(--text-main); margin-bottom: 5px; font-size:0.95rem; text-align:center;">Pháp Sư Băng Giá</div>
                         <div style="font-size: 0.72rem; color: var(--text-muted); text-align:center; line-height:1.4;">Tăng +15% tầm bắn tháp (+3%/cấp) và làm chậm</div>
                     </div>
                     <div class="hero-card" id="btn-select-gold-knight" style="border: 2px solid var(--border-color); border-radius: 12px; padding: 15px; cursor: pointer; width: 31%; transition: all 0.3s; background: rgba(255,255,255,0.02); display:flex; flex-direction:column; align-items:center;">
                         <div style="font-size: 2.5rem; margin-bottom: 8px;">🪙</div>
                         <div style="font-weight: bold; color: var(--text-main); margin-bottom: 5px; font-size:0.95rem; text-align:center;">Thần Tài Chiêu Lộc</div>
                         <div style="font-size: 0.72rem; color: var(--text-muted); text-align:center; line-height:1.4;">Giảm -10% giá xây tháp và nhận +20% vàng (+4%/cấp)</div>
                     </div>
                   </div>`,
            showConfirmButton: false,
            allowOutsideClick: false,
            target: document.getElementById('tab-practice') || 'body',
            customClass: {
                popup: 'hero-select-popup'
            },
            didOpen: () => {
                const container = typeof Swal.getHtmlContainer === 'function' ? Swal.getHtmlContainer() : document;
                const cardLight = container.querySelector("#btn-select-light-warrior");
                const cardFrost = container.querySelector("#btn-select-frost-mage");
                const cardGold = container.querySelector("#btn-select-gold-knight");

                if (cardLight) cardLight.onclick = () => window.selectTdHero("light_warrior");
                if (cardFrost) cardFrost.onclick = () => window.selectTdHero("frost_mage");
                if (cardGold) cardGold.onclick = () => window.selectTdHero("gold_knight");
            }
        });
    },

    // Chọn chế độ thực hành (Trắc nghiệm thường vs Thủ thành)
    selectPracticeMode: function(mode) {
        if (mode === 'game') {
            // 1. Phải là phần Khó hoặc Chất lượng cao
            if (this.currentLevel !== 'kho' && this.currentLevel !== 'chat-luong-cao') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Không thể chơi game! 🔒',
                    html: '<p style="font-size:1.05rem;">Nếu muốn chơi game, con <b>nhất định phải luyện tập phần Khó hoặc Chất lượng cao</b>.</p><p style="color:var(--danger); font-weight:bold; margin-top:0.5rem;">Phần Cơ bản và Nâng cao không được chơi game!</p>',
                    confirmButtonText: 'Đã hiểu',
                    confirmButtonColor: 'var(--primary)',
                    target: document.getElementById('tab-practice') || 'body'
                });
                return;
            }
            
            // 2. Kiểm tra điều kiện mở khóa phần tương ứng
            if (window.app && typeof app.getLevelData === 'function') {
                if (this.currentLevel === 'chat-luong-cao') {
                    const khoData = app.getLevelData(this.currentLesson.id, 'kho');
                    if (khoData.score < 100) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Yêu cầu hoàn thành phần Khó! 🔒',
                            html: `<p style="font-size:1.05rem; margin-bottom:1rem;">Con chưa đủ điều kiện chơi game ở phần Chất lượng cao. Con cần <b>hoàn thành đạt điểm 100% ở phần Khó</b> của bài học này trước nhé.</p>` +
                                  `<div style="text-align:left; background:rgba(0,0,0,0.05); padding:1rem; border-radius:8px; display:inline-block; margin:0 auto; font-family:var(--font-family) !important;">` +
                                  `• Điểm phần <b>Khó</b> hiện tại: <b style="color:var(--danger);">${khoData.score}%</b>` +
                                  `</div>`,
                            confirmButtonText: 'Đồng ý, học tiếp',
                            confirmButtonColor: 'var(--primary)',
                            target: document.getElementById('tab-practice') || 'body'
                        });
                        return;
                    }
                } else if (this.currentLevel === 'kho') {
                    const nangCaoData = app.getLevelData(this.currentLesson.id, 'nang-cao');
                    if (nangCaoData.score < 100) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Yêu cầu hoàn thành phần Nâng cao! 🔒',
                            html: `<p style="font-size:1.05rem; margin-bottom:1rem;">Con chưa đủ điều kiện chơi game ở phần Khó. Con cần <b>hoàn thành đạt điểm 100% ở phần Nâng cao</b> của bài học này trước nhé.</p>` +
                                  `<div style="text-align:left; background:rgba(0,0,0,0.05); padding:1rem; border-radius:8px; display:inline-block; margin:0 auto; font-family:var(--font-family) !important;">` +
                                  `• Điểm phần <b>Nâng cao</b> hiện tại: <b style="color:var(--danger);">${nangCaoData.score}%</b>` +
                                  `</div>`,
                            confirmButtonText: 'Đồng ý, học tiếp',
                            confirmButtonColor: 'var(--primary)',
                            target: document.getElementById('tab-practice') || 'body'
                        });
                        return;
                    }
                }
            }
        }

        this.practiceMode = mode;
        this.hero.load();
        
        document.getElementById("practice-mode-select-box").classList.add("hidden");
        document.getElementById("practice-active-box").classList.remove("hidden");
        
        const splitContainer = document.getElementById("practice-split-container");
        const gameContainer = document.getElementById("td-game-container");
        const questionContainer = document.getElementById("td-question-container");
        
        if (mode === 'game') {
            // Làm xong toàn bộ câu hỏi mới chơi game: Ẩn game ngay từ đầu, câu hỏi chiếm toàn màn hình
            if (splitContainer) splitContainer.classList.remove("practice-split-active");
            if (gameContainer) gameContainer.classList.add("hidden");
            if (questionContainer) questionContainer.classList.remove("hidden");
            
            // Ẩn nút chơi thử Đấu trường theo yêu cầu
            const testBtn = document.getElementById("test-game-btn");
            if (testBtn) testBtn.classList.add("hidden");
            
            // Khởi tạo game TD và truyền dữ liệu Hero
            if (window.game) {
                game.init('td-canvas', this.currentQuestions.length, this.hero);
            }
        } else {
            if (splitContainer) splitContainer.classList.remove("practice-split-active");
            if (gameContainer) gameContainer.classList.add("hidden");
            if (questionContainer) questionContainer.classList.remove("hidden");
            
            // Ẩn nút chơi thử Đấu trường nếu ở chế độ thường
            const testBtn = document.getElementById("test-game-btn");
            if (testBtn) testBtn.classList.add("hidden");
        }
        
        // Hiển thị câu hỏi đầu tiên
        this.showQuestion();
    },

    // Kích hoạt đồng hồ đếm ngược bài thi
    startExamTimer: function() {
        this.examTimeRemaining = 2700; // 45 phút
        document.getElementById("exam-timer-wrapper").classList.remove("hidden");
        this.updateExamTimerDisplay();
        
        this.examInterval = setInterval(() => {
            this.examTimeRemaining--;
            this.updateExamTimerDisplay();
            
            if (this.examTimeRemaining <= 0) {
                clearInterval(this.examInterval);
                Swal.fire({
                    icon: 'info',
                    title: 'Hết giờ làm bài!',
                    text: 'Thời gian 45 phút làm bài thi đã hết. Hệ thống sẽ tự động nộp bài và chấm điểm của con.',
                    target: document.getElementById('tab-practice') || 'body',
                    confirmButtonText: 'Xem kết quả',
                    confirmButtonColor: 'var(--primary)'
                }).then(() => {
                    this.finishPractice();
                });
            }
        }, 1000);
    },

    updateExamTimerDisplay: function() {
        const mins = Math.floor(this.examTimeRemaining / 60);
        const secs = this.examTimeRemaining % 60;
        document.getElementById("exam-timer-val").innerText = mins.toString().padStart(2, '0') + ":" + secs.toString().padStart(2, '0');
    },

    // Bộ sinh đề chi tiết cho 22 dạng bài với 3 cấp độ
    generateQuestion: function(type, level = "co-ban") {
        if ((type.startsWith("l4-") || type.startsWith("luyen-tap-chung-l4-")) && typeof questionsL4 !== 'undefined') {
            return questionsL4.generateQuestion(type, level);
        }

        let questionText = "";
        let options = [];
        let correctIndex = 0;
        let hints = [];
        let solutionHtml = "";
        let tip = "";

        switch(type) {
            case "tap-hop-d1": {
                const variant = this.randomInt(1, 3);
                if (variant === 1) {
                    const a = this.randomInt(1, 6);
                    const b = a + this.randomInt(3, 4);
                    questionText = `Cho tập hợp $A = \\{x \\in \\mathbb{N} \\mid ${a} < x \\le ${b}\\}$. Cách viết nào dưới đây biểu diễn tập hợp $A$ bằng cách liệt kê phần tử?`;
                    const correctArr = [];
                    for(let x = a + 1; x <= b; x++) correctArr.push(x);
                    const correctStr = `$A = \\{${correctArr.join('; ')}\\}$`;
                    options = [
                        correctStr,
                        `$A = \\{${[a, ...correctArr].join('; ')}\\}$`,
                        `$A = \\{${correctArr.slice(0, -1).join('; ')}\\}$`,
                        `$A = \\{${correctArr.map(x=>x+1).join('; ')}\\}$`
                    ];
                    hints = [
                        `Ký hiệu $a < x \\le b$ nghĩa là số tự nhiên đó lớn hơn $a$ và bé hơn hoặc bằng $b$.`,
                        `Vì vậy ta không lấy giá trị $${a}$, nhưng có lấy giá trị $${b}$.`
                    ];
                    solutionHtml = `Các phần tử lớn hơn $${a}$ và bé hơn hoặc bằng $${b}$ là các số: $${correctArr.join(', ')}$. Viết dạng liệt kê: $A = \\{${correctArr.join('; ')}\\}$.`;
                    tip = "Dấu < không lấy biên, dấu <= có lấy biên.";
                } else if (variant === 2) {
                    const start = this.randomInt(1, 5) * 2 + 1; // số lẻ đầu
                    const arr = [start, start + 2, start + 4, start + 6, start + 8];
                    questionText = `Cho tập hợp $M = \\{${arr.join('; ')}\\}$. Cách viết nào dưới đây chỉ ra tính chất đặc trưng cho các phần tử của tập hợp $M$?`;
                    const correctStr = `$M = \\{x \\in \\mathbb{N} \\mid x \\text{ là số lẻ}, ${start - 1} < x \\le ${start + 8}\\}$`;
                    options = [
                        correctStr,
                        `$M = \\{x \\in \\mathbb{N} \\mid x \\text{ là số chẵn}, ${start - 1} < x \\le ${start + 8}\\}$`,
                        `$M = \\{x \\in \\mathbb{N} \\mid ${start} \\le x < ${start + 8}\\}$`,
                        `$M = \\{x \\in \\mathbb{N}^* \\mid x \\text{ là số lẻ}, ${start} < x < ${start + 8}\\}$`
                    ];
                    hints = [
                        `Các phần tử $${arr.join(', ')}$ đều là các số tự nhiên lẻ liên tiếp.`,
                        `Số lẻ đầu tiên là $${start}$ (lớn hơn $${start - 1}$) và số lẻ cuối là $${start + 8}$ (nhỏ hơn hoặc bằng $${start + 8}$).`
                    ];
                    solutionHtml = `Tập hợp $M = \\{${arr.join('; ')}\\}$ gồm các số tự nhiên lẻ từ $${start}$ đến $${start + 8}$. Do đó tính chất đặc trưng là số lẻ nằm trong khoảng từ $${start - 1}$ đến $${start + 8}$.`;
                    tip = "Nhớ kiểm tra tính chẵn lẻ và dấu so sánh ở biên nhé con.";
                } else {
                    const words = ["HOC_TAP", "NHA_TRANG", "BINH_MINH", "TOAN_HOC"];
                    const word = words[this.randomInt(0, words.length - 1)];
                    const displayWord = word.replace("_", " ");
                    const rawLetters = word.replace("_", "").split("");
                    const letters = [...new Set(rawLetters)];
                    questionText = `Gọi $X$ là tập hợp các chữ cái (không tính khoảng trắng và không trùng lặp) trong cụm từ tiếng Việt "${displayWord}". Cách viết nào dưới đây biểu diễn tập hợp $X$ đúng nhất?`;
                    const correctStr = `$X = \\{${letters.map(l => `'${l}'`).join('; ')}\\}$`;
                    let wrong1 = `$X = \\{${rawLetters.map(l => `'${l}'`).join('; ')}\\}$`;
                    if (rawLetters.length === letters.length) {
                        const duplicateLetters = [...rawLetters, rawLetters[0]];
                        wrong1 = `$X = \\{${duplicateLetters.map(l => `'${l}'`).join('; ')}\\}$`;
                    }
                    const wrong2 = `$X = \\{${letters.slice(0, -1).map(l => `'${l}'`).join('; ')}\\}$`;
                    const wrong3 = `$X = \\{${letters.map((l, idx) => idx === 0 ? `'Y'` : `'${l}'`).join('; ')}\\}$`;
                    options = [correctStr, wrong1, wrong2, wrong3];
                    this.shuffle(options);
                    correctIndex = options.indexOf(correctStr);

                    hints = [
                        `Mỗi chữ cái xuất hiện trong từ chỉ được liệt kê đúng 1 lần duy nhất trong tập hợp.`,
                        `Hãy lọc hết các chữ cái trùng lặp ra và viết chúng vào trong dấu ngoặc nhọn.`
                    ];
                    solutionHtml = `Cụm từ "${displayWord}" chứa các chữ cái riêng biệt là: ${letters.join(', ')}. Khi viết tập hợp, mỗi chữ cái chỉ được liệt kê một lần. Cách viết đúng là: $X = \\{${letters.map(l => `'${l}'`).join('; ')}\\}$.`;
                    tip = "Quy tắc cơ bản: Mỗi phần tử trong tập hợp chỉ xuất hiện đúng một lần.";
                }
                break;
            }
            case "tap-hop-d2": {
                const variant = this.randomInt(1, 3);
                if (variant === 1) {
                    const elements = [2, 4, 6, 8];
                    const nonElements = [1, 3, 5, 7];
                    const el = elements[this.randomInt(0, 3)];
                    const nonEl = nonElements[this.randomInt(0, 3)];
                    const isBelong = Math.random() > 0.5;
                    if (isBelong) {
                        questionText = `Cho tập hợp $B = \\{2; 4; 6; 8\\}$. Điền ký hiệu thích hợp vào dấu hỏi chấm: $${el} \\space ? \\space B$.`;
                        options = [`$\\in$`, `$\\notin$`, `$\\subset$`, `$\\varnothing$`];
                        hints = [
                            `Xem phần tử $${el}$ có nằm trong cặp ngoặc nhọn của tập hợp $B$ không.`,
                            `Nếu phần tử nằm trong tập hợp, ta dùng ký hiệu 'thuộc' $\\in$.`
                        ];
                        solutionHtml = `Vì phần tử $${el}$ nằm trong tập hợp $B = \\{2; 4; 6; 8\\}$, ta viết $${el} \\in B$.`;
                    } else {
                        questionText = `Cho tập hợp $B = \\{2; 4; 6; 8\\}$. Điền ký hiệu thích hợp vào dấu hỏi chấm: $${nonEl} \\space ? \\space B$.`;
                        options = [`$\\notin$`, `$\\in$`, `$\\subset$`, `$\\varnothing$`];
                        hints = [
                            `Xem số $${nonEl}$ có nằm trong các phần tử của tập hợp $B$ không.`,
                            `Nếu không nằm trong tập hợp, ta dùng ký hiệu 'không thuộc' $\\notin$.`
                        ];
                        solutionHtml = `Vì số $${nonEl}$ không nằm trong tập hợp $B = \\{2; 4; 6; 8\\}$, ta viết $${nonEl} \\notin B$.`;
                    }
                } else if (variant === 2) {
                    const a = this.randomInt(3, 7);
                    questionText = `Cho tập hợp $P = \\{x \\in \\mathbb{N}^* \\mid x < ${a}\\}$. Phát biểu nào sau đây là **sai**?`;
                    const correctStr = `$0 \\in P$`;
                    options = [
                        correctStr,
                        `$1 \\in P$`,
                        `$${a - 1} \\in P$`,
                        `$${a} \\notin P$`
                    ];
                    this.shuffle(options);
                    correctIndex = options.indexOf(correctStr);

                    hints = [
                        `Chú ý tập hợp số tự nhiên khác 0 ký hiệu là $\\mathbb{N}^*$, tức là không chứa số $0$.`,
                        `Kiểm tra xem số $0$ có thể thuộc tập hợp $P$ hay không.`
                    ];
                    solutionHtml = `Vì $P$ là tập hợp các số tự nhiên khác 0 nhỏ hơn $${a}$ nên $P = \\{1; 2; ...; ${a-1}\\}$. Số $0$ không thuộc $P$. Phát biểu $0 \\in P$ là **sai**.`;
                } else {
                    questionText = `Cho tập hợp $K = \\{a; b; c\\\}$. Hãy điền ký hiệu thích hợp vào chỗ trống để có các khẳng định đúng: $\\{a\\} \\space \\_\\_ \\space K$ và $b \\space \\_\\_ \\space K$.`;
                    const correctStr = `$\\subset$ và $\\in$`;
                    options = [
                        correctStr,
                        `$\\in$ và $\\subset$`,
                        `$\\subset$ và $\\subset$`,
                        `$\\notin$ và $\\in$`
                    ];
                    hints = [
                        `Phần tử nằm trong ngoặc nhọn $\\{a\\}$ tạo thành một tập hợp con của $K$.`,
                        `Chữ cái $b$ đơn lẻ đóng vai trò là một phần tử của $K$.`
                    ];
                    solutionHtml = `Ta có $\\{a\\}$ là một tập hợp chứa phần tử $a$, nên nó là tập hợp con của $K$, ta dùng ký hiệu $\\subset$. Còn $b$ là phần tử của $K$, ta dùng ký hiệu thuộc $\\in$.`;
                }
                tip = "Dùng ký hiệu thuộc/không thuộc cho phần tử với tập hợp, không dùng ký hiệu con.";
                break;
            }
            case "tap-hop-d3": {
                const variant = this.randomInt(1, 3);
                if (variant === 1) {
                    const a = this.randomInt(10, 30);
                    const b = a + this.randomInt(50, 100);
                    questionText = `Tính số phần tử của tập hợp $C = \\{x \\in \\mathbb{N} \\mid ${a} \\le x \\le ${b}\\}$.`;
                    const count = b - a + 1;
                    options = [`$${count}$`, `$${count - 1}$`, `$${count + 1}$`, `$${b - a - 1}$`];
                    hints = [
                        `Tập hợp $C$ gồm các số tự nhiên liên tiếp từ $${a}$ đến $${b}$.`,
                        `Công thức tính số phần tử: $\\text{Số cuối} - \\text{Số đầu} + 1$.`
                    ];
                    solutionHtml = `Số phần tử của tập hợp $C$ là: $${b} - ${a} + 1 = ${count}$ phần tử.`;
                } else if (variant === 2) {
                    const a = this.randomInt(5, 15) * 2;
                    const count = this.randomInt(10, 20);
                    const b = a + (count - 1) * 2;
                    questionText = `Tính số phần tử của tập hợp $D = \\{x \\in \\mathbb{N} \\mid x \\text{ là số chẵn và } ${a} \\le x \\le ${b}\\}$.`;
                    options = [`$${count}$`, `$${count - 1}$`, `$${count + 1}$`, `$${b - a + 1}$`];
                    hints = [
                        `Đây là tập hợp các số tự nhiên chẵn cách đều nhau $2$ đơn vị từ $${a}$ đến $${b}$.`,
                        `Công thức tính số phần tử của dãy cách đều: $(\\text{Số cuối} - \\text{Số đầu}) : \\text{Khoảng cách} + 1$.`
                    ];
                    solutionHtml = `Tập hợp $D = \\{${a}; ${a+2}; ...; ${b}\\}$. Số phần tử là: $(${b} - ${a}) : 2 + 1 = ${count}$ phần tử.`;
                } else {
                    const a = this.randomInt(5, 20);
                    questionText = `Tìm số phần tử của tập hợp $E = \\{x \\in \\mathbb{N} \\mid x + ${a} = ${a - 3}\\}$.`;
                    const correctStr = `$0$ phần tử`;
                    options = [
                        correctStr,
                        `$1$ phần tử`,
                        `$${a}$ phần tử`,
                        `Vô số phần tử`
                    ];
                    hints = [
                        `Hãy giải phương trình $x + ${a} = ${a - 3}$ trong tập hợp số tự nhiên $\\mathbb{N}$.`,
                        `Không có số tự nhiên nào cộng với $${a}$ lại bằng $${a - 3}$ (vì $${a} > ${a - 3}$).`
                    ];
                    solutionHtml = `Phương trình $x + ${a} = ${a - 3} \\rightarrow x = ${a - 3} - ${a}$ không có nghiệm tự nhiên vì số bị trừ nhỏ hơn số trừ. Tập hợp $E$ không chứa phần tử nào ($E = \\varnothing$). Số phần tử của $E$ là $0$.`;
                }
                tip = "Đừng quên cộng thêm 1 ở cuối công thức nhé con.";
                break;
            }
            case "tap-hop-d4": {
                const variant = this.randomInt(1, 3);
                if (variant === 1) {
                    const hsToan = this.randomInt(15, 25);
                    const hsVan = this.randomInt(12, 20);
                    const hsCaHai = this.randomInt(5, 10);
                    const result = hsToan + hsVan - hsCaHai;
                    questionText = `Trong một lớp học, biểu đồ Ven minh họa tập hợp học sinh giỏi Toán ký hiệu là $T$ ($${hsToan}$ bạn), giỏi Văn ký hiệu là $V$ ($${hsVan}$ bạn). Số học sinh giỏi cả hai môn (phần giao nhau của hai hình tròn) là $${hsCaHai}$ bạn. Hỏi có bao nhiêu học sinh giỏi ít nhất một trong hai môn?`;
                    options = [`$${result}$`, `$${hsToan + hsVan}$`, `$${result - hsCaHai}$`, `$${hsToan - hsCaHai}$`];
                    hints = [
                        `Tổng số học sinh giỏi ít nhất một môn bằng số bạn giỏi Toán cộng số bạn giỏi Văn rồi trừ đi số bạn bị tính lặp 2 lần (phần giao nhau).`,
                        `Công thức: $n(T \\cup V) = n(T) + n(V) - n(T \\cap V)$.`
                    ];
                    solutionHtml = `Số bạn chỉ giỏi Toán là: $${hsToan} - ${hsCaHai} = ${hsToan - hsCaHai}$. Số bạn chỉ giỏi Văn là: $${hsVan} - ${hsCaHai} = ${hsVan - hsCaHai}$. Tổng số bạn giỏi ít nhất một môn là: $${hsToan - hsCaHai} + ${hsVan - hsCaHai} + ${hsCaHai} = ${result}$ bạn.`;
                } else if (variant === 2) {
                    const hsToan = this.randomInt(15, 25);
                    const hsVan = this.randomInt(12, 20);
                    const hsCaHai = this.randomInt(5, 10);
                    questionText = `Lớp 6A có biểu đồ Ven biểu diễn học sinh tham gia câu lạc bộ. Vòng tròn $T$ biểu diễn học sinh tham gia CLB Tin học ($${hsToan}$ bạn), vòng tròn $A$ biểu diễn học sinh tham gia CLB Âm nhạc ($${hsVan}$ bạn). Số học sinh tham gia cả hai CLB là $${hsCaHai}$ bạn. Hỏi có bao nhiêu học sinh **chỉ** tham gia CLB Tin học?`;
                    const result = hsToan - hsCaHai;
                    options = [`$${result}$`, `$${hsToan}$`, `$${hsToan + hsCaHai}$`, `$${hsToan - hsVan}$`];
                    hints = [
                        `Tổng số học sinh trong vòng CLB Tin học gồm những học sinh chỉ tham gia Tin học và những học sinh tham gia cả hai CLB.`,
                        `Lấy tổng số học sinh CLB Tin học trừ đi số học sinh tham gia cả hai CLB.`
                    ];
                    solutionHtml = `Số học sinh chỉ tham gia CLB Tin học là: $${hsToan} - ${hsCaHai} = ${result}$ học sinh.`;
                } else {
                    const num1 = this.randomInt(2, 4);
                    const num2 = this.randomInt(5, 7);
                    const num3 = this.randomInt(8, 9);
                    questionText = `Cho hai tập hợp $A$ và $B$ được minh họa bằng biểu đồ Ven. Vòng tròn $A$ chứa các số $\\{${num1}; ${num2}; ${num3}\\}$. Vòng tròn $B$ chứa các số $\\{${num2}; ${num3}; 10; 12\\}$. Hãy xác định tập hợp giao $C = A \\cap B$ (phần chung nằm giữa hai vòng tròn).`;
                    const correctStr = `$C = \\{${num2}; ${num3}\\}$`;
                    options = [
                        correctStr,
                        `$C = \\{${num1}; ${num2}; ${num3}; 10; 12\\}$`,
                        `$C = \\{${num1}; 10; 12\\}$`,
                        `$C = \\{${num2}\\}$`
                    ];
                    hints = [
                        `Tập hợp giao $A \\cap B$ chứa các phần tử xuất hiện ở cả hai tập hợp $A$ và $B$.`,
                        `Tìm các số chung nằm trong cả hai danh sách của tập $A$ và tập $B$.`
                    ];
                    solutionHtml = `Các phần tử chung của cả hai tập hợp là $${num2}$ và $${num3}$. Vậy tập hợp giao là $C = \\{${num2}; ${num3}\\}$.`;
                }
                tip = "Phải trừ đi phần giao nhau để tránh đếm trùng học sinh.";
                break;
            }
            case "ghi-so-tu-nhien-d1": {
                const variant = this.randomInt(1, 3);
                if (variant === 1) {
                    const a = this.randomInt(3, 8);
                    let b = this.randomInt(1, 9);
                    while (b === a) { b = this.randomInt(1, 9); }
                    const c = this.randomInt(0, 9);
                    const num = a * 100 + b * 10 + c;
                    questionText = `Cho số tự nhiên $N = ${num}$. Xác định số chục và chữ số hàng chục của $N$.`;
                    const soChuc = a * 10 + b;
                    const chuSoHangChuc = b;
                    options = [
                        `Số chục là $${soChuc}$, chữ số hàng chục là $${chuSoHangChuc}$`,
                        `Số chục là $${chuSoHangChuc}$, chữ số hàng chục là $${soChuc}$`,
                        `Số chục là $${soChuc}$, chữ số hàng chục là $${a}$`,
                        `Số chục là $${soChuc * 10}$, chữ số hàng chục là $${chuSoHangChuc}$`
                    ];
                    hints = [
                        `Chữ số hàng chục là chữ số đứng ở vị trí hàng chục (ở giữa).`,
                        `Số chục là số lượng chục đầy đủ trong số đó (bằng cách bỏ đi chữ số hàng đơn vị).`
                    ];
                    solutionHtml = `Số $${num}$ có chữ số hàng chục là $${chuSoHangChuc}$ và số chục là $${soChuc}$ (vì $${num} = ${soChuc} \\cdot 10 + ${c}$).`;
                } else if (variant === 2) {
                    const a = this.randomInt(2, 8);
                    let b = this.randomInt(1, 9);
                    while (b === a) { b = this.randomInt(1, 9); }
                    const c = this.randomInt(1, 9);
                    const d = this.randomInt(0, 9);
                    const num = a * 1000 + b * 100 + c * 10 + d;
                    questionText = `Cho số tự nhiên $N = ${num}$. Xác định số trăm và chữ số hàng trăm của $N$.`;
                    const soTram = a * 10 + b;
                    const chuSoHangTram = b;
                    options = [
                        `Số trăm là $${soTram}$, chữ số hàng trăm là $${chuSoHangTram}$`,
                        `Số trăm là $${chuSoHangTram}$, chữ số hàng trăm là $${soTram}$`,
                        `Số trăm là $${soTram}$, chữ số hàng trăm là $${a}$`,
                        `Số trăm là $${soTram * 10}$, chữ số hàng trăm là $${chuSoHangTram}$`
                    ];
                    hints = [
                        `Chữ số hàng trăm là chữ số ở vị trí hàng trăm (thứ hai từ trái sang trong số có 4 chữ số).`,
                        `Số trăm là số lượng trăm đầy đủ trong số đó (bằng cách bỏ đi 2 chữ số hàng chục và hàng đơn vị).`
                    ];
                    solutionHtml = `Số $${num}$ có chữ số hàng trăm là $${chuSoHangTram}$ và số trăm là $${soTram}$ (vì $${num} = ${soTram} \\cdot 100 + ${c * 10 + d}$).`;
                } else {
                    const a = this.randomInt(6, 9);
                    const b = this.randomInt(1, 5);
                    const num = a * 1000 + b * 100 + this.randomInt(10, 99);
                    questionText = `Trong số tự nhiên $${num}$, giá trị của chữ số $${a}$ lớn hơn giá trị của chữ số $${b}$ bao nhiêu đơn vị?`;
                    const valA = a * 1000;
                    const valB = b * 100;
                    const diff = valA - valB;
                    options = [
                        `$${diff}$ đơn vị`,
                        `$${a - b}$ đơn vị`,
                        `$${(a - b) * 100}$ đơn vị`,
                        `$${diff - 900}$ đơn vị`
                    ];
                    hints = [
                        `Xác định chữ số $${a}$ ở hàng nghìn nên giá trị của nó là $${a} \\cdot 1000$.`,
                        `Xác định chữ số $${b}$ ở hàng trăm nên giá trị của nó là $${b} \\cdot 100$.`,
                        `Lấy hiệu của hai giá trị này để tìm đáp án.`
                    ];
                    solutionHtml = `Chữ số $${a}$ nằm ở hàng nghìn nên có giá trị là $${valA}$. Chữ số $${b}$ nằm ở hàng trăm nên có giá trị là $${valB}$. Hiệu giá trị của chúng là: $${valA} - ${valB} = ${diff}$ đơn vị.`;
                }
                tip = "Hãy phân biệt rõ chữ số (0-9) và giá trị của chữ số đó theo hàng.";
                break;
            }
            case "ghi-so-tu-nhien-d2": {
                const variant = this.randomInt(1, 3);
                if (variant === 1) {
                    questionText = `Từ các chữ số $1, 0, 5, 8$, viết số tự nhiên chẵn nhỏ nhất có 3 chữ số khác nhau.`;
                    options = [`$108$`, `$102$`, `$158$`, `$180$`];
                    hints = [
                        `Số có 3 chữ số khác nhau phải chọn hàng trăm nhỏ nhất khác 0, tức là 1.`,
                        `Tiếp theo, hàng chục nhỏ nhất khác 1 là 0. Hàng đơn vị phải chẵn và khác 1, 0 để số là nhỏ nhất và chẵn. Số chẵn có thể tận cùng là 8.`
                    ];
                    solutionHtml = `Hàng trăm nhỏ nhất khác 0 là 1. Hàng chục nhỏ nhất tiếp theo là 0. Hàng đơn vị phải là số chẵn khác 1 và 0, từ tập $\\{1, 0, 5, 8\\}$ ta chỉ có số 8 là chẵn thỏa mãn. Vậy số đó là $108$.`;
                } else if (variant === 2) {
                    questionText = `Từ các chữ số $3, 0, 8, 9$, viết số tự nhiên lẻ lớn nhất có 3 chữ số khác nhau.`;
                    options = [`$983$`, `$989$`, `$903$`, `$893$`];
                    hints = [
                        `Để được số lớn nhất, ta chọn chữ số hàng trăm lớn nhất có thể (chọn 9).`,
                        `Hàng chục tiếp theo chọn chữ số lớn nhất còn lại (chọn 8).`,
                        `Hàng đơn vị phải lẻ và khác 9, 8, ta còn lại chữ số 3 lẻ. số là $983$.`
                    ];
                    solutionHtml = `Hàng trăm lớn nhất chọn 9. Hàng chục lớn nhất còn lại chọn 8. Hàng đơn vị phải là chữ số lẻ từ tập $\\{3, 0, 8, 9\\}$ và khác 9, nên ta chọn 3. Số đó là $983$.`;
                } else {
                    questionText = `Từ các chữ số $2, 0, 5, 7$, lập số lớn nhất có 4 chữ số khác nhau là $A$ và số nhỏ nhất có 4 chữ số khác nhau là $B$. Tính hiệu $A - B$.`;
                    const maxNum = 7520;
                    const minNum = 2057;
                    const diff = maxNum - minNum;
                    options = [`$${diff}$`, `$${maxNum + minNum}$`, `$5473$`, `$5600$`];
                    hints = [
                        `Để lập số lớn nhất $A$, ta xếp các chữ số giảm dần từ trái sang phải: $7520$.`,
                        `Để lập số nhỏ nhất $B$, ta chọn hàng nghìn nhỏ nhất khác 0 (chọn 2), sau đó xếp các chữ số tăng dần từ trái sang phải: $2057$.`,
                        `Tính hiệu: $A - B = 7520 - 2057$.`
                    ];
                    solutionHtml = `Số lớn nhất lập được là $A = 7520$. Số nhỏ nhất lập được là $B = 2057$. Hiệu của chúng là: $A - B = 7520 - 2057 = ${diff}$.`;
                }
                tip = "Để số lớn nhất thì xếp từ lớn đến bé, để số nhỏ nhất thì xếp từ bé đến lớn (lưu ý hàng đầu khác 0).";
                break;
            }
            case "ghi-so-tu-nhien-d3": {
                const variant = this.randomInt(1, 3);
                if (variant === 1) {
                    const a = this.randomInt(2, 9);
                    questionText = `Một số tự nhiên có hai chữ số sẽ tăng thêm bao nhiêu đơn vị nếu ta viết thêm chữ số $${a}$ vào bên trái số đó?`;
                    const increase = a * 100;
                    options = [`$${increase}$ đơn vị`, `$${a}$ đơn vị`, `$${a * 10}$ đơn vị`, `$${increase + 10}$ đơn vị`];
                    hints = [
                        `Khi viết thêm chữ số vào bên trái số có hai chữ số, ta đã thêm chữ số đó vào hàng trăm.`,
                        `Giá trị tăng thêm bằng chữ số đó nhân với giá trị hàng tương ứng (ở đây là hàng trăm).`
                    ];
                    solutionHtml = `Viết thêm chữ số $${a}$ vào bên trái số có hai chữ số tức là ta tạo ra một số mới có chữ số $${a}$ ở hàng trăm, do đó giá trị tăng thêm là $${a} \\cdot 100 = ${increase}$ đơn vị.`;
                } else if (variant === 2) {
                    const a = this.randomInt(1, 9);
                    questionText = `Một số tự nhiên sẽ thay đổi như thế nào nếu ta viết thêm chữ số $${a}$ vào bên phải số đó?`;
                    const correctStr = `Tăng gấp 10 lần và thêm $${a}$ đơn vị`;
                    options = [
                        correctStr,
                        `Tăng thêm $${a}$ đơn vị`,
                        `Tăng gấp 10 lần`,
                        `Tăng thêm $${a * 10}$ đơn vị`
                    ];
                    hints = [
                        `Hãy gọi số ban đầu là $x$. Khi viết thêm chữ số $${a}$ vào bên phải, ta được số mới có cấu tạo là $\\overline{x${a}}$.`,
                        `Biểu diễn số mới theo cấu tạo thập phân: $\\overline{x${a}} = 10 \\cdot x + ${a}$.`
                    ];
                    solutionHtml = `Gọi số ban đầu là $x$. Khi viết thêm $${a}$ vào bên phải, số mới có dạng $\\overline{x${a}} = 10 \\cdot x + ${a}$. Như vậy, số đó đã tăng gấp 10 lần và thêm $${a}$ đơn vị.`;
                } else {
                    questionText = `Nếu viết thêm chữ số 0 vào bên phải một số tự nhiên khác 0, số đó sẽ thay đổi thế nào?`;
                    const correctStr = `Gấp lên 10 lần`;
                    options = [
                        correctStr,
                        `Gấp lên 100 lần`,
                        `Tăng thêm 10 đơn vị`,
                        `Không thay đổi giá trị`
                    ];
                    hints = [
                        `Khi viết thêm chữ số 0 vào bên phải số $A$, ta được số mới là $A0$.`,
                        `Ta có $A0 = A \\cdot 10$.`
                    ];
                    solutionHtml = `Số mới có dạng $A0 = 10 \\cdot A$. Vậy số đó gấp lên 10 lần so với ban đầu.`;
                }
                tip = "Thêm chữ số vào bên trái hoặc bên phải sẽ làm dịch chuyển hàng của các chữ số cũ.";
                break;
            }
            case "ghi-so-tu-nhien-d4": {
                const variant = this.randomInt(1, 3);
                if (variant === 1) {
                    const listVal = [14, 19, 24, 29];
                    const val = listVal[this.randomInt(0, 3)];
                    const mapRomans = { 14: "XIV", 19: "XIX", 24: "XXIV", 29: "XXIX" };
                    const rom = mapRomans[val];
                    questionText = `Số tự nhiên $${val}$ được viết dưới dạng chữ số La Mã là:`;
                    options = [
                        `$${rom}$`,
                        `$${rom.replace("IV", "VI").replace("IX", "XI")}$`,
                        `$${rom.substring(1)}$`,
                        `$X${rom}$`
                    ];
                    hints = [
                        `Phân tích $${val}$ thành chục và đơn vị lẻ: ví dụ $14 = 10 + 4$; $29 = 20 + 9$.`,
                        `Ký hiệu $10 = X$, $4 = IV$, $9 = IX$.`
                    ];
                    solutionHtml = `Số $${val}$ được phân tích thành: $${val === 14 ? '10 + 4' : val === 19 ? '10 + 9' : val === 24 ? '20 + 4' : '20 + 9'}$. Trong chữ số La Mã: $10 \\rightarrow X$, $20 \\rightarrow XX$, $4 \\rightarrow IV$, $9 \\rightarrow IX$. Ghép lại ta được $${rom}$.`;
                } else if (variant === 2) {
                    const romans = ["XVIII", "XXIV", "XXVII", "XXIX"];
                    const rom = romans[this.randomInt(0, 3)];
                    const mapVals = { "XVIII": 18, "XXIV": 24, "XXVII": 27, "XXIX": 29 };
                    const val = mapVals[rom];
                    questionText = `Số La Mã $${rom}$ biểu diễn giá trị nào trong hệ thập phân?`;
                    options = [`$${val}$`, `$${val - 2}$`, `$${val + 2}$`, `$${val - 10}$`];
                    hints = [
                        `Ký hiệu $X = 10$, $XX = 20$.`,
                        `Nhận diện chữ số hàng đơn vị lẻ ở sau: $VIII = 8$, $IV = 4$, $VII = 7$, $IX = 9$.`
                    ];
                    solutionHtml = `Số La Mã $${rom}$ có $XX = 20$ (hoặc $X=10$) và phần lẻ phía sau. Cộng các giá trị lại ta được: $${val}$.`;
                } else {
                    const exprs = [
                        { text: "XII + IX", val: 12 + 9, resRom: "XXI" },
                        { text: "XV + IX", val: 15 + 9, resRom: "XXIV" },
                        { text: "XI + XIV", val: 11 + 14, resRom: "XXV" }
                    ];
                    const exp = exprs[this.randomInt(0, exprs.length - 1)];
                    questionText = `Tính giá trị của biểu thức sau và viết kết quả dưới dạng số La Mã: $${exp.text}$`;
                    options = [
                        `$${exp.resRom}$`,
                        `$${exp.resRom.includes("I") ? exp.resRom.replace("I", "V") : exp.resRom.replace("V", "I")}$`,
                        `$${exp.resRom.replace("X", "I")}$`,
                        `$X${exp.resRom}$`
                    ];
                    hints = [
                        `Đổi các số La Mã trong phép tính sang hệ thập phân: $XI = 11$, $XII = 12$, $XIV = 14$, $XV = 15$, $IX = 9$.`,
                        `Tính tổng của hai số đó trong hệ thập phân rồi viết lại kết quả dưới dạng số La Mã.`
                    ];
                    solutionHtml = `Đổi sang số tự nhiên: phép tính tương đương với $${exp.text.replace("XII", "12").replace("XI", "11").replace("XV", "15").replace("XIV", "14").replace("IX", "9")} = ${exp.val}$. Đổi số $${exp.val}$ sang số La Mã ta được $${exp.resRom}$.`;
                }
                tip = "Quy tắc viết La Mã: Viết các hàng lớn trước, hàng nhỏ sau.";
                break;
            }
            case "tap-hop": {
                if (level === "co-ban") {
                    const a = this.randomInt(1, 6);
                    const b = a + this.randomInt(3, 4);
                    questionText = `Cho tập hợp $A = \\{x \\in \\mathbb{N} \\mid ${a} < x \\le ${b}\\}$. Viết tập hợp $A$ bằng cách liệt kê phần tử.`;
                    
                    const correctArr = [];
                    for(let x = a + 1; x <= b; x++) correctArr.push(x);
                    const correctStr = `$A = \\{${correctArr.join('; ')}\\}$`;
                    
                    options = [
                        correctStr,
                        `$A = \\{${[a, ...correctArr].join('; ')}\\}$`,
                        `$A = \\{${correctArr.slice(0, -1).join('; ')}\\}$`,
                        `$A = \\{${correctArr.map(x=>x+1).join('; ')}\\}$`
                    ];
                    hints = [
                        `Ký hiệu $a < x \\le b$ nghĩa là số tự nhiên đó lớn hơn $a$ và bé hơn hoặc bằng $b$.`,
                        `Vì vậy ta không lấy giá trị $${a}$, nhưng có lấy giá trị $${b}$.`
                    ];
                    solutionHtml = `Các phần tử là số tự nhiên lớn hơn $${a}$ và bé hơn hoặc bằng $${b}$ bao gồm: $${correctArr.join(', ')}$. Viết dưới dạng liệt kê là $A = \\{${correctArr.join('; ')}\\}$.`;
                    tip = "Hãy để ý dấu ngoặc tròn hay vuông của các khoảng giá trị, dấu $<$ không lấy biên, dấu $\\le$ có lấy biên.";
                } else if (level === "nang-cao") {
                    const a = this.randomInt(5, 12);
                    const b = a + this.randomInt(10, 15);
                    const isEven = this.randomInt(0, 1) === 0;
                    
                    questionText = `Cho tập hợp $B = \\{x \\in \\mathbb{N} \\mid x \\text{ là số tự nhiên ${isEven ? 'chẵn' : 'lẻ'} và } ${a} < x \\le ${b}\\}$. Tính số phần tử của tập hợp $B$.`;
                    
                    const elements = [];
                    for (let i = a + 1; i <= b; i++) {
                        if (isEven && i % 2 === 0) elements.push(i);
                        if (!isEven && i % 2 !== 0) elements.push(i);
                    }
                    const correctStr = `$${elements.length}$ phần tử`;
                    
                    options = [
                        correctStr,
                        `$${elements.length + 1}$ phần tử`,
                        `$${elements.length - 1}$ phần tử`,
                        `$${elements.length + 2}$ phần tử`
                    ];
                    hints = [
                        `Hãy liệt kê tất cả các số tự nhiên lớn hơn $${a}$ và nhỏ hơn hoặc bằng $${b}$.`,
                        `Lọc ra các số ${isEven ? 'chẵn' : 'lẻ'} trong dãy vừa liệt kê rồi đếm số lượng.`
                    ];
                    solutionHtml = `Các số tự nhiên lớn hơn $${a}$ và nhỏ hơn hoặc bằng $${b}$ là: $${Array.from({length: b - a}, (_, i) => a + 1 + i).join(', ')}$.<br>Trong đó, các số ${isEven ? 'chẵn' : 'lẻ'} là: $\\{${elements.join('; ')}\\}$.<br>Vậy tập hợp $B$ có $${elements.length}$ phần tử.`;
                    tip = "Nhớ rằng số chẵn là số có chữ số tận cùng là 0, 2, 4, 6, 8. Số lẻ là số có chữ số tận cùng là 1, 3, 5, 7, 9.";
                } else { // kho
                    questionText = `Gọi $A$ là tập hợp các số tự nhiên có hai chữ số chia hết cho $3$, $B$ là tập hợp các số tự nhiên có hai chữ số chia hết cho $5$. Hỏi tập hợp giao $C = A \\cap B$ có bao nhiêu phần tử?`;
                    const correctStr = `$6$ phần tử`;
                    options = [correctStr, `$5$ phần tử`, `$7$ phần tử`, `$12$ phần tử`];
                    hints = [
                        `Tập hợp giao $C = A \\cap B$ gồm các số tự nhiên có hai chữ số vừa chia hết cho 3, vừa chia hết cho 5.`,
                        `Số vừa chia hết cho 3 vừa chia hết cho 5 thì phải chia hết cho $15$ (bội chung nhỏ nhất của 3 và 5). Hãy liệt kê các số chia hết cho 15 có hai chữ số.`
                    ];
                    solutionHtml = `Số tự nhiên vừa chia hết cho $3$ vừa chia hết cho $5$ thì phải chia hết cho $\\text{BCNN}(3; 5) = 15$.<br>Các số tự nhiên có hai chữ số chia hết cho $15$ là: $15; 30; 45; 60; 75; 90$.<br>Vậy tập hợp giao $C = A \\cap B$ có $6$ phần tử.`;
                    tip = "Bội chung của hai số chia chính là phần giao của hai tập hợp chia hết.";
                }
                break;
            }
            case "ghi-so-tu-nhien": {
                if (level === "co-ban") {
                    const val = this.randomInt(12, 29);
                    const romans = {
                        12:"XII", 13:"XIII", 14:"XIV", 15:"XV", 16:"XVI", 17:"XVII", 18:"XVIII", 19:"XIX",
                        21:"XXI", 22:"XXII", 23:"XXIII", 24:"XXIV", 25:"XXV", 26:"XXVI", 27:"XXVII", 28:"XXVIII", 29:"XXIX"
                    };
                    const rom = romans[val] || "XV";
                    questionText = `Số La Mã $${rom}$ biểu diễn giá trị nào trong hệ thập phân?`;
                    options = [`$${val}$`, `$${val - 2}$`, `$${val + 2}$`, `$${val + 1}$`];
                    hints = [
                        `Ký hiệu $X = 10$, $XX = 20$.`,
                        `Các ký hiệu đơn vị lẻ ở sau: $IV = 4$, $V = 5$, $IX = 9$.`
                    ];
                    solutionHtml = `Ta có $XX = 20$. Phần phía sau là $${rom.replace("XX", "")}$ biểu diễn giá trị $${val % 10}$. Cộng lại: $20 + ${val % 10} = ${val}$.`;
                    tip = "Hãy thuộc lòng các số La Mã từ 1 đến 10 để ghép nhanh các số lớn.";
                } else if (level === "nang-cao") {
                    questionText = `Cho số tự nhiên $x = \\overline{a5b}$ ($a \\neq 0$). Phân tích giá trị của số $x$ theo cấu tạo các chữ số hàng trăm, chục, đơn vị.`;
                    options = [
                        `$x = 100a + 50 + b$`,
                        `$x = 100a + 5 + b$`,
                        `$x = a + 5 + b$`,
                        `$x = 100a + 10b + 5$`
                    ];
                    hints = [
                        `Chữ số $a$ ở hàng trăm nên giá trị là $100 \\cdot a$.`,
                        `Chữ số 5 ở hàng chục nên giá trị là $10 \\cdot 5 = 50$.`
                    ];
                    solutionHtml = `Số tự nhiên $\\overline{a5b}$ có chữ số $a$ ở hàng trăm, chữ số $5$ ở hàng chục và chữ số $b$ ở hàng đơn vị. Nên biểu diễn là: $100 \\cdot a + 50 + b$.`;
                    tip = "Mỗi chữ số ở một hàng sẽ được nhân với lũy thừa tương ứng của 10.";
                } else { // kho
                    const pages = this.randomInt(105, 125);
                    const totalDigits = 9 + 180 + (pages - 99) * 3;
                    questionText = `Để đánh số trang của một cuốn sách (bắt đầu từ trang 1), người ta đã sử dụng tất cả $${totalDigits}$ chữ số. Hỏi cuốn sách đó dày bao nhiêu trang?`;
                    options = [`$${pages}$ trang`, `$${pages - 3}$ trang`, `$${pages + 5}$ trang`, `$${pages - 10}$ trang`];
                    this.shuffle(options);
                    correctIndex = options.indexOf(`$${pages}$ trang`);
                    
                    hints = [
                        `Nhớ lại số chữ số dùng cho các trang có 1 chữ số (trang 1-9) là 9 chữ số.`,
                        `Số chữ số dùng cho các trang có 2 chữ số (trang 10-99) là $90 \\cdot 2 = 180$ chữ số.`,
                        `Lấy tổng số chữ số trừ đi $189$ ($9 + 180$) sẽ ra số chữ số dùng cho các trang có 3 chữ số. Lấy kết quả đó chia cho 3 để tìm số trang có 3 chữ số.`
                    ];
                    solutionHtml = `Số chữ số để đánh các trang từ 1 đến 9 là: $9 \\cdot 1 = 9$ chữ số.<br>Số chữ số để đánh các trang từ 10 đến 99 là: $90 \\cdot 2 = 180$ chữ số.<br>Số chữ số dùng cho các trang có 3 chữ số (từ trang 100 trở đi) là: $${totalDigits} - 9 - 180 = ${totalDigits - 189}$ chữ số.<br>Số trang có 3 chữ số là: $${totalDigits - 189} : 3 = ${pages - 99}$ trang.<br>Vậy cuốn sách đó có: $99 + ${pages - 99} = ${pages}$ trang.`;
                    tip = "Bài toán ngược cần làm từng bước: tính lượng chữ số từ trang 1-9 và 10-99 trước để trừ đi.";
                }
                break;
            }
            case "tap-hop-thu-tu": {
                if (level === "co-ban") {
                    const a = this.randomInt(100, 200);
                    const b = a + this.randomInt(2, 5);
                    questionText = `Phát biểu nào dưới đây về vị trí trên tia số nằm ngang là **đúng**?`;
                    options = [
                        `Điểm $${a}$ nằm bên trái điểm $${b}$ vì $${a} < ${b}$.`,
                        `Điểm $${a}$ nằm bên phải điểm $${b}$ vì $${a} < ${b}$.`,
                        `Điểm $${b}$ nằm bên trái điểm $${a}$ vì $${b} > ${a}$.`,
                        `Điểm $${a}$ và $${b}$ trùng nhau vì cùng là số tự nhiên.`
                    ];
                    hints = [
                        `On tia số nằm ngang, số nhỏ hơn được biểu diễn bởi điểm nằm ở bên trái số lớn hơn.`,
                        `So sánh hai số $${a}$ và $${b}$.`
                    ];
                    solutionHtml = `Vì $${a} < ${b}$, nên trên tia số nằm ngang biểu diễn số tự nhiên, điểm $${a}$ phải nằm ở bên trái điểm $${b}$.`;
                    tip = "Bên trái tia số nằm ngang là chiều nhỏ hơn, bên phải là chiều lớn hơn.";
                } else if (level === "nang-cao") {
                    const a = this.randomInt(15, 25);
                    const b = a + 4;
                    questionText = `Viết tập hợp $X$ các số tự nhiên thỏa mãn điều kiện: $${a} \\le x < ${b}$.`;
                    const correctArr = [];
                    for(let i=a; i<b; i++) correctArr.push(i);
                    const correctStr = `$X = \\{${correctArr.join('; ')}\\}$`;
                    options = [
                        correctStr,
                        `$X = \\{${[a-1, ...correctArr].join('; ')}\\}$`,
                        `$X = \\{${correctArr.concat([b]).join('; ')}\\}$`,
                        `$X = \\{${correctArr.slice(1).join('; ')}\\}$`
                    ];
                    hints = [
                        `Dấu $\\le$ chỉ ra có lấy giá trị $${a}$.`,
                        `Dấu $<$ chỉ ra không lấy giá trị $${b}$.`
                    ];
                    solutionHtml = `Số tự nhiên $x$ thỏa mãn $${a} \\le x < ${b}$ là các số: $${correctArr.join(', ')}$, do đó tập hợp là $X = \\{${correctArr.join('; ')}\\}$.`;
                    tip = "Chú ý dấu ngoặc bằng ($\\le$) lấy cả giá trị biên.";
                } else { // kho
                    const sum = this.randomInt(21, 25);
                    const lastDigit = 9;
                    const middleDigit = 9;
                    const firstDigit = sum - 18;
                    const num = firstDigit * 100 + middleDigit * 10 + lastDigit;
                    questionText = `Tìm số tự nhiên nhỏ nhất có tổng các chữ số bằng $${sum}$.`;
                    options = [`$${num}$`, `$${num + 90}$`, `$1${sum - 1}9$`, `$99${firstDigit}$`];
                    this.shuffle(options);
                    correctIndex = options.indexOf(`$${num}$`);

                    hints = [
                        `Để tìm số tự nhiên nhỏ nhất, ta cần số có ít chữ số nhất có thể.`,
                        `Vì giá trị lớn nhất của mỗi chữ số là 9, ta chọn các chữ số từ hàng đơn vị trở lên lớn nhất (chọn hàng đơn vị là 9, hàng chục là 9).`,
                        `Chữ số hàng trăm (hàng cao nhất còn lại) sẽ bằng tổng chữ số trừ đi các chữ số đã chọn.`
                    ];
                    solutionHtml = `Vì mỗi chữ số không vượt quá 9, ta thấy số đó không thể có 2 chữ số (vì tổng tối đa của 2 chữ số là $9 + 9 = 18 < ${sum}$).<br>Do đó, số nhỏ nhất phải là số có 3 chữ số.<br>Để số này nhỏ nhất, chữ số hàng trăm phải nhỏ nhất, đồng nghĩa với việc ta xếp các chữ số ở hàng đơn vị và hàng chục lớn nhất có thể: hàng đơn vị là 9, hàng chục là 9.<br>Chữ số hàng trăm là: $${sum} - (9 + 9) = ${firstDigit}$.<br>Vậy số tự nhiên nhỏ nhất thỏa mãn là $${num}$.`;
                    tip = "Xếp các chữ số lớn nhất (9) từ phải qua trái sẽ thu được chữ số hàng lớn nhất bên trái nhỏ nhất.";
                }
                break;
            }
            case "cong-tru-so-tu-nhien": {
                if (level === "co-ban") {
                    const a = this.randomInt(15, 30) * 10 - 2; 
                    const b = this.randomInt(5, 12) * 10 + 2; 
                    const c = this.randomInt(120, 250);
                    questionText = `Tính nhanh tổng: $M = ${a} + ${c} + ${b}$`;
                    const correctVal = a + b + c;
                    options = [`$${correctVal}$`, `$${correctVal - 10}$`, `$${correctVal + 10}$`, `$${correctVal + 100}$`];
                    hints = [
                        `Nhóm hai số hạng $${a}$ và $${b}$ vì chúng có tổng tròn trăm.`,
                        `Tính tổng: $(${a} + ${b}) + ${c}$.`
                    ];
                    solutionHtml = `Ta có $M = (${a} + ${b}) + ${c} = ${a+b} + ${c} = ${correctVal}$.`;
                    tip = "Tìm các cặp chữ số hàng đơn vị có tổng bằng 10 để nhóm tròn chục/trăm.";
                } else if (level === "nang-cao") {
                    const a = this.randomInt(150, 250);
                    const b = this.randomInt(30, 80);
                    const c = this.randomInt(15, 25);
                    questionText = `Tìm số tự nhiên $x$, biết: $${a} - (x - ${b}) = ${c}$`;
                    const correctVal = a - c + b;
                    options = [`$x = ${correctVal}$`, `$x = ${a - c - b}$`, `$x = ${a + c - b}$`, `$x = ${correctVal + 10}$`];
                    hints = [
                        `Coi $(x - ${b})$ là số trừ chưa biết. Ta có: $x - ${b} = ${a} - ${c}$.`,
                        `Tính hiệu ở vế phải rồi tìm $x$.`
                    ];
                    solutionHtml = `Ta có: $x - ${b} = ${a} - ${c} \\rightarrow x - ${b} = ${a - c}$.<br>Từ đó: $x = ${a - c} + ${b} = ${correctVal}$.`;
                    tip = "Hãy coi cả cụm trong ngoặc như một số chưa biết và giải quyết từng lớp từ ngoài vào trong.";
                } else { // kho
                    const d = this.randomInt(3, 5);
                    const start = this.randomInt(4, 7) * d;
                    const numTerms = this.randomInt(20, 25);
                    const end = start + (numTerms - 1) * d;
                    const correctVal = (start + end) * numTerms / 2;
                    questionText = `Tính nhanh tổng của dãy số cách đều sau: $S = ${start} + ${start + d} + ${start + 2*d} + ... + ${end}$`;
                    options = [`$${correctVal}$`, `$${correctVal - start}$`, `$${correctVal + end}$`, `$${correctVal + 100}$`];
                    this.shuffle(options);
                    correctIndex = options.indexOf(`$${correctVal}$`);

                    hints = [
                        `Tìm số số hạng của dãy bằng công thức: $(\\text{Số cuối} - \\text{Số đầu}) : \\text{Khoảng cách} + 1$.`,
                        `Tính tổng bằng công thức: $(\\text{Số cuối} + \\text{Số đầu}) \\cdot \\text{Số số hạng} : 2$.`
                    ];
                    solutionHtml = `Khoảng cách giữa hai số liên tiếp là $${d}$.<br>Số số hạng của dãy là: $(${end} - ${start}) : ${d} + 1 = ${numTerms}$ số hạng.<br>Tổng của dãy số là: $(${start} + ${end}) \\cdot ${numTerms} : 2 = ${start + end} \\cdot ${numTerms} : 2 = ${correctVal}$.`;
                    tip = "Nhớ thuộc lòng hai công thức: tính số số hạng và tính tổng của dãy số cách đều.";
                }
                break;
            }
            case "nhan-chia-so-tu-nhien": {
                if (level === "co-ban") {
                    const b = this.randomInt(7, 12);
                    const q = this.randomInt(6, 12);
                    const r = this.randomInt(1, b - 1);
                    const a = b * q + r;
                    questionText = `Số tự nhiên $x$ chia cho $${b}$ được thương là $${q}$ và số dư là $${r}$. Tìm $x$.`;
                    options = [`$x = ${a}$`, `$x = ${b * q}$`, `$x = ${b * q - r}$`, `$x = ${a + b}$`];
                    hints = [
                        `Công thức phép chia có dư: Số bị chia = Số chia $\\cdot$ Thương + Số dư.`,
                        `Áp dụng: $x = ${b} \\cdot ${q} + ${r}$.`
                    ];
                    solutionHtml = `Ta áp dụng công thức phép chia có dư: $x = ${b} \\cdot ${q} + ${r} = ${b * q} + ${r} = ${a}$.`;
                    tip = "Hãy nhớ số dư luôn luôn nhỏ hơn số chia.";
                } else if (level === "nang-cao") {
                    const a = this.randomInt(25, 45);
                    const b = this.randomInt(12, 18);
                    const c = 100 - b; 
                    questionText = `Tính nhanh giá trị biểu thức: $T = ${a} \\cdot ${b} + ${a} \\cdot ${c}$`;
                    const correctVal = a * 100;
                    options = [`$${correctVal}$`, `$${a * 10}$`, `$${correctVal + 100}$`, `$${a * (b - c)}$`];
                    hints = [
                        `Áp dụng tính chất phân phối của phép nhân đối với phép cộng: $a \\cdot b + a \\cdot c = a \\cdot (b + c)$.`,
                        `Tính tổng trong ngoặc trước: $${b} + ${c} = 100$.`
                    ];
                    solutionHtml = `Ta có $T = ${a} \\cdot (${b} + ${c}) = ${a} \\cdot 100 = ${correctVal}$.`;
                    tip = "Đặt thừa số chung ra ngoài ngoặc để quy về phép nhân với số tròn chục/trăm.";
                } else { // kho
                    questionText = `Tìm số tự nhiên nhỏ nhất khi chia cho $3$ thì dư $2$, còn khi chia cho $5$ thì dư $3$.`;
                    options = [`$8$`, `$13$`, `$17$`, `$23$`];
                    hints = [
                        `Gọi số tự nhiên đó là $x$. Ta có: $x = 3a + 2$ và $x = 5b + 3$.`,
                        `Nếu ta cộng thêm $7$ đơn vị vào số đó, hãy xem $x + 7$ sẽ chia hết cho những số nào?`,
                        `$x + 7$ sẽ chia hết cho cả 3 và 5. Do đó $x + 7$ là bội của 15. Tìm bội nhỏ nhất của 15 rồi trừ đi 7.`
                    ];
                    solutionHtml = `Gọi số cần tìm là $x$ ($x \\in \\mathbb{N}$).<br>Vì $x$ chia $3$ dư $2$ nên $x + 7$ chia hết cho $3$.<br>Vì $x$ chia $5$ dư $3$ nên $x + 7$ chia hết cho $5$.<br>Do đó, $x + 7$ vừa chia hết cho 3 vừa chia hết cho 5, suy ra $x + 7$ chia hết cho $15$ (BCNN của 3 và 5).<br>Để $x$ nhỏ nhất thì $x + 7$ phải là số tự nhiên nhỏ nhất chia hết cho 15 (khác 0), tức là $x + 7 = 15 \\rightarrow x = 8$.<br>Thử lại: $8$ chia $3$ dư $2$ (đúng) và $8$ chia $5$ dư $3$ (đúng). Vậy số nhỏ nhất thỏa mãn là $8$.`;
                    tip = "Phương pháp thêm bớt đơn vị để đưa bài toán chia có dư về bài toán chia hết là kĩ thuật rất mạnh trong số học.";
                }
                break;
            }
            case "luy-thua": {
                if (level === "co-ban") {
                    const variant = this.randomInt(1, 4);
                    if (variant === 1) {
                        // Tính giá trị của lũy thừa
                        const base = this.randomInt(2, 5);
                        const exponent = this.randomInt(2, 4);
                        questionText = `Tính giá trị của lũy thừa sau: $A = ${base}^{${exponent}}$`;
                        const correctVal = Math.pow(base, exponent);
                        options = [`$${correctVal}$`, `$${base * exponent}$`, `$${correctVal + 2}$`, `$${base + exponent}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const wrong = correctVal + this.randomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
                            if (wrong > 0 && !options.includes(`$${wrong}$`)) options.push(`$${wrong}$`);
                        }
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Lũy thừa bậc $n$ của $a$ là tích của $n$ thừa số $a$ nhân với nhau.`,
                            `$${base}^{${exponent}} = ${new Array(exponent).fill(base).join(' \\cdot ')}$`
                        ];
                        solutionHtml = `Ta có $${base}^{${exponent}} = ${new Array(exponent).fill(base).join(' \\cdot ')} = ${correctVal}$.`;
                        tip = "Đừng nhầm lẫn lũy thừa $a^n$ với phép nhân $a \\cdot n$.";
                    } else if (variant === 2) {
                        // Nhân hai lũy thừa cùng cơ số
                        const base = this.randomInt(2, 5);
                        const m = this.randomInt(2, 4);
                        const n = this.randomInt(2, 3);
                        questionText = `Viết kết quả phép tính sau dưới dạng một lũy thừa: $C = ${base}^{${m}} \\cdot ${base}^{${n}}$`;
                        const correctExp = m + n;
                        options = [`$${base}^{${correctExp}}$`, `$${base}^{${m * n}}$`, `$${base + base}^{${correctExp}}$`, `$${base}^{${m - n}}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const wrong = correctExp + this.randomInt(1, 3);
                            const opt = `$${base}^{${wrong}}$`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${base}^{${correctExp}}$`);
                        hints = [
                            `Khi nhân hai lũy thừa cùng cơ số, ta giữ nguyên cơ số và cộng các số mũ.`,
                            `Công thức: $a^m \\cdot a^n = a^{m+n}$`
                        ];
                        solutionHtml = `Ta có: $${base}^{${m}} \\cdot ${base}^{${n}} = ${base}^{${m} + ${n}} = ${base}^{${correctExp}}$.`;
                        tip = "Cơ số giữ nguyên, số mũ đem cộng lại.";
                    } else if (variant === 3) {
                        // Chia hai lũy thừa cùng cơ số
                        const base = this.randomInt(2, 5);
                        const m = this.randomInt(4, 6);
                        const n = this.randomInt(2, 3);
                        questionText = `Viết kết quả phép tính sau dưới dạng một lũy thừa: $D = ${base}^{${m}} : ${base}^{${n}}$`;
                        const correctExp = m - n;
                        options = [`$${base}^{${correctExp}}$`, `$${base}^{${m / n}}$`, `$${base}^{${m + n}}$`, `$${base - 1}^{${correctExp}}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const wrong = Math.abs(correctExp + this.randomInt(1, 3));
                            const opt = `$${base}^{${wrong}}$`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${base}^{${correctExp}}$`);
                        hints = [
                            `Khi chia hai lũy thừa cùng cơ số (khác 0), ta giữ nguyên cơ số và trừ các số mũ.`,
                            `Công thức: $a^m : a^n = a^{m-n}$`
                        ];
                        solutionHtml = `Ta có: $${base}^{${m}} : ${base}^{${n}} = ${base}^{${m} - ${n}} = ${base}^{${correctExp}}$.`;
                        tip = "Cơ số giữ nguyên, số mũ lấy số bị chia trừ số chia.";
                    } else {
                        // Viết tích dưới dạng lũy thừa
                        const base = this.randomInt(2, 9);
                        const count = this.randomInt(3, 5);
                        const arr = new Array(count).fill(base);
                        questionText = `Viết tích sau dưới dạng một lũy thừa: $E = ${arr.join(' \\cdot ')}$`;
                        options = [`$${base}^{${count}}$`, `$${base * count}$`, `$${count}^{${base}}$`, `$${base}^{${count - 1}}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const wrong = count + this.randomInt(1, 3);
                            const opt = `$${base}^{${wrong}}$`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${base}^{${count}}$`);
                        hints = [
                            `Lũy thừa bậc $n$ của $a$ là tích của $n$ thừa số $a$ nhân với nhau.`,
                            `Ở đây ta có tích của $${count}$ thừa số $${base}$.`
                        ];
                        solutionHtml = `Vì có $${count}$ thừa số $${base}$ nhân với nhau nên viết dưới dạng lũy thừa là: $${base}^{${count}}$.`;
                        tip = "Đếm số lượng thừa số giống nhau để xác định số mũ.";
                    }
                } else if (level === "nang-cao") {
                    const variant = this.randomInt(1, 3);
                    if (variant === 1) {
                        // Rút gọn biểu thức nâng cao
                        const base = this.randomInt(2, 3);
                        const m = this.randomInt(4, 6);
                        const n = this.randomInt(2, 3);
                        questionText = `Rút gọn biểu thức sau về một lũy thừa: $B = ${base}^{${m}} \\cdot ${base}^{${n}} : ${base}^{2}$`;
                        const correctExponent = m + n - 2;
                        options = [
                            `$${base}^{${correctExponent}}$`,
                            `$${base}^{${m * n - 2}}$`,
                            `$${base}^{${m + n}}$`,
                            `$${base + base}^{${correctExponent}}$`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const wrongExp = correctExponent + this.randomInt(1, 4) * (Math.random() > 0.5 ? 1 : -1);
                            if (wrongExp > 0 && wrongExp !== correctExponent) {
                                const opt = `$${base}^{${wrongExp}}$`;
                                if (!options.includes(opt)) options.push(opt);
                            }
                        }
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${base}^{${correctExponent}}$`);
                        hints = [
                            `Khi nhân hai lũy thừa cùng cơ số, ta cộng số mũ: $a^m \\cdot a^n = a^{m+n}$.`,
                            `Khi chia hai lũy thừa cùng cơ số, ta trừ số mũ: $a^m : a^n = a^{m-n}$.`
                        ];
                        solutionHtml = `Ta có: $B = ${base}^{${m} + ${n} - 2} = ${base}^{${correctExponent}}$.`;
                        tip = "Khi nhân thì cộng mũ, khi chia thì trừ mũ, cơ số giữ nguyên.";
                    } else if (variant === 2) {
                        // Tìm x trong biểu thức lũy thừa
                        const subVar = this.randomInt(1, 3);
                        if (subVar === 1) {
                            // a^x = b
                            const base = this.randomInt(2, 4);
                            const correctX = this.randomInt(3, 5);
                            const val = Math.pow(base, correctX);
                            questionText = `Tìm số tự nhiên $x$ biết: $${base}^x = ${val}$`;
                            options = [`$x = ${correctX}$`, `$x = ${correctX - 1}$`, `$x = ${correctX + 1}$`, `$x = ${val / base}$`];
                            options = [...new Set(options)];
                            while (options.length < 4) {
                                const wrong = correctX + this.randomInt(2, 5);
                                if (!options.includes(`$x = ${wrong}$`)) options.push(`$x = ${wrong}$`);
                            }
                            this.shuffle(options);
                            correctIndex = options.indexOf(`$x = ${correctX}$`);
                            hints = [
                                `Hãy viết số $${val}$ thành lũy thừa cơ số $${base}$.`,
                                `$${val} = ${base}^{\\text{?}}$`
                            ];
                            solutionHtml = `Ta phân tích: $${val} = ${base}^{${correctX}}$. Do đó, phương trình trở thành $${base}^x = ${base}^{${correctX}}$, suy ra $x = ${correctX}$.`;
                            tip = "Đưa hai vế về cùng cơ số rồi cho hai số mũ bằng nhau.";
                        } else if (subVar === 2) {
                            // x^a = b
                            const correctX = this.randomInt(2, 5);
                            const exp = this.randomInt(2, 3);
                            const val = Math.pow(correctX, exp);
                            questionText = `Tìm số tự nhiên $x$ biết: $x^{${exp}} = ${val}$`;
                            options = [`$x = ${correctX}$`, `$x = ${correctX - 1}$`, `$x = ${correctX + 1}$`, `$x = ${val / exp}$`];
                            options = [...new Set(options)];
                            while (options.length < 4) {
                                const wrong = correctX + this.randomInt(2, 5);
                                if (!options.includes(`$x = ${wrong}$`)) options.push(`$x = ${wrong}$`);
                            }
                            this.shuffle(options);
                            correctIndex = options.indexOf(`$x = ${correctX}$`);
                            hints = [
                                `Hãy tìm một số tự nhiên nâng lên lũy thừa bậc $${exp}$ bằng $${val}$.`,
                                `Nhẩm: $2^{${exp}} = ${Math.pow(2, exp)}$, $3^{${exp}} = ${Math.pow(3, exp)}$, ...`
                            ];
                            solutionHtml = `Ta phân tích: $${val} = ${correctX}^{${exp}}$. Do đó, $x^{${exp}} = ${correctX}^{${exp}}$, suy ra $x = ${correctX}$.`;
                            tip = "Đưa hai vế về cùng số mũ rồi cho hai cơ số bằng nhau.";
                        } else {
                            // a^(x-1) = b
                            const base = this.randomInt(2, 3);
                            const correctX = this.randomInt(3, 5);
                            const val = Math.pow(base, correctX - 1);
                            questionText = `Tìm số tự nhiên $x$ biết: $${base}^{x-1} = ${val}$`;
                            options = [`$x = ${correctX}$`, `$x = ${correctX - 1}$`, `$x = ${correctX - 2}$`, `$x = ${correctX + 1}$`];
                            options = [...new Set(options)];
                            while (options.length < 4) {
                                const wrong = correctX + this.randomInt(2, 4);
                                if (!options.includes(`$x = ${wrong}$`)) options.push(`$x = ${wrong}$`);
                            }
                            this.shuffle(options);
                            correctIndex = options.indexOf(`$x = ${correctX}$`);
                            hints = [
                                `Phân tích $${val}$ thành lũy thừa cơ số $${base}$ để có $${base}^{x-1} = ${base}^n$.`,
                                `Khi đó $x - 1 = n$, suy ra $x = n + 1$.`
                            ];
                            solutionHtml = `Ta có: $${val} = ${base}^{${correctX - 1}}$. Khi đó phương trình là $${base}^{x-1} = ${base}^{${correctX - 1}}$, suy ra $x - 1 = ${correctX - 1} \\Rightarrow x = ${correctX}$.`;
                            tip = "Đừng quên cộng thêm 1 ở bước cuối để tìm x.";
                        }
                    } else {
                        // Lũy thừa của lũy thừa
                        const base = this.randomInt(2, 3);
                        const m = this.randomInt(2, 3);
                        const n = this.randomInt(3, 4);
                        questionText = `Rút gọn biểu thức sau: $F = (${base}^{${m}})^{${n}}$`;
                        const correctExp = m * n;
                        options = [`$${base}^{${correctExp}}$`, `$${base}^{${m + n}}$`, `$${base}^{${Math.pow(m, n)}}$`, `$${base * m}^{${n}}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const wrong = correctExp + this.randomInt(1, 4);
                            const opt = `$${base}^{${wrong}}$`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${base}^{${correctExp}}$`);
                        hints = [
                            `Khi lũy thừa một lũy thừa, ta giữ nguyên cơ số và nhân các số mũ.`,
                            `Công thức: $(a^m)^n = a^{m \\cdot n}$`
                        ];
                        solutionHtml = `Ta có: $(${base}^{${m}})^{${n}} = ${base}^{${m} \\cdot ${n}} = ${base}^{${correctExp}}$.`;
                        tip = "Lũy thừa của lũy thừa thì ta nhân số mũ với nhau.";
                    }
                } else { // kho
                    const variant = this.randomInt(1, 3);
                    if (variant === 1) {
                        // Chữ số tận cùng
                        const bases = [2, 3, 7, 8];
                        const base = bases[this.randomInt(0, bases.length - 1)];
                        const year = 2024 + this.randomInt(0, 3);
                        let lastDigit = 0;
                        let cycle = [];
                        if (base === 2) {
                            cycle = [6, 2, 4, 8]; // 2^0=6 tận cùng chu kỳ 4
                            lastDigit = cycle[year % 4];
                        } else if (base === 3) {
                            cycle = [1, 3, 9, 7];
                            lastDigit = cycle[year % 4];
                        } else if (base === 7) {
                            cycle = [1, 7, 9, 3];
                            lastDigit = cycle[year % 4];
                        } else {
                            cycle = [6, 8, 4, 2];
                            lastDigit = cycle[year % 4];
                        }
                        questionText = `Tìm chữ số tận cùng của lũy thừa sau: $P = ${base}^{${year}}$`;
                        options = [`$${lastDigit}$`, `$${(lastDigit + 2) % 10}$`, `$${(lastDigit + 4) % 10}$`, `$5$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomDigit = this.randomInt(0, 9);
                            const opt = `$${randomDigit}$`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${lastDigit}$`);

                        hints = [
                            `Hãy tìm tính quy luật (chu kỳ lặp lại) của chữ số tận cùng khi nâng lên các lũy thừa lớn dần.`,
                            `Với cơ số là $${base}$, chu kỳ tuần hoàn của chữ số tận cùng có độ dài là 4.`,
                            `Ta chia số mũ $${year}$ cho 4 để tìm số dư và xác định vị trí tương ứng trong chu kỳ.`
                        ];
                        solutionHtml = `Chữ số tận cùng của $${base}^1$ là $${base}$, của $${base}^2$ là $${(base * base) % 10}$,... Chu kỳ chữ số tận cùng của cơ số $${base}$ là $\\{${base === 2 ? "2, 4, 8, 6" : base === 3 ? "3, 9, 7, 1" : base === 7 ? "7, 9, 3, 1" : "8, 4, 2, 6"}\\}$. Ta chia số mũ $${year}$ cho 4 được số dư là $${year % 4}$. Do đó chữ số tận cùng của $${base}^{${year}}$ là $${lastDigit}$.`;
                        tip = "Tìm chu kỳ tuần hoàn của các chữ số tận cùng giúp ta giải quyết bài toán lũy thừa lớn cực kỳ nhanh chóng.";
                    } else if (variant === 2) {
                        // Tính tổng dãy số lũy thừa quy luật
                        const base = this.randomInt(2, 3);
                        const maxExp = this.randomInt(4, 5);
                        questionText = `Tính tổng của dãy số sau: $S = 1 + ${base} + ${base}^2 + ... + ${base}^{${maxExp}}$`;
                        const correctVal = Math.round((Math.pow(base, maxExp + 1) - 1) / (base - 1));
                        options = [`$${correctVal}$`, `$${Math.pow(base, maxExp)}$`, `$${correctVal + 5}$`, `$${correctVal - 10}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const wrong = correctVal + this.randomInt(1, 15) * (Math.random() > 0.5 ? 1 : -1);
                            if (wrong > 0 && !options.includes(`$${wrong}$`)) options.push(`$${wrong}$`);
                        }
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Nhân cả hai vế của $S$ với cơ số $${base}$.`,
                            `Lấy $${base} \\cdot S$ trừ đi $S$ để rút gọn các số hạng trung gian.`,
                            `Công thức tổng quát: $1 + a + a^2 + ... + a^n = \\frac{a^{n+1}-1}{a-1}$.`
                        ];
                        solutionHtml = `Nhân hai vế của $S$ với $${base}$, ta được:<br/>$${base} \\cdot S = ${base} + ${base}^2 + ... + ${base}^{${maxExp + 1}}$<br/>Lấy $${base} \\cdot S - S$, ta có:<br/>$(${base} - 1) \\cdot S = ${base}^{${maxExp + 1}} - 1$<br/>Suy ra $S = \\frac{${base}^{${maxExp + 1}} - 1}{${base} - 1} = \\frac{${Math.pow(base, maxExp + 1)} - 1}{${base - 1}} = ${correctVal}$.`;
                        tip = "Đây là phương pháp nhân thêm cơ số rồi trừ chéo để khử các phần tử trung gian.";
                    } else {
                        // So sánh hai lũy thừa khác cơ số và số mũ
                        questionText = `So sánh hai số sau: $A = 2^{30}$ và $B = 3^{20}$`;
                        options = [`$A < B$`, `$A > B$`, `$A = B$`, `Không so sánh được`];
                        correctIndex = 0;
                        hints = [
                            `Hãy biến đổi hai số về cùng số mũ bằng cách sử dụng công thức $(a^m)^n = a^{m \\cdot n}$.`,
                            `Ta có $30 = 3 \\cdot 10$ và $20 = 2 \\cdot 10$.`,
                            `Đưa về dạng $A = (2^3)^{10}$ và $B = (3^2)^{10}$.`
                        ];
                        solutionHtml = `Ta có:<br/>$A = 2^{30} = 2^{3 \\cdot 10} = (2^3)^{10} = 8^{10}$<br/>$B = 3^{20} = 3^{2 \\cdot 10} = (3^2)^{10} = 9^{10}$<br/>Vì $8 < 9$ nên $8^{10} < 9^{10}$, do đó $2^{30} < 3^{20}$ hay $A < B$.`;
                        tip = "Phương pháp tốt nhất khi số mũ lớn là đưa về cùng một số mũ rồi so sánh cơ số.";
                    }
                }
                break;
            }
            case "thu-tu-phep-tinh": {
                if (level === "co-ban") {
                    const a = this.randomInt(5, 15);
                    const b = this.randomInt(2, 5);
                    const c = this.randomInt(3, 6);
                    const d = this.randomInt(1, 8);
                    const correctVal = a + b * c - d;
                    const w1 = (a + b) * c - d;
                    const w2 = a + b * c + d;
                    const w3 = a + b + c - d;
                    questionText = `Tính giá trị của biểu thức: $M = ${a} + ${b} \\times ${c} - ${d}$`;
                    options = [`$${correctVal}$`, `$${w1}$`, `$${w2}$`, `$${w3}$`];
                    options = [...new Set(options)];
                    while (options.length < 4) {
                        const wrong = correctVal + this.randomInt(1, 6) * (Math.random() > 0.5 ? 1 : -1);
                        if (wrong > 0 && !options.includes(`$${wrong}$`)) options.push(`$${wrong}$`);
                    }
                    hints = [
                        `Trong biểu thức không có dấu ngoặc, ta thực hiện phép **nhân và chia** trước, rồi mới thực hiện phép **cộng và trừ** từ trái sang phải.`,
                        `Bước 1: Tính tích $${b} \\times ${c} = ${b * c}$. Bước 2: Tính $${a} + ${b * c} - ${d} = ${correctVal}$.`
                    ];
                    solutionHtml = `Áp dụng thứ tự thực hiện phép tính (nhân/chia trước, cộng/trừ sau):<br>$M = ${a} + ${b} \\times ${c} - ${d}$<br>$= ${a} + ${b * c} - ${d}$ (thực hiện phép nhân $${b} \\times ${c} = ${b * c}$)<br>$= ${a + b * c} - ${d}$ (cộng từ trái sang phải)<br>$= ${correctVal}$.`;
                    tip = "Quy tắc vàng: Lũy thừa → Nhân/Chia → Cộng/Trừ. Không tính từ trái sang phải khi có phép nhân/chia chen giữa!";
                } else if (level === "nang-cao") {
                    const a = this.randomInt(3, 6);
                    const b = this.randomInt(2, 4);
                    const c = this.randomInt(2, 4);
                    const d = this.randomInt(2, 8);
                    const bSq = b * b;
                    const inner = a + bSq;
                    const correctVal = inner * c - d;
                    const w1 = a + bSq * c - d;
                    const w2 = inner * c + d;
                    const w3 = (a + b) * b * c - d;
                    questionText = `Tính giá trị của biểu thức: $N = (${a} + ${b}^2) \\times ${c} - ${d}$`;
                    options = [`$${correctVal}$`, `$${w1}$`, `$${w2}$`, `$${w3}$`];
                    options = [...new Set(options)];
                    while (options.length < 4) {
                        const wrong = correctVal + this.randomInt(2, 8) * (Math.random() > 0.5 ? 1 : -1);
                        if (wrong > 0 && !options.includes(`$${wrong}$`)) options.push(`$${wrong}$`);
                    }
                    hints = [
                        `Thực hiện theo thứ tự: tính **trong dấu ngoặc** trước, bên trong ngoặc thì tính **lũy thừa** trước, sau đó tính **nhân** ngoài ngoặc, cuối cùng tính **trừ**.`,
                        `Bước 1: $${b}^2 = ${bSq}$. Bước 2: ngoặc $(${a} + ${bSq}) = ${inner}$. Bước 3: nhân $${inner} \\times ${c} = ${inner * c}$.`
                    ];
                    solutionHtml = `$N = (${a} + ${b}^2) \\times ${c} - ${d}$<br>$= (${a} + ${bSq}) \\times ${c} - ${d}$ (tính lũy thừa $${b}^2 = ${bSq}$ trong ngoặc)<br>$= ${inner} \\times ${c} - ${d}$ (tính trong ngoặc tròn)<br>$= ${inner * c} - ${d}$ (thực hiện phép nhân)<br>$= ${correctVal}$ (thực hiện phép trừ).`;
                    tip = "Khi có dấu ngoặc: luôn tính trong ngoặc trước (bên trong ngoặc cũng theo thứ tự: lũy thừa → nhân/chia → cộng/trừ).";
                } else { // kho
                    const a = this.randomInt(4, 5);
                    const b = this.randomInt(1, 3);
                    const c = this.randomInt(1, 3);
                    const d = this.randomInt(2, 4);
                    const e = this.randomInt(1, 10);
                    const aSq = a * a;
                    const innerParen = b + c;
                    const innerBracket = aSq - innerParen;
                    const correctVal = innerBracket * d + e;
                    const w1 = (aSq - b + c) * d + e;
                    const w2 = innerBracket * d - e;
                    const w3 = aSq * d - innerParen + e;
                    questionText = `Tính giá trị của biểu thức: $P = [${a}^2 - (${b} + ${c})] \\times ${d} + ${e}$`;
                    options = [`$${correctVal}$`, `$${w1}$`, `$${w2}$`, `$${w3}$`];
                    options = [...new Set(options)];
                    while (options.length < 4) {
                        const wrong = correctVal + this.randomInt(2, 7) * (Math.random() > 0.5 ? 1 : -1);
                        if (wrong > 0 && !options.includes(`$${wrong}$`)) options.push(`$${wrong}$`);
                    }
                    hints = [
                        `Thứ tự dấu ngoặc: ngoặc tròn $( )$ trước, rồi ngoặc vuông $[ ]$, cuối cùng ngoặc nhọn $\\{\\}$. Luôn tính từ **trong ra ngoài**.`,
                        `Bước 1 – Ngoặc tròn: $(${b} + ${c}) = ${innerParen}$. Bước 2 – Lũy thừa: $${a}^2 = ${aSq}$. Bước 3 – Ngoặc vuông: $[${aSq} - ${innerParen}] = ${innerBracket}$.`
                    ];
                    solutionHtml = `$P = [${a}^2 - (${b} + ${c})] \\times ${d} + ${e}$<br>Bước 1 – Ngoặc tròn: $(${b} + ${c}) = ${innerParen}$<br>Bước 2 – Lũy thừa: $${a}^2 = ${aSq}$<br>Bước 3 – Ngoặc vuông: $[${aSq} - ${innerParen}] = ${innerBracket}$<br>Bước 4 – Nhân: $${innerBracket} \\times ${d} = ${innerBracket * d}$<br>Bước 5 – Cộng: $${innerBracket * d} + ${e} = ${correctVal}$.`;
                    tip = "Biểu thức nhiều lớp ngoặc: tính từ ngoặc trong cùng ra ngoài cùng, không bao giờ bỏ qua ngoặc!";
                }
                break;
            }
            case "quan-he-chia-het": {
                const variant = this.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const list = [12, 15, 18, 20, 24];
                        const n = list[this.randomInt(0, list.length - 1)];
                        const correctVal = n === 12 ? 4 : (n === 15 ? 5 : (n === 18 ? 6 : 4));
                        questionText = `Số nào dưới đây là một **ước** của số $${n}$?`;
                        options = [`$${correctVal}$`, `$8$`, `$9$`, `$7$`].filter((v,i,a)=>a.indexOf(v)===i);
                        while(options.length < 4) options.push(this.randomInt(11, 20).toString());
                        options = options.map(x => `$${x}$`);
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Số $b$ là ước của $a$ nếu $a$ chia hết cho $b$.`,
                            `Hãy kiểm tra xem $${n}$ chia hết cho số nào trong 4 đáp án.`
                        ];
                        solutionHtml = `Vì $${n} : ${correctVal} = ${n/correctVal}$ (phép chia hết không dư), nên $${correctVal}$ là một ước của $${n}$.`;
                    } else if (variant === 2) {
                        const m = this.randomInt(3, 6);
                        const k = m * this.randomInt(6, 9);
                        const correctVal = m * this.randomInt(3, 5);
                        questionText = `Số nào dưới đây là một **bội** của số $${m}$ và nhỏ hơn $${k}$?`;
                        options = [`$${correctVal}$`, `$${correctVal + 1}$`, `$${k + m}$`, `$${m - 1}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Số $a$ là bội của $b$ nếu $a$ chia hết cho $b$.`,
                            `Tìm số chia hết cho $${m}$ và kiểm tra xem số đó có nhỏ hơn $${k}$ hay không.`
                        ];
                        solutionHtml = `Ta thấy $${correctVal} : ${m} = ${correctVal/m}$ nên $${correctVal}$ chia hết cho $${m}$ và thỏa mãn $${correctVal} < ${k}$. Vậy $${correctVal}$ là bội của $${m}$ nhỏ hơn $${k}$.`;
                    } else {
                        const n = this.randomInt(15, 25);
                        questionText = `Tập hợp các ước tự nhiên của $${n}$ có bao nhiêu phần tử?`;
                        let count = 0;
                        const arr = [];
                        for(let i=1; i<=n; i++) {
                            if (n % i === 0) {
                                count++;
                                arr.push(i);
                            }
                        }
                        options = [`$${count}$ phần tử`, `$${count - 1}$ phần tử`, `$${count + 1}$ phần tử`, `$${count + 2}$ phần tử`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${count}$ phần tử`);
                        hints = [
                            `Hãy liệt kê tất cả các số tự nhiên từ 1 đến $${n}$ mà $${n}$ chia hết.`,
                            `Đếm số lượng các số trong danh sách vừa tìm được.`
                        ];
                        solutionHtml = `Các ước tự nhiên của $${n}$ bao gồm: $\\{${arr.join('; ')}\\}$. Tập hợp này có $${count}$ phần tử.`;
                    }
                    tip = "Ước là số mà số đã cho chia hết cho nó. Bội là số chia hết cho số đã cho.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const list = [18, 24, 30];
                        const n = list[this.randomInt(0, list.length - 1)];
                        const limit = 5;
                        const correctArr = [];
                        for(let i=1; i<=n; i++) { if(n % i === 0 && i > limit) correctArr.push(i); }
                        questionText = `Viết tập hợp các số tự nhiên $x$ sao cho $x$ là ước của $${n}$ và $x > ${limit}$.`;
                        const correctStr = `$X = \\{${correctArr.join('; ')}\\}$`;
                        options = [
                            correctStr,
                            `$X = \\{${correctArr.concat([1, 2]).sort((a,b)=>a-b).join('; ')}\\}$`,
                            `$X = \\{${correctArr.filter(x=>x!==n).join('; ')}\\}$`,
                            `$X = \\{0; ${correctArr.join('; ')}\\}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Tìm tất cả các ước của $${n}$.`,
                            `Chỉ chọn các ước lớn hơn số $${limit}$.`
                        ];
                        solutionHtml = `Ước của $${n}$ là: $\\{${n===18?'1, 2, 3, 6, 9, 18':(n===24?'1, 2, 3, 4, 6, 8, 12, 24':'1, 2, 3, 5, 6, 10, 15, 30')}\\}$. Các ước lớn hơn $${limit}$ là: $\\{${correctArr.join('; ')}\\}$.`;
                    } else if (variant === 2) {
                        const m = 4;
                        const min = 12;
                        const max = 32;
                        const correctArr = [];
                        for(let i=min+1; i<=max; i++) { if(i % m === 0) correctArr.push(i); }
                        questionText = `Viết tập hợp các số tự nhiên $x$ sao cho $x$ là bội của $${m}$ và $${min} < x \\le ${max}$.`;
                        const correctStr = `$X = \\{${correctArr.join('; ')}\\}$`;
                        options = [
                            correctStr,
                            `$X = \\{${[min, ...correctArr].join('; ')}\\}$`,
                            `$X = \\{${correctArr.slice(0, -1).join('; ')}\\}$`,
                            `$X = \\{${correctArr.map(x=>x+2).join('; ')}\\}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Bội của $${m}$ là các số chia hết cho $${m}$.`,
                            `Tìm các bội của $${m}$ lớn hơn $${min}$ và bé hơn hoặc bằng $${max}$.`
                        ];
                        solutionHtml = `Các bội của $${m}$ là: $0; 4; 8; 12; 16; 20; 24; 28; 32; 36;...$<br>Trong đó các số lớn hơn $${min}$ và nhỏ hơn hoặc bằng $${max}$ là: $\\{${correctArr.join('; ')}\\}$.`;
                    } else {
                        const a = this.randomInt(10, 15);
                        const b = this.randomInt(25, 35);
                        questionText = `Tổng $S = ${a} + ${b} + x$ chia hết cho 5. Điều kiện nào của $x$ dưới đây là đúng?`;
                        const rem = (a + b) % 5;
                        const reqRem = (5 - rem) % 5;
                        const correctStr = `$x$ chia cho 5 dư $${reqRem}$`;
                        options = [
                            correctStr,
                            `$x$ chia hết cho 5`,
                            `$x$ chia cho 5 dư $${(reqRem + 1) % 5}$`,
                            `$x$ chia cho 5 dư $${(reqRem + 2) % 5}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Áp dụng tính chất chia hết của một tổng: Một tổng chia hết cho m khi tổng các số dư của từng số hạng chia hết cho m.`,
                            `Tính số dư của $${a} + ${b}$ khi chia cho 5.`
                        ];
                        solutionHtml = `Ta có $${a} + ${b} = ${a+b}$, số này chia 5 dư $${rem}$.<br>Để tổng $S = (${a+b}) + x \\space \\vdots \\space 5$, thì số dư của $x$ khi chia cho 5 cộng với $${rem}$ phải chia hết cho 5.<br>Do đó $x$ chia cho 5 phải dư $${reqRem}$ (vì $${rem} + ${reqRem} = 5 \\space \\vdots \\space 5$).`;
                    }
                    tip = "Đọc kỹ các điều kiện ràng buộc như lớn hơn hoặc nhỏ hơn để không lấy thừa phần tử.";
                } else { // kho
                    if (variant === 1) {
                        questionText = `Tìm số tự nhiên $n$ lớn nhất để biểu thức $(n + 3)$ chia hết cho $(n + 1)$.`;
                        options = [`$n = 1$`, `$n = 2$`, `$n = 0$`, `$n = 3$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$n = 1$`);
                        hints = [
                            `Tách tử số: $n + 3 = (n + 1) + 2$.`,
                            `Để $(n+1) + 2$ chia hết cho $(n+1)$ thì số $2$ phải chia hết cho $(n+1)$.`
                        ];
                        solutionHtml = `Ta có: $n + 3 = (n + 1) + 2$. Để $n + 3 \\space \\vdots \\space n + 1$, do $(n+1) \\space \\vdots \\space n+1$, nên bắt buộc $2 \\space \\vdots \\space n+1$.<br>Suy ra $n+1$ là ước tự nhiên của $2 \\rightarrow n+1 \\in \\{1; 2\\} \\rightarrow n \\in \\{0; 1\\}$. Số $n$ lớn nhất là $1$.`;
                    } else if (variant === 2) {
                        questionText = `Tìm tất cả các số tự nhiên $n$ sao cho biểu thức $(2n + 5)$ chia hết cho $(n + 1)$.`;
                        const correctStr = `$n \\in \\{0; 2\\}$`;
                        options = [correctStr, `$n \\in \\{1; 3\\}$`, `$n \\in \\{0; 1; 2\\}$`, `$n \\in \\{2; 4\\}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Tách biểu thức ở số bị chia: $2n + 5 = 2(n + 1) + 3$.`,
                            `Để $2(n + 1) + 3$ chia hết cho $n + 1$ thì số $3$ phải chia hết cho $n + 1$.`
                        ];
                        solutionHtml = `Ta biến đổi: $2n + 5 = 2n + 2 + 3 = 2(n + 1) + 3$.<br>Để $(2n+5) \\space \\vdots \\space (n+1) \\rightarrow 2(n+1) + 3 \\space \\vdots \\space (n+1)$.<br>Vì $2(n+1) \\space \\vdots \\space (n+1)$ nên bắt buộc $3 \\space \\vdots \\space (n+1)$, hay $n+1$ là ước của 3.<br>Ước tự nhiên của 3 là $1; 3$.<br>+ Nếu $n+1 = 1 \\rightarrow n = 0$.<br>+ Nếu $n+1 = 3 \\rightarrow n = 2$.<br>Vậy $n \\in \\{0; 2\\}$.`;
                    } else {
                        questionText = `Chứng tỏ rằng với mọi số tự nhiên $n$, tích $P = n \\cdot (n + 5)$ luôn chia hết cho 2. Đây là một bài toán trắc nghiệm chọn khẳng định **đúng** về lời giải:`;
                        const correctStr = `Với mọi $n$, nếu $n$ chẵn thì $n \\space \\vdots \\space 2$; nếu $n$ lẻ thì $n+5$ chẵn nên $n+5 \\space \\vdots \\space 2$. Do đó tích luôn chia hết cho 2.`;
                        options = [
                            correctStr,
                            `Tích luôn chia hết cho 2 vì $n+5$ luôn là số lẻ.`,
                            `Tích luôn chia hết cho 2 vì $n$ luôn là số chẵn.`,
                            `Chỉ đúng khi $n$ là số tự nhiên chẵn.`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Xét hai trường hợp của số tự nhiên $n$: $n$ chẵn (có dạng $2k$) hoặc $n$ lẻ (có dạng $2k+1$).`,
                            `Nếu $n$ lẻ, ta cộng thêm 5 (là số lẻ) thì được số chẵn.`
                        ];
                        solutionHtml = `Xét hai trường hợp của số tự nhiên $n$:<br>- Trường hợp 1: $n$ là số chẵn $\\rightarrow n \\space \\vdots \\space 2$, nên tích $P \\space \\vdots \\space 2$.<br>- Trường hợp 2: $n$ là số lẻ $\\rightarrow n+5$ là tổng của hai số lẻ nên $n+5$ chẵn $\\rightarrow (n+5) \\space \\vdots \\space 2$, nên tích $P \\space \\vdots \\space 2$.<br>Vậy với mọi số tự nhiên $n$, tích $n(n+5)$ luôn chia hết cho 2.`;
                    }
                    tip = "Sử dụng phương pháp tách hạng tử hoặc xét tính chẵn lẻ để xử lý các bài toán chia hết chứa biến số.";
                }
                break;
            }
            case "dau-hieu-chia-het": {
                const variant = this.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const correctCandidates = [135, 270, 315, 450];
                        const correctVal = correctCandidates[this.randomInt(0, correctCandidates.length - 1)];
                        questionText = `Số nào dưới đây chia hết cho cả **3** và **5**?`;
                        options = [`$${correctVal}$`, `$123$`, `$235$`, `$104$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Số chia hết cho 5 có chữ số tận cùng là 0 hoặc 5.`,
                            `Số chia hết cho 3 có tổng các chữ số chia hết cho 3.`
                        ];
                        solutionHtml = `Số $${correctVal}$ có tận cùng là $${correctVal % 10}$ nên chia hết cho 5. Tổng các chữ số là $${correctVal.toString().split('').reduce((a,b)=>parseInt(a)+parseInt(b),0)}$ chia hết cho 3. Do đó nó chia hết cho cả 3 và 5.`;
                    } else if (variant === 2) {
                        const correctCandidates = [180, 270, 360, 450];
                        const correctVal = correctCandidates[this.randomInt(0, correctCandidates.length - 1)];
                        questionText = `Số nào dưới đây chia hết cho cả **2, 5 và 9**?`;
                        options = [`$${correctVal}$`, `$195$`, `$250$`, `$182$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Số chia hết cho cả 2 và 5 phải có chữ số tận cùng là 0.`,
                            `Số chia hết cho 9 có tổng các chữ số chia hết cho 9.`
                        ];
                        solutionHtml = `Số $${correctVal}$ có chữ số tận cùng là 0 nên chia hết cho cả 2 và 5. Đồng thời tổng các chữ số của nó là $${correctVal.toString().split('').reduce((a,b)=>parseInt(a)+parseInt(b),0)}$ chia hết cho 9. Do đó nó chia hết cho 2, 5 và 9.`;
                    } else {
                        const correctVal = [12, 24, 36, 48][this.randomInt(0, 3)];
                        questionText = `Số nào dưới đây chia hết cho **4**? (Gợi ý: hai chữ số tận cùng chia hết cho 4)`;
                        options = [`$${correctVal}$`, `$18$`, `$22$`, `$30$`].map(x => `$${parseInt(x.replace(/\$/g,'')) * 10 + this.randomInt(1, 9)}$`);
                        options[0] = `$1${correctVal}$`; // tạo số đúng
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$1${correctVal}$`);
                        hints = [
                            `Dấu hiệu chia hết cho 4: Số có hai chữ số tận cùng lập thành một số chia hết cho 4.`,
                            `Kiểm tra hai chữ số tận cùng của từng phương án.`
                        ];
                        solutionHtml = `Số $1${correctVal}$ có hai chữ số tận cùng là $${correctVal}$, chia hết cho 4 ($${correctVal} : 4 = ${correctVal/4}$). Do đó số này chia hết cho 4.`;
                    }
                    tip = "Xét dấu hiệu chia hết cho 5 hoặc 2 trước để thu hẹp đáp án, sau đó xét dấu hiệu tổng chữ số.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const list = [
                            {num: "23x", xVal: 4, div: 9},
                            {num: "12x5", xVal: 1, div: 9},
                            {num: "5x4", xVal: 0, div: 9}
                        ];
                        const choice = list[this.randomInt(0, list.length - 1)];
                        questionText = `Tìm chữ số $x$ để số $\\overline{${choice.num}}$ chia hết cho **${choice.div}**.`;
                        options = [`$x = ${choice.xVal}$`, `$x = ${(choice.xVal + 3) % 10}$`, `$x = ${(choice.xVal + 5) % 10}$`, `$x = 9$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randVal = this.randomInt(0, 9);
                            const opt = `$x = ${randVal}$`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$x = ${choice.xVal}$`);
                        hints = [
                            `Một số chia hết cho 9 khi tổng các chữ số của nó chia hết cho 9.`,
                            `Tổng các chữ số của số đã cho là gì? Thêm $x$ để được bội của 9.`
                        ];
                        solutionHtml = `Để số $\\overline{${choice.num}}$ chia hết cho 9 thì tổng các chữ số: ${choice.num.replace('x', ' + x').split('').join(' + ')} \\space \\vdots \\space 9$.<br>Thử các giá trị chữ số từ 0 đến 9, ta tìm được $x = ${choice.xVal}$.`;
                    } else if (variant === 2) {
                        const list = [
                            {num: "7x2", xVal: 0, div: 3}, // 7+0+2 = 9
                            {num: "45x", xVal: 0, div: 3}, // 4+5+0 = 9
                            {num: "1x8", xVal: 0, div: 3}
                        ];
                        const choice = list[this.randomInt(0, list.length - 1)];
                        questionText = `Tìm tập hợp các chữ số $x$ để số $\\overline{${choice.num}}$ chia hết cho **${choice.div}**.`;
                        const correctStr = `$x \\in \\{0; 3; 6; 9\\}$`;
                        options = [correctStr, `$x \\in \\{3; 6; 9\\}$`, `$x \\in \\{1; 4; 7\\}$`, `$x \\in \\{2; 5; 8\\}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Tổng các chữ số của $\\overline{${choice.num}}$ phải chia hết cho 3.`,
                            `Tìm chữ số $x$ nhỏ nhất thỏa mãn, sau đó cộng thêm 3, 6, 9.`
                        ];
                        solutionHtml = `Để số $\\overline{${choice.num}}$ chia hết cho 3 thì tổng các chữ số phải chia hết cho 3.<br>Với số $\\overline{7x2}$, ta có tổng các chữ số là: $7 + x + 2 = 9 + x \\space \\vdots \\space 3$.<br>Vì $9 \\space \\vdots \\space 3$ nên $x \\space \\vdots \\space 3 \\rightarrow x \\in \\{0; 3; 6; 9\\}$.`;
                    } else {
                        const list = [
                            {num: "4x5", xVal: 0},
                            {num: "2x5", xVal: 2},
                            {num: "7x0", xVal: 2}
                        ];
                        const choice = list[this.randomInt(0, list.length - 1)];
                        questionText = `Tìm chữ số $x$ để số $\\overline{${choice.num}}$ chia hết cho 3 nhưng **không** chia hết cho 9.`;
                        options = [`$x = ${choice.xVal}$`, `$x = ${choice.xVal + 3}$`, `$x = ${choice.xVal + 1}$`, `$x = 9$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$x = ${choice.xVal}$`);
                        hints = [
                            `Tổng các chữ số phải chia hết cho 3 nhưng không được chia hết cho 9.`,
                            `Ví dụ $\\overline{2x5}$ có tổng chữ số là $7+x$. Lần lượt thử các chữ số $x$.`
                        ];
                        solutionHtml = `Với $\\overline{2x5}$, tổng các chữ số là $2 + x + 5 = 7 + x$.<br>Để chia hết cho 3 thì $7+x \\in \\{9; 12; 15; 18;...\\} \\rightarrow x \\in \\{2; 5; 8\\}$.<br>Nếu $x = 2 \\rightarrow$ tổng chữ số là 9 (chia hết cho 9 - loại).<br>Nếu $x = 5 \\rightarrow$ tổng chữ số là 12 (chia hết cho 3, không chia hết cho 9 - thỏa mãn).<br>Nếu $x = 8 \\rightarrow$ tổng chữ số là 15 (chia hết cho 3, không chia hết cho 9 - thỏa mãn).<br>Vậy chữ số thỏa mãn là $x = 5$ hoặc $x = 8$ (Phương án có $x = ${choice.xVal}$ được chọn).`;
                    }
                    tip = "Hãy kiểm tra lại xem chữ số vừa tìm được có vi phạm điều kiện phụ (không chia hết cho 9) hay không.";
                } else { // kho
                    if (variant === 1) {
                        questionText = `Tìm các chữ số $x, y$ để số $\\overline{x45y}$ chia hết cho cả **2, 5, 3 và 9**.`;
                        options = [
                            `$x = 9; y = 0$`,
                            `$x = 5; y = 0$`,
                            `$x = 9; y = 5$`,
                            `$x = 3; y = 0$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$x = 9; y = 0$`);
                        hints = [
                            `Số chia hết cho cả 2 và 5 phải có chữ số tận cùng là $y = 0$.`,
                            `Thay $y = 0$ vào, số trở thành $\\overline{x450}$. Để số này chia hết cho 9 (chia hết cho 9 thì chắc chắn chia hết cho 3) thì tổng chữ số phải chia hết cho 9.`
                        ];
                        solutionHtml = `Vì $\\overline{x45y} \\space \\vdots \\space 2$ và $5 \\rightarrow y = 0$. Số có dạng $\\overline{x450}$.<br>Để số chia hết cho $9 \\rightarrow x + 4 + 5 + 0 = x + 9 \\space \\vdots \\space 9$. Vì $x \\neq 0 \\rightarrow x = 9$. Vậy $x = 9, y = 0$.`;
                    } else if (variant === 2) {
                        questionText = `Tìm các chữ số $x, y$ để số $\\overline{2x3y}$ chia hết cho cả 2 và 5, đồng thời chia cho 9 dư 1.`;
                        const correctStr = `$x = 5; y = 0$`;
                        options = [correctStr, `$x = 4; y = 0$`, `$x = 5; y = 5$`, `$x = 9; y = 0$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Để số $\\overline{2x3y}$ chia hết cho 2 và 5 thì chữ số tận cùng $y$ phải bằng 0.`,
                            `Số trở thành $\\overline{2x30}$. Để số này chia cho 9 dư 1, tổng các chữ số của nó phải chia cho 9 dư 1.`
                        ];
                        solutionHtml = `Vì $\\overline{2x3y} \\space \\vdots \\space 2$ và $5 \\rightarrow y = 0$. Số có dạng $\\overline{2x30}$.<br>Tổng các chữ số của số này là: $2 + x + 3 + 0 = 5 + x$.<br>Để số này chia cho 9 dư 1, thì $5 + x$ chia cho 9 phải dư 1, tức là $5 + x = 10 \\rightarrow x = 5$.<br>Vậy chữ số cần tìm là $x = 5, y = 0$.`;
                    } else {
                        questionText = `Tìm số tự nhiên nhỏ nhất có 4 chữ số chia hết cho cả 2, 3, 5 và 9.`;
                        const correctStr = `$1080$`;
                        options = [correctStr, `$1020$`, `$1170$`, `$9000$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Số chia hết cho 2 và 5 thì chữ số hàng đơn vị là 0. Số có dạng $\\overline{abc0}$.`,
                            `Số chia hết cho cả 3 và 9 thì chỉ cần chia hết cho 9.`,
                            `Để số nhỏ nhất, ta chọn hàng nghìn là 1, hàng trăm là 0, từ đó tìm hàng chục sao cho tổng chữ số chia hết cho 9.`
                        ];
                        solutionHtml = `Gọi số cần tìm là $\\overline{abcd}$.<br>Vì số chia hết cho 2 và 5 nên $d = 0$. Số có dạng $\\overline{abc0}$.<br>Vì số chia hết cho 9 nên $a + b + c + 0 \\space \\vdots \\space 9$.<br>Để số nhỏ nhất, ta chọn hàng nghìn $a = 1$, hàng trăm $b = 0$.<br>Khi đó $1 + 0 + c \\space \\vdots \\space 9 \\rightarrow 1 + c \\space \\vdots \\space 9 \\rightarrow c = 8$.<br>Vậy số tự nhiên nhỏ nhất thỏa mãn là $1080$.`;
                    }
                    tip = "Tìm chữ số tận cùng trước thông qua dấu hiệu chia hết cho 2 và 5.";
                }
                break;
            }
            case "so-nguyen-to": {
                const variant = this.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const correctVal = [13, 17, 19, 23][this.randomInt(0, 3)];
                        questionText = `Trong các số sau, số nào là **số nguyên tố**?`;
                        options = [`$${correctVal}$`, `$15$`, `$21$`, `$27$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Số nguyên tố là số tự nhiên lớn hơn 1, chỉ có hai ước là 1 và chính nó.`,
                            `Hợp số là số chia hết cho các số khác ngoài 1 và chính nó (ví dụ chia hết cho 3, 5).`
                        ];
                        solutionHtml = `Số 15 \\space \\vdots \\space 3$, $21 \\space \\vdots \\space 3$, $27 \\space \\vdots \\space 3$ là các hợp số. Số $${correctVal}$ chỉ chia hết cho 1 và chính nó nên là số nguyên tố.`;
                    } else if (variant === 2) {
                        const correctVal = [14, 25, 33, 39][this.randomInt(0, 3)];
                        questionText = `Trong các số sau, số nào là **hợp số**?`;
                        options = [`$${correctVal}$`, `$11$`, `$13$`, `$17$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Hợp số là số tự nhiên lớn hơn 1 và có nhiều hơn 2 ước.`,
                            `Tìm số trong 4 đáp án chia hết cho một số nguyên tố nhỏ (như 2, 3, 5).`
                        ];
                        solutionHtml = `Các số 11, 13, 17 chỉ chia hết cho 1 và chính nó nên là các số nguyên tố. Số $${correctVal}$ chia hết cho ${correctVal === 14 ? '2' : (correctVal === 25 ? '5' : '3')} nên là hợp số.`;
                    } else {
                        questionText = `Khẳng định nào dưới đây về số nguyên tố là **sai**?`;
                        const correctStr = `Tất cả các số nguyên tố đều là số lẻ.`;
                        options = [
                            correctStr,
                            `Số 2 là số nguyên tố chẵn duy nhất.`,
                            `Số 0 và số 1 không phải là số nguyên tố, cũng không phải là hợp số.`,
                            `Mọi số nguyên tố đều lớn hơn 1.`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Hãy nghĩ về số nguyên tố nhỏ nhất.`,
                            `Số 2 là số chẵn hay số lẻ?`
                        ];
                        solutionHtml = `Số 2 là số chẵn và là số nguyên tố chẵn duy nhất. Do đó, khẳng định "Tất cả các số nguyên tố đều là số lẻ" là **sai**.`;
                    }
                    tip = "Hãy nhớ số 2 là số nguyên tố chẵn duy nhất.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const val = [60, 84, 90][this.randomInt(0, 2)];
                        questionText = `Phân tích số tự nhiên $${val}$ ra thừa số nguyên tố.`;
                        let correctStr = "";
                        if (val === 60) correctStr = `$2^2 \\cdot 3 \\cdot 5$`;
                        else if (val === 84) correctStr = `$2^2 \\cdot 3 \\cdot 7$`;
                        else correctStr = `$2 \\cdot 3^2 \\cdot 5$`;
                        
                        options = [
                            correctStr,
                            correctStr.replace("^2", ""),
                            correctStr.replace("\\cdot 5", "\\cdot 6").replace("\\cdot 7", "\\cdot 8"),
                            `$4 \\cdot 3 \\cdot 5$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Chia lần lượt số $${val}$ cho các số nguyên tố từ nhỏ đến lớn: 2, 3, 5...`,
                            `Viết tích dưới dạng lũy thừa của các thừa số nguyên tố.`
                        ];
                        solutionHtml = `Phân tích $${val}$:<br>${val} = 2 \\cdot ${val/2} = ${correctStr}.`;
                    } else if (variant === 2) {
                        const val = 120;
                        questionText = `Phân tích số tự nhiên $120$ ra thừa số nguyên tố.`;
                        const correctStr = `$2^3 \\cdot 3 \\cdot 5$`;
                        options = [correctStr, `$2^2 \\cdot 3 \\cdot 10$`, `$2^4 \\cdot 3 \\cdot 5$`, `$8 \\cdot 3 \\cdot 5$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Nhận thấy $120 = 10 \\cdot 12$. Phân tích tiếp $10 = 2 \\cdot 5$, $12 = 2^2 \\cdot 3$.`,
                            `Nhóm các thừa số giống nhau thành lũy thừa.`
                        ];
                        solutionHtml = `Ta có $120 = 12 \\cdot 10 = (2^2 \\cdot 3) \\cdot (2 \\cdot 5) = 2^3 \\cdot 3 \\cdot 5$.`;
                    } else {
                        const val = 180;
                        questionText = `Phân tích số tự nhiên $180$ ra thừa số nguyên tố.`;
                        const correctStr = `$2^2 \\cdot 3^2 \\cdot 5$`;
                        options = [correctStr, `$2 \\cdot 3^3 \\cdot 5$`, `$4 \\cdot 9 \\cdot 5$`, `$2^2 \\cdot 3 \\cdot 15$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Ta có $180 = 18 \\cdot 10$. Phân tích tiếp $18 = 2 \\cdot 3^2$, $10 = 2 \\cdot 5$.`,
                            `Nhóm các thừa số lại.`
                        ];
                        solutionHtml = `Ta có $180 = 18 \\cdot 10 = (2 \\cdot 3^2) \\cdot (2 \\cdot 5) = 2^2 \\cdot 3^2 \\cdot 5$.`;
                    }
                    tip = "Không viết các hợp số (như 4, 6, 8, 10, 15) vào kết quả phân tích thừa số nguyên tố.";
                } else { // kho
                    if (variant === 1) {
                        questionText = `Tìm số nguyên tố $p$ sao cho $p + 2$ và $p + 4$ cũng là các số nguyên tố.`;
                        options = [`$p = 3$`, `$p = 5$`, `$p = 2$`, `$Không tồn tại p$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$p = 3$`);
                        hints = [
                            `Thử các giá trị số nguyên tố nhỏ nhất: $p = 2, p = 3, p = 5$.`,
                            `Xét tính chất chia hết cho 3 của số nguyên tố.`
                        ];
                        solutionHtml = `Nếu $p = 3 \\rightarrow p + 2 = 5$ (số nguyên tố), $p + 4 = 7$ (số nguyên tố). Thỏa mãn.<br>Nếu $p \\neq 3 \\rightarrow p$ có dạng $3k+1$ hoặc $3k+2$.<br>+ Nếu $p = 3k+1 \\rightarrow p+2 = 3k+3 \\space \\vdots \\space 3$ (hợp số).<br>+ Nếu $p = 3k+2 \\rightarrow p+4 = 3k+6 \\space \\vdots \\space 3$ (hợp số). Vậy chỉ có duy nhất $p=3$.`;
                    } else if (variant === 2) {
                        questionText = `Tìm số nguyên tố $p$ sao cho $p + 10$ và $p + 14$ cũng là các số nguyên tố.`;
                        const correctStr = `$p = 3$`;
                        options = [correctStr, `$p = 5$`, `$p = 7$`, `$Không tồn tại p$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Thử giá trị $p = 3$. Khi đó $p+10$ và $p+14$ bằng bao nhiêu?`,
                            `Nếu $p > 3$, xét số dư của $p$ khi chia cho 3 là dư 1 hoặc dư 2.`
                        ];
                        solutionHtml = `Nếu $p = 3 \\rightarrow p + 10 = 13$ (số nguyên tố), $p + 14 = 17$ (số nguyên tố). Thỏa mãn.<br>Nếu $p > 3 \\rightarrow p$ là số nguyên tố lớn hơn 3 nên $p$ chia 3 dư 1 hoặc 2.<br>+ Nếu $p = 3k+1 \\rightarrow p + 14 = 3k + 15 \\space \\vdots \\space 3$ (hợp số vì $p+14 > 3$).<br>+ Nếu $p = 3k+2 \\rightarrow p + 10 = 3k + 12 \\space \\vdots \\space 3$ (hợp số vì $p+10 > 3$).<br>Vậy chỉ có duy nhất $p = 3$ thỏa mãn.`;
                    } else {
                        questionText = `Cho $A = 5 + 5^2 + 5^3 + ... + 5^{20}$. Hỏi số $A$ là số nguyên tố hay hợp số?`;
                        const correctStr = `Hợp số`;
                        options = [correctStr, `Số nguyên tố`, `Không xác định được`, `Số 0`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Hãy xem biểu thức $A$ có chia hết cho $5$ không.`,
                            `Đánh giá xem giá trị của $A$ có lớn hơn 5 hay không.`
                        ];
                        solutionHtml = `Ta thấy tất cả các số hạng trong tổng $A$ đều chia hết cho 5, do đó $A \\space \\vdots \\space 5$.<br>Mặt khác, $A = 5 + 25 + ... > 5$.<br>Số tự nhiên $A$ lớn hơn 5 và chia hết cho 5 nên $A$ có nhiều hơn hai ước (ít nhất có các ước là 1, 5 và chính nó). Do đó $A$ là hợp số.`;
                    }
                    tip = "Với các bài toán số nguyên tố, xét trường hợp đặc biệt $p=3$ hoặc chứng minh tính chia hết để khẳng định hợp số.";
                }
                break;
            }
            case "ucln": {
                const variant = this.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const g = this.randomInt(3, 12);
                        let x = this.randomInt(2, 7);
                        let y = this.randomInt(2, 7);
                        while (this.gcd(x, y) !== 1 || x === y) {
                            x = this.randomInt(2, 7);
                            y = this.randomInt(2, 7);
                        }
                        const aNum = g * x;
                        const bNum = g * y;
                        const ans = g;
                        
                        questionText = `Tìm ước chung lớn nhất của hai số: $\\text{ƯCLN}(${aNum}, ${bNum})$.`;
                        options = [`$${ans}$`, `$${ans * 2}$`, `$${this.gcd(x, y)}$`, `$${Math.abs(aNum - bNum)}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomOpt = `$${this.randomInt(2, ans + 20)}$`;
                            if (!options.includes(randomOpt)) options.push(randomOpt);
                        }
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${ans}$`);
                        hints = [
                            `ƯCLN là số tự nhiên lớn nhất mà cả $${aNum}$ và $${bNum}$ đều chia hết.`,
                            `Phân tích ra thừa số nguyên tố của từng số và lấy các thừa số chung với số mũ nhỏ nhất.`
                        ];
                        solutionHtml = `Ta phân tích thừa số nguyên tố:<br>- $${aNum} = ${this.factorize(aNum)}$<br>- $${bNum} = ${this.factorize(bNum)}$<br>Các thừa số chung lấy với số mũ nhỏ nhất. Vậy $\\text{ƯCLN}(${aNum}, ${bNum}) = ${ans}$.`;
                    } else if (variant === 2) {
                        // Tìm ƯCLN của 3 số: 18, 24, 30 -> 6
                        const correctStr = `$6$`;
                        questionText = `Tìm ước chung lớn nhất của ba số: $\\text{ƯCLN}(18, 24, 30)$.`;
                        options = [correctStr, `$12$`, `$3$`, `$2$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Phân tích cả 3 số ra thừa số nguyên tố: $18 = 2 \\cdot 3^2$, $24 = 2^3 \\cdot 3$, $30 = 2 \\cdot 3 \\cdot 5$.`,
                            `Chọn các thừa số nguyên tố chung (2 và 3) với số mũ nhỏ nhất.`
                        ];
                        solutionHtml = `Ta phân tích:<br>$18 = 2 \\cdot 3^2$<br>$24 = 2^3 \\cdot 3$<br>$30 = 2 \\cdot 3 \\cdot 5$<br>Thừa số chung là 2 và 3. Số mũ nhỏ nhất tương ứng là 1. $\\text{ƯCLN}(18, 24, 30) = 2 \\cdot 3 = 6$.`;
                    } else {
                        // Hai số nguyên tố cùng nhau có ƯCLN = 1
                        const a = [8, 9, 15, 25][this.randomInt(0, 3)];
                        let b = [7, 11, 13, 17][this.randomInt(0, 3)];
                        questionText = `Tìm ước chung lớn nhất của hai số $${a}$ và $${b}$.`;
                        const correctStr = `$1$`;
                        options = [correctStr, `$2$`, `$${this.gcd(a, b)}$`, `$3$`];
                        options = [...new Set(options)];
                        while(options.length < 4) options.push(`$${this.randomInt(4, 10)}$`);
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Nhận thấy $${b}$ là số nguyên tố và $${a}$ không chia hết cho $${b}$.`,
                            `Hai số này không có thừa số nguyên tố chung.`
                        ];
                        solutionHtml = `Vì $${a}$ và $${b}$ không có ước chung nào khác 1 (chúng nguyên tố cùng nhau), nên $\\text{ƯCLN}(${a}, ${b}) = 1$.`;
                    }
                    tip = "ƯCLN lấy các thừa số nguyên tố chung với số mũ nhỏ nhất.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const g = this.randomInt(4, 12);
                        let x = this.randomInt(2, 6);
                        let y = this.randomInt(2, 6);
                        while (this.gcd(x, y) !== 1 || x === y) {
                            x = this.randomInt(2, 6);
                            y = this.randomInt(2, 6);
                        }
                        const nam = g * x;
                        const nu = g * y;
                        
                        questionText = `Một lớp học có $${nam}$ bạn nam và $${nu}$ bạn nữ. Cô giáo muốn chia lớp thành các nhóm học tập sao cho số lượng nam và nữ ở mỗi nhóm bằng nhau. Hỏi cô giáo có thể chia được nhiều nhất bao nhiêu nhóm?`;
                        options = [`$${g}$ nhóm`, `$${g * 2}$ nhóm`, `$${this.gcd(x, y)}$ nhóm`, `$${Math.min(nam, nu)}$ nhóm`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomOpt = `$${this.randomInt(2, g + 10)}$ nhóm`;
                            if (!options.includes(randomOpt)) options.push(randomOpt);
                        }
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${g}$ nhóm`);
                        hints = [
                            `Số nhóm chia được nhiều nhất chính là ước chung lớn nhất của số nam và số nữ.`,
                            `Tính $\\text{ƯCLN}(${nam}, ${nu})$.`
                        ];
                        solutionHtml = `Số nhóm nhiều nhất cô giáo có thể chia được là ước chung lớn nhất của số nam ($${nam}$) và số nữ ($${nu}$):<br>$\\text{ƯCLN}(${nam}, ${nu}) = ${g}$ nhóm.<br>Khi đó mỗi nhóm có $${nam} : ${g} = ${x}$ bạn nam và $${nu} : ${g} = ${y}$ bạn nữ.`;
                    } else if (variant === 2) {
                        const sideA = 48;
                        const sideB = 36;
                        // UCLN(48, 36) = 12
                        const correctStr = `$12$ cm`;
                        questionText = `Một tấm bìa hình chữ nhật có kích thước $${sideA}$ cm và $${sideB}$ cm. Bạn An muốn cắt tấm bìa thành các hình vuông nhỏ bằng nhau sao cho tấm bìa được cắt hết không thừa mảnh nào. Hỏi độ dài cạnh hình vuông lớn nhất có thể cắt được là bao nhiêu?`;
                        options = [correctStr, `$6$ cm`, `$8$ cm`, `$4$ cm`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Độ dài cạnh hình vuông phải là ước chung của chiều dài và chiều rộng tấm bìa.`,
                            `Để cạnh hình vuông lớn nhất, ta cần tìm $\\text{ƯCLN}(${sideA}, ${sideB})$.`
                        ];
                        solutionHtml = `Để cắt hết tấm bìa thành các hình vuông bằng nhau thì cạnh hình vuông phải là ước chung của chiều dài ($${sideA}$) và chiều rộng ($${sideB}$).<br>Cạnh hình vuông lớn nhất chính là $\\text{ƯCLN}(${sideA}, ${sideB}) = 12$ cm.`;
                    } else {
                        const cap = 20;
                        const but = 28;
                        const correctStr = `$4$ bạn`;
                        questionText = `Cô giáo muốn chia $${cap}$ cuốn tập và $${but}$ chiếc bút làm phần thưởng cho các học sinh giỏi sao cho mỗi học sinh nhận được phần quà như nhau. Hỏi có thể chia được nhiều nhất cho bao nhiêu học sinh?`;
                        options = [correctStr, `$2$ bạn`, `$5$ bạn`, `$7$ bạn`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Số học sinh nhận quà phải là ước chung của số tập và số bút.`,
                            `Để số học sinh là nhiều nhất, ta tìm $\\text{ƯCLN}(${cap}, ${but})$.`
                        ];
                        solutionHtml = `Số học sinh nhiều nhất được nhận quà là $\\text{ƯCLN}(${cap}, ${but}) = \\text{ƯCLN}(20, 28) = 4$ học sinh.`;
                    }
                    tip = "Từ khóa 'nhiều nhất', 'lớn nhất' trong bài toán phân chia lượng vật phẩm thường chỉ ra việc tìm ƯCLN.";
                } else { // kho
                    if (variant === 1) {
                        const g = this.randomInt(4, 10);
                        const primes = [5, 7, 11, 13];
                        const xy = primes[this.randomInt(0, primes.length - 1)];
                        const x = 1;
                        const y = xy;
                        
                        const aNum = g * x;
                        const bNum = g * y;
                        const tich = aNum * bNum;
                        
                        questionText = `Tìm hai số tự nhiên $a$ và $b$ ($a < b$) biết rằng $\\text{ƯCLN}(a, b) = ${g}$ và tích $a \\cdot b = ${tich}$.`;
                        options = [
                            `$a = ${aNum}; b = ${bNum}$`,
                            `$a = ${g}; b = ${tich}$`,
                            `$a = ${g * 2}; b = ${tich / 2}$`,
                            `$a = ${g * 3}; b = ${tich / 3}$`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomA = this.randomInt(2, 30);
                            const randomB = Math.floor(tich / randomA);
                            if (tich % randomA === 0) {
                                const opt = `$a = ${randomA}; b = ${randomB}$`;
                                if (!options.includes(opt)) options.push(opt);
                            }
                        }
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$a = ${aNum}; b = ${bNum}$`);
                        hints = [
                            `Vì $\\text{ƯCLN}(a, b) = ${g}$ nên ta đặt $a = ${g}x, b = ${g}y$ với $\\text{ƯCLN}(x, y) = 1$ và $x < y$.`,
                            `Tích $a \\cdot b = ${g}x \\cdot ${g}y = ${g*g}xy = ${tich} \\rightarrow xy = ${xy}$.`
                        ];
                        solutionHtml = `Đặt $a = ${g}x, b = ${g}y$ với $\\text{ƯCLN}(x, y) = 1$ và $x < y$.<br>Ta có $a \\cdot b = ${g*g}xy = ${tich} \\rightarrow xy = ${xy}$. Vì $xy = ${xy}$ là số nguyên tố và $x < y$, ta có duy nhất cặp $x = 1, y = ${xy}$.<br>Suy ra $a = ${g} \\cdot 1 = ${aNum}$ và $b = ${g} \\cdot ${xy} = ${bNum}$.`;
                    } else if (variant === 2) {
                        // ƯCLN = 12, tổng = 96.
                        // a = 12x, b = 12y. x + y = 8. UCLN(x,y)=1.
                        // a < b -> x < y -> (1,7) hoặc (3,5).
                        // Cặp số: (12, 84) hoặc (36, 60).
                        const correctStr = `$a = 12; b = 84$ hoặc $a = 36; b = 60$`;
                        questionText = `Tìm hai số tự nhiên $a$ và $b$ ($a < b$) biết rằng $\\text{ƯCLN}(a, b) = 12$ và tổng $a + b = 96$.`;
                        options = [correctStr, `$a = 12; b = 84$`, `$a = 24; b = 72$`, `$a = 36; b = 60$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Đặt $a = 12x, b = 12y$ với $\\text{ƯCLN}(x, y) = 1$ và $x < y$.`,
                            `Từ tổng $a+b=96 \\rightarrow 12(x+y)=96 \\rightarrow x+y=8$.`,
                            `Tìm các cặp số nguyên tố cùng nhau $(x, y)$ có tổng bằng 8.`
                        ];
                        solutionHtml = `Đặt $a = 12x, b = 12y$ với $\\text{ƯCLN}(x, y) = 1$ và $x < y$.<br>Từ đề bài: $a + b = 12x + 12y = 12(x + y) = 96 \\rightarrow x + y = 8$.<br>Vì $\\text{ƯCLN}(x, y) = 1$ và $x < y$ nên ta chọn được các cặp $(x, y) \\in \\{(1; 7); (3; 5)\\}$.<br>+ Với $(1; 7) \\rightarrow a = 12, b = 84$.<br>+ Với $(3; 5) \\rightarrow a = 36, b = 60$.<br>Vậy cặp số cần tìm là $(12; 84)$ hoặc $(36; 60)$.`;
                    } else {
                        // ƯCLN của n+1 và n+2.
                        questionText = `Với mọi số tự nhiên $n$, tìm ước chung lớn nhất của $n + 1$ và $n + 2$.`;
                        const correctStr = `$1$`;
                        options = [correctStr, `$2$`, `$n$`, `$Không xác định được$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Đặt $d = \\text{ƯCLN}(n+1, n+2)$. Khi đó $n+1$ và $n+2$ cùng chia hết cho $d$.`,
                            `Suy ra hiệu của chúng là $(n+2) - (n+1) = 1$ cũng phải chia hết cho $d$.`
                        ];
                        solutionHtml = `Gọi $d = \\text{ƯCLN}(n+1, n+2)$ ($d \\in \\mathbb{N}^*$).<br>Ta có: $(n+2) \\space \\vdots \\space d$ và $(n+1) \\space \\vdots \\space d$.<br>Suy ra hiệu: $[(n+2) - (n+1)] \\space \\vdots \\space d \\rightarrow 1 \\space \\vdots \\space d \\rightarrow d = 1$.<br>Vậy $\\text{ƯCLN}(n+1, n+2) = 1$ với mọi số tự nhiên $n$. (Hai số tự nhiên liên tiếp luôn nguyên tố cùng nhau).`;
                    }
                    tip = "Biến đổi hai số về tích của ƯCLN và các hệ số nguyên tố cùng nhau, hoặc dùng phương pháp tìm ƯCLN của biểu thức chứa chữ.";
                }
                break;
            }
            case "bcnn": {
                const variant = this.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        let aNum = this.randomInt(6, 25);
                        let bNum = this.randomInt(6, 25);
                        let l = this.lcm(aNum, bNum);
                        while (l > 150 || aNum % bNum === 0 || bNum % aNum === 0) {
                            aNum = this.randomInt(6, 25);
                            bNum = this.randomInt(6, 25);
                            l = this.lcm(aNum, bNum);
                        }
                        const ans = l;
                        
                        questionText = `Tìm bội chung nhỏ nhất của hai số: $\\text{BCNN}(${aNum}, ${bNum})$.`;
                        options = [`$${ans}$`, `$${ans * 2}$`, `$${aNum * bNum}$`, `$${this.gcd(aNum, bNum)}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomOpt = `$${this.randomInt(ans - 20 > 0 ? ans - 20 : 2, ans + 40)}$`;
                            if (!options.includes(randomOpt)) options.push(randomOpt);
                        }
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${ans}$`);
                        hints = [
                            `BCNN là số tự nhiên nhỏ nhất khác 0 chia hết cho cả $${aNum}$ và $${bNum}$.`,
                            `Phân tích thừa số nguyên tố và chọn các thừa số chung và riêng với số mũ lớn nhất.`
                        ];
                        solutionHtml = `Ta phân tích thừa số nguyên tố:<br>- $${aNum} = ${this.factorize(aNum)}$<br>- $${bNum} = ${this.factorize(bNum)}$<br>Lấy các thừa số nguyên tố chung và riêng với số mũ lớn nhất: $\\text{BCNN}(${aNum}, ${bNum}) = ${ans}$.`;
                    } else if (variant === 2) {
                        // BCNN của 3 số: 6, 8, 12 -> 24
                        const correctStr = `$24$`;
                        questionText = `Tìm bội chung nhỏ nhất của ba số: $\\text{BCNN}(6, 8, 12)$.`;
                        options = [correctStr, `$12$`, `$48$`, `$72$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Phân tích các số ra thừa số nguyên tố: $6 = 2 \\cdot 3$, $8 = 2^3$, $12 = 2^2 \\cdot 3$.`,
                            `Lấy tích các thừa số chung và riêng với số mũ lớn nhất.`
                        ];
                        solutionHtml = `Ta có:<br>$6 = 2 \\cdot 3$<br>$8 = 2^3$<br>$12 = 2^2 \\cdot 3$<br>Thừa số chung và riêng là 2 và 3. Cơ số 2 lấy số mũ 3, cơ số 3 lấy số mũ 1. Vậy $\\text{BCNN}(6, 8, 12) = 2^3 \\cdot 3 = 24$.`;
                    } else {
                        // Một số là bội của số kia
                        const a = 15;
                        const b = 45;
                        const correctStr = `$${b}$`;
                        questionText = `Tìm bội chung nhỏ nhất của hai số $${a}$ và $${b}$.`;
                        options = [correctStr, `$${a}$`, `$${a * b}$`, `$150$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Kiểm tra xem số lớn $${b}$ có chia hết cho số nhỏ $${a}$ không.`,
                            `Nếu số lớn chia hết cho số nhỏ, thì BCNN của chúng chính là số lớn.`
                        ];
                        solutionHtml = `Vì $${b} \\space \\vdots \\space ${a}$ nên bội chung nhỏ nhất của hai số chính là số lớn: $\\text{BCNN}(${a}, ${b}) = ${b}$.`;
                    }
                    tip = "BCNN lấy tất cả các thừa số chung và riêng với số mũ lớn nhất. Nếu số lớn chia hết cho số bé thì BCNN là số lớn.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const pairs = [[10, 15], [12, 15], [15, 20], [15, 25]];
                        const pair = pairs[this.randomInt(0, pairs.length - 1)];
                        const xe1 = pair[0];
                        const xe2 = pair[1];
                        const l = this.lcm(xe1, xe2);
                        
                        const startHour = 6;
                        const nextMin = l % 60;
                        const nextHour = startHour + Math.floor(l / 60);
                        const timeStr = `${nextHour} giờ ${nextMin.toString().padStart(2, '0')} phút`;
                        
                        questionText = `Hai xe buýt cùng xuất phát từ bến lúc ${startHour} giờ sáng. Biết xe thứ nhất cứ ${xe1} phút chạy một chuyến, xe thứ hai cứ ${xe2} phút chạy một chuyến. Hỏi hai xe lại cùng xuất phát từ bến lần tiếp theo lúc mấy giờ?`;
                        
                        options = [
                            `$${nextHour}$ giờ $${nextMin.toString().padStart(2, '0')}$ phút`,
                            `$${nextHour}$ giờ $${(nextMin + xe1) % 60}$ phút`,
                            `$${nextHour + 1}$ giờ $00$ phút`,
                            `$${startHour}$ giờ $${xe1 + xe2}$ phút`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomH = startHour + this.randomInt(0, 3);
                            const randomM = [0, 15, 30, 45][this.randomInt(0, 3)];
                            const opt = `$${randomH}$ giờ $${randomM.toString().padStart(2, '0')}$ phút`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${nextHour}$ giờ $${nextMin.toString().padStart(2, '0')}$ phút`);
                        hints = [
                            `Khoảng thời gian hai xe lại cùng xuất phát từ bến chính là BCNN của tần suất chạy xe: BCNN($${xe1}, ${xe2}$).`,
                            `Tính BCNN rồi cộng số phút đó vào lúc ${startHour} giờ sáng.`
                        ];
                        solutionHtml = `Thời gian hai xe lại cùng xuất phát là $\\text{BCNN}(${xe1}, ${xe2}) = ${l}$ phút.<br>Đổi: $${l}$ phút = ${Math.floor(l / 60) > 0 ? `${Math.floor(l / 60)} giờ ` : ''}${nextMin > 0 ? `${nextMin} phút` : ''}.<br>Vậy lần cùng xuất phát tiếp theo là lúc: ${startHour} giờ + ${Math.floor(l / 60)} giờ ${nextMin > 0 ? `${nextMin} phút` : ''} = ${timeStr}.`;
                    } else if (variant === 2) {
                        const sec1 = 8;
                        const sec2 = 12;
                        const correctStr = `$24$ giây`;
                        questionText = `Ở một ngã tư, đèn xanh của luồng thứ nhất cứ nhấp nháy sau $${sec1}$ giây, đèn xanh của luồng thứ hai cứ nhấp nháy sau $${sec2}$ giây. Nếu hai đèn cùng nhấp nháy vào lúc 12 giờ trưa, hỏi sau ít nhất bao nhiêu lâu thì hai đèn lại cùng nhấp nháy?`;
                        options = [correctStr, `$36$ giây`, `$48$ giây`, `$16$ giây`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Khoảng thời gian hai đèn cùng nhấp nháy lại phải chia hết cho cả $${sec1}$ và $${sec2}$.`,
                            `Số giây ít nhất cần tìm là bội chung nhỏ nhất của $${sec1}$ và $${sec2}$.`
                        ];
                        solutionHtml = `Khoảng thời gian ngắn nhất để hai đèn cùng nhấp nháy lại là: $\\text{BCNN}(${sec1}, ${sec2}) = \\text{BCNN}(8, 12) = 24$ giây.`;
                    } else {
                        const correctStr = `$60$ phút`;
                        questionText = `Ba bạn An, Bình, Chi cùng học một trường nhưng ở các lớp khác nhau. An cứ 10 ngày trực nhật một lần, Bình cứ 12 ngày trực một lần, Chi cứ 15 ngày trực một lần. Lần đầu ba bạn cùng trực nhật vào một ngày. Hỏi sau ít nhất bao nhiêu ngày nữa ba bạn lại cùng trực nhật?`;
                        options = [`$60$ ngày`, `$30$ ngày`, `$120$ ngày`, `$90$ ngày`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$60$ ngày`);
                        hints = [
                            `Số ngày ba bạn gặp nhau tiếp theo phải là bội chung của 10, 12 và 15.`,
                            `Tìm bội chung nhỏ nhất để xác định số ngày ngắn nhất.`
                        ];
                        solutionHtml = `Số ngày ít nhất để ba bạn cùng trực nhật lại là: $\\text{BCNN}(10, 12, 15) = 60$ ngày.`;
                    }
                    tip = "Các bài toán chu kỳ lặp lại trùng nhau luôn quy về tìm BCNN.";
                } else { // kho
                    if (variant === 1) {
                        const baseLCM = 60;
                        const r = this.randomInt(1, 5);
                        const multiplier = 2;
                        const ans = baseLCM * multiplier + r;
                        const min = 100;
                        const max = 150;
                        
                        questionText = `Một số học sinh khi xếp hàng 10, hàng 12, hàng 15 đều dư ${r} em. Biết số học sinh đó trong khoảng từ $${min}$ đến $${max}$ em. Tính số học sinh đó.`;
                        options = [`$${ans}$ học sinh`, `$${ans - r}$ học sinh`, `$${ans + r}$ học sinh`, `$${ans - 2}$ học sinh`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomOpt = `$${this.randomInt(min, max)}$ học sinh`;
                            if (!options.includes(randomOpt)) options.push(randomOpt);
                        }
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${ans}$ học sinh`);
                        hints = [
                            `Gọi số học sinh là $x$. Theo đề bài, $x - ${r}$ chia hết cho cả 10, 12 và 15.`,
                            `Do đó $x - ${r}$ là bội chung của 10, 12, 15. Hãy tìm $\\text{BCNN}(10, 12, 15)$ rồi chọn bội số nằm trong khoảng $[${min}, ${max}]$.`
                        ];
                        solutionHtml = `Gọi số học sinh là $x$ ($$${min} \\le x \\le $$${max}). Ta có $x - ${r}$ là bội chung của $10, 12, 15$.<br>Ta tìm $\\text{BCNN}(10, 12, 15) = 60$. Do đó $x - ${r} \\in \\{60; 120; 180;...\\}$.<br>Vì 100 $\\le x \\le$ 150 $\\rightarrow x - ${r} = 120 \\rightarrow x = 120 + ${r} = ${ans}$ học sinh.`;
                    } else if (variant === 2) {
                        // Thiếu 1 em: chia 10 thiếu 1, chia 12 thiếu 1, chia 15 thiếu 1.
                        // x + 1 là bội chung.
                        // Khoảng [200, 250] -> BCNN = 60. Các bội: 60, 120, 180, 240.
                        // x + 1 = 240 -> x = 239.
                        const correctStr = `$239$ học sinh`;
                        questionText = `Số học sinh của trường khi xếp hàng 10, hàng 12, hàng 15 đều thiếu $1$ học sinh. Biết số học sinh trong khoảng từ $200$ đến $250$ học sinh. Hỏi trường đó có bao nhiêu học sinh?`;
                        options = [correctStr, `$240$ học sinh`, `$241$ học sinh`, `$209$ học sinh`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Gọi số học sinh là $x$. Vì xếp hàng đều thiếu 1 học sinh nên $x + 1$ chia hết cho 10, 12 và 15.`,
                            `Tìm $\\text{BCNN}(10, 12, 15) = 60$. Bội chung $x+1$ sẽ là các bội của 60.`,
                            `Xác định bội của 60 nằm trong khoảng $[200 + 1, 250 + 1]$ để tìm $x$.`
                        ];
                        solutionHtml = `Gọi số học sinh là $x$ ($200 \\le x \\le 250$).<br>Vì xếp hàng 10, 12, 15 đều thiếu 1 học sinh nên $x + 1$ là bội chung của $10, 12, 15$.<br>Ta có $\\text{BCNN}(10, 12, 15) = 60 \\rightarrow x + 1 \\in \\{60; 120; 180; 240; 300;...\\}$.<br>Vì $200 \\le x \\le 250 \\rightarrow 201 \\le x + 1 \\le 251$. Do đó ta chọn $x + 1 = 240 \\rightarrow x = 239$ học sinh.`;
                    } else {
                        // BCNN(a, b) = 180. a . b = 360 -> UCLN = 360 / 180 = 2.
                        // a = 2x, b = 2y. BCNN(a,b) = 2.x.y = 180 -> xy = 90.
                        // UCLN(x,y) = 1. a < b -> x < y.
                        // Cặp x, y: (1, 90), (2, 45), (5, 18), (9, 10).
                        // Cặp a, b: (2, 180), (4, 90), (10, 36), (18, 20).
                        const correctStr = `$a = 18; b = 20$ (hoặc các cặp khác thỏa mãn)`;
                        questionText = `Tìm hai số tự nhiên $a$ và $b$ ($a < b$) biết rằng $\\text{BCNN}(a, b) = 180$ và tích $a \\cdot b = 360$.`;
                        const ansStr = `$a = 18; b = 20$`;
                        options = [ansStr, `$a = 2; b = 180$`, `$a = 10; b = 36$`, `$a = 4; b = 90$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(ansStr);
                        hints = [
                            `Sử dụng công thức liên hệ giữa ƯCLN và BCNN của hai số: $a \\cdot b = \\text{ƯCLN}(a, b) \\cdot \\text{BCNN}(a, b)$.`,
                            `Tính $\\text{ƯCLN}(a, b) = 360 : 180 = 2$.`,
                            `Đưa về bài toán đặt $a = 2x, b = 2y$ với $\\text{ƯCLN}(x, y) = 1$ và $xy = 90$.`
                        ];
                        solutionHtml = `Ta áp dụng công thức: $a \\cdot b = \\text{ƯCLN}(a, b) \\cdot \\text{BCNN}(a, b)$.<br>Suy ra $\\text{ƯCLN}(a, b) = (a \\cdot b) : \\text{BCNN}(a, b) = 360 : 180 = 2$.<br>Đặt $a = 2x, b = 2y$ với $\\text{ƯCLN}(x, y) = 1$ và $x < y$.<br>Ta có $a \\cdot b = 4xy = 360 \\rightarrow xy = 90$.<br>Các cặp số $(x, y)$ nguyên tố cùng nhau có tích bằng 90 là: $(1; 90), (2; 45), (5; 18), (9; 10)$.<br>Các cặp số $(a, b)$ tương ứng là: $(2; 180), (4; 90), (10; 36), (18; 20)$. Phương án có chứa $a=18, b=20$ là đáp án đúng duy nhất trong các lựa chọn.`;
                    }
                    tip = "Gọi ẩn số, đưa về bài toán bội chung bằng cách bớt đi phần dư hoặc cộng thêm phần thiếu. Sử dụng công thức tích để giải các bài toán ƯCLN và BCNN phối hợp.";
                }
                break;
            }
            case "tap-hop-so-nguyen": {
                const variant = this.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = this.randomInt(4, 9);
                        const b = a + this.randomInt(2, 4);
                        questionText = `Phát biểu so sánh số nguyên nào dưới đây là **đúng**?`;
                        options = [`$-${b} < -${a}$`, `$-${b} > -${a}$`, `$-${a} < -${b}$`, `$-${a} = -${b}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$-${b} < -${a}$`);
                        hints = [
                            `Với hai số nguyên âm, số có phần số tự nhiên lớn hơn thì nhỏ hơn.`,
                            `So sánh $${b}$ và $${a}$, từ đó suy ra chiều so sánh của $-${b}$ và $-${a}$.`
                        ];
                        solutionHtml = `Vì $${b} > ${a}$, nên trên trục số, điểm $-${b}$ nằm bên trái điểm $-${a}$. Do đó ta có: $-${b} < -${a}$.`;
                    } else if (variant === 2) {
                        const t1 = this.randomInt(-8, -4);
                        const t2 = this.randomInt(-3, -1);
                        questionText = `Nhiệt độ đo được vào buổi sáng tại Sa Pa là $${t1}^\\circ\\text{C}$, tại Hà Nội là $${t2}^\\circ\\text{C}$. Khẳng định nào sau đây là **đúng**?`;
                        const correctStr = `Thời tiết ở Sa Pa lạnh hơn Hà Nội vì $${t1}^\\circ\\text{C} < ${t2}^\\circ\\text{C}$.`;
                        options = [
                            correctStr,
                            `Thời tiết ở Sa Pa ấm hơn Hà Nội vì $${t1} > ${t2}$.`,
                            `Thời tiết ở Sa Pa lạnh hơn Hà Nội vì $${t1} > ${t2}$.`,
                            `Thời tiết ở hai nơi bằng nhau.`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Nhiệt độ càng thấp (giá trị số nguyên âm càng nhỏ) thì thời tiết càng lạnh.`,
                            `So sánh hai số nguyên âm $${t1}$ và $${t2}$.`
                        ];
                        solutionHtml = `Ta so sánh hai số nguyên âm: $${t1} < ${t2}$ vì $${Math.abs(t1)} > ${Math.abs(t2)}$. Do đó, nhiệt độ ở Sa Pa ($${t1}^\\circ\\text{C}$) thấp hơn nhiệt độ ở Hà Nội ($${t2}^\\circ\\text{C}$), nghĩa là thời tiết ở Sa Pa lạnh hơn Hà Nội.`;
                    } else {
                        const n = this.randomInt(5, 15);
                        questionText = `Tìm số đối của số đối của số $-${n}$.`;
                        options = [`$-${n}$`, `$${n}$`, `$0$`, `$1$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$-${n}$`);
                        hints = [
                            `Số đối của số nguyên $a$ kí hiệu là $-a$.`,
                            `Số đối của $-${n}$ là $${n}$.`,
                            `Tiếp tục tìm số đối của số vừa tìm được.`
                        ];
                        solutionHtml = `Số đối của số $-${n}$ là $${n}$. Số đối của $${n}$ là $-${n}$. Vậy số đối của số đối của $-${n}$ chính là $-${n}$.`;
                    }
                    tip = "Số đối của số đối của một số chính là bản thân số đó.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const baseArr = [-7, -3, 0, 2, 5];
                        const delta = this.randomInt(1, 3);
                        const arr = baseArr.map(x => x * delta);
                        const sortedArr = [...arr].sort((a,b)=>a-b);
                        questionText = `Sắp xếp các số nguyên sau theo thứ tự **tăng dần**: $${arr.join(';\\space ')}$.`;
                        const correctStr = `$${sortedArr.join(';\\space ')}$`;
                        options = [
                            correctStr,
                            `$${[...sortedArr].reverse().join(';\\space ')}$`,
                            `$${sortedArr.filter(x=>x!==0).concat([0]).join(';\\space ')}$`,
                            `$${[sortedArr[1], sortedArr[0], sortedArr[2], sortedArr[3], sortedArr[4]].join(';\\space ')}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Số nguyên âm luôn nhỏ hơn 0, số 0 luôn nhỏ hơn số nguyên dương.`,
                            `So sánh phần số tự nhiên của các số nguyên âm: số nào có phần số tự nhiên lớn hơn thì nhỏ hơn.`
                        ];
                        solutionHtml = `So sánh các số ta có: $${sortedArr.join(' < ')}$. Vậy thứ tự sắp xếp tăng dần là: $${sortedArr.join(';\\space ')}$.`;
                    } else if (variant === 2) {
                        const a = this.randomInt(3, 5);
                        const b = this.randomInt(4, 7);
                        questionText = `Có bao nhiêu số nguyên $x$ thỏa mãn điều kiện: $-${a} \\le x < ${b}$?`;
                        const correctVal = b + a;
                        options = [`$${correctVal}$`, `$${correctVal - 1}$`, `$${correctVal + 1}$`, `$${b - a}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Liệt kê các số nguyên bắt đầu từ $-${a}$ (vì có dấu $\\le$) đến số nguyên nhỏ hơn $${b}$ (không lấy $${b}$).`,
                            `Tính số lượng các phần tử trong danh sách.`
                        ];
                        solutionHtml = `Các số nguyên $x$ thỏa mãn là: $x \\in \\{${Array.from({length: b + a}, (_, i) => -a + i).join(';\\space ')}\\}$. Tập hợp này gồm có $${correctVal}$ phần tử.`;
                    } else {
                        const a = this.randomInt(2, 4);
                        questionText = `Tìm tập hợp tất cả các số nguyên $x$ thỏa mãn điều kiện: $|x| \\le ${a}$.`;
                        const correctArr = [];
                        for(let i = -a; i <= a; i++) correctArr.push(i);
                        const correctStr = `$x \\in \\{${correctArr.join(';\\space ')}\\}$`;
                        options = [
                            correctStr,
                            `$x \\in \\{0;\\space ${Array.from({length: a}, (_, i) => i + 1).join(';\\space ')}\\}$`,
                            `$x \\in \\{${Array.from({length: a}, (_, i) => -(i+1)).reverse().join(';\\space ')}\\}$`,
                            `$x \\in \\{-${a};\\space ${a}\\}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Giá trị tuyệt đối của số nguyên $x$ là khoảng cách từ điểm $x$ đến điểm 0 trên trục số.`,
                            `$|x| \\le ${a}$ nghĩa là khoảng cách này nhỏ hơn hoặc bằng $${a}$. Do đó $x$ nằm trong đoạn từ $-${a}$ đến $${a}$.`
                        ];
                        solutionHtml = `Ta có $|x| \\le ${a} \\rightarrow -${a} \\le x \\le ${a}$ với $x \\in \\mathbb{Z}$.<br>Do đó $x \\in \\{${correctArr.join(';\\space ')}\\}$.`;
                    }
                    tip = "Thứ tự tăng dần là từ trái sang phải trên trục số. Hãy nhớ $|x| \\le a \\leftrightarrow -a \\le x \\le a$.";
                } else { // kho
                    if (variant === 1) {
                        const a = this.randomInt(5, 7);
                        const b = this.randomInt(4, 6);
                        questionText = `Tìm tổng của tất cả các số nguyên $x$ thỏa mãn điều kiện: $-${a} < x \\le ${b}$.`;
                        let sum = 0;
                        const arr = [];
                        for(let i = -a + 1; i <= b; i++) {
                            sum += i;
                            arr.push(i);
                        }
                        options = [`$${sum}$`, `$0$`, `$${sum - 5}$`, `$${sum + a}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${sum}$`);
                        hints = [
                            `Liệt kê các số nguyên từ $-${a} + 1$ đến $${b}$.`,
                            `Nhóm các cặp số đối nhau để triệt tiêu tổng bằng 0 trước khi tính tổng phần còn lại.`
                        ];
                        solutionHtml = `Các số nguyên $x$ thỏa mãn là: $x \\in \\{${arr.join(';\\space ')}\\}$.<br>Tính tổng: $S = ${arr.join(' + ').replace('+ -', '- ')}$.<br>Nhóm các số đối nhau:<br>+ Nếu $a-1 > b$: $S = [(-${b}) + ${b}] + ... + [(-1) + 1] + 0 + (-${b + 1}) + ... + (-${a - 1}) = -\\frac{(${b + 1} + ${a - 1}) \\cdot (${a - 1 - b})}{2} = ${sum}$.<br>+ Nếu $a-1 \\le b$: Tương tự, ta tính ra tổng $S = ${sum}$.`;
                    } else if (variant === 2) {
                        const a = 3;
                        const b = 2;
                        const c = 5;
                        questionText = `Cho hai tập hợp: $A = \\{x \\in \\mathbb{Z} \\mid |x| \\le ${a}\\}$ và $B = \\{y \\in \\mathbb{Z} \\mid -${b} < y < ${c}\\}$. Tính tổng các số nguyên thuộc cả hai tập hợp $A$ và $B$.`;
                        const sum = 5; // -1 + 0 + 1 + 2 + 3 = 5
                        options = [`$${sum}$`, `$0$`, `$-3$`, `$${sum + 3}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${sum}$`);
                        hints = [
                            `Liệt kê tập hợp $A$: các số nguyên từ $-3$ đến $3$.`,
                            `Liệt kê tập hợp $B$: các số nguyên lớn hơn $-2$ và nhỏ hơn $5$.`,
                            `Tìm các số nguyên chung của cả hai tập hợp rồi tính tổng.`
                        ];
                        solutionHtml = `Ta có:<br>- $A = \\{-3;\\space -2;\\space -1;\\space 0;\\space 1;\\space 2;\\space 3\\}$.<br>- $B = \\{-1;\\space 0;\\space 1;\\space 2;\\space 3;\\space 4\\}$.<br>Các số nguyên chung của cả hai tập hợp (giao của $A$ và $B$) là: $\\{-1;\\space 0;\\space 1;\\space 2;\\space 3\\}$.<br>Tổng của các số nguyên này là: $(-1) + 0 + 1 + 2 + 3 = 5$.`;
                    } else {
                        const d = this.randomInt(5, 10);
                        questionText = `Trên trục số, hai điểm $A$ và $B$ biểu diễn hai số đối nhau. Biết rằng điểm $A$ nằm bên trái điểm $B$ và khoảng cách giữa $A$ và $B$ là $${2*d}$ đơn vị. Tìm hai số nguyên biểu diễn bởi $A$ và $B$.`;
                        const correctStr = `$A = -${d};\\space B = ${d}$`;
                        options = [
                            correctStr,
                            `$A = -${2*d};\\space B = ${2*d}$`,
                            `$A = 0;\\space B = ${2*d}$`,
                            `$A = -${d};\\space B = -${d}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Hai số đối nhau có khoảng cách đến điểm 0 bằng nhau.`,
                            `Do đó, khoảng cách từ điểm 0 đến mỗi điểm $A$ và $B$ bằng một nửa khoảng cách giữa $A$ và $B$.`,
                            `Điểm $A$ nằm bên trái điểm 0 nên biểu diễn số âm, điểm $B$ nằm bên phải nên biểu diễn số dương.`
                        ];
                        solutionHtml = `Vì $A$ và $B$ biểu diễn hai số đối nhau nên điểm 0 là trung điểm của đoạn thẳng $AB$.<br>Khoảng cách từ điểm 0 đến mỗi điểm là: $${2*d} : 2 = ${d}$ đơn vị.<br>Do $A$ nằm bên trái điểm $B$ (và điểm 0 nằm giữa), ta có: điểm $A$ biểu diễn số nguyên âm $-${d}$, điểm $B$ biểu diễn số nguyên dương $${d}$.`;
                    }
                    tip = "Khoảng cách giữa hai điểm đối nhau trên trục số bằng 2 lần giá trị tuyệt đối của mỗi số.";
                }
                break;
            }
            case "cong-tru-so-nguyen": {
                const variant = this.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = this.randomInt(5, 12);
                        const b = this.randomInt(15, 25);
                        questionText = `Tính giá trị biểu thức: $A = ${a} - ${b}$.`;
                        const correctVal = a - b;
                        options = [`$${correctVal}$`, `$${Math.abs(correctVal)}$`, `$${correctVal - 1}$`, `$${a + b}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Đây là phép trừ số nhỏ cho số lớn. Kết quả chắc chắn là số nguyên âm.`,
                            `Quy tắc: $a - b = -(b - a)$ với $b > a$.`
                        ];
                        solutionHtml = `Ta có $${a} < ${b}$, nên $A = ${a} - ${b} = -(${b} - ${a}) = -${b - a}$.`;
                    } else if (variant === 2) {
                        const a = this.randomInt(50, 100);
                        const b = a + this.randomInt(10, 40);
                        questionText = `Số tiền trong tài khoản của bạn Nam là $${a}\\text{ nghìn đồng}$. Sau khi bạn Nam rút ra $${b}\\text{ nghìn đồng}$ để mua sách, tài khoản của Nam sẽ là bao nhiêu?`;
                        const correctVal = a - b;
                        options = [`$${correctVal}\\text{ nghìn đồng}$`, `$${Math.abs(correctVal)}\\text{ nghìn đồng}$`, `$0\\text{ nghìn đồng}$`, `$${correctVal - 5}\\text{ nghìn đồng}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}\\text{ nghìn đồng}$`);
                        hints = [
                            `Số tiền còn lại là hiệu của số tiền ban đầu và số tiền đã rút: $${a} - ${b}$.`,
                            `Vì số tiền rút ra lớn hơn số tiền hiện có, tài khoản sẽ rơi vào trạng thái nợ (số âm).`
                        ];
                        solutionHtml = `Số tiền còn lại trong tài khoản là: $${a} - ${b} = -(${b} - ${a}) = ${correctVal}\\text{ nghìn đồng}$ (biểu thị tài khoản đang nợ $${Math.abs(correctVal)}\\text{ nghìn đồng}$).`;
                    } else {
                        const t1 = this.randomInt(2, 6);
                        const t2 = t1 + this.randomInt(5, 9);
                        questionText = `Nhiệt độ vào buổi trưa ở Mẫu Sơn là $${t1}^\\circ\\text{C}$. Đến nửa đêm, nhiệt độ giảm đi $${t2}^\\circ\\text{C}$. Hỏi nhiệt độ ở Mẫu Sơn lúc nửa đêm là bao nhiêu?`;
                        const correctVal = t1 - t2;
                        options = [`$${correctVal}^\\circ\\text{C}$`, `$${Math.abs(correctVal)}^\\circ\\text{C}$`, `$0^\\circ\\text{C}$`, `$${correctVal - 1}^\\circ\\text{C}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}^\\circ\\text{C}$`);
                        hints = [
                            `Nhiệt độ giảm đi nghĩa là ta thực hiện phép toán trừ: $${t1} - ${t2}$.`,
                            `Tính hiệu của hai số để tìm nhiệt độ mới.`
                        ];
                        solutionHtml = `Nhiệt độ lúc nửa đêm là: $${t1} - ${t2} = -(${t2} - ${t1}) = ${correctVal}^\\circ\\text{C}$.`;
                    }
                    tip = "Lấy số lớn trừ số bé rồi đặt dấu trừ trước kết quả nếu số bị trừ nhỏ hơn số trừ.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const a = this.randomInt(10, 20);
                        const b = this.randomInt(15, 25);
                        const c = this.randomInt(5, 15);
                        questionText = `Tính nhanh giá trị biểu thức: $M = ${a} - ${b} - (${c} - ${b})$`;
                        const correctVal = a - c;
                        options = [`$${correctVal}$`, `$${a - 2*b - c}$`, `$${correctVal + 10}$`, `$0$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Bỏ ngoặc có dấu trừ phía trước: đổi dấu các số hạng trong ngoặc.`,
                            `Biểu thức trở thành: $${a} - ${b} - ${c} + ${b}$.`
                        ];
                        solutionHtml = `Bỏ ngoặc: $M = ${a} - ${b} - ${c} + ${b} = ${a} - ${c} + (${b} - ${b}) = ${a - c}$.`;
                    } else if (variant === 2) {
                        const a = this.randomInt(10, 20);
                        questionText = `Tính nhanh tổng của dãy số sau: $S = ${a} - (${a}+1) + (${a}+2) - (${a}+3) + (${a}+4) - (${a}+5)$`;
                        const correctVal = -3;
                        options = [`$-3$`, `$3$`, `$0$`, `$${6 * a}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$-3$`);
                        hints = [
                            `Nhóm các cặp số hạng liên tiếp lại với nhau: $[${a} - (${a}+1)] + [(${a}+2) - (${a}+3)] + [(${a}+4) - (${a}+5)]$.`,
                            `Mỗi cặp có giá trị bằng bao nhiêu?`
                        ];
                        solutionHtml = `Ta nhóm các số hạng thành từng cặp liên tiếp:<br>$S = [${a} - (${a}+1)] + [(${a}+2) - (${a}+3)] + [(${a}+4) - (${a}+5)]$.<br>Mỗi cặp đều có hiệu bằng $-1$.<br>Do đó: $S = (-1) + (-1) + (-1) = -3$.`;
                    } else {
                        const a = this.randomInt(10, 20);
                        const b = this.randomInt(5, 9);
                        questionText = `Tìm số nguyên $x$, biết: $${a} - x = -${b}$.`;
                        const correctVal = a + b;
                        options = [`$${correctVal}$`, `$${a - b}$`, `$${b - a}$`, `$${-correctVal}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Trong phép trừ, muốn tìm số trừ ta lấy số bị trừ trừ đi hiệu.`,
                            `Do đó: $x = ${a} - (-${b})$.`,
                            `Trừ cho một số âm là cộng với số dương đối của nó.`
                        ];
                        solutionHtml = `Ta có: $${a} - x = -${b} \\rightarrow x = ${a} - (-${b}) = ${a} + ${b} = ${correctVal}$.`;
                    }
                    tip = "Hãy bỏ ngoặc trước để tìm các số hạng đối nhau rồi triệt tiêu chúng. Nhớ quy tắc: $A - (-B) = A + B$.";
                } else { // kho
                    if (variant === 1) {
                        const xVal = this.randomInt(1, 4);
                        const k = this.randomInt(2, 5);
                        questionText = `Tìm số nguyên $x$, biết: $|x - ${xVal}| + ${k} = ${k + 2}$`;
                        const x1 = xVal + 2;
                        const x2 = xVal - 2;
                        options = [
                            `$x \\in \\{${x1};\\space ${x2}\\}$`,
                            `$x = ${x1}$`,
                            `$x = ${x2}$`,
                            `$x \\in \\{${xVal};\\space -${xVal}\\}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$x \\in \\{${x1};\\space ${x2}\\}$`);
                        hints = [
                            `Tìm giá trị tuyệt đối trước: $|x - ${xVal}| = ${k + 2} - ${k} = 2$.`,
                            `Có hai trường hợp: $x - ${xVal} = 2$ hoặc $x - ${xVal} = -2$.`
                        ];
                        solutionHtml = `Ta có: $|x - ${xVal}| = 2$.<br>Trường hợp 1: $x - ${xVal} = 2 \\rightarrow x = ${x1}$.<br>Trường hợp 2: $x - ${xVal} = -2 \\rightarrow x = ${x2}$. Vậy $x \\in \\{${x1};\\space ${x2}\\}$.`;
                    } else if (variant === 2) {
                        questionText = `Tính tổng của dãy số nguyên sau: $S = 1 - 3 + 5 - 7 + ... + 97 - 99$`;
                        const correctVal = -50;
                        options = [`$-50$`, `$50$`, `$-100$`, `$0$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$-50$`);
                        hints = [
                            `Đếm số lượng số hạng trong dãy số.`,
                            `Nhóm hai số hạng liên tiếp thành một cặp: $(1 - 3) + (5 - 7) + ... + (97 - 99)$.`,
                            `Tính số lượng cặp và giá trị của mỗi cặp.`
                        ];
                        solutionHtml = `Dãy số $1; 3; 5; ...; 99$ là dãy số lẻ cách đều 2 đơn vị. Số các số hạng là: $(99 - 1) : 2 + 1 = 50$ số hạng.<br>Nhóm thành các cặp liên tiếp: $S = (1 - 3) + (5 - 7) + ... + (97 - 99)$.<br>Số lượng cặp là: $50 : 2 = 25$ cặp.<br>Giá trị của mỗi cặp là: $1 - 3 = -2$.<br>Vậy tổng $S = 25 \\cdot (-2) = -50$.`;
                    } else {
                        const a = this.randomInt(1, 3);
                        const b = this.randomInt(3, 5);
                        const c = this.randomInt(1, 2);
                        questionText = `Tìm tất cả các số nguyên $x$, biết: $||x - ${a}| - ${b}| = ${c}$.`;
                        const v1 = a + b + c;
                        const v2 = a + b - c;
                        const v3 = a - b + c;
                        const v4 = a - b - c;
                        
                        const correctSet = new Set([v1, v2, 2*a - v1, 2*a - v2]);
                        const correctArr = [...correctSet].sort((x, y) => x - y);
                        const correctStr = `$x \\in \\{${correctArr.join(';\\space ')}\\}$`;
                        
                        options = [
                            correctStr,
                            `$x \\in \\{${v1};\\space ${v2}\\}$`,
                            `$x \\in \\{${correctArr.slice(0, 2).join(';\\space ')}\\}$`,
                            `$x \\in \\{0;\\space ${v1}\\}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Giải phương trình chứa dấu giá trị tuyệt đối bên ngoài trước: $|x - ${a}| - ${b} = ${c}$ hoặc $|x - ${a}| - ${b} = -${c}$.`,
                            `Tìm $|x - ${a}|$ trong từng trường hợp rồi tiếp tục phá dấu giá trị tuyệt đối thứ hai.`
                        ];
                        solutionHtml = `Ta có: $||x - ${a}| - ${b}| = ${c}$.<br>Trường hợp 1: $|x - ${a}| - ${b} = ${c} \\rightarrow |x - ${a}| = ${b+c}$.<br>Suy ra $x - ${a} = ${b+c} \\rightarrow x = ${a+b+c}$ hoặc $x - ${a} = -${b+c} \\rightarrow x = ${a-b-c}$.<br>Trường hợp 2: $|x - ${a}| - ${b} = -${c} \\rightarrow |x - ${a}| = ${b-c}$ (do $b > c$ nên $b-c > 0$, thỏa mãn).<br>Suy ra $x - ${a} = ${b-c} \\rightarrow x = ${a+b-c}$ hoặc $x - ${a} = -${b-c} \\rightarrow x = ${a-b+c}$.<br>Vậy các giá trị $x$ thỏa mãn là: $x \\in \\{${correctArr.join(';\\space ')}\\}$.`;
                    }
                    tip = "Với các bài toán chứa nhiều lớp giá trị tuyệt đối, hãy phá từ ngoài vào trong và nhớ kiểm tra điều kiện vế phải $\\ge 0$.";
                }
                break;
            }
            case "dau-ngoac": {
                const variant = this.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = this.randomInt(15, 25);
                        const b = this.randomInt(5, 10);
                        const c = this.randomInt(2, 4);
                        questionText = `Bỏ ngoặc biểu thức sau: $A = ${a} - (${b} - x + ${c})$.`;
                        options = [
                            `$A = ${a} - ${b} + x - ${c}$`,
                            `$A = ${a} - ${b} - x + ${c}$`,
                            `$A = ${a} - ${b} + x + ${c}$`,
                            `$A = ${a} - ${b} - x - ${c}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$A = ${a} - ${b} + x - ${c}$`);
                        hints = [
                            `Trước ngoặc là dấu trừ: đổi dấu toàn bộ số hạng trong ngoặc.`,
                            `Số $${b}$ đổi thành $-${b}$, $-x$ đổi thành $+x$, $+${c}$ đổi thành $-${c}$.`
                        ];
                        solutionHtml = `Vì trước ngoặc có dấu trừ, ta đổi dấu toàn bộ hạng tử trong ngoặc: $A = ${a} - ${b} + x - ${c}$.`;
                    } else if (variant === 2) {
                        const a = this.randomInt(10, 20);
                        const b = this.randomInt(5, 15);
                        questionText = `Thu gọn biểu thức sau bằng cách bỏ ngoặc: $B = -${a} - (${b} - ${a})$.`;
                        const correctVal = -b;
                        options = [`$${correctVal}$`, `$${-2*a - b}$`, `$${b}$`, `$0$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Bỏ ngoặc có dấu trừ đằng trước: $-(${b} - ${a}) = -${b} + ${a}$.`,
                            `Rút gọn các số hạng đối nhau: $-${a} + ${a} = 0$.`
                        ];
                        solutionHtml = `Bỏ ngoặc ta được: $B = -${a} - ${b} + ${a} = (-${a} + ${a}) - ${b} = 0 - ${b} = -${b}$.`;
                    } else {
                        questionText = `Chọn khẳng định **đúng** về quy tắc bỏ ngoặc có dấu trừ đằng trước: $-(a - b + c) = ?$`;
                        const correctStr = `$-a + b - c$`;
                        options = [correctStr, `$-a - b - c$`, `$-a + b + c$`, `$a - b + c$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Quy tắc bỏ ngoặc: Khi bỏ dấu ngoặc có dấu "-" đằng trước, ta phải đổi dấu tất cả các số hạng trong dấu ngoặc.`,
                            `Dấu "+" đổi thành dấu "-" và dấu "-" đổi thành dấu "+".`
                        ];
                        solutionHtml = `Theo quy tắc bỏ ngoặc, trước ngoặc có dấu trừ ta đổi dấu tất cả các số hạng bên trong:<br>$a$ (mang dấu + ngầm định) đổi thành $-a$;<br>$-b$ đổi thành $+b$;<br>$+c$ đổi thành $-c$.<br>Do đó: $-(a - b + c) = -a + b - c$.`;
                    }
                    tip = "Trước ngoặc có dấu trừ thì bên trong đổi dấu toàn bộ: cộng thành trừ, trừ thành cộng.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const a = this.randomInt(25, 45);
                        const b = this.randomInt(50, 80);
                        const c = this.randomInt(5, 15);
                        questionText = `Tính giá trị biểu thức sau bằng cách bỏ ngoặc hợp lý: $N = (${a} - ${b}) - (${a} - ${b} - ${c})$`;
                        options = [`$${c}$`, `$${-c}$`, `$${2*a - 2*b - c}$`, `$0$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${c}$`);
                        hints = [
                            `Bỏ dấu ngoặc thứ nhất (giữ nguyên) và ngoặc thứ hai (đổi dấu toàn bộ).`,
                            `Biểu thức trở thành: $${a} - ${b} - ${a} + ${b} + ${c}$.`
                        ];
                        solutionHtml = `Bỏ ngoặc ta được: $N = ${a} - ${b} - ${a} + ${b} + ${c} = (${a} - ${a}) + (-${b} + ${b}) + ${c} = ${c}$.`;
                    } else if (variant === 2) {
                        questionText = `Rút gọn biểu thức sau (với $x, y, z$ là các số nguyên): $P = x - [y - (z - x)]$.`;
                        const correctStr = `$-y + z$`;
                        options = [correctStr, `$2x - y + z$`, `$2x - y - z$`, `$-y - z$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Thực hiện phá ngoặc tròn trước: $P = x - [y - z + x]$.`,
                            `Sau đó phá ngoặc vuông có dấu trừ phía trước.`
                        ];
                        solutionHtml = `Phá ngoặc tròn bên trong: $P = x - [y - z + x]$.<br>Phá ngoặc vuông bên ngoài: $P = x - y + z - x$.<br>Nhóm các số hạng giống nhau: $P = (x - x) - y + z = -y + z$.`;
                    } else {
                        const a = 125;
                        const b = 37;
                        const c = 25;
                        const d = 50;
                        questionText = `Tính nhanh giá trị biểu thức: $A = (${a} - ${b}) - (${c} - ${b} - ${d})$`;
                        const correctVal = a - c + d;
                        options = [`$${correctVal}$`, `$100$`, `$50$`, `$${a - b - c + b - d}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Bỏ ngoặc: $A = ${a} - ${b} - ${c} + ${b} + ${d}$.`,
                            `Nhóm các số hạng: $(${a} - ${c}) + (${b} - ${b}) + ${d}$.`
                        ];
                        solutionHtml = `Ta bỏ ngoặc của biểu thức:<br>$A = ${a} - ${b} - ${c} + ${b} + ${d}$<br>$A = (${a} - ${c}) + (-${b} + ${b}) + ${d}$<br>$A = ${a - c} + 0 + ${d} = ${correctVal}$.`;
                    }
                    tip = "Nhóm các số hạng đối nhau hoặc các số tạo thành số tròn chục, tròn trăm để tính nhanh.";
                } else { // kho
                    if (variant === 1) {
                        const a = this.randomInt(12, 18);
                        const b = this.randomInt(20, 30);
                        const sum = a + b;
                        const xVal = sum % 2 === 0 ? sum / 2 : (sum + 1) / 2;
                        const realB = 2 * xVal - a;
                        questionText = `Tìm số nguyên $x$, biết: $x - (${a} - x) = ${realB}$`;
                        options = [`$x = ${xVal}$`, `$x = ${xVal - a}$`, `$x = ${realB - a}$`, `$x = 0$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$x = ${xVal}$`);
                        hints = [
                            `Bỏ dấu ngoặc có dấu trừ đằng trước ở vế trái: $x - ${a} + x = ${realB}$.`,
                            `Rút gọn: $2x - ${a} = ${realB}$.`
                        ];
                        solutionHtml = `Ta biến đổi vế trái: $x - ${a} + x = ${realB} \\rightarrow 2x - ${a} = ${realB} \\rightarrow 2x = ${realB} + ${a} = ${2 * xVal} \\rightarrow x = ${xVal}$.`;
                    } else if (variant === 2) {
                        const a = this.randomInt(15, 25);
                        const b = this.randomInt(5, 10);
                        const c = this.randomInt(2, 6);
                        const d = this.randomInt(10, 15);
                        const xVal = b - a + d + c;
                        questionText = `Tìm số nguyên $x$, biết: $${a} - [${b} - (x - ${c})] = ${d}$.`;
                        options = [`$x = ${xVal}$`, `$x = ${xVal + 2}$`, `$x = ${xVal - 4}$`, `$x = 0$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$x = ${xVal}$`);
                        hints = [
                            `Coi cả ngoặc vuông $[${b} - (x - ${c})]$ là số trừ: $[${b} - (x - ${c})] = ${a} - ${d}$.`,
                            `Tiếp tục coi $(x - ${c})$ là số trừ ở bước tiếp theo để tìm $x$.`
                        ];
                        solutionHtml = `Ta có: $${a} - [${b} - (x - ${c})] = ${d}$<br>$\\rightarrow [${b} - (x - ${c})] = ${a} - ${d} = ${a - d}$<br>$\\rightarrow x - ${c} = ${b} - (${a - d}) = ${b - a + d}$<br>$\\rightarrow x = ${b - a + d} + ${c} = ${xVal}$.`;
                    } else {
                        const a = this.randomInt(5, 10);
                        const b = this.randomInt(10, 16);
                        const sum = a + b;
                        const realB = sum % 2 === 0 ? b : b + 1;
                        const xAbs = (a + realB) / 2;
                        questionText = `Tìm tất cả các số nguyên $x$, biết: $|x| - (${a} - |x|) = ${realB}$.`;
                        const correctStr = `$x \\in \\{${xAbs};\\space -${xAbs}\\}$`;
                        options = [
                            correctStr,
                            `$x = ${xAbs}$`,
                            `$x = -${xAbs}$`,
                            `$x \\in \\{${xAbs - a};\\space ${a - xAbs}\\}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Bỏ ngoặc ở vế trái: $|x| - ${a} + |x| = ${realB}$.`,
                            `Rút gọn vế trái thành $2|x| - ${a} = ${realB}$ để tìm $|x|$, từ đó suy ra $x$.`
                        ];
                        solutionHtml = `Ta có: $|x| - (${a} - |x|) = ${realB}$<br>$\\rightarrow |x| - ${a} + |x| = ${realB}$<br>$\\rightarrow 2|x| - ${a} = ${realB}$<br>$\\rightarrow 2|x| = ${realB} + ${a} = ${realB + a}$<br>$\\rightarrow |x| = ${xAbs}$.<br>Vì $x$ là số nguyên nên $x = ${xAbs}$ hoặc $x = -${xAbs}$.<br>Vậy $x \\in \\{${xAbs};\\space -${xAbs}\\}$.`;
                    }
                    tip = "Nhớ đổi dấu của tất cả các hạng tử trong ngoặc khi phá ngoặc có dấu trừ đằng trước. Đối với phương trình chứa $|x|$, tìm $|x|$ trước rồi mới suy ra $x$.";
                }
                break;
            }
            case "nhan-so-nguyen": {
                const variant = this.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = this.randomInt(4, 9);
                        const b = this.randomInt(5, 8);
                        questionText = `Tính giá trị biểu thức: $P = ${a} \\cdot (-${b})$.`;
                        const correctVal = -a * b;
                        options = [`$${correctVal}$`, `$${Math.abs(correctVal)}$`, `$${correctVal - 1}$`, `$${a - b}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Đây là phép nhân hai số nguyên khác dấu. Kết quả luôn mang dấu âm.`,
                            `Tích của hai số nguyên khác dấu bằng số đối của tích các giá trị tuyệt đối: $a \\cdot (-b) = -(a \\cdot b)$.`
                        ];
                        solutionHtml = `Nhân hai số nguyên khác dấu ta được kết quả âm: $P = ${a} \\cdot (-${b}) = -(${a} \\cdot ${b}) = ${correctVal}$.`;
                    } else if (variant === 2) {
                        const a = this.randomInt(3, 7);
                        const b = this.randomInt(4, 8);
                        questionText = `Tính giá trị biểu thức: $Q = (-${a}) \\cdot (-${b})$.`;
                        const correctVal = a * b;
                        options = [`$${correctVal}$`, `$${-correctVal}$`, `$${correctVal + 2}$`, `$${-a - b}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Đây là phép nhân hai số nguyên cùng dấu âm. Kết quả luôn mang dấu dương.`,
                            `Quy tắc: $(-a) \\cdot (-b) = a \\cdot b$.`
                        ];
                        solutionHtml = `Nhân hai số nguyên cùng dấu âm ta được kết quả dương: $Q = (-${a}) \\cdot (-${b}) = ${a} \\cdot ${b} = ${correctVal}$.`;
                    } else {
                        const a = this.randomInt(2, 4);
                        const exp = this.randomInt(2, 3);
                        questionText = `Tính giá trị của lũy thừa sau: $A = (-${a})^{${exp}}$.`;
                        const correctVal = Math.pow(-a, exp);
                        // Khi exp chẵn, correctVal > 0 nên Math.abs(correctVal) === correctVal → trùng. Dùng -correctVal - 1 thay thế.
                        const w2NhanSoNguyen = (exp % 2 === 0) ? (-correctVal - 1) : Math.abs(correctVal);
                        options = [`$${correctVal}$`, `$${w2NhanSoNguyen}$`, `$${-a * exp}$`, `$${Math.pow(a, exp) + 1}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Lũy thừa bậc $n$ của một số là tích của $n$ thừa số đó.`,
                            `$(-${a})^{${exp}} = ${new Array(exp).fill(`(-${a})`).join(' \\cdot ')}$`,
                            `Lũy thừa với số mũ chẵn của số âm là số dương; lũy thừa với số mũ lẻ của số âm là số âm.`
                        ];
                        solutionHtml = `Ta có $A = (-${a})^{${exp}} = ${new Array(exp).fill(`(-${a})`).join(' \\cdot ')} = ${correctVal}$.<br>(Do số mũ $${exp}$ là số ${exp % 2 === 0 ? 'chẵn' : 'lẻ'} nên kết quả mang dấu ${exp % 2 === 0 ? 'dương' : 'âm'}).`;
                    }
                    tip = "Nhân hai số cùng dấu ra kết quả dương. Nhân hai số khác dấu ra kết quả âm. Lũy thừa số mũ chẵn luôn ra số dương.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const a = this.randomInt(-15, -8);
                        const b = this.randomInt(12, 18);
                        const c = 100 - b;
                        questionText = `Tính nhanh giá trị biểu thức: $Q = ${a} \\cdot ${b} + ${a} \\cdot ${c}$`;
                        const correctVal = a * 100;
                        options = [`$${correctVal}$`, `$${a * (b - c)}$`, `$${Math.abs(correctVal)}$`, `$0$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Áp dụng tính chất phân phối của phép nhân đối với phép cộng: $x \\cdot y + x \\cdot z = x \\cdot (y + z)$.`,
                            `Đặt thừa số chung $${a}$ ra ngoài ngoặc.`
                        ];
                        solutionHtml = `Áp dụng tính chất phân phối: $Q = ${a} \\cdot (${b} + ${c}) = ${a} \\cdot 100 = ${correctVal}$.`;
                    } else if (variant === 2) {
                        const a = this.randomInt(-18, -12);
                        const b = this.randomInt(120, 130);
                        const c = b - 100;
                        questionText = `Tính nhanh giá trị biểu thức: $M = ${a} \\cdot ${b} - ${a} \\cdot ${c}$`;
                        const correctVal = a * 100;
                        options = [`$${correctVal}$`, `$${a * (b + c)}$`, `$${Math.abs(correctVal)}$`, `$100$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Áp dụng tính chất phân phối của phép nhân đối với phép trừ: $x \\cdot y - x \\cdot z = x \\cdot (y - z)$.`,
                            `Thừa số chung là $${a}$. Số trong ngoặc là $${b} - ${c} = 100$.`
                        ];
                        solutionHtml = `Đặt thừa số chung $${a}$ ra ngoài: $M = ${a} \\cdot (${b} - ${c}) = ${a} \\cdot 100 = ${correctVal}$.`;
                    } else {
                        const a = this.randomInt(2, 4);
                        const b = this.randomInt(3, 5);
                        const c = this.randomInt(2, 4);
                        questionText = `Tính giá trị biểu thức sau: $A = (-${a})^2 \\cdot (-${b}) - ${c} \\cdot (-5)$.`;
                        const correctVal = Math.pow(-a, 2) * (-b) - c * (-5);
                        options = [`$${correctVal}$`, `$${correctVal - 10}$`, `$${-correctVal}$`, `$0$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Thực hiện phép tính lũy thừa trước: $(-${a})^2 = ${a*a}$.`,
                            `Thực hiện các phép nhân: $${a*a} \\cdot (-${b}) = ${-a*a*b}$ và $${c} \\cdot (-5) = -${5*c}$.`,
                            `Thực hiện phép trừ cuối cùng: kết quả thứ nhất trừ đi kết quả thứ hai.`
                        ];
                        solutionHtml = `Ta tính từng phần của biểu thức:<br>1) $(-${a})^2 = ${a*a}$.<br>2) $A = ${a*a} \\cdot (-${b}) - [${c} \\cdot (-5)] = ${-a*a*b} - (-${5*c}) = ${-a*a*b} + ${5*c} = ${correctVal}$.`;
                    }
                    tip = "Đưa thừa số chung (có thể là số âm) ra ngoài ngoặc. Chú ý thứ tự thực hiện phép tính: Lũy thừa -> Nhân chia -> Cộng trừ.";
                } else { // kho
                    if (variant === 1) {
                        const list = [
                            {a: 1, b: 2, p: 3},
                            {a: 2, b: 1, p: 5},
                            {a: 1, b: 3, p: 2}
                        ];
                        const choice = list[this.randomInt(0, list.length - 1)];
                        const a = choice.a;
                        const b = choice.b;
                        const p = choice.p;
                        questionText = `Tìm tất cả các cặp số nguyên $(x, y)$ thỏa mãn đẳng thức: $(x - ${a})(y + ${b}) = ${p}$.`;
                        
                        const pair1 = `(${a+1}; ${p-b})`;
                        const pair2 = `(${a-1}; ${-p-b})`;
                        const pair3 = `(${a+p}; ${1-b})`;
                        const pair4 = `(${a-p}; ${-1-b})`;
                        const correctStr = `$${pair1}, ${pair2}, ${pair3}, ${pair4}$`;
                        
                        options = [
                            correctStr,
                            `$(${a+1}; ${p-b}), (${a-1}; ${-p-b})$`,
                            `$(${a+p}; ${1-b}), (${a-p}; ${-1-b})$`,
                            `$(${a}; ${p}), (-${a}; -${p})$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Vì $x, y$ là số nguyên nên $x - ${a}$ và $y + ${b}$ phải là các ước số nguyên của $${p}$.`,
                            `Ước nguyên của số nguyên tố $${p}$ là: $\\{1; -1; ${p}; -${p}\\}$. Lập bảng xét 4 trường hợp.`
                        ];
                        solutionHtml = `Vì $x, y \\in \\mathbb{Z} \\rightarrow (x - ${a})$ và $(y + ${b})$ là các ước nguyên của $${p}$.<br>Ta có tập ước: $\\text{Ư}(${p}) = \\{1; -1; ${p}; -${p}\\}$.<br>Ta lập bảng giá trị:<br>1) $x - ${a} = 1, y + ${b} = ${p} \\rightarrow x = ${a+1}, y = ${p-b}$.<br>2) $x - ${a} = -1, y + ${b} = -${p} \\rightarrow x = ${a-1}, y = ${-p-b}$.<br>3) $x - ${a} = ${p}, y + ${b} = 1 \\rightarrow x = ${a+p}, y = ${1-b}$.<br>4) $x - ${a} = -${p}, y + ${b} = -1 \\rightarrow x = ${a-p}, y = ${-1-b}$.<br>Vậy các cặp $(x; y)$ thỏa mãn là: $${pair1}, ${pair2}, ${pair3}, ${pair4}$.`;
                    } else if (variant === 2) {
                        const a = [4, 9, 16][this.randomInt(0, 2)];
                        const b = this.randomInt(2, 5);
                        const r1 = Math.sqrt(a);
                        const r2 = -r1;
                        const r3 = -b;
                        const correctStr = `$x \\in \\{${r3};\\space ${r2};\\space ${r1}\\}$`;
                        questionText = `Tìm tập hợp tất cả các số nguyên $x$, biết: $(x^2 - ${a})(x + ${b}) = 0$.`;
                        options = [
                            correctStr,
                            `$x \\in \\{${r2};\\space ${r1}\\}$`,
                            `$x \\in \\{${r3};\\space ${r1}\\}$`,
                            `$x = ${r1}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Một tích bằng 0 khi ít nhất một trong các thừa số bằng 0.`,
                            `Xét hai trường hợp: $x^2 - ${a} = 0$ hoặc $x + ${b} = 0$.`,
                            `Chú ý số nguyên thỏa mãn $x^2 = ${a}$ có hai giá trị đối nhau.`
                        ];
                        solutionHtml = `Ta có: $(x^2 - ${a})(x + ${b}) = 0$.<br>Trường hợp 1: $x^2 - ${a} = 0 \\rightarrow x^2 = ${a} \\rightarrow x = ${r1}$ hoặc $x = ${r2}$ (cả hai đều là số nguyên).<br>Trường hợp 2: $x + ${b} = 0 \\rightarrow x = ${r3}$ (là số nguyên).<br>Vậy tập hợp các giá trị $x$ thỏa mãn là: $x \\in \\{${correctStr.replace('$','')}\\}$.`;
                    } else {
                        const n = this.randomInt(40, 60);
                        const a = this.randomInt(120, 150);
                        const m = this.randomInt(25, 35);
                        const b = this.randomInt(15, 25);
                        const c = this.randomInt(5, 10);
                        const correctVal = m * b - (n - m) * c;
                        questionText = `Một cửa hàng nhập khẩu $${n}\\text{ chiếc áo}$ với cùng một giá vốn. Cửa hàng bán $${m}\\text{ chiếc}$ đầu tiên với mức lợi nhuận mỗi chiếc là $+${b}\\text{ nghìn đồng}$. Để thanh lý nốt số áo còn lại nhanh chóng, cửa hàng bán lỗ mỗi chiếc là $-${c}\\text{ nghìn đồng}$. Hỏi sau khi bán hết toàn bộ số áo trên, cửa hàng lời hay lỗ bao nhiêu? (Dùng số nguyên để biểu thị).`;
                        const correctStr = `$${correctVal >= 0 ? `+${correctVal}` : `${correctVal}`}\\text{ nghìn đồng}$`;
                        options = [
                            correctStr,
                            `$${correctVal - 100}\\text{ nghìn đồng}$`,
                            `$${-correctVal}\\text{ nghìn đồng}$`,
                            `$${m*b + (n-m)*c}\\text{ nghìn đồng}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Tính số áo bị bán lỗ: $${n} - ${m} = ${n-m}\\text{ chiếc}$.`,
                            `Tính số tiền lời từ những chiếc áo bán đầu tiên: $${m} \\cdot (+${b})\\text{ nghìn đồng}$.`,
                            `Tính số tiền lỗ từ những chiếc áo bán thanh lý: $(${n-m}) \\cdot (-${c})\\text{ nghìn đồng}$.`,
                            `Cộng hai kết quả lại để tìm tổng số tiền.`
                        ];
                        solutionHtml = `Số áo bán lỗ là: $${n} - ${m} = ${n-m}\\text{ chiếc}$.<br>Số tiền lời thu được từ số áo đầu tiên: $${m} \\cdot ${b} = ${m*b}\\text{ nghìn đồng}$.<br>Số tiền lỗ từ số áo bán thanh lý: $${n-m} \\cdot (-${c}) = -${(n-m)*c}\\text{ nghìn đồng}$.<br>Tổng số tiền lời (hoặc lỗ) thu được là:<br>$${m*b} + (-${(n-m)*c}) = ${correctVal}\\text{ nghìn đồng}$.<br>Vì kết quả mang dấu ${correctVal >= 0 ? 'dương nên cửa hàng lời' : 'âm nên cửa hàng lỗ'} $${Math.abs(correctVal)}\\text{ nghìn đồng}$.`;
                    }
                    tip = "Sử dụng số nguyên dương để biểu diễn số tiền lời và số nguyên âm để biểu diễn số tiền lỗ trong tính toán kinh tế thực tế.";
                }
                break;
            }
            case "chia-het-uoc-boi-so-nguyen": {
                const variant = this.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const n = [4, 6, 9][this.randomInt(0, 2)];
                        questionText = `Số nào dưới đây **không** thuộc tập hợp các ước của $${n}$ trong tập số nguyên $\\mathbb{Z}$?`;
                        let wrongVal = 5;
                        options = [`$${wrongVal}$`, `$1$`, `$-1$`, `$${n}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${wrongVal}$`);
                        hints = [
                            `Ước số nguyên của $${n}$ là các số nguyên mà $${n}$ chia hết.`,
                            `Kiểm tra xem $${n}$ không chia hết cho số nào.`
                        ];
                        solutionHtml = `Vì $${n}$ không chia hết cho $5$, nên $5$ không phải là ước của $${n}$. Các số còn lại đều là ước nguyên.`;
                    } else if (variant === 2) {
                        const n = [6, 8, 10][this.randomInt(0, 2)];
                        const correctArr = [];
                        for(let i = 1; i <= n; i++) {
                            if (n % i === 0) {
                                correctArr.push(i);
                                correctArr.push(-i);
                            }
                        }
                        correctArr.sort((a,b)=>a-b);
                        const correctStr = `$\\{${correctArr.join(';\\space ')}\\}$`;
                        questionText = `Viết tập hợp các ước số nguyên của số $-${n}$.`;
                        options = [
                            correctStr,
                            `$\\{${correctArr.filter(x=>x>0).join(';\\space ')}\\}$`,
                            `$\\{${correctArr.filter(x=>x<0).join(';\\space ')}\\}$`,
                            `$\\{0;\\space ${correctArr.join(';\\space ')}\\}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Ước của số nguyên âm $-${n}$ cũng chính là ước của số tự nhiên $${n}$.`,
                            `Ước nguyên bao gồm cả các ước số dương và các ước số âm đối xứng.`
                        ];
                        solutionHtml = `Ước của số nguyên $-${n}$ gồm các số nguyên mà $-${n}$ chia hết. Các ước đó là: $\\{${correctArr.join(';\\space ')}\\}$.`;
                    } else {
                        const a = this.randomInt(3, 5);
                        const b = a * this.randomInt(3, 5);
                        questionText = `Tìm tất cả các bội số nguyên của $${a}$ mà lớn hơn $-${b}$ và nhỏ hơn hoặc bằng $${b}$.`;
                        const correctArr = [];
                        for(let i = -b + 1; i <= b; i++) {
                            if (i % a === 0) correctArr.push(i);
                        }
                        const correctStr = `$\\{${correctArr.join(';\\space ')}\\}$`;
                        options = [
                            correctStr,
                            `$\\{${correctArr.filter(x=>x!==0).join(';\\space ')}\\}$`,
                            `$\\{${correctArr.filter(x=>x>0).join(';\\space ')}\\}$`,
                            `$\\{-${b};\\space ${correctArr.join(';\\space ')}\\}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Bội của $${a}$ là các số có dạng $${a}k$ với $k \\in \\mathbb{Z}$.`,
                            `Tìm các số chia hết cho $${a}$ nằm trong khoảng từ $-${b} + 1$ đến $${b}$.`
                        ];
                        solutionHtml = `Các bội nguyên của $${a}$ thỏa mãn điều kiện lớn hơn $-${b}$ và bé hơn hoặc bằng $${b}$ là: $\\{${correctArr.join(';\\space ')}\\}$.`;
                    }
                    tip = "Ước số nguyên bao gồm cả số dương và số đối của chúng (số âm). Đừng quên số 0 là bội của mọi số nguyên khác 0.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const a = this.randomInt(2, 4);
                        const limit = 15;
                        questionText = `Tìm tập hợp tất cả các bội số nguyên $x$ của $${a}$ thỏa mãn điều kiện: $-${limit} < x < ${limit}$.`;
                        const correctArr = [];
                        for(let i = -limit + 1; i < limit; i++) {
                            if (i % a === 0) correctArr.push(i);
                        }
                        const correctStr = `$\\{${correctArr.join(';\\space ')}\\}$`;
                        options = [
                            correctStr,
                            `$\\{${correctArr.filter(x=>x>0).join(';\\space ')}\\}$`,
                            `$\\{${correctArr.concat([limit]).join(';\\space ')}\\}$`,
                            `$\\{${correctArr.filter(x=>x!==0).join(';\\space ')}\\}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Tìm các bội của $${a}$ (bao gồm cả bội dương, bội âm và số 0).`,
                            `Chỉ chọn các số lớn hơn $-${limit}$ và nhỏ hơn $${limit}$.`
                        ];
                        solutionHtml = `Bội nguyên của $${a}$ nằm trong khoảng từ $-${limit}$ đến $${limit}$ là các số chia hết cho $${a}$: $\\{${correctArr.join(';\\space ')}\\}$.`;
                    } else if (variant === 2) {
                        const a = this.randomInt(1, 3);
                        const b = [4, 6][this.randomInt(0, 1)];
                        questionText = `Tìm tập hợp các số nguyên $x$ để biểu thức $(x - ${a})$ là ước của $${b}$.`;
                        const divs = [];
                        for(let i=1; i<=b; i++) { if(b%i===0) { divs.push(i); divs.push(-i); } }
                        const correctArr = divs.map(d => a + d).sort((x,y)=>x-y);
                        const correctStr = `$x \\in \\{${correctArr.join(';\\space ')}\\}$`;
                        options = [
                            correctStr,
                            `$x \\in \\{${divs.sort((x,y)=>x-y).join(';\\space ')}\\}$`,
                            `$x \\in \\{${correctArr.filter(x=>x>0).join(';\\space ')}\\}$`,
                            `$x \\in \\{0;\\space ${correctArr.join(';\\space ')}\\}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Ước nguyên của $${b}$ gồm: $\\{${divs.sort((x,y)=>x-y).join(';\\space ')}\\}$.`,
                            `Cho $x - ${a}$ lần lượt nhận các giá trị ước này để tìm $x$.`
                        ];
                        solutionHtml = `Ta có $x - ${a}$ là ước của $${b} \\rightarrow x - ${a} \\in \\{${divs.sort((x,y)=>x-y).join(';\\space ')}\\}$.<br>Do đó ta cộng thêm $${a}$ vào mỗi ước để tìm $x$: $x \\in \\{${correctArr.join(';\\space ')}\\}$.`;
                    } else {
                        const correctVal = -6;
                        questionText = `Tìm số nguyên $x$ biết rằng $x$ vừa là ước của $-12$ vừa là bội của $3$, đồng thời $x < 0$ và $x \\neq -3$.`;
                        options = [`$-6$`, `$-12$`, `$-3$`, `$-9$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$-6$`);
                        hints = [
                            `Ước nguyên âm của $-12$ là: $\\{-1;\\space -2;\\space -3;\\space -4;\\space -6;\\space -12\\}$.`,
                            `Trong số đó, tìm các số chia hết cho 3.`,
                            `Loại đi số $-3$ và chọn kết quả phù hợp nhất.`
                        ];
                        solutionHtml = `Tập các ước nguyên của $-12$ là: $\\{\\pm 1;\\space \\pm 2;\\space \\pm 3;\\space \\pm 4;\\space \\pm 6;\\space \\pm 12\\}$.<br>Các ước nguyên âm là: $\\{-1;\\space -2;\\space -3;\\space -4;\\space -6;\\space -12\\}$.<br>Trong đó, các số chia hết cho $3$ (bội của 3) là: $\\{-3;\\space -6;\\space -12\\}$.<br>Vì $x \\neq -3$ nên $x \\in \\{-6;\\space -12\\}$. Khớp với phương án có chứa $-6$.`;
                    }
                    tip = "Bội của số nguyên a lớn hơn b và nhỏ hơn c được xác định bằng cách nhân a với các số nguyên k sao cho kết quả nằm trong khoảng (b, c).";
                } else { // kho
                    if (variant === 1) {
                        const a = this.randomInt(2, 4);
                        const p = [5, 7][this.randomInt(0, 1)];
                        questionText = `Có bao nhiêu số nguyên $n$ để biểu thức $(n - ${a})$ là ước của số nguyên $${p}$?`;
                        options = [`$4$`, `$2$`, `$8$`, `$0$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$4$`);
                        hints = [
                            `Để $n-${a}$ là ước của $${p}$, thì $n-${a}$ phải nhận các giá trị thuộc tập ước nguyên của $${p}$.`,
                            `Ước nguyên của số nguyên tố $${p}$ là: $\\{1;\\space -1;\\space ${p};\\space -${p}\\}$.`
                        ];
                        solutionHtml = `Để $n-${a}$ là ước của $${p} \\rightarrow n-${a} \\in \\{1;\\space -1;\\space ${p};\\space -${p}\\}$.<br>Giải ra ta được: $n \\in \\{${a+1};\\space ${a-1};\\space ${a+p};\\space ${a-p}\\}$. Tất cả đều là số nguyên. Vậy có $4$ giá trị của $n$.`;
                    } else if (variant === 2) {
                        const a = this.randomInt(1, 3);
                        const uVal = 2 * a + 3;
                        const divs = [];
                        for(let i=1; i<=uVal; i++) { if(uVal%i===0) { divs.push(i); divs.push(-i); } }
                        const correctArr = divs.map(d => a + d).sort((x,y)=>x-y);
                        const correctStr = `$x \\in \\{${correctArr.join(';\\space ')}\\}$`;
                        questionText = `Tìm tập hợp tất cả các số nguyên $x$ để biểu thức phân số $A = \\frac{2x + 3}{x - ${a}}$ nhận giá trị nguyên.`;
                        options = [
                            correctStr,
                            `$x \\in \\{${divs.sort((x,y)=>x-y).join(';\\space ')}\\}$`,
                            `$x \\in \\{${correctArr.filter(x=>x>0).join(';\\space ')}\\}$`,
                            `$x \\in \\{${a};\\space ${correctArr.join(';\\space ')}\\}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Tách tử số theo mẫu số: $2x + 3 = 2(x - ${a}) + ${uVal}$.`,
                            `Rút gọn: $A = 2 + \\frac{${uVal}}{x - ${a}}$.`,
                            `Để $A$ nguyên thì $x - ${a}$ phải là ước nguyên của $${uVal}$.`
                        ];
                        solutionHtml = `Ta biến đổi biểu thức:<br>$A = \\frac{2x + 3}{x - ${a}} = \\frac{2(x - ${a}) + 2 \\cdot ${a} + 3}{x - ${a}} = 2 + \\frac{${uVal}}{x - ${a}}$.<br>Để $A$ nhận giá trị nguyên thì $x - ${a}$ là ước của $${uVal}$.<br>Các ước nguyên của $${uVal}$ là: $\\{${divs.sort((x,y)=>x-y).join(';\\space ')}\\}$.<br>Giải ra ta được: $x \\in \\{${correctArr.join(';\\space ')}\\}$.`;
                    } else {
                        questionText = `Tìm tất cả các số nguyên $x$ sao cho $x^2 - 1$ là ước của số nguyên $3$.`;
                        const correctStr = `$x \\in \\{-2;\\space 0;\\space 2\\}$`;
                        options = [
                            correctStr,
                            `$x \\in \\{-2;\\space 2\\}$`,
                            `$x \\in \\{-2;\\space 0;\\space 1;\\space 2\\}$`,
                            `$x \\in \\{-3;\\space -1;\\space 1;\\space 3\\}$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Ước nguyên của $3$ là: $\\{1;\\space -1;\\space 3;\\space -3\\}$.`,
                            `Xét các trường hợp $x^2 - 1 = d$ với $d$ là các ước trên để tìm $x^2$.`,
                            `Chọn các giá trị $x^2 \\ge 0$ là số chính phương để suy ra số nguyên $x$.`
                        ];
                        solutionHtml = `Ta có $x^2 - 1$ là ước của $3 \\rightarrow x^2 - 1 \\in \\{-3;\\space -1;\\space 1;\\space 3\\}$.<br>Ta xét các trường hợp:<br>1) $x^2 - 1 = -3 \\rightarrow x^2 = -2$ (loại vì không có số thực nào có bình phương âm).<br>2) $x^2 - 1 = -1 \\rightarrow x^2 = 0 \\rightarrow x = 0$.<br>3) $x^2 - 1 = 1 \\rightarrow x^2 = 2$ (loại vì 2 không phải là số chính phương của số nguyên nào).<br>4) $x^2 - 1 = 3 \\rightarrow x^2 = 4 \\rightarrow x = 2$ hoặc $x = -2$.<br>Vậy các giá trị nguyên của $x$ là: $x \\in \\{-2;\\space 0;\\space 2\\}$.`;
                    }
                    tip = "Khi tìm ước của biểu thức chứa bình phương, cần loại bỏ các giá trị không dẫn đến bình phương của một số nguyên.";
                }
                break;
            }
            case "hinh-hoc-chuong-4": {
                const variant = this.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        questionText = `Đặc điểm hình học nào dưới đây thuộc về **tam giác đều**?`;
                        options = [
                            `Có 3 cạnh bằng nhau và 3 góc bằng nhau.`,
                            `Có 3 cạnh bằng nhau và 1 góc vuông.`,
                            `Có 2 cạnh bằng nhau và 2 góc kề đáy bằng nhau.`,
                            `Có 3 cạnh khác nhau và 3 góc bằng nhau.`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`Có 3 cạnh bằng nhau và 3 góc bằng nhau.`);
                        hints = [
                            `Đọc kỹ định nghĩa về sự đều đặn của tam giác đều.`,
                            `Mỗi góc của tam giác đều bằng $60^\\circ$.`
                        ];
                        solutionHtml = `Tam giác đều là tam giác có 3 cạnh bằng nhau và 3 góc bằng nhau (mỗi góc đều bằng $60^\\circ$).`;
                    } else if (variant === 2) {
                        questionText = `Khẳng định nào sau đây **sai** khi nói về đặc điểm hình học của **hình vuông**?`;
                        const correctStr = `Có hai đường chéo vuông góc nhưng không bằng nhau.`;
                        options = [
                            correctStr,
                            `Có 4 cạnh bằng nhau.`,
                            `Có 4 góc vuông bằng nhau.`,
                            `Có hai đường chéo bằng nhau và vuông góc tại trung điểm của mỗi đường.`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Hãy suy nghĩ về tính chất đối xứng hoàn hảo của hình vuông.`,
                            `Hai đường chéo của hình vuông có bằng nhau không?`
                        ];
                        solutionHtml = `Hình vuông là hình có 4 cạnh bằng nhau, 4 góc vuông. Hai đường chéo của hình vuông vừa bằng nhau, vừa vuông góc với nhau tại trung điểm của mỗi đường. Do đó, khẳng định "hai đường chéo vuông góc nhưng không bằng nhau" là **sai**.`;
                    } else {
                        questionText = `Hình **lục giác đều** có đặc điểm hình học nào sau đây?`;
                        const correctStr = `Có 6 cạnh bằng nhau, 6 góc bằng nhau và 3 đường chéo chính bằng nhau.`;
                        options = [
                            correctStr,
                            `Có 6 cạnh bằng nhau, 6 góc bằng nhau và 6 đường chéo chính bằng nhau.`,
                            `Có 6 cạnh bằng nhau, có 3 góc vuông và 3 góc nhọn.`,
                            `Có 6 cạnh bằng nhau và không có đường chéo nào.`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Hình lục giác đều có 6 đỉnh.`,
                            `Xét các đường chéo đi qua tâm (đường chéo chính). Có 3 đường chéo chính nối các đỉnh đối diện.`
                        ];
                        solutionHtml = `Lục giác đều có 6 cạnh bằng nhau, 6 góc bằng nhau. Ngoài ra nó còn có 3 đường chéo chính bằng nhau nối các đỉnh đối diện qua tâm hình.`;
                    }
                    tip = "Đều có nghĩa là tất cả các cạnh bằng nhau và tất cả các góc bằng nhau.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const p = this.randomInt(4, 10) * 3;
                        questionText = `Một hình tam giác đều có chu vi bằng $${p}\\text{ cm}$. Độ dài mỗi cạnh của hình tam giác đều đó là bao nhiêu?`;
                        const correctVal = p / 3;
                        options = [`$${correctVal}\\text{ cm}$`, `$${correctVal * 2}\\text{ cm}$`, `$${correctVal - 1}\\text{ cm}$`, `$3\\text{ cm}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}\\text{ cm}$`);
                        hints = [
                            `Chu vi tam giác đều bằng tổng độ dài 3 cạnh.`,
                            `Vì 3 cạnh bằng nhau nên độ dài 1 cạnh bằng Chu vi chia cho 3.`
                        ];
                        solutionHtml = `Cạnh của tam giác đều là: $${p} : 3 = ${correctVal}\\text{ cm}$.`;
                    } else if (variant === 2) {
                        const s = [16, 25, 36, 64][this.randomInt(0, 3)];
                        const edge = Math.sqrt(s);
                        const p = 4 * edge;
                        questionText = `Một miếng bìa hình vuông có diện tích bằng $${s}\\text{ cm}^2$. Chu vi của miếng bìa hình vuông đó là bao nhiêu?`;
                        options = [`$${p}\\text{ cm}$`, `$${edge}\\text{ cm}$`, `$${s * 2}\\text{ cm}$`, `$${p + 4}\\text{ cm}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${p}\\text{ cm}$`);
                        hints = [
                            `Tính độ dài cạnh hình vuông từ diện tích: $cạnh = \\sqrt{diện\\_tích}$.`,
                            `Tính chu vi hình vuông từ độ dài cạnh vừa tìm được: $Chu\\_vi = 4 \\cdot cạnh$.`
                        ];
                        solutionHtml = `Ta có diện tích hình vuông là $S = cạnh \\cdot cạnh = ${s}\\text{ cm}^2 \\rightarrow cạnh = ${edge}\\text{ cm}$.<br>Chu vi của hình vuông là: $C = 4 \\cdot cạnh = 4 \\cdot ${edge} = ${p}\\text{ cm}$.`;
                    } else {
                        const edge = this.randomInt(4, 10);
                        const p = 6 * edge;
                        questionText = `Một hình lục giác đều có độ dài cạnh bằng $${edge}\\text{ cm}$. Chu vi của hình lục giác đều đó là bao nhiêu?`;
                        options = [`$${p}\\text{ cm}$`, `$${edge * 3}\\text{ cm}$`, `$${edge * 4}\\text{ cm}$`, `$${edge * 5}\\text{ cm}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${p}\\text{ cm}$`);
                        hints = [
                            `Lục giác đều là đa giác đều có 6 cạnh.`,
                            `Chu vi hình lục giác đều bằng độ dài một cạnh nhân với 6.`
                        ];
                        solutionHtml = `Chu vi của hình lục giác đều cạnh $a = ${edge}\\text{ cm}$ là: $C = 6 \\cdot a = 6 \\cdot ${edge} = ${p}\\text{ cm}$.`;
                    }
                    tip = "Chu vi của một đa giác đều bằng độ dài một cạnh nhân với số cạnh của đa giác đó.";
                } else { // kho
                    if (variant === 1) {
                        questionText = `Hình lục giác đều có tổng cộng bao nhiêu đường chéo (bao gồm cả đường chéo chính và đường chéo phụ)?`;
                        options = [`$9$ đường chéo`, `$3$ đường chéo`, `$6$ đường chéo`, `$12$ đường chéo`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$9$ đường chéo`);
                        hints = [
                            `Lục giác đều có 6 đỉnh. Nối các đỉnh không kề nhau ta được các đường chéo.`,
                            `Đường chéo chính đi qua tâm (có 3 đường). Đường chéo phụ không đi qua tâm (có 6 đường).`
                        ];
                        solutionHtml = `Lục giác đều có 3 đường chéo chính nối các đỉnh đối diện và 6 đường chéo phụ nối các đỉnh cách nhau một đỉnh. Tổng số đường chéo là $3 + 6 = 9$ đường chéo.`;
                    } else if (variant === 2) {
                        const edge = this.randomInt(10, 20);
                        const p = 3 * edge;
                        questionText = `Một chiếc bàn hình lục giác đều được ghép khít từ 6 mặt bàn hình tam giác đều bằng nhau. Biết chu vi của một mặt bàn tam giác đều là $${p}\\text{ cm}$. Chu vi của mặt bàn hình lục giác đều lớn là bao nhiêu?`;
                        const correctVal = 6 * edge;
                        options = [`$${correctVal}\\text{ cm}$`, `$${p * 2}\\text{ cm}$`, `$${correctVal - edge}\\text{ cm}$`, `$${correctVal + edge}\\text{ cm}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}\\text{ cm}$`);
                        hints = [
                            `Tìm độ dài cạnh của mặt bàn tam giác đều: $cạnh = chu\\_vi : 3 = ${edge}\\text{ cm}$.`,
                            `Khi ghép 6 tam giác đều này quanh tâm, các cạnh ngoài của lục giác đều lớn chính là các cạnh của các tam giác đều này.`,
                            `Độ dài cạnh của bàn lục giác đều lớn bằng cạnh của tam giác đều. Tính chu vi lục giác đều.`
                        ];
                        solutionHtml = `Độ dài cạnh của hình tam giác đều là: $${p} : 3 = ${edge}\\text{ cm}$.<br>Khi ghép 6 hình tam giác đều có cạnh $${edge}\\text{ cm}$ lại với nhau quanh một điểm chung, ta được một hình lục giác đều có độ dài cạnh đúng bằng độ dài cạnh tam giác đều, tức là cạnh bằng $${edge}\\text{ cm}$.<br>Chu vi của mặt bàn lục giác đều lớn là: $C = 6 \\cdot ${edge} = ${correctVal}\\text{ cm}$.`;
                    } else {
                        questionText = `Nếu ta nối tất cả các đỉnh đối diện của một hình lục giác đều thông qua tâm của nó, hình lục giác đều đó sẽ được chia thành bao nhiêu hình tam giác đều bằng nhau?`;
                        options = [`$6$ hình`, `$3$ hình`, `$4$ hình`, `$12$ hình`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$6$ hình`);
                        hints = [
                            `Nối các đỉnh đối diện qua tâm của lục giác đều tức là ta vẽ 3 đường chéo chính.`,
                            `Hãy tưởng tượng 3 đường chéo chính này cắt nhau tại tâm và chia lục giác đều thành các miếng hình tam giác.`
                        ];
                        solutionHtml = `Vẽ 3 đường chéo chính đi qua tâm của lục giác đều. Chúng giao nhau tại tâm và chia hình lục giác đều thành đúng 6 hình tam giác đều bằng nhau có chung đỉnh tại tâm lục giác đều.`;
                    }
                    tip = "Phân biệt đường chéo chính (nối đỉnh đối diện qua tâm) và đường chéo phụ của lục giác đều.";
                }
                break;
            }
            case "hinh-hoc-2-chuong-4": {
                const variant = this.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        questionText = `Tính chất nổi bật về đường chéo của **hình thoi** là gì?`;
                        options = [
                            `Hai đường chéo vuông góc với nhau tại trung điểm của mỗi đường.`,
                            `Hai đường chéo bằng nhau và song song với nhau.`,
                            `Hai đường chéo song song và vuông góc với nhau.`,
                            `Hai đường chéo bằng nhau và vuông góc với nhau.`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`Hai đường chéo vuông góc với nhau tại trung điểm của mỗi đường.`);
                        hints = [
                            `Hình thoi có 4 cạnh bằng nhau.`,
                            `Hai đường chéo của nó không bằng nhau nhưng có tính chất hình học rất đặc biệt về góc.`
                        ];
                        solutionHtml = `Trong hình thoi, hai đường chéo vuông góc với nhau tại trung điểm của mỗi đường.`;
                    } else if (variant === 2) {
                        questionText = `Tính chất nào sau đây là của **hình chữ nhật**?`;
                        const correctStr = `Hai đường chéo bằng nhau và cắt nhau tại trung điểm của mỗi đường.`;
                        options = [
                            correctStr,
                            `Hai đường chéo vuông góc với nhau và bằng nhau.`,
                            `Có 4 cạnh bằng nhau và 4 góc vuông.`,
                            `Có hai cạnh bên bằng nhau và hai góc kề một đáy bằng nhau.`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Hình chữ nhật có 4 góc vuông.`,
                            `Hai đường chéo của nó bằng nhau.`
                        ];
                        solutionHtml = `Hình chữ nhật có hai đường chéo bằng nhau và cắt nhau tại trung điểm của mỗi đường. (Chú ý: hai đường chéo hình chữ nhật không vuông góc như hình thoi/hình vuông).`;
                    } else {
                        questionText = `Hình thang cân có tính chất nào dưới đây?`;
                        const correctStr = `Hai cạnh bên bằng nhau và hai đường chéo bằng nhau.`;
                        options = [
                            correctStr,
                            `Hai cạnh đáy bằng nhau và hai đường chéo bằng nhau.`,
                            `Hai đường chéo vuông góc với nhau tại trung điểm mỗi đường.`,
                            `Hai cạnh bên song song và bằng nhau.`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Hình thang cân có hai đáy song song nhưng độ dài thường khác nhau.`,
                            `Hai cạnh bên có độ dài thế nào so với nhau? Hai đường chéo thế nào?`
                        ];
                        solutionHtml = `Hình thang cân là hình thang có hai cạnh bên bằng nhau and hai đường chéo bằng nhau. (Hai cạnh bên không song song trừ khi đó là hình bình hành).`;
                    }
                    tip = "Đường chéo hình thoi vuông góc, đường chéo hình chữ nhật bằng nhau. Hình vuông hội tụ cả hai. Hình thang cân có hai cạnh bên bằng nhau.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const a = this.randomInt(4, 6);
                        const b = a + this.randomInt(3, 5);
                        const c = this.randomInt(4, 6);
                        questionText = `Cho hình thang cân $ABCD$ có đáy nhỏ $AB = ${a}\\text{ cm}$, đáy lớn $CD = ${b}\\text{ cm}$, cạnh bên $AD = ${c}\\text{ cm}$. Tính chu vi của hình thang cân này.`;
                        const correctVal = a + b + 2 * c;
                        options = [`$${correctVal}\\text{ cm}$`, `$${a + b + c}\\text{ cm}$`, `$${correctVal - c}\\text{ cm}$`, `$${a * 2 + b + c}\\text{ cm}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}\\text{ cm}$`);
                        hints = [
                            `Hình thang cân có hai cạnh bên bằng nhau, tức là $BC = AD = ${c}\\text{ cm}$.`,
                            `Chu vi hình thang bằng tổng độ dài 4 cạnh: $AB + CD + AD + BC$.`
                        ];
                        solutionHtml = `Vì $ABCD$ là hình thang cân nên hai cạnh bên bằng nhau: $BC = AD = ${c}\\text{ cm}$.<br>Chu vi của hình thang là: $C = AB + CD + AD + BC = ${a} + ${b} + ${c} + ${c} = ${correctVal}\\text{ cm}$.`;
                    } else if (variant === 2) {
                        const a = this.randomInt(5, 12);
                        const b = a + this.randomInt(3, 6);
                        const p = 2 * (a + b);
                        questionText = `Cho hình bình hành có độ dài hai cạnh kề lần lượt là $${a}\\text{ cm}$ và $${b}\\text{ cm}$. Chu vi của hình bình hành đó là bao nhiêu?`;
                        options = [`$${p}\\text{ cm}$`, `$${a + b}\\text{ cm}$`, `$${2 * a + b}\\text{ cm}$`, `$${p * 2}\\text{ cm}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${p}\\text{ cm}$`);
                        hints = [
                            `Hình bình hành có các cạnh đối bằng nhau.`,
                            `Chu vi hình bình hành tương tự như chu vi hình chữ nhật: $Chu\\_vi = 2 \\cdot (cạnh_1 + cạnh_2)$.`
                        ];
                        solutionHtml = `Vì các cạnh đối của hình bình hành bằng nhau nên độ dài 4 cạnh lần lượt là $${a}\\text{ cm}$, $${b}\\text{ cm}$, $${a}\\text{ cm}$, $${b}\\text{ cm}$.<br>Chu vi hình bình hành là: $C = 2 \\cdot (${a} + ${b}) = ${p}\\text{ cm}$.`;
                    } else {
                        const edge = this.randomInt(5, 15);
                        const p = 4 * edge;
                        questionText = `Một khung tranh hình thoi có chu vi bằng $${p}\\text{ cm}$. Hỏi độ dài mỗi cạnh của khung tranh hình thoi đó là bao nhiêu?`;
                        options = [`$${edge}\\text{ cm}$`, `$${edge * 2}\\text{ cm}$`, `$${edge / 2}\\text{ cm}$`, `$4\\text{ cm}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${edge}\\text{ cm}$`);
                        hints = [
                            `Hình thoi có 4 cạnh bằng nhau.`,
                            `Chu vi hình thoi bằng độ dài một cạnh nhân với 4.`
                        ];
                        solutionHtml = `Vì hình thoi có 4 cạnh bằng nhau nên độ dài mỗi cạnh là: $a = Chu\\_vi : 4 = ${p} : 4 = ${edge}\\text{ cm}$.`;
                    }
                    tip = "Hình thang cân có hai cạnh bên bằng nhau. Hình bình hành và hình chữ nhật có chu vi bằng 2 lần tổng hai cạnh kề.";
                } else { // kho
                    if (variant === 1) {
                        const p = 32;
                        const a = 10;
                        const b = p / 2 - a;
                        questionText = `Cho hình bình hành có chu vi bằng $${p}\\text{ cm}$ và độ dài một cạnh bằng $${a}\\text{ cm}$. Tính độ dài cạnh kề với cạnh đã cho.`;
                        options = [`$${b}\\text{ cm}$`, `$${a}\\text{ cm}$`, `$${p - a}\\text{ cm}$`, `$6\\text{ cm}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${b}\\text{ cm}$`);
                        hints = [
                            `Hình bình hành có các cạnh đối bằng nhau. Do đó chu vi bằng $2 \\cdot (cạnh_1 + cạnh_2)$.`,
                            `Nửa chu vi hình bình hành bằng tổng hai cạnh kề nhau.`
                        ];
                        solutionHtml = `Nửa chu vi của hình bình hành là: $${p} : 2 = ${p/2}\\text{ cm}$.<br>Độ dài cạnh kề còn lại là: $${p/2} - ${a} = ${b}\\text{ cm}$.`;
                    } else if (variant === 2) {
                        const p = this.randomInt(24, 36);
                        const c = this.randomInt(5, 8);
                        const s = p - 2 * c;
                        questionText = `Cho hình thang cân có chu vi bằng $${p}\\text{ cm}$ và độ dài cạnh bên là $${c}\\text{ cm}$. Tính tổng độ dài hai đáy của hình thang cân đó.`;
                        options = [`$${s}\\text{ cm}$`, `$${p - c}\\text{ cm}$`, `$${s / 2}\\text{ cm}$`, `$${s + c}\\text{ cm}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${s}\\text{ cm}$`);
                        hints = [
                            `Chu vi hình thang cân bằng tổng độ dài 4 cạnh: $Đáy\\_lớn + Đáy\\_nhỏ + Cạnh\\_bên\\_1 + Cạnh\\_bên\\_2$.`,
                            `Hai cạnh bên của hình thang cân bằng nhau và đều bằng $${c}\\text{ cm}$.`,
                            `Tổng hai đáy = Chu vi - 2 $\\cdot$ Cạnh bên.`
                        ];
                        solutionHtml = `Vì hai cạnh bên của hình thang cân bằng nhau nên tổng độ dài hai cạnh bên là: $2 \\cdot ${c} = ${2 * c}\\text{ cm}$.<br>Tổng độ dài hai đáy (đáy lớn và đáy nhỏ) là: $C - 2 \\cdot cạnh\\_bên = ${p} - ${2 * c} = ${s}\\text{ cm}$.`;
                    } else {
                        const a = this.randomInt(4, 8);
                        const p = 8 * a;
                        questionText = `Người ta ghép 3 miếng bìa hình vuông có cùng cạnh là $${a}\\text{ cm}$ sát nhau thành một hàng ngang để được một hình chữ nhật lớn. Tính chu vi của hình chữ nhật lớn đó.`;
                        options = [`$${p}\\text{ cm}$`, `$${12 * a}\\text{ cm}$`, `$${6 * a}\\text{ cm}$`, `$${p + 4}\\text{ cm}$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${p}\\text{ cm}$`);
                        hints = [
                            `Hình chữ nhật lớn có chiều rộng đúng bằng cạnh của hình vuông: $width = ${a}\\text{ cm}$.`,
                            `Chiều dài của hình chữ nhật bằng tổng độ dài 3 cạnh hình vuông ghép lại: $length = 3 \\cdot ${a} = ${3 * a}\\text{ cm}$.`,
                            `Chu vi hình chữ nhật lớn là: $C = 2 \\cdot (length + width)$.`
                        ];
                        solutionHtml = `Khi ghép 3 miếng bìa hình vuông cạnh $${a}\\text{ cm}$ kề nhau, ta được hình chữ nhật có:<br>- Chiều rộng bằng cạnh hình vuông: $w = ${a}\\text{ cm}$.<br>- Chiều dài bằng 3 lần cạnh hình vuông: $l = 3 \\cdot ${a} = ${3 * a}\\text{ cm}$.<br>Chu vi của hình chữ nhật lớn là: $C = 2 \\cdot (l + w) = 2 \\cdot (${3 * a} + ${a}) = 2 \\cdot ${4 * a} = ${p}\\text{ cm}$.`;
                    }
                    tip = "Khi ghép các hình vuông cạnh nhau, hãy xác định kích thước mới của hình chữ nhật rồi áp dụng công thức tính chu vi.";
                }
                break;
            }
            case "chu-vi-dien-tich": {
                const variant = this.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = this.randomInt(6, 12);
                        questionText = `Tính chu vi $(C)$ và diện tích $(S)$ của một khu đất hình vuông có cạnh bằng $${a}\\text{ m}$.`;
                        const c = 4 * a;
                        const s = a * a;
                        options = [
                            `$C = ${c}\\text{ m};\\space S = ${s}\\text{ m}^2$`,
                            `$C = ${s}\\text{ m};\\space S = ${c}\\text{ m}^2$`,
                            `$C = ${2 * a}\\text{ m};\\space S = ${s}\\text{ m}^2$`,
                            `$C = ${c}\\text{ m};\\space S = ${2 * a}\\text{ m}^2$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$C = ${c}\\text{ m};\\space S = ${s}\\text{ m}^2$`);
                        hints = [
                            `Công thức chu vi hình vuông: $C = 4 \\cdot cạnh$.`,
                            `Công thức diện tích hình vuông: $S = cạnh \\cdot cạnh$.`
                        ];
                        solutionHtml = `Áp dụng công thức hình vuông cạnh $a = ${a}$:<br>Chu vi: $C = 4 \\cdot ${a} = ${c}\\text{ m}$.<br>Diện tích: $S = ${a} \\cdot ${a} = ${s}\\text{ m}^2$.`;
                    } else if (variant === 2) {
                        const a = this.randomInt(12, 20);
                        const b = this.randomInt(5, 10);
                        questionText = `Một sân chơi hình chữ nhật có chiều dài $${a}\\text{ m}$ và chiều rộng $${b}\\text{ m}$. Tính chu vi $(C)$ và diện tích $(S)$ của sân chơi đó.`;
                        const c = 2 * (a + b);
                        const s = a * b;
                        options = [
                            `$C = ${c}\\text{ m};\\space S = ${s}\\text{ m}^2$`,
                            `$C = ${a + b}\\text{ m};\\space S = ${s}\\text{ m}^2$`,
                            `$C = ${c}\\text{ m};\\space S = ${s * 2}\\text{ m}^2$`,
                            `$C = ${s}\\text{ m};\\space S = ${c}\\text{ m}^2$`
                        ];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$C = ${c}\\text{ m};\\space S = ${s}\\text{ m}^2$`);
                        hints = [
                            `Công thức chu vi hình chữ nhật: $C = 2 \\cdot (chiều\\_dài + chiều\\_rộng)$.`,
                            `Công thức diện tích hình chữ nhật: $S = chiều\\_dài \\cdot chiều\\_rộng$.`
                        ];
                        solutionHtml = `Chu vi của sân chơi hình chữ nhật là: $C = 2 \\cdot (${a} + ${b}) = ${c}\\text{ m}$.<br>Diện tích của sân chơi hình chữ nhật là: $S = ${a} \\cdot ${b} = ${s}\\text{ m}^2$.`;
                    } else {
                        const a = this.randomInt(6, 15);
                        const h = this.randomInt(4, 10);
                        questionText = `Tính diện tích $(S)$ của hình tam giác có độ dài một cạnh đáy là $${a}\\text{ cm}$ và chiều cao tương ứng là $${h}\\text{ cm}$.`;
                        const s = (a * h) / 2;
                        // a*h === s*2 luôn đúng → trùng. Thay s*2 bằng a*h+1 để phân biệt.
                        const w3ChuViDienTich = a * h + 1;
                        options = [`$${s}\\text{ cm}^2$`, `$${a * h}\\text{ cm}^2$`, `$${w3ChuViDienTich}\\text{ cm}^2$`, `$${a + h}\\text{ cm}^2$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${s}\\text{ cm}^2$`);
                        hints = [
                            `Công thức diện tích hình tam giác: $S = \\frac{1}{2} \\cdot đáy \\cdot chiều\\_cao$.`
                        ];
                        solutionHtml = `Diện tích của hình tam giác là: $S = \\frac{1}{2} \\cdot ${a} \\cdot ${h} = ${s}\\text{ cm}^2$.`;
                    }
                    tip = "Đơn vị đo chu vi là mét (m), đơn vị đo diện tích là mét vuông (m²). Hãy nhớ công thức cơ bản của hình chữ nhật, hình vuông và hình tam giác.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const d1 = 8, d2 = 10;
                        questionText = `Một mảnh bìa hình thoi có độ dài hai đường chéo lần lượt là $${d1}\\text{ cm}$ và $${d2}\\text{ cm}$. Tính diện tích mảnh bìa hình thoi đó.`;
                        const s = (d1 * d2) / 2;
                        options = [`$${s}\\text{ cm}^2$`, `$${d1 * d2}\\text{ cm}^2$`, `$${d1 + d2}\\text{ cm}^2$`, `$${s * 2}\\text{ cm}^2$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${s}\\text{ cm}^2$`);
                        hints = [
                            `Công thức diện tích hình thoi: $S = \\frac{1}{2} \\cdot d_1 \\cdot d_2$ (tích hai đường chéo chia đôi).`
                        ];
                        solutionHtml = `Diện tích hình thoi là: $S = \\frac{1}{2} \\cdot ${d1} \\cdot ${d2} = ${s}\\text{ cm}^2$.`;
                    } else if (variant === 2) {
                        const a = this.randomInt(8, 15);
                        const h = this.randomInt(6, 10);
                        const s = a * h;
                        questionText = `Một khu vườn hình bình hành có độ dài một cạnh đáy là $${a}\\text{ m}$ và chiều cao tương ứng bằng $${h}\\text{ m}$. Diện tích khu vườn đó là bao nhiêu?`;
                        options = [`$${s}\\text{ m}^2$`, `$${s / 2}\\text{ m}^2$`, `$${(a + h) * 2}\\text{ m}^2$`, `$${s * 2}\\text{ m}^2$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${s}\\text{ m}^2$`);
                        hints = [
                            `Công thức diện tích hình bình hành: $S = đáy \\cdot chiều\\_cao$. (Không có hệ số 1/2 như tam giác).`
                        ];
                        solutionHtml = `Diện tích khu vườn hình bình hành là: $S = a \\cdot h = ${a} \\cdot ${h} = ${s}\\text{ m}^2$.`;
                    } else {
                        const a = this.randomInt(6, 10);
                        const b = a + this.randomInt(4, 8);
                        const h = this.randomInt(4, 8);
                        const s = ((a + b) * h) / 2;
                        questionText = `Tính diện tích hình thang có độ dài hai đáy lần lượt là $${a}\\text{ cm}$ và $${b}\\text{ cm}$, chiều cao bằng $${h}\\text{ cm}$.`;
                        options = [`$${s}\\text{ cm}^2$`, `$${(a + b) * h}\\text{ cm}^2$`, `$${s * 2}\\text{ cm}^2$`, `$${a * b * h}\\text{ cm}^2$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${s}\\text{ cm}^2$`);
                        hints = [
                            `Công thức diện tích hình thang: $S = \\frac{(đáy\\_lớn + đáy\\_nhỏ) \\cdot chiều\\_cao}{2}$.`
                        ];
                        solutionHtml = `Diện tích hình thang là: $S = \\frac{(${a} + ${b}) \\cdot ${h}}{2} = \\frac{${a + b} \\cdot ${h}}{2} = ${s}\\text{ cm}^2$.`;
                    }
                    tip = "Diện tích hình thoi bằng nửa tích hai đường chéo. Diện tích hình bình hành bằng tích cạnh đáy và chiều cao.";
                } else { // kho
                    if (variant === 1) {
                        const cd = 12, cr = 6;
                        const edge = 50; 
                        const numBricks = (cd * cr) / (edge * edge / 10000);
                        questionText = `Bác An muốn lát gạch cho một cái sân hình chữ nhật có chiều dài $${cd}\\text{ m}$, chiều rộng $${cr}\\text{ m}$. Loại gạch lát sân hình vuông có cạnh $${edge}\\text{ cm}$. Hỏi bác An cần chuẩn bị ít nhất bao nhiêu viên gạch? (Bỏ qua mạch vữa).`;
                        options = [`$${numBricks}$ viên`, `$${numBricks - 50}$ viên`, `$${numBricks * 2}$ viên`, `$100$ viên`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${numBricks}$ viên`);
                        hints = [
                            `Đổi tất cả các đơn vị đo về cùng một đơn vị (ví dụ mét vuông). Cạnh gạch $${edge}\\text{ cm} = 0.5\\text{ m}$.`,
                            `Tính diện tích sân và diện tích một viên gạch, rồi lấy diện tích sân chia cho diện tích một viên gạch.`
                        ];
                        solutionHtml = `Diện tích cái sân hình chữ nhật là: $S_{sân} = ${cd} \\cdot ${cr} = ${cd * cr}\\text{ m}^2$.<br>Diện tích một viên gạch hình vuông là: $S_{gạch} = 0.5 \\cdot 0.5 = 0.25\\text{ m}^2$.<br>Số viên gạch ít nhất cần dùng là: $${cd * cr} : 0.25 = ${numBricks}$ viên.`;
                    } else if (variant === 2) {
                        const a = 20;
                        const b = 15;
                        const w = 1;
                        const insideA = a - 2 * w;
                        const insideB = b - 2 * w;
                        const sFlower = insideA * insideB;
                        questionText = `Một khu vườn hình chữ nhật có chiều dài $${a}\\text{ m}$ và chiều rộng $${b}\\text{ m}$. Người ta làm một lối đi xung quanh vườn (phía bên trong vườn) có chiều rộng $${w}\\text{ m}$. Phần đất còn lại ở giữa được dùng để trồng hoa. Tính diện tích phần đất trồng hoa đó.`;
                        options = [`$${sFlower}\\text{ m}^2$`, `$${a * b}\\text{ m}^2$`, `$${sFlower - 10}\\text{ m}^2$`, `$${(a - w) * (b - w)}\\text{ m}^2$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${sFlower}\\text{ m}^2$`);
                        hints = [
                            `Chiều dài phần trồng hoa bằng chiều dài khu vườn trừ đi chiều rộng lối đi ở hai bên trái và phải.`,
                            `Chiều rộng phần trồng hoa bằng chiều rộng khu vườn trừ đi chiều rộng lối đi ở hai bên trên và dưới.`,
                            `Diện tích trồng hoa bằng kích thước mới của phần đất trồng hoa nhân nhau.`
                        ];
                        solutionHtml = `Khi làm lối đi rộng $${w}\\text{ m}$ xung quanh vườn:<br>- Chiều dài phần đất trồng hoa còn lại là: $${a} - 2 \\cdot ${w} = ${insideA}\\text{ m}$.<br>- Chiều rộng phần đất trồng hoa còn lại là: $${b} - 2 \\cdot ${w} = ${insideB}\\text{ m}$.<br>Diện tích phần đất dùng để trồng hoa là: $S = ${insideA} \\cdot ${insideB} = ${sFlower}\\text{ m}^2$.`;
                    } else {
                        const sRect = 80;
                        const sRhombus = sRect / 2;
                        questionText = `Một hình thoi được vẽ bên trong một hình chữ nhật sao cho 4 đỉnh của hình thoi nằm tại trung điểm của 4 cạnh hình chữ nhật. Biết diện tích hình chữ nhật là $${sRect}\\text{ cm}^2$. Tính diện tích của hình thoi đó.`;
                        options = [`$${sRhombus}\\text{ cm}^2$`, `$${sRect}\\text{ cm}^2$`, `$${sRhombus * 2}\\text{ cm}^2$`, `$20\\text{ cm}^2$`];
                        this.shuffle(options);
                        correctIndex = options.indexOf(`$${sRhombus}\\text{ cm}^2$`);
                        hints = [
                            `Độ dài hai đường chéo của hình thoi chính bằng chiều dài và chiều rộng của hình chữ nhật.`,
                            `Diện tích hình chữ nhật là $S_{rect} = l \\cdot w$.`,
                            `Diện tích hình thoi là $S_{rhombus} = \\frac{1}{2} \\cdot d_1 \\cdot d_2 = \\frac{1}{2} \\cdot l \\cdot w$.`
                        ];
                        solutionHtml = `Độ dài hai đường chéo của hình thoi đúng bằng chiều dài và chiều rộng của hình chữ nhật bao quanh.<br>Ta có diện tích hình chữ nhật là $S_{hcn} = dài \\cdot rộng = ${sRect}\\text{ cm}^2$.<br>Diện tích hình thoi là: $S_{ht} = \\frac{1}{2} \\cdot d_1 \\cdot d_2 = \\frac{1}{2} \\cdot dài \\cdot rộng = \\frac{1}{2} \\cdot S_{hcn} = \\frac{1}{2} \\cdot ${sRect} = ${sRhombus}\\text{ cm}^2$.`;
                    }
                    tip = "Đồng nhất đơn vị đo trước khi thực hiện các phép tính diện tích. Vẽ phác thảo hình vẽ để thấy mối liên hệ giữa các chiều kích thước của các hình lồng nhau.";
                }
                break;
            }
            case "truc-doi-xung": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        questionText = `Hình phẳng nào sau đây có đúng **3 trục đối xứng**?`;
                        options = [`Hình tam giác đều`, `Hình vuông`, `Hình chữ nhật`, `Hình thoi`];
                        hints = [
                            `Trục đối xứng là đường thẳng chia hình thành hai phần phản chiếu trùng khớp nhau.`,
                            `Đa giác đều có $n$ cạnh thì có bao nhiêu trục đối xứng?`
                        ];
                        solutionHtml = `Tam giác đều là đa giác đều có 3 cạnh, do đó nó có đúng 3 trục đối xứng (đi qua các đỉnh và trung điểm của cạnh đối diện).<br>Hình vuông có 4 trục. Hình chữ nhật có 2 trục. Hình thoi có 2 trục.`;
                    } else {
                        questionText = `Trong các hình dưới đây, hình nào có đúng **2 trục đối xứng**?`;
                        options = [`Hình chữ nhật`, `Hình tam giác đều`, `Hình lục giác đều`, `Hình thang cân`];
                        hints = [
                            `Hãy tưởng tượng các đường thẳng chia đôi hình sao cho khi gấp theo đường đó, hai nửa chồng khít lên nhau.`,
                            `Hình chữ nhật có các trục đối xứng đi qua trung điểm các cặp cạnh đối diện.`
                        ];
                        solutionHtml = `Hình chữ nhật có đúng 2 trục đối xứng (là 2 đường thẳng đi qua trung điểm các cặp cạnh đối diện).<br>Tam giác đều có 3 trục. Lục giác đều có 6 trục. Hình thang cân chỉ có 1 trục đối xứng.`;
                    }
                    tip = "Một đa giác đều có $n$ cạnh thì có đúng $n$ trục đối xứng. Hình chữ nhật không phải đa giác đều và có 2 trục đối xứng.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        questionText = `Trong các nhóm chữ cái in hoa sau, nhóm nào gồm các chữ cái **đều có đúng 1 trục đối xứng dọc**?`;
                        options = [`A, M, T, Y`, `H, O, X, I`, `N, S, Z, P`, `B, C, D, E`];
                        hints = [
                            `Trục đối xứng dọc chia chữ cái thành hai phần trái và phải đối xứng gương với nhau.`,
                            `Ví dụ, chữ A có trục dọc chia đôi. Chữ H ngoài trục dọc còn có trục ngang (tổng 2 trục).`
                        ];
                        solutionHtml = `Các chữ cái **A, M, T, Y** đều có đúng 1 trục đối xứng dọc chia đôi chữ cái thành hai phần trái - phải đối xứng.<br>- Nhóm H, O, X, I có 2 trục đối xứng (dọc và ngang).<br>- Nhóm N, S, Z không có trục đối xứng nào (chỉ có tâm đối xứng), chữ P không có trục đối xứng.<br>- Nhóm B, C, D, E chỉ có 1 trục đối xứng ngang.`;
                    } else {
                        questionText = `Tính tổng số trục đối xứng của ba hình sau: một hình thoi (không phải hình vuông), một hình lục giác đều và một hình thang cân.`;
                        options = [`$9$ trục`, `$11$ trục`, `$8$ trục`, `$12$ trục`];
                        hints = [
                            `Tính số trục đối xứng của từng hình rồi cộng lại.`,
                            `Hình thoi có bao nhiêu trục đối xứng? Hình lục giác đều có bao nhiêu? Hình thang cân có bao nhiêu?`
                        ];
                        solutionHtml = `- Hình thoi có đúng $2$ trục đối xứng (là hai đường chéo).<br>- Hình lục giác đều là đa giác đều có 6 cạnh nên có đúng $6$ trục đối xứng.<br>- Hình thang cân có đúng $1$ trục đối xứng (đường thẳng đi qua trung điểm hai đáy).<br>Tổng số trục đối xứng là: $2 + 6 + 1 = 9$ trục đối xứng.`;
                    }
                    tip = "Hãy phân biệt số trục đối xứng của hình thoi (2 trục), hình vuông (4 trục) và hình chữ nhật (2 trục).";
                } else { // kho
                    if (variant === 1) {
                        questionText = `Một hình ghép được tạo bằng cách vẽ một hình vuông và bốn hình tam giác đều bằng nhau dựng trên bốn cạnh của hình vuông đó hướng ra ngoài (tạo thành một ngôi sao 4 cánh). Hình ghép này có tất cả bao nhiêu trục đối xứng?`;
                        options = [`$4$ trục đối xứng`, `$8$ trục đối xứng`, `$2$ trục đối xứng`, `$1$ trục đối xứng`];
                        hints = [
                            `Hãy vẽ phác thảo hình vẽ: một ngôi sao 4 cánh đối xứng qua tâm của hình vuông.`,
                            `Các đường chéo của hình vuông và các đường thẳng đi qua trung điểm các cạnh đối diện của hình vuông có phải là trục đối xứng của hình ghép này không?`
                        ];
                        solutionHtml = `Hình ghép là ngôi sao 4 cánh đối xứng. Trục đối xứng của hình ghép phải là trục đối xứng của cả phần hình vuông ở giữa và phần các tam giác đều.<br>- Hai đường chéo của hình vuông chia đôi ngôi sao thành hai nửa đối xứng (2 trục).<br>- Hai đường thẳng đi qua trung điểm các cạnh đối diện của hình vuông cũng chia đôi ngôi sao thành hai nửa đối xứng (2 trục).<br>Do đó, hình ghép này có tất cả $2 + 2 = 4$ trục đối xứng.`;
                    } else {
                        questionText = `Trong các biển báo giao thông sau: Biển báo đường cấm (hình tròn màu trắng viền đỏ), biển báo nguy hiểm đường giao nhau (tam giác đều viền đỏ nền vàng hướng đỉnh lên trên), biển cấm đi ngược chiều (hình tròn màu đỏ có vạch ngang màu trắng ở giữa). Tổng số trục đối xứng của ba biển báo này là bao nhiêu?`;
                        options = [`Vô số`, `$5$ trục`, `$3$ trục`, `$4$ trục`];
                        hints = [
                            `Tìm số trục đối xứng của từng biển báo. Lưu ý hình tròn hoàn hảo có vô số trục đối xứng, nhưng biển báo có chứa hình vẽ bên trong sẽ bị giới hạn số trục đối xứng.`,
                            `Biển đường cấm (hình tròn viền đỏ trống) có vô số trục đối xứng.<br>Biển cấm ngược chiều (hình tròn có vạch ngang) có bao nhiêu trục đối xứng?`
                        ];
                        solutionHtml = `- Biển báo đường cấm chỉ là một hình tròn đồng tâm màu trắng viền đỏ, không có hình vẽ phụ bên ngoài hay bên trong, nên có **vô số** trục đối xứng (mọi đường thẳng đi qua tâm).<br>- Khi một trong các hình có vô số trục đối xứng thì tổng số trục đối xứng của cả ba hình cũng là **vô số**.`;
                    }
                    tip = "Chỉ cần một hình trong nhóm có vô số trục đối xứng thì tổng số trục đối xứng của nhóm đó sẽ là vô số.";
                }
                break;
            }
            case "tam-doi-xung": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        questionText = `Hình phẳng nào dưới đây **không** có tâm đối xứng?`;
                        options = [`Hình tam giác đều`, `Hình bình hành`, `Hình lục giác đều`, `Hình chữ nhật`];
                        hints = [
                            `Một hình có tâm đối xứng $O$ nếu khi ta quay hình đó $180^\\circ$ quanh $O$, hình mới trùng khít với hình ban đầu.`,
                            `Đa giác đều có số cạnh lẻ (như tam giác đều có 3 cạnh) không bao giờ có tâm đối xứng.`
                        ];
                        solutionHtml = `Hình tam giác đều không có tâm đối xứng. Khi xoay tam giác đều một góc $180^\\circ$ quanh tâm, đỉnh của nó sẽ hướng xuống dưới thay vì hướng lên trên như ban đầu, nên không trùng khớp. Các hình bình hành, lục giác đều, chữ nhật đều có tâm đối xứng.`;
                    } else {
                        questionText = `Trong các hình sau: *hình vuông, hình thoi, hình thang cân, hình tròn*, có bao nhiêu hình có tâm đối xứng?`;
                        options = [`$3$ hình`, `$4$ hình`, `$2$ hình`, `$1$ hình`];
                        hints = [
                            `Kiểm tra tính chất tâm đối xứng của từng hình.`,
                            `Hình thang cân có tâm đối xứng hay không? (Hãy tưởng tượng lật ngược hình thang cân xem có giống ban đầu không).`
                        ];
                        solutionHtml = `- Hình vuông, hình thoi và hình tròn đều có tâm đối xứng (lần lượt là giao điểm đường chéo và tâm đường tròn).<br>- Hình thang cân không có tâm đối xứng (khi xoay $180^\\circ$ đáy lớn và đáy nhỏ sẽ đổi chỗ cho nhau, không trùng khít).<br>Do đó có đúng $3$ hình có tâm đối xứng.`;
                    }
                    tip = "Đa giác đều số cạnh chẵn (hình vuông, lục giác đều) thì có tâm đối xứng. Hình bình hành, hình thoi, hình chữ nhật luôn có tâm đối xứng.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        questionText = `Trong các chữ cái in hoa sau: **H, I, O, X, N, S, Z**, phát biểu nào sau đây là **đúng nhất**?`;
                        options = [
                            `Tất cả các chữ cái trên đều có tâm đối xứng.`,
                            `Chỉ có các chữ H, I, O, X có tâm đối xứng.`,
                            `Chỉ có các chữ N, S, Z có tâm đối xứng.`,
                            `Chỉ có chữ O và chữ X có tâm đối xứng.`
                        ];
                        hints = [
                            `Hãy tưởng tượng lật ngược các chữ cái $180^\\circ$ xem chúng có thay đổi hình dạng hay không.`,
                            `Chữ N lật ngược vẫn là chữ N, chữ S lật ngược vẫn là chữ S, chữ Z lật ngược vẫn là chữ Z.`
                        ];
                        solutionHtml = `Tất cả các chữ cái **H, I, O, X, N, S, Z** khi xoay $180^\\circ$ quanh tâm đối xứng của chúng đều trùng khít với chính nó. Do đó, tất cả chúng đều có tâm đối xứng.<br>*(Lưu ý: H, I, O, X vừa có trục vừa có tâm đối xứng; còn N, S, Z chỉ có tâm đối xứng mà không có trục đối xứng).*`;
                    } else {
                        questionText = `Trong các chữ cái in hoa sau, chữ cái nào **chỉ có tâm đối xứng** mà **không có** trục đối xứng?`;
                        options = [`Chữ N`, `Chữ H`, `Chữ A`, `Chữ O`];
                        hints = [
                            `Tìm chữ cái không có bất kỳ đường đối xứng dọc hay ngang nào, nhưng lật ngược $180^\\circ$ lại trùng khớp.`,
                            `Chữ H và O có cả trục đối xứng và tâm đối xứng. Chữ A chỉ có trục đối xứng dọc, không có tâm đối xứng.`
                        ];
                        solutionHtml = `Chữ **N** không có trục đối xứng nào (không có đường dọc hay ngang nào chia nó thành 2 phần đối xứng gương), nhưng có tâm đối xứng nằm ở trung điểm của đoạn nối hai đỉnh chéo. Khi quay chữ N một góc $180^\\circ$, ta vẫn được chữ N ban đầu.`;
                    }
                    tip = "Các chữ cái S, N, Z là ví dụ điển hình của hình có tâm đối xứng nhưng không có trục đối xứng.";
                } else { // kho
                    if (variant === 1) {
                        questionText = `Ghép hai hình tam giác đều có chung một cạnh để tạo thành một hình tứ giác. Phát biểu nào sau đây là **đúng** về hình tứ giác vừa tạo thành?`;
                        options = [
                            `Hình đó là hình thoi, vừa có tâm đối xứng, vừa có $2$ trục đối xứng.`,
                            `Hình đó là hình chữ nhật, chỉ có tâm đối xứng và không có trục đối xứng.`,
                            `Hình đó là hình bình hành, chỉ có tâm đối xứng và không có trục đối xứng.`,
                            `Hình đó là hình thoi, không có tâm đối xứng và có $4$ trục đối xứng.`
                        ];
                        hints = [
                            `Ghép hai tam giác đều chung cạnh sẽ tạo thành hình thoi có các góc $60^\\circ$ và $120^\\circ$.`,
                            `Xét tính đối xứng của hình thoi này: giao điểm hai đường chéo có phải là tâm đối xứng không? Hai đường chéo có phải là các trục đối xứng không?`
                        ];
                        solutionHtml = `Ghép hai tam giác đều bằng nhau chung một cạnh ta được một hình thoi.<br>- Hình thoi này có tâm đối xứng là giao điểm hai đường chéo.<br>- Hình thoi có đúng $2$ trục đối xứng là hai đường thẳng chứa hai đường chéo của nó (các đường chéo chia hình thoi thành hai phần đối xứng nhau).`;
                    } else {
                        questionText = `Bình Minh quan sát ba biển báo giao thông hình tròn: biển báo đường cấm (tròn trắng viền đỏ), biển báo cấm đi ngược chiều (tròn đỏ có vạch ngang trắng qua tâm) và biển cấm dừng và đỗ xe (tròn xanh viền đỏ có hai vạch chéo đỏ cắt nhau tại tâm). Hỏi có bao nhiêu biển báo có tâm đối xứng?`;
                        options = [`Cả $3$ biển báo`, `Chỉ $2$ biển báo`, `Chỉ $1$ biển báo`, `Không có biển báo nào`];
                        hints = [
                            `Xét tính chất tâm đối xứng của từng biển báo bằng cách xoay góc $180^\\circ$.`,
                            `Biển cấm ngược chiều xoay $180^\\circ$ vạch ngang vẫn nằm ngang.<br>Biển cấm dừng đỗ xe có hai vạch chéo chữ X, xoay $180^\\circ$ hai vạch này vẫn trùng khít.`
                        ];
                        solutionHtml = `- Biển báo đường cấm (hình tròn đồng tâm trống) khi xoay $180^\\circ$ trùng khít $\\rightarrow$ có tâm đối xứng.<br>- Biển cấm đi ngược chiều (hình tròn có vạch ngang qua tâm) khi xoay $180^\\circ$ thì vạch ngang vẫn nằm ngang trùng khít $\\rightarrow$ có tâm đối xứng.<br>- Biển cấm dừng và đỗ xe (hình tròn có 2 vạch chéo đối xứng qua tâm) khi xoay $180^\\circ$ các vạch chéo vẫn trùng khít $\\rightarrow$ có tâm đối xứng.<br>Vậy cả $3$ biển báo đều có tâm đối xứng.`;
                    }
                    tip = "Nếu các họa tiết bên trong biển báo có tính đối xứng tâm (như vạch ngang qua tâm hoặc chữ X giao tại tâm) thì biển báo hình tròn đó vẫn giữ được tâm đối xứng.";
                }
                break;
            }
            case "phan-so-bang-nhau": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = this.randomInt(2, 7);
                        const b = this.randomInt(8, 12);
                        const m = this.randomInt(2, 5);
                        const correctVal = a * m;
                        questionText = `Tìm số tự nhiên $x$ sao cho phân số $\\frac{${a}}{${b}}$ bằng phân số $\\frac{x}{${b * m}}$.`;
                        options = [`$x = ${correctVal}$`, `$x = ${a}$`, `$x = ${correctVal + 1}$`, `$x = ${correctVal - 1}$`];
                        hints = [
                            `Ta có $\\frac{a}{b} = \\frac{a \\cdot m}{b \\cdot m}$ với mọi số nguyên $m \\neq 0$.`,
                            `Nhìn vào mẫu số: mẫu số thứ hai bằng $${b} \\cdot ${m} = ${b * m}$.`,
                            `Vậy tử số $x$ cũng bằng tử số thứ nhất nhân với $${m}$.`
                        ];
                        solutionHtml = `Ta thấy mẫu số $${b * m} = ${b} \\cdot ${m}$. Nhân cả tử và mẫu của $\\frac{${a}}{${b}}$ với $${m}$ ta được: $\\frac{${a} \\cdot ${m}}{${b} \\cdot ${m}} = \\frac{${correctVal}}{${b * m}}$. Vậy $x = ${correctVal}$.`;
                    } else {
                        const a = this.randomInt(2, 5);
                        const b = this.randomInt(6, 9);
                        const k = this.randomInt(2, 4);
                        const correctVal = a;
                        questionText = `Tìm số tự nhiên $x$ biết: $\\frac{${correctVal * k}}{${b * k}} = \\frac{x}{${b}}$.`;
                        // Tránh trùng khi correctVal*k = b (option 2 = option 3): thay b+1
                        const w3PhanSo2 = (correctVal * k === b) ? b + 1 : b;
                        // Tránh trùng correctVal+1 = w3PhanSo2 hoặc = correctVal*k
                        const w4Phan2 = ((correctVal + 1 === w3PhanSo2) || (correctVal + 1 === correctVal * k)) ? correctVal + 2 : correctVal + 1;
                        options = [`$x = ${correctVal}$`, `$x = ${correctVal * k}$`, `$x = ${w3PhanSo2}$`, `$x = ${w4Phan2}$`];
                        hints = [
                            `Rút gọn phân số ở vế trái bằng cách chia cả tử và mẫu cho ước chung lớn nhất.`,
                            `Ước chung lớn nhất của tử và mẫu ở vế trái là $${k}$.`,
                            `Chia cả tử và mẫu của $\\frac{${correctVal * k}}{${b * k}}$ cho $${k}$.`
                        ];
                        solutionHtml = `Ta rút gọn phân số ở vế trái:<br>$\\frac{${correctVal * k}}{${b * k}} = \\frac{${correctVal * k} : ${k}}{${b * k} : ${k}} = \\frac{${correctVal}}{${b}}$.<br>Do đó ta có $\\frac{x}{${b}} = \\frac{${correctVal}}{${b}} \\rightarrow x = ${correctVal}$.`;
                    }
                    tip = "Nhân hoặc chia cả tử và mẫu của một phân số với cùng một số khác không ta được một phân số mới bằng phân số đã cho.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const x = this.randomInt(3, 8);
                        const y = this.randomInt(-12, -5);
                        const a = x * 3;
                        const b = y * 3;
                        questionText = `Tìm số nguyên $x$, biết: $\\frac{x}{${y}} = \\frac{${a}}{${b}}$.`;
                        options = [`$x = ${x}$`, `$x = ${-x}$`, `$x = ${x * 3}$`, `$x = ${x + 3}$`];
                        hints = [
                            `Áp dụng định nghĩa hai phân số bằng nhau: $\\frac{a}{b} = \\frac{c}{d}$ nếu $a \\cdot d = b \\cdot c$.`,
                            `Tích chéo: $x \\cdot ${b} = ${y} \\cdot ${a}$.`,
                            `Hoặc rút gọn phân số ở vế phải $\\frac{${a}}{${b}}$ bằng cách chia cả tử và mẫu cho 3.`
                        ];
                        solutionHtml = `Cách 1: Rút gọn phân số ở vế phải: $\\frac{${a}}{${b}} = \\frac{${a} : 3}{${b} : 3} = \\frac{${x}}{${y}}$. Do đó $\\frac{x}{${y}} = \\frac{${x}}{${y}} \\rightarrow x = ${x}$.<br>Cách 2: Sử dụng tích chéo: $x \\cdot (${b}) = ${y} \\cdot ${a} \\rightarrow x \\cdot (${b}) = ${y * a} \\rightarrow x = ${y * a} : (${b}) = ${x}$.`;
                    } else {
                        const xVal = this.randomInt(2, 5);
                        const a = xVal + 1;
                        const b = this.randomInt(3, 5);
                        const k = this.randomInt(3, 5);
                        const c = b * k;
                        const d = xVal * k;
                        questionText = `Tìm số nguyên $x$, biết: $\\frac{x - 1}{${b}} = \\frac{${d}}{${c}}$.`;
                        options = [`$x = ${a}$`, `$x = ${a - 1}$`, `$x = ${a + 1}$`, `$x = ${a - 2}$`];
                        hints = [
                            `Rút gọn phân số ở vế phải $\\frac{${d}}{${c}}$ bằng cách chia cả tử và mẫu cho $${k}$.`,
                            `Ta được: $\\frac{x - 1}{${b}} = \\frac{${xVal}}{${b}}$.`,
                            `Từ đó suy ra tử số bằng nhau: $x - 1 = ${xVal}$.`
                        ];
                        solutionHtml = `Ta rút gọn phân số ở vế phải:<br>$\\frac{${d}}{${c}} = \\frac{${d} : ${k}}{${c} : ${k}} = \\frac{${xVal}}{${b}}$.<br>Khi đó ta có:<br>$\\frac{x - 1}{${b}} = \\frac{${xVal}}{${b}} \\rightarrow x - 1 = ${xVal} \\rightarrow x = ${xVal} + 1 = ${a}$.`;
                    }
                    tip = "Rút gọn phân số về cùng mẫu số rồi cho hai tử số bằng nhau là phương pháp hiệu quả nhất để tìm số chưa biết.";
                } else { // kho
                    if (variant === 1) {
                        const a = this.randomInt(2, 5);
                        const b = a + this.randomInt(1, 3);
                        const sum = this.randomInt(4, 8) * (a + b);
                        const x = (sum * a) / (a + b);
                        const y = (sum * b) / (a + b);
                        questionText = `Tìm hai số tự nhiên $x$ và $y$ biết rằng $\\frac{x}{y} = \\frac{${a}}{${b}}$ và tổng $x + y = ${sum}$.`;
                        options = [
                            `$x = ${x}, y = ${y}$`,
                            `$x = ${y}, y = ${x}$`,
                            `$x = ${x + a}, y = ${y - a}$`,
                            `$x = ${x - 1}, y = ${y + 1}$`
                        ];
                        hints = [
                            `Tỉ số của $x$ và $y$ là $${a} : ${b}$, nghĩa là $x$ chiếm $${a}$ phần, $y$ chiếm $${b}$ phần bằng nhau.`,
                            `Tổng số phần bằng nhau là: $${a} + ${b} = ${a+b}$ phần.`,
                            `Giá trị của 1 phần là: $${sum} : ${a+b}$. Từ đó nhân lên để tìm $x$ và $y$.`
                        ];
                        solutionHtml = `Theo đề bài, $x$ chiếm $${a}$ phần và $y$ chiếm $${b}$ phần.<br>Tổng số phần bằng nhau là: $${a} + ${b} = ${a + b}$ phần.<br>Giá trị của mỗi phần là: $${sum} : ${a + b} = ${sum / (a + b)}$.<br>Số tự nhiên $x$ là: $${sum / (a + b)} \\cdot ${a} = ${x}$.<br>Số tự nhiên $y$ là: $${sum / (a + b)} \\cdot ${b} = ${y}$.`;
                    } else {
                        questionText = `Tìm các cặp số nguyên $(x; y)$ thỏa mãn $\\frac{x}{3} = \\frac{-4}{y}$ biết rằng $x < 0 < y$.`;
                        options = [
                            `$(x; y) \\in \\{(-1; 12), (-2; 6), (-3; 4), (-4; 3), (-6; 2), (-12; 1)\\}$`,
                            `$(x; y) \\in \\{(1; -12), (2; -6), (3; -4), (4; -3)\\}$`,
                            `$(x; y) \\in \\{(-1; 12), (-2; 6), (-3; 4)\\}$`,
                            `$(x; y) \\in \\{(-2; 6), (-6; 2)\\}$`
                        ];
                        hints = [
                            `Áp dụng tích chéo hai phân số bằng nhau: $x \\cdot y = 3 \\cdot (-4) = -12$.`,
                            `Vì $x$ và $y$ là các số nguyên và $x < 0 < y$, nên $x$ phải là ước âm của $-12$ và $y$ là ước dương tương ứng.`,
                            `Liệt kê các ước âm $x$ của $-12$: $-1, -2, -3, -4, -6, -12$.`
                        ];
                        solutionHtml = `Từ đẳng thức $\\frac{x}{3} = \\frac{-4}{y}$, ta suy ra tích chéo:<br>$x \\cdot y = 3 \\cdot (-4) = -12$.<br>Do $x, y$ là các số nguyên và $x < 0 < y$ nên $x$ nhận các giá trị nguyên âm, còn $y$ nhận các giá trị nguyên dương tương ứng.<br>Các cặp ước $(x; y)$ của $-12$ thỏa mãn $x < 0$ và $y > 0$ là:<br>Nếu $x = -1 \\rightarrow y = 12$<br>Nếu $x = -2 \\rightarrow y = 6$<br>Nếu $x = -3 \\rightarrow y = 4$<br>Nếu $x = -4 \\rightarrow y = 3$<br>Nếu $x = -6 \\rightarrow y = 2$<br>Nếu $x = -12 \\rightarrow y = 1$<br>Vậy các cặp số nguyên $(x; y)$ là: $(-1; 12), (-2; 6), (-3; 4), (-4; 3), (-6; 2), (-12; 1)$.`;
                    }
                    tip = "Đưa bài toán tìm hai số nguyên từ đẳng thức phân số về bài toán tìm ước số của một tích nguyên.";
                }
                break;
            }
            case "so-sanh-phan-so": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = this.randomInt(1, 5);
                        const b = a + 1;
                        questionText = `So sánh hai phân số: $A = \\frac{${a}}{${b}}$ và $B = \\frac{${a+1}}{${b}}$.`;
                        options = [`$A < B$`, `$A > B$`, `$A = B$`, `Không so sánh được`];
                        hints = [
                            `Hai phân số này có cùng mẫu số là $${b}$ (là mẫu số dương).`,
                            `Với hai phân số có cùng mẫu số dương, phân số nào có tử số lớn hơn thì lớn hơn.`,
                            `So sánh hai tử số: $${a} < ${a+1}$.`
                        ];
                        solutionHtml = `Vì hai phân số cùng có mẫu số dương là $${b}$ và tử số $${a} < ${a+1}$, nên ta có $\\frac{${a}}{${b}} < \\frac{${a+1}}{${b}}$. Do đó $A < B$.`;
                    } else {
                        const a = this.randomInt(2, 5);
                        const b = this.randomInt(6, 8);
                        const c = b + this.randomInt(1, 3);
                        // So sánh a/b và a/c. Vì b < c nên a/b > a/c
                        questionText = `So sánh hai phân số cùng tử số: $A = \\frac{${a}}{${b}}$ và $B = \\frac{${a}}{${c}}$.`;
                        options = [`$A > B$`, `$A < B$`, `$A = B$`, `Không so sánh được`];
                        hints = [
                            `Hai phân số này có cùng tử số dương là $${a}$.`,
                            `Đối với hai phân số dương có cùng tử số, phân số nào có mẫu số nhỏ hơn thì phân số đó lớn hơn.`,
                            `So sánh hai mẫu số: $${b} < ${c}$.`
                        ];
                        solutionHtml = `Vì hai phân số cùng có tử số dương là $${a}$ và mẫu số $${b} < ${c}$, nên phân số có mẫu nhỏ hơn sẽ lớn hơn. Ta có $\\frac{${a}}{${b}} > \\frac{${a}}{${c}}$. Do đó $A > B$.`;
                    }
                    tip = "Khi so sánh hai phân số cùng tử dương, phân số nào có mẫu nhỏ hơn thì phân số đó lớn hơn.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const a = 3;
                        const b = 4;
                        const c = 5;
                        const d = 6;
                        questionText = `So sánh hai phân số khác mẫu: $M = \\frac{${a}}{${b}}$ và $N = \\frac{${c}}{${d}}$.`;
                        options = [`$M < N$`, `$M > N$`, `$M = N$`, `Không so sánh được`];
                        hints = [
                            `Để so sánh hai phân số khác mẫu số, ta quy đồng mẫu số của chúng về cùng mẫu số dương.`,
                            `Mẫu số chung của $${b}$ và $${d}$ là $\\text{BCNN}(${b}; ${d}) = 12$.`,
                            `Quy đồng: $M = \\frac{${a} \\cdot 3}{${b} \\cdot 3} = \\frac{9}{12}$, $N = \\frac{${c} \\cdot 2}{${d} \\cdot 2} = \\frac{10}{12}$.`
                        ];
                        solutionHtml = `Mẫu chung là $12$. Quy đồng mẫu số hai phân số:<br>$M = \\frac{${a} \\cdot 3}{${b} \\cdot 3} = \\frac{9}{12}$.<br>$N = \\frac{${c} \\cdot 2}{${d} \\cdot 2} = \\frac{10}{12}$.<br>Vì $\\frac{9}{12} < \\frac{10}{12}$ nên $M < N$.`;
                    } else {
                        const n = this.randomInt(95, 98);
                        // So sánh n/(n+1) và (n+1)/(n+2). Dùng phần bù: 1 - n/(n+1) = 1/(n+1) và 1/(n+2).
                        // 1/(n+1) > 1/(n+2) -> phần bù lớn hơn thì phân số nhỏ hơn -> n/(n+1) < (n+1)/(n+2).
                        questionText = `So sánh hai phân số: $A = \\frac{${n}}{${n+1}}$ và $B = \\frac{${n+1}}{${n+2}}$.`;
                        options = [`$A < B$`, `$A > B$`, `$A = B$`, `Không so sánh được`];
                        hints = [
                            `Quy đồng mẫu số với số lớn như thế này sẽ rất phức tạp. Hãy dùng phương pháp so sánh phần bù đối với 1.`,
                            `Phần bù của $A$ là $1 - A = \\frac{1}{${n+1}}$. Phần bù của $B$ là $1 - B = \\frac{1}{${n+2}}$.`,
                            `So sánh hai phần bù này: phân số nào có phần bù lớn hơn thì phân số đó nhỏ hơn.`
                        ];
                        solutionHtml = `Ta sử dụng phương pháp so sánh phần bù với $1$:<br>Phần bù của $A$ là: $1 - \\frac{${n}}{${n+1}} = \\frac{1}{${n+1}}$.<br>Phần bù của $B$ là: $1 - \\frac{${n+1}}{${n+2}} = \\frac{1}{${n+2}}$.<br>Vì $\\frac{1}{${n+1}} > \\frac{1}{${n+2}}$ (cùng tử, mẫu $${n+1} < ${n+2}$) nên phần bù của $A$ lớn hơn phần bù của $B$.<br>Do đó, $A < B$.`;
                    }
                    tip = "Khi phân số có tử nhỏ hơn mẫu 1 đơn vị, ta dùng so sánh phần bù với 1: phần bù nhỏ hơn thì phân số lớn hơn.";
                } else { // kho
                    if (variant === 1) {
                        questionText = `Sắp xếp các phân số sau theo thứ tự **giảm dần**: $X = \\frac{-2}{5}$, $Y = \\frac{1}{-3}$, $Z = \\frac{-3}{4}$.`;
                        options = [
                            `$Y > X > Z$`,
                            `$Z > X > Y$`,
                            `$X > Y > Z$`,
                            `$Y > Z > X$`
                        ];
                        hints = [
                            `Viết lại các phân số với mẫu số dương: $X = \\frac{-2}{5}$, $Y = \\frac{-1}{3}$, $Z = \\frac{-3}{4}$.`,
                            `Mẫu số chung của $3, 4, 5$ là $60$. Quy đồng mẫu số cả 3 phân số.`,
                            `$X = \\frac{-24}{60}$, $Y = \\frac{-20}{60}$, $Z = \\frac{-45}{60}$. So sánh các tử số âm.`
                        ];
                        solutionHtml = `Viết lại các phân số dưới dạng mẫu số dương: $X = \\frac{-2}{5}$, $Y = \\frac{-1}{3}$, $Z = \\frac{-3}{4}$.<br>Mẫu số chung là $60$. Quy đồng:<br>$X = \\frac{-2 \\cdot 12}{5 \\cdot 12} = \\frac{-24}{60}$.<br>$Y = \\frac{-1 \\cdot 20}{3 \\cdot 20} = \\frac{-20}{60}$.<br>$Z = \\frac{-3 \\cdot 15}{4 \\cdot 15} = \\frac{-45}{60}$.<br>So sánh các tử số: $-20 > -24 > -45 \\rightarrow \\frac{-20}{60} > \\frac{-24}{60} > \\frac{-45}{60} \\rightarrow Y > X > Z$.`;
                    } else {
                        const a = 1;
                        const b = 3;
                        const c = 12;
                        const d = 3;
                        const e = 4;
                        // a/b < x/c < d/e -> 1/3 < x/12 < 3/4 -> 4/12 < x/12 < 9/12 -> x thuộc {5, 6, 7, 8}
                        questionText = `Tìm tập hợp các số nguyên $x$ thỏa mãn điều kiện so sánh: $\\frac{1}{3} < \\frac{x}{12} < \\frac{3}{4}$.`;
                        options = [
                            `$x \\in \\{5; 6; 7; 8\\}$`,
                            `$x \\in \\{4; 5; 6; 7; 8; 9\\}$`,
                            `$x \\in \\{5; 6; 7\\}$`,
                            `$x \\in \\{6; 7; 8\\}$`
                        ];
                        hints = [
                            `Quy đồng mẫu số của các phân số về mẫu số chung là $12$.`,
                            `Ta có: $\\frac{1}{3} = \\frac{4}{12}$ và $\\frac{3}{4} = \\frac{9}{12}$.`,
                            `Thay vào biểu thức ta được: $\\frac{4}{12} < \\frac{x}{12} < \\frac{9}{12}$. Từ đó tìm các số nguyên $x$ nằm giữa $4$ và $9$.`
                        ];
                        solutionHtml = `Ta quy đồng mẫu số của các phân số về mẫu số chung là $12$:<br>$\\frac{1}{3} = \\frac{1 \\cdot 4}{3 \\cdot 4} = \\frac{4}{12}$.<br>$\\frac{3}{4} = \\frac{3 \\cdot 3}{4 \\cdot 3} = \\frac{9}{12}$.<br>Thay vào điều kiện đề bài ta có:<br>$\\frac{4}{12} < \\frac{x}{12} < \\frac{9}{12} \\rightarrow 4 < x < 9$.<br>Vì $x$ là số nguyên nên $x \\in \\{5; 6; 7; 8\\}$.`;
                    }
                    tip = "Với các bài toán tìm x kẹp giữa hai phân số, hãy quy đồng mẫu số rồi so sánh các tử số.";
                }
                break;
            }
            case "cong-tru-phan-so": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = this.randomInt(1, 4);
                        const b = 5;
                        const c = this.randomInt(1, 3);
                        const d = 5;
                        const resNum = a + c;
                        questionText = `Tính tổng: $S = \\frac{${a}}{${b}} + \\frac{${c}}{${d}}$.`;
                        // Tránh trùng khi a*c = a+c (ví dụ a=2,c=2): dùng a*c+1
                        const w3CongPhanSo = (a * c === resNum || a * c === Math.abs(a - c)) ? a * c + 1 : a * c;
                        // Tránh trùng khi Math.abs(a-c) = resNum hoặc = w3CongPhanSo
                        const w4CongPhanSo = (Math.abs(a-c) === resNum || Math.abs(a-c) === w3CongPhanSo) ? Math.abs(a-c) + 1 : Math.abs(a-c);
                        options = [`$\\frac{${resNum}}{5}$`, `$\\frac{${a+c}}{10}$`, `$\\frac{${w3CongPhanSo}}{5}$`, `$\\frac{${w4CongPhanSo}}{5}$`];
                        hints = [
                            `Hai phân số này có cùng mẫu số là $5$.`,
                            `Muốn cộng hai phân số cùng mẫu, ta cộng các tử số và giữ nguyên mẫu số.`,
                            `Tử mới là $${a} + ${c} = ${resNum}$.`
                        ];
                        solutionHtml = `Vì hai phân số cùng mẫu, ta có: $S = \\frac{${a} + ${c}}{5} = \\frac{${resNum}}{5}$.`;
                    } else {
                        const a = this.randomInt(1, 3);
                        const b = 7;
                        const c = this.randomInt(4, 6);
                        const resNum = a - c; // Số âm
                        questionText = `Tính kết quả của phép trừ sau: $S = \\frac{${a}}{${b}} - \\frac{${c}}{${b}}$.`;
                        options = [`$\\frac{${resNum}}{${b}}$`, `$\\frac{${Math.abs(resNum)}}{${b}}$`, `$\\frac{${resNum}}{0}$`, `$\\frac{${a+c}}{${b}}$`];
                        hints = [
                            `Hai phân số này cùng mẫu số là $${b}$.`,
                            `Ta lấy tử số của phân số thứ nhất trừ đi tử số của phân số thứ hai và giữ nguyên mẫu số.`,
                            `Phép tính tử số: $${a} - ${c}$ sẽ ra một số nguyên âm.`
                        ];
                        solutionHtml = `Ta giữ nguyên mẫu số là $${b}$ và thực hiện trừ các tử số:<br>$S = \\frac{${a} - ${c}}{${b}} = \\frac{${resNum}}{${b}}$.`;
                    }
                    tip = "Đừng bao giờ cộng hoặc trừ các mẫu số với nhau! Giữ nguyên mẫu chung và thực hiện phép tính trên tử số.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const a = 1;
                        const b = 3;
                        const c = 1;
                        const d = 2;
                        questionText = `Tính kết quả của phép tính: $P = \\frac{${a}}{${b}} - \\frac{${c}}{${d}}$.`;
                        options = [`$\\frac{-1}{6}$`, `$\\frac{1}{6}$`, `$0$`, `$\\frac{0}{1}$`];
                        hints = [
                            `Quy đồng mẫu số hai phân số về mẫu chung là $6$.`,
                            `$\\frac{1}{3} = \\frac{2}{6}$ và $\\frac{1}{2} = \\frac{3}{6}$.`,
                            `Thực hiện phép trừ tử số: $2 - 3 = -1$.`
                        ];
                        solutionHtml = `Mẫu số chung là $6$. Quy đồng và thực hiện phép tính:<br>$P = \\frac{1 \\cdot 2}{3 \\cdot 2} - \\frac{1 \\cdot 3}{2 \\cdot 3} = \\frac{2}{6} - \\frac{3}{6} = \\frac{2 - 3}{6} = \\frac{-1}{6}$.`;
                    } else {
                        const a = 1;
                        const b = 4;
                        const c = 5;
                        const d = 8;
                        // Tìm x biết: x - a/b = c/d -> x = c/d + a/b = 5/8 + 1/4 = 5/8 + 2/8 = 7/8
                        const ansNum = 7;
                        const ansDen = 8;
                        questionText = `Tìm số nguyên hoặc phân số $x$, biết: $x - \\frac{${a}}{${b}} = \\frac{${c}}{${d}}$.`;
                        options = [`$x = \\frac{${ansNum}}{${ansDen}}$`, `$x = \\frac{3}{8}$`, `$x = \\frac{9}{8}$`, `$x = \\frac{1}{2}$`];
                        hints = [
                            `Để tìm số bị trừ $x$, ta lấy hiệu cộng với số trừ.`,
                            `Công thức: $x = \\frac{${c}}{${d}} + \\frac{${a}}{${b}}$.`,
                            `Quy đồng hai phân số về mẫu số chung là $8$ rồi cộng lại.`
                        ];
                        solutionHtml = `Ta chuyển vế phân số để tìm $x$:<br>$x = \\frac{${c}}{${d}} + \\frac{${a}}{${b}}$<br>Quy đồng phân số $\\frac{${a}}{${b}}$ với mẫu số chung là $8$:<br>$\\frac{${a}}{${b}} = \\frac{${a} \\cdot 2}{${b} \\cdot 2} = \\frac{2}{8}$.<br>Thực hiện phép cộng:<br>$x = \\frac{5}{8} + \\frac{2}{8} = \\frac{7}{8}$.`;
                    }
                    tip = "Khi giải bài toán tìm x chứa phân số, áp dụng đúng quy tắc tìm số hạng chưa biết như đối với số tự nhiên.";
                } else { // kho
                    if (variant === 1) {
                        const n = this.randomInt(8, 12);
                        // A = 1/(1.3) + 1/(3.5) + ... + 1/((2n-1)(2n+1))
                        // A = 1/2 * (1/1 - 1/3 + 1/3 - 1/5 + ... + 1/(2n-1) - 1/(2n+1)) = 1/2 * (1 - 1/(2n+1)) = n/(2n+1)
                        const correctValNum = n;
                        const correctValDen = 2 * n + 1;
                        questionText = `Tính nhanh tổng sau: $A = \\frac{1}{1 \\cdot 3} + \\frac{1}{3 \\cdot 5} + \\frac{1}{5 \\cdot 7} + ... + \\frac{1}{${2 * n - 1} \\cdot ${2 * n + 1}}$.`;
                        options = [
                            `$\\frac{${correctValNum}}{${correctValDen}}$`,
                            `$\\frac{1}{${correctValDen}}$`,
                            `$\\frac{${n - 1}}{${2 * n - 1}}$`,
                            `$\\frac{${2 * n}}{${correctValDen}}$`
                        ];
                        hints = [
                            `Nhận xét khoảng cách giữa các thừa số ở mẫu số là $2$.`,
                            `Ta viết: $\\frac{2}{k(k+2)} = \\frac{1}{k} - \\frac{1}{k+2}$.`,
                            `Nhân cả hai vế của tổng $A$ với $2$ hoặc biến đổi từng số hạng thành: $\\frac{1}{2} \\cdot \\left( \\frac{1}{k} - \\frac{1}{k+2} \\right)$.`
                        ];
                        solutionHtml = `Nhận xét: Khoảng cách giữa các thừa số dưới mẫu là $2$. Ta có:<br>$\\frac{1}{k(k+2)} = \\frac{1}{2} \\cdot \\left( \\frac{1}{k} - \\frac{1}{k+2} \\right)$.<br>Áp dụng vào biểu thức $A$ ta được:<br>$A = \\frac{1}{2} \\cdot \\left( 1 - \\frac{1}{3} + \\frac{1}{3} - \\frac{1}{5} + \\frac{1}{5} - \\frac{1}{7} + ... + \\frac{1}{${2 * n - 1}} - \\frac{1}{${2 * n + 1}} \\right)$<br>Các số hạng ở giữa tự triệt tiêu nhau, ta được:<br>$A = \\frac{1}{2} \\cdot \\left( 1 - \\frac{1}{${2 * n + 1}} \\right) = \\frac{1}{2} \\cdot \\frac{${2 * n}}{${2 * n + 1}} = \\frac{${n}}{${2 * n + 1}}$.`;
                    } else {
                        // Tính nhanh biểu thức: B = (1/2 + 1/3 + 1/4 + ... + 1/10) - (2/3 + 3/4 + 4/5 + ... + 9/10)? Không, nhóm biểu thức đối nhau:
                        // B = -5/9 + 8/15 + -4/9 + 7/15 = (-5/9 + -4/9) + (8/15 + 7/15) = -1 + 1 = 0
                        questionText = `Tính nhanh giá trị biểu thức: $B = \\frac{-5}{11} + \\frac{8}{17} + \\frac{-6}{11} + \\frac{9}{17}$.`;
                        options = [`$0$`, `$1$`, `$-1$`, `$\\frac{2}{11}$`];
                        hints = [
                            `Sử dụng tính chất giao hoán và kết hợp của phép cộng phân số để nhóm các phân số có cùng mẫu số với nhau.`,
                            `Nhóm: $\\left(\\frac{-5}{11} + \\frac{-6}{11}\\right)$ và $\\left(\\frac{8}{17} + \\frac{9}{17}\\right)$.`,
                            `Tính tổng của từng nhóm rồi cộng các kết quả lại.`
                        ];
                        solutionHtml = `Áp dụng tính chất giao hoán và kết hợp để nhóm các phân số cùng mẫu:<br>$B = \\left( \\frac{-5}{11} + \\frac{-6}{11} \\right) + \\left( \\frac{8}{17} + \\frac{9}{17} \\right)$<br>Ta tính từng ngoặc:<br>$\\frac{-5 - 6}{11} = \\frac{-11}{11} = -1$.<br>$\\frac{8 + 9}{17} = \\frac{17}{17} = 1$.<br>Cộng hai kết quả lại:<br>$B = -1 + 1 = 0$.`;
                    }
                    tip = "Với các bài toán tính tổng nhiều phân số, hãy tìm các cặp phân số có cùng mẫu để nhóm lại tính nhanh.";
                }
                break;
            }
            case "nhan-chia-phan-so": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = this.randomInt(2, 4);
                        const b = 5;
                        const c = 3;
                        const d = 7;
                        const num = a * c;
                        const den = b * d;
                        questionText = `Tính tích: $T = \\frac{${a}}{${b}} \\cdot \\frac{${c}}{${d}}$.`;
                        options = [`$\\frac{${num}}{${den}}$`, `$\\frac{${a+c}}{${b+d}}$`, `$\\frac{${a*d}}{${b*c}}$`, `$\\frac{${num+1}}{${den}}$`];
                        hints = [
                            `Muốn nhân hai phân số, ta nhân các tử số với nhau và nhân các mẫu số với nhau.`,
                            `Tử số mới: $${a} \\cdot ${c} = ${num}$.`,
                            `Mẫu số mới: $${b} \\cdot ${d} = ${den}$.`
                        ];
                        solutionHtml = `Áp dụng quy tắc nhân phân số: $T = \\frac{${a} \\cdot ${c}}{${b} \\cdot ${d}} = \\frac{${num}}{${den}}$.`;
                    } else {
                        const a = this.randomInt(3, 5);
                        const b = this.randomInt(6, 9);
                        const c = -this.randomInt(2, 4);
                        // a/b * c. Ví dụ 3/8 * (-4) = -12/8 = -3/2
                        const num = a * c;
                        const common = this.gcd(Math.abs(num), b);
                        const ansNum = num / common;
                        const ansDen = b / common;
                        questionText = `Tính tích của phân số với số nguyên: $T = \\frac{${a}}{${b}} \\cdot (${c})$.`;
                        options = [
                            `$\\frac{${ansNum}}{${ansDen}}$`,
                            `$\\frac{${num}}{${b + c}}$`,
                            `$\\frac{${a + c}}{${b}}$`,
                            `$\\frac{${ansNum - 1}}{${ansDen}}$`
                        ];
                        hints = [
                            `Viết số nguyên $${c}$ dưới dạng phân số có mẫu là 1: $\\frac{${c}}{1}$.`,
                            `Nhân tử với tử, mẫu với mẫu: $\\frac{${a} \\cdot (${c})}{${b} \\cdot 1} = \\frac{${num}}{${b}}$.`,
                            `Rút gọn phân số kết quả về dạng tối giản bằng cách chia cả tử và mẫu cho ước chung lớn nhất.`
                        ];
                        solutionHtml = `Ta viết $${c} = \\frac{${c}}{1}$. Nhân hai phân số:<br>$T = \\frac{${a}}{${b}} \\cdot \\frac{${c}}{1} = \\frac{${a} \\cdot (${c})}{${b}} = \\frac{${num}}{${b}}$.<br>Ước chung lớn nhất của $${Math.abs(num)}$ và $${b}$ là $${common}$. Rút gọn phân số ta được: $T = \\frac{${ansNum}}{${ansDen}}$.`;
                    }
                    tip = "Khi nhân phân số với một số nguyên, ta nhân số nguyên đó với tử số và giữ nguyên mẫu số.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const a = 2;
                        const b = 3;
                        const c = 4;
                        const d = 5;
                        questionText = `Thực hiện phép tính chia phân số: $K = \\frac{${a}}{${b}} : \\frac{${c}}{${d}}$.`;
                        options = [`$\\frac{5}{6}$`, `$\\frac{8}{15}$`, `$\\frac{6}{5}$`, `$\\frac{15}{8}$`];
                        hints = [
                            `Muốn chia một phân số cho một phân số khác khác không, ta nhân phân số thứ nhất với số nghịch đảo của phân số thứ hai.`,
                            `Số nghịch đảo của $\\frac{${c}}{${d}}$ là $\\frac{${d}}{${c}}$.`,
                            `Phép tính trở thành: $\\frac{${a}}{${b}} \\cdot \\frac{${d}}{${c}}$.`
                        ];
                        solutionHtml = `Ta nghịch đảo phân số thứ hai và thực hiện nhân:<br>$K = \\frac{${a}}{${b}} \\cdot \\frac{${d}}{${c}} = \\frac{${a} \\cdot ${d}}{${b} \\cdot ${c}} = \\frac{10}{12}$.<br>Rút gọn cả tử và mẫu cho 2 ta được: $K = \\frac{5}{6}$.`;
                    } else {
                        const a = this.randomInt(2, 4);
                        const b = this.randomInt(5, 7);
                        const c = this.randomInt(3, 5);
                        // x : a/b = c -> x = c * a/b
                        const num = c * a;
                        const common = this.gcd(num, b);
                        const ansNum = num / common;
                        const ansDen = b / common;
                        
                        questionText = `Tìm $x$, biết: $x : \\frac{${a}}{${b}} = ${c}$.`;
                        options = [
                            `$x = \\frac{${ansNum}}{${ansDen}}$`,
                            `$x = \\frac{${a}}{${b * c}}$`,
                            `$x = \\frac{${c * b}}{${a}}$`,
                            `$x = \\frac{${ansNum + 1}}{${ansDen}}$`
                        ];
                        hints = [
                            `Để tìm số bị chia $x$, ta lấy thương nhân với số chia.`,
                            `Hệ thức: $x = ${c} \\cdot \\frac{${a}}{${b}}$.`,
                            `Tính toán và rút gọn phân số kết quả.`
                        ];
                        solutionHtml = `Từ phương trình $x : \\frac{${a}}{${b}} = ${c}$, ta suy ra:<br>$x = ${c} \\cdot \\frac{${a}}{${b}} = \\frac{${c} \\cdot ${a}}{${b}} = \\frac{${num}}{${b}}$.<br>Rút gọn phân số bằng cách chia cả tử và mẫu cho $\\text{UCLN}(${num}; ${b}) = ${common}$, ta được:<br>$x = \\frac{${ansNum}}{${ansDen}}$.`;
                    }
                    tip = "Nhớ nghịch đảo phân số khi làm phép chia và rút gọn kết quả về dạng tối giản.";
                } else { // kho
                    if (variant === 1) {
                        const baseNum = this.randomInt(3, 6);
                        const baseDen = this.randomInt(7, 10);
                        const n1 = this.randomInt(2, 4);
                        const n2 = this.randomInt(5, 8);
                        // M = baseNum/baseDen * n1/(n1+n2) + baseNum/baseDen * n2/(n1+n2) - baseNum/baseDen = 0
                        questionText = `Tính nhanh biểu thức sau: $M = \\frac{${baseNum}}{${baseDen}} \\cdot \\frac{${n1}}{${n1 + n2}} + \\frac{${baseNum}}{${baseDen}} \\cdot \\frac{${n2}}{${n1 + n2}} - \\frac{${baseNum}}{${baseDen}}$.`;
                        options = [`$0$`, `$\\frac{${baseNum}}{${baseDen}}$`, `$1$`, `$\\frac{2 \\cdot ${baseNum}}{${baseDen}}$`];
                        hints = [
                            `Áp dụng tính chất phân phối của phép nhân đối với phép cộng và trừ: $a \\cdot b + a \\cdot c - a = a(b + c - 1)$.`,
                            `Đặt thừa số chung là $\\frac{${baseNum}}{${baseDen}}$ ra ngoài dấu ngoặc.`,
                            `Tính tổng trong ngoặc: $\\frac{${n1}}{${n1+n2}} + \\frac{${n2}}{${n1+n2}} - 1$.`
                        ];
                        solutionHtml = `Ta đặt thừa số chung $\\frac{${baseNum}}{${baseDen}}$ ra ngoài dấu ngoặc:<br>$M = \\frac{${baseNum}}{${baseDen}} \\cdot \\left( \\frac{${n1}}{${n1+n2}} + \\frac{${n2}}{${n1+n2}} - 1 \\right)$<br>Tính giá trị trong ngoặc:<br>$\\frac{${n1} + ${n2}}{${n1+n2}} - 1 = 1 - 1 = 0$.<br>Do đó:<br>$M = \\frac{${baseNum}}{${baseDen}} \\cdot 0 = 0$.`;
                    } else {
                        const n = this.randomInt(25, 35);
                        // P = (1 - 1/2) * (1 - 1/3) * ... * (1 - 1/n) = 1/2 * 2/3 * ... * (n-1)/n = 1/n
                        questionText = `Tính nhanh tích của dãy số sau: $P = \\left(1 - \\frac{1}{2}\\right) \\cdot \\left(1 - \\frac{1}{3}\\right) \\cdot \\left(1 - \\frac{1}{4}\\right) \\cdot ... \\cdot \\left(1 - \\frac{1}{${n}}\\right)$.`;
                        options = [
                            `$\\frac{1}{${n}}$`,
                            `$\\frac{${n - 1}}{${n}}$`,
                            `$\\frac{1}{2}$`,
                            `$\\frac{2}{${n}}$`
                        ];
                        hints = [
                            `Tính giá trị trong từng dấu ngoặc trước.`,
                            `Ta có: $1 - \\frac{1}{2} = \\frac{1}{2}$, $1 - \\frac{1}{3} = \\frac{2}{3}$, $1 - \\frac{1}{4} = \\frac{3}{4}$, ..., $1 - \\frac{1}{${n}} = \\frac{${n-1}}{${n}}$.`,
                            `Viết lại tích dưới dạng các phân số nhân nhau và rút gọn các tử số và mẫu số chéo nhau.`
                        ];
                        solutionHtml = `Tính giá trị trong mỗi dấu ngoặc ta được:<br>$P = \\frac{1}{2} \\cdot \\frac{2}{3} \\cdot \\frac{3}{4} \\cdot ... \\cdot \\frac{${n-1}}{${n}}$<br>Ta nhận thấy tử số của phân số sau triệt tiêu mẫu số của phân số trước:<br>Số $2$ ở tử phân số thứ hai triệt tiêu số $2$ ở mẫu phân số thứ nhất, số $3$ triệt tiêu số $3$,..., số $${n-1}$ triệt tiêu số $${n-1}$.<br>Kết quả cuối cùng chỉ còn tử số đầu tiên là $1$ và mẫu số cuối cùng là $${n}$.<br>Vậy $P = \\frac{1}{${n}}$.`;
                    }
                    tip = "Với tích của nhiều dấu ngoặc có dạng (1 - 1/k), hãy tính kết quả từng ngoặc rồi thực hiện rút gọn chéo liên tiếp.";
                }
                break;
            }
            case "hai-bai-toan-phan-so": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const rateDen = this.randomInt(5, 8);
                        let rateNum = this.randomInt(2, rateDen - 1);
                        while (this.gcd(rateNum, rateDen) !== 1) {
                            rateNum = this.randomInt(2, rateDen - 1);
                        }
                        const total = rateDen * this.randomInt(5, 8);
                        const correctVal = (total * rateNum) / rateDen;
                        
                        questionText = `Lớp 6A có $${total}$ học sinh, trong đó có $\\frac{${rateNum}}{${rateDen}}$ số học sinh là học sinh nữ. Tính số học sinh nữ của lớp 6A.`;
                        options = [`$${correctVal}$ học sinh`, `$${total - correctVal}$ học sinh`, `$${correctVal + 3}$ học sinh`, `$${correctVal - 2}$ học sinh`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomOpt = `$${this.randomInt(10, total - 5)}$ học sinh`;
                            if (!options.includes(randomOpt)) options.push(randomOpt);
                        }
                        this.shuffle(options);
                        
                        hints = [
                            `Đây là bài toán tìm giá trị phân số của một số cho trước.`,
                            `Muốn tìm $\\frac{m}{n}$ của số $a$, ta lấy $a$ nhân với $\\frac{m}{n}$.`,
                            `Số học sinh nữ bằng: $${total} \\cdot \\frac{${rateNum}}{${rateDen}}$.`
                        ];
                        solutionHtml = `Số học sinh nữ của lớp 6A là:<br>$${total} \\cdot \\frac{${rateNum}}{${rateDen}} = \\frac{${total} \\cdot ${rateNum}}{${rateDen}} = ${correctVal}$ học sinh.`;
                    } else {
                        const totalPages = 150;
                        const rateDen = 5;
                        const rateNum = 2; // ngày một đọc 2/5 trang -> 60 trang. Còn lại 90 trang
                        const readPages = (totalPages * rateNum) / rateDen;
                        const leftPages = totalPages - readPages;
                        
                        questionText = `Bình Minh đọc một cuốn truyện dày $${totalPages}$ trang. Ngày đầu tiên con đọc được $\\frac{${rateNum}}{${rateDen}}$ tổng số trang sách. Tính số trang sách còn lại con chưa đọc.`;
                        options = [
                            `$${leftPages}$ trang`,
                            `$${readPages}$ trang`,
                            `$${leftPages - 10}$ trang`,
                            `$${leftPages + 15}$ trang`
                        ];
                        this.shuffle(options);
                        
                        hints = [
                            `Tính số trang sách Bình Minh đã đọc trong ngày đầu tiên: lấy tổng số trang nhân với $\\frac{${rateNum}}{${rateDen}}$.`,
                            `Số trang sách đã đọc là: $${totalPages} \\cdot \\frac{${rateNum}}{${rateDen}}$.`,
                            `Để tính số trang còn lại, lấy tổng số trang cuốn sách trừ đi số trang đã đọc.`
                        ];
                        solutionHtml = `Số trang sách Bình Minh đã đọc trong ngày đầu tiên là:<br>$${totalPages} \\cdot \\frac{${rateNum}}{${rateDen}} = ${readPages}$ trang.<br>Số trang sách còn lại con chưa đọc là:<br>$${totalPages} - ${readPages} = ${leftPages}$ trang.`;
                    }
                    tip = "Đọc kỹ câu hỏi xem bài toán yêu cầu tìm lượng đã thực hiện hay lượng còn lại để thực hiện thêm bước trừ.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const rateDen = this.randomInt(3, 6);
                        let rateNum = this.randomInt(2, rateDen - 1);
                        while (this.gcd(rateNum, rateDen) !== 1) {
                            rateNum = this.randomInt(2, rateDen - 1);
                        }
                        const correctVal = rateDen * this.randomInt(4, 8);
                        const val = (correctVal * rateNum) / rateDen;
                        
                        questionText = `Tìm một số biết $\\frac{${rateNum}}{${rateDen}}$ của số đó bằng $${val}$.`;
                        options = [`$${correctVal}$`, `$${correctVal + 6}$`, `$${correctVal - 4}$`, `$${val}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomOpt = `$${this.randomInt(10, 50)}$`;
                            if (!options.includes(randomOpt)) options.push(randomOpt);
                        }
                        this.shuffle(options);
                        
                        hints = [
                            `Đây là bài toán tìm một số khi biết giá trị phân số của nó.`,
                            `Muốn tìm một số khi biết $\\frac{m}{n}$ của nó bằng $b$, ta lấy $b : \\frac{m}{n}$.`,
                            `Số cần tìm là: $${val} : \\frac{${rateNum}}{${rateDen}}$.`
                        ];
                        solutionHtml = `Số cần tìm là:<br>$${val} : \\frac{${rateNum}}{${rateDen}} = ${val} \\cdot \\frac{${rateDen}}{${rateNum}} = ${correctVal}$.`;
                    } else {
                        const totalLength = 60;
                        const cutLength = 24; // Cắt đi 24m thì còn lại 36m (3/5 chiều dài ban đầu).
                        // Cắt đi ứng với 2/5 chiều dài ban đầu.
                        questionText = `Một tấm vải sau khi cắt bớt đi $${cutLength}\\text{ m}$ thì chiều dài còn lại bằng $\\frac{3}{5}$ chiều dài ban đầu của tấm vải. Tính chiều dài ban đầu của tấm vải đó.`;
                        options = [
                            `$${totalLength}\\text{ m}$`,
                            `$${totalLength - 10}\\text{ m}$`,
                            `$${totalLength + 20}\\text{ m}$`,
                            `$36\\text{ m}$`
                        ];
                        this.shuffle(options);
                        
                        hints = [
                            `Coi chiều dài ban đầu của tấm vải là $1$ phần nguyên.`,
                            `Phân số biểu thị số mét vải bị cắt đi là: $1 - \\frac{3}{5}$.`,
                            `Số $${cutLength}\\text{ m}$ vải bị cắt đi tương ứng với phân số $\\frac{2}{5}$ chiều dài ban đầu.`,
                            `Tìm chiều dài ban đầu: lấy số mét vải bị cắt chia cho phân số tương ứng đó.`
                        ];
                        solutionHtml = `Coi chiều dài ban đầu của tấm vải là $1$ (đơn vị).<br>Phân số biểu thị số mét vải bị cắt đi là:<br>$1 - \\frac{3}{5} = \\frac{2}{5}$ (chiều dài tấm vải).<br>Vì cắt đi $${cutLength}\\text{ m}$ nên $${cutLength}\\text{ m}$ này tương ứng với $\\frac{2}{5}$ chiều dài ban đầu.<br>Chiều dài ban đầu của tấm vải là:<br>$${cutLength} : \\frac{2}{5} = ${cutLength} \\cdot \\frac{5}{2} = ${totalLength}\\text{ m}$.`;
                    }
                    tip = "Xác định phân số tương ứng với đại lượng đã cho (số mét vải cắt đi) rồi dùng phép chia để tìm tổng thể ban đầu.";
                } else { // kho
                    if (variant === 1) {
                        const config = this.randomInt(0, 1);
                        let n, p, q, r, T, solutionSteps;
                        
                        if (config === 0) {
                            n = 3; p = 3; q = 4; // còn lại 1/6
                            r = 10000 * this.randomInt(1, 5);
                            T = r * 6;
                            solutionSteps = `Sau ngày thứ nhất, phân số chỉ số tiền còn lại là:<br>$1 - \\frac{1}{3} = \\frac{2}{3}$ (số tiền ban đầu).<br>Phân số chỉ số tiền mua ngày thứ hai là:<br>$\\frac{3}{4} \\cdot \\frac{2}{3} = \\frac{1}{2}$ (số tiền ban đầu).<br>Phân số chỉ số tiền còn lại sau hai ngày là:<br>$1 - \\left( \\frac{1}{3} + \\frac{1}{2} \\right) = \\frac{1}{6}$ (số tiền ban đầu).<br>Số tiền ban đầu là: $${r.toLocaleString('vi-VN')} : \\frac{1}{6} = ${T.toLocaleString('vi-VN')}$ đồng.`;
                        } else {
                            n = 4; p = 2; q = 3; // còn lại 1/4
                            r = 10000 * this.randomInt(1, 5);
                            T = r * 4;
                            solutionSteps = `Sau ngày thứ nhất, phân số chỉ số tiền còn lại là:<br>$1 - \\frac{1}{4} = \\frac{3}{4}$ (số tiền ban đầu).<br>Phân số chỉ số tiền mua ngày thứ hai là:<br>$\\frac{2}{3} \\cdot \\frac{3}{4} = \\frac{1}{2}$ (số tiền ban đầu).<br>Phân số chỉ số tiền còn lại sau hai ngày là:<br>$1 - \\left( \\frac{1}{4} + \\frac{1}{2} \\right) = \\frac{1}{4}$ (số tiền ban đầu).<br>Số tiền ban đầu là: $${r.toLocaleString('vi-VN')} : \\frac{1}{4} = ${T.toLocaleString('vi-VN')}$ đồng.`;
                        }
                        
                        questionText = `Bình Minh mang một số tiền đi mua sách. Ngày thứ nhất con mua hết $\\frac{1}{${n}}$ số tiền. Ngày thứ hai con mua hết $\\frac{${p}}{${q}}$ **số tiền còn lại**. Sau hai ngày mua sắm, con còn lại $${r.toLocaleString('vi-VN')}$ đồng. Hỏi ban đầu Bình Minh mang đi bao nhiêu tiền?`;
                        options = [
                            `$${T.toLocaleString('vi-VN')}$ đồng`,
                            `$${(T - r).toLocaleString('vi-VN')}$ đồng`,
                            `$${(T + 30000).toLocaleString('vi-VN')}$ đồng`,
                            `$${(T * 1.5).toLocaleString('vi-VN')}$ đồng`
                        ];
                        this.shuffle(options);
                        
                        hints = [
                            `Sau ngày thứ nhất, phân số chỉ số tiền còn lại là: $1 - \\frac{1}{${n}}$ số tiền ban đầu.`,
                            `Ngày thứ hai mua $\\frac{${p}}{${q}}$ của số tiền còn lại, nhân hai phân số đó lại để biết phần tiền ngày hai so với ban đầu.`,
                            `Tìm tổng phân số tiền đã mua trong 2 ngày, lấy 1 trừ đi để biết phân số chỉ số tiền còn lại tương ứng với $${r.toLocaleString('vi-VN')}$ đồng.`
                        ];
                        solutionHtml = solutionSteps;
                    } else {
                        // Vòi nước chảy chung - chảy riêng
                        // Vòi 1: 4h đầy bể -> 1h chảy 1/4 bể. Vòi 2: 6h đầy bể -> 1h chảy 1/6 bể.
                        // Cả hai vòi trong 1h: 1/4 + 1/6 = 5/12 bể.
                        // Thời gian đầy bể: 1 : 5/12 = 12/5 giờ = 2 giờ 24 phút.
                        questionText = `Có hai vòi nước cùng chảy vào một bể cạn không có nước. Nếu chảy riêng, vòi thứ nhất chảy đầy bể trong $4\\text{ giờ}$, vòi thứ hai chảy đầy bể trong $6\\text{ giờ}$. Hỏi nếu cả hai vòi cùng mở đồng thời từ đầu thì sau bao lâu bể sẽ đầy nước?`;
                        options = [
                            `$2\\text{ giờ } 24\\text{ phút}$`,
                            `$5\\text{ giờ}$`,
                            `$2\\text{ giờ } 30\\text{ phút}$`,
                            `$3\\text{ giờ}$`
                        ];
                        hints = [
                            `Tính xem trong 1 giờ, mỗi vòi chảy được bao nhiêu phần của bể (lấy 1 chia cho số giờ đầy bể).`,
                            `Vòi thứ nhất chảy được $\\frac{1}{4}$ bể trong 1 giờ. Vòi thứ hai chảy được $\\frac{1}{6}$ bể trong 1 giờ.`,
                            `Cộng hai phân số để biết lượng nước cả hai vòi chảy được trong 1 giờ.`,
                            `Thời gian để đầy bể bằng $1$ chia cho lượng nước chảy được của cả hai vòi trong 1 giờ. Đổi kết quả phân số giờ sang giờ và phút.`
                        ];
                        solutionHtml = `Trong $1\\text{ giờ}$, vòi thứ nhất chảy được:<br>$1 : 4 = \\frac{1}{4}$ (bể).<br>Trong $1\\text{ giờ}$, vòi thứ hai chảy được:<br>$1 : 6 = \\frac{1}{6}$ (bể).<br>Trong $1\\text{ giờ}$, cả hai vòi cùng chảy được:<br>$\\frac{1}{4} + \\frac{1}{6} = \\frac{3}{12} + \\frac{2}{12} = \\frac{5}{12}$ (bể).<br>Thời gian để cả hai vòi chảy đầy bể là:<br>$1 : \\frac{5}{12} = \\frac{12}{5}\\text{ giờ}$.<br>Đổi sang đơn vị thời gian:<br>$\\frac{12}{5}\\text{ giờ} = 2\\frac{2}{5}\\text{ giờ} = 2\\text{ giờ} + \\frac{2}{5} \\cdot 60\\text{ phút} = 2\\text{ giờ } 24\\text{ phút}$.`;
                    }
                    tip = "Hãy phân biệt giữa 'phân số của tổng số' và 'phân số của số còn lại' để nhân đúng.";
                }
                break;
            }
            case "so-thap-phan": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const isNeg = Math.random() > 0.5;
                        const num = this.randomInt(11, 99) * (isNeg ? -1 : 1);
                        const dens = [10, 100, 1000];
                        const den = dens[this.randomInt(0, 2)];
                        const ansVal = (num / den).toString().replace('.', ',');
                        
                        questionText = `Viết phân số thập phân $\\frac{${num}}{${den}}$ dưới dạng số thập phân.`;
                        options = [`$${ansVal}$`, `$${(num / (den === 10 ? 100 : 10)).toString().replace('.', ',')}$`, `$${(-num / den).toString().replace('.', ',')}$`, `$${(num * 10 / den).toString().replace('.', ',')}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomVal = (this.randomInt(1, 99) / 100 * (isNeg ? -1 : 1)).toFixed(2).replace('.', ',');
                            const opt = `$${randomVal}$`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        this.shuffle(options);
                        
                        hints = [
                            `Mẫu số là $${den}$ có bao nhiêu chữ số 0 thì phần thập phân sẽ có bấy nhiêu chữ số sau dấu phẩy.`,
                            `Nếu phân số là số âm, số thập phân cũng mang dấu âm.`
                        ];
                        solutionHtml = `Ta thực hiện phép chia tử số cho mẫu số:<br>$${num} : ${den} = ${ansVal}$.`;
                    } else {
                        // Viết số thập phân dưới dạng phân số tối giản
                        const val = [0.75, -1.25, 0.4, -0.6][this.randomInt(0, 3)];
                        const ansStr = val === 0.75 ? '\\frac{3}{4}' : (val === -1.25 ? '\\frac{-5}{4}' : (val === 0.4 ? '\\frac{2}{5}' : '\\frac{-3}{5}'));
                        const valStr = val.toString().replace('.', ',');
                        questionText = `Viết số thập phân $${valStr}$ dưới dạng phân số tối giản.`;
                        options = [`$${ansStr}$`, `$${ansStr.replace('-', '')}$`, `$${ansStr.replace('3', '6').replace('4', '8')}$`, `$${ansStr.replace('2', '4').replace('5', '10')}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomOpt = `$\\frac{${this.randomInt(1, 9)}}{${this.randomInt(2, 9)}}$`;
                            if (!options.includes(randomOpt)) options.push(randomOpt);
                        }
                        this.shuffle(options);
                        hints = [
                            `Viết số thập phân $${valStr}$ dưới dạng phân số có mẫu là lũy thừa của 10 (ví dụ: $10, 100$).`,
                            `Ví dụ: $0,75 = \\frac{75}{100}$.`,
                            `Rút gọn phân số bằng cách chia cả tử và mẫu cho ước chung lớn nhất của chúng.`
                        ];
                        solutionHtml = `Ta viết số thập phân dưới dạng phân số thập phân rồi rút gọn:<br>` + 
                            (val === 0.75 ? `$0,75 = \\frac{75}{100} = \\frac{75 : 25}{100 : 25} = \\frac{3}{4}$.` :
                            (val === -1.25 ? `$-1,25 = \\frac{-125}{100} = \\frac{-125 : 25}{100 : 25} = \\frac{-5}{4}$.` :
                            (val === 0.4 ? `$0,4 = \\frac{4}{10} = \\frac{4 : 2}{10 : 2} = \\frac{2}{5}$.` :
                            `$-0,6 = \\frac{-6}{10} = \\frac{-6 : 2}{10 : 2} = \\frac{-3}{5}$.`)));
                    }
                    tip = "Số chữ số ở phần thập phân tương ứng với số chữ số 0 ở mẫu số của phân số thập phân khi chuyển đổi.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const isNeg = Math.random() > 0.5;
                        const integerPart = this.randomInt(1, 40);
                        const decimalPart = this.randomInt(10, 99);
                        const valStr = `${isNeg ? '-' : ''}${integerPart},${decimalPart}`;
                        const oppStr = `${isNeg ? '' : '-'}${integerPart},${decimalPart}`;
                        
                        questionText = `Số đối của số thập phân $${valStr}$ là số nào?`;
                        options = [`$${oppStr}$`, `$${valStr}$`, `$${valStr.replace(',', ',0')}$`, `$${oppStr.replace(',', ',0')}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomVal = `${this.randomInt(1, 40)},${this.randomInt(10, 99)}`;
                            const opt = `$${randomVal}$`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        this.shuffle(options);
                        
                        hints = [
                            `Hai số đối nhau có tổng bằng 0 và nằm đối xứng qua điểm 0 trên trục số.`,
                            `Để tìm số đối của một số thập phân, ta chỉ cần đổi dấu của số đó.`
                        ];
                        solutionHtml = `Số đối của số thập phân $${valStr}$ là số $${oppStr}$ vì tổng của chúng bằng 0.`;
                    } else {
                        // Xác định hàng của chữ số trong số thập phân
                        const a = this.randomInt(10, 99);
                        const b = this.randomInt(1, 9);
                        const c = this.randomInt(1, 9);
                        const d = this.randomInt(1, 9);
                        const numStr = `${a},${b}${c}${d}`;
                        // Hỏi chữ số c ở hàng nào
                        questionText = `Trong số thập phân $A = ${numStr}$, chữ số $${c}$ nằm ở hàng nào?`;
                        options = [`Hàng phần trăm`, `Hàng phần mười`, `Hàng phần nghìn`, `Hàng đơn vị`];
                        hints = [
                            `Số thập phân gồm phần nguyên bên trái dấu phẩy và phần thập phân bên phải dấu phẩy.`,
                            `Từ trái sang phải sau dấu phẩy: chữ số đầu tiên ($${b}$) là hàng phần mười, chữ số thứ hai ($${c}$) là hàng phần trăm, chữ số thứ ba ($${d}$) là hàng phần nghìn.`
                        ];
                        solutionHtml = `Trong số thập phân $${numStr}$:<br>- Chữ số $${b}$ nằm ở vị trí thứ nhất sau dấu phẩy thuộc **hàng phần mười**.<br>- Chữ số $${c}$ nằm ở vị trí thứ hai sau dấu phẩy thuộc **hàng phần trăm**.<br>- Chữ số $${d}$ nằm ở vị trí thứ ba sau dấu phẩy thuộc **hàng phần nghìn**.`;
                    }
                    tip = "Các hàng của phần thập phân lần lượt là: phần mười (1/10), phần trăm (1/100), phần nghìn (1/1000).";
                } else { // kho
                    if (variant === 1) {
                        // Sắp xếp tăng dần các số thập phân âm có cùng phần nguyên
                        const aInt = this.randomInt(2, 5);
                        const dec1 = this.randomInt(10, 30);
                        const dec2 = this.randomInt(40, 60);
                        const dec3 = this.randomInt(70, 90);
                        
                        const labels = ['A', 'B', 'C'];
                        this.shuffle(labels);
                        
                        const values = {};
                        values[labels[0]] = `-${aInt},${dec2}`; // Vừa
                        values[labels[1]] = `-${aInt},${dec1}`; // Lớn nhất (số đối nhỏ nhất)
                        values[labels[2]] = `-${aInt},${dec3}`; // Nhỏ nhất (số đối lớn nhất)
                        
                        const smallest = labels[2];
                        const middle = labels[0];
                        const largest = labels[1];
                        const correctOrder = `$${smallest} < ${middle} < ${largest}$`;
                        
                        questionText = `Sắp xếp các số thập phân sau theo thứ tự **tăng dần**: $A = ${values['A']}$; $B = ${values['B']}$; $C = ${values['C']}$.`;
                        options = [
                            correctOrder,
                            `$${largest} < ${middle} < ${smallest}$`,
                            `$${middle} < ${smallest} < ${largest}$`,
                            `$${smallest} < ${largest} < ${middle}$`
                        ];
                        this.shuffle(options);
                        
                        hints = [
                            `So sánh các số thập phân âm: số âm nào có phần số dương càng lớn thì số đó càng nhỏ.`,
                            `Phần số dương tương ứng là: $${aInt},${dec3} > ${aInt},${dec2} > ${aInt},${dec1}$.`,
                            `Từ đó khi thêm dấu trừ, chiều so sánh sẽ đảo ngược lại.`
                        ];
                        solutionHtml = `So sánh phần số dương của các số ta có:<br>$${aInt},${dec3} > ${aInt},${dec2} > ${aInt},${dec1}$.<br>Do đó khi thêm dấu trừ, chiều so sánh đảo ngược lại:<br>$-${aInt},${dec3} < -${aInt},${dec2} < -${aInt},${dec1} \\rightarrow ${smallest} < ${middle} < ${largest}$.`;
                    } else {
                        // Tìm số nguyên x biết -2.5 < x < 1.2
                        const a = -2.5;
                        const b = 1.2;
                        questionText = `Tìm tập hợp tất cả các số nguyên $x$ thỏa mãn điều kiện: $-2,5 < x < 1,2$.`;
                        options = [
                            `$x \\in \\{-2; -1; 0; 1\\}$`,
                            `$x \\in \\{-2; -1; 0; 1; 2\\}$`,
                            `$x \\in \\{-3; -2; -1; 0; 1\\}$`,
                            `$x \\in \\{-1; 0; 1\\}$`
                        ];
                        hints = [
                            `Biểu diễn các số $-2,5$ và $1,2$ trên trục số.`,
                            `Các số nguyên kẹp giữa $-2,5$ và $1,2$ phải lớn hơn hoặc bằng $-2$ và nhỏ hơn hoặc bằng $1$.`,
                            `Liệt kê các số nguyên nằm trong khoảng đó.`
                        ];
                        solutionHtml = `Ta tìm các số nguyên $x$ sao cho $-2,5 < x < 1,2$.<br>- Các số nguyên lớn hơn $-2,5$ bắt đầu từ $-2$.<br>- Các số nguyên nhỏ hơn $1,2$ kết thúc ở $1$.<br>Do đó các số nguyên thỏa mãn là: $x \\in \\{-2; -1; 0; 1\\}$.`;
                    }
                    tip = "Hãy vẽ trục số để kiểm tra trực quan các số nguyên kẹp giữa các số thập phân âm và dương.";
                }
                break;
            }
            case "tinh-so-thap-phan": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = this.randomInt(51, 209) / 10;
                        const b = this.randomInt(211, 999) / 100;
                        const correctVal = (a + b).toFixed(2);
                        
                        const aStr = a.toString().replace('.', ',');
                        const bStr = b.toString().replace('.', ',');
                        const ansStr = correctVal.replace('.', ',');
                        
                        questionText = `Tính tổng: $S = ${aStr} + ${bStr}$.`;
                        options = [`$${ansStr}$`, `$${(a + b + 0.1).toFixed(2).replace('.', ',')}$`, `$${(a + b - 0.05).toFixed(2).replace('.', ',')}$`, `$${(a + b + 1.1).toFixed(2).replace('.', ',')}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomVal = (this.randomInt(100, 300) / 10).toFixed(2).replace('.', ',');
                            if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                        }
                        this.shuffle(options);
                        
                        hints = [
                            `Đặt phép tính thẳng hàng dấu phẩy: viết $${aStr}$ thành $${a.toFixed(2).replace('.', ',')}$ để có cùng số chữ số sau dấu phẩy.`,
                            `Cộng phần thập phân với nhau và cộng phần nguyên với nhau, nhớ dấu phẩy viết thẳng hàng.`
                        ];
                        solutionHtml = `Đặt tính thẳng hàng dấu phẩy:<br>&nbsp;&nbsp;${a.toFixed(2).replace('.', ',')}<br>+&nbsp;&nbsp;${bStr}<br>----------<br>&nbsp;&nbsp;${ansStr}`;
                    } else {
                        // Tính hiệu có số âm: S = -4,5 - 2,8
                        const a = this.randomInt(31, 79) / 10;
                        const b = this.randomInt(15, 29) / 10;
                        const correctVal = (-a - b).toFixed(1);
                        const aStr = `-${a.toString().replace('.', ',')}`;
                        const bStr = b.toString().replace('.', ',');
                        const ansStr = correctVal.replace('.', ',');
                        questionText = `Tính kết quả của phép tính: $S = ${aStr} - ${bStr}$.`;
                        options = [`$${ansStr}$`, `$${(-a + b).toFixed(1).replace('.', ',')}$`, `$${(a + b).toFixed(1).replace('.', ',')}$`, `$${(parseFloat(correctVal) - 1).toFixed(1).replace('.', ',')}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomVal = (-this.randomInt(50, 150) / 10).toFixed(1).replace('.', ',');
                            if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                        }
                        this.shuffle(options);
                        hints = [
                            `Ta có: $-a - b = -(a + b)$ với hai số dương $a, b$.`,
                            `Phép tính trở thành: $S = -(${a.toString().replace('.', ',')} + ${bStr})$.`,
                            `Cộng hai số thập phân dương rồi đặt dấu trừ trước kết quả.`
                        ];
                        solutionHtml = `Ta biến đổi biểu thức:<br>$S = ${aStr} - ${bStr} = -(${a.toString().replace('.', ',')} + ${bStr})$<br>Tính tổng hai số thập phân dương:<br>$${a.toString().replace('.', ',')} + ${bStr} = ${(a + b).toFixed(1).replace('.', ',')}$.<br>Vậy kết quả là: $S = ${ansStr}$.`;
                    }
                    tip = "Khi cộng hoặc trừ số thập phân, luôn viết thẳng hàng các dấu phẩy. Trừ hai số âm tương ứng với trừ đi tổng hai giá trị tuyệt đối.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const aList = [1.5, 2.5, 3.5, 4.5];
                        const bList = [-1.2, -1.6, -2.4];
                        const a = aList[this.randomInt(0, aList.length - 1)];
                        const b = bList[this.randomInt(0, bList.length - 1)];
                        const correctVal = (a * b).toFixed(2);
                        
                        const aStr = a.toString().replace('.', ',');
                        const bStr = b.toString().replace('.', ',');
                        const ansStr = parseFloat(correctVal).toString().replace('.', ',');
                        
                        questionText = `Tính tích: $P = ${aStr} \\cdot (${bStr})$.`;
                        options = [`$${ansStr}$`, `$${Math.abs(parseFloat(correctVal)).toString().replace('.', ',')}$`, `$${(parseFloat(correctVal) - 0.5).toFixed(1).replace('.', ',')}$`, `$${(parseFloat(correctVal) + 1.2).toFixed(1).replace('.', ',')}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomVal = (this.randomInt(-20, -2) / 2).toString().replace('.', ',');
                            if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                        }
                        this.shuffle(options);
                        
                        hints = [
                            `Nhân hai số trái dấu: kết quả chắc chắn sẽ mang dấu âm.`,
                            `Thực hiện phép nhân hai số thập phân dương rồi đặt dấu trừ trước kết quả.`
                        ];
                        solutionHtml = `Vì hai số trái dấu nên tích mang dấu âm. Thực hiện nhân phần số dương:<br>$${aStr} \\cdot ${bStr.replace('-', '')} = ${Math.abs(parseFloat(correctVal)).toString().replace('.', ',')}$.<br>Vậy tích là $${ansStr}$.`;
                    } else {
                        // Chia hai số thập phân: K = -7,5 : 2,5 = -3
                        const a = [4.5, 7.5, 9.6, 1.25][this.randomInt(0, 3)];
                        const b = [1.5, 2.5, 1.2, 0.5][this.randomInt(0, 3)];
                        const correctVal = (-a / b).toString().replace('.', ',');
                        const aStr = `-${a.toString().replace('.', ',')}`;
                        const bStr = b.toString().replace('.', ',');
                        questionText = `Tính thương: $K = ${aStr} : ${bStr}$.`;
                        options = [`$${correctVal}$`, `$${correctVal.replace('-', '')}$`, `$${(-a * b).toString().replace('.', ',')}$`, `$${(parseFloat(correctVal.replace(',', '.')) - 1).toString().replace('.', ',')}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomVal = (-this.randomInt(1, 10)).toString();
                            if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                        }
                        this.shuffle(options);
                        hints = [
                            `Chia hai số trái dấu thì kết quả sẽ mang dấu âm.`,
                            `Thực hiện phép chia hai số thập phân dương: chia phần số như chia số tự nhiên bằng cách nhân cả hai số với 10 hoặc 100 để mất dấu phẩy.`,
                            `Ví dụ: $7,5 : 2,5 = 75 : 25 = 3$.`
                        ];
                        solutionHtml = `Vì chia hai số trái dấu nên thương mang dấu âm. Thực hiện chia phần số dương:<br>$${a.toString().replace('.', ',')} : ${bStr} = ${a * 10} : ${b * 10} = ${a / b}$.<br>Vậy thương là $K = ${correctVal}$.`;
                    }
                    tip = "Nhân cả số bị chia và số chia với 10, 100, 1000... để chuyển phép chia số thập phân thành phép chia số tự nhiên.";
                } else { // kho
                    if (variant === 1) {
                        const aList = [2.5, 7.5, 12.5, 1.25];
                        const a = aList[this.randomInt(0, aList.length - 1)];
                        const sum = a === 1.25 ? 100 : 10;
                        const b = this.randomInt(21, 79) / 10;
                        const c = parseFloat((sum - b).toFixed(1));
                        const correctVal = a * sum;
                        
                        const aStr = a.toString().replace('.', ',');
                        const bStr = b.toString().replace('.', ',');
                        const cStr = c.toString().replace('.', ',');
                        const ansStr = correctVal.toString().replace('.', ',');
                        
                        questionText = `Tính nhanh giá trị biểu thức: $A = ${aStr} \\cdot ${bStr} + ${aStr} \\cdot ${cStr}$.`;
                        options = [`$${ansStr}$`, `$${(correctVal / 10).toString().replace('.', ',')}$`, `$${(correctVal + 10).toString().replace('.', ',')}$`, `$${(correctVal * 1.5).toString().replace('.', ',')}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomVal = this.randomInt(20, 200).toString();
                            if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                        }
                        this.shuffle(options);
                        
                        hints = [
                            `Áp dụng tính chất phân phối của phép nhân đối với phép cộng: $x \\cdot y + x \\cdot z = x(y + z)$.`,
                            `Đặt thừa số chung $${aStr}$ ra ngoài dấu ngoặc.`,
                            `Tính tổng của hai số trong ngoặc: $${bStr} + ${cStr} = ${sum}$.`
                        ];
                        solutionHtml = `Áp dụng tính chất phân phối:<br>$A = ${aStr} \\cdot (${bStr} + ${cStr})$<br>Tính trong ngoặc:<br>$${bStr} + ${cStr} = ${sum}$.<br>Do đó: $A = ${aStr} \\cdot ${sum} = ${ansStr}$.`;
                    } else {
                        // Bài toán thực tế mua sắm kết hợp số thập phân
                        // Vở: 12,5k * 3 = 37,5k. Bút: 4,5k * 2 = 9k. Tổng = 46,5k. Thối lại 100k - 46,5k = 53,5k
                        questionText = `Bình Minh đi mua đồ dùng học tập tại nhà sách: con mua $3$ cuốn vở với giá $12,5$ nghìn đồng/cuốn và $2$ chiếc bút với giá $4,5$ nghìn đồng/chiếc. Con đưa cho nhân viên thu ngân tờ tiền $100$ nghìn đồng. Hỏi Bình Minh được nhận lại bao nhiêu tiền thừa?`;
                        options = [
                            `$53,5$ nghìn đồng`,
                            `$46,5$ nghìn đồng`,
                            `$54,5$ nghìn đồng`,
                            `$53,0$ nghìn đồng`
                        ];
                        this.shuffle(options);
                        hints = [
                            `Tính tổng số tiền Bình Minh mua 3 cuốn vở: $3 \\cdot 12,5$ nghìn đồng.`,
                            `Tính tổng số tiền Bình Minh mua 2 chiếc bút: $2 \\cdot 4,5$ nghìn đồng.`,
                            `Cộng hai số tiền trên để tìm tổng hóa đơn.`,
                            `Lấy $100$ nghìn đồng trừ đi tổng hóa đơn để tính số tiền thừa được trả lại.`
                        ];
                        solutionHtml = `Số tiền mua vở của Bình Minh là:<br>$3 \\cdot 12,5 = 37,5$ nghìn đồng.<br>Số tiền mua bút của Bình Minh là:<br>$2 \\cdot 4,5 = 9,0$ nghìn đồng.<br>Tổng số tiền mua đồ dùng học tập của Bình Minh là:<br>$37,5 + 9,0 = 46,5$ nghìn đồng.<br>Số tiền thừa Bình Minh được nhận lại là:<br>$100 - 46,5 = 53,5$ nghìn đồng.`;
                    }
                    tip = "Hãy luôn quan sát để phát hiện các thừa số chung có thể đặt ra ngoài dấu ngoặc.";
                }
                break;
            }
            case "lam-tron-uoc-luong": {
                if (level === "co-ban") {
                    const integerPart = this.randomInt(10, 99);
                    const dec1 = this.randomInt(1, 9);
                    const dec2 = this.randomInt(1, 9);
                    const dec3 = this.randomInt(1, 9);
                    const num = parseFloat(`${integerPart}.${dec1}${dec2}${dec3}`);
                    const numStr = num.toString().replace('.', ',');
                    
                    // Làm tròn đến hàng phần mười
                    let ans;
                    if (dec2 >= 5) {
                        ans = (integerPart + (dec1 + 1) / 10).toFixed(1);
                    } else {
                        ans = (integerPart + dec1 / 10).toFixed(1);
                    }
                    const ansStr = ans.replace('.', ',');
                    
                    questionText = `Làm tròn số thập phân $${numStr}$ đến hàng phần mười (chữ số thập phân thứ nhất).`;
                    options = [`$${ansStr}$`, `$${(parseFloat(ans) + 0.1).toFixed(1).replace('.', ',')}$`, `$${(parseFloat(ans) - 0.1).toFixed(1).replace('.', ',')}$`, `$${integerPart}$`];
                    options = [...new Set(options)];
                    while (options.length < 4) {
                        const randomVal = `${integerPart},${this.randomInt(0, 9)}`;
                        if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                    }
                    this.shuffle(options);
                    
                    hints = [
                        `Chữ số hàng phần mười của số $${numStr}$ là chữ số $${dec1}$.`,
                        `Nhìn sang chữ số bên phải ngay sát nó là chữ số $${dec2}$ (ở hàng phần trăm) để quyết định làm tròn lên hay làm tròn xuống.`
                    ];
                    solutionHtml = `Số $${numStr}$ có chữ số hàng phần mười là $${dec1}$. Chữ số đầu tiên bị bỏ đi bên phải là $${dec2}$.<br>- Nếu $${dec2} \\ge 5$, ta tăng chữ số hàng phần mười thêm 1.<br>- Nếu $${dec2} < 5$, ta giữ nguyên chữ số hàng phần mười.<br>Vậy kết quả làm tròn là $${ansStr}$.`;
                    tip = "Nếu chữ số đầu tiên bỏ đi nhỏ hơn 5 thì giữ nguyên, lớn hơn hoặc bằng 5 thì cộng thêm 1 vào hàng làm tròn.";
                } else if (level === "nang-cao") {
                    const hục = this.randomInt(1, 9);
                    const đv = this.randomInt(1, 9);
                    const dec = this.randomInt(10, 99);
                    const num = parseFloat(`1${hục}${đv}.${dec}`);
                    const numStr = num.toString().replace('.', ',');
                    
                    // Làm tròn đến hàng chục
                    let ans;
                    if (đv >= 5) {
                        ans = 100 + (hục + 1) * 10;
                    } else {
                        ans = 100 + hục * 10;
                    }
                    
                    questionText = `Làm tròn số $${numStr}$ đến hàng chục.`;
                    options = [`$${ans}$`, `$${ans - 10}$`, `$${ans + 10}$`, `$${ans.toString() + ',0'}$`];
                    options = [...new Set(options)];
                    while (options.length < 4) {
                        const randomVal = `${this.randomInt(10, 20) * 10}`;
                        if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                    }
                    this.shuffle(options);
                    
                    hints = [
                        `Chữ số hàng chục của số $${numStr}$ là $${hục}$.`,
                        `Chữ số ngay bên phải nó (hàng đơn vị) là $${đv}$. Vì $${đv} ${đv >= 5 ? '\\ge 5' : '< 5'}$, hãy quyết định làm tròn.`
                    ];
                    solutionHtml = `Số $${numStr}$ có chữ số hàng chục là $${hục}$. Chữ số hàng đơn vị bên phải nó là $${đv}$.<br>Vì $${đv} ${đv >= 5 ? '\\ge 5' : '< 5'}$, ta thực hiện làm tròn ${đv >= 5 ? 'lên' : 'xuống'}.<br>Kết quả thu được là $${ans}$.`;
                    tip = "Khi làm tròn đến hàng chục, hàng trăm của số nguyên, hãy nhớ thay các chữ số bị bỏ bằng số 0.";
                } else { // kho
                    // Ước lượng M = a * b
                    const aInt = this.randomInt(5, 12);
                    const decA = this.randomInt(81, 99); // làm tròn lên
                    const bInt = this.randomInt(3, 8);
                    const decB = this.randomInt(11, 19); // làm tròn xuống
                    
                    const a = parseFloat(`${aInt}.${decA}`);
                    const b = parseFloat(`${bInt}.${decB}`);
                    
                    const aStr = a.toString().replace('.', ',');
                    const bStr = b.toString().replace('.', ',');
                    const correctVal = (aInt + 1) * bInt;
                    
                    questionText = `Ước lượng kết quả của phép tính sau bằng cách làm tròn các số đến hàng đơn vị: $M = ${aStr} \\cdot ${bStr}$.`;
                    options = [`$${correctVal}$`, `$${aInt * bInt}$`, `$${(aInt + 1) * (bInt + 1)}$`, `$${aInt * (bInt + 1)}$`];
                    options = [...new Set(options)];
                    while (options.length < 4) {
                        const randomVal = this.randomInt(15, 100).toString();
                        if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                    }
                    this.shuffle(options);
                    
                    hints = [
                        `Làm tròn số $${aStr}$ đến hàng đơn vị: vì chữ số hàng phần mười là $${Math.floor(decA / 10)} \\ge 5$, ta làm tròn lên được $${aInt + 1}$.`,
                        `Làm tròn số $${bStr}$ đến hàng đơn vị: vì chữ số hàng phần mười là $${Math.floor(decB / 10)} < 5$, ta làm tròn xuống được $${bInt}$.`,
                        `Nhân hai kết quả đã làm tròn để được số ước lượng.`
                    ];
                    solutionHtml = `Làm tròn các số đến hàng đơn vị:<br>- $${aStr} \\approx ${aInt + 1}$ (vì chữ số hàng phần mười là $${Math.floor(decA / 10)} \\ge 5$).<br>- $${bStr} \\approx ${bInt}$ (vì chữ số hàng phần mười là $${Math.floor(decB / 10)} < 5$).<br>Ước lượng tích thu được là: $M \\approx ${aInt + 1} \\cdot ${bInt} = ${correctVal}$.`;
                    tip = "Ước lượng giúp kiểm tra nhanh xem kết quả tính toán thực tế có bị sai lệch quá nhiều không.";
                }
                break;
            }
            case "ti-so-phan-tram": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const bList = [20, 25, 40, 50, 80];
                    const b = bList[this.randomInt(0, bList.length - 1)];
                    let a = this.randomInt(1, b - 1);
                    while ((a * 100) % b !== 0) {
                        a = this.randomInt(1, b - 1);
                    }
                    const ans = (a * 100) / b;
                    
                    questionText = `Tính tỉ số phần trăm của hai số $${a}$ và $${b}$.`;
                    options = [`$${ans}\\%$`, `$${(a / b).toFixed(2).replace('.', ',')}\\%$`, `$${ans + 10}\\%$`, `$${ans - 5}\\%$`];
                    options = [...new Set(options)];
                    while (options.length < 4) {
                        const randomVal = `${this.randomInt(5, 95)}\\%`;
                        if (!options.includes(randomVal)) options.push(randomVal);
                    }
                    this.shuffle(options);
                    
                    hints = [
                        `Công thức tính tỉ số phần trăm của hai số $a$ và $b$ là: $\\frac{a \\cdot 100}{b}\\%$.`,
                        `Thay số vào công thức: $\\frac{${a} \\cdot 100}{${b}}\\%$.`
                    ];
                    solutionHtml = `Tỉ số phần trăm của hai số $${a}$ và $${b}$ là:<br>$\\frac{${a} \\cdot 100}{${b}}\\% = ${ans}\\%$.`;
                    } else {
                        // Viết phân số thành tỉ số phần trăm
                        const a = 3;
                        const b = 5;
                        const ans = 60;
                        questionText = `Viết phân số $\\frac{${a}}{${b}}$ dưới dạng tỉ số phần trăm.`;
                        options = [`$${ans}\\%$`, `$0,6\\%$`, `$${ans + 15}\\%$`, `$${ans - 10}\\%$`];
                        hints = [
                            `Để viết phân số $\\frac{a}{b}$ thành tỉ số phần trăm, ta nhân phân số đó với 100 rồi viết thêm ký hiệu $\\%$ vào bên phải.`,
                            `Phép tính: $\\left( \\frac{${a}}{${b}} \\cdot 100 \\right) \\%$.`,
                            `Hoặc quy đồng mẫu số của phân số về mẫu là 100: $\\frac{3}{5} = \\frac{60}{100} = 60\\%$.`
                        ];
                        solutionHtml = `Cách 1: Quy đồng mẫu số về $100$:<br>$\\frac{3}{5} = \\frac{3 \\cdot 20}{5 \\cdot 20} = \\frac{60}{100} = 60\\%$.<br>Cách 2: Nhân phân số với 100 rồi thêm ký hiệu $\\%$:<br>$\\frac{3}{5} = \\left(\\frac{3 \\cdot 100}{5}\\right)\\% = 60\\%$.`;
                    }
                    tip = "Tỉ số phần trăm bằng thương của hai số nhân với 100 rồi viết thêm ký hiệu %.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const a = 50 * this.randomInt(2, 8);
                        const pList = [5, 10, 15, 20, 25, 30];
                        const p = pList[this.randomInt(0, pList.length - 1)];
                        const correctVal = (a * p) / 100;
                        
                        questionText = `Tìm giá trị $${p}\\%$ của số $${a}$.`;
                        options = [`$${correctVal}$`, `$${correctVal + 10}$`, `$${correctVal - 5}$`, `$${a * 100 / p}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomVal = this.randomInt(5, a / 2).toString();
                            if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                        }
                        this.shuffle(options);
                        
                        hints = [
                            `Muốn tìm $p\\\%$ của số $a$, ta tính: $a \\cdot \\frac{p}{100}$.`,
                            `Áp dụng vào số liệu đề bài: $${a} \\cdot \\frac{${p}}{100}$.`
                        ];
                        solutionHtml = `Giá trị $${p}\\%$ của số $${a}$ là:<br>$${a} \\cdot \\frac{${p}}{100} = \\frac{${a} \\cdot ${p}}{100} = ${correctVal}$.`;
                    } else {
                        // Tìm số A biết 25% của A là 40
                        const p = 25;
                        const val = 40;
                        const correctVal = 160;
                        questionText = `Tìm một số biết $${p}\\%$ của số đó bằng $${val}$.`;
                        options = [`$${correctVal}$`, `$10$`, `$100$`, `$${correctVal + 20}$`];
                        hints = [
                            `Đây là bài toán ngược: tìm một số khi biết giá trị phần trăm của nó.`,
                            `Muốn tìm số đó, ta lấy giá trị đã biết chia cho tỉ số phần trăm tương ứng.`,
                            `Phép tính: $${val} : \\frac{${p}}{100} = ${val} : 0,25$.`
                        ];
                        solutionHtml = `Số cần tìm là:<br>$${val} : ${p}\\% = ${val} : \\frac{25}{100} = ${val} \\cdot \\frac{100}{25} = ${val} \\cdot 4 = ${correctVal}$.`;
                    }
                    tip = "Tìm phần trăm của một số ta nhân số đó với tỉ lệ; tìm số ban đầu khi biết lượng phần trăm ta chia cho tỉ lệ.";
                } else { // kho
                    if (variant === 1) {
                        const prices = [400000, 500000, 600000, 800000];
                        const price = prices[this.randomInt(0, prices.length - 1)];
                        const p1 = [10, 20][this.randomInt(0, 1)];
                        const p2 = [5, 10][this.randomInt(0, 1)];
                        
                        const price1 = price * (1 - p1/100);
                        const finalPrice = price1 * (1 - p2/100);
                        
                        questionText = `Một chiếc áo khoác có giá niêm yết là $${price.toLocaleString('vi-VN')}$ đồng. Nhân dịp lễ, cửa hàng giảm giá lần một $${p1}\\%$. Sau đó, cửa hàng lại tiếp tục giảm giá thêm $${p2}\\%$ trên giá đã giảm cho khách hàng thân thiết. Hỏi Bình Minh mua chiếc áo đó với giá bao nhiêu?`;
                        options = [
                            `$${finalPrice.toLocaleString('vi-VN')}$ đồng`,
                            `$${(price * (1 - (p1 + p2)/100)).toLocaleString('vi-VN')}$ đồng`,
                            `$${(price * 0.8).toLocaleString('vi-VN')}$ đồng`,
                            `$${(price - 50000).toLocaleString('vi-VN')}$ đồng`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomVal = `${this.randomInt(300, 700) * 1000}`;
                            if (!options.includes(`$${parseInt(randomVal).toLocaleString('vi-VN')}$ đồng`)) {
                                options.push(`$${parseInt(randomVal).toLocaleString('vi-VN')}$ đồng`);
                            }
                        }
                        this.shuffle(options);
                        
                        hints = [
                            `Tính giá chiếc áo sau lần giảm giá thứ nhất ($${p1}\\%$): $${price.toLocaleString('vi-VN')} \\cdot (1 - \\frac{${p1}}{100}) = ${price1.toLocaleString('vi-VN')}$ đồng.`,
                            `Tính giá chiếc áo sau lần giảm giá thứ hai ($${p2}\\%$ trên giá đã giảm): $${price1.toLocaleString('vi-VN')} \\cdot (1 - \\frac{${p2}}{100})$.`,
                            `Chú ý: Không cộng trực tiếp hai phần trăm lại thành giảm $${p1 + p2}\\%$ vì lần hai giảm trên giá mới.`
                        ];
                        solutionHtml = `Giá chiếc áo sau lần giảm thứ nhất là:<br>$${price.toLocaleString('vi-VN')} \\cdot \\left(1 - \\frac{${p1}}{100}\\right) = ${price1.toLocaleString('vi-VN')}$ đồng.<br>Giá chiếc áo Bình Minh mua sau lần giảm thứ hai là:<br>$${price1.toLocaleString('vi-VN')} \\cdot \\left(1 - \\frac{${p2}}{100}\\right) = ${finalPrice.toLocaleString('vi-VN')}$ đồng.`;
                    } else {
                        // Bài toán thực tế pha nồng độ dung dịch muối sinh lý
                        // 20g muối + 180g nước = 200g dung dịch. C% = 20/200 * 100% = 10%
                        questionText = `Bình Minh pha chế nước muối sinh lý bằng cách hòa tan $20\\text{ g}$ muối tinh khiết vào $180\\text{ g}$ nước lọc. Tính nồng độ phần trăm của dung dịch nước muối sinh lý thu được.`;
                        options = [`$10\\%$`, `$11,1\\%$`, `$9\\%$`, `$20\\%$`];
                        hints = [
                            `Tính khối lượng toàn bộ dung dịch thu được: (Khối lượng muối) + (Khối lượng nước).`,
                            `Khối lượng dung dịch là: $20 + 180 = 200\\text{ g}$.`,
                            `Nồng độ phần trăm được tính bằng công thức: $\\frac{\\text{Khối lượng muối}}{\\text{Khối lượng dung dịch}} \\cdot 100\\%$.`
                        ];
                        solutionHtml = `Khối lượng của dung dịch nước muối thu được là:<br>$20 + 180 = 200\\text{ g}$.<br>Nồng độ phần trăm của dung dịch muối đó là:<br>$\\frac{20}{200} \\cdot 100\\% = 10\\%$.`;
                    }
                    tip = "Giảm giá kép luôn phải tính tuần tự qua từng bước, không được cộng gộp phần trăm. Nồng độ phần trăm dung dịch tính dựa trên tổng khối lượng dung dịch sau pha trộn.";
                }
                break;
            }
            case "diem-duong-thang": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        questionText = `Cho điểm $A$ nằm trên đường thẳng $d$ và điểm $B$ nằm ngoài đường thẳng $d$. Ký hiệu toán học nào sau đây biểu diễn **đúng** mối quan hệ này?`;
                        options = [
                            `$A \\in d$ và $B \\notin d$`,
                            `$A \\notin d$ và $B \\in d$`,
                            `$A \\in d$ và $B \\in d$`,
                            `$A \\subset d$ và $B \\notin d$`
                        ];
                        this.shuffle(options);
                        hints = [
                            `Ký hiệu $\\in$ nghĩa là thuộc (điểm nằm trên đường thẳng).`,
                            `Ký hiệu $\\notin$ nghĩa là không thuộc (điểm nằm ngoài đường thẳng).`
                        ];
                        solutionHtml = `Vì điểm $A$ nằm trên đường thẳng $d$ nên ta viết $A \\in d$. Điểm $B$ không nằm trên đường thẳng $d$ nên ta viết $B \\notin d$.`;
                    } else {
                        questionText = `Cho ba điểm $A, B, C$ cùng nằm trên đường thẳng $a$ và điểm $D$ không nằm trên đường thẳng $a$. Phát biểu nào sau đây là **sai**?`;
                        options = [
                            `$D \\in a$`,
                            `$A \\in a$`,
                            `$B \\in a$`,
                            `$C \\in a$`
                        ];
                        this.shuffle(options);
                        hints = [
                            `Điểm nằm trên đường thẳng thì ký hiệu là thuộc $\\in$.`,
                            `Điểm không nằm trên đường thẳng thì ký hiệu là không thuộc $\\notin$.`,
                            `Kiểm tra xem điểm $D$ có nằm trên đường thẳng $a$ không.`
                        ];
                        solutionHtml = `Vì ba điểm $A, B, C$ nằm trên đường thẳng $a$ nên $A, B, C \\in a$ là các phát biểu đúng. Điểm $D$ không nằm trên đường thẳng $a$ nên ta phải viết $D \\notin a$. Do đó khẳng định $D \\in a$ là sai.`;
                    }
                    tip = "Sử dụng ký hiệu thuộc (∈) và không thuộc (∉) cho mối quan hệ giữa điểm và đường thẳng.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const n = this.randomInt(5, 8);
                        const lines = (n * (n - 1)) / 2;
                        questionText = `Cho $${n}$ điểm phân biệt trong đó không có 3 điểm nào thẳng hàng. Hỏi vẽ được tất cả bao nhiêu đường thẳng đi qua các cặp điểm?`;
                        options = [`$${lines}$ đường thẳng`, `$${n}$ đường thẳng`, `$${lines + 5}$ đường thẳng`, `$${n * 2}$ đường thẳng`];
                        this.shuffle(options);
                        hints = [
                            `Cứ qua 2 điểm ta vẽ được 1 đường thẳng.`,
                            `Công thức tính số đường thẳng đi qua $n$ điểm phân biệt không thẳng hàng là: $\\frac{n(n-1)}{2}$.`,
                            `Thay $n = ${n}$ vào công thức.`
                        ];
                        solutionHtml = `Số đường thẳng vẽ được đi qua $${n}$ điểm phân biệt (không có 3 điểm nào thẳng hàng) là:<br>$\\frac{${n} \\cdot (${n} - 1)}{2} = \\frac{${n} \\cdot ${n-1}}{2} = ${lines}$ đường thẳng.`;
                    } else {
                        const n = this.randomInt(6, 9);
                        const lines = (n * (n - 1)) / 2 - 3 + 1; // 3 điểm thẳng hàng -> mất 3 đường thẳng cũ, thay bằng 1 đường thẳng mới.
                        questionText = `Cho $${n}$ điểm phân biệt trong đó có đúng 3 điểm thẳng hàng, ngoài ra không có 3 điểm nào khác thẳng hàng. Hỏi vẽ được tất cả bao nhiêu đường thẳng đi qua các cặp điểm?`;
                        options = [
                            `$${lines}$ đường thẳng`,
                            `$${(n * (n - 1)) / 2}$ đường thẳng`,
                            `$${lines - 2}$ đường thẳng`,
                            `$${lines + 4}$ đường thẳng`
                        ];
                        this.shuffle(options);
                        hints = [
                            `Nếu không có điểm nào thẳng hàng, số đường thẳng là $\\frac{n(n-1)}{2}$.`,
                            `Vì có 3 điểm thẳng hàng nên số đường thẳng giảm đi: ta trừ đi số đường thẳng đi qua các cặp điểm trong 3 điểm này ($\\frac{3 \\cdot 2}{2} = 3$ đường) rồi cộng thêm 1 đường thẳng đi qua cả 3 điểm thẳng hàng đó.`,
                            `Công thức tính: $\\frac{n(n-1)}{2} - 3 + 1$.`
                        ];
                        solutionHtml = `Nếu không có 3 điểm nào thẳng hàng, số đường thẳng vẽ được là: $\\frac{${n} \\cdot ${n-1}}{2} = ${(n * (n - 1)) / 2}$ đường thẳng.<br>Trong 3 điểm thẳng hàng, thay vì vẽ được $\\frac{3 \\cdot 2}{2} = 3$ đường thẳng phân biệt, ta chỉ vẽ được duy nhất $1$ đường thẳng.<br>Do đó số đường thẳng thực tế vẽ được là:<br>$\\frac{${n} \\cdot (${n} - 1)}{2} - 3 + 1 = ${lines}$ đường thẳng.`;
                    }
                    tip = "Công thức tổng quát tính số đường thẳng từ n điểm không thẳng hàng là n(n-1)/2. Khi có k điểm thẳng hàng, ta trừ đi k(k-1)/2 rồi cộng thêm 1.";
                } else { // kho
                    if (variant === 1) {
                        const pts = [6, 7, 8, 9];
                        const n = pts[this.randomInt(0, pts.length - 1)];
                        const lines = (n * (n - 1)) / 2;
                        questionText = `Cho trước một số điểm phân biệt. Người ta vẽ được tất cả $${lines}$ đường thẳng đi qua các cặp điểm (không có 3 điểm nào thẳng hàng). Hỏi ban đầu có bao nhiêu điểm phân biệt?`;
                        options = [`$${n}$ điểm`, `$${n - 1}$ điểm`, `$${n + 1}$ điểm`, `$${lines / 2}$ điểm`];
                        this.shuffle(options);
                        hints = [
                            `Áp dụng công thức số đường thẳng: $\\frac{n(n-1)}{2} = ${lines}$.`,
                            `Nhân chéo: $n(n-1) = ${lines * 2}$.`,
                            `Tìm hai số tự nhiên liên tiếp có tích bằng $${lines * 2}$.`
                        ];
                        solutionHtml = `Gọi số điểm là $n$. Ta có công thức số đường thẳng:<br>$\\frac{n(n-1)}{2} = ${lines} \\rightarrow n(n-1) = ${lines * 2}$.<br>Vì $${lines * 2} = ${n} \\cdot ${n - 1}$, nên ta suy ra $n = ${n}$. Vậy ban đầu có $${n}$ điểm phân biệt.`;
                    } else {
                        // Cho 10 điểm phân biệt, trong đó có k điểm thẳng hàng. Vẽ được tất cả 40 đường thẳng. Tìm k.
                        const k = this.randomInt(3, 5);
                        const n = 10;
                        const kLines = (k * (k - 1)) / 2;
                        const totalLines = (n * (n - 1)) / 2 - kLines + 1; // 45 - kLines + 1 = 46 - kLines
                        questionText = `Cho $10$ điểm phân biệt trong đó có đúng $k$ điểm thẳng hàng (ngoài ra không có 3 điểm nào khác thẳng hàng). Qua các cặp điểm ta vẽ được tất cả $${totalLines}$ đường thẳng. Tìm giá trị của $k$.`;
                        options = [`$${k}$`, `$${k - 1}$`, `$${k + 1}$`, `$2$`];
                        this.shuffle(options);
                        hints = [
                            `Áp dụng công thức số đường thẳng khi có $k$ điểm thẳng hàng: $\\frac{10 \\cdot 9}{2} - \\frac{k(k-1)}{2} + 1 = ${totalLines}$.`,
                            `Tính toán: $45 - \\frac{k(k-1)}{2} + 1 = ${totalLines} \\rightarrow 46 - \\frac{k(k-1)}{2} = ${totalLines}$.`,
                            `Suy ra $\\frac{k(k-1)}{2} = 46 - ${totalLines} = ${kLines}$.`
                        ];
                        solutionHtml = `Số đường thẳng vẽ được từ $10$ điểm phân biệt với $k$ điểm thẳng hàng là:<br>$\\frac{10 \\cdot 9}{2} - \\frac{k(k-1)}{2} + 1 = ${totalLines}$<br>$\\rightarrow 45 - \\frac{k(k-1)}{2} + 1 = ${totalLines}$<br>$\\rightarrow 46 - \\frac{k(k-1)}{2} = ${totalLines}$<br>$\\rightarrow \\frac{k(k-1)}{2} = 46 - ${totalLines} = ${kLines}$<br>$\\rightarrow k(k-1) = ${k * (k - 1)}$.<br>Vì $k$ và $k-1$ là hai số tự nhiên liên tiếp nên ta suy ra $k = ${k}$.`;
                    }
                    tip = "Phân tích tích số thành tích của hai số tự nhiên liên tiếp để giải nhanh bài toán tìm số điểm.";
                }
                break;
            }
            case "tia-hinh-hoc": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        questionText = `Hai tia chung gốc $Ox$ và $Oy$ tạo thành đường thẳng $xy$ được gọi là:`;
                        options = [`Hai tia đối nhau`, `Hai tia trùng nhau`, `Hai tia vuông góc`, `Hai tia song song`];
                        this.shuffle(options);
                        hints = [
                            `Hãy vẽ đường thẳng $xy$ và lấy điểm $O$ trên đó.`,
                            `Điểm $O$ chia đường thẳng thành hai nửa là tia $Ox$ và tia $Oy$ kéo dài về hai phía ngược nhau.`
                        ];
                        solutionHtml = `Hai tia chung gốc tạo thành một đường thẳng được định nghĩa là hai tia đối nhau.`;
                    } else {
                        questionText = `Tia $Ox$ là hình gồm:`;
                        options = [
                            `Điểm $O$ và một phần đường thẳng bị chia ra bởi điểm $O$`,
                            `Điểm $O$, điểm $x$ và tất cả các điểm nằm giữa $O$ và $x$`,
                            `Một đường thẳng kéo dài về hai phía`,
                            `Một đoạn thẳng nối điểm $O$ và điểm $x$`
                        ];
                        this.shuffle(options);
                        hints = [
                            `Định nghĩa tia: Tia $Ox$ là hình gồm điểm $O$ và một phần đường thẳng bị chia ra bởi điểm $O$.`,
                            `Điểm $O$ được gọi là gốc của tia.`
                        ];
                        solutionHtml = `Theo định nghĩa trong sách giáo khoa: Hình gồm điểm $O$ và một phần đường thẳng bị chia ra bởi điểm $O$ được gọi là một tia gốc $O$ (hay nửa đường thẳng gốc $O$). Ký hiệu tia $Ox$ có nghĩa gốc là điểm $O$ và kéo dài vô tận về phía $x$.`;
                    }
                    tip = "Hai tia đối nhau phải thỏa mãn đồng thời hai điều kiện: Chung gốc và tạo thành một đường thẳng.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        questionText = `Cho điểm $M$ nằm giữa hai điểm $A$ và $B$. Phát biểu nào sau đây là **đúng**?`;
                        options = [
                            `Tia $MA$ và tia $MB$ là hai tia đối nhau.`,
                            `Tia $AM$ và tia $AB$ là hai tia đối nhau.`,
                            `Tia $MA$ và tia $MB$ là hai tia trùng nhau.`,
                            `Tia $BM$ và tia $BA$ là hai tia đối nhau.`
                        ];
                        this.shuffle(options);
                        hints = [
                            `Vẽ ba điểm theo thứ tự $A - M - B$.`,
                            `Điểm $M$ nằm giữa nên gốc $M$ đi về phía $A$ và phía $B$ là hai hướng ngược nhau tạo nên đường thẳng $AB$.`
                        ];
                        solutionHtml = `Vì điểm $M$ nằm giữa hai điểm $A$ và $B$, nên hai tia chung gốc $M$ là $MA$ và $MB$ kéo dài về hai hướng ngược nhau tạo thành đường thẳng $AB$. Do đó chúng là hai tia đối nhau.`;
                    } else {
                        questionText = `Trên tia $Ox$ lấy điểm $A$ và $B$ sao sau điểm $A$ nằm giữa hai điểm $O$ và $B$. Hỏi tia đối của tia $AB$ là tia nào?`;
                        options = [`Tia $Ax$ (hoặc tia $AB$ kéo dài)`, `Tia $AO$ (hoặc tia $Ay$)`, `Tia $BO$`, `Tia $OB$`];
                        this.shuffle(options);
                        hints = [
                            `Vẽ hình theo thứ tự các điểm trên tia: $O - A - B - x$.`,
                            `Tia $AB$ có gốc là $A$ và đi về hướng bên phải (phía $B$ và $x$).`,
                            `Tia đối của tia $AB$ phải chung gốc $A$ và đi về hướng ngược lại (hướng bên trái, tức là hướng về điểm $O$).`
                        ];
                        solutionHtml = `Trên hình vẽ theo thứ tự là $O - A - B$.<br>- Tia $AB$ có gốc là $A$, đi theo hướng từ trái sang phải.<br>- Tia đối của tia $AB$ phải có gốc là $A$ và đi theo hướng từ phải sang trái (ngược lại). Hướng này đi qua điểm $O$.<br>Do đó tia đối của tia $AB$ là tia $AO$.`;
                    }
                    tip = "Hai tia đối nhau chung gốc và tạo thành đường thẳng. Luyện tập vẽ hình nháp để kiểm tra tính chính xác.";
                } else { // kho
                        // Cho n tia chung gốc, vẽ thêm 1 tia chung gốc thì số góc tăng thêm bao nhiêu?
                        const n = this.randomInt(4, 6);
                        questionText = `Cho trước $${n}$ tia chung gốc. Nếu ta vẽ thêm $1$ tia chung gốc nữa (không trùng với các tia đã có) thì số góc tạo thành sẽ tăng thêm bao nhiêu góc?`;
                        options = [`$${n}$ góc`, `$${n + 1}$ góc`, `$${n - 1}$ góc`, `$${(n * (n - 1)) / 2}$ góc`];
                        this.shuffle(options);
                        hints = [
                            `Tia mới vẽ thêm sẽ kết hợp với từng tia trong số $${n}$ tia ban đầu để tạo ra các góc mới.`,
                            `Vì có $${n}$ tia ban đầu nên số góc mới được tạo ra chính bằng số tia ban đầu.`
                        ];
                        solutionHtml = `Tia mới vẽ thêm cùng với mỗi tia trong số $${n}$ tia ban đầu tạo thành đúng $1$ góc mới.<br>Vì có $${n}$ tia ban đầu nên số góc mới được tạo thành thêm là $${n}$ góc.`;
                    }
                    tip = "Trên một đường thẳng, số tia luôn bằng 2 lần số điểm nằm trên đó.";
                break;
            }
            case "doan-thang": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const ab = this.randomInt(7, 12);
                        const am = this.randomInt(2, ab - 2);
                        questionText = `Cho điểm $M$ nằm giữa hai điểm $A$ và $B$. Biết độ dài đoạn thẳng $AB = ${ab}\\text{ cm}$, $AM = ${am}\\text{ cm}$. Tính độ dài đoạn thẳng $MB$.`;
                        // Tránh trùng khi am trùng với ab-am hoặc ab-am+2
                        const w3DoanThang1a = (am === ab - am || am === ab - am + 2) ? am + 1 : am;
                        // Tránh w3 trùng lần nữa với các options còn lại (an toàn)
                        const w3DoanThang1 = (w3DoanThang1a === ab - am || w3DoanThang1a === ab - am + 2 || w3DoanThang1a === ab + am) ? am + 3 : w3DoanThang1a;
                        options = [`$${ab - am}\\text{ cm}$`, `$${ab + am}\\text{ cm}$`, `$${w3DoanThang1}\\text{ cm}$`, `$${ab - am + 2}\\text{ cm}$`];
                        this.shuffle(options);
                        hints = [
                            `Vì điểm $M$ nằm giữa hai điểm $A$ và $B$ nên ta có đẳng thức: $AM + MB = AB$.`,
                            `Thay số vào: $${am} + MB = ${ab}$.`
                        ];
                        solutionHtml = `Vì điểm $M$ nằm giữa $A$ và $B$ nên:<br>$AM + MB = AB \\rightarrow ${am} + MB = ${ab} \\rightarrow MB = ${ab} - ${am} = ${ab - am}\\text{ cm}$.`;
                    } else {
                        const pq = this.randomInt(12, 18);
                        const pn = this.randomInt(4, pq - 4);
                        questionText = `Cho điểm $N$ nằm giữa hai điểm $P$ và $Q$. Biết $PN = ${pn}\\text{ cm}$, $NQ = ${pq - pn}\\text{ cm}$. Tính độ dài đoạn thẳng $PQ$.`;
                        // Tránh trùng khi pn === pq-pn hoặc pn === pq+2
                        const w3DoanThang2a = (pn === pq - pn || pn === pq + 2) ? pn + 1 : pn;
                        const w3DoanThang2 = (w3DoanThang2a === pq - pn || w3DoanThang2a === pq + 2 || w3DoanThang2a === pq) ? pn + 3 : w3DoanThang2a;
                        options = [`$${pq}\\text{ cm}$`, `$${pq - pn}\\text{ cm}$`, `$${w3DoanThang2}\\text{ cm}$`, `$${pq + 2}\\text{ cm}$`];
                        this.shuffle(options);
                        hints = [
                            `Vì điểm $N$ nằm giữa $P$ và $Q$ nên ta có đẳng thức cộng đoạn thẳng: $PQ = PN + NQ$.`,
                            `Thay số vào: $PQ = ${pn} + ${pq - pn}$.`
                        ];
                        solutionHtml = `Vì điểm $N$ nằm giữa hai điểm $P$ và $Q$ nên ta có:<br>$PQ = PN + NQ = ${pn} + ${pq - pn} = ${pq}\\text{ cm}$.`;
                    }
                    tip = "Hệ thức cộng đoạn thẳng chỉ có khi có một điểm nằm giữa hai điểm còn lại.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const n = this.randomInt(5, 8);
                        const segments = (n * (n - 1)) / 2;
                        questionText = `Cho $${n}$ điểm phân biệt nằm trên một đường thẳng. Có bao nhiêu đoạn thẳng được tạo thành từ các điểm đó?`;
                        options = [`$${segments}$ đoạn thẳng`, `$${n}$ đoạn thẳng`, `$${segments + 3}$ đoạn thẳng`, `$${n * 2}$ đoạn thẳng`];
                        this.shuffle(options);
                        hints = [
                            `Cứ chọn 2 điểm trong số các điểm cho trước ta được 1 đoạn thẳng.`,
                            `Công thức tính số đoạn thẳng đi qua $n$ điểm phân biệt là: $\\frac{n(n-1)}{2}$.`,
                            `Thay $n = ${n}$ vào để tính.`
                        ];
                        solutionHtml = `Mỗi cách chọn 2 điểm trong số $${n}$ điểm phân biệt cho ta một đoạn thẳng. Số đoạn thẳng là:<br>$\\frac{${n} \\cdot (${n} - 1)}{2} = \\frac{${n} \\cdot ${n-1}}{2} = ${segments}$ đoạn thẳng.`;
                    } else {
                        const oa = this.randomInt(2, 5);
                        const ob = this.randomInt(oa + 3, oa + 7);
                        questionText = `Trên tia $Ox$ lấy hai điểm $A$ và $B$ sao cho $OA = ${oa}\\text{ cm}$, $OB = ${ob}\\text{ cm}$. Tính độ dài đoạn thẳng $AB$.`;
                        options = [`$${ob - oa}\\text{ cm}$`, `$${ob + oa}\\text{ cm}$`, `$${oa}\\text{ cm}$`, `$${ob - oa + 1}\\text{ cm}$`];
                        this.shuffle(options);
                        hints = [
                            `Vì cả hai điểm $A, B$ đều thuộc tia $Ox$ và $OA < OB$ ($${oa} < ${ob}$) nên điểm $A$ nằm giữa hai điểm $O$ và $B$.`,
                            `Do đó ta có hệ thức: $OA + AB = OB$.`,
                            `Thay số vào để tính $AB$.`
                        ];
                        solutionHtml = `Trên tia $Ox$, vì $OA < OB$ ($${oa}\\text{ cm} < ${ob}\\text{ cm}$) nên điểm $A$ nằm giữa hai điểm $O$ và $B$.<br>Ta có:<br>$OA + AB = OB \\rightarrow ${oa} + AB = ${ob} \\rightarrow AB = ${ob} - ${oa} = ${ob - oa}\\text{ cm}$.`;
                    }
                    tip = "Trên cùng một tia, điểm có khoảng cách tới gốc nhỏ hơn sẽ nằm giữa gốc và điểm còn lại.";
                } else { // kho
                    if (variant === 1) {
                        const ab = this.randomInt(5, 9);
                        const bc = this.randomInt(3, ab - 1);
                        const sum = ab + bc;
                        const diff = ab - bc;
                        questionText = `Cho ba điểm $A, B, C$ thẳng hàng. Biết độ dài đoạn thẳng $AB = ${ab}\\text{ cm}$ và $BC = ${bc}\\text{ cm}$. Tính độ dài đoạn thẳng $AC$.`;
                        options = [
                            `$${sum}\\text{ cm}$ hoặc $${diff}\\text{ cm}$`,
                            `$${sum}\\text{ cm}$`,
                            `$${diff}\\text{ cm}$`,
                            `$${sum + 2}\\text{ cm}$`
                        ];
                        this.shuffle(options);
                        hints = [
                            `Đề bài không cho biết điểm nào nằm giữa các điểm còn lại, nên ta phải xét hai trường hợp.`,
                            `Trường hợp 1: Điểm $B$ nằm giữa $A$ và $C$. Khi đó $AC = AB + BC$.`,
                            `Trường hợp 2: Điểm $C$ nằm giữa $A$ và $B$. Khi đó $AC = AB - BC$.`
                        ];
                        solutionHtml = `Vì ba điểm $A, B, C$ thẳng hàng và chưa biết vị trí của chúng nên ta xét hai trường hợp:<br>- Trường hợp 1: Điểm $B$ nằm giữa $A$ and $C$. Ta có:<br>$AC = AB + BC = ${ab} + ${bc} = ${sum}\\text{ cm}$.<br>- Trường hợp 2: Điểm $C$ nằm giữa $A$ và $B$. Ta có:<br>$AC + BC = AB \\rightarrow AC = AB - BC = ${ab} - ${bc} = ${diff}\\text{ cm}$.<br>Vậy $AC$ có độ dài là $${sum}\\text{ cm}$ hoặc $${diff}\\text{ cm}$.`;
                    } else {
                        // MN = (OC - OA)/2 = (c - a)/2
                        const oa = this.randomInt(2, 4);
                        const ob = this.randomInt(oa + 2, oa + 4);
                        const oc = this.randomInt(ob + 2, ob + 4);
                        const mn = (oc - oa) / 2;
                        const mnStr = mn.toString().replace('.', ',');
                        questionText = `Trên tia $Ox$ lấy ba điểm $A, B, C$ sao cho $OA = ${oa}\\text{ cm}$, $OB = ${ob}\\text{ cm}$, $OC = ${oc}\\text{ cm}$. Gọi $M$ là trung điểm của $AB$, $N$ là trung điểm của $BC$. Tính độ dài đoạn thẳng $MN$.`;
                        options = [`$${mnStr}\\text{ cm}$`, `$${mn + 1}\\text{ cm}$`, `$${mn - 0.5}\\text{ cm}$`, `$${ob - oa}\\text{ cm}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomOpt = `$${this.randomInt(1, 6)}\\text{ cm}$`;
                            if (!options.includes(randomOpt)) options.push(randomOpt);
                        }
                        this.shuffle(options);
                        hints = [
                            `Tính độ dài các đoạn thẳng $AB = OB - OA$ và $BC = OC - OB$.`,
                            `Tính $MB = AB / 2$ và $BN = BC / 2$.`,
                            `Vì điểm $B$ nằm giữa $A$ và $C$ nên $M$ và $N$ nằm ở hai bên điểm $B$. Do đó $MN = MB + BN = \\frac{AB + BC}{2}$.`
                        ];
                        solutionHtml = `Ta tính độ dài các đoạn thẳng:<br>- $AB = OB - OA = ${ob} - ${oa} = ${ob - oa}\\text{ cm}$. Trung điểm $M$ của $AB$ cho $MB = AB / 2 = ${(ob - oa) / 2}\\text{ cm}$.<br>- $BC = OC - OB = ${oc} - ${ob} = ${oc - ob}\\text{ cm}$. Trung điểm $N$ của $BC$ cho $BN = BC / 2 = ${(oc - ob) / 2}\\text{ cm}$.<br>Vì $A, B, C$ cùng nằm trên tia $Ox$ và $OA < OB < OC$ nên $B$ nằm giữa $A$ và $C$. Do đó $M$ và $N$ nằm ở hai phía đối với điểm $B$.<br>Ta có:<br>$MN = MB + BN = ${(ob - oa) / 2} + ${(oc - ob) / 2} = ${mnStr}\\text{ cm}$.`;
                    }
                    tip = "Độ dài đoạn thẳng nối hai trung điểm của hai đoạn thẳng liên tiếp bằng một nửa tổng độ dài của hai đoạn thẳng đó.";
                }
                break;
            }
            case "trung-diem": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const ab = this.randomInt(4, 10) * 2;
                        const ans = ab / 2;
                        const targetAmOrMb = this.randomInt(1, 2) === 1 ? "AM" : "MB";
                        questionText = `Cho đoạn thẳng $AB = ${ab}\\text{ cm}$. Gọi $M$ là trung điểm của đoạn thẳng $AB$. Tính độ dài đoạn thẳng $${targetAmOrMb}$.`;
                        options = [`$${ans}\\text{ cm}$`, `$${ab}\\text{ cm}$`, `$${ans - 1}\\text{ cm}$`, `$${ab * 2}\\text{ cm}$`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Trung điểm của đoạn thẳng chia đoạn thẳng đó thành hai phần bằng nhau.`,
                            `Công thức: $AM = MB = \\frac{AB}{2}$.`
                        ];
                        solutionHtml = `Vì $M$ là trung điểm của đoạn thẳng $AB$ nên:<br>$AM = MB = \\frac{AB}{2} = \\frac{${ab}}{2} = ${ans}\\text{ cm}$.`;
                    } else {
                        const am = this.randomInt(3, 9);
                        const ab = am * 2;
                        questionText = `Cho điểm $M$ nằm giữa hai điểm $A$ và $B$ sao cho $AM = MB = ${am}\\text{ cm}$. Tính độ dài đoạn thẳng $AB$ và cho biết $M$ có là trung điểm của $AB$ không?`;
                        options = [
                            `$AB = ${ab}\\text{ cm}$, $M$ là trung điểm của $AB$`,
                            `$AB = ${ab}\\text{ cm}$, $M$ không là trung điểm của $AB$`,
                            `$AB = ${am}\\text{ cm}$, $M$ là trung điểm của $AB$`,
                            `$AB = ${ab + 2}\\text{ cm}$, $M$ là trung điểm của $AB$`
                        ];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Vì $M$ nằm giữa $A$ và $B$ nên $AB = AM + MB$.`,
                            `Điểm $M$ nằm giữa và cách đều hai đầu mút ($AM = MB$) thì $M$ chính là trung điểm của đoạn thẳng $AB$.`
                        ];
                        solutionHtml = `Vì $M$ nằm giữa hai điểm $A$ và $B$ nên:<br>$AB = AM + MB = ${am} + ${am} = ${ab}\\text{ cm}$.<br>Lại có $AM = MB = ${am}\\text{ cm}$ nên $M$ cách đều hai đầu mút $A$ và $B$. Do đó, $M$ là trung điểm của đoạn thẳng $AB$.`;
                    }
                    tip = "Trung điểm của đoạn thẳng là điểm nằm giữa và cách đều hai đầu mút của đoạn thẳng đó.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const am = this.randomInt(4, 12);
                        const ab = am * 2;
                        questionText = `Cho điểm $M$ là trung điểm của đoạn thẳng $AB$. Biết $AM = ${am}\\text{ cm}$. Tính độ dài đoạn thẳng $AB$.`;
                        options = [`$${ab}\\text{ cm}$`, `$${am}\\text{ cm}$`, `$${am + 2}\\text{ cm}$`, `$${am / 2}\\text{ cm}$`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Vì $M$ là trung điểm của $AB$ nên độ dài đoạn thẳng $AB$ gấp đôi độ dài đoạn thẳng $AM$.`,
                            `Công thức: $AB = 2 \\cdot AM$.`
                        ];
                        solutionHtml = `Vì $M$ là trung điểm của đoạn thẳng $AB$ nên ta có:<br>$AB = 2 \\cdot AM = 2 \\cdot ${am} = ${ab}\\text{ cm}$.`;
                    } else {
                        const ab = this.randomInt(5, 12) * 2;
                        const am = ab / 2;
                        questionText = `Cho đoạn thẳng $AB = ${ab}\\text{ cm}$. Điểm $M$ thuộc đoạn thẳng $AB$ sao cho $AM = ${am}\\text{ cm}$. Hỏi khẳng định nào sau đây là **đúng nhất**?`;
                        options = [
                            `$M$ là trung điểm của $AB$ và $MB = ${am}\\text{ cm}$`,
                            `$M$ không là trung điểm của $AB$ và $MB = ${am}\\text{ cm}$`,
                            `$M$ là trung điểm của $AB$ và $MB = ${am - 2}\\text{ cm}$`,
                            `$M$ nằm ngoài đoạn thẳng $AB$`
                        ];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Vì $M$ thuộc đoạn thẳng $AB$ nên $M$ nằm giữa $A$ và $B$. Ta có $AM + MB = AB$.`,
                            `Tính $MB = AB - AM$. So sánh $AM$ và $MB$ để kết luận về trung điểm.`
                        ];
                        solutionHtml = `Vì điểm $M$ thuộc đoạn thẳng $AB$ nên $M$ nằm giữa $A$ và $B$.<br>Ta có: $AM + MB = AB \\rightarrow ${am} + MB = ${ab} \\rightarrow MB = ${ab} - ${am} = ${am}\\text{ cm}$.<br>Vì $M$ nằm giữa $A, B$ và $AM = MB = ${am}\\text{ cm}$ nên $M$ là trung điểm của đoạn thẳng $AB$.`;
                    }
                    tip = "Độ dài đoạn thẳng lớn gấp đôi khoảng cách từ trung điểm đến một đầu mút.";
                } else { // kho
                    if (variant === 1) {
                        const ab = this.randomInt(3, 6) * 4;
                        const m1 = ab / 2;
                        const m2 = m1 / 2;
                        const askType = this.randomInt(1, 2); // 1: M2M3, 2: M2B
                        if (askType === 1) {
                            const ans = ab / 2;
                            questionText = `Cho đoạn thẳng $AB = ${ab}\\text{ cm}$. Gọi $M_1$ là trung điểm của $AB$, $M_2$ là trung điểm của đoạn thẳng $AM_1$, và $M_3$ là trung điểm của đoạn thẳng $M_1B$. Tính độ dài đoạn thẳng $M_2M_3$.`;
                            options = [`$${ans}\\text{ cm}$`, `$${ans - 2}\\text{ cm}$`, `$${ans + 2}\\text{ cm}$`, `$${m2}\\text{ cm}$`];
                            // Removed inner shuffle Ch8
                            hints = [
                                `Tính độ dài $AM_1$ và $M_1B$: vì $M_1$ là trung điểm $AB$ nên $AM_1 = M_1B = \\frac{AB}{2} = ${m1}\\text{ cm}$.`,
                                `Tính độ dài $M_2M_1$ và $M_1M_3$: tương ứng là một nửa của $AM_1$ và $M_1B$.`,
                                `Vì $M_1$ nằm giữa $M_2$ và $M_3$ nên $M_2M_3 = M_2M_1 + M_1M_3$.`
                            ];
                            solutionHtml = `Vì $M_1$ là trung điểm của $AB$ nên:<br>$AM_1 = M_1B = \\frac{AB}{2} = \\frac{${ab}}{2} = ${m1}\\text{ cm}$.<br>Vì $M_2$ là trung điểm của $AM_1$ nên:<br>$M_2M_1 = \\frac{AM_1}{2} = \\frac{${m1}}{2} = ${m2}\\text{ cm}$.<br>Vì $M_3$ là trung điểm của $M_1B$ nên:<br>$M_1M_3 = \\frac{M_1B}{2} = \\frac{${m1}}{2} = ${m2}\\text{ cm}$.<br>Vì điểm $M_1$ nằm giữa hai điểm $M_2$ và $M_3$ nên ta có:<br>$M_2M_3 = M_2M_1 + M_1M_3 = ${m2} + ${m2} = ${ans}\\text{ cm}$.`;
                        } else {
                            const ans = (ab * 3) / 4;
                            questionText = `Cho đoạn thẳng $AB = ${ab}\\text{ cm}$. Gọi $M_1$ là trung điểm của $AB$, và $M_2$ là trung điểm của đoạn thẳng $AM_1$. Tính độ dài đoạn thẳng $M_2B$.`;
                            options = [`$${ans}\\text{ cm}$`, `$${m1}\\text{ cm}$`, `$${ans - 2}\\text{ cm}$`, `$${ab - 2}\\text{ cm}$`];
                            // Removed inner shuffle Ch8
                            hints = [
                                `Tính độ dài $AM_1$ và $M_1B$: vì $M_1$ là trung điểm $AB$ nên $AM_1 = M_1B = \\frac{AB}{2} = ${m1}\\text{ cm}$.`,
                                `Tính độ dài $M_2M_1$: vì $M_2$ là trung điểm $AM_1$ nên $M_2M_1 = \\frac{AM_1}{2} = ${m2}\\text{ cm}$.`,
                                `Vì $M_1$ nằm giữa $M_2$ và $B$ nên $M_2B = M_2M_1 + M_1B$.`
                            ];
                            solutionHtml = `Vì $M_1$ là trung điểm của $AB$ nên:<br>$AM_1 = M_1B = \\frac{AB}{2} = \\frac{${ab}}{2} = ${m1}\\text{ cm}$.<br>Vì $M_2$ là trung điểm của $AM_1$ nên:<br>$M_2M_1 = \\frac{AM_1}{2} = \\frac{${m1}}{2} = ${m2}\\text{ cm}$.<br>Vì điểm $M_1$ nằm giữa hai điểm $M_2$ và $B$ nên ta có:<br>$M_2B = M_2M_1 + M_1B = ${m2} + ${m1} = ${ans}\\text{ cm}$.`;
                        }
                    } else {
                        const ab = this.randomInt(3, 5) * 2;
                        const ac = this.randomInt(1, 2) * 2;
                        const ans1 = (ab + ac) / 2;
                        const ans2 = (ab - ac) / 2;
                        questionText = `Cho ba điểm $A, B, C$ thẳng hàng biết $AB = ${ab}\\text{ cm}$ và $AC = ${ac}\\text{ cm}$. Gọi $M$ là trung điểm của đoạn thẳng $BC$. Tính độ dài đoạn thẳng $AM$.`;
                        options = [
                            `$${ans1}\\text{ cm}$ hoặc $${ans2}\\text{ cm}$`,
                            `$${ans1}\\text{ cm}$`,
                            `$${ans2}\\text{ cm}$`,
                            `$${ans1 + 1}\\text{ cm}$ hoặc $${ans2 + 1}\\text{ cm}$`
                        ];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Vì đề bài không nêu rõ thứ tự các điểm nên ta phải xét hai trường hợp thẳng hàng của điểm $C$ so với đoạn thẳng $AB$.`,
                            `Trường hợp 1: $C$ nằm giữa $A$ và $B$. Khi đó $BC = AB - AC = ${ab - ac}\\text{ cm}$. Tìm $M$ là trung điểm $BC$ rồi tính $AM = AC + CM$.`,
                            `Trường hợp 2: $A$ nằm giữa $C$ và $B$. Khi đó $BC = AB + AC = ${ab + ac}\\text{ cm}$. Tìm $M$ là trung điểm $BC$ rồi tính $AM = MC - AC$.`
                        ];
                        solutionHtml = `Vì ba điểm $A, B, C$ thẳng hàng nên ta có hai trường hợp xảy ra:<br>- **Trường hợp 1:** Điểm $C$ nằm giữa $A$ và $B$. Ta có:<br>$BC = AB - AC = ${ab} - ${ac} = ${ab - ac}\\text{ cm}$.<br>Vì $M$ là trung điểm của $BC$ nên $MC = \\frac{BC}{2} = \\frac{${ab - ac}}{2} = ${ (ab - ac) / 2 }\\text{ cm}$.<br>Khi đó: $AM = AC + MC = ${ac} + ${ (ab - ac) / 2 } = ${ans1}\\text{ cm}$.<br>- **Trường hợp 2:** Điểm $A$ nằm giữa $C$ và $B$. Ta có:<br>$BC = AB + AC = ${ab} + ${ac} = ${ab + ac}\\text{ cm}$.<br>Vì $M$ là trung điểm của $BC$ nên $MC = \\frac{BC}{2} = \\frac{${ab + ac}}{2} = ${ (ab + ac) / 2 }\\text{ cm}$.<br>Vì $A$ nằm giữa $C$ và $M$ nên: $AM = MC - AC = ${ (ab + ac) / 2 } - ${ac} = ${ans2}\\text{ cm}$.<br>Vậy $AM$ có độ dài bằng $${ans1}\\text{ cm}$ hoặc $${ans2}\\text{ cm}$.`;
                    }
                    tip = "Khi gặp bài toán thẳng hàng mà chưa rõ thứ tự các điểm, hãy luôn chia các trường hợp nằm trong và nằm ngoài đoạn thẳng.";
                }
                break;
            }
            case "goc": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const types = ["nhọn", "vuông", "tù", "bẹt"];
                        const type = types[this.randomInt(0, 3)];
                        let ans, desc;
                        if (type === "nhọn") {
                            ans = "lớn hơn $0^\\circ$ và nhỏ hơn $90^\\circ$";
                            desc = "Góc nhọn là góc có số đo lớn hơn $0^\\circ$ và nhỏ hơn $90^\\circ$.";
                        } else if (type === "vuông") {
                            ans = "bằng $90^\\circ$";
                            desc = "Góc vuông là góc có số đo bằng $90^\\circ$.";
                        } else if (type === "tù") {
                            ans = "lớn hơn $90^\\circ$ và nhỏ hơn $180^\\circ$";
                            desc = "Góc tù là góc có số đo lớn hơn $90^\\circ$ và nhỏ hơn $180^\\circ$.";
                        } else {
                            ans = "bằng $180^\\circ$";
                            desc = "Góc bẹt là góc có số đo bằng $180^\\circ$.";
                        }
                        questionText = `Góc ${type} là góc có số đo:`;
                        options = [
                            `${ans}`,
                            `bằng $90^\\circ$`,
                            `bằng $180^\\circ$`,
                            `lớn hơn $0^\\circ$ và nhỏ hơn $90^\\circ$`,
                            `lớn hơn $90^\\circ$ và nhỏ hơn $180^\\circ$`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`nhỏ hơn $180^\\circ$`);
                        }
                        // Removed inner shuffle Ch8
                        hints = [
                            `Hãy nhớ lại định nghĩa các loại góc: góc nhọn, góc vuông, góc tù và góc bẹt.`,
                            `Góc vuông có số đo là $90^\\circ$. Góc bẹt có số đo là $180^\\circ$.`
                        ];
                        solutionHtml = `${desc}`;
                    } else {
                        const deg = this.randomInt(1, 4) === 1 ? this.randomInt(15, 85) : (this.randomInt(1, 3) === 1 ? 90 : (this.randomInt(1, 2) === 1 ? this.randomInt(95, 175) : 180));
                        let ans;
                        if (deg < 90) ans = "Góc nhọn";
                        else if (deg === 90) ans = "Góc vuông";
                        else if (deg < 180) ans = "Góc tù";
                        else ans = "Góc bẹt";
                        
                        questionText = `Góc có số đo bằng $${deg}^\\circ$ là loại góc nào?`;
                        options = [`${ans}`, `Góc nhọn`, `Góc vuông`, `Góc tù`, `Góc bẹt`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`Góc không xác định`);
                        }
                        // Removed inner shuffle Ch8
                        hints = [
                            `So sánh số đo $${deg}^\\circ$ với các mốc đặc biệt $90^\\circ$ và $180^\\circ$.`,
                            `Nhỏ hơn $90^\\circ$: góc nhọn; bằng $90^\\circ$: góc vuông; nằm giữa $90^\\circ$ và $180^\\circ$: góc tù; bằng $180^\\circ$: góc bẹt.`
                        ];
                        solutionHtml = `Vì $${deg}^\\circ$ ${deg < 90 ? '< 90^\\circ' : (deg === 90 ? '= 90^\\circ' : (deg < 180 ? '> 90^\\circ \\text{ và } < 180^\\circ' : '= 180^\\circ'))}$ nên đây là **${ans.toLowerCase()}**.`;
                    }
                    tip = "Ghi nhớ các mốc: Nhọn (< 90°) < Vuông (= 90°) < Tù (90° - 180°) < Bẹt (= 180°).";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const n = this.randomInt(5, 9);
                        const angles = (n * (n - 1)) / 2;
                        questionText = `Cho $${n}$ tia chung gốc (không có tia nào trùng nhau). Có tất cả bao nhiêu góc được tạo thành từ các tia này?`;
                        options = [`$${angles}$ góc`, `$${n}$ góc`, `$${angles - 2}$ góc`, `$${n * 2}$ góc`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Mỗi cặp tia chung gốc tạo thành một góc.`,
                            `Số góc tạo thành từ $n$ tia chung gốc là: $\\frac{n(n-1)}{2}$.`,
                            `Áp dụng công thức với $n = ${n}$.`
                        ];
                        solutionHtml = `Số góc tạo thành từ $${n}$ tia chung gốc là:<br>$\\frac{${n} \\cdot (${n} - 1)}{2} = \\frac{${n} \\cdot ${n-1}}{2} = ${angles}$ góc.`;
                    } else {
                        const pts = [5, 6, 7, 8, 9];
                        const n = pts[this.randomInt(0, pts.length - 1)];
                        const angles = (n * (n - 1)) / 2;
                        questionText = `Cho trước một số tia chung gốc phân biệt. Biết người ta đếm được tất cả $${angles}$ góc được tạo thành từ các tia đó. Hỏi ban đầu có bao nhiêu tia chung gốc?`;
                        options = [`$${n}$ tia`, `$${n - 1}$ tia`, `$${n + 1}$ tia`, `$${angles / 2}$ tia`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Áp dụng công thức số góc từ $n$ tia chung gốc: $\\frac{n(n-1)}{2} = ${angles}$.`,
                            `Suy ra $n(n-1) = ${angles * 2}$.`,
                            `Tìm hai số tự nhiên liên tiếp có tích bằng $${angles * 2}$.`
                        ];
                        solutionHtml = `Gọi số tia chung gốc ban đầu là $n$ ($n \\in \\mathbb{N}, n \\ge 2$).<br>Ta có công thức số góc tạo thành là: $\\frac{n(n-1)}{2} = ${angles} \\rightarrow n(n-1) = ${angles * 2}$.<br>Vì $${angles * 2} = ${n} \\cdot ${n-1}$, nên suy ra $n = ${n}$. Vậy ban đầu có $${n}$ tia chung gốc.`;
                    }
                    tip = "Số góc từ n tia chung gốc tính bằng công thức n(n-1)/2, tương tự như số đoạn thẳng từ n điểm thẳng hàng.";
                } else { // kho
                    if (variant === 1) {
                        const n = this.randomInt(5, 8);
                        const total = (n * (n - 1)) / 2;
                        const ans = total - 1;
                        questionText = `Cho $${n}$ tia chung gốc, trong đó có đúng hai tia đối nhau (tạo thành một góc bẹt). Hỏi có tất cả bao nhiêu góc nhỏ hơn góc bẹt được tạo thành từ các tia này?`;
                        options = [`$${ans}$ góc`, `$${total}$ góc`, `$${ans - 2}$ góc`, `$${n * 2}$ góc`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Tính tổng số góc tạo thành từ $${n}$ tia chung gốc bằng công thức: $\\frac{n(n-1)}{2}$.`,
                            `Vì có đúng hai tia đối nhau nên chỉ có đúng $1$ góc bẹt được tạo thành.`,
                            `Số góc nhỏ hơn góc bẹt sẽ bằng tổng số góc trừ đi góc bẹt đó.`
                        ];
                        solutionHtml = `Tổng số góc tạo thành từ $${n}$ tia chung gốc là:<br>$\\frac{${n} \\cdot (${n} - 1)}{2} = ${total}$ góc.<br>Vì có đúng hai tia đối nhau tạo thành góc bẹt, nên trên hình vẽ chỉ có đúng $1$ góc bẹt.<br>Số góc nhỏ hơn góc bẹt được tạo thành là:<br>${total} - 1 = ${ans}$ góc.`;
                    } else {
                        const n = this.randomInt(3, 6);
                        const ans = 2 * n * (n - 1);
                        const totalRays = 2 * n;
                        const totalAngles = (totalRays * (totalRays - 1)) / 2;
                        questionText = `Cho $${n}$ đường thẳng phân biệt cùng cắt nhau tại một điểm. Có bao nhiêu góc nhỏ hơn góc bẹt được tạo thành từ các đường thẳng này?`;
                        options = [`$${ans}$ góc`, `$${totalAngles}$ góc`, `$${ans + n}$ góc`, `$${n * (n-1)}$ góc`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Mỗi đường thẳng đi qua giao điểm tạo thành $2$ tia đối nhau. Vậy $${n}$ đường thẳng tạo thành $2 \\cdot ${n} = ${totalRays}$ tia chung gốc.`,
                            `Tính tổng số góc tạo thành từ $${totalRays}$ tia chung gốc: $\\frac{2n(2n-1)}{2}$.`,
                            `Trừ đi số góc bẹt (mỗi đường thẳng tạo ra đúng $1$ góc bẹt, tức là có $${n}$ góc bẹt).`
                        ];
                        solutionHtml = `Giao điểm của $${n}$ đường thẳng tạo ra $2 \\cdot ${n} = ${totalRays}$ tia chung gốc.<br>Tổng số góc được tạo thành từ $${totalRays}$ tia này là:<br>$\\frac{${totalRays} \\cdot (${totalRays} - 1)}{2} = \\frac{${totalRays} \\cdot ${totalRays - 1}}{2} = ${totalAngles}$ góc.<br>Trong đó, mỗi đường thẳng trong số $${n}$ đường thẳng tạo ra đúng $1$ góc bẹt. Vậy có tất cả $${n}$ góc bẹt.<br>Số góc nhỏ hơn góc bẹt tạo thành là:<br>${totalAngles} - ${n} = ${ans}$ góc.`;
                    }
                    tip = "Với n đường thẳng cắt nhau tại 1 điểm, số góc khác góc bẹt là 2n(n-1).";
                }
                break;
            }
            case "so-do-goc": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = this.randomInt(25, 75);
                        let b = this.randomInt(25, 75);
                        while (b === a) {
                            b = this.randomInt(25, 75);
                        }
                        const ans = a + b;
                        const diff = Math.abs(a - b);
                        const w1 = (diff === a || diff === b) ? diff + 15 : diff;
                        const w2 = a;
                        const w3 = b;
                        questionText = `Cho tia $Oy$ nằm giữa hai tia $Ox$ và $Oz$. Biết góc $\\widehat{xOy} = ${a}^\\circ$ và $\\widehat{yOz} = ${b}^\\circ$. Tính số đo góc $\\widehat{xOz}$.`;
                        options = [`$${ans}^\\circ$`, `$${w1}^\\circ$`, `$${w2}^\\circ$`, `$${w3}^\\circ$`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Vì tia $Oy$ nằm giữa hai tia $Ox$ và $Oz$ nên ta có đẳng thức cộng góc: $\\widehat{xOy} + \\widehat{yOz} = \\widehat{xOz}$.`,
                            `Thay số vào: $\\widehat{xOz} = ${a}^\\circ + ${b}^\\circ$.`
                        ];
                        solutionHtml = `Vì tia $Oy$ nằm giữa hai tia $Ox$ và $Oz$ nên:<br>$\\widehat{xOz} = \\widehat{xOy} + \\widehat{yOz} = ${a}^\\circ + ${b}^\\circ = ${ans}^\\circ$.`;
                    } else {
                        // Loại bỏ a=90° để tránh ans=a=90° → 3 options trùng
                        const aListSoDo2 = [40, 50, 60, 70, 80, 100, 110, 120, 130, 140];
                        const a = aListSoDo2[this.randomInt(0, aListSoDo2.length - 1)];
                        const ans = 180 - a;
                        questionText = `Cho hai góc kề bù $\\widehat{xOy}$ và $\\widehat{yOz}$. Biết số đo góc $\\widehat{xOy} = ${a}^\\circ$. Tính số đo góc $\\widehat{yOz}$.`;
                        // Tránh trùng 90° nếu ans hoặc a bằng 90
                        const w3SoDoCoBan2 = (90 === ans || 90 === a) ? 95 : 90;
                        options = [`$${ans}^\\circ$`, `$${a}^\\circ$`, `$${w3SoDoCoBan2}^\\circ$`, `$${180 + a}^\\circ$`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Hai góc kề bù có tổng số đo bằng $180^\\circ$.`,
                            `Công thức: $\\widehat{xOy} + \\widehat{yOz} = 180^\\circ$.`
                        ];
                        solutionHtml = `Vì $\\widehat{xOy}$ và $\\widehat{yOz}$ là hai góc kề bù nên ta có:<br>$\\widehat{xOy} + \\widehat{yOz} = 180^\\circ \\rightarrow ${a}^\\circ + \\widehat{yOz} = 180^\\circ \\rightarrow \\widehat{yOz} = 180^\\circ - ${a}^\\circ = ${ans}^\\circ$.`;
                    }
                    tip = "Hai góc kề bù có tổng số đo bằng 180 độ. Tia nằm giữa hai tia khác cho đẳng thức cộng góc.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const hList = [2, 3, 4, 5, 8, 9, 10];
                        const h = hList[this.randomInt(0, hList.length - 1)];
                        const diff = Math.min(h, 12 - h);
                        const ans = diff * 30;
                        questionText = `Góc tạo bởi hai kim đồng hồ (kim giờ và kim phút) lúc **${h} giờ đúng** có số đo bằng bao nhiêu độ?`;
                        options = [`$${ans}^\\circ$`, `$${h * 30}^\\circ$`, `$${(12 - h) * 30}^\\circ$`, `$90^\\circ$`];
                        options = [...new Set(options)];
                        // Phần tử dự phòng đa dạng hơn để tránh lặp vô hạn
                        const fallbacks5982 = [45, 60, 120, 135, 150, 180, 210, 225].map(v => `$${v}^\\circ$`);
                        let fbIdx = 0;
                        while (options.length < 4) {
                            const candidate = (fbIdx < fallbacks5982.length) ? fallbacks5982[fbIdx++] : `$${(fbIdx++) * 15}^\\circ$`;
                            if (!options.includes(candidate)) options.push(candidate);
                        }
                        // Removed inner shuffle Ch8
                        hints = [
                            `Mặt đồng hồ hình tròn chia làm 12 khoảng số đều nhau tương ứng với $360^\\circ$.`,
                            `Mỗi khoảng số (tương ứng 1 giờ) có số đo góc là: $360^\\circ : 12 = 30^\\circ$.`,
                            `Tính số khoảng cách ngắn nhất giữa kim phút (chỉ số 12) và kim giờ (chỉ số ${h}) để tính số đo góc.`
                        ];
                        solutionHtml = `Mỗi khoảng số trên mặt đồng hồ tương ứng với góc xoay:<br>$360^\\circ : 12 = 30^\\circ$.<br>Lúc ${h} giờ đúng, kim phút chỉ số 12, kim giờ chỉ số ${h}. Khoảng cách ngắn nhất giữa hai kim là ${diff} khoảng số.<br>Do đó góc tạo thành là:<br>${diff} \\cdot 30^\\circ = ${ans}^\\circ$.`;
                    } else {
                        const a = this.randomInt(3, 6) * 20; // 60, 80, 100, 120
                        const ans = (a * 3) / 4;
                        questionText = `Cho góc $\\widehat{xOy} = ${a}^\\circ$. Vẽ tia phân giác $Ot$ của góc $\\widehat{xOy}$, sau đó vẽ tia phân giác $Oz$ của góc $\\widehat{xOt}$. Tính số đo góc $\\widehat{zOy}$.`;
                        options = [`$${ans}^\\circ$`, `$${a / 2}^\\circ$`, `$${a / 4}^\\circ$`, `$${a - 10}^\\circ$`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Vì $Ot$ là tia phân giác của $\\widehat{xOy}$ nên $\\widehat{xOt} = \\widehat{tOy} = \\frac{\\widehat{xOy}}{2} = \\frac{${a}^\\circ}{2}$.`,
                            `Vì $Oz$ là tia phân giác của $\\widehat{xOt}$ nên $\\widehat{zOt} = \\frac{\\widehat{xOt}}{2}$.`,
                            `Vì $Ot$ nằm giữa $Oz$ và $Oy$ nên ta cộng góc: $\\widehat{zOy} = \\widehat{zOt} + \\widehat{tOy}$.`
                        ];
                        solutionHtml = `Ta tính số đo các góc con:<br>- Tia $Ot$ là phân giác của $\\widehat{xOy}$ nên:<br>$\\widehat{xOt} = \\widehat{tOy} = \\frac{\\widehat{xOy}}{2} = \\frac{${a}^\\circ}{2} = ${a / 2}^\\circ$.<br>- Tia $Oz$ là phân giác của $\\widehat{xOt}$ nên:<br>$\\widehat{zOt} = \\frac{\\widehat{xOt}}{2} = \\frac{${a / 2}^\\circ}{2} = ${a / 4}^\\circ$.<br>- Vì tia $Ot$ nằm giữa hai tia $Oz$ và $Oy$ nên:<br>$\\widehat{zOy} = \\widehat{zOt} + \\widehat{tOy} = ${a / 4}^\\circ + ${a / 2}^\\circ = ${ans}^\\circ$.`;
                    }
                    tip = "Tia phân giác chia một góc thành hai góc bằng nhau và bằng một nửa góc ban đầu.";
                } else { // kho
                    if (variant === 1) {
                        const times = [
                            { h: 8, m: 20, ans: 130, desc: "Lúc 8 giờ 20 phút: Kim phút chỉ đúng số 4. Kim giờ đã đi qua số 8 được 20/60 = 1/3 khoảng giờ. Khoảng cách giữa kim giờ và kim phút là 4 khoảng giờ cộng thêm 1/3 khoảng giờ. Góc tạo thành: (4 + 1/3) * 30 = 130 độ." },
                            { h: 2, m: 30, ans: 105, desc: "Lúc 2 giờ 30 phút: Kim phút chỉ đúng số 6. Kim giờ đã đi qua số 2 được 30/60 = 1/2 khoảng giờ. Khoảng cách giữa kim giờ và kim phút là 3,5 khoảng giờ. Góc tạo thành: 3,5 * 30 = 105 độ." },
                            { h: 4, m: 10, ans: 65, desc: "Lúc 4 giờ 10 phút: Kim phút chỉ đúng số 2. Kim giờ đã đi qua số 4 được 10/60 = 1/6 khoảng giờ. Khoảng cách giữa kim giờ và kim phút là 2 khoảng giờ cộng thêm 1/6 khoảng giờ. Góc tạo thành: (2 + 1/6) * 30 = 65 độ." }
                        ];
                        const t = times[this.randomInt(0, times.length - 1)];
                        questionText = `Tính góc tạo bởi kim giờ và kim phút của đồng hồ lúc **${t.h} giờ ${t.m} phút** (lấy góc nhỏ hơn hoặc bằng $180^\\circ$).`;
                        options = [`$${t.ans}^\\circ$`, `$${t.ans - 15}^\\circ$`, `$${t.ans + 15}^\\circ$`, `$90^\\circ$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const candidate = `$${this.randomInt(1, 3) * 40}^\\circ$`;
                            if (!options.includes(candidate)) options.push(candidate);
                        }
                        // Removed inner shuffle Ch8
                        hints = [
                            `Lưu ý lúc này kim giờ không chỉ đúng vạch số cũ mà đã di chuyển đi một chút tùy theo số phút.`,
                            `Trong 1 phút: kim phút quay được $6^\\circ$, kim giờ quay được $0,5^\\circ$.`,
                            `Hoặc tính số khoảng giờ lẻ giữa kim giờ và kim phút rồi nhân với $30^\\circ$.`
                        ];
                        solutionHtml = `Phân tích vị trí các kim lúc ${t.h} giờ ${t.m} phút:<br>${t.desc}`;
                    } else {
                        questionText = `Cho hai góc kề bù $\\widehat{xOy}$ và $\\widehat{yOz}$. Gọi $Om$ là tia phân giác của góc $\\widehat{xOy}$, và $On$ là tia phân giác của góc $\\widehat{yOz}$. Tính số đo góc $\\widehat{mOn}$.`;
                        options = [`$90^\\circ$`, `$180^\\circ$`, `$45^\\circ$`, `$60^\\circ$`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Hai góc kề bù $\\widehat{xOy} + \\widehat{yOz} = 180^\\circ$.`,
                            `Tia phân giác chia đôi mỗi góc: $\\widehat{mOy} = \\frac{\\widehat{xOy}}{2}$ và $\\widehat{yOn} = \\frac{\\widehat{yOz}}{2}$.`,
                            `Vì hai góc kề bù nên tia $Oy$ nằm giữa hai tia $Om$ và $On$. Cộng hai góc con lại.`
                        ];
                        solutionHtml = `Vì $\\widehat{xOy}$ và $\\widehat{yOz}$ là hai góc kề bù nên:<br>$\\widehat{xOy} + \\widehat{yOz} = 180^\\circ$.<br>Vì $Om$ là tia phân giác của $\\widehat{xOy}$ nên: $\\widehat{mOy} = \\frac{\\widehat{xOy}}{2}$.<br>Vì $On$ là tia phân giác của $\\widehat{yOz}$ nên: $\\widehat{yOn} = \\frac{\\widehat{yOz}}{2}$.<br>Vì hai góc kề bù và có các tia phân giác nằm ở hai phía đối với cạnh chung $Oy$ nên $Oy$ nằm giữa $Om$ và $On$. Ta có:<br>$\\widehat{mOn} = \\widehat{mOy} + \\widehat{yOn} = \\frac{\\widehat{xOy}}{2} + \\frac{\\widehat{yOz}}{2} = \\frac{\\widehat{xOy} + \\widehat{yOz}}{2} = \\frac{180^\\circ}{2} = 90^\\circ$.`;
                    }
                    tip = "Góc tạo bởi hai tia phân giác của hai góc kề bù luôn luôn bằng 90 độ (góc vuông).";
                }
                break;
            }
            case "thu-thap-du-lieu": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        questionText = `Để khảo sát môn thể thao yêu thích của các bạn lớp 6A, bạn lớp trưởng ghi lại danh sách: <i>Bóng đá, Bóng rổ, Bóng đá, Cầu lông, Bóng bàn, Cầu lông, Bóng đá</i>. Dữ liệu này thuộc loại nào?`;
                        options = [`Dữ liệu không phải là số (dữ liệu chữ)`, `Dữ liệu là số (số liệu)`, `Dữ liệu hình ảnh`, `Dữ liệu âm thanh`];
                        this.shuffle(options);
                        hints = [
                            `Hãy xem các phần tử trong danh sách là chữ hay số.`,
                            `Bóng đá, Cầu lông, Bóng rổ... là các từ ngữ chỉ tên môn thể thao.`
                        ];
                        solutionHtml = `Dữ liệu ghi lại các môn thể thao yêu thích (Bóng đá, Cầu lông...) là các chữ/từ ngữ, nên thuộc loại dữ liệu không phải là số (dữ liệu chữ).`;
                    } else {
                        questionText = `Để thống kê điểm thi giữa kỳ môn Toán của tổ 1, bạn tổ trưởng ghi lại dãy số: $8; 9; 10; 7; 8; 6; 9$. Dữ liệu này thuộc loại nào?`;
                        options = [`Dữ liệu là số (số liệu)`, `Dữ liệu không phải là số (dữ liệu chữ)`, `Dữ liệu hình ảnh`, `Dữ liệu âm thanh`];
                        this.shuffle(options);
                        hints = [
                            `Hãy quan sát các phần tử trong danh sách thu được.`,
                            `Các giá trị $8; 9; 10...$ là các con số cụ thể biểu thị điểm số.`
                        ];
                        solutionHtml = `Dãy dữ liệu thu được gồm các con số cụ thể ($8; 9; 10...$) biểu thị điểm số, do đó đây là dữ liệu là số (số liệu).`;
                    }
                    tip = "Dữ liệu chữ gồm các từ ngữ mô tả; dữ liệu số (số liệu) gồm các con số thể hiện phép đo hoặc đếm.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        questionText = `Bình Minh điều tra nhiệt độ (đơn vị $^\\circ$C) lúc 12 giờ trưa từ thứ Hai đến thứ Sáu tuần trước và ghi lại: $32; 33; 35; 32; 34$. Trong các dữ liệu này, đâu là dữ liệu không hợp lý?`;
                        options = [`Không có dữ liệu nào không hợp lý`, `Nhiệt độ $35^\\circ$C`, `Nhiệt độ $32^\\circ$C`, `Tất cả các số liệu đều không hợp lý`];
                        this.shuffle(options);
                        hints = [
                            `Nhiệt độ thời tiết thực tế ở Việt Nam có thể dao động từ 32 đến 35 độ C vào mùa hè không?`,
                            `Các con số 32, 33, 35, 34 hoàn toàn nằm trong khoảng nhiệt độ bình thường thực tế lúc trưa.`
                        ];
                        solutionHtml = `Các nhiệt độ $32; 33; 35; 34$ đều là các số thực tế phản ánh nhiệt độ thời tiết lúc trưa mùa hè tại Việt Nam, nên không có dữ liệu nào không hợp lý.`;
                    } else {
                        const h = this.randomInt(135, 155);
                        const hErr = this.randomInt(240, 260);
                        questionText = `Điều tra về chiều cao (đơn vị cm) của 5 học sinh lớp 6, kết quả ghi lại là: $145; 150; ${hErr}; 148; 152$. Tìm số liệu không hợp lý trong danh sách và giải thích lý do?`;
                        options = [
                            `$${hErr}$ vì chiều cao học sinh lớp 6 bình thường không thể đạt tới $${hErr}\\text{ cm}$ (quá cao bất thường so với thực tế).`,
                            `$145$ vì học sinh lớp 6 phải cao ít nhất 150 cm.`,
                            `$150$ vì đây là số tròn chục.`,
                            `Không có dữ liệu nào không hợp lý.`
                        ];
                        this.shuffle(options);
                        hints = [
                            `Chiều cao thông thường của học sinh lớp 6 dao động từ khoảng 130 cm đến 165 cm.`,
                            `Hãy xem trong danh sách có số đo nào vượt quá xa chiều cao thực tế của con người hay không.`
                        ];
                        solutionHtml = `Chiều cao của học sinh lớp 6 thông thường dao động trong khoảng $130\\text{ cm} - 165\\text{ cm}$. Số liệu $${hErr}\\text{ cm}$ là quá lớn và bất thường đối với chiều cao thực tế của một học sinh lớp 6 hiện nay. Do đó, số liệu $${hErr}$ là không hợp lý.`;
                    }
                    tip = "Kiểm tra tính hợp lý của số liệu dựa trên các giới hạn thực tế khoa học và đời sống.";
                } else { // kho
                    if (variant === 1) {
                        questionText = `Bình Minh khảo sát số thành viên trong gia đình của một số bạn trong lớp, thu được dãy số liệu: $4; 5; 3; 4; 0; 6; 15; 4$. Tìm các số liệu không hợp lý và giải thích lý do?`;
                        options = [
                            `$0$ và $15$ vì số thành viên trong gia đình phải lớn hơn 0 và số lượng $15$ người trong một gia đình học sinh hiện nay là quá lớn bất thường.`,
                            `Chỉ có số $0$ không hợp lý vì gia đình phải có ít nhất 1 người.`,
                            `Chỉ có số $15$ không hợp lý vì gia đình chỉ nên có từ 3 đến 6 người.`,
                            `Tất cả số liệu đều hợp lý.`
                        ];
                        this.shuffle(options);
                        hints = [
                            `Một gia đình của bạn học sinh tối thiểu phải có chính bạn đó (tức là số thành viên phải lớn hơn hoặc bằng 1).`,
                            `Xem xét tính phổ biến thực tế của số lượng thành viên trong gia đình ở độ tuổi học sinh (thường từ 2 đến 8 người, số lượng 15 người là quá lớn bất thường).`
                        ];
                        solutionHtml = `Số thành viên trong gia đình phải lớn hơn 0 vì tối thiểu gia đình phải có chính bạn học sinh đó, nên số $0$ là không hợp lý.<br>Đồng thời, số lượng $15$ thành viên trong một gia đình học sinh hiện nay là cực kỳ hiếm và quá lớn bất thường so với thực tế đời sống xã hội. Do đó, các số liệu không hợp lý là $0$ và $15$.`;
                    } else {
                        questionText = `Khảo sát điểm kiểm tra môn Tiếng Anh (thang điểm 10) của tổ 2 thu được kết quả: $7,5; 8,0; 11,5; 9,0; -1,0; 10,0$. Hãy tìm tất cả các dữ liệu không hợp lý.`;
                        options = [
                            `$11,5$ và $-1,0$ vì điểm số thang điểm 10 không thể lớn hơn 10 hoặc nhỏ hơn 0.`,
                            `Chỉ có $-1,0$ vì điểm số không thể là số âm.`,
                            `Chỉ có $11,5$ vì điểm số tối đa chỉ là 10.`,
                            `Tất cả số liệu đều hợp lý.`
                        ];
                        this.shuffle(options);
                        hints = [
                            `Thang điểm kiểm tra chuẩn trong giáo dục Việt Nam là thang điểm 10.`,
                            `Điểm số hợp lý phải nằm trong đoạn từ $0$ đến $10$. Hãy tìm những số nằm ngoài đoạn này.`
                        ];
                        solutionHtml = `Điểm số kiểm tra theo thang điểm 10 bắt buộc phải nằm trong khoảng từ $0$ đến $10$.<br>- Số $11,5 > 10$ là không hợp lý.<br>- Số $-1,0 < 0$ là không hợp lý.<br>Vậy các dữ liệu không hợp lý là $11,5$ và $-1,0$.`;
                    }
                    tip = "Phát hiện số liệu không hợp lý bằng cách đối chiếu với thang đo chuẩn và khoảng giới hạn thực tế của đối tượng.";
                }
                break;
            }
            case "bang-thong-ke-bieu-do-tranh": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const factor = this.randomInt(3, 8);
                        const count = this.randomInt(4, 7);
                        const ans = factor * count;
                        questionText = `Trong một biểu đồ tranh, nếu một biểu tượng 🌸 đại diện cho $${factor}$ học sinh đạt điểm tốt. Hỏi nếu có $${count}$ biểu tượng 🌸 thì biểu diễn cho bao nhiêu học sinh đạt điểm tốt?`;
                        // Tránh trùng khi factor = count: dịch count thành count+1
                        const w4BieuDoTranh1 = (factor === count) ? count + 1 : count;
                        // Tránh trùng khi factor+count = ans hoặc factor+count = w4BieuDoTranh1
                        const w2BieuDoTranh1 = ((factor + count === ans) || (factor + count === w4BieuDoTranh1)) ? factor + count + 2 : factor + count;
                        options = [`$${ans}$ học sinh`, `$${w2BieuDoTranh1}$ học sinh`, `$${factor}$ học sinh`, `$${w4BieuDoTranh1}$ học sinh`];
                        this.shuffle(options);
                        hints = [
                            `Mỗi biểu tượng đại diện cho $${factor}$ học sinh.`,
                            `Lấy số lượng biểu tượng nhân với giá trị đại diện của một biểu tượng: $${count} \\cdot ${factor}$.`
                        ];
                        solutionHtml = `Vì mỗi biểu tượng 🌸 đại diện cho $${factor}$ học sinh, nên $${count}$ biểu tượng 🌸 biểu diễn cho số học sinh là:<br>$${count} \\cdot ${factor} = ${ans}$ học sinh.`;
                    } else {
                        const factor = [4, 5, 8, 10][this.randomInt(0, 3)];
                        const count = this.randomInt(3, 7);
                        const total = factor * count;
                        questionText = `Biểu đồ tranh biểu diễn số học sinh giỏi của lớp 6A. Chú giải ghi: mỗi biểu tượng 🌟 đại diện cho $${factor}$ học sinh. Hỏi để biểu diễn $${total}$ học sinh giỏi, ta cần vẽ bao nhiêu biểu tượng 🌟?`;
                        // Tránh trùng khi count === factor: dùng biểu thức tam phân
                        const w3BieuDo = (factor === count) ? factor + 2 : factor;
                        // Tránh trùng khi count+1 === total hoặc count+1 === w3BieuDo
                        const w4BieuDo = ((count + 1 === total) || (count + 1 === w3BieuDo)) ? count + 3 : count + 1;
                        options = [`$${count}$ biểu tượng`, `$${total}$ biểu tượng`, `$${w3BieuDo}$ biểu tượng`, `$${w4BieuDo}$ biểu tượng`];
                        this.shuffle(options);
                        hints = [
                            `Đây là bài toán chia ngược: lấy tổng số học sinh chia cho số học sinh mà một ngôi sao đại diện.`,
                            `Phép tính: $${total} : ${factor}$.`
                        ];
                        solutionHtml = `Để biểu diễn $${total}$ học sinh giỏi, số biểu tượng 🌟 cần vẽ là:<br>$${total} : ${factor} = ${count}$ biểu tượng.`;
                    }
                    tip = "Luôn đọc kỹ phần chú giải ở góc biểu đồ tranh để biết mỗi hình ảnh đại diện cho bao nhiêu đơn vị thực tế.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const mon = this.randomInt(2, 4);
                        const tue = this.randomInt(3, 5);
                        const factor = [5, 10, 20][this.randomInt(0, 2)];
                        const ans = (mon + tue) * factor;
                        questionText = `Biểu đồ tranh thống kê số lượng điện thoại bán ra của cửa hàng: thứ Hai có $${mon}$ hình 📱, thứ Ba có $${tue}$ hình 📱. Chú giải ghi: mỗi hình 📱 đại diện cho $${factor}$ chiếc điện thoại. Hỏi tổng số điện thoại cửa hàng bán được trong hai ngày đó là bao nhiêu?`;
                        options = [`$${ans}$ chiếc`, `$${mon + tue}$ chiếc`, `$${mon * factor}$ chiếc`, `$${tue * factor}$ chiếc`];
                        this.shuffle(options);
                        hints = [
                            `Tính tổng số hình 📱 vẽ trong cả hai ngày: $${mon} + ${tue} = ${mon + tue}$ hình.`,
                            `Nhân tổng số hình với số điện thoại đại diện cho mỗi hình: $(${mon} + ${tue}) \\cdot ${factor}$.`
                        ];
                        solutionHtml = `Tổng số hình vẽ 📱 trong cả hai ngày là:<br>$${mon} + ${tue} = ${mon + tue}$ hình.<br>Vì mỗi hình 📱 đại diện cho $${factor}$ chiếc điện thoại nên tổng số điện thoại bán được là:<br>$${mon + tue} \\cdot ${factor} = ${ans}$ chiếc điện thoại.`;
                    } else {
                        const aCount = this.randomInt(3, 5);
                        const bCount = aCount + this.randomInt(1, 3);
                        const factor = [10, 15, 20][this.randomInt(0, 2)];
                        const ans = (bCount - aCount) * factor;
                        questionText = `Biểu đồ tranh thống kê số lượng sách quyên góp: lớp 6A có $${aCount}$ hình 📚, lớp 6B có $${bCount}$ hình 📚. Biết mỗi hình 📚 đại diện cho $${factor}$ quyển sách. Lớp 6B quyên góp nhiều hơn lớp 6A bao nhiêu quyển sách?`;
                        options = [`$${ans}$ quyển`, `$${ans - factor}$ quyển`, `$${bCount - aCount}$ quyển`, `$${bCount * factor}$ quyển`];
                        this.shuffle(options);
                        hints = [
                            `Cách 1: Tính số hình nhiều hơn của lớp 6B so với lớp 6A: $${bCount} - ${aCount}$ hình, rồi nhân với $${factor}$.`,
                            `Cách 2: Tính số sách của từng lớp rồi trừ đi.`
                        ];
                        solutionHtml = `Lớp 6B có nhiều hơn lớp 6A số hình vẽ 📚 là:<br>$${bCount} - ${aCount} = ${bCount - aCount}$ hình.<br>Số sách lớp 6B quyên góp nhiều hơn lớp 6A là:<br>$${bCount - aCount} \\cdot ${factor} = ${ans}$ quyển sách.`;
                    }
                    tip = "So sánh hiệu số hình vẽ trước rồi nhân với chú giải sẽ giúp tính toán nhanh hơn.";
                } else { // kho
                    if (variant === 1) {
                        const t1 = this.randomInt(2, 4);
                        const t2 = t1 + this.randomInt(1, 2);
                        const factor = [6, 8, 10][this.randomInt(0, 2)];
                        const half = factor / 2;
                        const score1 = t1 * factor + half;
                        const score2 = t2 * factor;
                        const diff = Math.abs(score2 - score1);
                        const isMore = score2 > score1;
                        questionText = `Biểu đồ tranh biểu diễn số điểm 10 của lớp 6A: Tổ 1 có $${t1}$ hình 🌸 và thêm nửa hình 🌸; Tổ 2 có $${t2}$ hình 🌸. Chú giải ghi: mỗi hình 🌸 đại diện cho $${factor}$ điểm 10, nửa hình 🌸 đại diện cho $${half}$ điểm 10. Hỏi Tổ 2 nhiều hơn Tổ 1 bao nhiêu điểm 10?`;
                        options = [`$${diff}$ điểm 10`, `$${diff + 1}$ điểm 10`, `$${diff - 1}$ điểm 10`, `$${factor}$ điểm 10`];
                        this.shuffle(options);
                        hints = [
                            `Tính số điểm 10 của Tổ 1: $${t1}$ hình nguyên nhân với $${factor}$ cộng thêm $${half}$ điểm.`,
                            `Tính số điểm 10 của Tổ 2: $${t2}$ hình nguyên nhân với $${factor}$.`,
                            `Lấy số điểm của Tổ 2 trừ đi số điểm của Tổ 1.`
                        ];
                        solutionHtml = `Số điểm 10 của Tổ 1 là:<br>$${t1} \\cdot ${factor} + ${half} = ${score1}$ điểm 10.<br>Số điểm 10 của Tổ 2 là:<br>$${t2} \\cdot ${factor} = ${score2}$ điểm 10.<br>Tổ 2 nhiều hơn Tổ 1 số điểm 10 là:<br>$${score2} - ${score1} = ${diff}$ điểm 10.`;
                    } else {
                        const a = this.randomInt(2, 4);
                        const b = this.randomInt(2, 4);
                        const factor = [8, 12, 16][this.randomInt(0, 2)];
                        const half = factor / 2;
                        const total = (a + b) * factor + half;
                        questionText = `Biểu đồ tranh thống kê số lượng cây xanh tự làm của hai lớp: Lớp 6A vẽ $${a}$ hình nguyên 🌲 và 1 hình bán phần 🌲; Lớp 6B vẽ $${b}$ hình nguyên 🌲. Chú giải ghi: mỗi hình nguyên đại diện cho $${factor}$ cây, mỗi hình bán phần (nửa hình) đại diện cho $${half}$ cây. Tính tổng số cây trồng được của cả hai lớp.`;
                        options = [`$${total}$ cây`, `$${(a + b) * factor}$ cây`, `$${total - half}$ cây`, `$${total + half}$ cây`];
                        this.shuffle(options);
                        hints = [
                            `Đếm tổng số hình nguyên của cả hai lớp: $${a} + ${b} = ${a+b}$ hình.`,
                            `Tính số cây từ các hình nguyên: $${a+b} \\cdot ${factor}$.`,
                            `Cộng thêm số cây của 1 hình bán phần là $${half}$ cây.`
                        ];
                        solutionHtml = `Tổng số hình nguyên 🌲 vẽ được của cả hai lớp là: $${a} + ${b} = ${a+b}$ hình.<br>Số cây từ các hình nguyên này là: $${a+b} \\cdot ${factor} = ${(a+b)*factor}$ cây.<br>Cộng thêm $${half}$ cây từ hình bán phần của lớp 6A, tổng số cây trồng được của cả hai lớp là:<br>${(a+b)*factor} + ${half} = ${total}$ cây.`;
                    }
                    tip = "Chú ý kỹ sự khác biệt giữa ký hiệu đầy đủ (hình nguyên) và ký hiệu bán phần (nửa hình) trong biểu đồ tranh.";
                }
                break;
            }
            case "bieu-do-cot": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = this.randomInt(30, 45);
                        const b = this.randomInt(15, 25);
                        const c = this.randomInt(20, 29);
                        const maxVal = Math.max(a, b, c);
                        const minVal = Math.min(a, b, c);
                        const diff = maxVal - minVal;
                        const clbMax = maxVal === a ? "Âm nhạc" : (maxVal === b ? "Mỹ thuật" : "Thể thao");
                        questionText = `Biểu đồ cột biểu diễn số học sinh tham gia các câu lạc bộ (CLB) của khối 6: CLB Âm nhạc có $${a}$ học sinh, CLB Mỹ thuật có $${b}$ học sinh, CLB Thể thao có $${c}$ học sinh. CLB nào có số học sinh tham gia đông nhất và đông hơn CLB ít nhất bao nhiêu học sinh?`;
                        // Tránh trùng khi diff = minVal (option 1 và option 4 cùng là clbMax, đông hơn X)
                        const w4MinVal = (diff === minVal) ? minVal + 1 : minVal;
                        options = [
                            `CLB ${clbMax} đông nhất, đông hơn ${diff} học sinh`,
                            `CLB ${clbMax} đông nhất, đông hơn ${maxVal} học sinh`,
                            `CLB Thể thao đông nhất, đông hơn ${diff} học sinh`,
                            `CLB Âm nhạc đông nhất, đông hơn ${w4MinVal} học sinh`
                        ];
                        this.shuffle(options);
                        hints = [
                            `So sánh số lượng học sinh tham gia của 3 câu lạc bộ để tìm câu lạc bộ đông nhất ($${maxVal}$ học sinh) và ít nhất ($${minVal}$ học sinh).`,
                            `Tính hiệu số lượng học sinh đông nhất và ít nhất: $${maxVal} - ${minVal}$.`
                        ];
                        solutionHtml = `Số lượng học sinh tham gia các CLB lần lượt là: Âm nhạc ($${a}$), Mỹ thuật ($${b}$), Thể thao ($${c}$).<br>- CLB đông nhất là CLB **${clbMax}** với $${maxVal}$ học sinh.<br>- CLB ít nhất có số học sinh tham gia là $${minVal}$ học sinh.<br>Tập hợp số lượng học sinh đông nhất hơn ít nhất là:<br>$${maxVal} - ${minVal} = ${diff}$ học sinh.`;
                    } else {
                        const comic = this.randomInt(25, 45);
                        const science = this.randomInt(15, 24);
                        questionText = `Trên biểu đồ cột biểu diễn số lượng sách trong thư viện lớp 6A: cột "Truyện tranh" có chiều cao tương ứng với số $${comic}$, cột "Sách khoa học" có chiều cao tương ứng với số $${science}$. Số lượng truyện tranh trong thư viện là bao nhiêu quyển?`;
                        options = [`$${comic}$ quyển`, `$${science}$ quyển`, `$${comic + science}$ quyển`, `$${comic * 10}$ quyển`];
                        this.shuffle(options);
                        hints = [
                            `Chiều cao của mỗi cột biểu diễn số lượng của đối tượng tương ứng.`,
                            `Đọc số ghi trên đỉnh cột "Truyện tranh" hoặc đối chiếu sang trục đứng.`
                        ];
                        solutionHtml = `Chiều cao của cột "Truyện tranh" đối chiếu sang trục đứng chỉ ra số lượng truyện tranh là $${comic}$ quyển.`;
                    }
                    tip = "Đối chiếu đỉnh cột sang trục đứng (trục tung) để tìm số liệu của đối tượng.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const jun = this.randomInt(10, 15) * 10;
                        const jul = this.randomInt(12, 18) * 10;
                        const aug = this.randomInt(14, 20) * 10;
                        const total = jun + jul + aug;
                        const avg = Math.round(total / 3);
                        questionText = `Một biểu đồ cột biểu diễn lượng mưa các tháng mùa mưa tại một địa phương: tháng 6 cột cao $${jun}\\text{ mm}$, tháng 7 cột cao $${jul}\\text{ mm}$, tháng 8 cột cao $${aug}\\text{ mm}$. Tính lượng mưa trung bình mỗi tháng trong 3 tháng này (làm tròn đến hàng đơn vị).`;
                        options = [`$${avg}\\text{ mm}$`, `$${total}\\text{ mm}$`, `$${avg - 10}\\text{ mm}$`, `$${avg + 5}\\text{ mm}$`];
                        this.shuffle(options);
                        hints = [
                            `Tính tổng lượng mưa của cả ba tháng: $${jun} + ${jul} + ${aug} = ${total}\\text{ mm}$.`,
                            `Lấy tổng lượng mưa chia cho 3 để tìm lượng mưa trung bình mỗi tháng.`
                        ];
                        solutionHtml = `Tổng lượng mưa của cả 3 tháng là:<br>$${jun} + ${jul} + ${aug} = ${total}\\text{ mm}$.<br>Lượng mưa trung bình mỗi tháng là:<br>$${total} : 3 \\approx ${avg}\\text{ mm}$.`;
                    } else {
                        const w1 = this.randomInt(60, 90);
                        const w2 = this.randomInt(70, 100);
                        const w3 = this.randomInt(80, 110);
                        const w4 = this.randomInt(65, 95);
                        const total = w1 + w2 + w3 + w4;
                        const avg = Math.round(total / 4);
                        questionText = `Biểu đồ cột biểu diễn số lượng sách bán được của một cửa hàng trong 4 tuần: tuần 1 bán $${w1}$ quyển, tuần 2 bán $${w2}$ quyển, tuần 3 bán $${w3}$ quyển, tuần 4 bán $${w4}$ quyển. Tính số sách bán được trung bình mỗi tuần (làm tròn đến hàng đơn vị).`;
                        options = [`$${avg}$ quyển`, `$${total}$ quyển`, `$${avg - 10}$ quyển`, `$${avg + 10}$ quyển`];
                        this.shuffle(options);
                        hints = [
                            `Tính tổng số sách bán được trong cả 4 tuần: $${w1} + ${w2} + ${w3} + ${w4}$.`,
                            `Lấy tổng chia cho 4 để tính số sách trung bình mỗi tuần.`
                        ];
                        solutionHtml = `Tổng số sách bán được trong 4 tuần là:<br>$${w1} + ${w2} + ${w3} + ${w4} = ${total}$ quyển.<br>Số sách bán được trung bình mỗi tuần là:<br>$${total} : 4 = ${total / 4} \\approx ${avg}$ quyển.`;
                    }
                    tip = "Tính trung bình cộng bằng cách lấy tổng tất cả số liệu chia cho số lượng đối tượng.";
                } else { // kho
                    if (variant === 1) {
                        const a = this.randomInt(2, 4); // số bạn điểm 7
                        const b = this.randomInt(3, 5); // số bạn điểm 8
                        const c = this.randomInt(2, 4); // số bạn điểm 9
                        const d = this.randomInt(1, 3); // số bạn điểm 10
                        const totalStudents = a + b + c + d;
                        const totalScore = a * 7 + b * 8 + c * 9 + d * 10;
                        const avg = (totalScore / totalStudents).toFixed(1).replace('.', ',');
                        questionText = `Biểu đồ cột biểu diễn kết quả điểm kiểm tra môn Toán của tổ 1: có $${a}$ bạn đạt điểm 7; $${b}$ bạn đạt điểm 8; $${c}$ bạn đạt điểm 9 và $${d}$ bạn đạt điểm 10. Tính điểm trung bình môn Toán của tổ 1 (làm tròn đến chữ số thập phân thứ nhất).`;
                        options = [`$${avg}$`, `$8,0$`, `$8,5$`, `$${(totalScore / totalStudents + 0.3).toFixed(1).replace('.', ',')}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`$${this.randomInt(7, 9)},${this.randomInt(0, 9)}$`);
                        }
                        this.shuffle(options);
                        hints = [
                            `Tính tổng điểm của cả tổ: lấy điểm số của mỗi nhóm nhân với số lượng bạn tương ứng rồi cộng lại.`,
                            `Tính tổng số học sinh của tổ 1: $${a} + ${b} + ${c} + ${d} = ${totalStudents}$ học sinh.`,
                            `Điểm trung bình bằng tổng điểm chia cho tổng số học sinh.`
                        ];
                        solutionHtml = `Tổng số điểm môn Toán của tổ 1 thu được là:<br>$(${a} \\cdot 7) + (${b} \\cdot 8) + (${c} \\cdot 9) + (${d} \\cdot 10) = ${a * 7} + ${b * 8} + ${c * 9} + ${d * 10} = ${totalScore}$ điểm.<br>Tổng số học sinh của tổ 1 là:<br>$${a} + ${b} + ${c} + ${d} = ${totalStudents}$ học sinh.<br>Điểm trung bình môn Toán của tổ 1 là:<br>$${totalScore} : ${totalStudents} \\approx ${avg}$ điểm.`;
                    } else {
                        const m2 = [80, 100, 120][this.randomInt(0, 2)];
                        const m3 = m2 === 80 ? 100 : (m2 === 100 ? 125 : 150); // tăng trưởng 25%
                        const ans = 25;
                        questionText = `Biểu đồ cột biểu diễn doanh thu một cửa hàng: tháng 2 đạt $${m2}$ triệu đồng, tháng 3 đạt $${m3}$ triệu đồng. Hỏi doanh thu tháng 3 tăng trưởng bao nhiêu phần trăm so với tháng 2?`;
                        options = [`$${ans}\\%$`, `$20\\%$`, `$30\\%$`, `$15\\%$`];
                        this.shuffle(options);
                        hints = [
                            `Tính số doanh thu tăng thêm của tháng 3 so với tháng 2: $${m3} - ${m2}$ triệu đồng.`,
                            `Tính tỉ số phần trăm của lượng doanh thu tăng thêm này so với doanh thu gốc của tháng 2: $\\frac{m_3 - m_2}{m_2} \\cdot 100\\%$.`
                        ];
                        solutionHtml = `Doanh thu tăng thêm của tháng 3 so với tháng 2 là:<br>$${m3} - ${m2} = ${m3 - m2}$ triệu đồng.<br>Tỉ lệ phần trăm tăng trưởng doanh thu tháng 3 so với tháng 2 là:<br>$\\frac{${m3 - m2}}{${m2}} \\cdot 100\\% = ${ans}\\%$.`;
                    }
                    tip = "Tỉ lệ phần trăm tăng trưởng bằng (Giá trị mới - Giá trị cũ) / Giá trị cũ nhân với 100%.";
                }
                break;
            }
            case "bieu-do-cot-kep": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const m1 = this.randomInt(16, 22);
                        const f1 = this.randomInt(18, 24);
                        const m2 = this.randomInt(17, 21);
                        const f2 = this.randomInt(17, 21);
                        const total1 = m1 + f1;
                        const total2 = m2 + f2;
                        const diff = Math.abs(total1 - total2);
                        let ans;
                        if (total1 === total2) {
                            ans = "Hai lớp bằng nhau";
                        } else if (total1 > total2) {
                            ans = `Lớp 6A đông hơn ${diff} học sinh`;
                        } else {
                            ans = `Lớp 6B đông hơn ${diff} học sinh`;
                        }
                        questionText = `Biểu đồ cột kép biểu diễn số học sinh nam và nữ của hai lớp 6A và 6B. Lớp 6A: nam $${m1}$ học sinh, nữ $${f1}$ học sinh. Lớp 6B: nam $${m2}$ học sinh, nữ $${f2}$ học sinh. Lớp nào có tổng số học sinh đông hơn và đông hơn bao nhiêu học sinh?`;
                        options = [
                            ans,
                            `Lớp 6A đông hơn ${total1} học sinh`,
                            `Lớp 6B đông hơn ${total2} học sinh`,
                            `Hai lớp bằng nhau`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`Lớp 6A đông hơn ${diff + 2} học sinh`);
                        }
                        // Removed inner shuffle
                        hints = [
                            `Tính tổng số học sinh lớp 6A bằng cách cộng số học sinh nam và nữ: $${m1} + ${f1}$.`,
                            `Tính tổng số học sinh lớp 6B: $${m2} + ${f2}$.`,
                            `So sánh hai tổng số học sinh và tìm hiệu chênh lệch: $|${total1} - ${total2}|$.`
                        ];
                        solutionHtml = `Tổng số học sinh lớp 6A là: $${m1} + ${f1} = ${total1}$ học sinh.<br>Tổng số học sinh lớp 6B là: $${m2} + ${f2} = ${total2}$ học sinh.<br>` +
                            (total1 === total2 ? `Vậy tổng số học sinh của hai lớp bằng nhau (đều bằng $${total1}$ học sinh).` : `Lớp ${total1 > total2 ? '6A' : '6B'} có tổng số học sinh đông hơn và đông hơn số học sinh là: $${Math.max(total1, total2)} - ${Math.min(total1, total2)} = ${diff}$ học sinh.`);
                    } else {
                        const goldA = this.randomInt(5, 10);
                        const silverA = this.randomInt(6, 12);
                        const goldB = this.randomInt(6, 11);
                        const silverB = this.randomInt(5, 10);
                        const totalA = goldA + silverA;
                        const totalB = goldB + silverB;
                        const diff = Math.abs(totalA - totalB);
                        let ans;
                        if (totalA === totalB) {
                            ans = "Hai đoàn bằng nhau";
                        } else {
                            ans = `Đoàn ${totalA > totalB ? 'A' : 'B'} nhiều hơn ${diff} huy chương`;
                        }
                        questionText = `Biểu đồ cột kép biểu diễn số huy chương Vàng và Bạc của hai đoàn thể thao A và B. Đoàn A: Vàng $${goldA}$ chiếc, Bạc $${silverA}$ chiếc. Đoàn B: Vàng $${goldB}$ chiếc, Bạc $${silverB}$ chiếc. Hỏi đoàn nào có tổng số huy chương (chỉ tính Vàng và Bạc) nhiều hơn và nhiều hơn bao nhiêu chiếc?`;
                        options = [
                            ans,
                            `Đoàn A nhiều hơn ${goldA} chiếc`,
                            `Đoàn B nhiều hơn ${goldB} chiếc`,
                            `Hai đoàn bằng nhau`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`Đoàn A nhiều hơn ${diff + 3} chiếc`);
                        }
                        // Removed inner shuffle
                        hints = [
                            `Tính tổng số huy chương của đoàn A: $${goldA} + ${silverA}$.`,
                            `Tính tổng số huy chương của đoàn B: $${goldB} + ${silverB}$.`,
                            `So sánh hai tổng số huy chương để đưa ra kết luận.`
                        ];
                        solutionHtml = `Tổng số huy chương của đoàn A là: $${goldA} + ${silverA} = ${totalA}$ huy chương.<br>Tổng số huy chương của đoàn B là: $${goldB} + ${silverB} = ${totalB}$ huy chương.<br>` +
                            (totalA === totalB ? `Vậy tổng số huy chương của hai đoàn bằng nhau.` : `Đoàn ${totalA > totalB ? 'A' : 'B'} có tổng số huy chương nhiều hơn và nhiều hơn số huy chương là: $${Math.max(totalA, totalB)} - ${Math.min(totalA, totalB)} = ${diff}$ chiếc.`);
                    }
                    tip = "Biểu đồ cột kép sử dụng các cột có màu sắc hoặc ký hiệu khác nhau đứng cạnh nhau để so sánh hai nhóm dữ liệu trong cùng một đối tượng.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const y1q1 = this.randomInt(10, 14) * 10;
                        const y1q2 = this.randomInt(12, 16) * 10;
                        const y2q1 = this.randomInt(12, 15) * 10;
                        const y2q2 = this.randomInt(15, 20) * 10;
                        const totalY1 = y1q1 + y1q2;
                        const totalY2 = y2q1 + y2q2;
                        const diff = totalY2 - totalY1;
                        questionText = `Biểu đồ cột kép thống kê số lượng điện thoại bán ra của cửa hàng trong hai năm: Năm 2024 (cột vàng): quý 1 bán $${y1q1}$ chiếc, quý 2 bán $${y1q2}$ chiếc. Năm 2025 (cột cam): quý 1 bán $${y2q1}$ chiếc, quý 2 bán $${y2q2}$ chiếc. Hỏi tổng số điện thoại bán ra trong hai quý đầu năm 2025 nhiều hơn năm 2024 bao nhiêu chiếc?`;
                        options = [`$${diff}$ chiếc`, `$${totalY1}$ chiếc`, `$${totalY2}$ chiếc`, `$${diff + 20}$ chiếc`];
                        // Removed inner shuffle
                        hints = [
                            `Tính tổng số điện thoại bán ra trong hai quý của năm 2024: $${y1q1} + ${y1q2} = ${totalY1}$ chiếc.`,
                            `Tính tổng số điện thoại bán ra trong hai quý của năm 2025: $${y2q1} + ${y2q2} = ${totalY2}$ chiếc.`,
                            `Lấy tổng của năm 2025 trừ đi tổng của năm 2024.`
                        ];
                        solutionHtml = `Tổng lượng điện thoại bán ra trong hai quý đầu năm 2024 là:<br>$${y1q1} + ${y1q2} = ${totalY1}$ chiếc.<br>Tổng lượng điện thoại bán ra trong hai quý đầu năm 2025 là:<br>$${y2q1} + ${y2q2} = ${totalY2}$ chiếc.<br>Số lượng năm 2025 nhiều hơn năm 2024 là:<br>$${totalY2} - ${totalY1} = ${diff}$ chiếc.`;
                    } else {
                        const a1 = this.randomInt(10, 15) * 10;
                        const a2 = this.randomInt(12, 18) * 10;
                        const b1 = this.randomInt(11, 16) * 10;
                        const b2 = this.randomInt(10, 17) * 10;
                        const totalA = a1 + a2;
                        const totalB = b1 + b2;
                        const diff = Math.abs(totalA - totalB);
                        const target = totalA > totalB ? "A" : "B";
                        const other = totalA > totalB ? "B" : "A";
                        questionText = `Biểu đồ cột kép biểu diễn số sản phẩm sản xuất được của hai phân xưởng A và B trong 2 tháng đầu năm. Phân xưởng A: tháng 1 sản xuất $${a1}$ sản phẩm, tháng 2 sản xuất $${a2}$ sản phẩm. Phân xưởng B: tháng 1 sản xuất $${b1}$ sản phẩm, tháng 2 sản xuất $${b2}$ sản phẩm. Hỏi tổng sản phẩm của phân xưởng nào nhiều hơn và nhiều hơn bao nhiêu sản phẩm?`;
                        options = [
                            `Phân xưởng ${target} nhiều hơn ${diff} sản phẩm`,
                            `Phân xưởng ${other} nhiều hơn ${diff} sản phẩm`,
                            `Phân xưởng ${target} nhiều hơn ${totalA} sản phẩm`,
                            `Hai phân xưởng sản xuất bằng nhau`
                        ];
                        // Removed inner shuffle
                        hints = [
                            `Tính tổng số sản phẩm của phân xưởng A trong cả 2 tháng: $${a1} + ${a2} = ${totalA}$.`,
                            `Tính tổng số sản phẩm của phân xưởng B trong cả 2 tháng: $${b1} + ${b2} = ${totalB}$.`,
                            `So sánh hai tổng số và tính chênh lệch: $|${totalA} - ${totalB}|$.`
                        ];
                        solutionHtml = `Tổng sản phẩm của phân xưởng A sản xuất được là:<br>$${a1} + ${a2} = ${totalA}$ sản phẩm.<br>Tổng sản phẩm của phân xưởng B sản xuất được là:<br>$${b1} + ${b2} = ${totalB}$ sản phẩm.<br>Phân xưởng ${target} sản xuất nhiều hơn phân xưởng ${other} và nhiều hơn số sản phẩm là:<br>$${Math.max(totalA, totalB)} - ${Math.min(totalA, totalB)} = ${diff}$ sản phẩm.`;
                    }
                    tip = "Đọc đúng cột và màu sắc tương ứng biểu diễn cho từng nhóm đối tượng trên biểu đồ cột kép.";
                } else { // kho
                    if (variant === 1) {
                        const bikeA = this.randomInt(10, 20);
                        const busA = this.randomInt(15, 25);
                        const bikeB = this.randomInt(15, 25);
                        const busB = this.randomInt(10, 20);
                        const totalBike = bikeA + bikeB;
                        const totalAll = bikeA + busA + bikeB + busB;
                        const percent = Math.round((totalBike / totalAll) * 100);
                        questionText = `Biểu đồ cột kép biểu diễn số học sinh đi xe đạp và xe buýt của hai lớp 6A và 6B. Lớp 6A: xe đạp $${bikeA}$ bạn, xe buýt $${busA}$ bạn. Lớp 6B: xe đạp $${bikeB}$ bạn, xe buýt $${busB}$ bạn. Tính tỉ số phần trăm số học sinh đi xe đạp của cả hai lớp trên tổng số học sinh đi học bằng cả hai phương tiện này (làm tròn đến hàng đơn vị).`;
                        options = [`$${percent}\\%$`, `$${percent - 3}\\%$`, `$${percent + 3}\\%$`, `$50\\%`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`$${this.randomInt(35, 65)}\\%`);
                        }
                        // Removed inner shuffle
                        hints = [
                            `Tính tổng số học sinh đi xe đạp của cả hai lớp: $${bikeA} + ${bikeB} = ${totalBike}$ học sinh.`,
                            `Tính tổng số học sinh đi học bằng cả hai phương tiện: $${bikeA} + ${busA} + ${bikeB} + ${busB} = ${totalAll}$ học sinh.`,
                            `Tỉ số phần trăm được tính bằng: $\\frac{\\text{Tổng học sinh đi xe đạp}}{\\text{Tổng số học sinh}} \\cdot 100\\%$.`
                        ];
                        solutionHtml = `Tổng số học sinh đi xe đạp của cả hai lớp là: $${bikeA} + ${bikeB} = ${totalBike}$ học sinh.<br>Tổng số học sinh đi học bằng cả hai phương tiện của cả hai lớp là: $${bikeA} + ${busA} + ${bikeB} + ${busB} = ${totalAll}$ học sinh.<br>Tỉ số phần trăm số học sinh đi xe đạp là:<br>$\\frac{${totalBike}}{${totalAll}} \\cdot 100\\% \\approx ${percent}\\%$.`;
                    } else {
                        const g1 = this.randomInt(10, 16);
                        const k1 = this.randomInt(12, 18);
                        const g2 = this.randomInt(12, 18);
                        const k2 = this.randomInt(8, 14);
                        const totalG = g1 + g2;
                        const totalAll = g1 + k1 + g2 + k2;
                        const percent = ((totalG / totalAll) * 100).toFixed(1).replace('.', ',');
                        questionText = `Biểu đồ cột kép biểu diễn số học sinh đạt học lực Giỏi và Khá của hai lớp 6A và 6B. Lớp 6A: Giỏi $${g1}$ bạn, Khá $${k1}$ bạn. Lớp 6B: Giỏi $${g2}$ bạn, Khá $${k2}$ bạn. Tính tỉ số phần trăm học sinh đạt học lực Giỏi của cả hai lớp trên tổng số học sinh đạt lực học Khá và Giỏi của cả hai lớp (làm tròn đến chữ số thập phân thứ nhất).`;
                        options = [
                            `$${percent}\\%$`,
                            `$50,0\\%$`,
                            `$${(totalG / totalAll * 100 - 3).toFixed(1).replace('.', ',')}\\%$`,
                            `$${(totalG / totalAll * 100 + 2).toFixed(1).replace('.', ',')}\\%$`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`$${this.randomInt(40, 60)},${this.randomInt(0, 9)}\\%$`);
                        }
                        // Removed inner shuffle
                        hints = [
                            `Tính tổng số học sinh đạt lực học Giỏi của cả hai lớp: $${g1} + ${g2} = ${totalG}$ học sinh.`,
                            `Tính tổng số học sinh Khá và Giỏi của cả hai lớp: $${g1} + ${k1} + ${g2} + ${k2} = ${totalAll}$ học sinh.`,
                            `Tỉ số phần trăm bằng: $\\frac{\\text{Tổng học sinh Giỏi}}{\\text{Tổng số học sinh}} \\cdot 100\\%$.`
                        ];
                        solutionHtml = `Tổng số học sinh đạt lực học Giỏi của cả hai lớp là: $${g1} + ${g2} = ${totalG}$ học sinh.<br>Tổng số học sinh Khá và Giỏi của cả hai lớp là: $${g1} + ${k1} + ${g2} + ${k2} = ${totalAll}$ học sinh.<br>Tỉ số phần trăm học sinh đạt lực học Giỏi của cả hai lớp là:<br>$\\frac{${totalG}}{${totalAll}} \\cdot 100\\% \\approx ${percent}\\%$.`;
                    }
                    tip = "Đọc kỹ yêu cầu đề bài để gom nhóm các giá trị đối tượng chính xác trước khi lập tỉ số phần trăm.";
                }
                break;
            }
            case "ket-qua-co-the": {
                const variant = this.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const n = this.randomInt(5, 8);
                        questionText = `Bình Minh rút ngẫu nhiên một tấm thẻ từ một hộp chứa $${n}$ tấm thẻ đánh số liên tiếp từ $1$ đến $${n}$. Có bao nhiêu kết quả có thể xảy ra cho số ghi trên tấm thẻ rút được?`;
                        options = [`$${n}$ kết quả có thể`, `$2$ kết quả có thể`, `$1$ kết quả có thể`, `$${n * 2}$ kết quả có thể`];
                        // Removed inner shuffle
                        hints = [
                            `Hộp có $${n}$ tấm thẻ khác nhau được đánh số từ $1$ đến $${n}$.`,
                            `Mỗi lần rút thẻ sẽ cho ta đúng $1$ kết quả tương ứng với số ghi trên thẻ.`
                        ];
                        solutionHtml = `Vì hộp có $${n}$ tấm thẻ khác nhau được đánh số từ $1$ đến $${n}$, nên tập hợp các kết quả có thể xảy ra cho số ghi trên thẻ là: $\\\{1; 2; ...; ${n}\\\}$. Vậy có tất cả $${n}$ kết quả có thể xảy ra.`;
                    } else {
                        const colors = ["Đỏ", "Xanh", "Vàng", "Trắng", "Tím"];
                        this.shuffle(colors);
                        const n = this.randomInt(3, 4);
                        const chosenColors = colors.slice(0, n);
                        const colorsStr = chosenColors.join(", ");
                        questionText = `Trong hộp có các viên bi với các màu sắc sau: ${colorsStr}. Bình Minh lấy ngẫu nhiên 1 viên bi từ hộp. Có bao nhiêu kết quả có thể xảy ra đối với màu của viên bi lấy ra?`;
                        options = [`$${n}$ kết quả có thể`, `$2$ kết quả có thể`, `$1$ kết quả có thể`, `$${n + 1}$ kết quả có thể`];
                        // Removed inner shuffle
                        hints = [
                            `Tập hợp các kết quả có thể xảy ra là danh sách các màu sắc khác nhau của viên bi trong hộp.`,
                            `Đếm xem có bao nhiêu màu sắc khác nhau.`
                        ];
                        solutionHtml = `Các kết quả có thể xảy ra đối với màu của viên bi lấy ra là: ${colorsStr}. Do đó có tổng cộng $${n}$ kết quả có thể xảy ra.`;
                    }
                    tip = "Tổng số kết quả có thể xảy ra của một phép thử bằng tổng số đối tượng/phương án phân biệt tham gia phép thử.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        questionText = `Bình Minh gieo một con xúc xắc 6 mặt một lần. Trong các sự kiện sau, sự kiện nào là **chắc chắn xảy ra**?`;
                        options = [
                            `Gieo được mặt có số chấm nhỏ hơn $7$`,
                            `Gieo được mặt có số chấm bằng $6$`,
                            `Gieo được mặt có số chấm là số chẵn`,
                            `Gieo được mặt có số chấm lớn hơn $3$`
                        ];
                        // Removed inner shuffle
                        hints = [
                            `Con xúc xắc 6 mặt có số chấm từ 1 đến 6.`,
                            `Sự kiện chắc chắn xảy ra là sự kiện luôn xảy ra trong mọi kết quả có thể của phép thử.`
                        ];
                        solutionHtml = `Vì con xúc xắc chỉ có các mặt từ 1 đến 6 chấm nên bất kỳ lần gieo nào cũng sẽ cho số chấm nhỏ hơn 7. Do đó, sự kiện 'Gieo được mặt có số chấm nhỏ hơn 7' là **chắc chắn xảy ra**.`;
                    } else {
                        questionText = `Bình Minh gieo một con xúc xắc 6 mặt một lần. Trong các sự kiện sau, sự kiện nào là **không thể xảy ra**?`;
                        options = [
                            `Gieo được mặt có số chấm bằng $7$`,
                            `Gieo được mặt có số chấm là số lẻ`,
                            `Gieo được mặt có số chấm nhỏ hơn $7$`,
                            `Gieo được mặt có số chấm lớn hơn $2$`
                        ];
                        // Removed inner shuffle
                        hints = [
                            `Con xúc xắc 6 mặt chỉ gồm các mặt có số chấm từ 1 đến 6.`,
                            `Sự kiện không thể xảy ra là sự kiện không bao giờ xảy ra trong bất kỳ kết quả nào.`
                        ];
                        solutionHtml = `Vì con xúc xắc chỉ có các mặt từ 1 đến 6 chấm nên ta không bao giờ gieo được mặt có số chấm bằng 7. Do đó, sự kiện 'Gieo được mặt có số chấm bằng 7' là **không thể xảy ra**.`;
                    }
                    tip = "Sự kiện chắc chắn xảy ra luôn chứa mọi kết quả; sự kiện không thể xảy ra không chứa kết quả nào.";
                } else { // kho
                    if (variant === 1) {
                        questionText = `Trong hộp có 1 quả bóng Đỏ (Đ), 1 quả bóng Xanh (X), 1 quả bóng Vàng (V) và 1 quả bóng Trắng (T). Bình Minh lấy ra đồng thời 2 quả bóng từ hộp. Liệt kê tất cả các kết quả có thể xảy ra đối với màu của hai quả bóng lấy ra.`;
                        options = [
                            `$\\\{\\text{Đ, X}; \\text{Đ, V}; \\text{Đ, T}; \\text{X, V}; \\text{X, T}; \\text{V, T}\\\}$`,
                            `$\\\{\\text{Đ, Đ}; \\text{X, X}; \\text{V, V}; \\text{T, T}\\\}$`,
                            `$\\\{\\text{Đ, X}; \\text{Đ, V}; \\text{X, V}\\\}$`,
                            `$\\\{\\text{Đ, X, V, T}\\\}$`
                        ];
                        // Removed inner shuffle
                        hints = [
                            `Vì lấy đồng thời 2 quả bóng nên hai quả bóng không thể cùng màu (trong hộp chỉ có 1 quả mỗi màu).`,
                            `Liệt kê các cặp màu đôi một khác nhau ghép từ 4 màu Đ, X, V, T.`
                        ];
                        solutionHtml = `Các kết quả có thể xảy ra đối với màu của hai quả bóng lấy ra đồng thời là: Đỏ và Xanh (Đ, X); Đỏ và Vàng (Đ, V); Đỏ và Trắng (Đ, T); Xanh và Vàng (X, V); Xanh và Trắng (X, T); Vàng và Trắng (V, T).<br>Tập hợp các kết quả là: $\\\{\\text{Đ, X}; \\text{Đ, V}; \\text{Đ, T}; \\text{X, V}; \\text{X, T}; \\text{V, T}\\\}$.`;
                    } else {
                        questionText = `Tung đồng thời hai đồng xu cân đối và đồng chất (kí hiệu là đồng xu 1 và đồng xu 2). Kí hiệu S là mặt Sấp, N là mặt Ngửa. Hãy liệt kê tất cả các kết quả có thể xảy ra đối với mặt xuất hiện của hai đồng xu.`;
                        options = [
                            `$\\\{\\text{SS}; \\text{SN}; \\text{NS}; \\text{NN}\\\}$`,
                            `$\\\{\\text{SS}; \\text{NN}\\\}$`,
                            `$\\\{\\text{S}; \\text{N}\\\}$`,
                            `$\\\{\\text{SS}; \\text{SN}; \\text{NN}\\\}$`
                        ];
                        // Removed inner shuffle
                        hints = [
                            `Mỗi đồng xu khi tung có 2 kết quả là Sấp (S) hoặc Ngửa (N).`,
                            `Liệt kê các kết quả dưới dạng cặp kí tự: kí tự thứ nhất là mặt của đồng xu 1, kí tự thứ hai là mặt của đồng xu 2.`
                        ];
                        solutionHtml = `Mỗi kết quả có thể xảy ra được kí hiệu bằng một cặp chữ, chữ thứ nhất viết tắt cho mặt của đồng xu 1, chữ thứ hai viết tắt cho mặt của đồng xu 2.<br>Các kết quả có thể xảy ra là: hai đồng xu cùng Sấp (SS); đồng xu 1 Sấp và đồng xu 2 Ngửa (SN); đồng xu 1 Ngửa và đồng xu 2 Sấp (NS); hai đồng xu cùng Ngửa (NN).<br>Tập hợp các kết quả là: $\\\{\\text{SS}; \\text{SN}; \\text{NS}; \\text{NN}\\\}$.`;
                    }
                    tip = "Khi tung đồng thời hai vật phẩm phân biệt hoặc lấy đồng thời, hãy thiết lập cách liệt kê theo thứ tự để tránh bị sót hoặc trùng lặp.";
                }
                break;
            }
            case "xac-suat-thuc-nghiem": {
                if (level === "co-ban") {
                    const variant = this.randomInt(1, 2);
                    if (variant === 1) {
                        // Tung đồng xu
                        const coinSides = ["Sấp", "Ngửa"];
                        const side = coinSides[Math.floor(Math.random() * coinSides.length)];
                        const datasets = [
                            { total: 20, k: [6, 8, 12, 14, 15] },
                            { total: 25, k: [5, 10, 15, 20] },
                            { total: 40, k: [8, 12, 16, 24, 28] },
                            { total: 50, k: [15, 20, 25, 30, 35] }
                        ];
                        const data = datasets[Math.floor(Math.random() * datasets.length)];
                        const total = data.total;
                        const correctVal = data.k[Math.floor(Math.random() * data.k.length)];
                        
                        const g = this.gcd(correctVal, total);
                        const num = correctVal / g;
                        const den = total / g;
                        
                        questionText = `Bình Minh tung một đồng xu ${total} lần và ghi lại kết quả thấy có ${correctVal} lần xuất hiện mặt ${side}. Tính xác suất thực nghiệm của sự kiện "Đồng xu xuất hiện mặt ${side}".`;
                        options = [
                            `$\\frac{${num}}{${den}}$`,
                            `$\\frac{${den - num}}{${den}}$`,
                            `$\\frac{${correctVal}}{${total + 5}}$`,
                            `$\\frac{1}{2}$`
                        ];
                        // Đảm bảo không trùng options
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`$\\frac{${num + options.length}}{${den + options.length}}$`);
                        }
                        
                        hints = [
                            `Xác suất thực nghiệm của sự kiện được tính bằng tỉ số: $\\frac{\\text{Số lần sự kiện xảy ra}}{\\text{Tổng số lần thực hiện thử nghiệm}}$.`,
                            `Số lần mặt ${side} xuất hiện là ${correctVal}. Tổng số lần tung là ${total}.`,
                            `Tỉ số: $\\frac{${correctVal}}{${total}}$ và rút gọn.`
                        ];
                        solutionHtml = `Xác suất thực nghiệm của sự kiện "Xuất hiện mặt ${side}" là:<br>$\\frac{${correctVal}}{${total}} = \\frac{${correctVal} : ${g}}{${total} : ${g}} = \\frac{${num}}{${den}}$.`;
                    } else {
                        // Gieo xúc xắc
                        const items = ["số chẵn", "số lẻ", "mặt 6 chấm"];
                        const item = items[Math.floor(Math.random() * items.length)];
                        const datasets = [
                            { total: 30, k: [6, 12, 15, 18] },
                            { total: 50, k: [10, 20, 25, 30] },
                            { total: 60, k: [12, 18, 24, 36] }
                        ];
                        const data = datasets[Math.floor(Math.random() * datasets.length)];
                        const total = data.total;
                        const correctVal = data.k[Math.floor(Math.random() * data.k.length)];
                        
                        const g = this.gcd(correctVal, total);
                        const num = correctVal / g;
                        const den = total / g;
                        
                        questionText = `Khánh An gieo một con xúc xắc ${total} lần và thấy xuất hiện ${item} ${correctVal} lần. Tính xác suất thực nghiệm của sự kiện "Gieo được ${item}".`;
                        options = [
                            `$\\frac{${num}}{${den}}$`,
                            `$\\frac{${den - num}}{${den}}$`,
                            `$\\frac{${correctVal}}{${total + 10}}$`,
                            `$\\frac{1}{6}$`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`$\\frac{${num + options.length}}{${den + options.length}}$`);
                        }
                        
                        hints = [
                            `Xác suất thực nghiệm được tính bằng tỉ số giữa số lần sự kiện xảy ra và tổng số lần thử nghiệm.`,
                            `Số lần gieo được ${item} là ${correctVal}. Tổng số lần gieo là ${total}.`,
                            `Tỉ số: $\\frac{${correctVal}}{${total}}$, sau đó rút gọn.`
                        ];
                        solutionHtml = `Xác suất thực nghiệm của sự kiện "Gieo được ${item}" là:<br>$\\frac{${correctVal}}{${total}} = \\frac{${correctVal} : ${g}}{${total} : ${g}} = \\frac{${num}}{${den}}$.`;
                    }
                    tip = "Xác suất thực nghiệm luôn là một phân số từ 0 đến 1, rút gọn phân số để tìm đáp án trùng khớp.";
                } else if (level === "nang-cao") {
                    const variant = this.randomInt(1, 2);
                    if (variant === 1) {
                        // Hộp bóng hai màu
                        const names = ["Bình Minh", "Khánh An", "Minh Khang", "Bảo Nam"];
                        const name = names[Math.floor(Math.random() * names.length)];
                        const colors = [
                            { a: "Đỏ", b: "Xanh" },
                            { a: "Vàng", b: "Xanh lá" },
                            { a: "Đen", b: "Trắng" }
                        ];
                        const colorPair = colors[Math.floor(Math.random() * colors.length)];
                        const askColor = Math.random() < 0.5 ? colorPair.a : colorPair.b;
                        const otherColor = askColor === colorPair.a ? colorPair.b : colorPair.a;
                        
                        const datasets = [
                            { total: 40, otherK: [12, 16, 24, 28] },
                            { total: 50, otherK: [15, 20, 25, 30] },
                            { total: 80, otherK: [24, 32, 40, 48] },
                            { total: 100, otherK: [35, 40, 45, 60] }
                        ];
                        const data = datasets[Math.floor(Math.random() * datasets.length)];
                        const total = data.total;
                        const otherCount = data.otherK[Math.floor(Math.random() * data.otherK.length)];
                        const askCount = total - otherCount;
                        
                        const g = this.gcd(askCount, total);
                        const num = askCount / g;
                        const den = total / g;
                        
                        questionText = `Trong một hộp kín có nhiều quả bóng màu ${colorPair.a} và màu ${colorPair.b}. ${name} lấy ngẫu nhiên một quả bóng, ghi lại màu rồi bỏ lại vào hộp. Sau ${total} lần thực hiện, bạn ghi nhận có ${otherCount} lần lấy được bóng màu ${otherColor}. Tính xác suất thực nghiệm của sự kiện "Lấy được quả bóng màu ${askColor}".`;
                        options = [
                            `$\\frac{${num}}{${den}}$`,
                            `$\\frac{${den - num}}{${den}}$`,
                            `$\\frac{${otherCount}}{${total}}$`,
                            `$\\frac{1}{2}$`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`$\\frac{${num + options.length}}{${den + options.length}}$`);
                        }
                        
                        hints = [
                            `Đầu tiên, hãy tính số lần lấy được bóng màu ${askColor} bằng cách lấy tổng số lần thực hiện trừ đi số lần lấy được bóng màu ${otherColor}.`,
                            `Số lần lấy bóng màu ${askColor} là: ${total} - ${otherCount} = ${askCount} lần.`,
                            `Xác suất thực nghiệm là tỉ số giữa số lần lấy bóng màu ${askColor} và tổng số lần lấy bóng: $\\frac{${askCount}}{${total}}$ rồi rút gọn.`
                        ];
                        solutionHtml = `Số lần ${name} lấy được bóng màu ${askColor} là:<br>${total} - ${otherCount} = ${askCount} lần.<br>Xác suất thực nghiệm của sự kiện "Lấy được quả bóng màu ${askColor}" là:<br>$\\frac{${askCount}}{${total}} = \\frac{${askCount} : ${g}}{${total} : ${g}} = \\frac{${num}}{${den}}$.`;
                    } else {
                        // Kiểm tra phế phẩm
                        const names = ["Minh Khang", "Vy Anh", "Hoàng Lâm"];
                        const name = names[Math.floor(Math.random() * names.length)];
                        const datasets = [
                            { total: 100, bad: [5, 8, 10, 12, 15] },
                            { total: 200, bad: [8, 12, 16, 20, 24] },
                            { total: 250, bad: [10, 15, 20, 25, 30] }
                        ];
                        const data = datasets[Math.floor(Math.random() * datasets.length)];
                        const total = data.total;
                        const badCount = data.bad[Math.floor(Math.random() * data.bad.length)];
                        const goodCount = total - badCount;
                        
                        const g = this.gcd(goodCount, total);
                        const num = goodCount / g;
                        const den = total / g;
                        
                        questionText = `Một kỹ sư kiểm tra chất lượng của ${total} sản phẩm được sản xuất từ một nhà máy và phát hiện có ${badCount} sản phẩm lỗi. Tính xác suất thực nghiệm của sự kiện "Sản phẩm được chọn ngẫu nhiên đạt chất lượng" (không bị lỗi).`;
                        options = [
                            `$\\frac{${num}}{${den}}$`,
                            `$\\frac{${badCount}}{${total}}$`,
                            `$\\frac{${total - badCount - 5}}{${total}}$`,
                            `$\\frac{9}{10}$`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`$\\frac{${num - options.length}}{${den}}$`);
                        }
                        
                        hints = [
                            `Tính số sản phẩm đạt chất lượng (không bị lỗi) bằng cách lấy tổng số sản phẩm kiểm tra trừ đi số sản phẩm lỗi: ${total} - ${badCount} = ${goodCount} sản phẩm.`,
                            `Xác suất thực nghiệm được tính bằng tỉ số giữa số sản phẩm đạt chất lượng và tổng số sản phẩm kiểm tra.`,
                            `Tỉ số: $\\frac{${goodCount}}{${total}}$, sau đó rút gọn phân số.`
                        ];
                        solutionHtml = `Số sản phẩm đạt chất lượng (không lỗi) là:<br>${total} - ${badCount} = ${goodCount} sản phẩm.<br>Xác suất thực nghiệm của sự kiện "Sản phẩm được chọn đạt chất lượng" là:<br>$\\frac{${goodCount}}{${total}} = \\frac{${goodCount} : ${g}}{${total} : ${g}} = \\frac{${num}}{${den}}$.`;
                    }
                    tip = "Đọc kỹ yêu cầu đề bài hỏi xác suất thực nghiệm của sự kiện thuận lợi nào.";
                } else { // kho
                    const variant = this.randomInt(1, 2);
                    if (variant === 1) {
                        // Dự đoán kết quả gieo xúc xắc dựa trên tính chất số chấm
                        const names = ["Khánh An", "Bình Minh", "Vy Anh", "Hoàng Lâm"];
                        const name = names[Math.floor(Math.random() * names.length)];
                        
                        const props = [
                            { desc: "chia hết cho 3", N: 50, k: 20, M: 250 },
                            { desc: "là số nguyên tố", N: 40, k: 16, M: 200 },
                            { desc: "lớn hơn 4", N: 60, k: 24, M: 300 },
                            { desc: "là số chẵn", N: 80, k: 48, M: 400 }
                        ];
                        
                        const prop = props[Math.floor(Math.random() * props.length)];
                        const total = prop.N;
                        const correctVal = prop.k;
                        const nextTotal = prop.M;
                        
                        const g = this.gcd(correctVal, total);
                        const num = correctVal / g;
                        const den = total / g;
                        
                        const predict = (correctVal / total) * nextTotal;
                        
                        questionText = `${name} gieo một con xúc xắc cân đối ${total} lần và thấy số lần xuất hiện mặt có số chấm ${prop.desc} là ${correctVal} lần. Dựa vào kết quả thực nghiệm đó, nếu gieo xúc xắc thêm ${nextTotal} lần nữa thì dự đoán mặt có số chấm ${prop.desc} xuất hiện trong lượt gieo thêm là khoảng bao nhiêu lần?`;
                        options = [
                            `${predict} lần`,
                            `${predict + 10} lần`,
                            `${predict - 10} lần`,
                            `${correctVal} lần`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`${predict + options.length * 5} lần`);
                        }
                        
                        hints = [
                            `Tính xác suất thực nghiệm của sự kiện xúc xắc xuất hiện mặt có số chấm ${prop.desc} ở ${total} lần gieo đầu tiên: $\\frac{${correctVal}}{${total}} = \\frac{${num}}{${den}}$.`,
                            `Dùng xác suất thực nghiệm này để ước lượng khả năng xảy ra của sự kiện ở lần thử nghiệm tiếp theo.`,
                            `Dự đoán số lần xuất hiện ở lượt gieo thêm: Lấy tổng số lần gieo thêm (${nextTotal}) nhân với xác suất thực nghiệm vừa tính.`
                        ];
                        solutionHtml = `Xác suất thực nghiệm xuất hiện mặt có số chấm ${prop.desc} ở lượt gieo đầu tiên là:<br>$\\frac{${correctVal}}{${total}} = \\frac{${num}}{${den}}$.<br>Dự đoán số lần mặt này xuất hiện khi gieo thêm ${nextTotal} lần là:<br>${nextTotal} \\cdot \\frac{${num}}{${den}} = ${predict} lần.`;
                    } else {
                        // Bài toán bắn súng tìm tổng số phát trúng
                        const names = ["Quốc Anh", "Mai Chi", "Đức Minh", "Hà Linh"];
                        const name = names[Math.floor(Math.random() * names.length)];
                        
                        const datasets = [
                            { N: 40, k: 30, M: 160 },
                            { N: 50, k: 40, M: 150 },
                            { N: 60, k: 45, M: 240 },
                            { N: 80, k: 64, M: 320 }
                        ];
                        
                        const data = datasets[Math.floor(Math.random() * datasets.length)];
                        const total = data.N;
                        const hitCount = data.k;
                        const nextTotal = data.M;
                        
                        const g = this.gcd(hitCount, total);
                        const num = hitCount / g;
                        const den = total / g;
                        
                        const hitNext = (hitCount / total) * nextTotal;
                        const totalHitPredict = hitCount + hitNext;
                        
                        questionText = `Xạ thủ ${name} bắn thử ${total} phát súng và ghi nhận có ${hitCount} phát trúng bia. Dựa vào kết quả thực nghiệm này, nếu ${name} bắn tiếp ${nextTotal} phát súng nữa thì dự đoán **tổng số phát súng trúng bia** sau cả hai đợt bắn là khoảng bao nhiêu phát?`;
                        options = [
                            `${totalHitPredict} phát`,
                            `${hitNext} phát`,
                            `${totalHitPredict - 15} phát`,
                            `${totalHitPredict + 20} phát`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`${totalHitPredict + options.length * 10} phát`);
                        }
                        
                        hints = [
                            `Tính xác suất thực nghiệm bắn trúng bia của xạ thủ dựa trên kết quả đợt bắn thử: $\\frac{${hitCount}}{${total}} = \\frac{${num}}{${den}}$.`,
                            `Dự đoán số phát súng trúng bia ở đợt bắn tiếp theo: Lấy số phát bắn tiếp (${nextTotal}) nhân với xác suất thực nghiệm vừa tìm được.`,
                            `Đọc kỹ câu hỏi: Đề bài yêu cầu tính **tổng số phát súng trúng bia sau cả hai đợt bắn**. Hãy lấy số phát trúng đợt đầu cộng với số phát trúng dự kiến ở đợt sau.`
                        ];
                        solutionHtml = `Xác suất thực nghiệm bắn trúng bia của xạ thủ trong đợt đầu là:<br>$\\frac{${hitCount}}{${total}} = \\frac{${num}}{${den}}$.<br>Dự đoán số phát súng trúng bia trong đợt bắn tiếp theo (${nextTotal} phát) là:<br>${nextTotal} \\cdot \\frac{${num}}{${den}} = ${hitNext} phát.<br>Dự đoán tổng số phát súng trúng bia sau cả hai đợt bắn là:<br>${hitCount} + ${hitNext} = ${totalHitPredict} phát.`;
                    }
                    tip = "Lấy tổng số lần thử nghiệm mới nhân với xác suất thực nghiệm của sự kiện để dự đoán số lần xảy ra trong tương lai.";
                }
                break;
            }
            default: {
                questionText = `Tìm số nguyên $x$, biết: $x + 5 = 2$.`;
                options = [`$x = -3$`, `$x = 3$`, `$x = -7$`, `$x = 7$`];
                hints = [`$x = 2 - 5$.`];
                solutionHtml = `Ta có $x = 2 - 5 = -3$.`;
                tip = "Chuyển vế đổi dấu.";
            }
        }

        // Đảo vị trí đáp án ngẫu nhiên và cập nhật correctIndex
        let correctOptionValue;
        if (typeof correctIndex === 'number' && correctIndex >= 0 && correctIndex < options.length) {
            correctOptionValue = options[correctIndex];
        } else {
            correctOptionValue = options[0];
        }
        this.shuffle(options);
        correctIndex = options.indexOf(correctOptionValue);

        const qObj = {
            questionText,
            options,
            correctIndex,
            hints,
            solutionHtml,
            tip
        };

        // Xác định xem câu hỏi có bắt buộc phải là trắc nghiệm hay không
        qObj.forceMCQ = this.shouldForceMCQ(questionText, correctOptionValue);

        return qObj;
    },

    // Hiển thị câu hỏi
    showQuestion: function() {
        this.selectedOption = null;
        this.hintsShown = 0;
        this.hasChecked = false;

        const q = this.currentQuestions[this.currentQuestionIndex];
        
        // Khôi phục đáp án trắc nghiệm đã chọn trước đó
        if (!q.isShortAnswer) {
            if (q.userSelectedIndex !== undefined && q.userSelectedIndex !== null) {
                this.selectedOption = q.userSelectedIndex;
            }
        }
        
        // Cập nhật thanh tiến trình
        const progressPercent = (this.currentQuestionIndex / this.currentQuestions.length) * 100;
        document.getElementById("practice-progress").style.width = progressPercent + "%";
        document.getElementById("question-index-counter").innerText = "Câu hỏi " + (this.currentQuestionIndex + 1) + "/" + this.currentQuestions.length;

        // Cập nhật nút Thoát sang Bảng điểm nếu đã chấm điểm
        const exitBtn = document.querySelector(".btn-exit-practice");
        if (exitBtn) {
            if (this.isGraded) {
                exitBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> Bảng điểm`;
                exitBtn.style.backgroundColor = "var(--primary-bg)";
                exitBtn.style.color = "var(--primary)";
                exitBtn.style.borderColor = "var(--primary)";
            } else {
                exitBtn.innerHTML = `<i class="fa-solid fa-arrow-left"></i> Thoát`;
                exitBtn.style.backgroundColor = "var(--danger-bg)";
                exitBtn.style.color = "var(--danger)";
                exitBtn.style.borderColor = "var(--danger)";
            }
        }

        // Hiển thị nhãn Spaced Repetition hoặc độ khó
        let badgeHtml = "";
        if (q.isSpacedRepetition) {
            badgeHtml = "<span class=\"badge-rank\" style=\"background-color:var(--warning-bg);color:var(--warning);font-size:0.75rem;margin-bottom:0.5rem;display:inline-block;\"><i class=\"fa-solid fa-clock-rotate-left\"></i> Ôn tập kiến thức cũ</span><br>";
        } else {
            let levelLabel = "Cơ bản";
            let colorBg = "var(--success-bg)";
            let colorText = "var(--success)";
            if (q.level === "nang-cao") {
                levelLabel = "Nâng cao";
                colorBg = "var(--warning-bg)";
                colorText = "var(--warning)";
            } else if (q.level === "kho") {
                levelLabel = "Khó";
                colorBg = "var(--danger-bg)";
                colorText = "var(--danger)";
            } else if (q.level === "chat-luong-cao") {
                levelLabel = "Chất lượng cao 💎";
                colorBg = "rgba(139, 92, 246, 0.1)";
                colorText = "#8b5cf6";
            }
            badgeHtml = "<span class=\"badge-rank\" style=\"background-color:" + colorBg + ";color:" + colorText + ";font-size:0.75rem;margin-bottom:0.5rem;display:inline-block;\">" + (this.isExamMode ? "Bài Thi" : "Cấp độ") + ": " + levelLabel + "</span><br>";
        }

        document.getElementById("question-text-box").innerHTML = badgeHtml + q.questionText;

        // Render các nút đáp án hoặc ô nhập tự luận điền số
        const optionsBox = document.getElementById("options-box");
        optionsBox.innerHTML = "";
        
        // Xóa giải thích cũ nếu có
        const oldReview = document.getElementById("card-solution-box");
        if (oldReview) oldReview.remove();

        if (q.isShortAnswer) {
            const inputContainer = document.createElement("div");
            inputContainer.className = "short-answer-container animate-fade-in";
            inputContainer.style.marginTop = "1.5rem";
            inputContainer.style.padding = "1.5rem";
            inputContainer.style.backgroundColor = "var(--bg-app)";
            inputContainer.style.border = "1px solid var(--border-color)";
            inputContainer.style.borderRadius = "16px";
            inputContainer.style.textAlign = "left";

            const label = document.createElement("label");
            label.innerHTML = "<b>Nhập đáp án đúng của con vào ô dưới đây (ví dụ: một con số hoặc biểu thức tập hợp):</b>";
            label.style.display = "block";
            label.style.marginBottom = "1rem";
            label.style.fontSize = "0.95rem";
            label.style.color = "var(--text-main)";
            inputContainer.appendChild(label);

            const input = document.createElement("input");
            input.type = "text";
            input.id = "short-answer-input";
            input.placeholder = "Nhập đáp án của con tại đây...";
            input.value = q.userShortAnswer || "";
            input.style.width = "100%";
            input.style.padding = "14px 18px";
            input.style.border = "2px solid var(--border-color)";
            input.style.borderRadius = "12px";
            input.style.backgroundColor = "#0f172a";
            input.style.color = "#ffffff";
            input.style.fontSize = "1.1rem";
            input.style.outline = "none";
            input.style.transition = "all 0.3s ease";
            
            if (this.isGraded) {
                const isCorrect = this.checkShortAnswer(q.userShortAnswer || '', q.options[q.correctIndex]);
                input.style.borderColor = isCorrect ? "var(--success)" : "var(--danger)";
                input.disabled = true;
                input.style.backgroundColor = "var(--border-color)";
                input.style.cursor = "not-allowed";
                input.style.opacity = "0.7";
                
                if (!isCorrect) {
                    const _pn = (app && app.config && app.config.parentName) || 'Bố';
                    const correctAnswerBox = document.createElement("div");
                    correctAnswerBox.style.marginTop = "0.8rem";
                    correctAnswerBox.style.color = "var(--success)";
                    correctAnswerBox.style.fontWeight = "700";
                    correctAnswerBox.style.fontSize = "0.95rem";
                    correctAnswerBox.innerHTML = `<i class="fa-solid fa-circle-check"></i> Đáp án đúng của ${_pn}: <b style="background:var(--success-bg); padding:2px 8px; border-radius:4px;">${q.options[q.correctIndex]}</b>`;
                    inputContainer.appendChild(correctAnswerBox);
                }
            }

            input.oninput = () => {
                if (this.isGraded) return;
                const val = input.value.trim();
                q.userShortAnswer = val;
                
                // Cập nhật lại thanh điều hướng câu hỏi bên cạnh
                this.renderQuestionsNav();

                const nextBtn = document.getElementById("next-question-btn");
                if (val.length > 0) {
                    nextBtn.classList.remove("hidden");
                    if (this.currentQuestionIndex === this.currentQuestions.length - 1) {
                        if (this.practiceMode === 'game') {
                            nextBtn.innerHTML = "Nộp bài & Chấm điểm &nbsp; <i class=\"fa-solid fa-paper-plane\"></i>";
                        } else {
                            nextBtn.innerHTML = "Nộp bài &nbsp; <i class=\"fa-solid fa-paper-plane\"></i>";
                        }
                    } else {
                        nextBtn.innerHTML = "Tiếp theo &nbsp; <i class=\"fa-solid fa-arrow-right\"></i>";
                    }
                } else {
                    nextBtn.classList.add("hidden");
                }
            };
            
            inputContainer.appendChild(input);
            optionsBox.appendChild(inputContainer);

        } else {
            const gridDiv = document.createElement("div");
            gridDiv.className = "options-grid";

            const prefixes = ["A", "B", "C", "D"];
            q.options.forEach((opt, idx) => {
                let cleanOpt = opt;
                const prefixRegex = /^[A-D]\.\s*/i;
                if (prefixRegex.test(cleanOpt)) {
                    cleanOpt = cleanOpt.replace(prefixRegex, "");
                }
                const btn = document.createElement("button");
                btn.className = "option-btn";
                
                btn.innerHTML = "<span class=\"option-prefix\">" + prefixes[idx] + "</span> <span class=\"option-text-content\">" + cleanOpt + "</span>";
                
                if (this.isGraded) {
                    // Trong chế độ đã chấm điểm
                    if (idx === q.correctIndex) {
                        btn.style.borderColor = "var(--success)";
                        btn.style.backgroundColor = "var(--success-bg)";
                        btn.style.color = "var(--success)";
                        btn.style.fontWeight = "bold";
                        btn.innerHTML += " <i class=\"fa-solid fa-circle-check\" style=\"margin-left:auto; color:var(--success);\"></i>";
                    } else if (idx === q.userSelectedIndex) {
                        btn.style.borderColor = "var(--danger)";
                        btn.style.backgroundColor = "var(--danger-bg)";
                        btn.style.color = "var(--danger)";
                        btn.style.fontWeight = "bold";
                        btn.innerHTML += " <i class=\"fa-solid fa-circle-xmark\" style=\"margin-left:auto; color:var(--danger);\"></i>";
                    }
                    btn.style.cursor = "default";
                } else {
                    if (idx === this.selectedOption) {
                        btn.classList.add("selected");
                    }
                    btn.onclick = () => this.selectOption(idx);
                }
                gridDiv.appendChild(btn);
            });
            optionsBox.appendChild(gridDiv);
        }

        // Tạo hộp giải thích và mẹo thi nếu đã chấm điểm
        if (this.isGraded) {
            const solutionBox = document.createElement("div");
            solutionBox.id = "card-solution-box";
            solutionBox.className = "animate-fade-in";
            solutionBox.style.marginTop = "1.5rem";
            solutionBox.style.display = "flex";
            solutionBox.style.flexDirection = "column";
            solutionBox.style.gap = "1rem";

            const isCorrect = q.isShortAnswer ? 
                this.checkShortAnswer(q.userShortAnswer || '', q.options[q.correctIndex]) :
                q.userSelectedIndex === q.correctIndex;

            const statusHtml = isCorrect ? 
                `<div style="color:var(--success); font-weight:700; font-size:1.05rem;"><i class="fa-solid fa-circle-check"></i> ${(app && app.config && app.config.studentName) || 'Con'} đã làm ĐÚNG câu này!</div>` :
                `<div style="color:var(--danger); font-weight:700; font-size:1.05rem;"><i class="fa-solid fa-circle-xmark"></i> ${(app && app.config && app.config.studentName) || 'Con'} làm chưa đúng. Hãy đọc giải thích của ${(app && app.config && app.config.parentName) || 'bố'} ở dưới để hiểu bài nhé!</div>`;

            solutionBox.innerHTML = `
                ${statusHtml}
                <div style="font-family: var(--font-family) !important; background-color:var(--primary-bg); padding:1rem; border-radius:12px; font-size:0.95rem; border-left: 4px solid var(--primary);">
                    <strong style="color:var(--primary);"><i class="fa-solid fa-graduation-cap"></i> Lời giải chi tiết của ${(app && app.config && app.config.parentName) || 'Bố'}:</strong>
                    <div class="math-render" style="margin-top:0.4rem; line-height:1.6; color:var(--text-main);">${q.solutionHtml || "Đang cập nhật..."}</div>
                </div>
                <div style="font-family: var(--font-family) !important; background-color:var(--warning-bg); padding:1rem; border-radius:12px; font-size:0.95rem; border-left: 4px solid var(--warning);">
                    <strong style="color:var(--warning);"><i class="fa-solid fa-lightbulb"></i> Mẹo khi làm bài (Exam Tips):</strong>
                    <div class="math-render" style="margin-top:0.4rem; line-height:1.6; color:var(--text-main);"><i>${q.tip || "Đọc kỹ đề bài và loại trừ phương án sai."}</i></div>
                </div>
            `;
            optionsBox.parentNode.insertBefore(solutionBox, optionsBox.nextSibling);
        }

        // Reset gợi ý
        document.getElementById("hint-list-ul").innerHTML = "";
        document.getElementById("hints-content-box").classList.add("hidden");
        document.getElementById("hints-left").innerText = q.hints.length;
        document.getElementById("hint-toggle-btn").disabled = false;

        // Cập nhật nút Tiếp theo dựa trên trạng thái đã làm của câu này
        const nextBtn = document.getElementById("next-question-btn");
        if (nextBtn) {
            nextBtn.disabled = false;
        }
        if (this.isGraded) {
            nextBtn.classList.remove("hidden");
            if (this.currentQuestionIndex === this.currentQuestions.length - 1) {
                nextBtn.innerHTML = "Bảng điểm &nbsp; <i class=\"fa-solid fa-square-poll-vertical\"></i>";
            } else {
                nextBtn.innerHTML = "Tiếp theo &nbsp; <i class=\"fa-solid fa-arrow-right\"></i>";
            }
        } else {
            const hasAnswered = q.isShortAnswer ? 
                (q.userShortAnswer !== undefined && q.userShortAnswer !== '') :
                (q.userSelectedIndex !== undefined && q.userSelectedIndex !== null);

            if (hasAnswered) {
                nextBtn.classList.remove("hidden");
                if (this.currentQuestionIndex === this.currentQuestions.length - 1) {
                    if (this.practiceMode === 'game') {
                        nextBtn.innerHTML = "Nộp bài & Chấm điểm &nbsp; <i class=\"fa-solid fa-paper-plane\"></i>";
                    } else {
                        nextBtn.innerHTML = "Nộp bài &nbsp; <i class=\"fa-solid fa-paper-plane\"></i>";
                    }
                } else {
                    nextBtn.innerHTML = "Tiếp theo &nbsp; <i class=\"fa-solid fa-arrow-right\"></i>";
                }
            } else {
                nextBtn.classList.add("hidden");
            }
        }

        // Vẽ lại bảng điều hướng câu hỏi bên cạnh
        this.renderQuestionsNav();

        // Gọi KaTeX render lại toán học
        if (window.renderMathInElement) {
            window.renderMathInElement(document.getElementById("tab-practice"), {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ]
            });
        }
    },

    selectOption: function(index) {
        if (this.isGraded) return;

        // Phát âm thanh khi nhấn chọn đáp án trắc nghiệm
        if (window.app && app.audio) {
            app.audio.playTick();
        }

        this.selectedOption = index;
        const q = this.currentQuestions[this.currentQuestionIndex];
        if (q) {
            q.userSelectedIndex = index;
        }

        const buttons = document.querySelectorAll(".option-btn");
        buttons.forEach((btn, idx) => {
            if (idx === index) {
                btn.classList.add("selected");
            } else {
                btn.classList.remove("selected");
            }
        });

        // Vẽ lại danh sách câu hỏi bên cạnh để cập nhật trạng thái đã làm (xanh dương)
        this.renderQuestionsNav();

        // Chỉ lưu và hiện nút Tiếp theo/Nộp bài ngay khi học sinh đã chọn một phương án
        const nextBtn = document.getElementById("next-question-btn");
        if (nextBtn) {
            if (this.currentQuestionIndex === this.currentQuestions.length - 1) {
                if (this.practiceMode === 'game') {
                    nextBtn.innerHTML = "Nộp bài & Chấm điểm &nbsp; <i class=\"fa-solid fa-paper-plane\"></i>";
                } else {
                    nextBtn.innerHTML = "Nộp bài &nbsp; <i class=\"fa-solid fa-paper-plane\"></i>";
                }
            } else {
                nextBtn.innerHTML = "Tiếp theo &nbsp; <i class=\"fa-solid fa-arrow-right\"></i>";
            }
            nextBtn.classList.remove("hidden");
        }
    },

    // checkAnswer không còn dùng tại thời điểm chọn câu nữa, hệ thống chấm điểm hàng loạt khi finish
    checkAnswer: function() {
        // Hàm giữ lại để tránh lỗi tham chiếu nếu có ở file khác, không thực hiện gì
    },

    renderQuestionsNav: function() {
        const navPanel = document.getElementById("questions-nav-panel");
        const navGrid = document.getElementById("questions-nav-grid");
        if (!navPanel || !navGrid) return;

        navGrid.innerHTML = "";
        
        this.currentQuestions.forEach((q, idx) => {
            const btn = document.createElement("button");
            btn.className = "q-nav-btn";
            btn.innerText = idx + 1;
            btn.onclick = () => this.goToQuestion(idx);

            // Active
            if (idx === this.currentQuestionIndex) {
                btn.classList.add("active");
            }

            if (this.isGraded) {
                // Đã chấm điểm: xanh lá nếu đúng, đỏ nếu sai
                const isCorrect = q.isShortAnswer ? 
                    this.checkShortAnswer(q.userShortAnswer || '', q.options[q.correctIndex]) :
                    q.userSelectedIndex === q.correctIndex;
                
                if (isCorrect) {
                    btn.classList.add("correct");
                } else {
                    btn.classList.add("incorrect");
                }
            } else {
                // Chưa chấm điểm: xanh dương nếu đã trả lời, xám nhạt nếu chưa
                const hasAnswered = q.isShortAnswer ? 
                    (q.userShortAnswer !== undefined && q.userShortAnswer !== '') :
                    (q.userSelectedIndex !== undefined && q.userSelectedIndex !== null);
                if (hasAnswered) {
                    btn.classList.add("answered");
                }
            }

            navGrid.appendChild(btn);
        });
    },

    goToQuestion: function(idx) {
        if (idx < 0 || idx >= this.currentQuestions.length) return;
        this.saveCurrentAnswer();
        this.currentQuestionIndex = idx;
        this.showQuestion();
        this.renderQuestionsNav();
    },

    saveCurrentAnswer: function() {
        const q = this.currentQuestions[this.currentQuestionIndex];
        if (!q) return;
        if (q.isShortAnswer) {
            const inputEl = document.getElementById("short-answer-input");
            q.userShortAnswer = inputEl ? inputEl.value.trim() : "";
        } else {
            q.userSelectedIndex = this.selectedOption;
        }
    },

    submitPracticeGame: function() {
        this.saveCurrentAnswer();
        
        let correctCount = 0;
        this.currentQuestions.forEach(q => {
            const isCorrect = q.isShortAnswer ? 
                this.checkShortAnswer(q.userShortAnswer || '', q.options[q.correctIndex]) :
                q.userSelectedIndex === q.correctIndex;
            if (isCorrect) correctCount++;
        });
        
        const N = this.currentQuestions.length;
        
        if (correctCount === N) {
            // Đạt 100% đúng: Thưởng vàng và XP cố định
            this.accumulatedGold = N * 50;
            this.accumulatedXp = N * 20;
            
            // Chuyển sang Phase game thủ thành
            this.switchToBattlePhase();
        } else {
            // Có câu sai: Phạt trừ tiền và XP
            this.accumulatedGold = -50;
            this.accumulatedXp = -20;
            
            if (this.hero) {
                this.hero.addXp(-20);
            }
            
            Swal.fire({
                icon: 'error',
                title: 'Chưa đạt 100% chính xác! 🥺',
                text: 'Con phải trả lời đúng 100% tất cả các câu hỏi thì mới được tham gia Đấu Trường Thủ Thành. Lần này con đã bị phạt trừ tiền vàng và XP. Hãy cẩn thận làm lại đề mới nhé!',
                confirmButtonText: 'Làm đề mới',
                confirmButtonColor: 'var(--danger)',
                target: document.getElementById('tab-practice') || 'body',
                allowOutsideClick: false
            }).then(() => {
                this.initPractice(this.currentLesson, this.currentLevel, this.isExamMode);
            });
        }
    },

    showNextHint: function() {
        const q = this.currentQuestions[this.currentQuestionIndex];
        if (this.hintsShown >= q.hints.length) return;

        const hintList = document.getElementById("hint-list-ul");
        const hintsBox = document.getElementById("hints-content-box");
        hintsBox.classList.remove("hidden");

        const li = document.createElement("li");
        li.className = "hint-item animate-bounce-in";
        li.innerHTML = "<span class=\"hint-num\">" + (this.hintsShown + 1) + "</span> <span>" + q.hints[this.hintsShown] + "</span>";
        hintList.appendChild(li);

        this.hintsShown++;
        
        if (window.renderMathInElement) {
            window.renderMathInElement(li, {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ]
            });
        }

        const hintsLeft = q.hints.length - this.hintsShown;
        document.getElementById("hints-left").innerText = hintsLeft;

        if (hintsLeft === 0) {
            document.getElementById("hint-toggle-btn").disabled = true;
        }
    },

     nextQuestion: function() {
        this.saveCurrentAnswer();
        
        if (this.isGraded) {
            if (this.currentQuestionIndex === this.currentQuestions.length - 1) {
                // Quay lại bảng điểm kết quả
                document.getElementById("practice-active-box").classList.add("hidden");
                document.getElementById("practice-result-box").classList.remove("hidden");
                document.body.classList.remove("super-focus-active");
            } else {
                this.currentQuestionIndex++;
                this.showQuestion();
            }
            return;
        }

        if (this.practiceMode === 'game') {
            if (this.currentQuestionIndex === this.currentQuestions.length - 1) {
                // Đang ở câu cuối cùng ở chế độ Game: Thực hiện nộp bài chấm điểm toàn bộ
                this.submitPracticeGame();
            } else {
                // Chưa phải câu cuối: chuyển sang câu tiếp theo
                this.currentQuestionIndex++;
                this.showQuestion();
                this.renderQuestionsNav();
            }
        } else {
            // Chế độ Luyện tập trắc nghiệm thường và Bài thi
            if (this.currentQuestionIndex === this.currentQuestions.length - 1) {
                // Câu cuối cùng -> Chấm điểm và kết thúc
                this.finishPractice();
            } else {
                // Chưa phải câu cuối: chuyển sang câu tiếp theo
                this.currentQuestionIndex++;
                this.showQuestion();
                this.renderQuestionsNav();
            }
        }
    },

    // Chuyển từ Phase làm toán sang Phase chiến đấu thủ thành
    switchToBattlePhase: function() {
        // Ẩn hoàn toàn giao diện câu hỏi trắc nghiệm và nút chuyển câu
        const splitContainer = document.getElementById("practice-split-container");
        const gameContainer = document.getElementById("td-game-container");
        const questionContainer = document.getElementById("td-question-container");
        
        if (splitContainer) splitContainer.classList.remove("practice-split-active");
        if (questionContainer) questionContainer.classList.add("hidden");
        if (gameContainer) gameContainer.classList.remove("hidden");
        
        // Phóng to tối đa màn hình game
        document.body.classList.add("game-mode-active");
        
        // Co nhỏ sidebar để phóng to màn hình game
        if (window.app && typeof app.collapseSidebar === 'function') {
            app.collapseSidebar();
        }
        
        const nextBtn = document.getElementById("next-question-btn");
        const testBtn = document.getElementById("test-game-btn");
        if (nextBtn) nextBtn.classList.add("hidden");
        if (testBtn) testBtn.classList.add("hidden");
        
        // Hiển thị nút bắt đầu đợt quái
        const startWaveBtn = document.getElementById("btn-start-wave");
        if (startWaveBtn) startWaveBtn.classList.remove("hidden");
        
        // Nạp vàng và XP tích lũy sang game.js
        if (window.game) {
            game.gold = Math.max(100, 150 + (this.accumulatedGold || 0)); // Vàng khởi đầu = 150G + vàng tích lũy (tối thiểu 100G)
            game.updateHUD();
            
            // Cho phép chuẩn bị chiến đấu
            game.isBattlePhase = true;
            game.currentWave = 0; // reset wave về 0 để chuẩn bị đợt 1
            game.totalWaves = this.isFastGame ? 999999 : 5;  // Cho phép chơi không giới hạn đợt quái ở chế độ chơi nhanh (Phụ huynh)
            
            // Cộng XP tích lũy và XP thưởng hoàn thành bài học (+80) cho Hero
            this.hero.addXp((this.accumulatedXp || 0) + 80);
            
            // Đồng bộ lại Hero mới lên game.js
            game.hero = this.hero;
            
            // Bắt đầu phát nhạc nền game
            if (window.app && app.audio) {
                app.audio.playBackground();
            }
        }
        
        // Thông báo bằng SweetAlert2 chào mừng bé vào Đấu trường
        Swal.fire({
            title: 'ĐẾN ĐẦU TRƯỜNG THỦ THÀNH! 🏰',
            html: `<p>Chúc mừng con! Con đã hoàn thành chính xác 100% tất cả <b>${this.currentQuestions.length} câu hỏi</b>!</p>
                   <p>Con nhận được phần thưởng: <b>+${this.accumulatedGold} vàng 🪙</b> và <b>+${this.accumulatedXp} XP 🏆</b>.</p>
                   <p style="color:var(--success); font-weight:bold; font-size:1.1rem; margin-top:0.5rem;">Giờ hãy xây dựng các tháp canh chiến thuật trên bãi cỏ, sau đó bấm nút "BẮT ĐẦU PHÒNG THỦ" ở dưới để ngăn chặn quái vật nhé!</p>`,
            confirmButtonText: 'Bắt đầu dàn trận ngay!',
            confirmButtonColor: 'var(--success)',
            target: document.getElementById('tab-practice') || 'body',
            allowOutsideClick: false
        });
    },

    // Bỏ qua làm bài tập để kiểm thử game nhanh
    skipToTestGame: function() {
        Swal.fire({
            title: 'Chơi thử Đấu Trường? 🎮',
            text: 'Bỏ qua làm toán để kiểm thử trực tiếp game?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý, test game!',
            cancelButtonText: 'Hủy',
            confirmButtonColor: 'var(--success)',
            target: document.getElementById('tab-practice') || 'body'
        }).then((result) => {
            if (result.isConfirmed) {
                // Đặt các đáp án đúng để lách luật 100% đúng
                this.currentQuestions.forEach(q => {
                    q.userSelectedIndex = q.correctIndex;
                });
                this.accumulatedGold = 250; // Cho thêm vàng để test tháp canh cấp cao dễ dàng
                this.switchToBattlePhase();
            }
        });
    },

    // Callback được gọi từ game.js khi đợt quái thủ thành kết thúc
    onWaveComplete: function() {
        const nextBtn = document.getElementById("next-question-btn");
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.classList.remove("hidden");
            if (this.currentQuestionIndex === this.currentQuestions.length - 1) {
                nextBtn.innerHTML = "Xem kết quả &nbsp; <i class=\"fa-solid fa-paper-plane\"></i>";
            } else {
                nextBtn.innerHTML = "Tiếp tục &nbsp; <i class=\"fa-solid fa-arrow-right\"></i>";
            }
        }
    },

    finishPractice: function() {
        this.isGraded = true;
        
        // Vô hiệu hóa nút nộp bài để chống spam click nộp nhiều lần
        const nextBtn = document.getElementById("next-question-btn");
        if (nextBtn) {
            nextBtn.disabled = true;
            nextBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang nộp bài...`;
        }

        if (window.game) game.stop();
        if (this.examInterval) clearInterval(this.examInterval);
        
        // Dọn dẹp bộ đếm thời gian chơi game nhanh của học sinh nếu có
        if (window.app && app.gamePlayInterval) {
            clearInterval(app.gamePlayInterval);
            app.gamePlayInterval = null;
            const timerEl = document.getElementById("game-play-timer-widget");
            if (timerEl && timerEl.parentNode) {
                timerEl.parentNode.removeChild(timerEl);
            }
        }
        
        // Mở rộng lại sidebar khi thoát chế độ thực hành
        if (window.app && typeof app.expandSidebar === 'function') {
            app.expandSidebar();
        }
        
        // Cộng phần thưởng XP lớn cho Hero khi hoàn thành cả bài luyện tập
        if (this.practiceMode === 'game') {
            this.hero.addXp(80);
        }
        document.getElementById("exam-timer-wrapper").classList.add("hidden");
        document.getElementById("practice-progress").style.width = "100%";

        // Tắt Super Focus Mode
        document.body.classList.remove("super-focus-active");
        
        // Tắt chế độ hiển thị phóng to game
        document.body.classList.remove("game-mode-active");

        // Thoát toàn màn hình
        app.exitFullscreen();
        document.body.classList.remove("practice-fullscreen-active");
        app.restoreScrollbar();

        if (this.isFastGame) {
            // Chế độ chơi game nhanh: Bỏ qua việc lưu tiến trình/session học tập để tránh ghi dữ liệu giả
            this.correctCount = 5;
            
            const isGameWon = window.game && window.game.hp > 0;
            
            const resultIconEmoji = document.getElementById("result-icon-emoji");
            if (resultIconEmoji) {
                resultIconEmoji.innerText = isGameWon ? "🏆" : "💀";
            }
            
            const resultScoreTitle = document.getElementById("result-score-title");
            if (resultScoreTitle) {
                resultScoreTitle.innerText = isGameWon ? "Chiến Thắng Rực Rỡ! 🎉" : "Lâu Đài Thất Thủ! 😢";
            }
            
            const resultScoreDesc = document.getElementById("result-score-desc");
            if (resultScoreDesc) {
                resultScoreDesc.innerText = isGameWon ? 
                    "Chúc mừng phụ huynh đã bảo vệ thành công lâu đài qua các đợt quái vật!" : 
                    "Máu lâu đài đã về 0. Hãy thử lại để phục thù và bảo vệ lâu đài nhé!";
            }
            
            // Ẩn phần cộng XP và chi tiết câu đúng/sai vì chế độ này không làm bài tập
            const xpEarnedBox = document.getElementById("xp-earned-box-wrapper") || document.querySelector(".xp-earned-box");
            const resultDetails = document.getElementById("result-details-wrapper") || document.querySelector(".result-details");
            if (xpEarnedBox) xpEarnedBox.classList.add("hidden");
            if (resultDetails) resultDetails.classList.add("hidden");
            
            const examReviewBox = document.getElementById("exam-review-box");
            if (examReviewBox) examReviewBox.classList.add("hidden");

            // Bắn pháo hoa giấy và phát âm thanh vui vẻ nếu thắng
            if (isGameWon) {
                app.confetti.start();
                app.audio.playBadge();
            } else {
                app.audio.playDefeat();
            }

            // Cấu hình lại các nút ở màn hình kết quả
            const backBtn = document.getElementById("btn-back-to-practice");
            if (backBtn) {
                backBtn.innerHTML = `<i class="fa-solid fa-house"></i> Màn hình chính`;
                backBtn.onclick = function() {
                    window.location.reload();
                };
            }
            const retryBtn = document.getElementById("retry-practice-btn");
            if (retryBtn) {
                retryBtn.innerHTML = `<i class="fa-solid fa-rotate-right"></i> Chơi lại game`;
                retryBtn.onclick = function() {
                    if (window.app && typeof app.fastPlayGame === 'function') {
                        app.fastPlayGame();
                    }
                };
            }
            const reviewBtn = document.getElementById("btn-show-practice-review");
            if (reviewBtn) {
                reviewBtn.classList.add("hidden");
            }

            document.getElementById("practice-active-box").classList.add("hidden");
            document.getElementById("practice-result-box").classList.remove("hidden");
            return;
        }

        // Chấm điểm hàng loạt các câu hỏi
        this.correctCount = 0;
        
        // Hiện lại các phần tử bị ẩn do chế độ chơi nhanh trước đó (nếu có)
        const xpEarnedBox = document.getElementById("xp-earned-box-wrapper") || document.querySelector(".xp-earned-box");
        const resultDetails = document.getElementById("result-details-wrapper") || document.querySelector(".result-details");
        if (xpEarnedBox) xpEarnedBox.classList.remove("hidden");
        if (resultDetails) resultDetails.classList.remove("hidden");
        const reviewBtn = document.getElementById("btn-show-practice-review");
        if (reviewBtn) reviewBtn.classList.remove("hidden");
        this.currentQuestions.forEach(q => {
            const isCorrect = q.isShortAnswer ? 
                this.checkShortAnswer(q.userShortAnswer || '', q.options[q.correctIndex]) :
                q.userSelectedIndex === q.correctIndex;
            if (isCorrect) {
                this.correctCount++;
            }
            // Lưu kết quả từng câu vào lịch sử cho Phụ huynh (bỏ qua lưu tiến trình từng câu để tránh xung đột)
            app.saveQuestionResult(this.currentLesson.id, q.type, isCorrect, true);
        });

        const scorePercent = Math.round((this.correctCount / this.currentQuestions.length) * 100);
        let rank = "";
        let desc = "";
        let emoji = "";
        let xpEarned = 0;
        let isPassed = false;

        const _sn = (app && app.config && app.config.studentName) || 'Con';
        const _pn = (app && app.config && app.config.parentName) || 'Bố';

        // Phân loại 6 mức độ nhận thức với mốc đạt >= 80% (Loại Giỏi trở lên)
        if (scorePercent >= 95) {
            rank = "Xuất sắc";
            desc = (this.isExamMode || this.isLessonExamMode) ? `${_pn} chúc mừng ${_sn} nhé! Con đã vượt qua bài kiểm tra một cách xuất sắc. ${_pn} tự hào về con lắm!` : `Tuyệt vời ${_sn}! Con đã làm đúng hết các câu hỏi của dạng bài này. ${_pn} thưởng cho con nhé!`;
            emoji = "👑";
            xpEarned = (this.isExamMode || this.isLessonExamMode) ? 100 : 50;
            isPassed = true;
        } else if (scorePercent >= 80) {
            rank = "Giỏi";
            desc = (this.isExamMode || this.isLessonExamMode) ? `Chúc mừng ${_sn}! Con đã đỗ bài kiểm tra và mở khóa bài tiếp theo. ${_pn} rất vui!` : `${_sn} học giỏi lắm! Con đã vượt qua dạng bài luyện tập này rồi. Tiếp tục phát huy con nhé!`;
            emoji = "🎉";
            xpEarned = (this.isExamMode || this.isLessonExamMode) ? 80 : 40;
            isPassed = true;
        } else if (scorePercent >= 70) {
            rank = "Khá";
            desc = `${_sn} làm khá tốt rồi! Tuy nhiên, con cần đạt từ 80% trở lên để vượt qua. Luyện tập lại một chút, ${_pn} tin con sẽ đạt điểm tuyệt đối!`;
            emoji = "👍";
            xpEarned = (this.isExamMode || this.isLessonExamMode) ? 40 : 25;
            isPassed = false;
        } else if (scorePercent >= 50) {
            rank = "Đạt";
            desc = `${_sn} đã có tiến bộ rồi! Con hãy xem kỹ lời giải chi tiết của ${_pn} biên soạn ở dưới và làm lại để nâng cao điểm số nhé.`;
            emoji = "✍️";
            xpEarned = (this.isExamMode || this.isLessonExamMode) ? 20 : 15;
            isPassed = false;
        } else if (scorePercent >= 35) {
            rank = "Yếu";
            desc = `${_sn} cố lên nào! Phần này hơi khó, con hãy đọc lại phần Lý thuyết rồi thử sức lại nhé. ${_pn} luôn đồng hành cùng con!`;
            emoji = "📚";
            xpEarned = (this.isExamMode || this.isLessonExamMode) ? 10 : 5;
            isPassed = false;
        } else {
            rank = "Không đạt";
            desc = `Không sao đâu ${_sn}! Thất bại là mẹ thành công. Con hãy đọc kỹ hướng dẫn của ${_pn} dưới đây rồi thử lại nhé!`;
            emoji = "❌";
            xpEarned = 0;
            isPassed = false;
        }

        // Phát hiệu ứng âm thanh hoàn thành bài tập dựa trên kết quả đạt/không đạt
        if (window.app && app.audio) {
            if (isPassed) {
                app.audio.playVictory();
            } else {
                app.audio.playDefeat();
            }
        }

        document.getElementById("result-icon-emoji").innerText = emoji;
        document.getElementById("result-score-title").innerText = rank + " (" + scorePercent + "%)";
        document.getElementById("result-score-desc").innerText = desc;
        document.getElementById("xp-earned-val").innerText = xpEarned;
        document.getElementById("result-correct-count").innerText = this.correctCount + "/" + this.currentQuestions.length;
        
        const rankBadge = document.getElementById("result-rank-badge");
        rankBadge.innerText = rank;
        if (!isPassed) {
            rankBadge.style.backgroundColor = "var(--danger-bg)";
            rankBadge.style.color = "var(--danger)";
        } else {
            rankBadge.style.backgroundColor = "var(--success-bg)";
            rankBadge.style.color = "var(--success)";
        }

        // Tính thời gian làm bài (giây)
        const timeSpent = Math.round((Date.now() - this.practiceStartTime) / 1000);

        // Lưu kết quả học tập tùy thuộc vào chế độ luyện tập dạng hay kiểm tra tổng thể
        if (this.isSubtopicPracticeMode) {
            // Luyện tập dạng bài
            if (isPassed) {
                if (!app.state.completedSubtopics.includes(this.currentSubtopic.id)) {
                    app.state.completedSubtopics.push(this.currentSubtopic.id);
                }
            }
            app.state.subtopicScores = app.state.subtopicScores || {};
            app.state.subtopicScores[this.currentSubtopic.id] = Math.max(app.state.subtopicScores[this.currentSubtopic.id] || 0, scorePercent);
            
            // Tích lũy XP và thời gian
            app.state.xp += xpEarned;
            app.logLearningTime(10);
            
            // Kiểm tra và mở khóa huy hiệu
            app.checkAndUnlockBadges(this.currentLesson.id, scorePercent, timeSpent, 0, this.practiceDistractions);
            app.saveProgress();
            app.updateHeaderStats();
        } else {
            // Kiểm tra tổng thể bài học, Luyện tập chung hoặc Kiểm tra chương
            app.saveLessonScore(this.currentLesson.id, scorePercent, xpEarned, isPassed, timeSpent, this.practiceDistractions);
            
            // Lưu điểm số cao nhất của cấp độ nếu không phải là bài thi/kiểm tra tổng thể
            if (!this.isExamMode && !this.isLessonExamMode) {
                app.state.levelScores = app.state.levelScores || {};
                const key = `${this.currentLesson.id}_${this.currentLevel}`;
                app.state.levelScores[key] = Math.max(app.state.levelScores[key] || 0, scorePercent);
                app.saveProgress();
            }
        }

        // Tạo bản ghi lượt làm bài (session) hoàn chỉnh và lưu vào state
        const sessionRecord = {
            id: "sess-" + Date.now(),
            lessonId: this.currentLesson.id,
            lessonTitle: this.currentLesson.title,
            level: this.currentLevel,
            // Phân loại chi tiết loại bài (không gộp chung để phân biệt rõ trong lịch sử)
            isExam: this.isExamMode,                              // true = Thi cuối chương (kt-c1...)
            isLessonExam: this.isLessonExamMode,                  // true = Kiểm tra tổng thể bài học
            isSubtopicPractice: this.isSubtopicPracticeMode,     // true = Luyện tập theo Dạng bài
            isWeaknessPractice: this.isWeaknessPracticeMode,     // true = Luyện tập khắc phục điểm yếu AI
            subtopicId: this.isSubtopicPracticeMode ? (this.currentSubtopic ? this.currentSubtopic.id : null) : null,
            subtopicTitle: this.isSubtopicPracticeMode ? (this.currentSubtopic ? this.currentSubtopic.title : null) : null,
            date: new Date().toISOString(),
            correctCount: this.correctCount,
            totalQuestions: this.currentQuestions.length,
            scorePercent: scorePercent,
            timeSpent: timeSpent,
            distractions: this.practiceDistractions,
            questions: this.currentQuestions.map(q => {
                const isCorrect = q.isShortAnswer ? 
                    this.checkShortAnswer(q.userShortAnswer || '', q.options[q.correctIndex]) :
                    q.userSelectedIndex === q.correctIndex;
                return {
                    questionText: q.questionText,
                    options: q.options,
                    correctIndex: q.correctIndex,
                    userSelectedIndex: q.userSelectedIndex,
                    isShortAnswer: q.isShortAnswer || false,
                    userShortAnswer: q.userShortAnswer || "",
                    isCorrect: isCorrect,
                    solutionHtml: q.solutionHtml,
                    tip: q.tip,
                    level: q.level,
                    type: q.type
                };
            })
        };

        if (!app.state.examSessions) {
            app.state.examSessions = [];
        }
        app.state.examSessions.push(sessionRecord);
        // Giới hạn tối đa 150 session gần nhất để tránh LocalStorage bị phình quá lớn
        if (app.state.examSessions.length > 150) {
            app.state.examSessions = app.state.examSessions.slice(-150);
        }
        app.saveProgress();

        // Ẩn/Hiện nút xem lại bài kiểm tra và mặc định ẩn review cho tới khi con nhấn nút xem
        document.getElementById("exam-review-box").classList.add("hidden");
        
        const retryBtn = document.getElementById("retry-practice-btn");
        if (this.isExamMode || this.isLessonExamMode) {
            retryBtn.innerHTML = "<i class=\"fa-solid fa-rotate-right\"></i> Thi lại";
        } else {
            retryBtn.innerHTML = "<i class=\"fa-solid fa-rotate-right\"></i> Luyện tập lại";
        }

        // Bắn pháo hoa giấy và phát âm thanh vui vẻ nếu vượt qua bài học thành công (độc lập với mở khóa huy hiệu)
        if (isPassed) {
            app.confetti.start();
            app.audio.playBadge();
        }

        // Tự động mở khóa chương sau nếu đỗ bài thi kết thúc chương
        if (this.isExamMode && isPassed) {
            // Mở khóa huy hiệu chương tương ứng
            let badgeName = "";
            if (this.currentLesson.id === "kt-c1") badgeName = "bac-thay-so-tu-nhien";
            else if (this.currentLesson.id === "kt-c2") badgeName = "chien-binh-chia-het";
            else if (this.currentLesson.id === "kt-c3") badgeName = "ky-si-so-nguyen";
            else if (this.currentLesson.id === "kt-c4") badgeName = "phu-thuy-hinh-hoc";
            else if (this.currentLesson.id === "kt-c5") badgeName = "bac-thay-doi-xung";
            else if (this.currentLesson.id === "kt-c6") badgeName = "bac-thay-phan-so";
            else if (this.currentLesson.id === "kt-c7") badgeName = "chien-binh-thap-phan";
            else if (this.currentLesson.id === "kt-c8") badgeName = "phu-thuy-hinh-co-ban";
            else if (this.currentLesson.id === "kt-c9") badgeName = "bac-thay-xac-suat";
            
            if (badgeName) {
                app.unlockBadge(badgeName);
            }
        }

        // Cập nhật lại Đánh giá phân tích chi tiết và Lịch sử bài học ở cột phải trang chủ ngay lập tức
        app.updateLessonEvaluation(this.currentLesson.id);
        app.renderLessonHistory(this.currentLesson.id);

        document.getElementById("practice-active-box").classList.add("hidden");
        document.getElementById("practice-result-box").classList.remove("hidden");
    },

    // Render danh sách xem lại các câu hỏi kèm theo Lời giải và Mẹo thi
    renderExamReview: function() {
        const reviewBox = document.getElementById("exam-review-box");
        const reviewList = document.getElementById("exam-review-list");
        reviewList.innerHTML = "";

        reviewBox.classList.remove("hidden");
        const parentName = (app && app.config && app.config.parentName) || 'Bố';
        const h4Title = reviewBox.querySelector("h4");
        if (h4Title) {
            h4Title.innerHTML = `<i class="fa-solid fa-square-poll-vertical"></i> Chi tiết bài làm & Giải thích của ${parentName}`;
        }

        this.currentQuestions.forEach((q, idx) => {
            const isCorrect = q.isShortAnswer ? 
                this.checkShortAnswer(q.userShortAnswer || '', q.options[q.correctIndex]) :
                q.userSelectedIndex === q.correctIndex;
            const itemDiv = document.createElement("div");
            itemDiv.className = "review-item card";
            itemDiv.style.borderLeft = isCorrect ? "5px solid var(--success)" : "5px solid var(--danger)";
            itemDiv.style.padding = "1.5rem";
            itemDiv.style.marginBottom = "1rem";
            itemDiv.style.backgroundColor = "var(--bg-card)";
            itemDiv.style.boxShadow = "var(--shadow-sm)";
            
            let optionsHtml = "";
            if (q.isShortAnswer) {
                optionsHtml = `
                    <div style="margin-bottom:0.4rem; color:${isCorrect ? 'var(--success)' : 'var(--danger)'};">
                        <b>Đáp án của con:</b> ${q.userShortAnswer || "Không có câu trả lời"} ${isCorrect ? '✔️' : '❌'}
                    </div>
                    <div style="margin-bottom:0.4rem; color:var(--success); font-weight:700;">
                        <b>Đáp án đúng:</b> ${q.options[q.correctIndex]}
                    </div>
                `;
            } else {
                optionsHtml = q.options.map((opt, oIdx) => {
                    let colorStyle = "";
                    let icon = "";
                    if (oIdx === q.correctIndex) {
                        colorStyle = "color:var(--success); font-weight:700;";
                        icon = "✔️ ";
                    } else if (oIdx === q.userSelectedIndex) {
                        colorStyle = "color:var(--danger); font-weight:700;";
                        icon = "❌ ";
                    }
                    return "<div style=\"margin-bottom:0.4rem; " + colorStyle + "\">" + icon + "<b>" + ["A", "B", "C", "D"][oIdx] + ".</b> " + opt + "</div>";
                }).join("");
            }

            itemDiv.innerHTML = `
                <div style="font-family: var(--font-family) !important; font-weight:700; margin-bottom:0.8rem; display:flex; justify-content:space-between; font-size:0.95rem;">
                    <span style="font-family: var(--font-family) !important;">Câu hỏi ${idx + 1} <span style="font-family: var(--font-family) !important; font-weight:normal; font-size:0.8rem; margin-left:8px; color:var(--text-muted);">(${q.level === 'co-ban' ? 'Cơ bản' : (q.level === 'nang-cao' ? 'Nâng cao' : 'Khó')})</span></span>
                    <span style="font-family: var(--font-family) !important; color: ${isCorrect ? 'var(--success)' : 'var(--danger)'}; font-weight:700;">
                        ${isCorrect ? 'Đúng' : 'Sai'}
                    </span>
                </div>
                <div class="math-render" style="font-family: var(--font-family) !important; font-size:1.1rem; margin-bottom:1rem; font-weight:600; line-height:1.5;">${q.questionText}</div>
                <div class="math-render" style="font-family: var(--font-family) !important; margin-bottom:1rem; padding-left:1rem; border-left:3px solid var(--border-color);">${optionsHtml}</div>
                
                <div style="font-family: var(--font-family) !important; background-color:var(--primary-bg); padding:1rem; border-radius:8px; margin-top:1rem; font-size:0.95rem;">
                    <strong style="font-family: var(--font-family) !important; color:var(--primary);"><i class="fa-solid fa-graduation-cap"></i> Lời giải chi tiết:</strong>
                    <div class="math-render" style="font-family: var(--font-family) !important; margin-top:0.4rem; line-height:1.6; color:var(--text-main);">${q.solutionHtml || "Đang cập nhật..."}</div>
                </div>
                
                <div style="font-family: var(--font-family) !important; background-color:var(--warning-bg); padding:1rem; border-radius:8px; margin-top:0.8rem; font-size:0.95rem;">
                    <strong style="font-family: var(--font-family) !important; color:var(--warning);"><i class="fa-solid fa-lightbulb"></i> Mẹo khi làm bài (Exam Tips):</strong>
                    <div class="math-render" style="font-family: var(--font-family) !important; margin-top:0.4rem; line-height:1.6; color:var(--text-main);"><i>${q.tip || "Đọc kỹ đề bài và loại trừ phương án sai."}</i></div>
                </div>
            `;
            reviewList.appendChild(itemDiv);
        });

        // Render KaTeX riêng cho các phần tử chứa công thức toán học, tránh làm ảnh hưởng font chữ tiếng Việt tĩnh
        if (window.renderMathInElement) {
            const mathElements = reviewList.querySelectorAll(".math-render");
            mathElements.forEach(el => {
                window.renderMathInElement(el, {
                    delimiters: [
                        {left: "$$", right: "$$", display: true},
                        {left: "$", right: "$", display: false}
                    ]
                });
            });
        }
    },

    checkShortAnswer: function(userInput, correctText) {
        const cleanUser = this.cleanAnswerForComparison(userInput);
        const cleanCorrect = this.cleanAnswerForComparison(correctText);
        if (!cleanCorrect) return false;
        
        // So sánh bằng nhau tuyệt đối sau khi làm sạch
        if (cleanUser === cleanCorrect) return true;
        
        // Kiểm tra thông cảm sai lệch nhỏ nếu là dạng tập hợp, ví dụ người dùng gõ chỉ các phần tử {1; 2; 3} thay vì A={1; 2; 3}
        if (cleanCorrect.includes(cleanUser) && cleanUser.length >= Math.floor(cleanCorrect.length * 0.4)) return true;
        if (cleanUser.includes(cleanCorrect) && cleanCorrect.length >= Math.floor(cleanUser.length * 0.4)) return true;
        
        return false;
    },

    cleanAnswerForComparison: function(ans) {
        if (typeof ans !== 'string') return '';
        // Loại bỏ thứ tự phương án ở đầu (A. B. C. D. hoặc A) B) C) D))
        let s = ans.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim();
        // Loại bỏ ký tự đặc biệt LaTeX $
        s = s.replace(/\$/g, '').trim();
        // Loại bỏ các chữ cái đơn vị phổ biến trong tiếng Việt của lớp 6
        s = s.replace(/(chiếc kẹo|kẹo|hộp sữa|sữa|hộp|quả|bông hoa|hoa|quyển sách|sách|vở|bút|học sinh|bạn|khối rubik|khối|rubik|phần tử|ước|bội|dm|cm|m|kg|g|giờ|phút|giây|lít|l|độ c|độ|c)/g, '').trim();
        // Loại bỏ khoảng trắng và viết thường
        s = s.replace(/\s+/g, '').toLowerCase();
        return s;
    },

    shouldForceMCQ: function(questionText, correctOption) {
        if (typeof questionText !== 'string' || typeof correctOption !== 'string') return false;
        
        const textLower = questionText.toLowerCase();
        const mcqKeywords = [
            "dưới đây", "sau đây", "khẳng định nào", "phát biểu nào", 
            "cách viết nào", "nhận xét nào", "đáp án nào", "công thức nào",
            "hình nào", "trong các phát biểu", "khẳng định nào đúng", 
            "khẳng định nào sai", "phát biểu nào đúng", "phát biểu nào sai",
            "phương án nào", "lựa chọn nào"
        ];
        
        for (const kw of mcqKeywords) {
            if (textLower.includes(kw)) {
                return true;
            }
        }
        
        // Kiểm tra đáp án đúng (correctOption)
        // Loại bỏ ký tự $
        let cleanOpt = correctOption.replace(/\$/g, '').trim();
        
        // Nếu đáp án có chứa LaTeX phức tạp như phân số, căn thức, song song, vuông góc, góc, tam giác
        const complexLatex = [
            "\\frac", "\\sqrt", "\\parallel", "\\perp", "\\angle", "\\triangle", 
            "\\cup", "\\cap", "\\subset", "\\in", "\\notin", "\\bar", "\\overline",
            "\\times", "\\cdot", "\\degree", "^"
        ];
        for (const latex of complexLatex) {
            if (correctOption.includes(latex)) {
                return true;
            }
        }
        
        // Nếu là tập hợp phức tạp (có dấu ngoặc nhọn)
        if (correctOption.includes('{') || correctOption.includes('}')) {
            return true;
        }
        
        // Nếu đáp án chứa văn bản dài (ví dụ có chứa các từ tiếng Việt dài, không chỉ là số và đơn vị)
        // Loại bỏ các chữ số, dấu phép tính (+ - * / = < >)
        let textOnly = cleanOpt.replace(/[0-9\+\-\*\/\=\<\>\(\)\;\,\.\%]/g, '').trim();
        // Loại bỏ các đơn vị thông dụng
        const units = [
            "chiếc kẹo", "kẹo", "hộp sữa", "sữa", "hộp", "quả", "bông hoa", "hoa", 
            "quyển sách", "sách", "vở", "bút", "học sinh", "bạn", "khối rubik", 
            "khối", "rubik", "phần tử", "ước", "bội", "dm", "cm", "m", "kg", "g", 
            "giờ", "phút", "giây", "lít", "l", "độ c", "độ", "c", "trang", "tuổi", 
            "con", "cái", "ngày", "tháng", "năm", "đồng", "đ", "lần"
        ];
        for (const unit of units) {
            textOnly = textOnly.replace(new RegExp('\\b' + unit + '\\b', 'gi'), '').trim();
        }
        
        // Nếu sau khi loại bỏ số và đơn vị, phần chữ còn lại vẫn dài (ví dụ > 5 ký tự) hoặc chứa khoảng trắng (nhiều từ)
        if (textOnly.replace(/\s+/g, '').length > 5) {
            return true;
        }
        
        return false;
    },

    showPracticeReview: function() {
        this.isGraded = true;
        document.getElementById("practice-result-box").classList.add("hidden");
        document.getElementById("practice-active-box").classList.remove("hidden");
        
        // Đảm bảo hiển thị đúng cột câu hỏi và ẩn cột game (nếu có)
        const splitContainer = document.getElementById("practice-split-container");
        const gameContainer = document.getElementById("td-game-container");
        const questionContainer = document.getElementById("td-question-container");
        if (splitContainer) splitContainer.classList.remove("practice-split-active");
        if (gameContainer) gameContainer.classList.add("hidden");
        if (questionContainer) questionContainer.classList.remove("hidden");

        this.goToQuestion(0);
    },

    updateGradedScore: function() {
        this.correctCount = 0;
        this.currentQuestions.forEach(q => {
            const isCorrect = q.isShortAnswer ? 
                this.checkShortAnswer(q.userShortAnswer || '', q.options[q.correctIndex]) :
                q.userSelectedIndex === q.correctIndex;
            if (isCorrect) {
                this.correctCount++;
            }
        });
        const scorePercent = Math.round((this.correctCount / this.currentQuestions.length) * 100);
        
        // Cập nhật lại điểm số trên màn hình kết quả
        document.getElementById("result-correct-count").innerText = this.correctCount + "/" + this.currentQuestions.length;
        
        let rank = "Chưa đạt";
        if (scorePercent >= 95) rank = "Xuất sắc";
        else if (scorePercent >= 80) rank = "Giỏi";
        else if (scorePercent >= 70) rank = "Khá";
        else if (scorePercent >= 50) rank = "Đạt";
        else if (scorePercent >= 35) rank = "Yếu";
        
        document.getElementById("result-score-title").innerText = rank + " (" + scorePercent + "%)";
        const rankBadge = document.getElementById("result-rank-badge");
        if (rankBadge) {
            rankBadge.innerText = rank;
            const isPassed = scorePercent >= 80;
            rankBadge.style.backgroundColor = isPassed ? "var(--success-bg)" : "var(--danger-bg)";
            rankBadge.style.color = isPassed ? "var(--success)" : "var(--danger)";
        }
        
        // Lưu lại điểm số mới vào bộ nhớ
        if (this.isSubtopicPracticeMode) {
            app.state.subtopicScores = app.state.subtopicScores || {};
            app.state.subtopicScores[this.currentSubtopic.id] = Math.max(app.state.subtopicScores[this.currentSubtopic.id] || 0, scorePercent);
        } else {
            if (!this.isExamMode && !this.isLessonExamMode) {
                app.state.levelScores = app.state.levelScores || {};
                const key = `${this.currentLesson.id}_${this.currentLevel}`;
                app.state.levelScores[key] = Math.max(app.state.levelScores[key] || 0, scorePercent);
            }
        }
        app.saveProgress();
    },

    exitPractice: function() {
        if (this.isFastGame) {
            Swal.fire({
                title: 'Con muốn dừng chơi game?',
                text: 'Hệ thống sẽ tải lại trang và đưa con về màn hình chính.',
                icon: 'warning',
                target: document.getElementById('tab-practice') || 'body',
                showCancelButton: true,
                confirmButtonColor: 'var(--danger)',
                cancelButtonColor: 'var(--primary)',
                confirmButtonText: 'Có, dừng chơi',
                cancelButtonText: 'Không, chơi tiếp'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
            return;
        }
        if (this.isExiting) return;
        this.isExiting = true;

        if (this.isGraded) {
            // Đã chấm điểm: Quay lại bảng điểm kết quả thay vì hiện hộp thoại xác nhận thoát
            document.getElementById("practice-active-box").classList.add("hidden");
            document.getElementById("practice-result-box").classList.remove("hidden");
            document.body.classList.remove("super-focus-active");
            this.isExiting = false;
            return;
        }

        // Tạm dừng game nếu đang chơi game
        let wasGamePlaying = false;
        if (window.game && game.isPlaying) {
            wasGamePlaying = true;
            game.isPlaying = false; // tạm dừng loop
        }

        Swal.fire({
            title: `${(app && app.config && app.config.studentName) || 'Con'} muốn dừng làm bài?`,
            text: 'Kết quả lượt này sẽ không được lưu. Khi làm lại con sẽ gặp câu hỏi mới hoàn toàn nhé!',
            icon: 'warning',
            target: document.getElementById('tab-practice') || 'body',
            showCancelButton: true,
            confirmButtonColor: 'var(--danger)',
            cancelButtonColor: 'var(--primary)',
            confirmButtonText: 'Có, con muốn dừng',
            cancelButtonText: 'Không, con làm tiếp'
        }).then((result) => {
            if (result.isConfirmed) {
                if (window.game) game.stop();
                if (this.examInterval) clearInterval(this.examInterval);
                document.getElementById("exam-timer-wrapper").classList.add("hidden");
                
                // Mở rộng lại sidebar
                if (window.app && typeof app.expandSidebar === 'function') {
                    app.expandSidebar();
                }
                
                // Tắt Super Focus Mode
                document.body.classList.remove("super-focus-active");
                
                // Tắt chế độ hiển thị phóng to game
                document.body.classList.remove("game-mode-active");
                
                // Thoát toàn màn hình
                app.exitFullscreen();
                document.body.classList.remove("practice-fullscreen-active");
                
                // Khôi phục thanh cuộn cho body và html ngay lập tức
                app.restoreScrollbar();
                
                this.currentQuestions = [];
                
                // Trì hoãn việc ẩn và chuyển tab để tránh lỗi kẹt scrollbar của trình duyệt do ẩn phần tử đang fullscreen quá nhanh
                setTimeout(() => {
                    document.getElementById("practice-active-box").classList.add("hidden");
                    app.switchLessonTab('practice');
                    this.isExiting = false;
                }, 150);
            } else {
                this.isExiting = false;
                // Khôi phục game chạy tiếp nếu trước đó đang chơi game
                if (wasGamePlaying && window.game) {
                    game.isPlaying = true;
                    if (game.animationFrame) {
                        cancelAnimationFrame(game.animationFrame);
                    }
                    game.loop();
                }
            }
        });
    },

    // --- STUDENT PDF PRINTING METHODS ---
    showStudentPrintPrompt: function() {
        this.showStudentPrintPromptWithLevel();
    },

    showStudentPrintPromptWithLevel: function(level) {
        if (!this.currentLesson && window.app && app.currentLesson) {
            this.currentLesson = app.currentLesson;
        }
        const lesson = this.currentLesson;
        if (!lesson) {
            Swal.fire({ icon: 'warning', title: 'Thông báo', text: 'Không tìm thấy thông tin bài học hiện tại!' });
            return;
        }

        const selectedLevel = level || 'nang-cao';

        // 1. Nhập mã PIN
        Swal.fire({
            title: 'Xác nhận phụ huynh 🔑',
            text: 'Tính năng in đề thi giấy yêu cầu nhập mật mã phụ huynh để bảo mật đáp án.',
            input: 'password',
            inputPlaceholder: 'Nhập mật mã phụ huynh...',
            showCancelButton: true,
            confirmButtonColor: 'var(--primary)',
            cancelButtonColor: 'var(--danger)',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy bỏ',
            target: document.getElementById('tab-practice') || 'body'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const pin = result.value;
                try {
                    const res = await fetch(app.getApiUrl("/api/verify-pin"), {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ pin })
                    });
                    if (res.ok) {
                        // 2. PIN đúng, hỏi chế độ in
                        let levelLabel = "Mức độ: " + (selectedLevel === 'co-ban' ? 'Cơ bản' : (selectedLevel === 'nang-cao' ? 'Nâng cao' : (selectedLevel === 'kho' ? 'Khó' : 'Chất lượng cao AI')));
                        Swal.fire({
                            title: 'Chọn chế độ in đề thi 🖨️',
                            html: `Chọn cách xuất bản đề thi cho bài học: <br/><b>${lesson.title}</b><br/><small style="color:var(--text-muted);">${levelLabel}</small>`,
                            icon: 'question',
                            showDenyButton: true,
                            showCancelButton: true,
                            confirmButtonText: 'In Đề + Đáp án',
                            denyButtonText: 'Chỉ in Đề thi',
                            cancelButtonText: 'Hủy',
                            confirmButtonColor: 'var(--success)',
                            denyButtonColor: 'var(--primary)',
                            target: document.getElementById('tab-practice') || 'body'
                        }).then((printChoice) => {
                            if (printChoice.isConfirmed) {
                                // In kèm đáp án
                                this.generateStudentPrintExam(lesson, true, selectedLevel);
                            } else if (printChoice.isDenied) {
                                // Chỉ in đề
                                this.generateStudentPrintExam(lesson, false, selectedLevel);
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Mật mã không đúng',
                            text: 'Mật mã phụ huynh nhập vào không chính xác!',
                            target: document.getElementById('tab-practice') || 'body'
                        });
                    }
                } catch (err) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi kết nối',
                        text: 'Không thể kết nối tới máy chủ.',
                        target: document.getElementById('tab-practice') || 'body'
                    });
                }
            }
        });
    },

    generateStudentPrintExam: function(lesson, includeSolution, level = 'nang-cao') {
        const studentId = (window.app && app.config && app.config.defaultStudentId) || 'default';
        const classLevel = (window.app && app.config && app.config.currentClass) || '6';

        // Nếu là cấp độ Chất lượng cao do AI sinh -> Tải đề mẫu từ server
        if (level === 'chat-luong-cao') {
            Swal.fire({
                title: 'Đang tải câu hỏi...',
                text: 'Đang kết nối server để lấy đề thi mẫu...',
                allowOutsideClick: false,
                target: document.getElementById('tab-practice') || 'body',
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            fetch(this.getApiUrl(`/api/get-questions?lessonId=${lesson.id}&lessonTitle=${encodeURIComponent(lesson.title)}&classLevel=${classLevel}&studentId=${studentId}`))
                .then(res => {
                    if (!res.ok) throw new Error('Không thể kết nối với server.');
                    return res.json();
                })
                .then(data => {
                    let questions = null;
                    if (data) {
                        if (Array.isArray(data)) {
                            questions = data;
                        } else if (Array.isArray(data.questions)) {
                            questions = data.questions;
                        }
                    }

                    if (!questions || questions.length === 0) {
                        throw new Error('Dữ liệu câu hỏi trống.');
                    }

                    Swal.fire({
                        title: 'Đang biên dịch đề thi...',
                        text: 'Trình giải mã đang sinh các bộ số ngẫu nhiên...',
                        allowOutsideClick: false,
                        target: document.getElementById('tab-practice') || 'body',
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    // Khởi chạy Web Worker để sinh số ngẫu nhiên
                    const worker = new Worker('js/question-generator-worker.js');
                    worker.postMessage({ questions: questions, maxAttempts: 500 });

                    worker.onmessage = (e) => {
                        Swal.close();
                        worker.terminate();
                        const response = e.data;
                        if (response.status === 'success') {
                            this.renderAndPrintStudentExam(lesson.title, response.questions, includeSolution, classLevel, 'chat-luong-cao');
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Lỗi sinh số ngẫu nhiên',
                                text: 'Không thể tạo đề thi: ' + (response.message || 'Lỗi Web Worker.'),
                                target: document.getElementById('tab-practice') || 'body'
                            });
                        }
                    };

                    worker.onerror = (err) => {
                        Swal.close();
                        worker.terminate();
                        console.error("Worker in đề thi AI bị lỗi:", err);
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi luồng chạy Web Worker',
                            text: 'Không thể khởi động Web Worker để tạo đề: ' + err.message,
                            target: document.getElementById('tab-practice') || 'body'
                        });
                    };
                })
                .catch(err => {
                    Swal.close();
                    console.error("Lỗi khi tải đề thi in:", err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi tải đề thi',
                        text: 'Không thể tải đề thi từ server: ' + err.message,
                        target: document.getElementById('tab-practice') || 'body'
                    });
                });
        } else {
            // Tự sinh đề trực tiếp tại client tức thì (Hỗ trợ ngoại tuyến)
            try {
                let questions = [];
                const isExam = lesson.questionType.startsWith("cuoi-chuong") || lesson.id.startsWith("kt-");

                if (isExam) {
                    // Cấu trúc thi chương (sinh ngẫu nhiên các loại câu hỏi của chương)
                    const chapterTypes = {
                        "chuong-1": ["tap-hop", "ghi-so-tu-nhien", "tap-hop-thu-tu", "cong-tru-so-tu-nhien", "nhan-chia-so-tu-nhien", "luy-thua", "thu-tu-phep-tinh"],
                        "chuong-2": ["quan-he-chia-het", "dau-hieu-chia-het", "so-nguyen-to", "ucln", "bcnn"],
                        "chuong-3": ["tap-hop-so-nguyen", "cong-tru-so-nguyen", "dau-ngoac", "nhan-so-nguyen", "chia-het-uoc-boi-so-nguyen"],
                        "chuong-4": ["hinh-hoc-chuong-4", "hinh-hoc-2-chuong-4", "chu-vi-dien-tich"],
                        "chuong-5": ["truc-doi-xung", "tam-doi-xung"],
                        "chuong-6": ["phan-so-bang-nhau", "so-sanh-phan-so", "cong-tru-phan-so", "nhan-chia-phan-so", "hai-bai-toan-phan-so"],
                        "chuong-7": ["so-thap-phan", "tinh-so-thap-phan", "lam-tron-uoc-luong", "ti-so-phan-tram"],
                        "chuong-8": ["diem-duong-thang", "tia-hinh-hoc", "doan-thang", "trung-diem", "goc", "so-do-goc"],
                        "chuong-9": ["thu-thap-du-lieu", "bang-thong-ke-bieu-do-tranh", "bieu-do-cot", "bieu-do-cot-kep", "ket-qua-co-the", "xac-suat-thuc-nghiem"],
                        "l4-chuong-1": ["l4-on-tap-100k", "l4-phep-tinh-100k", "l4-so-chan-le", "l4-bieu-thuc-chu", "l4-toan-ba-buoc-tinh"],
                        "l4-chuong-2": ["l4-do-goc", "l4-phan-loai-goc"],
                        "l4-chuong-3": ["l4-so-sau-chu-so", "l4-hang-va-lop", "l4-lop-trieu", "l4-lam-tron-tram-nghin", "l4-so-sanh-nhieu-chu-so", "l4-day-so-tu-nhien"],
                        "l4-chuong-4": ["l4-yen-ta-tan", "l4-don-vi-dien-tich", "l4-giay-the-ki"],
                        "l4-chuong-5": ["l4-cong-nhieu-chu-so", "l4-tru-nhieu-chu-so", "l4-tinh-chat-cong", "l4-tong-hieu"],
                        "l4-chuong-6": ["l4-duong-vuong-goc", "l4-duong-song-song", "l4-binh-hanh-thoi"],
                        "l4-chuong-7": ["luyen-tap-chung-l4-c7-1", "luyen-tap-chung-l4-c7-2", "luyen-tap-chung-l4-c7-3", "luyen-tap-chung-l4-c7-4"],
                        "l4-chuong-8": ["l4-nhan-mot-chu-so", "l4-chia-mot-chu-so", "l4-nhan-chia-10-100", "l4-trung-binh-cong", "l4-rut-ve-don-vi"],
                        "l4-chuong-9": ["l4-thong-ke", "l4-bieu-do-cot", "l4-su-kien"],
                        "l4-chuong-10": ["l4-khai-niem-phan-so", "l4-phan-so-chia-so-tu-nhien", "l4-rut-gon-phan-so", "l4-so-sanh-phan-so"],
                        "l4-chuong-11": ["l4-cong-phan-so", "l4-tru-phan-so"],
                        "l4-chuong-12": ["l4-nhan-phan-so", "l4-tim-phan-so-cua-so"],
                        "l4-chuong-13": ["luyen-tap-chung-l4-c13-1", "luyen-tap-chung-l4-c13-2", "luyen-tap-chung-l4-c13-3", "luyen-tap-chung-l4-c13-4", "luyen-tap-chung-l4-c13-5", "luyen-tap-chung-l4-c13-6"]
                    };

                    let chapterId = "chuong-1";
                    for (const chapter of COURSE_DATA) {
                        if (chapter.lessons.some(l => l.id === lesson.id)) {
                            chapterId = chapter.id;
                            break;
                        }
                    }

                    const types = chapterTypes[chapterId] || ["tap-hop"];
                    let examQuestionsCount = 18;
                    let mcqCount = 12;
                    let diffDistribution = [];

                    if (level === 'co-ban') {
                        examQuestionsCount = 20;
                        mcqCount = 16;
                        for (let i = 0; i < 16; i++) diffDistribution.push('co-ban');
                        for (let i = 0; i < 4; i++) diffDistribution.push('nang-cao');
                    } else if (level === 'kho') {
                        examQuestionsCount = 16;
                        mcqCount = 10;
                        for (let i = 0; i < 2; i++) diffDistribution.push('co-ban');
                        for (let i = 0; i < 6; i++) diffDistribution.push('nang-cao');
                        for (let i = 0; i < 8; i++) diffDistribution.push('kho');
                    } else { // nang-cao
                        examQuestionsCount = 18;
                        mcqCount = 12;
                        for (let i = 0; i < 4; i++) diffDistribution.push('co-ban');
                        for (let i = 0; i < 10; i++) diffDistribution.push('nang-cao');
                        for (let i = 0; i < 4; i++) diffDistribution.push('kho');
                    }

                    this.shuffle(diffDistribution);

                    for (let i = 0; i < examQuestionsCount; i++) {
                        const randomType = types[Math.floor(Math.random() * types.length)];
                        const randomLevel = diffDistribution[i];
                        const q = this.generateQuestion(randomType, randomLevel);
                        q.level = randomLevel;
                        q.type = randomType;
                        q.isShortAnswer = false;
                        questions.push(q);
                    }

                    // Đánh dấu các câu điền đáp án ngắn phù hợp
                    let shortAnswerAssigned = 0;
                    const targetShortAnswerCount = examQuestionsCount - mcqCount;
                    for (let i = examQuestionsCount - 1; i >= 0; i--) {
                        const q = questions[i];
                        if (shortAnswerAssigned < targetShortAnswerCount && !q.forceMCQ) {
                            q.isShortAnswer = true;
                            shortAnswerAssigned++;
                        } else {
                            q.isShortAnswer = false;
                        }
                    }
                } else {
                    // Sinh đề luyện tập (10 câu)
                    const hasSubtopics = lesson.subtopics && lesson.subtopics.length > 0;
                    let type = lesson.questionType;

                    if (hasSubtopics) {
                        let subIndex = 0;
                        if (level === 'nang-cao') subIndex = 1;
                        else if (level === 'kho') subIndex = 2;
                        if (lesson.subtopics[subIndex]) {
                            type = lesson.subtopics[subIndex].questionType;
                        }
                    }

                    for (let i = 0; i < 10; i++) {
                        const q = this.generateQuestion(type, level);
                        q.level = level;
                        q.type = type;
                        questions.push(q);
                    }
                }

                // Tiến hành render và in
                this.renderAndPrintStudentExam(lesson.title, questions, includeSolution, classLevel, level);
            } catch (err) {
                console.error("Lỗi sinh đề offline tại client:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi sinh đề',
                    text: 'Không thể tự sinh đề thi offline: ' + err.message,
                    target: document.getElementById('tab-practice') || 'body'
                });
            }
        }
    },

    renderAndPrintStudentExam: function(lessonTitle, questionsList, includeSolution, classLevel, level) {
        const schoolName = (window.app && app.config && app.config.schoolName) || "HỆ THỐNG GIÁO DỤC CÁ NHÂN HÓA AI";
        const defaultStudentName = (window.app && app.config && app.config.studentName) || "......................................................................";
        
        const levelTextMap = {
            'co-ban': 'Cơ bản',
            'nang-cao': 'Nâng cao',
            'kho': 'Khó',
            'chat-luong-cao': 'Chất lượng cao AI'
        };
        const levelText = levelTextMap[level] || 'Nâng cao';

        // Xây dựng Header & Thông tin đề thi
        let html = `
            <!-- Trang Đề thi -->
            <div class="print-exam-page text-black bg-white" style="font-family: 'Times New Roman', Times, Georgia, serif;">
                <!-- Header trường học & tên đề -->
                <div style="display: flex; justify-content: space-between; align-items: start; border-bottom: 2px solid #000000; padding-bottom: 10px; margin-bottom: 20px;">
                    <div style="text-align: center; font-weight: bold; font-size: 11px; text-transform: uppercase; width: 45%;">
                        <p style="margin: 0; padding: 0;">${schoolName}</p>
                        <p style="font-size: 9px; font-weight: normal; margin-top: 2px; margin-bottom: 0;">Chương trình học tập cá nhân hóa AI</p>
                    </div>
                    <div style="text-align: center; font-weight: bold; font-size: 13px; text-transform: uppercase; width: 50%;">
                        <p style="margin: 0; padding: 0;">ĐỀ THI KIỂM TRA CHUYÊN ĐỀ</p>
                        <p style="font-size: 11px; font-weight: bold; font-style: italic; text-transform: none; margin-top: 4px; margin-bottom: 0;">Môn: Toán Lớp ${classLevel} - Mức độ: ${levelText}</p>
                    </div>
                </div>

                <!-- Tên Chuyên đề -->
                <div style="text-align: center; font-weight: bold; font-size: 15px; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 0.5px;">
                    Chuyên đề: ${lessonTitle}
                </div>

                <!-- Phần điền thông tin học sinh -->
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; font-size: 13px; margin-bottom: 20px; line-height: 1.8;">
                    <div style="width: 60%;">Họ và tên học sinh: <span style="font-weight: bold;">${defaultStudentName}</span></div>
                    <div style="width: 35%;">Ngày làm bài: ....../....../20...</div>
                    <div style="width: 60%;">Lớp: ....................................................................</div>
                    <div style="width: 35%;">Thời gian làm bài: 45 phút</div>
                </div>

                <!-- Khung ghi điểm & Lời phê -->
                <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #000000; margin-bottom: 25px; font-size: 13px; text-align: center;">
                    <thead>
                        <tr style="background-color: #f8fafc;">
                            <th style="border: 1px solid #000000; padding: 8px; font-weight: bold; width: 30%;">ĐIỂM SỐ</th>
                            <th style="border: 1px solid #000000; padding: 8px; font-weight: bold;">LỜI PHÊ CỦA PHỤ HUYNH</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="height: 60px;">
                            <td style="border: 1px solid #000000;"></td>
                            <td style="border: 1px solid #000000; text-align: left; padding: 8px; vertical-align: top; color: #64748b;"></td>
                        </tr>
                    </tbody>
                </table>

                <div style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 12px; border-bottom: 1px dashed #000000; padding-bottom: 4px;">
                    PHẦN I. CÂU HỎI TRẮC NGHIỆM (10 câu hỏi)
                </div>
                <p style="font-style: italic; font-size: 12px; margin-bottom: 15px; color: #475569;">Khoanh tròn vào chữ cái đứng trước câu trả lời đúng nhất hoặc điền vào Bảng đáp án ở cuối đề.</p>

                <!-- Danh sách câu hỏi -->
                <div style="display: flex; flex-direction: column; gap: 20px;">
        `;

        // Render từng câu hỏi
        questionsList.forEach((q, idx) => {
            const cleanText = q.questionText.replace(/<br\s*\/?>/gi, '<br/>');
            
            // Render các phương án lựa chọn A, B, C, D
            let optionsHtml = "";
            if (q.options && q.options.length > 0) {
                optionsHtml = `<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 8px; padding-left: 15px; font-size: 13px;">`;
                q.options.forEach((opt, oIdx) => {
                    const cleanOpt = opt.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim();
                    const letter = ["A", "B", "C", "D"][oIdx];
                    optionsHtml += `<div style="line-height: 1.5;"><span style="font-weight: bold;">${letter}.</span> ${cleanOpt}</div>`;
                });
                optionsHtml += `</div>`;
            }

            html += `
                <div style="page-break-inside: avoid; break-inside: avoid;">
                    <div class="math-render" style="font-size: 13.5px; font-weight: 600; line-height: 1.6; text-align: justify;">
                        Câu ${idx + 1}: ${cleanText}
                    </div>
                    ${optionsHtml}
                </div>
            `;
        });

        html += `
                </div>

                <!-- Bảng điền đáp án trắc nghiệm cho học sinh -->
                <div style="margin-top: 35px; page-break-inside: avoid; break-inside: avoid;">
                    <div style="font-weight: bold; font-size: 12px; text-align: center; margin-bottom: 10px; text-transform: uppercase;">
                        BẢNG ĐIỀN ĐÁP ÁN TRẮC NGHIỆM
                    </div>
                    <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #000000; text-align: center; font-size: 12px;">
                        <thead>
                            <tr style="background-color: #f1f5f9; font-weight: bold;">
                                <td style="border: 1px solid #000000; padding: 6px; font-weight: bold;">Câu hỏi</td>
                                <td style="border: 1px solid #000000; padding: 6px;">1</td>
                                <td style="border: 1px solid #000000; padding: 6px;">2</td>
                                <td style="border: 1px solid #000000; padding: 6px;">3</td>
                                <td style="border: 1px solid #000000; padding: 6px;">4</td>
                                <td style="border: 1px solid #000000; padding: 6px;">5</td>
                                <td style="border: 1px solid #000000; padding: 6px;">6</td>
                                <td style="border: 1px solid #000000; padding: 6px;">7</td>
                                <td style="border: 1px solid #000000; padding: 6px;">8</td>
                                <td style="border: 1px solid #000000; padding: 6px;">9</td>
                                <td style="border: 1px solid #000000; padding: 6px;">10</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="height: 32px;">
                                <td style="border: 1px solid #000000; padding: 6px; font-weight: bold;">Đáp án chọn</td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- Footer bản quyền chuyên nghiệp -->
                <div style="margin-top: 30px; border-top: 1px solid #d1d5db; padding-top: 6px; text-align: center; font-size: 9px; color: #4b5563; font-family: 'Times New Roman', Times, Georgia, serif; font-style: italic; opacity: 0.85;">
                    © Copyright by Trần Hải Đăng - Khoa Binh chủng, Trường Quân sự Quân khu 3 (Hotline: 0978396032). All rights reserved.
                </div>
            </div>
        `;

        // Render Hướng dẫn giải chi tiết & Đáp án ở trang sau
        if (includeSolution) {
            html += `
                <!-- Ngắt trang sang trang Đáp án riêng biệt -->
                <div class="print-page-break" style="margin-top: 40px;"></div>

                <div class="print-exam-page text-black bg-white" style="font-family: 'Times New Roman', Times, Georgia, serif; margin-top: 20px;">
                    <div style="text-align: center; font-weight: bold; font-size: 15px; text-transform: uppercase; border-bottom: 2px solid #000000; padding-bottom: 8px; margin-bottom: 20px;">
                        HƯỚNG DẪN GIẢI CHI TIẾT & ĐÁP ÁN ĐỀ THI
                    </div>
                    <p style="font-size: 13px; margin-bottom: 15px; font-weight: bold;">Chuyên đề: ${lessonTitle} - Mức độ: ${levelText}</p>
                    
                    <!-- Bảng đáp án nhanh -->
                    <div style="margin-bottom: 25px;">
                        <div style="font-weight: bold; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">
                            1. BẢNG ĐÁP ÁN NHANH
                        </div>
                        <table style="width: 100%; border-collapse: collapse; border: 1.2px solid #000000; text-align: center; font-size: 12px;">
                            <thead>
                                <tr style="background-color: #f1f5f9; font-weight: bold;">
                                    <td style="border: 1px solid #000000; padding: 6px;">Câu</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">1</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">2</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">3</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">4</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">5</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">6</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">7</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">8</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">9</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">10</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="height: 28px; font-weight: bold;">
                                    <td style="border: 1px solid #000000; background-color: #f1f5f9; color: #000000 !important;">Đáp án</td>
            `;

            // Lấy ký tự đáp án nhanh A, B, C, D
            questionsList.forEach(q => {
                const correctLetter = ["A", "B", "C", "D"][q.correctIndex || 0];
                html += `<td style="border: 1px solid #000000; color: #10b981 !important;">${correctLetter}</td>`;
            });

            html += `
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style="font-weight: bold; font-size: 12px; margin-bottom: 12px; text-transform: uppercase;">
                        2. LỜI GIẢI CHI TIẾT TỪNG CÂU
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 18px; font-size: 13px; line-height: 1.6;">
            `;

            questionsList.forEach((q, idx) => {
                const correctLetter = ["A", "B", "C", "D"][q.correctIndex || 0];
                const cleanSol = q.solutionHtml ? q.solutionHtml.replace(/<br\s*\/?>/gi, '<br/>') : "Đang cập nhật...";
                const cleanTip = q.tip ? q.tip.replace(/<br\s*\/?>/gi, '<br/>') : "";

                html += `
                    <div style="page-break-inside: avoid; break-inside: avoid; border-bottom: 1px dashed #e2e8f0; padding-bottom: 12px;">
                        <p style="font-weight: bold; margin-bottom: 4px;">Câu ${idx + 1}: Chọn đáp án ${correctLetter}</p>
                        <div class="math-render" style="margin-top: 6px; padding-left: 10px; border-left: 2px solid #8b5cf6; color: #334155 !important;">
                            ${cleanSol}
                        </div>
                `;

                if (cleanTip) {
                    html += `
                        <div class="math-render" style="margin-top: 6px; padding-left: 10px; font-style: italic; color: #475569 !important; font-size: 12.5px;">
                            💡 Mẹo làm bài: ${cleanTip}
                        </div>
                    `;
                }

                html += `
                    </div>
                `;
            });

            html += `
                    </div>
                    <!-- Footer bản quyền chuyên nghiệp -->
                    <div style="margin-top: 30px; border-top: 1px solid #d1d5db; padding-top: 6px; text-align: center; font-size: 9px; color: #4b5563; font-family: 'Times New Roman', Times, Georgia, serif; font-style: italic; opacity: 0.85;">
                        © Copyright by Trần Hải Đăng - Khoa Binh chủng, Trường Quân sự Quân khu 3 (Hotline: 0978396032). All rights reserved.
                    </div>
                </div>
            `;
        }

        // 1. Hiển thị hộp thoại xem trước (Modal Preview)
        const previewModal = document.getElementById("print-preview-modal");
        const previewPaper = document.getElementById("print-preview-paper");
        if (previewModal && previewPaper) {
            previewPaper.innerHTML = html;

            // Auto-render KaTeX trong preview paper (bao bọc try-catch tránh sập luồng JS)
            try {
                if (window.renderMathInElement) {
                    window.renderMathInElement(previewPaper, {
                        delimiters: [
                            {left: "$$", right: "$$", display: true},
                            {left: "$", right: "$", display: false},
                            {left: "\\(", right: "\\)", display: false},
                            {left: "\\[", right: "\\]", display: true}
                        ],
                        throwOnError: false
                    });
                }
            } catch (katexErr) {
                console.warn("KaTeX render preview error:", katexErr);
            }

            // Hiển thị modal xem trước
            previewModal.classList.remove("hidden");
        } else {
            // Fallback nếu không có modal preview (in trực tiếp)
            let paper = document.getElementById("student-print-paper");
            if (!paper) {
                paper = document.createElement("div");
                paper.id = "student-print-paper";
                document.body.appendChild(paper);
            }
            paper.innerHTML = html;
            
            try {
                if (window.renderMathInElement) {
                    window.renderMathInElement(paper, {
                        delimiters: [
                            {left: "$$", right: "$$", display: true},
                            {left: "$", right: "$", display: false},
                            {left: "\\(", right: "\\)", display: false},
                            {left: "\\[", right: "\\]", display: true}
                        ],
                        throwOnError: false
                    });
                }
            } catch (katexErr) {
                console.warn("KaTeX fallback render error:", katexErr);
            }

            // Lưu bản sao PDF lên server kiểm định trước khi in
            if (paper) {
                this.savePrintedPDFToServer(paper.innerHTML);
            }

            setTimeout(() => {
                window.print();
            }, 1000); // Tăng hẳn thời gian lên 1 giây để an toàn
        }
    },

    savePrintedPDFToServer: function(htmlContent) {
        if (!htmlContent) return;
        const lessonTitle = (this.currentLesson && this.currentLesson.title) || "de_thi";
        const sanitizedTitle = removeVietnameseTones(lessonTitle)
            .replace(/[^a-zA-Z0-9\-_]/g, '_')
            .replace(/_+/g, '_');
        const filename = `de_thi_${sanitizedTitle}_${Date.now()}.pdf`;

        fetch(this.getApiUrl('/api/save-printed-pdf'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                html: htmlContent,
                filename: filename
            })
        }).then(res => res.json())
          .then(data => {
              console.log("Đã lưu PDF kiểm định tại server:", data);
          })
          .catch(err => {
              console.error("Không thể lưu PDF kiểm định:", err);
          });
    },

    triggerPrintFromPreview: function() {
        const previewPaper = document.getElementById("print-preview-paper");
        if (previewPaper) {
            this.savePrintedPDFToServer(previewPaper.innerHTML);
        }
        window.print();
    },

    downloadPDFFromPreview: function() {
        const previewPaper = document.getElementById("print-preview-paper");
        if (!previewPaper) return;

        const lessonTitle = (this.currentLesson && this.currentLesson.title) || "de_thi";
        const sanitizedTitle = removeVietnameseTones(lessonTitle)
            .replace(/[^a-zA-Z0-9\-_]/g, '_')
            .replace(/_+/g, '_');
        const filename = `de_thi_${sanitizedTitle}_${Date.now()}.pdf`;

        // Hiển thị trạng thái đang xử lý trên nút bấm
        const btn = document.querySelector('button[onclick="questions.downloadPDFFromPreview()"]');
        let oldHtml = "";
        if (btn) {
            oldHtml = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang tải file...';
            btn.disabled = true;
        }

        fetch(this.getApiUrl('/api/save-printed-pdf'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                html: previewPaper.innerHTML,
                filename: filename
            })
        })
        .then(res => {
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return res.json();
        })
        .then(data => {
            if (data.success && data.path) {
                // Tạo thẻ link ảo để tải xuống
                const downloadUrl = this.getApiUrl(data.path);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                alert("Lỗi khi sinh PDF: " + (data.error || "Không rõ nguyên nhân"));
            }
        })
        .catch(err => {
            console.error("Lỗi tải PDF:", err);
            alert("Lỗi kết nối server: " + err.message);
        })
        .finally(() => {
            if (btn) {
                btn.innerHTML = oldHtml;
                btn.disabled = false;
            }
        });
    },

    closePrintPreview: function() {
        const previewModal = document.getElementById("print-preview-modal");
        if (previewModal) {
            previewModal.classList.add("hidden");
        }
        // Dọn dẹp DOM
        const previewPaper = document.getElementById("print-preview-paper");
        if (previewPaper) previewPaper.innerHTML = "";
        const printPaper = document.getElementById("student-print-paper");
        if (printPaper) printPaper.innerHTML = "";
    },
};

window.questions = questions;

// Đăng ký sự kiện rời tab để đếm số lần xao nhãng trong bài tập hiện tại
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === 'hidden') {
        const lessonScreen = document.getElementById("lesson-detail-panel");
        const practiceTab = document.getElementById("tab-practice");
        const resultBox = document.getElementById("practice-result-box");
        
        // Nếu đang trong chế độ làm bài tập và chưa ra màn hình kết quả
        if (lessonScreen && !lessonScreen.classList.contains("hidden") && 
            practiceTab && !practiceTab.classList.contains("hidden") &&
            resultBox && resultBox.classList.contains("hidden")) {
            
            questions.practiceDistractions += 1;
        }
    }
});
