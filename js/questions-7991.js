/**
 * Module quản lý đề thi định kỳ bám sát Công văn 7991/BGDĐT-GDTrH của Bộ GD&ĐT
 * và Trung tâm Khắc phục điểm yếu môn Toán Lớp 6
 * Hỗ trợ: In/Lưu PDF và Làm bài thi tương tác trực tiếp trên máy tính.
 */

(function() {
    window.questions7991 = {
        currentExamData: null,
        userAnswers: {},
        examTimerInterval: null,
        remainingSeconds: 3600,

        // Mở Modal Trung tâm Đề thi Định kỳ & Khắc phục điểm yếu
        openExamCenterModal: function(tab = 'exams') {
            const modal = document.getElementById("exam-7991-center-modal");
            if (modal) {
                modal.classList.remove("hidden");
                this.switchCenterTab(tab);
            }
        },

        closeExamCenterModal: function() {
            const modal = document.getElementById("exam-7991-center-modal");
            if (modal) modal.classList.add("hidden");
        },

        switchCenterTab: function(tab) {
            const examsTab = document.getElementById("center-tab-content-exams");
            const weaknessTab = document.getElementById("center-tab-content-weakness");
            const btnExams = document.getElementById("tab-btn-7991-exams");
            const btnWeakness = document.getElementById("tab-btn-7991-weakness");

            if (tab === 'exams') {
                if (examsTab) examsTab.classList.remove("hidden");
                if (weaknessTab) weaknessTab.classList.add("hidden");
                if (btnExams) {
                    btnExams.style.color = "#60a5fa";
                    btnExams.style.borderBottomColor = "#3b82f6";
                }
                if (btnWeakness) {
                    btnWeakness.style.color = "#94a3b8";
                    btnWeakness.style.borderBottomColor = "transparent";
                }
            } else {
                if (examsTab) examsTab.classList.add("hidden");
                if (weaknessTab) weaknessTab.classList.remove("hidden");
                if (btnExams) {
                    btnExams.style.color = "#94a3b8";
                    btnExams.style.borderBottomColor = "transparent";
                }
                if (btnWeakness) {
                    btnWeakness.style.color = "#f87171";
                    btnWeakness.style.borderBottomColor = "#ef4444";
                }
            }
        },

        normalizeAnswerStr: function(str) {
            if (!str) return "";
            let s = str.toString().toLowerCase();
            s = s.replace(/\s+/g, '');
            s = s.replace(/cm2/g, '');
            s = s.replace(/cm/g, '');
            s = s.replace(/m2/g, '');
            s = s.replace(/m/g, '');
            s = s.replace(/x=/g, '');
            s = s.replace(/đápsố:/g, '');
            s = s.replace(/đápsố/g, '');
            return s;
        },

        // Sinh đề thi định kỳ theo CV 7991 (Tỉ lệ 70% Trắc nghiệm + 30% Tự luận)
        generate7991Exam: function(type = 'gk1') {
            const isGK1 = (type === 'gk1');
            const examTitle = isGK1 ? "ĐỀ KIỂM TRA GIỮA HỌC KỲ I - MÔN TOÁN LỚP 6" : "ĐỀ KIỂM TRA CUỐI HỌC KỲ I - MÔN TOÁN LỚP 6";
            const timeLimit = isGK1 ? 60 : 90;

            const gk1Types = ["tap-hop", "ghi-so-tu-nhien", "tap-hop-thu-tu", "cong-tru-so-tu-nhien", "nhan-chia-so-tu-nhien", "luy-thua", "thu-tu-phep-tinh", "quan-he-chia-het", "dau-hieu-chia-het", "so-nguyen-to", "ucln", "bcnn"];
            const ck1Types = [...gk1Types, "tap-hop-so-nguyen", "cong-tru-so-nguyen", "dau-ngoac", "nhan-so-nguyen", "chia-het-uoc-boi-so-nguyen", "hinh-hoc-chuong-4", "hinh-hoc-2-chuong-4", "chu-vi-dien-tich", "truc-doi-xung", "tam-doi-xung"];
            const activeTypes = isGK1 ? gk1Types : ck1Types;

            // 1. Trắc nghiệm 4 lựa chọn (8 câu - 2,0 điểm)
            const mcqQuestions = [];
            const shuffledTypes = [...activeTypes].sort(() => Math.random() - 0.5);
            for (let i = 0; i < 8; i++) {
                const randomType = shuffledTypes[i % shuffledTypes.length];
                const level = i < 5 ? 'co-ban' : 'nang-cao';
                let q = null;
                if (window.questions && typeof window.questions.generateQuestion === 'function') {
                    q = window.questions.generateQuestion(randomType, level);
                } else {
                    q = { questionText: `Câu hỏi trắc nghiệm ${i+1}`, options: ["A. 10", "B. 20", "C. 30", "D. 40"], correctIndex: 0 };
                }
                q.id = `mcq_${i+1}`;
                q.qType = 'mcq';
                q.scoreWeight = 0.25;
                mcqQuestions.push(q);
            }

            // 2. Trắc nghiệm Đúng - Sai (2 câu lớn - 2,0 điểm) - BIẾN THIÊN NGẪU NHIÊN NGUỒN TEMPLATE
            const tfPool = [];

            // Template TF 1: ƯCLN & BCNN
            const a1 = (Math.floor(Math.random() * 5) + 2) * 6; // 12, 18, 24, 30, 36
            const b1 = (Math.floor(Math.random() * 4) + 2) * 4; // 8, 12, 16, 20
            const gcd1 = (typeof generator !== 'undefined' && generator.gcd) ? generator.gcd(a1, b1) : 4;
            const lcm1 = (typeof generator !== 'undefined' && generator.lcm) ? generator.lcm(a1, b1) : ((a1 * b1) / gcd1);
            tfPool.push({
                id: 'tf_gcd_lcm',
                qType: 'tf',
                scoreWeight: 1.0,
                questionText: `Cho hai số tự nhiên $a = ${a1}$ và $b = ${b1}$. Xét tính đúng/sai của các khẳng định sau:`,
                items: [
                    { id: 'a', statement: `Số $a = ${a1}$ chia hết cho 2 và 3.`, isCorrect: (a1 % 6 === 0), explanation: `$${a1}$ có tổng các chữ số chia hết cho 3 và chữ số tận cùng chẵn nên chia hết cho 6.` },
                    { id: 'b', statement: `Ước chung lớn nhất $\\text{ƯCLN}(${a1}, ${b1}) = ${gcd1}$.`, isCorrect: true, explanation: `Phân tích thừa số nguyên tố ta có $\\text{ƯCLN}(${a1}, ${b1}) = ${gcd1}$.` },
                    { id: 'c', statement: `Bội chung nhỏ nhất $\\text{BCNN}(${a1}, ${b1}) = ${lcm1 + 10}$.`, isCorrect: false, explanation: `$\\text{BCNN}(${a1}, ${b1}) = ${lcm1}$, khẳng định ghi ${lcm1 + 10} là Sai.` },
                    { id: 'd', statement: `Tích $a \\cdot b = \\text{ƯCLN}(a, b) \\cdot \\text{BCNN}(a, b) = ${a1 * b1}$.`, isCorrect: true, explanation: `Tính chất: tích hai số bằng tích giữa ƯCLN và BCNN của chúng.` }
                ]
            });

            // Template TF 2: Lũy thừa & Phép tính
            const base2 = Math.floor(Math.random() * 3) + 2; // 2, 3, 4
            const expA = Math.floor(Math.random() * 3) + 2;
            const expB = Math.floor(Math.random() * 3) + 2;
            const valA = Math.pow(base2, expA);
            const valB = Math.pow(base2, expB);
            tfPool.push({
                id: 'tf_power',
                qType: 'tf',
                scoreWeight: 1.0,
                questionText: `Cho các phép tính về lũy thừa với cơ số $${base2}$:`,
                items: [
                    { id: 'a', statement: `$${base2}^{${expA}} \\cdot ${base2}^{${expB}} = ${base2}^{${expA + expB}}$.`, isCorrect: true, explanation: `Nhân hai lũy thừa cùng cơ số: giữ nguyên cơ số và cộng các số mũ.` },
                    { id: 'b', statement: `Giá trị của $${base2}^{${expA}} = ${valA}$.`, isCorrect: true, explanation: `$${base2}^{${expA}} = ${valA}$.` },
                    { id: 'c', statement: `Tổng $${valA} + ${valB} = ${valA + valB}$ là một số nguyên tố.`, isCorrect: ((valA + valB) === 3 || (valA + valB) === 5 || (valA + valB) === 7 || (valA + valB) === 11 || (valA + valB) === 13 || (valA + valB) === 17 || (valA + valB) === 19), explanation: `Tổng bằng ${valA + valB}.` },
                    { id: 'd', statement: `Số $0$ và số $1$ là các số nguyên tố nhỏ nhất.`, isCorrect: false, explanation: `Số 0 và 1 không phải là số nguyên tố (số nguyên tố nhỏ nhất là 2).` }
                ]
            });

            // Template TF 3: Số nguyên & Giá trị tuyệt đối
            const zVal = Math.floor(Math.random() * 10) + 5;
            tfPool.push({
                id: 'tf_integer',
                qType: 'tf',
                scoreWeight: 1.0,
                questionText: `Cho số nguyên $x = -${zVal}$. Xét tính đúng/sai của các khẳng định sau:`,
                items: [
                    { id: 'a', statement: `Số đối của $-${zVal}$ là $${zVal}$.`, isCorrect: true, explanation: `Số đối của $-a$ là $a$.` },
                    { id: 'b', statement: `Giá trị tuyệt đối $|-${zVal}| = ${zVal}$.`, isCorrect: true, explanation: `Giá trị tuyệt đối của số âm luôn là một số dương.` },
                    { id: 'c', statement: `Tích $(-${zVal}) \\cdot (-2) = -${zVal * 2}$.`, isCorrect: false, explanation: `Tích hai số nguyên âm là số dương: $(-${zVal}) \\cdot (-2) = ${zVal * 2}$.` },
                    { id: 'd', statement: `Tổng $(-${zVal}) + ${zVal - 3} = -3$.`, isCorrect: true, explanation: `$(-${zVal}) + (${zVal - 3}) = -3$.` }
                ]
            });

            // Template TF 4: Hình học phẳng & Tính chất đối xứng
            const edgeA = Math.floor(Math.random() * 5) + 4;
            const edgeB = Math.floor(Math.random() * 4) + 3;
            tfPool.push({
                id: 'tf_geometry',
                qType: 'tf',
                scoreWeight: 1.0,
                questionText: `Xét các hình phẳng trong thực tiễn (hình chữ nhật, hình vuông, tam giác đều):`,
                items: [
                    { id: 'a', statement: `Hình vuông cạnh $${edgeA}\\text{ cm}$ có chu vi là $${edgeA * 4}\\text{ cm}$.`, isCorrect: true, explanation: `Chu vi hình vuông $P = 4a = ${edgeA * 4}\\text{ cm}$.` },
                    { id: 'b', statement: `Hình chữ nhật có chiều dài $${edgeA}\\text{ cm}$, chiều rộng $${edgeB}\\text{ cm}$ có diện tích là $${edgeA * edgeB}\\text{ cm}^2$.`, isCorrect: true, explanation: `Diện tích hình chữ nhật $S = a \\cdot b = ${edgeA * edgeB}\\text{ cm}^2$.` },
                    { id: 'c', statement: `Tam giác đều có 4 trục đối xứng.`, isCorrect: false, explanation: `Tam giác đều chỉ có 3 trục đối xứng.` },
                    { id: 'd', statement: `Hình lục giác đều có tâm đối xứng là giao điểm các đường chéo chính.`, isCorrect: true, explanation: `Hình lục giác đều có 1 tâm đối xứng.` }
                ]
            });

            // Random chọn 2 template Đúng/Sai
            const shuffledTF = tfPool.sort(() => Math.random() - 0.5);
            const tfQuestions = [shuffledTF[0], shuffledTF[1]];

            // 3. Trắc nghiệm Trả lời ngắn (2 câu - 3,0 điểm) - BIẾN THIÊN NGẪU NHIÊN
            const saPool = [];
            const n1 = Math.floor(Math.random() * 50) + 20;
            const n2 = Math.floor(Math.random() * 30) + 10;
            const constC = [100, 125, 200, 250][Math.floor(Math.random() * 4)];
            saPool.push({
                id: 'sa_calc',
                qType: 'sa',
                scoreWeight: 1.5,
                questionText: `Tính nhanh giá trị biểu thức: $A = (${n1} + ${constC}) + (${n2} - ${constC})$.`,
                correctAnswer: `${n1 + n2}`,
                solutionHtml: `Biến đổi nhóm hợp lý: $A = (${n1} + ${n2}) + (${constC} - ${constC}) = ${n1 + n2}$.`
            });

            const pA = Math.floor(Math.random() * 6) + 2;
            const pB = Math.floor(Math.random() * 8) + 2;
            const xSol = Math.floor(Math.random() * 8) + 2;
            const pRhs = pA * xSol + pB;
            saPool.push({
                id: 'sa_equation',
                qType: 'sa',
                scoreWeight: 1.5,
                questionText: `Tìm số tự nhiên $x$, biết: $${pA}x + ${pB} = ${pRhs}$.`,
                correctAnswer: `${xSol}`,
                solutionHtml: `Ta có: $${pA}x = ${pRhs} - ${pB} = ${pA * xSol} \\Rightarrow x = ${xSol}$.`
            });

            const sideSquare = Math.floor(Math.random() * 6) + 4;
            saPool.push({
                id: 'sa_geo_square',
                qType: 'sa',
                scoreWeight: 1.5,
                questionText: `Tính diện tích hình vuông (tính bằng $\\text{cm}^2$) biết chu vi của nó bằng $${sideSquare * 4}\\text{ cm}$.`,
                correctAnswer: `${sideSquare * sideSquare}`,
                solutionHtml: `Độ dài cạnh hình vuông $a = ${sideSquare * 4} : 4 = ${sideSquare}\\text{ cm}$. Diện tích $S = ${sideSquare}^2 = ${sideSquare * sideSquare}\\text{ cm}^2$.`
            });

            const zSol = Math.floor(Math.random() * 10) + 5;
            saPool.push({
                id: 'sa_integer_abs',
                qType: 'sa',
                scoreWeight: 1.5,
                questionText: `Tìm số nguyên dương $x$, biết: $|x - 2| = ${zSol - 2}$.`,
                correctAnswer: `${zSol}`,
                solutionHtml: `Vì $x$ nguyên dương nên $x - 2 = ${zSol - 2} \\Rightarrow x = ${zSol}$.`
            });

            const shuffledSA = saPool.sort(() => Math.random() - 0.5);
            const shortAnswerQuestions = [shuffledSA[0], shuffledSA[1]];

            // 4. Bài tập Tự luận (3 câu - 3,0 điểm) - BIẾN THIÊN NGẪU NHIÊN
            const essayPool1 = [
                {
                    questionText: `Thực hiện phép tính (tính hợp lý nếu có thể):<br>a) $A = ${Math.floor(Math.random()*15)+10} \\cdot ${Math.floor(Math.random()*5)+4} + ${Math.floor(Math.random()*15)+10} \\cdot ${Math.floor(Math.random()*5)+4}$<br>b) $B = 2^3 \\cdot 5 - 3^2 + 15$`,
                    solutionHtml: `a) Áp dụng tính chất phân phối.<br>b) $B = 8 \\cdot 5 - 9 + 15 = 46$.`,
                    correctAnswer: `46`
                },
                {
                    questionText: `Thực hiện phép tính số nguyên hợp lý:<br>a) $A = (-125) + 45 + (-75) + 55$<br>b) $B = (-5) \\cdot 8 \\cdot (-2) \\cdot 25$`,
                    solutionHtml: `a) $A = [(-125) + (-75)] + (45 + 55) = -200 + 100 = -100$.<br>b) $B = [(-5) \\cdot (-2)] \\cdot (8 \\cdot 25) = 10 \\cdot 200 = 2000$.`,
                    correctAnswer: `2000`
                }
            ];

            const essayPool2 = [
                {
                    questionText: `Học sinh lớp 6A khi xếp hàng 2, hàng 3, hàng 4 đều vừa đủ. Biết số học sinh trong khoảng từ 35 đến 50 học sinh. Tính số học sinh của lớp 6A.`,
                    solutionHtml: `Số học sinh $x \\in \\text{BC}(2, 3, 4) = \\text{BC}(12) = \\{12; 24; 36; 48; ...\\}$. Do $35 \\le x \\le 50$ nên $x = 36$ (hoặc 48). Giả sử số học sinh là 36.`,
                    correctAnswer: `36`
                },
                {
                    questionText: `Cô giáo muốn chia $48$ chiếc bút và $36$ quyển vở thành các phần thưởng sao cho số bút và số vở ở mỗi phần thưởng là như nhau. Hỏi có thể chia được nhiều nhất bao nhiêu phần thưởng?`,
                    solutionHtml: `Số phần thưởng nhiều nhất là $\\text{ƯCLN}(48, 36) = 12$ phần thưởng. Khi đó mỗi phần gồm 4 bút và 3 vở.`,
                    correctAnswer: `12`
                }
            ];

            const essayPool3 = [
                {
                    questionText: `Cho tổng $S = 1 + 3 + 3^2 + 3^3 + ... + 3^{99}$. Chứng minh rằng $S$ chia hết cho 4.`,
                    solutionHtml: `Nhóm 2 số hạng: $S = (1 + 3) + (3^2 + 3^3) + ... = 4 \\cdot (1 + 3^2 + ...) \\vdots 4$.`,
                    correctAnswer: `ĐPCM`
                },
                {
                    questionText: `Một khu vườn hình chữ nhật có chiều dài $15\\text{ m}$, chiều rộng $10\\text{ m}$. Người ta làm một lối đi xung quanh vườn rộng $1\\text{ m}$. Tính diện tích phần đất còn lại để trồng hoa.`,
                    solutionHtml: `Chiều dài phần trồng hoa là $15 - 2 = 13\\text{ m}$. Chiều rộng là $10 - 2 = 8\\text{ m}$. Diện tích trồng hoa $S = 13 \\cdot 8 = 104\\text{ m}^2$.`,
                    correctAnswer: `104 m2`
                }
            ];

            const essayQuestions = [
                { id: 'essay_1', qType: 'essay', scoreWeight: 1.0, ...essayPool1[Math.floor(Math.random() * essayPool1.length)] },
                { id: 'essay_2', qType: 'essay', scoreWeight: 1.0, ...essayPool2[Math.floor(Math.random() * essayPool2.length)] },
                { id: 'essay_3', qType: 'essay', scoreWeight: 1.0, ...essayPool3[Math.floor(Math.random() * essayPool3.length)] }
            ];

            return {
                title: examTitle,
                type: type,
                timeLimitMinutes: timeLimit,
                mcqQuestions: mcqQuestions,
                tfQuestions: tfQuestions,
                shortAnswerQuestions: shortAnswerQuestions,
                essayQuestions: essayQuestions
            };
        },

        // Mở làm bài thi Học sinh giỏi nâng cao trực tiếp
        startAdvancedExam: function() {
            this.closeExamCenterModal();
            if (window.questionsAdvanced) {
                this._launchAdvancedExam();
            } else {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Đang tải bộ dữ liệu Đề thi HSG Nâng cao...',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: () => { Swal.showLoading(); }
                    });
                }
                const script = document.createElement('script');
                script.src = 'js/questions-advanced.js?v=12.62';
                script.onload = () => {
                    this._launchAdvancedExam();
                };
                document.body.appendChild(script);
            }
        },

        _launchAdvancedExam: function() {
            this.currentExamData = window.questionsAdvanced.generateAdvancedExam('all', 90);
            this.userAnswers = { mcq: {}, tf: {}, sa: {}, essay: {} };
            this.remainingSeconds = (this.currentExamData.timeLimitMinutes || 90) * 60;

            const modal = document.getElementById("interactive-exam-7991-modal");
            const titleEl = document.getElementById("interactive-exam-title");
            if (titleEl) titleEl.innerText = this.currentExamData.title;
            if (modal) modal.classList.remove("hidden");

            this.renderInteractiveExamBody();
            this.startInteractiveTimer();
        },

        // In đề thi Học sinh giỏi nâng cao
        printAdvancedExam: function() {
            if (window.questionsAdvanced) {
                this._printAdvancedExam();
            } else {
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        title: 'Đang tải bộ dữ liệu Đề thi HSG Nâng cao...',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: () => { Swal.showLoading(); }
                    });
                }
                const script = document.createElement('script');
                script.src = 'js/questions-advanced.js?v=12.62';
                script.onload = () => {
                    this._printAdvancedExam();
                };
                document.body.appendChild(script);
            }
        },

        _printAdvancedExam: function() {
            const data = window.questionsAdvanced.generateAdvancedExam('all', 90);
            this.renderAndPrint7991Exam('ĐỀ THI HỌC SINH GIỎI MÔN TOÁN LỚP 6 - CẤP TỈNH/THÀNH PHỐ', data, true, '6', 90);
        },

        // Sinh đề thi Khắc phục điểm yếu môn Toán
        generateWeaknessExam: function(studentId = 'default') {
            const defaultWeakTypes = ["ucln-d3", "luy-thua-d3", "cong-tru-so-nguyen-d3", "chu-vi-dien-tich-d3", "bcnn-d3"];
            const questionsList = [];
            for (let i = 0; i < 10; i++) {
                const type = defaultWeakTypes[i % defaultWeakTypes.length];
                let q = null;
                if (window.questions && typeof window.questions.generateQuestion === 'function') {
                    q = window.questions.generateQuestion(type, 'kho');
                } else {
                    q = { questionText: `Câu hỏi nâng cao khắc phục điểm yếu ${i+1}`, options: ["A. 10", "B. 20", "C. 30", "D. 40"], correctIndex: 0 };
                }
                q.id = `weak_${i+1}`;
                q.level = 'kho';
                q.isWeaknessItem = true;
                questionsList.push(q);
            }

            return {
                title: "BÀI THI CHUYÊN SÂU KHẮC PHỤC ĐIỂM YẾU MÔN TOÁN",
                studentId: studentId,
                questions: questionsList
            };
        },

        // Khởi động làm bài thi 7991 tương tác trực tiếp trên máy
        start7991InteractiveExam: function(type = 'gk1') {
            this.closeExamCenterModal();
            this.currentExamData = this.generate7991Exam(type);
            this.userAnswers = { mcq: {}, tf: {}, sa: {}, essay: {} };
            this.remainingSeconds = this.currentExamData.timeLimitMinutes * 60;

            const modal = document.getElementById("interactive-exam-7991-modal");
            const titleEl = document.getElementById("interactive-exam-title");
            if (titleEl) titleEl.innerText = this.currentExamData.title;

            if (modal) modal.classList.remove("hidden");

            this.renderInteractiveExamBody();
            this.startInteractiveTimer();
        },

        // Bắt đầu làm bài thi Khắc phục điểm yếu trực tiếp trên máy
        startWeaknessInteractiveExam: function() {
            this.closeExamCenterModal();
            const weakExam = this.generateWeaknessExam('default');
            
            // Chuyển đổi sang dạng examData
            this.currentExamData = {
                title: weakExam.title,
                timeLimitMinutes: 45,
                mcqQuestions: weakExam.questions.map(q => { q.scoreWeight = 1.0; return q; }),
                tfQuestions: [],
                shortAnswerQuestions: [],
                essayQuestions: []
            };

            this.userAnswers = { mcq: {}, tf: {}, sa: {}, essay: {} };
            this.remainingSeconds = 45 * 60;

            const modal = document.getElementById("interactive-exam-7991-modal");
            const titleEl = document.getElementById("interactive-exam-title");
            if (titleEl) titleEl.innerText = this.currentExamData.title;

            if (modal) modal.classList.remove("hidden");

            this.renderInteractiveExamBody();
            this.startInteractiveTimer();
        },

        // Render giao diện làm bài thi trực tiếp 2 cột
        renderInteractiveExamBody: function() {
            const container = document.getElementById("interactive-exam-questions-container");
            const navGrid = document.getElementById("interactive-exam-nav-grid");
            if (!container || !navGrid) return;

            let html = "";
            let navHtml = "";
            let questionNumber = 1;

            // 1. Phần Trắc nghiệm MCQ
            if (this.currentExamData.mcqQuestions && this.currentExamData.mcqQuestions.length > 0) {
                html += `<div style="font-size: 1.1rem; font-weight: 800; color: #60a5fa; border-bottom: 2px solid rgba(59, 130, 246, 0.4); padding-bottom: 0.5rem; margin-bottom: 1rem;">PHẦN I. TRẮC NGHỆM 4 LỰA CHỌN (8 CÂU)</div>`;
                this.currentExamData.mcqQuestions.forEach((q, idx) => {
                    const qId = q.id || `mcq_${idx+1}`;
                    const qNum = questionNumber++;
                    navHtml += `<button id="nav_btn_${qId}" onclick="document.getElementById('q_box_${qId}').scrollIntoView({behavior:'smooth'});" style="background: rgba(255,255,255,0.06); color: white; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 0.5rem; font-weight: 700; font-size: 0.85rem; cursor: pointer; text-align: center;">${qNum}</button>`;

                    let optionsHtml = `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 0.8rem; margin-top: 1rem;">`;
                    q.options.forEach((opt, oIdx) => {
                        const letter = ["A", "B", "C", "D"][oIdx];
                        const cleanOpt = opt.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim();
                        optionsHtml += `
                            <label style="background: rgba(15, 23, 42, 0.6); border: 1.5px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 0.8rem 1.2rem; cursor: pointer; display: flex; align-items: center; gap: 0.8rem; transition: all 0.2s;" class="opt-label-${qId}">
                                <input type="radio" name="radio_${qId}" value="${oIdx}" onchange="questions7991.selectMCQAnswer('${qId}', ${oIdx});" style="width: 18px; height: 18px; accent-color: #3b82f6;">
                                <span style="font-weight: 800; color: #60a5fa;">${letter}.</span>
                                <span style="font-size: 0.95rem;">${cleanOpt}</span>
                            </label>
                        `;
                    });
                    optionsHtml += `</div>`;

                    html += `
                        <div id="q_box_${qId}" style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.5rem; scroll-margin-top: 2rem;">
                            <div style="font-weight: 700; font-size: 1rem; line-height: 1.6; margin-bottom: 0.5rem;" class="math-render">
                                <span style="color: #60a5fa; font-weight: 800;">Câu ${qNum}:</span> ${q.questionText}
                            </div>
                            ${optionsHtml}
                        </div>
                    `;
                });
            }

            // 2. Phần Trắc nghiệm Đúng / Sai
            if (this.currentExamData.tfQuestions && this.currentExamData.tfQuestions.length > 0) {
                html += `<div style="font-size: 1.1rem; font-weight: 800; color: #a855f7; border-bottom: 2px solid rgba(168, 85, 247, 0.4); padding-bottom: 0.5rem; margin-top: 1rem; margin-bottom: 1rem;">PHẦN II. TRẮC NGHỆM ĐÚNG - SAI (2 CÂU LỚN)</div>`;
                this.currentExamData.tfQuestions.forEach((q, idx) => {
                    const qId = q.id || `tf_${idx+1}`;
                    const qNum = questionNumber++;
                    navHtml += `<button id="nav_btn_${qId}" onclick="document.getElementById('q_box_${qId}').scrollIntoView({behavior:'smooth'});" style="background: rgba(255,255,255,0.06); color: white; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 0.5rem; font-weight: 700; font-size: 0.85rem; cursor: pointer; text-align: center;">${qNum}</button>`;

                    let itemsHtml = `<div style="display: flex; flex-direction: column; gap: 0.8rem; margin-top: 1rem;">`;
                    q.items.forEach(item => {
                        itemsHtml += `
                            <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 0.9rem 1.2rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem;">
                                <div class="math-render" style="font-size: 0.92rem; flex: 1;"><b style="color:#c084fc;">${item.id})</b> ${item.statement}</div>
                                <div style="display: flex; gap: 0.6rem;">
                                    <button id="btn_tf_${qId}_${item.id}_true" onclick="questions7991.selectTFAnswer('${qId}', '${item.id}', true);" style="background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid #10b981; padding: 0.4rem 1rem; border-radius: 8px; font-weight: 800; cursor: pointer; font-size: 0.85rem;">ĐÚNG</button>
                                    <button id="btn_tf_${qId}_${item.id}_false" onclick="questions7991.selectTFAnswer('${qId}', '${item.id}', false);" style="background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid #ef4444; padding: 0.4rem 1rem; border-radius: 8px; font-weight: 800; cursor: pointer; font-size: 0.85rem;">SAI</button>
                                </div>
                            </div>
                        `;
                    });
                    itemsHtml += `</div>`;

                    html += `
                        <div id="q_box_${qId}" style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.5rem; scroll-margin-top: 2rem;">
                            <div style="font-weight: 700; font-size: 1rem; line-height: 1.6;" class="math-render">
                                <span style="color: #c084fc; font-weight: 800;">Câu ${qNum}:</span> ${q.questionText}
                            </div>
                            ${itemsHtml}
                        </div>
                    `;
                });
            }

            // 3. Phần Trắc nghiệm Trả lời ngắn
            if (this.currentExamData.shortAnswerQuestions && this.currentExamData.shortAnswerQuestions.length > 0) {
                html += `<div style="font-size: 1.1rem; font-weight: 800; color: #f59e0b; border-bottom: 2px solid rgba(245, 158, 11, 0.4); padding-bottom: 0.5rem; margin-top: 1rem; margin-bottom: 1rem;">PHẦN III. TRẮC NGHỆM TRẢ LỜI NGẮN (2 CÂU)</div>`;
                this.currentExamData.shortAnswerQuestions.forEach((q, idx) => {
                    const qId = q.id || `sa_${idx+1}`;
                    const qNum = questionNumber++;
                    navHtml += `<button id="nav_btn_${qId}" onclick="document.getElementById('q_box_${qId}').scrollIntoView({behavior:'smooth'});" style="background: rgba(255,255,255,0.06); color: white; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 0.5rem; font-weight: 700; font-size: 0.85rem; cursor: pointer; text-align: center;">${qNum}</button>`;

                    html += `
                        <div id="q_box_${qId}" style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.5rem; scroll-margin-top: 2rem;">
                            <div style="font-weight: 700; font-size: 1rem; line-height: 1.6; margin-bottom: 1rem;" class="math-render">
                                <span style="color: #f59e0b; font-weight: 800;">Câu ${qNum}:</span> ${q.questionText}
                            </div>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <label style="font-weight: 700; color: #cbd5e1; font-size: 0.9rem;">Đáp số của con:</label>
                                <input type="text" id="input_sa_${qId}" oninput="questions7991.inputSAAnswer('${qId}', this.value);" placeholder="Nhập đáp số gọn (ví dụ: 36 hoặc 42)..." style="background: rgba(15, 23, 42, 0.8); border: 1.5px solid #f59e0b; border-radius: 10px; color: white; padding: 0.6rem 1rem; font-size: 1rem; font-weight: 700; width: 250px;">
                            </div>
                        </div>
                    `;
                });
            }

            // 4. Phần Bài tập Tự luận
            if (this.currentExamData.essayQuestions && this.currentExamData.essayQuestions.length > 0) {
                html += `<div style="font-size: 1.1rem; font-weight: 800; color: #10b981; border-bottom: 2px solid rgba(16, 185, 129, 0.4); padding-bottom: 0.5rem; margin-top: 1rem; margin-bottom: 1rem;">PHẦN IV. BÀI TẬP TỰ LUẬN (3 BÀI TRÌNH BÀY CHI TIẾT)</div>`;
                this.currentExamData.essayQuestions.forEach((q, idx) => {
                    const qId = q.id || `essay_${idx+1}`;
                    const qNum = questionNumber++;
                    navHtml += `<button id="nav_btn_${qId}" onclick="document.getElementById('q_box_${qId}').scrollIntoView({behavior:'smooth'});" style="background: rgba(255,255,255,0.06); color: white; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 0.5rem; font-weight: 700; font-size: 0.85rem; cursor: pointer; text-align: center;">${qNum}</button>`;

                    html += `
                        <div id="q_box_${qId}" style="background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 1.5rem; scroll-margin-top: 2rem;">
                            <div style="font-weight: 700; font-size: 1rem; line-height: 1.6; margin-bottom: 1rem;" class="math-render">
                                <span style="color: #10b981; font-weight: 800;">Bài ${idx+1} (${q.scoreWeight} điểm):</span> ${q.questionText}
                            </div>
                            <div style="display: flex; flex-direction: column; gap: 0.6rem;">
                                <label style="font-weight: 700; color: #cbd5e1; font-size: 0.85rem;">Bài làm / Lời giải chi tiết của con:</label>
                                <textarea id="textarea_essay_${qId}" oninput="questions7991.inputEssayAnswer('${qId}', this.value);" rows="4" placeholder="Nhập lời giải hoặc kết quả các bước biến đổi tại đây..." style="background: rgba(15, 23, 42, 0.8); border: 1.5px solid rgba(16, 185, 129, 0.4); border-radius: 12px; color: white; padding: 0.9rem; font-size: 0.95rem; line-height: 1.5; font-family: sans-serif; resize: vertical;"></textarea>
                            </div>
                        </div>
                    `;
                });
            }

            container.innerHTML = html;
            navGrid.innerHTML = navHtml;

            // Trigger KaTeX render
            try {
                if (window.renderMathInElement) {
                    window.renderMathInElement(container, {
                        delimiters: [
                            {left: "$$", right: "$$", display: true},
                            {left: "$", right: "$", display: false},
                            {left: "\\(", right: "\\)", display: false},
                            {left: "\\[", right: "\\]", display: true}
                        ],
                        throwOnError: false
                    });
                }
            } catch (e) {
                console.warn("KaTeX render interactive err:", e);
            }
        },

        selectMCQAnswer: function(qId, optionIdx) {
            this.userAnswers.mcq[qId] = optionIdx;
            this.updateNavButtonState(qId, true);
        },

        selectTFAnswer: function(qId, itemId, isTrue) {
            if (!this.userAnswers.tf[qId]) this.userAnswers.tf[qId] = {};
            this.userAnswers.tf[qId][itemId] = isTrue;

            const btnTrue = document.getElementById(`btn_tf_${qId}_${itemId}_true`);
            const btnFalse = document.getElementById(`btn_tf_${qId}_${itemId}_false`);
            if (isTrue) {
                if (btnTrue) { btnTrue.style.background = "#10b981"; btnTrue.style.color = "#white"; }
                if (btnFalse) { btnFalse.style.background = "rgba(239, 68, 68, 0.15)"; btnFalse.style.color = "#ef4444"; }
            } else {
                if (btnFalse) { btnFalse.style.background = "#ef4444"; btnFalse.style.color = "#white"; }
                if (btnTrue) { btnTrue.style.background = "rgba(16, 185, 129, 0.15)"; btnTrue.style.color = "#10b981"; }
            }

            const answeredCount = Object.keys(this.userAnswers.tf[qId]).length;
            this.updateNavButtonState(qId, answeredCount > 0);
        },

        inputSAAnswer: function(qId, val) {
            this.userAnswers.sa[qId] = val.trim();
            this.updateNavButtonState(qId, val.trim().length > 0);
        },

        inputEssayAnswer: function(qId, val) {
            this.userAnswers.essay[qId] = val.trim();
            this.updateNavButtonState(qId, val.trim().length > 0);
        },

        updateNavButtonState: function(qId, isAnswered) {
            const btn = document.getElementById(`nav_btn_${qId}`);
            if (btn) {
                if (isAnswered) {
                    btn.style.background = "#2563eb";
                    btn.style.borderColor = "#60a5fa";
                } else {
                    btn.style.background = "rgba(255,255,255,0.06)";
                    btn.style.borderColor = "rgba(255,255,255,0.15)";
                }
            }
        },

        // Đồng hồ đếm ngược bài thi
        startInteractiveTimer: function() {
            if (this.examTimerInterval) clearInterval(this.examTimerInterval);
            const timerEl = document.getElementById("interactive-exam-timer");

            this.examTimerInterval = setInterval(() => {
                this.remainingSeconds--;
                if (this.remainingSeconds <= 0) {
                    clearInterval(this.examTimerInterval);
                    alert("Thời gian làm bài thi đã hết! Hệ thống tự động nộp bài.");
                    this.submit7991ExamInteractive();
                    return;
                }

                const mins = Math.floor(this.remainingSeconds / 60);
                const secs = this.remainingSeconds % 60;
                if (timerEl) {
                    timerEl.innerText = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
                    if (this.remainingSeconds < 300) {
                        timerEl.style.color = "#ef4444";
                    }
                }
            }, 1000);
        },

        // Tự động chấm điểm & hiển thị Báo cáo Khảo thí
        submit7991ExamInteractive: function() {
            if (this.examTimerInterval) clearInterval(this.examTimerInterval);
            const modalInteractive = document.getElementById("interactive-exam-7991-modal");
            if (modalInteractive) modalInteractive.classList.add("hidden");

            let mcqScore = 0;
            let tfScore = 0;
            let saScore = 0;
            let essayScore = 0;

            // 1. Chấm MCQ (0.25đ/câu)
            if (this.currentExamData.mcqQuestions) {
                this.currentExamData.mcqQuestions.forEach((q, idx) => {
                    const qId = q.id || `mcq_${idx+1}`;
                    const userSel = this.userAnswers.mcq[qId];
                    if (userSel !== undefined && userSel === (q.correctIndex || 0)) {
                        mcqScore += (q.scoreWeight || 0.25);
                    }
                });
            }

            // 2. Chấm Đúng - Sai (1 câu lớn 4 ý: 1 ý=0.1đ, 2 ý=0.25đ, 3 ý=0.5đ, 4 ý=1.0đ)
            if (this.currentExamData.tfQuestions) {
                this.currentExamData.tfQuestions.forEach((q, idx) => {
                    const qId = q.id || `tf_${idx+1}`;
                    const userObj = this.userAnswers.tf[qId] || {};
                    let correctCount = 0;
                    q.items.forEach(item => {
                        if (userObj[item.id] !== undefined && userObj[item.id] === item.isCorrect) {
                            correctCount++;
                        }
                    });

                    let weight = 0;
                    if (correctCount === 1) weight = 0.1;
                    else if (correctCount === 2) weight = 0.25;
                    else if (correctCount === 3) weight = 0.5;
                    else if (correctCount === 4) weight = 1.0;

                    tfScore += weight;
                });
            }

            // 3. Chấm Trả lời ngắn (1.5đ/câu)
            if (this.currentExamData.shortAnswerQuestions) {
                this.currentExamData.shortAnswerQuestions.forEach((q, idx) => {
                    const qId = q.id || `sa_${idx+1}`;
                    const userVal = this.normalizeAnswerStr(this.userAnswers.sa[qId] || "");
                    const correctVal = this.normalizeAnswerStr(q.correctAnswer || "");
                    if (userVal === correctVal && userVal !== "") {
                        saScore += (q.scoreWeight || 1.5);
                    }
                });
            }

            // 4. Chấm Tự luận (Giả định gõ đúng kết quả cuối hoặc tính điểm tham chiếu)
            if (this.currentExamData.essayQuestions) {
                this.currentExamData.essayQuestions.forEach((q, idx) => {
                    const qId = q.id || `essay_${idx+1}`;
                    const userVal = (this.userAnswers.essay[qId] || "").trim();
                    if (userVal.length > 0) {
                        essayScore += (q.scoreWeight || 1.0);
                    }
                });
            }

            const totalScore = (mcqScore + tfScore + saScore + essayScore).toFixed(2);

            if (window.app && typeof window.app.saveExamResult === 'function') {
                window.app.saveExamResult({
                    title: this.currentExamData.title,
                    score: totalScore,
                    date: new Date().toISOString()
                });
            }

            // Mở preview PDF với kết quả đã làm
            this.renderAndPrint7991Exam(this.currentExamData.title, this.currentExamData, true, '6', this.currentExamData.timeLimitMinutes);
            alert(`🎉 CHÚC MỪNG CON ĐÃ HOÀN THÀNH BÀI THI!\n\n🏆 Tổng điểm đạt được: ${totalScore} / 10.0 điểm\n- Trắc nghiệm MCQ: ${mcqScore.toFixed(2)}đ\n- Trắc nghiệm Đúng/Sai: ${tfScore.toFixed(2)}đ\n- Trắc nghiệm Trả lời ngắn: ${saScore.toFixed(2)}đ\n- Tự luận: ${essayScore.toFixed(2)}đ (Điểm tự luận mang tính chất tham khảo, Phụ huynh vui lòng kiểm tra đối chiếu chi tiết bài làm)\n\nHệ thống đã mở bản Báo cáo Khảo thí & Ma trận Năng lực kèm nút In/Tải PDF.`);
        },

        // Export/In đề 7991 ra giao diện Modal & hỗ trợ Lưu PDF
        renderAndPrint7991Exam: function(examTitle, examData, includeSolution = true, classLevel = '6', timeLimitMinutes = 60) {
            const schoolName = (window.app && app.config && app.config.schoolName) || "HỆ THỐNG GIÁO DỤC CÁ NHÂN HÓA AI";
            const defaultStudentName = (window.app && app.config && app.config.studentName) || "......................................................................";

            let html = `
                <div class="print-exam-page text-black bg-white" style="font-family: 'Times New Roman', Times, Georgia, serif; line-height: 1.5; color: #000000; padding: 25px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #000000; padding-bottom: 10px; margin-bottom: 15px;">
                        <div style="text-align: center; font-weight: bold; font-size: 11px; text-transform: uppercase; width: 45%;">
                            <p style="margin: 0;">SỞ GIÁO DỤC VÀ ĐÀO TẠO</p>
                            <p style="margin: 2px 0 0 0; font-weight: bold;">${schoolName}</p>
                            <p style="font-size: 9px; font-weight: normal; font-style: italic; margin-top: 3px;">(Chuẩn Công văn 7991/BGDĐT-GDTrH)</p>
                        </div>
                        <div style="text-align: center; font-weight: bold; font-size: 12px; text-transform: uppercase; width: 52%;">
                            <p style="margin: 0;">${examTitle}</p>
                            <p style="font-size: 11px; font-weight: bold; font-style: italic; text-transform: none; margin-top: 4px;">Môn: TOÁN LỚP ${classLevel} - Năm học 2025-2026</p>
                            <p style="font-size: 10px; font-weight: normal; font-style: italic; margin-top: 2px;">Thời gian làm bài: ${timeLimitMinutes} phút (Không kể thời gian phát đề)</p>
                        </div>
                    </div>

                    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; font-size: 12.5px; margin-bottom: 15px; line-height: 1.8;">
                        <div style="width: 55%;">Họ và tên học sinh: <span style="font-weight: bold;">${defaultStudentName}</span></div>
                        <div style="width: 42%;">Mã đề thi: <span style="font-weight: bold;">7991-KNTT-0${Math.floor(Math.random() * 9) + 1}</span></div>
                        <div style="width: 55%;">Lớp: ....................................................................</div>
                        <div style="width: 42%;">Ngày kiểm tra: ....../....../2026</div>
                    </div>

                    <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #000000; margin-bottom: 20px; font-size: 12px; text-align: center;">
                        <thead>
                            <tr style="background-color: #f8fafc; font-weight: bold;">
                                <th style="border: 1px solid #000000; padding: 6px; width: 25%;">ĐIỂM TOÀN BÀI</th>
                                <th style="border: 1px solid #000000; padding: 6px; width: 25%;">ĐIỂM TRẮC NGHỆM</th>
                                <th style="border: 1px solid #000000; padding: 6px; width: 25%;">ĐIỂM TỰ LUẬN</th>
                                <th style="border: 1px solid #000000; padding: 6px;">HỌ TÊN, CHỮ KÝ GIÁO VIÊN/PHỤ HUYNH</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="height: 50px;">
                                <td style="border: 1px solid #000000; font-size: 16px; font-weight: bold;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                            </tr>
                        </tbody>
                    </table>

                    <div style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 10px; background: #f1f5f9; padding: 4px 8px; border-left: 4px solid #000000;">
                        PHẦN I. TRẮC NGHỆM KHÁCH QUAN (7,0 điểm)
                    </div>

                    <div style="font-weight: bold; font-size: 12px; margin-bottom: 8px;">
                        1. Trắc nghiệm lựa chọn đáp án (2,0 điểm - Chọn 1 đáp án đúng duy nhất)
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
            `;

            examData.mcqQuestions.forEach((q, idx) => {
                const cleanText = q.questionText.replace(/<br\s*\/?>/gi, '<br/>');
                let optionsHtml = `<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; margin-top: 6px; padding-left: 15px; font-size: 12px;">`;
                q.options.forEach((opt, oIdx) => {
                    const letter = ["A", "B", "C", "D"][oIdx];
                    const cleanOpt = opt.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim();
                    optionsHtml += `<div><span style="font-weight: bold;">${letter}.</span> ${cleanOpt}</div>`;
                });
                optionsHtml += `</div>`;

                html += `
                    <div style="page-break-inside: avoid; break-inside: avoid;">
                        <div class="math-render" style="font-size: 12.5px; font-weight: 600;">
                            Câu ${idx + 1}: ${cleanText}
                        </div>
                        ${optionsHtml}
                    </div>
                `;
            });

            html += `
                </div>
                <div style="font-weight: bold; font-size: 12px; margin-bottom: 8px; margin-top: 15px;">
                    2. Trắc nghiệm Đúng - Sai (2,0 điểm - Chọn Đúng hoặc Sai cho mỗi ý a, b, c, d)
                </div>
                <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 20px;">
            `;

            examData.tfQuestions.forEach((q, idx) => {
                html += `
                    <div style="page-break-inside: avoid; break-inside: avoid;">
                        <div class="math-render" style="font-size: 12.5px; font-weight: 600; margin-bottom: 6px;">
                            Câu ${idx + 9}: ${q.questionText}
                        </div>
                        <table style="width: 100%; border-collapse: collapse; border: 1px solid #000000; font-size: 12px;">
                            <thead>
                                <tr style="background-color: #f8fafc; text-align: center; font-weight: bold;">
                                    <td style="border: 1px solid #000000; padding: 4px; width: 70%;">Mệnh đề / Khẳng định</td>
                                    <td style="border: 1px solid #000000; padding: 4px; width: 15%;">ĐÚNG</td>
                                    <td style="border: 1px solid #000000; padding: 4px; width: 15%;">SAI</td>
                                </tr>
                            </thead>
                            <tbody>
                `;
                q.items.forEach(item => {
                    html += `
                        <tr>
                            <td class="math-render" style="border: 1px solid #000000; padding: 6px; vertical-align: middle;"><b>${item.id})</b> ${item.statement}</td>
                            <td style="border: 1px solid #000000; text-align: center; vertical-align: middle;"><span style="display: inline-block; width: 14px; height: 14px; border: 1px solid #000;"></span></td>
                            <td style="border: 1px solid #000000; text-align: center; vertical-align: middle;"><span style="display: inline-block; width: 14px; height: 14px; border: 1px solid #000;"></span></td>
                        </tr>
                    `;
                });
                html += `
                            </tbody>
                        </table>
                    </div>
                `;
            });

            html += `
                </div>
                <div style="font-weight: bold; font-size: 12px; margin-bottom: 8px; margin-top: 15px;">
                    3. Trắc nghiệm trả lời ngắn (3,0 điểm - Điền đáp số vào chỗ trống)
                </div>
                <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px;">
            `;

            examData.shortAnswerQuestions.forEach((q, idx) => {
                html += `
                    <div style="page-break-inside: avoid; break-inside: avoid; line-height: 1.6;">
                        <div class="math-render" style="font-size: 12.5px; font-weight: 600;">
                            Câu ${idx + 11}: ${q.questionText}
                        </div>
                        <div style="font-size: 12px; margin-top: 4px; font-weight: bold; color: #1e293b;">
                            Đáp số: ................................................................................................................................
                        </div>
                    </div>
                `;
            });

            html += `
                </div>
                <div style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 10px; background: #f1f5f9; padding: 4px 8px; border-left: 4px solid #000000;">
                    PHẦN II. TỰ LUẬN (3,0 điểm - Trình bày bài làm chi tiết từng bước)
                </div>
                <div style="display: flex; flex-direction: column; gap: 20px;">
            `;

            examData.essayQuestions.forEach((q, idx) => {
                html += `
                    <div style="page-break-inside: avoid; break-inside: avoid;">
                        <div class="math-render" style="font-size: 12.5px; font-weight: bold; margin-bottom: 6px;">
                            Bài ${idx + 1} (${q.scoreWeight} điểm): ${q.questionText}
                        </div>
                        <div style="border: 1px dashed #94a3b8; padding: 12px; min-height: 120px; font-size: 12px; color: #64748b; font-style: italic; border-radius: 4px;">
                            Bài làm:<br><br><br><br><br>
                        </div>
                    </div>
                `;
            });

            html += `
                </div>
                <div style="margin-top: 30px; border-top: 1px solid #d1d5db; padding-top: 6px; text-align: center; font-size: 9px; color: #4b5563; font-style: italic;">
                    © Copyright by Trần Hải Đăng - Khoa Binh chủng, Trường Quân sự Quân khu 3 (Hotline: 0978396032). All rights reserved.
                </div>
                </div>
            `;

            if (includeSolution) {
                html += `
                    <div class="print-page-break" style="margin-top: 40px;"></div>
                    <div class="print-exam-page text-black bg-white" style="font-family: 'Times New Roman', Times, Georgia, serif; line-height: 1.5; color: #000000; margin-top: 20px; padding: 25px;">
                        <div style="text-align: center; font-weight: bold; font-size: 14px; text-transform: uppercase; border-bottom: 2px solid #000000; padding-bottom: 8px; margin-bottom: 15px;">
                            ĐÁP ÁN, HƯỚNG DẪN CHẤM & MA TRẬN ĐẶC TẢ ĐÁNH GIÁ NĂNG LỰC
                        </div>
                        <p style="font-size: 12px; font-weight: bold; text-align: center; margin-bottom: 15px;">(Theo Công văn 7991/BGDĐT-GDTrH của Bộ Giáo dục & Đào tạo)</p>

                        <div style="font-weight: bold; font-size: 12px; margin-bottom: 6px; text-transform: uppercase;">
                            I. MA TRẬN ĐỀ KIỂM TRA ĐỊNH KỲ (TỈ LỆ 40% NHẬN BIẾT - 30% THÔNG HIỂU - 30% VẬN DỤNG)
                        </div>
                        <table style="width: 100%; border-collapse: collapse; border: 1px solid #000000; text-align: center; font-size: 11px; margin-bottom: 20px;">
                            <thead>
                                <tr style="background-color: #f1f5f9; font-weight: bold;">
                                    <td style="border: 1px solid #000; padding: 4px;" rowspan="2">Chủ đề kiến thức</td>
                                    <td style="border: 1px solid #000; padding: 4px;" colspan="3">Mức độ đánh giá năng lực</td>
                                    <td style="border: 1px solid #000; padding: 4px;" rowspan="2">Tổng điểm</td>
                                </tr>
                                <tr style="background-color: #f8fafc; font-weight: bold;">
                                    <td style="border: 1px solid #000; padding: 4px;">Nhận biết (40%)</td>
                                    <td style="border: 1px solid #000; padding: 4px;">Thông hiểu (30%)</td>
                                    <td style="border: 1px solid #000; padding: 4px;">Vận dụng (30%)</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="border: 1px solid #000; padding: 4px; text-align: left;">1. Số tự nhiên & Tính chia hết</td>
                                    <td style="border: 1px solid #000; padding: 4px;">3 câu TN (0,75đ)</td>
                                    <td style="border: 1px solid #000; padding: 4px;">1 câu TF (1,0đ)</td>
                                    <td style="border: 1px solid #000; padding: 4px;">1 Bài TL (1,0đ)</td>
                                    <td style="border: 1px solid #000; padding: 4px; font-weight: bold;">2.75đ</td>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid #000; padding: 4px; text-align: left;">2. Số nguyên & Phép tính</td>
                                    <td style="border: 1px solid #000; padding: 4px;">3 câu TN (0,75đ)</td>
                                    <td style="border: 1px solid #000; padding: 4px;">1 câu SA (1,5đ)</td>
                                    <td style="border: 1px solid #000; padding: 4px;">1 Bài TL (1,0đ)</td>
                                    <td style="border: 1px solid #000; padding: 4px; font-weight: bold;">3.25đ</td>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid #000; padding: 4px; text-align: left;">3. Hình học phẳng & Đối xứng</td>
                                    <td style="border: 1px solid #000; padding: 4px;">2 câu TN (0,5đ)</td>
                                    <td style="border: 1px solid #000; padding: 4px;">1 câu TF (1,0đ)</td>
                                    <td style="border: 1px solid #000; padding: 4px;">1 Bài TL (1,0đ)</td>
                                    <td style="border: 1px solid #000; padding: 4px; font-weight: bold;">2.50đ</td>
                                </tr>
                                <tr>
                                    <td style="border: 1px solid #000; padding: 4px; text-align: left;">4. Trả lời ngắn & Vận dụng cao</td>
                                    <td style="border: 1px solid #000; padding: 4px;">-</td>
                                    <td style="border: 1px solid #000; padding: 4px;">1 câu SA (1,5đ)</td>
                                    <td style="border: 1px solid #000; padding: 4px;">-</td>
                                    <td style="border: 1px solid #000; padding: 4px; font-weight: bold;">1.50đ</td>
                                </tr>
                            </tbody>
                        </table>

                        <div style="font-weight: bold; font-size: 12px; margin-bottom: 6px; text-transform: uppercase;">
                            II. ĐÁP ÁN TRẮC NGHỆM 4 LỰA CHỌN (8 CÂU)
                        </div>
                        <table style="width: 100%; border-collapse: collapse; border: 1px solid #000000; text-align: center; font-size: 11px; margin-bottom: 15px;">
                            <thead>
                                <tr style="background-color: #f1f5f9; font-weight: bold;">
                                    <td style="border: 1px solid #000; padding: 4px;">Câu</td>
                                    <td style="border: 1px solid #000; padding: 4px;">1</td>
                                    <td style="border: 1px solid #000; padding: 4px;">2</td>
                                    <td style="border: 1px solid #000; padding: 4px;">3</td>
                                    <td style="border: 1px solid #000; padding: 4px;">4</td>
                                    <td style="border: 1px solid #000; padding: 4px;">5</td>
                                    <td style="border: 1px solid #000; padding: 4px;">6</td>
                                    <td style="border: 1px solid #000; padding: 4px;">7</td>
                                    <td style="border: 1px solid #000; padding: 4px;">8</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="font-weight: bold; color: #10b981;">
                                    <td style="border: 1px solid #000; padding: 4px; background: #f8fafc; color: #000;">Đáp án</td>
                `;

                examData.mcqQuestions.forEach(q => {
                    const correctLetter = ["A", "B", "C", "D"][q.correctIndex || 0];
                    html += `<td style="border: 1px solid #000; padding: 4px;">${correctLetter}</td>`;
                });

                html += `
                                </tr>
                            </tbody>
                        </table>

                        <div style="font-weight: bold; font-size: 12px; margin-bottom: 6px; text-transform: uppercase;">
                            III. ĐÁP ÁN TRẮC NGHỆM ĐÚNG - SAI (2 CÂU LỚN)
                        </div>
                        <div style="display: flex; gap: 15px; margin-bottom: 15px; font-size: 11.5px;">
                `;

                examData.tfQuestions.forEach((q, idx) => {
                    html += `
                        <div style="flex: 1; border: 1px solid #000; padding: 6px;">
                            <div style="font-weight: bold; margin-bottom: 4px;">Câu ${idx + 9}:</div>
                    `;
                    q.items.forEach(item => {
                        html += `<div><b>${item.id})</b> ${item.isCorrect ? '<span style="color:#10b981; font-weight:bold;">ĐÚNG</span>' : '<span style="color:#ef4444; font-weight:bold;">SAI</span>'} - <i>${item.explanation}</i></div>`;
                    });
                    html += `</div>`;
                });

                html += `
                        </div>

                        <div style="font-weight: bold; font-size: 12px; margin-bottom: 6px; text-transform: uppercase;">
                            IV. HƯỚNG DẪN GIẢI CHI TIẾT PHẦN TỰ LUẬN
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 12px; font-size: 12px;">
                `;

                examData.essayQuestions.forEach((q, idx) => {
                    html += `
                        <div style="border-bottom: 1px dashed #cbd5e1; padding-bottom: 8px;">
                            <div style="font-weight: bold;">Bài ${idx + 1} (${q.scoreWeight} điểm):</div>
                            <div class="math-render" style="padding-left: 10px; border-left: 2px solid #3b82f6; margin-top: 4px;">${q.solutionHtml}</div>
                        </div>
                    `;
                });

                html += `
                        </div>
                        <div style="margin-top: 25px; border-top: 1px solid #d1d5db; padding-top: 6px; text-align: center; font-size: 9px; color: #4b5563; font-style: italic;">
                            © Copyright by Trần Hải Đăng - Khoa Binh chủng, Trường Quân sự Quân khu 3 (Hotline: 0978396032). All rights reserved.
                        </div>
                    </div>
                `;
            }

            if (window.questions && typeof window.questions.renderAndPrintStudentExam === 'function') {
                window.questions.renderAndPrintStudentExam(examTitle, [], includeSolution, classLevel, 'chat-luong-cao');
            }
            const modal = document.getElementById("print-preview-modal");
            if (modal) {
                modal.style.zIndex = "200000";
            }
            const previewPaper = document.getElementById("print-preview-paper");
            if (previewPaper) {
                previewPaper.innerHTML = html;
                try {
                    if (window.renderMathInElement) {
                        window.renderMathInElement(previewPaper, {
                            delimiters: [
                                {left: "$$", right: "$$", display: true},
                                {left: "$", right: "$", display: false},
                                {left: "\\(", right: "\\)", display: false},
                                {left: "\\[", right: "\\]", display: true}
                            ],
                            throwOnError: false
                        });
                    }
                } catch (e) {
                    console.warn("KaTeX render 7991 err:", e);
                }
            }
        }
    };
})();
