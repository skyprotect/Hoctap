/**
 * MICRO-GENERATOR: BÀI 4 — LŨY THỪA VỚI SỐ MŨ TỰ NHIÊN
 */
(function(root) {
    'use strict';
    const Bai04LuyThua = {
        generate(type, level, ctx) {
            const self = ctx || this;
            let questionText = "";
            let options = [];
            let correctIndex = 0;
            let hints = [];
            let solutionHtml = "";
            let tip = "";

            switch (type) {
            case "luy-thua": {
                if (level === "co-ban") {
                    const variant = self.randomInt(1, 4);
                    if (variant === 1) {
                        // Tính giá trị của lũy thừa
                        const base = self.randomInt(2, 5);
                        const exponent = self.randomInt(2, 4);
                        questionText = `Tính giá trị của lũy thừa sau: $A = ${base}^{${exponent}}$`;
                        const correctVal = Math.pow(base, exponent);
                        options = [`$${correctVal}$`, `$${base * exponent}$`, `$${correctVal + 2}$`, `$${base + exponent}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const wrong = correctVal + self.randomInt(1, 5) * (Math.random() > 0.5 ? 1 : -1);
                            if (wrong > 0 && !options.includes(`$${wrong}$`)) options.push(`$${wrong}$`);
                        }
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}$`);
                        hints = [
                            `Lũy thừa bậc $n$ của $a$ là tích của $n$ thừa số $a$ nhân với nhau.`,
                            `$${base}^{${exponent}} = ${new Array(exponent).fill(base).join(' \\cdot ')}$`
                        ];
                        solutionHtml = `Ta có $${base}^{${exponent}} = ${new Array(exponent).fill(base).join(' \\cdot ')} = ${correctVal}$.`;
                        tip = "Đừng nhầm lẫn lũy thừa $a^n$ với phép nhân $a \\cdot n$.";
                    } else if (variant === 2) {
                        // Nhân hai lũy thừa cùng cơ số
                        const base = self.randomInt(2, 5);
                        const m = self.randomInt(2, 4);
                        const n = self.randomInt(2, 3);
                        questionText = `Viết kết quả phép tính sau dưới dạng một lũy thừa: $C = ${base}^{${m}} \\cdot ${base}^{${n}}$`;
                        const correctExp = m + n;
                        options = [`$${base}^{${correctExp}}$`, `$${base}^{${m * n}}$`, `$${base + base}^{${correctExp}}$`, `$${base}^{${m - n}}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const wrong = correctExp + self.randomInt(1, 3);
                            const opt = `$${base}^{${wrong}}$`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${base}^{${correctExp}}$`);
                        hints = [
                            `Khi nhân hai lũy thừa cùng cơ số, ta giữ nguyên cơ số và cộng các số mũ.`,
                            `Công thức: $a^m \\cdot a^n = a^{m+n}$`
                        ];
                        solutionHtml = `Ta có: $${base}^{${m}} \\cdot ${base}^{${n}} = ${base}^{${m} + ${n}} = ${base}^{${correctExp}}$.`;
                        tip = "Cơ số giữ nguyên, số mũ đem cộng lại.";
                    } else if (variant === 3) {
                        // Chia hai lũy thừa cùng cơ số
                        const base = self.randomInt(2, 5);
                        const m = self.randomInt(4, 6);
                        const n = self.randomInt(2, 3);
                        questionText = `Viết kết quả phép tính sau dưới dạng một lũy thừa: $D = ${base}^{${m}} : ${base}^{${n}}$`;
                        const correctExp = m - n;
                        options = [`$${base}^{${correctExp}}$`, `$${base}^{${m / n}}$`, `$${base}^{${m + n}}$`, `$${base - 1}^{${correctExp}}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const wrong = Math.abs(correctExp + self.randomInt(1, 3));
                            const opt = `$${base}^{${wrong}}$`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${base}^{${correctExp}}$`);
                        hints = [
                            `Khi chia hai lũy thừa cùng cơ số (khác 0), ta giữ nguyên cơ số và trừ các số mũ.`,
                            `Công thức: $a^m : a^n = a^{m-n}$`
                        ];
                        solutionHtml = `Ta có: $${base}^{${m}} : ${base}^{${n}} = ${base}^{${m} - ${n}} = ${base}^{${correctExp}}$.`;
                        tip = "Cơ số giữ nguyên, số mũ lấy số bị chia trừ số chia.";
                    } else {
                        // Viết tích dưới dạng lũy thừa
                        const base = self.randomInt(2, 9);
                        const count = self.randomInt(3, 5);
                        const arr = new Array(count).fill(base);
                        questionText = `Viết tích sau dưới dạng một lũy thừa: $E = ${arr.join(' \\cdot ')}$`;
                        options = [`$${base}^{${count}}$`, `$${base * count}$`, `$${count}^{${base}}$`, `$${base}^{${count - 1}}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const wrong = count + self.randomInt(1, 3);
                            const opt = `$${base}^{${wrong}}$`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${base}^{${count}}$`);
                        hints = [
                            `Lũy thừa bậc $n$ của $a$ là tích của $n$ thừa số $a$ nhân với nhau.`,
                            `Ở đây ta có tích của $${count}$ thừa số $${base}$.`
                        ];
                        solutionHtml = `Vì có $${count}$ thừa số $${base}$ nhân với nhau nên viết dưới dạng lũy thừa là: $${base}^{${count}}$.`;
                        tip = "Đếm số lượng thừa số giống nhau để xác định số mũ.";
                    }
                } else if (level === "nang-cao") {
                    const variant = self.randomInt(1, 3);
                    if (variant === 1) {
                        // Rút gọn biểu thức nâng cao
                        const base = self.randomInt(2, 3);
                        const m = self.randomInt(4, 6);
                        const n = self.randomInt(2, 3);
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
                            const wrongExp = correctExponent + self.randomInt(1, 4) * (Math.random() > 0.5 ? 1 : -1);
                            if (wrongExp > 0 && wrongExp !== correctExponent) {
                                const opt = `$${base}^{${wrongExp}}$`;
                                if (!options.includes(opt)) options.push(opt);
                            }
                        }
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${base}^{${correctExponent}}$`);
                        hints = [
                            `Khi nhân hai lũy thừa cùng cơ số, ta cộng số mũ: $a^m \\cdot a^n = a^{m+n}$.`,
                            `Khi chia hai lũy thừa cùng cơ số, ta trừ số mũ: $a^m : a^n = a^{m-n}$.`
                        ];
                        solutionHtml = `Ta có: $B = ${base}^{${m} + ${n} - 2} = ${base}^{${correctExponent}}$.`;
                        tip = "Khi nhân thì cộng mũ, khi chia thì trừ mũ, cơ số giữ nguyên.";
                    } else if (variant === 2) {
                        // Tìm x trong biểu thức lũy thừa
                        const subVar = self.randomInt(1, 3);
                        if (subVar === 1) {
                            // a^x = b
                            const base = self.randomInt(2, 4);
                            const correctX = self.randomInt(3, 5);
                            const val = Math.pow(base, correctX);
                            questionText = `Tìm số tự nhiên $x$ biết: $${base}^x = ${val}$`;
                            options = [`$x = ${correctX}$`, `$x = ${correctX - 1}$`, `$x = ${correctX + 1}$`, `$x = ${val / base}$`];
                            options = [...new Set(options)];
                            while (options.length < 4) {
                                const wrong = correctX + self.randomInt(2, 5);
                                if (!options.includes(`$x = ${wrong}$`)) options.push(`$x = ${wrong}$`);
                            }
                            self.shuffle(options);
                            correctIndex = options.indexOf(`$x = ${correctX}$`);
                            hints = [
                                `Hãy viết số $${val}$ thành lũy thừa cơ số $${base}$.`,
                                `$${val} = ${base}^{\\text{?}}$`
                            ];
                            solutionHtml = `Ta phân tích: $${val} = ${base}^{${correctX}}$. Do đó, phương trình trở thành $${base}^x = ${base}^{${correctX}}$, suy ra $x = ${correctX}$.`;
                            tip = "Đưa hai vế về cùng cơ số rồi cho hai số mũ bằng nhau.";
                        } else if (subVar === 2) {
                            // x^a = b
                            const correctX = self.randomInt(2, 5);
                            const exp = self.randomInt(2, 3);
                            const val = Math.pow(correctX, exp);
                            questionText = `Tìm số tự nhiên $x$ biết: $x^{${exp}} = ${val}$`;
                            options = [`$x = ${correctX}$`, `$x = ${correctX - 1}$`, `$x = ${correctX + 1}$`, `$x = ${val / exp}$`];
                            options = [...new Set(options)];
                            while (options.length < 4) {
                                const wrong = correctX + self.randomInt(2, 5);
                                if (!options.includes(`$x = ${wrong}$`)) options.push(`$x = ${wrong}$`);
                            }
                            self.shuffle(options);
                            correctIndex = options.indexOf(`$x = ${correctX}$`);
                            hints = [
                                `Hãy tìm một số tự nhiên nâng lên lũy thừa bậc $${exp}$ bằng $${val}$.`,
                                `Nhẩm: $2^{${exp}} = ${Math.pow(2, exp)}$, $3^{${exp}} = ${Math.pow(3, exp)}$, ...`
                            ];
                            solutionHtml = `Ta phân tích: $${val} = ${correctX}^{${exp}}$. Do đó, $x^{${exp}} = ${correctX}^{${exp}}$, suy ra $x = ${correctX}$.`;
                            tip = "Đưa hai vế về cùng số mũ rồi cho hai cơ số bằng nhau.";
                        } else {
                            // a^(x-1) = b
                            const base = self.randomInt(2, 3);
                            const correctX = self.randomInt(3, 5);
                            const val = Math.pow(base, correctX - 1);
                            questionText = `Tìm số tự nhiên $x$ biết: $${base}^{x-1} = ${val}$`;
                            options = [`$x = ${correctX}$`, `$x = ${correctX - 1}$`, `$x = ${correctX - 2}$`, `$x = ${correctX + 1}$`];
                            options = [...new Set(options)];
                            while (options.length < 4) {
                                const wrong = correctX + self.randomInt(2, 4);
                                if (!options.includes(`$x = ${wrong}$`)) options.push(`$x = ${wrong}$`);
                            }
                            self.shuffle(options);
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
                        const base = self.randomInt(2, 3);
                        const m = self.randomInt(2, 3);
                        const n = self.randomInt(3, 4);
                        questionText = `Rút gọn biểu thức sau: $F = (${base}^{${m}})^{${n}}$`;
                        const correctExp = m * n;
                        options = [`$${base}^{${correctExp}}$`, `$${base}^{${m + n}}$`, `$${base}^{${Math.pow(m, n)}}$`, `$${base * m}^{${n}}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const wrong = correctExp + self.randomInt(1, 4);
                            const opt = `$${base}^{${wrong}}$`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${base}^{${correctExp}}$`);
                        hints = [
                            `Khi lũy thừa một lũy thừa, ta giữ nguyên cơ số và nhân các số mũ.`,
                            `Công thức: $(a^m)^n = a^{m \\cdot n}$`
                        ];
                        solutionHtml = `Ta có: $(${base}^{${m}})^{${n}} = ${base}^{${m} \\cdot ${n}} = ${base}^{${correctExp}}$.`;
                        tip = "Lũy thừa của lũy thừa thì ta nhân số mũ với nhau.";
                    }
                } else { // kho
                    const variant = self.randomInt(1, 3);
                    if (variant === 1) {
                        // Chữ số tận cùng
                        const bases = [2, 3, 7, 8];
                        const base = bases[self.randomInt(0, bases.length - 1)];
                        const year = 2024 + self.randomInt(0, 3);
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
                            const randomDigit = self.randomInt(0, 9);
                            const opt = `$${randomDigit}$`;
                            if (!options.includes(opt)) options.push(opt);
                        }
                        self.shuffle(options);
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
                        const base = self.randomInt(2, 3);
                        const maxExp = self.randomInt(4, 5);
                        questionText = `Tính tổng của dãy số sau: $S = 1 + ${base} + ${base}^2 + ... + ${base}^{${maxExp}}$`;
                        const correctVal = Math.round((Math.pow(base, maxExp + 1) - 1) / (base - 1));
                        options = [`$${correctVal}$`, `$${Math.pow(base, maxExp)}$`, `$${correctVal + 5}$`, `$${correctVal - 10}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const wrong = correctVal + self.randomInt(1, 15) * (Math.random() > 0.5 ? 1 : -1);
                            if (wrong > 0 && !options.includes(`$${wrong}$`)) options.push(`$${wrong}$`);
                        }
                        self.shuffle(options);
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
                default:
                    return null;
            }
            return { type: "trac-nghiem", questionText, options, correctIndex, hints, solutionHtml, tip };
        }
    };
    if (typeof window !== 'undefined') window.g6_ch1_bai04 = Bai04LuyThua;
    if (typeof module !== 'undefined' && module.exports) module.exports = Bai04LuyThua;
})(typeof window !== 'undefined' ? window : global);
