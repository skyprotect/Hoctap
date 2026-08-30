const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../..');
const destDir = path.resolve(srcDir, '../HocTap_Clean');

const filesToSync = [
  'server.js',
  'sw.js',
  'student.html',
  'parent.html',
  'parent_remote.html',
  'kiosk_lock.cs',
  'kiosk_lock.exe',
  'installer.iss',
  'README.md',
  'MASTER_SYSTEM_ARCHITECTURE.md',
  'js/app.js',
  'js/lessons.js',
  'js/english_data.js',
  'js/parent.js',
  'js/game.js',
  'js/question-generator-worker.js',
  'js/remove-bg-worker.js',
  'css/style.css',
  '.env.example',
  'version.json',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'Bat dau hoc.vbs',
  'Dung hoc.vbs'
];

const dirsToSync = [
  'js/lib',
  'js/core',
  'js/engine',
  'js/features',
  'js/modules',
  'css',
  'images',
  'sounds',
  'dataEnglish',
  'chibi',
  'data',
  'server',
  'templates',
  'scripts/build',
  'scripts/database',
  'scripts/maintenance',
  'dist/apk'
];

const filesToDeleteInDest = [
  'database.db',
  'database.db-wal',
  'database.db-shm',
  'database.db.old',
  'database.db-wal.old',
  'database.db-shm.old',
  'database.db.backup',
  'database.db.backup_truoc_khi_giam_xp',
  '.port.tmp',
  'firebase-service-account.json',
  '.env',
  'kiosk_lock.log',
  'kiosk_exit_flag.tmp',
  'debug.log',
  'node_error.log',
  '🚀 Bắt đầu học.vbs',
  '⏹ Dừng học.vbs',
  'TabletLock_Kiosk.apk',
  'TabletLock_Kiosk_Downloaded.apk',
  'release.js',
  'release_apk.js',
  'sync_clean.js',
  'convert_icon.js',
  'check_bm_history.js',
  'check_card_history.js',
  'check_progress.js',
  'check_state_json.js',
  'check_students.js',
  'dump_db.js',
  'inspect_cards.js',
  'test_inspect_cloud.js',
  'verify_293003.js',
  'convert_gold_cards.js',
  'get_firebase_tokens.js',
  'push_to_firestore_admin.js',
  'query_firebase.js',
  'restore_binhminh_cloud.js',
  'smart_merge_db.js',
  'sync_to_firestore_rest.js',
  'temp_sync_firestore.js',
  'update_ducphuc.js',
  'update_gold.js',
  'scratch.js', 'scratch2.js', 'scratch3.js', 'scratch4.js',
  'scratch5.js', 'scratch6.js', 'scratch7.js', 'scratch8.js',
  'fix_app.js', 'search_db_temp.js', 'test_start.vbs'
];

function copyFileSync(src, dest) {
  const destParent = path.dirname(dest);
  if (!fs.existsSync(destParent)) {
    fs.mkdirSync(destParent, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}

function copyDirSync(src, dest, cleanBefore = false) {
  if (cleanBefore && fs.existsSync(dest)) {
    try {
      fs.rmSync(dest, { recursive: true, force: true });
    } catch (e) {}
  }
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath, false);
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
      copyDirSync(srcPath, destPath, true);
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

  const cleanBackupsDir = path.join(destDir, 'backups');
  if (fs.existsSync(cleanBackupsDir)) {
    try {
      fs.rmSync(cleanBackupsDir, { recursive: true, force: true });
      console.log('✅ Đã xóa thư mục backups cá nhân trong Clean bundle.');
    } catch (err) {
      console.log(`⚠️ Không thể xóa backups: ${err.message}`);
    }
  }

  const cleanExportedExamsDir = path.join(destDir, 'exported_exams');
  if (fs.existsSync(cleanExportedExamsDir)) {
    try {
      fs.rmSync(cleanExportedExamsDir, { recursive: true, force: true });
      console.log('✅ Đã xóa thư mục exported_exams trong Clean bundle.');
    } catch (err) {
      console.log(`⚠️ Không thể xóa exported_exams: ${err.message}`);
    }
  }

  const cleanTestResultsDir = path.join(destDir, 'test-results');
  if (fs.existsSync(cleanTestResultsDir)) {
    try {
      fs.rmSync(cleanTestResultsDir, { recursive: true, force: true });
      console.log('✅ Đã xóa thư mục test-results trong Clean bundle.');
    } catch (err) {
      console.log(`⚠️ Không thể xóa test-results: ${err.message}`);
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
  // Đảm bảo cài đặt đầy đủ và dọn dẹp các production dependencies của Clean bundle (loại bỏ các devDependencies rác)
  console.log('🧹 Đang cài đặt production dependencies trong node_modules của Clean bundle...');
  try {
    const { execSync } = require('child_process');
    execSync('npm install --omit=dev', { cwd: destDir, stdio: 'inherit' });
    const cleanTsNode = path.join(destDir, 'node_modules', 'ts-node');
    const cleanTypescript = path.join(destDir, 'node_modules', 'typescript');
    if (fs.existsSync(cleanTsNode) && fs.existsSync(cleanTypescript)) {
      console.log('✅ Đã xác thực ts-node và typescript có mặt trong Clean bundle.');
    } else {
      console.error('❌ LỖI: ts-node hoặc typescript chưa được cài đặt trong Clean bundle!');
      throw new Error('Thiếu ts-node/typescript trong Clean bundle');
    }
    console.log('✅ Đã hoàn tất cài đặt production dependencies trong Clean bundle.');
  } catch (err) {
    console.error(`❌ Lỗi khi chạy npm install ở Clean bundle: ${err.message}`);
    throw err;
  }
  
  console.log('--- SYNC COMPLETED SUCCESSFULLY ---');
}

sync();
