/**
 * OCC (OPTIMISTIC CONCURRENCY CONTROL) PERSISTENCE TESTS (v13.96)
 * Kiểm thử chi tiết 11 kịch bản kiểm soát xung đột ghi đồng thời tại Server Boundary
 */
const request = require('supertest');
const { createMockApp } = require('./helpers/mock-server');
const { runQuery, getQuery } = require('../server/db/database');

jest.mock('../server/services/firebase.service', () => ({
    syncStudentProgressToFirebase: jest.fn().mockResolvedValue(true),
    syncAllStudentsToFirebase: jest.fn().mockResolvedValue(true),
    FIREBASE_RTDB_URL: 'https://mock-rtdb.firebaseio.com/',
    firebaseConfig: { apiKey: 'mock', projectId: 'mock', appId: 'mock' }
}));

describe("v13.96 — Optimistic Concurrency Control (OCC) Persistence Boundary", () => {
    let app;

    beforeAll(() => {
        app = createMockApp();
    });

    // 1. initial save
    test("1. Initial save: tạo mới hàng student_progress khởi tạo revision = 1", async () => {
        const studentId = "std_occ_1_" + Date.now();
        const state = { xp: 50, streak: 1, name: "New Student" };

        const res = await request(app)
            .post('/api/save-progress')
            .send({ studentId, classLevel: "6", state });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.revision).toBe(1);

        const row = await getQuery("SELECT state_json, revision FROM student_progress WHERE student_id = ?", [studentId]);
        expect(row).toBeDefined();
        expect(row.revision).toBe(1);
    });

    // 2. save with correct revision
    test("2. Save with correct revision: baseRevision = 1 thành công và tăng revision lên 2", async () => {
        const studentId = "std_occ_2_" + Date.now();
        await request(app).post('/api/save-progress').send({ studentId, classLevel: "6", state: { xp: 100 } });

        const saveRes = await request(app)
            .post('/api/save-progress')
            .send({
                studentId,
                classLevel: "6",
                baseRevision: 1,
                state: { xp: 150 }
            });

        expect(saveRes.status).toBe(200);
        expect(saveRes.body.success).toBe(true);
        expect(saveRes.body.revision).toBe(2);

        const row = await getQuery("SELECT revision, state_json FROM student_progress WHERE student_id = ?", [studentId]);
        expect(row.revision).toBe(2);
        expect(JSON.parse(row.state_json).xp).toBe(150);
    });

    // 3. stale revision rejected
    test("3. Stale revision rejected: gửi baseRevision cũ hơn revision hiện tại bị từ chối với HTTP 409", async () => {
        const studentId = "std_occ_3_" + Date.now();
        // Lần 1: revision = 1
        await request(app).post('/api/save-progress').send({ studentId, classLevel: "6", state: { xp: 100 } });
        // Lần 2: revision = 2
        await request(app).post('/api/save-progress').send({ studentId, classLevel: "6", baseRevision: 1, state: { xp: 200 } });

        // Lần 3: Gửi baseRevision = 1 (stale)
        const staleRes = await request(app)
            .post('/api/save-progress')
            .send({
                studentId,
                classLevel: "6",
                baseRevision: 1,
                state: { xp: 999 }
            });

        expect(staleRes.status).toBe(409);
        expect(staleRes.body.conflict).toBe(true);
        expect(staleRes.body.currentRevision).toBe(2);
    });

    // 4. stale revision does not modify DB
    test("4. Stale revision does not modify DB: lần ghi bị 409 tuyệt đối không làm thay đổi state và revision trong CSDL", async () => {
        const studentId = "std_occ_4_" + Date.now();
        await request(app).post('/api/save-progress').send({ studentId, classLevel: "6", state: { xp: 100, gold: 50 } });
        await request(app).post('/api/save-progress').send({ studentId, classLevel: "6", baseRevision: 1, state: { xp: 200, gold: 100 } });

        // Ghi với revision cũ (baseRevision = 1 khi DB đang là 2)
        const staleRes = await request(app)
            .post('/api/save-progress')
            .send({
                studentId,
                classLevel: "6",
                baseRevision: 1,
                state: { xp: 999, gold: 999 }
            });

        expect(staleRes.status).toBe(409);

        // Kiểm tra CSDL
        const row = await getQuery("SELECT revision, state_json FROM student_progress WHERE student_id = ?", [studentId]);
        expect(row.revision).toBe(2);
        const savedState = JSON.parse(row.state_json);
        expect(savedState.xp).toBe(200);
        expect(savedState.gold).toBe(100);
    });

    // 5, 6, 7, 8: Concurrent A/B scenario (The critical regression test)
    test("5-8. Critical Concurrency A/B scenario: S0 rev 1 -> B writes Y (rev 2) -> A writes X using rev 1 (409) -> DB retains B state", async () => {
        const studentId = "std_occ_ab_" + Date.now();

        // S0: Revision 1
        const initRes = await request(app).post('/api/save-progress').send({
            studentId,
            classLevel: "6",
            state: { xp: 100, gold: 500 }
        });
        expect(initRes.status).toBe(200);
        expect(initRes.body.revision).toBe(1);

        // Client A và B cùng đọc trạng thái ban đầu (rev 1)
        const loadA = await request(app).get(`/api/load-progress?studentId=${studentId}`);
        const loadB = await request(app).get(`/api/load-progress?studentId=${studentId}`);

        const stateA = loadA.body;
        const stateB = loadB.body;

        expect(stateA._revision).toBe(1);
        expect(stateB._revision).toBe(1);

        // Client A muốn sửa xp = 200
        stateA.xp = 200;
        // Client B muốn sửa gold = 300
        stateB.gold = 300;

        // B writes Y trước -> success -> revision 2
        const resB = await request(app).post('/api/save-progress').send({
            studentId,
            classLevel: "6",
            baseRevision: 1,
            state: stateB
        });
        expect(resB.status).toBe(200);
        expect(resB.body.revision).toBe(2);

        // A writes X sau dùng revision 1 -> 409 Conflict
        const resA = await request(app).post('/api/save-progress').send({
            studentId,
            classLevel: "6",
            baseRevision: 1,
            state: stateA
        });
        expect(resA.status).toBe(409);
        expect(resA.body.conflict).toBe(true);
        expect(resA.body.currentRevision).toBe(2);

        // DB retains B's state, revision remains 2
        const finalLoad = await request(app).get(`/api/load-progress?studentId=${studentId}`);
        expect(finalLoad.status).toBe(200);
        expect(finalLoad.body.gold).toBe(300); // Dữ liệu của B được bảo toàn
        expect(finalLoad.body.xp).toBe(100);   // Không bị ghi đè bởi bản ghi cũ của A
        expect(finalLoad.body._revision).toBe(2);
    });

    // 9. revision increments exactly once per successful write
    test("9. Revision increments exactly once per successful write", async () => {
        const studentId = "std_occ_inc_" + Date.now();

        const s1 = await request(app).post('/api/save-progress').send({ studentId, classLevel: "6", state: { step: 1 } });
        expect(s1.body.revision).toBe(1);

        const s2 = await request(app).post('/api/save-progress').send({ studentId, classLevel: "6", baseRevision: 1, state: { step: 2 } });
        expect(s2.body.revision).toBe(2);

        const s3 = await request(app).post('/api/save-progress').send({ studentId, classLevel: "6", baseRevision: 2, state: { step: 3 } });
        expect(s3.body.revision).toBe(3);

        const row = await getQuery("SELECT revision FROM student_progress WHERE student_id = ?", [studentId]);
        expect(row.revision).toBe(3);
    });

    // 10. repeated valid sequential saves still work
    test("10. Repeated valid sequential saves continue to work without disruption", async () => {
        const studentId = "std_occ_seq_" + Date.now();
        let currentRev = 0;

        // Lưu lần đầu
        const init = await request(app).post('/api/save-progress').send({ studentId, classLevel: "6", state: { count: 0 } });
        currentRev = init.body.revision;
        expect(currentRev).toBe(1);

        // 5 lần lưu tuần tự hợp lệ
        for (let i = 1; i <= 5; i++) {
            const res = await request(app).post('/api/save-progress').send({
                studentId,
                classLevel: "6",
                baseRevision: currentRev,
                state: { count: i }
            });
            expect(res.status).toBe(200);
            expect(res.body.revision).toBe(currentRev + 1);
            currentRev = res.body.revision;
        }

        expect(currentRev).toBe(6);
        const finalCheck = await request(app).get(`/api/load-progress?studentId=${studentId}`);
        expect(finalCheck.body.count).toBe(5);
        expect(finalCheck.body._revision).toBe(6);
    });

    // 11. legacy row compatibility
    test("11. Legacy row compatibility: hàng cũ chưa truyền baseRevision vẫn được cập nhật và tăng revision an toàn", async () => {
        const studentId = "std_occ_legacy_" + Date.now();

        // Tạo thủ công một bản ghi legacy trong SQLite với revision mặc định
        await runQuery(
            "INSERT INTO student_progress (student_id, state_json, revision) VALUES (?, ?, 1)",
            [studentId, JSON.stringify({ legacy: true, xp: 50 })]
        );

        // Client gửi request lưu không có baseRevision (hoặc client cũ)
        const res = await request(app).post('/api/save-progress').send({
            studentId,
            classLevel: "6",
            state: { legacy: false, xp: 120 }
        });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.revision).toBe(2);

        const check = await request(app).get(`/api/load-progress?studentId=${studentId}`);
        expect(check.body.legacy).toBe(false);
        expect(check.body.xp).toBe(120);
        expect(check.body._revision).toBe(2);
    });
});
