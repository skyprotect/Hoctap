/**
 * HỌCTẬP SYSTEM — CORE ARITHMETIC & NUMBER THEORY HELPERS
 * Thư viện các hàm toán học thuần túy: ƯCLN, BCNN, Thừa số nguyên tố, Phân số, Phân tích ước số.
 */
(function(root) {
    'use strict';

    const Arithmetic = {
        // Tìm ước chung lớn nhất (GCD / ƯCLN)
        gcd: function(a, b) {
            a = Math.round(Math.abs(Number(a) || 0));
            b = Math.round(Math.abs(Number(b) || 0));
            while (b) {
                let t = b;
                b = a % b;
                a = t;
            }
            return a || 1;
        },

        // Tìm bội chung nhỏ nhất (LCM / BCNN)
        lcm: function(a, b) {
            return Math.abs(a * b) / this.gcd(a, b);
        },

        // Bội chung nhỏ nhất của 3 số
        lcm3: function(a, b, c) {
            return this.lcm(this.lcm(a, b), c);
        },

        // Kiểm tra số nguyên tố
        isPrime: function(num) {
            if (num <= 1) return false;
            for (let i = 2; i * i <= num; i++) {
                if (num % i === 0) return false;
            }
            return true;
        },

        // Phân tích ra thừa số nguyên tố dạng KaTeX: 2^3 \cdot 3 \cdot 5
        factorize: function(n) {
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
        },

        // Lấy mảng thừa số nguyên tố
        getPrimeFactors: function(n) {
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
        },

        // Lấy danh sách các ước nguyên tố phân biệt
        getUniquePrimeFactors: function(n) {
            const factors = new Set();
            let temp = n;
            for (let i = 2; i <= temp; i++) {
                if (this.isPrime(i) && temp % i === 0) {
                    factors.add(i);
                    while (temp % i === 0) {
                        temp /= i;
                    }
                }
            }
            return Array.from(factors);
        },

        // Lấy danh sách tất cả các ước số của n
        getDivisors: function(n) {
            const divs = [];
            for (let i = 1; i <= n; i++) {
                if (n % i === 0) {
                    divs.push(i);
                }
            }
            return divs;
        },

        // Rút gọn phân số
        simplify: function(num, den) {
            const g = this.gcd(num, den);
            let sNum = num / g;
            let sDen = den / g;
            if (sDen < 0) {
                sNum = -sNum;
                sDen = -sDen;
            }
            return { num: sNum, den: sDen };
        },

        // Tổng các chữ số
        sumDigits: function(n) {
            let sum = 0;
            let temp = Math.abs(n);
            while (temp) {
                sum += temp % 10;
                temp = Math.floor(temp / 10);
            }
            return sum;
        },

        // Sinh số nguyên ngẫu nhiên trong khoảng [min, max]
        randomInt: function(min, max, excludeZero = false) {
            let val = Math.floor(Math.random() * (max - min + 1)) + min;
            if (excludeZero && val === 0) {
                return this.randomInt(min, max, excludeZero);
            }
            return val;
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Arithmetic;
    }
    if (typeof root !== 'undefined') {
        root.Arithmetic = Arithmetic;
    }
})(typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : self));
