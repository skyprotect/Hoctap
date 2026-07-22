const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');
const url = require('url');

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
  process.exit(1);
}

const apkPath = path.join(__dirname, 'TabletLock_Kiosk.apk');
if (!fs.existsSync(apkPath)) {
  console.error(`❌ LỖI: Không tìm thấy tệp APK tại: ${apkPath}`);
  process.exit(1);
}

const now = new Date();
const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

const apkVersion = '3.2';
const tagName = `v${apkVersion}-kiosk`;

console.log(`📱 Chuẩn bị phát hành APK TabletLock v${apkVersion} lên GitHub Release...`);
console.log(`⏰ Thời gian: ${formattedDate}`);

// Cập nhật version.json
const versionJsonPath = path.join(__dirname, 'version.json');
if (fs.existsSync(versionJsonPath)) {
  const versionData = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));
  versionData.androidVersion = apkVersion;
  versionData.androidChangelog = `- Phiên bản v${apkVersion}: Khắc phục triệt để lỗi ứng dụng biến mất khi dọn dẹp Recents Apps. Áp dụng Persistent Guard Service 24/7 và LockTaskFeature NONE.`;
  fs.writeFileSync(versionJsonPath, JSON.stringify(versionData, null, 2), 'utf8');
  console.log('✅ Đã cập nhật androidVersion trong version.json');
}

// Git commit & push
try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "Release TabletLock Kiosk APK v${apkVersion}"`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  console.log('✅ Đã push mã nguồn cập nhật lên GitHub.');
} catch (e) {
  console.warn('⚠️ Git commit/push warning:', e.message);
}

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

async function publishApkRelease() {
  const repoOwner = 'skyprotect';
  const repoName = 'Hoctap';

  console.log(`🔹 Đang tạo GitHub Release '${tagName}'...`);
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
    tag_name: tagName,
    target_commitish: 'main',
    name: `TabletLock Kiosk Android v${apkVersion}`,
    body: `## 📱 Bản cập nhật Kiosk Android TabletLock v${apkVersion}\n- Khắc phục triệt để hiện tượng dọn dẹp các ứng dụng gần đây (Recent Apps) làm ứng dụng bị đóng ngắt.\n- Duy trì Persistent Guard Service 24/7 bảo vệ thiết bị liên tục.\n- Áp dụng LockTaskFeature NONE chặn phím điều hướng hệ thống khi bị khóa.\n- Ngày cập nhật: ${formattedDate}`,
    draft: false,
    prerelease: false
  });

  try {
    const releaseResponse = await makeRequest(createReleaseOptions, releaseBody);
    console.log(`✅ Đã tạo GitHub Release thành công. ID: ${releaseResponse.id}`);

    let uploadUrl = releaseResponse.upload_url;
    if (uploadUrl.includes('{')) {
      uploadUrl = uploadUrl.substring(0, uploadUrl.indexOf('{'));
    }

    const fileName = `TabletLock_Kiosk_v${apkVersion}.apk`;
    const finalUploadUrl = `${uploadUrl}?name=${encodeURIComponent(fileName)}`;

    const stats = fs.statSync(apkPath);
    console.log(`🔹 Đang tải tệp APK ${fileName} (${Math.round(stats.size / 1024 / 1024 * 10) / 10} MB) lên GitHub Release...`);

    const parsedUrl = new url.URL(finalUploadUrl);
    const uploadOptions = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'User-Agent': 'NodeJS-Release-Script',
        'Content-Type': 'application/vnd.android.package-archive',
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

        req.setTimeout(300000);
        req.on('error', reject);

        const readStream = fs.createReadStream(apkPath);
        readStream.on('error', (err) => {
          req.destroy(err);
          reject(err);
        });
        readStream.pipe(req);
      });
    };

    await uploadPromise();
    console.log(`🎉 HOÀN THÀNH! Bản APK TabletLock v${apkVersion} đã được phát hành thành công lên GitHub Release: https://github.com/skyprotect/Hoctap/releases/tag/${tagName}`);
  } catch (error) {
    console.error('❌ LỖI trong quá trình gọi API GitHub Release:', error.message);
    process.exit(1);
  }
}

publishApkRelease();
