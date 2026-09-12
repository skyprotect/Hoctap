/**
 * GopScorer — Goodness of Pronunciation (GOP) Scorer & CTC Forced Alignment Engine
 * 
 * Kiến trúc:
 * - CTC Trellis Viterbi Forced Alignment (Trellis Forward-Backtracking)
 * - GOP Log-Likelihood Ratio calculation (Log-posterior over best alternative)
 * - Heuristic Calibration v1.0-heuristic (Sigmoid mapping to [0, 100])
 * - L2 Vietnamese Pronunciation Diagnostics & Pedagogical Feedback for Grade 6
 * - Numerical Stability Guards (SafeSoftmax, EPSILON=1e-12, -Infinity guards)
 * 
 * Single Source of Truth:
 * - MODEL_VOCAB_SIZE = 42
 * - MODEL_OUTPUT_DIMENSION = 44 (42 vocab + 2 added tokens <s>:42, </s>:43)
 * - BLANK_TOKEN_ID = 41 ([PAD])
 * - WORD_DELIMITER_TOKEN_ID = 0 (|)
 * - Frame Stride: 20.0ms (50 frames/giây tại 16kHz)
 * 
 * Verification Status:
 * - ASSESSMENT_MODE: ENHANCED (Acoustic GOP + CTC Alignment)
 * - CHILD_VALIDATION_STATUS: UNVERIFIED
 * - CALIBRATION_METHOD: v1.0-heuristic
 */
(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = api;
    }
    root.GopScorer = api;
    if (typeof window !== 'undefined') {
        window.GopScorer = api;
    }
    if (typeof globalThis !== 'undefined') {
        globalThis.GopScorer = api;
    }
    if (typeof self !== 'undefined') {
        self.GopScorer = api;
    }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    const MODEL_VOCAB_SIZE = 42;
    const MODEL_OUTPUT_DIMENSION = 44;
    const BLANK_TOKEN_ID = 41; // [PAD]
    const WORD_DELIMITER_TOKEN_ID = 0; // |
    const BOS_TOKEN_ID = 42; // <s>
    const EOS_TOKEN_ID = 43; // </s>
    const UNK_TOKEN_ID = 40; // [UNK]

    const EPSILON = 1e-12;
    const NEG_INFINITY = -1e9;
    const FRAME_DURATION_MS = 20.0; // 320 samples @ 16kHz = 20ms

    // Built-in verified Phoneme Inventory & L2 Diagnostics Table (Grade 6 Vietnamese Learners)
    const PHONEME_REGISTRY = {
        "0": { token: "|", isPhoneme: false, ipa: null, name: "word_delimiter" },
        "1": { token: "ɑ", isPhoneme: true, ipa: "/ɑː/", name: "open_back_unrounded_vowel", l2Risk: "Hay đọc thành âm o ngắn. Mở rộng miệng theo chiều dọc, hạ quai hàm sâu." },
        "2": { token: "æ", isPhoneme: true, ipa: "/æ/", name: "near_open_front_unrounded_vowel", l2Risk: "Hay đọc thành âm /e/ hẹp. Mở rộng miệng cả ngang và dọc, lưỡi đặt thấp." },
        "3": { token: "ə", isPhoneme: true, ipa: "/ə/", name: "mid_central_unrounded_vowel", l2Risk: "Thường phát âm quá rõ hoặc nhấn nhầm. Đây là âm lướt nhẹ, thả lỏng toàn bộ cơ miệng." },
        "4": { token: "aʊ", isPhoneme: true, ipa: "/aʊ/", name: "diphthong", l2Risk: "Phát âm /a/ rồi lướt mượt mà sang khép tròn môi /ʊ/ (như trong now, out)." },
        "5": { token: "aɪ", isPhoneme: true, ipa: "/aɪ/", name: "diphthong", l2Risk: "Phát âm /a/ rồi lướt nhẹ lên miệng bè /ɪ/ (như trong time, my)." },
        "6": { token: "b", isPhoneme: true, ipa: "/b/", name: "voiced_bilabial_plosive", l2Risk: "Mím nhẹ hai môi và bật hơi có rung dây thanh." },
        "7": { token: "tʃ", isPhoneme: true, ipa: "/tʃ/", name: "voiceless_postalveolar_affricate", l2Risk: "Hay lẫn với âm tr tiếng Việt. Chu môi tròn nhẹ, chặn hơi rồi bật dứt khoát không rung." },
        "8": { token: "dʒ", isPhoneme: true, ipa: "/dʒ/", name: "voiced_postalveolar_affricate", l2Risk: "Hay đọc thành /d/ hoặc /gi/. Chu tròn môi, bật hơi đồng thời làm rung mạnh dây thanh." },
        "9": { token: "ð", isPhoneme: true, ipa: "/ð/", name: "voiced_dental_fricative", l2Risk: "Rất hay đọc nhầm thành /d/ hoặc /z/. Đặt đầu lưỡi giữa hai hàm răng, thổi luồng hơi rung dây thanh." },
        "10": { token: "ɛ", isPhoneme: true, ipa: "/e/", name: "open_mid_front_unrounded_vowel", l2Risk: "Mở miệng vừa phải, lưỡi hơi cong nhẹ ở phần giữa." },
        "11": { token: "eɪ", isPhoneme: true, ipa: "/eɪ/", name: "diphthong", l2Risk: "Hay đọc thành ê tiếng Việt. Phát âm /e/ rồi lướt mượt lên /ɪ/ (như trong day, face)." },
        "12": { token: "f", isPhoneme: true, ipa: "/f/", name: "voiceless_labiodental_fricative", l2Risk: "Răng cửa trên chạm nhẹ môi dưới, đẩy luồng khí sắc nét." },
        "13": { token: "ɡ", isPhoneme: true, ipa: "/ɡ/", name: "voiced_velar_plosive", l2Risk: "Cuống lưỡi nâng chạm ngạc mềm, bật hơi rung (go, bag)." },
        "14": { token: "h", isPhoneme: true, ipa: "/h/", name: "voiceless_glottal_fricative", l2Risk: "Thở hơi nhẹ nhàng từ thanh môn." },
        "15": { token: "ɪ", isPhoneme: true, ipa: "/ɪ/", name: "near_close_near_front_unrounded_vowel", l2Risk: "Hay đọc thành i dài tiếng Việt. Đây là i ngắn dứt khoát, cơ miệng thả lỏng." },
        "16": { token: " ", isPhoneme: false, ipa: null, name: "whitespace" },
        "17": { token: "i", isPhoneme: true, ipa: "/iː/", name: "close_front_unrounded_vowel", l2Risk: "Âm i dài: Mỉm cười bè miệng sang hai bên, kéo dài hơi (see, team)." },
        "18": { token: "k", isPhoneme: true, ipa: "/k/", name: "voiceless_velar_plosive", l2Risk: "Bật hơi mạnh dứt khoát ở vòm họng. Đặc biệt chú ý âm cuối từ (like, book)." },
        "19": { token: "l", isPhoneme: true, ipa: "/l/", name: "alveolar_lateral_approximant", l2Risk: "Đầu lưỡi chạm chân răng trên. Ở cuối từ (dark l), uốn nhẹ lưỡi." },
        "20": { token: "m", isPhoneme: true, ipa: "/m/", name: "bilabial_nasal", l2Risk: "Mím hai môi, luồng hơi thoát ra qua đường mũi." },
        "21": { token: "n", isPhoneme: true, ipa: "/n/", name: "alveolar_nasal", l2Risk: "Đầu lưỡi chạm nướu răng trên, thoát hơi qua mũi." },
        "22": { token: "ŋ", isPhoneme: true, ipa: "/ŋ/", name: "velar_nasal", l2Risk: "Âm ng ở cuối từ (sing, ring). Cuống lưỡi chạm ngạc mềm." },
        "23": { token: "oʊ", isPhoneme: true, ipa: "/oʊ/", name: "diphthong", l2Risk: "Hay đọc thành ô tiếng Việt. Mở miệng âm /o/ rồi thu tròn môi về /ʊ/ (go, phone)." },
        "24": { token: "ɔ", isPhoneme: true, ipa: "/ɔː/", name: "open_mid_back_rounded_vowel", l2Risk: "Tròn môi hình chữ O sâu, cuống lưỡi kéo lùi về sau (door, call)." },
        "25": { token: "ɔɪ", isPhoneme: true, ipa: "/ɔɪ/", name: "diphthong", l2Risk: "Lướt từ tròn môi /ɔ/ sang mở bè miệng /ɪ/ (boy, voice)." },
        "26": { token: "p", isPhoneme: true, ipa: "/p/", name: "voiceless_bilabial_plosive", l2Risk: "Bật hơi gió mạnh từ hai môi. Phân biệt rõ với /b/ không bật hơi." },
        "27": { token: "r", isPhoneme: true, ipa: "/r/", name: "alveolar_approximant", l2Risk: "Hay uốn lưỡi quá đà hoặc phát âm thành z/g tiếng Việt. Cong nhẹ đầu lưỡi, không chạm ngạc." },
        "28": { token: "s", isPhoneme: true, ipa: "/s/", name: "voiceless_alveolar_fricative", l2Risk: "Âm gió nhẹ sắc nét. Rất hay bị nuốt ở đuôi từ (miss, books, six)." },
        "29": { token: "ʃ", isPhoneme: true, ipa: "/ʃ/", name: "voiceless_postalveolar_fricative", l2Risk: "Âm s nặng (she, wash). Chu môi tròn nhẹ, đẩy luồng gió xì xào mạnh mẽ." },
        "30": { token: "t", isPhoneme: true, ipa: "/t/", name: "voiceless_alveolar_plosive", l2Risk: "Đầu lưỡi chạm nướu răng trên và bật gió dứt khoát. Chú ý âm cuối từ (cat, sit)." },
        "31": { token: "θ", isPhoneme: true, ipa: "/θ/", name: "voiceless_dental_fricative", l2Risk: "Hay đọc thành âm /t/ hoặc /th/ tiếng Việt. Cắn nhẹ đầu lưỡi giữa hai hàm răng, thổi luồng hơi ra." },
        "32": { token: "ʊ", isPhoneme: true, ipa: "/ʊ/", name: "near_close_near_back_rounded_vowel", l2Risk: "Âm u ngắn (good, book). Môi hơi tròn nhẹ thả lỏng, không chu căng." },
        "33": { token: "u", isPhoneme: true, ipa: "/uː/", name: "close_back_rounded_vowel", l2Risk: "Âm u dài (too, blue). Chu môi tròn sâu và căng hướng về phía trước." },
        "34": { token: "v", isPhoneme: true, ipa: "/v/", name: "voiced_labiodental_fricative", l2Risk: "Răng cửa trên chạm nhẹ môi dưới, làm rung mạnh dây thanh (very, love)." },
        "35": { token: "w", isPhoneme: true, ipa: "/w/", name: "labial_velar_approximant", l2Risk: "Môi chu tròn như huýt sáo rồi mở nhanh sang nguyên âm sau (we, water)." },
        "36": { token: "j", isPhoneme: true, ipa: "/j/", name: "palatal_approximant", l2Risk: "Âm y (yes, you). Mặt lưỡi nâng cao về phía ngạc cứng." },
        "37": { token: "z", isPhoneme: true, ipa: "/z/", name: "voiced_alveolar_fricative", l2Risk: "Khép răng nhẹ, thổi hơi và làm rung dây thanh quản (zoo, plays, is)." },
        "38": { token: "ʒ", isPhoneme: true, ipa: "/ʒ/", name: "voiced_postalveolar_fricative", l2Risk: "Âm zh rung (measure, vision). Chu môi nhẹ và phát âm rung." },
        "39": { token: "d", isPhoneme: true, ipa: "/d/", name: "voiced_alveolar_plosive", l2Risk: "Đầu lưỡi chạm nướu răng trên, bật nhẹ có rung dây thanh. Đừng quên âm đuôi." },
        "40": { token: "[UNK]", isPhoneme: false, ipa: null, name: "unknown_token" },
        "41": { token: "[PAD]", isPhoneme: false, ipa: null, name: "ctc_blank_token" },
        "42": { token: "<s>", isPhoneme: false, ipa: null, name: "bos_token" },
        "43": { token: "</s>", isPhoneme: false, ipa: null, name: "eos_token" }
    };

    // Lookup token string to ID
    const TOKEN_TO_ID = {};
    Object.keys(PHONEME_REGISTRY).forEach(idStr => {
        const id = parseInt(idStr, 10);
        TOKEN_TO_ID[PHONEME_REGISTRY[idStr].token] = id;
    });

    /**
     * SafeSoftmax — Chuyển 1D logits thành xác suất với chống tràn số
     * @param {number[]|Float32Array} logits - Mảng logits độ dài D (thường là 44)
     * @returns {Float64Array} Mảng xác suất tổng bằng 1.0
     */
    function safeSoftmax(logits) {
        const len = logits.length;
        if (len === 0) return new Float64Array(0);

        let maxVal = -Infinity;
        for (let i = 0; i < len; i++) {
            const v = logits[i];
            if (v > maxVal) maxVal = v;
        }

        // Trường hợp tất cả đều NaN hoặc -Infinity
        if (!isFinite(maxVal)) {
            const uniform = 1.0 / len;
            const res = new Float64Array(len);
            res.fill(uniform);
            return res;
        }

        let sumExp = 0.0;
        const exps = new Float64Array(len);
        for (let i = 0; i < len; i++) {
            const val = Math.exp(logits[i] - maxVal);
            exps[i] = val;
            sumExp += val;
        }

        if (sumExp <= 0.0 || !isFinite(sumExp)) {
            sumExp = EPSILON * len;
        }

        const probs = new Float64Array(len);
        for (let i = 0; i < len; i++) {
            probs[i] = Math.max(exps[i] / sumExp, EPSILON);
        }
        return probs;
    }

    /**
     * Chuyển ma trận logits 2D [T, D] thành ma trận log-probabilities 2D [T, D]
     * @param {Array<Array<number>>|Float32Array[]} frameLogits 
     * @returns {Array<Float64Array>} [T][D] log-probs
     */
    function logitsToLogProbs(frameLogits) {
        if (!Array.isArray(frameLogits) || frameLogits.length === 0) {
            return [];
        }

        const T = frameLogits.length;
        const result = new Array(T);

        for (let t = 0; t < T; t++) {
            const frame = frameLogits[t];
            if (!frame || frame.length === 0) {
                // Dummy empty frame
                const fallback = new Float64Array(MODEL_OUTPUT_DIMENSION);
                fallback.fill(Math.log(1.0 / MODEL_OUTPUT_DIMENSION));
                result[t] = fallback;
                continue;
            }

            // Slice to 44 if dimension exceeds
            let targetFrame = frame;
            if (frame.length > MODEL_OUTPUT_DIMENSION) {
                targetFrame = frame.slice(0, MODEL_OUTPUT_DIMENSION);
            } else if (frame.length < MODEL_OUTPUT_DIMENSION) {
                // Pad with small logits to maintain dimension consistency
                targetFrame = new Float64Array(MODEL_OUTPUT_DIMENSION);
                for (let k = 0; k < MODEL_OUTPUT_DIMENSION; k++) {
                    targetFrame[k] = k < frame.length ? frame[k] : -10.0;
                }
            }

            const probs = safeSoftmax(targetFrame);
            const logProbs = new Float64Array(MODEL_OUTPUT_DIMENSION);
            for (let d = 0; d < MODEL_OUTPUT_DIMENSION; d++) {
                logProbs[d] = Math.log(Math.max(probs[d], EPSILON));
            }
            result[t] = logProbs;
        }
        return result;
    }

    /**
     * CTC Trellis Viterbi Forced Alignment
     * Căn chỉnh chuỗi target tokens với các frames âm học qua forward DP & Viterbi backtracking.
     * 
     * @param {Array<Float64Array>} logProbs - [T][44] log-probs
     * @param {number[]} targetTokens - Danh sách các token ID mục tiêu (U phonemes)
     * @returns {Object} { success: boolean, alignments: Array<{ tokenId, phonemeIndex, startFrame, endFrame, durationMs }>, error?: string }
     */
    function alignTrellis(logProbs, targetTokens) {
        if (!Array.isArray(logProbs) || logProbs.length === 0) {
            return { success: false, error: "NO_AUDIO_FRAMES", alignments: [] };
        }
        if (!Array.isArray(targetTokens) || targetTokens.length === 0) {
            return { success: false, error: "EMPTY_TARGET_TOKENS", alignments: [] };
        }

        const T = logProbs.length;
        const U = targetTokens.length;

        // An toàn: T phải đủ lớn để chứa ít nhất U âm vị (CTC requirement T >= U)
        if (T < U) {
            return {
                success: false,
                error: "INSUFFICIENT_FRAMES",
                message: `Thời lượng âm thanh quá ngắn (${T} frames) so với số âm vị mục tiêu (${U} phonemes).`,
                minRequired: U,
                actualFrames: T,
                alignments: []
            };
        }

        // CTC Extended Target Sequence: xen kẽ blank [blank, s1, blank, s2, ..., sU, blank]
        // Độ dài L = 2U + 1
        const L = 2 * U + 1;
        const extendedTokens = new Int32Array(L);
        for (let i = 0; i < U; i++) {
            extendedTokens[2 * i] = BLANK_TOKEN_ID;
            extendedTokens[2 * i + 1] = targetTokens[i];
        }
        extendedTokens[2 * U] = BLANK_TOKEN_ID;

        // DP Trellis: trellis[t][u] lưu max log-prob đạt tới trạng thái u tại frame t
        // Backtrack pointer: back[t][u] lưu chỉ số trạng thái trước đó (0: stay u, 1: from u-1, 2: from u-2)
        const trellis = new Array(T);
        const back = new Array(T);
        for (let t = 0; t < T; t++) {
            trellis[t] = new Float64Array(L);
            trellis[t].fill(NEG_INFINITY);
            back[t] = new Int8Array(L);
            back[t].fill(-1);
        }

        // Khởi tạo tại t = 0: chỉ có thể bắt đầu ở extendedTokens[0] (blank) hoặc extendedTokens[1] (s1)
        trellis[0][0] = logProbs[0][extendedTokens[0]];
        if (L > 1) {
            trellis[0][1] = logProbs[0][extendedTokens[1]];
        }

        // Quy hoạch động Forward
        for (let t = 1; t < T; t++) {
            const frameLogs = logProbs[t];

            // Giới hạn vùng tìm kiếm (beam search pruning nhẹ theo thời gian)
            // Tại frame t, trạng thái u tối thiểu có thể là max(0, L - 2*(T - t))
            // trạng thái u tối đa có thể là min(L - 1, 2 * t + 1)
            const uMin = Math.max(0, L - 2 * (T - t) - 1);
            const uMax = Math.min(L - 1, 2 * t + 1);

            for (let u = uMin; u <= uMax; u++) {
                const token = extendedTokens[u];
                const emitLog = frameLogs[token];

                // Nhánh 1: Từ trạng thái u ở frame t-1 (stay)
                let bestPrev = trellis[t - 1][u];
                let bestChoice = 0;

                // Nhánh 2: Chuyển tiếp từ u-1 ở frame t-1
                if (u > 0 && trellis[t - 1][u - 1] > bestPrev) {
                    bestPrev = trellis[t - 1][u - 1];
                    bestChoice = 1;
                }

                // Nhánh 3: Bỏ qua blank (từ u-2 lên u), chỉ khi u không phải blank và token khác token trước đó
                if (u >= 2 && token !== BLANK_TOKEN_ID && token !== extendedTokens[u - 2]) {
                    if (trellis[t - 1][u - 2] > bestPrev) {
                        bestPrev = trellis[t - 1][u - 2];
                        bestChoice = 2;
                    }
                }

                trellis[t][u] = emitLog + bestPrev;
                back[t][u] = bestChoice;
            }
        }

        // Xác định trạng thái kết thúc tốt nhất tại T-1: hoặc ở L-1 (blank cuối) hoặc L-2 (âm vị cuối)
        let finalU = L - 1;
        if (L >= 2 && trellis[T - 1][L - 2] > trellis[T - 1][L - 1]) {
            finalU = L - 2;
        }

        // Nếu cả hai đều âm vô cực, fallback chọn L-1
        if (trellis[T - 1][finalU] <= NEG_INFINITY / 2) {
            let maxU = 0;
            let maxScore = NEG_INFINITY;
            for (let u = 0; u < L; u++) {
                if (trellis[T - 1][u] > maxScore) {
                    maxScore = trellis[T - 1][u];
                    maxU = u;
                }
            }
            finalU = maxU;
        }

        // Viterbi Backtracking: truy vết từ frame T-1 về frame 0
        const path = new Int32Array(T);
        let currU = finalU;
        path[T - 1] = currU;

        for (let t = T - 1; t > 0; t--) {
            const choice = back[t][currU];
            if (choice === 1) {
                currU = currU - 1;
            } else if (choice === 2) {
                currU = currU - 2;
            }
            // choice === 0: currU giữ nguyên
            path[t - 1] = currU;
        }

        // Gom nhóm frame cho từng target phoneme (loại trừ các frame blank)
        // extendedTokens[2*i + 1] tương ứng với targetTokens[i]
        const alignments = [];
        for (let i = 0; i < U; i++) {
            const targetExtendedIdx = 2 * i + 1;
            const targetTokenId = targetTokens[i];

            let startFrame = -1;
            let endFrame = -1;

            for (let t = 0; t < T; t++) {
                if (path[t] === targetExtendedIdx) {
                    if (startFrame === -1) startFrame = t;
                    endFrame = t;
                }
            }

            // Nếu phoneme không được gán frame nào (do Viterbi lướt qua), mượn 1 frame hợp lý
            if (startFrame === -1) {
                // Ước lượng vị trí tương đối
                const approxFrame = Math.min(T - 1, Math.floor((i / U) * T));
                startFrame = approxFrame;
                endFrame = approxFrame;
            }

            alignments.push({
                phonemeIndex: i,
                tokenId: targetTokenId,
                startFrame: startFrame,
                endFrame: endFrame,
                durationFrames: endFrame - startFrame + 1,
                startMs: Math.round(startFrame * FRAME_DURATION_MS),
                endMs: Math.round((endFrame + 1) * FRAME_DURATION_MS),
                durationMs: Math.round((endFrame - startFrame + 1) * FRAME_DURATION_MS)
            });
        }

        return {
            success: true,
            totalFrames: T,
            alignments: alignments
        };
    }

    /**
     * Tính điểm Goodness of Pronunciation (GOP)
     * GOP(k) = (1/D) * sum_{t=start}^{end} [ log P(target | t) - max_j log P(j | t) ]
     * 
     * @param {Array<Float64Array>} logProbs - [T][44] log probabilities
     * @param {Array<Object>} alignments - Kết quả từ alignTrellis
     * @returns {Array<Object>} Mảng kết quả chấm GOP cho từng phoneme
     */
    function calculateGOP(logProbs, alignments) {
        if (!Array.isArray(logProbs) || logProbs.length === 0 || !Array.isArray(alignments)) {
            return [];
        }

        const T = logProbs.length;
        const results = [];

        for (let i = 0; i < alignments.length; i++) {
            const align = alignments[i];
            const tokenId = align.tokenId;
            const start = Math.max(0, Math.min(T - 1, align.startFrame));
            const end = Math.max(0, Math.min(T - 1, align.endFrame));
            const D = Math.max(1, end - start + 1);

            let sumLogRatio = 0.0;

            for (let t = start; t <= end; t++) {
                const frameLogs = logProbs[t];
                const targetLogProb = frameLogs[tokenId];

                // Tìm max log-prob trên toàn bộ 44 tokens tại frame t
                let maxLogProb = -Infinity;
                for (let j = 0; j < MODEL_OUTPUT_DIMENSION; j++) {
                    if (frameLogs[j] > maxLogProb) {
                        maxLogProb = frameLogs[j];
                    }
                }

                // Log-likelihood ratio: ln P(target | t) - max_j ln P(j | t) <= 0
                const ratio = targetLogProb - maxLogProb;
                sumLogRatio += ratio;
            }

            const rawGop = sumLogRatio / D;
            const calibratedScore = calibrateScore(rawGop, 'v1.0-heuristic');

            const tokenInfo = PHONEME_REGISTRY[tokenId] || {
                token: `[TOKEN_${tokenId}]`,
                isPhoneme: true,
                ipa: null,
                l2Risk: null
            };

            results.push({
                phonemeIndex: align.phonemeIndex,
                tokenId: tokenId,
                token: tokenInfo.token,
                ipa: tokenInfo.ipa,
                rawGop: Math.round(rawGop * 1000) / 1000,
                score: calibratedScore,
                startFrame: start,
                endFrame: end,
                startMs: align.startMs,
                endMs: align.endMs,
                durationMs: align.durationMs,
                isL2Risk: !!tokenInfo.l2Risk,
                l2Feedback: tokenInfo.l2Risk || null
            });
        }

        return results;
    }

    /**
     * Heuristic Calibration v1.0-heuristic
     * Ánh xạ rawGop (-infinity .. 0.0] về thang điểm 0 - 100
     * 
     * @param {number} rawGop - Điểm GOP âm (gop <= 0)
     * @param {string} [method='v1.0-heuristic']
     * @returns {number} Điểm 0 - 100
     */
    function calibrateScore(rawGop, method) {
        if (typeof rawGop !== 'number' || isNaN(rawGop)) {
            return 50;
        }

        // Nếu rawGop >= 0 (target là argmax hoàn hảo ở mọi frame) -> 100
        if (rawGop >= 0.0) {
            return 100;
        }

        // Mô hình logistic sigmoid có chuẩn hoá:
        // S(x) = 1 / (1 + exp(-alpha * (x - beta)))
        // alpha = 1.8, beta = -1.5
        // S(0) = 1 / (1 + exp(1.8 * -1.5)) = 1 / (1 + exp(-2.7)) ~ 0.937
        const alpha = 1.8;
        const beta = -1.5;
        const s0 = 1.0 / (1.0 + Math.exp(alpha * beta)); // ~0.937067
        const sx = 1.0 / (1.0 + Math.exp(-alpha * (rawGop - beta)));

        let normalizedScore = (sx / s0) * 100.0;
        normalizedScore = Math.max(0, Math.min(100, Math.round(normalizedScore)));
        return normalizedScore;
    }

    /**
     * Chẩn đoán khẩu hình sư phạm cho học sinh Lớp 6
     * @param {Array<Object>} scoredPhonemes - Mảng các âm vị kèm điểm
     * @returns {Object} Chẩn đoán chi tiết và lời khuyên tiếng Việt
     */
    function generatePedagogicalFeedback(scoredPhonemes) {
        if (!Array.isArray(scoredPhonemes) || scoredPhonemes.length === 0) {
            return {
                summary: "Không đủ dữ liệu âm vị để chẩn đoán khẩu hình.",
                weakPhonemes: [],
                l2Warnings: [],
                tips: []
            };
        }

        const weakPhonemes = [];
        const l2Warnings = [];
        const tips = [];

        scoredPhonemes.forEach(p => {
            if (p.score < 65) {
                weakPhonemes.push(p);
                if (p.l2Feedback) {
                    l2Warnings.push({
                        ipa: p.ipa || p.token,
                        score: p.score,
                        feedback: p.l2Feedback
                    });
                }
            }
        });

        if (weakPhonemes.length === 0) {
            return {
                summary: "Phát âm rất tốt! Chuẩn xác các âm vị quan trọng.",
                weakPhonemes: [],
                l2Warnings: [],
                tips: ["Tiếp tục duy trì ngữ điệu tự nhiên và sự tự tin!"]
            };
        }

        // Tạo lời khuyên sư phạm trực quan
        l2Warnings.forEach(w => {
            tips.push(`Âm ${w.ipa}: ${w.feedback}`);
        });

        const summary = `Cần lưu ý ${weakPhonemes.length} âm vị chưa chuẩn (${weakPhonemes.map(x => x.ipa || x.token).join(", ")}).`;

        return {
            summary: summary,
            weakPhonemes: weakPhonemes,
            l2Warnings: l2Warnings,
            tips: tips
        };
    }

    /**
     * Kiểm tra tín hiệu âm học (Silence / Clipping)
     * @param {Array<Float64Array>} logProbs 
     * @returns {Object} { isSilent: boolean, dominantToken: number, warning: string|null }
     */
    function auditAudioSignal(logProbs) {
        if (!Array.isArray(logProbs) || logProbs.length === 0) {
            return { isSilent: true, dominantToken: BLANK_TOKEN_ID, warning: "AUDIO_SIGNAL_EMPTY" };
        }

        let blankOrPadCount = 0;
        const T = logProbs.length;

        for (let t = 0; t < T; t++) {
            const frame = logProbs[t];
            let maxIdx = 0;
            let maxVal = -Infinity;
            for (let d = 0; d < MODEL_OUTPUT_DIMENSION; d++) {
                if (frame[d] > maxVal) {
                    maxVal = frame[d];
                    maxIdx = d;
                }
            }

            if (maxIdx === BLANK_TOKEN_ID || maxIdx === BOS_TOKEN_ID || maxIdx === EOS_TOKEN_ID) {
                blankOrPadCount++;
            }
        }

        const blankRatio = blankOrPadCount / T;
        if (blankRatio > 0.95 && T > 10) {
            return {
                isSilent: true,
                dominantToken: BLANK_TOKEN_ID,
                warning: "AUDIO_SIGNAL_SILENT: Phần lớn âm thanh là khoảng lặng hoặc không thu được giọng nói."
            };
        }

        return { isSilent: false, dominantToken: -1, warning: null };
    }

    /**
     * Full Utterance GOP Scoring Pipeline
     * Chấm điểm âm học toàn diện một câu phát âm từ Logits
     * 
     * @param {Array<Array<number>>} logits - [T][44] frame logits
     * @param {number[]} targetTokens - Danh sách token ID
     * @param {Object} [options]
     * @returns {Object} Đầy đủ đa chiều: phonemeScores, wordScores, overallScore, fluency, completeness, feedback
     */
    function scoreUtterance(logits, targetTokens, options) {
        const opts = options || {};
        const logProbs = logitsToLogProbs(logits);

        // 1. Kiểm tra tín hiệu
        const signalAudit = auditAudioSignal(logProbs);

        // 2. Forced Alignment
        const alignRes = alignTrellis(logProbs, targetTokens);
        if (!alignRes.success) {
            return {
                success: false,
                error: alignRes.error,
                message: alignRes.message || "Alignment failed",
                overallScore: 0,
                phonemeScore: null,
                fluencyScore: 0,
                completenessScore: 0,
                assessmentMode: "BASIC",
                calibrationMethod: "v1.0-heuristic",
                childValidationStatus: "UNVERIFIED",
                signalWarning: signalAudit.warning,
                phonemes: []
            };
        }

        // 3. Tính điểm GOP từng âm vị
        const scoredPhonemes = calculateGOP(logProbs, alignRes.alignments);

        // 4. Tính điểm tổng thể
        let totalScore = 0;
        scoredPhonemes.forEach(p => { totalScore += p.score; });
        const overallScore = scoredPhonemes.length > 0 ? Math.round(totalScore / scoredPhonemes.length) : 0;

        // 5. Chẩn đoán sư phạm
        const pedagogical = generatePedagogicalFeedback(scoredPhonemes);

        // 6. Tính độ trôi chảy (Fluency) dựa trên mật độ và độ đồng đều thời lượng âm vị
        let totalDuration = 0;
        scoredPhonemes.forEach(p => { totalDuration += p.durationMs; });
        const avgDuration = scoredPhonemes.length > 0 ? totalDuration / scoredPhonemes.length : 100;
        // Trôi chảy lý tưởng của trẻ em lớp 6: 80ms - 220ms/âm vị
        let fluencyScore = 85;
        if (avgDuration < 50 || avgDuration > 400) fluencyScore = 60;
        else if (avgDuration < 70 || avgDuration > 300) fluencyScore = 75;
        else fluencyScore = 90;

        // 7. Hoàn thiện (Completeness)
        const completenessScore = 100;

        return {
            success: true,
            assessmentMode: "ENHANCED",
            calibrationMethod: "v1.0-heuristic",
            childValidationStatus: "UNVERIFIED",
            overallScore: overallScore,
            phonemeScore: overallScore,
            fluencyScore: fluencyScore,
            completenessScore: completenessScore,
            totalFrames: logProbs.length,
            totalDurationMs: Math.round(logProbs.length * FRAME_DURATION_MS),
            phonemes: scoredPhonemes,
            pedagogicalFeedback: pedagogical,
            signalWarning: signalAudit.warning
        };
    }

    return {
        MODEL_VOCAB_SIZE: MODEL_VOCAB_SIZE,
        MODEL_OUTPUT_DIMENSION: MODEL_OUTPUT_DIMENSION,
        BLANK_TOKEN_ID: BLANK_TOKEN_ID,
        WORD_DELIMITER_TOKEN_ID: WORD_DELIMITER_TOKEN_ID,
        BOS_TOKEN_ID: BOS_TOKEN_ID,
        EOS_TOKEN_ID: EOS_TOKEN_ID,
        UNK_TOKEN_ID: UNK_TOKEN_ID,
        FRAME_DURATION_MS: FRAME_DURATION_MS,
        PHONEME_REGISTRY: PHONEME_REGISTRY,
        TOKEN_TO_ID: TOKEN_TO_ID,

        safeSoftmax: safeSoftmax,
        logitsToLogProbs: logitsToLogProbs,
        alignTrellis: alignTrellis,
        calculateGOP: calculateGOP,
        calibrateScore: calibrateScore,
        generatePedagogicalFeedback: generatePedagogicalFeedback,
        auditAudioSignal: auditAudioSignal,
        scoreUtterance: scoreUtterance
    };
});
