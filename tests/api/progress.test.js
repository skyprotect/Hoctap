/**
 * INTEGRATION TESTS: Progress APIs
 */
const request = require('supertest');
const { createMockApp } = require('../helpers/mock-server');

jest.mock('../../server/services/firebase.service', () => ({
    syncStudentProgressToFirebase: jest.fn().mockResolvedValue(true),
    syncAllStudentsToFirebase: jest.fn().mockResolvedValue(true),
    FIREBASE_RTDB_URL: 'https://mock-rtdb.firebaseio.com/',
    firebaseConfig: { apiKey: 'mock', projectId: 'mock', appId: 'mock' }
}));

describe("Progress & State Management API Integration Tests", () => {
    let app;

    beforeAll(() => {
        app = createMockApp();
    });

    test("POST /api/save-progress với payload hợp lệ trả về success", async () => {
        const payload = {
            studentId: "std_htsj4gbmo",
            classLevel: "6",
            studentName: "Trần Bình Minh",
            state: {
                xp: 2000,
                streak: 7,
                scores: { "bai-1": 100, "bai-2": 95 },
                lastUpdated: new Date().toISOString()
            }
        };

        const res = await request(app)
            .post('/api/save-progress')
            .send(payload);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
    });

    test("POST /api/save-progress với payload thiếu state trả về 400", async () => {
        const payload = {
            studentId: "std_htsj4gbmo"
        };

        const res = await request(app)
            .post('/api/save-progress')
            .send(payload);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test("POST /api/save-progress thiếu cả studentId lẫn classLevel trả về 400", async () => {
        const payload = {
            state: { xp: 100 }
        };

        const res = await request(app)
            .post('/api/save-progress')
            .send(payload);

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test("GET /api/load-progress?studentId=std_htsj4gbmo đọc lại chính xác state vừa lưu", async () => {
        const res = await request(app).get('/api/load-progress?studentId=std_htsj4gbmo');
        expect(res.status).toBe(200);
        expect(typeof res.body).toBe('object');
    });

    test("GET /api/load-progress thiếu tham số truy vấn trả về 400", async () => {
        const res = await request(app).get('/api/load-progress');
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});
