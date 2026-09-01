/**
 * UNIT & INTEGRATION TESTS: Minimal Safety Overwrite Guard (Step 5B)
 * Kiểm thử toàn diện 14 trường hợp bắt buộc và các negative tests.
 * TUYỆT ĐỐI KHÔNG GHI ĐÈ DỮ LIỆU HỌC SINH PRODUCTION TRONG KHI TEST.
 */
const { applyMinimalSafetyGuard, saveProgress } = require('../../server/services/student.service');
const request = require('supertest');
const { createMockApp } = require('../helpers/mock-server');

jest.mock('../../server/services/firebase.service', () => ({
    syncStudentProgressToFirebase: jest.fn().mockResolvedValue(true),
    syncAllStudentsToFirebase: jest.fn().mockResolvedValue(true),
    FIREBASE_RTDB_URL: 'https://mock-rtdb.firebaseio.com/',
    firebaseConfig: { apiKey: 'mock', projectId: 'mock', appId: 'mock' }
}));

describe('Minimal Safety Overwrite Guard - Unit Tests (applyMinimalSafetyGuard)', () => {

    const baseAuthoritativeState = {
        _revision: 23,
        xp: 4730,
        _sharedXp: 4730,
        englishXp: 4730,
        streak: 6,
        scores: {
            'bai-1': 100, 'bai-2': 80, 'bai-3': 100, 'bai-4': 100, 'bai-5': 100,
            'bai-6': 100, 'bai-7': 100, 'bai-8': 90, 'bai-9': 100, 'bai-10': 100,
            'bai-11': 100, 'bai-12': 100, 'bai-13': 100, 'bai-14': 100,
            'lt-c1-1': 100, 'lt-c1-2': 100, 'kt-c1': 100, 'lt-c2-1': 100, 'lt-c2-2': 100, 'kt-c2': 100
        },
        completedSubtopics: Array.from({ length: 57 }, (_, i) => `subtopic-${i + 1}`),
        subtopicScores: Object.fromEntries(Array.from({ length: 57 }, (_, i) => [`subtopic-${i + 1}`, 100])),
        completedLessonTheory: ['bai-1', 'bai-2', 'bai-3', 'bai-4', 'bai-5', 'bai-6', 'bai-7'],
        badges: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10'],
        goldBadges: ['gb1', 'gb2'],
        levelScores: { 'l1': 100, 'l2': 100 },
        history: Array.from({ length: 200 }, (_, i) => ({ id: i + 1, lessonId: 'bai-1', isCorrect: true })),
        examSessions: Array.from({ length: 87 }, (_, i) => ({ id: i + 1, lessonId: 'bai-1', score_percent: 100 })),
        subjects: {
            math: {
                scores: {
                    'bai-1': 100, 'bai-2': 80, 'bai-3': 100, 'bai-4': 100, 'bai-5': 100,
                    'bai-6': 100, 'bai-7': 100, 'bai-8': 90, 'bai-9': 100, 'bai-10': 100,
                    'bai-11': 100, 'bai-12': 100, 'bai-13': 100, 'bai-14': 100,
                    'lt-c1-1': 100, 'lt-c1-2': 100, 'kt-c1': 100, 'lt-c2-1': 100, 'lt-c2-2': 100, 'kt-c2': 100
                },
                completedSubtopics: Array.from({ length: 57 }, (_, i) => `subtopic-${i + 1}`),
                subtopicScores: Object.fromEntries(Array.from({ length: 57 }, (_, i) => [`subtopic-${i + 1}`, 100])),
                completedLessonTheory: ['bai-1', 'bai-2', 'bai-3', 'bai-4', 'bai-5', 'bai-6', 'bai-7'],
                examSessions: [{ id: 1, lessonId: 'bai-1' }]
            },
            english: {
                scores: { 'eng-unit-1': 95 },
                completedSubtopics: ['eng-vocab-1'],
                subtopicScores: { 'eng-vocab-1': 95 },
                completedLessonTheory: ['eng-unit-1'],
                skillScores: { listening: 90, speaking: 85, reading: 95, spelling: 90 },
                weakVocabulary: ['difficult-word']
            }
        }
    };

    test('TEST 1 — ZERO SCORE DOWNGRADE: Existing 20 scores preserved when incoming has empty scores', () => {
        const incoming = { scores: {} };
        const result = applyMinimalSafetyGuard(baseAuthoritativeState, incoming);
        expect(Object.keys(result.scores).length).toBe(20);
        expect(result.scores['bai-1']).toBe(100);
        expect(result.scores['bai-14']).toBe(100);
    });

    test('TEST 2 — SUBTOPIC WIPE: Existing 57 completed subtopics preserved when incoming has empty array', () => {
        const incoming = { completedSubtopics: [] };
        const result = applyMinimalSafetyGuard(baseAuthoritativeState, incoming);
        expect(result.completedSubtopics.length).toBe(57);
        expect(result.completedSubtopics).toContain('subtopic-57');
    });

    test('TEST 3 — SUBTOPIC SCORE WIPE: Existing 57 subtopic scores preserved when incoming has empty object', () => {
        const incoming = { subtopicScores: {} };
        const result = applyMinimalSafetyGuard(baseAuthoritativeState, incoming);
        expect(Object.keys(result.subtopicScores).length).toBe(57);
        expect(result.subtopicScores['subtopic-1']).toBe(100);
    });

    test('TEST 4 — THEORY WIPE: Existing 7 completed theory lessons preserved when incoming has empty array', () => {
        const incoming = { completedLessonTheory: [] };
        const result = applyMinimalSafetyGuard(baseAuthoritativeState, incoming);
        expect(result.completedLessonTheory.length).toBe(7);
        expect(result.completedLessonTheory).toEqual(['bai-1', 'bai-2', 'bai-3', 'bai-4', 'bai-5', 'bai-6', 'bai-7']);
    });

    test('TEST 5 — BADGE WIPE: Existing 10 badges preserved when incoming has empty array', () => {
        const incoming = { badges: [], goldBadges: [] };
        const result = applyMinimalSafetyGuard(baseAuthoritativeState, incoming);
        expect(result.badges.length).toBe(10);
        expect(result.goldBadges.length).toBe(2);
    });

    test('TEST 6 — CROSS-SUBJECT WIPE: English update with missing math preserves math completely', () => {
        const incoming = {
            subjects: {
                english: {
                    scores: { 'eng-unit-1': 100, 'eng-unit-2': 90 }
                }
            }
        };
        const result = applyMinimalSafetyGuard(baseAuthoritativeState, incoming);
        // Math is fully preserved
        expect(Object.keys(result.subjects.math.scores).length).toBe(20);
        expect(result.subjects.math.completedSubtopics.length).toBe(57);
        // English is updated
        expect(result.subjects.english.scores['eng-unit-2']).toBe(90);
    });

    test('TEST 7 — SCORE IMPROVEMENT: Score improves from 80 to 100', () => {
        const incoming = { scores: { 'bai-2': 100 } };
        const result = applyMinimalSafetyGuard(baseAuthoritativeState, incoming);
        expect(result.scores['bai-2']).toBe(100);
    });

    test('TEST 8 — NO SCORE DOWNGRADE: Incoming lower score of 80 does not overwrite existing 100', () => {
        const incoming = { scores: { 'bai-1': 80 } }; // existing is 100
        const result = applyMinimalSafetyGuard(baseAuthoritativeState, incoming);
        expect(result.scores['bai-1']).toBe(100);
    });

    test('TEST 9 — LEGITIMATE NEW SCORE: Adding brand new lesson score bai-15', () => {
        const incoming = { scores: { 'bai-15': 100 } };
        const result = applyMinimalSafetyGuard(baseAuthoritativeState, incoming);
        expect(result.scores['bai-15']).toBe(100);
        expect(result.scores['bai-1']).toBe(100);
        expect(Object.keys(result.scores).length).toBe(21);
    });

    test('TEST 10 — XP COLLAPSE: Incoming 0 XP does not overwrite existing 4730 XP', () => {
        const incoming = { xp: 0, _sharedXp: 0 };
        const result = applyMinimalSafetyGuard(baseAuthoritativeState, incoming);
        expect(result.xp).toBe(4730);
        expect(result._sharedXp).toBe(4730);
    });

    test('TEST 11 — HISTORY EMPTY SNAPSHOT: Existing 200 history entries preserved when incoming is empty', () => {
        const incoming = { history: [] };
        const result = applyMinimalSafetyGuard(baseAuthoritativeState, incoming);
        expect(result.history.length).toBe(200);
    });

    test('TEST 12 — EXAM SESSION EMPTY SNAPSHOT: Existing state examSessions preserved when incoming is empty', () => {
        const incoming = { examSessions: [] };
        const result = applyMinimalSafetyGuard(baseAuthoritativeState, incoming);
        expect(result.examSessions.length).toBe(87);
    });

    test('TEST 14 — SUBJECT INDEPENDENCE: Updating Math leaves English intact, updating English leaves Math intact', () => {
        // 1. Math update
        const mathUpdate = {
            subjects: {
                math: { scores: { 'bai-15': 100 } }
            }
        };
        const resMath = applyMinimalSafetyGuard(baseAuthoritativeState, mathUpdate);
        expect(resMath.subjects.english.scores['eng-unit-1']).toBe(95);
        expect(resMath.subjects.english.skillScores.listening).toBe(90);

        // 2. English update
        const engUpdate = {
            subjects: {
                english: { scores: { 'eng-unit-3': 100 } }
            }
        };
        const resEng = applyMinimalSafetyGuard(baseAuthoritativeState, engUpdate);
        expect(resEng.subjects.math.scores['bai-1']).toBe(100);
        expect(resEng.subjects.math.completedSubtopics.length).toBe(57);
    });

    describe('Negative Tests: Valid Progress Mutations are Fully Allowed', () => {
        test('Allows valid XP increase from 4730 to 4830', () => {
            const incoming = { xp: 4830, _sharedXp: 4830 };
            const result = applyMinimalSafetyGuard(baseAuthoritativeState, incoming);
            expect(result.xp).toBe(4830);
            expect(result._sharedXp).toBe(4830);
        });

        test('Allows adding a new subtopic (57 to 58)', () => {
            const incoming = { completedSubtopics: ['subtopic-58'] };
            const result = applyMinimalSafetyGuard(baseAuthoritativeState, incoming);
            expect(result.completedSubtopics.length).toBe(58);
            expect(result.completedSubtopics).toContain('subtopic-58');
        });

        test('Allows adding a new badge (10 to 11)', () => {
            const incoming = { badges: ['b11'] };
            const result = applyMinimalSafetyGuard(baseAuthoritativeState, incoming);
            expect(result.badges.length).toBe(11);
            expect(result.badges).toContain('b11');
        });

        test('Allows parent PIN update (unprotected field)', () => {
            const incoming = { parentPin: '999999' };
            const result = applyMinimalSafetyGuard(baseAuthoritativeState, incoming);
            expect(result.parentPin).toBe('999999');
        });
    });
});

describe('Minimal Safety Overwrite Guard - Integration & OCC Tests (saveProgress API)', () => {
    let app;
    const testStudentId = 'std_test_guard_' + Date.now();

    beforeAll(() => {
        app = createMockApp();
    });

    test('TEST 13 — OCC CONFLICT: Mismatching baseRevision returns HTTP 409 and leaves DB untouched', async () => {
        // 1. Initial save for test student
        const initialPayload = {
            studentId: testStudentId,
            classLevel: '6',
            studentName: 'Test Guard Student',
            state: {
                xp: 1000,
                scores: { 'bai-1': 100 },
                completedSubtopics: ['sub-1']
            }
        };

        const res1 = await request(app).post('/api/save-progress').send(initialPayload);
        expect(res1.status).toBe(200);
        expect(res1.body.revision).toBe(1);

        // 2. Second save with outdated baseRevision (e.g. 999 instead of 1)
        const stalePayload = {
            studentId: testStudentId,
            classLevel: '6',
            baseRevision: 999,
            state: {
                xp: 0,
                scores: {}
            }
        };

        const res2 = await request(app).post('/api/save-progress').send(stalePayload);
        expect(res2.status).toBe(409);
        expect(res2.body.conflict).toBe(true);
        expect(res2.body.currentRevision).toBe(1);

        // 3. Verify DB state is still revision 1 with original data
        const loadRes = await request(app).get(`/api/load-progress?studentId=${testStudentId}`);
        expect(loadRes.status).toBe(200);
        expect(loadRes.body.xp).toBe(1000);
        expect(loadRes.body.scores['bai-1']).toBe(100);
    });

    test('End-to-End: Valid save with correct revision merges and preserves existing scores in DB', async () => {
        const payloadWithEmptyScores = {
            studentId: testStudentId,
            classLevel: '6',
            baseRevision: 1,
            state: {
                xp: 1000,
                scores: {}, // Accidental empty score payload
                completedSubtopics: [] // Accidental empty subtopics
            }
        };

        const res = await request(app).post('/api/save-progress').send(payloadWithEmptyScores);
        expect(res.status).toBe(200);
        expect(res.body.revision).toBe(2);

        // Verify DB preserved bai-1 = 100 and sub-1
        const loadRes = await request(app).get(`/api/load-progress?studentId=${testStudentId}`);
        expect(loadRes.status).toBe(200);
        expect(loadRes.body.scores['bai-1']).toBe(100);
        expect(loadRes.body.completedSubtopics).toContain('sub-1');
        expect(loadRes.body._revision).toBe(2);
    });
});
