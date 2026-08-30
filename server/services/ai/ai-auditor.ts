/**
 * AI AUDITOR & SELF-HEALING
 * Thẩm định đề thi toán và tiếng Anh bằng AI, sửa lỗi KaTeX/LaTeX, chống trùng đáp án,
 * tự phục hồi câu hỏi hỏng và làm sạch phiên thi
 */
import fs from 'fs';
import { QuizQuestion, ExamSession } from '../../types';
import { callGeminiAPI } from './gemini-client';
import { cleanJsonString } from './response-parser';
import { getPregenFilePath } from './pregen-worker';

export async function auditMathQuestions(examData: any, classLevel: string = '6', geminiModel: string | null = null): Promise<any> {
    const auditPrompt = `Bạn là chuyên gia thẩm định đề thi toán lớp ${classLevel} chất lượng cao dạng template.
Dưới đây là đề thi dạng JSON chứa các câu hỏi template được sinh ra bởi AI:
\`\`\`json
${JSON.stringify(examData, null, 2)}
\`\`\`

Nhiệm vụ của bạn là thẩm định và sửa các lỗi nếu có:
1. Đảm bảo toàn bộ ký hiệu phân số (ví dụ: \\\\frac{{a}}{{b}}) hoặc các phép toán toán học phải được bọc trong cặp dấu $ thích hợp (ví dụ: \${a} + {b} = {ans}\$). Giữ nguyên các placeholder biến nằm trong ngoặc nhọn {varName}.
   - **QUY TẮC VÀNG TRÁNH LỆCH DẤU $**: Tuyệt đối không sử dụng ký tự "$" trước dấu mở ngoặc "{" của các biến nằm bên trong một biểu thức LaTeX dài. Ví dụ: viết "$A = \\\\{{first}, {second}\\\\}$" thay vì viết "$A = \\\\{\${first}, \${second}\\\\}$" vì dấu "$" đứng trước các biến bên trong sẽ phá vỡ KaTeX. Dấu "$" chỉ được đặt ở đầu và ở cuối biểu thức LaTeX.
2. Sửa bất kỳ dấu nháy kép raw (") bên trong văn bản tiếng Việt thành nháy đơn (') để đảm bảo cú pháp JSON không bị lỗi parse.
3. Kiểm tra tính đúng đắn của logic toán học, các công thức tính toán trong "formulas" và các ràng buộc trong "constraints".
   - **THIẾT KẾ ĐÁP ÁN NHIỄU ĐỘNG & CHỐNG TRÙNG LẶP**: Đảm bảo các đáp án nhiễu (w1, w2, w3) không dùng số cố định và không được trùng nhau hoặc trùng với ans. Nếu có nguy cơ trùng, hãy sửa chúng thành biểu thức tam phân dịch chuyển động: "w1": "(w1_goc === ans) ? w1_goc + 5 : w1_goc".
   - **TRÁNH SỐ THẬP PHÂN LẺ**: Đối với các bài toán đếm nguyên, đếm người, vật phẩm..., hãy thêm các ràng buộc chia hết vào "constraints" (ví dụ: "totalAmount % price === 0") để loại bỏ kết quả là số thập phân lẻ.
   - **TRÁNH GIÁ TRỊ VÔ NGHĨA**: Kiểm tra các công thức lọc, tìm min/max xem có khả năng trả về Infinity/NaN không để bổ sung điều kiện dự phòng.
4. TUYỆT ĐỐI CẤM sử dụng code lập trình JavaScript thô hoặc các hàm toán học như Math.pow, Math.floor, variables., formulas., ===, ?, : bên trong nội dung văn bản hiển thị như "questionText", "options", "hints", "solutionHtml", "tip". Mọi phép tính toán phức tạp phải được đưa vào phần "formulas" thành các biến kết quả trung gian, và phần lời giải chỉ được tham chiếu đến biến đó (ví dụ: dùng {result_pow} thay vì {Math.pow(a, b)} hoặc {variables.a}).
5. TUYỆT ĐỐI KHÔNG sử dụng ký tự tiếng Việt có dấu trong thẻ LaTeX \\\\text{...} (ví dụ: \\\\text{số lượng} là sai, hãy viết \\\\text{so luong} hoặc viết hẳn chữ tiếng Việt ở ngoài dấu $).
6. TUYỆT ĐỐI CẤM viết tiếng Việt không dấu cho tất cả các văn bản hiển thị cho học sinh (đề bài, phương án, gợi ý, lời giải, mẹo). Nếu phát hiện bất kỳ câu nào có chữ tiếng Việt không dấu (ví dụ: 'Tinh gia tri', 'Ta co', 'Dap an dung', 'so mu', ...), bạn phải sửa chúng thành tiếng Việt có dấu đầy đủ, đúng ngữ pháp sư phạm Việt Nam (ví dụ: 'Tính giá trị', 'Ta có', 'Đáp án đúng', 'số mũ', ...).
7. Trả về đúng cấu trúc JSON, không thêm bất kỳ văn bản giải thích nào ngoài JSON.`;

    try {
        const data = await callGeminiAPI({
            contents: [{ role: 'user', parts: [{ text: auditPrompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
        }, 'Thẩm định đề thi', geminiModel);

        let textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textResponse) throw new Error('Không nhận được phản hồi từ AI Auditor.');
        const cleaned = cleanJsonString(textResponse);
        return JSON.parse(cleaned);
    } catch (err: any) {
        console.error('Lỗi thẩm định bằng AI Auditor:', err.message);
        return examData;
    }
}

export async function auditEnglishQuestions(examData: any, classLevel: string = '6', geminiModel: string | null = null): Promise<any> {
    const bt = String.fromCharCode(96);
    const auditPrompt = `Bạn là chuyên gia thẩm định đề thi Tiếng Anh lớp ${classLevel} chất lượng cao theo chuẩn Global Success.
Dưới đây là đề thi dạng JSON chứa các câu hỏi Tiếng Anh tương tác:
${bt}${bt}${bt}json
${JSON.stringify(examData, null, 2)}
${bt}${bt}${bt}

Nhiệm vụ của bạn là thẩm định và sửa các lỗi nếu có:
1. Đảm bảo toàn bộ các phương án nhiễu (options) không bị trùng lặp với đáp án đúng và không trùng chéo nhau.
2. Kiểm tra phần gợi ý (hints), lời giải (solutionHtml), và mẹo (tip) phải được viết bằng TIẾNG VIỆT CÓ DẤU đầy đủ, đúng ngữ pháp sư phạm Việt Nam.
3. Kiểm tra tính đúng đắn của ngữ pháp và từ vựng Tiếng Anh trong đề bài, đảm bảo bám sát chương trình Global Success lớp ${classLevel}.
4. Đảm bảo các thuộc tính đặc trưng cho Nghe - Nói - Đọc - Viết gồm "questionType", "listeningText", "speakingPhrases", và "spellingWords" được định nghĩa đầy đủ và đúng định dạng.
5. Trả về đúng cấu trúc JSON, không thêm bất kỳ văn bản giải thích nào ngoài JSON.`;

    try {
        const data = await callGeminiAPI({
            contents: [{ role: 'user', parts: [{ text: auditPrompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
        }, 'Thẩm định đề thi Tiếng Anh', geminiModel);

        let textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textResponse) throw new Error('Không nhận được phản hồi từ AI Auditor Tiếng Anh.');
        return JSON.parse(cleanJsonString(textResponse));
    } catch (err) {
        console.error('Lỗi thẩm định bằng AI Auditor Tiếng Anh:', err);
        return examData;
    }
}

export async function healTemplateFile(studentId: string, lessonId: string, questionType: string, classLevel: string = '6'): Promise<void> {
    const stId = studentId || 'default';
    const cachePath = getPregenFilePath(stId, lessonId);
    if (!fs.existsSync(cachePath)) return;

    try {
        const fileContent = fs.readFileSync(cachePath, 'utf8');
        const data = JSON.parse(fileContent);
        const questions = data.questions || (Array.isArray(data) ? data : null);
        if (!questions) return;

        const qIndex = questions.findIndex((q: any) => q.isTemplate && q.type === questionType);
        if (qIndex === -1) return;

        const targetQ = questions[qIndex];
        console.log(`[Self-Healing] Phát hiện template lỗi ở ${lessonId}, type: ${questionType}. Đang tự phục hồi bằng AI...`);

        const healPrompt = `Bạn là chuyên gia sửa lỗi template đề thi toán lớp ${classLevel} dạng JSON.
Sửa lỗi câu hỏi sau:
\`\`\`json
${JSON.stringify(targetQ, null, 2)}
\`\`\`
Trả về đúng cấu trúc JSON của câu hỏi đã sửa.`;

        const aiData = await callGeminiAPI({
            contents: [{ role: 'user', parts: [{ text: healPrompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
        }, 'Tự phục hồi template đề thi');

        let textResponse = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textResponse) {
            const healedQ = JSON.parse(cleanJsonString(textResponse));
            healedQ.isTemplate = true;
            healedQ.type = questionType;
            
            questions[qIndex] = healedQ;
            const tempPath = cachePath + '.tmp';
            fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
            fs.renameSync(tempPath, cachePath);
            console.log(`[Self-Healing] Đã tự động phục hồi thành công template gốc của ${lessonId} (${questionType}) trên ổ đĩa.`);
        }
    } catch (err) {
        console.error(`[Self-Healing] Lỗi khi tự phục hồi template gốc:`, err);
    }
}

export async function auditExamSessionHelper(session: ExamSession, studentId: string = 'default', classLevel: string = '6'): Promise<ExamSession> {
    if (!session || !session.questions) return session;

    let cleanedQuestions: QuizQuestion[] = [];

    for (let i = 0; i < session.questions.length; i++) {
        const q = session.questions[i];
        const hasNaN = /NaN|undefined|null/i.test(q.solutionHtml || '') || /NaN|undefined|null/i.test(q.questionText || '');
        const hasUnpairedDollar = (q.solutionHtml && (q.solutionHtml.match(/\$/g) || []).length % 2 !== 0) || (q.questionText && (q.questionText.match(/\$/g) || []).length % 2 !== 0);
        const hasKatexError = q.solutionHtml && (q.solutionHtml.includes('\\times') || q.solutionHtml.includes('\\frac')) && !q.solutionHtml.includes('$');
        const hasLonesomeDollar = q.solutionHtml && /\d+\$\s*\(/.test(q.solutionHtml);

        if (hasNaN || hasUnpairedDollar || hasKatexError || hasLonesomeDollar) {
            const cleanPrompt = `Bạn là chuyên gia thẩm định và sửa lỗi sư phạm Toán lớp ${classLevel}.
Đề bài: ${q.questionText}
Các phương án: ${JSON.stringify(q.options)}
Chỉ số đúng: ${q.correctIndex}
Lời giải hiện tại: ${q.solutionHtml}
Mẹo: ${q.tip}

Sửa triệt để các lỗi NaN/undefined và lỗi dấu $. Trả về JSON:
{
  "questionText": "...",
  "solutionHtml": "...",
  "tip": "..."
}`;

            try {
                const aiData = await callGeminiAPI({
                    contents: [{ role: 'user', parts: [{ text: cleanPrompt }] }],
                    generationConfig: { responseMimeType: 'application/json' }
                }, 'Làm sạch câu hỏi lỗi');

                let textResponse = aiData.candidates?.[0]?.content?.parts?.[0]?.text;
                if (textResponse) {
                    const cleaned = JSON.parse(cleanJsonString(textResponse));
                    q.questionText = cleaned.questionText || q.questionText;
                    q.solutionHtml = cleaned.solutionHtml || q.solutionHtml;
                    q.tip = cleaned.tip || q.tip;

                    if (session.lessonId && q.type) {
                        healTemplateFile(studentId, session.lessonId, q.type, classLevel).catch(() => {});
                    }
                }
            } catch (err) {
                console.error('Lỗi khi gọi AI làm sạch câu hỏi:', err);
            }
        }
        cleanedQuestions.push(q);
    }

    session.questions = cleanedQuestions;
    return session;
}
