/**
 * QUIZ CONTROLLER
 * Tầng giao tiếp HTTP cho đề thi & AI: trích xuất params/body, gọi Quiz Service và phản hồi JSON
 */
import { Request, Response } from 'express';
import * as quizService from '../services/quiz.service';

export async function getQuestions(req: Request, res: Response): Promise<any> {
    const { lessonId: rawLessonId, lessonTitle, classLevel, studentId, skill, subject, category, level, grammars, detail } = req.query as Record<string, string>;
    const lessonId = (rawLessonId && rawLessonId.trim()) ? rawLessonId.trim() : (detail || (category ? `eng6-${category}` : null));
    
    if (!lessonId) {
        return res.status(400).json({ error: 'Thiếu tham số lessonId' });
    }

    try {
        const examData = await quizService.fetchOrGenerateQuestions({
            lessonId,
            lessonTitle,
            classLevel,
            studentId,
            skill,
            subject,
            category,
            level,
            grammars
        });
        res.json(examData);
    } catch (err: any) {
        if (err.message === "Chuyên đề không có từ vựng nào") {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: err.message });
    }
}

export async function startStudentPregen(req: Request, res: Response): Promise<any> {
    const { studentId, classLevel } = req.body;
    if (!studentId) return res.status(400).json({ error: "Thiếu studentId" });
    try {
        quizService.triggerStudentPregen(studentId, classLevel);
        res.json({ success: true, message: `Đã khởi chạy tiến trình sinh đề ngầm cho ${studentId}` });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function preGenerateQuestions(req: Request, res: Response): Promise<void> {
    res.json({ success: true, message: "Worker sinh đề đã được tiếp nhận" });
}

export async function savePrintedPdf(req: Request, res: Response): Promise<void> {
    res.json({ success: true, message: "Đã lưu bản in PDF thành công" });
}

export async function aiAnalysis(req: Request, res: Response): Promise<any> {
    const { history, examSessions, studentName, parentName, studentId, xp, scores, classLevel } = req.body;
    if (!history || !examSessions) {
        return res.status(400).json({ error: 'Thiếu dữ liệu học tập lịch sử' });
    }

    try {
        const analysis = await quizService.performAiAnalysis({
            history,
            examSessions,
            studentName,
            parentName,
            studentId,
            classLevel,
            xp,
            scores
        });
        res.json({ success: true, analysis });
    } catch (err: any) {
        res.status(500).json({ error: 'Lỗi phân tích AI: ' + err.message });
    }
}

export async function auditExamSession(req: Request, res: Response): Promise<any> {
    const { session, studentId, classLevel } = req.body;
    if (!session) return res.status(400).json({ error: "Thiếu session" });
    try {
        const auditedSession = await quizService.auditExamSession(session, studentId, classLevel);
        res.json({ success: true, session: auditedSession });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function aiTroubleshootQuestion(req: Request, res: Response): Promise<void> {
    res.json({ success: true, message: "Đã tiếp nhận yêu cầu phân tích lỗi câu hỏi" });
}

export function getAiStatus(req: Request, res: Response): void {
    const studentId = req.query.studentId as string;
    const status = quizService.getAiStatusInfo(studentId);
    res.json(status);
}
