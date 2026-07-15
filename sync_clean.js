const fs = require('fs');
const path = require('path');

const srcDir = 'F:/KHQS/AntiGravity/HocTap';
const destDir = 'F:/KHQS/AntiGravity/HocTap_Clean';

const filesToSync = [
  'server.js',
  'student.html',
  'parent.html',
  'kiosk_lock.cs',
  'kiosk_lock.exe',
  'js/app.js',
  'js/lessons.js',
  'js/english_data.js',
  'js/parent.js',
  'js/questions-v1.js',
  'js/questions-v3.js',
  'js/questions-v4.js',
  'js/game.js',
  'css/style.css',
  '.env.example',
  '.env',
  'firebase-service-account.json',
  'version.json',
  'package.json',
  'package-lock.json',
  'Bat dau hoc.vbs',
  'Dung hoc.vbs'
];

const dirsToSync = [
  'js/lib',
  'css/lib',
  'images',
  'sounds'
];

const filesToDeleteInDest = [
  'database.db',
  'database.db-wal',
  'database.db-shm',
  'database.db.old',
  'database.db-wal.old',
  'database.db-shm.old',
  '.port.tmp',
  'kiosk_lock.log',
  'kiosk_exit_flag.tmp',
  '🚀 Bắt đầu học.vbs',
  '⏹ Dừng học.vbs'
];

function copyFileSync(src, dest) {
  const destParent = path.dirname(dest);
  if (!fs.existsSync(destParent)) {
    fs.mkdirSync(destParent, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function sync() {
  console.log('--- STARTING SYNC TO CLEAN BUNDLE ---');
  
  for (let file of filesToSync) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    if (fs.existsSync(srcPath)) {
      copyFileSync(srcPath, destPath);
      console.log(`Synced file: ${file}`);
    }
  }

  for (let dir of dirsToSync) {
    const srcPath = path.join(srcDir, dir);
    const destPath = path.join(destDir, dir);
    if (fs.existsSync(srcPath)) {
      copyDirSync(srcPath, destPath);
      console.log(`Synced directory: ${dir}`);
    }
  }

  for (let file of filesToDeleteInDest) {
    const destPath = path.join(destDir, file);
    if (fs.existsSync(destPath)) {
      try {
        fs.unlinkSync(destPath);
        console.log(`Removed data file in Clean: ${file}`);
      } catch (err) {
        console.log(`Could not remove data file ${file}: ${err.message}`);
      }
    }
  }

  // Xóa sạch các file đề thi sinh sẵn (cache) và trạng thái của học sinh cũ trong exams/
  const cleanExamsDir = path.join(destDir, 'exams');
  if (fs.existsSync(cleanExamsDir)) {
    const examFiles = fs.readdirSync(cleanExamsDir);
    for (let file of examFiles) {
      if (file.startsWith('pregen-std_') || file.startsWith('pregen_status_std_')) {
        try {
          fs.unlinkSync(path.join(cleanExamsDir, file));
          console.log(`Removed student exam cache file in Clean: ${file}`);
        } catch (err) {
          console.log(`Could not remove student exam cache file ${file}: ${err.message}`);
        }
      }
    }
  }

  // Đồng bộ các file đề thi mặc định từ HocTap/exams sang HocTap_Clean/exams (bỏ qua file cá nhân học sinh)
  const srcExamsDir = path.join(srcDir, 'exams');
  if (fs.existsSync(srcExamsDir)) {
    if (!fs.existsSync(cleanExamsDir)) {
      fs.mkdirSync(cleanExamsDir, { recursive: true });
    }
    const examFiles = fs.readdirSync(srcExamsDir);
    for (let file of examFiles) {
      if (!file.startsWith('pregen-std_') && !file.startsWith('pregen_status_std_') && !file.includes('_backup') && file !== 'pregen_status.json') {
        const srcPath = path.join(srcExamsDir, file);
        const destPath = path.join(cleanExamsDir, file);
        if (fs.statSync(srcPath).isFile()) {
          fs.copyFileSync(srcPath, destPath);
          console.log(`Synced default exam file: exams/${file}`);
        }
      }
    }
  }
  
  // Xóa thư mục chrome_profile và logs trong HocTap_Clean để tránh đóng gói file rác khổng lồ làm chậm quá trình cài đặt
  const cleanProfileDir = path.join(destDir, 'chrome_profile');
  if (fs.existsSync(cleanProfileDir)) {
    try {
      fs.rmSync(cleanProfileDir, { recursive: true, force: true });
      console.log('✅ Đã xóa thư mục chrome_profile rác trong Clean bundle.');
    } catch (err) {
      console.log(`⚠️ Không thể xóa chrome_profile: ${err.message}`);
    }
  }

  const cleanLogsDir = path.join(destDir, 'logs');
  if (fs.existsSync(cleanLogsDir)) {
    try {
      fs.rmSync(cleanLogsDir, { recursive: true, force: true });
      console.log('✅ Đã xóa thư mục logs rác trong Clean bundle.');
    } catch (err) {
      console.log(`⚠️ Không thể xóa logs: ${err.message}`);
    }
  }

  // Xóa các file exe rác thử nghiệm khác nếu có trong Clean bundle
  const garbageFiles = ['Cài đặt.exe', 'kiosk_lock_test.exe'];
  for (let file of garbageFiles) {
    const filePath = path.join(destDir, file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log(`✅ Đã xóa file rác: ${file}`);
      } catch (err) {
        console.log(`⚠️ Không thể xóa file rác ${file}: ${err.message}`);
      }
    }
  }
  // Dọn dẹp devDependencies rác (như Playwright, Jest) trong node_modules của Clean bundle để tối ưu hóa bộ cài
  const cleanNodeModules = path.join(destDir, 'node_modules');
  if (fs.existsSync(cleanNodeModules)) {
    console.log('🧹 Đang dọn dẹp devDependencies (Playwright, Jest...) trong node_modules của Clean bundle...');
    try {
      const { execSync } = require('child_process');
      execSync('npm prune --production', { cwd: destDir, stdio: 'inherit' });
      console.log('✅ Đã loại bỏ thành công devDependencies rác trong Clean bundle.');
    } catch (err) {
      console.log(`⚠️ Cảnh báo: Lỗi khi chạy npm prune: ${err.message}`);
    }
  }
  
  console.log('--- SYNC COMPLETED SUCCESSFULLY ---');
}

sync();
