/**
 * audit_passive_content_diversity.js — Kịch bản kiểm tra độ đa dạng và chất lượng nội dung Passive Listening (v15.12).
 * 
 * Kiểm tra:
 * 1. Trùng lặp chính xác (Exact Duplicate) = 0
 * 2. Trùng lặp gần giống (Near Duplicate: Jaccard word similarity > 0.70)
 * 3. Phân bổ Cấp độ (Pre-A1, A1, A2)
 * 4. Phân bổ Loại hình (Dialogue, Story, Situational, Routine)
 * 5. Phân bổ Đề tài (Topic distribution)
 * 6. Tính hợp lệ của Speaker Voice đối chiếu với Kokoro voices thực tế
 * 7. Tốc độ đọc (Speech rate) phù hợp trẻ em theo từng level
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'sounds', 'english', 'passive-listening-manifest.json');

// 11 Kokoro voices có thực đã được kiểm định từ models/kokoro/voices.bin
const VALID_KOKORO_VOICES = new Set([
  'af', 'af_bella', 'af_nicole', 'af_sarah', 'af_sky',
  'am_adam', 'am_michael',
  'bf_emma', 'bf_isabella', 'bm_george', 'bm_lewis'
]);

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error(`LỖI: Không tìm thấy manifest tại ${MANIFEST_PATH}`);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
const items = Object.values(manifest);

console.log('================================================================');
console.log(`FORENSIC AUDIT — PASSIVE LISTENING CONTENT DIVERSITY v15.12`);
console.log(`Tổng số bài nghe được phân tích: ${items.length}`);
console.log('================================================================\n');

// 1. Phân bổ Cấp độ (Level Distribution)
const levelCounts = {};
items.forEach(it => {
  levelCounts[it.level] = (levelCounts[it.level] || 0) + 1;
});
console.log('1. PHÂN BỔ CẤP ĐỘ (LEVEL DISTRIBUTION):');
Object.entries(levelCounts).forEach(([lvl, count]) => {
  const pct = ((count / items.length) * 100).toFixed(1);
  console.log(`   - ${lvl.padEnd(8)}: ${String(count).padStart(3)} bài (${pct}%)`);
});

// 2. Phân bổ Loại hình bài nghe (Content Type Distribution)
const typeCounts = {};
items.forEach(it => {
  let t = it.contentType.toLowerCase();
  if (t.includes('dialogue') || t.includes('conversation')) t = 'Dialogue & Conversation';
  else if (t.includes('story') || t.includes('narrative')) t = 'Story & Narrative';
  else if (t.includes('routine')) t = 'Daily Routine';
  else if (t.includes('action') || t.includes('role')) t = 'Role Play & Actions';
  else t = 'Other';
  typeCounts[t] = (typeCounts[t] || 0) + 1;
});
console.log('\n2. PHÂN BỔ LOẠI HÌNH BÀI NGHE (CONTENT TYPES):');
Object.entries(typeCounts).forEach(([type, count]) => {
  const pct = ((count / items.length) * 100).toFixed(1);
  console.log(`   - ${type.padEnd(25)}: ${String(count).padStart(3)} bài (${pct}%)`);
});

// 3. Phân bổ Chủ đề (Topic Coverage)
const topicCounts = {};
items.forEach(it => {
  topicCounts[it.topic] = (topicCounts[it.topic] || 0) + 1;
});
console.log(`\n3. ĐỘ PHỦ CHỦ ĐỀ (TOPIC COVERAGE - ${Object.keys(topicCounts).length} chủ đề):`);
Object.entries(topicCounts).sort((a, b) => b[1] - a[1]).forEach(([topic, count]) => {
  console.log(`   - ${topic.padEnd(26)}: ${String(count).padStart(3)} bài`);
});

// 4. Kiểm định Speaker & Voices
console.log('\n4. KIỂM ĐỊNH GIỌNG ĐỌC KOKORO (VOICE VALIDATION):');
let invalidVoiceCount = 0;
const usedVoices = new Set();
const speakerProfiles = new Map();

items.forEach(it => {
  it.speakers.forEach(sp => {
    usedVoices.add(sp.voice);
    if (!VALID_KOKORO_VOICES.has(sp.voice)) {
      console.error(`   [FAIL] Voice "${sp.voice}" của speaker "${sp.name}" (${it.id}) KHÔNG TỒN TẠI trong Kokoro installation!`);
      invalidVoiceCount++;
    }
    if (speakerProfiles.has(sp.id)) {
      const prev = speakerProfiles.get(sp.id);
      if (prev.voice !== sp.voice) {
        console.error(`   [FAIL] Speaker "${sp.id}" bị đổi voice từ "${prev.voice}" sang "${sp.voice}"!`);
        invalidVoiceCount++;
      }
    } else {
      speakerProfiles.set(sp.id, { name: sp.name, voice: sp.voice });
    }
  });
});

console.log(`   - Tổng số voices hợp lệ được sử dụng: ${usedVoices.size} / 11`);
console.log(`   - Danh sách voices: ${Array.from(usedVoices).join(', ')}`);
console.log(`   - Tổng số nhân vật ổn định (Speaker Identities): ${speakerProfiles.size}`);
console.log(`   - Số lỗi giọng đọc không hợp lệ: ${invalidVoiceCount}`);

// 5. Kiểm tra Tốc độ đọc (Speech Rate Audit)
console.log('\n5. TỐC ĐỘ ĐỌC TRẺ EM (CHILD-FRIENDLY SPEECH RATE):');
const rateByLevel = { 'Pre-A1': [], 'A1': [], 'A2': [] };
items.forEach(it => {
  if (rateByLevel[it.level]) {
    const spd = it.speechProfile ? it.speechProfile.speed : 0.88;
    rateByLevel[it.level].push(spd);
  }
});
Object.entries(rateByLevel).forEach(([lvl, spds]) => {
  const avg = (spds.reduce((a, b) => a + b, 0) / (spds.length || 1)).toFixed(2);
  const min = Math.min(...spds).toFixed(2);
  const max = Math.max(...spds).toFixed(2);
  console.log(`   - ${lvl.padEnd(8)}: Min=${min}, Max=${max}, Trung bình=${avg}`);
});

// 6. Kiểm tra Trùng lặp Nội dung (Exact Duplicate & Near Duplicate)
console.log('\n6. KIỂM TRA TRÙNG LẶP NỘI DUNG (DIVERSITY CHECK):');
function tokenize(text) {
  return new Set(text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').trim().split(/\s+/).filter(w => w.length > 2));
}

function jaccardSimilarity(setA, setB) {
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

let exactDuplicates = 0;
let nearDuplicates = 0;
const checkedPairs = new Set();

for (let i = 0; i < items.length; i++) {
  const textA = items[i].transcriptText.trim().toLowerCase();
  const tokensA = tokenize(textA);

  for (let j = i + 1; j < items.length; j++) {
    const textB = items[j].transcriptText.trim().toLowerCase();
    
    // Exact duplicate check
    if (textA === textB) {
      console.error(`   [DUPLICATE] Trùng lặp 100%: ${items[i].id} và ${items[j].id}`);
      exactDuplicates++;
    } else {
      // Near duplicate check (Jaccard > 0.70)
      const tokensB = tokenize(textB);
      const sim = jaccardSimilarity(tokensA, tokensB);
      if (sim > 0.70) {
        console.warn(`   [NEAR-DUPLICATE] ${items[i].id} và ${items[j].id} có độ tương đồng từ vựng: ${(sim * 100).toFixed(1)}%`);
        nearDuplicates++;
      }
    }
  }
}

console.log(`   - Trùng lặp chính xác (Exact duplicates): ${exactDuplicates}`);
console.log(`   - Trùng lặp gần giống (Near duplicates > 70%): ${nearDuplicates}`);

console.log('\n================================================================');
const passed = invalidVoiceCount === 0 && exactDuplicates === 0 && items.length >= 185;
if (passed) {
  console.log('✓ KẾT QUẢ AUDIT DIVERSITY: ĐẠT TIÊU CHUẨN XUẤT SẮC (PASS)');
} else {
  console.error('✗ KẾT QUẢ AUDIT DIVERSITY: KHÔNG ĐẠT (FAIL)');
}
console.log('================================================================\n');

process.exit(passed ? 0 : 1);
