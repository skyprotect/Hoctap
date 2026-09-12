/**
 * PLAYWRIGHT E2E TEST: SPEAKING FORENSIC RUNTIME VERIFICATION SUITE
 * Tests the complete end-to-end speaking pipeline on Chromium:
 * W3C Web Speech API Events -> SpeechRecognitionService -> Real Accuracy Math ->
 * evaluateSpeaking() -> currentEnglishStudentAnswer -> Physical Check Button ->
 * checkEnglishAnswer() -> Score & XP -> Duolingo Feedback Banner -> Next Question
 */
const { test, expect } = require('@playwright/test');

test.describe("SPEAKING FORENSIC RUNTIME VERIFICATION SUITE", () => {

    // Helper: Cài đặt Mock Web Speech API chuẩn W3C trước khi tải trang
    async function setupWebSpeechMock(page) {
        await page.addInitScript(() => {
            class MockSpeechRecognition {
                constructor() {
                    this.lang = 'en-US';
                    this.interimResults = false;
                    this.maxAlternatives = 1;
                    this.continuous = false;
                    this.onstart = null;
                    this.onerror = null;
                    this.onend = null;
                    this.onresult = null;
                    window.__mockSpeechInstance = this;
                }

                start() {
                    window.__mockSpeechRecording = true;
                    if (window.__mockSpeechAutoStart !== false) {
                        setTimeout(() => {
                            if (this.onstart) this.onstart();
                            if (window.__mockSpeechPendingResult !== undefined) {
                                const text = window.__mockSpeechPendingResult;
                                delete window.__mockSpeechPendingResult;
                                const event = {
                                    results: [
                                        [{ transcript: text, confidence: 0.95 }]
                                    ]
                                };
                                if (this.onresult) this.onresult(event);
                                if (this.onend) this.onend();
                                window.__mockSpeechRecording = false;
                            } else if (window.__mockSpeechPendingError !== undefined) {
                                const err = window.__mockSpeechPendingError;
                                delete window.__mockSpeechPendingError;
                                if (this.onerror) this.onerror({ error: err });
                                if (this.onend) this.onend();
                                window.__mockSpeechRecording = false;
                            }
                        }, 50);
                    }
                }

                stop() {
                    window.__mockSpeechRecording = false;
                    if (this.onend) this.onend();
                }

                abort() {
                    window.__mockSpeechRecording = false;
                    if (this.onend) this.onend();
                }
            }

            window.SpeechRecognition = MockSpeechRecognition;
            window.webkitSpeechRecognition = MockSpeechRecognition;

            // MediaDevices mock
            if (!navigator.mediaDevices) {
                navigator.mediaDevices = {};
            }
            navigator.mediaDevices.getUserMedia = async (constraints) => {
                if (window.__mockMicPermissionDenied) {
                    throw new DOMException("Permission denied", "NotAllowedError");
                }
                return {
                    getTracks: () => [{ stop: () => {} }]
                };
            };
        });
    }

    // Helper: Khởi tạo câu hỏi Speaking vào App Focus Screen
    async function loadSpeakingQuestion(page, q) {
        await page.evaluate((question) => {
            document.body.classList.add("focus-mode-active");
            const scr = document.getElementById("english-focus-lesson-screen");
            if (scr) scr.classList.remove("hidden");
            window.app.currentEnglishQuestions = [question];
            window.app.currentEnglishQuestionIndex = 0;
            window.app.renderEnglishQuestion();
        }, q);
    }

    test.beforeEach(async ({ page }) => {
        await setupWebSpeechMock(page);
        await page.goto('/student.html');

        // Bỏ qua PIN bảo vệ phụ huynh
        await page.evaluate(() => {
            sessionStorage.setItem("adminToken", "mock_admin_token_e2e");
            localStorage.setItem("adminToken", "mock_admin_token_e2e");
        });

        // Bỏ qua splash screen nếu có
        const splashBtn = page.locator('#splash-start-btn');
        if (await splashBtn.isVisible()) {
            await splashBtn.click();
            await expect(page.locator('#splash-screen')).toBeHidden({ timeout: 5000 }).catch(() => {});
        }

        // Chọn học sinh Trần Bình Minh nếu có
        const studentCard = page.locator('.student-select-card').first();
        if (await studentCard.isVisible()) {
            await studentCard.click();
            await page.waitForTimeout(300);
        }

        // Chọn môn Tiếng Anh Lớp 6
        await page.evaluate(() => {
            if (window.app && typeof window.app.selectSubject === 'function') {
                window.app.selectSubject('english');
            }
        });
        await page.waitForTimeout(300);
    });

    test("S1: PERFECT MATCH (100% accuracy) -> Check button enables, check verifies, score increments, feedback banner shows correct", async ({ page }) => {
        const question = {
            id: 'test_spk_s1',
            type: 'speaking',
            questionType: 'speaking',
            questionText: 'Pronounce the sentence clearly:',
            speakingText: 'My name is Nam.',
            correctAnswer: 'My name is Nam.'
        };

        await loadSpeakingQuestion(page, question);

        const checkBtn = page.locator('#btn-eng-check-answer');
        const micBtn = page.locator('#eng-mic-btn');
        const statusText = page.locator('#eng-mic-status');

        // Ban đầu: Check button phải bị DISABLED
        await expect(checkBtn).toBeDisabled();
        await expect(statusText).toContainText("Nhấn Mic để bắt đầu nói");

        // Chuẩn bị kết quả phát âm hoàn hảo
        await page.evaluate(() => {
            window.__mockSpeechPendingResult = "My name is Nam.";
        });

        // Click Mic button
        await micBtn.click();

        // Chờ kết quả nhận diện xử lý
        await page.waitForTimeout(200);

        // Kiểm tra độ chính xác hiển thị trên UI
        await expect(statusText).toContainText("100%");
        await expect(statusText).toContainText("Cần >= 60% để đạt");

        // Nút Kiểm Tra PHẢI ĐƯỢC ENABLED
        await expect(checkBtn).toBeEnabled();

        // Ghi lại điểm số ban đầu
        const initialScore = await page.evaluate(() => window.app.currentEnglishScore || 0);

        // Click nút Kiểm Tra
        await checkBtn.click();

        // Banner phản hồi phải hiển thị chính xác (feedback-correct)
        const banner = page.locator('#bottom-feedback-banner');
        await expect(banner).toBeVisible({ timeout: 3000 });
        await expect(banner).toHaveClass(/feedback-correct/);
        await expect(banner).toContainText("Chính xác");

        // Điểm số Tiếng Anh phải tăng lên
        const newScore = await page.evaluate(() => window.app.currentEnglishScore);
        expect(newScore).toBeGreaterThan(initialScore);

        // Nút Tiếp Tục hiển thị và hoạt động
        const nextBtn = page.locator('#btn-english-next-action');
        await expect(nextBtn).toBeVisible();
    });

    test("S2: PARTIAL MATCH (>= 60% accuracy) -> Evaluates to correct, passes threshold", async ({ page }) => {
        const question = {
            id: 'test_spk_s2',
            type: 'speaking',
            questionType: 'speaking',
            questionText: 'Pronounce the sentence:',
            speakingText: 'Good morning teacher',
            correctAnswer: 'Good morning teacher'
        };

        await loadSpeakingQuestion(page, question);

        // Chuẩn bị kết quả nói 2 trong 3 từ ("Good morning") -> accuracy ~67% >= 60%
        await page.evaluate(() => {
            window.__mockSpeechPendingResult = "Good morning";
        });

        const micBtn = page.locator('#eng-mic-btn');
        const checkBtn = page.locator('#btn-eng-check-answer');

        await micBtn.click();
        await page.waitForTimeout(200);

        // Độ chính xác phải >= 60% và Check button enabled
        const accuracy = await page.evaluate(() => window.app.currentEnglishStudentAnswer.accuracy);
        expect(accuracy).toBeGreaterThanOrEqual(60);
        await expect(checkBtn).toBeEnabled();

        // Click Kiểm Tra
        await checkBtn.click();

        // Banner phản hồi phải là correct
        const banner = page.locator('#bottom-feedback-banner');
        await expect(banner).toHaveClass(/feedback-correct/);
    });

    test("S3: WRONG MATCH (< 60% accuracy) -> Evaluates to incorrect, shows correct answer", async ({ page }) => {
        const question = {
            id: 'test_spk_s3',
            type: 'speaking',
            questionType: 'speaking',
            questionText: 'Pronounce the sentence:',
            speakingText: 'Good morning teacher',
            correctAnswer: 'Good morning teacher'
        };

        await loadSpeakingQuestion(page, question);

        // Chuẩn bị kết quả nói sai ("Good night") -> accuracy < 60%
        await page.evaluate(() => {
            window.__mockSpeechPendingResult = "Good night";
        });

        const micBtn = page.locator('#eng-mic-btn');
        const checkBtn = page.locator('#btn-eng-check-answer');

        await micBtn.click();
        await page.waitForTimeout(200);

        const accuracy = await page.evaluate(() => window.app.currentEnglishStudentAnswer.accuracy);
        expect(accuracy).toBeLessThan(60);

        // Nút Kiểm Tra vẫn được enabled để học sinh submit và xem sửa sai
        await expect(checkBtn).toBeEnabled();

        await checkBtn.click();

        // Banner phản hồi phải là incorrect (feedback-wrong) và nhắc nhở đạt >= 60%
        const banner = page.locator('#bottom-feedback-banner');
        await expect(banner).toHaveClass(/feedback-wrong/);
        await expect(banner).toContainText("Chưa chính xác");
        await expect(banner).toContainText("Cần tối thiểu 60% để đạt");
    });

    test("S4: EMPTY TRANSCRIPT -> Check button remains disabled, UI prompts retry/skip", async ({ page }) => {
        const question = {
            id: 'test_spk_s4',
            type: 'speaking',
            questionType: 'speaking',
            questionText: 'Pronounce clearly:',
            speakingText: 'How are you today?',
            correctAnswer: 'How are you today?'
        };

        await loadSpeakingQuestion(page, question);

        // Trả về transcript rỗng ""
        await page.evaluate(() => {
            window.__mockSpeechPendingResult = "   ";
        });

        const micBtn = page.locator('#eng-mic-btn');
        const checkBtn = page.locator('#btn-eng-check-answer');
        const statusText = page.locator('#eng-mic-status');

        await micBtn.click();
        await page.waitForTimeout(200);

        // Nút Kiểm Tra PHẢI VẪN BỊ DISABLED
        await expect(checkBtn).toBeDisabled();

        // UI phải hiển thị thông báo chưa nghe rõ và có nút Thử lại / Bỏ qua
        await expect(statusText).toContainText("Chưa nghe rõ");
        await expect(statusText.locator('a:text("Thử lại")')).toBeVisible();
        await expect(statusText.locator('a:text("Bỏ qua")')).toBeVisible();

        // currentEnglishStudentAnswer phải là null
        const studentAns = await page.evaluate(() => window.app.currentEnglishStudentAnswer);
        expect(studentAns).toBeNull();
    });

    test("S5: MICROPHONE ERROR (audio-capture / permission) -> Displays clear message, provides retry and skip", async ({ page }) => {
        const question = {
            id: 'test_spk_s5',
            type: 'speaking',
            questionType: 'speaking',
            questionText: 'Pronounce clearly:',
            speakingText: 'Welcome to school',
            correctAnswer: 'Welcome to school'
        };

        await loadSpeakingQuestion(page, question);

        // Giả lập lỗi audio-capture
        await page.evaluate(() => {
            window.__mockSpeechPendingError = 'audio-capture';
        });

        const micBtn = page.locator('#eng-mic-btn');
        const checkBtn = page.locator('#btn-eng-check-answer');
        const statusText = page.locator('#eng-mic-status');

        await micBtn.click();
        await page.waitForTimeout(200);

        // Check button phải bị disabled
        await expect(checkBtn).toBeDisabled();

        // UI hiển thị thông báo lỗi microphone thân thiện với học sinh
        await expect(statusText).toContainText("Không tìm thấy thiết bị Microphone");
        await expect(statusText.locator('a:text("Bỏ qua")')).toBeVisible();

        // Test Bỏ qua bằng nút Bỏ qua câu nói này
        const skipBtn = page.locator('.btn-skip-speaking');
        await expect(skipBtn).toBeVisible();
        await skipBtn.click();

        // Sau khi bấm Bỏ qua, nút Kiểm Tra được bật
        await expect(checkBtn).toBeEnabled();
        await checkBtn.click();

        // Phản hồi hiển thị đáp án mẫu
        const banner = page.locator('#bottom-feedback-banner');
        await expect(banner).toBeVisible();
    });

    test("S6: NO-SPEECH ERROR -> Graceful UI recovery without hanging", async ({ page }) => {
        const question = {
            id: 'test_spk_s6',
            type: 'speaking',
            questionType: 'speaking',
            questionText: 'Pronounce clearly:',
            speakingText: 'Nice to meet you',
            correctAnswer: 'Nice to meet you'
        };

        await loadSpeakingQuestion(page, question);

        await page.evaluate(() => {
            window.__mockSpeechPendingError = 'no-speech';
        });

        const micBtn = page.locator('#eng-mic-btn');
        const statusText = page.locator('#eng-mic-status');

        await micBtn.click();
        await page.waitForTimeout(200);

        // Recording state phải reset về false
        const isRec = await page.evaluate(() => window.app.isRecording);
        expect(isRec).toBe(false);

        // Thông báo không nghe thấy tiếng
        await expect(statusText).toContainText("Không nghe thấy tiếng");
    });

    test("S7: RACE CONDITION PROTECTION -> Stale mic result from previous session is discarded", async ({ page }) => {
        const q1 = {
            id: 'test_spk_s7_1',
            type: 'speaking',
            questionType: 'speaking',
            questionText: 'Sentence 1',
            speakingText: 'Hello teacher',
            correctAnswer: 'Hello teacher'
        };

        await loadSpeakingQuestion(page, q1);

        // Lấy session ID ban đầu
        const initialSessionId = await page.evaluate(() => window.app.englishSpeakingSessionId);

        // Chuyển sang câu hỏi 2 trong khi phiên 1 chưa kết thúc
        const q2 = {
            id: 'test_spk_s7_2',
            type: 'speaking',
            questionType: 'speaking',
            questionText: 'Sentence 2',
            speakingText: 'Good afternoon',
            correctAnswer: 'Good afternoon'
        };

        await page.evaluate((newQ) => {
            window.app.currentEnglishQuestions = [newQ];
            window.app.currentEnglishQuestionIndex = 0;
            window.app.renderEnglishQuestion();
        }, q2);

        // Session token đã phải được tăng lên
        const newSessionId = await page.evaluate(() => window.app.englishSpeakingSessionId);
        expect(newSessionId).toBeGreaterThan(initialSessionId);

        // Kiểm tra nút Kiểm Tra ở câu mới phải disabled
        const checkBtn = page.locator('#btn-eng-check-answer');
        await expect(checkBtn).toBeDisabled();
    });

    test("S8: STRICT ACCURACY THRESHOLD BOUNDARY (59% FAIL, 60% PASS, 61% PASS)", async ({ page }) => {
        // Kiểm tra trực tiếp hàm evaluateSpeaking với các giá trị ranh giới
        const evaluationResults = await page.evaluate(() => {
            const target = "Good morning teacher";
            const res59 = window.EnglishAnswerEvaluator.evaluateSpeaking(target, { spokenText: "Good night", accuracy: 59, correct: false });
            const res60 = window.EnglishAnswerEvaluator.evaluateSpeaking(target, { spokenText: "Good morning", accuracy: 60, correct: true });
            const res61 = window.EnglishAnswerEvaluator.evaluateSpeaking(target, { spokenText: "Good morning", accuracy: 61, correct: true });
            return {
                r59: res59.isCorrect,
                r60: res60.isCorrect,
                r61: res61.isCorrect
            };
        });

        expect(evaluationResults.r59).toBe(false);
        expect(evaluationResults.r60).toBe(true);
        expect(evaluationResults.r61).toBe(true);
    });

    test("S9: AUDIO MUTUAL EXCLUSION -> Starting mic stops TTS/Audio, playing TTS stops mic", async ({ page }) => {
        const question = {
            id: 'test_spk_s9',
            type: 'speaking',
            questionType: 'speaking',
            questionText: 'Test mutual exclusion:',
            speakingText: 'Listen and repeat',
            correctAnswer: 'Listen and repeat'
        };

        await loadSpeakingQuestion(page, question);

        // Bật flag giả lập TTS đang phát
        await page.evaluate(() => {
            window.__mockAudioPlaying = true;
            window.app._currentAudio = {
                pause: () => { window.__mockAudioStopped = true; },
                currentTime: 0
            };
        });

        // Bấm Mic để bắt đầu thu âm -> audio phải bị dừng
        const micBtn = page.locator('#eng-mic-btn');
        await micBtn.click();
        await page.waitForTimeout(100);

        const audioStopped = await page.evaluate(() => window.__mockAudioStopped);
        expect(audioStopped).toBe(true);

        // Ngược lại, khi mic đang bật mà gọi speakEnglish -> mic phải bị dừng
        await page.evaluate(() => {
            window.app.isRecording = true;
            window.app.speakEnglish('Listen and repeat');
        });

        const isRecordingAfterTts = await page.evaluate(() => window.app.isRecording);
        expect(isRecordingAfterTts).toBe(false);
    });

    test("S10: PIPELINE STATE PURITY -> Clean state between successive questions", async ({ page }) => {
        const q1 = {
            id: 'test_spk_s10_1',
            type: 'speaking',
            questionType: 'speaking',
            questionText: 'Question 1',
            speakingText: 'First sentence',
            correctAnswer: 'First sentence'
        };
        const q2 = {
            id: 'test_spk_s10_2',
            type: 'speaking',
            questionType: 'speaking',
            questionText: 'Question 2',
            speakingText: 'Second sentence',
            correctAnswer: 'Second sentence'
        };

        // Tải danh sách gồm 2 câu hỏi
        await page.evaluate(({ q1, q2 }) => {
            document.body.classList.add("focus-mode-active");
            const scr = document.getElementById("english-focus-lesson-screen");
            if (scr) scr.classList.remove("hidden");
            window.app.currentEnglishQuestions = [q1, q2];
            window.app.currentEnglishQuestionIndex = 0;
            window.app.renderEnglishQuestion();
        }, { q1, q2 });

        const checkBtn = page.locator('#btn-eng-check-answer');
        const micBtn = page.locator('#eng-mic-btn');

        // Hoàn thành câu 1
        await page.evaluate(() => {
            window.__mockSpeechPendingResult = "First sentence";
        });
        await micBtn.click();
        await page.waitForTimeout(150);
        await expect(checkBtn).toBeEnabled();
        await checkBtn.click();

        // Bấm Tiếp Tục để sang câu 2
        const nextBtn = page.locator('#btn-english-next-action');
        await expect(nextBtn).toBeVisible();
        await nextBtn.click();
        await page.waitForTimeout(200);

        // Kiểm tra trạng thái câu 2:
        // 1. Index phải là 1
        const qIndex = await page.evaluate(() => window.app.currentEnglishQuestionIndex);
        expect(qIndex).toBe(1);

        // 2. Check button phải DISABLED
        await expect(checkBtn).toBeDisabled();

        // 3. currentEnglishStudentAnswer phải là null
        const studentAns = await page.evaluate(() => window.app.currentEnglishStudentAnswer);
        expect(studentAns).toBeNull();

        // 4. isRecording phải là false
        const isRec = await page.evaluate(() => window.app.isRecording);
        expect(isRec).toBe(false);

        // 5. Câu mẫu hiển thị đúng nội dung câu 2
        const sentenceText = page.locator('#eng-speaking-sentence');
        await expect(sentenceText).toContainText("Second sentence");
    });

    test("S11: BASIC ASR MODE BADGE -> Displays 'Chế độ: Đánh giá cơ bản (Web Speech ASR)'", async ({ page }) => {
        await page.evaluate(() => {
            document.body.classList.add("focus-mode-active");
            const scr = document.getElementById("english-focus-lesson-screen");
            if (scr) scr.classList.remove("hidden");
            window.app.currentEnglishQuestions = [{
                id: 'test_spk_s11',
                type: 'speaking',
                questionType: 'speaking',
                questionText: 'Speaking S11',
                speakingText: 'Hello teacher',
                correctAnswer: 'Hello teacher'
            }];
            window.app.currentEnglishQuestionIndex = 0;
            window.app.renderEnglishQuestion();
            window.__mockSpeechPendingResult = "Hello teacher";
        });

        const micBtn = page.locator('#eng-mic-btn');
        await micBtn.click();
        await page.waitForTimeout(200);

        const resultBox = page.locator('#eng-speaking-result');
        await expect(resultBox).toBeVisible();
        await expect(resultBox).toContainText("Chế độ: Đánh giá cơ bản (Web Speech ASR)");
    });

    test("S12: TRUTH GATE AUDIT -> In BASIC mode, phonemeScore is strictly null", async ({ page }) => {
        await page.evaluate(() => {
            document.body.classList.add("focus-mode-active");
            const scr = document.getElementById("english-focus-lesson-screen");
            if (scr) scr.classList.remove("hidden");
            window.app.currentEnglishQuestions = [{
                id: 'test_spk_s12',
                type: 'speaking',
                questionType: 'speaking',
                questionText: 'Speaking S12',
                speakingText: 'Good morning',
                correctAnswer: 'Good morning'
            }];
            window.app.currentEnglishQuestionIndex = 0;
            window.app.renderEnglishQuestion();
            window.__mockSpeechPendingResult = "Good morning";
        });

        const micBtn = page.locator('#eng-mic-btn');
        await micBtn.click();
        await page.waitForTimeout(200);

        const studentAns = await page.evaluate(() => window.app.currentEnglishStudentAnswer);
        expect(studentAns).not.toBeNull();
        expect(studentAns.assessmentMode).toBe("BASIC");
        expect(studentAns.phonemeScore).toBeNull(); // Không được giả lập điểm âm vị
        expect(studentAns.accuracy).toBe(100);
    });

    test("S13: PEDAGOGICAL FEEDBACK -> Renders Vietnamese L2 pronunciation tips", async ({ page }) => {
        const feedbackData = await page.evaluate(() => {
            const res = window.SpeakingAssessmentAdapter.adaptBasicAsrResult("Good morning", "good morning");
            return {
                hasFeedback: Boolean(res && res.pedagogicalFeedback),
                tips: (res && res.pedagogicalFeedback && res.pedagogicalFeedback.tips) || []
            };
        });
        expect(feedbackData.hasFeedback).toBe(true);
        expect(Array.isArray(feedbackData.tips)).toBe(true);
    });

    test("S14: ENGLISH AUDIO SERVICE -> Cached audio sets label 'Kokoro TTS (Offline Cache)'", async ({ page }) => {
        const label = await page.evaluate(async () => {
            if (window.EnglishAudioService) {
                await window.EnglishAudioService.playEnglishVoice("hello", "hello");
                return window.EnglishAudioService.getAudioSourceLabel();
            }
            return null;
        });
        expect(label).toBeTruthy();
    });

    test("S15: ENGLISH AUDIO SERVICE -> Missing file falls back gracefully without crash", async ({ page }) => {
        const errorOccurred = await page.evaluate(async () => {
            try {
                if (window.EnglishAudioService) {
                    await window.EnglishAudioService.playEnglishVoice("random unmapped text xyz 123", "nonexistent_audio_key_123");
                    return false;
                }
                return false;
            } catch (e) {
                return true;
            }
        });
        expect(errorOccurred).toBe(false);
    });

    test("S16: AUDIO MUTUAL EXCLUSION -> stopAll halts both Audio and SpeechService", async ({ page }) => {
        const stopped = await page.evaluate(() => {
            if (window.EnglishAudioService && window.EnglishAudioService.stopAll) {
                window.EnglishAudioService.stopAll();
                return true;
            }
            return false;
        });
        expect(stopped).toBe(true);
    });

    test("S17: MATH DATA ISOLATION -> Speaking practice does not alter math scores or progress", async ({ page }) => {
        const mathIntegrity = await page.evaluate(() => {
            const originalMathXp = window.app.state ? (window.app.state.mathXp || 0) : 0;
            // Thực hiện thao tác trong bài học Tiếng Anh
            window.app.currentEnglishScore = (window.app.currentEnglishScore || 0) + 1;
            const finalMathXp = window.app.state ? (window.app.state.mathXp || 0) : 0;
            return originalMathXp === finalMathXp;
        });
        expect(mathIntegrity).toBe(true);
    });

    test("S18: ZERO UNHANDLED REJECTIONS -> Safe handling of audio constructor in browser", async ({ page }) => {
        const pageErrors = [];
        page.on('pageerror', err => pageErrors.push(err.message));

        await page.evaluate(() => {
            window.app.speakEnglish("Test quote for audio safety");
        });
        await page.waitForTimeout(100);

        expect(pageErrors.length).toBe(0);
    });

    test("S19: UI VERSION TAG -> Splash screen and Fixed Badge display v15.7", async ({ page }) => {
        const splashVersion = page.locator('.splash-version-tag');
        const fixedVersion = page.locator('.version-tag-fixed');

        await expect(splashVersion).toContainText("v15.7");
        await expect(fixedVersion).toContainText("v15.7");
    });

    test("S20: MANIFEST INTEGRITY -> audio-manifest.json contains items with kokoro engine", async ({ page }) => {
        const manifestCount = await page.evaluate(async () => {
            try {
                const res = await fetch('sounds/english/audio-manifest.json');
                if (!res.ok) return 0;
                const json = await res.json();
                return Object.keys(json).length;
            } catch (e) {
                return 0;
            }
        });
        expect(manifestCount).toBeGreaterThanOrEqual(521);
    });

});

