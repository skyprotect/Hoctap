const fs = require('fs');
const path = require('path');

console.log("====================================================");
console.log("BẮT ĐẦU KIỂM ĐỊNH TỰ ĐỘNG BỘ SINH CÂU HỎI TIẾNG ANH");
console.log("====================================================\n");

// Tải dữ liệu và hàm sinh câu hỏi tiếng Anh
const englishDataPath = path.join(__dirname, 'js/english_data.js');
let englishModule;

try {
    englishModule = require(englishDataPath);
} catch (e) {
    console.error("Không thể load trực tiếp bằng require, tiến hành giả lập window context...");
    // Giả lập môi trường window/client
    const vm = require('vm');
    const sandbox = {
        console: console,
        Math: Math,
        Array: Array,
        Object: Object,
        String: String,
        Number: Number,
        Set: Set,
        Map: Map,
        RegExp: RegExp,
        window: {},
        module: {},
        exports: {}
    };
    const code = fs.readFileSync(englishDataPath, 'utf8');
    vm.runInNewContext(code, sandbox);
    englishModule = sandbox.window;
}

const { ENGLISH_COURSE_DATA, generateEnglishQuestions, generateIoeQuestions } = englishModule;

if (!ENGLISH_COURSE_DATA) {
    console.error("❌ Lỗi: Không tìm thấy dữ liệu ENGLISH_COURSE_DATA.");
    process.exit(1);
}

let totalTests = 0;
let failedTests = 0;
const errors = [];

const skills = ['listening', 'speaking', 'reading', 'writing'];

// Duyệt qua từng khối lớp
for (const classLevel in ENGLISH_COURSE_DATA) {
    const classData = ENGLISH_COURSE_DATA[classLevel];
    console.log(`\n📚 Đang kiểm tra Khối lớp ${classLevel} (${classData.levelLabel}):`);
    
    // Duyệt qua từng Unit (Topic)
    classData.topics.forEach(topic => {
        console.log(`  ➔ Unit: ${topic.title} (${topic.id})`);
        
        // 1. Kiểm tra 4 kỹ năng chính
        skills.forEach(skill => {
            totalTests++;
            try {
                // Chạy hàm sinh câu hỏi
                const questions = generateEnglishQuestions(classLevel, topic.id, skill);
                
                // Kiểm tra số lượng câu hỏi
                if (!questions || !Array.isArray(questions)) {
                    throw new Error(`Kết quả sinh câu hỏi không phải là mảng hoặc rỗng.`);
                }
                
                if (questions.length === 0) {
                    throw new Error(`Mảng câu hỏi trống rỗng.`);
                }
                
                // Kiểm tra số lượng câu hỏi thực tế (mục tiêu là 15 câu, tuy nhiên chấp nhận tối thiểu 10 câu nếu bài học thiếu từ vựng)
                if (questions.length < 10 || questions.length > 15) {
                    throw new Error(`Số lượng câu hỏi sinh ra không đạt chuẩn (có ${questions.length} câu, yêu cầu từ 10 đến 15 câu).`);
                }
                
                // Duyệt qua từng câu hỏi để kiểm tra tính hợp lệ
                questions.forEach((q, idx) => {
                    if (!q.type) throw new Error(`Câu hỏi số ${idx + 1} thiếu thuộc tính 'type'.`);
                    if (!q.questionText) throw new Error(`Câu hỏi số ${idx + 1} thiếu 'questionText'.`);
                    if (!q.correctAnswer) throw new Error(`Câu hỏi số ${idx + 1} thiếu 'correctAnswer'.`);
                    
                    // Kiểm tra trắc nghiệm
                    if (q.options) {
                        if (!Array.isArray(q.options) || q.options.length < 2) {
                            throw new Error(`Câu hỏi số ${idx + 1} có danh sách 'options' không hợp lệ.`);
                        }
                        
                        // Đáp án đúng phải nằm trong danh sách lựa chọn
                        const hasCorrect = q.options.some(opt => 
                            opt.toString().toLowerCase().trim() === q.correctAnswer.toString().toLowerCase().trim()
                        );
                        if (!hasCorrect) {
                            throw new Error(`Câu hỏi số ${idx + 1}: Đáp án đúng '${q.correctAnswer}' không nằm trong các phương án lựa chọn: ${JSON.stringify(q.options)}`);
                        }
                        
                        // Không được trùng lặp đáp án
                        const uniqueOpts = new Set(q.options.map(opt => opt.toString().toLowerCase().trim()));
                        if (uniqueOpts.size !== q.options.length) {
                            throw new Error(`Câu hỏi số ${idx + 1}: Phát hiện trùng lặp đáp án trong các phương án lựa chọn: ${JSON.stringify(q.options)}`);
                        }
                    }
                    
                    // Kiểm tra sắp xếp từ (writing)
                    if (q.type === 'writing' && q.wordPool) {
                        if (!Array.isArray(q.wordPool) || q.wordPool.length === 0) {
                            throw new Error(`Câu hỏi viết sắp xếp số ${idx + 1} có 'wordPool' không hợp lệ.`);
                        }
                    }
                });
                
            } catch (err) {
                failedTests++;
                errors.push({
                    classLevel,
                    topicId: topic.id,
                    topicTitle: topic.title,
                    type: `Kỹ năng: ${skill.toUpperCase()}`,
                    message: err.message
                });
            }
        });
        
        // 2. Kiểm tra bộ sinh câu hỏi IOE
        totalTests++;
        try {
            const ioeQuestions = generateIoeQuestions(classLevel, topic.id);
            if (!ioeQuestions || !Array.isArray(ioeQuestions) || ioeQuestions.length === 0) {
                throw new Error("Không thể sinh câu hỏi IOE.");
            }
            if (ioeQuestions.length !== 20) {
                throw new Error(`Số lượng câu hỏi IOE không bằng 20 (có ${ioeQuestions.length} câu).`);
            }
            
            ioeQuestions.forEach((q, idx) => {
                if (!q.type) throw new Error(`Câu hỏi IOE số ${idx + 1} thiếu 'type'.`);
                if (!q.questionText) throw new Error(`Câu hỏi IOE số ${idx + 1} thiếu 'questionText'.`);
                
                // Kiểm tra trắc nghiệm IOE
                if (q.options) {
                    if (!q.correctAnswer) throw new Error(`Câu hỏi trắc nghiệm IOE số ${idx + 1} thiếu 'correctAnswer'.`);
                    const hasCorrect = q.options.some(opt => 
                        opt.toString().toLowerCase().trim() === q.correctAnswer.toString().toLowerCase().trim()
                    );
                    if (!hasCorrect) {
                        throw new Error(`Câu hỏi IOE số ${idx + 1}: Đáp án đúng '${q.correctAnswer}' không nằm trong options: ${JSON.stringify(q.options)}`);
                    }
                    const uniqueOpts = new Set(q.options.map(opt => opt.toString().toLowerCase().trim()));
                    if (uniqueOpts.size !== q.options.length) {
                        throw new Error(`Câu hỏi IOE số ${idx + 1}: Trùng lặp đáp án: ${JSON.stringify(q.options)}`);
                    }
                }
            });
        } catch (err) {
            failedTests++;
            errors.push({
                classLevel,
                topicId: topic.id,
                topicTitle: topic.title,
                type: "Luyện thi IOE",
                message: err.message
            });
        }
    });
}

console.log("\n====================================================");
console.log("KẾT QUẢ KIỂM ĐỊNH BỘ SINH CÂU HỎI TIẾNG ANH");
console.log("====================================================");
console.log(`- Tổng số lượt kiểm thử (Unit x Kỹ năng/IOE): ${totalTests}`);
console.log(`- Thành công: ${totalTests - failedTests}`);
console.log(`- Thất bại: ${failedTests}`);

if (failedTests > 0) {
    console.log(`\n❌ PHÁT HIỆN ${failedTests} LỖI TRONG BỘ SINH ĐỀ TIẾNG ANH:`);
    errors.forEach((err, idx) => {
        console.log(`  ${idx + 1}. [Lớp ${err.classLevel}] [${err.topicTitle} - ${err.topicId}] [${err.type}]: ${err.message}`);
    });
    process.exit(1);
} else {
    console.log("\n🎉 HOÀN TOÀN THÀNH CÔNG! 100% các bài học Tiếng Anh sinh câu hỏi mượt mà, bao quát đầy đủ, không trùng lặp đáp án!");
    process.exit(0);
}
