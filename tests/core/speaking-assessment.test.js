/**
 * Unit Tests for SpeakingAssessmentAdapter & PronunciationAssessmentEngine
 * 
 * Kiểm tra các nguyên tắc:
 * 1. Hợp đồng tương thích ngược (isCorrect, accuracy, words, formattedHtml)
 * 2. Truth Gate: BASIC mode bắt buộc phonemeScore === null, không giả lập điểm
 * 3. Truth Gate: ENHANCED mode nhận điểm phonemeScore từ GopScorer
 * 4. childValidationStatus luôn là 'UNVERIFIED'
 * 5. Tích hợp chẩn đoán lỗi L2 cho học sinh Lớp 6
 */

const SpeakingAssessmentAdapter = require('../../js/core/speaking-assessment-adapter');
const PronunciationAssessmentEngine = require('../../js/core/pronunciation-assessment-engine');
const GopScorer = require('../../js/core/gop-scorer');

describe('SpeakingAssessmentAdapter & PronunciationAssessmentEngine', () => {

    describe('1. SpeakingAssessmentAdapter — BASIC Mode (ASR Fallback)', () => {
        test('tuân thủ nghiêm ngặt Truth Gate: phonemeScore = null, assessmentMode = BASIC', () => {
            const target = "Good morning teacher";
            const spoken = "good morning teacher";
            const result = SpeakingAssessmentAdapter.adaptBasicAsrResult(target, spoken);

            expect(result.assessmentMode).toBe("BASIC");
            expect(result.phonemeScore).toBeNull(); // KHÔNG ĐƯỢC GIẢ LẬP ĐIỂM ÂM VỊ
            expect(result.calibrationMethod).toBe("none");
            expect(result.childValidationStatus).toBe("UNVERIFIED");

            expect(result.isCorrect).toBe(true);
            expect(result.correct).toBe(true);
            expect(result.accuracy).toBe(100);
            expect(result.totalWords).toBe(3);
            expect(result.correctCount).toBe(3);
            expect(result.formattedHtml).toContain("word-correct");
        });

        test('tính toán đúng khi phát âm sai một từ', () => {
            const target = "I have a cat";
            const spoken = "i have a dog";
            const result = SpeakingAssessmentAdapter.adaptBasicAsrResult(target, spoken);

            expect(result.assessmentMode).toBe("BASIC");
            expect(result.phonemeScore).toBeNull();
            expect(result.totalWords).toBe(4);
            expect(result.correctCount).toBe(3);
            expect(result.accuracy).toBe(75);
            expect(result.isCorrect).toBe(true); // >= 60%
            expect(result.formattedHtml).toContain("word-incorrect");
        });

        test('xử lý an toàn khi chuỗi rỗng hoặc undefined', () => {
            const result = SpeakingAssessmentAdapter.adaptBasicAsrResult("", "");
            expect(result.isCorrect).toBe(false);
            expect(result.accuracy).toBe(0);
            expect(result.phonemeScore).toBeNull();
            expect(result.totalWords).toBe(0);
        });
    });

    describe('2. SpeakingAssessmentAdapter — ENHANCED Mode (Acoustic GOP)', () => {
        test('tích hợp điểm GOP âm học và chẩn đoán khẩu hình', () => {
            const target = "red";
            const spoken = "red";

            // Giả lập output từ GopScorer
            const mockGopOutput = {
                overallScore: 88,
                phonemeScore: 88,
                fluencyScore: 90,
                completenessScore: 100,
                calibrationMethod: "v1.0-heuristic",
                childValidationStatus: "UNVERIFIED",
                phonemes: [
                    { token: "r", ipa: "/r/", score: 85, isL2Risk: true, l2Feedback: "Uốn nhẹ đầu lưỡi..." },
                    { token: "ɛ", ipa: "/e/", score: 90, isL2Risk: false, l2Feedback: null },
                    { token: "d", ipa: "/d/", score: 89, isL2Risk: true, l2Feedback: "Bật nhẹ..." }
                ],
                pedagogicalFeedback: {
                    summary: "Phát âm rất tốt! Chuẩn xác các âm vị quan trọng.",
                    weakPhonemes: [],
                    l2Warnings: [],
                    tips: ["Tiếp tục duy trì!"]
                }
            };

            const result = SpeakingAssessmentAdapter.adaptEnhancedGopResult(target, spoken, mockGopOutput);

            expect(result.assessmentMode).toBe("ENHANCED");
            expect(result.phonemeScore).toBe(88);
            expect(result.calibrationMethod).toBe("v1.0-heuristic");
            expect(result.childValidationStatus).toBe("UNVERIFIED");
            expect(result.phonemes.length).toBe(3);
            expect(result.accuracy).toBeGreaterThanOrEqual(80);
            expect(result.isCorrect).toBe(true);
            expect(result.pedagogicalFeedback.summary).toContain("rất tốt");
        });
    });

    describe('3. PronunciationAssessmentEngine Contract & Status', () => {
        test('getEngineStatus báo cáo đầy đủ thông tin chuẩn xác', () => {
            const status = PronunciationAssessmentEngine.getEngineStatus();
            expect(status.childValidationStatus).toBe("UNVERIFIED");
            expect(status.releaseStatus).toBe("ENGINEERING PROTOTYPE VALIDATED");
            expect(status.assessmentModeSupported.BASIC).toBe(true);
            expect(status.assessmentModeSupported.ENHANCED).toBe(true);
        });

        test('evaluateStatic hoạt động tương thích ngược', () => {
            const staticRes = PronunciationAssessmentEngine.evaluateStatic("hello", "hello");
            expect(staticRes.isCorrect).toBe(true);
            expect(staticRes.accuracy).toBe(100);
            expect(staticRes.phonemeScore).toBeNull();
        });
    });
});
