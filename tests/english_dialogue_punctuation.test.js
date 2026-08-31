const { generateEnglishQuestions } = require('../js/english_data');

describe('Task A: English Dialogue Completion Punctuation Test', () => {
    test('Dạng bài Hoàn thành đối thoại (Complete the dialogue) không chứa dấu ? thừa ở câu trả lời B', () => {
        // Sinh câu hỏi kỹ năng viết Lớp 1 Unit 1
        const questions = generateEnglishQuestions("1", "eng1-t1", "writing");
        
        const dialogueQuestions = questions.filter(q => 
            q.questionText && q.questionText.includes("Complete the dialogue")
        );

        dialogueQuestions.forEach(q => {
            // Không được chứa "B: [____] ?"
            expect(q.questionText).not.toMatch(/B:\s*\[____\]\s*\?/);
            // Phải chứa "B: [____]"
            expect(q.questionText).toMatch(/B:\s*\[____\]/);
        });
    });

    test('Kiểm tra trên toàn bộ các topic của Lớp 1, 4, 6 có mẫu câu đối thoại', () => {
        const testCases = [
            { classLevel: "1", topicId: "eng1-t1" },
            { classLevel: "4", topicId: "eng4-t1" },
            { classLevel: "6", topicId: "eng6-t1" }
        ];

        testCases.forEach(({ classLevel, topicId }) => {
            const questions = generateEnglishQuestions(classLevel, topicId, "writing");
            const dialogueQuestions = questions.filter(q => 
                q.questionText && q.questionText.includes("Complete the dialogue")
            );

            dialogueQuestions.forEach(q => {
                expect(q.questionText).not.toMatch(/B:\s*\[____\]\s*\?/);
            });
        });
    });
});
