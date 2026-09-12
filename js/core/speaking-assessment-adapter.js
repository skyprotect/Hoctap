/**
 * SpeakingAssessmentAdapter — Adapter chuẩn hóa kết quả đánh giá phát âm
 * 
 * Đảm bảo:
 * 1. Tương thích ngược 100% với hợp đồng cũ (isCorrect, accuracy, spokenText, cleanSpoken, cleanTarget, formattedHtml, words)
 * 2. Mở rộng kết quả đa chiều: phonemeScore, fluencyScore, completenessScore, pedagogicalFeedback
 * 3. Quy tắc trung thực (Truth Gate):
 *    - Khi assessmentMode === 'BASIC': phonemeScore BẮT BUỘC là null, không giả lập điểm âm vị từ chuỗi text.
 *    - Khi assessmentMode === 'ENHANCED': phonemeScore từ GopScorer, calibrationMethod: 'v1.0-heuristic'.
 *    - childValidationStatus luôn là 'UNVERIFIED'.
 */
(function (root, factory) {
    const similarityDep = root.SimilarityUtils || (typeof require === 'function' ? (function () { try { return require('./similarity-utils'); } catch (e) { return null; } })() : null);
    const gopScorerDep = root.GopScorer || (typeof require === 'function' ? (function () { try { return require('./gop-scorer'); } catch (e) { return null; } })() : null);

    const api = factory(similarityDep, gopScorerDep);
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.SpeakingAssessmentAdapter = api;
    if (typeof window !== 'undefined') {
        window.SpeakingAssessmentAdapter = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.SpeakingAssessmentAdapter = api;
    }
    if (typeof self !== 'undefined') {
        self.SpeakingAssessmentAdapter = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function (SimilarityUtils, GopScorer) {
    'use strict';

    /**
     * Chuẩn hóa từ vựng (bỏ dấu câu, chuyển chữ thường)
     */
    function cleanWords(text) {
        if (!text || typeof text !== 'string') return [];
        return text
            .toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
            .trim()
            .split(/\s+/)
            .filter(Boolean);
    }

    /**
     * Tính độ tương đồng giữa 2 từ (sử dụng SimilarityUtils nếu có, hoặc Levenshtein)
     */
    function wordSimilarity(w1, w2) {
        if (!w1 || !w2) return 0;
        if (w1 === w2) return 1.0;
        if (SimilarityUtils && typeof SimilarityUtils.levenshteinSimilarity === 'function') {
            return SimilarityUtils.levenshteinSimilarity(w1, w2);
        }
        // Fallback Levenshtein đơn giản
        const m = w1.length;
        const n = w2.length;
        const dp = Array.from({ length: m + 1 }, () => new Int32Array(n + 1));
        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                const cost = w1[i - 1] === w2[j - 1] ? 0 : 1;
                dp[i][j] = Math.min(
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1,
                    dp[i - 1][j - 1] + cost
                );
            }
        }
        const maxLen = Math.max(m, n);
        return maxLen === 0 ? 1.0 : (1.0 - dp[m][n] / maxLen);
    }

    /**
     * Tạo kết quả đánh giá từ Web Speech ASR (Fallback Mode - BASIC)
     * TUYỆT ĐỐI KHÔNG GIẢ LẬP ĐIỂM ÂM VỊ
     */
    function adaptBasicAsrResult(targetText, spokenText, options) {
        const opts = options || {};
        const threshold = typeof opts.similarityThreshold === 'number' ? opts.similarityThreshold : 0.72;
        const rawTarget = targetText || '';
        const rawSpoken = spokenText || '';

        const cleanTarget = cleanWords(rawTarget);
        const cleanSpoken = cleanWords(rawSpoken);

        // Đánh giá từng từ theo hợp đồng cũ
        const wordList = rawTarget.split(/\s+/).filter(Boolean);
        const matchedIndices = new Set();
        let correctCount = 0;

        const evaluatedWords = wordList.map((originalWord) => {
            const cleanW = originalWord.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();
            if (!cleanW) {
                return { word: originalWord, cleanWord: '', found: true, score: 100 };
            }

            let bestMatchIdx = -1;
            let bestSim = 0;

            for (let i = 0; i < cleanSpoken.length; i++) {
                if (matchedIndices.has(i)) continue;
                const sim = wordSimilarity(cleanW, cleanSpoken[i]);
                if (sim > bestSim) {
                    bestSim = sim;
                    bestMatchIdx = i;
                }
            }

            if (bestMatchIdx !== -1 && bestSim >= threshold) {
                matchedIndices.add(bestMatchIdx);
                correctCount++;
                return {
                    word: originalWord,
                    cleanWord: cleanW,
                    found: true,
                    score: Math.round(bestSim * 100)
                };
            }

            return {
                word: originalWord,
                cleanWord: cleanW,
                found: false,
                score: Math.round(bestSim * 100)
            };
        });

        const totalWords = evaluatedWords.length;
        const accuracy = totalWords > 0 ? Math.round((correctCount / totalWords) * 100) : 0;
        const isCorrect = accuracy >= 60;

        // Formatted HTML cho UI cũ
        const formattedHtml = evaluatedWords.map(w => {
            if (!w.cleanWord) return w.word;
            if (w.found) {
                return `<span class="word-correct text-emerald-600 dark:text-emerald-400 font-bold">${w.word}</span>`;
            }
            return `<span class="word-incorrect text-rose-500 line-through opacity-70">${w.word}</span>`;
        }).join(" ");

        // Completeness: Tỉ lệ từ trong target được phát âm
        const completenessScore = totalWords > 0 ? Math.round((matchedIndices.size / totalWords) * 100) : 0;

        // Fluency ước tính cơ bản theo tỉ lệ từ nhận diện được
        const fluencyScore = accuracy >= 60 ? Math.min(90, Math.max(50, accuracy)) : Math.min(55, accuracy);

        return {
            isCorrect: isCorrect,
            correct: isCorrect,
            accuracy: accuracy,
            spokenText: rawSpoken,
            cleanSpoken: cleanSpoken,
            cleanTarget: cleanTarget,
            correctCount: correctCount,
            totalWords: totalWords,
            formattedHtml: formattedHtml,
            words: evaluatedWords,

            // Truth Gate Constraints:
            assessmentMode: 'BASIC',
            phonemeScore: null, // BẮT BUỘC null khi không có mô hình âm học
            fluencyScore: fluencyScore,
            completenessScore: completenessScore,
            calibrationMethod: 'none',
            childValidationStatus: 'UNVERIFIED',
            pedagogicalFeedback: {
                summary: isCorrect ? "Phát âm nhận diện tốt qua Web Speech ASR." : "Cần phát âm rõ ràng hơn từng từ.",
                weakPhonemes: [],
                l2Warnings: [],
                tips: [
                    "Đang hoạt động ở chế độ Đánh giá Cơ bản (Basic ASR Mode).",
                    "Để có phân tích chi tiết âm vị và khẩu hình, hãy kích hoạt Pronunciation Acoustic Pipeline."
                ]
            },
            signalWarning: null
        };
    }

    /**
     * Tạo kết quả đánh giá từ GOP Scorer (Enhanced Mode - ACOUSTIC GOP)
     */
    function adaptEnhancedGopResult(targetText, spokenText, gopOutput, options) {
        const opts = options || {};
        const threshold = typeof opts.similarityThreshold === 'number' ? opts.similarityThreshold : 0.72;
        const rawTarget = targetText || '';
        const rawSpoken = spokenText || '';

        // Đánh giá từ vựng
        const basicResult = adaptBasicAsrResult(targetText, spokenText, options);

        // Trích xuất từ gopOutput
        const phonemes = (gopOutput && gopOutput.phonemes) || [];
        const phonemeScore = (gopOutput && typeof gopOutput.phonemeScore === 'number') ? gopOutput.phonemeScore : 0;
        const fluencyScore = (gopOutput && typeof gopOutput.fluencyScore === 'number') ? gopOutput.fluencyScore : basicResult.fluencyScore;
        const completenessScore = (gopOutput && typeof gopOutput.completenessScore === 'number') ? gopOutput.completenessScore : basicResult.completenessScore;
        const pedagogical = (gopOutput && gopOutput.pedagogicalFeedback) || basicResult.pedagogicalFeedback;

        // Điểm tổng thể kết hợp (Overall weighted score)
        // 40% Text Accuracy (ASR) + 40% Phoneme Acoustic Score + 10% Fluency + 10% Completeness
        const combinedScore = Math.round(
            basicResult.accuracy * 0.4 +
            phonemeScore * 0.4 +
            fluencyScore * 0.1 +
            completenessScore * 0.1
        );

        const isCorrect = combinedScore >= 60 && basicResult.accuracy >= 50;

        return {
            isCorrect: isCorrect,
            correct: isCorrect,
            accuracy: combinedScore,
            asrAccuracy: basicResult.accuracy,
            spokenText: rawSpoken,
            cleanSpoken: basicResult.cleanSpoken,
            cleanTarget: basicResult.cleanTarget,
            correctCount: basicResult.correctCount,
            totalWords: basicResult.totalWords,
            formattedHtml: basicResult.formattedHtml,
            words: basicResult.words,

            // Pronunciation Pipeline Extended Fields:
            assessmentMode: 'ENHANCED',
            phonemeScore: phonemeScore,
            fluencyScore: fluencyScore,
            completenessScore: completenessScore,
            calibrationMethod: (gopOutput && gopOutput.calibrationMethod) || 'v1.0-heuristic',
            childValidationStatus: 'UNVERIFIED',
            phonemes: phonemes,
            pedagogicalFeedback: pedagogical,
            signalWarning: (gopOutput && gopOutput.signalWarning) || null
        };
    }

    return {
        cleanWords: cleanWords,
        wordSimilarity: wordSimilarity,
        adaptBasicAsrResult: adaptBasicAsrResult,
        adaptEnhancedGopResult: adaptEnhancedGopResult
    };
});
