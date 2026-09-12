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
