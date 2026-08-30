/**
 * QUIZ APPLICATION SERVICE
 * Điều phối sinh đề thi AI, nạp đề từ cache, thẩm định chất lượng câu hỏi và phân tích học lực
 */
import fs from 'fs';
import { allQuery, resolveStudentClassLevel } from '../db/database';
import { 
    callGeminiAPI, 
    auditMathQuestions, 
    auditEnglishQuestions, 
    getMathPrompt, 
    getEnglishFullExamPrompt, 
    getEnglishPrompt, 
    getEnglishCustomTopicPrompt, 
    getPregenFilePath, 
    writeErrorLog, 
    cleanJsonString, 
    sanitizeHistory, 
    aiStatus, 
    studentAiStatusMap, 
    startPreGenerationWorkerForStudent,
    auditExamSessionHelper
} from './gemini.service';
import { ExamSession } from '../types';

export interface GetQuestionsParams {
    lessonId: string;
    lessonTitle?: string;
    classLevel?: string;
    studentId?: string;
    skill?: string;
    subject?: string;
    category?: string;
    level?: string;
    grammars?: string;
}

export async function fetchOrGenerateQuestions(params: GetQuestionsParams): Promise<any> {
    const { lessonId, lessonTitle, classLevel, studentId, skill, subject, category, level, grammars } = params;
    const stId = studentId || 'default';
    const targetSkill = skill || 'listening';
    const selectedSubject = subject || (String(lessonId).startsWith('eng') || category ? 'english' : 'math');
    const isCustomTopic = String(lessonId).startsWith('custom-t-');
    const isEnglish = selectedSubject === 'english' || String(lessonId).startsWith('eng') || isCustomTopic || !!category;

    // 1. Nếu là Chuyên đề tự chọn
    if (isCustomTopic) {
        const words: any[] = await allQuery(
            "SELECT * FROM custom_vocabulary WHERE topic_id = ? AND student_id = ?",
            [lessonId, stId]
        );
        if (!words || words.length === 0) {
            throw new Error("Chuyên đề không có từ vựng nào");
        }

        const prompt = getEnglishCustomTopicPrompt(words, lessonTitle || "Chuyên đề tự chọn", targetSkill);
        const data = await callGeminiAPI({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
        }, 'Tạo đề Chuyên đề Custom');

        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textResponse) throw new Error('Không nhận được nội dung từ Gemini.');

        let examData = JSON.parse(cleanJsonString(textResponse));
        examData = await auditEnglishQuestions(examData, classLevel || '6');
        if (Array.isArray(examData)) examData = { questions: examData };
        return examData;
    }

    // 2. Thử đọc từ Cache cục bộ
    const cacheKey = isEnglish ? `${lessonId}-${targetSkill}-${level || 'default'}` : lessonId;
    const cachePath = getPregenFilePath(stId, cacheKey);

    if (targetSkill !== 'full_exam' && fs.existsSync(cachePath)) {
        try {
            const data = fs.readFileSync(cachePath, 'utf8');
            let parsed = JSON.parse(data);
            if (Array.isArray(parsed)) parsed = { questions: parsed };
            return parsed;
        } catch (e) {
            console.error('Lỗi đọc cache:', e);
        }
    }

    // 3. Sinh trực tiếp bằng AI
    let textResponse = '';
    try {
        let prompt = '';
        if (isEnglish) {
            if (targetSkill === 'full_exam') {
                const selectedG = grammars ? String(grammars).split(',').filter(Boolean) : [];
                prompt = getEnglishFullExamPrompt(lessonTitle || lessonId, lessonId, classLevel || '6', category || 'unit', selectedG, level || 'advanced');
            } else {
                prompt = getEnglishPrompt(lessonTitle || lessonId, lessonId, classLevel || '6', targetSkill, []);
            }
        } else {
            prompt = getMathPrompt(lessonTitle || lessonId, lessonId, classLevel || '6');
        }

        const data = await callGeminiAPI({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
        }, 'Tạo đề AI');

        textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!textResponse) throw new Error('Không nhận được nội dung từ Gemini.');

        let examData = JSON.parse(cleanJsonString(textResponse));
        if (isEnglish) {
            examData = await auditEnglishQuestions(examData, classLevel || '6');
        } else {
            examData = await auditMathQuestions(examData, classLevel || '6');
        }

        if (Array.isArray(examData)) examData = { questions: examData };

        if (targetSkill !== 'full_exam') {
            fs.writeFileSync(cachePath, JSON.stringify(examData, null, 2), 'utf8');
        }
        return examData;
    } catch (err: any) {
        console.error('Lỗi sinh đề trực tiếp:', err);
        writeErrorLog(lessonId, lessonTitle || lessonId, err, textResponse, textResponse ? cleanJsonString(textResponse) : '');
        
        try {
            const fallbackCache = getPregenFilePath('default', lessonId);
            if (fs.existsSync(fallbackCache)) {
                const fallbackData = JSON.parse(fs.readFileSync(fallbackCache, 'utf8'));
                const normalized = Array.isArray(fallbackData) ? { questions: fallbackData } : fallbackData;
                if (normalized.questions && normalized.questions.length > 0) {
                    return normalized;
                }
            }
        } catch (fbErr) {}
        
        throw new Error('Lỗi sinh đề AI: ' + err.message);
    }
}

export function triggerStudentPregen(studentId: string, classLevel?: string): void {
    startPreGenerationWorkerForStudent(studentId, classLevel);
}

export async function performAiAnalysis(params: {
    history: any[];
    examSessions: any[];
    studentName?: string;
    parentName?: string;
    studentId?: string;
    classLevel?: string;
    xp?: number;
    scores?: any;
}): Promise<string> {
    const { history, examSessions, studentName, parentName, studentId, xp, scores } = params;
    const classLevel = resolveStudentClassLevel(studentId, params.classLevel);

    if (history.length === 0 && examSessions.length === 0 && (!scores || Object.keys(scores).length === 0) && (!xp || xp === 0)) {
        return `Chào Phụ huynh ${parentName || 'Phụ huynh'} và con ${studentName || 'học sinh'} thân mến,\n\nHiện tại con mới khởi tạo tài khoản và chưa làm bài tập nào. Hãy bắt đầu bài học đầu tiên để AI phân tích nhé!`;
    }

    const sanitizedHistory = sanitizeHistory(history.slice(-30));
    const userPrompt = `Phân tích học lực cho học sinh ${studentName || 'con'} lớp ${classLevel}: ${JSON.stringify(sanitizedHistory)}`;

    const data = await callGeminiAPI({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
    }, 'Phân tích học lực');

    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function auditExamSession(session: ExamSession, studentId?: string, classLevel?: string): Promise<ExamSession> {
    return auditExamSessionHelper(session, studentId, classLevel);
}

export function getAiStatusInfo(studentId?: string): any {
    if (studentId && studentAiStatusMap[studentId]) {
        return { ...aiStatus, ...studentAiStatusMap[studentId] };
    }
    return aiStatus;
}
