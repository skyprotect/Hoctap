/**
 * AUTH SERVICE
 * Quản lý xác thực JWT Admin, Google OAuth2, Session phụ huynh, Đăng xuất & PIN verification
 */
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import fs from 'fs';
import path from 'path';
import { 
    dbGetConfig, 
    dbGetSetting, 
    dbSaveSetting, 
    runQuery 
} from '../db/database';

export const JWT_SECRET = process.env.JWT_SECRET || 'antigravity_secret_key_123';
export const DEFAULT_GOOGLE_CLIENT_ID = "1033910156653-jf5787g1hgbfh9v0onqrs84rl36d2qrl.apps.googleusercontent.com";
export const googleClient = new OAuth2Client();

export function generateToken(payload: object, expiresIn: string = '30m'): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn } as any);
}

export function verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
}

export function getGoogleClientId(): string {
    return process.env.GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID;
}

export async function getSession(): Promise<{ loggedIn: boolean; session?: any; error?: string }> {
    try {
        const session = await dbGetSetting('parent_session');
        if (session && (session.parentUid || session.email)) {
            return { loggedIn: true, session };
        } else {
            return { loggedIn: false };
        }
    } catch (e: any) {
        return { loggedIn: false, error: e.message };
    }
}

export async function processGoogleLogin(params: {
    idToken?: string;
    firebaseUid?: string;
    email?: string;
    displayName?: string;
}): Promise<any> {
    const { idToken, firebaseUid, email: fallbackEmail, displayName: fallbackName } = params;
    let email = (fallbackEmail || "").trim();
    let displayName = (fallbackName || "").trim();
    let parentUid = (firebaseUid || "").trim();

    const clientId = getGoogleClientId();

    if (idToken) {
        try {
            const oauthClient = new OAuth2Client(clientId);
            const ticket = await oauthClient.verifyIdToken({
                idToken: idToken,
                audience: clientId
            });
            const payload = ticket.getPayload();
            if (payload) {
                email = payload.email || email;
                displayName = payload.name || displayName;
                parentUid = parentUid || payload.sub;
            }
        } catch (oauthErr: any) {
            console.warn("[Google-Login] Xác thực Google ID Token thất bại:", oauthErr.message);
        }
    }

    if (!parentUid) {
        if (email) {
            parentUid = "uid_" + Buffer.from(email).toString('hex').slice(0, 24);
        } else {
            parentUid = "uid_parent_" + Date.now();
        }
    }

    const parentSessionObj = { 
        parentUid: parentUid, 
        email: email || "parent@binhminhchamhoc.edu.vn", 
        displayName: displayName || "Phụ huynh", 
        loginAt: new Date().toISOString() 
    };
    await dbSaveSetting('parent_session', parentSessionObj);

    const normalizedEmail = (email || "").toLowerCase().trim();
    if (normalizedEmail.includes('skyprotect')) {
        const configSky = {
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
        await dbSaveSetting('config', configSky);
        await runQuery("INSERT OR IGNORE INTO student_progress (student_id, state_json) VALUES (?, ?)", [
            'std_htsj4gbmo',
            JSON.stringify({ student: 'Trần Bình Minh', classLevel: '6' })
        ]).catch(() => {});
        await runQuery("INSERT OR IGNORE INTO student_progress (student_id, state_json) VALUES (?, ?)", [
            'std_baongoc',
            JSON.stringify({ student: 'Trần Bảo Ngọc', classLevel: '1' })
        ]).catch(() => {});
        console.log("  - Đã tự động khởi tạo cấu hình SQLite cho skyprotect@gmail.com (Trần Bình Minh & Trần Bảo Ngọc)");
    } else if (normalizedEmail.includes('nhematseo')) {
        const configNhem = {
            parentName: "Phụ huynh",
            parentPin: "123456",
            studentName: "Trần Đức Phúc",
            currentClass: "4",
            defaultStudentId: "std_tyc0gfnkz",
            students: [
                { id: "std_tyc0gfnkz", name: "Trần Đức Phúc", classLevel: "4" }
            ]
        };
        await dbSaveSetting('config', configNhem);
        await runQuery("INSERT OR IGNORE INTO student_progress (student_id, state_json) VALUES (?, ?)", [
            'std_tyc0gfnkz',
            JSON.stringify({ student: 'Trần Đức Phúc', classLevel: '4' })
        ]).catch(() => {});
        console.log("  - Đã tự động khởi tạo cấu hình SQLite cho nhematseo@gmail.com (Trần Đức Phúc)");
    }

    console.log(`👤 Đăng nhập thành công cho email: ${parentSessionObj.email}, UID: ${parentUid}`);
    return parentSessionObj;
}

export async function logoutAndResetDevice(): Promise<void> {
    console.log("⚠️ Bắt đầu xử lý Đăng xuất và Xóa sạch dữ liệu thiết bị...");
    await runQuery("DELETE FROM settings WHERE key = 'parent_session'");
    await runQuery("DELETE FROM student_progress");
    await runQuery("DELETE FROM custom_vocabulary");
    await runQuery("DELETE FROM custom_topics");
    await runQuery("DELETE FROM progress");
    await runQuery("DELETE FROM settings WHERE key = 'config'");
    await runQuery("DELETE FROM settings WHERE key = 'leaderboard_math_cache'");
    await runQuery("DELETE FROM settings WHERE key = 'leaderboard_english_cache'");

    const rootDir = path.resolve(__dirname, '../../');
    const examsDir = path.join(rootDir, 'exams');
    const backupDir = path.join(rootDir, 'exams_backup');

    const cleanExamsFiles = (dir: string) => {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                cleanExamsFiles(filePath);
            } else {
                if (file.includes('std_htsj4gbmo') || file.includes('std_tyc0gfnkz') || file.includes('std_baongoc')) {
                    try { fs.unlinkSync(filePath); } catch (e) {}
                }
            }
        }
    };

    cleanExamsFiles(examsDir);
    cleanExamsFiles(backupDir);

    const logsDir = path.join(rootDir, 'logs');
    if (fs.existsSync(logsDir)) {
        const logFiles = fs.readdirSync(logsDir);
        for (const f of logFiles) {
            try { fs.unlinkSync(path.join(logsDir, f)); } catch (e) {}
        }
    }

    console.log("✅ Đã reset thiết bị sạch sẽ.");
}

export async function adminLogin(inputPin?: string): Promise<{ success: boolean; token?: string; error?: string; status?: number }> {
    const config: any = await dbGetConfig();
    const correctPin = (config && config.parentPin) ? config.parentPin : "123456";
    const isMasterPin = process.env.MASTER_ADMIN_PIN && inputPin === process.env.MASTER_ADMIN_PIN;
    
    if (inputPin === correctPin || isMasterPin) {
        const token = generateToken({ role: 'admin' }, '30m');
        return { success: true, token };
    } else {
        return { success: false, error: "Mật mã Phụ huynh không chính xác!", status: 401 };
    }
}

export async function verifyPin(pin?: string): Promise<{ success: boolean; error?: string; status?: number }> {
    const config: any = await dbGetConfig();
    const correctPin = (config && config.parentPin) ? config.parentPin : "123456";
    const isMasterPin = process.env.MASTER_ADMIN_PIN && pin === process.env.MASTER_ADMIN_PIN;
    
    if (pin === correctPin || isMasterPin) {
        return { success: true };
    } else {
        return { success: false, error: "Mã PIN Phụ huynh không chính xác!", status: 403 };
    }
}
