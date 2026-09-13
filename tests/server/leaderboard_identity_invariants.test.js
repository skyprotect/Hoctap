/**
 * LEADERBOARD IDENTITY INVARIANT TESTS (Phase I)
 * 
 * Bao gom: I-ID (identity validation), I-LB (leaderboard invariants),
 * I-PR (presence semantics), I-RG (regression)
 */

const { resolveCanonicalStudent, APP_VERSION } = require('../../server/services/student.service');

// Mock database
jest.mock('../../server/db/database', () => {
    const SYSTEM_STUDENTS_TEST = [
        { id: 'std_htsj4gbmo', name: 'Tran Binh Minh', classLevel: '6' },
        { id: 'std_baongoc', name: 'Tran Bao Ngoc', classLevel: '1' },
        { id: 'std_tyc0gfnkz', name: 'Tran Duc Phuc', classLevel: '4' },
    ];
    const configWithExtra = {
        students: [
            ...SYSTEM_STUDENTS_TEST,
            { id: 'std_f8g31p4yl', name: 'Duc Phuc', classLevel: '4' }
        ]
    };
    return {
        SYSTEM_STUDENTS: SYSTEM_STUDENTS_TEST,
        dbGetConfig: jest.fn().mockResolvedValue(configWithExtra),
        dbGetStudentProgress: jest.fn().mockResolvedValue(null),
        dbSaveStudentProgress: jest.fn().mockResolvedValue(undefined),
        dbSaveStudentProgressOCC: jest.fn().mockResolvedValue({ success: true, newRevision: 1 }),
        dbDeleteStudentProgress: jest.fn().mockResolvedValue(undefined),
        dbGetSetting: jest.fn().mockResolvedValue(null),
        dbSaveSetting: jest.fn().mockResolvedValue(undefined),
        getQuery: jest.fn().mockResolvedValue(null),
        allQuery: jest.fn().mockResolvedValue([]),
        runQuery: jest.fn().mockResolvedValue(undefined),
        resolveStudentClassLevel: jest.fn().mockReturnValue('6'),
    };
});

jest.mock('../../server/services/firebase.service', () => ({
    syncStudentProgressToFirebase: jest.fn().mockResolvedValue(undefined),
    syncAllStudentsToFirebase: jest.fn().mockResolvedValue(undefined),
    FIREBASE_RTDB_URL: 'https://mock-rtdb.firebaseio.com/',
    firebaseConfig: { apiKey: 'mock', projectId: 'mock', appId: 'mock' },
    hydrateStudentProgressFromFirebaseRTDB: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../../server/services/gemini.service', () => ({
    auditExamSessionHelper: jest.fn().mockImplementation(sess => Promise.resolve(sess)),
    cleanJsonString: jest.fn(),
    sanitizeHistory: jest.fn(),
    callGeminiAPI: jest.fn(),
    invalidApiKeys: new Set(),
}));

describe('I-ID: resolveCanonicalStudent()', () => {
    test('valid SYSTEM_STUDENTS ID resolves correctly', async () => {
        const result = await resolveCanonicalStudent('std_htsj4gbmo');
        expect(result).not.toBeNull();
        expect(result.id).toBe('std_htsj4gbmo');
        expect(result.classLevel).toBe('6');
    });

    test('std_f8g31p4yl (config only, not in SYSTEM_STUDENTS) resolves correctly', async () => {
        const result = await resolveCanonicalStudent('std_f8g31p4yl');
        expect(result).not.toBeNull();
        expect(result.id).toBe('std_f8g31p4yl');
    });

    test('std_char_b01_* (test ID) resolves to null', async () => {
        expect(await resolveCanonicalStudent('std_char_b01_1788079158566')).toBeNull();
    });

    test('std_concurrency_* (test ID) resolves to null', async () => {
        expect(await resolveCanonicalStudent('std_concurrency_1788079158789')).toBeNull();
    });

    test('std_iso_a_* (test ID) resolves to null', async () => {
        expect(await resolveCanonicalStudent('std_iso_a_1788079158655')).toBeNull();
    });

    test('std_sub_iso_* (test ID) resolves to null', async () => {
        expect(await resolveCanonicalStudent('std_sub_iso_1788079158675')).toBeNull();
    });

    test('std_xf9e2lvgv (legacy unknown) resolves to null', async () => {
        expect(await resolveCanonicalStudent('std_xf9e2lvgv')).toBeNull();
    });

    test('empty string resolves to null', async () => {
        expect(await resolveCanonicalStudent('')).toBeNull();
    });

    test('ID not starting with std_ resolves to null', async () => {
        expect(await resolveCanonicalStudent('admin_123')).toBeNull();
    });
});

describe('I-ID: heartbeat() Firebase guard', () => {
    let heartbeat;
    let fetchMock;

    beforeAll(() => {
        ({ heartbeat } = require('../../server/services/student.service'));
    });

    beforeEach(() => {
        fetchMock = jest.fn().mockResolvedValue({ ok: true });
        global.fetch = fetchMock;
    });

    afterEach(() => { jest.clearAllMocks(); });

    test('valid studentId (std_htsj4gbmo) -> Firebase PATCH is called', async () => {
        await heartbeat('std_htsj4gbmo');
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const callUrl = fetchMock.mock.calls[0][0];
        expect(callUrl).toContain('leaderboard/std_htsj4gbmo.json');
    });

    test('std_char_b01_* -> NO Firebase PATCH', async () => {
        await heartbeat('std_char_b01_1788079158566');
        expect(fetchMock).not.toHaveBeenCalled();
    });

    test('std_concurrency_* -> NO Firebase PATCH', async () => {
        await heartbeat('std_concurrency_1788079158789');
        expect(fetchMock).not.toHaveBeenCalled();
    });

    test('std_iso_* -> NO Firebase PATCH', async () => {
        await heartbeat('std_iso_a_1788079158655');
        expect(fetchMock).not.toHaveBeenCalled();
    });

    test('std_xf9e2lvgv -> NO Firebase PATCH', async () => {
        await heartbeat('std_xf9e2lvgv');
        expect(fetchMock).not.toHaveBeenCalled();
    });
});

describe('I-LB: getLeaderboard() invariants', () => {
    let getLeaderboard;

    beforeAll(() => {
        ({ getLeaderboard } = require('../../server/services/student.service'));
    });

    afterEach(() => { jest.clearAllMocks(); });

    function mockRTDB(records) {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => records,
        });
    }

    test('Inv-1+2: records not in registry are excluded', async () => {
        mockRTDB({
            'std_htsj4gbmo': { studentId: 'std_htsj4gbmo', studentName: 'Tran Binh Minh', englishXp: 6991, mathXp: 6991, classLevel: '6' },
            'std_char_garbage': { studentId: 'std_char_b01_garbage', studentName: 'Tran Binh Minh', englishXp: 3850, mathXp: 3850, classLevel: '6' },
        });
        const result = await getLeaderboard({ subject: 'english' });
        expect(result.length).toBe(1);
        expect(result[0].studentId).toBe('std_htsj4gbmo');
    });

    test('Inv-3: 2 students with same name but different IDs remain separate', async () => {
        mockRTDB({
            'std_htsj4gbmo': { studentId: 'std_htsj4gbmo', studentName: 'Tran', englishXp: 6991, mathXp: 6991, classLevel: '6' },
            'std_tyc0gfnkz': { studentId: 'std_tyc0gfnkz', studentName: 'Tran', englishXp: 3645, mathXp: 3645, classLevel: '4' },
        });
        const result = await getLeaderboard({ subject: 'english' });
        expect(result.length).toBe(2);
        const ids = result.map(r => r.studentId);
        expect(ids).toContain('std_htsj4gbmo');
        expect(ids).toContain('std_tyc0gfnkz');
    });

    test('Inv-4: duplicate canonical studentId -> one logical student', async () => {
        // Two RTDB keys both have studentId: std_htsj4gbmo
        mockRTDB({
            'std_htsj4gbmo': { studentId: 'std_htsj4gbmo', studentName: 'Tran Binh Minh', englishXp: 6991, mathXp: 4000, classLevel: '6', lastUpdated: '2026-09-13T10:00:00.000Z' },
            'std_htsj4gbmo_v2': { studentId: 'std_htsj4gbmo', studentName: 'Tran Binh Minh', englishXp: 4000, mathXp: 6991, classLevel: '6', lastUpdated: '2026-09-12T10:00:00.000Z' },
        });
        const result = await getLeaderboard({ subject: 'english' });
        expect(result.length).toBe(1);
        expect(result[0].studentId).toBe('std_htsj4gbmo');
    });

    test('Inv-5: field-wise merge preserves max XP across both records', async () => {
        mockRTDB({
            'std_htsj4gbmo': { studentId: 'std_htsj4gbmo', studentName: 'Tran Binh Minh', englishXp: 6991, mathXp: 2000, classLevel: '6', lastUpdated: '2026-09-13T10:00:00.000Z' },
            'std_htsj4gbmo_v2': { studentId: 'std_htsj4gbmo', studentName: 'Tran Binh Minh', englishXp: 2000, mathXp: 6991, classLevel: '6', lastUpdated: '2026-09-12T10:00:00.000Z' },
        });
        const result = await getLeaderboard({ subject: 'math' });
        expect(result.length).toBe(1);
        expect(result[0].englishXp).toBe(6991);
        expect(result[0].mathXp).toBe(6991);
    });

    test('All 7 verified garbage IDs excluded when present in RTDB response', async () => {
        mockRTDB({
            'std_htsj4gbmo': { studentId: 'std_htsj4gbmo', studentName: 'Tran Binh Minh', englishXp: 6991, mathXp: 6991, classLevel: '6' },
            'a': { studentId: 'std_char_b01_1788079158566', studentName: 'Tran Binh Minh', englishXp: 3850, mathXp: 3850, classLevel: '6' },
            'b': { studentId: 'std_char_b01_1788079174860', studentName: 'Tran Binh Minh', englishXp: 3850, mathXp: 3850, classLevel: '6' },
            'c': { studentId: 'std_concurrency_1788079158789', studentName: 'Hoc sinh Concurrency', englishXp: 100, mathXp: 100, classLevel: '6' },
            'd': { studentId: 'std_iso_a_1788079158655', studentName: 'Hoc sinh A', englishXp: 200, mathXp: 200, classLevel: '6' },
            'e': { studentId: 'std_iso_b_1788079158655', studentName: 'Hoc sinh B', englishXp: 700, mathXp: 700, classLevel: '4' },
            'f': { studentId: 'std_sub_iso_1788079158675', studentName: 'Hoc sinh Test', englishXp: 1100, mathXp: 1100, classLevel: '6' },
            'g': { studentId: 'std_xf9e2lvgv', studentName: 'Hoc sinh', englishXp: 450, mathXp: 450, classLevel: '6' },
        });

        const result = await getLeaderboard({ subject: 'english' });
        const returnedIds = result.map(r => r.studentId);
        expect(result.length).toBe(1);
        expect(returnedIds).toContain('std_htsj4gbmo');

        const GARBAGE = ['std_char_b01_1788079158566','std_char_b01_1788079174860','std_concurrency_1788079158789',
            'std_iso_a_1788079158655','std_iso_b_1788079158655','std_sub_iso_1788079158675','std_xf9e2lvgv'];
        GARBAGE.forEach(id => expect(returnedIds).not.toContain(id));
    });
});

describe('I-PR: isGenericName() presence filter logic', () => {
    const isGenericName = (name) => {
        if (!name) return true;
        const trimmed = name.trim();
        if (!trimmed) return true;
        const GENERIC_NAME_EXACT = ['Phu huynh', ''];
        if (GENERIC_NAME_EXACT.includes(trimmed)) return true;
        if (trimmed === 'Hoc sinh' || trimmed.startsWith('Hoc sinh ')) return true;
        return false;
    };

    test('"Hoc sinh" (exact) -> generic', () => expect(isGenericName('Hoc sinh')).toBe(true));
    test('"Hoc sinh A" (suffix) -> generic', () => expect(isGenericName('Hoc sinh A')).toBe(true));
    test('"Hoc sinh Test" (suffix) -> generic', () => expect(isGenericName('Hoc sinh Test')).toBe(true));
    test('"Hoc sinh Concurrency" (suffix) -> generic', () => expect(isGenericName('Hoc sinh Concurrency')).toBe(true));
    test('"Phu huynh" -> generic', () => expect(isGenericName('Phu huynh')).toBe(true));
    test('empty string -> generic', () => expect(isGenericName('')).toBe(true));
    test('null -> generic', () => expect(isGenericName(null)).toBe(true));
    test('"Tran Binh Minh" -> NOT generic', () => expect(isGenericName('Tran Binh Minh')).toBe(false));
    test('"Tran Duc Phuc" -> NOT generic', () => expect(isGenericName('Tran Duc Phuc')).toBe(false));
    test('"Duc Phuc" -> NOT generic', () => expect(isGenericName('Duc Phuc')).toBe(false));
});

describe('I-RG: Regression', () => {
    test('APP_VERSION is set and not legacy 12.46', () => {
        expect(APP_VERSION).toBeTruthy();
        expect(APP_VERSION).not.toBe('12.46');
        expect(APP_VERSION).not.toContain('12.46');
    });

    test('All 4 valid student IDs resolve from registry', async () => {
        const VALID_IDS = ['std_htsj4gbmo', 'std_tyc0gfnkz', 'std_baongoc', 'std_f8g31p4yl'];
        for (const id of VALID_IDS) {
            const result = await resolveCanonicalStudent(id);
            expect(result).not.toBeNull();
            expect(result.id).toBe(id);
        }
    });

    test('resolveCanonicalStudent returns correct classLevel per student', async () => {
        expect((await resolveCanonicalStudent('std_htsj4gbmo'))?.classLevel).toBe('6');
        expect((await resolveCanonicalStudent('std_tyc0gfnkz'))?.classLevel).toBe('4');
        expect((await resolveCanonicalStudent('std_baongoc'))?.classLevel).toBe('1');
    });
});
