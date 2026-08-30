/**
 * AUTH ROUTES
 * Các endpoints xác thực người dùng và phụ huynh
 */
const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');

// Đăng nhập Google & Quản lý Session
router.get('/google-client-id', authCtrl.getGoogleClientId);
router.get('/session', authCtrl.getSession);
router.post('/google-login', authCtrl.googleLogin);
router.post('/logout', authCtrl.logout);

// Đăng nhập Admin & Xác thực PIN
router.post('/login', authCtrl.adminLogin);
router.post('/verify-pin', authCtrl.verifyPin);

module.exports = router;
