const fs = require('fs');

const NEW_VERSION = '14.01';
const NEW_DATE = '01/09/2026 08:07';
const ISO_DATE = '2026-09-01T08:07:00+07:00';

// 1. student.html
let studentHtml = fs.readFileSync('student.html', 'utf8');
studentHtml = studentHtml.replace(/var CURRENT_VERSION = '1[34]\.\d+(\.\d+)?';/g, `var CURRENT_VERSION = '${NEW_VERSION}';`);
studentHtml = studentHtml.replace(/\?v=1[34]\.\d+(\.\d+)?/g, `?v=${NEW_VERSION}`);
studentHtml = studentHtml.replace(/Phiên bản: v1[34]\.\d+(\.\d+)? \(Cập nhật: [^\)]+\)/g, `Phiên bản: v${NEW_VERSION} (Cập nhật: ${NEW_DATE})`);
studentHtml = studentHtml.replace(/PhiÃªn báº£n: v1[34]\.\d+(\.\d+)? \(Cáº­p nháº­t: [^\)]+\)/g, `Phiên bản: v${NEW_VERSION} (Cập nhật: ${NEW_DATE})`);
fs.writeFileSync('student.html', studentHtml, 'utf8');
console.log(`✅ Updated student.html to v${NEW_VERSION}`);

// 2. server.js
let serverJs = fs.readFileSync('server.js', 'utf8');
serverJs = serverJs.replace(/const APP_VERSION = '1[34]\.\d+(\.\d+)?';/g, `const APP_VERSION = '${NEW_VERSION}';`);
fs.writeFileSync('server.js', serverJs, 'utf8');
console.log(`✅ Updated server.js to v${NEW_VERSION}`);

// 3. version.json
let versionJson = JSON.parse(fs.readFileSync('version.json', 'utf8'));
versionJson.version = NEW_VERSION;
versionJson.lastUpdated = NEW_DATE;
versionJson.releaseDate = ISO_DATE;
versionJson.build = 1401;
versionJson.releaseNotes = "MICRO-REFACTOR (v14.01): Khôi phục toàn diện dữ liệu học tập HK2 cho Trần Bình Minh; Bóc tách mô-đun MathTemplateCompiler chuẩn hóa; Sửa lỗi khởi tạo Web Worker ngầm và gia cố nút Thoát trong bài tập & bài kiểm tra.";
versionJson.downloadUrl = `https://github.com/skyprotect/Hoctap/releases/download/v${NEW_VERSION}/ToanHocKiosk_Setup_v${NEW_VERSION}.exe`;
fs.writeFileSync('version.json', JSON.stringify(versionJson, null, 2), 'utf8');
console.log(`✅ Updated version.json to v${NEW_VERSION}`);
