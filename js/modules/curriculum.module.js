/**
 * CURRICULUM MODULE
 * Quản lý danh mục bài học Toán & Tiếng Anh, Lộ trình học tập theo học kỳ, Trình xem lý thuyết và Chuyên đề tự chọn
 */
(function() {
    'use strict';

    const CurriculumModule = {
        currentSubject: 'math',
        currentSemester: 1,
        currentLesson: null,

        init: function() {
            this.bindEvents();
        },

        bindEvents: function() {
            if (window.EventBus) {
                window.EventBus.on('student:changed', () => this.renderCurriculum());
            }
        },

        switchSemester: function(semester) {
            this.currentSemester = parseInt(semester, 10) || 1;
            if (window.AppState) {
                window.AppState.currentSemester = this.currentSemester;
            }
            const semBtns = document.querySelectorAll('.semester-btn');
            semBtns.forEach(btn => {
                const sem = btn.getAttribute('data-semester');
                if (parseInt(sem, 10) === this.currentSemester) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            this.renderCurriculum();
        },

        switchSubject: function(subject) {
            this.currentSubject = subject || 'math';
            if (window.AppState) {
                window.AppState.currentSubject = this.currentSubject;
            }
            this.renderCurriculum();
        },

        switchLessonTab: function(tabName) {
            const tabs = document.querySelectorAll('.lesson-tab-btn');
            tabs.forEach(t => t.classList.remove('active'));

            const targetBtn = document.querySelector(`.lesson-tab-btn[data-tab="${tabName}"]`);
            if (targetBtn) targetBtn.classList.add('active');

            const theoryBox = document.getElementById('theory-content-box');
            const subtopicsBox = document.getElementById('subtopics-timeline-box');

            if (tabName === 'theory') {
                if (theoryBox) theoryBox.classList.remove('hidden');
                if (subtopicsBox) subtopicsBox.classList.add('hidden');
            } else {
                if (theoryBox) theoryBox.classList.add('hidden');
                if (subtopicsBox) subtopicsBox.classList.remove('hidden');
            }
        },

        openLesson: function(lessonId, subject = null) {
            const targetSubject = subject || this.currentSubject || 'math';
            this.currentSubject = targetSubject;

            let lessonData = null;
            if (typeof COURSE_DATA !== 'undefined' && Array.isArray(COURSE_DATA)) {
                for (const ch of COURSE_DATA) {
                    if (ch.lessons && Array.isArray(ch.lessons)) {
                        const found = ch.lessons.find(l => l.id === lessonId);
                        if (found) {
                            lessonData = found;
                            break;
                        }
                    }
                }
            }

            if (!lessonData && typeof ENGLISH_DATA !== 'undefined' && Array.isArray(ENGLISH_DATA)) {
                for (const u of ENGLISH_DATA) {
                    if (u.id === lessonId || (u.lessons && u.lessons.some(l => l.id === lessonId))) {
                        lessonData = u;
                        break;
                    }
                }
            }

            this.currentLesson = lessonData || { id: lessonId, title: 'Bài học ' + lessonId };
            if (window.AppState) {
                window.AppState.currentLesson = this.currentLesson;
            }

            // Render giao diện chi tiết bài học
            this.renderLessonDetail(this.currentLesson);

            if (window.NavigationService) {
                window.NavigationService.showScreen('subtopics-screen');
            }
        },

        renderLessonDetail: function(lesson) {
            const titleEl = document.getElementById('current-lesson-title');
            if (titleEl) titleEl.textContent = lesson.title || 'Chi tiết bài học';

            const theoryBox = document.getElementById('theory-content-box');
            if (theoryBox && lesson.theoryHtml) {
                theoryBox.innerHTML = lesson.theoryHtml;
                if (window.KatexService) {
                    window.KatexService.render(theoryBox);
                }
            }
        },

        completeTheoryAndGoToFirstSubtopic: function() {
            if (this.currentLesson) {
                const state = (window.AppState && window.AppState.state) || {};
                state.completedLessonTheory = state.completedLessonTheory || [];
                if (!state.completedLessonTheory.includes(this.currentLesson.id)) {
                    state.completedLessonTheory.push(this.currentLesson.id);
                }
            }
            this.switchLessonTab('subtopics');
        },

        renderCurriculum: function() {
            const container = document.getElementById('lessons-grid-container') || document.getElementById('curriculum-tree-box');
            if (!container) return;

            // Render danh sách chương & bài học
            if (typeof COURSE_DATA === 'undefined') return;

            const config = (window.AppState && window.AppState.config) || {};
            const classLevel = config.currentClass || '6';
            const semester = this.currentSemester || 1;

            const filteredChapters = COURSE_DATA.filter(ch => (ch.class === classLevel || !ch.class) && (ch.semester === semester || !ch.semester));

            container.innerHTML = filteredChapters.map(ch => `
                <div class="chapter-card">
                    <h3 class="chapter-title">${ch.title}</h3>
                    <div class="lessons-list">
                        ${(ch.lessons || []).map(l => `
                            <div class="lesson-item" onclick="CurriculumModule.openLesson('${l.id}')">
                                <span class="lesson-icon">📘</span>
                                <span class="lesson-name">${l.title}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }
    };

    if (typeof window !== 'undefined') {
        window.CurriculumModule = CurriculumModule;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = CurriculumModule;
    }
})();
