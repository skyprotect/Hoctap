// Helper lấy URL API tương ứng (tương thích chạy từ file:// và http://)
function getApiUrl(path) {
    if (typeof window !== 'undefined' && window.location && window.location.protocol === 'file:') {
        return `http://localhost:3000${path.startsWith('/') ? '' : '/'}${path}`;
    }
    return path;
}

// Quản lý Bảng điều khiển Phụ huynh
const parentDashboard = {
    chartTimeInstance: null,
    chartRateInstance: null,

    // Tên tiếng Việt của các kỹ năng học tập
    skillNames: {
        // Lớp 4
        "l4-on-tap-100k": "Ôn tập số tự nhiên đến 100 000",
        "l4-phep-tinh-100k": "Cộng, trừ, nhân, chia trong phạm vi 100 000",
        "l4-so-chan-le": "Số chẵn, số lẻ",
        "l4-bieu-thuc-chu": "Biểu thức chứa chữ",
        "l4-toan-ba-buoc-tinh": "Giải toán bằng ba bước tính",
        "l4-do-goc": "Góc nhọn, góc tù, góc bẹt",
        "l4-phan-loai-goc": "Đo góc, đơn vị đo góc",
        "l4-so-sau-chu-so": "Số có sáu chữ số",
        "l4-hang-va-lop": "Hàng và lớp của số tự nhiên",
        "l4-lop-trieu": "Lớp triệu",
        "l4-lam-tron-tram-nghin": "Làm tròn số đến hàng trăm nghìn",
        "l4-so-sanh-nhieu-chu-so": "So sánh các số có nhiều chữ số",
        "l4-day-so-tu-nhien": "Dãy số tự nhiên",
        "l4-yen-ta-tan": "Yến, tạ, tấn",
        "l4-don-vi-dien-tich": "Đề-xi-mét vuông, mét vuông, mi-li-mét vuông",
        "l4-giay-the-ki": "Giây, thế kỉ",
        "l4-cong-nhieu-chu-so": "Phép cộng số có nhiều chữ số",
        "l4-tru-nhieu-chu-so": "Phép trừ số có nhiều chữ số",
        "l4-tinh-chat-cong": "Tính chất giao hoán, kết hợp của phép cộng",
        "l4-tong-hieu": "Tìm hai số biết tổng và hiệu của chúng",
        "l4-duong-vuong-goc": "Hai đường thẳng vuông góc",
        "l4-duong-song-song": "Hai đường thẳng song song",
        "l4-binh-hanh-thoi": "Hình bình hành, hình thoi",
        "l4-nhan-mot-chu-so": "Nhân với số có một chữ số",
        "l4-chia-mot-chu-so": "Chia cho số có một chữ số",
        "l4-tinh-chat-nhan": "Tính chất phép nhân",
        "l4-nhan-chia-10-100": "Nhân, chia nhẩm với 10, 100, 1000...",
        "l4-nhan-phan-phoi": "Nhân một số với một tổng, một hiệu",
        "l4-nhan-hai-chu-so": "Nhân với số có hai chữ số",
        "l4-chia-hai-chu-so": "Chia cho số có hai chữ số",
        "l4-trung-binh-cong": "Trung bình cộng",
        "l4-rut-ve-don-vi": "Bài toán liên quan đến rút về đơn vị",
        "l4-thong-ke": "Dãy số liệu thống kê",
        "l4-bieu-do-cot": "Biểu đồ cột lớp 4",
        "l4-su-kien": "Số lần xuất hiện của một sự kiện",
        "l4-khai-niem-phan-so": "Phân số và phép chia số tự nhiên",
        "l4-phan-so-chia-so-tu-nhien": "Phân số và phép chia số tự nhiên",
        "l4-tinh-chat-phan-so": "Tính chất cơ bản của phân số",
        "l4-rut-gon-phan-so": "Rút gọn phân số",
        "l4-quy-dong-phan-so": "Quy đồng mẫu số các phân số",
        "l4-so-sanh-phan-so": "So sánh hai phân số",
        "l4-cong-phan-so": "Phép cộng phân số",
        "l4-tru-phan-so": "Phép trừ phân số",
        "l4-nhan-phan-so": "Phép nhân phân số",
        "l4-chia-phan-so": "Phép chia phân số",
        "l4-tim-phan-so-cua-so": "Tìm phân số của một số",

        "tap-hop": "Tập hợp & Liệt kê phần tử",
        "ghi-so-tu-nhien": "Cách ghi số tự nhiên & Số La Mã",
        "tap-hop-thu-tu": "Thứ tự tập số tự nhiên & Tia số",
        "cong-tru-so-tu-nhien": "Cộng & trừ số tự nhiên",
        "nhan-chia-so-tu-nhien": "Nhân & chia số tự nhiên (chia có dư)",
        "luy-thua": "Phép toán lũy thừa số tự nhiên",
        "thu-tu-phep-tinh": "Thứ tự thực hiện các phép tính",
        "quan-he-chia-het": "Quan hệ chia hết, ước & bội tự nhiên",
        "dau-hieu-chia-het": "Dấu hiệu chia hết cho 2, 5, 3, 9",
        "so-nguyen-to": "Số nguyên tố, hợp số & phân tích nguyên tố",
        "ucln": "Ước chung & ƯCLN",
        "bcnn": "Bội chung & BCNN",
        "tap-hop-so-nguyen": "Nhận biết & So sánh số nguyên",
        "cong-tru-so-nguyen": "Phép cộng & trừ số nguyên",
        "dau-ngoac": "Quy tắc dấu ngoặc số nguyên",
        "nhan-so-nguyen": "Phép nhân số nguyên",
        "chia-het-uoc-boi-so-nguyen": "Chia hết, ước & bội số nguyên",
        "hinh-hoc-chuong-4": "Hình tam giác đều, hình vuông, lục giác đều",
        "hinh-hoc-2-chuong-4": "Hình thoi, hình thang cân, hình bình hành",
        "chu-vi-dien-tich": "Tính chu vi & Diện tích các hình",
        "truc-doi-xung": "Nhận biết Trục đối xứng",
        "tam-doi-xung": "Nhận biết Tâm đối xứng",
        "phan-so-bang-nhau": "Phân số bằng nhau & Rút gọn phân số",
        "so-sanh-phan-so": "So sánh phân số & Hỗn số dương",
        "cong-tru-phan-so": "Phép cộng & trừ phân số",
        "nhan-chia-phan-so": "Phép nhân & chia phân số",
        "hai-bai-toan-phan-so": "Hai bài toán thực tế về phân số",
        "so-thap-phan": "Khái niệm số thập phân & Số đối",
        "tinh-so-thap-phan": "Phép toán số thập phân",
        "lam-tron-uoc-luong": "Làm tròn số thập phân & Ước lượng",
        "ti-so-phan-tram": "Tỉ số & Tỉ số phần trăm thực tế",
        "diem-duong-thang": "Điểm và đường thẳng, ba điểm thẳng hàng",
        "tia-hinh-hoc": "Tia và Điểm nằm giữa hai điểm",
        "doan-thang": "Đoạn thẳng & Độ dài đoạn thẳng",
        "trung-diem": "Trung điểm của đoạn thẳng",
        "goc": "Khái niệm Góc & Góc bẹt",
        "so-do-goc": "Số đo góc & Đoạn góc đồng hồ",
        "thu-thap-du-lieu": "Bài 38: Thu thập và phân loại dữ liệu",
        "bang-thong-ke-bieu-do-tranh": "Bài 39: Bảng thống kê & Biểu đồ tranh",
        "bieu-do-cot": "Bài 40: Biểu đồ cột đơn",
        "bieu-do-cot-kep": "Bài 41: Biểu đồ cột kép",
        "ket-qua-co-the": "Bài 42: Kết quả có thể & Sự kiện",
        "xac-suat-thuc-nghiem": "Bài 43: Xác suất thực nghiệm"
    },

    // Xác thực mã PIN để vào Dashboard
    verifyPin: function() {
        const pinVal = document.getElementById("parent-pin").value;
        const errorText = document.getElementById("pin-error");

        if (pinVal === (app.config ? app.config.parentPin : app.state.parentPin)) {
            errorText.classList.add("hidden");
            
            const token = sessionStorage.getItem('adminToken');
            // Kiểm tra Kiosk Mode trước khi mở khóa Dashboard
            fetch(getApiUrl("/api/is-kiosk-mode"))
                .then(res => res.json())
                .then(data => {
                    if (data.isKiosk) {
                        // Hiển thị thông báo thoát Kiosk Mode
                        Swal.fire({
                            title: "Đang thoát Kiosk Mode",
                            text: "Hệ thống đang tắt chế độ bảo vệ và mở trang Dashboard trên trình duyệt thông thường...",
                            icon: "info",
                            showConfirmButton: false,
                            allowOutsideClick: false,
                            target: document.getElementById('screen-parent') || 'body'
                        });
                        
                        // Gọi API thoát Kiosk
                        fetch(getApiUrl("/api/exit-kiosk"), { 
                            method: "POST",
                            headers: { 'Authorization': `Bearer ${token}` }
                        })
                            .catch(err => console.error("Lỗi khi thoát Kiosk:", err));
                    } else {
                        // Không ở Kiosk mode, mở Dashboard như bình thường
                        document.getElementById("parent-auth-box").classList.add("hidden");
                        document.getElementById("parent-dashboard-content").classList.remove("hidden");
                        
                        // Tự động thoát chế độ toàn màn hình khi phụ huynh đăng nhập thành công
                        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
                            const exitFS = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
                            if (exitFS) {
                                exitFS.call(document).catch(err => console.log("Không thể thoát fullscreen:", err));
                            }
                        }
                        
                        this.onDashboardUnlocked();
                    }
                })
                .catch(err => {
                    console.error("Lỗi kiểm tra Kiosk:", err);
                    // Dự phòng mở Dashboard trực tiếp nếu API lỗi
                    document.getElementById("parent-auth-box").classList.add("hidden");
                    document.getElementById("parent-dashboard-content").classList.remove("hidden");
                    this.onDashboardUnlocked();
                });
        } else {
            errorText.classList.remove("hidden");
            // Rung lắc nhẹ ô nhập pin khi gõ sai (hiệu ứng UX)
            const pinGroup = document.querySelector(".pin-input-group");
            pinGroup.classList.add("animate-shake");
            setTimeout(() => pinGroup.classList.remove("animate-shake"), 500);
        }
    },

    // Thoát chế độ bảo vệ Kiosk Mode một cách an toàn (gỡ hook bàn phím, mở trình duyệt thường)
    exitKioskGracefully: function() {
        Swal.fire({
            title: 'Xác nhận tắt bảo vệ?',
            text: 'Ứng dụng sẽ tắt chế độ Kiosk (khóa phím, chặn Task Manager), đóng Chrome và mở lại bảng điều khiển trên trình duyệt Cốc Cốc / Chrome thường.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--primary)',
            cancelButtonColor: 'var(--danger)',
            confirmButtonText: 'Có, tắt bảo vệ',
            cancelButtonText: 'Hủy bỏ',
            target: document.getElementById('screen-parent') || 'body'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Đang tắt bảo vệ...',
                    text: 'Vui lòng đợi vài giây để hệ thống khôi phục cài đặt và chuyển đổi trình duyệt...',
                    icon: 'info',
                    showConfirmButton: false,
                    allowOutsideClick: false,
                    target: document.getElementById('screen-parent') || 'body'
                });
                
                const token = sessionStorage.getItem('adminToken');
                try {
                    await fetch(getApiUrl('/api/exit-kiosk'), {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                } catch (e) {
                    console.error("Lỗi khi gọi exit-kiosk:", e);
                }
            }
        });
    },

    // Thoát hoặc khóa màn hình Dashboard
    lockDashboard: function() {
        document.getElementById("parent-pin").value = "";
        document.getElementById("parent-auth-box").classList.remove("hidden");
        document.getElementById("parent-dashboard-content").classList.add("hidden");
        document.getElementById("pin-error").classList.add("hidden");
    },

    // Kích hoạt khi chuyển màn hình sang Parent
    onScreenLoad: function() {
        // Đưa về trạng thái chưa đăng nhập nếu tải lại
        this.lockDashboard();
    },

    // Kích hoạt khi đăng nhập thành công
    onDashboardUnlocked: function() {
        this.initTheme(); // Đọc và khởi tạo theme sáng/tối
        this.updateParentScreenNames();
        this.updateStats();
        this.renderCharts();
        this.renderWeakSkills();
        this.renderParentBadges();
        this.renderVideoManager();
        this.renderParentHistory();
        this.loadApiKeys();
        this.loadProfileSettings();
        this.initPdfExporter();
    },

    // Cập nhật tên học sinh/phụ huynh động trong màn hình Dashboard phụ huynh
    updateParentScreenNames: function() {
        // Lấy thông tin học sinh đang xem
        const viewingStudent = app.config.students ? app.config.students.find(s => s.id === this.viewingStudentId) : null;
        const studentName = viewingStudent ? viewingStudent.name : (app.config.studentName || 'Học sinh');
        const parentName = app.config.parentName || 'Phụ huynh';

        // Tiêu đề Dashboard
        const dashHeader = document.querySelector('#screen-parent .parent-header h2');
        if (dashHeader) dashHeader.innerHTML = `<i class="fa-solid fa-user-shield"></i> Góc học tập của ${studentName} &amp; ${parentName}`;

        // Mô tả màn PIN
        const authDesc = document.querySelector('#parent-auth-box p');
        if (authDesc) authDesc.textContent = `Nhập mã PIN của ${parentName} để xem báo cáo học tập và phân tích của ${studentName}.`;

        // Thẻ thống kê — thời gian học
        const timeTitle = document.querySelector('#screen-parent .stat-card:nth-child(1) .stat-card-title');
        if (timeTitle) timeTitle.textContent = `Thời gian ${studentName} học`;

        // Thẻ thống kê — tỉ lệ
        const accuracyTitle = document.querySelector('#screen-parent .stat-card:nth-child(3) .stat-card-title');
        if (accuracyTitle) accuracyTitle.textContent = `Tỉ lệ làm đúng của ${studentName}`;

        // Phần kỹ năng yếu
        const weakTitle = document.querySelector('#screen-parent .analysis-box:nth-child(1) h3');
        if (weakTitle) weakTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Kỹ năng Toán học ${studentName} cần cải thiện`;

        const weakDesc = document.querySelector('#screen-parent .analysis-box:nth-child(1) .section-desc');
        if (weakDesc) weakDesc.textContent = `${parentName} nên hỗ trợ thêm cho ${studentName} ở các phần có tỷ lệ làm đúng dưới 70%.`;

        // Phần Huy hiệu
        const badgeTitle = document.querySelector('#screen-parent .analysis-box:nth-child(2) h3');
        if (badgeTitle) badgeTitle.innerHTML = `<i class="fa-solid fa-award"></i> Bộ sưu tập Huy hiệu của ${studentName}`;

        // Phần AI advisor desc
        const aiDesc = document.querySelector('#screen-parent .parent-ai-advisor .section-desc');
        if (aiDesc) aiDesc.textContent = `Cố vấn AI sẽ tổng hợp toàn bộ lịch sử trả lời câu hỏi và các lượt làm bài chi tiết của ${studentName} để vẽ sơ đồ trực quan và đưa ra checklist hành động thiết thực cho hai ${parentName} con.`;

        // Loading text
        const aiLoading = document.querySelector('#ai-advisor-loading p');
        if (aiLoading) aiLoading.textContent = `Đang tải và phân tích dữ liệu học lực của ${studentName} bằng AI, vui lòng đợi chút nhé...`;

        // Phần Lịch sử làm bài
        const histTitle = document.querySelector('#screen-parent h3.section-title-hist');
        if (histTitle) histTitle.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> Lịch sử làm bài chi tiết của ${studentName}`;

        const histDesc = document.querySelector('#screen-parent .section-desc-hist');
        if (histDesc) histDesc.textContent = `${parentName} có thể xem lại toàn bộ các lượt luyện tập & bài kiểm tra của ${studentName} để phân tích lỗi sai và hướng dẫn con học tốt hơn.`;

        // Phần video manager
        const vidTitle = document.querySelector('#screen-parent h3.section-title-vid');
        if (vidTitle) vidTitle.innerHTML = `<i class="fa-solid fa-video"></i> Quản lý video bài giảng của ${parentName} gán cho ${studentName}`;

        const vidDesc = document.querySelector('#screen-parent .section-desc-vid');
        if (vidDesc) vidDesc.textContent = `${parentName} có thể đổi link video bài giảng YouTube cho từng bài học để ${studentName} dễ hiểu bài nhất.`;
    },

    // Cập nhật các thẻ thông số thống kê tổng quan
    updateStats: function() {
        // 1. Tính tổng thời gian học trong tuần (cộng dồn các ngày)
        const weekTime = app.state.learningTimeWeek || [0, 0, 0, 0, 0, 0, 0];
        const totalMinutes = weekTime.reduce((sum, current) => sum + current, 0);
        document.getElementById("p-stat-time").innerText = `${totalMinutes} phút`;

        // 2. Số bài tập đã hoàn thành
        const completedCount = app.getCompletedLessons().length;
        document.getElementById("p-stat-completed").innerText = `${completedCount} bài`;

        // 3. Tỷ lệ chính xác trung bình
        let accuracyText = "Chưa có";
        let accuracyClass = "";
        const history = app.state.history || [];
        if (history.length > 0) {
            const correctNum = history.filter(h => h.isCorrect).length;
            const accuracy = Math.round((correctNum / history.length) * 100);
            accuracyText = `${accuracy}%`;
            if (accuracy >= 80) {
                accuracyClass = "color-success";
            } else if (accuracy >= 70) {
                accuracyClass = "color-warning";
            } else {
                accuracyClass = "color-danger";
            }
        }
        const accEl = document.getElementById("p-stat-accuracy");
        accEl.innerText = accuracyText;
        accEl.className = `stat-card-val ${accuracyClass}`;

        // 4. Streak ngày
        document.getElementById("p-stat-streak").innerText = `${app.state.streak} ngày`;

        // 5. Số lần xao nhãng rời tab
        document.getElementById("p-stat-distractions").innerText = `${app.state.distractions || 0} lần`;
    },

    // Vẽ hai biểu đồ tiến độ học tập
    renderCharts: function() {
        if (typeof Chart === 'undefined') {
            console.warn("Chart.js không khả dụng (chạy offline), bỏ qua việc vẽ biểu đồ.");
            return;
        }

        // Hủy instance cũ nếu đã tồn tại để tránh lỗi vẽ đè
        if (this.chartTimeInstance) this.chartTimeInstance.destroy();
        if (this.chartRateInstance) this.chartRateInstance.destroy();

        // Tự động lấy màu chữ và viền từ CSS Variables của theme hiện tại
        const textColor = getComputedStyle(document.body).getPropertyValue('--text-main').trim() || "#2D3748";
        const gridColor = getComputedStyle(document.body).getPropertyValue('--border-color').trim() || "#E2E8F0";

        // --- 1. BIỂU ĐỒ CỘT THỜI GIAN HỌC ---
        const ctxTime = document.getElementById("chart-learning-time").getContext("2d");
        const timeData = [...(app.state.learningTimeWeek || [0, 0, 0, 0, 0, 0, 0])];
        
        // Nhãn từ Thứ 2 đến Chủ nhật
        const labelsWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
        const rearrangedData = [timeData[1], timeData[2], timeData[3], timeData[4], timeData[5], timeData[6], timeData[0]];

        const barBgColor = app.isDarkMode ? 'rgba(46, 125, 50, 0.65)' : 'rgba(59, 130, 246, 0.65)';
        const barBorderColor = app.isDarkMode ? 'rgba(46, 125, 50, 1)' : 'rgba(59, 130, 246, 1)';

        this.chartTimeInstance = new Chart(ctxTime, {
            type: 'bar',
            data: {
                labels: labelsWeek,
                datasets: [{
                    label: 'Thời gian học (Phút)',
                    data: rearrangedData,
                    backgroundColor: barBgColor,
                    borderColor: barBorderColor,
                    borderWidth: 1.5,
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: gridColor },
                        ticks: { color: textColor }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: textColor }
                    }
                }
            }
        });

        // --- 2. BIỂU ĐỒ TRÒN TỶ LỆ ĐÚNG / SAI ---
        const ctxRate = document.getElementById("chart-correct-rate").getContext("2d");
        const history = app.state.history || [];
        
        let correctCount = history.filter(h => h.isCorrect).length;
        let wrongCount = history.length - correctCount;
        let isHistoryEmpty = history.length === 0;

        let chartData, chartLabels, chartColors;

        if (isHistoryEmpty) {
            // Khi chưa có dữ liệu, hiển thị 1 phần xám nhãn Chưa có dữ liệu
            chartData = [1];
            chartLabels = ['Chưa làm bài tập'];
            chartColors = [app.isDarkMode ? '#4A5568' : '#E2E8F0'];
        } else {
            chartData = [correctCount, wrongCount];
            chartLabels = ['Câu đúng', 'Câu sai'];
            chartColors = ['rgba(16, 185, 129, 0.75)', 'rgba(239, 68, 68, 0.75)'];
        }

        this.chartRateInstance = new Chart(ctxRate, {
            type: 'doughnut',
            data: {
                labels: chartLabels,
                datasets: [{
                    data: chartData,
                    backgroundColor: chartColors,
                    borderColor: '#FFFFFF',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: textColor }
                    },
                    title: {
                        display: isHistoryEmpty,
                        text: 'Chưa có lịch sử làm bài',
                        color: textColor,
                        font: { weight: 'bold', size: 13 }
                    }
                }
            }
        });
    },

    // Phân tích và liệt kê các kỹ năng học sinh còn yếu
    renderWeakSkills: function() {
        const container = document.getElementById("weak-skills-list");
        container.innerHTML = "";

        const history = app.state.history || [];
        
        // Nếu không có lịch sử làm bài nào, hiển thị thông báo thay vì vẽ demo
        if (history.length === 0) {
            container.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:1.5rem;font-size:0.95rem;">Học sinh chưa hoàn thành bất kỳ bài tập luyện tập nào. Sau khi học sinh làm bài tập, hệ thống sẽ phân tích tỷ lệ phần trăm chính xác của từng kỹ năng và hiển thị tại đây.</p>`;
            return;
        }

        // Tạo bảng phân tích kỹ năng
        const analysis = {}; // { questionType: { total: 0, correct: 0 } }

        // Khởi tạo các dạng kỹ năng mặc định để đảm bảo phân tích đầy đủ
        Object.keys(this.skillNames).forEach(type => {
            analysis[type] = { total: 0, correct: 0 };
        });

        // Tính toán tỷ lệ thực tế
        history.forEach(h => {
            if (analysis[h.questionType]) {
                analysis[h.questionType].total++;
                if (h.isCorrect) {
                    analysis[h.questionType].correct++;
                }
            }
        });

        // Tạo danh sách kết quả phân tích
        const skillList = [];
        Object.keys(analysis).forEach(type => {
            const total = analysis[type].total;
            if (total > 0) {
                const rate = Math.round((analysis[type].correct / total) * 100);
                skillList.push({ type, rate, total });
            }
        });

        // Sắp xếp kỹ năng có tỉ lệ đúng tăng dần (yếu nhất hiển thị lên đầu)
        skillList.sort((a, b) => a.rate - b.rate);

        if (skillList.length === 0) {
            container.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:1.5rem;font-size:0.95rem;">Chưa có dữ liệu làm bài để phân tích kỹ năng.</p>`;
            return;
        }

        skillList.forEach(item => {
            const name = this.skillNames[item.type] || item.type;
            let barClass = "success";
            let colorClass = "color-success";
            
            if (item.rate < 70) {
                barClass = "danger";
                colorClass = "color-danger";
            } else if (item.rate < 80) {
                barClass = "warning";
                colorClass = "color-warning";
            }

            const itemDiv = document.createElement("div");
            itemDiv.className = "weak-skill-item";
            itemDiv.innerHTML = `
                <div class="skill-info">
                    <span>${name}</span>
                    <span class="${colorClass}">${item.rate}% (${item.total} lượt hỏi)</span>
                </div>
                <div class="skill-bar-container">
                    <div class="skill-bar-fill ${barClass}" style="width: ${item.rate}%"></div>
                </div>
            `;
            container.appendChild(itemDiv);
        });
    },

    // Hiển thị danh sách huy hiệu của con trong Dashboard phụ huynh
    renderParentBadges: function() {
        const container = document.getElementById("parent-badges-list");
        container.innerHTML = "";

        const childBadges = app.state.badges || [];
        
        if (childBadges.length === 0) {
            container.innerHTML = `<p style="color:var(--text-muted);font-size:0.9rem;padding:0.5rem 0;">Con chưa đạt được huy hiệu nào. Hãy khuyến khích con học bài nhiều hơn!</p>`;
            return;
        }

        childBadges.forEach(badgeId => {
            const badge = app.systemBadges.find(b => b.id === badgeId);
            if (badge) {
                const div = document.createElement("div");
                div.className = "stat-badge";
                div.style.backgroundColor = "var(--bg-app)";
                div.innerHTML = `<span class="stat-icon">${badge.icon}</span> <span>${badge.name}</span>`;
                container.appendChild(div);
            }
        });
    },

    // Dựng bảng quản lý gán ID video bài giảng YouTube cho phụ huynh
    renderVideoManager: function() {
        const tbody = document.getElementById("parent-video-list-tbody");
        if (!tbody) return;
        tbody.innerHTML = "";

        // Xác định lớp học của học sinh đang xem
        const viewingStudent = app.config.students ? app.config.students.find(s => s.id === this.viewingStudentId) : null;
        const currentClassLevel = viewingStudent ? viewingStudent.classLevel : (app.config.currentClass || '6');

        COURSE_DATA.forEach(chapter => {
            const chapterClass = chapter.class || '6';
            if (chapterClass !== currentClassLevel) return; // Chỉ hiển thị bài của lớp tương ứng
            // Tạo một hàng phân cách chương cho rõ ràng
            const trChapter = document.createElement("tr");
            trChapter.style.backgroundColor = "var(--bg-app)";
            trChapter.style.fontWeight = "700";
            trChapter.innerHTML = `
                <td colspan="3" style="padding: 0.6rem; color: var(--primary); font-size: 0.9rem;">
                    <i class="fa-solid fa-folder-open"></i> ${chapter.title}
                </td>
            `;
            tbody.appendChild(trChapter);

            chapter.lessons.forEach(lesson => {
                const hasSubtopics = lesson.subtopics && lesson.subtopics.length > 0;
                
                if (hasSubtopics) {
                    // Tạo hàng làm tiêu đề bài học
                    const trLessonHeader = document.createElement("tr");
                    trLessonHeader.style.fontWeight = "600";
                    trLessonHeader.style.backgroundColor = "rgba(46, 204, 113, 0.03)";
                    trLessonHeader.innerHTML = `
                        <td colspan="3" style="padding: 0.7rem 0.8rem; color: var(--text-color);">
                            📚 ${lesson.title}
                        </td>
                    `;
                    tbody.appendChild(trLessonHeader);

                    // Thêm hàng Kiến thức giáo khoa (Lý thuyết chung)
                    const theoryVideoId = app.getLessonVideoId(lesson.id);
                    const trTheory = document.createElement("tr");
                    trTheory.innerHTML = `
                        <td style="padding: 0.8rem 0.8rem 0.8rem 2rem; font-weight: 500; font-size: 0.88rem; color: var(--primary);">
                            └─ 📖 Kiến thức giáo khoa (Lý thuyết chung)
                        </td>
                        <td style="padding: 0.8rem;">
                            <input type="text" id="video-input-${lesson.id}" value="${theoryVideoId}" placeholder="Nhập YouTube Video ID hoặc link lý thuyết chung">
                        </td>
                        <td style="padding: 0.8rem;">
                            <button class="btn-table-save" onclick="parentDashboard.saveVideoId('${lesson.id}')">
                                <i class="fa-solid fa-floppy-disk"></i> Lưu
                            </button>
                            <span id="save-status-${lesson.id}" style="color:var(--success);font-weight:bold;margin-left:0.5rem;font-size:0.85rem;"></span>
                        </td>
                    `;
                    tbody.appendChild(trTheory);

                    // Duyệt qua và hiển thị từng dạng bài của bài học
                    lesson.subtopics.forEach(sub => {
                        const videoId = app.getSubtopicVideoId(sub.id, lesson.id);
                        const tr = document.createElement("tr");
                        tr.innerHTML = `
                            <td style="padding: 0.8rem 0.8rem 0.8rem 2rem; font-weight: 500; font-size: 0.88rem; color: var(--text-muted);">
                                └─ Dạng ${sub.title.match(/Dạng\s+\d+:/) ? sub.title.replace(/Dạng\s+\d+:/, '').trim() : sub.title}
                            </td>
                            <td style="padding: 0.8rem;">
                                <input type="text" id="video-input-${sub.id}" value="${videoId}" placeholder="Nhập YouTube Video ID hoặc link">
                            </td>
                            <td style="padding: 0.8rem;">
                                <button class="btn-table-save" onclick="parentDashboard.saveVideoId('${sub.id}')">
                                    <i class="fa-solid fa-floppy-disk"></i> Lưu
                                </button>
                                <span id="save-status-${sub.id}" style="color:var(--success);font-weight:bold;margin-left:0.5rem;font-size:0.85rem;"></span>
                            </td>
                        `;
                        tbody.appendChild(tr);
                    });
                } else {
                    // Đối với bài học không chia dạng bài
                    const videoId = app.getLessonVideoId(lesson.id);
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td style="padding: 0.8rem; font-weight: 500;">📚 ${lesson.title} (Luyện tập chung)</td>
                        <td style="padding: 0.8rem;">
                            <input type="text" id="video-input-${lesson.id}" value="${videoId}" placeholder="Nhập YouTube Video ID hoặc link">
                        </td>
                        <td style="padding: 0.8rem;">
                            <button class="btn-table-save" onclick="parentDashboard.saveVideoId('${lesson.id}')">
                                <i class="fa-solid fa-floppy-disk"></i> Lưu
                            </button>
                            <span id="save-status-${lesson.id}" style="color:var(--success);font-weight:bold;margin-left:0.5rem;font-size:0.85rem;"></span>
                        </td>
                    `;
                    tbody.appendChild(tr);
                }
            });
        });
    },

    // Lưu ID video bài giảng tùy chỉnh của phụ huynh
    saveVideoId: function(targetId) {
        const inputEl = document.getElementById(`video-input-${targetId}`);
        if (!inputEl) return;

        const inputVal = inputEl.value.trim();
        
        // Trích xuất tự động ID sạch từ link dán vào
        const extractedId = app.extractYoutubeId(inputVal);
        inputEl.value = extractedId;

        if (!app.state.customVideos) {
            app.state.customVideos = {};
        }

        app.state.customVideos[targetId] = extractedId;
        app.saveProgress();

        // Hiển thị trạng thái phản hồi
        const statusSpan = document.getElementById(`save-status-${targetId}`);
        if (statusSpan) {
            statusSpan.innerHTML = '<i class="fa-solid fa-circle-check"></i> Đã lưu';
        }
        
        // Nhấp nháy màu viền input để học sinh/phụ huynh nhận biết lưu thành công
        inputEl.style.borderColor = "var(--success)";
        
        setTimeout(() => {
            if (statusSpan) {
                statusSpan.innerText = "";
            }
            inputEl.style.borderColor = "var(--border-color)";
        }, 1500);
    },

    // Dựng danh sách lịch sử tất cả các lượt làm bài của con ở Dashboard phụ huynh
    renderParentHistory: function() {
        const tbody = document.getElementById("parent-history-tbody");
        tbody.innerHTML = "";

        const sessions = app.state.examSessions || [];
        const sortedSessions = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date));

        if (sortedSessions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="padding: 1.5rem; text-align: center; color: var(--text-muted);">
                        <i class="fa-solid fa-folder-open" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
                        ${app.config.studentName || 'Con'} chưa hoàn thành lượt làm bài tập hay kiểm tra nào.
                    </td>
                </tr>
            `;
            return;
        }

        sortedSessions.forEach(sess => {
            const dateObj = new Date(sess.date);
            const dateStr = dateObj.toLocaleDateString("vi-VN") + " " + dateObj.toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'});
            
            const isPassed = sess.scorePercent >= 80;
            
            // Phân loại loại bài trong Dashboard phụ huynh (nhất quán với giao diện học sinh)
            let levelLabel, levelClass;
            if (sess.isExam) {
                levelLabel = "Thi cuối chương 📋";
                levelClass = "danger";
            } else if (sess.isLessonExam) {
                levelLabel = "⚡ KT Tổng thể";
                levelClass = "danger";
            } else if (sess.isSubtopicPractice) {
                levelLabel = sess.isWeaknessPractice
                    ? ("🎯 Điểm yếu: " + (sess.subtopicTitle || "Dạng bài"))
                    : ("📚 " + (sess.subtopicTitle || "Dạng bài"));
                levelClass = sess.isWeaknessPractice ? "warning" : "info";
            } else if (sess.isWeaknessPractice) {
                levelLabel = "🎯 Luyện điểm yếu AI";
                levelClass = "warning";
            } else {
                const lvlMap = { 'co-ban': 'Cơ bản 🌱', 'nang-cao': 'Nâng cao 🚀', 'kho': 'Khó 🔥', 'chat-luong-cao': 'Chất lượng cao 💎' };
                const lvlClass = { 'co-ban': 'success', 'nang-cao': 'warning', 'kho': 'danger', 'chat-luong-cao': 'info' };
                levelLabel = lvlMap[sess.level] || sess.level || 'Luyện tập';
                levelClass = lvlClass[sess.level] || 'info';
            }


            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td style="padding: 0.8rem; font-size: 0.85rem; font-weight: 500; color: var(--text-muted);">${dateStr}</td>
                <td style="padding: 0.8rem; font-weight: 700;">${sess.lessonTitle}</td>
                <td style="padding: 0.8rem;">
                    <span class="sess-badge-level bg-${levelClass}" style="background-color: var(--${levelClass}-bg); color: var(--${levelClass}); border: 1px solid var(--${levelClass}); font-weight:700;">${levelLabel}</span>
                </td>
                <td style="padding: 0.8rem; font-weight: 800; color: ${isPassed ? 'var(--success)' : 'var(--danger)'};">${sess.scorePercent}% (${sess.correctCount}/${sess.totalQuestions} đúng)</td>
                <td style="padding: 0.8rem; font-size: 0.85rem; color: var(--text-muted);">${sess.timeSpent} giây</td>
                <td style="padding: 0.8rem;">
                    <button class="btn-sess-review" onclick="app.openReviewSession('${sess.id}')" style="cursor:pointer; font-weight:700; padding:0.3rem 0.6rem; font-size:0.75rem;">
                        Xem bài làm
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    // Biến toàn cục lưu Interval để dọn dẹp
    adviceTipInterval: null,
    adviceStatusInterval: null,

    loadAiAnalysis: function() {
        const loadingBox = document.getElementById("ai-advisor-loading");
        const resultBox = document.getElementById("ai-advisor-result");
        const refreshBtn = document.getElementById("btn-refresh-ai-advice");

        if (!loadingBox || !resultBox) return;

        // Dọn dẹp interval cũ nếu có
        if (this.adviceTipInterval) clearInterval(this.adviceTipInterval);
        if (this.adviceStatusInterval) clearInterval(this.adviceStatusInterval);

        // Chuẩn bị các mẹo học toán ngẫu nhiên
        const MATH_STUDY_TIPS = [
            "Khuyên con tự vẽ sơ đồ tư duy trước khi giải các bài toán hình học nhé!",
            `${app.config.studentName || 'Con'} nên luyện tập đều đặn mỗi ngày 15 phút thay vì học dồn vào cuối tuần.`,
            `${app.config.parentName || 'Phụ huynh'} hãy cùng con chơi các trò chơi đố vui bằng số La Mã để tăng phản xạ.`,
            "Đối với các bài toán có lời văn, hãy giúp con gạch chân dưới các từ khóa quan trọng.",
            "Học từ lỗi sai: Hãy khuyến khích con xem lại các câu làm sai trong Lịch sử làm bài.",
            "Nếu gặp câu hỏi Khó, hãy động viên con nhấn nút Gợi ý để được hướng dẫn từng bước."
        ];

        // Thiết lập giao diện loading sống động
        loadingBox.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 15px 0;">
                <i class="fa-solid fa-spinner fa-spin" style="font-size:2.5rem; color:#8b5cf6; margin-bottom:1rem;"></i>
                <h4 style="font-weight: 700; color: #8b5cf6; margin-bottom: 8px;">Cố vấn AI đang phân tích tiến trình học tập...</h4>
                
                <div class="ai-progress-bar-container" style="width: 100%; max-width: 350px; height: 6px; background-color: var(--border-color); border-radius: 10px; overflow: hidden; margin-bottom: 12px;">
                    <div id="advice-progress-bar" style="width: 5%; height: 100%; background: linear-gradient(90deg, #8b5cf6, #ec4899); transition: width 0.4s ease;"></div>
                </div>
                
                <div id="advice-api-status" style="font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.5rem; margin-bottom: 12px;">
                    <span id="advice-api-pulse" class="status-pulse active" style="width: 8px; height: 8px; border-radius: 50%; background-color: #8b5cf6; display: inline-block; box-shadow: 0 0 8px #8b5cf6;"></span>
                    <span id="advice-api-status-text">Đang tổng hợp dữ liệu bài làm...</span>
                </div>
                
                <div id="advice-motivation" style="background-color: var(--bg-app); border: 1px dashed var(--border-color); padding: 0.8rem 1.2rem; border-radius: 10px; font-size: 0.88rem; max-width: 480px; text-align: center; line-height: 1.5; color: var(--text-main);">
                    <div style="font-weight:700; color:#8b5cf6; margin-bottom:0.4rem;"><i class="fa-solid fa-lightbulb"></i> Mẹo học tập hữu ích</div>
                    <div id="advice-motivation-text">${MATH_STUDY_TIPS[Math.floor(Math.random() * MATH_STUDY_TIPS.length)]}</div>
                </div>
            </div>
        `;

        loadingBox.classList.remove("hidden");
        resultBox.classList.add("hidden");
        if (refreshBtn) refreshBtn.disabled = true;

        // Chạy progress bar giả lập & xoay mẹo học tập
        let progressVal = 5;
        let tipIdx = Math.floor(Math.random() * MATH_STUDY_TIPS.length);
        
        this.adviceTipInterval = setInterval(() => {
            tipIdx = (tipIdx + 1) % MATH_STUDY_TIPS.length;
            const motText = document.getElementById("advice-motivation-text");
            if (motText) motText.innerText = MATH_STUDY_TIPS[tipIdx];

            if (progressVal < 90) {
                progressVal += Math.floor(Math.random() * 8) + 3;
                const progBar = document.getElementById("advice-progress-bar");
                if (progBar) progBar.style.width = `${progressVal}%`;
            }
        }, 3000);

        // Polling trạng thái AI từ backend
        this.adviceStatusInterval = setInterval(async () => {
            try {
                const token = sessionStorage.getItem('adminToken');
                const statusRes = await fetch(getApiUrl("/api/ai-status"), {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (statusRes.ok) {
                    const statusData = await statusRes.json();
                    const statusText = document.getElementById("advice-api-status-text");
                    const statusPulse = document.getElementById("advice-api-pulse");
                    
                    if (statusText && statusData.message) {
                        statusText.innerText = statusData.message;
                    }
                    if (statusPulse) {
                        if (statusData.state === "active" || statusData.state === "generating_questions" || statusData.state === "analyzing_progress") {
                            statusPulse.style.backgroundColor = "#8b5cf6";
                            statusPulse.style.boxShadow = "0 0 8px #8b5cf6";
                        } else if (statusData.state === "error") {
                            statusPulse.style.backgroundColor = "var(--danger)";
                            statusPulse.style.boxShadow = "0 0 8px var(--danger)";
                        } else {
                            statusPulse.style.backgroundColor = "var(--success)";
                            statusPulse.style.boxShadow = "0 0 8px var(--success)";
                        }
                    }
                }
            } catch (err) {
                console.error("Lỗi khi lấy trạng thái AI:", err);
            }
        }, 1200);

        // Gửi request phân tích học tập thực tế
        const token = sessionStorage.getItem('adminToken');
        fetch(getApiUrl("/api/ai-analysis"), {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                history: app.state.history || [],
                examSessions: app.state.examSessions || [],
                xp: app.state.xp || 0,
                scores: app.state.scores || {},
                studentName: app.config.studentName || 'Học sinh',
                parentName: app.config.parentName || 'Phụ huynh',
                classLevel: app.config.currentClass || '6'
            })
        })
        .then(res => {
            if (!res.ok) throw new Error("Server API gặp lỗi phản hồi hoặc chưa bật.");
            return res.json();
        })
        .then(data => {
            const progBar = document.getElementById("advice-progress-bar");
            if (progBar) progBar.style.width = "100%";

            setTimeout(() => {
                let htmlContent = "";
                if (typeof marked !== "undefined") {
                    htmlContent = marked.parse(data.analysis || "");
                } else {
                    htmlContent = data.analysis || "";
                }

                // Cập nhật kết quả vào resultBox
                resultBox.innerHTML = htmlContent;
                
                loadingBox.classList.add("hidden");
                resultBox.classList.remove("hidden");

                // Render sơ đồ Mermaid nếu có
                setTimeout(() => {
                    if (typeof mermaid !== "undefined") {
                        try {
                            mermaid.initialize({ startOnLoad: false, theme: app.isDarkMode ? "dark" : "default", securityLevel: "loose" });
                            const mermaidBlocks = resultBox.querySelectorAll(".language-mermaid");
                            mermaidBlocks.forEach((block) => {
                                const graphDefinition = block.textContent;
                                const container = document.createElement("div");
                                container.className = "mermaid";
                                container.textContent = graphDefinition;

                                const pre = block.parentNode;
                                if (pre && pre.parentNode && pre.tagName === "PRE") {
                                    pre.parentNode.replaceChild(container, pre);
                                }
                            });
                            mermaid.run({ nodes: resultBox.querySelectorAll(".mermaid") });
                        } catch (mermaidErr) {
                            console.error("Lỗi render Mermaid:", mermaidErr);
                        }
                    }
                }, 100);
            }, 500);
        })
        .catch(err => {
            console.error("Lỗi phân tích AI:", err);
            resultBox.innerHTML = `
                <div style="color:var(--danger); text-align:center; padding:1.5rem 0;">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size:2rem; margin-bottom:0.8rem;"></i>
                    <p style="font-weight:700;">Không thể kết nối với Cố vấn AI lúc này!</p>
                    <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.4rem;">Chi tiết lỗi: ${err.message}. Vui lòng kiểm tra Server Backend đã chạy và file .env có chứa API Key hợp lệ.</p>
                </div>
            `;
            loadingBox.classList.add("hidden");
            resultBox.classList.remove("hidden");
        })
        .finally(() => {
            clearInterval(this.adviceTipInterval);
            clearInterval(this.adviceStatusInterval);
            if (refreshBtn) refreshBtn.disabled = false;
        });
    },

    // 1. Tải danh sách API Keys từ Server
    loadApiKeys: function() {
        const container = document.getElementById("parent-api-keys-container");
        if (!container) return;

        const token = sessionStorage.getItem('adminToken');
        fetch(getApiUrl("/api/api-keys"), {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (!res.ok) throw new Error("Không thể tải cấu hình API.");
                return res.json();
            })
            .then(data => {
                // Lưu danh sách key thô/che ẩn hiện tại vào biến toàn cục của parentDashboard
                this.apiKeysData = data.keys || [];
                this.renderApiKeysList();
            })
            .catch(err => {
                console.error(err);
                container.innerHTML = `<p style="color:var(--danger); font-size:0.9rem;"><i class="fa-solid fa-triangle-exclamation"></i> Lỗi: ${err.message}</p>`;
            });
    },

    // 2. Render danh sách API Keys lên giao diện dạng form động
    renderApiKeysList: function() {
        const container = document.getElementById("parent-api-keys-container");
        if (!container) return;

        if (!this.apiKeysData || this.apiKeysData.length === 0) {
            container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.9rem; font-style: italic;"><i class="fa-solid fa-circle-info"></i> Chưa có API Key nào được cấu hình. Bấm "Thêm Key mới" ở trên để bắt đầu.</p>`;
            return;
        }

        let html = "";
        this.apiKeysData.forEach((keyInfo, idx) => {
            let badgeColor = "var(--text-muted)";
            let statusText = "Chưa kiểm tra";
            
            if (keyInfo.status === "Active") {
                badgeColor = "var(--success)";
                statusText = "Hoạt động tốt";
            } else if (keyInfo.status && (keyInfo.status.includes("429") || keyInfo.status.includes("Quota") || keyInfo.status.includes("Limit"))) {
                badgeColor = "var(--warning)";
                statusText = "Hết hạn mức / Quá tải (429)";
            } else if (keyInfo.status && keyInfo.status.includes("403")) {
                badgeColor = "var(--danger)";
                statusText = "Lỗi / Key sai (403)";
            } else if (keyInfo.status) {
                badgeColor = "var(--danger)";
                statusText = keyInfo.status;
            }

            const statusBadge = `
                <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.8rem; background: var(--primary-bg); padding: 0.3rem 0.6rem; border-radius: 6px; border: 1px solid var(--border-color);">
                    <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: ${badgeColor};"></span>
                    <span style="color: ${badgeColor}; font-weight: 700; font-size: 0.8rem;">${statusText}</span>
                </div>
            `;

            const isExisting = keyInfo.masked && keyInfo.masked.includes("...");
            const displayValue = isExisting ? keyInfo.masked : (keyInfo.key || "");
            const accountValue = keyInfo.account || "";

            html += `
                <div class="api-key-row" data-index="${idx}" style="display: flex; gap: 0.8rem; align-items: center; background: var(--bg-card); padding: 0.8rem; border-radius: 10px; border: 1px solid var(--border-color); flex-wrap: wrap;">
                    <div style="display: flex; align-items: center; gap: 0.4rem; color: var(--text-muted); font-weight: 700; font-size: 0.9rem;">
                        #${idx + 1}
                    </div>
                    
                    <!-- Nhập tên tài khoản -->
                    <div style="flex: 1; min-width: 180px;">
                        <input type="text" class="api-account-input" value="${accountValue}" placeholder="Tên tài khoản (ví dụ: Gmail 1)" style="width: 100%; padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-app); color: var(--text-main); font-size: 0.85rem;">
                    </div>
                    
                    <!-- Nhập API Key -->
                    <div style="flex: 2; min-width: 250px; display: flex; gap: 0.4rem; align-items: center; position: relative;">
                        <input type="password" class="api-key-input" value="${displayValue}" 
                            ${isExisting ? 'readonly style="background:var(--bg-app); cursor:pointer;" onclick="parentDashboard.editExistingKey(this)" title="Click để thay đổi API Key này"' : 'placeholder="Dán API Key vào đây..."'} 
                            style="width: 100%; padding: 0.5rem 2.2rem 0.5rem 0.5rem; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-app); color: var(--text-main); font-family: monospace; font-size: 0.85rem;">
                        <button onclick="parentDashboard.toggleKeyVisibility(this)" style="position: absolute; right: 0.6rem; background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 0;">
                            <i class="fa-solid fa-eye-slash"></i>
                        </button>
                    </div>

                    <!-- Trạng thái -->
                    ${statusBadge}

                    <!-- Hành động xóa -->
                    <button onclick="parentDashboard.deleteKeyRow(${idx})" style="background: var(--danger-bg); color: var(--danger); border: none; padding: 0.5rem; border-radius: 6px; cursor: pointer; font-size: 0.9rem; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    // 3. Hàm helper hiện/ẩn mật khẩu key
    toggleKeyVisibility: function(btn) {
        const input = btn.parentElement.querySelector("input");
        const icon = btn.querySelector("i");
        if (input.type === "password") {
            input.type = "text";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        } else {
            input.type = "password";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        }
    },

    // 4. Thêm một dòng key mới
    addNewKeyRow: function() {
        if (!this.apiKeysData) this.apiKeysData = [];
        this.apiKeysData.push({
            account: `Tài khoản ${this.apiKeysData.length + 1}`,
            key: "",
            masked: "",
            status: "Chưa kiểm tra"
        });
        this.renderApiKeysList();
    },

    // 5. Xóa một dòng key
    deleteKeyRow: function(idx) {
        if (!this.apiKeysData) return;
        this.apiKeysData.splice(idx, 1);
        this.renderApiKeysList();
    },

    // 6. Mở trang Google AI Studio và hướng dẫn thoát fullscreen để tránh kẹt màn hình
    openAiStudio: function(e) {
        if (e) e.preventDefault();
        
        Swal.fire({
            title: 'Mở Google AI Studio',
            html: `
                <div style="text-align: left; font-size: 0.9rem; line-height: 1.6; color: var(--text-color);">
                    <p style="margin-bottom: 0.8rem;">Hệ thống sẽ mở trang lấy API Key của Google trong một Tab mới. Để tránh bị kẹt màn hình:</p>
                    <ul style="padding-left: 1.2rem; margin-bottom: 1rem;">
                        <li>Ứng dụng sẽ <b>tự động thoát chế độ Toàn màn hình</b> (nếu đang bật).</li>
                        <li>Sau khi tạo và sao chép (copy) API Key, ${(app && app.config && app.config.parentName) || 'phụ huynh'} chỉ cần <b>đóng Tab đó đi</b> hoặc chọn lại Tab <b>"Toán Lớp 6"</b> trên thanh tab trình duyệt.</li>
                        <li>Nếu ứng dụng chạy ở chế độ App độc lập, ${(app && app.config && app.config.parentName) || 'phụ huynh'} click vào biểu tượng <b>Toán Lớp 6</b> ở thanh Taskbar dưới đáy màn hình để quay lại.</li>
                    </ul>
                </div>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: 'var(--primary)',
            cancelButtonColor: 'var(--text-muted)',
            confirmButtonText: 'Đồng ý và Mở trang',
            cancelButtonText: 'Hủy bỏ',
            target: document.getElementById('screen-parent') || 'body'
        }).then((result) => {
            if (result.isConfirmed) {
                // Thoát fullscreen nếu có
                if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
                    const exitFS = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
                    if (exitFS) {
                        exitFS.call(document).catch(err => console.log("Không thể thoát fullscreen:", err));
                    }
                }
                
                // Mở cửa sổ mới
                window.open("https://aistudio.google.com/", "_blank");
            }
        });
    },

    // 6.5. Cho phép chỉnh sửa key cũ đã lưu
    editExistingKey: function(input) {
        Swal.fire({
            title: 'Thay đổi API Key',
            text: 'Bạn có muốn thay đổi API Key này không? Ô nhập liệu sẽ được xóa trống để bạn dán khóa mới vào.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: 'var(--primary)',
            cancelButtonColor: 'var(--text-muted)',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Bỏ qua',
            target: document.getElementById('screen-parent') || 'body'
        }).then((result) => {
            if (result.isConfirmed) {
                input.readOnly = false;
                input.value = "";
                input.style.cursor = "text";
                input.style.background = "";
                input.placeholder = "Dán API Key mới vào đây...";
                input.focus();
                // Bỏ sự kiện onclick và title để không hiện popup nữa
                input.removeAttribute("onclick");
                input.removeAttribute("title");
            }
        });
    },

    // 7. Kiểm tra trạng thái hoạt động thực tế từng Key
    testApiKeys: function() {
        const testBtn = document.getElementById("btn-test-api-keys");
        const origHtml = testBtn.innerHTML;
        
        testBtn.disabled = true;
        testBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang kiểm tra...`;

        // Thu thập các key hiện tại trên giao diện để gửi lên test trực tiếp
        const rows = document.querySelectorAll(".api-key-row");
        const keysPayload = [];
        let hasEmptyKey = false;

        rows.forEach(row => {
            const idx = parseInt(row.getAttribute("data-index"));
            const accountVal = row.querySelector(".api-account-input").value.trim();
            const keyVal = row.querySelector(".api-key-input").value.trim();

            if (!keyVal) {
                hasEmptyKey = true;
                return;
            }

            keysPayload.push({
                index: idx,
                account: accountVal || `Tài khoản ${idx + 1}`,
                key: keyVal
            });
        });

        if (hasEmptyKey) {
            testBtn.disabled = false;
            testBtn.innerHTML = origHtml;
            Swal.fire({
                icon: 'warning',
                title: 'Thiếu thông tin',
                text: `${app.config.parentName || 'Phụ huynh'} vui lòng nhập đầy đủ API Key cho tất cả các dòng hoặc xóa dòng trống trước khi kiểm tra.`,
                confirmButtonColor: 'var(--primary)',
                target: document.getElementById('screen-parent') || 'body'
            });
            return;
        }

        if (keysPayload.length === 0) {
            testBtn.disabled = false;
            testBtn.innerHTML = origHtml;
            Swal.fire({
                icon: 'warning',
                title: 'Trống danh sách',
                text: 'Không có API Key nào để kiểm tra.',
                confirmButtonColor: 'var(--primary)',
                target: document.getElementById('screen-parent') || 'body'
            });
            return;
        }

        const token = sessionStorage.getItem('adminToken');
        fetch(getApiUrl("/api/test-api-keys"), { 
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ keys: keysPayload })
        })
            .then(res => {
                if (!res.ok) throw new Error("Kiểm tra thất bại.");
                return res.json();
            })
            .then(data => {
                testBtn.disabled = false;
                testBtn.innerHTML = origHtml;

                // Cập nhật lại kết quả test vào data hiện tại
                if (data.results) {
                    this.apiKeysData = data.results;
                    this.renderApiKeysList();

                    // Kiểm tra xem có key nào lỗi không
                    const failedKeys = data.results.filter(k => k.status && (k.status.includes('Lỗi') || k.status.includes('Limited') || k.status.includes('429') || k.status.includes('403') || k.status.includes('400') || k.status.includes('401')));
                    
                    if (failedKeys.length > 0) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Kiểm tra hoàn tất!',
                            html: `<div style="text-align: left;">Phát hiện <b>${failedKeys.length}</b> key gặp sự cố. Bạn nên sửa lại hoặc xóa đi trước khi nhấn nút <b>"Lưu cấu hình"</b>.</div>`,
                            confirmButtonColor: 'var(--primary)',
                            target: document.getElementById('screen-parent') || 'body'
                        });
                    } else {
                        Swal.fire({
                            icon: 'success',
                            title: 'Đã kiểm tra xong!',
                            text: 'Tất cả các API Key hoạt động tốt. Hãy nhấn nút "Lưu cấu hình" để áp dụng thay đổi.',
                            confirmButtonColor: 'var(--primary)',
                            target: document.getElementById('screen-parent') || 'body'
                        });
                    }
                }
            })
            .catch(err => {
                testBtn.disabled = false;
                testBtn.innerHTML = origHtml;
                console.error(err);
                
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi kiểm tra',
                    text: err.message,
                    confirmButtonColor: 'var(--primary)',
                    target: document.getElementById('screen-parent') || 'body'
                });
            });
    },

    // 8. Lưu API Keys và Tên tài khoản tương ứng
    saveApiKeys: function() {
        const rows = document.querySelectorAll(".api-key-row");
        const keysPayload = [];
        let hasEmptyKey = false;

        rows.forEach(row => {
            const idx = parseInt(row.getAttribute("data-index"));
            const accountVal = row.querySelector(".api-account-input").value.trim();
            const keyVal = row.querySelector(".api-key-input").value.trim();

            if (!keyVal) {
                hasEmptyKey = true;
                return;
            }

            keysPayload.push({
                index: idx,
                account: accountVal || `Tài khoản ${idx + 1}`,
                key: keyVal
            });
        });

        if (hasEmptyKey) {
            Swal.fire({
                icon: 'warning',
                title: 'Thiếu thông tin',
                text: `${app.config.parentName || 'Phụ huynh'} vui lòng nhập đầy đủ API Key cho tất cả các dòng hoặc xóa dòng trống đi.`,
                confirmButtonColor: 'var(--primary)',
                target: document.getElementById('screen-parent') || 'body'
            });
            return;
        }

        if (keysPayload.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Trống danh sách',
                text: 'Danh sách API Key rỗng. Vui lòng cấu hình ít nhất một API Key.',
                confirmButtonColor: 'var(--primary)',
                target: document.getElementById('screen-parent') || 'body'
            });
            return;
        }

        Swal.fire({
            title: 'Xác nhận mã PIN Phụ huynh 🔐',
            input: 'password',
            inputPlaceholder: 'Nhập mã PIN phụ huynh...',
            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off',
                maxlength: 10,
                style: 'text-align: center; letter-spacing: 0.2em; font-size: 1.2rem;'
            },
            showCancelButton: true,
            confirmButtonText: 'Xác nhận',
            cancelButtonText: 'Hủy',
            confirmButtonColor: 'var(--primary)',
            target: document.getElementById('screen-parent') || 'body',
            preConfirm: (pin) => {
                if (!pin) {
                    Swal.showValidationMessage('Vui lòng nhập mã PIN!');
                    return false;
                }
                return pin;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const parentPin = result.value;

                const saveBtn = document.getElementById("btn-save-api-keys");
                const origHtml = saveBtn.innerHTML;
                saveBtn.disabled = true;
                saveBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang lưu...`;

                const token = sessionStorage.getItem('adminToken');
                fetch(getApiUrl("/api/save-api-keys"), {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ keys: keysPayload, parentPin: parentPin })
                })
                    .then(async res => {
                        if (!res.ok) {
                            const errData = await res.json().catch(() => ({}));
                            throw new Error(errData.error || "Không thể lưu cấu hình API.");
                        }
                        return res.json();
                    })
                    .then(data => {
                        saveBtn.disabled = false;
                        saveBtn.innerHTML = origHtml;

                        Swal.fire({
                            icon: 'success',
                            title: 'Đã lưu thành công!',
                            text: 'Cấu hình API Keys và tài khoản tương ứng đã được cập nhật.',
                            confirmButtonColor: 'var(--primary)',
                            target: document.getElementById('screen-parent') || 'body'
                        }).then(() => {
                            this.loadApiKeys(); // Load lại từ server để có masked và status mới
                        });
                    })
                    .catch(err => {
                        saveBtn.disabled = false;
                        saveBtn.innerHTML = origHtml;
                        console.error(err);

                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi khi lưu',
                            text: err.message,
                            confirmButtonColor: 'var(--primary)',
                            target: document.getElementById('screen-parent') || 'body'
                        });
                    });
            }
        });
    },

    resetAllData: function() {
        Swal.fire({
            title: `${app.config.parentName || 'Phụ huynh'} có chắc chắn muốn reset?`,
            text: `Toàn bộ tiến trình học tập, điểm số, lịch sử làm bài và huy hiệu của ${app.config.studentName || 'học sinh'} sẽ bị xóa sạch và không thể khôi phục lại.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--danger)',
            cancelButtonColor: 'var(--primary)',
            confirmButtonText: 'Có, reset toàn bộ',
            cancelButtonText: 'Hủy bỏ',
            target: document.getElementById('screen-parent') || 'body'
        }).then((result) => {
            if (result.isConfirmed) {
                // Khôi phục state mặc định
                app.state = {
                    xp: 0,
                    streak: 0,
                    lastActiveDate: null,
                    scores: {},
                    badges: [],
                    history: [],
                    distractions: 0,
                    customVideos: app.state.customVideos || {}, // Giữ lại video đã gán
                    parentPin: app.state.parentPin || "123456",
                    examSessions: [],
                    completedSubtopics: [],
                    subtopicScores: {},
                    learningTimeWeek: [0, 0, 0, 0, 0, 0, 0]
                };
                app.saveProgress();
                app.updateHeaderStats();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Đã reset thành công!',
                    text: `Dữ liệu học tập của ${app.config.studentName || 'học sinh'} đã được làm mới hoàn toàn.`,
                    confirmButtonColor: 'var(--primary)',
                    target: document.getElementById('screen-parent') || 'body'
                }).then(() => {
                    window.location.reload();
                });
            }
        });
    }
,

    // Biến lưu trữ học sinh đang xem
    viewingStudentId: null,

    // Tự động khởi tạo theme sáng/tối cho phụ huynh
    initTheme: function() {
        const savedTheme = localStorage.getItem('parent_theme') || 'dark';
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            const icon = document.getElementById("parent-theme-icon");
            const text = document.getElementById("parent-theme-text");
            if (icon) {
                icon.className = "fa-solid fa-moon text-slate-600";
            }
            if (text) {
                text.textContent = "Giao diện Tối";
            }
        } else {
            document.body.classList.remove('light-mode');
            const icon = document.getElementById("parent-theme-icon");
            const text = document.getElementById("parent-theme-text");
            if (icon) {
                icon.className = "fa-solid fa-sun text-amber-400";
            }
            if (text) {
                text.textContent = "Giao diện Sáng";
            }
        }
    },

    // Chuyển đổi theme sáng/tối
    toggleTheme: function() {
        if (document.body.classList.contains('light-mode')) {
            document.body.classList.remove('light-mode');
            localStorage.setItem('parent_theme', 'dark');
            const icon = document.getElementById("parent-theme-icon");
            const text = document.getElementById("parent-theme-text");
            if (icon) icon.className = "fa-solid fa-sun text-amber-400";
            if (text) text.textContent = "Giao diện Sáng";
        } else {
            document.body.classList.add('light-mode');
            localStorage.setItem('parent_theme', 'light');
            const icon = document.getElementById("parent-theme-icon");
            const text = document.getElementById("parent-theme-text");
            if (icon) icon.className = "fa-solid fa-moon text-slate-600";
            if (text) text.textContent = "Giao diện Tối";
        }
    },

    // Đọc cấu hình tài khoản gán cho form trong Dashboard
    loadProfileSettings: function() {
        this.initTheme();

        const pin = app.config.parentPin || "123456";
        const pinInput = document.getElementById("parent-pin-value");

        if (pinInput) pinInput.value = pin;

        this.renderStudentsTable();
    },

    // Vẽ bảng danh sách học sinh
    renderStudentsTable: function() {
        const container = document.getElementById("parent-students-table-body");
        if (!container) return;

        if (!app.config.students) {
            app.config.students = [];
        }

        if (app.config.students.length === 0) {
            container.innerHTML = `
                <tr>
                    <td colspan="5" class="p-4 text-center text-slate-400 italic">Chưa có tài khoản học sinh nào. Vui lòng bấm nút "Thêm học sinh" ở trên!</td>
                </tr>
            `;
            return;
        }

        container.innerHTML = "";
        app.config.students.forEach(st => {
            const isDefault = app.config.defaultStudentId === st.id;
            const isViewing = this.viewingStudentId === st.id;
            const parentName = st.parentName || app.config.parentName || "Bố Đăng";
            
            const tr = document.createElement("tr");
            tr.className = "border-b border-slate-700 hover:bg-slate-800/30 transition duration-150";
            if (isViewing) {
                tr.style.backgroundColor = "rgba(139, 92, 246, 0.08)";
            }

            tr.innerHTML = `
                <td class="p-3 font-semibold text-slate-200">
                    ${st.name} ${isViewing ? '<span class="ml-2 px-1.5 py-0.5 text-[10px] bg-violet-500/20 text-violet-300 border border-violet-500/30 rounded font-bold">Đang xem</span>' : ''}
                </td>
                <td class="p-3 text-slate-300">${parentName}</td>
                <td class="p-3 text-slate-300">Toán lớp ${st.classLevel}</td>
                <td class="p-3 text-center">
                    ${isDefault 
                        ? '<span class="inline-flex items-center gap-1 text-emerald-400 font-bold text-xs"><i class="fa-solid fa-circle-check"></i> Đăng nhập tự động</span>' 
                        : `<button class="bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-1 rounded text-xs transition font-semibold" onclick="parentDashboard.setDefaultStudent('${st.id}')">Đặt làm mặc định</button>`
                    }
                </td>
                <td class="p-3 text-right flex justify-end gap-2">
                    ${!isViewing 
                        ? `<button class="bg-violet-600 hover:bg-violet-700 text-white font-bold px-2 py-1 rounded text-xs transition flex items-center gap-1" onclick="parentDashboard.switchViewingStudent('${st.id}')"><i class="fa-solid fa-eye"></i> Xem tiến trình</button>`
                        : ''
                    }
                    <button class="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold px-2 py-1 rounded text-xs transition" onclick="parentDashboard.editStudentRow('${st.id}')"><i class="fa-solid fa-pen-to-square"></i> Sửa</button>
                    <button class="bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/30 font-bold px-2 py-1 rounded text-xs transition" onclick="parentDashboard.deleteStudentRow('${st.id}')"><i class="fa-solid fa-trash-can"></i> Xóa</button>
                </td>
            `;
            container.appendChild(tr);
        });
    },

    // Thêm dòng học sinh mới
    addNewStudentRow: function() {
        const defaultParentName = app.config.parentName || "Bố Đăng";
        Swal.fire({
            title: 'Thêm học sinh mới',
            html: `
                <div style="text-align: left; display:flex; flex-direction:column; gap:12px;">
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600; text-transform:uppercase; color:#94a3b8; margin-bottom:4px;">Tên học sinh:</label>
                        <input id="swal-student-name" class="swal2-input" placeholder="Nhập tên học sinh..." style="width:100%; margin:0; padding:10px; font-size:14px; border-radius:8px; border:1px solid #475569; background:#0f172a; color:#fff;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600; text-transform:uppercase; color:#94a3b8; margin-bottom:4px;">Tên phụ huynh:</label>
                        <input id="swal-parent-name" class="swal2-input" value="${defaultParentName}" placeholder="Nhập tên phụ huynh..." style="width:100%; margin:0; padding:10px; font-size:14px; border-radius:8px; border:1px solid #475569; background:#0f172a; color:#fff;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600; text-transform:uppercase; color:#94a3b8; margin-bottom:4px;">Chọn lớp học:</label>
                        <select id="swal-student-class" class="swal2-select" style="width:100%; margin:0; padding:10px; font-size:14px; border-radius:8px; border:1px solid #475569; background:#0f172a; color:#fff;">
                            <option value="6">Toán lớp 6</option>
                            <option value="4">Toán lớp 4</option>
                        </select>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Lưu lại',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#8b5cf6',
            cancelButtonColor: '#475569',
            preConfirm: () => {
                const name = document.getElementById('swal-student-name').value.trim();
                const parentName = document.getElementById('swal-parent-name').value.trim();
                const classLevel = document.getElementById('swal-student-class').value;
                if (!name) {
                    Swal.showValidationMessage('Vui lòng nhập tên học sinh!');
                    return false;
                }
                if (!parentName) {
                    Swal.showValidationMessage('Vui lòng nhập tên phụ huynh!');
                    return false;
                }
                return { name, parentName, classLevel };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.addStudent(result.value.name, result.value.parentName, result.value.classLevel);
            }
        });
    },

    // Thêm học sinh vào danh sách cấu hình
    addStudent: async function(name, parentName, classLevel) {
        const id = 'std_' + Math.random().toString(36).substr(2, 9);
        if (!app.config.students) {
            app.config.students = [];
        }
        app.config.students.push({ id, name, parentName, classLevel });
        
        // Nếu đây là học sinh duy nhất, tự đặt làm mặc định
        if (app.config.students.length === 1) {
            app.config.defaultStudentId = id;
            this.viewingStudentId = id;
        }

        await app.saveConfig();
        this.renderStudentsTable();
        
        // Tự động load dữ liệu nếu vừa set viewingStudentId
        if (this.viewingStudentId === id) {
            this.switchViewingStudent(id);
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: `Đã thêm học sinh ${name} thành công!`,
                confirmButtonColor: 'var(--primary)'
            });
        }
    },

    // Sửa thông tin học sinh
    editStudentRow: function(id) {
        const student = app.config.students.find(s => s.id === id);
        if (!student) return;
        const parentName = student.parentName || app.config.parentName || "Bố Đăng";

        Swal.fire({
            title: 'Chỉnh sửa thông tin học sinh',
            html: `
                <div style="text-align: left; display:flex; flex-direction:column; gap:12px;">
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600; text-transform:uppercase; color:#94a3b8; margin-bottom:4px;">Tên học sinh:</label>
                        <input id="swal-student-name" class="swal2-input" value="${student.name}" placeholder="Nhập tên học sinh..." style="width:100%; margin:0; padding:10px; font-size:14px; border-radius:8px; border:1px solid #475569; background:#0f172a; color:#fff;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600; text-transform:uppercase; color:#94a3b8; margin-bottom:4px;">Tên phụ huynh:</label>
                        <input id="swal-parent-name" class="swal2-input" value="${parentName}" placeholder="Nhập tên phụ huynh..." style="width:100%; margin:0; padding:10px; font-size:14px; border-radius:8px; border:1px solid #475569; background:#0f172a; color:#fff;">
                    </div>
                    <div>
                        <label style="display:block; font-size:12px; font-weight:600; text-transform:uppercase; color:#94a3b8; margin-bottom:4px;">Chọn lớp học:</label>
                        <select id="swal-student-class" class="swal2-select" style="width:100%; margin:0; padding:10px; font-size:14px; border-radius:8px; border:1px solid #475569; background:#0f172a; color:#fff;">
                            <option value="6" ${student.classLevel === '6' ? 'selected' : ''}>Toán lớp 6</option>
                            <option value="4" ${student.classLevel === '4' ? 'selected' : ''}>Toán lớp 4</option>
                        </select>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Cập nhật',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#8b5cf6',
            preConfirm: () => {
                const name = document.getElementById('swal-student-name').value.trim();
                const pName = document.getElementById('swal-parent-name').value.trim();
                const classLevel = document.getElementById('swal-student-class').value;
                if (!name) {
                    Swal.showValidationMessage('Vui lòng nhập tên học sinh!');
                    return false;
                }
                if (!pName) {
                    Swal.showValidationMessage('Vui lòng nhập tên phụ huynh!');
                    return false;
                }
                return { name, parentName: pName, classLevel };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.updateStudent(id, result.value.name, result.value.parentName, result.value.classLevel);
            }
        });
    },

    // Cập nhật thông tin học sinh
    updateStudent: async function(id, name, parentName, classLevel) {
        const student = app.config.students.find(s => s.id === id);
        if (!student) return;

        student.name = name;
        student.parentName = parentName;
        student.classLevel = classLevel;

        await app.saveConfig();

        if (this.viewingStudentId === id) {
            // Nếu đang xem học sinh này và đổi lớp học, cần load lại dữ liệu
            this.switchViewingStudent(id);
        } else {
            this.renderStudentsTable();
            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: `Đã cập nhật thông tin học sinh ${name}!`,
                confirmButtonColor: 'var(--primary)'
            });
        }
    },

    // Xóa học sinh
    deleteStudentRow: function(id) {
        const student = app.config.students.find(s => s.id === id);
        if (!student) return;

        Swal.fire({
            title: `Xóa tài khoản của ${student.name}?`,
            text: "Toàn bộ tiến trình học tập, bài tập và lịch sử của con sẽ bị xóa hoàn toàn và không thể khôi phục lại!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#475569',
            confirmButtonText: 'Đồng ý xóa',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const token = sessionStorage.getItem('adminToken');
                    // Gọi API xóa progress trong SQLite
                    const res = await fetch(getApiUrl('/api/delete-student-progress'), {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}` 
                        },
                        body: JSON.stringify({ studentId: id })
                    });

                    if (res.ok) {
                        // Loại bỏ khỏi config
                        app.config.students = app.config.students.filter(s => s.id !== id);
                        
                        // Nếu là học sinh mặc định, xóa
                        if (app.config.defaultStudentId === id) {
                            app.config.defaultStudentId = app.config.students[0] ? app.config.students[0].id : null;
                        }
                        
                        // Nếu đang xem học sinh này, đổi sang xem học sinh khác
                        if (this.viewingStudentId === id) {
                            this.viewingStudentId = app.config.defaultStudentId || (app.config.students[0] ? app.config.students[0].id : null);
                        }

                        await app.saveConfig();
                        
                        Swal.fire({
                            icon: 'success',
                            title: 'Đã xóa',
                            text: `Đã xóa tài khoản học sinh ${student.name} thành công.`,
                            confirmButtonColor: 'var(--primary)'
                        }).then(() => {
                            // Load lại dữ liệu dashboard
                            if (this.viewingStudentId) {
                                this.switchViewingStudent(this.viewingStudentId);
                            } else {
                                window.location.reload();
                            }
                        });
                    } else {
                        throw new Error("API server báo lỗi.");
                    }
                } catch (e) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: `Không thể xóa dữ liệu: ${e.message}`,
                        confirmButtonColor: 'var(--primary)'
                    });
                }
            }
        });
    },

    // Đặt học sinh mặc định
    setDefaultStudent: async function(id) {
        app.config.defaultStudentId = id;
        await app.saveConfig();
        
        Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Đã đặt tài khoản học sinh này làm mặc định đăng nhập cho thiết bị!',
            confirmButtonColor: 'var(--primary)'
        });
        this.renderStudentsTable();
    },

    // Reset thiết bị học sinh quay về màn chọn con
    resetDefaultStudentDevice: async function() {
        Swal.fire({
            title: 'Reset màn hình chọn?',
            text: "Thiết bị sẽ không tự động đăng nhập nữa. Khi mở app, giao diện ban đầu sẽ hiển thị danh sách để phụ huynh lựa chọn con học.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: 'var(--primary)',
            cancelButtonColor: '#475569',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        }).then(async (result) => {
            if (result.isConfirmed) {
                app.config.defaultStudentId = null;
                await app.saveConfig();
                
                Swal.fire({
                    icon: 'success',
                    title: 'Đã reset',
                    text: 'Thiết bị đã được đưa về trạng thái lựa chọn con khi khởi chạy!',
                    confirmButtonColor: 'var(--primary)'
                });
                this.renderStudentsTable();
            }
        });
    },

    // Chuyển học sinh đang xem trong Dashboard
    switchViewingStudent: function(id) {
        this.viewingStudentId = id;
        // Gọi lại load dữ liệu của phụ huynh để tải lại toàn bộ tiến trình học tập của học sinh mới
        if (typeof loadAdminDataAndUnlock === 'function') {
            loadAdminDataAndUnlock();
        }
    },

    // Lưu thiết thiết lập phụ huynh chung
    saveParentProfileSettings: async function() {
        const pin = document.getElementById("parent-pin-value").value.trim();

        if (!pin) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng điền mã PIN phụ huynh!',
                confirmButtonColor: 'var(--primary)'
            });
            return;
        }

        if (pin.length !== 6 || isNaN(pin)) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Mã PIN phụ huynh phải có đúng 6 chữ số!',
                confirmButtonColor: 'var(--primary)'
            });
            return;
        }

        app.config.parentPin = pin;
        await app.saveConfig();

        // Cập nhật cả PIN trong tiến trình học sinh hiện tại nếu có
        if (app.state) {
            app.state.parentPin = pin;
            await app.saveProgress();
        }
        
        Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Đã cập nhật mã PIN bảo mật phụ huynh!',
            confirmButtonColor: 'var(--primary)'
        });
    },

    // --- MỞ RỘNG MODAL CÀI ĐẶT PHỤ HUYNH TRÊN SPLASH SCREEN ---
    openSplashSettingsModal: function() {
        // Tải config trước để đảm bảo chính xác
        if (app.loadConfig) app.loadConfig();

        const modal = document.getElementById("splash-parent-modal");
        const authStep = document.getElementById("splash-parent-auth-step");
        const formStep = document.getElementById("splash-parent-form-step");
        const pinInput = document.getElementById("splash-parent-pin-input");
        const pinError = document.getElementById("splash-parent-pin-error");

        if (modal) modal.classList.remove("hidden");
        if (authStep) authStep.classList.remove("hidden");
        if (formStep) formStep.classList.add("hidden");
        if (pinInput) {
            pinInput.value = "";
            pinInput.focus();
        }
        if (pinError) pinError.classList.add("hidden");
    },

    closeSplashSettingsModal: function() {
        const modal = document.getElementById("splash-parent-modal");
        if (modal) modal.classList.add("hidden");
    },

    verifySplashPin: function() {
        const pinInput = document.getElementById("splash-parent-pin-input");
        const pinError = document.getElementById("splash-parent-pin-error");
        const pinVal = pinInput ? pinInput.value : "";
        const correctPin = app.config ? app.config.parentPin : "123456";

        if (pinVal === correctPin) {
            if (pinError) pinError.classList.add("hidden");
            
            // Chuyển sang bước 2 (Form) và điền dữ liệu
            const authStep = document.getElementById("splash-parent-auth-step");
            const formStep = document.getElementById("splash-parent-form-step");
            if (authStep) authStep.classList.add("hidden");
            if (formStep) formStep.classList.remove("hidden");

            // Điền sẵn dữ liệu
            const stInput = document.getElementById("splash-student-name");
            const paInput = document.getElementById("splash-parent-name");
            const clSelect = document.getElementById("splash-class-select");

            if (stInput) stInput.value = app.config.studentName || "";
            if (paInput) paInput.value = app.config.parentName || "Bố Đăng";
            if (clSelect) clSelect.value = app.config.currentClass || "6";
        } else {
            if (pinError) pinError.classList.remove("hidden");
            if (pinInput) {
                pinInput.value = "";
                pinInput.focus();
            }
        }
    },

    saveSplashSettings: async function() {
        const studentName = document.getElementById("splash-student-name").value.trim();
        const parentName = document.getElementById("splash-parent-name").value.trim();
        const newClass = document.getElementById("splash-class-select").value;

        if (!studentName || !parentName) {
            alert("Vui lòng điền đầy đủ tên học sinh và phụ huynh!");
            return;
        }

        const oldClass = app.config.currentClass;

        // Lưu config
        app.config.studentName = studentName;
        app.config.parentName = parentName;
        app.config.currentClass = newClass;
        await app.saveConfig();

        if (oldClass !== newClass) {
            // Chuyển lớp
            await app.switchClass(newClass);
        } else {
            app.updateWelcomeViewerPanelText();
        }

        // Đóng modal
        this.closeSplashSettingsModal();

        // Hiện thông báo thành công đơn giản
        Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Đã lưu cấu hình tài khoản học sinh!',
            timer: 2000,
            showConfirmButton: false
        });
    },

    // --- PDF EXPORTER & PRINTING METHODS ---
    initPdfExporter: function() {
        // Đồng bộ lớp học mặc định của học sinh đang xem
        const viewingStudent = app.config.students ? app.config.students.find(s => s.id === this.viewingStudentId) : null;
        const currentClassLevel = viewingStudent ? viewingStudent.classLevel : (app.config.currentClass || '6');
        
        const classSelect = document.getElementById("pdf-class-select");
        if (classSelect) {
            classSelect.value = currentClassLevel;
        }

        // Tự điền tên học sinh hiện tại làm gợi ý vào ô nhập tên học sinh
        const studentNameInput = document.getElementById("pdf-student-name-input");
        if (studentNameInput && viewingStudent) {
            studentNameInput.value = viewingStudent.name;
        } else if (studentNameInput) {
            studentNameInput.value = app.config.studentName || "";
        }

        this.onPdfClassChange();
    },

    onPdfClassChange: function() {
        const classVal = document.getElementById("pdf-class-select").value;
        const chapterSelect = document.getElementById("pdf-chapter-select");
        if (!chapterSelect) return;
        chapterSelect.innerHTML = "";

        if (typeof COURSE_DATA === "undefined") return;

        // Lọc chương theo lớp học
        const chapters = COURSE_DATA.filter(chapter => {
            const chapterClass = chapter.class || '6'; // Mặc định lớp 6 nếu không ghi rõ
            return chapterClass === classVal;
        });

        chapters.forEach(chapter => {
            const opt = document.createElement("option");
            opt.value = chapter.id;
            opt.textContent = chapter.title;
            chapterSelect.appendChild(opt);
        });

        // Trigger load bài học của chương đầu tiên
        this.onPdfChapterChange();
    },

    onPdfChapterChange: function() {
        const chapterSelect = document.getElementById("pdf-chapter-select");
        if (!chapterSelect) return;
        const chapterId = chapterSelect.value;
        const lessonSelect = document.getElementById("pdf-lesson-select");
        if (!lessonSelect) return;
        lessonSelect.innerHTML = "";

        if (typeof COURSE_DATA === "undefined") return;

        const chapter = COURSE_DATA.find(c => c.id === chapterId);
        if (!chapter || !chapter.lessons) return;

        chapter.lessons.forEach(lesson => {
            const opt = document.createElement("option");
            opt.value = lesson.id;
            opt.textContent = lesson.title;
            lessonSelect.appendChild(opt);
        });
    },

    generatePdfExamPreview: function() {
        const lessonSelect = document.getElementById("pdf-lesson-select");
        if (!lessonSelect) return;
        const lessonId = lessonSelect.value;
        const lessonTitle = lessonSelect.options[lessonSelect.selectedIndex]?.text || "Chuyên đề";
        const classLevel = document.getElementById("pdf-class-select").value;
        const includeSolution = document.getElementById("pdf-include-solution").checked;

        if (!lessonId) {
            Swal.fire({ icon: 'warning', title: 'Thông báo', text: 'Vui lòng chọn bài học!' });
            return;
        }

        Swal.fire({
            title: 'Đang tải câu hỏi...',
            text: 'Hệ thống đang nạp bộ câu hỏi chất lượng cao từ server. Vui lòng chờ...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const studentId = this.viewingStudentId || 'default';
        fetch(getApiUrl(`/api/get-questions?lessonId=${lessonId}&lessonTitle=${encodeURIComponent(lessonTitle)}&classLevel=${classLevel}&studentId=${studentId}`))
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
                    text: 'Trình giải mã đang sinh các bộ số ngẫu nhiên không trùng lặp...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                // Khởi động Web Worker để sinh câu hỏi cụ thể
                const worker = new Worker('js/question-generator-worker.js');
                worker.postMessage({ questions: questions, maxAttempts: 500 });

                worker.onmessage = (e) => {
                    Swal.close();
                    worker.terminate();
                    const response = e.data;
                    if (response.status === 'success') {
                        // Render đề thi giấy ra preview
                        parentDashboard.renderPdfExamPaper(lessonTitle, response.questions, includeSolution);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Lỗi sinh số ngẫu nhiên',
                            text: 'Không thể tạo đề thi: ' + (response.message || 'Lỗi Web Worker.')
                        });
                    }
                };

                worker.onerror = (err) => {
                    Swal.close();
                    worker.terminate();
                    console.error("Worker in đề thi lỗi:", err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi luồng chạy Web Worker',
                        text: 'Không thể khởi động Web Worker để tạo đề: ' + err.message
                    });
                };
            })
            .catch(err => {
                Swal.close();
                console.error("Lỗi khi tải đề thi in:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi tải đề thi',
                    text: 'Không thể tải đề thi từ server: ' + err.message
                });
            });
    },

    renderPdfExamPaper: function(lessonTitle, questions, includeSolution) {
        const paper = document.getElementById("pdf-exam-paper");
        if (!paper) return;

        const schoolName = document.getElementById("pdf-school-name").value.trim() || "HỆ THỐNG GIÁO DỤC CÁ NHÂN HÓA AI";
        const studentName = document.getElementById("pdf-student-name-input").value.trim() || "......................................................................";
        const classVal = document.getElementById("pdf-class-select").value;

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
                        <p style="font-size: 11px; font-weight: bold; font-style: italic; text-transform: none; margin-top: 4px; margin-bottom: 0;">Môn: Toán Lớp ${classVal}</p>
                    </div>
                </div>

                <!-- Tên Chuyên đề -->
                <div style="text-align: center; font-weight: bold; font-size: 15px; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 0.5px;">
                    Chuyên đề: ${lessonTitle}
                </div>

                <!-- Phần điền thông tin học sinh -->
                <div style="display: flex; flex-wrap: wrap; justify-content: space-between; font-size: 13px; margin-bottom: 20px; line-height: 1.8;">
                    <div style="width: 60%;">Họ và tên học sinh: <span style="font-weight: bold;">${studentName}</span></div>
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
        questions.forEach((q, idx) => {
            const cleanText = q.questionText.replace(/<br\s*\/?>/gi, '<br/>');
            
            // Render các phương án lựa chọn A, B, C, D
            let optionsHtml = "";
            if (q.options && q.options.length > 0) {
                optionsHtml = `<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 8px; padding-left: 15px; font-size: 13px;">`;
                q.options.forEach((opt, oIdx) => {
                    // Loại bỏ tiền tố A., B., C., D. nếu có trong option text vì chúng ta sẽ tự render đẹp
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
                    <p style="font-size: 13px; margin-bottom: 15px; font-weight: bold;">Chuyên đề: ${lessonTitle}</p>
                    
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
            questions.forEach(q => {
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

            questions.forEach((q, idx) => {
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

        // Đẩy HTML vào khung preview
        paper.innerHTML = html;

        // Auto-render LaTeX bằng KaTeX
        if (window.renderMathInElement) {
            window.renderMathInElement(paper, {
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ]
            });
        }

        // Hiện container preview
        document.getElementById("pdf-exam-preview-container").classList.remove("hidden");

        // Cuộn màn hình xuống vùng preview
        document.getElementById("pdf-exam-preview-container").scrollIntoView({ behavior: 'smooth' });
    },

    printPdfExam: function() {
        const paper = document.getElementById("pdf-exam-paper");
        if (paper) {
            const htmlContent = paper.innerHTML;
            const filename = `de_thi_phu_huynh_${Date.now()}.pdf`;
            
            fetch('/api/save-printed-pdf', {
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
                  console.log("Đã lưu PDF kiểm định phụ huynh tại server:", data);
              })
              .catch(err => {
                  console.error("Không thể lưu PDF kiểm định phụ huynh:", err);
              });
        }
        window.print();
    }
};

window.parentDashboard = parentDashboard;

// Đăng ký CSS Rung Lắc cho PIN sai
const cssShake = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
}
.animate-shake {
    animation: shake 0.3s ease-in-out;
}
`;
const styleEl = document.createElement('style');
styleEl.innerHTML = cssShake;
document.head.appendChild(styleEl);
