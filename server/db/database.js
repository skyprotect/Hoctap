/**
 * DATABASE ACCESS LAYER (DAL)
 * Kết nối CSDL SQLite cục bộ và cung cấp các hàm DAO
 */
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.resolve(__dirname, '../../database.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('❌ Lỗi kết nối CSDL SQLite:', err.message);
    } else {
        console.log('📦 Đã kết nối thành công CSDL SQLite tại:', DB_PATH);
    }
});

// Helper chạy query Promise
function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function dbAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function dbGet(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

module.exports = {
    db,
    dbRun,
    dbAll,
    dbGet,
    DB_PATH
};
