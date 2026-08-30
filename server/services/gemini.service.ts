/**
 * GEMINI AI SERVICE
 * Điều phối gọi API Gemini AI với cơ chế xoay vòng Key dự phòng,
 * thẩm định đề thi (AI Auditor), sinh đề ngầm (Pre-generation Worker) và tự phục hồi (Self-Healing).
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { QuizQuestion, ExamSession } from '../types';

export const ROOT_DIR = path.resolve(__dirname, '../../');
export const EXAMS_DIR = path.join(ROOT_DIR, 'exams');
if (!fs.existsSync(EXAMS_DIR)) {
    fs.mkdirSync(EXAMS_DIR, { recursive: true });
}

export const EMBEDDED_API_KEYS: string[] = [
    'QUl6YVN5Qm0zZy01Nmdlc0xxNVpSMDVvTF8xdnNQSHBHQ0l0RmFz',
    'QVEuQWI4Uk42SUJpdHE4YV96WWVUb2V0MFp4SXpvOUh1LW1veGhMZjNLZGZrQmJ4S0lRQ2c=',
    'QVEuQWI4Uk42S01SQzBEY3NhX3lCN2JiZEZscnVlT0pNTFlOWkNhd3EzUTh5cDVna0F6bFE=',
    'QVEuQWI4Uk42SURlU0tnMTNwN2llUVZBSWVBQmtDMENHb2FaWmxTbS0wVVMwZENFRmJHVUE=',
    'QVEuQWI4Uk42STFJVzNtZEkxOGhCVEpUVjg0bWpjekdSc0FubHZCc1pNcDNlV01rU1JINUE=',
    'QVEuQWI4Uk42S0pEQm5TWGtiVl9SaFB2Q3ZxMHI2QTV0dmZCVUFGY3BMbHp0UllTUDNHRkE='
];

export function getActiveGeminiApiKeys(): string[] {
    const envKeys = process.env.GEMINI_API_KEY || '';
    const apiKeys = envKeys.split(/[\s,;]+/).filter(k => k && k !== 'your_gemini_api_key_here');
    
    if (apiKeys.length > 0) {
        return apiKeys;
    }
    
    try {
        return EMBEDDED_API_KEYS.map(b64 => Buffer.from(b64, 'base64').toString('utf8').trim()).filter(Boolean);
    } catch (e) {
        console.error('Lỗi giải mã embedded keys:', e);
        return [];
    }
}

export const invalidApiKeys = new Set<string>();

export interface AiStatusState {
    state: string;
    message: string;
    keyIndex: number;
    totalKeys: number;
    timestamp: number;
    totalExams: number;
    completedExams: number;
    currentLessonId: string | null;
    currentLessonTitle: string | null;
    errors: any[];
    activeKeyMasked: string;
    activeKeyAccount: string;
    pausedUntil: number | null;
    retryCount: number;
}

export const aiStatus: AiStatusState = {
    state: 'idle',
    message: 'Hệ thống sẵn sàng',
    keyIndex: 0,
    totalKeys: 0,
    timestamp: Date.now(),
    totalExams: 0,
    completedExams: 0,
    currentLessonId: null,
    currentLessonTitle: null,
    errors: [],
    activeKeyMasked: 'Không có API Key active',
    activeKeyAccount: 'Không có tài khoản',
    pausedUntil: null,
    retryCount: 0
};

export function maskKey(key: string): string {
    if (!key) return 'Không có';
    const trimmed = key.trim();
    return trimmed.length > 12 
        ? `${trimmed.substring(0, 8)}...${trimmed.substring(trimmed.length - 4)}`
        : `${trimmed.substring(0, 3)}...`;
}

export function getActiveKeyAccount(idx: number): string {
    const rawAccounts = process.env.GEMINI_API_ACCOUNTS || '';
    const accounts = rawAccounts.split(',').map(a => a.trim());
    return accounts[idx] || `Tài khoản ${idx + 1}`;
}

export function addAiLog(msg: string): void {
    const time = new Date().toLocaleTimeString();
    console.log(`[AI Log - ${time}] ${msg}`);
}

export function sanitizeHistory(historyArray: any[]): any[] {
    if (!Array.isArray(historyArray)) return [];
    return historyArray.map(item => {
        const newItem = { ...item };
        if (typeof newItem.studentAnswer === 'string') {
            newItem.studentAnswer = newItem.studentAnswer
                .replace(/ignore|bỏ qua|override|quên đi|hãy viết|trả lời|nhận xét|đánh giá|hãy khuyên|khuyên bố|chơi game|điện tử/gi, '*')
                .substring(0, 100);
        }
        return newItem;
    });
}

export function cleanJsonString(str: string): string {
    let result = '';
    let inString = false;
    let i = 0;
    
    while (i < str.length) {
        let char = str[i];
        
        if (char === '"') {
            if (i > 0 && str[i - 1] === '\\') {
                result += char;
                i++;
                continue;
            }
            
            if (inString) {
                let nextNonSpaceChar = '';
                let j = i + 1;
                while (j < str.length) {
                    const nextChar = str[j];
                    if (nextChar !== ' ' && nextChar !== '\t' && nextChar !== '\r' && nextChar !== '\n') {
                        nextNonSpaceChar = nextChar;
                        break;
                    }
                    j++;
                }
                
                if (nextNonSpaceChar === ':' || nextNonSpaceChar === ',' || nextNonSpaceChar === '}' || nextNonSpaceChar === ']' || j === str.length) {
                    inString = false;
                    result += char;
                } else {
                    result += "'";
                }
            } else {
                inString = true;
                result += char;
            }
            i++;
            continue;
        }
        
        if (inString && (char === '\n' || char === '\r')) {
            if (char === '\r' && str[i + 1] === '\n') {
                result += '\\n';
                i += 2;
            } else {
                result += '\\n';
                i++;
            }
            continue;
        }
        
        if (inString && char === '\\') {
            let nextChar = str[i + 1];
            if (nextChar === undefined) {
                result += '\\\\';
                i++;
                continue;
            }
            
            if (nextChar === '"' || nextChar === '\\') {
                result += '\\' + nextChar;
                i += 2;
                continue;
            }
            
            result += '\\\\';
            i++;
        } else {
            result += char;
            i++;
        }
    }
    return result;
}

export function writeErrorLog(lessonId: string, lessonTitle: string, error: any, rawText?: string, cleanedText?: string): void {
    try {
        const logDir = path.join(ROOT_DIR, 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        const timestamp = Date.now();
        const dateStr = new Date().toISOString();
        const logFileName = `error-${lessonId}-${timestamp}.log`;
        const logPath = path.join(logDir, logFileName);

        let logContent = `==================================================\n`;
        logContent += `AI GENERATION ERROR REPORT\n`;
        logContent += `Time: ${dateStr}\n`;
        logContent += `Lesson ID: ${lessonId}\n`;
        logContent += `Lesson Title: ${lessonTitle}\n`;
        logContent += `==================================================\n\n`;

        logContent += `[ERROR DETAILS]\n`;
        logContent += `${error.message}\n`;
        if (error.stack) {
            logContent += `${error.stack}\n`;
        }
        logContent += `\n`;

        if (cleanedText) {
            logContent += `[CLEANED JSON TEXT]\n`;
            logContent += `${cleanedText}\n\n`;
        }

        if (rawText) {
            logContent += `[RAW AI RESPONSE TEXT]\n`;
            logContent += `${rawText}\n\n`;
        }

        fs.writeFileSync(logPath, logContent, 'utf8');
        addAiLog(`Đã ghi log lỗi chi tiết vào file: logs/${logFileName}`);
    } catch (err) {
        console.error('Không thể ghi log lỗi:', err);
    }
}

export async function callGeminiAPI(body: any, taskName: string = 'Đang xử lý', overrideModel: string | null = null): Promise<any> {
    const apiKeys = getActiveGeminiApiKeys();
    
    aiStatus.totalKeys = apiKeys.length;
    aiStatus.timestamp = Date.now();
    
    if (invalidApiKeys.size >= apiKeys.length && apiKeys.length > 0) {
        addAiLog(`[Tự phục hồi] Khôi phục toàn bộ API keys bị vô hiệu hóa để thử lại...`);
        invalidApiKeys.clear();
    }

    if (apiKeys.length === 0) {
        aiStatus.state = 'error';
        aiStatus.message = 'Cấu hình GEMINI_API_KEY chưa hợp lệ. Vui lòng cập nhật file .env!';
        throw new Error('Cấu hình GEMINI_API_KEY chưa hợp lệ. Vui lòng cập nhật file .env!');
    }

    const MAX_CYCLE_RETRIES = 2; 
    const MAX_KEY_RETRIES = 3;   
    let lastError: any = null;

    for (let cycle = 0; cycle <= MAX_CYCLE_RETRIES; cycle++) {
        if (cycle > 0) {
            addAiLog(`Chu kỳ xoay vòng thứ ${cycle} gặp sự cố. Chờ 5s trước khi thử lại...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
        }

        for (let i = 0; i < apiKeys.length; i++) {
            const key = apiKeys[i].trim();
            if (invalidApiKeys.has(key)) continue;
            
            const modelName = overrideModel || process.env.GEMINI_MODEL || 'gemini-2.5-flash';
            const apiVersion = 'v1beta';
            const geminiEndpoint = `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelName}:generateContent?key=${key}`;
            
            aiStatus.state = 'active';
            aiStatus.keyIndex = i + 1;
            aiStatus.activeKeyMasked = maskKey(key);
            aiStatus.activeKeyAccount = getActiveKeyAccount(i);

            for (let retry = 0; retry < MAX_KEY_RETRIES; retry++) {
                if (retry > 0) {
                    const delay = Math.pow(2, retry) * 1000;
                    addAiLog(`Key thứ ${i + 1} gặp lỗi tạm thời. Thử lại sau ${delay/1000}s...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                aiStatus.message = `${taskName}: Đang sử dụng API Key thứ ${i + 1}/${apiKeys.length}...`;
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 120000);

                const requestBody = {
                    ...body,
                    safetySettings: [
                        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
                    ]
                };

                try {
                    addAiLog(`Gửi request với API Key thứ ${i + 1} (${key.substring(0, 8)}...)`);
                    const response = await fetch(geminiEndpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(requestBody),
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);

                    if (response.status === 429 || response.status === 403 || response.status === 400) {
                        const errText = await response.text();
                        addAiLog(`Key thứ ${i + 1} bị từ chối (Status ${response.status}): ${errText}`);
                        
                        let errorMsg = `Lỗi HTTP ${response.status}`;
                        let isQuotaExceeded = false;

                        if (response.status === 429) {
                            const lowerText = errText.toLowerCase();
                            if (lowerText.includes("exceeded") && (lowerText.includes("quota") || lowerText.includes("billing") || lowerText.includes("limit"))) {
                                errorMsg = "Tài khoản API hết hạn ngạch ngày (Quota Exceeded - 429)";
                                isQuotaExceeded = true;
                            } else {
                                errorMsg = "Bị giới hạn lượt gọi tạm thời (Rate Limit - 429)";
                            }
                        } else if (response.status === 403) {
                            errorMsg = "API Key không hợp lệ hoặc bị chặn quyền truy cập (Forbidden - 403)";
                            isQuotaExceeded = true;
                        } else if (response.status === 400) {
                            errorMsg = "Yêu cầu không hợp lệ hoặc cấu hình model sai (Bad Request - 400)";
                            isQuotaExceeded = true;
                        }
                        lastError = new Error(`${errorMsg}: ${errText.substring(0, 150)}`);

                        if (isQuotaExceeded) {
                            invalidApiKeys.add(key);
                            addAiLog(`-> Vô hiệu hóa API Key thứ ${i + 1} tạm thời do hết hạn ngạch hoặc cấu hình sai.`);
                        }
                        break;
                    }

                    if (!response.ok) {
                        throw new Error(`Server trả về mã lỗi: ${response.status}`);
                    }

                    const data = await response.json();
                    aiStatus.state = 'idle';
                    aiStatus.message = 'Hệ thống sẵn sàng';
                    return data;

                } catch (err: any) {
                    clearTimeout(timeoutId);
                    addAiLog(`Lỗi khi gọi API trên Key thứ ${i + 1}: ${err.message}`);
                    lastError = err;
                }
            }
        }
    }

    aiStatus.state = 'error';
    aiStatus.message = 'Toàn bộ API Keys đều gặp sự cố: ' + (lastError ? lastError.message : 'Unknown');
    throw new Error('Toàn bộ API Keys đều gặp sự cố: ' + (lastError ? lastError.message : 'Unknown'));
}

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

export function getPregenFilePath(studentId: string, lessonId: string): string {
    const specificPath = path.join(EXAMS_DIR, `pregen-${studentId}-${lessonId}.json`);
    if (fs.existsSync(specificPath)) return specificPath;

    const genericPath = path.join(EXAMS_DIR, `pregen-${lessonId}.json`);
    if (fs.existsSync(genericPath)) return genericPath;

    const defaultPath = path.join(EXAMS_DIR, `pregen-default-${lessonId}.json`);
    if (fs.existsSync(defaultPath)) return defaultPath;

    if (studentId === 'std_baongoc' || studentId === 'default') {
        const oldBaoNgocPath = path.join(EXAMS_DIR, `pregen-std_xf9e2lvgv-${lessonId}.json`);
        if (fs.existsSync(oldBaoNgocPath)) return oldBaoNgocPath;
    }
    const bmPath = path.join(EXAMS_DIR, `pregen-std_htsj4gbmo-${lessonId}.json`);
    if (fs.existsSync(bmPath)) return bmPath;

    const dpPath = path.join(EXAMS_DIR, `pregen-std_tyc0gfnkz-${lessonId}.json`);
    if (fs.existsSync(dpPath)) return dpPath;

    return specificPath;
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

// Nạp danh sách bài học
export interface LessonMeta {
    id: string;
    title: string;
    class: string;
    subject: string;
}

export let allLessons: LessonMeta[] = [];
try {
    const englishFilePath = path.join(ROOT_DIR, 'js', 'english_data.js');
    let englishCode = '';
    if (fs.existsSync(englishFilePath)) {
        englishCode = fs.readFileSync(englishFilePath, 'utf8');
    }
    const lessonsFilePath = path.join(ROOT_DIR, 'js', 'lessons.js');
    const lessonsCode = fs.readFileSync(lessonsFilePath, 'utf8');
    const sandbox: any = { window: {}, document: {}, console: console };
    
    const courseData: any[] = vm.runInNewContext(englishCode + ";\n" + lessonsCode + ";\nCOURSE_DATA;", sandbox) || [];
    
    courseData.forEach(chapter => {
        if (chapter.lessons && Array.isArray(chapter.lessons)) {
            chapter.lessons.forEach((lesson: any) => {
                allLessons.push({
                    id: lesson.id,
                    title: lesson.title,
                    class: chapter.class || '6',
                    subject: chapter.subject || 'math'
                });
            });
        }
    });
} catch (e) {
    console.error('Lỗi khi phân tích lessons.js và english_data.js để lấy danh sách bài học:', e);
}

export const studentAiStatusMap: Record<string, any> = {};
let preGenQueue: any[] = [];
let isPreGenRunning = false;

export function loadPregenStatusForStudent(studentId: string): any {
    const filePath = path.join(EXAMS_DIR, `pregen_status_${studentId}.json`);
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (e) {
        console.error(`Không thể đọc file trạng thái sinh đề cho học sinh ${studentId}:`, e);
    }
    return null;
}

export function savePregenStatusForStudent(studentId: string, statusData: any): void {
    const filePath = path.join(EXAMS_DIR, `pregen_status_${studentId}.json`);
    try {
        const tempPath = filePath + '.tmp';
        fs.writeFileSync(tempPath, JSON.stringify(statusData, null, 2), 'utf8');
        fs.renameSync(tempPath, filePath);
    } catch (e) {
        console.error(`Không thể ghi file trạng thái sinh đề cho học sinh ${studentId}:`, e);
    }
}

export async function startPreGenerationWorkerForStudent(studentId: string, classLevel?: string): Promise<void> {
    const studentLessons = allLessons.filter(lesson => lesson.class === (classLevel || '6'));
    
    let statusData = loadPregenStatusForStudent(studentId);
    if (!statusData) {
        statusData = { completed: [], failed: {} };
        for (const lesson of studentLessons) {
            const cachePath = getPregenFilePath(studentId, lesson.id);
            if (fs.existsSync(cachePath)) {
                statusData.completed.push(lesson.id);
            }
        }
        savePregenStatusForStudent(studentId, statusData);
    }

    const pendingLessons = [];
    for (const lesson of studentLessons) {
        if (!statusData.completed.includes(lesson.id)) {
            pendingLessons.push(lesson);
        }
    }

    let completedCount = studentLessons.length - pendingLessons.length;

    if (!studentAiStatusMap[studentId]) {
        studentAiStatusMap[studentId] = {
            errors: [],
            retryCount: 0,
            pausedUntil: null
        };
    }
    
    studentAiStatusMap[studentId].totalExams = studentLessons.length;
    studentAiStatusMap[studentId].completedExams = completedCount;

    preGenQueue = preGenQueue.filter(task => task.studentId !== studentId);
    const newTasks = pendingLessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        class: lesson.class,
        studentId: studentId
    }));
    preGenQueue = [...newTasks, ...preGenQueue];

    addAiLog(`[Worker] Kích hoạt sinh đề cho HS: ${studentId} (Lớp ${classLevel}). Tổng: ${studentLessons.length} bài, đã xong: ${completedCount} bài, cần sinh thêm: ${pendingLessons.length} bài.`);

    if (isPreGenRunning) return;
    isPreGenRunning = true;

    (async () => {
        while (preGenQueue.length > 0) {
            const task = preGenQueue[0];
            const taskStudentId = task.studentId;

            try {
                addAiLog(`[Worker] Sinh đề bài "${task.title}" (${task.id}) cho HS ${taskStudentId} - Lớp ${task.class || '6'}`);
                const prompt = getMathPrompt(task.title, task.id, task.class || '6');
                const data = await callGeminiAPI({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: 'application/json' }
                }, `Sinh đề ngầm: ${task.title}`);

                const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!textResponse) throw new Error('Không nhận được nội dung từ Gemini.');

                let examData = JSON.parse(cleanJsonString(textResponse));
                examData = await auditMathQuestions(examData, task.class || '6');
                if (Array.isArray(examData)) examData = { questions: examData };

                const cachePath = path.join(EXAMS_DIR, `pregen-${taskStudentId}-${task.id}.json`);
                const tempPath = cachePath + '.tmp';
                fs.writeFileSync(tempPath, JSON.stringify(examData, null, 2), 'utf8');
                fs.renameSync(tempPath, cachePath);

                preGenQueue.shift();
                if (studentAiStatusMap[taskStudentId]) {
                    studentAiStatusMap[taskStudentId].completedExams++;
                }

                let stStatus = loadPregenStatusForStudent(taskStudentId) || { completed: [], failed: {} };
                stStatus.completed.push(task.id);
                savePregenStatusForStudent(taskStudentId, stStatus);
            } catch (err: any) {
                addAiLog(`[Worker] Lỗi sinh đề bài "${task.title}": ${err.message}`);
                preGenQueue.shift();
            }

            if (preGenQueue.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 8000));
            }
        }
        isPreGenRunning = false;
    })();
}

export function updateEnvApiKeysAndAccounts(newKeysString: string, newAccountsString: string): void {
    const envPath = path.join(ROOT_DIR, '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }

    const lines = envContent.split(/\r?\n/);
    let keyFound = false;
    let accountsFound = false;
    
    let updatedLines = lines.map(line => {
        if (line.startsWith('GEMINI_API_KEY=')) {
            keyFound = true;
            return `GEMINI_API_KEY=${newKeysString}`;
        }
        if (line.startsWith('GEMINI_API_ACCOUNTS=')) {
            accountsFound = true;
            return `GEMINI_API_ACCOUNTS=${newAccountsString}`;
        }
        return line;
    });

    if (!keyFound) {
        updatedLines.unshift(`GEMINI_API_KEY=${newKeysString}`);
    }
    if (!accountsFound) {
        const keyIndex = updatedLines.findIndex(l => l.startsWith('GEMINI_API_KEY='));
        if (keyIndex !== -1) {
            updatedLines.splice(keyIndex + 1, 0, `GEMINI_API_ACCOUNTS=${newAccountsString}`);
        } else {
            updatedLines.unshift(`GEMINI_API_ACCOUNTS=${newAccountsString}`);
        }
    }

    fs.writeFileSync(envPath, updatedLines.join('\n'), 'utf8');
}
