/**
 * QUIZ ROUTES
 * Các endpoints liên quan đến đề thi, sinh câu hỏi AI, thẩm định và phân tích học lực
 */
import { Router } from 'express';
import * as quizCtrl from '../controllers/quiz.controller';
import { authenticateAdminToken } from '../middleware/auth.middleware';

const router = Router();

// Lấy câu hỏi và điều khiển sinh đề
router.get('/get-questions', quizCtrl.getQuestions);
router.post('/start-student-pregen', quizCtrl.startStudentPregen);
router.post('/pre-generate-questions', quizCtrl.preGenerateQuestions);
router.post('/save-printed-pdf', quizCtrl.savePrintedPdf);

// Thẩm định & Phân tích AI
router.post('/ai-analysis', authenticateAdminToken, quizCtrl.aiAnalysis);
router.post('/audit-exam-session', authenticateAdminToken, quizCtrl.auditExamSession);
router.post('/ai-troubleshoot-question', quizCtrl.aiTroubleshootQuestion);
router.get('/ai-status', quizCtrl.getAiStatus);

module.exports = router;
