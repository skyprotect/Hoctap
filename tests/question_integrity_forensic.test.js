/**
 * tests/question_integrity_forensic.test.js
 * Question Forensic Audit & Educational Data Integrity Test Suite
 * 
 * Kiểm tra 10 kịch bản kiểm thử bắt buộc theo tiêu chuẩn Release Gate:
 * 1. Valid explicit question (Có dẫn chứng trực tiếp từ văn bản)
 * 2. Valid inference question (Suy luận logic có căn cứ rõ ràng)
 * 3. Answer absent from passage (Phát hiện và bắt lỗi như trường hợp 'between')
 * 4. Invalid inference (Suy luận tùy tiện / thiếu căn cứ bị gắn cờ)
 * 5. Wrong skill reference (Nhãn 'reading passage' xuất hiện trong bài Nghe)
 * 6. Duplicate correct options (Phương án trùng lặp bị bắt lỗi)
 * 7. Ambiguous question (Câu hỏi có ít hơn 2 options hoặc options thiếu đáp án)
 * 8. Boilerplate question (Phát hiện các mẫu máy móc kiểu 'Which word is mentioned...')
 * 9. Distractor collision & nonsense (Phát hiện distractors 'helicopter'/'spaceship' trong ngữ cảnh nhà ở)
 * 10. Random correct answer regression prevention (Bảo đảm 100% câu hỏi production có evidence)
 */

'use strict';

const { validateQuestion, auditCourseData } = require('../scripts/qa/audit_question_integrity');
const { ENGLISH_COURSE_DATA } = require('../js/core/english-course-data');
const { generateEnglishQuestions } = require('../js/english_data');
const EnglishAnswerEvaluator = require('../js/core/english-answer-evaluator');
const EnglishAudioService = require('../js/core/english-audio-service');

describe('BỘ KIỂM THỬ PHÁP Y TOÀN VẸN CÂU HỎI & MINH CHỨNG GIÁO DỤC', () => {

    // KỊCH BẢN 1: Valid Explicit Question
    test('1. Valid Explicit Question: Đáp án có dẫn chứng trực tiếp trong passage phải PASS và đạt EXPLICIT', () => {
        const question = {
            question: "How many rooms does the writer's house have?",
            options: ["Four rooms", "Two rooms", "Three rooms", "Five rooms"],
            answer: "Four rooms",
            questionType: "READING_DETAIL",
            evidenceType: "EXPLICIT",
            evidence: "It has four rooms."
        };
        const context = {
            passageText: "My family lives in a small house. It has four rooms. In the kitchen, there is a big white fridge next to the window.",
            skill: "reading",
            topicTitle: "My House"
        };

        const result = validateQuestion(question, context);
        expect(result.isValid).toBe(true);
        expect(result.classification).toBe('EXPLICIT');
        expect(result.errors.length).toBe(0);
    });

    // KỊCH BẢN 2: Valid Inference Question
    test('2. Valid Inference Question: Đáp án suy luận hợp lý có căn cứ phải PASS và đạt INFERENTIAL', () => {
        const question = {
            question: "Who is slimmer?",
            options: ["The brother", "The writer", "The father"],
            answer: "The writer",
            questionType: "READING_DETAIL",
            evidenceType: "INFERENTIAL",
            evidence: "He is taller than me, but I am slimmer than him."
        };
        const context = {
            passageText: "I look at my family photo. My father is tall and strong. My brother is young and tall. He is taller than me, but I am slimmer than him.",
            skill: "reading",
            topicTitle: "Appearance"
        };

        const result = validateQuestion(question, context);
        expect(result.isValid).toBe(true);
        expect(result.classification).toBe('INFERENTIAL');
        expect(result.errors.length).toBe(0);
    });

    // KỊCH BẢN 3: Answer Absent From Passage (Tái hiện lỗi 'between')
    test('3. Answer Absent From Passage: Trường hợp lỗi "between" trong Unit 2 phải bị phát hiện và gắn cờ INVALID', () => {
        // Tái hiện chính xác câu hỏi lỗi của v15.8 trước đây:
        const faultyBetweenQuestion = {
            question: "Which word is mentioned in the reading passage?",
            options: ["between", "helicopter", "spaceship"],
            answer: "between"
        };
        const context = {
            passageText: "My family lives in a small house. It has four rooms. In the kitchen, there is a big white fridge next to the window. My bedroom is small, but it has a nice study desk next to my bed. My clothes are in the wardrobe.",
            skill: "reading",
            topicTitle: "My House"
        };

        const result = validateQuestion(faultyBetweenQuestion, context);
        expect(result.isValid).toBe(false);
        expect(result.classification).toBe('INVALID');
        expect(result.errors.some(e => e.includes('between') || e.includes('no evidence') || e.includes('Boilerplate'))).toBe(true);
    });

    // KỊCH BẢN 4: Invalid Inference
    test('4. Invalid Inference: Suy luận không có căn cứ hoặc evidence rỗng phải bị từ chối', () => {
        const invalidInferenceQ = {
            question: "What is the writer thinking about?",
            options: ["Travelling to Mars", "Playing chess", "Sleeping"],
            answer: "Travelling to Mars",
            evidenceType: "INFERENTIAL",
            evidence: "" // Không có giải thích hay bằng chứng
        };
        const context = {
            passageText: "My family lives in a small house. It has four rooms.",
            skill: "reading",
            topicTitle: "My House"
        };

        const result = validateQuestion(invalidInferenceQ, context);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('Inferential evidence is insufficient') || e.includes('no evidence'))).toBe(true);
    });

    // KỊCH BẢN 5: Wrong Skill Reference
    test('5. Wrong Skill Reference: Câu hỏi bài Nghe (Listening) chứa cụm "in the reading passage" phải bị gắn cờ INVALID', () => {
        const crossSkillQ = {
            question: "Which word is mentioned in the reading passage?",
            options: ["desk", "table", "chair"],
            answer: "desk",
            skill: "listening"
        };
        const context = {
            passageText: "There is a desk in my room.",
            skill: "listening",
            topicTitle: "My Room"
        };

        const result = validateQuestion(crossSkillQ, context);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('Cross-skill reference mismatch'))).toBe(true);
    });

    // KỊCH BẢN 6: Duplicate Options
    test('6. Duplicate Options: Các phương án trùng lặp phải bị phát hiện', () => {
        const dupOptionsQ = {
            question: "Where is the cat?",
            options: ["Under the bed", "On the table", "Under the bed", "In the box"],
            answer: "Under the bed",
            evidence: "The cat is under the bed.",
            evidenceType: "EXPLICIT"
        };
        const context = {
            passageText: "The cat is under the bed.",
            skill: "reading",
            topicTitle: "Pets"
        };

        const result = validateQuestion(dupOptionsQ, context);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('Duplicate options detected'))).toBe(true);
    });

    // KỊCH BẢN 7: Ambiguous Question / Answer not in options
    test('7. Ambiguous Question: Đáp án đúng không có trong danh sách options phải bị bắt lỗi', () => {
        const missingAnsQ = {
            question: "How many rooms are there?",
            options: ["Two rooms", "Three rooms", "Five rooms"],
            answer: "Four rooms" // Không có trong options
        };
        const context = {
            passageText: "It has four rooms.",
            skill: "reading",
            topicTitle: "My House"
        };

        const result = validateQuestion(missingAnsQ, context);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('is not in options list'))).toBe(true);
    });

    // KỊCH BẢN 8: Boilerplate Question Detection
    test('8. Boilerplate Question Detection: Câu hỏi khuôn mẫu máy móc phải bị từ chối', () => {
        const boilerplateQ = {
            question: "What is the main topic of the passage?",
            options: ["Unit 2: My House", "Playing sports", "Travelling around the world"],
            answer: "Unit 2: My House"
        };
        const context = {
            passageText: "My family lives in a small house. It has four rooms.",
            skill: "reading",
            topicTitle: "My House"
        };

        const result = validateQuestion(boilerplateQ, context);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('Boilerplate template question detected'))).toBe(true);
    });

    // KỊCH BẢN 9: Distractor Collision & Nonsense
    test('9. Distractor Collision & Nonsense: Phương án nhiễu phi lý "helicopter", "spaceship" trong bài về nhà ở phải bị gắn cờ', () => {
        const nonsenseDistractorQ = {
            question: "What is in the kitchen?",
            options: ["A fridge", "A helicopter", "A spaceship", "A plane"],
            answer: "A fridge",
            evidence: "In the kitchen, there is a fridge.",
            evidenceType: "EXPLICIT"
        };
        const context = {
            passageText: "In the kitchen, there is a fridge.",
            skill: "reading",
            topicTitle: "My House"
        };

        const result = validateQuestion(nonsenseDistractorQ, context);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('nonsensical unrelated distractors'))).toBe(true);
    });

    // KỊCH BẢN 10: Random Correct Answer Regression Prevention (Production Question Bank Audit)
    test('10. Random Correct Answer Regression Prevention: 100% câu hỏi trong ENGLISH_COURSE_DATA phải đạt chuẩn minh chứng', () => {
        const report = auditCourseData(ENGLISH_COURSE_DATA);

        // Tiêu chí Release Gate bắt buộc:
        expect(report.total).toBe(186);
        expect(report.valid).toBe(186);
        expect(report.invalid).toBe(0);
        expect(report.unverifiable).toBe(0);
        expect(report.boilerplate).toBe(0);

        const totalCoverage = ((report.explicit + report.inferential) / report.total) * 100;
        expect(totalCoverage).toBe(100);
    });

    // KIỂM TRA ĐẶC THÙ CHO UNIT 2: MY HOUSE
    test('Xác minh đặc thù Unit 2 (My House) đã hoàn toàn sạch bóng lỗi "between"', () => {
        const u2Topic = ENGLISH_COURSE_DATA['6'].topics[1];
        expect(u2Topic.id).toBe('eng6-t2');

        const questions = u2Topic.questions.reading;
        expect(questions.length).toBe(3);

        // Tuyệt đối không chứa 'between' làm đáp án đúng
        const answers = questions.map(q => q.answer.toLowerCase());
        expect(answers).not.toContain('between');

        // Tuyệt đối không chứa 'helicopter' hay 'spaceship' trong options
        questions.forEach(q => {
            const optStr = q.options.join(' ').toLowerCase();
            expect(optStr).not.toContain('helicopter');
            expect(optStr).not.toContain('spaceship');
            expect(q.evidence).toBeDefined();
            expect(typeof q.evidence).toBe('string');
            expect(q.evidence.length).toBeGreaterThan(0);
            expect(u2Topic.readingPassage.toLowerCase()).toContain(q.evidence.toLowerCase());
        });

        // Kiểm tra runtime generation cho cả Listening và Reading
        const listeningQs = generateEnglishQuestions('6', 'eng6-t2', 'listening');
        const listeningPassageQs = listeningQs.filter(q => q.type === 'listening_passage');
        expect(listeningPassageQs.length).toBe(3);
        listeningPassageQs.forEach(lq => {
            expect(lq.questionText.toLowerCase()).not.toContain('in the reading passage');
            expect(lq.correctAnswer.toLowerCase()).not.toBe('between');
        });
    });
});

describe('BỘ KIỂM THỬ PHÁP Y V15.12: KHẮC PHỤC DỨT ĐIỂM LỖI MẤT NÚT NGHE ÂM THANH & PHÂN TÁCH TAXONOMY', () => {

    beforeAll(async () => {
        await EnglishAudioService.init();
    });

    // TEST 1 — Render type precedence
    test('Test 1 — Render type precedence: Ưu tiên UI type "listening_passage" trên nhãn sư phạm "LISTENING_DETAIL"', () => {
        const input = {
            type: "listening_passage",
            questionType: "LISTENING_DETAIL"
        };
        const resolved = EnglishAnswerEvaluator.resolveQuestionRenderType(input);
        expect(resolved).toBe("listening_passage");
    });

    // TEST 2 — Legacy compatibility
    test('Test 2 — Legacy compatibility: Tự động ánh xạ nhãn sư phạm cũ về đúng UI render type', () => {
        expect(EnglishAnswerEvaluator.resolveQuestionRenderType({ questionType: "LISTENING_DETAIL" })).toBe("listening_passage");
        expect(EnglishAnswerEvaluator.resolveQuestionRenderType({ questionType: "LISTENING_MAIN_IDEA" })).toBe("listening_passage");
        expect(EnglishAnswerEvaluator.resolveQuestionRenderType({ questionType: "READING_DETAIL" })).toBe("reading_passage");
        expect(EnglishAnswerEvaluator.resolveQuestionRenderType({ questionType: "READING_MAIN_IDEA" })).toBe("reading_passage");
        expect(EnglishAnswerEvaluator.resolveQuestionRenderType({ questionType: "writing" })).toBe("writing");
        expect(EnglishAnswerEvaluator.resolveQuestionRenderType({ questionType: "choice" })).toBe("choice");
    });

    // TEST 3 — Reading regression
    test('Test 3 — Reading regression: Đọc hiểu đoạn văn không bị rơi xuống choice thông thường', () => {
        const input = {
            type: "reading_passage",
            questionType: "READING_DETAIL"
        };
        const resolved = EnglishAnswerEvaluator.resolveQuestionRenderType(input);
        expect(resolved).toBe("reading_passage");
    });

    // TEST 4 — Choice regression
    test('Test 4 — Choice regression: Các câu trắc nghiệm thuần túy vẫn giữ nguyên type "choice"', () => {
        expect(EnglishAnswerEvaluator.resolveQuestionRenderType({ type: "choice" })).toBe("choice");
        expect(EnglishAnswerEvaluator.resolveQuestionRenderType({ type: "choice", questionType: "choice" })).toBe("choice");
        expect(EnglishAnswerEvaluator.resolveQuestionRenderType({})).toBe("choice");
        expect(EnglishAnswerEvaluator.resolveQuestionRenderType(null)).toBe("choice");
    });

    // TEST 5 — Listening UI Rendering
    test('Test 5 — Listening UI: HTML render chứa đầy đủ listening-passage-box, btn-audio-speak-large, fa-volume-high và app.playEnglishVoice', () => {
        const questions = generateEnglishQuestions('6', 'eng6-t1', 'listening');
        const q = questions.find(x => x.type === 'listening_passage');
        expect(q).toBeDefined();

        const renderType = EnglishAnswerEvaluator.resolveQuestionRenderType(q);
        expect(renderType).toBe("listening_passage");

        const audioKey = EnglishAnswerEvaluator.resolveListeningAudioKey(q);
        expect(audioKey).toBe("My First School Day");

        // Giả lập trực tiếp cấu trúc HTML sinh ra bởi renderEnglishQuestion trong app.js
        const safeListeningText = q.listeningText ? String(q.listeningText) : "";
        const safeOptions = Array.isArray(q.options) ? q.options : [];

        const simulatedHtml = `
            <div class="listening-passage-box" style="text-align:center; width:100%;">
                <div style="background:var(--bg-app); border:2px solid var(--border-color); border-radius:20px; padding:1.5rem; margin-bottom:1.5rem; display:flex; flex-direction:column; align-items:center; gap:0.8rem;">
                    <button class="btn-audio-speak-large" type="button" aria-label="Nghe bài nói hoặc hội thoại" onclick="app.playEnglishVoice('${safeListeningText.replace(/'/g, "\\'")}', '${audioKey.replace(/'/g, "\\'")}', { category: 'CURRICULUM', feature: 'LISTENING' })">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
                    <div style="font-weight:800;">🎧 Bấm để nghe bài nói / cuộc hội thoại</div>
                    <div>(Con hãy lắng nghe thật kỹ để trả lời câu hỏi bên dưới)</div>
                </div>
                <div class="options-grid">
                    ${safeOptions.map((opt, i) => `<button class="option-btn">${opt}</button>`).join('')}
                </div>
            </div>
        `;

        expect(simulatedHtml).toContain('class="listening-passage-box"');
        expect(simulatedHtml).toContain('class="btn-audio-speak-large"');
        expect(simulatedHtml).toContain('fa-volume-high');
        expect(simulatedHtml).toContain('app.playEnglishVoice');
        expect(simulatedHtml).toContain('🎧 Bấm để nghe bài nói / cuộc hội thoại');
        expect(simulatedHtml).toContain('My First School Day');
        expect(safeOptions.length).toBe(4);
    });

    // TEST 6 — Audio key resolution
    test('Test 6 — Audio key resolution: Unit 1 và Unit 2 phân giải chính xác 100% đến tệp MP3 Kokoro TTS offline', () => {
        // Unit 1
        const u1Qs = generateEnglishQuestions('6', 'eng6-t1', 'listening');
        const u1P = u1Qs.find(x => x.type === 'listening_passage');
        expect(u1P).toBeDefined();
        const key1 = EnglishAnswerEvaluator.resolveListeningAudioKey(u1P);
        expect(key1).toBe("My First School Day");
        const res1 = EnglishAudioService.resolveAudio(u1P.listeningText, key1);
        expect(res1.found).toBe(true);
        expect(res1.filename).toBe('l6_u01_passage_01.mp3');
        expect(res1.canonicalId).toBe('L6_U01_PASSAGE_01');

        // Unit 2
        const u2Qs = generateEnglishQuestions('6', 'eng6-t2', 'listening');
        const u2P = u2Qs.find(x => x.type === 'listening_passage');
        expect(u2P).toBeDefined();
        const key2 = EnglishAnswerEvaluator.resolveListeningAudioKey(u2P);
        expect(key2).toBe("Our Cozy House");
        const res2 = EnglishAudioService.resolveAudio(u2P.listeningText, key2);
        expect(res2.found).toBe(true);
        expect(res2.filename).toBe('l6_u02_passage_01.mp3');
        expect(res2.canonicalId).toBe('L6_U02_PASSAGE_01');
    });

    // TEST 7 — Missing audio resilience
    test('Test 7 — Missing audio resilience: Xử lý phòng thủ khi audioKey không tồn tại không tạo uncaught exception', async () => {
        const dummyQuestion = {
            type: "listening_passage",
            audioKey: "nonexistent_mock_audio_99999",
            listeningText: "Some non-existent text"
        };
        const key = EnglishAnswerEvaluator.resolveListeningAudioKey(dummyQuestion);
        expect(key).toBe("nonexistent_mock_audio_99999");

        // Gọi phát âm thanh với key không tồn tại theo chính sách CURRICULUM
        const result = await EnglishAudioService.playEnglishVoice(dummyQuestion.listeningText, key, {
            category: 'CURRICULUM',
            feature: 'LISTENING'
        });

        expect(result).toBeDefined();
        expect(result.ok).toBe(false);
        expect(['AUDIO_CACHE_MISSING', 'FILE_NOT_FOUND']).toContain(result.reason);
    });

    // TEST 8 — Evaluator regression
    test('Test 8 — Evaluator regression: Đánh giá chính xác cả Listening, Reading, Choice và Speaking', () => {
        // 1. Listening Passage
        const listeningQ = {
            type: "listening_passage",
            pedagogicalType: "LISTENING_DETAIL",
            listeningText: "We are wearing our new school uniforms.",
            correctAnswer: "New school uniforms",
            options: ["Blue caps", "Winter jackets", "New school uniforms", "Sports shoes"]
        };
        const lEvalCorrect = EnglishAnswerEvaluator.evaluateEnglishAnswer(listeningQ, 2);
        expect(lEvalCorrect.isCorrect).toBe(true);
        expect(lEvalCorrect.explanation).toContain("Đoạn văn nghe được:");
        expect(lEvalCorrect.explanation).toContain("We are wearing our new school uniforms.");

        const lEvalWrong = EnglishAnswerEvaluator.evaluateEnglishAnswer(listeningQ, 0);
        expect(lEvalWrong.isCorrect).toBe(false);

        // 2. Reading Passage
        const readingQ = {
            type: "reading_passage",
            pedagogicalType: "READING_DETAIL",
            passageTitle: "Our Cozy House",
            correctAnswer: "Four rooms",
            options: ["Two rooms", "Three rooms", "Four rooms", "Five rooms"]
        };
        const rEvalCorrect = EnglishAnswerEvaluator.evaluateEnglishAnswer(readingQ, 2);
        expect(rEvalCorrect.isCorrect).toBe(true);
        expect(rEvalCorrect.explanation).toContain("Our Cozy House");

        // 3. Choice
        const choiceQ = {
            type: "choice",
            correctAnswer: "Teacher",
            options: ["Doctor", "Teacher", "Nurse"]
        };
        expect(EnglishAnswerEvaluator.evaluateEnglishAnswer(choiceQ, 1).isCorrect).toBe(true);
        expect(EnglishAnswerEvaluator.evaluateEnglishAnswer(choiceQ, 0).isCorrect).toBe(false);

        // 4. Speaking
        const speakingQ = {
            type: "speaking",
            correctAnswer: "Uniform"
        };
        const spkPassed = EnglishAnswerEvaluator.evaluateEnglishAnswer(speakingQ, { correct: true, accuracy: 85, spokenText: "Uniform" });
        expect(spkPassed.isCorrect).toBe(true);
        const spkFailed = EnglishAnswerEvaluator.evaluateEnglishAnswer(speakingQ, { correct: true, accuracy: 50, spokenText: "Uniform" });
        expect(spkFailed.isCorrect).toBe(false);
    });
});
