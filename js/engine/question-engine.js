/**
 * QUESTION PARSER & GENERATOR ENGINE (v3.0)
 * Lead EdTech & Algorithm Architect - HocTap Ecosystem
 * 
 * Tính năng chính:
 * 1. Nạp và phân tích template JSON từ ngân hàng đề data/math/grade6/*.json
 * 2. Sinh biến ngẫu nhiên, kiểm tra ràng buộc constraints và tính toán formulas an toàn
 * 3. Tự động nội suy biến & công thức vào câu hỏi, gợi ý, lời giải, phương án
 * 4. Chống trùng lặp đáp án tuyệt đối (Anti-Duplicate Validation)
 * 5. Tương thích môi trường Node.js (CommonJS Jest test) và Browser (window.QuestionEngine)
 */

(function(root) {
    'use strict';

    const QuestionEngine = {
        version: '3.0.0',
        _chaptersCache: {},

        // Helper: Sinh số nguyên ngẫu nhiên trong [min, max]
        randomInt: function(min, max, excludeZero = false) {
            let res;
            let attempts = 0;
            do {
                res = Math.floor(Math.random() * (max - min + 1)) + min;
                attempts++;
            } while (excludeZero && res === 0 && attempts < 100);
            return res;
        },

        // Helper: Trộn mảng ngẫu nhiên (Fisher-Yates)
        shuffle: function(array) {
            if (!Array.isArray(array)) return [];
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                const temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        },

        // Helper toán học: Ước chung lớn nhất
        gcd: function(a, b) {
            a = Math.abs(a);
            b = Math.abs(b);
            while (b !== 0) {
                const temp = b;
                b = a % b;
                a = temp;
            }
            return a;
        },

        // Helper toán học: Bội chung nhỏ nhất
        lcm: function(a, b) {
            if (a === 0 || b === 0) return 0;
            return Math.abs(a * b) / this.gcd(a, b);
        },

        // Helper: Kiểm tra số nguyên tố
        isPrime: function(n) {
            if (n <= 1) return false;
            if (n <= 3) return true;
            if (n % 2 === 0 || n % 3 === 0) return false;
            for (let i = 5; i * i <= n; i += 6) {
                if (n % i === 0 || n % (i + 2) === 0) return false;
            }
            return true;
        },

        // Helper: Phân tích ra thừa số nguyên tố (trả về dạng ["2^2", "3"])
        getPrimeFactors: function(n) {
            if (n <= 1) return ["1"];
            const factors = {};
            let d = 2;
            let temp = n;
            while (temp > 1) {
                if (temp % d === 0) {
                    factors[d] = (factors[d] || 0) + 1;
                    temp = temp / d;
                } else {
                    d++;
                    if (d * d > temp) {
                        if (temp > 1) {
                            factors[temp] = (factors[temp] || 0) + 1;
                            break;
                        }
                    }
                }
            }
            const result = [];
            for (const p in factors) {
                if (factors[p] === 1) {
                    result.push(p.toString());
                } else {
                    result.push(`${p}^${factors[p]}`);
                }
            }
            return result;
        },

        // Helper: Lấy danh sách tất cả các ước số
        getDivisors: function(n) {
            const num = Math.abs(n);
            const divs = [];
            for (let i = 1; i <= num; i++) {
                if (num % i === 0) divs.push(i);
            }
            return divs;
        },

        // Nạp và lưu trữ dữ liệu chương JSON
        registerChapter: function(chapterId, chapterJson) {
            if (chapterJson && chapterJson.templates) {
                this._chaptersCache[chapterId] = chapterJson;
            }
        },

        getChapter: function(chapterId) {
            return this._chaptersCache[chapterId] || null;
        },

        // Đánh giá an toàn biểu thức toán học / logic trong ngữ cảnh scope
        evaluateExpression: function(expr, scope) {
            if (typeof expr !== 'string') return expr;
            
            // Tạo sandbox context
            const ctx = {
                Math: Math,
                parseInt: parseInt,
                parseFloat: parseFloat,
                isNaN: isNaN,
                gcd: this.gcd.bind(this),
                lcm: this.lcm.bind(this),
                isPrime: this.isPrime.bind(this),
                getPrimeFactors: this.getPrimeFactors.bind(this),
                getDivisors: this.getDivisors.bind(this),
                ...scope
            };

            try {
                // Tạo function với các key của ctx làm tham số
                const keys = Object.keys(ctx);
                const values = keys.map(k => ctx[k]);
                const fn = new Function(...keys, `return (${expr});`);
                const result = fn(...values);
                return result !== undefined ? result : expr;
            } catch (e) {
                // Nếu expr là một chuỗi văn bản thuần túy không phải code JS, trả về trực tiếp
                return expr;
            }
        },

        // Chuẩn hóa chuỗi để so sánh chống trùng lặp
        normalizeOptionValue: function(val) {
            if (val === null || val === undefined) return '';
            let s = String(val).trim();
            s = s.replace(/^\$+|\$+$/g, '').trim();
            s = s.replace(/\\text\{([^}]*)\}/g, '$1').trim();
            s = s.replace(/\s+/g, '');
            return s.toLowerCase();
        },

        // Nội suy biến vào chuỗi template: "Tính {a} + {b} = {ans}"
        interpolate: function(templateStr, scope) {
            if (typeof templateStr !== 'string') return templateStr;
            return templateStr.replace(/\{([a-zA-Z0-9_$]+)\}/g, (match, varName) => {
                if (scope.hasOwnProperty(varName)) {
                    return scope[varName] !== undefined ? scope[varName] : match;
                }
                return match;
            });
        },

        // Sinh 1 câu hỏi hoàn chỉnh từ template
        generateQuestion: function(template) {
            if (!template || typeof template !== 'object') {
                return this.createFallbackQuestion();
            }

            const maxAttempts = 100;
            let attempt = 0;
            let resolvedScope = null;

            while (attempt < maxAttempts) {
                attempt++;
                const scope = {};

                // 1. Sinh ngẫu nhiên các biến (variables)
                if (template.variables) {
                    for (const [varName, varDef] of Object.entries(template.variables)) {
                        if (varDef.type === 'int') {
                            scope[varName] = this.randomInt(varDef.min, varDef.max, varDef.excludeZero || false);
                        } else if (varDef.type === 'choice' && Array.isArray(varDef.options)) {
                            scope[varName] = varDef.options[this.randomInt(0, varDef.options.length - 1)];
                        } else if (varDef.type === 'float') {
                            const raw = Math.random() * (varDef.max - varDef.min) + varDef.min;
                            const decimals = varDef.decimals || 1;
                            scope[varName] = parseFloat(raw.toFixed(decimals));
                        } else {
                            scope[varName] = varDef.value !== undefined ? varDef.value : 0;
                        }
                    }
                }

                // 2. Kiểm tra ràng buộc (constraints)
                let isValid = true;
                if (Array.isArray(template.constraints)) {
                    for (const constraint of template.constraints) {
                        const passed = this.evaluateExpression(constraint, scope);
                        if (!passed) {
                            isValid = false;
                            break;
                        }
                    }
                }

                if (!isValid) continue;

                // 3. Tính toán các công thức (formulas)
                if (template.formulas) {
                    for (const [formName, formExpr] of Object.entries(template.formulas)) {
                        scope[formName] = this.evaluateExpression(formExpr, scope);
                    }
                }

                resolvedScope = scope;
                break;
            }

            if (!resolvedScope) {
                resolvedScope = { a: 5, b: 3, ans: 8, w1: 7, w2: 9, w3: 15 };
            }

            // 4. Nội suy chuỗi câu hỏi, gợi ý, lời giải
            const questionText = this.interpolate(template.question || '', resolvedScope);
            const hint = this.interpolate(template.hint || 'Hãy suy nghĩ cẩn thận.', resolvedScope);
            const solution = this.interpolate(template.solution || '', resolvedScope);
            const tip = template.tip ? this.interpolate(template.tip, resolvedScope) : '';

            // 5. Nội suy các lựa chọn đáp án
            let rawOptions = [];
            if (Array.isArray(template.options)) {
                rawOptions = template.options.map(opt => this.interpolate(String(opt), resolvedScope));
            } else {
                rawOptions = [
                    String(resolvedScope.ans || 'A'),
                    String(resolvedScope.w1 || 'B'),
                    String(resolvedScope.w2 || 'C'),
                    String(resolvedScope.w3 || 'D')
                ];
            }

            const correctValue = rawOptions[template.correctIndex || 0] || rawOptions[0];

            // 6. Anti-Duplicate Engine: Đảm bảo 4 lựa chọn không trùng nhau
            const seen = new Set();
            const uniqueOptions = [];
            
            // Thêm đáp án đúng trước
            uniqueOptions.push(correctValue);
            seen.add(this.normalizeOptionValue(correctValue));

            // Thêm các đáp án nhiễu khác
            for (let i = 0; i < rawOptions.length; i++) {
                const opt = rawOptions[i];
                const norm = this.normalizeOptionValue(opt);
                if (!seen.has(norm) && norm !== '') {
                    seen.add(norm);
                    uniqueOptions.push(opt);
                }
            }

            // Nếu thiếu phương án do trùng lặp, tự động bù phương án lệch
            let addAttempt = 1;
            while (uniqueOptions.length < 4 && addAttempt < 15) {
                let candidate = '';
                const numMatch = String(correctValue).match(/[-+]?\d*\.?\d+/);
                if (numMatch) {
                    const baseNum = parseFloat(numMatch[0]);
                    const offset = (addAttempt % 2 === 0 ? addAttempt : -addAttempt) * 2;
                    candidate = String(correctValue).replace(/[-+]?\d*\.?\d+/, String(baseNum + offset));
                } else {
                    candidate = String(correctValue) + ` (${addAttempt})`;
                }
                const norm = this.normalizeOptionValue(candidate);
                if (!seen.has(norm)) {
                    seen.add(norm);
                    uniqueOptions.push(candidate);
                }
                addAttempt++;
            }

            // 7. Xáo trộn đáp án ngẫu nhiên và định vị lại correctIndex
            const finalOptions = [...uniqueOptions.slice(0, 4)];
            this.shuffle(finalOptions);
            const newCorrectIndex = finalOptions.findIndex(opt => this.normalizeOptionValue(opt) === this.normalizeOptionValue(correctValue));

            return {
                id: template.id || `q_${Date.now()}`,
                questionText: questionText,
                options: finalOptions,
                correctIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0,
                hints: [hint],
                solutionHtml: solution,
                tip: tip,
                level: template.level || 'co-ban',
                tags: template.tags || []
            };
        },

        // Sinh danh sách đề thi từ một tập hợp templates hoặc chapterJson
        generateExam: function(chapterJson, count = 10, level = null) {
            if (!chapterJson || !Array.isArray(chapterJson.templates)) {
                return [];
            }

            let templates = [...chapterJson.templates];
            if (level) {
                const filtered = templates.filter(t => t.level === level);
                if (filtered.length > 0) {
                    templates = filtered;
                }
            }

            const questions = [];
            const shuffledTemplates = this.shuffle([...templates]);

            for (let i = 0; i < count; i++) {
                const tmpl = shuffledTemplates[i % shuffledTemplates.length];
                const q = this.generateQuestion(tmpl);
                questions.push(q);
            }

            return questions;
        },

        // Đánh giá kết quả người dùng
        evaluate: function(question, selectedIndex) {
            if (!question) return false;
            return question.correctIndex === selectedIndex;
        },

        // Fallback câu hỏi an toàn chống màn hình trắng
        createFallbackQuestion: function() {
            return {
                id: 'fallback_001',
                questionText: 'Tính: $15 + 25 = ?$',
                options: ['$40$', '$35$', '$45$', '$50$'],
                correctIndex: 0,
                hints: ['Cộng hàng đơn vị rồi đến hàng chục.'],
                solutionHtml: '$15 + 25 = 40$.',
                tip: 'Làm bài cẩn thận con nhé!',
                level: 'co-ban',
                tags: ['phép cộng']
            };
        }
    };

    // Export module
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = QuestionEngine;
    }
    if (typeof root !== 'undefined') {
        root.QuestionEngine = QuestionEngine;
    }
})(typeof window !== 'undefined' ? window : global);
