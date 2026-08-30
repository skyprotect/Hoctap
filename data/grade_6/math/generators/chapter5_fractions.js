/**
 * GRADE 6 MATH - CHAPTER 5: PHÂN SỐ, SỐ THẬP PHÂN & TỈ SỐ %
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
            case "phan-so-bang-nhau": {
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = self.randomInt(2, 7);
                        const b = self.randomInt(8, 12);
                        const m = self.randomInt(2, 5);
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
                        const a = self.randomInt(2, 5);
                        const b = self.randomInt(6, 9);
                        const k = self.randomInt(2, 4);
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
                        const x = self.randomInt(3, 8);
                        const y = self.randomInt(-12, -5);
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
                        const xVal = self.randomInt(2, 5);
                        const a = xVal + 1;
                        const b = self.randomInt(3, 5);
                        const k = self.randomInt(3, 5);
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
                        const a = self.randomInt(2, 5);
                        const b = a + self.randomInt(1, 3);
                        const sum = self.randomInt(4, 8) * (a + b);
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
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = self.randomInt(1, 5);
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
                        const a = self.randomInt(2, 5);
                        const b = self.randomInt(6, 8);
                        const c = b + self.randomInt(1, 3);
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
                        const n = self.randomInt(95, 98);
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
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = self.randomInt(1, 4);
                        const b = 5;
                        const c = self.randomInt(1, 3);
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
                        const a = self.randomInt(1, 3);
                        const b = 7;
                        const c = self.randomInt(4, 6);
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
                        const n = self.randomInt(8, 12);
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
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = self.randomInt(2, 4);
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
                        const a = self.randomInt(3, 5);
                        const b = self.randomInt(6, 9);
                        const c = -self.randomInt(2, 4);
                        // a/b * c. Ví dụ 3/8 * (-4) = -12/8 = -3/2
                        const num = a * c;
                        const common = self.gcd(Math.abs(num), b);
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
                        const a = self.randomInt(2, 4);
                        const b = self.randomInt(5, 7);
                        const c = self.randomInt(3, 5);
                        // x : a/b = c -> x = c * a/b
                        const num = c * a;
                        const common = self.gcd(num, b);
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
                        const baseNum = self.randomInt(3, 6);
                        const baseDen = self.randomInt(7, 10);
                        const n1 = self.randomInt(2, 4);
                        const n2 = self.randomInt(5, 8);
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
                        const n = self.randomInt(25, 35);
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
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const rateDen = self.randomInt(5, 8);
                        let rateNum = self.randomInt(2, rateDen - 1);
                        while (self.gcd(rateNum, rateDen) !== 1) {
                            rateNum = self.randomInt(2, rateDen - 1);
                        }
                        const total = rateDen * self.randomInt(5, 8);
                        const correctVal = (total * rateNum) / rateDen;
                        
                        questionText = `Lớp 6A có $${total}$ học sinh, trong đó có $\\frac{${rateNum}}{${rateDen}}$ số học sinh là học sinh nữ. Tính số học sinh nữ của lớp 6A.`;
                        options = [`$${correctVal}$ học sinh`, `$${total - correctVal}$ học sinh`, `$${correctVal + 3}$ học sinh`, `$${correctVal - 2}$ học sinh`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomOpt = `$${self.randomInt(10, total - 5)}$ học sinh`;
                            if (!options.includes(randomOpt)) options.push(randomOpt);
                        }
                        self.shuffle(options);
                        
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
                        self.shuffle(options);
                        
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
                        const rateDen = self.randomInt(3, 6);
                        let rateNum = self.randomInt(2, rateDen - 1);
                        while (self.gcd(rateNum, rateDen) !== 1) {
                            rateNum = self.randomInt(2, rateDen - 1);
                        }
                        const correctVal = rateDen * self.randomInt(4, 8);
                        const val = (correctVal * rateNum) / rateDen;
                        
                        questionText = `Tìm một số biết $\\frac{${rateNum}}{${rateDen}}$ của số đó bằng $${val}$.`;
                        options = [`$${correctVal}$`, `$${correctVal + 6}$`, `$${correctVal - 4}$`, `$${val}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomOpt = `$${self.randomInt(10, 50)}$`;
                            if (!options.includes(randomOpt)) options.push(randomOpt);
                        }
                        self.shuffle(options);
                        
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
                        self.shuffle(options);
                        
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
                        const config = self.randomInt(0, 1);
                        let n, p, q, r, T, solutionSteps;
                        
                        if (config === 0) {
                            n = 3; p = 3; q = 4; // còn lại 1/6
                            r = 10000 * self.randomInt(1, 5);
                            T = r * 6;
                            solutionSteps = `Sau ngày thứ nhất, phân số chỉ số tiền còn lại là:<br>$1 - \\frac{1}{3} = \\frac{2}{3}$ (số tiền ban đầu).<br>Phân số chỉ số tiền mua ngày thứ hai là:<br>$\\frac{3}{4} \\cdot \\frac{2}{3} = \\frac{1}{2}$ (số tiền ban đầu).<br>Phân số chỉ số tiền còn lại sau hai ngày là:<br>$1 - \\left( \\frac{1}{3} + \\frac{1}{2} \\right) = \\frac{1}{6}$ (số tiền ban đầu).<br>Số tiền ban đầu là: $${r.toLocaleString('vi-VN')} : \\frac{1}{6} = ${T.toLocaleString('vi-VN')}$ đồng.`;
                        } else {
                            n = 4; p = 2; q = 3; // còn lại 1/4
                            r = 10000 * self.randomInt(1, 5);
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
                        self.shuffle(options);
                        
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
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const isNeg = Math.random() > 0.5;
                        const num = self.randomInt(11, 99) * (isNeg ? -1 : 1);
                        const dens = [10, 100, 1000];
                        const den = dens[self.randomInt(0, 2)];
                        const ansVal = (num / den).toString().replace('.', ',');
                        
                        questionText = `Viết phân số thập phân $\\frac{${num}}{${den}}$ dưới dạng số thập phân.`;
                        options = [`$${ansVal}$`, `$${(num / (den === 10 ? 100 : 10)).toString().replace('.', ',')}$`, `$${(-num / den).toString().replace('.', ',')}$`, `$${(num * 10 / den).toString().replace('.', ',')}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomVal = (self.randomInt(1, 99) / 100 * (isNeg ? -1 : 1)).toFixed(2).replace('.', ',');
                            const opt = `$${randomVal}$`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        self.shuffle(options);
                        
                        hints = [
                            `Mẫu số là $${den}$ có bao nhiêu chữ số 0 thì phần thập phân sẽ có bấy nhiêu chữ số sau dấu phẩy.`,
                            `Nếu phân số là số âm, số thập phân cũng mang dấu âm.`
                        ];
                        solutionHtml = `Ta thực hiện phép chia tử số cho mẫu số:<br>$${num} : ${den} = ${ansVal}$.`;
                    } else {
                        // Viết số thập phân dưới dạng phân số tối giản
                        const val = [0.75, -1.25, 0.4, -0.6][self.randomInt(0, 3)];
                        const ansStr = val === 0.75 ? '\\frac{3}{4}' : (val === -1.25 ? '\\frac{-5}{4}' : (val === 0.4 ? '\\frac{2}{5}' : '\\frac{-3}{5}'));
                        const valStr = val.toString().replace('.', ',');
                        questionText = `Viết số thập phân $${valStr}$ dưới dạng phân số tối giản.`;
                        options = [`$${ansStr}$`, `$${ansStr.replace('-', '')}$`, `$${ansStr.replace('3', '6').replace('4', '8')}$`, `$${ansStr.replace('2', '4').replace('5', '10')}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomOpt = `$\\frac{${self.randomInt(1, 9)}}{${self.randomInt(2, 9)}}$`;
                            if (!options.includes(randomOpt)) options.push(randomOpt);
                        }
                        self.shuffle(options);
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
                        const integerPart = self.randomInt(1, 40);
                        const decimalPart = self.randomInt(10, 99);
                        const valStr = `${isNeg ? '-' : ''}${integerPart},${decimalPart}`;
                        const oppStr = `${isNeg ? '' : '-'}${integerPart},${decimalPart}`;
                        
                        questionText = `Số đối của số thập phân $${valStr}$ là số nào?`;
                        options = [`$${oppStr}$`, `$${valStr}$`, `$${valStr.replace(',', ',0')}$`, `$${oppStr.replace(',', ',0')}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomVal = `${self.randomInt(1, 40)},${self.randomInt(10, 99)}`;
                            const opt = `$${randomVal}$`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        self.shuffle(options);
                        
                        hints = [
                            `Hai số đối nhau có tổng bằng 0 và nằm đối xứng qua điểm 0 trên trục số.`,
                            `Để tìm số đối của một số thập phân, ta chỉ cần đổi dấu của số đó.`
                        ];
                        solutionHtml = `Số đối của số thập phân $${valStr}$ là số $${oppStr}$ vì tổng của chúng bằng 0.`;
                    } else {
                        // Xác định hàng của chữ số trong số thập phân
                        const a = self.randomInt(10, 99);
                        const b = self.randomInt(1, 9);
                        const c = self.randomInt(1, 9);
                        const d = self.randomInt(1, 9);
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
                        const aInt = self.randomInt(2, 5);
                        const dec1 = self.randomInt(10, 30);
                        const dec2 = self.randomInt(40, 60);
                        const dec3 = self.randomInt(70, 90);
                        
                        const labels = ['A', 'B', 'C'];
                        self.shuffle(labels);
                        
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
                        self.shuffle(options);
                        
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
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = self.randomInt(51, 209) / 10;
                        const b = self.randomInt(211, 999) / 100;
                        const correctVal = (a + b).toFixed(2);
                        
                        const aStr = a.toString().replace('.', ',');
                        const bStr = b.toString().replace('.', ',');
                        const ansStr = correctVal.replace('.', ',');
                        
                        questionText = `Tính tổng: $S = ${aStr} + ${bStr}$.`;
                        options = [`$${ansStr}$`, `$${(a + b + 0.1).toFixed(2).replace('.', ',')}$`, `$${(a + b - 0.05).toFixed(2).replace('.', ',')}$`, `$${(a + b + 1.1).toFixed(2).replace('.', ',')}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomVal = (self.randomInt(100, 300) / 10).toFixed(2).replace('.', ',');
                            if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                        }
                        self.shuffle(options);
                        
                        hints = [
                            `Đặt phép tính thẳng hàng dấu phẩy: viết $${aStr}$ thành $${a.toFixed(2).replace('.', ',')}$ để có cùng số chữ số sau dấu phẩy.`,
                            `Cộng phần thập phân với nhau và cộng phần nguyên với nhau, nhớ dấu phẩy viết thẳng hàng.`
                        ];
                        solutionHtml = `Đặt tính thẳng hàng dấu phẩy:<br>&nbsp;&nbsp;${a.toFixed(2).replace('.', ',')}<br>+&nbsp;&nbsp;${bStr}<br>----------<br>&nbsp;&nbsp;${ansStr}`;
                    } else {
                        // Tính hiệu có số âm: S = -4,5 - 2,8
                        const a = self.randomInt(31, 79) / 10;
                        const b = self.randomInt(15, 29) / 10;
                        const correctVal = (-a - b).toFixed(1);
                        const aStr = `-${a.toString().replace('.', ',')}`;
                        const bStr = b.toString().replace('.', ',');
                        const ansStr = correctVal.replace('.', ',');
                        questionText = `Tính kết quả của phép tính: $S = ${aStr} - ${bStr}$.`;
                        options = [`$${ansStr}$`, `$${(-a + b).toFixed(1).replace('.', ',')}$`, `$${(a + b).toFixed(1).replace('.', ',')}$`, `$${(parseFloat(correctVal) - 1).toFixed(1).replace('.', ',')}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomVal = (-self.randomInt(50, 150) / 10).toFixed(1).replace('.', ',');
                            if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                        }
                        self.shuffle(options);
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
                        const a = aList[self.randomInt(0, aList.length - 1)];
                        const b = bList[self.randomInt(0, bList.length - 1)];
                        const correctVal = (a * b).toFixed(2);
                        
                        const aStr = a.toString().replace('.', ',');
                        const bStr = b.toString().replace('.', ',');
                        const ansStr = parseFloat(correctVal).toString().replace('.', ',');
                        
                        questionText = `Tính tích: $P = ${aStr} \\cdot (${bStr})$.`;
                        options = [`$${ansStr}$`, `$${Math.abs(parseFloat(correctVal)).toString().replace('.', ',')}$`, `$${(parseFloat(correctVal) - 0.5).toFixed(1).replace('.', ',')}$`, `$${(parseFloat(correctVal) + 1.2).toFixed(1).replace('.', ',')}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomVal = (self.randomInt(-20, -2) / 2).toString().replace('.', ',');
                            if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                        }
                        self.shuffle(options);
                        
                        hints = [
                            `Nhân hai số trái dấu: kết quả chắc chắn sẽ mang dấu âm.`,
                            `Thực hiện phép nhân hai số thập phân dương rồi đặt dấu trừ trước kết quả.`
                        ];
                        solutionHtml = `Vì hai số trái dấu nên tích mang dấu âm. Thực hiện nhân phần số dương:<br>$${aStr} \\cdot ${bStr.replace('-', '')} = ${Math.abs(parseFloat(correctVal)).toString().replace('.', ',')}$.<br>Vậy tích là $${ansStr}$.`;
                    } else {
                        // Chia hai số thập phân: K = -7,5 : 2,5 = -3
                        const a = [4.5, 7.5, 9.6, 1.25][self.randomInt(0, 3)];
                        const b = [1.5, 2.5, 1.2, 0.5][self.randomInt(0, 3)];
                        const correctVal = (-a / b).toString().replace('.', ',');
                        const aStr = `-${a.toString().replace('.', ',')}`;
                        const bStr = b.toString().replace('.', ',');
                        questionText = `Tính thương: $K = ${aStr} : ${bStr}$.`;
                        options = [`$${correctVal}$`, `$${correctVal.replace('-', '')}$`, `$${(-a * b).toString().replace('.', ',')}$`, `$${(parseFloat(correctVal.replace(',', '.')) - 1).toString().replace('.', ',')}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomVal = (-self.randomInt(1, 10)).toString();
                            if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                        }
                        self.shuffle(options);
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
                        const a = aList[self.randomInt(0, aList.length - 1)];
                        const sum = a === 1.25 ? 100 : 10;
                        const b = self.randomInt(21, 79) / 10;
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
                            const randomVal = self.randomInt(20, 200).toString();
                            if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                        }
                        self.shuffle(options);
                        
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
                        self.shuffle(options);
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
                    const integerPart = self.randomInt(10, 99);
                    const dec1 = self.randomInt(1, 9);
                    const dec2 = self.randomInt(1, 9);
                    const dec3 = self.randomInt(1, 9);
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
                        const randomVal = `${integerPart},${self.randomInt(0, 9)}`;
                        if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                    }
                    self.shuffle(options);
                    
                    hints = [
                        `Chữ số hàng phần mười của số $${numStr}$ là chữ số $${dec1}$.`,
                        `Nhìn sang chữ số bên phải ngay sát nó là chữ số $${dec2}$ (ở hàng phần trăm) để quyết định làm tròn lên hay làm tròn xuống.`
                    ];
                    solutionHtml = `Số $${numStr}$ có chữ số hàng phần mười là $${dec1}$. Chữ số đầu tiên bị bỏ đi bên phải là $${dec2}$.<br>- Nếu $${dec2} \\ge 5$, ta tăng chữ số hàng phần mười thêm 1.<br>- Nếu $${dec2} < 5$, ta giữ nguyên chữ số hàng phần mười.<br>Vậy kết quả làm tròn là $${ansStr}$.`;
                    tip = "Nếu chữ số đầu tiên bỏ đi nhỏ hơn 5 thì giữ nguyên, lớn hơn hoặc bằng 5 thì cộng thêm 1 vào hàng làm tròn.";
                } else if (level === "nang-cao") {
                    const hục = self.randomInt(1, 9);
                    const đv = self.randomInt(1, 9);
                    const dec = self.randomInt(10, 99);
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
                        const randomVal = `${self.randomInt(10, 20) * 10}`;
                        if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                    }
                    self.shuffle(options);
                    
                    hints = [
                        `Chữ số hàng chục của số $${numStr}$ là $${hục}$.`,
                        `Chữ số ngay bên phải nó (hàng đơn vị) là $${đv}$. Vì $${đv} ${đv >= 5 ? '\\ge 5' : '< 5'}$, hãy quyết định làm tròn.`
                    ];
                    solutionHtml = `Số $${numStr}$ có chữ số hàng chục là $${hục}$. Chữ số hàng đơn vị bên phải nó là $${đv}$.<br>Vì $${đv} ${đv >= 5 ? '\\ge 5' : '< 5'}$, ta thực hiện làm tròn ${đv >= 5 ? 'lên' : 'xuống'}.<br>Kết quả thu được là $${ans}$.`;
                    tip = "Khi làm tròn đến hàng chục, hàng trăm của số nguyên, hãy nhớ thay các chữ số bị bỏ bằng số 0.";
                } else { // kho
                    // Ước lượng M = a * b
                    const aInt = self.randomInt(5, 12);
                    const decA = self.randomInt(81, 99); // làm tròn lên
                    const bInt = self.randomInt(3, 8);
                    const decB = self.randomInt(11, 19); // làm tròn xuống
                    
                    const a = parseFloat(`${aInt}.${decA}`);
                    const b = parseFloat(`${bInt}.${decB}`);
                    
                    const aStr = a.toString().replace('.', ',');
                    const bStr = b.toString().replace('.', ',');
                    const correctVal = (aInt + 1) * bInt;
                    
                    questionText = `Ước lượng kết quả của phép tính sau bằng cách làm tròn các số đến hàng đơn vị: $M = ${aStr} \\cdot ${bStr}$.`;
                    options = [`$${correctVal}$`, `$${aInt * bInt}$`, `$${(aInt + 1) * (bInt + 1)}$`, `$${aInt * (bInt + 1)}$`];
                    options = [...new Set(options)];
                    while (options.length < 4) {
                        const randomVal = self.randomInt(15, 100).toString();
                        if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                    }
                    self.shuffle(options);
                    
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
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const bList = [20, 25, 40, 50, 80];
                    const b = bList[self.randomInt(0, bList.length - 1)];
                    let a = self.randomInt(1, b - 1);
                    while ((a * 100) % b !== 0) {
                        a = self.randomInt(1, b - 1);
                    }
                    const ans = (a * 100) / b;
                    
                    questionText = `Tính tỉ số phần trăm của hai số $${a}$ và $${b}$.`;
                    options = [`$${ans}\\%$`, `$${(a / b).toFixed(2).replace('.', ',')}\\%$`, `$${ans + 10}\\%$`, `$${ans - 5}\\%$`];
                    options = [...new Set(options)];
                    while (options.length < 4) {
                        const randomVal = `${self.randomInt(5, 95)}\\%`;
                        if (!options.includes(randomVal)) options.push(randomVal);
                    }
                    self.shuffle(options);
                    
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
                        const a = 50 * self.randomInt(2, 8);
                        const pList = [5, 10, 15, 20, 25, 30];
                        const p = pList[self.randomInt(0, pList.length - 1)];
                        const correctVal = (a * p) / 100;
                        
                        questionText = `Tìm giá trị $${p}\\%$ của số $${a}$.`;
                        options = [`$${correctVal}$`, `$${correctVal + 10}$`, `$${correctVal - 5}$`, `$${a * 100 / p}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomVal = self.randomInt(5, a / 2).toString();
                            if (!options.includes(`$${randomVal}$`)) options.push(`$${randomVal}$`);
                        }
                        self.shuffle(options);
                        
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
                        const price = prices[self.randomInt(0, prices.length - 1)];
                        const p1 = [10, 20][self.randomInt(0, 1)];
                        const p2 = [5, 10][self.randomInt(0, 1)];
                        
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
                            const randomVal = `${self.randomInt(300, 700) * 1000}`;
                            if (!options.includes(`$${parseInt(randomVal).toLocaleString('vi-VN')}$ đồng`)) {
                                options.push(`$${parseInt(randomVal).toLocaleString('vi-VN')}$ đồng`);
                            }
                        }
                        self.shuffle(options);
                        
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
    if (typeof root !== 'undefined') root.chapter5_fractions = ChapterModule;
})(typeof window !== 'undefined' ? window : global);
