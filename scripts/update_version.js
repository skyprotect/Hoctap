const fs = require('fs');

// 1. student.html
let studentHtml = fs.readFileSync('student.html', 'utf8');
studentHtml = studentHtml.replace(/var CURRENT_VERSION = '13\.\d+';/g, "var CURRENT_VERSION = '13.52';");
studentHtml = studentHtml.replace(/\?v=13\.\d+/g, '?v=13.52');
studentHtml = studentHtml.replace(/Phiên bản: v13\.\d+ \(Cập nhật: [^\)]+\)/g, 'Phiên bản: v13.52 (Cập nhật: 30/08/2026 20:15)');
fs.writeFileSync('student.html', studentHtml, 'utf8');
console.log('✅ Updated student.html to v13.52');

// 2. server.js
let serverJs = fs.readFileSync('server.js', 'utf8');
serverJs = serverJs.replace(/const APP_VERSION = '13\.\d+';/g, "const APP_VERSION = '13.52';");
fs.writeFileSync('server.js', serverJs, 'utf8');
console.log('✅ Updated server.js to v13.52');

// 3. version.json
let versionJson = JSON.parse(fs.readFileSync('version.json', 'utf8'));
versionJson.version = '13.52';
versionJson.releaseDate = '2026-08-30T20:15:00+07:00';
versionJson.releaseNotes = 'Rà soát và sửa lỗi toàn diện hệ thống: Splash screen, lộ trình bài học Toán HK1 & HK2, chọn môn và kích hoạt tự sinh đề AI ngầm.';
fs.writeFileSync('version.json', JSON.stringify(versionJson, null, 2), 'utf8');
console.log('✅ Updated version.json to v13.52');
