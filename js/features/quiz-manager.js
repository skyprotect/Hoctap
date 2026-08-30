/**
 * QUIZ MANAGER SERVICE
 * Điều phối phiên làm bài tập trắc nghiệm, tính toán điểm số và thưởng vàng/XP
 */
(function() {
    'use strict';

    const QuizManager = {
        currentQuestions: [],
        currentIndex: 0,
        correctCount: 0,
        startTime: 0,

        startQuiz: function(questions) {
            this.currentQuestions = Array.isArray(questions) ? questions : [];
            this.currentIndex = 0;
            this.correctCount = 0;
            this.startTime = Date.now();
            if (window.EventBus) {
                window.EventBus.emit('quiz:started', { total: this.currentQuestions.length });
            }
        },

        submitAnswer: function(selectedIndex) {
            const currentQ = this.currentQuestions[this.currentIndex];
            if (!currentQ) return false;

            const isCorrect = selectedIndex === currentQ.correctIndex;
            if (isCorrect) {
                this.correctCount++;
                if (window.AudioService) window.AudioService.playCorrect();
            } else {
                if (window.AudioService) window.AudioService.playIncorrect();
            }

            if (window.EventBus) {
                window.EventBus.emit('quiz:answered', {
                    index: this.currentIndex,
                    isCorrect: isCorrect,
                    question: currentQ
                });
            }

            return isCorrect;
        },

        nextQuestion: function() {
            this.currentIndex++;
            const hasMore = this.currentIndex < this.currentQuestions.length;
            if (!hasMore && window.EventBus) {
                window.EventBus.emit('quiz:completed', {
                    total: this.currentQuestions.length,
                    correct: this.correctCount,
                    duration: Math.round((Date.now() - this.startTime) / 1000)
                });
            }
            return hasMore;
        }
    };

    if (typeof window !== 'undefined') {
        window.QuizManager = QuizManager;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = QuizManager;
    }
})();
