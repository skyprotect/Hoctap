/**
 * GRADE 6 MATH - CHAPTER 3: HÌNH HỌC TRỰC QUAN & ĐỐI XỨNG
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
            case "hinh-hoc-chuong-4": {
                const variant = self.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        questionText = `Đặc điểm hình học nào dưới đây thuộc về **tam giác đều**?`;
                        options = [
                            `Có 3 cạnh bằng nhau và 3 góc bằng nhau.`,
                            `Có 3 cạnh bằng nhau và 1 góc vuông.`,
                            `Có 2 cạnh bằng nhau và 2 góc kề đáy bằng nhau.`,
                            `Có 3 cạnh khác nhau và 3 góc bằng nhau.`
                        ];
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        const p = self.randomInt(4, 10) * 3;
                        questionText = `Một hình tam giác đều có chu vi bằng $${p}\\text{ cm}$. Độ dài mỗi cạnh của hình tam giác đều đó là bao nhiêu?`;
                        const correctVal = p / 3;
                        options = [`$${correctVal}\\text{ cm}$`, `$${correctVal * 2}\\text{ cm}$`, `$${correctVal - 1}\\text{ cm}$`, `$3\\text{ cm}$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}\\text{ cm}$`);
                        hints = [
                            `Chu vi tam giác đều bằng tổng độ dài 3 cạnh.`,
                            `Vì 3 cạnh bằng nhau nên độ dài 1 cạnh bằng Chu vi chia cho 3.`
                        ];
                        solutionHtml = `Cạnh của tam giác đều là: $${p} : 3 = ${correctVal}\\text{ cm}$.`;
                    } else if (variant === 2) {
                        const s = [16, 25, 36, 64][self.randomInt(0, 3)];
                        const edge = Math.sqrt(s);
                        const p = 4 * edge;
                        questionText = `Một miếng bìa hình vuông có diện tích bằng $${s}\\text{ cm}^2$. Chu vi của miếng bìa hình vuông đó là bao nhiêu?`;
                        options = [`$${p}\\text{ cm}$`, `$${edge}\\text{ cm}$`, `$${s * 2}\\text{ cm}$`, `$${p + 4}\\text{ cm}$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${p}\\text{ cm}$`);
                        hints = [
                            `Tính độ dài cạnh hình vuông từ diện tích: $cạnh = \\sqrt{diện\\_tích}$.`,
                            `Tính chu vi hình vuông từ độ dài cạnh vừa tìm được: $Chu\\_vi = 4 \\cdot cạnh$.`
                        ];
                        solutionHtml = `Ta có diện tích hình vuông là $S = cạnh \\cdot cạnh = ${s}\\text{ cm}^2 \\rightarrow cạnh = ${edge}\\text{ cm}$.<br>Chu vi của hình vuông là: $C = 4 \\cdot cạnh = 4 \\cdot ${edge} = ${p}\\text{ cm}$.`;
                    } else {
                        const edge = self.randomInt(4, 10);
                        const p = 6 * edge;
                        questionText = `Một hình lục giác đều có độ dài cạnh bằng $${edge}\\text{ cm}$. Chu vi của hình lục giác đều đó là bao nhiêu?`;
                        options = [`$${p}\\text{ cm}$`, `$${edge * 3}\\text{ cm}$`, `$${edge * 4}\\text{ cm}$`, `$${edge * 5}\\text{ cm}$`];
                        self.shuffle(options);
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
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$9$ đường chéo`);
                        hints = [
                            `Lục giác đều có 6 đỉnh. Nối các đỉnh không kề nhau ta được các đường chéo.`,
                            `Đường chéo chính đi qua tâm (có 3 đường). Đường chéo phụ không đi qua tâm (có 6 đường).`
                        ];
                        solutionHtml = `Lục giác đều có 3 đường chéo chính nối các đỉnh đối diện và 6 đường chéo phụ nối các đỉnh cách nhau một đỉnh. Tổng số đường chéo là $3 + 6 = 9$ đường chéo.`;
                    } else if (variant === 2) {
                        const edge = self.randomInt(10, 20);
                        const p = 3 * edge;
                        questionText = `Một chiếc bàn hình lục giác đều được ghép khít từ 6 mặt bàn hình tam giác đều bằng nhau. Biết chu vi của một mặt bàn tam giác đều là $${p}\\text{ cm}$. Chu vi của mặt bàn hình lục giác đều lớn là bao nhiêu?`;
                        const correctVal = 6 * edge;
                        options = [`$${correctVal}\\text{ cm}$`, `$${p * 2}\\text{ cm}$`, `$${correctVal - edge}\\text{ cm}$`, `$${correctVal + edge}\\text{ cm}$`];
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                const variant = self.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        questionText = `Tính chất nổi bật về đường chéo của **hình thoi** là gì?`;
                        options = [
                            `Hai đường chéo vuông góc với nhau tại trung điểm của mỗi đường.`,
                            `Hai đường chéo bằng nhau và song song với nhau.`,
                            `Hai đường chéo song song và vuông góc với nhau.`,
                            `Hai đường chéo bằng nhau và vuông góc với nhau.`
                        ];
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        const a = self.randomInt(4, 6);
                        const b = a + self.randomInt(3, 5);
                        const c = self.randomInt(4, 6);
                        questionText = `Cho hình thang cân $ABCD$ có đáy nhỏ $AB = ${a}\\text{ cm}$, đáy lớn $CD = ${b}\\text{ cm}$, cạnh bên $AD = ${c}\\text{ cm}$. Tính chu vi của hình thang cân này.`;
                        const correctVal = a + b + 2 * c;
                        options = [`$${correctVal}\\text{ cm}$`, `$${a + b + c}\\text{ cm}$`, `$${correctVal - c}\\text{ cm}$`, `$${a * 2 + b + c}\\text{ cm}$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${correctVal}\\text{ cm}$`);
                        hints = [
                            `Hình thang cân có hai cạnh bên bằng nhau, tức là $BC = AD = ${c}\\text{ cm}$.`,
                            `Chu vi hình thang bằng tổng độ dài 4 cạnh: $AB + CD + AD + BC$.`
                        ];
                        solutionHtml = `Vì $ABCD$ là hình thang cân nên hai cạnh bên bằng nhau: $BC = AD = ${c}\\text{ cm}$.<br>Chu vi của hình thang là: $C = AB + CD + AD + BC = ${a} + ${b} + ${c} + ${c} = ${correctVal}\\text{ cm}$.`;
                    } else if (variant === 2) {
                        const a = self.randomInt(5, 12);
                        const b = a + self.randomInt(3, 6);
                        const p = 2 * (a + b);
                        questionText = `Cho hình bình hành có độ dài hai cạnh kề lần lượt là $${a}\\text{ cm}$ và $${b}\\text{ cm}$. Chu vi của hình bình hành đó là bao nhiêu?`;
                        options = [`$${p}\\text{ cm}$`, `$${a + b}\\text{ cm}$`, `$${2 * a + b}\\text{ cm}$`, `$${p * 2}\\text{ cm}$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${p}\\text{ cm}$`);
                        hints = [
                            `Hình bình hành có các cạnh đối bằng nhau.`,
                            `Chu vi hình bình hành tương tự như chu vi hình chữ nhật: $Chu\\_vi = 2 \\cdot (cạnh_1 + cạnh_2)$.`
                        ];
                        solutionHtml = `Vì các cạnh đối của hình bình hành bằng nhau nên độ dài 4 cạnh lần lượt là $${a}\\text{ cm}$, $${b}\\text{ cm}$, $${a}\\text{ cm}$, $${b}\\text{ cm}$.<br>Chu vi hình bình hành là: $C = 2 \\cdot (${a} + ${b}) = ${p}\\text{ cm}$.`;
                    } else {
                        const edge = self.randomInt(5, 15);
                        const p = 4 * edge;
                        questionText = `Một khung tranh hình thoi có chu vi bằng $${p}\\text{ cm}$. Hỏi độ dài mỗi cạnh của khung tranh hình thoi đó là bao nhiêu?`;
                        options = [`$${edge}\\text{ cm}$`, `$${edge * 2}\\text{ cm}$`, `$${edge / 2}\\text{ cm}$`, `$4\\text{ cm}$`];
                        self.shuffle(options);
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
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${b}\\text{ cm}$`);
                        hints = [
                            `Hình bình hành có các cạnh đối bằng nhau. Do đó chu vi bằng $2 \\cdot (cạnh_1 + cạnh_2)$.`,
                            `Nửa chu vi hình bình hành bằng tổng hai cạnh kề nhau.`
                        ];
                        solutionHtml = `Nửa chu vi của hình bình hành là: $${p} : 2 = ${p/2}\\text{ cm}$.<br>Độ dài cạnh kề còn lại là: $${p/2} - ${a} = ${b}\\text{ cm}$.`;
                    } else if (variant === 2) {
                        const p = self.randomInt(24, 36);
                        const c = self.randomInt(5, 8);
                        const s = p - 2 * c;
                        questionText = `Cho hình thang cân có chu vi bằng $${p}\\text{ cm}$ và độ dài cạnh bên là $${c}\\text{ cm}$. Tính tổng độ dài hai đáy của hình thang cân đó.`;
                        options = [`$${s}\\text{ cm}$`, `$${p - c}\\text{ cm}$`, `$${s / 2}\\text{ cm}$`, `$${s + c}\\text{ cm}$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${s}\\text{ cm}$`);
                        hints = [
                            `Chu vi hình thang cân bằng tổng độ dài 4 cạnh: $Đáy\\_lớn + Đáy\\_nhỏ + Cạnh\\_bên\\_1 + Cạnh\\_bên\\_2$.`,
                            `Hai cạnh bên của hình thang cân bằng nhau và đều bằng $${c}\\text{ cm}$.`,
                            `Tổng hai đáy = Chu vi - 2 $\\cdot$ Cạnh bên.`
                        ];
                        solutionHtml = `Vì hai cạnh bên của hình thang cân bằng nhau nên tổng độ dài hai cạnh bên là: $2 \\cdot ${c} = ${2 * c}\\text{ cm}$.<br>Tổng độ dài hai đáy (đáy lớn và đáy nhỏ) là: $C - 2 \\cdot cạnh\\_bên = ${p} - ${2 * c} = ${s}\\text{ cm}$.`;
                    } else {
                        const a = self.randomInt(4, 8);
                        const p = 8 * a;
                        questionText = `Người ta ghép 3 miếng bìa hình vuông có cùng cạnh là ${a} cm sát nhau thành một hàng ngang để được một hình chữ nhật lớn. Tính chu vi của hình chữ nhật lớn đó.`;
                        options = [`${p} cm`, `${12 * a} cm`, `${6 * a} cm`, `${p + 4} cm`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`${p} cm`);
                        hints = [
                            `Hình chữ nhật lớn có chiều rộng đúng bằng cạnh của hình vuông: $width = ${a}\\text{ cm}$.`,
                            `Chiều dài của hình chữ nhật bằng tổng độ dài 3 cạnh hình vuông ghép lại: $length = 3 \\cdot ${a} = ${3 * a}\\text{ cm}$.`,
                            `Chu vi hình chữ nhật lớn là: $C = 2 \\cdot (length + width)$.`
                        ];
                        solutionHtml = `Khi ghép 3 miếng bìa hình vuông cạnh ${a} cm kề nhau, ta được hình chữ nhật có:<br>- Chiều rộng bằng cạnh hình vuông: $w = ${a}\\text{ cm}$.<br>- Chiều dài bằng 3 lần cạnh hình vuông: $l = 3 \\cdot ${a} = ${3 * a}\\text{ cm}$.<br>Chu vi của hình chữ nhật lớn là: $C = 2 \\cdot (l + w) = 2 \\cdot (${3 * a} + ${a}) = 2 \\cdot ${4 * a} = ${p}\\text{ cm}$.`;
                    }
                    tip = "Khi ghép các hình vuông cạnh nhau, hãy xác định kích thước mới của hình chữ nhật rồi áp dụng công thức tính chu vi.";
                }
                break;
            }
            case "chu-vi-dien-tich": {
                const variant = self.randomInt(1, 3);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = self.randomInt(6, 12);
                        questionText = `Tính chu vi $(C)$ và diện tích $(S)$ của một khu đất hình vuông có cạnh bằng $${a}\\text{ m}$.`;
                        const c = 4 * a;
                        const s = a * a;
                        options = [
                            `$C = ${c}\\text{ m};\\space S = ${s}\\text{ m}^2$`,
                            `$C = ${s}\\text{ m};\\space S = ${c}\\text{ m}^2$`,
                            `$C = ${2 * a}\\text{ m};\\space S = ${s}\\text{ m}^2$`,
                            `$C = ${c}\\text{ m};\\space S = ${2 * a}\\text{ m}^2$`
                        ];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$C = ${c}\\text{ m};\\space S = ${s}\\text{ m}^2$`);
                        hints = [
                            `Công thức chu vi hình vuông: $C = 4 \\cdot cạnh$.`,
                            `Công thức diện tích hình vuông: $S = cạnh \\cdot cạnh$.`
                        ];
                        solutionHtml = `Áp dụng công thức hình vuông cạnh $a = ${a}$:<br>Chu vi: $C = 4 \\cdot ${a} = ${c}\\text{ m}$.<br>Diện tích: $S = ${a} \\cdot ${a} = ${s}\\text{ m}^2$.`;
                    } else if (variant === 2) {
                        const a = self.randomInt(12, 20);
                        const b = self.randomInt(5, 10);
                        questionText = `Một sân chơi hình chữ nhật có chiều dài $${a}\\text{ m}$ và chiều rộng $${b}\\text{ m}$. Tính chu vi $(C)$ và diện tích $(S)$ của sân chơi đó.`;
                        const c = 2 * (a + b);
                        const s = a * b;
                        options = [
                            `$C = ${c}\\text{ m};\\space S = ${s}\\text{ m}^2$`,
                            `$C = ${a + b}\\text{ m};\\space S = ${s}\\text{ m}^2$`,
                            `$C = ${c}\\text{ m};\\space S = ${s * 2}\\text{ m}^2$`,
                            `$C = ${s}\\text{ m};\\space S = ${c}\\text{ m}^2$`
                        ];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$C = ${c}\\text{ m};\\space S = ${s}\\text{ m}^2$`);
                        hints = [
                            `Công thức chu vi hình chữ nhật: $C = 2 \\cdot (chiều\\_dài + chiều\\_rộng)$.`,
                            `Công thức diện tích hình chữ nhật: $S = chiều\\_dài \\cdot chiều\\_rộng$.`
                        ];
                        solutionHtml = `Chu vi của sân chơi hình chữ nhật là: $C = 2 \\cdot (${a} + ${b}) = ${c}\\text{ m}$.<br>Diện tích của sân chơi hình chữ nhật là: $S = ${a} \\cdot ${b} = ${s}\\text{ m}^2$.`;
                    } else {
                        const a = self.randomInt(6, 15);
                        const h = self.randomInt(4, 10);
                        questionText = `Tính diện tích $(S)$ của hình tam giác có độ dài một cạnh đáy là $${a}\\text{ cm}$ và chiều cao tương ứng là $${h}\\text{ cm}$.`;
                        const s = (a * h) / 2;
                        // a*h === s*2 luôn đúng → trùng. Thay s*2 bằng a*h+1 để phân biệt.
                        const w3ChuViDienTich = a * h + 1;
                        options = [`$${s}\\text{ cm}^2$`, `$${a * h}\\text{ cm}^2$`, `$${w3ChuViDienTich}\\text{ cm}^2$`, `$${a + h}\\text{ cm}^2$`];
                        self.shuffle(options);
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
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${s}\\text{ cm}^2$`);
                        hints = [
                            `Công thức diện tích hình thoi: $S = \\frac{1}{2} \\cdot d_1 \\cdot d_2$ (tích hai đường chéo chia đôi).`
                        ];
                        solutionHtml = `Diện tích hình thoi là: $S = \\frac{1}{2} \\cdot ${d1} \\cdot ${d2} = ${s}\\text{ cm}^2$.`;
                    } else if (variant === 2) {
                        const a = self.randomInt(8, 15);
                        const h = self.randomInt(6, 10);
                        const s = a * h;
                        questionText = `Một khu vườn hình bình hành có độ dài một cạnh đáy là $${a}\\text{ m}$ và chiều cao tương ứng bằng $${h}\\text{ m}$. Diện tích khu vườn đó là bao nhiêu?`;
                        options = [`$${s}\\text{ m}^2$`, `$${s / 2}\\text{ m}^2$`, `$${(a + h) * 2}\\text{ m}^2$`, `$${s * 2}\\text{ m}^2$`];
                        self.shuffle(options);
                        correctIndex = options.indexOf(`$${s}\\text{ m}^2$`);
                        hints = [
                            `Công thức diện tích hình bình hành: $S = đáy \\cdot chiều\\_cao$. (Không có hệ số 1/2 như tam giác).`
                        ];
                        solutionHtml = `Diện tích khu vườn hình bình hành là: $S = a \\cdot h = ${a} \\cdot ${h} = ${s}\\text{ m}^2$.`;
                    } else {
                        const a = self.randomInt(6, 10);
                        const b = a + self.randomInt(4, 8);
                        const h = self.randomInt(4, 8);
                        const s = ((a + b) * h) / 2;
                        questionText = `Tính diện tích hình thang có độ dài hai đáy lần lượt là $${a}\\text{ cm}$ và $${b}\\text{ cm}$, chiều cao bằng $${h}\\text{ cm}$.`;
                        options = [`$${s}\\text{ cm}^2$`, `$${(a + b) * h}\\text{ cm}^2$`, `$${s * 2}\\text{ cm}^2$`, `$${a * b * h}\\text{ cm}^2$`];
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                        self.shuffle(options);
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
                const variant = self.randomInt(1, 2);
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
                const variant = self.randomInt(1, 2);
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
    if (typeof root !== 'undefined') root.chapter3_geometry = ChapterModule;
})(typeof window !== 'undefined' ? window : global);
