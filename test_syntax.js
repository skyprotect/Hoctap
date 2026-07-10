// Kịch bản tự động kiểm thử toàn bộ các dạng câu hỏi của Lớp 4 và Lớp 6
// Chạy kiểm tra tính đúng đắn của đề bài, đáp án nhiễu, latex, không trùng lặp và không chứa NaN/Infinity

// Giả lập môi trường trình duyệt cho Node.js
global.window = {
    Swal: {
        fire: () => {}
    }
};
global.document = {
    getElementById: () => ({
        classList: {
            add: () => {},
            remove: () => {}
        },
        innerText: ""
    }),
    addEventListener: () => {}
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {}
};

// Chạy load file để khởi tạo trên window
require('./js/questions-v3.js');
require('./js/questions-v4.js');

const questionsL6 = global.window.questions;
const questionsL4 = global.window.questionsL4;

// Chuẩn hóa chuỗi đáp án phục vụ so sánh trùng lặp
function normalizeOption(opt) {
    if (opt === undefined || opt === null) return '';
    let s = opt.toString().trim();
    if (s.startsWith('$') && s.endsWith('$')) {
        s = s.substring(1, s.length - 1).trim();
    }
    s = s.replace(/\\,/g, '')
         .replace(/\\space/g, '')
         .replace(/\s+/g, '')
         .replace(/\\frac{([^}]+)}{([^}]+)}/g, '$1/$2')
         .replace(/{/g, '')
         .replace(/}/g, '')
         .replace(/\\cdot/g, '*')
         .replace(/\\times/g, '*')
         .replace(/:/g, '/');
    return s;
}

// Kiểm tra cú pháp LaTeX cân bằng dấu $
function checkLatexBalance(str) {
    if (!str) return true;
    const count = (str.match(/\$/g) || []).length;
    return count % 2 === 0;
}

// Kiểm tra xem chuỗi có chứa giá trị vô nghĩa hay số thập phân lẻ không
function containsUndefinedOrBadValues(obj, isL4 = false) {
    const str = JSON.stringify(obj);
    if (str.includes('undefined') || str.includes('NaN') || str.includes('Infinity') || str.includes('null')) {
        return true;
    }
    
    if (isL4) {
        // Tìm tất cả pattern số có dấu chấm thập phân
        const matches = str.match(/\b\d+\.\d+\b/g);
        if (matches) {
            for (const m of matches) {
                // Bỏ qua định dạng hàng nghìn vi-VN: XX.XXX hoặc X.XXX (đúng 3 chữ số sau dấu chấm)
                if (/^\d+\.\d{3}$/.test(m)) continue;
                const val = parseFloat(m);
                if (!Number.isInteger(val)) {
                    return true;
                }
            }
        }
    }
    return false;
}


const tests = [
    { name: "LỚP 4", generator: questionsL4, isL4: true, types: [
        "l4-on-tap-100k", "l4-phep-tinh-100k", "l4-so-chan-le", "l4-bieu-thuc-chu", "l4-toan-ba-buoc-tinh",
        "l4-do-goc", "l4-phan-loai-goc", "l4-so-sau-chu-so", "l4-hang-va-lop", "l4-lop-trieu",
        "l4-lam-tron-tram-nghin", "l4-so-sanh-nhieu-chu-so", "l4-day-so-tu-nhien", "l4-yen-ta-tan",
        "l4-don-vi-dien-tich", "l4-giay-the-ki", "l4-cong-nhieu-chu-so", "l4-tru-nhieu-chu-so",
        "l4-tinh-chat-cong", "l4-tong-hieu", "l4-duong-vuong-goc", "l4-duong-song-song",
        "l4-binh-hanh-thoi", "l4-nhan-mot-chu-so", "l4-chia-mot-chu-so", "l4-nhan-chia-10-100",
        "l4-trung-binh-cong", "l4-rut-ve-don-vi", "l4-khai-niem-phan-so", "l4-phan-so-chia-so-tu-nhien",
        "l4-rut-gon-phan-so", "l4-so-sanh-phan-so", "l4-cong-phan-so", "l4-tru-phan-so",
        "l4-nhan-phan-so", "l4-tim-phan-so-cua-so"
    ]},
    { name: "LỚP 6", generator: questionsL6, isL6: true, types: [
        "tap-hop", "ghi-so-tu-nhien", "tap-hop-thu-tu", "cong-tru-so-tu-nhien", "nhan-chia-so-tu-nhien", "luy-thua", "thu-tu-phep-tinh",
        "quan-he-chia-het", "dau-hieu-chia-het", "so-nguyen-to", "ucln", "bcnn",
        "tap-hop-so-nguyen", "cong-tru-so-nguyen", "dau-ngoac", "nhan-so-nguyen", "chia-het-uoc-boi-so-nguyen",
        "hinh-hoc-chuong-4", "hinh-hoc-2-chuong-4", "chu-vi-dien-tich",
        "truc-doi-xung", "tam-doi-xung",
        "phan-so-bang-nhau", "so-sanh-phan-so", "cong-tru-phan-so", "nhan-chia-phan-so", "hai-bai-toan-phan-so",
        "so-thap-phan", "tinh-so-thap-phan", "lam-tron-uoc-luong", "ti-so-phan-tram",
        "diem-duong-thang", "tia-hinh-hoc", "doan-thang", "trung-diem", "goc", "so-do-goc",
        "thu-thap-du-lieu", "bang-thong-ke-bieu-do-tranh", "bieu-do-cot", "bieu-do-cot-kep", "ket-qua-co-the", "xac-suat-thuc-nghiem"
    ]}
];

let totalFailed = 0;
let totalPassed = 0;

console.log("================= BẮT ĐẦU KIỂM THỬ TỰ ĐỘNG CÂU HỎI =================");

tests.forEach(testSuite => {
    console.log(`\n--- KIỂM TRA HỆ THỐNG CÂU HỎI ${testSuite.name} ---`);
    
    testSuite.types.forEach(type => {
        let failedType = false;
        
        for (let i = 0; i < 20; i++) {
            try {
                const q = testSuite.generator.generateQuestion(type, "co-ban");
                
                if (!(q.questionText || q.question) || !q.options || q.options.length !== 4 || q.correctIndex === undefined) {
                    console.error(`❌ [${type}] Lần ${i+1}: Cấu trúc câu hỏi trả về không hợp lệ!`, q);
                    failedType = true;
                    break;
                }
                
                const normOpts = q.options.map(o => normalizeOption(o));
                const uniqueOpts = new Set(normOpts);
                if (uniqueOpts.size < 4) {
                    console.error(`❌ [${type}] Lần ${i+1}: Phát hiện trùng lặp đáp án!`);
                    q.options.forEach((opt, idx) => console.log(`   - Option ${idx}: "${opt}" -> Chuẩn hóa: "${normOpts[idx]}"`));
                    failedType = true;
                    break;
                }
                
                if (containsUndefinedOrBadValues(q, testSuite.isL4)) {
                    console.error(`❌ [${type}] Lần ${i+1}: Câu hỏi chứa giá trị lỗi (NaN, undefined, Infinity hoặc số thập phân lẻ)!`, q);
                    failedType = true;
                    break;
                }
                
                if (!checkLatexBalance(q.question) || q.options.some(o => !checkLatexBalance(o)) || !checkLatexBalance(q.solution)) {
                    console.error(`❌ [${type}] Lần ${i+1}: Lỗi lệch dấu $ trong LaTeX!`, q);
                    failedType = true;
                    break;
                }

            } catch (err) {
                console.error(`❌ [${type}] Lần ${i+1}: Quá trình sinh câu hỏi ném ra ngoại lệ (Exception)!`, err);
                failedType = true;
                break;
            }
        }
        
        if (failedType) {
            totalFailed++;
        } else {
            totalPassed++;
        }
    });
});

console.log("\n================= KẾT QUẢ KIỂM THỬ TỔNG QUAN =================");
console.log(`✅ Tổng số dạng câu hỏi vượt qua kiểm thử: ${totalPassed}`);
console.log(`❌ Tổng số dạng câu hỏi thất bại: ${totalFailed}`);

if (totalFailed > 0) {
    console.log("Kết quả: THẤT BẠI. Vui lòng kiểm tra lại các lỗi được liệt kê ở trên.");
    process.exit(1);
} else {
    console.log("Kết quả: THÀNH CÔNG RỰC RỠ! Tất cả câu hỏi hoạt động hoàn hảo, không trùng lặp đáp án, không lỗi LaTeX.");
    process.exit(0);
}
