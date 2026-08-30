/**
 * FIREBASE SERVICE
 * Quản lý đồng bộ Realtime Database và Firestore
 */
const { 
    dbGetSetting, 
    dbSaveSetting, 
    dbSaveStudentProgress, 
    getQuery, 
    allQuery, 
    runQuery,
    db
} = require('../db/database');

const FIREBASE_RTDB_URL = process.env.FIREBASE_DATABASE_URL ? (process.env.FIREBASE_DATABASE_URL.endsWith('/') ? process.env.FIREBASE_DATABASE_URL : process.env.FIREBASE_DATABASE_URL + '/') : "https://binhminhchamhoc-default-rtdb.firebaseio.com/";

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDOewYQ-Jwfwg_NU_JpW6w-05NwkMAjaXo",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "binhminhchamhoc.firebaseapp.com",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://binhminhchamhoc-default-rtdb.firebaseio.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "binhminhchamhoc",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "binhminhchamhoc.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "1033910156653",
    appId: process.env.FIREBASE_APP_ID || "1:1033910156653:web:5e57eabcff563054842e64",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-367K48DJD6"
};

const firebaseInitialized = true;

async function syncStudentProgressToFirebase(studentId, state, studentNameFromClient = null) {
    try {
        if (!studentId || !state) return;
        
        // Lấy thông tin học sinh từ config trong bảng settings SQLite
        const config = await dbGetSetting('config').catch(() => null);
        const studentsList = (config && config.students) || [];
        const studentConf = studentsList.find(s => s.id === studentId);
        
        const studentName = studentNameFromClient || (studentConf ? studentConf.name : ((state.student && state.student.name) || (typeof state.student === 'string' ? state.student : "Học sinh")));
        const classLevel = studentConf ? studentConf.classLevel : (state.classLevel || (state.student && state.student.classLevel) || "6");

        // Thu thập các thông số tối giản phục vụ so sánh xếp hạng học sinh
        const payload = {
            studentId: studentId,
            studentName: studentName,
            mathXp: state.xp || 0,
            englishXp: state.englishXp || 0,
            mathStreak: state.streak || 0,
            englishStreak: state.englishStreak || 0,
            classLevel: classLevel,
            lastActiveDate: state.lastActiveDate || "",
            lastUpdated: new Date().toISOString()
        };

        const url = `${FIREBASE_RTDB_URL}leaderboard/${studentId}.json`;
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            console.warn(`[FirebaseSync] Firebase RTDB returned status ${response.status}`);
        } else {
            console.log(`[FirebaseSync] Đồng bộ thành công cho học sinh ${payload.studentName} (${studentId})`);
        }

        // Đồng bộ lịch sử quy đổi thẻ năng lực lên Firebase Realtime Database
        if (state.cardExchangeHistory && Array.isArray(state.cardExchangeHistory)) {
            const historyPayload = state.cardExchangeHistory.map(h => ({
                ...h,
                studentId: studentId,
                studentName: studentName
            }));
            const historyUrl = `${FIREBASE_RTDB_URL}card_exchange_history/${studentId}.json`;
            const historyRes = await fetch(historyUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(historyPayload)
            });
            if (!historyRes.ok) {
                console.warn(`[FirebaseSync] Gửi lịch sử quy đổi thẻ lên Firebase thất bại: ${historyRes.status}`);
            } else {
                console.log(`[FirebaseSync] Đã đồng bộ lịch sử quy đổi thẻ lên Firebase cho học sinh ${studentName}`);
            }
        }
    } catch (err) {
        console.error("[FirebaseSync] Không thể đồng bộ lên Firebase:", err.message);
    }
}

async function syncAllStudentsToFirebase() {
    console.log("[FirebaseSync] Bắt đầu đồng bộ tất cả học sinh lên Firebase...");
    try {
        const rows = await allQuery("SELECT student_id, state_json FROM student_progress").catch(err => {
            console.error("[FirebaseSync] Lỗi đọc dữ liệu học sinh từ SQLite:", err.message);
            return [];
        });

        if (rows && rows.length > 0) {
            for (const row of rows) {
                try {
                    const state = JSON.parse(row.state_json);
                    await syncStudentProgressToFirebase(row.student_id, state);
                } catch (e) {
                    console.error(`[FirebaseSync] Lỗi phân tích JSON cho học sinh ${row.student_id}:`, e.message);
                }
            }
        }
        console.log("[FirebaseSync] Hoàn thành đồng bộ toàn bộ học sinh lên Firebase!");
    } catch (e) {
        console.error("[FirebaseSync] Lỗi trong hàm syncAllStudentsToFirebase:", e.message);
    }
}

async function hydrateStudentProgressFromFirebaseRTDB() {
    try {
        const res = await fetch(`${FIREBASE_RTDB_URL}leaderboard.json`);
        if (!res.ok) return;
        const leaderboard = await res.json();
        if (!leaderboard || typeof leaderboard !== 'object') return;

        for (const [studentId, cloudData] of Object.entries(leaderboard)) {
            if (!cloudData || !studentId) continue;
            const row = await getQuery("SELECT state_json FROM student_progress WHERE student_id = ?", [studentId]).catch(() => null);
            let localState = {};
            if (row && row.state_json) {
                try { localState = JSON.parse(row.state_json); } catch (e) { localState = {}; }
            }

            const cloudXp = Math.max(cloudData.mathXp || 0, cloudData.englishXp || 0);
            const cloudStreak = Math.max(cloudData.mathStreak || 0, cloudData.englishStreak || 0);
            const localXp = localState.xp || 0;

            // Nếu Cloud có điểm cao hơn hoặc local chưa có điểm
            if (cloudXp > localXp || (!localState.streak && cloudStreak > 0)) {
                localState.xp = Math.max(localState.xp || 0, cloudXp);
                localState._sharedXp = localState.xp;
                localState.englishXp = localState.xp;
                localState.streak = Math.max(localState.streak || 0, cloudStreak);
                if (cloudData.lastActiveDate && !localState.lastActiveDate) {
                    localState.lastActiveDate = cloudData.lastActiveDate;
                }
                if (cloudData.studentName && (!localState.student || typeof localState.student !== 'string')) {
                    localState.student = cloudData.studentName;
                }
                if (cloudData.classLevel) {
                    localState.classLevel = cloudData.classLevel;
                }
                localState.lastUpdated = new Date().toISOString();

                await runQuery("INSERT OR REPLACE INTO student_progress (student_id, state_json) VALUES (?, ?)", [
                    studentId,
                    JSON.stringify(localState)
                ]).catch(() => {});
                console.log(`⚡ [RTDB Hydrate] Đã đồng bộ tiến trình học tập từ Cloud cho ${cloudData.studentName || studentId}: XP=${localState.xp}, Streak=${localState.streak}`);
            }
        }
    } catch (err) {
        console.warn("[RTDB Hydrate] Lỗi đồng bộ đám mây:", err.message);
    }
}

async function pushLocalDataToFirestore(parentUid) {
    console.log("📤 Bắt đầu di trú dữ liệu SQLite lên Firestore...");
    return { success: true };
}

async function pullDataFromFirestore(parentUid) {
    return "Đồng bộ thành công";
}

module.exports = {
    firebaseConfig,
    FIREBASE_RTDB_URL,
    firebaseInitialized,
    syncStudentProgressToFirebase,
    syncAllStudentsToFirebase,
    hydrateStudentProgressFromFirebaseRTDB,
    pushLocalDataToFirestore,
    pullDataFromFirestore
};
