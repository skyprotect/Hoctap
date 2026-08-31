/**
 * math-session-builder — Bộ tạo bản ghi và quản lý lưu giữ lượt làm bài môn Toán thuần túy (Pure Math Session Builder).
 * Trách nhiệm duy nhất:
 * 1. buildSessionRecord: Chuẩn hóa và tạo cấu trúc dữ liệu bản ghi session hoàn chỉnh.
 * 2. retainSessions: Áp dụng chính sách giới hạn số lượng session (mặc định 150 session, FIFO).
 * 
 * ĐẶC TÍNH KIẾN TRÚC:
 * - Pure Functions 100%: Không truy cập DOM, không mutate state, không gọi storage/API.
 * - Hỗ trợ UMD (Node.js CommonJS, Web Workers, Browser Global).
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.MathSessionBuilder = api;
    if (typeof window !== 'undefined') {
        window.MathSessionBuilder = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.MathSessionBuilder = api;
    }
    if (typeof self !== 'undefined') {
        self.MathSessionBuilder = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    /**
     * Tạo bản ghi lượt làm bài (session record) chi tiết với cấu trúc dữ liệu chuẩn xác.
     *
     * @param {Object} options - Tham số đầu vào
     * @param {Object} [options.lesson] - Thông tin bài học (id, title)
     * @param {string} [options.lessonId] - Mã bài học nếu không truyền object lesson
     * @param {string} [options.lessonTitle] - Tên bài học nếu không truyền object lesson
     * @param {string} [options.level='co-ban'] - Cấp độ bài tập ('co-ban', 'nang-cao', 'kho', 'chat-luong-cao')
     * @param {boolean} [options.isExam=false] - Chế độ thi cuối chương
     * @param {boolean} [options.isExamMode=false] - Alias của isExam
     * @param {boolean} [options.isLessonExam=false] - Chế độ kiểm tra tổng thể bài học
     * @param {boolean} [options.isLessonExamMode=false] - Alias của isLessonExam
     * @param {boolean} [options.isSubtopicPractice=false] - Chế độ luyện tập theo dạng bài
     * @param {boolean} [options.isSubtopicPracticeMode=false] - Alias của isSubtopicPractice
     * @param {boolean} [options.isWeaknessPractice=false] - Chế độ luyện tập khắc phục điểm yếu AI
     * @param {boolean} [options.isWeaknessPracticeMode=false] - Alias của isWeaknessPractice
     * @param {Object|null} [options.subtopic=null] - Thông tin dạng bài (id, title)
     * @param {string|null} [options.subtopicId=null] - Mã dạng bài
     * @param {string|null} [options.subtopicTitle=null] - Tên dạng bài
     * @param {number} [options.correctCount=0] - Số câu đúng
     * @param {number} [options.totalQuestions] - Tổng số câu hỏi
     * @param {number} [options.scorePercent=0] - Tỷ lệ phần trăm điểm (0 - 100)
     * @param {number} [options.timeSpent=0] - Thời gian làm bài (giây)
     * @param {number} [options.distractions=0] - Số lần xao nhãng / rời tab
     * @param {number} [options.practiceDistractions=0] - Alias của distractions
     * @param {Array} [options.questions=[]] - Danh sách câu hỏi chi tiết
     * @param {Array} [options.currentQuestions=[]] - Alias của questions
     * @param {Function} [options.checkShortAnswer] - Hàm kiểm tra câu trả lời tự luận
     * @param {string} [options.id] - ID phiên làm bài tuỳ chỉnh (phục vụ deterministic testing)
     * @param {number} [options.timestamp] - Mốc thời gian timestamp tùy chỉnh
     * @param {string} [options.date] - Chuỗi ngày ISO tùy chỉnh
     * @returns {Object} Bản ghi session hoàn chỉnh
     */
    function buildSessionRecord(options) {
        const opt = options || {};

        const lesson = opt.lesson || {};
        const lessonId = lesson.id || opt.lessonId || "";
        const lessonTitle = lesson.title || opt.lessonTitle || "";
        const level = opt.level || opt.currentLevel || "co-ban";

        const isExam = Boolean(opt.isExam || opt.isExamMode);
        const isLessonExam = Boolean(opt.isLessonExam || opt.isLessonExamMode);
        const isSubtopicPractice = Boolean(opt.isSubtopicPractice || opt.isSubtopicPracticeMode);
        const isWeaknessPractice = Boolean(opt.isWeaknessPractice || opt.isWeaknessPracticeMode);

        const subtopic = opt.subtopic || opt.currentSubtopic || null;
        const subtopicId = isSubtopicPractice ? (subtopic ? subtopic.id : (opt.subtopicId || null)) : null;
        const subtopicTitle = isSubtopicPractice ? (subtopic ? subtopic.title : (opt.subtopicTitle || null)) : null;

        const timestamp = typeof opt.timestamp === 'number' ? opt.timestamp : Date.now();
        const id = typeof opt.id === 'string' && opt.id ? opt.id : ("sess-" + timestamp);
        const date = typeof opt.date === 'string' && opt.date ? opt.date : (opt.timestamp ? new Date(opt.timestamp).toISOString() : new Date().toISOString());

        const questionsList = Array.isArray(opt.questions) 
            ? opt.questions 
            : (Array.isArray(opt.currentQuestions) ? opt.currentQuestions : []);

        const correctCount = typeof opt.correctCount === 'number' ? opt.correctCount : 0;
        const totalQuestions = typeof opt.totalQuestions === 'number' ? opt.totalQuestions : questionsList.length;
        const scorePercent = typeof opt.scorePercent === 'number' ? opt.scorePercent : 0;
        const timeSpent = typeof opt.timeSpent === 'number' ? opt.timeSpent : 0;
        const distractions = typeof opt.distractions === 'number' 
            ? opt.distractions 
            : (typeof opt.practiceDistractions === 'number' ? opt.practiceDistractions : 0);

        const checkShortAnswerFn = typeof opt.checkShortAnswer === 'function'
            ? opt.checkShortAnswer
            : (typeof opt.checkShortAnswerFn === 'function' ? opt.checkShortAnswerFn : null);

        const mappedQuestions = questionsList.map(q => {
            const rawQ = q || {};
            const isShortAnswer = Boolean(rawQ.isShortAnswer);
            let isCorrect;

            if (isShortAnswer) {
                const correctOption = Array.isArray(rawQ.options) ? rawQ.options[rawQ.correctIndex] : rawQ.correctAnswer;
                if (typeof checkShortAnswerFn === 'function') {
                    isCorrect = checkShortAnswerFn(rawQ.userShortAnswer || '', correctOption);
                } else {
                    isCorrect = (rawQ.userShortAnswer || '') === (correctOption !== undefined ? correctOption : '');
                }
            } else {
                isCorrect = rawQ.userSelectedIndex === rawQ.correctIndex;
            }

            return {
                questionText: rawQ.questionText,
                options: rawQ.options,
                correctIndex: rawQ.correctIndex,
                userSelectedIndex: rawQ.userSelectedIndex,
                isShortAnswer: rawQ.isShortAnswer || false,
                userShortAnswer: rawQ.userShortAnswer || "",
                isCorrect: isCorrect,
                solutionHtml: rawQ.solutionHtml,
                tip: rawQ.tip,
                level: rawQ.level,
                type: rawQ.type
            };
        });

        return {
            id: id,
            lessonId: lessonId,
            lessonTitle: lessonTitle,
            level: level,
            isExam: isExam,
            isLessonExam: isLessonExam,
            isSubtopicPractice: isSubtopicPractice,
            isWeaknessPractice: isWeaknessPractice,
            subtopicId: subtopicId,
            subtopicTitle: subtopicTitle,
            date: date,
            correctCount: correctCount,
            totalQuestions: totalQuestions,
            scorePercent: scorePercent,
            timeSpent: timeSpent,
            distractions: distractions,
            questions: mappedQuestions
        };
    }

    /**
     * Áp dụng chính sách giới hạn số lượng session lưu giữ (Retention Policy).
     * Mặc định giữ tối đa 150 session gần nhất, loại bỏ các session cũ nhất (FIFO).
     * Hàm thuần túy: không mutate mảng đầu vào.
     *
     * @param {Array} existingSessions - Mảng các session hiện có
     * @param {number} [maxRetention=150] - Số lượng session tối đa giữ lại
     * @returns {Array} Mảng các session sau khi áp dụng giới hạn
     */
    function retainSessions(existingSessions, maxRetention = 150) {
        const limit = (typeof maxRetention === 'number' && maxRetention > 0) ? maxRetention : 150;
        if (!Array.isArray(existingSessions)) {
            return [];
        }
        if (existingSessions.length <= limit) {
            return existingSessions.slice();
        }
        return existingSessions.slice(-limit);
    }

    return {
        buildSessionRecord,
        retainSessions
    };
});
