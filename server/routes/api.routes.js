/**
 * API ROUTES
 * Tập trung khai báo và phân phối toàn bộ Endpoint của ứng dụng
 */
const express = require('express');
const router = express.Router();

const studentCtrl = require('../controllers/student.controller');
const adminCtrl = require('../controllers/admin.controller');

// Student endpoints
router.get('/student-info', studentCtrl.getStudentInfo);
router.post('/save-progress', studentCtrl.saveProgress);

// Admin & Config endpoints
router.get('/firebase-config', adminCtrl.getFirebaseConfig);
router.post('/admin/login', adminCtrl.adminLogin);
router.post('/report-client-error', adminCtrl.reportClientError);

module.exports = router;
