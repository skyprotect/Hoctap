/**
 * math-practice-evaluator — Bộ đánh giá kết quả luyện tập và thi môn Toán thuần túy (Pure Math Practice Evaluator).
 * Tách biệt hoàn toàn khỏi logic điều khiển giao diện DOM, state mutation, audio và popup.
 * Hỗ trợ UMD (Node.js CommonJS, Web Workers, Browser Global).
 * 
 * Public Contract:
 * - evaluatePracticeResult(options: PracticeEvaluationOptions): PracticeEvaluationResult
 * - applyXpPenalty(currentXp: number, wrongCount: number, penaltyPerWrong?: number): number
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.MathPracticeEvaluator = api;
    if (typeof window !== 'undefined') {
        window.MathPracticeEvaluator = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.MathPracticeEvaluator = api;
    }
    if (typeof self !== 'undefined') {
        self.MathPracticeEvaluator = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    /**
     * Tính toán kết quả bài luyện tập / thi môn Toán thuần túy (Pure Function).
     * 
     * @param {Object} options - Tham số đầu vào
     * @param {number} [options.correctCount=0] - Số câu trả lời đúng
     * @param {number} [options.totalQuestions=1] - Tổng số câu hỏi
     * @param {string} [options.currentLevel='co-ban'] - Cấp độ bài tập ('co-ban', 'nang-cao', 'kho', 'chat-luong-cao')
     * @param {boolean} [options.isExamMode=false] - Chế độ thi cuối chương
     * @param {boolean} [options.isLessonExamMode=false] - Chế độ kiểm tra tổng thể bài học
     * @param {string} [options.studentName='Con'] - Tên học sinh
     * @param {string} [options.parentName='Bố'] - Tên phụ huynh
     * @returns {Object} Kết quả đánh giá chi tiết
     */
    function evaluatePracticeResult(options) {
        const opt = options || {};
        const correctCount = Math.max(0, Number(opt.correctCount) || 0);
        const totalQuestions = Math.max(1, Number(opt.totalQuestions) || 1);
        const currentLevel = opt.currentLevel || 'co-ban';
        const isExam = Boolean(opt.isExamMode || opt.isLessonExamMode);
        const studentName = opt.studentName || 'Con';
        const parentName = opt.parentName || 'Bố';

        const scorePercent = Math.min(100, Math.max(0, Math.round((correctCount / totalQuestions) * 100)));

        // Xác định baseXp dựa trên chế độ và độ khó bài học
        let baseXp = 50;
        if (isExam) {
            baseXp = 100;
        } else {
            if (currentLevel === 'co-ban') baseXp = 50;
            else if (currentLevel === 'nang-cao') baseXp = 70;
            else if (currentLevel === 'kho') baseXp = 100;
            else if (currentLevel === 'chat-luong-cao') baseXp = 150;
        }

        let rank = "";
        let desc = "";
        let emoji = "";
        let xpEarned = 0;
        let isPassed = false;

        // Phân loại 6 mức độ nhận thức với mốc đạt >= 80% (Loại Giỏi trở lên)
        if (scorePercent >= 95) {
            rank = "Xuất sắc";
            desc = isExam 
                ? `${parentName} chúc mừng ${studentName} nhé! Con đã vượt qua bài kiểm tra một cách xuất sắc. ${parentName} tự hào về con lắm!` 
                : `Tuyệt vời ${studentName}! Con đã làm đúng hết các câu hỏi của dạng bài này. ${parentName} thưởng cho con nhé!`;
            emoji = "👑";
            xpEarned = baseXp;
            isPassed = true;
        } else if (scorePercent >= 80) {
            rank = "Giỏi";
            desc = isExam 
                ? `Chúc mừng ${studentName}! Con đã đỗ bài kiểm tra và mở khóa bài tiếp theo. ${parentName} rất vui!` 
                : `${studentName} học giỏi lắm! Con đã vượt qua dạng bài luyện tập này rồi. Tiếp tục phát huy con nhé!`;
            emoji = "🎉";
            xpEarned = Math.round(baseXp * 0.8);
            isPassed = true;
        } else if (scorePercent >= 70) {
            rank = "Khá";
            desc = `${studentName} làm khá tốt rồi! Tuy nhiên, con cần đạt từ 80% trở lên để vượt qua. Luyện tập lại một chút, ${parentName} tin con sẽ đạt điểm tuyệt đối!`;
            emoji = "👍";
            xpEarned = Math.round(baseXp * 0.5);
            isPassed = false;
        } else if (scorePercent >= 50) {
            rank = "Đạt";
            desc = `${studentName} đã có tiến bộ rồi! Con hãy xem kỹ lời giải chi tiết của ${parentName} biên soạn ở dưới và làm lại để nâng cao điểm số nhé.`;
            emoji = "✍️";
            xpEarned = Math.round(baseXp * 0.3);
            isPassed = false;
        } else if (scorePercent >= 35) {
            rank = "Yếu";
            desc = `${studentName} cố lên nào! Phần này hơi khó, con hãy đọc lại phần Lý thuyết rồi thử sức lại nhé. ${parentName} luôn đồng hành cùng con!`;
            emoji = "📚";
            xpEarned = Math.round(baseXp * 0.1);
            isPassed = false;
        } else {
            rank = "Không đạt";
            desc = `Không sao đâu ${studentName}! Thất bại là mẹ thành công. Con hãy đọc kỹ hướng dẫn của ${parentName} dưới đây rồi thử lại nhé!`;
            emoji = "❌";
            xpEarned = 0;
            isPassed = false;
        }

        return {
            correctCount,
            totalQuestions,
            scorePercent,
            rank,
            desc,
            emoji,
            baseXp,
            xpEarned,
            isPassed
        };
    }

    /**
     * Tính toán số XP an toàn sau khi trừ điểm phạt cho các câu làm sai (Safe XP Floor Invariant: XP >= 0).
     * 
     * @param {number} currentXp - Số XP hiện tại của học sinh
     * @param {number} wrongCount - Số câu trả lời sai
     * @param {number} [penaltyPerWrong=10] - Mức phạt mỗi câu sai (mặc định 10 XP)
     * @returns {number} Số XP mới sau phạt, đảm bảo luôn >= 0
     */
    function applyXpPenalty(currentXp, wrongCount, penaltyPerWrong = 10) {
        const xp = typeof currentXp === 'number' && !isNaN(currentXp) ? currentXp : 0;
        const count = Math.max(0, Number(wrongCount) || 0);
        const penalty = count * (Number(penaltyPerWrong) || 10);
        return Math.max(0, xp - penalty);
    }

    return {
        evaluatePracticeResult,
        applyXpPenalty
    };
});
