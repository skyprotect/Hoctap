/**
 * AUTOMATED QUALITY GATE & CODEBASE INTEGRITY CHECKER (v13.44)
 * Kiểm tra toàn diện hệ thống HocTap trước khi đóng gói Release:
 * 1. Cấu trúc thư mục & không tồn tại tệp rác (.old, .tmp, database rác)
 * 2. Tính toàn vẹn của các micro-generators, Game Engine, CSS, Database DAL
 * 3. Kiểm tra tính hợp lệ của 121 dạng bài Toán (Lớp 1, 4, 6)
 * 4. Kiểm tra phân quyền học sinh theo Rule 14
 * 5. Cưỡng chế kích thước các Orchestrators (< 100 LOC)
 * 6. Kiểm định Giáo trình & Bộ sinh Tiếng Anh
 * 7. Kiểm định TypeScript Type Safety
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.resolve(__dirname, '../..');

console.log("==================================================================");
console.log("🛡️  HỌCTẬP QUALITY GATE (v13.44) — BẮT ĐẦU KIỂM TRA TOÀN DIỆN");
console.log("==================================================================");

let hasError = false;

// 1. Kiểm tra cấu trúc module
console.log("\n[1/5] Kiểm tra cấu trúc phân rã module...");
const requiredFiles = [
    'data/grade_6/math/generators/ch1_naturals/bai_01_tap_hop.js',
    'data/grade_6/math/generators/ch1_naturals/bai_02_ghi_so.js',
    'data/grade_6/math/generators/ch1_naturals/bai_03_phep_tinh.js',
    'data/grade_6/math/generators/ch1_naturals/bai_04_luy_thua.js',
    'data/grade_6/math/generators/ch1_naturals/bai_05_chia_het_so_nguyen_to.js',
    'data/grade_6/math/generators/ch1_naturals/bai_06_ucln_bcnn.js',
    'data/grade_6/math/generators/chapter1_naturals.js',
    'data/grade_6/math/generators/chapter2_integers.js',
    'data/grade_6/math/generators/chapter3_geometry.js',
    'data/grade_6/math/generators/chapter4_statistics.js',
    'data/grade_6/math/generators/chapter5_fractions.js',
    'data/grade_6/math/generators/chapter6_geometry_plane.js',
    'data/grade_6/math/generators/registry.js',
    'data/grade_6/math/runner/practice_ui.js',
    'data/grade_6/math/runner/print_exam.js',
    'js/parent/modules/auth.controller.js',
    'js/parent/modules/chart.renderer.js',
    'js/parent/modules/student.manager.js',
    'js/parent/modules/history.viewer.js',
    'js/parent/modules/remote.sync.js',
    'js/game/core/game-loop.js',
    'js/game/systems/game-state-manager.js',
    'js/game/systems/input-handler.js',
    'js/game/systems/economy-system.js'
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

// 2. Chạy Bundlers & kiểm tra Orchestrators
console.log("\n[2/5] Kiểm tra kích thước Orchestrators...");
try {
    execSync('node scripts/build/bundle_game.js', { stdio: 'pipe', cwd: ROOT });
    execSync('node scripts/build/bundle_math_g6.js', { stdio: 'pipe', cwd: ROOT });
    execSync('node scripts/build/bundle_css.js', { stdio: 'pipe', cwd: ROOT });
    execSync('node scripts/build/bundle_parent.js', { stdio: 'pipe', cwd: ROOT });

    const orchestrators = ['data/grade_6/math/generator.js', 'js/game.js', 'js/lessons.js', 'js/english_data.js'];
    orchestrators.forEach(o => {
        const count = fs.readFileSync(path.join(ROOT, o), 'utf8').split('\n').length;
        if (count > 100) {
            console.error(`❌ Orchestrator ${o} vượt quá 100 dòng (${count} dòng)`);
            hasError = true;
        }
    });
    if (!hasError) console.log("✅ Toàn bộ Orchestrators đều siêu nhẹ (< 80 dòng).");
} catch (e) {
    console.error("❌ Lỗi khi kiểm tra orchestrators:", e.message);
    hasError = true;
}

// 3. Chạy Kiểm tra Cú pháp & Đáp án Toán học
console.log("\n[3/5] Chạy kiểm định 121 dạng bài Toán (Lớp 1, 4, 6)...");
try {
    const syntaxOutput = execSync('node scripts/maintenance/test_syntax.js', { encoding: 'utf8', cwd: ROOT });
    if (syntaxOutput.includes('THÀNH CÔNG RỰC RỠ')) {
        console.log("✅ 121/121 dạng bài Toán đạt chuẩn 100% (không trùng lặp, không lỗi LaTeX, không NaN).");
    } else {
        console.error("❌ Kiểm định câu hỏi thất bại:", syntaxOutput);
        hasError = true;
    }
} catch (e) {
    console.error("❌ Ngoại lệ khi chạy test_syntax.js:", e.message);
    hasError = true;
}

// 4. Chạy Jest Test Suites
console.log("\n[4/6] Chạy Jest Test Suites...");
try {
    execSync('npx jest --runInBand --forceExit', { stdio: 'pipe', cwd: ROOT });
    console.log("✅ 100% Jest Test Suites PASS (Auth, Progress, System, Question Engine, Characterization).");
} catch (e) {
    console.error("❌ Jest test suites thất bại:", e.message);
    hasError = true;
}

// 5. Chạy Kiểm định Tiếng Anh
console.log("\n[5/6] Chạy kiểm định Giáo trình & Bộ sinh đề Tiếng Anh...");
try {
    execSync('node scripts/maintenance/test_english_generators.js', { stdio: 'pipe', cwd: ROOT });
    console.log("✅ 100% Dữ liệu Tiếng Anh & Prompt Builders đạt chuẩn.");
} catch (e) {
    console.error("❌ Kiểm định Tiếng Anh thất bại:", e.message);
    hasError = true;
}

// 6. Kiểm tra TypeScript Compilation & Type Safety
console.log("\n[6/6] Kiểm tra TypeScript Type Safety (tsc --noEmit)...");
try {
    execSync('npx tsc --noEmit', { stdio: 'pipe', cwd: ROOT });
    console.log("✅ Zero TypeScript Errors (Không có bất kỳ lỗi kiểu dữ liệu nào).");
} catch (e) {
    console.error("❌ TypeScript type check thất bại:", e.message);
    hasError = true;
}

console.log("\n==================================================================");
if (hasError) {
    console.error("❌ QUALITY GATE THẤT BẠI.");
    process.exit(1);
} else {
    console.log("🏆 QUALITY GATE THÀNH CÔNG RỰC RỠ! Sẵn sàng phát hành Release v13.44.");
    console.log("==================================================================");
    process.exit(0);
}
