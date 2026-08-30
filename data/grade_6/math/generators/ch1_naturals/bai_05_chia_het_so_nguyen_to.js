/**
 * MICRO-GENERATOR: BÀI 5 — QUAN HỆ CHIA HẾT, DẤU HIỆU & SỐ NGUYÊN TỐ
 */
(function(root) {
    'use strict';
    const Bai05ChiaHet = {
        generate(type, level, ctx) {
            const self = ctx || this;
            let questionText = "";
            let options = [];
            let correctIndex = 0;
            let hints = [];
            let solutionHtml = "";
            let tip = "";

            switch (type) {
            case "quan-he-chia-het": {
                const variant = self.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const list = [12, 15, 18, 20, 24];
                        const n = list[self.randomInt(0, list.length - 1)];
                        const correctVal = n === 12 ? 4 : (n === 15 ? 5 : (n === 18 ? 6 : 4));
                        questionText = `Số nào dưới đây là một **ước** của số $${n}$?`;
                        options = [`$${correctVal}$`, `$8$`, `$9$`, `$7$`].filter((v,i,a)=>a.indexOf(v)===i);
                        while(options.length < 4) options.push(self.randomInt(11, 20).toString());
                        options = options.map(x => `$${x}$`);
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Số $b$ là ước của $a$ nếu $a$ chia hết cho $b$.`,
                            `Hãy kiểm tra xem $${n}$ chia hết cho số nào trong 4 đáp án.`
                        ];
                        solutionHtml = `Vì $${n} : ${correctVal} = ${n/correctVal}$ (phép chia hết không dư), nên $${correctVal}$ là một ước của $${n}$.`;
                    } else if (variant === 2) {
                        const m = self.randomInt(3, 6);
                        const k = m * self.randomInt(6, 9);
                        const correctVal = m * self.randomInt(3, 5);
                        questionText = `Số nào dưới đây là một **bội** của số $${m}$ và nhỏ hơn $${k}$?`;
                        options = [`$${correctVal}$`, `$${correctVal + 1}$`, `$${k + m}$`, `$${m - 1}$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Số $a$ là bội của $b$ nếu $a$ chia hết cho $b$.`,
                            `Tìm số chia hết cho $${m}$ và kiểm tra xem số đó có nhỏ hơn $${k}$ hay không.`
                        ];
                        solutionHtml = `Ta thấy $${correctVal} : ${m} = ${correctVal/m}$ nên $${correctVal}$ chia hết cho $${m}$ và thỏa mãn $${correctVal} < ${k}$. Vậy $${correctVal}$ là bội của $${m}$ nhỏ hơn $${k}$.`;
                    } else {
                        const n = self.randomInt(15, 25);
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
                        self.shuffle(options);
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
                        const n = list[self.randomInt(0, list.length - 1)];
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
                        self.shuffle(options);
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
                        self.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Bội của $${m}$ là các số chia hết cho $${m}$.`,
                            `Tìm các bội của $${m}$ lớn hơn $${min}$ và bé hơn hoặc bằng $${max}$.`
                        ];
                        solutionHtml = `Các bội của $${m}$ là: $0; 4; 8; 12; 16; 20; 24; 28; 32; 36;...$<br>Trong đó các số lớn hơn $${min}$ và nhỏ hơn hoặc bằng $${max}$ là: $\\{${correctArr.join('; ')}\\}$.`;
                    } else {
                        const a = self.randomInt(10, 15);
                        const b = self.randomInt(25, 35);
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                const variant = self.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const correctCandidates = [135, 270, 315, 450];
                        const correctVal = correctCandidates[self.randomInt(0, correctCandidates.length - 1)];
                        questionText = `Số nào dưới đây chia hết cho cả **3** và **5**?`;
                        options = [`$${correctVal}$`, `$123$`, `$235$`, `$104$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Số chia hết cho 5 có chữ số tận cùng là 0 hoặc 5.`,
                            `Số chia hết cho 3 có tổng các chữ số chia hết cho 3.`
                        ];
                        solutionHtml = `Số $${correctVal}$ có tận cùng là $${correctVal % 10}$ nên chia hết cho 5. Tổng các chữ số là $${correctVal.toString().split('').reduce((a,b)=>parseInt(a)+parseInt(b),0)}$ chia hết cho 3. Do đó nó chia hết cho cả 3 và 5.`;
                    } else if (variant === 2) {
                        const correctCandidates = [180, 270, 360, 450];
                        const correctVal = correctCandidates[self.randomInt(0, correctCandidates.length - 1)];
                        questionText = `Số nào dưới đây chia hết cho cả **2, 5 và 9**?`;
                        options = [`$${correctVal}$`, `$195$`, `$250$`, `$182$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Số chia hết cho cả 2 và 5 phải có chữ số tận cùng là 0.`,
                            `Số chia hết cho 9 có tổng các chữ số chia hết cho 9.`
                        ];
                        solutionHtml = `Số $${correctVal}$ có chữ số tận cùng là 0 nên chia hết cho cả 2 và 5. Đồng thời tổng các chữ số của nó là $${correctVal.toString().split('').reduce((a,b)=>parseInt(a)+parseInt(b),0)}$ chia hết cho 9. Do đó nó chia hết cho 2, 5 và 9.`;
                    } else {
                        const correctVal = [12, 24, 36, 48][self.randomInt(0, 3)];
                        questionText = `Số nào dưới đây chia hết cho **4**? (Gợi ý: hai chữ số tận cùng chia hết cho 4)`;
                        options = [`$${correctVal}$`, `$18$`, `$22$`, `$30$`].map((x, idx) => {
                            if (idx === 0) return `$${x}$`;
                            const base = parseInt(x.replace(/\$/g,'')) * 10;
                            let d;
                            do {
                                d = self.randomInt(1, 9);
                            } while ((base + d) % 4 === 0);
                            return `$${base + d}$`;
                        });
                        options[0] = `$1${correctVal}$`; // tạo số đúng
                        self.shuffle(options);
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
                        const choice = list[self.randomInt(0, list.length - 1)];
                        questionText = `Tìm chữ số $x$ để số $\\overline{${choice.num}}$ chia hết cho **${choice.div}**.`;
                        options = [`$x = ${choice.xVal}$`, `$x = ${(choice.xVal + 3) % 10}$`, `$x = ${(choice.xVal + 5) % 10}$`, `$x = 9$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randVal = self.randomInt(0, 9);
                            const opt = `$x = ${randVal}$`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        self.shuffle(options);
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
                        const choice = list[self.randomInt(0, list.length - 1)];
                        questionText = `Tìm tập hợp các chữ số $x$ để số $\\overline{${choice.num}}$ chia hết cho **${choice.div}**.`;
                        const correctStr = `$x \\in \\{0; 3; 6; 9\\}$`;
                        options = [correctStr, `$x \\in \\{3; 6; 9\\}$`, `$x \\in \\{1; 4; 7\\}$`, `$x \\in \\{2; 5; 8\\}$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Tổng các chữ số của $\\overline{${choice.num}}$ phải chia hết cho 3.`,
                            `Tìm chữ số $x$ nhỏ nhất thỏa mãn, sau đó cộng thêm 3, 6, 9.`
                        ];
                        solutionHtml = `Để số $\\overline{${choice.num}}$ chia hết cho 3 thì tổng các chữ số phải chia hết cho 3.<br>Với số $\\overline{7x2}$, ta có tổng các chữ số là: $7 + x + 2 = 9 + x \\space \\vdots \\space 3$.<br>Vì $9 \\space \\vdots \\space 3$ nên $x \\space \\vdots \\space 3 \\rightarrow x \\in \\{0; 3; 6; 9\\}$.`;
                    } else {
                        const list = [
                            {num: "4x5", correct: [3, 6], wrong: [0, 9, 1, 2, 4, 5, 7, 8]},
                            {num: "2x5", correct: [5, 8], wrong: [2, 0, 1, 3, 4, 6, 7, 9]},
                            {num: "7x0", correct: [5, 8], wrong: [2, 0, 1, 3, 4, 6, 7, 9]}
                        ];
                        const choice = list[self.randomInt(0, list.length - 1)];
                        const correctVal = choice.correct[self.randomInt(0, choice.correct.length - 1)];
                        const shuffledWrong = [...choice.wrong];
                        self.shuffle(shuffledWrong);
                        
                        questionText = `Tìm chữ số $x$ để số $\\overline{${choice.num}}$ chia hết cho 3 nhưng **không** chia hết cho 9.`;
                        options = [
                            `$x = ${correctVal}$`,
                            `$x = ${shuffledWrong[0]}$`,
                            `$x = ${shuffledWrong[1]}$`,
                            `$x = ${shuffledWrong[2]}$`
                        ];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$x = ${correctVal}$`);
                        hints = [
                            `Tổng các chữ số phải chia hết cho 3 nhưng không được chia hết cho 9.`,
                            `Lần lượt thử các chữ số $x$ từ 0 đến 9 và kiểm tra tổng các chữ số.`
                        ];
                        
                        const firstDigit = parseInt(choice.num[0]);
                        const lastDigit = parseInt(choice.num[2]);
                        const sumBase = firstDigit + lastDigit;
                        
                        solutionHtml = `Với số $\\overline{${choice.num}}$, tổng các chữ số là $${firstDigit} + x + ${lastDigit} = ${sumBase} + x$.<br/>` +
                                       `Để chia hết cho 3 thì tổng các chữ số phải chia hết cho 3 $\\rightarrow ${sumBase} + x \\in \\{9; 12; 15; 18;...\\} \\rightarrow x \\in \\{${sumBase === 9 ? '0; 3; 6; 9' : '2; 5; 8'}\\}$.<br/>` +
                                       `Kiểm tra điều kiện không chia hết cho 9:<br/>` +
                                       (choice.num === "4x5" ? 
                                       `- Nếu $x = 0$ hoặc $x = 9 \\rightarrow$ tổng chữ số là 9 hoặc 18 (chia hết cho 9 - loại).<br/>- Nếu $x = 3$ hoặc $x = 6 \\rightarrow$ tổng chữ số là 12 hoặc 15 (chia hết cho 3, không chia hết cho 9 - thỏa mãn).` :
                                       `- Nếu $x = 2 \\rightarrow$ tổng chữ số là 9 (chia hết cho 9 - loại).<br/>- Nếu $x = 5$ hoặc $x = 8 \\rightarrow$ tổng chữ số là 12 hoặc 15 (chia hết cho 3, không chia hết cho 9 - thỏa mãn).`) +
                                       `<br/>Vậy chữ số thỏa mãn là $x \\in \\{${choice.correct.join('; ')}\\}$. Trong các phương án lựa chọn, chỉ có $x = ${correctVal}$ là đáp án đúng duy nhất.`;
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                const variant = self.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const correctVal = [13, 17, 19, 23][self.randomInt(0, 3)];
                        questionText = `Trong các số sau: $15$, $21$, $27$ và $${correctVal}$, số nào là **số nguyên tố**?`;
                        options = [`$${correctVal}$`, `$15$`, `$21$`, `$27$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Số nguyên tố là số tự nhiên lớn hơn 1, chỉ có hai ước là 1 và chính nó.`,
                            `Hợp số là số chia hết cho các số khác ngoài 1 và chính nó (ví dụ chia hết cho 3, 5).`
                        ];
                        solutionHtml = `Số $15 \\space \\vdots \\space 3$, $21 \\space \\vdots \\space 3$, $27 \\space \\vdots \\space 3$ là các hợp số. Số $${correctVal}$ chỉ chia hết cho 1 và chính nó nên là số nguyên tố.`;
                    } else if (variant === 2) {
                        const correctVal = [14, 25, 33, 39][self.randomInt(0, 3)];
                        questionText = `Trong các số sau: $11$, $13$, $17$ và $${correctVal}$, số nào là **hợp số**?`;
                        options = [`$${correctVal}$`, `$11$`, `$13$`, `$17$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Hợp số là số tự nhiên lớn hơn 1 và có nhiều hơn 2 ước.`,
                            `Tìm số trong 4 đáp án chia hết cho một số nguyên tố nhỏ (như 2, 3, 5).`
                        ];
                        solutionHtml = `Các số $11, 13, 17$ chỉ chia hết cho 1 và chính nó nên là các số nguyên tố. Số $${correctVal}$ chia hết cho ${correctVal === 14 ? '2' : (correctVal === 25 ? '5' : '3')} nên là hợp số.`;
                    } else {
                        questionText = `Khẳng định nào dưới đây về số nguyên tố là **sai**?`;
                        const correctStr = `Tất cả các số nguyên tố đều là số lẻ.`;
                        options = [
                            correctStr,
                            `Số 2 là số nguyên tố chẵn duy nhất.`,
                            `Số 0 và số 1 không phải là số nguyên tố, cũng không phải là hợp số.`,
                            `Mọi số nguyên tố đều lớn hơn 1.`
                        ];
                        self.shuffle(options);
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
                        const val = [60, 84, 90][self.randomInt(0, 2)];
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                default:
                    return null;
            }
            return { type: "trac-nghiem", questionText, options, correctIndex, hints, solutionHtml, tip };
        }
    };
    if (typeof window !== 'undefined') window.g6_ch1_bai05 = Bai05ChiaHet;
    if (typeof module !== 'undefined' && module.exports) module.exports = Bai05ChiaHet;
})(typeof window !== 'undefined' ? window : global);
