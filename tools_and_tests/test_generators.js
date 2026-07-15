const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 1. Mock môi trường trình duyệt tối giản để chạy code client trong Node.js
const sandbox = {
    console: console,
    Math: Math,
    Array: Array,
    Object: Object,
    String: String,
    Number: Number,
    Set: Set,
    Map: Map,
    parseInt: parseInt,
    parseFloat: parseFloat,
    isNaN: isNaN,
    isFinite: isFinite,
    JSON: JSON,
    window: {
        addEventListener: () => {}
    },
    document: {
        getElementById: () => ({ value: '', innerHTML: '', classList: { add: () => {}, remove: () => {} } }),
        querySelector: () => ({ innerHTML: '' }),
        addEventListener: () => {}
    },
    localStorage: {
        getItem: () => null,
        setItem: () => {}
    },
    app: {
        config: {
            currentClass: '6',
            defaultStudentId: 'default'
        },
        state: {
            history: [],
            examSessions: []
        },
        saveProgress: () => {},
        logLearningTime: () => {},
        checkAndUnlockBadges: () => {},
        updateHeaderStats: () => {},
        saveLessonScore: () => {},
        saveQuestionResult: () => {},
        unlockBadge: () => {}
    }
};
sandbox.window.app = sandbox.app;

// Hàm tải file JS vào context cô lập
function loadScript(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    vm.runInNewContext(code, sandbox, { filename: filePath });
}

// Tải các script generator
loadScript(path.join(__dirname, 'js/questions-v4.js'));
loadScript(path.join(__dirname, 'js/questions-v3.js'));

const questionsL4 = sandbox.window.questionsL4;
const questionsL6 = sandbox.window.questions; // Đối tượng questions trong questions-v3.js được gán vào window.questions

console.log("====================================================");
console.log("BẮT ĐẦU KIỂM ĐỊNH TỰ ĐỘNG CÁC GENERATOR BẰNG JAVASCRIPT");
console.log("====================================================\n");

// Danh sách các dạng bài lớp 4 cần rà soát
const grade4Types = [
    "l4-on-tap-100k", "l4-phep-tinh-100k", "l4-so-chan-le", "l4-bieu-thuc-chu", 
    "l4-toan-ba-buoc-tinh", "l4-do-goc", "l4-phan-loai-goc", "l4-so-sau-chu-so", 
    "l4-hang-va-lop", "l4-lop-trieu", "l4-lam-tron-tram-nghin", "l4-so-sanh-nhieu-chu-so",
    "l4-day-so-tu-nhien", "l4-yen-ta-tan", "l4-don-vi-dien-tich", "l4-giay-the-ki",
    "l4-cong-nhieu-chu-so", "l4-tru-nhieu-chu-so", "l4-tinh-chat-cong", "l4-tong-hieu"
];

// Danh sách các dạng bài lớp 6 cần rà soát
const grade6Types = [
    "tap-hop", "tap-hop-d1", "tap-hop-d2", "tap-hop-d3", "tap-hop-d4",
    "ghi-so-tu-nhien", "ghi-so-tu-nhien-d1", "ghi-so-tu-nhien-d2", "ghi-so-tu-nhien-d3", "ghi-so-tu-nhien-d4",
    "phep-tinh-so-tu-nhien", "phep-tinh-d1", "phep-tinh-d2", "phep-tinh-d3",
    "luy-thua", "luy-thua-d1", "luy-thua-d2", "luy-thua-d3", "luy-thua-d4",
    "thu-tu-phep-tinh", "thu-tu-d1", "thu-tu-d2", "thu-tu-d3", "thu-tu-d4"
];

let totalTests = 0;
let failedTests = 0;
const errors = [];

function runTest(generator, type, level, isL4 = false) {
    totalTests++;
    try {
        // Chạy thử 100 lần để tăng xác suất phát hiện va chạm đáp án ở các bộ số ngẫu nhiên
        for (let run = 0; run < 100; run++) {
            const q = generator.generateQuestion(type, level);
            
            // 1. Kiểm tra các thuộc tính bắt buộc
            if (!q.questionText) {
                throw new Error("Thiếu nội dung câu hỏi (questionText)");
            }
            
            // 2. Đối với câu trắc nghiệm, kiểm tra số lượng và trùng lặp đáp án
            if (!q.isShortAnswer) {
                if (!q.options || q.options.length === 0) {
                    throw new Error("Thiếu danh sách lựa chọn (options)");
                }
                if (q.options.length !== 4) {
                    throw new Error(`Số lượng đáp án không bằng 4 (có ${q.options.length} đáp án)`);
                }
                const uniqueOpts = new Set(q.options.map(o => o.toString().replace(/[\$\s\{\}\\\,\_\'\"]/g, "").toLowerCase()));
                if (uniqueOpts.size < 4) {
                    throw new Error(`Trùng lặp đáp án: ${JSON.stringify(q.options)}`);
                }
                if (q.correctIndex < 0 || q.correctIndex >= 4) {
                    throw new Error(`correctIndex không hợp lệ: ${q.correctIndex}`);
                }
            }
            
            // 3. Kiểm tra lệch dấu $ trong KaTeX
            const textToCheck = q.questionText + " " + (q.solutionHtml || "") + " " + (q.options ? q.options.join(" ") : "");
            const dollarCount = (textToCheck.match(/\$/g) || []).length;
            const escapedDollarCount = (textToCheck.match(/\\\$/g) || []).length;
            const netDollarCount = dollarCount - escapedDollarCount;
            if (netDollarCount % 2 !== 0) {
                throw new Error(`Lệch dấu KaTeX $ (Số lượng dấu $ là số lẻ: ${netDollarCount})`);
            }
        }
    } catch (err) {
        failedTests++;
        errors.push({
            grade: isL4 ? "Lớp 4" : "Lớp 6",
            type: type,
            level: level,
            message: err.message
        });
        return false;
    }
    return true;
}

// Chạy kiểm định Lớp 4
console.log("👉 Đang quét các generator Lớp 4...");
for (const type of grade4Types) {
    for (const level of ["co-ban", "nang-cao", "kho"]) {
        runTest(questionsL4, type, level, true);
    }
}

// Chạy kiểm định Lớp 6
console.log("👉 Đang quét các generator Lớp 6...");
for (const type of grade6Types) {
    for (const level of ["co-ban", "nang-cao", "kho"]) {
        runTest(questionsL6, type, level, false);
    }
}

console.log("\n====================================================");
console.log("KẾT QUẢ KIỂM ĐỊNH GENERATOR");
console.log("====================================================");
console.log(`- Tổng số lượt quét generator (loại bài x mức độ): ${totalTests}`);
console.log(`- Số lượt quét thành công: ${totalTests - failedTests}`);
console.log(`- Số lượt quét thất bại: ${failedTests}`);

if (failedTests > 0) {
    console.log(`❌ PHÁT HIỆN ${failedTests} LỖI TRONG CÁC GENERATOR:`);
    errors.forEach((err, idx) => {
        console.log(`  ${idx + 1}. [${err.grade}] Dạng [${err.type}] - Mức [${err.level}]: ${err.message}`);
    });
    process.exit(1);
} else {
    console.log("🎉 Tuyệt vời! Không phát hiện lỗi trùng đáp án, lệch LaTeX hay lỗi cú pháp nào trong các generator bằng code.");
    process.exit(0);
}
