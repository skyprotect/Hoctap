/**
 * MICRO-GENERATOR: BÀI 6 — ƯỚC CHUNG LỚN NHẤT & BỘI CHUNG NHỎ NHẤT
 */
(function(root) {
    'use strict';
    const Bai06UclnBcnn = {
        generate(type, level, ctx) {
            const self = ctx || this;
            let questionText = "";
            let options = [];
            let correctIndex = 0;
            let hints = [];
            let solutionHtml = "";
            let tip = "";

            switch (type) {
            case "ucln": {
                const variant = self.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const g = self.randomInt(3, 12);
                        let x = self.randomInt(2, 7);
                        let y = self.randomInt(2, 7);
                        while (self.gcd(x, y) !== 1 || x === y) {
                            x = self.randomInt(2, 7);
                            y = self.randomInt(2, 7);
                        }
                        const aNum = g * x;
                        const bNum = g * y;
                        const ans = g;
                        
                        questionText = `Tìm ước chung lớn nhất của hai số: $\\text{ƯCLN}(${aNum}, ${bNum})$.`;
                        options = [`$${ans}$`, `$${ans * 2}$`, `$${self.gcd(x, y)}$`, `$${Math.abs(aNum - bNum)}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomOpt = `$${self.randomInt(2, ans + 20)}$`;
                            if (!options.includes(randomOpt)) options.push(randomOpt);
                        }
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${ans}$`);
                        hints = [
                            `ƯCLN là số tự nhiên lớn nhất mà cả $${aNum}$ và $${bNum}$ đều chia hết.`,
                            `Phân tích ra thừa số nguyên tố của từng số và lấy các thừa số chung với số mũ nhỏ nhất.`
                        ];
                        solutionHtml = `Ta phân tích thừa số nguyên tố:<br>- $${aNum} = ${self.factorize(aNum)}$<br>- $${bNum} = ${self.factorize(bNum)}$<br>Các thừa số chung lấy với số mũ nhỏ nhất. Vậy $\\text{ƯCLN}(${aNum}, ${bNum}) = ${ans}$.`;
                    } else if (variant === 2) {
                        // Tìm ƯCLN của 3 số: 18, 24, 30 -> 6
                        const correctStr = `$6$`;
                        questionText = `Tìm ước chung lớn nhất của ba số: $\\text{ƯCLN}(18, 24, 30)$.`;
                        options = [correctStr, `$12$`, `$3$`, `$2$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(correctStr);
                        hints = [
                            `Phân tích cả 3 số ra thừa số nguyên tố: $18 = 2 \\cdot 3^2$, $24 = 2^3 \\cdot 3$, $30 = 2 \\cdot 3 \\cdot 5$.`,
                            `Chọn các thừa số nguyên tố chung (2 và 3) với số mũ nhỏ nhất.`
                        ];
                        solutionHtml = `Ta phân tích:<br>$18 = 2 \\cdot 3^2$<br>$24 = 2^3 \\cdot 3$<br>$30 = 2 \\cdot 3 \\cdot 5$<br>Thừa số chung là 2 và 3. Số mũ nhỏ nhất tương ứng là 1. $\\text{ƯCLN}(18, 24, 30) = 2 \\cdot 3 = 6$.`;
                    } else {
                        // Hai số nguyên tố cùng nhau có ƯCLN = 1
                        const a = [8, 9, 15, 25][self.randomInt(0, 3)];
                        let b = [7, 11, 13, 17][self.randomInt(0, 3)];
                        questionText = `Tìm ước chung lớn nhất của hai số $${a}$ và $${b}$.`;
                        const correctStr = `$1$`;
                        options = [correctStr, `$2$`, `$${self.gcd(a, b)}$`, `$3$`];
                        options = [...new Set(options)];
                        while(options.length < 4) options.push(`$${self.randomInt(4, 10)}$`);
                        self.shuffle(options);
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
                        const g = self.randomInt(4, 12);
                        let x = self.randomInt(2, 6);
                        let y = self.randomInt(2, 6);
                        while (self.gcd(x, y) !== 1 || x === y) {
                            x = self.randomInt(2, 6);
                            y = self.randomInt(2, 6);
                        }
                        const nam = g * x;
                        const nu = g * y;
                        
                        questionText = `Một lớp học có $${nam}$ bạn nam và $${nu}$ bạn nữ. Cô giáo muốn chia lớp thành các nhóm học tập sao cho số lượng nam và nữ ở mỗi nhóm bằng nhau. Hỏi cô giáo có thể chia được nhiều nhất bao nhiêu nhóm?`;
                        options = [`$${g}$ nhóm`, `$${g * 2}$ nhóm`, `$${self.gcd(x, y)}$ nhóm`, `$${Math.min(nam, nu)}$ nhóm`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomOpt = `$${self.randomInt(2, g + 10)}$ nhóm`;
                            if (!options.includes(randomOpt)) options.push(randomOpt);
                        }
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        const g = self.randomInt(4, 10);
                        const primes = [5, 7, 11, 13];
                        const xy = primes[self.randomInt(0, primes.length - 1)];
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
                            const randomA = self.randomInt(2, 30);
                            const randomB = Math.floor(tich / randomA);
                            if (tich % randomA === 0) {
                                const opt = `$a = ${randomA}; b = ${randomB}$`;
                                if (!options.includes(opt)) options.push(opt);
                            }
                        }
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                const variant = self.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        let aNum = self.randomInt(6, 25);
                        let bNum = self.randomInt(6, 25);
                        let l = self.lcm(aNum, bNum);
                        while (l > 150 || aNum % bNum === 0 || bNum % aNum === 0) {
                            aNum = self.randomInt(6, 25);
                            bNum = self.randomInt(6, 25);
                            l = self.lcm(aNum, bNum);
                        }
                        const ans = l;
                        
                        questionText = `Tìm bội chung nhỏ nhất của hai số: $\\text{BCNN}(${aNum}, ${bNum})$.`;
                        options = [`$${ans}$`, `$${ans * 2}$`, `$${aNum * bNum}$`, `$${self.gcd(aNum, bNum)}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomOpt = `$${self.randomInt(ans - 20 > 0 ? ans - 20 : 2, ans + 40)}$`;
                            if (!options.includes(randomOpt)) options.push(randomOpt);
                        }
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${ans}$`);
                        hints = [
                            `BCNN là số tự nhiên nhỏ nhất khác 0 chia hết cho cả $${aNum}$ và $${bNum}$.`,
                            `Phân tích thừa số nguyên tố và chọn các thừa số chung và riêng với số mũ lớn nhất.`
                        ];
                        solutionHtml = `Ta phân tích thừa số nguyên tố:<br>- $${aNum} = ${self.factorize(aNum)}$<br>- $${bNum} = ${self.factorize(bNum)}$<br>Lấy các thừa số nguyên tố chung và riêng với số mũ lớn nhất: $\\text{BCNN}(${aNum}, ${bNum}) = ${ans}$.`;
                    } else if (variant === 2) {
                        // BCNN của 3 số: 6, 8, 12 -> 24
                        const correctStr = `$24$`;
                        questionText = `Tìm bội chung nhỏ nhất của ba số: $\\text{BCNN}(6, 8, 12)$.`;
                        options = [correctStr, `$12$`, `$48$`, `$72$`];
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        const pair = pairs[self.randomInt(0, pairs.length - 1)];
                        const xe1 = pair[0];
                        const xe2 = pair[1];
                        const l = self.lcm(xe1, xe2);
                        
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
                            const randomH = startHour + self.randomInt(0, 3);
                            const randomM = [0, 15, 30, 45][self.randomInt(0, 3)];
                            const opt = `$${randomH}$ giờ $${randomM.toString().padStart(2, '0')}$ phút`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        const r = self.randomInt(1, 5);
                        const multiplier = 2;
                        const ans = baseLCM * multiplier + r;
                        const min = 100;
                        const max = 150;
                        
                        questionText = `Một số học sinh khi xếp hàng 10, hàng 12, hàng 15 đều dư ${r} em. Biết số học sinh đó trong khoảng từ $${min}$ đến $${max}$ em. Tính số học sinh đó.`;
                        options = [`$${ans}$ học sinh`, `$${ans - r}$ học sinh`, `$${ans + r}$ học sinh`, `$${ans - 2}$ học sinh`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomOpt = `$${self.randomInt(min, max)}$ học sinh`;
                            if (!options.includes(randomOpt)) options.push(randomOpt);
                        }
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        const correctStr = `$a = 18; b = 20$`;
                        questionText = `Tìm hai số tự nhiên $a$ và $b$ ($a < b$) biết rằng $\\text{BCNN}(a, b) = 180$, tích $a \\cdot b = 360$ và hiệu $b - a = 2$.`;
                        const ansStr = `$a = 18; b = 20$`;
                        options = [ansStr, `$a = 2; b = 180$`, `$a = 10; b = 36$`, `$a = 4; b = 90$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(ansStr);
                        hints = [
                            `Sử dụng công thức liên hệ giữa ƯCLN và BCNN của hai số: $a \\cdot b = \\text{ƯCLN}(a, b) \\cdot \\text{BCNN}(a, b)$.`,
                            `Tính $\\text{ƯCLN}(a, b) = 360 : 180 = 2$.`,
                            `Đưa về bài toán đặt $a = 2x, b = 2y$ với $\\text{ƯCLN}(x, y) = 1$ và $xy = 90$, kết hợp hiệu $b - a = 2$.`
                        ];
                        solutionHtml = `Ta áp dụng công thức: $a \\cdot b = \\text{ƯCLN}(a, b) \\cdot \\text{BCNN}(a, b)$.<br>Suy ra $\\text{ƯCLN}(a, b) = (a \\cdot b) : \\text{BCNN}(a, b) = 360 : 180 = 2$.<br>Đặt $a = 2x, b = 2y$ với $\\text{ƯCLN}(x, y) = 1$ và $x < y$.<br>Ta có $a \\cdot b = 4xy = 360 \\rightarrow xy = 90$.<br>Các cặp số $(x, y)$ nguyên tố cùng nhau có tích bằng 90 là: $(1; 90), (2; 45), (5; 18), (9; 10)$.<br>Các cặp số $(a, b)$ tương ứng là: $(2; 180), (4; 90), (10; 36), (18; 20)$.<br>Kết hợp thêm điều kiện hiệu $b - a = 2$, ta chọn được cặp duy nhất thỏa mãn là $a = 18, b = 20$.`;
                    }
                    tip = "Gọi ẩn số, đưa về bài toán bội chung bằng cách bớt đi phần dư hoặc cộng thêm phần thiếu. Sử dụng công thức tích để giải các bài toán ƯCLN và BCNN phối hợp.";
                }
                break;
            }
            default:
                return null;
        }

        if (!questionText) return null;

        if (!questionText) return null;
            return { type: "trac-nghiem", questionText, options, correctIndex, hints, solutionHtml, tip };
        }
    };
    if (typeof window !== 'undefined') window.g6_ch1_bai06 = Bai06UclnBcnn;
    if (typeof module !== 'undefined' && module.exports) module.exports = Bai06UclnBcnn;
})(typeof window !== 'undefined' ? window : global);
