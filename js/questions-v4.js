// Bộ quản lý sinh câu hỏi Toán lớp 4 ngẫu nhiên chuẩn Kết nối tri thức với cuộc sống
// Tuân thủ 100% quy tắc chống trùng đáp án và LaTeX chuẩn trong AGENTS.md

const questionsL4 = {
    // Hàm phụ trợ sinh số ngẫu nhiên từ min đến max (gồm cả hai biên)
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Hàm trộn mảng các lựa chọn ngẫu nhiên
    shuffle: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    // Tìm ƯCLN để tối giản phân số
    gcd: function(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            let t = b;
            b = a % b;
            a = t;
        }
        return a;
    },

    // Tìm BCNN
    lcm: function(a, b) {
        return (a * b) / this.gcd(a, b);
    },

    // Phương thức sinh câu hỏi chính
    generateQuestion: function(type, level = "co-ban") {
        let questionText = "";
        let options = [];
        let correctIndex = 0;
        let hints = [];
        let solutionHtml = "";
        let tip = "";

        // Tránh trùng chéo đáp án bằng biểu thức tam phân động hoặc kiểm tra điều kiện trực tiếp
        const createOptions = (correctVal, rawDistractors) => {
            const uniqueDistractors = new Set();
            rawDistractors.forEach(d => {
                let val = d;
                if (val === correctVal) {
                    val = val + this.randomInt(2, 5);
                }
                uniqueDistractors.add(val);
            });

            // Nếu vẫn thiếu do trùng nhau
            while (uniqueDistractors.size < 3) {
                let backup = correctVal + this.randomInt(5, 20);
                if (backup !== correctVal) uniqueDistractors.add(backup);
            }

            const dists = Array.from(uniqueDistractors);
            const opts = [correctVal, dists[0], dists[1], dists[2]];
            this.shuffle(opts);
            const idx = opts.indexOf(correctVal);
            return { opts, idx };
        };

        switch(type) {
            // ================= CHƯƠNG 1 =================
            case "l4-on-tap-100k": {
                const variant = this.randomInt(1, 2);
                if (variant === 1) {
                    const chucNghin = this.randomInt(1, 9);
                    const nghin = this.randomInt(0, 9);
                    const tram = this.randomInt(1, 9);
                    const chuc = this.randomInt(0, 9);
                    const donVi = this.randomInt(1, 9);
                    const num = chucNghin * 10000 + nghin * 1000 + tram * 100 + chuc * 10 + donVi;
                    const numFormatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

                    questionText = `Số $${numFormatted}$ được viết thành tổng các hàng nào dưới đây?`;
                    const correctStr = `$${chucNghin * 10000} + ${nghin * 1000} + ${tram * 100} + ${chuc * 10} + ${donVi}$`;
                    
                    const optSet = createOptions(correctStr, [
                        `$${chucNghin * 10000} + ${nghin * 1000} + ${tram * 100} + ${chuc * 100} + ${donVi}$`,
                        `$${chucNghin * 1000} + ${nghin * 100} + ${tram * 10} + ${chuc} + ${donVi}$`,
                        `$${chucNghin * 10000} + ${nghin * 1000} + ${tram * 100} + ${donVi}$`
                    ]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;

                    hints = [
                        `Phân tích số theo cấu tạo hàng: hàng chục nghìn, hàng nghìn, hàng trăm, hàng chục, hàng đơn vị.`,
                        `Ví dụ $21\\,305 = 20\\,000 + 1\\,000 + 300 + 5$.`
                    ];
                    solutionHtml = `Số $${numFormatted}$ gồm có: $${chucNghin}$ chục nghìn, $${nghin}$ nghìn, $${tram}$ trăm, $${chuc}$ chục và $${donVi}$ đơn vị.<br/>Do đó viết thành tổng: $${chucNghin * 10000} + ${nghin * 1000} + ${tram * 100} + ${chuc * 10} + ${donVi}$.`;
                    tip = "Chú ý phân biệt giá trị hàng nghìn và hàng chục nghìn con nhé.";
                } else {
                    const thousands = this.randomInt(10, 99);
                    const hundreds = this.randomInt(1, 9);
                    const units = this.randomInt(10, 99);
                    const num = thousands * 1000 + hundreds * 100 + units;
                    const numStr = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

                    questionText = `Cách đọc nào dưới đây là đúng của số $${numStr}$?`;
                    const correctStr = `${thousands} nghìn ${hundreds} trăm ${units}`;
                    
                    const optSet = createOptions(correctStr, [
                        `${thousands} triệu ${hundreds} trăm ${units}`,
                        `${thousands} nghìn ${hundreds} chục ${units}`,
                        `${thousands} nghìn ${units} trăm ${hundreds}`
                    ]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;

                    hints = [
                        `Đọc phần nghìn trước, sau đó đến phần trăm và phần đơn vị.`,
                        `Số có 5 chữ số có hàng chục nghìn và hàng nghìn gộp chung thành số nghìn.`
                    ];
                    solutionHtml = `Số $${numStr}$ có lớp nghìn chứa số $${thousands}$ và lớp đơn vị chứa $${hundreds}$ trăm và $${units}$ đơn vị. Đọc là: "${correctStr}".`;
                }
                break;
            }

            case "l4-phep-tinh-100k": {
                const a = this.randomInt(1000, 5000) * 10;
                const b = this.randomInt(100, 999) * 10;
                const optType = this.randomInt(1, 2);

                if (optType === 1) {
                    questionText = `Tìm kết quả của phép tính: $${a} + ${b}$.`;
                    const correctVal = a + b;
                    const optSet = createOptions(correctVal, [
                        a + b - 100,
                        a + b + 100,
                        a + b * 2
                    ]);
                    options = optSet.opts.map(o => `$${o}$`);
                    correctIndex = optSet.idx;
                    solutionHtml = `Đặt tính cộng thẳng hàng: $${a} + ${b} = ${correctVal}$.`;
                } else {
                    questionText = `Tìm kết quả của phép tính: $${a} - ${b}$.`;
                    const correctVal = a - b;
                    const optSet = createOptions(correctVal, [
                        a - b - 100,
                        a - b + 100,
                        a - b + 50
                    ]);
                    options = optSet.opts.map(o => `$${o}$`);
                    correctIndex = optSet.idx;
                    solutionHtml = `Đặt tính trừ thẳng hàng: $${a} - ${b} = ${correctVal}$.`;
                }
                hints = [`Hãy thực hiện đặt tính và tính thẳng hàng từ phải sang trái.`, `Nhớ cộng hoặc trừ đúng số có nhớ.`];
                break;
            }

            case "l4-so-chan-le": {
                if (level === "nang-cao" || level === "kho") {
                    // Chọn ngẫu nhiên 4 chữ số khác nhau, đảm bảo có cả chẵn và lẻ
                    let digits = [];
                    while (digits.length < 4) {
                        let r = this.randomInt(0, 9);
                        if (!digits.includes(r)) {
                            digits.push(r);
                        }
                        if (digits.length === 4) {
                            const hasEven = digits.some(d => d % 2 === 0);
                            const hasOdd = digits.some(d => d % 2 !== 0);
                            if (!hasEven || !hasOdd) {
                                digits = [];
                            }
                        }
                    }

                    // Thuật toán sinh hoán vị của 4 chữ số
                    const getPermutations = (arr) => {
                        if (arr.length === 0) return [[]];
                        const result = [];
                        for (let i = 0; i < arr.length; i++) {
                            const current = arr[i];
                            const remaining = arr.slice(0, i).concat(arr.slice(i + 1));
                            const remainingPerms = getPermutations(remaining);
                            for (let perm of remainingPerms) {
                                result.push([current].concat(perm));
                            }
                        }
                        return result;
                    };

                    const perms = getPermutations(digits);
                    const numbers = perms
                        .filter(p => p[0] !== 0) // Hàng nghìn phải khác 0
                        .map(p => p[0] * 1000 + p[1] * 100 + p[2] * 10 + p[3]);

                    const evens = numbers.filter(n => n % 2 === 0).sort((a, b) => b - a);
                    const odds = numbers.filter(n => n % 2 !== 0).sort((a, b) => b - a);

                    const variant = this.randomInt(1, 2);
                    const digitsSorted = [...digits].sort((a, b) => a - b).join("; ");

                    if (variant === 1) {
                        // Số chẵn lớn nhất
                        const correctVal = evens[0];
                        questionText = `Cho các chữ số: $${digitsSorted}$. Số chẵn lớn nhất có $4$ chữ số khác nhau lập được từ các chữ số trên là số nào?`;
                        
                        const optSet = createOptions(correctVal, [
                            evens[1] || correctVal - 2,
                            odds[0] || correctVal - 1, // Bẫy số lẻ lớn nhất
                            evens[2] || correctVal - 4
                        ]);
                        options = optSet.opts.map(o => `$${o}$`);
                        correctIndex = optSet.idx;

                        hints = [
                            `Số chẵn phải có chữ số tận cùng là $0, 2, 4, 6$ hoặc $8$.`,
                            `Để lập số lớn nhất, ta nên xếp các chữ số lớn hơn ở các hàng cao hơn (hàng nghìn, hàng trăm, hàng chục) và chữ số chẵn nhỏ hơn ở hàng đơn vị.`
                        ];
                        solutionHtml = `Để lập số chẵn lớn nhất có $4$ chữ số khác nhau từ các chữ số $${digitsSorted}$:<br/>` +
                            `- Bước 1: Các số chẵn có $4$ chữ số lập được là các số có tận cùng chẵn và chữ số hàng nghìn khác $0$.<br/>` +
                            `- Bước 2: Tìm số chẵn lớn nhất trong số các số đó. Ta được số $${correctVal}$ (số này tận cùng là chẵn và lớn nhất).<br/>` +
                            `Bẫy số lẻ lớn nhất là $${odds[0]}$, tuy nhiên đề yêu cầu số chẵn. Do đó số chẵn lớn nhất là $${correctVal}$.`;
                    } else {
                        // Số lẻ nhỏ nhất
                        const correctVal = odds[odds.length - 1]; // Nhỏ nhất
                        questionText = `Cho các chữ số: $${digitsSorted}$. Số lẻ nhỏ nhất có $4$ chữ số khác nhau lập được từ các chữ số trên là số nào?`;

                        const optSet = createOptions(correctVal, [
                            odds[odds.length - 2] || correctVal + 2,
                            evens[evens.length - 1] || correctVal + 1, // Bẫy số chẵn nhỏ nhất
                            odds[odds.length - 3] || correctVal + 4
                        ]);
                        options = optSet.opts.map(o => `$${o}$`);
                        correctIndex = optSet.idx;

                        hints = [
                            `Số lẻ phải có chữ số tận cùng là $1, 3, 5, 7$ hoặc $9$.`,
                            `Để lập số nhỏ nhất, ta xếp chữ số nhỏ nhất (khác 0) ở hàng nghìn, các chữ số nhỏ tiếp theo ở hàng trăm, hàng chục và chữ số lẻ ở hàng đơn vị.`
                        ];
                        solutionHtml = `Để lập số lẻ nhỏ nhất có $4$ chữ số khác nhau từ các chữ số $${digitsSorted}$:<br/>` +
                            `- Bước 1: Các số lẻ có $4$ chữ số lập được là các số có tận cùng lẻ và chữ số hàng nghìn khác $0$.<br/>` +
                            `- Bước 2: Tìm số lẻ nhỏ nhất trong các số đó. Ta được số $${correctVal}$ (số lẻ có hàng nghìn nhỏ nhất có thể và các chữ số được sắp xếp tối ưu).<br/>` +
                            `Bẫy số chẵn nhỏ nhất là $${evens[evens.length - 1]}$, tuy nhiên đề yêu cầu số lẻ. Do đó số lẻ nhỏ nhất là $${correctVal}$.`;
                    }
                } else {
                    const start = this.randomInt(10, 40) * 2 + 1; // số lẻ
                    const typeVal = this.randomInt(1, 2);
                    if (typeVal === 1) {
                        questionText = `Trong các số sau, số nào là **số chẵn**?`;
                        const correctVal = start + 1;
                        const optSet = createOptions(correctVal, [
                            start,
                            start + 2,
                            start + 4
                        ]);
                        options = optSet.opts.map(o => `$${o}$`);
                        correctIndex = optSet.idx;
                        solutionHtml = `Số chẵn là số có tận cùng là $0; 2; 4; 6; 8$. Trong các số trên, số $${correctVal}$ có chữ số tận cùng là chẵn nên là số chẵn.`;
                    } else {
                        questionText = `Trong các số sau, số nào là **số lẻ**?`;
                        const correctVal = start;
                        const optSet = createOptions(correctVal, [
                            start + 1,
                            start + 3,
                            start + 5
                        ]);
                        options = optSet.opts.map(o => `$${o}$`);
                        correctIndex = optSet.idx;
                        solutionHtml = `Số lẻ là số có tận cùng là $1; 3; 5; 7; 9$. Số $${correctVal}$ tận cùng là số lẻ nên là số lẻ.`;
                    }
                    hints = [`Nhìn vào chữ số tận cùng bên phải của mỗi số để phân biệt chẵn lẻ.`, `Tận cùng là $0, 2, 4, 6, 8$ là số chẵn, còn lại là lẻ.`];
                }
                break;
            }

            case "l4-bieu-thuc-chu": {
                const a = this.randomInt(5, 15);
                const b = this.randomInt(2, 6);
                const c = this.randomInt(1, 4);
                questionText = `Tính giá trị của biểu thức $P = a \\cdot b - c$ khi $a = ${a}$, $b = ${b}$, $c = ${c}$.`;
                const correctVal = a * b - c;
                const optSet = createOptions(correctVal, [
                    a * (b - c),
                    a * b + c,
                    a + b - c
                ]);
                options = optSet.opts.map(o => `$${o}$`);
                correctIndex = optSet.idx;
                hints = [
                    `Thay thế chữ bằng số tương ứng: $a = ${a}$, $b = ${b}$, $c = ${c}$.`,
                    `Thực hiện phép tính nhân trước, phép tính trừ sau.`
                ];
                solutionHtml = `Thay giá trị vào biểu thức ta có:<br/>$P = ${a} \\cdot ${b} - ${c} = ${a * b} - ${c} = ${correctVal}$.`;
                break;
            }

            case "l4-toan-ba-buoc-tinh": {
                const giaGoiKeo = this.randomInt(5, 10) * 1000;
                const soGoiHocSinhA = this.randomInt(2, 4);
                const soGoiHocSinhB = soGoiHocSinhA + this.randomInt(1, 2);
                
                questionText = `Minh mua ${soGoiHocSinhA} gói kẹo, Phúc mua ${soGoiHocSinhB} gói kẹo cùng loại. Mỗi gói kẹo có giá ${giaGoiKeo.toLocaleString('vi-VN')} đồng. Hỏi cả hai bạn mua hết tất cả bao nhiêu tiền kẹo?`;
                
                const tongSoGoi = soGoiHocSinhA + soGoiHocSinhB;
                const correctVal = tongSoGoi * giaGoiKeo;
                
                const optSet = createOptions(correctVal, [
                    soGoiHocSinhA * giaGoiKeo,
                    soGoiHocSinhB * giaGoiKeo,
                    (soGoiHocSinhB - soGoiHocSinhA) * giaGoiKeo
                ]);
                options = optSet.opts.map(o => `${o.toLocaleString('vi-VN')} đồng`);
                correctIndex = optSet.idx;

                hints = [
                    `Tìm tổng số gói kẹo mà cả hai bạn đã mua.`,
                    `Nhân tổng số gói kẹo với giá tiền của một gói để tìm tổng số tiền.`
                ];
                solutionHtml = `<b>Bước 1:</b> Tìm số kẹo hai bạn mua: ${soGoiHocSinhA} + ${soGoiHocSinhB} = ${tongSoGoi} (gói).<br/><b>Bước 2:</b> Số tiền mua kẹo là: ${tongSoGoi} \\cdot ${giaGoiKeo} = ${correctVal} (đồng).`;
                break;
            }

            // ================= CHƯƠNG 2 =================
            case "l4-do-goc": {
                const gocArr = [30, 45, 60, 90, 120, 150];
                const goc = gocArr[this.randomInt(0, gocArr.length - 1)];
                questionText = `Khi dùng thước đo góc để đo góc đỉnh O, cạnh OA và OB, ta thấy vạch chỉ vào số $${goc}$. Số đo của góc đó là bao nhiêu?`;
                const correctStr = `$${goc}^\\circ$`;
                const optSet = createOptions(correctStr, [
                    `$${goc + 10}^\\circ$`,
                    `$${goc - 10}^\\circ$`,
                    `$${180 - goc}^\\circ$`
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = [`Nhìn trực tiếp số đo chỉ trên thước đo góc.`, `Đơn vị đo góc là độ, viết ký hiệu là $^\\circ$.`];
                solutionHtml = `Góc chỉ vào vạch $${goc}$ độ thì số đo góc tương ứng là $${goc}^\\circ$.`;
                break;
            }

            case "l4-phan-loai-goc": {
                const gocArr = [
                    { name: "góc nhọn", min: 10, max: 80, val: 60, compare: "nhỏ hơn góc vuông" },
                    { name: "góc vuông", min: 90, max: 90, val: 90, compare: "bằng góc vuông" },
                    { name: "góc tù", min: 100, max: 170, val: 120, compare: "lớn hơn góc vuông và nhỏ hơn góc bẹt" },
                    { name: "góc bẹt", min: 180, max: 180, val: 180, compare: "bằng hai góc vuông" }
                ];
                const selected = gocArr[this.randomInt(0, gocArr.length - 1)];
                questionText = `Góc có số đo $${selected.val}^\\circ$ là loại góc nào dưới đây?`;
                const correctStr = selected.name.charAt(0).toUpperCase() + selected.name.slice(1);
                
                const optSet = createOptions(correctStr, [
                    "Góc nhọn",
                    "Góc vuông",
                    "Góc tù",
                    "Góc bẹt"
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = [
                    `Góc nhọn nhỏ hơn $90^\\circ$, góc vuông bằng $90^\\circ$, góc tù lớn hơn $90^\\circ$, góc bẹt bằng $180^\\circ$.`,
                    `So sánh số đo $${selected.val}^\\circ$ với $90^\\circ$ và $180^\\circ$.`
                ];
                solutionHtml = `Góc $${selected.val}^\\circ$ là ${selected.name} vì nó ${selected.compare}.`;
                break;
            }

            // ================= CHƯƠNG 3 =================
            case "l4-so-sau-chu-so": {
                const thousands = this.randomInt(100, 999);
                const hundreds = this.randomInt(1, 9);
                const units = this.randomInt(10, 99);
                const num = thousands * 1000 + hundreds * 100 + units;
                const numStr = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

                questionText = `Số gồm $${thousands}$ nghìn, $${hundreds}$ trăm, $${units}$ đơn vị viết là gì?`;
                const correctStr = `$${numStr}$`;
                // Tạo số sai với format spaces giống nhau để tránh trùng sau normalize
                const w1Str = String(thousands * 1000 + hundreds * 10 + units).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                const w2Str = String(thousands * 100 + units * 10 + hundreds).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                const w3Str = String(thousands * 10000 + hundreds * 100 + units).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                const optSet = createOptions(correctStr, [
                    `$${w1Str}$`,
                    `$${w2Str}$`,
                    `$${w3Str}$`
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = [`Ghép lớp nghìn ($${thousands}$ nghìn) với lớp đơn vị ($${hundreds}$ trăm $${units}$ đơn vị).`, `Đảm bảo số viết ra có đủ 6 chữ số.`];
                solutionHtml = `Số gồm $${thousands}$ nghìn, $${hundreds}$ trăm và $${units}$ đơn vị viết là $${numStr}$.`;
                break;
            }

            case "l4-hang-va-lop": {
                const chucTrieu = this.randomInt(1, 9);
                const trieu = this.randomInt(1, 9);
                const tramNghin = this.randomInt(1, 9);
                const chucNghin = this.randomInt(1, 9);
                const nghin = this.randomInt(1, 9);
                const tram = this.randomInt(1, 9);
                const chuc = this.randomInt(1, 9);
                const donVi = this.randomInt(1, 9);
                
                const num = chucTrieu * 10000000 + trieu * 1000000 + tramNghin * 100000 + chucNghin * 10000 + nghin * 1000 + tram * 100 + chuc * 10 + donVi;
                const numStr = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

                const variant = this.randomInt(1, 2);
                if (variant === 1) {
                    questionText = `Trong số $${numStr}$, chữ số $${tramNghin}$ thuộc hàng nào và lớp nào?`;
                    const correctStr = `Hàng trăm nghìn, lớp nghìn`;
                    const optSet = createOptions(correctStr, [
                        `Hàng chục nghìn, lớp nghìn`,
                        `Hàng trăm, lớp đơn vị`,
                        `Hàng trăm nghìn, lớp triệu`
                    ]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = `Chữ số $${tramNghin}$ nằm ở vị trí hàng trăm nghìn, thuộc lớp nghìn.`;
                } else {
                    questionText = `Trong số $${numStr}$, chữ số nào thuộc hàng chục triệu?`;
                    const correctStr = `$${chucTrieu}$`;
                    const optSet = createOptions(correctStr, [
                        `$${trieu}$`,
                        `$${tramNghin}$`,
                        `$${chucNghin}$`
                    ]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = `Số $${numStr}$ có chữ số hàng chục triệu là $${chucTrieu}$ (đứng ở vị trí thứ 8 từ phải sang trái).`;
                }
                hints = [
                    `Các hàng từ phải qua trái: đơn vị, chục, trăm, nghìn, chục nghìn, trăm nghìn, triệu, chục triệu, trăm triệu.`,
                    `Ba hàng đơn vị, chục, trăm thuộc lớp đơn vị. Ba hàng nghìn, chục nghìn, trăm nghìn thuộc lớp nghìn.`
                ];
                break;
            }

            case "l4-lop-trieu": {
                const millions = this.randomInt(1, 9);
                const num = millions * 1000000;
                const numStr = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                questionText = `Viết số tương ứng với chữ: "${millions} triệu".`;
                const correctStr = `$${numStr}$`;
                const optSet = createOptions(correctStr, [
                    `$${millions}\\,000\\,000\\,000$`,
                    `$${millions}\\,000$`,
                    `$${millions}\\,000\\,000\\,000\\,000$`
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;
                hints = [`Một triệu là số có 6 chữ số 0 ở bên phải số triệu.`, `Kiểm tra số chữ số 0.`];
                solutionHtml = `Số "${millions} triệu" viết là $${numStr}$ (gồm chữ số $${millions}$ và 6 chữ số 0 phía sau).`;
                break;
            }

            case "l4-lam-tron-tram-nghin": {
                const val = this.randomInt(10, 89) * 10000 + this.randomInt(0, 9) * 1000;
                const numStr = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
                const baseTramNghin = Math.floor(val / 100000) * 100000;
                const chucNghin = Math.floor((val % 100000) / 10000);
                const correctVal = chucNghin >= 5 ? baseTramNghin + 100000 : baseTramNghin;
                const correctStr = correctVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

                questionText = `Làm tròn số $${numStr}$ đến hàng trăm nghìn ta được số nào?`;
                const optSet = createOptions(`$${correctStr}$`, [
                    `$${baseTramNghin.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}$`,
                    `$${(baseTramNghin + 100000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}$`,
                    `$${(correctVal + 50000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}$`
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = [
                    `Xem chữ số hàng chục nghìn của số $${numStr}$ là bao nhiêu.`,
                    `Nếu lớn hơn hoặc bằng 5 thì làm tròn lên, ngược lại làm tròn xuống.`
                ];
                solutionHtml = `Chữ số hàng chục nghìn của số $${numStr}$ là $${chucNghin}$. Vì $${chucNghin} ${chucNghin >= 5 ? '\\ge 5' : '< 5'}$, ta làm tròn ${chucNghin >= 5 ? 'lên' : 'xuống'} được $${correctStr}$.`;
                break;
            }

            case "l4-so-sanh-nhieu-chu-so": {
                const base = this.randomInt(100, 500) * 1000;
                const diff = this.randomInt(1, 9) * 10;
                const a = base + diff;
                const b = base - diff;
                
                questionText = `Điền dấu so sánh thích hợp vào dấu hỏi chấm: $${a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} \\space ? \\space ${b.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}$.`;
                options = [`$>$`, `$<$`, `$=$`, `$\\ge$`];
                correctIndex = 0;
                hints = [
                    `So sánh hai số từ hàng cao nhất (bên trái) qua hàng thấp hơn.`,
                    `Số $${a}$ lớn hơn số $${b}$ ở hàng trăm.`
                ];
                solutionHtml = `Số $${a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}$ có hàng trăm là $${Math.floor((a%1000)/100)}$ lớn hơn chữ số hàng trăm $${Math.floor((b%1000)/100)}$ của $${b.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}$. Vậy $A > B$.`;
                break;
            }

            case "l4-day-so-tu-nhien": {
                questionText = `Số tự nhiên nào dưới đây đứng liền sau số $999\\,999$ trong dãy số tự nhiên?`;
                const correctStr = `$1\\,000\\,000$`;
                const optSet = createOptions(correctStr, [
                    `$999\\,998$`,
                    `$1\\,000\\,001$`,
                    `$999\\,000$`
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;
                hints = [`Số liền sau của số $n$ trong dãy số tự nhiên được tính bằng $n + 1$.`, `Tính $999\\,999 + 1$.`];
                solutionHtml = `Số đứng liền sau của $999\\,999$ là: $999\\,999 + 1 = 1\\,000\\,000$.`;
                break;
            }

            // ================= CHƯƠNG 4 =================
            case "l4-yen-ta-tan": {
                const tons = this.randomInt(2, 8);
                const correctKg = tons * 1000;
                questionText = `Đổi đơn vị đo khối lượng sau: $${tons}$ tấn = ? kg.`;
                const optSet = createOptions(`$${correctKg}$`, [
                    `$${tons * 100}$`,
                    `$${tons * 10}$`,
                    `$${tons * 10000}$`
                ]);
                options = optSet.opts.map(o => `${o} kg`);
                correctIndex = optSet.idx;
                hints = [`Ta biết $1$ tấn = $1000$ kg.`, `Nhân số tấn với $1000$ để ra kết quả.`];
                solutionHtml = `Vì $1$ tấn = $1000$ kg nên $${tons}$ tấn = $${tons} \\cdot 1000 = ${correctKg}$ kg.`;
                break;
            }

            case "l4-don-vi-dien-tich": {
                const sqM = this.randomInt(3, 9);
                const correctSqDm = sqM * 100;
                questionText = `Đổi đơn vị đo diện tích sau: $${sqM}$ $m^2$ = ? $dm^2$.`;
                const optSet = createOptions(`$${correctSqDm}$`, [
                    `$${sqM * 10}$`,
                    `$${sqM * 1000}$`,
                    `$${sqM * 10000}$`
                ]);
                options = optSet.opts.map(o => `${o} $dm^2$`);
                correctIndex = optSet.idx;
                hints = [`Ta biết $1$ $m^2$ = $100$ $dm^2$.`, `Nhân số $m^2$ với $100$ để quy đổi.`];
                solutionHtml = `Vì $1$ $m^2$ = $100$ $dm^2$ nên $${sqM}$ $m^2$ = $${sqM} \\cdot 100 = ${correctSqDm}$ $dm^2$.`;
                break;
            }

            case "l4-giay-the-ki": {
                const minutes = this.randomInt(2, 5);
                const correctSec = minutes * 60;
                questionText = `Đổi đơn vị đo thời gian sau: $${minutes}$ phút = ? giây.`;
                const optSet = createOptions(`$${correctSec}$`, [
                    `$${minutes * 100}$`,
                    `$${minutes * 60 + 10}$`,
                    `$${minutes * 60 - 10}$`
                ]);
                options = optSet.opts.map(o => `${o} giây`);
                correctIndex = optSet.idx;
                hints = [`Ta biết $1$ phút = $60$ giây.`, `Nhân số phút với $60$.`];
                solutionHtml = `Vì $1$ phút = $60$ giây nên $${minutes}$ phút = $${minutes} \\cdot 60 = ${correctSec}$ giây.`;
                break;
            }

            // ================= CHƯƠNG 5 =================
            case "l4-cong-nhieu-chu-so": {
                const a = this.randomInt(10000, 40000);
                const b = this.randomInt(10000, 40000);
                const correctVal = a + b;
                questionText = `Tìm tổng của: $${a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} + ${b.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}$.`;
                const optSet = createOptions(correctVal, [
                    correctVal - 1000,
                    correctVal + 100,
                    correctVal - 10
                ]);
                options = optSet.opts.map(o => `$${o.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}$`);
                correctIndex = optSet.idx;
                hints = [`Đặt tính cộng thẳng các hàng tương ứng.`, `Cộng từ phải qua trái, lưu ý phần số nhớ.`];
                solutionHtml = `Kết quả đặt tính cộng là: $${correctVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}$.`;
                break;
            }

            case "l4-tru-nhieu-chu-so": {
                const a = this.randomInt(50000, 90000);
                const b = this.randomInt(10000, 40000);
                const correctVal = a - b;
                questionText = `Tìm hiệu của: $${a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} - ${b.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}$.`;
                const optSet = createOptions(correctVal, [
                    correctVal + 1000,
                    correctVal - 100,
                    correctVal + 10
                ]);
                options = optSet.opts.map(o => `$${o.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}$`);
                correctIndex = optSet.idx;
                hints = [`Đặt tính trừ thẳng các cột.`, `Trừ từ phải qua trái.`];
                solutionHtml = `Kết quả đặt tính trừ là: $${correctVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}$.`;
                break;
            }

            case "l4-tinh-chat-cong": {
                const a = this.randomInt(11, 49) * 10 + 5;
                const b = this.randomInt(100, 300);
                const c = this.randomInt(11, 49) * 10 + 5;
                const correctVal = a + b + c;
                questionText = `Tính nhanh tổng biểu thức sau: $${a} + ${b} + ${c}$.`;
                const optSet = createOptions(correctVal, [
                    correctVal - 100,
                    correctVal + 100,
                    correctVal * 2
                ]);
                options = optSet.opts.map(o => `$${o}$`);
                correctIndex = optSet.idx;
                hints = [`Gộp các số hạng có tổng tròn chục/tròn trăm lại trước.`, `Tính $${a} + ${c}$ trước.`];
                solutionHtml = `Áp dụng tính chất giao hoán và kết hợp:<br/>$${a} + ${b} + ${c} = (${a} + ${c}) + ${b} = ${a + c} + ${b} = ${correctVal}$.`;
                break;
            }

            case "l4-tong-hieu": {
                const hieu = this.randomInt(4, 15) * 2;
                const be = this.randomInt(10, 40);
                const lon = be + hieu;
                const tong = lon + be;
                
                const variant = this.randomInt(1, 2);
                if (variant === 1) {
                    questionText = `Tìm hai số biết tổng của chúng là $${tong}$ và hiệu của chúng là $${hieu}$.`;
                    const correctStr = `Số lớn: $${lon}$, Số bé: $${be}$`;
                    const optSet = createOptions(correctStr, [
                        `Số lớn: $${lon + 2}$, Số bé: $${be - 2}$`,
                        `Số lớn: $${lon - 2}$, Số bé: $${be + 2}$`,
                        `Số lớn: $${lon + 4}$, Số bé: $${be - 4}$`
                    ]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                } else {
                    questionText = `Phúc và Minh có tất cả $${tong}$ viên bi. Phúc có nhiều hơn Minh $${hieu}$ viên bi. Hỏi Phúc có bao nhiêu viên bi?`;
                    const correctVal = lon;
                    const optSet = createOptions(correctVal, [
                        be,
                        tong,
                        lon + 2
                    ]);
                    options = optSet.opts.map(o => `${o} viên bi`);
                    correctIndex = optSet.idx;
                }
                hints = [
                    `Sử dụng công thức tổng - hiệu để giải.`,
                    `Số lớn = (Tổng + Hiệu) : 2. Số bé = (Tổng - Hiệu) : 2.`
                ];
                solutionHtml = `Số lớn (Phúc) là: ($${tong} + ${hieu}$) : 2 = $${lon}$ (viên bi).<br/>Số bé (Minh) là: $${lon} - ${hieu} = ${be}$ (viên bi).`;
                break;
            }

            // ================= CHƯƠNG 6 =================
            case "l4-duong-vuong-goc": {
                questionText = `Hai đường thẳng vuông góc với nhau tạo thành mấy góc vuông?`;
                options = ["4 góc vuông", "2 góc vuông", "1 góc vuông", "3 góc vuông"];
                correctIndex = 0;
                hints = [`Hãy tưởng tượng hai đường thẳng cắt nhau tạo thành một hình chữ thập.`, `Mỗi góc tạo bởi 2 tia vuông góc là 1 góc vuông.`];
                solutionHtml = `Hai đường thẳng vuông góc tạo thành 4 góc vuông xung quanh giao điểm.`;
                break;
            }

            case "l4-duong-song-song": {
                questionText = `Phát biểu nào sau đây là **đúng nhất** về hai đường thẳng song song?`;
                const correctStr = "Hai đường thẳng song song là hai đường thẳng không bao giờ cắt nhau.";
                const optSet = createOptions(correctStr, [
                    "Hai đường thẳng song song là hai đường thẳng cắt nhau tạo góc vuông.",
                    "Hai đường thẳng song song là hai đường thẳng chéo nhau.",
                    "Hai đường thẳng song song là hai đường thẳng trùng nhau hoàn toàn."
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;
                hints = [`Hãy liên tưởng đến hai đường ray xe lửa.`, `Chúng cùng nằm trên mặt phẳng và có khoảng cách không đổi.`];
                solutionHtml = `Theo định nghĩa, hai đường thẳng song song thì không cắt nhau và không có điểm chung.`;
                break;
            }

            case "l4-binh-hanh-thoi": {
                const variant = this.randomInt(1, 2);
                if (variant === 1) {
                    questionText = `Hình nào dưới đây có các cặp cạnh đối song song và bằng nhau, đồng thời có 4 cạnh bằng nhau?`;
                    options = ["Hình thoi", "Hình bình hành", "Hình thang", "Hình tam giác"];
                    correctIndex = 0;
                } else {
                    questionText = `Hình nào dưới đây có các cặp cạnh đối song song và bằng nhau (không bắt buộc 4 cạnh bằng nhau)?`;
                    options = ["Hình bình hành", "Hình thoi", "Hình thang cân", "Hình tứ giác"];
                    correctIndex = 0;
                }
                hints = [`Hãy đọc kỹ đặc tính của các hình.`, `Hình thoi là trường hợp đặc biệt của hình bình hành khi có 4 cạnh bằng nhau.`];
                solutionHtml = `Hình thoi có 4 cạnh bằng nhau và các cạnh đối song song. Hình bình hành chỉ yêu cầu các cạnh đối song song và bằng nhau.`;
                break;
            }

            // ================= CHƯƠNG 8 =================
            case "l4-nhan-mot-chu-so": {
                const a = this.randomInt(1200, 3500);
                const b = this.randomInt(3, 9);
                const correctVal = a * b;
                questionText = `Tính kết quả của: $${a} \\cdot ${b}$.`;
                const optSet = createOptions(correctVal, [
                    correctVal - 10,
                    correctVal + 10,
                    correctVal + 2
                ]);
                options = optSet.opts.map(o => `$${o}$`);
                correctIndex = optSet.idx;
                hints = [`Nhân lần lượt từ phát sang trái.`, `Tính $${a} \\cdot ${b}$.`];
                solutionHtml = `Đặt tính nhân: $${a} \\cdot ${b} = ${correctVal}$.`;
                break;
            }

            case "l4-chia-mot-chu-so": {
                const divisor = this.randomInt(3, 9);
                const quotient = this.randomInt(120, 450);
                const dividend = quotient * divisor;
                questionText = `Tính kết quả của phép chia: $${dividend} : ${divisor}$.`;
                const optSet = createOptions(quotient, [
                    quotient - 1,
                    quotient + 1,
                    quotient + 10
                ]);
                options = optSet.opts.map(o => `$${o}$`);
                correctIndex = optSet.idx;
                hints = [`Thực hiện chia từ trái sang phải.`, `Ước lượng thương cho từng lượt chia.`];
                solutionHtml = `Thực hiện chia: $${dividend} : ${divisor} = ${quotient}$.`;
                break;
            }

            case "l4-nhan-chia-10-100": {
                const a = this.randomInt(12, 99) * 10;
                const variant = this.randomInt(1, 2);
                if (variant === 1) {
                    questionText = `Tính nhẩm: $${a} \\cdot 100$.`;
                    const correctVal = a * 100;
                    const optSet = createOptions(correctVal, [
                        a * 10,
                        a * 1000,
                        a + 100
                    ]);
                    options = optSet.opts.map(o => `$${o}$`);
                    correctIndex = optSet.idx;
                    solutionHtml = `Khi nhân số tự nhiên với $100$, ta viết thêm hai chữ số $0$ vào bên phải số đó: $${a} \\cdot 100 = ${correctVal}$.`;
                } else {
                    const dividend = a * 10;
                    questionText = `Tính nhẩm: $${dividend} : 10$.`;
                    const correctVal = dividend / 10;
                    const optSet = createOptions(correctVal, [
                        dividend,
                        dividend * 10,
                        dividend - 10
                    ]);
                    options = optSet.opts.map(o => `$${o}$`);
                    correctIndex = optSet.idx;
                    solutionHtml = `Khi chia một số tròn chục cho $10$, ta bỏ đi một chữ số $0$ ở bên phải số đó: $${dividend} : 10 = ${correctVal}$.`;
                }
                hints = [`Quy tắc thêm hoặc bớt các chữ số 0 ở bên phải số tự nhiên khi nhân/chia với 10, 100.`];
                break;
            }

            case "l4-trung-binh-cong": {
                const a = this.randomInt(10, 30);
                const b = this.randomInt(30, 50);
                const c = this.randomInt(50, 70);
                const sum = a + b + c;
                const rem = sum % 3;
                const adjA = rem === 0 ? a : (rem === 1 ? a - 1 : a + 1);
                const correctVal = (adjA + b + c) / 3;

                questionText = `Tìm số trung bình cộng của ba số: $${adjA}$, $${b}$ và $${c}$.`;
                const optSet = createOptions(correctVal, [
                    correctVal - 2,
                    correctVal + 2,
                    adjA + b + c
                ]);
                options = optSet.opts.map(o => `$${o}$`);
                correctIndex = optSet.idx;

                hints = [
                    `Tính tổng của ba số trước: $S = ${adjA} + ${b} + ${c}$.`,
                    `Chia tổng đó cho số lượng các số (ở đây là 3).`
                ];
                solutionHtml = `Tổng của ba số là: $${adjA} + ${b} + ${c} = ${adjA + b + c}$.<br/>Trung bình cộng của ba số là: $${adjA + b + c} : 3 = ${correctVal}$.`;
                break;
            }

            case "l4-rut-ve-don-vi": {
                const units = this.randomInt(4, 8);
                const valueOfOne = this.randomInt(3, 7) * 1000;
                const totalValue = units * valueOfOne;
                const targetUnits = units + this.randomInt(2, 4);
                const correctVal = targetUnits * valueOfOne;

                questionText = `Có $${units}$ thùng chứa được tất cả $${totalValue.toLocaleString('vi-VN')}$ lít dầu. Hỏi $${targetUnits}$ thùng như thế chứa được bao nhiêu lít dầu?`;
                const optSet = createOptions(correctVal, [
                    totalValue,
                    correctVal - valueOfOne,
                    correctVal + valueOfOne
                ]);
                options = optSet.opts.map(o => `${o.toLocaleString('vi-VN')} lít`);
                correctIndex = optSet.idx;

                hints = [
                    `Tìm số lít dầu chứa trong 1 thùng (rút về đơn vị bằng phép chia).`,
                    `Nhân số lít dầu của 1 thùng với số thùng mục tiêu là $${targetUnits}$.`
                ];
                solutionHtml = `Số lít dầu trong 1 thùng là: $${totalValue} : ${units} = ${valueOfOne}$ (lít).<br/>Số lít dầu trong $${targetUnits}$ thùng là: $${valueOfOne} \\cdot ${targetUnits} = ${correctVal}$ (lít).`;
                break;
            }

            // ================= CHƯƠNG 10 =================
            case "l4-khai-niem-phan-so": {
                const lay = this.randomInt(3, 5);
                const tong = lay + this.randomInt(2, 4);
                questionText = `Một hình tròn được chia làm $${tong}$ phần bằng nhau. Người ta đã tô màu $${lay}$ phần. Phân số chỉ phần đã tô màu là phân số nào?`;
                const correctStr = `$\\frac{${lay}}{${tong}}$`;
                const optSet = createOptions(correctStr, [
                    `$\\frac{${tong}}{${lay}}$`,
                    `$\\frac{${tong - lay}}{${tong}}$`,
                    `$\\frac{${lay}}{${tong + 1}}$`
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;
                hints = [`Tử số chỉ số phần được lấy ra (tô màu).`, `Mẫu số chỉ tổng số phần bằng nhau được chia ra.`];
                solutionHtml = `Số phần tô màu là $${lay}$ (tử số) trên tổng số phần bằng nhau là $${tong}$ (mẫu số). Phân số viết là $\\frac{${lay}}{${tong}}$.`;
                break;
            }

            case "l4-phan-so-chia-so-tu-nhien": {
                const a = this.randomInt(2, 7);
                const b = this.randomInt(3, 9);
                questionText = `Viết thương của phép chia $${a} : ${b}$ dưới dạng phân số.`;
                const correctStr = `$\\frac{${a}}{${b}}$`;
                const optSet = createOptions(correctStr, [
                    `$\\frac{${b}}{${a}}$`,
                    `$${a} \\cdot ${b}$`,
                    `$\\frac{${a + 1}}{${b}}$`
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;
                hints = [`Số bị chia đóng vai trò là tử số.`, `Số chia đóng vai trò là mẫu số.`];
                solutionHtml = `Thương của phép chia $${a} : ${b}$ được viết là $\\frac{${a}}{${b}}$.`;
                break;
            }

            case "l4-rut-gon-phan-so": {
                const common = this.randomInt(3, 8);
                const tuTiemNang = this.randomInt(2, 5);
                let mauTiemNang = tuTiemNang + this.randomInt(1, 4);
                while(this.gcd(tuTiemNang, mauTiemNang) > 1) {
                    mauTiemNang++;
                }
                const tu = tuTiemNang * common;
                const mau = mauTiemNang * common;

                questionText = `Rút gọn phân số $\\frac{${tu}}{${mau}}$ về phân số tối giản.`;
                const correctStr = `$\\frac{${tuTiemNang}}{${mauTiemNang}}$`;
                
                const optSet = createOptions(correctStr, [
                    `$\\frac{${tuTiemNang * 2}}{${mauTiemNang * 2}}$`,
                    `$\\frac{${tu - 1}}{${mau - 1}}$`,
                    `$\\frac{${tuTiemNang}}{${mauTiemNang + 1}}$`
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = [
                    `Tìm xem cả tử số và mẫu số cùng chia hết cho số tự nhiên nào lớn hơn 1.`,
                    `Cả tử và mẫu đều chia hết cho $${common}$.`
                ];
                solutionHtml = `Ta chia cả tử số và mẫu số cho $${common}$:<br/>$\\frac{${tu} : ${common}}{${mau} : ${common}} = \\frac{${tuTiemNang}}{${mauTiemNang}}$.`;
                break;
            }

            case "l4-so-sanh-phan-so": {
                const base = this.randomInt(3, 7);
                const tu1 = base;
                const tu2 = base + 2;
                const mau = base + 3;
                questionText = `So sánh hai phân số: $\\frac{${tu1}}{${mau}}$ và $\\frac{${tu2}}{${mau}}$.`;
                options = [
                    `$\\frac{${tu1}}{${mau}} < \\frac{${tu2}}{${mau}}$`,
                    `$\\frac{${tu1}}{${mau}} > \\frac{${tu2}}{${mau}}$`,
                    `$\\frac{${tu1}}{${mau}} = \\frac{${tu2}}{${mau}}$`,
                    `Không so sánh được`
                ];
                correctIndex = 0;
                hints = [`Hai phân số này có cùng mẫu số là $${mau}$.`, `Trong hai phân số cùng mẫu số, phân số nào có tử số lớn hơn thì lớn hơn.`];
                solutionHtml = `Vì hai phân số có cùng mẫu số là $${mau}$, và tử số $${tu1} < ${tu2}$, nên ta có $\\frac{${tu1}}{${mau}} < \\frac{${tu2}}{${mau}}$.`;
                break;
            }

            // ================= CHƯƠNG 11 =================
            case "l4-cong-phan-so": {
                const mau = this.randomInt(4, 9);
                const tu1 = this.randomInt(1, 3);
                const tu2 = this.randomInt(1, 2);
                questionText = `Tính tổng phân số: $\\frac{${tu1}}{${mau}} + \\frac{${tu2}}{${mau}}$.`;
                const correctTu = tu1 + tu2;
                const ucln = this.gcd(correctTu, mau);
                const correctStr = ucln > 1 ? `$\\frac{${correctTu / ucln}}{${mau / ucln}}$` : `$\\frac{${correctTu}}{${mau}}$`;

                const optSet = createOptions(correctStr, [
                    `$\\frac{${correctTu + 1}}{${mau}}$`,
                    `$\\frac{${correctTu}}{${mau * 2}}$`,
                    `$\\frac{${Math.abs(tu1 - tu2)}}{${mau}}$`
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = [`Cộng tử số với tử số và giữ nguyên mẫu số.`, `Rút gọn kết quả nếu chưa tối giản.`];
                solutionHtml = `$\\frac{${tu1}}{${mau}} + \\frac{${tu2}}{${mau}} = \\frac{${tu1} + ${tu2}}{${mau}} = \\frac{${correctTu}}{${mau}}${ucln > 1 ? ' = \\frac{' + (correctTu/ucln) + '}{' + (mau/ucln) + '}' : ''}$.`;
                break;
            }

            case "l4-tru-phan-so": {
                const mau = this.randomInt(5, 9);
                const tu1 = this.randomInt(3, 5);
                const tu2 = this.randomInt(1, 2);
                questionText = `Tính hiệu phân số: $\\frac{${tu1}}{${mau}} - \\frac{${tu2}}{${mau}}$.`;
                const correctTu = tu1 - tu2;
                const ucln = this.gcd(correctTu, mau);
                const correctStr = ucln > 1 ? `$\\frac{${correctTu / ucln}}{${mau / ucln}}$` : `$\\frac{${correctTu}}{${mau}}$`;

                const optSet = createOptions(correctStr, [
                    `$\\frac{${correctTu + 1}}{${mau}}$`,
                    `$\\frac{${correctTu}}{${mau * 2}}$`,
                    `$\\frac{${tu1 + tu2}}{${mau}}$`
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = [`Trừ tử số của phân số thứ nhất cho tử số của phân số thứ hai, giữ nguyên mẫu.`, `Rút gọn phân số kết quả.`];
                solutionHtml = `$\\frac{${tu1}}{${mau}} - \\frac{${tu2}}{${mau}} = \\frac{${tu1} - ${tu2}}{${mau}} = \\frac{${correctTu}}{${mau}}${ucln > 1 ? ' = \\frac{' + (correctTu/ucln) + '}{' + (mau/ucln) + '}' : ''}$.`;
                break;
            }

            // ================= CHƯƠNG 12 =================
            case "l4-nhan-phan-so": {
                const tu1 = this.randomInt(1, 3);
                const mau1 = this.randomInt(4, 5);
                const tu2 = this.randomInt(1, 3);
                const mau2 = this.randomInt(6, 7);

                questionText = `Tính kết quả phép nhân: $\\frac{${tu1}}{${mau1}} \\cdot \\frac{${tu2}}{${mau2}}$.`;
                const ansTu = tu1 * tu2;
                const ansMau = mau1 * mau2;
                const ucln = this.gcd(ansTu, ansMau);
                const correctStr = `$\\frac{${ansTu / ucln}}{${ansMau / ucln}}$`;

                const optSet = createOptions(correctStr, [
                    `$\\frac{${tu1 + tu2}}{${mau1 + mau2}}$`,
                    `$\\frac{${tu1 * mau2}}{${mau1 * tu2}}$`,
                    `$\\frac{${ansTu}}{${ansMau + 2}}$`
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = [`Lấy tử số nhân tử số, mẫu số nhân mẫu số.`, `Rút gọn phân số kết quả về tối giản.`];
                solutionHtml = `$\\frac{${tu1}}{${mau1}} \\cdot \\frac{${tu2}}{${mau2}} = \\frac{${tu1} \\cdot ${tu2}}{${mau1} \\cdot ${mau2}} = \\frac{${ansTu}}{${ansMau}}${ucln > 1 ? ' = \\frac{' + (ansTu/ucln) + '}{' + (ansMau/ucln) + '}' : ''}$.`;
                break;
            }

            case "l4-tim-phan-so-cua-so": {
                const mau = this.randomInt(3, 6);
                const correctVal = this.randomInt(4, 9);
                const total = correctVal * mau;
                const tu = this.randomInt(1, mau - 1);
                
                questionText = `Tìm $\\frac{${tu}}{${mau}}$ của số $${total}$.`;
                const ans = tu * correctVal;
                
                const optSet = createOptions(ans, [
                    total / mau,
                    total + tu,
                    total * tu
                ]);
                options = optSet.opts.map(o => `$${o}$`);
                correctIndex = optSet.idx;

                hints = [
                    `Muốn tìm phân số của một số, ta lấy số đó nhân với phân số.`,
                    `Thực hiện phép tính: $${total} \\cdot \\frac{${tu}}{${mau}}$ (hoặc lấy $${total} : ${mau}$ trước rồi nhân với $${tu}$).`
                ];
                solutionHtml = `Giá trị cần tìm là:<br/>$${total} \\cdot \\frac{${tu}}{${mau}} = (${total} : ${mau}) \\cdot ${tu} = ${correctVal} \\cdot ${tu} = ${ans}$.`;
                break;
            }

            default: {
                // Thay vì câu hỏi rác, ta sinh ngẫu nhiên một bài toán cộng/trừ/nhân/chia số tự nhiên chất lượng cao
                const opt = this.randomInt(1, 4);
                if (opt === 1) { // Phép cộng
                    const a = this.randomInt(1000, 9999);
                    const b = this.randomInt(1000, 9999);
                    const correctVal = a + b;
                    questionText = `Tính giá trị của biểu thức: $${a.toLocaleString('vi-VN')} + ${b.toLocaleString('vi-VN')}$`;
                    const optSet = createOptions(correctVal, [a + b + 100, a + b - 100, a + b + 10]);
                    options = optSet.opts.map(o => `$${o.toLocaleString('vi-VN')}$`);
                    correctIndex = optSet.idx;
                    hints = ["Đặt tính rồi tính, thực hiện cộng các hàng từ phải sang trái."];
                    solutionHtml = `Ta có: $${a.toLocaleString('vi-VN')} + ${b.toLocaleString('vi-VN')} = ${correctVal.toLocaleString('vi-VN')}$.`;
                } else if (opt === 2) { // Phép trừ
                    const a = this.randomInt(5000, 9999);
                    const b = this.randomInt(1000, a - 1);
                    const correctVal = a - b;
                    questionText = `Tính giá trị của biểu thức: $${a.toLocaleString('vi-VN')} - ${b.toLocaleString('vi-VN')}$`;
                    const optSet = createOptions(correctVal, [a - b + 100, a - b - 100, a - b + 10]);
                    options = optSet.opts.map(o => `$${o.toLocaleString('vi-VN')}$`);
                    correctIndex = optSet.idx;
                    hints = ["Đặt tính rồi tính, thực hiện trừ các hàng từ phải sang trái."];
                    solutionHtml = `Ta có: $${a.toLocaleString('vi-VN')} - ${b.toLocaleString('vi-VN')} = ${correctVal.toLocaleString('vi-VN')}$.`;
                } else if (opt === 3) { // Phép nhân
                    const a = this.randomInt(120, 899);
                    const b = this.randomInt(2, 9);
                    const correctVal = a * b;
                    questionText = `Tính giá trị của biểu thức: $${a.toLocaleString('vi-VN')} \\times ${b}$`;
                    const optSet = createOptions(correctVal, [a * b + 10, a * b - 10, a * b + 5]);
                    options = optSet.opts.map(o => `$${o.toLocaleString('vi-VN')}$`);
                    correctIndex = optSet.idx;
                    hints = ["Thực hiện nhân thừa số thứ hai với từng chữ số của thừa số thứ nhất từ phải sang trái."];
                    solutionHtml = `Ta có: $${a.toLocaleString('vi-VN')} \\times ${b} = ${correctVal.toLocaleString('vi-VN')}$.`;
                } else { // Phép chia
                    const b = this.randomInt(2, 9);
                    const correctVal = this.randomInt(120, 999);
                    const a = correctVal * b;
                    questionText = `Tính giá trị của biểu thức: $${a.toLocaleString('vi-VN')} : ${b}$`;
                    const optSet = createOptions(correctVal, [correctVal + 1, correctVal - 1, correctVal + 10]);
                    options = optSet.opts.map(o => `$${o.toLocaleString('vi-VN')}$`);
                    correctIndex = optSet.idx;
                    hints = ["Thực hiện phép chia số có nhiều chữ số cho số có một chữ số từ trái sang phải."];
                    solutionHtml = `Ta có: $${a.toLocaleString('vi-VN')} : ${b} = ${correctVal.toLocaleString('vi-VN')}$.`;
                }
                break;
            }
        }

        return {
            questionText: questionText,
            options: options,
            correctIndex: correctIndex,
            hints: hints,
            solutionHtml: solutionHtml,
            tip: tip || "Chúc con làm bài tốt và đạt điểm tối đa!"
        };
    }
};

if (typeof window !== 'undefined') {
    window.questionsL4 = questionsL4;
}
if (typeof module !== 'undefined') {
    module.exports = questionsL4;
}
