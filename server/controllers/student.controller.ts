/**
 * STUDENT CONTROLLER
 * Tầng giao tiếp HTTP: trích xuất params/body, kiểm tra tính hợp lệ HTTP và điều phối tầng Service
 */
import { Request, Response } from 'express';
import * as studentService from '../services/student.service';

// ============================================================================
// 1. TIẾN TRÌNH HỌC TẬP & THÔNG TIN HỌC SINH
// ============================================================================

export async function getStudentInfo(req: Request, res: Response): Promise<void> {
    const studentId = (req.query.studentId as string) || 'std_htsj4gbmo';
    try {
        const result = await studentService.getStudentInfo(studentId);
        res.json({ success: true, studentId: result.studentId, state: result.state });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export async function loadProgress(req: Request, res: Response): Promise<any> {
    const { classLevel, studentId } = req.query as { classLevel?: string; studentId?: string };
    if (!classLevel && !studentId) {
        return res.status(400).json({ error: "Thiếu classLevel hoặc studentId" });
    }
    try {
        const progress = await studentService.loadProgress({ classLevel, studentId });
        res.json(progress);
    } catch (e: any) {
        console.error("Lỗi load progress từ DB:", e);
        res.status(500).json({ error: e.message });
    }
}

export async function saveProgress(req: Request, res: Response): Promise<any> {
    const { classLevel, studentId, state, studentName, baseRevision: bodyBaseRevision } = req.body;
    if ((!classLevel && !studentId) || !state) {
        return res.status(400).json({ error: "Thiếu classLevel/studentId hoặc state" });
    }

    // Trích xuất baseRevision ưu tiên từ body.baseRevision hoặc fallback từ state._revision
    let baseRevision: number | null | undefined = undefined;
    if (typeof bodyBaseRevision === 'number') {
        baseRevision = bodyBaseRevision;
    } else if (state && typeof state._revision === 'number') {
        baseRevision = state._revision;
    }

    try {
        const result = await studentService.saveProgress({ classLevel, studentId, studentName, baseRevision, state });
        if (result.conflict) {
            return res.status(409).json({
                error: "Conflict: Stale revision",
                conflict: true,
                currentRevision: result.currentRevision
            });
        }
        res.json({
            success: true,
            message: "Đã lưu tiến độ thành công!",
            state: result.state,
            revision: result.revision
        });
    } catch (e: any) {
        console.error("Lỗi save progress vào DB:", e);
        res.status(500).json({ error: e.message });
    }
}

export async function deleteStudentProgress(req: Request, res: Response): Promise<any> {
    const { studentId } = req.body;
    if (!studentId) {
        return res.status(400).json({ error: "Thiếu studentId cần xóa" });
    }
    try {
        await studentService.deleteStudentProgress(studentId);
        res.json({ success: true, message: `Đã xóa tiến trình học tập của ${studentId}` });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function heartbeat(req: Request, res: Response): Promise<any> {
    const { studentId, classLevel } = req.body;
    if (!studentId) {
        return res.status(400).json({ error: "Thiếu studentId" });
    }
    try {
        await studentService.heartbeat(studentId, classLevel);
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function getLeaderboard(req: Request, res: Response): Promise<void> {
    const subject = (req.query.subject as string) || 'english';
    const classLevel = req.query.classLevel as string;
    try {
        const list = await studentService.getLeaderboard({ subject, classLevel });
        res.json({ success: true, leaderboard: list });
    } catch (err: any) {
        res.json({ success: true, leaderboard: [] });
    }
}

// ============================================================================
// 2. CHỦ ĐỀ VÀ TỪ VỰNG TỰ CHỌN
// ============================================================================

export async function getCustomTopics(req: Request, res: Response): Promise<void> {
    const studentId = req.query.studentId as string;
    try {
        const rows = await studentService.getCustomTopics(studentId);
        res.json({ success: true, topics: rows });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function deleteCustomTopic(req: Request, res: Response): Promise<any> {
    const { topicId } = req.body;
    if (!topicId) return res.status(400).json({ error: "Thiếu topicId" });
    try {
        await studentService.deleteCustomTopic(topicId);
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function getCustomVocabulary(req: Request, res: Response): Promise<void> {
    const { studentId, topicId } = req.query as { studentId?: string; topicId?: string };
    try {
        const rows = await studentService.getCustomVocabulary({ studentId, topicId });
        res.json({ success: true, words: rows });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function deleteCustomVocabularyWord(req: Request, res: Response): Promise<any> {
    const { wordId } = req.body;
    if (!wordId) return res.status(400).json({ error: "Thiếu wordId" });
    try {
        await studentService.deleteCustomVocabularyWord(wordId);
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function addCustomVocabulary(req: Request, res: Response): Promise<any> {
    const { studentId, topicTitle, rawText } = req.body;
    if (!studentId || !rawText) {
        return res.status(400).json({ error: "Thiếu studentId hoặc rawText" });
    }
    try {
        const topicId = await studentService.addCustomVocabulary({ studentId, topicTitle, rawText });
        res.json({ success: true, topicId });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function reportCustomVocabularyResult(req: Request, res: Response): Promise<any> {
    const { studentId, word, isCorrect } = req.body;
    if (!studentId || !word) {
        return res.status(400).json({ error: "Thiếu studentId hoặc word" });
    }
    try {
        const result = await studentService.reportCustomVocabularyResult({ studentId, word, isCorrect });
        if (!result.found) {
            return res.json({ success: true, message: result.message });
        }
        res.json({ success: true, word: result.word, newBoxLevel: result.newBoxLevel, status: result.status });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

// ============================================================================
// 3. TOKEN TABLET
// ============================================================================

export async function generateTabletToken(req: Request, res: Response): Promise<any> {
    const { studentId, minutes } = req.body;
    if (!studentId || !minutes) return res.status(400).json({ error: "Thiếu studentId hoặc minutes" });
    try {
        const token = await studentService.generateTabletToken(studentId, minutes);
        res.json({ success: true, token, minutes });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function getTabletTokens(req: Request, res: Response): Promise<any> {
    const studentId = req.query.studentId as string;
    if (!studentId) return res.status(400).json({ error: "Thiếu studentId" });
    try {
        const rows = await studentService.getTabletTokens(studentId);
        res.json(rows);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function verifyTabletToken(req: Request, res: Response): Promise<any> {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Thiếu token" });
    try {
        const row = await studentService.verifyTabletToken(token);
        if (!row) return res.status(404).json({ success: false, error: "Mã bảo mật không tồn tại!" });
        res.json({ success: true, ...row });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function activateTabletToken(req: Request, res: Response): Promise<any> {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Thiếu token" });
    try {
        const result = await studentService.activateTabletToken(token);
        if (!result.success) return res.status(404).json({ success: false, error: result.error });
        res.json({ success: true, expiresAt: result.expiresAt });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function useTabletToken(req: Request, res: Response): Promise<any> {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Thiếu token" });
    try {
        await studentService.useTabletToken(token);
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

// ============================================================================
// 4. CHAT & THÔNG BÁO
// ============================================================================

export async function sendChatMessage(req: Request, res: Response): Promise<any> {
    const { senderId, senderName, receiverId, text } = req.body;
    if (!senderId || !receiverId || !text) return res.status(400).json({ error: "Thiếu tham số bắt buộc" });
    try {
        const result = await studentService.sendChatMessage({ senderId, senderName, receiverId, text });
        res.json({ success: true, messageId: result.messageId, payload: result.payload });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function getChatMessages(req: Request, res: Response): Promise<any> {
    const roomId = req.query.roomId as string;
    if (!roomId) return res.status(400).json({ error: "Thiếu roomId" });
    try {
        const messages = await studentService.getChatMessages(roomId);
        res.json({ success: true, messages });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function getChatNotifications(req: Request, res: Response): Promise<any> {
    const studentId = req.query.studentId as string;
    if (!studentId) return res.status(400).json({ error: "Thiếu studentId" });
    try {
        const notifications = await studentService.getChatNotifications(studentId);
        res.json({ success: true, notifications });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function clearChatNotification(req: Request, res: Response): Promise<any> {
    const { studentId, senderId } = req.body;
    if (!studentId || !senderId) return res.status(400).json({ error: "Thiếu studentId hoặc senderId" });
    try {
        await studentService.clearChatNotification(studentId, senderId);
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}
