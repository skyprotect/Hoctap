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

function mergeStudentState(localState, cloudState) {
  if (!localState) return cloudState || {};
  if (!cloudState) return localState || {};

  const merged = { ...cloudState, ...localState };

  merged.xp = Math.max(localState.xp || 0, cloudState.xp || 0);
  merged.englishXp = Math.max(localState.englishXp || 0, cloudState.englishXp || 0);
  merged.streak = Math.max(localState.streak || 0, cloudState.streak || 0);
  merged.distractions = Math.max(localState.distractions || 0, cloudState.distractions || 0);

  const unionArray = (a1, a2) => Array.from(new Set([...(a1 || []), ...(a2 || [])]));
  merged.badges = unionArray(localState.badges, cloudState.badges);
  merged.goldBadges = unionArray(localState.goldBadges, cloudState.goldBadges);
  merged.completedSubtopics = unionArray(localState.completedSubtopics, cloudState.completedSubtopics);
  merged.completedLessonTheory = unionArray(localState.completedLessonTheory, cloudState.completedLessonTheory);
  merged.goldSkills = unionArray(localState.goldSkills, cloudState.goldSkills);
  merged.redeemedSkills = unionArray(localState.redeemedSkills, cloudState.redeemedSkills);
  merged.rewarded100PercentLessons = unionArray(localState.rewarded100PercentLessons, cloudState.rewarded100PercentLessons);

  const mergeMaxObject = (o1, o2) => {
    const res = { ...(o1 || {}), ...(o2 || {}) };
    const allKeys = new Set([...Object.keys(o1 || {}), ...Object.keys(o2 || {})]);
    for (const k of allKeys) {
      const v1 = (o1 && o1[k] !== undefined) ? o1[k] : 0;
      const v2 = (o2 && o2[k] !== undefined) ? o2[k] : 0;
      if (typeof v1 === 'number' && typeof v2 === 'number') {
        res[k] = Math.max(v1, v2);
      }
    }
    return res;
  };

  merged.scores = mergeMaxObject(localState.scores, cloudState.scores);
  merged.subtopicScores = mergeMaxObject(localState.subtopicScores, cloudState.subtopicScores);
  merged.levelScores = mergeMaxObject(localState.levelScores, cloudState.levelScores);

  if (localState.englishState || cloudState.englishState) {
    const eLocal = localState.englishState || {};
    const eCloud = cloudState.englishState || {};
    merged.englishState = {
      ...eCloud,
      ...eLocal,
      skillScores: mergeMaxObject(eLocal.skillScores, eCloud.skillScores)
    };
  }

  merged.lastUpdated = new Date().toISOString();
  return merged;
}

async function run() {
  console.log('=== BẮT ĐẦU ĐỒNG BỘ THÔNG MINH GIỮA Ổ F VÀ Ổ C ===');

  const fDbPath = path.join(__dirname, 'database.db');
  const cDbPath = 'C:\\Program Files (x86)\\ToanHocKiosk\\database.db';

  if (!fs.existsSync(fDbPath)) {
    console.error('Không tìm thấy database.db ở ổ F');
    return;
  }

  const fDb = new sqlite3.Database(fDbPath);
  const fRow = await getQuery(fDb, 'SELECT state_json FROM student_progress WHERE student_id = ?', ['std_htsj4gbmo']);
  fDb.close();

  let cState = null;
  if (fs.existsSync(cDbPath)) {
    const cDb = new sqlite3.Database(cDbPath);
    const cRow = await getQuery(cDb, 'SELECT state_json FROM student_progress WHERE student_id = ?', ['std_htsj4gbmo']);
    if (cRow && cRow.state_json) {
      cState = JSON.parse(cRow.state_json);
    }
    cDb.close();
  }

  const fState = fRow && fRow.state_json ? JSON.parse(fRow.state_json) : null;

  console.log('F State summary:', fState ? { xp: fState.xp, streak: fState.streak, subtopics: fState.completedSubtopics?.length } : null);
  console.log('C State summary:', cState ? { xp: cState.xp, streak: cState.streak, subtopics: cState.completedSubtopics?.length } : null);

  const merged = mergeStudentState(fState, cState);
  console.log('🎉 MERGED Result:', {
    xp: merged.xp,
    englishXp: merged.englishXp,
    streak: merged.streak,
    completedSubtopics: merged.completedSubtopics?.length,
    levelScoresCount: merged.levelScores ? Object.keys(merged.levelScores).length : 0
  });

  const mergedJson = JSON.stringify(merged);

  // Ghi lại ổ F
  const fDbWrite = new sqlite3.Database(fDbPath);
  await runQuery(fDbWrite, 'INSERT OR REPLACE INTO student_progress (student_id, state_json) VALUES (?, ?)', ['std_htsj4gbmo', mergedJson]);
  fDbWrite.close();
  console.log('✅ Đã ghi dữ liệu gộp vào SQLite ổ F!');

  // Ghi lại ổ C nếu tồn tại
  if (fs.existsSync(cDbPath)) {
    const cDbWrite = new sqlite3.Database(cDbPath);
    await runQuery(cDbWrite, 'INSERT OR REPLACE INTO student_progress (student_id, state_json) VALUES (?, ?)', ['std_htsj4gbmo', mergedJson]);
    cDbWrite.close();
    console.log('✅ Đã ghi dữ liệu gộp vào SQLite ổ C!');
  }
}

run();
