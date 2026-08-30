/**
 * GRADE 6 MATH - CHAPTER 6: HÌNH HỌC PHẲNG (ĐIỂM, ĐƯỜNG THẲNG, GÓC)
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
            case "diem-duong-thang": {
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        questionText = `Cho điểm $A$ nằm trên đường thẳng $d$ và điểm $B$ nằm ngoài đường thẳng $d$. Ký hiệu toán học nào sau đây biểu diễn **đúng** mối quan hệ này?`;
                        options = [
                            `$A \\in d$ và $B \\notin d$`,
                            `$A \\notin d$ và $B \\in d$`,
                            `$A \\in d$ và $B \\in d$`,
                            `$A \\subset d$ và $B \\notin d$`
                        ];
                        self.shuffle(options);
                        hints = [
                            `Ký hiệu $\\in$ nghĩa là thuộc (điểm nằm trên đường thẳng).`,
                            `Ký hiệu $\\notin$ nghĩa là không thuộc (điểm nằm ngoài đường thẳng).`
                        ];
                        solutionHtml = `Vì điểm $A$ nằm trên đường thẳng $d$ nên ta viết $A \\in d$. Điểm $B$ không nằm trên đường thẳng $d$ nên ta viết $B \\notin d$.`;
                    } else {
                        questionText = `Cho ba điểm $A, B, C$ cùng nằm trên đường thẳng $a$ và điểm $D$ không nằm trên đường thẳng $a$. Phát biểu nào sau đây là **sai**?`;
                        options = [
                            `$D \\in a$`,
                            `$A \\in a$`,
                            `$B \\in a$`,
                            `$C \\in a$`
                        ];
                        self.shuffle(options);
                        hints = [
                            `Điểm nằm trên đường thẳng thì ký hiệu là thuộc $\\in$.`,
                            `Điểm không nằm trên đường thẳng thì ký hiệu là không thuộc $\\notin$.`,
                            `Kiểm tra xem điểm $D$ có nằm trên đường thẳng $a$ không.`
                        ];
                        solutionHtml = `Vì ba điểm $A, B, C$ nằm trên đường thẳng $a$ nên $A, B, C \\in a$ là các phát biểu đúng. Điểm $D$ không nằm trên đường thẳng $a$ nên ta phải viết $D \\notin a$. Do đó khẳng định $D \\in a$ là sai.`;
                    }
                    tip = "Sử dụng ký hiệu thuộc (∈) và không thuộc (∉) cho mối quan hệ giữa điểm và đường thẳng.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const n = self.randomInt(5, 8);
                        const lines = (n * (n - 1)) / 2;
                        questionText = `Cho $${n}$ điểm phân biệt trong đó không có 3 điểm nào thẳng hàng. Hỏi vẽ được tất cả bao nhiêu đường thẳng đi qua các cặp điểm?`;
                        options = [`$${lines}$ đường thẳng`, `$${n}$ đường thẳng`, `$${lines + 5}$ đường thẳng`, `$${n * 2}$ đường thẳng`];
                        self.shuffle(options);
                        hints = [
                            `Cứ qua 2 điểm ta vẽ được 1 đường thẳng.`,
                            `Công thức tính số đường thẳng đi qua $n$ điểm phân biệt không thẳng hàng là: $\\frac{n(n-1)}{2}$.`,
                            `Thay $n = ${n}$ vào công thức.`
                        ];
                        solutionHtml = `Số đường thẳng vẽ được đi qua $${n}$ điểm phân biệt (không có 3 điểm nào thẳng hàng) là:<br>$\\frac{${n} \\cdot (${n} - 1)}{2} = \\frac{${n} \\cdot ${n-1}}{2} = ${lines}$ đường thẳng.`;
                    } else {
                        const n = self.randomInt(6, 9);
                        const lines = (n * (n - 1)) / 2 - 3 + 1; // 3 điểm thẳng hàng -> mất 3 đường thẳng cũ, thay bằng 1 đường thẳng mới.
                        questionText = `Cho $${n}$ điểm phân biệt trong đó có đúng 3 điểm thẳng hàng, ngoài ra không có 3 điểm nào khác thẳng hàng. Hỏi vẽ được tất cả bao nhiêu đường thẳng đi qua các cặp điểm?`;
                        options = [
                            `$${lines}$ đường thẳng`,
                            `$${(n * (n - 1)) / 2}$ đường thẳng`,
                            `$${lines - 2}$ đường thẳng`,
                            `$${lines + 4}$ đường thẳng`
                        ];
                        self.shuffle(options);
                        hints = [
                            `Nếu không có điểm nào thẳng hàng, số đường thẳng là $\\frac{n(n-1)}{2}$.`,
                            `Vì có 3 điểm thẳng hàng nên số đường thẳng giảm đi: ta trừ đi số đường thẳng đi qua các cặp điểm trong 3 điểm này ($\\frac{3 \\cdot 2}{2} = 3$ đường) rồi cộng thêm 1 đường thẳng đi qua cả 3 điểm thẳng hàng đó.`,
                            `Công thức tính: $\\frac{n(n-1)}{2} - 3 + 1$.`
                        ];
                        solutionHtml = `Nếu không có 3 điểm nào thẳng hàng, số đường thẳng vẽ được là: $\\frac{${n} \\cdot ${n-1}}{2} = ${(n * (n - 1)) / 2}$ đường thẳng.<br>Trong 3 điểm thẳng hàng, thay vì vẽ được $\\frac{3 \\cdot 2}{2} = 3$ đường thẳng phân biệt, ta chỉ vẽ được duy nhất $1$ đường thẳng.<br>Do đó số đường thẳng thực tế vẽ được là:<br>$\\frac{${n} \\cdot (${n} - 1)}{2} - 3 + 1 = ${lines}$ đường thẳng.`;
                    }
                    tip = "Công thức tổng quát tính số đường thẳng từ n điểm không thẳng hàng là n(n-1)/2. Khi có k điểm thẳng hàng, ta trừ đi k(k-1)/2 rồi cộng thêm 1.";
                } else { // kho
                    if (variant === 1) {
                        const pts = [6, 7, 8, 9];
                        const n = pts[self.randomInt(0, pts.length - 1)];
                        const lines = (n * (n - 1)) / 2;
                        questionText = `Cho trước một số điểm phân biệt. Người ta vẽ được tất cả $${lines}$ đường thẳng đi qua các cặp điểm (không có 3 điểm nào thẳng hàng). Hỏi ban đầu có bao nhiêu điểm phân biệt?`;
                        options = [`$${n}$ điểm`, `$${n - 1}$ điểm`, `$${n + 1}$ điểm`, `$${lines / 2}$ điểm`];
                        self.shuffle(options);
                        hints = [
                            `Áp dụng công thức số đường thẳng: $\\frac{n(n-1)}{2} = ${lines}$.`,
                            `Nhân chéo: $n(n-1) = ${lines * 2}$.`,
                            `Tìm hai số tự nhiên liên tiếp có tích bằng $${lines * 2}$.`
                        ];
                        solutionHtml = `Gọi số điểm là $n$. Ta có công thức số đường thẳng:<br>$\\frac{n(n-1)}{2} = ${lines} \\rightarrow n(n-1) = ${lines * 2}$.<br>Vì $${lines * 2} = ${n} \\cdot ${n - 1}$, nên ta suy ra $n = ${n}$. Vậy ban đầu có $${n}$ điểm phân biệt.`;
                    } else {
                        // Cho 10 điểm phân biệt, trong đó có k điểm thẳng hàng. Vẽ được tất cả 40 đường thẳng. Tìm k.
                        const k = self.randomInt(3, 5);
                        const n = 10;
                        const kLines = (k * (k - 1)) / 2;
                        const totalLines = (n * (n - 1)) / 2 - kLines + 1; // 45 - kLines + 1 = 46 - kLines
                        questionText = `Cho $10$ điểm phân biệt trong đó có đúng $k$ điểm thẳng hàng (ngoài ra không có 3 điểm nào khác thẳng hàng). Qua các cặp điểm ta vẽ được tất cả $${totalLines}$ đường thẳng. Tìm giá trị của $k$.`;
                        options = [`$${k}$`, `$${k - 1}$`, `$${k + 1}$`, `$2$`];
                        self.shuffle(options);
                        hints = [
                            `Áp dụng công thức số đường thẳng khi có $k$ điểm thẳng hàng: $\\frac{10 \\cdot 9}{2} - \\frac{k(k-1)}{2} + 1 = ${totalLines}$.`,
                            `Tính toán: $45 - \\frac{k(k-1)}{2} + 1 = ${totalLines} \\rightarrow 46 - \\frac{k(k-1)}{2} = ${totalLines}$.`,
                            `Suy ra $\\frac{k(k-1)}{2} = 46 - ${totalLines} = ${kLines}$.`
                        ];
                        solutionHtml = `Số đường thẳng vẽ được từ $10$ điểm phân biệt với $k$ điểm thẳng hàng là:<br>$\\frac{10 \\cdot 9}{2} - \\frac{k(k-1)}{2} + 1 = ${totalLines}$<br>$\\rightarrow 45 - \\frac{k(k-1)}{2} + 1 = ${totalLines}$<br>$\\rightarrow 46 - \\frac{k(k-1)}{2} = ${totalLines}$<br>$\\rightarrow \\frac{k(k-1)}{2} = 46 - ${totalLines} = ${kLines}$<br>$\\rightarrow k(k-1) = ${k * (k - 1)}$.<br>Vì $k$ và $k-1$ là hai số tự nhiên liên tiếp nên ta suy ra $k = ${k}$.`;
                    }
                    tip = "Phân tích tích số thành tích của hai số tự nhiên liên tiếp để giải nhanh bài toán tìm số điểm.";
                }
                break;
            }
            case "tia-hinh-hoc": {
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        questionText = `Hai tia chung gốc $Ox$ và $Oy$ tạo thành đường thẳng $xy$ được gọi là:`;
                        options = [`Hai tia đối nhau`, `Hai tia trùng nhau`, `Hai tia vuông góc`, `Hai tia song song`];
                        self.shuffle(options);
                        hints = [
                            `Hãy vẽ đường thẳng $xy$ và lấy điểm $O$ trên đó.`,
                            `Điểm $O$ chia đường thẳng thành hai nửa là tia $Ox$ và tia $Oy$ kéo dài về hai phía ngược nhau.`
                        ];
                        solutionHtml = `Hai tia chung gốc tạo thành một đường thẳng được định nghĩa là hai tia đối nhau.`;
                    } else {
                        questionText = `Tia $Ox$ là hình gồm:`;
                        options = [
                            `Điểm $O$ và một phần đường thẳng bị chia ra bởi điểm $O$`,
                            `Điểm $O$, điểm $x$ và tất cả các điểm nằm giữa $O$ và $x$`,
                            `Một đường thẳng kéo dài về hai phía`,
                            `Một đoạn thẳng nối điểm $O$ và điểm $x$`
                        ];
                        self.shuffle(options);
                        hints = [
                            `Định nghĩa tia: Tia $Ox$ là hình gồm điểm $O$ và một phần đường thẳng bị chia ra bởi điểm $O$.`,
                            `Điểm $O$ được gọi là gốc của tia.`
                        ];
                        solutionHtml = `Theo định nghĩa trong sách giáo khoa: Hình gồm điểm $O$ và một phần đường thẳng bị chia ra bởi điểm $O$ được gọi là một tia gốc $O$ (hay nửa đường thẳng gốc $O$). Ký hiệu tia $Ox$ có nghĩa gốc là điểm $O$ và kéo dài vô tận về phía $x$.`;
                    }
                    tip = "Hai tia đối nhau phải thỏa mãn đồng thời hai điều kiện: Chung gốc và tạo thành một đường thẳng.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        questionText = `Cho điểm $M$ nằm giữa hai điểm $A$ và $B$. Phát biểu nào sau đây là **đúng**?`;
                        options = [
                            `Tia $MA$ và tia $MB$ là hai tia đối nhau.`,
                            `Tia $AM$ và tia $AB$ là hai tia đối nhau.`,
                            `Tia $MA$ và tia $MB$ là hai tia trùng nhau.`,
                            `Tia $BM$ và tia $BA$ là hai tia đối nhau.`
                        ];
                        self.shuffle(options);
                        hints = [
                            `Vẽ ba điểm theo thứ tự $A - M - B$.`,
                            `Điểm $M$ nằm giữa nên gốc $M$ đi về phía $A$ và phía $B$ là hai hướng ngược nhau tạo nên đường thẳng $AB$.`
                        ];
                        solutionHtml = `Vì điểm $M$ nằm giữa hai điểm $A$ và $B$, nên hai tia chung gốc $M$ là $MA$ và $MB$ kéo dài về hai hướng ngược nhau tạo thành đường thẳng $AB$. Do đó chúng là hai tia đối nhau.`;
                    } else {
                        questionText = `Trên tia $Ox$ lấy điểm $A$ và $B$ sao sau điểm $A$ nằm giữa hai điểm $O$ và $B$. Hỏi tia đối của tia $AB$ là tia nào?`;
                        options = [`Tia $Ax$ (hoặc tia $AB$ kéo dài)`, `Tia $AO$ (hoặc tia $Ay$)`, `Tia $BO$`, `Tia $OB$`];
                        self.shuffle(options);
                        hints = [
                            `Vẽ hình theo thứ tự các điểm trên tia: $O - A - B - x$.`,
                            `Tia $AB$ có gốc là $A$ và đi về hướng bên phải (phía $B$ và $x$).`,
                            `Tia đối của tia $AB$ phải chung gốc $A$ và đi về hướng ngược lại (hướng bên trái, tức là hướng về điểm $O$).`
                        ];
                        solutionHtml = `Trên hình vẽ theo thứ tự là $O - A - B$.<br>- Tia $AB$ có gốc là $A$, đi theo hướng từ trái sang phải.<br>- Tia đối của tia $AB$ phải có gốc là $A$ và đi theo hướng từ phải sang trái (ngược lại). Hướng này đi qua điểm $O$.<br>Do đó tia đối của tia $AB$ là tia $AO$.`;
                    }
                    tip = "Hai tia đối nhau chung gốc và tạo thành đường thẳng. Luyện tập vẽ hình nháp để kiểm tra tính chính xác.";
                } else { // kho
                        // Cho n tia chung gốc, vẽ thêm 1 tia chung gốc thì số góc tăng thêm bao nhiêu?
                        const n = self.randomInt(4, 6);
                        questionText = `Cho trước $${n}$ tia chung gốc. Nếu ta vẽ thêm $1$ tia chung gốc nữa (không trùng với các tia đã có) thì số góc tạo thành sẽ tăng thêm bao nhiêu góc?`;
                        options = [`$${n}$ góc`, `$${n + 1}$ góc`, `$${n - 1}$ góc`, `$${(n * (n - 1)) / 2}$ góc`];
                        self.shuffle(options);
                        hints = [
                            `Tia mới vẽ thêm sẽ kết hợp với từng tia trong số $${n}$ tia ban đầu để tạo ra các góc mới.`,
                            `Vì có $${n}$ tia ban đầu nên số góc mới được tạo ra chính bằng số tia ban đầu.`
                        ];
                        solutionHtml = `Tia mới vẽ thêm cùng với mỗi tia trong số $${n}$ tia ban đầu tạo thành đúng $1$ góc mới.<br>Vì có $${n}$ tia ban đầu nên số góc mới được tạo thành thêm là $${n}$ góc.`;
                    }
                    tip = "Trên một đường thẳng, số tia luôn bằng 2 lần số điểm nằm trên đó.";
                break;
            }
            case "doan-thang": {
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const ab = self.randomInt(7, 12);
                        const am = self.randomInt(2, ab - 2);
                        questionText = `Cho điểm $M$ nằm giữa hai điểm $A$ và $B$. Biết độ dài đoạn thẳng $AB = ${ab}\\text{ cm}$, $AM = ${am}\\text{ cm}$. Tính độ dài đoạn thẳng $MB$.`;
                        // Tránh trùng khi am trùng với ab-am hoặc ab-am+2
                        const w3DoanThang1a = (am === ab - am || am === ab - am + 2) ? am + 1 : am;
                        // Tránh w3 trùng lần nữa với các options còn lại (an toàn)
                        const w3DoanThang1 = (w3DoanThang1a === ab - am || w3DoanThang1a === ab - am + 2 || w3DoanThang1a === ab + am) ? am + 3 : w3DoanThang1a;
                        options = [`$${ab - am}\\text{ cm}$`, `$${ab + am}\\text{ cm}$`, `$${w3DoanThang1}\\text{ cm}$`, `$${ab - am + 2}\\text{ cm}$`];
                        self.shuffle(options);
                        hints = [
                            `Vì điểm $M$ nằm giữa hai điểm $A$ và $B$ nên ta có đẳng thức: $AM + MB = AB$.`,
                            `Thay số vào: $${am} + MB = ${ab}$.`
                        ];
                        solutionHtml = `Vì điểm $M$ nằm giữa $A$ và $B$ nên:<br>$AM + MB = AB \\rightarrow ${am} + MB = ${ab} \\rightarrow MB = ${ab} - ${am} = ${ab - am}\\text{ cm}$.`;
                    } else {
                        const pq = self.randomInt(12, 18);
                        const pn = self.randomInt(4, pq - 4);
                        questionText = `Cho điểm $N$ nằm giữa hai điểm $P$ và $Q$. Biết $PN = ${pn}\\text{ cm}$, $NQ = ${pq - pn}\\text{ cm}$. Tính độ dài đoạn thẳng $PQ$.`;
                        // Tránh trùng khi pn === pq-pn hoặc pn === pq+2
                        const w3DoanThang2a = (pn === pq - pn || pn === pq + 2) ? pn + 1 : pn;
                        const w3DoanThang2 = (w3DoanThang2a === pq - pn || w3DoanThang2a === pq + 2 || w3DoanThang2a === pq) ? pn + 3 : w3DoanThang2a;
                        options = [`$${pq}\\text{ cm}$`, `$${pq - pn}\\text{ cm}$`, `$${w3DoanThang2}\\text{ cm}$`, `$${pq + 2}\\text{ cm}$`];
                        self.shuffle(options);
                        hints = [
                            `Vì điểm $N$ nằm giữa $P$ và $Q$ nên ta có đẳng thức cộng đoạn thẳng: $PQ = PN + NQ$.`,
                            `Thay số vào: $PQ = ${pn} + ${pq - pn}$.`
                        ];
                        solutionHtml = `Vì điểm $N$ nằm giữa hai điểm $P$ và $Q$ nên ta có:<br>$PQ = PN + NQ = ${pn} + ${pq - pn} = ${pq}\\text{ cm}$.`;
                    }
                    tip = "Hệ thức cộng đoạn thẳng chỉ có khi có một điểm nằm giữa hai điểm còn lại.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const n = self.randomInt(5, 8);
                        const segments = (n * (n - 1)) / 2;
                        questionText = `Cho $${n}$ điểm phân biệt nằm trên một đường thẳng. Có bao nhiêu đoạn thẳng được tạo thành từ các điểm đó?`;
                        options = [`$${segments}$ đoạn thẳng`, `$${n}$ đoạn thẳng`, `$${segments + 3}$ đoạn thẳng`, `$${n * 2}$ đoạn thẳng`];
                        self.shuffle(options);
                        hints = [
                            `Cứ chọn 2 điểm trong số các điểm cho trước ta được 1 đoạn thẳng.`,
                            `Công thức tính số đoạn thẳng đi qua $n$ điểm phân biệt là: $\\frac{n(n-1)}{2}$.`,
                            `Thay $n = ${n}$ vào để tính.`
                        ];
                        solutionHtml = `Mỗi cách chọn 2 điểm trong số $${n}$ điểm phân biệt cho ta một đoạn thẳng. Số đoạn thẳng là:<br>$\\frac{${n} \\cdot (${n} - 1)}{2} = \\frac{${n} \\cdot ${n-1}}{2} = ${segments}$ đoạn thẳng.`;
                    } else {
                        const oa = self.randomInt(2, 5);
                        const ob = self.randomInt(oa + 3, oa + 7);
                        questionText = `Trên tia $Ox$ lấy hai điểm $A$ và $B$ sao cho $OA = ${oa}\\text{ cm}$, $OB = ${ob}\\text{ cm}$. Tính độ dài đoạn thẳng $AB$.`;
                        options = [`$${ob - oa}\\text{ cm}$`, `$${ob + oa}\\text{ cm}$`, `$${oa}\\text{ cm}$`, `$${ob - oa + 1}\\text{ cm}$`];
                        self.shuffle(options);
                        hints = [
                            `Vì cả hai điểm $A, B$ đều thuộc tia $Ox$ và $OA < OB$ ($${oa} < ${ob}$) nên điểm $A$ nằm giữa hai điểm $O$ và $B$.`,
                            `Do đó ta có hệ thức: $OA + AB = OB$.`,
                            `Thay số vào để tính $AB$.`
                        ];
                        solutionHtml = `Trên tia $Ox$, vì $OA < OB$ ($${oa}\\text{ cm} < ${ob}\\text{ cm}$) nên điểm $A$ nằm giữa hai điểm $O$ và $B$.<br>Ta có:<br>$OA + AB = OB \\rightarrow ${oa} + AB = ${ob} \\rightarrow AB = ${ob} - ${oa} = ${ob - oa}\\text{ cm}$.`;
                    }
                    tip = "Trên cùng một tia, điểm có khoảng cách tới gốc nhỏ hơn sẽ nằm giữa gốc và điểm còn lại.";
                } else { // kho
                    if (variant === 1) {
                        const ab = self.randomInt(5, 9);
                        const bc = self.randomInt(3, ab - 1);
                        const sum = ab + bc;
                        const diff = ab - bc;
                        questionText = `Cho ba điểm $A, B, C$ thẳng hàng. Biết độ dài đoạn thẳng $AB = ${ab}\\text{ cm}$ và $BC = ${bc}\\text{ cm}$. Tính độ dài đoạn thẳng $AC$.`;
                        options = [
                            `$${sum}\\text{ cm}$ hoặc $${diff}\\text{ cm}$`,
                            `$${sum}\\text{ cm}$`,
                            `$${diff}\\text{ cm}$`,
                            `$${sum + 2}\\text{ cm}$`
                        ];
                        self.shuffle(options);
                        hints = [
                            `Đề bài không cho biết điểm nào nằm giữa các điểm còn lại, nên ta phải xét hai trường hợp.`,
                            `Trường hợp 1: Điểm $B$ nằm giữa $A$ và $C$. Khi đó $AC = AB + BC$.`,
                            `Trường hợp 2: Điểm $C$ nằm giữa $A$ và $B$. Khi đó $AC = AB - BC$.`
                        ];
                        solutionHtml = `Vì ba điểm $A, B, C$ thẳng hàng và chưa biết vị trí của chúng nên ta xét hai trường hợp:<br>- Trường hợp 1: Điểm $B$ nằm giữa $A$ and $C$. Ta có:<br>$AC = AB + BC = ${ab} + ${bc} = ${sum}\\text{ cm}$.<br>- Trường hợp 2: Điểm $C$ nằm giữa $A$ và $B$. Ta có:<br>$AC + BC = AB \\rightarrow AC = AB - BC = ${ab} - ${bc} = ${diff}\\text{ cm}$.<br>Vậy $AC$ có độ dài là $${sum}\\text{ cm}$ hoặc $${diff}\\text{ cm}$.`;
                    } else {
                        // MN = (OC - OA)/2 = (c - a)/2
                        const oa = self.randomInt(2, 4);
                        const ob = self.randomInt(oa + 2, oa + 4);
                        const oc = self.randomInt(ob + 2, ob + 4);
                        const mn = (oc - oa) / 2;
                        const mnStr = mn.toString().replace('.', ',');
                        questionText = `Trên tia $Ox$ lấy ba điểm $A, B, C$ sao cho $OA = ${oa}\\text{ cm}$, $OB = ${ob}\\text{ cm}$, $OC = ${oc}\\text{ cm}$. Gọi $M$ là trung điểm của $AB$, $N$ là trung điểm của $BC$. Tính độ dài đoạn thẳng $MN$.`;
                        options = [`$${mnStr}\\text{ cm}$`, `$${mn + 1}\\text{ cm}$`, `$${mn - 0.5}\\text{ cm}$`, `$${ob - oa}\\text{ cm}$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const randomOpt = `$${self.randomInt(1, 6)}\\text{ cm}$`;
                            if (!options.includes(randomOpt)) options.push(randomOpt);
                        }
                        self.shuffle(options);
                        hints = [
                            `Tính độ dài các đoạn thẳng $AB = OB - OA$ và $BC = OC - OB$.`,
                            `Tính $MB = AB / 2$ và $BN = BC / 2$.`,
                            `Vì điểm $B$ nằm giữa $A$ và $C$ nên $M$ và $N$ nằm ở hai bên điểm $B$. Do đó $MN = MB + BN = \\frac{AB + BC}{2}$.`
                        ];
                        solutionHtml = `Ta tính độ dài các đoạn thẳng:<br>- $AB = OB - OA = ${ob} - ${oa} = ${ob - oa}\\text{ cm}$. Trung điểm $M$ của $AB$ cho $MB = AB / 2 = ${(ob - oa) / 2}\\text{ cm}$.<br>- $BC = OC - OB = ${oc} - ${ob} = ${oc - ob}\\text{ cm}$. Trung điểm $N$ của $BC$ cho $BN = BC / 2 = ${(oc - ob) / 2}\\text{ cm}$.<br>Vì $A, B, C$ cùng nằm trên tia $Ox$ và $OA < OB < OC$ nên $B$ nằm giữa $A$ và $C$. Do đó $M$ và $N$ nằm ở hai phía đối với điểm $B$.<br>Ta có:<br>$MN = MB + BN = ${(ob - oa) / 2} + ${(oc - ob) / 2} = ${mnStr}\\text{ cm}$.`;
                    }
                    tip = "Độ dài đoạn thẳng nối hai trung điểm của hai đoạn thẳng liên tiếp bằng một nửa tổng độ dài của hai đoạn thẳng đó.";
                }
                break;
            }
            case "trung-diem": {
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const ab = self.randomInt(4, 10) * 2;
                        const ans = ab / 2;
                        const targetAmOrMb = self.randomInt(1, 2) === 1 ? "AM" : "MB";
                        questionText = `Cho đoạn thẳng $AB = ${ab}\\text{ cm}$. Gọi $M$ là trung điểm của đoạn thẳng $AB$. Tính độ dài đoạn thẳng $${targetAmOrMb}$.`;
                        options = [`$${ans}\\text{ cm}$`, `$${ab}\\text{ cm}$`, `$${ans - 1}\\text{ cm}$`, `$${ab * 2}\\text{ cm}$`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Trung điểm của đoạn thẳng chia đoạn thẳng đó thành hai phần bằng nhau.`,
                            `Công thức: $AM = MB = \\frac{AB}{2}$.`
                        ];
                        solutionHtml = `Vì $M$ là trung điểm của đoạn thẳng $AB$ nên:<br>$AM = MB = \\frac{AB}{2} = \\frac{${ab}}{2} = ${ans}\\text{ cm}$.`;
                    } else {
                        const am = self.randomInt(3, 9);
                        const ab = am * 2;
                        questionText = `Cho điểm $M$ nằm giữa hai điểm $A$ và $B$ sao cho $AM = MB = ${am}\\text{ cm}$. Tính độ dài đoạn thẳng $AB$ và cho biết $M$ có là trung điểm của $AB$ không?`;
                        options = [
                            `$AB = ${ab}\\text{ cm}$, $M$ là trung điểm của $AB$`,
                            `$AB = ${ab}\\text{ cm}$, $M$ không là trung điểm của $AB$`,
                            `$AB = ${am}\\text{ cm}$, $M$ là trung điểm của $AB$`,
                            `$AB = ${ab + 2}\\text{ cm}$, $M$ là trung điểm của $AB$`
                        ];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Vì $M$ nằm giữa $A$ và $B$ nên $AB = AM + MB$.`,
                            `Điểm $M$ nằm giữa và cách đều hai đầu mút ($AM = MB$) thì $M$ chính là trung điểm của đoạn thẳng $AB$.`
                        ];
                        solutionHtml = `Vì $M$ nằm giữa hai điểm $A$ và $B$ nên:<br>$AB = AM + MB = ${am} + ${am} = ${ab}\\text{ cm}$.<br>Lại có $AM = MB = ${am}\\text{ cm}$ nên $M$ cách đều hai đầu mút $A$ và $B$. Do đó, $M$ là trung điểm của đoạn thẳng $AB$.`;
                    }
                    tip = "Trung điểm của đoạn thẳng là điểm nằm giữa và cách đều hai đầu mút của đoạn thẳng đó.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const am = self.randomInt(4, 12);
                        const ab = am * 2;
                        questionText = `Cho điểm $M$ là trung điểm của đoạn thẳng $AB$. Biết $AM = ${am}\\text{ cm}$. Tính độ dài đoạn thẳng $AB$.`;
                        options = [`$${ab}\\text{ cm}$`, `$${am}\\text{ cm}$`, `$${am + 2}\\text{ cm}$`, `$${am / 2}\\text{ cm}$`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Vì $M$ là trung điểm của $AB$ nên độ dài đoạn thẳng $AB$ gấp đôi độ dài đoạn thẳng $AM$.`,
                            `Công thức: $AB = 2 \\cdot AM$.`
                        ];
                        solutionHtml = `Vì $M$ là trung điểm của đoạn thẳng $AB$ nên ta có:<br>$AB = 2 \\cdot AM = 2 \\cdot ${am} = ${ab}\\text{ cm}$.`;
                    } else {
                        const ab = self.randomInt(5, 12) * 2;
                        const am = ab / 2;
                        questionText = `Cho đoạn thẳng $AB = ${ab}\\text{ cm}$. Điểm $M$ thuộc đoạn thẳng $AB$ sao cho $AM = ${am}\\text{ cm}$. Hỏi khẳng định nào sau đây là **đúng nhất**?`;
                        options = [
                            `$M$ là trung điểm của $AB$ và $MB = ${am}\\text{ cm}$`,
                            `$M$ không là trung điểm của $AB$ và $MB = ${am}\\text{ cm}$`,
                            `$M$ là trung điểm của $AB$ và $MB = ${am - 2}\\text{ cm}$`,
                            `$M$ nằm ngoài đoạn thẳng $AB$`
                        ];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Vì $M$ thuộc đoạn thẳng $AB$ nên $M$ nằm giữa $A$ và $B$. Ta có $AM + MB = AB$.`,
                            `Tính $MB = AB - AM$. So sánh $AM$ và $MB$ để kết luận về trung điểm.`
                        ];
                        solutionHtml = `Vì điểm $M$ thuộc đoạn thẳng $AB$ nên $M$ nằm giữa $A$ và $B$.<br>Ta có: $AM + MB = AB \\rightarrow ${am} + MB = ${ab} \\rightarrow MB = ${ab} - ${am} = ${am}\\text{ cm}$.<br>Vì $M$ nằm giữa $A, B$ và $AM = MB = ${am}\\text{ cm}$ nên $M$ là trung điểm của đoạn thẳng $AB$.`;
                    }
                    tip = "Độ dài đoạn thẳng lớn gấp đôi khoảng cách từ trung điểm đến một đầu mút.";
                } else { // kho
                    if (variant === 1) {
                        const ab = self.randomInt(3, 6) * 4;
                        const m1 = ab / 2;
                        const m2 = m1 / 2;
                        const askType = self.randomInt(1, 2); // 1: M2M3, 2: M2B
                        if (askType === 1) {
                            const ans = ab / 2;
                            questionText = `Cho đoạn thẳng $AB = ${ab}\\text{ cm}$. Gọi $M_1$ là trung điểm của $AB$, $M_2$ là trung điểm của đoạn thẳng $AM_1$, và $M_3$ là trung điểm của đoạn thẳng $M_1B$. Tính độ dài đoạn thẳng $M_2M_3$.`;
                            options = [`$${ans}\\text{ cm}$`, `$${ans - 2}\\text{ cm}$`, `$${ans + 2}\\text{ cm}$`, `$${m2}\\text{ cm}$`];
                            // Removed inner shuffle Ch8
                            hints = [
                                `Tính độ dài $AM_1$ và $M_1B$: vì $M_1$ là trung điểm $AB$ nên $AM_1 = M_1B = \\frac{AB}{2} = ${m1}\\text{ cm}$.`,
                                `Tính độ dài $M_2M_1$ và $M_1M_3$: tương ứng là một nửa của $AM_1$ và $M_1B$.`,
                                `Vì $M_1$ nằm giữa $M_2$ và $M_3$ nên $M_2M_3 = M_2M_1 + M_1M_3$.`
                            ];
                            solutionHtml = `Vì $M_1$ là trung điểm của $AB$ nên:<br>$AM_1 = M_1B = \\frac{AB}{2} = \\frac{${ab}}{2} = ${m1}\\text{ cm}$.<br>Vì $M_2$ là trung điểm của $AM_1$ nên:<br>$M_2M_1 = \\frac{AM_1}{2} = \\frac{${m1}}{2} = ${m2}\\text{ cm}$.<br>Vì $M_3$ là trung điểm của $M_1B$ nên:<br>$M_1M_3 = \\frac{M_1B}{2} = \\frac{${m1}}{2} = ${m2}\\text{ cm}$.<br>Vì điểm $M_1$ nằm giữa hai điểm $M_2$ và $M_3$ nên ta có:<br>$M_2M_3 = M_2M_1 + M_1M_3 = ${m2} + ${m2} = ${ans}\\text{ cm}$.`;
                        } else {
                            const ans = (ab * 3) / 4;
                            questionText = `Cho đoạn thẳng $AB = ${ab}\\text{ cm}$. Gọi $M_1$ là trung điểm của $AB$, và $M_2$ là trung điểm của đoạn thẳng $AM_1$. Tính độ dài đoạn thẳng $M_2B$.`;
                            options = [`$${ans}\\text{ cm}$`, `$${m1}\\text{ cm}$`, `$${ans - 2}\\text{ cm}$`, `$${ab - 2}\\text{ cm}$`];
                            // Removed inner shuffle Ch8
                            hints = [
                                `Tính độ dài $AM_1$ và $M_1B$: vì $M_1$ là trung điểm $AB$ nên $AM_1 = M_1B = \\frac{AB}{2} = ${m1}\\text{ cm}$.`,
                                `Tính độ dài $M_2M_1$: vì $M_2$ là trung điểm $AM_1$ nên $M_2M_1 = \\frac{AM_1}{2} = ${m2}\\text{ cm}$.`,
                                `Vì $M_1$ nằm giữa $M_2$ và $B$ nên $M_2B = M_2M_1 + M_1B$.`
                            ];
                            solutionHtml = `Vì $M_1$ là trung điểm của $AB$ nên:<br>$AM_1 = M_1B = \\frac{AB}{2} = \\frac{${ab}}{2} = ${m1}\\text{ cm}$.<br>Vì $M_2$ là trung điểm của $AM_1$ nên:<br>$M_2M_1 = \\frac{AM_1}{2} = \\frac{${m1}}{2} = ${m2}\\text{ cm}$.<br>Vì điểm $M_1$ nằm giữa hai điểm $M_2$ và $B$ nên ta có:<br>$M_2B = M_2M_1 + M_1B = ${m2} + ${m1} = ${ans}\\text{ cm}$.`;
                        }
                    } else {
                        const ab = self.randomInt(3, 5) * 2;
                        const ac = self.randomInt(1, 2) * 2;
                        const ans1 = (ab + ac) / 2;
                        const ans2 = (ab - ac) / 2;
                        questionText = `Cho ba điểm $A, B, C$ thẳng hàng biết $AB = ${ab}\\text{ cm}$ và $AC = ${ac}\\text{ cm}$. Gọi $M$ là trung điểm của đoạn thẳng $BC$. Tính độ dài đoạn thẳng $AM$.`;
                        options = [
                            `$${ans1}\\text{ cm}$ hoặc $${ans2}\\text{ cm}$`,
                            `$${ans1}\\text{ cm}$`,
                            `$${ans2}\\text{ cm}$`,
                            `$${ans1 + 1}\\text{ cm}$ hoặc $${ans2 + 1}\\text{ cm}$`
                        ];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Vì đề bài không nêu rõ thứ tự các điểm nên ta phải xét hai trường hợp thẳng hàng của điểm $C$ so với đoạn thẳng $AB$.`,
                            `Trường hợp 1: $C$ nằm giữa $A$ và $B$. Khi đó $BC = AB - AC = ${ab - ac}\\text{ cm}$. Tìm $M$ là trung điểm $BC$ rồi tính $AM = AC + CM$.`,
                            `Trường hợp 2: $A$ nằm giữa $C$ và $B$. Khi đó $BC = AB + AC = ${ab + ac}\\text{ cm}$. Tìm $M$ là trung điểm $BC$ rồi tính $AM = MC - AC$.`
                        ];
                        solutionHtml = `Vì ba điểm $A, B, C$ thẳng hàng nên ta có hai trường hợp xảy ra:<br>- **Trường hợp 1:** Điểm $C$ nằm giữa $A$ và $B$. Ta có:<br>$BC = AB - AC = ${ab} - ${ac} = ${ab - ac}\\text{ cm}$.<br>Vì $M$ là trung điểm của $BC$ nên $MC = \\frac{BC}{2} = \\frac{${ab - ac}}{2} = ${ (ab - ac) / 2 }\\text{ cm}$.<br>Khi đó: $AM = AC + MC = ${ac} + ${ (ab - ac) / 2 } = ${ans1}\\text{ cm}$.<br>- **Trường hợp 2:** Điểm $A$ nằm giữa $C$ và $B$. Ta có:<br>$BC = AB + AC = ${ab} + ${ac} = ${ab + ac}\\text{ cm}$.<br>Vì $M$ là trung điểm của $BC$ nên $MC = \\frac{BC}{2} = \\frac{${ab + ac}}{2} = ${ (ab + ac) / 2 }\\text{ cm}$.<br>Vì $A$ nằm giữa $C$ và $M$ nên: $AM = MC - AC = ${ (ab + ac) / 2 } - ${ac} = ${ans2}\\text{ cm}$.<br>Vậy $AM$ có độ dài bằng $${ans1}\\text{ cm}$ hoặc $${ans2}\\text{ cm}$.`;
                    }
                    tip = "Khi gặp bài toán thẳng hàng mà chưa rõ thứ tự các điểm, hãy luôn chia các trường hợp nằm trong và nằm ngoài đoạn thẳng.";
                }
                break;
            }
            case "goc": {
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const types = ["nhọn", "vuông", "tù", "bẹt"];
                        const type = types[self.randomInt(0, 3)];
                        let ans, desc;
                        if (type === "nhọn") {
                            ans = "lớn hơn $0^\\circ$ và nhỏ hơn $90^\\circ$";
                            desc = "Góc nhọn là góc có số đo lớn hơn $0^\\circ$ và nhỏ hơn $90^\\circ$.";
                        } else if (type === "vuông") {
                            ans = "bằng $90^\\circ$";
                            desc = "Góc vuông là góc có số đo bằng $90^\\circ$.";
                        } else if (type === "tù") {
                            ans = "lớn hơn $90^\\circ$ và nhỏ hơn $180^\\circ$";
                            desc = "Góc tù là góc có số đo lớn hơn $90^\\circ$ và nhỏ hơn $180^\\circ$.";
                        } else {
                            ans = "bằng $180^\\circ$";
                            desc = "Góc bẹt là góc có số đo bằng $180^\\circ$.";
                        }
                        questionText = `Góc ${type} là góc có số đo:`;
                        options = [
                            `${ans}`,
                            `bằng $90^\\circ$`,
                            `bằng $180^\\circ$`,
                            `lớn hơn $0^\\circ$ và nhỏ hơn $90^\\circ$`,
                            `lớn hơn $90^\\circ$ và nhỏ hơn $180^\\circ$`
                        ];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`nhỏ hơn $180^\\circ$`);
                        }
                        // Removed inner shuffle Ch8
                        hints = [
                            `Hãy nhớ lại định nghĩa các loại góc: góc nhọn, góc vuông, góc tù và góc bẹt.`,
                            `Góc vuông có số đo là $90^\\circ$. Góc bẹt có số đo là $180^\\circ$.`
                        ];
                        solutionHtml = `${desc}`;
                    } else {
                        const deg = self.randomInt(1, 4) === 1 ? self.randomInt(15, 85) : (self.randomInt(1, 3) === 1 ? 90 : (self.randomInt(1, 2) === 1 ? self.randomInt(95, 175) : 180));
                        let ans;
                        if (deg < 90) ans = "Góc nhọn";
                        else if (deg === 90) ans = "Góc vuông";
                        else if (deg < 180) ans = "Góc tù";
                        else ans = "Góc bẹt";
                        
                        questionText = `Góc có số đo bằng $${deg}^\\circ$ là loại góc nào?`;
                        options = [`${ans}`, `Góc nhọn`, `Góc vuông`, `Góc tù`, `Góc bẹt`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            options.push(`Góc không xác định`);
                        }
                        // Removed inner shuffle Ch8
                        hints = [
                            `So sánh số đo $${deg}^\\circ$ với các mốc đặc biệt $90^\\circ$ và $180^\\circ$.`,
                            `Nhỏ hơn $90^\\circ$: góc nhọn; bằng $90^\\circ$: góc vuông; nằm giữa $90^\\circ$ và $180^\\circ$: góc tù; bằng $180^\\circ$: góc bẹt.`
                        ];
                        solutionHtml = `Vì $${deg}^\\circ ${deg < 90 ? '< 90^\\circ' : (deg === 90 ? '= 90^\\circ' : (deg < 180 ? '> 90^\\circ \\text{ và } < 180^\\circ' : '= 180^\\circ'))}$ nên đây là **${ans.toLowerCase()}**.`;
                    }
                    tip = "Ghi nhớ các mốc: Nhọn (< 90°) < Vuông (= 90°) < Tù (90° - 180°) < Bẹt (= 180°).";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const n = self.randomInt(5, 9);
                        const angles = (n * (n - 1)) / 2;
                        questionText = `Cho $${n}$ tia chung gốc (không có tia nào trùng nhau). Có tất cả bao nhiêu góc được tạo thành từ các tia này?`;
                        options = [`$${angles}$ góc`, `$${n}$ góc`, `$${angles - 2}$ góc`, `$${n * 2}$ góc`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Mỗi cặp tia chung gốc tạo thành một góc.`,
                            `Số góc tạo thành từ $n$ tia chung gốc là: $\\frac{n(n-1)}{2}$.`,
                            `Áp dụng công thức với $n = ${n}$.`
                        ];
                        solutionHtml = `Số góc tạo thành từ $${n}$ tia chung gốc là:<br>$\\frac{${n} \\cdot (${n} - 1)}{2} = \\frac{${n} \\cdot ${n-1}}{2} = ${angles}$ góc.`;
                    } else {
                        const pts = [5, 6, 7, 8, 9];
                        const n = pts[self.randomInt(0, pts.length - 1)];
                        const angles = (n * (n - 1)) / 2;
                        questionText = `Cho trước một số tia chung gốc phân biệt. Biết người ta đếm được tất cả $${angles}$ góc được tạo thành từ các tia đó. Hỏi ban đầu có bao nhiêu tia chung gốc?`;
                        options = [`$${n}$ tia`, `$${n - 1}$ tia`, `$${n + 1}$ tia`, `$${angles / 2}$ tia`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Áp dụng công thức số góc từ $n$ tia chung gốc: $\\frac{n(n-1)}{2} = ${angles}$.`,
                            `Suy ra $n(n-1) = ${angles * 2}$.`,
                            `Tìm hai số tự nhiên liên tiếp có tích bằng $${angles * 2}$.`
                        ];
                        solutionHtml = `Gọi số tia chung gốc ban đầu là $n$ ($n \\in \\mathbb{N}, n \\ge 2$).<br>Ta có công thức số góc tạo thành là: $\\frac{n(n-1)}{2} = ${angles} \\rightarrow n(n-1) = ${angles * 2}$.<br>Vì $${angles * 2} = ${n} \\cdot ${n-1}$, nên suy ra $n = ${n}$. Vậy ban đầu có $${n}$ tia chung gốc.`;
                    }
                    tip = "Số góc từ n tia chung gốc tính bằng công thức n(n-1)/2, tương tự như số đoạn thẳng từ n điểm thẳng hàng.";
                } else { // kho
                    if (variant === 1) {
                        const n = self.randomInt(5, 8);
                        const total = (n * (n - 1)) / 2;
                        const ans = total - 1;
                        questionText = `Cho $${n}$ tia chung gốc, trong đó có đúng hai tia đối nhau (tạo thành một góc bẹt). Hỏi có tất cả bao nhiêu góc nhỏ hơn góc bẹt được tạo thành từ các tia này?`;
                        options = [`$${ans}$ góc`, `$${total}$ góc`, `$${ans - 2}$ góc`, `$${n * 2}$ góc`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Tính tổng số góc tạo thành từ $${n}$ tia chung gốc bằng công thức: $\\frac{n(n-1)}{2}$.`,
                            `Vì có đúng hai tia đối nhau nên chỉ có đúng $1$ góc bẹt được tạo thành.`,
                            `Số góc nhỏ hơn góc bẹt sẽ bằng tổng số góc trừ đi góc bẹt đó.`
                        ];
                        solutionHtml = `Tổng số góc tạo thành từ $${n}$ tia chung gốc là:<br>$\\frac{${n} \\cdot (${n} - 1)}{2} = ${total}$ góc.<br>Vì có đúng hai tia đối nhau tạo thành góc bẹt, nên trên hình vẽ chỉ có đúng $1$ góc bẹt.<br>Số góc nhỏ hơn góc bẹt được tạo thành là:<br>${total} - 1 = ${ans}$ góc.`;
                    } else {
                        const n = self.randomInt(3, 6);
                        const ans = 2 * n * (n - 1);
                        const totalRays = 2 * n;
                        const totalAngles = (totalRays * (totalRays - 1)) / 2;
                        questionText = `Cho $${n}$ đường thẳng phân biệt cùng cắt nhau tại một điểm. Có bao nhiêu góc nhỏ hơn góc bẹt được tạo thành từ các đường thẳng này?`;
                        options = [`$${ans}$ góc`, `$${totalAngles}$ góc`, `$${ans + n}$ góc`, `$${n * (n-1)}$ góc`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Mỗi đường thẳng đi qua giao điểm tạo thành $2$ tia đối nhau. Vậy $${n}$ đường thẳng tạo thành $2 \\cdot ${n} = ${totalRays}$ tia chung gốc.`,
                            `Tính tổng số góc tạo thành từ $${totalRays}$ tia chung gốc: $\\frac{2n(2n-1)}{2}$.`,
                            `Trừ đi số góc bẹt (mỗi đường thẳng tạo ra đúng $1$ góc bẹt, tức là có $${n}$ góc bẹt).`
                        ];
                        solutionHtml = `Giao điểm của $${n}$ đường thẳng tạo ra $2 \\cdot ${n} = ${totalRays}$ tia chung gốc.<br>Tổng số góc được tạo thành từ $${totalRays}$ tia này là:<br>$\\frac{${totalRays} \\cdot (${totalRays} - 1)}{2} = \\frac{${totalRays} \\cdot ${totalRays - 1}}{2} = ${totalAngles}$ góc.<br>Trong đó, mỗi đường thẳng trong số $${n}$ đường thẳng tạo ra đúng $1$ góc bẹt. Vậy có tất cả $${n}$ góc bẹt.<br>Số góc nhỏ hơn góc bẹt tạo thành là:<br>${totalAngles} - ${n} = ${ans}$ góc.`;
                    }
                    tip = "Với n đường thẳng cắt nhau tại 1 điểm, số góc khác góc bẹt là 2n(n-1).";
                }
                break;
            }
            case "so-do-goc": {
                const variant = self.randomInt(1, 2);
                if (level === "co-ban") {
                    if (variant === 1) {
                        const a = self.randomInt(25, 75);
                        let b = self.randomInt(25, 75);
                        while (b === a) {
                            b = self.randomInt(25, 75);
                        }
                        const ans = a + b;
                        const diff = Math.abs(a - b);
                        const w1 = (diff === a || diff === b) ? diff + 15 : diff;
                        const w2 = a;
                        const w3 = b;
                        questionText = `Cho tia $Oy$ nằm giữa hai tia $Ox$ và $Oz$. Biết góc $\\widehat{xOy} = ${a}^\\circ$ và $\\widehat{yOz} = ${b}^\\circ$. Tính số đo góc $\\widehat{xOz}$.`;
                        options = [`$${ans}^\\circ$`, `$${w1}^\\circ$`, `$${w2}^\\circ$`, `$${w3}^\\circ$`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Vì tia $Oy$ nằm giữa hai tia $Ox$ và $Oz$ nên ta có đẳng thức cộng góc: $\\widehat{xOy} + \\widehat{yOz} = \\widehat{xOz}$.`,
                            `Thay số vào: $\\widehat{xOz} = ${a}^\\circ + ${b}^\\circ$.`
                        ];
                        solutionHtml = `Vì tia $Oy$ nằm giữa hai tia $Ox$ và $Oz$ nên:<br>$\\widehat{xOz} = \\widehat{xOy} + \\widehat{yOz} = ${a}^\\circ + ${b}^\\circ = ${ans}^\\circ$.`;
                    } else {
                        // Loại bỏ a=90° để tránh ans=a=90° → 3 options trùng
                        const aListSoDo2 = [40, 50, 60, 70, 80, 100, 110, 120, 130, 140];
                        const a = aListSoDo2[self.randomInt(0, aListSoDo2.length - 1)];
                        const ans = 180 - a;
                        questionText = `Cho hai góc kề bù $\\widehat{xOy}$ và $\\widehat{yOz}$. Biết số đo góc $\\widehat{xOy} = ${a}^\\circ$. Tính số đo góc $\\widehat{yOz}$.`;
                        // Tránh trùng 90° nếu ans hoặc a bằng 90
                        const w3SoDoCoBan2 = (90 === ans || 90 === a) ? 95 : 90;
                        options = [`$${ans}^\\circ$`, `$${a}^\\circ$`, `$${w3SoDoCoBan2}^\\circ$`, `$${180 + a}^\\circ$`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Hai góc kề bù có tổng số đo bằng $180^\\circ$.`,
                            `Công thức: $\\widehat{xOy} + \\widehat{yOz} = 180^\\circ$.`
                        ];
                        solutionHtml = `Vì $\\widehat{xOy}$ và $\\widehat{yOz}$ là hai góc kề bù nên ta có:<br>$\\widehat{xOy} + \\widehat{yOz} = 180^\\circ \\rightarrow ${a}^\\circ + \\widehat{yOz} = 180^\\circ \\rightarrow \\widehat{yOz} = 180^\\circ - ${a}^\\circ = ${ans}^\\circ$.`;
                    }
                    tip = "Hai góc kề bù có tổng số đo bằng 180 độ. Tia nằm giữa hai tia khác cho đẳng thức cộng góc.";
                } else if (level === "nang-cao") {
                    if (variant === 1) {
                        const hList = [2, 3, 4, 5, 8, 9, 10];
                        const h = hList[self.randomInt(0, hList.length - 1)];
                        const diff = Math.min(h, 12 - h);
                        const ans = diff * 30;
                        questionText = `Góc tạo bởi hai kim đồng hồ (kim giờ và kim phút) lúc **${h} giờ đúng** có số đo bằng bao nhiêu độ?`;
                        options = [`$${ans}^\\circ$`, `$${h * 30}^\\circ$`, `$${(12 - h) * 30}^\\circ$`, `$90^\\circ$`];
                        options = [...new Set(options)];
                        // Phần tử dự phòng đa dạng hơn để tránh lặp vô hạn
                        const fallbacks5982 = [45, 60, 120, 135, 150, 180, 210, 225].map(v => `$${v}^\\circ$`);
                        let fbIdx = 0;
                        while (options.length < 4) {
                            const candidate = (fbIdx < fallbacks5982.length) ? fallbacks5982[fbIdx++] : `$${(fbIdx++) * 15}^\\circ$`;
                            if (!options.includes(candidate)) options.push(candidate);
                        }
                        // Removed inner shuffle Ch8
                        hints = [
                            `Mặt đồng hồ hình tròn chia làm 12 khoảng số đều nhau tương ứng với $360^\\circ$.`,
                            `Mỗi khoảng số (tương ứng 1 giờ) có số đo góc là: $360^\\circ : 12 = 30^\\circ$.`,
                            `Tính số khoảng cách ngắn nhất giữa kim phút (chỉ số 12) và kim giờ (chỉ số ${h}) để tính số đo góc.`
                        ];
                        solutionHtml = `Mỗi khoảng số trên mặt đồng hồ tương ứng với góc xoay:<br>$360^\\circ : 12 = 30^\\circ$.<br>Lúc ${h} giờ đúng, kim phút chỉ số 12, kim giờ chỉ số ${h}. Khoảng cách ngắn nhất giữa hai kim là ${diff} khoảng số.<br>Do đó góc tạo thành là:<br>${diff} \\cdot 30^\\circ = ${ans}^\\circ$.`;
                    } else {
                        const a = self.randomInt(3, 6) * 20; // 60, 80, 100, 120
                        const ans = (a * 3) / 4;
                        questionText = `Cho góc $\\widehat{xOy} = ${a}^\\circ$. Vẽ tia phân giác $Ot$ của góc $\\widehat{xOy}$, sau đó vẽ tia phân giác $Oz$ của góc $\\widehat{xOt}$. Tính số đo góc $\\widehat{zOy}$.`;
                        options = [`$${ans}^\\circ$`, `$${a / 2}^\\circ$`, `$${a / 4}^\\circ$`, `$${a - 10}^\\circ$`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Vì $Ot$ là tia phân giác của $\\widehat{xOy}$ nên $\\widehat{xOt} = \\widehat{tOy} = \\frac{\\widehat{xOy}}{2} = \\frac{${a}^\\circ}{2}$.`,
                            `Vì $Oz$ là tia phân giác của $\\widehat{xOt}$ nên $\\widehat{zOt} = \\frac{\\widehat{xOt}}{2}$.`,
                            `Vì $Ot$ nằm giữa $Oz$ và $Oy$ nên ta cộng góc: $\\widehat{zOy} = \\widehat{zOt} + \\widehat{tOy}$.`
                        ];
                        solutionHtml = `Ta tính số đo các góc con:<br>- Tia $Ot$ là phân giác của $\\widehat{xOy}$ nên:<br>$\\widehat{xOt} = \\widehat{tOy} = \\frac{\\widehat{xOy}}{2} = \\frac{${a}^\\circ}{2} = ${a / 2}^\\circ$.<br>- Tia $Oz$ là phân giác của $\\widehat{xOt}$ nên:<br>$\\widehat{zOt} = \\frac{\\widehat{xOt}}{2} = \\frac{${a / 2}^\\circ}{2} = ${a / 4}^\\circ$.<br>- Vì tia $Ot$ nằm giữa hai tia $Oz$ và $Oy$ nên:<br>$\\widehat{zOy} = \\widehat{zOt} + \\widehat{tOy} = ${a / 4}^\\circ + ${a / 2}^\\circ = ${ans}^\\circ$.`;
                    }
                    tip = "Tia phân giác chia một góc thành hai góc bằng nhau và bằng một nửa góc ban đầu.";
                } else { // kho
                    if (variant === 1) {
                        const times = [
                            { h: 8, m: 20, ans: 130, desc: "Lúc 8 giờ 20 phút: Kim phút chỉ đúng số 4. Kim giờ đã đi qua số 8 được 20/60 = 1/3 khoảng giờ. Khoảng cách giữa kim giờ và kim phút là 4 khoảng giờ cộng thêm 1/3 khoảng giờ. Góc tạo thành: (4 + 1/3) * 30 = 130 độ." },
                            { h: 2, m: 30, ans: 105, desc: "Lúc 2 giờ 30 phút: Kim phút chỉ đúng số 6. Kim giờ đã đi qua số 2 được 30/60 = 1/2 khoảng giờ. Khoảng cách giữa kim giờ và kim phút là 3,5 khoảng giờ. Góc tạo thành: 3,5 * 30 = 105 độ." },
                            { h: 4, m: 10, ans: 65, desc: "Lúc 4 giờ 10 phút: Kim phút chỉ đúng số 2. Kim giờ đã đi qua số 4 được 10/60 = 1/6 khoảng giờ. Khoảng cách giữa kim giờ và kim phút là 2 khoảng giờ cộng thêm 1/6 khoảng giờ. Góc tạo thành: (2 + 1/6) * 30 = 65 độ." }
                        ];
                        const t = times[self.randomInt(0, times.length - 1)];
                        questionText = `Tính góc tạo bởi kim giờ và kim phút của đồng hồ lúc **${t.h} giờ ${t.m} phút** (lấy góc nhỏ hơn hoặc bằng $180^\\circ$).`;
                        options = [`$${t.ans}^\\circ$`, `$${t.ans - 15}^\\circ$`, `$${t.ans + 15}^\\circ$`, `$90^\\circ$`];
                        options = [...new Set(options)];
                        while (options.length < 4) {
                            const candidate = `$${self.randomInt(1, 3) * 40}^\\circ$`;
                            if (!options.includes(candidate)) options.push(candidate);
                        }
                        // Removed inner shuffle Ch8
                        hints = [
                            `Lưu ý lúc này kim giờ không chỉ đúng vạch số cũ mà đã di chuyển đi một chút tùy theo số phút.`,
                            `Trong 1 phút: kim phút quay được $6^\\circ$, kim giờ quay được $0,5^\\circ$.`,
                            `Hoặc tính số khoảng giờ lẻ giữa kim giờ và kim phút rồi nhân với $30^\\circ$.`
                        ];
                        solutionHtml = `Phân tích vị trí các kim lúc ${t.h} giờ ${t.m} phút:<br>${t.desc}`;
                    } else {
                        questionText = `Cho hai góc kề bù $\\widehat{xOy}$ và $\\widehat{yOz}$. Gọi $Om$ là tia phân giác của góc $\\widehat{xOy}$, và $On$ là tia phân giác của góc $\\widehat{yOz}$. Tính số đo góc $\\widehat{mOn}$.`;
                        options = [`$90^\\circ$`, `$180^\\circ$`, `$45^\\circ$`, `$60^\\circ$`];
                        // Removed inner shuffle Ch8
                        hints = [
                            `Hai góc kề bù $\\widehat{xOy} + \\widehat{yOz} = 180^\\circ$.`,
                            `Tia phân giác chia đôi mỗi góc: $\\widehat{mOy} = \\frac{\\widehat{xOy}}{2}$ và $\\widehat{yOn} = \\frac{\\widehat{yOz}}{2}$.`,
                            `Vì hai góc kề bù nên tia $Oy$ nằm giữa hai tia $Om$ và $On$. Cộng hai góc con lại.`
                        ];
                        solutionHtml = `Vì $\\widehat{xOy}$ và $\\widehat{yOz}$ là hai góc kề bù nên:<br>$\\widehat{xOy} + \\widehat{yOz} = 180^\\circ$.<br>Vì $Om$ là tia phân giác của $\\widehat{xOy}$ nên: $\\widehat{mOy} = \\frac{\\widehat{xOy}}{2}$.<br>Vì $On$ là tia phân giác của $\\widehat{yOz}$ nên: $\\widehat{yOn} = \\frac{\\widehat{yOz}}{2}$.<br>Vì hai góc kề bù và có các tia phân giác nằm ở hai phía đối với cạnh chung $Oy$ nên $Oy$ nằm giữa $Om$ và $On$. Ta có:<br>$\\widehat{mOn} = \\widehat{mOy} + \\widehat{yOn} = \\frac{\\widehat{xOy}}{2} + \\frac{\\widehat{yOz}}{2} = \\frac{\\widehat{xOy} + \\widehat{yOz}}{2} = \\frac{180^\\circ}{2} = 90^\\circ$.`;
                    }
                    tip = "Góc tạo bởi hai tia phân giác của hai góc kề bù luôn luôn bằng 90 độ (góc vuông).";
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
    if (typeof root !== 'undefined') root.chapter6_geometry_plane = ChapterModule;
})(typeof window !== 'undefined' ? window : global);
