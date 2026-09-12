const fs = require('fs');
const path = require('path');
const { ENGLISH_COURSE_DATA } = require('../../js/core/english-course-data');

function sanitizeAudioKey(text) {
    if (!text || typeof text !== 'string') return '';
    return text.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

const ROOT_DIR = path.resolve(__dirname, '../..');
const inventory = [];
const seenCanonical = new Set();
const seenTexts = new Map(); // text -> canonicalId

function addCurriculumItem(canonicalId, text, category, feature, grade, unit, meta = {}) {
    if (!text || typeof text !== 'string') return null;
    const cleanText = text.trim();
    if (!cleanText) return null;

    if (seenCanonical.has(canonicalId)) {
        throw new Error(`Duplicate canonical ID: ${canonicalId}`);
    }
    seenCanonical.add(canonicalId);

    // Xác định file name chuẩn:
    // Nếu text ngắn (từ vựng hoặc câu ngắn <= 60 ký tự), dùng sanitized text để tái sử dụng 521 files đã sinh
    // Nếu text dài (đoạn văn > 60 ký tự), dùng canonical ID lowercase làm filename để tránh đường dẫn file quá dài trên Windows
    const sanitizedTextKey = sanitizeAudioKey(cleanText);
    let filename;
    if (category === 'passage' || sanitizedTextKey.length > 50) {
        filename = `${canonicalId.toLowerCase()}.mp3`;
    } else {
        filename = `${sanitizedTextKey}.mp3`;
    }

    const item = {
        id: canonicalId,
        text: cleanText,
        category: category,       // 'vocabulary', 'sentence', 'pattern_q', 'pattern_a', 'pattern_full', 'passage', 'exam'
        feature: feature,         // 'VOCABULARY', 'SPEAKING', 'LISTENING', 'READING', 'EXAM'
        grade: String(grade),
        unit: Number(unit),
        filename: filename,
        voice: 'af_bella',
        speed: 0.95,
        aliases: new Set([sanitizedTextKey]),
        ...meta
    };

    if (meta.extraAliases && Array.isArray(meta.extraAliases)) {
        meta.extraAliases.forEach(al => {
            const sal = sanitizeAudioKey(al);
            if (sal) item.aliases.add(sal);
        });
    }

    // Chuyển aliases Set thành Array
    item.aliases = Array.from(item.aliases);
    inventory.push(item);
    return item;
}

// 1. Trích xuất Lớp 6
const g6 = ENGLISH_COURSE_DATA['6'];
if (g6 && g6.topics) {
    g6.topics.forEach((t, tIdx) => {
        const u = tIdx + 1;
        const uPad = String(u).padStart(2, '0');

        // Vocab & Sentences
        if (t.vocab) {
            t.vocab.forEach((v, vIdx) => {
                const vPad = String(vIdx + 1).padStart(2, '0');
                if (v.word) {
                    addCurriculumItem(
                        `L6_U${uPad}_VOCAB_${vPad}`,
                        v.word,
                        'vocabulary',
                        'VOCABULARY',
                        6,
                        u,
                        { translation: v.translation, phonetics: v.phonetics }
                    );
                }
                if (v.sentence) {
                    addCurriculumItem(
                        `L6_U${uPad}_SENT_${vPad}`,
                        v.sentence,
                        'sentence',
                        'SPEAKING',
                        6,
                        u,
                        { sentenceTranslation: v.sentenceTranslation }
                    );
                }
            });
        }

        // Sentence Patterns (Hội thoại)
        if (t.sentencePatterns) {
            t.sentencePatterns.forEach((p, pIdx) => {
                const pPad = String(pIdx + 1).padStart(2, '0');
                const parts = p.english.split(' - ');
                const qText = parts[0].trim();
                const aText = (parts[1] || '').trim();

                addCurriculumItem(
                    `L6_U${uPad}_PAT_Q_${pPad}`,
                    qText,
                    'pattern_q',
                    'LISTENING',
                    6,
                    u,
                    { vietnamese: p.vietnamese }
                );

                if (aText) {
                    addCurriculumItem(
                        `L6_U${uPad}_PAT_A_${pPad}`,
                        aText,
                        'pattern_a',
                        'LISTENING',
                        6,
                        u,
                        { vietnamese: p.vietnamese }
                    );
                }

                addCurriculumItem(
                    `L6_U${uPad}_PAT_FULL_${pPad}`,
                    p.english,
                    'pattern_full',
                    'SPEAKING',
                    6,
                    u,
                    { vietnamese: p.vietnamese }
                );
            });
        }

        // Reading / Listening Passage
        if (t.readingPassage) {
            const extraAliases = [];
            if (t.readingPassageTitle) extraAliases.push(t.readingPassageTitle);
            if (t.id) {
                extraAliases.push(t.id + '_passage');
                extraAliases.push(t.id);
            }
            addCurriculumItem(
                `L6_U${uPad}_PASSAGE_01`,
                t.readingPassage,
                'passage',
                'READING_AND_LISTENING',
                6,
                u,
                {
                    title: t.readingPassageTitle || t.title,
                    topicId: t.id,
                    extraAliases: extraAliases
                }
            );
        }
    });
}

// 2. Trích xuất Exam Questions trong english_data.js và parent.js
const examQuestions = [
    {
        id: 'L6_EXAM_LISTENING_01',
        text: 'Welcome to our school. My name is Phong and I am in class 6A. I love my school because it is very modern.',
        category: 'exam',
        feature: 'EXAM',
        grade: 6,
        unit: 1
    },
    {
        id: 'L6_EXAM_LISTENING_02',
        text: 'Every morning, students go to the library to read books.',
        category: 'exam',
        feature: 'EXAM',
        grade: 6,
        unit: 1
    }
];
examQuestions.forEach(eq => {
    addCurriculumItem(eq.id, eq.text, eq.category, eq.feature, eq.grade, eq.unit);
});

// 3. Trích xuất Lớp 1 và Lớp 4 (để đảm bảo không thiếu sót Curriculum)
['1', '4'].forEach(grade => {
    const gd = ENGLISH_COURSE_DATA[grade];
    if (gd && gd.topics) {
        gd.topics.forEach((t, tIdx) => {
            const u = tIdx + 1;
            const uPad = String(u).padStart(2, '0');
            if (t.vocab) {
                t.vocab.forEach((v, vIdx) => {
                    const vPad = String(vIdx + 1).padStart(2, '0');
                    if (v.word) {
                        addCurriculumItem(
                            `L${grade}_U${uPad}_VOCAB_${vPad}`,
                            v.word,
                            'vocabulary',
                            'VOCABULARY',
                            grade,
                            u,
                            { translation: v.translation }
                        );
                    }
                    if (v.sentence) {
                        addCurriculumItem(
                            `L${grade}_U${uPad}_SENT_${vPad}`,
                            v.sentence,
                            'sentence',
                            'SPEAKING',
                            grade,
                            u,
                            { sentenceTranslation: v.sentenceTranslation }
                        );
                    }
                });
            }
            if (t.sentencePatterns) {
                t.sentencePatterns.forEach((p, pIdx) => {
                    const pPad = String(pIdx + 1).padStart(2, '0');
                    const parts = (p.english || '').split(' - ');
                    const qText = parts[0] ? parts[0].trim() : '';
                    const aText = (parts[1] || '').trim();
                    if (qText) {
                        addCurriculumItem(
                            `L${grade}_U${uPad}_PAT_Q_${pPad}`,
                            qText,
                            'pattern_q',
                            'LISTENING',
                            grade,
                            u
                        );
                    }
                    if (aText) {
                        addCurriculumItem(
                            `L${grade}_U${uPad}_PAT_A_${pPad}`,
                            aText,
                            'pattern_a',
                            'LISTENING',
                            grade,
                            u
                        );
                    }
                });
            }
            if (t.readingPassage) {
                const extraAliases = [];
                if (t.readingPassageTitle) extraAliases.push(t.readingPassageTitle);
                if (t.id) extraAliases.push(t.id + '_passage');
                addCurriculumItem(
                    `L${grade}_U${uPad}_PASSAGE_01`,
                    t.readingPassage,
                    'passage',
                    'READING_AND_LISTENING',
                    grade,
                    u,
                    { title: t.readingPassageTitle || t.title, extraAliases }
                );
            }
        });
    }
});

console.log('======================================================');
console.log('CURRICULUM AUDIO INVENTORY EXTRACTION COMPLETE');
console.log('======================================================');
console.log('Tổng số Curriculum Items:', inventory.length);

const statsByGrade = {};
const statsByCategory = {};
inventory.forEach(it => {
    statsByGrade[it.grade] = (statsByGrade[it.grade] || 0) + 1;
    statsByCategory[it.category] = (statsByCategory[it.category] || 0) + 1;
});
console.log('Phân bố theo khối lớp (Grades):', statsByGrade);
console.log('Phân bố theo thể loại (Categories):', statsByCategory);

const outPath = path.join(ROOT_DIR, 'scripts/tts/curriculum_inventory.json');
fs.writeFileSync(outPath, JSON.stringify(inventory, null, 2), 'utf8');
console.log('Đã lưu inventory vào:', outPath);
