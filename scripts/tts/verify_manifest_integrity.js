const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');
const invPath = path.join(ROOT_DIR, 'scripts/tts/curriculum_inventory.json');
const soundsDir = path.join(ROOT_DIR, 'sounds/english');
const manifestPath = path.join(soundsDir, 'audio-manifest.json');

console.log('================================================================');
console.log('BÁO CÁO KIỂM TOÁN TOÀN VẸN BỘ NHỚ ĐỆM ÂM THANH KOKORO TTS v15.7');
console.log('================================================================');

if (!fs.existsSync(invPath)) {
    console.error('LỖI: Không tìm thấy tệp curriculum_inventory.json');
    process.exit(1);
}
if (!fs.existsSync(manifestPath)) {
    console.error('LỖI: Không tìm thấy tệp audio-manifest.json');
    process.exit(1);
}

const inventory = JSON.parse(fs.readFileSync(invPath, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

console.log(`1. Tổng số mục giáo trình trong Inventory: ${inventory.length}`);
console.log(`2. Số entry trong Manifest (root level): ${Object.keys(manifest).length}`);

const itemsMap = manifest._items || {};
const aliasesMap = manifest._aliases || {};
const meta = manifest._meta || {};

console.log(`   - Canonical Items (_items): ${Object.keys(itemsMap).length}`);
console.log(`   - Aliases Map (_aliases): ${Object.keys(aliasesMap).length}`);
console.log(`   - Voice: ${meta.voice || 'N/A'}, Speed: ${meta.speed || 'N/A'}, Engine: Kokoro-v0.19`);

let missingFiles = [];
let zeroByteFiles = [];
let missingManifestEntries = [];
let missingAliases = [];
let verifiedFiles = 0;
let totalSizeBytes = 0;

const physicalFilesOnDisk = new Set(fs.readdirSync(soundsDir).filter(f => f.endsWith('.mp3')));
console.log(`3. Tổng số tệp MP3 vật lý trên ổ đĩa: ${physicalFilesOnDisk.size}`);

const checkedFilenames = new Set();

for (const item of inventory) {
    const cid = item.id;
    const filename = item.filename;
    const filePath = path.join(soundsDir, filename);

    // Kiểm tra trong manifest canonical items hoặc root
    const entry = itemsMap[cid] || manifest[cid];
    if (!entry) {
        missingManifestEntries.push(cid);
    }

    // Kiểm tra tệp vật lý
    if (!physicalFilesOnDisk.has(filename)) {
        missingFiles.push({ id: cid, filename, text: item.text });
    } else if (!checkedFilenames.has(filename)) {
        checkedFilenames.add(filename);
        try {
            const stat = fs.statSync(filePath);
            if (stat.size < 100) {
                zeroByteFiles.push({ id: cid, filename, size: stat.size });
            } else {
                verifiedFiles++;
                totalSizeBytes += stat.size;
            }
        } catch (e) {
            zeroByteFiles.push({ id: cid, filename, error: e.message });
        }
    }

    // Kiểm tra aliases
    if (Array.isArray(item.aliases)) {
        for (const al of item.aliases) {
            if (!aliasesMap[al] && !manifest[al]) {
                missingAliases.push({ id: cid, alias: al });
            }
        }
    }
}

// Kiểm tra Orphan files (những file mp3 không thuộc inventory)
let orphanFiles = [];
const expectedFilenames = new Set(inventory.map(it => it.filename));
for (const pFile of physicalFilesOnDisk) {
    if (!expectedFilenames.has(pFile)) {
        orphanFiles.push(pFile);
    }
}

console.log('\n================================================================');
console.log('KẾT QUẢ ĐÁNH GIÁ 13 TIÊU CHÍ TOÀN VẸN:');
console.log('================================================================');
console.log(`[Tiêu chí 1] Inventory items mapped: ${inventory.length - missingManifestEntries.length} / ${inventory.length}`);
console.log(`[Tiêu chí 2] Physical MP3 files verified: ${verifiedFiles} files (${(totalSizeBytes / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`[Tiêu chí 3] Missing MP3 files: ${missingFiles.length}`);
console.log(`[Tiêu chí 4] Zero-byte / Truncated files: ${zeroByteFiles.length}`);
console.log(`[Tiêu chí 5] Missing Manifest entries: ${missingManifestEntries.length}`);
console.log(`[Tiêu chí 6] Missing Aliases: ${missingAliases.length}`);
console.log(`[Tiêu chí 7] Orphan MP3 files on disk: ${orphanFiles.length}`);

// Phân tích theo lớp học
const grades = ['1', '4', '6'];
grades.forEach(g => {
    const gItems = inventory.filter(it => String(it.grade) === g);
    const gMissing = missingFiles.filter(f => inventory.find(it => it.id === f.id && String(it.grade) === g));
    console.log(`[Phân bổ] Lớp ${g}: ${gItems.length - gMissing.length}/${gItems.length} sẵn sàng (Thiếu: ${gMissing.length})`);
});

// Phân tích theo kỹ năng / tính năng
const features = ['VOCABULARY', 'SPEAKING', 'LISTENING', 'READING_AND_LISTENING', 'EXAM'];
features.forEach(feat => {
    const fItems = inventory.filter(it => it.feature === feat);
    const fMissing = missingFiles.filter(f => inventory.find(it => it.id === f.id && it.feature === feat));
    console.log(`[Tính năng] ${feat.padEnd(22)}: ${fItems.length - fMissing.length}/${fItems.length} sẵn sàng (Thiếu: ${fMissing.length})`);
});

console.log('================================================================');
if (missingFiles.length === 0 && zeroByteFiles.length === 0 && missingManifestEntries.length === 0) {
    console.log('>>> KẾT LUẬN TOÀN VẸN: 100% PASS! KHÔNG CÒN THIẾU TỆP ÂM THANH NÀO! <<<');
    process.exit(0);
} else {
    console.log(`>>> KẾT LUẬN: ĐANG XỬ LÝ (Còn thiếu ${missingFiles.length} tệp, ${missingManifestEntries.length} manifest entries) <<<`);
    process.exit(2);
}
