const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');
const url = require('url');

// Nạp biến môi trường từ .env
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      env[key] = value.trim();
    }
  });
  return env;
}

const env = loadEnv();
const GITHUB_TOKEN = env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error('❌ LỖI: Không tìm thấy GITHUB_TOKEN trong file .env.');
  console.error('Vui lòng cấu hình GITHUB_TOKEN=ghp_... trong file .env trước khi chạy.');
  process.exit(1);
}

// 1. Đọc phiên bản hiện tại từ version.json
const versionJsonPath = path.join(__dirname, 'version.json');
if (!fs.existsSync(versionJsonPath)) {
  console.error('❌ LỖI: Không tìm thấy file version.json.');
  process.exit(1);
}

const versionData = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));
const currentVersion = versionData.version;
console.log(`📦 Phiên bản hiện tại: v${currentVersion}`);

// 2. Tự động tính toán phiên bản mới (tăng patch version)
function getNextPatchVersion(version) {
  const parts = version.split('.');
  if (parts.length >= 2) {
    const lastIdx = parts.length - 1;
    const patch = parseInt(parts[lastIdx], 10);
    if (!isNaN(patch)) {
      parts[lastIdx] = patch + 1;
      return parts.join('.');
    }
  }
  return version + '.1';
}

const nextVersion = getNextPatchVersion(currentVersion);
console.log(`🚀 Chuẩn bị nâng cấp lên phiên bản mới: v${nextVersion}`);

// Lấy ngày giờ hiện tại định dạng Việt Nam (DD/MM/YYYY HH:mm)
const now = new Date();
const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
console.log(`⏰ Thời gian cập nhật: ${formattedDate}`);

// Changelog mặc định
const changelogText = `- Cập nhật tự động phiên bản v${nextVersion}\n- Đồng bộ bản sạch và nâng cấp hệ thống ngày ${formattedDate}.`;

// 3. Cập nhật số phiên bản và ngày giờ trong các file nguồn
console.log('\n✏️ Đang cập nhật số phiên bản trong các tệp tin nguồn...');

// A. Cập nhật server.js (const APP_VERSION = 'X.X';)
const serverJsPath = path.join(__dirname, 'server.js');
if (fs.existsSync(serverJsPath)) {
  let serverContent = fs.readFileSync(serverJsPath, 'utf8');
  // Thay thế const APP_VERSION = '...';
  const serverRegex = /const\s+APP_VERSION\s*=\s*['"][\d\.]+['"]\s*;/g;
  if (serverRegex.test(serverContent)) {
    serverContent = serverContent.replace(serverRegex, `const APP_VERSION = '${nextVersion}';`);
    fs.writeFileSync(serverJsPath, serverContent, 'utf8');
    console.log('✅ Đã cập nhật APP_VERSION trong server.js');
  } else {
    console.warn('⚠️ Cảnh báo: Không tìm thấy mẫu khai báo APP_VERSION trong server.js');
  }
}

// B. Cập nhật student.html (Splash tag, Footer tag, cachebuster ?v=)
const studentHtmlPath = path.join(__dirname, 'student.html');
if (fs.existsSync(studentHtmlPath)) {
  let htmlContent = fs.readFileSync(studentHtmlPath, 'utf8');
  
  // Thay thế Splash Screen tag
  const regexSplash = /<div class="splash-version-tag">Phiên bản: v[\d\.]+\s*\(Cập nhật: [^\)]+\)<\/div>/g;
  htmlContent = htmlContent.replace(regexSplash, `<div class="splash-version-tag">Phiên bản: v${nextVersion} (Cập nhật: ${formattedDate})</div>`);
  
  // Thay thế Footer tag
  const regexFooter = /Phiên bản: v[\d\.]+\s*\(Cập nhật: [^\)]+\)/g;
  htmlContent = htmlContent.replace(regexFooter, `Phiên bản: v${nextVersion} (Cập nhật: ${formattedDate})`);
  
  // Thay thế cachebuster ?v= trong các thẻ import script/link
  const regexCssJs = /(\.css|\.js)\?v=[\d\.]+/g;
  htmlContent = htmlContent.replace(regexCssJs, `$1?v=${nextVersion}`);
  
  fs.writeFileSync(studentHtmlPath, htmlContent, 'utf8');
  console.log('✅ Đã cập nhật student.html (Splash tag, Footer tag và các liên kết CSS/JS)');
}

// C. Cập nhật version.json
versionData.version = nextVersion;
versionData.downloadUrl = `https://github.com/skyprotect/Hoctap/releases/download/v${nextVersion}/ToanHocKiosk_Setup_v${nextVersion}.exe`;
versionData.changelog = changelogText;
fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2), 'utf8');
console.log('✅ Đã cập nhật version.json');

// D. Cập nhật installer.iss (AppVersion=X.X và OutputBaseFilename=ToanHocKiosk_Setup_vX.X)
const installerPath = path.join(__dirname, 'installer.iss');
if (fs.existsSync(installerPath)) {
  let installerContent = fs.readFileSync(installerPath, 'utf8');
  
  installerContent = installerContent.replace(/AppVersion=[\d\.]+/g, `AppVersion=${nextVersion}`);
  installerContent = installerContent.replace(/OutputBaseFilename=ToanHocKiosk_Setup_v[\d\.]+/g, `OutputBaseFilename=ToanHocKiosk_Setup_v${nextVersion}`);
  
  fs.writeFileSync(installerPath, installerContent, 'utf8');
  console.log('✅ Đã cập nhật installer.iss');
}

// 4. Đồng bộ bản sạch (Clean Bundle)
console.log('\n🧹 Đang chạy kịch bản đồng bộ bản sạch (sync_clean.js)...');
try {
  execSync('node sync_clean.js', { stdio: 'inherit' });
  console.log('✅ Đồng bộ bản sạch thành công.');
} catch (error) {
  console.error('❌ LỖI: Quá trình chạy sync_clean.js thất bại.', error.message);
  process.exit(1);
}

// 5. Đóng gói bộ cài đặt .exe bằng Inno Setup Compiler (ISCC)
console.log('\n🛠️ Đang biên dịch bộ cài đặt bằng Inno Setup...');
const isccPath = '"C:\\Program Files (x86)\\Inno Setup 6\\ISCC.exe"';
try {
  execSync(`${isccPath} "${installerPath}"`, { stdio: 'inherit' });
  console.log('✅ Biên dịch bộ cài đặt thành công.');
} catch (error) {
  console.error('❌ LỖI: Biên dịch Inno Setup thất bại. Hãy chắc chắn Inno Setup 6 đã được cài đặt tại Program Files (x86).');
  process.exit(1);
}

// Đường dẫn file exe vừa sinh ra (ở thư mục cha F:\KHQS\AntiGravity theo config trong installer.iss)
const outputExePath = path.join('F:', 'KHQS', 'AntiGravity', `ToanHocKiosk_Setup_v${nextVersion}.exe`);
if (!fs.existsSync(outputExePath)) {
  console.error(`❌ LỖI: Không tìm thấy file cài đặt đầu ra tại đường dẫn: ${outputExePath}`);
  process.exit(1);
}
console.log(`📁 File cài đặt đã sẵn sàng tại: ${outputExePath}`);

// 6. Đẩy mã nguồn lên GitHub qua Git CLI
console.log('\n🐙 Đang đẩy mã nguồn lên GitHub...');
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "Auto release version v${nextVersion}"`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('✅ Đã đẩy mã nguồn lên GitHub repository thành công.');
} catch (error) {
  console.warn('⚠️ Cảnh báo: Lỗi khi chạy git push. Đảm bảo Git đã được lưu mật khẩu trên máy tính.');
  console.error(error.message);
}

// 7. Tạo GitHub Release và tải bộ cài đặt lên qua GitHub API
console.log('\n🌐 Đang kết nối tới GitHub API để tạo Release...');

function makeRequest(options, bodyData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data || '{}'));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    if (bodyData) {
      req.write(bodyData);
    }
    req.end();
  });
}

async function publishRelease() {
  const repoOwner = 'skyprotect';
  const repoName = 'Hoctap';
  
  // A. Tạo GitHub Release mới
  console.log(`🔹 Đang tạo release 'v${nextVersion}'...`);
  const createReleaseOptions = {
    hostname: 'api.github.com',
    path: `/repos/${repoOwner}/${repoName}/releases`,
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'NodeJS-Release-Script',
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    }
  };
  
  const releaseBody = JSON.stringify({
    tag_name: `v${nextVersion}`,
    target_commitish: 'main',
    name: `v${nextVersion}`,
    body: changelogText,
    draft: false,
    prerelease: false
  });
  
  try {
    const releaseResponse = await makeRequest(createReleaseOptions, releaseBody);
    console.log(`✅ Đã tạo GitHub Release thành công. ID: ${releaseResponse.id}`);
    
    // B. Trích xuất upload_url
    let uploadUrl = releaseResponse.upload_url;
    // uploadUrl có định dạng: "https://uploads.github.com/repos/skyprotect/Hoctap/releases/12345/assets{?name,label}"
    // Cần xóa phần "{?name,label}" ở cuối
    if (uploadUrl.includes('{')) {
      uploadUrl = uploadUrl.substring(0, uploadUrl.indexOf('{'));
    }
    
    const fileName = `ToanHocKiosk_Setup_v${nextVersion}.exe`;
    const finalUploadUrl = `${uploadUrl}?name=${encodeURIComponent(fileName)}`;
    
    // C. Tải file exe lên Release (Asset) sử dụng Stream để tối ưu bộ nhớ
    console.log(`🔹 Đang tải tệp cài đặt ${fileName} lên GitHub Release (khoảng ${Math.round(fs.statSync(outputExePath).size / 1024 / 1024)} MB)...`);
    
    const parsedUrl = new url.URL(finalUploadUrl);
    const stats = fs.statSync(outputExePath);
    
    const uploadOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'NodeJS-Release-Script',
        'Content-Type': 'application/octet-stream',
        'Content-Length': stats.size
      }
    };
    
    const uploadPromise = () => {
      return new Promise((resolve, reject) => {
        const req = https.request(uploadOptions, (res) => {
          let data = '';
          res.on('data', (chunk) => data += chunk);
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(JSON.parse(data || '{}'));
            } else {
              reject(new Error(`HTTP ${res.statusCode}: ${data}`));
            }
          });
        });
        
        req.on('error', reject);
        
        // Pipe file stream trực tiếp vào request
        const readStream = fs.createReadStream(outputExePath);
        readStream.on('error', (err) => {
          req.destroy(err);
          reject(err);
        });
        readStream.pipe(req);
      });
    };
    
    await uploadPromise();
    console.log(`🎉 HOÀN THÀNH CÔNG VIỆC! Phiên bản v${nextVersion} đã được đóng gói và phát hành trực tuyến thành công.`);
    console.log(`🔗 Người dùng khi khởi động phần mềm sẽ lập tức nhận được thông báo cập nhật lên v${nextVersion}.`);
    
  } catch (error) {
    console.error('❌ LỖI trong quá trình gọi API GitHub:', error.message);
    process.exit(1);
  }
}

publishRelease();
