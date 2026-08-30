/**
 * INTEGRATION TESTS: System APIs
 */
const request = require('supertest');
const { createMockApp } = require('../helpers/mock-server');

describe("System API Integration Tests", () => {
    let app;

    beforeAll(() => {
        app = createMockApp();
    });

    test("GET /api/version trả về thông tin phiên bản hợp lệ", async () => {
        const res = await request(app).get('/api/version');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('version');
        expect(res.body).toHaveProperty('build');
        expect(res.body).toHaveProperty('lastUpdated');
    });

    test("GET /api/firebase-config trả về cấu hình Firebase đầy đủ", async () => {
        const res = await request(app).get('/api/firebase-config');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('apiKey');
        expect(res.body).toHaveProperty('projectId');
        expect(res.body).toHaveProperty('appId');
    });

    test("GET /api/auth/firebase-config trả về cùng cấu hình Firebase", async () => {
        const res = await request(app).get('/api/auth/firebase-config');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('apiKey');
        expect(res.body).toHaveProperty('projectId');
    });

    test("POST /api/report-client-error xử lý telemetry an toàn không crash server", async () => {
        const errorPayload = {
            studentId: "std_htsj4gbmo",
            lessonId: "test-lesson-1",
            lessonTitle: "Bài kiểm tra lỗi",
            errorMessage: "Synthetic Test Error",
            errorStack: "Error at line 1"
        };
        const res = await request(app)
            .post('/api/report-client-error')
            .send(errorPayload);
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ success: true });
    });

    test("GET /api/health trả về trạng thái hoạt động của server", async () => {
        const res = await request(app).get('/api/health');
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("ok");
        expect(res.body).toHaveProperty('timestamp');
    });
});
