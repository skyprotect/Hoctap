const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '../../data/math/grade6');
fs.mkdirSync(outDir, { recursive: true });

// ==========================================
// CHƯƠNG 1: TẬP HỢP VÀ SỐ TỰ NHIÊN (25 templates)
// ==========================================
const chapter1 = {
  metadata: {
    subject: "math",
    grade: 6,
    chapter: 1,
    title: "Tập hợp các số tự nhiên",
    totalTemplates: 25
  },
  templates: [
    {
      id: "c1_001",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 2, max: 6 },
        k: { type: "int", min: 3, max: 5 }
      },
      constraints: ["k >= 3"],
      formulas: {
        b: "a + k",
        cnt: "b - a",
        ans: "cnt",
        w1: "(cnt + 1 === ans) ? cnt + 2 : cnt + 1",
        w2: "(cnt - 1 === ans || cnt - 1 === w1) ? cnt + 3 : cnt - 1",
        w3: "(b - a + 1 === ans || b - a + 1 === w1 || b - a + 1 === w2) ? cnt + 4 : b - a + 1"
      },
      question: "Cho tập hợp $A = \\{x \\in \\mathbb{N} \\mid {a} < x \\le {b}\\}$. Số phần tử của tập hợp $A$ là bao nhiêu?",
      hint: "Phần tử của tập hợp $A$ lớn hơn {a} và nhỏ hơn hoặc bằng {b}.",
      solution: "Tập hợp $A = \\{{a + 1}; ...; {b}\\}$. Số phần tử là: ${b} - {a} = {ans}$ phần tử.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["tập hợp", "số phần tử"]
    },
    {
      id: "c1_002",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        start: { type: "int", min: 1, max: 8 }
      },
      constraints: [],
      formulas: {
        s1: "start",
        s2: "start + 1",
        s3: "start + 2",
        s4: "start + 3",
        ans: "s4 - s1 + 1",
        w1: "ans + 1",
        w2: "ans - 1",
        w3: "ans + 2"
      },
      question: "Tập hợp $B = \\{{s1}; {s2}; {s3}; {s4}\\}$ có bao nhiêu phần tử?",
      hint: "Đếm các số được liệt kê trong dấu ngoặc nhọn.",
      solution: "Tập hợp $B$ có các phần tử phân biệt là {s1}, {s2}, {s3}, {s4}, tổng cộng có {ans} phần tử.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["tập hợp", "đếm phần tử"]
    },
    {
      id: "c1_003",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 10, max: 25 },
        step: { type: "int", min: 2, max: 4 },
        n: { type: "int", min: 15, max: 30 }
      },
      constraints: ["step >= 2"],
      formulas: {
        b: "a + (n - 1) * step",
        ans: "n",
        w1: "n + 1",
        w2: "n - 1",
        w3: "n + 2"
      },
      question: "Cho tập hợp $C = \\{{a}; {a + step}; {a + 2 * step}; ...; {b}\\}$. Tập hợp $C$ có bao nhiêu phần tử?",
      hint: "Công thức tính số phần tử của dãy số cách đều: (Số cuối - Số đầu) : khoảng cách + 1.",
      solution: "Số phần tử của tập hợp $C$ là: $({b} - {a}) : {step} + 1 = {ans}$ phần tử.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["tập hợp", "dãy số cách đều"]
    },
    {
      id: "c1_004",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        tram: { type: "int", min: 1, max: 9 },
        chuc: { type: "int", min: 0, max: 9 },
        donvi: { type: "int", min: 0, max: 9 }
      },
      constraints: ["tram !== chuc", "chuc !== donvi"],
      formulas: {
        num: "tram * 100 + chuc * 10 + donvi",
        ans: "tram",
        w1: "(chuc === ans) ? ((donvi === ans) ? (tram + 1) % 9 + 1 : donvi) : chuc",
        w2: "(donvi === ans || donvi === w1) ? (tram + 2) % 9 + 1 : donvi",
        w3: "(tram + 3) % 9 + 1"
      },
      question: "Trong số tự nhiên {num}, chữ số hàng trăm là chữ số nào?",
      hint: "Số có 3 chữ số: chữ số đầu tiên bên trái là hàng trăm.",
      solution: "Trong số {num}, chữ số hàng trăm là {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["ghi số tự nhiên", "hàng và lớp"]
    },
    {
      id: "c1_005",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        val: { type: "choice", options: [4, 9, 14, 19, 24, 29] }
      },
      constraints: [],
      formulas: {
        ans: "val === 4 ? 'IV' : val === 9 ? 'IX' : val === 14 ? 'XIV' : val === 19 ? 'XIX' : val === 24 ? 'XXIV' : 'XXIX'",
        w1: "val === 4 ? 'VI' : val === 9 ? 'XI' : val === 14 ? 'XVI' : val === 19 ? 'XXI' : val === 24 ? 'XXVI' : 'XXXI'",
        w2: "val === 4 ? 'IIII' : val === 9 ? 'VIIII' : val === 14 ? 'XIIII' : val === 19 ? 'XVIIII' : val === 24 ? 'XXIIII' : 'XXVIIII'",
        w3: "val === 4 ? 'V' : val === 9 ? 'X' : val === 14 ? 'XV' : val === 19 ? 'XX' : val === 24 ? 'XXV' : 'XXX'"
      },
      question: "Số La Mã biểu diễn số tự nhiên {val} là:",
      hint: "Số 4 là IV, số 9 là IX, số 10 là X.",
      solution: "Số tự nhiên {val} viết dưới dạng số La Mã là {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["số La Mã"]
    },
    {
      id: "c1_006",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        base: { type: "int", min: 2, max: 5 },
        m: { type: "int", min: 2, max: 4 },
        n: { type: "int", min: 2, max: 4 }
      },
      constraints: [],
      formulas: {
        sumExp: "m + n",
        ans: "base + '^{' + sumExp + '}'",
        w1: "base + '^{' + (m * n) + '}'",
        w2: "(base * 2) + '^{' + sumExp + '}'",
        w3: "base + '^{' + (m + n + 1) + '}'"
      },
      question: "Kết quả của phép nhân hai lũy thừa cùng cơ số: ${base}^{m} \\cdot ${base}^{n}$ là:",
      hint: "Khi nhân hai lũy thừa cùng cơ số: $a^m \\cdot a^n = a^{m+n}$.",
      solution: "Áp dụng công thức nhân hai lũy thừa cùng cơ số: ${base}^{m} \\cdot ${base}^{n} = ${base}^{m + n} = ${base}^{sumExp}$.",
      options: ["${ans}$", "${w1}$", "${w2}$", "${w3}$"],
      correctIndex: 0,
      tags: ["lũy thừa", "nhân lũy thừa"]
    },
    {
      id: "c1_007",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        base: { type: "int", min: 3, max: 7 },
        m: { type: "int", min: 4, max: 8 },
        n: { type: "int", min: 2, max: 3 }
      },
      constraints: ["m > n"],
      formulas: {
        diffExp: "m - n",
        ans: "base + '^{' + diffExp + '}'",
        w1: "base + '^{' + (m + n) + '}'",
        w2: "base + '^{' + Math.floor(m / n) + '}'",
        w3: "(base - 1) + '^{' + diffExp + '}'"
      },
      question: "Kết quả của phép chia hai lũy thừa cùng cơ số: ${base}^{m} : ${base}^{n}$ là:",
      hint: "Khi chia hai lũy thừa cùng cơ số: $a^m : a^n = a^{m-n}$ (với $a \\ne 0, m \\ge n$).",
      solution: "Áp dụng công thức chia hai lũy thừa cùng cơ số: ${base}^{m} : ${base}^{n} = ${base}^{m - n} = ${base}^{diffExp}$.",
      options: ["${ans}$", "${w1}$", "${w2}$", "${w3}$"],
      correctIndex: 0,
      tags: ["lũy thừa", "chia lũy thừa"]
    },
    {
      id: "c1_008",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 10, max: 30 },
        b: { type: "int", min: 2, max: 5 },
        c: { type: "int", min: 2, max: 6 }
      },
      constraints: [],
      formulas: {
        ans: "a + b * c",
        w1: "(a + b) * c",
        w2: "ans + b",
        w3: "(ans - c === w1 || ans - c === w2) ? ans + 2 * b : ans - c"
      },
      question: "Tính giá trị của biểu thức: $A = {a} + {b} \\cdot {c}$",
      hint: "Thực hiện phép nhân trước, phép cộng sau.",
      solution: "$A = {a} + {b} \\cdot {c} = {a} + {b * c} = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["thứ tự phép tính"]
    },
    {
      id: "c1_009",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 2, max: 4 },
        exp: { type: "int", min: 2, max: 3 },
        b: { type: "int", min: 5, max: 15 },
        c: { type: "int", min: 2, max: 4 }
      },
      constraints: [],
      formulas: {
        powVal: "Math.pow(a, exp)",
        ans: "powVal * c - b",
        w1: "powVal * (c - b > 0 ? c - b : 2)",
        w2: "ans + 4",
        w3: "(ans - 4 === w1 || ans - 4 === w2) ? ans + 8 : ans - 4"
      },
      question: "Tính giá trị biểu thức: $B = {a}^{exp} \\cdot {c} - {b}$",
      hint: "Thực hiện nâng lên lũy thừa trước, sau đó đến nhân chia, cuối cùng là cộng trừ.",
      solution: "$B = {a}^{exp} \\cdot {c} - {b} = {powVal} \\cdot {c} - {b} = {powVal * c} - {b} = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["thứ tự phép tính", "lũy thừa"]
    },
    {
      id: "c1_010",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        x: { type: "int", min: 3, max: 8 },
        k: { type: "int", min: 2, max: 5 },
        m: { type: "int", min: 10, max: 30 }
      },
      constraints: [],
      formulas: {
        rhs: "m + k * x",
        ans: "x",
        w1: "x + 1",
        w2: "x - 1",
        w3: "x + 2"
      },
      question: "Tìm số tự nhiên $x$, biết: ${k} \\cdot x + {m} = {rhs}$",
      hint: "Chuyển {m} sang vế phải rồi chia cho {k}.",
      solution: "${k} \\cdot x = {rhs} - {m} = {k * x} \\implies x = {k * x} : {k} = {ans}$.",
      options: ["$x = {ans}$", "$x = {w1}$", "$x = {w2}$", "$x = {w3}$"],
      correctIndex: 0,
      tags: ["tìm x", "thứ tự phép tính"]
    },
    {
      id: "c1_011",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        common: { type: "int", min: 15, max: 45 },
        a: { type: "int", min: 12, max: 48 },
        b: { type: "int", min: 10, max: 50 }
      },
      constraints: ["(a + b) % 10 === 0"],
      formulas: {
        sumAB: "a + b",
        ans: "common * sumAB",
        w1: "common * (sumAB + 10)",
        w2: "ans - common",
        w3: "ans + common * 2"
      },
      question: "Tính nhanh: $M = {common} \\cdot {a} + {common} \\cdot {b}$",
      hint: "Đặt thừa số chung {common} ra ngoài: $M = {common} \\cdot ({a} + {b})$.",
      solution: "$M = {common} \\cdot ({a} + {b}) = {common} \\cdot {sumAB} = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["tính nhanh", "thừa số chung"]
    },
    {
      id: "c1_012",
      level: "kho",
      type: "multiple-choice",
      variables: {
        n: { type: "int", min: 20, max: 50 }
      },
      constraints: ["n % 2 === 0"],
      formulas: {
        ans: "(n * (n + 1)) / 2",
        w1: "((n + 1) * (n + 2)) / 2",
        w2: "ans + n",
        w3: "ans - n"
      },
      question: "Tính tổng dãy số tự nhiên liên tiếp: $S = 1 + 2 + 3 + ... + {n}$",
      hint: "Tổng $S = \\frac{n(n+1)}{2}$.",
      solution: "Tổng các số tự nhiên liên tiếp từ 1 đến {n} là: $S = \\frac{{n} \\cdot ({n} + 1)}{2} = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["tổng dãy số", "nâng cao"]
    },
    {
      id: "c1_013",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        n: { type: "int", min: 2, max: 4 }
      },
      constraints: [],
      formulas: {
        ans: "Math.pow(2, n)",
        w1: "ans + 2",
        w2: "ans - 2 > 0 ? ans - 2 : ans + 4",
        w3: "2 * n"
      },
      question: "Một tập hợp có {n} phần tử thì có tất cả bao nhiêu tập hợp con?",
      hint: "Tập hợp có $n$ phần tử sẽ có $2^n$ tập hợp con (kể cả tập rỗng và chính nó).",
      solution: "Số tập hợp con của tập hợp có {n} phần tử là: $2^{n} = {ans}$ tập hợp con.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["tập hợp con"]
    },
    {
      id: "c1_014",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        books: { type: "int", min: 4, max: 8 },
        priceBook: { type: "int", min: 8, max: 15 },
        pens: { type: "int", min: 2, max: 5 },
        pricePen: { type: "int", min: 3, max: 6 }
      },
      constraints: [],
      formulas: {
        pBook: "priceBook * 1000",
        pPen: "pricePen * 1000",
        total: "books * pBook + pens * pPen",
        ans: "total",
        w1: "total + 5000",
        w2: "total - 5000",
        w3: "total + 10000"
      },
      question: "Bạn Minh mua {books} quyển vở giá {pBook} đồng/quyển và {pens} cái bút giá {pPen} đồng/cái. Tổng số tiền Minh phải trả là:",
      hint: "Tính tiền vở + tiền bút.",
      solution: "Tổng số tiền = ${books} \\times {pBook} + ${pens} \\times {pPen} = {ans}$ đồng.",
      options: ["{ans} đồng", "{w1} đồng", "{w2} đồng", "{w3} đồng"],
      correctIndex: 0,
      tags: ["toán thực tế", "phép tính số tự nhiên"]
    },
    {
      id: "c1_015",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 50, max: 100 },
        b: { type: "int", min: 2, max: 5 },
        c: { type: "int", min: 3, max: 6 },
        d: { type: "int", min: 2, max: 4 }
      },
      constraints: ["a > b * (c * d + 2)"],
      formulas: {
        inner: "c * d",
        bracket: "inner + 2",
        ans: "a - b * bracket",
        w1: "(a - b) * bracket",
        w2: "ans + 6",
        w3: "ans - 6"
      },
      question: "Thực hiện phép tính: $P = {a} - {b} \\cdot [{c} \\cdot {d} + 2]$",
      hint: "Thực hiện phép tính trong ngoặc trước: tính {c} \\cdot {d} rồi cộng 2.",
      solution: "$P = {a} - {b} \\cdot [{inner} + 2] = {a} - {b} \\cdot {bracket} = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["dấu ngoặc", "thứ tự phép tính"]
    },
    {
      id: "c1_016",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        n: { type: "int", min: 100, max: 999 }
      },
      constraints: [],
      formulas: {
        ans: "n + 1",
        w1: "n - 1",
        w2: "n + 2",
        w3: "n + 10"
      },
      question: "Số tự nhiên liền sau của số {n} là:",
      hint: "Số liền sau của $a$ là $a + 1$.",
      solution: "Số tự nhiên liền sau của {n} là: ${n} + 1 = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["số tự nhiên", "liền trước liền sau"]
    },
    {
      id: "c1_017",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        n: { type: "int", min: 100, max: 999 }
      },
      constraints: [],
      formulas: {
        ans: "n - 1",
        w1: "n + 1",
        w2: "n - 2",
        w3: "n - 10"
      },
      question: "Số tự nhiên liền trước của số {n} là:",
      hint: "Số liền trước của $a$ là $a - 1$.",
      solution: "Số tự nhiên liền trước của {n} là: ${n} - 1 = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["số tự nhiên", "liền trước liền sau"]
    },
    {
      id: "c1_018",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        q: { type: "int", min: 12, max: 35 },
        d: { type: "int", min: 4, max: 9 },
        r: { type: "int", min: 1, max: 3 }
      },
      constraints: ["r < d"],
      formulas: {
        dividend: "q * d + r",
        ans: "q",
        w1: "q + 1",
        w2: "q - 1",
        w3: "d"
      },
      question: "Trong phép chia có dư: {dividend} : {d}, thương là bao nhiêu?",
      hint: "Lấy {dividend} chia cho {d} ta được thương và số dư là {r}.",
      solution: "Ta có: ${dividend} = ${d} \\cdot ${q} + ${r}$. Do đó thương là {ans} và số dư là {r}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["phép chia có dư"]
    },
    {
      id: "c1_019",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 15, max: 99 }
      },
      constraints: [],
      formulas: {
        ans: 1,
        w1: 0,
        w2: "a",
        w3: "a + 1"
      },
      question: "Giá trị của lũy thừa ${a}^0$ bằng bao nhiêu?",
      hint: "Quy ước: Với mọi số tự nhiên $a \\ne 0$, ta có $a^0 = 1$.",
      solution: "Theo quy ước, ${a}^0 = 1$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["lũy thừa", "quy ước"]
    },
    {
      id: "c1_020",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 11, max: 29 },
        b: { type: "int", min: 31, max: 49 }
      },
      constraints: [],
      formulas: {
        ca: "100 - a",
        cb: "100 - b",
        ans: 200,
        w1: 100,
        w2: 300,
        w3: 190
      },
      question: "Tính hợp lý: $T = ({a} + {ca}) + ({b} + {cb})$",
      hint: "Nhóm các cặp số có tổng tròn trăm lại với nhau.",
      solution: "$T = ({a} + {ca}) + ({b} + {cb}) = 100 + 100 = 200$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["tính nhanh", "tổng tròn trăm"]
    },
    {
      id: "c1_021",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 12, max: 40 },
        b: { type: "int", min: 3, max: 8 }
      },
      constraints: [],
      formulas: {
        product: "a * b",
        ans: "a",
        w1: "a + 1",
        w2: "a - 1",
        w3: "b"
      },
      question: "Tìm $x$, biết: $x \\cdot {b} = {product}$",
      hint: "Muốn tìm thừa số chưa biết, ta lấy tích chia cho thừa số đã biết.",
      solution: "$x = {product} : {b} = {ans}$.",
      options: ["$x = {ans}$", "$x = {w1}$", "$x = {w2}$", "$x = {w3}$"],
      correctIndex: 0,
      tags: ["tìm x", "phép nhân chia"]
    },
    {
      id: "c1_022",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        k: { type: "int", min: 11, max: 39 },
        x: { type: "int", min: 105, max: 195 },
        y: { type: "int", min: 5, max: 95 }
      },
      constraints: ["(x - y) % 100 === 0", "x > y"],
      formulas: {
        diff: "x - y",
        ans: "k * diff",
        w1: "k * (diff + 10)",
        w2: "ans - k * 10",
        w3: "ans + k * 10"
      },
      question: "Tính nhanh giá trị biểu thức: $H = {k} \\cdot {x} - {k} \\cdot {y}$",
      hint: "Áp dụng tính chất phân phối: $a \\cdot b - a \\cdot c = a \\cdot (b - c)$.",
      solution: "$H = {k} \\cdot ({x} - {y}) = {k} \\cdot {diff} = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["tính nhanh", "tính chất phân phối"]
    },
    {
      id: "c1_023",
      level: "kho",
      type: "multiple-choice",
      variables: {
        base: { type: "int", min: 2, max: 3 },
        xVal: { type: "int", min: 2, max: 5 },
        offset: { type: "int", min: 1, max: 3 }
      },
      constraints: [],
      formulas: {
        expTotal: "xVal + offset",
        rhs: "Math.pow(base, expTotal)",
        ans: "xVal",
        w1: "xVal + 1",
        w2: "xVal - 1 > 0 ? xVal - 1 : xVal + 2",
        w3: "xVal + 3"
      },
      question: "Tìm số tự nhiên $x$, biết: ${base}^{x + {offset}} = {rhs}$",
      hint: "Đưa vế phải {rhs} về lũy thừa cơ số {base}.",
      solution: "Ta có: ${rhs} = ${base}^{expTotal}$. Do đó $x + {offset} = {expTotal} \\implies x = {expTotal} - {offset} = {ans}$.",
      options: ["$x = {ans}$", "$x = {w1}$", "$x = {w2}$", "$x = {w3}$"],
      correctIndex: 0,
      tags: ["tìm x", "lũy thừa", "nâng cao"]
    },
    {
      id: "c1_024",
      level: "kho",
      type: "multiple-choice",
      variables: {
        m: { type: "int", min: 2, max: 4 },
        n: { type: "int", min: 3, max: 5 }
      },
      constraints: [],
      formulas: {
        inner: "m * n",
        mid: "inner + 2",
        outer: "mid * 2",
        ans: "100 - outer",
        w1: "100 - (inner + 2)",
        w2: "ans + 10",
        w3: "ans - 10"
      },
      question: "Tính giá trị biểu thức: $K = 100 - 2 \\cdot [({m} \\cdot {n} + 2)]$",
      hint: "Thực hiện trong ngoặc tròn trước rồi đến ngoặc vuông.",
      solution: "$K = 100 - 2 \\cdot [{inner} + 2] = 100 - 2 \\cdot {mid} = 100 - {outer} = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["thứ tự phép tính", "nhiều ngoặc"]
    },
    {
      id: "c1_025",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        n: { type: "choice", options: [50, 60, 70, 80, 90] }
      },
      constraints: [],
      formulas: {
        cnt2: "n - 9",
        chuso2: "cnt2 * 2",
        ans: "9 + chuso2",
        w1: "n * 2",
        w2: "ans - 9",
        w3: "ans + 10"
      },
      question: "Để đánh số trang một cuốn sách từ trang 1 đến trang {n}, người ta cần dùng tất cả bao nhiêu chữ số?",
      hint: "Từ trang 1 đến trang 9 có 9 chữ số. Từ trang 10 đến trang {n} có ({n} - 9) trang có 2 chữ số.",
      solution: "Từ trang 1 đến 9: có 9 chữ số. Từ 10 đến {n}: có {cnt2} trang có 2 chữ số, tương ứng {chuso2} chữ số. Tổng cộng: 9 + {chuso2} = {ans} chữ số.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["đánh số trang sách", "toán tư duy"]
    }
  ]
};

// ==========================================
// CHƯƠNG 2: TÍNH CHIA HẾT - ƯỚC & BỘI (25 templates)
// ==========================================
const chapter2 = {
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
};

// ==========================================
// CHƯƠNG 3: SỐ NGUYÊN (25 templates)
// ==========================================
const chapter3 = {
  metadata: {
    subject: "math",
    grade: 6,
    chapter: 3,
    title: "Số nguyên",
    totalTemplates: 25
  },
  templates: [
    {
      id: "c3_001",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: -20, max: -2 },
        b: { type: "int", min: 3, max: 20 }
      },
      constraints: ["a !== -b"],
      formulas: {
        ans: "a + b",
        w1: "(ans + 3 === a) ? ans + 7 : ans + 3",
        w2: "(ans - 4 === a || ans - 4 === w1) ? ans - 8 : ans - 4",
        w3: "Math.abs(a) + b"
      },
      question: "Tính: $({a}) + {b} = ?$",
      hint: "Cộng số nguyên âm và số nguyên dương: lấy số có giá trị tuyệt đối lớn hơn trừ số có giá trị tuyệt đối nhỏ hơn và mang dấu của số có giá trị tuyệt đối lớn hơn.",
      solution: "$({a}) + {b} = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["cộng số nguyên", "số nguyên âm"]
    },
    {
      id: "c3_002",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: -25, max: -5 },
        b: { type: "int", min: -25, max: -5 }
      },
      constraints: [],
      formulas: {
        ans: "a + b",
        w1: "Math.abs(a + b)",
        w2: "a - b",
        w3: "ans - 5"
      },
      question: "Tính tổng hai số nguyên âm: $({a}) + ({b}) = ?$",
      hint: "Muốn cộng hai số nguyên âm, ta cộng hai giá trị tuyệt đối của chúng rồi đặt dấu trừ trước kết quả.",
      solution: "$({a}) + ({b}) = - (|{a}| + |{b}|) = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["cộng hai số nguyên âm"]
    },
    {
      id: "c3_003",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 10, max: 30 },
        b: { type: "int", min: 35, max: 70 }
      },
      constraints: ["a < b"],
      formulas: {
        ans: "a - b",
        w1: "b - a",
        w2: "ans - 2",
        w3: "ans + 4"
      },
      question: "Tính hiệu: ${a} - ${b} = ?$",
      hint: "Muốn trừ số nguyên $a$ cho số nguyên $b$, ta cộng $a$ với số đối của $b$: $a - b = a + (-b)$.",
      solution: "${a} - ${b} = ${a} + (-${b}) = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["trừ số nguyên"]
    },
    {
      id: "c3_004",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 3, max: 9 },
        b: { type: "int", min: -9, max: -2 }
      },
      constraints: [],
      formulas: {
        ans: "a * b",
        w1: "Math.abs(a * b)",
        w2: "ans + 5",
        w3: "ans - 5"
      },
      question: "Tính tích: ${a} \\cdot ({b}) = ?$",
      hint: "Tích của hai số nguyên khác dấu luôn là một số nguyên âm: $a \\cdot (-b) = -(a \\cdot b)$.",
      solution: "${a} \\cdot ({b}) = -(${a} \\cdot ${Math.abs(b)}) = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["nhân số nguyên", "khác dấu"]
    },
    {
      id: "c3_005",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: -10, max: -2 },
        b: { type: "int", min: -10, max: -2 }
      },
      constraints: [],
      formulas: {
        ans: "a * b",
        w1: "-(a * b)",
        w2: "ans + 6",
        w3: "ans - 6"
      },
      question: "Tính tích hai số nguyên âm: $({a}) \\cdot ({b}) = ?$",
      hint: "Tích của hai số nguyên cùng dấu luôn là một số nguyên dương: $(-a) \\cdot (-b) = a \\cdot b$.",
      solution: "$({a}) \\cdot ({b}) = ${Math.abs(a)} \\cdot ${Math.abs(b)} = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["nhân số nguyên", "cùng dấu"]
    },
    {
      id: "c3_006",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        val: { type: "int", min: -50, max: 50 }
      },
      constraints: ["val !== 0"],
      formulas: {
        ans: "-val",
        w1: "val",
        w2: "Math.abs(val) + 1",
        w3: "-(Math.abs(val) + 1)"
      },
      question: "Số đối của số nguyên {val} là:",
      hint: "Số đối của $a$ là $-a$. Hai số đối nhau có tổng bằng 0.",
      solution: "Số đối của {val} là -({val}) = {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["số đối"]
    },
    {
      id: "c3_007",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: -25, max: -5 },
        b: { type: "int", min: -30, max: -2 }
      },
      constraints: ["a !== b"],
      formulas: {
        ans: "a > b ? '>' : '<'",
        w1: "a > b ? '<' : '>'",
        w2: "=",
        w3: "\\le"
      },
      question: "Điền dấu thích hợp vào chỗ trống: ${a} \\space \\_\\_\\_ \\space ${b}$",
      hint: "Trong hai số nguyên âm, số nào có giá trị tuyệt đối nhỏ hơn thì lớn hơn.",
      solution: "Vì |{a}| = {Math.abs(a)} và |{b}| = {Math.abs(b)}, do đó ${a} {ans} ${b}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["so sánh số nguyên"]
    },
    {
      id: "c3_008",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 10, max: 30 },
        b: { type: "int", min: 5, max: 20 },
        c: { type: "int", min: 15, max: 35 }
      },
      constraints: [],
      formulas: {
        ans: "a - b - c",
        w1: "a - b + c",
        w2: "a + b - c",
        w3: "ans + 5"
      },
      question: "Bỏ dấu ngoặc rồi tính: $A = {a} - ({b} + {c})$",
      hint: "Khi bỏ dấu ngoặc có dấu '-' đằng trước, ta phải đổi dấu tất cả các số hạng trong ngoặc.",
      solution: "$A = {a} - {b} - {c} = {a - b} - {c} = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["quy tắc dấu ngoặc"]
    },
    {
      id: "c3_009",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        x: { type: "int", min: -15, max: 15 },
        m: { type: "int", min: -20, max: 20 }
      },
      constraints: ["x !== 0", "m !== 0"],
      formulas: {
        rhs: "x + m",
        ans: "x",
        w1: "x + 2",
        w2: "x - 2",
        w3: "-x"
      },
      question: "Tìm số nguyên $x$, biết: $x + ({m}) = {rhs}$",
      hint: "Chuyển vế: $x = {rhs} - ({m})$.",
      solution: "$x = {rhs} - ({m}) = {ans}$.",
      options: ["$x = {ans}$", "$x = {w1}$", "$x = {w2}$", "$x = {w3}$"],
      correctIndex: 0,
      tags: ["tìm x", "số nguyên"]
    },
    {
      id: "c3_010",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        k: { type: "int", min: -8, max: 8 },
        x: { type: "int", min: -10, max: 10 }
      },
      constraints: ["k !== 0", "x !== 0", "k !== 1", "k !== -1"],
      formulas: {
        prod: "k * x",
        ans: "x",
        w1: "-x",
        w2: "x + 1",
        w3: "x - 1"
      },
      question: "Tìm $x \\in \\mathbb{Z}$, biết: $({k}) \\cdot x = {prod}$",
      hint: "Lấy tích chia cho thừa số đã biết: $x = {prod} : ({k})$.",
      solution: "$x = {prod} : ({k}) = {ans}$.",
      options: ["$x = {ans}$", "$x = {w1}$", "$x = {w2}$", "$x = {w3}$"],
      correctIndex: 0,
      tags: ["tìm x", "phép nhân số nguyên"]
    },
    {
      id: "c3_011",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        t1: { type: "int", min: -10, max: -2 },
        inc: { type: "int", min: 3, max: 12 }
      },
      constraints: [],
      formulas: {
        ans: "t1 + inc",
        w1: "t1 - inc",
        w2: "inc - Math.abs(t1) + 2",
        w3: "ans + 3"
      },
      question: "Nhiệt độ lúc 6 giờ sáng tại Sa Pa là ${t1}^\\circ\\text{C}$. Đến trưa, nhiệt độ tăng thêm ${inc}^\\circ\\text{C}$. Nhiệt độ buổi trưa là:",
      hint: "Nhiệt độ buổi trưa = Nhiệt độ sáng + Nhiệt độ tăng thêm.",
      solution: "Nhiệt độ buổi trưa là: ${t1} + ${inc} = {ans}^\\circ\\text{C}$.",
      options: ["{ans}$^\\circ\\text{C}$", "{w1}$^\\circ\\text{C}$", "{w2}$^\\circ\\text{C}$", "{w3}$^\\circ\\text{C}$"],
      correctIndex: 0,
      tags: ["toán thực tế", "nhiệt độ"]
    },
    {
      id: "c3_012",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        depth: { type: "int", min: 20, max: 80 },
        down: { type: "int", min: 10, max: 40 }
      },
      constraints: [],
      formulas: {
        ans: "-(depth + down)",
        w1: "-(depth - down)",
        w2: "depth + down",
        w3: "ans - 10"
      },
      question: "Một tàu ngầm đang ở độ sâu ${depth}\\text{m}$ dưới mực nước biển (biểu diễn bởi -${depth}\\text{m}$). Tàu lặn sâu thêm ${down}\\text{m}$ nữa. Độ cao mới của tàu là:",
      hint: "Lặn sâu thêm nghĩa là cộng thêm một lượng âm: -${depth} + (-${down})$.",
      solution: "Độ cao mới của tàu là: -${depth} - ${down} = {ans}\\text{m}$.",
      options: ["{ans} m", "{w1} m", "{w2} m", "{w3} m"],
      correctIndex: 0,
      tags: ["toán thực tế", "độ sâu tàu ngầm"]
    },
    {
      id: "c3_013",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: -15, max: -5 },
        b: { type: "int", min: 10, max: 25 },
        c: { type: "int", min: -20, max: -5 }
      },
      constraints: [],
      formulas: {
        ans: "a + b + c",
        w1: "Math.abs(a) + b + Math.abs(c)",
        w2: "ans + 5",
        w3: "ans - 5"
      },
      question: "Tính giá trị biểu thức: $S = ({a}) + {b} + ({c})$",
      hint: "Nhóm hai số nguyên âm lại trước: $[({a}) + ({c})] + {b}$.",
      solution: "$S = [({a}) + ({c})] + {b} = {a + c} + {b} = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["tính nhanh", "cộng nhiều số nguyên"]
    },
    {
      id: "c3_014",
      level: "kho",
      type: "multiple-choice",
      variables: {
        n: { type: "int", min: 10, max: 30 }
      },
      constraints: ["n % 2 === 0"],
      formulas: {
        ans: "0",
        w1: "n",
        w2: "-n",
        w3: "1"
      },
      question: "Tính tổng tất cả các số nguyên $x$ thỏa mãn: -{n} \\le x \\le {n}$",
      hint: "Tổng các cặp số đối nhau $x + (-x) = 0$.",
      solution: "Tổng $S = (-{n} + {n}) + ... + (-1 + 1) + 0 = 0$.",
      options: ["0", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["tổng các số nguyên", "cặp số đối"]
    },
    {
      id: "c3_015",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        n: { type: "int", min: -9, max: -2 }
      },
      constraints: [],
      formulas: {
        ans: "Math.abs(n)",
        w1: "n",
        w2: "-Math.abs(n) - 1",
        w3: "0"
      },
      question: "Giá trị tuyệt đối của số nguyên {n} là $|{n}| = ?$",
      hint: "Giá trị tuyệt đối của một số nguyên âm là số đối của nó (một số dương).",
      solution: "$|{n}| = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["giá trị tuyệt đối"]
    },
    {
      id: "c3_016",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: -6, max: -2 },
        exp: { type: "choice", options: [2, 3, 4] }
      },
      constraints: [],
      formulas: {
        ans: "Math.pow(a, exp)",
        w1: "-Math.pow(a, exp)",
        w2: "ans + 2",
        w3: "ans - 2"
      },
      question: "Tính lũy thừa: $({a})^{exp} = ?$",
      hint: "Lũy thừa bậc chẵn của số âm là số dương, lũy thừa bậc lẻ của số âm là số âm.",
      solution: "$({a})^{exp} = {ans}$.",
      options: ["{ans}", "{w1 === ans ? ans + 4 : w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["lũy thừa số nguyên"]
    },
    {
      id: "c3_017",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "choice", options: [-8, -6, -4, 4, 6, 8] }
      },
      constraints: [],
      formulas: {
        ans: "a % 2 === 0 ? 'Là bội của 2' : 'Không là bội của 2'",
        w1: "Không là ước của 2",
        w2: "Là số tự nhiên",
        w3: "Không xác định"
      },
      question: "Số nguyên {a} có phải là bội của 2 không?",
      hint: "Nếu $a = 2 \\cdot q$ ($q \\in \\mathbb{Z}$) thì $a$ là bội của 2.",
      solution: "Vì {a} chia hết cho 2 nên {a} là bội của 2.",
      options: ["Là bội của 2", "Không là bội của 2", "Không xác định", "Là số vô tỉ"],
      correctIndex: 0,
      tags: ["ước và bội số nguyên"]
    },
    {
      id: "c3_018",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 2, max: 6 }
      },
      constraints: [],
      formulas: {
        ans: "4",
        w1: "2",
        w2: "1",
        w3: "3"
      },
      question: "Số nguyên tố $p = {a}$ (hoặc số nguyên $a = {a}$) có tất cả bao nhiêu ước nguyên trong $\\mathbb{Z}$?",
      hint: "Ước nguyên gồm cả ước dương và ước âm: $\\pm 1, \\pm {a}$.",
      solution: "Các ước nguyên của {a} trong $\\mathbb{Z}$ gồm: $\\{1; -1; {a}; -{a}\\}$, có tất cả 4 ước.",
      options: ["4", "2", "1", "3"],
      correctIndex: 0,
      tags: ["ước số nguyên trong Z"]
    },
    {
      id: "c3_019",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        k: { type: "int", min: -9, max: -2 },
        a: { type: "int", min: 15, max: 45 },
        b: { type: "int", min: 5, max: 35 }
      },
      constraints: ["(a + b) % 10 === 0"],
      formulas: {
        sumAB: "a + b",
        ans: "k * sumAB",
        w1: "Math.abs(k * sumAB)",
        w2: "ans + 10",
        w3: "ans - 10"
      },
      question: "Tính nhanh: $P = ({k}) \\cdot {a} + ({k}) \\cdot {b}$",
      hint: "Đặt thừa số chung ({k}) ra ngoài: $P = ({k}) \\cdot ({a} + {b})$.",
      solution: "$P = ({k}) \\cdot ({a} + {b}) = ({k}) \\cdot {sumAB} = {ans}$.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["tính nhanh", "phân phối số nguyên"]
    },
    {
      id: "c3_020",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: -30, max: -5 }
      },
      constraints: [],
      formulas: {
        ans: "a < 0",
        w1: "a > 0",
        w2: "a === 0",
        w3: "a >= 0"
      },
      question: "Khẳng định nào sau đây là ĐÚNG về số nguyên âm {a}?",
      hint: "Mọi số nguyên âm đều nhỏ hơn 0.",
      solution: "Số nguyên âm {a} luôn nhỏ hơn 0, tức là ${a} < 0$.",
      options: ["${a} < 0$", "${a} > 0$", "${a} = 0$", "${a} \\ge 0$"],
      correctIndex: 0,
      tags: ["tính chất số nguyên âm"]
    },
    {
      id: "c3_021",
      level: "kho",
      type: "multiple-choice",
      variables: {
        m: { type: "int", min: 2, max: 5 }
      },
      constraints: [],
      formulas: {
        ans: "4",
        w1: "2",
        w2: "3",
        w3: "6"
      },
      question: "Có bao nhiêu số nguyên $x$ thỏa mãn: $(x - 1)$ là ước của ${m}$?",
      hint: "Ước của ${m}$ gồm: $\\pm 1, \\pm ${m}$. Tương ứng có 4 giá trị của $x$.",
      solution: "Vì ${m}$ có 4 ước nguyên nên phương trình $x - 1 = d$ có đúng 4 nghiệm nguyên $x$.",
      options: ["4", "2", "3", "6"],
      correctIndex: 0,
      tags: ["ước số nguyên", "tìm x nâng cao"]
    },
    {
      id: "c3_022",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: -15, max: -2 },
        b: { type: "int", min: -15, max: -2 }
      },
      constraints: [],
      formulas: {
        ans: "a * b > 0",
        w1: "a * b < 0",
        w2: "a * b === 0",
        w3: "a * b < a"
      },
      question: "Tích của hai số nguyên âm luôn mang dấu gì?",
      hint: "Âm nhân Âm ra Dương.",
      solution: "Tích của hai số nguyên âm luôn là một số nguyên dương (> 0).",
      options: ["Dấu dương (+)", "Dấu âm (-)", "Bằng 0", "Không mang dấu"],
      correctIndex: 0,
      tags: ["dấu của tích"]
    },
    {
      id: "c3_023",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: -20, max: 20 },
        b: { type: "int", min: -20, max: 20 },
        c: { type: "int", min: -20, max: 20 }
      },
      constraints: ["a !== 0", "b !== 0", "c !== 0"],
      formulas: {
        ans: "a - b + c",
        w1: "a + b + c",
        w2: "a - b - c",
        w3: "-a - b + c"
      },
      question: "Bỏ dấu ngoặc của biểu thức: $M = a - (b - c)$ được kết quả là:",
      hint: "Đổi dấu các số hạng bên trong ngoặc khi đằng trước ngoặc là dấu trừ: $-(b - c) = -b + c$.",
      solution: "Ta có: $M = a - (b - c) = a - b + c$.",
      options: ["$a - b + c$", "$a + b + c$", "$a - b - c$", "$-a - b + c$"],
      correctIndex: 0,
      tags: ["quy tắc dấu ngoặc"]
    },
    {
      id: "c3_024",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        val: { type: "int", min: -10, max: 10 }
      },
      constraints: ["val !== 0"],
      formulas: {
        ans: "0",
        w1: "2 * val",
        w2: "-2 * val",
        w3: "1"
      },
      question: "Tổng của một số nguyên {val} với số đối của nó bằng bao nhiêu?",
      hint: "$a + (-a) = 0$.",
      solution: "Tổng của hai số đối nhau luôn bằng 0: ${val} + (-{val}) = 0$.",
      options: ["0", "{w1}", "{w2}", "1"],
      correctIndex: 0,
      tags: ["tổng hai số đối nhau"]
    },
    {
      id: "c3_025",
      level: "kho",
      type: "multiple-choice",
      variables: {
        n: { type: "choice", options: [5, 7, 9, 11] }
      },
      constraints: [],
      formulas: {
        ans: "-1",
        w1: "1",
        w2: "n",
        w3: "-n"
      },
      question: "Giá trị của biểu thức $P = (-1)^{n}$ với $n = {n}$ là:",
      hint: "$(-1)$ nâng lên lũy thừa bậc lẻ bằng $-1$, bậc chẵn bằng $1$.",
      solution: "Vì {n} là số lẻ nên $(-1)^{n} = -1$.",
      options: ["-1", "1", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["lũy thừa số âm", "nâng cao"]
    }
  ]
};

// ==========================================
// CHƯƠNG 4: HÌNH HỌC TRỰC QUAN TRONG THỰC TIỄN (20 templates)
// ==========================================
const chapter4 = {
  metadata: {
    subject: "math",
    grade: 6,
    chapter: 4,
    title: "Một số hình phẳng trong thực tiễn",
    totalTemplates: 20
  },
  templates: [
    {
      id: "c4_001",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 4, max: 15 }
      },
      constraints: [],
      formulas: {
        ans: "3 * a",
        w1: "a * a",
        w2: "4 * a",
        w3: "ans + 3"
      },
      question: "Chu vi của một tam giác đều có cạnh bằng {a} cm là:",
      hint: "Tam giác đều có 3 cạnh bằng nhau, chu vi $P = 3a$.",
      solution: "Chu vi tam giác đều là: $3 \\times {a} = {ans}$ cm.",
      options: ["{ans} cm", "{w1} cm", "{w2} cm", "{w3} cm"],
      correctIndex: 0,
      tags: ["tam giác đều", "chu vi"]
    },
    {
      id: "c4_002",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 5, max: 20 }
      },
      constraints: [],
      formulas: {
        ans: "4 * a",
        w1: "a * a",
        w2: "2 * a",
        w3: "ans + 4"
      },
      question: "Chu vi của một hình vuông có độ dài cạnh {a} cm là:",
      hint: "Chu vi hình vuông $P = 4a$.",
      solution: "Chu vi hình vuông là: $4 \\times {a} = {ans}$ cm.",
      options: ["{ans} cm", "{w1} cm", "{w2} cm", "{w3} cm"],
      correctIndex: 0,
      tags: ["hình vuông", "chu vi"]
    },
    {
      id: "c4_003",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 4, max: 15 }
      },
      constraints: [],
      formulas: {
        ans: "a * a",
        w1: "4 * a",
        w2: "2 * a",
        w3: "ans + 10"
      },
      question: "Diện tích của một hình vuông có cạnh bằng {a} cm là:",
      hint: "Diện tích hình vuông $S = a^2$.",
      solution: "Diện tích hình vuông là: ${a} \\times ${a} = {ans} \\text{ cm}^2$.",
      options: ["{ans} cm²", "{w1} cm²", "{w2} cm²", "{w3} cm²"],
      correctIndex: 0,
      tags: ["hình vuông", "diện tích"]
    },
    {
      id: "c4_004",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        cd: { type: "int", min: 8, max: 25 },
        cr: { type: "int", min: 4, max: 15 }
      },
      constraints: ["cd > cr"],
      formulas: {
        ans: "2 * (cd + cr)",
        w1: "cd * cr",
        w2: "cd + cr",
        w3: "ans + 2"
      },
      question: "Chu vi của hình chữ nhật có chiều dài {cd} cm và chiều rộng {cr} cm là:",
      hint: "Chu vi hình chữ nhật $P = (a + b) \\times 2$.",
      solution: "Chu vi hình chữ nhật là: $({cd} + {cr}) \\times 2 = {ans}$ cm.",
      options: ["{ans} cm", "{w1} cm", "{w2} cm", "{w3} cm"],
      correctIndex: 0,
      tags: ["hình chữ nhật", "chu vi"]
    },
    {
      id: "c4_005",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        cd: { type: "int", min: 8, max: 20 },
        cr: { type: "int", min: 3, max: 10 }
      },
      constraints: ["cd > cr"],
      formulas: {
        ans: "cd * cr",
        w1: "2 * (cd + cr)",
        w2: "cd + cr",
        w3: "ans + 10"
      },
      question: "Diện tích của hình chữ nhật có chiều dài {cd} cm và chiều rộng {cr} cm là:",
      hint: "Diện tích hình chữ nhật $S = a \\times b$.",
      solution: "Diện tích hình chữ nhật là: ${cd} \\times ${cr} = {ans} \\text{ cm}^2$.",
      options: ["{ans} cm²", "{w1} cm²", "{w2} cm²", "{w3} cm²"],
      correctIndex: 0,
      tags: ["hình chữ nhật", "diện tích"]
    },
    {
      id: "c4_006",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        d1: { type: "int", min: 6, max: 20 },
        d2: { type: "int", min: 4, max: 16 }
      },
      constraints: ["(d1 * d2) % 2 === 0"],
      formulas: {
        ans: "(d1 * d2) / 2",
        w1: "d1 * d2",
        w2: "2 * (d1 + d2)",
        w3: "ans + 6"
      },
      question: "Diện tích của một hình thoi có độ dài hai đường chéo là {d1} cm và {d2} cm là:",
      hint: "Diện tích hình thoi bằng nửa tích hai đường chéo: $S = \\frac{1}{2} m \\cdot n$.",
      solution: "Diện tích hình thoi là: $\\frac{1}{2} \\times ${d1} \\times ${d2} = {ans} \\text{ cm}^2$.",
      options: ["{ans} cm²", "{w1} cm²", "{w2} cm²", "{w3} cm²"],
      correctIndex: 0,
      tags: ["hình thoi", "diện tích"]
    },
    {
      id: "c4_007",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 5, max: 15 }
      },
      constraints: [],
      formulas: {
        ans: "4 * a",
        w1: "a * a",
        w2: "2 * a",
        w3: "ans + 4"
      },
      question: "Chu vi của một hình thoi có độ dài cạnh {a} cm là:",
      hint: "Hình thoi có 4 cạnh bằng nhau, chu vi $P = 4a$.",
      solution: "Chu vi hình thoi là: $4 \\times {a} = {ans}$ cm.",
      options: ["{ans} cm", "{w1} cm", "{w2} cm", "{w3} cm"],
      correctIndex: 0,
      tags: ["hình thoi", "chu vi"]
    },
    {
      id: "c4_008",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 10, max: 25 },
        h: { type: "int", min: 5, max: 15 }
      },
      constraints: [],
      formulas: {
        ans: "a * h",
        w1: "(a * h) / 2",
        w2: "2 * (a + h)",
        w3: "ans + 10"
      },
      question: "Diện tích của hình bình hành có độ dài đáy {a} cm và chiều cao tương ứng {h} cm là:",
      hint: "Diện tích hình bình hành $S = a \\times h$.",
      solution: "Diện tích hình bình hành là: ${a} \\times ${h} = {ans} \\text{ cm}^2$.",
      options: ["{ans} cm²", "{w1} cm²", "{w2} cm²", "{w3} cm²"],
      correctIndex: 0,
      tags: ["hình bình hành", "diện tích"]
    },
    {
      id: "c4_009",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 6, max: 15 },
        b: { type: "int", min: 10, max: 25 },
        h: { type: "int", min: 4, max: 12 }
      },
      constraints: ["b > a", "((a + b) * h) % 2 === 0"],
      formulas: {
        sumBases: "a + b",
        ans: "(sumBases * h) / 2",
        w1: "sumBases * h",
        w2: "a * b",
        w3: "ans + 8"
      },
      question: "Diện tích của hình thang có hai đáy {a} cm, {b} cm và chiều cao {h} cm là:",
      hint: "Diện tích hình thang $S = \\frac{(a + b) \\cdot h}{2}$.",
      solution: "Diện tích hình thang là: $\\frac{({a} + {b}) \\times {h}}{2} = {ans} \\text{ cm}^2$.",
      options: ["{ans} cm²", "{w1} cm²", "{w2} cm²", "{w3} cm²"],
      correctIndex: 0,
      tags: ["hình thang", "diện tích"]
    },
    {
      id: "c4_010",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 3, max: 10 }
      },
      constraints: [],
      formulas: {
        ans: "6 * a",
        w1: "3 * a",
        w2: "4 * a",
        w3: "ans + 6"
      },
      question: "Chu vi của một hình lục giác đều có độ dài cạnh {a} cm là:",
      hint: "Lục giác đều có 6 cạnh bằng nhau, chu vi $P = 6a$.",
      solution: "Chu vi hình lục giác đều là: $6 \\times ${a} = {ans}$ cm.",
      options: ["{ans} cm", "{w1} cm", "{w2} cm", "{w3} cm"],
      correctIndex: 0,
      tags: ["lục giác đều", "chu vi"]
    },
    {
      id: "c4_011",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        dai: { type: "int", min: 6, max: 12 },
        rong: { type: "int", min: 4, max: 8 },
        gach: { type: "int", min: 4, max: 5 }
      },
      constraints: ["dai > rong"],
      formulas: {
        gachM: "gach * 0.1",
        sSan: "dai * rong",
        sGach: "gachM * gachM",
        ans: "Math.round(sSan / sGach)",
        w1: "ans + 50",
        w2: "ans - 50",
        w3: "sSan * 10"
      },
      question: "Một căn phòng hình chữ nhật có chiều dài {dai} m, chiều rộng {rong} m. Người ta lát nền bằng các viên gạch hình vuông cạnh {gach * 10} cm. Cần bao nhiêu viên gạch để lát kín nền phòng?",
      hint: "Đổi đơn vị rồi lấy diện tích căn phòng chia cho diện tích một viên gạch.",
      solution: "Diện tích phòng = {sSan} m² = {sSan * 10000} cm². Diện tích 1 viên gạch = {gach * 10 * gach * 10} cm². Số gạch cần = {ans} viên.",
      options: ["{ans} viên", "{w1} viên", "{w2} viên", "{w3} viên"],
      correctIndex: 0,
      tags: ["toán thực tế", "lát gạch"]
    },
    {
      id: "c4_012",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        dai: { type: "int", min: 10, max: 25 },
        rong: { type: "int", min: 5, max: 15 },
        gia: { type: "int", min: 30, max: 60 }
      },
      constraints: ["dai > rong"],
      formulas: {
        p: "2 * (dai + rong)",
        pTruCong: "p - 2",
        ans: "pTruCong * gia * 1000",
        w1: "p * gia * 1000",
        w2: "ans + 100000",
        w3: "ans - 100000"
      },
      question: "Một mảnh vườn hình chữ nhật dài {dai} m, rộng {rong} m. Người ta làm hàng rào xung quanh vườn, chừa một cổng vào rộng 2 m. Chi phí làm mỗi mét rào là {gia * 1000} đồng. Tổng chi phí làm hàng rào là:",
      hint: "Chiều dài hàng rào = Chu vi vườn - chiều rộng cổng.",
      solution: "Chu vi = {p} m. Chiều dài rào = {p} - 2 = {pTruCong} m. Chi phí = {pTruCong} \\times {gia * 1000} = {ans} đồng.",
      options: ["{ans} đồng", "{w1} đồng", "{w2} đồng", "{w3} đồng"],
      correctIndex: 0,
      tags: ["toán thực tế", "làm hàng rào"]
    },
    {
      id: "c4_013",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        name: { type: "choice", options: ["Tam giác đều", "Hình vuông", "Hình lục giác đều", "Hình chữ nhật"] }
      },
      constraints: [],
      formulas: {
        ans: "name === 'Tam giác đều' ? 'Có 3 cạnh bằng nhau và 3 góc bằng nhau' : name === 'Hình vuông' ? 'Có 4 cạnh bằng nhau và 4 góc vuông' : name === 'Hình lục giác đều' ? 'Có 6 cạnh bằng nhau và 6 góc bằng nhau' : 'Có các cạnh đối bằng nhau và 4 góc vuông'",
        w1: "Có 2 đường chéo không bằng nhau",
        w2: "Có 4 góc không bằng nhau",
        w3: "Có các cạnh không bằng nhau"
      },
      question: "Đặc điểm cơ bản của {name} là:",
      hint: "Nhớ lại định nghĩa hình học về cạnh và góc của {name}.",
      solution: "{name} {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["tính chất hình học"]
    },
    {
      id: "c4_014",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "choice", options: ["Hình thoi", "Hình bình hành", "Hình thang cân"] }
      },
      constraints: [],
      formulas: {
        ans: "a === 'Hình thoi' ? 'Hai đường chéo vuông góc với nhau' : a === 'Hình bình hành' ? 'Hai đường chéo cắt nhau tại trung điểm mỗi đường' : 'Hai đường chéo bằng nhau'",
        w1: "Hai đường chéo luôn vuông góc và bằng nhau",
        w2: "Không có đường chéo",
        w3: "Bốn cạnh luôn vuông góc với nhau"
      },
      question: "Khẳng định nào ĐÚNG về hai đường chéo của {a}?",
      hint: "Hình thoi có hai đường chéo vuông góc; hình bình hành cắt nhau tại trung điểm; hình thang cân hai đường chéo bằng nhau.",
      solution: "Trong {a}: {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["đường chéo", "hình học"]
    },
    {
      id: "c4_015",
      level: "kho",
      type: "multiple-choice",
      variables: {
        canh: { type: "int", min: 4, max: 10 }
      },
      constraints: [],
      formulas: {
        sVuong: "canh * canh",
        sTang: "(canh * 2) * (canh * 2)",
        ans: "4",
        w1: "2",
        w2: "8",
        w3: "16"
      },
      question: "Nếu độ dài cạnh của một hình vuông tăng lên gấp 2 lần thì diện tích của nó tăng lên gấp bao nhiêu lần?",
      hint: "$S_{mới} = (2a)^2 = 4a^2 = 4S_{cũ}$.",
      solution: "Khi cạnh tăng gấp 2 lần, diện tích tăng: $2^2 = 4$ lần.",
      options: ["4 lần", "2 lần", "8 lần", "16 lần"],
      correctIndex: 0,
      tags: ["hình vuông", "tỉ lệ diện tích"]
    },
    {
      id: "c4_016",
      level: "kho",
      type: "multiple-choice",
      variables: {
        cd: { type: "int", min: 10, max: 20 },
        cr: { type: "int", min: 6, max: 12 }
      },
      constraints: ["cd > cr"],
      formulas: {
        ans: "4",
        w1: "2",
        w2: "6",
        w3: "8"
      },
      question: "Nếu chiều dài và chiều rộng của một hình chữ nhật cùng tăng lên 2 lần thì diện tích hình chữ nhật tăng lên:",
      hint: "$S' = (2a) \\times (2b) = 4(ab)$.",
      solution: "Diện tích mới = $2a \\times 2b = 4ab = 4S$. Tăng 4 lần.",
      options: ["4 lần", "2 lần", "6 lần", "8 lần"],
      correctIndex: 0,
      tags: ["hình chữ nhật", "tỉ lệ diện tích"]
    },
    {
      id: "c4_017",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 4, max: 12 }
      },
      constraints: [],
      formulas: {
        ans: "3",
        w1: "6",
        w2: "4",
        w3: "8"
      },
      question: "Một hình lục giác đều có tất cả bao nhiêu đường chéo chính?",
      hint: "Đường chéo chính nối hai đỉnh đối diện của lục giác đều.",
      solution: "Hình lục giác đều có 3 đường chéo chính cắt nhau tại một điểm.",
      options: ["3", "6", "4", "8"],
      correctIndex: 0,
      tags: ["lục giác đều", "đường chéo"]
    },
    {
      id: "c4_018",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 5, max: 15 },
        b: { type: "int", min: 3, max: 10 }
      },
      constraints: [],
      formulas: {
        ans: "2 * (a + b)",
        w1: "a * b",
        w2: "4 * a",
        w3: "ans + 4"
      },
      question: "Một hình bình hành có độ dài hai cạnh kề là {a} cm và {b} cm. Chu vi hình bình hành đó là:",
      hint: "Chu vi hình bình hành $P = 2(a + b)$.",
      solution: "Chu vi hình bình hành = $2 \\times ({a} + {b}) = {ans}$ cm.",
      options: ["{ans} cm", "{w1} cm", "{w2} cm", "{w3} cm"],
      correctIndex: 0,
      tags: ["hình bình hành", "chu vi"]
    },
    {
      id: "c4_019",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        day: { type: "int", min: 10, max: 20 },
        cao: { type: "int", min: 6, max: 14 }
      },
      constraints: ["(day * cao) % 2 === 0"],
      formulas: {
        ans: "(day * cao) / 2",
        w1: "day * cao",
        w2: "day + cao",
        w3: "ans + 10"
      },
      question: "Diện tích của một hình tam giác có đáy {day} cm và chiều cao {cao} cm là:",
      hint: "Diện tích tam giác $S = \\frac{1}{2} a \\cdot h$.",
      solution: "Diện tích tam giác là: $\\frac{1}{2} \\times ${day} \\times ${cao} = {ans} \\text{ cm}^2$.",
      options: ["{ans} cm²", "{w1} cm²", "{w2} cm²", "{w3} cm²"],
      correctIndex: 0,
      tags: ["tam giác", "diện tích"]
    },
    {
      id: "c4_020",
      level: "kho",
      type: "multiple-choice",
      variables: {
        a: { type: "int", min: 10, max: 30 }
      },
      constraints: [],
      formulas: {
        p: "4 * a",
        s: "a * a",
        ans: "p === s ? 'Bằng nhau về giá trị số' : (p < s ? 'Diện tích lớn hơn chu vi về giá trị số' : 'Chu vi lớn hơn diện tích về giá trị số')",
        w1: "Luôn luôn bằng nhau",
        w2: "Không so sánh được",
        w3: "Chu vi luôn lớn hơn"
      },
      question: "Một hình vuông có cạnh {a} m. Khẳng định nào đúng về mối quan hệ giữa chu vi (m) và diện tích (m²)?",
      hint: "Chu vi $P = 4 \\times {a} = {p}$. Diện tích $S = {a} \\times {a} = {s}$.",
      solution: "Chu vi là {p} và diện tích là {s}. Ta có {ans}.",
      options: ["{ans}", "Luôn luôn bằng nhau", "Không so sánh được vì khác đơn vị", "Chu vi luôn lớn hơn"],
      correctIndex: 0,
      tags: ["hình vuông", "tư duy hình học"]
    }
  ]
};

// ==========================================
// CHƯƠNG 5: TÍNH ĐỐI XỨNG CỦA HÌNH PHẲNG (20 templates)
// ==========================================
const chapter5 = {
  metadata: {
    subject: "math",
    grade: 6,
    chapter: 5,
    title: "Tính đối xứng của hình phẳng trong tự nhiên",
    totalTemplates: 20
  },
  templates: [
    {
      id: "c5_001",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        shape: { type: "choice", options: ["Đoạn thẳng", "Tam giác đều", "Hình vuông", "Hình tròn"] }
      },
      constraints: [],
      formulas: {
        ans: "shape === 'Đoạn thẳng' ? '1 trục đối xứng' : shape === 'Tam giác đều' ? '3 trục đối xứng' : shape === 'Hình vuông' ? '4 trục đối xứng' : 'Vô số trục đối xứng'",
        w1: "shape === 'Đoạn thẳng' ? '2 trục đối xứng' : shape === 'Tam giác đều' ? '1 trục đối xứng' : shape === 'Hình vuông' ? '2 trục đối xứng' : '4 trục đối xứng'",
        w2: "shape === 'Đoạn thẳng' ? '3 trục đối xứng' : shape === 'Tam giác đều' ? '2 trục đối xứng' : shape === 'Hình vuông' ? '3 trục đối xứng' : '8 trục đối xứng'",
        w3: "Không có trục đối xứng"
      },
      question: "{shape} có bao nhiêu trục đối xứng?",
      hint: "Trục đối xứng là đường thẳng chia hình thành hai phần chồng khít lên nhau khi gấp theo đường đó.",
      solution: "{shape} có {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["trục đối xứng"]
    },
    {
      id: "c5_002",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        shape: { type: "choice", options: ["Hình chữ nhật", "Hình thoi", "Hình bình hành", "Hình thang cân"] }
      },
      constraints: [],
      formulas: {
        ans: "shape === 'Hình chữ nhật' ? '2 trục đối xứng' : shape === 'Hình thoi' ? '2 trục đối xứng' : shape === 'Hình bình hành' ? 'Không có trục đối xứng' : '1 trục đối xứng'",
        w1: "shape === 'Hình chữ nhật' ? '4 trục đối xứng' : shape === 'Hình thoi' ? '4 trục đối xứng' : shape === 'Hình bình hành' ? '2 trục đối xứng' : '2 trục đối xứng'",
        w2: "shape === 'Hình chữ nhật' ? '1 trục đối xứng' : shape === 'Hình thoi' ? '1 trục đối xứng' : shape === 'Hình bình hành' ? '1 trục đối xứng' : '4 trục đối xứng'",
        w3: "Vô số trục đối xứng"
      },
      question: "Số trục đối xứng của {shape} là:",
      hint: "Hình chữ nhật có 2 trục (nối trung điểm cạnh đối); hình thoi có 2 trục (chính là 2 đường chéo); hình bình hành tổng quát không có trục đối xứng.",
      solution: "{shape} có {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["trục đối xứng", "tứ giác"]
    },
    {
      id: "c5_003",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        shape: { type: "choice", options: ["Đoạn thẳng", "Hình bình hành", "Hình chữ nhật", "Hình thoi", "Hình vuông", "Hình tròn"] }
      },
      constraints: [],
      formulas: {
        ans: "shape === 'Đoạn thẳng' ? 'Trung điểm của đoạn thẳng' : shape === 'Hình tròn' ? 'Tâm của đường tròn' : 'Giao điểm của hai đường chéo'",
        w1: "Một đỉnh bất kỳ của hình",
        w2: "Trung điểm của cạnh đáy",
        w3: "Trọng tâm của tam giác"
      },
      question: "Tâm đối xứng của {shape} là điểm nào?",
      hint: "Khi quay hình 180 độ quanh tâm đối xứng, hình chồng khít lên chính nó.",
      solution: "Tâm đối xứng của {shape} là {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["tâm đối xứng"]
    },
    {
      id: "c5_004",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        letter: { type: "choice", options: ["A", "H", "O", "N", "M", "X", "Z"] }
      },
      constraints: [],
      formulas: {
        ans: "letter === 'A' || letter === 'M' ? 'Có trục đối xứng nhưng không có tâm đối xứng' : letter === 'N' || letter === 'Z' ? 'Có tâm đối xứng nhưng không có trục đối xứng' : 'Có cả trục đối xứng và tâm đối xứng'",
        w1: "Không có tính chất đối xứng nào",
        w2: "Chỉ có tâm đối xứng",
        w3: "Chỉ có trục đối xứng"
      },
      question: "Chữ cái in hoa '{letter}' có tính chất đối xứng nào sau đây?",
      hint: "Quan sát trục thẳng đứng/nằm ngang và phép quay 180 độ của chữ cái '{letter}'.",
      solution: "Chữ cái '{letter}' {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["chữ cái đối xứng", "thực tế"]
    },
    {
      id: "c5_005",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        item: { type: "choice", options: ["Hình tam giác đều", "Hình thang cân"] }
      },
      constraints: [],
      formulas: {
        ans: "Có trục đối xứng nhưng không có tâm đối xứng",
        w1: "Có cả trục đối xứng và tâm đối xứng",
        w2: "Chỉ có tâm đối xứng",
        w3: "Không có trục đối xứng"
      },
      question: "Phát biểu nào sau đây ĐÚNG về tính đối xứng của {item}?",
      hint: "Tam giác đều và hình thang cân có trục đối xứng nhưng không có tâm đối xứng.",
      solution: "{item} {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["tính đối xứng", "nhận biết"]
    },
    {
      id: "c5_006",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        item: { type: "choice", options: ["Hình bình hành", "Chữ cái N", "Chữ cái S", "Chữ cái Z"] }
      },
      constraints: [],
      formulas: {
        ans: "Có tâm đối xứng nhưng không có trục đối xứng",
        w1: "Có trục đối xứng",
        w2: "Có cả trục và tâm đối xứng",
        w3: "Không có tính đối xứng"
      },
      question: "Hình nào sau đây có tâm đối xứng nhưng KHÔNG có trục đối xứng?",
      hint: "Quay 180 độ thì trùng nhau nhưng gấp đôi thì không khớp nhau.",
      solution: "{item} {ans}.",
      options: ["{item}", "Hình tam giác đều", "Hình thang cân", "Hình trái tim"],
      correctIndex: 0,
      tags: ["tâm đối xứng", "không có trục"]
    },
    {
      id: "c5_007",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        n: { type: "choice", options: [6, 8] }
      },
      constraints: [],
      formulas: {
        ans: "n === 6 ? '6 trục đối xứng' : '8 trục đối xứng'",
        w1: "n === 6 ? '3 trục đối xứng' : '4 trục đối xứng'",
        w2: "n === 6 ? '12 trục đối xứng' : '16 trục đối xứng'",
        w3: "1 trục đối xứng"
      },
      question: "Một hình đa giác đều có {n} cạnh (hình {n === 6 ? 'lục giác đều' : 'bát giác đều'}) có bao nhiêu trục đối xứng?",
      hint: "Đa giác đều $n$ cạnh luôn có đúng $n$ trục đối xứng.",
      solution: "Đa giác đều có {n} cạnh có đúng {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["đa giác đều", "trục đối xứng"]
    },
    {
      id: "c5_008",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        trafficSign: { type: "choice", options: ["Biển báo cấm đi ngược chiều (hình tròn đỏ có vạch trắng ngang)", "Biển báo đường ưu tiên (hình thoi vàng viền trắng)", "Biển báo nguy hiểm (hình tam giác đều viền đỏ)"] }
      },
      constraints: [],
      formulas: {
        ans: "trafficSign.includes('tam giác') ? 'Có 1 hoặc 3 trục đối xứng' : 'Có cả trục đối xứng và tâm đối xứng'",
        w1: "Không có đối xứng",
        w2: "Chỉ có tâm đối xứng",
        w3: "Vô số tâm đối xứng"
      },
      question: "Biển báo giao thông '{trafficSign}' có đặc điểm đối xứng nào?",
      hint: "Quan sát hình dáng và họa tiết bên trong biển báo.",
      solution: "Biển báo này {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["biển báo giao thông", "đối xứng thực tế"]
    },
    {
      id: "c5_009",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        digit: { type: "choice", options: [0, 8] }
      },
      constraints: [],
      formulas: {
        ans: "Có cả trục đối xứng và tâm đối xứng",
        w1: "Chỉ có trục đối xứng",
        w2: "Chỉ có tâm đối xứng",
        w3: "Không có đối xứng"
      },
      question: "Chữ số {digit} (viết chuẩn) có tính chất đối xứng nào sau đây?",
      hint: "Chữ số {digit} có trục đối xứng ngang, dọc và tâm đối xứng ở chính giữa.",
      solution: "Chữ số {digit} {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["chữ số đối xứng"]
    },
    {
      id: "c5_010",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        leaf: { type: "choice", options: ["Lá phong", "Lá bàng", "Cánh bướm", "Mặt người"] }
      },
      constraints: [],
      formulas: {
        ans: "Trục đối xứng",
        w1: "Tâm đối xứng",
        w2: "Cả trục và tâm đối xứng",
        w3: "Không có đối xứng"
      },
      question: "Trong tự nhiên, {leaf} thường có tính chất đối xứng nào rõ nét nhất?",
      hint: "Các sinh vật sống và lá cây thường có đối xứng hai bên (đối xứng trục).",
      solution: "Trong tự nhiên, {leaf} có tính chất đối xứng {ans} rõ nét.",
      options: ["Trục đối xứng", "Tâm đối xứng", "Cả trục và tâm đối xứng", "Không có đối xứng"],
      correctIndex: 0,
      tags: ["đối xứng tự nhiên"]
    },
    {
      id: "c5_011",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        angle: { type: "int", min: 30, max: 120 }
      },
      constraints: [],
      formulas: {
        ans: "Đường phân giác của góc đó",
        w1: "Một cạnh của góc",
        w2: "Đường cao của góc",
        w3: "Đường trung tuyến"
      },
      question: "Trục đối xứng của một góc bất kỳ (khác góc bẹt) là:",
      hint: "Tia phân giác chia góc thành hai góc bằng nhau.",
      solution: "Trục đối xứng của một góc là đường thẳng chứa tia phân giác của góc đó.",
      options: ["Đường phân giác của góc đó", "Một cạnh của góc", "Đường cao của góc", "Đường trung tuyến"],
      correctIndex: 0,
      tags: ["trục đối xứng của góc"]
    },
    {
      id: "c5_012",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        side: { type: "int", min: 4, max: 10 }
      },
      constraints: [],
      formulas: {
        ans: "Đường trung trực và là trục đối xứng",
        w1: "Đường phân giác",
        w2: "Đường cao",
        w3: "Đường trung tuyến"
      },
      question: "Đường thẳng vuông góc với đoạn thẳng $AB$ tại trung điểm của nó được gọi là gì và đóng vai trò gì đối với đoạn thẳng $AB$?",
      hint: "Đường trung trực vừa đi qua trung điểm vừa vuông góc.",
      solution: "Đó là đường trung trực của đoạn thẳng $AB$, và nó là trục đối xứng của đoạn thẳng $AB$.",
      options: ["Đường trung trực và là trục đối xứng", "Đường phân giác", "Đường cao", "Đường trung tuyến"],
      correctIndex: 0,
      tags: ["đường trung trực", "trục đối xứng"]
    },
    {
      id: "c5_013",
      level: "kho",
      type: "multiple-choice",
      variables: {
        flower: { type: "choice", options: ["Hoa sen (5 cánh đều)", "Bông tuyết (6 cánh đều)", "Cỏ 4 lá"] }
      },
      constraints: [],
      formulas: {
        ans: "flower.includes('6') || flower.includes('4') ? 'Có cả trục đối xứng và tâm đối xứng' : 'Có trục đối xứng nhưng không có tâm đối xứng'",
        w1: "Không có đối xứng",
        w2: "Chỉ có tâm đối xứng",
        w3: "Vô số tâm đối xứng"
      },
      question: "Biểu tượng '{flower}' trong tự nhiên có tính chất đối xứng nào?",
      hint: "Số cánh chẵn thường có cả tâm và trục đối xứng; số cánh lẻ chỉ có trục đối xứng.",
      solution: "Biểu tượng {flower} {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["bông tuyết", "hoa", "đối xứng tự nhiên"]
    },
    {
      id: "c5_014",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        flag: { type: "choice", options: ["Quốc kỳ Việt Nam (Cờ đỏ sao vàng)", "Quốc kỳ Nhật Bản (Mặt trời đỏ nền trắng)", "Quốc kỳ Thụy Sĩ (Chữ thập trắng nền đỏ)"] }
      },
      constraints: [],
      formulas: {
        ans: "flag.includes('Việt Nam') ? 'Có 1 trục đối xứng thẳng đứng' : 'Có cả trục đối xứng và tâm đối xứng'",
        w1: "Không có trục đối xứng",
        w2: "Có 4 tâm đối xứng",
        w3: "Chỉ có tâm đối xứng"
      },
      question: "{flag} có tính chất đối xứng nào?",
      hint: "Quan sát ngôi sao 5 cánh (trục đứng) hoặc hình tròn/chữ thập ở tâm.",
      solution: "{flag} {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["quốc kỳ", "đối xứng"]
    },
    {
      id: "c5_015",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        a: { type: "choice", options: ["Hình có trục đối xứng", "Hình có tâm đối xứng"] }
      },
      constraints: [],
      formulas: {
        ans: "a === 'Hình có trục đối xứng' ? 'Gấp hình theo trục đối xứng thì hai nửa trùng khít nhau' : 'Quay hình 180 độ quanh tâm thì hình trùng khít với chính nó'",
        w1: "Tịnh tiến hình sang phải",
        w2: "Thu nhỏ hình lại một nửa",
        w3: "Phóng to hình lên gấp đôi"
      },
      question: "Nguyên lý cơ bản để kiểm tra {a} là:",
      hint: "Gấp theo trục đối xứng hoặc quay nửa vòng (180 độ) quanh tâm.",
      solution: "Để kiểm tra {a}: {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["nguyên lý đối xứng"]
    },
    {
      id: "c5_016",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        x: { type: "choice", options: ["Chữ B", "Chữ C", "Chữ D", "Chữ E"] }
      },
      constraints: [],
      formulas: {
        ans: "Trục đối xứng nằm ngang",
        w1: "Trục đối xứng thẳng đứng",
        w2: "Tâm đối xứng",
        w3: "Không có đối xứng"
      },
      question: "Các chữ cái in hoa như {x} có loại trục đối xứng nào?",
      hint: "Gấp theo đường ngang chính giữa chữ cái.",
      solution: "Chữ cái in hoa {x} có {ans}.",
      options: ["Trục đối xứng nằm ngang", "Trục đối xứng thẳng đứng", "Tâm đối xứng", "Không có đối xứng"],
      correctIndex: 0,
      tags: ["chữ cái", "trục ngang"]
    },
    {
      id: "c5_017",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        x: { type: "choice", options: ["Chữ A", "Chữ M", "Chữ T", "Chữ V", "Chữ Y"] }
      },
      constraints: [],
      formulas: {
        ans: "Trục đối xứng thẳng đứng",
        w1: "Trục đối xứng nằm ngang",
        w2: "Tâm đối xứng",
        w3: "Không có đối xứng"
      },
      question: "Các chữ cái in hoa như {x} có loại trục đối xứng nào?",
      hint: "Gấp theo đường thẳng đứng chính giữa chữ cái.",
      solution: "Chữ cái in hoa {x} có {ans}.",
      options: ["Trục đối xứng thẳng đứng", "Trục đối xứng nằm ngang", "Tâm đối xứng", "Không có đối xứng"],
      correctIndex: 0,
      tags: ["chữ cái", "trục đứng"]
    },
    {
      id: "c5_018",
      level: "nang-cao",
      type: "multiple-choice",
      variables: {
        s: { type: "choice", options: ["Chữ H", "Chữ I", "Chữ O", "Chữ X"] }
      },
      constraints: [],
      formulas: {
        ans: "2 trục đối xứng (ngang, dọc) và 1 tâm đối xứng",
        w1: "1 trục đối xứng và không có tâm",
        w2: "Chỉ có tâm đối xứng",
        w3: "4 trục đối xứng"
      },
      question: "Chữ cái in hoa {s} có tính chất đối xứng nào?",
      hint: "Vừa có trục ngang, trục dọc và tâm ở chính giữa.",
      solution: "Chữ cái in hoa {s} có {ans}.",
      options: ["2 trục đối xứng (ngang, dọc) và 1 tâm đối xứng", "1 trục đối xứng và không có tâm", "Chỉ có tâm đối xứng", "4 trục đối xứng"],
      correctIndex: 0,
      tags: ["chữ cái", "hai trục và tâm"]
    },
    {
      id: "c5_019",
      level: "kho",
      type: "multiple-choice",
      variables: {
        name: { type: "choice", options: ["Tam giác vuông cân", "Hình thang vuông", "Hình bình hành không có góc vuông"] }
      },
      constraints: [],
      formulas: {
        ans: "name === 'Tam giác vuông cân' ? '1 trục đối xứng' : '0 trục đối xứng'",
        w1: "name === 'Tam giác vuông cân' ? '2 trục đối xứng' : '1 trục đối xứng'",
        w2: "name === 'Tam giác vuông cân' ? '3 trục đối xứng' : '2 trục đối xứng'",
        w3: "Vô số trục đối xứng"
      },
      question: "{name} có bao nhiêu trục đối xứng?",
      hint: "Tam giác vuông cân có trục đối xứng là đường cao/phân giác kẻ từ đỉnh góc vuông.",
      solution: "{name} có {ans}.",
      options: ["{ans}", "{w1}", "{w2}", "{w3}"],
      correctIndex: 0,
      tags: ["trục đối xứng nâng cao"]
    },
    {
      id: "c5_020",
      level: "co-ban",
      type: "multiple-choice",
      variables: {
        a: { type: "choice", options: ["Đường tròn", "Hình tròn"] }
      },
      constraints: [],
      formulas: {
        ans: "Vô số trục đối xứng (mọi đường thẳng đi qua tâm)",
        w1: "Chỉ có 2 trục đối xứng",
        w2: "Chỉ có 4 trục đối xứng",
        w3: "Không có trục đối xứng"
      },
      question: "{a} có bao nhiêu trục đối xứng?",
      hint: "Bất kỳ đường thẳng nào đi qua tâm đường tròn đều là trục đối xứng.",
      solution: "{a} có vô số trục đối xứng, đó là mọi đường thẳng đi qua tâm của nó.",
      options: ["Vô số trục đối xứng (mọi đường thẳng đi qua tâm)", "Chỉ có 2 trục đối xứng", "Chỉ có 4 trục đối xứng", "Không có trục đối xứng"],
      correctIndex: 0,
      tags: ["đường tròn", "vô số trục"]
    }
  ]
};

// Ghi 5 file JSON ra đĩa
const files = [
  { name: 'chapter1_integers.json', data: chapter1 },
  { name: 'chapter2_fractions.json', data: chapter2 },
  { name: 'chapter3_geometry.json', data: chapter3 },
  { name: 'chapter4_statistics.json', data: chapter4 },
  { name: 'chapter5_ratios.json', data: chapter5 }
];

for (const file of files) {
  const filePath = path.join(outDir, file.name);
  fs.writeFileSync(filePath, JSON.stringify(file.data, null, 2), 'utf-8');
  console.log(`✅ Xuất thành công: ${file.name} (${file.data.templates.length} templates)`);
}

console.log('🎉 ĐÃ HOÀN TẤT TẠO 5 FILE JSON NGÂN HÀNG ĐỀ TOÁN LỚP 6!');
