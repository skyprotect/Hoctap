/**
 * ADMIN APPLICATION SERVICE
 * Điều phối logic quản trị hệ thống: cấu hình, quản lý API Keys Gemini, đồng bộ và Kiosk control
 */
import { 
    dbGetConfig, 
    dbSaveConfig, 
    dbGetSetting, 
    dbSaveSetting, 
    dbSaveStudentProgress, 
    allQuery, 
    runQuery, 
    getQuery 
} from '../db/database';
import { 
    getActiveGeminiApiKeys, 
    maskKey, 
    updateEnvApiKeysAndAccounts, 
    addAiLog,
    aiStatus,
    invalidApiKeys
} from './gemini.service';
import { syncAllStudentsToFirebase } from './firebase.service';
import { SystemConfig } from '../types';
import { exec } from 'child_process';

// ============================================================================
// 1. QUẢN LÝ API KEYS
// ============================================================================

export function getApiKeysInfo(): { keys: Array<{ account: string; masked: string; status: string }>; port: string | number } {
    const rawAccounts = process.env.GEMINI_API_ACCOUNTS || '';
    const apiKeys = getActiveGeminiApiKeys();
    const accounts = rawAccounts.split(',').map(a => a.trim());
    
    const keys = apiKeys.map((key, idx) => {
        const masked = maskKey(key);
        const account = accounts[idx] || `Tài khoản ${idx + 1}`;
        return { account, masked, status: "Chưa kiểm tra" };
    });

    return { 
        keys,
        port: process.env.PORT || 3000
    };
}

export async function saveApiKeys(params: {
    keys: Array<{ key: string; account: string; index?: number }>;
    parentPin?: string;
}): Promise<{ success: boolean; count: number; error?: string; status?: number }> {
    const { keys, parentPin } = params;
    const config = await dbGetConfig();
    const correctPin = (config && config.parentPin) ? config.parentPin : "123456";
    const isMasterPin = process.env.MASTER_ADMIN_PIN && parentPin === process.env.MASTER_ADMIN_PIN;
    
    if (parentPin !== correctPin && !isMasterPin) {
        return { success: false, count: 0, error: "Mã PIN Phụ huynh không chính xác! Vui lòng thử lại.", status: 403 };
    }

    const oldKeys = getActiveGeminiApiKeys();
    const resolvedKeys: string[] = [];
    const resolvedAccounts: string[] = [];

    for (let i = 0; i < keys.length; i++) {
        const item = keys[i];
        let actualKey = item.key.trim();
        if (actualKey.includes('...') && item.index !== undefined && item.index >= 0 && item.index < oldKeys.length) {
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
    return { success: true, count: resolvedKeys.length };
}

export async function testApiKeys(inputKeys?: Array<{ key: string; account: string; index?: number }>): Promise<Array<{ account: string; masked: string; status: string }>> {
    let apiKeys: string[] = [];
    let accounts: string[] = [];

    if (inputKeys && Array.isArray(inputKeys)) {
        const oldKeys = getActiveGeminiApiKeys();
        inputKeys.forEach((item: any) => {
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

    const results: any[] = [];
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
        } catch (err: any) {
            status = `Lỗi kết nối: ${err.message}`;
        }
        results.push({ account, masked, status });
    }

    return results;
}

// ============================================================================
// 2. QUẢN LÝ CẤU HÌNH HỆ THỐNG
// ============================================================================

export async function loadConfig(isAdminUser: boolean): Promise<any> {
    let config: any = await dbGetConfig();
    const sessionRow: any = await getQuery("SELECT value FROM settings WHERE key = 'parent_session'").catch(() => null);
    
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

    if (isAdminUser) {
        return config;
    }

    const safeConfig = { ...config };
    delete safeConfig.parentPin;
    delete safeConfig.parentName;
    return safeConfig;
}

export async function saveConfig(newConfig: any, isAdminUser: boolean): Promise<void> {
    const currentConfig: any = await dbGetConfig() || {};

    if (!isAdminUser) {
        newConfig.parentPin = currentConfig.parentPin || "123456";
        newConfig.parentName = currentConfig.parentName || "Phụ huynh";
    }

    await dbSaveConfig(newConfig);
    syncAllStudentsToFirebase().catch(() => {});
}

export async function setupInitial(params: {
    parentName: string;
    parentPin: string;
    studentName: string;
    classLevel: string;
}): Promise<string> {
    const { parentName, parentPin, studentName, classLevel } = params;
    const studentId = 'std_' + Math.random().toString(36).substring(2, 11);
    const newConfig: SystemConfig = {
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

    return studentId;
}

// ============================================================================
// 3. ĐỒNG BỘ DỮ LIỆU CỤC BỘ & ĐÁM MÂY
// ============================================================================

export async function syncLocalData(): Promise<{
    studentProgress: any[];
    customVocabulary: any[];
    customTopics: any[];
    config: any;
}> {
    const studentProgress = await allQuery("SELECT * FROM student_progress");
    const customVocabulary = await allQuery("SELECT * FROM custom_vocabulary");
    const customTopics = await allQuery("SELECT * FROM custom_topics");
    const configRow: any = await getQuery("SELECT value FROM settings WHERE key = 'config'");

    return {
        studentProgress,
        customVocabulary,
        customTopics,
        config: configRow ? configRow.value : null
    };
}

export async function syncSavePulledData(params: {
    config?: any;
    students?: Array<{ studentId: string; state_json: string }>;
}): Promise<void> {
    const { config, students } = params;
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
}

// ============================================================================
// 4. ĐIỀU KHIỂN KIOSK
// ============================================================================

export function exitKiosk(): Promise<void> {
    return new Promise((resolve) => {
        exec('taskkill /F /IM kiosk_lock.exe', () => {
            resolve();
        });
    });
}
