/**
 * GRADE 6 MATH - TEMPLATE QUESTION ENGINE
 * Xử lý câu hỏi sinh ngẫu nhiên từ template JSON với công thức toán học và ràng buộc chống trùng đáp án
 */
(function(root) {
    'use strict';

    const TemplateEngine = {
        generateQuestionFromTemplate: function(tempQ) {
        if (!tempQ || !tempQ.isTemplate) return tempQ;
        
        let context = {};
        let attempts = 0;
        const maxAttempts = 200;
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
                if (attempts > 350) {
                    activeConstraints = []; // Bỏ qua tất cả constraints nếu quá khó
                } else if (attempts > 120) {
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
                    if (attempts > Math.floor(maxAttempts * 0.9)) {
                        constraintsPassed = true; // Chấp nhận trùng lặp đáp án nếu đã thử quá 90% số lần để tránh sập
                    } else if (attempts > 120) {
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
            // Thay vì throw error làm sập app, ta sẽ ép constraintsPassed = true và tiếp tục sinh với bộ số hiện tại
            console.warn("Không thể sinh câu hỏi hoàn hảo sau " + maxAttempts + " lần thử. Tự động dùng fallback.");
            constraintsPassed = true;
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
            isTemplateInstance: true
        };
        
        return finalQ;
    },

    // Điểm xuất phát của việc chọn cấp độ bài luyện tập
    };

    if (typeof module !== 'undefined' && module.exports) module.exports = TemplateEngine;
    if (typeof root !== 'undefined') root.TemplateEngine = TemplateEngine;
})(typeof window !== 'undefined' ? window : global);
