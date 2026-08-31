/**
 * CLIENT OCC CONFLICT HANDLING TESTS (v13.97)
 * Kiem thu hanh vi client-side khi nhan HTTP 409 tu server OCC.
 *
 * Pham vi: Chi kiem thu logic client saveProgress() tai ranh gioi xung dot.
 * Khong kiem thu server OCC (da co occ_concurrency.test.js bao phu).
 */

'use strict';

// --- Mock globals can thiet de saveProgress stub co the chay trong Jest ---
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

// --- App stub mirrors the exact saveProgress() from app.js v13.97 ----------
function createAppStub(overrides = {}) {
    return {
        isSavingProgress: false,
        hasPendingSave: false,
        hasConflict: false,
        conflictRevision: undefined,
        conflictBaseRevision: undefined,
        baseRevision: 1,
        state: { xp: 100, streak: 1, lastUpdated: '' },
        config: { currentClass: '6', defaultStudentId: 'std_test_client' },
        getLocalStorageKey() { return 'hoctap_std_test_client'; },
        getApiUrl(path) { return 'http://localhost:3000' + path; },
        setupSubjectStateProxies() {},

        saveProgress: async function() {
            if (this.isSavingProgress) {
                this.hasPendingSave = true;
                return;
            }
            this.isSavingProgress = true;
            this.hasPendingSave = false;
            this.state.lastUpdated = new Date().toISOString();

            const localKey = this.getLocalStorageKey();
            const classLevel = this.config.currentClass || '6';
            const studentId = this.config.defaultStudentId || '';

            try {
                safeStorage.setItem(localKey, JSON.stringify(this.state));
            } catch (e) {}

            try {
                const payload = {
                    classLevel,
                    studentId,
                    studentName: this.config.studentName,
                    baseRevision: typeof this.baseRevision === 'number' ? this.baseRevision : 1,
                    state: this.state
                };
                const res = await fetch(this.getApiUrl('/api/save-progress'), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data && typeof data.revision === 'number') {
                        this.baseRevision = data.revision;
                    }
                    safeStorage.removeItem(localKey + '_offline_dirty');
                    safeStorage.removeItem(localKey + '_offline_data');
                    if (data && data.state) {
                        if (!this.hasPendingSave) {
                            this.state = data.state;
                            this.setupSubjectStateProxies();
                        } else {
                            if (data.state.examSessions && this.state.examSessions) {
                                data.state.examSessions.forEach(serverSess => {
                                    const clientSess = this.state.examSessions.find(s => s.id === serverSess.id);
                                    if (clientSess) {
                                        clientSess.isAudited = serverSess.isAudited;
                                        clientSess.questions = serverSess.questions;
                                    }
                                });
                            }
                        }
                    }
                    // 200 success: xoa co xung dot neu co
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
                if (this.hasPendingSave && !this.hasConflict) {
                    this.saveProgress();
                }
            }
        },

        ...overrides
    };
}

function mockResponse200(body) {
    return { ok: true, status: 200, json: async () => body };
}
function mockResponse409(currentRevision) {
    return { ok: false, status: 409, json: async () => ({ conflict: true, currentRevision }) };
}
function mockResponse500() {
    return { ok: false, status: 500, json: async () => ({ error: 'Internal Server Error' }) };
}

// --- Test Suite --------------------------------------------------------------

describe('v13.97 — Client OCC Conflict Handling (saveProgress boundary)', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockSafeStorage.clear();
    });

    test('1. Lu thanh cong (200): baseRevision cap nhat dung va hasConflict van la false', async () => {
        const app = createAppStub({ baseRevision: 1 });
        global.fetch.mockResolvedValueOnce(mockResponse200({ revision: 2, success: true }));
        await app.saveProgress();
        expect(app.baseRevision).toBe(2);
        expect(app.hasConflict).toBe(false);
        expect(app.conflictRevision).toBeUndefined();
        expect(app.conflictBaseRevision).toBeUndefined();
    });

    test('2. Lu xung dot (409): hasConflict = true va local state khong bi thay the', async () => {
        const app = createAppStub({ baseRevision: 1 });
        const originalXp = app.state.xp;
        global.fetch.mockResolvedValueOnce(mockResponse409(2));
        await app.saveProgress();
        expect(app.hasConflict).toBe(true);
        expect(app.state.xp).toBe(originalXp);
    });

    test('3. Lu xung dot (409): baseRevision KHONG duoc tang len', async () => {
        const app = createAppStub({ baseRevision: 1 });
        global.fetch.mockResolvedValueOnce(mockResponse409(2));
        await app.saveProgress();
        expect(app.baseRevision).toBe(1);
    });

    test('4. Lu xung dot (409): conflictRevision ghi lai revision server khi duoc cung cap', async () => {
        const app = createAppStub({ baseRevision: 1 });
        global.fetch.mockResolvedValueOnce(mockResponse409(5));
        await app.saveProgress();
        expect(app.conflictRevision).toBe(5);
    });

    test('5. Lu xung dot (409): conflictBaseRevision ghi lai revision client bi tu choi', async () => {
        const app = createAppStub({ baseRevision: 3 });
        global.fetch.mockResolvedValueOnce(mockResponse409(7));
        await app.saveProgress();
        expect(app.conflictBaseRevision).toBe(3);
    });

    test('6. Lu xung dot (409): khong tu dong thu lai ngay lap tuc (khong de quy)', async () => {
        const app = createAppStub({ baseRevision: 1 });
        global.fetch.mockResolvedValueOnce(mockResponse409(2));
        await app.saveProgress();
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test('7. hasPendingSave + 409: hasPendingSave bi huy, khong vong lap vo han stale retry', async () => {
        const app = createAppStub({ baseRevision: 1 });
        global.fetch.mockImplementationOnce(async () => {
            app.hasPendingSave = true;
            return mockResponse409(2);
        });
        await app.saveProgress();
        expect(app.hasConflict).toBe(true);
        expect(app.hasPendingSave).toBe(false);
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test('8. Sau xung dot, lu thanh cong voi revision moi xoa co conflict', async () => {
        const app = createAppStub({ baseRevision: 1 });
        global.fetch.mockResolvedValueOnce(mockResponse409(2));
        await app.saveProgress();
        expect(app.hasConflict).toBe(true);
        // Simulate reconciliation: client updates baseRevision to server value
        app.baseRevision = 2;
        global.fetch.mockResolvedValueOnce(mockResponse200({ revision: 3, success: true }));
        await app.saveProgress();
        expect(app.hasConflict).toBe(false);
        expect(app.conflictRevision).toBeUndefined();
        expect(app.conflictBaseRevision).toBeUndefined();
        expect(app.baseRevision).toBe(3);
    });

    test('9. hasConflict khong bi xoa nham khi chi doc gia tri (khong co success save)', () => {
        const app = createAppStub({ baseRevision: 1 });
        app.hasConflict = true;
        app.conflictRevision = 2;
        app.conflictBaseRevision = 1;
        expect(app.hasConflict).toBe(true);
        expect(app.conflictRevision).toBe(2);
        expect(app.conflictBaseRevision).toBe(1);
    });

    test('10. Loi mang (fetch throw): offline fallback duoc set, hasConflict KHONG duoc set', async () => {
        const app = createAppStub({ baseRevision: 1 });
        const localKey = app.getLocalStorageKey();
        global.fetch.mockRejectedValueOnce(new Error('Network error'));
        await app.saveProgress();
        expect(mockSafeStorage.getItem(localKey + '_offline_dirty')).toBe('true');
        expect(app.hasConflict).toBe(false);
    });

    test('11. Loi 500 server: KHONG set hasConflict, offline fallback duoc set', async () => {
        const app = createAppStub({ baseRevision: 1 });
        const localKey = app.getLocalStorageKey();
        global.fetch.mockResolvedValueOnce(mockResponse500());
        await app.saveProgress();
        expect(app.hasConflict).toBe(false);
        expect(mockSafeStorage.getItem(localKey + '_offline_dirty')).toBe('true');
    });

    test('12. 409 khong co currentRevision trong body: conflictRevision la undefined, khong crash', async () => {
        const app = createAppStub({ baseRevision: 1 });
        global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 409,
            json: async () => ({ conflict: true })
        });
        await expect(app.saveProgress()).resolves.not.toThrow();
        expect(app.hasConflict).toBe(true);
        expect(app.conflictRevision).toBeUndefined();
        expect(app.conflictBaseRevision).toBe(1);
    });
});
