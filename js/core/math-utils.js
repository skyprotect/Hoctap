/**
 * math-utils — Bộ tiện ích toán học thuần túy (Pure Math Utilities).
 * Hỗ trợ các phép toán số học, thừa số nguyên tố, phân số và chống va chạm đáp án nhiễu.
 * 
 * Public Contract:
 * - gcd(a: number, b: number): number
 * - lcm(a: number, b: number): number
 * - lcm3(a: number, b: number, c: number): number
 * - isPrime(num: number): boolean
 * - factorize(n: number): string (chuẩn KaTeX)
 * - getUniquePrimeFactors(n: number): number[]
 * - findPrimeFactorPairs(n: number): string[]
 * - sumDigits(n: number): number
 * - simplify(num: number, den: number): { num: number, den: number }
 * - SHIFT_IF_COLLIDE(val: any, ans?: any, w1?: any, w2?: any): any
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.MathUtils = api;
    if (typeof window !== 'undefined') {
        window.MathUtils = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.MathUtils = api;
    }
    if (typeof self !== 'undefined') {
        self.MathUtils = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // Tìm ƯCLN
    function gcd(a, b) {
        a = Math.round(Math.abs(Number(a) || 0));
        b = Math.round(Math.abs(Number(b) || 0));
        while (b) {
            let t = b;
            b = a % b;
            a = t;
        }
        return a || 1;
    }

    // Tìm BCNN
    function lcm(a, b) {
        return Math.abs(a * b) / gcd(a, b);
    }

    // Bội chung nhỏ nhất của 3 số
    function lcm3(a, b, c) {
        return lcm(lcm(a, b), c);
    }

    // Kiểm tra số nguyên tố
    function isPrime(num) {
        if (num <= 1) return false;
        for (let i = 2; i * i <= num; i++) {
            if (num % i === 0) return false;
        }
        return true;
    }

    // Phân tích ra thừa số nguyên tố (chuẩn KaTeX)
    function factorize(n) {
        if (n <= 1) return n.toString();
        const factors = [];
        let temp = n;
        for (let i = 2; i <= Math.sqrt(n); i++) {
            let count = 0;
            while (temp % i === 0) {
                count++;
                temp /= i;
            }
            if (count > 0) {
                factors.push(count === 1 ? `${i}` : `${i}^${count}`);
            }
        }
        if (temp > 1) {
            factors.push(`${temp}`);
        }
        return factors.join(' \\cdot ');
    }

    // Lấy danh sách các ước nguyên tố phân biệt
    function getUniquePrimeFactors(n) {
        const factors = new Set();
        let temp = n;
        for (let i = 2; i <= temp; i++) {
            if (isPrime(i) && temp % i === 0) {
                factors.add(i);
                while (temp % i === 0) {
                    temp /= i;
                }
            }
        }
        return Array.from(factors);
    }

    // Tìm các cặp ước nguyên tố
    function findPrimeFactorPairs(n) {
        const pairs = new Set();
        for (let p1 = 2; p1 * p1 <= n; p1++) {
            if (isPrime(p1) && n % p1 === 0) {
                let p2 = n / p1;
                if (isPrime(p2)) {
                    if (p1 <= p2) {
                        pairs.add(`${p1},${p2}`);
                    } else {
                        pairs.add(`${p2},${p1}`);
                    }
                }
            }
        }
        if (isPrime(n)) {
            pairs.add(`${n},1`);
        }
        return Array.from(pairs);
    }

    // Tổng các chữ số của một số
    function sumDigits(n) {
        let sum = 0;
        let temp = Math.abs(n);
        while (temp) {
            sum += temp % 10;
            temp = Math.floor(temp / 10);
        }
        return sum;
    }

    // Rút gọn phân số
    function simplify(num, den) {
        const g = gcd(num, den);
        let sNum = num / g;
        let sDen = den / g;
        if (sDen < 0) {
            sNum = -sNum;
            sDen = -sDen;
        }
        return { num: sNum, den: sDen };
    }

    // Hàm helper chống va chạm đáp án nhiễu trực tiếp
    function SHIFT_IF_COLLIDE(val, ans, w1, w2) {
        if (val === undefined || val === null) return val;
        let isString = typeof val === 'string';
        let parsedVal = isString ? Number(val) : val;
        if (typeof parsedVal !== 'number' || isNaN(parsedVal)) {
            return val;
        }
        const toNum = (x) => {
            if (typeof x === 'string') return Number(x);
            return x;
        };
        const numAns = ans !== undefined ? toNum(ans) : undefined;
        const numW1 = w1 !== undefined ? toNum(w1) : undefined;
        const numW2 = w2 !== undefined ? toNum(w2) : undefined;

        const used = new Set();
        if (numAns !== undefined && !isNaN(numAns)) used.add(numAns);
        if (numW1 !== undefined && !isNaN(numW1)) used.add(numW1);
        if (numW2 !== undefined && !isNaN(numW2)) used.add(numW2);

        const diffs = [1, -1, 2, -2, 3, -3, 5, -5, 10, -10];
        let diffIdx = 0;
        let finalVal = parsedVal;
        while (used.has(finalVal) && diffIdx < diffs.length) {
            finalVal = parsedVal + diffs[diffIdx++];
        }

        if (isString) {
            if (val.includes('.')) {
                const decimalPlaces = val.split('.')[1].length;
                return finalVal.toFixed(decimalPlaces);
            }
            return finalVal.toString();
        }
        return finalVal;
    }

    // Phân tích ra mảng các thừa số nguyên tố (dạng "2^3", "3")
    function getPrimeFactors(n) {
        if (n <= 1) return [n.toString()];
        const factors = [];
        let temp = n;
        for (let i = 2; i <= Math.sqrt(n); i++) {
            let count = 0;
            while (temp % i === 0) {
                count++;
                temp /= i;
            }
            if (count > 0) {
                factors.push(count === 1 ? `${i}` : `${i}^${count}`);
            }
        }
        if (temp > 1) {
            factors.push(`${temp}`);
        }
        return factors;
    }

    // Lấy các thừa số nguyên tố chung của 2 số
    function getCommonPrimeFactors(a, b) {
        const fA = {};
        let temp = a;
        for (let i = 2; i <= temp; i++) {
            let count = 0;
            while (temp % i === 0) {
                count++;
                temp /= i;
            }
            if (count > 0) fA[i] = count;
        }
        const fB = {};
        temp = b;
        for (let i = 2; i <= temp; i++) {
            let count = 0;
            while (temp % i === 0) {
                count++;
                temp /= i;
            }
            if (count > 0) fB[i] = count;
        }
        const common = [];
        for (const prime in fA) {
            if (fB[prime]) {
                const minPower = Math.min(fA[prime], fB[prime]);
                common.push(minPower === 1 ? `${prime}` : `${prime}^${minPower}`);
            }
        }
        return common.length > 0 ? common : ["1"];
    }

    // Lấy các thừa số nguyên tố chung của 3 số
    function getCommonPrimeFactors3(a, b, c) {
        const fA = {};
        let temp = a;
        for (let i = 2; i <= temp; i++) {
            let count = 0;
            while (temp % i === 0) {
                count++;
                temp /= i;
            }
            if (count > 0) fA[i] = count;
        }
        const fB = {};
        temp = b;
        for (let i = 2; i <= temp; i++) {
            let count = 0;
            while (temp % i === 0) {
                count++;
                temp /= i;
            }
            if (count > 0) fB[i] = count;
        }
        const fC = {};
        temp = c;
        for (let i = 2; i <= temp; i++) {
            let count = 0;
            while (temp % i === 0) {
                count++;
                temp /= i;
            }
            if (count > 0) fC[i] = count;
        }
        const common = [];
        for (const prime in fA) {
            if (fB[prime] && fC[prime]) {
                const minPower = Math.min(fA[prime], fB[prime], fC[prime]);
                common.push(minPower === 1 ? `${prime}` : `${prime}^${minPower}`);
            }
        }
        return common.length > 0 ? common : ["1"];
    }

    // Lấy danh sách tất cả các ước số nguyên dương của n
    function getDivisors(n) {
        const divs = [];
        for (let i = 1; i <= n; i++) {
            if (n % i === 0) {
                divs.push(i);
            }
        }
        return divs;
    }

    const MathUtils = {
        gcd: gcd,
        lcm: lcm,
        lcm3: lcm3,
        isPrime: isPrime,
        factorize: factorize,
        getUniquePrimeFactors: getUniquePrimeFactors,
        findPrimeFactorPairs: findPrimeFactorPairs,
        getPrimeFactors: getPrimeFactors,
        getCommonPrimeFactors: getCommonPrimeFactors,
        getCommonPrimeFactors3: getCommonPrimeFactors3,
        getDivisors: getDivisors,
        sumDigits: sumDigits,
        simplify: simplify,
        SHIFT_IF_COLLIDE: SHIFT_IF_COLLIDE
    };

    return MathUtils;
});
