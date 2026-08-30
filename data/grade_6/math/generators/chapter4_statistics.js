/**
 * GRADE 6 MATH - CHAPTER 4: THỐNG KÊ & XÁC SUẤT THỰC NGHIỆM
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
            case "thu-thap-du-lieu": {
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        questionText = `Để khảo sát môn thể thao yêu thích của các bạn lớp 6A, bạn lớp trưởng ghi lại danh sách: <i>Bóng đá, Bóng rổ, Bóng đá, Cầu lông, Bóng bàn, Cầu lông, Bóng đá</i>. Dữ liệu này thuộc loại nào?`;
                        options = [`Dữ liệu không phải là số (dữ liệu chữ)`, `Dữ liệu là số (số liệu)`, `Dữ liệu hình ảnh`, `Dữ liệu âm thanh`];
                        self.shuffle(options);
                        hints = [
                            `Hãy xem các phần tử trong danh sách là chữ hay số.`,
                            `Bóng đá, Cầu lông, Bóng rổ... là các từ ngữ chỉ tên môn thể thao.`
                        ];
                        solutionHtml = `Dữ liệu ghi lại các môn thể thao yêu thích (Bóng đá, Cầu lông...) là các chữ/từ ngữ, nên thuộc loại dữ liệu không phải là số (dữ liệu chữ).`;
                    } else {
                        questionText = `Để thống kê điểm thi giữa kỳ môn Toán của tổ 1, bạn tổ trưởng ghi lại dãy số: $8; 9; 10; 7; 8; 6; 9$. Dữ liệu này thuộc loại nào?`;
                        options = [`Dữ liệu là số (số liệu)`, `Dữ liệu không phải là số (dữ liệu chữ)`, `Dữ liệu hình ảnh`, `Dữ liệu âm thanh`];
                        self.shuffle(options);
                        hints = [
                            `Hãy quan sát các phần tử trong danh sách thu được.`,
                            `Các giá trị $8; 9; 10...$ là các con số cụ thể biểu thị điểm số.`
                        ];
                        solutionHtml = `Dãy dữ liệu thu được gồm các con số cụ thể ($8; 9; 10...$) biểu thị điểm số, do đó đây là dữ liệu là số (số liệu).`;
                    }
                    tip = "Dữ liệu chữ gồm các từ ngữ mô tả; dữ liệu số (số liệu) gồm các con số thể hiện phép đo hoặc đếm.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        questionText = `Bình Minh điều tra nhiệt độ (đơn vị $^\\circ$C) lúc 12 giờ trưa từ thứ Hai đến thứ Sáu tuần trước và ghi lại: $32; 33; 35; 32; 34$. Trong các dữ liệu này, đâu là dữ liệu không hợp lý?`;
                        options = [`Không có dữ liệu nào không hợp lý`, `Nhiệt độ $35^\\circ$C`, `Nhiệt độ $32^\\circ$C`, `Tất cả các số liệu đều không hợp lý`];
                        self.shuffle(options);
                        hints = [
                            `Nhiệt độ thời tiết thực tế ở Việt Nam có thể dao động từ 32 đến 35 độ C vào mùa hè không?`,
                            `Các con số 32, 33, 35, 34 hoàn toàn nằm trong khoảng nhiệt độ bình thường thực tế lúc trưa.`
                        ];
                        solutionHtml = `Các nhiệt độ $32; 33; 35; 34$ đều là các số thực tế phản ánh nhiệt độ thời tiết lúc trưa mùa hè tại Việt Nam, nên không có dữ liệu nào không hợp lý.`;
                    } else {
                        const h = self.randomInt(135, 155);
                        const hErr = self.randomInt(240, 260);
                        questionText = `Điều tra về chiều cao (đơn vị cm) của 5 học sinh lớp 6, kết quả ghi lại là: $145; 150; ${hErr}; 148; 152$. Tìm số liệu không hợp lý trong danh sách và giải thích lý do?`;
                        options = [
                            `$${hErr}$ vì chiều cao học sinh lớp 6 bình thường không thể đạt tới $${hErr}\\text{ cm}$ (quá cao bất thường so với thực tế).`,
                            `$145$ vì học sinh lớp 6 phải cao ít nhất 150 cm.`,
                            `$150$ vì đây là số tròn chục.`,
                            `Không có dữ liệu nào không hợp lý.`
                        ];
                        self.shuffle(options);
                        hints = [
                            `Chiều cao thông thường của học sinh lớp 6 dao động từ khoảng 130 cm đến 165 cm.`,
                            `Hãy xem trong danh sách có số đo nào vượt quá xa chiều cao thực tế của con người hay không.`
                        ];
                        solutionHtml = `Chiều cao của học sinh lớp 6 thông thường dao động trong khoảng $130\\text{ cm} - 165\\text{ cm}$. Số liệu $${hErr}\\text{ cm}$ là quá lớn và bất thường đối với chiều cao thực tế của một học sinh lớp 6 hiện nay. Do đó, số liệu $${hErr}$ là không hợp lý.`;
                    }
                    tip = "Kiểm tra tính hợp lý của số liệu dựa trên các giới hạn thực tế khoa học và đời sống.";
                } else { // kho
                    if (variant === 1) {
                        questionText = `Bình Minh khảo sát số thành viên trong gia đình của một số bạn trong lớp, thu được dãy số liệu: $4; 5; 3; 4; 0; 6; 15; 4$. Tìm các số liệu không hợp lý và giải thích lý do?`;
                        options = [
                            `$0$ và $15$ vì số thành viên trong gia đình phải lớn hơn 0 và số lượng $15$ người trong một gia đình học sinh hiện nay là quá lớn bất thường.`,
                            `Chỉ có số $0$ không hợp lý vì gia đình phải có ít nhất 1 người.`,
                            `Chỉ có số $15$ không hợp lý vì gia đình chỉ nên có từ 3 đến 6 người.`,
                            `Tất cả số liệu đều hợp lý.`
                        ];
                        self.shuffle(options);
                        hints = [
                            `Một gia đình của bạn học sinh tối thiểu phải có chính bạn đó (tức là số thành viên phải lớn hơn hoặc bằng 1).`,
                            `Xem xét tính phổ biến thực tế của số lượng thành viên trong gia đình ở độ tuổi học sinh (thường từ 2 đến 8 người, số lượng 15 người là quá lớn bất thường).`
                        ];
                        solutionHtml = `Số thành viên trong gia đình phải lớn hơn 0 vì tối thiểu gia đình phải có chính bạn học sinh đó, nên số $0$ là không hợp lý.<br>Đồng thời, số lượng $15$ thành viên trong một gia đình học sinh hiện nay là cực kỳ hiếm và quá lớn bất thường so với thực tế đời sống xã hội. Do đó, các số liệu không hợp lý là $0$ và $15$.`;
                    } else {
                        questionText = `Khảo sát điểm kiểm tra môn Tiếng Anh (thang điểm 10) của tổ 2 thu được kết quả: $7,5; 8,0; 11,5; 9,0; -1,0; 10,0$. Hãy tìm tất cả các dữ liệu không hợp lý.`;
                        options = [
                            `$11,5$ và $-1,0$ vì điểm số thang điểm 10 không thể lớn hơn 10 hoặc nhỏ hơn 0.`,
                            `Chỉ có $-1,0$ vì điểm số không thể là số âm.`,
                            `Chỉ có $11,5$ vì điểm số tối đa chỉ là 10.`,
                            `Tất cả số liệu đều hợp lý.`
                        ];
                        self.shuffle(options);
                        hints = [
                            `Thang điểm kiểm tra chuẩn trong giáo dục Việt Nam là thang điểm 10.`,
                            `Điểm số hợp lý phải nằm trong đoạn từ $0$ đến $10$. Hãy tìm những số nằm ngoài đoạn này.`
                        ];
                        solutionHtml = `Điểm số kiểm tra theo thang điểm 10 bắt buộc phải nằm trong khoảng từ $0$ đến $10$.<br>- Số $11,5 > 10$ là không hợp lý.<br>- Số $-1,0 < 0$ là không hợp lý.<br>Vậy các dữ liệu không hợp lý là $11,5$ và $-1,0$.`;
                    }
                    tip = "Phát hiện số liệu không hợp lý bằng cách đối chiếu với thang đo chuẩn và khoảng giới hạn thực tế của đối tượng.";
                }
                break;
            }
            case "bang-thong-ke-bieu-do-tranh": {
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const factor = self.randomInt(3, 8);
                        const count = self.randomInt(4, 7);
                        const ans = factor * count;
                        questionText = `Trong một biểu đồ tranh, nếu một biểu tượng 🌸 đại diện cho $${factor}$ học sinh đạt điểm tốt. Hỏi nếu có $${count}$ biểu tượng 🌸 thì biểu diễn cho bao nhiêu học sinh đạt điểm tốt?`;
                        // Tránh trùng khi factor = count: dịch count thành count+1
                        const w4BieuDoTranh1 = (factor === count) ? count + 1 : count;
                        // Tránh trùng khi factor+count = ans hoặc factor+count = w4BieuDoTranh1
                        const w2BieuDoTranh1 = ((factor + count === ans) || (factor + count === w4BieuDoTranh1)) ? factor + count + 2 : factor + count;
                        options = [`$${ans}$ học sinh`, `$${w2BieuDoTranh1}$ học sinh`, `$${factor}$ học sinh`, `$${w4BieuDoTranh1}$ học sinh`];
                        self.shuffle(options);
                        hints = [
                            `Mỗi biểu tượng đại diện cho $${factor}$ học sinh.`,
                            `Lấy số lượng biểu tượng nhân với giá trị đại diện của một biểu tượng: $${count} \\cdot ${factor}$.`
                        ];
                        solutionHtml = `Vì mỗi biểu tượng 🌸 đại diện cho $${factor}$ học sinh, nên $${count}$ biểu tượng 🌸 biểu diễn cho số học sinh là:<br>$${count} \\cdot ${factor} = ${ans}$ học sinh.`;
                    } else {
                        const factor = [4, 5, 8, 10][self.randomInt(0, 3)];
                        const count = self.randomInt(3, 7);
                        const total = factor * count;
                        questionText = `Biểu đồ tranh biểu diễn số học sinh giỏi của lớp 6A. Chú giải ghi: mỗi biểu tượng 🌟 đại diện cho $${factor}$ học sinh. Hỏi để biểu diễn $${total}$ học sinh giỏi, ta cần vẽ bao nhiêu biểu tượng 🌟?`;
                        // Tránh trùng khi count === factor: dùng biểu thức tam phân
                        const w3BieuDo = (factor === count) ? factor + 2 : factor;
                        // Tránh trùng khi count+1 === total hoặc count+1 === w3BieuDo
                        const w4BieuDo = ((count + 1 === total) || (count + 1 === w3BieuDo)) ? count + 3 : count + 1;
                        options = [`$${count}$ biểu tượng`, `$${total}$ biểu tượng`, `$${w3BieuDo}$ biểu tượng`, `$${w4BieuDo}$ biểu tượng`];
                        self.shuffle(options);
                        hints = [
                            `Đây là bài toán chia ngược: lấy tổng số học sinh chia cho số học sinh mà một ngôi sao đại diện.`,
                            `Phép tính: $${total} : ${factor}$.`
                        ];
                        solutionHtml = `Để biểu diễn $${total}$ học sinh giỏi, số biểu tượng 🌟 cần vẽ là:<br>$${total} : ${factor} = ${count}$ biểu tượng.`;
                    }
                    tip = "Luôn đọc kỹ phần chú giải ở góc biểu đồ tranh để biết mỗi hình ảnh đại diện cho bao nhiêu đơn vị thực tế.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const mon = self.randomInt(2, 4);
                        const tue = self.randomInt(3, 5);
                        const factor = [5, 10, 20][self.randomInt(0, 2)];
                        const ans = (mon + tue) * factor;
                        questionText = `Biểu đồ tranh thống kê số lượng điện thoại bán ra của cửa hàng: thứ Hai có $${mon}$ hình 📱, thứ Ba có $${tue}$ hình 📱. Chú giải ghi: mỗi hình 📱 đại diện cho $${factor}$ chiếc điện thoại. Hỏi tổng số điện thoại cửa hàng bán được trong hai ngày đó là bao nhiêu?`;
                        options = [`$${ans}$ chiếc`, `$${mon + tue}$ chiếc`, `$${mon * factor}$ chiếc`, `$${tue * factor}$ chiếc`];
                        self.shuffle(options);
                        hints = [
                            `Tính tổng số hình 📱 vẽ trong cả hai ngày: $${mon} + ${tue} = ${mon + tue}$ hình.`,
                            `Nhân tổng số hình với số điện thoại đại diện cho mỗi hình: $(${mon} + ${tue}) \\cdot ${factor}$.`
                        ];
                        solutionHtml = `Tổng số hình vẽ 📱 trong cả hai ngày là:<br>$${mon} + ${tue} = ${mon + tue}$ hình.<br>Vì mỗi hình 📱 đại diện cho $${factor}$ chiếc điện thoại nên tổng số điện thoại bán được là:<br>$${mon + tue} \\cdot ${factor} = ${ans}$ chiếc điện thoại.`;
                    } else {
                        const aCount = self.randomInt(3, 5);
                        const bCount = aCount + self.randomInt(1, 3);
                        const factor = [10, 15, 20][self.randomInt(0, 2)];
                        const ans = (bCount - aCount) * factor;
                        questionText = `Biểu đồ tranh thống kê số lượng sách quyên góp: lớp 6A có $${aCount}$ hình 📚, lớp 6B có $${bCount}$ hình 📚. Biết mỗi hình 📚 đại diện cho $${factor}$ quyển sách. Lớp 6B quyên góp nhiều hơn lớp 6A bao nhiêu quyển sách?`;
                        options = [`$${ans}$ quyển`, `$${ans - factor}$ quyển`, `$${bCount - aCount}$ quyển`, `$${bCount * factor}$ quyển`];
                        self.shuffle(options);
                        hints = [
                            `Cách 1: Tính số hình nhiều hơn của lớp 6B so với lớp 6A: $${bCount} - ${aCount}$ hình, rồi nhân với $${factor}$.`,
                            `Cách 2: Tính số sách của từng lớp rồi trừ đi.`
                        ];
                        solutionHtml = `Lớp 6B có nhiều hơn lớp 6A số hình vẽ 📚 là:<br>$${bCount} - ${aCount} = ${bCount - aCount}$ hình.<br>Số sách lớp 6B quyên góp nhiều hơn lớp 6A là:<br>$${bCount - aCount} \\cdot ${factor} = ${ans}$ quyển sách.`;
                    }
                    tip = "So sánh hiệu số hình vẽ trước rồi nhân với chú giải sẽ giúp tính toán nhanh hơn.";
                } else { // kho
                    if (variant === 1) {
                        const t1 = self.randomInt(2, 4);
                        const t2 = t1 + self.randomInt(1, 2);
                        const factor = [6, 8, 10][self.randomInt(0, 2)];
                        const half = factor / 2;
                        const score1 = t1 * factor + half;
                        const score2 = t2 * factor;
                        const diff = Math.abs(score2 - score1);
                        const isMore = score2 > score1;
                        questionText = `Biểu đồ tranh biểu diễn số điểm 10 của lớp 6A: Tổ 1 có $${t1}$ hình 🌸 và thêm nửa hình 🌸; Tổ 2 có $${t2}$ hình 🌸. Chú giải ghi: mỗi hình 🌸 đại diện cho $${factor}$ điểm 10, nửa hình 🌸 đại diện cho $${half}$ điểm 10. Hỏi Tổ 2 nhiều hơn Tổ 1 bao nhiêu điểm 10?`;
                        options = [`$${diff}$ điểm 10`, `$${diff + 1}$ điểm 10`, `$${diff - 1}$ điểm 10`, `$${factor}$ điểm 10`];
                        self.shuffle(options);
                        hints = [
                            `Tính số điểm 10 của Tổ 1: $${t1}$ hình nguyên nhân với $${factor}$ cộng thêm $${half}$ điểm.`,
                            `Tính số điểm 10 của Tổ 2: $${t2}$ hình nguyên nhân với $${factor}$.`,
                            `Lấy số điểm của Tổ 2 trừ đi số điểm của Tổ 1.`
                        ];
                        solutionHtml = `Số điểm 10 của Tổ 1 là:<br>$${t1} \\cdot ${factor} + ${half} = ${score1}$ điểm 10.<br>Số điểm 10 của Tổ 2 là:<br>$${t2} \\cdot ${factor} = ${score2}$ điểm 10.<br>Tổ 2 nhiều hơn Tổ 1 số điểm 10 là:<br>$${score2} - ${score1} = ${diff}$ điểm 10.`;
                    } else {
                        const a = self.randomInt(2, 4);
                        const b = self.randomInt(2, 4);
                        const factor = [8, 12, 16][self.randomInt(0, 2)];
                        const half = factor / 2;
                        const total = (a + b) * factor + half;
                        questionText = `Biểu đồ tranh thống kê số lượng cây xanh tự làm của hai lớp: Lớp 6A vẽ $${a}$ hình nguyên 🌲 và 1 hình bán phần 🌲; Lớp 6B vẽ $${b}$ hình nguyên 🌲. Chú giải ghi: mỗi hình nguyên đại diện cho $${factor}$ cây, mỗi hình bán phần (nửa hình) đại diện cho $${half}$ cây. Tính tổng số cây trồng được của cả hai lớp.`;
                        options = [`$${total}$ cây`, `$${(a + b) * factor}$ cây`, `$${total - half}$ cây`, `$${total + half}$ cây`];
                        self.shuffle(options);
                        hints = [
                            `Đếm tổng số hình nguyên của cả hai lớp: $${a} + ${b} = ${a+b}$ hình.`,
                            `Tính số cây từ các hình nguyên: $${a+b} \\cdot ${factor}$.`,
                            `Cộng thêm số cây của 1 hình bán phần là $${half}$ cây.`
                        ];
                        solutionHtml = `Tổng số hình nguyên 🌲 vẽ được của cả hai lớp là: $${a} + ${b} = ${a+b}$ hình.<br>Số cây từ các hình nguyên này là: $${a+b} \\cdot ${factor} = ${(a+b)*factor}$ cây.<br>Cộng thêm $${half}$ cây từ hình bán phần của lớp 6A, tổng số cây trồng được của cả hai lớp là:<br>${(a+b)*factor} + ${half} = ${total}$ cây.`;
                    }
                    tip = "Chú ý kỹ sự khác biệt giữa ký hiệu đầy đủ (hình nguyên) và ký hiệu bán phần (nửa hình) trong biểu đồ tranh.";
                }
                break;
            }
            case "bieu-do-cot": {
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = self.randomInt(30, 45);
                        const b = self.randomInt(15, 25);
                        const c = self.randomInt(20, 29);
                        const maxVal = Math.max(a, b, c);
                        const minVal = Math.min(a, b, c);
                        const diff = maxVal - minVal;
                        const clbMax = maxVal === a ? "Âm nhạc" : (maxVal === b ? "Mỹ thuật" : "Thể thao");
                        questionText = `Biểu đồ cột biểu diễn số học sinh tham gia các câu lạc bộ (CLB) của khối 6: CLB Âm nhạc có $${a}$ học sinh, CLB Mỹ thuật có $${b}$ học sinh, CLB Thể thao có $${c}$ học sinh. CLB nào có số học sinh tham gia đông nhất và đông hơn CLB ít nhất bao nhiêu học sinh?`;
                        // Tránh trùng khi diff = minVal (option 1 và option 4 cùng là clbMax, đông hơn X)
                        const w4MinVal = (diff === minVal) ? minVal + 1 : minVal;
                        options = [
                            `CLB ${clbMax} đông nhất, đông hơn ${diff} học sinh`,
                            `CLB ${clbMax} đông nhất, đông hơn ${maxVal} học sinh`,
                            `CLB Thể thao đông nhất, đông hơn ${diff} học sinh`,
                            `CLB Âm nhạc đông nhất, đông hơn ${w4MinVal} học sinh`
                        ];
                        self.shuffle(options);
                        hints = [
                            `So sánh số lượng học sinh tham gia của 3 câu lạc bộ để tìm câu lạc bộ đông nhất ($${maxVal}$ học sinh) và ít nhất ($${minVal}$ học sinh).`,
                            `Tính hiệu số lượng học sinh đông nhất và ít nhất: $${maxVal} - ${minVal}$.`
                        ];
                        solutionHtml = `Số lượng học sinh tham gia các CLB lần lượt là: Âm nhạc ($${a}$), Mỹ thuật ($${b}$), Thể thao ($${c}$).<br>- CLB đông nhất là CLB **${clbMax}** với $${maxVal}$ học sinh.<br>- CLB ít nhất có số học sinh tham gia là $${minVal}$ học sinh.<br>Tập hợp số lượng học sinh đông nhất hơn ít nhất là:<br>$${maxVal} - ${minVal} = ${diff}$ học sinh.`;
                    } else {
                        const comic = self.randomInt(25, 45);
                        const science = self.randomInt(15, 24);
                        questionText = `Trên biểu đồ cột biểu diễn số lượng sách trong thư viện lớp 6A: cột "Truyện tranh" có chiều cao tương ứng với số $${comic}$, cột "Sách khoa học" có chiều cao tương ứng với số $${science}$. Số lượng truyện tranh trong thư viện là bao nhiêu quyển?`;
                        options = [`$${comic}$ quyển`, `$${science}$ quyển`, `$${comic + science}$ quyển`, `$${comic * 10}$ quyển`];
                        self.shuffle(options);
                        hints = [
                            `Chiều cao của mỗi cột biểu diễn số lượng của đối tượng tương ứng.`,
                            `Đọc số ghi trên đỉnh cột "Truyện tranh" hoặc đối chiếu sang trục đứng.`
                        ];
                        solutionHtml = `Chiều cao của cột "Truyện tranh" đối chiếu sang trục đứng chỉ ra số lượng truyện tranh là $${comic}$ quyển.`;
                    }
                    tip = "Đối chiếu đỉnh cột sang trục đứng (trục tung) để tìm số liệu của đối tượng.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const jun = self.randomInt(10, 15) * 10;
                        const jul = self.randomInt(12, 18) * 10;
                        const aug = self.randomInt(14, 20) * 10;
                        const total = jun + jul + aug;
                        const avg = Math.round(total / 3);
                        questionText = `Một biểu đồ cột biểu diễn lượng mưa các tháng mùa mưa tại một địa phương: tháng 6 cột cao $${jun}\\text{ mm}$, tháng 7 cột cao $${jul}\\text{ mm}$, tháng 8 cột cao $${aug}\\text{ mm}$. Tính lượng mưa trung bình mỗi tháng trong 3 tháng này (làm tròn đến hàng đơn vị).`;
                        options = [`$${avg}\\text{ mm}$`, `$${total}\\text{ mm}$`, `$${avg - 10}\\text{ mm}$`, `$${avg + 5}\\text{ mm}$`];
                        self.shuffle(options);
                        hints = [
                            `Tính tổng lượng mưa của cả ba tháng: $${jun} + ${jul} + ${aug} = ${total}\\text{ mm}$.`,
                            `Lấy tổng lượng mưa chia cho 3 để tìm lượng mưa trung bình mỗi tháng.`
                        ];
                        solutionHtml = `Tổng lượng mưa của cả 3 tháng là:<br>$${jun} + ${jul} + ${aug} = ${total}\\text{ mm}$.<br>Lượng mưa trung bình mỗi tháng là:<br>$${total} : 3 \\approx ${avg}\\text{ mm}$.`;
                    } else {
                        const w1 = self.randomInt(60, 90);
                        const w2 = self.randomInt(70, 100);
                        const w3 = self.randomInt(80, 110);
                        const w4 = self.randomInt(65, 95);
                        const total = w1 + w2 + w3 + w4;
                        const avg = Math.round(total / 4);
                        questionText = `Biểu đồ cột biểu diễn số lượng sách bán được của một cửa hàng trong 4 tuần: tuần 1 bán $${w1}$ quyển, tuần 2 bán $${w2}$ quyển, tuần 3 bán $${w3}$ quyển, tuần 4 bán $${w4}$ quyển. Tính số sách bán được trung bình mỗi tuần (làm tròn đến hàng đơn vị).`;
                        options = [`$${avg}$ quyển`, `$${total}$ quyển`, `$${avg - 10}$ quyển`, `$${avg + 10}$ quyển`];
                        self.shuffle(options);
                        hints = [
                            `Tính tổng số sách bán được trong cả 4 tuần: $${w1} + ${w2} + ${w3} + ${w4}$.`,
                            `Lấy tổng chia cho 4 để tính số sách trung bình mỗi tuần.`
                        ];
                        solutionHtml = `Tổng số sách bán được trong 4 tuần là:<br>$${w1} + ${w2} + ${w3} + ${w4} = ${total}$ quyển.<br>Số sách bán được trung bình mỗi tuần là:<br>$${total} : 4 = ${total / 4} \\approx ${avg}$ quyển.`;
                    }
                    tip = "Tính trung bình cộng bằng cách lấy tổng tất cả số liệu chia cho số lượng đối tượng.";
                } else { // kho
                    if (variant === 1) {
                        const a = self.randomInt(2, 4); // số bạn điểm 7
                        const b = self.randomInt(3, 5); // số bạn điểm 8
                        const c = self.randomInt(2, 4); // số bạn điểm 9
                        const d = self.randomInt(1, 3); // số bạn điểm 10
                        const totalStudents = a + b + c + d;
                        const totalScore = a * 7 + b * 8 + c * 9 + d * 10;
                        const avg = (totalScore / totalStudents).toFixed(1).replace('.', ',');
                        questionText = `Biểu đồ cột biểu diễn kết quả điểm kiểm tra môn Toán của tổ 1: có $${a}$ bạn đạt điểm 7; $${b}$ bạn đạt điểm 8; $${c}$ bạn đạt điểm 9 và $${d}$ bạn đạt điểm 10. Tính điểm trung bình môn Toán của tổ 1 (làm tròn đến chữ số thập phân thứ nhất).`;
                        options = [`$${avg}$`, `$8,0$`, `$8,5$`, `$${(totalScore / totalStudents + 0.3).toFixed(1).replace('.', ',')}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`$${self.randomInt(7, 9)},${self.randomInt(0, 9)}$`);
                        }
                        self.shuffle(options);
                        hints = [
                            `Tính tổng điểm của cả tổ: lấy điểm số của mỗi nhóm nhân với số lượng bạn tương ứng rồi cộng lại.`,
                            `Tính tổng số học sinh của tổ 1: $${a} + ${b} + ${c} + ${d} = ${totalStudents}$ học sinh.`,
                            `Điểm trung bình bằng tổng điểm chia cho tổng số học sinh.`
                        ];
                        solutionHtml = `Tổng số điểm môn Toán của tổ 1 thu được là:<br>$(${a} \\cdot 7) + (${b} \\cdot 8) + (${c} \\cdot 9) + (${d} \\cdot 10) = ${a * 7} + ${b * 8} + ${c * 9} + ${d * 10} = ${totalScore}$ điểm.<br>Tổng số học sinh của tổ 1 là:<br>$${a} + ${b} + ${c} + ${d} = ${totalStudents}$ học sinh.<br>Điểm trung bình môn Toán của tổ 1 là:<br>$${totalScore} : ${totalStudents} \\approx ${avg}$ điểm.`;
                    } else {
                        const m2 = [80, 100, 120][self.randomInt(0, 2)];
                        const m3 = m2 === 80 ? 100 : (m2 === 100 ? 125 : 150); // tăng trưởng 25%
                        const ans = 25;
                        questionText = `Biểu đồ cột biểu diễn doanh thu một cửa hàng: tháng 2 đạt $${m2}$ triệu đồng, tháng 3 đạt $${m3}$ triệu đồng. Hỏi doanh thu tháng 3 tăng trưởng bao nhiêu phần trăm so với tháng 2?`;
                        options = [`$${ans}\\%$`, `$20\\%$`, `$30\\%$`, `$15\\%$`];
                        self.shuffle(options);
                        hints = [
                            `Tính số doanh thu tăng thêm của tháng 3 so với tháng 2: $${m3} - ${m2}$ triệu đồng.`,
                            `Tính tỉ số phần trăm của lượng doanh thu tăng thêm này so với doanh thu gốc của tháng 2: $\\frac{m_3 - m_2}{m_2} \\cdot 100\\%$.`
                        ];
                        solutionHtml = `Doanh thu tăng thêm của tháng 3 so với tháng 2 là:<br>$${m3} - ${m2} = ${m3 - m2}$ triệu đồng.<br>Tỉ lệ phần trăm tăng trưởng doanh thu tháng 3 so với tháng 2 là:<br>$\\frac{${m3 - m2}}{${m2}} \\cdot 100\\% = ${ans}\\%$.`;
                    }
                    tip = "Tỉ lệ phần trăm tăng trưởng bằng (Giá trị mới - Giá trị cũ) / Giá trị cũ nhân với 100%.";
                }
                break;
            }
            case "bieu-do-cot-kep": {
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const m1 = self.randomInt(16, 22);
                        const f1 = self.randomInt(18, 24);
                        const m2 = self.randomInt(17, 21);
                        const f2 = self.randomInt(17, 21);
                        const total1 = m1 + f1;
                        const total2 = m2 + f2;
                        const diff = Math.abs(total1 - total2);
                        let ans;
                        if (total1 === total2) {
                            ans = "Hai lớp bằng nhau";
                        } else if (total1 > total2) {
                            ans = `Lớp 6A đông hơn ${diff} học sinh`;
                        } else {
                            ans = `Lớp 6B đông hơn ${diff} học sinh`;
                        }
                        questionText = `Biểu đồ cột kép biểu diễn số học sinh nam và nữ của hai lớp 6A và 6B. Lớp 6A: nam $${m1}$ học sinh, nữ $${f1}$ học sinh. Lớp 6B: nam $${m2}$ học sinh, nữ $${f2}$ học sinh. Lớp nào có tổng số học sinh đông hơn và đông hơn bao nhiêu học sinh?`;
                        options = [
                            ans,
                            `Lớp 6A đông hơn ${total1} học sinh`,
                            `Lớp 6B đông hơn ${total2} học sinh`,
                            `Hai lớp bằng nhau`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`Lớp 6A đông hơn ${diff + 2} học sinh`);
                        }
                        // Removed inner shuffle
                        hints = [
                            `Tính tổng số học sinh lớp 6A bằng cách cộng số học sinh nam và nữ: $${m1} + ${f1}$.`,
                            `Tính tổng số học sinh lớp 6B: $${m2} + ${f2}$.`,
                            `So sánh hai tổng số học sinh và tìm hiệu chênh lệch: $|${total1} - ${total2}|$.`
                        ];
                        solutionHtml = `Tổng số học sinh lớp 6A là: $${m1} + ${f1} = ${total1}$ học sinh.<br>Tổng số học sinh lớp 6B là: $${m2} + ${f2} = ${total2}$ học sinh.<br>` +
                            (total1 === total2 ? `Vậy tổng số học sinh của hai lớp bằng nhau (đều bằng $${total1}$ học sinh).` : `Lớp ${total1 > total2 ? '6A' : '6B'} có tổng số học sinh đông hơn và đông hơn số học sinh là: $${Math.max(total1, total2)} - ${Math.min(total1, total2)} = ${diff}$ học sinh.`);
                    } else {
                        const goldA = self.randomInt(5, 10);
                        const silverA = self.randomInt(6, 12);
                        const goldB = self.randomInt(6, 11);
                        const silverB = self.randomInt(5, 10);
                        const totalA = goldA + silverA;
                        const totalB = goldB + silverB;
                        const diff = Math.abs(totalA - totalB);
                        let ans;
                        if (totalA === totalB) {
                            ans = "Hai đoàn bằng nhau";
                        } else {
                            ans = `Đoàn ${totalA > totalB ? 'A' : 'B'} nhiều hơn ${diff} huy chương`;
                        }
                        questionText = `Biểu đồ cột kép biểu diễn số huy chương Vàng và Bạc của hai đoàn thể thao A và B. Đoàn A: Vàng $${goldA}$ chiếc, Bạc $${silverA}$ chiếc. Đoàn B: Vàng $${goldB}$ chiếc, Bạc $${silverB}$ chiếc. Hỏi đoàn nào có tổng số huy chương (chỉ tính Vàng và Bạc) nhiều hơn và nhiều hơn bao nhiêu chiếc?`;
                        options = [
                            ans,
                            `Đoàn A nhiều hơn ${goldA} chiếc`,
                            `Đoàn B nhiều hơn ${goldB} chiếc`,
                            `Hai đoàn bằng nhau`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`Đoàn A nhiều hơn ${diff + 3} chiếc`);
                        }
                        // Removed inner shuffle
                        hints = [
                            `Tính tổng số huy chương của đoàn A: $${goldA} + ${silverA}$.`,
                            `Tính tổng số huy chương của đoàn B: $${goldB} + ${silverB}$.`,
                            `So sánh hai tổng số huy chương để đưa ra kết luận.`
                        ];
                        solutionHtml = `Tổng số huy chương của đoàn A là: $${goldA} + ${silverA} = ${totalA}$ huy chương.<br>Tổng số huy chương của đoàn B là: $${goldB} + ${silverB} = ${totalB}$ huy chương.<br>` +
                            (totalA === totalB ? `Vậy tổng số huy chương của hai đoàn bằng nhau.` : `Đoàn ${totalA > totalB ? 'A' : 'B'} có tổng số huy chương nhiều hơn và nhiều hơn số huy chương là: $${Math.max(totalA, totalB)} - ${Math.min(totalA, totalB)} = ${diff}$ chiếc.`);
                    }
                    tip = "Biểu đồ cột kép sử dụng các cột có màu sắc hoặc ký hiệu khác nhau đứng cạnh nhau để so sánh hai nhóm dữ liệu trong cùng một đối tượng.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const y1q1 = self.randomInt(10, 14) * 10;
                        const y1q2 = self.randomInt(12, 16) * 10;
                        const y2q1 = self.randomInt(12, 15) * 10;
                        const y2q2 = self.randomInt(15, 20) * 10;
                        const totalY1 = y1q1 + y1q2;
                        const totalY2 = y2q1 + y2q2;
                        const diff = totalY2 - totalY1;
                        questionText = `Biểu đồ cột kép thống kê số lượng điện thoại bán ra của cửa hàng trong hai năm: Năm 2024 (cột vàng): quý 1 bán $${y1q1}$ chiếc, quý 2 bán $${y1q2}$ chiếc. Năm 2025 (cột cam): quý 1 bán $${y2q1}$ chiếc, quý 2 bán $${y2q2}$ chiếc. Hỏi tổng số điện thoại bán ra trong hai quý đầu năm 2025 nhiều hơn năm 2024 bao nhiêu chiếc?`;
                        options = [`$${diff}$ chiếc`, `$${totalY1}$ chiếc`, `$${totalY2}$ chiếc`, `$${diff + 20}$ chiếc`];
                        // Removed inner shuffle
                        hints = [
                            `Tính tổng số điện thoại bán ra trong hai quý của năm 2024: $${y1q1} + ${y1q2} = ${totalY1}$ chiếc.`,
                            `Tính tổng số điện thoại bán ra trong hai quý của năm 2025: $${y2q1} + ${y2q2} = ${totalY2}$ chiếc.`,
                            `Lấy tổng của năm 2025 trừ đi tổng của năm 2024.`
                        ];
                        solutionHtml = `Tổng lượng điện thoại bán ra trong hai quý đầu năm 2024 là:<br>$${y1q1} + ${y1q2} = ${totalY1}$ chiếc.<br>Tổng lượng điện thoại bán ra trong hai quý đầu năm 2025 là:<br>$${y2q1} + ${y2q2} = ${totalY2}$ chiếc.<br>Số lượng năm 2025 nhiều hơn năm 2024 là:<br>$${totalY2} - ${totalY1} = ${diff}$ chiếc.`;
                    } else {
                        const a1 = self.randomInt(10, 15) * 10;
                        const a2 = self.randomInt(12, 18) * 10;
                        const b1 = self.randomInt(11, 16) * 10;
                        const b2 = self.randomInt(10, 17) * 10;
                        const totalA = a1 + a2;
                        const totalB = b1 + b2;
                        const diff = Math.abs(totalA - totalB);
                        const target = totalA > totalB ? "A" : "B";
                        const other = totalA > totalB ? "B" : "A";
                        questionText = `Biểu đồ cột kép biểu diễn số sản phẩm sản xuất được của hai phân xưởng A và B trong 2 tháng đầu năm. Phân xưởng A: tháng 1 sản xuất $${a1}$ sản phẩm, tháng 2 sản xuất $${a2}$ sản phẩm. Phân xưởng B: tháng 1 sản xuất $${b1}$ sản phẩm, tháng 2 sản xuất $${b2}$ sản phẩm. Hỏi tổng sản phẩm của phân xưởng nào nhiều hơn và nhiều hơn bao nhiêu sản phẩm?`;
                        options = [
                            `Phân xưởng ${target} nhiều hơn ${diff} sản phẩm`,
                            `Phân xưởng ${other} nhiều hơn ${diff} sản phẩm`,
                            `Phân xưởng ${target} nhiều hơn ${totalA} sản phẩm`,
                            `Hai phân xưởng sản xuất bằng nhau`
                        ];
                        // Removed inner shuffle
                        hints = [
                            `Tính tổng số sản phẩm của phân xưởng A trong cả 2 tháng: $${a1} + ${a2} = ${totalA}$.`,
                            `Tính tổng số sản phẩm của phân xưởng B trong cả 2 tháng: $${b1} + ${b2} = ${totalB}$.`,
                            `So sánh hai tổng số và tính chênh lệch: $|${totalA} - ${totalB}|$.`
                        ];
                        solutionHtml = `Tổng sản phẩm của phân xưởng A sản xuất được là:<br>$${a1} + ${a2} = ${totalA}$ sản phẩm.<br>Tổng sản phẩm của phân xưởng B sản xuất được là:<br>$${b1} + ${b2} = ${totalB}$ sản phẩm.<br>Phân xưởng ${target} sản xuất nhiều hơn phân xưởng ${other} và nhiều hơn số sản phẩm là:<br>$${Math.max(totalA, totalB)} - ${Math.min(totalA, totalB)} = ${diff}$ sản phẩm.`;
                    }
                    tip = "Đọc đúng cột và màu sắc tương ứng biểu diễn cho từng nhóm đối tượng trên biểu đồ cột kép.";
                } else { // kho
                    if (variant === 1) {
                        const bikeA = self.randomInt(10, 20);
                        const busA = self.randomInt(15, 25);
                        const bikeB = self.randomInt(15, 25);
                        const busB = self.randomInt(10, 20);
                        const totalBike = bikeA + bikeB;
                        const totalAll = bikeA + busA + bikeB + busB;
                        const percent = Math.round((totalBike / totalAll) * 100);
                        questionText = `Biểu đồ cột kép biểu diễn số học sinh đi xe đạp và xe buýt của hai lớp 6A và 6B. Lớp 6A: xe đạp $${bikeA}$ bạn, xe buýt $${busA}$ bạn. Lớp 6B: xe đạp $${bikeB}$ bạn, xe buýt $${busB}$ bạn. Tính tỉ số phần trăm số học sinh đi xe đạp của cả hai lớp trên tổng số học sinh đi học bằng cả hai phương tiện này (làm tròn đến hàng đơn vị).`;
                        options = [`$${percent}\\%$`, `$${percent - 3}\\%$`, `$${percent + 3}\\%$`, `$50\\%`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`$${self.randomInt(35, 65)}\\%`);
                        }
                        // Removed inner shuffle
                        hints = [
                            `Tính tổng số học sinh đi xe đạp của cả hai lớp: $${bikeA} + ${bikeB} = ${totalBike}$ học sinh.`,
                            `Tính tổng số học sinh đi học bằng cả hai phương tiện: $${bikeA} + ${busA} + ${bikeB} + ${busB} = ${totalAll}$ học sinh.`,
                            `Tỉ số phần trăm được tính bằng: $\\frac{\\text{Tổng học sinh đi xe đạp}}{\\text{Tổng số học sinh}} \\cdot 100\\%$.`
                        ];
                        solutionHtml = `Tổng số học sinh đi xe đạp của cả hai lớp là: $${bikeA} + ${bikeB} = ${totalBike}$ học sinh.<br>Tổng số học sinh đi học bằng cả hai phương tiện của cả hai lớp là: $${bikeA} + ${busA} + ${bikeB} + ${busB} = ${totalAll}$ học sinh.<br>Tỉ số phần trăm số học sinh đi xe đạp là:<br>$\\frac{${totalBike}}{${totalAll}} \\cdot 100\\% \\approx ${percent}\\%$.`;
                    } else {
                        const g1 = self.randomInt(10, 16);
                        const k1 = self.randomInt(12, 18);
                        const g2 = self.randomInt(12, 18);
                        const k2 = self.randomInt(8, 14);
                        const totalG = g1 + g2;
                        const totalAll = g1 + k1 + g2 + k2;
                        const percent = ((totalG / totalAll) * 100).toFixed(1).replace('.', ',');
                        questionText = `Biểu đồ cột kép biểu diễn số học sinh đạt học lực Giỏi và Khá của hai lớp 6A và 6B. Lớp 6A: Giỏi $${g1}$ bạn, Khá $${k1}$ bạn. Lớp 6B: Giỏi $${g2}$ bạn, Khá $${k2}$ bạn. Tính tỉ số phần trăm học sinh đạt học lực Giỏi của cả hai lớp trên tổng số học sinh đạt lực học Khá và Giỏi của cả hai lớp (làm tròn đến chữ số thập phân thứ nhất).`;
                        options = [
                            `$${percent}\\%$`,
                            `$50,0\\%$`,
                            `$${(totalG / totalAll * 100 - 3).toFixed(1).replace('.', ',')}\\%$`,
                            `$${(totalG / totalAll * 100 + 2).toFixed(1).replace('.', ',')}\\%$`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`$${self.randomInt(40, 60)},${self.randomInt(0, 9)}\\%$`);
                        }
                        // Removed inner shuffle
                        hints = [
                            `Tính tổng số học sinh đạt lực học Giỏi của cả hai lớp: $${g1} + ${g2} = ${totalG}$ học sinh.`,
                            `Tính tổng số học sinh Khá và Giỏi của cả hai lớp: $${g1} + ${k1} + ${g2} + ${k2} = ${totalAll}$ học sinh.`,
                            `Tỉ số phần trăm bằng: $\\frac{\\text{Tổng học sinh Giỏi}}{\\text{Tổng số học sinh}} \\cdot 100\\%$.`
                        ];
                        solutionHtml = `Tổng số học sinh đạt lực học Giỏi của cả hai lớp là: $${g1} + ${g2} = ${totalG}$ học sinh.<br>Tổng số học sinh Khá và Giỏi của cả hai lớp là: $${g1} + ${k1} + ${g2} + ${k2} = ${totalAll}$ học sinh.<br>Tỉ số phần trăm học sinh đạt lực học Giỏi của cả hai lớp là:<br>$\\frac{${totalG}}{${totalAll}} \\cdot 100\\% \\approx ${percent}\\%$.`;
                    }
                    tip = "Đọc kỹ yêu cầu đề bài để gom nhóm các giá trị đối tượng chính xác trước khi lập tỉ số phần trăm.";
                }
                break;
            }
            case "ket-qua-co-the": {
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const n = self.randomInt(5, 8);
                        questionText = `Bình Minh rút ngẫu nhiên một tấm thẻ từ một hộp chứa $${n}$ tấm thẻ đánh số liên tiếp từ $1$ đến $${n}$. Có bao nhiêu kết quả có thể xảy ra cho số ghi trên tấm thẻ rút được?`;
                        options = [`$${n}$ kết quả có thể`, `$2$ kết quả có thể`, `$1$ kết quả có thể`, `$${n * 2}$ kết quả có thể`];
                        // Removed inner shuffle
                        hints = [
                            `Hộp có $${n}$ tấm thẻ khác nhau được đánh số từ $1$ đến $${n}$.`,
                            `Mỗi lần rút thẻ sẽ cho ta đúng $1$ kết quả tương ứng với số ghi trên thẻ.`
                        ];
                        solutionHtml = `Vì hộp có $${n}$ tấm thẻ khác nhau được đánh số từ $1$ đến $${n}$, nên tập hợp các kết quả có thể xảy ra cho số ghi trên thẻ là: $\\\{1; 2; ...; ${n}\\\}$. Vậy có tất cả $${n}$ kết quả có thể xảy ra.`;
                    } else {
                        const colors = ["Đỏ", "Xanh", "Vàng", "Trắng", "Tím"];
                        self.shuffle(colors);
                        const n = self.randomInt(3, 4);
                        const chosenColors = colors.slice(0, n);
                        const colorsStr = chosenColors.join(", ");
                        questionText = `Trong hộp có các viên bi với các màu sắc sau: ${colorsStr}. Bình Minh lấy ngẫu nhiên 1 viên bi từ hộp. Có bao nhiêu kết quả có thể xảy ra đối với màu của viên bi lấy ra?`;
                        options = [`$${n}$ kết quả có thể`, `$2$ kết quả có thể`, `$1$ kết quả có thể`, `$${n + 1}$ kết quả có thể`];
                        // Removed inner shuffle
                        hints = [
                            `Tập hợp các kết quả có thể xảy ra là danh sách các màu sắc khác nhau của viên bi trong hộp.`,
                            `Đếm xem có bao nhiêu màu sắc khác nhau.`
                        ];
                        solutionHtml = `Các kết quả có thể xảy ra đối với màu của viên bi lấy ra là: ${colorsStr}. Do đó có tổng cộng $${n}$ kết quả có thể xảy ra.`;
                    }
                    tip = "Tổng số kết quả có thể xảy ra của một phép thử bằng tổng số đối tượng/phương án phân biệt tham gia phép thử.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        questionText = `Bình Minh gieo một con xúc xắc 6 mặt một lần. Trong các sự kiện sau, sự kiện nào là **chắc chắn xảy ra**?`;
                        options = [
                            `Gieo được mặt có số chấm nhỏ hơn $7$`,
                            `Gieo được mặt có số chấm bằng $6$`,
                            `Gieo được mặt có số chấm là số chẵn`,
                            `Gieo được mặt có số chấm lớn hơn $3$`
                        ];
                        // Removed inner shuffle
                        hints = [
                            `Con xúc xắc 6 mặt có số chấm từ 1 đến 6.`,
                            `Sự kiện chắc chắn xảy ra là sự kiện luôn xảy ra trong mọi kết quả có thể của phép thử.`
                        ];
                        solutionHtml = `Vì con xúc xắc chỉ có các mặt từ 1 đến 6 chấm nên bất kỳ lần gieo nào cũng sẽ cho số chấm nhỏ hơn 7. Do đó, sự kiện 'Gieo được mặt có số chấm nhỏ hơn 7' là **chắc chắn xảy ra**.`;
                    } else {
                        questionText = `Bình Minh gieo một con xúc xắc 6 mặt một lần. Trong các sự kiện sau, sự kiện nào là **không thể xảy ra**?`;
                        options = [
                            `Gieo được mặt có số chấm bằng $7$`,
                            `Gieo được mặt có số chấm là số lẻ`,
                            `Gieo được mặt có số chấm nhỏ hơn $7$`,
                            `Gieo được mặt có số chấm lớn hơn $2$`
                        ];
                        // Removed inner shuffle
                        hints = [
                            `Con xúc xắc 6 mặt chỉ gồm các mặt có số chấm từ 1 đến 6.`,
                            `Sự kiện không thể xảy ra là sự kiện không bao giờ xảy ra trong bất kỳ kết quả nào.`
                        ];
                        solutionHtml = `Vì con xúc xắc chỉ có các mặt từ 1 đến 6 chấm nên ta không bao giờ gieo được mặt có số chấm bằng 7. Do đó, sự kiện 'Gieo được mặt có số chấm bằng 7' là **không thể xảy ra**.`;
                    }
                    tip = "Sự kiện chắc chắn xảy ra luôn chứa mọi kết quả; sự kiện không thể xảy ra không chứa kết quả nào.";
                } else { // kho
                    if (variant === 1) {
                        questionText = `Trong hộp có 1 quả bóng Đỏ (Đ), 1 quả bóng Xanh (X), 1 quả bóng Vàng (V) và 1 quả bóng Trắng (T). Bình Minh lấy ra đồng thời 2 quả bóng từ hộp. Liệt kê tất cả các kết quả có thể xảy ra đối với màu của hai quả bóng lấy ra.`;
                        options = [
                            `$\\\{\\text{Đ, X}; \\text{Đ, V}; \\text{Đ, T}; \\text{X, V}; \\text{X, T}; \\text{V, T}\\\}$`,
                            `$\\\{\\text{Đ, Đ}; \\text{X, X}; \\text{V, V}; \\text{T, T}\\\}$`,
                            `$\\\{\\text{Đ, X}; \\text{Đ, V}; \\text{X, V}\\\}$`,
                            `$\\\{\\text{Đ, X, V, T}\\\}$`
                        ];
                        // Removed inner shuffle
                        hints = [
                            `Vì lấy đồng thời 2 quả bóng nên hai quả bóng không thể cùng màu (trong hộp chỉ có 1 quả mỗi màu).`,
                            `Liệt kê các cặp màu đôi một khác nhau ghép từ 4 màu Đ, X, V, T.`
                        ];
                        solutionHtml = `Các kết quả có thể xảy ra đối với màu của hai quả bóng lấy ra đồng thời là: Đỏ và Xanh (Đ, X); Đỏ và Vàng (Đ, V); Đỏ và Trắng (Đ, T); Xanh và Vàng (X, V); Xanh và Trắng (X, T); Vàng và Trắng (V, T).<br>Tập hợp các kết quả là: $\\\{\\text{Đ, X}; \\text{Đ, V}; \\text{Đ, T}; \\text{X, V}; \\text{X, T}; \\text{V, T}\\\}$.`;
                    } else {
                        questionText = `Tung đồng thời hai đồng xu cân đối và đồng chất (kí hiệu là đồng xu 1 và đồng xu 2). Kí hiệu S là mặt Sấp, N là mặt Ngửa. Hãy liệt kê tất cả các kết quả có thể xảy ra đối với mặt xuất hiện của hai đồng xu.`;
                        options = [
                            `$\\\{\\text{SS}; \\text{SN}; \\text{NS}; \\text{NN}\\\}$`,
                            `$\\\{\\text{SS}; \\text{NN}\\\}$`,
                            `$\\\{\\text{S}; \\text{N}\\\}$`,
                            `$\\\{\\text{SS}; \\text{SN}; \\text{NN}\\\}$`
                        ];
                        // Removed inner shuffle
                        hints = [
                            `Mỗi đồng xu khi tung có 2 kết quả là Sấp (S) hoặc Ngửa (N).`,
                            `Liệt kê các kết quả dưới dạng cặp kí tự: kí tự thứ nhất là mặt của đồng xu 1, kí tự thứ hai là mặt của đồng xu 2.`
                        ];
                        solutionHtml = `Mỗi kết quả có thể xảy ra được kí hiệu bằng một cặp chữ, chữ thứ nhất viết tắt cho mặt của đồng xu 1, chữ thứ hai viết tắt cho mặt của đồng xu 2.<br>Các kết quả có thể xảy ra là: hai đồng xu cùng Sấp (SS); đồng xu 1 Sấp và đồng xu 2 Ngửa (SN); đồng xu 1 Ngửa và đồng xu 2 Sấp (NS); hai đồng xu cùng Ngửa (NN).<br>Tập hợp các kết quả là: $\\\{\\text{SS}; \\text{SN}; \\text{NS}; \\text{NN}\\\}$.`;
                    }
                    tip = "Khi tung đồng thời hai vật phẩm phân biệt hoặc lấy đồng thời, hãy thiết lập cách liệt kê theo thứ tự để tránh bị sót hoặc trùng lặp.";
                }
                break;
            }
            case "xac-suat-thuc-nghiem": {
                if (level === "co-ban") {
                    const variant = self.randomInt(1, 2);
                    if (variant === 1) {
                        // Tung đồng xu
                        const coinSides = ["Sấp", "Ngửa"];
                        const side = coinSides[Math.floor(Math.random() * coinSides.length)];
                        const datasets = [
                            { total: 20, k: [6, 8, 12, 14, 15] },
                            { total: 25, k: [5, 10, 15, 20] },
                            { total: 40, k: [8, 12, 16, 24, 28] },
                            { total: 50, k: [15, 20, 25, 30, 35] }
                        ];
                        const data = datasets[Math.floor(Math.random() * datasets.length)];
                        const total = data.total;
                        const correctVal = data.k[Math.floor(Math.random() * data.k.length)];
                        
                        const g = self.gcd(correctVal, total);
                        const num = correctVal / g;
                        const den = total / g;
                        
                        questionText = `Bình Minh tung một đồng xu ${total} lần và ghi lại kết quả thấy có ${correctVal} lần xuất hiện mặt ${side}. Tính xác suất thực nghiệm của sự kiện "Đồng xu xuất hiện mặt ${side}".`;
                        options = [
                            `$\\frac{${num}}{${den}}$`,
                            `$\\frac{${den - num}}{${den}}$`,
                            `$\\frac{${correctVal}}{${total + 5}}$`,
                            `$\\frac{1}{2}$`
                        ];
                        // Đảm bảo không trùng options
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`$\\frac{${num + options.length}}{${den + options.length}}$`);
                        }
                        
                        hints = [
                            `Xác suất thực nghiệm của sự kiện được tính bằng tỉ số: $\\frac{\\text{Số lần sự kiện xảy ra}}{\\text{Tổng số lần thực hiện thử nghiệm}}$.`,
                            `Số lần mặt ${side} xuất hiện là ${correctVal}. Tổng số lần tung là ${total}.`,
                            `Tỉ số: $\\frac{${correctVal}}{${total}}$ và rút gọn.`
                        ];
                        solutionHtml = `Xác suất thực nghiệm của sự kiện "Xuất hiện mặt ${side}" là:<br>$\\frac{${correctVal}}{${total}} = \\frac{${correctVal} : ${g}}{${total} : ${g}} = \\frac{${num}}{${den}}$.`;
                    } else {
                        // Gieo xúc xắc
                        const items = ["số chẵn", "số lẻ", "mặt 6 chấm"];
                        const item = items[Math.floor(Math.random() * items.length)];
                        const datasets = [
                            { total: 30, k: [6, 12, 15, 18] },
                            { total: 50, k: [10, 20, 25, 30] },
                            { total: 60, k: [12, 18, 24, 36] }
                        ];
                        const data = datasets[Math.floor(Math.random() * datasets.length)];
                        const total = data.total;
                        const correctVal = data.k[Math.floor(Math.random() * data.k.length)];
                        
                        const g = self.gcd(correctVal, total);
                        const num = correctVal / g;
                        const den = total / g;
                        
                        questionText = `Khánh An gieo một con xúc xắc ${total} lần và thấy xuất hiện ${item} ${correctVal} lần. Tính xác suất thực nghiệm của sự kiện "Gieo được ${item}".`;
                        options = [
                            `$\\frac{${num}}{${den}}$`,
                            `$\\frac{${den - num}}{${den}}$`,
                            `$\\frac{${correctVal}}{${total + 10}}$`,
                            `$\\frac{1}{6}$`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`$\\frac{${num + options.length}}{${den + options.length}}$`);
                        }
                        
                        hints = [
                            `Xác suất thực nghiệm được tính bằng tỉ số giữa số lần sự kiện xảy ra và tổng số lần thử nghiệm.`,
                            `Số lần gieo được ${item} là ${correctVal}. Tổng số lần gieo là ${total}.`,
                            `Tỉ số: $\\frac{${correctVal}}{${total}}$, sau đó rút gọn.`
                        ];
                        solutionHtml = `Xác suất thực nghiệm của sự kiện "Gieo được ${item}" là:<br>$\\frac{${correctVal}}{${total}} = \\frac{${correctVal} : ${g}}{${total} : ${g}} = \\frac{${num}}{${den}}$.`;
                    }
                    tip = "Xác suất thực nghiệm luôn là một phân số từ 0 đến 1, rút gọn phân số để tìm đáp án trùng khớp.";
                } else if (level === "nang-cao") {
                    const variant = self.randomInt(1, 2);
                    if (variant === 1) {
                        // Hộp bóng hai màu
                        const names = ["Bình Minh", "Khánh An", "Minh Khang", "Bảo Nam"];
                        const name = names[Math.floor(Math.random() * names.length)];
                        const colors = [
                            { a: "Đỏ", b: "Xanh" },
                            { a: "Vàng", b: "Xanh lá" },
                            { a: "Đen", b: "Trắng" }
                        ];
                        const colorPair = colors[Math.floor(Math.random() * colors.length)];
                        const askColor = Math.random() < 0.5 ? colorPair.a : colorPair.b;
                        const otherColor = askColor === colorPair.a ? colorPair.b : colorPair.a;
                        
                        const datasets = [
                            { total: 40, otherK: [12, 16, 24, 28] },
                            { total: 50, otherK: [15, 20, 25, 30] },
                            { total: 80, otherK: [24, 32, 40, 48] },
                            { total: 100, otherK: [35, 40, 45, 60] }
                        ];
                        const data = datasets[Math.floor(Math.random() * datasets.length)];
                        const total = data.total;
                        const otherCount = data.otherK[Math.floor(Math.random() * data.otherK.length)];
                        const askCount = total - otherCount;
                        
                        const g = self.gcd(askCount, total);
                        const num = askCount / g;
                        const den = total / g;
                        
                        questionText = `Trong một hộp kín có nhiều quả bóng màu ${colorPair.a} và màu ${colorPair.b}. ${name} lấy ngẫu nhiên một quả bóng, ghi lại màu rồi bỏ lại vào hộp. Sau ${total} lần thực hiện, bạn ghi nhận có ${otherCount} lần lấy được bóng màu ${otherColor}. Tính xác suất thực nghiệm của sự kiện "Lấy được quả bóng màu ${askColor}".`;
                        options = [
                            `$\\frac{${num}}{${den}}$`,
                            `$\\frac{${den - num}}{${den}}$`,
                            `$\\frac{${otherCount}}{${total}}$`,
                            `$\\frac{1}{2}$`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`$\\frac{${num + options.length}}{${den + options.length}}$`);
                        }
                        
                        hints = [
                            `Đầu tiên, hãy tính số lần lấy được bóng màu ${askColor} bằng cách lấy tổng số lần thực hiện trừ đi số lần lấy được bóng màu ${otherColor}.`,
                            `Số lần lấy bóng màu ${askColor} là: ${total} - ${otherCount} = ${askCount} lần.`,
                            `Xác suất thực nghiệm là tỉ số giữa số lần lấy bóng màu ${askColor} và tổng số lần lấy bóng: $\\frac{${askCount}}{${total}}$ rồi rút gọn.`
                        ];
                        solutionHtml = `Số lần ${name} lấy được bóng màu ${askColor} là:<br>${total} - ${otherCount} = ${askCount} lần.<br>Xác suất thực nghiệm của sự kiện "Lấy được quả bóng màu ${askColor}" là:<br>$\\frac{${askCount}}{${total}} = \\frac{${askCount} : ${g}}{${total} : ${g}} = \\frac{${num}}{${den}}$.`;
                    } else {
                        // Kiểm tra phế phẩm
                        const names = ["Minh Khang", "Vy Anh", "Hoàng Lâm"];
                        const name = names[Math.floor(Math.random() * names.length)];
                        const datasets = [
                            { total: 100, bad: [5, 8, 10, 12, 15] },
                            { total: 200, bad: [8, 12, 16, 20, 24] },
                            { total: 250, bad: [10, 15, 20, 25, 30] }
                        ];
                        const data = datasets[Math.floor(Math.random() * datasets.length)];
                        const total = data.total;
                        const badCount = data.bad[Math.floor(Math.random() * data.bad.length)];
                        const goodCount = total - badCount;
                        
                        const g = self.gcd(goodCount, total);
                        const num = goodCount / g;
                        const den = total / g;
                        
                        questionText = `Một kỹ sư kiểm tra chất lượng của ${total} sản phẩm được sản xuất từ một nhà máy và phát hiện có ${badCount} sản phẩm lỗi. Tính xác suất thực nghiệm của sự kiện "Sản phẩm được chọn ngẫu nhiên đạt chất lượng" (không bị lỗi).`;
                        options = [
                            `$\\frac{${num}}{${den}}$`,
                            `$\\frac{${badCount}}{${total}}$`,
                            `$\\frac{${total - badCount - 5}}{${total}}$`,
                            `$\\frac{9}{10}$`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`$\\frac{${num - options.length}}{${den}}$`);
                        }
                        
                        hints = [
                            `Tính số sản phẩm đạt chất lượng (không bị lỗi) bằng cách lấy tổng số sản phẩm kiểm tra trừ đi số sản phẩm lỗi: ${total} - ${badCount} = ${goodCount} sản phẩm.`,
                            `Xác suất thực nghiệm được tính bằng tỉ số giữa số sản phẩm đạt chất lượng và tổng số sản phẩm kiểm tra.`,
                            `Tỉ số: $\\frac{${goodCount}}{${total}}$, sau đó rút gọn phân số.`
                        ];
                        solutionHtml = `Số sản phẩm đạt chất lượng (không lỗi) là:<br>${total} - ${badCount} = ${goodCount} sản phẩm.<br>Xác suất thực nghiệm của sự kiện "Sản phẩm được chọn đạt chất lượng" là:<br>$\\frac{${goodCount}}{${total}} = \\frac{${goodCount} : ${g}}{${total} : ${g}} = \\frac{${num}}{${den}}$.`;
                    }
                    tip = "Đọc kỹ yêu cầu đề bài hỏi xác suất thực nghiệm của sự kiện thuận lợi nào.";
                } else { // kho
                    const variant = self.randomInt(1, 2);
                    if (variant === 1) {
                        // Dự đoán kết quả gieo xúc xắc dựa trên tính chất số chấm
                        const names = ["Khánh An", "Bình Minh", "Vy Anh", "Hoàng Lâm"];
                        const name = names[Math.floor(Math.random() * names.length)];
                        
                        const props = [
                            { desc: "chia hết cho 3", N: 50, k: 20, M: 250 },
                            { desc: "là số nguyên tố", N: 40, k: 16, M: 200 },
                            { desc: "lớn hơn 4", N: 60, k: 24, M: 300 },
                            { desc: "là số chẵn", N: 80, k: 48, M: 400 }
                        ];
                        
                        const prop = props[Math.floor(Math.random() * props.length)];
                        const total = prop.N;
                        const correctVal = prop.k;
                        const nextTotal = prop.M;
                        
                        const g = self.gcd(correctVal, total);
                        const num = correctVal / g;
                        const den = total / g;
                        
                        const predict = (correctVal / total) * nextTotal;
                        
                        questionText = `${name} gieo một con xúc xắc cân đối ${total} lần và thấy số lần xuất hiện mặt có số chấm ${prop.desc} là ${correctVal} lần. Dựa vào kết quả thực nghiệm đó, nếu gieo xúc xắc thêm ${nextTotal} lần nữa thì dự đoán mặt có số chấm ${prop.desc} xuất hiện trong lượt gieo thêm là khoảng bao nhiêu lần?`;
                        options = [
                            `${predict} lần`,
                            `${predict + 10} lần`,
                            `${predict - 10} lần`,
                            `${correctVal} lần`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`${predict + options.length * 5} lần`);
                        }
                        
                        hints = [
                            `Tính xác suất thực nghiệm của sự kiện xúc xắc xuất hiện mặt có số chấm ${prop.desc} ở ${total} lần gieo đầu tiên: $\\frac{${correctVal}}{${total}} = \\frac{${num}}{${den}}$.`,
                            `Dùng xác suất thực nghiệm này để ước lượng khả năng xảy ra của sự kiện ở lần thử nghiệm tiếp theo.`,
                            `Dự đoán số lần xuất hiện ở lượt gieo thêm: Lấy tổng số lần gieo thêm (${nextTotal}) nhân với xác suất thực nghiệm vừa tính.`
                        ];
                        solutionHtml = `Xác suất thực nghiệm xuất hiện mặt có số chấm ${prop.desc} ở lượt gieo đầu tiên là:<br>$\\frac{${correctVal}}{${total}} = \\frac{${num}}{${den}}$.<br>Dự đoán số lần mặt này xuất hiện khi gieo thêm ${nextTotal} lần là:<br>${nextTotal} \\cdot \\frac{${num}}{${den}} = ${predict} lần.`;
                    } else {
                        // Bài toán bắn súng tìm tổng số phát trúng
                        const names = ["Quốc Anh", "Mai Chi", "Đức Minh", "Hà Linh"];
                        const name = names[Math.floor(Math.random() * names.length)];
                        
                        const datasets = [
                            { N: 40, k: 30, M: 160 },
                            { N: 50, k: 40, M: 150 },
                            { N: 60, k: 45, M: 240 },
                            { N: 80, k: 64, M: 320 }
                        ];
                        
                        const data = datasets[Math.floor(Math.random() * datasets.length)];
                        const total = data.N;
                        const hitCount = data.k;
                        const nextTotal = data.M;
                        
                        const g = self.gcd(hitCount, total);
                        const num = hitCount / g;
                        const den = total / g;
                        
                        const hitNext = (hitCount / total) * nextTotal;
                        const totalHitPredict = hitCount + hitNext;
                        
                        questionText = `Xạ thủ ${name} bắn thử ${total} phát súng và ghi nhận có ${hitCount} phát trúng bia. Dựa vào kết quả thực nghiệm này, nếu ${name} bắn tiếp ${nextTotal} phát súng nữa thì dự đoán **tổng số phát súng trúng bia** sau cả hai đợt bắn là khoảng bao nhiêu phát?`;
                        options = [
                            `${totalHitPredict} phát`,
                            `${hitNext} phát`,
                            `${totalHitPredict - 15} phát`,
                            `${totalHitPredict + 20} phát`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`${totalHitPredict + options.length * 10} phát`);
                        }
                        
                        hints = [
                            `Tính xác suất thực nghiệm bắn trúng bia của xạ thủ dựa trên kết quả đợt bắn thử: $\\frac{${hitCount}}{${total}} = \\frac{${num}}{${den}}$.`,
                            `Dự đoán số phát súng trúng bia ở đợt bắn tiếp theo: Lấy số phát bắn tiếp (${nextTotal}) nhân với xác suất thực nghiệm vừa tìm được.`,
                            `Đọc kỹ câu hỏi: Đề bài yêu cầu tính **tổng số phát súng trúng bia sau cả hai đợt bắn**. Hãy lấy số phát trúng đợt đầu cộng với số phát trúng dự kiến ở đợt sau.`
                        ];
                        solutionHtml = `Xác suất thực nghiệm bắn trúng bia của xạ thủ trong đợt đầu là:<br>$\\frac{${hitCount}}{${total}} = \\frac{${num}}{${den}}$.<br>Dự đoán số phát súng trúng bia trong đợt bắn tiếp theo (${nextTotal} phát) là:<br>${nextTotal} \\cdot \\frac{${num}}{${den}} = ${hitNext} phát.<br>Dự đoán tổng số phát súng trúng bia sau cả hai đợt bắn là:<br>${hitCount} + ${hitNext} = ${totalHitPredict} phát.`;
                    }
                    tip = "Lấy tổng số lần thử nghiệm mới nhân với xác suất thực nghiệm của sự kiện để dự đoán số lần xảy ra trong tương lai.";
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
    if (typeof root !== 'undefined') root.chapter4_statistics = ChapterModule;
})(typeof window !== 'undefined' ? window : global);
