module.exports = {
  metadata: {
    subject: "math",
    grade: 6,
    chapter: 2,
    title: "Tính chia hết trong tập hợp các số tự nhiên",
    totalTemplates: 25
  },
  templates: [
    {
      id: "c2_001",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 12, max: 36 },
        k: { type: "int", min: 2, max: 6 }
      },
      constraints: [],
      formulas: {
        b: "a * k",
        ans: "Chia hết",
        w1: "Không chia hết",
        w2: "Chia có dư 1",
        w3: "Chia có dư 2"
      },
      question: "Số {b} có chia hết cho {a} không?",
      hint: "Kiểm tra xem {b} có bằng {a} nhân với một số tự nhiên hay không.",
      solution: "Vì ${b} = ${a} \\times ${k}$, nên số {b} chia hết cho {a}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["quan hệ chia hết"]
    },
    {
      id: "c2_002",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        k: { type: "int", min: 11, max: 49 }
      },
      constraints: [],
      formulas: {
        nEven: "k * 2",
        nOdd: "k * 2 + 1",
        ans: "nEven",
        w1: "nOdd",
        w2: "nOdd + 2",
        w3: "nOdd + 4"
      },
      question: "Trong các số sau, số nào chia hết cho 2?",
      hint: "Các số có chữ số tận cùng là 0, 2, 4, 6, 8 thì chia hết cho 2.",
      solution: "Số {nEven} có chữ số tận cùng là số chẵn nên chia hết cho 2.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["dấu hiệu chia hết cho 2"]
    },
    {
      id: "c2_003",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        k: { type: "int", min: 10, max: 50 }
      },
      constraints: [],
      formulas: {
        n5: "k * 5",
        wNum1: "k * 5 + 1",
        wNum2: "k * 5 + 2",
        wNum3: "k * 5 + 3",
        ans: "n5",
        w1: "wNum1",
        w2: "wNum2",
        w3: "wNum3"
      },
      question: "Trong các số sau, số nào chia hết cho 5?",
      hint: "Các số có chữ số tận cùng là 0 hoặc 5 thì chia hết cho 5.",
      solution: "Số {n5} có chữ số tận cùng là 0 hoặc 5 nên chia hết cho 5.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["dấu hiệu chia hết cho 5"]
    },
    {
      id: "c2_004",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        p: { type: "choice", options: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31] }
      },
      constraints: [],
      formulas: {
        ans: "p",
        w1: "p === 2 ? 4 : (p + 1)",
        w2: "p === 2 ? 6 : (p % 2 === 1 ? p + 3 : p + 2)",
        w3: "9"
      },
      question: "Trong các số sau, số nào là số nguyên tố?",
      hint: "Số nguyên tố là số tự nhiên lớn hơn 1, chỉ có 2 ước là 1 và chính nó.",
      solution: "Số {ans} chỉ có hai ước là 1 và {ans}, nên là số nguyên tố.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["số nguyên tố"]
    },
    {
      id: "c2_005",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 2, max: 5 },
        b: { type: "int", min: 2, max: 4 }
      },
      constraints: ["a !== b"],
      formulas: {
        g: 6,
        numA: "a * g",
        numB: "b * g",
        ans: "(() => { const gcd = (x, y) => y === 0 ? x : gcd(y, x % y); return gcd(numA, numB); })()",
        w1: "(ans + 2 === ans) ? ans + 4 : ans + 2",
        w2: "(ans - 2 > 0) ? ans - 2 : ans + 3",
        w3: "ans * 2"
      },
      question: "Tìm ước chung lớn nhất của {numA} và {numB} (ƯCLN({numA}, {numB})):",
      hint: "Phân tích hai số ra thừa số nguyên tố rồi chọn các thừa số chung với số mũ nhỏ nhất.",
      solution: "ƯCLN({numA}, {numB}) = {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["ƯCLN"]
    },
    {
      id: "c2_006",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "choice", options: [4, 6, 8, 9, 10, 12] },
        b: { type: "choice", options: [6, 8, 10, 15, 18, 20] }
      },
      constraints: ["a !== b"],
      formulas: {
        ans: "(() => { const gcd = (x, y) => y === 0 ? x : gcd(y, x % y); return (a * b) / gcd(a, b); })()",
        w1: "ans + a",
        w2: "ans - a > 0 ? ans - a : ans + b",
        w3: "a * b === ans ? ans + 10 : a * b"
      },
      question: "Tìm bội chung nhỏ nhất của {a} và {b} (BCNN({a}, {b})):",
      hint: "Phân tích ra thừa số nguyên tố rồi lấy các thừa số chung và riêng với số mũ lớn nhất.",
      solution: "BCNN({a}, {b}) = {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["BCNN"]
    },
    {
      id: "c2_007",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        tram: { type: "int", min: 1, max: 9 },
        chuc: { type: "int", min: 0, max: 9 }
      },
      constraints: [],
      formulas: {
        sumKnown: "tram + chuc",
        ans: "(9 - (sumKnown % 9)) % 9",
        w1: "(ans + 1) % 10",
        w2: "(ans + 2) % 10",
        w3: "(ans + 3) % 10"
      },
      question: "Tìm chữ số $x$ để số $\\overline{{tram}{chuc}x}$ chia hết cho 9:",
      hint: "Một số chia hết cho 9 khi tổng các chữ số của nó chia hết cho 9.",
      solution: "Tổng các chữ số là ${tram} + {chuc} + x = {sumKnown} + x$. Để chia hết cho 9 thì $x = {ans}$.",
      options: ["$x = {ans}$", "$x = {w1}$", "$x = {w2}$", "$x = {w3}$"],
      correctIndex: 0,
      tags: ["dấu hiệu chia hết cho 9", "tìm chữ số"]
    },
    {
      id: "c2_008",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        num: { type: "choice", options: [12, 18, 20, 24, 30, 36, 40, 48, 60] }
      },
      constraints: [],
      formulas: {
        ans: "num === 12 ? '2^2 \\cdot 3' : num === 18 ? '2 \\cdot 3^2' : num === 20 ? '2^2 \\cdot 5' : num === 24 ? '2^3 \\cdot 3' : num === 30 ? '2 \\cdot 3 \\cdot 5' : num === 36 ? '2^2 \\cdot 3^2' : num === 40 ? '2^3 \\cdot 5' : num === 48 ? '2^4 \\cdot 3' : '2^2 \\cdot 3 \\cdot 5'",
        w1: "num === 12 ? '2 \\cdot 6' : num === 18 ? '2 \\cdot 9' : num === 20 ? '4 \\cdot 5' : num === 24 ? '4 \\cdot 6' : num === 30 ? '5 \\cdot 6' : num === 36 ? '4 \\cdot 9' : num === 40 ? '4 \\cdot 10' : num === 48 ? '6 \\cdot 8' : '6 \\cdot 10'",
        w2: "num === 12 ? '3 \\cdot 4' : num === 18 ? '3 \\cdot 6' : num === 20 ? '2 \\cdot 10' : num === 24 ? '3 \\cdot 8' : num === 30 ? '3 \\cdot 10' : num === 36 ? '3 \\cdot 12' : num === 40 ? '8 \\cdot 5' : num === 48 ? '3 \\cdot 16' : '4 \\cdot 15'",
        w3: "num === 12 ? '2^3 \\cdot 3' : num === 18 ? '2^2 \\cdot 3^2' : num === 20 ? '2^3 \\cdot 5' : num === 24 ? '2^2 \\cdot 3^2' : num === 30 ? '2^2 \\cdot 3 \\cdot 5' : num === 36 ? '2^3 \\cdot 3^2' : num === 40 ? '2^4 \\cdot 5' : num === 48 ? '2^3 \\cdot 3^2' : '2^3 \\cdot 3 \\cdot 5'"
      },
      question: "Phân tích số {num} ra thừa số nguyên tố được kết quả là:",
      hint: "Chia liên tiếp cho các số nguyên tố từ nhỏ đến lớn.",
      solution: "Phân tích {num} ra thừa số nguyên tố: ${num} = {ans}$.",
      options: ["${ans}$", "${w1}$", "${w2}$", "${w3}$"],
      correctIndex: 0,
      tags: ["thừa số nguyên tố"]
    },
    {
      id: "c2_009",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "choice", options: [12, 16, 20, 24] },
        b: { type: "choice", options: [18, 24, 30, 36] }
      },
      constraints: ["a !== b"],
      formulas: {
        g: "(() => { const gcd = (x, y) => y === 0 ? x : gcd(y, x % y); return gcd(a, b); })()",
        num: "a / g",
        den: "b / g",
        ans: "'\\\\frac{' + num + '}{' + den + '}'",
        w1: "'\\\\frac{' + (num + 1) + '}{' + den + '}'",
        w2: "'\\\\frac{' + num + '}{' + (den + 1) + '}'",
        w3: "'\\\\frac{' + a + '}{' + b + '}'"
      },
      question: "Rút gọn phân số $\\frac{{a}}{{b}}$ về phân số tối giản:",
      hint: "Chia cả tử và mẫu cho ƯCLN({a}, {b}).",
      solution: "ƯCLN({a}, {b}) = {g}. Chia cả tử và mẫu cho {g} ta được phân số tối giản là ${ans}$.",
      options: ["${ans}$", "${w1}$", "${w2}$", "${w3}$"],
      correctIndex: 0,
      tags: ["rút gọn phân số", "ƯCLN"]
    },
    {
      id: "c2_010",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        nam: { type: "int", min: 18, max: 30 },
        nu: { type: "int", min: 12, max: 24 }
      },
      constraints: ["nam % 6 === 0", "nu % 6 === 0"],
      formulas: {
        ans: "(() => { const gcd = (x, y) => y === 0 ? x : gcd(y, x % y); return gcd(nam, nu); })()",
        w1: "ans + 2",
        w2: "ans - 2 > 0 ? ans - 2 : ans + 3",
        w3: "ans * 2"
      },
      question: "Một đội học sinh gồm {nam} nam và {nu} nữ. Muốn chia thành nhiều nhất bao nhiêu tổ sao cho số nam và số nữ ở mỗi tổ đều bằng nhau?",
      hint: "Số tổ nhiều nhất chính là ƯCLN({nam}, {nu}).",
      solution: "Số tổ nhiều nhất là ƯCLN({nam}, {nu}) = {ans} tổ.",
      options: ["{ans} tổ", "{w1} tổ", "{w2} tổ", "{w3} tổ"],
      correctIndex: 0,
      tags: ["toán thực tế", "ƯCLN"]
    },
    {
      id: "c2_011",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        t1: { type: "choice", options: [10, 12, 15] },
        t2: { type: "choice", options: [15, 20, 25] }
      },
      constraints: ["t1 !== t2"],
      formulas: {
        ans: "(() => { const gcd = (x, y) => y === 0 ? x : gcd(y, x % y); return (t1 * t2) / gcd(t1, t2); })()",
        w1: "ans + t1",
        w2: "ans - t1",
        w3: "t1 * t2 === ans ? ans + 30 : t1 * t2"
      },
      question: "Hai bạn An và Bình cùng trực nhật vào ngày đầu tuần. An cứ {t1} ngày trực một lần, Bình cứ {t2} ngày trực một lần. Sau ít nhất bao nhiêu ngày nữa thì hai bạn lại cùng trực nhật?",
      hint: "Số ngày ít nhất để hai bạn lại cùng trực nhật là BCNN({t1}, {t2}).",
      solution: "Số ngày ít nhất là BCNN({t1}, {t2}) = {ans} ngày.",
      options: ["{ans} ngày", "{w1} ngày", "{w2} ngày", "{w3} ngày"],
      correctIndex: 0,
      tags: ["toán thực tế", "BCNN"]
    },
    {
      id: "c2_012",
      level: "kho",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 3, max: 6 }
      },
      constraints: [],
      formulas: {
        k: "a * 2 + 1",
        ans: "(() => { const p = 2 * a + 1; for(let i=2; i<=Math.sqrt(p); i++) if(p%i===0) return 'Hợp số'; return 'Số nguyên tố'; })()",
        w1: "Hợp số",
        w2: "Số vô tỉ",
        w3: "Số chẵn"
      },
      question: "Số tự nhiên $A = {k}$ là số nguyên tố hay hợp số?",
      hint: "Kiểm tra xem số {k} có ước nào khác 1 và {k} hay không.",
      solution: "Xét số {k}, nó là {ans}.",
      options: ["{ans}", "{w1 === ans ? 'Số nguyên tố' : w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["số nguyên tố", "hợp số"]
    },
    {
      id: "c2_013",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 10, max: 20 },
        b: { type: "int", min: 10, max: 20 }
      },
      constraints: ["a % 5 === 0", "b % 5 === 0"],
      formulas: {
        ans: "Chia hết cho 5",
        w1: "Không chia hết cho 5",
        w2: "Chia cho 5 dư 1",
        w3: "Chia cho 5 dư 2"
      },
      question: "Tổng ${a} + ${b}$ có chia hết cho 5 không?",
      hint: "Áp dụng tính chất chia hết của một tổng: Nếu $a \\vdots m$ và $b \\vdots m$ thì $(a+b) \\vdots m$.",
      solution: "Vì ${a} \\vdots 5$ và ${b} \\vdots 5$ nên tổng (${a} + ${b}) chia hết cho 5.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["tính chất chia hết của tổng"]
    },
    {
      id: "c2_014",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        n: { type: "choice", options: [6, 8, 12, 18, 20] }
      },
      constraints: [],
      formulas: {
        ans: "(() => { let c = 0; for(let i=1; i<=n; i++) if(n%i===0) c++; return c; })()",
        w1: "ans + 1",
        w2: "ans - 1",
        w3: "ans + 2"
      },
      question: "Số tự nhiên {n} có tất cả bao nhiêu ước?",
      hint: "Liệt kê tất cả các số tự nhiên mà {n} chia hết.",
      solution: "Số {n} có tất cả {ans} ước.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["ước của một số"]
    },
    {
      id: "c2_015",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        k: { type: "int", min: 2, max: 5 }
      },
      constraints: [],
      formulas: {
        ans: "2 * k + 1",
        w1: "2 * k",
        w2: "2 * k + 2",
        w3: "2 * k - 1"
      },
      question: "Dạng tổng quát của một số tự nhiên lẻ là:",
      hint: "Số chẵn có dạng $2k$, số lẻ có dạng $2k + 1$ ($k \\in \\mathbb{N}$).",
      solution: "Dạng tổng quát của số tự nhiên lẻ là $2k + 1$ với $k \\in \\mathbb{N}$.",
      options: ["$2k + 1$", "$2k$", "$2k + 2$", "$3k$"],
      correctIndex: 0,
      tags: ["số chẵn lẻ", "tổng quát"]
    },
    {
      id: "c2_016",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 7, max: 13 }
      },
      constraints: [],
      formulas: {
        ans: "1",
        w1: "a",
        w2: "a * 2",
        w3: "0"
      },
      question: "Ước chung lớn nhất của số 1 và số {a} là:",
      hint: "Số 1 chỉ có ước là 1, nên ƯCLN của 1 với mọi số tự nhiên đều là 1.",
      solution: "ƯCLN(1, {a}) = 1.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["ƯCLN", "tính chất"]
    },
    {
      id: "c2_017",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "choice", options: [3, 5, 7, 11] },
        b: { type: "choice", options: [4, 6, 8, 9] }
      },
      constraints: [],
      formulas: {
        ans: "a * b",
        w1: "ans + a",
        w2: "ans - b",
        w3: "ans + b"
      },
      question: "Vì {a} và {b} là hai số nguyên tố cùng nhau nên BCNN({a}, {b}) bằng:",
      hint: "BCNN của hai số nguyên tố cùng nhau bằng tích của hai số đó.",
      solution: "BCNN({a}, {b}) = ${a} \\times ${b} = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["BCNN", "nguyên tố cùng nhau"]
    },
    {
      id: "c2_018",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 10, max: 20 },
        b: { type: "int", min: 2, max: 4 }
      },
      constraints: [],
      formulas: {
        m: "a * b",
        ans: "a",
        w1: "m",
        w2: "b",
        w3: "1"
      },
      question: "Vì {m} chia hết cho {a} nên ƯCLN({m}, {a}) bằng:",
      hint: "Nếu $a \\vdots b$ thì ƯCLN($a, b) = b$.",
      solution: "Vì ${m} \\vdots ${a} nên ƯCLN({m}, {a}) = {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["ƯCLN", "tính chất chia hết"]
    },
    {
      id: "c2_019",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 10, max: 20 },
        b: { type: "int", min: 2, max: 4 }
      },
      constraints: [],
      formulas: {
        m: "a * b",
        ans: "m",
        w1: "a",
        w2: "b",
        w3: "1"
      },
      question: "Vì {m} chia hết cho {a} nên BCNN({m}, {a}) bằng:",
      hint: "Nếu $a \\vdots b$ thì BCNN($a, b) = a$.",
      solution: "Vì ${m} \\vdots ${a} nên BCNN({m}, {a}) = {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["BCNN", "tính chất chia hết"]
    },
    {
      id: "c2_020",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "choice", options: [15, 21, 27, 33] }
      },
      constraints: [],
      formulas: {
        ans: "3",
        w1: "2",
        w2: "5",
        w3: "9"
      },
      question: "Số {a} có ước nguyên tố là số nào?",
      hint: "Tìm số nguyên tố mà {a} chia hết.",
      solution: "Số {a} chia hết cho số nguyên tố 3.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["ước nguyên tố"]
    },
    {
      id: "c2_021",
      level: "kho",
      type: "multiple-choice",
      variables: {
        n: { type: "int", min: 2, max: 6 }
      },
      constraints: [],
      formulas: {
        ans: "1",
        w1: "n",
        w2: "n + 1",
        w3: "2"
      },
      question: "Ước chung lớn nhất của hai số tự nhiên liên tiếp $n$ và $n + 1$ là:",
      hint: "Gọi $d = ƯCLN(n, n+1)$, ta có $(n+1) - n = 1 \\vdots d$.",
      solution: "Hai số tự nhiên liên tiếp luôn nguyên tố cùng nhau nên ƯCLN($n, n+1) = 1$.",
      options: ["1", "$n$", "$n + 1$", "2"],
      correctIndex: 0,
      tags: ["ƯCLN", "số liên tiếp", "nâng cao"]
    },
    {
      id: "c2_022",
      level: "kho",
      type: "multiple-choice",
      variables: {
        p: { type: "choice", options: [5, 7, 11, 13, 17] }
      },
      constraints: [],
      formulas: {
        ans: "Hợp số",
        w1: "Số nguyên tố",
        w2: "Số lẻ",
        w3: "Không xác định"
      },
      question: "Cho $p$ là số nguyên tố lớn hơn 3. Số $(p - 1)(p + 1)$ là:",
      hint: "Vì $p$ là số nguyên tố $> 3$ nên $p$ lẻ và không chia hết cho 3. Khi đó $(p-1)(p+1)$ chia hết cho 24.",
      solution: "Với $p > 3$ nguyên tố, $(p-1)(p+1) \\vdots 24$ nên luôn là hợp số.",
      options: ["Hợp số", "Số nguyên tố", "Số lẻ", "Không xác định"],
      correctIndex: 0,
      tags: ["số nguyên tố", "tính chất nâng cao"]
    },
    {
      id: "c2_023",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        k: { type: "int", min: 10, max: 40 }
      },
      constraints: [],
      formulas: {
        n: "k * 3",
        ans: "n",
        w1: "n + 1",
        w2: "n + 2",
        w3: "n + 4"
      },
      question: "Trong các số sau, số nào chia hết cho 3?",
      hint: "Một số chia hết cho 3 khi tổng các chữ số của nó chia hết cho 3.",
      solution: "Số {n} có tổng các chữ số chia hết cho 3.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["dấu hiệu chia hết cho 3"]
    },
    {
      id: "c2_024",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 2, max: 5 },
        b: { type: "int", min: 2, max: 4 }
      },
      constraints: [],
      formulas: {
        ans: "(a + 1) * (b + 1)",
        w1: "a * b",
        w2: "ans + 2",
        w3: "ans - 2"
      },
      question: "Số tự nhiên $N = 2^{a} \\cdot 3^{b}$ có bao nhiêu ước số?",
      hint: "Công thức tính số ước: $(a + 1)(b + 1)$.",
      solution: "Số ước của $N$ là: $({a} + 1)({b} + 1) = {ans}$ ước.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["số ước", "công thức số ước"]
    },
    {
      id: "c2_025",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        x: { type: "int", min: 15, max: 45 }
      },
      constraints: [],
      formulas: {
        ans: "x % 2 === 0 ? 'Số chẵn' : 'Số lẻ'",
        w1: "x % 2 === 0 ? 'Số lẻ' : 'Số chẵn'",
        w2: "Số nguyên tố",
        w3: "Không xác định"
      },
      question: "Tích của một số chẵn và một số lẻ bất kỳ luôn là:",
      hint: "Số chẵn nhân với bất kỳ số nguyên nào đều cho kết quả là số chẵn.",
      solution: "Tích của một số chẵn và một số lẻ luôn là một số chẵn.",
      options: ["Số chẵn", "Số lẻ", "Số nguyên tố", "Không xác định"],
      correctIndex: 0,
      tags: ["chẵn lẻ", "tính chất phép nhân"]
    }
  ]
};;
