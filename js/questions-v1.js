// Bộ quản lý sinh câu hỏi Toán lớp 1 ngẫu nhiên chuẩn Kết nối tri thức với cuộc sống
// Tuân thủ 100% quy tắc chống trùng đáp án và LaTeX chuẩn trong AGENTS.md

const questionsL1 = {
    // Hàm phụ trợ sinh số ngẫu nhiên từ min đến max (gồm cả hai biên)
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Hàm trộn mảng các lựa chọn ngẫu nhiên
    shuffle: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    },

    // Tránh trùng chéo đáp án bằng biểu thức tam phân động hoặc kiểm tra điều kiện trực tiếp
    createOptions: function(correctVal, rawDistractors) {
        const uniqueDistractors = new Set();
        rawDistractors.forEach(d => {
            let val = d;
            // Nếu trùng với đáp án đúng, dịch chuyển đi
            if (val === correctVal) {
                if (typeof val === 'number') {
                    val = val + this.randomInt(1, 3);
                } else if (typeof val === 'string') {
                    val = val + " (khác)";
                }
            }
            uniqueDistractors.add(val);
        });

        // Nếu vẫn thiếu do trùng chéo lẫn nhau
        while (uniqueDistractors.size < 3) {
            if (typeof correctVal === 'number') {
                let backup = correctVal + this.randomInt(1, 5);
                if (backup !== correctVal) uniqueDistractors.add(backup);
            } else {
                uniqueDistractors.add(correctVal + "_" + this.randomInt(1, 10));
            }
        }

        const dists = Array.from(uniqueDistractors);
        
        // Kiểm tra và sửa đổi chéo để dists[0], dists[1], dists[2] không trùng nhau
        if (typeof correctVal === 'number') {
            let d0 = dists[0];
            let d1 = dists[1] === d0 ? dists[1] + 1 : dists[1];
            let d2 = (dists[2] === d0 || dists[2] === d1) ? Math.max(d0, d1) + 1 : dists[2];
            
            // Đảm bảo không trùng với correctVal
            if (d1 === correctVal) d1 += 2;
            if (d2 === correctVal) d2 += 3;

            const opts = [correctVal, d0, d1, d2];
            this.shuffle(opts);
            const idx = opts.indexOf(correctVal);
            return { opts, idx };
        } else {
            const opts = [correctVal, dists[0], dists[1], dists[2]];
            this.shuffle(opts);
            const idx = opts.indexOf(correctVal);
            return { opts, idx };
        }
    },

    // Sinh các biểu tượng ngẫu nhiên để bé đếm
    getEmojis: function(count) {
        const emojis = ["🍎", "🍊", "🍋", "🍓", "🎈", "🌸", "⭐", "🐟", "🐰", "🐱", "🐶", "🐝", "🦀", "🚗", "⛵"];
        const selectedEmoji = emojis[this.randomInt(0, emojis.length - 1)];
        let res = "";
        for (let i = 0; i < count; i++) {
            res += selectedEmoji + " ";
        }
        return res.trim();
    },

    // Phương thức sinh câu hỏi chính
    generateQuestion: function(type, level = "co-ban") {
        let questionText = "";
        let options = [];
        let correctIndex = 0;
        let hints = [];
        let solutionHtml = "";
        let tip = "";

        switch(type) {
            // ================= CHƯƠNG 1: CÁC SỐ TỪ 0 ĐẾN 10 =================
            case "l1-cac-so-0-5-d1": {
                const count = this.randomInt(0, 5);
                if (count === 0) {
                    questionText = "Trong hộp không có quả táo nào. Số quả táo trong hộp là mấy?";
                    const optSet = this.createOptions(0, [1, 2, 3]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    hints = ["Khi không có đồ vật nào, ta dùng số $0$ để biểu thị."];
                    solutionHtml = "Không có đồ vật nào tương ứng với số $0$.<br/>Đáp án đúng là: **0**.";
                } else {
                    const emojis = this.getEmojis(count);
                    questionText = `Hãy đếm xem có bao nhiêu hình vẽ dưới đây:<br/><br/><span style="font-size:28px;">${emojis}</span>`;
                    const optSet = this.createOptions(count, [
                        (count - 1 < 0) ? count + 2 : count - 1,
                        count + 1,
                        count + 2
                    ]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    hints = ["Hãy chỉ tay vào từng hình vẽ và đếm lần lượt từ trái sang phải: 1, 2, 3..."];
                    solutionHtml = `Đếm lần lượt các hình vẽ ta thấy có đúng $${count}$ hình.<br/>Đáp án đúng là: **${count}**.`;
                }
                tip = "Hãy đếm thật bình tĩnh, không bỏ sót hình nào con nhé.";
                break;
            }

            case "l1-cac-so-6-10-d1": {
                const count = this.randomInt(6, 10);
                const emojis = this.getEmojis(count);
                questionText = `Hãy đếm xem có bao nhiêu hình vẽ dưới đây:<br/><br/><span style="font-size:28px;">${emojis}</span>`;
                const optSet = this.createOptions(count, [count - 1, count + 1, count - 2]);
                options = optSet.opts;
                correctIndex = optSet.idx;
                hints = ["Chỉ tay đếm lần lượt từng hình vẽ: 1, 2, 3, 4, 5, 6..."];
                solutionHtml = `Đếm lần lượt các hình vẽ ta thấy có đúng $${count}$ hình.<br/>Đáp án đúng là: **${count}**.`;
                tip = "Các số lớn hơn 5 con hãy đếm cẩn thận từng hàng nhé.";
                break;
            }

            case "l1-nhieu-it-bang-d1": {
                const variant = this.randomInt(1, 3);
                const a = this.randomInt(2, 5);
                let b = a;
                if (variant === 1) { // Nhiều hơn
                    b = a - this.randomInt(1, 2);
                    questionText = `Nhóm A có $${a}$ bông hoa 🌸, nhóm B có $${b}$ chú ong 🐝. So sánh số hoa với số ong:`;
                    const optSet = this.createOptions("Số hoa nhiều hơn số ong", [
                        "Số hoa ít hơn số ong",
                        "Số hoa bằng số ong",
                        "Không thể so sánh"
                    ]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = `Nhóm A có $${a}$ bông hoa, nhóm B có $${b}$ chú ong.<br/>Vì $${a} > ${b}$ nên số hoa nhiều hơn số ong.`;
                } else if (variant === 2) { // Ít hơn
                    b = a + this.randomInt(1, 2);
                    questionText = `Nhóm A có $${a}$ củ cà rốt 🥕, nhóm B có $${b}$ chú thỏ 🐰. So sánh số cà rốt với số thỏ:`;
                    const optSet = this.createOptions("Số cà rốt ít hơn số thỏ", [
                        "Số cà rốt nhiều hơn số thỏ",
                        "Số cà rốt bằng số thỏ",
                        "Không thể so sánh"
                    ]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = `Nhóm A có $${a}$ củ cà rốt, nhóm B có $${b}$ chú thỏ.<br/>Vì $${a} < ${b}$ nên số cà rốt ít hơn số thỏ.`;
                } else { // Bằng nhau
                    questionText = `Nhóm A có $${a}$ cái kẹo 🍬, nhóm B có $${a}$ em bé 👶. So sánh số kẹo với số em bé:`;
                    const optSet = this.createOptions("Số kẹo bằng số em bé", [
                        "Số kẹo nhiều hơn số em bé",
                        "Số kẹo ít hơn số em bé",
                        "Không thể so sánh"
                    ]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = `Nhóm A có $${a}$ cái kẹo, nhóm B cũng có $${a}$ em bé.<br/>Vì số lượng bằng nhau ($${a} = ${a}$) nên số kẹo bằng số em bé.`;
                }
                hints = ["Con có thể thử ghép mỗi vật ở nhóm này với một vật ở nhóm kia để so sánh."];
                tip = "Nhóm nào thừa ra đồ vật thì nhóm đó nhiều hơn con nhé.";
                break;
            }

            case "l1-so-sanh-so-d1": {
                const a = this.randomInt(0, 10);
                let b = this.randomInt(0, 10);
                while (b === a) b = this.randomInt(0, 10);
                
                questionText = `Điền dấu thích hợp vào chỗ trống: $${a}$ ... $${b}$`;
                const correctSign = a > b ? "$>$" : "$<$";
                
                options = ["$>$", "$<$", "$=$", "Không có"];
                correctIndex = options.indexOf(correctSign);

                hints = ["Hãy xem trên tia số từ 0 đến 10, số nào đứng sau thì số đó lớn hơn."];
                solutionHtml = `So sánh hai số ta thấy $${a}$ ${a > b ? "lớn hơn" : "nhỏ hơn"} $${b}$.<br/>Do đó điền dấu thích hợp là **${correctSign}**.`;
                tip = "Đầu nhọn của dấu luôn chỉ về phía số bé hơn đấy!";
                break;
            }

            case "l1-so-sanh-so-d2": {
                // Sắp xếp thứ tự các số
                const nums = [];
                while (nums.length < 3) {
                    const r = this.randomInt(0, 10);
                    if (!nums.includes(r)) nums.push(r);
                }
                const isAscending = this.randomInt(0, 1) === 1;
                questionText = `Sắp xếp các số $${nums.join(', ')}$ theo thứ tự từ ${isAscending ? "bé đến lớn" : "lớn đến bé"}:`;
                
                const sorted = [...nums].sort((x, y) => isAscending ? x - y : y - x);
                const correctStr = sorted.join('; ');
                
                const w1 = [...nums].sort((x, y) => isAscending ? y - x : x - y).join('; ');
                const w2 = [nums[1], nums[0], nums[2]].join('; ');
                const w3 = [nums[2], nums[1], nums[0]].join('; ');

                const optSet = this.createOptions(correctStr, [w1, w2, w3]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = [`Tìm số ${isAscending ? "bé nhất" : "lớn nhất"} trước để đặt lên đầu tiên.`];
                solutionHtml = `Sắp xếp các số theo thứ tự từ ${isAscending ? "bé đến lớn" : "lớn đến bé"} ta được:<br/>**${correctStr}**.`;
                tip = "Con hãy viết các số ra nháp rồi xếp thứ tự từ từ nhé.";
                break;
            }

            case "l1-may-va-may-d1": {
                const a = this.randomInt(3, 10);
                const part1 = this.randomInt(1, a - 1);
                const part2 = a - part1;
                const variant = this.randomInt(1, 2);
                if (variant === 1) { // Tách số
                    questionText = `Số $${a}$ gồm $${part1}$ và mấy?`;
                    const optSet = this.createOptions(part2, [
                        (part2 - 1 <= 0) ? part2 + 2 : part2 - 1,
                        part2 + 1,
                        part2 + 3
                    ]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = `Ta có phép tính: $${a} - ${part1} = ${part2}$.<br/>Vậy số $${a}$ gồm $${part1}$ và **${part2}**.`;
                } else { // Gộp số
                    questionText = `Gộp $${part1}$ và $${part2}$ được mấy?`;
                    const optSet = this.createOptions(a, [a - 1, a + 1, a + 2]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = `Ta thực hiện phép tính gộp: $${part1} + ${part2} = ${a}$.<br/>Vậy gộp $${part1}$ và $${part2}$ ta được **${a}**.`;
                }
                hints = ["Con có thể dùng các ngón tay để hỗ trợ đếm gộp hoặc tách."];
                tip = "Phép gộp tương đương phép cộng, phép tách tương đương phép trừ đấy.";
                break;
            }

            case "l1-luyen-tap-c1-d1": {
                // Ôn tập tổng hợp phạm vi 10
                const subType = this.randomInt(1, 3);
                if (subType === 1) {
                    return this.generateQuestion("l1-so-sanh-so-d1");
                } else if (subType === 2) {
                    return this.generateQuestion("l1-may-va-may-d1");
                } else {
                    const a = this.randomInt(1, 9);
                    questionText = `Số liền sau của số $${a}$ là số nào?`;
                    const optSet = this.createOptions(a + 1, [a - 1, a, a + 2]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    hints = ["Số liền sau là số đứng ngay phía sau nó khi đếm, bằng số đó cộng thêm 1."];
                    solutionHtml = `Số liền sau của $${a}$ là: $${a} + 1 = ${a + 1}$.`;
                    tip = "Liền sau thì cộng 1, liền trước thì trừ 1 con nhé.";
                }
                break;
            }

            case "l1-luyen-tap-c1-d2": {
                // Câu hỏi logic tư duy
                const a = this.randomInt(4, 9);
                const b = this.randomInt(1, a - 2);
                const c = this.randomInt(1, 2);
                
                questionText = `Trên sân chơi có $${a}$ bạn nhỏ đang chơi. Có $${b}$ bạn đi về nhà, sau đó lại có $${c}$ bạn mới chạy đến chơi cùng. Hỏi hiện tại trên sân chơi có bao nhiêu bạn nhỏ?`;
                const ans = a - b + c;
                const optSet = this.createOptions(ans, [ans - 1, ans + 1, ans + 2]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = [
                    `Tính số bạn còn lại sau khi có bạn đi về: $${a} - ${b}$.`,
                    `Sau đó cộng thêm số bạn mới chạy đến.`
                ];
                solutionHtml = `Số bạn nhỏ còn lại sau khi có $${b}$ bạn đi về là:<br/>$${a} - ${b} = ${a - b}$ (bạn)<br/><br/>Số bạn nhỏ hiện tại trên sân sau khi có thêm $${c}$ bạn chạy đến là:<br/>$${a - b} + ${c} = ${ans}$ (bạn).`;
                tip = "Đi về là làm phép trừ, chạy đến là làm phép cộng nhé.";
                break;
            }

            // ================= CHƯƠNG 2: HÌNH PHẲNG =================
            case "l1-hinh-phang-d1": {
                const variant = this.randomInt(1, 4);
                if (variant === 1) {
                    questionText = "Bánh xe của xe đạp hoặc đĩa CD có dạng hình gì?";
                    const optSet = this.createOptions("Hình tròn", ["Hình vuông", "Hình tam giác", "Hình chữ nhật"]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = "Bánh xe và đĩa CD đều có dạng tròn trịa, nên chúng có dạng **Hình tròn**.";
                } else if (variant === 2) {
                    questionText = "Một chiếc khăn quàng đỏ hoặc lát cắt của miếng bánh pizza có dạng hình gì?";
                    const optSet = this.createOptions("Hình tam giác", ["Hình tròn", "Hình vuông", "Hình chữ nhật"]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = "Khăn quàng đỏ và lát cắt bánh pizza đều có 3 cạnh và 3 góc, do đó chúng có dạng **Hình tam giác**.";
                } else if (variant === 3) {
                    questionText = "Lá cờ Tổ quốc Việt Nam hoặc chiếc bảng viết trên lớp học có dạng hình gì?";
                    const optSet = this.createOptions("Hình chữ nhật", ["Hình tròn", "Hình vuông", "Hình tam giác"]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = "Lá cờ Tổ quốc và bảng viết có 4 cạnh (gồm 2 cạnh dài bằng nhau, 2 cạnh ngắn bằng nhau), do đó chúng có dạng **Hình chữ nhật**.";
                } else {
                    questionText = "Quân xúc xắc (các mặt) hoặc một viên gạch men lát nền dạng vuông có dạng hình gì?";
                    const optSet = this.createOptions("Hình vuông", ["Hình tròn", "Hình tam giác", "Hình chữ nhật"]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = "Quân xúc xắc và gạch men lát nền vuông có 4 cạnh dài bằng nhau, do đó chúng có dạng **Hình vuông**.";
                }
                hints = ["Quan sát kỹ hình dáng của các đồ vật trong đời sống thực tế để nhận biết."];
                tip = "Hình tròn không có góc nào, hình tam giác có 3 góc, hình vuông và hình chữ nhật có 4 góc.";
                break;
            }

            case "l1-xep-hinh-d1": {
                const variant = this.randomInt(1, 2);
                if (variant === 1) {
                    questionText = "Để ghép thành hình một ngôi nhà đơn giản, bạn nhỏ dùng 1 hình tam giác làm mái nhà và 1 hình vuông làm thân nhà. Hỏi bạn nhỏ đã dùng tất cả bao nhiêu hình phẳng?";
                    const optSet = this.createOptions(2, [1, 3, 4]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = "Tổng số hình phẳng bạn nhỏ đã dùng là:<br/>$1$ (mái nhà hình tam giác) + $1$ (thân nhà hình vuông) = **2** hình.";
                } else {
                    questionText = "Ghép 2 hình tam giác nhỏ bằng nhau sát cạnh nhau ta có thể tạo ra được hình phẳng nào dưới đây?";
                    const optSet = this.createOptions("Hình vuông", ["Hình tròn", "Hình bầu dục", "Hình ngũ giác"]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = "Khi ghép 2 hình tam giác vuông cân chung cạnh huyền với nhau, ta sẽ tạo được một **Hình vuông**.";
                }
                hints = ["Tưởng tượng hoặc vẽ nháp thử ghép các hình xem sao nhé."];
                tip = "Thực hành xếp ghép hình giúp con phát triển trí tưởng tượng hình học đấy.";
                break;
            }

            case "l1-luyen-tap-c2-d1": {
                // Nhận biết nâng cao
                questionText = "Hình nào dưới đây có 4 cạnh nhưng có 2 cạnh dài và 2 cạnh ngắn?";
                const optSet = this.createOptions("Hình chữ nhật", ["Hình vuông", "Hình tam giác", "Hình tròn"]);
                options = optSet.opts;
                correctIndex = optSet.idx;
                solutionHtml = "Hình chữ nhật có 4 cạnh, trong đó có 2 cạnh dài bằng nhau và 2 cạnh ngắn bằng nhau. Còn hình vuông có 4 cạnh dài bằng nhau.";
                hints = ["So sánh độ dài các cạnh của hình vuông và hình chữ nhật."];
                tip = "Đừng nhầm lẫn giữa hình vuông và hình chữ nhật nhé con.";
                break;
            }

            // ================= CHƯƠNG 3: PHÉP CỘNG, PHÉP TRỪ PHẠM VI 10 =================
            case "l1-cong-pham-vi-10-d1": {
                const a = this.randomInt(1, 8);
                const b = this.randomInt(1, 10 - a);
                const ans = a + b;
                questionText = `Kết quả của phép tính: $${a} + ${b} = ?$`;
                const optSet = this.createOptions(ans, [
                    (ans - 1 <= 0) ? ans + 2 : ans - 1,
                    ans + 1,
                    ans + 3
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = ["Có thể đếm thêm hoặc dùng các ngón tay để tính."];
                solutionHtml = `Thực hiện phép cộng: $${a} + ${b} = ${ans}$.<br/>Đáp án đúng là: **${ans}**.`;
                tip = "Cộng là gộp lại và đếm tiếp lên nhé.";
                break;
            }

            case "l1-cong-pham-vi-10-d2": {
                // Ô trống phép cộng
                const a = this.randomInt(1, 8);
                const ans = this.randomInt(a + 1, 10);
                const missing = ans - a;
                
                const variant = this.randomInt(1, 2);
                if (variant === 1) {
                    questionText = `Điền số thích hợp vào ô trống: $${a} + \\square = ${ans}$`;
                } else {
                    questionText = `Điền số thích hợp vào ô trống: $\\square + ${a} = ${ans}$`;
                }
                const optSet = this.createOptions(missing, [
                    (missing - 1 <= 0) ? missing + 2 : missing - 1,
                    missing + 1,
                    missing + 3
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = [`Để tìm ô trống, con lấy kết quả trừ đi số đã biết: $${ans} - ${a}$.`];
                solutionHtml = `Ta có phép tính ngược: $${ans} - ${a} = ${missing}$.<br/>Vậy số thích hợp điền vào ô trống là: **${missing}**.`;
                tip = "Phép cộng ô trống có thể tính bằng cách lấy tổng trừ đi số đã biết.";
                break;
            }

            case "l1-tru-pham-vi-10-d1": {
                const a = this.randomInt(2, 10);
                const b = this.randomInt(1, a - 1);
                const ans = a - b;
                questionText = `Kết quả của phép tính: $${a} - ${b} = ?$`;
                const optSet = this.createOptions(ans, [
                    ans + 1,
                    (ans - 1 < 0) ? ans + 2 : ans - 1,
                    ans + 2
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = ["Có thể đếm lùi bớt đi từ số ban đầu."];
                solutionHtml = `Thực hiện phép trừ: $${a} - ${b} = ${ans}$.<br/>Đáp án đúng là: **${ans}**.`;
                tip = "Trừ là bớt đi, đếm lùi lại nhé.";
                break;
            }

            case "l1-tru-pham-vi-10-d2": {
                // Ô trống phép trừ
                const a = this.randomInt(3, 10);
                const missing = this.randomInt(1, a - 1);
                const ans = a - missing;
                
                const variant = this.randomInt(1, 2);
                if (variant === 1) { // Số trừ chưa biết
                    questionText = `Điền số thích hợp vào ô trống: $${a} - \\square = ${ans}$`;
                    const optSet = this.createOptions(missing, [missing + 1, (missing - 1 <= 0) ? missing + 2 : missing - 1, missing + 2]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    hints = [`Lấy số bị trừ trừ đi kết quả: $${a} - ${ans}$.`];
                    solutionHtml = `Số thích hợp điền vào ô trống là: $${a} - ${ans} = ${missing}$.`;
                } else { // Số bị trừ chưa biết
                    questionText = `Điền số thích hợp vào ô trống: $\\square - ${missing} = ${ans}$`;
                    const optSet = this.createOptions(a, [a + 1, a - 1, a + 2]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    hints = [`Lấy kết quả cộng với số trừ: $${ans} + ${missing}$.`];
                    solutionHtml = `Số thích hợp điền vào ô trống là: $${ans} + ${missing} = ${a}$.`;
                }
                tip = "Hãy phân biệt số bị trừ ở đầu và số trừ ở giữa nhé.";
                break;
            }

            case "l1-bang-cong-tru-10-d1": {
                const isPlus = this.randomInt(0, 1) === 1;
                if (isPlus) return this.generateQuestion("l1-cong-pham-vi-10-d1");
                else return this.generateQuestion("l1-tru-pham-vi-10-d1");
            }

            case "l1-bang-cong-tru-10-d2": {
                // So sánh hai biểu thức
                const a = this.randomInt(1, 8);
                const b = this.randomInt(1, 9 - a);
                const val1 = a + b;

                const c = this.randomInt(2, 10);
                const d = this.randomInt(1, c - 1);
                const val2 = c - d;

                questionText = `Điền dấu so sánh thích hợp vào chỗ trống: $${a} + ${b}$ ... $${c} - ${d}$`;
                let correctSign = val1 > val2 ? "$>$" : (val1 < val2 ? "$<$" : "$=$");
                
                options = ["$>$", "$<$", "$=$", "Không có"];
                correctIndex = options.indexOf(correctSign);

                hints = [
                    `Tính kết quả vế trái: $${a} + ${b} = ${val1}$.`,
                    `Tính kết quả vế phải: $${c} - ${d} = ${val2}$.`,
                    `So sánh hai kết quả: $${val1}$ và $${val2}$.`
                ];
                solutionHtml = `Ta có:<br/>Vế trái: $${a} + ${b} = ${val1}$<br/>Vế phải: $${c} - ${d} = ${val2}$<br/>Vì $${val1}$ ${val1 > val2 ? ">" : (val1 < val2 ? "<" : "=")} $${val2}$ nên điền dấu thích hợp là **${correctSign}**.`;
                tip = "Nhớ tính nháp kết quả của cả hai vế trước rồi mới so sánh con nhé.";
                break;
            }

            case "l1-luyen-tap-c3-d1": {
                // Dãy tính 2 phép tính liên tiếp
                const a = this.randomInt(4, 9);
                const b = this.randomInt(1, 10 - a);
                const c = this.randomInt(1, a + b - 1);
                
                questionText = `Tính giá trị biểu thức sau: $${a} + ${b} - ${c} = ?$`;
                const ans = a + b - c;
                const optSet = this.createOptions(ans, [ans + 1, (ans - 1 < 0) ? ans + 2 : ans - 1, ans + 2]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = ["Thực hiện từ trái sang phải: cộng trước rồi trừ kết quả đó cho số tiếp theo."];
                solutionHtml = `Tính lần lượt từ trái sang phải:<br/>$${a} + ${b} = ${a + b}$<br/>Sau đó lấy kết quả trừ đi $${c}$:<br/>$${a + b} - ${c} = ${ans}$.<br/>Đáp án là: **${ans}**.`;
                tip = "Luôn tính từ trái qua phải đối với dãy tính có cộng và trừ con nhé.";
                break;
            }

            case "l1-luyen-tap-c3-d2": {
                return this.generateQuestion("l1-luyen-tap-c1-d2");
            }

            // ================= CHƯƠNG 4: HÌNH KHỐI =================
            case "l1-hinh-khoi-d1": {
                const variant = this.randomInt(1, 2);
                if (variant === 1) {
                    questionText = "Quân xúc xắc đồ chơi hoặc hộp quà vuông có dạng khối hình học nào?";
                    const optSet = this.createOptions("Khối lập phương", ["Khối hộp chữ nhật", "Khối trụ", "Khối cầu"]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = "Quân xúc xắc và hộp quà vuông có 6 mặt đều là hình vuông bằng nhau, do đó chúng có dạng **Khối lập phương**.";
                } else {
                    questionText = "Hộp sữa giấy, viên gạch xây nhà hoặc hộp kem đánh răng có dạng khối hình học nào?";
                    const optSet = this.createOptions("Khối hộp chữ nhật", ["Khối lập phương", "Khối trụ", "Khối cầu"]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = "Hộp sữa, viên gạch, hộp kem đánh răng có các mặt là hình chữ nhật, do đó chúng có dạng **Khối hộp chữ nhật**.";
                }
                hints = ["Hãy chú ý xem các mặt của đồ vật là hình vuông hay hình chữ nhật."];
                tip = "Khối lập phương có các mặt vuông, khối hộp chữ nhật có các mặt chữ nhật.";
                break;
            }

            case "l1-vi-tri-khong-gian-d1": {
                const variant = this.randomInt(1, 2);
                if (variant === 1) {
                    questionText = "Quyển vở đặt ở trên bàn, quả bóng đặt dưới gầm bàn. Quyển vở ở vị trí nào so với quả bóng?";
                    const optSet = this.createOptions("Ở trên", ["Ở dưới", "Ở bên trái", "Ở bên phải"]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = "Quyển vở ở trên bàn tức là nó ở vị trí **Ở trên** so với quả bóng đặt dưới gầm bàn.";
                } else {
                    questionText = "Học sinh xếp hàng: Bạn Nam đứng trước, bạn Lan đứng sau. Bạn Nam ở vị trí nào so với bạn Lan?";
                    const optSet = this.createOptions("Phía trước", ["Phía sau", "Ở giữa", "Bên trái"]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = "Bạn Nam đứng trước bạn Lan, do đó Nam ở vị trí **Phía trước** so với Lan.";
                }
                hints = ["Tưởng tượng vị trí không gian để trả lời chính xác."];
                tip = "Hãy dùng tay trái và tay phải của con để dễ hình dung hơn nhé.";
                break;
            }

            case "l1-luyen-tap-c4-d1": {
                const count = this.randomInt(3, 5);
                questionText = `Xếp chồng các khối lập phương nhỏ cạnh nhau: Bạn nhỏ xếp $2$ khối ở hàng dưới và xếp thêm $${count - 2}$ khối lên trên. Hỏi tất cả có bao nhiêu khối lập phương?`;
                const optSet = this.createOptions(count, [count - 1, count + 1, count + 2]);
                options = optSet.opts;
                correctIndex = optSet.idx;
                solutionHtml = `Tổng số khối lập phương bạn nhỏ dùng là:<br/>$2$ (hàng dưới) + $${count - 2}$ (hàng trên) = **${count}** khối.`;
                hints = ["Đếm tổng số lượng khối ở cả hàng trên và hàng dưới."];
                tip = "Nhớ cộng cả khối ở bên dưới con nhé.";
                break;
            }

            // ================= CHƯƠNG 5: ÔN TẬP HỌC KÌ I =================
            case "l1-on-tap-so-10-d1": {
                return this.generateQuestion("l1-luyen-tap-c1-d1");
            }

            case "l1-on-tap-phep-tinh-10-d1": {
                const isPlus = this.randomInt(0, 1) === 1;
                if (isPlus) return this.generateQuestion("l1-cong-pham-vi-10-d1");
                else return this.generateQuestion("l1-tru-pham-vi-10-d1");
            }

            case "l1-on-tap-hinh-hoc-d1": {
                const isFlat = this.randomInt(0, 1) === 1;
                if (isFlat) return this.generateQuestion("l1-hinh-phang-d1");
                else return this.generateQuestion("l1-hinh-khoi-d1");
            }

            case "l1-on-tap-chung-hk1-d1": {
                const typeRand = this.randomInt(1, 3);
                if (typeRand === 1) return this.generateQuestion("l1-bang-cong-tru-10-d2");
                else if (typeRand === 2) return this.generateQuestion("l1-luyen-tap-c3-d1");
                else return this.generateQuestion("l1-so-sanh-so-d2");
            }

            case "l1-on-tap-chung-hk1-d2": {
                return this.generateQuestion("l1-luyen-tap-c1-d2");
            }

            // ================= CHƯƠNG 6: CÁC SỐ ĐẾN 100 =================
            case "l1-so-hai-chu-so-d1": {
                const chuc = this.randomInt(2, 9);
                const donVi = this.randomInt(0, 9);
                const num = chuc * 10 + donVi;
                
                const variant = this.randomInt(1, 2);
                if (variant === 1) {
                    questionText = `Số $${num}$ gồm mấy chục và mấy đơn vị?`;
                    const correctStr = `$${chuc}$ chục và $${donVi}$ đơn vị`;
                    const optSet = this.createOptions(correctStr, [
                        `$${donVi}$ chục và $${chuc}$ đơn vị`,
                        `$${chuc}$ chục và $${chuc}$ đơn vị`,
                        `$${chuc + 1}$ chục và $${donVi}$ đơn vị`
                    ]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = `Số $${num}$ có chữ số hàng chục là $${chuc}$, chữ số hàng đơn vị là $${donVi}$.<br/>Do đó, số $${num}$ gồm **${chuc} chục và ${donVi} đơn vị**.`;
                } else {
                    questionText = `Số gồm $${chuc}$ chục và $${donVi}$ đơn vị viết là số nào?`;
                    const optSet = this.createOptions(num, [
                        donVi * 10 + chuc,
                        chuc * 10 + donVi + 1,
                        (chuc - 1) * 10 + donVi
                    ]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = `Số gồm $${chuc}$ chục và $${donVi}$ đơn vị viết là: **${num}**.`;
                }
                hints = ["Chữ số đứng trước là hàng chục, chữ số đứng sau là hàng đơn vị."];
                tip = "Hãy đọc thật kỹ đề bài để tránh viết ngược số hàng chục và đơn vị con nhé.";
                break;
            }

            case "l1-so-sanh-so-100-d1": {
                const a = this.randomInt(10, 99);
                let b = this.randomInt(10, 99);
                while (b === a) b = this.randomInt(10, 99);

                questionText = `Điền dấu thích hợp vào chỗ trống: $${a}$ ... $${b}$`;
                const correctSign = a > b ? "$>$" : "$<$";
                
                options = ["$>$", "$<$", "$=$", "Không có"];
                correctIndex = options.indexOf(correctSign);

                hints = [
                    "So sánh chữ số hàng chục trước.",
                    "Nếu hàng chục bằng nhau thì so sánh tiếp chữ số hàng đơn vị."
                ];
                solutionHtml = `Ta so sánh $${a}$ và $${b}$:<br/>${Math.floor(a / 10) !== Math.floor(b / 10) ? `Hàng chục: $${Math.floor(a / 10)} ${Math.floor(a / 10) > Math.floor(b / 10) ? ">" : "<"} ${Math.floor(b / 10)}$.` : `Hàng chục bằng nhau ($${Math.floor(a / 10)}$), so sánh hàng đơn vị: $${a % 10} ${a % 10 > b % 10 ? ">" : "<"} ${b % 10}$.`}<br/>Do đó, $${a}$ ${a > b ? "lớn hơn" : "nhỏ hơn"} $${b}$, điền dấu thích hợp là **${correctSign}**.`;
                tip = "So sánh hàng chục trước nhé, nếu hàng chục lớn hơn thì số đó lớn hơn luôn.";
                break;
            }

            case "l1-so-sanh-so-100-d2": {
                const nums = [];
                while (nums.length < 3) {
                    const r = this.randomInt(10, 99);
                    if (!nums.includes(r)) nums.push(r);
                }
                const isAscending = this.randomInt(0, 1) === 1;
                questionText = `Sắp xếp các số $${nums.join(', ')}$ theo thứ tự từ ${isAscending ? "bé đến lớn" : "lớn đến bé"}:`;
                
                const sorted = [...nums].sort((x, y) => isAscending ? x - y : y - x);
                const correctStr = sorted.join('; ');
                
                const w1 = [...nums].sort((x, y) => isAscending ? y - x : x - y).join('; ');
                const w2 = [nums[1], nums[0], nums[2]].join('; ');
                const w3 = [nums[2], nums[1], nums[0]].join('; ');

                const optSet = this.createOptions(correctStr, [w1, w2, w3]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = ["So sánh hàng chục của các số để tìm số bé nhất/lớn nhất trước."];
                solutionHtml = `Sắp xếp các số theo thứ tự từ ${isAscending ? "bé đến lớn" : "lớn đến bé"} ta được:<br/>**${correctStr}**.`;
                tip = "So sánh cẩn thận hàng chục nhé con.";
                break;
            }

            case "l1-bang-so-100-d1": {
                const variant = this.randomInt(1, 2);
                if (variant === 1) { // Số liền trước, số liền sau
                    const a = this.randomInt(11, 98);
                    const isBefore = this.randomInt(0, 1) === 1;
                    questionText = `Số liền ${isBefore ? "trước" : "sau"} của số $${a}$ là số nào?`;
                    const ans = isBefore ? a - 1 : a + 1;
                    const optSet = this.createOptions(ans, [a, isBefore ? a - 2 : a + 2, isBefore ? a + 1 : a - 1]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = `Số liền ${isBefore ? "trước" : "sau"} của $${a}$ là: $${a} ${isBefore ? "-" : "+"} 1 = ${ans}$.`;
                } else { // Dãy số quy luật đếm thêm
                    const start = this.randomInt(10, 50);
                    const step = this.randomInt(1, 2) === 1 ? 5 : 10;
                    questionText = `Điền số tiếp theo vào dãy số sau: $${start}, ${start + step}, ${start + step * 2}, \\square$`;
                    const ans = start + step * 3;
                    const optSet = this.createOptions(ans, [ans - step, ans + step, ans + 2]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = `Quy luật của dãy số là cộng thêm $${step}$ vào số đứng trước.<br/>Số tiếp theo điền vào ô trống là: $${start + step * 2} + ${step} = ${ans}$.`;
                }
                hints = ["Nhớ đếm thêm hoặc bớt đi theo quy luật dãy số."];
                tip = "Số liền trước bé hơn 1 đơn vị, số liền sau lớn hơn 1 đơn vị.";
                break;
            }

            case "l1-luyen-tap-c6-d1": {
                const sub = this.randomInt(1, 2);
                if (sub === 1) return this.generateQuestion("l1-so-sanh-so-100-d1");
                else return this.generateQuestion("l1-so-hai-chu-so-d1");
            }

            // ================= CHƯƠNG 7: ĐỘ DÀI VÀ ĐO ĐỘ DÀI =================
            case "l1-dai-ngan-d1": {
                const lenA = this.randomInt(5, 12);
                let lenB = this.randomInt(5, 12);
                while (lenB === lenA) lenB = this.randomInt(5, 12);
                
                const variant = this.randomInt(1, 2);
                if (variant === 1) { // Hỏi dài hơn
                    questionText = `Bút chì A dài $${lenA} cm$, bút chì B dài $${lenB} cm$. Hỏi chiếc bút chì nào dài hơn?`;
                    const correctStr = lenA > lenB ? "Bút chì A" : "Bút chì B";
                    const optSet = this.createOptions(correctStr, [lenA > lenB ? "Bút chì B" : "Bút chì A", "Hai bút dài bằng nhau", "Không so sánh được"]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = `So sánh độ dài: Vì $${Math.max(lenA, lenB)} cm > ${Math.min(lenA, lenB)} cm$ nên **${correctStr}** dài hơn.`;
                } else { // Hỏi ngắn hơn
                    questionText = `Thước kẻ A dài $${lenA} cm$, thước kẻ B dài $${lenB} cm$. Hỏi thước kẻ nào ngắn hơn?`;
                    const correctStr = lenA < lenB ? "Thước kẻ A" : "Thước kẻ B";
                    const optSet = this.createOptions(correctStr, [lenA < lenB ? "Thước kẻ B" : "Thước kẻ A", "Hai thước dài bằng nhau", "Không so sánh được"]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = `So sánh độ dài: Vì $${Math.min(lenA, lenB)} cm < ${Math.max(lenA, lenB)} cm$ nên **${correctStr}** ngắn hơn.`;
                }
                hints = ["Số đo xăng-ti-mét nào lớn hơn thì vật đó dài hơn."];
                tip = "Nhớ chú ý kỹ xem đề hỏi vật nào DÀI HƠN hay NGẮN HƠN nhé.";
                break;
            }

            case "l1-don-vi-do-d1": {
                // Đọc độ dài
                const len = this.randomInt(2, 9);
                questionText = `Đặt một cây bút chì thẳng dọc theo thước kẻ, đầu bút chì bắt đầu từ vạch số $0$ và đầu nhọn của bút chỉ vào vạch số $${len}$ trên thước. Hỏi bút chì dài bao nhiêu xăng-ti-mét?`;
                const correctStr = `$${len} cm$`;
                const optSet = this.createOptions(correctStr, [`$${len - 1} cm$`, `$${len + 1} cm$`, `$${len} m$`]);
                options = optSet.opts;
                correctIndex = optSet.idx;
                solutionHtml = `Đầu bút chì từ vạch số $0$ đến vạch số $${len}$ tương ứng độ dài của bút là **${len} cm**.`;
                hints = ["Khoảng cách giữa mỗi số trên thước là đúng 1 xăng-ti-mét (cm)."];
                tip = "Vạch bắt đầu phải là vạch số 0 thì mới đọc số chỉ ở đầu kia được con nhé.";
                break;
            }

            case "l1-thuc-hanh-do-d1": {
                // Phép cộng trừ kèm đơn vị cm
                const a = this.randomInt(5, 15);
                const b = this.randomInt(1, 4);
                const isPlus = this.randomInt(0, 1) === 1;
                const ans = isPlus ? a + b : a - b;
                
                questionText = `Tính kết quả: $${a} cm ${isPlus ? "+" : "-"} ${b} cm = ?$`;
                const correctStr = `$${ans} cm$`;
                const optSet = this.createOptions(correctStr, [
                    `$${ans - 1} cm$`,
                    `$${ans + 1} cm$`,
                    `$${ans}$`
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = ["Thực hiện cộng hoặc trừ các con số bình thường rồi viết thêm đơn vị cm vào sau kết quả."];
                solutionHtml = `Thực hiện phép tính với số: $${a} ${isPlus ? "+" : "-"} ${b} = ${ans}$.<br/>Viết thêm đơn vị $cm$: **${ans} cm**.`;
                tip = "Kết quả bắt buộc phải có đơn vị cm ở đằng sau nhé.";
                break;
            }

            case "l1-luyen-tap-c7-d1": {
                // So sánh số đo độ dài
                const a = this.randomInt(5, 12);
                const b = this.randomInt(1, 5);
                const val1 = a + b;
                const val2 = this.randomInt(5, 18);

                questionText = `So sánh: $${a} cm + ${b} cm$ ... $${val2} cm$`;
                const correctSign = val1 > val2 ? "$>$" : (val1 < val2 ? "$<$" : "$=$");
                
                options = ["$>$", "$<$", "$=$", "Không có"];
                correctIndex = options.indexOf(correctSign);

                hints = [
                    `Tính tổng vế trái trước: $${a} cm + ${b} cm = ${val1} cm$.`,
                    `So sánh số $${val1}$ với số $${val2}$.`
                ];
                solutionHtml = `Ta có:<br/>Vế trái: $${a} cm + ${b} cm = ${val1} cm$<br/>Vế phải: $${val2} cm$<br/>Vì $${val1} cm ${val1 > val2 ? ">" : (val1 < val2 ? "<" : "=")} ${val2} cm$ nên điền dấu thích hợp là **${correctSign}**.`;
                tip = "Tính tổng vế trái ra nháp trước khi so sánh nhé.";
                break;
            }

            // ================= CHƯƠNG 8: CỘNG TRỪ PHẠM VI 100 (KHÔNG NHỚ) =================
            case "l1-cong-2cs-1cs-d1": {
                const chuc = this.randomInt(2, 9);
                const donVi = this.randomInt(0, 5);
                const a = chuc * 10 + donVi;
                const b = this.randomInt(1, 9 - donVi);
                const ans = a + b;

                questionText = `Kết quả của phép tính: $${a} + ${b} = ?$`;
                const optSet = this.createOptions(ans, [ans - 10, ans + 1, ans - 1]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = ["Cộng hàng đơn vị với số đó: lấy hàng đơn vị cộng số đó, giữ nguyên hàng chục."];
                solutionHtml = `Đặt tính rồi tính:<br/>Hàng đơn vị: $${donVi} + ${b} = ${donVi + b}$<br/>Hàng chục giữ nguyên là $${chuc}$<br/>Vậy: $${a} + ${b} = ${ans}$.`;
                tip = "Đây là phép cộng không nhớ, rất dễ tính nhẩm bằng cách cộng hàng đơn vị.";
                break;
            }

            case "l1-cong-2cs-2cs-d1": {
                const chuc1 = this.randomInt(1, 8);
                const donVi1 = this.randomInt(0, 8);
                const chuc2 = this.randomInt(1, 9 - chuc1);
                const donVi2 = this.randomInt(0, 9 - donVi1);
                
                const a = chuc1 * 10 + donVi1;
                const b = chuc2 * 10 + donVi2;
                const ans = a + b;

                questionText = `Đặt tính rồi tính kết quả phép cộng: $${a} + ${b} = ?$`;
                const optSet = this.createOptions(ans, [ans + 10, ans - 10, ans + 1]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = [
                    "Cộng hàng đơn vị: đơn vị cộng đơn vị.",
                    "Cộng hàng chục: chục cộng chục."
                ];
                solutionHtml = `Thực hiện cộng từ phải sang trái:<br/>Đơn vị: $${donVi1} + ${donVi2} = ${donVi1 + donVi2}$<br/>Chục: $${chuc1} + ${chuc2} = ${chuc1 + chuc2}$<br/>Kết quả: $${a} + ${b} = ${ans}$.`;
                tip = "Nhớ cộng hàng đơn vị trước rồi mới cộng hàng chục nhé.";
                break;
            }

            case "l1-cong-2cs-2cs-d2": {
                // Ô trống cộng 2 chữ số
                const chuc1 = this.randomInt(1, 7);
                const donVi1 = this.randomInt(0, 7);
                const a = chuc1 * 10 + donVi1;
                
                const chuc2 = this.randomInt(1, 8 - chuc1);
                const donVi2 = this.randomInt(0, 8 - donVi1);
                const missing = chuc2 * 10 + donVi2;
                
                const ans = a + missing;

                questionText = `Điền số thích hợp vào ô trống: $${a} + \\square = ${ans}$`;
                const optSet = this.createOptions(missing, [missing + 10, (missing - 10 <= 0) ? missing + 20 : missing - 10, missing + 1]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = [`Thực hiện phép tính ngược lấy kết quả trừ số đã biết: $${ans} - ${a}$.`];
                solutionHtml = `Ta lấy: $${ans} - ${a} = ${missing}$ (trừ đơn vị: $${ans % 10} - ${donVi1} = ${donVi2}$, trừ chục: $${Math.floor(ans / 10)} - ${chuc1} = ${chuc2}$).<br/>Số cần tìm là **${missing}**.`;
                tip = "Trừ hàng đơn vị trước rồi đến trừ hàng chục để ra từng chữ số của ô trống nhé.";
                break;
            }

            case "l1-tru-2cs-1cs-d1": {
                const chuc = this.randomInt(2, 9);
                const donVi = this.randomInt(1, 9);
                const a = chuc * 10 + donVi;
                const b = this.randomInt(1, donVi);
                const ans = a - b;

                questionText = `Kết quả của phép tính: $${a} - ${b} = ?$`;
                const optSet = this.createOptions(ans, [ans - 1, ans + 1, ans - 10]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = ["Lấy chữ số hàng đơn vị trừ đi số đó, giữ nguyên hàng chục."];
                solutionHtml = `Thực hiện phép trừ:<br/>Hàng đơn vị: $${donVi} - ${b} = ${donVi - b}$<br/>Hàng chục giữ nguyên là $${chuc}$<br/>Vậy: $${a} - ${b} = ${ans}$.`;
                tip = "Đây là phép trừ không nhớ trong phạm vi 100.";
                break;
            }

            case "l1-tru-2cs-2cs-d1": {
                const chuc1 = this.randomInt(3, 9);
                const donVi1 = this.randomInt(1, 9);
                const chuc2 = this.randomInt(1, chuc1 - 1);
                const donVi2 = this.randomInt(0, donVi1);

                const a = chuc1 * 10 + donVi1;
                const b = chuc2 * 10 + donVi2;
                const ans = a - b;

                questionText = `Đặt tính rồi tính kết quả phép trừ: $${a} - ${b} = ?$`;
                const optSet = this.createOptions(ans, [ans + 10, ans - 10, ans + 1]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = [
                    "Trừ đơn vị cho đơn vị: đơn vị trước.",
                    "Trừ chục cho chục: chục sau."
                ];
                solutionHtml = `Thực hiện trừ từ pointer sang trái:<br/>Đơn vị: $${donVi1} - ${donVi2} = ${donVi1 - donVi2}$<br/>Chục: $${chuc1} - ${chuc2} = ${chuc1 - chuc2}$<br/>Kết quả: $${a} - ${b} = ${ans}$.`;
                tip = "Nhớ trừ hàng đơn vị trước rồi mới trừ hàng chục nhé con.";
                break;
            }

            case "l1-tru-2cs-2cs-d2": {
                // Ô trống phép trừ 2 chữ số
                const chuc1 = this.randomInt(4, 9);
                const donVi1 = this.randomInt(2, 9);
                const a = chuc1 * 10 + donVi1;

                const chuc2 = this.randomInt(1, chuc1 - 2);
                const donVi2 = this.randomInt(1, donVi1 - 1);
                const missing = chuc2 * 10 + donVi2;
                
                const ans = a - missing;

                const variant = this.randomInt(1, 2);
                if (variant === 1) { // Số trừ chưa biết
                    questionText = `Điền số thích hợp vào ô trống: $${a} - \\square = ${ans}$`;
                    const optSet = this.createOptions(missing, [missing + 10, (missing - 10 <= 0) ? missing + 20 : missing - 10, missing + 1]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    hints = [`Lấy số bị trừ trừ đi kết quả: $${a} - ${ans}$.`];
                    solutionHtml = `Số thích hợp điền vào ô trống là: $${a} - ${ans} = ${missing}$.`;
                } else { // Số bị trừ chưa biết
                    questionText = `Điền số thích hợp vào ô trống: $\\square - ${missing} = ${ans}$`;
                    const optSet = this.createOptions(a, [a + 10, a - 10, a + 1]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    hints = [`Lấy kết quả cộng với số trừ: $${ans} + ${missing}$.`];
                    solutionHtml = `Số thích hợp điền vào ô trống là: $${ans} + ${missing} = ${a}$.`;
                }
                tip = "Hãy suy nghĩ kỹ xem ô trống ở vị trí nào để chọn phép tính thích hợp nhé.";
                break;
            }

            case "l1-luyen-tap-c8-d1": {
                const a = this.randomInt(20, 50);
                const b = this.randomInt(10, 40);
                const val1 = a + b;

                const c = this.randomInt(60, 99);
                const d = this.randomInt(10, 50);
                const val2 = c - d;

                questionText = `Điền dấu thích hợp vào chỗ trống: $${a} + ${b}$ ... $${c} - ${d}$`;
                const correctSign = val1 > val2 ? "$>$" : (val1 < val2 ? "$<$" : "$=$");
                
                options = ["$>$", "$<$", "$=$", "Không có"];
                correctIndex = options.indexOf(correctSign);

                hints = [
                    `Tính tổng vế trái: $${a} + ${b} = ${val1}$.`,
                    `Tính hiệu vế phải: $${c} - ${d} = ${val2}$.`
                ];
                solutionHtml = `Ta có:<br/>Vế trái: $${a} + ${b} = ${val1}$<br/>Vế phải: $${c} - ${d} = ${val2}$<br/>Vì $${val1} ${val1 > val2 ? ">" : (val1 < val2 ? "<" : "=")} ${val2}$ nên điền dấu thích hợp là **${correctSign}**.`;
                tip = "Nhớ đặt tính ra nháp để tính chính xác kết quả 2 vế.";
                break;
            }

            case "l1-luyen-tap-c8-d2": {
                // Giải toán có lời văn 1 bước tính
                const a = this.randomInt(20, 50);
                const b = this.randomInt(10, 30);
                const variant = this.randomInt(1, 2);
                if (variant === 1) { // Bài toán phép cộng
                    questionText = `Vườn nhà bạn An có $${a}$ cây cam. Bố bạn An trồng thêm $${b}$ cây cam nữa. Hỏi hiện tại trong vườn nhà An có tất cả bao nhiêu cây cam?`;
                    const ans = a + b;
                    const optSet = this.createOptions(ans, [ans - 10, ans + 10, ans - 1]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = `Tóm tắt bài toán:<br/>- Ban đầu: $${a}$ cây<br/>- Trồng thêm: $${b}$ cây<br/><br/>Số cây cam có trong vườn nhà An là:<br/>$${a} + ${b} = ${ans}$ (cây).`;
                } else { // Bài toán phép trừ
                    questionText = `Một cửa hàng có $${a}$ quyển vở. Cửa hàng đã bán được $${b}$ quyển vở. Hỏi cửa hàng còn lại bao nhiêu quyển vở?`;
                    const ans = a - b;
                    const optSet = this.createOptions(ans, [ans + 10, ans - 10, ans - 1]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = `Tóm tắt bài toán:<br/>- Ban đầu: $${a}$ quyển<br/>- Đã bán: $${b}$ quyển<br/><br/>Cửa hàng còn lại số quyển vở là:<br/>$${a} - ${b} = ${ans}$ (quyển).`;
                }
                hints = ["Đọc kỹ xem đề bài hỏi 'tất cả bao nhiêu' (cộng) hay 'còn lại bao nhiêu' (trừ)."];
                tip = "Bán đi, bớt đi, cho đi là phép trừ; trồng thêm, mua thêm là phép cộng con nhé.";
                break;
            }

            // ================= CHƯƠNG 9: THỜI GIAN, GIỜ VÀ LỊCH =================
            case "l1-xem-gio-d1": {
                const hour = this.randomInt(1, 12);
                questionText = `Khi kim ngắn (kim chỉ giờ) chỉ thẳng vào số $${hour}$ và kim dài (kim chỉ phút) chỉ đúng vào số $12$ thì đồng hồ chỉ mấy giờ?`;
                const correctStr = `$${hour}$ giờ`;
                const optSet = this.createOptions(correctStr, [
                    `$${hour === 12 ? 1 : hour + 1}$ giờ`,
                    `$12$ giờ`,
                    `$${hour === 1 ? 12 : hour - 1}$ giờ`
                ]);
                options = optSet.opts;
                correctIndex = optSet.idx;
                solutionHtml = `Theo quy tắc xem giờ đúng:<br/>Khi kim dài chỉ số $12$, kim ngắn chỉ vào số nào thì đồng hồ chỉ đúng bấy nhiêu giờ.<br/>Ở đây kim ngắn chỉ vào số $${hour}$ nên là **${hour} giờ**.`;
                hints = ["Kim ngắn chỉ giờ, kim dài chỉ phút. Kim dài chỉ số 12 là giờ đúng."];
                tip = "Quan sát thật kỹ số mà kim ngắn đang chỉ nhé con.";
                break;
            }

            case "l1-ngay-trong-tuan-d1": {
                const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];
                const curIdx = this.randomInt(1, 5); // Chọn từ Thứ Ba đến Thứ Bảy để tránh biên đầu cuối dễ lỗi
                const today = days[curIdx];
                const yesterday = days[curIdx - 1];
                const tomorrow = days[curIdx + 1];

                const variant = this.randomInt(1, 2);
                if (variant === 1) {
                    questionText = `Nếu hôm nay là ${today}, thì ngày mai là thứ mấy trong tuần?`;
                    const optSet = this.createOptions(tomorrow, [yesterday, days[(curIdx + 2) % 7], days[(curIdx + 3) % 7]]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = `Thứ tự các ngày trong tuần: ... $\\rightarrow$ ${yesterday} $\\rightarrow$ ${today} $\\rightarrow$ **${tomorrow}**.<br/>Vậy ngày mai là **${tomorrow}**.`;
                } else {
                    questionText = `Nếu hôm nay là ${today}, thì hôm qua là thứ mấy trong tuần?`;
                    const optSet = this.createOptions(yesterday, [tomorrow, days[(curIdx - 2 + 7) % 7], days[(curIdx + 2) % 7]]);
                    options = optSet.opts;
                    correctIndex = optSet.idx;
                    solutionHtml = `Thứ tự các ngày trong tuần: ... $\\rightarrow$ **${yesterday}** $\\rightarrow$ ${today} $\\rightarrow$ ${tomorrow}.<br/>Vậy hôm qua là **${yesterday}**.`;
                }
                hints = ["Học thuộc lòng 7 ngày trong tuần: Thứ Hai, Thứ Ba, Thứ Tư, Thứ Năm, Thứ Sáu, Thứ Bảy, Chủ Nhật."];
                tip = "Hôm qua là ngày đứng trước hôm nay, ngày mai là ngày đứng sau hôm nay.";
                break;
            }

            case "l1-thuc-hanh-lich-d1": {
                // Đọc lịch block
                const dayNum = this.randomInt(1, 28);
                const dayOfWeek = this.randomInt(0, 6);
                const dowStr = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"][dayOfWeek];
                
                questionText = `Tờ lịch block ghi: Ngày $${dayNum}$, ${dowStr}. Hỏi ngày liền sau của ngày này là ngày bao nhiêu và là thứ mấy?`;
                const nextDayNum = dayNum + 1;
                const nextDowStr = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"][(dayOfWeek + 1) % 7];
                const correctStr = `Ngày ${nextDayNum}, ${nextDowStr}`;
                
                const w1 = `Ngày ${dayNum - 1}, ${dowStr}`;
                const w2 = `Ngày ${nextDayNum}, ${dowStr}`;
                const w3 = `Ngày ${dayNum}, ${nextDowStr}`;

                const optSet = this.createOptions(correctStr, [w1, w2, w3]);
                options = optSet.opts;
                correctIndex = optSet.idx;

                hints = ["Ngày liền sau sẽ cộng thêm 1 vào số ngày, và thứ tiếp theo trong tuần."];
                solutionHtml = `Số ngày liền sau là: $${dayNum} + 1 = ${nextDayNum}$.<br/>Thứ liền sau của ${dowStr} là ${nextDowStr}.<br/>Vậy ngày liền sau là: **${correctStr}**.`;
                tip = "Chú ý tăng cả số ngày và đổi thứ tiếp theo nhé.";
                break;
            }

            case "l1-luyen-tap-c9-d1": {
                const sub = this.randomInt(1, 2);
                if (sub === 1) return this.generateQuestion("l1-xem-gio-d1");
                else return this.generateQuestion("l1-ngay-trong-tuan-d1");
            }

            // ================= CHƯƠNG 10: ÔN TẬP CUỐI NĂM =================
            case "l1-on-tap-cuoi-nam-10-d1": {
                const isPlus = this.randomInt(0, 1) === 1;
                if (isPlus) return this.generateQuestion("l1-cong-pham-vi-10-d2");
                else return this.generateQuestion("l1-tru-pham-vi-10-d2");
            }

            case "l1-on-tap-cuoi-nam-100-d1": {
                const typeRand = this.randomInt(1, 2);
                if (typeRand === 1) return this.generateQuestion("l1-cong-2cs-2cs-d1");
                else return this.generateQuestion("l1-tru-2cs-2cs-d1");
            }

            case "l1-on-tap-cuoi-nam-hinh-d1": {
                const typeRand = this.randomInt(1, 3);
                if (typeRand === 1) return this.generateQuestion("l1-hinh-phang-d1");
                else if (typeRand === 2) return this.generateQuestion("l1-hinh-khoi-d1");
                else return this.generateQuestion("l1-dai-ngan-d1");
            }

            case "l1-on-tap-chung-cuoi-nam-d1": {
                // Tổng hợp đề cuối năm kì 2
                const typeRand = this.randomInt(1, 4);
                if (typeRand === 1) return this.generateQuestion("l1-luyen-tap-c8-d1");
                else if (typeRand === 2) return this.generateQuestion("l1-luyen-tap-c8-d2");
                else if (typeRand === 3) return this.generateQuestion("l1-xem-gio-d1");
                else return this.generateQuestion("l1-so-sanh-so-100-d2");
            }

            case "l1-on-tap-chung-cuoi-nam-d2": {
                // Đề khảo sát logic tư duy cuối năm
                return this.generateQuestion("l1-luyen-tap-c1-d2");
            }

            default:
                // Trả về câu hỏi mặc định đề phòng lỗi dạng bài
                questionText = "Số nào dưới đây lớn nhất trong các số sau: $3, 7, 5, 2$?";
                options = ["$3$", "$7$", "$5$", "$2$"];
                correctIndex = 1;
                hints = ["So sánh các số trên tia số từ bé đến lớn."];
                solutionHtml = "Số lớn nhất là số **7**.";
                tip = "Hãy làm bài cẩn thận nhé.";
                break;
        }

        return {
            questionText,
            options,
            correctIndex,
            hints,
            solutionHtml,
            tip
        };
    }
};

// Đăng ký toàn cục
if (typeof window !== 'undefined') {
    window.questionsL1 = questionsL1;
}
if (typeof module !== 'undefined') {
    module.exports = questionsL1;
}
