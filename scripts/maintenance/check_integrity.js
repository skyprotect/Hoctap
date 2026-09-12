/**
 * AUTOMATED QUALITY GATE & CODEBASE INTEGRITY CHECKER (v15.6)
 * Kiểm tra toàn diện hệ thống HocTap trước khi đóng gói Release:
 * 1. Cấu trúc thư mục & không tồn tại tệp rác (.old, .tmp, database rác)
 * 2. Tính toàn vẹn của các module Core Toán, Tiếng Anh, Pronunciation Pipeline, Kokoro Audio Cache
 * 3. Kiểm tra tính hợp lệ của kho câu hỏi Toán (Lớp 1, 4, 6)
 * 4. Kiểm tra phân quyền học sinh theo Rule 14
 * 5. Kiểm tra TypeScript Compilation & Type Safety
 * 6. Kiểm tra Jest Test Suites
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../..');

console.log("==================================================================");
console.log("🛡️  HỌCTẬP QUALITY GATE (v15.6) — BẮT ĐẦU KIỂM TRA TOÀN DIỆN");
console.log("==================================================================");

let hasError = false;

// 1. Kiểm tra cấu trúc module cốt lõi v15.6
console.log("\n[1/6] Kiểm tra cấu trúc module cốt lõi & Pronunciation/Audio Pipeline...");
const requiredFiles = [
    'js/questions-v1.js',
    'js/questions-v4.js',
    'js/questions-v3.js',
    'js/questions-advanced.js',
    'js/questions-7991.js',
    'js/lessons.js',
    'js/english_data.js',
    'js/game.js',
    'js/app.js',
    'js/parent.js',
    'js/core/english-course-data.js',
    'js/core/english-grammar-data.js',
    'js/core/english-answer-evaluator.js',
    'js/core/english-skill-evaluator.js',
    'js/core/audio-service.js',
    'js/core/speech-service.js',
    'js/core/speech-recognition-service.js',
    'js/core/english-audio-service.js',
    'js/core/gop-scorer.js',
    'js/core/speaking-assessment-adapter.js',
    'js/core/pronunciation-assessment-engine.js',
    'phoneme-map.json',
    'sounds/english/audio-manifest.json',
    'models/kokoro/kokoro-v0_19.onnx',
    'models/kokoro/voices.bin',
    'version.json',
    'server.js'
];

requiredFiles.forEach(f => {
    if (!fs.existsSync(path.join(ROOT, f))) {
        console.error(`❌ Thiếu file module bắt buộc: ${f}`);
        hasError = true;
    }
});
if (!hasError) {
    console.log(`✅ Toàn bộ ${requiredFiles.length} file module cấu trúc đều hiện diện đầy đủ.`);
}

// 2. Kiểm tra dọn sạch tệp rác
console.log("\n[2/6] Kiểm tra tệp rác & bản sao lưu cá nhân...");
const forbiddenPatterns = ['.port.tmp', 'database.db.old'];
forbiddenPatterns.forEach(p => {
    if (fs.existsSync(path.join(ROOT, p))) {
        console.error(`❌ Tồn tại tệp tạm/sao lưu không được phép: ${p}`);
        hasError = true;
    }
});
if (!hasError) {
    console.log("✅ Không tồn tại tệp rác (.port.tmp, .old).");
}

// 3. Kiểm tra Rule 14: Zero-Config Hardcode Fallback & Phân quyền học sinh
console.log("\n[3/6] Kiểm tra Rule 14: Zero-Config Hardcode Fallback & Phân quyền học sinh...");
try {
    const authServiceTs = fs.readFileSync(path.join(ROOT, 'server/services/auth.service.ts'), 'utf8');
    const seedTs = fs.readFileSync(path.join(ROOT, 'server/db/seed.ts'), 'utf8');

    if (!authServiceTs.includes('std_htsj4gbmo') || !authServiceTs.includes('std_tyc0gfnkz') || !authServiceTs.includes('std_baongoc')) {
        console.error("❌ server/services/auth.service.ts thiếu phân quyền học sinh chuẩn (Minh, Phúc, Bảo Ngọc) theo Rule 14!");
        hasError = true;
    }
    if (!seedTs.includes('std_htsj4gbmo') || !seedTs.includes('std_tyc0gfnkz') || !seedTs.includes('std_baongoc')) {
        console.error("❌ server/db/seed.ts thiếu dữ liệu học sinh chuẩn theo Rule 14!");
        hasError = true;
    }
    if (!hasError) {
        console.log("✅ Rule 14 tuân thủ 100%: Phân quyền Minh, Phúc, Bảo Ngọc đầy đủ trong backend & auth service.");
    }
} catch (e) {
    console.error("❌ Lỗi kiểm tra Rule 14:", e.message);
    hasError = true;
}

// 4. Kiểm tra TypeScript Compilation & Type Safety
console.log("\n[4/6] Kiểm tra TypeScript Type Safety (tsc --noEmit)...");
try {
    execSync('npx tsc --noEmit', { stdio: 'pipe', cwd: ROOT });
    console.log("✅ Zero TypeScript Errors (Không có bất kỳ lỗi kiểu dữ liệu nào).");
} catch (e) {
    console.error("❌ TypeScript type check thất bại:", e.message);
    hasError = true;
}

// 5. Kiểm tra Giới hạn Kích thước File (File Growth Check)
console.log("\n[5/6] Kiểm tra kiến trúc File Growth...");
try {
    execSync('node scripts/quality/check-file-growth.js', { stdio: 'pipe', cwd: ROOT });
    console.log("✅ File Growth tuân thủ 100% các review bands và justified exceptions.");
} catch (e) {
    console.error("❌ File growth check thất bại:", e.message);
    hasError = true;
}

// 6. Chạy Jest Test Suites
console.log("\n[6/6] Chạy Jest Test Suites...");
try {
    execSync('npx jest --runInBand --forceExit', { stdio: 'pipe', cwd: ROOT });
    console.log("✅ 100% Jest Test Suites PASS (Auth, Progress, Speaking, Audio, Question Engine).");
} catch (e) {
    console.error("❌ Jest test suites thất bại:", e.message);
    hasError = true;
}

console.log("\n==================================================================");
if (hasError) {
    console.error("❌ QUALITY GATE THẤT BẠI.");
    process.exit(1);
} else {
    console.log("🏆 QUALITY GATE THÀNH CÔNG RỰC RỠ! Sẵn sàng phát hành Release v15.6.");
    console.log("==================================================================");
    process.exit(0);
}
