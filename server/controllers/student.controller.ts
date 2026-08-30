/**
 * STUDENT CONTROLLER
 * Xử lý thông tin học sinh, tiến trình làm bài, từ vựng, chuyên đề tự chọn, token tablet và chat
 */
import { Request, Response } from 'express';
import { 
    dbGetStudentProgress, 
    dbSaveStudentProgress, 
    dbDeleteStudentProgress, 
    dbGetProgress, 
    dbSaveProgress, 
    dbGetSetting, 
    allQuery, 
    runQuery, 
    getQuery, 
    SYSTEM_STUDENTS 
} from '../db/database';
import { 
    syncStudentProgressToFirebase, 
    FIREBASE_RTDB_URL 
} from '../services/firebase.service';
import { auditExamSessionHelper } from '../services/gemini.service';

const APP_VERSION = '13.31';

export async function getStudentInfo(req: Request, res: Response): Promise<void> {
    const studentId = (req.query.studentId as string) || 'std_htsj4gbmo';
    try {
        const row: any = await getQuery("SELECT state_json FROM student_progress WHERE student_id = ?", [studentId]);
        let state: any = null;
        if (row && row.state_json) {
            try { state = JSON.parse(row.state_json); } catch(e) {}
        }
        res.json({ success: true, studentId, state });
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
        let progress: any = null;
        if (studentId) {
            progress = await dbGetStudentProgress(studentId);
        } else if (classLevel) {
            progress = await dbGetProgress(classLevel);
        }
        res.json(progress || {});
    } catch (e: any) {
        console.error("Lỗi load progress từ DB:", e);
        res.status(500).json({ error: e.message });
    }
}

export async function saveProgress(req: Request, res: Response): Promise<any> {
    const { classLevel, studentId, state, studentName } = req.body;
    if ((!classLevel && !studentId) || !state) {
        return res.status(400).json({ error: "Thiếu classLevel/studentId hoặc state" });
    }
    try {
        if (state.examSessions && Array.isArray(state.examSessions)) {
            for (let i = 0; i < state.examSessions.length; i++) {
                const sess = state.examSessions[i];
                if (sess && sess.isAudited !== true) {
                    state.examSessions[i] = await auditExamSessionHelper(sess, studentId, classLevel);
                    state.examSessions[i].isAudited = true;
                }
            }
        }

        if (studentId) {
            await dbSaveStudentProgress(studentId, state, studentName);
            syncStudentProgressToFirebase(studentId, state, studentName).catch(err => {
                console.error("[FirebaseSync] Lỗi chạy ngầm đồng bộ:", err);
            });
        } else {
            await dbSaveProgress(classLevel, state);
        }
        res.json({ success: true, message: "Đã lưu tiến độ thành công!", state });
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
        await dbDeleteStudentProgress(studentId);
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
        const config: any = await dbGetSetting('config').catch(() => null);
        const studentsList: any[] = (config && config.students) || [];
        const studentConf = studentsList.find((s: any) => s.id === studentId);
        const sysConf = SYSTEM_STUDENTS.find(s => s.id === studentId);
        
        let studentName = studentConf ? studentConf.name : (sysConf ? sysConf.name : "Học sinh");
        if ((!studentName || studentName === 'Học sinh') && sysConf) {
            studentName = sysConf.name;
        }
        const actualClassLevel = studentConf ? studentConf.classLevel : (sysConf ? sysConf.classLevel : (classLevel || "6"));

        const payload = {
            studentId: studentId,
            studentName: studentName,
            classLevel: actualClassLevel,
            lastHeartbeat: new Date().toISOString(),
            appVersion: `v${APP_VERSION}`
        };

        const url = `${FIREBASE_RTDB_URL}leaderboard/${studentId}.json`;
        await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(err => console.warn(`[HeartbeatSync] Lỗi Firebase: ${err.message}`));
        
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function getLeaderboard(req: Request, res: Response): Promise<void> {
    const subject = (req.query.subject as string) || 'english';
    const classLevel = req.query.classLevel as string;

    try {
        const url = `${FIREBASE_RTDB_URL}leaderboard.json`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Firebase RTDB status ${response.status}`);
        const data = await response.json();
        
        let list: any[] = [];
        if (data && typeof data === 'object') {
            list = Object.values(data);
        }

        if (classLevel) {
            list = list.filter(item => String(item.classLevel) === String(classLevel));
        }

        if (subject === 'math') {
            list.sort((a, b) => (b.mathXp || 0) - (a.mathXp || 0));
        } else {
            list.sort((a, b) => (b.englishXp || 0) - (a.englishXp || 0));
        }

        res.json({ success: true, leaderboard: list });
    } catch (err: any) {
        console.warn("Lỗi đọc Leaderboard từ Firebase RTDB, fallback cache:", err.message);
        res.json({ success: true, leaderboard: [] });
    }
}

export async function getCustomTopics(req: Request, res: Response): Promise<void> {
    const studentId = req.query.studentId as string;
    try {
        const sql = studentId 
            ? "SELECT * FROM custom_topics WHERE student_id = ? ORDER BY created_at DESC"
            : "SELECT * FROM custom_topics ORDER BY created_at DESC";
        const params = studentId ? [studentId] : [];
        const rows = await allQuery(sql, params);
        res.json({ success: true, topics: rows });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function deleteCustomTopic(req: Request, res: Response): Promise<any> {
    const { topicId } = req.body;
    if (!topicId) return res.status(400).json({ error: "Thiếu topicId" });
    try {
        await runQuery("DELETE FROM custom_topics WHERE id = ?", [topicId]);
        await runQuery("DELETE FROM custom_vocabulary WHERE topic_id = ?", [topicId]);
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function getCustomVocabulary(req: Request, res: Response): Promise<void> {
    const { studentId, topicId } = req.query as { studentId?: string; topicId?: string };
    try {
        let sql = "SELECT * FROM custom_vocabulary WHERE 1=1";
        const params: any[] = [];
        if (studentId) {
            sql += " AND student_id = ?";
            params.push(studentId);
        }
        if (topicId) {
            sql += " AND topic_id = ?";
            params.push(topicId);
        }
        sql += " ORDER BY created_at DESC";
        const rows = await allQuery(sql, params);
        res.json({ success: true, words: rows });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function deleteCustomVocabularyWord(req: Request, res: Response): Promise<any> {
    const { wordId } = req.body;
    if (!wordId) return res.status(400).json({ error: "Thiếu wordId" });
    try {
        await runQuery("DELETE FROM custom_vocabulary WHERE id = ?", [wordId]);
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
        const topicId = 'custom-t-' + Date.now();
        await runQuery("INSERT INTO custom_topics (id, student_id, title) VALUES (?, ?, ?)", [topicId, studentId, topicTitle || "Chủ đề tự chọn"]);
        
        const lines: string[] = rawText.split(/\r?\n/).filter((l: string) => l.trim());
        for (const line of lines) {
            const parts = line.split(/[-:]/).map(p => p.trim());
            const word = parts[0] || "";
            const translation = parts[1] || "";
            if (word) {
                await runQuery(
                    "INSERT INTO custom_vocabulary (student_id, word, translation, topic_id) VALUES (?, ?, ?, ?)",
                    [studentId, word, translation, topicId]
                );
            }
        }
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
        const row: any = await getQuery(
            "SELECT id, box_level, review_count FROM custom_vocabulary WHERE student_id = ? AND LOWER(word) = LOWER(?)",
            [studentId, word.trim()]
        );
        if (!row) {
            return res.json({ success: true, message: "Từ vựng không tồn tại trong kho tự nạp" });
        }

        let newBoxLevel = isCorrect ? Math.min(5, row.box_level + 1) : 1;
        let intervalDays = [1, 2, 4, 7, 15, 30][newBoxLevel] || 1;
        const status = newBoxLevel === 5 ? 'mastered' : 'reviewing';
        const reviewCount = (row.review_count || 0) + 1;

        await runQuery(
            `UPDATE custom_vocabulary 
             SET box_level = ?, status = ?, review_count = ?, last_reviewed = datetime('now'), next_review_due = datetime('now', '+' || ? || ' days') 
             WHERE id = ?`,
            [newBoxLevel, status, reviewCount, intervalDays, row.id]
        );
        res.json({ success: true, word: word.trim(), newBoxLevel, status });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function generateTabletToken(req: Request, res: Response): Promise<any> {
    const { studentId, minutes } = req.body;
    if (!studentId || !minutes) return res.status(400).json({ error: "Thiếu studentId hoặc minutes" });
    try {
        const token = Math.floor(100000 + Math.random() * 900000).toString();
        const createdAt = new Date().toISOString();
        await runQuery(
            "INSERT INTO tablet_tokens (token, student_id, minutes, status, created_at) VALUES (?, ?, ?, ?, ?)",
            [token, studentId, minutes, "unused", createdAt]
        );
        res.json({ success: true, token, minutes });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function getTabletTokens(req: Request, res: Response): Promise<any> {
    const studentId = req.query.studentId as string;
    if (!studentId) return res.status(400).json({ error: "Thiếu studentId" });
    try {
        const rows = await allQuery("SELECT * FROM tablet_tokens WHERE student_id = ? ORDER BY created_at DESC", [studentId]);
        res.json(rows);
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function verifyTabletToken(req: Request, res: Response): Promise<any> {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Thiếu token" });
    try {
        const row: any = await getQuery("SELECT * FROM tablet_tokens WHERE token = ?", [token]);
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
        const row: any = await getQuery("SELECT * FROM tablet_tokens WHERE token = ?", [token]);
        if (!row) return res.status(404).json({ success: false, error: "Mã không tồn tại!" });
        const activatedAt = new Date().toISOString();
        const expiresAt = new Date(Date.now() + row.minutes * 60 * 1000).toISOString();
        await runQuery("UPDATE tablet_tokens SET status = 'active', activated_at = ?, expires_at = ? WHERE token = ?", [activatedAt, expiresAt, token]);
        res.json({ success: true, expiresAt });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function useTabletToken(req: Request, res: Response): Promise<any> {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Thiếu token" });
    try {
        await runQuery("UPDATE tablet_tokens SET status = 'used' WHERE token = ?", [token]);
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function sendChatMessage(req: Request, res: Response): Promise<any> {
    const { senderId, senderName, receiverId, text } = req.body;
    if (!senderId || !receiverId || !text) return res.status(400).json({ error: "Thiếu tham số bắt buộc" });
    try {
        const roomId = [senderId, receiverId].sort().join("_");
        const payload = { senderId, senderName: senderName || "Học sinh", text, timestamp: Date.now(), appVersion: `v${APP_VERSION}` };
        const url = `${FIREBASE_RTDB_URL}chats/${roomId}.json`;
        const fbRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const resultData: any = await fbRes.json();
        res.json({ success: true, messageId: resultData.name, payload });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function getChatMessages(req: Request, res: Response): Promise<any> {
    const roomId = req.query.roomId as string;
    if (!roomId) return res.status(400).json({ error: "Thiếu roomId" });
    try {
        const url = `${FIREBASE_RTDB_URL}chats/${roomId}.json`;
        const fbRes = await fetch(url);
        const data = await fbRes.json();
        let list: any[] = data && typeof data === 'object' ? Object.values(data) : [];
        list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        res.json({ success: true, messages: list });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function getChatNotifications(req: Request, res: Response): Promise<any> {
    const studentId = req.query.studentId as string;
    if (!studentId) return res.status(400).json({ error: "Thiếu studentId" });
    try {
        const url = `${FIREBASE_RTDB_URL}notifications/${studentId}.json`;
        const fbRes = await fetch(url);
        const data = await fbRes.json();
        res.json({ success: true, notifications: data || {} });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}

export async function clearChatNotification(req: Request, res: Response): Promise<any> {
    const { studentId, senderId } = req.body;
    if (!studentId || !senderId) return res.status(400).json({ error: "Thiếu studentId hoặc senderId" });
    try {
        const url = `${FIREBASE_RTDB_URL}notifications/${studentId}/${senderId}.json`;
        await fetch(url, { method: 'DELETE' });
        res.json({ success: true });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
}
