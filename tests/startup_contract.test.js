/**
 * REGRESSION TEST: Production Startup Contract & Dependency Verification
 * Đảm bảo ứng dụng không bao giờ bị thiếu module ts-node / typescript trong production bundle
 */
const fs = require('fs');
const path = require('path');
const request = require('supertest');
const { createMockApp } = require('./helpers/mock-server');

describe("Production Startup Contract & Dependency Tests", () => {
    const rootDir = path.resolve(__dirname, '..');

    test("1. package.json PHẢI chứa ts-node và typescript trong dependencies (không chỉ devDependencies)", () => {
        const pkgPath = path.join(rootDir, 'package.json');
        expect(fs.existsSync(pkgPath)).toBe(true);
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

        expect(pkg.dependencies).toBeDefined();
        expect(pkg.dependencies['ts-node']).toBeDefined();
        expect(pkg.dependencies['typescript']).toBeDefined();
    });

    test("2. tsconfig.json PHẢI tồn tại và có cấu hình hợp lệ", () => {
        const tsconfigPath = path.join(rootDir, 'tsconfig.json');
        expect(fs.existsSync(tsconfigPath)).toBe(true);
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
        expect(tsconfig.compilerOptions).toBeDefined();
        expect(tsconfig.compilerOptions.module).toBe('commonjs');
    });

    test("3. Điểm vào server.js PHẢI nạp được ts-node runtime", () => {
        expect(() => {
            require('ts-node').register({ transpileOnly: true });
        }).not.toThrow();
    });

    test("4. POST /api/ai-analysis PHẢI hoạt động mà không bị chặn 401 khi không có token Admin", async () => {
        const app = createMockApp();
        const res = await request(app)
            .post('/api/ai-analysis')
            .send({
                history: [],
                examSessions: [],
                studentName: "Trần Bình Minh",
                parentName: "Phụ huynh",
                studentId: "std_htsj4gbmo",
                classLevel: "6",
                xp: 0,
                scores: {}
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body).toHaveProperty('analysis');
        expect(res.body.analysis).toContain('Trần Bình Minh');
    });

    test("5. Các tệp launcher cốt lõi PHẢI tồn tại đầy đủ", () => {
        const requiredFiles = [
            'server.js',
            'student.html',
            'parent.html',
            'Bat dau hoc.vbs',
            'Dung hoc.vbs',
            'kiosk_lock.exe',
            'installer.iss',
            'version.json'
        ];

        for (const file of requiredFiles) {
            const filePath = path.join(rootDir, file);
            expect(fs.existsSync(filePath)).toBe(true);
        }
    });
});
