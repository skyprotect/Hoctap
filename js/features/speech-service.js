/**
 * SPEECH SERVICE
 * Quản lý nhận diện giọng nói (SpeechRecognition), Phát âm Tiếng Anh (SpeechSynthesis) và Chấm điểm phát âm
 */
(function() {
    'use strict';

    let currentRecognition = null;
    let isRecording = false;

    const SpeechService = {
        isSupported: function() {
            return !!(window.SpeechRecognition || window.webkitSpeechRecognition || window.speechSynthesis);
        },

        speak: function(text, lang = 'en-US', rate = 0.9, onEnd) {
            if (!('speechSynthesis' in window)) {
                if (onEnd) onEnd();
                return;
            }

            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            utterance.rate = rate;

            // Tìm giọng nói chất lượng cao nếu có
            const voices = window.speechSynthesis.getVoices();
            const targetVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')));
            if (targetVoice) {
                utterance.voice = targetVoice;
            }

            utterance.onend = () => {
                if (onEnd) onEnd();
            };
            utterance.onerror = (e) => {
                console.warn("[SpeechService] TTS error:", e);
                if (onEnd) onEnd();
            };

            window.speechSynthesis.speak(utterance);
        },

        startRecognition: function(expectedText, onResult, onError) {
            const SpeechRecClass = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecClass) {
                if (onError) onError('Trình duyệt không hỗ trợ nhận diện giọng nói');
                return null;
            }

            this.stopRecognition();

            const recognition = new SpeechRecClass();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            recognition.maxAlternatives = 3;
            currentRecognition = recognition;
            isRecording = true;

            recognition.onresult = (event) => {
                isRecording = false;
                const transcript = event.results[0][0].transcript;
                const confidence = event.results[0][0].confidence;
                const score = this.calculateSimilarityScore(transcript, expectedText);
                if (onResult) onResult({ transcript, confidence, score, isCorrect: score >= 75 });
            };

            recognition.onerror = (event) => {
                isRecording = false;
                if (onError) onError(event.error);
            };

            recognition.onend = () => {
                isRecording = false;
            };

            try {
                recognition.start();
            } catch (e) {
                isRecording = false;
                if (onError) onError(e.message);
            }

            return recognition;
        },

        stopRecognition: function() {
            if (currentRecognition) {
                try {
                    currentRecognition.stop();
                } catch(e) {}
                currentRecognition = null;
            }
            isRecording = false;
        },

        editDistance: function(s1, s2) {
            s1 = (s1 || '').toLowerCase().trim();
            s2 = (s2 || '').toLowerCase().trim();
            const costs = [];
            for (let i = 0; i <= s1.length; i++) {
                let lastValue = i;
                for (let j = 0; j <= s2.length; j++) {
                    if (i === 0) {
                        costs[j] = j;
                    } else if (j > 0) {
                        let newValue = costs[j - 1];
                        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        }
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
                if (i > 0) costs[s2.length] = lastValue;
            }
            return costs[s2.length];
        },

        calculateSimilarityScore: function(actual, expected) {
            const cleanA = (actual || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
            const cleanE = (expected || '').toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
            if (!cleanA || !cleanE) return 0;
            if (cleanA === cleanE) return 100;

            const dist = this.editDistance(cleanA, cleanE);
            const maxLen = Math.max(cleanA.length, cleanE.length);
            const score = Math.max(0, Math.round((1 - dist / maxLen) * 100));
            return score;
        }
    };

    if (typeof window !== 'undefined') {
        window.SpeechService = SpeechService;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = SpeechService;
    }
})();
