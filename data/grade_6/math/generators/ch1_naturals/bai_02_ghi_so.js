/**
 * MICRO-GENERATOR: BÀI 2 — GHI SỐ TỰ NHIÊN (LA MÃ & HỆ THẬP PHÂN)
 */
(function(root) {
    'use strict';
    const Bai02GhiSo = {
        generate(type, level, ctx) {
            const self = ctx || this;
            let questionText = "";
            let options = [];
            let correctIndex = 0;
            let hints = [];
            let solutionHtml = "";
            let tip = "";

            switch (type) {
            case "ghi-so-tu-nhien-d1": {
                const variant = self.randomInt(1, 3);
                if (variant === 1) {
                    const a = self.randomInt(3, 8);
                    let b = self.randomInt(1, 9);
                    while (b === a) { b = self.randomInt(1, 9); }
                    const c = self.randomInt(0, 9);
                    const num = a * 100 + b * 10 + c;
                    questionText = `Cho số tự nhiên $N = ${num}$. Xác định số chục và chữ số hàng chục của $N$.`;
                    const soChuc = a * 10 + b;
                    const chuSoHangChuc = b;
                    options = [
                        `Số chục là $${soChuc}$, chữ số hàng chục là $${chuSoHangChuc}$`,
                        `Số chục là $${chuSoHangChuc}$, chữ số hàng chục là $${soChuc}$`,
                        `Số chục là $${soChuc}$, chữ số hàng chục là $${a}$`,
                        `Số chục là $${soChuc * 10}$, chữ số hàng chục là $${chuSoHangChuc}$`
                    ];
                    hints = [
                        `Chữ số hàng chục là chữ số đứng ở vị trí hàng chục (ở giữa).`,
                        `Số chục là số lượng chục đầy đủ trong số đó (bằng cách bỏ đi chữ số hàng đơn vị).`
                    ];
                    solutionHtml = `Số $${num}$ có chữ số hàng chục là $${chuSoHangChuc}$ và số chục là $${soChuc}$ (vì $${num} = ${soChuc} \\cdot 10 + ${c}$).`;
                } else if (variant === 2) {
                    const a = self.randomInt(2, 8);
                    let b = self.randomInt(1, 9);
                    while (b === a) { b = self.randomInt(1, 9); }
                    const c = self.randomInt(1, 9);
                    const d = self.randomInt(0, 9);
                    const num = a * 1000 + b * 100 + c * 10 + d;
                    questionText = `Cho số tự nhiên $N = ${num}$. Xác định số trăm và chữ số hàng trăm của $N$.`;
                    const soTram = a * 10 + b;
                    const chuSoHangTram = b;
                    options = [
                        `Số trăm là $${soTram}$, chữ số hàng trăm là $${chuSoHangTram}$`,
                        `Số trăm là $${chuSoHangTram}$, chữ số hàng trăm là $${soTram}$`,
                        `Số trăm là $${soTram}$, chữ số hàng trăm là $${a}$`,
                        `Số trăm là $${soTram * 10}$, chữ số hàng trăm là $${chuSoHangTram}$`
                    ];
                    hints = [
                        `Chữ số hàng trăm là chữ số ở vị trí hàng trăm (thứ hai từ trái sang trong số có 4 chữ số).`,
                        `Số trăm là số lượng trăm đầy đủ trong số đó (bằng cách bỏ đi 2 chữ số hàng chục và hàng đơn vị).`
                    ];
                    solutionHtml = `Số $${num}$ có chữ số hàng trăm là $${chuSoHangTram}$ và số trăm là $${soTram}$ (vì $${num} = ${soTram} \\cdot 100 + ${c * 10 + d}$).`;
                } else {
                    const a = self.randomInt(6, 9);
                    const b = self.randomInt(1, 5);
                    const num = a * 1000 + b * 100 + self.randomInt(10, 99);
                    questionText = `Trong số tự nhiên $${num}$, giá trị của chữ số $${a}$ lớn hơn giá trị của chữ số $${b}$ bao nhiêu đơn vị?`;
                    const valA = a * 1000;
                    const valB = b * 100;
                    const diff = valA - valB;
                    options = [
                        `$${diff}$ đơn vị`,
                        `$${a - b}$ đơn vị`,
                        `$${(a - b) * 100}$ đơn vị`,
                        `$${diff - 900}$ đơn vị`
                    ];
                    hints = [
                        `Xác định chữ số $${a}$ ở hàng nghìn nên giá trị của nó là $${a} \\cdot 1000$.`,
                        `Xác định chữ số $${b}$ ở hàng trăm nên giá trị của nó là $${b} \\cdot 100$.`,
                        `Lấy hiệu của hai giá trị này để tìm đáp án.`
                    ];
                    solutionHtml = `Chữ số $${a}$ nằm ở hàng nghìn nên có giá trị là $${valA}$. Chữ số $${b}$ nằm ở hàng trăm nên có giá trị là $${valB}$. Hiệu giá trị của chúng là: $${valA} - ${valB} = ${diff}$ đơn vị.`;
                }
                tip = "Hãy phân biệt rõ chữ số (0-9) và giá trị của chữ số đó theo hàng.";
                break;
            }
            case "ghi-so-tu-nhien-d2": {
                const variant = self.randomInt(1, 3);
                if (variant === 1) {
                    questionText = `Từ các chữ số $1, 0, 5, 8$, viết số tự nhiên chẵn nhỏ nhất có 3 chữ số khác nhau.`;
                    options = [`$108$`, `$102$`, `$158$`, `$180$`];
                    hints = [
                        `Số có 3 chữ số khác nhau phải chọn hàng trăm nhỏ nhất khác 0, tức là 1.`,
                        `Tiếp theo, hàng chục nhỏ nhất khác 1 là 0. Hàng đơn vị phải chẵn và khác 1, 0 để số là nhỏ nhất và chẵn. Số chẵn có thể tận cùng là 8.`
                    ];
                    solutionHtml = `Hàng trăm nhỏ nhất khác 0 là 1. Hàng chục nhỏ nhất tiếp theo là 0. Hàng đơn vị phải là số chẵn khác 1 và 0, từ tập $\\{1, 0, 5, 8\\}$ ta chỉ có số 8 là chẵn thỏa mãn. Vậy số đó là $108$.`;
                } else if (variant === 2) {
                    questionText = `Từ các chữ số $3, 0, 8, 9$, viết số tự nhiên lẻ lớn nhất có 3 chữ số khác nhau.`;
                    options = [`$983$`, `$989$`, `$903$`, `$893$`];
                    hints = [
                        `Để được số lớn nhất, ta chọn chữ số hàng trăm lớn nhất có thể (chọn 9).`,
                        `Hàng chục tiếp theo chọn chữ số lớn nhất còn lại (chọn 8).`,
                        `Hàng đơn vị phải lẻ và khác 9, 8, ta còn lại chữ số 3 lẻ. số là $983$.`
                    ];
                    solutionHtml = `Hàng trăm lớn nhất chọn 9. Hàng chục lớn nhất còn lại chọn 8. Hàng đơn vị phải là chữ số lẻ từ tập $\\{3, 0, 8, 9\\}$ và khác 9, nên ta chọn 3. Số đó là $983$.`;
                } else {
                    questionText = `Từ các chữ số $2, 0, 5, 7$, lập số lớn nhất có 4 chữ số khác nhau là $A$ và số nhỏ nhất có 4 chữ số khác nhau là $B$. Tính hiệu $A - B$.`;
                    const maxNum = 7520;
                    const minNum = 2057;
                    const diff = maxNum - minNum;
                    options = [`$${diff}$`, `$${maxNum + minNum}$`, `$5473$`, `$5600$`];
                    hints = [
                        `Để lập số lớn nhất $A$, ta xếp các chữ số giảm dần từ trái sang phải: $7520$.`,
                        `Để lập số nhỏ nhất $B$, ta chọn hàng nghìn nhỏ nhất khác 0 (chọn 2), sau đó xếp các chữ số tăng dần từ trái sang phải: $2057$.`,
                        `Tính hiệu: $A - B = 7520 - 2057$.`
                    ];
                    solutionHtml = `Số lớn nhất lập được là $A = 7520$. Số nhỏ nhất lập được là $B = 2057$. Hiệu của chúng là: $A - B = 7520 - 2057 = ${diff}$.`;
                }
                tip = "Để số lớn nhất thì xếp từ lớn đến bé, để số nhỏ nhất thì xếp từ bé đến lớn (lưu ý hàng đầu khác 0).";
                break;
            }
            case "ghi-so-tu-nhien-d3": {
                const variant = self.randomInt(1, 3);
                if (variant === 1) {
                    const a = self.randomInt(2, 9);
                    questionText = `Một số tự nhiên có hai chữ số sẽ tăng thêm bao nhiêu đơn vị nếu ta viết thêm chữ số $${a}$ vào bên trái số đó?`;
                    const increase = a * 100;
                    options = [`$${increase}$ đơn vị`, `$${a}$ đơn vị`, `$${a * 10}$ đơn vị`, `$${increase + 10}$ đơn vị`];
                    hints = [
                        `Khi viết thêm chữ số vào bên trái số có hai chữ số, ta đã thêm chữ số đó vào hàng trăm.`,
                        `Giá trị tăng thêm bằng chữ số đó nhân với giá trị hàng tương ứng (ở đây là hàng trăm).`
                    ];
                    solutionHtml = `Viết thêm chữ số $${a}$ vào bên trái số có hai chữ số tức là ta tạo ra một số mới có chữ số $${a}$ ở hàng trăm, do đó giá trị tăng thêm là $${a} \\cdot 100 = ${increase}$ đơn vị.`;
                } else if (variant === 2) {
                    const a = self.randomInt(1, 9);
                    questionText = `Một số tự nhiên sẽ thay đổi như thế nào nếu ta viết thêm chữ số $${a}$ vào bên phải số đó?`;
                    const correctStr = `Tăng gấp 10 lần và thêm $${a}$ đơn vị`;
                    options = [
                        correctStr,
                        `Tăng thêm $${a}$ đơn vị`,
                        `Tăng gấp 10 lần`,
                        `Tăng thêm $${a * 10}$ đơn vị`
                    ];
                    hints = [
                        `Hãy gọi số ban đầu là $x$. Khi viết thêm chữ số $${a}$ vào bên phải, ta được số mới có cấu tạo là $\\overline{x${a}}$.`,
                        `Biểu diễn số mới theo cấu tạo thập phân: $\\overline{x${a}} = 10 \\cdot x + ${a}$.`
                    ];
                    solutionHtml = `Gọi số ban đầu là $x$. Khi viết thêm $${a}$ vào bên phải, số mới có dạng $\\overline{x${a}} = 10 \\cdot x + ${a}$. Như vậy, số đó đã tăng gấp 10 lần và thêm $${a}$ đơn vị.`;
                } else {
                    questionText = `Nếu viết thêm chữ số 0 vào bên phải một số tự nhiên khác 0, số đó sẽ thay đổi thế nào?`;
                    const correctStr = `Gấp lên 10 lần`;
                    options = [
                        correctStr,
                        `Gấp lên 100 lần`,
                        `Tăng thêm 10 đơn vị`,
                        `Không thay đổi giá trị`
                    ];
                    hints = [
                        `Khi viết thêm chữ số 0 vào bên phải số $A$, ta được số mới là $A0$.`,
                        `Ta có $A0 = A \\cdot 10$.`
                    ];
                    solutionHtml = `Số mới có dạng $A0 = 10 \\cdot A$. Vậy số đó gấp lên 10 lần so với ban đầu.`;
                }
                tip = "Thêm chữ số vào bên trái hoặc bên phải sẽ làm dịch chuyển hàng của các chữ số cũ.";
                break;
            }
            case "ghi-so-tu-nhien-d4": {
                const variant = self.randomInt(1, 3);
                if (variant === 1) {
                    const listVal = [14, 19, 24, 29];
                    const val = listVal[self.randomInt(0, 3)];
                    const mapRomans = { 14: "XIV", 19: "XIX", 24: "XXIV", 29: "XXIX" };
                    const rom = mapRomans[val];
                    questionText = `Số tự nhiên $${val}$ được viết dưới dạng chữ số La Mã là:`;
                    options = [
                        `$${rom}$`,
                        `$${rom.replace("IV", "VI").replace("IX", "XI")}$`,
                        `$${rom.substring(1)}$`,
                        `$X${rom}$`
                    ];
                    hints = [
                        `Phân tích $${val}$ thành chục và đơn vị lẻ: ví dụ $14 = 10 + 4$; $29 = 20 + 9$.`,
                        `Ký hiệu $10 = X$, $4 = IV$, $9 = IX$.`
                    ];
                    solutionHtml = `Số $${val}$ được phân tích thành: $${val === 14 ? '10 + 4' : val === 19 ? '10 + 9' : val === 24 ? '20 + 4' : '20 + 9'}$. Trong chữ số La Mã: $10 \\rightarrow X$, $20 \\rightarrow XX$, $4 \\rightarrow IV$, $9 \\rightarrow IX$. Ghép lại ta được $${rom}$.`;
                } else if (variant === 2) {
                    const romans = ["XVIII", "XXIV", "XXVII", "XXIX"];
                    const rom = romans[self.randomInt(0, 3)];
                    const mapVals = { "XVIII": 18, "XXIV": 24, "XXVII": 27, "XXIX": 29 };
                    const val = mapVals[rom];
                    questionText = `Số La Mã $${rom}$ biểu diễn giá trị nào trong hệ thập phân?`;
                    options = [`$${val}$`, `$${val - 2}$`, `$${val + 2}$`, `$${val - 10}$`];
                    hints = [
                        `Ký hiệu $X = 10$, $XX = 20$.`,
                        `Nhận diện chữ số hàng đơn vị lẻ ở sau: $VIII = 8$, $IV = 4$, $VII = 7$, $IX = 9$.`
                    ];
                    solutionHtml = `Số La Mã $${rom}$ có $XX = 20$ (hoặc $X=10$) và phần lẻ phía sau. Cộng các giá trị lại ta được: $${val}$.`;
                } else {
                    const exprs = [
                        { text: "XII + IX", val: 12 + 9, resRom: "XXI" },
                        { text: "XV + IX", val: 15 + 9, resRom: "XXIV" },
                        { text: "XI + XIV", val: 11 + 14, resRom: "XXV" }
                    ];
                    const exp = exprs[self.randomInt(0, exprs.length - 1)];
                    questionText = `Tính giá trị của biểu thức sau và viết kết quả dưới dạng số La Mã: $${exp.text}$`;
                    options = [
                        `$${exp.resRom}$`,
                        `$${exp.resRom.includes("I") ? exp.resRom.replace("I", "V") : exp.resRom.replace("V", "I")}$`,
                        `$${exp.resRom.replace("X", "I")}$`,
                        `$X${exp.resRom}$`
                    ];
                    hints = [
                        `Đổi các số La Mã trong phép tính sang hệ thập phân: $XI = 11$, $XII = 12$, $XIV = 14$, $XV = 15$, $IX = 9$.`,
                        `Tính tổng của hai số đó trong hệ thập phân rồi viết lại kết quả dưới dạng số La Mã.`
                    ];
                    solutionHtml = `Đổi sang số tự nhiên: phép tính tương đương với $${exp.text.replace("XII", "12").replace("XI", "11").replace("XV", "15").replace("XIV", "14").replace("IX", "9")} = ${exp.val}$. Đổi số $${exp.val}$ sang số La Mã ta được $${exp.resRom}$.`;
                }
                tip = "Quy tắc viết La Mã: Viết các hàng lớn trước, hàng nhỏ sau.";
                break;
            }
            case "ghi-so-tu-nhien": {
                if (level === "co-ban") {
                    const val = self.randomInt(12, 29);
                    const romans = {
                        12:"XII", 13:"XIII", 14:"XIV", 15:"XV", 16:"XVI", 17:"XVII", 18:"XVIII", 19:"XIX",
                        21:"XXI", 22:"XXII", 23:"XXIII", 24:"XXIV", 25:"XXV", 26:"XXVI", 27:"XXVII", 28:"XXVIII", 29:"XXIX"
                    };
                    const rom = romans[val] || "XV";
                    questionText = `Số La Mã $${rom}$ biểu diễn giá trị nào trong hệ thập phân?`;
                    options = [`$${val}$`, `$${val - 2}$`, `$${val + 2}$`, `$${val + 1}$`];
                    hints = [
                        `Ký hiệu $X = 10$, $XX = 20$.`,
                        `Các ký hiệu đơn vị lẻ ở sau: $IV = 4$, $V = 5$, $IX = 9$.`
                    ];
                    solutionHtml = `Ta có $XX = 20$. Phần phía sau là $${rom.replace("XX", "")}$ biểu diễn giá trị $${val % 10}$. Cộng lại: $20 + ${val % 10} = ${val}$.`;
                    tip = "Hãy thuộc lòng các số La Mã từ 1 đến 10 để ghép nhanh các số lớn.";
                } else if (level === "nang-cao") {
                    questionText = `Cho số tự nhiên $x = \\overline{a5b}$ ($a \\neq 0$). Phân tích giá trị của số $x$ theo cấu tạo các chữ số hàng trăm, chục, đơn vị.`;
                    options = [
                        `$x = 100a + 50 + b$`,
                        `$x = 100a + 5 + b$`,
                        `$x = a + 5 + b$`,
                        `$x = 100a + 10b + 5$`
                    ];
                    hints = [
                        `Chữ số $a$ ở hàng trăm nên giá trị là $100 \\cdot a$.`,
                        `Chữ số 5 ở hàng chục nên giá trị là $10 \\cdot 5 = 50$.`
                    ];
                    solutionHtml = `Số tự nhiên $\\overline{a5b}$ có chữ số $a$ ở hàng trăm, chữ số $5$ ở hàng chục và chữ số $b$ ở hàng đơn vị. Nên biểu diễn là: $100 \\cdot a + 50 + b$.`;
                    tip = "Mỗi chữ số ở một hàng sẽ được nhân với lũy thừa tương ứng của 10.";
                } else { // kho
                    const pages = self.randomInt(105, 125);
                    const totalDigits = 9 + 180 + (pages - 99) * 3;
                    questionText = `Để đánh số trang của một cuốn sách (bắt đầu từ trang 1), người ta đã sử dụng tất cả $${totalDigits}$ chữ số. Hỏi cuốn sách đó dày bao nhiêu trang?`;
                    options = [`$${pages}$ trang`, `$${pages - 3}$ trang`, `$${pages + 5}$ trang`, `$${pages - 10}$ trang`];
                    self.shuffle(options);
                    correctIndex = options.indexOf(`$${pages}$ trang`);
                    
                    hints = [
                        `Nhớ lại số chữ số dùng cho các trang có 1 chữ số (trang 1-9) là 9 chữ số.`,
                        `Số chữ số dùng cho các trang có 2 chữ số (trang 10-99) là $90 \\cdot 2 = 180$ chữ số.`,
                        `Lấy tổng số chữ số trừ đi $189$ ($9 + 180$) sẽ ra số chữ số dùng cho các trang có 3 chữ số. Lấy kết quả đó chia cho 3 để tìm số trang có 3 chữ số.`
                    ];
                    solutionHtml = `Số chữ số để đánh các trang từ 1 đến 9 là: $9 \\cdot 1 = 9$ chữ số.<br>Số chữ số để đánh các trang từ 10 đến 99 là: $90 \\cdot 2 = 180$ chữ số.<br>Số chữ số dùng cho các trang có 3 chữ số (từ trang 100 trở đi) là: $${totalDigits} - 9 - 180 = ${totalDigits - 189}$ chữ số.<br>Số trang có 3 chữ số là: $${totalDigits - 189} : 3 = ${pages - 99}$ trang.<br>Vậy cuốn sách đó có: $99 + ${pages - 99} = ${pages}$ trang.`;
                    tip = "Bài toán ngược cần làm từng bước: tính lượng chữ số từ trang 1-9 và 10-99 trước để trừ đi.";
                }
                break;
            }
                default:
                    return null;
            }
            return { type: "trac-nghiem", questionText, options, correctIndex, hints, solutionHtml, tip };
        }
    };
    if (typeof window !== 'undefined') window.g6_ch1_bai02 = Bai02GhiSo;
    if (typeof module !== 'undefined' && module.exports) module.exports = Bai02GhiSo;
})(typeof window !== 'undefined' ? window : global);
