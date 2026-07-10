/**
 * Web Worker sinh câu hỏi trắc nghiệm từ template ngầm.
 * Giúp giải phóng UI Thread và giữ cho FPS ở mức 60.
 */

const generator = {
    // Tìm ƯCLN
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

    // Tìm BCNN
    lcm: function(a, b) {
        return Math.abs(a * b) / this.gcd(a, b);
    },

    // Phân tích ra thừa số nguyên tố
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

    // Kiểm tra số nguyên tố
    isPrime: function(num) {
        if (num <= 1) return false;
        for (let i = 2; i * i <= num; i++) {
            if (num % i === 0) return false;
        }
        return true;
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

    // Tìm các cặp ước nguyên tố
    findPrimeFactorPairs: function(n) {
        const pairs = new Set();
        for (let p1 = 2; p1 * p1 <= n; p1++) {
            if (this.isPrime(p1) && n % p1 === 0) {
                let p2 = n / p1;
                if (this.isPrime(p2)) {
                    if (p1 <= p2) {
                        pairs.add(`${p1},${p2}`);
                    } else {
                        pairs.add(`${p2},${p1}`);
                    }
                }
            }
        }
        if (this.isPrime(n)) {
            pairs.add(`${n},1`);
        }
        return Array.from(pairs);
    },

    // Bội chung nhỏ nhất của 3 số
    lcm3: function(a, b, c) {
        return this.lcm(this.lcm(a, b), c);
    },

    // Tổng các chữ số của một số
    sumDigits: function(n) {
        let sum = 0;
        let temp = Math.abs(n);
        while (temp) {
            sum += temp % 10;
            temp = Math.floor(temp / 10);
        }
        return sum;
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

    // Sinh số ngẫu nhiên trong khoảng [min, max] trừ số 0
    randomInt: function(min, max, excludeZero = false) {
        let val = Math.floor(Math.random() * (max - min + 1)) + min;
        if (excludeZero && val === 0) {
            return this.randomInt(min, max, excludeZero);
        }
        return val;
    },

    // Tráo đổi ngẫu nhiên mảng
    shuffle: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },

    // Các hàm bổ trợ phân tích số học
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

    getCommonPrimeFactors: function(a, b) {
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

    getCommonPrimeFactors3: function(a, b, c) {
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

    getDivisors: function(n) {
        const divs = [];
        for (let i = 1; i <= n; i++) {
            if (n % i === 0) {
                divs.push(i);
            }
        }
        return divs;
    },

    // Hàm helper chống va chạm đáp án nhiễu trực tiếp
    SHIFT_IF_COLLIDE: function(val, ans, w1, w2) {
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
    },

    evalExpression: function(expr, context) {
        if (typeof expr !== 'string') {
            return expr;
        }

        const self = this;

        // Self-healing: Loại bỏ tiền tố variables. và formulas. và this. thường bị AI sinh nhầm
        let cleanedExpr = expr.replace(/\b(variables|formulas|this)\./g, '');
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
        const isPlainWord = /^[a-zA-Z0-9đàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ\s\.\,\_]+$/i.test(trimmed);
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

        // Hàm helper để làm tròn số thực phòng ngừa sai số floating-point
        const roundFloat = (val) => {
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
        };

        try {
            // Sử dụng Object.create để tránh kích hoạt sớm các Getter trong context
            const ctx = Object.create(context || {});
            // Định nghĩa các helper toán học trực tiếp trên ctx che đi prototype
            const helpers = {
                this: context,
                Math: Math,
                parseInt: parseInt,
                parseFloat: parseFloat,
                isNaN: isNaN,
                gcd: (a, b) => self.gcd(a, b),
                lcm: (a, b) => self.lcm(a, b),
                ƯCLN: (a, b) => self.gcd(a, b),
                BCNN: (a, b) => self.lcm(a, b),
                ucln: (a, b) => self.gcd(a, b),
                bcnn: (a, b) => self.lcm(a, b),
                isPrime: (n) => self.isPrime(n),
                getUniquePrimeFactors: (n) => self.getUniquePrimeFactors(n),
                findPrimeFactorPairs: (n) => self.findPrimeFactorPairs(n),
                simplify: (num, den) => self.simplify(num, den),
                getDivisors: (n) => self.getDivisors(n),
                lcm3: (a, b, c) => self.lcm3(a, b, c),
                sumDigits: (n) => self.sumDigits(n),
                SHIFT_IF_COLLIDE: (val, ans, w1, w2) => self.SHIFT_IF_COLLIDE(val, ans, w1, w2)
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
                const res = this.safeEval(cleanedExpr, context);
                return roundFloat(res);
            } catch (err) {
                console.error("Error evaluating expression:", expr, e);
                return null;
            }
        }
    },

    safeEval: function(expr, context) {
        const self = this;
        // Sử dụng prototypal inheritance thay cho spread để tránh trigger trước các getter
        const ctx = Object.create(context);
        const helpers = {
            Math: Math,
            parseInt: parseInt,
            parseFloat: parseFloat,
            isNaN: isNaN,
            this: ctx
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
        // Fixed regex: bổ sung toán tử so sánh '<' và '>' vốn bị thiếu ở bản cũ
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
            const res = self.safeEvalTokens(subToks, subCtx);
            return res;
        }

        // Xử lý IIFE: (() => { statements })()
        const first = tokens[0];
        const second = tokens[1];
        if (first && first.value === '(' && second && second.value === '(') {
            // Kiểm tra xem có phải cấu trúc IIFE: (() => { ... })()
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

        return this.safeEvalTokens(tokens, ctx);
    },

    safeEvalTokens: function(tokens, ctx) {
        let tokenIdx = 0;
        const self = this;

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

        // parseRelational, parseAdditive, parseMultiplicative, parseUnary, parsePrimary...
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

                // Xử lý từ khóa new
                if (name === 'new') {
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
                        if (typeof Math[methodName] !== 'function') {
                            throw new Error("Math method " + methodName + " is not a function");
                        }
                        val = Math[methodName].apply(null, args);
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
                        } else if (typeof self[name] === 'function') {
                            val = self[name].apply(self, args);
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
                                    return self.safeEvalTokens(filterTokens, subCtx);
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
    },

    generateQuestionFromTemplate: function(tempQ, customMaxAttempts = 200) {
        if (!tempQ || !tempQ.isTemplate) return tempQ;
        
        let context = {};
        let attempts = 0;
        const maxAttempts = customMaxAttempts;
        let constraintsPassed = false;
        
        const self = this;
        // Hàm helper để thay thế các placeholder {varName} hoặc {formulaName} hoặc biểu thức dynamic
        function replacePlaceholders(str, localContext) {
            if (typeof str !== 'string') return str;
            let prev;
            let limit = 5;
            do {
                prev = str;
                
                // Bảo vệ LaTeX trước khi xử lý placeholder
                // 1. Phân số \frac{a}{b}
                str = str.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, (match, num, den) => {
                    const trimNum = num.trim();
                    const trimDen = den.trim();
                    const numVal = localContext.hasOwnProperty(trimNum) ? localContext[trimNum] : trimNum;
                    const denVal = localContext.hasOwnProperty(trimDen) ? localContext[trimDen] : trimDen;
                    return `\\frac__LTX_OPEN__${numVal}__LTX_CLOSE____LTX_OPEN__${denVal}__LTX_CLOSE__`;
                });
                
                // 2. Lũy thừa a^{b}
                str = str.replace(/([a-zA-Z0-9_\$]+)\^\{([^{}]+)\}/g, (match, base, exp) => {
                    const trimmed = exp.trim();
                    const expVal = localContext.hasOwnProperty(trimmed) ? localContext[trimmed] : trimmed;
                    return `${base}^__LTX_OPEN__${expVal}__LTX_CLOSE__`;
                });
                
                // 3. Các lệnh LaTeX khác dạng \cmd{args} (như \widehat, \vec, \overline, \text...)
                str = str.replace(/(\\[a-zA-Z]+)\{([^{}]+)\}/g, (match, cmd, content) => {
                    const trimmed = content.trim();
                    const contentVal = localContext.hasOwnProperty(trimmed) ? localContext[trimmed] : trimmed;
                    return `${cmd}__LTX_OPEN__${contentVal}__LTX_CLOSE__`;
                });

                // Self-healing: loại bỏ dấu $ dư thừa trước và sau các placeholder dạng ${varName}$ hoặc ${varName}
                str = str.replace(/\$\{([^{}]+)\}\$/g, '{$1}');
                str = str.replace(/\$\{([^{}]+)\}/g, '{$1}');

                // Xử lý các placeholder thực sự
                str = str.replace(/\{([^{}]+)\}/g, (match, p1) => {
                    const trimmed = p1.trim();
                    if (localContext.hasOwnProperty(trimmed)) {
                        const val = localContext[trimmed];
                        if (typeof val !== 'function') {
                            return val;
                        }
                    }
                    
                    // Lọc bỏ LaTeX và văn bản tiếng Việt để tránh eval lỗi
                    if (/[$\\#^[\]~]/.test(trimmed) || trimmed.includes('\\') || (/[a-zA-Z]/.test(trimmed) && /[đàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/i.test(trimmed) && !trimmed.includes('ƯCLN') && !trimmed.includes('BCNN') && !trimmed.includes('ucln') && !trimmed.includes('bcnn'))) {
                        return match;
                    }

                    // Chỉ eval nếu biểu thức có tham chiếu đến ít nhất một biến trong context
                    const words = trimmed.match(/[a-zA-Z_][a-zA-Z0-9_]*/g);
                    const hasVar = words && words.some(w => localContext.hasOwnProperty(w));
                    if (!hasVar) {
                        return match;
                    }

                    // Thử eval biểu thức động
                    try {
                        const evalResult = self.evalExpression(trimmed, localContext);
                        if (evalResult !== null && evalResult !== undefined && typeof evalResult !== 'function') {
                            return evalResult;
                        }
                    } catch (e) {}
                    return match;
                });

                // Khôi phục lại ngoặc nhọn của LaTeX
                str = str.replace(/__LTX_OPEN__/g, '{').replace(/__LTX_CLOSE__/g, '}');
                // Dọn dẹp dấu ngoặc nhọn thừa bao quanh các chữ cái in hoa (tên điểm, đoạn thẳng, góc hình học)
                str = str.replace(/\{([A-Z]+)\}/g, '$1');
                
                limit--;
            } while (str !== prev && limit > 0);
            return str;
        }

        while (!constraintsPassed && attempts < maxAttempts) {
            attempts++;
            context = {};
            
            // 1. Sinh ngẫu nhiên các biến
            if (tempQ.variables) {
                for (const [varName, varDef] of Object.entries(tempQ.variables)) {
                    if (varDef && varDef.hasOwnProperty('fixed')) {
                        context[varName] = varDef.fixed;
                        continue;
                    }
                    if (varDef && varDef.hasOwnProperty('value')) {
                        context[varName] = varDef.value;
                        continue;
                    }
                    if (varDef && varDef.hasOwnProperty('options') && Array.isArray(varDef.options)) {
                        const idx = Math.floor(Math.random() * varDef.options.length);
                        context[varName] = varDef.options[idx];
                        continue;
                    }
                    const min = varDef.min !== undefined ? varDef.min : 0;
                    const max = varDef.max !== undefined ? varDef.max : 0;
                    const step = varDef.step || 1;
                    
                    const stepsCount = Math.floor((max - min) / step);
                    const randomStep = Math.floor(Math.random() * (stepsCount + 1));
                    const val = min + randomStep * step;
                    context[varName] = val;
                }
            }
            
            // 2. Định nghĩa các công thức dưới dạng Getter động để giải quyết triệt để lỗi thứ tự khai báo
            if (tempQ.formulas) {
                for (const [formName, formExpr] of Object.entries(tempQ.formulas)) {
                    Object.defineProperty(context, formName, {
                        get: function() {
                            if (('_cache_' + formName) in this) {
                                return this['_cache_' + formName];
                            }
                            this['_cache_' + formName] = null;
                            const res = self.evalExpression(formExpr, this);
                            this['_cache_' + formName] = res;
                            return res;
                        },
                        configurable: true,
                        enumerable: true
                    });
                }
            }

            // Tự động phân tích các constraints dạng đẳng thức để tính toán biến phụ thuộc
            if (tempQ.constraints) {
                for (const constraint of tempQ.constraints) {
                    if (typeof constraint === 'string') {
                        const parts = constraint.split('===');
                        if (parts.length === 2) {
                            const left = parts[0].trim();
                            const right = parts[1].trim();
                            
                            if (tempQ.variables.hasOwnProperty(left)) {
                                const val = self.evalExpression(right, context);
                                if (val !== null && val !== undefined) {
                                    context[left] = val;
                                }
                            } else if (tempQ.variables.hasOwnProperty(right)) {
                                const val = self.evalExpression(left, context);
                                if (val !== null && val !== undefined) {
                                    context[right] = val;
                                }
                            }
                        }
                    }
                }
            }

            // 3. Kiểm tra các ràng buộc (lúc này context đã có đầy đủ variables và formulas)
            constraintsPassed = true;
            if (tempQ.constraints && tempQ.constraints.length > 0) {
                // Nếu số lần thử vượt quá 120, ta bỏ qua các constraints chia hết phức tạp để tránh sập luồng
                let activeConstraints = tempQ.constraints;
                if (attempts > 120) {
                    activeConstraints = tempQ.constraints.filter(c => !c.includes('%') && !c.includes('/') && !c.includes('*'));
                }
                for (const constraint of activeConstraints) {
                    if (!this.evalExpression(constraint, context)) {
                        constraintsPassed = false;
                        break;
                    }
                }
            }

            // 3.4. Bộ lọc Heuristic: Ép kết quả nguyên cho đại lượng rời rạc
            if (constraintsPassed) {
                const isDiscrete = /học sinh|người|bạn|quyển sách|trang|gói|hộp|sản phẩm|xe|đồ chơi|lon|chiếc|đồng|tờ|vé|cái bánh|quả/i.test(tempQ.questionText);
                const isFractionOrStats = /phan-so|fraction|c10|c11|c12|c13|lt-c6|lt-c8|lt-c9|bai-31|bai-39|bai-40|bai-41|bai-42|bai-43|kt-c9/i.test(tempQ.type || '');
                if (isDiscrete && !isFractionOrStats) {
                    // Kiểm tra các giá trị đáp án chính và đáp án nhiễu có bị lẻ không
                    const ansVal = context.ans;
                    const w1Val = context.w1;
                    const w2Val = context.w2;
                    const w3Val = context.w3;
                    
                    let hasFraction = false;
                    if (typeof ansVal === 'number' && !Number.isInteger(ansVal)) hasFraction = true;
                    if (typeof w1Val === 'number' && !Number.isInteger(w1Val)) hasFraction = true;
                    if (typeof w2Val === 'number' && !Number.isInteger(w2Val)) hasFraction = true;
                    if (typeof w3Val === 'number' && !Number.isInteger(w3Val)) hasFraction = true;
                    
                    // Kiểm tra một số biến phụ quan trọng trong formulas
                    for (const [key, val] of Object.entries(context)) {
                        if (typeof val === 'number' && !Number.isInteger(val)) {
                            const lkey = key.toLowerCase();
                            if (lkey.includes('page') || lkey.includes('prod') || lkey.includes('people') || lkey.includes('student') || lkey.includes('remaining') || lkey.includes('count') || lkey.includes('cost') || lkey.includes('amount')) {
                                hasFraction = true;
                                break;
                            }
                        }
                    }
                    
                    if (hasFraction && attempts < 100) {
                        constraintsPassed = false; // Ưu tiên sinh lại bộ số nguyên trong 100 lần đầu để tránh sập luồng
                    }
                }
            }

            // 3.5. Kiểm tra trùng lặp đáp án trong options
            if (constraintsPassed && tempQ.options) {
                let renderedOpts = tempQ.options.map(opt => replacePlaceholders(opt, context));
                let optContents = renderedOpts.map(opt => {
                    // Loại bỏ thứ tự đáp án ở đầu (ví dụ: A. B. C. D. hoặc A) B) C) D))
                    const content = opt.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim();
                    // Loại bỏ khoảng trắng, ký hiệu $, LaTeX, dấu câu để so sánh chính xác nội dung
                    return content.replace(/[\$\s\{\}\\\,\_\'\"]/g, "").toLowerCase();
                });

                let uniqueOpts = new Set(optContents);
                if (uniqueOpts.size < optContents.length) {
                    if (attempts > Math.floor(maxAttempts * 0.6)) {
                        // Tự phục hồi: phát hiện trùng lặp, chỉnh nhẹ giá trị các phương án nhiễu
                        const diffs = [1, -1, 2, -2, 3, -3, 5, -5, 10, -10];
                        let diffIdx = 0;
                        const usedVals = new Set();
                        
                        const ansVal = context.ans;
                        if (ansVal !== undefined) {
                            usedVals.add(ansVal);
                        }

                        // Tìm các key nhiễu trong formulas bắt đầu bằng 'w' hoặc 'dist' hoặc 'opt'
                        const distractorKeys = Object.keys(tempQ.formulas || {}).filter(k => 
                            k !== 'ans' && 
                            (k.startsWith('w') || k.includes('dist') || k.startsWith('opt'))
                        );

                        const currentVals = {};
                        distractorKeys.forEach(k => {
                            currentVals[k] = context[k];
                        });

                        distractorKeys.forEach(wKey => {
                            let val = currentVals[wKey];
                            let isString = typeof val === 'string';
                            let parsedVal = isString ? Number(val) : val;

                            if (typeof parsedVal === 'number' && !isNaN(parsedVal)) {
                                while ((usedVals.has(parsedVal) || (ansVal !== undefined && parsedVal === ansVal)) && diffIdx < diffs.length) {
                                    parsedVal = parsedVal + diffs[diffIdx++];
                                }

                                let finalVal = parsedVal;
                                if (isString) {
                                    if (typeof val === 'string' && val.includes('.')) {
                                        const decimalPlaces = val.split('.')[1].length;
                                        finalVal = parsedVal.toFixed(decimalPlaces);
                                    } else {
                                        finalVal = parsedVal.toString();
                                    }
                                }

                                delete context[wKey];
                                context[wKey] = finalVal;
                                usedVals.add(parsedVal);
                            }
                        });

                        renderedOpts = tempQ.options.map(opt => replacePlaceholders(opt, context));
                        optContents = renderedOpts.map(opt => {
                            const content = opt.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim();
                            return content.replace(/[\$\s\{\}\\\,\_\'\"]/g, "").toLowerCase();
                        });
                        uniqueOpts = new Set(optContents);

                        if (uniqueOpts.size === optContents.length) {
                            constraintsPassed = true; // Phục hồi thành công!
                        } else {
                            constraintsPassed = false;
                        }
                    } else {
                        constraintsPassed = false; // Phát hiện trùng lặp, ép sinh lại bộ số mới
                    }
                }
            }
        }
        
        if (!constraintsPassed) {
            throw new Error("Không thể sinh câu hỏi thỏa mãn các ràng buộc hoặc loại bỏ trùng lặp đáp án sau " + maxAttempts + " lần thử.");
        }
        
        // Đóng băng (evaluate) tất cả các công thức trong context thành giá trị tĩnh trước khi sử dụng
        if (tempQ.formulas) {
            for (const formName of Object.keys(tempQ.formulas)) {
                const val = context[formName];
                delete context[formName];
                context[formName] = val;
            }
        }
        
        // 4. Tạo câu hỏi thực tế và tự động xáo trộn các phương án lựa chọn để tránh lỗi đáp án luôn là B
        let renderedOptions = tempQ.options ? tempQ.options.map(opt => replacePlaceholders(opt, context)) : [];
        let finalCorrectIndex = tempQ.correctIndex !== undefined ? parseInt(tempQ.correctIndex, 10) : 0;
        if (isNaN(finalCorrectIndex)) finalCorrectIndex = 0;

        if (renderedOptions.length > 0) {
            const oldCorrectIndex = finalCorrectIndex;
            const cleanOptions = renderedOptions.map(opt => opt.replace(/^[A-D][\.\)\:\-\s]+/i, '').trim());

            // Tạo danh sách đối tượng để xáo trộn
            const optionObjects = cleanOptions.map((text, index) => ({ text, isCorrect: index === oldCorrectIndex }));
            this.shuffle(optionObjects);

            // Tìm vị trí đáp án đúng mới
            finalCorrectIndex = optionObjects.findIndex(obj => obj.isCorrect);
            if (finalCorrectIndex === -1) finalCorrectIndex = 0;

            // Bọc lại tiền tố A, B, C, D, E, F
            const letterMap = ["A", "B", "C", "D", "E", "F"];
            renderedOptions = optionObjects.map((obj, i) => `${letterMap[i]}. ${obj.text}`);
            
            // Đưa chữ cái đáp án đúng mới vào context để tự động replace trong solutionHtml nếu có {ans_letter}
            context.ans_letter = letterMap[finalCorrectIndex];
        } else {
            context.ans_letter = "A";
        }

        // Thay thế placeholders trong solutionHtml sau khi đã xác định được ans_letter
        let finalSolutionHtml = replacePlaceholders(tempQ.solutionHtml, context);

        // Fallback: Nếu solutionHtml ghi cứng chữ cái đáp án đúng ban đầu kiểu "Đáp án đúng là D" thì cập nhật lại
        if (renderedOptions.length > 0 && finalSolutionHtml) {
            const oldCorrectIndex = tempQ.correctIndex !== undefined ? parseInt(tempQ.correctIndex, 10) : 0;
            if (oldCorrectIndex !== finalCorrectIndex) {
                const letterMap = ["A", "B", "C", "D", "E", "F"];
                const oldLetter = letterMap[oldCorrectIndex];
                const newLetter = letterMap[finalCorrectIndex];
                const regexStr = `(đáp án đúng là|dap an dung la|đáp án đúng:|dap an dung:|chọn đáp án|chon dap an|chọn|chon)\\s+${oldLetter}\\b`;
                finalSolutionHtml = finalSolutionHtml.replace(
                    new RegExp(regexStr, 'gi'),
                    (match, p1) => {
                        return `${p1} ${newLetter}`;
                    }
                );
            }
        }

        const finalQ = {
            questionText: replacePlaceholders(tempQ.questionText, context),
            options: renderedOptions,
            correctIndex: finalCorrectIndex,
            hints: tempQ.hints ? tempQ.hints.map(h => replacePlaceholders(h, context)) : [],
            solutionHtml: finalSolutionHtml,
            tip: replacePlaceholders(tempQ.tip, context),
            level: tempQ.level || 'chat-luong-cao',
            type: tempQ.type,
            isTemplateInstance: true,
            // Đính kèm ngữ cảnh variables cuối cùng để phục vụ debug/telemetry (loại bỏ hàm để clone an toàn)
            debugContext: sanitizeForClone(context)
        };
        
        return finalQ;
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
                self.postMessage({
                    status: 'error',
                    message: `Lỗi tại câu số ${i + 1}: ${err.message}`,
                    stack: err.stack,
                    failedQuestion: sanitizeForClone(qTemp),
                    failedIndex: i
                });
                return;
            }
        }
        self.postMessage({ status: 'success', questions: generatedQuestions });
    } catch (globalErr) {
        self.postMessage({ status: 'error', message: globalErr.message, stack: globalErr.stack });
    }
};
