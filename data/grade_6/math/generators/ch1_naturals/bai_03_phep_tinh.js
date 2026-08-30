/**
 * MICRO-GENERATOR: BÀI 3 — PHÉP TÍNH VÀ THỨ TỰ THỰC HIỆN PHÉP TÍNH
 */
(function(root) {
    'use strict';
    const Bai03PhepTinh = {
        generate(type, level, ctx) {
            const self = ctx || this;
            let questionText = "";
            let options = [];
            let correctIndex = 0;
            let hints = [];
            let solutionHtml = "";
            let tip = "";

            switch (type) {
            case "cong-tru-so-tu-nhien": {
                if (level === "co-ban") {
                    const a = self.randomInt(15, 30) * 10 - 2; 
                    const b = self.randomInt(5, 12) * 10 + 2; 
                    const c = self.randomInt(120, 250);
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
                    const a = self.randomInt(150, 250);
                    const b = self.randomInt(30, 80);
                    const c = self.randomInt(15, 25);
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
                    const d = self.randomInt(3, 5);
                    const start = self.randomInt(4, 7) * d;
                    const numTerms = self.randomInt(20, 25);
                    const end = start + (numTerms - 1) * d;
                    const correctVal = (start + end) * numTerms / 2;
                    questionText = `Tính nhanh tổng của dãy số cách đều sau: $S = ${start} + ${start + d} + ${start + 2*d} + ... + ${end}$`;
                    options = [`$${correctVal}$`, `$${correctVal - start}$`, `$${correctVal + end}$`, `$${correctVal + 100}$`];
                    self.shuffle(options);
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
                    const b = self.randomInt(7, 12);
                    const q = self.randomInt(6, 12);
                    const r = self.randomInt(1, b - 1);
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
                    const a = self.randomInt(25, 45);
                    const b = self.randomInt(12, 18);
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
            case "thu-tu-phep-tinh": {
                if (level === "co-ban") {
                    const a = self.randomInt(5, 15);
                    const b = self.randomInt(2, 5);
                    const c = self.randomInt(3, 6);
                    const d = self.randomInt(1, 8);
                    const correctVal = a + b * c - d;
                    const w1 = (a + b) * c - d;
                    const w2 = a + b * c + d;
                    const w3 = a + b + c - d;
                    questionText = `Tính giá trị của biểu thức: $M = ${a} + ${b} \\times ${c} - ${d}$`;
                    options = [`$${correctVal}$`, `$${w1}$`, `$${w2}$`, `$${w3}$`];
                    options = [...new Set(options)];
                    while (options.length < 4) {
                        const wrong = correctVal + self.randomInt(1, 6) * (Math.random() > 0.5 ? 1 : -1);
                        if (wrong > 0 && !options.includes(`$${wrong}$`)) options.push(`$${wrong}$`);
                    }
                    hints = [
                        `Trong biểu thức không có dấu ngoặc, ta thực hiện phép **nhân và chia** trước, rồi mới thực hiện phép **cộng và trừ** từ trái sang phải.`,
                        `Bước 1: Tính tích $${b} \\times ${c} = ${b * c}$. Bước 2: Tính $${a} + ${b * c} - ${d} = ${correctVal}$.`
                    ];
                    solutionHtml = `Áp dụng thứ tự thực hiện phép tính (nhân/chia trước, cộng/trừ sau):<br>$M = ${a} + ${b} \\times ${c} - ${d}$<br>$= ${a} + ${b * c} - ${d}$ (thực hiện phép nhân $${b} \\times ${c} = ${b * c}$)<br>$= ${a + b * c} - ${d}$ (cộng từ trái sang phải)<br>$= ${correctVal}$.`;
                    tip = "Quy tắc vàng: Lũy thừa → Nhân/Chia → Cộng/Trừ. Không tính từ trái sang phải khi có phép nhân/chia chen giữa!";
                } else if (level === "nang-cao") {
                    const a = self.randomInt(3, 6);
                    const b = self.randomInt(2, 4);
                    const c = self.randomInt(2, 4);
                    const d = self.randomInt(2, 8);
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
                        const wrong = correctVal + self.randomInt(2, 8) * (Math.random() > 0.5 ? 1 : -1);
                        if (wrong > 0 && !options.includes(`$${wrong}$`)) options.push(`$${wrong}$`);
                    }
                    hints = [
                        `Thực hiện theo thứ tự: tính **trong dấu ngoặc** trước, bên trong ngoặc thì tính **lũy thừa** trước, sau đó tính **nhân** ngoài ngoặc, cuối cùng tính **trừ**.`,
                        `Bước 1: $${b}^2 = ${bSq}$. Bước 2: ngoặc $(${a} + ${bSq}) = ${inner}$. Bước 3: nhân $${inner} \\times ${c} = ${inner * c}$.`
                    ];
                    solutionHtml = `$N = (${a} + ${b}^2) \\times ${c} - ${d}$<br>$= (${a} + ${bSq}) \\times ${c} - ${d}$ (tính lũy thừa $${b}^2 = ${bSq}$ trong ngoặc)<br>$= ${inner} \\times ${c} - ${d}$ (tính trong ngoặc tròn)<br>$= ${inner * c} - ${d}$ (thực hiện phép nhân)<br>$= ${correctVal}$ (thực hiện phép trừ).`;
                    tip = "Khi có dấu ngoặc: luôn tính trong ngoặc trước (bên trong ngoặc cũng theo thứ tự: lũy thừa → nhân/chia → cộng/trừ).";
                } else { // kho
                    const a = self.randomInt(4, 5);
                    const b = self.randomInt(1, 3);
                    const c = self.randomInt(1, 3);
                    const d = self.randomInt(2, 4);
                    const e = self.randomInt(1, 10);
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
                        const wrong = correctVal + self.randomInt(2, 7) * (Math.random() > 0.5 ? 1 : -1);
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
                default:
                    return null;
            }
            return { type: "trac-nghiem", questionText, options, correctIndex, hints, solutionHtml, tip };
        }
    };
    if (typeof window !== 'undefined') window.g6_ch1_bai03 = Bai03PhepTinh;
    if (typeof module !== 'undefined' && module.exports) module.exports = Bai03PhepTinh;
})(typeof window !== 'undefined' ? window : global);
