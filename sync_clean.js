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
  
  console.log('--- SYNC COMPLETED SUCCESSFULLY ---');
}

sync();
