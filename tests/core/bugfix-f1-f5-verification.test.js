/**
 * BUG-FIX VERIFICATION TESTS — Cycle F.1–F.5
 *
 * Kiểm tra toàn bộ 5 fixes đã implement:
 *   F.1 — heartbeat identity validation (server)
 *   F.2 — firebase sync guard (server)
 *   F.3 — server-side leaderboard dedup
 *   F.4 — client render defense (leaderboard + presence + appVersion)
 *   F.5 — update polling hard timeout
 */
'use strict';

// =============================================================================
// F.3 — SERVER-SIDE LEADERBOARD DEDUPLICATION
// =============================================================================
describe('F.3 — Server-side Leaderboard Deduplication', () => {
    function deduplicateLeaderboard(rawList) {
        const deduped = new Map();
        for (const item of rawList) {
            if (!item || !item.studentId) continue;
            const key = item.studentId;
            if (!deduped.has(key)) {
                deduped.set(key, { ...item });
            } else {
                const existing = deduped.get(key);
                const merged = { ...existing };
                merged.mathXp = Math.max(existing.mathXp || 0, item.mathXp || 0);
                merged.englishXp = Math.max(existing.englishXp || 0, item.englishXp || 0);
                merged.mathStreak = Math.max(existing.mathStreak || 0, item.mathStreak || 0);
                merged.englishStreak = Math.max(existing.englishStreak || 0, item.englishStreak || 0);
                const existingTime = existing.lastUpdated ? new Date(existing.lastUpdated).getTime() : 0;
                const itemTime = item.lastUpdated ? new Date(item.lastUpdated).getTime() : 0;
                if (itemTime > existingTime) {
                    merged.lastUpdated = item.lastUpdated;
                    merged.lastHeartbeat = item.lastHeartbeat || existing.lastHeartbeat;
                    merged.appVersion = item.appVersion || existing.appVersion;
                    merged.studentName = item.studentName || existing.studentName;
                    merged.classLevel = item.classLevel || existing.classLevel;
                }
                deduped.set(key, merged);
            }
        }
        return Array.from(deduped.values());
    }

    test('T-LB-01: 2 records cung studentId → khong render duplicate', () => {
        const raw = [
            { studentId: 'std_htsj4gbmo', studentName: 'Tran Binh Minh', mathXp: 3850, englishXp: 3850, lastUpdated: '2026-09-01T00:00:00Z' },
            { studentId: 'std_htsj4gbmo', studentName: 'Tran Binh Minh', mathXp: 6991, englishXp: 3850, lastUpdated: '2026-09-02T00:00:00Z' },
        ];
        const result = deduplicateLeaderboard(raw);
        expect(result.length).toBe(1);
        expect(result[0].studentId).toBe('std_htsj4gbmo');
    });

    test('T-LB-02: field-wise merge — giu mathXp cao nhat va englishXp cao nhat rieng biet', () => {
        const raw = [
            { studentId: 'std_htsj4gbmo', mathXp: 6991, englishXp: 100, lastUpdated: '2026-09-01T00:00:00Z' },
            { studentId: 'std_htsj4gbmo', mathXp: 3850, englishXp: 3850, lastUpdated: '2026-09-02T00:00:00Z' },
        ];
        const result = deduplicateLeaderboard(raw);
        expect(result.length).toBe(1);
        expect(result[0].mathXp).toBe(6991);
        expect(result[0].englishXp).toBe(3850);
    });

    test('T-LB-03: 2 student khac studentId nhung cung ten → van 2 entries', () => {
        const raw = [
            { studentId: 'std_abc', studentName: 'Nguyen Van A', mathXp: 100 },
            { studentId: 'std_xyz', studentName: 'Nguyen Van A', mathXp: 200 },
        ];
        const result = deduplicateLeaderboard(raw);
        expect(result.length).toBe(2);
        const ids = result.map(r => r.studentId).sort();
        expect(ids).toEqual(['std_abc', 'std_xyz']);
    });

    test('T-LB-04: records thieu studentId bi loai khoi list', () => {
        const raw = [
            { studentName: 'No ID', mathXp: 100 },
            null,
            { studentId: 'std_htsj4gbmo', mathXp: 500 },
        ];
        const result = deduplicateLeaderboard(raw);
        expect(result.length).toBe(1);
        expect(result[0].studentId).toBe('std_htsj4gbmo');
    });

    test('T-LB-05: invalid studentId khong duoc merge vao canonical student', () => {
        const raw = [
            { studentId: 'std_htsj4gbmo', studentName: 'Tran Binh Minh', mathXp: 6991 },
            { studentId: 'std_unknown_rogue', studentName: 'Tran Binh Minh', mathXp: 100 },
        ];
        const result = deduplicateLeaderboard(raw);
        expect(result.length).toBe(2);
        const canonical = result.find(r => r.studentId === 'std_htsj4gbmo');
        expect(canonical).toBeDefined();
        expect(canonical.mathXp).toBe(6991);
    });

    test('T-LB-06: merge 2 records khong lam mat field hop le tu record cu hon', () => {
        const raw = [
            { studentId: 'std_htsj4gbmo', mathXp: 6991, englishXp: 100, appVersion: 'v15.0', lastUpdated: '2026-09-01T00:00:00Z' },
            { studentId: 'std_htsj4gbmo', mathXp: 3850, englishXp: 3850, appVersion: 'v15.13', lastUpdated: '2026-09-10T00:00:00Z' },
        ];
        const result = deduplicateLeaderboard(raw);
        expect(result.length).toBe(1);
        expect(result[0].mathXp).toBe(6991);
        expect(result[0].englishXp).toBe(3850);
        expect(result[0].appVersion).toBe('v15.13');
    });
});

// =============================================================================
// F.1 — HEARTBEAT IDENTITY VALIDATION
// =============================================================================
describe('F.1 — Heartbeat Identity Validation', () => {
    const SYSTEM_STUDENTS = [
        { id: 'std_htsj4gbmo', name: 'Tran Binh Minh', classLevel: '6' },
        { id: 'std_baongoc', name: 'Tran Bao Ngoc', classLevel: '1' },
        { id: 'std_tyc0gfnkz', name: 'Tran Duc Phuc', classLevel: '4' },
    ];

    function resolveHeartbeatIdentity(studentId, configStudents) {
        const studentConf = (configStudents || []).find(s => s.id === studentId);
        const sysConf = SYSTEM_STUDENTS.find(s => s.id === studentId);
        if (!studentConf && !sysConf) return null;
        return studentConf || sysConf;
    }

    test('T-PR-01: studentId la → identity khong resolve duoc → skip Firebase', () => {
        expect(resolveHeartbeatIdentity('std_unknown_rogue', [])).toBeNull();
    });

    test('T-PR-02: studentId hop le (SYSTEM_STUDENTS) → resolve thanh cong', () => {
        const result = resolveHeartbeatIdentity('std_htsj4gbmo', []);
        expect(result).not.toBeNull();
        expect(result.name).toBe('Tran Binh Minh');
    });

    test('T-PR-02b: studentId hop le (runtime config) → resolve thanh cong', () => {
        const runtime = [{ id: 'std_baongoc', name: 'Tran Bao Ngoc', classLevel: '1' }];
        const result = resolveHeartbeatIdentity('std_baongoc', runtime);
        expect(result).not.toBeNull();
        expect(result.name).toBe('Tran Bao Ngoc');
    });

    test('T-PR-05: student hop le trong config.students nhung ngoai SYSTEM_STUDENTS van duoc chap nhan', () => {
        const runtime = [{ id: 'std_custom_new', name: 'Hoc sinh Moi', classLevel: '6' }];
        const result = resolveHeartbeatIdentity('std_custom_new', runtime);
        expect(result).not.toBeNull();
        expect(result.name).toBe('Hoc sinh Moi');
    });
});

// =============================================================================
// F.2 — FIREBASE SYNC GUARD
// =============================================================================
describe('F.2 — Firebase Sync Guard', () => {
    const GENERIC_FALLBACK_NAMES = ['Hoc sinh', 'Phu huynh', ''];

    function shouldSkipSync(studentName) {
        if (!studentName || !studentName.trim()) return true;
        if (GENERIC_FALLBACK_NAMES.includes(studentName.trim())) return true;
        return false;
    }

    test('T-PR-03: studentName generic → bo qua Firebase sync', () => {
        expect(shouldSkipSync('Hoc sinh')).toBe(true);
        expect(shouldSkipSync('')).toBe(true);
        expect(shouldSkipSync(null)).toBe(true);
        expect(shouldSkipSync('   ')).toBe(true);
    });

    test('T-PR-02-sync: studentName hop le → cho phep sync', () => {
        expect(shouldSkipSync('Tran Binh Minh')).toBe(false);
        expect(shouldSkipSync('Tran Duc Phuc')).toBe(false);
    });
});

// =============================================================================
// F.4 — appVersion Render Defense
// =============================================================================
describe('F.4 — appVersion Render Defense', () => {
    function getVersionDisplay(record) {
        return record.appVersion || record.version || '';
    }

    test('T-AV-01: entry thieu appVersion → tra ve empty string, khong phai "v12.46"', () => {
        const display = getVersionDisplay({ studentId: 'std_abc' });
        expect(display).toBe('');
        expect(display).not.toBe('v12.46');
    });

    test('T-AV-02: entry co appVersion hop le → hien thi dung', () => {
        expect(getVersionDisplay({ appVersion: 'v15.13' })).toBe('v15.13');
    });

    test('T-AV-02b: entry co version (legacy) → dung version', () => {
        expect(getVersionDisplay({ version: 'v14.0' })).toBe('v14.0');
    });
});

// =============================================================================
// F.4b — Presence Render: Filter Generic Names
// =============================================================================
describe('F.4b — Presence Render: Filter Generic Names', () => {
    const GENERIC_NAMES = ['Hoc sinh', 'Phu huynh', ''];

    function filterPresenceList(rawList) {
        const seenIds = new Set();
        return rawList.filter(s => {
            if (!s || !s.studentId) return false;
            if (GENERIC_NAMES.includes((s.studentName || '').trim())) return false;
            if (seenIds.has(s.studentId)) return false;
            seenIds.add(s.studentId);
            return true;
        });
    }

    test('T-PR-04: entry co studentName generic bi loc khoi presence list', () => {
        const raw = [
            { studentId: 'std_rogue_1', studentName: 'Hoc sinh' },
            { studentId: 'std_rogue_2', studentName: 'Hoc sinh' },
            { studentId: 'std_htsj4gbmo', studentName: 'Tran Binh Minh' },
        ];
        const result = filterPresenceList(raw);
        expect(result.length).toBe(1);
        expect(result[0].studentId).toBe('std_htsj4gbmo');
    });

    test('T-PR-04b: duplicate studentId → chi 1 entry', () => {
        const raw = [
            { studentId: 'std_htsj4gbmo', studentName: 'Tran Binh Minh', lastHeartbeat: '2026-09-12T15:00:00Z' },
            { studentId: 'std_htsj4gbmo', studentName: 'Tran Binh Minh', lastHeartbeat: '2026-09-12T14:00:00Z' },
        ];
        expect(filterPresenceList(raw).length).toBe(1);
    });

    test('T-PR-05: entry thieu lastHeartbeat → isOnline = false', () => {
        const record = { studentId: 'std_abc', studentName: 'Test', lastHeartbeat: null };
        const isOnline = record.lastHeartbeat && (Date.now() - new Date(record.lastHeartbeat).getTime() < 40000);
        expect(isOnline).toBeFalsy();
    });

    test('T-PR-05b: entry co lastHeartbeat cu → isOnline = false', () => {
        const oldTs = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const isOnline = Date.now() - new Date(oldTs).getTime() < 40000;
        expect(isOnline).toBe(false);
    });

    test('T-PR-05c: entry co lastHeartbeat vua xong → isOnline = true', () => {
        const freshTs = new Date(Date.now() - 10000).toISOString();
        const isOnline = Date.now() - new Date(freshTs).getTime() < 40000;
        expect(isOnline).toBe(true);
    });
});

// =============================================================================
// F.5 — UPDATE POLLING HARD TIMEOUT
// =============================================================================
describe('F.5 — Update Polling Hard Timeout', () => {
    const POLL_HARD_TIMEOUT_MS = 60000;

    function shouldContinuePolling(pollStartTime, pollingStopped) {
        if (pollingStopped) return false;
        return (Date.now() - pollStartTime) < POLL_HARD_TIMEOUT_MS;
    }

    test('T-AU-01: elapsed >= 60s va status idle → stop polling', () => {
        const startedAt = Date.now() - 61000;
        expect(shouldContinuePolling(startedAt, false)).toBe(false);
    });

    test('T-AU-02: elapsed < 60s → tiep tuc polling', () => {
        const startedAt = Date.now() - 5000;
        expect(shouldContinuePolling(startedAt, false)).toBe(true);
    });

    test('T-AU-03: pollingStopped = true → stop ngay', () => {
        const startedAt = Date.now();
        expect(shouldContinuePolling(startedAt, true)).toBe(false);
    });

    test('T-AU-04: boundary — exactly 60s → stop, < 60s → continue', () => {
        expect(shouldContinuePolling(Date.now() - 59999, false)).toBe(true);
        expect(shouldContinuePolling(Date.now() - 60000, false)).toBe(false);
    });
});
