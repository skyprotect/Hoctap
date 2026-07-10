const fs = require('fs');
const path = require('path');
const vm = require('vm');

const questionsV3Path = path.join(__dirname, '../js/questions-v3.js');

describe("Unit Tests for questions-v3.js", () => {
    let questions;

    beforeAll(() => {
        // Đọc mã nguồn và giả lập môi trường browser để nạp
        const code = fs.readFileSync(questionsV3Path, 'utf8');
        
        // Mock các đối tượng DOM/Browser tối thiểu
        const mockWindow = {
            Swal: {
                fire: jest.fn()
            }
        };
        const mockDocument = {
            addEventListener: jest.fn(),
            getElementById: jest.fn().mockReturnValue({
                classList: {
                    contains: jest.fn().mockReturnValue(true)
                }
            })
        };

        const context = {
            window: mockWindow,
            document: mockDocument,
            console,
            Math,
            setInterval: jest.fn(),
            clearInterval: jest.fn(),
            setTimeout: jest.fn(),
            clearTimeout: jest.fn()
        };

        // Chạy mã nguồn trong context sandbox
        try {
            vm.runInNewContext(code, context);
            questions = mockWindow.questions;
        } catch (e) {
            console.error("Lỗi khi load questions-v3.js trong sandbox test:", e);
            throw e;
        }
    });

    test("Đối tượng questions phải được khởi tạo thành công", () => {
        expect(questions).toBeDefined();
        expect(typeof questions.shuffle).toBe('function');
        expect(typeof questions.randomInt).toBe('function');
    });

    describe("Kiểm tra hàm randomInt", () => {
        test("randomInt sinh số trong khoảng [min, max]", () => {
            for (let i = 0; i < 100; i++) {
                const val = questions.randomInt(5, 15);
                expect(val).toBeGreaterThanOrEqual(5);
                expect(val).toBeLessThanOrEqual(15);
            }
        });

        test("randomInt loại trừ số 0 khi excludeZero = true", () => {
            for (let i = 0; i < 100; i++) {
                const val = questions.randomInt(-5, 5, true);
                expect(val).not.toBe(0);
                expect(val).toBeGreaterThanOrEqual(-5);
                expect(val).toBeLessThanOrEqual(5);
            }
        });
    });

    describe("Kiểm tra phân phối đồng đều của thuật toán Shuffle (Fisher-Yates)", () => {
        test("Shuffle phân phối xác suất đồng đều (Không bị Answer Bias)", () => {
            const iterations = 10000;
            // Mảng 4 phần tử đại diện cho A, B, C, D
            // Ta đếm số lần mỗi phần tử ban đầu (0, 1, 2, 3) kết thúc ở mỗi vị trí sau khi shuffle
            const counts = [
                [0, 0, 0, 0], // counts[i][j]: số lần phần tử i kết thúc ở vị trí j
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];

            for (let k = 0; k < iterations; k++) {
                const arr = [0, 1, 2, 3];
                questions.shuffle(arr);
                
                // Ghi nhận vị trí mới
                for (let j = 0; j < 4; j++) {
                    const originalVal = arr[j];
                    counts[originalVal][j]++;
                }
            }

            // Tỷ lệ mong muốn cho mỗi vị trí là 25% (0.25)
            // Sai số cho phép (tolerance) là 3% (0.03) cho 10,000 lần lặp
            const expectedRatio = 0.25;
            const tolerance = 0.03;

            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    const ratio = counts[i][j] / iterations;
                    expect(ratio).toBeGreaterThan(expectedRatio - tolerance);
                    expect(ratio).toBeLessThan(expectedRatio + tolerance);
                }
            }
        });
    });

    describe("Kiểm tra các hàm toán học phụ trợ", () => {
        test("getPrimeFactors phân tích đúng thừa số nguyên tố", () => {
            // ƯCLN/BCNN phụ trợ
            expect(questions.getPrimeFactors(12)).toEqual(["2^2", "3"]);
            expect(questions.getPrimeFactors(7)).toEqual(["7"]);
            expect(questions.getPrimeFactors(1)).toEqual(["1"]);
        });
    });
});
