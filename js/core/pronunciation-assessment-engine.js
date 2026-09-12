/**
 * PronunciationAssessmentEngine — Điều phối toàn bộ Pronunciation Assessment Pipeline
 * 
 * Luồng hoạt động:
 * MICROPHONE
 *  → AUDIO CAPTURE (16kHz Mono Float32)
 *  → VAD / RMS ENERGY PREPROCESSING
 *  → ASR (Web Speech API / SpeechRecognitionService)
 *  → TRANSCRIPT
 *  → CTC FORCED ALIGNMENT (GopScorer Trellis)
 *  → PHONEME SCORING (Acoustic GOP)
 *  → WORD SCORING
 *  → FLUENCY & COMPLETENESS
 *  → PEDAGOGICAL FEEDBACK (L2 Vietnamese for Grade 6)
 *  → SPEAKING ASSESSMENT ADAPTER (Hợp đồng chuẩn hóa)
 * 
 * Quy tắc cốt lõi:
 * - ASSESSMENT_MODE: ENHANCED (khi có Acoustic Logits) hoặc BASIC (khi Fallback ASR)
 * - Khi ở BASIC: phonemeScore = null (KHÔNG GIẢ LẬP ĐIỂM ÂM VỊ TỪ TEXT)
 * - CHILD_VALIDATION_STATUS: UNVERIFIED
 */
(function (root, factory) {
    const gopScorerDep = root.GopScorer || (typeof require === 'function' ? (function () { try { return require('./gop-scorer'); } catch (e) { return null; } })() : null);
    const adapterDep = root.SpeakingAssessmentAdapter || (typeof require === 'function' ? (function () { try { return require('./speaking-assessment-adapter'); } catch (e) { return null; } })() : null);
    const speechRecDep = root.SpeechRecognitionService || (typeof require === 'function' ? (function () { try { return require('./speech-recognition-service'); } catch (e) { return null; } })() : null);

    const api = factory(gopScorerDep, adapterDep, speechRecDep);
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.PronunciationAssessmentEngine = api;
    if (typeof window !== 'undefined') {
        window.PronunciationAssessmentEngine = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.PronunciationAssessmentEngine = api;
    }
    if (typeof self !== 'undefined') {
        self.PronunciationAssessmentEngine = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function (GopScorer, SpeakingAssessmentAdapter, SpeechRecognitionService) {
    'use strict';

    const TARGET_SAMPLE_RATE = 16000;
    const FRAME_SIZE_SAMPLES = 480; // 30ms @ 16kHz
    const VAD_SILENCE_TIMEOUT_MS = 1600; // Tự ngắt sau 1.6s im lặng sau khi đã nói
    const MAX_RECORDING_DURATION_MS = 9000; // Tối đa 9s

    let audioContext = null;
    let mediaStream = null;
    let processorNode = null;
    let sourceNode = null;

    let isCapturing = false;
    let capturedPcmChunks = [];
    let vadState = {
        speechStarted: false,
        lastSpeechTime: 0,
        energyFloor: 0.005,
        speechThreshold: 0.02
    };

    /**
     * Resample buffer âm thanh từ sourceSampleRate về 16,000 Hz
     */
    function resampleTo16k(inputBuffer, sourceSampleRate) {
        if (sourceSampleRate === TARGET_SAMPLE_RATE) {
            return inputBuffer;
        }

        const ratio = sourceSampleRate / TARGET_SAMPLE_RATE;
        const newLength = Math.round(inputBuffer.length / ratio);
        const result = new Float32Array(newLength);

        for (let i = 0; i < newLength; i++) {
            const srcIdx = i * ratio;
            const idx1 = Math.floor(srcIdx);
            const idx2 = Math.min(idx1 + 1, inputBuffer.length - 1);
            const frac = srcIdx - idx1;
            result[i] = inputBuffer[idx1] * (1.0 - frac) + inputBuffer[idx2] * frac;
        }
        return result;
    }

    /**
     * Tính RMS Energy của frame
     */
    function calculateRms(samples) {
        let sum = 0.0;
        const len = samples.length;
        for (let i = 0; i < len; i++) {
            sum += samples[i] * samples[i];
        }
        return Math.sqrt(sum / Math.max(1, len));
    }

    /**
     * Chuẩn hóa biên độ âm thanh (Peak normalization chống clipping)
     */
    function normalizeAudio(pcmData) {
        let maxPeak = 0.0;
        for (let i = 0; i < pcmData.length; i++) {
            const abs = Math.abs(pcmData[i]);
            if (abs > maxPeak) maxPeak = abs;
        }

        if (maxPeak > 0.001 && maxPeak < 0.95) {
            const scale = 0.95 / maxPeak;
            const normalized = new Float32Array(pcmData.length);
            for (let i = 0; i < pcmData.length; i++) {
                normalized[i] = pcmData[i] * scale;
            }
            return normalized;
        }
        return pcmData;
    }

    const PronunciationAssessmentEngine = {
        isRecording: function () {
            return isCapturing;
        },

        getEngineStatus: function () {
            return {
                isCapturing: isCapturing,
                hasAudioContext: !!audioContext,
                vadSpeechStarted: vadState.speechStarted,
                assessmentModeSupported: {
                    BASIC: true,
                    ENHANCED: !!GopScorer
                },
                childValidationStatus: 'UNVERIFIED',
                releaseStatus: 'ENGINEERING PROTOTYPE VALIDATED'
            };
        },

        /**
         * Bắt đầu thu âm và đánh giá
         * @param {Object} params - { targetText, targetPhonemeTokens, onStart, onVadStatus, onInterim, onComplete, onError }
         */
        startAssessment: async function (params) {
            const opts = params || {};
            const targetText = opts.targetText || '';

            if (isCapturing) {
                this.stopAssessment();
            }

            capturedPcmChunks = [];
            vadState = {
                speechStarted: false,
                lastSpeechTime: Date.now(),
                energyFloor: 0.005,
                speechThreshold: 0.02
            };

            const startTime = Date.now();
            let asrSpokenText = '';
            let asrCompleted = false;

            // 1. Khởi động Web Speech Recognition đồng thời để bắt transcript ASR
            if (SpeechRecognitionService && SpeechRecognitionService.isSupported()) {
                SpeechRecognitionService.start({
                    lang: 'en-US',
                    interimResults: true,
                    onStart: () => {
                        if (typeof opts.onStart === 'function') opts.onStart();
                    },
                    onResult: (interimText) => {
                        asrSpokenText = interimText;
                        if (typeof opts.onInterim === 'function') {
                            opts.onInterim(interimText);
                        }
                    },
                    onError: (err) => {
                        console.warn("[PronunciationEngine] SpeechRecognition warning:", err);
                    },
                    onEnd: () => {
                        asrCompleted = true;
                    }
                });
            }

            // 2. Khởi tạo Web Audio Capture (16kHz Mono Float32)
            try {
                if (typeof navigator !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    mediaStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            channelCount: 1,
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true
                        }
                    });

                    const AudioContextClass = (typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) ||
                                             (typeof globalThis !== 'undefined' && (globalThis.AudioContext || globalThis.webkitAudioContext)) || null;

                    if (AudioContextClass) {
                        audioContext = new AudioContextClass();
                        sourceNode = audioContext.createMediaStreamSource(mediaStream);

                        // Dùng ScriptProcessorNode làm fallback chuẩn tương thích mọi trình duyệt
                        const bufferSize = 2048;
                        processorNode = audioContext.createScriptProcessor(bufferSize, 1, 1);

                        processorNode.onaudioprocess = (e) => {
                            if (!isCapturing) return;

                            const inputData = e.inputBuffer.getChannelData(0);
                            const copy = new Float32Array(inputData);
                            capturedPcmChunks.push(copy);

                            // VAD logic: tính RMS
                            const rms = calculateRms(copy);
                            const now = Date.now();

                            if (rms > vadState.speechThreshold) {
                                if (!vadState.speechStarted) {
                                    vadState.speechStarted = true;
                                    if (typeof opts.onVadStatus === 'function') {
                                        opts.onVadStatus({ speechDetected: true, rms: rms });
                                    }
                                }
                                vadState.lastSpeechTime = now;
                            } else {
                                // Nếu đã bắt đầu nói và im lặng vượt quá VAD_SILENCE_TIMEOUT_MS -> tự động hoàn tất
                                if (vadState.speechStarted && (now - vadState.lastSpeechTime > VAD_SILENCE_TIMEOUT_MS)) {
                                    this.finishRecordingAndEvaluate(targetText, asrSpokenText, opts);
                                }
                            }

                            // Max duration guard
                            if (now - startTime > MAX_RECORDING_DURATION_MS) {
                                this.finishRecordingAndEvaluate(targetText, asrSpokenText, opts);
                            }
                        };

                        sourceNode.connect(processorNode);
                        processorNode.connect(audioContext.destination);
                    }
                }
            } catch (mediaErr) {
                console.warn("[PronunciationEngine] Microphone capture not accessible, using ASR-only fallback:", mediaErr);
            }

            isCapturing = true;
            return true;
        },

        /**
         * Dừng thu âm thủ công
         */
        stopAssessment: function () {
            if (!isCapturing) return;
            isCapturing = false;

            if (SpeechRecognitionService) {
                SpeechRecognitionService.stop();
            }

            if (processorNode) {
                try { processorNode.disconnect(); } catch (e) {}
                processorNode = null;
            }
            if (sourceNode) {
                try { sourceNode.disconnect(); } catch (e) {}
                sourceNode = null;
            }
            if (mediaStream) {
                try {
                    mediaStream.getTracks().forEach(track => track.stop());
                } catch (e) {}
                mediaStream = null;
            }
            if (audioContext && audioContext.state !== 'closed') {
                try { audioContext.close(); } catch (e) {}
                audioContext = null;
            }
        },

        /**
         * Gom góp buffer PCM, đóng stream và chạy đánh giá
         */
        finishRecordingAndEvaluate: function (targetText, spokenText, opts) {
            this.stopAssessment();

            // Gộp tất cả chunks PCM
            let totalLength = 0;
            capturedPcmChunks.forEach(chunk => { totalLength += chunk.length; });

            let mergedPcm = new Float32Array(totalLength);
            let offset = 0;
            capturedPcmChunks.forEach(chunk => {
                mergedPcm.set(chunk, offset);
                offset += chunk.length;
            });

            // Resample nếu AudioContext khác 16kHz
            const sourceRate = audioContext ? audioContext.sampleRate : 44100;
            const pcm16k = resampleTo16k(mergedPcm, sourceRate);
            const normalizedPcm = normalizeAudio(pcm16k);

            // Chấm điểm qua SpeakingAssessmentAdapter
            let finalResult;

            // Kiểm tra xem có acoustic logits từ model hay không
            // Trong môi trường client browser hiện tại, nếu không có inference logits cục bộ:
            // Hoạt động ở chế độ BASIC ASR (tuân thủ nghiêm ngặt Truth Gate, không giả lập điểm âm vị)
            if (opts.frameLogits && GopScorer && Array.isArray(opts.targetPhonemeTokens)) {
                const gopScoreResult = GopScorer.scoreUtterance(opts.frameLogits, opts.targetPhonemeTokens);
                finalResult = SpeakingAssessmentAdapter.adaptEnhancedGopResult(targetText, spokenText, gopScoreResult, opts);
            } else {
                finalResult = SpeakingAssessmentAdapter.adaptBasicAsrResult(targetText, spokenText, opts);
            }

            if (typeof opts.onComplete === 'function') {
                opts.onComplete(finalResult);
            }

            return finalResult;
        },

        /**
         * Phương thức đánh giá tĩnh tiện ích từ text (tương thích backward)
         */
        evaluateStatic: function (targetText, spokenText, options) {
            if (SpeakingAssessmentAdapter) {
                return SpeakingAssessmentAdapter.adaptBasicAsrResult(targetText, spokenText, options);
            }
            return {
                isCorrect: false,
                accuracy: 0,
                spokenText: spokenText || '',
                assessmentMode: 'BASIC',
                phonemeScore: null
            };
        }
    };

    return PronunciationAssessmentEngine;
});
