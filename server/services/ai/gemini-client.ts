/**
 * GEMINI CLIENT
 * Thực hiện gọi HTTP request tới Google Gemini API với cơ chế xoay vòng Key,
 * tự phục hồi (Self-Healing), exponential backoff, rate limiting & error telemetry.
 */
import { 
    getActiveGeminiApiKeys, 
    invalidApiKeys, 
    maskKey, 
    getActiveKeyAccount,
    ROOT_DIR
} from './gemini-key-manager';
import fs from 'fs';
import path from 'path';

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

export function addAiLog(msg: string): void {
    const time = new Date().toLocaleTimeString();
    console.log(`[AI Log - ${time}] ${msg}`);
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
