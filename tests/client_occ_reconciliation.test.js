/**
 * CLIENT OCC CONFLICT RECONCILIATION TESTS (v13.99)
 * Kiem thu hanh vi hoa giai xung dot (reconciliation) sau HTTP 409.
 *
 * Pham vi: reconcileOccConflict(), attemptConflictReconciliation(),
 *          va 409 path cua syncOfflineProgress().
 * Bao toan: khong lap lai cac test tu client_occ_conflict.test.js.
 */

'use strict';

// --- Mock globals ---
const mockSafeStorage = {
    _store: {},
    getItem(k) { return this._store[k] !== undefined ? this._store[k] : null; },
    setItem(k, v) { this._store[k] = v; },
    removeItem(k) { delete this._store[k]; },
    clear() { this._store = {}; }
};
global.safeStorage = mockSafeStorage;
global.fetch = jest.fn();
global.firebase = undefined;

// --- Helpers ---
function mockResponse(status, body) {
    const ok = status >= 200 && status < 300;
    return { ok, status, json: async () => body };
}
function mockFetchError(msg) {
    return Promise.reject(new Error(msg));
}

// --- App stub mirrors app.js v13.99 structure ---
function createAppStub(overrides = {}) {
    const stub = {
        isSavingProgress: false,
        hasPendingSave: false,
        hasConflict: false,
        conflictRevision: undefined,
        conflictBaseRevision: undefined,
        baseRevision: 1,
        _isReconciling: false,
        config: { currentClass: '6', defaultStudentId: 'std_test_recon' },
        state: {
            _sharedXp: 100,
            xp: 100,
            englishXp: 100,
            xpMerged: true,
            streak: 5,
            lastActiveDate: '2026-08-30',
            scores: { 'bai-1': 80, 'bai-2': 60 },
            subtopicScores: { 'dt-1': 80 },
            levelScores: { 'bai-1_1': 70 },
            completedSubtopics: ['dt-1'],
            completedLessonTheory: ['lt-1'],
            badges: ['badge-a'],
            goldBadges: [],
            goldSkills: [],
            redeemedSkills: [],
            rewarded100PercentLessons: ['bai-1'],
            history: [{ ts: 1, q: 'old' }],
            examSessions: [],
            subjects: {
                math: {
                    scores: { 'bai-1': 80 },
                    subtopicScores: { 'dt-1': 80 },
                    completedSubtopics: ['dt-1'],
                    completedLessonTheory: ['lt-1'],
                    examSessions: []
                },
                english: {
                    scores: {},
                    subtopicScores: {},
                    completedSubtopics: [],
                    completedLessonTheory: [],
                    examSessions: [],
                    skillScores: { listening: 0, speaking: 0, reading: 0, spelling: 0 },
                    weakVocabulary: []
                }
            },
            lastUpdated: '2026-08-31T10:00:00Z',
            parentPin: '123456',
            customVideos: {},
            distractions: 0
        },

        getLocalStorageKey() { return 'hoctap_std_test_recon'; },
        getApiUrl(path) { return 'http://localhost:3000' + path; },
        setupSubjectStateProxies() { /* no-op in tests */ },

        mergeStudentState: function(localState, cloudState) {
            // Simplified version of the real mergeStudentState for testing
            if (!localState) return cloudState || {};
            if (!cloudState) return localState || {};
            const merged = { ...cloudState, ...localState };
            // scores: Math.max per key
            const mergeMax = (o1, o2) => {
                const res = { ...(o1 || {}), ...(o2 || {}) };
                for (const k of new Set([...Object.keys(o1 || {}), ...Object.keys(o2 || {})])) {
                    const v1 = (o1 && o1[k] !== undefined) ? o1[k] : 0;
                    const v2 = (o2 && o2[k] !== undefined) ? o2[k] : 0;
                    if (typeof v1 === 'number' && typeof v2 === 'number') res[k] = Math.max(v1, v2);
                }
                return res;
            };
            const unionArr = (a1, a2) => Array.from(new Set([...(a1 || []), ...(a2 || [])]));
            merged.scores = mergeMax(localState.scores, cloudState.scores);
            merged.subtopicScores = mergeMax(localState.subtopicScores, cloudState.subtopicScores);
            merged.levelScores = mergeMax(localState.levelScores, cloudState.levelScores);
            merged.completedSubtopics = unionArr(localState.completedSubtopics, cloudState.completedSubtopics);
            merged.completedLessonTheory = unionArr(localState.completedLessonTheory, cloudState.completedLessonTheory);
            merged.badges = unionArr(localState.badges, cloudState.badges);
            merged.goldBadges = unionArr(localState.goldBadges, cloudState.goldBadges);
            merged.goldSkills = unionArr(localState.goldSkills, cloudState.goldSkills);
            merged.redeemedSkills = unionArr(localState.redeemedSkills, cloudState.redeemedSkills);
            merged.rewarded100PercentLessons = unionArr(localState.rewarded100PercentLessons, cloudState.rewarded100PercentLessons);
            if (localState.subjects || cloudState.subjects) {
                const sL = localState.subjects || {};
                const sC = cloudState.subjects || {};
                merged.subjects = {
                    math: {
                        scores: mergeMax((sL.math || {}).scores, (sC.math || {}).scores),
                        subtopicScores: mergeMax((sL.math || {}).subtopicScores, (sC.math || {}).subtopicScores),
                        completedSubtopics: unionArr((sL.math || {}).completedSubtopics, (sC.math || {}).completedSubtopics),
                        completedLessonTheory: unionArr((sL.math || {}).completedLessonTheory, (sC.math || {}).completedLessonTheory),
                        examSessions: [...((sL.math || {}).examSessions || []), ...((sC.math || {}).examSessions || [])].slice(-50)
                    },
                    english: {
                        scores: mergeMax((sL.english || {}).scores, (sC.english || {}).scores),
                        subtopicScores: mergeMax((sL.english || {}).subtopicScores, (sC.english || {}).subtopicScores),
                        completedSubtopics: unionArr((sL.english || {}).completedSubtopics, (sC.english || {}).completedSubtopics),
                        completedLessonTheory: unionArr((sL.english || {}).completedLessonTheory, (sC.english || {}).completedLessonTheory),
                        examSessions: [...((sL.english || {}).examSessions || []), ...((sC.english || {}).examSessions || [])].slice(-50),
                        skillScores: mergeMax((sL.english || {}).skillScores, (sC.english || {}).skillScores),
                        weakVocabulary: unionArr((sL.english || {}).weakVocabulary, (sC.english || {}).weakVocabulary)
                    }
                };
            }
            merged.lastUpdated = new Date().toISOString();
            return merged;
        },

        reconcileOccConflict: function(serverState, serverRevision) {
            if (!serverState || typeof serverRevision !== 'number') return false;
            let localStateSnapshot;
            try { localStateSnapshot = JSON.parse(JSON.stringify(this.state)); } catch (e) { return false; }
            let merged;
            try { merged = this.mergeStudentState(localStateSnapshot, serverState); } catch (e) { return false; }
            const SERVER_WINS_FIELDS = [
                '_sharedXp', 'xp', 'englishXp', 'xpMerged',
                'streak', 'lastActiveDate',
                'parentPin', 'customVideos',
                'history', 'examSessions',
                'distractions', 'slainMonstersCount',
                'gold', 'gems'
            ];
            for (const field of SERVER_WINS_FIELDS) {
                if (Object.prototype.hasOwnProperty.call(serverState, field)) {
                    merged[field] = serverState[field];
                } else {
                    delete merged[field];
                }
            }
            this.baseRevision = serverRevision;
            this.state = merged;
            this.setupSubjectStateProxies();
            return true;
        },

        attemptConflictReconciliation: async function() {
            if (!this.hasConflict) return;
            if (this._isReconciling) return;
            this._isReconciling = true;
            const classLevel = this.config.currentClass || '6';
            const studentId = this.config.defaultStudentId || '';
            try {
                let serverRes;
                try {
                    serverRes = await fetch(
                        this.getApiUrl(`/api/load-progress?classLevel=${encodeURIComponent(classLevel)}&studentId=${encodeURIComponent(studentId)}`)
                    );
                } catch (netErr) {
                    return;
                }
                if (!serverRes.ok) return;
                let serverData;
                try { serverData = await serverRes.json(); } catch (e) { return; }
                const serverRevision = (typeof serverData._revision === 'number') ? serverData._revision
                                     : (typeof serverData.revision  === 'number') ? serverData.revision
                                     : null;
                if (serverRevision === null) return;
                const reconcileOk = this.reconcileOccConflict(serverData, serverRevision);
                if (!reconcileOk) { this.hasConflict = true; return; }
                await this.saveProgress();
            } catch (e) {
                // keep conflict, no retry
            } finally {
                this._isReconciling = false;
            }
        },

        saveProgress: async function() {
            if (this.isSavingProgress) { this.hasPendingSave = true; return; }
            this.isSavingProgress = true;
            this.hasPendingSave = false;
            const localKey = this.getLocalStorageKey();
            try {
                safeStorage.setItem(localKey, JSON.stringify(this.state));
            } catch (e) {}
            try {
                const payload = {
                    classLevel: this.config.currentClass,
                    studentId: this.config.defaultStudentId,
                    baseRevision: typeof this.baseRevision === 'number' ? this.baseRevision : 1,
                    state: this.state
                };
                const res = await fetch(this.getApiUrl('/api/save-progress'), {
                    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && typeof data.revision === 'number') this.baseRevision = data.revision;
                    safeStorage.removeItem(localKey + '_offline_dirty');
                    safeStorage.removeItem(localKey + '_offline_data');
                    this.hasConflict = false;
                    this.conflictRevision = undefined;
                    this.conflictBaseRevision = undefined;
                } else if (res.status === 409) {
                    const conflictData = await res.json().catch(() => ({}));
                    this.conflictRevision = typeof conflictData.currentRevision === 'number' ? conflictData.currentRevision : undefined;
                    this.conflictBaseRevision = typeof this.baseRevision === 'number' ? this.baseRevision : undefined;
                    this.hasConflict = true;
                    this.hasPendingSave = false;
                } else {
                    safeStorage.setItem(localKey + '_offline_dirty', 'true');
                    safeStorage.setItem(localKey + '_offline_data', JSON.stringify(this.state));
                }
            } catch (e) {
                safeStorage.setItem(localKey + '_offline_dirty', 'true');
                safeStorage.setItem(localKey + '_offline_data', JSON.stringify(this.state));
            } finally {
                this.isSavingProgress = false;
                if (this.hasPendingSave && !this.hasConflict) this.saveProgress();
            }
        },

        syncOfflineProgress: async function() {
            const localKey = this.getLocalStorageKey();
            const isDirty = safeStorage.getItem(localKey + '_offline_dirty');
            if (isDirty === 'true') {
                const rawData = safeStorage.getItem(localKey + '_offline_data');
                if (rawData) {
                    try {
                        const offlineState = JSON.parse(rawData);
                        const classLevel = this.config.currentClass || '6';
                        const studentId = this.config.defaultStudentId || '';
                        const res = await fetch(this.getApiUrl('/api/save-progress'), {
                            method: 'POST', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ classLevel, studentId, state: offlineState })
                        });
                        if (res.ok) {
                            const data = await res.json();
                            safeStorage.removeItem(localKey + '_offline_dirty');
                            safeStorage.removeItem(localKey + '_offline_data');
                            if (data && data.state) this.state = { ...this.state, ...data.state };
                            if (data && typeof data.revision === 'number') this.baseRevision = data.revision;
                        } else if (res.status === 409) {
                            const conflictData = await res.json().catch(() => ({}));
                            this.conflictRevision = typeof conflictData.currentRevision === 'number' ? conflictData.currentRevision : undefined;
                            this.conflictBaseRevision = typeof this.baseRevision === 'number' ? this.baseRevision : undefined;
                            this.hasConflict = true;
                            this.hasPendingSave = false;
                            if (offlineState && (!this.state.xp && !Object.keys(this.state.scores || {}).length)) {
                                this.state = offlineState;
                                this.setupSubjectStateProxies();
                            }
                            await this.attemptConflictReconciliation();
                        } else {
                            // other errors: keep offline data
                        }
                    } catch (e) { /* network error */ }
                }
            }
        },

        ...overrides
    };
    return stub;
}

// ============================================================================
// TEST SUITE
// ============================================================================

describe('v13.99 — Client OCC Conflict Reconciliation', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockSafeStorage.clear();
    });

    // -----------------------------------------------------------------------
    // TEST 1: 409 triggers fetch of latest server state
    // -----------------------------------------------------------------------
    test('1. 409 den reconciliation: fetch server state duoc goi', async () => {
        const app = createAppStub({ hasConflict: true, conflictRevision: 2, baseRevision: 1 });
        const serverState = { ...app.state, _revision: 2 };
        global.fetch
            .mockResolvedValueOnce(mockResponse(200, serverState))      // load-progress
            .mockResolvedValueOnce(mockResponse(200, { revision: 3 })); // save-progress
        await app.attemptConflictReconciliation();
        expect(global.fetch).toHaveBeenCalledTimes(2);
        expect(global.fetch.mock.calls[0][0]).toContain('/api/load-progress');
    });

    // -----------------------------------------------------------------------
    // TEST 2: Stale payload KHONG duoc replay — fetch dung URL hien tai
    // -----------------------------------------------------------------------
    test('2. Khong replay stale payload: load-progress duoc fetch, save-progress nhan revision moi', async () => {
        const app = createAppStub({ hasConflict: true, baseRevision: 1 });
        const serverState = { ...app.state, _revision: 2, scores: { 'bai-1': 90 } };
        global.fetch
            .mockResolvedValueOnce(mockResponse(200, serverState))
            .mockResolvedValueOnce(mockResponse(200, { revision: 3 }));
        await app.attemptConflictReconciliation();
        // Save phai duoc goi voi baseRevision = 2 (tu server), khong phai 1 (stale)
        const saveBody = JSON.parse(global.fetch.mock.calls[1][1].body);
        expect(saveBody.baseRevision).toBe(2);
    });

    // -----------------------------------------------------------------------
    // TEST 3: Reconciliation thanh cong -> revision moi tu 200
    // -----------------------------------------------------------------------
    test('3. Reconciliation thanh cong: baseRevision cap nhat thanh revision tu 200', async () => {
        const app = createAppStub({ hasConflict: true, baseRevision: 1 });
        const serverState = { ...app.state, _revision: 2 };
        global.fetch
            .mockResolvedValueOnce(mockResponse(200, serverState))
            .mockResolvedValueOnce(mockResponse(200, { revision: 3 }));
        await app.attemptConflictReconciliation();
        expect(app.baseRevision).toBe(3);
    });

    // -----------------------------------------------------------------------
    // TEST 4: Conflict chi duoc xoa sau khi nhan 200
    // -----------------------------------------------------------------------
    test('4. hasConflict chi duoc xoa sau khi save tra ve 200', async () => {
        const app = createAppStub({ hasConflict: true, baseRevision: 1 });
        const serverState = { ...app.state, _revision: 2 };
        global.fetch
            .mockResolvedValueOnce(mockResponse(200, serverState))
            .mockResolvedValueOnce(mockResponse(200, { revision: 3 }));
        await app.attemptConflictReconciliation();
        expect(app.hasConflict).toBe(false);
        expect(app.conflictRevision).toBeUndefined();
        expect(app.conflictBaseRevision).toBeUndefined();
    });

    // -----------------------------------------------------------------------
    // TEST 5: 409 lan 2 trong reconciliation khong tao vong lap vo han
    // -----------------------------------------------------------------------
    test('5. 409 thu hai trong save: hasConflict duoc dat lai, khong retry loop', async () => {
        const app = createAppStub({ hasConflict: true, baseRevision: 1 });
        const serverState = { ...app.state, _revision: 2 };
        global.fetch
            .mockResolvedValueOnce(mockResponse(200, serverState))    // load-progress OK
            .mockResolvedValueOnce(mockResponse(409, { conflict: true, currentRevision: 3 })); // save 409 again
        await app.attemptConflictReconciliation();
        expect(app.hasConflict).toBe(true);         // conflict duoc dat lai boi saveProgress
        expect(global.fetch).toHaveBeenCalledTimes(2); // khong co fetch thu 3
    });

    // -----------------------------------------------------------------------
    // TEST 6: Loi mang khi fetch server state: giu conflict, khong crash
    // -----------------------------------------------------------------------
    test('6. Network failure khi fetch server state: conflict duoc giu, khong crash', async () => {
        const app = createAppStub({ hasConflict: true, baseRevision: 1 });
        global.fetch.mockImplementationOnce(() => mockFetchError('Network error'));
        await expect(app.attemptConflictReconciliation()).resolves.not.toThrow();
        expect(app.hasConflict).toBe(true);
        expect(global.fetch).toHaveBeenCalledTimes(1); // khong co lan thu 2
    });

    // -----------------------------------------------------------------------
    // TEST 7: Server response thieu revision: giu conflict, khong merge
    // -----------------------------------------------------------------------
    test('7. Server response thieu revision: conflict duoc giu, merge khong xay ra', async () => {
        const app = createAppStub({ hasConflict: true, baseRevision: 1 });
        global.fetch.mockResolvedValueOnce(mockResponse(200, { scores: { 'bai-1': 95 } })); // no _revision
        await app.attemptConflictReconciliation();
        expect(app.hasConflict).toBe(true);
        expect(app.baseRevision).toBe(1); // khong bi thay doi
    });

    // -----------------------------------------------------------------------
    // TEST 8: Unsafe fields (XP, streak) khong bi tu dong merge
    // -----------------------------------------------------------------------
    test('8. XP va streak KHONG tu dong merge — lay gia tri server', async () => {
        const app = createAppStub({ hasConflict: true, baseRevision: 1 });
        // Local: XP=100, streak=5. Server: XP=200, streak=3
        app.state._sharedXp = 100;
        app.state.xp = 100;
        app.state.streak = 5;
        const serverState = {
            ...app.state, _revision: 2,
            _sharedXp: 200, xp: 200, englishXp: 200, streak: 3
        };
        global.fetch
            .mockResolvedValueOnce(mockResponse(200, serverState))
            .mockResolvedValueOnce(mockResponse(200, { revision: 3 }));
        await app.attemptConflictReconciliation();
        // Phai lay server value (200/3), khong merge (max hoac local)
        expect(app.state._sharedXp).toBe(200);
        expect(app.state.streak).toBe(3);
    });

    // -----------------------------------------------------------------------
    // TEST 9: Safe fields (scores) duoc merge dung Math.max — server score thang
    // -----------------------------------------------------------------------
    test('9. scores tu dong merge voi Math.max: server score cao hon duoc giu', async () => {
        const app = createAppStub({ hasConflict: true, baseRevision: 1 });
        // Local: bai-1=80. Server: bai-1=95, bai-3=70 (B da lam bai-3)
        app.state.subjects.math.scores = { 'bai-1': 80 };
        const serverState = {
            ...app.state, _revision: 2,
            subjects: {
                ...app.state.subjects,
                math: { ...app.state.subjects.math, scores: { 'bai-1': 95, 'bai-3': 70 } }
            }
        };
        global.fetch
            .mockResolvedValueOnce(mockResponse(200, serverState))
            .mockResolvedValueOnce(mockResponse(200, { revision: 3 }));
        await app.attemptConflictReconciliation();
        // bai-1: max(80, 95) = 95; bai-3: server only = 70
        expect(app.state.subjects.math.scores['bai-1']).toBe(95);
        expect(app.state.subjects.math.scores['bai-3']).toBe(70);
    });

    // -----------------------------------------------------------------------
    // TEST 10: Offline stale blob nhan 409 -> reconcile, KHONG replay
    // -----------------------------------------------------------------------
    test('10. syncOfflineProgress: stale blob 409 -> reconcile duoc goi, offline data duoc xoa', async () => {
        const app = createAppStub({ baseRevision: 1 });
        const localKey = app.getLocalStorageKey();
        // Setup offline dirty state
        mockSafeStorage.setItem(localKey + '_offline_dirty', 'true');
        mockSafeStorage.setItem(localKey + '_offline_data', JSON.stringify({ xp: 50 }));
        const serverState = { ...app.state, _revision: 2 };
        global.fetch
            .mockResolvedValueOnce(mockResponse(409, { conflict: true, currentRevision: 2 })) // offline save -> 409
            .mockResolvedValueOnce(mockResponse(200, serverState))                             // load-progress
            .mockResolvedValueOnce(mockResponse(200, { revision: 3 }));                        // reconcile save
        await app.syncOfflineProgress();
        // Offline data phai duoc xoa (khong replay)
        expect(mockSafeStorage.getItem(localKey + '_offline_dirty')).toBeNull();
        expect(mockSafeStorage.getItem(localKey + '_offline_data')).toBeNull();
        // Reconcile save duoc goi (fetch lan 3)
        expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    // -----------------------------------------------------------------------
    // TEST 11: Normal save khong bi anh huong boi reconciliation logic
    // -----------------------------------------------------------------------
    test('11. Normal save (khong co conflict): khong goi reconciliation, hoat dong binh thuong', async () => {
        const app = createAppStub({ baseRevision: 1 });
        global.fetch.mockResolvedValueOnce(mockResponse(200, { revision: 2 }));
        await app.saveProgress();
        expect(app.baseRevision).toBe(2);
        expect(app.hasConflict).toBe(false);
        expect(global.fetch).toHaveBeenCalledTimes(1); // chi 1 lan save, khong goi load-progress
    });

    // -----------------------------------------------------------------------
    // TEST 12: reconcileOccConflict tra ve false neu thieu serverRevision
    // -----------------------------------------------------------------------
    test('12. reconcileOccConflict: tra ve false va khong thay doi state neu thieu serverRevision', () => {
        const app = createAppStub();
        const originalXp = app.state._sharedXp;
        const result = app.reconcileOccConflict({ xp: 999 }, undefined);
        expect(result).toBe(false);
        expect(app.state._sharedXp).toBe(originalXp); // state khong doi
    });

    // =======================================================================
    // v13.98.1: OFFLINE CONFLICT RECOVERY SAFETY TESTS
    // =======================================================================

    // -----------------------------------------------------------------------
    // TEST 13: 409 initial -> offline data van con nguyen ven (khong bi xoa ngay)
    // -----------------------------------------------------------------------
    test('13. 409 initial: _offline_dirty va _offline_data KHONG bi xoa ngay khi nhan 409', async () => {
        const app = createAppStub({ baseRevision: 1 });
        const localKey = app.getLocalStorageKey();
        mockSafeStorage.setItem(localKey + '_offline_dirty', 'true');
        mockSafeStorage.setItem(localKey + '_offline_data', JSON.stringify({ xp: 50, note: 'important local progress' }));

        // Mock fetch de chan tai load-progress bang loi mang
        global.fetch
            .mockResolvedValueOnce(mockResponse(409, { conflict: true, currentRevision: 2 })) // save 409
            .mockImplementationOnce(() => mockFetchError('Network failure'));                   // load fails

        await app.syncOfflineProgress();

        // Du lieu offline recovery phai con nguyen 100%
        expect(mockSafeStorage.getItem(localKey + '_offline_dirty')).toBe('true');
        const preservedData = JSON.parse(mockSafeStorage.getItem(localKey + '_offline_data'));
        expect(preservedData.xp).toBe(50);
        expect(preservedData.note).toBe('important local progress');
        expect(app.hasConflict).toBe(true);
    });

    // -----------------------------------------------------------------------
    // TEST 14: 409 followed by network failure -> offline data remains
    // -----------------------------------------------------------------------
    test('14. 409 gap network failure khi load state: _offline_dirty va _offline_data duoc bao toan', async () => {
        const app = createAppStub({ baseRevision: 1 });
        const localKey = app.getLocalStorageKey();
        mockSafeStorage.setItem(localKey + '_offline_dirty', 'true');
        mockSafeStorage.setItem(localKey + '_offline_data', JSON.stringify({ xp: 75 }));

        global.fetch
            .mockResolvedValueOnce(mockResponse(409, { conflict: true, currentRevision: 2 }))
            .mockImplementationOnce(() => mockFetchError('Connection dropped'));

        await expect(app.syncOfflineProgress()).resolves.not.toThrow();

        expect(mockSafeStorage.getItem(localKey + '_offline_dirty')).toBe('true');
        expect(mockSafeStorage.getItem(localKey + '_offline_data')).toBe(JSON.stringify({ xp: 75 }));
        expect(app.hasConflict).toBe(true);
        expect(global.fetch).toHaveBeenCalledTimes(2); // khong retry lap vo han
    });

    // -----------------------------------------------------------------------
    // TEST 15: 409 followed by missing revision -> offline data remains
    // -----------------------------------------------------------------------
    test('15. 409 gap missing revision trong load response: _offline_dirty va _offline_data duoc bao toan', async () => {
        const app = createAppStub({ baseRevision: 1 });
        const localKey = app.getLocalStorageKey();
        mockSafeStorage.setItem(localKey + '_offline_dirty', 'true');
        mockSafeStorage.setItem(localKey + '_offline_data', JSON.stringify({ xp: 88 }));

        // load-progress tra ve 200 nhung khong co _revision hay revision
        global.fetch
            .mockResolvedValueOnce(mockResponse(409, { conflict: true, currentRevision: 2 }))
            .mockResolvedValueOnce(mockResponse(200, { scores: { 'bai-1': 100 } }));

        await app.syncOfflineProgress();

        expect(mockSafeStorage.getItem(localKey + '_offline_dirty')).toBe('true');
        expect(mockSafeStorage.getItem(localKey + '_offline_data')).toBe(JSON.stringify({ xp: 88 }));
        expect(app.hasConflict).toBe(true);
        expect(app.baseRevision).toBe(1); // chua advance
    });

    // -----------------------------------------------------------------------
    // TEST 16: second 409 during reconciliation save -> offline data remains
    // -----------------------------------------------------------------------
    test('16. 409 lan 2 khi save reconciliation: _offline_dirty va _offline_data van ton tai, khong retry loop', async () => {
        const app = createAppStub({ baseRevision: 1 });
        const localKey = app.getLocalStorageKey();
        mockSafeStorage.setItem(localKey + '_offline_dirty', 'true');
        mockSafeStorage.setItem(localKey + '_offline_data', JSON.stringify({ xp: 99 }));
        const serverState = { ...app.state, _revision: 2 };

        global.fetch
            .mockResolvedValueOnce(mockResponse(409, { conflict: true, currentRevision: 2 })) // offline save -> 409
            .mockResolvedValueOnce(mockResponse(200, serverState))                             // load-progress -> 200
            .mockResolvedValueOnce(mockResponse(409, { conflict: true, currentRevision: 3 })); // reconcile save -> 409 again!

        await app.syncOfflineProgress();

        // Phai con offline data, khong bi mat
        expect(mockSafeStorage.getItem(localKey + '_offline_dirty')).toBe('true');
        expect(mockSafeStorage.getItem(localKey + '_offline_data')).not.toBeNull();
        expect(app.hasConflict).toBe(true);
        expect(global.fetch).toHaveBeenCalledTimes(3); // Dung 3 lan, khong infinite loop
    });

    // -----------------------------------------------------------------------
    // TEST 17: 409 followed by HTTP 500 on load -> offline data remains
    // -----------------------------------------------------------------------
    test('17. 409 gap HTTP 500 khi load server state: _offline_dirty va _offline_data duoc bao toan', async () => {
        const app = createAppStub({ baseRevision: 1 });
        const localKey = app.getLocalStorageKey();
        mockSafeStorage.setItem(localKey + '_offline_dirty', 'true');
        mockSafeStorage.setItem(localKey + '_offline_data', JSON.stringify({ xp: 120 }));

        global.fetch
            .mockResolvedValueOnce(mockResponse(409, { conflict: true, currentRevision: 2 }))
            .mockResolvedValueOnce(mockResponse(500, { error: 'Internal Server Error' }));

        await app.syncOfflineProgress();

        expect(mockSafeStorage.getItem(localKey + '_offline_dirty')).toBe('true');
        expect(mockSafeStorage.getItem(localKey + '_offline_data')).toBe(JSON.stringify({ xp: 120 }));
        expect(app.hasConflict).toBe(true);
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    // -----------------------------------------------------------------------
    // TEST 18: 409 followed by malformed response on load -> offline data remains
    // -----------------------------------------------------------------------
    test('18. 409 gap malformed response khi parse JSON: _offline_dirty va _offline_data duoc bao toan', async () => {
        const app = createAppStub({ baseRevision: 1 });
        const localKey = app.getLocalStorageKey();
        mockSafeStorage.setItem(localKey + '_offline_dirty', 'true');
        mockSafeStorage.setItem(localKey + '_offline_data', JSON.stringify({ xp: 130 }));

        global.fetch
            .mockResolvedValueOnce(mockResponse(409, { conflict: true, currentRevision: 2 }))
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => { throw new SyntaxError('Unexpected token < in JSON at position 0'); }
            });

        await app.syncOfflineProgress();

        expect(mockSafeStorage.getItem(localKey + '_offline_dirty')).toBe('true');
        expect(mockSafeStorage.getItem(localKey + '_offline_data')).toBe(JSON.stringify({ xp: 130 }));
        expect(app.hasConflict).toBe(true);
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    // -----------------------------------------------------------------------
    // TEST 19: Reconciliation success 200 -> offline recovery markers cleared ONLY AFTER 200
    // -----------------------------------------------------------------------
    test('19. Reconciliation thanh cong (200): _offline_dirty va _offline_data CHI duoc xoa sau khi save 200', async () => {
        const app = createAppStub({ baseRevision: 1 });
        const localKey = app.getLocalStorageKey();
        mockSafeStorage.setItem(localKey + '_offline_dirty', 'true');
        mockSafeStorage.setItem(localKey + '_offline_data', JSON.stringify({ xp: 150 }));
        const serverState = { ...app.state, _revision: 2 };

        global.fetch
            .mockResolvedValueOnce(mockResponse(409, { conflict: true, currentRevision: 2 }))
            .mockResolvedValueOnce(mockResponse(200, serverState))
            .mockResolvedValueOnce(mockResponse(200, { revision: 3 }));

        await app.syncOfflineProgress();

        // Chi xoa sau khi save 200 thanh cong
        expect(mockSafeStorage.getItem(localKey + '_offline_dirty')).toBeNull();
        expect(mockSafeStorage.getItem(localKey + '_offline_data')).toBeNull();
        expect(app.hasConflict).toBe(false);
        expect(app.baseRevision).toBe(3);
        expect(app.conflictRevision).toBeUndefined();
        expect(app.conflictBaseRevision).toBeUndefined();
    });
});
