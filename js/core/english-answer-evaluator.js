/**
 * english-answer-evaluator — Bộ đánh giá câu trả lời Tiếng Anh thuần túy (Pure English Answer Evaluator).
 * Tách biệt hoàn toàn khỏi logic điều khiển giao diện DOM, state mutation, audio, persistence và window.app.
 * Hỗ trợ UMD (Node.js CommonJS, Web Workers, Browser Global).
 * 
 * Public Contract:
 * - evaluateEnglishAnswer(q: Object, studentInput: any, options?: Object): { isCorrect: boolean, explanation: string, studentAnsStr: string, grammarAnalysis?: string | null }
 * - diagnoseGrammarError(userInput: string, targetAnswer: string, normalizeFn?: Function): string
 * - evaluateDictation(q: Object, inputVal: string, normalizeFn?: Function): { isCorrect: boolean, explanation: string, studentAnsStr: string }
 * - evaluateSpeaking(q: Object, studentAnswer: Object): { isCorrect: boolean, explanation: string, studentAnsStr: string }
 * - evaluateCloze(q: Object, chosenWords: Array<string>, normalizeFn?: Function): { isCorrect: boolean, explanation: string, studentAnsStr: string }
 * - evaluateUnscramble(q: Object, chosenWords: Array<string>, normalizeFn?: Function): { isCorrect: boolean, explanation: string, studentAnsStr: string }
 * - evaluateWriting(q: Object, inputVal: string, normalizeFn?: Function): { isCorrect: boolean, explanation: string, studentAnsStr: string, grammarAnalysis?: string | null }
 * - evaluateChoice(q: Object, studentAnswer: any, normalizeFn?: Function): { isCorrect: boolean, explanation: string, studentAnsStr: string }
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.EnglishAnswerEvaluator = api;
    if (typeof window !== 'undefined') {
        window.EnglishAnswerEvaluator = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.EnglishAnswerEvaluator = api;
    }
    if (typeof self !== 'undefined') {
        self.EnglishAnswerEvaluator = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    /**
     * Hàm chuẩn hóa chuỗi đáp án mặc định (nếu chưa nạp StringUtils)
     */
    function defaultNormalize(str) {
        const StringUtilsModule = (typeof globalThis !== 'undefined' && globalThis.StringUtils)
            || (typeof window !== 'undefined' && window.StringUtils)
            || (typeof require !== 'undefined' ? (function() { try { return require('./string-utils'); } catch(e) { return null; } })() : null);

        if (StringUtilsModule && typeof StringUtilsModule.normalizeAnswerToken === 'function') {
            return StringUtilsModule.normalizeAnswerToken(str);
        }

        if (!str) return "";
        return String(str)
            .replace(/^[A-D][\.\)\:\-\s]+/i, "")
            .replace(/<[^>]*>/g, "")
            .replace(/[’‘ʼʻ]/g, "'")
            .replace(/[“”«»]/g, "")
            .replace(/[–—−]/g, "-")
            .replace(/[\u00a0\u2000-\u200b\u202f\u3000\ufeff]/g, " ")
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
            .replace(/\s+/g, " ")
            .toLowerCase()
            .trim();
    }

    /**
     * Thuật toán chẩn đoán lỗi sư phạm (Smart Grammar Assistant)
     * Phân tích lỗi chi tiết cho phần Viết (writing_completion / writing_rewrite)
     */
    function diagnoseGrammarError(userInput, targetAnswer, normalizeFn) {
        const norm = normalizeFn || defaultNormalize;
        const normInput = norm(userInput || "");
        const normTarget = norm(targetAnswer || "");

        if (!normTarget) {
            return "Lỗi chưa xác định.";
        }

        if (normInput.includes(normTarget)) {
            return "Dấu câu hoặc ký tự thừa.";
        } else if (normTarget.endsWith("s") && !normInput.endsWith("s")) {
            return "Chia sai động từ ngôi thứ 3 số ít (Thiếu đuôi s/es) hoặc sai danh từ số nhiều.";
        } else if (normTarget.endsWith("ed") && !normInput.endsWith("ed")) {
            return "Chưa chia động từ về thì Quá khứ đơn (Thiếu đuôi ed).";
        } else if (Math.abs(normInput.length - normTarget.length) <= 2) {
            return "Viết sai chính tả một vài ký tự của từ.";
        } else {
            return "Sai cấu trúc ngữ pháp mẫu câu hoặc dùng sai từ vựng.";
        }
    }

    /**
     * Đánh giá câu hỏi nghe chính tả (Listening Dictation)
     */
    function evaluateDictation(q, inputVal, normalizeFn) {
        const norm = normalizeFn || defaultNormalize;
        const rawInput = typeof inputVal === 'string' ? inputVal.trim() : (inputVal != null ? String(inputVal).trim() : '');
        const cleanInput = norm(rawInput);

        let isCorrect = false;
        if (q.correctAnswers && Array.isArray(q.correctAnswers) && q.correctAnswers.length > 0) {
            isCorrect = q.correctAnswers.map(x => norm(x)).includes(cleanInput);
        } else {
            const correctVal = norm(q.correctAnswer || "");
            isCorrect = (cleanInput === correctVal && cleanInput.length > 0);
        }

        const expectedText = q.correctAnswer || (q.correctAnswers ? q.correctAnswers.join(" | ") : "");
        return {
            isCorrect: isCorrect,
            studentAnsStr: rawInput,
            explanation: `Đáp án đúng: <b>${expectedText}</b>`
        };
    }

    /**
     * Đánh giá câu hỏi Nói (Speaking / Speaking Roleplay)
     */
    function evaluateSpeaking(q, studentAnswer) {
        if (!studentAnswer) {
            return {
                isCorrect: false,
                studentAnsStr: "",
                explanation: "Chưa ghi nhận câu trả lời phát âm."
            };
        }

        const isCorrect = Boolean(studentAnswer.correct);
        const spokenText = studentAnswer.spokenText || "";
        const accuracy = typeof studentAnswer.accuracy === 'number' ? studentAnswer.accuracy : 0;

        return {
            isCorrect: isCorrect,
            studentAnsStr: spokenText,
            explanation: `Độ chính xác: <b>${accuracy}%</b>. Cần tối thiểu 60% để đạt.`
        };
    }

    /**
     * Đánh giá câu hỏi Đọc điền từ vào chỗ trống (Reading Cloze)
     */
    function evaluateCloze(q, chosenWords, normalizeFn) {
        const norm = normalizeFn || defaultNormalize;
        const wordsArray = Array.isArray(chosenWords) ? chosenWords : [];
        const cleanChosen = wordsArray.map(w => norm(w));
        const correctWords = (q.correctAnswers || []).map(w => norm(w));

        let isCorrect = true;
        if (correctWords.length === 0 || cleanChosen.length !== correctWords.length) {
            isCorrect = false;
        } else {
            for (let i = 0; i < correctWords.length; i++) {
                if (cleanChosen[i] !== correctWords[i]) {
                    isCorrect = false;
                    break;
                }
            }
        }

        const studentAnsStr = wordsArray.join(", ");
        const expectedText = q.correctAnswer || (q.correctAnswers ? q.correctAnswers.join(" - ") : "");

        return {
            isCorrect: isCorrect,
            studentAnsStr: studentAnsStr,
            explanation: `Đoạn văn đúng: <br/><b>${expectedText}</b>`
        };
    }

    /**
     * Đánh giá câu hỏi Xáo trộn từ / Xáo trộn câu (Writing Unscramble / Spelling)
     */
    function evaluateUnscramble(q, chosenWords, normalizeFn) {
        const norm = normalizeFn || defaultNormalize;
        const wordsArray = Array.isArray(chosenWords) ? chosenWords : [];

        if (q.scrambledLetters) {
            // Sắp xếp chữ cái thành từ (Spelling) - ghép không khoảng trắng
            const studentWord = norm(wordsArray.join("")).replace(/\s+/g, "");
            const correctWord = norm(q.correctAnswer || "").replace(/\s+/g, "");
            const isCorrect = (studentWord === correctWord && studentWord.length > 0);

            return {
                isCorrect: isCorrect,
                studentAnsStr: wordsArray.join(""),
                explanation: `Từ đúng: <b>${q.correctAnswer || ""}</b>`
            };
        } else {
            // Sắp xếp từ thành câu - ghép có khoảng trắng
            const studentSentence = norm(wordsArray.join(" "));
            const correctSentence = norm(q.correctAnswer || "");
            const isCorrect = (studentSentence === correctSentence && studentSentence.length > 0);

            return {
                isCorrect: isCorrect,
                studentAnsStr: wordsArray.join(" "),
                explanation: `Câu đúng: <b>${q.correctAnswer || ""}</b>`
            };
        }
    }

    /**
     * Đánh giá câu hỏi Viết tự do / Viết lại câu (Writing Completion / Rewrite / Reading QA)
     */
    function evaluateWriting(q, inputVal, normalizeFn) {
        const norm = normalizeFn || defaultNormalize;
        const rawInput = typeof inputVal === 'string' ? inputVal.trim() : (inputVal != null ? String(inputVal).trim() : '');
        const cleanInput = norm(rawInput);

        let isCorrect = false;
        let explanation = "";

        if (q.correctAnswers && Array.isArray(q.correctAnswers) && q.correctAnswers.length > 0) {
            isCorrect = q.correctAnswers.map(x => norm(x)).includes(cleanInput);
            explanation = `Các đáp án được chấp nhận: <br/><b>${q.correctAnswers.join(" | ")}</b>`;
        } else {
            const correctSentence = norm(q.correctAnswer || "");
            isCorrect = (cleanInput === correctSentence && cleanInput.length > 0);
            explanation = `Đáp án đúng: <b>${q.correctAnswer || ""}</b>`;
        }

        let grammarAnalysis = null;
        const qType = q.questionType || q.type || "";
        if (!isCorrect && (qType === "writing_completion" || qType === "writing_rewrite")) {
            const target = q.correctAnswer || (q.correctAnswers && q.correctAnswers[0]) || "";
            grammarAnalysis = diagnoseGrammarError(rawInput, target, norm);
            explanation += `<br/><span style="color:#ef4444; font-weight:800;"><i class="fa-solid fa-wand-magic-sparkles"></i> Trợ lý Ngữ pháp:</span> ${grammarAnalysis}`;
        }

        return {
            isCorrect: isCorrect,
            studentAnsStr: rawInput,
            explanation: explanation,
            grammarAnalysis: grammarAnalysis
        };
    }

    /**
     * Đánh giá câu hỏi trắc nghiệm thông thường (Choice / Phonetics / Reading Passage)
     */
    function evaluateChoice(q, studentAnswer, normalizeFn) {
        const norm = normalizeFn || defaultNormalize;
        let chosenAnswer = "";

        if (typeof studentAnswer === 'number' && q.options && q.options[studentAnswer] !== undefined) {
            chosenAnswer = q.options[studentAnswer];
        } else if (typeof studentAnswer === 'string') {
            chosenAnswer = studentAnswer;
        }

        const correctText = q.correctAnswer || (typeof q.correctIndex !== 'undefined' && q.options && q.options[q.correctIndex] ? q.options[q.correctIndex] : "");
        const cleanChosen = norm(chosenAnswer);
        const cleanCorrect = norm(correctText);

        const isCorrect = Boolean(
            (cleanChosen.length > 0 && cleanChosen === cleanCorrect) ||
            (q.correctIndex !== undefined && studentAnswer === q.correctIndex)
        );

        let explanation = `Đáp án đúng: <b>${correctText}</b>`;
        const qType = q.questionType || q.type || "";
        if (qType === "listening_passage") {
            explanation = `Đoạn văn nghe được:<br/><i style="color:var(--text-main); font-family:Georgia, serif;">"${q.listeningText || ""}"</i><br/><br/>Đáp án đúng: <b>${correctText || q.correctAnswer}</b>`;
        }

        return {
            isCorrect: isCorrect,
            studentAnsStr: chosenAnswer,
            explanation: explanation
        };
    }

    /**
     * Hàm điều phối đánh giá trung tâm (Pure Evaluation Dispatcher)
     * 
     * @param {Object} q - Đối tượng câu hỏi
     * @param {any} studentInput - Câu trả lời từ học sinh (chuỗi, mảng từ, hoặc object speaking)
     * @param {Object} [options] - Tùy chọn mở rộng
     * @returns {{ isCorrect: boolean, explanation: string, studentAnsStr: string, grammarAnalysis?: string|null }}
     */
    function evaluateEnglishAnswer(q, studentInput, options) {
        if (!q) {
            return {
                isCorrect: false,
                explanation: "Không tìm thấy dữ liệu câu hỏi.",
                studentAnsStr: "",
                grammarAnalysis: null
            };
        }

        const norm = (options && options.normalizeFn) || defaultNormalize;
        const qType = q.questionType || q.type || "choice";

        if (qType === "listening" && (!q.options || q.options.length === 0)) {
            return evaluateDictation(q, studentInput, norm);
        } else if (qType === "speaking" || qType === "speaking_roleplay") {
            return evaluateSpeaking(q, studentInput);
        } else if (qType === "reading_cloze") {
            return evaluateCloze(q, studentInput, norm);
        } else if (qType === "writing" || qType === "writing_unscramble") {
            return evaluateUnscramble(q, studentInput, norm);
        } else if (qType === "writing_completion" || qType === "writing_rewrite" || qType === "reading_qa") {
            return evaluateWriting(q, studentInput, norm);
        } else {
            return evaluateChoice(q, studentInput, norm);
        }
    }

    return {
        evaluateEnglishAnswer: evaluateEnglishAnswer,
        diagnoseGrammarError: diagnoseGrammarError,
        evaluateDictation: evaluateDictation,
        evaluateSpeaking: evaluateSpeaking,
        evaluateCloze: evaluateCloze,
        evaluateUnscramble: evaluateUnscramble,
        evaluateWriting: evaluateWriting,
        evaluateChoice: evaluateChoice
    };
});
