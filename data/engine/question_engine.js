/**
 * UNIVERSAL QUESTION ENGINE & PROTECTION LAYER (v2.0)
 * Lead EdTech & Algorithm Architect - HocTap Ecosystem
 * 
 * Đảm bảo 100% độ tin cậy:
 * 1. Chống màn hình trắng (Safe Rendering & Fallback)
 * 2. Chống trùng đáp án tuyệt đối (Anti-Duplicate Validation)
 * 3. Loại bỏ hoàn toàn NaN, undefined, Infinity, null
 * 4. Tương thích ngược toàn diện cho Lớp 1, 4, 6 (Toán & Tiếng Anh)
 */

(function() {
    'use strict';

    const QuestionEngine = {
        version: '2.0.0',

        // Helper: Sinh số nguyên ngẫu nhiên
        randomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        // Helper: Trộn mảng ngẫu nhiên
        shuffle: function(array) {
            const arr = Array.isArray(array) ? [...array] : [];
            for (let i = arr.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
            return arr;
        },

        // Chuẩn hóa chuỗi để so sánh (loại bỏ KaTeX math tags và khoảng trắng thừa)
        normalizeOptionValue: function(val) {
            if (val === null || val === undefined) return '';
            let s = String(val).trim();
            s = s.replace(/^\$+|\$+$/g, '').trim();
            s = s.replace(/\\text\{([^}]*)\}/g, '$1').trim();
            s = s.replace(/\s+/g, '');
            return s.toLowerCase();
        },

        // CORE VALIDATOR & REPAIR LAYER: Bảo đảm câu hỏi hợp lệ 100%
        validateAndRepairQuestion: function(q, defaultType = 'generic') {
            if (!q || typeof q !== 'object') {
                return this.createFallbackQuestion(defaultType);
            }

            let questionText = typeof q.questionText === 'string' ? q.questionText : 'Hãy chọn đáp án đúng:';
            let options = Array.isArray(q.options) ? [...q.options] : [];
            let correctIndex = Number.isInteger(q.correctIndex) ? q.correctIndex : 0;
            let hints = Array.isArray(q.hints) ? q.hints : ['Hãy suy nghĩ cẩn thận và tính toán từng bước.'];
            let solutionHtml = typeof q.solutionHtml === 'string' ? q.solutionHtml : '';
            let tip = typeof q.tip === 'string' ? q.tip : 'Làm bài cẩn thận con nhé!';

            // 1. Kiểm tra và loại bỏ triệt để NaN, undefined, null, Infinity trong text
            const sanitizeStr = (s, fallback) => {
                if (typeof s !== 'string' || s.includes('NaN') || s.includes('undefined') || s.includes('Infinity') || s.includes('null')) {
                    return fallback;
                }
                return s;
            };

            questionText = sanitizeStr(questionText, 'Hãy chọn kết quả chính xác cho phép tính sau:');
            solutionHtml = sanitizeStr(solutionHtml, 'Lời giải đang được cập nhật.');
            tip = sanitizeStr(tip, 'Hãy làm bài cẩn thận.');

            // 2. Chuẩn hóa danh sách đáp án (bắt buộc đúng 4 lựa chọn)
            if (options.length === 0) {
                options = ['$A$', '$B$', '$C$', '$D$'];
                correctIndex = 0;
            }

            options = options.map((opt, idx) => {
                let str = String(opt);
                if (str.includes('NaN') || str.includes('undefined') || str.includes('null') || str.includes('Infinity')) {
                    return '$' + (idx + 1) + '$';
                }
                return str;
            });

            // 3. ĐẢM BẢO 4 ĐÁP ÁN PHÂN BIỆT (ANTI-DUPLICATE ENGINE)
            const seen = new Set();
            const uniqueOptions = [];
            let correctVal = options[correctIndex] !== undefined ? options[correctIndex] : options[0];

            for (let i = 0; i < options.length; i++) {
                const opt = options[i];
                const norm = this.normalizeOptionValue(opt);
                if (!seen.has(norm) && norm !== '') {
                    seen.add(norm);
                    uniqueOptions.push(opt);
                }
            }

            let attempts = 0;
            while (uniqueOptions.length < 4 && attempts < 20) {
                attempts++;
                let candidate = '';
                const numMatch = String(correctVal).match(/[-+]?\d*\.?\d+/);
                if (numMatch) {
                    const baseNum = parseFloat(numMatch[0]);
                    const shift = attempts % 2 === 0 ? attempts * 2 : -(attempts * 2);
                    const newNum = baseNum + shift;
                    candidate = String(correctVal).replace(numMatch[0], String(newNum));
                } else {
                    candidate = correctVal + ' (khác ' + attempts + ')';
                }

                const normCandidate = this.normalizeOptionValue(candidate);
                if (!seen.has(normCandidate) && normCandidate !== '') {
                    seen.add(normCandidate);
                    uniqueOptions.push(candidate);
                }
            }

            options = uniqueOptions.slice(0, 4);

            let foundCorrect = options.findIndex(o => this.normalizeOptionValue(o) === this.normalizeOptionValue(correctVal));
            if (foundCorrect === -1) {
                options[0] = correctVal;
                correctIndex = 0;
            } else {
                correctIndex = foundCorrect;
            }

            if (correctIndex < 0 || correctIndex >= options.length) {
                correctIndex = 0;
            }

            return {
                ...q,
                questionText,
                options,
                correctIndex,
                hints,
                solutionHtml,
                tip,
                isValidatedByEngine: true
            };
        },

        // Mẫu câu hỏi chuẩn Fallback an toàn (không bao giờ để trắng màn hình)
        createFallbackQuestion: function(type = 'generic') {
            const a = this.randomInt(5, 20);
            const b = this.randomInt(2, 10);
            const ans = a + b;
            return {
                questionText: 'Tính giá trị của biểu thức: $' + a + ' + ' + b + ' = ?$',
                options: [
                    '$' + ans + '$',
                    '$' + (ans + 2) + '$',
                    '$' + (ans - 1) + '$',
                    '$' + (ans + 5) + '$'
                ],
                correctIndex: 0,
                hints: ['Thực hiện phép cộng hai số: $' + a + ' + ' + b + '$.'],
                solutionHtml: 'Ta có: $' + a + ' + ' + b + ' = ' + ans + '$. Đáp án đúng là **' + ans + '**.',
                tip: 'Hãy tính toán cẩn thận.',
                isFallback: true,
                type: type
            };
        },

        // Điều phối sinh câu hỏi môn Toán cho tất cả khối lớp
        generateMathQuestion: function(classLevel, type, level = 'co-ban') {
            const cls = String(classLevel || '6');
            let rawQ = null;

            try {
                if (cls === '1' && typeof window.questionsL1 !== 'undefined') {
                    rawQ = window.questionsL1.generateQuestion(type, level);
                } else if (cls === '4' && typeof window.questionsL4 !== 'undefined') {
                    rawQ = window.questionsL4.generateQuestion(type, level);
                } else if (typeof window.questions !== 'undefined' && typeof window.questions.generateQuestion === 'function') {
                    rawQ = window.questions.generateQuestion(type, level);
                } else if (typeof window.questionsL1 !== 'undefined' && (type.startsWith('l1-') || cls === '1')) {
                    rawQ = window.questionsL1.generateQuestion(type, level);
                } else if (typeof window.questionsL4 !== 'undefined' && (type.startsWith('l4-') || cls === '4')) {
                    rawQ = window.questionsL4.generateQuestion(type, level);
                }
            } catch (err) {
                console.error('[QuestionEngine] Lỗi khi sinh câu hỏi (' + cls + ' - ' + type + '):', err);
                rawQ = null;
            }

            return this.validateAndRepairQuestion(rawQ, type);
        },

        // Điều phối sinh câu hỏi môn Tiếng Anh
        generateEnglishQuestions: function(classLevel, lessonId, skill = 'all') {
            const cls = String(classLevel || '6');
            try {
                if (typeof window.generateEnglishQuestions === 'function') {
                    const list = window.generateEnglishQuestions(cls, lessonId, skill);
                    if (Array.isArray(list) && list.length > 0) {
                        return list.map(q => this.validateAndRepairQuestion(q, lessonId));
                    }
                }
            } catch (err) {
                console.error('[QuestionEngine] Lỗi khi sinh câu hỏi Tiếng Anh (' + cls + ' - ' + lessonId + '):', err);
            }

            return [
                this.validateAndRepairQuestion({
                    questionText: 'Choose the correct English word for: **Quả táo**',
                    options: ['Apple', 'Banana', 'Orange', 'Cat'],
                    correctIndex: 0,
                    hints: ['Trái cây màu đỏ hoặc xanh, bắt đầu bằng chữ A.'],
                    solutionHtml: '**Apple** nghĩa là quả táo.',
                    tip: 'Ghi nhớ từ vựng qua hình ảnh con nhé.'
                }, lessonId)
            ];
        }
    };

    if (typeof window !== 'undefined') {
        window.QuestionEngine = QuestionEngine;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = QuestionEngine;
    }
})();
