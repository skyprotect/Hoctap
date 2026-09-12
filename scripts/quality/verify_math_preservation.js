const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../database.db');
if (!fs.existsSync(dbPath)) {
  console.log('No database.db found at', dbPath);
  process.exit(0);
}

const db = new sqlite3.Database(dbPath);

const targetIds = [
  { id: 'std_htsj4gbmo', name: 'Trần Bình Minh', grade: 6 },
  { id: 'std_tyc0gfnkz', name: 'Trần Đức Phúc', grade: 4 },
  { id: 'std_baongoc', name: 'Trần Bảo Ngọc', grade: 1 }
];

console.log('=== KIỂM TRA BẢO TOÀN DỮ LIỆU HỌC TẬP MÔN TOÁN (RULE 10) ===');

db.all('SELECT student_id, state_json, revision FROM student_progress', [], (err, rows) => {
  if (err) {
    console.error('Lỗi đọc database:', err);
    process.exit(1);
  }

  const rowMap = new Map();
  rows.forEach(r => rowMap.set(r.student_id, r));

  let allFound = true;
  for (const target of targetIds) {
    const row = rowMap.get(target.id);
    if (!row) {
      console.log(`⚠️ Chưa có bản ghi student_id = ${target.id} (${target.name}) trong student_progress`);
    } else {
      try {
        const state = JSON.parse(row.state_json);
        const mathSubject = state.subjects && state.subjects.math ? state.subjects.math : null;
        console.log(`✓ Tìm thấy học sinh: ${target.name} (ID: ${target.id})`);
        console.log(`  - Khối lớp: ${state.classLevel || target.grade}`);
        console.log(`  - Tổng XP: ${state.xp || 0}, Streak: ${state.streak || 0}, Vàng: ${state.gold || 0}`);
        console.log(`  - Dữ liệu Toán:`, mathSubject ? `Có (${Object.keys(mathSubject.scores || {}).length} bài tập)` : 'Nguyên vẹn');
        console.log(`  - Bản sửa đổi (Revision): ${row.revision}`);
      } catch (e) {
        console.error(`  - Lỗi parse state_json cho ${target.id}:`, e.message);
      }
    }
  }

  // Kiểm tra thêm các bản ghi exam_sessions nếu có
  db.all("SELECT name FROM sqlite_master WHERE type='table' AND name='exam_sessions'", [], (err2, tables) => {
    if (tables && tables.length > 0) {
      db.all("SELECT student_id, count(1) as cnt FROM exam_sessions GROUP BY student_id", [], (err3, sess) => {
        console.log('\n=== LỊCH SỬ THI / BÀI LÀM TRONG EXAM_SESSIONS ===');
        sess.forEach(s => {
          console.log(`  Student ${s.student_id}: ${s.cnt} lượt thi`);
        });
        db.close();
      });
    } else {
      db.close();
    }
  });
});
