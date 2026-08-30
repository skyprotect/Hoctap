/**
 * ADMIN ROUTES
 * Các endpoints cấu hình, quản trị, API keys và đồng bộ
 */
const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/admin.controller');
const authCtrl = require('../controllers/auth.controller');
const { authenticateAdminToken } = require('../middleware/auth.middleware');

// Xác thực Admin & PIN (hỗ trợ cả đường dẫn /api/admin/login và /api/verify-pin)
router.post('/admin/login', authCtrl.adminLogin);
router.post('/verify-pin', authCtrl.verifyPin);

// Quản lý API Keys
router.get('/api-keys', authenticateAdminToken, adminCtrl.getApiKeys);
router.post('/save-api-keys', authenticateAdminToken, adminCtrl.saveApiKeys);
router.post('/test-api-keys', authenticateAdminToken, adminCtrl.testApiKeys);

// Quản lý Cấu hình
router.get('/load-config', adminCtrl.loadConfig);
router.post('/save-config', adminCtrl.saveConfig);
router.post('/setup-initial', adminCtrl.setupInitial);

// Đồng bộ dữ liệu
router.get('/sync/local-data', adminCtrl.syncLocalData);
router.post('/sync/save-pulled-data', adminCtrl.syncSavePulledData);

// Điều khiển Kiosk
router.post('/exit-kiosk', authenticateAdminToken, adminCtrl.exitKiosk);

module.exports = router;
