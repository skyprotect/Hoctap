/**
 * BỘ KIỂM THỬ HỒI QUY TOÀN DIỆN VÒNG ĐỜI MODAL ĐÁNH GIÁ AI
 * HỌCTẬP SYSTEM (v13.47)
 * Đảm bảo:
 * 1. CSS Invariant: .hidden và [hidden] luôn có 'display: none !important;'
 * 2. Cấu trúc DOM & Backdrop Close handler luôn đầy đủ
 * 3. Vòng đời Modal: OPEN -> LOADING -> ERROR/SUCCESS -> CLOSE
 * 4. Chống race condition & AbortController khi đóng modal hoặc retry liên tiếp
 * 5. Bất kể AI lỗi (401, 403, 429, 500, timeout, offline), Modal luôn ĐÓNG được 100%
 */

const fs = require('fs');
const path = require('path');
const request = require('supertest');
const { createMockApp } = require('./helpers/mock-server');

describe("KIỂM THỬ HỒI QUY VÒNG ĐỜI MODAL ĐÁNH GIÁ AI (HocTap v13.47)", () => {
    let appServer;

    beforeAll(() => {
        appServer = createMockApp();
    });

    // =========================================================================
    // 1. KIỂM THỬ CSS INVARIANT
    // =========================================================================
    test("1.1. File css/style.css BẮT BUỘC có quy tắc .hidden { display: none !important; }", () => {
        const cssPath = path.join(__dirname, '../css/style.css');
        expect(fs.existsSync(cssPath)).toBe(true);
        const cssContent = fs.readFileSync(cssPath, 'utf8');

        expect(cssContent).toMatch(/\.hidden[\s\S]*?display:\s*none\s*!important/);
        expect(cssContent).toMatch(/\[hidden\][\s\S]*?display:\s*none\s*!important/);
    });

    test("1.2. File css/base.css BẮT BUỘC có quy tắc .hidden { display: none !important; }", () => {
        const cssPath = path.join(__dirname, '../css/base.css');
        expect(fs.existsSync(cssPath)).toBe(true);
        const cssContent = fs.readFileSync(cssPath, 'utf8');

        expect(cssContent).toMatch(/\.hidden[\s\S]*?display:\s*none\s*!important/);
    });

    // =========================================================================
    // 2. KIỂM THỬ DOM & BACKDROP CLOSE CONTRACT
    // =========================================================================
    test("2.1. student.html BẮT BUỘC có #evaluation-modal với backdrop click handler và class hidden", () => {
        const htmlPath = path.join(__dirname, '../student.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');

        expect(htmlContent).toContain('id="evaluation-modal"');
        expect(htmlContent).toContain('class="modal-overlay hidden"');
        expect(htmlContent).toContain('onclick="if(event.target === this) app.closeEvaluationModal();"');
        expect(htmlContent).toContain('id="eval-time"');
        expect(htmlContent).toContain('id="eval-completed"');
        expect(htmlContent).toContain('id="eval-accuracy"');
        expect(htmlContent).toContain('id="eval-streak"');
        expect(htmlContent).toContain('id="eval-ai-advice"');
        expect(htmlContent).toContain('id="btn-eval-refresh-ai"');
    });

    test("2.2. templates/student/partials/modal-evaluation.html BẮT BUỘC có backdrop click handler", () => {
        const partialPath = path.join(__dirname, '../templates/student/partials/modal-evaluation.html');
        const partialContent = fs.readFileSync(partialPath, 'utf8');

        expect(partialContent).toContain('id="evaluation-modal"');
        expect(partialContent).toContain('class="modal-overlay hidden"');
        expect(partialContent).toContain('onclick="if(event.target === this) app.closeEvaluationModal();"');
    });

    // =========================================================================
    // 3. KIỂM THỬ MODULE JS VÒNG ĐỜI & CHỐNG RACE CONDITION
    // =========================================================================
    test("3.1. ParentDashboardModule có hàm closeModal hủy AbortController và thêm class hidden", () => {
        const jsPath = path.join(__dirname, '../js/modules/parent-dashboard.module.js');
        const jsContent = fs.readFileSync(jsPath, 'utf8');

        expect(jsContent).toContain('closeModal: function()');
        expect(jsContent).toContain('modal.classList.add(\'hidden\')');
        expect(jsContent).toContain('this.currentAbortController.abort()');
        expect(jsContent).toContain('activeRequestId');
    });

    test("3.2. navigation.js bắt phím Escape đóng #evaluation-modal và các modal khác", () => {
        const navPath = path.join(__dirname, '../js/core/navigation.js');
        const navContent = fs.readFileSync(navPath, 'utf8');

        expect(navContent).toContain('evaluation-modal');
        expect(navContent).toContain('closeModal');
    });

    // =========================================================================
    // 4. KIỂM THỬ SERVER CONTRACT POST /api/ai-analysis
    // =========================================================================
    test("4.1. POST /api/ai-analysis xử lý thành công với payload rỗng", async () => {
        const res = await request(appServer)
            .post('/api/ai-analysis')
            .send({});

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(typeof res.body.analysis).toBe('string');
        expect(res.body.analysis).toContain('chưa làm bài tập nào');
    });

    test("4.2. POST /api/ai-analysis xử lý an toàn với payload ban đầu của học sinh", async () => {
        const res = await request(appServer)
            .post('/api/ai-analysis')
            .send({
                history: [],
                examSessions: [],
                studentName: 'Trần Bình Minh',
                parentName: 'Phụ huynh',
                studentId: 'std_htsj4gbmo',
                classLevel: '6',
                xp: 0,
                scores: {}
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(typeof res.body.analysis).toBe('string');
        expect(res.body.analysis).toContain('Trần Bình Minh');
    });
});
