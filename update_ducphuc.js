const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

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

async function updateStudent(dbPath) {
  if (!fs.existsSync(dbPath)) {
    console.log(`Bỏ qua: ${dbPath} (tệp không tồn tại)`);
    return;
  }

  const db = new sqlite3.Database(dbPath);
  const row = await getQuery(db, 'SELECT state_json FROM student_progress WHERE student_id = ?', ['std_tyc0gfnkz']);

  let state = {};
  if (row && row.state_json) {
    try { state = JSON.parse(row.state_json); } catch(e){}
  }

  // 1. Giảm XP xuống 300
  state.xp = 300;
  state.englishXp = 300;
  state._sharedXp = 300;

  // 2. Chỉnh thẻ mạ vàng: Chỉ còn 2 thẻ chưa quy đổi, 3 thẻ đã quy đổi
  state.goldSkills = [
    'listening_master',
    'speaking_pro',
    'reading_wizard',
    'gold_collector',
    'subtopic_expert'
  ];

  // 3 thẻ đã quy đổi: reading_wizard, gold_collector, subtopic_expert
  // 2 thẻ chưa quy đổi: listening_master, speaking_pro
  state.redeemedSkills = [
    'reading_wizard',
    'gold_collector',
    'subtopic_expert'
  ];

  state.cardExchangeHistory = [
    {
      cardId: 'reading_wizard',
      cardName: 'Reading Sage (Thẻ Tiếng Anh)',
      device: 'Máy tính bảng (Tablet)',
      redeemedAt: '2026-07-20T05:27:02.213Z'
    },
    {
      cardId: 'gold_collector',
      cardName: 'Gold Collector (Thẻ Tiếng Anh)',
      device: 'Máy tính bảng (Tablet)',
      redeemedAt: '2026-07-20T05:27:02.213Z'
    },
    {
      cardId: 'subtopic_expert',
      cardName: 'Subtopic Expert (Thẻ Tiếng Anh)',
      device: 'Máy tính bảng (Tablet)',
      redeemedAt: '2026-07-20T05:27:02.213Z'
    }
  ];

  state.lastUpdated = new Date().toISOString();

  await runQuery(db, 'INSERT OR REPLACE INTO student_progress (student_id, state_json) VALUES (?, ?)', [
    'std_tyc0gfnkz',
    JSON.stringify(state)
  ]);

  db.close();
  console.log(`✅ Đã cập nhật tài khoản Trần Đức Phúc (std_tyc0gfnkz) tại ${dbPath}`);
}

async function main() {
  console.log('=== CẬP NHẬT TÀI KHOẢN TRẦN ĐỨC PHÚC (300 XP, 2 THẺ CHƯA QUY ĐỔI) ===');
  await updateStudent(path.join(__dirname, 'database.db'));
  await updateStudent('C:\\Program Files (x86)\\ToanHocKiosk\\database.db');
}

main();
