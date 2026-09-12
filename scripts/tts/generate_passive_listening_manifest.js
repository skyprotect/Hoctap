/**
 * generate_passive_listening_manifest.js (v15.12)
 * Tổng hợp manifest 185 bài nghe tiếng Anh thụ động chuẩn CEFR Young Learners (Pre-A1, A1, A2).
 * Phân cấp: 50 Pre-A1 + 70 A1 + 65 A2 = 185 bài nghe.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'sounds', 'english', 'passive-listening-manifest.json');
const PASSIVE_AUDIO_DIR = path.join(ROOT_DIR, 'sounds', 'english', 'passive');
const PASSIVE_IMG_DIR = path.join(ROOT_DIR, 'images', 'english', 'passive');

fs.mkdirSync(PASSIVE_AUDIO_DIR, { recursive: true });
fs.mkdirSync(PASSIVE_IMG_DIR, { recursive: true });

const { PRE_A1_LESSONS } = require('./data_pre_a1');
const { A1_LESSONS } = require('./data_a1');
const { A2_LESSONS } = require('./data_a2');

const ALL_LESSONS = [
  ...PRE_A1_LESSONS,
  ...A1_LESSONS,
  ...A2_LESSONS
];

console.log(`\n======================================================`);
console.log(`TỔNG HỢP PASSIVE LISTENING MANIFEST v15.12`);
console.log(`- Pre-A1 : ${PRE_A1_LESSONS.length} bài`);
console.log(`- A1     : ${A1_LESSONS.length} bài`);
console.log(`- A2     : ${A2_LESSONS.length} bài`);
console.log(`- Tổng số: ${ALL_LESSONS.length} bài nghe`);
console.log(`======================================================\n`);

// Đọc manifest cũ nếu có để bảo toàn durationSec / sizeBytes của những bài đã synthesize
let oldManifest = {};
if (fs.existsSync(MANIFEST_PATH)) {
  try {
    oldManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch (e) {}
}

const manifest = {};

ALL_LESSONS.forEach(l => {
  const audioFilename = `${l.id.toLowerCase()}.mp3`;
  const relativeAudioPath = `sounds/english/passive/${audioFilename}`;
  const heroImageFilename = `${l.id.toLowerCase()}_hero.svg`;
  const relativeImagePath = `images/english/passive/${heroImageFilename}`;

  // Ghép toàn bộ transcript text
  const transcriptText = l.dialogue.map(d => `${d.text}`).join(' ');

  // Tốc độ và pause scale theo cấp độ
  let targetSpeed = 0.82;
  let pauseScale = 1.25;
  if (l.level === 'Pre-A1') {
    targetSpeed = 0.82;
    pauseScale = 1.30;
  } else if (l.level === 'A1') {
    targetSpeed = 0.86;
    pauseScale = 1.20;
  } else if (l.level === 'A2') {
    targetSpeed = 0.90;
    pauseScale = 1.15;
  }

  // Bảo toàn thông tin audio cũ nếu file tồn tại
  const oldItem = oldManifest[l.id];
  const audioAbsolutePath = path.join(ROOT_DIR, relativeAudioPath);
  let durationSec = oldItem && oldItem.durationSec ? oldItem.durationSec : 0;
  let sizeBytes = oldItem && oldItem.sizeBytes ? oldItem.sizeBytes : 0;

  if (fs.existsSync(audioAbsolutePath) && (!sizeBytes || sizeBytes === 0)) {
    try {
      sizeBytes = fs.statSync(audioAbsolutePath).size;
    } catch (e) {}
  }

  if (!durationSec || durationSec === 0) {
    const wordCount = transcriptText.split(/\s+/).filter(Boolean).length;
    const wordsPerSecond = (120 * targetSpeed) / 60;
    durationSec = Math.max(10, Math.round(wordCount / wordsPerSecond) + Math.round(l.dialogue.length * 0.7));
  }

  manifest[l.id] = {
    id: l.id,
    level: l.level,
    ageBand: l.ageBand,
    topic: l.topic,
    title: l.title,
    contentType: l.contentType,
    durationSec: durationSec,
    speechRate: targetSpeed,
    dialoguePauseMs: Math.round(pauseScale * 500),
    speakers: l.speakers,
    speechProfile: {
      speed: targetSpeed,
      pauseScale: pauseScale,
      style: l.level === 'Pre-A1' ? 'slow_clear_child' : l.level === 'A1' ? 'natural_gentle' : 'expressive_conversational'
    },
    transcript: l.dialogue,
    transcriptText: transcriptText,
    languageFunctions: l.languageFunctions || [],
    learningObjectives: l.learningObjectives || [],
    vocabularyIds: l.vocabularyIds || [],
    audioFile: relativeAudioPath,
    visualAssets: {
      heroImage: relativeImagePath
    },
    repetition: l.repetition || 2,
    sizeBytes: sizeBytes,
    sampleRate: 24000
  };
});

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`✓ Đã lưu manifest thành công tại: ${MANIFEST_PATH}`);
console.log(`✓ Tổng số items trong manifest: ${Object.keys(manifest).length}`);

module.exports = { manifest, ALL_LESSONS };
