const fs = require('fs');
const path = require('path');

function sanitizeAudioKey(text) {
    if (!text || typeof text !== 'string') return '';
    return text.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

const ROOT_DIR = path.resolve(__dirname, '../..');
const manifestPath = path.join(ROOT_DIR, 'sounds/english/audio-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

console.log('====================================================');
console.log('AUDIT BỘ NHỚ ĐỆM ÂM THANH (AUDIO MANIFEST AUDIT)');
console.log('====================================================');
console.log('Tổng số entry trong manifest:', Object.keys(manifest).length);

// 1. Phân tích ENGLISH_COURSE_DATA
const { ENGLISH_COURSE_DATA } = require('../../js/core/english-course-data');
const g6Topics = (ENGLISH_COURSE_DATA && ENGLISH_COURSE_DATA['6'] && ENGLISH_COURSE_DATA['6'].topics) || [];

console.log('\n[1] GIÁO TRÌNH LỚP 6 (english-course-data.js):', g6Topics.length, 'Units');

let courseVocab = [];
let courseSentences = [];
let courseReadings = [];

g6Topics.forEach((t, tIdx) => {
    if (t.vocab) {
        t.vocab.forEach(v => {
            if (v.word) courseVocab.push({ word: v.word, topic: t.title, unit: tIdx + 1 });
            if (v.sentence) courseSentences.push({ sentence: v.sentence, topic: t.title, unit: tIdx + 1 });
        });
    }
    if (t.readingPassage) {
        courseReadings.push({ title: t.title, passage: t.readingPassage, unit: tIdx + 1 });
    }
});

console.log('- Từ vựng (Vocabulary):', courseVocab.length);
console.log('- Câu mẫu (Example Sentences):', courseSentences.length);
console.log('- Bài đọc hiểu (Reading Passages):', courseReadings.length);

// 2. Phân tích english_data.js
console.log('\n[2] DỮ LIỆU BÀI TẬP VÀ ĐỀ THI (js/english_data.js)');
const engDataRaw = fs.readFileSync(path.join(ROOT_DIR, 'js/english_data.js'), 'utf8');

let listeningItems = [];
const ltRegex = /listeningText:\s*(?:`([\s\S]*?)`|"([^"]*)"|'([^']*)')/g;
let m;
while ((m = ltRegex.exec(engDataRaw)) !== null) {
    const text = (m[1] || m[2] || m[3] || '').trim();
    if (text && !text.includes('${')) {
        listeningItems.push(text);
    }
}
console.log('- Số đoạn/câu listeningText tìm thấy trong english_data.js:', listeningItems.length);

// 3. Phân tích js/lessons.js
console.log('\n[3] BÀI HỌC VÀ ĐỀ THI TRONG js/lessons.js');
const lessonsRaw = fs.readFileSync(path.join(ROOT_DIR, 'js/lessons.js'), 'utf8');
let lessonListeningItems = [];
while ((m = ltRegex.exec(lessonsRaw)) !== null) {
    const text = (m[1] || m[2] || m[3] || '').trim();
    if (text && !text.includes('${')) {
        lessonListeningItems.push(text);
    }
}
console.log('- Số đoạn/câu listeningText trong lessons.js:', lessonListeningItems.length);

// 4. Đối chiếu CACHE HIT vs CACHE MISS
console.log('\n====================================================');
console.log('KẾT QUẢ ĐỐI CHIẾU VỚI AUDIO MANIFEST');
console.log('====================================================');

function auditList(name, items, keyFn) {
    let hits = 0;
    let misses = [];
    items.forEach(it => {
        const text = keyFn(it);
        const k = sanitizeAudioKey(text);
        if (manifest[k]) {
            hits++;
        } else {
            misses.push(text);
        }
    });
    console.log(name + ':');
    console.log('  Hit :', hits, '/', items.length, '(' + (items.length ? ((hits / items.length) * 100).toFixed(1) : 0) + '%)');
    console.log('  Miss:', misses.length);
    if (misses.length > 0) {
        console.log('  Mẫu Miss đầu tiên (tối đa 3):');
        misses.slice(0, 3).forEach((m, idx) => console.log('    ' + (idx + 1) + '. "' + m.substring(0, 80) + (m.length > 80 ? '...' : '') + '"'));
    }
    return { hits, misses };
}

const vAudit = auditList('Từ vựng Lớp 6 (courseVocab)', courseVocab, it => it.word);
const sAudit = auditList('Câu mẫu Lớp 6 (courseSentences)', courseSentences, it => it.sentence);
const rAudit = auditList('Bài đọc hiểu Lớp 6 (courseReadings)', courseReadings, it => it.passage);
const lAudit = auditList('Listening Items trong english_data.js', listeningItems, it => it);
const llAudit = auditList('Listening Items trong lessons.js', lessonListeningItems, it => it);

// 5. Kiểm tra tính toàn vẹn của các file thực tế trong sounds/english/
console.log('\n====================================================');
console.log('KIỂM TRA TỆP TIN VẬT LÝ TRÊN ĐĨA (PHYSICAL MP3 INTEGRITY)');
console.log('====================================================');
const manifestKeys = Object.keys(manifest);
let missingFiles = [];
let zeroByteFiles = [];
let totalBytes = 0;

manifestKeys.forEach(k => {
    const entry = manifest[k];
    const relFile = entry.file || (k + '.mp3');
    const fullPath = path.join(ROOT_DIR, 'sounds/english', relFile);
    if (!fs.existsSync(fullPath)) {
        missingFiles.push(relFile);
    } else {
        const sz = fs.statSync(fullPath).size;
        totalBytes += sz;
        if (sz === 0) zeroByteFiles.push(relFile);
    }
});

const diskMp3s = fs.readdirSync(path.join(ROOT_DIR, 'sounds/english')).filter(f => f.endsWith('.mp3'));
const orphanMp3s = diskMp3s.filter(f => {
    const key = f.replace(/\.mp3$/, '');
    return !manifest[key];
});

console.log('Tổng số tệp MP3 trên đĩa:', diskMp3s.length);
console.log('Tổng dung lượng bộ nhớ đệm:', (totalBytes / 1024 / 1024).toFixed(2), 'MB');
console.log('Tệp thiếu so với manifest:', missingFiles.length);
console.log('Tệp dung lượng rỗng (Zero-byte files):', zeroByteFiles.length);
console.log('Tệp mồ côi (Orphan MP3):', orphanMp3s.length);

// 6. Xuất danh sách missing
const allMissing = new Map();
function addMissing(text, category) {
    if (!text || typeof text !== 'string') return;
    const clean = text.trim();
    const k = sanitizeAudioKey(clean);
    if (k && !manifest[k] && !allMissing.has(k)) {
        allMissing.set(k, { key: k, text: clean, category });
    }
}

rAudit.misses.forEach(p => addMissing(p, 'reading_passage'));
lAudit.misses.forEach(l => addMissing(l, 'listening'));
llAudit.misses.forEach(l => addMissing(l, 'listening'));

console.log('\n===> TỔNG SỐ CURRICULUM ITEMS BỊ THIẾU CACHE: ' + allMissing.size + ' items');
const missingListPath = path.join(ROOT_DIR, 'scripts/tts/missing_curriculum_audio.json');
fs.writeFileSync(missingListPath, JSON.stringify(Array.from(allMissing.values()), null, 2), 'utf8');
console.log('Đã ghi danh sách missing audio vào:', missingListPath);
