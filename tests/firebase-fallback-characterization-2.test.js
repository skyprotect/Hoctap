/**
 * Firebase fallback characterization-2.
 *
 * This suite executes the production client `loadProgress` and `saveProgress`
 * functions in a browser-shaped test harness.  The harness replaces only I/O
 * and post-hydration UI work; branch selection and payload construction remain
 * the implementation in js/app.js.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const Module = require('module');
const request = require('supertest');
const { createMockApp } = require('./helpers/mock-server');
const { dbDeleteStudentProgress } = require('../server/db/database');

jest.mock('../server/services/firebase.service', () => ({
    syncStudentProgressToFirebase: jest.fn().mockResolvedValue(true),
    syncAllStudentsToFirebase: jest.fn().mockResolvedValue(true),
    FIREBASE_RTDB_URL: 'https://mock-rtdb.firebaseio.com/',
    firebaseConfig: { apiKey: 'mock', projectId: 'mock', appId: 'mock' }
}));

const MIGRATION_FLAGS = {
    cleanedOldTheoryVideos: true,
    migratedDuplicateAnswersV5: true,
    migratedDuplicateAnswersV6: true,
    migratedParityBugV7: true,
    migratedShortAnswerBugV11: true,
    migratedPregenBugsV8: true,
    migratedPregenBugsV9: true,
    migratedFixMissingThuTuPhepTinhV10: true
};

const protectedState = {
    ...MIGRATION_FLAGS,
    xp: 700,
    _sharedXp: 700,
    englishXp: 650,
    scores: { root: 90 },
    completedSubtopics: ['root-subtopic'],
    subtopicScores: { 'root-subtopic': 90 },
    completedLessonTheory: ['root-theory'],
    badges: ['badge-1'],
    goldBadges: ['gold-1'],
    levelScores: { root_level: 90 },
    history: [{ id: 'history-1', lessonId: 'root', isCorrect: true }],
    examSessions: [{ id: 'exam-1', lessonId: 'root' }],
    subjects: {
        math: { scores: { math: 91 }, completedSubtopics: ['math-sub'], subtopicScores: { 'math-sub': 91 }, completedLessonTheory: ['math-theory'] },
        english: { scores: { english: 92 }, completedSubtopics: ['eng-sub'], subtopicScores: { 'eng-sub': 92 }, completedLessonTheory: ['eng-theory'], skillScores: { listening: 93 } }
    }
};

function createStorage(localState, key) {
    const values = new Map(localState ? [[key, JSON.stringify(localState)]] : []);
    return { getItem: jest.fn(k => values.has(k) ? values.get(k) : null), setItem: jest.fn((k, v) => values.set(k, v)), removeItem: jest.fn(k => values.delete(k)) };
}

function loadProductionApp({ localState, serverState, rtdbState, onSave, studentId = 'std_fallback_characterization' }) {
    const localKey = `toan6_edtech_progress_${studentId}`;
    const storage = createStorage(localState, localKey);
    const calls = { saves: [], rtdb: 0 };
    const appSource = fs.readFileSync(path.resolve(__dirname, '../js/app.js'), 'utf8');
    const appRequire = Module.createRequire(path.resolve(__dirname, '../js/app.js'));
    const document = { readyState: 'loading', addEventListener: jest.fn(), getElementById: jest.fn(() => null), querySelector: jest.fn(() => null) };
    const window = { safeStorage: storage, location: { protocol: 'http:' } };
    const fetch = jest.fn(async (url, options) => {
        if (String(url).includes('/api/load-progress')) return { ok: true, json: async () => serverState || {} };
        if (String(url).includes('firebaseio.com/leaderboard/')) { calls.rtdb++; return { ok: true, json: async () => rtdbState || null }; }
        if (String(url).includes('/api/save-progress')) {
            const payload = JSON.parse(options.body);
            calls.saves.push(payload);
            if (onSave) return onSave(payload);
            return { ok: true, status: 200, json: async () => ({ state: payload.state, revision: (payload.baseRevision || 0) + 1 }) };
        }
        throw new Error(`Unexpected client fetch: ${url}`);
    });
    const factory = new Function('window', 'document', 'fetch', 'require', 'console', `${appSource}; return window.app;`);
    const app = factory(window, document, fetch, appRequire, console);
    app.config = { ...app.config, currentClass: '6', defaultStudentId: studentId, studentName: 'Fallback Test' };
    app.syncOfflineProgress = jest.fn().mockResolvedValue(undefined);
    app.restoreMathProgress = jest.fn();
    app.setupSubjectStateProxies = jest.fn();
    app.loadCustomTopics = jest.fn().mockResolvedValue(undefined);
    for (const name of ['migrateDuplicateAnswers', 'migrateDuplicateAnswersV6', 'migrateParityBugV7', 'migrateShortAnswerBugV11', 'migratePregenBugsV8', 'migratePregenBugsV9', 'migrateFixMissingThuTuPhepTinh']) app[name] = jest.fn();
    return { app, calls, storage };
}

describe('Firebase Fallback Characterization-2 — production client branch selection', () => {
    const cases = [
        ['TC-01 xp=0 + root scores', { ...MIGRATION_FLAGS, xp: 0, scores: { root: 90 } }, {}, 'local'],
        ['TC-02 xp=0 + completedSubtopics', { ...MIGRATION_FLAGS, xp: 0, completedSubtopics: ['s'] }, {}, 'local'],
        ['TC-03 xp=0 + history', { ...MIGRATION_FLAGS, xp: 0, history: protectedState.history }, {}, 'local'],
        ['TC-04 xp=0 + subjects.math.scores', { ...MIGRATION_FLAGS, xp: 0, subjects: { math: { scores: { math: 91 } } } }, {}, 'local'],
        ['TC-05 xp=0 + subjects.english.scores', { ...MIGRATION_FLAGS, xp: 0, subjects: { english: { scores: { english: 92 } } } }, {}, 'local'],
        ['TC-06 xp=0 + completedLessonTheory', { ...MIGRATION_FLAGS, xp: 0, completedLessonTheory: ['t'] }, {}, 'local'],
        ['TC-07 xp=0 + badges/history', { ...MIGRATION_FLAGS, xp: 0, badges: ['b'], history: protectedState.history }, {}, 'local'],
        ['TC-08 xp=0 + English-only learning evidence', { ...MIGRATION_FLAGS, xp: 0, subjects: { english: { weakVocabulary: ['word'], skillScores: { listening: 93 } } } }, {}, 'local'],
        ['positive XP local state', { ...MIGRATION_FLAGS, xp: 10 }, {}, 'local'],
        ['server precedence: local XP lower than server', { ...MIGRATION_FLAGS, xp: 10, scores: { local: 90 } }, { ...MIGRATION_FLAGS, xp: 100, scores: { server: 90 } }, 'server'],
        ['server xp=0 + root scores', null, { ...MIGRATION_FLAGS, xp: 0, scores: { server: 90 } }, 'server']
    ];

    test.each(cases)('%s', async (_name, localState, serverState, selectedSource) => {
        const { app, calls } = loadProductionApp({ localState, serverState });
        await app.loadProgress();
        expect(calls.rtdb).toBe(0);
        if (selectedSource === 'local') {
            expect(calls.saves).toHaveLength(1);
            expect(calls.saves[0].baseRevision).toBe(1);
            expect(calls.saves[0].state).toMatchObject(localState);
        } else {
            expect(calls.saves).toHaveLength(0);
            expect(app.state.scores).toEqual(serverState.scores);
        }
    });

    test('TC-09 clean/default local state remains eligible for Firebase fallback', async () => {
        const cleanState = { ...MIGRATION_FLAGS, xp: 0, scores: {}, subtopicScores: {}, levelScores: {}, completedSubtopics: [], completedLessonTheory: [], badges: [], goldBadges: [], history: [], examSessions: [], subjects: { math: { scores: {}, subtopicScores: {}, completedSubtopics: [], completedLessonTheory: [], examSessions: [] }, english: { scores: {}, subtopicScores: {}, completedSubtopics: [], completedLessonTheory: [], examSessions: [], weakVocabulary: [], skillScores: { listening: 0 } } }, lastUpdated: '2026-09-01', parentPin: '123456' };
        const { app, calls } = loadProductionApp({ localState: cleanState, serverState: {} });
        await app.loadProgress();
        expect(calls.rtdb).toBe(1);
        expect(calls.saves).toHaveLength(1);
        expect(calls.saves[0].state.scores).toEqual({});
    });

    test.each([
        ['no progress / no progress', null, {}, 'fallback'],
        ['local progress xp=0 / no progress', { ...MIGRATION_FLAGS, xp: 0, scores: { local: 90 } }, {}, 'local'],
        ['local progress xp>0 / no progress', { ...MIGRATION_FLAGS, xp: 100 }, {}, 'local'],
        ['no progress / server progress xp=0', null, { ...MIGRATION_FLAGS, xp: 0, scores: { server: 90 } }, 'server'],
        ['no progress / server progress xp>0', null, { ...MIGRATION_FLAGS, xp: 100 }, 'server'],
        ['local progress xp=0 / server progress xp=0', { ...MIGRATION_FLAGS, xp: 0, scores: { local: 90 } }, { ...MIGRATION_FLAGS, xp: 0, scores: { server: 90 } }, 'local'],
        ['local progress xp=0 / server progress xp>100', { ...MIGRATION_FLAGS, xp: 0, scores: { local: 90 } }, { ...MIGRATION_FLAGS, xp: 101 }, 'server'],
        ['local progress xp>100 / server progress xp=0', { ...MIGRATION_FLAGS, xp: 101 }, { ...MIGRATION_FLAGS, xp: 0, scores: { server: 90 } }, 'local'],
        ['local progress xp=50 / server progress xp=100', { ...MIGRATION_FLAGS, xp: 50 }, { ...MIGRATION_FLAGS, xp: 100 }, 'server'],
        ['local progress xp=100 / server progress xp=50', { ...MIGRATION_FLAGS, xp: 100 }, { ...MIGRATION_FLAGS, xp: 50 }, 'local']
    ])('authority matrix: %s', async (_name, localState, serverState, selectedSource) => {
        const { app, calls } = loadProductionApp({ localState, serverState });
        await app.loadProgress();
        const actualSource = calls.rtdb > 0 ? 'fallback' : calls.saves.length > 0 ? 'local' : 'server';
        expect(actualSource).toBe(selectedSource);
    });

    test('J empty local + empty server + RTDB XP/streak saves RTDB-derived state', async () => {
        const { app, calls } = loadProductionApp({ localState: null, serverState: {}, rtdbState: { mathXp: 12, englishXp: 30, mathStreak: 4, englishStreak: 2, lastActiveDate: '2026-09-01' } });
        await app.loadProgress();
        expect(calls.rtdb).toBe(1);
        expect(calls.saves).toHaveLength(1);
        expect(calls.saves[0].state).toMatchObject({ xp: 30, _sharedXp: 30, englishXp: 30, streak: 4, lastActiveDate: '2026-09-01' });
    });
});

describe('Firebase Fallback Characterization-2 — actual server guard and OCC', () => {
    const app = createMockApp();
    const ids = [];
    const newId = suffix => { const id = `std_fallback_c2_${suffix}_${Date.now()}_${ids.length}`; ids.push(id); return id; };
    afterAll(async () => { await Promise.all(ids.map(id => dbDeleteStudentProgress(id))); });

    test('K fallback-shaped payload preserves every protected domain in existing authoritative DB state', async () => {
        const studentId = newId('guard');
        const initial = await request(app).post('/api/save-progress').send({ studentId, classLevel: '6', state: protectedState });
        const incoming = { ...MIGRATION_FLAGS, xp: 0, _sharedXp: 0, englishXp: 0, scores: {}, completedSubtopics: [], subtopicScores: {}, completedLessonTheory: [], badges: [], goldBadges: [], levelScores: {}, history: [], examSessions: [], subjects: { math: { scores: {} }, english: { scores: {} } } };
        const saved = await request(app).post('/api/save-progress').send({ studentId, classLevel: '6', baseRevision: initial.body.revision, state: incoming });
        expect(saved.status).toBe(200);
        const stored = (await request(app).get(`/api/load-progress?studentId=${studentId}`)).body;
        expect(stored).toMatchObject({ xp: 700, _sharedXp: 700, englishXp: 700, scores: protectedState.scores, completedSubtopics: protectedState.completedSubtopics, subtopicScores: protectedState.subtopicScores, completedLessonTheory: protectedState.completedLessonTheory, badges: protectedState.badges, goldBadges: protectedState.goldBadges, levelScores: protectedState.levelScores, history: protectedState.history, examSessions: protectedState.examSessions });
        expect(stored.subjects.math.scores).toEqual(protectedState.subjects.math.scores);
        expect(stored.subjects.math.completedSubtopics).toEqual(protectedState.subjects.math.completedSubtopics);
        expect(stored.subjects.math.subtopicScores).toEqual(protectedState.subjects.math.subtopicScores);
        expect(stored.subjects.math.completedLessonTheory).toEqual(protectedState.subjects.math.completedLessonTheory);
        expect(stored.subjects.english.scores).toEqual(protectedState.subjects.english.scores);
        expect(stored.subjects.english.completedSubtopics).toEqual(protectedState.subjects.english.completedSubtopics);
        expect(stored.subjects.english.subtopicScores).toEqual(protectedState.subjects.english.subtopicScores);
        expect(stored.subjects.english.completedLessonTheory).toEqual(protectedState.subjects.english.completedLessonTheory);
        expect(stored.subjects.english.skillScores).toEqual(protectedState.subjects.english.skillScores);
    });

    test('L stale baseRevision returns 409 and leaves the authoritative record unchanged', async () => {
        const studentId = newId('occ');
        const first = await request(app).post('/api/save-progress').send({ studentId, classLevel: '6', state: protectedState });
        const before = (await request(app).get(`/api/load-progress?studentId=${studentId}`)).body;
        const conflict = await request(app).post('/api/save-progress').send({ studentId, classLevel: '6', baseRevision: first.body.revision - 1, state: { ...MIGRATION_FLAGS, xp: 0, scores: {} } });
        expect(conflict.status).toBe(409);
        expect(conflict.body).toMatchObject({ conflict: true, currentRevision: first.body.revision });
        expect((await request(app).get(`/api/load-progress?studentId=${studentId}`)).body).toEqual(before);
    });

    test('admin server-deletion case: historical zero-XP local learning progress is retained and persisted to an empty DB', async () => {
        const studentId = newId('end_to_end_loss');
        const legacyLocal = { ...protectedState, xp: 0, _sharedXp: 0, englishXp: 0 };
        const { app: client, calls, storage } = loadProductionApp({
            studentId,
            localState: legacyLocal,
            serverState: {},
            onSave: async payload => {
                const response = await request(app).post('/api/save-progress').send(payload);
                return { ok: response.status >= 200 && response.status < 300, status: response.status, json: async () => response.body };
            }
        });
        await client.loadProgress();
        const stored = (await request(app).get(`/api/load-progress?studentId=${studentId}`)).body;
        const localAfterSave = JSON.parse(storage.getItem(`toan6_edtech_progress_${studentId}`));
        expect(calls.saves).toHaveLength(1);
        expect(calls.rtdb).toBe(0);
        expect(stored).toMatchObject({ xp: 0, scores: protectedState.scores, completedSubtopics: protectedState.completedSubtopics, subtopicScores: protectedState.subtopicScores, completedLessonTheory: protectedState.completedLessonTheory, badges: protectedState.badges, goldBadges: protectedState.goldBadges, levelScores: protectedState.levelScores, history: protectedState.history, examSessions: protectedState.examSessions });
        expect(localAfterSave.scores).toEqual(protectedState.scores);
        expect(localAfterSave.history).toEqual(protectedState.history);
        expect(localAfterSave.subjects.math.scores).toEqual(protectedState.subjects.math.scores);
        expect(localAfterSave.subjects.english.scores).toEqual(protectedState.subjects.english.scores);
    });

    test('J end-to-end: empty client/server plus RTDB XP/streak inserts only RTDB-derived fields', async () => {
        const studentId = newId('rtdb_insert');
        const { app: client, calls } = loadProductionApp({
            studentId,
            serverState: {},
            rtdbState: { mathXp: 12, englishXp: 30, mathStreak: 4, englishStreak: 2, lastActiveDate: '2026-09-01' },
            onSave: async payload => {
                const response = await request(app).post('/api/save-progress').send(payload);
                return { ok: response.status >= 200 && response.status < 300, status: response.status, json: async () => response.body };
            }
        });
        await client.loadProgress();
        const stored = (await request(app).get(`/api/load-progress?studentId=${studentId}`)).body;
        expect(calls.saves[0].baseRevision).toBe(1);
        expect(stored).toMatchObject({ xp: 30, _sharedXp: 30, englishXp: 30, streak: 4, lastActiveDate: '2026-09-01', scores: {} });
        expect(stored._revision).toBe(1);
    });
});
