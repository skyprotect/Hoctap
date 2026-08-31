const MathUtils = require('../../js/core/math-utils');
const QuestionEngine = require('../../js/questions-v3');

describe("Core MathUtilities Module (js/core/math-utils.js)", () => {

    test("MathUtils được định nghĩa với đầy đủ 10 hàm public contract", () => {
        expect(MathUtils).toBeDefined();
        expect(typeof MathUtils.gcd).toBe('function');
        expect(typeof MathUtils.lcm).toBe('function');
        expect(typeof MathUtils.lcm3).toBe('function');
        expect(typeof MathUtils.isPrime).toBe('function');
        expect(typeof MathUtils.factorize).toBe('function');
        expect(typeof MathUtils.getUniquePrimeFactors).toBe('function');
        expect(typeof MathUtils.findPrimeFactorPairs).toBe('function');
        expect(typeof MathUtils.sumDigits).toBe('function');
        expect(typeof MathUtils.simplify).toBe('function');
        expect(typeof MathUtils.SHIFT_IF_COLLIDE).toBe('function');
    });

    describe("1. GCD (Ước chung lớn nhất)", () => {
        test("Tính đúng GCD với các cặp số nguyên dương", () => {
            expect(MathUtils.gcd(12, 18)).toBe(6);
            expect(MathUtils.gcd(18, 12)).toBe(6);
            expect(MathUtils.gcd(7, 13)).toBe(1);
            expect(MathUtils.gcd(100, 25)).toBe(25);
            expect(MathUtils.gcd(48, 180)).toBe(12);
        });

        test("Tính đúng GCD với số âm và số 0", () => {
            expect(MathUtils.gcd(-12, 18)).toBe(6);
            expect(MathUtils.gcd(12, -18)).toBe(6);
            expect(MathUtils.gcd(-12, -18)).toBe(6);
            expect(MathUtils.gcd(15, 0)).toBe(15);
            expect(MathUtils.gcd(0, 15)).toBe(15);
            expect(MathUtils.gcd(0, 0)).toBe(1); // fallback: a || 1
        });

        test("Xử lý chuỗi số và giá trị không hợp lệ an toàn", () => {
            expect(MathUtils.gcd("12", "18")).toBe(6);
            expect(MathUtils.gcd(null, 18)).toBe(18);
            expect(MathUtils.gcd(undefined, undefined)).toBe(1);
        });
    });

    describe("2. LCM (Bội chung nhỏ nhất)", () => {
        test("Tính đúng LCM với các cặp số nguyên dương", () => {
            expect(MathUtils.lcm(4, 6)).toBe(12);
            expect(MathUtils.lcm(6, 4)).toBe(12);
            expect(MathUtils.lcm(7, 13)).toBe(91);
            expect(MathUtils.lcm(15, 20)).toBe(60);
        });

        test("Tính đúng LCM với số âm và số 0", () => {
            expect(MathUtils.lcm(-4, 6)).toBe(12);
            expect(MathUtils.lcm(4, -6)).toBe(12);
            expect(MathUtils.lcm(-4, -6)).toBe(12);
            expect(MathUtils.lcm(0, 5)).toBe(0);
        });
    });

    describe("3. LCM3 (Bội chung nhỏ nhất của 3 số)", () => {
        test("Tính đúng LCM3 của 3 số", () => {
            expect(MathUtils.lcm3(4, 6, 8)).toBe(24);
            expect(MathUtils.lcm3(3, 5, 7)).toBe(105);
            expect(MathUtils.lcm3(12, 18, 24)).toBe(72);
            expect(MathUtils.lcm3(10, 15, 20)).toBe(60);
        });
    });

    describe("4. isPrime (Kiểm tra số nguyên tố)", () => {
        test("Trả về false cho các số <= 1", () => {
            expect(MathUtils.isPrime(-10)).toBe(false);
            expect(MathUtils.isPrime(-1)).toBe(false);
            expect(MathUtils.isPrime(0)).toBe(false);
            expect(MathUtils.isPrime(1)).toBe(false);
        });

        test("Trả về true cho các số nguyên tố", () => {
            const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101];
            primes.forEach(p => {
                expect(MathUtils.isPrime(p)).toBe(true);
            });
        });

        test("Trả về false cho các hợp số", () => {
            const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 25, 27, 49, 100, 121];
            composites.forEach(c => {
                expect(MathUtils.isPrime(c)).toBe(false);
            });
        });
    });

    describe("5. factorize (Phân tích thừa số nguyên tố chuẩn KaTeX)", () => {
        test("Trả về chuỗi số nguyên nếu n <= 1", () => {
            expect(MathUtils.factorize(1)).toBe("1");
            expect(MathUtils.factorize(0)).toBe("0");
            expect(MathUtils.factorize(-5)).toBe("-5");
        });

        test("Phân tích đúng số nguyên tố", () => {
            expect(MathUtils.factorize(2)).toBe("2");
            expect(MathUtils.factorize(7)).toBe("7");
            expect(MathUtils.factorize(13)).toBe("13");
        });

        test("Phân tích đúng hợp số với định dạng KaTeX '\\cdot'", () => {
            expect(MathUtils.factorize(12)).toBe("2^2 \\cdot 3");
            expect(MathUtils.factorize(18)).toBe("2 \\cdot 3^2");
            expect(MathUtils.factorize(72)).toBe("2^3 \\cdot 3^2");
            expect(MathUtils.factorize(360)).toBe("2^3 \\cdot 3^2 \\cdot 5");
            expect(MathUtils.factorize(100)).toBe("2^2 \\cdot 5^2");
        });
    });

    describe("6. getUniquePrimeFactors (Danh sách các ước nguyên tố phân biệt)", () => {
        test("Trả về mảng rỗng nếu n <= 1", () => {
            expect(MathUtils.getUniquePrimeFactors(1)).toEqual([]);
            expect(MathUtils.getUniquePrimeFactors(0)).toEqual([]);
        });

        test("Trả về đúng mảng các thừa số nguyên tố phân biệt", () => {
            expect(MathUtils.getUniquePrimeFactors(12)).toEqual([2, 3]);
            expect(MathUtils.getUniquePrimeFactors(100)).toEqual([2, 5]);
            expect(MathUtils.getUniquePrimeFactors(7)).toEqual([7]);
            expect(MathUtils.getUniquePrimeFactors(210)).toEqual([2, 3, 5, 7]);
        });
    });

    describe("7. findPrimeFactorPairs (Tìm các cặp ước nguyên tố)", () => {
        test("Tìm đúng cặp ước nguyên tố cho hợp số dạng p1 * p2", () => {
            expect(MathUtils.findPrimeFactorPairs(6)).toEqual(["2,3"]);
            expect(MathUtils.findPrimeFactorPairs(10)).toEqual(["2,5"]);
            expect(MathUtils.findPrimeFactorPairs(15)).toEqual(["3,5"]);
            expect(MathUtils.findPrimeFactorPairs(21)).toEqual(["3,7"]);
        });

        test("Xử lý đúng số nguyên tố (trả về ['p,1'])", () => {
            expect(MathUtils.findPrimeFactorPairs(7)).toEqual(["7,1"]);
            expect(MathUtils.findPrimeFactorPairs(13)).toEqual(["13,1"]);
        });

        test("Trả về mảng rỗng cho hợp số có >2 thừa số nguyên tố không tạo thành cặp 2 số nguyên tố", () => {
            expect(MathUtils.findPrimeFactorPairs(12)).toEqual([]); // 12 = 2*6 (6 ko ngto), 3*4 (4 ko ngto)
            expect(MathUtils.findPrimeFactorPairs(8)).toEqual([]);
        });
    });

    describe("8. sumDigits (Tổng các chữ số)", () => {
        test("Tính đúng tổng chữ số cho số dương", () => {
            expect(MathUtils.sumDigits(0)).toBe(0);
            expect(MathUtils.sumDigits(5)).toBe(5);
            expect(MathUtils.sumDigits(123)).toBe(6);
            expect(MathUtils.sumDigits(9999)).toBe(36);
        });

        test("Tính đúng tổng chữ số cho số âm", () => {
            expect(MathUtils.sumDigits(-123)).toBe(6);
            expect(MathUtils.sumDigits(-456)).toBe(15);
        });
    });

    describe("9. simplify (Rút gọn phân số)", () => {
        test("Rút gọn đúng phân số dương", () => {
            expect(MathUtils.simplify(6, 8)).toEqual({ num: 3, den: 4 });
            expect(MathUtils.simplify(15, 20)).toEqual({ num: 3, den: 4 });
            expect(MathUtils.simplify(7, 13)).toEqual({ num: 7, den: 13 });
            expect(MathUtils.simplify(10, 5)).toEqual({ num: 2, den: 1 });
        });

        test("Chuẩn hóa dấu đúng khi tử số hoặc mẫu số âm", () => {
            expect(MathUtils.simplify(-6, 8)).toEqual({ num: -3, den: 4 });
            expect(MathUtils.simplify(6, -8)).toEqual({ num: -3, den: 4 });
            expect(MathUtils.simplify(-6, -8)).toEqual({ num: 3, den: 4 });
            expect(MathUtils.simplify(0, 5)).toEqual({ num: 0, den: 1 });
        });
    });

    describe("10. SHIFT_IF_COLLIDE (Chống va chạm đáp án nhiễu)", () => {
        test("Giữ nguyên giá trị khi không có va chạm", () => {
            expect(MathUtils.SHIFT_IF_COLLIDE(15, 10, 12, 14)).toBe(15);
            expect(MathUtils.SHIFT_IF_COLLIDE("15", "10", "12", "14")).toBe("15");
        });

        test("Dịch chuyển số nguyên khi trùng đáp án đúng ans", () => {
            // val = 10 trùng ans = 10. diffs[0] = 1 -> 11
            expect(MathUtils.SHIFT_IF_COLLIDE(10, 10, 20, 30)).toBe(11);
        });

        test("Dịch chuyển qua nhiều diffs nếu các vị trí đầu bị chiếm bởi ans và distractors", () => {
            // val = 10, ans = 10, w1 = 11 (+1), w2 = 9 (-1)
            // diffs: +1 (11: trùng w1), -1 (9: trùng w2), +2 (12: trống!) -> finalVal = 12
            expect(MathUtils.SHIFT_IF_COLLIDE(10, 10, 11, 9)).toBe(12);
        });

        test("Bảo toàn kiểu dữ liệu string và định dạng số nguyên", () => {
            const res = MathUtils.SHIFT_IF_COLLIDE("10", "10", "20", "30");
            expect(res).toBe("11");
            expect(typeof res).toBe('string');
        });

        test("Bảo toàn số chữ số thập phân khi đầu vào là chuỗi thập phân", () => {
            const res = MathUtils.SHIFT_IF_COLLIDE("10.50", "10.50", "20.00", "30.00");
            expect(res).toBe("11.50");
            expect(typeof res).toBe('string');

            const res3Dec = MathUtils.SHIFT_IF_COLLIDE("7.125", "7.125", "8.000", "9.000");
            expect(res3Dec).toBe("8.125");
        });

        test("Bảo toàn kiểu dữ liệu number", () => {
            const res = MathUtils.SHIFT_IF_COLLIDE(10, 10, 20, 30);
            expect(res).toBe(11);
            expect(typeof res).toBe('number');
        });

        test("Trả về an toàn khi đầu vào null, undefined hoặc chuỗi không phải số", () => {
            expect(MathUtils.SHIFT_IF_COLLIDE(null)).toBe(null);
            expect(MathUtils.SHIFT_IF_COLLIDE(undefined)).toBe(undefined);
            expect(MathUtils.SHIFT_IF_COLLIDE("abc", "10", "20", "30")).toBe("abc");
        });
    });

    describe("11. getPrimeFactors", () => {
        test("Phân tích ra mảng chuỗi thừa số", () => {
            expect(MathUtils.getPrimeFactors(1)).toEqual(["1"]);
            expect(MathUtils.getPrimeFactors(12)).toEqual(["2^2", "3"]);
            expect(MathUtils.getPrimeFactors(180)).toEqual(["2^2", "3^2", "5"]);
            expect(MathUtils.getPrimeFactors(17)).toEqual(["17"]);
        });
    });

    describe("12. getCommonPrimeFactors & getCommonPrimeFactors3", () => {
        test("Lấy đúng thừa số nguyên tố chung của 2 số", () => {
            expect(MathUtils.getCommonPrimeFactors(12, 18)).toEqual(["2", "3"]);
            expect(MathUtils.getCommonPrimeFactors(24, 36)).toEqual(["2^2", "3"]);
            expect(MathUtils.getCommonPrimeFactors(7, 13)).toEqual(["1"]);
        });

        test("Lấy đúng thừa số nguyên tố chung của 3 số", () => {
            expect(MathUtils.getCommonPrimeFactors3(24, 36, 48)).toEqual(["2^2", "3"]);
            expect(MathUtils.getCommonPrimeFactors3(12, 18, 25)).toEqual(["1"]);
        });
    });

    describe("13. getDivisors", () => {
        test("Lấy đầy đủ danh sách ước số nguyên dương", () => {
            expect(MathUtils.getDivisors(1)).toEqual([1]);
            expect(MathUtils.getDivisors(6)).toEqual([1, 2, 3, 6]);
            expect(MathUtils.getDivisors(12)).toEqual([1, 2, 3, 4, 6, 12]);
            expect(MathUtils.getDivisors(13)).toEqual([1, 13]);
        });
    });

    describe("Characterization & Đối chiếu tương thích 100% với QuestionEngine", () => {
        test("Các hàm trên QuestionEngine ủy quyền chính xác sang MathUtils", () => {
            expect(QuestionEngine.gcd(24, 36)).toBe(MathUtils.gcd(24, 36));
            expect(QuestionEngine.lcm(14, 21)).toBe(MathUtils.lcm(14, 21));
            expect(QuestionEngine.lcm3(6, 8, 10)).toBe(MathUtils.lcm3(6, 8, 10));
            expect(QuestionEngine.isPrime(97)).toBe(MathUtils.isPrime(97));
            expect(QuestionEngine.factorize(180)).toBe(MathUtils.factorize(180));
            expect(QuestionEngine.getUniquePrimeFactors(180)).toEqual(MathUtils.getUniquePrimeFactors(180));
            expect(QuestionEngine.findPrimeFactorPairs(35)).toEqual(MathUtils.findPrimeFactorPairs(35));
            expect(QuestionEngine.sumDigits(789)).toBe(MathUtils.sumDigits(789));
            expect(QuestionEngine.simplify(18, 24)).toEqual(MathUtils.simplify(18, 24));
            expect(QuestionEngine.SHIFT_IF_COLLIDE(10, 10, 11, 9)).toBe(MathUtils.SHIFT_IF_COLLIDE(10, 10, 11, 9));
            expect(QuestionEngine.getPrimeFactors(180)).toEqual(MathUtils.getPrimeFactors(180));
            expect(QuestionEngine.getCommonPrimeFactors(24, 36)).toEqual(MathUtils.getCommonPrimeFactors(24, 36));
            expect(QuestionEngine.getCommonPrimeFactors3(24, 36, 48)).toEqual(MathUtils.getCommonPrimeFactors3(24, 36, 48));
            expect(QuestionEngine.getDivisors(12)).toEqual(MathUtils.getDivisors(12));
        });
    });
});
