/**
 * Unit & Characterization Tests cho SpeechRecognitionService
 */
const SimilarityUtils = require('../../js/core/similarity-utils');
const SpeechRecognitionService = require('../../js/core/speech-recognition-service');

describe("SpeechRecognitionService Unit Tests", () => {
    let mockRecognitionInstance;
    let MockSpeechRecognition;

    beforeEach(() => {
        SpeechRecognitionService.stop();

        mockRecognitionInstance = {
            lang: '',
            interimResults: false,
            maxAlternatives: 1,
            start: jest.fn(),
            stop: jest.fn(),
            abort: jest.fn(),
            onstart: null,
            onerror: null,
            onend: null,
            onresult: null
        };

        MockSpeechRecognition = jest.fn(() => mockRecognitionInstance);

        global.window = {
            SpeechRecognition: MockSpeechRecognition,
            webkitSpeechRecognition: MockSpeechRecognition
        };
        global.SimilarityUtils = SimilarityUtils;
    });

    afterEach(() => {
        SpeechRecognitionService.stop();
        jest.restoreAllMocks();
    });

    describe("1. Platform Adapter & Lifecycle Tests", () => {
        test("1. isSupported() trả về false khi không có SpeechRecognition trong window", () => {
            global.window = {};
            expect(SpeechRecognitionService.isSupported()).toBe(false);
        });

        test("2. isSupported() trả về true khi window.SpeechRecognition tồn tại", () => {
            global.window = { SpeechRecognition: MockSpeechRecognition };
            expect(SpeechRecognitionService.isSupported()).toBe(true);
        });

        test("3. Lựa chọn constructor webkitSpeechRecognition khi SpeechRecognition tiêu chuẩn không có", () => {
            global.window = { webkitSpeechRecognition: MockSpeechRecognition };
            expect(SpeechRecognitionService.isSupported()).toBe(true);

            SpeechRecognitionService.start();
            expect(MockSpeechRecognition).toHaveBeenCalledTimes(1);
        });

        test("4. Cấu hình đúng lang = 'en-US' theo mặc định hoặc tùy chỉnh", () => {
            SpeechRecognitionService.start({ lang: 'en-US' });
            expect(mockRecognitionInstance.lang).toBe('en-US');

            SpeechRecognitionService.start({ lang: 'en-GB' });
            expect(mockRecognitionInstance.lang).toBe('en-GB');
        });

        test("5. Cấu hình đúng interimResults = false", () => {
            SpeechRecognitionService.start();
            expect(mockRecognitionInstance.interimResults).toBe(false);
        });

        test("6. Cấu hình đúng maxAlternatives = 1", () => {
            SpeechRecognitionService.start();
            expect(mockRecognitionInstance.maxAlternatives).toBe(1);
        });

        test("7. start() kích hoạt instance.start()", () => {
            const res = SpeechRecognitionService.start();
            expect(res).toBe(true);
            expect(mockRecognitionInstance.start).toHaveBeenCalledTimes(1);
        });

        test("8. stop() dừng recognition khi đang ghi âm", () => {
            SpeechRecognitionService.start();
            // Giả lập recognition đã start
            mockRecognitionInstance.onstart();
            expect(SpeechRecognitionService.isRecording()).toBe(true);

            SpeechRecognitionService.stop();
            expect(mockRecognitionInstance.stop).toHaveBeenCalledTimes(1);
            expect(SpeechRecognitionService.isRecording()).toBe(false);
        });

        test("9. isRecording() phản ánh đúng cờ trạng thái", () => {
            expect(SpeechRecognitionService.isRecording()).toBe(false);
            SpeechRecognitionService.start();
            mockRecognitionInstance.onstart();
            expect(SpeechRecognitionService.isRecording()).toBe(true);
            mockRecognitionInstance.onend();
            expect(SpeechRecognitionService.isRecording()).toBe(false);
        });

        test("10. onStart callback được kích hoạt khi recognition.onstart phát ra", () => {
            const onStartMock = jest.fn();
            SpeechRecognitionService.start({ onStart: onStartMock });
            mockRecognitionInstance.onstart();
            expect(onStartMock).toHaveBeenCalledTimes(1);
        });

        test("11. onResult callback nhận đúng transcript từ event.results", () => {
            const onResultMock = jest.fn();
            SpeechRecognitionService.start({ onResult: onResultMock });

            const fakeEvent = {
                results: [[{ transcript: "hello world" }]]
            };
            mockRecognitionInstance.onresult(fakeEvent);

            expect(onResultMock).toHaveBeenCalledWith("hello world", fakeEvent);
        });

        test("12. onError callback nhận đúng event lỗi và reset isRecording", () => {
            const onErrorMock = jest.fn();
            SpeechRecognitionService.start({ onError: onErrorMock });
            mockRecognitionInstance.onstart();

            const fakeErr = { error: 'no-speech' };
            mockRecognitionInstance.onerror(fakeErr);

            expect(onErrorMock).toHaveBeenCalledWith(fakeErr);
            expect(SpeechRecognitionService.isRecording()).toBe(false);
        });

        test("13. onEnd callback được kích hoạt và reset isRecording", () => {
            const onEndMock = jest.fn();
            SpeechRecognitionService.start({ onEnd: onEndMock });
            mockRecognitionInstance.onstart();

            mockRecognitionInstance.onend();
            expect(onEndMock).toHaveBeenCalledTimes(1);
            expect(SpeechRecognitionService.isRecording()).toBe(false);
        });
    });

    describe("2. Pronunciation Evaluator Tests (Pure Evaluator)", () => {
        test("14. Exact match: 100% accuracy, correct = true, màu xanh #10b981", () => {
            const res = SpeechRecognitionService.evaluatePronunciation("Hello world", "Hello world");
            expect(res.accuracy).toBe(100);
            expect(res.correct).toBe(true);
            expect(res.correctCount).toBe(2);
            expect(res.formattedHtml).toContain('color:#10b981');
            expect(res.formattedHtml).not.toContain('color:#ef4444');
        });

        test("15. Complete mismatch: 0% accuracy, correct = false, màu đỏ #ef4444", () => {
            const res = SpeechRecognitionService.evaluatePronunciation("Apple banana orange", "Dog cat elephant");
            expect(res.accuracy).toBe(0);
            expect(res.correct).toBe(false);
            expect(res.correctCount).toBe(0);
            expect(res.formattedHtml).toContain('color:#ef4444');
            expect(res.formattedHtml).not.toContain('color:#10b981');
        });

        test("16. Similarity >= 0.72: Chấp nhận lỗi chính tả nhẹ", () => {
            // "elephant" vs "elefant" có similarity > 0.72
            const res = SpeechRecognitionService.evaluatePronunciation("Elephant", "Elefant");
            expect(res.accuracy).toBe(100);
            expect(res.correct).toBe(true);
            expect(res.correctCount).toBe(1);
            expect(res.formattedHtml).toContain('color:#10b981');
        });

        test("17. Substring match: Chấp nhận từ con nằm trong từ nói hoặc ngược lại", () => {
            const res = SpeechRecognitionService.evaluatePronunciation("Cat", "Cats");
            expect(res.accuracy).toBe(100);
            expect(res.correct).toBe(true);
        });

        test("18. Short sentence rule (<= 2 từ): Chỉ cần đúng >= 1 từ là đạt (correct = true)", () => {
            const res = SpeechRecognitionService.evaluatePronunciation("Good morning", "Good night");
            expect(res.accuracy).toBe(50);
            expect(res.correct).toBe(true); // Câu 2 từ đúng 1 từ -> đạt
        });

        test("19. Long sentence rule (> 2 từ): Đạt >= 50% là passing", () => {
            const res = SpeechRecognitionService.evaluatePronunciation("She is a good student", "She is a bad person");
            // 3/5 từ đúng ("She", "is", "a") -> 60%
            expect(res.accuracy).toBe(60);
            expect(res.correct).toBe(true);
        });

        test("20. Below passing threshold: Dưới 50% câu dài là không đạt (correct = false)", () => {
            const res = SpeechRecognitionService.evaluatePronunciation("I want to learn English", "I play game everyday");
            // 2/5 từ được tính ("I" khớp chính xác, "English" chứa ký tự "i") -> 40% < 50% -> correct = false
            expect(res.accuracy).toBe(40);
            expect(res.correct).toBe(false);
        });

        test("21. Empty input: Xử lý an toàn không crash", () => {
            const res1 = SpeechRecognitionService.evaluatePronunciation("", "");
            expect(res1.accuracy).toBe(0);
            expect(res1.correct).toBe(true); // cleanTarget.length = 0 <= 2 và correctCount = 0

            const res2 = SpeechRecognitionService.evaluatePronunciation("Hello", "");
            expect(res2.accuracy).toBe(0);
            expect(res2.correct).toBe(false);
        });

        test("22. Special characters: Loại bỏ dấu câu trước khi so khớp", () => {
            const res = SpeechRecognitionService.evaluatePronunciation("What is this?", "what is this");
            expect(res.accuracy).toBe(100);
            expect(res.correct).toBe(true);
        });
    });
});
