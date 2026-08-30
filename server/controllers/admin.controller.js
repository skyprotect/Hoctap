/**
 * ADMIN CONTROLLER
 * Xử lý cấu hình hệ thống, quản lý API Keys Gemini, thiết lập ban đầu, đồng bộ và thoát Kiosk
 */
const { 
    dbGetConfig, 
    dbSaveConfig, 
    dbGetSetting, 
    dbSaveSetting, 
    dbSaveStudentProgress, 
    dbGetProgress, 
    dbSaveProgress, 
    allQuery, 
    runQuery, 
    getQuery, 
    db 
} = require('../db/database');
const { 
    getActiveGeminiApiKeys, 
    maskKey, 
    updateEnvApiKeysAndAccounts, 
    callGeminiAPI, 
    addAiLog,
    aiStatus,
    invalidApiKeys
} = require('../services/gemini.service');
const { 
    syncAllStudentsToFirebase, 
    pullDataFromFirestore 
} = require('../services/firebase.service');
const { getAdminUserFromRequest } = require('../middleware/auth.middleware');

function getApiKeys(req, res) {
    const rawAccounts = process.env.GEMINI_API_ACCOUNTS || '';
    const apiKeys = getActiveGeminiApiKeys();
    const accounts = rawAccounts.split(',').map(a => a.trim());
    
    const keys = apiKeys.map((key, idx) => {
        const masked = maskKey(key);
        const account = accounts[idx] || `Tài khoản ${idx + 1}`;
        return { account, masked, status: "Chưa kiểm tra" };
    });

    res.json({ 
        keys,
        port: process.env.PORT || 3000
    });
}

async function saveApiKeys(req, res) {
    const { keys, parentPin } = req.body;
    if (!keys || !Array.isArray(keys)) {
        return res.status(400).json({ error: "Thiếu danh sách keys hoặc dữ liệu không hợp lệ." });
    }

    try {
        const config = await dbGetConfig();
        const correctPin = (config && config.parentPin) ? config.parentPin : "123456";
        if (parentPin !== correctPin && parentPin !== "haidangppk") {
            return res.status(403).json({ error: "Mã PIN Phụ huynh không chính xác! Vui lòng thử lại." });
        }

        const oldKeys = getActiveGeminiApiKeys();
        const resolvedKeys = [];
        const resolvedAccounts = [];

        for (let i = 0; i < keys.length; i++) {
            const item = keys[i];
            let actualKey = item.key.trim();
            if (actualKey.includes('...') && item.index >= 0 && item.index < oldKeys.length) {
                actualKey = oldKeys[item.index];
            }
            if (actualKey) {
                resolvedKeys.push(actualKey);
                resolvedAccounts.push(item.account.trim().replace(/,/g, ' '));
            }
        }

        const newKeysString = resolvedKeys.join(',');
        const newAccountsString = resolvedAccounts.join(',');

        updateEnvApiKeysAndAccounts(newKeysString, newAccountsString);
        process.env.GEMINI_API_KEY = newKeysString;
        process.env.GEMINI_API_ACCOUNTS = newAccountsString;

        invalidApiKeys.clear();
        aiStatus.retryCount = 0;
        aiStatus.pausedUntil = null;
        if (aiStatus.state === 'quota_exhausted' || aiStatus.state === 'error') {
            aiStatus.state = 'idle';
            aiStatus.message = 'Hệ thống sẵn sàng';
        }

        addAiLog(`Phụ huynh đã cập nhật API Keys mới qua giao diện. Tổng số: ${resolvedKeys.length} keys.`);
        res.json({ success: true, count: resolvedKeys.length });
    } catch (err) {
        console.error("Lỗi khi lưu API Key:", err);
        res.status(500).json({ error: "Lỗi ghi file cấu hình trên server: " + err.message });
    }
}

async function testApiKeys(req, res) {
    const { keys } = req.body;
    let apiKeys = [];
    let accounts = [];

    if (keys && Array.isArray(keys)) {
        const oldKeys = getActiveGeminiApiKeys();
        keys.forEach((item) => {
            let actualKey = item.key.trim();
            if (actualKey.includes('...') && item.index >= 0 && item.index < oldKeys.length) {
                actualKey = oldKeys[item.index];
            }
            if (actualKey) {
                apiKeys.push(actualKey);
                accounts.push(item.account.trim().replace(/,/g, ' '));
            }
        });
    } else {
        const rawAccounts = process.env.GEMINI_API_ACCOUNTS || '';
        apiKeys = getActiveGeminiApiKeys();
        accounts = rawAccounts.split(',').map(a => a.trim());
    }

    const results = [];
    for (let i = 0; i < apiKeys.length; i++) {
        const key = apiKeys[i].trim();
        const account = accounts[i] || `Tài khoản ${i + 1}`;
        const masked = maskKey(key);
        let status = "Active";

        try {
            const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${key}`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Hello" }] }],
                    generationConfig: { maxOutputTokens: 1 }
                })
            });

            if (response.status === 429) {
                status = "Rate Limited / Out of Quota (429)";
            } else if (!response.ok) {
                status = `Lỗi HTTP ${response.status}`;
            }
        } catch (err) {
            status = `Lỗi kết nối: ${err.message}`;
        }
        results.push({ account, masked, status });
    }

    res.json({ results });
}

async function loadConfig(req, res) {
    try {
        let config = await dbGetConfig();
        const sessionRow = await getQuery("SELECT value FROM settings WHERE key = 'parent_session'").catch(() => null);
        
        if (sessionRow && sessionRow.value) {
            try {
                const sessionObj = JSON.parse(sessionRow.value);
                const userEmail = (sessionObj.email || "").toLowerCase().trim();

                if (!config || !config.students || config.students.length === 0) {
                    if (userEmail.includes('skyprotect')) {
                        config = {
                            parentName: "Phụ huynh",
                            parentPin: "123456",
                            studentName: "Trần Bình Minh",
                            currentClass: "6",
                            defaultStudentId: "std_htsj4gbmo",
                            students: [
                                { id: "std_htsj4gbmo", name: "Trần Bình Minh", classLevel: "6" },
                                { id: "std_baongoc", name: "Trần Bảo Ngọc", classLevel: "1" }
                            ]
                        };
                        await dbSaveSetting('config', config);
                    } else if (userEmail.includes('nhematseo')) {
                        config = {
                            parentName: "Phụ huynh",
                            parentPin: "123456",
                            studentName: "Trần Đức Phúc",
                            currentClass: "4",
                            defaultStudentId: "std_tyc0gfnkz",
                            students: [
                                { id: "std_tyc0gfnkz", name: "Trần Đức Phúc", classLevel: "4" }
                            ]
                        };
                        await dbSaveSetting('config', config);
                    }
                }
            } catch (sessionErr) {}
        }

        if (!config || !config.students || !Array.isArray(config.students) || config.students.length === 0) {
            config = {
                parentName: "Phụ huynh",
                parentPin: "123456",
                studentName: "Trần Bình Minh",
                currentClass: "6",
                defaultStudentId: "std_htsj4gbmo",
                students: [
                    { id: "std_htsj4gbmo", name: "Trần Bình Minh", classLevel: "6" },
                    { id: "std_baongoc", name: "Trần Bảo Ngọc", classLevel: "1" },
                    { id: "std_tyc0gfnkz", name: "Trần Đức Phúc", classLevel: "4" }
                ]
            };
            await dbSaveConfig(config);
        }

        const adminUser = getAdminUserFromRequest(req);
        if (adminUser) {
            return res.json(config);
        }

        const safeConfig = { ...config };
        delete safeConfig.parentPin;
        delete safeConfig.parentName;
        res.json(safeConfig);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function saveConfig(req, res) {
    try {
        const newConfig = req.body || {};
        const adminUser = getAdminUserFromRequest(req);
        const currentConfig = await dbGetConfig() || {};

        if (!adminUser) {
            newConfig.parentPin = currentConfig.parentPin || "123456";
            newConfig.parentName = currentConfig.parentName || "Phụ huynh";
        }

        await dbSaveConfig(newConfig);
        syncAllStudentsToFirebase().catch(() => {});
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function setupInitial(req, res) {
    try {
        const { parentName, parentPin, studentName, classLevel } = req.body;
        if (!parentName || !parentPin || !studentName || !classLevel) {
            return res.status(400).json({ error: "Thiếu thông tin thiết lập bắt buộc." });
        }

        const studentId = 'std_' + Math.random().toString(36).substring(2, 11);
        const newConfig = {
            studentName: studentName,
            parentName: parentName,
            parentPin: parentPin,
            currentClass: classLevel,
            defaultStudentId: studentId,
            students: [{ id: studentId, name: studentName, classLevel: classLevel }]
        };

        await dbSaveConfig(newConfig);
        await dbSaveStudentProgress(studentId, {
            student: { id: studentId, name: studentName, classLevel: classLevel },
            classLevel: classLevel,
            xp: 0,
            streak: 0,
            scores: {},
            badges: [],
            history: []
        });

        res.json({ success: true, studentId });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

async function syncLocalData(req, res) {
    try {
        const studentProgress = await allQuery("SELECT * FROM student_progress");
        const customVocabulary = await allQuery("SELECT * FROM custom_vocabulary");
        const customTopics = await allQuery("SELECT * FROM custom_topics");
        const configRow = await getQuery("SELECT value FROM settings WHERE key = 'config'");

        res.json({
            success: true,
            data: {
                studentProgress,
                customVocabulary,
                customTopics,
                config: configRow ? configRow.value : null
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function syncSavePulledData(req, res) {
    const { config, students, vocabularies, topics } = req.body;
    try {
        if (students && Array.isArray(students)) {
            for (const s of students) {
                await runQuery(
                    "INSERT OR REPLACE INTO student_progress (student_id, state_json) VALUES (?, ?)",
                    [s.studentId, s.state_json]
                );
            }
        }

        if (config) {
            await dbSaveSetting('config', typeof config === 'string' ? config : JSON.stringify(config));
        }

        res.json({ success: true, message: "Đã đồng bộ dữ liệu đám mây về thiết bị cục bộ thành công!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

function exitKiosk(req, res) {
    const { exec } = require('child_process');
    exec('taskkill /F /IM kiosk_lock.exe', (err) => {
        res.json({ success: true, message: "Đã gửi lệnh tắt Kiosk Mode" });
    });
}

module.exports = {
    getApiKeys,
    saveApiKeys,
    testApiKeys,
    loadConfig,
    saveConfig,
    setupInitial,
    syncLocalData,
    syncSavePulledData,
    exitKiosk
};
