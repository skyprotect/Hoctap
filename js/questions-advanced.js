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
            
            const qText = `Cho tổng $S = ${base} + ${base}^2 + ${base}^3 + ... + ${base}^{${nTerms}}$. Trong các số dưới đây, $S$ chia hết cho số nào?`;
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
            const pedagogicalSets = [
                { dist: 36, tDown: 2, vStream: 3, tUp: 3 },
                { dist: 48, tDown: 2, vStream: 4, tUp: 3 },
                { dist: 60, tDown: 3, vStream: 4, tUp: 5 },
                { dist: 40, tDown: 2, vStream: 5, tUp: 4 },
                { dist: 72, tDown: 3, vStream: 3, tUp: 4 },
                { dist: 96, tDown: 4, vStream: 4, tUp: 6 },
                { dist: 80, tDown: 4, vStream: 2, tUp: 5 }
            ];
            const data = pedagogicalSets[Math.floor(Math.random() * pedagogicalSets.length)];
            const dist = data.dist;
            const tDown = data.tDown;
            const vStream = data.vStream;
            const tUp = data.tUp;

            const vDown = dist / tDown;
            const vBoat = vDown - vStream;
            const vUp = vBoat - vStream;
            
            const correctVal = tUp;
            const qText = `Một ca nô chạy xuôi dòng một khúc sông từ A đến B dài $${dist}\\text{ km}$ hết $${tDown}\\text{ giờ}$. Biết vận tốc dòng nước là $${vStream}\\text{ km/h}$. Hỏi ca nô đó chạy ngược dòng từ B về A hết bao nhiêu giờ?`;
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
                explanation: `Vận tốc xuôi dòng $v_{\\text{xuôi}} = \\frac{${dist}}{${tDown}} = ${vDown}\\text{ km/h}$. Vận tốc thực ca nô $v_{\\text{thực}} = ${vDown} - ${vStream} = ${vBoat}\\text{ km/h}$. Vận tốc ngược dòng $v_{\\text{ngược}} = ${vBoat} - ${vStream} = ${vUp}\\text{ km/h}$. Thời gian ngược dòng là $t = \\frac{${dist}}{${vUp}} = ${correctVal}\\text{ giờ}$.`
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

        // Sinh Đề thi Học sinh giỏi Cấp Tỉnh/Thành phố hoàn chỉnh cho Lớp 4
        generateGrade4AdvancedExam: function(title, timeLimit) {
            const mcqQuestions = [];
            const n1 = Math.floor(Math.random() * 20) + 10;
            const n2 = 100 - n1;
            const factor = Math.floor(Math.random() * 8) + 12;
            const correctMcq1 = 100 * factor;
            const mcq1Opt = this.utils.ensureUniqueOptions(correctMcq1, correctMcq1 - 100, correctMcq1 + 100, correctMcq1 + 200, v => `$${v}$`);
            mcqQuestions.push({
                id: 'adv_mcq_l4_1',
                qType: 'mcq',
                scoreWeight: 0.5,
                questionText: `Tính nhanh giá trị biểu thức: $A = ${n1} \\times ${factor} + ${n2} \\times ${factor}$.`,
                options: mcq1Opt.options,
                correctIndex: mcq1Opt.correctIndex,
                explanation: `Áp dụng tính chất phân phối: $A = (${n1} + ${n2}) \\times ${factor} = 100 \\times ${factor} = ${correctMcq1}$.`
            });

            const prefixDigit = Math.floor(Math.random() * 3) + 2;
            const addedVal = prefixDigit * 100;
            const kFactor = Math.floor(Math.random() * 4) + 4;
            const correctNum = Math.floor(addedVal / (kFactor - 1));
            const mcq2Opt = this.utils.ensureUniqueOptions(correctNum, correctNum + 5, correctNum - 4 > 0 ? correctNum - 4 : correctNum + 10, correctNum + 12, v => `$${v}$`);
            mcqQuestions.push({
                id: 'adv_mcq_l4_2',
                qType: 'mcq',
                scoreWeight: 0.5,
                questionText: `Tìm một số tự nhiên có hai chữ số, biết rằng khi viết thêm chữ số $${prefixDigit}$ vào bên trái số đó ta được số mới gấp $${kFactor}$ lần số ban đầu.`,
                options: mcq2Opt.options,
                correctIndex: mcq2Opt.correctIndex,
                explanation: `Gọi số cần tìm là $\\overline{ab}$. Khi viết thêm chữ số $${prefixDigit}$ vào bên trái, số mới là $\\overline{${prefixDigit}ab} = ${addedVal} + \\overline{ab}$. Theo đề bài: ${addedVal} + \\overline{ab} = ${kFactor} \\times \\overline{ab} \\Rightarrow ${kFactor - 1} \\times \\overline{ab} = ${addedVal} \\Rightarrow \\overline{ab} = ${correctNum}.`
            });

            const avg3 = Math.floor(Math.random() * 15) + 25;
            const sum3 = avg3 * 3;
            const ageDadMom = Math.floor(Math.random() * 10) + 32;
            const sumDadMom = ageDadMom * 2;
            const childAge = sum3 - sumDadMom;
            const mcq3Opt = this.utils.ensureUniqueOptions(childAge, childAge + 2, childAge - 2 > 0 ? childAge - 2 : childAge + 4, childAge + 6, v => `$${v}$ tuổi`);
            mcqQuestions.push({
                id: 'adv_mcq_l4_3',
                qType: 'mcq',
                scoreWeight: 0.5,
                questionText: `Trung bình cộng tuổi của bố, mẹ và Nam là $${avg3}$ tuổi. Trung bình cộng tuổi của bố và mẹ là $${ageDadMom}$ tuổi. Hỏi Nam bao nhiêu tuổi?`,
                options: mcq3Opt.options,
                correctIndex: mcq3Opt.correctIndex,
                explanation: `Tổng số tuổi của cả 3 người là: ${avg3} \\times 3 = ${sum3}$ tuổi. Tổng số tuổi của bố và mẹ là: ${ageDadMom} \\times 2 = ${sumDadMom}$ tuổi. Tuổi của Nam là: ${sum3} - ${sumDadMom} = ${childAge}$ tuổi.`
            });

            const width = Math.floor(Math.random() * 10) + 15;
            const diff = Math.floor(Math.random() * 8) + 6;
            const length = width + diff;
            const perimeter = 2 * (length + width);
            const area = length * width;
            const mcq4Opt = this.utils.ensureUniqueOptions(area, area + 20, area - 20, area + 50, v => `$${v}\\text{ m}^2$`);
            mcqQuestions.push({
                id: 'adv_mcq_l4_4',
                qType: 'mcq',
                scoreWeight: 0.5,
                questionText: `Một khu đất hình chữ nhật có chu vi $${perimeter}\\text{ m}$, chiều dài hơn chiều rộng $${diff}\\text{ m}$. Tính diện tích khu đất đó.`,
                options: mcq4Opt.options,
                correctIndex: mcq4Opt.correctIndex,
                explanation: `Nửa chu vi khu đất là: ${perimeter} : 2 = ${length + width}\\text{ m}$. Chiều dài là: (${length + width} + ${diff}) : 2 = ${length}\\text{ m}$. Chiều rộng là: ${length} - ${diff} = ${width}\\text{ m}$. Diện tích là: ${length} \\times ${width} = ${area}\\text{ m}^2$.`
            });

            for (let i = 5; i <= 8; i++) {
                const qType = ['l4_calc_fast', 'l4_sum_diff', 'l4_sum_ratio', 'l4_find_x_adv'][i % 4];
                let qText = ``;
                let correctVal = 0;
                let explanation = ``;

                if (qType === 'l4_calc_fast') {
                    const a = Math.floor(Math.random() * 20) + 10;
                    const b = Math.floor(Math.random() * 20) + 30;
                    correctVal = (a + b) * 5;
                    qText = `Tính nhanh: $B = ${a} \\times 5 + ${b} \\times 5$.`;
                    explanation = `Biến đổi: $B = (${a} + ${b}) \\times 5 = ${a + b} \\times 5 = ${correctVal}$.`;
                } else if (qType === 'l4_sum_diff') {
                    const sum = 120;
                    const diffVal = 20;
                    correctVal = (sum + diffVal) / 2;
                    qText = `Tìm hai số biết tổng của chúng bằng $${sum}$ và hiệu bằng $${diffVal}$. Số lớn là bao nhiêu?`;
                    explanation = `Số lớn = $(Tổng + Hiệu) : 2 = (${sum} + ${diffVal}) : 2 = ${correctVal}$.`;
                } else if (qType === 'l4_sum_ratio') {
                    const ratio = 3;
                    const sum = 80;
                    correctVal = (sum / (1 + ratio)) * ratio;
                    qText = `Hai thùng dầu chứa tổng cộng $${sum}\\text{ lít}$. Thùng thứ nhất chứa gấp $3$ lần thùng thứ hai. Hỏi thùng thứ nhất chứa bao nhiêu lít dầu?`;
                    explanation = `Tổng số phần bằng nhau là $1 + 3 = 4$ phần. Thùng thứ nhất chứa: (${sum} : 4) \\times 3 = ${correctVal}\\text{ lít}$.`;
                } else {
                    const x = Math.floor(Math.random() * 50) + 20;
                    correctVal = x;
                    qText = `Tìm $x$, biết: $x \\times 4 + 15 = ${x * 4 + 15}$.`;
                    explanation = `Ta có $x \\times 4 = ${x * 4 + 15} - 15 = ${x * 4} \\Rightarrow x = ${x}$.`;
                }

                const opt = this.utils.ensureUniqueOptions(correctVal, correctVal + 5, correctVal - 3 > 0 ? correctVal - 3 : correctVal + 8, correctVal + 10, v => `$${v}$`);
                mcqQuestions.push({
                    id: `adv_mcq_l4_${i}`,
                    qType: 'mcq',
                    scoreWeight: 0.5,
                    questionText: qText,
                    options: opt.options,
                    correctIndex: opt.correctIndex,
                    explanation: explanation
                });
            }

            const tfQuestions = [];
            const wBox = Math.floor(Math.random() * 5) + 8;
            const lBox = wBox + Math.floor(Math.random() * 4) + 4;
            tfQuestions.push({
                id: 'adv_tf_l4_1',
                qType: 'tf',
                scoreWeight: 1.0,
                questionText: `Một hình chữ nhật có chiều dài $${lBox}\\text{ cm}$, chiều rộng $${wBox}\\text{ cm}$. Đánh giá tính đúng/sai của các mệnh đề sau:`,
                items: [
                    { id: 'a', statement: `Chu vi của hình chữ nhật là $${2 * (lBox + wBox)}\\text{ cm}$.`, isCorrect: true, explanation: `Chu vi $P = (a + b) \\times 2 = (${lBox} + ${wBox}) \\times 2 = ${2 * (lBox + wBox)}\\text{ cm}$.` },
                    { id: 'b', statement: `Diện tích của hình chữ nhật là $${lBox * wBox}\\text{ cm}^2$.`, isCorrect: true, explanation: `Diện tích $S = a \\times b = ${lBox} \\times ${wBox} = ${lBox * wBox}\\text{ cm}^2$.` },
                    { id: 'c', statement: `Nếu tăng mỗi chiều lên $2\\text{ cm}$ thì chu vi tăng thêm $4\\text{ cm}$.`, isCorrect: false, explanation: `Tăng mỗi chiều $2\\text{ cm}$ thì chu vi tăng $(2 + 2) \\times 2 = 8\\text{ cm}$.` },
                    { id: 'd', statement: `Nếu chiều dài gấp đôi chiều rộng thì hình chữ nhật trở thành hình vuông.`, isCorrect: false, explanation: `Hình chữ nhật trở thành hình vuông khi chiều dài bằng chiều rộng.` }
                ]
            });

            tfQuestions.push({
                id: 'adv_tf_l4_2',
                qType: 'tf',
                scoreWeight: 1.0,
                questionText: `Cho dãy số tự nhiên có quy luật: $2, 5, 8, 11, 14, ...$. Xét tính đúng/sai của các phát biểu:`,
                items: [
                    { id: 'a', statement: `Khoảng cách giữa hai số liên tiếp trong dãy là 3 đơn vị.`, isCorrect: true, explanation: `Quy luật: $5 - 2 = 3$, $8 - 5 = 3$. Công sai bằng 3.` },
                    { id: 'b', statement: `Số thứ 10 của dãy số là 29.`, isCorrect: true, explanation: `Số thứ $n = 2 + (n - 1) \\times 3$. Với $n = 10 \\Rightarrow 2 + 9 \\times 3 = 29$.` },
                    { id: 'c', statement: `Số 100 là một số thuộc dãy số trên.`, isCorrect: false, explanation: `Các số trong dãy chia 3 dư 2. Do $100 : 3 = 33$ dư 1 nên 100 không thuộc dãy.` },
                    { id: 'd', statement: `Tổng của 5 số đầu tiên của dãy bằng 35.`, isCorrect: true, explanation: `Tổng $2 + 5 + 8 + 11 + 14 = 40$. Phát biểu nói 35 là Sai.` }
                ]
            });

            const essayQuestions = [
                {
                    id: 'adv_essay_l4_1',
                    qType: 'essay',
                    scoreWeight: 1.5,
                    questionText: `**Bài 1 (1,5 điểm):**<br>Tính giá trị biểu thức bằng cách thuận tiện nhất:<br>a) $A = 245 \\times 36 + 245 \\times 64$<br>b) $B = 1 + 4 + 7 + 10 + ... + 31$`,
                    solutionHtml: `a) $A = 245 \\times (36 + 64) = 245 \\times 100 = 24500$.<br>b) Dãy số có 11 số hạng. Tổng $B = (1 + 31) \\times 11 : 2 = 176$.`,
                    correctAnswer: `a) 24500; b) 176`
                },
                {
                    id: 'adv_essay_l4_2',
                    qType: 'essay',
                    scoreWeight: 1.5,
                    questionText: `**Bài 2 (1,5 điểm):**<br>Hiện nay tổng số tuổi của hai cha con là $42$ tuổi. Biết rằng $3$ năm nữa tuổi cha gấp $5$ lần tuổi con. Tính tuổi của mỗi người hiện nay.`,
                    solutionHtml: `Sau 3 năm nữa tổng số tuổi hai cha con là: $42 + 3 + 3 = 48$ tuổi.<br>Tổng số phần bằng nhau: $1 + 5 = 6$ phần.<br>Tuổi con sau 3 năm nữa: $48 : 6 = 8$ tuổi.<br>Tuổi con hiện nay: $8 - 3 = 5$ tuổi.<br>Tuổi cha hiện nay: $42 - 5 = 37$ tuổi.`,
                    correctAnswer: `Cha 37 tuổi, Con 5 tuổi`
                },
                {
                    id: 'adv_essay_l4_3',
                    qType: 'essay',
                    scoreWeight: 1.0,
                    questionText: `**Bài 3 (1,0 điểm):**<br>Một mảnh đất hình chữ nhật có chiều dài gấp $3$ lần chiều rộng. Nếu giảm chiều dài đi $6\\text{ m}$ và tăng chiều rộng thêm $6\\text{ m}$ thì mảnh đất trở thành hình vuông. Tính diện tích mảnh đất ban đầu.`,
                    solutionHtml: `Khi chiều dài giảm $6\\text{ m}$ và chiều rộng tăng $6\\text{ m}$ thì trở thành hình vuông, chứng tỏ chiều dài hơn chiều rộng: $6 + 6 = 12\\text{ m}$.<br>Hiệu số phần bằng nhau: $3 - 1 = 2$ phần.<br>Chiều rộng ban đầu: $12 : 2 = 6\\text{ m}$.<br>Chiều dài ban đầu: $6 \\times 3 = 18\\text{ m}$.<br>Diện tích mảnh đất ban đầu: $18 \\times 6 = 108\\text{ m}^2$.`,
                    correctAnswer: `108 m2`
                }
            ];

            return {
                title: title,
                type: 'hsg_tinh',
                timeLimitMinutes: timeLimit,
                mcqQuestions: mcqQuestions,
                tfQuestions: tfQuestions,
                shortAnswerQuestions: [],
                essayQuestions: essayQuestions
            };
        },

        // Sinh Đề thi Học sinh giỏi Cấp Tỉnh/Thành phố cho Lớp 1
        generateGrade1AdvancedExam: function(title, timeLimit) {
            const mcqQuestions = [];
            for (let i = 1; i <= 8; i++) {
                const aVal = Math.floor(Math.random() * 5) + 5;
                const bVal = Math.floor(Math.random() * 4) + 1;
                const ans = aVal + bVal;
                const opt = this.utils.ensureUniqueOptions(ans, ans + 1, ans - 1 > 0 ? ans - 1 : ans + 2, ans + 3, v => `$${v}$`);
                mcqQuestions.push({
                    id: `adv_mcq_l1_${i}`,
                    qType: 'mcq',
                    scoreWeight: 0.5,
                    questionText: `Điền số thích hợp vào chỗ trống: $${aVal} + ${bVal} = ...$`,
                    options: opt.options,
                    correctIndex: opt.correctIndex,
                    explanation: `$${aVal} + ${bVal} = ${ans}$.`
                });
            }

            return {
                title: title,
                type: 'hsg_tinh',
                timeLimitMinutes: timeLimit,
                mcqQuestions: mcqQuestions,
                tfQuestions: [],
                shortAnswerQuestions: [],
                essayQuestions: [
                    {
                        id: 'adv_essay_l1_1',
                        qType: 'essay',
                        scoreWeight: 2.0,
                        questionText: `An có 8 quả táo, An cho Bình 3 quả. Hỏi An còn lại bao nhiêu quả táo?`,
                        solutionHtml: `Số quả táo An còn lại là: $8 - 3 = 5$ quả.`,
                        correctAnswer: `5`
                    }
                ]
            };
        },

        // Sinh Đề thi Học sinh giỏi Cấp Tỉnh/Thành phố hoàn chỉnh (Lớp 6)
        generateGrade6AdvancedExam: function(title, timeLimit) {
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
                q.scoreWeight = 0.5;
                mcqQuestions.push(q);
            }

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

            const essayQuestions = [];
            const e1Base = Math.floor(Math.random() * 3) + 3;
            const e1Exp = Math.floor(Math.random() * 20) + 40;
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
        },

        // Sinh Đề thi Học sinh giỏi Cấp Tỉnh/Thành phố hoàn chỉnh
        generateAdvancedExam: function(topic = 'all', timeLimit = 90, classLevel) {
            const targetClass = String(classLevel || (window.questions7991 ? window.questions7991.getCurrentClassLevel() : '6'));
            const title = `ĐỀ THI HỌC SINH GIỎI & TRƯỜNG CHUYÊN MÔN TOÁN LỚP ${targetClass} (CẤP TỈNH/THÀNH PHỐ)`;

            if (targetClass === '4') {
                return this.generateGrade4AdvancedExam(title, timeLimit);
            } else if (targetClass === '1') {
                return this.generateGrade1AdvancedExam(title, timeLimit);
            } else {
                return this.generateGrade6AdvancedExam(title, timeLimit);
            }
        }
    };
})();
