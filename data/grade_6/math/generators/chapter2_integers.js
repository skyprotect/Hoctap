/**
 * GRADE 6 MATH - CHAPTER 2: SỐ NGUYÊN
 */
(function(root) {
    'use strict';

    function generate(type, level, context) {
        const self = context || this;
        let questionText = "";
        let options = [];
        let correctIndex = 0;
        let hints = [];
        let solutionHtml = "";
        let tip = "";

        switch (type) {
            case "tap-hop-so-nguyen": {
                const variant = self.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = self.randomInt(4, 9);
                        const b = a + self.randomInt(2, 4);
                        questionText = `Phát biểu so sánh số nguyên nào dưới đây là **đúng**?`;
                        options = [`$-${b} < -${a}$`, `$-${b} > -${a}$`, `$-${a} < -${b}$`, `$-${a} = -${b}$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$-${b} < -${a}$`);
                        hints = [
                            `Với hai số nguyên âm, số có phần số tự nhiên lớn hơn thì nhỏ hơn.`,
                            `So sánh $${b}$ và $${a}$, từ đó suy ra chiều so sánh của $-${b}$ và $-${a}$.`
                        ];
                        solutionHtml = `Vì $${b} > ${a}$, nên trên trục số, điểm $-${b}$ nằm bên trái điểm $-${a}$. Do đó ta có: $-${b} < -${a}$.`;
                    } else if (variant === 2) {
                        const t1 = self.randomInt(-8, -4);
                        const t2 = self.randomInt(-3, -1);
                        questionText = `Nhiệt độ đo được vào buổi sáng tại Sa Pa là $${t1}^\\circ\\text{C}$, tại Hà Nội là $${t2}^\\circ\\text{C}$. Khẳng định nào sau đây là **đúng**?`;
                        const correctStr = `Thời tiết ở Sa Pa lạnh hơn Hà Nội vì $${t1}^\\circ\\text{C} < ${t2}^\\circ\\text{C}$.`;
                        options = [
                            correctStr,
                            `Thời tiết ở Sa Pa ấm hơn Hà Nội vì $${t1} > ${t2}$.`,
                            `Thời tiết ở Sa Pa lạnh hơn Hà Nội vì $${t1} > ${t2}$.`,
                            `Thời tiết ở hai nơi bằng nhau.`
                        ];
                        self.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Nhiệt độ càng thấp (giá trị số nguyên âm càng nhỏ) thì thời tiết càng lạnh.`,
                            `So sánh hai số nguyên âm $${t1}$ và $${t2}$.`
                        ];
                        solutionHtml = `Ta so sánh hai số nguyên âm: $${t1} < ${t2}$ vì $${Math.abs(t1)} > ${Math.abs(t2)}$. Do đó, nhiệt độ ở Sa Pa ($${t1}^\\circ\\text{C}$) thấp hơn nhiệt độ ở Hà Nội ($${t2}^\\circ\\text{C}$), nghĩa là thời tiết ở Sa Pa lạnh hơn Hà Nội.`;
                    } else {
                        const n = self.randomInt(5, 15);
                        questionText = `Tìm số đối của số đối của số $-${n}$.`;
                        options = [`$-${n}$`, `$${n}$`, `$0$`, `$1$`];
                        self.shuffle(options);
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
                        const delta = self.randomInt(1, 3);
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
                        self.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Số nguyên âm luôn nhỏ hơn 0, số 0 luôn nhỏ hơn số nguyên dương.`,
                            `So sánh phần số tự nhiên của các số nguyên âm: số nào có phần số tự nhiên lớn hơn thì nhỏ hơn.`
                        ];
                        solutionHtml = `So sánh các số ta có: $${sortedArr.join(' < ')}$. Vậy thứ tự sắp xếp tăng dần là: $${sortedArr.join(';\\space ')}$.`;
                    } else if (variant === 2) {
                        const a = self.randomInt(3, 5);
                        const b = self.randomInt(4, 7);
                        questionText = `Có bao nhiêu số nguyên $x$ thỏa mãn điều kiện: $-${a} \\le x < ${b}$?`;
                        const correctVal = b + a;
                        options = [`$${correctVal}$`, `$${correctVal - 1}$`, `$${correctVal + 1}$`, `$${b - a}$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Liệt kê các số nguyên bắt đầu từ $-${a}$ (vì có dấu $\\le$) đến số nguyên nhỏ hơn $${b}$ (không lấy $${b}$).`,
                            `Tính số lượng các phần tử trong danh sách.`
                        ];
                        solutionHtml = `Các số nguyên $x$ thỏa mãn là: $x \\in \\{${Array.from({length: b + a}, (_, i) => -a + i).join(';\\space ')}\\}$. Tập hợp này gồm có $${correctVal}$ phần tử.`;
                    } else {
                        const a = self.randomInt(2, 4);
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
                        self.shuffle(options);
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
                        const a = self.randomInt(5, 7);
                        const b = self.randomInt(4, 6);
                        questionText = `Tìm tổng của tất cả các số nguyên $x$ thỏa mãn điều kiện: $-${a} < x \\le ${b}$.`;
                        let sum = 0;
                        const arr = [];
                        for(let i = -a + 1; i <= b; i++) {
                            sum += i;
                            arr.push(i);
                        }
                        options = [`$${sum}$`, `$0$`, `$${sum - 5}$`, `$${sum + a}$`];
                        self.shuffle(options);
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
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${sum}$`);
                        hints = [
                            `Liệt kê tập hợp $A$: các số nguyên từ $-3$ đến $3$.`,
                            `Liệt kê tập hợp $B$: các số nguyên lớn hơn $-2$ và nhỏ hơn $5$.`,
                            `Tìm các số nguyên chung của cả hai tập hợp rồi tính tổng.`
                        ];
                        solutionHtml = `Ta có:<br>- $A = \\{-3;\\space -2;\\space -1;\\space 0;\\space 1;\\space 2;\\space 3\\}$.<br>- $B = \\{-1;\\space 0;\\space 1;\\space 2;\\space 3;\\space 4\\}$.<br>Các số nguyên chung của cả hai tập hợp (giao của $A$ và $B$) là: $\\{-1;\\space 0;\\space 1;\\space 2;\\space 3\\}$.<br>Tổng của các số nguyên này là: $(-1) + 0 + 1 + 2 + 3 = 5$.`;
                    } else {
                        const d = self.randomInt(5, 10);
                        questionText = `Trên trục số, hai điểm $A$ và $B$ biểu diễn hai số đối nhau. Biết rằng điểm $A$ nằm bên trái điểm $B$ và khoảng cách giữa $A$ và $B$ là $${2*d}$ đơn vị. Tìm hai số nguyên biểu diễn bởi $A$ và $B$.`;
                        const correctStr = `$A = -${d};\\space B = ${d}$`;
                        options = [
                            correctStr,
                            `$A = -${2*d};\\space B = ${2*d}$`,
                            `$A = 0;\\space B = ${2*d}$`,
                            `$A = -${d};\\space B = -${d}$`
                        ];
                        self.shuffle(options);
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
                const variant = self.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = self.randomInt(5, 12);
                        const b = self.randomInt(15, 25);
                        questionText = `Tính giá trị biểu thức: $A = ${a} - ${b}$.`;
                        const correctVal = a - b;
                        options = [`$${correctVal}$`, `$${Math.abs(correctVal)}$`, `$${correctVal - 1}$`, `$${a + b}$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Đây là phép trừ số nhỏ cho số lớn. Kết quả chắc chắn là số nguyên âm.`,
                            `Quy tắc: $a - b = -(b - a)$ với $b > a$.`
                        ];
                        solutionHtml = `Ta có $${a} < ${b}$, nên $A = ${a} - ${b} = -(${b} - ${a}) = -${b - a}$.`;
                    } else if (variant === 2) {
                        const a = self.randomInt(50, 100);
                        const b = a + self.randomInt(10, 40);
                        questionText = `Số tiền trong tài khoản của bạn Nam là $${a}\\text{ nghìn đồng}$. Sau khi bạn Nam rút ra $${b}\\text{ nghìn đồng}$ để mua sách, tài khoản của Nam sẽ là bao nhiêu?`;
                        const correctVal = a - b;
                        options = [`$${correctVal}\\text{ nghìn đồng}$`, `$${Math.abs(correctVal)}\\text{ nghìn đồng}$`, `$0\\text{ nghìn đồng}$`, `$${correctVal - 5}\\text{ nghìn đồng}$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}\\text{ nghìn đồng}$`);
                        hints = [
                            `Số tiền còn lại là hiệu của số tiền ban đầu và số tiền đã rút: $${a} - ${b}$.`,
                            `Vì số tiền rút ra lớn hơn số tiền hiện có, tài khoản sẽ rơi vào trạng thái nợ (số âm).`
                        ];
                        solutionHtml = `Số tiền còn lại trong tài khoản là: $${a} - ${b} = -(${b} - ${a}) = ${correctVal}\\text{ nghìn đồng}$ (biểu thị tài khoản đang nợ $${Math.abs(correctVal)}\\text{ nghìn đồng}$).`;
                    } else {
                        const t1 = self.randomInt(2, 6);
                        const t2 = t1 + self.randomInt(5, 9);
                        questionText = `Nhiệt độ vào buổi trưa ở Mẫu Sơn là $${t1}^\\circ\\text{C}$. Đến nửa đêm, nhiệt độ giảm đi $${t2}^\\circ\\text{C}$. Hỏi nhiệt độ ở Mẫu Sơn lúc nửa đêm là bao nhiêu?`;
                        const correctVal = t1 - t2;
                        options = [`$${correctVal}^\\circ\\text{C}$`, `$${Math.abs(correctVal)}^\\circ\\text{C}$`, `$0^\\circ\\text{C}$`, `$${correctVal - 1}^\\circ\\text{C}$`];
                        self.shuffle(options);
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
                        const a = self.randomInt(10, 20);
                        const b = self.randomInt(15, 25);
                        const c = self.randomInt(5, 15);
                        questionText = `Tính nhanh giá trị biểu thức: $M = ${a} - ${b} - (${c} - ${b})$`;
                        const correctVal = a - c;
                        options = [`$${correctVal}$`, `$${a - 2*b - c}$`, `$${correctVal + 10}$`, `$0$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Bỏ ngoặc có dấu trừ phía trước: đổi dấu các số hạng trong ngoặc.`,
                            `Biểu thức trở thành: $${a} - ${b} - ${c} + ${b}$.`
                        ];
                        solutionHtml = `Bỏ ngoặc: $M = ${a} - ${b} - ${c} + ${b} = ${a} - ${c} + (${b} - ${b}) = ${a - c}$.`;
                    } else if (variant === 2) {
                        const a = self.randomInt(10, 20);
                        questionText = `Tính nhanh tổng của dãy số sau: $S = ${a} - (${a}+1) + (${a}+2) - (${a}+3) + (${a}+4) - (${a}+5)$`;
                        const correctVal = -3;
                        options = [`$-3$`, `$3$`, `$0$`, `$${6 * a}$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$-3$`);
                        hints = [
                            `Nhóm các cặp số hạng liên tiếp lại với nhau: $[${a} - (${a}+1)] + [(${a}+2) - (${a}+3)] + [(${a}+4) - (${a}+5)]$.`,
                            `Mỗi cặp có giá trị bằng bao nhiêu?`
                        ];
                        solutionHtml = `Ta nhóm các số hạng thành từng cặp liên tiếp:<br>$S = [${a} - (${a}+1)] + [(${a}+2) - (${a}+3)] + [(${a}+4) - (${a}+5)]$.<br>Mỗi cặp đều có hiệu bằng $-1$.<br>Do đó: $S = (-1) + (-1) + (-1) = -3$.`;
                    } else {
                        const a = self.randomInt(10, 20);
                        const b = self.randomInt(5, 9);
                        questionText = `Tìm số nguyên $x$, biết: $${a} - x = -${b}$.`;
                        const correctVal = a + b;
                        options = [`$${correctVal}$`, `$${a - b}$`, `$${b - a}$`, `$${-correctVal}$`];
                        self.shuffle(options);
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
                        const xVal = self.randomInt(1, 4);
                        const k = self.randomInt(2, 5);
                        questionText = `Tìm số nguyên $x$, biết: $|x - ${xVal}| + ${k} = ${k + 2}$`;
                        const x1 = xVal + 2;
                        const x2 = xVal - 2;
                        options = [
                            `$x \\in \\{${x1};\\space ${x2}\\}$`,
                            `$x = ${x1}$`,
                            `$x = ${x2}$`,
                            `$x \\in \\{${xVal};\\space -${xVal}\\}$`
                        ];
                        self.shuffle(options);
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
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$-50$`);
                        hints = [
                            `Đếm số lượng số hạng trong dãy số.`,
                            `Nhóm hai số hạng liên tiếp thành một cặp: $(1 - 3) + (5 - 7) + ... + (97 - 99)$.`,
                            `Tính số lượng cặp và giá trị của mỗi cặp.`
                        ];
                        solutionHtml = `Dãy số $1; 3; 5; ...; 99$ là dãy số lẻ cách đều 2 đơn vị. Số các số hạng là: $(99 - 1) : 2 + 1 = 50$ số hạng.<br>Nhóm thành các cặp liên tiếp: $S = (1 - 3) + (5 - 7) + ... + (97 - 99)$.<br>Số lượng cặp là: $50 : 2 = 25$ cặp.<br>Giá trị của mỗi cặp là: $1 - 3 = -2$.<br>Vậy tổng $S = 25 \\cdot (-2) = -50$.`;
                    } else {
                        const a = self.randomInt(1, 3);
                        const b = self.randomInt(3, 5);
                        const c = self.randomInt(1, 2);
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
                        self.shuffle(options);
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
                const variant = self.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = self.randomInt(15, 25);
                        const b = self.randomInt(5, 10);
                        const c = self.randomInt(2, 4);
                        questionText = `Bỏ ngoặc biểu thức sau: $A = ${a} - (${b} - x + ${c})$.`;
                        options = [
                            `$A = ${a} - ${b} + x - ${c}$`,
                            `$A = ${a} - ${b} - x + ${c}$`,
                            `$A = ${a} - ${b} + x + ${c}$`,
                            `$A = ${a} - ${b} - x - ${c}$`
                        ];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$A = ${a} - ${b} + x - ${c}$`);
                        hints = [
                            `Trước ngoặc là dấu trừ: đổi dấu toàn bộ số hạng trong ngoặc.`,
                            `Số $${b}$ đổi thành $-${b}$, $-x$ đổi thành $+x$, $+${c}$ đổi thành $-${c}$.`
                        ];
                        solutionHtml = `Vì trước ngoặc có dấu trừ, ta đổi dấu toàn bộ hạng tử trong ngoặc: $A = ${a} - ${b} + x - ${c}$.`;
                    } else if (variant === 2) {
                        const a = self.randomInt(10, 20);
                        const b = self.randomInt(5, 15);
                        questionText = `Thu gọn biểu thức sau bằng cách bỏ ngoặc: $B = -${a} - (${b} - ${a})$.`;
                        const correctVal = -b;
                        options = [`$${correctVal}$`, `$${-2*a - b}$`, `$${b}$`, `$0$`];
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        const a = self.randomInt(25, 45);
                        const b = self.randomInt(50, 80);
                        const c = self.randomInt(5, 15);
                        questionText = `Tính giá trị biểu thức sau bằng cách bỏ ngoặc hợp lý: $N = (${a} - ${b}) - (${a} - ${b} - ${c})$`;
                        options = [`$${c}$`, `$${-c}$`, `$${2*a - 2*b - c}$`, `$0$`];
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        const a = self.randomInt(12, 18);
                        const b = self.randomInt(20, 30);
                        const sum = a + b;
                        const xVal = sum % 2 === 0 ? sum / 2 : (sum + 1) / 2;
                        const realB = 2 * xVal - a;
                        questionText = `Tìm số nguyên $x$, biết: $x - (${a} - x) = ${realB}$`;
                        options = [`$x = ${xVal}$`, `$x = ${xVal - a}$`, `$x = ${realB - a}$`, `$x = 0$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$x = ${xVal}$`);
                        hints = [
                            `Bỏ dấu ngoặc có dấu trừ đằng trước ở vế trái: $x - ${a} + x = ${realB}$.`,
                            `Rút gọn: $2x - ${a} = ${realB}$.`
                        ];
                        solutionHtml = `Ta biến đổi vế trái: $x - ${a} + x = ${realB} \\rightarrow 2x - ${a} = ${realB} \\rightarrow 2x = ${realB} + ${a} = ${2 * xVal} \\rightarrow x = ${xVal}$.`;
                    } else if (variant === 2) {
                        const a = self.randomInt(15, 25);
                        const b = self.randomInt(5, 10);
                        const c = self.randomInt(2, 6);
                        const d = self.randomInt(10, 15);
                        const xVal = b - a + d + c;
                        questionText = `Tìm số nguyên $x$, biết: $${a} - [${b} - (x - ${c})] = ${d}$.`;
                        options = [`$x = ${xVal}$`, `$x = ${xVal + 2}$`, `$x = ${xVal - 4}$`, `$x = 0$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$x = ${xVal}$`);
                        hints = [
                            `Coi cả ngoặc vuông $[${b} - (x - ${c})]$ là số trừ: $[${b} - (x - ${c})] = ${a} - ${d}$.`,
                            `Tiếp tục coi $(x - ${c})$ là số trừ ở bước tiếp theo để tìm $x$.`
                        ];
                        solutionHtml = `Ta có: $${a} - [${b} - (x - ${c})] = ${d}$<br>$\\rightarrow [${b} - (x - ${c})] = ${a} - ${d} = ${a - d}$<br>$\\rightarrow x - ${c} = ${b} - (${a - d}) = ${b - a + d}$<br>$\\rightarrow x = ${b - a + d} + ${c} = ${xVal}$.`;
                    } else {
                        const a = self.randomInt(5, 10);
                        const b = self.randomInt(10, 16);
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
                        self.shuffle(options);
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
                const variant = self.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = self.randomInt(4, 9);
                        const b = self.randomInt(5, 8);
                        questionText = `Tính giá trị biểu thức: $P = ${a} \\cdot (-${b})$.`;
                        const correctVal = -a * b;
                        options = [`$${correctVal}$`, `$${Math.abs(correctVal)}$`, `$${correctVal - 1}$`, `$${a - b}$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Đây là phép nhân hai số nguyên khác dấu. Kết quả luôn mang dấu âm.`,
                            `Tích của hai số nguyên khác dấu bằng số đối của tích các giá trị tuyệt đối: $a \\cdot (-b) = -(a \\cdot b)$.`
                        ];
                        solutionHtml = `Nhân hai số nguyên khác dấu ta được kết quả âm: $P = ${a} \\cdot (-${b}) = -(${a} \\cdot ${b}) = ${correctVal}$.`;
                    } else if (variant === 2) {
                        const a = self.randomInt(3, 7);
                        const b = self.randomInt(4, 8);
                        questionText = `Tính giá trị biểu thức: $Q = (-${a}) \\cdot (-${b})$.`;
                        const correctVal = a * b;
                        options = [`$${correctVal}$`, `$${-correctVal}$`, `$${correctVal + 2}$`, `$${-a - b}$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Đây là phép nhân hai số nguyên cùng dấu âm. Kết quả luôn mang dấu dương.`,
                            `Quy tắc: $(-a) \\cdot (-b) = a \\cdot b$.`
                        ];
                        solutionHtml = `Nhân hai số nguyên cùng dấu âm ta được kết quả dương: $Q = (-${a}) \\cdot (-${b}) = ${a} \\cdot ${b} = ${correctVal}$.`;
                    } else {
                        const a = self.randomInt(2, 4);
                        const exp = self.randomInt(2, 3);
                        questionText = `Tính giá trị của lũy thừa sau: $A = (-${a})^{${exp}}$.`;
                        const correctVal = Math.pow(-a, exp);
                        // Khi exp chẵn, correctVal > 0 nên Math.abs(correctVal) === correctVal → trùng. Dùng -correctVal - 1 thay thế.
                        const w2NhanSoNguyen = (exp % 2 === 0) ? (-correctVal - 1) : Math.abs(correctVal);
                        options = [`$${correctVal}$`, `$${w2NhanSoNguyen}$`, `$${-a * exp}$`, `$${Math.pow(a, exp) + 1}$`];
                        self.shuffle(options);
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
                        const a = self.randomInt(-15, -8);
                        const b = self.randomInt(12, 18);
                        const c = 100 - b;
                        questionText = `Tính nhanh giá trị biểu thức: $Q = ${a} \\cdot ${b} + ${a} \\cdot ${c}$`;
                        const correctVal = a * 100;
                        options = [`$${correctVal}$`, `$${a * (b - c)}$`, `$${Math.abs(correctVal)}$`, `$0$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Áp dụng tính chất phân phối của phép nhân đối với phép cộng: $x \\cdot y + x \\cdot z = x \\cdot (y + z)$.`,
                            `Đặt thừa số chung $${a}$ ra ngoài ngoặc.`
                        ];
                        solutionHtml = `Áp dụng tính chất phân phối: $Q = ${a} \\cdot (${b} + ${c}) = ${a} \\cdot 100 = ${correctVal}$.`;
                    } else if (variant === 2) {
                        const a = self.randomInt(-18, -12);
                        const b = self.randomInt(120, 130);
                        const c = b - 100;
                        questionText = `Tính nhanh giá trị biểu thức: $M = ${a} \\cdot ${b} - ${a} \\cdot ${c}$`;
                        const correctVal = a * 100;
                        options = [`$${correctVal}$`, `$${a * (b + c)}$`, `$${Math.abs(correctVal)}$`, `$100$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Áp dụng tính chất phân phối của phép nhân đối với phép trừ: $x \\cdot y - x \\cdot z = x \\cdot (y - z)$.`,
                            `Thừa số chung là $${a}$. Số trong ngoặc là $${b} - ${c} = 100$.`
                        ];
                        solutionHtml = `Đặt thừa số chung $${a}$ ra ngoài: $M = ${a} \\cdot (${b} - ${c}) = ${a} \\cdot 100 = ${correctVal}$.`;
                    } else {
                        const a = self.randomInt(2, 4);
                        const b = self.randomInt(3, 5);
                        const c = self.randomInt(2, 4);
                        questionText = `Tính giá trị biểu thức sau: $A = (-${a})^2 \\cdot (-${b}) - ${c} \\cdot (-5)$.`;
                        const correctVal = Math.pow(-a, 2) * (-b) - c * (-5);
                        options = [`$${correctVal}$`, `$${correctVal - 10}$`, `$${-correctVal}$`, `$0$`];
                        self.shuffle(options);
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
                        const choice = list[self.randomInt(0, list.length - 1)];
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
                        self.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Vì $x, y$ là số nguyên nên $x - ${a}$ và $y + ${b}$ phải là các ước số nguyên của $${p}$.`,
                            `Ước nguyên của số nguyên tố $${p}$ là: $\\{1; -1; ${p}; -${p}\\}$. Lập bảng xét 4 trường hợp.`
                        ];
                        solutionHtml = `Vì $x, y \\in \\mathbb{Z} \\rightarrow (x - ${a})$ và $(y + ${b})$ là các ước nguyên của $${p}$.<br>Ta có tập ước: $\\text{Ư}(${p}) = \\{1; -1; ${p}; -${p}\\}$.<br>Ta lập bảng giá trị:<br>1) $x - ${a} = 1, y + ${b} = ${p} \\rightarrow x = ${a+1}, y = ${p-b}$.<br>2) $x - ${a} = -1, y + ${b} = -${p} \\rightarrow x = ${a-1}, y = ${-p-b}$.<br>3) $x - ${a} = ${p}, y + ${b} = 1 \\rightarrow x = ${a+p}, y = ${1-b}$.<br>4) $x - ${a} = -${p}, y + ${b} = -1 \\rightarrow x = ${a-p}, y = ${-1-b}$.<br>Vậy các cặp $(x; y)$ thỏa mãn là: $${pair1}, ${pair2}, ${pair3}, ${pair4}$.`;
                    } else if (variant === 2) {
                        const a = [4, 9, 16][self.randomInt(0, 2)];
                        const b = self.randomInt(2, 5);
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
                        self.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Một tích bằng 0 khi ít nhất một trong các thừa số bằng 0.`,
                            `Xét hai trường hợp: $x^2 - ${a} = 0$ hoặc $x + ${b} = 0$.`,
                            `Chú ý số nguyên thỏa mãn $x^2 = ${a}$ có hai giá trị đối nhau.`
                        ];
                        solutionHtml = `Ta có: $(x^2 - ${a})(x + ${b}) = 0$.<br>Trường hợp 1: $x^2 - ${a} = 0 \\rightarrow x^2 = ${a} \\rightarrow x = ${r1}$ hoặc $x = ${r2}$ (cả hai đều là số nguyên).<br>Trường hợp 2: $x + ${b} = 0 \\rightarrow x = ${r3}$ (là số nguyên).<br>Vậy tập hợp các giá trị $x$ thỏa mãn là: $x \\in \\{${correctStr.replace('$','')}\\}$.`;
                    } else {
                        const n = self.randomInt(40, 60);
                        const a = self.randomInt(120, 150);
                        const m = self.randomInt(25, 35);
                        const b = self.randomInt(15, 25);
                        const c = self.randomInt(5, 10);
                        const correctVal = m * b - (n - m) * c;
                        questionText = `Một cửa hàng nhập khẩu $${n}\\text{ chiếc áo}$ với cùng một giá vốn. Cửa hàng bán $${m}\\text{ chiếc}$ đầu tiên với mức lợi nhuận mỗi chiếc là $+${b}\\text{ nghìn đồng}$. Để thanh lý nốt số áo còn lại nhanh chóng, cửa hàng bán lỗ mỗi chiếc là $-${c}\\text{ nghìn đồng}$. Hỏi sau khi bán hết toàn bộ số áo trên, cửa hàng lời hay lỗ bao nhiêu? (Dùng số nguyên để biểu thị).`;
                        const correctStr = `$${correctVal >= 0 ? `+${correctVal}` : `${correctVal}`}\\text{ nghìn đồng}$`;
                        options = [
                            correctStr,
                            `$${correctVal - 100}\\text{ nghìn đồng}$`,
                            `$${-correctVal}\\text{ nghìn đồng}$`,
                            `$${m*b + (n-m)*c}\\text{ nghìn đồng}$`
                        ];
                        self.shuffle(options);
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
                const variant = self.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const n = [4, 6, 9][self.randomInt(0, 2)];
                        questionText = `Số nào dưới đây **không** thuộc tập hợp các ước của $${n}$ trong tập số nguyên $\\mathbb{Z}$?`;
                        let wrongVal = 5;
                        options = [`$${wrongVal}$`, `$1$`, `$-1$`, `$${n}$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${wrongVal}$`);
                        hints = [
                            `Ước số nguyên của $${n}$ là các số nguyên mà $${n}$ chia hết.`,
                            `Kiểm tra xem $${n}$ không chia hết cho số nào.`
                        ];
                        solutionHtml = `Vì $${n}$ không chia hết cho $5$, nên $5$ không phải là ước của $${n}$. Các số còn lại đều là ước nguyên.`;
                    } else if (variant === 2) {
                        const n = [6, 8, 10][self.randomInt(0, 2)];
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
                        self.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Ước của số nguyên âm $-${n}$ cũng chính là ước của số tự nhiên $${n}$.`,
                            `Ước nguyên bao gồm cả các ước số dương và các ước số âm đối xứng.`
                        ];
                        solutionHtml = `Ước của số nguyên $-${n}$ gồm các số nguyên mà $-${n}$ chia hết. Các ước đó là: $\\{${correctArr.join(';\\space ')}\\}$.`;
                    } else {
                        const a = self.randomInt(3, 5);
                        const b = a * self.randomInt(3, 5);
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
                        self.shuffle(options);
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
                        const a = self.randomInt(2, 4);
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
                        self.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Tìm các bội của $${a}$ (bao gồm cả bội dương, bội âm và số 0).`,
                            `Chỉ chọn các số lớn hơn $-${limit}$ và nhỏ hơn $${limit}$.`
                        ];
                        solutionHtml = `Bội nguyên của $${a}$ nằm trong khoảng từ $-${limit}$ đến $${limit}$ là các số chia hết cho $${a}$: $\\{${correctArr.join(';\\space ')}\\}$.`;
                    } else if (variant === 2) {
                        const a = self.randomInt(1, 3);
                        const b = [4, 6][self.randomInt(0, 1)];
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        const a = self.randomInt(2, 4);
                        const p = [5, 7][self.randomInt(0, 1)];
                        questionText = `Có bao nhiêu số nguyên $n$ để biểu thức $(n - ${a})$ là ước của số nguyên $${p}$?`;
                        options = [`$4$`, `$2$`, `$8$`, `$0$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$4$`);
                        hints = [
                            `Để $n-${a}$ là ước của $${p}$, thì $n-${a}$ phải nhận các giá trị thuộc tập ước nguyên của $${p}$.`,
                            `Ước nguyên của số nguyên tố $${p}$ là: $\\{1;\\space -1;\\space ${p};\\space -${p}\\}$.`
                        ];
                        solutionHtml = `Để $n-${a}$ là ước của $${p} \\rightarrow n-${a} \\in \\{1;\\space -1;\\space ${p};\\space -${p}\\}$.<br>Giải ra ta được: $n \\in \\{${a+1};\\space ${a-1};\\space ${a+p};\\space ${a-p}\\}$. Tất cả đều là số nguyên. Vậy có $4$ giá trị của $n$.`;
                    } else if (variant === 2) {
                        const a = self.randomInt(1, 3);
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
            default:
                return null;
        }

        if (!questionText) return null;

        return {
            questionText,
            options,
            correctIndex,
            hints,
            solutionHtml,
            tip
        };
    }

    const ChapterModule = { generate };
    if (typeof module !== 'undefined' && module.exports) module.exports = ChapterModule;
    if (typeof root !== 'undefined') root.chapter2_integers = ChapterModule;
})(typeof window !== 'undefined' ? window : global);
