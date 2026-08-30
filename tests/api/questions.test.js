/**
 * INTEGRATION TESTS: Quiz & Question APIs
 */
const request = require('supertest');
const { createMockApp } = require('../helpers/mock-server');

describe("Quiz & AI Generation API Integration Tests", () => {
    let app;

    beforeAll(() => {
        app = createMockApp();
    });

    test("GET /api/ai-status trả về trạng thái AI", async () => {
        const res = await request(app).get('/api/ai-status');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('state');
        expect(res.body).toHaveProperty('message');
    });

    test("GET /api/get-questions thiếu tham số lessonId trả về mã lỗi 400", async () => {
        const res = await request(app).get('/api/get-questions?lessonId=');
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test("GET /api/get-questions không truyền lessonId trả về 400", async () => {
        const res = await request(app).get('/api/get-questions');
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    test("GET /api/custom-topics nạp danh sách chủ đề", async () => {
        const res = await request(app).get('/api/custom-topics?studentId=std_htsj4gbmo');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.topics)).toBe(true);
    });

    test("GET /api/custom-vocabulary nạp danh sách từ vựng", async () => {
        const res = await request(app).get('/api/custom-vocabulary?studentId=std_htsj4gbmo');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.words)).toBe(true);
    });
});
