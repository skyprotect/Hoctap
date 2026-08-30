/**
 * ADMIN CONTROLLER
 * Xử lý cài đặt phụ huynh, xác thực và cấu hình hệ thống
 */
const { generateToken } = require('../services/auth.service');

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY || "AIzaSyDOewYQ-Jwfwg_NU_JpW6w-05NwkMAjaXo",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "binhminhchamhoc.firebaseapp.com",
    databaseURL: process.env.FIREBASE_DATABASE_URL || "https://binhminhchamhoc-default-rtdb.firebaseio.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "binhminhchamhoc",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "binhminhchamhoc.firebasestorage.app",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "1033910156653",
    appId: process.env.FIREBASE_APP_ID || "1:1033910156653:web:5e57eabcff563054842e64",
    measurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-367K48DJD6"
};

function getFirebaseConfig(req, res) {
    res.json(firebaseConfig);
}

function adminLogin(req, res) {
    const { pin } = req.body;
    const correctPin = process.env.PARENT_PIN || "123456";
    if (pin === correctPin) {
        const token = generateToken({ role: 'admin' });
        return res.json({ success: true, token });
    }
    return res.status(401).json({ error: "Mã PIN không đúng!" });
}

function reportClientError(req, res) {
    const { studentId, errorMessage, errorStack } = req.body;
    console.warn('[ClientTelemetry] Error from ' + studentId + ':', errorMessage);
    res.json({ success: true });
}

module.exports = {
    getFirebaseConfig,
    adminLogin,
    reportClientError
};
