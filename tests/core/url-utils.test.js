/**
 * Unit & Characterization Tests for UrlUtils module (js/core/url-utils.js)
 * 
 * Đảm bảo 100% contract và tương thích ngược:
 * 1. Public Contract & Exports (CommonJS, globalThis, window, self)
 * 2. HTTP / HTTPS environment:
 *    - Chuẩn hóa leading slash: "api/test" -> "/api/test"
 *    - Giữ nguyên path đã có slash: "/api/test" -> "/api/test"
 *    - Giữ nguyên query string và hash: "/api/test?grade=6&topic=t1#stats" -> "/api/test?grade=6&topic=t1#stats"
 * 3. FILE protocol environment:
 *    - Port mặc định: "http://localhost:3000/api/test"
 *    - Port tùy chỉnh từ safeStorage.server_port: "http://localhost:8080/api/test", "http://localhost:5000/api/test"
 *    - Chuẩn hóa leading slash trên file: "api/test" -> "http://localhost:3000/api/test"
 *    - Giữ nguyên query string và hash trên file
 * 4. Defensive / Edge Case Handling:
 *    - Chuỗi rỗng "" -> "/" (hoặc "http://localhost:3000/" trên file:)
 *    - null / undefined -> "/" (không bao giờ crash ứng dụng)
 *    - number / non-string -> "/123" (không crash)
 * 5. Node.js / Web Worker environment (không có window hoặc window.location):
 *    - Fallback an toàn về pathname chuẩn "/api/test"
 * 6. 100% Characterization đối chiếu với normalized behavior mong đợi
 */

const UrlUtils = require('../../js/core/url-utils');
const { getApiUrl } = require('../../js/core/url-utils');
const safeStorage = require('../../js/core/safe-storage');

describe("Unit & Characterization Tests — UrlUtils (js/core/url-utils.js)", () => {

    const originalLocation = globalThis.location;
    const originalWindow = globalThis.window;

    afterEach(() => {
        // Khôi phục môi trường toàn cục sau mỗi test
        if (originalWindow !== undefined) {
            globalThis.window = originalWindow;
        } else {
            delete globalThis.window;
        }
        if (originalLocation !== undefined) {
            globalThis.location = originalLocation;
        } else {
            delete globalThis.location;
        }
        safeStorage.removeItem('server_port');
    });

    // 1. Public Contract & Exports
    describe("1. Public Contract & Exports", () => {
        test("Export đúng cấu trúc qua CommonJS module.exports", () => {
            expect(UrlUtils).toBeDefined();
            expect(typeof UrlUtils.getApiUrl).toBe('function');
        });

        test("Export hàm qua Destructuring", () => {
            expect(typeof getApiUrl).toBe('function');
        });

        test("Tự động gán vào globalThis / window", () => {
            expect(globalThis.UrlUtils).toBeDefined();
            expect(globalThis.getApiUrl).toBeDefined();
            expect(typeof globalThis.getApiUrl).toBe('function');
        });
    });

    // 2. Môi trường Web tiêu chuẩn (HTTP / HTTPS)
    describe("2. Môi trường Web tiêu chuẩn (HTTP / HTTPS)", () => {
        beforeEach(() => {
            globalThis.window = {
                location: {
                    protocol: 'http:',
                    hostname: 'localhost',
                    port: '3000'
                },
                safeStorage: safeStorage
            };
        });

        test("Chuẩn hóa đường dẫn bắt đầu bằng dấu gạch chéo (/)", () => {
            expect(UrlUtils.getApiUrl('/api/load-config')).toBe('/api/load-config');
            expect(UrlUtils.getApiUrl('/api/save-progress')).toBe('/api/save-progress');
            expect(UrlUtils.getApiUrl('/api/admin/login')).toBe('/api/admin/login');
        });

        test("Tự động thêm dấu gạch chéo đầu nếu thiếu (Leading slash normalization)", () => {
            expect(UrlUtils.getApiUrl('api/load-config')).toBe('/api/load-config');
            expect(UrlUtils.getApiUrl('api/save-progress')).toBe('/api/save-progress');
            expect(UrlUtils.getApiUrl('api/admin/login')).toBe('/api/admin/login');
        });

        test("Bảo toàn query string và hash fragment", () => {
            expect(UrlUtils.getApiUrl('/api/load-progress?classLevel=6&studentId=std_htsj4gbmo'))
                .toBe('/api/load-progress?classLevel=6&studentId=std_htsj4gbmo');
            expect(UrlUtils.getApiUrl('api/data?filter=active#section-2'))
                .toBe('/api/data?filter=active#section-2');
        });

        test("Hoạt động chính xác trên HTTPS", () => {
            globalThis.window.location.protocol = 'https:';
            expect(UrlUtils.getApiUrl('/api/auth/google-login')).toBe('/api/auth/google-login');
            expect(UrlUtils.getApiUrl('api/auth/firebase-config')).toBe('/api/auth/firebase-config');
        });
    });

    // 3. Môi trường Kiosk / Offline Cục bộ (file: protocol)
    describe("3. Môi trường Offline Kiosk (file: protocol)", () => {
        beforeEach(() => {
            globalThis.window = {
                location: {
                    protocol: 'file:',
                    href: 'file:///C:/ToanHocKiosk/student.html'
                },
                safeStorage: safeStorage
            };
        });

        test("Mặc định chuyển hướng sang http://localhost:3000 khi chưa có server_port", () => {
            safeStorage.removeItem('server_port');
            expect(UrlUtils.getApiUrl('/api/load-config')).toBe('http://localhost:3000/api/load-config');
            expect(UrlUtils.getApiUrl('api/load-config')).toBe('http://localhost:3000/api/load-config');
            expect(UrlUtils.getApiUrl('/api/save-progress')).toBe('http://localhost:3000/api/save-progress');
        });

        test("Đọc cổng tùy chỉnh từ safeStorage.getItem('server_port')", () => {
            safeStorage.setItem('server_port', '8080');
            expect(UrlUtils.getApiUrl('/api/load-config')).toBe('http://localhost:8080/api/load-config');
            expect(UrlUtils.getApiUrl('api/load-config')).toBe('http://localhost:8080/api/load-config');

            safeStorage.setItem('server_port', '5000');
            expect(UrlUtils.getApiUrl('/api/admin/login')).toBe('http://localhost:5000/api/admin/login');
        });

        test("Bảo toàn query string và hash khi chạy trên file:", () => {
            safeStorage.setItem('server_port', '3000');
            expect(UrlUtils.getApiUrl('/api/load-progress?classLevel=6&studentId=std_htsj4gbmo#scores'))
                .toBe('http://localhost:3000/api/load-progress?classLevel=6&studentId=std_htsj4gbmo#scores');
        });
    });

    // 4. Phòng thủ & Xử lý dữ liệu biên an toàn (Defensive Input Handling)
    describe("4. Phòng thủ & Xử lý dữ liệu biên (Defensive Inputs)", () => {
        test("Xử lý chuỗi rỗng '' trên HTTP trả về '/' mà không crash", () => {
            globalThis.window = { location: { protocol: 'http:' } };
            expect(UrlUtils.getApiUrl('')).toBe('/');
        });

        test("Xử lý chuỗi rỗng '' trên FILE trả về 'http://localhost:3000/' mà không crash", () => {
            globalThis.window = { location: { protocol: 'file:' }, safeStorage: safeStorage };
            expect(UrlUtils.getApiUrl('')).toBe('http://localhost:3000/');
        });

        test("Xử lý null an toàn (không ném uncaught TypeError)", () => {
            globalThis.window = { location: { protocol: 'http:' } };
            expect(UrlUtils.getApiUrl(null)).toBe('/');

            globalThis.window.location.protocol = 'file:';
            expect(UrlUtils.getApiUrl(null)).toBe('http://localhost:3000/');
        });

        test("Xử lý undefined an toàn (không ném uncaught TypeError)", () => {
            globalThis.window = { location: { protocol: 'http:' } };
            expect(UrlUtils.getApiUrl(undefined)).toBe('/');
            expect(UrlUtils.getApiUrl()).toBe('/');

            globalThis.window.location.protocol = 'file:';
            expect(UrlUtils.getApiUrl(undefined)).toBe('http://localhost:3000/');
        });

        test("Xử lý kiểu dữ liệu không phải chuỗi (Number, Object) an toàn", () => {
            globalThis.window = { location: { protocol: 'http:' } };
            expect(UrlUtils.getApiUrl(123)).toBe('/123');
            expect(UrlUtils.getApiUrl(0)).toBe('/0');
        });
    });

    // 5. Môi trường Node.js / Web Worker (Không có window.location)
    describe("5. Môi trường Node.js / Web Worker", () => {
        test("Không có window.location trả về pathname chuẩn bắt đầu bằng '/'", () => {
            delete globalThis.window;
            expect(UrlUtils.getApiUrl('/api/test')).toBe('/api/test');
            expect(UrlUtils.getApiUrl('api/test')).toBe('/api/test');
            expect(UrlUtils.getApiUrl('')).toBe('/');
        });
    });

    // 6. 100% Characterization Test: Tính nhất quán của normalized behavior
    describe("6. 100% Normalized Characterization", () => {
        test("Bộ dữ liệu mẫu đa dạng cho kết quả dự đoán được và nhất quán 100%", () => {
            const samples = [
                { input: '/api/load-config', expectedHttp: '/api/load-config', expectedFile: 'http://localhost:3000/api/load-config' },
                { input: 'api/load-config', expectedHttp: '/api/load-config', expectedFile: 'http://localhost:3000/api/load-config' },
                { input: '/api/save-progress?id=1', expectedHttp: '/api/save-progress?id=1', expectedFile: 'http://localhost:3000/api/save-progress?id=1' },
                { input: 'api/save-progress?id=1#top', expectedHttp: '/api/save-progress?id=1#top', expectedFile: 'http://localhost:3000/api/save-progress?id=1#top' },
                { input: '', expectedHttp: '/', expectedFile: 'http://localhost:3000/' },
                { input: null, expectedHttp: '/', expectedFile: 'http://localhost:3000/' },
                { input: undefined, expectedHttp: '/', expectedFile: 'http://localhost:3000/' }
            ];

            samples.forEach(({ input, expectedHttp, expectedFile }) => {
                // Test HTTP
                globalThis.window = { location: { protocol: 'http:' } };
                expect(UrlUtils.getApiUrl(input)).toBe(expectedHttp);

                // Test FILE
                globalThis.window = { location: { protocol: 'file:' }, safeStorage: safeStorage };
                expect(UrlUtils.getApiUrl(input)).toBe(expectedFile);
            });
        });
    });

    // 7. extractYoutubeId Tests
    describe("7. extractYoutubeId Regex Parser", () => {
        test("Trích xuất đúng ID từ URL dạng youtu.be", () => {
            expect(UrlUtils.extractYoutubeId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
            expect(UrlUtils.extractYoutubeId("http://youtu.be/dQw4w9WgXcQ?t=10")).toBe("dQw4w9WgXcQ");
        });

        test("Trích xuất đúng ID từ URL dạng watch?v=", () => {
            expect(UrlUtils.extractYoutubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
            expect(UrlUtils.extractYoutubeId("https://youtube.com/watch?v=dQw4w9WgXcQ&feature=share")).toBe("dQw4w9WgXcQ");
        });

        test("Trích xuất đúng ID từ URL dạng embed & v", () => {
            expect(UrlUtils.extractYoutubeId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
            expect(UrlUtils.extractYoutubeId("https://www.youtube.com/v/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
        });

        test("Giữ nguyên ID 11 ký tự nếu đã là raw ID", () => {
            expect(UrlUtils.extractYoutubeId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
        });

        test("Xử lý chuỗi rỗng, null, undefined an toàn", () => {
            expect(UrlUtils.extractYoutubeId("")).toBe("");
            expect(UrlUtils.extractYoutubeId(null)).toBe("");
            expect(UrlUtils.extractYoutubeId(undefined)).toBe("");
        });
    });
});
