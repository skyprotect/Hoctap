const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Khởi tạo Firebase Admin với file key
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://binhminhchamhoc-default-rtdb.firebaseio.com"
});

const dbFirestore = admin.firestore();
const dbRealtime = admin.database();

async function run() {
  console.log('--- BẮT ĐẦU CẬP NHẬT TRÊN FIRESTORE & FIREBASE RTDB ---');
  
  const studentId = 'std_htsj4gbmo';
  
  try {
    // 1. Đọc document từ Firestore
    const studentDocRef = dbFirestore.collection('students').doc(studentId);
    const doc = await studentDocRef.get();
    
    if (!doc.exists) {
      console.error(`Không tìm thấy học sinh ${studentId} trên Firestore.`);
      process.exit(1);
    }
    
    const data = doc.data();
    const state = JSON.parse(data.state_json);
    
    console.log(`XP Toán hiện tại trên Firestore: ${state.xp}`);
    
    // Thay đổi XP thành 1500
    state.xp = 1500;
    
    // Cập nhật lại Firestore
    await studentDocRef.update({
      state_json: JSON.stringify(state),
      lastUpdated: new Date().toISOString()
    });
    console.log('Đã cập nhật state_json trên Firestore thành công (xp = 1500).');
    
    // 2. Cập nhật Realtime Database (Leaderboard)
    const leaderboardRef = dbRealtime.ref(`leaderboard/${studentId}`);
    await leaderboardRef.update({
      mathXp: 1500,
      lastUpdated: new Date().toISOString()
    });
    console.log('Đã cập nhật mathXp trên Firebase RTDB Leaderboard thành công (mathXp = 1500).');

    // 3. Cập nhật SQLite cục bộ ở ổ C (nếu có thể)
    const cDbPath = 'C:\\Program Files (x86)\\ToanHocKiosk\\database.db';
    if (fs.existsSync(cDbPath)) {
      const sqlite3 = require('sqlite3').verbose();
      const cDb = new sqlite3.Database(cDbPath);
      
      const runQuery = (db, sql, params = []) => new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve(this);
        });
      });

      const getQuery = (db, sql, params = []) => new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      try {
        const row = await getQuery(cDb, 'SELECT state_json FROM student_progress WHERE student_id = ?', [studentId]);
        if (row) {
          const localState = JSON.parse(row.state_json);
          localState.xp = 1500;
          await runQuery(cDb, 'UPDATE student_progress SET state_json = ? WHERE student_id = ?', [JSON.stringify(localState), studentId]);
          console.log('Đã cập nhật SQLite cục bộ ở ổ C thành công.');
        }
        
        // Cập nhật cache leaderboard trong settings
        const settingRow = await getQuery(cDb, "SELECT value FROM settings WHERE key = 'leaderboard_english_cache'");
        if (settingRow) {
          let cache = JSON.parse(settingRow.value);
          if (Array.isArray(cache)) {
            cache = cache.map(item => {
              if (item.studentId === studentId) {
                item.mathXp = 1500;
                item.lastUpdated = new Date().toISOString();
              }
              return item;
            });
            await runQuery(cDb, "UPDATE settings SET value = ? WHERE key = 'leaderboard_english_cache'", [JSON.stringify(cache)]);
            console.log('Đã cập nhật leaderboard_english_cache trong SQLite ổ C.');
          }
        }
      } catch (err) {
        console.error('Lỗi khi cập nhật SQLite ổ C:', err.message);
      } finally {
        cDb.close();
      }
    }

    // 4. Cập nhật SQLite cục bộ ở ổ F
    const fDbPath = './database.db';
    if (fs.existsSync(fDbPath)) {
      const sqlite3 = require('sqlite3').verbose();
      const fDb = new sqlite3.Database(fDbPath);
      
      const runQuery = (db, sql, params = []) => new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve(this);
        });
      });

      const getQuery = (db, sql, params = []) => new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      try {
        const row = await getQuery(fDb, 'SELECT state_json FROM student_progress WHERE student_id = ?', [studentId]);
        if (row) {
          const localState = JSON.parse(row.state_json);
          localState.xp = 1500;
          await runQuery(fDb, 'UPDATE student_progress SET state_json = ? WHERE student_id = ?', [JSON.stringify(localState), studentId]);
          console.log('Đã cập nhật SQLite cục bộ ở ổ F thành công.');
        }

        // Cập nhật cache
        for (const key of ['leaderboard_math_cache', 'leaderboard_english_cache']) {
          const settingRow = await getQuery(fDb, "SELECT value FROM settings WHERE key = ?", [key]);
          if (settingRow) {
            let cache = JSON.parse(settingRow.value);
            if (Array.isArray(cache)) {
              cache = cache.map(item => {
                if (item.studentId === studentId) {
                  item.mathXp = 1500;
                  item.lastUpdated = new Date().toISOString();
                }
                return item;
              });
              await runQuery(fDb, "UPDATE settings SET value = ? WHERE key = ?", [JSON.stringify(cache), key]);
              console.log(`Đã cập nhật ${key} trong SQLite ổ F.`);
            }
          }
        }
      } catch (err) {
        console.error('Lỗi khi cập nhật SQLite ổ F:', err.message);
      } finally {
        fDb.close();
      }
    }

    console.log('--- HOÀN THÀNH CẬP NHẬT TOÀN DIỆN ---');
  } catch (err) {
    console.error('Lỗi khi chạy script:', err);
  } finally {
    process.exit(0);
  }
}

run();
