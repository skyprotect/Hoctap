require('ts-node').register({ transpileOnly: true });
const fs = require('fs');
const path = require('path');

console.log("====================================================");
console.log("BẮT ĐẦU KIỂM ĐỊNH TỰ ĐỘNG DỮ LIỆU & GENERATOR TIẾNG ANH");
console.log("====================================================\n");

const dataDir = path.join(__dirname, '../../data/english');
const gradeFiles = [
    { grade: "1", file: 'grade_1_lessons.json' },
    { grade: "4", file: 'grade_4_lessons.json' },
    { grade: "6", file: 'grade_6_lessons.json' }
];

let totalTests = 0;
let failedTests = 0;
const errors = [];

// 1. Kiểm định các tệp giáo trình tiếng Anh Lớp 1, 4, 6
gradeFiles.forEach(({ grade, file }) => {
    const filePath = path.join(dataDir, file);
    totalTests++;
    console.log(`📚 Đang kiểm tra Giáo trình Tiếng Anh Lớp ${grade} (${file})...`);
    
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error(`Tệp ${file} không tồn tại trên ổ đĩa.`);
        }

        const raw = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(raw);

        if (!data.levelLabel) throw new Error("Thiếu thuộc tính 'levelLabel'");
        if (!data.topics || !Array.isArray(data.topics) || data.topics.length === 0) {
            throw new Error("Danh sách 'topics' trống hoặc không hợp lệ");
        }

        let totalVocab = 0;
        data.topics.forEach((topic, tIdx) => {
            if (!topic.id || !topic.title) {
                throw new Error(`Topic #${tIdx + 1} thiếu 'id' hoặc 'title'`);
            }
            if (topic.vocab && Array.isArray(topic.vocab)) {
                totalVocab += topic.vocab.length;
                topic.vocab.forEach((v, vIdx) => {
                    if (!v.word || !v.translation) {
                        throw new Error(`Topic '${topic.title}' từ #${vIdx + 1} thiếu 'word' hoặc 'translation'`);
                    }
                });
            }
        });

        console.log(`  ✓ Lớp ${grade}: ${data.topics.length} Units, ${totalVocab} từ vựng chuẩn.`);
    } catch (err) {
        failedTests++;
        errors.push({
            target: `Tiếng Anh Lớp ${grade}`,
            message: err.message
        });
    }
});

// 2. Kiểm định Từ điển Từ vựng tập trung (vocabulary_dict.json)
totalTests++;
console.log(`\n📚 Đang kiểm tra Từ điển Từ vựng tập trung (vocabulary_dict.json)...`);
try {
    const dictPath = path.join(dataDir, 'vocabulary_dict.json');
    if (!fs.existsSync(dictPath)) throw new Error("vocabulary_dict.json không tồn tại");
    const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
    const wordCount = Object.keys(dict).length;
    if (wordCount < 100) throw new Error(`Số lượng từ vựng trong từ điển quá ít (${wordCount} từ)`);
    console.log(`  ✓ Từ điển từ vựng tập trung: ${wordCount} mục từ hợp lệ.`);
} catch (err) {
    failedTests++;
    errors.push({
        target: "vocabulary_dict.json",
        message: err.message
    });
}

// 3. Kiểm định Prompt Builders Tiếng Anh
totalTests++;
console.log(`\n📚 Đang kiểm tra Prompt Builders Tiếng Anh...`);
try {
    const { getEnglishPrompt, getEnglishFullExamPrompt, getEnglishCustomTopicPrompt } = require('../../server/services/ai/prompt-builder');
    
    const p1 = getEnglishPrompt("Unit 1", "eng6-t1", "6", "listening", [{ word: "school", translation: "trường học" }]);
    if (!p1 || !p1.includes("Unit 1") || !p1.includes("school")) throw new Error("getEnglishPrompt sinh prompt không chính xác");

    const p2 = getEnglishFullExamPrompt("Unit 1", "eng6-t1", "6", "unit", ["pres_simple"], "advanced");
    if (!p2 || !p2.includes("GDPT 2018") || !p2.includes("Unit 1")) throw new Error("getEnglishFullExamPrompt sinh prompt không chính xác");

    const p3 = getEnglishCustomTopicPrompt([{ word: "cat", type: "noun", translation: "con mèo" }], "Thú cưng", "speaking");
    if (!p3 || !p3.includes("Thú cưng") || !p3.includes("cat")) throw new Error("getEnglishCustomTopicPrompt sinh prompt không chính xác");

    console.log(`  ✓ Prompt Builders Tiếng Anh hoạt động chính xác 100%.`);
} catch (err) {
    failedTests++;
    errors.push({
        target: "Prompt Builders",
        message: err.message
    });
}

console.log("\n====================================================");
console.log("KẾT QUẢ KIỂM ĐỊNH DỮ LIỆU & GENERATOR TIẾNG ANH");
console.log("====================================================");
console.log(`- Tổng số mục kiểm tra: ${totalTests}`);
console.log(`- Thành công: ${totalTests - failedTests}`);
console.log(`- Thất bại: ${failedTests}`);

if (failedTests > 0) {
    console.log(`\n❌ PHÁT HIỆN ${failedTests} LỖI:`);
    errors.forEach((err, idx) => {
        console.log(`  ${idx + 1}. [${err.target}]: ${err.message}`);
    });
    process.exit(1);
} else {
    console.log("\n🎉 HOÀN TOÀN THÀNH CÔNG! Toàn bộ cấu trúc dữ liệu và bộ tạo đề Tiếng Anh đạt chuẩn 100%!");
    process.exit(0);
}
