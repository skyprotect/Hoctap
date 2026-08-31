/**
 * math-expr-evaluator — Bộ phân tích cú pháp, tự sửa lỗi và đánh giá an toàn biểu thức toán học (Pure Math Expression Evaluator).
 * Hỗ trợ đánh giá 2 tầng (Tier 1 Sandbox + Tier 2 AST Safe Evaluator) với cơ chế Self-Healing.
 * Không phụ thuộc DOM, AppState, UI hay GameEngine; Không gây ô nhiễm đối tượng Math toàn cục.
 * Hỗ trợ UMD (Node.js CommonJS, Web Workers, Browser Global).
 * 
 * Public Contract:
 * - evalExpression(expr: string, context?: Record<string, any>): any
 * - safeEval(expr: string, context?: Record<string, any>): any
 * - safeEvalTokens(tokens: Array<{type: string, value: any}>, ctx?: Record<string, any>): any
 */
(function (root, factory) {
    const mathUtils = (typeof require === 'function' ? require('./math-utils') : null)
        || (root && root.MathUtils)
        || (typeof globalThis !== 'undefined' && globalThis.MathUtils)
        || (typeof window !== 'undefined' && window.MathUtils)
        || (typeof self !== 'undefined' && self.MathUtils)
        || {};
    const api = factory(mathUtils);
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.MathExprEvaluator = api;
    if (typeof window !== 'undefined') {
        window.MathExprEvaluator = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.MathExprEvaluator = api;
    }
    if (typeof self !== 'undefined') {
        self.MathExprEvaluator = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function (MathUtils) {
    'use strict';

    // Đảm bảo MathUtils có sẵn fallback an toàn nếu chưa được nạp
    const utils = {
        gcd: (MathUtils && MathUtils.gcd) || function (a, b) {
            a = Math.round(Math.abs(Number(a) || 0));
            b = Math.round(Math.abs(Number(b) || 0));
            while (b) { let t = b; b = a % b; a = t; }
            return a || 1;
        },
        lcm: (MathUtils && MathUtils.lcm) || function (a, b) {
            const g = (MathUtils && MathUtils.gcd) || utils.gcd;
            return Math.abs(a * b) / g(a, b);
        },
        lcm3: (MathUtils && MathUtils.lcm3) || function (a, b, c) {
            return (MathUtils && MathUtils.lcm3) ? MathUtils.lcm3(a, b, c) : utils.lcm(utils.lcm(a, b), c);
        },
        isPrime: (MathUtils && MathUtils.isPrime) || function (num) {
            if (num <= 1) return false;
            for (let i = 2; i * i <= num; i++) {
                if (num % i === 0) return false;
            }
            return true;
        },
        factorize: (MathUtils && MathUtils.factorize) || function (n) {
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
        getUniquePrimeFactors: (MathUtils && MathUtils.getUniquePrimeFactors) || function (n) {
            const factors = new Set();
            let temp = n;
            for (let i = 2; i <= temp; i++) {
                if (utils.isPrime(i) && temp % i === 0) {
                    factors.add(i);
                    while (temp % i === 0) temp /= i;
                }
            }
            return Array.from(factors);
        },
        findPrimeFactorPairs: (MathUtils && MathUtils.findPrimeFactorPairs) || function (n) {
            const pairs = new Set();
            for (let p1 = 2; p1 * p1 <= n; p1++) {
                if (utils.isPrime(p1) && n % p1 === 0) {
                    let p2 = n / p1;
                    if (utils.isPrime(p2)) {
                        if (p1 <= p2) pairs.add(`${p1},${p2}`);
                        else pairs.add(`${p2},${p1}`);
                    }
                }
            }
            if (utils.isPrime(n)) pairs.add(`${n},1`);
            return Array.from(pairs);
        },
        sumDigits: (MathUtils && MathUtils.sumDigits) || function (n) {
            let sum = 0;
            let temp = Math.abs(n);
            while (temp) { sum += temp % 10; temp = Math.floor(temp / 10); }
            return sum;
        },
        simplify: (MathUtils && MathUtils.simplify) || function (num, den) {
            const g = utils.gcd(num, den);
            let sNum = num / g;
            let sDen = den / g;
            if (sDen < 0) { sNum = -sNum; sDen = -sDen; }
            return { num: sNum, den: sDen };
        },
        getDivisors: (MathUtils && MathUtils.getDivisors) || function (n) {
            const divs = [];
            for (let i = 1; i <= n; i++) {
                if (n % i === 0) divs.push(i);
            }
            return divs;
        },
        SHIFT_IF_COLLIDE: (MathUtils && MathUtils.SHIFT_IF_COLLIDE) || function (val, ans, w1, w2) {
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
        }
    };

    /**
     * Tạo đối tượng Sandbox Math cục bộ kế thừa từ Math chuẩn để không gây ô nhiễm global Math.
     */
    function createSandboxMath() {
        const sandboxMath = Object.create(Math);
        sandboxMath.gcd = (a, b) => utils.gcd(a, b);
        sandboxMath.lcm = (a, b) => utils.lcm(a, b);
        sandboxMath.isPrime = (n) => utils.isPrime(n);
        sandboxMath.sumDigits = (n) => utils.sumDigits(n);
        return sandboxMath;
    }

    /**
     * Hàm helper để làm tròn số thực phòng ngừa sai số floating-point IEEE-754.
     */
    function roundFloat(val) {
        if (typeof val === 'number' && !Number.isInteger(val)) {
            const str = val.toString();
            if (str.includes('000000') || str.includes('999999')) {
                val = Math.round(val * 100000) / 100000;
            }
            if (Math.abs(val - Math.round(val)) < 1e-9) {
                val = Math.round(val);
            }
        }
        return val;
    }

    /**
     * Đánh giá an toàn biểu thức toán học dạng chuỗi kèm context biến.
     * Tự động áp dụng Self-Healing và fallback sang safeEval nếu new Function bị lỗi.
     * 
     * @param {string} expr - Biểu thức cần đánh giá
     * @param {Record<string, any>} [context={}] - Ngữ cảnh biến
     * @returns {any} Kết quả biểu thức
     */
    function evalExpression(expr, context) {
        if (typeof expr !== 'string') {
            return expr;
        }

        // Self-healing: Loại bỏ dấu $ đứng trước ngoặc nhọn của các biến (ví dụ ${A} thành {A})
        let cleanedExpr = expr.replace(/\$\{([a-zA-Z0-9_]+)\}/g, '{$1}');
        // Self-healing: Loại bỏ tiền tố variables. và formulas. và this. thường bị AI sinh nhầm
        cleanedExpr = cleanedExpr.replace(/\b(variables|formulas|this)\./g, '');
        // Self-healing: Loại bỏ dấu ngoặc nhọn quanh các tên biến đơn giản trong công thức
        cleanedExpr = cleanedExpr.replace(/\{([a-zA-Z0-9_]+)\}/g, '$1');

        // Self-healing: Thay thế hàm gcd đệ quy cục bộ của AI bằng hàm gcd an toàn của hệ thống
        cleanedExpr = cleanedExpr.replace(/\(function\s+gcd\s*\([^)]*\)\s*\{\s*return\s+[^}]*\}\)/g, 'gcd');

        // Self-healing: thay thế .values().join(...) thành Array.from(...).join(...)
        cleanedExpr = cleanedExpr.replace(/([a-zA-Z0-9_$]+)\.values\(\)\.join\(/g, 'Array.from($1.values()).join(');

        // Self-healing: thay thế vòng lặp tìm ước thành getDivisors
        cleanedExpr = cleanedExpr.replace(/\(\(\)\s*=>\s*\{\s*let\s+(\w+)\s*=\s*\[\]\s*;\s*for\s*\(\s*let\s+(\w+)\s*=\s*1\s*;\s*\2\s*<=\s*([a-zA-Z0-9_$]+)\s*;\s*\2\+\+\s*\)\s*\{\s*if\s*\(\s*\3\s*%\s*\2\s*===\s*0\s*\)\s*\1\.push\(\2\)\s*;\s*\}\s*return\s*\1\s*;\s*\}\)\(\)/g, 'getDivisors($3)');

        let trimmed = cleanedExpr.trim();
        // Phòng thủ: Phát hiện các từ đơn hoặc cụm từ tiếng Việt thuần túy không bọc nháy do AI sinh lỗi
        const isPlainWord = /^[a-zA-Z0-9đàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ\s\.\,\_]+$/i.test(trimmed) && !/\b[a-zA-Z_$][a-zA-Z0-9_$]*\.[a-zA-Z_$][a-zA-Z0-9_$]*\b/.test(trimmed);
        if (isPlainWord) {
            // Nếu không phải là số và không trùng với bất kỳ tên biến hay helper
            const isNumber = !isNaN(Number(trimmed));
            const hasKey = context ? (trimmed in context) : false;
            const helpersKeys = ['Math', 'parseInt', 'parseFloat', 'isNaN', 'gcd', 'lcm', 'ƯCLN', 'BCNN', 'ucln', 'bcnn', 'isPrime', 'getUniquePrimeFactors', 'findPrimeFactorPairs', 'simplify', 'getDivisors', 'lcm3', 'sumDigits', 'SHIFT_IF_COLLIDE', 'true', 'false', 'null', 'undefined'];
            if (!isNumber && !hasKey && !helpersKeys.includes(trimmed)) {
                return trimmed; // Trả về trực tiếp chuỗi chữ!
            }
        }

        // Nếu biểu thức bắt đầu bằng function và kết thúc bằng ) (IIFE ẩn danh bị thiếu ngoặc)
        if (trimmed.startsWith('function') && trimmed.endsWith(')')) {
            cleanedExpr = '(' + cleanedExpr + ')';
        }

        // Loại bỏ dấu chấm phẩy ở cuối để tránh lỗi cú pháp khi bọc trong biểu thức trả về
        cleanedExpr = cleanedExpr.trim();
        if (cleanedExpr.endsWith(';')) {
            cleanedExpr = cleanedExpr.slice(0, -1).trim();
        }

        try {
            // Sử dụng Object.create để tránh kích hoạt sớm các Getter trong context
            const ctx = Object.create(context || {});
            const sandboxMath = createSandboxMath();

            const helpers = {
                this: context,
                Math: sandboxMath,
                parseInt: parseInt,
                parseFloat: parseFloat,
                isNaN: isNaN,
                abs: (n) => Math.abs(n),
                gcd: (a, b) => utils.gcd(a, b),
                lcm: (a, b) => utils.lcm(a, b),
                ƯCLN: (a, b) => utils.gcd(a, b),
                BCNN: (a, b) => utils.lcm(a, b),
                ucln: (a, b) => utils.gcd(a, b),
                bcnn: (a, b) => utils.lcm(a, b),
                isPrime: (n) => utils.isPrime(n),
                getUniquePrimeFactors: (n) => utils.getUniquePrimeFactors(n),
                findPrimeFactorPairs: (n) => utils.findPrimeFactorPairs(n),
                simplify: (num, den) => utils.simplify(num, den),
                getDivisors: (n) => utils.getDivisors(n),
                lcm3: (a, b, c) => utils.lcm3(a, b, c),
                sumDigits: (n) => utils.sumDigits(n),
                SHIFT_IF_COLLIDE: (val, ans, w1, w2) => utils.SHIFT_IF_COLLIDE(val, ans, w1, w2)
            };

            for (const [key, val] of Object.entries(helpers)) {
                Object.defineProperty(ctx, key, {
                    value: val,
                    writable: true,
                    configurable: true,
                    enumerable: true
                });
            }
            
            // Biên dịch và chạy biểu thức trong khối with(ctx)
            const fn = new Function('ctx', `with(ctx) { return (${cleanedExpr}); }`);
            const res = fn(ctx);
            return roundFloat(res);
        } catch (e) {
            // Fallback sang safeEval nếu new Function gặp lỗi cú pháp (ví dụ: bị chặn bởi CSP)
            try {
                const res = safeEval(cleanedExpr, context);
                return roundFloat(res);
            } catch (err) {
                console.error("Error evaluating expression:", expr, e);
                return null;
            }
        }
    }

    /**
     * Đánh giá biểu thức toán học an toàn qua Tokenizer & AST Recursive Descent Parser.
     * 
     * @param {string} expr - Biểu thức cần đánh giá
     * @param {Record<string, any>} [context={}] - Ngữ cảnh biến
     * @returns {any} Kết quả biểu thức
     */
    function safeEval(expr, context) {
        const ctx = Object.create(context || {});
        const sandboxMath = createSandboxMath();

        const helpers = {
            Math: sandboxMath,
            parseInt: parseInt,
            parseFloat: parseFloat,
            isNaN: isNaN,
            this: ctx,
            true: true,
            false: false,
            null: null,
            undefined: undefined,
            abs: (n) => Math.abs(n),
            gcd: (a, b) => utils.gcd(a, b),
            lcm: (a, b) => utils.lcm(a, b),
            ƯCLN: (a, b) => utils.gcd(a, b),
            BCNN: (a, b) => utils.lcm(a, b),
            ucln: (a, b) => utils.gcd(a, b),
            bcnn: (a, b) => utils.lcm(a, b),
            isPrime: (n) => utils.isPrime(n),
            getUniquePrimeFactors: (n) => utils.getUniquePrimeFactors(n),
            findPrimeFactorPairs: (n) => utils.findPrimeFactorPairs(n),
            simplify: (num, den) => utils.simplify(num, den),
            getDivisors: (n) => utils.getDivisors(n),
            lcm3: (a, b, c) => utils.lcm3(a, b, c),
            sumDigits: (n) => utils.sumDigits(n),
            SHIFT_IF_COLLIDE: (val, ans, w1, w2) => utils.SHIFT_IF_COLLIDE(val, ans, w1, w2)
        };

        for (const [key, val] of Object.entries(helpers)) {
            Object.defineProperty(ctx, key, {
                value: val,
                writable: true,
                configurable: true,
                enumerable: true
            });
        }

        // Tokenizer
        const tokens = [];
        const regex = /\s*(?:(\d+(?:\.\d+)?)|([a-zA-Z_$][a-zA-Z0-9_$]*)|(===|!==|==|!=|<=|>=|<|>|&&|\|\||\.\.\.|=>|[\+\-\*\/%\(\)\,\!\?\:\[\]\{\}\;\=\.])|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"))/g;
        let match;
        while ((match = regex.exec(expr)) !== null) {
            if (match[1] !== undefined) {
                tokens.push({ type: 'NUMBER', value: parseFloat(match[1]) });
            } else if (match[2] !== undefined) {
                tokens.push({ type: 'IDENTIFIER', value: match[2] });
            } else if (match[3] !== undefined) {
                tokens.push({ type: 'OPERATOR', value: match[3] });
            } else if (match[4] !== undefined) {
                tokens.push({ type: 'STRING', value: match[4].slice(1, -1) });
            }
        }

        let tokenIdx = 0;
        function peek() {
            return tokens[tokenIdx];
        }
        function consume(expectedValue) {
            const tok = tokens[tokenIdx];
            if (!tok) {
                throw new Error("Unexpected end of expression");
            }
            if (expectedValue !== undefined && tok.value !== expectedValue) {
                throw new Error("Expected token " + expectedValue + " but got " + tok.value);
            }
            tokenIdx++;
            return tok;
        }

        // Đánh giá danh sách các token con (cho filter hoặc sub-scope)
        function evalSubTokens(subToks, subCtx) {
            return safeEvalTokens(subToks, subCtx);
        }

        // Xử lý IIFE: (() => { statements })()
        const first = tokens[0];
        const second = tokens[1];
        if (first && first.value === '(' && second && second.value === '(') {
            let isIIFE = false;
            let arrowIdx = -1;
            for (let i = 0; i < tokens.length; i++) {
                if (tokens[i].value === '=>') {
                    isIIFE = true;
                    arrowIdx = i;
                    break;
                }
            }

            if (isIIFE) {
                // Parse IIFE
                tokenIdx = arrowIdx + 1; // Nhảy qua '=>'
                consume('{');
                
                const localScope = Object.create(ctx);
                let result = null;
                
                // Đọc các câu lệnh phân tách bằng dấu chấm phẩy
                while (peek() && peek().value !== '}') {
                    const next = peek();
                    if (next.type === 'IDENTIFIER' && (next.value === 'const' || next.value === 'let' || next.value === 'var')) {
                        consume(); // const/let/var
                        const varName = consume().value;
                        consume('=');
                        
                        // Lấy các token biểu thức cho tới khi gặp ';'
                        const exprToks = [];
                        while (peek() && peek().value !== ';') {
                            exprToks.push(consume());
                        }
                        if (peek() && peek().value === ';') consume(';');
                        
                        localScope[varName] = evalSubTokens(exprToks, localScope);
                    } else if (next.type === 'IDENTIFIER' && next.value === 'return') {
                        consume('return');
                        const exprToks = [];
                        // Lấy các token cho tới khi gặp ';' hoặc kết thúc khối '}'
                        while (peek() && peek().value !== ';' && peek().value !== '}') {
                            exprToks.push(consume());
                        }
                        if (peek() && peek().value === ';') consume(';');
                        result = evalSubTokens(exprToks, localScope);
                    } else {
                        // Bỏ qua các token không hợp lệ khác
                        consume();
                    }
                }
                return result;
            }
        }

        return safeEvalTokens(tokens, ctx);
    }

    /**
     * Đánh giá mảng tokens đã phân tách theo ngữ pháp ưu tiên toán tử (Recursive Descent Parser).
     * 
     * @param {Array<{type: string, value: any}>} tokens - Danh sách tokens
     * @param {Record<string, any>} ctx - Ngữ cảnh biến và helpers
     * @returns {any} Giá trị tính toán
     */
    function safeEvalTokens(tokens, ctx) {
        let tokenIdx = 0;

        function peek() {
            return tokens[tokenIdx];
        }
        function consume(expectedValue) {
            const tok = tokens[tokenIdx];
            if (!tok) {
                throw new Error("Unexpected end of expression");
            }
            if (expectedValue !== undefined && tok.value !== expectedValue) {
                throw new Error("Expected token " + expectedValue + " but got " + tok.value);
            }
            tokenIdx++;
            return tok;
        }

        function parseTernary(skip) {
            let left = parseLogicalOr(skip);
            const tok = peek();
            if (tok && tok.type === 'OPERATOR' && tok.value === '?') {
                consume('?');
                let middle = parseTernary(skip || !left);
                consume(':');
                let right = parseTernary(skip || !!left);
                return skip ? null : (left ? middle : right);
            }
            return skip ? null : left;
        }

        function parseLogicalOr(skip) {
            let left = parseLogicalAnd(skip);
            let tok = peek();
            while (tok && tok.type === 'OPERATOR' && tok.value === '||') {
                consume('||');
                let right = parseLogicalAnd(skip || !!left);
                if (!skip) left = left || right;
                tok = peek();
            }
            return left;
        }

        function parseLogicalAnd(skip) {
            let left = parseEquality(skip);
            let tok = peek();
            while (tok && tok.type === 'OPERATOR' && tok.value === '&&') {
                consume('&&');
                let right = parseEquality(skip || !left);
                if (!skip) left = left && right;
                tok = peek();
            }
            return left;
        }

        function parseEquality(skip) {
            let left = parseRelational(skip);
            let tok = peek();
            while (tok && tok.type === 'OPERATOR' && (tok.value === '===' || tok.value === '!==' || tok.value === '==' || tok.value === '!=')) {
                const op = consume().value;
                let right = parseRelational(skip);
                if (!skip) {
                    if (op === '===') left = left === right;
                    else if (op === '!==') left = left !== right;
                    else if (op === '==') left = left == right;
                    else if (op === '!=') left = left != right;
                }
                tok = peek();
            }
            return left;
        }

        function parseRelational(skip) {
            let left = parseAdditive(skip);
            let tok = peek();
            while (tok && tok.type === 'OPERATOR' && (tok.value === '<' || tok.value === '>' || tok.value === '<=' || tok.value === '>=')) {
                const op = consume().value;
                let right = parseAdditive(skip);
                if (!skip) {
                    if (op === '<') left = left < right;
                    else if (op === '>') left = left > right;
                    else if (op === '<=') left = left <= right;
                    else if (op === '>=') left = left >= right;
                }
                tok = peek();
            }
            return left;
        }

        function parseAdditive(skip) {
            let left = parseMultiplicative(skip);
            let tok = peek();
            while (tok && tok.type === 'OPERATOR' && (tok.value === '+' || tok.value === '-')) {
                const op = consume().value;
                let right = parseMultiplicative(skip);
                if (!skip) {
                    if (op === '+') left = left + right;
                    else if (op === '-') left = left - right;
                }
                tok = peek();
            }
            return left;
        }

        function parseMultiplicative(skip) {
            let left = parseUnary(skip);
            let tok = peek();
            while (tok && tok.type === 'OPERATOR' && (tok.value === '*' || tok.value === '/' || tok.value === '%')) {
                const op = consume().value;
                let right = parseUnary(skip);
                if (!skip) {
                    if (op === '*') left = left * Math.round(right * 1000000) / 1000000;
                    else if (op === '/') {
                        if (right === 0) {
                            throw new Error("Division by zero");
                        }
                        left = left / right;
                    }
                    else if (op === '%') {
                        if (right === 0) {
                            throw new Error("Modulo by zero");
                        }
                        left = left % right;
                    }
                }
                tok = peek();
            }
            return left;
        }

        function parseUnary(skip) {
            let tok = peek();
            if (tok && tok.type === 'OPERATOR' && (tok.value === '-' || tok.value === '!')) {
                const op = consume().value;
                let right = parseUnary(skip);
                if (skip) return 0;
                if (op === '-') return -right;
                if (op === '!') return !right;
            }
            return parsePrimary(skip);
        }

        function parsePrimary(skip) {
            let tok = consume();
            if (tok.type === 'NUMBER' || tok.type === 'STRING') {
                return skip ? 0 : tok.value;
            }

            if (tok.type === 'IDENTIFIER') {
                const name = tok.value;
                let val;
                let hasResolved = false;

                if (name === 'true') {
                    val = true;
                    hasResolved = true;
                } else if (name === 'false') {
                    val = false;
                    hasResolved = true;
                } else if (name === 'null') {
                    val = null;
                    hasResolved = true;
                } else if (name === 'undefined') {
                    val = undefined;
                    hasResolved = true;
                } else if (name === 'new') {
                    const className = consume().value;
                    consume('(');
                    const args = [];
                    if (peek().value !== ')') {
                        args.push(parseTernary(skip));
                        while (peek() && peek().value === ',') {
                            consume(',');
                            args.push(parseTernary(skip));
                        }
                    }
                    consume(')');
                    hasResolved = true;
                    if (!skip) {
                        if (className === 'Set') {
                            val = new Set(...args);
                        } else if (className === 'Map') {
                            val = new Map(...args);
                        } else {
                            throw new Error("Unsupported class for new operator: " + className);
                        }
                    }
                } else if (name === 'Array') {
                    // Hỗ trợ Array.from(...)
                    consume('.');
                    const methodName = consume().value;
                    consume('(');
                    const args = [];
                    if (peek().value !== ')') {
                        args.push(parseTernary(skip));
                        while (peek() && peek().value === ',') {
                            consume(',');
                            args.push(parseTernary(skip));
                        }
                    }
                    consume(')');
                    hasResolved = true;
                    if (!skip) {
                        if (methodName === 'from') {
                            val = Array.from(...args);
                        } else {
                            throw new Error("Unsupported Array method: " + methodName);
                        }
                    }
                } else if (name === 'Math') {
                    consume('.');
                    const methodName = consume().value;
                    consume('(');
                    const args = [];
                    if (peek().value !== ')') {
                        let isSpread = false;
                        if (peek().value === '...') {
                            consume('...');
                            isSpread = true;
                        }
                        const argVal = parseTernary(skip);
                        if (!skip) {
                            if (isSpread && Array.isArray(argVal)) {
                                args.push(...argVal);
                            } else {
                                args.push(argVal);
                            }
                        }

                        while (peek() && peek().value === ',') {
                            consume(',');
                            let isInnerSpread = false;
                            if (peek().value === '...') {
                                consume('...');
                                isInnerSpread = true;
                            }
                            const innerArgVal = parseTernary(skip);
                            if (!skip) {
                                if (isInnerSpread && Array.isArray(innerArgVal)) {
                                    args.push(...innerArgVal);
                                } else {
                                    args.push(innerArgVal);
                                }
                            }
                        }
                    }
                    consume(')');
                    hasResolved = true;
                    if (!skip) {
                        const mathTarget = (ctx && ctx.Math) || createSandboxMath();
                        if (typeof mathTarget[methodName] === 'function') {
                            val = mathTarget[methodName].apply(null, args);
                        } else if (typeof Math[methodName] === 'function') {
                            val = Math[methodName].apply(null, args);
                        } else {
                            throw new Error("Math method " + methodName + " is not a function");
                        }
                    }
                } else if (peek() && peek().value === '(') {
                    // Gọi hàm helper trực tiếp
                    consume('(');
                    const args = [];
                    if (peek().value !== ')') {
                        args.push(parseTernary(skip));
                        while (peek() && peek().value === ',') {
                            consume(',');
                            args.push(parseTernary(skip));
                        }
                    }
                    consume(')');
                    hasResolved = true;
                    if (!skip) {
                        if (typeof ctx[name] === 'function') {
                            val = ctx[name].apply(ctx, args);
                        } else if (typeof utils[name] === 'function') {
                            val = utils[name].apply(utils, args);
                        } else {
                            throw new Error("Function " + name + " is not defined");
                        }
                    }
                }

                if (!hasResolved) {
                    val = ctx[name];
                }

                // Vòng lặp phân tích chuỗi thuộc tính hoặc phương thức liên tiếp (ví dụ: a.b.c hoặc a.filter(...).length)
                while (peek() && (peek().value === '.' || peek().value === '[')) {
                    if (peek().value === '.') {
                        consume('.');
                        const prop = consume().value;
                        if (skip) continue;

                        if (prop === 'filter' && peek() && peek().value === '(') {
                            consume('(');
                            const paramTok = consume(); // x
                            consume('=>');
                            
                            const filterTokens = [];
                            let parenCount = 1;
                            while (parenCount > 0) {
                                const t = consume();
                                if (t.value === '(') parenCount++;
                                if (t.value === ')') parenCount--;
                                if (parenCount > 0) filterTokens.push(t);
                            }

                            if (Array.isArray(val)) {
                                val = val.filter(item => {
                                    const subCtx = Object.create(ctx);
                                    subCtx[paramTok.value] = item;
                                    return safeEvalTokens(filterTokens, subCtx);
                                });
                            }
                        } else if (val !== undefined && val !== null && typeof val === 'object' && prop in val) {
                            if (peek() && peek().value === '(') {
                                consume('(');
                                const args = [];
                                if (peek().value !== ')') {
                                    args.push(parseTernary(skip));
                                    while (peek() && peek().value === ',') {
                                        consume(',');
                                        args.push(parseTernary(skip));
                                    }
                                }
                                consume(')');
                                if (!skip) {
                                    if (typeof val[prop] === 'function') {
                                        val = val[prop].apply(val, args);
                                    } else {
                                        throw new Error(prop + " is not a function on object");
                                    }
                                }
                            } else {
                                if (!skip) {
                                    val = val[prop];
                                }
                            }
                        } else if (val && prop === 'length' && Array.isArray(val)) {
                            val = val.length;
                        } else {
                            val = undefined;
                        }
                    } else if (peek().value === '[') {
                        consume('[');
                        const indexVal = parseTernary(skip);
                        consume(']');
                        if (!skip && val !== undefined && val !== null) {
                            val = val[indexVal];
                        }
                    }
                }

                return skip ? 0 : val;
            }

            if (tok.type === 'OPERATOR' && tok.value === '(') {
                let val = parseTernary(skip);
                consume(')');
                return val;
            }

            if (tok.type === 'OPERATOR' && tok.value === '[') {
                const arr = [];
                if (peek().value !== ']') {
                    arr.push(parseTernary(skip));
                    while (peek() && peek().value === ',') {
                        consume(',');
                        arr.push(parseTernary(skip));
                    }
                }
                consume(']');
                return skip ? [] : arr;
            }

            throw new Error("Unexpected token: " + tok.value);
        }

        return parseTernary(false);
    }

    const MathExprEvaluator = {
        evalExpression: evalExpression,
        safeEval: safeEval,
        safeEvalTokens: safeEvalTokens
    };

    return MathExprEvaluator;
});
