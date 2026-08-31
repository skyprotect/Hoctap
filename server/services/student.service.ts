/**
 * STUDENT APPLICATION SERVICE
 * Điều phối logic nghiệp vụ về tiến trình học tập, SRS từ vựng, Token tablet, Chat và Leaderboard
 */
import { 
    dbGetStudentProgress, 
    dbGetStudentProgressWithRevision,
    dbSaveStudentProgress, 
    dbSaveStudentProgressOCC,
    dbDeleteStudentProgress, 
    dbGetProgress, 
    dbSaveProgress, 
    dbGetConfig,
    dbGetSetting, 
    dbSaveExamSessionRecord,
    allQuery, 
    runQuery, 
    getQuery, 
    SYSTEM_STUDENTS 
} from '../db/database';
import { 
    syncStudentProgressToFirebase, 
    FIREBASE_RTDB_URL 
} from './firebase.service';
import { auditExamSessionHelper } from './gemini.service';
import { StudentProgress, ExamSession } from '../types';

export const APP_VERSION = '13.99';

// ============================================================================
// 1. TIẾN TRÌNH HỌC TẬP & THÔNG TIN HỌC SINH (PROGRESS & STUDENT INFO)
// ============================================================================

export async function getStudentInfo(studentId: string = 'std_htsj4gbmo'): Promise<{ studentId: string; state: any }> {
    const row: any = await getQuery("SELECT state_json FROM student_progress WHERE student_id = ?", [studentId]);
    let state: any = null;
    if (row && row.state_json) {
        try { state = JSON.parse(row.state_json); } catch (e) {}
    }
    return { studentId, state };
}

export async function loadProgress(params: { classLevel?: string; studentId?: string }): Promise<any> {
    const { classLevel, studentId } = params;
    let progress: any = null;
    if (studentId) {
        progress = await dbGetStudentProgress(studentId);
    } else if (classLevel) {
        progress = await dbGetProgress(classLevel);
    }
    return progress || {};
}

export async function saveProgress(params: {
    classLevel?: string;
    studentId?: string;
    studentName?: string;
    baseRevision?: number | null;
    state: any;
}): Promise<{ state: any; revision?: number; conflict?: boolean; currentRevision?: number }> {
    const { classLevel, studentId, studentName, baseRevision, state } = params;

    // 1. Thẩm định các exam sessions chưa được thẩm định
    if (state.examSessions && Array.isArray(state.examSessions)) {
        for (let i = 0; i < state.examSessions.length; i++) {
            const sess = state.examSessions[i];
            if (sess && sess.isAudited !== true) {
                state.examSessions[i] = await auditExamSessionHelper(sess, studentId, classLevel);
                state.examSessions[i].isAudited = true;
            }
        }
    }

    // 2. Lưu vào CSDL cục bộ
    let newRevision: number | undefined = undefined;
    if (studentId) {
        // Thực hiện ghi có điều kiện OCC
        const occResult = await dbSaveStudentProgressOCC(studentId, state, baseRevision);
        if (occResult.conflict || !occResult.success) {
            return {
                state,
                conflict: true,
                currentRevision: occResult.currentRevision
            };
        }
        newRevision = occResult.newRevision;

        // M03: Lưu exam sessions vào bảng exam_sessions độc lập
        if (state.examSessions && Array.isArray(state.examSessions)) {
            for (const sess of state.examSessions) {
                if (sess && sess.lessonId) {
                    dbSaveExamSessionRecord(studentId, sess.subject || 'math', sess).catch(err => {
                        console.warn("[ExamSession] Ghi nhận phiên làm bài lỗi:", err.message);
                    });
                }
            }
        }

        // 3. Đồng bộ ngầm lên Firebase
        syncStudentProgressToFirebase(studentId, state, studentName).catch(err => {
            console.error("[FirebaseSync] Lỗi chạy ngầm đồng bộ:", err);
        });
    } else if (classLevel) {
        await dbSaveProgress(classLevel, state);
    }

    return { state, revision: newRevision };
}

export async function deleteStudentProgress(studentId: string): Promise<void> {
    await dbDeleteStudentProgress(studentId);
}

export async function heartbeat(studentId: string, classLevel?: string): Promise<void> {
    const config: any = await dbGetConfig().catch(() => null);
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
}

export async function getLeaderboard(params: { subject?: string; classLevel?: string }): Promise<any[]> {
    const subject = params.subject || 'english';
    const classLevel = params.classLevel;

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

        return list;
    } catch (err: any) {
        console.warn("Lỗi đọc Leaderboard từ Firebase RTDB, fallback cache:", err.message);
        return [];
    }
}

// ============================================================================
// 2. CHỦ ĐỀ & TỪ VỰNG TỰ CHỌN (CUSTOM TOPICS & VOCABULARY SRS)
// ============================================================================

export async function getCustomTopics(studentId?: string): Promise<any[]> {
    const sql = studentId 
        ? "SELECT * FROM custom_topics WHERE student_id = ? ORDER BY created_at DESC"
        : "SELECT * FROM custom_topics ORDER BY created_at DESC";
    const params = studentId ? [studentId] : [];
    return allQuery(sql, params);
}

export async function deleteCustomTopic(topicId: string): Promise<void> {
    await runQuery("DELETE FROM custom_topics WHERE id = ?", [topicId]);
    await runQuery("DELETE FROM custom_vocabulary WHERE topic_id = ?", [topicId]);
}

export async function getCustomVocabulary(params: { studentId?: string; topicId?: string }): Promise<any[]> {
    const { studentId, topicId } = params;
    let sql = "SELECT * FROM custom_vocabulary WHERE 1=1";
    const sqlParams: any[] = [];
    if (studentId) {
        sql += " AND student_id = ?";
        sqlParams.push(studentId);
    }
    if (topicId) {
        sql += " AND topic_id = ?";
        sqlParams.push(topicId);
    }
    sql += " ORDER BY created_at DESC";
    return allQuery(sql, sqlParams);
}

export async function deleteCustomVocabularyWord(wordId: number | string): Promise<void> {
    await runQuery("DELETE FROM custom_vocabulary WHERE id = ?", [wordId]);
}

export async function addCustomVocabulary(params: {
    studentId: string;
    topicTitle?: string;
    rawText: string;
}): Promise<string> {
    const { studentId, topicTitle, rawText } = params;
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
    return topicId;
}

export async function reportCustomVocabularyResult(params: {
    studentId: string;
    word: string;
    isCorrect: boolean;
}): Promise<{ found: boolean; word?: string; newBoxLevel?: number; status?: string; message?: string }> {
    const { studentId, word, isCorrect } = params;
    const row: any = await getQuery(
        "SELECT id, box_level, review_count FROM custom_vocabulary WHERE student_id = ? AND LOWER(word) = LOWER(?)",
        [studentId, word.trim()]
    );
    if (!row) {
        return { found: false, message: "Từ vựng không tồn tại trong kho tự nạp" };
    }

    const newBoxLevel = isCorrect ? Math.min(5, row.box_level + 1) : 1;
    const intervalDays = [1, 2, 4, 7, 15, 30][newBoxLevel] || 1;
    const status = newBoxLevel === 5 ? 'mastered' : 'reviewing';
    const reviewCount = (row.review_count || 0) + 1;

    await runQuery(
        `UPDATE custom_vocabulary 
         SET box_level = ?, status = ?, review_count = ?, last_reviewed = datetime('now'), next_review_due = datetime('now', '+' || ? || ' days') 
         WHERE id = ?`,
        [newBoxLevel, status, reviewCount, intervalDays, row.id]
    );

    return { found: true, word: word.trim(), newBoxLevel, status };
}

// ============================================================================
// 3. TOKEN TABLET (TABLET TOKENS)
// ============================================================================

export async function generateTabletToken(studentId: string, minutes: number): Promise<string> {
    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const createdAt = new Date().toISOString();
    await runQuery(
        "INSERT INTO tablet_tokens (token, student_id, minutes, status, created_at) VALUES (?, ?, ?, ?, ?)",
        [token, studentId, minutes, "unused", createdAt]
    );
    return token;
}

export async function getTabletTokens(studentId: string): Promise<any[]> {
    return allQuery("SELECT * FROM tablet_tokens WHERE student_id = ? ORDER BY created_at DESC", [studentId]);
}

export async function verifyTabletToken(token: string): Promise<any | null> {
    const row: any = await getQuery("SELECT * FROM tablet_tokens WHERE token = ?", [token]);
    return row || null;
}

export async function activateTabletToken(token: string): Promise<{ success: boolean; expiresAt?: string; error?: string }> {
    const row: any = await getQuery("SELECT * FROM tablet_tokens WHERE token = ?", [token]);
    if (!row) return { success: false, error: "Mã không tồn tại!" };
    const activatedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + row.minutes * 60 * 1000).toISOString();
    await runQuery(
        "UPDATE tablet_tokens SET status = 'active', activated_at = ?, expires_at = ? WHERE token = ?",
        [activatedAt, expiresAt, token]
    );
    return { success: true, expiresAt };
}

export async function useTabletToken(token: string): Promise<void> {
    await runQuery("UPDATE tablet_tokens SET status = 'used' WHERE token = ?", [token]);
}

// ============================================================================
// 4. CHAT & THÔNG BÁO (CHAT & NOTIFICATIONS)
// ============================================================================

export async function sendChatMessage(params: {
    senderId: string;
    senderName?: string;
    receiverId: string;
    text: string;
}): Promise<{ messageId: string; payload: any }> {
    const { senderId, senderName, receiverId, text } = params;
    const roomId = [senderId, receiverId].sort().join("_");
    const payload = { senderId, senderName: senderName || "Học sinh", text, timestamp: Date.now(), appVersion: `v${APP_VERSION}` };
    const url = `${FIREBASE_RTDB_URL}chats/${roomId}.json`;
    const fbRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const resultData: any = await fbRes.json();
    return { messageId: resultData.name, payload };
}

export async function getChatMessages(roomId: string): Promise<any[]> {
    const url = `${FIREBASE_RTDB_URL}chats/${roomId}.json`;
    const fbRes = await fetch(url);
    const data = await fbRes.json();
    let list: any[] = data && typeof data === 'object' ? Object.values(data) : [];
    list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
    return list;
}

export async function getChatNotifications(studentId: string): Promise<any> {
    const url = `${FIREBASE_RTDB_URL}notifications/${studentId}.json`;
    const fbRes = await fetch(url);
    const data = await fbRes.json();
    return data || {};
}

export async function clearChatNotification(studentId: string, senderId: string): Promise<void> {
    const url = `${FIREBASE_RTDB_URL}notifications/${studentId}/${senderId}.json`;
    await fetch(url, { method: 'DELETE' });
}
