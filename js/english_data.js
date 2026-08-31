/**
 * English Pro Restructured Course Data & Dynamic Question Generator (v6.8)
 * Bao gồm 100% các bài học chính khóa cho Lớp 1, 4, 6 và các Unit nâng cao (Lớp 2, 5, 7)
 * Độc lập hoàn toàn với dữ liệu môn Toán.
 * Cập nhật phiên bản: 8.4 - Thời gian cập nhật: 11/07/2026 12:45
 */

// Bảng tra EMOJI_FALLBACK được trích xuất sang js/core/emoji-utils.js (Seam #5 EmojiHelper)
const EMOJI_FALLBACK = (typeof EmojiUtils !== 'undefined' && EmojiUtils.EMOJI_FALLBACK)
    ? EmojiUtils.EMOJI_FALLBACK
    : (typeof window !== 'undefined' && window.EMOJI_FALLBACK)
        ? window.EMOJI_FALLBACK
        : (typeof require !== 'undefined' ? require('./core/emoji-utils').EMOJI_FALLBACK : {});

var ArrayUtils = (typeof globalThis !== 'undefined' && globalThis.ArrayUtils)
    || (typeof window !== 'undefined' && window.ArrayUtils)
    || (typeof require !== 'undefined' ? require('./core/array-utils') : null);


// Dữ liệu giáo trình Tiếng Anh được trích xuất sang js/core/english-course-data.js (Course Data Boundary)
var EnglishCourseData = (typeof globalThis !== 'undefined' && globalThis.EnglishCourseData)
    || (typeof window !== 'undefined' && window.EnglishCourseData)
    || (typeof require !== 'undefined' ? require('./core/english-course-data') : null);

const ENGLISH_COURSE_DATA = (EnglishCourseData && EnglishCourseData.ENGLISH_COURSE_DATA)
    ? EnglishCourseData.ENGLISH_COURSE_DATA
    : (typeof globalThis !== 'undefined' && globalThis.ENGLISH_COURSE_DATA)
        ? globalThis.ENGLISH_COURSE_DATA
        : (typeof window !== 'undefined' && window.ENGLISH_COURSE_DATA)
            ? window.ENGLISH_COURSE_DATA
            : {};

function getWordEmoji(word) {
    if (typeof EmojiUtils !== 'undefined' && typeof EmojiUtils.getWordEmoji === 'function') {
        return EmojiUtils.getWordEmoji(word);
    }
    if (typeof window !== 'undefined' && typeof window.getWordEmoji === 'function' && window.getWordEmoji !== getWordEmoji) {
        return window.getWordEmoji(word);
    }
    const clean = (typeof word === 'string') ? word.toLowerCase().trim() : '';
    return EMOJI_FALLBACK[clean] || "⭐";
}


var EnglishGrammarData = (typeof globalThis !== 'undefined' && globalThis.EnglishGrammarData)
    || (typeof window !== 'undefined' && window.EnglishGrammarData)
    || (typeof require !== 'undefined' ? require('./core/english-grammar-data') : null);

const ENG6_T1_READING_GRAMMAR_QUESTIONS = (EnglishGrammarData && EnglishGrammarData.ENG6_T1_READING_GRAMMAR_QUESTIONS) || [];
const ENG6_T1_WRITING_GRAMMAR_QUESTIONS = (EnglishGrammarData && EnglishGrammarData.ENG6_T1_WRITING_GRAMMAR_QUESTIONS) || [];
const ENGLISH_GRAMMAR_TOPIC_QUESTIONS = (EnglishGrammarData && EnglishGrammarData.ENGLISH_GRAMMAR_TOPIC_QUESTIONS) || {};
var GrammarUtils = (typeof globalThis !== 'undefined' && globalThis.GrammarUtils)
    ? globalThis.GrammarUtils
    : (typeof window !== 'undefined' && window.GrammarUtils)
        ? window.GrammarUtils
        : (typeof require !== 'undefined' ? require('./core/grammar-utils') : null);

function getGrammarTopicByUnitId(unitId) {
    if (GrammarUtils && typeof GrammarUtils.getGrammarTopicByUnitId === 'function') {
        return GrammarUtils.getGrammarTopicByUnitId(unitId);
    }
    if (typeof window !== 'undefined' && typeof window.getGrammarTopicByUnitId === 'function' && window.getGrammarTopicByUnitId !== getGrammarTopicByUnitId) {
        return window.getGrammarTopicByUnitId(unitId);
    }
    return "present_simple_verbs";
}

/**
 * Xáo trộn các chữ cái trong một từ vựng tiếng Anh (Spelling Word Scramble).
 * Sử dụng thuật toán Fisher-Yates kết hợp hoán vị tất định (deterministic swap)
 * đảm bảo kết quả luôn khác từ gốc nếu từ có ít nhất 2 ký tự khác biệt,
 * bảo toàn tuyệt đối đa tập hợp ký tự (multiset) và triệt tiêu lỗi lộ đáp án từ đối xứng (palindrome).
 * 
 * @param {string} word - Từ vựng tiếng Anh cần xáo trộn
 * @returns {string} Chuỗi các chữ cái sau khi xáo trộn, nối nhau bằng dấu gạch ngang '-'
 */
function scrambleWord(word) {
    if (typeof word !== 'string' || word.length === 0) {
        return '';
    }
    const chars = word.split('');
    if (chars.length <= 1) {
        return chars.join('-');
    }

    // Kiểm tra xem từ có ít nhất 2 ký tự khác nhau để có thể tạo hoán vị khác hay không
    const hasDifferentChars = chars.some(c => c !== chars[0]);
    if (!hasDifferentChars) {
        return chars.join('-');
    }

    const originalJoined = chars.join('-');
    let arr = chars.slice();

    // 1. Thử Fisher-Yates shuffle ngẫu nhiên tối đa 10 lần
    for (let attempt = 0; attempt < 10; attempt++) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
        if (arr.join('-') !== originalJoined) {
            return arr.join('-');
        }
    }

    // 2. Fallback tất định (Deterministic swap): Hoán đổi 2 vị trí có ký tự khác nhau đầu tiên
    // Đảm bảo 100% không bao giờ trùng từ gốc đối với palindrome hoặc khi random lặp lại
    arr = chars.slice();
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] !== arr[j]) {
                const swapped = chars.slice();
                const temp = swapped[i];
                swapped[i] = swapped[j];
                swapped[j] = temp;
                if (swapped.join('-') !== originalJoined) {
                    return swapped.join('-');
                }
            }
        }
    }

    return arr.join('-');
}

function generateEnglishQuestions(classLevel, topicId, skill) {
    if (skill === 'full_exam') {
        return generateEnglishFullExam({ classLevel: classLevel, detail: topicId, category: "topic" });
    }
    const classData = ENGLISH_COURSE_DATA[classLevel] || ENGLISH_COURSE_DATA["6"];
    if (!classData) return [];
    
    let topic = classData ? classData.topics.find(t => t.id === topicId) : null;
    if (!topic && typeof window !== 'undefined' && window.app && window.app.customTopics && Array.isArray(window.app.customTopics)) {
        const foundCustom = window.app.customTopics.find(t => String(t.id) === String(topicId));
        if (foundCustom) {
            topic = {
                id: foundCustom.id,
                title: foundCustom.title || "Chủ đề tự chọn",
                vocab: (foundCustom.words || []).map(w => ({ word: typeof w === 'string' ? w : (w.word || w), translation: typeof w === 'object' ? (w.translation || w.word) : w })),
                sentencePatterns: [
                    { pattern: "I love learning {word}.", vietnamese: "Tôi thích học {word}." },
                    { pattern: "This is my favorite {word}.", vietnamese: "Đây là {word} yêu thích của tôi." }
                ]
            };
        }
    }
    if (!topic) {
        return generateEnglishFullExam({ classLevel: classLevel, detail: topicId, category: skill || "topic" });
    }

    const questions = [];
    const vocabList = topic.vocab; // 5 từ vựng của bài học
    const patterns = topic.sentencePatterns; // 2 mẫu câu
    
    // Thuật toán xáo trộn mảng ngẫu nhiên
    const shuffleArray = (arr) => (ArrayUtils && ArrayUtils.shuffle) ? ArrayUtils.shuffle(arr) : arr.slice().sort(() => Math.random() - 0.5);

    // Lấy danh sách từ nhiễu từ tất cả các topic khác cùng khối lớp để tránh trùng lặp
    const getDistractors = (correctWord, count = 3) => {
        const allWords = [];
        classData.topics.forEach(t => {
            t.vocab.forEach(v => {
                if (v.word.toLowerCase() !== correctWord.toLowerCase()) {
                    allWords.push(v.word);
                }
            });
        });
        const shuffed = shuffleArray([...new Set(allWords)]);
        return shuffed.slice(0, count);
    };

    if (skill === 'listening') {
        // DẠNG 1: Nghe chọn tranh (4 câu cho 4 từ vựng đầu tiên)
        for (let i = 0; i < Math.min(4, vocabList.length); i++) {
            const v = vocabList[i];
            const distractors = getDistractors(v.word, 3);
            const options = shuffleArray([v.word, ...distractors]);
            
            questions.push({
                type: "listening",
                category: "listening",
                questionText: `Listen and choose the correct picture: (Nghe và chọn hình đúng)`,
                listeningText: v.word,
                correctAnswer: v.word,
                options: options,
                solutionHtml: `Từ <b>'${v.word}'</b> nghĩa là: <b>${v.translation}</b>.`
            });
        }

        // DẠNG 2: Nghe điền từ/Chính tả (4 câu cho cả 4 từ vựng)
        for (let i = 0; i < Math.min(4, vocabList.length); i++) {
            const v = vocabList[i];
            questions.push({
                type: "listening",
                category: "listening",
                questionText: `Listen and type the word you hear: (Nghe và gõ lại từ)`,
                listeningText: v.word,
                correctAnswer: v.word,
                options: null, // Trống options để hiển thị Input gõ chữ
                solutionHtml: `Chính tả đúng của từ là: <b>${v.word}</b> (${v.translation}).`
            });
        }

        // DẠNG 3: Nghe hiểu câu đàm thoại (2 câu lấy từ 2 mẫu câu)
        patterns.forEach(p => {
            const qText = p.english.split(' - ')[0]; // Lấy phần câu hỏi
            const aText = p.english.split(' - ')[1] || p.english; // Lấy câu trả lời
            
            // Tìm các câu trả lời nhiễu từ các pattern khác của lớp học
            const otherAnswers = [];
            classData.topics.forEach(t => {
                t.sentencePatterns.forEach(sp => {
                    const ans = sp.english.split(' - ')[1] || sp.english;
                    if (ans !== aText) otherAnswers.push(ans);
                });
            });
            const distractors = shuffleArray([...new Set(otherAnswers)]).slice(0, 3);
            const options = shuffleArray([aText, ...distractors]);

            questions.push({
                type: "listening",
                category: "listening",
                questionText: `Listen to the question and choose the best response: (Nghe câu hỏi và chọn phản hồi đúng)`,
                listeningText: qText,
                correctAnswer: aText,
                options: options,
                solutionHtml: `Câu hỏi: <i>"${qText}"</i>. Phản hồi hợp lý nhất là: <b>"${aText}"</b>.`
            });
        });

        // DẠNG 4: Nghe câu giao tiếp và viết lại chính tả (2 câu) để đảm bảo tối thiểu 10 câu cho các bài 3 từ vựng
        patterns.forEach(p => {
            const text = p.english.split(' - ')[1] || p.english;
            questions.push({
                type: "listening",
                category: "listening",
                questionText: `Listen and type the sentence you hear: (Nghe và gõ lại câu)`,
                listeningText: text,
                correctAnswer: text,
                options: null,
                solutionHtml: `Câu đúng là: <b>"${text}"</b> (nghĩa là: ${p.vietnamese}).`
            });
        });

        // DẠNG 5: Nghe hiểu đoạn văn / hội thoại (Listening Comprehension)
        if (topic.questions && topic.questions.reading && topic.questions.reading.length > 0) {
            topic.questions.reading.forEach(rq => {
                questions.push({
                    type: "listening_passage",
                    category: "listening",
                    questionText: `Listen to the passage and choose the correct answer: (Nghe đoạn văn/hội thoại và chọn câu trả lời đúng)<br/><br/><b>Question: ${rq.question}</b>`,
                    listeningText: topic.readingPassage,
                    correctAnswer: rq.answer,
                    options: rq.options,
                    passageTitle: topic.readingPassageTitle,
                    solutionHtml: `<b>Đoạn văn/Cuộc hội thoại nghe được:</b><br/><i>"${topic.readingPassage}"</i><br/><br/>Đáp án đúng là: <b>${rq.answer}</b>.`
                });
            });
        }
    } 
    else if (skill === 'speaking') {
        // DẠNG 1: Phát âm từ vựng đơn lẻ (4 câu)
        const shufVocab = shuffleArray(vocabList);
        for (let i = 0; i < Math.min(4, shufVocab.length); i++) {
            const v = shufVocab[i];
            questions.push({
                type: "speaking",
                category: "speaking",
                questionText: `Read this word aloud: (Đọc to từ vựng sau)`,
                speakingText: v.word,
                correctAnswer: v.word,
                solutionHtml: `Từ <b>'${v.word}'</b> phát âm là: <b>${v.phonetics}</b>.`
            });
        }
        // DẠNG 2: Phát âm câu ví dụ chứa từ vựng (4 câu)
        for (let i = 0; i < Math.min(4, shufVocab.length); i++) {
            const v = shufVocab[i];
            questions.push({
                type: "speaking",
                category: "speaking",
                questionText: `Read this sentence aloud: (Đọc to câu ví dụ sau)`,
                speakingText: v.sentence,
                correctAnswer: v.sentence,
                solutionHtml: `Câu: <i>"${v.sentence}"</i>.<br/>Ý nghĩa: <b>${v.sentenceTranslation}</b>.`
            });
        }
        // DẠNG 3: Phát âm mẫu câu giao tiếp (2 câu)
        patterns.forEach(p => {
            const cleanText = p.english.replace(/ - /g, " ");
            questions.push({
                type: "speaking",
                category: "speaking",
                questionText: `Speak this sentence: (Đọc to câu giao tiếp sau)`,
                speakingText: cleanText,
                correctAnswer: cleanText,
                solutionHtml: `Mẫu câu: <i>"${p.english}"</i>.<br/>Ý nghĩa: <b>${p.vietnamese}</b>.`
            });
        });

        // DẠNG 4: Phát âm câu hỏi giao tiếp riêng biệt (2 câu) để đảm bảo tối thiểu 10 câu cho các bài 3 từ vựng
        patterns.forEach(p => {
            const parts = p.english.split(' - ');
            if (parts.length > 1) {
                const qPart = parts[0];
                questions.push({
                    type: "speaking",
                    category: "speaking",
                    questionText: `Read this question aloud: (Đọc to câu hỏi sau)`,
                    speakingText: qPart,
                    correctAnswer: qPart,
                    solutionHtml: `Câu hỏi: <i>"${qPart}"</i>.`
                });
            } else {
                const text = p.english;
                questions.push({
                    type: "speaking",
                    category: "speaking",
                    questionText: `Speak this sentence: (Đọc to câu giao tiếp sau)`,
                    speakingText: text,
                    correctAnswer: text,
                    solutionHtml: `Mẫu câu: <i>"${text}"</i>.`
                });
            }
        });
    } 
    else if (skill === 'reading') {
        if (topicId === 'eng6-t1') {
            questions.push(...ENG6_T1_READING_GRAMMAR_QUESTIONS.map(q => ({ ...q, category: 'grammar' })));
        } else {
            const gTopic = getGrammarTopicByUnitId(topicId);
            const gQuestions = ENGLISH_GRAMMAR_TOPIC_QUESTIONS[gTopic] || [];
            const readGQs = gQuestions.filter(q => q.type === 'choice').map(q => ({ ...q, category: 'grammar' }));
            questions.push(...readGQs);
        }

        // DẠNG 1: Trắc nghiệm nghĩa từ vựng (4 câu)
        const shufVocab = shuffleArray(vocabList);
        for (let i = 0; i < Math.min(4, shufVocab.length); i++) {
            const v = shufVocab[i];
            const otherMeanings = [];
            classData.topics.forEach(t => {
                t.vocab.forEach(vc => {
                    if (vc.translation !== v.translation) {
                        otherMeanings.push(vc.translation);
                    }
                });
            });
            const distractors = shuffleArray([...new Set(otherMeanings)]).slice(0, 3);
            const options = shuffleArray([v.translation, ...distractors]);

            questions.push({
                type: "choice",
                category: "vocabulary",
                questionText: `What does the word "${v.word}" mean? (Từ "${v.word}" nghĩa là gì?)`,
                correctAnswer: v.translation,
                options: options,
                solutionHtml: `Từ <b>'${v.word}'</b> có nghĩa tiếng Việt là: <b>${v.translation}</b>.`
            });
        }

        // DẠNG 2: Đọc điền từ vào câu khuyết của từ vựng (3 câu)
        const clVocab = shuffleArray(vocabList).slice(0, 3);
        clVocab.forEach(v => {
            const escapedWord = v.word.replace(/[.*+?^${}()|[\\\]]/g, '\\$$');
            const patternReg = new RegExp(`\\b${escapedWord}\\b`, 'gi');
            const questionStr = v.sentence.replace(patternReg, "_______");
            const distractors = getDistractors(v.word, 3);
            const options = shuffleArray([v.word, ...distractors]);

            questions.push({
                type: "choice",
                category: "vocabulary",
                questionText: `Choose the best word to complete the sentence:<br/><b>${questionStr}</b>`,
                correctAnswer: v.word,
                options: options,
                solutionHtml: `Câu hoàn chỉnh: <b>"${v.sentence}"</b>.<br/>Dịch: <i>${v.sentenceTranslation}</i>.`
            });
        });

        // DẠNG 3: Đọc hiểu đoạn văn trả lời câu hỏi (3 câu lấy từ cấu hình bài học)
        if (topic.questions && topic.questions.reading && topic.questions.reading.length > 0) {
            topic.questions.reading.forEach(rq => {
                questions.push({
                    type: "reading_passage",
                    category: "reading",
                    questionText: rq.question,
                    passageText: topic.readingPassage,
                    correctAnswer: rq.answer,
                    options: rq.options,
                    vocabList: vocabList,
                    solutionHtml: `Dựa vào đoạn văn <b>"${topic.readingPassageTitle}"</b>, đáp án đúng là: <b>${rq.answer}</b>.`
                });
            });
        } else {
            // Fallback dịch nghĩa câu mẫu nếu không có đoạn văn
            patterns.forEach(p => {
                const otherVi = classData.topics.flatMap(t => t.sentencePatterns.map(sp => sp.vietnamese)).filter(x => x !== p.vietnamese);
                const distractors = shuffleArray([...new Set(otherVi)]).slice(0, 2);
                const options = shuffleArray([p.vietnamese, ...distractors]);

                questions.push({
                    type: "choice",
                    category: "reading",
                    questionText: `What is the Vietnamese translation of: "<b>${p.english}</b>"?`,
                    correctAnswer: p.vietnamese,
                    options: options,
                    solutionHtml: `Câu <b>"${p.english}"</b> dịch nghĩa là: <b>"${p.vietnamese}"</b>.`
                });
            });
        }
    } 
    else if (skill === 'writing') {
        if (topicId === 'eng6-t1') {
            questions.push(...ENG6_T1_WRITING_GRAMMAR_QUESTIONS.map(q => ({ ...q, category: 'grammar' })));
        } else {
            const gTopic = getGrammarTopicByUnitId(topicId);
            const gQuestions = ENGLISH_GRAMMAR_TOPIC_QUESTIONS[gTopic] || [];
            const writeGQs = gQuestions.filter(q => q.type === 'writing' || q.type === 'choice').map(q => ({ ...q, category: 'grammar' }));
            questions.push(...writeGQs);
        }

        // DẠNG 1: Sắp xếp chữ cái - Spelling (4 câu cho 4 từ vựng)
        const shufVocab = shuffleArray(vocabList);
        for (let i = 0; i < Math.min(4, shufVocab.length); i++) {
            const v = shufVocab[i];
            const cleanWord = v.word.toLowerCase();
            const scrambled = scrambleWord(cleanWord);

            questions.push({
                type: "writing",
                category: "vocabulary",
                questionText: `Arrange the letters to make a correct word: (Sắp xếp chữ cái thành từ đúng)`,
                scrambledLetters: scrambled.toUpperCase(), // Dùng vẽ giao diện chữ cái 3D nổi bật
                correctAnswer: v.word,
                wordPool: scrambled.split('-'), // Dùng làm nút kéo thả bấm chọn
                solutionHtml: `Từ đúng là: <b>${v.word}</b> (nghĩa là: ${v.translation}).`
            });
        }

        // DẠNG 2: Sắp xếp từ thành câu hoàn chỉnh - Word Scramble (4 câu cho 4 câu ví dụ)
        for (let i = 0; i < Math.min(4, shufVocab.length); i++) {
            const v = shufVocab[i];
            const sentence = v.sentence;
            const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
            const wordPool = shuffleArray(words);

            questions.push({
                type: "writing",
                category: "writing",
                questionText: `Put the words in the correct order to make a sentence: (Sắp xếp các từ thành câu đúng)<br/><i>Meaning: ${v.sentenceTranslation}</i>`,
                correctAnswer: sentence,
                wordPool: wordPool,
                solutionHtml: `Câu đúng là: <b>"${sentence}"</b>.`
            });
        }

        // DẠNG 3: Hoàn thành đối thoại / Viết lại câu gợi ý (2 câu từ 2 mẫu câu)
        patterns.forEach(p => {
            const parts = p.english.split(' - ');
            const promptStr = parts[0];
            const targetAns = parts[1] || p.english;
            const words = targetAns.trim().split(/\s+/).filter(w => w.length > 0);

            questions.push({
                type: "writing",
                category: "writing",
                questionText: `Complete the dialogue: (Hoàn thành câu đối thoại)<br/>A: <b>${promptStr}</b><br/>B: [____]<br/><i>Meaning: ${p.vietnamese}</i>`,
                correctAnswer: targetAns,
                wordPool: shuffleArray(words),
                solutionHtml: `Câu trả lời đúng hoàn chỉnh là: <b>"${targetAns}"</b>.`
            });
        });
    }

    // Xáo trộn ngẫu nhiên và lấy đúng 15 câu hỏi để trẻ kiểm tra đầy đủ, đa giác quan
    return shuffleArray(questions).slice(0, 15);
}



// ==========================================================================
const IOE_STATIC_QUESTIONS = {
    "1": {
        "pronunciation": [
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. bag", "B. cat", "C. father", "D. apple"], correctAnswer: "C. father", solutionHtml: "Âm 'a' trong father là /ɑː/, còn lại là /æ/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. book", "B. foot", "C. door", "D. look"], correctAnswer: "C. door", solutionHtml: "Âm 'oo' trong door là /ɔː/, còn lại là /ʊ/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. name", "B. baby", "C. cake", "D. dad"], correctAnswer: "D. dad", solutionHtml: "Âm 'a' trong dad là /æ/, còn lại là /eɪ/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. red", "B. pen", "C. bed", "D. green"], correctAnswer: "D. green", solutionHtml: "Âm 'ee' trong green là /iː/, còn lại là /e/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. sun", "B. run", "C. blue", "D. duck"], correctAnswer: "C. blue", solutionHtml: "Âm 'u' trong blue là /uː/, còn lại là /ʌ/." }
        ],
        "grammar": [
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>What _______ your name?</b>", options: ["A. is", "B. am", "C. are", "D. be"], correctAnswer: "A. is", solutionHtml: "Cấu trúc hỏi tên: What is your name?" },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>I _______ fine, thank you.</b>", options: ["A. is", "B. am", "C. are", "D. be"], correctAnswer: "B. am", solutionHtml: "Chủ ngữ I đi với am: I am fine." },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>This is _______ apple.</b>", options: ["A. a", "B. an", "C. the", "D. two"], correctAnswer: "B. an", solutionHtml: "Apple bắt đầu bằng nguyên âm nên dùng 'an'." },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>How old _______ you?</b>", options: ["A. is", "B. am", "C. are", "D. be"], correctAnswer: "C. are", solutionHtml: "Hỏi tuổi: How old are you?" },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>I have _______ pencil.</b>", options: ["A. a", "B. an", "C. two", "D. many"], correctAnswer: "A. a", solutionHtml: "Pencil bắt đầu bằng phụ âm nên dùng 'a'." }
        ]
    },
    "4": {
        "pronunciation": [
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. time", "B. milk", "C. high", "D. fine"], correctAnswer: "B. milk", solutionHtml: "Âm 'i' trong milk là /ɪ/, các từ khác là /aɪ/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. sunny", "B. summer", "C. busy", "D. spring"], correctAnswer: "C. busy", solutionHtml: "Chữ 's' trong busy phát âm là /z/, còn lại là /s/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. head", "B. beach", "C. clean", "D. repeat"], correctAnswer: "A. head", solutionHtml: "Âm 'ea' trong head phát âm là /e/, còn lại là /iː/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. clock", "B. morning", "C. coffee", "D. doctor"], correctAnswer: "B. morning", solutionHtml: "Âm 'or' trong morning phát âm là /ɔː/, các từ khác là /ɒ/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. school", "B. chess", "C. chip", "D. chair"], correctAnswer: "A. school", solutionHtml: "Chữ 'ch' trong school phát âm là /k/, các từ khác là /tʃ/." }
        ],
        "grammar": [
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>Where _______ you from?</b>", options: ["A. is", "B. am", "C. are", "D. do"], correctAnswer: "C. are", solutionHtml: "Cấu trúc hỏi quê quán: Where are you from?" },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>What _______ she like doing? - She likes swimming.</b>", options: ["A. is", "B. do", "C. does", "D. are"], correctAnswer: "C. does", solutionHtml: "Hỏi sở thích chủ ngữ số ít: What does she like doing?" },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>He _______ to school every day.</b>", options: ["A. go", "B. goes", "C. going", "D. went"], correctAnswer: "B. goes", solutionHtml: "Hiện tại đơn chủ ngữ số ít: He goes to school." },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>_______ is your birthday? - It's in January.</b>", options: ["A. When", "B. Where", "C. What", "D. Who"], correctAnswer: "A. When", solutionHtml: "Hỏi khi nào thì dùng 'When'." },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>We _______ at home yesterday.</b>", options: ["A. is", "B. was", "C. were", "D. are"], correctAnswer: "C. were", solutionHtml: "Quá khứ đơn của be với chủ ngữ We là 'were'." }
        ]
    },
    "6": {
        "pronunciation": [
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. creative", "B. compass", "C. canteen", "D. calculator"], correctAnswer: "A. creative", solutionHtml: "Chữ 'c' trong creative phát âm là /kr/, các từ khác là /k/ kết hợp nguyên âm đơn." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. forest", "B. temple", "C. cathedral", "D. subtraction"], correctAnswer: "A. forest", solutionHtml: "Âm phát âm khác biệt." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. modern", "B. border", "C. short", "D. sport"], correctAnswer: "A. modern", solutionHtml: "Âm 'o' trong modern phát âm là /ɒ/, còn lại là /ɔː/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. clean", "B. heavy", "C. weather", "D. head"], correctAnswer: "A. clean", solutionHtml: "Âm 'ea' trong clean phát âm là /iː/, các từ khác phát âm là /e/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. recycling", "B. cycling", "C. city", "D. sky"], correctAnswer: "D. sky", solutionHtml: "Chữ 'y' trong sky phát âm là /aɪ/, còn lại là /ɪ/." }
        ],
        "grammar": [
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>There _______ a big bookshelf and two chairs in my room.</b>", options: ["A. is", "B. am", "C. are", "D. be"], correctAnswer: "A. is", solutionHtml: "Cấu trúc 'There is' đi với danh từ số ít đứng đầu tiên (a big bookshelf)." },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>Linh is very _______. She is always drawing and painting.</b>", options: ["A. friendly", "B. creative", "C. clever", "D. kind"], correctAnswer: "B. creative", solutionHtml: "Hay vẽ tranh và tô màu là sáng tạo (creative)." },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>_______ you like to go to the canteen with me? - Yes, I'd love to.</b>", options: ["A. Will", "B. Do", "C. Would", "D. Can"], correctAnswer: "C. Would", solutionHtml: "Cấu trúc mời mọc lịch sự: Would you like to...?" },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>My neighbourhood is _______ than your neighbourhood.</b>", options: ["A. noisy", "B. noisier", "C. more noisy", "D. noisyest"], correctAnswer: "B. noisier", solutionHtml: "So sánh hơn của tính từ ngắn 'noisy' là 'noisier'." },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>You _______ speak loudly in the library. It is a quiet place.</b>", options: ["A. must", "B. mustn't", "C. can", "D. shouldn't"], correctAnswer: "B. mustn't", solutionHtml: "Quy định cấm đoán trong thư viện dùng 'mustn't'." }
        ]
    }
};
// ==========================================================================

function generateEnglishFullExam(config) {
    const classLevel = (typeof config === 'object' && config.classLevel) ? config.classLevel : (typeof config === 'string' ? config : "6");
    const category = (typeof config === 'object' && config.category) ? config.category : "unit";
    const level = (typeof config === 'object' && config.level) ? config.level : "advanced";
    const detail = (typeof config === 'object' && config.detail) ? config.detail : "eng6-t1";
    let selectedGrammars = (typeof config === 'object' && config.grammars) ? config.grammars : [];
    if (typeof selectedGrammars === 'string') {
        selectedGrammars = selectedGrammars.split(',').filter(Boolean);
    }

    const classData = ENGLISH_COURSE_DATA[classLevel] || ENGLISH_COURSE_DATA["6"];
    if (!classData) return [];

    const shuffle = (arr) => (ArrayUtils && ArrayUtils.shuffle) ? ArrayUtils.shuffle(arr) : arr.slice().sort(() => Math.random() - 0.5);

    let targetTopics = classData.topics;
    if (category === "unit" && detail) {
        const found = classData.topics.find(t => t.id === detail);
        if (found) targetTopics = [found];
    }

    const allVocab = targetTopics.flatMap(t => t.vocab || []);
    const questions = [];

    // PART 1. LISTENING (2 questions)
    const sampleV1 = shuffle(allVocab)[0] || { word: "school", translation: "trường học" };
    const distractorsL = shuffle(allVocab.filter(v => v.word !== sampleV1.word).map(v => v.word)).slice(0, 3);
    while (distractorsL.length < 3) distractorsL.push("book", "pen", "ruler");
    const optionsL1 = shuffle([sampleV1.word, ...distractorsL.slice(0, 3)]);

    questions.push({
        isTemplate: true,
        questionType: "listening",
        category: "listening",
        questionText: "Listen to the audio recording and choose the correct word: (Nghe đoạn băng và chọn từ đúng)",
        listeningText: `Welcome to our school. My name is Phong and I am in class 6A. I love my ${sampleV1.word} because it is very modern.`,
        audioScript: `Welcome to our school. My name is Phong and I am in class 6A. I love my ${sampleV1.word} because it is very modern.`,
        options: optionsL1.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`),
        correctAnswer: `${String.fromCharCode(65 + optionsL1.indexOf(sampleV1.word))}. ${sampleV1.word}`,
        correctIndex: optionsL1.indexOf(sampleV1.word),
        solutionHtml: `Đoạn nghe nhắc đến từ: <b>'${sampleV1.word}'</b> (${sampleV1.translation}).`
    });

    questions.push({
        isTemplate: true,
        questionType: "listening",
        category: "listening",
        questionText: `Listen and complete the blank with ONE word: (Nghe và điền 1 từ còn thiếu vào chỗ trống)<br/><i>"Every morning, students go to the _______ to read books."</i>`,
        listeningText: "Every morning, students go to the library to read books.",
        audioScript: "Every morning, students go to the library to read books.",
        options: null,
        correctAnswer: "library",
        correctAnswers: ["library", "Library"],
        solutionHtml: "Từ còn thiếu trong đoạn nghe là: <b>library</b> (thư viện)."
    });

    // PART 2. LANGUAGE FOCUS (4 questions)
    const phoneticsBank = [
        { q: "Choose the word whose underlined part is pronounced differently from the others:", opts: ["A. c<u>a</u>t", "B. b<u>a</u>g", "C. f<u>a</u>ther", "D. m<u>a</u>p"], ans: "C. f<u>a</u>ther", sol: "'father' phát âm âm /ɑː/, các từ còn lại phát âm âm /æ/." },
        { q: "Choose the word whose underlined part is pronounced differently from the others:", opts: ["A. l<u>i</u>ve", "B. n<u>i</u>ce", "C. f<u>i</u>ne", "D. l<u>i</u>ke"], ans: "A. l<u>i</u>ve", sol: "'live' phát âm âm /ɪ/, các từ còn lại phát âm âm /aɪ/." },
        { q: "Choose the word with a different stress pattern:", opts: ["A. 'student", "B. 'teacher", "C. 'compass", "D. be'tween"], ans: "D. be'tween", sol: "'between' trọng âm 2, các từ còn lại trọng âm 1." }
    ];
    const pickedPhonetics = shuffle(phoneticsBank)[0];
    questions.push({
        isTemplate: true,
        questionType: "phonetics",
        category: "grammar",
        questionText: pickedPhonetics.q,
        options: pickedPhonetics.opts,
        correctAnswer: pickedPhonetics.ans,
        correctIndex: pickedPhonetics.opts.indexOf(pickedPhonetics.ans),
        solutionHtml: pickedPhonetics.sol
    });

    const grammarBank = [
        { key: "pres_simple", q: "Look! Nga _______ football with her classmates in the playground right now.", opts: ["A. plays", "B. is playing", "C. played", "D. play"], ans: "B. is playing", sol: "Có 'right now' dùng thì Hiện tại tiếp diễn: is + V-ing." },
        { key: "pres_simple", q: "My father _______ to work by car every morning.", opts: ["A. go", "B. goes", "C. is going", "D. went"], ans: "B. goes", sol: "Thì Hiện tại đơn với chủ ngữ số ít 'My father' -> 'goes'." },
        { key: "modals", q: "You _______ keep quiet when the teacher is explaining the lesson.", opts: ["A. must", "B. mustn't", "C. can't", "D. shouldn't"], ans: "A. must", sol: "Cần giữ trật tự trong lớp -> dùng 'must' (bắt buộc)." },
        { key: "modals", q: "Students _______ drop litter on the school yard. It is against the rule.", opts: ["A. must", "B. mustn't", "C. can", "D. should"], ans: "B. mustn't", sol: "Cấm vứt rác bẩn -> dùng 'mustn't'." },
        { key: "comparatives", q: "Ha Noi is _______ than Da Nang.", opts: ["A. big", "B. bigger", "C. more big", "D. biggest"], ans: "B. bigger", sol: "So sánh hơn của tính từ ngắn 'big' -> 'bigger'." },
        { key: "superlatives", q: "Mount Everest is the _______ mountain in the world.", opts: ["A. high", "B. higher", "C. highest", "D. most high"], ans: "C. highest", sol: "So sánh nhất 'the highest'." },
        { key: "prepositions_place", q: "There is a colorful poster _______ the wall in my bedroom.", opts: ["A. in", "B. on", "C. at", "D. under"], ans: "B. on", sol: "Giới từ chỉ vị trí trên tường là 'on the wall'." },
        { key: "quantifiers", q: "How _______ milk do you want for breakfast?", opts: ["A. many", "B. much", "C. any", "D. some"], ans: "B. much", sol: "'milk' là danh từ không đếm được -> dùng 'How much'." }
    ];

    let filteredGrammar = grammarBank;
    if (selectedGrammars && selectedGrammars.length > 0 && !selectedGrammars.includes("all")) {
        const matches = grammarBank.filter(g => selectedGrammars.includes(g.key));
        if (matches.length > 0) filteredGrammar = matches;
    }

    const pickedGrammar = shuffle(filteredGrammar).slice(0, 3);
    pickedGrammar.forEach(g => {
        questions.push({
            isTemplate: true,
            questionType: "choice",
            category: "grammar",
            questionText: g.q,
            options: g.opts,
            correctAnswer: g.ans,
            correctIndex: g.opts.indexOf(g.ans),
            solutionHtml: g.sol
        });
    });

    // PART 3. READING (2 questions)
    const readingPassages = [
        {
            passage: "My name is Mai. I live in a quiet village near Da Nang. My house has six rooms: a living room, a kitchen, two bedrooms, and two bathrooms. In front of my house, there is a small garden with many green trees and red flowers. I usually play badminton with my friends in the yard every afternoon.",
            q: "Where does Mai live?",
            opts: ["A. In a big city", "B. In a quiet village near Da Nang", "C. On a high mountain", "D. Near a noisy market"],
            ans: "B. In a quiet village near Da Nang",
            sol: "Theo đoạn văn: 'I live in a quiet village near Da Nang.'"
        },
        {
            passage: "Tokyo is the capital city of Japan. It is one of the most exciting and modern cities in the world. Visitors can enjoy delicious traditional sushi, visit peaceful ancient temples, and see high-tech robots in shopping centers.",
            q: "What is Tokyo famous for?",
            opts: ["A. Beautiful beaches only", "B. Delicious sushi and high-tech robots", "C. Quiet small villages", "D. Cold snowy weather"],
            ans: "B. Delicious sushi and high-tech robots",
            sol: "Theo đoạn văn: 'traditional sushi... high-tech robots'."
        }
    ];
    const pickedReading = shuffle(readingPassages)[0];
    questions.push({
        isTemplate: true,
        questionType: "reading_passage",
        category: "reading",
        passageText: pickedReading.passage,
        questionText: pickedReading.q,
        options: pickedReading.opts,
        correctAnswer: pickedReading.ans,
        correctIndex: pickedReading.opts.indexOf(pickedReading.ans),
        solutionHtml: pickedReading.sol
    });

    questions.push({
        isTemplate: true,
        questionType: "choice",
        category: "reading",
        passageText: "Living in a green house is very good for our health. We should (1) _______ off the lights when leaving a room and recycle plastic bottles.",
        questionText: "Choose the best option for blank (1):",
        options: ["A. turn", "B. take", "C. put", "D. get"],
        correctAnswer: "A. turn",
        correctIndex: 0,
        solutionHtml: "Cụm từ 'turn off the lights' nghĩa là tắt đèn."
    });

    // PART 4. WRITING (2 questions)
    const rewriteBank = [
        { q: "Rewrite the following sentence with the same meaning:<br/><b>There are five rooms in my house.</b>", ans: "My house has five rooms.", sol: "Cấu trúc 'There are + N(số nhiều)' tương đương 'S + has/have + N'." },
        { q: "Rewrite the following sentence with the same meaning:<br/><b>My school has 800 students.</b>", ans: "There are 800 students in my school.", sol: "Cấu trúc 'S + has + N' tương đương 'There are + N'." },
        { q: "Rewrite the following sentence with the same meaning:<br/><b>No one in my class is taller than Nam.</b>", ans: "Nam is the tallest student in my class.", sol: "So sánh không ai bằng tương đương so sánh nhất 'the tallest'." }
    ];
    const pickedRewrite = shuffle(rewriteBank)[0];
    questions.push({
        isTemplate: true,
        questionType: "writing_rewrite",
        category: "writing",
        questionText: pickedRewrite.q,
        correctAnswer: pickedRewrite.ans,
        correctAnswers: [pickedRewrite.ans, pickedRewrite.ans.toLowerCase(), pickedRewrite.ans.replace(/\.$/, "")],
        solutionHtml: pickedRewrite.sol
    });

    const unscrambleBank = [
        { pool: ["Phong", "usually", "plays", "football", "after", "school."], ans: "Phong usually plays football after school.", sol: "Trật tự câu: Chủ ngữ + trạng từ tần suất + động từ + tân ngữ + trạng ngữ." },
        { pool: ["We", "must", "keep", "our", "classroom", "clean."], ans: "We must keep our classroom clean.", sol: "Trật tự câu với Modal verb: S + must + V-bare + O + Adj." },
        { pool: ["Is", "there", "a", "garden", "in", "front", "of", "your", "house?"], ans: "Is there a garden in front of your house?", sol: "Câu hỏi nghi vấn với Is there: Is there + a/an + N + prep?" }
    ];
    const pickedUnscramble = shuffle(unscrambleBank)[0];
    questions.push({
        isTemplate: true,
        questionType: "writing",
        category: "writing",
        questionText: "Rearrange the words to make a complete and correct sentence: (Sắp xếp từ thành câu hoàn chỉnh)",
        wordPool: shuffle(pickedUnscramble.pool),
        correctAnswer: pickedUnscramble.ans,
        correctAnswers: [pickedUnscramble.ans, pickedUnscramble.ans.toLowerCase()],
        solutionHtml: pickedUnscramble.sol
    });

    return questions;
}

function generateIoeQuestions(classLevel, topicId) {
    const classData = ENGLISH_COURSE_DATA[classLevel] || ENGLISH_COURSE_DATA["6"];
    if (!classData) return [];

    const allTopics = classData.topics;
    const topicIndex = allTopics.findIndex(t => t.id === topicId);
    if (topicIndex === -1) {
        return generateEnglishFullExam({ classLevel: classLevel, detail: topicId, category: "topic" });
    }

    // Gom từ vựng và mẫu câu tích lũy đến bài hiện tại
    const cumulativeVocab = [];
    const cumulativePatterns = [];
    for (let i = 0; i <= topicIndex; i++) {
        cumulativeVocab.push(...allTopics[i].vocab);
        cumulativePatterns.push(...allTopics[i].sentencePatterns);
    }

    const shuffleArray = (arr) => (ArrayUtils && ArrayUtils.shuffle) ? ArrayUtils.shuffle(arr) : arr.slice().sort(() => Math.random() - 0.5);

    const questions = [];

    // 1. DẠNG 1: Leave Me Alone (Loại bỏ ký tự thừa) - 4 câu
    const shufVocab1 = shuffleArray(cumulativeVocab);
    const selectedVocab1 = shufVocab1.slice(0, Math.min(4, shufVocab1.length));
    selectedVocab1.forEach(v => {
        const word = v.word.toLowerCase();
        const chars = "abcdefghijklmnopqrstuvwxyz";
        let extraChar = "x";
        for (let i = 0; i < 20; i++) {
            const temp = chars[Math.floor(Math.random() * chars.length)];
            if (!word.includes(temp)) {
                extraChar = temp;
                break;
            }
        }
        const insertIndex = Math.floor(Math.random() * (word.length - 1)) + 1;
        const scrambled = word.slice(0, insertIndex) + extraChar + word.slice(insertIndex);

        questions.push({
            type: "ioe_leave_alone",
            word: v.word,
            scrambled: scrambled,
            extraChar: extraChar,
            extraIndex: insertIndex,
            questionText: "Leave me alone! Click on the extra letter to remove it: (Bấm vào chữ cái thừa để loại bỏ)",
            solutionHtml: `Từ đúng là: <b>${v.word}</b> (${v.translation}). Chữ cái thừa là <b>${extraChar.toUpperCase()}</b>.`
        });
    });

    // 2. DẠNG 2: Fill in the Blank (Điền chữ cái khuyết) - 4 câu
    const shufVocab2 = shuffleArray(cumulativeVocab);
    const selectedVocab2 = shufVocab2.slice(0, Math.min(4, shufVocab2.length));
    selectedVocab2.forEach(v => {
        const word = v.word.toLowerCase();
        const hideIndex = Math.floor(Math.random() * (word.length - 1)) + 1;
        const missingChar = word[hideIndex];
        const template = word.slice(0, hideIndex) + "_" + word.slice(hideIndex + 1);

        questions.push({
            type: "ioe_fill_blank",
            word: v.word,
            template: template,
            missingChar: missingChar,
            questionText: `Fill in the missing letter to complete the word: (Điền chữ cái còn thiếu vào từ)<br/><b style="font-size:1.6rem; color:#2563eb; letter-spacing: 2px;">${template.toUpperCase()}</b> &nbsp;(${v.translation})`,
            solutionHtml: `Từ đúng hoàn chỉnh là: <b>${v.word}</b> (${v.translation}). Chữ cái còn thiếu là <b>${missingChar.toUpperCase()}</b>.`
        });
    });

    // 3. DẠNG 3: Cool Pair Matching (Cặp đôi hoàn hảo) - 4 câu
    for (let m = 0; m < 4; m++) {
        const shufVocab3 = shuffleArray(cumulativeVocab);
        const selectedVocab3 = shufVocab3.slice(0, Math.min(5, shufVocab3.length));
        
        let pairs = selectedVocab3.map(v => ({ eng: v.word, vi: v.translation }));
        if (pairs.length < 5) {
            const backupWords = classData.topics.flatMap(t => t.vocab).map(v => ({ eng: v.word, vi: v.translation }));
            const filteredBackup = backupWords.filter(bw => !pairs.some(p => p.eng === bw.eng));
            pairs.push(...shuffleArray(filteredBackup).slice(0, 5 - pairs.length));
        }

        questions.push({
            type: "ioe_pair_matching",
            pairs: pairs,
            questionText: "Cool Pair Matching! Match the English words with their correct Vietnamese meanings: (Ghép cặp từ tiếng Anh với nghĩa tiếng Việt tương ứng)",
            solutionHtml: "Hoàn thành ghép cặp chính xác tất cả các từ vựng."
        });
    }

    const staticClassKey = classLevel === "1" || classLevel === "2" ? "1" :
                           classLevel === "4" || classLevel === "5" ? "4" : "6";
    const staticData = IOE_STATIC_QUESTIONS[staticClassKey] || IOE_STATIC_QUESTIONS["6"];

    // 4. DẠNG 4: Smart Monkey (Phát âm) - 4 câu
    const shufPron = shuffleArray(staticData.pronunciation);
    const selectedPron = shufPron.slice(0, 4);
    selectedPron.forEach(q => {
        questions.push({
            type: "ioe_choice",
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            solutionHtml: q.solutionHtml
        });
    });

    // 5. DẠNG 5: Defeat the Dragon (Ngữ pháp trắc nghiệm) - 4 câu
    const shufGram = shuffleArray(staticData.grammar);
    const selectedGram = shufGram.slice(0, 4);
    selectedGram.forEach(q => {
        questions.push({
            type: "ioe_dragon",
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            solutionHtml: q.solutionHtml
        });
    });

    return shuffleArray(questions).slice(0, 20);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EMOJI_FALLBACK,
        ENGLISH_COURSE_DATA,
        getWordEmoji,
        generateEnglishQuestions,
        generateIoeQuestions,
        generateEnglishFullExam,
        scrambleWord
    };
} else {
    window.ENGLISH_COURSE_DATA = ENGLISH_COURSE_DATA;
    window.getWordEmoji = getWordEmoji;
    window.generateEnglishQuestions = generateEnglishQuestions;
    window.generateIoeQuestions = generateIoeQuestions;
    window.generateEnglishFullExam = generateEnglishFullExam;
    window.scrambleWord = scrambleWord;
}
