/**
 * STUDENT CONTROLLER
 * Xử lý thông tin học sinh, tiến trình làm bài, từ vựng, chuyên đề tự chọn, token tablet và chat
 */
const { 
    dbGetStudentProgress, 
    dbSaveStudentProgress, 
    dbDeleteStudentProgress, 
    dbGetProgress, 
    dbSaveProgress, 
    dbGetSetting, 
    allQuery, 
    runQuery, 
    getQuery, 
    db,
    SYSTEM_STUDENTS 
} = require('../db/database');
const { 
    syncStudentProgressToFirebase, 
    FIREBASE_RTDB_URL 
} = require('../services/firebase.service');
const { auditExamSessionHelper } = require('../services/gemini.service');

const APP_VERSION = '13.30';

async function getStudentInfo(req, res) {
    const studentId = req.query.studentId || 'std_htsj4gbmo';
    try {
        const row = await getQuery("SELECT state_json FROM student_progress WHERE student_id = ?", [studentId]);
        let state = null;
        if (row && row.state_json) {
            try { state = JSON.parse(row.state_json); } catch(e) {}
        }
        res.json({ success: true, studentId, state });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function loadProgress(req, res) {
    const { classLevel, studentId } = req.query;
    if (!classLevel && !studentId) {
        return res.status(400).json({ error: "Thiếu classLevel hoặc studentId" });
    }
    try {
        let progress = null;
        if (studentId) {
            progress = await dbGetStudentProgress(studentId);
        } else {
            progress = await dbGetProgress(classLevel);
        }
        res.json(progress || {});
    } catch (e) {
        console.error("Lỗi load progress từ DB:", e);
        res.status(500).json({ error: e.message });
    }
}

async function saveProgress(req, res) {
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
    } catch (e) {
        console.error("Lỗi save progress vào DB:", e);
        res.status(500).json({ error: e.message });
    }
}

async function deleteStudentProgress(req, res) {
    const { studentId } = req.body;
    if (!studentId) {
        return res.status(400).json({ error: "Thiếu studentId cần xóa" });
    }
    try {
        await dbDeleteStudentProgress(studentId);
        res.json({ success: true, message: `Đã xóa tiến trình học tập của ${studentId}` });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function heartbeat(req, res) {
    const { studentId, classLevel } = req.body;
    if (!studentId) {
        return res.status(400).json({ error: "Thiếu studentId" });
    }
    try {
        const config = await dbGetSetting('config').catch(() => null);
        const studentsList = (config && config.students) || [];
        const studentConf = studentsList.find(s => s.id === studentId);
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
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function getLeaderboard(req, res) {
    const subject = req.query.subject || 'english';
    const classLevel = req.query.classLevel;

    try {
        const url = `${FIREBASE_RTDB_URL}leaderboard.json`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Firebase RTDB status ${response.status}`);
        const data = await response.json();
        
        let list = [];
        if (data) {
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
    } catch (err) {
        console.warn("Lỗi đọc Leaderboard từ Firebase RTDB, fallback cache:", err.message);
        res.json({ success: true, leaderboard: [] });
    }
}

async function getCustomTopics(req, res) {
    const { studentId } = req.query;
    try {
        const sql = studentId 
            ? "SELECT * FROM custom_topics WHERE student_id = ? ORDER BY created_at DESC"
            : "SELECT * FROM custom_topics ORDER BY created_at DESC";
        const params = studentId ? [studentId] : [];
        const rows = await allQuery(sql, params);
        res.json({ success: true, topics: rows });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function deleteCustomTopic(req, res) {
    const { topicId, studentId } = req.body;
    if (!topicId) return res.status(400).json({ error: "Thiếu topicId" });
    try {
        await runQuery("DELETE FROM custom_topics WHERE id = ?", [topicId]);
        await runQuery("DELETE FROM custom_vocabulary WHERE topic_id = ?", [topicId]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function getCustomVocabulary(req, res) {
    const { studentId, topicId } = req.query;
    try {
        let sql = "SELECT * FROM custom_vocabulary WHERE 1=1";
        const params = [];
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
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function deleteCustomVocabularyWord(req, res) {
    const { wordId } = req.body;
    if (!wordId) return res.status(400).json({ error: "Thiếu wordId" });
    try {
        await runQuery("DELETE FROM custom_vocabulary WHERE id = ?", [wordId]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function addCustomVocabulary(req, res) {
    const { studentId, topicTitle, rawText } = req.body;
    if (!studentId || !rawText) {
        return res.status(400).json({ error: "Thiếu studentId hoặc rawText" });
    }
    try {
        const topicId = 'custom-t-' + Date.now();
        await runQuery("INSERT INTO custom_topics (id, student_id, title) VALUES (?, ?, ?)", [topicId, studentId, topicTitle || "Chủ đề tự chọn"]);
        
        const lines = rawText.split(/\r?\n/).filter(l => l.trim());
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
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function reportCustomVocabularyResult(req, res) {
    const { studentId, word, isCorrect } = req.body;
    if (!studentId || !word) {
        return res.status(400).json({ error: "Thiếu studentId hoặc word" });
    }
    try {
        const row = await getQuery(
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
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function generateTabletToken(req, res) {
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
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function getTabletTokens(req, res) {
    const { studentId } = req.query;
    if (!studentId) return res.status(400).json({ error: "Thiếu studentId" });
    try {
        const rows = await allQuery("SELECT * FROM tablet_tokens WHERE student_id = ? ORDER BY created_at DESC", [studentId]);
        res.json(rows);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function verifyTabletToken(req, res) {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Thiếu token" });
    try {
        const row = await getQuery("SELECT * FROM tablet_tokens WHERE token = ?", [token]);
        if (!row) return res.status(404).json({ success: false, error: "Mã bảo mật không tồn tại!" });
        res.json({ success: true, ...row });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function activateTabletToken(req, res) {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Thiếu token" });
    try {
        const row = await getQuery("SELECT * FROM tablet_tokens WHERE token = ?", [token]);
        if (!row) return res.status(404).json({ success: false, error: "Mã không tồn tại!" });
        const activatedAt = new Date().toISOString();
        const expiresAt = new Date(Date.now() + row.minutes * 60 * 1000).toISOString();
        await runQuery("UPDATE tablet_tokens SET status = 'active', activated_at = ?, expires_at = ? WHERE token = ?", [activatedAt, expiresAt, token]);
        res.json({ success: true, expiresAt });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function useTabletToken(req, res) {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Thiếu token" });
    try {
        await runQuery("UPDATE tablet_tokens SET status = 'used' WHERE token = ?", [token]);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function sendChatMessage(req, res) {
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
        const resultData = await fbRes.json();
        res.json({ success: true, messageId: resultData.name, payload });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function getChatMessages(req, res) {
    const { roomId } = req.query;
    if (!roomId) return res.status(400).json({ error: "Thiếu roomId" });
    try {
        const url = `${FIREBASE_RTDB_URL}chats/${roomId}.json`;
        const fbRes = await fetch(url);
        const data = await fbRes.json();
        let list = data ? Object.values(data) : [];
        list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        res.json({ success: true, messages: list });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function getChatNotifications(req, res) {
    const { studentId } = req.query;
    if (!studentId) return res.status(400).json({ error: "Thiếu studentId" });
    try {
        const url = `${FIREBASE_RTDB_URL}notifications/${studentId}.json`;
        const fbRes = await fetch(url);
        const data = await fbRes.json();
        res.json({ success: true, notifications: data || {} });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function clearChatNotification(req, res) {
    const { studentId, senderId } = req.body;
    if (!studentId || !senderId) return res.status(400).json({ error: "Thiếu studentId hoặc senderId" });
    try {
        const url = `${FIREBASE_RTDB_URL}notifications/${studentId}/${senderId}.json`;
        await fetch(url, { method: 'DELETE' });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

module.exports = {
    getStudentInfo,
    loadProgress,
    saveProgress,
    deleteStudentProgress,
    heartbeat,
    getLeaderboard,
    getCustomTopics,
    deleteCustomTopic,
    getCustomVocabulary,
    deleteCustomVocabularyWord,
    addCustomVocabulary,
    reportCustomVocabularyResult,
    generateTabletToken,
    getTabletTokens,
    verifyTabletToken,
    activateTabletToken,
    useTabletToken,
    sendChatMessage,
    getChatMessages,
    getChatNotifications,
    clearChatNotification
};
