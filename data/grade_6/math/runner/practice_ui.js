/**
 * GRADE 6 MATH - PRACTICE UI & REVIEW RUNNER
 */
(function(root) {
    'use strict';

    const PracticeUIRunner = {
        startPracticeWithLevel: function(level) {
        this.currentSubtopic = null;
        this.isSubtopicPracticeMode = false;
        this.isLessonExamMode = false;
        this.isWeaknessPracticeMode = false;
        
        const selectBox = document.getElementById("practice-level-select-box");
        if (selectBox) selectBox.classList.add("hidden");
        const dbBox = document.getElementById("practice-levels-dashboard-box");
        if (dbBox) dbBox.classList.add("hidden");
        
        document.getElementById("practice-active-box").classList.remove("hidden");
        this.initPractice(app.currentLesson, level, false);
    },

    // Luyện tập theo Dạng bài cụ thể
    startSubtopicPractice: function(subtopicId) {
        const lesson = app.currentLesson;
        const subtopic = lesson.subtopics.find(s => s.id === subtopicId);
        if (!subtopic) return;

        this.currentSubtopic = subtopic;
        this.isSubtopicPracticeMode = true;
        this.isLessonExamMode = false;
        this.isWeaknessPracticeMode = false;

        const selectBox = document.getElementById("practice-level-select-box");
        if (selectBox) selectBox.classList.add("hidden");
        const dbBox = document.getElementById("practice-levels-dashboard-box");
        if (dbBox) dbBox.classList.add("hidden");

        document.getElementById("practice-active-box").classList.remove("hidden");
        this.initPractice(lesson, subtopic.level || 'co-ban', false);
    },

    // Luyện tập khắc phục điểm yếu của Dạng bài cụ thể (do AI tính toán)
    startWeaknessPracticeSubtopic: function(subtopicId) {
        const lesson = app.currentLesson;
        const subtopic = lesson.subtopics.find(s => s.id === subtopicId);
        if (!subtopic) return;

        this.currentSubtopic = subtopic;
        this.isSubtopicPracticeMode = true;
        this.isLessonExamMode = false;
        this.isWeaknessPracticeMode = true;

        const selectBox = document.getElementById("practice-level-select-box");
        if (selectBox) selectBox.classList.add("hidden");
        const dbBox = document.getElementById("practice-levels-dashboard-box");
        if (dbBox) dbBox.classList.add("hidden");

        document.getElementById("practice-active-box").classList.remove("hidden");
        this.initPractice(lesson, subtopic.level || 'co-ban', false);
    },

    // Luyện tập khắc phục điểm yếu của cấp độ (bài luyện tập chung)
    startWeaknessPracticeWithLevel: function(level) {
        this.currentSubtopic = null;
        this.isSubtopicPracticeMode = false;
        this.isLessonExamMode = false;
        this.isWeaknessPracticeMode = true;

        const selectBox = document.getElementById("practice-level-select-box");
        if (selectBox) selectBox.classList.add("hidden");
        const dbBox = document.getElementById("practice-levels-dashboard-box");
        if (dbBox) dbBox.classList.add("hidden");

        document.getElementById("practice-active-box").classList.remove("hidden");
        this.initPractice(app.currentLesson, level, false);
    },

    // Kiểm tra tổng thể bài học (10 câu nâng cao)
    startLessonExam: function() {
        this.currentSubtopic = null;
        this.isSubtopicPracticeMode = false;
        this.isLessonExamMode = true;
        this.isWeaknessPracticeMode = false;

        const introBox = document.getElementById("practice-lesson-exam-intro-box");
        if (introBox) introBox.classList.add("hidden");
        const dbBox = document.getElementById("practice-levels-dashboard-box");
        if (dbBox) dbBox.classList.add("hidden");

        document.getElementById("practice-active-box").classList.remove("hidden");
        this.initPractice(app.currentLesson, 'nang-cao', true);
    },

    // Điểm xuất phát của bài thi cuối chương
    startExam: function() {
        this.startExamWithLevel('co-ban');
    },

    startExamWithLevel: function(level) {
        this.currentSubtopic = null;
        this.isSubtopicPracticeMode = false;
        this.isLessonExamMode = false;
        this.isWeaknessPracticeMode = false;
        
        document.getElementById("practice-exam-intro-box").classList.add("hidden");
        const dbBox = document.getElementById("practice-levels-dashboard-box");
        if (dbBox) dbBox.classList.add("hidden");
        
        document.getElementById("practice-active-box").classList.remove("hidden");
        this.initPractice(app.currentLesson, level, true);
    },

    // Khởi tạo bài luyện tập (5 câu) hoặc bài thi cuối chương (10 câu)
    initPractice: function(lesson, level = 'co-ban', isExam = false) {
        this.currentLesson = lesson;
        this.currentQuestions = [];
        this.currentQuestionIndex = 0;
        this.correctCount = 0;
        this.selectedOption = null;
        this.hintsShown = 0;
        this.hasChecked = false;
        this.isExamMode = isExam;
        this.currentLevel = level || 'co-ban';
        this.practiceStartTime = Date.now();
        this.practiceDistractions = 0;
        this.accumulatedGold = 0;
        this.accumulatedXp = 0;
        this.isGraded = false; // Trạng thái đã chấm điểm bài tập/thi

        // Hiển thị cảnh báo luyện điểm yếu AI nếu có
        const alertBox = document.getElementById("weakness-practice-alert");
        if (alertBox) {
            if (this.isWeaknessPracticeMode) {
                const lvlData = app.getLevelData(lesson.id, this.currentLevel);
                if (lvlData && lvlData.weakQuestion) {
                    const cleanTip = lvlData.weakQuestion.tip || "Cố gắng làm bài cẩn thận hơn con nhé!";
                    alertBox.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:var(--warning); font-size:1.2rem;"></i> 
                    <div>
                        <span style="color:var(--warning); font-weight:700;">Chế độ Luyện điểm yếu AI:</span> Tập trung khắc phục lỗi: <span style="font-style:italic; color:var(--text-main); font-weight:normal;">"${cleanTip}"</span>
                    </div>`;
                    alertBox.classList.remove("hidden");
                } else {
                    alertBox.classList.add("hidden");
                }
            } else {
                alertBox.classList.add("hidden");
            }
        }

        // Bật toàn màn hình cho khu vực làm bài tập/kiểm tra
        app.enterFullscreen(document.getElementById("tab-practice"));
        document.body.classList.add("practice-fullscreen-active");

        // Bật Super Focus Mode chống xao nhãng
        document.body.classList.add("super-focus-active");
        
        // Đảm bảo tắt chế độ hiển thị phóng to game khi mới bắt đầu làm bài tập
        document.body.classList.remove("game-mode-active");

        // Đảm bảo dừng nhạc nền game khi đang làm bài tập
        if (window.app && app.audio) {
            app.audio.stopBackground();
        }

        // Dừng đếm thời gian cũ nếu có
        if (this.examInterval) clearInterval(this.examInterval);
        document.getElementById("exam-timer-wrapper").classList.add("hidden");
        document.getElementById("exam-review-box").classList.add("hidden");

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
            // Lớp 4
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

        // Xác định chương của bài học hiện tại
        let chapterId = "chuong-1";
        for (const chapter of COURSE_DATA) {
            if (chapter.lessons.some(l => l.id === lesson.id)) {
                chapterId = chapter.id;
                break;
            }
        }

        let numQuestions = isExam ? 10 : 5;
        if (this.isSubtopicPracticeMode || this.isLessonExamMode) {
            numQuestions = 10;
        }

        if (this.isLessonExamMode) {
            // Bài kiểm tra tổng thể bài học: 10 câu, tính giờ 15 phút, mức độ Nâng cao
            this.startExamTimer();
            const subtopics = lesson.subtopics && lesson.subtopics.length > 0 ? lesson.subtopics : [];
            
            for (let i = 0; i < numQuestions; i++) {
                const sub = subtopics.length > 0 ? subtopics[Math.floor(Math.random() * subtopics.length)] : null;
                const type = sub ? sub.questionType : lesson.questionType;
                const q = this.generateQuestion(type, 'nang-cao');
                q.isSpacedRepetition = false;
                q.level = 'nang-cao';
                q.type = type;
                this.currentQuestions.push(q);
            }
        } else if (this.isSubtopicPracticeMode) {
            // Luyện tập theo dạng bài: 10 câu, theo độ khó của dạng bài
            for (let i = 0; i < numQuestions; i++) {
                const type = this.currentSubtopic.questionType;
                const level = this.currentSubtopic.level || 'co-ban';
                const q = this.generateQuestion(type, level);
                q.isSpacedRepetition = false;
                q.level = level;
                q.type = type;
                this.currentQuestions.push(q);
            }
        } else if (isExam) {
            // Chế độ Thi chương: 45 phút, số câu tùy thuộc mức độ
            this.startExamTimer();
            const types = chapterTypes[chapterId] || ["tap-hop"];
            
            let examQuestionsCount = 18; // mặc định nâng cao
            let mcqCount = 12;
            let saCount = 6;
            let diffDistribution = [];

            if (this.currentLevel === 'co-ban') {
                examQuestionsCount = 20;
                mcqCount = 16;
                saCount = 4;
                // Phân bố độ khó: 16 Cơ bản, 4 Nâng cao
                for (let i = 0; i < 16; i++) diffDistribution.push('co-ban');
                for (let i = 0; i < 4; i++) diffDistribution.push('nang-cao');
            } else if (this.currentLevel === 'kho') {
                examQuestionsCount = 16;
                mcqCount = 10;
                saCount = 6;
                // Phân bố độ khó: 2 Cơ bản, 6 Nâng cao, 8 Khó
                for (let i = 0; i < 2; i++) diffDistribution.push('co-ban');
                for (let i = 0; i < 6; i++) diffDistribution.push('nang-cao');
                for (let i = 0; i < 8; i++) diffDistribution.push('kho');
            } else if (this.currentLevel === 'chat-luong-cao') {
                // Tải từ file pre-gen và bổ sung câu hỏi
                this.loadChatLuongCaoExam(lesson, types);
                return;
            } else {
                // Nâng cao (mặc định)
                examQuestionsCount = 18;
                mcqCount = 12;
                saCount = 6;
                // Phân bố độ khó: 4 Cơ bản, 10 Nâng cao, 4 Khó
                for (let i = 0; i < 4; i++) diffDistribution.push('co-ban');
                for (let i = 0; i < 10; i++) diffDistribution.push('nang-cao');
                for (let i = 0; i < 4; i++) diffDistribution.push('kho');
            }

            this.shuffle(diffDistribution);

            for (let i = 0; i < examQuestionsCount; i++) {
                const randomType = types[Math.floor(Math.random() * types.length)];
                const randomLevel = diffDistribution[i];
                const q = this.generateQuestion(randomType, randomLevel);
                q.isSpacedRepetition = false;
                q.level = randomLevel;
                q.type = randomType;
                q.isShortAnswer = false;
                this.currentQuestions.push(q);
            }

            // Đánh dấu một số câu hỏi phù hợp là điền số (Short Answer)
            let shortAnswerAssigned = 0;
            const targetShortAnswerCount = examQuestionsCount - mcqCount;
            for (let i = examQuestionsCount - 1; i >= 0; i--) {
                const q = this.currentQuestions[i];
                if (shortAnswerAssigned < targetShortAnswerCount && !q.forceMCQ) {
                    q.isShortAnswer = true;
                    shortAnswerAssigned++;
                } else {
                    q.isShortAnswer = false;
                }
            }
        } else if (this.currentLevel === 'chat-luong-cao') {
            // Chế độ Chất lượng cao do AI sinh
            Swal.fire({
                title: 'Đang tải đề thi AI...',
                text: 'Hệ thống đang nạp bộ câu hỏi Chất lượng cao do AI biên soạn và kiểm định ngầm. Vui lòng chờ trong giây lát...',
                target: document.getElementById('tab-practice') || 'body',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const studentId = app.config.defaultStudentId || 'default';
            const fallbackToLocalGenerators = (reason) => {
                console.warn(`[Chất lượng cao AI] Kích hoạt bộ sinh đề chất lượng cao dự phòng cục bộ: ${reason}`);
                const fallbackQuestions = [];
                const types = (chapterTypes && chapterTypes[chapterId]) || [lesson.questionType || "tap-hop"];
                const numQs = 10;
                for (let i = 0; i < numQs; i++) {
                    const randomType = types[Math.floor(Math.random() * types.length)];
                    const q = this.generateQuestion(randomType, 'kho');
                    q.isSpacedRepetition = false;
                    q.level = 'chat-luong-cao';
                    q.type = randomType;
                    fallbackQuestions.push(q);
                }
                let saCount = 0;
                for (let i = fallbackQuestions.length - 1; i >= 0; i--) {
                    const q = fallbackQuestions[i];
                    if (saCount < 4 && !q.forceMCQ) {
                        q.isShortAnswer = true;
                        saCount++;
                    } else {
                        q.isShortAnswer = false;
                    }
                }
                this.currentQuestions = fallbackQuestions;
                this.currentQuestionIndex = 0;
                Swal.close();
                document.getElementById("practice-active-box").classList.add("hidden");
                document.getElementById("practice-mode-select-box").classList.remove("hidden");
            };

            fetch(this.getApiUrl(`/api/get-questions?lessonId=${lesson.id}&lessonTitle=${encodeURIComponent(lesson.title)}&classLevel=${app.config.currentClass || '6'}&studentId=${studentId}`))
                .then(res => {
                    if (!res.ok) throw new Error('Không thể kết nối với server.');
                    return res.json();
                })
                .then(data => {
                    Swal.close();
                    let questions = null;
                    if (data) {
                        if (Array.isArray(data)) {
                            questions = data;
                        } else if (Array.isArray(data.questions)) {
                            questions = data.questions;
                        }
                    }
                    if (questions && questions.length > 0) {
                        Swal.fire({
                            title: 'Đang sinh đề thi AI...',
                            text: 'Trình biên dịch ngầm đang chuyển đổi template và kiểm tra ràng buộc...',
                            target: document.getElementById('tab-practice') || 'body',
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });

                        // Khởi động Web Worker để chạy ngầm sinh số
                        const worker = new Worker('js/question-generator-worker.js');
                        worker.postMessage({ questions: questions, maxAttempts: 500 });

                        worker.onmessage = (e) => {
                            Swal.close();
                            worker.terminate();
                            const response = e.data;
                            if (response.status === 'success') {
                                this.currentQuestions = response.questions;
                                document.getElementById("practice-active-box").classList.add("hidden");
                                document.getElementById("practice-mode-select-box").classList.remove("hidden");
                            } else {
                                const errorMsg = response.message || 'Lỗi không xác định khi sinh đề ngầm.';
                                console.error('Worker sinh đề lỗi:', response);

                                // Gửi Telemetry lỗi về Server
                                fetch(this.getApiUrl('/api/report-client-error'), {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        studentId: studentId,
                                        lessonId: lesson.id,
                                        lessonTitle: lesson.title,
                                        errorMessage: errorMsg,
                                        errorStack: response.stack,
                                        failedQuestion: response.failedQuestion,
                                        failedIndex: response.failedIndex
                                    })
                                }).catch(telemetryErr => console.error('Lỗi gửi telemetry:', telemetryErr));

                                // Tự động phục hồi sang bộ sinh đề dự phòng
                                fallbackToLocalGenerators(errorMsg);
                            }
                        };

                        worker.onerror = (err) => {
                            Swal.close();
                            worker.terminate();
                            console.error('Lỗi runtime Web Worker:', err);

                            // Gửi Telemetry lỗi Web Worker
                            fetch(this.getApiUrl('/api/report-client-error'), {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    studentId: studentId,
                                    lessonId: lesson.id,
                                    lessonTitle: lesson.title,
                                    errorMessage: err.message || 'Lỗi runtime Web Worker',
                                    errorStack: err.stack
                                })
                            }).catch(telemetryErr => console.error('Lỗi gửi telemetry:', telemetryErr));

                            // Tự động phục hồi sang bộ sinh đề dự phòng
                            fallbackToLocalGenerators(err.message || 'Lỗi Web Worker');
                        };
                    } else {
                        fallbackToLocalGenerators('Dữ liệu trả về không có câu hỏi');
                    }
                })
                .catch(err => {
                    console.error('Lỗi tải đề thi chất lượng cao:', err);

                    // Gửi Telemetry khi lỗi fetch API
                    fetch(this.getApiUrl('/api/report-client-error'), {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            studentId: studentId,
                            lessonId: lesson.id,
                            lessonTitle: lesson.title,
                            errorMessage: 'Lỗi tải đề thi từ API: ' + err.message,
                            errorStack: err.stack
                        })
                    }).catch(telemetryErr => console.error('Lỗi gửi telemetry:', telemetryErr));

                    // Tự động phục hồi sang bộ sinh đề dự phòng
                    fallbackToLocalGenerators(err.message || 'Lỗi kết nối API');
                });
            return; // Dừng luồng xử lý đồng bộ
        } else {
            // Chế độ Luyện tập thường: 5 câu, độ khó tự chọn
            for (let i = 0; i < numQuestions; i++) {
                let type = lesson.questionType;
                let isSpacedRepetition = false;

                // Nếu là bài luyện tập chung, lấy ngẫu nhiên các dạng đã học của chương
                if (type.startsWith("luyen-tap-chung")) {
                    const allChapterTypes = chapterTypes[chapterId] || ["tap-hop"];
                    // Lấy các questionType của bài đã học (score >= 50%) trong cùng chương
                    const completedLessons = app.getCompletedLessons ? app.getCompletedLessons() : [];
                    // Lọc bài học trong chương hiện tại đã có điểm >= 50%
                    const chapterLessons = COURSE_DATA.find(c => c.id === chapterId)?.lessons || [];
                    const learnedTypes = chapterLessons
                        .filter(l => l.questionType && !l.questionType.startsWith("luyen-tap-chung") && !l.questionType.startsWith("cuoi-chuong"))
                        .filter(l => (app.state.scores && (app.state.scores[l.id] || 0) >= 50) || completedLessons.includes(l.id))
                        .map(l => l.questionType);
                    // Dùng danh sách đã học nếu có, ngược lại fallback toàn chương
                    const availableTypes = learnedTypes.length > 0 ? learnedTypes : allChapterTypes;
                    type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
                } else {
                    // Spaced Repetition ở câu 4 (i = 3): ôn tập bài cũ
                    if (i === 3) {
                        const completed = app.getCompletedLessons();
                        const eligible = completed.filter(id => id !== lesson.id);
                        if (eligible.length > 0) {
                            const randPrevId = eligible[Math.floor(Math.random() * eligible.length)];
                            const prevLesson = getLessonById(randPrevId);
                            if (prevLesson) {
                                type = prevLesson.questionType;
                                isSpacedRepetition = true;
                            }
                        }
                    }
                }

                const q = this.generateQuestion(type, this.currentLevel);
                q.isSpacedRepetition = isSpacedRepetition;
                q.level = this.currentLevel;
                q.type = type;
                this.currentQuestions.push(q);
            }
        }

        // Hiển thị màn hình chọn chế độ cho tất cả các bài luyện tập tự do
        const isPracticeMode = !this.isExamMode && !this.isLessonExamMode;
        
        if (isPracticeMode) {
            // Ẩn bảng làm bài tích cực, hiện bảng chọn chế độ thực hành
            document.getElementById("practice-active-box").classList.add("hidden");
            document.getElementById("practice-mode-select-box").classList.remove("hidden");
            
            // Nạp và cập nhật mini status của Hero lên giao diện chuẩn bị
            this.updateHeroMiniStatus();
        } else {
            // Chế độ thi/kiểm tra: Tự động chạy trắc nghiệm tiêu chuẩn, vào thẳng làm bài
            this.practiceMode = 'standard';
            document.getElementById("practice-mode-select-box").classList.add("hidden");
            document.getElementById("practice-active-box").classList.remove("hidden");
            this.showQuestion();
        }
    },

    loadChatLuongCaoExam: function(lesson, types) {
        Swal.fire({
            title: 'Đang tải đề thi AI...',
            text: 'Hệ thống đang nạp bộ câu hỏi Chất lượng cao do AI biên soạn và kiểm định ngầm. Vui lòng chờ trong giây lát...',
            target: document.getElementById('tab-practice') || 'body',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const studentId = app.config.defaultStudentId || 'default';
        fetch(this.getApiUrl(`/api/get-questions?lessonId=${lesson.id}&lessonTitle=${encodeURIComponent(lesson.title)}&classLevel=${app.config.currentClass || '6'}&studentId=${studentId}`))
            .then(res => {
                if (!res.ok) throw new Error('Không thể kết nối với server.');
                return res.json();
            })
            .then(data => {
                Swal.close();
                let loadedQuestions = null;
                if (data) {
                    if (Array.isArray(data)) {
                        loadedQuestions = data;
                    } else if (Array.isArray(data.questions)) {
                        loadedQuestions = data.questions;
                    }
                }
                if (loadedQuestions && loadedQuestions.length > 0) {
                    // 1. Chuyển đổi các câu hỏi template từ file thành câu hỏi thực tế
                    const aiQuestions = loadedQuestions.map(q => {
                        const generatedQ = this.generateQuestionFromTemplate(q);
                        generatedQ.isSpacedRepetition = false;
                        generatedQ.level = 'chat-luong-cao';
                        return generatedQ;
                    });

                    // Trộn các câu hỏi AI sinh
                    this.shuffle(aiQuestions);

                    // 2. Bổ sung thêm 6 câu hỏi từ bộ sinh câu hỏi cục bộ (để đủ 16 câu cho 45 phút)
                    const extraQuestionsCount = 6;
                    const diffDistribution = ['nang-cao', 'nang-cao', 'kho', 'kho', 'nang-cao', 'kho'];
                    
                    for (let i = 0; i < extraQuestionsCount; i++) {
                        const randomType = types[Math.floor(Math.random() * types.length)];
                        const randomLevel = diffDistribution[i];
                        const q = this.generateQuestion(randomType, randomLevel);
                        q.isSpacedRepetition = false;
                        q.level = randomLevel;
                        q.type = randomType;
                        aiQuestions.push(q);
                    }

                    // 3. Đánh dấu các câu điền đáp án ngắn phù hợp (tối đa 6 câu)
                    const totalQs = aiQuestions.length; // 16 câu
                    const mcqCount = 10;
                    let shortAnswerAssigned = 0;
                    const targetShortAnswerCount = totalQs - mcqCount;
                    for (let i = totalQs - 1; i >= 0; i--) {
                        const q = aiQuestions[i];
                        if (shortAnswerAssigned < targetShortAnswerCount && !q.forceMCQ) {
                            q.isShortAnswer = true;
                            shortAnswerAssigned++;
                        } else {
                            q.isShortAnswer = false;
                        }
                    }

                    this.currentQuestions = aiQuestions;
                    this.currentQuestionIndex = 0;
                    
                    // Vào thẳng làm bài
                    this.practiceMode = 'standard';
                    document.getElementById("practice-mode-select-box").classList.add("hidden");
                    document.getElementById("practice-active-box").classList.remove("hidden");
                    this.showQuestion();
                } else {
                    throw new Error('Dữ liệu đề thi AI trống hoặc không hợp lệ.');
                }
            })
            .catch(err => {
                console.warn('Lỗi tải đề thi chất lượng cao (Thi chương), tự động kích hoạt bộ sinh đề cục bộ:', err);
                Swal.close();
                
                const fallbackQuestions = [];
                const diffDistribution = ['kho', 'kho', 'kho', 'kho', 'kho', 'kho', 'kho', 'kho', 'nang-cao', 'nang-cao', 'nang-cao', 'nang-cao', 'kho', 'kho', 'kho', 'kho'];
                for (let i = 0; i < 16; i++) {
                    const randomType = types[Math.floor(Math.random() * types.length)];
                    const q = this.generateQuestion(randomType, diffDistribution[i]);
                    q.isSpacedRepetition = false;
                    q.level = 'chat-luong-cao';
                    q.type = randomType;
                    fallbackQuestions.push(q);
                }
                let saCount = 0;
                for (let i = fallbackQuestions.length - 1; i >= 0; i--) {
                    const q = fallbackQuestions[i];
                    if (saCount < 6 && !q.forceMCQ) {
                        q.isShortAnswer = true;
                        saCount++;
                    } else {
                        q.isShortAnswer = false;
                    }
                }
                this.currentQuestions = fallbackQuestions;
                this.currentQuestionIndex = 0;
                this.practiceMode = 'standard';
                document.getElementById("practice-mode-select-box").classList.add("hidden");
                document.getElementById("practice-active-box").classList.remove("hidden");
                this.showQuestion();
            });
    },

    // Hàm cập nhật trạng thái hiển thị của Hero lên giao diện chuẩn bị
    updateHeroMiniStatus: function() {
        const miniBox = document.getElementById("hero-mini-status-box");
        if (miniBox) {
            miniBox.classList.add("hidden");
            miniBox.style.display = "none";
        }
    },

    // Mở hộp thoại chọn Siêu Anh Hùng bằng SweetAlert2 (Hỗ trợ đa cơ chế click và tự động phòng thủ offline)
    openHeroSelector: function() {
        // Đăng ký trước hàm toàn cục để onclick inline trong HTML luôn tìm thấy kể cả khi Swal nạp bất đồng bộ
        window.selectTdHero = (heroId) => {
            questions.hero.load();
            questions.hero.selectedId = heroId;
            questions.hero.save();
            Swal.close();
            questions.updateHeroMiniStatus();
            
            if (questions.pendingPracticeMode) {
                const mode = questions.pendingPracticeMode;
                questions.pendingPracticeMode = null;
                questions.selectPracticeMode(mode);
            }
        };

        if (!document.getElementById("hero-select-styles")) {
            const style = document.createElement("style");
            style.id = "hero-select-styles";
            style.innerHTML = `
                .hero-card:hover {
                    border-color: #fbbf24 !important;
                    transform: translateY(-5px);
                    box-shadow: 0 10px 15px -3px rgba(251, 191, 36, 0.2);
                    background: rgba(251, 191, 36, 0.05) !important;
                }
                .hero-select-popup {
                    width: 580px !important;
                    background: var(--bg-card) !important;
                    color: var(--text-main) !important;
                    border: 1px solid var(--border-color) !important;
                }
            `;
            document.head.appendChild(style);
        }

        Swal.fire({
            title: 'Chọn Siêu Anh Hùng Hộ Vệ',
            html: `<p style="font-size:0.9rem; color:var(--text-muted); margin-bottom:1.2rem;">Hãy chọn một siêu anh hùng đồng hành cùng con hộ vệ thành trì nhé con!</p>
                   <div class="hero-selector-container" style="display:flex; justify-content:space-around; gap:10px; margin-top:0.5rem;">
                     <div class="hero-card" id="btn-select-light-warrior" style="border: 2px solid var(--border-color); border-radius: 12px; padding: 15px; cursor: pointer; width: 31%; transition: all 0.3s; background: rgba(255,255,255,0.02); display:flex; flex-direction:column; align-items:center;">
                         <div style="font-size: 2.5rem; margin-bottom: 8px;">⚔️</div>
                         <div style="font-weight: bold; color: var(--text-main); margin-bottom: 5px; font-size:0.95rem; text-align:center;">Chiến Binh Ánh Sáng</div>
                         <div style="font-size: 0.72rem; color: var(--text-muted); text-align:center; line-height:1.4;">Tăng +15% sát thương tháp (+5%/cấp)</div>
                     </div>
                     <div class="hero-card" id="btn-select-frost-mage" style="border: 2px solid var(--border-color); border-radius: 12px; padding: 15px; cursor: pointer; width: 31%; transition: all 0.3s; background: rgba(255,255,255,0.02); display:flex; flex-direction:column; align-items:center;">
                         <div style="font-size: 2.5rem; margin-bottom: 8px;">❄️</div>
                         <div style="font-weight: bold; color: var(--text-main); margin-bottom: 5px; font-size:0.95rem; text-align:center;">Pháp Sư Băng Giá</div>
                         <div style="font-size: 0.72rem; color: var(--text-muted); text-align:center; line-height:1.4;">Tăng +15% tầm bắn tháp (+3%/cấp) và làm chậm</div>
                     </div>
                     <div class="hero-card" id="btn-select-gold-knight" style="border: 2px solid var(--border-color); border-radius: 12px; padding: 15px; cursor: pointer; width: 31%; transition: all 0.3s; background: rgba(255,255,255,0.02); display:flex; flex-direction:column; align-items:center;">
                         <div style="font-size: 2.5rem; margin-bottom: 8px;">🪙</div>
                         <div style="font-weight: bold; color: var(--text-main); margin-bottom: 5px; font-size:0.95rem; text-align:center;">Thần Tài Chiêu Lộc</div>
                         <div style="font-size: 0.72rem; color: var(--text-muted); text-align:center; line-height:1.4;">Giảm -10% giá xây tháp và nhận +20% vàng (+4%/cấp)</div>
                     </div>
                   </div>`,
            showConfirmButton: false,
            allowOutsideClick: false,
            target: document.getElementById('tab-practice') || 'body',
            customClass: {
                popup: 'hero-select-popup'
            },
            didOpen: () => {
                const container = typeof Swal.getHtmlContainer === 'function' ? Swal.getHtmlContainer() : document;
                const cardLight = container.querySelector("#btn-select-light-warrior");
                const cardFrost = container.querySelector("#btn-select-frost-mage");
                const cardGold = container.querySelector("#btn-select-gold-knight");

                if (cardLight) cardLight.onclick = () => window.selectTdHero("light_warrior");
                if (cardFrost) cardFrost.onclick = () => window.selectTdHero("frost_mage");
                if (cardGold) cardGold.onclick = () => window.selectTdHero("gold_knight");
            }
        });
    },

    // Chọn chế độ thực hành (Trắc nghiệm thường vs Thủ thành)
    selectPracticeMode: function(mode) {
        if (mode === 'game') {
            // 1. Phải là phần Khó hoặc Chất lượng cao
            if (this.currentLevel !== 'kho' && this.currentLevel !== 'chat-luong-cao') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Không thể chơi game! 🔒',
                    html: '<p style="font-size:1.05rem;">Nếu muốn chơi game, con <b>nhất định phải luyện tập phần Khó hoặc Chất lượng cao</b>.</p><p style="color:var(--danger); font-weight:bold; margin-top:0.5rem;">Phần Cơ bản và Nâng cao không được chơi game!</p>',
                    confirmButtonText: 'Đã hiểu',
                    confirmButtonColor: 'var(--primary)',
                    target: document.getElementById('tab-practice') || 'body'
                });
                return;
            }
            
            // 2. Kiểm tra điều kiện mở khóa phần tương ứng
            if (window.app && typeof app.getLevelData === 'function') {
                if (this.currentLevel === 'chat-luong-cao') {
                    const khoData = app.getLevelData(this.currentLesson.id, 'kho');
                    if (khoData.score < 100) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Yêu cầu hoàn thành phần Khó! 🔒',
                            html: `<p style="font-size:1.05rem; margin-bottom:1rem;">Con chưa đủ điều kiện chơi game ở phần Chất lượng cao. Con cần <b>hoàn thành đạt điểm 100% ở phần Khó</b> của bài học này trước nhé.</p>` +
                                  `<div style="text-align:left; background:rgba(0,0,0,0.05); padding:1rem; border-radius:8px; display:inline-block; margin:0 auto; font-family:var(--font-family) !important;">` +
                                  `• Điểm phần <b>Khó</b> hiện tại: <b style="color:var(--danger);">${khoData.score}%</b>` +
                                  `</div>`,
                            confirmButtonText: 'Đồng ý, học tiếp',
                            confirmButtonColor: 'var(--primary)',
                            target: document.getElementById('tab-practice') || 'body'
                        });
                        return;
                    }
                } else if (this.currentLevel === 'kho') {
                    const nangCaoData = app.getLevelData(this.currentLesson.id, 'nang-cao');
                    if (nangCaoData.score < 100) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Yêu cầu hoàn thành phần Nâng cao! 🔒',
                            html: `<p style="font-size:1.05rem; margin-bottom:1rem;">Con chưa đủ điều kiện chơi game ở phần Khó. Con cần <b>hoàn thành đạt điểm 100% ở phần Nâng cao</b> của bài học này trước nhé.</p>` +
                                  `<div style="text-align:left; background:rgba(0,0,0,0.05); padding:1rem; border-radius:8px; display:inline-block; margin:0 auto; font-family:var(--font-family) !important;">` +
                                  `• Điểm phần <b>Nâng cao</b> hiện tại: <b style="color:var(--danger);">${nangCaoData.score}%</b>` +
                                  `</div>`,
                            confirmButtonText: 'Đồng ý, học tiếp',
                            confirmButtonColor: 'var(--primary)',
                            target: document.getElementById('tab-practice') || 'body'
                        });
                        return;
                    }
                }
            }
        }

        this.practiceMode = mode;
        this.hero.load();
        
        document.getElementById("practice-mode-select-box").classList.add("hidden");
        document.getElementById("practice-active-box").classList.remove("hidden");
        
        const splitContainer = document.getElementById("practice-split-container");
        const gameContainer = document.getElementById("td-game-container");
        const questionContainer = document.getElementById("td-question-container");
        
        if (mode === 'game') {
            // Làm xong toàn bộ câu hỏi mới chơi game: Ẩn game ngay từ đầu, câu hỏi chiếm toàn màn hình
            if (splitContainer) splitContainer.classList.remove("practice-split-active");
            if (gameContainer) gameContainer.classList.add("hidden");
            if (questionContainer) questionContainer.classList.remove("hidden");
            
            // Ẩn nút chơi thử Đấu trường theo yêu cầu
            const testBtn = document.getElementById("test-game-btn");
            if (testBtn) testBtn.classList.add("hidden");
            
            // Khởi tạo game TD và truyền dữ liệu Hero
            if (window.game) {
                game.init('td-canvas', this.currentQuestions.length, this.hero);
            }
        } else {
            if (splitContainer) splitContainer.classList.remove("practice-split-active");
            if (gameContainer) gameContainer.classList.add("hidden");
            if (questionContainer) questionContainer.classList.remove("hidden");
            
            // Ẩn nút chơi thử Đấu trường nếu ở chế độ thường
            const testBtn = document.getElementById("test-game-btn");
            if (testBtn) testBtn.classList.add("hidden");
        }
        
        // Hiển thị câu hỏi đầu tiên
        this.showQuestion();
    },

    // Kích hoạt đồng hồ đếm ngược bài thi
    startExamTimer: function() {
        this.examTimeRemaining = 2700; // 45 phút
        document.getElementById("exam-timer-wrapper").classList.remove("hidden");
        this.updateExamTimerDisplay();
        
        this.examInterval = setInterval(() => {
            this.examTimeRemaining--;
            this.updateExamTimerDisplay();
            
            if (this.examTimeRemaining <= 0) {
                clearInterval(this.examInterval);
                Swal.fire({
                    icon: 'info',
                    title: 'Hết giờ làm bài!',
                    text: 'Thời gian 45 phút làm bài thi đã hết. Hệ thống sẽ tự động nộp bài và chấm điểm của con.',
                    target: document.getElementById('tab-practice') || 'body',
                    confirmButtonText: 'Xem kết quả',
                    confirmButtonColor: 'var(--primary)'
                }).then(() => {
                    this.finishPractice();
                });
            }
        }, 1000);
    },

    updateExamTimerDisplay: function() {
        const mins = Math.floor(this.examTimeRemaining / 60);
        const secs = this.examTimeRemaining % 60;
        document.getElementById("exam-timer-val").innerText = mins.toString().padStart(2, '0') + ":" + secs.toString().padStart(2, '0');
    },

    // Bộ sinh đề chi tiết cho 22 dạng bài với 3 cấp độ,
        renderQuestionsNav: function() {
        const navPanel = document.getElementById("questions-nav-panel");
        const navGrid = document.getElementById("questions-nav-grid");
        if (!navPanel || !navGrid) return;

        navGrid.innerHTML = "";
        
        this.currentQuestions.forEach((q, idx) => {
            const btn = document.createElement("button");
            btn.className = "q-nav-btn";
            btn.innerText = idx + 1;
            btn.onclick = () => this.goToQuestion(idx);

            // Active
            if (idx === this.currentQuestionIndex) {
                btn.classList.add("active");
            }

            if (this.isGraded) {
                // Đã chấm điểm: xanh lá nếu đúng, đỏ nếu sai
                const isCorrect = q.isShortAnswer ? 
                    this.checkShortAnswer(q.userShortAnswer || '', q.options[q.correctIndex]) :
                    q.userSelectedIndex === q.correctIndex;
                
                if (isCorrect) {
                    btn.classList.add("correct");
                } else {
                    btn.classList.add("incorrect");
                }
            } else {
                // Chưa chấm điểm: xanh dương nếu đã trả lời, xám nhạt nếu chưa
                const hasAnswered = q.isShortAnswer ? 
                    (q.userShortAnswer !== undefined && q.userShortAnswer !== '') :
                    (q.userSelectedIndex !== undefined && q.userSelectedIndex !== null);
                if (hasAnswered) {
                    btn.classList.add("answered");
                }
            }

            navGrid.appendChild(btn);
        });
    },

    goToQuestion: function(idx) {
        if (idx < 0 || idx >= this.currentQuestions.length) return;
        this.saveCurrentAnswer();
        this.currentQuestionIndex = idx;
        this.showQuestion();
        this.renderQuestionsNav();
    },

    saveCurrentAnswer: function() {
        const q = this.currentQuestions[this.currentQuestionIndex];
        if (!q) return;
        if (q.isShortAnswer) {
            const inputEl = document.getElementById("short-answer-input");
            q.userShortAnswer = inputEl ? inputEl.value.trim() : "";
        } else {
            q.userSelectedIndex = this.selectedOption;
        }
    },

    submitPracticeGame: function() {
        this.saveCurrentAnswer();
        
        let correctCount = 0;
        this.currentQuestions.forEach(q => {
            const isCorrect = q.isShortAnswer ? 
                this.checkShortAnswer(q.userShortAnswer || '', q.options[q.correctIndex]) :
                q.userSelectedIndex === q.correctIndex;
            if (isCorrect) correctCount++;
        });
        
        const N = this.currentQuestions.length;
        
        if (correctCount === N) {
            // Đạt 100% đúng: Thưởng vàng và XP cố định
            this.accumulatedGold = N * 50;
            this.accumulatedXp = N * 20;
            
            // Chuyển sang Phase game thủ thành
            this.switchToBattlePhase();
        } else {
            // Có câu sai: Phạt trừ tiền và XP
            this.accumulatedGold = -50;
            this.accumulatedXp = -20;
            
            if (this.hero) {
                this.hero.addXp(-20);
            }
            
            Swal.fire({
                icon: 'error',
                title: 'Chưa đạt 100% chính xác! 🥺',
                text: 'Con phải trả lời đúng 100% tất cả các câu hỏi thì mới được tham gia Đấu Trường Thủ Thành. Lần này con đã bị phạt trừ tiền vàng và XP. Hãy cẩn thận làm lại đề mới nhé!',
                confirmButtonText: 'Làm đề mới',
                confirmButtonColor: 'var(--danger)',
                target: document.getElementById('tab-practice') || 'body',
                allowOutsideClick: false
            }).then(() => {
                this.initPractice(this.currentLesson, this.currentLevel, this.isExamMode);
            });
        }
    },

    showNextHint: function() {
        const q = this.currentQuestions[this.currentQuestionIndex];
        if (this.hintsShown >= q.hints.length) return;

        const hintList = document.getElementById("hint-list-ul");
        const hintsBox = document.getElementById("hints-content-box");
        hintsBox.classList.remove("hidden");

        const li = document.createElement("li");
        li.className = "hint-item animate-bounce-in";
        li.innerHTML = "<span class=\"hint-num\">" + (this.hintsShown + 1) + "</span> <span>" + q.hints[this.hintsShown] + "</span>";
        hintList.appendChild(li);

        this.hintsShown++;
        
        if (window.renderMathInElement) {
            try {
                window.renderMathInElement(li, {
                    delimiters: [
                        {left: "$$", right: "$$", display: true},
                        {left: "$", right: "$", display: false}
                    ],
                    throwOnError: false,
                    errorColor: '#ef4444'
                });
            } catch (err) {
                console.warn("[KaTeX Hint render error]", err);
            }
        }

        const hintsLeft = q.hints.length - this.hintsShown;
        document.getElementById("hints-left").innerText = hintsLeft;

        if (hintsLeft === 0) {
            document.getElementById("hint-toggle-btn").disabled = true;
        }
    },

     nextQuestion: function() {
        this.saveCurrentAnswer();
        
        if (this.isGraded) {
            if (this.currentQuestionIndex === this.currentQuestions.length - 1) {
                // Quay lại bảng điểm kết quả
                document.getElementById("practice-active-box").classList.add("hidden");
                document.getElementById("practice-result-box").classList.remove("hidden");
                document.body.classList.remove("super-focus-active");
            } else {
                this.currentQuestionIndex++;
                this.showQuestion();
            }
            return;
        }

        if (this.practiceMode === 'game') {
            if (this.currentQuestionIndex === this.currentQuestions.length - 1) {
                // Đang ở câu cuối cùng ở chế độ Game: Thực hiện nộp bài chấm điểm toàn bộ
                this.submitPracticeGame();
            } else {
                // Chưa phải câu cuối: chuyển sang câu tiếp theo
                this.currentQuestionIndex++;
                this.showQuestion();
                this.renderQuestionsNav();
            }
        } else {
            // Chế độ Luyện tập trắc nghiệm thường và Bài thi
            if (this.currentQuestionIndex === this.currentQuestions.length - 1) {
                // Câu cuối cùng -> Chấm điểm và kết thúc
                this.finishPractice();
            } else {
                // Chưa phải câu cuối: chuyển sang câu tiếp theo
                this.currentQuestionIndex++;
                this.showQuestion();
                this.renderQuestionsNav();
            }
        }
    },

    // Chuyển từ Phase làm toán sang Phase chiến đấu thủ thành
    switchToBattlePhase: function() {
        // Ẩn hoàn toàn giao diện câu hỏi trắc nghiệm và nút chuyển câu
        const splitContainer = document.getElementById("practice-split-container");
        const gameContainer = document.getElementById("td-game-container");
        const questionContainer = document.getElementById("td-question-container");
        
        if (splitContainer) splitContainer.classList.remove("practice-split-active");
        if (questionContainer) questionContainer.classList.add("hidden");
        if (gameContainer) gameContainer.classList.remove("hidden");
        
        // Phóng to tối đa màn hình game
        document.body.classList.add("game-mode-active");
        
        // Co nhỏ sidebar để phóng to màn hình game
        if (window.app && typeof app.collapseSidebar === 'function') {
            app.collapseSidebar();
        }
        
        const nextBtn = document.getElementById("next-question-btn");
        const testBtn = document.getElementById("test-game-btn");
        if (nextBtn) nextBtn.classList.add("hidden");
        if (testBtn) testBtn.classList.add("hidden");
        
        // Hiển thị nút bắt đầu đợt quái
        const startWaveBtn = document.getElementById("btn-start-wave");
        if (startWaveBtn) startWaveBtn.classList.remove("hidden");
        
        // Nạp vàng và XP tích lũy sang game.js
        if (window.game) {
            game.gold = Math.max(100, 150 + (this.accumulatedGold || 0)); // Vàng khởi đầu = 150G + vàng tích lũy (tối thiểu 100G)
            game.updateHUD();
            
            // Cho phép chuẩn bị chiến đấu
            game.isBattlePhase = true;
            game.currentWave = 0; // reset wave về 0 để chuẩn bị đợt 1
            game.totalWaves = 5;  // Cố định 5 đợt phòng thủ
            
            // Cộng XP tích lũy và XP thưởng hoàn thành bài học (+80) cho Hero
            this.hero.addXp((this.accumulatedXp || 0) + 80);
            
            // Đồng bộ lại Hero mới lên game.js
            game.hero = this.hero;
            
            // Bắt đầu phát nhạc nền game
            if (window.app && app.audio) {
                app.audio.playBackground();
            }
        }
        
        // Thông báo bằng SweetAlert2 chào mừng bé vào Đấu trường
        Swal.fire({
            title: 'ĐẾN ĐẦU TRƯỜNG THỦ THÀNH! 🏰',
            html: `<p>Chúc mừng con! Con đã hoàn thành chính xác 100% tất cả <b>${this.currentQuestions.length} câu hỏi</b>!</p>
                   <p>Con nhận được phần thưởng: <b>+${this.accumulatedGold} vàng 🪙</b> và <b>+${this.accumulatedXp} XP 🏆</b>.</p>
                   <p style="color:var(--success); font-weight:bold; font-size:1.1rem; margin-top:0.5rem;">Giờ hãy xây dựng các tháp canh chiến thuật trên bãi cỏ, sau đó bấm nút "BẮT ĐẦU PHÒNG THỦ" ở dưới để ngăn chặn quái vật nhé!</p>`,
            confirmButtonText: 'Bắt đầu dàn trận ngay!',
            confirmButtonColor: 'var(--success)',
            target: document.getElementById('tab-practice') || 'body',
            allowOutsideClick: false
        });
    },

    // Bỏ qua làm bài tập để kiểm thử game nhanh
    skipToTestGame: function() {
        Swal.fire({
            title: 'Chơi thử Đấu Trường? 🎮',
            text: 'Bỏ qua làm toán để kiểm thử trực tiếp game?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Đồng ý, test game!',
            cancelButtonText: 'Hủy',
            confirmButtonColor: 'var(--success)',
            target: document.getElementById('tab-practice') || 'body'
        }).then((result) => {
            if (result.isConfirmed) {
                // Đặt các đáp án đúng để lách luật 100% đúng
                this.currentQuestions.forEach(q => {
                    q.userSelectedIndex = q.correctIndex;
                });
                this.accumulatedGold = 250; // Cho thêm vàng để test tháp canh cấp cao dễ dàng
                this.switchToBattlePhase();
            }
        });
    },

    // Callback được gọi từ game.js khi đợt quái thủ thành kết thúc
    onWaveComplete: function() {
        if (!this.currentQuestions) return;
        const nextBtn = document.getElementById("next-question-btn");
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.classList.remove("hidden");
            if (this.currentQuestionIndex === this.currentQuestions.length - 1) {
                nextBtn.innerHTML = "Xem kết quả &nbsp; <i class=\"fa-solid fa-paper-plane\"></i>";
            } else {
                nextBtn.innerHTML = "Tiếp tục &nbsp; <i class=\"fa-solid fa-arrow-right\"></i>";
            }
        }
    },

    finishPractice: function() {
        this.isGraded = true;
        
        // Vô hiệu hóa nút nộp bài để chống spam click nộp nhiều lần
        const nextBtn = document.getElementById("next-question-btn");
        if (nextBtn) {
            nextBtn.disabled = true;
            nextBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang nộp bài...`;
        }

        if (window.game) game.stop();
        if (this.examInterval) clearInterval(this.examInterval);
        
        // Mở rộng lại sidebar khi thoát chế độ thực hành
        if (window.app && typeof app.expandSidebar === 'function') {
            app.expandSidebar();
        }
        
        // Cộng phần thưởng XP lớn cho Hero khi hoàn thành cả bài luyện tập
        if (this.practiceMode === 'game') {
            this.hero.addXp(80);
        }
        document.getElementById("exam-timer-wrapper").classList.add("hidden");
        document.getElementById("practice-progress").style.width = "100%";

        // Tắt Super Focus Mode
        document.body.classList.remove("super-focus-active");
        
        // Tắt chế độ hiển thị phóng to game
        document.body.classList.remove("game-mode-active");

        // Thoát toàn màn hình
        app.exitFullscreen();
        document.body.classList.remove("practice-fullscreen-active");
        app.restoreScrollbar();

        // Chấm điểm hàng loạt các câu hỏi
        this.correctCount = 0;
        this.currentQuestions.forEach(q => {
            const isCorrect = q.isShortAnswer ? 
                this.checkShortAnswer(q.userShortAnswer || '', q.options[q.correctIndex]) :
                q.userSelectedIndex === q.correctIndex;
            if (isCorrect) {
                this.correctCount++;
            } else {
                // Trừ 10 XP môn Toán nếu sai (cho phép âm XP)
                if (app && app.state) {
                    app.state.xp = (app.state.xp || 0) - 10;
                }
            }
            // Lưu kết quả từng câu vào lịch sử cho Phụ huynh (bỏ qua lưu tiến trình từng câu để tránh xung đột)
            app.saveQuestionResult(this.currentLesson.id, q.type, isCorrect, true);
        });

        const scorePercent = Math.round((this.correctCount / this.currentQuestions.length) * 100);
        let rank = "";
        let desc = "";
        let emoji = "";
        let xpEarned = 0;
        let isPassed = false;

        const _sn = (app && app.config && app.config.studentName) || 'Con';
        const _pn = (app && app.config && app.config.parentName) || 'Bố';

        // Phân loại 6 mức độ nhận thức với mốc đạt >= 80% (Loại Giỏi trở lên)
        let baseXp = 50;
        if (this.isExamMode || this.isLessonExamMode) {
            baseXp = 100;
        } else {
            if (this.currentLevel === 'co-ban') baseXp = 50;
            else if (this.currentLevel === 'nang-cao') baseXp = 70;
            else if (this.currentLevel === 'kho') baseXp = 100;
            else if (this.currentLevel === 'chat-luong-cao') baseXp = 150;
        }

        if (scorePercent >= 95) {
            rank = "Xuất sắc";
            desc = (this.isExamMode || this.isLessonExamMode) ? `${_pn} chúc mừng ${_sn} nhé! Con đã vượt qua bài kiểm tra một cách xuất sắc. ${_pn} tự hào về con lắm!` : `Tuyệt vời ${_sn}! Con đã làm đúng hết các câu hỏi của dạng bài này. ${_pn} thưởng cho con nhé!`;
            emoji = "👑";
            xpEarned = baseXp;
            isPassed = true;
        } else if (scorePercent >= 80) {
            rank = "Giỏi";
            desc = (this.isExamMode || this.isLessonExamMode) ? `Chúc mừng ${_sn}! Con đã đỗ bài kiểm tra và mở khóa bài tiếp theo. ${_pn} rất vui!` : `${_sn} học giỏi lắm! Con đã vượt qua dạng bài luyện tập này rồi. Tiếp tục phát huy con nhé!`;
            emoji = "🎉";
            xpEarned = Math.round(baseXp * 0.8);
            isPassed = true;
        } else if (scorePercent >= 70) {
            rank = "Khá";
            desc = `${_sn} làm khá tốt rồi! Tuy nhiên, con cần đạt từ 80% trở lên để vượt qua. Luyện tập lại một chút, ${_pn} tin con sẽ đạt điểm tuyệt đối!`;
            emoji = "👍";
            xpEarned = Math.round(baseXp * 0.5);
            isPassed = false;
        } else if (scorePercent >= 50) {
            rank = "Đạt";
            desc = `${_sn} đã có tiến bộ rồi! Con hãy xem kỹ lời giải chi tiết của ${_pn} biên soạn ở dưới và làm lại để nâng cao điểm số nhé.`;
            emoji = "✍️";
            xpEarned = Math.round(baseXp * 0.3);
            isPassed = false;
        } else if (scorePercent >= 35) {
            rank = "Yếu";
            desc = `${_sn} cố lên nào! Phần này hơi khó, con hãy đọc lại phần Lý thuyết rồi thử sức lại nhé. ${_pn} luôn đồng hành cùng con!`;
            emoji = "📚";
            xpEarned = Math.round(baseXp * 0.1);
            isPassed = false;
        } else {
            rank = "Không đạt";
            desc = `Không sao đâu ${_sn}! Thất bại là mẹ thành công. Con hãy đọc kỹ hướng dẫn của ${_pn} dưới đây rồi thử lại nhé!`;
            emoji = "❌";
            xpEarned = 0;
            isPassed = false;
        }

        // Phát hiệu ứng âm thanh hoàn thành bài tập dựa trên kết quả đạt/không đạt
        if (window.app && app.audio) {
            if (isPassed) {
                app.audio.playVictory();
            } else {
                app.audio.playDefeat();
            }
        }

        document.getElementById("result-icon-emoji").innerText = emoji;
        document.getElementById("result-score-title").innerText = rank + " (" + scorePercent + "%)";
        document.getElementById("result-score-desc").innerText = desc;
        document.getElementById("xp-earned-val").innerText = xpEarned;
        document.getElementById("result-correct-count").innerText = this.correctCount + "/" + this.currentQuestions.length;
        
        const rankBadge = document.getElementById("result-rank-badge");
        rankBadge.innerText = rank;
        if (!isPassed) {
            rankBadge.style.backgroundColor = "var(--danger-bg)";
            rankBadge.style.color = "var(--danger)";
        } else {
            rankBadge.style.backgroundColor = "var(--success-bg)";
            rankBadge.style.color = "var(--success)";
        }

        // Tính thời gian làm bài (giây)
        const timeSpent = Math.round((Date.now() - this.practiceStartTime) / 1000);

        // Lưu kết quả học tập tùy thuộc vào chế độ luyện tập dạng hay kiểm tra tổng thể
        if (this.isSubtopicPracticeMode) {
            // Luyện tập dạng bài
            if (isPassed) {
                if (!app.state.completedSubtopics.includes(this.currentSubtopic.id)) {
                    app.state.completedSubtopics.push(this.currentSubtopic.id);
                }
            }
            app.state.subtopicScores = app.state.subtopicScores || {};
            app.state.subtopicScores[this.currentSubtopic.id] = Math.max(app.state.subtopicScores[this.currentSubtopic.id] || 0, scorePercent);
            
            // Tích lũy XP và thời gian
            app.state.xp += xpEarned;
            app.logLearningTime(10);
            
            // Kiểm tra và mở khóa huy hiệu
            app.checkAndUnlockBadges(this.currentLesson.id, scorePercent, timeSpent, 0, this.practiceDistractions);
            app.saveProgress();
            app.checkAndReward100PercentLesson(this.currentLesson.id, 'math');
            app.updateHeaderStats();
        } else {
            // Kiểm tra tổng thể bài học, Luyện tập chung hoặc Kiểm tra chương
            app.saveLessonScore(this.currentLesson.id, scorePercent, xpEarned, isPassed, timeSpent, this.practiceDistractions);
            app.checkAndReward100PercentLesson(this.currentLesson.id, 'math');
            
            // Lưu điểm số cao nhất của cấp độ nếu không phải là bài thi/kiểm tra tổng thể
            if (!this.isExamMode && !this.isLessonExamMode) {
                app.state.levelScores = app.state.levelScores || {};
                const key = `${this.currentLesson.id}_${this.currentLevel}`;
                app.state.levelScores[key] = Math.max(app.state.levelScores[key] || 0, scorePercent);
                app.saveProgress();
            }
        }

        // Tạo bản ghi lượt làm bài (session) hoàn chỉnh và lưu vào state
        const sessionRecord = {
            id: "sess-" + Date.now(),
            lessonId: this.currentLesson.id,
            lessonTitle: this.currentLesson.title,
            level: this.currentLevel,
            // Phân loại chi tiết loại bài (không gộp chung để phân biệt rõ trong lịch sử)
            isExam: this.isExamMode,                              // true = Thi cuối chương (kt-c1...)
            isLessonExam: this.isLessonExamMode,                  // true = Kiểm tra tổng thể bài học
            isSubtopicPractice: this.isSubtopicPracticeMode,     // true = Luyện tập theo Dạng bài
            isWeaknessPractice: this.isWeaknessPracticeMode,     // true = Luyện tập khắc phục điểm yếu AI
            subtopicId: this.isSubtopicPracticeMode ? (this.currentSubtopic ? this.currentSubtopic.id : null) : null,
            subtopicTitle: this.isSubtopicPracticeMode ? (this.currentSubtopic ? this.currentSubtopic.title : null) : null,
            date: new Date().toISOString(),
            correctCount: this.correctCount,
            totalQuestions: this.currentQuestions.length,
            scorePercent: scorePercent,
            timeSpent: timeSpent,
            distractions: this.practiceDistractions,
            questions: this.currentQuestions.map(q => {
                const isCorrect = q.isShortAnswer ? 
                    this.checkShortAnswer(q.userShortAnswer || '', q.options[q.correctIndex]) :
                    q.userSelectedIndex === q.correctIndex;
                return {
                    questionText: q.questionText,
                    options: q.options,
                    correctIndex: q.correctIndex,
                    userSelectedIndex: q.userSelectedIndex,
                    isShortAnswer: q.isShortAnswer || false,
                    userShortAnswer: q.userShortAnswer || "",
                    isCorrect: isCorrect,
                    solutionHtml: q.solutionHtml,
                    tip: q.tip,
                    level: q.level,
                    type: q.type
                };
            })
        };

        if (!app.state.examSessions) {
            app.state.examSessions = [];
        }
        app.state.examSessions.push(sessionRecord);
        // Giới hạn tối đa 150 session gần nhất để tránh LocalStorage bị phình quá lớn
        if (app.state.examSessions.length > 150) {
            app.state.examSessions = app.state.examSessions.slice(-150);
        }
        app.saveProgress();

        // Ẩn/Hiện nút xem lại bài kiểm tra và mặc định ẩn review cho tới khi con nhấn nút xem
        document.getElementById("exam-review-box").classList.add("hidden");
        
        const retryBtn = document.getElementById("retry-practice-btn");
        if (this.isExamMode || this.isLessonExamMode) {
            retryBtn.innerHTML = "<i class=\"fa-solid fa-rotate-right\"></i> Thi lại";
        } else {
            retryBtn.innerHTML = "<i class=\"fa-solid fa-rotate-right\"></i> Luyện tập lại";
        }

        // Bắn pháo hoa giấy và phát âm thanh vui vẻ nếu vượt qua bài học thành công (độc lập với mở khóa huy hiệu)
        if (isPassed) {
            app.confetti.start();
            app.audio.playBadge();
        }

        // Tự động mở khóa chương sau nếu đỗ bài thi kết thúc chương
        if (this.isExamMode && isPassed) {
            // Mở khóa huy hiệu chương tương ứng
            let badgeName = "";
            if (this.currentLesson.id === "kt-c1") badgeName = "bac-thay-so-tu-nhien";
            else if (this.currentLesson.id === "kt-c2") badgeName = "chien-binh-chia-het";
            else if (this.currentLesson.id === "kt-c3") badgeName = "ky-si-so-nguyen";
            else if (this.currentLesson.id === "kt-c4") badgeName = "phu-thuy-hinh-hoc";
            else if (this.currentLesson.id === "kt-c5") badgeName = "bac-thay-doi-xung";
            else if (this.currentLesson.id === "kt-c6") badgeName = "bac-thay-phan-so";
            else if (this.currentLesson.id === "kt-c7") badgeName = "chien-binh-thap-phan";
            else if (this.currentLesson.id === "kt-c8") badgeName = "phu-thuy-hinh-co-ban";
            else if (this.currentLesson.id === "kt-c9") badgeName = "bac-thay-xac-suat";
            
            if (badgeName) {
                app.unlockBadge(badgeName);
            }
        }

        // Cập nhật lại Đánh giá phân tích chi tiết và Lịch sử bài học ở cột phải trang chủ ngay lập tức
        app.updateLessonEvaluation(this.currentLesson.id);
        app.renderLessonHistory(this.currentLesson.id);

        document.getElementById("practice-active-box").classList.add("hidden");
        document.getElementById("practice-result-box").classList.remove("hidden");
    },

    // Render danh sách xem lại các câu hỏi kèm theo Lời giải và Mẹo thi
    renderExamReview: function() {
        const reviewBox = document.getElementById("exam-review-box");
        const reviewList = document.getElementById("exam-review-list");
        reviewList.innerHTML = "";

        reviewBox.classList.remove("hidden");
        const parentName = (app && app.config && app.config.parentName) || 'Bố';
        const h4Title = reviewBox.querySelector("h4");
        if (h4Title) {
            h4Title.innerHTML = `<i class="fa-solid fa-square-poll-vertical"></i> Chi tiết bài làm & Giải thích của ${parentName}`;
        }

        this.currentQuestions.forEach((q, idx) => {
            const isCorrect = q.isShortAnswer ? 
                this.checkShortAnswer(q.userShortAnswer || '', q.options[q.correctIndex]) :
                q.userSelectedIndex === q.correctIndex;
            const itemDiv = document.createElement("div");
            itemDiv.className = "review-item card";
            itemDiv.style.borderLeft = isCorrect ? "5px solid var(--success)" : "5px solid var(--danger)";
            itemDiv.style.padding = "1.5rem";
            itemDiv.style.marginBottom = "1rem";
            itemDiv.style.backgroundColor = "var(--bg-card)";
            itemDiv.style.boxShadow = "var(--shadow-sm)";
            
            let optionsHtml = "";
            if (q.isShortAnswer) {
                optionsHtml = `
                    <div style="margin-bottom:0.4rem; color:${isCorrect ? 'var(--success)' : 'var(--danger)'};">
                        <b>Đáp án của con:</b> ${q.userShortAnswer || "Không có câu trả lời"} ${isCorrect ? '✔️' : '❌'}
                    </div>
                    <div style="margin-bottom:0.4rem; color:var(--success); font-weight:700;">
                        <b>Đáp án đúng:</b> ${q.options[q.correctIndex]}
                    </div>
                `;
            } else {
                optionsHtml = q.options.map((opt, oIdx) => {
                    let colorStyle = "";
                    let icon = "";
                    if (oIdx === q.correctIndex) {
                        colorStyle = "color:var(--success); font-weight:700;";
                        icon = "✔️ ";
                    } else if (oIdx === q.userSelectedIndex) {
                        colorStyle = "color:var(--danger); font-weight:700;";
                        icon = "❌ ";
                    }
                    return "<div style=\"margin-bottom:0.4rem; " + colorStyle + "\">" + icon + "<b>" + ["A", "B", "C", "D"][oIdx] + ".</b> " + opt + "</div>";
                }).join("");
            }

            itemDiv.innerHTML = `
                <div style="font-family: var(--font-family) !important; font-weight:700; margin-bottom:0.8rem; display:flex; justify-content:space-between; font-size:0.95rem;">
                    <span style="font-family: var(--font-family) !important;">Câu hỏi ${idx + 1} <span style="font-family: var(--font-family) !important; font-weight:normal; font-size:0.8rem; margin-left:8px; color:var(--text-muted);">(${q.level === 'co-ban' ? 'Cơ bản' : (q.level === 'nang-cao' ? 'Nâng cao' : 'Khó')})</span></span>
                    <span style="font-family: var(--font-family) !important; color: ${isCorrect ? 'var(--success)' : 'var(--danger)'}; font-weight:700;">
                        ${isCorrect ? 'Đúng' : 'Sai'}
                    </span>
                </div>
                <div class="math-render" style="font-family: var(--font-family) !important; font-size:1.1rem; margin-bottom:1rem; font-weight:600; line-height:1.5;">${q.questionText}</div>
                <div class="math-render" style="font-family: var(--font-family) !important; margin-bottom:1rem; padding-left:1rem; border-left:3px solid var(--border-color);">${optionsHtml}</div>
                
                <div style="font-family: var(--font-family) !important; background-color:var(--primary-bg); padding:1rem; border-radius:8px; margin-top:1rem; font-size:0.95rem;">
                    <strong style="font-family: var(--font-family) !important; color:var(--primary);"><i class="fa-solid fa-graduation-cap"></i> Lời giải chi tiết:</strong>
                    <div class="math-render" style="font-family: var(--font-family) !important; margin-top:0.4rem; line-height:1.6; color:var(--text-main);">${q.solutionHtml || "Đang cập nhật..."}</div>
                </div>
                
                <div style="font-family: var(--font-family) !important; background-color:var(--warning-bg); padding:1rem; border-radius:8px; margin-top:0.8rem; font-size:0.95rem;">
                    <strong style="font-family: var(--font-family) !important; color:var(--warning);"><i class="fa-solid fa-lightbulb"></i> Mẹo khi làm bài (Exam Tips):</strong>
                    <div class="math-render" style="font-family: var(--font-family) !important; margin-top:0.4rem; line-height:1.6; color:var(--text-main);"><i>${q.tip || "Đọc kỹ đề bài và loại trừ phương án sai."}</i></div>
                </div>
            `;
            reviewList.appendChild(itemDiv);
        });

        // Render KaTeX riêng cho các phần tử chứa công thức toán học, tránh làm ảnh hưởng font chữ tiếng Việt tĩnh
        if (window.renderMathInElement) {
            const mathElements = reviewList.querySelectorAll(".math-render");
            mathElements.forEach(el => {
                try {
                    window.renderMathInElement(el, {
                        delimiters: [
                            {left: "$$", right: "$$", display: true},
                            {left: "$", right: "$", display: false}
                        ],
                        throwOnError: false,
                        errorColor: '#ef4444'
                    });
                } catch (err) {
                    console.warn("[KaTeX Review render error]", err);
                }
            });
        }
    },

    checkShortAnswer: function(userInput, correctText) {
        const cleanUser = this.cleanAnswerForComparison(userInput);
        const cleanCorrect = this.cleanAnswerForComparison(correctText);
        if (!cleanCorrect) return false;
        
        // So sánh bằng nhau tuyệt đối sau khi làm sạch
        if (cleanUser === cleanCorrect) return true;
        
        // Kiểm tra thông cảm sai lệch nhỏ nếu là dạng tập hợp, ví dụ người dùng gõ chỉ các phần tử {1; 2; 3} thay vì A={1; 2; 3}
        if (cleanCorrect.includes(cleanUser) && cleanUser.length >= Math.floor(cleanCorrect.length * 0.4)) return true;
        if (cleanUser.includes(cleanCorrect) && cleanCorrect.length >= Math.floor(cleanUser.length * 0.4)) return true;
        
        return false;
    },

    cleanAnswerForComparison: function(ans) {
        if (typeof ans !== 'string') return '';
        // Loại bỏ thứ tự phương án ở đầu (A. B. C. D. hoặc A) B) C) D))
        let s = ans.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim();
        // Loại bỏ ký tự đặc biệt LaTeX $
        s = s.replace(/\$/g, '').trim();
        // Thay thế dấu phẩy phân cách thành dấu chấm phẩy để đồng bộ (tránh số thập phân dạng d,d)
        s = s.replace(/,\s+/g, ';');
        s = s.replace(/([a-zA-Z=])\s*,\s*/g, '$1;');
        s = s.replace(/\s*,\s*([a-zA-Z=])/g, ';$1');
        // Loại bỏ các chữ cái đơn vị phổ biến trong tiếng Việt của lớp 6
        s = s.replace(/(chiếc kẹo|kẹo|hộp sữa|sữa|hộp|quả|bông hoa|hoa|quyển sách|sách|vở|bút|học sinh|bạn|khối rubik|khối|rubik|phần tử|ước|bội|dm|cm|m|kg|g|giờ|phút|giây|lít|l|độ c|độ|c)/g, '').trim();
        // Loại bỏ khoảng trắng và viết thường
        s = s.replace(/\s+/g, '').toLowerCase();
        return s;
    },

    shouldForceMCQ: function(questionText, correctOption) {
        if (typeof questionText !== 'string' || typeof correctOption !== 'string') return false;
        
        const textLower = questionText.toLowerCase();
        const mcqKeywords = [
            "dưới đây", "sau đây", "khẳng định nào", "phát biểu nào", 
            "cách viết nào", "nhận xét nào", "đáp án nào", "công thức nào",
            "hình nào", "trong các phát biểu", "khẳng định nào đúng", 
            "khẳng định nào sai", "phát biểu nào đúng", "phát biểu nào sai",
            "phương án nào", "lựa chọn nào"
        ];
        
        for (const kw of mcqKeywords) {
            if (textLower.includes(kw)) {
                return true;
            }
        }
        
        // Kiểm tra đáp án đúng (correctOption)
        // Loại bỏ ký tự $
        let cleanOpt = correctOption.replace(/\$/g, '').trim();
        
        // Nếu đáp án có chứa LaTeX phức tạp như phân số, căn thức, song song, vuông góc, góc, tam giác
        const complexLatex = [
            "\\frac", "\\sqrt", "\\parallel", "\\perp", "\\angle", "\\triangle", 
            "\\cup", "\\cap", "\\subset", "\\in", "\\notin", "\\bar", "\\overline",
            "\\times", "\\cdot", "\\degree", "^"
        ];
        for (const latex of complexLatex) {
            if (correctOption.includes(latex)) {
                return true;
            }
        }
        
        // Nếu là tập hợp phức tạp (có dấu ngoặc nhọn)
        if (correctOption.includes('{') || correctOption.includes('}')) {
            return true;
        }
        
        // Nếu đáp án chứa văn bản dài (ví dụ có chứa các từ tiếng Việt dài, không chỉ là số và đơn vị)
        // Loại bỏ các chữ số, dấu phép tính (+ - * / = < >)
        let textOnly = cleanOpt.replace(/[0-9\+\-\*\/\=\<\>\(\)\;\,\.\%]/g, '').trim();
        // Loại bỏ các đơn vị thông dụng
        const units = [
            "chiếc kẹo", "kẹo", "hộp sữa", "sữa", "hộp", "quả", "bông hoa", "hoa", 
            "quyển sách", "sách", "vở", "bút", "học sinh", "bạn", "khối rubik", 
            "khối", "rubik", "phần tử", "ước", "bội", "dm", "cm", "m", "kg", "g", 
            "giờ", "phút", "giây", "lít", "l", "độ c", "độ", "c", "trang", "tuổi", 
            "con", "cái", "ngày", "tháng", "năm", "đồng", "đ", "lần"
        ];
        for (const unit of units) {
            textOnly = textOnly.replace(new RegExp('\\b' + unit + '\\b', 'gi'), '').trim();
        }
        
        // Nếu sau khi loại bỏ số và đơn vị, phần chữ còn lại vẫn dài (ví dụ > 5 ký tự) hoặc chứa khoảng trắng (nhiều từ)
        if (textOnly.replace(/\s+/g, '').length > 5) {
            return true;
        }
        
        return false;
    },

    showPracticeReview: function() {
        this.isGraded = true;
        document.getElementById("practice-result-box").classList.add("hidden");
        document.getElementById("practice-active-box").classList.remove("hidden");
        
        // Đảm bảo hiển thị đúng cột câu hỏi và ẩn cột game (nếu có)
        const splitContainer = document.getElementById("practice-split-container");
        const gameContainer = document.getElementById("td-game-container");
        const questionContainer = document.getElementById("td-question-container");
        if (splitContainer) splitContainer.classList.remove("practice-split-active");
        if (gameContainer) gameContainer.classList.add("hidden");
        if (questionContainer) questionContainer.classList.remove("hidden");

        this.goToQuestion(0);
    },

    updateGradedScore: function() {
        this.correctCount = 0;
        this.currentQuestions.forEach(q => {
            const isCorrect = q.isShortAnswer ? 
                this.checkShortAnswer(q.userShortAnswer || '', q.options[q.correctIndex]) :
                q.userSelectedIndex === q.correctIndex;
            if (isCorrect) {
                this.correctCount++;
            }
        });
        const scorePercent = Math.round((this.correctCount / this.currentQuestions.length) * 100);
        
        // Cập nhật lại điểm số trên màn hình kết quả
        document.getElementById("result-correct-count").innerText = this.correctCount + "/" + this.currentQuestions.length;
        
        let rank = "Chưa đạt";
        if (scorePercent >= 95) rank = "Xuất sắc";
        else if (scorePercent >= 80) rank = "Giỏi";
        else if (scorePercent >= 70) rank = "Khá";
        else if (scorePercent >= 50) rank = "Đạt";
        else if (scorePercent >= 35) rank = "Yếu";
        
        document.getElementById("result-score-title").innerText = rank + " (" + scorePercent + "%)";
        const rankBadge = document.getElementById("result-rank-badge");
        if (rankBadge) {
            rankBadge.innerText = rank;
            const isPassed = scorePercent >= 80;
            rankBadge.style.backgroundColor = isPassed ? "var(--success-bg)" : "var(--danger-bg)";
            rankBadge.style.color = isPassed ? "var(--success)" : "var(--danger)";
        }
        
        // Lưu lại điểm số mới vào bộ nhớ
        if (this.isSubtopicPracticeMode) {
            app.state.subtopicScores = app.state.subtopicScores || {};
            app.state.subtopicScores[this.currentSubtopic.id] = Math.max(app.state.subtopicScores[this.currentSubtopic.id] || 0, scorePercent);
        } else {
            if (!this.isExamMode && !this.isLessonExamMode) {
                app.state.levelScores = app.state.levelScores || {};
                const key = `${this.currentLesson.id}_${this.currentLevel}`;
                app.state.levelScores[key] = Math.max(app.state.levelScores[key] || 0, scorePercent);
            }
        }
        app.saveProgress();
    },

    exitPractice: function() {
        if (this.isExiting) return;
        this.isExiting = true;

        if (this.isGraded) {
            // Đã chấm điểm: Quay lại bảng điểm kết quả thay vì hiện hộp thoại xác nhận thoát
            document.getElementById("practice-active-box").classList.add("hidden");
            document.getElementById("practice-result-box").classList.remove("hidden");
            document.body.classList.remove("super-focus-active");
            this.isExiting = false;
            return;
        }

        // Tạm dừng game nếu đang chơi game
        let wasGamePlaying = false;
        if (window.game && game.isPlaying) {
            wasGamePlaying = true;
            game.isPlaying = false; // tạm dừng loop
        }

        Swal.fire({
            title: `${(app && app.config && app.config.studentName) || 'Con'} muốn dừng làm bài?`,
            text: 'Kết quả lượt này sẽ không được lưu. Khi làm lại con sẽ gặp câu hỏi mới hoàn toàn nhé!',
            icon: 'warning',
            target: document.getElementById('tab-practice') || 'body',
            showCancelButton: true,
            confirmButtonColor: 'var(--danger)',
            cancelButtonColor: 'var(--primary)',
            confirmButtonText: 'Có, con muốn dừng',
            cancelButtonText: 'Không, con làm tiếp'
        }).then((result) => {
            if (result.isConfirmed) {
                if (window.game) game.stop();
                if (this.examInterval) clearInterval(this.examInterval);
                document.getElementById("exam-timer-wrapper").classList.add("hidden");
                
                // Mở rộng lại sidebar
                if (window.app && typeof app.expandSidebar === 'function') {
                    app.expandSidebar();
                }
                
                // Tắt Super Focus Mode
                document.body.classList.remove("super-focus-active");
                
                // Tắt chế độ hiển thị phóng to game
                document.body.classList.remove("game-mode-active");
                
                // Thoát toàn màn hình
                app.exitFullscreen();
                document.body.classList.remove("practice-fullscreen-active");
                
                // Khôi phục thanh cuộn cho body và html ngay lập tức
                app.restoreScrollbar();
                
                this.currentQuestions = [];
                
                // Trì hoãn việc ẩn và chuyển tab để tránh lỗi kẹt scrollbar của trình duyệt do ẩn phần tử đang fullscreen quá nhanh
                setTimeout(() => {
                    document.getElementById("practice-active-box").classList.add("hidden");
                    app.switchLessonTab('practice');
                    this.isExiting = false;
                }, 150);
            } else {
                this.isExiting = false;
                // Khôi phục game chạy tiếp nếu trước đó đang chơi game
                if (wasGamePlaying && window.game) {
                    game.isPlaying = true;
                    if (game.animationFrame) {
                        cancelAnimationFrame(game.animationFrame);
                    }
                    game.loop();
                }
            }
        });
    },

    // --- STUDENT PDF PRINTING METHODS ---
    showStudentPrintPrompt: function() {
        this.showStudentPrintPromptWithLevel();
    },

    showStudentPrintPromptWithLevel: function(level) {
        if (!this.currentLesson && window.app && app.currentLesson) {
            this.currentLesson = app.currentLesson;
        }
        const lesson = this.currentLesson;
        if (!lesson) {
            Swal.fire({ icon: 'warning', title: 'Thông báo', text: 'Không tìm thấy thông tin bài học hiện tại!' });
            return;
        }

        const selectedLevel = level || 'nang-cao';

        // 1. Nhập mã PIN
        Swal.fire({
            title: 'Xác nhận phụ huynh 🔑',
            text: 'Tính năng in đề thi giấy yêu cầu nhập mật mã phụ huynh để bảo mật đáp án.',
            input: 'password',
            inputPlaceholder: 'Nhập mật mã phụ huynh...',
            showCancelButton: true,
            confirmButtonColor: 'var(--primary)',
            cancelButtonColor: 'var(--danger)',
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy bỏ',
            target: document.getElementById('tab-practice') || 'body'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const pin = result.value;
                try {
                    const res = await fetch(app.getApiUrl("/api/verify-pin"), {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ pin })
                    });
                    if (res.ok) {
                        // 2. PIN đúng, hỏi chế độ in
                        let levelLabel = "Mức độ: " + (selectedLevel === 'co-ban' ? 'Cơ bản' : (selectedLevel === 'nang-cao' ? 'Nâng cao' : (selectedLevel === 'kho' ? 'Khó' : 'Chất lượng cao AI')));
                        Swal.fire({
                            title: 'Chọn chế độ in đề thi 🖨️',
                            html: `Chọn cách xuất bản đề thi cho bài học: <br/><b>${lesson.title}</b><br/><small style="color:var(--text-muted);">${levelLabel}</small>`,
                            icon: 'question',
                            showDenyButton: true,
                            showCancelButton: true,
                            confirmButtonText: 'In Đề + Đáp án',
                            denyButtonText: 'Chỉ in Đề thi',
                            cancelButtonText: 'Hủy',
                            confirmButtonColor: 'var(--success)',
                            denyButtonColor: 'var(--primary)',
                            target: document.getElementById('tab-practice') || 'body'
                        }).then((printChoice) => {
                            if (printChoice.isConfirmed) {
                                // In kèm đáp án
                                this.generateStudentPrintExam(lesson, true, selectedLevel);
                            } else if (printChoice.isDenied) {
                                // Chỉ in đề
                                this.generateStudentPrintExam(lesson, false, selectedLevel);
                            }
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Mật mã không đúng',
                            text: 'Mật mã phụ huynh nhập vào không chính xác!',
                            target: document.getElementById('tab-practice') || 'body'
                        });
                    }
                } catch (err) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi kết nối',
                        text: 'Không thể kết nối tới máy chủ.',
                        target: document.getElementById('tab-practice') || 'body'
                    });
                }
            }
        });
    },
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = PracticeUIRunner;
    if (typeof root !== 'undefined') root.PracticeUIRunner = PracticeUIRunner;
})(typeof window !== 'undefined' ? window : global);
