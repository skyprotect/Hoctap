/**
 * Web Worker sinh câu hỏi trắc nghiệm từ template ngầm.
 * Giúp giải phóng UI Thread và giữ cho FPS ở mức 60.
 */

if (typeof importScripts === 'function') {
    try {
        if (typeof MathUtils === 'undefined') importScripts('core/math-utils.js');
        if (typeof ArrayUtils === 'undefined') importScripts('core/array-utils.js');
        if (typeof MathExprEvaluator === 'undefined') importScripts('core/math-expr-evaluator.js');
        if (typeof MathTemplateCompiler === 'undefined') importScripts('core/math-template-compiler.js');
    } catch (e) {
        // Fallback an toàn nếu môi trường không cho phép importScripts
    }
}
var MathUtils = (typeof globalThis !== 'undefined' && globalThis.MathUtils)
    || (typeof self !== 'undefined' && self.MathUtils)
    || (typeof require === 'function' ? require('./core/math-utils') : null);
var ArrayUtils = (typeof globalThis !== 'undefined' && globalThis.ArrayUtils)
    || (typeof self !== 'undefined' && self.ArrayUtils)
    || (typeof require === 'function' ? require('./core/array-utils') : null);
var MathExprEvaluator = (typeof globalThis !== 'undefined' && globalThis.MathExprEvaluator)
    || (typeof self !== 'undefined' && self.MathExprEvaluator)
    || (typeof require === 'function' ? require('./core/math-expr-evaluator') : null);
var MathTemplateCompiler = (typeof globalThis !== 'undefined' && globalThis.MathTemplateCompiler)
    || (typeof self !== 'undefined' && self.MathTemplateCompiler)
    || (typeof require === 'function' ? require('./core/math-template-compiler') : null);

const generator = {
    // Toán học thuần túy (Pure Math Utilities) - Ủy quyền sang mô-đun độc lập MathUtils
    gcd: (MathUtils && MathUtils.gcd) || function(a, b) {
        a = Math.round(Math.abs(Number(a) || 0));
        b = Math.round(Math.abs(Number(b) || 0));
        while (b) { let t = b; b = a % b; a = t; }
        return a || 1;
    },
    lcm: (MathUtils && MathUtils.lcm) || function(a, b) {
        return Math.abs(a * b) / (MathUtils ? MathUtils.gcd(a, b) : this.gcd(a, b));
    },
    factorize: (MathUtils && MathUtils.factorize) || function(n) {
        if (n <= 1) return n.toString();
        const factors = [];
        let temp = n;
        for (let i = 2; i <= Math.sqrt(n); i++) {
            let count = 0;
            while (temp % i === 0) { count++; temp /= i; }
            if (count > 0) factors.push(count === 1 ? `${i}` : `${i}^${count}`);
        }
        if (temp > 1) factors.push(`${temp}`);
        return factors.join(' \\cdot ');
    },
    isPrime: (MathUtils && MathUtils.isPrime) || function(num) {
        if (num <= 1) return false;
        for (let i = 2; i * i <= num; i++) {
            if (num % i === 0) return false;
        }
        return true;
    },
    getUniquePrimeFactors: (MathUtils && MathUtils.getUniquePrimeFactors) || function(n) {
        const factors = new Set();
        let temp = n;
        for (let i = 2; i <= temp; i++) {
            if ((MathUtils ? MathUtils.isPrime(i) : this.isPrime(i)) && temp % i === 0) {
                factors.add(i);
                while (temp % i === 0) temp /= i;
            }
        }
        return Array.from(factors);
    },
    findPrimeFactorPairs: (MathUtils && MathUtils.findPrimeFactorPairs) || function(n) {
        const isP = (x) => (MathUtils ? MathUtils.isPrime(x) : this.isPrime(x));
        const pairs = new Set();
        for (let p1 = 2; p1 * p1 <= n; p1++) {
            if (isP(p1) && n % p1 === 0) {
                let p2 = n / p1;
                if (isP(p2)) {
                    if (p1 <= p2) pairs.add(`${p1},${p2}`);
                    else pairs.add(`${p2},${p1}`);
                }
            }
        }
        if (isP(n)) pairs.add(`${n},1`);
        return Array.from(pairs);
    },
    lcm3: (MathUtils && MathUtils.lcm3) || function(a, b, c) {
        return MathUtils ? MathUtils.lcm3(a, b, c) : this.lcm(this.lcm(a, b), c);
    },
    sumDigits: (MathUtils && MathUtils.sumDigits) || function(n) {
        let sum = 0;
        let temp = Math.abs(n);
        while (temp) { sum += temp % 10; temp = Math.floor(temp / 10); }
        return sum;
    },
    simplify: (MathUtils && MathUtils.simplify) || function(num, den) {
        const g = (MathUtils ? MathUtils.gcd(num, den) : this.gcd(num, den));
        let sNum = num / g;
        let sDen = den / g;
        if (sDen < 0) { sNum = -sNum; sDen = -sDen; }
        return { num: sNum, den: sDen };
    },

    // Sinh số ngẫu nhiên trong khoảng [min, max] trừ số 0
    randomInt: (ArrayUtils && ArrayUtils.randomInt) || function(min, max, excludeZero = false) {
        let val = Math.floor(Math.random() * (max - min + 1)) + min;
        if (excludeZero && val === 0) {
            return this.randomInt(min, max, excludeZero);
        }
        return val;
    },

    // Tráo đổi ngẫu nhiên mảng
    shuffle: (ArrayUtils && ArrayUtils.shuffle) || function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },

    // Các hàm bổ trợ phân tích số học
    getPrimeFactors: (MathUtils && MathUtils.getPrimeFactors) || function(n) {
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

    getCommonPrimeFactors: (MathUtils && MathUtils.getCommonPrimeFactors) || function(a, b) {
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
    },

    getCommonPrimeFactors3: (MathUtils && MathUtils.getCommonPrimeFactors3) || function(a, b, c) {
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
    },

    getDivisors: (MathUtils && MathUtils.getDivisors) || function(n) {
        const divs = [];
        for (let i = 1; i <= n; i++) {
            if (n % i === 0) {
                divs.push(i);
            }
        }
        return divs;
    },

    // Hàm helper chống va chạm đáp án nhiễu trực tiếp
    SHIFT_IF_COLLIDE: (MathUtils && MathUtils.SHIFT_IF_COLLIDE) || function(val, ans, w1, w2) {
        if (val === undefined || val === null) return val;
        let isString = typeof val === 'string';
        let parsedVal = isString ? Number(val) : val;
        if (typeof parsedVal !== 'number' || isNaN(parsedVal)) return val;
        const toNum = (x) => (typeof x === 'string' ? Number(x) : x);
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
    },

    evalExpression: function(expr, context) {
        if (MathExprEvaluator && typeof MathExprEvaluator.evalExpression === 'function') {
            return MathExprEvaluator.evalExpression(expr, context);
        }
        return expr;
    },

    safeEval: function(expr, context) {
        if (MathExprEvaluator && typeof MathExprEvaluator.safeEval === 'function') {
            return MathExprEvaluator.safeEval(expr, context);
        }
        return null;
    },

    safeEvalTokens: function(tokens, ctx) {
        if (MathExprEvaluator && typeof MathExprEvaluator.safeEvalTokens === 'function') {
            return MathExprEvaluator.safeEvalTokens(tokens, ctx);
        }
        return null;
    },

    generateQuestionFromTemplate: function(tempQ, customMaxAttempts = 200) {
        if (MathTemplateCompiler && typeof MathTemplateCompiler.generateQuestionFromTemplate === 'function') {
            return MathTemplateCompiler.generateQuestionFromTemplate(tempQ, customMaxAttempts);
        }
        return tempQ;
    }
};

// Hàm helper loại bỏ các thuộc tính kiểu hàm và tham chiếu vòng để clone an toàn qua postMessage
function sanitizeForClone(obj) {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'function') return undefined;
    if (typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeForClone(item)).filter(item => item !== undefined);
    }
    
    const sanitized = {};
    for (const [key, val] of Object.entries(obj)) {
        if (key === 'this') continue;
        const cleaned = sanitizeForClone(val);
        if (cleaned !== undefined) {
            sanitized[key] = cleaned;
        }
    }
    return sanitized;
}

// Web Worker API listener
if (typeof self !== 'undefined') {
    self.onmessage = function(e) {
        const { questions, maxAttempts } = e.data;
        const finalAttempts = maxAttempts || 500; // Tăng giới hạn mặc định của Worker lên 500 lần thử
        const generatedQuestions = [];

        try {
            for (let i = 0; i < questions.length; i++) {
                const qTemp = questions[i];
                try {
                    const genQ = generator.generateQuestionFromTemplate(qTemp, finalAttempts);
                    genQ.isSpacedRepetition = false;
                    genQ.level = 'chat-luong-cao';
                    generatedQuestions.push(sanitizeForClone(genQ));
                } catch (err) {
                    // Đóng gói chi tiết lỗi kèm template câu hỏi cụ thể gây lỗi (đã làm sạch hàm)
                    if (typeof self.postMessage === 'function') {
                        self.postMessage({
                            status: 'error',
                            message: `Lỗi tại câu số ${i + 1}: ${err.message}`,
                            stack: err.stack,
                            failedQuestion: sanitizeForClone(qTemp),
                            failedIndex: i
                        });
                    }
                    return;
                }
            }
            if (typeof self.postMessage === 'function') {
                self.postMessage({ status: 'success', questions: generatedQuestions });
            }
        } catch (globalErr) {
            if (typeof self.postMessage === 'function') {
                self.postMessage({ status: 'error', message: globalErr.message, stack: globalErr.stack });
            }
        }
    };
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = generator;
}
