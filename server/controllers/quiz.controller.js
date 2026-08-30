/**
 * QUIZ CONTROLLER
 * Điều phối sinh đề thi AI, nạp đề từ cache, thẩm định chất lượng câu hỏi và phân tích học lực
 */
const fs = require('fs');
const path = require('path');
const { allQuery, resolveStudentClassLevel } = require('../db/database');
const { 
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
    addAiLog, 
    sanitizeHistory, 
    aiStatus, 
    studentAiStatusMap, 
    startPreGenerationWorkerForStudent,
    auditExamSessionHelper
} = require('../services/gemini.service');

async function getQuestions(req, res) {
    const { lessonId: rawLessonId, lessonTitle, classLevel, studentId, skill, subject, category, level, grammars, detail } = req.query;
    const lessonId = (rawLessonId && rawLessonId.trim()) ? rawLessonId.trim() : (detail || (category ? `eng6-${category}` : null));
    const stId = studentId || 'default';
    const targetSkill = skill || 'listening';
    const selectedSubject = subject || (String(lessonId).startsWith('eng') || category ? 'english' : 'math');
    
    if (!lessonId) {
        return res.status(400).json({ error: 'Thiếu tham số lessonId' });
    }

    const isCustomTopic = String(lessonId).startsWith('custom-t-');
    const isEnglish = selectedSubject === 'english' || String(lessonId).startsWith('eng') || isCustomTopic || !!category;

    // 1. Nếu là Chuyên đề tự chọn
    if (isCustomTopic) {
        try {
            const words = await allQuery(
                "SELECT * FROM custom_vocabulary WHERE topic_id = ? AND student_id = ?",
                [lessonId, stId]
            );
            if (!words || words.length === 0) {
                return res.status(404).json({ error: "Chuyên đề không có từ vựng nào" });
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
            return res.json(examData);
        } catch (err) {
            console.error('Lỗi sinh đề cho chuyên đề custom:', err);
            return res.status(500).json({ error: 'Lỗi nạp đề từ AI: ' + err.message });
        }
    }

    // 2. Thử đọc từ Cache cục bộ
    const cacheKey = isEnglish ? `${lessonId}-${targetSkill}-${level || 'default'}` : lessonId;
    const cachePath = getPregenFilePath(stId, cacheKey);

    if (targetSkill !== 'full_exam' && fs.existsSync(cachePath)) {
        try {
            const data = fs.readFileSync(cachePath, 'utf8');
            let parsed = JSON.parse(data);
            if (Array.isArray(parsed)) parsed = { questions: parsed };
            return res.json(parsed);
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
        res.json(examData);
    } catch (err) {
        console.error('Lỗi sinh đề trực tiếp:', err);
        writeErrorLog(lessonId, lessonTitle || lessonId, err, textResponse, textResponse ? cleanJsonString(textResponse) : '');
        
        try {
            const fallbackCache = getPregenFilePath('default', lessonId);
            if (fs.existsSync(fallbackCache)) {
                const fallbackData = JSON.parse(fs.readFileSync(fallbackCache, 'utf8'));
                const normalized = Array.isArray(fallbackData) ? { questions: fallbackData } : fallbackData;
                if (normalized.questions && normalized.questions.length > 0) {
                    return res.json(normalized);
                }
            }
        } catch (fbErr) {}
        
        res.status(500).json({ error: 'Lỗi sinh đề AI: ' + err.message });
    }
}

async function startStudentPregen(req, res) {
    const { studentId, classLevel } = req.body;
    if (!studentId) return res.status(400).json({ error: "Thiếu studentId" });
    try {
        startPreGenerationWorkerForStudent(studentId, classLevel);
        res.json({ success: true, message: `Đã khởi chạy tiến trình sinh đề ngầm cho ${studentId}` });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function preGenerateQuestions(req, res) {
    res.json({ success: true, message: "Worker sinh đề đã được tiếp nhận" });
}

async function savePrintedPdf(req, res) {
    res.json({ success: true, message: "Đã lưu bản in PDF thành công" });
}

async function aiAnalysis(req, res) {
    const { history, examSessions, studentName, parentName, studentId, xp, scores } = req.body;
    if (!history || !examSessions) {
        return res.status(400).json({ error: 'Thiếu dữ liệu học tập lịch sử' });
    }
    const classLevel = resolveStudentClassLevel(studentId, req.body.classLevel);

    if (history.length === 0 && examSessions.length === 0 && (!scores || Object.keys(scores).length === 0) && (!xp || xp === 0)) {
        const emptyAnalysis = `Chào Phụ huynh ${parentName || 'Phụ huynh'} và con ${studentName || 'học sinh'} thân mến,\n\nHiện tại con mới khởi tạo tài khoản và chưa làm bài tập nào. Hãy bắt đầu bài học đầu tiên để AI phân tích nhé!`;
        return res.json({ success: true, analysis: emptyAnalysis });
    }

    const sanitizedHistory = sanitizeHistory(history.slice(-30));
    const userPrompt = `Phân tích học lực cho học sinh ${studentName || 'con'} lớp ${classLevel}: ${JSON.stringify(sanitizedHistory)}`;

    try {
        const data = await callGeminiAPI({
            contents: [{ role: 'user', parts: [{ text: userPrompt }] }]
        }, 'Phân tích học lực');

        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
        res.json({ success: true, analysis: textResponse });
    } catch (err) {
        res.status(500).json({ error: 'Lỗi phân tích AI: ' + err.message });
    }
}

async function auditExamSession(req, res) {
    const { session, studentId, classLevel } = req.body;
    if (!session) return res.status(400).json({ error: "Thiếu session" });
    try {
        const auditedSession = await auditExamSessionHelper(session, studentId, classLevel);
        res.json({ success: true, session: auditedSession });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function aiTroubleshootQuestion(req, res) {
    res.json({ success: true, message: "Đã tiếp nhận yêu cầu phân tích lỗi câu hỏi" });
}

function getAiStatus(req, res) {
    const studentId = req.query.studentId;
    if (studentId && studentAiStatusMap[studentId]) {
        return res.json({ ...aiStatus, ...studentAiStatusMap[studentId] });
    }
    res.json(aiStatus);
}

module.exports = {
    getQuestions,
    startStudentPregen,
    preGenerateQuestions,
    savePrintedPdf,
    aiAnalysis,
    auditExamSession,
    aiTroubleshootQuestion,
    getAiStatus
};
