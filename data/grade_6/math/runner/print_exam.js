/**
 * GRADE 6 MATH - EXAM PRINT & PDF EXPORT RUNNER
 */
(function(root) {
    'use strict';

    const PrintExamRunner = {
        generateStudentPrintExam: function(lesson, includeSolution, level = 'nang-cao') {
        const studentId = (window.app && app.config && app.config.defaultStudentId) || 'default';
        const classLevel = (window.app && app.config && app.config.currentClass) || '6';

        // Nếu là cấp độ Chất lượng cao do AI sinh -> Tải đề mẫu từ server
        if (level === 'chat-luong-cao') {
            Swal.fire({
                title: 'Đang tải câu hỏi...',
                text: 'Đang kết nối server để lấy đề thi mẫu...',
                allowOutsideClick: false,
                target: document.getElementById('tab-practice') || 'body',
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            fetch(this.getApiUrl(`/api/get-questions?lessonId=${lesson.id}&lessonTitle=${encodeURIComponent(lesson.title)}&classLevel=${classLevel}&studentId=${studentId}`))
                .then(res => {
                    if (!res.ok) throw new Error('Không thể kết nối với server.');
                    return res.json();
                })
                .then(data => {
                    let questions = null;
                    if (data) {
                        if (Array.isArray(data)) {
                            questions = data;
                        } else if (Array.isArray(data.questions)) {
                            questions = data.questions;
                        }
                    }

                    if (!questions || questions.length === 0) {
                        throw new Error('Dữ liệu câu hỏi trống.');
                    }

                    Swal.fire({
                        title: 'Đang biên dịch đề thi...',
                        text: 'Trình giải mã đang sinh các bộ số ngẫu nhiên...',
                        allowOutsideClick: false,
                        target: document.getElementById('tab-practice') || 'body',
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });

                    // Khởi chạy Web Worker để sinh số ngẫu nhiên
                    const worker = new Worker('js/question-generator-worker.js');
                    worker.postMessage({ questions: questions, maxAttempts: 500 });

                    worker.onmessage = (e) => {
                        Swal.close();
                        worker.terminate();
                        const response = e.data;
                        if (response.status === 'success') {
                            this.renderAndPrintStudentExam(lesson.title, response.questions, includeSolution, classLevel, 'chat-luong-cao');
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Lỗi sinh số ngẫu nhiên',
                                text: 'Không thể tạo đề thi: ' + (response.message || 'Lỗi Web Worker.'),
                                target: document.getElementById('tab-practice') || 'body'
                            });
                        }
                    };

                    worker.onerror = (err) => {
                        Swal.close();
                        worker.terminate();
                        console.error("Worker in đề thi AI bị lỗi:", err);
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi luồng chạy Web Worker',
                            text: 'Không thể khởi động Web Worker để tạo đề: ' + err.message,
                            target: document.getElementById('tab-practice') || 'body'
                        });
                    };
                })
                .catch(err => {
                    Swal.close();
                    console.error("Lỗi khi tải đề thi in:", err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi tải đề thi',
                        text: 'Không thể tải đề thi từ server: ' + err.message,
                        target: document.getElementById('tab-practice') || 'body'
                    });
                });
        } else {
            // Tự sinh đề trực tiếp tại client tức thì (Hỗ trợ ngoại tuyến)
            try {
                let questions = [];
                const isExam = lesson.questionType.startsWith("cuoi-chuong") || lesson.id.startsWith("kt-");

                if (isExam) {
                    // Cấu trúc thi chương (sinh ngẫu nhiên các loại câu hỏi của chương)
                    const chapterTypes = {
                        "chuong-1": ["tap-hop", "ghi-so-tu-nhien", "tap-hop-thu-tu", "cong-tru-so-tu-nhien", "nhan-chia-so-tu-nhien", "luy-thua", "thu-tu-phep-tinh"],
                        "chuong-2": ["quan-he-chia-het", "dau-hieu-chia-het", "so-nguyen-to", "ucln", "bcnn"],
                        "chuong-3": ["tap-hop-so-nguyen", "cong-tru-so-nguyen", "dau-ngoac", "nhan-so-nguyen", "chia-het-uoc-boi-so-nguyen"],
                        "chuong-4": ["hinh-hoc-chuong-4", "hinh-hoc-2-chuong-4", "chu-vi-dien-tich"],
                        "chuong-5": ["truc-doi-xung", "tam-doi-xung"],
                        "chuong-6": ["phan-so-bang-nhau", "so-sanh-phan-so", "cong-tru-phan-so", "nhan-chia-phan-so", "hai-bai-toan-phan-so"],
                        "chuong-7": ["so-thap-phan", "tinh-so-thap-phan", "lam-tron-uoc-luong", "ti-so-phan-tram"],
                        "chuong-8": ["diem-duong-thang", "tia-hinh-hoc", "doan-thang", "trung-diem", "goc", "so-do-goc"],
                        "chuong-9": ["thu-thap-du-lieu", "bang-thong-ke-bieu-do-tranh", "bieu-do-cot", "bieu-do-cot-kep", "ket-qua-co-the", "xac-suat-thuc-nghiem"],
                        "l4-chuong-1": ["l4-on-tap-100k", "l4-phep-tinh-100k", "l4-so-chan-le", "l4-bieu-thuc-chu", "l4-toan-ba-buoc-tinh"],
                        "l4-chuong-2": ["l4-do-goc", "l4-phan-loai-goc"],
                        "l4-chuong-3": ["l4-so-sau-chu-so", "l4-hang-va-lop", "l4-lop-trieu", "l4-lam-tron-tram-nghin", "l4-so-sanh-nhieu-chu-so", "l4-day-so-tu-nhien"],
                        "l4-chuong-4": ["l4-yen-ta-tan", "l4-don-vi-dien-tich", "l4-giay-the-ki"],
                        "l4-chuong-5": ["l4-cong-nhieu-chu-so", "l4-tru-nhieu-chu-so", "l4-tinh-chat-cong", "l4-tong-hieu"],
                        "l4-chuong-6": ["l4-duong-vuong-goc", "l4-duong-song-song", "l4-binh-hanh-thoi"],
                        "l4-chuong-7": ["luyen-tap-chung-l4-c7-1", "luyen-tap-chung-l4-c7-2", "luyen-tap-chung-l4-c7-3", "luyen-tap-chung-l4-c7-4"],
                        "l4-chuong-8": ["l4-nhan-mot-chu-so", "l4-chia-mot-chu-so", "l4-nhan-chia-10-100", "l4-trung-binh-cong", "l4-rut-ve-don-vi"],
                        "l4-chuong-9": ["l4-thong-ke", "l4-bieu-do-cot", "l4-su-kien"],
                        "l4-chuong-10": ["l4-khai-niem-phan-so", "l4-phan-so-chia-so-tu-nhien", "l4-rut-gon-phan-so", "l4-so-sanh-phan-so"],
                        "l4-chuong-11": ["l4-cong-phan-so", "l4-tru-phan-so"],
                        "l4-chuong-12": ["l4-nhan-phan-so", "l4-tim-phan-so-cua-so"],
                        "l4-chuong-13": ["luyen-tap-chung-l4-c13-1", "luyen-tap-chung-l4-c13-2", "luyen-tap-chung-l4-c13-3", "luyen-tap-chung-l4-c13-4", "luyen-tap-chung-l4-c13-5", "luyen-tap-chung-l4-c13-6"]
                    };

                    let chapterId = "chuong-1";
                    for (const chapter of COURSE_DATA) {
                        if (chapter.lessons.some(l => l.id === lesson.id)) {
                            chapterId = chapter.id;
                            break;
                        }
                    }

                    const types = chapterTypes[chapterId] || ["tap-hop"];
                    let examQuestionsCount = 18;
                    let mcqCount = 12;
                    let diffDistribution = [];

                    if (level === 'co-ban') {
                        examQuestionsCount = 20;
                        mcqCount = 16;
                        for (let i = 0; i < 16; i++) diffDistribution.push('co-ban');
                        for (let i = 0; i < 4; i++) diffDistribution.push('nang-cao');
                    } else if (level === 'kho') {
                        examQuestionsCount = 16;
                        mcqCount = 10;
                        for (let i = 0; i < 2; i++) diffDistribution.push('co-ban');
                        for (let i = 0; i < 6; i++) diffDistribution.push('nang-cao');
                        for (let i = 0; i < 8; i++) diffDistribution.push('kho');
                    } else { // nang-cao
                        examQuestionsCount = 18;
                        mcqCount = 12;
                        for (let i = 0; i < 4; i++) diffDistribution.push('co-ban');
                        for (let i = 0; i < 10; i++) diffDistribution.push('nang-cao');
                        for (let i = 0; i < 4; i++) diffDistribution.push('kho');
                    }

                    this.shuffle(diffDistribution);

                    for (let i = 0; i < examQuestionsCount; i++) {
                        const randomType = types[Math.floor(Math.random() * types.length)];
                        const randomLevel = diffDistribution[i];
                        const q = this.generateQuestion(randomType, randomLevel);
                        q.level = randomLevel;
                        q.type = randomType;
                        q.isShortAnswer = false;
                        questions.push(q);
                    }

                    // Đánh dấu các câu điền đáp án ngắn phù hợp
                    let shortAnswerAssigned = 0;
                    const targetShortAnswerCount = examQuestionsCount - mcqCount;
                    for (let i = examQuestionsCount - 1; i >= 0; i--) {
                        const q = questions[i];
                        if (shortAnswerAssigned < targetShortAnswerCount && !q.forceMCQ) {
                            q.isShortAnswer = true;
                            shortAnswerAssigned++;
                        } else {
                            q.isShortAnswer = false;
                        }
                    }
                } else {
                    // Sinh đề luyện tập (10 câu)
                    const hasSubtopics = lesson.subtopics && lesson.subtopics.length > 0;
                    let type = lesson.questionType;

                    if (hasSubtopics) {
                        let subIndex = 0;
                        if (level === 'nang-cao') subIndex = 1;
                        else if (level === 'kho') subIndex = 2;
                        if (lesson.subtopics[subIndex]) {
                            type = lesson.subtopics[subIndex].questionType;
                        }
                    }

                    for (let i = 0; i < 10; i++) {
                        const q = this.generateQuestion(type, level);
                        q.level = level;
                        q.type = type;
                        questions.push(q);
                    }
                }

                // Tiến hành render và in
                this.renderAndPrintStudentExam(lesson.title, questions, includeSolution, classLevel, level);
            } catch (err) {
                console.error("Lỗi sinh đề offline tại client:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi sinh đề',
                    text: 'Không thể tự sinh đề thi offline: ' + err.message,
                    target: document.getElementById('tab-practice') || 'body'
                });
            }
        }
    },

    renderAndPrintStudentExam: function(lessonTitle, questionsList, includeSolution, classLevel, level) {
        const schoolName = (window.app && app.config && app.config.schoolName) || "HỆ THỐNG GIÁO DỤC CÁ NHÂN HÓA AI";
        const defaultStudentName = (window.app && app.config && app.config.studentName) || "......................................................................";
        
        const levelTextMap = {
            'co-ban': 'Cơ bản',
            'nang-cao': 'Nâng cao',
            'kho': 'Khó',
            'chat-luong-cao': 'Chất lượng cao AI'
        };
        const levelText = levelTextMap[level] || 'Nâng cao';

        // Xây dựng Header & Thông tin đề thi
        let html = `
            <!-- Trang Đề thi -->
            <div class="print-exam-page text-black bg-white" style="font-family: 'Times New Roman', Times, Georgia, serif;">
                <!-- Header trường học & tên đề -->
                <div style="display: flex; justify-content: space-between; align-items: start; border-bottom: 2px solid #000000; padding-bottom: 10px; margin-bottom: 20px;">
                    <div style="text-align: center; font-weight: bold; font-size: 11px; text-transform: uppercase; width: 45%;">
                        <p style="margin: 0; padding: 0;">${schoolName}</p>
                        <p style="font-size: 9px; font-weight: normal; margin-top: 2px; margin-bottom: 0;">Chương trình học tập cá nhân hóa AI</p>
                    </div>
                    <div style="text-align: center; font-weight: bold; font-size: 13px; text-transform: uppercase; width: 50%;">
                        <p style="margin: 0; padding: 0;">ĐỀ THI KIỂM TRA CHUYÊN ĐỀ</p>
                        <p style="font-size: 11px; font-weight: bold; font-style: italic; text-transform: none; margin-top: 4px; margin-bottom: 0;">Môn: Toán Lớp ${classLevel} - Mức độ: ${levelText}</p>
                    </div>
                </div>

                <!-- Tên Chuyên đề -->
                <div style="text-align: center; font-weight: bold; font-size: 15px; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 0.5px;">
                    Chuyên đề: ${lessonTitle}
                </div>

                <!-- Phần điền thông tin học sinh -->
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; font-size: 13px; margin-bottom: 20px; line-height: 1.8;">
                    <div style="width: 60%;">Họ và tên học sinh: <span style="font-weight: bold;">${defaultStudentName}</span></div>
                    <div style="width: 35%;">Ngày làm bài: ....../....../20...</div>
                    <div style="width: 60%;">Lớp: ....................................................................</div>
                    <div style="width: 35%;">Thời gian làm bài: 45 phút</div>
                </div>

                <!-- Khung ghi điểm & Lời phê -->
                <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #000000; margin-bottom: 25px; font-size: 13px; text-align: center;">
                    <thead>
                        <tr style="background-color: #f8fafc;">
                            <th style="border: 1px solid #000000; padding: 8px; font-weight: bold; width: 30%;">ĐIỂM SỐ</th>
                            <th style="border: 1px solid #000000; padding: 8px; font-weight: bold;">LỜI PHÊ CỦA PHỤ HUYNH</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="height: 60px;">
                            <td style="border: 1px solid #000000;"></td>
                            <td style="border: 1px solid #000000; text-align: left; padding: 8px; vertical-align: top; color: #64748b;"></td>
                        </tr>
                    </tbody>
                </table>

                <div style="font-weight: bold; font-size: 13px; text-transform: uppercase; margin-bottom: 12px; border-bottom: 1px dashed #000000; padding-bottom: 4px;">
                    PHẦN I. CÂU HỎI TRẮC NGHIỆM (10 câu hỏi)
                </div>
                <p style="font-style: italic; font-size: 12px; margin-bottom: 15px; color: #475569;">Khoanh tròn vào chữ cái đứng trước câu trả lời đúng nhất hoặc điền vào Bảng đáp án ở cuối đề.</p>

                <!-- Danh sách câu hỏi -->
                <div style="display: flex; flex-direction: column; gap: 20px;">
        `;

        // Render từng câu hỏi
        questionsList.forEach((q, idx) => {
            const cleanText = q.questionText.replace(/<br\s*\/?>/gi, '<br/>');
            
            // Render các phương án lựa chọn A, B, C, D
            let optionsHtml = "";
            if (q.options && q.options.length > 0) {
                optionsHtml = `<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 8px; padding-left: 15px; font-size: 13px;">`;
                q.options.forEach((opt, oIdx) => {
                    const cleanOpt = opt.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim();
                    const letter = ["A", "B", "C", "D"][oIdx];
                    optionsHtml += `<div style="line-height: 1.5;"><span style="font-weight: bold;">${letter}.</span> ${cleanOpt}</div>`;
                });
                optionsHtml += `</div>`;
            }

            html += `
                <div style="page-break-inside: avoid; break-inside: avoid;">
                    <div class="math-render" style="font-size: 13.5px; font-weight: 600; line-height: 1.6; text-align: justify;">
                        Câu ${idx + 1}: ${cleanText}
                    </div>
                    ${optionsHtml}
                </div>
            `;
        });

        html += `
                </div>

                <!-- Bảng điền đáp án trắc nghiệm cho học sinh -->
                <div style="margin-top: 35px; page-break-inside: avoid; break-inside: avoid;">
                    <div style="font-weight: bold; font-size: 12px; text-align: center; margin-bottom: 10px; text-transform: uppercase;">
                        BẢNG ĐIỀN ĐÁP ÁN TRẮC NGHIỆM
                    </div>
                    <table style="width: 100%; border-collapse: collapse; border: 1.5px solid #000000; text-align: center; font-size: 12px;">
                        <thead>
                            <tr style="background-color: #f1f5f9; font-weight: bold;">
                                <td style="border: 1px solid #000000; padding: 6px; font-weight: bold;">Câu hỏi</td>
                                <td style="border: 1px solid #000000; padding: 6px;">1</td>
                                <td style="border: 1px solid #000000; padding: 6px;">2</td>
                                <td style="border: 1px solid #000000; padding: 6px;">3</td>
                                <td style="border: 1px solid #000000; padding: 6px;">4</td>
                                <td style="border: 1px solid #000000; padding: 6px;">5</td>
                                <td style="border: 1px solid #000000; padding: 6px;">6</td>
                                <td style="border: 1px solid #000000; padding: 6px;">7</td>
                                <td style="border: 1px solid #000000; padding: 6px;">8</td>
                                <td style="border: 1px solid #000000; padding: 6px;">9</td>
                                <td style="border: 1px solid #000000; padding: 6px;">10</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="height: 32px;">
                                <td style="border: 1px solid #000000; padding: 6px; font-weight: bold;">Đáp án chọn</td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                                <td style="border: 1px solid #000000;"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- Footer bản quyền chuyên nghiệp -->
                <div style="margin-top: 30px; border-top: 1px solid #d1d5db; padding-top: 6px; text-align: center; font-size: 9px; color: #4b5563; font-family: 'Times New Roman', Times, Georgia, serif; font-style: italic; opacity: 0.85;">
                    © Copyright by Trần Hải Đăng - Khoa Binh chủng, Trường Quân sự Quân khu 3 (Hotline: 0978396032). All rights reserved.
                </div>
            </div>
        `;

        // Render Hướng dẫn giải chi tiết & Đáp án ở trang sau
        if (includeSolution) {
            html += `
                <!-- Ngắt trang sang trang Đáp án riêng biệt -->
                <div class="print-page-break" style="margin-top: 40px;"></div>

                <div class="print-exam-page text-black bg-white" style="font-family: 'Times New Roman', Times, Georgia, serif; margin-top: 20px;">
                    <div style="text-align: center; font-weight: bold; font-size: 15px; text-transform: uppercase; border-bottom: 2px solid #000000; padding-bottom: 8px; margin-bottom: 20px;">
                        HƯỚNG DẪN GIẢI CHI TIẾT & ĐÁP ÁN ĐỀ THI
                    </div>
                    <p style="font-size: 13px; margin-bottom: 15px; font-weight: bold;">Chuyên đề: ${lessonTitle} - Mức độ: ${levelText}</p>
                    
                    <!-- Bảng đáp án nhanh -->
                    <div style="margin-bottom: 25px;">
                        <div style="font-weight: bold; font-size: 12px; margin-bottom: 8px; text-transform: uppercase;">
                            1. BẢNG ĐÁP ÁN NHANH
                        </div>
                        <table style="width: 100%; border-collapse: collapse; border: 1.2px solid #000000; text-align: center; font-size: 12px;">
                            <thead>
                                <tr style="background-color: #f1f5f9; font-weight: bold;">
                                    <td style="border: 1px solid #000000; padding: 6px;">Câu</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">1</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">2</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">3</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">4</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">5</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">6</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">7</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">8</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">9</td>
                                    <td style="border: 1px solid #000000; padding: 6px;">10</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style="height: 28px; font-weight: bold;">
                                    <td style="border: 1px solid #000000; background-color: #f1f5f9; color: #000000 !important;">Đáp án</td>
            `;

            // Lấy ký tự đáp án nhanh A, B, C, D
            questionsList.forEach(q => {
                const correctLetter = ["A", "B", "C", "D"][q.correctIndex || 0];
                html += `<td style="border: 1px solid #000000; color: #10b981 !important;">${correctLetter}</td>`;
            });

            html += `
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div style="font-weight: bold; font-size: 12px; margin-bottom: 12px; text-transform: uppercase;">
                        2. LỜI GIẢI CHI TIẾT TỪNG CÂU
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 18px; font-size: 13px; line-height: 1.6;">
            `;

            questionsList.forEach((q, idx) => {
                const correctLetter = ["A", "B", "C", "D"][q.correctIndex || 0];
                const cleanSol = q.solutionHtml ? q.solutionHtml.replace(/<br\s*\/?>/gi, '<br/>') : "Đang cập nhật...";
                const cleanTip = q.tip ? q.tip.replace(/<br\s*\/?>/gi, '<br/>') : "";

                html += `
                    <div style="page-break-inside: avoid; break-inside: avoid; border-bottom: 1px dashed #e2e8f0; padding-bottom: 12px;">
                        <p style="font-weight: bold; margin-bottom: 4px;">Câu ${idx + 1}: Chọn đáp án ${correctLetter}</p>
                        <div class="math-render" style="margin-top: 6px; padding-left: 10px; border-left: 2px solid #8b5cf6; color: #334155 !important;">
                            ${cleanSol}
                        </div>
                `;

                if (cleanTip) {
                    html += `
                        <div class="math-render" style="margin-top: 6px; padding-left: 10px; font-style: italic; color: #475569 !important; font-size: 12.5px;">
                            💡 Mẹo làm bài: ${cleanTip}
                        </div>
                    `;
                }

                html += `
                    </div>
                `;
            });

            html += `
                    </div>
                    <!-- Footer bản quyền chuyên nghiệp -->
                    <div style="margin-top: 30px; border-top: 1px solid #d1d5db; padding-top: 6px; text-align: center; font-size: 9px; color: #4b5563; font-family: 'Times New Roman', Times, Georgia, serif; font-style: italic; opacity: 0.85;">
                        © Copyright by Trần Hải Đăng - Khoa Binh chủng, Trường Quân sự Quân khu 3 (Hotline: 0978396032). All rights reserved.
                    </div>
                </div>
            `;
        }

        // 1. Hiển thị hộp thoại xem trước (Modal Preview)
        const previewModal = document.getElementById("print-preview-modal");
        const previewPaper = document.getElementById("print-preview-paper");
        if (previewModal && previewPaper) {
            previewPaper.innerHTML = html;

            // Auto-render KaTeX trong preview paper (bao bọc try-catch tránh sập luồng JS)
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
            } catch (katexErr) {
                console.warn("KaTeX render preview error:", katexErr);
            }

            // Hiển thị modal xem trước
            previewModal.classList.remove("hidden");
        } else {
            // Fallback nếu không có modal preview (in trực tiếp)
            let paper = document.getElementById("student-print-paper");
            if (!paper) {
                paper = document.createElement("div");
                paper.id = "student-print-paper";
                document.body.appendChild(paper);
            }
            paper.innerHTML = html;
            
            try {
                if (window.renderMathInElement) {
                    window.renderMathInElement(paper, {
                        delimiters: [
                            {left: "$$", right: "$$", display: true},
                            {left: "$", right: "$", display: false},
                            {left: "\\(", right: "\\)", display: false},
                            {left: "\\[", right: "\\]", display: true}
                        ],
                        throwOnError: false
                    });
                }
            } catch (katexErr) {
                console.warn("KaTeX fallback render error:", katexErr);
            }

            // Lưu bản sao PDF lên server kiểm định trước khi in
            if (paper) {
                this.savePrintedPDFToServer(paper.innerHTML);
            }

            setTimeout(() => {
                window.print();
            }, 1000); // Tăng hẳn thời gian lên 1 giây để an toàn
        }
    },

    savePrintedPDFToServer: function(htmlContent) {
        if (!htmlContent) return;
        const lessonTitle = (this.currentLesson && this.currentLesson.title) || "de_thi";
        const sanitizedTitle = removeVietnameseTones(lessonTitle)
            .replace(/[^a-zA-Z0-9\-_]/g, '_')
            .replace(/_+/g, '_');
        const filename = `de_thi_${sanitizedTitle}_${Date.now()}.pdf`;

        fetch(this.getApiUrl('/api/save-printed-pdf'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                html: htmlContent,
                filename: filename
            })
        }).then(res => res.json())
          .then(data => {
              console.log("Đã lưu PDF kiểm định tại server:", data);
          })
          .catch(err => {
              console.error("Không thể lưu PDF kiểm định:", err);
          });
    },

    triggerPrintFromPreview: function() {
        const previewPaper = document.getElementById("print-preview-paper");
        if (previewPaper) {
            this.savePrintedPDFToServer(previewPaper.innerHTML);
        }
        window.print();
    },

    downloadPDFFromPreview: function() {
        const previewPaper = document.getElementById("print-preview-paper");
        if (!previewPaper) return;

        const lessonTitle = (this.currentLesson && this.currentLesson.title) || "de_thi";
        const sanitizedTitle = removeVietnameseTones(lessonTitle)
            .replace(/[^a-zA-Z0-9\-_]/g, '_')
            .replace(/_+/g, '_');
        const filename = `de_thi_${sanitizedTitle}_${Date.now()}.pdf`;

        // Hiển thị trạng thái đang xử lý trên nút bấm
        const btn = document.querySelector('button[onclick="questions.downloadPDFFromPreview()"]');
        let oldHtml = "";
        if (btn) {
            oldHtml = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang tải file...';
            btn.disabled = true;
        }

        fetch(this.getApiUrl('/api/save-printed-pdf'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                html: previewPaper.innerHTML,
                filename: filename
            })
        })
        .then(res => {
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return res.json();
        })
        .then(data => {
            if (data.success && data.path) {
                // Tạo thẻ link ảo để tải xuống
                const downloadUrl = this.getApiUrl(data.path);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                alert("Lỗi khi sinh PDF: " + (data.error || "Không rõ nguyên nhân"));
            }
        })
        .catch(err => {
            console.error("Lỗi tải PDF:", err);
            alert("Lỗi kết nối server: " + err.message);
        })
        .finally(() => {
            if (btn) {
                btn.innerHTML = oldHtml;
                btn.disabled = false;
            }
        });
    },

    closePrintPreview: function() {
        const previewModal = document.getElementById("print-preview-modal");
        if (previewModal) {
            previewModal.classList.add("hidden");
        }
        // Dọn dẹp DOM
        const previewPaper = document.getElementById("print-preview-paper");
        if (previewPaper) previewPaper.innerHTML = "";
        const printPaper = document.getElementById("student-print-paper");
        if (printPaper) printPaper.innerHTML = "";
    },
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = PrintExamRunner;
    if (typeof root !== 'undefined') root.PrintExamRunner = PrintExamRunner;
})(typeof window !== 'undefined' ? window : global);
