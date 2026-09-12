/**
 * BỘ KIỂM THỬ KIỂM TOÁN VÀ XÁC MINH PHÂN HỆ TIẾNG ANH LỚP 6
 * English Grade 6 Audit Verification & Regression Test Suite
 *
 * Kiểm tra xác thực 10 kịch bản bắt buộc theo tiêu chuẩn Release Candidate:
 * 1. Option index = 0 (xử lý chính xác giá trị 0, không bị coi là falsy)
 * 2. Double-click checkEnglishAnswer (tính Idempotency - không xử lý 2 lần)
 * 3. Double-click nextEnglishQuestion (tính Idempotency - không nhảy cóc câu hỏi)
 * 4. finishIoeExam gọi 2 lần (tính Idempotency - không nhân đôi điểm/XP)
 * 5. options undefined (Runtime safety - không crash .map)
 * 6. listeningText undefined (Runtime safety - không crash chuỗi rỗng)
 * 7. passageText undefined (Runtime safety - không crash chuỗi rỗng)
 * 8. Custom vocab chứa payload XSS (<img onerror=...>, <script>)
 * 9. Microphone error fallback & skip (bỏ qua câu nói an toàn)
 * 10. IOE timer exit/restart cleanup (dọn dẹp triệt để interval tránh rò rỉ)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const Module = require('module');
const EnglishAnswerEvaluator = require('../../js/core/english-answer-evaluator');

function createMockElement(id = '', tagName = 'div') {
    const classSet = new Set();
    const attrs = {};
    const listeners = {};
    return {
        id,
        tagName: tagName.toUpperCase(),
        classList: {
            add: jest.fn((cls) => classSet.add(cls)),
            remove: jest.fn((cls) => classSet.delete(cls)),
            contains: jest.fn((cls) => classSet.has(cls)),
            toggle: jest.fn((cls) => {
                if (classSet.has(cls)) classSet.delete(cls);
                else classSet.add(cls);
            })
        },
        setAttribute: jest.fn((k, v) => { attrs[k] = String(v); }),
        getAttribute: jest.fn((k) => attrs[k] || null),
        removeAttribute: jest.fn((k) => { delete attrs[k]; }),
        style: {},
        innerText: '',
        innerHTML: '',
        textContent: '',
        value: '',
        focus: jest.fn(),
        blur: jest.fn(),
        click: jest.fn(),
        appendChild: jest.fn(),
        addEventListener: jest.fn((event, handler) => {
            listeners[event] = listeners[event] || [];
            listeners[event].push(handler);
        })
    };
}

function loadLiveProductionApp() {
    const appPath = path.resolve(__dirname, '../../js/app.js');
    const source = fs.readFileSync(appPath, 'utf8');
    const appRequire = Module.createRequire(appPath);

    const elements = {};
    const getEl = (id) => {
        if (!elements[id]) {
            elements[id] = createMockElement(id);
        }
        return elements[id];
    };

    const documentMock = {
        readyState: 'complete',
        addEventListener: jest.fn(),
        getElementById: jest.fn((id) => getEl(id)),
        querySelector: jest.fn((sel) => {
            if (sel.startsWith('#')) return getEl(sel.slice(1));
            return createMockElement('', 'div');
        }),
        querySelectorAll: jest.fn(() => []),
        createElement: jest.fn((tag) => createMockElement('', tag)),
        body: createMockElement('body', 'body')
    };

    const windowMock = {
        location: { protocol: 'http:', href: 'http://localhost' },
        addEventListener: jest.fn(),
        safeStorage: { getItem: jest.fn(() => null), setItem: jest.fn(), removeItem: jest.fn() },
        speechSynthesis: { cancel: jest.fn(), speak: jest.fn() },
        EnglishAnswerEvaluator: EnglishAnswerEvaluator,
        generateIoeQuestions: jest.fn(() => []),
        generateEnglishFullExam: jest.fn(() => [])
    };

    // Global mock for Audio & Swal in test environment
    global.Audio = class {
        constructor() { this.volume = 1; }
        play() { return Promise.resolve(); }
        pause() {}
        catch() {}
    };

    global.Swal = {
        fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
        close: jest.fn(),
        showLoading: jest.fn()
    };

    const factory = new Function('window', 'document', 'fetch', 'require', 'console', `${source}; return window.app;`);
    const app = factory(windowMock, documentMock, jest.fn().mockResolvedValue({ ok: true, json: async () => ({}) }), appRequire, console);

    return { app, elements, documentMock, windowMock };
}

describe('BỘ KIỂM THỬ 10 KỊCH BẢN KIỂM TOÁN TIẾNG ANH LỚP 6', () => {

    afterEach(() => {
        jest.clearAllTimers();
    });

    // =========================================================================
    // KỊCH BẢN 1: Option index = 0 (ERR-01)
    // =========================================================================
    test('1. [ERR-01] selectEnglishOption(0) và checkEnglishAnswer xử lý index 0 chính xác, không bị falsy', () => {
        const { app, elements } = loadLiveProductionApp();
        app.currentEnglishQuestions = [{
            id: 'q1',
            type: 'choice',
            questionText: 'Choose the correct answer',
            options: ['Apple', 'Banana', 'Orange', 'Grape'],
            correctAnswer: 'Apple',
            correctIndex: 0
        }];
        app.currentEnglishQuestionIndex = 0;
        app.state = { scores: {}, examSessions: [], englishXp: 100 };

        // Chọn option A (index 0)
        app.selectEnglishOption(0);
        expect(app.currentEnglishStudentAnswer).toBe(0);

        // Nút check answer được kích hoạt, bỏ class disabled
        const checkBtn = elements['btn-eng-check-answer'];
        expect(checkBtn.removeAttribute).toHaveBeenCalledWith('disabled');
        expect(checkBtn.classList.remove).toHaveBeenCalledWith('disabled');

        // Kiểm tra đáp án
        app.checkEnglishAnswer();

        // Banner feedback được kích hoạt với trạng thái feedback-correct
        const banner = elements['bottom-feedback-banner'];
        expect(banner.classList.add).toHaveBeenCalledWith('feedback-correct');
        expect(app.currentEnglishScore).toBe(1);
    });

    // =========================================================================
    // KỊCH BẢN 2: Double-click checkEnglishAnswer Idempotency (NEW-RC-01)
    // =========================================================================
    test('2. [NEW-RC-01] checkEnglishAnswer idempotent: click 2 lần liên tiếp chỉ xử lý 1 lần', () => {
        const { app, elements } = loadLiveProductionApp();
        app.currentEnglishQuestions = [{
            id: 'q1',
            type: 'choice',
            options: ['A', 'B'],
            correctAnswer: 'A',
            correctIndex: 0
        }];
        app.currentEnglishQuestionIndex = 0;
        app.currentEnglishStudentAnswer = 0;
        app.state = { scores: {}, examSessions: [], englishXp: 100 };

        // Lần click 1
        app.checkEnglishAnswer();
        expect(app.isCheckingEnglishAnswer).toBe(true);
        expect(app.currentEnglishScore).toBe(1);

        // Lần click 2 (double-click nhanh trong khi cờ đang bật)
        app.checkEnglishAnswer();
        expect(app.currentEnglishScore).toBe(1); // Không được tăng lên 2
    });

    // =========================================================================
    // KỊCH BẢN 3: Double-click nextEnglishQuestion Idempotency (NEW-RC-02)
    // =========================================================================
    test('3. [NEW-RC-02] nextEnglishQuestion idempotent: click 2 lần liên tiếp không bị nhảy cóc câu hỏi', () => {
        const { app } = loadLiveProductionApp();
        app.currentEnglishQuestions = [
            { id: 'q1', type: 'choice', options: ['A', 'B'], correctAnswer: 'A' },
            { id: 'q2', type: 'choice', options: ['C', 'D'], correctAnswer: 'C' },
            { id: 'q3', type: 'choice', options: ['E', 'F'], correctAnswer: 'E' }
        ];
        app.currentEnglishQuestionIndex = 0;
        app.renderEnglishQuestion = jest.fn();

        // Lần next 1
        app.nextEnglishQuestion();
        expect(app.currentEnglishQuestionIndex).toBe(1);
        expect(app.isTransitioningEnglishQuestion).toBe(true);

        // Lần next 2 (double-click nhanh trong khi cờ chuyển tiếp đang bật)
        app.nextEnglishQuestion();
        expect(app.currentEnglishQuestionIndex).toBe(1); // Vẫn là câu 1, không nhảy sang câu 2
    });

    // =========================================================================
    // KỊCH BẢN 4: finishIoeExam gọi 2 lần Idempotency (DISC-04)
    // =========================================================================
    test('4. [DISC-04] finishIoeExam idempotent: gọi 2 lần chỉ lưu điểm và cộng XP 1 lần', () => {
        const { app } = loadLiveProductionApp();
        app.currentIoeScore = 180;
        app.currentIoeTopicId = 'eng6-t1';
        app.currentIoeCorrectCount = 18;
        app.currentIoeWrongCount = 2;
        app.state = { scores: {}, englishXp: 50 };
        app.saveEnglishState = jest.fn();
        app.renderEnglishIoe = jest.fn();

        // Lần kết thúc 1
        app.finishIoeExam();
        expect(app.ioeExamFinished).toBe(true);
        expect(app.state.englishXp).toBe(50 + 90); // 180 * 0.5 = 90 XP
        expect(app.saveEnglishState).toHaveBeenCalledTimes(1);
        expect(global.Swal.fire).toHaveBeenCalledTimes(1);

        // Lần kết thúc 2 (do timer trễ hoặc người dùng bấm submit lần nữa)
        app.finishIoeExam();
        expect(app.state.englishXp).toBe(140); // Không bị cộng tiếp thành 230 XP
        expect(app.saveEnglishState).toHaveBeenCalledTimes(1);
        expect(global.Swal.fire).toHaveBeenCalledTimes(1);
    });

    // =========================================================================
    // KỊCH BẢN 5: options undefined / null Runtime Safety (DISC-02, DISC-07)
    // =========================================================================
    test('5. [DISC-02, DISC-07] options = undefined / null không làm crash renderEnglishQuestion và renderIoeQuestion', () => {
        const { app } = loadLiveProductionApp();

        // 5.1 Practice Question thiếu options
        app.currentEnglishQuestions = [{
            id: 'q_broken_practice',
            type: 'choice',
            questionText: 'Question without options',
            options: undefined
        }];
        app.currentEnglishQuestionIndex = 0;

        expect(() => {
            app.renderEnglishQuestion();
        }).not.toThrow();

        // 5.2 IOE Question thiếu options (như ioe_leave_alone hoặc ioe_choice thiếu options)
        app.currentIoeQuestions = [{
            id: 'q_broken_ioe',
            type: 'ioe_choice',
            questionText: 'IOE Monkey without options',
            options: null
        }];
        app.currentIoeQuestionIndex = 0;

        expect(() => {
            app.renderIoeQuestion();
        }).not.toThrow();
    });

    // =========================================================================
    // KỊCH BẢN 6: listeningText undefined Runtime Safety (DISC-09)
    // =========================================================================
    test('6. [DISC-09] listeningText = undefined không làm crash renderEnglishQuestion và renderIoeQuestion', () => {
        const { app } = loadLiveProductionApp();

        // Practice listening thiếu listeningText
        app.currentEnglishQuestions = [{
            id: 'q_listen_null',
            type: 'listening',
            questionText: 'Listen and choose',
            listeningText: undefined,
            options: ['cat', 'dog']
        }];
        app.currentEnglishQuestionIndex = 0;

        expect(() => {
            app.renderEnglishQuestion();
        }).not.toThrow();

        // IOE listening thiếu listeningText
        app.currentIoeQuestions = [{
            id: 'q_ioe_listen_null',
            type: 'ioe_dragon',
            questionText: 'Listen to dragon',
            listeningText: undefined,
            options: ['yes', 'no']
        }];
        app.currentIoeQuestionIndex = 0;

        expect(() => {
            app.renderIoeQuestion();
        }).not.toThrow();
    });

    // =========================================================================
    // KỊCH BẢN 7: passageText undefined Runtime Safety (DISC-10)
    // =========================================================================
    test('7. [DISC-10] passageText = undefined không làm crash renderEnglishQuestion', () => {
        const { app } = loadLiveProductionApp();

        app.currentEnglishQuestions = [{
            id: 'q_reading_null',
            type: 'reading_passage',
            questionText: 'Read the passage',
            passageText: undefined,
            options: ['True', 'False']
        }];
        app.currentEnglishQuestionIndex = 0;

        expect(() => {
            app.renderEnglishQuestion();
        }).not.toThrow();
    });

    // =========================================================================
    // KỊCH BẢN 8: Custom Vocab XSS Sanitization (DISC-01)
    // =========================================================================
    test('8. [DISC-01] Payload XSS trong Custom Vocab và Topic Title được lọc escapeHtml an toàn 100%', async () => {
        const { app, elements } = loadLiveProductionApp();

        const xssTitle = '<script>alert("xss-title")</script>';
        const xssWord = '<img src=x onerror=alert("xss-word")>';
        const xssPhonetics = '<b onmouseover=alert("xss-ipa")>/test/</b>';
        const xssTrans = '<iframe src="javascript:alert(1)"></iframe>';

        app.loadCustomTopics = jest.fn().mockResolvedValue(undefined);
        app.customTopics = [{
            id: 'topic_xss_1',
            title: xssTitle,
            created_at: Date.now()
        }];
        app.customVocabulary = [{
            id: 'vocab_1',
            topic_id: 'topic_xss_1',
            word: xssWord,
            phonetics: xssPhonetics,
            translation: xssTrans
        }];
        app.state = { scores: {} };

        await app.renderCustomVocabTab();

        const container = elements['student-vocab-topics-container'];
        expect(container).toBeDefined();

        // Lấy toàn bộ HTML đã render
        const cardHtml = container.appendChild.mock.calls[0][0].innerHTML;

        // KHÔNG ĐƯỢC chứa các tag HTML executable trần trụi
        expect(cardHtml).not.toContain('<script>');
        expect(cardHtml).not.toContain('<img src=x onerror');
        expect(cardHtml).not.toContain('<iframe');

        // Phải được mã hóa thành các thực thể HTML an toàn
        expect(cardHtml).toContain('&lt;script&gt;');
        expect(cardHtml).toContain('&lt;img src=x onerror');
        expect(cardHtml).toContain('&lt;iframe');
    });

    // =========================================================================
    // KỊCH BẢN 9: Microphone error fallback & skip (ERR-05, DISC-05)
    // =========================================================================
    test('9. [ERR-05, DISC-05] Microphone error fallback & skipSpeakingQuestion hoạt động an toàn', () => {
        const { app } = loadLiveProductionApp();

        // 9.1 Test skipSpeakingQuestion chuyển tiếp câu hỏi an toàn
        app.currentEnglishQuestions = [
            { id: 'q_speak', type: 'speaking', speakingText: 'Good morning' },
            { id: 'q_next', type: 'choice', options: ['A', 'B'], correctAnswer: 'A' }
        ];
        app.currentEnglishQuestionIndex = 0;

        app.skipSpeakingQuestion();
        expect(app.currentEnglishStudentAnswer).toEqual({
            correct: false,
            skipped: true,
            accuracy: 0,
            spokenText: '(Bỏ qua)'
        });

        // 9.2 Test EnglishAnswerEvaluator đánh giá speaking khi bị skipped
        const evalResult = EnglishAnswerEvaluator.evaluateSpeaking(
            { correctAnswer: 'Good morning' },
            { skipped: true, accuracy: 0, spokenText: '(Bỏ qua)' }
        );
        expect(evalResult.isCorrect).toBe(false);
        expect(evalResult.explanation).toContain('bỏ qua');
    });

    // =========================================================================
    // KỊCH BẢN 10: IOE Timer Exit & Restart Cleanup (NEW-PERF-01)
    // =========================================================================
    test('10. [NEW-PERF-01] IOE timer được dọn dẹp triệt để (clearInterval + nullify) khi exit hoặc finish', () => {
        const { app, windowMock } = loadLiveProductionApp();

        app.state = { englishHearts: 5, infiniteHearts: false, scores: {}, englishXp: 100 };
        windowMock.generateIoeQuestions = jest.fn(() => [
            { type: 'ioe_fill_blank', questionText: 'c_t', missingChar: 'a' }
        ]);

        // Khởi động IOE Exam
        app.startIoeExam('eng6-t1');
        expect(app.currentIoeTimer).not.toBeNull();

        // Mock Swal confirm cho exitIoeExam
        global.Swal.fire = jest.fn(() => Promise.resolve({ isConfirmed: true }));

        // Thoát exam
        app.exitIoeExam();

        // Kiểm tra sau khi xác nhận thoát, timer đã bị xóa và gán về null
        const swalPromise = global.Swal.fire.mock.results[0].value;
        return swalPromise.then(() => {
            expect(app.currentIoeTimer).toBeNull();
        });
    });

});
