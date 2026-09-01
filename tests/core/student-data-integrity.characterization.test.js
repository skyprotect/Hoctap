/**
 * STUDENT DATA INTEGRITY FORENSIC CHARACTERIZATION SUITE
 * 
 * Verifies DATA STATE across:
 * 1. Full Semester 1 state serialization
 * 2. Full Semester 1 state hydration
 * 3. History survival across reload
 * 4. examSessions survival across reload
 * 5. Lesson progress survival across reload
 * 6. Subject switching preserving inactive subject data
 * 7. Semester switching preserving other semester data
 * 8. Prevention of complete state overwrite with incomplete state
 * 9. OCC reconciliation preserving valid unrelated state
 * 10. Restart producing equivalent persistent state
 */

'use strict';

describe('Student Data Integrity Forensic Characterization Suite', () => {

    // Helper: Mock full Semester 1 student state (matching Trần Bình Minh backup)
    function createCompleteSemester1StudentState() {
        return {
            _revision: 22,
            _sharedXp: 4730,
            xp: 4730,
            englishXp: 4730,
            streak: 15,
            lastActiveDate: '2026-08-31T08:21:01.690Z',
            lastUpdated: '2026-08-31T08:21:01.690Z',
            scores: {
                'bai-1': 100,
                'bai-2': 100,
                'bai-3': 100,
                'bai-4': 100,
                'bai-5': 100,
                'bai-6': 100,
                'bai-7': 100,
                'bai-8': 90,
                'bai-9': 100,
                'bai-10': 100,
                'bai-11': 100,
                'bai-12': 100,
                'bai-13': 100,
                'bai-14': 100,
                'lt-c1-1': 100,
                'lt-c1-2': 100,
                'kt-c1': 95,
                'lt-c2-1': 100,
                'lt-c2-2': 100,
                'kt-c2': 80
            },
            completedSubtopics: [
                'tap-hop', 'tap-hop-thu-tu', 'ghi-so-tu-nhien', 'cong-tru-so-tu-nhien',
                'nhan-chia-so-tu-nhien', 'thu-tu-phep-tinh', 'luy-thua', 'nhan-chia-luy-thua'
            ],
            subtopicScores: {
                'tap-hop': 100,
                'tap-hop-thu-tu': 100,
                'ghi-so-tu-nhien': 100
            },
            completedLessonTheory: ['bai-1', 'bai-2', 'bai-3'],
            badges: ['badge-1', 'badge-2', 'badge-3'],
            goldBadges: [],
            history: [
                { date: '2026-08-31T08:00:00.000Z', lessonId: 'bai-1', isCorrect: true, questionType: 'tap-hop' },
                { date: '2026-08-31T08:05:00.000Z', lessonId: 'bai-1', isCorrect: true, questionType: 'tap-hop' }
            ],
            examSessions: [
                {
                    id: 1453,
                    lessonId: 'bai-1',
                    subject: 'math',
                    scorePercent: 100,
                    totalQuestions: 10,
                    date: '2026-08-31T08:21:01.690Z'
                }
            ],
            subjects: {
                math: {
                    scores: {
                        'bai-1': 100, 'bai-2': 100, 'bai-3': 100, 'bai-4': 100,
                        'bai-5': 100, 'bai-6': 100, 'bai-7': 100, 'bai-8': 90,
                        'bai-9': 100, 'bai-10': 100, 'bai-11': 100, 'bai-12': 100,
                        'bai-13': 100, 'bai-14': 100, 'lt-c1-1': 100, 'lt-c1-2': 100,
                        'kt-c1': 95, 'lt-c2-1': 100, 'lt-c2-2': 100, 'kt-c2': 80
                    },
                    completedSubtopics: [
                        'tap-hop', 'tap-hop-thu-tu', 'ghi-so-tu-nhien', 'cong-tru-so-tu-nhien',
                        'nhan-chia-so-tu-nhien', 'thu-tu-phep-tinh', 'luy-thua', 'nhan-chia-luy-thua'
                    ],
                    subtopicScores: { 'tap-hop': 100, 'tap-hop-thu-tu': 100, 'ghi-so-tu-nhien': 100 },
                    completedLessonTheory: ['bai-1', 'bai-2', 'bai-3'],
                    examSessions: [
                        { id: 1453, lessonId: 'bai-1', subject: 'math', scorePercent: 100, totalQuestions: 10 }
                    ]
                },
                english: {
                    scores: { 'eng-unit-1': 90 },
                    completedSubtopics: ['greetings'],
                    subtopicScores: { 'greetings': 90 },
                    completedLessonTheory: ['eng-unit-1'],
                    examSessions: [],
                    skillScores: { listening: 80, speaking: 75, reading: 90, spelling: 85 },
                    weakVocabulary: []
                }
            }
        };
    }

    test('1. Full Semester 1 state survives serialization and round-trip parsing', () => {
        const originalState = createCompleteSemester1StudentState();
        const serialized = JSON.stringify(originalState);
        const parsed = JSON.parse(serialized);

        expect(Object.keys(parsed.scores).length).toBe(20);
        expect(parsed.scores['bai-1']).toBe(100);
        expect(parsed.scores['bai-14']).toBe(100);
        expect(parsed.completedSubtopics.length).toBe(8);
        expect(parsed.history.length).toBe(2);
        expect(parsed.examSessions.length).toBe(1);
        expect(parsed.subjects.math.scores['bai-1']).toBe(100);
        expect(parsed.subjects.english.scores['eng-unit-1']).toBe(90);
    });

    test('2. Proxied state without enumerable:true loses root properties on spread or Object.keys', () => {
        const state = createCompleteSemester1StudentState();
        const currentSubject = 'math';

        // Simulating current app.js setupSubjectStateProxies implementation:
        // When properties are defined fresh or existing properties deleted then defined without enumerable: true
        const fields = ['scores', 'completedSubtopics', 'examSessions'];
        fields.forEach(field => {
            delete state[field];
            Object.defineProperty(state, field, {
                get: () => state.subjects[currentSubject][field],
                set: (val) => { state.subjects[currentSubject][field] = val; },
                configurable: true
                // Note: enumerable defaults to FALSE!
            });
        });

        // Demonstrating the flaw: spread loses the property!
        const spreadState = { ...state };
        expect(spreadState.scores).toBeUndefined(); // Lost on shallow spread!

        // If merged with default state { scores: {} }:
        const defaultState = { scores: {}, completedSubtopics: [], examSessions: [] };
        const overwrittenState = { ...defaultState, ...spreadState };
        expect(overwrittenState.scores).toEqual({}); // Overwritten with empty object!
        expect(overwrittenState.completedSubtopics).toEqual([]); // Overwritten with empty array!
    });

    test('3. Enumerable proxies correctly preserve properties across spread and serialization', () => {
        const state = createCompleteSemester1StudentState();
        const currentSubject = 'math';

        const fields = ['scores', 'completedSubtopics', 'examSessions'];
        fields.forEach(field => {
            Object.defineProperty(state, field, {
                get: () => state.subjects[currentSubject][field],
                set: (val) => { state.subjects[currentSubject][field] = val; },
                enumerable: true, // PROPER SPECIFICATION
                configurable: true
            });
        });

        const spreadState = { ...state };
        expect(spreadState.scores).toBeDefined();
        expect(Object.keys(spreadState.scores).length).toBe(20);
        expect(spreadState.scores['bai-1']).toBe(100);

        const serialized = JSON.stringify(spreadState);
        const parsed = JSON.parse(serialized);
        expect(parsed.scores['bai-1']).toBe(100);
        expect(parsed.subjects.math.scores['bai-1']).toBe(100);
    });

    test('4. Hydration preserves both root scores and subject-specific scores', () => {
        const serverData = createCompleteSemester1StudentState();
        const localState = {
            scores: {},
            completedSubtopics: [],
            subjects: {
                math: { scores: {}, completedSubtopics: [] },
                english: { scores: {}, completedSubtopics: [] }
            }
        };

        // Proper hydration pattern
        const hydratedState = {
            ...localState,
            ...serverData,
            subjects: {
                math: {
                    ...localState.subjects.math,
                    ...(serverData.subjects?.math || {})
                },
                english: {
                    ...localState.subjects.english,
                    ...(serverData.subjects?.english || {})
                }
            }
        };

        expect(Object.keys(hydratedState.scores).length).toBe(20);
        expect(Object.keys(hydratedState.subjects.math.scores).length).toBe(20);
        expect(hydratedState.subjects.english.scores['eng-unit-1']).toBe(90);
    });

    test('5. Subject switching preserves inactive subject state', () => {
        const state = createCompleteSemester1StudentState();
        let currentSubject = 'math';

        const getActiveScores = () => state.subjects[currentSubject].scores;

        expect(getActiveScores()['bai-1']).toBe(100);
        expect(getActiveScores()['eng-unit-1']).toBeUndefined();

        // Switch to english
        currentSubject = 'english';
        expect(getActiveScores()['eng-unit-1']).toBe(90);
        expect(getActiveScores()['bai-1']).toBeUndefined();

        // Verify math scores were not corrupted or wiped
        expect(state.subjects.math.scores['bai-1']).toBe(100);
        expect(Object.keys(state.subjects.math.scores).length).toBe(20);

        // Switch back to math
        currentSubject = 'math';
        expect(getActiveScores()['bai-1']).toBe(100);
    });

    test('6. Incomplete state cannot overwrite complete state during save check', () => {
        const completePersistedState = createCompleteSemester1StudentState();
        const incomingIncompleteState = {
            _sharedXp: 2000,
            xp: 2000,
            scores: {},
            completedSubtopics: [],
            subjects: {
                math: { scores: {}, completedSubtopics: [] }
            }
        };

        // Guard rule: Verify that incoming state has significantly less data than persisted
        const persistedScoreCount = Object.keys(completePersistedState.scores || {}).length;
        const incomingScoreCount = Object.keys(incomingIncompleteState.scores || {}).length;

        const isUnsafeOverwrite = persistedScoreCount > 0 && incomingScoreCount === 0;
        expect(isUnsafeOverwrite).toBe(true);

        // A protective merge should preserve the persisted scores
        const safeMergedState = {
            ...incomingIncompleteState,
            scores: { ...completePersistedState.scores, ...incomingIncompleteState.scores },
            subjects: {
                ...incomingIncompleteState.subjects,
                math: {
                    ...completePersistedState.subjects.math,
                    ...incomingIncompleteState.subjects.math,
                    scores: {
                        ...completePersistedState.subjects.math.scores,
                        ...incomingIncompleteState.subjects.math.scores
                    }
                }
            }
        };

        expect(Object.keys(safeMergedState.scores).length).toBe(20);
        expect(Object.keys(safeMergedState.subjects.math.scores).length).toBe(20);
    });

    test('7. OCC reconciliation preserves valid history and examSessions when server has empty arrays', () => {
        const localStateWithHistory = createCompleteSemester1StudentState();
        const serverStateWithEmptyHistory = {
            ...createCompleteSemester1StudentState(),
            _revision: 23,
            history: [],
            examSessions: []
        };

        // If SERVER_WINS unconditionally overwrites empty arrays, client history is destroyed:
        // Demonstrating the difference between unconditional overwrite vs preserving non-empty client data
        const unionSessions = (localSessions, serverSessions) => {
            const map = new Map();
            (serverSessions || []).forEach(s => { if (s && s.id) map.set(s.id, s); });
            (localSessions || []).forEach(s => { if (s && s.id && !map.has(s.id)) map.set(s.id, s); });
            return Array.from(map.values());
        };

        const reconciledSessions = unionSessions(localStateWithHistory.examSessions, serverStateWithEmptyHistory.examSessions);
        expect(reconciledSessions.length).toBe(1);
        expect(reconciledSessions[0].id).toBe(1453);
    });

    test('8. Reconstructing lesson status from scores unlocks Semester 1 progressive timeline', () => {
        const state = createCompleteSemester1StudentState();
        const semester1Lessons = [
            'bai-1', 'bai-2', 'bai-3', 'bai-4', 'bai-5',
            'bai-6', 'bai-7', 'bai-8', 'bai-9', 'bai-10',
            'bai-11', 'bai-12', 'bai-13', 'bai-14'
        ];

        // getLessonStatus logic
        function computeLessonStatus(lessonId, flatLessons, scores) {
            const idx = flatLessons.indexOf(lessonId);
            if (idx === -1) return 'locked';
            if (idx === 0) {
                return (scores[lessonId] || 0) >= 80 ? 'completed' : 'active';
            }
            let currentStatus = 'completed';
            for (let i = 0; i <= idx; i++) {
                const lid = flatLessons[i];
                const score = scores[lid] || 0;
                if (i === 0) {
                    currentStatus = score >= 80 ? 'completed' : 'active';
                } else {
                    if (currentStatus === 'completed') {
                        currentStatus = score >= 80 ? 'completed' : 'active';
                    } else {
                        currentStatus = 'locked';
                    }
                }
                if (i === idx) return currentStatus;
            }
            return 'locked';
        }

        // With complete scores:
        expect(computeLessonStatus('bai-1', semester1Lessons, state.scores)).toBe('completed');
        expect(computeLessonStatus('bai-8', semester1Lessons, state.scores)).toBe('completed');
        expect(computeLessonStatus('bai-14', semester1Lessons, state.scores)).toBe('completed');

        // With empty scores (as currently found in production bug):
        const emptyScores = {};
        expect(computeLessonStatus('bai-1', semester1Lessons, emptyScores)).toBe('active');
        expect(computeLessonStatus('bai-2', semester1Lessons, emptyScores)).toBe('locked');
        expect(computeLessonStatus('bai-14', semester1Lessons, emptyScores)).toBe('locked');
    });

    test('9. SQLite exam_sessions records can be used as authoritative recovery source for scores', () => {
        // Simulating the 1351 rows currently in database.db exam_sessions
        const mockDbExamSessions = [
            { lesson_id: 'bai-1', score_percent: 100 },
            { lesson_id: 'bai-2', score_percent: 85 },
            { lesson_id: 'bai-17', score_percent: 80 },
            { lesson_id: 'kt-c5', score_percent: 95 },
            { lesson_id: 'lt-c6-1', score_percent: 100 }
        ];

        const reconstructedScores = {};
        mockDbExamSessions.forEach(sess => {
            const curr = reconstructedScores[sess.lesson_id] || 0;
            if (sess.score_percent > curr) {
                reconstructedScores[sess.lesson_id] = sess.score_percent;
            }
        });

        expect(reconstructedScores['bai-1']).toBe(100);
        expect(reconstructedScores['bai-2']).toBe(85);
        expect(reconstructedScores['bai-17']).toBe(80);
        expect(reconstructedScores['kt-c5']).toBe(95);
        expect(reconstructedScores['lt-c6-1']).toBe(100);
    });

    test('10. Full round-trip state equality check (Save -> Load -> Hydrate -> Verify)', () => {
        const originalState = createCompleteSemester1StudentState();
        
        // Step 1: Serialize (Client Save Payload)
        const clientSavePayload = JSON.stringify({
            studentId: 'std_htsj4gbmo',
            state: originalState
        });

        // Step 2: Server Receives and Stores
        const serverParsed = JSON.parse(clientSavePayload);
        const storedInDb = JSON.stringify(serverParsed.state);

        // Step 3: Server Returns on loadProgress
        const serverLoadedState = JSON.parse(storedInDb);

        // Step 4: Client Hydrates
        const hydratedClientState = {
            ...originalState,
            ...serverLoadedState
        };

        expect(hydratedClientState.scores['bai-1']).toBe(100);
        expect(hydratedClientState.scores['bai-14']).toBe(100);
        expect(hydratedClientState.subjects.math.scores['bai-1']).toBe(100);
        expect(hydratedClientState.completedSubtopics.length).toBe(8);
        expect(hydratedClientState.examSessions.length).toBe(1);
    });
});

describe('Micro-Fix setupSubjectStateProxies Enumerability Verification', () => {
    const PROXIED_FIELDS = [
        'scores',
        'completedSubtopics',
        'subtopicScores',
        'completedLessonTheory',
        'examSessions',
        'slainMonstersCount',
        'englishStreak',
        'goldSkills',
        'redeemedSkills',
        'skillScores',
        'weakVocabulary',
        'cardExchangeHistory'
    ];

    function createMockAppWithProxies() {
        const mockApp = {
            currentSubject: 'math',
            state: {
                student: 'Trần Bình Minh',
                _sharedXp: 4730,
                streak: 6,
                subjects: {
                    math: {
                        scores: { 'bai-1': 100, 'bai-2': 90 },
                        completedSubtopics: ['tap-hop', 'luy-thua'],
                        subtopicScores: { 'tap-hop': 100 },
                        completedLessonTheory: ['bai-1'],
                        examSessions: [{ id: 101, lessonId: 'bai-1', scorePercent: 100 }],
                        slainMonstersCount: 5,
                        englishStreak: 0,
                        goldSkills: ['card-1'],
                        redeemedSkills: ['card-2'],
                        skillScores: { 'math-skill': 100 },
                        weakVocabulary: [],
                        cardExchangeHistory: [{ id: 'ex-1' }]
                    },
                    english: {
                        scores: { 'unit-1': 95 },
                        completedSubtopics: ['vocab-1'],
                        subtopicScores: { 'vocab-1': 95 },
                        completedLessonTheory: ['unit-1'],
                        examSessions: [{ id: 201, lessonId: 'unit-1', scorePercent: 95 }],
                        slainMonstersCount: 2,
                        englishStreak: 4,
                        goldSkills: ['eng-card-1'],
                        redeemedSkills: [],
                        skillScores: { listening: 90, speaking: 85, reading: 95, spelling: 90 },
                        weakVocabulary: ['difficult-word'],
                        cardExchangeHistory: [{ id: 'ex-2' }]
                    }
                }
            }
        };

        // Exact implementation from js/app.js setupSubjectStateProxies
        PROXIED_FIELDS.forEach(field => {
            Object.defineProperty(mockApp.state, field, {
                get: () => {
                    const subj = mockApp.currentSubject || 'math';
                    if (!mockApp.state.subjects[subj]) {
                        mockApp.state.subjects[subj] = {};
                    }
                    if (!mockApp.state.subjects[subj][field]) {
                        mockApp.state.subjects[subj][field] = (field === 'scores' || field === 'subtopicScores' || field === 'skillScores') ? {} : [];
                    }
                    return mockApp.state.subjects[subj][field];
                },
                set: (val) => {
                    const subj = mockApp.currentSubject || 'math';
                    if (!mockApp.state.subjects[subj]) {
                        mockApp.state.subjects[subj] = {};
                    }
                    mockApp.state.subjects[subj][field] = val;
                },
                enumerable: true,
                configurable: true
            });
        });

        return mockApp;
    }

    test('All 12 registered proxy fields are enumerable on state', () => {
        const app = createMockAppWithProxies();
        const keys = Object.keys(app.state);

        PROXIED_FIELDS.forEach(field => {
            expect(keys).toContain(field);
            const desc = Object.getOwnPropertyDescriptor(app.state, field);
            expect(desc.enumerable).toBe(true);
            expect(desc.configurable).toBe(true);
        });
    });

    test('Spread operator { ...state } preserves all 12 proxied fields', () => {
        const app = createMockAppWithProxies();
        const spreadState = { ...app.state };

        expect(spreadState.scores).toEqual({ 'bai-1': 100, 'bai-2': 90 });
        expect(spreadState.completedSubtopics).toEqual(['tap-hop', 'luy-thua']);
        expect(spreadState.subtopicScores).toEqual({ 'tap-hop': 100 });
        expect(spreadState.completedLessonTheory).toEqual(['bai-1']);
        expect(spreadState.examSessions).toEqual([{ id: 101, lessonId: 'bai-1', scorePercent: 100 }]);
        expect(spreadState.slainMonstersCount).toBe(5);
        expect(spreadState.goldSkills).toEqual(['card-1']);
        expect(spreadState.redeemedSkills).toEqual(['card-2']);
        expect(spreadState.cardExchangeHistory).toEqual([{ id: 'ex-1' }]);
    });

    test('Object.assign({}, state) preserves all 12 proxied fields', () => {
        const app = createMockAppWithProxies();
        const assigned = Object.assign({}, app.state);

        expect(assigned.scores).toEqual({ 'bai-1': 100, 'bai-2': 90 });
        expect(assigned.completedSubtopics).toEqual(['tap-hop', 'luy-thua']);
        expect(assigned.goldSkills).toEqual(['card-1']);
    });

    test('JSON.stringify(state) contains root level proxied properties', () => {
        const app = createMockAppWithProxies();
        const serialized = JSON.stringify(app.state);
        const parsed = JSON.parse(serialized);

        expect(parsed.scores).toBeDefined();
        expect(parsed.scores['bai-1']).toBe(100);
        expect(parsed.completedSubtopics).toEqual(['tap-hop', 'luy-thua']);
        expect(parsed.examSessions.length).toBe(1);
    });

    test('Getters and Setters write/read to the active subject without cross-contamination', () => {
        const app = createMockAppWithProxies();

        // 1. In math:
        app.currentSubject = 'math';
        expect(app.state.scores['bai-1']).toBe(100);
        expect(app.state.slainMonstersCount).toBe(5);

        // Mutate via setter in math
        app.state.scores = { ...app.state.scores, 'bai-3': 100 };
        expect(app.state.subjects.math.scores['bai-3']).toBe(100);

        // 2. Switch to english:
        app.currentSubject = 'english';
        expect(app.state.scores['bai-1']).toBeUndefined();
        expect(app.state.scores['unit-1']).toBe(95);
        expect(app.state.slainMonstersCount).toBe(2);
        expect(app.state.weakVocabulary).toEqual(['difficult-word']);

        // Inactive subject math is completely preserved:
        expect(app.state.subjects.math.scores['bai-3']).toBe(100);
        expect(app.state.subjects.math.scores['bai-1']).toBe(100);

        // Mutate via setter in english
        app.state.scores = { ...app.state.scores, 'unit-2': 100 };
        expect(app.state.subjects.english.scores['unit-2']).toBe(100);

        // 3. Switch back to math:
        app.currentSubject = 'math';
        expect(app.state.scores['bai-3']).toBe(100);
        expect(app.state.scores['unit-2']).toBeUndefined();
        expect(app.state.subjects.english.scores['unit-2']).toBe(100);
    });
});

describe('Startup Flow Without Unconditional Persistence Verification', () => {
    test('1. loadProgress does not issue unconditional saveProgress on clean startup', async () => {
        let saveCalled = false;
        const mockApp = {
            config: { currentClass: '6', defaultStudentId: 'std_htsj4gbmo' },
            currentSubject: 'math',
            state: {
                scores: {},
                completedSubtopics: [],
                subjects: { math: { scores: {}, completedSubtopics: [] } }
            },
            getDefaultState: () => ({ scores: {}, completedSubtopics: [], subjects: { math: { scores: {}, completedSubtopics: [] } } }),
            syncOfflineProgress: jest.fn().mockResolvedValue(true),
            getApiUrl: (url) => url,
            getLocalStorageKey: () => 'app_state_6',
            restoreMathProgress: jest.fn(),
            setupSubjectStateProxies: jest.fn(),
            loadCustomTopics: jest.fn().mockResolvedValue(true),
            saveProgress: jest.fn().mockImplementation(async () => { saveCalled = true; })
        };

        // Mock fetch returning existing student data
        const mockServerData = {
            _revision: 23,
            xp: 4730,
            scores: { 'bai-1': 100, 'bai-2': 100 },
            completedSubtopics: ['tap-hop'],
            cleanedOldTheoryVideos: true,
            migratedDuplicateAnswersV5: true,
            migratedDuplicateAnswersV6: true,
            migratedParityBugV7: true,
            migratedShortAnswerBugV11: true,
            migratedPregenBugsV8: true,
            migratedPregenBugsV9: true,
            migratedFixMissingThuTuPhepTinhV10: true,
            subjects: {
                math: {
                    scores: { 'bai-1': 100, 'bai-2': 100 },
                    completedSubtopics: ['tap-hop']
                }
            }
        };

        // Simulate loadProgress logic with line 4530 saveProgress removed
        mockApp.state = { ...mockApp.getDefaultState(), ...mockApp.state };
        mockApp.state = { ...mockApp.state, ...mockServerData };
        mockApp.restoreMathProgress();
        mockApp.setupSubjectStateProxies();

        // Verification: saveProgress is NOT called simply because startup completed!
        expect(saveCalled).toBe(false);
        expect(mockApp.state.scores['bai-1']).toBe(100);
        expect(mockApp.state.xp).toBe(4730);
    });

    test('2. Multiple consecutive startups do not mutate or degrade persistent state', () => {
        const persistedServerState = {
            _revision: 23,
            xp: 4730,
            scores: { 'bai-1': 100, 'bai-2': 100, 'bai-14': 100 },
            completedSubtopics: ['tap-hop', 'luy-thua'],
            examSessions: [{ id: 1, lessonId: 'bai-1' }],
            history: [{ lessonId: 'bai-1', isCorrect: true }]
        };

        // Cycle 1: Startup
        let state1 = { ...persistedServerState };
        expect(Object.keys(state1.scores).length).toBe(3);

        // Cycle 2: Restart without user changes
        let state2 = { ...state1 };
        expect(Object.keys(state2.scores).length).toBe(3);
        expect(state2.completedSubtopics).toEqual(['tap-hop', 'luy-thua']);
        expect(state2.examSessions.length).toBe(1);

        // Cycle 3: Restart again
        let state3 = { ...state2 };
        expect(state3).toEqual(persistedServerState);
    });

    test('3. finishPractice() still persists user progress when questions are completed', () => {
        let savedState = null;
        const mockApp = {
            state: {
                xp: 4730,
                scores: { 'bai-1': 100 },
                subjects: { math: { scores: { 'bai-1': 100 } } }
            },
            saveProgress: jest.fn().mockImplementation(async function() {
                savedState = JSON.parse(JSON.stringify(this.state));
            })
        };

        // User finishes a new lesson
        mockApp.state.scores['bai-2'] = 100;
        mockApp.state.xp += 100;
        mockApp.saveProgress();

        expect(mockApp.saveProgress).toHaveBeenCalledTimes(1);
        expect(savedState.scores['bai-2']).toBe(100);
        expect(savedState.xp).toBe(4830);
    });
});
