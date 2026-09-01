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

export const APP_VERSION = '14.7';

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

/**
 * MINIMAL SAFETY OVERWRITE GUARD (STEP 5B)
 * Bảo vệ chống hạ cấp dữ liệu học tập có thẩm quyền khi nhận payload rỗng/thiếu từ client.
 */
export function applyMinimalSafetyGuard(existingState: any, incomingState: any): any {
    if (!existingState || typeof existingState !== 'object') {
        return incomingState;
    }
    if (!incomingState || typeof incomingState !== 'object') {
        return existingState;
    }

    const guarded = { ...existingState, ...incomingState };

    const mergeMaxObject = (o1: any, o2: any) => {
        const res = { ...(o1 || {}), ...(o2 || {}) };
        const allKeys = new Set([...Object.keys(o1 || {}), ...Object.keys(o2 || {})]);
        for (const k of allKeys) {
            const v1 = (o1 && typeof o1[k] === 'number') ? o1[k] : 0;
            const v2 = (o2 && typeof o2[k] === 'number') ? o2[k] : 0;
            res[k] = Math.max(v1, v2);
        }
        return res;
    };

    const unionArray = (a1: any[], a2: any[]) => Array.from(new Set([...(a1 || []), ...(a2 || [])]));

    // 1. Điểm số bài học & dạng bài (Monotonic Max)
    guarded.scores = mergeMaxObject(existingState.scores, incomingState.scores);
    guarded.subtopicScores = mergeMaxObject(existingState.subtopicScores, incomingState.subtopicScores);
    guarded.levelScores = mergeMaxObject(existingState.levelScores, incomingState.levelScores);

    // 2. Tiến trình hoàn thành (Union Set)
    guarded.completedSubtopics = unionArray(existingState.completedSubtopics, incomingState.completedSubtopics);
    guarded.completedLessonTheory = unionArray(existingState.completedLessonTheory, incomingState.completedLessonTheory);
    guarded.badges = unionArray(existingState.badges, incomingState.badges);
    guarded.goldBadges = unionArray(existingState.goldBadges, incomingState.goldBadges);

    // 3. Bảo vệ chống sập XP (XP Total Collapse Protection)
    const exXp = Math.max(existingState.xp || 0, existingState._sharedXp || 0);
    const inXp = Math.max(incomingState.xp || 0, incomingState._sharedXp || 0);
    const maxXp = Math.max(exXp, inXp);
    guarded.xp = maxXp;
    guarded._sharedXp = maxXp;
    if (incomingState.englishXp !== undefined || existingState.englishXp !== undefined) {
        guarded.englishXp = Math.max(existingState.englishXp || 0, incomingState.englishXp || 0, maxXp);
    }

    // 4. Lịch sử làm bài (History snapshot preservation)
    if ((!incomingState.history || incomingState.history.length === 0) && Array.isArray(existingState.history) && existingState.history.length > 0) {
        guarded.history = existingState.history;
    } else if (Array.isArray(incomingState.history) && incomingState.history.length > 0) {
        if (Array.isArray(existingState.history) && existingState.history.length > 0) {
            const inSet = new Set(incomingState.history.map((h: any) => JSON.stringify(h)));
            const missingOld = existingState.history.filter((h: any) => !inSet.has(JSON.stringify(h)));
            guarded.history = [...missingOld, ...incomingState.history].slice(-200);
        } else {
            guarded.history = incomingState.history;
        }
    }

    // 5. Phiên thi trong state (State-level Exam Sessions preservation)
    if ((!incomingState.examSessions || incomingState.examSessions.length === 0) && Array.isArray(existingState.examSessions) && existingState.examSessions.length > 0) {
        guarded.examSessions = existingState.examSessions;
    } else if (Array.isArray(incomingState.examSessions) && Array.isArray(existingState.examSessions)) {
        const inIds = new Set(incomingState.examSessions.map((s: any) => s.id || s.created_at || JSON.stringify(s)));
        const missingOld = existingState.examSessions.filter((s: any) => !inIds.has(s.id || s.created_at || JSON.stringify(s)));
        guarded.examSessions = [...missingOld, ...incomingState.examSessions].slice(-100);
    }

    // 6. Phân lập và bảo toàn môn học (Subject Isolation: Math & English)
    if (existingState.subjects || incomingState.subjects) {
        const exSubj = existingState.subjects || {};
        const inSubj = incomingState.subjects || {};
        guarded.subjects = { ...exSubj, ...inSubj };

        // Bảo vệ môn Toán
        const exMath = exSubj.math || {};
        const inMath = inSubj.math || {};
        guarded.subjects.math = {
            ...exMath,
            ...inMath,
            scores: mergeMaxObject(exMath.scores, inMath.scores || (inMath.scores ? {} : guarded.scores)),
            completedSubtopics: unionArray(exMath.completedSubtopics, inMath.completedSubtopics),
            subtopicScores: mergeMaxObject(exMath.subtopicScores, inMath.subtopicScores),
            completedLessonTheory: unionArray(exMath.completedLessonTheory, inMath.completedLessonTheory),
            examSessions: (inMath.examSessions && inMath.examSessions.length > 0)
                ? inMath.examSessions
                : (exMath.examSessions || [])
        };

        // Bảo vệ môn Tiếng Anh
        const exEng = exSubj.english || {};
        const inEng = inSubj.english || {};
        guarded.subjects.english = {
            ...exEng,
            ...inEng,
            scores: mergeMaxObject(exEng.scores, inEng.scores),
            completedSubtopics: unionArray(exEng.completedSubtopics, inEng.completedSubtopics),
            subtopicScores: mergeMaxObject(exEng.subtopicScores, inEng.subtopicScores),
            completedLessonTheory: unionArray(exEng.completedLessonTheory, inEng.completedLessonTheory),
            skillScores: mergeMaxObject(exEng.skillScores, inEng.skillScores),
            weakVocabulary: unionArray(exEng.weakVocabulary, inEng.weakVocabulary),
            examSessions: (inEng.examSessions && inEng.examSessions.length > 0)
                ? inEng.examSessions
                : (exEng.examSessions || [])
        };
    }

    return guarded;
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
        // Đọc trạng thái hiện hữu trong CSDL để áp dụng Minimal Safety Guard
        const existingProgress = await dbGetStudentProgress(studentId).catch(() => null);
        const guardedState = existingProgress ? applyMinimalSafetyGuard(existingProgress, state) : state;

        // Thực hiện ghi có điều kiện OCC với state đã được bảo vệ
        const occResult = await dbSaveStudentProgressOCC(studentId, guardedState, baseRevision);
        if (occResult.conflict || !occResult.success) {
            return {
                state: guardedState,
                conflict: true,
                currentRevision: occResult.currentRevision
            };
        }
        newRevision = occResult.newRevision;

        // M03: Lưu exam sessions vào bảng exam_sessions độc lập
        if (guardedState.examSessions && Array.isArray(guardedState.examSessions)) {
            for (const sess of guardedState.examSessions) {
                if (sess && sess.lessonId) {
                    dbSaveExamSessionRecord(studentId, sess.subject || 'math', sess).catch(err => {
                        console.warn("[ExamSession] Ghi nhận phiên làm bài lỗi:", err.message);
                    });
                }
            }
        }

        // 3. Đồng bộ ngầm lên Firebase
        syncStudentProgressToFirebase(studentId, guardedState, studentName).catch(err => {
            console.error("[FirebaseSync] Lỗi chạy ngầm đồng bộ:", err);
        });

        return { state: guardedState, revision: newRevision };
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
