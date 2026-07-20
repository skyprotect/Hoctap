const httpFetch = globalThis.fetch || require('node-fetch');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const API_KEY = "AIzaSyDOewYQ-Jwfwg_NU_JpW6w-05NwkMAjaXo";
const PROJECT_ID = "binhminhchamhoc";
const FIRESTORE_BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/students`;

function getQuery(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

async function run() {
  console.log('=== ĐỌC THÔNG TIN TỪ SQLITE VÀ GỬI LÊN FIRESTORE REST API ===');
  
  const fDbPath = path.join(__dirname, 'database.db');
  const db = new sqlite3.Database(fDbPath);

  // 1. Đọc state của Bình Minh & Đức Phúc từ SQLite
  const bmRow = await getQuery(db, 'SELECT state_json FROM student_progress WHERE student_id = ?', ['std_htsj4gbmo']);
  const dpRow = await getQuery(db, 'SELECT state_json FROM student_progress WHERE student_id = ?', ['std_tyc0gfnkz']);
  
  db.close();

  if (!bmRow || !dpRow) {
    console.error('Không tìm thấy dữ liệu trong SQLite!');
    return;
  }

  const bmState = bmRow.state_json;
  const dpState = dpRow.state_json;

  // Thử đọc document qua Firestore REST API
  try {
    const getBmUrl = `${FIRESTORE_BASE_URL}/std_htsj4gbmo?key=${API_KEY}`;
    const resBm = await httpFetch(getBmUrl);
    console.log('Get Firestore Bình Minh status:', resBm.status);
    const bmDoc = await resBm.json();
    console.log('Firestore Bình Minh doc sample:', JSON.stringify(bmDoc).slice(0, 200));

    const getDpUrl = `${FIRESTORE_BASE_URL}/std_tyc0gfnkz?key=${API_KEY}`;
    const resDp = await httpFetch(getDpUrl);
    console.log('Get Firestore Đức Phúc status:', resDp.status);
    const dpDoc = await resDp.json();
    console.log('Firestore Đức Phúc doc sample:', JSON.stringify(dpDoc).slice(0, 200));
  } catch (err) {
    console.error('Lỗi REST API Firestore:', err.message);
  }
}

run();
