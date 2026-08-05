const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

async function processDb(dbPath) {
  if (!fs.existsSync(dbPath)) {
    console.log(`⚠️ Không tìm thấy CSDL tại: ${dbPath}`);
    return;
  }
  console.log(`\n📁 Đang xử lý CSDL tại: ${dbPath}`);
  const db = new sqlite3.Database(dbPath);

  const runQuery = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

  const getQuery = (sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

  const studentIds = ['std_htsj4gbmo', 'std_tyc0gfnkz'];

  for (const studentId of studentIds) {
    const row = await getQuery('SELECT * FROM student_progress WHERE student_id = ?', [studentId]);
    if (!row) {
      console.log(`  - Không tìm thấy dữ liệu học sinh ${studentId} trong CSDL này.`);
      continue;
    }

    let state = {};
    try { state = JSON.parse(row.state_json); } catch(e){}

    if (!state.goldSkills) state.goldSkills = [];
    if (!state.redeemedSkills) state.redeemedSkills = [];
    if (!state.cardExchangeHistory) state.cardExchangeHistory = [];
    if (!state.goldBadges) state.goldBadges = [];

    const goldSkillsToRedeem = state.goldSkills.filter(id => !state.redeemedSkills.includes(id));
    const mathBadgesToRedeem = [...state.goldBadges];

    const name = (state.student && state.student.name) || (studentId === 'std_htsj4gbmo' ? 'Trần Bình Minh' : 'Trần Đức Phúc');
    console.log(`\n  👦 学 生: ${name} (${studentId})`);
    console.log(`     - Số thẻ Tiếng Anh mạ vàng sẽ quy đổi: ${goldSkillsToRedeem.length} (${goldSkillsToRedeem.join(', ') || 'Không có'})`);
    console.log(`     - Số huy hiệu Toán mạ vàng sẽ quy đổi: ${mathBadgesToRedeem.length} (${mathBadgesToRedeem.join(', ') || 'Không có'})`);

    // Chuyển thẻ Tiếng Anh sang đã quy đổi
    goldSkillsToRedeem.forEach(cardId => {
      if (!state.redeemedSkills.includes(cardId)) {
        state.redeemedSkills.push(cardId);
      }
      state.cardExchangeHistory.push({
        cardId: cardId,
        cardName: `Thẻ mạ vàng ${cardId}`,
        type: "english_skill",
        device: "Quy đổi theo yêu cầu Phụ huynh",
        redeemedAt: new Date().toISOString()
      });
    });

    // Chuyển huy hiệu Toán sang đã quy đổi
    mathBadgesToRedeem.forEach(badgeId => {
      state.cardExchangeHistory.push({
        cardId: badgeId,
        cardName: `Huy hiệu Toán mạ vàng ${badgeId}`,
        type: "math_badge",
        device: "Quy đổi theo yêu cầu Phụ huynh",
        redeemedAt: new Date().toISOString()
      });
    });

    // Xóa huy hiệu mạ vàng khỏi mảng chờ quy đổi
    state.goldBadges = [];

    const updatedStateJson = JSON.stringify(state);
    const nowIso = new Date().toISOString();

    await runQuery(
      'UPDATE student_progress SET state_json = ? WHERE student_id = ?',
      [updatedStateJson, studentId]
    );
    console.log(`     ✅ Đã chuyển toàn bộ thẻ mạ vàng của ${name} thành THẺ ĐÃ QUY ĐỔI thành công!`);
  }

  db.close();
}

async function run() {
  await processDb(path.join(__dirname, 'database.db'));
  await processDb('C:\\Program Files (x86)\\ToanHocKiosk\\database.db');
  await processDb('F:\\KHQS\\AntiGravity\\HocTap_Clean\\database.db');
  console.log("\n🎉 HOÀN THÀNH QUY ĐỔI TOÀN BỘ THẺ MẠ VÀNG CHO TRẦN BÌNH MINH VÀ TRẦN ĐỨC PHÚC!");
}

run().catch(console.error);
