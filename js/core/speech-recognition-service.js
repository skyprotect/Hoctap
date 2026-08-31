/**
 * SpeechRecognitionService — Quản lý Web Speech Recognition API và đánh giá phát âm Tiếng Anh.
 * 
 * Public Contract:
 * - isSupported(): boolean
 * - isRecording(): boolean
 * - getRecognition(): SpeechRecognition | null
 * - start(options?: { lang?: string; interimResults?: boolean; maxAlternatives?: number; onStart?: Function; onError?: Function; onEnd?: Function; onResult?: Function }): boolean
 * - stop(): void
 * - evaluatePronunciation(targetText: string, spokenText: string, similarityThreshold?: number): {
 *       spokenText: string,
 *       cleanSpoken: string[],
 *       cleanTarget: string[],
 *       accuracy: number,
 *       correct: boolean,
 *       correctCount: number,
 *       totalWords: number,
 *       formattedHtml: string,
 *       words: Array<{ word: string, cleanWord: string, found: boolean }>
 *   }
 */
(function (root, factory) {
    const similarityDep = root.SimilarityUtils || (typeof require === 'function' ? (function() { try { return require('./similarity-utils'); } catch(e) { return null; } })() : null);
    const api = factory(similarityDep);
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.SpeechRecognitionService = api;
    if (typeof window !== 'undefined') {
        window.SpeechRecognitionService = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.SpeechRecognitionService = api;
    }
    if (typeof self !== 'undefined') {
        self.SpeechRecognitionService = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function (SimilarityUtils) {
    'use strict';

    let recognitionInstance = null;
    let recordingState = false;

    const SpeechRecognitionService = {
        isSupported: function() {
            if (typeof window === 'undefined') return false;
            return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
        },

        isRecording: function() {
            return recordingState;
        },

        getRecognition: function() {
            return recognitionInstance;
        },

        start: function(options) {
            const opts = options || {};

            if (!this.isSupported()) {
                if (typeof opts.onError === 'function') {
                    opts.onError({ error: 'not-supported', message: 'SpeechRecognition API is not supported' });
                }
                return false;
            }

            const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionInstance = new SpeechRecognitionClass();
            recognitionInstance.lang = opts.lang || 'en-US';
            recognitionInstance.interimResults = opts.interimResults !== undefined ? opts.interimResults : false;
            recognitionInstance.maxAlternatives = opts.maxAlternatives !== undefined ? opts.maxAlternatives : 1;

            recognitionInstance.onstart = () => {
                recordingState = true;
                if (typeof opts.onStart === 'function') {
                    opts.onStart();
                }
            };

            recognitionInstance.onerror = (event) => {
                recordingState = false;
                if (typeof opts.onError === 'function') {
                    opts.onError(event);
                }
            };

            recognitionInstance.onend = () => {
                recordingState = false;
                if (typeof opts.onEnd === 'function') {
                    opts.onEnd();
                }
            };

            recognitionInstance.onresult = (event) => {
                const spokenText = (event.results && event.results[0] && event.results[0][0] && event.results[0][0].transcript)
                    ? event.results[0][0].transcript
                    : '';
                if (typeof opts.onResult === 'function') {
                    opts.onResult(spokenText, event);
                }
            };

            try {
                recognitionInstance.start();
                return true;
            } catch (err) {
                recordingState = false;
                if (typeof opts.onError === 'function') {
                    opts.onError(err);
                }
                return false;
            }
        },

        stop: function() {
            if (recognitionInstance && recordingState) {
                try {
                    recognitionInstance.stop();
                } catch (e) {
                    // Ignore if already stopped
                }
            }
            recordingState = false;
        },

        /**
         * Đánh giá phát âm Tiếng Anh bằng so khớp chuỗi & khoảng cách Levenshtein
         * @param {string} targetText - Câu/từ mẫu cần phát âm
         * @param {string} spokenText - Câu/từ người học đã phát âm
         * @param {number} [similarityThreshold=0.72] - Ngưỡng tương đồng tối thiểu
         */
        evaluatePronunciation: function(targetText, spokenText, similarityThreshold) {
            const rawTarget = targetText || '';
            const rawSpoken = spokenText || '';
            const threshold = typeof similarityThreshold === 'number' ? similarityThreshold : 0.72;

            const cleanSpoken = rawSpoken
                .toLowerCase()
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
                .trim()
                .split(/\s+/)
                .filter(Boolean);

            const cleanTarget = rawTarget
                .toLowerCase()
                .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "")
                .trim()
                .split(/\s+/)
                .filter(Boolean);

            const rawTargetWords = rawTarget.trim() ? rawTarget.split(/\s+/) : [];

            let formattedHtml = "";
            let correctCount = 0;
            const words = [];

            const similarityHelper = (SimilarityUtils && typeof SimilarityUtils.getSimilarityScore === 'function')
                ? SimilarityUtils.getSimilarityScore
                : ((typeof getSimilarityScore === 'function') ? getSimilarityScore : (s1, s2) => (s1 === s2 ? 1 : 0));

            rawTargetWords.forEach(word => {
                const cleanWord = word.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "").trim();

                // Thuật toán so khớp mờ Levenshtein
                let wordFound = false;
                for (let spokenWord of cleanSpoken) {
                    const similarity = similarityHelper(spokenWord, cleanWord);
                    if (similarity >= threshold || spokenWord.includes(cleanWord) || cleanWord.includes(spokenWord)) {
                        wordFound = true;
                        break;
                    }
                }

                words.push({ word: word, cleanWord: cleanWord, found: wordFound });

                if (wordFound) {
                    formattedHtml += `<span style="color:#10b981; font-weight:800;">${word}</span> `;
                    correctCount++;
                } else {
                    formattedHtml += `<span style="color:#ef4444; font-weight:800;">${word}</span> `;
                }
            });

            const accuracy = cleanTarget.length > 0 ? Math.round((correctCount / cleanTarget.length) * 100) : 0;

            // Ngưỡng đạt phát âm: >= 50% hoặc đúng >= 1 từ với câu cực ngắn (<= 2 từ)
            const isPassing = (cleanTarget.length <= 2) ? (correctCount >= 1 || cleanTarget.length === 0) : (accuracy >= 50);

            return {
                spokenText: rawSpoken,
                cleanSpoken: cleanSpoken,
                cleanTarget: cleanTarget,
                accuracy: accuracy,
                correct: isPassing,
                correctCount: correctCount,
                totalWords: cleanTarget.length,
                formattedHtml: formattedHtml,
                words: words
            };
        }
    };

    return SpeechRecognitionService;
});
