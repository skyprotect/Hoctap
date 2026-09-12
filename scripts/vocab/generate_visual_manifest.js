const fs = require('fs');
const path = require('path');
const { ENGLISH_COURSE_DATA } = require('../../js/core/english-course-data.js');

const ROOT_DIR = path.resolve(__dirname, '../..');
const VOCAB_IMG_DIR = path.join(ROOT_DIR, 'images', 'english', 'vocab');
const MANIFEST_PATH = path.join(ROOT_DIR, 'images', 'english', 'visual-vocabulary-manifest.json');

fs.mkdirSync(VOCAB_IMG_DIR, { recursive: true });

// Danh sách từ đa nghĩa hoặc trừu tượng cần semantic review nghiêm ngặt
const AMBIGUOUS_WORDS = {
  'bat': { concept: 'flying bat animal with wings', exclude: ['baseball bat', 'cricket bat'], category: 'animals' },
  'bank': { concept: 'financial bank building or river bank', exclude: ['piggy bank'], category: 'places' },
  'spring': { concept: 'spring season with blooming flowers and leaves', exclude: ['metal coil spring', 'water spring'], category: 'nature' },
  'ruler': { concept: 'measuring ruler for drawing straight lines', exclude: ['king', 'queen', 'political ruler'], category: 'school' },
  'compass': { concept: 'drawing geometric compass with pencil point', exclude: ['navigation magnetic compass'], category: 'school' },
  'watch': { concept: 'wrist watch showing time or watching screen', exclude: ['lookout tower'], category: 'school' },
  'orange': { concept: 'sweet round orange fruit with peel', exclude: ['orange color square'], category: 'food' },
  'left': { concept: 'turn left arrow indicator road sign', exclude: ['abandoned', 'departed'], category: 'directions' },
  'right': { concept: 'turn right arrow indicator road sign', exclude: ['correct checkmark'], category: 'directions' },
  'fall': { concept: 'autumn season with falling orange leaves', exclude: ['falling down accident'], category: 'nature' },
  'can': { concept: 'metal beverage can container or ability', exclude: ['trash can'], category: 'food' },
  'light': { concept: 'electric lamp illuminating room', exclude: ['light weight feather'], category: 'home' },
  'rock': { concept: 'natural mineral stone or rock music', exclude: ['rocking cradle'], category: 'nature' },
  'present': { concept: 'gift box tied with colorful ribbon', exclude: ['timeline present day'], category: 'objects' },
  'bark': { concept: 'dog barking with sound waves', exclude: ['tree bark skin'], category: 'animals' },
  'fan': { concept: 'electric cooling fan with rotating blades', exclude: ['sports cheering fan'], category: 'home' },
  'sign': { concept: 'traffic warning road sign board', exclude: ['signature on paper'], category: 'places' },
  'train': { concept: 'railway passenger train locomotive on tracks', exclude: ['athletic training workout'], category: 'transport' },
  'park': { concept: 'green city public park with trees and bench', exclude: ['parking a car'], category: 'places' },
  'match': { concept: 'sports football match contest or fire matchstick', exclude: ['matching puzzle'], category: 'sports' },
  'star': { concept: 'shining celestial star in night sky', exclude: ['celebrity movie star'], category: 'nature' },
  'play': { concept: 'children happily playing with toys', exclude: ['theater drama stage play'], category: 'action' },
  'cross': { concept: 'pedestrian safely crossing street on zebra lines', exclude: ['christian cross symbol', 'angry emotion'], category: 'action' },
  'date': { concept: 'calendar page showing specific day and month', exclude: ['date fruit palm tree'], category: 'time' },
  'fly': { concept: 'bird soaring high in blue sky or airplane flight', exclude: ['housefly insect pest'], category: 'action' },
  'ring': { concept: 'golden finger ring jewelry or ringing telephone bell', exclude: ['boxing ring'], category: 'objects' }
};

// Từ trừu tượng / cảm xúc / hành động cần review
const ABSTRACT_KEYWORDS = [
  'wish', 'peaceful', 'educational', 'creative', 'friendly', 'clever', 'health',
  'history', 'lifestyle', 'energy', 'intelligence', 'tradition', 'respect', 'culture',
  'volunteer', 'donate', 'clean-up', 'community', 'homeless', 'disease', 'calories',
  'remember', 'favourite', 'international', 'celebrate', 'special', 'important', 'different',
  'environment', 'reduce', 'reuse', 'recycle', 'pollution', 'historic', 'modern', 'delicious'
];

function sanitizeWord(w) {
  return String(w || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_');
}

console.log('--- KHỞI TẠO BỘ TỪ ĐIỂN VISUAL VOCABULARY MANIFEST ---');

const manifest = {};
let totalItems = 0;
let reviewRequiredCount = 0;
const seenInTopic = {};

['1', '4', '6'].forEach(grade => {
  const topics = (ENGLISH_COURSE_DATA[grade] && ENGLISH_COURSE_DATA[grade].topics) || [];
  topics.forEach((topic, tIdx) => {
    const unitPad = String(tIdx + 1).padStart(2, '0');
    const vocabList = topic.vocab || [];

    vocabList.forEach((v, vIdx) => {
      totalItems++;
      const word = (v.word || '').trim();
      const cleanWord = sanitizeWord(word);
      const baseKey = `VOC_L${grade}_U${unitPad}_${cleanWord.toUpperCase()}`;

      let vocabId = baseKey;
      if (seenInTopic[baseKey]) {
        // Phân biệt từ đa nghĩa / khác loại từ trong cùng bài
        const typeSuffix = (v.type || 'ALT').toUpperCase().replace(/[^A-Z]/g, '');
        vocabId = `${baseKey}_${typeSuffix}`;
      }
      seenInTopic[baseKey] = true;

      // Xác định ngữ cảnh và độ đa nghĩa
      const lowerWord = word.toLowerCase();
      const isAmbiguous = !!AMBIGUOUS_WORDS[lowerWord];
      const isAbstract = ABSTRACT_KEYWORDS.some(k => lowerWord.includes(k)) || (v.type && (v.type.includes('adj') || v.type.includes('verb') || v.type.includes('prep')));

      const ambInfo = AMBIGUOUS_WORDS[lowerWord] || {};
      const visualConcept = ambInfo.concept || `${word} representing ${v.translation || ''} in ${topic.title}`;
      const excludeConcepts = ambInfo.exclude || [];

      const semanticReviewRequired = isAmbiguous || isAbstract;
      if (semanticReviewRequired) {
        reviewRequiredCount++;
      }

      const imageFilename = `${vocabId.toLowerCase()}.svg`;
      const relativeImagePath = `images/english/vocab/${imageFilename}`;

      manifest[vocabId] = {
        vocabularyId: vocabId,
        word: word,
        meaning: v.translation || '',
        partOfSpeech: v.type || 'noun',
        phonetics: v.phonetics || '',
        grade: grade,
        unitId: topic.id,
        unitTitle: topic.title,
        curriculumContext: v.sentence || `${word} in unit ${topic.title}`,
        sentenceTranslation: v.sentenceTranslation || '',
        visualConcept: visualConcept,
        excludeConcepts: excludeConcepts,
        imageFile: relativeImagePath,
        imageType: 'illustration',
        source: 'GENERATED_INTERNAL',
        license: 'PROJECT_GENERATED',
        confidence: isAmbiguous ? 0.92 : (isAbstract ? 0.94 : 0.98),
        reviewStatus: semanticReviewRequired ? 'REVIEW_REQUIRED' : 'PENDING',
        semanticReviewRequired: semanticReviewRequired
      };
    });
  });
});

console.log(`Đã phân tích ${totalItems} từ vựng giáo trình:`);
console.log(`- Tổng canonical entries: ${Object.keys(manifest).length}`);
console.log(`- Review Required (đa nghĩa/trừu tượng/động từ/tính từ): ${reviewRequiredCount}`);
console.log(`- Pending Review (danh từ cụ thể chuẩn): ${totalItems - reviewRequiredCount}`);

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Đã ghi manifest vào: ${MANIFEST_PATH}`);
