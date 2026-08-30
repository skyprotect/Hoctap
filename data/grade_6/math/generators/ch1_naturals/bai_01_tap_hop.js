/**
 * MICRO-GENERATOR: BÀI 1 — TẬP HỢP VÀ THỨ TỰ TRONG TẬP HỢP
 */
(function(root) {
    'use strict';
    const Bai01TapHop = {
        generate(type, level, ctx) {
            const self = ctx || this;
            let questionText = "";
            let options = [];
            let correctIndex = 0;
            let hints = [];
            let solutionHtml = "";
            let tip = "";

            switch (type) {
            case "tap-hop-d1": {
                const variant = self.randomInt(1, 3);
                if (variant === 1) {
                    const a = self.randomInt(1, 6);
                    const b = a + self.randomInt(3, 4);
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
                    const start = self.randomInt(1, 5) * 2 + 1; // số lẻ đầu
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
                    const word = words[self.randomInt(0, words.length - 1)];
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
                    self.shuffle(options);
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
                const variant = self.randomInt(1, 3);
                if (variant === 1) {
                    const elements = [2, 4, 6, 8];
                    const nonElements = [1, 3, 5, 7];
                    const el = elements[self.randomInt(0, 3)];
                    const nonEl = nonElements[self.randomInt(0, 3)];
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
                    const a = self.randomInt(3, 7);
                    questionText = `Cho tập hợp $P = \\{x \\in \\mathbb{N}^* \\mid x < ${a}\\}$. Phát biểu nào sau đây là **sai**?`;
                    const correctStr = `$0 \\in P$`;
                    options = [
                        correctStr,
                        `$1 \\in P$`,
                        `$${a - 1} \\in P$`,
                        `$${a} \\notin P$`
                    ];
                    self.shuffle(options);
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
                const variant = self.randomInt(1, 3);
                if (variant === 1) {
                    const a = self.randomInt(10, 30);
                    const b = a + self.randomInt(50, 100);
                    questionText = `Tính số phần tử của tập hợp $C = \\{x \\in \\mathbb{N} \\mid ${a} \\le x \\le ${b}\\}$.`;
                    const count = b - a + 1;
                    options = [`$${count}$`, `$${count - 1}$`, `$${count + 1}$`, `$${b - a - 1}$`];
                    hints = [
                        `Tập hợp $C$ gồm các số tự nhiên liên tiếp từ $${a}$ đến $${b}$.`,
                        `Công thức tính số phần tử: $\\text{Số cuối} - \\text{Số đầu} + 1$.`
                    ];
                    solutionHtml = `Số phần tử của tập hợp $C$ là: $${b} - ${a} + 1 = ${count}$ phần tử.`;
                } else if (variant === 2) {
                    const a = self.randomInt(5, 15) * 2;
                    const count = self.randomInt(10, 20);
                    const b = a + (count - 1) * 2;
                    questionText = `Tính số phần tử của tập hợp $D = \\{x \\in \\mathbb{N} \\mid x \\text{ là số chẵn và } ${a} \\le x \\le ${b}\\}$.`;
                    options = [`$${count}$`, `$${count - 1}$`, `$${count + 1}$`, `$${b - a + 1}$`];
                    hints = [
                        `Đây là tập hợp các số tự nhiên chẵn cách đều nhau $2$ đơn vị từ $${a}$ đến $${b}$.`,
                        `Công thức tính số phần tử của dãy cách đều: $(\\text{Số cuối} - \\text{Số đầu}) : \\text{Khoảng cách} + 1$.`
                    ];
                    solutionHtml = `Tập hợp $D = \\{${a}; ${a+2}; ...; ${b}\\}$. Số phần tử là: $(${b} - ${a}) : 2 + 1 = ${count}$ phần tử.`;
                } else {
                    const a = self.randomInt(5, 20);
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
                const variant = self.randomInt(1, 3);
                if (variant === 1) {
                    const hsToan = self.randomInt(15, 25);
                    const hsVan = self.randomInt(12, 20);
                    const hsCaHai = self.randomInt(5, 10);
                    const result = hsToan + hsVan - hsCaHai;
                    questionText = `Trong một lớp học, biểu đồ Ven minh họa tập hợp học sinh giỏi Toán ký hiệu là $T$ ($${hsToan}$ bạn), giỏi Văn ký hiệu là $V$ ($${hsVan}$ bạn). Số học sinh giỏi cả hai môn (phần giao nhau của hai hình tròn) là $${hsCaHai}$ bạn. Hỏi có bao nhiêu học sinh giỏi ít nhất một trong hai môn?`;
                    options = [`$${result}$`, `$${hsToan + hsVan}$`, `$${result - hsCaHai}$`, `$${hsToan - hsCaHai}$`];
                    hints = [
                        `Tổng số học sinh giỏi ít nhất một môn bằng số bạn giỏi Toán cộng số bạn giỏi Văn rồi trừ đi số bạn bị tính lặp 2 lần (phần giao nhau).`,
                        `Công thức: $n(T \\cup V) = n(T) + n(V) - n(T \\cap V)$.`
                    ];
                    solutionHtml = `Số bạn chỉ giỏi Toán là: $${hsToan} - ${hsCaHai} = ${hsToan - hsCaHai}$. Số bạn chỉ giỏi Văn là: $${hsVan} - ${hsCaHai} = ${hsVan - hsCaHai}$. Tổng số bạn giỏi ít nhất một môn là: $${hsToan - hsCaHai} + ${hsVan - hsCaHai} + ${hsCaHai} = ${result}$ bạn.`;
                } else if (variant === 2) {
                    const hsToan = self.randomInt(15, 25);
                    const hsVan = self.randomInt(12, 20);
                    const hsCaHai = self.randomInt(5, 10);
                    questionText = `Lớp 6A có biểu đồ Ven biểu diễn học sinh tham gia câu lạc bộ. Vòng tròn $T$ biểu diễn học sinh tham gia CLB Tin học ($${hsToan}$ bạn), vòng tròn $A$ biểu diễn học sinh tham gia CLB Âm nhạc ($${hsVan}$ bạn). Số học sinh tham gia cả hai CLB là $${hsCaHai}$ bạn. Hỏi có bao nhiêu học sinh **chỉ** tham gia CLB Tin học?`;
                    const result = hsToan - hsCaHai;
                    options = [`$${result}$`, `$${hsToan}$`, `$${hsToan + hsCaHai}$`, `$${hsToan - hsVan}$`];
                    hints = [
                        `Tổng số học sinh trong vòng CLB Tin học gồm những học sinh chỉ tham gia Tin học và những học sinh tham gia cả hai CLB.`,
                        `Lấy tổng số học sinh CLB Tin học trừ đi số học sinh tham gia cả hai CLB.`
                    ];
                    solutionHtml = `Số học sinh chỉ tham gia CLB Tin học là: $${hsToan} - ${hsCaHai} = ${result}$ học sinh.`;
                } else {
                    const num1 = self.randomInt(2, 4);
                    const num2 = self.randomInt(5, 7);
                    const num3 = self.randomInt(8, 9);
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
            case "tap-hop": {
                if (level === "co-ban") {
                    const a = self.randomInt(1, 6);
                    const b = a + self.randomInt(3, 4);
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
                    const a = self.randomInt(5, 12);
                    const b = a + self.randomInt(10, 15);
                    const isEven = self.randomInt(0, 1) === 0;
                    
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
            case "tap-hop-thu-tu": {
                if (level === "co-ban") {
                    const a = self.randomInt(100, 200);
                    const b = a + self.randomInt(2, 5);
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
                    const a = self.randomInt(15, 25);
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
                    const sum = self.randomInt(21, 25);
                    const lastDigit = 9;
                    const middleDigit = 9;
                    const firstDigit = sum - 18;
                    const num = firstDigit * 100 + middleDigit * 10 + lastDigit;
                    questionText = `Tìm số tự nhiên nhỏ nhất có tổng các chữ số bằng $${sum}$.`;
                    options = [`$${num}$`, `$${num + 90}$`, `$1${sum - 1}9$`, `$99${firstDigit}$`];
                    self.shuffle(options);
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
                default:
                    return null;
            }
            return { type: "trac-nghiem", questionText, options, correctIndex, hints, solutionHtml, tip };
        }
    };
    if (typeof window !== 'undefined') window.g6_ch1_bai01 = Bai01TapHop;
    if (typeof module !== 'undefined' && module.exports) module.exports = Bai01TapHop;
})(typeof window !== 'undefined' ? window : global);
