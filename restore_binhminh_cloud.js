const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getDatabase } = require('firebase-admin/database');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// 1. Khởi tạo Firebase Admin SDK
const serviceAccount = require('./firebase-service-account.json');

let privateKey = serviceAccount.private_key;
if (privateKey && privateKey.includes('\\n')) {
  privateKey = privateKey.replace(/\\n/g, '\n');
}

const app = initializeApp({
  credential: cert({
    ...serviceAccount,
    private_key: privateKey
  }),
  databaseURL: "https://binhminhchamhoc-default-rtdb.firebaseio.com"
});

const dbFirestore = getFirestore(app);
const dbRealtime = getDatabase(app);

function getQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function runQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

async function run() {
  console.log('=== BẮT ĐẦU KHÔI PHỤC DỮ LIỆU TRẦN BÌNH MINH LÊN FIRESTORE CLOUD ===');

  const fDbPath = path.join(__dirname, 'database.db');
  const db = new sqlite3.Database(fDbPath);

  // Đọc dữ liệu tiến trình từ SQLite gốc ở ổ F
  const bmRow = await getQuery(db, 'SELECT state_json FROM student_progress WHERE student_id = ?', ['std_htsj4gbmo']);
  const bnRow = await getQuery(db, 'SELECT state_json FROM student_progress WHERE student_id = ?', ['std_baongoc']);
  
  db.close();

  if (!bmRow || !bmRow.state_json) {
    console.error('❌ Không tìm thấy dữ liệu Trần Bình Minh trong SQLite!');
    process.exit(1);
  }

  const bmState = JSON.parse(bmRow.state_json);
  console.log(`📊 Dữ liệu Trần Bình Minh thu thập được:`);
  console.log(` - Số bài học có điểm (scores): ${Object.keys(bmState.scores || {}).length}`);
  console.log(` - Số dạng bài hoàn thành (completedSubtopics): ${(bmState.completedSubtopics || []).length}`);
  console.log(` - Số bài lý thuyết xem (completedLessonTheory): ${(bmState.completedLessonTheory || []).length}`);
  console.log(` - Số phiên thi (examSessions): ${(bmState.examSessions || []).length}`);
  console.log(` - XP: ${bmState.xp}, _sharedXp: ${bmState._sharedXp}`);

  // Tìm document student sẵn có trên Firestore để lấy parentUid hiện tại của skyprotect@gmail.com
  let skyParentUid = "yTbIHSPyc0farDDksevSnDCsq7i2"; // Default fallback UID
  try {
    const stdDoc = await dbFirestore.collection('students').doc('std_htsj4gbmo').get();
    if (stdDoc.exists) {
      const data = stdDoc.data();
      if (data.parentUid) skyParentUid = data.parentUid;
      console.log(`🔍 Tìm thấy parentUid trên Firestore cho Trần Bình Minh: ${skyParentUid}`);
    }
  } catch (e) {
    console.warn("⚠️ Không đọc được parentUid cũ:", e.message);
  }

  // 1. Cập nhật Firestore document cho Trần Bình Minh
  const bmDocRef = dbFirestore.collection('students').doc('std_htsj4gbmo');
  await bmDocRef.set({
    studentId: 'std_htsj4gbmo',
    parentUid: skyParentUid,
    email: 'skyprotect@gmail.com',
    name: 'Trần Bình Minh',
    classLevel: '6',
    state_json: JSON.stringify(bmState),
    lastUpdated: new Date().toISOString()
  }, { merge: true });
  console.log('✅ Đã đẩy 100% dữ liệu học tập môn Toán của Trần Bình Minh lên Firestore!');

  // 2. Cập nhật Firestore document cho Trần Bảo Ngọc nếu có
  if (bnRow && bnRow.state_json) {
    const bnDocRef = dbFirestore.collection('students').doc('std_baongoc');
    await bnDocRef.set({
      studentId: 'std_baongoc',
      parentUid: skyParentUid,
      email: 'skyprotect@gmail.com',
      name: 'Trần Bảo Ngọc',
      classLevel: '1',
      state_json: bnRow.state_json,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    console.log('✅ Đã đẩy dữ liệu Trần Bảo Ngọc lên Firestore!');
  }

  // 3. Cập nhật config cho skyprotect@gmail.com trên Firestore
  const configSky = {
    parentName: "Phụ huynh",
    parentPin: "123456",
    studentName: "Trần Bình Minh",
    currentClass: "6",
    defaultStudentId: "std_htsj4gbmo",
    students: [
      { id: "std_htsj4gbmo", name: "Trần Bình Minh", classLevel: "6" },
      { id: "std_baongoc", name: "Trần Bảo Ngọc", classLevel: "1" }
    ]
  };

  await dbFirestore.collection('settings').doc(`config_${skyParentUid}`).set({
    parentUid: skyParentUid,
    email: 'skyprotect@gmail.com',
    value: JSON.stringify(configSky),
    lastUpdated: new Date().toISOString()
  }, { merge: true });
  console.log('✅ Đã cập nhật config skyprotect@gmail.com trên Firestore!');

  // 4. Đồng bộ lên Realtime Database (Leaderboard)
  const leaderboardRef = dbRealtime.ref(`leaderboard/std_htsj4gbmo`);
  await leaderboardRef.update({
    studentId: 'std_htsj4gbmo',
    name: 'Trần Bình Minh',
    mathXp: bmState.xp || 210,
    lastUpdated: new Date().toISOString()
  });
  console.log('✅ Đã cập nhật Realtime Database Leaderboard!');

  // 5. Cập nhật trực tiếp CSDL SQLite ở ổ C (nếu C:\Program Files (x86)\ToanHocKiosk\database.db tồn tại)
  const cDbPath = 'C:\\Program Files (x86)\\ToanHocKiosk\\database.db';
  if (fs.existsSync(cDbPath)) {
    console.log('📂 Phát hiện cơ sở dữ liệu ở ổ C:', cDbPath);
    const cDb = new sqlite3.Database(cDbPath);
    try {
      await runQuery(cDb, 'INSERT OR REPLACE INTO student_progress (student_id, state_json) VALUES (?, ?)', ['std_htsj4gbmo', JSON.stringify(bmState)]);
      if (bnRow && bnRow.state_json) {
        await runQuery(cDb, 'INSERT OR REPLACE INTO student_progress (student_id, state_json) VALUES (?, ?)', ['std_baongoc', bnRow.state_json]);
      }
      await runQuery(cDb, "INSERT OR REPLACE INTO settings (key, value) VALUES ('config', ?)", [JSON.stringify(configSky)]);
      console.log('✅ Đã cập nhật trực tiếp 100% dữ liệu vào SQLite ổ C!');
    } catch (err) {
      console.error('⚠️ Lỗi cập nhật SQLite ổ C:', err.message);
    } finally {
      cDb.close();
    }
  }

  console.log('🎉 HOÀN THÀNH KHÔI PHỤC DỮ LIỆU TRẦN BÌNH MINH!');
  process.exit(0);
}

run().catch(err => {
  console.error('❌ Lỗi:', err);
  process.exit(1);
});
