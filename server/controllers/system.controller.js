/**
 * SYSTEM CONTROLLER
 * Xử lý phiên bản hệ thống, cấu hình Firebase, kiểm tra sức khỏe hệ thống (Health Check),
 * báo cáo lỗi Client (Telemetry) và cập nhật phần mềm (Auto-Updater).
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { firebaseConfig } = require('../services/firebase.service');

const ROOT_DIR = path.resolve(__dirname, '../../');
const VERSION_FILE = path.join(ROOT_DIR, 'version.json');

function getVersionInfo() {
    try {
        if (fs.existsSync(VERSION_FILE)) {
            return JSON.parse(fs.readFileSync(VERSION_FILE, 'utf8'));
        }
    } catch (e) {}
    return { version: "13.30", build: 1344, lastUpdated: new Date().toISOString() };
}

function getVersion(req, res) {
    res.json(getVersionInfo());
}

function getFirebaseConfig(req, res) {
    res.json(firebaseConfig);
}

function getHealth(req, res) {
    res.json({ status: "ok", timestamp: Date.now() });
}

function reportClientError(req, res) {
    const { studentId, lessonId, lessonTitle, errorMessage, errorStack, failedQuestion, failedIndex } = req.body || {};
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
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

function isKioskMode(req, res) {
    const { exec } = require('child_process');
    exec('tasklist /FI "IMAGENAME eq kiosk_lock.exe"', (err, stdout) => {
        if (err) return res.json({ isKiosk: false });
        const isKiosk = stdout.includes('kiosk_lock.exe');
        res.json({ isKiosk });
    });
}

const UPDATE_CHECK_URL = process.env.UPDATE_CHECK_URL || 'https://raw.githubusercontent.com/binhminh-github/toan-hoc-kiosk/main/version.json';

function checkUpdate(req, res) {
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
                
                const compareVersions = (v1, v2) => {
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
            } catch (e) {
                res.json({ hasUpdate: false, error: e.message });
            }
        });
    }).on('error', (err) => {
        res.json({ hasUpdate: false, error: err.message });
    });
}

let updateStatus = { status: 'idle', progress: 0, downloadedBytes: 0, totalBytes: 0, error: null };

function getUpdateStatus(req, res) {
    res.json(updateStatus);
}

function performUpdate(req, res) {
    res.json({ success: true, message: "Bắt đầu cập nhật" });
}

module.exports = {
    getVersion,
    getFirebaseConfig,
    getHealth,
    reportClientError,
    isKioskMode,
    checkUpdate,
    getUpdateStatus,
    performUpdate
};
