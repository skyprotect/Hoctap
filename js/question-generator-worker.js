/**
 * Thin Web Worker harness for MathTemplateCompiler.
 * Compilation ownership stays in js/core/math-template-compiler.js.
 */
var workerReady = true;
var workerInitError = null;

if (typeof importScripts === 'function') {
    try {
        if (typeof MathExprEvaluator === 'undefined') importScripts('core/math-expr-evaluator.js');
        if (typeof MathTemplateCompiler === 'undefined') importScripts('core/math-template-compiler.js');
    } catch (error) {
        workerReady = false;
        workerInitError = {
            dependency: error && error.message && error.message.includes('core/') ? error.message.split('/').pop() : 'unknown',
            phase: 'importScripts',
            message: error && error.message ? error.message : String(error)
        };
    }
}

var MathExprEvaluator = (typeof globalThis !== 'undefined' && globalThis.MathExprEvaluator)
    || (typeof self !== 'undefined' && self.MathExprEvaluator)
    || (typeof require === 'function' ? require('./core/math-expr-evaluator') : null);
var MathTemplateCompiler = (typeof globalThis !== 'undefined' && globalThis.MathTemplateCompiler)
    || (typeof self !== 'undefined' && self.MathTemplateCompiler)
    || (typeof require === 'function' ? require('./core/math-template-compiler') : null);

if (typeof importScripts === 'function' && typeof require !== 'function'
    && (!MathTemplateCompiler || typeof MathTemplateCompiler.generateQuestionFromTemplate !== 'function'
        || typeof MathTemplateCompiler.sanitizeForClone !== 'function')) {
    workerReady = false;
    workerInitError = workerInitError || {
        dependency: 'math-template-compiler.js',
        phase: 'post-resolution',
        message: 'MathTemplateCompiler API not available after importScripts completed'
    };
}

const generator = {
    // Preserved evaluator facade for legacy consumers; math utility ownership is core modules.
    evalExpression: function(expr, context) {
        return MathExprEvaluator && typeof MathExprEvaluator.evalExpression === 'function'
            ? MathExprEvaluator.evalExpression(expr, context) : expr;
    },
    safeEval: function(expr, context) {
        return MathExprEvaluator && typeof MathExprEvaluator.safeEval === 'function'
            ? MathExprEvaluator.safeEval(expr, context) : null;
    },
    safeEvalTokens: function(tokens, context) {
        return MathExprEvaluator && typeof MathExprEvaluator.safeEvalTokens === 'function'
            ? MathExprEvaluator.safeEvalTokens(tokens, context) : null;
    },
    generateQuestionFromTemplate: function(tempQ, optionsOrMaxAttempts) {
        if (!tempQ || !tempQ.isTemplate) return tempQ;
        if (MathTemplateCompiler && typeof MathTemplateCompiler.generateQuestionFromTemplate === 'function') {
            return MathTemplateCompiler.generateQuestionFromTemplate(tempQ, optionsOrMaxAttempts);
        }
        throw new Error('MATH_TEMPLATE_COMPILER_UNAVAILABLE: cannot compile a math question template');
    }
};

function postInitError() {
    self.postMessage({
        status: 'error',
        code: 'WORKER_INIT_FAILED',
        message: workerInitError
            ? `Khởi tạo Worker thất bại [${workerInitError.phase}]: ${workerInitError.message}`
            : 'Worker khởi tạo thất bại: không thể nạp các module cần thiết.',
        initError: workerInitError
    });
}

if (typeof self !== 'undefined') {
    self.onmessage = function(event) {
        if (!workerReady) {
            if (typeof self.postMessage === 'function') postInitError();
            return;
        }

        const { questions, maxAttempts } = event.data;
        const generatedQuestions = [];
        try {
            for (let index = 0; index < questions.length; index++) {
                const template = questions[index];
                try {
                    const generated = generator.generateQuestionFromTemplate(template, maxAttempts || 500);
                    generated.isSpacedRepetition = false;
                    generated.level = 'chat-luong-cao';
                    generatedQuestions.push(MathTemplateCompiler.sanitizeForClone(generated));
                } catch (error) {
                    self.postMessage({
                        status: 'error',
                        message: `Lỗi tại câu số ${index + 1}: ${error.message}`,
                        stack: error.stack,
                        failedQuestion: MathTemplateCompiler && MathTemplateCompiler.sanitizeForClone
                            ? MathTemplateCompiler.sanitizeForClone(template) : undefined,
                        failedIndex: index
                    });
                    return;
                }
            }
            self.postMessage({ status: 'success', questions: generatedQuestions });
        } catch (error) {
            self.postMessage({ status: 'error', message: error.message, stack: error.stack });
        }
    };
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') module.exports = generator;
