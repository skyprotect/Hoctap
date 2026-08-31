/**
 * HOCTAP SERVER ENTRY POINT
 * Kiến trúc MVC chuẩn hóa & TypeScript Runtime Engine - v13.31
 */
require('ts-node').register({ transpileOnly: true });

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const net = require('net');
const os = require('os');
const https = require('https');

// 1. Khởi tạo và nạp biến môi trường
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');
if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
        try { fs.copyFileSync(envExamplePath, envPath); } catch (e) {}
    } else {
        const defaultEnv = `PORT=3000\nGEMINI_MODEL=gemini-1.5-flash\nUPDATE_CHECK_URL=https://raw.githubusercontent.com/skyprotect/Hoctap/main/version.json\n`;
        try { fs.writeFileSync(envPath, defaultEnv, 'utf-8'); } catch (e) {}
    }
}
require('dotenv').config();
const APP_VERSION = '13.91';

const { initIntegrityCheck, DatabasePool } = require('./server/db/database');
const { runDataMigration, migrateFixMathBugsV12 } = require('./server/services/migration.service');
const { notFoundHandler, globalErrorHandler } = require('./server/middleware/error.middleware');

function getLocalIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}

function findFreePort(startPort) {
    const portVal = parseInt(startPort, 10);
    return new Promise((resolve) => {
        const server = net.createServer();
        server.listen(portVal, () => {
            const { port } = server.address();
            server.close(() => resolve(port));
        });
        server.on('error', () => {
            resolve(findFreePort(portVal + 1));
        });
    });
}

// 2. Khởi tạo Express App
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname), {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.woff2')) res.setHeader('Content-Type', 'font/woff2');
        else if (filePath.endsWith('.woff')) res.setHeader('Content-Type', 'font/woff');
        else if (filePath.endsWith('.ttf')) res.setHeader('Content-Type', 'font/ttf');
    }
}));

// 3. Mount Routers
app.use('/data', express.static(path.join(__dirname, 'data')));

app.get('/sw.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.sendFile(path.join(__dirname, 'sw.js'));
});

app.use('/api/auth', require('./server/routes/auth.routes'));
app.use('/api', require('./server/routes/auth.routes'));
app.use('/api', require('./server/routes/student.routes'));
app.use('/api', require('./server/routes/quiz.routes'));
app.use('/api', require('./server/routes/admin.routes'));
app.use('/api', require('./server/routes/system.routes'));

// 4. HTML Static & SPA Routers
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'parent.html'));
});

app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/data/')) return next();
    res.sendFile(path.join(__dirname, 'student.html'), (err) => {
        if (err && !res.headersSent) {
            res.status(err.status || 500).send('Trang không tồn tại hoặc lỗi máy chủ.');
        }
    });
});

app.use(notFoundHandler);
app.use(globalErrorHandler);

function checkForUpdatesOnStartup(currentVersion) {
    const updateUrl = process.env.UPDATE_CHECK_URL || 'https://raw.githubusercontent.com/skyprotect/Hoctap/main/version.json';
    https.get(updateUrl, { headers: { 'User-Agent': 'HocTap-AutoChecker' }, timeout: 5000 }, (res) => {
        if (res.statusCode !== 200) return;
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const info = JSON.parse(data);
                const onlineVersion = info.version;
                if (onlineVersion && onlineVersion !== currentVersion) {
                    console.log(`🔔 [AutoUpdate] Đã phát hiện phiên bản mới: v${onlineVersion} (Bản hiện tại: v${currentVersion}). Tải tại: ${info.downloadUrl || 'GitHub Releases'}`);
                }
            } catch (e) {}
        });
    }).on('error', () => {});
}

let serverInstance = null;

// 5. Khởi tạo Database và Khởi động Server
initIntegrityCheck().then(() => {
    findFreePort(PORT).then((freePort) => {
        serverInstance = app.listen(freePort, () => {
            const localIp = getLocalIpAddress();
            try {
                fs.writeFileSync(path.join(__dirname, '.port.tmp'), freePort.toString(), 'utf-8');
            } catch (err) {}

            console.log(`==================================================`);
            console.log(`  Ứng dụng Học Tập (AI Enabled) đang chạy tại:`);
            console.log(`  👉 Local:   http://localhost:${freePort}`);
            console.log(`  👉 LAN IP:  http://${localIp}:${freePort}`);
            console.log(`==================================================`);
            
            runDataMigration();
            setTimeout(() => {
                migrateFixMathBugsV12().catch(() => {});
                checkForUpdatesOnStartup(APP_VERSION);
            }, 1000);
        });
    });
}).catch((dbErr) => {
    console.error("❌ Không thể khởi động server do lỗi CSDL:", dbErr);
});

// 6. Graceful Shutdown
process.on('SIGTERM', async () => {
    try {
        await DatabasePool.close();
    } catch (e) {}
    if (serverInstance) {
        serverInstance.close(() => process.exit(0));
    } else {
        process.exit(0);
    }
});

process.on('SIGINT', async () => {
    try {
        await DatabasePool.close();
    } catch (e) {}
    if (serverInstance) {
        serverInstance.close(() => process.exit(0));
    } else {
        process.exit(0);
    }
});

module.exports = app;
