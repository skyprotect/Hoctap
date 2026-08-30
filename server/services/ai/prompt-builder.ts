/**
 * PROMPT BUILDER
 * Xây dựng các mẫu System & User Prompts cho AI sinh đề Toán và Tiếng Anh
 */

export const getMathPrompt = (lessonTitle: string, lessonId: string, classLevel: string = '6') => {
    return `Bạn là một giáo viên dạy Toán lớp ${classLevel} chuyên bồi dưỡng học sinh giỏi và luyện thi chất lượng cao tại Việt Nam.
Hãy biên soạn đúng 10 câu hỏi trắc nghiệm toán học bậc CHẤT LƯỢNG CAO (đòi hỏi tư duy logic sâu sắc, vận dụng cao, giải quyết các bài toán đố thực tế thú vị) liên quan trực tiếp đến bài học: "${lessonTitle}" (ID bài học: ${lessonId}).

Yêu cầu đặc biệt: Để học sinh có thể làm lại đề thi nhiều lần mà không bị trùng số liệu, bạn phải biên soạn mỗi câu hỏi dưới dạng template với các biến số.
Yêu cầu toán học & lập trình quan trọng:
1. Các biến trong "variables" phải là các số tự nhiên hoặc số nguyên phù hợp với chương trình lớp ${classLevel}. Khoảng giá trị [min, max] phải hợp lý để bài toán có nghĩa và không quá lớn.
2. "constraints" là danh sách các biểu thức ràng buộc để đảm bảo đề bài hợp lệ về mặt toán học và thực tế.
3. "formulas" dùng để tính toán đáp án đúng và các phương án sai (nhiễu). Thiết kế đáp án nhiễu động bằng biểu thức tam phân.
4. Trình bày hoàn toàn bằng TIẾNG VIỆT CÓ DẤU đầy đủ, đúng ngữ pháp sư phạm Việt Nam.
5. Đảm bảo các công thức toán được bọc trong cặp dấu $ thích hợp.
6. Trả về đúng 10 câu hỏi dưới dạng JSON {"questions": [...]}.`;
};

export const getEnglishFullExamPrompt = (lessonTitle: string, lessonId: string, classLevel: string = '6', category: string = 'unit', selectedGrammars: string[] = [], level: string = 'advanced') => {
    let categoryDesc = category === 'unit' ? `Theo bài học / Unit: "${lessonTitle}"` : `Chủ đề: "${lessonTitle}"`;
    return `Bạn là Chuyên gia biên soạn đề thi Tiếng Anh Lớp ${classLevel} theo Chuẩn GDPT 2018.
${categoryDesc}
Hãy tạo 10 câu hỏi kiểm tra đầy đủ các kỹ năng: LISTENING (2 câu), PRONUNCIATION & GRAMMAR (4 câu), READING (2 câu), WRITING (2 câu).
Trả về duy nhất mảng JSON {"questions": [...]}.`;
};

export const getEnglishPrompt = (lessonTitle: string, lessonId: string, classLevel: string = '6', skill: string = 'listening', reviewWords: any[] = []) => {
    let reviewInstruction = "";
    if (reviewWords && reviewWords.length > 0) {
        const wordsStr = reviewWords.map(w => `'${w.word}' (nghĩa: '${w.translation}')`).join(', ');
        reviewInstruction = `Lồng ghép từ vựng ôn tập: ${wordsStr}`;
    }
    return `Bạn là chuyên gia giáo dục ngoại ngữ dạy Tiếng Anh lớp ${classLevel} chuẩn Global Success.
Biên soạn đúng 5 câu hỏi trắc nghiệm hoặc tương tác tiếng Anh cho kỹ năng: "${skill}" - Bài: "${lessonTitle}" (${lessonId}).
${reviewInstruction}
Trả về duy nhất mảng JSON {"questions": [...]}.`;
};

export const getEnglishCustomTopicPrompt = (words: any[], topicTitle: string, skill: string) => {
    const wordsListText = words.map(w => `- ${w.word} (${w.type}): ${w.translation}`).join('\n');
    return `Biên soạn đúng 5 câu hỏi tiếng Anh kỹ năng: "${skill}" dựa trên nhóm từ vựng:
${wordsListText}
Chủ đề: "${topicTitle}"
Trả về chuỗi JSON {"questions": [...]}.`;
};
