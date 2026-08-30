/**
 * QUIZ RUNNER MODULE
 * Điều phối phiên làm bài trắc nghiệm Toán (KaTeX), Tiếng Anh 4 kỹ năng & Phòng thi IOE tập trung
 */
(function() {
    'use strict';

    let currentQuestions = [];
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let examTimer = null;
    let timeRemaining = 0;
    let isIoeMode = false;
    let activeSession = null;

    const QuizRunnerModule = {
        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            // Lắng nghe sự kiện nếu có
        },

        startPractice: function(questions, options = {}) {
            if (!questions || !Array.isArray(questions) || questions.length === 0) {
                console.warn("[QuizRunner] Không có câu hỏi nào để bắt đầu");
                return;
            }

            currentQuestions = questions;
            currentQuestionIndex = 0;
            userAnswers = [];
            isIoeMode = !!options.isIoe;
            timeRemaining = options.durationSeconds || (questions.length * 90);

            activeSession = {
                id: 'sess_' + Date.now(),
                lessonId: options.lessonId || (window.AppState && window.AppState.currentLesson ? window.AppState.currentLesson.id : 'unknown'),
                startTime: new Date().toISOString(),
                subject: options.subject || 'math',
                isAudited: false
            };

            this.startTimer();
            this.renderQuestion(currentQuestionIndex);

            if (window.NavigationService) {
                window.NavigationService.showScreen(isIoeMode ? 'ioe-exam-screen' : 'practice-screen');
            }
        },

        renderQuestion: function(index) {
            const q = currentQuestions[index];
            if (!q) return;

            const qNumEl = document.getElementById('current-question-number');
            if (qNumEl) qNumEl.textContent = `Câu ${index + 1}/${currentQuestions.length}`;

            const qTextEl = document.getElementById('practice-question-text') || document.getElementById('question-text');
            if (qTextEl) {
                qTextEl.innerHTML = q.questionText || q.prompt || '';
                if (window.KatexService) {
                    window.KatexService.render(qTextEl);
                }
            }

            const optionsContainer = document.getElementById('practice-options-grid') || document.getElementById('options-container');
            if (optionsContainer && q.options && Array.isArray(q.options)) {
                optionsContainer.innerHTML = q.options.map((opt, i) => `
                    <button class="option-btn" onclick="QuizRunnerModule.selectOption(${i})">
                        <span class="option-prefix">${String.fromCharCode(65 + i)}.</span>
                        <span class="option-text">${opt}</span>
                    </button>
                `).join('');

                if (window.KatexService) {
                    window.KatexService.render(optionsContainer);
                }
            }
        },

        selectOption: function(optIndex) {
            const q = currentQuestions[currentQuestionIndex];
            if (!q) return;

            const isCorrect = (optIndex === q.correctIndex);
            userAnswers[currentQuestionIndex] = {
                questionIndex: currentQuestionIndex,
                selectedIndex: optIndex,
                isCorrect: isCorrect
            };

            if (window.AudioService) {
                window.AudioService.playSound(isCorrect ? 'correct' : 'wrong');
            }

            // Chuyển câu hỏi tiếp theo sau 0.8 giây
            setTimeout(() => {
                if (currentQuestionIndex < currentQuestions.length - 1) {
                    currentQuestionIndex++;
                    this.renderQuestion(currentQuestionIndex);
                } else {
                    this.finishQuiz();
                }
            }, 800);
        },

        startTimer: function() {
            this.stopTimer();
            examTimer = setInterval(() => {
                if (timeRemaining > 0) {
                    timeRemaining--;
                    this.updateTimerDisplay();
                } else {
                    this.stopTimer();
                    this.finishQuiz();
                }
            }, 1000);
        },

        stopTimer: function() {
            if (examTimer) {
                clearInterval(examTimer);
                examTimer = null;
            }
        },

        updateTimerDisplay: function() {
            const timerEl = document.getElementById('exam-timer-display') || document.getElementById('practice-timer');
            if (!timerEl) return;
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        },

        finishQuiz: function() {
            this.stopTimer();

            const correctCount = userAnswers.filter(a => a && a.isCorrect).length;
            const totalCount = currentQuestions.length || 1;
            const scorePercentage = Math.round((correctCount / totalCount) * 100);
            const xpGained = correctCount * 10;

            if (window.GamificationService) {
                window.GamificationService.addXp(xpGained);
                window.GamificationService.updateStreak();
            }

            if (window.AudioService) {
                window.AudioService.playSound('victory');
            }

            // Cập nhật điểm vào AppState
            if (window.AppState && window.AppState.state) {
                const state = window.AppState.state;
                const lessonId = activeSession ? activeSession.lessonId : 'lesson';
                state.scores = state.scores || {};
                state.scores[lessonId] = Math.max(state.scores[lessonId] || 0, scorePercentage);

                if (window.app && typeof window.app.saveProgress === 'function') {
                    window.app.saveProgress();
                }
            }

            // Hiển thị kết quả
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    title: scorePercentage >= 80 ? 'Xuất Sắc! 🎉' : 'Hoàn Thành! 👍',
                    html: `
                        <div style="font-size: 1.2rem; margin: 1rem 0;">
                            <p>Điểm số: <strong>${scorePercentage}%</strong> (${correctCount}/${totalCount} câu đúng)</p>
                            <p>Thưởng: <strong style="color: #f59e0b;">+${xpGained} XP</strong></p>
                        </div>
                    `,
                    icon: scorePercentage >= 80 ? 'success' : 'info',
                    confirmButtonText: 'Quay lại bài học'
                }).then(() => {
                    if (window.NavigationService) {
                        window.NavigationService.showScreen('subtopics-screen');
                    }
                });
            } else {
                alert(`Hoàn thành bài làm! Điểm: ${scorePercentage}%. Thưởng: +${xpGained} XP`);
                if (window.NavigationService) {
                    window.NavigationService.showScreen('subtopics-screen');
                }
            }
        },

        exitExam: function() {
            this.stopTimer();
            if (window.NavigationService) {
                window.NavigationService.showScreen('subtopics-screen');
            }
        },

        retryPractice: function() {
            if (currentQuestions && currentQuestions.length > 0) {
                this.startPractice(currentQuestions, { isIoe: isIoeMode });
            }
        }
    };

    if (typeof window !== 'undefined') {
        window.QuizRunnerModule = QuizRunnerModule;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = QuizRunnerModule;
    }
})();
