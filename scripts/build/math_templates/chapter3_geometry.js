module.exports = {
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
};;
