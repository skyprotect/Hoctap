const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const serviceAccount = require('./firebase-service-account.json');

let privateKey = serviceAccount.private_key;
if (privateKey.includes('\\n')) {
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

function getQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function run() {
  console.log('=== ĐẨY DỮ LIỆU TỪ SQLITE LÊN FIRESTORE (ADMIN SDK) ===');
  
  const fDbPath = path.join(__dirname, 'database.db');
  const db = new sqlite3.Database(fDbPath);

  // 1. Đọc dữ liệu từ SQLite
  const bmRow = await getQuery(db, 'SELECT state_json FROM student_progress WHERE student_id = ?', ['std_htsj4gbmo']);
  const dpRow = await getQuery(db, 'SELECT state_json FROM student_progress WHERE student_id = ?', ['std_tyc0gfnkz']);
  
  const configRow = await getQuery(db, "SELECT value FROM settings WHERE key = 'config'");
  const parentSessionRow = await getQuery(db, "SELECT value FROM settings WHERE key = 'parent_session'");
  
  db.close();

  let parentUid = "yTbIHSPyc0farDDksevSnDCsq7i2";
  if (parentSessionRow && parentSessionRow.value) {
    try {
      const sess = JSON.parse(parentSessionRow.value);
      if (sess.parentUid) parentUid = sess.parentUid;
    } catch(e){}
  }

  console.log('Parent UID:', parentUid);

  if (bmRow && bmRow.state_json) {
    await dbFirestore.collection('students').doc('std_htsj4gbmo').set({
      studentId: 'std_htsj4gbmo',
      parentUid: parentUid,
      name: 'Trần Bình Minh',
      classLevel: '6',
      state_json: bmRow.state_json,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    console.log('✅ Đã cập nhật student_progress Trần Bình Minh lên Firestore!');
  }

  if (dpRow && dpRow.state_json) {
    await dbFirestore.collection('students').doc('std_tyc0gfnkz').set({
      studentId: 'std_tyc0gfnkz',
      parentUid: parentUid,
      name: 'Trần Đức Phúc',
      classLevel: '4',
      state_json: dpRow.state_json,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    console.log('✅ Đã cập nhật student_progress Trần Đức Phúc lên Firestore!');
  }

  if (configRow && configRow.value) {
    await dbFirestore.collection('settings').doc(`config_${parentUid}`).set({
      parentUid: parentUid,
      value: configRow.value,
      lastUpdated: new Date().toISOString()
    }, { merge: true });
    console.log('✅ Đã cập nhật config lên Firestore!');
  }

  console.log('🎉 HOÀN THÀNH ĐỒNG BỘ FIRESTORE THÀNH CÔNG!');
  process.exit(0);
}

run().catch(err => {
  console.error('Lỗi đẩy Firestore:', err);
  process.exit(1);
});
