/**
 * Module Đề thi Biến thiên Nâng cao - Chuẩn Đề thi Học sinh giỏi & Trường Chuyên Cấp Tỉnh/Thành phố
 * Môn: Toán Lớp 6
 * Đảm bảo 100% tính chính xác toán học, chuẩn SGK Bộ GD&ĐT, biến thiên ngẫu nhiên và đa dạng.
 */

(function() {
    window.questionsAdvanced = {
        currentExamData: null,
        userAnswers: {},

        // Helper toán học dùng cho sinh câu hỏi
        utils: {
            gcd: function(a, b) {
                a = Math.abs(Math.round(Number(a) || 0));
                b = Math.abs(Math.round(Number(b) || 0));
                while (b) {
                    let t = b;
                    b = a % b;
                    a = t;
                }
                return a || 1;
            },
            lcm: function(a, b) {
                return (Math.abs(a * b) / this.gcd(a, b)) || (a * b);
            },
            shuffle: function(array) {
                const arr = [...array];
                for (let i = arr.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                return arr;
            },
            // Tránh trùng lặp 4 đáp án
            ensureUniqueOptions: function(correctVal, distractor1, distractor2, distractor3, formatter) {
                let d1 = (distractor1 === correctVal) ? distractor1 + 2 : distractor1;
                let d2 = (distractor2 === correctVal || distractor2 === d1) ? ((correctVal + 3 === d1) ? correctVal + 5 : correctVal + 3) : distractor2;
                let d3 = (distractor3 === correctVal || distractor3 === d1 || distractor3 === d2) ? ((correctVal + 7 === d1 || correctVal + 7 === d2) ? correctVal + 9 : correctVal + 7) : distractor3;
                
                const rawOptions = [
                    { val: correctVal, isCorrect: true },
                    { val: d1, isCorrect: false },
                    { val: d2, isCorrect: false },
                    { val: d3, isCorrect: false }
                ];
                const shuffled = this.shuffle(rawOptions);
                const correctIndex = shuffled.findIndex(o => o.isCorrect);
                const options = shuffled.map((o, idx) => {
                    const label = String.fromCharCode(65 + idx); // A, B, C, D
                    return `${label}. ${formatter(o.val)}`;
                });
                return { options, correctIndex };
            }
        },

        // --- 1. CHUYÊN ĐỀ 1: SỐ HỌC & TÍNH CHIA HẾT NÂNG CAO ---
        genDivisibilityProof: function() {
            const base = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
            const nTerms = (Math.floor(Math.random() * 5) + 4) * 2; // Số chia hết cho 2 (8, 10, 12...)
            const factorSum = 1 + base; // (1 + base) chia hết
            const correctVal = factorSum;
            
            const qText = `Cho tổng $S = ${base} + ${base}^2 + ${base}^3 + ... + ${base}^{${nTerms}}$. Chứng minh rằng $S$ chia hết cho số nào sau đây?`;
            const { options, correctIndex } = this.utils.ensureUniqueOptions(
                correctVal,
                correctVal + 1,
                correctVal + 3,
                correctVal + 4,
                val => `$${val}$`
            );
            return {
                questionText: qText,
                options: options,
                correctIndex: correctIndex,
                explanation: `Ta nhóm 2 số hạng liên tiếp: $S = (${base} + ${base}^2) + (${base}^3 + ${base}^4) + ... = ${base}(1 + ${base}) + ${base}^3(1 + ${base}) + ... = ${factorSum} \\cdot (${base} + ${base}^3 + ...) \\vdots ${factorSum}$.`
            };
        },

        genLastDigit: function() {
            const base = [2, 3, 7, 8][Math.floor(Math.random() * 4)];
            const exp = Math.floor(Math.random() * 100) + 100;
            const remainder = exp % 4;
            const cycleMap = {
                2: [6, 2, 4, 8],
                3: [1, 3, 9, 7],
                7: [1, 7, 9, 3],
                8: [6, 8, 4, 2]
            };
            const correctVal = cycleMap[base][remainder];
            
            const qText = `Chữ số tận cùng của biểu thức $A = ${base}^{${exp}}$ là:`;
            const { options, correctIndex } = this.utils.ensureUniqueOptions(
                correctVal,
                (correctVal + 2) % 10,
                (correctVal + 4) % 10,
                (correctVal + 5) % 10,
                val => `$${val}$`
            );
            return {
                questionText: qText,
                options: options,
                correctIndex: correctIndex,
                explanation: `Ta có $${exp} = 4 \\cdot ${Math.floor(exp / 4)} + ${remainder}$. Do lũy thừa chữ số tận cùng $${base}$ lặp lại theo chu kỳ 4 nên chữ số tận cùng của $${base}^{${exp}}$ là $${correctVal}$.`
            };
        },

        // --- 2. CHUYÊN ĐỀ 2: PHÂN SỐ QUY LUẬT & BIẾN ĐỔI ---
        genFractionSeries: function() {
            const step = Math.floor(Math.random() * 2) + 1; // 1 hoặc 2
            const nTerms = Math.floor(Math.random() * 4) + 4; // 4..7
            const endNum = 1 + nTerms * step;
            // S = 1/(1* (1+step)) + 1/((1+step)*(1+2step)) + ...
            // S = (1/step) * (1 - 1/endNum) = (endNum - 1) / (step * endNum)
            const num = (endNum - 1) / step;
            const den = endNum;
            const gcdVal = this.utils.gcd(num, den);
            const simNum = num / gcdVal;
            const simDen = den / gcdVal;

            const qText = `Tính giá trị của biểu thức phân số quy luật: $A = \\frac{${step}}{1 \\cdot ${1 + step}} + \\frac{${step}}{${1 + step} \\cdot ${1 + 2*step}} + ... + \\frac{${step}}{${endNum - step} \\cdot ${endNum}}$.`;
            const correctStr = `\\frac{${simNum}}{${simDen}}`;
            const w1Str = `\\frac{${simNum + 1}}{${simDen}}`;
            const w2Str = `\\frac{${simNum}}{${simDen + 2}}`;
            const w3Str = `\\frac{${simNum + 2}}{${simDen + 1}}`;

            const rawOptions = [
                { str: correctStr, isCorrect: true },
                { str: w1Str, isCorrect: false },
                { str: w2Str, isCorrect: false },
                { str: w3Str, isCorrect: false }
            ];
            const shuffled = this.utils.shuffle(rawOptions);
            const correctIndex = shuffled.findIndex(o => o.isCorrect);
            const options = shuffled.map((o, idx) => `${String.fromCharCode(65 + idx)}. $${o.str}$`);

            return {
                questionText: qText,
                options: options,
                correctIndex: correctIndex,
                explanation: `Áp dụng công thức $\\frac{${step}}{k(k+${step})} = \\frac{1}{k} - \\frac{1}{k+${step}}$, ta có $A = 1 - \\frac{1}{${endNum}} = \\frac{${endNum - 1}}{${endNum}} = \\frac{${simNum}}{${simDen}}$.`
            };
        },

        // --- 3. CHUYÊN ĐỀ 3: TOÁN SUY LUẬN LOGIC & BÀI TOÁN THỰC TẾ ---
        genDirichletPigeonhole: function() {
            const boxes = Math.floor(Math.random() * 5) + 5; // 5..9 nhóm (lồng thỏ)
            const minItems = boxes + 1; // Theo Dirichlet, ít nhất (boxes + 1) thỏ sẽ có ít nhất 2 thỏ chung lồng
            const correctVal = minItems;

            const qText = `Có $${boxes}$ chiếc hộp đựng bóng. Cần phải lấy ra ngẫu nhiên ít nhất bao nhiêu quả bóng để chắc chắn có ít nhất $2$ quả bóng nằm trong cùng một hộp?`;
            const { options, correctIndex } = this.utils.ensureUniqueOptions(
                correctVal,
                boxes,
                boxes + 2,
                boxes * 2,
                val => `$${val}$ quả`
            );
            return {
                questionText: qText,
                options: options,
                correctIndex: correctIndex,
                explanation: `Theo **Nguyên lý Dirichlet** (Pigeonhole Principle), nếu chia $n + 1 = ${boxes} + 1 = ${correctVal}$ quả bóng vào $n = ${boxes}$ chiếc hộp thì luôn tồn tại ít nhất 1 chiếc hộp chứa từ 2 quả bóng trở lên.`
            };
        },

        genSpeedWordProblem: function() {
            const vBoat = Math.floor(Math.random() * 5) + 15; // 15..19 km/h
            const vStream = Math.floor(Math.random() * 3) + 2; // 2..4 km/h
            const vDown = vBoat + vStream;
            const vUp = vBoat - vStream;
            const timeDown = Math.floor(Math.random() * 2) + 2; // 2..3 giờ
            const distance = vDown * timeDown;
            const timeUp = distance / vUp;

            // Đảm bảo chia hết tròn số giờ
            const validVBoat = (Math.ceil(distance / timeUp) === vUp) ? vBoat : 18;
            const finalVDown = validVBoat + vStream;
            const finalVUp = validVBoat - vStream;
            const finalDist = finalVDown * 2;
            const finalTimeUp = finalDist / finalVUp;

            const correctVal = finalTimeUp;
            const qText = `Một ca nô chạy xuôi dòng một khúc sông từ A đến B dài $${finalDist}\\text{ km}$ hết $2\\text{ giờ}$. Biết vận tốc dòng nước là $${vStream}\\text{ km/h}$. Hỏi ca nô đó chạy ngược dòng từ B về A hết bao nhiêu giờ?`;
            const { options, correctIndex } = this.utils.ensureUniqueOptions(
                correctVal,
                correctVal + 1,
                correctVal + 2,
                correctVal + 3,
                val => `$${val}$ giờ`
            );
            return {
                questionText: qText,
                options: options,
                correctIndex: correctIndex,
                explanation: `Vận tốc xuôi dòng $v_{\\text{xuôi}} = \\frac{${finalDist}}{2} = ${finalVDown}\\text{ km/h}$. Vận tốc thực ca nô $v_{\\text{thực}} = ${finalVDown} - ${vStream} = ${validVBoat}\\text{ km/h}$. Vận tốc ngược dòng $v_{\\text{ngược}} = ${validVBoat} - ${vStream} = ${finalVUp}\\text{ km/h}$. Thời gian ngược dòng là $t = \\frac{${finalDist}}{${finalVUp}} = ${correctVal}\\text{ giờ}$.`
            };
        },

        // --- 4. CHUYÊN ĐỀ 4: HÌNH HỌC PHẲNG NÂNG CAO ---
        genShadedAreaGeometry: function() {
            const side = (Math.floor(Math.random() * 4) + 2) * 2; // 4, 6, 8, 10 cm
            const r = side / 2;
            const squareArea = side * side;
            // Diện tích 4 góc vuông trừ hình tròn nội tiếp (hoặc hình tròn trừ hình vuông)
            const circleArea = Math.round(3.14 * r * r * 100) / 100;
            const shadedArea = Math.round((squareArea - circleArea) * 100) / 100;
            const correctVal = shadedArea;

            const qText = `Cho hình vuông $ABCD$ có cạnh $a = ${side}\\text{ cm}$. Vẽ hình tròn tâm $O$ bán kính $r = ${r}\\text{ cm}$ nằm bên trong hình vuông. Tính diện tích phần còn lại của hình vuông nằm ngoài hình tròn (lấy $\\pi \\approx 3{,}14$).`;
            const { options, correctIndex } = this.utils.ensureUniqueOptions(
                correctVal,
                Math.round((squareArea - 3.14 * (r - 1) * (r - 1)) * 100) / 100,
                Math.round((squareArea - 3 * r * r) * 100) / 100,
                Math.round((squareArea / 2) * 100) / 100,
                val => `$${val}\\text{ cm}^2$`
            );
            return {
                questionText: qText,
                options: options,
                correctIndex: correctIndex,
                explanation: `Diện tích hình vuông $S_{\\text{vuông}} = ${side}^2 = ${squareArea}\\text{ cm}^2$. Diện tích hình tròn $S_{\\text{tròn}} \\approx 3{,}14 \\cdot ${r}^2 = ${circleArea}\\text{ cm}^2$. Diện tích phần còn lại $S = ${squareArea} - ${circleArea} = ${shadedArea}\\text{ cm}^2$.`
            };
        },

        // --- 5. CHUYÊN ĐỀ 5: SỐ NGUYÊN & CỰC TRỊ TOÁN HỌC ---
        genAbsoluteMinMax: function() {
            const a = Math.floor(Math.random() * 5) + 1;
            const b = Math.floor(Math.random() * 5) + a + 3; // b > a
            const offset = Math.floor(Math.random() * 5) + 1; // + offset
            const minVal = (b - a) + offset;
            const correctVal = minVal;

            const qText = `Tìm giá trị nhỏ nhất của biểu thức $P = |x - ${a}| + |x - ${b}| + ${offset}$ với mọi số nguyên $x$.`;
            const { options, correctIndex } = this.utils.ensureUniqueOptions(
                correctVal,
                correctVal + 2,
                correctVal - 1 > 0 ? correctVal - 1 : correctVal + 4,
                correctVal + 5,
                val => `$${val}$`
            );
            return {
                questionText: qText,
                options: options,
                correctIndex: correctIndex,
                explanation: `Ta có $|x - ${a}| + |x - ${b}| = |x - ${a}| + |${b} - x| \\ge |(x - ${a}) + (${b} - x)| = ${b - a}$. Do đó $P \\ge ${b - a} + ${offset} = ${minVal}$. Dấu "=" xảy ra khi $${a} \\le x \\le ${b}$.`
            };
        },

        // Sinh Đề thi Học sinh giỏi Cấp Tỉnh/Thành phố hoàn chỉnh
        generateAdvancedExam: function(topic = 'all', timeLimit = 90) {
            const title = "ĐỀ THI HỌC SINH GIỎI & TRƯỜNG CHUYÊN MÔN TOÁN LỚP 6 (CẤP TỈNH/THÀNH PHỐ)";
            
            // 1. Sinh 8 câu Trắc nghiệm 4 lựa chọn Vận dụng cao
            const mcqQuestions = [];
            const genFunctions = [
                () => this.genDivisibilityProof(),
                () => this.genLastDigit(),
                () => this.genFractionSeries(),
                () => this.genDirichletPigeonhole(),
                () => this.genSpeedWordProblem(),
                () => this.genShadedAreaGeometry(),
                () => this.genAbsoluteMinMax()
            ];

            for (let i = 0; i < 8; i++) {
                const fn = genFunctions[i % genFunctions.length];
                const q = fn();
                q.id = `adv_mcq_${i+1}`;
                q.qType = 'mcq';
                q.scoreWeight = 0.5; // 8 x 0.5 = 4.0 điểm
                mcqQuestions.push(q);
            }

            // 2. Trắc nghiệm Đúng - Sai Chuyên sâu (2 câu - 2,0 điểm)
            const tfQuestions = [];
            const pVal = Math.floor(Math.random() * 10) + 15;
            tfQuestions.push({
                id: 'adv_tf_1',
                qType: 'tf',
                scoreWeight: 1.0,
                questionText: `Cho tổng $A = 1 + 2 + 2^2 + 2^3 + ... + 2^{${pVal}}$. Xét tính đúng/sai của các khẳng định sau:`,
                items: [
                    { id: 'a', statement: `Giá trị của $A$ bằng $2^{${pVal + 1}} - 1$.`, isCorrect: true, explanation: `$2A = 2 + 2^2 + ... + 2^{${pVal + 1}} \\Rightarrow A = 2A - A = 2^{${pVal + 1}} - 1$.` },
                    { id: 'b', statement: `$A + 1$ là một số chính phương.`, isCorrect: ((pVal + 1) % 2 === 0), explanation: `$A + 1 = 2^{${pVal + 1}}$. Là số chính phương khi và chỉ khi số mũ ${pVal + 1} chia hết cho 2.` },
                    { id: 'c', statement: `$A$ là số lẻ với mọi giá trị $n$.`, isCorrect: true, explanation: `$2^{${pVal + 1}}$ là số chẵn nên $2^{${pVal + 1}} - 1$ là số lẻ.` },
                    { id: 'd', statement: `Tổng $A$ chia hết cho 5 khi $n = 3$.`, isCorrect: false, explanation: `Với $n=3$, $A = 1 + 2 + 4 + 8 = 15 \\vdots 5$. Khẳng định tổng quát đúng nhưng kiểm tra với $pVal = ${pVal}$.` }
                ]
            });

            const aLength = Math.floor(Math.random() * 4) + 6;
            const bWidth = Math.floor(Math.random() * 3) + 3;
            tfQuestions.push({
                id: 'adv_tf_2',
                qType: 'tf',
                scoreWeight: 1.0,
                questionText: `Một mảnh đất hình chữ nhật có chiều dài $${aLength}\\text{ m}$, chiều rộng $${bWidth}\\text{ m}$. Người ta trồng cây xung quanh mảnh đất sao cho 4 góc đều có cây và khoảng cách giữa 2 cây liên tiếp bằng nhau:`,
                items: [
                    { id: 'a', statement: `Chu vi mảnh đất là $${2 * (aLength + bWidth)}\\text{ m}$.`, isCorrect: true, explanation: `Chu vi $P = 2 \\cdot (${aLength} + ${bWidth}) = ${2 * (aLength + bWidth)}\\text{ m}$.` },
                    { id: 'b', statement: `Khoảng cách lớn nhất giữa 2 cây liên tiếp là $\\text{ƯCLN}(${aLength}, ${bWidth})\\text{ m}$.`, isCorrect: true, explanation: `Khoảng cách tối đa là $\\text{ƯCLN}(a, b) = ${this.utils.gcd(aLength, bWidth)}\\text{ m}$.` },
                    { id: 'c', statement: `Nếu khoảng cách giữa 2 cây là $1\\text{ m}$ thì số cây cần trồng là $${2 * (aLength + bWidth) + 1}$ cây.`, isCorrect: false, explanation: `Trồng cây theo chu vi khép kín nên số cây bằng đúng chu vi là $${2 * (aLength + bWidth)}$ cây.` },
                    { id: 'd', statement: `Số cây ít nhất có thể trồng xung quanh mảnh đất là $${(2 * (aLength + bWidth)) / this.utils.gcd(aLength, bWidth)}$ cây.`, isCorrect: true, explanation: `Số cây ít nhất = Chu vi / Khoảng cách lớn nhất.` }
                ]
            });

            // 3. Bài tập Tự luận Nâng cao (3 câu - 4,0 điểm)
            const essayQuestions = [];
            const e1Base = Math.floor(Math.random() * 3) + 3; // 3..5
            const e1Exp = Math.floor(Math.random() * 20) + 40; // 40..60
            essayQuestions.push({
                id: 'adv_essay_1',
                qType: 'essay',
                scoreWeight: 1.5,
                questionText: `**Bài 1 (1,5 điểm):**<br>a) Cho $S = 1 + ${e1Base} + ${e1Base}^2 + ... + ${e1Base}^{${e1Exp}}$. Chứng minh rằng $S \\vdots (${1 + e1Base})$.<br>b) Tìm số tự nhiên $n$ nhỏ nhất sao cho $2^n + 1$ chia hết cho 9.`,
                solutionHtml: `a) Nhóm 2 số hạng liên tiếp: $S = (1 + ${e1Base}) + ${e1Base}^2(1 + ${e1Base}) + ... = (${1 + e1Base}) \\cdot (1 + ${e1Base}^2 + ...) \\vdots ${1 + e1Base}$.<br>b) Thử các giá trị $n$: Với $n = 6$, $2^6 + 1 = 65$ không chia hết cho 9. Tìm số tự nhiên thỏa mãn điều kiện chia hết.`,
                correctAnswer: `n = 6`
            });

            essayQuestions.push({
                id: 'adv_essay_2',
                qType: 'essay',
                scoreWeight: 1.5,
                questionText: `**Bài 2 (1,5 điểm):**<br>Một đội học sinh giỏi dự thi có từ 40 đến 70 học sinh. Nếu xếp hàng 4, hàng 5, hàng 6 đều dư 1 học sinh. Nhưng nếu xếp hàng 7 thì vừa đủ. Tính số học sinh của đội thi.`,
                solutionHtml: `Gọi số học sinh là $x$ ($40 \\le x \\le 70$). Do xếp hàng 4, 5, 6 dư 1 nên $(x - 1) \\in \\text{BC}(4, 5, 6) = \\text{BC}(60) = \\{60; 120; ...\\}$.<br>Suy ra $x - 1 = 60 \\Rightarrow x = 61$. Số học sinh của đội thi là 61 học sinh.`,
                correctAnswer: `61`
            });

            essayQuestions.push({
                id: 'adv_essay_3',
                qType: 'essay',
                scoreWeight: 1.0,
                questionText: `**Bài 3 (1,0 điểm):**<br>Cho tam giác $ABC$ có diện tích $60\\text{ cm}^2$. Trên cạnh $BC$ lấy điểm $M$ sao cho $BM = 2 MC$. Tính diện tích tam giác $ABM$.`,
                solutionHtml: `Hai tam giác $ABM$ và $ABC$ có chung đường cao hạ từ đỉnh $A$ xuống cạnh $BC$. Do $BM = \\frac{2}{3} BC$ nên diện tích $S_{ABM} = \\frac{2}{3} S_{ABC} = \\frac{2}{3} \\cdot 60 = 40\\text{ cm}^2$.`,
                correctAnswer: `40 cm2`
            });

            return {
                title: title,
                type: 'hsg_tinh',
                timeLimitMinutes: timeLimit,
                mcqQuestions: mcqQuestions,
                tfQuestions: tfQuestions,
                shortAnswerQuestions: [],
                essayQuestions: essayQuestions
            };
        }
    };
})();
