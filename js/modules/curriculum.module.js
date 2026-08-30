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
        currentSubtopic: null,

        init: function() {
            this.bindEvents();
            // Nạp dữ liệu chương trình học và render lần đầu
            this.ensureDataAndRender();
        },

        ensureDataAndRender: async function() {
            if (typeof window.loadCurriculum === 'function') {
                try {
                    await window.loadCurriculum();
                } catch (e) {}
            }
            this.renderCurriculum();
            this.renderSubjectSelection();
        },

        bindEvents: function() {
            if (window.EventBus) {
                window.EventBus.on('student:changed', () => {
                    this.renderCurriculum();
                    this.renderSubjectSelection();
                });
            }
        },

        switchSemester: function(semester) {
            this.currentSemester = parseInt(semester, 10) || 1;
            if (window.AppState) {
                window.AppState.currentSemester = this.currentSemester;
            }

            const tab1 = document.getElementById('sem-tab-1');
            const tab2 = document.getElementById('sem-tab-2');
            if (tab1 && tab2) {
                tab1.classList.toggle('active', this.currentSemester === 1);
                tab2.classList.toggle('active', this.currentSemester === 2);
            }

            const semBtns = document.querySelectorAll('.sem-tab-btn, .semester-btn');
            semBtns.forEach(btn => {
                const sem = btn.getAttribute('data-semester');
                if (sem) {
                    btn.classList.toggle('active', parseInt(sem, 10) === this.currentSemester);
                }
            });

            this.renderCurriculum();
        },

        switchSubject: function(subject) {
            this.currentSubject = subject || 'math';
            if (window.AppState) {
                window.AppState.currentSubject = this.currentSubject;
            }

            if (this.currentSubject === 'math') {
                if (window.NavigationService) {
                    window.NavigationService.showScreen('screen-timeline');
                }
                this.renderCurriculum();
            } else if (this.currentSubject === 'english') {
                if (window.NavigationService) {
                    window.NavigationService.showScreen('screen-english-portal');
                }
                if (window.app && typeof window.app.renderEnglishPortal === 'function') {
                    window.app.renderEnglishPortal();
                }
            }
        },

        switchLessonTab: function(tabName) {
            const tabs = document.querySelectorAll('.tab-btn, .lesson-tab-btn');
            tabs.forEach(t => t.classList.remove('active'));

            const targetBtn = document.getElementById(`tab-${tabName}-btn`) || document.querySelector(`[data-tab="${tabName}"]`);
            if (targetBtn) targetBtn.classList.add('active');

            const panes = document.querySelectorAll('.tab-pane');
            panes.forEach(p => p.classList.remove('active'));

            const targetPane = document.getElementById(`tab-${tabName}`);
            if (targetPane) targetPane.classList.add('active');
        },

        openLesson: function(lessonId, subject = null) {
            const targetSubject = subject || this.currentSubject || 'math';
            this.currentSubject = targetSubject;

            const courseData = (typeof window.COURSE_DATA !== 'undefined' && Array.isArray(window.COURSE_DATA)) 
                ? window.COURSE_DATA 
                : ((typeof COURSE_DATA !== 'undefined' && Array.isArray(COURSE_DATA)) ? COURSE_DATA : []);

            let lessonData = null;
            for (const ch of courseData) {
                if (ch.lessons && Array.isArray(ch.lessons)) {
                    const found = ch.lessons.find(l => l.id === lessonId);
                    if (found) {
                        lessonData = found;
                        break;
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

            this.currentLesson = lessonData || { id: lessonId, title: 'Bài học ' + lessonId, subtopics: [] };
            if (window.AppState) {
                window.AppState.currentLesson = this.currentLesson;
            }

            // Hiển thị Panel chi tiết bài học, ẩn Welcome Panel
            const welcomePanel = document.getElementById('welcome-viewer-panel');
            const lessonDetailPanel = document.getElementById('lesson-detail-panel');
            if (welcomePanel) welcomePanel.classList.add('hidden');
            if (lessonDetailPanel) lessonDetailPanel.classList.remove('hidden');

            this.renderLessonDetail(this.currentLesson);
        },

        renderLessonDetail: function(lesson) {
            if (!lesson) return;

            // 1. Cập nhật tiêu đề bài học
            const titleEl = document.getElementById('current-lesson-title');
            if (titleEl) titleEl.textContent = lesson.title || 'Chi tiết bài học';

            // 2. Render danh sách dạng bài ở Sidebar con bên trái (#subtopics-list-container)
            const subtopicsContainer = document.getElementById('subtopics-list-container');
            const subtopics = lesson.subtopics || [];

            if (subtopicsContainer) {
                if (subtopics.length === 0) {
                    subtopicsContainer.innerHTML = `
                        <div class="subtopic-empty" style="color: var(--text-muted); font-size: 0.88rem; padding: 0.8rem; text-align: center;">
                            Đang cập nhật các dạng bài luyện tập.
                        </div>
                    `;
                } else {
                    const state = (window.AppState && window.AppState.state) || {};
                    const completedSubtopics = state.completedSubtopics || [];
                    const subtopicScores = state.subtopicScores || {};

                    subtopicsContainer.innerHTML = subtopics.map((st, idx) => {
                        const isDone = completedSubtopics.includes(st.id);
                        const score = subtopicScores[st.id] !== undefined ? `${subtopicScores[st.id]}/10` : '';

                        return `
                            <div class="subtopic-item-card ${idx === 0 ? 'active' : ''}" id="st-item-${st.id}" onclick="CurriculumModule.selectSubtopic('${st.id}')" style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-color); border-radius: 10px; padding: 0.8rem; cursor: pointer; transition: all 0.2s;">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.3rem;">
                                    <span style="font-weight:700; font-size:0.86rem; color:var(--text-main);">${st.title}</span>
                                    ${isDone ? '<span style="color:#10b981; font-size:0.8rem;">✓</span>' : ''}
                                </div>
                                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; color:var(--text-muted);">
                                    <span class="badge-level" style="background:rgba(59,130,246,0.15); color:#60a5fa; padding:2px 6px; border-radius:4px;">${st.level || 'Cơ bản'}</span>
                                    ${score ? `<span style="color:#f59e0b; font-weight:700;">${score} đ</span>` : ''}
                                </div>
                                <button onclick="event.stopPropagation(); app.startPracticeCurrentSubtopic('${st.id}')" class="btn-practice-mini" style="margin-top:0.5rem; width:100%; background:linear-gradient(135deg, var(--primary), #1d4ed8); color:white; border:none; padding:4px 8px; border-radius:6px; font-size:0.75rem; font-weight:700; cursor:pointer;">
                                    <i class="fa-solid fa-pen-to-square"></i> Luyện tập dạng này
                                </button>
                            </div>
                        `;
                    }).join('');
                }
            }

            // 3. Chọn dạng bài đầu tiên để hiển thị chi tiết
            if (subtopics.length > 0) {
                this.selectSubtopic(subtopics[0].id);
            } else {
                this.renderSubtopicContent({
                    title: lesson.title,
                    youtubeId: lesson.youtubeId,
                    methodology: lesson.theoryHtml || "<p>Nội dung lý thuyết đang được cập nhật.</p>",
                    example: "<p>Xem các ví dụ minh họa trong video bài giảng đính kèm.</p>"
                });
            }
        },

        selectSubtopic: function(subtopicId) {
            if (!this.currentLesson || !this.currentLesson.subtopics) return;
            const target = this.currentLesson.subtopics.find(s => s.id === subtopicId) || this.currentLesson.subtopics[0];
            if (!target) return;

            this.currentSubtopic = target;

            // Đổi active class cho dạng bài trong sidebar
            document.querySelectorAll('.subtopic-item-card').forEach(el => el.classList.remove('active'));
            const currentCard = document.getElementById(`st-item-${target.id}`);
            if (currentCard) {
                currentCard.classList.add('active');
            }

            this.renderSubtopicContent(target);
        },

        renderSubtopicContent: function(subtopic) {
            // 1. Render Video Youtube
            const videoWrapper = document.getElementById('video-wrapper');
            if (videoWrapper) {
                const yId = subtopic.youtubeId || (this.currentLesson ? this.currentLesson.youtubeId : null) || 'ojvCobTP-0k';
                videoWrapper.innerHTML = `
                    <iframe width="100%" height="315" src="https://www.youtube-nocookie.com/embed/${yId}?rel=0" 
                            title="Video bài giảng" frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen style="border-radius: 12px; border: 1px solid var(--border-color);">
                    </iframe>
                `;
            }

            // 2. Render Phương pháp giải
            const methodBox = document.getElementById('subtopic-method-html');
            if (methodBox) {
                methodBox.innerHTML = subtopic.methodology || subtopic.theoryHtml || `<h4>Phương pháp giải</h4><p>Học sinh theo dõi kỹ video bài giảng trên để nắm vững phương pháp giải cho dạng toán <b>${subtopic.title || ''}</b>.</p>`;
                if (window.KatexService) {
                    window.KatexService.render(methodBox);
                }
            }

            // 3. Render Ví dụ minh họa
            const exampleBox = document.getElementById('subtopic-example-html');
            if (exampleBox) {
                exampleBox.innerHTML = subtopic.example || `<h4>Ví dụ minh họa</h4><div class="formula-highlight"><p>Xem chi tiết các bài toán mẫu và ví dụ minh họa trong video bài giảng đính kèm dạng toán này.</p></div>`;
                if (window.KatexService) {
                    window.KatexService.render(exampleBox);
                }
            }
        },

        renderCurriculum: function() {
            const container = document.getElementById('skill-tree-container') || document.getElementById('lessons-grid-container') || document.getElementById('curriculum-tree-box');
            if (!container) return;

            const courseData = (typeof window.COURSE_DATA !== 'undefined' && Array.isArray(window.COURSE_DATA)) 
                ? window.COURSE_DATA 
                : ((typeof COURSE_DATA !== 'undefined' && Array.isArray(COURSE_DATA)) ? COURSE_DATA : []);

            if (courseData.length === 0) {
                container.innerHTML = `
                    <div style="padding: 1.5rem; text-align: center; color: var(--text-muted);">
                        <i class="fa-solid fa-spinner fa-spin" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
                        <p>Đang tải chương trình học...</p>
                    </div>
                `;
                return;
            }

            const config = (window.AppState && window.AppState.config) || {};
            const classLevel = String(config.currentClass || '6');
            const semester = this.currentSemester || 1;

            // Lọc các chương theo Lớp và Học kỳ
            const filteredChapters = courseData.filter(ch => {
                const chSemester = ch.semester || 1;
                if (chSemester !== semester) return false;

                if (classLevel === '1') {
                    return ch.class === '1' || (ch.id && ch.id.startsWith('l1-'));
                } else if (classLevel === '4') {
                    return ch.class === '4' || (ch.id && ch.id.startsWith('l4-'));
                } else {
                    // Lớp 6: Các chương có class === '6' hoặc không có class và không thuộc lớp 1/4
                    return ch.class === '6' || (!ch.class && (!ch.id || (!ch.id.startsWith('l1-') && !ch.id.startsWith('l4-'))));
                }
            });

            if (filteredChapters.length === 0) {
                container.innerHTML = `
                    <div style="padding: 1.5rem; text-align: center; color: var(--text-muted);">
                        <p>Chưa có bài học nào cho Học kỳ ${semester} (Lớp ${classLevel}).</p>
                    </div>
                `;
                return;
            }

            const state = (window.AppState && window.AppState.state) || {};
            const scores = state.scores || {};
            const completedSubtopics = state.completedSubtopics || [];

            container.innerHTML = filteredChapters.map(ch => {
                const lessons = ch.lessons || [];

                return `
                    <div class="timeline-chapter" style="margin-bottom: 1.2rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border-color); border-radius: 14px; overflow: hidden;">
                        <div class="chapter-header" style="padding: 0.8rem 1rem; background: linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.05)); border-bottom: 1px solid var(--border-color);">
                            <h3 style="margin: 0; font-size: 0.95rem; font-weight: 800; color: #60a5fa; display: flex; align-items: center; gap: 0.4rem;">
                                <i class="fa-solid fa-bookmark" style="color: #3b82f6;"></i> ${ch.title}
                            </h3>
                            ${ch.subtitle ? `<p style="margin: 0.2rem 0 0 0; font-size: 0.76rem; color: var(--text-muted); line-height: 1.3;">${ch.subtitle}</p>` : ''}
                        </div>
                        <div class="chapter-lessons-list" style="display: flex; flex-direction: column; gap: 0.4rem; padding: 0.6rem;">
                            ${lessons.map(l => {
                                const subCount = l.subtopics ? l.subtopics.length : 0;
                                const isLessonActive = this.currentLesson && this.currentLesson.id === l.id;
                                const hasDoneSub = l.subtopics && l.subtopics.some(s => completedSubtopics.includes(s.id));

                                return `
                                    <div class="lesson-card-item ${isLessonActive ? 'active' : ''}" onclick="app.openLesson('${l.id}', 'math')" style="padding: 0.65rem 0.8rem; background: rgba(255,255,255,0.03); border: 1px solid ${isLessonActive ? 'var(--primary)' : 'var(--border-color)'}; border-radius: 10px; cursor: pointer; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center;">
                                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                                            <span style="font-size: 1.1rem;">📘</span>
                                            <div>
                                                <div style="font-weight: 700; font-size: 0.86rem; color: var(--text-main);">${l.title}</div>
                                                <div style="font-size: 0.74rem; color: var(--text-muted);">${subCount} dạng bài luyện tập</div>
                                            </div>
                                        </div>
                                        <div style="display: flex; align-items: center; gap: 0.4rem;">
                                            ${hasDoneSub ? '<span style="color: #10b981; font-size: 0.8rem; font-weight: 800;">✓ Đã học</span>' : '<i class="fa-solid fa-chevron-right" style="color: var(--text-muted); font-size: 0.75rem;"></i>'}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        },

        renderSubjectSelection: function() {
            const container = document.querySelector('#screen-subject-select .subject-list') || document.querySelector('.subject-list');
            if (!container) return;

            const config = (window.AppState && window.AppState.config) || {};
            const classLevel = config.currentClass || '6';

            container.innerHTML = `
                <div class="subject-selection-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; max-width: 900px; margin: 2rem auto; width: 100%;">
                    <!-- MÔN TOÁN HỌC -->
                    <div class="subject-card math-card card" onclick="app.switchSubject('math')" style="background: linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98)); border: 2px solid rgba(59, 130, 246, 0.4); border-radius: 20px; padding: 2rem; cursor: pointer; transition: all 0.3s; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 10px 30px rgba(37, 99, 235, 0.2);">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
                                <div style="width: 60px; height: 60px; border-radius: 16px; background: linear-gradient(135deg, #2563eb, #1d4ed8); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: white; box-shadow: 0 4px 15px rgba(37,99,235,0.4);">
                                    <i class="fa-solid fa-calculator"></i>
                                </div>
                                <span style="background: rgba(37, 99, 235, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); font-size: 0.8rem; font-weight: 800; padding: 0.3rem 0.8rem; border-radius: 20px;">Lớp ${classLevel}</span>
                            </div>
                            <h3 style="font-size: 1.6rem; font-weight: 800; color: white; margin: 0 0 0.6rem 0;">Toán Học</h3>
                            <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin: 0 0 1.5rem 0;">Khám phá thế giới số học, hình học trực quan, bộ đề kiểm tra định kỳ CV 7991 và bồi dưỡng học sinh giỏi.</p>
                        </div>
                        <button style="width: 100%; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; padding: 0.9rem; border-radius: 14px; font-weight: 800; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.6rem; box-shadow: 0 4px 15px rgba(37,99,235,0.35);">
                            <i class="fa-solid fa-play"></i> Bắt đầu học Toán 🚀
                        </button>
                    </div>

                    <!-- MÔN TIẾNG ANH -->
                    <div class="subject-card english-card card" onclick="app.switchSubject('english')" style="background: linear-gradient(145deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98)); border: 2px solid rgba(16, 185, 129, 0.4); border-radius: 20px; padding: 2rem; cursor: pointer; transition: all 0.3s; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2);">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem;">
                                <div style="width: 60px; height: 60px; border-radius: 16px; background: linear-gradient(135deg, #10b981, #059669); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: white; box-shadow: 0 4px 15px rgba(16,185,129,0.4);">
                                    <i class="fa-solid fa-language"></i>
                                </div>
                                <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4); font-size: 0.8rem; font-weight: 800; padding: 0.3rem 0.8rem; border-radius: 20px;">Lớp ${classLevel}</span>
                            </div>
                            <h3 style="font-size: 1.6rem; font-weight: 800; color: white; margin: 0 0 0.6rem 0;">Tiếng Anh</h3>
                            <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.5; margin: 0 0 1.5rem 0;">Luyện 4 kỹ năng Nghe - Nói - Đọc - Viết, chinh phục từ vựng quái vật và đấu trường thi thử Olympic IOE.</p>
                        </div>
                        <button style="width: 100%; background: linear-gradient(135deg, #10b981, #059669); color: white; border: none; padding: 0.9rem; border-radius: 14px; font-weight: 800; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.6rem; box-shadow: 0 4px 15px rgba(16,185,129,0.35);">
                            <i class="fa-solid fa-play"></i> Bắt đầu học Tiếng Anh 🌟
                        </button>
                    </div>
                </div>
            `;
        }
    };

    if (typeof window !== 'undefined') {
        window.CurriculumModule = CurriculumModule;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = CurriculumModule;
    }
})();
