/**
 * STUDENT ROUTES
 * Các endpoints liên quan đến tiến trình học tập, thông tin học sinh, từ vựng và bảng xếp hạng
 */
import { Router } from 'express';
import * as studentCtrl from '../controllers/student.controller';
import { authenticateAdminToken } from '../middleware/auth.middleware';

const router = Router();

// Thông tin học sinh & Tiến độ
router.get('/student-info', studentCtrl.getStudentInfo);
router.get('/load-progress', studentCtrl.loadProgress);
router.post('/save-progress', studentCtrl.saveProgress);
router.post('/delete-student-progress', authenticateAdminToken, studentCtrl.deleteStudentProgress);

// Heartbeat & Bảng xếp hạng
router.post('/heartbeat', studentCtrl.heartbeat);
router.get('/leaderboard', studentCtrl.getLeaderboard);

// Chủ đề và Từ vựng tự chọn
router.get('/custom-topics', studentCtrl.getCustomTopics);
router.post('/custom-topics/delete', studentCtrl.deleteCustomTopic);
router.get('/custom-vocabulary', studentCtrl.getCustomVocabulary);
router.post('/custom-vocabulary/delete-word', studentCtrl.deleteCustomVocabularyWord);
router.post('/custom-vocabulary/add', studentCtrl.addCustomVocabulary);
router.post('/custom-vocabulary/report-result', studentCtrl.reportCustomVocabularyResult);

// Token Tablet
router.post('/tablet/generate-token', studentCtrl.generateTabletToken);
router.get('/tablet/tokens', studentCtrl.getTabletTokens);
router.post('/tablet/verify-token', studentCtrl.verifyTabletToken);
router.post('/tablet/activate-token', studentCtrl.activateTabletToken);
router.post('/tablet/use-token', studentCtrl.useTabletToken);

// Chat & Thông báo
router.post('/chat/send', studentCtrl.sendChatMessage);
router.get('/chat/messages', studentCtrl.getChatMessages);
router.get('/chat/notifications', studentCtrl.getChatNotifications);
router.post('/chat/clear-notification', studentCtrl.clearChatNotification);

module.exports = router;
