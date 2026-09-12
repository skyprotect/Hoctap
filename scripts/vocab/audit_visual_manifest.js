const fs = require('fs');
const path = require('path');
const { ENGLISH_COURSE_DATA } = require('../../js/core/english-course-data.js');

const ROOT_DIR = path.resolve(__dirname, '../..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'images', 'english', 'visual-vocabulary-manifest.json');
const VOCAB_IMG_DIR = path.join(ROOT_DIR, 'images', 'english', 'vocab');

console.log('====================================================');
console.log('KIỂM ĐỊNH VISUAL VOCABULARY MANIFEST (v15.9 AUDIT)');
console.log('====================================================');

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error('LỖI: Không tìm thấy tệp manifest tại:', MANIFEST_PATH);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

// 1. Thu thập danh sách từ vựng kỳ vọng từ giáo trình
const expectedItems = [];
const seenInTopic = {};

['1', '4', '6'].forEach(grade => {
  const topics = (ENGLISH_COURSE_DATA[grade] && ENGLISH_COURSE_DATA[grade].topics) || [];
  topics.forEach((topic, tIdx) => {
    const unitPad = String(tIdx + 1).padStart(2, '0');
    (topic.vocab || []).forEach(v => {
      const cleanWord = String(v.word || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
      const baseKey = `VOC_L${grade}_U${unitPad}_${cleanWord.toUpperCase()}`;
      let expectedId = baseKey;
      if (seenInTopic[baseKey]) {
        const typeSuffix = (v.type || 'ALT').toUpperCase().replace(/[^A-Z]/g, '');
        expectedId = `${baseKey}_${typeSuffix}`;
      }
      seenInTopic[baseKey] = true;

      expectedItems.push({
        expectedId,
        word: v.word,
        grade,
        unitId: topic.id,
        topicTitle: topic.title,
        translation: v.translation
      });
    });
  });
});

const totalExpected = expectedItems.length;
const mappedIds = Object.keys(manifest);
const totalMapped = mappedIds.length;

// 2. Đối chiếu missing & duplicate
const missingMappings = [];
const seenIds = new Set();
let duplicateMappings = 0;

expectedItems.forEach(item => {
  if (!manifest[item.expectedId]) {
    missingMappings.push(item);
  }
  if (seenIds.has(item.expectedId)) {
    duplicateMappings++;
  } else {
    seenIds.add(item.expectedId);
  }
});

// 3. Kiểm tra tệp vật lý trên đĩa
const physicalFiles = fs.existsSync(VOCAB_IMG_DIR) ? fs.readdirSync(VOCAB_IMG_DIR) : [];
const physicalFileSet = new Set(physicalFiles.map(f => f.toLowerCase()));

let validAssets = 0;
let zeroByteFiles = 0;
let invalidAssets = 0;
let missingPhysicalAssets = [];

let pendingCount = 0;
let reviewRequiredCount = 0;
let approvedCount = 0;
let rejectedCount = 0;
let missingSourceMetadataCount = 0;
let semanticReviewRequiredCount = 0;

mappedIds.forEach(id => {
  const entry = manifest[id];
  const relativeFile = entry.imageFile;
  const fullPath = path.join(ROOT_DIR, relativeFile);

  // Metadata check
  if (!entry.source || !entry.license) {
    missingSourceMetadataCount++;
  }

  if (entry.semanticReviewRequired) {
    semanticReviewRequiredCount++;
  }

  if (entry.reviewStatus === 'APPROVED') approvedCount++;
  else if (entry.reviewStatus === 'REVIEW_REQUIRED') reviewRequiredCount++;
  else if (entry.reviewStatus === 'REJECTED') rejectedCount++;
  else pendingCount++;

  // File check
  if (!fs.existsSync(fullPath)) {
    missingPhysicalAssets.push(relativeFile);
  } else {
    const stat = fs.statSync(fullPath);
    if (stat.size === 0) {
      zeroByteFiles++;
    } else {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('<svg') && content.includes('</svg>')) {
        validAssets++;
      } else {
        invalidAssets++;
      }
    }
  }
});

// 4. Kiểm tra Orphan assets (tệp trên đĩa nhưng không có trong manifest)
const manifestFiles = new Set(mappedIds.map(id => path.basename(manifest[id].imageFile).toLowerCase()));
const orphanAssets = physicalFiles.filter(f => !manifestFiles.has(f.toLowerCase()));

// 5. Tính toán chỉ số phân loại chất lượng
const vocabCoveragePct = totalExpected > 0 ? ((totalMapped / totalExpected) * 100).toFixed(1) : 0;
const semanticReviewCoveragePct = totalMapped > 0 ? (((totalMapped - reviewRequiredCount) / totalMapped) * 100).toFixed(1) : 0;
const approvedVisualCoveragePct = totalMapped > 0 ? ((approvedCount / totalMapped) * 100).toFixed(1) : 0;

console.log('\n--- KẾT QUẢ ĐO KIỂM VISUAL VOCABULARY ---');
console.log(`EXPECTED        = ${totalExpected}`);
console.log(`MAPPED          = ${totalMapped}`);
console.log(`VALID           = ${validAssets}`);
console.log(`PENDING         = ${pendingCount}`);
console.log(`REVIEW_REQUIRED = ${reviewRequiredCount}`);
console.log(`APPROVED        = ${approvedCount}`);
console.log(`REJECTED        = ${rejectedCount}`);
console.log(`MISSING         = ${missingMappings.length + missingPhysicalAssets.length}`);
console.log(`ORPHAN          = ${orphanAssets.length}`);
console.log(`ZERO_BYTE       = ${zeroByteFiles}`);
console.log(`INVALID_SVG     = ${invalidAssets}`);
console.log(`DUPLICATE_MAP   = ${duplicateMappings}`);
console.log(`MISSING_SOURCE  = ${missingSourceMetadataCount}`);

console.log('\n--- BÁO CÁO PHÂN LOẠI CHẤT LƯỢNG VISUAL ---');
console.log(`VOCABULARY COVERAGE      : ${vocabCoveragePct}% (${totalMapped}/${totalExpected})`);
console.log(`SEMANTIC REVIEW COVERAGE : ${semanticReviewCoveragePct}% (${totalMapped - reviewRequiredCount}/${totalMapped})`);
console.log(`APPROVED VISUAL COVERAGE : ${approvedVisualCoveragePct}% (${approvedCount}/${totalMapped})`);

console.log('====================================================');
