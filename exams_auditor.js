const fs = require('fs');
const path = require('path');
const vm = require('vm');

const EXAMS_DIR = path.join(__dirname, 'exams');

// Danh sách các từ khóa đếm thực thể nguyên rời rạc
const DISCRETE_KEYWORDS = [
    'người', 'học sinh', 'cuốn sách', 'quyển sách', 'cái kẹo', 'gói kẹo', 
    'đĩa', 'hộp', 'bông hoa', 'quả táo', 'cái', 'con', 'chiếc', 
    'thành viên', 'quyển', 'bao', 'tổ', 'nhóm', 'bạn', 'học viên',
    'bút', 'thước', 'vở', 'sách', 'tấm card', 'thẻ', 'quả'
];

/**
 * Hàm lấy số ngẫu nhiên trong khoảng [min, max] theo step
 */
function getRandomVal(min, max, step = 1) {
    const stepsCount = Math.floor((max - min) / step);
    const randStep = Math.floor(Math.random() * (stepsCount + 1));
    return min + randStep * step;
}

/**
 * Đánh giá biểu thức JS trong một context an toàn
 */
function evaluateExpression(expr, context) {
    if (typeof expr !== 'string') return expr;

    // Self-healing: Loại bỏ tiền tố variables. và formulas. thường bị AI sinh nhầm giống client
    let cleanedExpr = expr.replace(/\b(variables|formulas)\./g, '');
    // Self-healing: Loại bỏ dấu ngoặc nhọn quanh các tên biến trong công thức giống client
    cleanedExpr = cleanedExpr.replace(/\{([a-zA-Z0-9_]+)\}/g, '$1');

    // Nếu biểu thức chứa từ khóa 'return' mà không phải là định nghĩa hàm mũi tên, ta bọc nó trong IIFE để tránh lỗi cú pháp
    const trimmed = cleanedExpr.trim();
    if (cleanedExpr.includes('return') && !/^\s*\(?[a-zA-Z0-9_,\s]*\)?\s*=>/.test(trimmed)) {
        cleanedExpr = `(() => { ${cleanedExpr} })()`;
    }

    try {
        const script = new vm.Script(cleanedExpr);
        return script.runInNewContext(context);
    } catch (e) {
        throw new Error(`Lỗi đánh giá biểu thức "${expr}": ${e.message}`);
    }
}

/**
 * Quét lỗi cú pháp KaTeX và lệch dấu $
 */
function auditKatex(text, fileName, questionIndex) {
    const errors = [];
    if (!text) return errors;

    // 1. Kiểm tra lệch dấu $ (nhận diện dấu $ ở đầu/cuối và bắt cặp)
    const dollarCount = (text.match(/\$/g) || []).length;
    const escapedDollarCount = (text.match(/\\\$/g) || []).length;
    const netDollarCount = dollarCount - escapedDollarCount;
    if (netDollarCount % 2 !== 0) {
        errors.push(`Lệch dấu KaTeX $: Số lượng dấu $ là số lẻ (${netDollarCount})`);
    }

    // 2. Kiểm tra quy tắc vàng: Tuyệt đối không dùng ký tự $ trước dấu mở ngoặc { của biến trong biểu thức KaTeX
    const katexRegex = /\$([^$]+)\$/g;
    let match;
    while ((match = katexRegex.exec(text)) !== null) {
        const katexContent = match[1];
        if (katexContent.includes('{') && katexContent.includes('}')) {
            const bracesRegex = /(?<!\\){([a-zA-Z0-9_]+)}/g;
            if (bracesRegex.test(katexContent)) {
                errors.push(`Vi phạm quy tắc KaTeX: Dùng dấu $ trước dấu ngoặc { của biến template bên trong KaTeX: "$${katexContent}$"`);
            }
        }
    }

    return errors;
}

/**
 * Kiểm tra các biến chưa được khai báo
 */
function auditUndefinedVariables(text, variables, formulas) {
    const errors = [];
    if (!text) return errors;

    const declaredVars = new Set([
        ...Object.keys(variables || {}),
        ...Object.keys(formulas || {})
    ]);

    const varRegex = /{([a-zA-Z0-9_]+)}/g;
    let match;
    while ((match = varRegex.exec(text)) !== null) {
        const varName = match[1];
        if (!declaredVars.has(varName)) {
            errors.push(`Biến chưa được khai báo: {${varName}}`);
        }
    }
    return errors;
}

/**
 * Rà soát một câu hỏi
 */
function auditQuestion(q, fileName, qIdx) {
    const reports = [];

    // Nếu không phải câu hỏi sinh ngẫu nhiên dạng template, kiểm tra tĩnh
    if (!q.isTemplate) {
        const katexErrors = [
            ...auditKatex(q.questionText || q.question, fileName, qIdx),
            ...auditKatex(q.explanation || q.solutionHtml, fileName, qIdx)
        ];
        (q.options || []).forEach((opt, oIdx) => {
            katexErrors.push(...auditKatex(opt, fileName, qIdx));
        });

        if (katexErrors.length > 0) {
            reports.push({
                type: 'KATEX_ERROR',
                message: `Lỗi KaTeX trong câu hỏi tĩnh: ${katexErrors.join('; ')}`
            });
        }
        return reports;
    }

    // Câu hỏi template: sinh số và kiểm thử
    const vars = q.variables || {};
    const constraints = q.constraints || [];
    const formulas = q.formulas || {};
    const qText = q.questionText || q.question || '';

    // Kiểm tra biến chưa khai báo trong template tĩnh trước
    const undefinedVarErrors = [
        ...auditUndefinedVariables(qText, vars, formulas),
        ...auditUndefinedVariables(q.solutionHtml || q.explanation, vars, formulas)
    ];
    (q.options || []).forEach(opt => {
        undefinedVarErrors.push(...auditUndefinedVariables(opt, vars, formulas));
    });
    if (undefinedVarErrors.length > 0) {
        reports.push({
            type: 'UNDEFINED_VARIABLE',
            message: `Lỗi khai báo biến: ${undefinedVarErrors.join('; ')}`
        });
    }

    // Kiểm tra KaTeX lệch dấu trong template tĩnh
    const staticKatexErrors = [
        ...auditKatex(qText, fileName, qIdx),
        ...auditKatex(q.solutionHtml || q.explanation, fileName, qIdx)
    ];
    (q.options || []).forEach(opt => {
        staticKatexErrors.push(...auditKatex(opt, fileName, qIdx));
    });
    if (staticKatexErrors.length > 0) {
        reports.push({
            type: 'KATEX_ERROR',
            message: `Lỗi cú pháp KaTeX tĩnh: ${staticKatexErrors.join('; ')}`
        });
    }

    const isDiscreteEntity = DISCRETE_KEYWORDS.some(kw => qText.toLowerCase().includes(kw));

    // Thực hiện giả lập sinh số ngẫu nhiên 100 lần để tìm edge cases
    let validRuns = 0;
    let attempts = 0;
    const maxAttempts = 500;

    const collisionErrors = new Set();
    const floatErrors = new Set();
    const evaluationErrors = new Set();

    const mathHelpers = {
        Math,
        gcd: function(a, b) {
            a = Math.abs(a);
            b = Math.abs(b);
            while (b) {
                var t = b;
                b = a % b;
                a = t;
            }
            return a || 1;
        },
        lcm: function(a, b) {
            return Math.abs(a * b) / mathHelpers.gcd(a, b);
        },
        isPrime: function(n) {
            if (n <= 1) return false;
            for (let i = 2; i * i <= n; i++) {
                if (n % i === 0) return false;
            }
            return true;
        },
        getUniquePrimeFactors: function(n) {
            const factors = new Set();
            let temp = n;
            for (let i = 2; i <= temp; i++) {
                if (mathHelpers.isPrime(i) && temp % i === 0) {
                    factors.add(i);
                    while (temp % i === 0) {
                        temp /= i;
                    }
                }
            }
            return Array.from(factors);
        },
        findPrimeFactorPairs: function(n) {
            const pairs = new Set();
            for (let p1 = 2; p1 * p1 <= n; p1++) {
                if (mathHelpers.isPrime(p1) && n % p1 === 0) {
                    let p2 = n / p1;
                    if (mathHelpers.isPrime(p2)) {
                        if (p1 <= p2) {
                            pairs.add(`${p1},${p2}`);
                        } else {
                            pairs.add(`${p2},${p1}`);
                        }
                    }
                }
            }
            if (mathHelpers.isPrime(n)) {
                pairs.add(`${n},1`);
            }
            return Array.from(pairs);
        },
        getDivisors: function(n) {
            const divs = [];
            for (let i = 1; i <= n; i++) {
                if (n % i === 0) divs.push(i);
            }
            return divs;
        },
        lcm3: function(a, b, c) {
            return mathHelpers.lcm(mathHelpers.lcm(a, b), c);
        },
        sumDigits: function(n) {
            let sum = 0;
            let temp = Math.abs(n);
            while (temp) {
                sum += temp % 10;
                temp = Math.floor(temp / 10);
            }
            return sum;
        }
    };

    while (validRuns < 100 && attempts < maxAttempts) {
        attempts++;
        
        const context = {
            ...mathHelpers
        };
        context.this = context;

        for (const [varName, varConf] of Object.entries(vars)) {
            context[varName] = getRandomVal(varConf.min, varConf.max, varConf.step || 1);
        }

        // Khai báo formulas dưới dạng Getter động để có ngữ cảnh đúng (giống client)
        let formulaEvalSuccess = true;
        if (formulas) {
            for (const [formulaName, formulaExpr] of Object.entries(formulas)) {
                Object.defineProperty(context, formulaName, {
                    get: function() {
                        if (this.hasOwnProperty('_cache_' + formulaName)) {
                            return this['_cache_' + formulaName];
                        }
                        this['_cache_' + formulaName] = null;
                        
                        let res;
                        const trimmed = typeof formulaExpr === 'string' ? formulaExpr.trim() : '';
                        if (trimmed && /^\s*\(?[a-zA-Z0-9_,\s]*\)?\s*=>/.test(trimmed) && !trimmed.endsWith(')')) {
                            try {
                                res = new Function('return (' + formulaExpr + ')')();
                            } catch (e) {
                                evaluationErrors.add(`Lỗi biên dịch hàm mũi tên "${formulaName} = ${formulaExpr}": ${e.message}`);
                                formulaEvalSuccess = false;
                                return null;
                            }
                        } else {
                            try {
                                res = evaluateExpression(formulaExpr, this);
                            } catch (e) {
                                evaluationErrors.add(`Lỗi tính công thức "${formulaName} = ${formulaExpr}": ${e.message}`);
                                formulaEvalSuccess = false;
                                return null;
                            }
                        }
                        this['_cache_' + formulaName] = res;
                        return res;
                    },
                    configurable: true,
                    enumerable: true
                });
            }
        }

        // Đánh giá ràng buộc sau khi đã có Getter của formulas
        let satisfyConstraints = true;
        for (const constraint of constraints) {
            try {
                const res = evaluateExpression(constraint, context);
                if (!res) {
                    satisfyConstraints = false;
                    break;
                }
            } catch (err) {
                evaluationErrors.add(`Lỗi kiểm tra ràng buộc "${constraint}": ${err.message}`);
                satisfyConstraints = false;
                break;
            }
        }

        if (!satisfyConstraints || !formulaEvalSuccess) continue;
        validRuns++;

        // Evaluate tất cả các formulas để cached giá trị tĩnh cho phần kiểm tra nhiễu sau này
        const localContext = { ...context };
        if (formulas) {
            for (const formulaName of Object.keys(formulas)) {
                try {
                    localContext[formulaName] = context[formulaName];
                } catch (err) {
                    formulaEvalSuccess = false;
                    break;
                }
            }
        }
        if (!formulaEvalSuccess) continue;

        const ans = localContext['ans'];
        const w1 = localContext['w1'];
        const w2 = localContext['w2'];
        const w3 = localContext['w3'];

        const optionValues = [ans, w1, w2, w3];
        const uniqueValues = new Set(optionValues);

        const getCleanContextString = (ctx) => {
            const cleanCtx = {};
            for (const [key, value] of Object.entries(ctx)) {
                if (key !== 'this' && typeof value !== 'function' && !key.startsWith('_cache_')) {
                    cleanCtx[key] = value;
                }
            }
            return JSON.stringify(cleanCtx);
        };

        if (uniqueValues.size < 4) {
            const details = `Bộ số: ${getCleanContextString(context)} => ans=${ans}, w1=${w1}, w2=${w2}, w3=${w3}`;
            collisionErrors.add(details);
        }

        if (isDiscreteEntity) {
            optionValues.forEach((val, idx) => {
                if (typeof val === 'number' && !Number.isInteger(val)) {
                    const optName = idx === 0 ? 'ans' : `w${idx}`;
                    floatErrors.add(`Sinh số thập phân lẻ "${val}" cho phương án ${optName} trong bài toán đếm nguyên. Bộ số: ${getCleanContextString(context)}`);
                }
            });
        }
    }

    if (attempts >= maxAttempts && validRuns === 0) {
        reports.push({
            type: 'CONSTRAINTS_TOO_TIGHT',
            message: `Không thể sinh được bộ số hợp lệ nào sau ${maxAttempts} lần thử. Hãy kiểm tra lại các ràng buộc (constraints).`
        });
    }

    if (collisionErrors.size > 0) {
        reports.push({
            type: 'ANSWER_COLLISION',
            message: `Trùng lặp đáp án (va chạm w1, w2, w3, ans) ở ${collisionErrors.size} trường hợp. Ví dụ: ${Array.from(collisionErrors)[0]}`
        });
    }

    if (floatErrors.size > 0) {
        reports.push({
            type: 'FLOAT_NUMBER_BUG',
            message: `Số lẻ thập phân xuất hiện trong bài toán đếm ở ${floatErrors.size} trường hợp. Ví dụ: ${Array.from(floatErrors)[0]}`
        });
    }

    if (evaluationErrors.size > 0) {
        reports.push({
            type: 'EVALUATION_ERROR',
            message: `Lỗi tính toán biểu thức: ${Array.from(evaluationErrors).join('; ')}`
        });
    }

    return reports;
}

/**
 * Hàm chạy rà soát toàn bộ các tệp trong thư mục exams
 */
function runAudit() {
    console.log("====================================================");
    console.log("BẮT ĐẦU RÀ SOÁT CƠ SỞ DỮ LIỆU ĐỀ THI (100 FILE JSON)");
    console.log("====================================================\n");

    if (!fs.existsSync(EXAMS_DIR)) {
        console.error(`Thư mục exams không tồn tại tại đường dẫn: ${EXAMS_DIR}`);
        return;
    }

    const files = fs.readdirSync(EXAMS_DIR).filter(f => f.endsWith('.json'));
    console.log(`Tìm thấy ${files.length} tệp JSON đề thi trong thư mục exams/.\n`);

    const summaryReport = {
        totalFilesScanned: files.length,
        totalQuestionsScanned: 0,
        filesWithErrors: 0,
        errorsByType: {
            ANSWER_COLLISION: 0,
            FLOAT_NUMBER_BUG: 0,
            KATEX_ERROR: 0,
            UNDEFINED_VARIABLE: 0,
            CONSTRAINTS_TOO_TIGHT: 0,
            EVALUATION_ERROR: 0
        },
        errorDetails: []
    };

    files.forEach((file, fIdx) => {
        const filePath = path.join(EXAMS_DIR, file);
        let content;
        try {
            content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (e) {
            console.error(`❌ Lỗi phân tích cú pháp JSON của tệp ${file}:`, e.message);
            summaryReport.filesWithErrors++;
            summaryReport.errorDetails.push({
                file,
                errors: [{ type: 'JSON_PARSE_ERROR', message: e.message }]
            });
            return;
        }

        const questions = content.questions || [];
        summaryReport.totalQuestionsScanned += questions.length;
        const fileErrors = [];

        questions.forEach((q, qIdx) => {
            const qErrors = auditQuestion(q, file, qIdx + 1);
            if (qErrors.length > 0) {
                qErrors.forEach(err => {
                    fileErrors.push({
                        questionIndex: qIdx + 1,
                        type: err.type,
                        message: err.message
                    });
                    summaryReport.errorsByType[err.type] = (summaryReport.errorsByType[err.type] || 0) + 1;
                });
            }
        });

        if (fileErrors.length > 0) {
            summaryReport.filesWithErrors++;
            summaryReport.errorDetails.push({
                file,
                errors: fileErrors
            });
            console.log(`❌ Tệp [${file}]: Phát hiện ${fileErrors.length} lỗi.`);
            fileErrors.forEach(err => {
                console.log(`   - Câu ${err.questionIndex} [${err.type}]: ${err.message}`);
            });
        }
    });

    console.log("\n====================================================");
    console.log("KẾT QUẢ RÀ SOÁT CƠ SỞ DỮ LIỆU ĐỀ THI");
    console.log("====================================================");
    console.log(`- Tổng số file quét: ${summaryReport.totalFilesScanned}`);
    console.log(`- Tổng số câu hỏi đã quét: ${summaryReport.totalQuestionsScanned}`);
    console.log(`- Số file phát hiện lỗi: ${summaryReport.filesWithErrors}`);
    console.log(`- Thống kê các loại lỗi phát hiện:`);
    console.log(`  + Trùng lặp đáp án (ANSWER_COLLISION): ${summaryReport.errorsByType.ANSWER_COLLISION}`);
    console.log(`  + Số thập phân trong đếm nguyên (FLOAT_NUMBER_BUG): ${summaryReport.errorsByType.FLOAT_NUMBER_BUG}`);
    console.log(`  + Lỗi hiển thị KaTeX (KATEX_ERROR): ${summaryReport.errorsByType.KATEX_ERROR}`);
    console.log(`  + Biến chưa định nghĩa (UNDEFINED_VARIABLE): ${summaryReport.errorsByType.UNDEFINED_VARIABLE}`);
    console.log(`  + Ràng buộc quá chặt (CONSTRAINTS_TOO_TIGHT): ${summaryReport.errorsByType.CONSTRAINTS_TOO_TIGHT}`);
    console.log(`  + Lỗi tính toán biểu thức (EVALUATION_ERROR): ${summaryReport.errorsByType.EVALUATION_ERROR}`);
    console.log("====================================================\n");

    const reportPath = path.join(__dirname, 'exams_audit_report.md');
    let reportMd = `# Báo cáo thẩm định dữ liệu đề thi trắc nghiệm Toán

Ngày thẩm định: ${new Date().toLocaleString()}
Tổng số tệp đã quét: ${summaryReport.totalFilesScanned}
Tổng số câu hỏi kiểm tra: ${summaryReport.totalQuestionsScanned}
Số tệp dính lỗi: ${summaryReport.filesWithErrors}

## Thống kê lỗi theo phân loại
| Loại lỗi | Số lượng phát hiện | Mô tả |
| :--- | :---: | :--- |
| **Trùng lặp đáp án (ANSWER_COLLISION)** | ${summaryReport.errorsByType.ANSWER_COLLISION} | Các đáp án nhiễu w1, w2, w3 bị trùng với ans hoặc trùng chéo lẫn nhau. |
| **Số thập phân lẻ (FLOAT_NUMBER_BUG)** | ${summaryReport.errorsByType.FLOAT_NUMBER_BUG} | Phép chia ra số lẻ trong bài toán đếm đối tượng rời rạc. |
| **Lỗi hiển thị KaTeX (KATEX_ERROR)** | ${summaryReport.errorsByType.KATEX_ERROR} | Lệch dấu $ hoặc viết biến template {var} bên trong ngoặc nhọn của KaTeX dính kí tự $. |
| **Biến chưa định nghĩa (UNDEFINED_VARIABLE)** | ${summaryReport.errorsByType.UNDEFINED_VARIABLE} | Biến hiển thị trong đề chưa được khai báo trong variables/formulas. |
| **Ràng buộc quá chặt (CONSTRAINTS_TOO_TIGHT)** | ${summaryReport.errorsByType.CONSTRAINTS_TOO_TIGHT} | Không sinh được bộ số ngẫu nhiên nào thỏa mãn ràng buộc sau 500 lần thử. |
| **Lỗi tính toán biểu thức (EVALUATION_ERROR)** | ${summaryReport.errorsByType.EVALUATION_ERROR} | Công thức hoặc ràng buộc bị lỗi cú pháp JS khi chạy eval. |

## Chi tiết các lỗi phát hiện theo từng tệp
`;

    if (summaryReport.errorDetails.length === 0) {
        reportMd += `\n🎉 **Tuyệt vời! Không phát hiện lỗi nào trong cơ sở dữ liệu đề thi.**\n`;
    } else {
        summaryReport.errorDetails.forEach(fErr => {
            reportMd += `\n### 📂 Tệp: [${fErr.file}](file:///f:/KHQS/AntiGravity/HocTap/exams/${fErr.file})\n`;
            fErr.errors.forEach(err => {
                reportMd += `- **Câu ${err.questionIndex}** [\`${err.type}\`]: ${err.message}\n`;
            });
        });
    }

    fs.writeFileSync(reportPath, reportMd, 'utf8');
    console.log(`Đã xuất báo cáo chi tiết ra file: ${reportPath}`);
}

if (require.main === module) {
    runAudit();
}

module.exports = {
    auditQuestion,
    auditKatex,
    auditUndefinedVariables,
    runAudit
};
