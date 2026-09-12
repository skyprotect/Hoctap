const fs = require('fs');
const path = require('path');
const { ENGLISH_COURSE_DATA } = require('../../js/core/english-course-data');

function sanitizeAudioKey(text) {
    if (!text) return '';
    return text.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

const g6 = ENGLISH_COURSE_DATA['6'];
const phraseMap = new Map();

if (g6 && g6.topics) {
    g6.topics.forEach(t => {
        if (t.vocab) {
            t.vocab.forEach(v => {
                if (v.word) {
                    const key = sanitizeAudioKey(v.word);
                    if (key && !phraseMap.has(key)) {
                        phraseMap.set(key, { key: key, text: v.word, type: 'word' });
                    }
                }
                if (v.sentence) {
                    const key = sanitizeAudioKey(v.sentence);
                    if (key && !phraseMap.has(key)) {
                        phraseMap.set(key, { key: key, text: v.sentence, type: 'sentence' });
                    }
                }
            });
        }
    });
}

// Bổ sung các câu hội thoại Speaking mẫu phổ biến
const commonSpeaking = [
    "Hello! Welcome to English class.",
    "Good morning teacher.",
    "Good afternoon.",
    "Nice to meet you.",
    "How are you today?",
    "I am doing well, thank you.",
    "My name is Nam.",
    "I live in Hanoi.",
    "I like playing football.",
    "English is my favorite subject."
];
commonSpeaking.forEach(s => {
    const key = sanitizeAudioKey(s);
    if (key && !phraseMap.has(key)) {
        phraseMap.set(key, { key: key, text: s, type: 'speaking' });
    }
});

const list = Array.from(phraseMap.values());
const outPath = path.join(__dirname, 'phrases_to_synthesize.json');
fs.writeFileSync(outPath, JSON.stringify(list, null, 2), 'utf-8');
console.log(`Extracted ${list.length} unique phrases into ${outPath}`);
