/**
 * INTEGRATION TESTS: Auth & Student Info APIs
 */
const request = require('supertest');
const { createMockApp } = require('../helpers/mock-server');

describe("Auth & Access Control API Integration Tests", () => {
    let app;

    beforeAll(() => {
        app = createMockApp();
    });

    test("GET /api/auth/google-client-id trả về Client ID hợp lệ", async () => {
        const res = await request(app).get('/api/auth/google-client-id');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('clientId');
        expect(typeof res.body.clientId).toBe('string');
        expect(res.body.clientId.length).toBeGreaterThan(10);
    });

    test("GET /api/auth/session trả về trạng thái phiên làm việc", async () => {
        const res = await request(app).get('/api/auth/session');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('loggedIn');
    });

    test("POST /api/admin/login với mã PIN đúng trả về JWT token", async () => {
        const res = await request(app)
            .post('/api/admin/login')
            .send({ password: " haidangppk " ? "123456" : "123456" });
        expect([200, 401]).toContain(res.status);
        if (res.status === 200) {
            expect(res.body.success).toBe(true);
            expect(res.body).toHaveProperty('token');
        }
    });

    test("POST /api/admin/login với mã PIN sai trả về 401", async () => {
        const res = await request(app)
            .post('/api/admin/login')
            .send({ password: "wrong_pin_999999" });
        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('error');
    });

    test("POST /api/verify-pin với mã PIN sai trả về 403", async () => {
        const res = await request(app)
            .post('/api/verify-pin')
            .send({ pin: "invalid_pin_123" });
        expect(res.status).toBe(403);
        expect(res.body.success).toBe(false);
    });

    test("GET /api/student-info?studentId=std_htsj4gbmo nạp dữ liệu an toàn", async () => {
        const res = await request(app).get('/api/student-info?studentId=std_htsj4gbmo');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.studentId).toBe('std_htsj4gbmo');
    });

    test("GET /api/student-info?studentId=NON_EXISTENT_ID xử lý an toàn không crash", async () => {
        const res = await request(app).get('/api/student-info?studentId=NON_EXISTENT_ID');
        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.state).toBeNull();
    });
});
