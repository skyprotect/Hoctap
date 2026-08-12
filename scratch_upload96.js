const fs = require('fs');
const path = require('path');
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
      if (value.startsWith('"') && value.endsWith('"')) value = value.substring(1, value.length - 1);
      else if (value.startsWith("'") && value.endsWith("'")) value = value.substring(1, value.length - 1);
      env[key] = value.trim();
    }
  });
  return env;
}

const env = loadEnv();
const GITHUB_TOKEN = env.GITHUB_TOKEN;
const repoOwner = 'skyprotect';
const repoName = 'Hoctap';
const tag = 'v12.96';
const exePath = path.join('F:', 'KHQS', 'AntiGravity', 'ToanHocKiosk_Setup_v12.96.exe');

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
    if (bodyData) req.write(bodyData);
    req.end();
  });
}

async function fixUpload() {
  console.log(`🔹 Fetching release info for tag ${tag}...`);
  const getReleaseOptions = {
    hostname: 'api.github.com',
    path: `/repos/${repoOwner}/${repoName}/releases/tags/${tag}`,
    method: 'GET',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'NodeJS-Upload-Fix'
    }
  };

  const release = await makeRequest(getReleaseOptions);
  console.log(`✅ Found release ID: ${release.id}`);

  if (release.assets && release.assets.length > 0) {
    for (const asset of release.assets) {
      if (asset.name.includes('v12.96')) {
        console.log(`🗑️ Deleting old asset ID ${asset.id} (${asset.name})...`);
        const deleteOptions = {
          hostname: 'api.github.com',
          path: `/repos/${repoOwner}/${repoName}/releases/assets/${asset.id}`,
          method: 'DELETE',
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'User-Agent': 'NodeJS-Upload-Fix'
          }
        };
        await makeRequest(deleteOptions);
        console.log('✅ Deleted old asset.');
      }
    }
  }

  let uploadUrl = release.upload_url;
  if (uploadUrl.includes('{')) uploadUrl = uploadUrl.substring(0, uploadUrl.indexOf('{'));
  const fileName = 'ToanHocKiosk_Setup_v12.96.exe';
  const finalUploadUrl = `${uploadUrl}?name=${encodeURIComponent(fileName)}`;

  console.log(`🔹 Uploading clean ${fileName} (${Math.round(fs.statSync(exePath).size / 1024 / 1024)} MB)...`);
  const parsedUrl = new url.URL(finalUploadUrl);
  const stats = fs.statSync(exePath);

  const uploadOptions = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.pathname + parsedUrl.search,
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'NodeJS-Upload-Fix',
      'Content-Type': 'application/octet-stream',
      'Content-Length': stats.size
    }
  };

  const req = https.request(uploadOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        console.log('🎉 Upload complete! Release v12.96 asset fixed online.');
      } else {
        console.error('❌ Upload failed:', res.statusCode, data);
      }
    });
  });

  req.setTimeout(600000);
  req.on('error', (err) => console.error('Upload error:', err));
  fs.createReadStream(exePath).pipe(req);
}

fixUpload().catch(console.error);
