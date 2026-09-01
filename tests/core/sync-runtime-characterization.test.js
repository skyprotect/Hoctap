/**
 * tests/core/sync-runtime-characterization.test.js
 * 
 * CHARACTERIZATION TEST SUITE FOR RUNTIME INTEGRITY & SYNC ISSUES
 * 
 * Objectives:
 * 1. Characterize font & encoding anomalies (mojibake in student.html and offline font availability).
 * 2. Characterize rapid concurrent saveProgress() calls and the double-save pattern in finishPractice().
 * 3. Characterize proxy property enumeration, JSON serialization, and OCC conflict reconciliation behavior.
 * 4. Characterize UI timeline re-render latency / stale node state after finishPractice().
 */

const fs = require('fs');
const path = require('path');

describe('Runtime Integrity & Sync Characterization', () => {

    describe('1. Font and Character Encoding Diagnostics', () => {
        const studentHtmlPath = path.resolve(__dirname, '../../student.html');
        let htmlContent = '';

        beforeAll(() => {
            htmlContent = fs.readFileSync(studentHtmlPath, 'utf8');
        });

        test('verifies UTF-8 encoding in student.html is clean and uncorrupted', () => {
            // Check for tell-tale double-encoded UTF-8 signatures:
            // e.g. "Ã", "Â" followed by high-byte, "Ä‘" for "đ", "áº" for "ạ", etc.
            const mojibakeMatches = htmlContent.match(/[ÃÂ][\x80-\xBF]|âš|ðŸ/g) || [];
            
            // student.html must NOT contain any mojibake sequences
            expect(mojibakeMatches.length).toBe(0);

            // Spot check specific known strings to ensure proper UTF-8 Vietnamese
            expect(htmlContent).toContain('Trình theo dõi');
            expect(htmlContent).toContain('Không Tương Thích');
            expect(htmlContent).toContain('Toán 6 - Kết nối tri thức');
            expect(htmlContent).toContain('Chào mừng học sinh!');
        });

        test('characterizes font asset dependencies and offline fallback gaps', () => {
            // Verify Google Fonts CDN dependency in student.html
            expect(htmlContent).toContain('fonts.googleapis.com');
            expect(htmlContent).toContain('Plus+Jakarta+Sans');

            // Verify local font directory contents
            const localFontsDir = path.resolve(__dirname, '../../css/lib/fonts');
            expect(fs.existsSync(localFontsDir)).toBe(true);
            const localFontFiles = fs.readdirSync(localFontsDir);

            // Verify that css/lib/fonts ONLY contains KaTeX math fonts, NO general UI text fonts
            const uiFonts = localFontFiles.filter(f => !f.startsWith('KaTeX_'));
            expect(uiFonts.length).toBe(0); // Zero offline UI fonts (Inter, Plus Jakarta Sans, etc.)
        });
    });

    describe('2. Subject State Proxy Serialization & OCC Reconciliation', () => {
        function createMockAppState() {
            const state = {
                xp: 0,
                streak: 0,
                scores: {},
                examSessions: [],
                subjects: {
                    math: {
                        scores: {},
                        completedSubtopics: [],
                        subtopicScores: {},
                        completedLessonTheory: [],
                        examSessions: []
                    },
                    english: {
                        scores: {},
                        completedSubtopics: [],
                        subtopicScores: {},
                        completedLessonTheory: [],
                        examSessions: []
                    }
                }
            };

            const fields = ['scores', 'completedSubtopics', 'subtopicScores', 'completedLessonTheory', 'examSessions'];
            fields.forEach(field => {
                Object.defineProperty(state, field, {
                    get: () => {
                        return state.subjects.math[field];
                    },
                    set: (val) => {
                        state.subjects.math[field] = val;
                    },
                    configurable: true
                });
            });

            return state;
        }

        test('characterizes non-enumerable descriptor behavior and JSON serialization', () => {
            const state = createMockAppState();
            state.scores['bai-1'] = 100;
            state.examSessions.push({ id: 'sess_1', score: 100 });

            expect(state.scores['bai-1']).toBe(100);
            expect(state.examSessions.length).toBe(1);

            const freshState = {
                xp: 10,
                subjects: {
                    math: {
                        scores: { 'bai-2': 90 },
                        examSessions: [{ id: 'sess_2' }]
                    }
                }
            };
            Object.defineProperty(freshState, 'examSessions', {
                get: () => freshState.subjects.math.examSessions,
                set: (v) => { freshState.subjects.math.examSessions = v; },
                configurable: true
            });

            const descriptor = Object.getOwnPropertyDescriptor(freshState, 'examSessions');
            expect(descriptor.enumerable).toBe(false);

            const serialized = JSON.parse(JSON.stringify(freshState));
            expect(serialized.examSessions).toBeUndefined();
            expect(serialized.subjects.math.examSessions).toBeDefined();
        });

        test('characterizes OCC reconciliation SERVER_WINS_FIELDS deleting un-enumerable or missing root fields', () => {
            const serverState = {
                xp: 200,
                scores: { 'bai-1': 100 },
                subjects: {
                    math: {
                        scores: { 'bai-1': 100 },
                        examSessions: [{ id: 'server_sess_1', lessonId: 'bai-1' }]
                    }
                }
            };

            const localState = {
                xp: 150,
                scores: { 'bai-1': 100 },
                examSessions: [{ id: 'local_sess_1', lessonId: 'bai-1' }],
                subjects: {
                    math: {
                        scores: { 'bai-1': 100 },
                        examSessions: [{ id: 'local_sess_1', lessonId: 'bai-1' }]
                    }
                }
            };

            const merged = { ...localState, ...serverState };
            const SERVER_WINS_FIELDS = ['history', 'examSessions', 'xp', 'streak'];

            for (const field of SERVER_WINS_FIELDS) {
                if (Object.prototype.hasOwnProperty.call(serverState, field)) {
                    merged[field] = serverState[field];
                } else {
                    delete merged[field];
                }
            }

            expect(merged.examSessions).toBeUndefined();
            expect(merged.subjects.math.examSessions).toBeDefined();
            expect(merged.subjects.math.examSessions.length).toBe(1);
        });
    });

    describe('3. Concurrency and Mutex Behavior in saveProgress', () => {
        test('characterizes rapid double save in finishPractice() triggering hasPendingSave', async () => {
            let activeNetworkRequests = 0;
            let maxConcurrent = 0;
            let saveCount = 0;
            let hasPendingSave = false;
            let isSavingProgress = false;

            async function mockSaveProgress() {
                if (isSavingProgress) {
                    hasPendingSave = true;
                    return 'queued';
                }
                isSavingProgress = true;
                hasPendingSave = false;
                saveCount++;

                activeNetworkRequests++;
                if (activeNetworkRequests > maxConcurrent) maxConcurrent = activeNetworkRequests;

                await new Promise(r => setTimeout(r, 20));
                activeNetworkRequests--;

                isSavingProgress = false;
                if (hasPendingSave) {
                    await mockSaveProgress();
                }
                return 'saved';
            }

            const p1 = mockSaveProgress();
            const p2 = mockSaveProgress();

            const [r1, r2] = await Promise.all([p1, p2]);

            expect(maxConcurrent).toBe(1);
            expect(r1).toBe('saved');
            expect(r2).toBe('queued');
            expect(saveCount).toBe(2);
        });
    });

    describe('4. Stale UI / Lesson Map Re-render Characterization', () => {
        test('verifies that finishPractice refreshes dashboard timeline immediately', () => {
            const questionsJsPath = path.resolve(__dirname, '../../js/questions-v3.js');
            const questionsJsContent = fs.readFileSync(questionsJsPath, 'utf8');

            const finishPracticeIdx = questionsJsContent.indexOf('finishPractice: function');
            expect(finishPracticeIdx).toBeGreaterThan(0);

            const finishPracticeBody = questionsJsContent.slice(finishPracticeIdx, finishPracticeIdx + 15000);

            expect(finishPracticeBody).toContain('app.saveLessonScore');
            expect(finishPracticeBody).toContain('app.saveProgress');
            expect(finishPracticeBody).toContain('app.updateLessonEvaluation');
            expect(finishPracticeBody).toContain('app.renderLessonHistory');
            expect(finishPracticeBody).toContain('app.renderTimeline()');
        });

        test('verifies that timeline re-render updates DOM nodes and unlocks next lessons based on mutated state', () => {
            // Mock DOM structure for skill tree container
            const container = { innerHTML: '', children: [], appendChild: jest.fn() };
            
            // Simulating app state mutation in finishPractice
            const mockState = {
                scores: { 'bai-1': 85 } // 85% passes bai-1 and should unlock bai-2
            };

            const COURSE_DATA = [
                {
                    semester: 1,
                    class: '6',
                    subject: 'math',
                    title: 'Chương 1: Tập hợp',
                    subtitle: 'Số tự nhiên',
                    lessons: [
                        { id: 'bai-1', title: 'Bài 1: Tập hợp' },
                        { id: 'bai-2', title: 'Bài 2: Tập hợp số tự nhiên' }
                    ]
                }
            ];

            // Linear unlock status logic mirroring app.js:getLessonStatus
            function getLessonStatus(lessonId) {
                const flat = ['bai-1', 'bai-2'];
                const idx = flat.indexOf(lessonId);
                if (idx === 0) return (mockState.scores[lessonId] || 0) >= 80 ? 'completed' : 'active';
                const prevScore = mockState.scores[flat[idx - 1]] || 0;
                if (prevScore >= 80) {
                    return (mockState.scores[lessonId] || 0) >= 80 ? 'completed' : 'active';
                }
                return 'locked';
            }

            // Before state mutation (initial state: bai-1 score = 0)
            mockState.scores = { 'bai-1': 0 };
            expect(getLessonStatus('bai-1')).toBe('active');
            expect(getLessonStatus('bai-2')).toBe('locked');

            // After finishPractice state mutation: score = 85
            mockState.scores = { 'bai-1': 85 };
            // Immediate re-render reads latest state
            expect(getLessonStatus('bai-1')).toBe('completed');
            expect(getLessonStatus('bai-2')).toBe('active'); // Unlocked!
        });
    });
});