/**
 * SYSTEM CONTROLLER
 * Xử lý phiên bản hệ thống, cấu hình Firebase, kiểm tra sức khỏe hệ thống (Health Check),
 * báo cáo lỗi Client (Telemetry) và cập nhật phần mềm (Auto-Updater).
 */
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { firebaseConfig } from '../services/firebase.service';

export const ROOT_DIR = path.resolve(__dirname, '../../');
export const VERSION_FILE = path.join(ROOT_DIR, 'version.json');

export function getVersionInfo(): any {
    try {
        if (fs.existsSync(VERSION_FILE)) {
            return JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'));
        }
    } catch (e) {}
    return { version: "13.31", build: 1344, lastUpdated: new Date().toISOString() };
}

export function getVersion(req: Request, res: Response): void {
    res.json(getVersionInfo());
}

export function getFirebaseConfig(req: Request, res: Response): void {
    res.json(firebaseConfig);
}

export function getHealth(req: Request, res: Response): void {
    res.json({ status: "ok", timestamp: Date.now() });
}

export function reportClientError(req: Request, res: Response): void {
    const { studentId, lessonId, lessonTitle, errorMessage, errorStack, failedQuestion } = req.body || {};
    try {
        const logDir = path.join(ROOT_DIR, 'logs');
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true });
        }

        const timestamp = Date.now();
        const logFileName = `client-error-${lessonId || 'unknown'}-${timestamp}.log`;
        const logPath = path.join(logDir, logFileName);

        let logContent = `TIME: ${new Date().toISOString()}\nSTUDENT: ${studentId}\nLESSON: ${lessonId} - ${lessonTitle}\nERROR: ${errorMessage}\nSTACK: ${errorStack}\nQUESTION: ${JSON.stringify(failedQuestion)}\n`;
        fs.writeFileSync(logPath, logContent, 'utf8');

        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
}

export function isKioskMode(req: Request, res: Response): void {
    const { exec } = require('child_process');
    exec('tasklist /FI "IMAGENAME eq kiosk_lock.exe"', (err: any, stdout: string) => {
        if (err) return res.json({ isKiosk: false });
        const isKiosk = stdout.includes('kiosk_lock.exe');
        res.json({ isKiosk });
    });
}

export const UPDATE_CHECK_URL = process.env.UPDATE_CHECK_URL || 'https://raw.githubusercontent.com/skyprotect/Hoctap/main/version.json';

export function checkUpdate(req: Request, res: Response): void {
    const currentVersion = getVersionInfo().version;
    https.get(UPDATE_CHECK_URL, { headers: { 'User-Agent': 'NodeJS-Update-Client' } }, (response) => {
        let data = '';
        if (response.statusCode !== 200) {
            return res.json({ hasUpdate: false, message: `Status: ${response.statusCode}` });
        }
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
            try {
                const onlineInfo = JSON.parse(data);
                const latestVersion = onlineInfo.version;
                
                const compareVersions = (v1: string, v2: string) => {
                    const p1 = (v1 || '').split('.').map(Number);
                    const p2 = (v2 || '').split('.').map(Number);
                    for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
                        const a = p1[i] || 0;
                        const b = p2[i] || 0;
                        if (a < b) return -1;
                        if (a > b) return 1;
                    }
                    return 0;
                };

                if (compareVersions(currentVersion, latestVersion) < 0) {
                    res.json({
                        hasUpdate: true,
                        currentVersion,
                        latestVersion,
                        changelog: onlineInfo.changelog || '',
                        downloadUrl: onlineInfo.downloadUrl
                    });
                } else {
                    res.json({ hasUpdate: false, currentVersion });
                }
            } catch (e: any) {
                res.json({ hasUpdate: false, error: e.message });
            }
        });
    }).on('error', (err) => {
        res.json({ hasUpdate: false, error: err.message });
    });
}

export const updateStatus = { status: 'idle', progress: 0, downloadedBytes: 0, totalBytes: 0, error: null };

export function getUpdateStatus(req: Request, res: Response): void {
    res.json(updateStatus);
}

export function performUpdate(req: Request, res: Response): void {
    res.json({ success: true, message: "Bắt đầu cập nhật" });
}
