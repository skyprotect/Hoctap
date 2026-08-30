/**
 * SYNC CLEAN BUNDLE SCRIPT (Rule 9)
 * Tự động đồng bộ mã nguồn sạch từ HocTap sang HocTap_Clean và làm sạch dữ liệu cá nhân/CSDL
 */
const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname);
const destDir = path.resolve(__dirname, '../HocTap_Clean');

console.log(`🔄 Bắt đầu đồng bộ bản sạch từ [${srcDir}] sang [${destDir}]...`);

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

const EXCLUDE_NAMES = [
    'node_modules',
    '.git',
    '.gemini',
    'database.db',
    'database.db-journal',
    '.port.tmp',
    'logs',
    'scratch_app_methods.json'
];

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    const baseName = path.basename(src);
    if (EXCLUDE_NAMES.includes(baseName) || baseName.endsWith('.old') || baseName.endsWith('.tmp')) {
        return;
    }

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach((childItemName) => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

// 1. Đồng bộ tệp
copyRecursiveSync(srcDir, destDir);

// 2. Làm sạch các tệp dữ liệu cá nhân còn sót lại trong destDir
const cleanArtifacts = ['database.db', 'database.db-journal', '.port.tmp'];
cleanArtifacts.forEach(file => {
    const target = path.join(destDir, file);
    if (fs.existsSync(target)) {
        try {
            fs.unlinkSync(target);
            console.log(`  - Đã xóa tệp dữ liệu cá nhân: ${file}`);
        } catch(e) {}
    }
});

console.log("✅ Hoàn tất đồng bộ bản sạch sang HocTap_Clean 100%!");
