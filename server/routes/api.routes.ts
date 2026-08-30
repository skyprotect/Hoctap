/**
 * API ROUTES
 * Tập trung khai báo và phân phối toàn bộ Endpoint của ứng dụng
 */
import { Router } from 'express';
import * as studentCtrl from '../controllers/student.controller';
import * as adminCtrl from '../controllers/admin.controller';
import * as systemCtrl from '../controllers/system.controller';

const router = Router();

// Student endpoints
router.get('/student-info', studentCtrl.getStudentInfo);
router.post('/save-progress', studentCtrl.saveProgress);

// Admin & Config endpoints
router.get('/firebase-config', systemCtrl.getFirebaseConfig);
router.post('/admin/login', adminCtrl.saveConfig);
router.post('/report-client-error', systemCtrl.reportClientError);

module.exports = router;
