/**
 * SRS SERVICE (Spaced Repetition System)
 * Quản lý thuật toán ghi nhớ ngắt quãng Leitner 5 hộp (1, 2, 4, 7, 15, 30 ngày) cho từ vựng Tiếng Anh
 */
(function() {
    'use strict';

    const INTERVAL_DAYS = [1, 2, 4, 7, 15, 30];

    const SrsService = {
        calculateNextReview: function(currentBox, isCorrect) {
            let nextBox = 1;
            if (isCorrect) {
                nextBox = Math.min(5, (currentBox || 1) + 1);
            } else {
                nextBox = 1; // Sai thì quay về hộp 1
            }

            const intervalDays = INTERVAL_DAYS[nextBox] || 1;
            const nextDueDate = new Date();
            nextDueDate.setDate(nextDueDate.getDate() + intervalDays);

            return {
                boxLevel: nextBox,
                status: nextBox === 5 ? 'mastered' : 'reviewing',
                nextReviewDue: nextDueDate.toISOString(),
                lastReviewed: new Date().toISOString()
            };
        },

        isWordDue: function(wordObj) {
            if (!wordObj || !wordObj.next_review_due) return true;
            const dueDate = new Date(wordObj.next_review_due);
            return dueDate <= new Date();
        },

        filterDueWords: function(wordList) {
            if (!Array.isArray(wordList)) return [];
            return wordList.filter(w => this.isWordDue(w));
        },

        calculateMasteryPercentage: function(wordList) {
            if (!Array.isArray(wordList) || wordList.length === 0) return 0;
            const mastered = wordList.filter(w => w.box_level >= 5 || w.status === 'mastered').length;
            return Math.round((mastered / wordList.length) * 100);
        }
    };

    if (typeof window !== 'undefined') {
        window.SrsService = SrsService;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SrsService;
    }
})();
