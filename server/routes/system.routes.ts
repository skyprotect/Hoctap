/**
 * SYSTEM ROUTES
 * Các endpoints liên quan đến hệ thống, phiên bản, cập nhật và telemetry
 */
import { Router } from 'express';
import * as systemCtrl from '../controllers/system.controller';

const router = Router();

// Phiên bản & Cấu hình Firebase
router.get('/version', systemCtrl.getVersion);
router.get('/firebase-config', systemCtrl.getFirebaseConfig);
router.get('/auth/firebase-config', systemCtrl.getFirebaseConfig);

// Health check & Telemetry
router.get('/health', systemCtrl.getHealth);
router.post('/report-client-error', systemCtrl.reportClientError);

// Kiosk Mode & Cập nhật
router.get('/is-kiosk-mode', systemCtrl.isKioskMode);
router.get('/check-update', systemCtrl.checkUpdate);
router.get('/update-status', systemCtrl.getUpdateStatus);
router.post('/perform-update', systemCtrl.performUpdate);

module.exports = router;
