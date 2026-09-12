/**
 * Unit Tests for GopScorer
 * 
 * Kiểm tra:
 * 1. Single Source of Truth Constants & Token Inventory (42 vocab, 44 dimension)
 * 2. SafeSoftmax & Numerical Stability (tràn số, NaN, -Infinity guards)
 * 3. CTC Trellis Viterbi Forced Alignment (căn chỉnh frame, T < U guard, bounds)
 * 4. GOP Log-Likelihood Ratio & Heuristic Calibration (v1.0-heuristic)
 * 5. Vietnamese L2 Diagnostics & Grade 6 Pedagogical Feedback
 * 6. Audio Signal Audit (Silence, empty frame detection)
 * 7. Full scoreUtterance Pipeline
 */

const GopScorer = require('../../js/core/gop-scorer');

describe('GopScorer — Goodness of Pronunciation & Forced Alignment Engine', () => {

    describe('1. Single Source of Truth & Token Inventory', () => {
        test('khai báo đúng kích thước vocabulary và output dimension theo ONNX graph', () => {
            expect(GopScorer.MODEL_VOCAB_SIZE).toBe(42);
            expect(GopScorer.MODEL_OUTPUT_DIMENSION).toBe(44);
            expect(GopScorer.BLANK_TOKEN_ID).toBe(41);
            expect(GopScorer.WORD_DELIMITER_TOKEN_ID).toBe(0);
            expect(GopScorer.BOS_TOKEN_ID).toBe(42);
            expect(GopScorer.EOS_TOKEN_ID).toBe(43);
            expect(GopScorer.FRAME_DURATION_MS).toBe(20.0);
        });

        test('chứa đầy đủ 44 tokens trong PHONEME_REGISTRY', () => {
            const registry = GopScorer.PHONEME_REGISTRY;
            for (let i = 0; i < 44; i++) {
                expect(registry[i.toString()]).toBeDefined();
                expect(registry[i.toString()].token).toBeDefined();
            }
            // Token 41 là blank CTC
            expect(registry["41"].name).toBe("ctc_blank_token");
            expect(registry["41"].isPhoneme).toBe(false);
            // Token 42, 43 là BOS, EOS
            expect(registry["42"].name).toBe("bos_token");
            expect(registry["43"].name).toBe("eos_token");
            // Token 0 là word delimiter
            expect(registry["0"].name).toBe("word_delimiter");
        });

        test('TOKEN_TO_ID tra cứu hai chiều chuẩn xác', () => {
            expect(GopScorer.TOKEN_TO_ID["[PAD]"]).toBe(41);
            expect(GopScorer.TOKEN_TO_ID["<s>"]).toBe(42);
            expect(GopScorer.TOKEN_TO_ID["</s>"]).toBe(43);
            expect(GopScorer.TOKEN_TO_ID["|"]).toBe(0);
            expect(GopScorer.TOKEN_TO_ID["r"]).toBe(27);
            expect(GopScorer.TOKEN_TO_ID["s"]).toBe(28);
            expect(GopScorer.TOKEN_TO_ID["θ"]).toBe(31);
        });
    });

    describe('2. SafeSoftmax & Numerical Stability', () => {
        test('tính xác suất chuẩn xác và tổng bằng 1.0', () => {
            const logits = [2.0, 1.0, 0.1];
            const probs = GopScorer.safeSoftmax(logits);
            expect(probs.length).toBe(3);
            const sum = probs[0] + probs[1] + probs[2];
            expect(Math.abs(sum - 1.0)).toBeLessThan(1e-5);
            expect(probs[0]).toBeGreaterThan(probs[1]);
            expect(probs[1]).toBeGreaterThan(probs[2]);
        });

        test('chống tràn số với logits cực lớn (1000.0, 1005.0)', () => {
            const logits = [1000.0, 1005.0, 990.0];
            const probs = GopScorer.safeSoftmax(logits);
            expect(isFinite(probs[0])).toBe(true);
            expect(isFinite(probs[1])).toBe(true);
            expect(isFinite(probs[2])).toBe(true);
            expect(probs[1]).toBeGreaterThan(probs[0]);
            const sum = probs[0] + probs[1] + probs[2];
            expect(Math.abs(sum - 1.0)).toBeLessThan(1e-5);
        });

        test('an toàn khi tất cả logits đều là -Infinity', () => {
            const logits = [-Infinity, -Infinity, -Infinity];
            const probs = GopScorer.safeSoftmax(logits);
            expect(probs.length).toBe(3);
            expect(probs[0]).toBeCloseTo(1 / 3, 4);
        });

        test('logitsToLogProbs chuẩn hoá đúng ma trận T x 44', () => {
            const frameLogits = [
                new Float32Array(44).fill(0.5),
                new Float32Array(44).fill(1.2)
            ];
            const logProbs = GopScorer.logitsToLogProbs(frameLogits);
            expect(logProbs.length).toBe(2);
            expect(logProbs[0].length).toBe(44);
            // Mọi log-prob đều <= 0
            for (let d = 0; d < 44; d++) {
                expect(logProbs[0][d]).toBeLessThanOrEqual(0);
                expect(isFinite(logProbs[0][d])).toBe(true);
            }
        });
    });

    describe('3. CTC Trellis Viterbi Forced Alignment', () => {
        test('bảo vệ guard khi T < U (số frame nhỏ hơn số âm vị)', () => {
            const logProbs = [new Float64Array(44)]; // T = 1
            const targetTokens = [27, 17, 30]; // U = 3 (r, i, t)
            const res = GopScorer.alignTrellis(logProbs, targetTokens);
            expect(res.success).toBe(false);
            expect(res.error).toBe("INSUFFICIENT_FRAMES");
            expect(res.minRequired).toBe(3);
            expect(res.actualFrames).toBe(1);
        });

        test('bảo vệ khi input rỗng', () => {
            expect(GopScorer.alignTrellis([], [1, 2]).success).toBe(false);
            expect(GopScorer.alignTrellis([new Float64Array(44)], []).success).toBe(false);
        });

        test('căn chỉnh chính xác khi frame phân bố rõ ràng cho 3 âm vị', () => {
            // Giả lập 15 frames:
            // Frames 0-1: blank
            // Frames 2-5: token 27 (/r/)
            // Frames 6-9: token 17 (/iː/)
            // Frames 10-13: token 30 (/t/)
            // Frame 14: blank
            const T = 15;
            const logProbs = [];
            for (let t = 0; t < T; t++) {
                const lp = new Float64Array(44).fill(-10.0);
                if (t >= 0 && t <= 1) lp[41] = 0.0; // blank
                else if (t >= 2 && t <= 5) lp[27] = 0.0; // /r/
                else if (t >= 6 && t <= 9) lp[17] = 0.0; // /iː/
                else if (t >= 10 && t <= 13) lp[30] = 0.0; // /t/
                else lp[41] = 0.0; // blank
                logProbs.push(lp);
            }

            const targetTokens = [27, 17, 30];
            const alignRes = GopScorer.alignTrellis(logProbs, targetTokens);

            expect(alignRes.success).toBe(true);
            expect(alignRes.alignments.length).toBe(3);

            const [p1, p2, p3] = alignRes.alignments;
            expect(p1.tokenId).toBe(27);
            expect(p1.startFrame).toBe(2);
            expect(p1.endFrame).toBe(5);

            expect(p2.tokenId).toBe(17);
            expect(p2.startFrame).toBe(6);
            expect(p2.endFrame).toBe(9);

            expect(p3.tokenId).toBe(30);
            expect(p3.startFrame).toBe(10);
            expect(p3.endFrame).toBe(13);
        });
    });

    describe('4. GOP Calculation & Heuristic Calibration', () => {
        test('GOP = 0 khi phát âm hoàn hảo (target luôn là argmax) -> calibratedScore = 100', () => {
            const T = 6;
            const logProbs = [];
            for (let t = 0; t < T; t++) {
                const lp = new Float64Array(44).fill(-8.0);
                lp[27] = -0.05; // token 27 là max
                logProbs.push(lp);
            }

            const alignments = [{
                phonemeIndex: 0,
                tokenId: 27,
                startFrame: 0,
                endFrame: 5,
                durationMs: 120
            }];

            const gopResults = GopScorer.calculateGOP(logProbs, alignments);
            expect(gopResults.length).toBe(1);
            expect(gopResults[0].rawGop).toBeCloseTo(0.0, 2);
            expect(gopResults[0].score).toBe(100);
        });

        test('GOP rất âm khi phát âm hoàn toàn sai -> calibratedScore thấp (< 30)', () => {
            const T = 6;
            const logProbs = [];
            for (let t = 0; t < T; t++) {
                const lp = new Float64Array(44).fill(-8.0);
                lp[10] = -0.1; // token 10 là max
                lp[27] = -6.0; // target 27 rất thấp
                logProbs.push(lp);
            }

            const alignments = [{
                phonemeIndex: 0,
                tokenId: 27,
                startFrame: 0,
                endFrame: 5,
                durationMs: 120
            }];

            const gopResults = GopScorer.calculateGOP(logProbs, alignments);
            expect(gopResults.length).toBe(1);
            expect(gopResults[0].rawGop).toBeLessThan(-5.0);
            expect(gopResults[0].score).toBeLessThan(30);
        });

        test('tính đơn điệu của calibrateScore: GOP tăng -> Score tăng', () => {
            const scores = [];
            const gopValues = [-6.0, -4.0, -2.5, -1.5, -0.8, -0.2, 0.0];
            gopValues.forEach(gop => {
                scores.push(GopScorer.calibrateScore(gop));
            });

            for (let i = 1; i < scores.length; i++) {
                expect(scores[i]).toBeGreaterThanOrEqual(scores[i - 1]);
            }
            expect(scores[scores.length - 1]).toBe(100);
            expect(scores[0]).toBeLessThan(20);
        });
    });

    describe('5. Vietnamese L2 Diagnostics & Pedagogical Feedback', () => {
        test('nhận diện chính xác nguy cơ phát âm L2 của học sinh Việt Nam', () => {
            const scoredPhonemes = [
                { tokenId: 27, token: "r", ipa: "/r/", score: 45, l2Feedback: GopScorer.PHONEME_REGISTRY["27"].l2Risk },
                { tokenId: 31, token: "θ", ipa: "/θ/", score: 50, l2Feedback: GopScorer.PHONEME_REGISTRY["31"].l2Risk },
                { tokenId: 17, token: "i", ipa: "/iː/", score: 92, l2Feedback: GopScorer.PHONEME_REGISTRY["17"].l2Risk }
            ];

            const feedback = GopScorer.generatePedagogicalFeedback(scoredPhonemes);
            expect(feedback.weakPhonemes.length).toBe(2);
            expect(feedback.l2Warnings.length).toBe(2);
            expect(feedback.tips.length).toBe(2);
            // Kiểm tra nội dung tiếng Việt có dấu chuẩn xác
            expect(feedback.tips[0]).toContain("lưỡi");
            expect(feedback.tips[1]).toContain("răng");
        });

        test('khen ngợi khi tất cả các âm vị đều đạt điểm cao (>= 65)', () => {
            const scoredPhonemes = [
                { tokenId: 27, token: "r", ipa: "/r/", score: 85, l2Feedback: null },
                { tokenId: 17, token: "i", ipa: "/iː/", score: 95, l2Feedback: null }
            ];
            const feedback = GopScorer.generatePedagogicalFeedback(scoredPhonemes);
            expect(feedback.weakPhonemes.length).toBe(0);
            expect(feedback.summary).toContain("rất tốt");
        });
    });

    describe('6. Audio Signal Audit', () => {
        test('cảnh báo khi âm thanh chỉ toàn blank/silence', () => {
            const T = 20;
            const logProbs = [];
            for (let t = 0; t < T; t++) {
                const lp = new Float64Array(44).fill(-10.0);
                lp[41] = 0.0; // Toàn blank
                logProbs.push(lp);
            }

            const audit = GopScorer.auditAudioSignal(logProbs);
            expect(audit.isSilent).toBe(true);
            expect(audit.warning).toContain("AUDIO_SIGNAL_SILENT");
        });

        test('không cảnh báo khi âm thanh có ngữ âm đa dạng', () => {
            const T = 20;
            const logProbs = [];
            for (let t = 0; t < T; t++) {
                const lp = new Float64Array(44).fill(-10.0);
                lp[t % 30] = 0.0;
                logProbs.push(lp);
            }

            const audit = GopScorer.auditAudioSignal(logProbs);
            expect(audit.isSilent).toBe(false);
            expect(audit.warning).toBeNull();
        });
    });

    describe('7. Full Utterance GOP Scoring Pipeline', () => {
        test('chấm điểm trọn vẹn phát âm từ logits', () => {
            const T = 15;
            const logits = [];
            for (let t = 0; t < T; t++) {
                const row = new Array(44).fill(0.1);
                if (t >= 2 && t <= 5) row[27] = 5.0; // /r/
                else if (t >= 6 && t <= 9) row[17] = 5.0; // /iː/
                else if (t >= 10 && t <= 13) row[30] = 5.0; // /t/
                else row[41] = 5.0; // blank
                logits.push(row);
            }

            const result = GopScorer.scoreUtterance(logits, [27, 17, 30]);

            expect(result.success).toBe(true);
            expect(result.assessmentMode).toBe("ENHANCED");
            expect(result.calibrationMethod).toBe("v1.0-heuristic");
            expect(result.childValidationStatus).toBe("UNVERIFIED");
            expect(result.overallScore).toBeGreaterThanOrEqual(75);
            expect(result.phonemeScore).toBe(result.overallScore);
            expect(result.fluencyScore).toBeGreaterThan(0);
            expect(result.completenessScore).toBe(100);
            expect(result.phonemes.length).toBe(3);
        });
    });
});
